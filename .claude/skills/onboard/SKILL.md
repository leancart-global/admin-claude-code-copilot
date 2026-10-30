---
name: onboard
description: Admin operatörü kurulumu ve oturum açma — Chrome for Testing'i hazırlar, admin panelini açar, kullanıcının kendisinin giriş yapmasını bekler, oturum/tenant/yetkiyi doğrular ve tenant bağlamını (store view, para birimi, vergi sınıfı, mevcut katalog yapısı) salt okunur çıkarır. İlk kullanımda, ortam değiştirirken veya oturum düştüğünde kullan.
---

# Onboarding

Amaç: kullanıcı ilk komutunu verdiğinde Claude'un hangi ortamda, hangi tenant'ta, hangi yetkilerle çalıştığını
bilmesi ve formları doldururken ihtiyaç duyacağı tenant bağlamının hazır olması. **Bu akışta hiçbir kayıt yapılmaz.**

## 1. Tarayıcı hazır mı?

- `node scripts/browser.mjs path` → hata verirse `node scripts/browser.mjs setup` (Chrome for Testing'i `.browsers/`'a kurar; macOS, Linux, Windows).
- `mcp__admin-browser__*` araçları yoksa: kullanıcıya Claude Code'u bu klasörde yeniden başlatmasını ve
  `.mcp.json`'daki `admin-browser` sunucusunu onaylamasını söyle (`/mcp` ile kontrol edilir). Dur.

## 2. Ortam ve dil

`config/local.json` varsa oku ve kullanıcıya "şu ortamla devam edelim mi?" diye sor. Yoksa AskUserQuestion ile sor:

- **Tenant ID (mağaza subdomain'i).** Kullanıcıdan yalnız tenant ID'yi iste (ör. `gym-tayt`); prod/dev seçeneği
  ya da örnek tenant önerme. Adresler tek desenden üretilir — production tenant'lar dahil hepsi `.dev.` içerir:
  - Admin: `https://admin.<tenant>.dev.leancart.global` (ör. `https://admin.gym-tayt.dev.leancart.global`)
  - Vitrin: `https://<tenant>.dev.leancart.global` (ör. `https://gym-tayt.dev.leancart.global`)
  Adresteki `.dev.` ortamı **belirtmez**; ortam varsayılan olarak `prod`'dur (canlı tenant, kural 7 geçerli).
  Kullanıcı tenant'ın test/dev olduğunu açıkça söylerse `dev` yaz. Local kurulumda adresi kullanıcıdan al.
  Tenant, adresin subdomain'inden çözülür; tenant seçici yoktur. Login `TENANT_REQUIRED` ("We couldn't identify
  your store…") verirse bu oturum değil, **yanlış tenant ID / adres** sorunudur. Başka tenant'a geçmek = o tenant'ın
  adresinde yeniden giriş. Ayrıntı: `domain/project/environments-and-auth.md`.
- Arayüz dili: `tr` (önerilen) / `en`. Admin URL'lerinde locale **yoktur**; varsayılan dil `en`.
  Dili girişten sonra UI'daki dil
  değiştiriciyle ayarla (`domain/project/environments-and-auth.md`). Haritalar label'ları tr ve en verir.

## 3. Giriş — kullanıcı yapar

1. `browser_navigate` → `{adminUrl}/login`.
2. Kullanıcıya: "Açılan Chrome for Testing penceresinde e-posta ve şifrenle giriş yap (2FA varsa kodu da gir).
   Bitince bana 'girdim' yaz." — Şifre/kod isteme, alanlara dokunma.
3. Kullanıcı dönünce `browser_snapshot`: login/verify-2fa sayfasında mıyız, dashboard'da mıyız?
   Giriş sinyalleri ve tenant/rol tespiti: `domain/project/environments-and-auth.md`.
   Kalıcı profil (`.browser-profile/`) sayesinde sonraki oturumlarda genelde tekrar giriş gerekmez.
4. Engeller: onboarding sihirbazı veya "yeni sürüm" banner'ı açılırsa kapat (kayıt yapmayan "Atla/Kapat").
   2FA ekranında takılırsa dur ve kullanıcıya bildir.
   Operatör ekranları (`/system`, `/tenants`) System Admin anahtarı ister; anahtarı kullanıcı kendisi girer.
5. Oturum ömrü: 1 saat hareketsizlikte çıkış (5 dk önce uyarı), access 8 saat. Girişten sonra admin `/products`'a
   yönlendirir; kaldığın ekrana geri git.

## 4. Kimlik, tenant, yetki

- Ekrandan (header, profil menüsü) kullanıcı adı, tenant/mağaza adı, rol.
- Sidebar menüsünü snapshot'la; görünen alanları `domain/project/navigation.md` ile karşılaştır → erişilemeyen alanlar.
- Operatör (çok tenant'lı) hesapsa hangi tenant üzerinde çalışılacağını kullanıcıya sor.

## 5. Tenant bağlamı (salt okunur)

Sırayla aç ve sadece oku (her biri için ilgili ekran haritasına bak):

| Bilgi | Ekran | Neden |
|---|---|---|
| Store view'lar, diller | `settings/store-views` | Çeviri alanları, kapsam |
| Para birimleri | `settings/currencies` | Fiyat alanları |
| Vergi sınıfları | `settings/tax-classes` | Ürün fiyatlama zorunlu alanı |
| Attribute set'ler (ad + sayı) | `attributes/sets` | Ürün tipi seçimi |
| Kategori ağacı (üst 2 seviye) | `categories` | Ürün atama |
| Markalar (sayı, ilk sayfa) | `brands` | Ürün atama |
| Depolar | `inventory/warehouses` | Stok alanları |
| Marka adı, slogan, Marka Tonu | `branding` | Üretilecek metinlerin sesi (`domain/project/brand-voice.md`) |

Ekran açılmıyorsa veya yetki yoksa not et, devam et.

**Katalog hazırlık kontrolü:** ürün formu en az 1 aktif store view, 1 kategori, 1 attribute set ve 1 aktif para birimi
olmadan açılmaz ("Complete Setup" kartı); stoklu ürün için depo gerekir. Eksik olanları özetde "ürün girmeden önce
kurulmalı" diye listele (`domain/screens/products/product-create.md` § Ön koşullar).

## 6. Kaydet ve özetle

`config/local.json`'a yaz (gizli bilgi YOK):

```json
{
  "environment": "prod|dev|local|custom",
  "tenantId": "…",
  "adminUrl": "https://admin.<tenant>.dev.leancart.global",
  "storefrontUrl": "https://<tenant>.dev.leancart.global",
  "locale": "tr",
  "user": { "displayName": "…", "role": "…" },
  "tenant": { "name": "…" },
  "inaccessibleAreas": ["…"],
  "tenantContext": {
    "capturedAt": "YYYY-MM-DD",
    "storeViews": [], "currencies": [], "defaultCurrency": "", "taxClasses": [],
    "attributeSets": [], "topCategories": [], "brandCount": 0, "warehouses": [],
    "brandVoice": null
  }
}
```

Kullanıcıya kısa özet ver (ortam, tenant, rol, erişilemeyen alanlar, dikkat çeken eksikler — ör. vergi sınıfı yok)
ve örnek komutlar öner: "şu ürünü gir: …", "cep telefonu için attribute set kur", "ana sayfaya kampanya banner'ı ekle".
