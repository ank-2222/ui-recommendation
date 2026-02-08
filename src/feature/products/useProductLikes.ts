import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/interfaces/product";
import {
  addProductLike,
  getLikedProductIds,
  getProductAffinityScores,
  removeProductLike,
} from "@/store/productStore";

export function useProductLikes(userId: number | undefined) {
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
        getLikedProductIds(userId),
        getProductAffinityScores(userId),
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
    async (product: Product, currentlyLiked: boolean) => {
      if (userId == null) return;

      if (currentlyLiked) {
        await removeProductLike(userId, product.id);
        setLikedIds((prev) => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
      } else {
        await addProductLike(userId, product.id, product);
        setLikedIds((prev) => new Set(prev).add(product.id));
        setAffinityScores((prev) => {
          const next = new Map(prev);
          const keys = [product.category ? `category:${product.category}` : "", ...(product.tags ?? [])].filter(Boolean);
          for (const k of keys) next.set(k, (next.get(k) ?? 0) + 1);
          return next;
        });
      }
    },
    [userId]
  );

  return { likedIds, affinityScores, toggleLike, isLoading };
}
