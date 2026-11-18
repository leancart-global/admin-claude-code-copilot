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
- Amaç: İndirimin **kendisini** tanımlamak — ne kadar (yüzde / tutar / ücretsiz kargo / kademeli / paket / Al-Kazan),
  hangi ürünlere, hangi sepet tutarından itibaren, hangi tarihler arasında, toplam ve müşteri başına kaç kez. Müşteri
  indirimi ya **kupon kodu** girerek alır (kod [Kuponlar](coupons.md) ekranında bu promosyona bağlanır) ya da kademeli /
  paket / Al-Kazan türlerinde **ödemede otomatik** alır (bkz. "Müşteri nasıl yararlanır").
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
- Ürün kapsamı (Yüzde, Tutar, Kademeli, Al-Kazan) ve paket ürünleri **mağaza kataloğundan** seçilir → ürünler önce
  var olmalı ([../products/product-create.md](../products/product-create.md)); ürün araması ürün okuma yetkisi ister
  (yoksa seçici "Ürünleri görme izniniz yok. Mağaza sahibinden erişim isteyin." der).
- Segment, kategori, müşteri kısıtları bu ekranda **seçilmez** (bkz. Tuzaklar). Segment haritası:
  [../customers/segments.md](../customers/segments.md).

## Yerleşim
### Liste (`/marketing/promotions`)
1. Kart başlığı + rozet (filtrelenmiş kayıt sayısı) + sağda "Yeni Promosyon / New Promotion" (`data-testid="promotion-new-button"`).
2. Filtre çubuğu: arama (placeholder "Promosyon adı ara... / Search promotion name...", `data-testid="promotion-search-input"`),
   Durum Select ("Tüm durumlar / All statuses" + 6 durum, `data-testid="promotion-status-filter"`), Tür Select
   ("Tüm türler / All types" + Yüzde İndirim, Tutar İndirimi, Ücretsiz Kargo, Al-Kazan, Paket, Kademeli, Fırsat Satışı,
   Hediye Ürün; `data-testid="promotion-type-filter"`).
   Filtreler URL'ye yazılır (`?search=&status=&type=&page=`). Aktifse "Aktif filtreler:" rozetleri + "Filtreleri temizle".
3. Tablo sütunları: "Promosyon / Promotion" (ad + açıklama; tıklanınca detay — kuralı hiç kaydedilmemiş kademeli / paket /
   Al-Kazan promosyonunda düzenleme formu), "İndirim / Discount" (ör. "%20", "₺50", "Ücretsiz kargo", kademelide "3 kademe",
   paketta paket fiyatı, Al-Kazan'da "2 al 1 kazan"; değer yoksa "—"; altında tür adı), "Durum / Status" (rozet, `data-testid="promotion-status-{durum}"`),
   "Tarih Aralığı / Date range" ("1 Kas 2026 → 30 Kas 2026"), "Kullanım / Usage" ("12 / 500" ya da "12 / Sınırsız"), "⋯".
   Satır: `data-testid="promotion-row-{id}"`, ad `promotion-name-{id}`. Sayfa başına 20 satır, "Önceki/Sonraki".
4. Satır menüsü (⋯, aria-label "İşlemler / Actions"): "Görüntüle / View", "Düzenle / Edit"
   (`promotion-edit-action-{id}`), "Yayınla / Publish" (yalnız Taslak, Planlandı, Duraklatıldı **ve** kuralı tamamlanmış;
   kademe / paket / Al-Kazan kuralı hiç kaydedilmemiş promosyonda menüde yoktur; `promotion-publish-action-{id}`), "Duraklat / Pause" (yalnız Yayında; `promotion-pause-action-{id}`),
   "Sil / Delete" (`promotion-delete-action-{id}`).
5. Boş durum (hiç kayıt, filtre yok): "Henüz promosyonunuz yok" + açıklama ("Promosyon, indirimin kendisidir… kupon
   oluşturabilmek için önce bir promosyon gerekir.") + "İlk promosyonu oluştur". Filtre sonucu boşsa "sonuç yok" metni.

### Oluştur / Detay formu (tek sayfa, üç kart + yapışkan alt çubuk)
- Üstte "← Promosyonlara dön / Back to promotions".
- Kart 1 "Promosyon Bilgileri / Promotion details"; Kart 2 "İndirim / Discount" (tür seçilince türe özgü alanlar, ürün
  kapsamı, "Müşteri nasıl yararlanır", "Kural:" özeti ve "En az sepet tutarı"); Kart 3 "Geçerlilik Tarihleri / Validity
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
| İndirim | İndirim türü * / Discount type * | RadioGroup (6 seçenek) | evet | varsayılan Yüzde İndirim | `#promotion-type-percentage`, `#promotion-type-fixed_amount`, `#promotion-type-free_shipping`, `#promotion-type-tiered`, `#promotion-type-bundle`, `#promotion-type-buy_x_get_y` (ya da `getByLabel('Yüzde İndirim')`) | "Yüzde İndirim / Percentage discount" ("Sepet tutarının belirlediğiniz yüzdesi kadar indirim yapılır."), "Tutar İndirimi / Fixed amount off" ("Sepetten sabit bir tutar düşülür."), "Ücretsiz Kargo / Free shipping" ("Kargo ücreti alınmaz…"), "Kademeli / Tiered" ("Müşteri ne kadar çok harcar veya alırsa indirim o kadar büyür."), "Paket / Bundle" ("Müşteri bir ürün grubunu birlikte alınca sabit fiyat uygulanır."), "Al-Kazan / Buy X get Y" ("Bir üründen belirli sayıda alana aynı üründen indirimli veya ücretsiz verilir."). Tür değişince ilgili değer alanları değişir; kayıtlı promosyonun türü değiştirilirse eski türün kuralı kaldırılır |
| 〃 (Yüzde) | İndirim yüzdesi (%) * / Discount percentage (%) * | number, adım 1 | yayında evet | 1–100 ("İndirim yüzdesi 1 ile 100 arasında olmalı.") | `#promotion-discount-percentage`, placeholder "Örn. 20" | 20 = %20 |
| 〃 (Yüzde) | En fazla indirim tutarı / Maximum discount amount | number, adım 0.01 | hayır | ≥0; boş = sınırsız | `#promotion-max-discount` (placeholder para birimi) | Yüzde indirimin üst sınırı. Yalnız yüzde türünde kaydedilir |
| 〃 (Tutar) | İndirim tutarı * / Discount amount * | number, adım 0.01 | yayında evet | >0 ("İndirim tutarı 0'dan büyük olmalı.") | `#promotion-discount-amount` | Sepetten düşülen sabit tutar; uygun sepet tutarını aşamaz |
| 〃 (Ücretsiz Kargo) | — (bilgi notu) | metin | — | — | `data-testid="promotion-free-shipping-note"` | Değer girilmez; indirim = kargo ücreti |
| 〃 | En az sepet tutarı / Minimum cart total | number, adım 0.01 | hayır | ≥0; boş = alt sınır yok | `#promotion-min-purchase` | Sepet ara toplamı bu tutarın altındaysa kod reddedilir |
| 〃 (Kademeli) | Kademe satırları ("Kademe ekle" / "{n}. kademeyi kaldır") | satır başına: Ölçüt Select (Sepet tutarı / Ürün adedi), eşik (number), İndirim türü Select (Yüzde / Sabit tutar), değer, yüzdede "En yüksek indirim tutarı" | yayında en az 1 kademe | Tüm kademeler aynı ölçütte; eşik >0 (adette tam sayı); iki kademenin eşiği aynı olamaz; yüzde 0–100 (0 hariç); sabit tutar >0; en yüksek indirim >0 | `data-testid="promotion-tiers-editor"`, satır `promotion-tier-row`; satır alanları label ile ("Ölçüt", "Sepet tutarı en az" / "Ürün adedi en az", "İndirim türü", "İndirim (%)" / "İndirim tutarı") | Eşik **tüm sepete** bakılarak kontrol edilir; indirim yalnız seçili ürünlere (kapsam) uygulanır; sepetin ulaştığı **en yüksek kademe** geçerli olur. Kayıtta kademeler eşiğe göre artan sıralanır; boş bırakılan satırlar kaydedilmez |
| 〃 (Paket) | Paket ürünleri * | ürün arama + seçili liste | yayında evet | en az 2 **farklı** ürün | `#promotion-bundle-products-search` (`data-testid="promotion-bundle-editor"`) | Paket **siparişte bir kez** uygulanır; sepette paketteki her üründen "Her üründen adet" kadar olmalı |
| 〃 (Paket) | Paket fiyatı * / Bundle price | number | yayında evet | ≥0 | `#promotion-bundle-price` | Tüm paketin fiyatı; ürünlerin toplam fiyatının **altında** olmalı, aksi halde indirim oluşmaz |
| 〃 (Paket) | Her üründen adet / Quantity per product | number, tam sayı | yayında evet | ≥1; varsayılan 1 | `#promotion-bundle-quantity` | Bir paket için her üründen kaç adet gerektiği |
| 〃 (Al-Kazan) | Müşteri alır * / Customer buys | number, tam sayı | yayında evet | ≥1 | `#promotion-bogo-buy` (`data-testid="promotion-bogo-editor"`) | Tek ürün üzerinde çalışır: "2 al 1 kazan" için sepette **aynı üründen 3 adet** olunca biri indirimli olur |
| 〃 (Al-Kazan) | Müşteri kazanır * / Customer gets | number, tam sayı | yayında evet | ≥1 | `#promotion-bogo-get` | |
| 〃 (Al-Kazan) | Kazanılan ürünlerde indirim (%) * | number | yayında evet | >0 ve ≤100; varsayılan 100 | `#promotion-bogo-percentage` | "Bedava vermek için 100 girin." |
| 〃 (Yüzde, Tutar, Kademeli, Al-Kazan) | Geçerli olduğu ürünler (ürün seçin) | ürün arama ("Ürün adıyla arayın") + seçili liste (her satırda kaldır ×) | hayır | boş = kapsam yok | `data-testid="promotion-scope-picker"`, arama `#promotion-scope-search`, boş not `promotion-scope-empty` | **Yüzde:** yüzde yalnız seçili ürünlerin sepet satırları üzerinden hesaplanır. **Tutar:** yalnız bu satırların toplamından düşülür, toplamı aşamaz. **Kademeli:** eşik yine tüm sepete göre sayılır. **Al-Kazan:** fırsat seçili ürünlerle sınırlanır. Ürün seçilmezse: Yüzde/Tutar/Kademeli tüm sepete, Al-Kazan her ürünün kendi satırında geçerli olur. Seçilen ürünlerden hiçbiri sepette yoksa indirim uygulanmaz |
| 〃 (Kademeli, Paket, Al-Kazan) | Müşteri nasıl yararlanır / How the customer benefits | RadioGroup | — | varsayılan "Ödemede otomatik uygulanır" | `data-testid="promotion-trigger"`, `#promotion-trigger-automatic`, `#promotion-trigger-coupon` | **Ödemede otomatik uygulanır:** kod gerekmez, şartı sağlayan her sepete uygulanır. **Müşteri kupon kodu girer:** [Kuponlar](coupons.md) ekranından bir koda bağlanmalı ("Bu promosyonu Kuponlar ekranından bir kupon koduna bağlayın, aksi halde kimse kullanamaz."). Yüzde / Tutar / Ücretsiz Kargo türlerinde bu seçim yoktur: her zaman kuponludur |
| 〃 | "Kural:" özeti | metin | — | — | `data-testid="promotion-rule-summary"` | Kademeli / paket / Al-Kazan için kaydedilecek kuralın tek satırlık özeti (ör. "2 al, 1 bedava"); özette doğrula |
| Geçerlilik Tarihleri | Başlangıç tarihi * / Start date * | `datetime-local` | evet (taslakta da) | "Başlangıç tarihi girin." Oluştururken seçici şimdiden önceki saati önermez | `#promotion-start-date`; `fill('2026-11-01T00:00')` | Mağaza saat diliminde ("Saatler mağazanın saat dilimine göre ({timeZone}).") |
| 〃 | Bitiş tarihi * / End date * | `datetime-local` | evet (taslakta da) | > başlangıç ("Bitiş tarihi, başlangıç tarihinden sonra olmalı.") | `#promotion-end-date` | Bitişten sonra kod "süresi doldu" hatası verir |
| Kullanım Sınırları | Toplam kullanım sınırı / Total usage limit | number, tam sayı | hayır | boş = Sınırsız; girilecekse ≥1 | `#promotion-usage-limit`, placeholder "Sınırsız" | Tüm müşteriler, tüm bağlı kuponlar toplamı |
| 〃 | Müşteri başına sınır / Limit per customer | number, tam sayı | hayır | boş = Sınırsız; girilecekse ≥1 | `#promotion-usage-limit-per-customer` | Aynı müşteri bu promosyondan (hangi kuponla olursa olsun) kaç kez yararlanır |

Ekranda **olmayan** alanlar (sistemde var, bu formdan ayarlanamaz): kategori / müşteri / segment kapsamı, birleştirme
(stacking) ve öncelik, en az ürün adedi, Al-Kazan'da "kazanılan ürün" listesi ve çapraz satış (A al, B indirimli) ayarları,
store view kısıtı. Bkz. [entity](../../entities/promotion.md#ekranda-olmayan-ayarlar).

**Formdan düzenlenemeyen türler:** Fırsat Satışı ve Hediye Ürün promosyonları açılır ama indirim bölümünde yalnız bilgi
notu görünür: "{tür} promosyonu burada düzenlenemez. Adını, tarihlerini ve kullanım sınırlarını yine de
değiştirebilirsiniz." (`data-testid="promotion-readonly-notice"`); "En az sepet tutarı" yine düzenlenir.

## Aksiyonlar
| Buton | Ne olur | Toast / sonuç |
|---|---|---|
| Yeni Promosyon | `/marketing/promotions/new` açılır | — |
| Taslak Kaydet (oluştur) | Ad + tür + iki tarih yeterli; promosyon **Taslak** oluşur; indirim değeri / kural boş olabilir (kademeli, paket, Al-Kazan'da girilen kısım geçerli olmalı; yarım kural kaydedilmez) | "Başarılı — Promosyon oluşturuldu."; detaya (`/marketing/promotions/{id}`) gider |
| Yayınla (oluştur) | Tam validasyon (indirim değeri ve kademe / paket / Al-Kazan kuralı dahil); promosyon **Yayında** olarak oluşur | "Promosyon oluşturuldu." + "Promosyon yayına alındı."; detaya gider |
| Kaydet (detay) | Değişiklikleri yazar; promosyon Yayında ise tam validasyon uygulanır, değilse taslak validasyonu; durum değişmez. Kayıtlı kuralı olan promosyonda kural alanları boşaltılıp kaydedilirse "Bu promosyonda kayıtlı bir kural var. Kaydetmeden önce kuralı tamamlayın veya başka bir indirim türü seçin." hatası çıkar | "Promosyon güncellendi."; aynı sayfada kalır |
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
  başladıysa). **"Ödemede otomatik uygulanır"** seçili kademeli / paket / Al-Kazan promosyonunda ise kod gerekmeden şartı
  sağlayan **her müşterinin sepetine** ve siparişine indirim girer (tarih aralığı başladıysa) → özette "otomatik, herkese
  açık" diye ayrıca yaz ve ürün kapsamını listele. Özette: tür + değer / kural, ürün kapsamı, tetikleme, en az sepet tutarı,
  tarih aralığı (mağaza saat dilimiyle), kullanım sınırları, **bağlı kupon sayısı** ([Kuponlar](coupons.md) listesinde promosyon filtresi yoktur; "Promosyon" sütunundan say, sayamazsan "kontrol edilmedi").
- **Liste ⋯ → Yayınla / Duraklat**: diyalogsuz, tıklandığı anda kaydeder → onayı menüye tıklamadan **önce** al.
  Duraklatma, kuponu elinde olan müşterilerin kodunun reddedilmesine yol açar; özette belirt.
- **Kaydet (Yayında promosyon)**: değişiklik **anında canlı** — sepette/ödemede bu promosyonun kuponunu kullanan
  müşteriler yeni değeri görür. Taslak yok; özetinde "canlı promosyon" yaz, eski → yeni değer tablosu ver.
- **Sil**: geri alınamaz → ayrı onay; özette promosyon adı, durumu, kullanım sayısı ("Kullanım" sütunu) ve **çalışmaz
  hale gelecek bağlı kupon sayısı**. Geri alınabilir alternatif: **Duraklat**.
- Bu ekran müşteriye e-posta/bildirim göndermez, dış sisteme yazmaz. (Kupon kodlarını dağıtmak ayrı iştir:
  [Kuponlar](coupons.md), e-posta kampanyaları.)

## Yan etkiler
- Promosyon vitrinde kendi başına görünmez (rozet, banner, ürün fiyatı değişmez). Kuponlu promosyonda indirim, müşteri
  sepette ya da ödeme adımında bağlı bir **kupon kodu** girdiğinde hesaplanır; "Ödemede otomatik" promosyonda indirim
  sepet toplamında kod olmadan görünür ve siparişe taşınır (aynı sepette kupon da varsa ikisinin birlikte uygulanıp
  uygulanmayacağı promosyonun birleştirme ayarına bağlıdır; ekranda ayarlanamaz, sonucu sepette kontrol et); admin'den sipariş oluştururken "Kupon Kodu" alanına girilen
  kodun indirime dönüşüp dönüşmediği doğrulanmadı; kaydettikten sonra sipariş detayında "İndirim" satırını kontrol et ([../orders/order-create.md](../orders/order-create.md)).
- Yüzde/tutar indirimi ürünlerin o anki satış fiyatı (indirimli fiyat aktifse o) üzerinden hesaplanır; ücretsiz kargo
  kargo ücretini sıfırlar ve ürün tutarlarına dokunmaz. Ayrıntı: [entity](../../entities/promotion.md#sipariş-toplamına-etkisi).
- "Kullanım" sayacı sipariş verildikçe artar; iptal / tam iadede kullanım geri verilir ([../../entities/order.md](../../entities/order.md)).
- Silinen ya da duraklatılan promosyonun kuponları müşteriye "geçersiz" / "aktif değil" hatası verir.

## Tuzaklar
- **Kupon olmadan indirim çalışmaz (Yüzde, Tutar, Ücretsiz Kargo).** Bu üç tür kupon koduyla tetiklenir; promosyonu
  yayınlamak tek başına sepete indirim uygulamaz. Kullanıcı bu türlerde "kodsuz / herkese otomatik" istiyorsa söyle:
  otomatik promosyon yalnız Kademeli / Paket / Al-Kazan türlerinde kurulabilir; sepet tutarına bağlı kodsuz ücretsiz
  kargo için kargo kuralı ([../settings/shipping-carriers.md](../settings/shipping-carriers.md), "Ücretsiz Kargo" kuralı)
  kullanılabilir.
- **Kapsam yalnız ürün düzeyindedir.** "Yalnız şu ürünlerde" seçilebilir (Yüzde, Tutar, Kademeli, Al-Kazan); kategori,
  marka, segment gibi kısıtlar formda yok. "Tüm tişörtlerde" için tişört ürünlerini tek tek seçmek gerekir (liste
  büyükse kullanıcıya söyle; ürün bazında indirimli fiyat da bir alternatiftir). Kupon tarafındaki müşteri kısıtları:
  [coupons.md](coupons.md).
- **Kademeli / Paket / Al-Kazan promosyonu kural doldurulmadan Taslak kaydedilebilir ama Yayınlanamaz.** Kuralı hiç
  kaydedilmemiş böyle bir promosyon listede Yayınla seçeneği sunmaz ve satıra tıklayınca düzenleme formu açılır.
- **Al-Kazan tek ürün üzerinde çalışır.** "A al B bedava" (farklı ürünler) bu formdan kurulamaz; formdaki "2 al 1 kazan"
  aynı üründen 3 adet demektir. "3 al 2 öde" = Al 2 / Kazan 1 / %100.
- **Paket fiyatı ürünlerin toplam fiyatından düşük olmalı**; aksi halde paket indirim üretmez. Paket siparişte bir kez
  uygulanır.
- **Fırsat Satışı, Hediye Ürün** türleri listede görünebilir ama formdan oluşturulamaz / kuralı düzenlenemez (yalnız ad,
  tarih, kullanım sınırı, en az sepet tutarı).
- **Otomatik promosyona kupon bağlama:** "Ödemede otomatik uygulanır" promosyonu için kupon bağlamanın bir anlamı
  doğrulanmadı; kodlu kullanım istiyorsan tetikleme olarak "Müşteri kupon kodu girer"i seç.
- **Durum ve tarih ayrı kontrol edilir.** İndirim için promosyon hem **Yayında** olmalı hem de şu an başlangıç–bitiş
  aralığında olmalı. Başlangıcı ileri tarihli promosyon "Yayınla" ile Yayında görünür ama başlangıca kadar kod
  "henüz başlamadı" hatası verir. Bitiş geçmişse kod "süresi doldu" hatası verir.
- Tarihler mağaza saat dilimindedir; kullanıcının "1 Kasım'dan itibaren"ini `2026-11-01T00:00` olarak gir ve özette
  saat dilimini yaz. Bitiş "30 Kasım dahil" ise `2026-11-30T23:59`.
- Kullanım sınırına 0 yazma; sınırsız için boş bırak.
- Yüzde türünde "En fazla indirim tutarı", tutar türünde girilen değer, tür değiştirildiğinde kaydedilmez (yalnız seçili
  türün değerleri gider). Kayıtlı Yüzde/Tutar promosyon kural türüne çevrilirse eski yüzde/tutar değerleri silinir; kural
  türünden Yüzde/Tutar/Ücretsiz Kargo'ya çevrilirse tetikleme **kupona** döner ve kademe/paket/Al-Kazan kuralı kaldırılır.
  Kapsamı olan türler arasında geçişte seçili ürün kapsamı korunur.
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
