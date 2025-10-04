import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  className?: string;
  finalLabel?: string;
  items?: BreadcrumbItem[];
}

const LABEL_MAP: Record<string, string> = {
  "": "Inicio",
  shop: "Colección",
  cart: "Carrito",
  product: "Producto",
  signin: "Iniciar sesión",
  signup: "Crear cuenta",
  profile: "Perfil",
  "reset-password": "Restablecer contraseña",
  "request-reset": "Recuperar acceso",
};

function formatSegment(segment: string) {
  const decoded = decodeURIComponent(segment);
  const clean = decoded.replace(/-/g, " ");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function Breadcrumbs({ className, finalLabel, items }: BreadcrumbsProps) {
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
      const label = isLast && finalLabel ? finalLabel : mappedLabel || formatSegment(segment);

      return {
        label,
        href: isLast ? undefined : href,
      };
    });

    return [
      {
        label: LABEL_MAP[""] || "Inicio",
        href: "/",
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
      <div className="relative overflow-hidden rounded-2xl border border-pink-100/70 bg-gradient-to-r from-pink-50 via-rose-50/90 to-indigo-50/70 p-3 shadow-sm backdrop-blur">
        <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-pink-200/30" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-16 w-16 rounded-full bg-purple-200/30" />
        <div className="pointer-events-none absolute right-6 bottom-2 h-7 w-7 rounded-full bg-white/40" />
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pink-500 shadow-sm">
            <PawPrint className="h-4 w-4" />
            Estás aquí
          </span>
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;

              return (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-3">
                  {index !== 0 && (
                    <ChevronRight className="h-3 w-3 text-pink-300" aria-hidden />
                  )}
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="rounded-full border border-pink-100/60 bg-white/80 px-3 py-1 text-pink-600 shadow-sm transition-colors hover:bg-white hover:text-pink-700"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 px-3 py-1 text-white shadow">
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

