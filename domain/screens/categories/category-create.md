# Kategori Oluştur (Create Category)
- URL: `{ADMIN_URL}/categories/new` · alt kategori için `{ADMIN_URL}/categories/new?parentId={ebeveynId}`
- Amaç: Yeni (alt) kategori: ad, slug, açıklama, üst kategori, sıra, durum, öne çıkan, görseller, SEO, store view çevirileri.
- Yetki: listedeki düğme `categories` create yetkisiyle görünür; kaydetme `categories:write`.
- Veri / API:
  - Ön koşul kontrolü: aktif store view'lar. Yeterli değilse form **açılmaz**.
  - Yükleme: store view listesi; Üst Kategori için kategori listesi.
  - Kaydet adım 1: `POST /categories` — ad, slug, açıklama, üst kategori, durum, sıra, öne çıkan, görseller, SEO.
  - Kaydet adım 2: dolu her çeviri için ayrı çeviri kaydı (ad, slug, açıklama, SEO).

## Ön koşullar ve bağımlılıklar
- **En az 1 aktif store view** (yoksa sayfada ön koşul kartı ve `/settings/store-views` düğmesi; form yok).
- Üst kategori kullanılacaksa önce o oluşturulmalı (ağaç yukarıdan aşağı kurulur). Derinlik en fazla 5 seviye.
- Slug benzersiz olmalı → [category-list.md](category-list.md)'de adla/slugla ara (arşivlenmişler için Durum: Arşivlenmiş).
- Görseller medya kütüphanesinde olmalı ya da dialogdan yüklenir / URL girilir.
- Entity: [../../entities/category.md](../../entities/category.md).

## Yerleşim
- Başlık "Kategori Oluştur / Create Category", "Yeni bir ürün kategorisi oluşturun", geri linki "Kategorilere Dön" (kaydedilmemiş değişiklik varsa onay ister).
- (Koşullu) kırmızı uyarı "Kaydetmeden önce en az bir çeviri doldurulmalıdır…" — yalnız çevrilebilir store view varken ve hiç ad yokken.
- (Koşullu, ≥1 varsayılan-dışı store view varsa) **Store view çubuğu**: "Mağaza Görünümü" select (Varsayılan + diğerleri), "{ad} için düzenleniyor", "{c}/{t} alan", durum rozeti (Yayında/Taslak/Değiştirildi).
- Sekmeler: **"Temel Bilgiler / Basic Info"**, **"Medya / Media"**, **"SEO"** (Ürünler sekmesi yalnız edit'te). Hatalı sekmede kırmızı nokta.
- Hata özeti kutusu "Lütfen aşağıdaki hataları düzeltin:" (`alan: mesaj` listesi).
- Yapışkan alt bar: "Kaydedilmemiş değişiklikleriniz var" + **"İptal / Cancel"**, **"Kategori Oluştur / Create Category"** (kaydederken "Kaydediliyor...").

## Alanlar
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Temel › Temel Bilgiler | Kategori Adı * / Category Name * | `name` | text | evet | 1–255 ("Name is required") | placeholder "Kategori adını girin" / "Enter category name" | "Kategorinizin müşterilere görüneceği şekildeki adı". Slug'ı otomatik doldurur. |
| Temel › Temel Bilgiler | URL Kısaltması * / URL Slug * | `slug` | text | evet | `^[a-z0-9]+(?:-[a-z0-9]+)*$`, ≤255 ("Slug must be lowercase with hyphens only") | placeholder "kategori-url-adresi" / "category-url-slug" | Addan türetilir (Türkçe transliterasyon: "Cep Telefonları" → `cep-telefonlari`). Slug'a elle dokununca takip durur. Mağazada benzersiz. |
| Temel › Temel Bilgiler | Açıklama / Description | `description` | textarea | hayır | ≤2000 | placeholder "Kategori açıklaması" | Düz metin (rich-text değil). |
| Temel › Üst Kategori | Üst Kategori / Parent Category | `parentId` | select | hayır | "Ana Kategoriler / Root Categories" (= kök) | `getByRole('combobox', { name: 'Üst Kategori' })` → `getByRole('option', { name: /Elektronik/ })` | Seçenekler "—" × seviye + ad (ör. "— Telefonlar"). Yüklenirken disabled. `?parentId=` ile gelindiyse önceden seçili. |
| Temel › Üst Kategori | Sıralama / Sort Order | `sortOrder` | number | hayır | tam sayı ≥0, varsayılan 0 | `getByRole('spinbutton', { name: 'Sıralama' })` | Kardeşler arasında sıra (küçük önce). |
| Temel › Görünürlük | Durum * / Status * | `status` | select | evet | varsayılan `active` | `getByRole('combobox', { name: /Durum/ })` | Aktif / Pasif / Menüde Gizli (`hidden`). Arşiv yok. |
| Temel › Görünürlük | Öne Çıkan / Featured | `isFeatured` | checkbox | – | false | `getByRole('checkbox', { name: 'Öne Çıkan' })` | |
| Medya › Kategori Görseli | Ana Görsel / Main Image | `imageUrl` | medya seçici alanı | hayır | – | kart içinde `getByRole('button', { name: 'Gözat' })` → dialog "Medya Seç" (sekmeler "Göz At" / "Yükle") → görsel → "Seç"; ya da link ikonu "URL'yi manuel olarak girin" → input | "önerilen: 800x800px". |
| Medya › Küçük Görsel | Küçük Görsel / Thumbnail Image | `thumbnailUrl` | medya seçici alanı | hayır | – | 2. kartın "Gözat" düğmesi | 200x200px |
| Medya › Banner Görseli | Banner Görseli / Banner Image | `bannerUrl` | medya seçici alanı | hayır | – | 3. kartın "Gözat" düğmesi | 1920x400px |
| SEO (Varsayılan görünüm) | Meta Başlığı / Meta Title | `metaTitle` | text | hayır | ≤100 | placeholder "Arama motorları için SEO başlığı" | Arama önizlemesi kartı ile. |
| SEO | Meta Açıklaması / Meta Description | `metaDescription` | textarea | hayır | ≤300 | placeholder "Arama motorları için SEO açıklaması" | |
| SEO | Anahtar Kelimeler / Keywords | `metaKeywords` | text | hayır | – | placeholder "anahtar1, anahtar2, anahtar3" | |
| SEO | Odak Anahtar Kelime / Focus Keyword | `focusKeyword` | text | – | – | | |
| SEO | Kanonik URL / Canonical URL | `canonicalUrl` | text | hayır | – | placeholder "https://magazaniz.com/kategori" | |
| SEO › Open Graph | OG Başlığı · OG Açıklaması · OG Görseli | `ogTitle` (≤100), `ogDescription` (≤300), `ogImage` | text/textarea | hayır | | etiket adlarıyla | |
| SEO › Twitter | Twitter Başlığı/Açıklaması/Görseli | – | text | – | – | | |
| SEO › İndeksleme | İndekslemeye İzin Ver · Bağlantıları Takip Et | – | checkbox | – | – | | |
| Store view çubuğu | Mağaza Görünümü / Store View | – | select | – | Varsayılan | `getByRole('combobox')` (çubuktaki) → `getByRole('option', { name: 'English' })` | Varsayılan dışı bir görünüm seçilince sekmeler o görünüm için **çeviri moduna** geçer. |
| Temel (çeviri modu) | Kategori Adı * · URL Kısaltması · Açıklama | – | text/textarea | ad önerilir | slug: aynı kural | placeholder = varsayılan dildeki değer | Uyarı: "Dile özgü olmayan alanlar (üst kategori, sıralama, durum vb.) varsayılan dilde düzenlenir." |
| SEO (çeviri modu) | Meta Başlığı · Meta Açıklaması · Anahtar Kelimeler · Kanonik URL | – | text | hayır | ≤100 / ≤300 / ≤500 / ≤500 | | Anahtar kelimeler virgülle ayrılır. |
| Medya (çeviri modu) | – | – | salt okunur (soluk) | – | – | – | Medya store view'a göre değişmez. |

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay | Sonuç |
|---|---|---|---|
| Kategori Oluştur / Create Category (alt bar) | form doğrulanır → kategori, ardından çeviriler kaydedilir | uygulama sormaz → özet + onay | Başarı: toast "İşlem başarıyla tamamlandı" / "Kategori başarıyla oluşturuldu" → `/categories`. Çeviri hatası: kategori oluşmuş olsa da kırmızı toast → `/categories` (detayda kontrol et). Kategori hatası: kırmızı toast, sunucu mesajı (ör. slug çakışması `CATEGORY_SLUG_EXISTS`) ya da "Kategori yüklenemedi". |
| İptal / Cancel · "Kategorilere Dön" | değişiklik varsa dialog "Kaydedilmemiş değişiklikler" → "İptal" / **"Ayrıl / Leave"** | – | `/categories` |
| (tarayıcı sekmesi kapatma) | değişiklik varken tarayıcı uyarısı | | |

## Yan etkiler
- Kategori ebeveyninin altına eklenir; seviyesi hesaplanır.
- **Slug arşivlenmiş bir kategoriyle aynıysa** yeni kayıt yaratılmaz, arşivdeki kategori geri yüklenip güncellenir (aynı kayıt, eski ürün ilişkileri ve çevirileriyle) — kullanıcıya söyle.

## Tuzaklar
- Boş çeviriler kaydedilmez; store view çubuğunda bir görünüm seçip hiçbir şey yazmamak sorun değildir.
- Çeviri modunda slug boş bırakılırsa addan otomatik slug üretilir; belirli bir slug isteniyorsa elle yaz.
- Doğrulama alandan çıkınca çalışır; hata mesajları alan altında ve sayfa altındaki özet kutusunda. Hatalı sekmede kırmızı nokta.
- Durum `hidden` = "Menüde Gizli" (kategori sayfası erişilebilir, menüde yok — vitrin davranışı doğrulanmadı).
- Kategori formunda attribute set / filtre attribute seçimi **yok**.

## Doğrulama
- Toast "Kategori başarıyla oluşturuldu" ve `/categories`.
- Listede adı ara; ebeveyn altında göründüğünü kontrol et; ya da tablo görünümü ⋯ → "Detayları Görüntüle" → [category-detail.md](category-detail.md) (slug, seviye, üst kategori, medya, SEO, çeviriler).
