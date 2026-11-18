# Entity: Promotion (Promosyon)

İndirim kampanyasının **kendisi**: ne kadar indirim, kimin/hangi sepetin hak ettiği, hangi tarihlerde ve kaç kez.
Müşterinin yazdığı kod promosyonda değil, ona bağlı **kuponda** durur: Promosyon 1 ── N Kupon. Kupon indirimi kendisi
taşımaz, bağlı olduğu promosyondan alır.

- Ekran: [../screens/marketing/promotions.md](../screens/marketing/promotions.md) (liste, oluştur, detay/düzenle).
- Playbook: [../../playbooks/promotion-create.md](../../playbooks/promotion-create.md).
- İlişkili: [coupon.md](coupon.md) (kupon ekranı: [../screens/marketing/coupons.md](../screens/marketing/coupons.md)),
  [segment.md](segment.md), [order.md](order.md), [product.md](product.md), [category.md](category.md).

## Enum'lar
| Enum | Değerler (tr / en) |
|---|---|
| Tür | `percentage` Yüzde İndirim / Percentage discount, `fixed_amount` Tutar İndirimi / Fixed amount off, `free_shipping` Ücretsiz Kargo / Free shipping, `tiered` Kademeli / Tiered, `bundle` Paket / Bundle, `buy_x_get_y` Al-Kazan / Buy X get Y — **admin formunda bu altısı**. Sistemde ayrıca: `flash_sale` Fırsat Satışı / Flash sale, `free_product` Hediye Ürün / Free product (listede görünür, formda yalnız ad / tarih / sınır düzenlenir) |
| Durum | `draft` Taslak / Draft, `scheduled` Planlandı / Scheduled, `active` Yayında / Live, `paused` Duraklatıldı / Paused, `expired` Süresi Doldu / Expired, `completed` Tamamlandı / Completed |
| Tetikleme (public API `triggerType`) | `coupon` (kupon koduyla), `automatic` (kodsuz, uygun her sepete); ayrıca referral, loyalty, gift_card, api, webhook. Admin formunda yalnız Kademeli / Paket / Al-Kazan için seçilir (varsayılan **automatic**: "Ödemede otomatik uygulanır" / "Müşteri kupon kodu girer"); Yüzde / Tutar / Ücretsiz Kargo her zaman **kuponlu**dur |
| Birleştirme (public API `stackingMode`) | `stackable` (varsayılan), `highest_wins`, `lowest_wins`, `exclusive` — admin formunda yok |
| Kapsam (public API `scope`) | `global` (varsayılan), `product`, `category`, `customer`, `customer_segment`, `order`. Admin formunda yalnız ürün kapsamı (Yüzde, Tutar, Kademeli, Al-Kazan) |

## Alanlar (admin formunda)
| Alan | Zorunlu | Kural |
|---|---|---|
| Ad | evet | ≤200; yalnız panelde görünür |
| Açıklama | hayır | ≤1000 |
| Tür | evet | yukarıdaki altı tür |
| İndirim yüzdesi | Yayında + yüzde türünde | 1–100 |
| En fazla indirim tutarı | hayır | yüzde indirimin üst sınırı; boş = sınırsız |
| İndirim tutarı | Yayında + tutar türünde | >0 |
| En az sepet tutarı | hayır | sepet ara toplamı bunun altındaysa indirim yok |
| Ürün kapsamı | hayır | Yüzde, Tutar, Kademeli, Al-Kazan türlerinde; seçilen ürünler. Boş = kapsam yok |
| Kademeler | Yayında + kademeli türünde (≥1) | her kademe: ölçüt (sepet tutarı **ya da** ürün adedi — hepsi aynı ölçütte), eşik (>0; adette tam sayı; tekrar yok), indirim türü yüzde (0–100) / sabit tutar (>0), yüzdede isteğe bağlı en yüksek indirim (>0) |
| Paket | Yayında + paket türünde | en az 2 farklı ürün, paket fiyatı (≥0), her üründen adet (≥1, tam sayı) |
| Al-Kazan | Yayında + Al-Kazan türünde | alınacak adet (≥1), kazanılacak adet (≥1), kazanılan ürünlerde indirim yüzdesi (>0, ≤100; varsayılan 100 = bedava) |
| Müşteri nasıl yararlanır | — | yalnız Kademeli / Paket / Al-Kazan: otomatik (varsayılan) / kupon kodu |
| Başlangıç / Bitiş | evet (taslakta da) | bitiş > başlangıç; mağaza saat diliminde girilir |
| Toplam kullanım sınırı | hayır | ≥1; boş = sınırsız; tüm kuponlar ve müşteriler toplamı |
| Müşteri başına sınır | hayır | ≥1; boş = sınırsız; aynı müşteri bu promosyonu kaç kez kullanır (farklı kuponlarla da olsa aynı sayaç) |
| Kullanım sayısı | sistem | listede "Kullanım" sütunu |

## Ekranda olmayan ayarlar
Public API'de bulunan ama admin formunda olmayan ayarlar: kategori / müşteri / segment kısıtı, birleştirme modu ve öncelik,
en az ürün adedi, Al-Kazan'da kazanılan ürün listesi ve **çapraz satış** ayarları (aşağıda), A/B test. Bu ayarlarla başka
kaynaklardan (otomasyon, içe aktarma, entegrasyon) gelmiş promosyonlar listede görünebilir; Claude bunları kural 3
gereği API ile kurmaz/değiştirmez. Bu tür bir promosyonu formdan "Kaydet"meden önce kullanıcıya sor (form bu ayarları
göstermez; bkz. ekran Tuzaklar).

## Çapraz satış (A al, B indirimli) — yalnız API ile kurulur
Admin ekranından kurulamaz; API ile kurulmuş olabilir ve müşteri tarafında şu sonuçları verir:
- Al-Kazan türünde, "alınan ürünler" (A) ve "indirim alacak ürünler" (B) ayrı tanımlıdır; sepette A varken **yalnız B
  satırları** indirim alır (yüzde ya da sabit tutar). A ve B aynı ürün olamaz; B, "geçerli olduğu ürünler" listesinde olamaz.
- Her zaman **otomatiktir** (kupon koduna bağlanamaz; bağlı kuponu olan bir promosyon çapraz satışa çevrilemez ve çapraz
  satışa kupon bağlanamaz; kupon ekranı bunu reddeder).
  Sabit tutarlı indirimde para birimi gerekir; sepet para birimi farklıysa indirim uygulanmaz.
- **Sepette:** indirim sepet toplamına otomatik girer. Sepette ayrıca kupon varsa ikisi promosyonun birleştirme moduna göre
  değerlendirilir (çapraz satışta varsayılan "en yüksek kazanır": ikisinden daha yüksek indirim geçerli olur, diğeri
  uygulanmaz); toplamda ürün indirimleri üst sınırı (%80) geçemez.
- **Siparişte:** indirim, sepetteki **B ürününün sipariş satırına** yazılır (tüm satırlara oransal dağıtılmaz); kupon indirimi
  hiçbir zaman bu sınır yüzünden azaltılmaz, kısıtlanan taraf otomatik indirimdir. İade önizlemesi ve taslak fatura aynı
  satır payını kullanır.
- **Ürün sayfasında "Birlikte al, tasarruf et" bloğu:** A ürününün sayfasında, A tek adet yeterli ve uygun otomatik çapraz
  satış varsa en fazla 3 teklif B ürünü eski/yeni fiyatıyla ve "Sepete ekle" butonuyla listelenir. Kapsam: en az sepet
  tutarı, en az adet, müşteri başı sınır, kategori / müşteri / segment kısıtı olan promosyonlar ürün sayfasında teklif
  edilmez (indirim yine sepette geçerli olabilir). Not: "Bu fiyatlar sepetinizde {A} olduğunda geçerlidir. Buradan ürün
  eklemek {A} ürününü sepete eklemez." — A sepette ise "indirim sepette uygulanır" notu görünür. Seçenekli (varyantlı) B için
  buton "Seçenekleri seç" olur.

## Kurallar
- **Uygulanma koşulları** (hepsi sağlanmalı; sağlanmazsa müşteri kodu girerken hata görür):
  | Koşul | Hata kodu (public) |
  |---|---|
  | Durum Yayında | `PROMOTION_NOT_ACTIVE` |
  | Şu an ≥ başlangıç | `PROMOTION_NOT_STARTED` |
  | Şu an ≤ bitiş | `PROMOTION_EXPIRED` |
  | Toplam kullanım < sınır | `PROMOTION_USAGE_LIMIT_REACHED` |
  | Müşterinin kullanımı < müşteri başı sınır | `CUSTOMER_USAGE_LIMIT_REACHED` |
  | Ara toplam ≥ en az sepet tutarı | `MINIMUM_PURCHASE_AMOUNT_NOT_MET` |
  | (API ile kurulmuşsa) en az ürün adedi, ürün/kategori sepette, müşteri listede, müşteri segmentte | `MINIMUM_QUANTITY_NOT_MET`, `NO_APPLICABLE_PRODUCTS_IN_CART`, `NO_APPLICABLE_CATEGORIES_IN_CART`, `CUSTOMER_NOT_ELIGIBLE`, `CUSTOMER_NOT_IN_ELIGIBLE_SEGMENT` |
  Kupona özgü kontroller (kupon aktif mi, kupon tarihi, kupon kullanım sınırı, müşteriye özel kupon) ayrıca kuponda
  yapılır: [coupon.md](coupon.md).
- **Durum ile tarih bağımsızdır:** "Yayınla" durumu hemen Yayında yapar; indirim yine yalnız tarih aralığında uygulanır.
- **Durum geçişleri (admin):** Taslak → Yayında; Yayında ↔ Duraklatıldı; Planlandı → Yayında. Formdan Taslağa dönülmez.
  Kademeli / Paket / Al-Kazan promosyonu kuralı kaydedilmeden Yayınlanamaz.
- **Silme** geri alınamaz; bağlı kuponlar çalışmayı durdurur. Kullanım geçmişi ve geçmiş siparişlerdeki indirim
  tutarları değişmez (doğrulanmadı).
- Kopyalama (public API'de var, ekranda yok): kopya "{ad} (Copy)" adıyla Taslak ve sıfır kullanımla oluşur.

## Sipariş toplamına etkisi
- **Yüzde:** uygun tutar × yüzde; "En fazla indirim tutarı" varsa onunla sınırlı. Kapsam yoksa uygun tutar = sepet ara
  toplamı.
- **Tutar:** sabit tutar; uygun tutarı aşamaz (sepet eksiye düşmez).
- **Ücretsiz kargo:** ürün indirimi 0; seçilen kargonun ücreti indirim olarak düşer. Siparişte kargo indirimi ayrı
  satır olarak taşınır.
- **Ürün fiyatı / indirimli fiyat:** hesap sepet satırının o anki birim fiyatı üzerinden yapılır — ürünün indirimli fiyatı
  (tarih aralığı aktifse) zaten uygulanmış fiyattır (kademe fiyatı için doğrulanmadı). Yani promosyon indirimli fiyatın **üstüne**
  eklenir; "%20 indirimli ürüne %10 kupon" = önce indirimli fiyat, sonra ara toplamdan %10. Karşılaştırma (eski) fiyatı
  hesaba girmez. Ürün fiyat alanları: [product.md](product.md).
- **Kupon + otomatik promosyon birlikte:** önce kupon indirimi, sonra kalan ara toplam üzerinden otomatik promosyonlar
  hesaplanır; promosyonun birleştirme ayarı (birleştirilebilir / en yüksek kazanır / en düşük kazanır / yalnız o) hangisinin
  geçerli olacağını belirler (ayar admin formunda yok; sonucu sepette kontrol et). Ürün indirimlerinin toplamı (kupon +
  otomatik) sepet ara toplamının **%80**'ini geçemez; sınır aşılırsa otomatik indirim azalır, kupon indirimi azalmaz.
- **Kademeli:** eşik (sepet tutarı ya da ürün adedi) tüm sepete göre kontrol edilir; ulaşılan en yüksek kademenin indirimi
  seçili ürünlere (kapsam varsa) uygulanır. **Paket:** sepette paketteki her üründen gereken adet varsa paket fiyatı
  uygulanır (siparişte bir kez); ürünlerin toplamı paket fiyatından yüksek değilse indirim oluşmaz. **Al-Kazan:** aynı
  üründen "alınan + kazanılan" adet sepetteyse kazanılan adet kadar ürüne indirim (varsayılan %100) uygulanır.
- **Yüzde / Tutar + ürün kapsamı:** yüzde yalnız kapsamdaki ürünlerin satır tutarı üzerinden hesaplanır; sabit tutar yalnız bu
  satırların toplamını aşmayacak şekilde düşülür. Sepette kapsamdaki ürün yoksa indirim uygulanmaz (`NO_APPLICABLE_PRODUCTS_IN_CART`).
- Birden çok promosyon birlikte değerlendiriliyorsa yüksek öncelikli önce uygulanır; birleştirilemez işaretli bir
  promosyon başka indirim uygulanmışsa atlanır (bu ayarlar admin formunda yok).
- Vergi, indirimden sonraki tutar üzerinden hesaplanır (doğrulanmadı — sipariş detayında "İndirim" ve vergi
  satırlarıyla kontrol et, [../screens/orders/order-detail.md](../screens/orders/order-detail.md)).
- Siparişte indirim satırlara paylaştırılır; kısmi iadede iade tutarı bu paya göre hesaplanır (doğrulanmadı).

## Kullanım sayacı
- Sipariş verildiğinde promosyon kullanımı ayrılır, sipariş tamamlandıkça kesinleşir; ödeme tamamlanmayan ayrılmalar bir
  süre sonra serbest kalır. Sipariş iptali ve tam iadede kullanım geri verilir ([order.md](order.md)).
- Müşteri başı sınırın misafir alışverişlerinde nasıl sayıldığı doğrulanmadı; sınır kritikse kullanıcıya sor.

## İlişkiler
| İlişki | Not |
|---|---|
| Promosyon → Kupon (1-N) | Kupon oluşturmak için önce promosyon gerekir; kupon Taslak, Planlandı, Yayında, Duraklatıldı promosyona bağlanabilir ([coupon.md](coupon.md)) |
| Promosyon → Segment | API ile kurulabilir; segmentte olmayan ya da giriş yapmamış müşteri `CUSTOMER_NOT_IN_ELIGIBLE_SEGMENT` alır. Segment üyeliği son "Yeniden Oluştur" anındakidir ([segment.md](segment.md)) |
| Promosyon → Ürün | Admin'den seçilebilir (Yüzde, Tutar, Kademeli, Al-Kazan; Paket'te paket ürünleri); indirim yalnız eşleşen satırların tutarına uygulanır ve sepette en az bir eşleşen satır olmalı ([product.md](product.md)) |
| Promosyon → Kategori | Yalnız API ile kurulabilir; aynı kural |
| Promosyon → Sipariş | Siparişte indirim tutarı, kullanılan kupon kodu ve kargo indirimi görünür ([order.md](order.md)) |
| Promosyon ↔ Kargo kuralı | Kodsuz "X TL üzeri ücretsiz kargo" kargo ayarındaki kuraldır, promosyon değildir ([shipping-carrier.md](shipping-carrier.md)) |
