# Öznitelik Listesi (Attributes)
- URL: `{ADMIN_URL}/attributes` (URL'de dil öneki yok; dil kullanıcı tercihinden gelir).
- Amaç: Tüm attribute'ları görmek, **var mı diye aramak** (reuse kararı), toplu bayrak açıp kapatmak, silmek, oluştur/düzenle ekranına gitmek.
- Yetki: menü `products:read`. Sayfa içi düğmeler `products` create / update / delete yetkisine göre görünür. İşlemler `attributes:read|write|delete` ister.
- Veri / API:
  - Listeleme: `GET /attributes`. Arama, tip filtresi ve sayfalama sayfada (istemcide) yapılır.
  - Sil: `DELETE /attributes/{id}` · Toplu sil (seçilenler; kısmi başarı raporlanır) · Toplu bayrak güncelleme (seçilenlere tek bayrak).

## Ön koşullar ve bağımlılıklar
- Yok. Bu ekran diğer attribute akışlarının giriş noktası: [attribute-create.md](attribute-create.md), [attribute-edit.md](attribute-edit.md).
- Entity: [../../entities/attribute.md](../../entities/attribute.md).

## Yerleşim
1. Kart başlığı: "Öznitelikler / Attributes" + sayı rozeti (filtrelenmiş sayı) + alt başlık; sağda **"Öznitelik Oluştur / Create Attribute"** (yalnız create yetkisiyle).
2. Hata uyarısı (yükleme hatası: "Öznitelikler yüklenemedi. Lütfen tekrar deneyin.").
3. Filtre satırı: solda arama kutusu; sağda tip filtre düğmeleri ("Tüm Tipler / All Types" + yalnız veride bulunan tipler, adetle).
4. Seçim varsa toplu işlem çubuğu.
5. Tablo (erişilebilirlik ağacında `table` rolü yok, satırlar div): seçim checkbox | Etiket (+açıklama) | Kod | Tip | Aramada Kullan | Katmanlı Navigasyonda Kullan | Durum | ⋯ menü.
6. Boş durum / sayfalama ("{from} - {to} arası gösteriliyor, toplam {total}", Önceki/Sonraki). Sayfa boyu 20.

## Alanlar
| Bölüm/Tab | Label (tr / en) | Kontrol tipi | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Filtre | (placeholder) "Öznitelikleri ara..." / "Search attributes..." | text | label **veya** code içinde, büyük/küçük harf duyarsız | `getByPlaceholder('Öznitelikleri ara...')` | Anında filtreler. |
| Filtre | "Tüm Tipler" / "All Types" + tip adları (Açılır Liste/Dropdown, Renk/Color, Metin/Text …) | toggle button grubu | Tüm Tipler | `getByRole('button', { name: /Açılır Liste/ })` (rozet sayısı adın içinde) | Sadece verideki tipler listelenir. |
| Tablo başlığı | aria "Bu sayfadaki tüm öznitelikleri seç" / "Select all attributes on this page" | checkbox | yalnız görünen sayfa | `getByRole('checkbox', { name: 'Bu sayfadaki tüm öznitelikleri seç' })` | |
| Satır | aria "{label} özniteliğini seç" / "Select {label}" | checkbox | | `getByRole('checkbox', { name: 'Renk özniteliğini seç' })` | |
| Satır | aria "İşlemler" / "Actions" | dropdown menü tetikleyici | | `getByRole('button', { name: 'İşlemler' })` (satır içinde) | Menü: "Düzenle/Edit" (update yetkisi), "Sil/Delete" (delete yetkisi). |

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay | Sonuç |
|---|---|---|---|
| Öznitelik Oluştur / Create Attribute | `/attributes/new` | – | [attribute-create.md](attribute-create.md) |
| ⋯ → Düzenle / Edit | `/attributes/{id}/edit` | – | [attribute-edit.md](attribute-edit.md) |
| ⋯ → Sil / Delete | Dialog başlık "Öznitelik Sil / Delete Attribute", metin "Ürünler veya öznitelik setleri hâlâ kullanıyorsa bu öznitelik silinmeyecektir. Aksi hâlde silme işlemi kalıcıdır." → "Sil / Delete" | evet | Başarı toast: başlık "İşlem başarıyla tamamlandı", açıklama "Öznitelik başarıyla silindi". Hata: "Bu özellik hâlâ {n} özellik setinde kullanıldığı için silinemez…" (`ERR_ATTRIBUTE_IN_USE_BY_ATTRIBUTE_SETS`) / "…{n} üründe kullanıldığı için silinemez…" (`ERR_ATTRIBUTE_IN_USE_BY_PRODUCTS`) / genel "Öznitelik silinemedi. Lütfen tekrar deneyin." |
| (seçim çubuğu) "{n} seçildi" · Temizle / Clear | seçimi boşaltır | – | |
| Özellik ayarla / Set property ▾ | Menü: her bayrak için etiket + "Aç / Turn on", "Kapat / Turn off". Bayraklar: Aramada Kullan, Katmanlı Navigasyonda Kullan, Katalog Sayfalarında Görünür, Zorunlu | **onay diyaloğu yok** — tıklama anında kaydeder | toast "{n} öznitelik güncellendi."; kısmi hata uyarısı "{total} özniteliğin {failed} tanesi güncellenemedi." Liste yeniden yüklenir. |
| Seçilenleri sil / Delete selected | Dialog "{n} öznitelik silinsin mi?" + "Ürünler veya öznitelik setleri tarafından hâlâ kullanılan öznitelikler atlanacak. Kalanlar geri alınamaz." → Sil | evet | "{n} öznitelik silindi." + reddedilenler için uyarı toast (ad listesiyle). Tam başarıda seçim temizlenir. |

## Yan etkiler
- Toplu "Aramada Kullan" / "Katmanlı Navigasyonda Kullan" değişimi ilgili ürünlerin yeniden işlenmesini tetikler; vitrine gecikmeli yansır.
- Silme kalıcıdır (geri alınamaz).

## Tuzaklar
- "Özellik ayarla" menüsü onay sormadan kaydeder → CLAUDE.md kuralı gereği **tıklamadan önce** kullanıcı onayı al.
- Arama code ve label'da yapılır; Türkçe label ile kayıtlı attribute'u İngilizce kodla (ör. `color`) da ara: hem "renk" hem "color" dene. Aynı kodla oluşturma denemesi `ERR_ATTRIBUTE_CODE_EXISTS` ile reddedilir.
- Satırın kendisi tıklanabilir değil; düzenlemek için ⋯ menü.
- Boş durumda "Aramanızla eşleşen öznitelik bulunamadı" — hata değil.

## Doğrulama
- Oluşturma/düzenleme sonrası bu ekrana dönülür; arama kutusuna kodu yaz, satırda Kod/Tip/Arama/Filtre/Durum sütunlarını kontrol et.
- Seçenek sayısı listede görünmez → seçenekleri doğrulamak için edit ekranını aç.
