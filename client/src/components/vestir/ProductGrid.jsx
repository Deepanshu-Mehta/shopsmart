import { useState } from 'react';
import { useReveal } from './useReveal';
import { PRODUCTS } from './products.js';

const FILTERS = ['all', 'tops', 'bottoms', 'outerwear', 'accessories'];

export default function ProductGrid({ onOpenProduct, onQuickAdd }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const gridRef = useReveal({ gridMode: true });

  const visible = PRODUCTS.filter(p => activeFilter === 'all' || p.filter === activeFilter);

  return (
    <section
      id="arrivals"
      aria-label="New Arrivals"
      style={{ padding: '0 48px 96px' }}
      className="products-section"
    >
      {/* Heading */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 24,
        marginBottom: 32,
        paddingTop: 8,
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          letterSpacing: '0.2em',
          color: 'var(--color-muted)',
          textTransform: 'uppercase',
        }}>01</span>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 300,
        }}>New Arrivals</h2>
        <span style={{ flex: 1, height: 1, background: 'rgba(26,25,22,0.12)' }} />
      </div>

      {/* Filters */}
      <div
        role="tablist"
        aria-label="Product filters"
        style={{ display: 'flex', borderBottom: '1px solid rgba(26,25,22,0.12)', marginBottom: 48 }}
      >
        {FILTERS.map(f => (
          <button
            key={f}
            role="tab"
            aria-selected={activeFilter === f}
            data-hover
            onClick={() => setActiveFilter(f)}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: activeFilter === f ? 'var(--color-ink)' : 'var(--color-muted)',
              padding: '12px 20px',
              position: 'relative',
              transition: 'color 250ms',
              background: 'none',
              border: 'none',
            }}
          >
            {f}
            <span style={{
              position: 'absolute',
              bottom: -1, left: 0,
              height: 2,
              width: activeFilter === f ? '100%' : '0%',
              background: 'var(--color-ink)',
              transition: 'width 300ms var(--ease-out)',
            }} />
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="reveal-grid product-grid-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px 24px',
        }}
      >
        {visible.map(p => (
          <article
            key={p.id}
            className="product-card"
            data-hover
            onClick={() => onOpenProduct(p)}
            style={{ position: 'relative', overflow: 'hidden', cursor: 'none' }}
          >
            <div style={{
              position: 'relative',
              aspectRatio: '3/4',
              overflow: 'hidden',
              marginBottom: 16,
            }}>
              {/* default img */}
              <div
                className={`product-img-default ${p.imgClass}`}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  transition: 'opacity 400ms var(--ease-out)',
                  willChange: 'transform',
                }}
              />
              {/* hover img */}
              <div
                className={`product-img-hover ${p.hoverClass}`}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  opacity: 0,
                  border: '2px solid rgba(200,169,110,0.3)',
                  transition: 'opacity 400ms var(--ease-out)',
                  willChange: 'transform',
                }}
              />
              {/* quick add */}
              <button
                className="quick-add-btn"
                aria-label={`Quick add ${p.name} to bag`}
                onClick={e => { e.stopPropagation(); onQuickAdd(); }}
                data-hover
                style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
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
                  willChange: 'transform',
                }}
              >ADD TO BAG</button>
            </div>

            <div style={{ padding: '0 2px' }}>
              <h3 style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 400,
                color: 'var(--color-ink)',
                marginBottom: 4,
              }}>{p.name}</h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                marginBottom: 8,
              }}>{p.categoryLabel}</p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 300,
                color: 'var(--color-ink)',
              }}>{p.price}</p>
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .product-card:hover .product-img-default { opacity: 0 !important; }
        .product-card:hover .product-img-hover   { opacity: 1 !important; }
        .product-card:hover .quick-add-btn       { transform: translateY(0) !important; }
        .quick-add-btn:hover { background: var(--color-accent) !important; color: var(--color-ink) !important; }
        @media (max-width: 1023px) { .product-grid-layout { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 767px) {
          .products-section { padding: 0 24px 64px !important; }
          .product-grid-layout { grid-template-columns: repeat(2,1fr) !important; gap: 20px 12px !important; }
        }
        @media (max-width: 479px) {
          .product-grid-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
