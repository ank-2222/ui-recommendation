import { productsApi } from "@/API/Api";
import type { Product } from "@/interfaces/product";

type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export async function getProductsService({
  limit,
  skip,
}: {
  limit: number;
  skip: number;
}): Promise<ProductsResponse> {
  const res = await fetch(`${productsApi}?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
