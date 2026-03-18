# VESTIR — The Quiet Collection

A full-stack luxury fashion storefront built with React + Express + PostgreSQL.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Backend | Node.js, Express |
| ORM | Prisma 7 (pg adapter) |
| Database | PostgreSQL (Neon serverless) |
| Auth | Passport.js — JWT (httpOnly cookie) + Google OAuth2 |
| Images | Cloudinary |
| Deployment | Vercel (frontend) + Render (backend) |

## Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g. [Neon](https://neon.tech))
- Google OAuth2 credentials
- Cloudinary account

### Server setup

```bash
cd server
npm install
cp .env.example .env   # fill in your credentials
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev            # starts on port 5001
```

### Client setup

```bash
cd client
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev            # starts on port 5173
```

## Environment Variables

**server/.env** — see `server/.env.example`

**client/.env**
```
VITE_API_URL=http://localhost:5001
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | — | Health check |
| GET | `/api/products` | — | List products (`?category=tops`) |
| GET | `/api/products/:id` | — | Product detail |
| POST | `/api/newsletter` | — | Subscribe |
| GET | `/auth/google` | — | Start Google OAuth |
| GET | `/auth/me` | JWT | Current user |
| POST | `/auth/logout` | — | Clear cookie |
| GET | `/api/cart` | JWT | Get cart |
| POST | `/api/cart/items` | JWT | Add item |
| PATCH | `/api/cart/items/:id` | JWT | Update qty |
| DELETE | `/api/cart/items/:id` | JWT | Remove item |
| POST | `/api/admin/products` | Admin | Create product |
| PUT | `/api/admin/products/:id` | Admin | Update product |
| DELETE | `/api/admin/products/:id` | Admin | Delete product |
| POST | `/api/admin/products/:id/image` | Admin | Upload image |
| GET | `/api/admin/newsletter` | Admin | List subscribers |

## Deployment

- **Backend**: Deploy to [Render](https://render.com) using `render.yaml`
- **Frontend**: Deploy to [Vercel](https://vercel.com) — set `VITE_API_URL` to your Render backend URL
