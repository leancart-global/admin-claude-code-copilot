# Gönderim Kuralları (Sending Rules)
- URL: {ADMIN_URL}/settings/notifications/frequency
- Menü yolu: sidebar'da yok. URL ile ya da "Üyelik İptal Analizleri / Unsubscribe Insights" (`/notifications/unsubscribes`)
  ekranındaki "Sıklık limitlerini düzenle / Adjust frequency limits" linkiyle açılır. Başlıktaki geri ok
  `/settings/notifications`'a döner.
- Başlık: "Gönderim Kuralları / Sending Rules" — açıklama "Müşterilerinizi spam'den koruyun — günlük limitler, sessiz
  saatler ve akıllı susturma. KVKK / CAN-SPAM uyumu için gereklidir."
- Amaç: Bir müşteriye gönderilen **pazarlama** mesajlarının (sepet hatırlatma, kampanya, geri kazanma gibi otomatik akışlar)
  sıklığını sınırlamak: 24 saatlik limitler, SMS/push için sessiz saatler ve mailleri açmayan müşteriye gönderimi otomatik
  durdurma. Sipariş, kargo, şifre sıfırlama gibi işlem mesajları bu kurallardan etkilenmez.
- Yetki: sayfa `settings:read`; kaydetme `notifications:write`.
- Hassas: hayır. Anında kayıt: hayır ("Değişiklikleri Kaydet" gerekir).

## Ön koşullar ve bağımlılıklar
- Ön koşul yok; kayıt yoksa form önerilen değerlerle gelir.
- Etkilediği şey: bildirim şablonlarının pazarlama türündekiler ([notifications.md](notifications.md)) ve otomasyonların
  ([../marketing/workflows.md](../marketing/workflows.md)) e-posta adımları — otomasyon gönderimleri 24 saatlik limitlere ve
  sessiz saatlere tabidir; limit dolmuşsa o gönderim atlanır, akış devam eder. Manuel e-posta kampanyalarına
  ([../marketing/campaigns.md](../marketing/campaigns.md)) uygulanıp uygulanmadığı doğrulanmadı.
- Teslimattan ~7 gün sonra müşteriye giden otomatik "değerlendirme isteği" e-postası da bildirim tarafındadır
  ([../marketing/reviews.md](../marketing/reviews.md)).

## Yerleşim
Dört kart + yapışkan alt çubuk:
1. "Sıklık Limitleri / Frequency Limits"
2. "Sessiz Saatler / Quiet Hours" (+ saat dilimi bilgi kutusu)
3. "Akıllı Susturma / Smart Suppression"
4. "Üyelikten Çıkış Sayfası / Unsubscribe Page" — rozet "KVKK / CAN-SPAM zorunluluğu"; **salt bilgi**, ayar yok
   (her pazarlama e-postasında tek tık abonelikten çıkış vardır; çıkış sebebi opsiyonel sorulur, çıkış engellenmez).
- Alt çubuk: "Önerilen Değerlere Dön / Reset to Recommended", "Değişiklikleri Kaydet / Save Changes" (kaydederken
  "Kaydediliyor...").

## Alanlar
| Bölüm | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon / varsayılan (önerilen) | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Sıklık Limitleri | Kanal başına (24sa) / Per channel (24h) | `marketing24hCap` | number Input | evet | 0–50 tam sayı ("Kanal başına limit 0 ile 50 arasında olmalı."); önerilen **1** | `getByLabel('Kanal başına (24sa)')` | Bir müşteriye 24 saatte gidebilecek pazarlama mesajı sayısı. Boş bırakılırsa 0 olur |
| Sıklık Limitleri | Tüm kanallar toplam (24sa) / Across all channels (24h) | `crossChannel24hCap` | number Input | evet | 0–50 ("Tüm kanallar limiti 0 ile 50 arasında olmalı."); önerilen **2** | `getByLabel('Tüm kanallar toplam (24sa)')` | E-posta + SMS + push toplamı. Boş → 0 |
| Sessiz Saatler | Başlangıç saati / Start time | `quietHoursStart` | `input[type=time]` | evet | 24 saat biçimi (SS:dd), önerilen 22.00; hatalıysa "HH:mm 24 saat formatı kullanın …" | `getByLabel('Başlangıç saati')` | |
| Sessiz Saatler | Bitiş saati / End time | `quietHoursEnd` | `input[type=time]` | evet | önerilen 08.00; başlangıçla aynı olamaz ("Sessiz saat başlangıcı ve bitişi aynı olamaz.") | `getByLabel('Bitiş saati')` | Gece yarısını aşan aralık (22.00 → 08.00) geçerlidir |
| Akıllı Susturma | Bu kadar açılmamış mailden sonra durdur / Stop after this many unopened emails | `smartSuppressionThreshold` | number Input | evet | 1–20 ("Eşik değeri 1 ile 20 arasında olmalı."); önerilen **3** | `getByLabel(/açılmamış mailden sonra/)` | Boş → 1 |
| Akıllı Susturma | Durdurma süresi (gün) / Pause length (days) | `smartSuppressionDays` | number Input | evet | 1–90 ("Durdurma süresi 1 ile 90 gün arasında olmalı."); önerilen **14** | `getByLabel('Durdurma süresi (gün)')` | 30'dan büyükse formun altında kırmızı uyarı kutusu çıkar (kaydı engellemez) |

Sayısal alanlar ondalık kabul etmez (tam sayı).

## Aksiyonlar
- **Değişiklikleri Kaydet / Save Changes** (submit): validasyon hatası alan altında kırmızı; geçerliyse kaydeder →
  toast "Gönderim kuralları güncellendi." / hata "Gönderim kuralları kaydedilemedi. Lütfen tekrar deneyin."
- **Önerilen Değerlere Dön / Reset to Recommended**: formu 1 / 2 / 22.00 / 08.00 / 3 / 14 değerlerine çeker, **kaydetmez**;
  kalıcı olması için Kaydet gerekir.
- Yükleme hatası: üstte kırmızı kutu "Gönderim kuralları yüklenemedi." — bu durumda form önerilen değerleri gösterir;
  kaydetmek mevcut ayarların üzerine yazar.

## Yan etkiler
- Kaydedince sonraki pazarlama gönderimlerinden itibaren geçerli olur:
  - Limit dolan müşteriye o 24 saat içinde yeni pazarlama mesajı gönderilmez (mesaj atlanır).
  - Limit **0** = o türde pazarlama mesajı hiç gönderilmez.
  - Sessiz saatlerde SMS ve push gönderilmez; **e-posta her zaman serbest**.
  - Son N pazarlama e-postasını açmayan müşteriye belirtilen gün sayısı kadar pazarlama gönderilmez; müşteri tekrar
    etkileşime geçince (siteyi ziyaret, e-posta açma, sipariş) gönderim devam eder.
- İşlem mesajları (sipariş onayı, kargo, şifre sıfırlama…) bu kurallardan bağımsız her zaman gönderilir.
- Abonelikten çıkma analizleri `/notifications/unsubscribes` ekranında; "çok sık mail" oranı yüksekse limit düşürülür.

## Tuzaklar
- Limitleri 0 yapmak tüm pazarlama otomasyonlarını fiilen durdurur — kullanıcı açıkça istemedikçe yapma, özette belirt.
- "Önerilen Değerlere Dön" kaydetmez; kullanıcı "varsayılana döndür" dediyse ardından Kaydet de gerekir (onayla).
- Ekran sessiz saatlerin "müşterinin saat dilimi biliniyorsa ona göre" uygulandığını söyler (doğrulanmadı) — özette saat
  dilimini belirtme, saatleri kullanıcının verdiği gibi yaz.
- Saat alanına tarayıcı yerel biçimiyle (ör. ÖÖ/ÖS) görünüm verebilir; değeri 24 saat biçiminde gir.

## Doğrulama
1. Toast "Gönderim kuralları güncellendi."
2. Sayfayı yenile → alanlar kaydedilen değerleri gösterir (yükleme hatası kutusu yok).
