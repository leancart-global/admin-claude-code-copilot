# Entity: Brand (Marka)

- Ekranlar: [../screens/brands/brand-list.md](../screens/brands/brand-list.md),
  [../screens/brands/brand-create.md](../screens/brands/brand-create.md),
  [../screens/brands/brand-edit.md](../screens/brands/brand-edit.md).
- API: `GET/POST /brands`, `GET /brands/select`, `GET /brands/featured`, `GET /brands/by-slug/{slug}`, `GET/PUT/DELETE /brands/{id}`,
  `POST /brands/resolve`, `POST /brands/find-or-create`. Güncelleme `PUT`, alanlar opsiyonel (kısmi).

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `name` | string | evet | — | 1–255. **Benzer ad yasak**: büyük/küçük harf, noktalama ve fazla boşluk farkı ve Türkçe harf farkı (ğ/g, ş/s, ı/i… — ayrıntı doğrulanmadı) yok sayılarak aynı ada sahip marka varsa → 409 "A brand with a similar name already exists: X". |
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
| Ürün sayısı | number | — | 0 | Listede "Ürünler" sütunu. Sütunun ürüne atanan markayı yansıttığı doğrulanmadı; silme kısıtı için ürünün Kimlik sekmesindeki marka seçimi esas alınır. |

## Silme
- Herhangi bir durumdaki (arşivli dahil) ürüne atanmış marka silinemez → 409 `ERR_BRAND_HAS_PRODUCTS`; panel "“{name}” markası hâlâ ürünlerde kullanılıyor. Ürünleri bu markadan çıkarın, sonra tekrar deneyin." der. Listede ürün sayısı > 0 görünen markada Sil düğmesi disable'dır. Aksi halde **kalıcı silinir**. Önce ürünlerdeki marka alanı (ürün formu → Kimlik → Marka) boşaltılmalı.

## İlişkiler
- Ürün → marka. Ürün oluştur/düzenle formunda "Kimlik" sekmesindeki "Marka" listesinden (opsiyonel) seçilir; ürün listesinin gelişmiş
  filtresinde de marka seçilebilir. Bkz. [product.md](product.md).
- Preset attribute setlerde `brand` adlı **select attribute** de var (ör. electronics preset) — bu Marka kaydı değildir;
  ikisini karıştırma, marka için Markalar ekranını kullan.

## Yetki
- UI: `products` create / update / delete (marka için ayrı UI yetkisi yok). `/brands/new` ve `/brands/{id}/edit`
  yetkisizse `/brands`'a yönlendirir.
- İşlemler: okuma `products:read`; yazma/silme `brands:write`, `brands:delete`.
