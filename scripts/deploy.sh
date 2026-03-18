#!/usr/bin/env bash
# Idempotent production deploy script for VESTIR server
# Safe to run multiple times — each step is a no-op if already in desired state.
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER_DIR="$APP_DIR/server"
CLIENT_DIR="$APP_DIR/client"
LOG_DIR="$APP_DIR/logs"

echo "==> VESTIR deploy starting at $(date)"
echo "    App root: $APP_DIR"

# ── Parse flags ─────────────────────────────────────────────────────────────
SKIP_MIGRATE=false
SKIP_BUILD=false
for arg in "$@"; do
  case $arg in
    --skip-migrate) SKIP_MIGRATE=true ;;
    --skip-build)   SKIP_BUILD=true ;;
  esac
done

# ── Ensure required directories exist (idempotent) ───────────────────────────
mkdir -p "$LOG_DIR" "$SERVER_DIR/uploads"

# ── Install server dependencies (reproducible, no devDependencies) ──────────
echo "==> Installing server dependencies"
npm ci --omit=dev --prefix "$SERVER_DIR"

# ── Generate Prisma client (always safe to re-run) ───────────────────────────
echo "==> Generating Prisma client"
npx prisma generate --schema="$SERVER_DIR/prisma/schema.prisma"

# ── Run database migrations (no-op if already applied) ───────────────────────
if [ "$SKIP_MIGRATE" = false ]; then
  echo "==> Running database migrations"
  npx prisma migrate deploy --schema="$SERVER_DIR/prisma/schema.prisma"
else
  echo "==> Skipping database migrations (--skip-migrate)"
fi

# ── Build client (optional, skip if pre-built) ───────────────────────────────
if [ "$SKIP_BUILD" = false ]; then
  echo "==> Building client"
  npm ci --prefix "$CLIENT_DIR"
  npm run build --prefix "$CLIENT_DIR"
else
  echo "==> Skipping client build (--skip-build)"
fi

# ── Start / restart server process via PM2 ───────────────────────────────────
echo "==> Starting/restarting server with PM2"
pm2 restart vestir-server 2>/dev/null \
  || pm2 start "$SERVER_DIR/ecosystem.config.js" --env production

# Persist process list so it survives reboots
pm2 save

echo "==> Deploy complete at $(date)"
