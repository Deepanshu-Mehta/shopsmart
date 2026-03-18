jest.mock('../src/prisma/client', () => ({
  $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
}));

const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('should return 200 and status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
