# Entity: Category (Kategori)

Hiyerarşik ürün kategorisi (ağaç). Ürünler kategorilere bağlanır (bir ürün birden çok kategoride olabilir).

- Ekranlar: [../screens/categories/category-list.md](../screens/categories/category-list.md),
  [../screens/categories/category-create.md](../screens/categories/category-create.md),
  [../screens/categories/category-edit.md](../screens/categories/category-edit.md),
  [../screens/categories/category-detail.md](../screens/categories/category-detail.md).
- Formdaki üç görsel alanı (Ana Görsel, Küçük Görsel, Banner) ve SEO alanları kategori kaydının medya ve SEO bilgisi olarak saklanır.

## Alanlar (UI'dan yazılanlar)

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `name` | string | evet | — | 1–255. Baştaki/sondaki boşluk kırpılır. |
| `slug` | string | evet | addan türetilir | Küçük harf, rakam ve tire (`^[a-z0-9]+(?:-[a-z0-9]+)*$`), max 255. **Mağaza içinde benzersiz**: create'te çakışma → `CATEGORY_SLUG_EXISTS` 409; update'te → 409. **Arşivlenmiş** aynı slug'lı kategori varsa create onu **geri yükler** ve gelen verilerle günceller. |
| `description` | string | hayır | '' | max 2000, düz metin |
| `parentId` | kategori \| boş | hayır | boş (kök) | Ebeveyn mevcut olmalı (`CATEGORY_PARENT_NOT_FOUND` 404). **Maks derinlik 5 seviye** (`CATEGORY_TREE_DEPTH_EXCEEDED` 400). Kendi altına/torununa taşıma → `CATEGORY_CIRCULAR_REFERENCE`. Boş = köke taşı. |
| `status` | `active`/`inactive`/`hidden`/`archived` | UI'da evet | `active` | `archived` formdan seçilemez/kaydedilemez → `CATEGORY_ARCHIVE_VIA_DELETE` (yalnız silme arşivler). `hidden` = "Menüde Gizli". |
| `sortOrder` | tam sayı 0–999999 | hayır | 0 | Kardeşler arası sıra (küçük önce). Sürükle-bırak **yok**; sıra yalnız bu sayı ile. |
| `isFeatured` | bool | hayır | false | |
| Medya | Ana Görsel / Küçük Görsel / Banner (URL) | hayır | boş | Kategori başına en fazla 10 medya; formda 3 slot. |
| SEO | Meta başlık, meta açıklama, anahtar kelimeler, OG başlık/açıklama/görsel, kanonik URL | hayır | — | Meta başlık ≤100, meta açıklama ≤300, OG başlık ≤100, OG açıklama ≤300. |

Kategoride ayrıca sistemin hesapladığı ve ekranlarda görünen bilgiler vardır: Seviye (0 = kök), ürün sayısı, aktif ürün sayısı, alt kategori sayısı.

## Çeviriler (store view bazlı)
- Her store view için ayrı çeviri: ad (1–255), slug (≤255), açıklama, SEO (meta başlık ≤100, meta açıklama ≤300, anahtar kelimeler ≤500, kanonik URL ≤500).
- UI kayıt sırası: önce kategori, sonra her dolu çeviri ayrı kaydedilir. Boş çeviriler kaydedilmez. Çeviri adı boşsa `-`, slug boşsa addan otomatik slug gönderilir.
- Çeviri silme UI'da yok.

## Attribute set ilişkisi
- Set → kategori yönünde: attribute set edit ekranının Kategoriler sekmesi (bkz. [attribute-set.md](attribute-set.md)). Kategori ekranında set ya da filtre attribute alanı yok.

## Silme / kaskad
- Silme kategoriyi **arşivler** (Durum: Arşivlenmiş; kayıt kalır, aynı slug ile tekrar oluşturulursa geri yüklenir).
- Arşivlenmemiş **alt kategorisi** varsa → `ERR_CATEGORY_HAS_CHILDREN` 400 (önce çocukları sil/taşı).
- Ürünü varsa → `ERR_CATEGORY_HAS_PRODUCTS` 400 (önce ürünleri çıkar).
- Silinen kategori ebeveyninin alt kategorilerinden çıkar.

## Ön koşul
- En az 1 **aktif store view** yoksa yeni kategori formu açılmaz; yerine ön koşul kartı `/settings/store-views`'a yönlendirir.

## Yetki
- `categories:read|write|delete` (UI düğmeleri `categories` create / update / delete).
