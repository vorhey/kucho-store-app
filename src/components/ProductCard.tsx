import type { Product } from "../types/product";
import { CardHeader, CardContent, CardFooter } from "./ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Cat } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import notFoundImage from "@/assets/images/not-found.png";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [showCatAnimation, setShowCatAnimation] = useState(false);
  const catAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleImageError = () => {
    setImgSrc(notFoundImage);
  };

  const handleClick = () => {
    setLocation(`/product/${product.id}`);
  };

  const increaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    setShowCatAnimation(true);

    if (catAnimationTimeoutRef.current) {
      clearTimeout(catAnimationTimeoutRef.current);
    }

    catAnimationTimeoutRef.current = setTimeout(() => {
      setShowCatAnimation(false);
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (catAnimationTimeoutRef.current) {
        clearTimeout(catAnimationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="p-4">
        <img
          src={imgSrc}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-48 object-cover rounded-md"
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.description}</p>
        </div>
        <p className="text-xl font-bold mt-4">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="relative w-full">
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCartClick}
              className="flex-1 outline outline-pink-200 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background hover:bg-pink-50 hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer relative overflow-hidden"
            >
              <motion.span
                animate={{ opacity: showCatAnimation ? 0 : 1, y: showCatAnimation ? -8 : 0 }}
                transition={{ duration: 0.2 }}
              >
                Agregar al carrito
              </motion.span>
              <AnimatePresence>
                {showCatAnimation && (
                  <motion.span
                    key="cat"
                    initial={{ scale: 0, y: 12, rotate: -20 }}
                    animate={{ scale: 1, y: 0, rotate: 0 }}
                    exit={{ scale: 0, y: -12, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 280, damping: 16 }}
                    className="absolute inset-0 flex items-center justify-center"
                    aria-hidden
                  >
                    <Cat className="h-6 w-6 text-pink-500" strokeWidth={2.2} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </CardFooter>
    </motion.div>
  );
}
