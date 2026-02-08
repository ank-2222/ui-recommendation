import { Heart } from "lucide-react";
import type { Post } from "@/interfaces/post";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PostCardProps = {
  post: Post;
  isLiked: boolean;
  onToggleLike: () => void;
};

export default function PostCard({ post, isLiked, onToggleLike }: PostCardProps) {
  const tags = post.tags ?? [];

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-2 border-b">
        <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleLike}
          aria-label={isLiked ? "Unlike" : "Like"}
          className="shrink-0"
        >
          <Heart
            className={`size-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 pt-3">
        <p className="text-muted-foreground text-sm line-clamp-3">{post.body}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-1.5 border-t pt-3">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
        {post.reactions && (
          <span className="ml-auto text-xs text-muted-foreground">
            {post.reactions.likes} likes · {post.views} views
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
