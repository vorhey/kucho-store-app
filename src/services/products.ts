import type { Product } from "@/types/product";

export const products = async (): Promise<Product[]> => {
  const response = await fetch(
    "https://kuchostore-worker-api.jorgeherreraulloa.workers.dev/api/products",
    {
      method: "GET",
      headers: { "Content-type": "application/json" },
    },
  );
  return await response.json();
};
