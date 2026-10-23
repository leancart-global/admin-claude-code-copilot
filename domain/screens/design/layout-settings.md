# Mağaza Düzeni — Üst Bilgi / Alt Bilgi (Layout Settings: Header / Footer)

- URL: `{ADMIN_URL}/layout-settings?tab=header` ve `{ADMIN_URL}/layout-settings?tab=footer`
  (`?tab` dışındaki her değer `header` sayılır)
- Sidebar: "Mağaza Tasarımı / Store Design" altında **Üst Bilgi / Header** ve **Alt Bilgi / Footer**. `/design` sayfasındaki kartlar da buraya link verir.
- Amaç: Vitrinin header'ını (duyuru çubuğu, üst şerit, arama, hesap, sepet, mağaza bulucu, sticky/transparent davranışı, yerleşim stili) ve footer'ını (sütunlar, sosyal medya, bülten, iletişim, ödeme/kargo/güven rozetleri, yasal/telif, uygulama indirme, ETBİS, renkler) preset + bölüm bazlı açma/kapama ve kenar panelleri (Sheet) ile düzenlemek.
- Yetki (permission):
  - Sidebar görünürlüğü ve okuma: `content:read`.
  - Oluşturma / güncelleme / yayınlama: `content:write`. Yetki yoksa otomatik kayıt hata durumuna düşer (durum çubuğu "Could not save — check your changes").
- Veri akışı (işlevsel):

| Amaç | Ne zaman |
|---|---|
| Header / footer yapılandırmasını ve preset listesini yükle | sayfa yüklenince |
| Aktif marka renklerini ve mağaza (storefront) URL'sini oku | sayfa yüklenince |
| Preset seç ("Bunu Kullan") → yeni yapılandırma oluştur (adı "<Preset Adı> Configuration", aktif) | kart tıklanınca |
| Otomatik kayıt (tüm yerel yapılandırma) | her değişiklikten **3 sn sonra** (debounce) ve "Taslağı Kaydet" |
| Yayınla (önce kaydet, sonra yayınla) | "Mağazaya Yayınla" |
| Footer iletişim önizleme verisi (Ayarlar > Genel'deki şirket bilgisi) | İletişim sheet'i açılınca |
| Footer çevirileri için aktif mağaza görünümü (store view) dilleri | Sütunlar / Yasal sheet açılınca |

## Ön koşullar ve bağımlılıklar
- **Marka Ayarları (Branding)**: aktif marka yoksa sarı "Kurulum Gerekli / Setup Required" banner'ı çıkar, "Marka Ayarları / Brand Settings" satırında **Yapılandır / Configure** butonu `/branding`'e götürür. Logo header/footer'da **düzenlenmez**; branding'den gelir (header Logo sheet'i sadece bilgilendirir; footer Logo satırında "Marka Ayarları / Brand Settings" linki `/branding`'e gider).
- **Mağaza URL'si (Storefront URL)**: tanımlı değilse canlı önizleme gösterilmez ve banner'da "Mağaza URL'si / Storefront URL (Canlı önizleme için gerekli / Required for live preview)" satırı `/settings/general`'a link verir.
- **Menü öğeleri** bu ekranda değil, `/design/navigation` (Navigation Designer) ekranında yönetilir; header'daki "Menü / Navigation Menu" satırındaki **Menüyü Düzenle / Edit Menu** butonu oraya gider. Bkz. [navigation.md](navigation.md).
- **Footer İletişim**: adres/telefon/e-posta burada girilmez; `Ayarlar > Genel` (`/settings/general`) mağaza iletişim bilgisinden okunur, sheet'te salt-okunur gösterilir + "Ayarlarda Yönet / Manage in Settings" butonu.
- **Vitrin kuralı**: Yayınlanmış header **veya** footer'dan biri bile yoksa vitrin tüm sayfalarda "Coming Soon" sayfası gösterir. Yeni tenant'ta önce ikisi için de preset seçilmeli.

## Yerleşim
Yukarıdan aşağı:
1. Sayfa başlığı **Mağaza Düzeni / Store Layout**, açıklama "Mağazanızın müşterilere nasıl göründüğünü seçin / Choose how your store looks to customers", sağda **Yenile / Refresh** butonu.
2. (Koşullu) Ön koşul banner'ı "Kurulum Gerekli / Setup Required".
3. Sekme çubuğu (`role="tablist"`, `<button role="tab" id="tab-header|tab-footer">`): **Üst Bilgi / Header** | **Alt Bilgi / Footer**. Tıklayınca URL `?tab=…` olarak değişir.
4. Sekme paneli (`role="tabpanel" id="tabpanel-header|tabpanel-footer"`):
   - **Aktif yapılandırma yoksa**: Kart "Bir Üst Bilgi Stili Seçin / Choose a Header Style" (footer: "Bir Alt Bilgi Stili Seçin / Choose a Footer Style") + preset galerisi.
   - **Aktif yapılandırma varsa**:
     a. *Aktif Stil kartı*: yeşil nokta + stil adı + rozet "Mevcut stil / Current style" + "{time} güncellendi / Updated {time}" + **Stili Değiştir / Change Style** butonu (preset galerisini dialog içinde açar).
     b. *Özellikler / Features* kartı: bölüm satırları (header veya footer).
     c. (Sadece footer) ikinci *Özellikler / Features* kartı → Düzen ve Yapı / Renkler / Davranış katlanır grupları. Not: iki kartın başlığı da aynı ("Özellikler") — locator'da kart içeriğine bakın.
5. Canlı önizleme paneli (aktif yapılandırma + mağaza URL'si varsa): masaüstünde (≥768px) "Canlı Önizleme / Live Preview" başlıklı gömülü önizleme; mobilde **Önizleme / Preview** butonu → alttan açılan Sheet.
6. Sabit alt durum çubuğu (aktif yapılandırma varsa): solda durum metni, sağda **Taslağı Kaydet / Save Draft** ve **Mağazaya Yayınla / Publish to Store**.

### Preset galerisi
- Kart `data-testid="preset-card-<key>"`, illüstrasyon + ad + açıklama. Aktif kartta yeşil **Aktif / Active** rozeti (`data-testid="active-badge"`) ve tek buton **Özelleştir / Customize**. Diğer kartlarda **Bunu Kullan / Use This** (aria-label `"Bunu Kullan - <Ad>"`) + ikon-only Özelleştir butonu (aria-label `"Özelleştir - <Ad>"`).
- Header preset'leri (key → tr / en): `classic-commerce` Klasik Mağaza / Classic Commerce; `minimal-boutique` Minimal Butik / Minimal Boutique; `mega-store` Mega Mağaza / Mega Store; `fashion-forward` Modern Moda / Fashion Forward; `quick-shop` Hızlı Alışveriş / Quick Shop; `custom` Lüks Sade Merkezi / Luxury Clean Centered.
- Footer preset'leri: `full-featured` Tam Donanımlı / Full Featured; `simple-clean` Sade ve Temiz / Simple Clean; `contact-focused` İletişim Odaklı / Contact Focused; `social-first` Sosyal Medya Öncelikli / Social First; `trust-builder` Güven Oluşturucu / Trust Builder; `custom` Butik Eksiksiz / Boutique Complete.
- Bilinen bir preset'e karşılık gelmeyen aktif yapılandırmada galeride `custom` kartı aktif görünür.

## Alanlar

### Header sekmesi — bölüm satırları
Her satır `data-testid="section-row-<id>"`, sağda Switch (`id="toggle-<id>"`, `aria-label=<label>`), açıksa **Düzenle / Edit** ghost butonu (aria-label `"Düzenle <label>"`) → sağdan açılan Sheet. Kapalı satırda Düzenle butonu görünmez.

| Bölüm/Tab | Label (tr / en) | Form key (config path) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Satır | Duyuru Çubuğu / Announcement Bar | `campaignBanners.0.isEnabled` | Switch + Düzenle | – | varsayılan kapalı | `section-row-campaign-banner`, `#toggle-campaign-banner` | Özet = banner metni |
| Satır | Üst Şerit / Top Bar | `topBar.isEnabled` | Switch + Düzenle | – | kapalı | `section-row-top-bar` | Açık ama telefon/e-posta/link/değiştirici yoksa kırmızı uyarı `data-testid="top-bar-empty"`: "Bu şerit açık ama gösterecek hiçbir şeyi yok…" |
| Satır | Logo / Logo | – | sadece Düzenle (her zaman açık) | – | – | `section-row-logo` | Sheet bilgilendirme; logo branding'den (`/branding`) |
| Satır | Arama / Search | `search.isEnabled` | Switch + Düzenle | – | açık | `section-row-search` | Özet = arama stili |
| Satır | Menü / Navigation Menu | – | her zaman açık + **Menüyü Düzenle / Edit Menu** | – | – | `section-row-navigation` | `/design/navigation`'a gider; özet "Menü öğeleri ayrı yerden yönetilir / Manage menu items separately" |
| Satır | Hesap / Account | `account.isEnabled` | Switch + Düzenle | – | açık | `section-row-account` | |
| Satır | Sepet / Cart | `cart.isEnabled` | Switch + Düzenle | – | açık | `section-row-cart` | |
| Satır | Mağaza Bulucu / Store Locator | `storeLocator.isEnabled` | Switch (Düzenle yok) | – | kapalı | `section-row-store-locator` | Açılınca altında URL input belirir |
| Satır alt alanı | Mağaza Bulucu Adresi / Store Locator URL | `storeLocator.url` | Input `#store-locator-url` | Fiilen evet (açıksa) | placeholder `/iletisim`; boşsa kırmızı uyarı `data-testid="store-locator-no-url"` | `#store-locator-url` | URL boşsa vitrinde ikon görünmez |
| Başlık | Davranış / Behavior | – | ayırıcı | | | | |
| Satır | Yapışkan Üst Bilgi / Sticky Header | `layout.isSticky` | Switch | – | preset'e göre | `section-row-sticky-header` | |
| Satır | Hero Üzerinde Şeffaf / Transparent on Hero | `layout.isTransparent` | Switch | – | preset'e göre | `section-row-transparent-hero` | Açılınca renk seçici çıkar |
| Alt alan | Hero üzerindeki metin rengi / Text over hero | `layout.overlayTextColor` | Renk seçici | – | `#FFFFFF` | `data-testid="overlay-text-color"` içindeki `color-picker-trigger` | |
| Satır | Masaüstünde Menü Düğmesi / Menu Button on Desktop | `navigation.showTriggerOnDesktop` | Switch | – | kapalı | `section-row-show-trigger-on-desktop` | |
| Satır | Üst Çubuk Konumu / Top Bar Position | `topBar.placement` | Select (buton + listbox) | – | `above`; seçenekler "Başlığın üzerinde / Above header", "Başlık satırında / In header row" | `[data-testid="select-top-bar-placement"]`, `#top-bar-placement` | "Başlık satırında" yalnız Yerleşim Düzeni = Ortalanmış iken seçilebilir; aksi halde disabled + not "Satır içi yerleşim Ortalanmış düzeni gerektirir…" |
| Satır | Yerleşim Düzeni / Layout Style | `layout.type` | Select | – | seçenekler `standard` Standart / Standard, `centered` Ortalanmış / Centered | `[data-testid="select-layout-type"]`, `#header-layout-type` | |
| Alan | Masaüstü Yüksekliği / Desktop Height | `layout.heightDesktop` | Input `#header-height-desktop` | – | placeholder "örn. 80px / e.g. 80px"; serbest CSS değeri | `#header-height-desktop` | |
| Alan | Mobil Yüksekliği / Mobile Height | `layout.heightMobile` | Input `#header-height-mobile` | – | placeholder "örn. 60px" | `#header-height-mobile` | |

### Header Sheet'leri (sağdan Sheet; kendi Kaydet butonu YOK — her tuş vuruşu yerel yapılandırmayı değiştirir ve 3 sn sonra otomatik kayıt tetiklenir; kapatmak için Esc / X / dışarı tıkla)

| Sheet (tr / en başlık) | Label (tr / en) | Form key | Kontrol tipi | Validasyon/varsayılan | Locator ipucu |
|---|---|---|---|---|---|
| Duyuru Çubuğu / Announcement Bar | Afiş Metni / Banner Text | `campaignBanners.0.text` | Input | maxLength 200; placeholder "Yaz İndirimi — Her şeyde %20 indirim!" | `#banner-text` |
| 〃 | Bağlantı Adresi / Link URL | `campaignBanners.0.linkUrl` | Input type=url | maxLength 500; placeholder `/indirim` | `#banner-link` |
| 〃 | Kapatılabilir / Dismissible | `campaignBanners.0.isDismissible` | Switch | açık | `#banner-dismissible` |
| Üst Şerit / Top Bar | İletişim Telefonu / Contact Phone | `topBar.contactPhone` | Input | – | `#topbar-phone` |
| 〃 | İletişim E-postası / Contact Email | `topBar.contactEmail` | Input type=email | – | `#topbar-email` |
| 〃 | Dil Değiştirici / Language Switcher | `topBar.showLanguageSwitcher` | Switch | açık | `#topbar-lang` |
| 〃 | Para Birimi Değiştirici / Currency Switcher | `topBar.showCurrencySwitcher` | Switch | açık | `#topbar-currency` |
| 〃 | Arka Plan Rengi / Background Color | `topBar.backgroundColor` | Renk seçici | `#FFFFFF` | `color-picker-trigger` (aria-label = label) |
| 〃 | Metin Rengi / Text Color | `topBar.textColor` | Renk seçici + kontrast göstergesi | `#000000` | 〃 |
| 〃 | Üst Bar Bağlantıları / Top Bar Links → Etiket / Label, Bağlantı Adresi / URL | `topBar.links[i].label`, `.url` | Input çiftleri; **Bağlantı ekle / Add link**; çöp kutusu "Bağlantıyı kaldır / Remove link" | boşken "Henüz bağlantı yok — aşağıdan bir tane ekleyin." | `#topbar-link-<i>-label`, `#topbar-link-<i>-url` |
| Logo | (salt bilgi) "Logo Marka Ayarlarından yönetilir / Logo is managed from Brand Settings" + mevcut logo önizleme | – | – | – | – |
| Arama / Search | Stil / Style | `search.style` | Select | `icon`; seçenekler Yalnızca Simge / Icon Only (`icon`), Genişleyebilir / Expandable (`expandable`), Tam Giriş Alanı / Full Input (`input`) | `#search-style` |
| 〃 | Yer Tutucu Metni / Placeholder Text | `search.placeholder` | Input | placeholder "Ürün ara..." | `#search-placeholder` |
| 〃 | Maksimum Öneri Sayısı / Max Suggestions | `search.maxSuggestions` | Input type=number | 1–10 | `#search-max-suggestions` |
| Hesap / Account | İstek Listesini Göster / Show Wishlist | `account.showWishlist` | Switch | açık | `#account-wishlist` |
| 〃 | Menü Etiketi / Menu Label | `account.label` | Input | placeholder "Hesabım" | `#account-label` |
| 〃 | Hesap Sayfası Adresi / Account Page URL | `account.accountUrl` | Input | placeholder `/hesabim` | `#account-url` |
| Sepet / Cart | Ürün Sayısını Göster / Show Item Count | `cart.showItemCount` | Switch | açık | `#cart-count` |
| 〃 | Ara Toplamı Göster / Show Subtotal | `cart.showSubtotal` | Switch | kapalı | `#cart-subtotal` |

Header'da **bu ekrandan ayarlanamayanlar**: header arka plan/metin rengi (marka renklerinden gelir), menü konumu ve mobil menü stili, sepet/hesap ikon stili, banner renkleri ve bitiş tarihi, birden fazla duyuru banner'ı (yalnız ilki düzenlenir). Bunlar preset ile gelir.

### Footer sekmesi — bölüm satırları

| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Satır | Logo / Logo | `logo` (salt okunur) | her zaman açık + link **Marka Ayarları / Brand Settings** | – | özet "Logo yapılandırıldı / Logo configured" veya "Ayarlanmadı / Not set" | `section-row-footer-logo` | `/branding`'e gider |
| Satır | ETBİS Güven Damgası / ETBIS Trust Mark | `etbis.isEnabled` | Switch + Düzenle | – | kapalı | `section-row-etbis` | |
| Satır | Alt Bilgi Sütunları / Footer Columns | `sections[]` | her zaman açık + Düzenle | – | özet "N columns, M links" | `section-row-sections` | |
| Satır | Sosyal Medya / Social Media | `socialMedia[]` | Switch (sheet açar) + Düzenle | – | Switch durumu = listede öğe var mı | `section-row-social-media` | Switch'e tıklamak kapatmaz, sheet açar |
| Satır | Bülten / Newsletter | `newsletter.isEnabled` | Switch + Düzenle | – | preset'e göre | `section-row-newsletter` | |
| Satır | İletişim Bilgileri / Contact Info | `contact.isEnabled` | Switch + Düzenle | – | preset'e göre; özet "Ayarlar bölümündeki mağaza adresi, telefonu ve e-postasını kullanır" | `section-row-contact` | |
| Satır | Ödeme Yöntemleri / Payment Methods | `paymentMethods[]` | Switch (sheet açar) + Düzenle | – | liste boş değilse açık | `section-row-payment-methods` | |
| Satır | Kargo Rozetleri / Shipping Badges | `shippingBadges[]` | 〃 | – | 〃 | `section-row-shipping-badges` | |
| Satır | Güven Rozetleri / Trust Badges | `trustBadges[]` | 〃 | – | 〃 | `section-row-trust-badges` | |
| Satır | Yasal ve Telif Hakkı / Legal & Copyright | `legal.isEnabled` | Switch + Düzenle | – | preset'e göre | `section-row-legal` | |
| Satır | Uygulama İndirme / App Download | `appDownload.isEnabled` | Switch + Düzenle | – | kapalı | `section-row-app-download` | |

Liste tipi bölümleri (sosyal/ödeme/kargo/güven) "kapatmak" için sheet içinde tüm öğeleri **Kaldır / Remove** etmek veya öğeyi "Görünür / Visible" switch'iyle gizlemek gerekir.

### Footer Sheet'leri (anlık yerel değişiklik + otomatik kayıt; Kaydet butonu yok)

| Sheet (tr / en) | Label (tr / en) | Form key | Kontrol tipi | Validasyon/varsayılan | Not / Locator |
|---|---|---|---|---|---|
| Alt Bilgi Sütunları / Footer Columns | Görünüm / View (dil kapsamı) | – | İçerik dili seçici (Varsayılan / Default + aktif store view dilleri, çeviri doluluk göstergesi) | varsayılan = Varsayılan | Dil seçiliyken sadece başlık/link etiketi çevirisi düzenlenir; ekleme/silme/URL/sütun genişliği/görünürlük **disabled** |
| 〃 | Sütun accordion başlığı (sütun adı + "N bağlantı"), Yukarı taşı / Move up, Aşağı taşı / Move down | `sections[i].sortOrder` | ikon butonlar (aria-label) | – | Sürükle-bırak YOK; sıralama ok butonlarıyla |
| 〃 | Sütun Başlığı / Column Title | `sections[i].title` | Çevrilebilir input | yeni sütun varsayılanı "Yeni Sütun / New Column" | |
| 〃 | Müşterilere görünür / Visible to customers | `sections[i].isVisible` | Switch | açık | |
| 〃 | Sütun Genişliği / Column Width | `sections[i].columnSpan` | Select 1–3 | `1` | `#<sectionKey>-colspan` |
| 〃 | Bağlantılar / Links → Bağlantı Metni / Link Text | `sections[i].links[j].label` | Çevrilebilir input (link satırında kalem "Bağlantıyı Düzenle / Edit Link" ile açılır) | yeni link "Yeni Bağlantı / New Link" | |
| 〃 | Bağlantı Adresi / Link URL | `links[j].url` + `isExternal` | Bağlantı seçici (iç sayfa/kategori/ürün arama veya harici URL) | – | |
| 〃 | **Bağlantı Ekle / Add Link**, **Bağlantıyı Kaldır / Remove Link**, **Sütun Ekle / Add Column**, **Sütunu Kaldır / Remove Column** | – | Buton | Sütun kaldırma onay dialog'u: "Bu sütun kaldırılsın mı? / Remove this column?" → İptal / Cancel, Sütunu Kaldır / Remove Column | |
| Sosyal Medya Bağlantıları / Social Media Links | Platform / Platform | `socialMedia[i].platform` | Select | `facebook, instagram, twitter, youtube, tiktok, linkedin, pinterest, whatsapp, telegram, other`; yeni öğe `facebook` | Satır tıklanınca açılır (accordion) |
| 〃 | Profil Adresi / Profile URL | `socialMedia[i].url` | Input | – | |
| 〃 | Görünür / Visible | `isVisible` | Switch | açık | Gizliyse "Gizli / Hidden" rozeti |
| 〃 | **Sosyal Bağlantı Ekle / Add Social Link**, **Kaldır / Remove**, Yukarı/Aşağı taşı | – | Buton | – | |
| Ödeme Yöntemleri / Kargo Sağlayıcıları / Güven Rozetleri | Ad / Name | `name` | Input | placeholder "ör. Visa, DHL, SSL Güvenceli" | |
| 〃 | Simge / Icon | `icon` | Select ("Simge yok / No icon" + liste) | ödeme: `visa, mastercard, amex, paypal, iyzico, stripe, apple-pay, google-pay`; kargo: `dhl, fedex, ups, yurtici, aras, ptt, mng, trendyol-express`; güven: `ssl, secure-payment, money-back, fast-delivery, customer-service` | |
| 〃 | Özel Görsel URL / Custom Image URL | `imageUrl` | Input (URL metni, yükleme yok) | mutlak `https://` URL | |
| 〃 | Bağlantı Adresi / Link URL | `linkUrl` | Input type=url | sadece kargo ve güven rozetlerinde | |
| 〃 | Görünür / Visible, **Rozet Ekle / Add Badge**, **Kaldır / Remove**, Yukarı/Aşağı taşı | | Switch / Buton | | |
| Bülten / Newsletter | Başlık / Heading | `newsletter.title` | Input | placeholder "Bültenimize abone olun" | |
| 〃 | Açıklama / Description | `newsletter.description` | Textarea | – | |
| 〃 | E-posta alanı yer tutucu metni / Email input placeholder | `newsletter.placeholder` | Input | – | |
| 〃 | Buton metni / Button text | `newsletter.buttonText` | Input | placeholder "Abone Ol" | |
| 〃 | Gizlilik bildirimini göster / Show privacy notice | `newsletter.showPrivacyNotice` | Switch | – | Açıksa altında Textarea "Gizlilik bildirimi metni / Privacy notice text" (`privacyNotice`) |
| İletişim Bilgileri / Contact Information | Adres / Telefon / E-posta | (mağaza iletişim bilgisi, salt okunur) | metin + **Ayarlarda Yönet / Manage in Settings** | "Ayarlanmadı / Not set" | `/settings/general` |
| 〃 | Çalışma saatleri / Working hours | `contact.workingHours` | Input | placeholder "Pzt-Cum 09:00 - 18:00" | |
| 〃 | Haritayı göster / Show map | `contact.showMap` | Switch | – | Açıksa "Harita yerleştirme URL'si / Map embed URL" (`mapEmbedUrl`, Google Maps embed) |
| Yasal ve Telif Hakkı / Legal & Copyright | Görünüm / View | dil kapsamı | İçerik dili seçici | – | Sütunlar sheet'iyle aynı kural |
| 〃 | Telif hakkı metni / Copyright text | `legal.copyrightText` (+ çeviriler) | Çevrilebilir input | ipucu: `{year}` ve `{tenantName}` yer tutucuları | |
| 〃 | Yılı otomatik güncelle / Auto-update year | `legal.showCurrentYear` | Switch | – | |
| 〃 | Yasal bağlantılar / Legal links → Yasal bağlantı metni / Legal link text, Bağlantı adresi / Link URL | `legal.links[i]` | Çevrilebilir input + bağlantı seçici; **Bağlantı Ekle / Add Link**, "Yasal bağlantıyı kaldır / Remove legal link" | boşken "Henüz yasal bağlantı yok…" | |
| 〃 | Çerez ayarları bağlantısı / Cookie settings link | `legal.cookieSettings.isEnabled` | Switch | – | Altında "Sıra / Position" (`sortOrder`, Input number) ve "Çerez ayarları bağlantı metni / Cookie settings link text" (`label`, boşsa varsayılan) |
| Uygulama İndirme / App Download | Başlık / Heading | `appDownload.title` | Input | placeholder "Uygulamamızı İndirin" | |
| 〃 | App Store bağlantısı / App Store link | `appDownload.appStoreUrl` | Input | – | |
| 〃 | App Store rozet görseli URL / App Store badge image URL | `appDownload.appStoreImage` | Input | boş = varsayılan rozet; doluysa mutlak `https://` URL | |
| 〃 | Google Play bağlantısı / Google Play link; Google Play rozet görseli URL | `playStoreUrl`, `playStoreImage` | Input | görsel: mutlak `https://` URL | |
| ETBİS Güven Damgası / ETBIS Trust Mark | Güven damgası görseli / Trust mark image | `etbis.imageUrl` | Medya seçici alanı (Gözat / Browse → medya kütüphanesi dialog'u, "URL'yi manuel olarak girin / Enter URL manually") | Önerilen şeffaf PNG, ≥150px yükseklik; mutlak `https://` URL | bkz. [../content/media-library.md](../content/media-library.md) |
| 〃 | Bağlantı URL'si / Link URL | `etbis.linkUrl` | Input | placeholder `https://etbis.eticaret.gov.tr/sirket/...`; mutlak `https://` URL | |
| 〃 | Alternatif metin / Alt text | `etbis.alt` | Input | placeholder "ETBİS Güven Damgası" | |

### Footer — ikinci "Özellikler" kartı (katlanır gruplar)

| Grup | Label (tr / en) | Form key | Kontrol tipi | Varsayılan | Locator ipucu |
|---|---|---|---|---|---|
| Düzen ve Yapı / Layout & Structure (açık) | Sütun Sayısı / Column Count | `layout.columnCount` | Select `3/4/5/6` | `4` | grup içinde |
| 〃 | Ayırıcıları Göster / Show Dividers | `layout.showDividers` | Switch | açık | |
| 〃 | Kapsayıcı Genişliği / Container Width | `layout.containerWidth` | Select: Tam Genişlik / Full Width (`full`), Kapsayıcı / Contained (`contained`), Dar / Narrow (`narrow`) | `contained` | |
| Renkler / Colors (kapalı; `data-testid="toggle-group-colors"`) | Arka Plan Rengi / Background Color | `layout.backgroundColor` | Renk seçici | `#1F2937` | |
| 〃 | Metin Rengi / Text Color | `layout.textColor` | Renk seçici + kontrast | `#FFFFFF` | |
| 〃 | Kenarlık Rengi / Border Color | `layout.borderColor` | Renk seçici | `#374151` | |
| Davranış / Behavior (kapalı) | Dil Değiştirici / Language Switcher | `layout.showLanguageSwitcher` | Switch | kapalı | |
| 〃 | Yukarı Kaydır / Scroll to Top | `layout.showScrollToTop` | Switch | kapalı | |

### Ortak kontroller
- **Renk seçici**: tetikleyici buton `data-testid="color-picker-trigger"` (aria-label = label) → açılır panel: renk paleti (aria "Renk seçici / Color picker") + Hex input (aria "Hex renk kodu / Hex color code"; `#` otomatik eklenir, geçersizse blur'da eski değere döner, değer büyük harfle kaydedilir) + "Hızlı Renkler / Quick Colors" kutucukları (aria `Select <ad> color`, tıklayınca panel kapanır). En güvenlisi: tetikleyiciye tıkla → hex input'a `#AABBCC` yaz → Tab/blur.
- **Medya seçici alanı**: "Gözat / Browse" (değer varsa "Değiştir / Change") → medya kütüphanesi dialog'u (başlık "{label} seçin"); link ikonu "URL'yi manuel olarak girin" → Input (geçersizse "Lütfen geçerli bir URL girin…"); "Görseli kaldır / Remove image".

## Aksiyonlar
| Buton (tr / en) | Yer | Etki |
|---|---|---|
| Yenile / Refresh | Sayfa başlığı | Tüm verileri yeniden çeker; kaydedilmemiş yerel değişiklikler sunucudaki değerle ezilir. |
| Üst Bilgi / Header, Alt Bilgi / Footer | Sekme çubuğu | `?tab=` ile sekme değişimi. |
| Bunu Kullan / Use This | Preset kartı | Seçilen preset ile **yeni** bir yapılandırma oluşturur ve aktif yapar; önceki yapılandırma pasifleşir. **Anında canlıya çıkar.** Toast: "Success — Header configuration created" / "Footer configuration created"; hata: "Error — <mesaj>". |
| Özelleştir / Customize | Preset kartı | Aktif yapılandırma yoksa "Bunu Kullan" gibi davranır; aktif kartta dialog'u kapatıp mevcut ayarlara döner. |
| Stili Değiştir / Change Style | Aktif Stil kartı | Preset galerisini dialog içinde açar. Footer dialog'unda kart tıklanınca dialog hemen kapanır. |
| Düzenle / Edit (satır) | Bölüm satırı | İlgili Sheet'i açar. |
| Menüyü Düzenle / Edit Menu | Header Menü satırı | `/design/navigation`'a gider. |
| Marka Ayarları / Brand Settings | Footer Logo satırı | `/branding`. |
| Taslağı Kaydet / Save Draft | Alt durum çubuğu | Yerel yapılandırmayı 3 sn debounce ile kaydeder (anında değil). Kaydediliyorken veya "yayınlanmış ve değişiklik yok" durumunda disabled. |
| Mağazaya Yayınla / Publish to Store | Alt durum çubuğu | 1) bekleyen otomatik kaydı iptal eder, 2) yerel yapılandırmayı hemen kaydeder (başarısızsa hata toast'u "Kaydetme başarısız / Save failed — Yayınlamadan önce değişiklikler kaydedilemedi." ve durur), 3) yayınlar. Başarı toast'u: "Published — Header changes are now live on your store" / "Footer changes are now live on your store"; hata: "Publish failed — <mesaj>". Disabled kuralı Taslağı Kaydet ile aynı. |
| Tekrar Dene / Retry | Hata ekranı | Sayfa verileri yüklenemezse görünür. |

Alt durum çubuğu metinleri (TR arayüzde de İngilizce görünür): "Published", "Saving..." (dönen ikon), "Draft saved", hata → "Could not save — check your connection" (bağlantı/zaman aşımı) veya "Could not save — check your changes" (geçersiz veri, yetki vb.). Çubuk `role="status" aria-live="polite"`.

Yayınlanmamış değişiklik varken sayfadan ayrılırken tarayıcı "sayfadan ayrıl" uyarısı verir — dialog'u ele almak gerekebilir.

Silme: header/footer yapılandırması bu ekrandan **silinemez**; ekranda silme aksiyonu yoktur.

## Yan etkiler
- Her kayıt bir versiyon kaydı oluşturur (son 10 tutulur); bu ekranda versiyon geçmişi / geri yükleme yoktur.
- Yayınlama, aynı kapsamdaki diğer yayınlanmış yapılandırmayı yayından alır; hedef yapılandırma yayında + aktif olur.
- Vitrine yansıma: değişiklik kaydedildikten sonra vitrinde **en geç ~30 dk** içinde görünür (arada CDN varsa daha uzun sürebilir).
- Canlı önizleme kaydedilmemiş yerel değişiklikleri anında gösterir; mağaza 10 sn içinde yanıt vermezse "Önizleme kullanılamıyor — mağazanın çalıştığından emin olun." mesajı çıkar.
- Vitrin davranışı: sticky açıkken header sayfa üstünde sabit kalır; şeffaf header yalnız hero (tam genişlik görsel) üstünde ve sayfa kaydırılmadan önce şeffaftır. Header veya footer yayında değilse "Coming Soon" sayfası görünür.

## Tuzaklar
1. **Değişiklikler otomatik olarak canlıya yazılır.** Her alan değişikliği ~3 sn sonra otomatik kaydedilir ve canlı yapılandırmayı günceller; "Mağazaya Yayınla"ya basmadan da vitrine yansır. Onay, değişikliği UI'da yapmadan **önce** alınmalı (CLAUDE.md kural 6). Ekranda "değişiklikleri at" butonu yoktur; onaysız yapılan değişiklik elle eski değerine döndürülmelidir.
2. **Preset "Bunu Kullan" yıkıcıdır**: yeni bir yapılandırma oluşturur, preset varsayılanlarıyla anında canlıya çıkar; mevcut özelleştirmeler (sütunlar, sosyal linkler vb.) yeni yapılandırmaya taşınmaz ve eski yapılandırma UI'dan geri seçilemez. Kullanıcı açıkça stil değişimi istemedikçe tıklamayın.
3. Footer'da bağlantılarının hepsi kategori sayfası (`/products/...`) olan bir sütun vitrinde gösterilmez; onun yerine navigasyon menüsünden üretilen otomatik "Kategoriler" sütunu görünür.
4. Footer görsel URL'leri (ETBİS, rozet/ödeme, uygulama rozetleri) mutlak `https://` olmalı; göreli yol (`/images/x.png`) kaydı `FOOTER_*_URL_INVALID` hatasıyla reddeder ve **tüm** otomatik kaydı durdurur.
5. Sheet'lerde Kaydet butonu yok; sheet'i kapatmak değişikliği iptal etmez. Değişiklik yerel duruma anında, sunucuya 3 sn debounce ile gider. Hızlı ardışık değişikliklerde sadece son durum gönderilir.
6. Footer'da Sosyal Medya / Ödeme / Kargo / Güven satırlarındaki Switch tıklanınca sheet açar. Kapatmak için öğeleri kaldırın veya "Görünür" switch'ini kapatın.
7. Footer Sütunlar/Yasal sheet'inde bir dil (Görünüm) seçiliyken ekleme/silme/URL alanları disabled'dır; yapısal değişiklik için "Varsayılan / Default" görünümüne dönün. Çeviriler seçili dil için ayrı saklanır.
8. Header logo/renkleri bu ekrandan değişmez → `/branding` (bkz. [branding.md](branding.md)). Menü öğeleri → `/design/navigation`.
9. Mağaza bulucu açık + URL boş ise vitrinde ikon görünmez; üst şerit açık ama içerik yoksa vitrinde hiçbir şey görünmez (UI kırmızı uyarı verir).
10. "Üst Çubuk Konumu = Başlık satırında" yalnızca Yerleşim Düzeni "Ortalanmış / Centered" iken seçilebilir ve etkilidir.
11. Mağaza görünümüne (store view) özel ayrı header/footer bu ekrandan yönetilmez; ekran store view seçicisi sunmaz ve aktif yapılandırmayı düzenler.
12. Toast'ların çoğu ve durum çubuğu metinleri TR arayüzde de İngilizce görünür ("Published", "Draft saved", "Success") — locator'ları buna göre yazın.
13. Bu ekranda cihaz (mobil/tablet/masaüstü) önizleme araç çubuğu, versiyon geçmişi ve logo yükleme yoktur.
14. İki footer kartının başlığı da "Özellikler / Features"; ilki bölümler, ikincisi düzen/renk/davranış.
15. Yayınlanmamış değişiklik sonrası sayfadan çıkarken tarayıcı onay dialog'u çıkabilir.

## Doğrulama
1. Admin'de: durum çubuğu metni "Draft saved" → yayınladıktan sonra "Published"; butonlar disabled olur. Network'te kayıt ve yayın istekleri 200 dönmeli.
2. Sayfayı **Yenile / Refresh** ile yeniden yükle; değiştirilen alanın yeni değerde kaldığını ve aktif stil kartının doğru olduğunu kontrol et.
3. Canlı önizlemede (mağaza URL'si varsa) değişiklik anında görünür (yerel durum).
4. Vitrin: `{STOREFRONT_URL}/{locale}` sayfasında header/footer değişikliği en geç ~30 dk içinde görünür; hızlı kontrol için public uç nokta `GET /layout/header/public/active` (veya `/layout/footer/public/active`, auth gerektirmez). Gecikme varsa kullanıcıya "kaydedildi, vitrin ≤30 dk içinde güncellenecek" bilgisini verin.
5. Header/footer'dan biri yayında değilse vitrin "Coming Soon" gösterir — preset seçiminden sonra ikisinin de var olduğunu doğrulayın.
