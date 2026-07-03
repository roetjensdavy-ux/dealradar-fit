import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";
import { useDebounce } from "./useDebounce";

export function useSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => (debouncedQuery.length >= 2 ? api.searchProducts(debouncedQuery, 8) : null),
    enabled: debouncedQuery.length >= 2,
  });

  return {
    query,
    setQuery,
    results: data?.items ?? [],
    isLoading,
    hasQuery: debouncedQuery.length >= 2,
  };
}
