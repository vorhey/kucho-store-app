import { Route, Router, Switch } from "wouter";
import ShopPage from "./pages/shop";
import HomePage from "./pages/home";
import CartPage from "./pages/cart";
import ProductDetailPage from "./pages/product/product-detail";
import { NavBar } from "./components/NavBar";
import { CartProvider } from "./context/CartContext";
import { Footer } from "./components/ui/Footer";
import "./index.css";

export function App() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="pt-14 flex-grow">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/shop" component={ShopPage} />
            <Route path="/cart" component={CartPage} />
            <Route path="/product/:id" component={ProductDetailPage} />
          </Switch>
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
}
