# Entity: Brand (Marka)

- Ekranlar: [../screens/brands/brand-list.md](../screens/brands/brand-list.md),
  [../screens/brands/brand-create.md](../screens/brands/brand-create.md),
  [../screens/brands/brand-edit.md](../screens/brands/brand-edit.md).
- API: `GET/POST /brands`, `GET /brands/select`, `GET /brands/featured`, `GET /brands/by-slug/{slug}`, `GET/PUT/DELETE /brands/{id}`,
  `POST /brands/resolve`, `POST /brands/find-or-create`. Güncelleme `PUT`, alanlar opsiyonel (kısmi).

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `name` | string | evet | — | 1–255. **Benzer ad yasak**: büyük/küçük harf, noktalama ve fazla boşluk farkı yok sayılarak aynı ada sahip marka varsa → 409 "A brand with a similar name already exists: X". |
| `slug` | string | hayır (create) | addan | Addan türetilir (Türkçe transliterasyonlu). Benzersiz → 409 "Brand with slug 'x' already exists". UI addan otomatik doldurur; edit'te düzenlenebilir (boş bırakılırsa eskisi korunur). |
| `description` | string | hayır | — | |
| `tagline` | string | hayır | — | ≤500 |
| `website` | URL | hayır | — | Geçerli URL olmalı; UI başına `https://` ekler. |
| `countryOfOrigin` | string | hayır | — | serbest metin |
| `foundedYear` | tam sayı | hayır | — | 1800–2100 |
| `status` | `active`/`inactive`/`pending` | hayır | active | Listede "Aktif" switch'i yalnız `active` iken açık görünür. |
| `isFeatured` | bool | hayır | false | |
| `sortOrder` | tam sayı | hayır | 0 | |
| Medya: logo / banner | URL + alt metin | hayır | — | UI logo ve banner'ı düzenler. |
| `seo` | meta başlık ≤70, meta açıklama ≤160, anahtar kelimeler, URL anahtarı, kanonik URL | hayır | create'te URL anahtarı = slug | UI'da anahtar kelimeler virgülle ayrılır. |
| `translations[]` | store view başına ad, açıklama, SEO | hayır | [] | Marka kaydıyla birlikte kaydedilir. Edit'te formdaki hâliyle **tamamen değiştirilir**. |
| Ürün sayısı | number | — | 0 | Ürünlere marka atandıkça artar; listede "Ürünler" sütunu. |

## Silme
- Ürüne atanmış marka silinemez → 409 "Cannot delete brand 'X' because it has N associated products". UI bu durumda Sil
  düğmesini disable eder. Aksi halde **kalıcı silinir**.

## İlişkiler
- Ürün → marka. Ürün oluştur/düzenle formunda marka alanı **henüz yok (geliştiriliyor)**. Ürün listesinin gelişmiş
  filtresinde marka seçilebilir. "Ürüne marka ata" isteği gelirse kullanıcıya alanın henüz olmadığını söyle; geçici yol önerme.
  Bkz. [product.md](product.md).
- Preset attribute setlerde `brand` adlı **select attribute** de var (ör. electronics preset) — bu Marka kaydı değildir;
  ikisini karıştırma, marka için Markalar ekranını kullan.

## Yetki
- UI: `products` create / update / delete (marka için ayrı UI yetkisi yok). `/brands/new` ve `/brands/{id}/edit`
  yetkisizse `/brands`'a yönlendirir.
- İşlemler: okuma `products:read`; yazma/silme `brands:write`, `brands:delete`.
