import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Nav from './components/vestir/Nav';
import Hero from './components/vestir/Hero';
import Ticker from './components/vestir/Ticker';
import Categories from './components/vestir/Categories';
import ProductGrid from './components/vestir/ProductGrid';
import BrandStory from './components/vestir/BrandStory';
import Editorial from './components/vestir/Editorial';
import Press from './components/vestir/Press';
import Newsletter from './components/vestir/Newsletter';
import Footer from './components/vestir/Footer';
import ProductModal from './components/vestir/ProductModal';
import CartDrawer from './components/vestir/CartDrawer';
import MobileStickyBar from './components/vestir/MobileStickyBar';
import AuthModal from './components/vestir/AuthModal';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import { useProducts } from './components/vestir/products';

const Cursor = lazy(() => import('./components/vestir/Cursor'));

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function HomePage({ onOpenProduct, addToCart }) {
  return (
    <main>
      <Hero />
      <Ticker />
      <Categories />
      <ProductGrid
        onOpenProduct={onOpenProduct}
        onQuickAdd={(product) => addToCart(product)}
      />
      <BrandStory />
      <Editorial onOpenProduct={onOpenProduct} />
      <Press />
      <Newsletter />
    </main>
  );
}

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { products } = useProducts();

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Fetch current user on mount
  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => {});
  }, []);

  // Load cart whenever user logs in
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }
    fetch(`${API_URL}/api/cart`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setCartItems(data.items);
      })
      .catch(() => {});
  }, [user]);

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
    setCartItems([]);
  };

  const addToCart = async (product, { size = 'M', color = 'Default', quantity = 1 } = {}) => {
    if (!product?.id) return;

    if (!user) {
      setCartItems((prev) => {
        const existing = prev.find(
          (i) => i.product?.id === product.id && i.size === size && i.color === color
        );
        if (existing)
          return prev.map((i) => (i === existing ? { ...i, quantity: i.quantity + quantity } : i));
        return [...prev, { id: `guest-${Date.now()}`, product, quantity, size, color }];
      });
      return;
    }

    const tempId = `temp-${Date.now()}`;
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.product?.id === product.id && i.size === size && i.color === color
      );
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { id: tempId, product, quantity, size, color }];
    });

    try {
      const res = await fetch(`${API_URL}/api/cart/items`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity, size, color }),
      });
      if (res.ok) {
        const item = await res.json();
        setCartItems((prev) => prev.map((i) => (i.id === tempId ? item : i)));
      }
    } catch {
      setCartItems((prev) => {
        const withoutTemp = prev.filter((i) => i.id !== tempId);
        const existing = withoutTemp.find(
          (i) => i.product?.id === product.id && i.size === size && i.color === color
        );
        if (existing) {
          return withoutTemp.map((i) =>
            i === existing ? { ...i, quantity: i.quantity - quantity } : i
          );
        }
        return withoutTemp;
      });
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <>
      <Suspense fallback={null}>
        <Cursor />
      </Suspense>
      <Nav
        cartCount={cartCount}
        user={user}
        onLogout={logout}
        onCartOpen={() => setCartOpen(true)}
        onAuthOpen={() => setAuthOpen(true)}
      />
      
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onOpenProduct={setActiveProduct}
              addToCart={addToCart}
            />
          }
        />
        <Route
          path="/shop"
          element={
            <Shop
              onOpenProduct={setActiveProduct}
              onQuickAdd={(product) => addToCart(product)}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductDetail
              onAddToCart={addToCart}
              relatedProducts={products.slice(0, 4)}
            />
          }
        />
      </Routes>

      {isHomePage && <Footer />}
      {!isHomePage && <Footer />}

      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={(product, opts) => addToCart(product, opts)}
      />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        user={user}
        cartItems={cartItems}
        onCartItemsChange={setCartItems}
        onAuthOpen={() => setAuthOpen(true)}
      />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={(data) => setUser(data)}
      />
      <MobileStickyBar onAdd={() => addToCart(activeProduct)} product={activeProduct} />
    </>
  );
}
