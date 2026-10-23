# Entity: Attribute (Öznitelik)

Ürünlere değer olarak bağlanan özellik tanımı (renk, dahili hafıza, ekran boyutu…). Mağaza (tenant) genelinde tanımlıdır;
ürüne doğrudan değil **attribute set** üzerinden bağlanır.

- Ekranlar: [../screens/attributes/attribute-list.md](../screens/attributes/attribute-list.md),
  [../screens/attributes/attribute-create.md](../screens/attributes/attribute-create.md),
  [../screens/attributes/attribute-edit.md](../screens/attributes/attribute-edit.md).
- API: `GET/POST /attributes`, `GET/PATCH/DELETE /attributes/{id}`, `GET /attributes/code/{code}`, toplu güncelle/sil.

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan (tam form) | Kural / not |
|---|---|---|---|---|
| `code` | string | evet | label'dan türetilir | Mağaza içinde benzersiz → `ERR_ATTRIBUTE_CODE_EXISTS` (409). Küçük harfle başlar; yalnız küçük harf, rakam, alt çizgi; max 60. **Değiştirilemez.** |
| `label` | string | evet | '' | Max 255. Varsayılan (fallback) etiket. |
| `description` | string | hayır | '' | Max 1000 |
| `type` | enum | evet | `text` | Değerler: `text, number, boolean, select, multiselect, date, datetime, url, email, textarea, html, image, file, price, weight, color, json`. Tip değişikliği: attribute bir sette ya da ürün değerinde kullanılıyorsa **yasak** → `ERR_ATTRIBUTE_TYPE_IMMUTABLE` (409). |
| `inputType` | enum | evet | tipin ilk uyumlu girişi | Uyum tablosu aşağıda. |
| `isRequired` | bool | hayır | false | Ürün formunda zorunluluk **attribute'un bu bayrağından** gelir; **taslak kaydı bile engeller** (bkz. [../screens/products/product-create.md](../screens/products/product-create.md)). Configurable üründe varyant ekseni olan kod zorunluluktan düşer. Bu yüzden zorunlu bayrağını idareli kullan. |
| `isUnique` | bool | hayır | false | |
| `isActive` | bool | hayır | true | Vitrin filtre/özellik listelerinde yalnız aktif attribute'lar görünür. Kullanımdaki bir attribute'u gizlemek için pasif yap. |
| `isGlobal` | bool | hayır | false | Bilgi amaçlı ("tüm mağazalarda aynı değer"). |
| `isSearchable` | bool | hayır | false | Vitrin aramasına girer; değişince ilgili ürünler yeniden işlenir (gecikmeli yansır). |
| `searchWeight` | number | hayır | boş | UI 1–10. |
| `isFilterable` | bool | hayır | false | Vitrin katmanlı navigasyon filtresi. Filtre **global**dir: kategori bazında filtre seçimi yoktur. |
| `layeredNavigationMode` | `automatic`/`alphabetical`/`manual` | hayır | boş (= automatic) | |
| `isVisibleInAdvancedSearch` | bool | hayır | false | |
| `isUsedInProductListing` | bool | hayır | false | |
| `isUsedInGrid` | bool | hayır | false | Admin ürün tablosunda sütun. |
| `isUsedForSortBy` | bool | hayır | false | |
| `isComparable` | bool | hayır | false | |
| `isVisibleOnFront` | bool | hayır | **true** | Ürün sayfasında "özellikler" listesinde görünme. |
| `isHtmlAllowedOnFront` | bool | hayır | false | |
| `isWysiwygEnabled` | bool | hayır | false | |
| `isUsedForPromoRules` | bool | hayır | false | |
| `isFeatured` | bool | hayır | false | Ürün sayfasında "Öne çıkanlar / Main Features". |
| `featuredIcon` | string (URL) | hayır | '' | Yalnız `isFeatured` açıkken UI'da görünür. |
| `sortOrder` | number | hayır | 0 | |
| `defaultValue` | any | hayır | — | UI'da düz metin input. |
| `options[]` | etiket, sıra, varsayılan, (color tipinde) hex renk | select/multiselect/color için pratikte evet | [] | Seçenek etiketi zorunlu. Sıra = listedeki sıra. Seçenek değeri otomatik atanır ve etiket değişse de korunur. |
| `validation` | min/max uzunluk, min/max değer, desen, hata mesajı | hayır | {} | Desen geçerli bir regex olmalı; performans riskli desenler reddedilir. |
| `translations[]` | store view başına seçenek etiketleri | hayır | [] | UI'da yalnız **seçenek** çevirileri düzenlenebilir (seçenek tablosunda store view sütunları). Attribute label çevirisi UI'da yapılamaz. |
| `scope` | `global`/`website`/`store` | hayır | **global** | Set ekranındaki "Yeni Oluştur" diyaloğuyla oluşturulanlarda `store`. |
| `applyTo[]` | ürün tipleri | hayır | [] | Boş = tüm ürün tipleri. Değerler: `simple, configurable, grouped, virtual, bundle, downloadable, gift_card, subscription`; geçersizse `ATTRIBUTE_APPLY_TO_INVALID`. Ürün formu, ürün tipine uymayan attribute'u gizler. |
| `note` | string | hayır | '' | Yalnız admin notu. |

Set ekranındaki "Yeni Oluştur" diyaloğuyla (ya da preset ile) oluşturulan attribute'ların varsayılanları farklıdır:
Aramada Kullan **açık**, Katmanlı Navigasyonda Kullan **açık**, Katalog Sayfalarında Görünür **kapalı**, kapsam `store`.

### type → inputType uyumu (UI)
| type | izinli inputType (ilk = varsayılan) | Seçenek sekmesi |
|---|---|---|
| text | text, password | — |
| textarea | textarea, wysiwyg | — |
| number | number, range | — |
| price / weight | number | — |
| select | select, radio | **evet** |
| multiselect | multiselect, checkbox | **evet** |
| color | color, text | **evet** (+ renk hex sütunu) |
| boolean | checkbox, radio, select | — |
| date / datetime | date / datetime-local | — |
| url / email | url\|text / email\|text | — |
| html | wysiwyg, textarea | — |
| image / file | file | — |
| json | json-editor, textarea | — |

## Varyant (configurable) ilişkisi — ÖNEMLİ
- Attribute'ta "varyant için kullan / configurable" bayrağı **yoktur**. Configurable ürünün varyant eksenleri ürün formunda
  **serbest metin kod + değer listesi** ile tanımlanır (gösterim: dropdown / swatch / button).
- Bağlantı **kod eşleşmesi** ile: varyant ekseni kodu attribute kodu ile aynıysa (ör. `renk`), ürün formunda o attribute
  zorunluluktan düşer ve silme koruması ürünü "kullanıyor" sayar.
- Pratik kural: varyant eksenleri (renk, dahili hafıza, beden) için `select` (renk için `color`) tipinde attribute oluştur,
  `applyTo`'yu boş bırak ya da `configurable`'ı dahil et, `isFilterable` aç; ürün ekranında aynı **code** ile eksen tanımla.

## Kategori ilişkisi
- Attribute ile kategori arasında doğrudan bağ yoktur. Vitrin filtreleri **global** `isFilterable` bayrağından gelir.

## İş kuralları
| Kural | Hata |
|---|---|
| code mağaza içinde benzersiz | `ERR_ATTRIBUTE_CODE_EXISTS` 409 |
| code güncellenemez | (UI'da alan kilitli) |
| tip değişikliği yalnız kullanılmıyorken | `ERR_ATTRIBUTE_TYPE_IMMUTABLE` 409 |
| applyTo yalnız geçerli ürün tipleri | `ATTRIBUTE_APPLY_TO_INVALID` |
| searchWeight 0–10 | 400 |

## Silme / kaskad
- Tek silme (`DELETE /attributes/{id}`):
  1. Herhangi bir attribute sette geçiyorsa → `ERR_ATTRIBUTE_IN_USE_BY_ATTRIBUTE_SETS` 409 (önce setten çıkar).
  2. Bir ürün bu attribute için değer taşıyorsa ya da configurable ürün/varyant bu kodu eksen olarak kullanıyorsa →
     `ERR_ATTRIBUTE_IN_USE_BY_PRODUCTS` 409.
  3. Aksi halde **kalıcı silinir**.
- Toplu silme aynı kuralları satır bazında uygular; reddedilenleri ayrı raporlar.
- Alternatif: kullanımdaysa `isActive=false` (gizle).

## Yetki
- Admin UI düğmeleri: `products` create / update / delete.
- İşlemler: `attributes:read|write|delete`. Admin rolleri (`super_admin, admin, security_admin`) tüm yetkilere sahiptir.
