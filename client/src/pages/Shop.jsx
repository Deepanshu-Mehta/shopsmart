import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../components/vestir/products';

const CATEGORIES = ['all', 'women', 'men', 'essentials'];
const FILTERS = ['all', 'tops', 'bottoms', 'outerwear', 'accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = [
  { value: 'sand', label: 'Sand', bg: '#C8B09A' },
  { value: 'slate', label: 'Slate', bg: '#8C8880' },
  { value: 'noir', label: 'Noir', bg: '#1A1916' },
  { value: 'gold', label: 'Gold', bg: '#C8A96E' },
];
const PRICE_RANGES = [
  { value: 'all', label: 'All Prices' },
  { value: '0-5000', label: 'Under ₹5,000' },
  { value: '5000-10000', label: '₹5,000 - ₹10,000' },
  { value: '10000+', label: 'Above ₹10,000' },
];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

export default function Shop({ onOpenProduct, onQuickAdd }) {
  const { products, loading } = useProducts();
  const [category, setCategory] = useState('all');
  const [filter, setFilter] = useState('all');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setCategory('all');
    setFilter('all');
    setSelectedSizes([]);
    setSelectedColor(null);
    setPriceRange('all');
    setSortBy('newest');
  };

  const hasActiveFilters =
    category !== 'all' ||
    filter !== 'all' ||
    selectedSizes.length > 0 ||
    selectedColor ||
    priceRange !== 'all';

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (category !== 'all') {
      result = result.filter((p) => p.categoryLabel?.toLowerCase().includes(category));
    }

    // Type filter
    if (filter !== 'all') {
      result = result.filter((p) => p.filter === filter);
    }

    // Price filter
    if (priceRange !== 'all') {
      result = result.filter((p) => {
        const price = p.price / 100;
        if (priceRange === '0-5000') return price < 5000;
        if (priceRange === '5000-10000') return price >= 5000 && price <= 10000;
        if (priceRange === '10000+') return price > 10000;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.id - a.id; // newest
    });

    return result;
  }, [products, category, filter, priceRange, sortBy]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Header */}
      <div
        style={{
          padding: '120px 48px 48px',
          borderBottom: '1px solid rgba(26,25,22,0.12)',
        }}
        className="shop-header"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 300,
            letterSpacing: '-0.01em',
            marginBottom: 24,
          }}
        >
          Shop All
        </motion.h1>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              data-hover
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: category === cat ? 'var(--color-ink)' : 'var(--color-muted)',
                background: 'none',
                border: 'none',
                paddingBottom: 8,
                borderBottom: category === cat ? '2px solid var(--color-ink)' : '2px solid transparent',
                transition: 'all 250ms',
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 48px',
          borderBottom: '1px solid rgba(26,25,22,0.08)',
        }}
        className="shop-toolbar"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            data-hover
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              border: '1px solid rgba(26,25,22,0.12)',
              background: showFilters ? 'var(--color-ink)' : 'transparent',
              color: showFilters ? 'var(--color-bg)' : 'var(--color-ink)',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              transition: 'all 250ms',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 3H13M3 7H11M5 11H9" stroke="currentColor" strokeWidth="1" />
            </svg>
            Filters
            {hasActiveFilters && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                }}
              />
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              data-hover
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                letterSpacing: '0.1em',
                color: 'var(--color-muted)',
                background: 'none',
                border: 'none',
                textDecoration: 'underline',
              }}
            >
              Clear All
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--color-muted)',
            }}
          >
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 32px 8px 12px',
              border: '1px solid rgba(26,25,22,0.12)',
              background: 'var(--color-bg)',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--color-ink)',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%231a1916' fill='none'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden', borderBottom: '1px solid rgba(26,25,22,0.08)' }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 48,
                padding: '32px 48px',
              }}
              className="filter-panel"
            >
              {/* Type */}
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-muted)',
                    marginBottom: 16,
                  }}
                >
                  Type
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      data-hover
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: filter === f ? 'var(--color-ink)' : 'var(--color-muted)',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        textTransform: 'capitalize',
                        transition: 'color 200ms',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-muted)',
                    marginBottom: 16,
                  }}
                >
                  Size
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      data-hover
                      style={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: selectedSizes.includes(size)
                          ? '1.5px solid var(--color-ink)'
                          : '1px solid rgba(26,25,22,0.12)',
                        background: selectedSizes.includes(size) ? 'var(--color-ink)' : 'none',
                        color: selectedSizes.includes(size) ? 'var(--color-bg)' : 'var(--color-ink)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        transition: 'all 200ms',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-muted)',
                    marginBottom: 16,
                  }}
                >
                  Color
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(selectedColor === color.value ? null : color.value)}
                      data-hover
                      title={color.label}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: color.bg,
                        border: 'none',
                        outline: selectedColor === color.value
                          ? '2px solid var(--color-ink)'
                          : '2px solid transparent',
                        outlineOffset: 2,
                        transition: 'outline-color 200ms',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-muted)',
                    marginBottom: 16,
                  }}
                >
                  Price
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setPriceRange(range.value)}
                      data-hover
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: priceRange === range.value ? 'var(--color-ink)' : 'var(--color-muted)',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        transition: 'color 200ms',
                      }}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <div style={{ padding: '48px' }} className="shop-grid-container">
        {loading ? (
          <div
            style={{
              textAlign: 'center',
              padding: '96px 0',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              letterSpacing: '0.2em',
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
            }}
          >
            Loading...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '96px 0',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                fontWeight: 300,
                marginBottom: 16,
              }}
            >
              No products found
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--color-muted)',
                marginBottom: 24,
              }}
            >
              Try adjusting your filters
            </p>
            <button
              onClick={clearFilters}
              data-hover
              style={{
                padding: '14px 32px',
                background: 'var(--color-ink)',
                color: 'var(--color-bg)',
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                border: 'none',
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="shop-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '32px 24px',
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p, index) => (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.03,
                    layout: { type: 'spring', stiffness: 300, damping: 30 },
                  }}
                  className="product-card"
                  data-hover
                  onClick={() => onOpenProduct(p)}
                  onMouseEnter={() => setQuickViewProduct(p)}
                  onMouseLeave={() => setQuickViewProduct(null)}
                  style={{ position: 'relative', overflow: 'hidden', cursor: 'none' }}
                >
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '3/4',
                      overflow: 'hidden',
                      marginBottom: 16,
                    }}
                  >
                    {/* default img */}
                    {p.imgUrl ? (
                      <img
                        src={p.imgUrl}
                        alt={p.name}
                        className="product-img-default"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'opacity 400ms var(--ease-out), transform 600ms var(--ease-out)',
                        }}
                      />
                    ) : (
                      <div
                        className={`product-img-default ${p.imgClass}`}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          transition: 'opacity 400ms var(--ease-out), transform 600ms var(--ease-out)',
                        }}
                      />
                    )}
                    {/* hover img */}
                    {p.hoverImgUrl ? (
                      <img
                        src={p.hoverImgUrl}
                        alt={`${p.name} alternate view`}
                        className="product-img-hover"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: 0,
                          transition: 'opacity 400ms var(--ease-out)',
                        }}
                      />
                    ) : (
                      <div
                        className={`product-img-hover ${p.hoverClass}`}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          transition: 'opacity 400ms var(--ease-out)',
                        }}
                      />
                    )}

                    {/* quick add */}
                    <button
                      className="quick-add-btn"
                      aria-label={`Quick add ${p.name} to bag`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(p);
                      }}
                      data-hover
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'var(--color-ink)',
                        color: 'var(--color-invert-fg)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 10,
                        fontWeight: 400,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        padding: 14,
                        textAlign: 'center',
                        transform: 'translateY(100%)',
                        transition: 'transform 350ms var(--ease-out), background 300ms',
                        border: 'none',
                        width: '100%',
                      }}
                    >
                      ADD TO BAG
                    </button>
                  </div>

                  <div style={{ padding: '0 2px' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 14,
                        fontWeight: 400,
                        color: 'var(--color-ink)',
                        marginBottom: 4,
                      }}
                    >
                      {p.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--color-muted)',
                        marginBottom: 8,
                      }}
                    >
                      {p.categoryLabel}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 18,
                        fontWeight: 300,
                        color: 'var(--color-ink)',
                      }}
                    >
                      {p.priceLabel}
                    </p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <style>{`
        .product-card:hover .product-img-default { opacity: 0 !important; transform: scale(1.02); }
        .product-card:hover .product-img-hover   { opacity: 1 !important; }
        .product-card:hover .quick-add-btn       { transform: translateY(0) !important; }
        .quick-add-btn:hover { background: var(--color-accent) !important; color: var(--color-ink) !important; }
        @media (max-width: 1200px) { .shop-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 1023px) {
          .shop-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .filter-panel { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 767px) {
          .shop-header { padding: 100px 24px 32px !important; }
          .shop-toolbar { padding: 16px 24px !important; flex-wrap: wrap; gap: 12px; }
          .shop-grid-container { padding: 24px !important; }
          .shop-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px 12px !important; }
          .filter-panel { grid-template-columns: 1fr 1fr !important; gap: 24px !important; padding: 24px !important; }
        }
      `}</style>
    </div>
  );
}
