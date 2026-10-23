#!/usr/bin/env bash
# Launches Playwright MCP on a headed Chrome for Testing with a persistent profile,
# so the user logs in once by hand and the session survives restarts.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXE="$("$ROOT/scripts/chrome-path.sh")"

exec npx -y @playwright/mcp@0.0.83 \
  --executable-path "$EXE" \
  --user-data-dir "$ROOT/.browser-profile" \
  --output-dir "$ROOT/.playwright-output" \
  --viewport-size "1440,900"
