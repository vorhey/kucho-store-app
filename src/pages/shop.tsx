import { useQuery } from "@tanstack/react-query";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuantityInput } from "@/components/QuantityInput";
import { getShopBreadcrumbs } from "@/lib/breadcrumbs";
import { products } from "@/services/products";
import { ProductGrid } from "../components/ProductGrid";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/product";

export default function ShopPage() {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
  };

  const query = useQuery({
    queryKey: ["products"],
    queryFn: products,
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <Breadcrumbs items={getShopBreadcrumbs()} />
      <ProductGrid
        products={query?.data}
        onAddToCart={handleAddToCart}
        QuantityInputComponent={QuantityInput}
      />
    </div>
  );
}
