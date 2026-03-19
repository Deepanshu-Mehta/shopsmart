const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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

// clearCookie must not include maxAge — it overrides the expiry to the past
const CLEAR_COOKIE_OPTIONS = {
  httpOnly: COOKIE_OPTIONS.httpOnly,
  secure: COOKIE_OPTIONS.secure,
  sameSite: COOKIE_OPTIONS.sameSite,
};

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// POST /auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });
    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(409).json({ error: 'An account with this email already exists' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });

    const token = signToken(user);
    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password)
      return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken(user);
    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
});

// GET /auth/google — only available when Google OAuth is configured
if (process.env.GOOGLE_CLIENT_ID) {
  router.get(
    '/google',
    passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
  );

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
}

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

  res.clearCookie('token', CLEAR_COOKIE_OPTIONS);
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
