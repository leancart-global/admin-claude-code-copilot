# Pazar Yeri Bağlantıları (Marketplace) — liste + yapılandırma

> **Operatör sınırı**
> - Claude pazaryeri seçimi, otomatik sipariş onayı, senkronizasyon modu, stok tamponu ve fiyatlandırma/komisyon alanlarını kullanıcı onayıyla doldurabilir.
> - Claude **kimlik bilgisi alanlarına (API Key, API Secret, Client Secret, Refresh Token) hiç yazmaz ve okumaz**; satıcı panelinden alınan bu değerleri kullanıcı tarayıcıda kendisi girer.
> - "Bağlantıyı Test Et" pazaryeri API'sine gerçek istek gönderir (dış etkili) — kısa onay. "Bağlantıyı Kes" tüm senkronizasyonu durdurur — kural 5, tek tek onay.
> - Ortamı **Canlı (Production)**'a almak ve otomatik sipariş onayını açmak gerçek siparişleri etkiler; ayrı satırla özetlenip onaylanır.

## 1. Liste — `/settings/marketplace`
- URL: {ADMIN_URL}/settings/marketplace
- Menü yolu: "Ayarlar / Settings" → "Pazar Yeri / Marketplace". Ayarlar hub'ında da kart.
- Kart başlığı: "Pazar Yeri / Marketplace" + "{n} bağlı / {n} connected" rozeti; açıklama "Ürünleri, siparişleri ve stoğu senkronize etmek için pazaryeri hesaplarınızı bağlayın."
- Amaç: Mağazayı Trendyol, Amazon, Hepsiburada, N11, Çiçeksepeti satıcı hesaplarına bağlamak (kimlik bilgisi kaydı), bağlantıyı test etmek ve kesmek. Bağlantı kurulduktan sonra kanal ekranları (`/marketplace/<kanal>`: kategori eşleme, ürün gönderimi, bekleyen işlemler) bu bağlantıyı kullanır.
- Yetki: menü `settings:read`; ekrandaki işlemler ayarlar yetkisiyle çalışır (ayrı izin adı doğrulanmadı).
- Hassas ekran: **evet**. Anında kaydeden kontrol yok (tüm işlemler buton/onaylı).

### Yerleşim
- Sağ üst: "Pazaryeri Ekle / Add Marketplace" (bağlanmamış pazaryeri kalmadıysa pasif).
- Tablo: Pazaryeri (ad, açıklama) · Durum ("Kurulmadı / Not set up", "Aktif / Active", "Pasif / Inactive") · Mod ("Test", "Canlı / Live", —) · Para Birimi · "⋯" menü.
- Satır menüsü: bağlı değilse "Bağlan / Connect" (Ekle panelini o pazaryeriyle açar); bağlıysa "Yapılandır / Configure" (detay sayfası), "Bağlantıyı Test Et / Test Connection", "Bağlantıyı Kes / Disconnect".

### Pazaryeri Ekle paneli (sağdan açılan; başlık "{provider} Bağlan / Connect {provider}")
Adım 1: bağlanmamış pazaryerleri listesi. Adım 2: açıklama "Satıcı panelinizden {provider} API kimlik bilgilerinizi girin." + alanlar:

| Pazaryeri | Alanlar (ekranda görünen label) | Para birimi |
|---|---|---|
| Trendyol | Seller ID, API Key 🔒, API Secret 🔒 | TRY |
| Amazon | Seller ID, Client ID, Client Secret 🔒, Refresh Token 🔒 | USD, EUR, GBP, TRY |
| Hepsiburada | Merchant ID, API Key 🔒, API Secret 🔒 | TRY |
| N11 | API Key 🔒, API Secret 🔒 | TRY |
| Çiçeksepeti | API Key 🔒, API Secret 🔒 | TRY |

- Ortak alan: switch "Siparişleri Otomatik Onayla / Auto-approve Orders" — "Gelen siparişleri otomatik olarak 'Kargoya Hazır' olarak işaretle"; varsayılan kapalı.
- Locator: `#add-<alan>` (ör. `#add-supplierId` = Trendyol Seller ID, `#add-sellerId`, `#add-clientId`, `#add-merchantId`).
- "Bağlan / Connect" → toast "{provider} bağlandı!"; hata "Pazaryeri yapılandırması kaydedilemedi". "İptal" adım 1'e döner.
- Aynı pazaryeri zaten kayıtlıysa yeni bağlantı mevcut kaydı günceller.
- Yeni bağlantının ortamı panelde seçilmez; bağladıktan sonra listedeki **Mod** sütununu oku ve kullanıcıya bildir, gerekiyorsa Yapılandır'dan ortamı (onaylı) değiştir.

### Liste aksiyonları
| Aksiyon | Ne olur | Toast | Onay |
|---|---|---|---|
| Bağlantıyı Test Et | Kayıtlı kimlik bilgileriyle pazaryeri API'sine istek atar (yanıt birkaç saniye sürebilir) | Başarı "{provider} bağlantısı başarılı!"; hata "Bağlantı Başarısız" — "Pazaryeri API'sine bağlanılamadı. Kimlik bilgilerinizi kontrol edin." | Kısa onay (dış etkili) |
| Bağlantıyı Kes | AlertDialog "{provider} bağlantısı kesilsin mi?" — "…tüm senkronizasyonu durdurur. Mevcut ürünleriniz ve siparişleriniz LeanCart'ta kalır. İstediğiniz zaman yeniden bağlanabilirsiniz." | "{provider} bağlantısı kesildi" | Kural 5 — tek tek onay; yeniden bağlanırken kimlik bilgileri tekrar girilir |

## 2. Yapılandırma — `/settings/marketplace/[id]`
- URL: {ADMIN_URL}/settings/marketplace/<id> (listede "Yapılandır").
- Başlık: "Pazaryeri Yapılandırması / Marketplace Configuration"; açıklama "Pazaryeri bağlantı ayarlarınızı düzenleyin."; geri butonu "Pazaryeri Ayarlarına Dön".
- Amaç: Bağlantının kimlik bilgilerini, ortamını, sipariş/stok senkronizasyon davranışını ve fiyat hesaplama parametrelerini düzenlemek.
- Kaydetme: tek "Değişiklikleri Kaydet / Save Changes" butonu **tüm kartlardaki değerleri birlikte** gönderir → toast "Yapılandırma kaydedildi"; hata "Yapılandırma kaydedilemedi". Anında kaydeden alan yok.

| Kart | Label (tr / en) | Kontrol | Varsayılan / limit | Not |
|---|---|---|---|---|
| API Kimlik Bilgileri ("Bu bilgiler pazaryeri satıcı panelinizden alınır. Şifreli olarak saklanır.") | Satıcı No / Seller ID | Input | placeholder "Pazaryeri panelinden satıcı numaranız" | Gizli değil |
| API Kimlik Bilgileri | API Anahtarı / API Key | password | boş | 🔒 Boş bırakılırsa mevcut değer korunur |
| API Kimlik Bilgileri | API Gizli Anahtarı / API Secret | password | boş | 🔒 Boş = mevcut korunur |
| API Kimlik Bilgileri | Ortam / Environment | Select: "Canlı (Production)" / "Test (Staging)" | Canlı (Production) gösterilir | Gerçek sipariş/stok akışı için kritik |
| API Kimlik Bilgileri | Bağlantıyı Test Et | Buton | — | Kayıtlı bilgilerle test eder |
| Senkronizasyon Ayarları | Siparişleri Otomatik Onayla | Switch | kapalı gösterilir | "Gelen pazaryeri siparişlerini otomatik olarak 'Kargoya Hazır' durumuna getir" |
| Senkronizasyon | Senkronizasyon Modu / Sync Mode | Select: Gerçek Zamanlı (Önerilen) / Zamanlanmış (Her 15 dk) / Sadece Manuel | Gerçek Zamanlı | |
| Senkronizasyon | Stok Güvenlik Tamponu / Stock Safety Buffer | number 0–50 | 2 | "Fazla satışı önlemek için pazaryerinde bu kadar ürünü stoktan düşürün. Önerilen: N11 için 2, Trendyol için 1." |
| Fiyatlandırma ve Komisyon | Varsayılan Komisyon Oranı (%) | number 0–50, 0.1 | boş | "Kategoriye göre değişir. Genelde %5-%25 arası." |
| Fiyatlandırma | Hedef Kâr Marjı (%) | number 0–90 | boş | "Komisyon sonrası minimum istenen kâr." |
| Fiyatlandırma | Varsayılan Kargo Maliyeti (₺) | number ≥0 | boş | |
| Fiyatlandırma | Sabit Ürün Maliyeti (₺) | number ≥0 | boş | "Paketleme, etiketleme vb." |
| Fiyatlandırma | Fiyat Formülü | bilgi | Satış Fiyatı = (Maliyet + Kargo + Sabit) / (1 − Komisyon% − Marj%) | |

Alanlarda `#id` yok; `getByLabel` / label metni ile hedefle.

## Gizli alanlar — Claude dokunmaz
- Gizli/kimlik bilgisi alanları: **API Key, API Secret (API Gizli Anahtarı), Client Secret, Refresh Token** (Ekle panelinde ve yapılandırma ekranında).
- Kayıtlı kimlik bilgileri hiçbir ekranda geri gösterilmez.
- Claude bu alanları okumaz, yazmaz, kopyalamaz; snapshot çıktısındaki değerleri sohbete aktarmaz. Kullanıcıya: "Satıcı panelinden aldığın kimlik bilgilerini bu alanlara kendin gir; ben görmeyeceğim. Bitince haber ver."
- Gizli olmayan: Seller ID / Merchant ID / Client ID, ortam, otomatik onay, senkronizasyon, tampon, fiyatlandırma — normal akış + onay.

## Ön koşullar ve bağımlılıklar
- Kullanıcının pazaryeri satıcı hesabı ve API kimlik bilgileri.
- Etkiler: `/marketplace/<kanal>` ekranları (kategori eşleme → ürün gönderimi), pazaryerinden gelen siparişler, pazaryerindeki stok ve fiyat.

## Yan etkiler
- Otomatik onay açıkken pazaryerinden gelen siparişler kendiliğinden "Kargoya Hazır" olur (pazaryeri tarafında da durum değişir — doğrulanmadı).
- Stok tamponu ve fiyat parametreleri pazaryerine gönderilen stok/fiyatı değiştirir.
- Bağlantıyı kesmek senkronizasyonu durdurur; LeanCart'taki ürün ve siparişler silinmez.

## Tuzaklar
- Yapılandırma ekranı tüm kartları tek "Kaydet" ile birlikte kaydeder; özet tablosuna ekrandaki tüm değerleri (ortam, otomatik onay, senkron modu, tampon, fiyat alanları) yaz.
- Pazaryerine özgü alanların anlamı net değilse kullanıcıya sor.
- Bağlantı Testi kayıtlı değerleri dener; yeni kimlik bilgileri önce kaydedilmeli.

## Doğrulama
1. Listede Durum ve Mod sütunu; "{n} bağlı" rozeti.
2. Kullanıcı onayıyla "Bağlantıyı Test Et" → başarı toast'ı.
3. Kanal ekranında (`/marketplace/<kanal>`) bağlantı durumunu oku (salt okunur).
