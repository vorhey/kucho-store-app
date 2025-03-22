import { useParams, Link } from "wouter";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import { useScrollTop } from "@/hooks/useScrollTop";
import notFoundImage from "@/assets/images/not-found.png";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, decreaseFromCart, cart } = useCart();
  const product = products.find((p) => p.id === id);
  const [imgSrc, setImgSrc] = useState(product?.imageUrl);
  const cartItem = cart.find((item) => item.product.id === id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1>Product not found</h1>
      </div>
    );
  }

  useScrollTop();

  const handleImageError = () => {
    setImgSrc(notFoundImage);
  };

  const handleGoBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="" onClick={handleGoBack}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver atrás
        </Button>
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={imgSrc}
            alt={product.name}
            onError={handleImageError}
            className="w-full rounded-lg shadow-lg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
          <div className="prose max-w-none">
            <p className="text-gray-600">{product.description}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Categoria: {product.category}
            </p>
            <p className="text-sm text-gray-500">
              Stock disponible: {product.stock}
            </p>
          </div>
          {quantityInCart > 0 ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => decreaseFromCart(product.id)}
                disabled={quantityInCart <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>

              <span className="mx-2 text-lg font-medium">{quantityInCart}</span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => addToCart(product)}
                disabled={quantityInCart >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => addToCart(product)}
              size="lg"
              className="w-full md:w-auto"
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Agregar al carrito
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
