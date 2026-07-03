import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";
import type { Product } from "../types";

export function useProduct(slug: string | undefined) {
  return useQuery<Product | null, Error>({
    queryKey: ["product", slug],
    queryFn: () => (slug ? api.getProduct(slug) : null),
    enabled: !!slug,
  });
}
