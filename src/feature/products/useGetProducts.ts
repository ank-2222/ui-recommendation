import { useQuery } from "@tanstack/react-query";
import { getProductsService } from "@/services/product";

const DEFAULT_LIMIT = 10;

export function useGetProducts(limit = DEFAULT_LIMIT, skip: number) {
  return useQuery({
    queryKey: ["products", limit, skip],
    queryFn: () => getProductsService({ limit, skip }),
  });
}
