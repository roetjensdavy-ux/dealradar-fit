import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";

export function useComparison(slug: string | undefined) {
  return useQuery({
    queryKey: ["comparison", slug],
    queryFn: () => (slug ? api.getComparison(slug) : null),
    enabled: !!slug,
  });
}
