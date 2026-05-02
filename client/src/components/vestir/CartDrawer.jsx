import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function CartDrawer({
  open,
  onClose,
  user,
  cartItems = [],
  onCartItemsChange,
  onAuthOpen,
}) {
  const [syncError, setSyncError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const refetchCart = () => {
    fetch(`${API_URL}/api/cart`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) onCartItemsChange(data.items);
      })
      .catch(() => {});
  };

  const removeItem = async (itemId) => {
    setSyncError('');
    onCartItemsChange((prev) => prev.filter((i) => i.id !== itemId));
    try {
      const res = await fetch(`${API_URL}/api/cart/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('remove failed');
    } catch {
      setSyncError('Failed to remove item — please try again');
      refetchCart();
    }
  };

  const updateQty = async (itemId, quantity) => {
    if (quantity < 1) return removeItem(itemId);
    setSyncError('');
    onCartItemsChange((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
    try {
      const res = await fetch(`${API_URL}/api/cart/items/${itemId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error('update failed');
    } catch {
      setSyncError('Failed to update quantity — please try again');
      refetchCart();
    }
  };

  const applyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'VESTIR10') {
      setPromoApplied({ code, discount: 10 });
      setPromoCode('');
    } else if (code === 'WELCOME20') {
      setPromoApplied({ code, discount: 20 });
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const subtotal = cartItems.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0) / 100;
  const discount = promoApplied ? (subtotal * promoApplied.discount) / 100 : 0;
  const total = subtotal - discount;

  const totalLabel = cartItems.length ? '₹' + total.toLocaleString('en-IN') : null;
  const subtotalLabel = '₹' + subtotal.toLocaleString('en-IN');
  const discountLabel = promoApplied ? '-₹' + discount.toLocaleString('en-IN') : null;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(26,25,22,0.45)',
              zIndex: 2000,
            }}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: open ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 'min(420px, 100vw)',
          height: '100vh',
          background: 'var(--color-bg)',
          zIndex: 2001,
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
            Your Bag {cartItems.length > 0 && `(${cartItems.length})`}
          </span>
          <button
            onClick={onClose}
            data-hover
            aria-label="Close bag"
            style={{
              fontSize: 20,
              fontWeight: 300,
              color: 'var(--color-ink)',
              background: 'none',
              border: 'none',
            }}
            className="modal-close-btn"
          >
            x
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {syncError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: '#c0392b',
                fontSize: 12,
                marginBottom: 16,
                fontFamily: 'var(--font-body)',
              }}
            >
              {syncError}
            </motion.p>
          )}
          {!user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', paddingTop: 64 }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 300,
                  marginBottom: 16,
                }}
              >
                Sign in to view your bag
              </p>
              <button
                onClick={onAuthOpen}
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: 'var(--color-ink)',
                  color: 'var(--color-invert-fg)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Sign in
              </button>
            </motion.div>
          ) : cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', paddingTop: 64 }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 300,
                  marginBottom: 8,
                }}
              >
                Your bag is empty.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 300,
                  color: 'var(--color-muted)',
                  marginBottom: 32,
                }}
              >
                Add something beautiful.
              </p>
              <Link
                to="/shop"
                onClick={onClose}
                data-hover
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: 'var(--color-ink)',
                  color: 'var(--color-invert-fg)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                Shop Now
              </Link>
            </motion.div>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    style={{
                      display: 'flex',
                      gap: 16,
                      borderBottom: '1px solid rgba(26,25,22,0.08)',
                      paddingBottom: 24,
                    }}
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.product?.id}`}
                      onClick={onClose}
                      style={{ flexShrink: 0 }}
                    >
                      {item.product?.imgUrl ? (
                        <img
                          src={item.product.imgUrl}
                          alt={item.product?.name}
                          style={{ width: 80, height: 100, objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className={item.product?.imgClass}
                          style={{ width: 80, height: 100 }}
                        />
                      )}
                    </Link>
                    <div style={{ flex: 1 }}>
                      <Link to={`/product/${item.product?.id}`} onClick={onClose}>
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 14,
                            fontWeight: 400,
                            marginBottom: 4,
                            color: 'var(--color-ink)',
                          }}
                        >
                          {item.product?.name}
                        </p>
                      </Link>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 11,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--color-muted)',
                          marginBottom: 12,
                        }}
                      >
                        {item.size} / {item.color}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 16,
                          fontWeight: 300,
                          marginBottom: 12,
                        }}
                      >
                        {item.product?.priceLabel}
                      </p>

                      {/* Qty controls */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0,
                          border: '1px solid rgba(26,25,22,0.12)',
                          width: 'fit-content',
                        }}
                      >
                        <button
                          data-hover
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          style={{
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            fontWeight: 300,
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-ink)',
                          }}
                          aria-label="Decrease"
                        >
                          -
                        </button>
                        <span
                          style={{
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-body)',
                            fontSize: 13,
                            borderLeft: '1px solid rgba(26,25,22,0.12)',
                            borderRight: '1px solid rgba(26,25,22,0.12)',
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          data-hover
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          style={{
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            fontWeight: 300,
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-ink)',
                          }}
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      data-hover
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      style={{
                        fontSize: 18,
                        fontWeight: 300,
                        color: 'var(--color-muted)',
                        background: 'none',
                        border: 'none',
                        alignSelf: 'flex-start',
                        padding: 0,
                        lineHeight: 1,
                      }}
                      className="modal-close-btn"
                    >
                      x
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Footer — promo, total + checkout */}
        {cartItems.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(26,25,22,0.12)' }}>
            {/* Promo Code */}
            <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(26,25,22,0.08)' }}>
              {promoApplied ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--color-accent)',
                        padding: '4px 8px',
                        background: 'rgba(200,169,110,0.1)',
                      }}
                    >
                      {promoApplied.code}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        color: 'var(--color-muted)',
                      }}
                    >
                      {promoApplied.discount}% off applied
                    </span>
                  </div>
                  <button
                    onClick={() => setPromoApplied(null)}
                    data-hover
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      color: 'var(--color-muted)',
                      background: 'none',
                      border: 'none',
                      textDecoration: 'underline',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError('');
                      }}
                      placeholder="Promo code"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid rgba(26,25,22,0.12)',
                        background: 'transparent',
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        color: 'var(--color-ink)',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={applyPromo}
                      data-hover
                      style={{
                        padding: '10px 20px',
                        background: 'none',
                        border: '1px solid rgba(26,25,22,0.12)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--color-ink)',
                      }}
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        color: '#c0392b',
                        marginTop: 8,
                      }}
                    >
                      {promoError}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Totals */}
            <div style={{ padding: '20px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--color-muted)',
                  }}
                >
                  Subtotal
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14 }}>
                  {subtotalLabel}
                </span>
              </div>

              {promoApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: 'var(--color-accent)',
                    }}
                  >
                    Discount ({promoApplied.discount}%)
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      color: 'var(--color-accent)',
                    }}
                  >
                    {discountLabel}
                  </span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                  paddingTop: 12,
                  borderTop: '1px solid rgba(26,25,22,0.08)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink)',
                  }}
                >
                  Total
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 300 }}>
                  {totalLabel}
                </span>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--color-muted)',
                  marginBottom: 16,
                  textAlign: 'center',
                }}
              >
                Free shipping on orders over ₹5,000
              </p>

              <motion.button
                data-hover
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  width: '100%',
                  padding: 18,
                  background: 'var(--color-ink)',
                  color: 'var(--color-invert-fg)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 400,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  border: 'none',
                }}
                className="modal-add-btn"
              >
                Proceed to Checkout
              </motion.button>
            </div>
          </div>
        )}
      </motion.aside>

      <style>{`
        .modal-close-btn:hover { color: var(--color-muted) !important; }
        .modal-add-btn:hover { background: var(--color-accent) !important; color: var(--color-ink) !important; }
      `}</style>
    </>
  );
}
