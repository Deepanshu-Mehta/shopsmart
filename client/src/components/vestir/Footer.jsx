export default function Footer() {
  const shopLinks = ['New Arrivals', 'Women', 'Men', 'Essentials', 'Sale'];
  const helpLinks = [
    'Sizing Guide',
    'Shipping & Returns',
    'Care Instructions',
    'Contact Us',
    'Sustainability',
  ];

  return (
    <footer
      style={{
        background: 'var(--color-invert-bg)',
        color: 'var(--color-invert-fg)',
        padding: '80px 48px 40px',
      }}
    >
      <div
        className="footer-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          gap: 48,
          marginBottom: 64,
        }}
      >
        {/* Brand */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 300,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: 20,
              color: 'var(--color-invert-fg)',
            }}
          >
            VESTIR
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 300,
              color: 'rgba(245,243,239,0.5)',
              lineHeight: 1.8,
              maxWidth: 260,
            }}
          >
            We believe in the power of restraint. VESTIR was founded in 2018 to make clothing that
            disappears into your life while quietly elevating it. Every piece is designed in Mumbai,
            crafted from certified natural fibres.
          </p>
        </div>

        {/* Shop */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(245,243,239,0.4)',
              marginBottom: 24,
            }}
          >
            Shop
          </p>
          <nav
            aria-label="Shop links"
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {shopLinks.map((l) => (
              <a
                key={l}
                href="#"
                data-hover
                className="footer-link"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 300,
                  color: 'rgba(245,243,239,0.65)',
                  transition: 'color 250ms',
                }}
              >
                {l}
              </a>
            ))}
          </nav>
        </div>

        {/* Help */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(245,243,239,0.4)',
              marginBottom: 24,
            }}
          >
            Help
          </p>
          <nav
            aria-label="Help links"
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {helpLinks.map((l) => (
              <a
                key={l}
                href="#"
                data-hover
                className="footer-link"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 300,
                  color: 'rgba(245,243,239,0.65)',
                  transition: 'color 250ms',
                }}
              >
                {l}
              </a>
            ))}
          </nav>
        </div>

        {/* Social */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(245,243,239,0.4)',
              marginBottom: 24,
            }}
          >
            Follow
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Instagram', abbr: 'Ig' },
              { label: 'Pinterest', abbr: 'Pt' },
              { label: 'X', abbr: 'X' },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                data-hover
                className="social-icon"
                style={{
                  width: 40,
                  height: 40,
                  border: '1px solid rgba(245,243,239,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  letterSpacing: '0.05em',
                  color: 'rgba(245,243,239,0.65)',
                  transition: 'all 200ms ease',
                }}
              >
                {s.abbr}
              </a>
            ))}
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 300,
              color: 'rgba(245,243,239,0.5)',
              lineHeight: 1.8,
            }}
          >
            hello@vestir.in
            <br />
            +91 22 6600 1800
            <br />
            Mon–Sat, 10am–7pm IST
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          borderTop: '1px solid rgba(245,243,239,0.08)',
          paddingTop: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        className="footer-bottom"
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 300,
            color: 'rgba(245,243,239,0.3)',
            letterSpacing: '0.08em',
          }}
        >
          © 2026 VESTIR. All rights reserved.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 300,
            color: 'rgba(245,243,239,0.3)',
            letterSpacing: '0.08em',
            fontStyle: 'italic',
          }}
        >
          Made with precision.
        </p>
      </div>

      <style>{`
        .footer-link:hover { color: var(--color-invert-fg) !important; }
        .social-icon:hover { border-color: var(--color-accent) !important; color: var(--color-accent) !important; }
        @media (max-width: 1023px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 767px) {
          footer { padding: 64px 24px 32px !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .footer-bottom { flex-direction: column !important; gap: 12px !important; text-align: center !important; }
        }
      `}</style>
    </footer>
  );
}
