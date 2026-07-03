export interface RetailerInfo {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
}

export interface Product {
  id: string;
  ean: string | null;
  name: string;
  brand: string | null;
  category: string | null;
  subcategory: string | null;
  image_url: string | null;
  description: string | null;
  specifications: Record<string, unknown> | null;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  best_price: number | null;
  offer_count: number;
  created_at: string | null;
}

export interface Offer {
  id: string;
  retailer: RetailerInfo;
  price: number;
  shipping_cost: number;
  total_price: number;
  product_url: string | null;
  affiliate_url: string | null;
  in_stock: boolean;
  badge: "cheapest" | "best_deal" | null;
  last_updated: string | null;
}

export interface ComparisonDetail {
  cheapest: Offer;
  most_expensive: Offer;
  cheapest_price: number;
  most_expensive_price: number;
  price_range: [number, number];
  savings_amount: number;
  savings_percentage: number;
  average_price: number;
}

export interface ComparisonResponse {
  product: Product;
  offers: Offer[];
  comparison: ComparisonDetail;
  total_offers: number;
  in_stock_count: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}
