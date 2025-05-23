import { Cat, Heart, Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-inner mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center space-x-2">
              <Cat size={24} className="text-primary" />
              <span className="text-xl font-bold">KuchoStore</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 text-center md:text-left">
              Productos purr-fectos para amantes de los gatos
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Tienda
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 flex items-center justify-center gap-1">
            © {currentYear} KuchoStore. Hecho con
            <Heart size={14} className="text-red-500 inline animate-pulse" />
            para gatos
          </p>
        </div>
      </div>
    </footer>
  );
}
