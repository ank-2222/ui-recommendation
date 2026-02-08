import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetRecipes } from "@/feature/recipes/useGetRecipes";
import { useRecipeLikes } from "@/feature/recipes/useRecipeLikes";
import { scoreRecipesByAffinity } from "@/store/recipeStore";
import type { Recipe } from "@/interfaces/recipe";
import RecipeCard from "./components/RecipeCard";
import { InfoNote } from "@/components/InfoNote";

const LIMIT = 10;

export default function Recipes() {
  const { currentUser } = useAuth();
  const [offset, setOffset] = useState(0);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recommendedIds, setRecommendedIds] = useState<number[]>([]);

  const { data, isLoading, isFetching } = useGetRecipes(LIMIT, offset);
  const { likedIds, affinityScores, toggleLike, isLoading: likesLoading } =
    useRecipeLikes(currentUser?.id);

  useEffect(() => {
    if (data?.recipes?.length) {
      setRecipes((prev) => {
        const byId = new Map(prev.map((r) => [r.id, r]));
        for (const r of data.recipes) byId.set(r.id, r);
        return [...byId.values()];
      });
    }
  }, [data]);

  const likedSet = useMemo(() => likedIds, [likedIds]);
  const recipesById = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);

  const computeRecommended = useCallback(() => {
    if (recipes.length === 0 || likesLoading) return;
    const ids = scoreRecipesByAffinity(
      recipes.map((r) => r.id),
      recipesById,
      affinityScores,
      likedSet
    );
    setRecommendedIds(ids);
  }, [recipes, recipesById, affinityScores, likedSet, likesLoading]);

  useEffect(() => {
    computeRecommended();
  }, [computeRecommended]);

  const recommendedRecipes = useMemo(
    () =>
      recommendedIds
        .map((id) => recipesById.get(id))
        .filter((r): r is Recipe => r != null),
    [recommendedIds, recipesById]
  );

  const handleToggleLike = (recipe: Recipe) => {
    const isLiked = likedIds.has(recipe.id);
    toggleLike(recipe, isLiked);
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
          <h1 className="font-bold text-2xl">Recipes</h1>
        </div>

        <InfoNote className="mb-8">
          <p className="font-medium mb-1">How recommendations work</p>
          <p>
            Like recipes you want to try. We use <strong>tags</strong>, <strong>cuisine</strong>, and{" "}
            <strong>meal type</strong> to suggest similar ones. All data is stored locally on your device.
          </p>
        </InfoNote>

        {recommendedRecipes.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-amber-500" />
              Recommended for you
            </h2>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 md:overflow-visible md:mx-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:pb-0">
              {recommendedRecipes.map((recipe) => (
                <div
                  key={`rec-${recipe.id}`}
                  className="shrink-0 w-[85vw] max-w-[320px] snap-center md:w-auto md:max-w-none"
                >
                  <RecipeCard
                    recipe={recipe}
                    isLiked={likedIds.has(recipe.id)}
                    onToggleLike={() => handleToggleLike(recipe)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-semibold text-lg mb-4">All recipes</h2>
          {isLoading && offset === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isLiked={likedIds.has(recipe.id)}
                  onToggleLike={() => handleToggleLike(recipe)}
                />
              ))}
            </div>
          )}

          {recipes.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground py-10">
              No recipes yet. Load more to see recommendations.
            </p>
          )}

          {recipes.length > 0 && (
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
