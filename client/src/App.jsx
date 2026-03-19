import { useState, useEffect, lazy, Suspense } from 'react';

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

const Cursor = lazy(() => import('./components/vestir/Cursor'));

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function App() {
  const [cartItems, setCartItems] = useState([]); // source of truth for cart
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [user, setUser] = useState(null);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

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
      // Not logged in — bump a visual-only count with a fake item
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

    // Optimistic update — show immediately, replace with real server item after
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
        // Replace temp placeholder with real server item (gives us real ID)
        setCartItems((prev) => prev.map((i) => (i.id === tempId ? item : i)));
      }
    } catch {
      // Revert optimistic update on failure
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
      <main>
        <Hero />
        <Ticker />
        <Categories />
        <ProductGrid
          onOpenProduct={setActiveProduct}
          onQuickAdd={(product) => addToCart(product)}
        />
        <BrandStory />
        <Editorial onOpenProduct={setActiveProduct} />
        <Press />
        <Newsletter />
      </main>
      <Footer />
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
      <MobileStickyBar onAdd={() => addToCart(activeProduct)} />
    </>
  );
}
