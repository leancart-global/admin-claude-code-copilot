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
| Tür | `percentage` Yüzde İndirim / Percentage discount, `fixed_amount` Tutar İndirimi / Fixed amount off, `free_shipping` Ücretsiz Kargo / Free shipping — **admin formunda yalnız bu üçü**. Sistemde ayrıca: `buy_x_get_y` Al-Kazan / Buy X get Y, `bundle` Paket / Bundle, `tiered` Kademeli / Tiered, `flash_sale` Fırsat Satışı / Flash sale, `free_product` Hediye Ürün / Free product |
| Durum | `draft` Taslak / Draft, `scheduled` Planlandı / Scheduled, `active` Yayında / Live, `paused` Duraklatıldı / Paused, `expired` Süresi Doldu / Expired, `completed` Tamamlandı / Completed |
| Tetikleme (public API `triggerType`) | `coupon` (varsayılan — kupon koduyla), `automatic` (kodsuz, uygun her sepete); ayrıca referral, loyalty, gift_card, api, webhook. Admin formu ayarlamaz → admin'den oluşan promosyon **kuponlu**dur |
| Birleştirme (public API `stackingMode`) | `stackable` (varsayılan), `highest_wins`, `lowest_wins`, `exclusive` — admin formunda yok |
| Kapsam (public API `scope`) | `global` (varsayılan), `product`, `category`, `customer`, `customer_segment`, `order` |

## Alanlar (admin formunda)
| Alan | Zorunlu | Kural |
|---|---|---|
| Ad | evet | ≤200; yalnız panelde görünür |
| Açıklama | hayır | ≤1000 |
| Tür | evet | yukarıdaki üç tür |
| İndirim yüzdesi | Yayında + yüzde türünde | 1–100 |
| En fazla indirim tutarı | hayır | yüzde indirimin üst sınırı; boş = sınırsız |
| İndirim tutarı | Yayında + tutar türünde | >0 |
| En az sepet tutarı | hayır | sepet ara toplamı bunun altındaysa indirim yok |
| Başlangıç / Bitiş | evet (taslakta da) | bitiş > başlangıç; mağaza saat diliminde girilir |
| Toplam kullanım sınırı | hayır | ≥1; boş = sınırsız; tüm kuponlar ve müşteriler toplamı |
| Müşteri başına sınır | hayır | ≥1; boş = sınırsız; aynı müşteri bu promosyonu kaç kez kullanır (farklı kuponlarla da olsa aynı sayaç) |
| Kullanım sayısı | sistem | listede "Kullanım" sütunu |

## Ekranda olmayan ayarlar
Public API'de bulunan ama admin formunda olmayan ayarlar: ürün / kategori / müşteri / segment kısıtı, tetikleme türü,
birleştirme modu ve öncelik, en az ürün adedi, kademeler, Al-Kazan ve paket ayarları, A/B test. Bu ayarlarla başka
kaynaklardan (otomasyon, içe aktarma, entegrasyon) gelmiş promosyonlar listede görünebilir; Claude bunları kural 3
gereği API ile kurmaz/değiştirmez. Bu tür bir promosyonu formdan "Kaydet"meden önce kullanıcıya sor (form bu ayarları
göstermez; bkz. ekran Tuzaklar).

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
  hesaplanır. Ürün indirimlerinin toplamı (kupon + otomatik) sepet ara toplamının **%80**'ini geçemez.
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
| Promosyon → Ürün / Kategori | API ile kurulabilir; kurulursa indirim yalnız eşleşen satırların tutarına uygulanır ve sepette en az bir eşleşen satır olmalı |
| Promosyon → Sipariş | Siparişte indirim tutarı, kullanılan kupon kodu ve kargo indirimi görünür ([order.md](order.md)) |
| Promosyon ↔ Kargo kuralı | Kodsuz "X TL üzeri ücretsiz kargo" kargo ayarındaki kuraldır, promosyon değildir ([shipping-carrier.md](shipping-carrier.md)) |
