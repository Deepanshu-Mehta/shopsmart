import { useReveal } from './useReveal';

const stats = [
  { label: 'Natural Fibres Only',     value: '100%'  },
  { label: 'Made in Mumbai',          value: 'Local' },
  { label: 'Carbon Neutral by 2026',  value: 'On Track' },
];

export default function BrandStory() {
  const ref = useReveal({ gridMode: true });

  return (
    <section
      ref={ref}
      aria-label="Brand Story"
      className="reveal-grid brand-strip"
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid rgba(26,25,22,0.08)',
        borderBottom: '1px solid rgba(26,25,22,0.08)',
      }}
    >
      <div className="brand-inner" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        minHeight: 200,
      }}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 48px',
              borderRight: i < 2 ? '1px solid rgba(26,25,22,0.10)' : 'none',
              textAlign: 'center',
              transitionDelay: `${i * 150}ms`,
            }}
          >
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              fontWeight: 400,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              marginBottom: 12,
            }}>{s.label}</p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 300,
              color: 'var(--color-ink)',
            }}>{s.value}</p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .brand-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
