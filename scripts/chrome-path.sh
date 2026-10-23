#!/usr/bin/env bash
# Prints the newest Chrome for Testing executable under ./.browsers, exits 1 if none.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

EXE="$(find "$ROOT/.browsers/chrome" -type f \
  \( -path '*/Contents/MacOS/Google Chrome for Testing' -o -path '*/chrome-linux64/chrome' \) 2>/dev/null \
  | sort -V | tail -1)"

if [[ -z "$EXE" ]]; then
  echo "Chrome for Testing bulunamadı. Önce: bash scripts/setup-browser.sh" >&2
  exit 1
fi
echo "$EXE"
