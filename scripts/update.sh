#!/bin/sh
# Self-update: runs at every session start (SessionStart hook) and from /onboard.
# Fast-forward only, so it never creates merge conflicts; any problem is reported but never blocks the session.
cd "$(dirname "$0")/.." || exit 0
command -v git >/dev/null 2>&1 || { echo "Güncelleme atlandı: git bulunamadı."; exit 0; }
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "Güncelleme atlandı: git deposu değil."; exit 0; }
before="$(git rev-parse HEAD 2>/dev/null)"
if out="$(git pull --ff-only --quiet 2>&1)"; then
  after="$(git rev-parse HEAD 2>/dev/null)"
  if [ "$before" != "$after" ]; then
    echo "Lean Cart operatörü güncellendi ($(git log --oneline "$before..$after" | wc -l | tr -d ' ') yeni değişiklik). Kurallar/hook'lar değiştiyse etkisi bir sonraki pencerede başlar."
  else
    echo "Lean Cart operatörü güncel."
  fi
else
  echo "Otomatik güncelleme yapılamadı (internet yok ya da yerel değişiklik var): $out"
fi
exit 0
