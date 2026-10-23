# Entity: Product (ürün) + Variant + Translation

- Ürün; varyantları ve store view çevirileri ürüne bağlı ayrı kayıtlar olarak tutulur.
- Ekranlar: ../screens/products/product-create.md, product-edit.md, product-detail.md, product-list.md, product-bulk-edit.md, product-new-by-code.md, product-pricing-report.md.

## Enum'lar
| Enum | Değerler |
|---|---|
| Tip (`type`) | `simple`, `configurable`, `grouped`, `virtual`, `bundle`, `downloadable`, `gift_card`, `subscription` |
| Durum (`status`) | `draft`, `published`, `archived`, `out_of_stock`, `discontinued` |
| Oluştururken izinli durum | `draft`, `published`, `archived` |
| Görünürlük (`visibility`) | `visible_everywhere`, `catalog`, `search`, `not_visible` |
| Ağırlık birimi (form) | `kg`, `g`, `lb`, `oz` (vars. kg) |
| Boyut birimi (form) | `cm`, `m`, `in`, `ft` (vars. cm) |
| Kademe fiyat tipi | `fixed`, `percentage` |
| Paket fiyat tipi | `fixed`, `dynamic` |
| Abonelik aralığı | `daily`, `weekly`, `monthly`, `yearly` |
| İlişki tipi | `related`, `up_sell`, `cross_sell` |
| Medya tipi | `image`, `video` |
| Varyant ekseni görünümü | `dropdown`, `swatch`, `button` |

## Alanlar (form key → API alanı)
"Form kuralı" = admin formunun uyguladığı; "Taslak" = durum Yayında değilken bile kaydı engelleyen; "Sistem kuralı" = kaydın her yoldan (form, CSV, toplu işlem) tabi olduğu kural.

| Form key | API alanı | Tip | Form kuralı | Taslak | Sistem kuralı |
|---|---|---|---|---|---|
| `name` | `name` | string | 3–200 | **Evet** | Zorunlu |
| `sku` | `sku` | string | 2–50 | **Evet** | Zorunlu, **mağaza içinde benzersiz** (çakışmada "Product with this SKU already exists") |
| – | `slug` | string | (varsayılan scope'ta alan yok) | – | Opsiyonel; yoksa addan üretilir ve benzersizleştirilir |
| `description` | `description` | string (düz metin) | doluysa ≥10 | – | Zorunlu (boşsa admin ürün adını gönderir) |
| `shortDescription` | `shortDescription` | string | ≤500 | – | ≤500 |
| `type` | `type` | enum | Evet | – | Oluşturulduktan sonra değiştirilemez |
| `status` | `status` | enum | vars. draft | – | oluştururken: draft/published/archived; **Yayında ⇒ ≥1 kategori** (oluşturma, güncelleme, toplu işlem, çoğaltma) |
| `visibility` | `visibility` | enum | vars. visible_everywhere | – | enum |
| `categoryIds` | `categoryIds` | id[] | Yayında ≥1 | – | Yayında ≥1; tekrarlar ayıklanır |
| `tags` | `tags` | string[] | – | – | – |
| `attributeSetId` | `attributeSetId` | id | Yayın için **Evet** | – | Opsiyonel |
| `customAttributes.{code}` | `attributes` | kod → değer | set'te zorunlu olanlar | **Evet** (zorunlu attribute'lar) | – |
| `currency` | `currency` | ISO-4217 | 3 harf | – | Opsiyonel; yoksa tenant varsayılan fiyat para birimi, o da yoksa `TENANT_PRICING_CURRENCY_NOT_CONFIGURED` |
| `basePrice` | `price` | number | ≥0, 2 hane | – | **Zorunlu** ≥0 |
| `compareAtPrice` | `compareAtPrice` | number | > temel fiyat | – | ≥0 |
| `cost` | `costPrice` | number | ≤2×temel fiyat | – | ≥0. Yalnız admin'de görünür (vitrinde/public API'de yok) |
| `specialPrice` | `specialPrice` | number | < temel fiyat (0=temizle) | – | ≥0 |
| `specialPriceStart/End` | `specialPriceFrom/To` | tarih\|boş | bitiş > başlangıç | – | boş = temizle. Tarih aralığına göre otomatik aktifleşir/biter |
| `tierPrices[]` | `tierPrices[]` | {customerGroupId?, minQty, price, priceType} | Min Miktar ≥2 | – | yeni/değişen kural **min. miktar ≥ 2**, aksi `ERR_TIER_PRICE_MIN_QTY_INVALID` |
| `taxable` | – | bool | – | – | – |
| `taxClass` | `taxClassId` | id | – | – | Opsiyonel; yoksa tenant varsayılan vergi sınıfı; verilirse mevcut olmalı (`ERR_TAX_CLASS_NOT_FOUND`), pasif sınıf kabul edilir |
| `qty` | `quantity` | tam sayı | ≥0 | – | **Zorunlu** ≥0 (oluşturma). Varyantlıda 0 |
| `warehouseId` | `warehouseId` | id | – | – | Ürüne kaydedilmez; stoğun yazılacağı depo. Oluşturma: yoksa varsayılan depo; o da yoksa `WAREHOUSE_NOT_CONFIGURED`. Güncellemede stok değişiyorsa **zorunlu** (`WAREHOUSE_ID_REQUIRED`) |
| `trackInventory` / `allowBackorder` / `lowStockThreshold` | aynı | bool/bool/tam sayı | – | – | – |
| `weight` (+`weightUnit`) | `weight`, `dimensions.weight/weightUnit` | number | ≥0 | – | ≥0; boş = temizle |
| `length/width/height`, `dimensionUnit` | `dimensions{...,unit}` | number | ≥0 | – | – |
| `requiresShipping` | `isShippable` | bool | virtual/downloadable/gift_card'da `false` | – | – |
| `freeShipping` | `freeShipping` | bool | kargoya uygun değilse false | – | – |
| `shippingClass` | `shippingClass` | string | – | – | – |
| `media[]` | `media[]` | {url,type,alt,title,isMain,sortOrder,variantAttributes} | url geçerli; ≤20 | – | `url` zorunlu (geçerli URL). Yalnız bir ana görsel |
| `seo.*` | `seo{title,description,keywords,focusKeyword,canonicalUrl,og*,twitter*,indexable,followable}` | obje | metaTitle≤100, metaDescription≤300, canonical geçerli URL | – | – |
| `barcode` | `barcode` | string\|boş | 8/12/13/14 hane | – | aynı kural |
| `ean` | `ean` | string\|boş | 13 hane | – | aynı |
| `countryOfManufacture` | aynı | ISO-3166 alpha-2 | 2 harf | – | 2 büyük harf |
| – | `upc`, `mpn`, `gtin` | string | formda yok | – | opsiyonel |
| – | `brandId` | id | **formda yok** | – | opsiyonel (yalnız CSV içe aktarma ile atanır) |
| `isFeatured`, `isNew`, `isBestseller` | `isFeatured`, `isNewProduct`, `isBestseller` | bool | – | – | – |
| `allowReviews`, `giftMessageAvailable`, `canBeGiftWrapped`, `isReturnable`, `isComparable` | aynı | bool | – | – | – |
| `relatedProducts/upsellProducts/crossSellProducts` | `relations[]{type,productId,sortOrder}` | – | – | – | ürün kendisiyle ilişkilendirilemez (`PRODUCT_RELATION_SELF_REFERENCE`) |
| `configurableAttributes[]` | `configurableAttributes[]` | {code,label,values[{label,value,isDefault,hexColor}],displayType,position} | varyantlıda ≥1, kodlar benzersiz | – | kodlar benzersiz |
| `variants[]` | (ayrı kayıt) | bkz. Variant | varyantlıda ≥1 | – | – |
| `bundleItems`, `bundlePriceType`, `shipTogether` | `bundleConfig{bundleType, bundleItems[{productId,quantity,minQuantity,maxQuantity,isRequired,canChangeQuantity,position}], bundlePricing{type,fixedPrice,allowDiscounts}, bundleShipping{shipTogether,allowSeparateShipping}}` | – | ≥2 öğe | – | – |
| `downloadableFiles[]` | indirilebilir dosyalar | {name,url,source,downloadLimit,linkExpiry} | ≥1 dosya (yayın) | – | – |
| `allowCustomAmount`, `giftCardAmounts`, `minAmount`, `maxAmount`, `expiryDays` | hediye kartı tutar ayarları | – | – | – | – |
| `interval`, `intervalCount`, `trialDays`, `recurrenceCount`, `cancellationTerms` | `subscriptionPlan{...}` | – | aralık, dönem ≥1, iptal koşulları 1–2000; tekrar sayısı 0 | – | abonelik tipinde **plan zorunlu** (oluşturma + güncelleme, `PRODUCT_SUBSCRIPTION_PLAN_REQUIRED`) |
| `groupedProducts[]` | gruplu ürün öğeleri | {productId, defaultQty} | ≥2 | – | – |
| `translations[]` | (ayrı kayıt) | bkz. Translation | – | – | – |

API'de olup admin formunda olmayanlar (bilgi): `minOrderQty`, `maxOrderQty`, `qtyIncrements`, `condition`, `msrp`, `adsExcluded`, `newFrom/newTo`, `publishedAt`, `isActive`, `sortOrder`.

## Variant
- İşlemler: toplu ve atomik oluşturma (ürün oluşturulduktan sonra), değişiklik bazlı toplu güncelleme (edit), listeleme. Yetki `products:write` / `products:read`.
- Varyant alanları: `sku` (≥2, zorunlu), eksen değer kombinasyonu (`attributeValues`: eksen kodu, değer, etiket), stok miktarı, varsayılan mı, opsiyonel `barcode`, `ean`, `price` (boşsa ana ürün fiyatı), `compareAtPrice`, `weight`, görseller, depo.
- Kural: stok miktarı > 0 ⇒ depo zorunlu (formda kayıttan önce engellenir; `WAREHOUSE_ID_REQUIRED`).
- Yan etki: her varyant için depoda stok satırı oluşur. Varyantlı ana ürünün stoğu varyant toplamıdır; ana ürüne doğrudan stok yazılamaz (`PRODUCT_STOCK_NOT_EDITABLE_FOR_CONFIGURABLE`).
- Varyant eksenleri ürün içinde serbest metindir (global Attribute kaydına bağlanmaz). Eksen kodu attribute set'teki bir attribute koduyla aynıysa o attribute ürün seviyesinde düzenlenemez ("varyant bazında").

## Translation
- İşlemler: ürünün çevirilerini listele, oluştur {ürün, store view, ad, slug, açıklama, kısa açıklama?, seo?}, güncelle, sil.
- Store view başına bir çeviri. Panelde çevrilebilir alanlar: ad, slug, açıklama, kısa açıklama, meta başlık (≤60), meta açıklama (≤160). API ayrıca canonical URL, robots, OG alanları ve medya alt/başlık çevirisini destekler (panelde yok).
- Yalnızca **edit** ekranında yazılır; create ekranı çeviri kaydetmez.

## İlişkiler
| İlişki | Alan | Hedef entity | Zorunluluk | Oluşturan ekran |
|---|---|---|---|---|
| Kategori | `categoryIds[]` | Category | Yayında ⇒ ≥1 | ../screens/categories/category-create.md |
| Attribute set | `attributeSetId` | AttributeSet (+ Attribute'lar) | formda yayın için evet | ../screens/attributes/attribute-set-create.md |
| Attribute değerleri | `attributes{code: value}` | Attribute (select/multiselect seçenek değerleri) | set'te zorunlu olanlar | ../screens/attributes/attribute-create.md |
| Marka | `brandId` | Brand | opsiyonel; formda alan henüz yok (geliştiriliyor) | ../screens/brands/brand-create.md |
| Vergi sınıfı | `taxClassId` | TaxClass | opsiyonel (varsayılan atanır) | ../screens/settings/tax-classes.md |
| Para birimi | `currency` | Currency (aktif) | ürün veya tenant varsayılanı | ../screens/settings/currencies.md |
| Müşteri grubu | `tierPrices[].customerGroupId` | Müşteri fiyat grubu | opsiyonel | ../screens/customers/customer-groups.md |
| Depo | `warehouseId` (yalnız kayıt anında) | Warehouse | stok>0 ise (oluşturma: varsayılan depo yeter; güncelleme/varyant: açık seçim) | [../screens/inventory/warehouses.md](../screens/inventory/warehouses.md) |
| Stok | depo stok kaydı | Envanter | oluşturmada miktar>0 ise yazılır; yazılamazsa ürün oluşturulmaz | (ekran: `/inventory/stock/product/{id}`) |
| Store view | çeviri → store view | StoreView | ≥1 aktif store view ürün oluşturma ön koşulu | ../screens/settings/store-views.md |
| Medya | `media[].url` | Medya kütüphanesi | opsiyonel | ../screens/content/media-library.md |
| İlişkili ürünler | `relations[]`, paket öğeleri, gruplu öğeler | Product | – | bu ekranlar |
| Etiket / Özel seçenek / Zamanlanmış güncelleme | ürünün alt kayıtları | – | yalnız edit | ../screens/products/product-edit.md |

## Yaşam döngüsü
- Oluştur (taslak/yayında) → güncelle → **arşivle** (durum = Arşivlendi, stok değişmez) → **geri yükle** (durum = **Taslak**) → **kalıcı sil** (yalnız arşivli, `products:delete:permanent`, SKU onayı; açık siparişlere ayrılmış stok varsa silinemez).
- Vitrin araması oluşturma/güncellemeden birkaç dakika sonra güncellenir; "Görünmez" veya silinmiş ürün aramadan çıkar.

## Yetkiler
`products:read` (görüntüleme), `products:write` (oluştur/güncelle/geri yükle/çoğalt/toplu), `products:delete` (arşivle), `products:delete:permanent` (kalıcı silme), `products:bulk` (toplu işlemler menüsü).
