import { getDb, STORE_POST_LIKES, STORE_POST_TAG_SCORES } from "@/lib/db";

export async function addPostLike(
  userId: number,
  postId: number,
  tags: string[]
): Promise<void> {
  const db = await getDb();

  await db.add(STORE_POST_LIKES, { userId, postId, timestamp: Date.now() });

  for (const tag of tags) {
    const existing = await db.getAllFromIndex(
      STORE_POST_TAG_SCORES,
      "by_user_tag",
      [userId, tag]
    );
    if (existing.length > 0) {
      const row = existing[0] as { id: number; userId: number; tag: string; score: number };
      await db.put(STORE_POST_TAG_SCORES, {
        id: row.id,
        userId: row.userId,
        tag: row.tag,
        score: row.score + 1,
      });
    } else {
      await db.add(STORE_POST_TAG_SCORES, { userId, tag, score: 1 });
    }
  }
}

export async function removePostLike(userId: number, postId: number): Promise<void> {
  const db = await getDb();
  const rows = await db.getAllFromIndex(STORE_POST_LIKES, "by_user", userId);
  const row = rows.find((r: { postId: number }) => r.postId === postId) as
    | { id: number }
    | undefined;
  if (row) await db.delete(STORE_POST_LIKES, row.id);
}

export async function getLikedPostIds(userId: number): Promise<number[]> {
  const db = await getDb();
  const rows = await db.getAllFromIndex(STORE_POST_LIKES, "by_user", userId);
  return (rows as { postId: number }[]).map((r) => r.postId);
}

export async function getPostTagScores(userId: number): Promise<Map<string, number>> {
  const db = await getDb();
  const rows = await db.getAllFromIndex(STORE_POST_TAG_SCORES, "by_user", userId);
  const map = new Map<string, number>();
  for (const r of rows as { tag: string; score: number }[]) {
    map.set(r.tag, (map.get(r.tag) ?? 0) + r.score);
  }
  return map;
}

const RECOMMENDED_POSTS_COUNT = 6;

/**
 * Score posts by sum of user's tag scores for each post's tags.
 * Excludes already liked post ids. Returns top N post ids in descending score order.
 */
export function scorePostsByTagAffinity(
  postIds: number[],
  postsById: Map<number, { tags: string[] }>,
  tagScores: Map<string, number>,
  likedSet: Set<number>
): number[] {
  const scored = postIds
    .filter((id) => !likedSet.has(id))
    .map((id) => {
      const post = postsById.get(id);
      const tags = post?.tags ?? [];
      const score = tags.reduce((sum, tag) => sum + (tagScores.get(tag) ?? 0), 0);
      return { id, score };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, RECOMMENDED_POSTS_COUNT)
    .map((p) => p.id);

  return scored;
}
