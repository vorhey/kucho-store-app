import { useCart } from "../context/CartContext";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import { CatAnimation } from "../components/CatAnimation";
import { motion } from "framer-motion";
import { useScrollTop } from "@/hooks/useScrollTop";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

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
  };

  useScrollTop();

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8 overflow-x-hidden">
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
        <div className="space-y-4 mt-4">
          {cart.map((item) => (
            <Card key={item.product.id}>
              <CardHeader className="p-4 flex justify-between">
                <span>{item.product.name}</span>
                <span>Qty: {item.quantity}</span>
              </CardHeader>
              <CardContent className="p-4">
                <p>${item.product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4">
                <Button
                  variant="destructive"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
