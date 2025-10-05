import type { Product } from "../types/product";
import { useCart } from "../context/CartContext";
import { ProductGrid } from "../components/ProductGrid";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { products } from "@/services/products";
import { getShopBreadcrumbs } from "@/lib/breadcrumbs";

export default function ShopPage() {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const query = useQuery({
    queryKey: ["products"],
    queryFn: products,
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <Breadcrumbs items={getShopBreadcrumbs()} />
      <ProductGrid products={query?.data} onAddToCart={handleAddToCart} />
    </div>
  );
}
