# Öznitelik Setini Düzenle (Edit Attribute Set)
- URL: `{ADMIN_URL}/attributes/sets/{id}/edit`
- Amaç: Set bilgisi, bölümler (ad, sıra), attribute ekleme/çıkarma/bölüm değiştirme, kategori ataması, silme.
- Yetki: Listede "Düzenle" `products` update yetkisiyle görünür. Sil düğmesi `products` delete yetkisiyle ve set varsayılan değilse görünür.
- Veri / API:
  - Yükleme: set + atanmış attribute'lar; ayrıca seçilebilir attribute listesi ve kategori ağacı (Kategoriler sekmesi). Hata → "Öznitelik Seti Bulunamadı" + hata metni + "Öznitelik Setlerine Dön".
  - Diyalogdan attribute oluşturma: `POST /attributes` (diyalogda anında).
  - Kaydet: `PATCH /attribute-sets/{id}` — bölümler ve attribute listesi formdaki hâliyle **tamamen değiştirilir**; kategori atamaları da gönderilir.
  - Sil: `DELETE /attribute-sets/{id}`.

## Ön koşullar ve bağımlılıklar
- Set var olmalı ([attribute-set-list.md](attribute-set-list.md)).
- Eklenecek attribute'lar var olmalı ([attribute-create.md](attribute-create.md)) — ya da diyalogdan minimal oluştur.
- Kategoriler sekmesi için kategoriler var olmalı ([../categories/category-create.md](../categories/category-create.md)).

## Yerleşim
- Başlık "Öznitelik Setini Düzenle", açıklama = set adı, geri "Geri". Sağda: **"Sil / Delete"** (koşullu, kırmızı) ve **"Kaydet / Save"**.
- Sekmeler: **"Temel Bilgiler"**, **"Öznitelikler ({n})"**, **"Kategoriler ({n})"**.
  - Temel Bilgiler: create ile aynı kartlar (Set Bilgileri, Durum).
  - Öznitelikler: üstte kart **"Bölümler / Sections"** ("Öznitelikleri bölümlere göre düzenleyin ({n})") + "Bölüm Ekle"; satırlar: Bölüm adı input + sıra number + ✕. Altta kart "Öznitelik Seti Oluşturucu" + "Öznitelik Ekle", akordeonlar ("Bölüm Yok" + bölümler).
  - Kategoriler: kategori atama kartı — ağaç, checkbox'lar, "Atandı"/"Devralındı" rozetleri, "Tümünü Seç"/"Seçimi Temizle".

## Alanlar
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Temel Bilgiler | Set Adı * | `name` | text | evet | 1–255 ("Ad gerekli") | placeholder "Set adını girin" | Edit'te kod türetmez. |
| Temel Bilgiler | Set Kodu * | `code` | text **disabled** | – | – | | Değiştirilemez. |
| Temel Bilgiler | Açıklama | `description` | textarea | hayır | ≤1000 | | |
| Temel Bilgiler | Sıralama | `sortOrder` | number | hayır | tam sayı ≥0 | | |
| Durum | Aktif | `isActive` | switch | – | | `getByRole('switch', { name: 'Aktif' })` | |
| Durum | Varsayılan Set | `isDefault` | switch | – | | | Set zaten varsayılansa **disabled** (varsayılandan çıkarmak için başka seti varsayılan yap). |
| Öznitelikler › Bölümler | Bölüm Ekle / Add Section | – | button | – | – | `getByRole('button', { name: 'Bölüm Ekle' })` | Boş satır ekler (dialog yok). |
| Öznitelikler › Bölümler | (satır) Bölüm adı | `sections[].name` | text | (boşsa kayıtta atılır) | ≤120 | aria-label "Bölüm adı {n}" → `getByRole('textbox', { name: 'Bölüm adı 1' })` | Bölüm kodu bu ekranda görünmez; yeni bölümün kodu addan otomatik türetilir. |
| Öznitelikler › Bölümler | (satır) sıra | `sections[].sortOrder` | number | – | ≥0 | aria-label "Sıralama {n}" | Ürün formunda bölüm sırası. |
| Öznitelikler › Bölümler | (satır) ✕ | – | ikon buton | – | – | aria-label "Bölümü Kaldır {ad}" | Bölümde attribute varsa dialog "Bölümü Kaldır": "Bu bölümde {n} öznitelik atanmış. Kaldırmak onları \"Atanmamış\" olarak taşıyacak. Devam edilsin mi?" → "Onayla / Confirm". |
| Öznitelikler › Oluşturucu | Öznitelik Ekle | – | button → dialog | – | – | | Dialog içeriği create ekranıyla aynı (Öznitelik *, Bölüm (İsteğe Bağlı), "Yeni Oluştur", "Oluştur ve Ekle"). Locator id'leri aynı: `select-attribute`, `select-section`, `new-attr-label`, `new-attr-type`, `new-attr-section`. |
| Öznitelikler › Oluşturucu (satır) | bölüm seçimi | `attributes[].section` | select | – | | satırdaki combobox | |
| Öznitelikler › Oluşturucu (satır) | Özniteliği kaldır / Remove attribute | – | ikon buton | – | – | `getByRole('button', { name: 'Özniteliği kaldır' })` (satır kapsamında) | Bu ekranda ↑/↓ **yok**. |
| Kategoriler | (her kategori) checkbox | `assignedCategoryIds[]` | checkbox ağacı (açılır/kapanır ok) | hayır | | kategori adının yanındaki `getByRole('checkbox')` (aria yok; satır metniyle kapsamla) | Üst kategori seçilince alt kategoriler "Devralındı" (disabled, işaretli) olur ve ayrıca kaydedilmez. Pasif kategoriler üstü çizili. |
| Kategoriler | Tümünü Seç / Seçimi Temizle | – | button | – | – | | |

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay | Sonuç |
|---|---|---|---|
| Kaydet / Save | form doğrulanır → set güncellenir | uygulama sormaz → özet + onay | Toast "İşlem başarıyla tamamlandı" / "Öznitelik seti başarıyla güncellendi" → `/attributes/sets`. Hata: başlık "Bir hata oluştu", açıklama sunucu mesajı (ör. "Duplicate section codes: …", "Section code must start with…", "One or more categories not found…"). |
| Sil / Delete | Dialog "Öznitelik Setini Sil": "Bu öznitelik setini silmek istediğinizden emin misiniz? Bu seti kullanan ürünlerin yeniden atanması gerekecek." → "Sil" | evet (+CLAUDE.md tekil onay) | Toast "Öznitelik seti başarıyla silindi" → liste. Ürünler kullanıyorsa 409 "Attribute set is in use by products". |
| Oluştur ve Ekle (dialog) | attribute anında oluşturulur | – | attribute kalıcı oluşur |

## Yan etkiler
- Attribute'u setten çıkarmak ürünlerdeki o attribute değerini silmez; ürün formunda artık gösterilmez — doğrulanmadı.
- Varsayılan Set açılırsa diğer setin varsayılanlığı kalkar.

## Tuzaklar
- Sette bölüm kullanıyorsan kaydetmeden önce "Bölüm Yok" akordeonunun boş olduğunu kontrol et (her attribute bir bölümde olsun).
- Attribute sırası = ekleme sırası (yeni eklenen sona). Sırayı değiştirmenin tek yolu: çıkar + istenen sırayla tekrar ekle.
- Bölüm kodu görünmez; yeni bölümlerde harfle başlayan, sade adlar kullan (ör. "Ekran", "Kamera", "Batarya", "Bellek ve Depolama").
- Boş adlı bölüm satırları kayıtta atılır.
- Varsayılan set için Sil düğmesi görünmez ve Varsayılan switch'i kilitli.
- Form, veriler yüklenene kadar dolmaz; spinner bitene kadar bekle.
- Kaydetmeden çıkışta uyarı yok.

## Doğrulama
- Toast "Öznitelik seti başarıyla güncellendi".
- Edit'i yeniden aç: sekme başlıkları "Öznitelikler ({n})", "Kategoriler ({n})" beklenen sayılar; bölüm akordeonlarında doğru dağılım; "Bölüm Yok" boş.
