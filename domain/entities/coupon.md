# Entity: Coupon (Kupon)

Müşterinin sepette/ödemede girdiği **kod**. Kupon indirimi kendisi taşımaz; bağlı olduğu **promosyonun** indirimini açar
(Promosyon 1 ── N Kupon). İndirim türü/değeri, minimum sepet, müşteri başı sınır, promosyon geneli sınır ve (API ile
kurulduysa) ürün/kategori/segment kısıtları promosyondadır: [promotion.md](promotion.md).

- Ekranlar: [../screens/marketing/coupons.md](../screens/marketing/coupons.md) (liste, oluştur, detay, düzenle),
  [../screens/marketing/coupon-bulk.md](../screens/marketing/coupon-bulk.md) (toplu üretim);
  promosyon: [../screens/marketing/promotions.md](../screens/marketing/promotions.md).
- Playbook: [../../playbooks/coupon-create.md](../../playbooks/coupon-create.md); promosyon için
  [../../playbooks/promotion-create.md](../../playbooks/promotion-create.md).
- İlişkili: [promotion.md](promotion.md), [order.md](order.md), [customer.md](customer.md), [segment.md](segment.md).

## Enum'lar
| Enum | Değerler (tr / en) |
|---|---|
| Tür | `single_use` Tek Kullanımlık / Single use, `multi_use` Çoklu Kullanım / Multi use — **admin formunda seçilebilen yalnız bu ikisi**. Sistemde ayrıca (formda pasif, "sonraki sürüm"): `unique` Kişiye Özel / Unique, `referral` Tavsiye / Referral, `gift` Hediye / Gift |
| Durum | `draft` Taslak / Draft, `active` Aktif / Active, `expired` Süresi Doldu / Expired, `redeemed` Kullanıldı / Redeemed, `cancelled` İptal / Cancelled |
| Dağıtım kanalı (detayda gösterilir) | `email`, `sms`, `manual`, `api`, `social`, `referral` — admin formu ayarlamaz |

## Alanlar
| Alan | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|
| Kupon kodu | hayır | otomatik: 8 karakter büyük harf + rakam | ≤64; **büyük harfe çevrilerek** kaydedilir, müşteri girişi büyük/küçük harf duyarsız. Mağaza içinde benzersiz (çakışma 409). **Oluşturulduktan sonra değiştirilemez** (`ERR_COUPON_CODE_IMMUTABLE`) |
| Promosyon | **evet** | — | Kuponun açtığı indirim. Taslak, Planlandı, Yayında, Duraklatıldı promosyona bağlanabilir; indirim yalnız promosyon **Yayında** ve tarih aralığındayken uygulanır. Düzenlemede değiştirilebilir |
| Tür | evet | Tek Kullanımlık | bkz. Kullanım kuralları |
| Açıklama | hayır | — | ≤500; yalnız panelde |
| Başlangıç / Bitiş | **evet** (taslakta da) | — | bitiş > başlangıç; mağaza saat diliminde girilir; oluşturmada geçmiş başlangıç seçilemez |
| Kullanım limiti | — | 1 | ≥1; bu kodun **toplam** kullanım sayısı (tüm müşteriler) |
| Durum | — | Taslak | Oluştururken "Taslak Kaydet" → Taslak, "Aktive Et" → Aktif; toplu üretim → Aktif |
| Kullanım sayısı, son kullanım tarihi, oluşturan, oluşturma/güncelleme tarihi | sistem | — | detay ekranında |
| Müşteri (bağlı müşteri) | — | — | Admin formunda yok. Sadakat ödülü, tavsiye, sepet kurtarma gibi otomasyonların ürettiği kuponlar tek müşteriye bağlıdır; başka müşteri kullanamaz (`COUPON_NOT_FOR_CUSTOMER`) |

## Kullanım kuralları (vitrinde kod girildiğinde)
Hepsi sağlanmalı; aksi halde müşteri hata görür. Kupona özgü kontroller:

| Koşul | Hata kodu (public) |
|---|---|
| Kod mağazada var | `DISCOUNT_CODE_NOT_FOUND` |
| Kupon bir promosyona bağlı / promosyon mevcut | `COUPON_NOT_LINKED_TO_PROMOTION` / `PROMOTION_NOT_FOUND` |
| Kupon durumu **Aktif** (Taslak, Kullanıldı, Süresi Doldu, İptal reddedilir) | `COUPON_NOT_ACTIVE` |
| Şu an kupon başlangıç–bitiş aralığında | `COUPON_EXPIRED` |
| Kullanım sayısı < kullanım limiti | `COUPON_USAGE_LIMIT_REACHED` |
| Kupon bir müşteriye bağlıysa kullanan o müşteri | `COUPON_NOT_FOR_CUSTOMER` |
| Tek Kullanımlık kupon daha önce kullanılmamış | `COUPON_ALREADY_USED` |

Ardından promosyon koşulları (durum Yayında, promosyon tarihleri, promosyon toplam/müşteri başı sınırı, en az sepet
tutarı, varsa ürün/kategori/segment): [promotion.md](promotion.md#kurallar).

- **Tek Kullanımlık:** kod toplamda **bir** siparişte kullanılır (hangi müşteri olursa); kullanılınca durum "Kullanıldı".
  Limit alanı 1'den büyük girilse de ilk kullanımdan sonra kapanır → tek kullanımlıkta limit 1 gir.
- **Çoklu Kullanım:** kullanım limiti kadar (tüm müşteriler toplamı). Aynı müşterinin kaç kez kullanacağı kuponda değil,
  promosyonda "Müşteri başına sınır" ile belirlenir ve promosyonun **tüm kuponları için ortak** sayılır.
- **Her müşteriye ayrı kod** → toplu üretim (her kod tek kullanımlık).
- **Sepette en fazla 3 kod** uygulanabilir; aynı kod ikinci kez eklenemez. Birden çok kodun/promosyonun birlikte nasıl
  hesaplandığı promosyonların birleştirme ayarına bağlıdır (admin formunda yok; [promotion.md](promotion.md#sipariş-toplamına-etkisi)).
- Admin ekranında olmayan kısıtlar: ürün/kategori/marka, müşteri grubu, segment, "ilk sipariş", en az ürün adedi,
  birleştirilemezlik. Kullanıcı bunları isterse "bu sürümde admin ekranından kurulamaz" de; kural 3 gereği API ile kurma.

## Durum yaşam döngüsü
```
Taslak ──(admin ekranında durum düğmesi yok)
Aktif ──tek kullanımlık kullanıldı──► Kullanıldı ──sipariş iptal / tam iade──► Aktif
Aktif ──bitiş tarihi geçti──► Süresi Doldu (vitrinde reddedilir)
```
- Durum oluştururken seçilir; düzenleme durumu korur. Oluştururken "Aktive Et" seçilmezse kupon Taslak kalır.
- Kuponu durdurma yolları: bitiş tarihini öne çekmek; kullanılmamışsa silmek; bağlı promosyonu Duraklatmak (o promosyonun
  **tüm** kodlarını durdurur).

## Silme ve düzenleme kuralları
- **Silme** geri alınamaz. Geri alınmamış kullanımı olan (bir siparişte kullanılmış) kupon silinemez →
  `ERR_COUPON_HAS_REDEMPTIONS` ("Bu kupon zaten kullanıldı, silinemez."). İptal/tam iade ile kullanımı geri verilmiş kupon
  silinebilir. Silinen kuponun kodu müşteride "bulunamadı" hatası verir.
- **Kullanılmış kuponu düzenleme** serbesttir; kod hariç her alan değişir ve **sonraki** kullanımları etkiler. Geçmiş
  siparişlerdeki indirim tutarı değişmez (doğrulanmadı).
- **Kopyala** (detay): `{KOD}-{8 karakter}` kodlu, aynı ayarlı yeni **Taslak** kupon; kullanım sıfır.

## Sipariş ilişkisi
| Olay | Kupon etkisi |
|---|---|
| Vitrinde ödeme | Kod sepette/ödeme adımında uygulanır; sipariş verilirken kupon ve promosyon kullanımı ayrılır, sipariş tamamlanınca kesinleşir. Ödemesi tamamlanmayan deneme kullanım hakkını bir süre (yaklaşık 1–1,5 saat) tutar, sonra serbest bırakır |
| Siparişte görünüm | Sipariş detayında indirim tutarı ve kullanılan kupon kodu ([order.md](order.md), [../screens/orders/order-detail.md](../screens/orders/order-detail.md)); sipariş listesinde "kuponlu" filtresi |
| Admin'den sipariş oluşturma | "Kupon Kodu" alanı ([../screens/orders/order-create.md](../screens/orders/order-create.md)). Kodun indirime dönüşüp dönüşmediği ve kupon kullanımını artırıp artırmadığı doğrulanmadı → kaydettikten sonra sipariş detayında "İndirim" satırını ve kuponun "Kullanım" değerini kontrol et |
| Sipariş **iptali** | Kupon ve promosyon kullanımı geri verilir; tek kullanımlık kupon yeniden "Aktif" olur (kendi bitiş tarihi geçtiyse yine kullanılamaz) |
| **Tam iade** (sipariş "İade Edildi") | Aynı şekilde geri verilir |
| **Kısmi iade** | Kullanım geri verilmez |
| Kupon/promosyon silme | Geçmiş siparişlerin indirim tutarı değişmez (doğrulanmadı) |

İptal ve iade kural 5 kapsamında ayrı onaylıdır: [../../playbooks/order-cancel-refund.md](../../playbooks/order-cancel-refund.md).

## İlişkiler
| İlişki | Not |
|---|---|
| Kupon → Promosyon (N-1, zorunlu) | İndirimin tamamı promosyondan. Promosyon Duraklatılır/silinirse kod çalışmaz ([promotion.md](promotion.md)) |
| Kupon → Sipariş | Kullanım siparişle sayılır; iptal/tam iadede geri ([order.md](order.md)) |
| Kupon → Müşteri | Admin kuponları herkese açıktır; otomasyon kuponları müşteriye bağlı olabilir ([customer.md](customer.md)) |
| Kupon → Segment / Müşteri grubu | Kuponda yok; segment kısıtı ancak promosyonda ve API ile ([segment.md](segment.md)) |
| Kupon ↔ Otomasyonlar | Sadakat puanı kullanımı, tavsiye, sepet kurtarma, hoş geldin/geri kazanma akışları kendiliğinden kupon (ve kendi promosyonunu) üretebilir; bunlar kupon listesinde görünür. E-posta ile gönderimleri bildirim/akış tarafındadır ([../screens/settings/notification-rules.md](../screens/settings/notification-rules.md); E-posta yönetimi — kapsam dışı) |
| Kupon → Vitrin paylaşım sayfası | "Paylaş" bağlantısı `{vitrin}/{dil}/coupon/{KOD}` herkese açık; süresi dolmuş/iptal/kullanılmış kuponda paylaşım kapalı |
