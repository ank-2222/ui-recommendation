import { useCallback, useEffect, useState } from "react";
import {
  addPostLike,
  getLikedPostIds,
  getPostTagScores,
  removePostLike,
} from "@/store/postStore";

export function usePostLikes(userId: number | undefined) {
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [tagScores, setTagScores] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (userId == null) {
      setLikedIds(new Set());
      setTagScores(new Map());
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [ids, scores] = await Promise.all([
        getLikedPostIds(userId),
        getPostTagScores(userId),
      ]);
      setLikedIds(new Set(ids));
      setTagScores(scores);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleLike = useCallback(
    async (postId: number, tags: string[], currentlyLiked: boolean) => {
      if (userId == null) return;

      if (currentlyLiked) {
        await removePostLike(userId, postId);
        setLikedIds((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      } else {
        await addPostLike(userId, postId, tags);
        setLikedIds((prev) => new Set(prev).add(postId));
        setTagScores((prev) => {
          const next = new Map(prev);
          for (const tag of tags) {
            next.set(tag, (next.get(tag) ?? 0) + 1);
          }
          return next;
        });
      }
    },
    [userId]
  );

  return { likedIds, tagScores, toggleLike, isLoading, refresh: load };
}
