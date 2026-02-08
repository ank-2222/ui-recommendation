import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetProducts } from "@/feature/products/useGetProducts";
import { useProductLikes } from "@/feature/products/useProductLikes";
import { scoreProductsByAffinity } from "@/store/productStore";
import type { Product } from "@/interfaces/product";
import ProductCard from "./components/ProductCard";
import { InfoNote } from "@/components/InfoNote";

const LIMIT = 10;

export default function Products() {
  const { currentUser } = useAuth();
  const [offset, setOffset] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendedIds, setRecommendedIds] = useState<number[]>([]);

  const { data, isLoading, isFetching } = useGetProducts(LIMIT, offset);
  const { likedIds, affinityScores, toggleLike, isLoading: likesLoading } =
    useProductLikes(currentUser?.id);

  useEffect(() => {
    if (data?.products?.length) {
      setProducts((prev) => {
        const byId = new Map(prev.map((p) => [p.id, p]));
        for (const p of data.products) byId.set(p.id, p);
        return [...byId.values()];
      });
    }
  }, [data]);

  const likedSet = useMemo(() => likedIds, [likedIds]);
  const productsById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const computeRecommended = useCallback(() => {
    if (products.length === 0 || likesLoading) return;
    const ids = scoreProductsByAffinity(
      products.map((p) => p.id),
      productsById,
      affinityScores,
      likedSet
    );
    setRecommendedIds(ids);
  }, [products, productsById, affinityScores, likedSet, likesLoading]);

  useEffect(() => {
    computeRecommended();
  }, [computeRecommended]);

  const recommendedProducts = useMemo(
    () =>
      recommendedIds
        .map((id) => productsById.get(id))
        .filter((p): p is Product => p != null),
    [recommendedIds, productsById]
  );

  const handleToggleLike = (product: Product) => {
    const isLiked = likedIds.has(product.id);
    toggleLike(product, isLiked);
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
          <h1 className="font-bold text-2xl">Products</h1>
        </div>

        <InfoNote className="mb-8">
          <p className="font-medium mb-1">How recommendations work</p>
          <p>
            Like products you like. We use <strong>category</strong> and <strong>tags</strong> to suggest
            similar items. Everything is stored locally on your device.
          </p>
        </InfoNote>

        {recommendedProducts.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-amber-500" />
              Recommended for you
            </h2>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 md:overflow-visible md:mx-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:pb-0">
              {recommendedProducts.map((product) => (
                <div
                  key={`rec-${product.id}`}
                  className="shrink-0 w-[85vw] max-w-[320px] snap-center md:w-auto md:max-w-none"
                >
                  <ProductCard
                    product={product}
                    isLiked={likedIds.has(product.id)}
                    onToggleLike={() => handleToggleLike(product)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-semibold text-lg mb-4">All products</h2>
          {isLoading && offset === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isLiked={likedIds.has(product.id)}
                  onToggleLike={() => handleToggleLike(product)}
                />
              ))}
            </div>
          )}

          {products.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground py-10">
              No products yet. Load more to see recommendations.
            </p>
          )}

          {products.length > 0 && (
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
