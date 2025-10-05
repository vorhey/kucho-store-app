import type { Product } from "@/types/product";

export const products = async (): Promise<Product[]> => {
  const response = await fetch("/api/products", {
    method: "GET",
    headers: { "Content-type": "application/json" },
  });
  return await response.json();
};
