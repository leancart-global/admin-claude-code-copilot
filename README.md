# Lean Cart Admin Copilot for Claude Code

**[English](#english) · [Türkçe](#türkçe)**

## English

A Claude Code project for running the Lean Cart admin panel in plain language. You describe the task in one sentence;
Claude opens the screens in a real browser (Chrome for Testing) and fills in the forms. **Before every save it shows
a change summary and waits for your approval.**

```
> add this product: Samsung Galaxy S25 128GB black, 42,999 TRY, stock 15, Phones category
> set up attributes and an attribute set for mobile phones
> create a 10% coupon valid until the end of November
```

### Setup (once)

1. Install Node 20+ and [Claude Code](https://claude.com/claude-code).
2. In this folder run `node scripts/browser.mjs setup`. It downloads Chrome for Testing into `.browsers/` and works the
   same on macOS, Linux and Windows (PowerShell, cmd or Git Bash).
3. Start `claude` and approve the `admin-browser` MCP server.
4. Type `/onboard`. It asks for your tenant ID (e.g. `gym-tayt`) and opens the admin at
   `https://admin.<tenant>.dev.leancart.global` (the storefront is `https://<tenant>.dev.leancart.global`; production
   tenants use this same `.dev.` address). **Sign in
   yourself** in the browser window that opens. Claude never sees, asks for or types your password. The session is
   kept in `.browser-profile/`, so you don't need to sign in again next time.

### Security

- Claude cannot type into password, 2FA or API key fields, and cannot read cookies, tokens or request headers. This is
  enforced by `.claude/hooks/browser-guard.mjs`.
- Clicks such as Save, Publish, Delete and the Enter key go through Claude Code's approval prompt.
- On screens that write to the live store without a save step (layout settings, homepage, navigation), Claude asks for
  approval before touching any field.
- `.browser-profile/` holds your session cookies. Don't share or commit it (it is gitignored).

### Layout

| Path | Contents |
|---|---|
| `CLAUDE.md` | Claude's rules and working loop (Turkish) |
| `domain/` | Admin map: screens, fields, business rules and record relationships (functional only) |
| `playbooks/` | Step-by-step recipes for common tasks |
| `.claude/skills/onboard/` | The `/onboard` flow |
| `scripts/browser.mjs` | Browser setup and MCP launcher |

The maps and playbooks are written in Turkish; Claude reads them and works in either language. Scope and how the map
is kept up to date: `domain/README.md`.

---

## Türkçe

Lean Cart admin panelini doğal dille yönetmek için Claude Code projesi. Ne istediğini tek cümleyle söylersin, Claude
gerçek bir tarayıcıda (Chrome for Testing) ekranları açar ve formları doldurur. **Her kayıttan önce özet gösterip
onayını ister.**

```
> şu ürünü gir: Samsung Galaxy S25 128GB siyah, 42.999 TL, stok 15, Telefonlar kategorisi
> cep telefonu için attribute ve attribute set ayarla
> ana sayfaya %20 indirim banner'ı ekle, Kampanyalar kategorisine gitsin
```

### Kurulum (bir kez)

1. Node 20+ ve [Claude Code](https://claude.com/claude-code) kurulu olmalı.
2. Bu klasörde: `node scripts/browser.mjs setup`. Chrome for Testing'i `.browsers/`'a indirir; macOS, Linux ve Windows'ta
   (PowerShell, cmd ya da Git Bash) aynı komutla çalışır.
3. `claude` ile başlat, `admin-browser` MCP sunucusunu onayla.
4. `/onboard` yaz. Tenant ID'ni (ör. `gym-tayt`) soracak ve admini
   `https://admin.<tenant>.dev.leancart.global` adresinde açacak (vitrin: `https://<tenant>.dev.leancart.global`;
   production tenant'lar da bu `.dev.` adresini kullanır). Açılan pencerede
   **kendin giriş yap**. Claude şifreni hiçbir zaman görmez, istemez, yazmaz. Oturum `.browser-profile/`'da
   saklanır, bir sonraki açılışta tekrar giriş gerekmez.

### Güvenlik

- Şifre, 2FA kodu ve API anahtarı alanlarına Claude yazamaz. Cookie, token ve istek başlıklarını okuyamaz. Bunu
  `.claude/hooks/browser-guard.mjs` zorlar.
- Kaydet, Yayınla, Sil gibi tıklamalar ve Enter tuşu Claude Code'un onay penceresine düşer.
- Kaydetmeden canlıya yazan ekranlarda (layout ayarları, ana sayfa, navigasyon) Claude, alanlara dokunmadan önce onay ister.
- `.browser-profile/` oturum çerezlerini içerir. Paylaşma, commit'leme (gitignore'da).

### Yapı

| Yol | Ne |
|---|---|
| `CLAUDE.md` | Claude'un kuralları ve çalışma döngüsü |
| `domain/` | Admin haritası: ekranlar, alanlar, iş kuralları ve kayıt ilişkileri (yalnız fonksiyonel) |
| `playbooks/` | Sık yapılan işlerin adım adım tarifleri |
| `.claude/skills/onboard/` | `/onboard` akışı |
| `scripts/browser.mjs` | Tarayıcı kurulumu ve MCP başlatıcı |

Kapsam ve haritanın güncellenmesi: `domain/README.md`.
