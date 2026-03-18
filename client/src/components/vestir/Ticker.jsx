export default function Ticker() {
  const text = (
    <>
      NEW ARRIVALS <span style={{ color: 'var(--color-accent)', margin: '0 16px' }}>—</span> SS25{' '}
      <span style={{ color: 'var(--color-accent)', margin: '0 16px' }}>—</span> FREE SHIPPING OVER
      ₹5,000 <span style={{ color: 'var(--color-accent)', margin: '0 16px' }}>—</span> NEW ARRIVALS{' '}
      <span style={{ color: 'var(--color-accent)', margin: '0 16px' }}>—</span> SS25{' '}
      <span style={{ color: 'var(--color-accent)', margin: '0 16px' }}>—</span> FREE SHIPPING OVER
      ₹5,000 <span style={{ color: 'var(--color-accent)', margin: '0 16px' }}>—</span>{' '}
    </>
  );

  return (
    <div
      aria-hidden="true"
      style={{
        height: 44,
        background: 'var(--color-ink)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* left fade */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: 'linear-gradient(to right, var(--color-ink), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      {/* right fade */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: 'linear-gradient(to left, var(--color-ink), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 28s linear infinite' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: '0.2em',
            color: 'var(--color-invert-fg)',
            textTransform: 'uppercase',
            paddingRight: 48,
          }}
        >
          {text}
        </span>
        <span
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: '0.2em',
            color: 'var(--color-invert-fg)',
            textTransform: 'uppercase',
            paddingRight: 48,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
