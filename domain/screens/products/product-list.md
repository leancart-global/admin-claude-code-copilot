# Ürün Listesi (Products)

- URL: `{ADMIN_URL}/products` — tarayıcı adresinde locale segmenti **yoktur** (dil header'daki dil seçiciden gelir; varsayılan `en`).
- Amaç: Ürünleri listelemek, aramak/filtrelemek/sıralamak; yeni ürün ekleme giriş noktası (manuel / EAN / barkod), CSV içe/dışa aktarma, tekil satır aksiyonları (görüntüle, düzenle, çoğalt, arşivle, geri yükle, kalıcı sil) ve toplu işlemler (bkz. [product-bulk-edit.md](./product-bulk-edit.md)).
- Yetki (permission):
  - Liste görüntüleme: `products:read`. Yazma işlemleri (çoğalt, geri yükle, içe aktar): `products:write`.
  - Arşivle: `products:delete`.
  - "Kalıcı olarak sil" satır aksiyonu yalnızca `products:delete:permanent` olan kullanıcıda görünür — pratikte super_admin.
  - Toplu işlemler menüsü: `products:bulk` veya `products:write`. Yetki yoksa "Toplu İşlemler" butonu hiç görünmez.
- İşlemler (ne yapar):
  | Amaç | Ne olur |
  |---|---|
  | Liste | Sayfa, sıralama, arama ve filtrelere göre ürünler; arşivliler varsayılan olarak hariç; stok kolonu canlı satılabilir stokla gelir |
  | Kategori listesi (filtre + toplu kategori) | Kategori ağacı düz liste olarak |
  | Marka listesi (gelişmiş filtre açılınca) | Seçim için markalar |
  | Arşivle (tekil) | Ürün arşivlenir (durum = Arşivlendi), stok değişmez |
  | Geri yükle | Durum → Taslak |
  | Kalıcı sil | SKU onayıyla; yalnız arşivli ürün |
  | Çoğalt | Seçilen seçeneklerle yeni ürün |
  | CSV içe aktarma | ayrıştır → doğrula → içe aktar; büyük dosyada arka plan işi (doğrulanmadı) |
  | Örnek ürünler (presets) | Her örnek için ayrı ürün oluşturur |
  | Toplu işlemler | bkz. [product-bulk-edit.md](./product-bulk-edit.md) |

## Ön koşullar ve bağımlılıklar
- Hiçbir ön koşul yok; boş katalogda tablo yerine başlangıç kartları gösterilir.
- Kategori filtresi ve toplu kategori atama için kategoriler önceden oluşturulmuş olmalı (bkz. ../categories/ — `products/categories` adresi de oraya yönlendirir, aşağıda).
- Marka filtresi için marka kaydı (bkz. ../brands/).
- Fiyat aralığı filtresi tenant'ın varsayılan fiyat para birimi yüklenene kadar pasiftir.
- Kalıcı silme: ürün önce **arşivlenmiş** olmalı ve açık siparişlere ayrılmış stoğu olmamalı.

## Yerleşim
Tek kart içinde yukarıdan aşağı:
1. **Başlık satırı**: Başlık "Ürünler / Products" + toplam ürün sayısı rozeti; açıklama "Mağazanızda satış yapmaya başlamak için..." (geniş ekranda). Sağda:
   - "Ürünleri Dışarı Aktar / Export Products" (yalnızca listede en az 1 ürün varken; dar ekranda sadece ikon),
   - "Ürünleri İçeri Aktar / Import Products" (dar ekranda sadece ikon),
   - "Ürün Ekle / Add Product" açılır menüsü: "Ürün Ekle" → `/products/new`; "EAN ile Ürün Ekle / Add Product by EAN"; "Barkod ile Ürün Ekle / Add Product by Barcode" → kod arama dialog'u.
2. **Filtre satırı**: solda (seçim yokken) "Toplu İşlemler / Bulk Actions" (Apply-to-All modu), sağda hızlı filtreler: arama kutusu, Tip, Durum, Görünürlük, Sıralama seçimleri, "Arşivlenenleri göster" switch'i, gelişmiş filtre (kaydırıcı ikonlu) butonu.
3. **Aktif filtre rozetleri**: "Aktif filtreler:" + arama/tip/durum/görünürlük rozetleri + gelişmiş filtre rozetleri (her birinde X ile kaldırma, aria-label "{label} filtresini kaldır") + "Tümünü temizle / Clear all".
4. **Seçim çubuğu** (yalnızca ≥1 satır seçiliyken): "{count} ürün seçildi", "Seçimi Temizle / Clear Selection", "Toplu İşlemler" (seçili mod).
5. **Hata bandı** (yükleme hatasında): "Ürünler yüklenemedi. Lütfen tekrar deneyin." + "Tekrar Dene / Retry".
6. **Tablo**.
7. **Sayfalama** (yükleme bitince her zaman): "{total} sonuçtan {from} - {to} arası gösteriliyor", "Önceki / Previous", "Sayfa {current} / {total}", "Sonraki / Next".
8. Sayfa üstü katmanlar: Gelişmiş filtre paneli (sağdan), Arşivle onayı, Kalıcı silme dialog'u, CSV içe aktarma dialog'u, Çoğalt dialog'u, Örnek ürünler dialog'u, Kod arama dialog'u.

### Tablo kolonları
| # | Başlık (tr / en) | Alan | Sıralanabilir | Not |
|---|---|---|---|---|
| 1 | (checkbox) aria "Tümünü Seç / Select all", satır: "Satırı Seç / Select row" | — | hayır | `role=checkbox` |
| 2 | Görsel / Image | ana görsel | hayır | tıklanınca galeri önizleme |
| 3 | Ad / Name | `name` (+ altında `sku`, öne çıkansa sarı yıldız) | evet (başlık butonu) | |
| 4 | SKU | `sku` | hayır | |
| 5 | Tür / Type | `type` rozet | hayır | Basit, Varyantlı (hızlı filtrede "Yapılandırılabilir"), Gruplu, Sanal, Paket, İndirilebilir, Hediye Kartı, Abonelik |
| 6 | Durum / Status | `status` rozet | hayır | Taslak/Draft, Yayında/Published, Arşivlendi/Archived, Stokta Yok/Out of Stock, Üretimi Durdu/Discontinued |
| 7 | Fiyat / Price | `price` (+ üstü çizili `compareAtPrice` > fiyat ise) | evet | para birimi yoksa hücre boş |
| 8 | Stok / Stock | miktar (yeşil=stokta, kırmızı=yok) + varyantlıysa "{count} varyant" rozeti | evet | |
| 9 | Güncellendi / Updated | `updatedAt` (tarih) | hayır | |
| 10 | (aksiyon menüsü) ekran okuyucu metni "Menüyü Aç / Open menu" | — | — | üç nokta ikon butonu |

Satır menüsü, etiket "İşlemler / Actions":
- "ID Kopyala / Copy ID" (panoya ürün id'si)
- "Detayları Gör / View Details" → `/products/{id}` ([product-detail.md](./product-detail.md))
- "Düzenle / Edit" → `/products/{id}/edit` ([product-edit.md](./product-edit.md))
- "Çoğalt / Duplicate" → Çoğalt dialog'u
- Arşivli olmayan ürün: "Arşivle / Archive" → arşiv onay dialog'u
- Arşivli ürün: "Geri Yükle / Restore" (onaysız, anında) ve (yetkiliyse) "Kalıcı olarak sil / Delete permanently" (kırmızı)

Satıra tıklamak (checkbox/buton/menü öğesi dışında) detay sayfasına gider.

## Alanlar

### Hızlı filtreler
| Bölüm | Label (tr / en) | Query key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Hızlı | placeholder "Ürün ara... / Search products..." | `search` | text | hayır | boş → filtre yok | `getByPlaceholder('Ürün ara...')` | Doluyken sağda X temizleme butonu. Yazdıktan sonra listenin yenilenmesini bekle |
| Hızlı | "Tüm Tipler / All Types" | `type` | Select | hayır | Tümü. Seçenekler: Basit/Simple, Yapılandırılabilir/Configurable, Gruplu/Grouped, Sanal/Virtual, Paket/Bundle, İndirilebilir/Downloadable, Hediye Kartı/Gift Card, Abonelik/Subscription | combobox, metni "Tüm Tipler" | dar ekranda (<640px) gizli |
| Hızlı | "Tüm Durumlar / All Statuses" | `status` | Select | hayır | Taslak, Yayında, Arşivlendi, Stok Tükendi/Out of Stock, Üretimi Durdu | combobox | "Arşivlendi" seçilirse arşivli ürünler de gelir |
| Hızlı | "Tüm Görünürlük / All Visibility" | `visibility` | Select | hayır | Her Yerde/Everywhere (`visible_everywhere`), Sadece Katalog (`catalog`), Sadece Arama (`search`), Görünmez (`not_visible`) | combobox | |
| Hızlı | Sıralama / Sort by | sıralama alanı + yön | Select | hayır | varsayılan "İsim A-Z". Seçenekler: En Yeni/Newest First, En Eski, İsim A-Z, İsim Z-A, Fiyat Düşükten Yükseğe, Fiyat Yüksekten Düşüğe | `data-testid="quick-filters-sort-trigger"` | En Yeni / En Eski güncellenme tarihine göre sıralar |
| Hızlı | "Arşivlenenleri göster / Show archived" | — | switch | hayır | kapalı → arşivliler gizli | `#products-show-archived` / `getByLabel('Arşivlenenleri göster')` | |
| Hızlı | (ikon, mobilde "Filtreler / Filters") | — | button | — | — | `data-testid="advanced-filters-trigger"` | aktif gelişmiş filtre sayısı rozet olarak |

### Gelişmiş filtreler paneli
Başlık "Gelişmiş Filtreler / Advanced Filters". Gruplar açılır/kapanır — **varsayılan kapalı** (değeri olan grup açık gelir); önce grup başlığına tıklayıp açmak gerekir. Değişiklikler ancak "Filtreleri Uygula" ile uygulanır.
| Grup (tr / en) | Label (tr / en) | Query key | Kontrol tipi | Varsayılan/Not | Locator ipucu |
|---|---|---|---|---|---|
| Görünürlük / Visibility | Katalog Görünürlüğü / Catalog Visibility | `visibility` | Select | Tüm Görünürlük, Her Yerde Görünür, Sadece Katalog, Sadece Arama, Görünmez | `#visibility` |
| Fiyat Aralığı / Price Range | kaydırıcı + Min Fiyat / Min Price, Max Fiyat / Max Price | `minPrice`, `maxPrice` (para birimi otomatik) | kaydırıcı + number | para birimi yüklenmeden pasif; kaydırıcı üst sınırı katalogdaki en yüksek fiyata göre (en az 1000) | min input `data-testid="advanced-min-price"` |
| Stok / Inventory | Min Stok / Min Stock, Max Stok / Max Stock | `minInventory`, `maxInventory` | kaydırıcı (0-500, adım 10) + number | 0 = filtre yok | — |
| Kategori ve Marka / Category & Brand | Kategori / Category | `categoryId` | Select (içinde arama kutusu "Kategori ara") | tek kategori | `#category` |
| | Marka / Brand | `brand` | Select | Tüm Markalar | — |
| | Etiketler / Tags | `tags` | text "Virgülle ayrılmış etiketler" | | `#tags` |
| Ürün Özellikleri / Product Attributes | Öne Çıkan / Featured | `isFeatured` | Select: Tüm Ürünler / Sadece Öne Çıkanlar / Öne Çıkmayan | | `#featured` |
| | Aktiflik Durumu / Active Status | `isActive` | Select: Tüm Ürünler / Sadece Aktif / Pasif | | `#active` |
| Tarih Filtreleri / Date Filters | Oluşturulma: Başlangıç/Bitiş; Güncellenme: Başlangıç/Bitiş | `createdFrom`, `createdTo`, `updatedFrom`, `updatedTo` | tarih (native, YYYY-MM-DD) | | — |
| SKU Arama / SKU Search | placeholder "SKU girin, virgülle ayırın" | `skus` | text | virgülle ayrılmış birden çok SKU | — |
| Veri Kalitesi / Data Quality | Görseller / Images | `hasImages` | Select: Görselli / Görsel Eksik | | `#hasImages` |
| | SEO Verisi | `hasSeoData` | Select: SEO Mevcut / SEO Eksik | | `#hasSeoData` |
| | Kargo Ağırlığı / Shipping Weight | `missingShippingWeight` | Select: Tüm Ürünler / Ağırlık veya Ölçüsü Eksik | | `#missingShippingWeight` |
| | Kategoriler | `hasCategories` | Select: Kategorili / Kategorisiz | | `#hasCategories` |
| | Varyantlar | `hasVariants` | Select: Varyantlı / Varyantsız | | `#hasVariants` |
Footer: "Sıfırla / Reset" (gelişmiş filtreleri temizler), "Filtreleri Uygula / Apply Filters" (`data-testid="advanced-filters-apply"`, paneli kapatır, sayfa 1'e döner).

### Sayfalama
- Sayfa başına sabit 20 ürün (UI'da değiştirilemez).
- Filtre durumu adres çubuğuna **yazılmaz**. Sayfa yenilenince filtreler sıfırlanır; filtreli liste doğrudan link ile açılamaz.

### Kod ile ekleme dialog'u
| Label (tr / en) | Kontrol | Validasyon | Locator |
|---|---|---|---|
| EAN modu: başlık "EAN ile Ürün Ekle", label "Avrupa Ürün Numarası (EAN) / European Article Number (EAN)", placeholder "orn., 4006381333931" | text (rakam) | yalnız rakam, tam 13 hane; sağda `n/13` sayacı | `#code-lookup-input` |
| Barkod modu: "Barkod ile Ürün Ekle", label "Barkod / Barcode", placeholder "Ürün barkodunu girin" | text | boş olmayan, max 50 | `#code-lookup-input` |
Buton "Ara / Look Up" (veya Enter) → `/products/new-by-code?mode={ean|barcode}&code=...` → [product-new-by-code.md](./product-new-by-code.md).

### Çoğalt dialog'u
Başlık "Ürünü Çoğalt / Duplicate Product".
| Bölüm | Label (tr / en) | Alan | Kontrol | Varsayılan | Not |
|---|---|---|---|---|---|
| Adlandirma / Naming | Ad Eki / Name Suffix | `nameSuffix` | text | `" (Copy)"` | altında "Yeni ad: …" önizleme |
| | SKU Stratejisi / SKU Strategy | `skuStrategy` | Select | "-KOPYA eki ekle" (→ `{sku}-COPY`); "Artan numara ekle" (→ `{sku}-1`); "Özel SKU" | |
| | Özel SKU / Custom SKU | `customSku` | text (otomatik BÜYÜK harf) | — | yalnızca Özel SKU'da; boşsa toast "Lütfen özel bir SKU girin" |
| Dahil Edilecek İçerik | Varyantlar / Variants | `includeVariants` | switch | true | **yalnızca varyantlı üründe görünür** |
| | Etiketler / Labels | `includeLabels` | switch | true | |
| | Özel Seçenekler / Custom Options | `includeCustomOptions` | switch | true | |
| | Iliskiler / Relationships | `includeRelationships` | switch | **false** | |
| Medya İşleme | Medya Stratejisi / Media Strategy | `mediaStrategy` | Select | aynı dosyalara referans (varsayılan); kopyala; atla | |
| Başlangıç Ayarları | Başlangıç Durumu / Initial Status | `initialStatus` | Select | Taslak / Yayında | Yayında + kategorisiz ürün → reddedilir ("Yayındaki bir ürünün en az bir kategorisi olmalı…") |
| | Envanteri Sıfırla / Reset Inventory | `resetInventory` | switch | true | |
Butonlar: "İptal / Cancel", "Çoğalt / Duplicate" (yüklenirken "Çoğaltılıyor...").

### CSV içe aktarma
Adımlar: Yükle/Upload → Eşleştirme/Mapping → Doğrulama/Validation → İçe Aktar/Import. Dosya: `.csv`, max 10 MB, tek seferde en çok 1000 satır. Doğrulama adımında çakışma stratejisi seçimi (varsayılan Atla/SKIP; seçenekler SKIP / UPDATE / CREATE_NEW). Butonlar: "Geri / Back", "Doğrula / Validate" (zorunlu alan eşleşmesi eksikse pasif), "{count} Ürünü İçe Aktar / Import {count} Products", "Tamam / Done", "İptal/Kapat". Kolon sözlüğü ve şablon indirme bu dokümanın kapsamı dışında — doğrulanmadı.

### Örnek ürünler (Presets) dialog'u
Yalnızca boş-katalog ekranındaki "Örneklere Göz At / Browse Presets" ile açılır. Sektör seç (Moda, Elektronik, Ev ve Yaşam, Yiyecek ve İçecek, Genel) → Önizleme → "Örnekleri Uygula / Apply Samples": her örnek için bir ürün oluşturulur (kategorisiz, bu yüzden Taslak). Toast: "Örnekler Eklendi / Samples Added" — "{count} demo ürün oluşturuldu"; kısmi hata "{total} üründen {failed} tanesi oluşturulamadı".

## Aksiyonlar
| Buton (tr / en) | Ne yapar | Onay | Başarı toast | Hata toast | Sonra |
|---|---|---|---|---|---|
| Ürün Ekle / Add Product → Ürün Ekle | `/products/new` | — | — | — | [product-create.md](./product-create.md) |
| EAN ile / Barkod ile Ürün Ekle | Kod arama dialog'u | — | — | — | `/products/new-by-code?mode&code` |
| Ürünleri Dışarı Aktar / Export Products | **Yalnızca görünen sayfadaki (≤20) ürünleri** CSV'ye yazar, dosya `products-export-YYYY-MM-DD.csv`. Kategoriler slug olarak | — | "İşlem başarıyla tamamlandı" + "{count} ürün CSV olarak disari aktarıldı." | dışa aktarma hatası | dosya indirilir |
| Ürünleri İçeri Aktar / Import Products | CSV içe aktarma sihirbazı | sihirbaz | "Ürünler başarıyla içeri aktarıldı" | içe aktarma hata mesajları | liste yenilenir |
| Satır: Arşivle / Archive | Onay dialog'u: başlık "Bu ürün arşivlensin mi? / Archive this product?", açıklama "Ürün mağazadan gizlenir ve daha sonra arşivden geri yüklenebilir." + stok varsa "Bu ürünün depoda hâlâ {count} adet stoğu var — ...". Butonlar "İptal / Cancel", "Arşivle / Archive" | evet | "Ürün başarıyla arşivlendi / Product archived successfully" | hata mesajı veya "Ürün silinemedi. Lütfen tekrar deneyin." | satır kaybolur (arşivliler gizli) |
| Satır: Geri Yükle / Restore | Durum → Taslak | **onaysız** | "Ürün başarıyla geri yüklendi" | geri yükleme hatası | liste yenilenir |
| Satır: Kalıcı olarak sil / Delete permanently | Yazarak onay dialog'u: başlık "Bu ürün kalıcı olarak silinsin mi?", açıklama + "Bu işlem geri alınamaz."; input label "Onaylamak için {sku} yazın" (placeholder = SKU), buton "Kalıcı olarak sil" — SKU birebir yazılmadan pasif | evet (SKU yazarak) | "Ürün kalıcı olarak silindi" | dialog içinde (toast değil) `role=alert`: SKU eşleşmiyor / önce arşivlenmeli / "{count} adet birim hâlâ açık siparişlere ayrılmış..." / genel hata | liste yenilenir |
| Satır: Çoğalt / Duplicate | Ürünü kopyalar | dialog | "Ürün Çoğaltıldı" + "\"{name}\" ürünü {sku} SKU ile oluşturuldu" | "Ürün cogaltilamadi" veya kategori/yayın hatası | liste yenilenir; yeni ürüne **yönlendirme yok** |
| Satır: ID Kopyala | panoya ürün id'si | — | toast yok | — | — |
| Tümünü temizle / Clear all | tüm hızlı+gelişmiş filtreleri ve "arşivlenenleri göster"i sıfırlar | — | — | — | — |
| Tekrar Dene / Retry | listeyi yeniden yükler | — | — | — | — |
| Boş durum: Ürün Ekle / CSV İçeri Aktar / Örneklere Göz At / Filtreleri Temizle | ilgili akışı açar | — | — | — | — |

Boş durum metinleri: katalog boş → "İlk ürününü ekleyelim! / Let's add your first product!" + 3 kart (Hızlı Ekle, Ürünleri İçeri Aktar, Örnekleri Dene). Filtre sonucu boş → "Filtrelere uyan ürün yok / No products match your filters" + "Filtreleri Temizle". Boşken tablo başlığı gizlenir (filtre yoksa).

## Yan etkiler
- Arşivleme: durum = Arşivlendi, stok değişmez; ürün vitrin aramasından birkaç dakika içinde düşer.
- Geri yükleme: durum Taslak olur (yayına almak için ayrıca düzenleme gerekir).
- Kalıcı silme: ürün + tüm varyantlar silinir, ayrılmış stok serbest bırakılır; geri alınamaz.
- Çoğaltma: yeni ürün (varsayılan Taslak, stok sıfır) oluşur.
- Tüm işlemlerden sonra liste yenilenir.
- Dışa aktarma tarayıcıda yapılır; kayıt değiştirmez.

## Tuzaklar
- **URL'de locale yok**: `{ADMIN_URL}/products`. Dil değiştirmek için dil seçici kullanılır.
- Arama sonuçlarını okumadan önce listenin yenilenmesini bekle; aramaya 1. sayfadayken başla.
- Tip/Durum/Görünürlük/Sıralama seçimleri dar ekranda (<640px) **gizli** — tarayıcı penceresi ≥640px olmalı.
- Gelişmiş filtre grupları kapalı açılır; alanlara erişmek için önce grup başlığına tıkla. Değerler "Filtreleri Uygula"ya basmadan uygulanmaz.
- Kategori filtresi tek kategori seçer.
- Filtreler URL'de tutulmaz; doğrudan link ile filtreli listeye gidilemez → arama kutusunu kullan.
- Seçili-mod toplu işlemler yalnız sayfada seçili satırlara uygulanır. Filtreye uyan tüm ürünler için seçimsiz modda "Toplu İşlemler → … (Tümü)" (Apply to All) kullanılmalı — bkz. [product-bulk-edit.md](./product-bulk-edit.md). Toplu işlemden önce seçimi snapshot'ta kontrol et.
- Tekil "Arşivle" onay dialog'unun başlığı "arşivlensin mi"dir; "Sil" değil "Arşivle" butonu aranmalı.
- "Geri Yükle" onaysız ve anında çalışır.
- Dışa aktarma sadece **görünen sayfayı** (max 20 satır) aktarır, tüm katalog değil.
- Çoğaltma sonrası liste yenilenir; yeni ürün varsayılan **Taslak** ve adı "… (Copy)" olur.
- Stok kolonu canlı satılabilir değeri gösterir; stok kaydı olmayan ürünlerde 0/kırmızı görülebilir (doğrulanmadı).

## Doğrulama
- Oluşturma/düzenleme sonrası: arama kutusuna SKU veya ad yaz (1. sayfadayken), satırda ad/SKU/tip/durum/fiyat/stok değerlerini kontrol et; gerekirse "Arşivlenenleri göster"i aç.
- Arşivleme sonrası: ürün varsayılan listede kaybolur; "Arşivlenenleri göster" açıkken durum rozeti "Arşivlendi".
- Geri yükleme sonrası: durum "Taslak".
- Kalıcı silme sonrası: "Arşivlenenleri göster" açıkken bile SKU aramasında çıkmaz.
- Toplam sayı başlıktaki rozetten okunabilir.

## Ek: `products/categories` adresi
- URL: `{ADMIN_URL}/products/categories`.
- Doğrudan `/categories` sayfasına yönlendirir; kendi ekranı yoktur. Kategori yönetimi için ../categories/ ekran dokümanlarına bak.
