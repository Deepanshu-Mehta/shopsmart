import { motion } from 'framer-motion';

const cats = [
  { name: 'Women', cls: 'cat-women' },
  { name: 'Men', cls: 'cat-men' },
  { name: 'Essentials', cls: 'cat-ess' },
  { name: 'Sale', cls: 'cat-sale' },
];

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H5M12 2V9" stroke="#F5F3EF" strokeWidth="1" />
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Categories() {
  return (
    <section
      id="categories"
      aria-label="Featured Categories"
      style={{ padding: '96px 48px' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 24,
          marginBottom: 48,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            letterSpacing: '0.2em',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
          }}
        >
          Collections
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 300,
          }}
        >
          Shop by Category
        </h2>
        <span style={{ flex: 1, height: 1, background: 'rgba(26,25,22,0.12)' }} />
      </motion.div>

      <motion.div
        className="cats-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
        }}
      >
        {cats.map((cat) => (
          <motion.article
            key={cat.name}
            variants={itemVariants}
            data-hover
            className="cat-card"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '3/4',
            }}
          >
            <div
              className={`cat-img ${cat.cls}`}
              style={{
                width: '100%',
                height: '100%',
                transition: 'transform 600ms cubic-bezier(0.25,0.46,0.45,0.94)',
                willChange: 'transform',
              }}
            />
            {/* dark overlay */}
            <div
              className="cat-overlay"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(26,25,22,0)',
                transition: 'background 400ms var(--ease-out)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                right: 24,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}
            >
              <h3
                className="cat-name"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 300,
                  color: 'var(--color-invert-fg)',
                  letterSpacing: '0.08em',
                  transition: 'transform 300ms var(--ease-out)',
                }}
              >
                {cat.name}
              </h3>
              <span
                className="cat-arrow"
                style={{
                  width: 32,
                  height: 32,
                  border: '1px solid rgba(245,243,239,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 300ms, border-color 300ms',
                }}
              >
                <ArrowIcon />
              </span>
            </div>
          </motion.article>
        ))}
      </motion.div>

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
