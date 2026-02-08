import type { Product } from "@/interfaces/product";
import {
  getDb,
  STORE_PRODUCT_LIKES,
  STORE_PRODUCT_AFFINITY,
} from "@/lib/db";

function getAffinityKeys(product: { category?: string; tags?: string[] }): string[] {
  const keys: string[] = [];
  if (product.category) keys.push(`category:${product.category}`);
  for (const t of product.tags ?? []) keys.push(t);
  return keys;
}

export async function addProductLike(
  userId: number,
  productId: number,
  product: Pick<Product, "category" | "tags">
): Promise<void> {
  const db = await getDb();
  await db.add(STORE_PRODUCT_LIKES, { userId, productId, timestamp: Date.now() });

  for (const key of getAffinityKeys(product)) {
    const existing = await db.getAllFromIndex(
      STORE_PRODUCT_AFFINITY,
      "by_user_key",
      [userId, key]
    );
    if (existing.length > 0) {
      const row = existing[0] as { id: number; userId: number; key: string; score: number };
      await db.put(STORE_PRODUCT_AFFINITY, {
        id: row.id,
        userId: row.userId,
        key: row.key,
        score: row.score + 1,
      });
    } else {
      await db.add(STORE_PRODUCT_AFFINITY, { userId, key, score: 1 });
    }
  }
}

export async function removeProductLike(userId: number, productId: number): Promise<void> {
  const db = await getDb();
  const rows = await db.getAllFromIndex(STORE_PRODUCT_LIKES, "by_user", userId);
  const row = rows.find((r: { productId: number }) => r.productId === productId) as
    | { id: number }
    | undefined;
  if (row) await db.delete(STORE_PRODUCT_LIKES, row.id);
}

export async function getLikedProductIds(userId: number): Promise<number[]> {
  const db = await getDb();
  const rows = await db.getAllFromIndex(STORE_PRODUCT_LIKES, "by_user", userId);
  return (rows as { productId: number }[]).map((r) => r.productId);
}

export async function getProductAffinityScores(userId: number): Promise<Map<string, number>> {
  const db = await getDb();
  const rows = await db.getAllFromIndex(STORE_PRODUCT_AFFINITY, "by_user", userId);
  const map = new Map<string, number>();
  for (const r of rows as { key: string; score: number }[]) {
    map.set(r.key, (map.get(r.key) ?? 0) + r.score);
  }
  return map;
}

const RECOMMENDED_COUNT = 6;

export function scoreProductsByAffinity(
  productIds: number[],
  productsById: Map<number, Product>,
  affinityScores: Map<string, number>,
  likedSet: Set<number>
): number[] {
  return productIds
    .filter((id) => !likedSet.has(id))
    .map((id) => {
      const product = productsById.get(id);
      const keys = product ? getAffinityKeys(product) : [];
      const score = keys.reduce((sum, k) => sum + (affinityScores.get(k) ?? 0), 0);
      return { id, score };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, RECOMMENDED_COUNT)
    .map((p) => p.id);
}
