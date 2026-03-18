jest.mock('../src/prisma/client', () => ({
  user: { findUnique: jest.fn() },
  revokedToken: { findUnique: jest.fn(), create: jest.fn(), deleteMany: jest.fn() },
}));

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prisma/client');
const { makeAuthCookie } = require('./helpers');

const testUser = {
  id: 'user-cuid-1',
  email: 'test@vestir.com',
  name: 'Test User',
  role: 'USER',
};

describe('Auth routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /auth/me', () => {
    it('returns 401 when no cookie is sent', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.statusCode).toBe(401);
    });

    it('returns 200 with user info for valid JWT cookie', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);
      const res = await request(app).get('/auth/me').set('Cookie', makeAuthCookie());
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        id: 'user-cuid-1',
        email: 'test@vestir.com',
        name: 'Test User',
        role: 'USER',
      });
    });

    it('returns 401 for JWT signed with wrong secret', async () => {
      const jwt = require('jsonwebtoken');
      const badToken = jwt.sign(
        { sub: 'user-cuid-1', email: 'test@vestir.com', role: 'USER' },
        'wrong-secret'
      );
      const res = await request(app)
        .get('/auth/me')
        .set('Cookie', `token=${badToken}`);
      expect(res.statusCode).toBe(401);
    });

    it('returns 401 when user no longer exists in DB', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const res = await request(app).get('/auth/me').set('Cookie', makeAuthCookie());
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('returns 200 on logout', async () => {
      const res = await request(app).post('/auth/logout');
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ message: 'Logged out' });
    });

    it('clears the token cookie', async () => {
      const res = await request(app).post('/auth/logout');
      const setCookie = res.headers['set-cookie'];
      expect(setCookie).toBeDefined();
      const tokenCookie = Array.isArray(setCookie)
        ? setCookie.find((c) => c.startsWith('token='))
        : setCookie;
      expect(tokenCookie).toMatch(/token=/);
      // clearCookie sets Expires to epoch or Max-Age=0
      expect(tokenCookie).toMatch(/Expires=Thu, 01 Jan 1970|Max-Age=0/i);
    });
  });
});
