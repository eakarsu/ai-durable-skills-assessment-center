#!/usr/bin/env bash
# Durable Skills Assessment Center — local development starter
set -euo pipefail
cd "$(dirname "$0")"

# Portfolio-level OpenRouter credentials (optional), then local overrides.
if [ -f ../.openrouter.env ]; then
  set -a; source ../.openrouter.env; set +a
fi
if [ -f .env ]; then
  set -a; source .env; set +a
fi

if [ -z "${NEXTAUTH_SECRET:-}" ] || [ "${#NEXTAUTH_SECRET}" -lt 32 ]; then
  echo "NEXTAUTH_SECRET must be set to at least 32 characters." >&2
  exit 1
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not set. Copy .env.example to .env first." >&2
  exit 1
fi

if [ ! -d node_modules ]; then
  npm install
fi

npx prisma migrate deploy

exec npm run dev
