jest.mock('../src/prisma/client', () => ({
  user: { findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn() },
  product: { create: jest.fn(), update: jest.fn() },
  newsletterSubscriber: { findMany: jest.fn() },
  revokedToken: { findUnique: jest.fn() },
}));

jest.mock('../src/config/cloudinary', () => ({
  uploader: { upload_stream: jest.fn() },
}));

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prisma/client');
const { makeAuthCookie, makeAdminCookie } = require('./helpers');

const testUser = { id: 'user-cuid-1', email: 'test@vestir.com', name: 'Test User', role: 'USER' };
const adminUser = { id: 'admin-cuid-1', email: 'admin@vestir.com', name: 'Admin', role: 'ADMIN' };

const newProductBody = {
  name: 'Silk Shirt',
  slug: 'silk-shirt',
  category: 'tops',
  categoryLabel: 'Tops',
  price: 6500,
  priceLabel: '₹6,500',
  imgUrl: null,
  hoverImgUrl: null,
  imgClass: 'img-silk',
  hoverClass: 'img-silk-hover',
  filter: 'tops',
  isActive: true,
  details: 'Silk details',
  materials: 'Silk',
  shipping: 'Free over ₹5,000',
};

describe('Admin routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('unauthenticated / unauthorized', () => {
    it('POST /api/admin/products → 401 without cookie', async () => {
      const res = await request(app).post('/api/admin/products').send(newProductBody);
      expect(res.statusCode).toBe(401);
    });

    it('POST /api/admin/products → 403 for non-admin user', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);
      const res = await request(app)
        .post('/api/admin/products')
        .set('Cookie', makeAuthCookie())
        .send(newProductBody);
      expect(res.statusCode).toBe(403);
    });

    it('GET /api/admin/newsletter → 401 without cookie', async () => {
      const res = await request(app).get('/api/admin/newsletter');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/admin/products', () => {
    it('returns 201 with created product for admin', async () => {
      prisma.user.findUnique.mockResolvedValue(adminUser);
      prisma.product.create.mockResolvedValue({ id: 10, ...newProductBody });

      const res = await request(app)
        .post('/api/admin/products')
        .set('Cookie', makeAdminCookie())
        .send(newProductBody);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({ name: 'Silk Shirt' });
      expect(prisma.product.create).toHaveBeenCalled();
    });
  });

  describe('PUT /api/admin/products/:id', () => {
    it('returns 200 with updated product', async () => {
      prisma.user.findUnique.mockResolvedValue(adminUser);
      prisma.product.update.mockResolvedValue({ ...newProductBody, id: 1, name: 'Updated Shirt' });

      const res = await request(app)
        .put('/api/admin/products/1')
        .set('Cookie', makeAdminCookie())
        .send({ name: 'Updated Shirt' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ name: 'Updated Shirt' });
    });

    it('returns 400 for non-numeric id', async () => {
      prisma.user.findUnique.mockResolvedValue(adminUser);

      const res = await request(app)
        .put('/api/admin/products/abc')
        .set('Cookie', makeAdminCookie())
        .send({ name: 'Test' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({ error: 'Invalid product id' });
    });

    it('returns 404 when product not found (Prisma P2025)', async () => {
      prisma.user.findUnique.mockResolvedValue(adminUser);
      prisma.product.update.mockRejectedValue({ code: 'P2025' });

      const res = await request(app)
        .put('/api/admin/products/999')
        .set('Cookie', makeAdminCookie())
        .send({ name: 'Ghost' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/admin/products/:id', () => {
    it('returns 204 on successful soft-delete', async () => {
      prisma.user.findUnique.mockResolvedValue(adminUser);
      prisma.product.update.mockResolvedValue({ ...newProductBody, id: 1, isActive: false });

      const res = await request(app)
        .delete('/api/admin/products/1')
        .set('Cookie', makeAdminCookie());

      expect(res.statusCode).toBe(204);
      expect(prisma.product.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { isActive: false } })
      );
    });

    it('returns 400 for non-numeric id', async () => {
      prisma.user.findUnique.mockResolvedValue(adminUser);

      const res = await request(app)
        .delete('/api/admin/products/abc')
        .set('Cookie', makeAdminCookie());

      expect(res.statusCode).toBe(400);
    });

    it('returns 404 when product not found (Prisma P2025)', async () => {
      prisma.user.findUnique.mockResolvedValue(adminUser);
      prisma.product.update.mockRejectedValue({ code: 'P2025' });

      const res = await request(app)
        .delete('/api/admin/products/999')
        .set('Cookie', makeAdminCookie());

      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/admin/newsletter', () => {
    it('returns 200 with array of subscribers', async () => {
      prisma.user.findUnique.mockResolvedValue(adminUser);
      prisma.newsletterSubscriber.findMany.mockResolvedValue([
        { id: 'sub-1', email: 'a@test.com', createdAt: new Date().toISOString() },
        { id: 'sub-2', email: 'b@test.com', createdAt: new Date().toISOString() },
      ]);

      const res = await request(app)
        .get('/api/admin/newsletter')
        .set('Cookie', makeAdminCookie());

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET /api/admin/users', () => {
    it('returns 200 with array of users for admin', async () => {
      prisma.user.findUnique.mockResolvedValue(adminUser);
      prisma.user.findMany.mockResolvedValue([
        { id: 'user-cuid-1', email: 'test@vestir.com', name: 'Test User', role: 'USER', createdAt: new Date().toISOString() },
        { id: 'admin-cuid-1', email: 'admin@vestir.com', name: 'Admin', role: 'ADMIN', createdAt: new Date().toISOString() },
      ]);

      const res = await request(app)
        .get('/api/admin/users')
        .set('Cookie', makeAdminCookie());

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
    });

    it('returns 401 without cookie', async () => {
      const res = await request(app).get('/api/admin/users');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PATCH /api/admin/users/:id/role', () => {
    it('returns 200 with updated user when role is valid', async () => {
      prisma.user.findUnique.mockResolvedValue(adminUser);
      prisma.user.update.mockResolvedValue({ id: 'user-cuid-1', email: 'test@vestir.com', name: 'Test User', role: 'ADMIN' });

      const res = await request(app)
        .patch('/api/admin/users/user-cuid-1/role')
        .set('Cookie', makeAdminCookie())
        .send({ role: 'ADMIN' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ role: 'ADMIN' });
    });

    it('returns 400 for invalid role value', async () => {
      prisma.user.findUnique.mockResolvedValue(adminUser);

      const res = await request(app)
        .patch('/api/admin/users/user-cuid-1/role')
        .set('Cookie', makeAdminCookie())
        .send({ role: 'SUPERUSER' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({ error: expect.stringContaining('Invalid role') });
    });

    it('returns 403 for non-admin user', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);

      const res = await request(app)
        .patch('/api/admin/users/user-cuid-1/role')
        .set('Cookie', makeAuthCookie())
        .send({ role: 'ADMIN' });

      expect(res.statusCode).toBe(403);
    });
  });
});
