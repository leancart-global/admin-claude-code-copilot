#!/bin/sh
# Node launcher: the user needs nothing but Claude Code installed.
#   sh scripts/run.sh <script.mjs> [args…]   → runs the script with Node 20+ (system Node if suitable, else a private copy)
#   sh scripts/run.sh --ensure               → only makes sure a suitable Node is available, prints its path
# The private copy lives in ./.runtime/ (project-local, gitignored); nothing is installed system-wide.
# Everything except the script's own output goes to stderr (stdout carries the MCP protocol).
# Exits with 2 when Node cannot be obtained, so the PreToolUse guard hook fails closed (blocks) instead of open.

NODE_VERSION="v20.19.5"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME="$ROOT/.runtime"

case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*) OS=win ;;
  Darwin) OS=darwin ;;
  *) OS=linux ;;
esac

if [ "$OS" = win ]; then PRIVATE_NODE="$RUNTIME/node/node.exe"; else PRIVATE_NODE="$RUNTIME/node/bin/node"; fi

die() { echo "Node hazırlanamadı: $1" >&2; exit 2; }

system_node_ok() {
  command -v node >/dev/null 2>&1 || return 1
  major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null)" || return 1
  [ "${major:-0}" -ge 20 ]
}

download_node() {
  case "$(uname -m)" in
    arm64|aarch64) ARCH=arm64 ;;
    x86_64|amd64|x64) ARCH=x64 ;;
    *) die "desteklenmeyen işlemci: $(uname -m)" ;;
  esac
  if [ "$OS" = win ]; then EXT=zip; PLAT=win; else EXT=tar.gz; PLAT=$OS; fi
  NAME="node-$NODE_VERSION-$PLAT-$ARCH"
  BASE="https://nodejs.org/dist/$NODE_VERSION"
  TMP="$RUNTIME/tmp"
  rm -rf "$TMP" "$RUNTIME/node"; mkdir -p "$TMP"
  echo "Node $NODE_VERSION indiriliyor (bir kereye mahsus, ~40 MB)…" >&2
  curl -fsSL "$BASE/$NAME.$EXT" -o "$TMP/$NAME.$EXT" || die "indirme başarısız (internet bağlantısını kontrol edin)"
  curl -fsSL "$BASE/SHASUMS256.txt" -o "$TMP/SHASUMS256.txt" || die "sağlama dosyası indirilemedi"
  expected="$(grep " $NAME.$EXT\$" "$TMP/SHASUMS256.txt" | cut -d' ' -f1)"
  if command -v shasum >/dev/null 2>&1; then actual="$(shasum -a 256 "$TMP/$NAME.$EXT" | cut -d' ' -f1)"
  else actual="$(sha256sum "$TMP/$NAME.$EXT" | cut -d' ' -f1)"; fi
  [ -n "$expected" ] && [ "$expected" = "$actual" ] || die "sağlama toplamı uyuşmuyor"
  if [ "$EXT" = zip ]; then
    powershell -NoProfile -Command "Expand-Archive -Force -Path '$(cygpath -w "$TMP/$NAME.zip")' -DestinationPath '$(cygpath -w "$TMP")'" >&2 || die "zip açılamadı"
  else
    tar -xzf "$TMP/$NAME.$EXT" -C "$TMP" || die "arşiv açılamadı"
  fi
  mv "$TMP/$NAME" "$RUNTIME/node" || die "taşıma başarısız"
  rm -rf "$TMP"
}

if system_node_ok; then
  NODE="$(command -v node)"
else
  [ -x "$PRIVATE_NODE" ] || download_node
  NODE="$PRIVATE_NODE"
  PATH="$(dirname "$NODE"):$PATH"; export PATH
fi

if [ "$1" = "--ensure" ]; then echo "$NODE"; exit 0; fi
exec "$NODE" "$@"
