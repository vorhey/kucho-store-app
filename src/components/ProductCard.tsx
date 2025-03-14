import type { Product } from "../types/product";
import { CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import notFoundCatImage from "@/assets/images/cat-not-found.svg";
import { useLocation } from "wouter";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [, setLocation] = useLocation();

  const handleImageError = () => {
    setImgSrc(notFoundCatImage);
  };

  const handleClick = () => {
    setLocation(`/product/${product.id}`);
  };

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
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Agregar al carrito
        </motion.button>
      </CardFooter>
    </motion.div>
  );
}
