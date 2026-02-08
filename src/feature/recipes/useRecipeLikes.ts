import { useCallback, useEffect, useState } from "react";
import type { Recipe } from "@/interfaces/recipe";
import {
  addRecipeLike,
  getLikedRecipeIds,
  getRecipeAffinityScores,
  removeRecipeLike,
} from "@/store/recipeStore";

export function useRecipeLikes(userId: number | undefined) {
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [affinityScores, setAffinityScores] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (userId == null) {
      setLikedIds(new Set());
      setAffinityScores(new Map());
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [ids, scores] = await Promise.all([
        getLikedRecipeIds(userId),
        getRecipeAffinityScores(userId),
      ]);
      setLikedIds(new Set(ids));
      setAffinityScores(scores);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleLike = useCallback(
    async (recipe: Recipe, currentlyLiked: boolean) => {
      if (userId == null) return;

      if (currentlyLiked) {
        await removeRecipeLike(userId, recipe.id);
        setLikedIds((prev) => {
          const next = new Set(prev);
          next.delete(recipe.id);
          return next;
        });
      } else {
        await addRecipeLike(userId, recipe.id, recipe);
        setLikedIds((prev) => new Set(prev).add(recipe.id));
        setAffinityScores((prev) => {
          const next = new Map(prev);
          const keys = [...(recipe.tags ?? []), recipe.cuisine ? `cuisine:${recipe.cuisine}` : "", ...(recipe.mealType ?? []).map((m) => `meal:${m}`)].filter(Boolean);
          for (const k of keys) next.set(k, (next.get(k) ?? 0) + 1);
          return next;
        });
      }
    },
    [userId]
  );

  return { likedIds, affinityScores, toggleLike, isLoading };
}
