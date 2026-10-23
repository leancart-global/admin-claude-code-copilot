# Ortamlar, giriş ve oturum

"doğrulanmadı" = kesinleştirilemedi; ilk canlı kullanımda kontrol edip `domain/CHANGELOG.md`'ye yaz.

> Değişmez kural: Claude şifre / 2FA kodu / System Admin anahtarı **görmez, yazmaz**. Login, 2FA ve operatör
> anahtar ekranlarını kullanıcı tarayıcı penceresinde kendisi doldurur. Cookie ve istek başlıkları okunmaz.

---

## 1. Admin URL'leri

Her mağazanın (tenant) **kendi admin adresi** vardır; mağaza bu adresten anlaşılır.

| Ortam | Admin URL deseni | Not |
|---|---|---|
| prod | `https://admin.<sub>.leancart.global` | `<sub>` = mağazanın alt alan adı |
| dev | `https://admin.<sub>.dev.leancart.global` | doğrulanmadı (canlı) |
| staging | Kullanıcıdan al | Adres deseni ve kullanımda olup olmadığı: doğrulanmadı |
| local | Kullanıcının verdiği yerel adres | Tek mağazalı geliştirme kurulumu |
| Özel alan adı | Merchant'ın kendi domaini (Ayarlar → Alan Adları) | Admin'in özel domainde açılıp açılmadığı: doğrulanmadı |

`config/local.json` (`/onboard` yazar) seçili ortamı ve **tam admin URL'sini** tutar. URL'yi kullanıcıya
teyit ettir; tahmin etme.

## 2. Arayüz dili — URL'de dil öneki YOK

- Tarayıcı adresinde `/tr/...` veya `/en/...` **görünmez**; adresler `/products`, `/login` gibidir.
- Desteklenen diller: İngilizce (varsayılan) ve Türkçe.
- `/tr/login` gibi önekli bir adres açılırsa öneksiz adrese yönlendirip dili seçmesi beklenir — doğrulanmadı.
- **Tüm URL'ler `{ADMIN_URL}/<path>` biçimindedir** (ör. `{ADMIN_URL}/products/new`); dil öneki ekleme.
- **Dil değiştirici (UI) — Claude dili yalnızca buradan değiştirir:**
  - Yer: her admin sayfasında **header sağ tarafı**, bildirim zili ile kullanıcı menüsü arasında. Login ve diğer
    giriş sayfalarında **yok** (orada dil, son seçilen dil ya da varsayılan İngilizce'dir).
  - Tetikleyici: çerçeveli buton; dil ikonu + bayrak + dil adı: `🇹🇷 Türkçe` veya `🇺🇸 English`. Açılır menü.
  - Adımlar: `getByRole('button', { name: /Türkçe|English/ }).click()` → menüde `getByRole('menuitem', { name: /Türkçe/ })`
    (veya `English`) tıkla (seçili olanda `✓`). Sayfa yeniden çizilir; URL değişmez.
    Doğrulama: sidebar etiketleri (`Ürünler` ↔ `Products`) ve buton metni değişti mi.
  - Etki: yalnızca admin arayüz dili (kullanıcı tercihi, bu tarayıcıda 1 yıl kalıcı). Veri değiştirmez; onay
    gerektirmez ama kullanıcıya söyle. Form doluyken değiştirme (yeniden çizim alanları sıfırlayabilir — doğrulanmadı).
  - Not: Bu, **içerik dili/store view** seçicisinden farklıdır (ürün/kategori/sayfa çevirileri için form içi seçici, bkz. `ui-conventions.md` §11).
- **Otomasyon için:** Hangi dilde çalıştığını sayfadan oku (ör. sidebar'da "Ürünler" vs "Products",
  dil butonundaki `Türkçe`/`English`). Locator'larda hem tr hem en etiketi dene (`/Ürünler|Products/`).
  `config/local.json`'daki tercih edilen dil ile UI farklıysa yukarıdaki adımlarla değiştir.

## 3. Multi-tenant: mağaza nasıl belirlenir?

**Mağaza (tenant) seçici YOK.** Admin'de mağaza değiştirme menüsü bulunmaz.

- Mağaza, girişin yapıldığı **admin adresinin alt alan adından** belirlenir (`admin.acme.leancart.global` → `acme`).
  Giriş yapıldıktan sonra oturum o mağazaya bağlıdır.
- Başka mağazaya geçmek = o mağazanın admin adresinde yeniden giriş.
- Adres bir mağazaya çözülemezse login formu kırmızı uyarı kutusunda şunu gösterir (kod `TENANT_REQUIRED`):
  *"We couldn't identify your store from this web address. Please check the URL or contact support."*
  Bu bir oturum sorunu değil **yanlış adres** sorunudur: dur, kullanıcıya doğru admin adresini sor.

**Operatör (platform) rolü:** `/system`, `/tenants`, `/system/scheduled-jobs` platform-operatör ekranlarıdır;
ayrıca **System Admin API anahtarı** isterler. Anahtar sayfa yenilenince yeniden istenir.
Bu bir sırdır: **Claude yazmaz**, kullanıcı girer. Sidebar'da bu ekranlara link yoktur. Ayrıntı: `permissions.md` §5.

## 4. Login sayfası (`/login`)

| Alan | DOM | Label tr / en | Not |
|---|---|---|---|
| E-posta | `input#email[type=email][required]` | `E-posta` / `Email` | placeholder `admin@leancart.com` |
| Şifre | `input#password`, yanında göster/gizle (göz) butonu | `Şifre` / `Password` | **Claude doldurmaz** |
| Beni hatırla | `Checkbox#rememberMe` → `button[role=checkbox]` | `30 gün boyunca beni hatırla` / `Remember me for 30 days` | Girişi 30 gün açık tutar |
| Giriş | `button[type=submit]` | `Giriş Yap` / `Sign in`; yüklenirken `Giriş yapılıyor...` / `Signing in...` | |
| Şifremi unuttum | link `/forgot-password` | `Şifrenizi mi unuttunuz?` / `Forgot password?` | |

- Başlık: `Hesabınıza giriş yapın` / `Sign in to your account`; marka `Lean Cart Yönetim` / `Lean Cart Admin`.
- Oturum düşmüşse `?session=expired` ile gelinir ve bilgi kutusu çıkar:
  `Oturumunuz sona erdi. Lütfen tekrar giriş yapın.` / `Your session has expired. Please sign in again.`
- Hata: kırmızı uyarı kutusu, metin sunucudan gelen mesaj veya
  `Giriş yapılamadı. Lütfen tekrar deneyin.` / `Unable to sign in. Please try again.`
- Başarılıysa `returnUrl` query param'ına, yoksa **`/products`**'a yönlenir. Oturum düşmesinden sonraki yeniden
  girişte kullanıcı genellikle `/products`'ta olur — Claude kaldığı ekrana kendisi geri dönmeli.
- Admin paneline yalnız yönetici rolündeki kullanıcılar giriş yapabilir.

### Kullanıcıyla login protokolü (Claude)
1. `browser_navigate` → `{ADMIN_URL}/login` (veya zaten açık sayfa).
2. Kullanıcıya: "Açılan pencerede giriş yapın (2FA varsa onu da); bitince 'tamam' yazın." **Alanlara yazma.**
3. "tamam" sonrası §6'daki sinyallerle girişin olduğunu doğrula.

## 5. 2FA

- Ekranlar: `/setup-2fa` (QR + kod ile kurulum) ve `/verify-2fa` (girişin ikinci adımı, kod alanı `input#code`;
  başarıda `/`'e gider).
- 2FA kodunu her zaman kullanıcı girer; Claude 2FA ekranını kendisi açmaz/doldurmaz. Login sırasında ek doğrulama
  istenirse kullanıcıya pencerede tamamlamasını söyle ve "tamam" bekle.

## 6. Oturum: ömür ve düşme

| Konu | Değer |
|---|---|
| **Boşta kalma (idle) çıkışı** | varsayılan **1 saat** işlem yapılmazsa |
| Uyarı | idle bitiminden **5 dk** önce uyarı penceresi |
| Aktivite sayılan | fare tıklaması, tuş basma, kaydırma, dokunma, sekmeye geri dönme |
| Aktif kullanımda | Oturum arka planda kendiliğinden uzar; kullanıcı fark etmez |
| En uzun giriş süresi | "Beni hatırla" işaretliyse 30 gün; değilse prod'da 7 gün (dev'de 30 gün) sonra yeniden giriş gerekir |

Tarayıcı otomasyonunun tıklama/yazma işlemlerinin idle sayacını sıfırlaması beklenir (doğrulanmadı).
Uzun süre (≥55 dk) yalnızca snapshot alarak bekleme; uyarı penceresi çıkabilir.

### Oturum düştüğünde ne olur?
- İdle süresi biterse panel çıkış yapar ve **`/login?session=expired`**'e yönlendirir; kırmızı toast:
  başlık `Session Expired`, açıklama `Your session has expired. Please sign in again.`
- Herhangi bir işlem oturumsuz kalırsa sayfa tamamen `/login?session=expired`'e gider.
- Oturum yenileme sorunu toast'u: `Session Error` / `Unable to refresh your session. You may be logged out soon.`
- Uyarı penceresi (alertdialog): başlık `Oturum Süresi Dolmak Üzere` / `Session About to Expire`, butonlar
  `Çıkış Yap`/`Logout` ve `Oturumu Sürdür`/`Stay Logged In`. **Claude "Oturumu Sürdür"e basabilir** — veri
  değiştirmez; yine de kullanıcıya haber ver. "Çıkış Yap"a basma.

### "Oturum düştü, kullanıcıdan yeniden giriş iste" sinyalleri
Herhangi biri görülürse işi durdur, yapılan/yarım kalan adımı not et, kullanıcıdan tarayıcıda giriş yapmasını iste:
1. URL path'i `/login` (özellikle `?session=expired`) — `browser_snapshot` URL'sinden okunur.
2. Sayfada `Hesabınıza giriş yapın` / `Sign in to your account` başlığı veya `input#password`.
3. Toast: `Session Expired`, `Session Error`.
4. `browser_network_requests` içinde `/api/...` istekleri **401** (`UNAUTHORIZED`, `NOT_AUTHENTICATED`,
   `SESSION_EXPIRED`) — okuma serbest, başlıklar hariç.
5. Login'de `TENANT_REQUIRED` mesajı → oturum değil **yanlış URL** sorunu; kullanıcıya doğru admin adresini sor.
6. `/unauthorized` sayfası (`Erişim Reddedildi` / `Access Denied`) → oturum var ama rol yetersiz;
   yeniden giriş çözmez, kullanıcıya bildir.
7. Sayfa ortasında yalnızca dönen yükleme simgesi uzun süre kalıyorsa giriş kontrolü takılmıştır; sayfayı
   yenilemeyi öner.

Not: Bir işlem 403 dönerse (yetki yok) bu oturum düşmesi değildir — `permissions.md`.

## 7. Giriş yapıldığını / kim olduğunu / mağazayı / rolü sayfadan anlamak

Giriş yoksa admin sayfaları `/login`'e, rol yetersizse `/unauthorized`'a yönlenir.

### DOM işaretleri (tercih edilen yol)
| Soru | Nereden | Locator |
|---|---|---|
| Giriş var mı? | Sidebar + header görünüyor; URL `/login` değil | `header.admin-header`, `nav` içinde `Panel`/`Dashboard` linki; `.admin-sidebar` |
| Kim? | Header sağ üst kullanıcı butonu: ad + e-posta | `page.locator('header.admin-header').getByText(/@/)` ; buton tıklanınca açılan menüde yine ad+e-posta ve `Profilim`/`My Profile`, `Mağaza Ayarları`/`Store Settings`, `Çıkış Yap`/`Sign Out` |
| Rol / yetki? | Sidebar'da görünen menüler yetkiye göre süzülür. Ör. `Kullanıcılar → Roller` görünüyorsa rol admin/super_admin/security_admin; `Ayarlar` yoksa `settings:read` yok | bkz. `navigation.md` |
| Mağaza? | Header'da mağaza adı **gösterilmez**. Kaynaklar: (a) tarayıcı URL host'u `admin.<sub>.…` → `<sub>`; (b) `/settings/general` ekranındaki mağaza adı/iletişim bilgileri; (c) aşağıdaki kullanıcı bilgisi yanıtındaki `tenantId` | |
| Dil? | Header dil butonu `🇹🇷 Türkçe` / `🇺🇸 English` | `getByRole('button', { name: /Türkçe|English/ })` |
| Plan? | Kullanıcı bilgisi yanıtında `plan`, `features`; `/settings/general` → `Plan ve Abonelik` | |

Dikkat: header'da ad yerine `User` yazıyorsa kullanıcı bilgisi henüz yüklenmemiştir; bekle.

### Kullanıcı bilgisi (`GET /api/auth/me`, bilgi amaçlı)
Panel her sayfa yüklenişinde bu isteği yapar. Yanıt: kullanıcı bilgileri (ad, e-posta, dil, saat dilimi, para birimi),
`tenantId`, `roles[]`, `permissions[]`, `plan`, `features`.

Okuma yolları (öncelik sırası):
1. `browser_network_requests` ile sayfa yüklenirken yapılan `GET /api/auth/me` isteğini gör (status 200 = giriş var,
   401 = yok). Gövde okunabiliyorsa `tenantId`, `roles`, `permissions` buradan.
2. Gerekirse yeni sekmede `{ADMIN_URL}/api/auth/me` aç (salt-okunur, JSON görünür). Bu doğrudan API okumasıdır;
   proje kuralı 3 "değişiklik UI'dan" der — okuma için kabul edilebilir ama önce DOM yolunu dene.
3. `browser_evaluate` ile `fetch` **kullanma** (guard hook'u ve kural 2/3).

## 8. Global açılır pencereler (otomasyonu bölebilir)

| Pencere | Ne zaman | Metin tr / en | Ne yapılır |
|---|---|---|---|
| Onboarding sihirbazı (Dialog) | Kurulumu tamamlanmamış mağazada her admin sayfasında açılabilir | `LeanCart'a Hoşgeldin!` / `Welcome to LeanCart!`; butonlar `Kurulumu Başlat`/`Start Setup`, `Atla - Kendim keşfedeceğim`/`Skip - I'll explore on my own` | Kullanıcıya sor. "Atla" sihirbazı kalıcı olarak kapatır |
| Yeni sürüm bandı | Panel güncellendikten sonra eski sekmede | `Yeni bir sürüm mevcut` / `A new version is available`, `Şimdi yenile`/`Refresh now` | Form doluysa yenileme veri kaybettirir; kullanıcıya sor |
| Oturum uyarısı | §6 | | |
| Kurulum kontrol listesi | Dashboard'da (`/`) kart | `Mağaza Kurulumunu Tamamlayın` | Yok say |

## 9. Diğer giriş ekranları

| Route | Amaç | Not |
|---|---|---|
| `/forgot-password` | Şifre sıfırlama e-postası | Claude kullanmaz |
| `/reset-password` | E-postadaki link ile yeni şifre | Claude kullanmaz |
| `/verify-email` | E-posta doğrulama linki | |
| `/unauthorized` | Rol yetersiz | `Erişim Reddedildi` / `Access Denied`; `Geri Dön`/`Go Back`, `Panele Git`/`Go to Dashboard` |
| Çıkış | Header kullanıcı menüsü → `Çıkış Yap`/`Sign Out` → `/login` | Claude çıkış yapmaz (kullanıcı istemedikçe) |
