jest.mock('../src/prisma/client', () => ({
  newsletterSubscriber: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
}));

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prisma/client');

describe('Newsletter routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('POST /api/newsletter', () => {
    it('returns 201 and subscriber id on valid email', async () => {
      prisma.newsletterSubscriber.create.mockResolvedValue({
        id: 'sub-1',
        email: 'user@example.com',
      });

      const res = await request(app)
        .post('/api/newsletter')
        .send({ email: 'user@example.com' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({ message: 'Subscribed successfully', id: 'sub-1' });
    });

    it('returns 400 when email is missing', async () => {
      const res = await request(app).post('/api/newsletter').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({ error: 'Email is required' });
    });

    it('returns 400 for invalid email format', async () => {
      const res = await request(app).post('/api/newsletter').send({ email: 'notanemail' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({ error: 'Invalid email format' });
    });

    it('returns 400 for email with spaces', async () => {
      const res = await request(app).post('/api/newsletter').send({ email: 'bad email@test.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({ error: 'Invalid email format' });
    });

    it('returns 409 when email already exists (Prisma P2002)', async () => {
      prisma.newsletterSubscriber.create.mockRejectedValue({ code: 'P2002' });

      const res = await request(app)
        .post('/api/newsletter')
        .send({ email: 'duplicate@example.com' });

      expect(res.statusCode).toBe(409);
    });

    it('lowercases and trims email before storing', async () => {
      prisma.newsletterSubscriber.create.mockResolvedValue({ id: 'sub-2', email: 'upper@example.com' });

      await request(app).post('/api/newsletter').send({ email: 'UPPER@Example.COM' });

      expect(prisma.newsletterSubscriber.create).toHaveBeenCalledWith({
        data: { email: 'upper@example.com' },
      });
    });
  });
});
