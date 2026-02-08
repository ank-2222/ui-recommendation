import { getDeviceId } from "@/lib/deviceId";
import { getDb, STORE_USER_SELECTIONS } from "@/lib/db";

const RECOMMENDED_TOP_COUNT = 3;

export async function recordUserSelection(selectedUserId: number): Promise<void> {
  const db = await getDb();
  await db.add(STORE_USER_SELECTIONS, {
    deviceId: getDeviceId(),
    selectedUserId,
    timestamp: Date.now(),
  });
}

export async function getRecommendedUserIds(): Promise<number[]> {
  const deviceId = getDeviceId();
  const db = await getDb();
  const all = await db.getAllFromIndex(
    STORE_USER_SELECTIONS,
    "by_device",
    deviceId
  );

  // Count by selectedUserId
  const countByUser = new Map<number, number>();
  for (const row of all) {
    const id = row.selectedUserId;
    countByUser.set(id, (countByUser.get(id) ?? 0) + 1);
  }

  // Sort by count desc, take top N
  const sorted = [...countByUser.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([userId]) => userId)
    .slice(0, RECOMMENDED_TOP_COUNT);

  return sorted;
}
