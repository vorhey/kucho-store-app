import { Route, Switch } from "wouter";
import ShopPage from "./pages/shop";
import HomePage from "./pages/home";
import CartPage from "./pages/cart";
import ProductDetailPage from "./pages/product/product-detail";
import { NavBar } from "./components/NavBar";
import { CartProvider } from "./context/CartContext";
import { Footer } from "./components/ui/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import SignInPage from "./pages/auth/signin";
import SignUpPage from "./pages/auth/signup";
import ResetPasswordPage from "./pages/auth/reset-password";
import RequestResetPage from "./pages/auth/request-reset";
import ProfilePage from "./pages/auth/profile";
import "./index.css";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <div className="pt-14 flex-grow">
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/shop" component={ShopPage} />
                <Route path="/cart" component={CartPage} />
                <Route path="/product/:id" component={ProductDetailPage} />
                <Route path="/signin" component={SignInPage} />
                <Route path="/signup" component={SignUpPage} />
                <Route path="/reset-password" component={ResetPasswordPage} />
                <Route path="/request-reset" component={RequestResetPage} />
                <Route path="/profile" component={ProfilePage} />
              </Switch>
            </div>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
