# Ödeme Sağlayıcıları (Payment Providers) — liste + yapılandırma

> **Operatör sınırı**
> - Claude sağlayıcı seçimi, para birimi, mod (Test/Canlı), taksit, iade politikası gibi gizli olmayan ayarları kullanıcı onayıyla doldurabilir; liste ekranını okuyabilir.
> - Claude **kimlik bilgisi alanlarına (API anahtarı, gizli anahtar, webhook şifresi, PayTR mağaza parolası/gizli anahtarı) hiç yazmaz ve değerlerini okumaz**; bu alanları kullanıcı tarayıcıda kendisi doldurur. Bu yüzden "Sağlayıcı Ekle → Kur" akışında kimlik alanlarını kullanıcı doldurur, Claude yalnız özet + onaydan sonra butona basar (ya da kullanıcı basar).
> - **Canlı moda geçiş, yeni sağlayıcı kurulumu, Etkinleştir/Devre Dışı Bırak, Varsayılan Yap ve Kaldır** gerçek ödeme akışını değiştirir: her biri ayrı özet + açık onay; prod ortamda ekstra uyarı.
> - "Bağlantı Testi" sağlayıcıya gerçek bir istek gönderir (dış etkili); kısa onay alınır.

## 1. Liste — `/settings/payments`
- URL: {ADMIN_URL}/settings/payments
- Menü yolu: "Ayarlar / Settings" → "Ödemeler / Payments". Ayarlar hub'ında da kart.
- Sayfa başlığı (kart): "Ödeme Sağlayıcıları / Payment Providers" + "{n} yapılandırılmış" rozeti; alt metin "Ödeme bilgileriniz güvenli bir şekilde şifrelenerek saklanır."
- Amaç: Mağazanın kullanabileceği ödeme sağlayıcılarını (Stripe, Iyzico, PayPal, PayTR) kurmak, aktif/pasif yapmak, varsayılanı seçmek, bağlantıyı test etmek ve kaldırmak. Aktif sağlayıcılar vitrin ödeme adımında ve admin sipariş oluşturmada ödeme yöntemi olarak kullanılır.
- Yetki: menü `settings:read`; sağlayıcı işlemleri: okuma `payment:config:read`, kur/güncelle/aktif-pasif/varsayılan `payment:config:write`, kaldır `payment:config:delete`, bağlantı testi `payment:config:test`.
- Hassas ekran: **evet**. Anında kaydeden kontroller: satır menüsündeki Etkinleştir/Devre Dışı Bırak, Varsayılan Yap (onay dialogu yok).

### Yerleşim
- Sağ üst: "Sağlayıcı Ekle / Add Provider" (kurulmamış sağlayıcı kalmadıysa pasif).
- Filtre sekmeleri (buton): "Tümü / All", "Yapılandırılmış / Configured", "Kurulmamış / Not Set Up" (sayı rozetli).
- Tablo sütunları: Sağlayıcı (logo, ad, açıklama) · Durum ("Aktif / Active", "Pasif / Inactive", "Kurulmadı / Not set up") · Mod ("Canlı / Live", "Test / Testing", kurulmamışsa —) · Para Birimi · Varsayılan (yıldız) · "⋯" menü (aria-label "İşlemler / Actions").
- Satır menüsü: "Yapılandır / Configure" (kuruluysa yapılandırma sayfasına, değilse Ekle dialoguna), kuruluysa "Etkinleştir / Enable" veya "Devre Dışı Bırak / Disable" (altında açıklama: "Yeni ödemeleri durdurur; mevcut ödemeler tamamlanır. Anahtar sızdıysa yenileyin veya sağlayıcıyı kaldırın."), varsayılan değilse "Varsayılan Yap / Set as Default", "Bağlantı Testi / Test Connection", varsayılan değilse "Kaldır / Remove".

### Sağlayıcı Ekle dialogu ("Ödeme Sağlayıcısı Ekle / Add Payment Provider")
Adım 1 — sağlayıcı kartları (yalnız kurulmamışlar; desteklenen para birimleri listelenir). Adım 2 — seçilen sağlayıcının zorunlu alanları + para birimi:

| Sağlayıcı | Adım 2 alanları (label tr / en) | Desteklenen para birimi |
|---|---|---|
| Stripe | API Anahtarı / API Key 🔒, Gizli Anahtar / Secret Key 🔒, Para Birimi | tümü |
| Iyzico | API Anahtarı 🔒, Gizli Anahtar 🔒, Geri Dönüş URL / Callback URL, Temel URL / Base URL, Para Birimi | TRY, USD, EUR, GBP |
| PayPal | API Anahtarı 🔒, Gizli Anahtar 🔒, Para Birimi | tümü |
| PayTR | Mağaza No / Merchant ID, API Anahtarı 🔒, Gizli Anahtar 🔒, Para Birimi | TRY, USD, EUR, GBP, RUB |

🔒 = gizli alan (kullanıcı doldurur). Locator: `#add-<alan>` (ör. `#add-merchantId`); Para Birimi aramalı combobox (placeholder "örneğin USD, TRY, EUR", arama "Para birimi ara...").
- "Kur / Set Up" → sağlayıcı oluşur → toast "Ödeme sağlayıcısı başarıyla yapılandırıldı" → liste yenilenir. "İptal" adım 1'e döner.
- Para birimi zorunludur; eksik/yanlış alanlarda hata toast'ı alan adıyla gelir (ör. "{alan} alanı zorunludur.", "{alan} biçimi geçersiz. Sağlayıcının verdiği değeri olduğu gibi yapıştırın.", "PayTR için {alan} zorunludur.").
- Aynı sağlayıcı ikinci kez kurulamaz.

### Liste aksiyonları
| Aksiyon | Ne olur | Toast | Onay |
|---|---|---|---|
| Etkinleştir / Devre Dışı Bırak | Anında kaydeder. Devre dışı: yeni ödemeler durur, süren ödemeler tamamlanır | "{provider} etkinleştirildi" / "{provider} devre dışı bırakıldı" | Tıklamadan önce onay |
| Varsayılan Yap | Anında; önceki varsayılanın işaretini kaldırır | "{provider} varsayılan ödeme sağlayıcısı olarak ayarlandı" | Tıklamadan önce onay |
| Bağlantı Testi | Kayıtlı kimlik bilgileriyle sağlayıcıya gerçek istek atar (taksitli sağlayıcılarda oran sorgusu); ödeme çekmez (doğrulanmadı) | Başarı "Bağlantı testi başarılı"; hata "Bağlantı testi başarısız" + sebep | Kısa onay (dış etkili) |
| Kaldır | AlertDialog "Ödeme Sağlayıcısini Kaldır?" — "{provider} yapılandırmasını kaldıracaktır. Daha sonra tekrar kurabilirsiniz." | "{provider} yapılandırması kaldırıldı" | Kural 5 — tek tek onay. Varsayılan sağlayıcıda menüde yok; önce başka sağlayıcıyı varsayılan yap. Tek kalan varsayılan sağlayıcı silinemez |

## 2. Yapılandırma — `/settings/payments/[id]`
- URL: {ADMIN_URL}/settings/payments/<id> (listede "Yapılandır" ile açılır; geri ok listeye döner).
- Başlık: "{provider} Yapılandır / Configure {provider}"; açıklama "{provider} ödeme entegrasyonunuzu kurun".
- Amaç: Kurulu sağlayıcının kimlik bilgilerini, para birimini, modunu (Test/Canlı), taksit ve iade ayarlarını değiştirmek.
- Kaydetme: tek "Yapılandırmayı Kaydet / Save Configuration" butonu tüm kartları birlikte kaydeder; değişiklik yoksa pasif. Anında kaydeden alan yok.

### Kartlar ve alanlar
| Kart | Label (tr / en) | Kontrol | Zorunlu | Varsayılan / validasyon | Locator | Not |
|---|---|---|---|---|---|---|
| Kimlik bilgileri | Yardım kutusu + "Kimlik bilgileri sayfasını aç" (dış link) | Alert | — | — | — | Sağlayıcı panelinin adresi; Claude açmaz |
| Kimlik bilgileri | API Anahtarı / API Key (PayTR'de "Mağaza Parola") | Input | sağlayıcıya göre | Kayıtlı değer maskeli/kısaltılmış görünür; PayTR'de gizli alan | `#provider-field-apiKey` | 🔒 Claude dokunmaz |
| Kimlik bilgileri | Gizli Anahtar / Secret Key (PayTR'de "Mağaza Gizli Anahtar") | password | evet | Kayıtlıysa altında "Bir şifre zaten ayarlanmış. Mevcut değeri korumak için boş bırakın." | `#provider-field-secretKey` | 🔒 |
| Kimlik bilgileri | Webhook Şifresi / Webhook Secret | password | hayır | aynı ipucu | `#provider-field-webhookSecret` | 🔒; PayTR'de yok |
| Kimlik bilgileri | Mağaza No / Merchant ID | Input | PayTR'de evet | düz metin | `#provider-field-merchantId` | Yalnız PayTR; gizli değil |
| Kimlik bilgileri | Para Birimi / Currency | aramalı combobox | evet | sağlayıcının desteklediği liste | label ile | |
| Kimlik bilgileri | Geri Dönüş URL / Callback URL | Input | Iyzico'da evet ("Devam etmek için Geri Dönüş URL girin") | | `#provider-field-callbackUrl` | Stripe'ta isteğe bağlı; PayTR'de yok |
| Kimlik bilgileri | Temel URL / Base URL | Input | Iyzico'da evet ("Devam etmek için Temel URL girin") | | `#provider-field-baseUrl` | Iyzico |
| Kimlik bilgileri | İptal URL / Cancel URL | Input | hayır | | `#provider-field-cancelUrl` | PayPal |
| Kimlik bilgileri › Mod / Mode | "Test / Testing" (Gerçek ödeme işlenmez) · "Canlı / Live" (Gerçek ödemeler işlenir) | RadioGroup (kart) | — | kayıtlı mod | `#mode-testing` / `#mode-live` | **Canlıya geçiş kritik** — aşağıya bak |
| Bildirim URL (yalnız PayTR) | Bildirim URL / Notification URL | salt okunur + kopyala | — | — | aria-label "Bildirim URL kopyala" | Gizli değil; kullanıcı PayTR panelinde "Destek & Kurulum → Ayarlar → Bildirim URL" alanına yapıştırır (protokol https, kutuya `https://` yazılmaz) |
| Taksit Ayarları (Iyzico, PayTR) | Taksiti Etkinleştir | Switch (kart başlığında) | — | kapalı | aria-label "Taksiti Etkinleştir" | Kapalıyken kartın geri kalanı görünmez |
| Taksit | Banka Komisyon Oranları (Sağlayıcıdan) | açılır panel, salt okunur tablo + "Oranları Yenile" | — | — | | Sağlayıcıdan okunur; sağlayıcı panelinden yönetilir |
| Taksit (Iyzico) | Aktif Taksit Sayıları | Checkbox 1–12 | — | 1, 2, 3, 6, 9, 12 | label metni sayı | Bankaların sunmadığı sayılar pasif |
| Taksit (PayTR) | Maksimum taksit sayısı | Select 1–12 ("1 (tek çekim)") | — | | `#paytr-max-installments` | PayTR müşteriye 1..N arası tüm taksitleri gösterir |
| Taksit | Komisyon Modeli: "Satıcı Öder (Vade Farksız)" / "Müşteri Öder (Vade Farklı)" | RadioGroup | — | Satıcı Öder | `#commission-merchant` / `#commission-customer` | Müşteri Öder'de oranlar müşteri tutarına eklenir |
| Taksit | Minimum Sipariş Tutarı | Switch + number | — | 0 (yok) | `#installment-min-amount` | |
| Taksit (yalnız Müşteri Öder) | Mağaza Ek Komisyonu → "{n}x (%)" | Switch + number (0–100, 0.01) | — | | `#extra-rate-<n>` | Sağlayıcı komisyonunun üstüne eklenir |
| Taksit | Ödeme Hesaplayıcı | salt okunur hesap | — | | `#simulator-amount`, `#simulator-bank` | Kaydedilmez |
| İade Politikası | İade Süresi (Gün) | number | — | 30; 14–365 | `#refund-window-days` | Aralık dışı değer alana işlenmez |
| İade Politikası | Otomatik Onay Eşiği | number | — | 0 (devre dışı) | `#auto-approve-below` | "Henüz etkin değil" rozeti |
| İade Politikası | Maksimum İade Yüzdesi | salt okunur | — | %100 | | Değiştirilemez |
| İade Politikası | Aynı Gün İptal/Void | Switch | — | | aria-label | Yalnız destekleyen sağlayıcıda; "Henüz etkin değil" |
| 3D Secure Ayarları | "3D Secure her ödemede aktif" | bilgi kartı | — | — | — | Ayar yok; PayTR'de görünmez |

### Alt çubuk (yapışkan)
"Kaydedilmemiş değişiklikler" uyarısı · "Dokümantasyonu Görüntüle" (dış link) · "Bağlantı Testi / Test Connection" (kayıtlı değerlerle test eder — kaydedilmemiş değişiklikler test edilmez) · "İptal" (listeye döner, değişiklikler kaybolur) · "Yapılandırmayı Kaydet".
- Kaydet → toast "Ödeme yapılandırması başarıyla kaydedildi"; sayfa kayıtlı (maskeli) değerlerle yenilenir. Hata → alan adlı hata toast'ı (ör. PayTR taksitleri: "PayTR taksitleri 1'den seçtiğiniz en yüksek sayıya kadar aralıksız olmalıdır…").

## Gizli alanlar — Claude dokunmaz
- Gizli/kimlik bilgisi alanları: **API Anahtarı / Mağaza Parola, Gizli Anahtar / Mağaza Gizli Anahtar, Webhook Şifresi** (Ekle dialogunda ve yapılandırma ekranında).
- Kayıtlı gizli değerler hiçbir zaman geri gösterilmez; alanlar maskeli görünür, boş bırakılan gizli alan mevcut değeri korur.
- Claude bu alanları okumaz, yazmaz, kopyalamaz; snapshot'ta görünen maskeli/kısaltılmış değerleri sohbete aktarmaz — özette yalnız "kayıtlı / boş / kullanıcı girecek" yazar. Kullanıcıya: "Kimlik bilgilerini sağlayıcı panelinden alıp bu alanlara kendin yapıştır; ben görmeyeceğim. Bitince haber ver."
- Gizli olmayan alanlar: sağlayıcı seçimi, Mağaza No, para birimi, URL'ler, mod, taksit, iade, aktif/varsayılan — normal akış + onay.

## Canlı moda geçiş (kritik)
- Test → Canlı: kaydedildiği andan itibaren **gerçek kartlardan gerçek tahsilat** yapılır. Özette ayrı satır: "Mod: Test → **Canlı** (gerçek ödeme alınır)". Prod'da ekstra uyarı; kimlik bilgilerinin canlı (test değil) anahtarlar olduğunu kullanıcı teyit eder.
- Canlı → Test: vitrinde gerçek ödeme alınamaz hale gelir; aynı şekilde ayrı onay.
- Mod değişikliğinden önce ve sonra kullanıcıya "Bağlantı Testi" önerilir (kayıttan sonra çalıştır).

## Ön koşullar ve bağımlılıklar
- Sağlayıcı hesabı ve kimlik bilgileri kullanıcıda olmalı.
- Para birimi mağazada tanımlı olmalı (`/settings/currencies`) — doğrulanmadı.
- Etkiler: vitrin ödeme adımı, admin sipariş oluşturma (ödeme yöntemi listesi), taksit seçenekleri, iade süreci; ödeme raporu `/reports/payments`.

## Tuzaklar
- Varsayılan sağlayıcı kaldırılamaz/menüde Kaldır yok; önce başka birini varsayılan yap.
- Kaldır, ileride aynı sağlayıcı yeniden kurulduğunda kimlik bilgilerinin tekrar girilmesini gerektirir.
- Bağlantı Testi kaydedilmiş değerleri dener; değişikliklerden sonra önce Kaydet (onaylı), sonra test.
- Taksit sayıları banka oranlarına göre pasifleşebilir; seçilemeyen sayıyı özetten çıkar ve kullanıcıya bildir.

## Doğrulama
1. Listeye dön: Durum, Mod, Para Birimi, Varsayılan yıldızı beklenenle aynı.
2. Yapılandır sayfasını yeniden aç: mod radyosu, para birimi, taksit/iade değerleri; gizli alanların altında "zaten ayarlanmış" ipucu (değer okunmaz).
3. Kullanıcı onaylarsa "Bağlantı Testi" sonucu toast'ını raporla.
