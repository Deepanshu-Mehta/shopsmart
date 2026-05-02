import { motion } from 'framer-motion';

const editorialProducts = [
  {
    name: 'Raw Edge Knit Vest',
    price: '₹7,200',
    imgClass: 'ep1',
    categoryLabel: 'Women / Essentials',
    id: 101,
    category: 'tops',
    filter: 'tops',
    hoverClass: 'ep1',
  },
  {
    name: 'Slate Linen Trousers',
    price: '₹5,800',
    imgClass: 'ep2',
    categoryLabel: 'Men / Essentials',
    id: 102,
    category: 'bottoms',
    filter: 'bottoms',
    hoverClass: 'ep2',
  },
];

export default function Editorial({ onOpenProduct }) {
  return (
    <section
      id="editorial"
      className="editorial-section"
      aria-label="Editorial Feature"
      style={{
        background: 'var(--color-invert-bg)',
        padding: '96px 64px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: 80,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* grain */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      />

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 120,
            fontWeight: 300,
            color: 'var(--color-accent)',
            lineHeight: 0.6,
            marginBottom: 24,
            display: 'block',
          }}
        >
          {'"'}
        </motion.span>
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--color-invert-fg)',
            lineHeight: 1.35,
            marginBottom: 32,
          }}
        >
          Clothing is the armor to survive the reality of everyday life.
        </motion.blockquote>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
          }}
        >
          — Karl Lagerfeld
        </motion.p>
      </motion.div>

      {/* Products */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {editorialProducts.map((p, index) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            whileHover={{ x: 8 }}
            data-hover
            onClick={() => onOpenProduct(p)}
            className="editorial-card"
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr',
              gap: 20,
              padding: 20,
              border: '1px solid rgba(245,243,239,0.12)',
              alignItems: 'center',
              transition: 'background 300ms',
              cursor: 'none',
            }}
          >
            <div className={p.imgClass} style={{ height: 100 }} />
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'var(--color-invert-fg)',
                  marginBottom: 6,
                }}
              >
                {p.name}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  letterSpacing: '0.15em',
                  color: 'var(--color-muted)',
                  marginBottom: 12,
                }}
              >
                {p.price}
              </p>
              <span
                className="ed-btn"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  borderBottom: '1px solid rgba(200,169,110,0.3)',
                  paddingBottom: 2,
                  transition: 'color 250ms, border-color 250ms',
                }}
              >
                Shop Now
              </span>
            </div>
          </motion.article>
        ))}
      </motion.div>

      <style>{`
        .editorial-card:hover { background: rgba(245,243,239,0.05) !important; }
        .editorial-card:hover .ed-btn { color: var(--color-invert-fg) !important; border-color: rgba(245,243,239,0.3) !important; }
        @media (max-width: 1023px) { .editorial-section { grid-template-columns: 1fr !important; } }
        @media (max-width: 767px) { .editorial-section { padding: 64px 24px !important; } }
      `}</style>
    </section>
  );
}
