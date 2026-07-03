import type { Product, PaginatedResponse, ComparisonResponse } from "../types";

const API_BASE = "/api/v1";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getProducts: (params?: { page?: number; page_size?: number; category?: string; brand?: string; sort?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));
    if (params?.category) qs.set("category", params.category);
    if (params?.brand) qs.set("brand", params.brand);
    if (params?.sort) qs.set("sort", params.sort);
    return fetchApi<PaginatedResponse<Product>>(`/products?${qs}`);
  },
  getProduct: (slug: string) => fetchApi<Product>(`/products/${slug}`),
  getComparison: (slug: string) => fetchApi<ComparisonResponse>(`/products/${slug}/compare`),
  searchProducts: (q: string, limit = 10) => fetchApi<PaginatedResponse<Product>>(`/products/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  getGoldenProducts: () => fetchApi<{ items: Product[] }>("/golden-products"),
  trackClick: (data: { product_id: string; offer_id: string; retailer_id: string }) =>
    fetchApi<{ success: boolean }>("/clicks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
};
