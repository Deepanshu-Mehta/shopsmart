require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SHIPPING = `Free shipping on orders above ₹5,000. Standard delivery in 3–5 business days. Express delivery available at checkout. Returns accepted within 14 days of delivery — unworn, with original tags attached. Items marked "Final Sale" are non-returnable.`;

const products = [
  {
    id: 1,
    name: 'Linen Drape Top',
    slug: 'linen-drape-top',
    category: 'tops',
    categoryLabel: 'Women / Tops',
    price: 420000,
    priceLabel: '₹4,200',
    imgClass: 'p1',
    hoverClass: 'p1h',
    filter: 'tops',
    details: 'An effortless drape top cut from 100% European linen. The relaxed silhouette falls gracefully from the shoulder with a subtle front pleat. Designed for warm days and easy layering — pair with tailored trousers or wide-leg jeans.',
    materials: '100% European Linen. Dry clean or gentle machine wash cold. Do not tumble dry. Iron on low heat while slightly damp.',
    shipping: SHIPPING,
  },
  {
    id: 2,
    name: 'Tailored Wide Trouser',
    slug: 'tailored-wide-trouser',
    category: 'bottoms',
    categoryLabel: 'Men / Bottoms',
    price: 680000,
    priceLabel: '₹6,800',
    imgClass: 'p2',
    hoverClass: 'p2h',
    filter: 'bottoms',
    details: 'Precision-tailored wide-leg trousers in a mid-weight wool blend. A high-rise cut with a clean front crease and discreet side pockets. The fluid fall of the leg reads equally polished in boardrooms and galleries.',
    materials: '72% Wool, 28% Polyester. Dry clean only. Store on a hanger to preserve the crease.',
    shipping: SHIPPING,
  },
  {
    id: 3,
    name: 'Cashmere Overcoat',
    slug: 'cashmere-overcoat',
    category: 'outerwear',
    categoryLabel: 'Women / Outerwear',
    price: 1850000,
    priceLabel: '₹18,500',
    imgClass: 'p3',
    hoverClass: 'p3h',
    filter: 'outerwear',
    details: 'A single-breasted overcoat in Grade-A cashmere from the Mongolian highlands. Notched lapels, a clean A-line silhouette, and two deep welt pockets. Fully lined in cupro for a smooth, static-free drape. An investment in lasting warmth.',
    materials: '100% Grade-A Cashmere. Dry clean only. Store folded in a breathable cotton bag. Cedar blocks recommended.',
    shipping: SHIPPING,
  },
  {
    id: 4,
    name: 'Woven Leather Tote',
    slug: 'woven-leather-tote',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 920000,
    priceLabel: '₹9,200',
    imgClass: 'p4',
    hoverClass: 'p4h',
    filter: 'accessories',
    details: 'Handwoven in full-grain vegetable-tanned leather by artisans in Dharavi. Each tote takes approximately six hours to complete. The open-top structure accommodates a 13" laptop; an interior zip pocket keeps essentials secure. The leather develops a rich patina with use.',
    materials: 'Full-grain vegetable-tanned leather. Brass hardware. Unlined interior. Clean with a soft dry cloth; condition with leather balm every 3–6 months.',
    shipping: SHIPPING,
  },
  {
    id: 5,
    name: 'Silk Column Shirt',
    slug: 'silk-column-shirt',
    category: 'tops',
    categoryLabel: 'Women / Tops',
    price: 560000,
    priceLabel: '₹5,600',
    imgClass: 'p5',
    hoverClass: 'p5h',
    filter: 'tops',
    details: 'A straight-cut column shirt in 16mm mulberry silk. The minimal collarband and hidden placket keep lines clean. Worn tucked for evening; half-tucked with wide trousers for day. Available in Ivory, Dusk Rose, and Onyx.',
    materials: '100% Mulberry Silk (16mm). Dry clean recommended. Hand wash cold in a silk-safe detergent — do not wring. Hang to dry away from direct sunlight. Iron on the silk setting, reverse side.',
    shipping: SHIPPING,
  },
  {
    id: 6,
    name: 'Pleated Midi Skirt',
    slug: 'pleated-midi-skirt',
    category: 'bottoms',
    categoryLabel: 'Women / Bottoms',
    price: 490000,
    priceLabel: '₹4,900',
    imgClass: 'p6',
    hoverClass: 'p6h',
    filter: 'bottoms',
    details: 'Knife-pleated midi skirt in a lightweight satin-weave viscose. The fluid pleats open gracefully with movement; a concealed back zip keeps the silhouette uninterrupted. Falls below the knee for an elongated, elegant proportion.',
    materials: '78% Viscose, 22% Polyester. Hand wash cold or dry clean. Do not tumble dry. Steam to remove creases — do not iron directly.',
    shipping: SHIPPING,
  },
  {
    id: 7,
    name: 'Double-Breasted Blazer',
    slug: 'double-breasted-blazer',
    category: 'outerwear',
    categoryLabel: 'Men / Outerwear',
    price: 1240000,
    priceLabel: '₹12,400',
    imgClass: 'p7',
    hoverClass: 'p7h',
    filter: 'outerwear',
    details: 'A six-button double-breasted blazer in a micro-houndstooth wool. Structured shoulders, a suppressed waist, and patch chest pocket reference classic tailoring while the relaxed fit brings it firmly into the present. Bemberg-lined for comfort.',
    materials: '100% Wool. Dry clean only. Store on a wide, shaped hanger. Brush gently with a soft bristle brush after wear.',
    shipping: SHIPPING,
  },
  {
    id: 8,
    name: 'Merino Wool Scarf',
    slug: 'merino-wool-scarf',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 280000,
    priceLabel: '₹2,800',
    imgClass: 'p8',
    hoverClass: 'p8h',
    filter: 'accessories',
    details: 'An oversized scarf in extra-fine 18.5-micron merino wool — softer than cashmere blends at a fraction of the weight. The generous 200cm length allows for multiple draping styles. Finished with a hand-knotted fringe. One size.',
    materials: '100% Extra-Fine Merino Wool (18.5 micron). Hand wash cold with a wool-safe detergent. Lay flat to dry. Store folded.',
    shipping: SHIPPING,
  },
  {
    id: 101,
    name: 'Draped Silk Jumpsuit',
    slug: 'draped-silk-jumpsuit',
    category: 'tops',
    categoryLabel: 'Women / Essentials',
    price: 890000,
    priceLabel: '₹8,900',
    imgClass: 'ed1',
    hoverClass: 'ed1h',
    filter: 'tops',
    details: 'Editorial favourite: a floor-skimming draped silk jumpsuit with wide palazzo legs and a cowl back. The halter neckline is adjustable; the waist tie can be worn front or back. Photographed extensively in our Summer Solstice editorial.',
    materials: '100% Silk Charmeuse. Dry clean only. Store hanging on a padded hanger. Avoid prolonged exposure to sunlight.',
    shipping: SHIPPING,
  },
  {
    id: 102,
    name: 'Structured Linen Dress',
    slug: 'structured-linen-dress',
    category: 'bottoms',
    categoryLabel: 'Women / Essentials',
    price: 740000,
    priceLabel: '₹7,400',
    imgClass: 'ed2',
    hoverClass: 'ed2h',
    filter: 'bottoms',
    details: 'A sculptural shift dress in stonewashed Irish linen. The A-line silhouette is given structure by internal boning at the bodice and a wide belted waist. Pockets. Always pockets. Worn here with the Woven Leather Tote.',
    materials: '100% Irish Linen (stonewashed). Dry clean or gentle machine wash cold, inside out. Tumble dry low. Iron damp on high heat.',
    shipping: SHIPPING,
  },
];

async function main() {
  console.log('Seeding products...');
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
    console.log(`  ✓ ${product.name}`);
  }
  console.log('Seeding complete.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
