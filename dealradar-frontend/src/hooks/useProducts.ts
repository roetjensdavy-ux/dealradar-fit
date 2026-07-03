import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";
import type { Product } from "../types";

interface UseProductsParams {
  page?: number;
  page_size?: number;
  category?: string;
  brand?: string;
  sort?: string;
}

export function useProducts(params: UseProductsParams = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => api.getProducts(params),
    select: (data): { products: Product[]; total: number; page: number; page_size: number } => ({
      products: data.items,
      total: data.total,
      page: data.page,
      page_size: data.page_size,
    }),
  });
}
