import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Cat, RotateCcw, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import notFoundImage from "@/assets/images/not-found.png";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuantityInput } from "@/components/QuantityInput";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { useScrollTop } from "@/hooks/useScrollTop";
import { BreadcrumbType, getBreadcrumbs } from "@/lib/breadcrumbs";

export default function ProductDetailPage() {
  useScrollTop();
  const { id } = useParams<{ id: string }>();
  const { addToCart, removeFromCart, cart } = useCart();
  const product = products.find((p) => p.id === id);
  const [imgSrc, setImgSrc] = useState(product?.imageUrl);
  const cartItem = cart.find((item) => item.product.id === id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const [quantity, setQuantity] = useState<number | string>(
    quantityInCart > 0 ? quantityInCart : 1
  );
  const [showCatAnimation, setShowCatAnimation] = useState(false);
  const catAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Sync input value with cart changes
  useEffect(() => {
    setQuantity(quantityInCart > 0 ? quantityInCart : 1);
  }, [quantityInCart]);

  const handleAddToCartClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    const q = typeof quantity === "number" ? quantity : Number(quantity) || 0;
    if (q === 0) return void removeFromCart(product.id);
    addToCart(product, q);
    setShowCatAnimation(true);
    if (catAnimationTimeoutRef.current)
      clearTimeout(catAnimationTimeoutRef.current);
    catAnimationTimeoutRef.current = setTimeout(
      () => setShowCatAnimation(false),
      1200
    );
  };

  useEffect(() => {
    return () => {
      if (catAnimationTimeoutRef.current)
        clearTimeout(catAnimationTimeoutRef.current);
    };
  }, []);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1>Product not found</h1>
      </div>
    );
  }

  const handleImageError = () => {
    setImgSrc(notFoundImage);
  };

  const handleGoBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Breadcrumbs
        items={getBreadcrumbs(BreadcrumbType.Product, {
          productName: product.name,
        })}
      />
      <Link href="" onClick={handleGoBack}>
        <Button variant="ghost">
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
          <div className="relative w-full flex flex-col gap-2">
            <div className="mb-2">
              <label
                htmlFor={`quantity-${product.id}`}
                className="text-gray-700 mb-1 block"
              >
                Cantidad
              </label>
              <div className="flex items-center gap-2">
                <div className="flex w-fit items-stretch [&>input]:flex-1 [&>button]:focus-visible:z-10 [&>button]:focus-visible:relative [&>input]:w-14 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2 [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none">
                  <QuantityInput
                    value={quantity}
                    onChange={setQuantity}
                    min={0}
                    max={product.stock}
                    onBlur={() => {
                      if (quantity === "" || Number(quantity) < 1)
                        setQuantity(1);
                    }}
                    onEnter={handleAddToCartClick}
                  />
                </div>
                {quantityInCart > 0 && (
                  <span className="ml-2 px-2 py-1 rounded bg-pink-50 text-pink-600 text-xs font-semibold border border-pink-200">
                    En carrito: {quantityInCart}
                  </span>
                )}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAddToCartClick()}
              className="flex-1 border border-gray-200 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background hover:bg-gray-50 hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer relative overflow-hidden"
            >
              <motion.span
                animate={{
                  opacity: showCatAnimation ? 0 : 1,
                  y: showCatAnimation ? -8 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {quantity === 0 ? (
                  <span className="inline-flex items-center">
                    <Trash2 className="w-4 h-4 mr-2" aria-hidden /> Vaciar
                    carrito
                  </span>
                ) : quantityInCart > 0 &&
                  typeof quantity === "number" &&
                  quantity < quantityInCart ? (
                  <span className="inline-flex items-center">
                    <RotateCcw className="w-4 h-4 mr-2" aria-hidden />{" "}
                    Actualizar carrito
                  </span>
                ) : (
                  <span className="inline-flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-2" aria-hidden />{" "}
                    Agregar al carrito
                  </span>
                )}
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
                    <Cat className="h-6 w-6 text-pink-500" strokeWidth={2.2} />{" "}
                    Listo!
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
