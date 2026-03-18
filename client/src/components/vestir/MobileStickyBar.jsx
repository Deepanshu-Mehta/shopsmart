import { useEffect, useState } from 'react';

export default function MobileStickyBar({ onAdd }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const arrivalsEl = document.getElementById('arrivals');
    if (!arrivalsEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(arrivalsEl);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        className="mobile-sticky-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          background: 'var(--color-ink)',
          color: 'var(--color-bg)',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 500,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 400ms var(--ease-out)',
        }}
      >
        <button
          data-hover
          onClick={onAdd}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-bg)',
            background: 'none',
            border: 'none',
            width: '100%',
            height: '100%',
          }}
        >
          ADD TO BAG — ₹4,200
        </button>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .mobile-sticky-bar { display: flex !important; }
        }
      `}</style>
    </>
  );
}
