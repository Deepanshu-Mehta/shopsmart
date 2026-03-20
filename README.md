# VESTIR — The Quiet Collection

A full-stack luxury fashion storefront built with React + Express + PostgreSQL.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 7 |
| Backend | Node.js, Express |
| ORM | Prisma 7 (pg adapter) |
| Database | PostgreSQL |
| Auth | Passport.js — JWT (httpOnly cookie) + optional Google OAuth2 |
| Images | Cloudinary |
| Deployment | AWS EC2 via GitHub Actions (primary) · Vercel (frontend) · Render (backend) |

## Getting Started

### Prerequisites
- Node.js 22+
- A PostgreSQL database
- Cloudinary account
- *(Optional)* Google OAuth2 credentials

### Quick start (recommended)

The `run.sh` script handles env file creation, dependency installation, and starts both servers in parallel:

```bash
./scripts/run.sh                     # development on default ports (5001 / 5173)
./scripts/run.sh development 5002 3000  # custom ports
```

### Manual setup

**Server:**
```bash
cd server
npm install
cp .env.example .env   # fill in your credentials
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev            # starts on port 5001
```

**Client:**
```bash
cd client
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev            # starts on port 5173
```

## Environment Variables

**server/.env** — see `server/.env.example`

Key variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens (min 32 chars) |
| `FRONTEND_URL` | Yes | Allowed CORS origin(s), comma-separated |
| `CLOUDINARY_URL` | Yes | Cloudinary connection string |
| `GOOGLE_CLIENT_ID` | No | Enables Google OAuth2 when set |
| `GOOGLE_CLIENT_SECRET` | No | Required if `GOOGLE_CLIENT_ID` is set |
| `GOOGLE_CALLBACK_URL` | No | OAuth2 redirect URI |
| `ADMIN_BOOTSTRAP_SECRET` | No | One-time secret for first admin promotion |

**client/.env**
```
VITE_API_URL=http://localhost:5001
```

## API Endpoints

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Create account (email + password) |
| POST | `/auth/login` | — | Login (email + password) |
| POST | `/auth/logout` | — | Clear JWT cookie |
| GET | `/auth/me` | JWT | Get current user |
| POST | `/auth/promote-self` | JWT | Promote self to admin (requires bootstrap secret, one-time use) |
| GET | `/auth/google` | — | Start Google OAuth2 flow *(only active when `GOOGLE_CLIENT_ID` is set)* |

### Products

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | — | Health check |
| GET | `/api/products` | — | List products (`?category=tops&page=1&limit=20`) |
| GET | `/api/products/:id` | — | Product detail |
| POST | `/api/newsletter` | — | Subscribe to newsletter |

### Cart

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/cart` | JWT | Get cart with items |
| POST | `/api/cart/items` | JWT | Add item |
| PATCH | `/api/cart/items/:id` | JWT | Update quantity |
| DELETE | `/api/cart/items/:id` | JWT | Remove item |

### Admin

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/products` | Admin | List all products (including inactive) |
| POST | `/api/admin/products` | Admin | Create product |
| PUT | `/api/admin/products/:id` | Admin | Update product |
| DELETE | `/api/admin/products/:id` | Admin | Soft-delete product |
| POST | `/api/admin/products/:id/image` | Admin | Upload product image to Cloudinary |
| GET | `/api/admin/newsletter` | Admin | List newsletter subscribers |

## Testing

```bash
# Server unit tests (Jest + Supertest)
cd server && npm test

# Client unit tests (Vitest + React Testing Library)
cd client && npm test

# E2E tests (Playwright — requires server + client running)
cd e2e && npx playwright test
```

Tests are also enforced locally via Husky pre-commit hooks (lint-staged + both test suites must pass before a commit is accepted).

## CI/CD Pipeline

Every push and pull request runs a three-job GitHub Actions pipeline:

1. **Client** — install → test → lint → format check → build
2. **Server** — install → Prisma generate + migrate → test → lint → format check (against a real PostgreSQL 16 service)
3. **E2E** — seeds DB → starts server + client → runs Playwright tests (depends on jobs 1 & 2)

On a successful run against `main`, the **Deploy to EC2** workflow triggers automatically via SSH, pulls the latest code, runs `scripts/deploy.sh`, and verifies the `/api/health` endpoint.

## Deployment

### Primary — AWS EC2 (automated)

Deployment is fully automated through GitHub Actions (`.github/workflows/deploy-ec2.yml`):

1. CI pipeline passes on `main`
2. GitHub Actions SSHes into the EC2 instance
3. Runs `scripts/deploy.sh --skip-build` (idempotent — safe to run multiple times)
4. Health check retries `/api/health` up to 12 times before failing

To deploy manually:
```bash
bash scripts/deploy.sh          # full deploy (includes client build)
bash scripts/deploy.sh --skip-build    # skip client build (frontend served from Vercel/CDN)
bash scripts/deploy.sh --skip-migrate  # skip DB migrations
```

### Alternative — Vercel + Render

- **Frontend**: Deploy to [Vercel](https://vercel.com) — `vercel.json` is preconfigured with SPA rewrites. Set `VITE_API_URL` to your backend URL.
- **Backend**: Deploy to [Render](https://render.com) using `render.yaml`.
