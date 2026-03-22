#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-publish}"

echo "=> Checking working tree status..."
if [[ -n "$(git status -s)" ]]; then
  echo "Error: Working tree is not clean. Please commit your changes before publishing."
  exit 1
fi

if [[ "${MODE}" == "--dry-run" ]]; then
  echo "=> Dry-running @dhfpub/clawpool-openclaw-admin publish..."
  npm run publish:dry-run
  echo "=> Dry-run completed."
  exit 0
fi

if [[ "${MODE}" != "publish" ]]; then
  echo "Usage: ./publish.sh [--dry-run]"
  exit 1
fi

echo "=> Publishing @dhfpub/clawpool-openclaw-admin to NPM (Public)..."
npm run publish:npm

echo "=> Successfully published!"
