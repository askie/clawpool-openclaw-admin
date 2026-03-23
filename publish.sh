#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
AUTH_HELPER_SCRIPT="${ROOT_DIR}/scripts/npm-publish.exp"
REGISTRY="https://registry.npmjs.org/"
PACKAGE_SCOPE="@dhfpub"
MODE="${1:-publish}"

run_with_auto_browser_auth() {
  if [[ ! -f "${AUTH_HELPER_SCRIPT}" ]]; then
    echo "Error: Missing npm web auth helper: ${AUTH_HELPER_SCRIPT}"
    exit 1
  fi
  expect "${AUTH_HELPER_SCRIPT}" "$@"
}

ensure_registry_login() {
  local whoami_output

  if whoami_output="$(npm whoami --registry="${REGISTRY}" 2>/dev/null)"; then
    echo "=> npm auth ready as ${whoami_output}"
    return
  fi

  echo "=> npm auth missing. Starting web login and opening the browser if needed..."
  run_with_auto_browser_auth npm login --auth-type=web --registry="${REGISTRY}" --scope="${PACKAGE_SCOPE}"

  whoami_output="$(npm whoami --registry="${REGISTRY}")" || {
    echo "Error: npm login completed but whoami still failed."
    exit 1
  }
  echo "=> npm auth ready as ${whoami_output}"
}

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
ensure_registry_login
run_with_auto_browser_auth npm run publish:npm

echo "=> Successfully published!"
