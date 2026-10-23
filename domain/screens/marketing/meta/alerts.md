# Meta Performans Uyarıları (liste, oluştur, detay, düzenle)
- URL'ler:
  - {ADMIN_URL}/marketing/meta-ads/alerts — uyarı kuralları listesi
  - {ADMIN_URL}/marketing/meta-ads/alerts/new — kural oluştur
  - {ADMIN_URL}/marketing/meta-ads/alerts/{id} — kural detayı + son etkinlik
  - {ADMIN_URL}/marketing/meta-ads/alerts/{id}/edit — kural düzenle
- Menü yolu: Pazarlama → Meta Reklamlar → "Uyarılar" kartı → "Aç" ([meta-overview.md](meta-overview.md)).
- Sayfa başlıkları: "Uyarılar / Alerts" ("ROAS, CPA veya harcama gibi önemli metrikler eşiğinizi aştığında bildirim
  alın."), "Uyarı oluştur / Create alert", detayda kural adı (açıklamada tür), "Uyarıyı düzenle / Edit alert".
- Amaç: Meta reklam metrikleri (ROAS, CPA, CTR, harcama, sıklık, token süresi, kampanya hatası) bir eşiği geçtiğinde
  bildirim üreten kurallar tanımlamak; bildirimi uygulama içi, e-posta, Slack veya webhook ile almak.
- Entity: [../../../entities/meta-integration.md](../../../entities/meta-integration.md) → "Uyarı kuralı / tetiklenen
  uyarı". Mağaza genel bildirim kuralları ayrı ekrandır: [../../settings/notification-rules.md](../../settings/notification-rules.md).
- Yetki: liste/detay `marketing:view`; oluştur `marketing:create`; düzenle, "Etkin" anahtarı, "Şimdi kontrol et"
  `marketing:update`; sil `marketing:delete`.
- Uyarılar **Meta'ya yazmaz**, kampanyayı kendiliğinden durdurmaz; yalnız izler ve bildirir.

## Gizli alanlar — Claude okumaz, yazmaz; kullanıcı kendisi girer
| Alan | Neden |
|---|---|
| "Slack webhook URL" (`#alert-slack-url`, `alert-form-slack-url`) | URL kanala yazma yetkisi taşır |
| "Webhook URL" (`#alert-webhook-url`, `alert-form-webhook-url`) | Uç nokta adresi gizli anahtar/parametre içerebilir |
- Düzenleme ekranında bu alanlar kayıtlı değerle dolu açılabilir; Claude değeri okumaz, özetine yazmaz ("kayıtlı /
  değişecek" yaz).
- "E-posta alıcıları" kişisel veridir; yalnız kullanıcının verdiği adresler yazılır.

## Ön koşullar ve bağımlılıklar
- Metrik değerlendirmesi Meta reklam verisine dayanır → **"Bağlı" mod** ([meta-settings.md](meta-settings.md)) ve
  çalışan kampanyalar ([funnels.md](funnels.md)). Manuel modda "Şimdi kontrol et" kilitli.
- Kural oluşturma Meta bağlantısı istemez; ama veri olmadan tetiklenmez.

## Yerleşim
### Liste
1. Başlık; sağda "Günlüğü gör / View log" (`alerts-view-logs-cta`), **"Şimdi kontrol et / Run check now"**
   (manuel modda kilitli), "Uyarı oluştur" (`alerts-create-cta`).
2. Filtre: "Uyarılarda ara…", önem ("Tüm önem dereceleri", Bilgi, Uyarı, Kritik).
3. Tablo: "Ad" (`alert-config-row-link-{id}`), "Tür", "Önem" (rozet), "Koşul" (metrik + karşılaştırıcı + eşik), **"Etkin"
   (satır içi Switch; aria-label "Aç"/"Kapat")**, "⋯" (Detayları gör, Düzenle, Sil).
4. Boş durum "Henüz uyarı yok" + "İlk uyarınızı oluşturun".

### Detay
- Tür rozeti, **"Etkin" Switch**, "Düzenle" (`alert-detail-edit`), "Sil" (`alert-detail-delete`).
- "Koşul" kartı: Metrik, Karşılaştırıcı, Eşik, Pencere (saat), Bekleme süresi (dakika), Son tetikleme (ya da "Hiç"),
  Bildirim kanalları (`alert-detail-channel-{kanal}`), E-posta alıcıları.
- "Son etkinlik / Recent activity" ("Bu kiracıdaki en son uyarılar." — yalnız bu kuralın değil, mağazanın tüm son
  uyarıları); boşsa "Henüz hiçbir uyarı tetiklenmedi."; "Günlüğü gör" (`alert-detail-view-all-logs`).
- Kural yoksa "Uyarı bulunamadı" + "Geri".

### Uyarı günlüğü
- "Günlüğü gör" ayrı bir günlük görünümüne gider ("Uyarı günlüğü — Son 90 günde tetiklenen tüm uyarılar"; sütunlar
  Önem, Uyarı, Tetiklendi, Değer / eşik, Durum; satır aksiyonları "Onayla / Acknowledge" ve "Çöz / Resolve";
  durumlar Aktif, Onaylandı, Çözüldü, Sessize alındı). Bu görünümün adresi ve davranışı canlıda doğrulanmadı.

## Alanlar (Oluştur / Düzenle)
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Uyarı adı / Alert name | Input | evet | 2–100 ("Devam etmek için bir uyarı adı girin.") | `#alert-name`, `alert-form-name` | Günlükte görünür |
| Uyarı türü / Alert kind | shadcn Select | evet | varsayılan "ROAS düştü"; seçenekler: ROAS düştü, Bütçe aşıldı, CPA sıçradı, Düşük tıklama oranı, Meta token süresi doluyor, Kampanya hatası, Bütçe neredeyse tükendi, Reklam sıklığı çok yüksek | `#alert-type`, `alert-form-type` | **Düzenlemede kilitli** ("Kural oluşturulduktan sonra uyarı türü değiştirilemez."). Tür seçince Metrik otomatik dolar |
| Metrik / Metric | Input (metin) | evet | türe göre varsayılan: `roas`, `spend`, `cpa`, `ctr`, `tokenExpiry`, `errorCount`, `frequency` | `#alert-metric`, `alert-form-metric` | Varsayılanı değiştirme; kullanıcı özel metrik söylemedikçe |
| Karşılaştırıcı / Comparator | shadcn Select | evet | varsayılan "küçük"; büyük, küçük, en az, en fazla, eşit | `#alert-operator`, `alert-form-comparator` | |
| Eşik / Threshold | number Input | evet | 0 – 1.000.000; varsayılan 0 | `#alert-threshold`, `alert-form-threshold` | ROAS 2 = 2.0 kat; CTR/oranlarda birimi kullanıcıyla netleştir |
| Pencere (saat) / Window (hours) | number Input | evet | ≥1; varsayılan 24 | `#alert-lookback`, `alert-form-window` | "Metriği değerlendirirken ne kadar geriye bakacağımız." |
| Önem / Severity | shadcn Select | evet | varsayılan "Uyarı"; Bilgi, Uyarı, Kritik | `#alert-severity`, `alert-form-severity` | Yalnız rozet rengi/öncelik |
| Bildirim kanalları / Notification channels | Checkbox grubu | en az 1 | varsayılan "Uygulama içi" | `alert-form-channel-{in_app|email|slack|webhook}` | Uygulama içi (günlükte göster), E-posta, Slack, Webhook |
| E-posta alıcıları / Email recipients | Textarea (satır başına bir adres) | E-posta seçiliyse | 1–20 geçerli adres ("\"{email}\" geçerli bir e-posta adresi gibi görünmüyor.") | `#alert-recipients`, `alert-form-recipients` | Kişisel veri |
| Webhook URL | Input | Webhook seçiliyse | boş olamaz | `#alert-webhook-url` | **Gizli alan — kullanıcı girer** |
| Slack webhook URL | Input | Slack seçiliyse | boş olamaz | `#alert-slack-url` | **Gizli alan — kullanıcı girer** |
| Bekleme süresi (dakika) / Cooldown (minutes) | number Input | evet | ≥1; varsayılan 60 | `#alert-cooldown`, `alert-form-cooldown` | Aynı kuralın tekrar tetiklenmeden önce beklediği süre |
- Kanal/alıcı hataları toast olarak çıkar ("En az bir bildirim kanalı seçin.", "E-posta kanalı için en az bir e-posta
  adresi ekleyin." …). Butonlar "İptal", "Uyarı oluştur" / "Değişiklikleri kaydet".

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Uyarı oluştur | Kural oluşur (etkin), listeye/detaya döner | "Uyarı oluşturuldu." / "Uyarı oluşturulamadı…" |
| Değişiklikleri kaydet | Kural güncellenir | "Uyarı güncellendi." |
| **"Etkin" Switch** (liste ve detay) | **Diyalogsuz, anında** kural açılır/kapanır | "Uyarı açıldı." / "Uyarı kapatıldı." / "Uyarı durumu değiştirilemedi…" |
| **Şimdi kontrol et** | Tüm etkin kurallar hemen değerlendirilir; koşulu sağlananlar tetiklenir ve **seçili kanallara bildirim gider** | "Uyarı kontrolü başlatıldı. Yeni tetiklemeler kısa süre içinde görünecek." |
| Sil → "Uyarıyı sil" ("\"{name}\" uyarısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.") → Sil | Kural kaldırılır | "Uyarı silindi." |
| Günlükte Onayla / Çöz | Tetiklenen uyarının durumu değişir | "Uyarı onaylandı." / "Uyarı çözüldü." |

## Onay zamanlaması (kural 2/5/6)
- **"Etkin" Switch anında kaydeder** (rule 6 tipi): dokunmadan **önce** onay al.
- **Bildirim kanalları dış sisteme/kişilere mesaj gönderir:** E-posta (girilen alıcılara), **Slack** (kanala mesaj),
  **Webhook** (kullanıcının uç noktasına POST). Kural oluşturma/düzenleme özetinde kanallar, alıcı sayısı ve "Slack/Webhook
  adresi kullanıcı tarafından girildi" notu; alıcı adreslerini tablo halinde göster.
- **"Şimdi kontrol et" bildirimleri hemen tetikleyebilir** → kısa özet (kaç etkin kural, hangi kanallar) + onay.
- Silme geri alınamaz → kural adıyla ayrı onay.
- Hiçbir uyarı aksiyonu Meta reklam hesabına yazmaz veya harcama başlatmaz.

## Yan etkiler
- Etkin kurallar arka planda yaklaşık **15 dakikada bir** değerlendirilir; tetiklenen kural "Bekleme süresi" dolana kadar
  yeniden tetiklenmez.
- Genel bakıştaki "Aktif uyarılar" sayısı tetiklenmiş ve çözülmemiş uyarılardır.
- Tetiklenen uyarılar 90 gün saklanır.

## Tuzaklar
- "Son etkinlik" kartı yalnız bu kuralın değil, mağazanın tüm uyarılarını gösterir; kurala özgü sanma.
- Tür değişince Metrik alanı kendiliğinden yeniden dolar; elle girdiğin metrik kaybolur.
- "Meta token süresi doluyor" kuralı bağlantının yenilenmesi gerektiğini haber verir; yenileme kullanıcının
  [meta-settings.md](meta-settings.md) ekranında yeniden bağlanmasıyla yapılır.
- Eşik birimi metrik türüne göre değişir (ROAS kat, CTR oran/yüzde, harcama para birimi); emin değilsen kullanıcıya sor.

## Doğrulama
1. Toast + listede satır: ad, tür, önem rozeti, koşul metni ("roas küçük 2"), Etkin anahtarı.
2. Detayda Koşul kartı alanları ve kanal rozetleri; alıcı listesi.
3. Etkin anahtarı sonrası toast ve snapshot'ta switch durumu.
