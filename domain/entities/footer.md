# Entity: Footer Config (Alt Bilgi Yapılandırması)

Vitrinin tüm sayfalarında görünen alt bilgi. Tek bir kayıt: sütunlar + linkler, sosyal, bülten, iletişim anahtarı,
rozet listeleri, yasal/telif + çerez linki, uygulama indirme, ETBİS, düzen/renk. Header'ın ikizidir
(aynı preset / yayın / versiyon mekanizması — ortak kavramlar için [header.md](header.md)). Ekran, locator ve otomatik kayıt
davranışı: [../screens/design/layout-settings.md](../screens/design/layout-settings.md) (burada tekrar edilmez).

```
Footer yapılandırması (name, preset?, isDefault, isActive, status draft|published, versiyon)
├── logo {isEnabled, width, height}                                       ← görsel BRANDING'den gelir
├── etbis {isEnabled=false, imageUrl?, linkUrl?, alt?}                     ← logonun altında
├── sections[]  {title, titleTranslations{lang}, sortOrder, isVisible, columnSpan}
│   └── links[] {label, labelTranslations{lang}, url, isExternal, openInNewTab, icon?, sortOrder, isVisible}
├── socialMedia[] {platform, url, icon?, sortOrder, isVisible}
├── newsletter {isEnabled, title, description, placeholder, buttonText, showPrivacyNotice, privacyNotice, çeviriler}
├── contact {isEnabled, workingHours?, showMap, mapEmbedUrl?}       ← adres/tel/e-posta BURADA DEĞİL (Ayarlar > Genel)
├── paymentMethods[] {name, icon?, imageUrl?, sortOrder, isVisible}
├── shippingBadges[] / trustBadges[] {name, icon?, imageUrl?, linkUrl?, sortOrder, isVisible}
├── legal {isEnabled, links[], copyrightText, copyrightTextTranslations, showCurrentYear,
│          cookieSettings? {isEnabled?, sortOrder?, label?, labelTranslations?}}
├── appDownload {isEnabled=false, title, titleTranslations, appStoreUrl/Image, playStoreUrl/Image, qrCodeImage}
└── layout {backgroundColor, textColor, borderColor, linkColor?, columnCount, showDividers, containerWidth,
            showScrollToTop, showLanguageSwitcher}
```

## Alanlar

### Kök
| Alan | Tip | Varsayılan | Kural / not |
|---|---|---|---|
| `name` | string | — (zorunlu) | Admin preset seçince `"<Preset Adı> Configuration"`. |
| `preset` | string? | yok | Bilgi amaçlı; UI'da "aktif kart" seçimi. Bilinen bir preset değilse admin `custom` kartını aktif gösterir. |
| `isDefault` | bool | false | `true` yapılınca diğer footer'larda false olur. Varsayılan footer **silinemez** (409). |
| `isActive` | bool | true | Bir kayıt aktif yapılınca aynı kapsamdaki diğerleri pasifleşir. |
| `status` | `draft`\|`published` | **`published`** | Yalnız "Yayınla" değiştirir. Vitrin yalnız yayındaki kaydı gösterir. |

### Alt nesneler
| Yol | Varsayılan | Kural | Vitrinde |
|---|---|---|---|
| `logo.*` | açık, 120×40 | genişlik 50–200, yükseklik 20–80 | Logo görseli **her zaman marka (branding) logosudur**. Marka logosu yoksa footer'da logo görünmez. |
| `etbis.imageUrl` / `linkUrl` | — | mutlak `https://` URL → aksi halde `FOOTER_ETBIS_IMAGE_URL_INVALID` / `FOOTER_ETBIS_LINK_URL_INVALID` | Açık ve görsel doluysa logonun altında görünür; link varsa yeni sekmede açılır. Alt metin boşsa varsayılan "ETBİS" metni. |
| `sections[].columnSpan` | admin yeni sütunda 1 | UI 1–3 | |
| `sections[].links[].url` | "" | serbest metin | Güvensiz bağlantılar (`javascript:` vb.) gösterilmez; aynı mağazaya ait tam URL göreli linke çevrilir; iç linke dil öneki eklenir. |
| `socialMedia[].platform` | `other` | facebook, instagram, twitter, youtube, tiktok, linkedin, pinterest, whatsapp, telegram, other | İkon platforma göre; her zaman yeni sekmede açılır. Başlık "Bizi takip edin". |
| `newsletter.*` | preset'e göre | — | Açıksa abonelik formu görünür. |
| `contact` | preset'e göre | — | Açıksa adres/telefon/e-posta **Ayarlar > Genel**'deki mağaza iletişim bilgisinden gösterilir; adres Google Maps arama linki olur. |
| `paymentMethods[]`, `shippingBadges[]`, `trustBadges[]` | [] | `imageUrl` mutlak URL olmalı → `FOOTER_PAYMENT_METHOD_IMAGE_URL_INVALID` / `FOOTER_BADGE_IMAGE_URL_INVALID`. Ödeme yönteminde bağlantı alanı yok. | |
| `appDownload.*` | kapalı | görsel alanları mutlak URL → `FOOTER_APP_STORE_IMAGE_URL_INVALID`, `FOOTER_PLAY_STORE_IMAGE_URL_INVALID`, `FOOTER_QR_CODE_IMAGE_URL_INVALID`; mağaza linkleri serbest metin | |
| `legal.copyrightText` | `© {year} {storeName}. All rights reserved.` + TR çevirisi `© {year} {storeName}. Tüm hakları saklıdır.` | — | Boşsa telif satırı görünmez. `{year}` yıl ile, `{storeName}` / `{tenantName}` **marka adı** (Marka Ayarları > Marka Adı) ile değiştirilir. |
| `legal.cookieSettings` | tanımsız | isEnabled/sortOrder/label opsiyonel | Tanımsız veya açıksa platformun `/cookie-settings` linki yasal satıra eklenir; sıra verilmemişse en sona. Aynı hedefe mağazanın kendi linki (yasal veya sütunlarda) varsa platform linki **eklenmez**. Etiket yoksa varsayılan "Çerez ayarları". |
| `layout.backgroundColor` / `textColor` / `borderColor` | tema renkleri | serbest metin | Footer renkleri. `linkColor` (UI'da yok) link rengi. |
| `layout.columnCount` | 4 | UI 3–6 | |
| `layout.showScrollToTop`, `showLanguageSwitcher` | kapalı | — | "Yukarı kaydır" düğmesi ve dil değiştirici. |

### Çeviri (translations)
- Çeviriler **dil kodu** anahtarlıdır (`en`, `tr`…). Taban alan (`title`, `label`…) = tenant'ın birincil dili (varsayılan store view'ın dili).
- Vitrin, dil için çeviri varsa onu, yoksa taban metni gösterir.
- Çevrilebilen alanlar: sütun başlığı, link etiketi (sütun + yasal), bülten metinleri, uygulama indirme başlığı, telif, çerez link etiketi.
  Sosyal/rozet/ETBİS alt metni çevrilmez.

## Kimlik, kardinalite, durum
- Tenant başına **birden çok** footer kaydı olabilir (her preset seçimi yeni kayıt).
- Vitrinde kullanılan: önce varsayılan + aktif + yayında olan, yoksa ilk aktif + yayında kayıt. Store view'a özel kayıt yoksa bu kayda düşer.
- Yayınlama aynı kapsamdaki diğer yayınlanmış kaydı taslağa çeker, hedefi yayında + aktif yapar.
- **Taslak aşaması yok**: oluşturulan kayıt yayında başlar ve her otomatik kayıt canlı kaydı günceller. Ayrıntı: layout-settings.md Tuzak 1.
- Versiyonlar: her kayıtta önceki hal versiyon geçmişine eklenir, en yeni 10 tutulur. Admin'de versiyon geçmişi / geri yükleme ekranı yok.

## Yaşam döngüsü ve API

### Public API (okuma)
| Method | Path | Yetki | Not |
|---|---|---|---|
| GET | `/layout/footer/public/active?lang=` | public | Yayındaki footer; yoksa `data:null` |
| GET | `/layout/footer/public/store-view/:storeViewId?lang=` | public | Store view'a özel kayıt yoksa aktif kayda düşer |
| GET | `/layout/footer/presets`, `/layout/footer/presets/:name` | public | Preset kataloğu; bilinmeyen ad 404 |

Admin işlemleri: okuma `content:read`; oluşturma / güncelleme / yayınlama / silme `content:write`. Admin'de silme ve versiyon geri yükleme ekranı yoktur.

### Validasyon ve hatalar
| Kural | Hata |
|---|---|
| URL alanları (ETBİS, rozet/ödeme görseli, uygulama görselleri) mutlak `https://` olmalı | 400 `FOOTER_*_URL_INVALID` |
| `logo` boyutları, `columnSpan`, `columnCount` aralıkları | 400 |
| `socialMedia.platform` yalnız listedeki değerler | 400 |
| Kayıt / preset / versiyon yok | 404 `NOT_FOUND` |
| Varsayılan footer silme | 409 `CONFLICT` |

## Preset'ler
- `full-featured`, `simple-clean`, `contact-focused`, `social-first`, `trust-builder`, `custom` ("Boutique Complete").
  Tüm preset sütun/link başlıklarının Türkçe çevirisi vardır.
- Preset logo, ETBİS, bülten, iletişim, yasal, uygulama indirme, düzen ayarlarını ve varsayılan sütunları belirler.
  Preset yasal link içermez → yalnız platformun çerez linki görünür.
- Admin preset seçimi = **yeni kayıt** → anında canlı; önceki kayıt pasif kalır, verisi taşınmaz.
- Preset sütunları örnek linklerle gelir (`/new-arrivals`, `/sale`, `/careers`, `/press`, `/faq`, `/track-order`, örnek telefon…);
  mağazada karşılığı olmayanları düzenleyin veya kaldırın.

## Vitrin davranışı
- Yansıma süresi: footer değişikliği vitrinde **en geç ~30 dk** içinde görünür (CDN varsa daha uzun). Mağaza iletişim bilgisi değişikliği ~5 dk içinde.
- Header **veya** footer yayında değilse tüm sayfalar "Coming Soon".
- Linkler **URL olarak** saklanır; bağlantı seçici `/pages/<slug>`, `/products/<kategori-slug>`, `/product/<slug>`, `/blog/<slug>` üretir.
  Hedef silinir veya slug değişirse link güncellenmez.
- **Kategori sütunu kuralı**: tüm linkleri `/products/` ile başlayan bir sütun vitrinde **gösterilmez**; yerine navigasyon
  menüsündeki görünür kategori öğelerinden üretilen otomatik "Kategoriler" sütunu görünür.
- Sütun sırası: logo/ETBİS/sosyal/iletişim hücresi (1), **son** görünür sütun (2), kategori sütunu (3), diğer sütunlar (4+).
- Yasal gereklilikler: ETBİS damgası (`etbis`), KVKK/gizlilik/mesafeli satış vb. linkleri yasal bağlantılara veya sütunlara **elle** eklenir
  (otomatik link yok); çerez tercihleri linki platform tarafından otomatik eklenir (kapatılabilir). İletişim bilgisi Ayarlar > Genel'den.

## İlişkiler / bağımlılıklar
| Bağımlılık | Yön | Not |
|---|---|---|
| Branding ([../screens/design/branding.md](../screens/design/branding.md)) | footer ← | Logo görseli + telifteki `{storeName}` = marka adı. Marka yoksa logo yok, telifte marka adı boş kalır. |
| Mağaza ayarları / Ayarlar > Genel | footer ← | İletişim adres/telefon/e-posta; ayrıca admin önizlemesi için mağaza URL'si. |
| Navigation ([../screens/design/navigation.md](../screens/design/navigation.md)) | footer ← | Otomatik kategori sütunu navigasyonun kategori öğelerinden. |
| Header ([header.md](header.md)) | eş | İkisi de yayında olmalı, yoksa Coming Soon. |
| CMS sayfaları (yasal) | footer → | `/pages/<slug>` linkleri; önce sayfa yayınlanmalı. Çerez sayfası `/cookie-settings` platform sayfasıdır. |
| Medya kütüphanesi | footer → | Yalnız ETBİS görseli medya seçiciyle; diğer görseller elle mutlak URL. |
| Store views | footer ← | Dil listesi çeviri editörü için. Store view'a özel footer admin ekranından yönetilmez. |
| Bülten | — | Footer abonelik formunu gösterir. |

## Operatör için kritik davranışlar
1. Footer ekranında her alan değişikliği ~3 sn sonra **canlı kayda** yazılır (taslak yok). Onayı alana dokunmadan önce al (CLAUDE.md kural 6).
2. Preset seçmek yeni footer yaratıp anında yayınlar ve tüm sütun/sosyal/yasal özelleştirmelerini bırakır (önceki kayıt pasif kalır,
   UI'dan geri dönülemez).
3. Rozet/ödeme/uygulama/ETBİS görsel URL'leri `https://…` olmalı; göreli yol (`/images/x.png`) hata verir ve **tüm** kaydı bloke eder.
4. Bir sütunun tüm linkleri kategori (`/products/...`) ise vitrin o sütunu göstermez; kategori listesi navigasyondan gelir. Kategori
   linklerini footer'a eklemek yerine navigasyona ekle ya da sütuna kategori olmayan en az bir link koy.
5. Linkler slug bazlıdır; sayfa/kategori slug'ı değişir veya silinirse footer linkini güncelle — işlem sonrası footer linklerini kontrol et.
6. Adres/telefon/e-posta footer'da değil Ayarlar > Genel'de değişir; footer'da yalnız "İletişim Bilgileri" anahtarı var.
7. Logo footer'dan değişmez (branding). Telif metnindeki `{storeName}` marka adıyla dolar.
8. Çerez ayarları linki varsayılan **açık** ve en sonda; KVKK/gizlilik linkleri otomatik gelmez, yasal sheet'ten eklenmeli.
9. Doğrulama: `GET /layout/footer/public/active` (auth'suz) kaydı hemen gösterir; vitrin 30 dk'ya kadar eski footer'ı gösterebilir.
10. Silme ve versiyon geri yükleme admin ekranında yok; gerekiyorsa API kullanımı CLAUDE.md kural 3'e aykırı → kullanıcıya bildir.
