# Ana sayfa / CMS içerik blokları (component kataloğu)

Ana sayfa (`/design/homepage`) ve CMS sayfaları (`/content/pages/[id]/edit`) **aynı blok düzenleyiciyi** kullanır.
Eklenebilir blok listesi her iki ekranda aynıdır (bağlama göre kısıtlar aşağıda). Her blok sayfanın sıralı blok
listesinde bir kayıttır.

> "component", "bölüm", "section", "blok" aynı şeydir. UI'da "Blok Ekle / Add Block" menüsü ve
> ana sayfada ek olarak "Bölüm Ekle / Add Section" (hazır bölüm = önceden ayarlı blok) vardır.

## Ortak blok zarfı

| Alan | Not |
|---|---|
| Tip (`type`) | Blok türü. **UI'dan 17 tip eklenebilir** (aşağıda) |
| İçerik (`content`) | Tipe göre değişir (bu dosyanın ana konusu) |
| Stil ayarları (`settings`) | Ortak "Stil Ayarları / Style Settings": iç/dış boşluk, arka plan rengi, metin rengi, köşe yuvarlama, maksimum genişlik, özel CSS sınıfı. Carousel ayrıca yüksekliği burada tutar (`settings.height`) |
| Sıra (`order`) | Her ekle/taşı/sil sonrası 0..n-1 olarak yeniden numaralanır. Vitrinde bloklar bu sırayla görünür |
| Görünürlük (`isVisible`) | Göz ikonu ile aç/kapa. Gizli blok vitrinde görünmez, ayarları korunur |

### Ortak "Stil Ayarları / Style Settings" bölümü (çoğu bloğun en altında)

Başlık "Stil Ayarları / Style Settings".

| Label (tr / en) | settings key | Kontrol | Placeholder | Not |
|---|---|---|---|---|
| İç Boşluk / Padding | `padding` | Input (`#padding`) | örn. 16px veya 1rem | CSS değeri, serbest metin |
| Dış Boşluk / Margin | `margin` | Input (`#margin`) | örn. 8px veya 0.5rem | |
| Arka Plan Rengi / Background Color | `backgroundColor` | `input[type=color]` + Input (`#backgroundColor`) | #ffffff | Hero, banner, cta, newsletter bloklarında gizli (bu blokların kendi renk alanları var) |
| Metin Rengi / Text Color | `textColor` | color + Input (`#textColor`) | #000000 | |
| Köşe Yuvarlama / Border Radius | `borderRadius` | Input (`#borderRadius`) | örn. 8px veya 0.5rem | |
| Maksimum Genişlik / Max Width | `maxWidth` | Input (`#maxWidth`) | örn. 800px veya 100% | |
| Özel CSS Sınıfı / Custom CSS Class | `className` | Input (`#className`) | örn. ozel-sinif-adi | Tema yardımcı sınıfları da yazılabilir |

### Ortak kontroller (locator için)

- **Renk alanları:** her zaman bir `input[type=color]` (swatch) + yanında serbest metin `Input` ikilisi. Playwright ile
  renk vermek için **metin input'una** hex yaz (`fill('#ff0000')`); color input'a `fill` de çalışır ama metin input
  daha güvenilir. Bazı renk swatch'larının `aria-label`'ı "Renk sec / Pick color".
- **Görsel alanları (medya seçici alanı):**
  label metni + kesikli kenarlı önizleme kutusu + ikon butonlar:
  - "Gözat / Browse" (boşken) veya "Değiştir / Change" (doluyken) — `aria-label` ile; tıklayınca **Medya Seç**
    dialogu açılır. Boş önizleme kutusuna tıklamak da açar.
  - "URL'yi manuel olarak girin / Enter URL manually" (dış bağlantı ikonu) — tıklayınca altında `Input type=text`
    (placeholder "Görsel seçin... / Select image...") çıkar; URL yazıp blur → değer kaydolur. Geçersiz URL'de
    "Lütfen geçerli bir URL girin…" uyarısı (engellemez).
  - Doluyken önizlemenin sağ üstünde "Görseli kaldır / Remove image" (X).
  - Dialog: sekmeler "Göz At / Browse" ve "Yükle / Upload". Yükleme bitince dialog otomatik Browse sekmesine döner ve
    yüklenen dosyayı **seçili** yapar; yine de alt sağdaki **"Seç / Select"** butonuna basılmalı.
    Ayrıntı: `domain/screens/content/media-library.md` → "Picker".
  - Alan yalnız görselin adresini saklar. Alt metin buradan taşınmaz.
  - Yükleme klasörü: blok editörleri "pages", banner bloğu "banners".
- **Bağlantı alanları (bağlantı seçici):** boşken
  `role="combobox"` buton, metin "Bir bağlantı seçin... / Choose a link..."; masaüstünde açılır panel + komut paleti
  (mobil genişlikte tam ekran dialog). Arama input'u "Ürün, sayfa, kategori ara... / Search products, pages,
  categories...". Gruplar: Ürünler/Products, Kategoriler/Categories, Sayfalar/Pages, Blog, Genel Bağlantılar/Common
  Links (Sepet, Ödeme, Hesap, Kategoriler, Arama, İletişim, Hakkımızda, SSS, Çerez ayarları), Özel Bağlantı/Custom Link
  (input "URL, /yol veya #bölüm girin / Enter a URL, /path or #section" + "Ekle / Add" butonu veya Enter).
  Bağlantı türü (ürün, kategori, sayfa, blog, genel, harici), adresi ve etiketiyle birlikte saklanır.
  `javascript:` vb. şemalar reddedilir; `www.x.com` → `https://www.x.com` harici bağlantı olur. Doluyken
  "Bağlantıyi değiştir / Change link" ve "Bağlantıyi kaldır / Remove link".
- **Konum ızgarası:** 3x3 buton,
  `aria-label="Position X, Y"` (X,Y ∈ {20,50,80}; ör. sol-üst `Position 20, 20`, orta `Position 50, 50`,
  sağ-alt `Position 80, 80`) + "Sıfırla / Reset" butonu. `textPositionX`/`textPositionY` yazar. Vitrinde 20 = sol/üst,
  50 = orta, 80 = sağ/alt hizalama.
- **Select'ler** native `<select>` değil: `button[role=combobox]` + açılan `listbox`/`option`.
- **Switch** `role=switch`, **Checkbox** `role=checkbox`.

## Blok ekleme menüsü ("Blok Ekle / Add Block")

Açılır menü; üstte arama input'u (placeholder "Ara / Search"), altında kategori grupları.
Her öğe: ikon + ad + açıklama (`role=menuitem`). Seçim → blok **varsayılan içerikle** eklenir; ayar paneli
otomatik **açılmaz** (bloğa çift tık ya da dişli ikonu gerekir).

| Kategori (tr / en) | type | Ad (tr / en) | Açıklama (tr) | Kısıt |
|---|---|---|---|---|
| Temel / Basic | `text` | Metin / Text | Biçimlendirmeli zengin metin içerigi | |
| | `image` | Görsel / Image | Altyazıli tekli görsel | |
| | `video` | Video / Video | Video gomme veya yükleme | |
| | `html` | HTML / HTML | Özel HTML kodu | |
| | `button` | Buton / Button | Harekete geçirici buton | |
| Düzenleme / Layout | `columns` | Sütunlar / Columns | Yan yana içerik için çok sütunlu düzen | Yalnız üst seviye (sütun içine konamaz) |
| Gelişmiş / Advanced | `hero` | Hero / Hero | Arka planli hero bölümü | |
| | `banner` | Banner / Banner | Görselli tanitim banneri | |
| | `cta` | Harekete Geçirici / Call to Action | Harekete geçirici bölüm | |
| | `newsletter` | Bulten / Newsletter | E-posta kayıt bölümü | |
| | `countdown` | Geri Sayim / Countdown | Kampanya geri sayim zamanlayicisi | |
| | `form` | Form / Form | Ziyaretçilerin doldurabileceği gömülü bir form | Yalnız sayfa ve blog bağlamında |
| | `cookie-table` | Çerez Tablosu / Cookie Table | Çerez tablosu — platformun çerez listesinden… | ayarsız |
| | `carousel` | Slayt Gösterisi / Carousel | Görsel slayt gösterisi | |
| | `features` | Özellikler / Bölümler / Features / Sections | İstatistik şeridi, logo şeridi, özellik kartları veya güven rozeti listesi | |
| E-Ticaret / Commerce | `products` | Ürünler / Products | Ürün izgarasi veya karuzeli | |
| | `categories` | Kategoriler / Categories | Kategori görüntüleme | |
| | `package-comparison` | Paket Karşılaştırma / Package Comparison | Abonelik paketi karşılaştırma tablosu | Yalnız üst seviye, yalnız sayfa bağlamında |

Galeri, gömülü içerik (embed), müşteri yorumları, akordeon ve ayırıcı blokları admin UI'dan **eklenemez**.
İsteğe "galeri" denirse → `carousel` veya `columns`+`image` öner.

## Doğal dil → blok tipi eşlemesi

| Kullanıcı der ki | Blok |
|---|---|
| "slider", "kayan banner", "manşet slaytı", "ana görsel kaydırmalı" | `carousel` (sayfanın ilk bloğuysa header üstüne biner) |
| "büyük karşılama alanı", "hero", "tek büyük görsel + başlık + buton" | `hero` |
| "kampanya bandı", "promosyon banner'ı", "indirim görseli" | `banner` |
| "çağrı alanı", "harekete geçirici", "renkli kutuda başlık + buton" | `cta` |
| "öne çıkan ürünler", "yeni gelenler", "çok satanlar", "indirimdekiler", "ürün vitrini/karuseli" | `products` (source seç) |
| "şu kategorinin ürünleri" | `products` source=`category` |
| "şu ürünleri göster" | `products` source=`manual` |
| "kategori ızgarası", "kategorilere göre alışveriş" | `categories` |
| "bülten", "e-posta abonelik" | `newsletter` |
| "geri sayım", "kampanya bitişine kalan süre" | `countdown` |
| "istatistik", "rakamlarla biz", "logo şeridi", "güven rozetleri", "neden biz kartları", "kargo/iade vaatleri" | `features` (layout seç) |
| "metin/paragraf", "açıklama yazısı" | `text` |
| "tek görsel" | `image` |
| "YouTube videosu" | `video` |
| "yan yana metin ve görsel" | `columns` (veya hazır bölüm "Metin + Görsel Bolunmus") |
| "iletişim formu" | `form` (önce Content → Forms'ta yayınlanmış form gerekir) |
| "abonelik paketleri karşılaştırma" | `package-comparison` (yalnız sayfa, ana sayfada da `page` bağlamı → eklenebilir) |

> Ana sayfa blok düzenleyicisi sayfa bağlamında açılır → tüm 17 blok eklenebilir.

---

## 1. `text` — Metin / Text

Varsayılan: metin "Metninizi buraya girin...", hizalama `left`.

| Label (tr / en) | content key | Kontrol | Varsayılan | Not |
|---|---|---|---|---|
| Metin İçeriği (HTML desteklenir) / Text Content (HTML supported) | `content` | Textarea | çevrilmiş placeholder metin | HTML yazılabilir (`p`, `strong`, `em`, `a`…). Rich text editörü **yok** |
| Metin Hizalama / Text Alignment | `alignment` | Select: Sol/Left `left`, Orta/Center `center`, Sağ/Right `right`, İki Yana Yasla/Justify `justify` | left | |
| Stil Ayarları | settings | ortak | | |

Vitrinde ortalanmış, okunabilir genişlikte metin bölümü olarak görünür; HTML güvenli hâle getirilerek gösterilir. Veri bağımlılığı yok.

## 2. `image` — Görsel / Image

Varsayılan: görsel, alt metin ve altyazı boş.

| Bölüm | Label (tr / en) | key | Kontrol | Varsayılan | Not |
|---|---|---|---|---|---|
| Görsel | Görsel URL / Image URL | `src` | medya seçici (klasör "pages") | '' | Boşsa vitrinde görünmez |
| | Alternatif Metin / Alt Text | `alt` | Input `#alt` | '' | SEO/erişilebilirlik — doldur |
| | Altyazı (isteğe bağlı) / Caption (optional) | `caption` | Input `#caption` | '' | |
| | En-Boy Oranı / Aspect Ratio | `aspectRatio` | Select: `1:1`,`4:3`,`3:4`,`16:9`,`9:16` | 16:9 | |
| Görsel Üzeri Yazı (isteğe bağlı) / Overlay Text (optional) | Görsel Üzeri Metin / Text on Image | `overlayText` | Textarea | '' | ör. "%50 İNDİRİM" |
| | Konum / Position | `overlayPosition` | Select: Sol Üst `top-left`, Orta Üst `top-center`, Sağ Üst `top-right`, Orta `center`, Sol Alt `bottom-left`, Orta Alt `bottom-center`, Sağ Alt `bottom-right` | center | |
| | Şekil / Shape | `overlayShape` | Select: Rozet `badge`, Kurdele `ribbon` | badge | Ribbon daima sol üst |
| | Yazı Tipi / Font Family | `overlayFontFamily` | Select: Varsayılan (Tema) `inherit`, Arial, Georgia, Times New Roman, Courier New, Verdana, Trebuchet MS, Impact | inherit | |
| | Yazı Boyutu / Font Size | `overlayFontSize` | Select 12…64 (px) | 16 | |
| | Yazı Rengi / Text Color | `overlayColor` | color + input | #ffffff | |
| | Stil / Style | `overlayBold`, `overlayItalic` | toggle butonlar `aria-label` "Kalın/Bold", "Yatık/Italic" | kapalı | |
| | Arka Plan / Background | `overlayBgColor` | color + input + "Yok/None" butonu | rgba(0,0,0,0.5) | rgba kabul eder |
| Bağlantı (isteğe bağlı) / Link (optional) | Bağlantı URL / Link URL | `linkUrl` | bağlantı seçici | — | |
| | Bağlantıyi yeni sekmede ac / Open link in new tab | `openInNewTab` | Checkbox | kapalı | |

Görsel önerisi: oranı seçilen en-boy oranına uygun, en az 1200px genişlik (öneri; zorunlu değil).

## 3. `video` — Video

Varsayılan: embed URL ve başlık boş; kontroller açık, otomatik oynatma/tekrar/sessiz kapalı.

| Label (tr / en) | key | Kontrol | Not |
|---|---|---|---|
| Embed URL (YouTube, Vimeo) | `embedUrl` | Input `#embedUrl` | youtube.com/watch?v=… veya vimeo.com/… — vitrinde gömülü oynatıcıya çevrilir |
| — "Veya / Or" ayırıcı — | | | |
| Kendi Sunucunuzdaki Video URL'si / Self-hosted Video URL | `src` | Input `#src` | .mp4 URL'si (Medya'ya mp4 yüklenebilir, URL'sini buraya yapıştır) |
| Kapak Görseli / Poster/Thumbnail | `poster` | medya seçici | |
| Video Başlığı / Video Title | `title` | Input `#title` | erişilebilirlik |
| Oynatma Seçenekleri: Kontrolleri göster / Show controls, Otomatik Oynat / Autoplay, Tekrarla / Loop, Sessiz / Muted | `controls`,`autoplay`,`loop`,`muted` | Checkbox x4 | Autoplay tarayıcıda genelde `muted` ister |

Embed URL veya kendi video URL'sinden biri gerekli (yoksa blok vitrinde boş kalır).

## 4. `html` — HTML

Sarı uyarı kutusu "Dikkatli kullanın / Use with caution".
Alan: "Özel HTML / Custom HTML" → `html` (Textarea, monospace) + "Canlı Önizleme / Live Preview".
Vitrinde HTML güvenli hâle getirilerek gösterilir (script/iframe gibi içerikler büyük olasılıkla temizlenir —
doğrulanmadı). Kullanıcı açıkça istemedikçe tercih etme.

## 5. `button` — Buton / Button

Varsayılan: metin "Tikla", link `#`, varyant `primary`, boyut `md`, hizalama `left`, renkler boş, köşe `md`, tam genişlik kapalı.

| Bölüm | Label (tr / en) | key | Kontrol | Seçenekler |
|---|---|---|---|---|
| Buton | Buton Metni / Button Text | `buttonText` | Input | |
| | Bağlantı URL / Link URL | `buttonLink` | bağlantı seçici | |
| | Bağlantıyi yeni sekmede ac | `openInNewTab` | Checkbox | |
| Buton Stili / Button Style | Varyant / Variant | `variant` | Select | Birincil `primary`, Ikincil `secondary`, Dis Hat `outline`, Şeffaf `ghost` |
| | Boyut / Size | `size` | Select | Küçük `sm`, Orta `md`, Büyük `lg` |
| | Metin Hizalama / Text Alignment | `alignment` | Select | Sol/Orta/Sag |
| | Arka Plan Rengi / Background Color | `backgroundColor` | color+input | boş = varyant rengi |
| | Yazı Rengi / Text Color | `textColor` | color+input | |
| | Köşe Yuvarlaklığı / Border Radius | `borderRadius` | Select | Yok `none`, Küçük `sm`, Orta `md`, Büyük `lg`, Tam (Hap) `full` |
| | Tam Genişlik / Full Width | `fullWidth` | Switch | |

## 6. `columns` — Sütunlar / Columns

Varsayılan: düzen `50-50`, iki boş sütun.

| Bölüm | Label | key | Kontrol | Not |
|---|---|---|---|---|
| Düzen / Layout | (görsel düzen kartları) | `layout` | buton grubu: `50 / 50`, `33 / 67`, `67 / 33`, `33 / 33 / 33`, `25 / 50 / 25`, `25 / 25 / 25 / 25` | Sütun sayısı azalırsa artan sütunların blokları son sütuna taşınır |
| Sütun İçerikleri / Column Contents | Sütun {n} / Column {n} | `columns[i].blocks` | her sütunda "Blok Ekle / Add Block" dropdown (yalnız üst seviye bloklar hariç: `columns`, `package-comparison`) | İç blok aksiyonları aria-label: "Sütun {column} içindeki {blockName} bloğunun ayarlarını düzenle", "...yukarı taşı", "...aşağı taşı", "...sil" (onaylı) |

İç blok düzenleme aynı ayar panelini açar. Vitrinde sütunlar yan yana, mobilde alt alta görünür (doğrulanmadı).

## 7. `hero` — Hero

Boş renk alanlarında marka renkleri kullanılır.
Varsayılan: başlık "Hos Geldiniz", alt başlık "Alt başlığınızı buraya yazın", görsel ve arka plan rengi boş, buton
"Daha Fazla" → `#`, hizalama `center`, kaplama opaklığı 50, yükseklik `medium`, metin rengi boş.

| Bölüm | Label (tr / en) | key | Kontrol | Varsayılan (editör gösterimi) | Not |
|---|---|---|---|---|---|
| İçerik / Content | Başlık / Title | `title` | Input `#title` (placeholder "Hero Başlığı") | | |
| | Alt Başlık / Subtitle | `subtitle` | Textarea `#subtitle` | | |
| | Metin Konumu / Text Position | `textPositionX`,`textPositionY` | konum ızgarası + "Sıfırla/Reset" | yok → hizalama | |
| Eylem Çağrısı / Call to Action | Birincil Buton Metni / Primary Button Text | `ctaText` | Input `#ctaText` | | Buton yalnız metin **ve** link doluysa görünür |
| | Birincil Buton Bağlantısı / Primary Button Link | `ctaLink` | bağlantı seçici `#ctaLink` | '#' | |
| | İkincil Buton Metni / Secondary Button Text | `secondaryCtaText` | Input | | |
| | İkincil Buton Bağlantısı / Secondary Button Link | `secondaryCtaLink` | bağlantı seçici | | |
| | Buton Arka Planı / Button Background | `buttonBackgroundColor` | color `#hero-buttonBgColorPicker` + input `#hero-buttonBgColor` | boş = marka ana rengi | ipucu "Özel bir renk seçene kadar marka renginiz kullanılıyor" |
| | Buton Yazı Rengi / Button Text Color | `buttonTextColor` | color + input `#hero-buttonTextColor` | boş = beyaz/marka | |
| Arka Plan / Background | Arka Plan Görsel URL / Background Image URL | `backgroundImage` | medya seçici (klasör "pages") | '' | Önerilen: yatay, ≥1920x800 (öneri) |
| | Arka Plan Rengi (yedek) / Background Color (fallback) | `backgroundColor` | color `#bgColorPicker` + input `#backgroundColor` | #1a1a2e gösterilir; boş bırakılırsa marka ana rengi | |
| | Kaplama Opaklığı: {value}% / Overlay Opacity | `overlayOpacity` | Slider 0-100 adım 5 (`role=slider`, ok tuşlarıyla 5'er) | 50 | Görsel üstü karartma |
| | Görsel Sığdırma / Image Fit | `backgroundSize` | Select: Kapla `cover`, Sığdır `contain`, Orijinal Boyut `auto` | cover | |
| Görünüm / Appearance | Yükseklik / Height | `height` | Select: Otomatik `auto`, Küçük `small`, Orta `medium`, Büyük `large`, Tam Ekran `full` | medium | |
| | Metin Rengi / Text Color | `textColor` | color `#textColorPicker` + input `#textColor` | #ffffff | |
| Stil Ayarları | (renk alanları gizli) | settings | | | |

Vitrinde tam genişlik bölüm: arka plan görseli + opaklıklı karartma, başlık/alt başlık/2 buton; metin konum ızgarasına göre hizalanır.
Veri bağımlılığı: arka plan görseli (medya), link hedefleri (ürün/kategori/sayfa var olmalı).

## 8. `banner` — Banner

Varsayılan: başlık "Özel Teklif", alt başlık "Sınırli süre", görsel boş, buton "Alışverişe Başla" → `#`, arka plan rengi boş.

| Bölüm | Label (tr / en) | key | Kontrol | Varsayılan | Not |
|---|---|---|---|---|---|
| İçerik | Başlık / Title | `title` | Input `#banner-title` | | |
| | Alt Başlık / Subtitle | `subtitle` | Input/Textarea `#banner-subtitle` | | |
| | Metin Konumu / Text Position | `textPositionX/Y` | konum ızgarası | | |
| | Görsel URL / Image URL | `image` | medya seçici (klasör **"banners"**) | '' | |
| | Görsel Sığdırma / Image Fit | `backgroundSize` | Select cover/contain/auto (`#banner-backgroundSize`) | cover | |
| Buton / Button | Buton Metni / Button Text | `buttonText` | Input `#banner-buttonText` | | |
| | Buton Bağlantısı / Button Link | `buttonLink` | bağlantı seçici `#banner-buttonLink` | '#' | |
| | Buton Arka Planı / Button Background | `buttonBackgroundColor` | color+input `#banner-buttonBgColor` | boş = marka ana rengi | |
| | Buton Yazı Rengi / Button Text Color | `buttonTextColor` | color+input `#banner-buttonTextColor` | boş = beyaz | |
| Renkler / Colors | Arka Plan Rengi / Background Color | `backgroundColor` | color+input `#banner-backgroundColor` | editörde #f0f4ff; boş bırakılırsa marka ana rengi | |
| | Yazı Rengi / Text Color | `textColor` | color+input `#banner-textColor` (placeholder "Görsele göre otomatik") | '' | |

Vitrinde arka plan rengi boşsa marka ana rengi kullanılır; görsel arka plan, başlık, buton (yalnız metin ve link doluysa).

## 9. `cta` — Harekete Geçirici / Call to Action

Varsayılan: başlık "Başlamaya hazır misiniz?", açıklama "Binlerce mutlu müşteriye katilin", buton "Hemen Başla" → `#`, arka plan rengi boş.

| Bölüm | Label (tr / en) | key | Kontrol | Not |
|---|---|---|---|---|
| İçerik | Başlık / Title | `title` | Input `#cta-title` | |
| | Açıklama / Description | `description` | Textarea `#cta-description` | |
| | Metin Konumu | `textPositionX/Y` | konum ızgarası ("Ortaya sıfırla / Reset to center") | |
| Buton | Buton Metni | `buttonText` | Input `#cta-buttonText` | |
| | Buton Bağlantısi / Button Link | `buttonLink` | bağlantı seçici `#cta-buttonLink` | |
| Renkler | Arka Plan Rengi | `backgroundColor` | color+input `#cta-backgroundColor` (editör #1a1a2e) | |
| | Yazı Rengi | `textColor` | color+input `#cta-textColor` (#ffffff) | |
| | Buton Arka Planı | `buttonBackgroundColor` | `#cta-buttonBgColor` (Varsayılan: beyaz) | vitrinde boşsa marka ana rengi |
| | Buton Yazı Rengi | `buttonTextColor` | `#cta-buttonTextColor` | |

Vitrinde ortalanmış bölüm: başlık, açıklama, buton.

## 10. `newsletter` — Bulten / Newsletter

Varsayılan: başlık "Güncel Kalin", açıklama "En son fırsatları ve haberleri alin", yer tutucu "E-posta adresiniz", buton "Abone Ol", arka plan rengi boş.

| Bölüm | Label | key | Kontrol |
|---|---|---|---|
| İçerik | Başlık / Title; Açıklama / Description | `title`, `description` | Input `#newsletter-title`, Textarea `#newsletter-description` |
| Form | E-posta Yer Tutucusu / Email Placeholder; Buton Metni / Button Text | `placeholder`, `buttonText` | Input `#newsletter-placeholder`, `#newsletter-buttonText` |
| Renkler | Arka Plan Rengi; Yazı Rengi; Buton Arka Planı; Buton Yazı Rengi | `backgroundColor`, `textColor`, `buttonBackgroundColor`, `buttonTextColor` | color+input (`#newsletter-…`) |

Ana sayfada bülten abonelik bölümü olarak görünür. Veri bağımlılığı yok.

## 11. `countdown` — Geri Sayim / Countdown

Varsayılan: başlık "Kampanya Bitiş Süresi", hedef tarih eklendiği andan 7 gün sonrası, tüm birimler açık.

| Label (tr / en) | key | Kontrol | Not |
|---|---|---|---|
| Başlık / Title | `title` | Input `#countdown-title` | |
| Hedef Tarih / Target Date | `targetDate` | `input[type=datetime-local]` `#countdown-targetDate` | **Mağaza saat diliminde** yorumlanır. Playwright: `fill` ile `YYYY-MM-DDTHH:mm` biçiminde değer ver. Altında saat dilimi notu görünür |
| Gunleri/Saatleri/Dakikaları/Saniyeleri Göster | `showDays`,`showHours`,`showMinutes`,`showSeconds` | Switch x4 | |

Vitrinde geri sayım sayacı. Geçmiş tarih → sıfırda kalır (doğrulanmadı).

## 12. `carousel` — Slayt Gösterisi / Carousel (slider)

Varsayılan: 3 slayt (başlık "Slayt N", görsel boş, link `#`), otomatik oynatma, göstergeler ve oklar açık.

Slayt başına (kart "Slayt {n} / Slide {n}", sağda çöp kutusu `aria-label` "Slaytı kaldır / Remove slide"):

| Label (tr / en) | slide key | Kontrol | Not |
|---|---|---|---|
| Başlık / Title | `title` | Input `#carousel-slide-{i}-title` | |
| Alt Başlık / Subtitle | `subtitle` | Input `#carousel-slide-{i}-subtitle` | |
| Slayt Görseli / Slide Image | `image` | medya seçici (klasör "pages") | **Zorunlu pratikte**: görselsiz slayt boş görünür. Önerilen yatay ≥1920x900 (öneri) |
| Mobil Görsel / Mobile Image | `mobileImage` | medya seçici | Mobilde bu görsel kullanılır (dikey önerilir); boşsa masaüstü görseli |
| Görsel Alternatif Metni / Image Alt Text | `imageAlt` | Input `#carousel-slide-{i}-imageAlt` | Başlık yoksa doldur |
| Buton Metni / Button Text | `buttonText` | Input | |
| Bağlantı / Link | `link` | bağlantı seçici | |
| İkincil Buton Metni / Secondary Button Text | `secondaryButtonText` | Input | |
| İkincil Buton Bağlantısı / Secondary Button Link | `secondaryButtonLink` | bağlantı seçici | |
| (Slayt Görünümü / Slide Presentation) Slayt Metin Rengi / Slide Text Color | `textColor` | color+input `#carousel-slide-{i}-textColor` | #ffffff |
| Metin Konumu / Text Position | `textPosition` | Select: Sol `left`, Orta `center`, Sağ `right` | left |
| Karartma Yoğunluğu / Overlay Opacity | `overlayOpacity` | `input[type=number]` 0-100 | |

Blok düzeyi:

| Bölüm | Label | key | Kontrol | Varsayılan |
|---|---|---|---|---|
| Slaytlar | "Slayt Ekle / Add Slide" butonu | `slides[]` | buton | yeni slayt başlığı "Slayt {n}", link `#` |
| Oynatma Seçenekleri / Playback Options | Otomatik oynat / Auto-play | `autoplay` | Switch `#carousel-autoPlay` | açık |
| | Göstergeleri Göster / Show Indicators | `showDots` | Switch | açık |
| | Okları Göster / Show Arrows | `showArrows` | Switch | açık |
| Yerleşim / Layout | Yükseklik / Height | **`settings.height`** | Select auto/small/medium/large/full | **full** (editör varsayılanı) |

Slaytların sırası UI'dan değiştirilemez (sürükle yok) — sıralama için sil/yeniden ekle. Slaytlar arası geçiş süresi
bu ekranda ayarlanamaz.

Vitrin: **Sayfanın ilk görünür bloğu carousel ise** header carousel'in üstüne bindirilir (şeffaf header) ve carousel
sayfanın ana manşeti olarak gösterilir. Slayt yoksa blok vitrinde hiç görünmez.

## 13. `features` — Özellikler / Bölümler (stats / logos / cards / list)

Varsayılan: yerleşim `stats`, başlık "Neden bizden alışveriş etmelisiniz", hizalama orta, 4 sütun,
4 istatistik öğesi (10+ Hizmet Verilen Ülke, 500+ Ürün, 99% Memnuniyet, 24/7 Destek).

| Bölüm | Label (tr / en) | key | Kontrol | Kısıt |
|---|---|---|---|---|
| Yerleşim / Layout | Yerleşim | `layout` | Select `#features-layout`: İstatistik şeridi `stats`, Logo şeridi `logos`, Özellik kartları `cards`, Güven rozeti listesi `list` | |
| Bölüm Başlığı / Section Header | Üst Başlık / Eyebrow | `eyebrow` | Input `#features-eyebrow` | ≤60 |
| | Başlık / Title | `title` | Input | ≤120 |
| | Alt Başlık / Subtitle | `subtitle` | Input | ≤256 |
| | Dipnot / Footnote | `footnote` | Input | ≤256 |
| | Hizalama / Alignment | `align` | Select: Sol `start`, Orta `center` | |
| | Sütunlar / Columns | `columns` | `input[type=number]` 2-6 | |
| | Arka Plan Rengi / Yazı Rengi | `backgroundColor`,`textColor` | color+input | |
| Öğeler / Items | "Öğe Ekle / Add Item" | `items[]` | buton | ≤24 öğe ("En fazla {max} öğe…") |

Öğe alanları yerleşime göre görünür:

| Alan (tr / en) | key | stats | logos | cards | list | Kısıt |
|---|---|---|---|---|---|---|
| Değer / Value | `value` | ✓ | | | | ≤40 (ör. "10+") |
| Simge / Icon | `icon` | | | ✓ | ✓ | Select: bar-chart-2, bell, check, gift, globe, headphones, info, layout, refresh-cw, return, shield, shield-check, star, tag, trending-up, truck, undo, users, zap (tr etiketleri: Çubuk Grafik, Zil, Onay, Hediye, Küre, Kulaklık, Bilgi, Yerleşim, Yenile, İade, Kalkan, Onaylı Kalkan, Yıldız, Etiket, Yükselen Trend, Kamyon, Geri Al, Kullanıcılar, Şimşek) |
| Görsel / Logo Görseli | `image` | | ✓ | ✓ | ✓ | medya seçici |
| Başlık / Logo Adı (alternatif metin) | `title` | ✓ | ✓ (alt) | ✓ | ✓ | ≤120 |
| Açıklama / Description | `description` | | | ✓ | ✓ | ≤512 |
| Rozet / Badge + Rozet Stili | `badge`, `badgeVariant` (Dolu `default`/Soluk `secondary`/Dış Hat `outline`) | | | ✓ | | ≤40 |
| Bağlantı / Link | `link` | | ✓ | ✓ | ✓ | bağlantı seçici |

Uzunluk sınırları kayıtta zorlanır → hata toast'ı "Bir özellikler bloğunda kabul edilmeyen bir ayar var…".

## 14. `products` — Ürünler / Products (ürün ızgarası / karuseli)

Varsayılan: başlık "Öne Çıkan Ürünler" (gösteriliyor), kaynak `featured`, 4 ürün, ızgara, 4 sütun, fiyat ve sepete ekle açık.

| Bölüm | Label (tr / en) | key | Kontrol | Seçenekler / varsayılan | Not |
|---|---|---|---|---|---|
| Başlık / Header | Bölüm başlığını göster / Show section title | `showTitle` | Checkbox | açık | Kapalıyken başlık alanları gizlenir |
| | Bölüm Başlığı / Section Title | `title` | Input `#title` | | |
| | Bölüm Alt Başlığı / Section Subtitle | `subtitle` | Input `#subtitle` | | |
| | Tümünü Gör Metni / View All Label | `viewAllText` | Input `#viewAllText` | | Link de doluysa görünür |
| | Tümünü Gör Bağlantısı / View All Link | `viewAllLink` | bağlantı seçici `#viewAllLink` | | |
| Ürün Kaynağı / Product Source | Kaynak Türü / Source Type | `source` | Select `#source` | Öne Çıkan Ürünler `featured` · Yeni Gelenler `new` · Çok Satanlar `bestsellers` · İndirimde `sale` · Kategoriden `category` · Manuel Seçim `manual` | |
| | Kategori / Category (source=category) | `categoryId` | Kategori arama combobox — **tek kategori** seçilir | | "Ürünler bu kategoriden getirilir" |
| | Ürünler / Products (source=manual) | `productIds[]` | Ürün çoklu seçici: `role=combobox` "Ürün seçin / Select products" → açılır panel + arama "Ada veya stok koduna göre arayın / Search by name or SKU" (yazdıktan sonra sonuçları bekle, en çok 12 sonuç) → sonuca tıkla; seçilenler rozet olarak görünür, X `aria-label` "{name} kaldır" | | Seçim sırası = gösterim sırası |
| | Maksimum Ürün / Maximum Products | `limit` | Select `#limit`: 2,3,4,6,8,12 ("{n} ürün") | 4 | |
| Görünüm Seçenekleri / Display Options | Görünüm Modu / Display Mode | `displayMode` | Select: Izgara `grid`, Slayt `carousel` | grid | |
| | Sütunlar / Columns | `columns` | Select 2-6 ("{n} sütun") | 4 | |
| | Ürün fiyatını göster / Show product price | `showPrice` | Checkbox | açık | |
| | Sepete ekle butonunu göster / Show add to cart button | `showAddToCart` | Checkbox | açık | |
| | Öne Çıkanlar sekmesini göster / Show Featured tab (yalnız source=featured) | `showFeaturedTab` | Checkbox | açık | |

**Hangi ürünler gelir:** Manuel seçimde seçilen ürünler; aksi halde kaynağa göre öne çıkan / yeni / çok satan /
indirimli ürünler veya seçilen kategorinin ürünleri. Kaynak, adet veya seçim değişikliği ve ürün verisi değişikliği
(öne çıkan işareti, fiyat, stok) vitrine **en geç ~5 dk** içinde yansır.

**Vitrin:**
- Ana sayfadaki **ilk görünür `products` bloğu** ve kaynak `featured` ise → sekmeli özel bölüm olarak görünür
  (Öne Çıkanlar / Yeni Gelenler / Çok Satanlar sekmeleri; yalnız stoktaki ürünler, değişiklikler anında yansır).
- Diğer tüm `products` blokları: başlık + "tümünü gör", ızgara veya slayt; ürün kartları.
- **Gösterilecek ürün yoksa blok vitrinde hiç görünmez** — ör. öne çıkan işaretli ürün yoksa, kategori boşsa,
  seçilen ürünler pasifse sessizce kaybolur.

**Veri bağımlılıkları** (ürün ekranları: `../screens/products/product-list.md`, `product-edit.md` — "Öne Çıkan Ürün" checkbox'ı): featured → ürünlerde "öne çıkan" işareti; sale → özel fiyatlı ürün; new/bestsellers → aktif
ürün/sipariş geçmişi; category → kategoride aktif ürün; manual → ürünler aktif ve stokta/yayında olmalı (doğrulanmadı: pasif ürün filtrelenir mi).

## 15. `categories` — Kategoriler / Categories

Varsayılan: başlık "Kategoriye Gore Alışveriş", kaynak `root`, 6 kategori, ızgara, 3 sütun, görseller açık, açıklamalar kapalı.

| Bölüm | Label (tr / en) | key | Kontrol | Seçenekler |
|---|---|---|---|---|
| Başlık / Header | Bölüm Başlığı / Section Title | `title` | Input `#title` | |
| Kategori Kaynağı / Category Source | Kaynak Türü / Source Type | `source` | Select | Ana Kategoriler `root` · Öne Çıkan Kategoriler `featured` · Manuel Seçim `manual` |
| | Kategoriler / Categories (manual) | `categoryIds[]` | Kategori çoklu seçici combobox "Kategori seçin..." / arama "Kategori ara..." | çoklu, sıralı |
| | Maksimum Kategori / Maximum Categories | `limit` | Select 3,4,6,8,12 | 6 |
| Görünüm Seçenekleri | Görünüm Modu / Display Mode | `displayMode` | Select | Izgara `grid` · Liste `list` · Slayt `carousel` |
| | Sütunlar / Columns | `columns` | Select 2-6 | 3 |
| | Kategori görsellerini göster / Show category images | `showImages` | Checkbox | açık |
| | Kategori açıklamalarını göster / Show category descriptions | `showDescription` | Checkbox | kapalı |

Yalnız **aktif** kategoriler gösterilir; "Ana Kategoriler" = kök kategoriler. Vitrinde kartlar `/products/{urlKey}`'e
gider; gösterilecek kategori yoksa blok görünmez. **Kategori görseli yoksa** kart görselsiz/yer tutuculu görünür →
`showImages` açıksa kategorilerde görsel olmalı (kategori ekranından yüklenir: `../screens/categories/category-edit.md`, kategori kuralları `category.md`).

## 16. `form` — Form

Varsayılan: form seçili değil, başlık boş, genişlik dar, hizalama orta, kart olarak göster açık.

| Label (tr / en) | key | Kontrol | Not |
|---|---|---|---|
| Form | `formSlug` | Select (yalnız **yayınlanmış** formlar) placeholder "Yayınlanmış bir form seçin" | Hiç yoksa "Henüz yayınlanmış form yok. Içerik → Formlar…" |
| Başlık (opsiyonel) / Heading (optional) | `headingOverride` | Input | ≤255 |
| Genişlik / Width | `width` | Select Dar `narrow` / Orta `medium` / Tam genişlik `full` | |
| Hizalama / Alignment | `alignment` | Select Sol `left` / Orta `center` | full'da etkisiz |
| Kart olarak göster / Show as a card | `showCard` | Switch | |

Bağımlılık: `/content/forms`'ta yayınlanmış form. Seçili form bulunamazsa blok vitrinde görünmez.

## 17. `cookie-table` — Çerez Tablosu / Cookie Table

Ayar yok ("Bu blokta ayar yoktur…"); içerik boş kalmalıdır. Çerez politikası sayfasında zorunlu tutulur ve
silinemez. Ana sayfada anlamsız — kullanma.

## 18. `package-comparison` — Paket Karşılaştırma / Package Comparison

Yalnız üst seviye (Sütunlar içine konamaz), sayfa bağlamında.
Varsayılan: buton "Paketi Seç", tüm tabloyu göster açık, aynı satırları birleştir kapalı.

| Bölüm | Label (tr / en) | key | Kontrol | Kısıt |
|---|---|---|---|---|
| Üst Bölüm / Header | Başlık / Title; Alt Başlık / Subtitle | `title`, `subtitle` | Input | ≤120 / ≤256 |
| Paketler / Packages | Kaynak / Source | `source.kind` | Select: Bir kategori `category` / Belirli ürünler `products` | **Seçim zorunlu** (yoksa kayıtta "Bir paket karşılaştırma bloğunda seçili paket yok…") |
| | Kategori | `source.categoryId` | kategori seçici | |
| | Ürünler (en fazla 4) | `source.productIds[]` | ürün çoklu seçici | 1-4, tekrarsız |
| | Görüntülenme Sırası / Display Order | — | sürükle-bırak liste (handle `aria-label` "{n}. sıradaki paketi taşı") | |
| | Önerilen Paket / Recommended Plan | `recommendedProductId` | Select ("Öneri yok") | seçilenlerden biri |
| Harekete Geçirici | Buton Metni; Buton Bağlantısı | `buttonText`, `buttonLink` | Input, bağlantı seçici | ≤40 |
| | Kart butonlarının gittiği yer | `cardLinkTarget` | RadioGroup: Blok butonu `block` / Kendi ürün sayfası `product` | |
| | Fiyat Notu / Price Note | `priceNote` | Input | ≤80 |
| Tablo Görünümü | Tüm karşılaştırma tablosunu göster; Aynı satırları birleştir | `showFullTable`, `collapseIdenticalRows` | Checkbox | satırlar "mağazada görünür"+"karşılaştırılabilir" attribute'lardan |
| Alt Bilgi / Footer | Başlık, Metin, Buton Metni, Buton Bağlantısı | `footer.{title,text,buttonText,buttonLink}` | Input/Textarea/bağlantı seçici | metin ≤512 |

Ana sayfa için tipik değil.

---

## Hazır bölümler (ana sayfa "Bölüm Ekle / Add Section" ve "Şablonlar ve Bölümler" sekmesi)

Seçilen preset blokları **listenin sonuna** eklenir, toast "Bölüm ana sayfaniza eklendi.".

| Preset | Ad (tr / en) | Kategori | Üretilen blok(lar) |
|---|---|---|---|
| hero-section | Hero Bölümü / Hero Section | Önerilen | `hero` (overlay 50, center, ctaText "Alışverişe Başla", height `large`) |
| featured-products | Öne Çıkan Ürünler / Featured Products | Önerilen | `products` source featured, grid, 4 sütun, limit 8 |
| shop-by-category | Kategoriye Gore Alışveriş / Shop by Category | Önerilen | `categories` source root, grid, 3 sütun, limit 6 |
| promo-banner | Promosyon Banneri / Promotional Banner | Pazarlama | `banner` (varsayılan) |
| call-to-action | Eylem Cagrisi / Call to Action | Pazarlama | `cta` |
| newsletter-signup | Bulten Kaydi / Newsletter Signup | Pazarlama | `newsletter` |
| sale-countdown | İndirim Geri Sayimi / Sale Countdown | Pazarlama | `countdown` |
| image-carousel | Görsel Karuseli / Image Carousel | İçerik | `carousel` (3 boş slayt) |
| text-image-split | Metin + Görsel Bolunmus / Text + Image Split | İçerik | `columns` (2 sütun: `text` + `image`) |
| blank-section | Boş Bölüm / Blank Section | İçerik | boş `text` |

## Sayfa şablonları (ana sayfa, tüm blokları DEĞİŞTİRİR)

Klasik E-Ticaret (hero, products, categories, newsletter) · Kategori Odakli
(categories, products, cta) · Kampanya / İndirim (hero "Büyük İndirim!", banner, countdown, products, cta) ·
Minimal (hero large, products) · Boş Sayfa. Uygulanınca marka renkleri boş renk alanlarına doldurulur.
Mevcut blok varsa onay dialogu "Mevcut tasarımı değiştir?" → "Değiştir / Replace" (geri alınamaz uyarısı).

## Çeviri / store view

Ana sayfa ve sayfalar dil başına **ayrı blok listesi** tutabilir. Varsayılan dil dışındaki bir görünüm seçilince
birincil bloklar kopyalanır ve o dil için bağımsız düzenlenir. Vitrin, o dilin **yayınlanmış** çevirisi varsa onun
bloklarını, yoksa birincil blokları gösterir. Yani birincil dile eklenen blok, daha önce kendi blokları olan bir
çeviride **otomatik görünmez** — "Senkronize et... / Sync from..." gerekir.

## Cihaz (mobil/masaüstü) varyantları

Bloklarda cihaz bazlı görünürlük alanı **yok**. Tek cihaza özel alan: carousel slaytında `mobileImage`. Editördeki
Masaüstü/Tablet/Mobil butonları yalnız editör tuvalinin genişliğini değiştirir (önizleme), veri yazmaz.
