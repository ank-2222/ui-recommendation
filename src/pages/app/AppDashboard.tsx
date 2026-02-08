import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, FileText, ChefHat, ShoppingBag } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { InfoNote } from "@/components/InfoNote";
import { getLikedPostIds } from "@/store/postStore";
import { getLikedRecipeIds } from "@/store/recipeStore";
import { getLikedProductIds } from "@/store/productStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AppDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ posts: 0, recipes: 0, products: 0 });

  useEffect(() => {
    if (!currentUser?.id) return;
    Promise.all([
      getLikedPostIds(currentUser.id),
      getLikedRecipeIds(currentUser.id),
      getLikedProductIds(currentUser.id),
    ]).then(([postIds, recipeIds, productIds]) => {
      setStats({
        posts: postIds.length,
        recipes: recipeIds.length,
        products: productIds.length,
      });
    });
  }, [currentUser?.id]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {currentUser.image && (
                <img
                  src={currentUser.image}
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  className="w-12 h-12 rounded-full border-2"
                />
              )}
              <div>
                <h1 className="font-bold text-xl">
                  {currentUser.firstName} {currentUser.lastName}
                </h1>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
              </div>
            </div>
            <Button variant="outline" size="lg" onClick={handleLogout}>
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>

          <InfoNote className="mt-6">
            <p className="font-medium mb-1">Your activity (stored locally)</p>
            <p>
              Likes and preferences are saved on your device. They power the &quot;Recommended for you&quot;
              sections on each page. No data is sent to any server.
            </p>
          </InfoNote>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card>
              <CardHeader className="pb-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <FileText className="size-4" /> Posts liked
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.posts}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Like posts to see tag-based recommendations
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <ChefHat className="size-4" /> Recipes liked
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.recipes}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cuisine, tags & meal type shape your picks
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <ShoppingBag className="size-4" /> Products liked
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.products}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Category & tags drive product suggestions
                </p>
              </CardContent>
            </Card>
          </div>

          <nav className="mt-6 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link to="/posts" className="inline-flex items-center">
                <FileText className="size-4 mr-2" />
                Posts
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/recipes" className="inline-flex items-center">
                <ChefHat className="size-4 mr-2" />
                Recipes
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/products" className="inline-flex items-center">
                <ShoppingBag className="size-4 mr-2" />
                Products
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
