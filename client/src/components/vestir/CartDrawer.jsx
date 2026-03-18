import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function CartDrawer({ open, onClose, user, onCartCountChange }) {
  const [cart, setCart]       = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${API_URL}/api/cart`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { setCart(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (open) fetchCart();
  }, [open, fetchCart]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const removeItem = async (itemId) => {
    await fetch(`${API_URL}/api/cart/items/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchCart();
    onCartCountChange?.();
  };

  const updateQty = async (itemId, quantity) => {
    if (quantity < 1) return removeItem(itemId);
    await fetch(`${API_URL}/api/cart/items/${itemId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    fetchCart();
  };

  const items = cart?.items || [];
  const totalLabel = items.length
    ? '₹' + (items.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0) / 100).toLocaleString('en-IN')
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: open ? 'rgba(26,25,22,0.45)' : 'rgba(26,25,22,0)',
          zIndex: 2000,
          transition: 'background 400ms var(--ease-out)',
          pointerEvents: open ? 'all' : 'none',
        }}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        style={{
          position: 'fixed',
          top: 0, right: 0,
          width: 'min(420px, 100vw)',
          height: '100vh',
          background: 'var(--color-bg)',
          zIndex: 2001,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 500ms cubic-bezier(0.16,1,0.3,1)',
          display: 'flex',
          flexDirection: 'column',
          willChange: 'transform',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '28px 32px',
          borderBottom: '1px solid rgba(26,25,22,0.12)',
        }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            Your Bag {items.length > 0 && `(${items.length})`}
          </span>
          <button
            onClick={onClose}
            data-hover
            aria-label="Close bag"
            style={{ fontSize: 20, fontWeight: 300, color: 'var(--color-ink)', background: 'none', border: 'none' }}
            className="modal-close-btn"
          >×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {!user ? (
            <div style={{ textAlign: 'center', paddingTop: 64 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 300, marginBottom: 16 }}>Sign in to view your bag</p>
              <a
                href={`${API_URL}/auth/google`}
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: 'var(--color-ink)',
                  color: 'var(--color-invert-fg)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >Sign in with Google</a>
            </div>
          ) : loading ? (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase', textAlign: 'center', paddingTop: 48 }}>Loading…</p>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 64 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 300, marginBottom: 8 }}>Your bag is empty.</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 300, color: 'var(--color-muted)' }}>Add something beautiful.</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {items.map(item => (
                <li key={item.id} style={{ display: 'flex', gap: 16, borderBottom: '1px solid rgba(26,25,22,0.08)', paddingBottom: 24 }}>
                  {/* Swatch/image placeholder */}
                  <div
                    className={item.product?.imgClass}
                    style={{ width: 80, height: 100, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 400, marginBottom: 4 }}>{item.product?.name}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 12 }}>
                      {item.size} · {item.color}
                    </p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 300, marginBottom: 12 }}>{item.product?.priceLabel}</p>

                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid rgba(26,25,22,0.12)', width: 'fit-content' }}>
                      <button
                        data-hover onClick={() => updateQty(item.id, item.quantity - 1)}
                        style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 300, background: 'none', border: 'none', color: 'var(--color-ink)' }}
                        aria-label="Decrease"
                      >−</button>
                      <span style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', fontSize: 13, borderLeft: '1px solid rgba(26,25,22,0.12)', borderRight: '1px solid rgba(26,25,22,0.12)' }}>{item.quantity}</span>
                      <button
                        data-hover onClick={() => updateQty(item.id, item.quantity + 1)}
                        style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 300, background: 'none', border: 'none', color: 'var(--color-ink)' }}
                        aria-label="Increase"
                      >+</button>
                    </div>
                  </div>

                  <button
                    data-hover onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    style={{ fontSize: 18, fontWeight: 300, color: 'var(--color-muted)', background: 'none', border: 'none', alignSelf: 'flex-start', padding: 0, lineHeight: 1 }}
                    className="modal-close-btn"
                  >×</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — total + checkout */}
        {items.length > 0 && (
          <div style={{ padding: '24px 32px', borderTop: '1px solid rgba(26,25,22,0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 300 }}>{totalLabel}</span>
            </div>
            <button
              data-hover
              style={{
                width: '100%', padding: 18,
                background: 'var(--color-ink)', color: 'var(--color-invert-fg)',
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 400,
                letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none',
              }}
              className="modal-add-btn"
            >Proceed to Checkout</button>
          </div>
        )}
      </aside>

      <style>{`
        .modal-close-btn:hover { color: var(--color-muted) !important; }
        .modal-add-btn:hover { background: var(--color-accent) !important; color: var(--color-ink) !important; }
      `}</style>
    </>
  );
}
