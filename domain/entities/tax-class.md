# Entity: Tax Class (Vergi Sınıfı)

Ürüne atanan vergi (KDV) oranı tanımı. Ürünün vergi sınıfı boşsa mağazanın **varsayılan** vergi sınıfı uygulanır. Fiyatın
vergi dahil/hariç yorumu ve gösterimi ayrı bir mağaza ayarıdır ([../screens/settings/taxes.md](../screens/settings/taxes.md)).

- Ekran: [../screens/settings/tax-classes.md](../screens/settings/tax-classes.md).

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `code` | string | evet | addan türetilir | ≤50; küçük harfle başlar, yalnız küçük harf/rakam/alt çizgi. Mağaza içinde benzersiz (409). **Değiştirilemez** |
| `name` | string | evet | — | ≤100 |
| `type` | enum | evet | — | `standard`, `reduced`, `super_reduced`, `zero`, `exempt` (Standart, İndirimli, Süper İndirimli, Sıfır Oran, Muaf) |
| `rate` | number (%) | evet | — | 0–100; 20 = %20 |
| `description` | string | hayır | — | ≤500 |
| `isActive` | bool | — | true | Pasif sınıf ürün formundaki seçicide görünmez |
| `isDefault` | bool | — | false | Tek varsayılan: biri varsayılan yapılınca diğerinin işareti kalkar |

Hazır set ("Varsayılan Vergi Sınıflarını Oluştur", yalnız hiç sınıf yokken): `standard` %20 (varsayılan), `reduced` %10,
`super_reduced` %1, `zero` %0, `exempt` %0. Bu kodlu sınıfların adı/açıklaması arayüz diline göre çevrilmiş görünür.

## Kurallar
- Varsayılan sınıf silinemez → `ERR_TAX_CLASS_DEFAULT_UNDELETABLE` (409).
- Bulunamayan sınıf → `ERR_TAX_CLASS_NOT_FOUND` (ürüne olmayan sınıf atanırsa da).
- Oran değişikliği o sınıftaki tüm ürünlerin vergisini etkiler; varsayılan değişikliği sınıfı boş tüm ürünleri etkiler.
- Aktiflik, listedeki satır anahtarından anında kaydolur.

## İlişkiler
| İlişki | Not |
|---|---|
| Ürün → vergi sınıfı | opsiyonel; boşsa varsayılan ([product.md](product.md)) |
| Vergi ayarları | önizleme varsayılan sınıfın oranını kullanır |
| Sipariş / fatura | vergi tutarları sınıf oranından |
