# Entity: Attribute Set (Öznitelik Seti)

Ürün tipi/ailesi için attribute grubu (ör. "Cep Telefonu"). Ürün **tek bir** set seçer; ürün formundaki
"özel öznitelikler" sekmesi o setin attribute'larını bölüm (section) bölüm gösterir.

- Ekranlar: [../screens/attributes/attribute-set-list.md](../screens/attributes/attribute-set-list.md),
  [../screens/attributes/attribute-set-create.md](../screens/attributes/attribute-set-create.md),
  [../screens/attributes/attribute-set-edit.md](../screens/attributes/attribute-set-edit.md).
- API: `GET/POST /attribute-sets`, `GET /attribute-sets/default`, `GET/PATCH/DELETE /attribute-sets/{id}`,
  `GET /attribute-sets/{id}/with-attributes`, `POST|DELETE /attribute-sets/{id}/attributes/{attributeId}`.

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `code` | string | evet | — | Mağaza içinde benzersiz → 409 "Attribute set X already exists". Küçük harfe çevrilir. UI: küçük harfle başlar; yalnız küçük harf, rakam, alt çizgi; max 60. Değiştirilemez (edit ekranında kilitli). |
| `name` | string | evet | — | Max 255. |
| `description` | string | hayır | — | Max 1000. |
| `sortOrder` | number ≥0 | hayır | 0 | |
| `isActive` | bool | hayır | true | |
| `isDefault` | bool | hayır | false | Tek varsayılan: bir set varsayılan yapılınca diğerininki otomatik kalkar. Varsayılan set **silinemez**. Ürün formu varsayılan seti otomatik seçmez — doğrulanmadı. |
| `sections[]` | bölüm kodu, adı, sırası | hayır | [] | Bölüm kodu: 2–60 karakter, küçük harfle başlar; yalnız küçük harf, rakam, alt çizgi. Ad max 120. Set içinde bölüm kodları benzersiz → 400 `Duplicate section codes`. |
| `attributes[]` | attribute, bölüm, sıra, varsayılan değer | hayır | [] | Bölüm boşsa "Bölüm Yok" altında görünür. Aynı attribute bir sete iki kez eklenemez (UI yalnız eklenmemişleri listeler). |
| `assignedCategoryIds[]` | kategori listesi | hayır | [] | Kategoriler mağazada var olmalı → yoksa `CATEGORY_NOT_FOUND` 400. Yalnız edit ekranının Kategoriler sekmesinden atanır. |
| `translations[]` | store view başına ad/açıklama | hayır | [] | UI'da çeviri editörü yok. |

## Bölüm (section) ve sıralama semantiği
- Ürün formunda:
  - Setin **hiç bölümü yoksa**: tüm attribute'lar tek kartta sırayla gösterilir.
  - Bölüm **varsa**: attribute'lar bölüm sırası → attribute sırası ile bölüm kartlarında gösterilir. Bölüm kullanıyorsan
    her attribute'u bir bölüme ata.
  - `applyTo` ürün tipine uymayan attribute gizlenir.
- Attribute sırası, setteki listede eklenme sırasıdır.

## İş kuralları
| Kural | Hata |
|---|---|
| code benzersiz | 409 |
| bölüm kodu benzersiz, format | 400 |
| atanan kategoriler mevcut olmalı | 400 `CATEGORY_NOT_FOUND` |
| tek varsayılan | (otomatik düzeltme) |

## Silme / kaskad
- Varsayılan set → 409 "Cannot delete default attribute set" (UI'da Sil seçeneği zaten gizli).
- Bu seti kullanan ürün varsa → `ATTRIBUTE_SET_IN_USE` 409 ("Attribute set is in use by products").
- Aksi halde kalıcı silinir. Attribute'lar silinmez; ama artık sette olmadıkları için silinebilir hale gelirler.
- Attribute'u setten çıkarmak ürünlerdeki değerleri silmez — doğrulanmadı.

## Bağımlılıklar
- Önce: attribute'lar ([attribute.md](attribute.md)) — set yalnız var olan attribute'ları içerir
  (set ekranındaki "Yeni Oluştur" diyaloğu attribute'u hemen kaydeder).
- Sonra: ürünler seti seçer (ürün formunda "Nitelik Seti *" zorunlu, otomatik seçilmez). Set seçilince attribute'lar bölüm kartları olarak gelir; zorunlu attribute'lar **taslak kaydı bile engeller**. Ayrıntı: [product.md](product.md), [../screens/products/product-create.md](../screens/products/product-create.md).
- Kategoriler opsiyonel (Kategoriler sekmesi, yalnız edit ekranında).

## Yetki
- UI düğmeleri: `products` create / update / delete.
- İşlemler: `products:read|write`.
