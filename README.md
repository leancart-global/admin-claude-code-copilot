# Lean Cart Admin — Claude ile yönetim

Lean Cart admin panelini doğal dille yönetmek için Claude Code projesi. Ne istediğini tek cümleyle söylersin, Claude
gerçek bir tarayıcıda (Chrome for Testing) ekranları açar ve formları doldurur. **Her kayıttan önce özet gösterip
onayını ister.**

```
> şu ürünü gir: Samsung Galaxy S25 128GB siyah, 42.999 TL, stok 15, Telefonlar kategorisi
> cep telefonu için attribute ve attribute set ayarla
> ana sayfaya %20 indirim banner'ı ekle, Kampanyalar kategorisine gitsin
```

## Kurulum (bir kez)

1. Node 20+ ve [Claude Code](https://claude.com/claude-code) kurulu olmalı.
2. Bu klasörde: `bash scripts/setup-browser.sh` (Chrome for Testing'i `.browsers/`'a indirir).
3. `claude` ile başlat, `admin-browser` MCP sunucusunu onayla.
4. `/onboard` yaz. Mağazanın admin adresini (`https://admin.<mağaza>.leancart.global`) soracak. Açılan pencerede
   **kendin giriş yap**. Claude şifreni hiçbir zaman görmez, istemez, yazmaz. Oturum `.browser-profile/`'da
   saklanır, bir sonraki açılışta tekrar giriş gerekmez.

## Güvenlik

- Şifre, 2FA kodu ve API anahtarı alanlarına Claude yazamaz. Cookie, token ve istek başlıklarını okuyamaz. Bunu
  `.claude/hooks/browser-guard.mjs` zorlar.
- Kaydet, Yayınla, Sil gibi tıklamalar ve Enter tuşu Claude Code'un onay penceresine düşer.
- Kaydetmeden canlıya yazan ekranlarda (layout ayarları, ana sayfa, navigasyon) Claude, alanlara dokunmadan önce onay ister.
- `.browser-profile/` oturum çerezlerini içerir. Paylaşma, commit'leme (gitignore'da).

## Yapı

| Yol | Ne |
|---|---|
| `CLAUDE.md` | Claude'un kuralları ve çalışma döngüsü |
| `domain/` | Admin haritası: ekranlar, alanlar, iş kuralları ve kayıt ilişkileri (yalnız fonksiyonel) |
| `playbooks/` | Sık yapılan işlerin adım adım tarifleri |
| `.claude/skills/onboard/` | `/onboard` akışı |
| `scripts/` | Tarayıcı kurulumu ve MCP başlatıcı |

Kapsam ve haritanın güncellenmesi: `domain/README.md`.
