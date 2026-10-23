# Blog Yazısı Oluştur + Düzenle (Create Post / Edit Post)
- URL: {ADMIN_URL}/content/blog/new (oluştur) · {ADMIN_URL}/content/blog/{id}/edit (düzenle)
- Menü yolu: "İçerik / Content" → "Blog" → "Yeni Yazı / New Post"; düzenleme listede satır menüsü "Düzenle" veya detayda "Düzenle".
- Amaç: Blog yazısı oluşturmak ve düzenlemek: başlık/slug/özet, içerik (blok editörü + düz metin), öne çıkan görsel ve galeri, SEO, blog kategorileri/etiketleri, yazar, yayın durumu ve (düzenlemede) dil bazlı çeviriler. Yazı vitrinde `/{locale}/blog/{slug}` adresinde ve blog listesinde görünür.
- Yetki (permission): Oluştur ekranı `content:create`, düzenleme ekranı `content:update` (yetkisizse form görünmez); sunucuda kayıt/yayın `content:write`.
- İşlemler:
  | İşlem | Ekran | Ne yapar | Yetki |
  |---|---|---|---|
  | Oluştur | new | Yazıyı formdaki **durumla** oluşturur (Yayında seçiliyse anında canlı) | `content:write` |
  | Kaydet | edit | Formu doğrulamasız kaydeder; durum alanındaki değer de yazılır | `content:write` |
  | Yayınla / Güncelle ve Yayınla | edit | Doğrular, kaydeder, yazıyı yayına alır (yayın tarihi = şimdi) | `content:write` |
  | Taslağa Dön | edit | Kaydeder ve yazıyı yayından kaldırır | `content:write` |
  | Dil yayını | edit (dil görünümü) | Yalnız o dilin çevirisini yayına alır | `content:write` |
  | Senkronize et | edit (çok dilli) | Metinleri kaynak dilden kopyalar ve **hemen kaydeder** | `content:write` |
- Oluşturma sonrası listeye (`/content/blog`) döner — yeni yazının düzenleme ekranına gitmez.

## Ön koşullar ve bağımlılıklar
- Slug mağazada benzersiz (`CMS_BLOG_SLUG_EXISTS`); çeviri slug'ları da başka yazının/dilin adresiyle çakışamaz (`CMS_BLOG_ADDRESS_TAKEN`).
- Görseller medya kütüphanesinden seçilir/yüklenir ([media-library.md](media-library.md) "Picker" bölümü).
- Bloklarda kullanılacak ürün/kategori/form mevcut olmalı ([../../entities/homepage-components.md](../../entities/homepage-components.md)).
- Çeviri sekmesi/dil görünümü yalnız mağazada varsayılan dil dışında aktif bir store view dili varsa çıkar.
- Blog kategorileri ürün kategorilerinden bağımsızdır; önceden oluşturulmaz, formda serbest metinle eklenir.

## Yerleşim — Oluştur (`/content/blog/new`)
- Başlık satırı: geri ok (aria-label "Geri / Back"), "Yazı Oluştur / Create Post", durum rozeti (seçili durum), okuma süresi rozeti ("{n} dk Okuma"), açıklama satırı. Sağda: kayıt durumu ("Kaydediliyor..."), "Öne Çıkan Yazı / Featured Post" (yıldız, aç/kapa), "İptal / Cancel", "Oluştur / Create" (submit).
- Sekmeler: "Temel Bilgiler / Basic Info" (varsayılan), "İçerik / Content", "Medya / Media", "SEO", "Kategoriler / Categories", "Yazar / Author". Hatalı sekmede kırmızı nokta.
- Oluştur ekranında çeviri/dil görünümü yok; çeviriler kayıttan sonra düzenleme ekranında girilir.
- Mobilde butonlar altta tekrar eder.

## Yerleşim — Düzenle (`/content/blog/{id}/edit`)
- Yapışkan başlık: geri ("Geri / Back" → `/content/blog`), "Yazıyı Düzenle / Edit Post", altında yazı başlığı. Sağda:
  - "Yazıyı Önizle / Preview Post" — vitrinde `/blog/{slug}` açar (yalnız yayındaki yazı görünür).
  - "Kaydet / Save" — yalnız kaydedilmemiş değişiklik varken etkin.
  - Yazı yayında değilse "Yayınla / Publish"; yayındaysa "Güncelle ve Yayınla / Update & Publish" + yanındaki ok menüsü → "Taslağa Dön / Revert to Draft".
- Durum çubuğu: (çok dilli mağazada) "Görünüm / View" seçicisi (varsayılan dil + çeviri dilleri), durum rozeti ("Taslak / Draft", "Aktif / Active" = yayında, "Kaydedilmemiş Değişiklikler / Unsaved Changes" = yayında + değişiklik var), kayıt durumu metni ("Tüm değişiklikler kaydedildi", "{time} kaydedildi", "Kaydedilmemiş değişiklik yok", "Kayıt başarısız"), ortada "{dil} için içerik düzenleniyor", sağda "Senkronize et... / Sync from...".
- Sekmeler: Oluştur ile aynı altı sekme. Hata sayısı sekme rozetinde.
- "Yayınla" denemesinde hata varsa sekmelerin altında kırmızı kutu: "Yayınlamadan önce {n} hatayı düzeltin" + "Alan — Zorunlu alan / Çok uzun / Geçersiz format" satırları; satıra tıklamak ilgili sekmeyi açar.
- Dil görünümünde "Medya", "Kategoriler", "Yazar" sekmeleri salt okunur: "Bu ayarlar tüm diller için ortaktır. Değiştirmek için varsayılan görünüme geçin."

## Alanlar
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Temel Bilgiler › Yazı Detayları | Başlık * / Title * | `title` | Input | evet | 1–255 ("Title is required") | `getByLabel('Başlık *')` | Dil görünümünde o dilin başlığı |
| Temel Bilgiler | URL Adresi * / URL Handle * | `slug` | Input, önünde "/blog/" | evet | `^[a-z0-9]+(?:-[a-z0-9]+)*$`, ≤255 ("Slug must be lowercase with hyphens only (e.g., \"my-blog-post\")") | `getByLabel('URL Adresi *')` | Yazarken a-z, 0-9 ve tire dışındaki karakterler silinir. Boşsa başlıktan üretilir (yalnız varsayılan dilde) |
| Temel Bilgiler | Özet / Excerpt | `excerpt` | Textarea | hayır | ≤500 | `getByLabel('Özet')` | Liste kartlarında ve arama açıklaması yedeği |
| Temel Bilgiler › Yayınlama | Durum / Status | `status` | Select | — | `draft`; Taslak / Yayında / Zamanlanmış / Arşivlendi. İpucu: "Yalnızca yayında olan yazılar web sitesinde görünür" | combobox | Yalnız varsayılan görünümde. **Yayında + Oluştur/Kaydet = anında canlı** |
| Temel Bilgiler › Yayınlama | Zamanlama Tarihi / Schedule Date | `scheduledAt` | `input[type=datetime-local]` | — | null | `getByLabel('Zamanlama Tarihi')` | Yalnız durum "Zamanlanmış" iken görünür. Tarihte otomatik yayına geçiş doğrulanmadı |
| İçerik › Yazı İçeriği (Eski) / Post Content (Legacy) | (etiketsiz) | `content` | Textarea (HTML/Markdown) | — | '' | placeholder "Blog yazınızın içeriğini buraya yazın..." | Sağ üstte "~{n} dk okuma ({w} kelime)". Okuma süresi yalnız bu metinden hesaplanır. **Blok varsa vitrinde bu metin gösterilmez** |
| İçerik › İçerik Blokları / Content Blocks — sekme "Görsel / Visual" | — | `contentBlocks` | Blok editörü (blog bağlamı) | — | [] | bkz. [../design/homepage-builder.md](../design/homepage-builder.md) blok editörü | Eklenebilen bloklar aşağıda |
| İçerik › sekme "JSON" | — | `contentBlocks` | Textarea (JSON) | — | — | | Gelişmiş; otomasyonda kullanma |
| Medya › Öne Çıkan Görsel / Featured Image | Öne Çıkan Görsel | `featuredImage` | Medya seçici alanı (Gözat + URL girişi) | — | '' ; geçerli URL olmalı | label ile | Blog kartlarında, yazı başında ve sosyal paylaşımda. Picker: media-library.md |
| Medya › Görsel Galerisi / Image Gallery | "Kütüphaneye Gözat / Browse Library" | `gallery` | Çoklu medya seçme diyaloğu | — | [] ; en çok 10 | buton adı | Kart üzerinde X ile kaldır. Vitrinde gösterimi doğrulanmadı |
| SEO › Temel SEO | SEO Başlığı / SEO Title | `seoTitle` | Input | — | ≤100 (önerilen 50-60) | label | Boşsa yazı başlığı |
| SEO | Meta Açıklama / Meta Description | `seoDescription` | Textarea | — | ≤300 (önerilen ≤160) | label | Boşsa özet |
| SEO | Anahtar Kelimeler / Keywords | `seoKeywords` | Input (virgülle) | — | ≤500 | label | |
| SEO | Odak Anahtar Kelime / Focus Keyword | `focusKeyword` | Input | — | ≤100 | label | |
| SEO | Kanonik URL / Canonical URL | `canonicalUrl` | Input | — | geçerli URL | label | |
| SEO › Sosyal Paylaşım (Open Graph) | OG Başlık, OG Açıklama, OG Görsel URL | `ogTitle`, `ogDescription`, `ogImage` | Input/Textarea/medya alanı | — | ≤100 / ≤300 / URL (önerilen 1200x630) | label | |
| SEO › Twitter Kartı | Twitter Başlık, Twitter Açıklama, Twitter Görsel URL | `twitterTitle`, `twitterDescription`, `twitterImage` | Input/Textarea/medya alanı | — | ≤100 / ≤300 / URL | label | |
| SEO › İndeksleme Seçenekleri | İndekslemeye İzin Ver / Allow Indexing | `indexable` | Switch | — | açık | label | |
| SEO | Bağlantıları Takip Et / Follow Links | `followable` | Switch | — | açık | label | |
| Kategoriler › Etiketler / Tags | "Bir etiket girin..." + "Ekle / Add" | `tags` | Input + buton (Enter da ekler) | — | ≤20; küçük harfe çevrilir, tekrar eklenmez | placeholder | Rozetteki X ile kaldır |
| Kategoriler › Kategoriler / Categories | "Bir kategori adı girin..." + "Ekle / Add" | `categories` | Input + buton (Enter da ekler) | — | ad ≤100; slug addan (küçük harf, boşluk→tire) | placeholder | Serbest metin; vitrinde kategori filtresi olarak çıkar |
| Kategoriler › Yazı Ayarları | Öne Çıkan Yazı / Featured Post | `isFeatured` | Checkbox | — | kapalı | label | Başlıktaki yıldız butonuyla aynı alan |
| Kategoriler › Yazı Ayarları | Yorumlara İzin Ver / Allow Comments | `allowComments` | Checkbox | — | açık | label | |
| Yazar › Yazar Bilgileri | Ad * / Name * | `authorName` | Input | **evet (kayıt için)** | ≤100 | `getByLabel('Ad *')` | Boşsa sunucu kaydı reddeder (genel hata toast'ı) |
| Yazar | Biyografi / Bio | `authorBio` | Textarea | — | ≤500 | label | Vitrinde yazar kutusunda |
| Yazar | Avatar URL | `authorAvatar` | Medya seçici alanı | — | '' | label | Öne çıkan görseli kullanma kısayolu var |
| Yazar | Web Sitesi / Website | `authorWebsite` | Input | — | '' | label | |
| Yazar › Sosyal Bağlantılar | Twitter/X, LinkedIn, GitHub, Diğer Profil | `authorSocial` | Input ×4 | — | '' | placeholder | |
| Durum çubuğu (edit) | Görünüm / View | — | Select | — | varsayılan dil | combobox `Görünüm` | Dil seçmek o dil için çeviri girdisi açar |

### Dil görünümünde (çeviri) düzenlenen alanlar
Başlık, URL Adresi (elle yazılır; otomatik üretilmez), Özet, İçerik (düz metin + bloklar), SEO alanları. Durum, medya, kategoriler, etiketler, yazar tüm diller için ortaktır.

### Blog bağlamında eklenebilen bloklar
Blok kataloğu: [../../entities/homepage-components.md](../../entities/homepage-components.md). Blog yazısında **"Paket Karşılaştırma / Package Comparison" hariç** tüm bloklar eklenebilir (metin, görsel, video, HTML, buton, sütunlar, hero, banner, CTA, bülten, geri sayım, form, çerez tablosu, slayt gösterisi, özellikler, ürünler, kategoriler). Paket karşılaştırma bloğu içeren yazı kaydedilmez: "Paket karşılaştırma blokları yalnızca sayfalarda kullanılabilir, blog yazılarında kullanılamaz. Kaydetmek için bloğu kaldırın."

## Aksiyonlar
- **Oluştur / Create** (new): alan doğrulaması (odaktan çıkınca da) → hatalıysa sekmede kırmızı nokta, kayıt yok. Geçerliyse kaydeder → `/content/blog`'a döner + toast "İşlem başarıyla tamamlandı" / "Yazı başarıyla oluşturuldu". Hata toast'ları: "Bu yazı kaydedilemedi. Lütfen alanları kontrol edip tekrar deneyin.", görsel adresi hatasında "…Öne çıkan görsel adresi geçersiz — lütfen düzeltip tekrar deneyin.", paket karşılaştırma bloğu mesajı (yukarıda).
- **İptal / Cancel** veya geri ok (new): onaysız listeye döner, girilenler kaybolur.
- **Kaydet / Save** (edit): doğrulama yapmadan tüm formu kaydeder → toast "Değişiklikleriniz kaydedildi." (dil görünümünde "{dil} için değişiklikler kaydedildi."). Durum alanı neyse o yazılır → yayındaki yazıda veya Durum=Yayında seçiliyken **Kaydet de canlıya yazar**.
- **Yayınla / Güncelle ve Yayınla** (edit, varsayılan görünüm): tüm formu doğrular (hata kutusu) → kaydeder → yazıyı yayına alır, yayın tarihi şimdi olur → toast "Yazı başarıyla yayınlandı." Hata: "Kayıt yapılamadı. Lütfen birazdan tekrar deneyin." veya tanınan hata metni.
- **Yayınla** (edit, dil görünümü): kaydeder + yalnız o dilin çevirisini yayına alır → "{dil} için değişiklikler kaydedildi ve yayınlandı." Çeviride ne blok ne düz metin varsa reddedilir (`CMS_BLOG_TRANSLATION_EMPTY`).
- **Taslağa Dön / Revert to Draft**: kaydeder + yazıyı yayından kaldırır (yayın tarihi silinir) → toast "Yazı yayından kaldırıldı." Vitrinden düşer.
- **Senkronize et... / Sync from...** (çok dilli): seçilen kaynaktan başlık, slug, özet ve düz metin içeriği mevcut görünüme kopyalar → toast "İçerik {kaynak} kaynağından senkronize edildi." → **hemen otomatik kaydeder** (onay penceresi yok). Bloklar kopyalanmaz.
- **Yazıyı Önizle**: vitrinde yeni sekme; taslak yazı için sayfa bulunamaz.

## Yan etkiler
- Yayındaki yazı vitrinde `/{locale}/blog/{slug}` ve `/{locale}/blog` listesinde ~1 dk içinde güncellenir. Öne çıkan yazılar blog listesinin ilk sayfasında üstte (en çok 3) gösterilir.
- Etiket/kategori ortak olan diğer yayındaki yazılar, yazı sayfasının altında "ilgili yazılar" olarak listelenir.
- Medya diyaloğunda yapılan yükleme kütüphaneye kalıcı yazılır (yazı kaydedilmese bile).
- Menüye otomatik eklenmez; menü için [../design/navigation.md](../design/navigation.md) (bağlantı seçicide "Blog" grubu).
- Slug değişikliği eski adresi geçersiz kılar; menü/footer linkleri güncellenmez.

## Tuzaklar
- **Anında canlı (kural 6)**: Durum=Yayında ile "Oluştur", yayındaki yazıda "Kaydet" ve "Güncelle ve Yayınla" doğrudan canlıya yazar; "Senkronize et" onaysız kaydeder. Onayı butona/menüye dokunmadan **önce** al.
- Varsayılan durum Taslak; kullanıcı "yayınla" demediyse Taslak bırak ve özette belirt.
- Otomatik slug yalnız slug boşken ve yalnız başlıktaki ASCII harf/rakamlardan üretilir: Türkçe harfler (ç, ğ, ı, ö, ş, ü) dönüştürülmez, **atılır**; başlığı sonradan değiştirmek slug'ı güncellemez. Slug'ı her zaman elle ASCII karşılıkla yaz (ör. "Kış Modası" → `kis-modasi`) ve snapshot'la doğrula.
- Blok varsa vitrin "Yazı İçeriği (Eski)" metnini göstermez; içerik ya bloklarla ya düz metinle girilir — ikisini birden doldurma. Okuma süresi yalnız düz metinden hesaplanır.
- "Yazar" sekmesindeki "Ad *" doldurulmadan kayıt reddedilir ve hata toast'ı alanı belirtmez — her zaman doldur (kullanıcı vermediyse sor; mağaza adını öner, özette "varsayılan" işaretle).
- Dil görünümündeki "Yayınla" yalnız o dili yayınlar; ana yazının durumu ayrıca yönetilir.
- "Zamanlanmış" yazı vitrinde görünmez; zamanlama tarihinde otomatik yayına geçiş doğrulanmadı (ilk kullanımda kontrol et, kullanıcıya belirt).
- Oluşturduktan sonra listeye döner; ek düzenleme için listede başlığı ara → "Düzenle".
- Blok editörü tuzakları [../design/homepage-builder.md](../design/homepage-builder.md) ile aynıdır.

## Doğrulama
1. Toast + `/content/blog` listesinde başlığı ara: satır, durum, öne çıkan yıldızı doğru.
2. Detayı aç → içerik, görsel, kategori/etiket, yazar, SEO özeti kayıtlı.
3. Düzenleme ekranında rozet: yayındaysa "Aktif", değilse "Taslak"; "Kaydedilmemiş değişiklik yok".
4. Yayındaysa vitrin `{STOREFRONT_URL}/{locale}/blog/{slug}` (dil çevirisi için o dilin öneki ve çeviri slug'ı).
