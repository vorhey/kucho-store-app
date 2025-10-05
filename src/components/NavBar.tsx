import { Link, useLocation } from "wouter";
import { useState, useRef } from "react";
import { Menu, X, ShoppingBag, Cat, User, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useAuth } from "@/context/AuthContext";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const { user } = useAuth();
  const navRef = useRef<HTMLElement>(null);
  const [location] = useLocation();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const resolveIsActive = (target: string | string[]) => {
    const paths = Array.isArray(target) ? target : [target];
    return paths.some((path) =>
      path === "/" ? location === "/" : location.startsWith(path),
    );
  };

  const mobileLinkClasses = (path: string | string[]) => {
    const baseClasses =
      "flex items-center gap-3 text-gray-600 hover:text-gray-800 px-2 py-2 rounded-md transition-colors duration-200";
    return resolveIsActive(path)
      ? `${baseClasses} bg-pink-100 text-pink-700`
      : baseClasses;
  };

  const authPaths = [
    "/signin",
    "/signup",
    "/request-reset",
    "/reset-password",
    "/forgot-password",
  ];
  const userLinkTarget = user ? "/profile" : authPaths;

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
              className={`flex items-center gap-2 text-gray-600 hover:text-gray-800 p-1 rounded-md transition-colors duration-200 ${
                resolveIsActive("/shop") ? "bg-pink-100 text-pink-700" : ""
              }`}
            >
              <ShoppingBag size={24} />
            </Link>
            <Link
              href="/cart"
              className={`relative flex items-center gap-2 text-gray-600 hover:text-gray-800 p-1 rounded-md transition-colors duration-200 ${
                resolveIsActive("/cart") ? "bg-pink-100 text-pink-700" : ""
              }`}
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-semibold text-white bg-pink-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href={user ? "/profile" : "/signin"}
              className={`flex items-center gap-2 text-gray-600 hover:text-gray-800 p-1 rounded-md transition-colors duration-200 ${
                resolveIsActive(userLinkTarget)
                  ? "bg-pink-100 text-pink-700"
                  : ""
              }`}
            >
              <User size={18} />
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
              <Cat size={18} />
              <span className="after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1.5 after:left-0 after:bg-stone-500 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                Inicio
              </span>
            </Link>
            <Link
              href="/shop"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition duration-200 ease-in-out relative group"
            >
              <ShoppingBag size={18} />
              <span className="after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1.5 after:left-0 after:bg-stone-500 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                Tienda
              </span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition duration-200 ease-in-out relative group"
            >
              <div className="relative">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-semibold text-white bg-pink-500 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1.5 after:left-0 after:bg-stone-500 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                Carrito
              </span>
            </Link>
            <Link
              href={user ? "/profile" : "/signin"}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition duration-200 ease-in-out relative group"
            >
              <User size={18} />
              <span className="after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1.5 after:right-1 after:bg-stone-500 after:transition-transform after:duration-300 group-hover:after:scale-x-100"></span>
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
            className={mobileLinkClasses("/")}
            onClick={() => setIsOpen(false)}
          >
            <Cat size={18} />
            <span>Inicio</span>
          </Link>
          <Link
            href="/shop"
            className={mobileLinkClasses("/shop")}
            onClick={() => setIsOpen(false)}
          >
            <ShoppingBag size={18} />
            <span>Tienda</span>
          </Link>
          <Link
            href="/cart"
            className={mobileLinkClasses("/cart")}
            onClick={() => setIsOpen(false)}
          >
            <ShoppingCart size={18} />
            <span>Carrito{cartCount > 0 ? ` (${cartCount})` : ""}</span>
          </Link>
          <Link
            href={user ? "/profile" : "/signin"}
            className={mobileLinkClasses(userLinkTarget)}
            onClick={() => setIsOpen(false)}
          >
            <User size={18} />
            {user ? <span>Perfil</span> : <span>Iniciar sesión</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
