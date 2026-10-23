# Marka Ayarları (Branding)
- URL: {ADMIN_URL}/branding
- Amaç: Mağazanın marka kimliği (ad, slogan, logo, favicon), renk paleti, tipografi (yerleşik + yüklenmiş özel fontlar), "Görünüm ve His" (köşe yarıçapı, yoğunluk, sayfa genişliği), ürün kartı rozetleri ve kısa açıklama gösterimini yönetmek. Vitrinin tüm renkleri, yazı tipleri ve köşe yuvarlaklıkları buradan gelir.
- Yetki (permission):
  - Sidebar linki: `content:read` ("Mağaza Tasarımı / Store Design" grubunda).
  - Okuma `products:read`; kaydet/yayınla ve font yükleme/silme için **`products:write`**.
  - "Stili Değiştir" butonu: `settings:update`.
  - Özel fontlar plan özelliği: `custom_fonts`. AI sihirbazı butonu plan özelliği: `ai_branding_wizard`.
- Veri akışı (işlevsel):
  | Amaç | Etki |
  |---|---|
  | Yükle | Marka kayıtlarını ve preset listesini getirir; aktif (yoksa ilk) kaydı forma açar |
  | Preset detay | Seçilen preset'in değerlerini getirir (kaydetmez) |
  | Yeni oluştur / Güncelle | Formun tamamını kaydeder |
  | Yayınla | Kaydı vitrine yayınlar |
  | Font listesi / yükle / sil | Tenant'a özel yazı tipleri |
- Kaydedilen bölümler: `name`, `identity` (marka adı, slogan en/tr, logo, favicon, apple touch icon), `typography` (başlık/gövde yazı tipi), `colors` (24 renk), `spacing`, `shapes` (köşe yarıçapları), `layout` (maks genişlik, kenar çubuğu genişliği), `tone`, `productBadges` (hot / bestSeller / newArrival), `showProductCardShortDescription`. Formun tamamı her kayıtta gönderilir.

## Ön koşullar ve bağımlılıklar
- Yayınlamak için **ana logo URL'si zorunlu**. Logo yoksa önce Medya kütüphanesine (bkz. [../content/media-library.md](../content/media-library.md)) yüklenmeli ya da medya seçici alanının dialog'undan yüklenmeli (yükleme açık, klasör `logos`).
- "Yapılandırma Adı" ve "Marka Adı" dolu olmalı.
- Özel font kullanmak için plan `custom_fonts` içermeli ve font önce "Yazı tiplerim" panelinden yüklenmeli.
- Tenant başına birden fazla marka kaydı olabilir; vitrin varsayılan + aktif + yayında olanı, yoksa ilk aktif + yayında olanı kullanır.

## Yerleşim
Sayfanın 3 durumu vardır:
1. **Yükleniyor**: iskelet görünüm.
2. **Hiç marka yok**: Başlık "Markanızı Oluşturun / Set Up Your Brand". Üstte (plan izin verirse) AI kartı + "Yapay Zeka Marka Kurulumu / AI Brand Setup" butonu → `/branding/ai-wizard`. Altında preset kartları (5 preset: luxury, minimal, playful, professional, bold); her kartta "Bu Şablonu Kullan / Use This Preset" butonu. Son kart "Sıfırdan Başla / Start from Scratch" + "Özel Oluştur / Create Custom" butonu. Butona basınca form dolar, sayfa 3. duruma geçer (henüz kaydetmez).
3. **Düzenleme**:
   - Sayfa başlığı "Marka Ayarları / Brand Settings"; açıklama, aktif kayıt taslaksa sonuna " — Taslak / Draft" eklenir. Sağda butonlar: [AI Brand Setup (outline, plan özelliğine bağlı)] [Yenile / Refresh] [Stili Değiştir / Change Style (`settings:update`)].
   - Accordion (6 bölümün hepsi varsayılan AÇIK), sırasıyla:
     1. "Kimlik / Identity" (value=`identity`)
     2. "Renkler / Colors" (value=`colors`) — solda renk seçiciler, sağda sabit "Renk Önizleme / Color Preview"
     3. "Tipografi / Typography" (value=`typography`)
     4. "Görünüm ve His / Look & Feel" (value=`style`)
     5. "Ürün Rozetleri / Product Badges" (value=`productBadges`)
     6. "Görünüm / Appearance" (value=`preview`) — salt okunur canlı önizleme
   - Altta sabit durum çubuğu: solda durum metni (TR arayüzde de İngilizce: "Published" / "Saving..." / "Draft saved" / "Could not save — …"), sağda "Taslağı Kaydet / Save Draft" (outline) ve "Mağazaya Yayınla / Publish to Store".
- Sayfada **marka listesi / marka değiştirici / silme / etkinleştirme yoktur**: her zaman aktif (yoksa ilk) kayıt açılır.

## Alanlar
Ortak kontroller:
- **Renk seçici**: `role="combobox"` buton, `aria-label=<label>`, `data-testid="color-picker-trigger"`, içinde hex değer metni. Tıklayınca açılır panel: renk paleti, hex input (`data-testid="hex-input"`, maxLength 7, `#RRGGBB` veya `#RGB`, değer blur'da işlenir) ve renk kutucukları (`aria-label="Select <name> color"`). Alanı bulmak için `getByRole('combobox', { name: '<label>' })` kullan (`getByLabel` güvenilir değil).
- **Medya seçici alanı**: boş önizleme alanı tıklanabilir ("Görsel yok / No image"); butonlar `aria-label` "Gözat / Browse" (dolu iken "Değiştir / Change"), "URL'yi manuel olarak girin / Enter URL manually" (URL input'u açar), önizleme üzerinde "Görseli kaldır / Remove image". Gözat → medya kütüphanesi dialog'u (başlık "{label} seçin / Select {label}"), tek seçim, yükleme destekli.
- **Select** = buton (`role=combobox`) + listbox; native select değildir.

| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Kimlik | Yapılandırma Adı * / Configuration Name * | `name` | Input | Evet | boşsa uyarı toast'u; varsayılan "Markam/My Brand" veya "{preset} Marka" | `#configName` | |
| Kimlik | Marka Adı * / Brand Name * | `identity.brandName` | Input | Evet | placeholder "Marka Adınız/Your Brand Name" | `#brandName` | Vitrin header/footer'da marka adı |
| Kimlik | Slogan (İngilizce) / Tagline (English) | `identity.tagline.en` | Input | Hayır | "" | `#taglineEn` | |
| Kimlik | Slogan (Türkçe) / Tagline (Turkish) | `identity.tagline.tr` | Input | Hayır | "" | `#taglineTr` | |
| Kimlik › Logo Ayarları / Logo Settings | Ana Logo URL * / Primary Logo URL * | `identity.logo.primary.url` | Medya seçici alanı (görsel, geniş) | Yayın için evet | boşsa yayında toast "Yayınlamadan önce lütfen bir ana logo ekleyin / Please add a primary logo before publishing" | Browse butonu bu bloğun içinde | |
| Kimlik | Logo Alt Metni / Logo Alt Text | `identity.logo.primary.alt` | Input | Hayır | placeholder "Marka Logosu" | `#logoAlt` | |
| Kimlik | Favicon URL | `identity.logo.favicon` | Medya seçici alanı | Hayır | | | |
| Kimlik | Apple Touch Icon URL | `identity.logo.appleTouchIcon` | Medya seçici alanı | Hayır | | | |
| Kimlik | Marka Tonu / Brand Tone | `tone.style` | Select | Hayır | varsayılan `professional`; seçenekler luxury "Lüks - Zarif, premium, sofistike", minimal, playful "Eğlenceli", professional "Profesyönel", bold "Cesur" | `#brandTone` yok — Label metniyle bul | Claude'un ürettiği metinlerin tonu için de okunur ([../../project/brand-voice.md](../../project/brand-voice.md)) |
| Renkler › Ana Renkler / Primary Colors | Ana / Primary | `colors.primary` | Renk seçici | – | #004438 | combobox name "Ana"/"Primary" | butonlar, linkler |
| Renkler | Ana Açık / Primary Light | `colors.primaryLight` | Renk seçici | – | #006652 | | |
| Renkler | Ana Koyu / Primary Dark | `colors.primaryDark` | Renk seçici | – | #002d24 | | |
| Renkler › İkincil Renkler / Secondary Colors | İkincil / Secondary | `colors.secondary` | Renk seçici | – | #D4AF37 | | |
| Renkler | İkincil Açık / Secondary Light | `colors.secondaryLight` | Renk seçici | – | #e6c458 | | |
| Renkler | İkincil Koyu / Secondary Dark | `colors.secondaryDark` | Renk seçici | – | #b8962f | | |
| Renkler › Arayüz Renkleri / UI Colors | Arka Plan / Background | `colors.background` | Renk seçici | – | #ffffff | | |
| Renkler | Ön Plan / Foreground | `colors.foreground` | Renk seçici + kontrast uyarısı (arka plana karşı) | – | #1a1a1a | | |
| Renkler | Soluk Arka Plan / Muted Background | `colors.muted` | Renk seçici | – | #f5f5f5 | | |
| Renkler | Soluk Metin / Muted Text | `colors.mutedForeground` | Renk seçici + kontrast (soluk arka plan) | – | #737373 | | |
| Renkler | Vurgu / Accent | `colors.accent` | Renk seçici | – | #f5f5f5 | | |
| Renkler | Vurgu Metni / Accent Text | `colors.accentForeground` | Renk seçici + kontrast (vurgu) | – | #1a1a1a | | |
| Renkler | Kenarlık / Border | `colors.border` | Renk seçici | – | #e5e5e5 | | |
| Renkler | Giriş Alanı Arka Planı / Input Field Background | `colors.input` | Renk seçici | – | #ffffff | | |
| Renkler › Durum Renkleri / Status Colors | Başarılı / Success | `colors.success` | Renk seçici | – | #22c55e | | |
| Renkler | Uyarı / Warning | `colors.warning` | Renk seçici | – | #f59e0b | | yıldız puanı rengi |
| Renkler | Hata / Error | `colors.error` | Renk seçici | – | #ef4444 | | |
| Renkler | Bilgi / Info | `colors.info` | Renk seçici | – | #3b82f6 | | |
| Renkler › E-Ticaret Renkleri / E-Commerce Colors | İndirim / Sale | `colors.sale` | Renk seçici | – | #B3423A | | indirimli fiyat + "Fırsat ürünü" rozeti varsayılan rengi |
| Renkler | Yeni Rozeti / New Badge | `colors.newBadge` | Renk seçici | – | #22c55e | | |
| Renkler | Stokta Yok / Out of Stock | `colors.outOfStock` | Renk seçici | – | #9ca3af | | |
| Renkler › Bölüm Renkleri / Section Colors | Bölüm Arka Planı / Section Background | `colors.sectionBg` | Renk seçici | – | #DFDAD3 | | ana sayfa bölüm zemini |
| Renkler | Bölüm Arka Planı (Alternatif) / Section Background (Alt) | `colors.sectionBgAlt` | Renk seçici | – | #F2EFEC | | |
| Renkler | Vurgu Altın Rengi / Accent Gold | `colors.accentGold` | Renk seçici | – | #C9972C | | |
| (UI'da yok) | – | `colors.ring`, `colors.card`, `colors.cardForeground` | – | – | varsayılan #004438, #ffffff, #1a1a1a | – | yalnız preset/AI ile değişir |
| Tipografi | Başlık Yazı Tipi / Heading Font | `typography.fontFamily.heading` | Select | – | `Inter, sans-serif`; seçenekler: Inter, Roboto, Open Sans, Lato, Montserrat, Poppins, Playfair Display, Merriweather, DM Sans, Judson, Manrope + "Yazı tiplerim / Your fonts" grubu (plan izinliyse) | `#headingFont` | listbox'ta seçenek metni font adı ("Inter") |
| Tipografi | Gövde Yazı Tipi / Body Font | `typography.fontFamily.body` | Select | – | `Inter, sans-serif` | `#bodyFont` | Plan dışı kalan özel font "{family} (planınızda mevcut değil)" olarak disabled görünür |
| Tipografi › Yazı tiplerim / Your fonts | "Yazı tipi ekle / Add font" | – | Buton → Dialog | – | en fazla 10 font, sayaç "{count} of {max}"; limitte disabled | button name "Yazı tipi ekle" | Plan yoksa yükseltme çağrısı gösterilir |
| Font Dialog "Yazı tipi yükle / Upload a font" | Yazı tipi adı / Font name | `family` | Input | Evet | placeholder "ör. Marka Sans"; geçersiz / ayrılmış / zaten var hataları | `#font-family` | |
| Font Dialog | Yazı tipi dosyası / Font file | `file` | Dosya yükleme (buton) | Evet | `.woff2,.woff,.ttf`, en fazla 2 MB; desteklenmeyen format / çok büyük hataları | dosya input'u | buton metni "WOFF2, WOFF veya TTF, en fazla 2 MB" |
| Font listesi | çöp kutusu ikon | – | Buton | – | onay dialog'u "''{family}'' yazı tipi silinsin mi?" → "Sil/Delete" | aria-label "{family} yazı tipini sil / Delete {family}" | kullanımdaysa hata (`ERR_FONT_IN_USE`) |
| Görünüm ve His › Köşe Stili / Corner Style | Keskin/Sharp, Yumuşak/Soft, Yuvarlak/Rounded, Hap/Pill | `shapes.borderRadius` (6 değer birden) | radio kartları (`role=radio`, grup `corner-style-label`) | – | varsayılan `soft` | `getByRole('radio', {name})` | Değerler hiçbir stile uymuyorsa "Özel/Custom" |
| Görünüm ve His › İçerik Yoğunluğu / Content Density | Sıkı/Compact, Rahat/Comfortable, Ferah/Spacious | `spacing` (tümü) | radio kartları | – | varsayılan comfortable (birim 4, kenar boşluğu 1/2/4rem, bölüm aralığı 3rem, bileşen aralığı 1rem) | | |
| Görünüm ve His › Sayfa Genişliği / Page Width | Dar/Narrow (1200/240), Standart/Standard (1440/280), Geniş/Wide (1600/320) | `layout.maxWidth`, `layout.sidebarWidth` | radio kartları | – | standard | | |
| Görünüm ve His › "Değerleri ince ayarla / Fine-tune values" (katlanır, kapalı) | Yok/None, Küçük/Small, Orta/Medium, Büyük/Large, Çok Büyük/Extra Large, Tam/Full | `shapes.borderRadius.{none,sm,md,lg,xl,full}` | Input (CSS uzunluk) | – | serbest metin | `#style-border-radius-<key>` | Değiştirmek "Özel" moda geçirir |
| İnce ayar | Temel Birim / Base Unit: Npx | `spacing.unit` | Slider 1–16 adım 1 | – | 4 | `#style-spacing-unit` | |
| İnce ayar | Mobil / Tablet / Masaüstü (Mobile/Tablet/Desktop) | `spacing.containerPadding.{mobile,tablet,desktop}` | Input | – | 1rem / 2rem / 4rem | `#style-padding-mobile` vb. | |
| İnce ayar | Bölüm Aralığı / Section Gap | `spacing.sectionGap` | Input | – | 3rem | `#style-section-gap` | |
| İnce ayar | Bileşen Aralığı / Component Gap | `spacing.componentGap` | Input | – | 1rem | `#style-component-gap` | |
| İnce ayar | Maks Genişlik / Max Width | `layout.maxWidth` | Input | – | 1440px | `#style-max-width` | |
| İnce ayar | Kenar Çubuğu Genişliği / Sidebar Width | `layout.sidebarWidth` | Input | – | 280px | `#style-sidebar-width` | |
| Ürün Rozetleri | Ürün kartlarında kısa açıklamayı göster / Show short description on product cards | `showProductCardShortDescription` | Switch | – | kapalı | `#product-card-short-description` | |
| Ürün Rozetleri (3 kart: Fırsat ürünü/Flash deal=`hot`, En çok satan/Best seller=`bestSeller`, Yeni ürün/New arrival=`newArrival`) | Göster / Show | `productBadges.<kind>.enabled` | Switch | – | ayarlanmamışsa AÇIK | `#badge-enabled-<kind>` | Kapalıysa aşağıdaki alanlar disabled |
| Ürün Rozetleri | Rozet görseli / Badge image | `productBadges.<kind>.imageUrl` | Medya seçici alanı (klasör `badges`) | – | boş = yerleşik ikon | | |
| Ürün Rozetleri | Metin (İngilizce) / Wording (English) | `productBadges.<kind>.label.en` | Input | – | placeholder Hot / Best Seller / New | `#badge-label-en-<kind>` | |
| Ürün Rozetleri | Metin (Türkçe) / Wording (Turkish) | `productBadges.<kind>.label.tr` | Input | – | placeholder Sıcak / En Çok Satan / Yeni | `#badge-label-tr-<kind>` | |
| Ürün Rozetleri | Arka plan rengi / Background colour | `productBadges.<kind>.backgroundColor` | Renk seçici | – | boşsa: Fırsat → İndirim rengi, En çok satan → Ana renk, Yeni → Yeni Rozeti rengi | | Aynı label 3 kez geçer → kart kapsamına göre bul |
| Ürün Rozetleri | Yazı rengi / Text colour | `productBadges.<kind>.textColor` | Renk seçici + kontrast | – | otomatik kontrast rengi | | |
| Görünüm (önizleme) | – | – | Salt okunur önizleme: Marka Önizleme, Navigasyon, Mağaza Önizleme (3 kart), Bülten, Alt Bilgi | – | – | – | |

## Aksiyonlar
| Buton (tr / en) | Yer | Etki | Onay / Toast |
|---|---|---|---|
| Bu Şablonu Kullan / Use This Preset | Boş durum kartı | Preset değerleriyle formu doldurur (ad "{Preset} Marka", tipografi/renkler/şekiller/boşluk/düzen/ton). Kaydetmez. | Hata: "Şablon yüklenemedi" |
| Özel Oluştur / Create Custom | Boş durum | Formu varsayılan değerler + ad "Markam" ile doldurur | – |
| Yapay Zeka Marka Kurulumu / AI Brand Setup | Başlık / boş durum | `/branding/ai-wizard` sayfasına gider (bkz. [branding-ai-wizard.md](branding-ai-wizard.md)) | – |
| Yenile / Refresh | Başlık | Liste + preset'leri yeniden çeker; formdaki değerleri DEĞİŞTİRMEZ | – |
| Stili Değiştir / Change Style | Başlık (`settings:update`) | Dialog "Stili Değiştir" — preset butonları (ad + açıklama). Seçince onay dialog'u "Stili Değiştir? / Change Style?" → "Stili Uygula / Apply Style" veya "İptal". Onaylanırsa yalnız tipografi/renkler/şekiller/boşluk/düzen/ton preset'ten gelir, kimlik korunur; **yalnız form** değişir (kaydedilmez) | Toast "Başarılı — Stil şablondan güncellendi / Style updated from preset" |
| Taslağı Kaydet / Save Draft | Alt çubuk | Kaydı taslak olarak kaydeder (yoksa oluşturur) | Toast "Değişiklikler taslak olarak kaydedildi — mağazada yayında değil / Changes saved as draft — not live on store"; hata "Marka yapılandırması kaydedilemedi" |
| Mağazaya Yayınla / Publish to Store | Alt çubuk | Önce ad + logo kontrolü; sonra kaydeder ve yayınlar | Toast "Marka ayarları mağazanızda yayında / Branding is now live on your store"; hata: sunucu mesajı veya "Yayınlama başarısız oldu" |
- Her iki alt çubuk butonu da "değişiklik yok + yayında + boşta" iken disabled.
- Kaydedilmemiş değişiklikler sayfadan ayrılınca kaybolur.

## Yan etkiler
- Yayından sonra vitrin yeni renkleri, yazı tiplerini, köşe stillerini ve logoyu **~30 sn** içinde gösterir.
- Renk kaydı yalnız gönderilen renkleri günceller; formda olmayan renkler korunur.

## Tuzaklar
- **Canlı markada "Taslağı Kaydet" tehlikeli**: yayındaki kaydı taslağa çevirir ve marka bir süre sonra vitrinden düşer (vitrin varsayılan temaya döner). Canlı markada değişiklik yapıp onay alındıktan sonra **doğrudan "Mağazaya Yayınla"** kullan; taslak kaydedildiyse mutlaka ardından yayınla.
- Yayınla, logo URL'si boşsa durur (toast ile uyarır).
- Accordion bölümleri varsayılan açık; sayfa uzun — hedef alanı kaydırarak bul. "Görünüm" adı iki yerde: "Görünüm ve His" (Look & Feel) ve "Görünüm" (Appearance önizleme).
- Renk seçici label'ları sayfada tekrar eder (ör. "Arka plan rengi" 3 rozet kartında; "İkincil" hem renk alanında hem önizleme butonunda). Kapsamı ilgili kart/bölüme daralt.
- Hex input değeri blur'da işlenir; yazdıktan sonra Tab/başka yere tıkla. Kısa hex (#abc) kabul edilir.
- "Stili Değiştir" ve preset seçimi kaydetmez; ardından Kaydet/Yayınla gerekir.
- Sayfada çoklu marka yönetimi (seç/sil/etkinleştir) yok; her zaman aktif (veya ilk) kayıt düzenlenir.
- Durum çubuğu metni TR arayüzde de İngilizce görünür ("Published", "Draft saved").
- Özel font bir markada kullanılıyorsa silinemez (`ERR_FONT_IN_USE`): önce başka font seç + kaydet.
- Store view'a özel marka bu ekrandan yönetilmez.

## Doğrulama
- Toast metnini bekle ("Marka ayarları mağazanızda yayında").
- Sayfa başlığı açıklamasında " — Taslak" eki olmamalı (yayında).
- Alt çubuk butonları disabled ve sol metin "Published" olmalı.
- Network: yayınlama isteği 200.
- Vitrinde ~30 sn sonra (sayfayı yeniden yükle) yeni renkler/yazı tipleri görünmeli; logo header'da görünmeli.
