"""DealRadar.fit API — FastAPI entry point"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from decimal import Decimal
from uuid import UUID

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from app.cache import close_redis, get_cache, get_redis, json_dumps, json_loads, set_cache
from app.crud import (
    get_admin_stats,
    get_all_product_slugs,
    get_golden_products,
    get_product_by_slug,
    get_product_offers,
    get_products,
    log_click,
    search_products,
)
from app.database import close_pool
from app.models import (
    AdminStatsResponse,
    ClickRequest,
    ClickResponse,
    ComparisonDetail,
    ComparisonResponse,
    GoldenProductsResponse,
    HealthResponse,
    Offer,
    Product,
    ProductListResponse,
    RetailerInfo,
    SearchResponse,
)
from app.seed import seed_all


# ── Lifespan ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown hooks."""
    # Startup: warm up DB pool
    from app.database import get_pool
    await get_pool()
    await get_redis()
    yield
    # Shutdown
    await close_pool()
    await close_redis()


# ── App instance ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="DealRadar.fit API",
    description="Prijsvergelijkingsplatform API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helper functions ─────────────────────────────────────────────────────────

def _to_decimal(v) -> Decimal | None:
    """Safely convert a value to Decimal."""
    if v is None:
        return None
    if isinstance(v, Decimal):
        return v
    return Decimal(str(v))


def _build_product(row: dict) -> Product:
    """Build a Product Pydantic model from a DB row."""
    return Product(
        id=row["id"],
        ean=row.get("ean"),
        name=row["name"],
        brand=row.get("brand"),
        category=row.get("category"),
        subcategory=row.get("subcategory"),
        image_url=row.get("image_url"),
        description=row.get("description"),
        specifications=row.get("specifications"),
        slug=row["slug"],
        meta_title=row.get("meta_title"),
        meta_description=row.get("meta_description"),
        best_price=_to_decimal(row.get("best_price")),
        offer_count=row.get("offer_count", 0),
        created_at=row.get("created_at"),
    )


def _build_retailer(row: dict) -> RetailerInfo:
    """Build a RetailerInfo Pydantic model from a DB row."""
    return RetailerInfo(
        id=row.get("retailer_id") or row.get("id"),
        name=row.get("retailer_name") or row.get("name"),
        slug=row.get("retailer_slug") or row.get("slug"),
        logo_url=row.get("retailer_logo_url") or row.get("logo_url"),
        website_url=row.get("retailer_website_url") or row.get("website_url"),
    )


def _build_offer(row: dict, badge: str | None = None) -> Offer:
    """Build an Offer Pydantic model from a DB row."""
    return Offer(
        id=row["id"],
        retailer=_build_retailer(row),
        price=_to_decimal(row["price"]),
        shipping_cost=_to_decimal(row.get("shipping_cost")) or Decimal("0"),
        total_price=_to_decimal(row["total_price"]),
        product_url=row.get("product_url"),
        affiliate_url=row.get("affiliate_url"),
        in_stock=row.get("in_stock", True),
        badge=badge,
        last_updated=row.get("last_updated"),
    )


# ── Health ───────────────────────────────────────────────────────────────────

@app.get("/api/v1/health", response_model=HealthResponse)
async def health():
    """Health check endpoint."""
    return HealthResponse(
        status="ok",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


# ── Products list ────────────────────────────────────────────────────────────

@app.get("/api/v1/products", response_model=ProductListResponse)
async def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100),
    category: str = Query(""),
    brand: str = Query(""),
    sort: str = Query("price_asc"),
):
    """Get paginated product list with filtering and sorting."""
    try:
        rows, total = await get_products(
            page=page,
            page_size=page_size,
            category=category,
            brand=brand,
            sort=sort,
        )
        items = [_build_product(r) for r in rows]
        return ProductListResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Product detail ───────────────────────────────────────────────────────────

@app.get("/api/v1/products/{slug}", response_model=Product)
async def product_detail(slug: str):
    """Get a single product by slug."""
    try:
        row = await get_product_by_slug(slug)
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")
        return _build_product(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Product comparison ⚡ CRITICAL ──────────────────────────────────────────

@app.get("/api/v1/products/{slug}/compare", response_model=ComparisonResponse)
async def product_compare(slug: str):
    """Get full comparison for a product — all offers with cheapest/most_expensive."""
    try:
        # 1. Get product
        product_row = await get_product_by_slug(slug)
        if not product_row:
            raise HTTPException(status_code=404, detail="Product not found")

        product = _build_product(product_row)

        # 2. Get ALL offers for this product (JOIN with retailers)
        offer_rows = await get_product_offers(product.id)
        if not offer_rows:
            raise HTTPException(status_code=404, detail="No offers found for this product")

        # 3. Build Offer objects, find cheapest and most expensive
        offers: list[Offer] = []
        cheapest_row = offer_rows[0]  # Already sorted by total_price ASC
        most_expensive_row = offer_rows[-1]

        for row in offer_rows:
            badge = "cheapest" if row["id"] == cheapest_row["id"] else None
            offers.append(_build_offer(row, badge=badge))

        cheapest_offer = _build_offer(cheapest_row, badge="cheapest")
        most_expensive_offer = _build_offer(most_expensive_row, badge=None)

        # 4. Calculate stats
        prices = [_to_decimal(r["total_price"]) for r in offer_rows]
        total_offers = len(offer_rows)
        in_stock_count = sum(1 for r in offer_rows if r.get("in_stock"))

        min_price = min(prices)
        max_price = max(prices)
        avg_price = sum(prices) / len(prices)

        savings_amount = max_price - min_price
        savings_percentage = float((savings_amount / max_price) * 100) if max_price else 0.0

        # 5. Build ComparisonDetail with FULL Offer objects
        comparison = ComparisonDetail(
            cheapest=cheapest_offer,              # FULL Offer object
            most_expensive=most_expensive_offer,  # FULL Offer object
            cheapest_price=cheapest_offer.price,
            most_expensive_price=most_expensive_offer.price,
            price_range=(min_price, max_price),
            savings_amount=savings_amount,
            savings_percentage=round(savings_percentage, 2),
            average_price=avg_price,
        )

        return ComparisonResponse(
            product=product,
            offers=offers,
            comparison=comparison,
            total_offers=total_offers,
            in_stock_count=in_stock_count,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Search (Redis cached) ────────────────────────────────────────────────────

@app.get("/api/v1/products/search", response_model=SearchResponse)
async def product_search(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
):
    """Search products with Redis caching (TTL 300s)."""
    cache_key = f"search:{q.lower()}:{limit}"

    try:
        # Try cache first
        cached = await get_cache(cache_key)
        if cached:
            data = json_loads(cached)
            return SearchResponse(items=[Product(**p) for p in data])
    except Exception:
        pass  # Cache miss or error, continue to DB

    try:
        rows = await search_products(q, limit)
        items = [_build_product(r) for r in rows]

        # Cache result
        try:
            cache_data = [item.model_dump(mode="json") for item in items]
            await set_cache(cache_key, json_dumps(cache_data), ttl=300)
        except Exception:
            pass  # Cache write failure is non-critical

        return SearchResponse(items=items)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Golden products ──────────────────────────────────────────────────────────

@app.get("/api/v1/golden-products", response_model=GoldenProductsResponse)
async def golden_products(limit: int = Query(20, ge=1, le=50)):
    """Get golden products — most offers or highest savings."""
    try:
        rows = await get_golden_products(limit)
        items = [_build_product(r) for r in rows]
        return GoldenProductsResponse(items=items)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Click tracking ───────────────────────────────────────────────────────────

@app.post("/api/v1/clicks", response_model=ClickResponse)
async def track_click(body: ClickRequest):
    """Log an affiliate click."""
    try:
        await log_click(body.product_id, body.offer_id, body.retailer_id)
        return ClickResponse(success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Sitemap ──────────────────────────────────────────────────────────────────

@app.get("/api/v1/sitemap.xml", response_class=PlainTextResponse)
async def sitemap():
    """Dynamic XML sitemap."""
    try:
        slugs = await get_all_product_slugs()
        base_url = "https://dealradar.fit"

        xml_parts = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            f"  <url><loc>{base_url}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>",
            f"  <url><loc>{base_url}/products</loc><changefreq>daily</changefreq><priority>0.9</priority></url>",
        ]

        for slug in slugs:
            xml_parts.append(
                f"  <url><loc>{base_url}/products/{slug}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>"
            )

        xml_parts.append("</urlset>")
        return "\n".join(xml_parts)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Robots.txt ───────────────────────────────────────────────────────────────

@app.get("/api/v1/robots.txt", response_class=PlainTextResponse)
async def robots_txt():
    """Robots directives."""
    return (
        "User-agent: *\n"
        "Allow: /\n"
        "Sitemap: https://dealradar.fit/api/v1/sitemap.xml\n"
    )


# ── Admin ────────────────────────────────────────────────────────────────────

@app.get("/api/v1/admin/stats", response_model=AdminStatsResponse)
async def admin_stats():
    """Get admin dashboard statistics."""
    try:
        stats = await get_admin_stats()
        return AdminStatsResponse(**stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/admin/seed")
async def admin_seed():
    """Seed mock data into the database."""
    try:
        result = await seed_all()
        return {"success": True, **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Run locally ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
