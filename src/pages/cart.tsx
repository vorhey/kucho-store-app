import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import notFoundImage from "@/assets/images/not-found.png";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CONFIRM_ORDER_ACTION } from "@/constants";
import { useLogUserAction } from "@/hooks/useAuditLog";
import { useScrollTop } from "@/hooks/useScrollTop";
import { getCartBreadcrumbs } from "@/lib/breadcrumbs";
import { CatAnimation } from "../components/CatAnimation";
import { QuantityInput } from "../components/QuantityInput";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";

import { useCart } from "../context/CartContext";

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

export default function CartPage() {
  const { cart, removeFromCart, addToCart } = useCart();
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>(
    {}
  );
  const logUserAction = useLogUserAction();

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
  };

  const setQuantityInput = (productId: string, value: string) => {
    setQuantityInputs((prev) => {
      if (prev[productId] === value) {
        return prev;
      }
      return { ...prev, [productId]: value };
    });
  };

  const clearQuantityInput = (productId: string) => {
    setQuantityInputs((prev) => {
      if (!(productId in prev)) {
        return prev;
      }
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleQuantityInputBlur = (productId: string) => {
    setQuantityInputs((prev) => {
      if (prev[productId] !== "") {
        return prev;
      }
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="space-y-8">
        <Breadcrumbs items={getCartBreadcrumbs()} />
        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow space-y-4 overflow-hidden w-full lg:w-2/3">
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
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex items-center p-4 gap-4">
                        <div className="w-24 h-24 flex-shrink-0">
                          <Link
                            href={`/product/${item.product.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="block w-full h-full rounded-md overflow-hidden"
                          >
                            <img
                              src={
                                imageErrors[item.product.id]
                                  ? notFoundImage
                                  : item.product.imageUrl
                              }
                              alt={item.product.name}
                              onError={() => handleImageError(item.product.id)}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </Link>
                        </div>
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {item.product.name}
                            </h3>
                            <div className="flex gap-4 mt-1 text-gray-600 text-sm">
                              <span>
                                Unitario:{" "}
                                <span className="font-semibold text-gray-900">
                                  ${item.product.price.toFixed(2)}
                                </span>
                              </span>
                              <span>
                                Subtotal:{" "}
                                <motion.span
                                  className="font-semibold text-gray-900"
                                  key={item.product.price * item.quantity}
                                  initial={{ scale: 1, color: "#111827" }}
                                  animate={{
                                    scale: [1, 1.15, 1],
                                    color: ["#111827", "#f472b6", "#111827"],
                                  }}
                                  transition={{ duration: 0.5 }}
                                >
                                  $
                                  {(item.product.price * item.quantity).toFixed(
                                    2
                                  )}
                                </motion.span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 justify-self-center">
                            <div className="flex w-fit items-stretch [&>input]:flex-1 [&>button]:focus-visible:z-10 [&>button]:focus-visible:relative [&>input]:w-14 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2 [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none">
                              <QuantityInput
                                value={
                                  quantityInputs[item.product.id] ??
                                  item.quantity
                                }
                                onChange={(val) => {
                                  if (val === "") {
                                    setQuantityInput(item.product.id, "");
                                  } else {
                                    const num = Number(val);
                                    if (!Number.isNaN(num)) {
                                      addToCart(item.product, num);
                                      clearQuantityInput(item.product.id);
                                    }
                                  }
                                }}
                                min={0}
                                max={item.product.stock}
                                onBlur={() =>
                                  handleQuantityInputBlur(item.product.id)
                                }
                                onEnter={() => {
                                  // No-op or could trigger checkout, as desired
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="hover:bg-pink-50 text-gray-500 hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearQuantityInput(item.product.id);
                                removeFromCart(item.product.id);
                              }}
                            >
                              <Trash className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="mt-6 lg:mt-0 w-full lg:w-1/3 lg:max-w-md self-start">
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
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-100 relative">
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
                              <div className="absolute top-0 right-0 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-[15px] font-extrabold opacity-60 hover:opacity-0">
                                {item.quantity}
                              </div>
                            </div>
                            <span className="font-medium max-w-[135px] xs:max-w-full truncate block">
                              {item.product.name}
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
                      <motion.span
                        key={cart.reduce(
                          (acc, item) =>
                            acc + item.product.price * item.quantity,
                          0
                        )}
                        initial={{ scale: 1, color: "#6b7280" }}
                        animate={{
                          scale: [1, 1.15, 1],
                          color: ["#6b7280", "#f472b6", "#6b7280"],
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        $
                        {cart
                          .reduce(
                            (acc, item) =>
                              acc + item.product.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </motion.span>
                    </div>

                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <motion.span
                        key={cart.length}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5 }}
                        className="text-primary"
                      >
                        $
                        {cart
                          .reduce(
                            (acc, item) =>
                              acc + item.product.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </motion.span>
                    </div>

                    <Button
                      variant="secondary"
                      className="w-full py-6 cursor-pointer bg-indigo-200 hover:bg-indigo-300"
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
        )}
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center gap-6">
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
    </div>
  );
}
