# Entity: Header (Üst Bilgi) + Navigation (Ana Menü)

Vitrinin üst bölümü **iki ayrı kayıt** tarafından üretilir: görünüm/özellikler **Header yapılandırması**, menü ağacı
**Navigation (menü) yapılandırması**. İkisi de tenant başına tutulur ve birbirinden bağımsız düzenlenir/yayınlanır;
vitrin header'ı menüyü navigation kaydından okur.

- Ekranlar: [../screens/design/layout-settings.md](../screens/design/layout-settings.md),
  [../screens/design/navigation.md](../screens/design/navigation.md), genel: [../screens/design/design-overview.md](../screens/design/design-overview.md).

```
Header yapılandırması                            Navigation yapılandırması
├─ name, preset?                                 ├─ name, preset?
├─ isDefault, isActive, status(draft|published)  ├─ isDefault, isActive, status(draft|published)
├─ versiyon geçmişi (son 10)                     ├─ versiyon geçmişi (son 10)
├─ logo{url,alt,width,height,darkModeUrl}        └─ items[]: menü öğesi (iç içe)
│     └─ vitrinde BRANDING logosu öncelikli             ├─ id, type: link|dropdown|mega-menu
├─ navigation{position,mobileStyle,showOnMobile,        ├─ label, labelTranslations{lang}
│     showTriggerOnDesktop,triggerLabel(+Tr)}           ├─ url, linkType, resourceId, isExternal, openInNewTab
│     └─ yalnız menünün YERLEŞİMİ; öğeler ──────────────┤   (linkType=category → kategoriye canlı bağlı)
├─ search{isEnabled,style,placeholder(+Tr),…}           ├─ sortOrder, isVisible, icon, badge(+Tr), badgeVariant…
├─ account{isEnabled,style,label(+Tr),URL'ler,…}        ├─ mega: columnCount, featuredImage*, featuredImagePosition
├─ cart{isEnabled,style,showItemCount,…}                ├─ stil: fontWeight,fontSize,textColor,backgroundColor,…
├─ storeLocator{isEnabled,url,label(+Tr)}               └─ children[]: menü öğesi
├─ campaignBanners[] (duyuru çubuğu)
├─ topBar{isEnabled,placement,links[],iletişim,değiştiriciler,renkler}
└─ layout{type,isSticky,isTransparent,renkler,gölge,yükseklikler}

Vitrin: header + footer + navigation yayındaki kayıtlardan okunur.
  header veya footer yayında değil → "Coming Soon"; navigation yayında değil → header menüsüz görünür.
```

## Header alanları

| Alan | Tip | Varsayılan | Kural / not |
|---|---|---|---|
| `name` | string | — | zorunlu. Admin preset seçiminde `"<Preset Adı> Configuration"` |
| `preset` | string | — | Bilgi amaçlı (hangi preset'ten doğdu). Bilinen bir preset değilse admin galeride `custom` kartı aktif görünür |
| `isDefault` / `isActive` | bool | false / true | Bir kayıt aktif yapılınca aynı kapsamdaki diğerleri pasifleşir; `isDefault:true` → diğerlerinin varsayılanlığı düşer |
| `status` | `draft`\|`published` | **published** | Yalnız "Yayınla" değiştirir |
| `logo.url/alt` | string | '' | Genişlik 50–300, yükseklik 20–100 |
| `navigation.position` | `left\|center\|right` | left | Yerleşim düzeni `centered` iken yok sayılır |
| `navigation.mobileStyle` | `hamburger\|drawer\|bottom-nav` | hamburger | UI'da yok (preset ile gelir) |
| `navigation.showOnMobile` | bool | true | UI'da yok |
| `navigation.showTriggerOnDesktop`, `triggerLabel(+Translations)` | bool, string | false, '' | Menü (hamburger) düğmesi masaüstünde de görünür |
| `search.isEnabled/style` | bool, `icon\|input\|expandable` | true, icon | |
| `search.placeholder(+Translations)` | string | `"Search products..."` | Boşsa vitrinin varsayılan "ara" metni |
| `search.maxSuggestions` | number 1–10 | 5 | |
| `account.isEnabled/style` | bool, `icon\|text\|avatar` | true, icon | style UI'da yok |
| `account.label(+Tr)`, `accountUrl`, `loginUrl`, `registerUrl` | string | `Account`, `/account`, `/auth/signin`, `/auth/signup` | |
| `account.showWishlist`, `wishlistUrl` | bool, string | true, `/wishlist` | İstek listesi ikonunu kontrol eder |
| `cart.isEnabled`, `showItemCount` | bool | true, true | Sepet ikonuna tıklama sepet yan panelini açar |
| `cart.style`, `showSubtotal`, `checkoutUrl` | | icon, true, `/checkout` | style UI'da yok |
| `storeLocator{isEnabled,url,label(+Tr)}` | | false, '', `Store Locator` | `url` boşsa vitrinde ikon görünmez |
| `campaignBanners[]` | `{isEnabled,text(+Tr),linkUrl,linkText(+Tr),backgroundColor,textColor,isDismissible,expiresAt,sortOrder}` | [] | Vitrinde açık, süresi dolmamış ve metni boş olmayan **ilk** banner gösterilir. UI yalnız ilk banner'ı düzenler |
| `topBar` | `{isEnabled,placement:above\|inline,links[{label(+Tr),url,isExternal,openInNewTab,icon,sortOrder,isVisible}],contactPhone,contactEmail,showLanguageSwitcher,showCurrencySwitcher,backgroundColor,textColor}` | isEnabled false, placement above | `inline` yalnız yerleşim düzeni `centered` iken. Üst şerit yalnız geniş ekranda görünür; mobilde menü çekmecesine taşınır |
| `layout.type` | `standard\|centered` (UI) | standard | |
| `layout.isSticky` / `isTransparent` | bool | preset'e göre | Şeffaf header yalnız hero (tam genişlik görsel) olan sayfalarda ve sayfa kaydırılmadan önce uygulanır |
| `layout.backgroundColor/textColor/boxShadow/heightDesktop/heightMobile` | string | marka renkleri / tema değerleri | Serbest CSS değeri |

## Menü öğesi (NavigationItem) alanları

| Alan | Tip | Kural / not |
|---|---|---|
| `id` | string | zorunlu; admin yeni öğede otomatik üretir |
| `type` | `link\|dropdown\|mega-menu` | zorunlu |
| `label` | string | zorunlu |
| `labelTranslations`, `badgeTranslations` | `{[dilKodu]: string}` | Anahtar = store view dil kodu |
| `url` | string | `/` ile başlıyorsa vitrin dil önekini ekler |
| `linkType` | `product\|category\|page\|blog\|static\|external` | |
| `resourceId` | string | `linkType=category` için kategoriye canlı bağlıdır (aşağıda); ürün/sayfa/blog için **kaydedilen url** kullanılır |
| `isExternal`, `openInNewTab` | bool | false |
| `sortOrder`, `isVisible` | number, bool | 0, true. Vitrin her seviyede gizli öğeleri atlar, `sortOrder`'a göre sıralar |
| `children[]` | menü öğesi[] | Alt öğeler |
| `columnCount` | number (UI 2–5) | mega-menu sütun sayısı |
| `featuredImage` | URL | Mutlak URL olmalı → hata `NAVIGATION_FEATURED_IMAGE_URL_INVALID` |
| `featuredImageAlt`, `featuredImageUrl`, `featuredImagePosition` (`right\|left\|bottom`), `columnSpan` | | mega-menu |
| `badge`, `badgeVariant` (`new\|sale\|hot\|custom`), `badgeColor` | | |
| `fontWeight` (`normal\|medium\|semibold\|bold`), `fontSize`, `textColor`, `backgroundColor`, `textTransform` (`none\|uppercase\|lowercase\|capitalize`), `padding`, `margin`, `icon` | | Stil; serbest CSS değeri |

## Kardinalite, kimlik, durum
- Tenant başına birden çok header / navigation kaydı olabilir. Vitrinde kullanılan: önce **varsayılan + aktif + yayında** olan,
  yoksa herhangi bir **aktif + yayında** kayıt.
- Admin header ekranı aktif kaydı (yoksa varsayılanı) düzenler; navigation ekranı aktif menü kaydını (yoksa varsayılanı) düzenler.
- Preset "Bunu Kullan" her seferinde **yeni** header kaydı yaratır; öncekiler pasif kalır ve UI'dan geri seçilemez/silinemez.
- `status`: yalnız "Yayınla" ile `published` olur; yayınlama aynı kapsamdaki diğer yayınlanmış kaydı yayından alır.
- **Versiyon**: her kayıtta önceki hal versiyon geçmişine eklenir, en yeni 10 tutulur. Admin'de versiyon geçmişi / geri yükleme ekranı yok.

## Yaşam döngüsü ve admin aksiyonları

| Olay | Header | Navigation |
|---|---|---|
| İlk oluşturma | Preset kartı "Bunu Kullan" → yeni kayıt, preset değerleriyle; **anında canlı** | İlk "Kaydet" → "Main Navigation" adıyla varsayılan + aktif kayıt; **anında canlı** |
| Düzenleme | Alan değişikliği → ~3 sn sonra otomatik kayıt; kayıt yayında kalır → **canlı veri değişir** | "Kaydet" → kayıt taslağa döner → yayındaki menü vitrinden **kalkar** |
| Yayınla | kaydet + yayınla | (kaydedilmemiş değişiklik varsa kaydet) + yayınla |
| Yayından kaldırma | Ayrı aksiyon yok; yalnız başka kaydı yayınlayarak | Fiilen tek başına "Kaydet" = yayından kaldırma |
| Silme | UI'da yok; varsayılan kayıt silinemez | UI'da yok; varsayılan kayıt silinemez |

### Public API (okuma)
| Method | Path | Yetki | Not |
|---|---|---|---|
| GET | `/layout/{header\|navigation}/public/active?lang=` | public | Vitrinde yayındaki kayıt |
| GET | `/layout/{header\|navigation}/public/store-view/:storeViewId?lang=` | public | Store view'a özel kayıt yoksa aktif kayda düşer |
| GET | `/layout/{header\|navigation}/presets` | public | Preset kataloğu |

Admin işlemleri: okuma `content:read`; oluşturma / güncelleme / yayınlama / silme `content:write`.

## Validasyon
| Kural | Hata |
|---|---|
| Seçim alanları (layout.type, arama/hesap/sepet stili, menü konumu, üst şerit konumu, öğe tipi, rozet stili, linkType, …) yalnız tanımlı değerleri alır | 400 |
| logo genişlik 50–300, yükseklik 20–100; search.maxSuggestions 1–10 | 400 |
| Mega menü öne çıkan görseli tam URL olmalı | 400 `NAVIGATION_FEATURED_IMAGE_URL_INVALID` |
| Varsayılan kayıt silinemez | 409 CONFLICT |
| Kayıt/preset/versiyon yok | 404 NOT_FOUND |

## Preset'ler
- Header: `classic-commerce`, `minimal-boutique`, `mega-store`, `fashion-forward`, `quick-shop`,
  `custom` ("Luxury Clean Centered"). Hepsi sticky; ortalanmış düzen: minimal-boutique, custom; şeffaf hero: minimal-boutique,
  fashion-forward, custom; üst şerit açık: classic-commerce, mega-store.
- Preset yalnız logo boyutu, menü yerleşimi, arama/hesap/sepet ayarları, üst şerit (açık/kapalı + değiştiriciler) ve yerleşim
  (tip, sticky, şeffaf) değerlerini belirler; diğer alanlar varsayılanla başlar. UI'daki "Bunu Kullan" yeni kayıt yaratır.

## Vitrin davranışı
- Yansıma süresi: header değişikliği vitrinde **en geç ~30 dk** içinde, menü yayını **~3 dk** içinde (çoğunlukla hemen) görünür.
- Header **veya** footer yayında değilse tüm sayfalar "Coming Soon". Navigation yayında değilse header menüsüz görünür.
- Çeviri: vitrin dili için çeviri varsa o, yoksa taban metin gösterilir. Menü etiketinde öncelik: öğenin çevirisi → (kategori bağlıysa) kategori adının çevirisi → taban etiket.
- Kategori linkleri: menü öğesi kategoriye canlı bağlıdır. Kategori aktifse link kategorinin güncel URL'sine (`/products/<slug>`) gider;
  kategori arşivlenip yönlendirildiyse hedef kategoriye gider; kategori pasif / gizli / silinmişse öğe **alt öğeleriyle birlikte** menüden düşer.
- Ürün/sayfa/blog linkleri kaydedildiği andaki URL'yi kullanır: hedefin slug'ı değişir veya kayıt silinirse link güncellenmez.
- Logo: marka (branding) logosu varsa o gösterilir, yoksa header logosu.
- Gösterim derinliği: masaüstünde açılır menü **1** alt seviye, mega menü **2** seviye (sütun → linkler), mobil çekmece **3** seviye gösterir.
  Açılır/mega menü üst öğesi masaüstünde tıklanabilir link değildir (mega menüde sütun başlığı linktir).

## İlişkiler
| İlişki | Yön | Not |
|---|---|---|
| Kategori ([category.md](category.md)) | menü → kategori | Canlı bağlı; pasifleştirme/silme menüden düşürür |
| Ürün, CMS sayfası, blog | menü → url | Kaydedilen URL; hedef değişirse güncellenmez |
| Branding ([../screens/design/branding.md](../screens/design/branding.md)) | header ← logo, renkler | |
| Store view | çeviri anahtarları (dil kodu) | |
| Medya | logo, mega menü öne çıkan görseli | |
| Footer ([footer.md](footer.md)) | kardeş kayıt | İkisi de yayında olmalı, yoksa Coming Soon |

## Operatör için kritik davranışlar
1. Header'da her alan değişikliği ~3 sn içinde **canlı** kayda yazılır; onayı alana dokunmadan önce al.
2. Navigation'da tek başına "Kaydet" menüyü yayından kaldırır (kısa süre sonra vitrinde menü boş görünür). Her zaman Kaydet+Yayınla tek onayda.
3. İlk navigation kaydı ve preset "Bunu Kullan" (header) **anında yayına** çıkar — "önce taslak" yok.
4. Kategori pasifleştirmek/gizlemek o menü öğesini **alt öğeleriyle** vitrinden kaldırır; kategori ağacı işlemlerinden önce uyar.
5. Admin 3+ seviye iç içe menüye izin verir ama masaüstü açılır menü yalnız 1 alt seviye gösterir → hiyerarşi için mega menü (sütun → link) kullan.
6. Doğrulama süresi: header ≤30 dk; menü ≤3 dk. Hızlı kontrol için public uç noktayı oku.
7. İstek listesi ikonu `account.showWishlist` ile açılıp kapanır ("İstek Listesini Göster").
8. Ürün/sayfa/blog slug'ı değişirse veya kayıt silinirse ilgili menü linklerini kontrol et/güncelle.
