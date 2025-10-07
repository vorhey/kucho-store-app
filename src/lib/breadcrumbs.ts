import type { LucideIcon } from "lucide-react";
import {
  Cat,
  KeyRound,
  LogIn,
  Mail,
  Package,
  ShoppingBag,
  ShoppingCart,
  User,
  UserPlus,
} from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

export enum BreadcrumbType {
  Shop = "shop",
  Cart = "cart",
  Product = "product",
  Profile = "profile",
  SignIn = "sign-in",
  SignUp = "sign-up",
  RequestReset = "request-reset",
  ResetPassword = "reset-password",
}

const home: BreadcrumbItem = { label: "Inicio", href: "/", icon: Cat };

interface BreadcrumbOptions {
  productName?: string;
}

export function getBreadcrumbs(
  type: BreadcrumbType,
  options?: BreadcrumbOptions,
): BreadcrumbItem[] {
  switch (type) {
    case BreadcrumbType.Shop:
      return [home, { label: "Tienda", icon: ShoppingBag }];
    case BreadcrumbType.Cart:
      return [home, { label: "Carrito", icon: ShoppingCart }];
    case BreadcrumbType.Product: {
      if (!options?.productName) {
        throw new Error("Missing productName option for product breadcrumbs");
      }
      return [
        home,
        { label: "Tienda", href: "/shop", icon: ShoppingBag },
        { label: options.productName, icon: Package },
      ];
    }
    case BreadcrumbType.Profile:
      return [home, { label: "Perfil", icon: User }];
    case BreadcrumbType.SignIn:
      return [home, { label: "Iniciar sesión", icon: LogIn }];
    case BreadcrumbType.SignUp:
      return [home, { label: "Crear cuenta", icon: UserPlus }];
    case BreadcrumbType.RequestReset:
      return [home, { label: "Recuperar acceso", icon: Mail }];
    case BreadcrumbType.ResetPassword:
      return [home, { label: "Restablecer contraseña", icon: KeyRound }];
    default: {
      const exhaustiveCheck: never = type;
      throw new Error(`Unhandled breadcrumb type: ${exhaustiveCheck}`);
    }
  }
}
