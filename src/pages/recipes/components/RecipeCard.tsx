import { Heart } from "lucide-react";
import type { Recipe } from "@/interfaces/recipe";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type RecipeCardProps = {
  recipe: Recipe;
  isLiked: boolean;
  onToggleLike: () => void;
};

export default function RecipeCard({ recipe, isLiked, onToggleLike }: RecipeCardProps) {
  const tags = recipe.tags ?? [];
  const mealTypes = recipe.mealType ?? [];

  return (
    <Card className="flex flex-col overflow-hidden">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.name}
          className="h-40 w-full object-cover"
        />
      )}
      <CardHeader className="flex flex-row items-start justify-between gap-2 border-b">
        <CardTitle className="line-clamp-2 text-lg">{recipe.name}</CardTitle>
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
        <p className="text-muted-foreground text-sm">
          {recipe.cuisine} · {recipe.difficulty} · {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
        </p>
        {recipe.ingredients?.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {recipe.ingredients.slice(0, 3).join(", ")}...
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-1.5 border-t pt-3">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
        {mealTypes.map((m) => (
          <Badge key={m} variant="outline" className="text-xs">
            {m}
          </Badge>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          ★ {recipe.rating} · {recipe.reviewCount} reviews
        </span>
      </CardFooter>
    </Card>
  );
}
