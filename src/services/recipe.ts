import { recipesApi } from "@/API/Api";
import type { Recipe } from "@/interfaces/recipe";

type RecipesResponse = {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
};

export async function getRecipesService({
  limit,
  skip,
}: {
  limit: number;
  skip: number;
}): Promise<RecipesResponse> {
  const res = await fetch(`${recipesApi}?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}
