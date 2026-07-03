"""Pydantic v2 models for DealRadar.fit API"""

from decimal import Decimal
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, Field


class RetailerInfo(BaseModel):
    id: UUID
    name: str
    slug: str
    logo_url: str | None = None
    website_url: str | None = None


class Product(BaseModel):
    id: UUID
    ean: str | None = None
    name: str
    brand: str | None = None
    category: str | None = None
    subcategory: str | None = None
    image_url: str | None = None
    description: str | None = None
    specifications: dict | None = None
    slug: str
    meta_title: str | None = None
    meta_description: str | None = None
    best_price: Decimal | None = None
    offer_count: int = 0
    created_at: datetime | None = None


class Offer(BaseModel):
    id: UUID
    retailer: RetailerInfo
    price: Decimal
    shipping_cost: Decimal = Decimal("0")
    total_price: Decimal
    product_url: str | None = None
    affiliate_url: str | None = None
    in_stock: bool = True
    badge: str | None = None  # "cheapest" | "best_deal"
    last_updated: datetime | None = None


class ComparisonDetail(BaseModel):
    """THIS IS CRITICAL - DO NOT CHANGE THIS STRUCTURE"""
    cheapest: Offer              # FULL Offer object with retailer info
    most_expensive: Offer        # FULL Offer object with retailer info
    cheapest_price: Decimal      # convenience: cheapest.price
    most_expensive_price: Decimal
    price_range: tuple[Decimal, Decimal]  # (min, max)
    savings_amount: Decimal      # most_expensive.total_price - cheapest.total_price
    savings_percentage: float    # (savings / most_expensive.total_price) * 100
    average_price: Decimal


class ComparisonResponse(BaseModel):
    """Response for /products/{slug}/compare"""
    product: Product
    offers: list[Offer]
    comparison: ComparisonDetail
    total_offers: int
    in_stock_count: int


class ProductListResponse(BaseModel):
    items: list[Product]   # NOT "products" - must be "items"
    total: int
    page: int
    page_size: int


class SearchResponse(BaseModel):
    items: list[Product]


class GoldenProductsResponse(BaseModel):
    items: list[Product]


class ClickRequest(BaseModel):
    product_id: UUID
    offer_id: UUID
    retailer_id: UUID


class ClickResponse(BaseModel):
    success: bool


class HealthResponse(BaseModel):
    status: str
    timestamp: str


class AdminStatsResponse(BaseModel):
    total_products: int
    total_offers: int
    total_retailers: int
    total_clicks: int
    avg_savings_percentage: float
    top_category: str | None = None
