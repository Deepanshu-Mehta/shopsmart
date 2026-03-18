const jwt = require('jsonwebtoken');

function makeAuthCookie(overrides = {}) {
  const payload = {
    sub: 'user-cuid-1',
    email: 'test@vestir.com',
    role: 'USER',
    ...overrides,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return `token=${token}`;
}

function makeAdminCookie() {
  return makeAuthCookie({ sub: 'admin-cuid-1', role: 'ADMIN' });
}

module.exports = { makeAuthCookie, makeAdminCookie };
