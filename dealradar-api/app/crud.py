"""Database CRUD operations for DealRadar.fit"""

from decimal import Decimal
from uuid import UUID

from app.database import fetch, fetchrow, fetchval, execute


# ── Product queries ──────────────────────────────────────────────────────────

async def get_products(
    page: int = 1,
    page_size: int = 24,
    category: str = "",
    brand: str = "",
    sort: str = "price_asc",
) -> tuple[list[dict], int]:
    """Get paginated products with best_price and offer_count from offers."""

    # Build WHERE clause
    conditions = []
    params = []
    if category:
        conditions.append("p.category = $" + str(len(params) + 1))
        params.append(category)
    if brand:
        conditions.append("p.brand = $" + str(len(params) + 1))
        params.append(brand)

    where_clause = "WHERE " + " AND ".join(conditions) if conditions else ""

    # Sort mapping
    sort_map = {
        "price_asc": "best_price ASC NULLS LAST",
        "price_desc": "best_price DESC NULLS LAST",
        "name_asc": "p.name ASC",
        "newest": "p.created_at DESC NULLS LAST",
    }
    order_by = sort_map.get(sort, "best_price ASC NULLS LAST")

    # Count total
    count_sql = f"""
        SELECT COUNT(*) FROM products p
        {where_clause}
    """
    total = await fetchval(count_sql, *params) or 0

    # Fetch products with aggregated offer data
    offset = (page - 1) * page_size
    sql = f"""
        SELECT
            p.id,
            p.ean,
            p.name,
            p.brand,
            p.category,
            p.subcategory,
            p.image_url,
            p.description,
            p.specifications,
            p.slug,
            p.meta_title,
            p.meta_description,
            p.created_at,
            MIN(o.price) AS best_price,
            COUNT(o.id)::int AS offer_count
        FROM products p
        LEFT JOIN offers o ON o.product_id = p.id
        {where_clause}
        GROUP BY p.id
        ORDER BY {order_by}
        LIMIT ${len(params) + 1} OFFSET ${len(params) + 2}
    """
    params.append(page_size)
    params.append(offset)
    rows = await fetch(sql, *params)
    return [dict(r) for r in rows], total


async def get_product_by_slug(slug: str) -> dict | None:
    """Get a single product by slug with best_price and offer_count."""
    row = await fetchrow("""
        SELECT
            p.id,
            p.ean,
            p.name,
            p.brand,
            p.category,
            p.subcategory,
            p.image_url,
            p.description,
            p.specifications,
            p.slug,
            p.meta_title,
            p.meta_description,
            p.created_at,
            MIN(o.price) AS best_price,
            COUNT(o.id)::int AS offer_count
        FROM products p
        LEFT JOIN offers o ON o.product_id = p.id
        WHERE p.slug = $1
        GROUP BY p.id
    """, slug)
    return dict(row) if row else None


async def get_product_offers(product_id: UUID) -> list[dict]:
    """Get all offers for a product with retailer info."""
    rows = await fetch("""
        SELECT
            o.id,
            o.price,
            o.shipping_cost,
            o.total_price,
            o.product_url,
            o.affiliate_url,
            o.in_stock,
            o.last_updated,
            r.id AS retailer_id,
            r.name AS retailer_name,
            r.slug AS retailer_slug,
            r.logo_url AS retailer_logo_url,
            r.website_url AS retailer_website_url
        FROM offers o
        JOIN retailers r ON r.id = o.retailer_id
        WHERE o.product_id = $1
        ORDER BY o.total_price ASC
    """, product_id)
    return [dict(r) for r in rows]


async def search_products(query: str, limit: int = 10) -> list[dict]:
    """Search products using PostgreSQL full-text search."""
    rows = await fetch("""
        SELECT
            p.id,
            p.ean,
            p.name,
            p.brand,
            p.category,
            p.subcategory,
            p.image_url,
            p.description,
            p.specifications,
            p.slug,
            p.meta_title,
            p.meta_description,
            p.created_at,
            MIN(o.price) AS best_price,
            COUNT(o.id)::int AS offer_count
        FROM products p
        LEFT JOIN offers o ON o.product_id = p.id
        WHERE to_tsvector('dutch', p.name || ' ' || COALESCE(p.brand, '') || ' ' || COALESCE(p.description, ''))
              @@ plainto_tsquery('dutch', $1)
        GROUP BY p.id
        ORDER BY p.name
        LIMIT $2
    """, query, limit)
    return [dict(r) for r in rows]


async def get_golden_products(limit: int = 20) -> list[dict]:
    """Get 'golden' products — those with most offers or highest savings."""
    rows = await fetch("""
        WITH product_stats AS (
            SELECT
                p.id,
                p.ean,
                p.name,
                p.brand,
                p.category,
                p.subcategory,
                p.image_url,
                p.description,
                p.specifications,
                p.slug,
                p.meta_title,
                p.meta_description,
                p.created_at,
                MIN(o.price) AS best_price,
                COUNT(o.id)::int AS offer_count,
                MAX(o.total_price) - MIN(o.total_price) AS savings
            FROM products p
            JOIN offers o ON o.product_id = p.id
            GROUP BY p.id
            HAVING COUNT(o.id) >= 2
        )
        SELECT *
        FROM product_stats
        ORDER BY (savings * offer_count) DESC
        LIMIT $1
    """, limit)
    return [dict(r) for r in rows]


# ── Click tracking ───────────────────────────────────────────────────────────

async def log_click(product_id: UUID, offer_id: UUID, retailer_id: UUID) -> None:
    """Log an affiliate click."""
    await execute("""
        INSERT INTO clicks (product_id, offer_id, retailer_id)
        VALUES ($1, $2, $3)
    """, product_id, offer_id, retailer_id)


# ── Admin stats ──────────────────────────────────────────────────────────────

async def get_admin_stats() -> dict:
    """Get dashboard statistics."""
    total_products = await fetchval("SELECT COUNT(*) FROM products") or 0
    total_offers = await fetchval("SELECT COUNT(*) FROM offers") or 0
    total_retailers = await fetchval("SELECT COUNT(*) FROM retailers") or 0
    total_clicks = await fetchval("SELECT COUNT(*) FROM clicks") or 0

    # Average savings percentage across products with 2+ offers
    avg_savings = await fetchval("""
        SELECT COALESCE(AVG((max_price - min_price) / NULLIF(max_price, 0) * 100), 0)
        FROM (
            SELECT
                MIN(total_price) AS min_price,
                MAX(total_price) AS max_price
            FROM offers
            GROUP BY product_id
            HAVING COUNT(*) >= 2
        ) t
    """) or 0.0

    top_category = await fetchval("""
        SELECT category FROM products
        WHERE category IS NOT NULL
        GROUP BY category
        ORDER BY COUNT(*) DESC
        LIMIT 1
    """)

    return {
        "total_products": total_products,
        "total_offers": total_offers,
        "total_retailers": total_retailers,
        "total_clicks": total_clicks,
        "avg_savings_percentage": round(float(avg_savings), 2),
        "top_category": top_category,
    }


# ── Sitemap / SEO ────────────────────────────────────────────────────────────

async def get_all_product_slugs() -> list[str]:
    """Get all product slugs for sitemap generation."""
    rows = await fetch("SELECT slug FROM products ORDER BY name")
    return [r["slug"] for r in rows]
