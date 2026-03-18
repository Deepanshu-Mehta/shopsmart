import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = [
  { bg: '#C8B09A', label: 'Sand' },
  { bg: '#8C8880', label: 'Slate' },
  { bg: '#1A1916', label: 'Noir' },
  { bg: '#C8A96E', label: 'Gold' },
];

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [size, setSize] = useState('S');
  const [color, setColor] = useState('Sand');
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);
  const [addState, setAddState] = useState('idle');
  const [accordionOpen, setAccordionOpen] = useState(null);
  const [fullProduct, setFullProduct] = useState(null);

  useEffect(() => {
    if (product) {
      requestAnimationFrame(() => setOpen(true));
      document.body.style.overflow = 'hidden';
      setSize('S');
      setColor('Sand');
      setQty(1);
      setAddState('idle');
      setAccordionOpen(null);
      setFullProduct(null);
      fetch(`${API_URL}/api/products/${product.id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) setFullProduct(data);
        })
        .catch(() => {});
    } else {
      setOpen(false);
      document.body.style.overflow = '';
    }
  }, [product]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 500);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setTimeout(onClose, 500);
        document.body.style.overflow = '';
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleAdd = () => {
    if (addState !== 'idle') return;
    setAddState('adding');
    setTimeout(() => {
      setAddState('added');
      onAddToCart(product, { size, color, quantity: qty });
      setTimeout(() => {
        setAddState('idle');
      }, 1500);
    }, 600);
  };

  const addLabel =
    addState === 'adding' ? 'ADDING...' : addState === 'added' ? 'ADDED ✓' : 'ADD TO BAG';

  if (!product) return null;

  const p = fullProduct || product;
  const accordions = [
    { key: 'details', label: 'Details', text: p.details || 'Loading…' },
    { key: 'materials', label: 'Materials', text: p.materials || 'Loading…' },
    { key: 'shipping', label: 'Shipping', text: p.shipping || 'Loading…' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: open ? 'rgba(26,25,22,0.5)' : 'rgba(26,25,22,0)',
          zIndex: 2000,
          transition: 'background 400ms var(--ease-out)',
          pointerEvents: open ? 'all' : 'none',
        }}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Product detail"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 'min(480px, 100vw)',
          height: '100vh',
          background: 'var(--color-bg)',
          zIndex: 2001,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 500ms cubic-bezier(0.16,1,0.3,1)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          willChange: 'transform',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '28px 32px',
            borderBottom: '1px solid rgba(26,25,22,0.12)',
            position: 'sticky',
            top: 0,
            background: 'var(--color-bg)',
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
            }}
          >
            Product Details
          </span>
          <button
            onClick={handleClose}
            data-hover
            aria-label="Close product panel"
            style={{
              fontSize: 20,
              fontWeight: 300,
              color: 'var(--color-ink)',
              transition: 'color 250ms',
            }}
            className="modal-close-btn"
          >
            ×
          </button>
        </div>

        {/* Image */}
        {product.imgUrl ? (
          <img
            src={product.imgUrl}
            alt={product.name}
            style={{ aspectRatio: '3/4', width: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            className={product.imgClass}
            style={{ aspectRatio: '3/4', width: '100%' }}
            aria-hidden="true"
          />
        )}

        {/* Body */}
        <div style={{ padding: 32, flex: 1 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 300,
              marginBottom: 4,
            }}
          >
            {product.name}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              marginBottom: 16,
            }}
          >
            {product.categoryLabel}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 300,
              marginBottom: 32,
            }}
          >
            {product.priceLabel || product.price}
          </p>

          {/* Size */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              marginBottom: 12,
            }}
          >
            Select Size
          </p>
          <div
            role="group"
            aria-label="Size selector"
            style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}
          >
            {SIZES.map((s) => (
              <button
                key={s}
                data-hover
                onClick={() => setSize(s)}
                style={{
                  width: 48,
                  height: 48,
                  border:
                    size === s ? '1.5px solid var(--color-ink)' : '1px solid rgba(26,25,22,0.12)',
                  background: size === s ? 'var(--color-ink)' : 'none',
                  color: size === s ? 'var(--color-bg)' : 'var(--color-ink)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  transition: 'background 250ms, color 250ms, border-color 250ms',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Color */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              marginBottom: 12,
            }}
          >
            Colour
          </p>
          <div
            role="group"
            aria-label="Colour selector"
            style={{ display: 'flex', gap: 12, marginBottom: 32 }}
          >
            {COLORS.map((c) => (
              <button
                key={c.label}
                data-hover
                aria-label={c.label}
                title={c.label}
                onClick={() => setColor(c.label)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: c.bg,
                  border: 'none',
                  outline:
                    color === c.label ? '2px solid var(--color-ink)' : '2px solid transparent',
                  outlineOffset: 2,
                  transition: 'outline-color 250ms',
                }}
              />
            ))}
          </div>

          {/* Quantity */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              marginBottom: 12,
            }}
          >
            Quantity
          </p>
          <div
            role="group"
            aria-label="Quantity"
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid rgba(26,25,22,0.12)',
              width: 'fit-content',
              marginBottom: 24,
            }}
          >
            <button
              data-hover
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 300,
                color: 'var(--color-ink)',
              }}
              aria-label="Decrease quantity"
              className="qty-btn"
            >
              −
            </button>
            <span
              aria-live="polite"
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                borderLeft: '1px solid rgba(26,25,22,0.12)',
                borderRight: '1px solid rgba(26,25,22,0.12)',
              }}
            >
              {qty}
            </span>
            <button
              data-hover
              onClick={() => setQty((q) => q + 1)}
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 300,
                color: 'var(--color-ink)',
              }}
              aria-label="Increase quantity"
              className="qty-btn"
            >
              +
            </button>
          </div>

          {/* Add to bag */}
          <button
            data-hover
            onClick={handleAdd}
            className="modal-add-btn"
            style={{
              width: '100%',
              padding: 18,
              background: addState === 'added' ? 'var(--color-accent)' : 'var(--color-ink)',
              color: addState === 'added' ? 'var(--color-ink)' : 'var(--color-invert-fg)',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 24,
              transition: 'background 300ms, color 300ms',
              border: 'none',
            }}
          >
            {addLabel}
          </button>

          {/* Accordion */}
          {accordions.map((a) => (
            <div key={a.key} style={{ borderTop: '1px solid rgba(26,25,22,0.12)' }}>
              <button
                data-hover
                onClick={() => setAccordionOpen(accordionOpen === a.key ? null : a.key)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink)',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                }}
              >
                <span>{a.label}</span>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 300,
                    transform: accordionOpen === a.key ? 'rotate(45deg)' : 'none',
                    transition: 'transform 300ms',
                    display: 'inline-block',
                  }}
                >
                  +
                </span>
              </button>
              <div className={`accordion-body${accordionOpen === a.key ? ' open' : ''}`}>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: 300,
                    color: 'var(--color-muted)',
                    lineHeight: 1.7,
                    paddingBottom: 16,
                  }}
                >
                  {a.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <style>{`
        .modal-close-btn:hover { color: var(--color-muted) !important; }
        .qty-btn:hover { background: var(--color-surface) !important; }
        .modal-add-btn:not([style*="accent"]):hover { background: var(--color-accent) !important; color: var(--color-ink) !important; }
      `}</style>
    </>
  );
}
