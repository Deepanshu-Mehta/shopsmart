jest.mock('../src/prisma/client', () => ({
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}));

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prisma/client');

const sampleProduct = {
  id: 1,
  name: 'Linen Drape Top',
  slug: 'linen-drape-top',
  category: 'tops',
  categoryLabel: 'Tops',
  price: 4200,
  priceLabel: '₹4,200',
  imgUrl: '/img/top.jpg',
  hoverImgUrl: '/img/top-hover.jpg',
  imgClass: 'img-top',
  hoverClass: 'img-top-hover',
  filter: 'tops',
  isActive: true,
  details: 'Linen drape details',
  materials: 'Cotton, Linen',
  shipping: 'Free shipping over ₹5,000',
};

describe('Products routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/products', () => {
    it('returns 200 with an array of products', async () => {
      prisma.product.findMany.mockResolvedValue([sampleProduct]);

      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toMatchObject({ name: 'Linen Drape Top' });
    });

    it('returns empty array when no products exist', async () => {
      prisma.product.findMany.mockResolvedValue([]);

      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('filters by category when ?category= query param is present', async () => {
      prisma.product.findMany.mockResolvedValue([sampleProduct]);

      await request(app).get('/api/products?category=tops');

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true, category: 'tops' },
        })
      );
    });

    it('queries with where: { isActive: true } without category param', async () => {
      prisma.product.findMany.mockResolvedValue([]);

      await request(app).get('/api/products');

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: true } })
      );
    });

    it('returns 500 when prisma throws unexpected error', async () => {
      prisma.product.findMany.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(500);
    });
  });

  describe('GET /api/products/:id', () => {
    it('returns 200 with full product when found and active', async () => {
      prisma.product.findUnique.mockResolvedValue(sampleProduct);

      const res = await request(app).get('/api/products/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ id: 1, name: 'Linen Drape Top' });
    });

    it('returns 400 for non-numeric id', async () => {
      const res = await request(app).get('/api/products/abc');

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({ error: 'Invalid product id' });
    });

    it('returns 404 when product does not exist', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/api/products/99');

      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchObject({ error: 'Product not found' });
    });

    it('returns 404 when product is inactive', async () => {
      prisma.product.findUnique.mockResolvedValue({ ...sampleProduct, isActive: false });

      const res = await request(app).get('/api/products/1');

      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchObject({ error: 'Product not found' });
    });
  });
});
