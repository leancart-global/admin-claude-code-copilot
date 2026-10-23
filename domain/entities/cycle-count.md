# Entity: Cycle Count (Stok Sayımı)

Bir depodaki belirli SKU'ların fiziksel sayımı; sistem stoğuyla farkı kaydeder ve (tolerans/onay kuralıyla) stoğu sayılan miktara eşitler.

- Ekran: [../screens/inventory/cycle-counts.md](../screens/inventory/cycle-counts.md).

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `countNumber` | string | otomatik | `CNT…` | Değiştirilemez |
| `name` | string | evet | — | 1–100 (ABC planlamada "ABC Count - {sınıf} - {SKU}") |
| `warehouseId` | ref | evet | — | |
| `type` | enum | evet | `cycle_count` | Ekranda: `cycle_count` Sayım, `full_count` Tam Sayım, `abc_count` ABC Sayımı. Diğer değerler (spot, velocity, variance, audit, annual, blind, verification) yalnız etiket olarak görünür |
| `priority` | enum | hayır | `normal` | Ekranda `normal`, `high`, `urgent`; ABC planlaması `low` da atar |
| `status` | enum | — | `scheduled` | Planlandı → Devam Ediyor → (Tamamlandı \| Onay bekliyor → Onaylandı \| Reddedildi) ; İptal Edildi |
| `scheduledDate` | date | evet | bugün | |
| `specificSkus` | liste | evet (manuel) | — | Sayılacak SKU'lar; en az 1 |
| `locations` | liste | hayır | — | Raf/konum kodları |
| `abcClassification` | A/B/C | — | — | ABC planlamada |
| `requiresApproval` | bool | — | false (A sınıfında true) | |
| Tolerans (%) | number | — | 5 | Bu yüzdeye kadar olan fark onaysız stoğa yazılır |
| Kalem kaydı | — | — | — | SKU, sistem miktarı (gönderim anında), sayılan, fark, fark %, fark değeri (birim maliyetle), not |
| `totalVarianceValue`, `accuracyRate`, `hasVariances` | hesaplanan | — | — | Salt okunur |

## Kurallar
- Başlatma yalnız Planlandı'da; sonuç gönderme Planlandı/Devam Ediyor'da; iptal yalnız Planlandı/Devam Ediyor'da.
- **Gönderimde** tolerans içi farklar anında stoğa yazılır; tolerans dışı fark varsa sayım onaya düşer.
- Onay (`inventory:admin`) kalan farkları stoğa yazar; red (`inventory:admin`, sebep zorunlu) stoğu değiştirmez.
- Stok, rezerve miktarın altına eşitlenemez (`INSUFFICIENT_STOCK`).
- ABC planlama: stok değerine göre A/B/C; sayım aralığı A 7, B 30, C 90 gün; açık sayımı olan veya aralığı dolmamış SKU için yeni sayım açılmaz; SKU başına bir sayım oluşturur. B ve C sınıfında düzeltmeler onaysız yazılabilir; A sınıfı onay ister.
- Bulunamayan sayım → `NOT_FOUND`; geçersiz durum → `INVALID_OPERATION`.

## İlişkiler
| İlişki | Not |
|---|---|
| Sayım → Depo | N–1 ([warehouse.md](warehouse.md)) |
| Sayım kalemi → Stok (SKU + depo) | Eşitleme; son sayım tarihi/miktarı stok kaydına yazılır ([stock.md](stock.md)) |
| Sayım → Stok hareketleri | "sayım" türünde düzeltme hareketi, sayım referanslı |
