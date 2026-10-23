# Öznitelik Setleri Listesi (Attribute Sets)
- URL: `{ADMIN_URL}/attributes/sets`
- Amaç: Setleri görmek, var olan seti bulmak (reuse), varsayılan yapmak, silmek, oluştur/düzenle ekranına gitmek.
- Yetki: menü `products:read`. Sayfa içi düğmeler `products` create / update / delete yetkisine göre görünür.
- Veri / API:
  - Listeleme: `GET /attribute-sets`. Filtre/arama/sayfalama sayfada yapılır (sayfa 20).
  - Varsayılan yap: seti `isDefault: true` olarak günceller.
  - Sil: `DELETE /attribute-sets/{id}`.

## Ön koşullar ve bağımlılıklar
- Yok. Alt ekranlar: [attribute-set-create.md](attribute-set-create.md), [attribute-set-edit.md](attribute-set-edit.md). Entity: [../../entities/attribute-set.md](../../entities/attribute-set.md).

## Yerleşim
1. Başlık "Öznitelik Setleri / Attribute Sets" + sayı rozeti; alt başlık "Farklı ürün tipleri için öznitelikleri grupla"; sağda **"Öznitelik Seti Oluştur / Create Attribute Set"** (create yetkisiyle).
2. Filtreler: arama kutusu + durum düğmeleri "Tüm Durumlar / All Statuses", "Aktif / Active", "Pasif / Inactive" (adetli).
3. Seçim varsa: "{n} seçildi" + "Seçimi Temizle / Clear Selection" (toplu işlem **yok**, yalnız seçim).
4. Hata bandı + "Yenile / Refresh".
5. Tablo (`table` rolü): seçim | Set Adı (varsayılan sette ★) | Set Kodu | Öznitelikler (adet rozeti) | Durum | ⋯.
6. Boş durum: "Henüz öznitelik seti yok" / filtreli: "Filtrelerinize uyan öznitelik seti yok"; sayfalama.

## Alanlar
| Bölüm/Tab | Label (tr / en) | Kontrol tipi | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Filtre | placeholder "Öznitelik setlerini ara..." / "Search attribute sets..." | text | ad veya kod içinde arar | `getByPlaceholder('Öznitelik setlerini ara...')` | anında filtreler |
| Filtre | Tüm Durumlar / Aktif / Pasif | toggle button | Tüm Durumlar | `getByRole('button', { name: /^Aktif/ })` | |
| Tablo | aria "Tümünü seç" / "Select all" | checkbox | | `getByRole('checkbox', { name: 'Tümünü seç' })` | |
| Satır | aria "{name} satırını seç" | checkbox | | | |
| Satır | aria "İşlemler" / "Actions" | dropdown tetikleyici | | `getByRole('row', { name: /Cep Telefonu/ }).getByRole('button', { name: 'İşlemler' })` | |

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay | Sonuç |
|---|---|---|---|
| Öznitelik Seti Oluştur | `/attributes/sets/new` | – | preset seçim adımı |
| ⋯ → Düzenle / Edit (update yetkisi) | `/attributes/sets/{id}/edit` | – | |
| ⋯ → Varsayılan Olarak Ayarla / Set as Default (update yetkisi, set varsayılan değilse) | seti varsayılan yapar | **uygulama sormaz** → Claude kullanıcı onayı almalı | toast "İşlem başarıyla tamamlandı" / "Öznitelik seti artık varsayılan"; liste yenilenir. Önceki varsayılan setin varsayılanlığı kalkar. |
| ⋯ → Sil / Delete (delete yetkisi, varsayılan değilse) | Dialog "Bu öznitelik setini silmek istediğinizden emin misiniz? Bu seti kullanan ürünlerin yeniden atanması gerekecek." → Sil | evet | toast "Öznitelik seti başarıyla silindi". Ürünler kullanıyorsa 409 `ATTRIBUTE_SET_IN_USE` → toast "Attribute set is in use by products". |

## Yan etkiler
- Set silmek attribute'ları silmez; attribute'lar başka sette değilse silinebilir hale gelir.

## Tuzaklar
- Varsayılan set satırında Sil ve "Varsayılan Olarak Ayarla" görünmez (varsayılan set silinemez).
- Kategori sayısı sütunu yok; set–kategori bağını görmek için edit ekranının Kategoriler sekmesi.

## Doğrulama
- Arama kutusuna set kodunu yaz; Öznitelikler rozeti beklenen attribute sayısını göstermeli, Durum "Aktif".
- Varsayılan yapıldıysa ad yanında ★.
