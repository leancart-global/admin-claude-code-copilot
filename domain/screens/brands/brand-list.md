# Markalar (Brands)
- URL: `{ADMIN_URL}/brands`
- Amaç: Markaları görmek/aramak, öne çıkan ve aktif durumunu satırdan değiştirmek, silmek, oluştur/düzenle'ye gitmek.
- Yetki: menü `products:read`. Sayfa içi düğmeler `products` create / update / delete yetkisine göre görünür. İşlemler `brands:write|delete`.
- Veri / API:
  - Listeleme: `GET /brands`. Filtre/arama/sayfalama (20) sayfada yapılır.
  - Satır switch'leri: öne çıkan ya da durum (aktif/pasif) güncellemesi — **anında**.
  - Sil: `DELETE /brands/{id}`.

## Ön koşullar ve bağımlılıklar
- Yok. Alt ekranlar: [brand-create.md](brand-create.md), [brand-edit.md](brand-edit.md). Entity: [../../entities/brand.md](../../entities/brand.md).

## Yerleşim
1. Başlık "Markalar / Brands" + sayı; "Ürün markalarını ve üreticileri yönetin"; sağda **"Marka Oluştur / Create Brand"** (create yetkisiyle).
2. Filtreler: arama; "Tüm Durumlar" + verideki durumlar (Aktif/Pasif/Beklemede, adetli); "★ Sadece Öne Çıkanlar / Featured Only".
3. Tablo (erişilebilirlik ağacında `table` rolü yok): Logo | Marka Adı (+`/slug`) | Ürünler | Durum | Öne Çıkan (switch) | Aktif (switch) | ⋯.
4. Boş durum "Henüz Marka Yok" / "Filtrelere uygun marka bulunamadı"; sayfalama.

## Alanlar
| Bölüm/Tab | Label (tr / en) | Kontrol tipi | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Filtre | placeholder "Marka ara..." / "Search brands..." | text | ad, slug, açıklama içinde arar | `getByPlaceholder('Marka ara...')` | |
| Filtre | Tüm Durumlar / Aktif / Pasif / Beklemede / Sadece Öne Çıkanlar | toggle button | | `getByRole('button', { name: /Sadece Öne Çıkanlar/ })` | |
| Satır | aria "Öne Çıkan" / "Featured" | switch | | satır kapsamında `getByRole('switch', { name: 'Öne Çıkan' })` | **Anında kaydeder, onay yok.** |
| Satır | aria "Aktif" / "Active" | switch (aktif ↔ pasif) | | satır kapsamında `getByRole('switch', { name: 'Aktif' })` | **Anında kaydeder.** Beklemede markada kapalı görünür; açınca Aktif olur. |
| Satır | aria "İşlemler" | dropdown | | `getByRole('button', { name: 'İşlemler' })` | "Düzenle", "Sil". |

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay | Sonuç |
|---|---|---|---|
| Marka Oluştur | `/brands/new` | – | |
| ⋯ → Düzenle | `/brands/{id}/edit` | – | |
| ⋯ → Sil | Dialog "Markayı Sil": "Bu markayı silmek istediğinizden emin misiniz?" — ürünü varsa "Bu marka {n} üründe kullanılıyor. Önce ürünlerden markayı kaldırın." ve **Sil disabled** | evet | toast "Marka başarıyla silindi"; hata başlıkta sunucu mesajı / "Ürün atanmış marka silinemez". |
| Öne Çıkan / Aktif switch | anında günceller | **uygulama sormaz** → tıklamadan önce kullanıcı onayı | Başarıda toast yok (yalnız switch değişir); hata kırmızı toast. |

## Yan etkiler
- Pasif marka vitrinde listelenmez (doğrulanmadı).

## Tuzaklar
- Switch'ler onaysız kalıcı değişiklik yapar — yanlışlıkla tıklama.
- Satır tıklanabilir değil; ⋯ menü kullan.

## Doğrulama
- Arama kutusuna adı yaz: satırda `/slug`, Durum rozeti, Öne Çıkan/Aktif switch durumları (`aria-checked`), logo.
