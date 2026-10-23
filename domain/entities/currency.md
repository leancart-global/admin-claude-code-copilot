# Entity: Currency (Para Birimi)

Mağazada kullanılabilen para birimi ve temel para birimine göre kuru. Store view para birimi, ürün fiyat para birimi ve
çevrilmiş fiyat gösterimi buna dayanır. Tenant genelinde tanımlıdır; kod ile tanımlanır.

- Ekran: [../screens/settings/currencies.md](../screens/settings/currencies.md).

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `code` | ISO-4217 (3 büyük harf) | evet | — | Mağaza içinde benzersiz (409). UI seçenekleri: USD, EUR, GBP, TRY, JPY, CNY, SAR, AED. **Değiştirilemez** |
| `name` | string | evet | koddan | |
| `symbol` | string | evet | koddan | |
| `exchangeRate` | number ≥0 | — | 1 | 1 birim bu para birimi = X temel para birimi. Kuru **1** olan para birimi "Temel / Base" sayılır |
| `rateSource` | `manual` / `tcmb` | — | `manual` | `tcmb`: kayıtta ve periyodik olarak TCMB kuru çekilir; TCMB'nin yayınlamadığı kod için hata. TRY için her zaman 1 |
| `rateLastUpdated` | tarih | — | otomatik | Kur değişince güncellenir |
| `decimalPlaces` | 0–4 | — | 2 | |
| `symbolPosition` | `before`/`after` | — | `before` | UI'da düzenlenmez |
| `isActive` | bool | — | true | Pasif para birimi store view ve varsayılan fiyatlandırma seçicilerinde çıkmaz |

Mağaza düzeyi ayar: **Varsayılan Fiyatlandırma Para Birimi** (aktif para birimlerinden biri) — para birimi belirtilmeyen
yeni ürünler bunu kullanır; seçili değilse ürün satışı/oluşturma engellenir (`TENANT_PRICING_CURRENCY_NOT_CONFIGURED`,
bkz. [product.md](product.md)). Seçim anında kaydolur.

## Kurallar
- Silme: bir store view kullanıyorsa reddedilir → `ERR_CURRENCY_IN_USE` (409) "Currency X is used by store views: …".
- Kur değişikliği (manuel, TCMB, "Kurları Güncelle") o para birimindeki çevrilmiş fiyatları ve vitrin aramasındaki fiyatları günceller.
- TCMB kaynaklı kurlar hafta içi mesai saatlerinde kendiliğinden yenilenir.
- Aktiflik değişimi liste menüsünden anında kaydolur.

## İlişkiler
| İlişki | Not |
|---|---|
| Store view → para birimi | [store-view.md](store-view.md) |
| Ürün fiyatı → para birimi | ürün para birimi ya da varsayılan fiyatlandırma para birimi |
| Sipariş / ödeme | sipariş para birimi; ödeme sağlayıcı desteklediği para birimleri (doğrulanmadı) |
