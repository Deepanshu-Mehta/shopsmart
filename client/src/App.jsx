import { useState, lazy, Suspense } from 'react';

import Nav             from './components/vestir/Nav';
import Hero            from './components/vestir/Hero';
import Ticker          from './components/vestir/Ticker';
import Categories      from './components/vestir/Categories';
import ProductGrid     from './components/vestir/ProductGrid';
import BrandStory      from './components/vestir/BrandStory';
import Editorial       from './components/vestir/Editorial';
import Press           from './components/vestir/Press';
import Newsletter      from './components/vestir/Newsletter';
import Footer          from './components/vestir/Footer';
import ProductModal    from './components/vestir/ProductModal';
import MobileStickyBar from './components/vestir/MobileStickyBar';

const Cursor = lazy(() => import('./components/vestir/Cursor'));

export default function App() {
  const [cartCount, setCartCount]         = useState(0);
  const [activeProduct, setActiveProduct] = useState(null);

  const addToCart = () => setCartCount(c => c + 1);

  return (
    <>
      <Suspense fallback={null}>
        <Cursor />
      </Suspense>
      <Nav cartCount={cartCount} />
      <main>
        <Hero />
        <Ticker />
        <Categories />
        <ProductGrid
          onOpenProduct={setActiveProduct}
          onQuickAdd={addToCart}
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
        onAddToCart={addToCart}
      />
      <MobileStickyBar onAdd={addToCart} />
    </>
  );
}
