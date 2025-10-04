import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Home,
  ShoppingBag,
  ShoppingCart,
  Package,
  LogIn,
  UserPlus,
  User,
  KeyRound,
  Mail,
  Cat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface BreadcrumbsProps {
  className?: string;
  finalLabel?: string;
  items?: BreadcrumbItem[];
}

const LABEL_MAP: Record<string, string> = {
  "": "Inicio",
  shop: "Tienda",
  cart: "Carrito",
  product: "Producto",
  signin: "Iniciar sesión",
  signup: "Crear cuenta",
  profile: "Perfil",
  "reset-password": "Restablecer contraseña",
  "request-reset": "Recuperar acceso",
};

const ICON_MAP: Record<string, LucideIcon> = {
  "": Cat,
  shop: ShoppingBag,
  cart: ShoppingCart,
  product: Package,
  signin: LogIn,
  signup: UserPlus,
  profile: User,
  "reset-password": KeyRound,
  "request-reset": Mail,
};

function formatSegment(segment: string) {
  const decoded = decodeURIComponent(segment);
  const clean = decoded.replace(/-/g, " ");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function Breadcrumbs({
  className,
  finalLabel,
  items,
}: BreadcrumbsProps) {
  const [location] = useLocation();

  const crumbs = useMemo(() => {
    if (items && items.length > 0) {
      return items;
    }

    const pathname = location.split("?")[0].split("#")[0];
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      return [];
    }

    const generated: BreadcrumbItem[] = segments.map((segment, index) => {
      const isLast = index === segments.length - 1;
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const mappedLabel = LABEL_MAP[segment];
      const label =
        isLast && finalLabel
          ? finalLabel
          : mappedLabel || formatSegment(segment);

      return {
        label,
        href: isLast ? undefined : href,
        icon: ICON_MAP[segment],
      };
    });

    return [
      {
        label: LABEL_MAP[""] || "Inicio",
        href: "/",
        icon: ICON_MAP[""],
      },
      ...generated,
    ];
  }, [items, finalLabel, location]);

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <motion.nav
      aria-label="Breadcrumb"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("relative", className)}
    >
      <div className="">
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              const Icon = crumb.icon;

              return (
                <li
                  key={`${crumb.label}-${index}`}
                  className="flex items-center gap-3"
                >
                  {index !== 0 && (
                    <ChevronRight
                      className="h-3 w-3 text-pink-300"
                      aria-hidden
                    />
                  )}
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="flex items-center gap-2 px-3 py-1 text-gray-600 transition-all hover:bg-pink-50 hover:text-gray-700 rounded-md border border-transparent hover:border-pink-200"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-2 px-3 py-1 text-gray-700 rounded-md bg-pink-50 border border-pink-200">
                      {Icon && <Icon className="h-4 w-4" />}
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </motion.nav>
  );
}
