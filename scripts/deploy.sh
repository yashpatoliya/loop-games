#!/usr/bin/env bash
# Deploys the current branch to this server: pulls the latest commit,
# installs dependencies, rebuilds, and reloads the pm2-managed process.
#
# Run this ON the server (not on your local machine), from anywhere —
# it resolves its own repo root. Requires: git, node/npm, pm2, curl.
#
# One-time setup on a fresh server:
#   npm install -g pm2
#   git clone git@github.com:yashpatoliya/loop-games.git
#   cd loop-games && cp .env.local.example .env.local   # fill in real values
#   ./scripts/deploy.sh
#   pm2 startup                                          # survive reboots
#
# Usage: ./scripts/deploy.sh [branch]   (defaults to "main")
set -euo pipefail

BRANCH="${1:-main}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
APP_NAME="loop-games"
HEALTH_URL="http://127.0.0.1:4000"

log() {
  echo "[deploy] $(date '+%Y-%m-%d %H:%M:%S') $*"
}

cd "$REPO_ROOT"

if [ -n "$(git status --porcelain)" ]; then
  log "ERROR: working tree has uncommitted changes. Refusing to deploy over them."
  log "Commit, stash, or discard them on the server first, then re-run."
  git status --short
  exit 1
fi

log "Fetching origin/$BRANCH..."
git fetch origin "$BRANCH"

BEFORE_SHA="$(git rev-parse HEAD)"
AFTER_SHA="$(git rev-parse "origin/$BRANCH")"

if [ "$BEFORE_SHA" = "$AFTER_SHA" ]; then
  log "Already up to date at $BEFORE_SHA — rebuilding anyway."
else
  log "Updating $BEFORE_SHA -> $AFTER_SHA"
fi

git checkout "$BRANCH"
git merge --ff-only "origin/$BRANCH"

log "Installing dependencies (npm ci)..."
npm ci

log "Building..."
npm run build

if ! command -v pm2 >/dev/null 2>&1; then
  log "ERROR: pm2 is not installed. Install it with: npm install -g pm2"
  exit 1
fi

log "Starting/reloading pm2 process '$APP_NAME'..."
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload ecosystem.config.js --update-env
else
  pm2 start ecosystem.config.js
fi
pm2 save

log "Health-checking $HEALTH_URL..."
ATTEMPTS=10
until curl -sf -o /dev/null "$HEALTH_URL" || [ "$ATTEMPTS" -eq 0 ]; do
  ATTEMPTS=$((ATTEMPTS - 1))
  sleep 1
done

if curl -sf -o /dev/null "$HEALTH_URL"; then
  log "Deploy succeeded — $APP_NAME is responding on $HEALTH_URL (commit $(git rev-parse --short HEAD))."
else
  log "ERROR: $APP_NAME did not respond on $HEALTH_URL after restart."
  log "Check logs with: pm2 logs $APP_NAME --lines 100"
  exit 1
fi
