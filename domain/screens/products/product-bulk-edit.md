# Ürün Toplu İşlemleri (Bulk Edit / Bulk Actions)

- URL: Ayrı bir sayfa değil; ürün listesindeki "Toplu İşlemler / Bulk Actions" açılır menüsü: `{ADMIN_URL}/products` (locale URL'de yok). Seçim yokken "Apply to All" modu, ≥1 satır seçiliyken seçili mod.
- Amaç: Seçili ürünlere (sayfadaki seçili satırlar) veya filtreye uyan **tüm** ürünlere (Apply to All) durum, fiyat, kategori, etiket, öne çıkan, stok, para birimi ve arşiv/silme işlemlerini toplu uygulamak.
- Yetki (permission):
  - Menü görünürlüğü: `products:bulk` veya `products:write`. Yoksa "Toplu İşlemler" butonu hiç görünmez.
  - "Kalıcı olarak sil" (toplu): `products:delete:permanent`.
  - Toplu işlemlerin kaydı: `products:write`. Etkilenen ürün sayımı: `products:read`.
- İşlemler (ne yapar):
  | Aksiyon | Ne yapar | Ek bilgi |
  |---|---|---|
  | Seçili-mod işlemleri | Seçili ürün id'lerine tek istekte işlem uygular | aksiyon: durum, fiyat, kategori, etiket, öne çıkan, stok, para birimi, arşiv |
  | Toplu sil (= arşiv) | Seçili ürünleri arşivler | kalıcı değil |
  | Toplu kalıcı sil | Her ürün için SKU onayıyla **sırayla** kalıcı silme | yalnız arşivli ürünler |
  | Apply to All sayaç | Filtreye uyan ürün sayısını getirir | |
  | Apply to All adım 1 (önizleme) | Etkilenecek ürün/varyant/SKU sayısını, ilk 5 örnek ürünü ve bir onay belirteci döner | belirteç 5 dk geçerli |
  | Apply to All adım 2 (uygula) | Onay belirteciyle aynı aksiyon+filtreyi tüm eşleşen ürünlere uygular | |
  - Sonuç: güncellenen / başarısız ürün ve varyant sayıları; başarısız olanlar için ürün + hata kodu + mesaj. Fiyat/stok/para birimi işlemleri ürün ve varyant bazında özet + hata listesi döner; durum/kategori/etiket/öne çıkan/arşiv eşleşen/değişen sayı döner.

## Ön koşullar ve bağımlılıklar
- Ürünler mevcut olmalı ([product-list.md](./product-list.md), [product-create.md](./product-create.md)).
- Kategori işlemleri: hedef kategoriler önceden oluşturulmuş olmalı (bkz. ../categories/). Liste yalnızca mevcut kategorileri gösterir; yeni kategori bu ekrandan oluşturulamaz.
- **Durumu "Yayında" yapmak**: her ürünün en az bir kategorisi olmalı; aksi halde tüm istek reddedilir → "Yayındaki bir ürünün en az bir kategorisi olmalı…".
- Stok güncelleme: tenant'ın **varsayılan deposu** olmalı; yoksa "No default warehouse found for this tenant. Please create a warehouse first." hatası. Depo ekranı: [../inventory/warehouses.md](../inventory/warehouses.md).
- Para birimi dönüştürme: hedef ve kaynak para birimleri aktif ve geçerli döviz kuruna sahip olmalı (ayarlar → para birimleri; doğrulanmadı).

## Yerleşim
İki mod vardır:

### A) Seçim yokken — "Apply to All" modu
Filtre satırının solunda "Toplu İşlemler / Bulk Actions" butonu. Menü:
- Etiket: "Fiyat Güncelle / Update Prices"
- "Fiyat Güncelle (Tümü) / Update Prices (All)"
- "Durum Değiştir (Tümü) / Change Status (All)"
- "Kategori Ata (Tümü) / Assign Categories (All)"
- "Etiket Ata (Tümü) / Assign Tags (All)"
- alt not: "Daha fazla işlem için ürün seçin / Select products first for more actions"
Her biri sağdan açılan "Apply to All" panelini açar (adımlar aşağıda).

### B) ≥1 ürün seçiliyken — seçili mod
Seçim çubuğunda "Toplu İşlemler" butonu; menü etiketi "{count} ürün seçildi". Öğeler (sırasıyla):
1. "Durumu Değiştir / Change Status" → Durum dialog'u
2. "Arşivle / Archive" → Arşiv onayı
3. "Fiyatı Güncelle / Update Price" → Fiyat dialog'u
4. "Kategorileri Yönet / Manage Categories" → Kategori dialog'u
5. "Etiketleri Yönet / Manage Tags" → Etiket dialog'u
6. "Öne Çıkanı Ayarla / Set Featured" → Öne çıkan dialog'u
7. "Stoku Güncelle / Update Stock" → Stok dialog'u
8. "Para Birimi Dönüştür / Convert Currency" → Para birimi dialog'u
9. "Sil / Delete" (kırmızı; **seçimin tamamı arşivli değilse** görünür) → arşiv-olarak-sil onayı
10. "Kalıcı olarak sil / Delete permanently" (kırmızı; yalnızca seçimin **tamamı arşivli** ve yetki varsa) → toplu kalıcı silme dialog'u

## Alanlar

### B1. Durumu Değiştir dialog'u
Başlık "Durumu Değiştir / Change Status", açıklama "{count} seçili ürünün durumunu güncelle".
| Label (tr / en) | Payload key | Kontrol | Zorunlu | Varsayılan / seçenekler | Locator |
|---|---|---|---|---|---|
| Yeni Durum / New Status | `statusData.status` | Select | evet | `published` (Yayında). Seçenekler: Taslak/Draft, Yayında/Published, Arşivlendi/Archived | dialog içindeki tek combobox |
Buton: "İptal", "Durumu Değiştir" (yüklenirken "Güncelleniyor...").
Etki: Yayında dışına geçişte ürünün varyantları pasifleşir; kategori ürün sayaçları güncellenir; vitrin araması güncellenir.

### B2. Arşivle onayı ve Sil onayı
- Arşivle: başlık "{count} Ürün Arşivlensin mi? / Archive {count} Products?", açıklama "Arşivlenen ürünler mağazadan gizlenir ancak daha sonra geri yüklenebilir."; butonlar "İptal", "Arşivle" ("Arşivleniyor...").
- Sil: başlık "{count} Ürün Arşivlensin mi?", açıklama "Seçilen ürünler mağazadan gizlenir ve aktif katalogdan çıkarılır. Kalıcı olarak silinmez..."; butonlar "İptal", "Sil / Delete" (yüklenirken "Arşivleniyor..."). "Sil" ve "Arşivle" aynı sonucu verir: ürünler ve varyantları arşivlenir.

### B3. Fiyatı Güncelle dialog'u
Başlık "Fiyatı Güncelle / Update Price", açıklama "{count} seçili ürünün fiyatını ayarla".
| Label (tr / en) | Payload key | Kontrol | Zorunlu | Varsayılan / validasyon | Locator |
|---|---|---|---|---|---|
| Güncelleme Türü / Update Type: "Belirli bir tutara ayarla / Set to specific amount", "Artır / Increase by", "Azalt / Decrease by" | `priceData.type` = `set`/`increase`/`decrease` | radio | evet | `set` | `#set`, `#increase`, `#decrease` / `getByLabel(...)` |
| Değer / Value (placeholder "Tutar girin" veya "Yüzde girin") | `priceData.value` | number (min 0, adım 0.01) | evet | boşsa buton pasif; geçersiz/negatifse toast "Lütfen geçerli bir fiyat değeri girin" | dialog içindeki number input |
| % | `priceData.isPercent` | switch | hayır | false | `#percent` |
| Varyantları dahil et / Include variants | `options.includeVariants` | switch | hayır | true | `#variants` |
Buton "Fiyatı Güncelle" ("Güncelleniyor..."). Sonuç fiyat negatif olamaz.

### B4. Kategorileri Yönet dialog'u
Başlık "Kategorileri Yönet / Manage Categories", açıklama "{count} seçili ürünün kategorilerini güncelle".
| Label (tr / en) | Payload | Kontrol | Zorunlu | Not | Locator |
|---|---|---|---|---|---|
| İşlem / Action: "Kategorilere ekle / Add to categories", "Kategorilerden kaldır / Remove from categories", "Tüm kategorileri değiştir / Replace all categories" | action = `addCategories` / `removeCategories` / `setCategories` | radio | evet | varsayılan ekle; mod değişince seçimler sıfırlanır; değiştir modunda kırmızı uyarı "Bu işlem seçili ürünlerin mevcut kategorilerini kaldırıp yalnızca seçtiğiniz kategorileri bırakacaktır." | `#cat-add`, `#cat-remove`, `#cat-set` |
| Kategori Seç / Select Categories | `categoryData.categoryIds` | tıklanabilir rozet (chip) listesi (aç/kapa), `aria-pressed` | evet (≥1) | Ekle modunda seçili ürünlerin mevcut kategorileri kesikli kenarlı ("Seçili ürünlerin hepsi zaten bu kategoride") veya gri ("Seçili ürünlerin bazıları bu kategoride") gösterilir; `data-state` = checked/assigned/indeterminate/unchecked. Kategori yoksa "Kategori bulunamadı" | rozetler buton rolünde değil — `getByText('<kategori adı>', { exact: true })` veya `aria-label` "<ad> — <durum>" |
Buton "Kategorileri Yönet" (≥1 seçim yoksa pasif; boş gönderimde toast "Lütfen en az bir kategori seçin").

### B5. Etiketleri Yönet dialog'u
| Label (tr / en) | Payload | Kontrol | Zorunlu | Not | Locator |
|---|---|---|---|---|---|
| İşlem: "Etiket ekle / Add tags", "Etiket kaldır / Remove tags", "Tüm etiketleri değiştir / Replace all tags" | `addTags`/`removeTags`/`setTags` | radio | evet | varsayılan ekle | `#tag-add`, `#tag-remove`, `#tag-set` |
| Etiket Girin (virgülle ayırın) / Enter Tags (comma-separated), placeholder "etiket1, etiket2, etiket3" | `tagData.tags` (virgülle bölünür, kırpılır) | text | evet (≥1) | boşsa buton pasif | `getByPlaceholder('etiket1, etiket2, etiket3')` |
Buton "Etiketleri Yönet".

### B6. Öne Çıkan dialog'u
| Label (tr / en) | Payload | Kontrol | Varsayılan |
|---|---|---|---|
| Öne Çıkan Ürünler / Featured Products ("Öne çıkan ürünler mağazada belirgin konumlarda gösterilir") | `featuredData.isFeatured` | switch | true |
Buton metni switch'e göre: "Öne Çıkan Olarak İşaretle / Mark as Featured" veya "Öne Çıkanı Kaldır / Remove Featured".

### B7. Stoku Güncelle dialog'u
| Label (tr / en) | Payload | Kontrol | Zorunlu | Validasyon | Locator |
|---|---|---|---|---|---|
| Yeni Stok Miktarı / New Stock Quantity (placeholder "Miktar girin") | `stockData.quantity` (tam sayı) | number (min 0) | evet | boşsa pasif; geçersiz/negatif → toast "Lütfen geçerli bir miktar girin" | dialog'daki number input |
| Varyantları dahil et | `options.includeVariants` | switch | hayır | true | `#stock-variants` |
Buton "Stoku Güncelle". Girilen değer **mutlak miktar** olarak yazılır (doğrulanmadı). Depo: tenant varsayılan deposu. Kısmi hata nedenleri: "bu ürün için envanter kaydı yok", "yetersiz stok", "stok bu sırada değişti — lütfen tekrar deneyin", "geçersiz stok işlemi".

### B8. Para Birimi Dönüştür dialog'u
Başlık "Toplu Para Birimi Dönüştürme / Bulk Currency Conversion".
| Label (tr / en) | Payload | Kontrol | Zorunlu | Not |
|---|---|---|---|---|
| Hedef Para Birimi / Target Currency (placeholder "Hedef para birimi seçin") | `currencyConversionData.targetCurrency` (3 harf ISO) | Select; seçenek metni "`{code} ({symbol}) — {name}`"; açılınca yüklenir (yüklenirken iskelet) | evet | |
| Döviz Kuru / Exchange Rate | `currencyConversionData.exchangeRates` (kaynak para birimi başına hedef/kaynak kur oranı) | salt-okunur | otomatik | geçerli kur yoksa "Geçerli döviz kuru hesaplanamadı — para birimi yapılandırmasını kontrol edin" ve buton pasif |
| Dönüştürme Önizleme | — | tablo (ilk 5 ürün, "+{count} daha") + özet "Toplam: … Tahmini toplam: ~…" | — | |
Sarı uyarı "Bu işlem geri alınamaz". Buton "Para Birimi Dönüştür" ("Dönüştürülüyor..."). Kurlar >0 ve ≤100000 olmalı.

### B9. Toplu Kalıcı Silme
Yazarak onay dialog'u: başlık "{count} ürün kalıcı olarak silinsin mi?", açıklama + ilk 10 SKU listesi ("+{count} tane daha") + "Bu işlem geri alınamaz."; input label "Onaylamak için {count} yazın" (placeholder = sayı); buton "Kalıcı olarak sil" (yazılan metin sayı ile birebir eşleşmeden pasif). Her ürün sırayla kendi SKU onayıyla kalıcı silinir.

### A. Apply to All paneli
Adımlar: yapılandır → (filtre) → önizleme → uygulanıyor → tamamlandı. Panel başlığı aksiyon adı ("Fiyat Güncelle (Tümü)" vb.), açıklama "Filtrelere uyan tüm ürünlere uygulanacak / Applying to all products matching filters".

**Yapılandır adımı**:
- Kapsam kartı: "Kapsam / Scope", link "Filtreleri Düzenle / Edit Filters", aktif filtre rozetleri (durum, kategori sayısı, etiketler, fiyat aralığı), "{count} ürün". Başlangıç filtresi listedeki aktif filtrelerden (durum, arama + gelişmiş filtreler) gelir; listede arşivliler gizliyse ve durum seçili değilse arşivli ürünler hariç tutulur.
- Aksiyona özel alanlar:
| Aksiyon | Label (tr / en) | Payload | Kontrol | Varsayılan | Locator |
|---|---|---|---|---|---|
| Fiyat | Fiyat Değişikliği: "Artır / Increase", "Azalt / Decrease" | `priceData.type` = increase/decrease ("ayarla" yok) | radio | Artır | `#ata-increase`, `#ata-decrease` |
| Fiyat | Miktar / Amount (placeholder "10" veya "50.00") | `priceData.value` | number min 0 | — ; >0 olmalı | paneldeki number input |
| Fiyat | % | `priceData.isPercent` | switch | **açık** (seçili moddakinin tersine) | `#ata-percent` |
| Fiyat | Satış fiyatı / Sale price; Karşılaştırma fiyatı / Compare-at price | — | checkbox | true / false | `#ata-sale`, `#ata-compare` |
| Fiyat | Varyantları dahil et | `options.includeVariants` | switch | true | `#ata-variants` |
| Durum | Yeni Durum | `statusData.status` | Select | Yayında | — |
| Kategori | İşlem: ekle/kaldır/değiştir | add/remove/setCategories | radio | ekle | `#ata-cat-add`, `#ata-cat-remove`, `#ata-cat-set` |
| Kategori | Kategori Seç | `categoryData.categoryIds` | chip aç/kapa | — (≥1) | kategori adı metni |
| Etiket | İşlem: ekle/kaldır/değiştir | add/remove/setTags | radio | ekle | `#ata-tag-add`, `#ata-tag-remove`, `#ata-tag-set` |
| Etiket | Etiket Girin (virgülle ayırın) | `tagData.tags` | text | — | placeholder "etiket1, etiket2, etiket3" |
- Eşleşen 0 ise uyarı "Filtrelere uyan ürün bulunamadı. Filtreleri ayarlayın."
- Buton "Değişiklikleri Önizle / Preview Changes" (yapılandırma geçersiz veya 0 ürün iken pasif; yüklenirken "Uygulanıyor...").

**Filtre adımı** — "Filtreleri Düzenle" ile açılır:
| Label (tr / en) | Filtre key | Kontrol | Not |
|---|---|---|---|
| Durum / Status | `status` | Select: Tüm Durumlar / Taslak / Yayında / Arşivlendi | |
| Kategori / Category | `categoryIds[]` | chip aç/kapa (çoklu) | |
| Fiyat Aralığı / Price Range: Min / Maks | `minPrice`, `maxPrice` (para birimi otomatik) | number | para birimi yüklenmeden pasif |
| Ara / Search | `search` | text | |
| Sadece öne çıkan / Featured only | `isFeatured` | checkbox | `#ata-featured` |
Canlı sayaç "Eşleşen ürünler: {count}" (yazmayı bıraktıktan ~0,5 sn sonra güncellenir). Buton "Filtreleri Uygula" → yapılandır adımına döner.

**Önizleme adımı**: sarı kutu "{count} Ürüne Uygula" + özet; fiyat aksiyonunda örnek tablo (Ürün adı / Mevcut / Yeni; ilk 5, "... ve {count} ürün daha"); "Tahmini süre" (≤50 "Birkaç saniye", ≤200 "Yaklaşık 30 saniye", ≤500 "Yaklaşık 1 dakika", fazlası "Birkaç dakika sürebilir"); **"Onaylamak için ürün sayısını yazın / To confirm, type the number of products"** input (placeholder = sayı, otomatik odak). Butonlar "İptal" (yapılandır adımına döner), "{count} Ürüne Uygula / Apply to {count} Products" (yazılan değer etkilenen ürün sayısıyla birebir eşleşmeden pasif).

**Uygulanıyor adımı**: "{current} / {total} ürün güncelleniyor..." + ilerleme çubuğu, "Geçen süre: {time}", "Bu paneli kapatabilirsiniz. İşlem arka planda devam edecek." + "Arka Planda Çalıştır / Run in Background". Panel bu adımda kapatılırsa da arka plan moduna geçer.

**Tamamlandı adımı**: başarı → "Tamamlandı" + "{count} ürün başarıyla güncellendi"; hata → "{count} ürün başarısız oldu"; hata varsa "Hata Raporunu İndir" (`bulk-operation-errors.csv`: Product ID,Type,Error Code,Message); "Tamam / Done".

## Aksiyonlar (toast'lar)
| Durum | Başlık | Açıklama | Sonra |
|---|---|---|---|
| Seçili-mod tam başarı | "Başarılı / Success" | "{count} ürün güncellendi / Updated {count} product(s)" | liste yenilenir, seçim temizlenir, dialog sıfırlanır |
| Kısmi başarı | "Kısmi başarı" (hiç güncellenmediyse "Hata") — kırmızı | "{modified} güncellendi, {failed} başarısız" veya "{count} ürün güncellenemedi" + ": " + en fazla 3 neden | liste yenilenir, **seçim korunur** (tekrar denemek için) |
| İstek hatası | "Hata" | sunucu mesajı / "Toplu işlem başarısız oldu"; kategorisiz yayın → "Yayındaki bir ürünün en az bir kategorisi olmalı. Kategori ekleyin ya da taslak olarak kaydedin." | — |
| Toplu sil başarı | "Başarılı" | "{count} ürün arşivlendi / Archived {count} product(s)" | yenile + seçim temizlenir |
| Toplu sil hata | "Hata" | hata mesajı / "Ürünler silinemedi" | |
| Toplu kalıcı sil başarı | "İşlem başarıyla tamamlandı" | "{count} ürün kalıcı olarak silindi" | yenile, seçim temizlenir |
| Toplu kalıcı sil kısmi | "Kısmi başarı" | "{total} üründen {deleted} tanesi kalıcı olarak silindi: SKU: neden; …" | seçim korunur |
| Para birimleri yüklenemedi | "Hata" | hata mesajı / "Failed to load currencies" | |
| Apply-to-All önizleme hata | "Hata" | sunucu mesajı / "Preview failed" | |
| Apply-to-All önizleme süresi doldu | "Önizlemenizin süresi doldu. Devam etmek için tekrar önizleyin." | — | yapılandır adımına döner |
| Apply-to-All diğer hata | "Hata" (arka planda: "Toplu işlem başarısız oldu") | mesaj | önizleme adımına döner |
| Arka plana alındı | "Toplu işlem arka planda çalışıyor..." | — | |
| Arka planda tamamlandı | "Toplu işlem tamamlandı: {count} ürün güncellendi" | — | |
| Fiyat para birimi yüklenemedi | (para birimi yüklenemedi uyarısı) | — | fiyat aralığı devre dışı |

## Yan etkiler
- Durum değişikliği: Yayında dışına geçişte varyantlar pasifleşir, kategori ürün sayaçları güncellenir, vitrin araması güncellenir (birkaç dakika).
- Arşiv/sil: ürün + varyantları arşivlenir; stok değişmez.
- Fiyat/stok/para birimi: ürün ve (seçiliyse) varyant SKU'ları güncellenir; stok varsayılan depoya yazılır.
- Apply to All: önizlemede verilen onay **5 dakika geçerli ve tek kullanımlıktır**; aynı aksiyon ve filtreye bağlıdır. Arada filtre/aksiyon değişirse `BULK_CONFIRMATION_SELECTION_MISMATCH` ile reddedilir → yeniden önizle.
- Tüm işlemlerden sonra liste yenilenir.

## Tuzaklar
- **Seçili mod en fazla 500 ürün**. Liste sayfası 20 satır olduğundan pratikte ≤20.
- Seçili-mod işlemleri yalnızca sayfada seçili satırlara uygulanır. Filtreye uyan tüm ürünler için seçimi temizleyip seçimsiz moddaki "(Tümü)" aksiyonlarını kullan (yalnızca fiyat/durum/kategori/etiket için var; stok/öne çıkan/arşiv/para birimi için Apply-to-All yok).
- Durum "Yayında" + kategorisiz ürün → tüm istek reddedilir (kısmi uygulama yok).
- Seçili-mod fiyat dialog'unda varsayılan "Belirli bir tutara ayarla" ve **% kapalı**; Apply-to-All'da varsayılan "Artır" ve **% açık** — karıştırma.
- Apply-to-All fiyat işlemi satış fiyatını günceller.
- Apply-to-All önizleme ile uygulama arasında 5 dakikadan fazla bekleme; onay tek kullanımlıktır — hata sonrası yeniden "Değişiklikleri Önizle" gerekir.
- Apply-to-All onay input'una **önizlemede gösterilen** ürün sayısı birebir yazılmalı (ör. "137").
- Apply-to-All ilerleme çubuğu yaklaşık ilerleme gösterir; tamamlanmayı "Tamamlandı" metni veya toast ile bekle.
- Dialog'lar aksiyon butonuna basınca istek bitmeden kapanır; sonucu toast'tan oku.
- Seçili-mod dialog'larının değerleri yalnızca tam başarıda sıfırlanır; kısmi hatadan sonra dialog'u tekrar açınca önceki değerler durur.
- Kategori chip'leri buton rolünde değil; tıklamak için metin veya `aria-label` ile bul. Ekle modunda zaten atanmış kategoriler gri/kesikli görünür; tıklanırsa seçime eklenir.
- "Sil" menü öğesi **arşivler** (kalıcı değil). "Kalıcı olarak sil" yalnızca seçimin tamamı arşivliyken çıkar → önce "Arşivlenenleri göster" açılıp yalnızca arşivli ürünler seçilmeli.
- Toplu kalıcı silme ürünleri tek tek siler; çok ürün seçiliyse uzun sürer, dialog bu sırada kapatılamaz.
- Stok güncelleme mutlak miktar yazar ve varsayılan depoya gider; çok depolu tenant'ta beklenmeyen depo etkilenebilir (doğrulanmadı).

## Doğrulama
- Listede ilgili ürünleri ara (1. sayfada) ve kolonları kontrol et: Durum rozeti, Fiyat, Stok; kategori/etiket/öne çıkan için gelişmiş filtreler (Kategori, Etiketler, Öne Çıkan) ile süz veya ürün detayını aç ([product-detail.md](./product-detail.md)).
- Arşiv sonrası ürünler varsayılan listeden kaybolur; "Arşivlenenleri göster" ile "Arşivlendi" rozetiyle görünür.
- Apply-to-All sonunda "Tamamlandı / {count} ürün başarıyla güncellendi" görünmeli; hata varsa "Hata Raporunu İndir" CSV'si incelenmeli.
- Kısmi hata toast'ında listelenen nedenleri kullanıcıya aktar; seçim korunduğu için yeniden deneme mümkündür.
