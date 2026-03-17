import { useReveal } from './useReveal';

const logos = [
  { name: 'Vogue',               opacity: 1.0  },
  { name: 'Elle',                opacity: 0.7  },
  { name: "Harper's Bazaar",     opacity: 0.55 },
  { name: 'WWD',                 opacity: 0.45 },
  { name: 'Business of Fashion', opacity: 0.35 },
];

const reviews = [
  {
    name: 'Priya Mehta, Mumbai',
    text: 'Every piece I\'ve owned from VESTIR has outlasted trends and my expectations. The Cashmere Overcoat is worth every rupee.',
  },
  {
    name: 'Arjun Sharma, Delhi',
    text: 'The tailoring is architectural in the best way. Nothing about VESTIR is arbitrary. I buy fewer things now, but they mean something.',
  },
  {
    name: 'Ananya Iyer, Bengaluru',
    text: 'The linen shirt feels like wearing silence. If that makes sense — it just does what it needs to, quietly.',
  },
];

function Stars() {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 16 }} aria-label="5 out of 5 stars">
      {[...Array(5)].map((_, i) => (
        <span key={i} aria-hidden="true" style={{
          display: 'block',
          width: 12, height: 12,
          background: 'var(--color-accent)',
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        }} />
      ))}
    </div>
  );
}

export default function Press() {
  const ref = useReveal();

  return (
    <section
      id="press"
      ref={ref}
      className="reveal press-section"
      aria-label="Press and Reviews"
      style={{ padding: '80px 48px', borderTop: '1px solid rgba(26,25,22,0.12)' }}
    >
      {/* As seen in label */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 10,
        fontWeight: 400,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--color-muted)',
        textAlign: 'center',
        marginBottom: 32,
      }}>As Seen In</p>

      {/* Press logos */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflowX: 'auto',
        gap: 40,
        paddingBottom: 64,
        borderBottom: '1px solid rgba(26,25,22,0.12)',
        scrollbarWidth: 'none',
      }}>
        {logos.map(l => (
          <span
            key={l.name}
            data-hover
            className="press-logo"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 400,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-ink)',
              opacity: l.opacity,
              whiteSpace: 'nowrap',
              transition: 'opacity 300ms ease',
            }}
          >{l.name}</span>
        ))}
      </div>

      {/* Reviews */}
      <div className="reviews-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 48,
        paddingTop: 64,
      }}>
        {reviews.map(r => (
          <article key={r.name} style={{
            paddingTop: 40,
            borderTop: '1px solid rgba(26,25,22,0.1)',
          }}>
            <Stars />
            <span aria-hidden="true" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 80,
              fontWeight: 300,
              lineHeight: 0.5,
              color: 'var(--color-accent)',
              display: 'block',
              marginBottom: 16,
            }}>{'"'}</span>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 17,
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--color-ink)',
              lineHeight: 1.6,
              marginBottom: 20,
            }}>{'"'}{r.text}{'"'}</p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
            }}>
              <span style={{ color: 'var(--color-accent)', marginRight: 8 }}>—</span>
              {r.name}
            </p>
          </article>
        ))}
      </div>

      <style>{`
        .press-logo:hover { opacity: 1 !important; }
        @media (max-width: 1023px) { .reviews-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 767px) {
          .press-section { padding: 64px 24px !important; }
          .reviews-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}
