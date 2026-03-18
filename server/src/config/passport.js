const passport = require('passport');
const { Strategy: JwtStrategy } = require('passport-jwt');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const prisma = require('../prisma/client');

// Extract JWT from httpOnly cookie
const cookieExtractor = (req) => {
  if (req && req.cookies) return req.cookies.token || null;
  return null;
};

// JWT Strategy — also checks revocation denylist
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user) return done(null, false);

        // Check if token was explicitly revoked (e.g. after logout)
        const jti = `${payload.sub}:${payload.iat}`;
        const revoked = await prisma.revokedToken.findUnique({ where: { jti } });
        if (revoked) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Google OAuth2 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Google profile'), false);

        // Try to find by googleId first
        let user = await prisma.user.findUnique({ where: { googleId: profile.id } });

        if (!user) {
          // Link to existing account by email, or create new
          user = await prisma.user.upsert({
            where: { email },
            update: { googleId: profile.id, name: profile.displayName },
            create: {
              email,
              name: profile.displayName,
              googleId: profile.id,
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

module.exports = passport;
