export default function Hero() {
  return (
    <>
      {/* grain filter */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
            <feBlend in="SourceGraphic" mode="multiply"/>
          </filter>
        </defs>
      </svg>

      <section
        aria-label="Hero"
        style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hero-section"
      >
        {/* Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '120px 64px 80px',
          }}
          className="hero-text-col"
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            marginBottom: 24,
            animation: 'fadeSlideUp 800ms cubic-bezier(0.16,1,0.3,1) 100ms both',
          }}>Spring / Summer 2025</p>

          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 3.5vw, 52px)',
            fontWeight: 300,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            animation: 'fadeSlideUp 800ms cubic-bezier(0.16,1,0.3,1) 250ms both',
          }}>THE</p>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(80px, 14vw, 200px)',
            fontWeight: 300,
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
            color: 'var(--color-ink)',
            animation: 'fadeSlideUp 800ms cubic-bezier(0.16,1,0.3,1) 400ms both',
          }}>QUIET</h1>

          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 72px)',
            fontWeight: 300,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-ink)',
            animation: 'fadeSlideUp 800ms cubic-bezier(0.16,1,0.3,1) 550ms both',
          }}>COLLECTION</p>

          <div style={{
            marginTop: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            animation: 'fadeSlideUp 800ms cubic-bezier(0.16,1,0.3,1) 700ms both',
          }}>
            <a
              href="#arrivals"
              data-hover
              className="hero-cta-btn"
              style={{
                display: 'inline-block',
                padding: '14px 36px',
                background: 'var(--color-ink)',
                color: 'var(--color-bg)',
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                transition: 'background 300ms, color 300ms',
              }}
            >Explore Now</a>

            {/* Scroll indicator */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 1,
                height: 40,
                background: 'var(--color-muted)',
                transformOrigin: 'top',
                animation: 'scrollPulse 2s ease-in-out infinite',
              }} />
            </div>
          </div>
        </div>

        {/* Image */}
        <div
          style={{ position: 'relative', overflow: 'hidden' }}
          aria-hidden="true"
          className="hero-img-col"
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, #C8B99A 0%, #B8A888 30%, #A89878 60%, #C4B090 100%)',
          }} />
          {/* grain overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
            opacity: 0.08,
            mixBlendMode: 'multiply',
          }} />
          <p style={{
            position: 'absolute',
            bottom: 40, right: 40,
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            fontStyle: 'italic',
            color: 'rgba(26,25,22,0.45)',
            letterSpacing: '0.1em',
          }}>SS25 Editorial</p>
        </div>
      </section>

      <style>{`
        .hero-cta-btn:hover { background: var(--color-accent) !important; color: var(--color-ink) !important; }
        @media (max-width: 1023px) {
          .hero-section { grid-template-columns: 1fr !important; }
          .hero-img-col { height: 50vh; position: relative; order: -1; }
          .hero-text-col { padding: 80px 40px 60px !important; }
        }
        @media (max-width: 767px) {
          .hero-text-col { padding: 80px 24px 48px !important; }
        }
      `}</style>
    </>
  );
}
