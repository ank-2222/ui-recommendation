import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetPosts } from "@/feature/posts/useGetPosts";
import { usePostLikes } from "@/feature/posts/usePostLikes";
import { scorePostsByTagAffinity } from "@/store/postStore";
import type { Post } from "@/interfaces/post";
import PostCard from "./components/PostCard";
import { InfoNote } from "@/components/InfoNote";

const LIMIT = 10;

export default function Posts() {
  const { currentUser } = useAuth();
  const [offset, setOffset] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [recommendedIds, setRecommendedIds] = useState<number[]>([]);

  const { data, isLoading, isFetching } = useGetPosts(LIMIT, offset);
  const { likedIds, tagScores, toggleLike, isLoading: likesLoading } =
    usePostLikes(currentUser?.id);

  useEffect(() => {
    if (data?.posts?.length) {
      setPosts((prev) => {
        const byId = new Map(prev.map((p) => [p.id, p]));
        for (const p of data.posts) byId.set(p.id, p);
        return [...byId.values()];
      });
    }
  }, [data]);

  const likedSet = useMemo(() => likedIds, [likedIds]);
  const postsById = useMemo(() => new Map(posts.map((p) => [p.id, p])), [posts]);

  const computeRecommended = useCallback(async () => {
    if (posts.length === 0 || likesLoading) return;
    const ids = scorePostsByTagAffinity(
      posts.map((p) => p.id),
      postsById,
      tagScores,
      likedSet
    );
    setRecommendedIds(ids);
  }, [posts, postsById, tagScores, likedSet, likesLoading]);

  useEffect(() => {
    computeRecommended();
  }, [computeRecommended]);

  const recommendedPosts = useMemo(
    () =>
      recommendedIds
        .map((id) => postsById.get(id))
        .filter((p): p is Post => p != null),
    [recommendedIds, postsById]
  );

  const handleToggleLike = (post: Post) => {
    const isLiked = likedIds.has(post.id);
    toggleLike(post.id, post.tags ?? [], isLiked);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/app"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Dashboard
          </Link>
          <h1 className="font-bold text-2xl">Posts</h1>
        </div>

        <InfoNote className="mb-8">
          <p className="font-medium mb-1">How recommendations work</p>
          <p>
            Like posts you enjoy. Recommendations are based on <strong>tags</strong>—the more you like
            posts with similar tags, the better we suggest others. All data stays on your device.
          </p>
        </InfoNote>

        {recommendedPosts.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-amber-500" />
              Recommended for you
            </h2>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 md:overflow-visible md:mx-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:pb-0">
              {recommendedPosts.map((post) => (
                <div
                  key={`rec-${post.id}`}
                  className="shrink-0 w-[85vw] max-w-[320px] snap-center md:w-auto md:max-w-none"
                >
                  <PostCard
                    post={post}
                    isLiked={likedIds.has(post.id)}
                    onToggleLike={() => handleToggleLike(post)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-semibold text-lg mb-4">All posts</h2>
          {isLoading && offset === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isLiked={likedIds.has(post.id)}
                  onToggleLike={() => handleToggleLike(post)}
                />
              ))}
            </div>
          )}

          {posts.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground py-10">
              No posts yet. Load more to see recommendations.
            </p>
          )}

          {posts.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => setOffset((p) => p + LIMIT)}
                disabled={isFetching}
                className="px-6 py-2 rounded-lg border font-medium hover:bg-gray-100 transition disabled:opacity-50"
              >
                {isFetching ? "Loading..." : "Show more"}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
