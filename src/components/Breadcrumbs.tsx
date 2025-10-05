import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface BreadcrumbsProps {
  className?: string;
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ className, items }: BreadcrumbsProps) {
  if (items?.length === 0) {
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
            {items?.map((crumb, index) => {
              const isLast = index === items?.length - 1;
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
