#!/bin/sh
# Windows only: .mcp.json starts the browser server with a bare `sh`, which Windows usually does not have on PATH
# (it only exists inside Git Bash). Register a per-machine override that uses the absolute path of Git's sh.exe.
# Local scope: it is stored outside the repo and overrides the project entry of the same name. No-op elsewhere.
case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) ;; *) echo "Windows değil, gerek yok."; exit 0 ;; esac
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SH_EXE="$(cygpath -m "$(command -v sh)")"
command -v claude >/dev/null 2>&1 || { echo "claude komutu bulunamadı; kayıt yapılamadı." >&2; exit 1; }
cd "$ROOT" || exit 1
claude mcp remove admin-browser --scope local >/dev/null 2>&1
claude mcp add admin-browser --scope local -- "$SH_EXE" "$(cygpath -m "$ROOT/scripts/run.sh")" "$(cygpath -m "$ROOT/scripts/browser.mjs")" mcp \
  && echo "admin-browser Windows için kaydedildi: $SH_EXE"
