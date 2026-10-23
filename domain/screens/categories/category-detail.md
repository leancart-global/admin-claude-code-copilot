# Kategori Detayı (Category Detail)
- URL: `{ADMIN_URL}/categories/{id}`
- Amaç: Kategoriyi salt okunur görmek (doğrulama ekranı), buradan Düzenle'ye geçmek ya da silmek.
- Yetki: görüntüleme `categories:read`, silme `categories:delete`, düzenleme `categories:write`.
- Veri / API: kategori, çevirileri, store view listesi ve breadcrumb yüklenir. Sil: `DELETE /categories/{id}` (arşivler).

## Ön koşullar ve bağımlılıklar
- Kategori var olmalı; id'ye liste tablo görünümü ⋯ → "Detayları Görüntüle" ile ulaşılır ([category-list.md](category-list.md)). Ağaç görünümünde detay sayfasına link yok.

## Yerleşim
- Üst: "← Kategorilere Dön"; başlık = ad (+★ öne çıkansa); durum rozeti, "Öne Çıkan" rozeti, `/{slug}`; sağda **"Düzenle / Edit"** ve **"Sil / Delete"**.
- Sol (2/3) kartlar: **Temel Bilgiler** (Ad, URL Kısaltması, Seviye, Sıralama, Açıklama, Üst Kategori, Öne Çıkan) · **Medya** (Kategori Görseli, Küçük Görsel, Banner; yoksa "Görsel yok") · **SEO** (Meta başlık/açıklama/anahtar kelimeler/kanonik URL + Open Graph) · **Çeviriler** (store view başına ad, slug, her biri için "Düzenle").
- Sağ (1/3): **Durum ve Görünürlük** (Durum, Öne Çıkan Evet/Hayır, Sıralama) · **İstatistikler** (Ürün sayısı, Aktif ürün sayısı, Alt kategori sayısı) · **Üst Kategori** (yoksa "üst kategori yok") · **Meta veriler** (Kategori ID, Oluşturulma, Son güncelleme).

## Alanlar
Form yok (salt okunur). Okuma ipuçları:
| Bölüm/Tab | Label (tr / en) | Kontrol tipi | Locator ipucu | Not |
|---|---|---|---|---|
| Başlık | (ad) | h1 | `getByRole('heading', { level: 1 })` | |
| Başlık | durum rozeti | badge | başlık altındaki ilk rozet | |
| Temel Bilgiler | URL Kısaltması / Slug | metin | | |
| İstatistikler | Ürün Sayısı / Aktif Ürün Sayısı / Alt Kategori | metin | | Silme öncesi kontrol için (ürün >0 ya da alt kategori >0 → silinemez). |
| Çeviriler | Düzenle | button | kart içindeki "Düzenle" | Edit sayfasını açar; çeviri için store view çubuğundan görünümü seç. |

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay | Sonuç |
|---|---|---|---|
| Düzenle / Edit | `/categories/{id}/edit` | – | [category-edit.md](category-edit.md) |
| Sil / Delete | Dialog "Emin misiniz?" — "\"{name}\" ve tüm alt kategorileri kalıcı olarak silinecek. Bu işlem geri alınamaz." → "Sil" | evet (+ kullanıcı onayı) | Başarı: toast "Kategori başarıyla silindi" → `/categories`. Hata: kırmızı toast, sunucu mesajı ya da "Kategori silinemedi. Lütfen tekrar deneyin." |
| Kategorilere Dön | `/categories` | – | |

## Yan etkiler
- Silme kategoriyi arşivler; bkz. [../../entities/category.md](../../entities/category.md).

## Tuzaklar
- Alt kategorisi ya da ürünü olan kategori silinemez (`ERR_CATEGORY_HAS_CHILDREN`, `ERR_CATEGORY_HAS_PRODUCTS`). Silmeden önce İstatistikler kartını oku.

## Doğrulama
- Oluşturma/düzenleme sonrası bu sayfayı aç: Temel Bilgiler, Üst Kategori, Medya, SEO, Çeviriler kartlarını kullanıcının istediği değerlerle karşılaştır.
