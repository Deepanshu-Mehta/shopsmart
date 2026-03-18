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

const Cursor = lazy(() => import('./components/vestir/Cursor'));

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch current user on mount
  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => {});
  }, []);

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
    setCartCount(0);
  };

  const addToCart = async (product, { size = 'M', color = 'Default', quantity = 1 } = {}) => {
    if (user && product?.id) {
      try {
        await fetch(`${API_URL}/api/cart/items`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity, size, color }),
        });
      } catch {
        // Optimistic count update regardless
      }
    }
    setCartCount((c) => c + 1);
  };

  // Called by CartDrawer after remove/update — re-sync count
  const refreshCartCount = () => {
    if (!user) return;
    fetch(`${API_URL}/api/cart`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setCartCount(data.items.reduce((s, i) => s + i.quantity, 0));
      })
      .catch(() => {});
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
      />
      <main>
        <Hero />
        <Ticker />
        <Categories />
        <ProductGrid onOpenProduct={setActiveProduct} onQuickAdd={() => addToCart(null)} />
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
        onCartCountChange={refreshCartCount}
      />
      <MobileStickyBar onAdd={() => addToCart(null)} />
    </>
  );
}
