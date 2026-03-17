import { useReveal } from './useReveal';

const cats = [
  { name: 'Women',      cls: 'cat-women' },
  { name: 'Men',        cls: 'cat-men'   },
  { name: 'Essentials', cls: 'cat-ess'   },
  { name: 'Sale',       cls: 'cat-sale'  },
];

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H5M12 2V9" stroke="#F5F3EF" strokeWidth="1"/>
  </svg>
);

export default function Categories() {
  const ref = useReveal({ gridMode: true });

  return (
    <section
      id="categories"
      ref={ref}
      aria-label="Featured Categories"
      className="reveal-grid"
      style={{ padding: '96px 48px' }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 24,
        marginBottom: 48,
        opacity: 1,
        transform: 'none',
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          letterSpacing: '0.2em',
          color: 'var(--color-muted)',
          textTransform: 'uppercase',
        }}>Collections</span>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 300,
        }}>Shop by Category</h2>
        <span style={{ flex: 1, height: 1, background: 'rgba(26,25,22,0.12)' }} />
      </div>

      <div className="cats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
      }}>
        {cats.map(cat => (
          <article
            key={cat.name}
            data-hover
            className="cat-card"
            style={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '3/4',
            }}
          >
            <div
              className={`cat-img ${cat.cls}`}
              style={{
                width: '100%', height: '100%',
                transition: 'transform 600ms cubic-bezier(0.25,0.46,0.45,0.94)',
                willChange: 'transform',
              }}
            />
            {/* dark overlay */}
            <div
              className="cat-overlay"
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(26,25,22,0)',
                transition: 'background 400ms var(--ease-out)',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 24, left: 24, right: 24,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}>
              <h3 className="cat-name" style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 300,
                color: 'var(--color-invert-fg)',
                letterSpacing: '0.08em',
                transition: 'transform 300ms var(--ease-out)',
              }}>{cat.name}</h3>
              <span
                className="cat-arrow"
                style={{
                  width: 32, height: 32,
                  border: '1px solid rgba(245,243,239,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 300ms, border-color 300ms',
                }}
              ><ArrowIcon /></span>
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .cat-card:hover .cat-img    { transform: scale(1.04); }
        .cat-card:hover .cat-overlay { background: rgba(26,25,22,0.2) !important; }
        .cat-card:hover .cat-name   { transform: translateY(-4px); }
        .cat-card:hover .cat-arrow  { background: var(--color-accent) !important; border-color: var(--color-accent) !important; }
        @media (max-width: 1023px) { .cats-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 767px) {
          section#categories { padding: 64px 24px !important; }
          .cats-grid {
            display: flex !important;
            overflow-x: auto;
            scrollbar-width: none;
          }
          .cats-grid::-webkit-scrollbar { display: none; }
          .cat-card { min-width: 240px; }
        }
      `}</style>
    </section>
  );
}
