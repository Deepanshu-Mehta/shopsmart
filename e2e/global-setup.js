// Runs once before all Playwright tests.
// Seeds the E2E test user into the database and stores a valid JWT in env.
const path = require('path');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

// For local development (Option 1): load server's .env so DATABASE_URL + JWT_SECRET are available.
// In CI (Option 2): these are already set as workflow env vars — dotenv is a no-op.
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const E2E_USER_ID = 'e2e-test-user-cuid001';
const E2E_USER_EMAIL = 'e2e@vestir.com';
const E2E_USER_NAME = 'Test User';

module.exports = async function globalSetup() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('[E2E global-setup] DATABASE_URL is not set');

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error('[E2E global-setup] JWT_SECRET is not set');

  const pool = new Pool({ connectionString: dbUrl });

  // Upsert the E2E test user (idempotent)
  await pool.query(
    `INSERT INTO "User" (id, email, name, role, "createdAt")
     VALUES ($1, $2, $3, 'USER', NOW())
     ON CONFLICT (email) DO UPDATE SET id = $1, name = $3`,
    [E2E_USER_ID, E2E_USER_EMAIL, E2E_USER_NAME]
  );

  // Ensure the user has a cart (idempotent)
  await pool.query(
    `INSERT INTO "Cart" (id, "userId")
     VALUES ('e2e-cart-001', $1)
     ON CONFLICT ("userId") DO NOTHING`,
    [E2E_USER_ID]
  );

  await pool.end();

  // Generate a 2-hour JWT for the test user
  const token = jwt.sign(
    { sub: E2E_USER_ID, email: E2E_USER_EMAIL, role: 'USER' },
    jwtSecret,
    { expiresIn: '2h' }
  );

  // Store for use in test files via process.env
  process.env.E2E_AUTH_TOKEN = token;

  console.log('[E2E] Test user seeded and JWT generated');
};
