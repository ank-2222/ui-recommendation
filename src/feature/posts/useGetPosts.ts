import { useQuery } from "@tanstack/react-query";
import { getPostsService } from "@/services/post";

const DEFAULT_LIMIT = 10;

export function useGetPosts(limit = DEFAULT_LIMIT, skip: number) {
  return useQuery({
    queryKey: ["posts", limit, skip],
    queryFn: () => getPostsService({ limit, skip }),
  });
}
