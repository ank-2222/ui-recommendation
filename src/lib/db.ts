import { openDB } from "idb";

const DB_NAME = "ui-recommendation-db";
const DB_VERSION = 3;

export const STORE_USER_SELECTIONS = "userSelections";
export const STORE_POST_LIKES = "postLikes";
export const STORE_POST_TAG_SCORES = "postTagScores";
export const STORE_RECIPE_LIKES = "recipeLikes";
export const STORE_RECIPE_AFFINITY = "recipeAffinity";
export const STORE_PRODUCT_LIKES = "productLikes";
export const STORE_PRODUCT_AFFINITY = "productAffinity";

export type UserSelectionRow = {
  deviceId: string;
  selectedUserId: number;
  timestamp: number;
};

export type PostLikeRow = {
  userId: number;
  postId: number;
  timestamp: number;
};

export type PostTagScoreRow = {
  userId: number;
  tag: string;
  score: number;
};

async function createDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const userStore = db.createObjectStore(STORE_USER_SELECTIONS, {
          keyPath: "id",
          autoIncrement: true,
        });
        userStore.createIndex("by_device", "deviceId");
        userStore.createIndex("by_device_user", ["deviceId", "selectedUserId"]);
        userStore.createIndex("by_timestamp", "timestamp");
      }
      if (oldVersion < 2) {
        const likesStore = db.createObjectStore(STORE_POST_LIKES, {
          keyPath: "id",
          autoIncrement: true,
        });
        likesStore.createIndex("by_user", "userId");
        likesStore.createIndex("by_user_post", ["userId", "postId"]);

        const tagStore = db.createObjectStore(STORE_POST_TAG_SCORES, {
          keyPath: "id",
          autoIncrement: true,
        });
        tagStore.createIndex("by_user", "userId");
        tagStore.createIndex("by_user_tag", ["userId", "tag"]);
      }
      if (oldVersion < 3) {
        const recipeLikes = db.createObjectStore(STORE_RECIPE_LIKES, {
          keyPath: "id",
          autoIncrement: true,
        });
        recipeLikes.createIndex("by_user", "userId");
        recipeLikes.createIndex("by_user_recipe", ["userId", "recipeId"]);

        const recipeAffinity = db.createObjectStore(STORE_RECIPE_AFFINITY, {
          keyPath: "id",
          autoIncrement: true,
        });
        recipeAffinity.createIndex("by_user", "userId");
        recipeAffinity.createIndex("by_user_key", ["userId", "key"]);

        const productLikes = db.createObjectStore(STORE_PRODUCT_LIKES, {
          keyPath: "id",
          autoIncrement: true,
        });
        productLikes.createIndex("by_user", "userId");
        productLikes.createIndex("by_user_product", ["userId", "productId"]);

        const productAffinity = db.createObjectStore(STORE_PRODUCT_AFFINITY, {
          keyPath: "id",
          autoIncrement: true,
        });
        productAffinity.createIndex("by_user", "userId");
        productAffinity.createIndex("by_user_key", ["userId", "key"]);
      }
    },
  });
}

let dbPromise: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!dbPromise) dbPromise = createDb();
  return dbPromise;
}
