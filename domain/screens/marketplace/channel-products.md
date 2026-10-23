# Kanal Ürünleri ve Gönderim (Channel Products)
- URL: {ADMIN_URL}/marketplace/<kanal>/products — `<kanal>` ∈ `trendyol` | `amazon` | `n11` | `hepsiburada`
- Menü yolu: Kanal panosu ([channel.md](channel.md)) → sekme **"Ürünler / Products"** ya da "Ürünleri {kanal} Kanalına Gönder".
- Sayfa başlığı (h2): "Ürünler — {kanal} / Products — {kanal}"; açıklama "Ürünleri {kanal} kanalına gönderin veya içe aktarın."
- Amaç: LeanCart kataloğundaki ürünlerin kanaldaki durumunu görmek, hazırlık sorunlarını okumak, ürün bazında komisyon belirlemek ve seçili ürünleri pazaryerine **göndermek**.
- Entity: [../../entities/marketplace-channel.md](../../entities/marketplace-channel.md) (§Kanal ürünü), [../../entities/product.md](../../entities/product.md).
- Yetki: liste/durum `marketplace:read`; hazırlık kontrolü, gönderim ve komisyon kaydı `marketplace:write` (hazırlık kontrolü yetkisizse sütun yalnız barkoda göre gösterilir — doğrulanmadı).

## Ön koşullar ve bağımlılıklar
1. Kanal **Bağlı** ([channel.md](channel.md) başlık rozeti) ve ortam (Canlı/Test) biliniyor ([../settings/marketplace.md](../settings/marketplace.md) Mod sütunu).
2. Ürün gerekleri (Trendyol hazırlık kuralları; diğer kanallar için de pratikte geçerli):
   - **Barkod** dolu ve ≤40 karakter (ürün formu "Kimlik" sekmesi, [../products/product-edit.md](../products/product-edit.md)).
   - En az bir **kategori** ve birincil kategorinin **kanal eşlemesi** ([channel-categories.md](channel-categories.md)).
   - **Marka** ve markanın kanal eşlemesi (Trendyol). Ürün formunda marka alanı henüz yok (geliştiriliyor) → Trendyol'da "Marka yok" hatası beklenir; kullanıcıya bildir.
   - Fiyat > 0; karşılaştırma (liste) fiyatı varsa satış fiyatından düşük olamaz.
   - Uyarı (engellemez): görsel yok; başlık 100 karakterden uzun.
   - Kategorinin zorunlu kanal özellikleri ürünün özel niteliklerinde dolu (bkz. [channel-categories.md](channel-categories.md) §Kurallar).
3. Stok: kanala gönderilen miktar **satılabilir stok − stok güvenlik tamponu**dur ([../../entities/stock.md](../../entities/stock.md)).

## Yerleşim
1. Başlık; sağda **"{kanal} Kanalından İçe Aktar / Import from {kanal}"** (indirme ikonlu) ve **"{kanal} Kanalına Gönder ({n}) / Push to {kanal} ({n})"** (yükleme ikonlu; seçim yokken pasif).
2. Kart **"Ürün Kataloğu / Product Catalog"** + arama "İsim, SKU, barkod ile ara... / Search by name, SKU, barcode..." (yazdıktan ~0.4 sn sonra arar, 1. sayfaya döner).
3. Tablo (sayfa başına 20 ürün; tüm katalog — durumdan bağımsız):
   | Sütun (tr / en) | İçerik |
   |---|---|
   | ☐ (başlıkta "Tümünü seç / Select all") | Sayfadaki tüm ürünleri seçer/bırakır |
   | Ürün / Product | Görsel (tıklayınca önizleme) + ad |
   | SKU | |
   | Barkod / Barcode | yoksa sarı "Barkod yok / No barcode" |
   | Fiyat / Price | Satış fiyatı (indirimli fiyat varsa o) |
   | Stok / Stock | |
   | Komisyon / Commission | "{oran}%" + kaynak harfi rozeti: **V** Varsayılan (gri), **K** Kategori (mavi), **Ü** Ürün (turuncu). Tıklanınca açılır pencere |
   | Net Gelir / Net Revenue | Fiyat − komisyon; zarar → kırmızı ("Bu fiyatta zarar!"), marj < %5 → sarı ("Düşük kâr marjı"), aksi ipucu "%{oran} komisyon sonrası" |
   | Durum / Status | LeanCart durumu: "Yayında / Published", "Taslak / Draft", "Arşiv / Archived" |
   | {kanal} Durumu / {kanal} Status | "Gönderilmedi / Not Sent", "Gönderiliyor / Sending" (sarı), "Listelendi / Listed" (yeşil), "Hata / Error" (kırmızı; üzerine gelince hata metni) |
   | Hazırlık / Readiness | "Hazır / Ready" (yeşil) ya da "{n} sorun / {n} issues" (hata varsa kırmızı, yalnız uyarı varsa sarı; üzerine gelince sorun listesi) |
4. Sayfalama (birden çok sayfa varsa): "Sayfa {p} / {toplam}", "Önceki / Previous", "İleri / Next".
5. Boş: "Ürün bulunamadı. Önce kataloğunuza ürün ekleyin."; yükleniyor: "Ürünler yükleniyor...".

### Hazırlık sorunları (rozet ipucu metinleri)
| Kod | tr / en | Tür |
|---|---|---|
| MISSING_BARCODE | Barkod yok / No barcode | hata |
| BARCODE_TOO_LONG | Barkod çok uzun / Barcode too long (>40) | hata |
| NO_CATEGORY | Kategori yok / No category | hata |
| CATEGORY_NOT_MAPPED | Kategori eşleşmemiş / Category not mapped | hata |
| NO_BRAND | Marka yok / No brand | hata |
| BRAND_NOT_MAPPED | Marka eşleşmemiş / Brand not mapped | hata |
| INVALID_PRICE | Fiyat hatalı / Invalid price | hata |
| LIST_PRICE_BELOW_SALE_PRICE | Liste fiyatı satış fiyatından düşük | hata |
| NO_IMAGES | Resim yok / No images | uyarı |
| TITLE_TOO_LONG | Başlık çok uzun / Title too long (>100) | uyarı |

- Kanal kurallarına göre hazırlık kontrolü **yalnız Trendyol'da** yapılır. Amazon, Hepsiburada, N11'de sütun yalnız barkoda bakar (barkod varsa "Hazır", yoksa "Barkod yok"); bu kanalların kendi zorunlulukları gönderimden sonra kanal durumunda hata olarak görünür.

### Komisyon açılır penceresi (satırdaki komisyon rozetine tıklayınca)
| Label (tr / en) | Kontrol | Validasyon | Locator | Not |
|---|---|---|---|---|
| Geçerli oran / Effective rate: {n}% · Kaynak / Source: {Varsayılan/Kategori/Ürün} | bilgi | — | — | |
| Ürün için özel oran: / Product override: | number Input + "%" | 0–100, adım 0.1 | `#commission-<ürünId>` ya da label | Yüzde olarak gir (`12` = %12) |
| Kaydet / Save | Buton | — | rol button "Kaydet" (pencere içinde) | Ürüne özel kuralı oluşturur/günceller |
| Varsayılana dön / Reset to default | Buton (yalnız ürüne özel kural varsa) | — | | Ürüne özel kuralı siler; kategori/varsayılan oran geçerli olur |

### Gönderim sihirbazı ("{kanal} Kanalına Gönder — Adım {s} / {toplam}")
| Adım | Trendyol / Hepsiburada / N11 (3 adım) | Amazon (4 adım) |
|---|---|---|
| 1 | "Seçilen ürünleri gözden geçirin." — "{n} ürün seçildi" + özet tablo: Ürün, Satış Fiyatı, Komisyon (%), Komisyon (tutar), Net Gelir, Marj (zarar → kırmızı + "!", <%5 → sarı) | Aynı |
| 2 | "Hazırlık durumunu kontrol edin ve sorunları düzeltin." | "Ürünleri Amazon kataloğuyla eşleştirin (ASIN araması)." — "Amazon Kataloğu ile Eşleştiriliyor" / "Ürünler barkod/EAN ile mevcut ASIN'lere eşleştirildi." |
| 3 | "Onaylayın ve {kanal} kanalına gönderin." — "{n} ürün gönderilmeye hazır" | "Hazırlık durumunu kontrol edin…" |
| 4 | — | "Onaylayın ve Amazon kanalına gönderin." |
- Alt butonlar: "Geri / Back" (adım > 1), "İleri / Next", son adımda **"{kanal} Kanalına Gönder ({n})"** (gönderirken "Ürünler gönderiliyor...").

## Aksiyonlar
| Aksiyon | Ne olur | Toast |
|---|---|---|
| Satır kutuları / Tümünü seç | Seçim; sayaç butonda (n). Seçim sayfa değiştirince korunur | — |
| {kanal} Kanalına Gönder (n) → sihirbaz → son adım butonu | Seçili ürünler kanala gönderim kuyruğuna alınır; kanal durumu "Gönderiliyor" → sonuç "Listelendi" ya da "Hata". Daha önce gönderilmiş (eşlenmiş) ürün **güncellenir**, gönderilmemiş ürün **yeni ilan** olarak oluşturulur | Başarı: "{n} ürün {kanal} kanalına başarıyla gönderildi" (işin kabul edildiğini gösterir; sonuç sonradan durum sütununda); hata: "Ürünler gönderilemedi. Lütfen tekrar deneyin." |
| Komisyon → Kaydet / Varsayılana dön | Ürüne özel komisyon kuralı kaydı/silinmesi — anında | "Komisyon kaydedildi / Commission saved"; hata "Komisyon kaydedilemedi. Lütfen tekrar deneyin." |
| {kanal} Kanalından İçe Aktar | Kanal ürünlerini LeanCart'a aktarma — **geliştiriliyor**; şu an işlem yok. İçe aktarılanlar [channel-pending.md](channel-pending.md) kuyruğuna düşer | — |
| Yükleme hatası | — | "Ürünler yüklenemedi. Lütfen tekrar deneyin." |

Ekranda **kanaldan kaldırma / ilanı kapatma**, **elle fiyat güncelleme** ve **toplu stok gönderme** aksiyonu **yok**:
- İlanı kanaldan kaldırma/arşivleme: pazaryeri satıcı panelinden kullanıcı yapar. LeanCart'ta ürünü arşivlemek ilanı kendiliğinden kaldırmaz (doğrulanmadı) — kullanıcıya bildir.
- Fiyat değişikliği: LeanCart'ta ürün fiyatını değiştirip ürünü yeniden **Gönder** (güncelleme olarak gider).
- Stok: stok değiştikçe otomatik gider (bkz. Yan etkiler).

## Onay zamanlaması
| Aksiyon | Kalıcı / ne zaman | Geri alınabilir mi | Dış sisteme yazma | Onay |
|---|---|---|---|---|
| **Kanala Gönder (son adım butonu)** | Butona basınca; iş arka planda sürer | **Hayır** (pazaryeri kurallarına bağlı): yeni ilan pazaryerinde oluşur, Trendyol/Hepsiburada'da kanal onayına girer; silmek/kapatmak satıcı panelinden yapılır. Güncellemede eski ilan bilgisi (fiyat, stok, başlık, görsel, özellikler) üzerine yazılır | **Evet — pazaryeri (Trendyol/Amazon/n11/Hepsiburada)**; Canlı ortamda ürün gerçek alıcılara satışa açılır | **Kural 5 — ayrı onay**, etkilenen ürün sayısı (butondaki n) ile. Özet: ortam (Canlı/Test), kanal, ürün sayısı, yeni ilan / güncelleme ayrımı ("{kanal} Durumu" sütunundan: Gönderilmedi = yeni, Listelendi/Hata = güncelleme), her ürün için fiyat, gönderilecek stok (stok − tampon), komisyon ve marj; zarar/düşük marjlı ve hazırlık hatalı ürünleri ayrı satırda belirt |
| Komisyon → Kaydet / Varsayılana dön | Anında | Evet (yeniden düzenlenir) | Hayır (LeanCart içi) | Kaydet'e basmadan önce: ürün, eski → yeni oran |
| Sihirbaz Geri/İleri, seçim, arama | Kalıcı değil | — | — | — |

- Onay özetindeki sayı, **butondaki (n)** değeridir; sihirbazın 1. adımındaki tablo yalnız o an açık sayfadaki seçili ürünleri listeler. İki sayı farklıysa kullanıcıya hangi ürünlerin gönderileceğini tek tek listele.
- Toplu gönderimde kanalın tek seferde kabul ettiği üst sınır vardır (Trendyol/Hepsiburada 1000, N11 500, Amazon 10); büyük gönderimi parçalara bölmek gerekirse her parça ayrı onay.

## Yan etkiler
- **Stok senkronu (otomatik):** bir SKU'nun satılabilir stoğu değişince (sipariş, iade, stok düzeltme, transfer) birkaç saniye içinde bağlı **tüm aktif kanallara** "stok − tampon" (0'ın altına inmez) gönderilir. Bu, gönderim butonuna basılmadan da olur — stok düzeltme işlerinde ([../../../playbooks/stock-adjust.md](../../../playbooks/stock-adjust.md)) özetlere "bağlı pazaryerlerinde stok da değişir" yaz.
- Gönderilen ürünün kanal tarafı durumu: Trendyol'da ilan önce incelemeye girer (onay bekliyor / görsel gerekli / revizyon gerekli / onaylandı / reddedildi / kilitli). Bu ekranda yalnız "Gönderiliyor / Listelendi / Hata" görünür; ayrıntı satıcı panelinde.
- Komisyon değişikliği net gelir ve marj sütunlarını hemen günceller.

## Tuzaklar
- Hazırlıkta **hata** rozetli ürünleri göndermeden önce düzelt (barkod, kategori eşleme, fiyat); Trendyol hazır olmayan ürünleri kabul etmez / gönderimde atlanır (doğrulanmadı).
- Taslak ve arşiv durumundaki ürünler de listede ve seçilebilir; kullanıcı açıkça istemedikçe yalnız "Yayında" ürünleri gönder ve özette durum sütununu göster.
- Varsayılan komisyon (V) kategori ya da ürün kuralı yoksa kanal varsayılanıdır; [../settings/marketplace.md](../settings/marketplace.md)'deki "Varsayılan Komisyon Oranı" ile aynı olduğunu varsayma, rozetteki oranı oku.
- Amazon sihirbazındaki ASIN adımı bilgi amaçlıdır; eşleşme sonucu ayrıca listelenmez (doğrulanmadı).
- Fiyat sütunu ürün para birimindedir; Amazon'da kanal para birimi farklı olabilir (USD/EUR/GBP) — kullanıcıya sor.

## Doğrulama
1. Başarı toast'ı.
2. Sayfayı yenile → seçili ürünlerin "{kanal} Durumu" "Gönderiliyor"; birkaç dakika sonra "Listelendi" ya da "Hata" (hatanın metni rozet ipucunda). Süre kanala bağlı (doğrulanmadı).
3. Kanal panosunda "Listelenen Ürünler" sayısı.
4. Raporda: gönderilen ürün sayısı, hata alanlar ve hata metinleri, kullanıcının satıcı panelinde kontrol etmesi gerekenler (kanal onayı).
