import { useEffect, useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Nav({ cartCount, user, onLogout, onCartOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const prevCount = useRef(cartCount);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (cartCount !== prevCount.current) {
      setPulsing(true);
      const t = setTimeout(() => setPulsing(false), 450);
      prevCount.current = cartCount;
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  const toggleMenu = () => {
    setMenuOpen((v) => !v);
    document.body.style.overflow = menuOpen ? '' : 'hidden';
  };
  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  const navLinks = ['New Arrivals', 'Collections', 'About', 'Stores'];
  const navHrefs = ['#arrivals', '#categories', '#editorial', '#press'];

  return (
    <>
      {/* Mobile overlay */}
      <div className={`mobile-overlay${menuOpen ? ' open' : ''}`} aria-modal="true" role="dialog">
        <button
          onClick={closeMenu}
          style={{
            position: 'absolute',
            top: 28,
            right: 48,
            fontSize: 24,
            fontWeight: 300,
            color: 'var(--color-ink)',
            background: 'none',
            border: 'none',
          }}
          data-hover
          aria-label="Close menu"
        >
          ×
        </button>
        {navLinks.map((link, i) => (
          <a
            key={link}
            href={navHrefs[i]}
            onClick={closeMenu}
            data-hover
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36,
              fontWeight: 300,
              letterSpacing: '0.1em',
              color: 'var(--color-ink)',
            }}
          >
            {link}
          </a>
        ))}
      </div>

      <header>
        <nav
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: scrolled ? '16px 48px' : '24px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background 300ms ease, border-color 300ms ease, padding 300ms ease',
            background: scrolled ? 'rgba(245,243,239,0.85)' : 'transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(26,25,22,0.10)' : '1px solid transparent',
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Brand */}
          <a
            href="#"
            data-hover
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 400,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--color-ink)',
              zIndex: 1,
            }}
          >
            VESTIR
          </a>

          {/* Center links */}
          <ul
            style={{
              display: 'flex',
              gap: 40,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            className="hidden-mobile"
          >
            {navLinks.map((link, i) => (
              <li key={link}>
                <a
                  href={navHrefs[i]}
                  className="nav-link-hover"
                  data-hover
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink)',
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Login / User */}
            {user ? (
              <button
                data-hover
                onClick={onLogout}
                aria-label="Log out"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  background: 'none',
                  border: 'none',
                  cursor: 'none',
                }}
              >
                {user.name?.split(' ')[0] ?? user.email} · Out
              </button>
            ) : (
              <a
                href={`${API_URL}/auth/google`}
                data-hover
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink)',
                  textDecoration: 'none',
                }}
              >
                Sign in
              </a>
            )}

            {/* Search */}
            <button
              data-hover
              aria-label="Search"
              style={{
                color: 'var(--color-ink)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1" />
                <line
                  x1="11.5"
                  y1="11.5"
                  x2="16.5"
                  y2="16.5"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </button>

            {/* Cart */}
            <button
              data-hover
              onClick={onCartOpen}
              aria-label="Shopping bag"
              style={{
                color: 'var(--color-ink)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'none',
                border: 'none',
              }}
            >
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                <path d="M1 5.5H17L15 18.5H3L1 5.5Z" stroke="currentColor" strokeWidth="1" />
                <path
                  d="M6 5.5C6 3.84 7.34 2.5 9 2.5C10.66 2.5 12 3.84 12 5.5"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
              <span
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 16,
                  height: 16,
                  background: 'var(--color-ink)',
                  color: 'var(--color-bg)',
                  fontSize: 9,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: pulsing ? 'cartPulse 400ms var(--ease-out)' : 'none',
                  letterSpacing: 0,
                }}
              >
                {cartCount}
              </span>
            </button>

            {/* Hamburger */}
            <button
              onClick={toggleMenu}
              data-hover
              aria-label="Open menu"
              className="hamburger-btn"
              style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: 4 }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{ display: 'block', width: 22, height: 1, background: 'var(--color-ink)' }}
                />
              ))}
            </button>
          </div>
        </nav>

        {/* Responsive nav hide */}
        <style>{`
          @media (min-width: 768px) {
            .hamburger-btn { display: none !important; }
            .hidden-mobile  { display: flex !important; }
          }
          @media (max-width: 767px) {
            .hidden-mobile { display: none !important; }
          }
        `}</style>
      </header>
    </>
  );
}
