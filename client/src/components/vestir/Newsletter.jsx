import { useState } from 'react';
import { useReveal } from './useReveal';

export default function Newsletter() {
  const ref = useReveal();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(''); }
  };

  return (
    <section
      ref={ref}
      className="reveal newsletter-section"
      aria-label="Newsletter signup"
      style={{
        padding: '96px 48px',
        background: 'var(--color-surface)',
        textAlign: 'center',
        borderTop: '1px solid rgba(26,25,22,0.12)',
        borderBottom: '1px solid rgba(26,25,22,0.12)',
      }}
    >
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(36px, 6vw, 80px)',
        fontWeight: 300,
        letterSpacing: '-0.01em',
        color: 'var(--color-ink)',
        marginBottom: 16,
      }}>Stay in the loop.</h2>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 300,
        color: 'var(--color-muted)',
        marginBottom: 48,
        maxWidth: 420,
        marginLeft: 'auto',
        marginRight: 'auto',
        lineHeight: 1.7,
      }}>
        New arrivals, rare editorials, and quiet announcements — delivered with intention.
      </p>

      {submitted ? (
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          fontStyle: 'italic',
          color: 'var(--color-accent)',
        }}>{"Thank you. You're in."}</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          aria-label="Email subscription"
          style={{ display: 'flex', maxWidth: 480, margin: '0 auto' }}
          className="newsletter-form"
        >
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            aria-label="Email address"
            required
            style={{
              flex: 1,
              padding: '16px 20px',
              border: '1px solid rgba(26,25,22,0.12)',
              borderRight: 'none',
              background: 'var(--color-bg)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 300,
              color: 'var(--color-ink)',
              outline: 'none',
              transition: 'border-color 300ms',
            }}
            className="newsletter-input"
          />
          <button
            type="submit"
            data-hover
            style={{
              padding: '16px 28px',
              background: 'var(--color-ink)',
              color: 'var(--color-invert-fg)',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              border: '1px solid var(--color-ink)',
              transition: 'background 300ms',
              whiteSpace: 'nowrap',
            }}
            className="newsletter-btn"
          >Subscribe</button>
        </form>
      )}

      <style>{`
        .newsletter-input:focus { border-color: var(--color-ink) !important; }
        .newsletter-input::placeholder { color: var(--color-muted); transition: color 300ms; }
        .newsletter-input:focus::placeholder { color: transparent; }
        .newsletter-btn:hover { background: var(--color-accent) !important; border-color: var(--color-accent) !important; }
        @media (max-width: 767px) {
          .newsletter-section { padding: 64px 24px !important; }
          .newsletter-form { flex-direction: column !important; }
          .newsletter-input { border-right: 1px solid rgba(26,25,22,0.12) !important; border-bottom: none !important; }
        }
      `}</style>
    </section>
  );
}
