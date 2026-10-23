# Yeni Ürün Oluştur (tip seçimi + çok sekmeli ürün formu)
- URL: {ADMIN_URL}/products/new — URL'de locale yok; arayüz dili header'daki dil seçiciden gelir (varsayılan `en`).
- Amaç: 8 ürün tipinden birini seçip (Basit, Varyantlı, Paket, Sanal, İndirilebilir, Hediye Kartı, Abonelik, Gruplu) ürünü sekmeli formla oluşturmak. Varyantlı üründe varyantlar ürün oluşturulduktan hemen sonra ayrıca kaydedilir.
- Yetki (permission):
  - Menü öğesi `products:read` ile görünür.
  - Kaydetmek için `products:write` gerekir. Yetkisizse kayıt reddedilir → hata toast'ı.
- Ekranın kullandığı veriler:
  - **Ön koşul kontrolü**: aktif store view'lar, kategori ağacı, attribute set'ler, aktif para birimleri.
  - **Form referans verisi**: store view'lar, aktif para birimleri, müşteri grupları, aktif vergi sınıfları, attribute set listesi, depolar, tenant varsayılan fiyat para birimi.
  - Sekme içi yüklemeler: seçilen attribute set'in attribute'ları; kategori ağacı; SKU girildiğinde o SKU'nun stoğunun bulunduğu depo (tahmin); ilişki/paket/grup ürün araması (ad/SKU); medya kütüphanesi listesi ve dosya yükleme.
  - **Kaydet**:
    1. Ürün kaydı oluşturulur — alan eşlemesi aşağıda.
    2. Yalnızca formda varyant varsa: varyantlar toplu ve atomik olarak kaydedilir.
  - Gönderilen alanlar (form → API): `name`, `sku`, `description` (boşsa `name` kopyalanır), `shortDescription`, `type`, `status`, `visibility`, `price`←`basePrice`, `currency`, `compareAtPrice`, `costPrice`←`cost`, `taxClassId`←`taxClass`, `specialPrice`, `specialPriceFrom/To`←`specialPriceStart/End`, `tierPrices[]`, `quantity`←`qty` (varyantlıda 0), `warehouseId` (varyantlıda ürün kaydına gitmez), `trackInventory`, `allowBackorder`, `lowStockThreshold`, `weight` + `dimensions{weight,weightUnit,length,width,height,unit}`, `isShippable`←`requiresShipping`, `freeShipping`, `shippingClass`, `categoryIds`, `tags`, `media[]{url,type,alt,title,isMain,sortOrder,variantAttributes}`, `seo{title,description,keywords[],focusKeyword,canonicalUrl,og*,twitter*,indexable,followable}`, `isFeatured`, `isNewProduct`←`isNew`, `isBestseller`, `allowReviews`, `giftMessageAvailable`, `canBeGiftWrapped`, `isReturnable`, `isComparable`, `attributes`←`customAttributes`, `attributeSetId`, `relations[]{type:'related'|'up_sell'|'cross_sell',productId,sortOrder}`, tip-özel: `configurableAttributes`, `bundleConfig`, `subscriptionPlan`, `downloadableFiles`, hediye kartı tutar ayarları, gruplu ürün öğeleri. Çeviriler create'te kaydedilmez.

## Ön koşullar ve bağımlılıklar
Sayfa açıldığında ön koşul kartı eksik olanları listeler; **hepsi tamam olmadan tip seçimi ve form hiç gösterilmez**. Başlık: "Ürün Eklemeden Önce Kurulumu Tamamlayın / Complete Setup Before Adding Products".

| Ön koşul (zorunlu, sayfa açılışı) | Kart etiketi tr / en | Oluşturan ekran (kartın "Oluştur / Create" butonu) |
|---|---|---|
| ≥1 aktif store view | Mağaza Görünümleri / Store Views | `/settings/store-views` → ../settings/store-views.md |
| ≥1 kategori | Kategoriler / Categories | `/categories/new` → ../categories/category-create.md |
| ≥1 attribute set | Özellik Setleri / Attribute Sets | `/attributes/sets/new` → ../attributes/attribute-set-create.md |
| ≥1 aktif para birimi | Aktif Para Birimleri / Active Currencies | `/settings/currencies` → ../settings/currencies.md |

Kayıt sırasında ihtiyaç duyulanlar (formda seçilir, yoksa önce oluşturulmalı):
- **Kategori** (yayınlamak için ≥1 şart) → ../categories/category-create.md
- **Attribute set** (formda yayın için zorunlu) + içindeki **attribute'lar** (set'te zorunlu işaretli olanlar taslakta bile zorunlu) → ../attributes/attribute-set-create.md, ../attributes/attribute-create.md
- **Depo** — stok > 0 girilecekse. Tek depo varsa otomatik seçilir. Basit üründe depo boşsa tenant varsayılan deposu kullanılır; varsayılan depo yoksa kayıt `WAREHOUSE_NOT_CONFIGURED` ile reddedilir. Varyant stoğu için depo **zorunlu** (kayıttan önce form engeller). Varsayılan depo = "Varsayılan Depo" işaretli **ve Aktif** depo; yeni depo, ilk depo olsa bile otomatik varsayılan olmaz. → `/inventory/warehouses/new` [../inventory/warehouses.md](../inventory/warehouses.md), kurulum: [../../../playbooks/warehouse-setup.md](../../../playbooks/warehouse-setup.md). Formdaki miktar seçili depodaki stok kaydını yazar (yoksa açar); ikinci depoya stok için [../inventory/stock.md](../inventory/stock.md) "Depoya Ekle".
- **Vergi sınıfı** (opsiyonel; boşsa tenant varsayılan vergi sınıfı atanır) → `/settings/tax-classes` ../settings/tax-classes.md
- **Müşteri grubu** (yalnızca kademe fiyatta grup seçilecekse; boş = tüm gruplar) → `/customers/groups` ../customers/customer-groups.md
- **Tenant varsayılan fiyat para birimi** — formda para birimi boş kalırsa bu kullanılır; o da yoksa kayıt `TENANT_PRICING_CURRENCY_NOT_CONFIGURED` ile reddedilir.
- **Marka**: Ürün formunda marka alanı henüz yok (geliştiriliyor). Kullanıcı marka isterse bunu söyle; geçici yol önerme. Marka kaydı: ../brands/brand-create.md
- **Medya**: dosyayı kullanıcı vermeli (yol) veya medya kütüphanesinde mevcut olmalı → ../content/media-library.md
- İlişkili/paket/grup ürünler önceden var olmalı (arama ile seçilir).

## Yerleşim
**Adım 1 — Tip seçimi**: Sayfa başlığı "Yeni Ürün Oluştur / Create New Product". Kart "Ürün Tipi Seç / Select Product Type":
- Select `#product-type` (Label "Ürün Tipi / Product Type", placeholder "Bir ürün tipi seçin... / Choose a product type...") **veya**
- 8 kartlık ızgara (her biri buton; başlık + açıklama). Tıklamak tipi seçer ve formu açar. Tip URL'de tutulmaz; sayfa yenilenirse tip seçimine döner.

| value | tr | en |
|---|---|---|
| `simple` | Basit — Varyasyonu olmayan bağımsız ürün | Simple — A standalone product with no variations |
| `configurable` | Varyantlı — Varyantlı ürün (örn. beden, renk) | Configurable — Product with variants (e.g., size, color) |
| `bundle` | Paket | Bundle |
| `virtual` | Sanal — Fiziksel olmayan ürün (kargo yok) | Virtual |
| `downloadable` | İndirilebilir | Downloadable |
| `gift_card` | Hediye Kartı | Gift Card |
| `subscription` | Abonelik | Subscription |
| `grouped` | Gruplu | Grouped |

**Adım 2 — Form**: Sayfa başlığı "{tip} …", sağda "Tipi Değiştir / Change Type" (ghost buton; tipi sıfırlar, **form verisi kaybolur**).
- Sekme şeridi (role=tab). Sıra ve koşullar:

| # | Tab value | tr / en | Görünür |
|---|---|---|---|
| 1 | `basic` | Temel Bilgiler / Basic Info | her zaman |
| 2 | `seo` | SEO / SEO | her zaman |
| 3 | `pricing` | Fiyatlandırma / Pricing | her zaman |
| 4 | `inventory` | Stok / Inventory | virtual, downloadable, gift_card, grouped **hariç** |
| 5 | `media` | Medya / Media | her zaman |
| 6 | `identification` | Kimlik / Identification | her zaman |
| 7 | `custom-attributes` | Özel Nitelikler / Custom Attributes | her zaman |
| 8 | `relationships` | İlişkiler / Relationships | her zaman |
| – | `labels`, `options`, `scheduling` | Etiketler, Özel Seçenekler, Zamanlama | **yalnızca edit** (bkz. ./product-edit.md) |
| 9 | `variants` | Varyantlar / Variants | yalnızca configurable |
| 9 | `bundle` | Paket Öğeleri / Bundle Items | yalnızca bundle |
| 9 | `downloadable` | Dosyalar / Files | yalnızca downloadable |
| 9 | `virtual` | Sanal / Virtual | yalnızca virtual (salt bilgi; alan yok) |
| 9 | `giftcard` | Hediye Kartı / Gift Card | yalnızca gift_card |
| 9 | `subscription` | Abonelik / Subscription | yalnızca subscription |
| 9 | `grouped` | Gruplanmış Ürünler / Grouped Products | yalnızca grouped |

- Sekme değiştirince girilen değerler kaybolmaz; ama gizli sekmedeki alanlar snapshot'ta görünmeyebilir — önce sekmeye tıkla.
- Kaydetme denemesinden sonra sekme tetikleyicilerinde kırmızı hata sayısı rozeti.
- Alt kısımda yapışkan footer: solda "Kaydedilmemiş değişiklikleriniz var / You have unsaved changes" ve (status=published ise) "Düzeltilecek N hata var / N errors to fix"; sağda "İptal / Cancel" ve submit "Ürün Oluştur / Create Product" (kaydederken "Kaydediliyor... / Saving...").
- status=published iken kayıt denemesi başarısızsa footer üstünde hata özeti kutusu ("Please fix N errors before publishing"), her satır ilgili sekmeye götüren buton.
- Store view (çeviri) çubuğu create'te **görünmez**. Çeviri yalnızca ./product-edit.md'de girilir.

## Alanlar
Kontrol tipleri: "Select" = açılır seçim (tetikleyici `button[role=combobox]` → `role=listbox` içinde `role=option`), native select değil. "Checkbox" = `button[role=checkbox]`. Çoğu alanda `getByLabel` çalışır. Zorunlu yıldız `*` label metnine eklenir ("Ürün Adı *").

### Tab: Temel Bilgiler (`basic`)
| Bölüm | Label (tr / en) | Form key | Kontrol | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Temel Bilgiler / Basic Information | Ürün Adı / Product Name | `name` | text | Evet (taslakta da) | 3–200 karakter | `getByLabel('Ürün Adı')`, placeholder "Ürün adını girin / Enter product name" | |
| 〃 | Stok Kodu (SKU) / SKU | `sku` | text | Evet (taslakta da) | 2–50 karakter, **tenant içinde benzersiz** (çakışmada "Product with this SKU already exists") | placeholder "ör. URUN-001 / e.g., PROD-001" | Varyant SKU'ları buradan türetilir |
| 〃 | Kısa Açıklama / Short Description | `shortDescription` | textarea | Hayır | ≤500 | placeholder "Kısa ürün açıklaması" | |
| 〃 | Tam Açıklama / Full Description | `description` | textarea (düz metin, rich-text DEĞİL) | Hayır | doluysa **min 10** karakter; boşsa ürün adı açıklama olarak kaydedilir | placeholder "Detaylı ürün açıklaması" | HTML editörü yok |
| Durum ve Görünürlük / Status & Visibility | Durum / Status | `status` | Select | – | varsayılan `draft`. Seçenekler: Taslak/Draft `draft`, Yayında/Published `published`, Arşivlendi/Archived `archived`, Stok Tükendi/Out of Stock `out_of_stock`, Üretimden Kalktı/Discontinued `discontinued` | placeholder "Durum seçin" | Yeni ürün yalnızca Taslak, Yayında veya Arşivlendi durumuyla oluşturulur |
| 〃 | Görünürlük / Visibility | `visibility` | Select | – | varsayılan `visible_everywhere`. Her Yerde Görünür/Visible Everywhere, Sadece Katalog/Catalog Only `catalog`, Sadece Arama/Search Only `search`, Görünmez/Not Visible `not_visible` | | |
| 〃 | Öne Çıkan Ürün / Featured Product | `isFeatured` | checkbox | – | false | `getByRole('checkbox',{name:'Öne Çıkan Ürün'})` | |
| 〃 | Yeni Ürün / New Arrival | `isNew` | checkbox | – | false | | API: `isNewProduct` |
| 〃 | Çok Satan / Best Seller | `isBestseller` | checkbox | – | false | | |
| Mağaza Davranışları / Store Behaviors | Hediye Mesajı / Gift Message | `giftMessageAvailable` | checkbox | – | false | | |
| 〃 | Hediye Paketi / Gift Wrap | `canBeGiftWrapped` | checkbox | – | false | | |
| 〃 | İade Edilebilir / Returnable | `isReturnable` | checkbox | – | true | | |
| 〃 | Karşılaştırma / Comparison | `isComparable` | checkbox | – | true | | |
| 〃 | Değerlendirmeler / Reviews | `allowReviews` | checkbox | – | true | | |
| Kategoriler ve Etiketler / Categories & Tags | Kategoriler * / Categories * | `categoryIds` | ağaç + checkbox | Yayın için Evet (taslakta hayır) | en az 1 kategori | Kart "Kategori Seç / Select Categories"; arama input placeholder "Kategori ara... / Search categories..."; ağaç `role=tree` (aria-label "Kategori ağacı"); düğüm `role=treeitem` aria-label=kategori adı; seçim checkbox aria-label **"Select {ad}"**; aç/kapa butonu aria-label "Expand"/"Collapse"; seçilenler üstte chip ("Remove {ad}"), "Tümünü Temizle / Clear All" | Alt kategoriler varsayılan kapalı; arama filtreler ama **açmaz** |
| 〃 | Etiketler / Tags | `tags` | text (virgülle ayrılmış) | Hayır | her değişimde virgülden bölünüp kırpılır | placeholder "Etiketleri girin (virgülle ayırın)" | Bkz. Tuzaklar (tek seferde `fill`) |

Varsayılan scope'ta **slug (URL) alanı yok**; slug addan otomatik üretilir ve benzersizleştirilir. Ağırlık/boyut/kargo alanları **Stok** sekmesindedir.

### Tab: SEO (`seo`)
| Bölüm | Label (tr / en) | Form key | Kontrol | Zorunlu | Validasyon | Locator | Not |
|---|---|---|---|---|---|---|---|
| Arama Motoru Önizleme | (önizleme) | – | salt okunur | | | "yourstore.com/products/{slug}" | |
| Temel SEO / Basic SEO | Meta Başlık / Meta Title | `seo.metaTitle` | text | Hayır | ≤100 (sayaç "{n}/100 karakter") | placeholder "Arama motorları için SEO başlığı" | API `seo.title` |
| 〃 | Meta Açıklama / Meta Description | `seo.metaDescription` | textarea | Hayır | ≤300 | placeholder "Arama motorları için kısa açıklama" | API `seo.description` |
| 〃 | Anahtar Kelimeler / Keywords | `seo.seoKeywords` | text (virgüllü) | Hayır | – | placeholder "Anahtar kelimeleri girin (virgülle ayırın)" | API `seo.keywords[]` |
| 〃 | Odak Anahtar Kelime / Focus Keyword | `seo.focusKeyword` | text | Hayır | | | |
| 〃 | Standart URL / Canonical URL | `seo.canonicalUrl` | text | Hayır | geçerli URL veya boş | placeholder "https://example.com/urun" | |
| Sosyal Paylaşım (Open Graph) | OG Başlık / OG Title | `seo.ogTitle` | text | Hayır | | | |
| 〃 | OG Açıklama | `seo.ogDescription` | textarea | Hayır | | | |
| 〃 | OG Görsel URL / OG Image URL | `seo.ogImage` | medya seçici alanı (URL input + kütüphane) | Hayır | | | |
| Twitter Kartı / Twitter Card | Twitter Başlık / Açıklama / Görsel URL | `seo.twitterTitle`, `seo.twitterDescription`, `seo.twitterImage` | text / textarea / medya seçici | Hayır | | | |
| İndeksleme Seçenekleri | İndekslemeye İzin Ver / Allow Indexing | `seo.indexable` | checkbox | – | true | | |
| 〃 | Bağlantıları Takip Et / Follow Links | `seo.followable` | checkbox | – | true | | |

### Tab: Fiyatlandırma (`pricing`)
| Bölüm | Label (tr / en) | Form key | Kontrol | Zorunlu | Validasyon / varsayılan | Locator | Not |
|---|---|---|---|---|---|---|---|
| Fiyatlandırma / Pricing | Para Birimi * / Currency * | `currency` | Select (aktif para birimleri, value=ISO kod) | Yayın için Evet | 3 harf; tenant varsayılan fiyat para birimi otomatik dolar | placeholder "Para birimi seçin" | Fiyat > 0 iken değiştirirsen "Para Birimi Değişikliği / Currency Change" dialog'u açılır (Tuzaklar) |
| 〃 | Temel Fiyat * / Base Price * | `basePrice` | number (focus'ta tümünü seçer, blur'da 2 haneye formatlar) | Evet | ≥0, 0.01 katı; varsayılan 0 | `getByLabel('Temel Fiyat')` | Ondalık **nokta** ile yaz ("1299.90"). Yanında vergi dahil/hariç ipucu |
| 〃 | Karşılaştırma Fiyatı / Compare At Price | `compareAtPrice` | number | Hayır | girilirse **> Temel Fiyat** olmalı | | Üstü çizili "eski fiyat" |
| 〃 | Birim Maliyet / Cost Per Item | `cost` | number | Hayır | ≤ 2×Temel Fiyat (aksi halde "maliyet olağandışı" hatası) | | API `costPrice` |
| Özel Fiyatlandırma / Special Pricing | Özel Fiyat / Special Price | `specialPrice` | number | Hayır | < Temel Fiyat (0 = temizlenmiş) | | Başlıkta "Aktif"/"Planlandı" rozeti ve "Temizle / Clear" butonu |
| 〃 | Başlangıç Tarihi (İsteğe Bağlı) / Start Date (Optional) | `specialPriceStart` | date (açılır takvim, buton tetikleyici) | Hayır | | buton placeholder "Başlangıç tarihi seçin / Select start date" | Yazarak girilmez; takvimden gün tıklanır |
| 〃 | Bitiş Tarihi (İsteğe Bağlı) / End Date (Optional) | `specialPriceEnd` | date | Hayır | > başlangıç | "Bitiş tarihi seçin" | |
| Vergi Yapılandırması / Tax Configuration | Bu Ürüne Vergi Uygula / Charge Tax on This Product | `taxable` | checkbox | – | true | | Vergi davranışı Vergi Sınıfı ile belirlenir |
| 〃 | Vergi Sınıfı / Tax Class | `taxClass` | Select (aktif sınıflar, metin "{ad} ({oran}%)") | Hayır | boşsa tenant varsayılan vergi sınıfı atanır | placeholder "Vergi sınıfı seçin" | API `taxClassId`; silinmiş sınıf → Fiyatlandırma sekmesinde satır içi uyarı |
| Kademe Fiyatlandırma / Tier Pricing | "Kademe Ekle / Add Tier" butonu | `tierPrices[]` | tekrarlanan satırlar (tablo) | Hayır | – | `getByRole('button',{name:'Kademe Ekle'})` | |
| 〃 satır | Müşteri Grubu / Customer Group | `tierPrices[i].customerGroupId` | Select ("Tüm müşteri grupları / All customer groups" + gruplar) | Hayır | boş = tüm gruplar | placeholder "Grup seçin" | |
| 〃 satır | Min Miktar / Min Quantity | `tierPrices[i].minQty` | number | Evet | **≥2**; varsayılan 2 | | <2 → `ERR_TIER_PRICE_MIN_QTY_INVALID`, Fiyatlandırma sekmesinde satır içi uyarı |
| 〃 satır | Fiyat / Price | `tierPrices[i].price` | number | Evet | ≥0 | | Tür yüzde ise sembol "%" |
| 〃 satır | Tür / Type | `tierPrices[i].priceType` | Select: Sabit Fiyat/Fixed Price `fixed`, % İndirim/% Discount `percentage` | – | `fixed` | | |
| 〃 satır | (çöp kutusu) | – | buton | | | aria-label "Kademeyi kaldır / Remove tier" | |

### Tab: Stok (`inventory`) — virtual/downloadable/gift_card/grouped'da yok
| Bölüm | Label (tr / en) | Form key | Kontrol | Zorunlu | Validasyon / varsayılan | Locator | Not |
|---|---|---|---|---|---|---|---|
| Stok Yönetimi / Stock Management | (Depo yok uyarı bandı, depo kurulumuna link) | – | – | | | | Hiç depo yoksa görünür |
| 〃 (simple/bundle/subscription) | Depo / Warehouse | `warehouseId` | Select (metin "{ad} ({kod})") | Stok > 0 ise pratikte Evet | tek depo varsa otomatik seçilir; SKU yazılınca mevcut stoktan tahmin edilir | placeholder "Depo seçin / Select warehouse"; ipucu "Stoğun yazılacağı depoyu seçin. Zorunlu." | |
| 〃 | Miktar * / Quantity * | `qty` | number (tam sayı) | – | ≥0 tam sayı, varsayılan 0 | | API `quantity`; >0 ise oluşturma sırasında seçili depoya stok yazılır |
| 〃 | Düşük Stok Eşiği / Low Stock Threshold | `lowStockThreshold` | number | Hayır | ≥0 tam sayı | | |
| 〃 | Stok Takibi / Track Inventory | `trackInventory` | checkbox | – | true | | |
| 〃 | Ön Siparişe İzin Ver / Allow Backorders | `allowBackorder` | checkbox | – | false | | |
| 〃 (configurable) | Bilgi kutusu "Stok varyant bazında yönetilir / Stock is managed per variant" + "{n} varyant · Toplam stok: {x}" + link "Varyantları yönet" | – | – | | | | Miktar alanı YOK |
| 〃 (configurable) | Depo / Warehouse | `warehouseId` | Select | Varyant stoğu > 0 ise **Evet** | | ipucu "Aşağıdaki varyant stok girişleri bu depoya yazılır." | Varyant stoklarının yazılacağı depo |
| Fiziksel Özellikler / Physical Properties | Ağırlık / Weight | `weight` | number | Hayır | ≥0 | placeholder "0,00" | Ondalık nokta ile yaz |
| 〃 | Ağırlık Birimi / Weight Unit | `weightUnit` | Select kg/g/lb/oz ("Kilogram (kg)"...) | – | `kg` | | |
| 〃 | Uzunluk / Genişlik / Yükseklik (Length/Width/Height) | `length`,`width`,`height` | number | Hayır | ≥0 | | |
| 〃 | Birim / Unit | `dimensionUnit` | Select cm/m/in/ft | – | `cm` | | |
| 〃 | (uyarı) "Ağırlık veya ölçülerden biri eksik; kargo fiyatı platformun varsayılan paketiyle hesaplanacak…" | – | | | | | Bilgi; kaydı engellemez |
| Kargo / Shipping | Kargo Gerekli / Requires Shipping | `requiresShipping` | checkbox | – | true (virtual/downloadable'da false) | | API `isShippable`; işaret kaldırılırsa Ücretsiz Kargo da kapanır |
| 〃 | Ücretsiz Kargo / Free Shipping | `freeShipping` | checkbox | – | false | | Kargo Gerekli kapalıyken pasif |

### Tab: Medya (`media`)
| Bölüm | Label (tr / en) | Form key | Kontrol | Zorunlu | Validasyon | Locator | Not |
|---|---|---|---|---|---|---|---|
| Ürün Medyası / Product Media | "Kütüphaneden Seç / Browse Library" | `media[]` | buton → medya kütüphanesi dialog'u | Hayır | en çok **20** öğe; url geçerli URL | `getByRole('button',{name:'Kütüphaneden Seç'})` | Görsel + video |
| Dialog | Sekmeler "Göz At / Browse" ve "Yükle / Upload" | – | tabs | | | | |
| Dialog > Yükle | Dropzone "Dosyaları sürükleyip bırakın veya göz atmak için tıklayın / Drag and drop files here, or click to browse" | – | dosya yükleme (çoklu) | | max 50 MB/dosya, görsel/video | `browser_file_upload` (dropzone'a tıkla → dosya seçici) | Dosya seçilince **otomatik** medya kütüphanesine yüklenir ve otomatik seçili olur |
| Dialog footer | "Seç / Select" | – | buton | | ≥1 seçim olmadan pasif | `getByRole('button',{name:'Seç'})` | Seçilenler forma eklenir; ana görsel yoksa ilk görsel ana olur; toast "{type} başarıyla yüklendi" |
| Medya ızgarası | filtre "Tümü / Görseller / Videolar"; kart üzerinde "Ana / Main" rozeti | – | sürükle-bırak sıralama | | | | Sıra = görüntülenme sırası |
| Kart aksiyonları | "Ana görsel olarak ayarla / Set as main image" (title), "Alt metin ve başlığı düzenle / Edit alt text and title", "Medyayı kaldır / Remove media" | `media[i].isMain`, `alt`, `title` | ikon butonları (title attr.) | | | `getByTitle(...)` | Alt metin eksikse "Alt metin eksik" ikonu |
| Düzenle dialog'u "Görsel Detaylarını Düzenle" | Alt Metin / Alt Text; Başlık / Title | `media[i].alt`, `media[i].title` | text (`#media-alt`, `#media-title`) | Hayır | | `#media-alt` | Kaydet: "Kaydet/Save" |
| (configurable) "{Nitelik} Bazında Görseller / Images by {attribute}" | grup başına "Kütüphaneden Seç" | `media[i].variantAttributes` | | | | | Varyant görseli; varyant satırında "Görselleri Geçersiz Kıl / Override images" ayrıca var |

### Tab: Kimlik (`identification`)
| Label (tr / en) | Form key | Kontrol | Zorunlu | Validasyon | Locator |
|---|---|---|---|---|---|
| Barkod (İsteğe bağlı) / Barcode (Optional) | `barcode` | text | Hayır | 8/12/13/14 hane rakam | placeholder "Ürün barkodunu girin" |
| Avrupa Ürün Numarası (EAN) (İsteğe bağlı) | `ean` | text | Hayır | tam 13 hane | placeholder "13 haneli EAN girin" |
| Üretim Ülkesi / Country of Manufacture | `countryOfManufacture` | Select (uzun liste, value=ISO-2 ör. `TR`; ilk seçenek "-- Belirtilmedi --") | Hayır | 2 büyük harf | placeholder "Üretim ülkesini seçin" — listbox'ta harf yazarak hızlı arama çalışır |
| "Özet / Summary" kartı | – | salt okunur | | | |

### Tab: Özel Nitelikler (`custom-attributes`)
| Label (tr / en) | Form key | Kontrol | Zorunlu | Validasyon | Locator | Not |
|---|---|---|---|---|---|---|
| Nitelik Seti * / Attribute Set * | `attributeSetId` | Select (set adları; varsayılan set yanında "(Varsayılan)") | Yayın için Evet | en az bir set seçilmeli | placeholder "Nitelik seti seçin / Select attribute set" | **Otomatik seçilmez.** Seçilince set'in attribute'ları yüklenir ("Nitelikler yükleniyor...") |
| Set'in her attribute'u (bölümlere göre kartlar) | `customAttributes.{attribute.code}` | attribute tipine göre: text→Input, textarea→Textarea, number→sayı, boolean→Checkbox, select→Select (placeholder **"Select {label}"**), multiselect→checkbox listesi, date→tarih, color→renk örnekleri veya hex input | attribute zorunluysa Evet (**taslakta bile** kaydı engeller) | attribute'un min/max uzunluk kuralları | label = attribute etiketi (+ `*`) | Ürün tipine uygulanmayan attribute'lar gizlenir; configurable'da varyant ekseni olan kodlar "Varyant bazında ayarlanır" notu gösterir |

### Tab: İlişkiler (`relationships`)
Üç kart: "İlgili Ürünler / Related Products" (`relatedProducts`), "Üst Satış Ürünleri / Upsell Products" (`upsellProducts`), "Çapraz Satış Ürünleri / Cross-sell Products" (`crossSellProducts`). Her kartta "Ürün Ekle / Add Products" butonu → dialog "Ürün Seç / Select Products", arama input placeholder "Ürün adı veya SKU ile ara... / Search products by name or SKU..." (yazdıktan sonra ~0,5 sn bekle), sonuç satırına tıklayınca **tek** ürün eklenir ve dialog kapanır (her ürün için tekrar aç). API: `relations[]` (`related`/`up_sell`/`cross_sell`). Ürün kendisiyle ilişkilendirilemez.

### Tab: Varyantlar (`variants`, yalnızca configurable)
Global attribute'lardan seçilmez; eksenler **elle yazılır**. Ekseni attribute set'teki bir attribute ile aynı `code` ile yazarsan Özel Nitelikler'de o alan "varyant bazında" olur.
| Bölüm | Label (tr / en) | Form key | Kontrol | Zorunlu | Validasyon | Locator | Not |
|---|---|---|---|---|---|---|---|
| Yapılandırılabilir Öznitelikler | "İlk Özniteliği Ekle / Add First Attribute", sonra "Başka Öznitelik Ekle / Add Another Attribute" | `configurableAttributes[]` | buton | ≥1 (yayın) | kodlar benzersiz | `getByRole('button',{name:'İlk Özniteliği Ekle'})` | |
| 〃 | Öznitelik Kodu / Attribute Code | `configurableAttributes[i].code` | text | Evet | otomatik küçük harf, boşluk→`_` | placeholder "ör. color, size" | Aynı kod → "Bu öznitelik kodu zaten kullanılıyor" |
| 〃 | Öznitelik Etiketi / Attribute Label | `…label` | text | Evet | | placeholder "ör. Renk, Beden" | |
| 〃 | Görüntüleme Türü / Display Type | `…displayType` | Select: Açılır Liste/Dropdown, Renk Örneği/Color Swatch, Buton/Button | – | `dropdown` | | swatch'ta değer başına hex input |
| 〃 Değerler / Values | "Değer Ekle / Add Value" | `…values[]` | buton + satır | ≥1 | | | İlk değer varsayılan |
| 〃 değer satırı | Etiket / Değer | `…values[j].label`, `…values[j].value` | text ×2 | Evet | value otomatik küçük harf | placeholder "Etiket (ör. Kırmızı)" / "Değer (ör. kirmizi)" | Değer kaldır: aria-label "Değeri kaldır" |
| 〃 | hex (swatch) | `…values[j].hexColor` | text | Hayır | `#RRGGBB` | placeholder "#000000" | |
| Varyant Matrisi / Variant Matrix | "Varyantları Yeniden Oluştur / Regenerate Variants" | `variants[]` | buton | ≥1 varyant (yayın) | | `getByRole('button',{name:'Varyantları Yeniden Oluştur'})` | **Otomatik üretmez — butona basılmalı.** SKU = `{ürün SKU}-{DEĞER1}-{DEĞER2}` (değerler BÜYÜK harf), fiyat = o anki Temel Fiyat, miktar 0 |
| matris satırı | SKU / Barkod / EAN / Fiyat / Karşılaştırma Fiyatı / Miktar (seçili depo) / Ağırlık / Varsayılan | `variants[k].sku`, `.barcode`, `.ean`, `.price`, `.compareAtPrice`, `.qty`, `.weight`, `.isDefault` | text/number, radio/checkbox | SKU ≥2 karakter | barkod/EAN kuralları ürünle aynı | satır `data-variant-id` (yalnızca kayıtlı varyant) | Fiyat boş = ana ürün fiyatı |

### Tab: Paket Öğeleri (`bundle`)
| Label (tr / en) | Form key | Kontrol | Zorunlu | Validasyon | Not |
|---|---|---|---|---|---|
| Paket Fiyat Türü / Bundle Price Type | `bundlePriceType` | Select: Sabit Fiyat/Fixed Price `fixed`, Dinamik Fiyat/Dynamic Price `dynamic` | – | `fixed` | Sabitte fiyat = Fiyatlandırma'daki Temel Fiyat |
| Tüm öğeleri birlikte gönder / Ship all items together | `shipTogether` | checkbox | – | true | |
| Paket ürünleri (ürün seçici ile ekle) | `bundleItems[]` | tekrarlanan satırlar | **≥2 ürün** (yayın) | | her öğe: Miktar `qty`≥1, Min/Max `minQty`/`maxQty` (ops.), Zorunlu `isRequired`, Miktar değiştirilebilir `canChangeQty` |

### Tab: Dosyalar (`downloadable`)
`downloadableFiles[]` {ad, url (http/https), kaynak yükleme|URL, indirme limiti, bağlantı süresi}; yükleme veya URL ile eklenir. Yayın için ≥1 dosya.

### Tab: Sanal (`virtual`) — salt bilgi kartı, alan yok.

### Tab: Hediye Kartı (`giftcard`)
| Label (tr / en) | Form key | Kontrol | Not |
|---|---|---|---|
| Önceden Tanımlı Tutarlar / Predefined Amounts + "Tutar Ekle / Add Amount" | `giftCardAmounts[]` | number input + buton (placeholder "ör. 25.00") | sıralı chip listesi |
| Özel Tutarlara İzin Ver / Allow Custom Amounts | `allowCustomAmount` | checkbox | açılınca Min/Max görünür |
| Minimum Tutar / Maximum Tutar | `minAmount`, `maxAmount` | number | |
| Geçerlilik Süresi / Expiry Period | `expiryDays` | number (0 = süresiz) | |

Hediye kartı fiziksel gönderilmez (kargo gerekmez).

### Tab: Abonelik (`subscription`)
| Label (tr / en) | Form key | Kontrol | Zorunlu | Validasyon |
|---|---|---|---|---|
| Faturalama Aralığı / Billing Interval | `interval` | Select: Günlük/Daily `daily`, Haftalık/Weekly `weekly`, Aylık/Monthly `monthly`, Yıllık/Yearly `yearly` | Evet | placeholder "Aralık seçin" |
| Faturalama Dönemi / Billing Period | `intervalCount` | number | Evet | ≥1 tam sayı (varsayılan yok — boş bırakma) |
| Abonelik Süresi / Subscription Length | `recurrenceCount` | salt okunur 0 ("Süresiz") | – | sabit 0 |
| Deneme Süresi (gün) / Trial Period (days) | `trialDays` | number | – | ≥0, varsayılan 0 |
| İptal Koşulları / Cancellation Terms | `cancellationTerms` | textarea | **Evet** | 1–2000 karakter |

Abonelik ürünü faturalama planı olmadan kaydedilemez (`PRODUCT_SUBSCRIPTION_PLAN_REQUIRED`) → taslakta bile Faturalama Aralığı ve İptal Koşulları dolu olmalı.

### Tab: Gruplanmış Ürünler (`grouped`)
"Ürün Ekle" ile ≥2 ürün; her satırda Varsayılan Miktar `defaultQty`.

## Aksiyonlar
| Buton (tr / en) | Ne yapar |
|---|---|
| Tip kartı / `#product-type` Select | Tipi seçer, formu açar |
| Tipi Değiştir / Change Type | Tip seçimine döner; form verisi **sıfırlanır** (onay sorulmaz) |
| İptal / Cancel (footer) | Kaydedilmemiş değişiklik varsa dialog "Kaydedilmemiş değişiklikler / Unsaved changes" — "İptal / Cancel" (kal) veya kırmızı "Ayrıl / Leave" → `/products` |
| **Ürün Oluştur / Create Product** (submit, footer) | Taslak-farkında kayıt:<br>• `status=published`: tüm form kuralları geçmeli; aksi halde ilk hatalı sekmeye geçer + toast "Lütfen aşağıdaki hataları düzeltin / Please fix the errors below" (açıklama "Alan: mesaj (+N more)") + hata özeti kutusu.<br>• Diğer durumlar (draft vb.): yalnızca Ürün Adı, SKU ve set'in zorunlu attribute'ları geçerli olmalı; diğer eksiklerle **eksik taslak** olarak kaydeder.<br>• Configurable'da varyant stok > 0 ve depo yoksa hiçbir şey kaydedilmeden Stok sekmesine geçer, depo alanında "Varyant stoğunu kaydetmek için Stok sekmesinden bir depo seçin. Henüz hiçbir şey kaydedilmedi." |
| Enter tuşu | Textarea dışında formu **göndermez** |

Sonuç toast'ları:
- Tam başarı: "İşlem başarıyla tamamlandı / Operation completed successfully" + "Ürün başarıyla oluşturuldu / Product created successfully".
- Eksik taslak: başlık "Uyarı / Warning" + "Ürün taslak olarak kaydedildi, ancak bazı zorunlu alanlar eksik. / Product saved as a draft, but some required fields are still missing.".
- Varyant kaydı başarısız: "Bir hata oluştu / An error occurred" + "Ürün oluşturuldu ancak varyantları kaydedilemedi. Ürünü açıp Varyantlar sekmesinden tekrar deneyin."
- Bu üç durumda da **yönlendirme: `/products/{yeniId}` (detay sayfası)** — ./product-detail.md.
- Hata (ürün oluşturulmadı, sayfada kalır): `ERR_TIER_PRICE_MIN_QTY_INVALID` ve `ERR_TAX_CLASS_NOT_FOUND` → Fiyatlandırma sekmesinde kırmızı uyarı kutusu (toast yok, sekme otomatik açılır); `WAREHOUSE_NOT_CONFIGURED` → "Stok eklemeden önce bir depo tanımlamanız gerekir…"; stok servisi geçici olarak yanıt vermezse → "Stok servisi geçici olarak kullanılamıyor…"; yayında ürün kategorisizse → "Yayındaki bir ürünün en az bir kategorisi olmalı…"; `PRODUCT_SUBSCRIPTION_PLAN_REQUIRED` → "Abonelik ürünleri için bir faturalandırma planı gerekir…"; `VALIDATION_ERROR` → "Sunucu bazı ürün bilgilerini kabul etmedi…"; SKU çakışması → genel hata metni (tam metin doğrulanmadı).

## Yan etkiler
- Ürün oluşurken: slug addan üretilir, vergi sınıfı boşsa tenant varsayılanı atanır, para birimi boşsa tenant varsayılanı kullanılır.
- Miktar > 0 ise seçili (veya varsayılan) depoya stok yazılır; **stok yazılamazsa ürün de oluşturulmaz** ve hata döner.
- Yayında ve görünür ürün vitrin aramasına birkaç dakika içinde eklenir; taslak veya "Görünmez" ürün aramada çıkmaz.
- Varyantlar kaydedilince her varyant için depoda stok satırı oluşur.
- Medya yüklemesi ürün kaydından **bağımsız** kalıcıdır (medya kütüphanesine anında yazılır; ürün kaydedilmese de kütüphanede kalır).
- Çeviriler create'te kaydedilmez.
- Beden rehberi ürün formunda seçilmez: vitrin, ürünün türüne uyan yayında ve aktif rehberi ürün sayfasındaki "Beden Rehberi" penceresinde gösterir (bkz. `../content/size-guides.md` § Ürünle ilişkisi). Kargo seçenekleri için ürün ağırlık/ölçüsü kullanılır; boşsa varsayılan koli devreye girer (`../settings/shipping-carriers.md`).

## Tuzaklar
1. **Durum `published` ile kaydetmek tüm sekmeleri zorunlu kılar**: kategori, attribute set, para birimi, (configurable'da) ≥1 eksen + ≥1 varyant, (bundle/grouped'da) ≥2 öğe, (downloadable'da) ≥1 dosya, açıklama doluysa ≥10 karakter. Önce taslak kaydedip sonra yayınlamak daha az hata verir ama yine de kullanıcıya hedef durumu sor.
2. **Açıklama min 10 karakter** — kısa bir açıklama yazarsan (ör. "Kırmızı") yayın engellenir; boş bırakmak geçerli (ad açıklama olarak kaydedilir).
3. **Etiketler (tags) input'u**: her tuş vuruşunda değeri bölüp `", "` ile yeniden yazar; karakter karakter yazmak (`type`) virgül ve boşlukları yutar. Değeri **tek seferde `fill`** ile ver: `"yaz, pamuk, tişört"`.
4. **Fiyat / sayı alanları**: Türkçe ondalık virgül kabul edilmez; "1299.90" yaz. Focus tümünü seçer, blur 2 haneye formatlar.
5. **Para birimi değiştirme** Temel Fiyat > 0 iken dialog açar: "Para Birimi Değişikliği / Currency Change" → "Fiyatları Dönüştür / Convert Prices" (kurla çevirir) veya "Sadece Para Birimini Değiştir / Change Currency Only". Para birimini fiyattan **önce** seç ki dialog çıkmasın.
6. **Para birimi otomatik dolumu gecikmeli**: tenant varsayılanı formun açılmasından kısa süre sonra gelir. Snapshot'ta boş görürsen bekle.
7. **Depo otomatik seçimi**: tek depolu tenantta sessizce seçilir; SKU yazınca mevcut stoğu olan depo seçilebilir. Özetten önce Stok sekmesindeki değeri oku.
8. **Varyantlar otomatik oluşmaz**: eksen/değerleri girdikten sonra "Varyantları Yeniden Oluştur"a bas. SKU ve Temel Fiyat'ı **önce** gir (üretim anındaki değerler kopyalanır). Değer alanı küçük harfe zorlanır; Türkçe karakterler SKU'ya BÜYÜK harfle girer (ör. `-KIRMIZI`); gerekirse ASCII değer kullan.
9. **Varyant stoğu + depo**: configurable'da Stok sekmesindeki Depo seçilmeden varyant miktarı >0 ise kayıt hiç başlamaz (satır içi hata). Ürün oluşur da varyantlar kaydedilemezse ürün **varyantsız** kalır; detaya yönlenir → ./product-edit.md Varyantlar sekmesinden tekrar dene.
10. **Attribute set otomatik seçilmez** ve set seçilince yüklenen zorunlu attribute'lar taslak kaydı bile engeller. Attribute select placeholder'ı "Select {label}".
11. **Kategori ağacı**: aramada eşleşen alt kategori, ebeveyni kapalıysa görünmez → ebeveyndeki "Expand" butonuna bas. Checkbox aria-label "Select {ad}" (arayüz dilinden bağımsız).
12. **Slug alanı yok** (varsayılan scope). İstenen özel slug ancak edit'te çeviri scope'unda (store view) girilebilir; varsayılan slug addan üretilir.
13. **Durum seçenekleri**: yeni ürün yalnız Taslak / Yayında / Arşivlendi durumuyla oluşturulur; "Stok Tükendi" / "Üretimden Kalktı" kullanma.
14. **Medya yükleme kalıcı**: kütüphaneye yüklenen dosya ürün kaydı iptal edilse de kalır. Yükleme sonrası dialog'da otomatik seçilir; yine de "Seç"e basmadan forma eklenmez.
15. **Sayfadan ayrılma uyarısı**: kaydedilmemiş formda sayfadan çıkmak tarayıcı "Leave site?" diyaloğu açar; otomasyonda URL değiştirmeden önce kaydet ya da İptal→Ayrıl kullan.
16. **Tipi değiştirmek / sayfayı yenilemek tüm girilen veriyi siler** (tip URL'de değil).
17. **Deep link `?tab=`**: create'te de çalışır (`basic, seo, pricing, inventory, media, identification, custom-attributes, relationships, variants, bundle, downloadable, virtual, subscription, grouped`).
18. **Hata özeti kutusu ve footer sayaçları** yalnızca `status=published` iken görünür; taslakta hatalar sadece sekme rozetleri ve alan altı mesajlarla görünür.
19. Başarıdan sonra `/products/{id}` adresine gidilir — admin'de URL'ler locale önekli değildir. Label eşleştirirken o anki dili snapshot'tan anla (tr/en).

## Doğrulama
1. Toast metnini oku ("Ürün başarıyla oluşturuldu" veya "taslak olarak kaydedildi, ancak…").
2. URL `{ADMIN_URL}/products/{24-hex id}` olmalı → ./product-detail.md: başlık = ad, "SKU: …", durum/tip rozetleri, Fiyatlandırma kartı (temel/özel/karşılaştırma fiyat), Kategoriler, Özel Nitelikler, Envanter (Satılabilir Toplam = girilen stok; configurable'da varyant toplamı), Görseller (ana rozet), Varyantlar kartı (sayı).
3. Stok için detaydaki "Ürün envanterini görüntüle" → `/inventory/stock/product/{id}`.
4. Listede (`./product-list.md`) SKU ile ara; durum/görünürlük sütunlarını kontrol et. Vitrin aramasına yansıması birkaç dakika sürebilir.
5. Eksik taslak uyarısı geldiyse ./product-edit.md'de açıp sekme rozetlerinden eksikleri tamamla.
