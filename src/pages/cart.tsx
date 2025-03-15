import { useCart } from "../context/CartContext";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Trash } from "lucide-react";
import { CatAnimation } from "../components/CatAnimation";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollTop } from "@/hooks/useScrollTop";
import { useState } from "react";
import notFoundImage from "@/assets/images/not-found.png";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const [, setLocation] = useLocation();
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      x: -300,
      transition: {
        duration: 0.5,
      },
    },
  };

  useScrollTop();

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
      {cart.length === 0 ? (
        <>
          <CatAnimation />
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-xl font-medium text-gray-900 mb-2"
            >
              Tu carro esta vacio
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 mb-6">
              Al parecer no has agregado ningun producto a tu carro de compras.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link href="/shop">
                <Button className="px-8">Explorar coleccion</Button>
              </Link>
            </motion.div>
          </motion.div>
        </>
      ) : (
        <div className="space-y-4 mt-4 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.product.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                style={{ position: 'relative' }}
              >
                <Card 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setLocation(`/product/${item.product.id}`)}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-48 h-56">
                      <img
                        src={imageErrors[item.product.id] ? notFoundImage : item.product.imageUrl}
                        alt={item.product.name}
                        onError={() => handleImageError(item.product.id)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <CardHeader className="p-4 flex flex-row justify-between items-center">
                        <h3 className="text-lg font-semibold">{item.product.name}</h3>
                        <span className="text-sm text-gray-500">Cantidad: {item.quantity}</span>
                      </CardHeader>
                      <CardContent className="p-4 flex-grow">
                        <p className="text-2xl font-bold text-primary">
                          ${item.product.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">{item.product.description}</p>
                      </CardContent>
                      <CardFooter className="p-4 border-t">
                        <Button
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(item.product.id);
                          }}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
