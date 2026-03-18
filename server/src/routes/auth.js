const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const prisma = require('../prisma/client');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// GET /auth/google — initiate OAuth
router.get(
  '/google',
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
);

// GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}?auth=error`,
  }),
  (req, res) => {
    const token = signToken(req.user);
    res.cookie('token', token, COOKIE_OPTIONS);
    res.redirect(process.env.FRONTEND_URL);
  }
);

// GET /auth/me — current user
router.get('/me', requireAuth, (req, res) => {
  const { id, email, name, role } = req.user;
  res.json({ id, email, name, role });
});

// POST /auth/logout — revoke token then clear cookie
router.post('/logout', async (req, res) => {
  const token = req.cookies?.token;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const jti = `${payload.sub}:${payload.iat}`;

      // Opportunistically clean up expired entries, then record this revocation
      await prisma.revokedToken.deleteMany({ where: { expiresAt: { lt: new Date() } } });
      await prisma.revokedToken.create({
        data: { jti, expiresAt: new Date(payload.exp * 1000) },
      });
    } catch {
      // Token already expired or invalid — nothing to revoke
    }
  }

  // eslint-disable-next-line no-unused-vars
  const { maxAge: _maxAge, ...clearCookieOptions } = COOKIE_OPTIONS;
  res.clearCookie('token', clearCookieOptions);
  res.json({ message: 'Logged out' });
});

// POST /auth/promote-self — bootstrap first admin without raw SQL
// Requires ADMIN_BOOTSTRAP_SECRET env var and zero existing admins
router.post('/promote-self', requireAuth, async (req, res, next) => {
  try {
    const { secret } = req.body;
    if (!secret || secret !== process.env.ADMIN_BOOTSTRAP_SECRET) {
      return res.status(403).json({ error: 'Invalid bootstrap secret' });
    }

    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    if (adminCount > 0) {
      return res
        .status(409)
        .json({ error: 'An admin already exists. Use the admin panel to manage roles.' });
    }

    const user = await prisma.user.update({ where: { id: req.user.id }, data: { role: 'ADMIN' } });
    res.json({ message: 'Promoted to admin', role: user.role });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
