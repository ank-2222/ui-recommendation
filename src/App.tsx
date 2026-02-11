import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import User from "./pages/user/User";
import AppDashboard from "./pages/app/AppDashboard";
import Posts from "./pages/posts/Posts";
import Recipes from "./pages/recipes/Recipes";
import Products from "./pages/products/Products";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Header from "./components/ui/Header";

export function App() {
  return (
    <>
    <Header/>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<User />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <Recipes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;