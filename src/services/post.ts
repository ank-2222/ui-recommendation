import { postsApi } from "@/API/Api";
import type { Post } from "@/interfaces/post";

type PostsResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};

export async function getPostsService({
  limit,
  skip,
}: {
  limit: number;
  skip: number;
}): Promise<PostsResponse> {
  const res = await fetch(`${postsApi}?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}
