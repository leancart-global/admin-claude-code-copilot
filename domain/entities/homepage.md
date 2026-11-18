# Entity: Ana Sayfa (Homepage) — veri modeli ve yaşam döngüsü

Vitrin ana sayfası ayrı bir kayıt türü değildir: "ana sayfa" olarak işaretli **tek** CMS sayfasıdır.
Blok içerikleri (her blok tipinin alanları) → [homepage-components.md](homepage-components.md);
admin ekranı (butonlar, sekmeler, locator) → [../screens/design/homepage-builder.md](../screens/design/homepage-builder.md);
tasarım ekranları arası kaydet/yayın davranışı → [../screens/design/design-overview.md](../screens/design/design-overview.md).
Bu dosya yalnız **sistem yapısını** anlatır.

```
Ana sayfa (tenant başına 1, "ana sayfa" işaretli CMS sayfası, slug "homepage", durum)
 ├─ blok listesi  ─ blok {tip, içerik, stil ayarları, sıra, görünürlük}   ← birincil dil
 │                     └ tip "columns" → sütun başına iç blok listesi
 ├─ SEO {başlık, açıklama, anahtar kelimeler, kanonik URL, OG/Twitter, indeksleme, link takibi, odak anahtar kelime}
 ├─ şablon (galeriden seçilen düzen adı; "varsayılan" = seçilmemiş)
 ├─ çeviriler ─ {dil, durum (taslak|yayında), başlık, slug, SEO, blok listesi}  ← dil başına ayrı blok listesi
 ├─ kayıtlı taslak (yalnız yayındaki ana sayfada; bloklar, çeviriler, SEO, şablon, başlık için) ← canlıyı değiştirmez
 └─ sürüm geçmişi (son 5 yayın)
        │
vitrin ─► yayınlanmış ana sayfayı okur ─► ürün/kategori/paket blokları güncel katalogdan doldurulur
```

## Alanlar (ana sayfa için anlamlı olanlar)

| Alan | Varsayılan | Ana sayfa için kural / not |
|---|---|---|
| Ana sayfa işareti | kapalı | **Tenant başına en fazla 1** ana sayfa. Store view başına ayrı ana sayfa **yok**. |
| Başlık / slug | — (zorunlu) | Tasarımcı ilk oluşturmada başlık "Homepage", slug `homepage` kullanır. Slug tenant içinde benzersiz. Ana sayfanın vitrin adresi her zaman `/`. |
| Durum | taslak | Taslak / Yayında. Vitrin yalnız **yayındaki** ana sayfayı gösterir. |
| Yayın tarihi | — | Her yayınlamada güncellenir; yayından kaldırınca temizlenir. |
| Blok listesi | boş | Birincil dilin blokları (tipler ve alanlar: homepage-components.md). |
| SEO | boş | Başlık, açıklama, anahtar kelime, kanonik URL, OG/Twitter görsel ve metinleri, indeksleme/link takibi. |
| Çeviriler | boş | Dil başına blok listesi + SEO + **kendi durumu**. Dil = dil kodu (`tr`, `en`…). |

**Taslak ve sürümler.** Yayındaki ana sayfada "Kaydet" yeni içeriği **kayıtlı taslağa** yazar; canlı ana sayfa "Yayınla"
ya kadar değişmez. Sayfanın adresi, durumu, yayın tarihi gibi taslağa girmeyen alanlar doğrudan canlıya yazılır (tasarımcı
ekranı bunları değiştirmez). Her yayınlama bir **sürüm** saklar; **son 5 sürüm** tutulur, daha eskiler silinir. Bir sürüm
"geri yüklenince" canlı değil **taslak** olur (yeniden yayınlanana kadar vitrin değişmez). Admin'deki Geri Al/İleri Al yalnız
kaydedilmemiş düzenleme oturumu içindir. Cihaz varyantı (mobil/masaüstü ayrı blok) yok. Bu taslak/sürüm düzeni yalnız ana
sayfa kaydı içindir; diğer CMS sayfalarında taslak yoktur.

**Sayfa düzeni yetkisi.** Sayfanın şablonunu değiştirmek ve bir sayfayı ana sayfa yapmak/yapmamak `content:write`'a ek
olarak `design:write` ister (varsayılan rollerde Admin ve Süper Admin). Taslağın veya geri yüklenen sürümün şablonu
canlıdakinden farklıysa, yayınlamak/geri yüklemek de bu yetkiyi ister.

## Yaşam döngüsü

```
(kayıt yok) ──ilk Kaydet/Yayınla──► taslak ──Yayınla──► yayında ◄─┐
                                     ▲   Kaydet (sayfaya)  │  Kaydet → kayıtlı TASLAK (canlı aynı)
                                     └──── Yayından kaldır ◄┘  Yayınla → taslak canlıya + yeni sürüm
                                                              Sürüm geri yükle → taslak
çeviri durumu: taslak ──(o dil seçiliyken) Yayınla──► yayında (sayfa durumundan bağımsız; kayıtlı taslağı da yayınlar)
```

| Admin aksiyonu | Etki |
|---|---|
| İlk Kaydet/Yayınla (kayıt yok) | Yeni ana sayfa kaydı oluşur, durum taslak (Yayınla ile hemen yayında) |
| Kaydet (sayfa taslaktayken) | Bloklar, çeviriler, SEO ve şablon sayfaya kaydedilir; durum taslak kalır (vitrin zaten göstermez) |
| Kaydet (sayfa yayındayken) | Aynı içerik **kayıtlı taslağa** yazılır; **canlı ana sayfa değişmez**, rozet "Yayınlanmamış değişiklikler" |
| Yayınla (varsayılan dil) | Taslak sayfada: kaydeder ve yayınlar. Yayındaki sayfada: kayıtlı taslağı canlıya alır, yeni sürüm saklar, yayın tarihi güncellenir |
| Yayınla / Güncelle ve Yayınla (çeviri dili seçiliyken) | Bloklar kaydedilir, o çevirinin durumu yayında olur ve **sayfadaki kayıtlı tüm taslak değişikliği** de canlıya çıkar (ekran önce diyalogla sorar). **Sayfa taslaksa ana sayfa yine canlı değildir.** Bu yolda SEO kaydedilmez |
| Sürüm geri yükle | Seçilen sürüm taslak olur; canlı değişmez; ekrandaki kaydedilmemiş düzenleme yerini sürüme bırakır |
| Yayından kaldır | Durum taslağa döner → vitrin ana sayfası hata ekranına düşer (bu ekranda buton yok) |

Çeviri durumu yalnız o dilin yayınla/yayından kaldır işlemiyle değişir; yeni eklenen dil taslak başlar.
→ Yayınlanmış bir dilde ekran tek bir "Güncelle ve Yayınla" butonu sunar: dilin değişikliklerini kaydedip hemen canlıya
alır (taslak çalışma alanı yoktur).

### Ana sayfa devri (homepage takeover)
Bir CMS sayfasında Ayarlar sekmesindeki "Ana Sayfa Olarak Ayarla / Set as Homepage" switch'i açılıp kaydedilirse
o sayfa ana sayfa olur ve **mevcut ana sayfa sessizce sıradan sayfaya döner**. Sonuç: tasarımcı artık yeni sayfayı
yükler, eski ana sayfa `homepage` slug'ıyla sıradan sayfa olarak kalır.

## REST uçları

| Method | Yol | Yetki | Ne işe yarar |
|---|---|---|---|
| GET | `/cms/pages/homepage/admin` | `content:read` | Tasarımcının ana sayfayı yüklemesi (durumdan bağımsız; kayıtlı taslak varsa taslak içerik gösterilir; kayıt yoksa boş) |
| POST | `/cms/pages` | `content:write` | İlk oluşturma |
| GET | `/cms/pages/admin/slug/:slug` | `content:read` | Slug ile sayfa okuma |
| PUT | `/cms/pages/:id` | `content:write` (+ şablon/ana sayfa değişiminde `design:write`) | Kaydet (yayındaki ana sayfada taslağa) |
| PUT | `/cms/pages/:id/publish` · `/unpublish` | `content:write` | Yayınla (taslağı canlıya alır) / yayından kaldır |
| GET | `/cms/pages/:id/versions` · `/cms/pages/:id/versions/:versionId` | `content:read` | Yayınlanmış son 5 sürümü listele / bir sürümü oku |
| POST | `/cms/pages/:id/versions/:versionId/restore` | `content:write` | Sürümü taslak olarak geri yükle |
| PUT | `/cms/pages/:id/translations/:language/publish` · `/unpublish` | `content:write` | Çeviri yayınla / kaldır |
| DELETE | `/cms/pages/:id` | `content:delete` | Sayfa silme |
| GET | `/cms/pages/render/homepage?lang=` | Public | Vitrinin okuduğu yayınlanmış ana sayfa (ürün/kategori blokları doldurulmuş) |

## Kayıt kuralları

| Kural | Hata |
|---|---|
| Blok tipi tanımlı tiplerden biri olmalı | `CMS_VALIDATION_FAILED` |
| `features` bloğu uzunluk/öğe sınırları | `CONTENT_FEATURES_INVALID` ("Bir özellikler bloğunda kabul edilmeyen bir ayar var…") |
| `package-comparison`: kaynak seçimi zorunlu, Sütunlar içine konamaz | `CONTENT_PACKAGE_COMPARISON_INVALID` / `_SOURCE_REQUIRED` / `_TOP_LEVEL_ONLY` |
| `cookie-table` içeriği boş olmalı | `COOKIE_TABLE_CONTENT_NOT_EMPTY` |
| SEO OG / Twitter görseli geçerli URL veya kök-göreli yol olmalı | `CMS_PAGE_SEO_OG_IMAGE_URL_INVALID` / `..._TWITTER_IMAGE_URL_INVALID` |
| Çevirilerde dil, başlık ve slug zorunlu | doğrulama hatası |
| Slug benzersiz | 409 `CMS_PAGE_SLUG_EXISTS` |
| Ana slug + çeviri slug'ları başka sayfanın adresiyle çakışmaz | 409 `CMS_PAGE_ADDRESS_TAKEN` |
| Çeviri yayınlarken blok listesi boş olamaz | `CMS_TRANSLATION_EMPTY` |
| Sayfa bulunamadı | 404 `CMS_PAGE_NOT_FOUND` |
| Şablon/ana sayfa değişimi `design:write` olmadan | 403 `CMS_DESIGN_WRITE_REQUIRED` |
| Hikâye anlatımı bloğu: plan yok / 3 MB üstü / eksik alan | 403 / `ERR_CONTENT_STORYTELLING_TOO_HEAVY` / doğrulama — bkz. [../screens/design/storytelling-block.md](../screens/design/storytelling-block.md) |

## Storefront render zinciri

1. Vitrin ana sayfası her istekte güncel **yayınlanmış** ana sayfayı gösterir (kayıtlı taslak yalnız önizleme bağlantısıyla görülür); admin yayını blok yapısı/metin için
   en geç ~1-1.5 dk içinde yansır.
2. Dil seçimi: istenen dilin çevirisi **yayında ve bloklu** ise onun blokları + dolu başlık/SEO alanları
   (boş SEO alanları birincil dilden alınır, kanonik URL hariç); aksi halde birincil dil.
3. Ürün / kategori / paket karşılaştırma blokları güncel katalogdan doldurulur (Sütunlar içindekiler dahil). Bu
   blokların kaynak/adet/seçim değişikliği ve ürün/kategori verisi değişikliği (öne çıkan işareti, fiyat, stok)
   **en geç ~5 dk** içinde yansır. Doldurmada hata olursa blok boş kalır, sayfa yine açılır.
4. **Birincil öne çıkan ürün bloğu**: görünür bloklar sırayla dizildiğinde ilk `products` bloğunun kaynağı
   "öne çıkan" ise vitrinde sekmeli bölüm (Öne Çıkanlar / Yeni Gelenler / Çok Satanlar) olarak görünür; yalnız
   stoktaki ürünler, değişiklikler anında yansır.
5. **Header ilişkisi**: ilk görünür blok `carousel` ise header carousel'in üstüne bindirilir (şeffaf header) ve
   carousel sayfanın ana manşeti olur. Carousel'de slayt yoksa blok **hiç görünmez** ve header normal görünür.
6. `form` blokları seçilen yayınlanmış formu gösterir; form bulunamazsa blok görünmez.
   `storytelling` (hikâye anlatımı) bloğu ilk görünür blok ise vitrinde tam ekran sahne kahramanı olarak açılır; ayrıntı [../screens/design/storytelling-block.md](../screens/design/storytelling-block.md). Planda özellik yoksa blok vitrinde görünmez.
7. Yayınlanmış ana sayfa yoksa vitrin ana sayfası "No published homepage content was found…" hata ekranı gösterir
   (yedek içerik yok; header/footer da görünmez).
8. SEO'da indekslemeye / link takibine izin kapalıysa sayfa arama motorlarına noindex/nofollow bildirir.

## İlişkiler ve silinince ne olur

| Bağımlılık | Bağ şekli | Kaynak silinir/pasifleşirse |
|---|---|---|
| Ürün | `products` bloğunda seçilen ürünler, kaynak, kategori | Ürün gösterilmez; liste boşalırsa blok vitrinde **sessizce kaybolur** |
| Kategori | `categories` bloğunda seçilen kategoriler / kaynak; `products` bloğunun kategorisi | Aynı — sessiz kayıp |
| Medya | Bloklarda görsel adresi | Kırık görsel |
| Form | `form` bloğunda seçilen form | Form görünmez |
| Hedef sayfa/ürün linkleri | Bağlantı seçici değeri | Link bulunamayan sayfaya gider |
| Branding | Yalnız şablon uygulama anında renk kopyalanır | Sonradan marka değişse bloklardaki renkler **değişmez** |
| Store view | Dil seçici listesi | Store view'ın dili çeviri listesini belirler |
| Header/footer | Ayrı ayarlar (layout-settings) | Ana sayfa carousel'i header'ı şeffaf modda gösterir |

## Şablonlar ve hazır bölümler (veri seviyesinde)
Şablon ve hazır bölümler yalnız tasarımcı ekranındaki kısayollardır; ayrı bir kayıt olarak saklanmazlar.
- Şablonlar: uygulanınca düzenlenen blok listesi tamamen değiştirilir, boş renk alanlarına marka renkleri yazılır.
  Kaydedilene kadar hiçbir şey kalıcı değildir.
- Hazır bölümler: preset bloklarını listenin sonuna ekler.
İçerik listesi: [homepage-components.md](homepage-components.md#hazır-bölümler-ana-sayfa-bölüm-ekle--add-section-ve-şablonlar-ve-bölümler-sekmesi).

## Operatör için kritik davranışlar
- **Yayındaki ana sayfada "Kaydet" canlıyı değiştirmez**, kayıtlı taslağa yazar; canlıya çıkaran adım "Yayınla"dır.
  Onay (canlıya çıkacak değişikliklerin özeti) "Yayınla"dan önce alınır; "Kaydet" için de ayrı özet/onay gerekir.
  Yanlış yayın son 5 sürümden biri geri yüklenip yeniden yayınlanarak düzeltilebilir (geri yükleme taslak yapar, tekrar
  "Yayınla" gerekir).
- **Çeviri dilinde "Yayınla / Güncelle ve Yayınla" sayfanın durumunu değiştirmez ama kayıtlı tüm taslağı canlıya alır**;
  sayfa taslaksa önce varsayılan dilde yayınla.
- **Yayınlanmış çevirisi olan dil** birincil bloklara eklenen yeni bloğu görmez (kendi listesi var).
- **Tenant başına tek ana sayfa.** CMS sayfasında "Ana Sayfa Olarak Ayarla" switch'ine dokunmak mevcut ana sayfayı
  sessizce devirir → bu switch geri alınamaz/yan etkili işlem gibi ayrıca onaylanmalı.
- **Ana sayfa kaydı silinir veya yayından kaldırılırsa** (Sayfalar listesinden) vitrin ana sayfası tamamen hata
  ekranına düşer → bu işlemler geri alınamaz işlem olarak ayrıca onaylanır.
- Doğrulama gecikmeleri: blok yapısı/metin ~1-1.5 dk içinde; ürün/kategori bloğunun kaynak/adet/seçim değişikliği ve
  ürün/kategori verisi değişikliği en geç ~5 dk; sekmeli öne çıkanlar bölümü anında. Ürün bloğu boş görünüyorsa önce
  kaynağın (öne çıkan işareti, kategori ürünleri, stok) dolu olduğunu kontrol et — boş blok hata göstermez, gizlenir.
- Kaydettikten sonra vitrinde bloğu gözle doğrula.
- Kaydedilmemiş değişiklikler yalnız açık editördedir; sayfa yenilenir veya terk edilirse kaybolur. Kaydedilen taslak ise
  kalıcıdır ve sonraki açılışta yüklenir.
- **Önizleme:** "Müşteri gözüyle önizle", kayıtlı taslağı gerçek vitrinde (telefon/masaüstü çerçevesinde) gösterir;
  arama motorlarına kapalıdır, bağlantı 30 dk geçerlidir. Yayınlanmış hâl için vitrinin kendisine bakılır.
