import { AnimatePresence, motion } from "framer-motion"
import {
  Cat,
  Eye,
  Minus,
  Plus,
  RotateCcw,
  ShoppingCart,
  Trash2,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useLocation } from "wouter"
import notFoundImage from "@/assets/images/not-found.png"
import { useCart } from "@/context/CartContext"
import type { Product } from "../types/product"
import { CardContent, CardFooter, CardHeader } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, quantity: number) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl)
  const [, setLocation] = useLocation()
  const { cart } = useCart()
  const { removeFromCart } = useCart()
  const cartItem = cart.find((item) => item.product.id === product.id)
  const quantityInCart = cartItem ? cartItem.quantity : 0
  const [quantity, setQuantity] = useState(
    quantityInCart > 0 ? quantityInCart : 1
  )
  const [showCatAnimation, setShowCatAnimation] = useState(false)
  const catAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  // Sync input value with cart changes
  useEffect(() => {
    setQuantity(quantityInCart > 0 ? quantityInCart : 1)
  }, [quantityInCart])

  const _handleImageError = () => {
    setImgSrc(notFoundImage)
  }

  const handleClick = () => {
    setLocation(`/product/${product.id}`)
  }

  const increaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0))
  }

  const handleAddToCartClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation()
    }
    if (quantity === 0) {
      removeFromCart(product.id)
      return
    }
    onAddToCart(product, quantity)
    setShowCatAnimation(true)

    if (catAnimationTimeoutRef.current) {
      clearTimeout(catAnimationTimeoutRef.current)
    }

    catAnimationTimeoutRef.current = setTimeout(() => {
      setShowCatAnimation(false)
    }, 1200)
  }

  useEffect(() => {
    return () => {
      if (catAnimationTimeoutRef.current) {
        clearTimeout(catAnimationTimeoutRef.current)
      }
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <CardHeader className="p-4">
        <button
          type="button"
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClick()
            }
          }}
        >
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-48 object-cover cursor-pointer"
          />
        </button>
        <div className="w-full text-center mt-1">
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-gradient-to-r from-blue-100 to-blue-200 text-xs font-semibold text-blue-700 shadow-sm hover:scale-105 hover:brightness-110 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer"
            tabIndex={0}
          >
            <Eye className="w-4 h-4 mr-1 text-blue-500" />
            ver detalles
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.description}</p>
        </div>
        <p className="text-xl font-bold mt-4">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="relative w-full flex flex-col gap-2">
          <div className="mb-2">
            <Label
              htmlFor={`quantity-${product.id}`}
              className="text-gray-700 mb-1 block"
            >
              Cantidad
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex w-fit items-stretch [&>input]:flex-1 [&>button]:focus-visible:z-10 [&>button]:focus-visible:relative [&>input]:w-14 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2 [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none">
                <Input
                  id={`quantity-${product.id}`}
                  type="number"
                  min={0}
                  value={quantity}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    const val = e.target.value
                    // Allow empty string for editing
                    if (val === "") {
                      setQuantity("")
                    } else {
                      const num = Number(val)
                      if (!Number.isNaN(num)) setQuantity(num)
                    }
                  }}
                  onBlur={() => {
                    // On blur, enforce minimum value of 1
                    if (quantity === "" || Number(quantity) < 1) {
                      setQuantity(1)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddToCartClick()
                    }
                  }}
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input  min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 !w-14 font-mono text-center"
                  style={{ appearance: "textfield" }}
                  data-slot="input"
                />
                <button
                  data-slot="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 size-8"
                  type="button"
                  aria-label="Decrement"
                  onClick={decreaseQuantity}
                  tabIndex={-1}
                >
                  <Minus className="size-4" />
                </button>
                <button
                  data-slot="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 size-8"
                  type="button"
                  aria-label="Increment"
                  onClick={increaseQuantity}
                  tabIndex={-1}
                >
                  <Plus className="size-4" />
                </button>
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
            onClick={handleAddToCartClick}
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
                  <Trash2 className="w-4 h-4 mr-2" aria-hidden /> Vaciar carrito
                </span>
              ) : quantityInCart > 0 && quantity < quantityInCart ? (
                <span className="inline-flex items-center">
                  <RotateCcw className="w-4 h-4 mr-2" aria-hidden /> Actualizar
                  carrito
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <ShoppingCart className="w-4 h-4 mr-2" aria-hidden /> Agregar
                  al carrito
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
      </CardFooter>
    </motion.div>
  )
}
