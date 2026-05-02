import { motion } from 'framer-motion';

const stats = [
  { label: 'Natural Fibres Only', value: '100%' },
  { label: 'Made in Mumbai', value: 'Local' },
  { label: 'Carbon Neutral by 2026', value: 'On Track' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function BrandStory() {
  return (
    <section
      aria-label="Brand Story"
      className="brand-strip"
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid rgba(26,25,22,0.08)',
        borderBottom: '1px solid rgba(26,25,22,0.08)',
      }}
    >
      <motion.div
        className="brand-inner"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          minHeight: 200,
        }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            variants={itemVariants}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 48px',
              borderRight: i < 2 ? '1px solid rgba(26,25,22,0.10)' : 'none',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                marginBottom: 12,
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 300,
                color: 'var(--color-ink)',
              }}
            >
              {s.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        @media (max-width: 767px) {
          .brand-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
