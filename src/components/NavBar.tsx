import { Link } from "wouter";
import { useState, useRef } from "react";
import { Menu, X, ShoppingBag, PawPrint, Cat, Volleyball } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useClickOutside } from "@/hooks/useClickOutside";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const navRef = useRef<HTMLElement>(null);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useClickOutside(navRef, () => setIsOpen(false));

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-xl font-bold text-gray-800"
          >
            <Cat size={32} className="mr-2" />
            KuchoStore
          </Link>

          {/* Mobile menu button and cart */}
          <div className="md:hidden flex items-center gap-4">
            <Link
              href="/cart"
              className="flex items-center gap-2 text-gray-600"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="text-sm font-semibold">{cartCount}</span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition duration-200 ease-in-out relative group"
            >
              <Volleyball size={18} />
              <span className="after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1.5 after:left-0 after:bg-stone-500 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                Inicio
              </span>
            </Link>
            <Link
              href="/shop"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition duration-200 ease-in-out relative group"
            >
              <PawPrint size={18} />
              <span className="after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1.5 after:left-0 after:bg-stone-500 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                Shop
              </span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition duration-200 ease-in-out relative group"
            >
              <ShoppingBag size={18} />
              <span className="after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1.5 after:left-0 after:bg-stone-500 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                Carrito{cartCount > 0 ? ` (${cartCount})` : ""}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out transform origin-top ${
            isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 h-0"
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-3 text-gray-600 hover:text-gray-800 px-2 py-2"
            onClick={() => setIsOpen(false)}
          >
            <Volleyball size={18} />
            <span>Inicio</span>
          </Link>
          <Link
            href="/shop"
            className="flex items-center gap-3 text-gray-600 hover:text-gray-800 px-2 py-2"
            onClick={() => setIsOpen(false)}
          >
            <PawPrint size={18} />
            <span>Shop</span>
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-3 text-gray-600 hover:text-gray-800 px-2 py-2"
            onClick={() => setIsOpen(false)}
          >
            <ShoppingBag size={18} />
            <span>Carrito{cartCount > 0 ? ` (${cartCount})` : ""}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
