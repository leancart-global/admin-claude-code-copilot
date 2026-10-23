# Entity: Purchase Order (Satın Alma Siparişi, SAS / PO)

Tedarikçiden belirli bir depoya mal siparişi. Teslim alındıkça hedef depoya stok girişi yapar.

- Ekran: [../screens/inventory/purchase-orders.md](../screens/inventory/purchase-orders.md).
- Playbook: [../../playbooks/purchase-order-create.md](../../playbooks/purchase-order-create.md).

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `poNumber` | string | otomatik | `PO-YYYYMM-NNNN` | Ay içinde sıralı; değiştirilemez |
| `supplierId` | ref | evet | — | Yalnız Aktif tedarikçi ([supplier.md](supplier.md)) |
| `warehouseId` | ref | evet | — | Hedef depo ([warehouse.md](warehouse.md)) |
| `status` | enum | — | `draft` | `draft`, `sent`, `confirmed`, `partial`, `received`, `complete`, `cancelled` |
| `currency` | string(3) | — | tedarikçinin para birimi; o da yoksa USD | Formda değiştirilemez |
| `orderDate` | date | hayır | bugün | |
| `expectedDeliveryDate` | date | hayır | — | Geçince PO "Gecikmiş"; onayda güncellenebilir |
| `lineItems[]` | liste | evet | — | 1–500 kalem |
| `lineItems[].sku` | string | evet | — | ≤100; katalogdaki SKU |
| `lineItems[].description` | string | evet (boş olabilir) | — | ≤500 |
| `lineItems[].quantity` | int | evet | 1 | 1–999999 |
| `lineItems[].unitPrice` | number | evet | — | 0.01–99999999.99, 2 ondalık; teslim alınan stoğun birim maliyeti |
| `lineItems[].receivedQuantity` | int | — | 0 | Teslim aldıkça artar; sipariş miktarını aşamaz |
| `lineItems[].status` | enum | — | `pending` | `pending`, `partial`, `received`, `cancelled` |
| `taxAmount`, `shippingCost`, `discountAmount` | number | hayır | 0 | ≥0, **tutar** |
| `subtotal`, `totalAmount` | hesaplanan | — | — | Toplam = Σ(miktar × birim fiyat) + vergi + kargo − indirim |
| `notes`, `internalNotes` | string | hayır | — | ≤2000. "Notlar" tedarikçi notu olarak etiketlidir ama sistem tedarikçiye iletmez |
| `supplierReference`, `trackingNumber`, `carrier` | string | hayır | — | Onay/teslim diyaloglarından |
| `cancellationReason` | enum + not | iptalde evet | — | `supplier_unavailable`, `pricing_issue`, `quality_concerns`, `delivery_delays`, `order_no_longer_needed`, `duplicate_order`, `supplier_rejected`, `budget_constraints`, `product_discontinued`, `other` |
| Teslim alma koşulu (kalem bazında) | enum | hayır | `good` | `good` İyi, `damaged` Hasarlı, `rejected` Reddedildi, `inspection_required` İnceleme Gerekli |

## Durum geçişleri
| Durumdan | Aksiyon | Duruma | Stok etkisi |
|---|---|---|---|
| draft | Tedarikçiye Gönder (≥1 kalem) | sent | yok; **e-posta gitmez** |
| draft | Sil | (kalıcı silinir) | yok |
| draft / sent / confirmed | İptal (neden zorunlu) | cancelled | confirmed'dan iptalde "Gelen" miktar geri düşer |
| sent | Onayla | confirmed | hedef depoda "Gelen" + sipariş miktarı |
| confirmed / partial | Teslim Al | partial ya da received | teslim alınan miktar hedef depoya **stok girişi**; "Gelen" − miktar |
| partial / received | Tamamla | complete | yok; tedarikçi performansı güncellenir. Teslim alınmamış kalem varsa reddedilir (`PO_CANNOT_COMPLETE`) |
| complete / cancelled | — | — | son durum |

## Kurallar
- Düzenleme ve silme yalnız `draft` (`PO_INVALID_STATUS`); geçersiz geçiş `PO_INVALID_TRANSITION`.
- Kalan miktardan fazla teslim alınamaz (`PO_QUANTITY_EXCEEDS_ORDERED`); bilinmeyen kalem `PO_LINE_ITEM_NOT_FOUND`.
- Kısmi teslim alınmış PO iptal edilemez.
- Teslim alınan stok geri alınmaz; düzeltme stok ekranından ayrı iş olarak yapılır.
- Bulunamayan PO → `PO_NOT_FOUND`.
- Birim fiyat ve finansal özet `po:view_costs` yetkisi olmadan gizlenir.

## İlişkiler
| İlişki | Not |
|---|---|
| PO → Tedarikçi | N–1, yalnız aktif |
| PO → Hedef depo | N–1 |
| PO kalemi → Stok (SKU + depo) | Teslimde stok girişi; yoksa stok kaydı açılır ([stock.md](stock.md)) |
| PO → Stok hareketi | Her teslim kaydı PO numarası referanslı giriş hareketi |
| Yeniden sipariş raporu → PO | "PO Oluştur" SKU'yu forma taşır |
