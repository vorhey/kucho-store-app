import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/ui/Footer";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProfilePage from "./pages/auth/profile";
import RequestResetPage from "./pages/auth/request-reset";
import ResetPasswordPage from "./pages/auth/reset-password";
import SignInPage from "./pages/auth/signin";
import SignUpPage from "./pages/auth/signup";
import CartPage from "./pages/cart";
import HomePage from "./pages/home";
import ProductDetailPage from "./pages/product/product-detail";
import ShopPage from "./pages/shop";
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
