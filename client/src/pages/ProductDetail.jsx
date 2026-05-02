import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = [
  { bg: '#C8B09A', label: 'Sand' },
  { bg: '#8C8880', label: 'Slate' },
  { bg: '#1A1916', label: 'Noir' },
  { bg: '#C8A96E', label: 'Gold' },
];

const SIZE_GUIDE = {
  XS: { chest: '84-88', waist: '68-72', hips: '88-92' },
  S: { chest: '88-92', waist: '72-76', hips: '92-96' },
  M: { chest: '92-96', waist: '76-80', hips: '96-100' },
  L: { chest: '100-104', waist: '84-88', hips: '104-108' },
  XL: { chest: '108-112', waist: '92-96', hips: '112-116' },
};

export default function ProductDetail({ onAddToCart, relatedProducts = [] }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('Sand');
  const [qty, setQty] = useState(1);
  const [addState, setAddState] = useState('idle');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/products/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setProduct(data);
        setLoading(false);
        setSelectedImage(0);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (addState !== 'idle' || !product) return;
    setAddState('adding');
    setTimeout(() => {
      setAddState('added');
      onAddToCart(product, { size, color, quantity: qty });
      setTimeout(() => setAddState('idle'), 1500);
    }, 600);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          letterSpacing: '0.2em',
          color: 'var(--color-muted)',
          textTransform: 'uppercase',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            fontWeight: 300,
            marginBottom: 24,
          }}
        >
          Product not found
        </p>
        <Link
          to="/shop"
          data-hover
          style={{
            padding: '14px 32px',
            background: 'var(--color-ink)',
            color: 'var(--color-bg)',
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  // Generate mock gallery images (in real app, these would come from product data)
  const galleryImages = product.imgUrl
    ? [product.imgUrl, product.hoverImgUrl || product.imgUrl]
    : [product.imgClass, product.hoverClass || product.imgClass];

  const accordions = [
    { key: 'details', label: 'Details', content: product.details || 'Expertly crafted with meticulous attention to detail. This piece embodies the essence of contemporary luxury.' },
    { key: 'materials', label: 'Materials & Care', content: product.materials || '100% Premium Natural Fibres. Dry clean recommended. Store in a cool, dry place.' },
    { key: 'shipping', label: 'Shipping & Returns', content: product.shipping || 'Complimentary shipping on orders over ₹5,000. Free returns within 14 days of delivery.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Breadcrumb */}
      <div
        style={{
          padding: '100px 48px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
        className="pdp-breadcrumb"
      >
        <Link
          to="/"
          data-hover
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            letterSpacing: '0.12em',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
          }}
        >
          Home
        </Link>
        <span style={{ color: 'var(--color-muted)' }}>/</span>
        <Link
          to="/shop"
          data-hover
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            letterSpacing: '0.12em',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
          }}
        >
          Shop
        </Link>
        <span style={{ color: 'var(--color-muted)' }}>/</span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            letterSpacing: '0.12em',
            color: 'var(--color-ink)',
            textTransform: 'uppercase',
          }}
        >
          {product.name}
        </span>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 64,
          padding: '0 48px 96px',
        }}
        className="pdp-main"
      >
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Image with Zoom */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '3/4',
              overflow: 'hidden',
              marginBottom: 16,
              cursor: 'crosshair',
            }}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transform: isZooming ? 'scale(1.5)' : 'scale(1)',
                  transition: 'transform 300ms var(--ease-out)',
                }}
              >
                {product.imgUrl ? (
                  <img
                    src={galleryImages[selectedImage]}
                    alt={`${product.name} - View ${selectedImage + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    className={galleryImages[selectedImage]}
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Zoom indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                padding: '8px 12px',
                background: 'rgba(26,25,22,0.7)',
                color: 'var(--color-bg)',
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                opacity: isZooming ? 0 : 0.6,
                transition: 'opacity 200ms',
              }}
            >
              Hover to zoom
            </div>
          </div>

          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: 12 }}>
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                data-hover
                style={{
                  width: 80,
                  height: 100,
                  border: selectedImage === idx
                    ? '2px solid var(--color-ink)'
                    : '2px solid transparent',
                  background: 'none',
                  padding: 0,
                  overflow: 'hidden',
                  transition: 'border-color 200ms',
                }}
              >
                {product.imgUrl ? (
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className={img} style={{ width: '100%', height: '100%' }} />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ paddingTop: 32 }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              marginBottom: 12,
            }}
          >
            {product.categoryLabel}
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 300,
              marginBottom: 16,
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 300,
              marginBottom: 32,
            }}
          >
            {product.priceLabel}
          </p>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 300,
              color: 'var(--color-muted)',
              lineHeight: 1.7,
              marginBottom: 40,
            }}
          >
            {product.description || 'A timeless piece that seamlessly blends sophistication with everyday wearability. Crafted from the finest materials for discerning tastes.'}
          </p>

          {/* Size Selection */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                }}
              >
                Select Size
              </p>
              <button
                onClick={() => setShowSizeGuide(true)}
                data-hover
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  background: 'none',
                  border: 'none',
                  textDecoration: 'underline',
                }}
              >
                Size Guide
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {SIZES.map((s) => (
                <button
                  key={s}
                  data-hover
                  onClick={() => setSize(s)}
                  style={{
                    width: 52,
                    height: 52,
                    border: size === s ? '1.5px solid var(--color-ink)' : '1px solid rgba(26,25,22,0.12)',
                    background: size === s ? 'var(--color-ink)' : 'none',
                    color: size === s ? 'var(--color-bg)' : 'var(--color-ink)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    transition: 'all 200ms',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div style={{ marginBottom: 32 }}>
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
              Colour: {color}
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {COLORS.map((c) => (
                <button
                  key={c.label}
                  data-hover
                  aria-label={c.label}
                  title={c.label}
                  onClick={() => setColor(c.label)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: c.bg,
                    border: 'none',
                    outline: color === c.label ? '2px solid var(--color-ink)' : '2px solid transparent',
                    outlineOffset: 3,
                    transition: 'outline-color 200ms',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: 32 }}>
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
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgba(26,25,22,0.12)',
                width: 'fit-content',
              }}
            >
              <button
                data-hover
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 300,
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-ink)',
                }}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span
                style={{
                  width: 48,
                  height: 48,
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
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 300,
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-ink)',
                }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <motion.button
            data-hover
            onClick={handleAdd}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{
              width: '100%',
              padding: 20,
              background: addState === 'added' ? 'var(--color-accent)' : 'var(--color-ink)',
              color: addState === 'added' ? 'var(--color-ink)' : 'var(--color-invert-fg)',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              border: 'none',
              marginBottom: 40,
              transition: 'background 300ms, color 300ms',
            }}
          >
            {addState === 'adding' ? 'ADDING...' : addState === 'added' ? 'ADDED TO BAG' : 'ADD TO BAG'}
          </motion.button>

          {/* Accordions */}
          <div style={{ borderTop: '1px solid rgba(26,25,22,0.12)' }}>
            {accordions.map((a) => (
              <div key={a.key} style={{ borderBottom: '1px solid rgba(26,25,22,0.12)' }}>
                <button
                  data-hover
                  onClick={() => setActiveAccordion(activeAccordion === a.key ? null : a.key)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
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
                  <motion.span
                    animate={{ rotate: activeAccordion === a.key ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: 20, fontWeight: 300 }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {activeAccordion === a.key && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          fontWeight: 300,
                          color: 'var(--color-muted)',
                          lineHeight: 1.7,
                          paddingBottom: 20,
                        }}
                      >
                        {a.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Complete the Look / Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ padding: '64px 48px 96px', borderTop: '1px solid rgba(26,25,22,0.12)' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 24,
              marginBottom: 48,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                letterSpacing: '0.2em',
                color: 'var(--color-muted)',
                textTransform: 'uppercase',
              }}
            >
              Style
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: 300,
              }}
            >
              Complete the Look
            </h2>
            <span style={{ flex: 1, height: 1, background: 'rgba(26,25,22,0.12)' }} />
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
            }}
            className="related-grid"
          >
            {relatedProducts.slice(0, 4).map((p, index) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="product-card"
                data-hover
                style={{ cursor: 'none' }}
              >
                <Link to={`/product/${p.id}`}>
                  <div
                    style={{
                      aspectRatio: '3/4',
                      marginBottom: 16,
                      overflow: 'hidden',
                    }}
                  >
                    {p.imgUrl ? (
                      <img
                        src={p.imgUrl}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className={p.imgClass} style={{ width: '100%', height: '100%' }} />
                    )}
                  </div>
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
                      fontFamily: 'var(--font-display)',
                      fontSize: 16,
                      fontWeight: 300,
                      color: 'var(--color-ink)',
                    }}
                  >
                    {p.priceLabel}
                  </p>
                </Link>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeGuide(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(26,25,22,0.5)',
                zIndex: 2000,
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'var(--color-bg)',
                padding: 48,
                zIndex: 2001,
                maxWidth: 560,
                width: '90%',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 28,
                    fontWeight: 300,
                  }}
                >
                  Size Guide
                </h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  data-hover
                  style={{
                    fontSize: 24,
                    fontWeight: 300,
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-ink)',
                  }}
                >
                  x
                </button>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  color: 'var(--color-muted)',
                  marginBottom: 24,
                }}
              >
                Measurements in centimeters (cm)
              </p>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontFamily: 'var(--font-body)',
                        fontSize: 10,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--color-muted)',
                        borderBottom: '1px solid rgba(26,25,22,0.12)',
                      }}
                    >
                      Size
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        fontFamily: 'var(--font-body)',
                        fontSize: 10,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--color-muted)',
                        borderBottom: '1px solid rgba(26,25,22,0.12)',
                      }}
                    >
                      Chest
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        fontFamily: 'var(--font-body)',
                        fontSize: 10,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--color-muted)',
                        borderBottom: '1px solid rgba(26,25,22,0.12)',
                      }}
                    >
                      Waist
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        fontFamily: 'var(--font-body)',
                        fontSize: 10,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--color-muted)',
                        borderBottom: '1px solid rgba(26,25,22,0.12)',
                      }}
                    >
                      Hips
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SIZES.map((s) => (
                    <tr key={s}>
                      <td
                        style={{
                          padding: '12px 16px',
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          fontWeight: size === s ? 500 : 400,
                          color: size === s ? 'var(--color-ink)' : 'var(--color-muted)',
                          borderBottom: '1px solid rgba(26,25,22,0.08)',
                        }}
                      >
                        {s}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          color: 'var(--color-ink)',
                          borderBottom: '1px solid rgba(26,25,22,0.08)',
                        }}
                      >
                        {SIZE_GUIDE[s].chest}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          color: 'var(--color-ink)',
                          borderBottom: '1px solid rgba(26,25,22,0.08)',
                        }}
                      >
                        {SIZE_GUIDE[s].waist}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          color: 'var(--color-ink)',
                          borderBottom: '1px solid rgba(26,25,22,0.08)',
                        }}
                      >
                        {SIZE_GUIDE[s].hips}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1023px) {
          .pdp-main { grid-template-columns: 1fr !important; gap: 48px !important; }
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 767px) {
          .pdp-breadcrumb { padding: 90px 24px 16px !important; }
          .pdp-main { padding: 0 24px 64px !important; }
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
        }
      `}</style>
    </div>
  );
}
