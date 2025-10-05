import {
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
import type { LucideIcon } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

export function getShopBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: "Inicio", href: "/", icon: Cat },
    { label: "Tienda", icon: ShoppingBag },
  ];
}

export function getCartBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: "Inicio", href: "/", icon: Cat },
    { label: "Carrito", icon: ShoppingCart },
  ];
}

export function getProductBreadcrumbs(productName: string): BreadcrumbItem[] {
  return [
    { label: "Inicio", href: "/", icon: Cat },
    { label: "Tienda", href: "/shop", icon: ShoppingBag },
    { label: productName, icon: Package },
  ];
}

export function getProfileBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: "Inicio", href: "/", icon: Cat },
    { label: "Perfil", icon: User },
  ];
}

export function getSignInBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: "Inicio", href: "/", icon: Cat },
    { label: "Iniciar sesión", icon: LogIn },
  ];
}

export function getSignUpBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: "Inicio", href: "/", icon: Cat },
    { label: "Crear cuenta", icon: UserPlus },
  ];
}

export function getRequestResetBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: "Inicio", href: "/", icon: Cat },
    { label: "Recuperar acceso", icon: Mail },
  ];
}

export function getResetPasswordBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: "Inicio", href: "/", icon: Cat },
    { label: "Restablecer contraseña", icon: KeyRound },
  ];
}
