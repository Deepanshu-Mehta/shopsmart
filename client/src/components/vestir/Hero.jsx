import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Using reliable free stock video URLs
const slides = [
  {
    season: 'Spring / Summer 2025',
    prefix: 'THE',
    title: 'QUIET',
    subtitle: 'COLLECTION',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-in-a-studio-34419-large.mp4',
    poster: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
    label: 'SS25 Editorial',
  },
  {
    season: 'Autumn / Winter 2025',
    prefix: 'THE',
    title: 'SHADOW',
    subtitle: 'EDIT',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-elegant-woman-in-a-dark-dress-sitting-in-a-studio-39880-large.mp4',
    poster: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80',
    label: 'AW25 Preview',
  },
  {
    season: 'Limited Edition',
    prefix: 'THE',
    title: 'ATELIER',
    subtitle: 'SERIES',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4',
    poster: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=80',
    label: 'Exclusive Pieces',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    // Play current video and pause others
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === currentSlide) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <>
      <section
        aria-label="Hero"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="hero-section"
      >
        {/* Video Backgrounds */}
        {slides.map((s, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: idx === currentSlide ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              zIndex: 0,
            }}
          >
            <video
              ref={(el) => (videoRefs.current[idx] = el)}
              src={s.video}
              poster={s.poster}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        ))}

        {/* Dark Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            padding: '0 24px',
            maxWidth: 1200,
          }}
          className="hero-content"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 400,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: 32,
                }}
              >
                {slide.season}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(18px, 2.5vw, 32px)',
                  fontWeight: 300,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: 8,
                }}
              >
                {slide.prefix}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(64px, 15vw, 220px)',
                  fontWeight: 300,
                  lineHeight: 0.9,
                  letterSpacing: '-0.02em',
                  color: '#fff',
                  marginBottom: 8,
                }}
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 4vw, 56px)',
                  fontWeight: 300,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.85)',
                }}
              >
                {slide.subtitle}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/shop"
              data-hover
              className="hero-cta-btn hero-cta-primary"
              style={{
                display: 'inline-block',
                padding: '16px 48px',
                background: '#fff',
                color: '#1a1916',
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                textDecoration: 'none',
              }}
            >
              Shop Collection
            </Link>

            <a
              href="#arrivals"
              data-hover
              className="hero-cta-btn hero-cta-secondary"
              style={{
                display: 'inline-block',
                padding: '16px 48px',
                background: 'transparent',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.4)',
                transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                textDecoration: 'none',
              }}
            >
              Explore
            </a>
          </motion.div>
        </div>

        {/* Bottom Controls */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            zIndex: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 48px',
          }}
          className="hero-controls"
        >
          {/* Slide Indicators */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                data-hover
                style={{
                  position: 'relative',
                  width: idx === currentSlide ? 48 : 12,
                  height: 3,
                  background: idx === currentSlide ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {idx === currentSlide && !isPaused && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 8, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: '#fff',
                      transformOrigin: 'left',
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: 'absolute',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
          className="scroll-indicator"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 1,
              height: 48,
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))',
            }}
          />
        </motion.div>
      </section>

      <style>{`
        .hero-cta-primary:hover { 
          background: var(--color-accent, #C8B99A) !important; 
          color: #1a1916 !important;
          transform: translateY(-2px);
        }
        .hero-cta-secondary:hover { 
          background: rgba(255,255,255,0.1) !important; 
          border-color: rgba(255,255,255,0.6) !important;
        }
        @media (max-width: 1023px) {
          .hero-controls { padding: 0 24px !important; }
          .scroll-indicator { display: none !important; }
        }
        @media (max-width: 767px) {
          .hero-controls { 
            bottom: 24px !important;
          }
        }
      `}</style>
    </>
  );
}
