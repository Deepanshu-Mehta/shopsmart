#!/bin/bash

#===============================================================================
# ShopSmart - Development Environment Setup Script
# Usage: ./scripts/run.sh [ENV] [SERVER_PORT] [CLIENT_PORT]
#===============================================================================

# Always run from project root regardless of where script is called from
cd "$(dirname "$0")/.." || exit 1

# Configuration
ENV=${1:-development}
SERVER_PORT=${2:-5001}
CLIENT_PORT=${3:-5173}

#-------------------------------------------------------------------------------
# Help Flag
#-------------------------------------------------------------------------------
if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
    cat << EOF
Usage: ./scripts/run.sh [ENV] [SERVER_PORT] [CLIENT_PORT]

Arguments:
    ENV           Environment: development, staging, production (default: development)
    SERVER_PORT   Backend server port (default: 5001)
    CLIENT_PORT   Frontend dev server port (default: 5173)

Examples:
    ./scripts/run.sh                           # Development on default ports
    ./scripts/run.sh staging 5002 3000         # Custom env and ports
    ./scripts/run.sh production                # Production on default ports

Exit Codes:
    0  - Success
    1  - General error / prerequisites missing
    2  - Directory not found
    3  - Dependency installation failed
EOF
    exit 0
fi

echo "=========================================="
echo "  ShopSmart Development Setup"
echo "  Environment: $ENV"
echo "  Server Port: $SERVER_PORT"
echo "  Client Port: $CLIENT_PORT"
echo "=========================================="

# Exit on error
set -e

# Function to log messages
log() {
    echo "[INFO] $1"
}

# Function to handle errors
error() {
    echo "[ERROR] $1" >&2
    exit "${2:-1}"
}

# Cleanup trap for graceful exit on failure
cleanup() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        echo ""
        echo "[ERROR] Setup failed with exit code $exit_code" >&2
    fi
}
trap cleanup EXIT

#-------------------------------------------------------------------------------
# 1. Check Prerequisites
#-------------------------------------------------------------------------------
log "Checking prerequisites..."
command -v node >/dev/null 2>&1 || error "Node.js is not installed. Please install Node.js to continue."
command -v npm >/dev/null 2>&1 || error "npm is not installed. Please install npm to continue."
log "Prerequisites met: Node $(node -v), npm $(npm -v)"

#-------------------------------------------------------------------------------
# 2. Setup Environment Files (Idempotent)
#-------------------------------------------------------------------------------
log "Setting up environment files..."

if [ ! -f "server/.env" ]; then
    cat > server/.env << EOF
NODE_ENV=$ENV
PORT=$SERVER_PORT
CLIENT_URL=http://localhost:$CLIENT_PORT
EOF
    log "Created server/.env"
else
    log "server/.env already exists, skipping..."
fi

if [ ! -f "client/.env" ]; then
    cat > client/.env << EOF
VITE_API_URL=http://localhost:$SERVER_PORT
VITE_ENV=$ENV
EOF
    log "Created client/.env"
else
    log "client/.env already exists, skipping..."
fi

#-------------------------------------------------------------------------------
# 3. Setup Server (Idempotent)
#-------------------------------------------------------------------------------
log "Setting up Backend (Server)..."
if [ ! -d "server" ]; then
    error "Server directory not found!" 2
fi

cd server
if [ ! -d "node_modules" ] || [ package.json -nt node_modules ] || [ -f package-lock.json ] && [ package-lock.json -nt node_modules ]; then
    log "Installing/Updating server dependencies..."
    npm install || error "Failed to install server dependencies" 3
    touch node_modules  # Update timestamp for idempotency check
else
    log "Server dependencies are up to date."
fi
cd ..

#-------------------------------------------------------------------------------
# 4. Setup Client (Idempotent)
#-------------------------------------------------------------------------------
log "Setting up Frontend (Client)..."
if [ ! -d "client" ]; then
    error "Client directory not found!" 2
fi

cd client
if [ ! -d "node_modules" ] || [ package.json -nt node_modules ] || [ -f package-lock.json ] && [ package-lock.json -nt node_modules ]; then
    log "Installing/Updating client dependencies..."
    npm install || error "Failed to install client dependencies" 3
    touch node_modules  # Update timestamp for idempotency check
else
    log "Client dependencies are up to date."
fi
cd ..

#-------------------------------------------------------------------------------
# 5. Final Verification
#-------------------------------------------------------------------------------
log "Verifying installation..."
[ -d "server/node_modules" ] || error "Server node_modules missing!" 3
[ -d "client/node_modules" ] || error "Client node_modules missing!" 3

echo ""
echo "=========================================="
echo "  ✓ Setup Complete!"
echo "=========================================="
echo ""
echo "To start development servers:"
echo "  cd server && npm run dev"
echo "  cd client && npm run dev"
echo ""

exit 0
