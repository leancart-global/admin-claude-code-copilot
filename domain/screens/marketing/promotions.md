# Promosyonlar (liste, oluştur, detay/düzenle)
- URL'ler:
  - {ADMIN_URL}/marketing/promotions — liste
  - {ADMIN_URL}/marketing/promotions/new — oluştur
  - {ADMIN_URL}/marketing/promotions/{id} — detay = düzenleme formu (ayrı salt okunur detay yok)
  - {ADMIN_URL}/marketing/promotions/{id}/edit — yalnız yönlendirme: "Yönlendiriliyor... / Redirecting..." yazar ve
    geçmişe kayıt bırakmadan `/marketing/promotions/{id}`'ye gider.
- Menü yolu: Sol menü "Pazarlama / Marketing" → "Promosyonlar / Promotions".
- Sayfa başlıkları: liste kartı "Promosyonlar / Promotions" (+ kayıt sayısı rozeti), açıklama "İndirim promosyonları
  oluşturun; kupon kodları indirimini buradan alır."; oluştur "Yeni Promosyon / New Promotion" ("İndiriminizi
  tanımlayın; kupon kodlarını sonra bu promosyona bağlayabilirsiniz."); detayda promosyon adı + durum rozeti, alt yazı
  "Bu promosyonun indirimini, tarihlerini ve kullanım sınırlarını güncelleyin."
- Amaç: İndirimin **kendisini** tanımlamak — ne kadar (yüzde / tutar / ücretsiz kargo), hangi sepet tutarından itibaren,
  hangi tarihler arasında, toplam ve müşteri başına kaç kez. Müşteri bu indirimi **kupon kodu** girerek alır; kod
  [Kuponlar](coupons.md) ekranında bu promosyona bağlanır.
- Entity: [../../entities/promotion.md](../../entities/promotion.md); kupon: [../../entities/coupon.md](../../entities/coupon.md).
  Playbook: [../../../playbooks/promotion-create.md](../../../playbooks/promotion-create.md).
- Yetki: liste `marketing:view`; "Yeni Promosyon" ve `/new` `marketing:create` (yoksa sayfa listeye yönlendirir);
  detay/düzenle, Yayınla, Duraklat `marketing:update` (yoksa detay sayfası listeye yönlendirir — yalnız `view` yetkisi
  olan kullanıcı promosyonu yalnız listede görür); Sil `marketing:delete`.
- Veri / API (public): `GET/POST /promotions`, `GET/PATCH/DELETE /promotions/{id}`, `POST /promotions/{id}/activate`,
  `POST /promotions/{id}/deactivate`.

## Ön koşullar ve bağımlılıklar
- Ön koşul kayıt yok. Para birimi alan sonekleri mağaza para biriminden gelir.
- **Mağaza saat dilimi** (Ayarlar → Genel): tarih alanları mağaza saatine göre okunur. Saat dilimi seçilmemişse formda
  "Bu mağaza için saat dilimi seçilmemiş, bu yüzden saatler UTC olarak okunuyor…" uyarısı çıkar → kullanıcıya bildir
  ([../settings/general.md](../settings/general.md)). Saat dilimi yüklenirken kaydet butonları pasiftir.
- **Etkiledikleri:** [Kuponlar](coupons.md) (kupon oluşturmak için önce promosyon gerekir; kupon Taslak, Planlandı,
  Yayında ya da Duraklatıldı durumundaki promosyona bağlanabilir), sepet/ödeme adımındaki indirim, sipariş toplamı
  ve sipariş "İndirim" satırı ([../orders/order-detail.md](../orders/order-detail.md)).
- Segment, ürün, kategori, müşteri kısıtları bu ekranda **seçilmez** (bkz. Tuzaklar). Segment haritası:
  [../customers/segments.md](../customers/segments.md).

## Yerleşim
### Liste (`/marketing/promotions`)
1. Kart başlığı + rozet (filtrelenmiş kayıt sayısı) + sağda "Yeni Promosyon / New Promotion" (`data-testid="promotion-new-button"`).
2. Filtre çubuğu: arama (placeholder "Promosyon adı ara... / Search promotion name...", `data-testid="promotion-search-input"`),
   Durum Select ("Tüm durumlar / All statuses" + 6 durum, `data-testid="promotion-status-filter"`), Tür Select
   ("Tüm türler / All types" + Yüzde İndirim, Tutar İndirimi, Ücretsiz Kargo; `data-testid="promotion-type-filter"`).
   Filtreler URL'ye yazılır (`?search=&status=&type=&page=`). Aktifse "Aktif filtreler:" rozetleri + "Filtreleri temizle".
3. Tablo sütunları: "Promosyon / Promotion" (ad + açıklama; tıklanınca detay), "İndirim / Discount" (ör. "%20", "₺50",
   "Ücretsiz kargo", değer yoksa "—"; altında tür adı), "Durum / Status" (rozet, `data-testid="promotion-status-{durum}"`),
   "Tarih Aralığı / Date range" ("1 Kas 2026 → 30 Kas 2026"), "Kullanım / Usage" ("12 / 500" ya da "12 / Sınırsız"), "⋯".
   Satır: `data-testid="promotion-row-{id}"`, ad `promotion-name-{id}`. Sayfa başına 20 satır, "Önceki/Sonraki".
4. Satır menüsü (⋯, aria-label "İşlemler / Actions"): "Görüntüle / View", "Düzenle / Edit"
   (`promotion-edit-action-{id}`), "Yayınla / Publish" (yalnız Taslak, Planlandı, Duraklatıldı;
   `promotion-publish-action-{id}`), "Duraklat / Pause" (yalnız Yayında; `promotion-pause-action-{id}`),
   "Sil / Delete" (`promotion-delete-action-{id}`).
5. Boş durum (hiç kayıt, filtre yok): "Henüz promosyonunuz yok" + açıklama ("Promosyon, indirimin kendisidir… kupon
   oluşturabilmek için önce bir promosyon gerekir.") + "İlk promosyonu oluştur". Filtre sonucu boşsa "sonuç yok" metni.

### Oluştur / Detay formu (tek sayfa, üç kart + yapışkan alt çubuk)
- Üstte "← Promosyonlara dön / Back to promotions".
- Kart 1 "Promosyon Bilgileri / Promotion details"; Kart 2 "İndirim / Discount"; Kart 3 "Geçerlilik Tarihleri / Validity
  dates" + "Kullanım Sınırları / Usage limits".
- Alt çubuk (sayfanın en altında sabit): "İptal / Cancel" (geri gider, kaydetmez), oluştur modunda "Taslak Kaydet / Save
  as draft" (`data-testid="promotion-save-draft"`), düzenleme modunda aynı buton "Kaydet / Save"; "Yayınla / Publish"
  (`data-testid="promotion-publish"`) — promosyon zaten **Yayında** ise gösterilmez.
- Validasyon hataları alan altında kırmızı metin (`role="alert"`) + toast "Hata — Lütfen formdaki hataları düzeltin."

## Alanlar
| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Promosyon Bilgileri | Promosyon adı * / Promotion name * | Input | evet (taslakta da) | ≤200; boşsa "Promosyona bir ad verin." | `#promotion-name`, placeholder "Örn. Yaz İndirimi" | "Bu ad yalnızca yönetim panelinde görünür, müşterileriniz görmez." |
| 〃 | Açıklama / Description | Textarea | hayır | ≤1000 | `#promotion-description` | İç not |
| İndirim | İndirim türü * / Discount type * | RadioGroup (3 seçenek) | evet | varsayılan Yüzde İndirim | `#promotion-type-percentage`, `#promotion-type-fixed_amount`, `#promotion-type-free_shipping` (ya da `getByLabel('Yüzde İndirim')`) | "Yüzde İndirim / Percentage discount" ("Sepet tutarının belirlediğiniz yüzdesi kadar indirim yapılır."), "Tutar İndirimi / Fixed amount off" ("Sepetten sabit bir tutar düşülür."), "Ücretsiz Kargo / Free shipping" ("Kargo ücreti alınmaz…"). Tür değişince ilgili değer alanları değişir |
| 〃 (Yüzde) | İndirim yüzdesi (%) * / Discount percentage (%) * | number, adım 1 | yayında evet | 1–100 ("İndirim yüzdesi 1 ile 100 arasında olmalı.") | `#promotion-discount-percentage`, placeholder "Örn. 20" | 20 = %20 |
| 〃 (Yüzde) | En fazla indirim tutarı / Maximum discount amount | number, adım 0.01 | hayır | ≥0; boş = sınırsız | `#promotion-max-discount` (placeholder para birimi) | Yüzde indirimin üst sınırı. Yalnız yüzde türünde kaydedilir |
| 〃 (Tutar) | İndirim tutarı * / Discount amount * | number, adım 0.01 | yayında evet | >0 ("İndirim tutarı 0'dan büyük olmalı.") | `#promotion-discount-amount` | Sepetten düşülen sabit tutar; uygun sepet tutarını aşamaz |
| 〃 (Ücretsiz Kargo) | — (bilgi notu) | metin | — | — | `data-testid="promotion-free-shipping-note"` | Değer girilmez; indirim = kargo ücreti |
| 〃 | En az sepet tutarı / Minimum cart total | number, adım 0.01 | hayır | ≥0; boş = alt sınır yok | `#promotion-min-purchase` | Sepet ara toplamı bu tutarın altındaysa kod reddedilir |
| Geçerlilik Tarihleri | Başlangıç tarihi * / Start date * | `datetime-local` | evet (taslakta da) | "Başlangıç tarihi girin." Oluştururken seçici şimdiden önceki saati önermez | `#promotion-start-date`; `fill('2026-11-01T00:00')` | Mağaza saat diliminde ("Saatler mağazanın saat dilimine göre ({timeZone}).") |
| 〃 | Bitiş tarihi * / End date * | `datetime-local` | evet (taslakta da) | > başlangıç ("Bitiş tarihi, başlangıç tarihinden sonra olmalı.") | `#promotion-end-date` | Bitişten sonra kod "süresi doldu" hatası verir |
| Kullanım Sınırları | Toplam kullanım sınırı / Total usage limit | number, tam sayı | hayır | boş = Sınırsız; girilecekse ≥1 | `#promotion-usage-limit`, placeholder "Sınırsız" | Tüm müşteriler, tüm bağlı kuponlar toplamı |
| 〃 | Müşteri başına sınır / Limit per customer | number, tam sayı | hayır | boş = Sınırsız; girilecekse ≥1 | `#promotion-usage-limit-per-customer` | Aynı müşteri bu promosyondan (hangi kuponla olursa olsun) kaç kez yararlanır |

Ekranda **olmayan** alanlar (sistemde var, bu formdan ayarlanamaz): kapsam (ürün / kategori / müşteri / segment),
tetikleme (kuponlu / otomatik), birleştirme (stacking) ve öncelik, en az ürün adedi, kademeler, Al-Kazan / paket
ayarları, store view kısıtı. Bkz. [entity](../../entities/promotion.md#ekranda-olmayan-ayarlar).

## Aksiyonlar
| Buton | Ne olur | Toast / sonuç |
|---|---|---|
| Yeni Promosyon | `/marketing/promotions/new` açılır | — |
| Taslak Kaydet (oluştur) | Ad + tür + iki tarih yeterli; promosyon **Taslak** oluşur; indirim değeri boş olabilir | "Başarılı — Promosyon oluşturuldu."; detaya (`/marketing/promotions/{id}`) gider |
| Yayınla (oluştur) | Tam validasyon (indirim değeri dahil); promosyon **Yayında** olarak oluşur | "Promosyon oluşturuldu." + "Promosyon yayına alındı."; detaya gider |
| Kaydet (detay) | Değişiklikleri yazar; promosyon Yayında ise tam validasyon uygulanır, değilse taslak validasyonu; durum değişmez | "Promosyon güncellendi."; aynı sayfada kalır |
| Yayınla (detay; Taslak/Planlandı/Duraklatıldı) | Önce değişiklikleri kaydeder, sonra Yayında yapar | "Promosyon güncellendi." + "Promosyon yayına alındı." |
| İptal | Geri gider; kaydetmez | — |
| ⋯ → Yayınla (liste) | **Diyalogsuz, anında** Yayında | "Promosyon yayına alındı." |
| ⋯ → Duraklat (liste) | **Diyalogsuz, anında** Duraklatıldı; bağlı kuponlar indirim vermez | "Promosyon duraklatıldı." |
| ⋯ → Sil → "Promosyonu sil" diyaloğu ("Bu promosyon silindiğinde geri alınamaz. Buna bağlı kupon kodları da çalışmayı durdurur; müşteriler kodu girdiğinde geçersiz uyarısı alır." + ad) → "Sil" | Promosyon listeden kalkar, geri getirilemez | "Promosyon silindi." |

Durum geçişleri (bu ekrandan): Taslak → Yayında (Yayınla), Yayında → Duraklatıldı (Duraklat), Duraklatıldı/Planlandı →
Yayında (Yayınla). "Planlandı", "Süresi Doldu", "Tamamlandı" bu ekrandan seçilmez; listede ve filtrede görünebilir.
Yayında olan promosyon formdan Taslağa döndürülemez; durdurmak için listeden **Duraklat**.

## Onay zamanlaması (kural 2/5/6)
- **Taslak Kaydet (oluştur)**: kalıcı kayıt ama müşteriye etkisi yok → özet + onay.
- **Yayınla (oluştur / detay / liste)**: indirim, bu promosyona bağlı **tüm kuponlarda** hemen geçerli olur (tarih aralığı
  başladıysa). Özette: tür + değer, en az sepet tutarı, tarih aralığı (mağaza saat dilimiyle), kullanım sınırları,
  **bağlı kupon sayısı** ([Kuponlar](coupons.md) listesinde promosyon filtresi yoktur; "Promosyon" sütunundan say, sayamazsan "kontrol edilmedi").
- **Liste ⋯ → Yayınla / Duraklat**: diyalogsuz, tıklandığı anda kaydeder → onayı menüye tıklamadan **önce** al.
  Duraklatma, kuponu elinde olan müşterilerin kodunun reddedilmesine yol açar; özette belirt.
- **Kaydet (Yayında promosyon)**: değişiklik **anında canlı** — sepette/ödemede bu promosyonun kuponunu kullanan
  müşteriler yeni değeri görür. Taslak yok; özetinde "canlı promosyon" yaz, eski → yeni değer tablosu ver.
- **Sil**: geri alınamaz → ayrı onay; özette promosyon adı, durumu, kullanım sayısı ("Kullanım" sütunu) ve **çalışmaz
  hale gelecek bağlı kupon sayısı**. Geri alınabilir alternatif: **Duraklat**.
- Bu ekran müşteriye e-posta/bildirim göndermez, dış sisteme yazmaz. (Kupon kodlarını dağıtmak ayrı iştir:
  [Kuponlar](coupons.md), e-posta kampanyaları.)

## Yan etkiler
- Promosyon vitrinde kendi başına görünmez (rozet, banner, ürün fiyatı değişmez). İndirim, müşteri sepette ya da ödeme
  adımında bağlı bir **kupon kodu** girdiğinde hesaplanır; admin'den sipariş oluştururken "Kupon Kodu" alanına girilen
  kodun indirime dönüşüp dönüşmediği doğrulanmadı; kaydettikten sonra sipariş detayında "İndirim" satırını kontrol et ([../orders/order-create.md](../orders/order-create.md)).
- Yüzde/tutar indirimi ürünlerin o anki satış fiyatı (indirimli fiyat aktifse o) üzerinden hesaplanır; ücretsiz kargo
  kargo ücretini sıfırlar ve ürün tutarlarına dokunmaz. Ayrıntı: [entity](../../entities/promotion.md#sipariş-toplamına-etkisi).
- "Kullanım" sayacı sipariş verildikçe artar; iptal / tam iadede kullanım geri verilir ([../../entities/order.md](../../entities/order.md)).
- Silinen ya da duraklatılan promosyonun kuponları müşteriye "geçersiz" / "aktif değil" hatası verir.

## Tuzaklar
- **Kupon olmadan indirim çalışmaz.** Bu ekrandan oluşturulan promosyon kupon koduyla tetiklenir; promosyonu
  yayınlamak tek başına sepete indirim uygulamaz. Kullanıcı "kodsuz / herkese otomatik" istiyorsa söyle:
  otomatik promosyon bu ekrandan kurulamaz; sepet tutarına bağlı kodsuz ücretsiz kargo için kargo kuralı
  ([../settings/shipping-carriers.md](../settings/shipping-carriers.md), "Ücretsiz Kargo" kuralı) kullanılabilir.
- **Kapsam seçilmez.** İndirim tüm sepete uygulanır; "yalnız tişörtler", "şu markada", "VIP segmentine" gibi kısıtlar bu
  formda yok. Kullanıcıya alternatifi sor (ürün bazında indirimli fiyat, kupon tarafındaki müşteri kısıtları —
  [coupons.md](coupons.md)). API ile kurmak kural 3 gereği yapılmaz.
- **Al-Kazan, Kademeli, Paket, Fırsat Satışı, Hediye Ürün** türleri sistemde tanımlı ve listede görünebilir ama bu
  formdan oluşturulamaz; böyle bir promosyon formda "Yüzde İndirim" seçili açılır ve "Kaydet" türünü değiştirir →
  bu türdeki promosyonları formdan kaydetme, kullanıcıya bildir.
- **Durum ve tarih ayrı kontrol edilir.** İndirim için promosyon hem **Yayında** olmalı hem de şu an başlangıç–bitiş
  aralığında olmalı. Başlangıcı ileri tarihli promosyon "Yayınla" ile Yayında görünür ama başlangıca kadar kod
  "henüz başlamadı" hatası verir. Bitiş geçmişse kod "süresi doldu" hatası verir.
- Tarihler mağaza saat dilimindedir; kullanıcının "1 Kasım'dan itibaren"ini `2026-11-01T00:00` olarak gir ve özette
  saat dilimini yaz. Bitiş "30 Kasım dahil" ise `2026-11-30T23:59`.
- Kullanım sınırına 0 yazma; sınırsız için boş bırak.
- Yüzde türünde "En fazla indirim tutarı", tutar türünde girilen değer, tür değiştirildiğinde kaydedilmez (yalnız seçili
  türün değerleri gider).
- Detay sayfası `marketing:update` ister; yalnız görüntüleme yetkisiyle detay açılmaz, listeye döner.
- `/edit` URL'si yalnız yönlendirmedir; doğrudan detay URL'sini kullan.

## Doğrulama
1. Toast ("Promosyon oluşturuldu." / "güncellendi." / "yayına alındı." / "duraklatıldı." / "silindi."). Toast
   görünmezse listeyi yenileyip kaydın durumunu kontrol et.
2. Oluşturmada URL `/marketing/promotions/{id}`; başlıkta ad + durum rozeti ("Taslak" / "Yayında").
3. Listede satır: İndirim sütunu (ör. "%20" / "₺50" / "Ücretsiz kargo"), Durum rozeti, Tarih Aralığı, Kullanım
   ("0 / Sınırsız" veya "0 / {sınır}").
4. Detay formunda ad, tür, değer, en az sepet tutarı, tarihler ve toplam kullanım sınırını özetle karşılaştır.
5. Müşteri tarafı etkisi için kupon gerekir: bağlı kupon yoksa raporda "kupon oluşturulmadı — indirim henüz kimseye
   uygulanmaz" yaz ve [kupon oluşturmayı](coupons.md) öner.
