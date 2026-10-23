# Entity: Supplier (Tedarikçi)

Mal satın alınan firma. Satın alma siparişinin (PO) zorunlu tarafıdır; PO'nun para birimi tedarikçiden gelir.

- Ekran: [../screens/inventory/suppliers.md](../screens/inventory/suppliers.md).
- Kullanıldığı yer: [purchase-order.md](purchase-order.md).

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `code` | string | evet | — | Formda 2–20 kr; yalnız büyük harf, rakam, tire. Mağaza içinde benzersiz (`SUPPLIER_CODE_EXISTS`, 409). Formda sonradan değiştirilemez |
| `name` | string | evet | — | Formda 2–100 kr |
| `description` | string | hayır | — | ≤500 |
| `status` | enum | — | formda `pending_approval` | `active` (Aktif), `inactive` (Pasif), `suspended` (Askıya Alınmış), `pending_approval` (Onay Bekliyor) |
| `contactName`, `contactEmail`, `contactPhone` | string | hayır | — | Kişisel veri. E-posta geçerli formatta, ≤255; telefon ≤50 |
| `addressLine1`, `addressLine2`, `city`, `state`, `postalCode`, `countryCode` | string | hayır | ülke `TR` | Ülke ISO-2; Türkiye'de il/ilçe listeden |
| `paymentTerms` | enum | hayır | — | `COD`, `CIA`, `NET7`, `NET15`, `NET30`, `NET45`, `NET60`, `NET90`, `EOM`, `MFI`, `2/10NET30` |
| `leadTimeDays` | int | hayır | 0 | 0–365; bilgi amaçlı |
| `minimumOrderAmount` | number | hayır | — | Pozitif tutar; bilgi amaçlı |
| `currency` | string(3) | hayır | — | ISO 4217. **PO para birimi buradan alınır** |
| `taxId` | string | hayır | — | ≤50 |
| `rating`, `onTimeDeliveryRate`, `qualityRate`, `totalOrders`, `totalSpend` | hesaplanan | — | — | Salt okunur; PO "Tamamlandı" yapıldıkça güncellenir |

## Kurallar
- Yalnız `active` tedarikçi PO'da seçilebilir; diğer durumlarda PO oluşturma `SUPPLIER_INACTIVE` ile reddedilir.
- "Sil" kaydı kaldırmaz, durumu `inactive` yapar; kayıt listede kalır ve tekrar "Aktif" yapılabilir.
- Durum, detay ekranındaki Select'ten diyalogsuz ve anında değişir.
- Bulunamayan tedarikçi → `SUPPLIER_NOT_FOUND`.

## İlişkiler
| İlişki | Not |
|---|---|
| Tedarikçi → Satın alma siparişleri | 1–N; PO para birimi tedarikçiden |
| Tedarikçi performansı | PO tamamlanınca: sipariş sayısı +1, harcama + PO toplamı, zamanında teslim (beklenen teslim tarihine göre) |
