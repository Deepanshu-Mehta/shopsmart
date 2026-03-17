import { useReveal } from './useReveal';

const editorialProducts = [
  { name: 'Raw Edge Knit Vest',    price: '₹7,200', imgClass: 'ep1', categoryLabel: 'Women / Essentials', id: 101, category: 'tops', filter: 'tops', hoverClass: 'ep1' },
  { name: 'Slate Linen Trousers',  price: '₹5,800', imgClass: 'ep2', categoryLabel: 'Men / Essentials',   id: 102, category: 'bottoms', filter: 'bottoms', hoverClass: 'ep2' },
];

export default function Editorial({ onOpenProduct }) {
  const ref = useReveal();

  return (
    <section
      id="editorial"
      ref={ref}
      className="reveal editorial-section"
      aria-label="Editorial Feature"
      style={{
        background: 'var(--color-invert-bg)',
        padding: '96px 64px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: 80,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* grain */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
        opacity: 0.35,
        pointerEvents: 'none',
      }} />

      {/* Quote */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <span aria-hidden="true" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 120,
          fontWeight: 300,
          color: 'var(--color-accent)',
          lineHeight: 0.6,
          marginBottom: 24,
          display: 'block',
          opacity: 0.5,
        }}>{'"'}</span>
        <blockquote style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 3.5vw, 48px)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--color-invert-fg)',
          lineHeight: 1.35,
          marginBottom: 32,
        }}>
          Clothing is the armor to survive the reality of everyday life.
        </blockquote>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          fontWeight: 400,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-muted)',
        }}>— Karl Lagerfeld</p>
      </div>

      {/* Products */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
        {editorialProducts.map(p => (
          <article
            key={p.id}
            data-hover
            onClick={() => onOpenProduct(p)}
            className="editorial-card"
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr',
              gap: 20,
              padding: 20,
              border: '1px solid rgba(245,243,239,0.12)',
              alignItems: 'center',
              transition: 'background 300ms',
              cursor: 'none',
            }}
          >
            <div className={p.imgClass} style={{ height: 100 }} />
            <div>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--color-invert-fg)',
                marginBottom: 6,
              }}>{p.name}</p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                letterSpacing: '0.15em',
                color: 'var(--color-muted)',
                marginBottom: 12,
              }}>{p.price}</p>
              <span className="ed-btn" style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                borderBottom: '1px solid rgba(200,169,110,0.3)',
                paddingBottom: 2,
                transition: 'color 250ms, border-color 250ms',
              }}>Shop Now</span>
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .editorial-card:hover { background: rgba(245,243,239,0.05) !important; }
        .editorial-card:hover .ed-btn { color: var(--color-invert-fg) !important; border-color: rgba(245,243,239,0.3) !important; }
        @media (max-width: 1023px) { .editorial-section { grid-template-columns: 1fr !important; } }
        @media (max-width: 767px) { .editorial-section { padding: 64px 24px !important; } }
      `}</style>
    </section>
  );
}
