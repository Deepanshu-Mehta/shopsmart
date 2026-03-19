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
# Stop PM2 first to free RAM on t2.micro during npm ci
echo "==> Stopping PM2 to free memory during install"
pm2 stop all 2>/dev/null || true

echo "==> Installing server dependencies"
npm ci --omit=dev --ignore-scripts --no-audit --prefix "$SERVER_DIR"

# ── Generate Prisma client & run migrations (must run from SERVER_DIR so .env is found) ──
cd "$SERVER_DIR"

echo "==> Generating Prisma client"
"$SERVER_DIR/node_modules/.bin/prisma" generate

if [ "$SKIP_MIGRATE" = false ]; then
  echo "==> Running database migrations"
  "$SERVER_DIR/node_modules/.bin/prisma" migrate deploy
else
  echo "==> Skipping database migrations (--skip-migrate)"
fi

cd "$APP_DIR"

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
if pm2 describe vestir-server > /dev/null 2>&1; then
  pm2 restart vestir-server --update-env
else
  pm2 start "$SERVER_DIR/ecosystem.config.js" --env production
fi

# Persist process list so it survives reboots
pm2 save

# ── Verify process is online (not errored) ────────────────────────────────────
echo "==> Verifying server status"
sleep 3
STATUS=$(pm2 jlist | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const app=JSON.parse(d).find(a=>a.name==='vestir-server'); process.stdout.write(app ? app.pm2_env.status : 'not_found')")
if [ "$STATUS" != "online" ]; then
  echo "ERROR: vestir-server status is '$STATUS' — check logs with: pm2 logs vestir-server"
  exit 1
fi

echo "==> Deploy complete at $(date)"
