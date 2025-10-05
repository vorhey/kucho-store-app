import { useCart } from "../context/CartContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Trash, Minus, Plus } from "lucide-react";
import { CatAnimation } from "../components/CatAnimation";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollTop } from "@/hooks/useScrollTop";
import { useState } from "react";
import notFoundImage from "@/assets/images/not-found.png";
import { CONFIRM_ORDER_ACTION } from "@/constants";
import { useLogUserAction } from "@/hooks/useAuditLog";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getCartBreadcrumbs } from "@/lib/breadcrumbs";
import type { Product } from "@/types/product";

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
  const [, setLocation] = useLocation();
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>(
    {},
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
    // setLocation("/checkout");
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

  const handleQuantityInputChange = (product: Product, value: string) => {
    if (value === "") {
      setQuantityInput(product.id, value);
      return;
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    if (numericValue <= 0) {
      clearQuantityInput(product.id);
      removeFromCart(product.id);
      return;
    }

    addToCart(product, numericValue);
    clearQuantityInput(product.id);
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
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-48 h-56">
                          <Link
                            href={`/product/${item.product.id}`}
                            onClick={(e) => e.stopPropagation()} // Prevent bubbling to Card
                            className="block w-full h-full"
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
                              style={{ display: "block" }}
                            />
                          </Link>
                        </div>
                        <div className="flex-1 flex flex-col">
                          <CardHeader className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {item.product.name}
                              </h3>
                              <div className="flex gap-4 mt-1 text-gray-600">
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
                                    {(
                                      item.product.price * item.quantity
                                    ).toFixed(2)}
                                  </motion.span>
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 flex-grow">
                            <div className="flex flex-col gap-1">
                              <Label
                                htmlFor={`cart-qty-${item.product.id}`}
                                className="text-gray-500 text-sm mb-1"
                              >
                                Cantidad
                              </Label>
                              <div className="flex items-center gap-2">
                                <div className="flex w-fit items-stretch [&>input]:flex-1 [&>button]:focus-visible:z-10 [&>button]:focus-visible:relative [&>input]:w-14 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2 [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none">
                                  <Input
                                    id={`cart-qty-${item.product.id}`}
                                    type="number"
                                    min={0}
                                    value={
                                      quantityInputs[item.product.id] ??
                                      item.quantity.toString()
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                      handleQuantityInputChange(
                                        item.product,
                                        e.target.value,
                                      );
                                    }}
                                    onBlur={() =>
                                      handleQuantityInputBlur(item.product.id)
                                    }
                                    className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 font-mono text-center"
                                    style={{ appearance: "textfield" }}
                                    data-slot="input"
                                  />
                                  <button
                                    data-slot="button"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 size-8"
                                    type="button"
                                    aria-label="Decrement"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (item.quantity > 1) {
                                        addToCart(
                                          item.product,
                                          item.quantity - 1,
                                        );
                                        clearQuantityInput(item.product.id);
                                      } else if (item.quantity === 1) {
                                        clearQuantityInput(item.product.id);
                                        removeFromCart(item.product.id);
                                      }
                                    }}
                                    tabIndex={-1}
                                  >
                                    <Minus className="size-4" />
                                  </button>
                                  <button
                                    data-slot="button"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 size-8"
                                    type="button"
                                    aria-label="Increment"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addToCart(
                                        item.product,
                                        item.quantity + 1,
                                      );
                                      clearQuantityInput(item.product.id);
                                    }}
                                    tabIndex={-1}
                                  >
                                    <Plus className="size-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            {/* <p className="text-2xl font-bold text-primary"> */}
                            {/*   ${item.product.price.toFixed(2)} */}
                            {/* </p> */}
                            {/* <p className="text-sm text-gray-600 mt-2"> */}
                            {/*   {item.product.description} */}
                            {/* </p> */}
                          </CardContent>
                          <CardFooter className="p-4 border-t">
                            <Button
                              type="button"
                              variant="outline"
                              className="hover:bg-pink-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearQuantityInput(item.product.id);
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
                          0,
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
                            0,
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
                            0,
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
