# Entity: Stock Transfer (Depolar Arası Stok Transferi)

Aynı mağazanın iki deposu arasında stok taşıma kaydı.

- Ekran: [../screens/inventory/transfers.md](../screens/inventory/transfers.md).

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `transferNumber` | string | otomatik | `TRF` + YYYYAAGG + sıra | Değiştirilemez |
| `fromWarehouseId` | ref | evet | — | Kaynak depo |
| `toWarehouseId` | ref | evet | — | Hedef depo; kaynakla aynı olamaz |
| `status` | enum | — | `requested` | `requested` (Talep Edildi; detayda "Onay Bekliyor"), `approved`, `shipped`, `in_transit`, `received`, `completed`, `cancelled` |
| `items[]` | liste | evet | — | 1–100 kalem |
| `items[].sku` | string | evet | — | Kaynak depoda stok kaydı olmalı |
| `items[].quantity` | int | evet | — | ≥1; kaynakta kullanılabilir miktarı aşamaz |
| `items[].lotNumber` | string | hayır | — | |
| `items[].receivedQuantity`, `variance` | int | — | — | Teslim kaydında girilir; fark = teslim alınan − gönderilen |
| `expectedArrivalDate`, `trackingNumber`, `carrier` | | hayır | — | API'de var; ekranda giriş alanı yok |
| `notes` | string | hayır | — | Tamamlandı/İptal dışında düzenlenebilir |
| `cancellationReason` | string | iptalde | "Yönetici tarafından iptal edildi" | |

## Durum geçişleri ve stok etkisi
| Durumdan | Aksiyon | Duruma | Yetki | Stok etkisi |
|---|---|---|---|---|
| — | Oluştur | requested | `inventory:write` | Yok (yalnız yeterlilik kontrolü: `INSUFFICIENT_STOCK`) |
| requested | Onayla | approved | `inventory:admin` | Yok |
| approved | Gönder | shipped | `inventory:write` | Kaynakta miktar **rezerve** (satışa kapanır); transfer çıkış hareketi |
| shipped / in_transit | Teslim kaydı | received | `inventory:write` | Yok; fark kaydedilir |
| received | Tamamla | completed | `inventory:write` | Hedefe teslim alınan miktar **girer**; kaynaktaki rezerve gönderilen miktar kesin düşer; transfer giriş hareketi. Fark varsa tamamlama reddedilir (zorla tamamlama ekranda yok) |
| requested / approved | İptal | cancelled | `inventory:write` | Yok |

## Kurallar
- Gönderildikten sonra iptal edilemez.
- Kaynak = hedef → reddedilir; olmayan depo/transfer → `NOT_FOUND`.
- Dış sistem (kargo, e-posta) tetiklenmez.

## İlişkiler
| İlişki | Not |
|---|---|
| Transfer → Depolar | kaynak + hedef ([warehouse.md](warehouse.md)) |
| Transfer kalemi → Stok | kaynakta rezervasyon/düşüm, hedefte giriş ([stock.md](stock.md)) |
| Transfer → Stok hareketleri | çıkış (gönderimde) ve giriş (tamamlamada), transfer numarası referanslı |
| Raporlar | Transfer çıkışı yaşlanma ve yeniden sipariş hızına "satış" gibi dahil |
