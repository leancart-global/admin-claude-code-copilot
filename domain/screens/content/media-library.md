# Medya Kütüphanesi (Media Library)
- URL: {ADMIN_URL}/content/media
- Menü yolu: Sol menü "İçerik / Content" → "Medya / Media" (`content:read`). Ayrıca İçerik hub'ı (`/content`) üzerinde "Medya / Media" kartı (kart açıklaması "Yüklediğin görselleri ve dosyaları görüntüle ve düzenle / Browse and organize uploaded images and files").
- Amaç: Tenant'ın tüm görsel/video/belge/ses/arşiv dosyalarını listelemek, yüklemek, meta verisini (başlık, alt metin, altyazı, etiket) düzenlemek, silmek. Aynı göz atma + yükleme diyaloğu tüm görsel seçicilerde (ana sayfa/sayfa blokları, branding, layout-settings, kategori, blog, ürün) **picker** olarak yeniden kullanılır — bkz. "Picker (medya seçici alanı + medya seçme diyaloğu)" bölümü.
- Yetki (permission):
  - Görüntüleme / listeleme: `content:read` (menü girişi de buna göre görünür).
  - "Dosya Yükle / Upload Files" butonu: `content:create` / `content:write`.
  - Düzenle (kart menüsü): `content:update` / `content:write`.
  - Sil / toplu sil: `content:delete`.
- İşlemler:
  | İşlem | Ne yapar | Yetki |
  |---|---|---|
  | Liste (sayfalı) | Arama, tip ve klasöre göre süzülmüş dosyaları 20'şerli getirir | `content:read` |
  | Klasörler | Klasör filtresindeki klasör listesini getirir | `content:read` |
  | Yükleme | Dosyayı (opsiyonel başlık/alt/altyazı/klasör ile) kütüphaneye ekler | `content:write` |
  | Meta güncelle | Başlık, alt metin, altyazı, etiketleri günceller | `content:write` |
  | Tek sil / toplu sil | Dosya(lar)ı kütüphaneden kaldırır | `content:delete` |
- Yüklenen dosyanın URL'si mutlak bir CDN/depolama URL'sidir. Görseller için küçük (150x150), orta (300x300), büyük (800x800) ve webp varyantları otomatik üretilir; ızgara ve seçicilerdeki küçük resimler `-small` varyantını kullanır.
- Entity (alanlar, klasörler, varyantlar, silme): [../../entities/media.md](../../entities/media.md).

## Klasörler
- Klasörler ayrı oluşturulmaz; **dosya yüklenirken** atanır. Kütüphane ekranında yükleme klasörü = o an seçili Klasör
  filtresi; filtre "Tüm Klasörler" ise `general`. Diğer ekranların görsel seçicileri kendi klasörlerine yükler
  (ör. `pages`, `banners`, `logos`, `badges`, `etbis`).
- Klasör filtresi yalnız içinde dosya bulunan klasörleri listeler; hiç klasör yoksa filtre görünmez.
- Dosyanın klasörü yükleme sırasında, seçili klasör filtresine göre belirlenir.
- Etiketler (Düzenle diyaloğu) yalnız arama içindir; etikete göre filtre yoktur.

## Kullanım yerleri
- Kütüphane bir dosyanın hangi ürün/sayfa/blok/marka/branding kaydında kullanıldığını **göstermez**. Silmeden önce
  kullanıcıya nerede kullanıldığını sor; gerekirse ilgili kayıtları açıp görsel URL'sini karşılaştır.

## Ön koşullar ve bağımlılıklar
- Oturum açık admin kullanıcı; yükleme için `content:create` / `content:write`.
- Bu ekranın bağımlı olduğu başka bir veri yok; tersine, ana sayfa/sayfa blokları, branding (logo/favicon), layout-settings (header logo, mega menü görseli, ETBİS), kategori/blog/ürün görselleri bu kütüphanedeki URL'leri kullanır.

## Yerleşim
Tek kart:
1. **Başlık satırı**: Başlık "Medya Kütüphanesi / Media Library" + toplam dosya sayısı rozeti; alt açıklama "Görsel, video ve belgelerinizi yönetin / Manage your images, videos, and documents" (yalnızca sm+). Sağda birincil buton "Dosya Yükle / Upload Files" (Upload ikonu).
2. **Filtre satırı**: Arama input'u, Tip select'i (sm+ görünür), Klasör select'i (yalnızca en az bir klasör varsa ve sm+).
3. **Toplu işlem çubuğu**: en az bir dosya seçiliyse görünür.
4. **Medya ızgarası** (`data-testid="media-grid"`): 2/3/4/5/6 sütunlu kare kartlar. Her kart: küçük resim (görsel ise `<img alt=alt||originalName>`; değilse dosya ikonu), sol üstte seçim checkbox'ı (hover'da veya seçiliyken görünür), sağ üstte seçili ise mavi onay ikonu, sol altta tip rozeti (`image`, `video`… ham değer, çevrilmez), sağ altta hover'da görünen "⋯" aksiyon menüsü butonu; altında başlık (title || originalName, tooltip'te originalName), boyut ve tarih.
5. **Sonsuz kaydırma**: sayfa boyutu 20; listenin sonuna gelince sonraki sayfa yüklenir; yüklenirken "Daha fazla dosya yükleniyor... / Loading more files...". Alt bilgi: "{total} dosyadan {loaded} tanesi gösteriliyor / Showing {loaded} of {total} files"; hepsi yüklenince "Tüm dosyalar yüklendi / All files loaded".
6. Boş durum: "Medya dosyası bulunamadı / No media files found" + "Başlamak için dosya yükleyin. / Upload files to get started.".
Diyaloglar: Yükleme (başlık "Dosya Yükle / Upload Files"), Silme onayı, Düzenleme, Görsel önizleme.

## Alanlar
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Filtre | placeholder "Dosya ara... / Search files..." | `search` (query) | Input (text) | Hayır | ~300 ms gecikmeli arama, değişince liste baştan yüklenir | `getByPlaceholder('Dosya ara...')` | Dosya adı, başlık, alt metin ve etiketler içinde arar |
| Filtre | "Tüm Tipler / All Types" (seçenekler: "Görseller / Images" `image`, "Videolar / Videos" `video`, "Belgeler / Documents" `document`, "Ses / Audio" `audio`, "Arşivler / Archives" `archive`) | `type` | Select (button `role=combobox` + `role=listbox`) | Hayır | Varsayılan `all` | combobox içinde metin "Tüm Tipler"; `getByRole('option',{name:'Görseller'})` | Mobilde (<sm) gizli |
| Filtre | "Klasör / Folder" (ilk seçenek "Tüm Klasörler / All Folders") | `folder` | Select | Hayır | Yalnızca en az bir klasör varken görünür | FolderOpen ikonlu combobox | Mobilde gizli |
| Izgara kartı | (checkbox) | selection | Checkbox (`role=checkbox`) | — | Çoklu seçim açık | kart içinde `getByRole('checkbox')`; karta tıklamak da seçimi değiştirir | Seçince toplu işlem çubuğu çıkar |
| Yükleme diyaloğu | "Dosyaları sürükleyip bırakın veya göz atmak için tıklayın / Drag and drop files here, or click to browse" + "Max 50 MB per file" | `file` | Dropzone (gizli `<input type="file" multiple>`) | Evet | Tek seferde en fazla **20** dosya; dosya başına 50 MB. İzinli tipler: jpeg/jpg/png/gif/webp, mp4/webm/quicktime, pdf/doc/docx/xls/xlsx, mp3/wav/ogg, zip/rar/gz — **SVG yüklenemez**; uzantı dosya tipiyle eşleşmeli; çift/tehlikeli uzantılar reddedilir | `setInputFiles('input[type=file]', path)` (dropzone gizli input) | Dosyalar **sırayla** yüklenir, her biri için ilerleme çubuğu; yükleme klasörü = o an seçili Klasör filtresi, filtre seçili değilse `general` |
| Düzenleme diyaloğu (bilgi) | "Dosya Adı: / Filename:", "Boyut: / Size:", "Tip: / Type:", "Boyutlar: / Dimensions:", "URL:" (kopyala + yeni sekmede aç ikon butonları) | — | Salt okunur | — | — | — | URL kopyalama toast'ı "Copied" |
| Düzenleme diyaloğu | "Başlık / Title" (placeholder "Medya başlığı / Media title") | `title` | Input | Hayır | max 200 | `getByLabel('Başlık')` | |
| Düzenleme diyaloğu | "Alternatif Metin / Alt Text" (placeholder "Erişilebilirlik için alternatif metin / Alternative text for accessibility"; açıklama "Ekran okuyucular için görseli tanımlayın / Describe the image for screen readers") | `alt` | Input | Hayır | max 500 | `getByLabel('Alternatif Metin')` | Alt metin yalnızca burada ayarlanır (picker'da alan yok) |
| Düzenleme diyaloğu | "Altyazı / Caption" (placeholder "Görsel altyazısı / Image caption") | `caption` | Textarea | Hayır | max 1000 | `getByLabel('Altyazı')` | |
| Düzenleme diyaloğu | "Etiketler / Tags" (placeholder "Etiket ekle / Add a tag") | `tags[]` | Input + Tag ikon butonu; Enter ile ekler; rozet tıklanınca siler | Hayır | Küçük harfe çevrilir, aynı etiket tekrar eklenmez | `getByPlaceholder('Etiket ekle')` + Enter | |

## Aksiyonlar
| Buton (tr / en) | Yer | Etki | Onay/Toast |
|---|---|---|---|
| "Dosya Yükle / Upload Files" | Başlık sağ | Yükleme diyaloğunu açar | — |
| Dropzone'a dosya bırak / tıkla-seç | Yükleme diyaloğu | Dosyalar yüklenir; başarılılar listenin başına eklenir, diyalog kapanır | Başarı: "Başarılı / Success" + "{count} dosya başarıyla yüklendi / Successfully uploaded {count} file(s)". Dosya bazlı hata: "Upload failed" + "<dosya>: <mesaj>". İstemci reddi toast'ları: "Too many files", "File type not supported", "File too large" |
| Kart "⋯" → "Önizleme / Preview" | Kart menüsü | Görsel ise büyük önizleme; değilse URL yeni sekmede | — |
| Kart "⋯" → "Düzenle / Edit" | Kart menüsü (update izni) | Düzenleme diyaloğu açılır → "Değişiklikleri Kaydet / Save Changes" | Toast "Saved" / "Media metadata updated successfully."; hata "Error" |
| Kart "⋯" → "URL Kopyala / Copy URL" | Kart menüsü | Panoya dosya URL'si | "URL panoya kopyalandı / URL copied to clipboard" |
| Kart "⋯" → "İndir / Download" | Kart menüsü | Dosyayı indirir | — |
| Kart "⋯" → "Sil / Delete" | Kart menüsü (delete izni) | Onay diyaloğu: başlık "Dosya Silinsin mi? / Delete File?", açıklama "\"{name}\" dosyasını silmek istediğinizden emin misiniz? / Are you sure you want to delete \"{name}\"?"; "İptal / Cancel" / "Sil / Delete" (kırmızı) | "Dosya başarıyla silindi / File deleted successfully"; hata "Dosya silinemedi. Lütfen tekrar deneyin. / Failed to delete file. Please try again." |
| "Seçimi Temizle / Clear Selection" | Toplu çubuk | Seçimi sıfırlar | — |
| "Seçilenleri Sil / Delete Selected" | Toplu çubuk (delete izni) | Seçili dosyaları **onay diyaloğu göstermeden** kalıcı siler, liste baştan yüklenir | Başarı "Dosya başarıyla silindi"; hata "Dosyalar silinemedi. Lütfen tekrar deneyin. / Failed to delete files. Please try again." |
Draft/publish kavramı yoktur; yükleme anında kalıcıdır.

## Picker (medya seçici alanı + medya seçme diyaloğu) — diğer ekranlardan görsel seçme/yükleme
Ana sayfa ve sayfa blokları (Hero, Banner, Carousel, Image, Video poster, Features), sayfa ayarları (öne çıkan görsel), branding, layout-settings bu seçiciyi kullanır.

**Medya seçici alanı (alan görünümü)**:
- Üstte alan etiketi (ör. blok editöründe verilen label).
- Solda önizleme kutusu (kesik kenarlı). Boşsa görsel ikonu + "Görsel yok / No image"; **boş kutuya tıklamak picker'ı açar**. Doluysa küçük resim + sağ üstte kırmızı X butonu `aria-label="Görseli kaldır / Remove image"`.
- Sağda ikon butonları: ImagePlus butonu `aria-label`/`title` = boşken "Gözat / Browse", doluyken "Değiştir / Change" → picker diyaloğunu açar; ExternalLink butonu `aria-label="URL'yi manuel olarak girin / Enter URL manually"` → altında metin input'u açar (placeholder "Görsel seçin... / Select image..."); odaktan çıkınca format uyarısı "Lütfen geçerli bir URL girin (örn. https://example.com) veya bu alanı boş bırakın / Please enter a valid URL (e.g., https://example.com) or leave this empty" (engellemez). Bazı alanlarda üçüncü buton "{label} görselini kullan / Use {label}".
- **Kaydedilen değer yalnızca görselin URL'sidir** — medya kaydı, alt metin, varyant taşınmaz. Alt metin gerekiyorsa ilgili blok/alanın kendi alt metin alanı kullanılmalı veya medya kütüphanesinde Düzenle ile girilmeli.

**Medya seçme diyaloğu**:
- Başlık: `"{label} seçin / Select {label}"` (alandan açıldığında), aksi halde "Medya Seç / Select Media". Açıklama: tekli modda "Medya kütüphanenizden bir dosya seçin / Select a file from your media library"; çoklu modda "En fazla {count} dosya seçin / Select up to {count} file(s)".
- Sekmeler (`role=tab`): "Göz At / Browse" ve (yükleme açıksa) "Yükle / Upload".
- Göz At sekmesinde: arama input'u placeholder "Ara... / Search...", Tip select'i ("Tüm Tipler / All Types" …), Klasör select'i ("Tüm Klasörler / All Folders"), kaydırılabilir ızgara (20'lik sayfalar, sonsuz kaydırma). Kart menüsünde Önizleme ve **Sil** de vardır (picker'dan silme mümkündür — dikkat). Görsel alanlarında yalnız görsel dosyalar listelenir.
- Tekli modda karta tıklamak onu seçer (başka seçimi bırakır). Alt bilgi: "{count} dosya seçildi / {count} file(s) selected (dosya adları)".
- Footer butonları: "İptal / Cancel" ve **"Seç / Select"** (seçim yoksa disabled). "Seç" → alan değeri dosyanın URL'si olur, diyalog kapanır.
- **Picker içinden yükleme akışı** (Playwright için):
  1. Alan üzerindeki "Gözat/Browse" (ImagePlus) butonuna veya boş önizleme kutusuna tıkla.
  2. Diyalogda `getByRole('tab',{name:'Yükle'})` (en: "Upload").
  3. `setInputFiles('input[type=file]', <yerel dosya>)` — görsel alanlarında yalnız görsel kabul edilir, tekli modda 1 dosya, 50 MB sınırı; jpeg/png/gif/webp, SVG yüklenemez.
  4. Yükleme bitince diyalog **otomatik "Göz At" sekmesine döner ve yüklenen dosyayı seçili yapar**. Yeni kart listenin başında.
  5. "Seç / Select" butonuna tıkla. (Tıklamadan kapatırsan değer atanmaz.)
- Picker'dan yüklenen dosya, alana göre bir klasöre düşer (ör. blok/sayfa görselleri `pages`, banner görselleri `banners`; branding logoları `logos`/`badges`, ETBİS `etbis` klasörüyle açılır).
- Bazı alanlar diyaloğu belirli bir Klasör filtresiyle açar; diyalog kapanınca filtre sıfırlanır.

## Yan etkiler
- Yükleme dosyayı kalıcı olarak kütüphaneye ekler; görseller için küçük/orta/büyük + webp varyantları üretilir.
- Silme yalnızca medya dosyasını siler; bu URL'yi kullanan blok/sayfa/branding kayıtları **otomatik güncellenmez** → vitrinde kırık görsel riski. Silmeden önce dosyanın nerede kullanıldığını kullanıcıya sor.
- Medya yüklemek/düzenlemek tek başına vitrini değiştirmez; görsel ancak bir alana atanıp o kayıt kaydedildiğinde vitrinde görünür.

## Tuzaklar
- Dropzone'un gerçek input'u gizlidir; `setInputFiles('input[type=file]')` kullan. Kütüphane yükleme diyaloğunda tek bir dosya input'u vardır; picker diyaloğunda "Yükle" sekmesi seçilmeden input DOM'da olmayabilir.
- SVG yüklenemez ("File type image/svg+xml is not allowed"). Uzantı dosya tipiyle uyuşmazsa "File extension does not match declared file type".
- Tip ve Klasör filtreleri mobil genişlikte (<640 px) gizlidir; tarayıcıyı masaüstü genişliğinde kullan.
- Kart aksiyon menüsü butonu yalnızca hover'da görünür; önce karta hover et.
- Karta tıklamak seçimi değiştirir (önizleme açmaz).
- Picker yalnızca URL döndürür; alt metin taşınmaz.
- Picker'da Sil menüsü de var — yanlışlıkla gerçek medya silinebilir.
- "Seçilenleri Sil" ekranda ayrıca onay sormaz; onayı önceden sohbette, dosya adları ve sayısıyla al (kural 5).
- Silme geri alınamaz; kütüphaneden kalkan dosya geri getirilemez, o URL'yi kullanan alanlar kırık görselle kalabilir.
- Picker çoklu modda varsayılan olarak en fazla 10 dosya seçtirir/yükletir (alan farklı sınır verebilir).

## Doğrulama
- Yükleme sonrası: toast "{count} dosya başarıyla yüklendi", başlık rozetindeki sayı arttı, yeni kart ızgaranın başında.
- Picker sonrası: alan önizleme kutusunda küçük resim görünür, ImagePlus butonunun etiketi "Değiştir / Change" olur; URL modunu açınca input'ta mutlak dosya URL'si görünür.
- Kütüphanede arama kutusuna dosya adını yaz → kart listede.
- Silme sonrası kart kaybolur; toplam sayı azalır.
