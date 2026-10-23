# Entity: Order (Sipariş) + kalemler, ödeme, kargo, iade/RMA, alacak dekontu

Müşterinin (veya misafirin) satın alma kaydı. Vitrin ödeme adımından, pazaryerlerinden, abonelik yenilemesinden ya da
admin panelinden (`/orders/new`) oluşur. Sipariş; kalemler, adresler (teslimat/fatura), ödeme satırları, kargo
satırları, faturalar, iade talepleri (RMA) ve alacak dekontlarıyla birlikte yaşar.

- Ekranlar: [../screens/orders/orders-list.md](../screens/orders/orders-list.md),
  [../screens/orders/order-create.md](../screens/orders/order-create.md),
  [../screens/orders/order-detail.md](../screens/orders/order-detail.md),
  [../screens/orders/orders-analytics.md](../screens/orders/orders-analytics.md),
  [../screens/orders/invoices.md](../screens/orders/invoices.md).
- İlgili entity'ler: [invoice.md](invoice.md), [subscription.md](subscription.md), [product.md](product.md),
  [currency.md](currency.md), [shipping-carrier.md](shipping-carrier.md), [tax-class.md](tax-class.md).
- Playbook'lar: [../../playbooks/order-create.md](../../playbooks/order-create.md),
  [../../playbooks/order-cancel-refund.md](../../playbooks/order-cancel-refund.md).

## Enum'lar

### Sipariş durumu (`orderStatus`)
| Değer | tr / en | Anlam |
|---|---|---|
| `pending` | Beklemede / Pending | Yeni sipariş, işlem bekliyor |
| `on_hold` | Bekletiliyor / On Hold | Admin tarafından bekletmeye alındı |
| `fraud_review` | Dolandırıcılık İncelemesi / Fraud Review | Otomatik risk analizi incelemeye aldı |
| `preparing` | Hazırlanıyor / Preparing | Hazırlanıyor (ödeme alınmış olmalı) |
| `ready` | Hazır / Ready | Kargoya hazır |
| `partially_shipped` | Kısmen Gönderildi / Partially Shipped | Bazı kalemler/paketler gönderildi |
| `shipped` | Kargoya Verildi / Shipped | Kargoya verildi |
| `delivered` | Teslim Edildi / Delivered | Teslim edildi |
| `completed` | Tamamlandı / Completed | Kapandı |
| `cancelled` | İptal Edildi / Cancelled | **Son durum** — geri dönüş yok |
| `partially_refunded` | Kısmi İade Yapıldı / Partially Refunded | Bir kısmı iade edildi, sipariş aktif |
| `refund` | İade Edildi / Refunded | **Son durum** — tamamı iade edildi |

### Ödeme durumu (`paymentStatus`, ödeme satırı durumu)
`pending` Beklemede · `processing` · `authorized` Yetkilendirildi · `captured` Tahsil Edildi · `paid` Ödendi ·
`partially_paid` · `failed` Başarısız · `cancelled` · `refunded` İade Edildi · `partially_refunded` Kısmi İade ·
`disputed` · `voided`. Listede filtrelenebilenler: Beklemede, Yetkilendirildi, Ödendi, Başarısız, İade Edildi.

### Ödeme yöntemi (`paymentMethod`)
`credit_card` Kredi Kartı · `debit_card` Banka Kartı · `paypal` · `stripe` · `bank_transfer` Banka Havalesi ·
`cash_on_delivery` Kapıda Ödeme · `apple_pay` · `google_pay`.
Admin sipariş oluşturmada seçilen ödeme sağlayıcısı yönteme şöyle yansır: Iyzico → Kredi Kartı, PayTR → Kredi Kartı,
Stripe → Stripe, PayPal → PayPal.

### Kaynak (`source`)
`web`, `mobile`, `subscription` (abonelik yenilemesi), `trendyol`, `amazon`, `hepsiburada`, `n11`, `admin` (panelden
oluşturulan). Liste filtresinde `admin` seçeneği yoktur.

### Teslimat tipi (admin oluşturma)
`shipping` "Kargo ile gönderim / Ship via carrier" · `pickup` "Mağazadan teslim / In-store pickup" (kargo ücreti 0).

### İade talebi (RMA) durumu
`PENDING` Onay Bekliyor → `APPROVED` Onaylandı - Ürün Bekleniyor → `RECEIVED` Ürünler Alındı → `INSPECTED` İncelendi →
`PROCESSING` → `REFUNDED` İade Edildi / `EXCHANGED` Değiştirildi / `CLOSED` Kapatıldı. Yan dallar: `REJECTED` Reddedildi,
`CANCELLED` İptal Edildi (yalnız Onay Bekliyor veya Onaylandı iken).
- Neden: Arızalı Ürün, Taşıma Sırasında Hasar, Yanlış Ürün, Açıklamaya Uygun Değil, Beden/Uyum Sorunu, Kalite Sorunu,
  Geç Teslimat, Fikir Değişikliği, Daha İyi Fiyat Bulundu, Yanlışlıkla Sipariş, Artık İhtiyaç Yok, Diğer.
- Çözüm: Para İadesi, Değişim, Mağaza Kredisi, Yenisiyle Değiştirme, Onarım.
- İade yöntemi: Kargo ile Gönder, Kurye ile Teslim Al, Teslim Noktasına Bırak, Mağazada İade.
- İnceleme sonucu ürün akıbeti: Stoğa Geri Ekle, Tasfiye Et, İmha Et, Tamire Gönder, Tedarikçiye İade.

### Alacak dekontu (credit memo) durumu
`pending` Beklemede → `approved` Onaylandı → `processing` İşleniyor → `refunded` İade Edildi; `cancelled` İptal Edildi
(yalnız Beklemede/Onaylandı iken). İade yöntemi: Orijinal Ödeme, Mağaza Kredisi, Hediye Kartı, Banka Havalesi, Manuel,
Çek, Nakit.

## Durum geçişleri (sunucu kuralı)
| Mevcut | İzinli sonraki durumlar |
|---|---|
| Beklemede | Bekletiliyor, Dolandırıcılık İncelemesi, Hazırlanıyor, İptal Edildi, İade Edildi |
| Bekletiliyor | Hazırlanıyor, İptal Edildi, İade Edildi |
| Dolandırıcılık İncelemesi | Hazırlanıyor, Bekletiliyor, İptal Edildi |
| Hazırlanıyor | Hazır, İptal Edildi, İade Edildi |
| Hazır | Kısmen Gönderildi, Kargoya Verildi, İptal Edildi, İade Edildi |
| Kısmen Gönderildi | Kargoya Verildi, İptal Edildi, Kısmi İade Yapıldı, İade Edildi |
| Kargoya Verildi | Teslim Edildi, Kısmi İade Yapıldı, İade Edildi |
| Teslim Edildi | Tamamlandı, Kısmi İade Yapıldı, İade Edildi |
| Tamamlandı | Kısmi İade Yapıldı, İade Edildi |
| Kısmi İade Yapıldı | İade Edildi, Tamamlandı |
| İptal Edildi, İade Edildi | — (son durum) |

Detay ekranındaki "Durumu değiştir" listesi yalnız bu tablodaki izinli durumları gösterir. Geçersiz geçiş →
`ERR_ORDER_INVALID_STATUS_TRANSITION`.

## İş kuralları
| Kural | Hata / sonuç |
|---|---|
| **İptal** yalnız Beklemede, Hazırlanıyor, Bekletiliyor durumlarında | `ERR_ORDER_CANNOT_BE_CANCELLED` |
| İptal nedeni zorunlu | `ERR_CANCELLATION_REASON_REQUIRED` |
| İptal edilen siparişte tahsil edilmiş ödeme varsa **otomatik tam iade** başlatılır (alacak dekontu + ödeme sağlayıcısına iade) | Dekont "Alacak Dekontları"nda görünür |
| İptal, siparişe ayrılmış stoğu serbest bırakır ve kupon kullanımını geri alır | — |
| **Hazırlanıyor**'a geçiş için en az bir ödeme satırı Yetkilendirildi/Tahsil Edildi/Ödendi olmalı | `ERR_PAYMENT_REQUIRED_FOR_PREPARING` |
| **Kargoya Verildi** işaretleme yalnız Hazırlanıyor, Hazır, Kısmen Gönderildi'den ve tahsil edilmiş ödeme ile | `ERR_ORDER_INVALID_STATUS_TRANSITION`, `ERR_ORDER_PAYMENT_NOT_CAPTURED` |
| **Teslim Edildi** yalnız Kargoya Verildi'den | `ERR_ORDER_MUST_BE_SHIPPED_FIRST` |
| Teslim Edildi olunca kapıda ödemeli siparişin ödemesi tahsil edilmiş sayılır | — |
| **İade Edildi** (tam iade) için neden zorunlu | `ERR_REFUND_REASON_REQUIRED` |
| Tam iade: Beklemede siparişte yapılamaz; İptal Edildi siparişte yapılamaz | `ERR_REFUND_REQUIRES_CAPTURED_PAYMENT`, `ERR_ORDER_ALREADY_CANCELLED` |
| Tamamı zaten iade edilmiş sipariş | `ERR_ORDER_ALREADY_FULLY_REFUNDED` |
| İade toplamı sipariş tutarını (kalan bakiye) aşamaz | `ERR_REFUND_AMOUNT_EXCEEDS_REMAINING` |
| Para iadesi ödeme sağlayıcısında sonuçlanmazsa dekont açık kalır ("İşleniyor"/"Onaylandı") | `ERR_ORDER_REFUND_FAILED` — "İade oluşturuldu ancak henüz ödenmedi — alacak dekontu listesinden işleyin." |
| Dekontlarla iade edilen toplam sipariş tutarına ulaşınca sipariş otomatik **İade Edildi** olur | — |
| **Silme** yalnız Beklemede, İptal Edildi, İade Edildi siparişlerde | `ERR_ORDER_CANNOT_BE_DELETED` |
| Beklemede sipariş silinince stok rezervasyonu serbest bırakılır | — |
| İade talebi (RMA) Beklemede ve İade Edildi siparişlerde oluşturulamaz; iade edilebilir adet = teslim edilen − önceki iadeler | "Bu sipariş durumu için iade oluşturulamaz." |
| Admin siparişinde stok yetersizse sipariş oluşmaz | `ERR_INSUFFICIENT_STOCK` (SKU, istenen, mevcut) |
| Toplu işlem en çok 100 sipariş; toplu iptal/iade en çok 50 | — |
| Kupon + otomatik promosyon ürün indirimlerinin toplamı sepet ara toplamının %80'ini geçemez; ücretsiz kargo promosyonu ayrı **kargo indirimi** olarak taşınır. Tam iadede kupon kullanımı geri verilir, kısmi iadede verilmez ([promotion.md](promotion.md), [coupon.md](coupon.md)) | — |

## Stok ilişkisi
| Olay | Stok etkisi | Ayrıntı |
|---|---|---|
| Admin sipariş oluşturma | Kalemler için stok **rezerve** edilir; yetersizse sipariş oluşmaz | [../screens/inventory/stock.md](../screens/inventory/stock.md) |
| Sipariş iptali | Ayrılan stok serbest bırakılır | |
| Beklemede sipariş silme | Rezervasyon serbest bırakılır | |
| Alacak dekontu iadesi (detaydaki "İade" diyaloğu, "İade Edildi" durumu) | İade edilen kalemler stoğa geri eklenir | |
| İptal sonrası otomatik para iadesi | Stoğa ekleme yapmaz (stok zaten iptalde serbest bırakılır) | |
| RMA "İadeyi İşle" (stoğa ekle seçiliyse) | İncelemeden geçen kalemler stoğa eklenir | |

## Müşteriye giden e-postalar (işlem e-postaları)
Bildirim şablonları: [../screens/settings/notifications.md](../screens/settings/notifications.md). Şablon kapalıysa o
e-posta gitmez. İşlem e-postaları pazarlama sıklık kurallarından etkilenmez
([../screens/settings/notification-rules.md](../screens/settings/notification-rules.md)).

| Olay | Şablon |
|---|---|
| Sipariş oluştu (admin dahil) | "Sipariş Onayı" → müşteri; "yeni sipariş" bildirimi → mağaza yöneticileri |
| Kargoya Verildi | "Sipariş Kargoya Verildi" |
| Teslim Edildi | "Sipariş Teslim Edildi" |
| İptal Edildi | "Sipariş İptal Edildi" |
| Tamamı iade edildi | "Sipariş İade Edildi" |
| Diğer her durum değişikliği (Bekletiliyor, Hazırlanıyor, Hazır, Tamamlandı, Kısmi İade…) | "Sipariş Durumu Değişti" |
| Kargo hareketleri (dağıtıma çıktı, teslim edilemedi…) | Kargo durum şablonları |

## İlişkiler
| İlişki | Not |
|---|---|
| Sipariş → müşteri | opsiyonel (misafir siparişte yok); [../screens/customers/customer-detail.md](../screens/customers/customer-detail.md) |
| Sipariş → ürün kalemleri | Yalnız yayında ürünler admin siparişine eklenebilir ([product.md](product.md)) |
| Sipariş → para birimi | Aktif para birimlerinden ([currency.md](currency.md)) |
| Sipariş → ödeme sağlayıcısı | Aktif sağlayıcılardan ([../screens/settings/payments.md](../screens/settings/payments.md)) |
| Sipariş → kargo | Aktif kargo entegrasyonu ve tarifesi ([shipping-carrier.md](shipping-carrier.md)) |
| Sipariş → fatura | 0..n fatura, iade/fark faturası ([invoice.md](invoice.md)) |
| Sipariş → abonelik | Abonelik kayıt siparişi ve yenileme siparişleri ([subscription.md](subscription.md)) |
| Sipariş → alacak dekontu, RMA | 0..n |
