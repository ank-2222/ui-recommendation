import type { Recipe } from "@/interfaces/recipe";
import {
  getDb,
  STORE_RECIPE_LIKES,
  STORE_RECIPE_AFFINITY,
} from "@/lib/db";

function getAffinityKeys(recipe: { tags?: string[]; cuisine?: string; mealType?: string[] }): string[] {
  const keys: string[] = [...(recipe.tags ?? [])];
  if (recipe.cuisine) keys.push(`cuisine:${recipe.cuisine}`);
  for (const m of recipe.mealType ?? []) keys.push(`meal:${m}`);
  return keys;
}

export async function addRecipeLike(
  userId: number,
  recipeId: number,
  recipe: Pick<Recipe, "tags" | "cuisine" | "mealType">
): Promise<void> {
  const db = await getDb();
  await db.add(STORE_RECIPE_LIKES, { userId, recipeId, timestamp: Date.now() });

  for (const key of getAffinityKeys(recipe)) {
    const existing = await db.getAllFromIndex(
      STORE_RECIPE_AFFINITY,
      "by_user_key",
      [userId, key]
    );
    if (existing.length > 0) {
      const row = existing[0] as { id: number; userId: number; key: string; score: number };
      await db.put(STORE_RECIPE_AFFINITY, {
        id: row.id,
        userId: row.userId,
        key: row.key,
        score: row.score + 1,
      });
    } else {
      await db.add(STORE_RECIPE_AFFINITY, { userId, key, score: 1 });
    }
  }
}

export async function removeRecipeLike(userId: number, recipeId: number): Promise<void> {
  const db = await getDb();
  const rows = await db.getAllFromIndex(STORE_RECIPE_LIKES, "by_user", userId);
  const row = rows.find((r: { recipeId: number }) => r.recipeId === recipeId) as
    | { id: number }
    | undefined;
  if (row) await db.delete(STORE_RECIPE_LIKES, row.id);
}

export async function getLikedRecipeIds(userId: number): Promise<number[]> {
  const db = await getDb();
  const rows = await db.getAllFromIndex(STORE_RECIPE_LIKES, "by_user", userId);
  return (rows as { recipeId: number }[]).map((r) => r.recipeId);
}

export async function getRecipeAffinityScores(userId: number): Promise<Map<string, number>> {
  const db = await getDb();
  const rows = await db.getAllFromIndex(STORE_RECIPE_AFFINITY, "by_user", userId);
  const map = new Map<string, number>();
  for (const r of rows as { key: string; score: number }[]) {
    map.set(r.key, (map.get(r.key) ?? 0) + r.score);
  }
  return map;
}

const RECOMMENDED_COUNT = 6;

export function scoreRecipesByAffinity(
  recipeIds: number[],
  recipesById: Map<number, Recipe>,
  affinityScores: Map<string, number>,
  likedSet: Set<number>
): number[] {
  return recipeIds
    .filter((id) => !likedSet.has(id))
    .map((id) => {
      const recipe = recipesById.get(id);
      const keys = recipe ? getAffinityKeys(recipe) : [];
      const score = keys.reduce((sum, k) => sum + (affinityScores.get(k) ?? 0), 0);
      return { id, score };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, RECOMMENDED_COUNT)
    .map((p) => p.id);
}
