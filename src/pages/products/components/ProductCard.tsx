import { Heart } from "lucide-react";
import type { Product } from "@/interfaces/product";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ProductCardProps = {
  product: Product;
  isLiked: boolean;
  onToggleLike: () => void;
};

export default function ProductCard({ product, isLiked, onToggleLike }: ProductCardProps) {
  const tags = product.tags ?? [];

  return (
    <Card className="flex flex-col overflow-hidden">
      {product.thumbnail && (
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-40 w-full object-contain bg-muted/30"
        />
      )}
      <CardHeader className="flex flex-row items-start justify-between gap-2 border-b">
        <CardTitle className="line-clamp-2 text-lg">{product.title}</CardTitle>
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
        <p className="text-muted-foreground text-sm line-clamp-2">
          {product.description}
        </p>
        <p className="font-medium mt-1">
          ${product.price}
          {product.discountPercentage > 0 && (
            <span className="text-xs text-muted-foreground ml-1">
              ({product.discountPercentage}% off)
            </span>
          )}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-1.5 border-t pt-3">
        {product.brand && (
          <Badge variant="secondary" className="text-xs">
            {product.brand}
          </Badge>
        )}
        {product.category && (
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        )}
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          ★ {product.rating}
        </span>
      </CardFooter>
    </Card>
  );
}
