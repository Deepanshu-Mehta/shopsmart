const passport = require('passport');

function requireAuth(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: 'Unauthorised — please log in' });
    req.user = user;
    next();
  })(req, res, next);
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden — admin only' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
