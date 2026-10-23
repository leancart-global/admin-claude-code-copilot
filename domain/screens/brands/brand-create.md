# Marka Oluştur (Create Brand)
- URL: `{ADMIN_URL}/brands/new`
- Amaç: Yeni marka: ad, slug, durum, slogan, açıklama, web sitesi, menşei, kuruluş yılı, sıra, öne çıkan, logo/banner, SEO, store view çevirileri.
- Yetki: `products` create yetkisi yoksa sayfa `/brands`'a yönlendirir. Kaydetme `brands:write`.
- Veri / API:
  - Yükleme: store view listesi.
  - Kaydet: `POST /brands` — dolu alanlar (web sitesine `https://` eklenir, SEO anahtar kelimeleri virgülden listeye çevrilir) ve dolu çeviriler; boş alanlar gönderilmez.

## Ön koşullar ve bağımlılıklar
- Aynı/benzer adlı marka olmamalı → [brand-list.md](brand-list.md)'de ara (benzer ad 409 ile reddedilir).
- Logo/banner medya kütüphanesinden seçilir ya da dialogda yüklenir.
- Entity: [../../entities/brand.md](../../entities/brand.md). **Not:** ürün formunda marka alanı henüz yok (geliştiriliyor); marka oluşturmak ürüne atamak anlamına gelmez ([../../entities/product.md](../../entities/product.md)).

## Yerleşim
- Başlık "Marka Oluştur / Create Brand", "Ürün markalarını ve üreticileri yönetin", geri (→ `/brands`).
- (Varsayılan dışı store view varsa) store view çubuğu: "Görünüm / View" select, "{ad} için içerik düzenleniyor", "{c} / {t} alan", durum rozeti.
- Sekmeler: **"Temel Bilgiler / Basic Information"**, **"Medya / Media"**, **"SEO Ayarları / SEO Settings"**; kaydetme denemesinden sonra hatalı sekmede kırmızı sayı rozeti.
- Alt bar: "Kaydedilmemiş değişiklikleriniz var", "{n} hata düzeltilmeli", **"İptal / Cancel"**, **"Kaydet / Save"** ("Kaydediliyor...").

## Alanlar
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Temel | Marka Adı * / Brand Name * | `name` | text | evet | 1–255 ("Brand name is required") | placeholder "örn. Nike, Samsung, Apple" | Slug'ı otomatik doldurur (Türkçe transliterasyon). |
| Temel | Durum / Status | `status` | select | – | `active` | `getByRole('combobox', { name: 'Durum' })` | Aktif / Pasif / Beklemede |
| Temel | URL Slug | `slug` | text | hayır | alandan çıkınca normalize edilir | `getByRole('textbox', { name: 'URL Slug' })` | Altında "Marka sayfası URL: /brands/{slug}". Elle düzenlenince addan takip durur. Boşsa addan üretilir. |
| Temel | Slogan / Tagline | `tagline` | text | hayır | ≤500 | placeholder "Marka mottosu veya sloganı" | |
| Temel | Açıklama / Description | `description` | textarea | hayır | – | placeholder "Bu markayı tanımlayın..." | |
| Temel | Web Sitesi / Website | `website` | text | hayır | kayıtta `https://` eklenir; geçerli URL olmalı | placeholder "https://ornek.com" | "apple.com" yazmak yeterli. |
| Temel | Menşei Ülke / Country of Origin | `countryOfOrigin` | text | hayır | serbest | placeholder "örn. Türkiye, ABD, Almanya" | |
| Temel | Kuruluş Yılı / Founded Year | `foundedYear` | number | hayır | 1800–2100 | placeholder "örn. 1964" | |
| Temel | Sıralama / Sort Order | `sortOrder` | number | hayır | tam sayı, 0 | `getByRole('spinbutton', { name: 'Sıralama' })` | |
| Temel | Öne Çıkan / Featured | `isFeatured` | switch | – | false | `getByRole('switch', { name: 'Öne Çıkan' })` | |
| Medya › Logo | "Kütüphaneden Seç / Choose from Library" (seçiliyse "Değiştir / Replace") | `media.logo` | medya dialog | hayır | | Logo kartındaki `getByRole('button', { name: 'Kütüphaneden Seç' })` (ilk) → dialog "Medya Seç": "Göz At" sekmesinde görsel kartına tıkla → "Seç"; ya da "Yükle" sekmesi → dosya (`input[type=file]`, `browser_file_upload`) → yüklenen otomatik seçilir → "Seç" | "Önerilen: 200x200px, PNG veya SVG". Seçimden sonra "Kaldır / Remove" ve "Alt metin / Alt text" input'u görünür (placeholder "Erişilebilirlik için görseli açıklayın"). |
| Medya › Banner | aynı (2. kart) | `media.banner` | medya dialog | hayır | | Banner kartındaki "Kütüphaneden Seç" | "Önerilen: 1200x300px". |
| SEO | Meta Başlık / Meta Title | `seo.metaTitle` | text (maxLength 70) | hayır | ≤70, sayaç "{n} / 70" | placeholder "ör. Nike — Just Do It" | Üstte arama önizleme kartı. |
| SEO | Meta Açıklama / Meta Description | `seo.metaDescription` | textarea (maxLength 160) | hayır | ≤160 | | |
| SEO | Meta Anahtar Kelimeler / Meta Keywords | `seo.metaKeywords` | text | hayır | virgülle ayrılır | placeholder "koşu ayakkabısı, spor giyim, atletik ürünler" | |
| SEO | URL Anahtarı / URL Key | `seo.urlKey` | text | hayır | – | placeholder "ör. nike" | Vitrindeki marka URL'si için. Boşsa slug kullanılır. |
| SEO | Kanonik URL / Canonical URL | `seo.canonicalUrl` | text | hayır | geçerli URL olmalı | placeholder "https://ornek.com/markalar/nike" | Geçersiz URL kaydı engeller. |
| Çeviri modu (store view seçili) | Marka Adı · Açıklama (Temel); Meta Başlık · Meta Açıklama · Meta Anahtar Kelimeler · URL Anahtarı · Kanonik URL (SEO) | – | text | hayır | aynı limitler | | Diğer alanlar ve Medya "Bu alanlar yalnızca varsayılan görünümde düzenlenebilir." uyarısıyla kilitli. |

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay | Sonuç |
|---|---|---|---|
| Kaydet / Save | form doğrulanır → marka oluşturulur | uygulama sormaz → özet + onay | Başarı toast "İşlem başarıyla tamamlandı" / "Marka başarıyla oluşturuldu" → `/brands`. Doğrulama hatası: kırmızı toast "Bir hata oluştu" + ilk hata (ya da "Kaydetmeden önce vurgulanan alanları düzeltin."), ilk hatalı sekmeye geçer. Sunucu hatası: toast başlığında mesaj (ör. "A brand with a similar name already exists: X", "Brand with slug 'x' already exists"). |
| İptal / Cancel | değişiklik varsa "Kaydedilmemiş değişiklikler" → "Çık / Leave" | | `/brands` |

## Yan etkiler
- Marka 0 ürünle başlar.

## Tuzaklar
- **Enter tuşu formu göndermez** (textarea dışında) — kaydetmek için "Kaydet"e tıkla.
- **Benzer ad çakışması** 409 ile döner; kullanıcıya bildir, farklı ad öner.
- Boş çeviriler gönderilmez; store view seçip hiçbir şey yazmamak sorun değildir.
- Dialogdaki dosya yükleme seçimden önce gerçekleşir (medya kütüphanesine kalıcı yüklenir), marka kaydı iptal edilse de dosya kalır → CLAUDE.md kural 6: yüklemeden önce onay al.

## Doğrulama
- Toast "Marka başarıyla oluşturuldu"; listede ara → `/slug`, durum, öne çıkan, logo küçük resmi; gerekirse edit ekranını aç.
