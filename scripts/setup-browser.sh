#!/usr/bin/env bash
# Installs Chrome for Testing into ./.browsers (project-local, gitignored).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BROWSERS_DIR="$ROOT/.browsers"

npx -y @puppeteer/browsers@3.2.6 install chrome@stable --path "$BROWSERS_DIR" >/dev/null

"$ROOT/scripts/chrome-path.sh"
