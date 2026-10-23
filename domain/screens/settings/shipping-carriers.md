# Kargo Taşıyıcıları (Shipping Carriers)
- URL: {ADMIN_URL}/settings/shipping/carriers
- Menü yolu: "Ayarlar / Settings" → "Kargo / Shipping".
- Başlık: "Kargo Taşıyıcıları / Shipping Carriers" (yanında taşıyıcı sayısı rozeti) — açıklama "Mağazanız için kargo taşıyıcı
  entegrasyonlarını yapılandırın".
- Amaç: Mağazanın kargo firması entegrasyonunu (şu an **Geliver**; Aras, Yurtiçi, MNG, PTT, HepsiJet… firmalarını tek
  hesaptan sunar) bağlamak ve **ödeme adımında müşterinin göreceği kargo seçeneklerini ve ücretlerini** belirleyen kargo
  motorunu ayarlamak: firma seçim stratejisi, öncelik sırası, ücretsiz kargo / ağırlık / bölge ücret kuralları, kapıda ödeme,
  varsayılan paket ölçüsü, müşteri görünümü.
- Yetki: sayfa `settings:read`; taşıyıcı ve kargo motoru okuma `shipping:read`, kaydetme `shipping:write`.
- Hassas: **evet** — taşıyıcı API kimlik bilgileri (bkz. "Gizli alanlar").
- Anında kaydeden kontroller: taşıyıcı satır menüsündeki **Etkinleştir / Devre Dışı Bırak**, **Varsayılan Yap**, **Kaldır**;
  fiyat kuralı satırındaki **Aktif** switch'i; kural silme; "Öncelik Sırasını Kaydet"; "Varsayılan Öncelikleri Yükle";
  varsayılan paket "Kaydet" / "Varsayılanı kaldır". Onay tıklamadan **önce** alınır.
- Dış etkili butonlar: **Bağlantı Testi** (taşıyıcı API'sine istek), **Kontrol Et** (örnek fiyat sorgusu) ve bakiye
  **Yenile** — kayıt değiştirmez; Bağlantı Testi için kullanıcıya sor, diğer ikisini bildirerek çalıştır.
- Entity: [../../entities/shipping-carrier.md](../../entities/shipping-carrier.md).

## Ön koşullar ve bağımlılıklar
- Geliver hesabı (kullanıcının): API anahtarı/token ve Organizasyon ID kullanıcıdan gelir.
- Kargo fiyatı alınabilmesi için gönderici (depo) adresi tanımlı olmalı — sağlık kartı hata verirse "taşıyıcı ayarlarınızı
  ve depo adresinizi kontrol edin" der (depo ekranı faz dışı).
- Ürünlerde ağırlık/ölçü girilmemişse ücret "Varsayılan Paket Ölçüsü"ne göre hesaplanır; o da yoksa en düşük tarife.
- Kargo motoru kartları (aşağıda 2–8) **yalnız Geliver yapılandırılmışsa** görünür.

## Yerleşim
1. **Taşıyıcı kartı**: başlık + "Taşıyıcı Ekle / Add Carrier" (eklenebilecek taşıyıcı kalmadıysa pasif). Taşıyıcı satırları
   veya boş durum "Yapılandırılmış taşıyıcı yok" + "İlk Taşıyıcınızı Ekleyin". Altta güvenlik notu ve "Taşıyıcı
   ayarlarındaki değişiklikler aktif kargo hesaplamalarını etkileyebilir…" uyarısı.
2. "Kargo Fiyatlandırma Durumu / Shipping Rate Status" (sağlık kontrolü)
3. "Hesap Bakiyesi / Account Balance"
4. "Varsayılan Paket Ölçüsü / Default Parcel Size" (kendi Kaydet butonu)
5. "Kargo Fiyatlandırma Kuralları / Shipping Pricing Rules" (kendi ekle/düzenle/sil akışı)
6. "Kargo Seçimi / Carrier Selection" (strateji; "Öncelik Sıram" seçiliyse içinde "Kargo Öncelik Sırası" listesi)
7. "Kapıda Ödeme / Cash on Delivery"
8. "Müşteri Görünümü / Customer Display"
- Kartlar 6–7–8 için sayfanın altında **yapışkan çubuk**: değişiklik varsa "kaydedilmemiş değişiklik" yazısı, "İptal /
  Cancel" (sayfayı yeniler, değişiklikleri atar) ve "Kaydet / Save".

## Taşıyıcı satırı
| Öğe | Değerler |
|---|---|
| Ad + açıklama | Görünen ad; Geliver'de "(N alt taşıyıcı)" — etkin alt firmalar |
| Durum / Status | "Aktif / Active" · "Pasif / Inactive" |
| API Anahtarı / API Key | Ayarlı (onay ikonu) · Eksik (kırmızı) |
| Mod / Mode | "Test Ortamı / Sandbox" · "Canlı / Live" |
| Varsayılan / Default | Yıldız ikonu |
| İşlem menüsü | `getByRole('button', { name: 'Yapılandır' })` / `'Configure'` (üç nokta) → "Yapılandır / Configure", "Etkinleştir / Enable" veya "Devre Dışı Bırak / Disable", "Varsayılan Yap / Set as Default" (varsayılan değilse), "Bağlantı Testi / Test Connection" ("Test ediliyor..."), "Kaldır / Remove" (varsayılan taşıyıcıda pasif) |

## Alanlar

### Taşıyıcı ekleme / yapılandırma paneli (sağdan açılan panel)
Başlık: ekleme "Taşıyıcı Yapılandırması Ekle / Add Carrier Configuration"; düzenleme "{ad} Yapılandır / Configure {name}".

| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Taşıyıcı seçimi (yalnız ekleme) | Bir Taşıyıcı Seçin / Select a Carrier | Kart butonları | evet | — | `getByRole('button', { name: /Geliver/ })` | Yalnız **Geliver** seçilebilir; UPS, FedEx, DHL "Yakında / Coming Soon"; eklenmiş olan "Yapılandırıldı / Configured" ve pasif |
| Form | Görünen Ad / Display Name | Input (placeholder "örneğin, Geliver Üretim") | evet | en az 2 karakter ("Görünen Ad en az 2 karakter olmalıdır.") | `#name` | Admin listesinde görünen ad |
| Form | API Anahtarı / Token / API Key / Token | Input + "Göster/Gizle" butonu | eklemede evet | en az 8 karakter | `#apiKey` | **GİZLİ** — kullanıcı girer. Düzenlemede boş = mevcut korunur |
| Form | API Şifresi (isteğe bağlı) / API Secret (optional) | Input + Göster/Gizle | hayır | — | `#secretKey` | **GİZLİ**. Geliver'de görünmez |
| Form | Webhook Şifresi (isteğe bağlı) / Webhook Secret (optional) | Input + Göster/Gizle | hayır | — | `#webhookSecret` | **GİZLİ** |
| Form | Organizasyon ID / Organization ID | Input (placeholder "örn. org_abc123") | Geliver'de evet | boşsa "Geliver için Organizasyon ID zorunludur…" | `#organizationId` | Bakiye sorgusu ve API işlemleri için. Gizli değil ama kullanıcıdan alınır |
| Form | Test Ortamı Modu / Sandbox/Test Mode | Switch | — | **açık** (yeni eklemede) | `#sandbox` | Açıkken gönderiler test ortamında; gerçek gönderi için kapalı ("Canlı") olmalı |
| Form | Varsayılan Olarak Ayarla / Set as Default | Switch | — | kapalı | `#isDefault` | |
Butonlar: "İptal / Cancel"; "Yapılandırmayı Kaydet / Save Configuration" (ekleme) veya "Yapılandırmayı Güncelle / Update
Configuration" (düzenleme). Hata panelin içinde kırmızı kutu + toast olarak görünür (ör. "Lütfen tüm zorunlu alanları
doldurun", "Girdiğiniz bilgilerde bir hata var, lütfen alanları kontrol edin.").

### Kargo Fiyatlandırma Durumu
"Kontrol Et / Run check" → 1 kg'lık örnek paket için fiyat sorgular. Sonuç: "Kargo fiyatları çalışıyor — {N} kargo seçeneği
bulundu." veya "Kargo fiyatı alınamıyor — Müşterileriniz ödeme adımında kargo seçeneği göremiyor ve sipariş tamamlayamıyor."
veya "Kontrol yapılamadı…" (sonuç değil, tekrar dene).

### Hesap Bakiyesi (salt okunur)
Mevcut Bakiye, durum rozeti "Normal / Healthy" · "Düşük Bakiye / Low Balance" · "Kritik / Critical", Uyarı Eşiği, Tahmini
kalan gönderi, Son kontrol; "Yenile / Refresh". Organizasyon ID yoksa "Bakiye sorgulamak için … Organizasyon ID'yi
yapılandırın".

### Varsayılan Paket Ölçüsü
| Label | Kontrol | Locator | Not |
|---|---|---|---|
| Uzunluk (cm) / Length (cm) | number, ≥0, adım 0.1 | `[data-testid=default-parcel-length]` | |
| Genişlik (cm) / Width (cm) | number | `[data-testid=default-parcel-width]` | |
| Yükseklik (cm) / Height (cm) | number | `[data-testid=default-parcel-height]` | |
| Ağırlık (kg) / Weight (kg) | number | `[data-testid=default-parcel-weight]` | |
- "Kaydet" (`default-parcel-save`) yalnız dört alan da >0 iken aktif; "Varsayılanı kaldır" (`default-parcel-clear`) tanımlıysa
  görünür; "Ağırlığı eksik ürünleri görüntüle" → ürün listesi (ağırlığı eksik filtresiyle).
- Tanımsızsa uyarı: "Şu anda varsayılan bir paket tanımlı değil… ağır ürünlerde eksik ücret alınmasına yol açar."
- Ücret desi ((En × Boy × Yükseklik) / 3000) ile ağırlıktan **büyük olanına** göre hesaplanır.
- Toast: "Varsayılan paket ölçüsü kaydedildi" / "…kaldırıldı" / "…kaydedilemedi".

### Kargo Fiyatlandırma Kuralları
Liste satırı: kural adı, tip, tarih rozeti ("Aktif", "Planlandı", "Süresi Dolmuş", "Süresiz"), **Aktif switch'i (anında
kaydeder)**, düzenle (aria-label "Kuralı Düzenle / Edit Rule"), sil (çöp kutusu → onay "Bu kuralı silmek istediğinizden emin
misiniz?"). Boşsa "Fiyatlandırma kuralı yapılandırılmamış". "Kural Ekle / Add Rule" paneli açar:

| Bölüm | Label (tr / en) | Kontrol | Zorunlu | Validasyon / varsayılan | Locator |
|---|---|---|---|---|---|
| Tip | Kural Tipi / Rule Type | Kart butonları: "Ücretsiz Kargo / Free Shipping", "Ağırlık Ek Ücreti / Weight Surcharge", "Bölgesel Ek Ücret / Regional Surcharge" | evet | Ücretsiz Kargo | buton adı |
| Genel | Kural Adı / Rule Name | Input (placeholder "örn. 500 TL üzeri ücretsiz kargo") | evet | boşken Kaydet pasif | `#rule-name` |
| Genel | Aktif / Active | Switch | — | açık | `#rule-active` |
| Ücretsiz Kargo | Minimum Sipariş Tutarı (₺) / Minimum Order Amount | number, ≥0, adım 0.01 | — | — | `#min-order` |
| Ağırlık | Minimum Ağırlık (kg) / Maximum Ağırlık (kg) | number, adım 0.1 | — | max boş = üst limit yok | `#weight-min`, `#weight-max` |
| Ağırlık / Bölgesel | Ek Ücret Tipi / Surcharge Type | iki buton: "Sabit Tutar / Fixed Amount", "Yüzde / Percentage" | — | Sabit Tutar | buton adı |
| Ağırlık | Tutar (₺ veya %) / Amount | number; yüzde en çok 100 | — | — | `#surcharge-amount` |
| Bölgesel | Bölgeler / Regions | Checkbox'lar: Marmara, Ege, Akdeniz, İç Anadolu, Karadeniz, Doğu Anadolu, Güneydoğu Anadolu | — | — | `getByRole('checkbox', { name: 'Ege' })` (doğrulanmadı) |
| Bölgesel | Şehirler/İller / Cities/Provinces | Arama input (placeholder "34 - İstanbul...") + il listesi; seçilenler rozet (tıklayınca kaldırılır) | — | — | input placeholder ile |
| Bölgesel | Tutar | number | — | — | `#regional-amount` |
| Tarih | Başlangıç Tarihi / Bitiş Tarihi | `input[type=date]` | hayır | boş = süresiz | `#start-date`, `#end-date` |
Toast: "Fiyatlandırma kuralı oluşturuldu / güncellendi / silindi" veya "…oluşturulamadı / güncellenemedi / silinemedi".

### Kargo Seçimi (yapışkan çubukla kaydedilir)
| Label (tr / en) | Kontrol | Açıklama (UI) | Locator |
|---|---|---|---|
| En Ucuz / Lowest Price | Kart butonu | Her sipariş için en uygun fiyatlı kargo seçilir (varsayılan) | buton adı |
| En Hızlı / Fastest Delivery | Kart butonu | En kısa sürede teslim eden seçilir, pahalı olsa bile | |
| Öncelik Sıram / My Preferred Order | Kart butonu | Öncelik listesine göre; eşitlikte en ucuz | |
| Manuel Seçim / Manual Selection | Kart butonu | Her siparişte kargo seçeneğini satıcı inceleyip onaylar | |
| Kargoyu otomatik onayla / Auto-confirm shipments | Switch | Seçilen teklif manuel incelemesiz onaylanır; Manuel'de gizli | `#auto-accept` |
| Otomatik Kargo / Automatic Shipping | Switch | Sipariş onaylanınca kargo otomatik oluşturulur ve gönderilir | `#auto-shipping` |

**Kargo Öncelik Sırası** (yalnız "Öncelik Sıram" seçiliyken): sürükle-bırak veya "Yukarı taşı / Move up" · "Aşağı taşı / Move
down" butonları; boşsa "Varsayılan Öncelikleri Yükle / Load Default Priorities" (Türkiye pazarı varsayılan sırası — kaydeder);
**ayrı** "Öncelik Sırasını Kaydet / Save Priority Order" butonu → "Kargo öncelikleri başarıyla güncellendi".

### Kapıda Ödeme (yapışkan çubukla kaydedilir)
| Label (tr / en) | Kontrol | Not | Locator |
|---|---|---|---|
| Kapıda Ödemeyi Etkinleştir / Enable Cash on Delivery | Switch | Müşterinin teslimatta nakit ödemesine izin verir | `#cod-enabled` |
| Kapıda Ödeme Ücreti / COD Fee (₺) | number ≥0, adım 0.01 | Kapıda ödemeli siparişe eklenen ücret | `#cod-fee` |
| Minimum Sipariş Tutarı (₺) | number | Bu tutarın altında kapıda ödeme sunulmaz | `#cod-min` |
| Maksimum Sipariş Tutarı (₺) | number | 0 = limit yok | `#cod-max` |

### Müşteri Görünümü (yapışkan çubukla kaydedilir)
| Label (tr / en) | Kontrol | Locator |
|---|---|---|
| Kargo Firma Adını Göster / Show Carrier Name | Switch — ödeme sayfasında firma adı | `#show-carrier-name` |
| Tahmini Teslimat Süresini Göster / Show Estimated Delivery | Switch — ödeme sayfasında tahmini teslim | `#show-estimated-delivery` |
Toast (6–7–8): "Kargo motoru ayarları kaydedildi" / "Ayarlar kaydedilemedi. Lütfen tekrar deneyin."

## Gizli alanlar — Claude dokunmaz
- Gizli alanlar: **API Anahtarı / Token**, **API Şifresi**, **Webhook Şifresi**.
- Claude bu alanları **okumaz, yazmaz, kopyalamaz**; panelin snapshot/ekran görüntüsü çıktısındaki bu alanlara ait değerleri
  (kayıtlı değere dair ipuçları dahil) sohbete aktarmaz; **"Göster" butonuna basmaz**. Kullanıcı panelde kendisi girer;
  kullanıcı doldururken ve panel kapanana kadar Claude ekran görüntüsü almaz.
- Düzenlemede gizli alanlar boş bırakılırsa mevcut değer korunur — kullanıcı anahtarı değiştirmek istemiyorsa dokunma.
- Gizli olmayan alanlar normal akışla, onayla doldurulabilir: taşıyıcı seçimi, Görünen Ad, Test Ortamı Modu, Varsayılan,
  Organizasyon ID (kullanıcının verdiği değerle) ve kargo motoru kartlarının tamamı.

## Aksiyonlar
| Aksiyon | Ne olur | Toast | Onay |
|---|---|---|---|
| Taşıyıcı Ekle → Yapılandırmayı Kaydet | Taşıyıcıyı oluşturur, liste yenilenir, kargo motoru kartları görünür | "{ad} başarıyla yapılandırıldı" | Kaydet'ten önce |
| Yapılandır → Yapılandırmayı Güncelle | Ad, mod, varsayılan, (girildiyse) anahtarlar güncellenir | "{ad} başarıyla güncellendi" | Kaydet'ten önce |
| Etkinleştir / Devre Dışı Bırak | **Anında** | "{ad} başarıyla etkinleştirildi" / "{ad} devre dışı bırakıldı" | Tıklamadan önce; devre dışı bırakma tek tek |
| Varsayılan Yap | **Anında**; diğerinin varsayılanı kalkar | "{ad} başarıyla güncellendi" | Tıklamadan önce |
| Bağlantı Testi | Taşıyıcı API'sine test isteği; kayıt değişmez | "{ad} bağlantısı başarılı ({süre}ms)" / "Bağlantı başarısız: {hata}" | Dış etkili — sor |
| Kaldır | Onay dialogu "Taşıyıcı Kaldırılsın mı?" → "Kaldır" | "Taşıyıcı yapılandırması silindi" | Silme — tek tek |
| Kural ekle/düzenle → Kaydet; satır Aktif switch'i; sil | Kural kaydı (switch ve sil anında) | yukarıda | Her biri ayrı |
| Öncelik Sırasını Kaydet / Varsayılan Öncelikleri Yükle | Öncelik listesini yazar | yukarıda | Önce |
| Varsayılan paket Kaydet / Varsayılanı kaldır | Anında | yukarıda | Önce |
| Yapışkan çubuk Kaydet | Kargo Seçimi + Kapıda Ödeme + Müşteri Görünümü değişikliklerini birlikte kaydeder | "Kargo motoru ayarları kaydedildi" | Önce (üç kartın değişikliklerini tek özette) |
| Yapışkan çubuk İptal | Sayfayı yeniler; kaydedilmemiş tüm değişiklikler gider | — | — |

## Yan etkiler (vitrin / sipariş)
- **Ödeme adımı (checkout)**: müşteri adres girince aktif taşıyıcının sunduğu kargo seçenekleri fiyatlarıyla listelenir.
  Seçenekler ve fiyatlar strateji, öncelik/hariç tutulan firmalar, fiyat kuralları ve paket ölçüsüne göre hesaplanır.
  - Fiyat alınamazsa müşteri "Kargo seçeneği bulunamadı" görür ve **sipariş tamamlayamaz**.
  - Ücretsiz kargo kuralı eşleşen siparişte seçenekler "Ücretsiz" görünür.
  - Ağırlık/bölge ek ücretleri müşteri fiyatına eklenir.
  - "Kargo Firma Adını Göster" / "Tahmini Teslimat Süresini Göster" kapalıysa ilgili bilgi ödeme sayfasında görünmez
    (firma adı için doğrulanmadı).
  - Kapıda ödeme açıksa ve sipariş tutarı min/maks aralığındaysa ödeme seçeneği olarak sunulur, ücret eklenir; vitrin
    "Kapıda ödeme yalnızca PTT Kargo ile kullanılabilir." notunu gösterir.
- **Sipariş sonrası**: "Otomatik Kargo" açıksa onaylanan siparişte kargo otomatik oluşturulur (Canlı modda gerçek gönderi ve
  Geliver bakiyesinden ücret). "Kargoyu otomatik onayla" kapalı veya strateji "Manuel" ise kargo teklifi satıcı onayını bekler.
- Taşıyıcı pasif/kaldırılmışsa yeni siparişlerde o taşıyıcıdan fiyat gelmez (doğrulanmadı: tek taşıyıcıda checkout'ta
  seçenek kalmaz).
- Bakiye düşük/kritik eşiğe inince satıcıya uyarı bildirimi gider (bildirim şablonları: [notifications.md](notifications.md)).
- Kargo durum değişiklikleri müşteriye bildirim şablonlarıyla (Kargoya Verildi, Dağıtıma Çıktı, Teslimat Başarısız…) gider.

## Tuzaklar
- Yeni eklemede **Test Ortamı Modu açık** gelir: prod mağazada kullanıcı gerçek gönderi istiyorsa kapatılması gerekir —
  her zaman özette "Mod: Test/Canlı" satırı göster, varsayılanı kullanıyorsan "varsayılan" diye işaretle.
- Kargo Seçimi, Kapıda Ödeme ve Müşteri Görünümü kartlarının kendi kaydet butonu yok; **yapışkan çubuktaki Kaydet** üçünü
  birden kaydeder. Öncelik listesi, varsayılan paket ve fiyat kuralları ise kendi butonlarıyla **ayrı** kaydolur.
- Yapışkan çubukta "İptal" sayfayı yeniler — kaydedilmemiş başka kart değişikliklerini de siler.
- Varsayılan taşıyıcı kaldırılamaz; önce başka birini varsayılan yap.
- Kural Aktif switch'i ve silme anında uygulanır.
- Tutar alanları TL cinsindendir (ondalık ayırıcı nokta).
- Otomatik Kargo'yu açmak gerçek maliyet doğurur — kullanıcı açıkça istemedikçe açma.

## Doğrulama
1. Taşıyıcı: toast + satırda Durum "Aktif", API Anahtarı "Ayarlı", Mod beklenen değer, varsayılan yıldızı.
2. Kullanıcı onayıyla "Bağlantı Testi" → başarılı toast.
3. "Kontrol Et" → "Kargo fiyatları çalışıyor — N kargo seçeneği bulundu."
4. Kural: listede ad, tip, tarih rozeti, Aktif switch durumu.
5. Motor ayarları: toast "Kargo motoru ayarları kaydedildi" → sayfayı yenile, seçimler korunmuş.
6. Gerekirse vitrinde sepete ürün ekleyip ödeme adımında kargo seçeneklerini gözlemle (sipariş tamamlama yok).
