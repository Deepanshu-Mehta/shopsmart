import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    season: 'Spring / Summer 2025',
    prefix: 'THE',
    title: 'QUIET',
    subtitle: 'COLLECTION',
    gradient: 'linear-gradient(160deg, #C8B99A 0%, #B8A888 30%, #A89878 60%, #C4B090 100%)',
    label: 'SS25 Editorial',
  },
  {
    season: 'Autumn / Winter 2025',
    prefix: 'THE',
    title: 'SHADOW',
    subtitle: 'EDIT',
    gradient: 'linear-gradient(160deg, #8C8880 0%, #6E6860 30%, #5A5650 60%, #787470 100%)',
    label: 'AW25 Preview',
  },
  {
    season: 'Limited Edition',
    prefix: 'THE',
    title: 'ATELIER',
    subtitle: 'SERIES',
    gradient: 'linear-gradient(160deg, #C8A96E 0%, #B8986A 30%, #A88858 60%, #D4B888 100%)',
    label: 'Exclusive Pieces',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = slides[currentSlide];

  return (
    <>
      {/* grain filter */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
      </svg>

      <section
        aria-label="Hero"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
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
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 400,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  marginBottom: 24,
                }}
              >
                {slide.season}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 3.5vw, 52px)',
                  fontWeight: 300,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                }}
              >
                {slide.prefix}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(80px, 14vw, 200px)',
                  fontWeight: 300,
                  lineHeight: 0.88,
                  letterSpacing: '-0.01em',
                  color: 'var(--color-ink)',
                }}
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 5vw, 72px)',
                  fontWeight: 300,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink)',
                }}
              >
                {slide.subtitle}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: 48,
              display: 'flex',
              alignItems: 'center',
              gap: 32,
            }}
          >
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
            >
              Explore Now
            </a>

            {/* Slide indicators */}
            <div style={{ display: 'flex', gap: 8 }}>
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  data-hover
                  style={{
                    width: idx === currentSlide ? 32 : 8,
                    height: 8,
                    background: idx === currentSlide ? 'var(--color-ink)' : 'var(--color-muted)',
                    border: 'none',
                    transition: 'width 300ms var(--ease-out), background 300ms',
                    opacity: idx === currentSlide ? 1 : 0.5,
                  }}
                />
              ))}
            </div>

            {/* Scroll indicator */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
              <div
                style={{
                  width: 1,
                  height: 40,
                  background: 'var(--color-muted)',
                  transformOrigin: 'top',
                  animation: 'scrollPulse 2s ease-in-out infinite',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Image */}
        <div
          style={{ position: 'relative', overflow: 'hidden' }}
          aria-hidden="true"
          className="hero-img-col"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                background: slide.gradient,
              }}
            />
          </AnimatePresence>
          {/* grain overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
              opacity: 0.08,
              mixBlendMode: 'multiply',
            }}
          />
          <AnimatePresence mode="wait">
            <motion.p
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                position: 'absolute',
                bottom: 40,
                right: 40,
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                fontStyle: 'italic',
                color: 'rgba(26,25,22,0.45)',
                letterSpacing: '0.1em',
              }}
            >
              {slide.label}
            </motion.p>
          </AnimatePresence>
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
