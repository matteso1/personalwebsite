#!/usr/bin/env bash
#
# sync-mirror.sh — build the site and push dist/ to the Tor/I2P mirror VPS.
# Run locally. Set VPS_HOST (and optionally VPS_USER) in your env or below.
#
#   VPS_HOST=107.172.92.102 ./scripts/sync-mirror.sh
#
# Assumes onion-setup.sh has already run on the server. Use SSH keys.

set -euo pipefail

VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_HOST:?set VPS_HOST to your server IP/hostname}"
WEBROOT="/srv/nils-site"

cd "$(dirname "$0")/.."

echo "==> Building ..."
npx astro build

echo "==> Syncing dist/ -> ${VPS_USER}@${VPS_HOST}:${WEBROOT} ..."
rsync -az --delete --no-perms --omit-dir-times \
  dist/ "${VPS_USER}@${VPS_HOST}:${WEBROOT}/"

echo "==> Done. Mirror updated."
