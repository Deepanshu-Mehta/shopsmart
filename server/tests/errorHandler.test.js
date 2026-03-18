const errorHandler = require('../src/middleware/errorHandler');

function makeRes() {
  const res = {
    _status: null,
    _body: null,
    status(code) {
      this._status = code;
      return this;
    },
    json(body) {
      this._body = body;
      return this;
    },
  };
  return res;
}

describe('errorHandler middleware', () => {
  const req = {};
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('returns 409 for Prisma P2002 (unique constraint)', () => {
    const res = makeRes();
    const err = { code: 'P2002', meta: { target: 'email' } };
    errorHandler(err, req, res, next);
    expect(res._status).toBe(409);
    expect(res._body).toMatchObject({ error: 'Already exists' });
  });

  it('returns 404 for Prisma P2025 (record not found)', () => {
    const res = makeRes();
    const err = { code: 'P2025' };
    errorHandler(err, req, res, next);
    expect(res._status).toBe(404);
    expect(res._body).toMatchObject({ error: 'Not found' });
  });

  it('uses err.status when present', () => {
    const res = makeRes();
    const err = { status: 422, message: 'Unprocessable Entity' };
    errorHandler(err, req, res, next);
    expect(res._status).toBe(422);
    expect(res._body).toMatchObject({ error: 'Unprocessable Entity' });
  });

  it('uses err.statusCode when err.status is not set', () => {
    const res = makeRes();
    const err = { statusCode: 503, message: 'Service Unavailable' };
    errorHandler(err, req, res, next);
    expect(res._status).toBe(503);
  });

  it('defaults to 500 when no status set', () => {
    const res = makeRes();
    const err = new Error('Something broke');
    errorHandler(err, req, res, next);
    expect(res._status).toBe(500);
    expect(res._body).toMatchObject({ error: 'Something broke' });
  });

  it('does not call console.error in test environment', () => {
    const res = makeRes();
    const err = new Error('Silent error');
    errorHandler(err, req, res, next);
    expect(console.error).not.toHaveBeenCalled();
  });
});
