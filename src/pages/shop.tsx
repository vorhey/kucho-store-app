import { useCart } from '../context/CartContext';
import { ProductGrid } from '../components/ProductGrid';
import { products } from '../data/products';
import type { Product } from '../types/product';

export default function ShopPage() {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <ProductGrid products={products} onAddToCart={handleAddToCart} />
    </div>
  );
}
