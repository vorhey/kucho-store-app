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
import { CONFIRM_ORDER_ACTION } from "@/constants";
import { useLogUserAction } from "@/hooks/useAuditLog";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const [, setLocation] = useLocation();
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {},
  );
  const logUserAction = useLogUserAction();

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
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const handleConfirmOrder = () => {
    logUserAction("123", CONFIRM_ORDER_ACTION, {
      cart: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    });
    // setLocation("/checkout");
  };

  return (
    <div className="px-4 py-4 sm:py-8">
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
        <>
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-grow space-y-4 mt-4 overflow-hidden w-full lg:w-2/3">
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div
                      key={item.product.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      style={{ position: "relative" }}
                    >
                      <Card
                        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() =>
                          setLocation(`/product/${item.product.id}`)
                        }
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="w-full sm:w-48 h-56">
                            <img
                              src={
                                imageErrors[item.product.id]
                                  ? notFoundImage
                                  : item.product.imageUrl
                              }
                              alt={item.product.name}
                              onError={() => handleImageError(item.product.id)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <CardHeader className="p-4 flex flex-row justify-between items-center">
                              <h3 className="text-lg font-semibold">
                                {item.product.name}
                              </h3>
                              <span className="text-sm text-gray-500">
                                Cantidad: {item.quantity}
                              </span>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow">
                              <p className="text-2xl font-bold text-primary">
                                ${item.product.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                {item.product.description}
                              </p>
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
              <div className="mt-4 w-full lg:w-1/3 lg:max-w-md self-start">
                <Card className="min-h-[45vh] overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-lg">
                  <CardHeader className="p-6 border-b">
                    <h3 className="text-xl font-bold text-primary flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Resumen de compra
                    </h3>
                  </CardHeader>
                  <CardContent className="p-6 divide-y divide-gray-100">
                    <AnimatePresence>
                      {cart.map((item) => (
                        <motion.div
                          key={item.product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="py-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-100">
                                <img
                                  src={
                                    imageErrors[item.product.id]
                                      ? notFoundImage
                                      : item.product.imageUrl
                                  }
                                  alt=""
                                  className="w-full h-full object-cover"
                                  onError={() =>
                                    handleImageError(item.product.id)
                                  }
                                />
                              </div>
                              <span className="font-medium max-w-[135px] xs:max-w-full truncate block">
                                {item.product.name} × {item.quantity}
                              </span>
                            </div>
                            <span className="font-semibold">
                              ${item.product.price.toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardContent>
                  <CardFooter className="p-6 bg-gray-50 border-t">
                    <div className="w-full space-y-4">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>
                          $
                          {cart
                            .reduce((acc, item) => acc + item.product.price, 0)
                            .toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <motion.span
                          key={cart.length} // Force animation on cart changes
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 0.5 }}
                          className="text-primary"
                        >
                          $
                          {cart
                            .reduce((acc, item) => acc + item.product.price, 0)
                            .toFixed(2)}
                        </motion.span>
                      </div>

                      <Button
                        className="w-full py-6 cursor-pointer"
                        size="lg"
                        onClick={handleConfirmOrder}
                      >
                        Proceder al pago
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
