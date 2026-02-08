import { useQuery } from "@tanstack/react-query";
import { getRecipesService } from "@/services/recipe";

const DEFAULT_LIMIT = 10;

export function useGetRecipes(limit = DEFAULT_LIMIT, skip: number) {
  return useQuery({
    queryKey: ["recipes", limit, skip],
    queryFn: () => getRecipesService({ limit, skip }),
  });
}
