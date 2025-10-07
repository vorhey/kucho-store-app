import { Cat, Menu, ShoppingBag, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useClickOutside } from "@/hooks/useClickOutside";

function CartBadge({
  cartCount,
  bounce,
}: {
  cartCount: number;
  bounce: boolean;
}) {
  if (cartCount === 0) return null;
  return (
    <span
      className={`absolute -top-2 -right-2 flex items-center justify-center px-1 font-semibold text-white bg-pink-500 rounded-full min-w-[18px] h-[18px] text-xs ${bounce ? "smooth-bounce" : ""}`}
    >
      {cartCount}
    </span>
  );
}

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [bounce, setBounce] = useState(false);
  const { cart } = useCart();
  const { user } = useAuth();
  const navRef = useRef<HTMLElement>(null);
  const [location] = useLocation();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (cartCount > 0) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 800);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const isActive = (path: string) => {
    return path === "/" ? location === "/" : location.startsWith(path);
  };

  const isAuthPage = () => {
    return [
      "/signin",
      "/signup",
      "/request-reset",
      "/reset-password",
      "/forgot-password",
    ].some((path) => location.startsWith(path));
  };

  const userPath = user ? "/profile" : "/signin";
  const showUserActive = user ? isActive("/profile") : isAuthPage();

  useClickOutside(navRef, () => setIsOpen(false));

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
    >
      <div className="container mx-auto py-4">
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
              href="/shop"
              className={`p-1 ${isActive("/shop") ? "bg-pink-100 text-pink-700" : "text-gray-600"} rounded-md`}
            >
              <ShoppingBag size={24} />
            </Link>
            <Link
              href="/cart"
              className={`relative p-1 ${isActive("/cart") ? "bg-pink-100 text-pink-700" : "text-gray-600"} rounded-md`}
            >
              <ShoppingCart size={24} />
              <CartBadge cartCount={cartCount} bounce={bounce} />
            </Link>
            <Link
              href={userPath}
              className={`p-1 ${showUserActive ? "bg-pink-100 text-pink-700" : "text-gray-600"} rounded-md`}
            >
              <User size={24} />
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-transform duration-300 hover:scale-110 ${isOpen ? "rotate-180" : ""}`}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-pink-50 rounded-md transition-colors ${isActive("/") ? "bg-pink-100 text-pink-700" : ""}`.trim()}
            >
              <Cat size={24} />
              <span>Inicio</span>
            </Link>
            <Link
              href="/shop"
              className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-pink-50 rounded-md transition-colors ${isActive("/shop") ? "bg-pink-100 text-pink-700" : ""}`.trim()}
            >
              <ShoppingBag size={24} />
              <span>Tienda</span>
            </Link>
            <Link
              href="/cart"
              className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-pink-50 rounded-md transition-colors ${isActive("/cart") ? "bg-pink-100 text-pink-700" : ""} relative`.trim()}
            >
              <ShoppingCart size={24} />
              <CartBadge cartCount={cartCount} bounce={bounce} />
              <span>Carrito</span>
            </Link>
            <Link
              href={userPath}
              className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-pink-50 rounded-md transition-colors ${isActive(user ? "/profile" : "/signin") ? "bg-pink-100 text-pink-700" : ""} ${showUserActive ? "bg-pink-100 text-pink-700" : ""}`.trim()}
            >
              <User size={24} />
              <span>{user ? "Perfil" : "Iniciar sesión"}</span>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-pink-50 rounded-md transition-colors ${isActive("/") ? "bg-pink-100 text-pink-700" : ""}`.trim()}
              onClick={() => setIsOpen(false)}
            >
              <Cat size={18} />
              <span>Inicio</span>
            </Link>
            <Link
              href="/shop"
              className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-pink-50 rounded-md transition-colors ${isActive("/shop") ? "bg-pink-100 text-pink-700" : ""}`.trim()}
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag size={18} />
              <span>Tienda</span>
            </Link>
            <Link
              href="/cart"
              className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-pink-50 rounded-md transition-colors ${isActive("/cart") ? "bg-pink-100 text-pink-700" : ""}`.trim()}
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart size={18} />
              <span>Carrito{cartCount > 0 ? ` (${cartCount})` : ""}</span>
            </Link>
            <Link
              href={userPath}
              className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-pink-50 rounded-md transition-colors ${isActive(user ? "/profile" : "/signin") ? "bg-pink-100 text-pink-700" : ""} ${showUserActive ? "bg-pink-100 text-pink-700" : ""}`.trim()}
              onClick={() => setIsOpen(false)}
            >
              <User size={18} />
              <span>{user ? "Perfil" : "Iniciar sesión"}</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
