# UI kalıpları ve Playwright locator stratejileri

Admin arayüzü shadcn/ui bileşenleriyle kuruludur (Select, Dialog, Tabs, Switch… erişilebilirlik rolleriyle gelir).

Genel kural: önce `browser_snapshot` → erişilebilirlik ağacındaki **rol + isim** ile hedefle. CSS sınıfına bağlanma
(sınıflar değişkendir). `data-testid` seyrek; varsa kullan.

---

## 1. Formlar

- Formların çoğu etiketli alanlar + alan altı hata mesajı kalıbını kullanır. Bazı formlar (login, sipariş oluşturma,
  ayar panelleri) daha sade yapıdadır.
- Form alanı DOM'u:
  - Etiket → `<label for="{id}-form-item">`; hata varsa kırmızı görünür.
  - Kontrolün kendisi → `id="{id}-form-item"`, `aria-invalid="true|false"`,
    `aria-describedby="{id}-form-item-description {id}-form-item-message"`.
  - Hata mesajı → `<p id="{id}-form-item-message">` (kırmızı küçük metin).
  - Bu yüzden **`getByLabel('<etiket>')` çoğu alanda çalışır** (Select/Checkbox/Switch'te de; label `for` → tetikleyici buton id).
- Validasyon: Kaydet'e basınca, bazı alanlarda yazarken/alandan çıkınca. Kaydet'e bastıktan sonra:
  1. `browser_snapshot` → `aria-invalid="true"` olan kontrolleri ve kırmızı hata mesajlarını oku.
  2. Sekmeli formlarda hata başka sekmede olabilir; sekme başlığında kırmızı nokta/ikon çıkar (ürün formu).
  3. Hata mesajları ekranda seçili dilde çevrilmiş metin olarak görünür.
- Bazı formlar üstte toplu hata kutusu gösterir: `data-testid="validation-error-alert"` (layout-settings header/footer panelleri).
- Sunucu hatası: genellikle kırmızı **toast** + bazen form üstünde kırmızı uyarı kutusu (`role="alert"`).
- Playwright doldurma:
  - Metin: `page.getByLabel(/Ürün Adı|Product Name/).fill('...')` (MCP: `browser_type` ref ile; `browser_fill_form` birden çok alan).
  - Sayısal/fiyat: `fill('149.90')` — ondalık ayırıcı nokta; Türkçe görünüm biçimi alanda farklı gösterilebilir (doğrulanmadı per ekran).
  - Kontrollü input'larda `fill` sonrası değer alandan çıkınca işlenir; kritik alanlarda `press('Tab')`.

## 2. Bileşen → DOM/ARIA → locator

| Bileşen (kullanım) | DOM/ARIA | Nasıl sürülür |
|---|---|---|
| **Select** (açılır seçim) | Tetikleyici `button[role=combobox]` (aria-expanded), seçenekler sayfa sonunda açılan katmanda `div[role=listbox] > div[role=option]`. Native `<select>` DEĞİL; arkada gizli native select olabilir. | `getByLabel(/Vergi Sınıfı|Tax Class/).click()` (veya `getByRole('combobox', {name})`) → `getByRole('option', { name: 'KDV %20' }).click()`. **`browser_select_option` kullanma** (yalnız native). Enter ile seçme. Seçimden sonra tetikleyici metnini doğrula. |
| **Combobox / aramalı seçici** | Tetikleyici `button[role=combobox]`; açılınca açılır panelde arama kutusu `input[cmdk-input]` (placeholder ör. `Ara...`) ve `[role=option]` / `[cmdk-item]` | tetikleyiciye tıkla → arama kutusuna yaz → `browser_wait_for` sonuç metni → `getByRole('option', { name })` tıkla. Sunucudan arayan seçicilerde (ürün/kategori seçici) yazdıktan sonra sonuç ~300-400 ms gecikmeyle gelir. |
| **Dialog** | `div[role=dialog]` + başlık `h2`; Esc ve dış tık kapatır | `getByRole('dialog', { name: /Başlık/ })` içinde kapsamla. |
| **AlertDialog** — onay pencereleri | `div[role=alertdialog]`, İptal ve onay butonları | `getByRole('alertdialog')` → `getByRole('button', { name: /Sil|Delete|Onayla|Confirm/ })`. **Yalnızca kullanıcı onayından sonra.** |
| **Sheet** — sağdan açılan panel | `role=dialog` | Dialog gibi. Ör. Mağaza görünümü ekle/düzenle, kargo taşıyıcı ayarı, tenant detayı. |
| **Tabs** | `div[role=tablist] > button[role=tab][aria-selected]`, içerik `div[role=tabpanel]` | `getByRole('tab', { name: /Fiyatlandırma|Pricing/ }).click()`. Pasif sekmenin alanları çoğu ekranda DOM'da yoktur; ürün formunda DOM'da ama gizlidir → snapshot'ta çıkmayabilir: önce sekmeye tıkla. |
| **Switch** | `button[role=switch][aria-checked]` | `getByRole('switch', { name: /Aktif|Active/ })` → `aria-checked` oku, gerekiyorsa tıkla. `check()` yerine tıklama + doğrulama. |
| **Checkbox** | `button[role=checkbox][aria-checked=true|false|mixed]` (native input değil) | `getByRole('checkbox', { name })` / `getByLabel`. Tablo satır seçimi de bu. |
| **RadioGroup** | `div[role=radiogroup] > button[role=radio]` | `getByRole('radio', { name })`. Ürün tipi seçimi gibi kart-radyolar. |
| **Tarih** | Çoğunlukla **native** `input[type=date]` / `type=datetime-local`; bazen takvim açılır seçici (placeholder `Pick a date`) | Native: `fill('2026-11-01')` / `fill('2026-11-01T09:00')`. Kampanya/kupon/promosyon pencere saatleri **mağaza saat diliminde** yorumlanır. Takvim seçici: tetikleyici → takvimde gün butonu `getByRole('gridcell', { name: '1' })` (doğrulanmadı). |
| **Dosya yükleme** | Gizli `<input type=file>` + sürükle-bırak alanı veya buton; dosya türü, boyut ve adet sınırı yüklemeden önce kontrol edilir, reddedilen dosya için toast çıkar | MCP: alanı/butonu tıkla → `browser_file_upload` (yalnızca kullanıcının verdiği yol). Playwright: `page.locator('input[type=file]').setInputFiles(path)`. Yükleme sonrası önizleme/küçük resim çıkmasını bekle. |
| **Medya seçici** (medya kütüphanesi penceresi, form içi medya seçici alanı) | Dialog, sekmeler: göz at / yükle | Var olan görsel: Dialog'da ara/tıkla → seç. Yeni görsel: yükle sekmesi → `browser_file_upload`. Banner/logo/blog/SEO görselleri bu yolu kullanır. |
| **Zengin metin** | Zengin metin editörü yalnızca e-posta şablon ekranında. Ürün açıklaması düz çok satırlı metin kutusu. Sayfa/blog/ana sayfa içeriği **blok editörü** (`data-testid="block-editor"`) | Metin kutusu: `fill`. Zengin metin: `div[contenteditable=true]` → `click` + `type` (fill çalışmayabilir). Blok editörü: ekran dosyalarına bak (`../screens/design/`, `../screens/content/`). |
| **Sürükle-bırak** | Ürün medya sırası, navigasyon ağacı, kargo öncelik listesi, Meta huni aşamaları, sıralanabilir listeler | Gerçek fare hareketi ister: `browser_drag` (veya `mouse.down/move/up` adımlı). Klavye desteği varsa: tutamaca odaklan → `Space` → ok tuşları → `Space` (doğrulanmadı). Mümkünse sıra numarası/yukarı-aşağı butonu alternatifini tercih et. |
| **Workflow tuvali** | `/marketing/workflows/[id]` görsel akış düzenleyici; sol panel "Adım ekle" + tuval. Yalnız **≥768 px** pencerede düzenlenir, daha darda salt okunur | Adım eklemek: `data-testid="node-palette-wait|condition|send"` → `data-testid="canvas-drop-zone"` (`browser_drag`). Bağlamak: kaynak düğümün çıkış noktası (aria-label "Sonraki adım"; koşulda "Evet" / "Hayır") → hedefin giriş noktası (aria-label "Gelen"), `browser_drag`. Düğüm panelindeki "Kaydet" yalnız tuval taslağıdır; kalıcı kayıt alt çubuktaki "Kaydet" (`data-testid="workflow-save"`). Ayrıntı: [../screens/marketing/workflows.md](../screens/marketing/workflows.md). |
| **Fiyat girişi** | `input` + para birimi eki | `fill`. |
| **Telefon** | Ülke kodu butonu ("Select country", vars. +90) + `textbox` "Phone"/"Telefon"; değer "+90 532 418 27 63" biçiminde gösterilir | Tek seferde `fill` ile yazılan numara kaydolmayabilir: alana tıkla → `End` → yalnız rakamları `browser_type` ile **tuş tuş** (`slowly: true`) yaz → snapshot'ta biçimli numarayı doğrula. Kayıttan sonra detayda numaranın göründüğünü kontrol et. |
| **Onay için yazarak doğrulama** (kalıcı ürün silme, toplu kalıcı silme) | AlertDialog + `input` placeholder = beklenen metin (SKU), hata `p[role=alert]` | Kullanıcı onayından sonra beklenen metni yaz → aksiyon butonu aktifleşir. |

## 3. Toast (bildirim)

- Toast'lar ekranın **sağ üstünde** çıkar, aynı anda en fazla 5 tane.
- Görünümler: yeşil (başarı ve bilgi aynı görünür), kırmızı (hata), sarı (uyarı).
  Başarı ile bilgi görsel olarak ayırt edilemez → metne bak.
- DOM (doğrulanmadı canlı): `section[role=region][aria-label^="Notifications"] > ol > li[role=status][data-state=open]`
  içinde başlık ve açıklama, kapat butonu. Süre ~5 sn.
- Strateji: Kaydet'e bastıktan hemen sonra `browser_wait_for` ile beklenen başarı metnini (tr/en) bekle **ve** ayrıca
  yönlendirme/URL değişimini kontrol et. Toast kaçarsa kaydı liste/detay ekranında doğrula (toast tek kanıt olmasın).
- Hata toast'ları sunucu mesajını veya hata kodunu (`ERR_...`) gösterebilir.

## 4. Hata gösterimi

| Tür | Görünüm |
|---|---|
| Alan validasyonu | Alan altında kırmızı metin + kontrolde `aria-invalid=true` |
| Sunucu/iş kuralı hatası (409/400) | Kırmızı toast; bazı ekranlarda form üstünde kırmızı uyarı kutusu. Ör. kategori silme `ERR_CATEGORY_HAS_PRODUCTS` |
| Yetki (403) | Toast veya sayfada "erişim reddedildi" kartı (sayfaya özel başlıkla) |
| Liste yükleme hatası | Liste içinde uyarı kutusu + `Tekrar Dene`/`Retry` butonu |
| Ön koşul eksik | Ürün/kategori oluşturma ekranında `Ürün Eklemeden Önce Kurulumu Tamamlayın` kartı (bkz. `dependency-graph.md`) |
| Oturum | bkz. `environments-and-auth.md` §6 |

## 5. Kaydedilmemiş değişiklik korumaları

- Formdan değişiklik kaydetmeden ayrılmaya çalışınca iki tür uyarı çıkabilir: tarayıcının yerel "Leave site?" penceresi
  ya da sayfa içi link tıklamasında **AlertDialog**.
- Bu korumayı kullanan ekranlar: ürün formu (dialog başlığı `Kaydedilmemiş değişiklikler`/`Unsaved changes`), kategori
  formu, marka formu, müşteri oluşturma, layout-settings, beden kılavuzu düzenleme, stok ekranları, Meta pixel formu,
  form oluşturucu.
- Otomasyon: Form doluyken başka URL'ye `browser_navigate` yapmak tarayıcı "ayrıl" penceresi doğurabilir
  (`browser_handle_dialog`). Kullanıcı onayı olmadan "ayrıl"ı kabul etme — veri kaybı. Önce kaydet ya da kullanıcıya sor.

## 6. Veri tabloları

- İki görünüm: (a) ortak liste şablonu (siparişler, müşteriler, abonelikler, fiyat raporu, form gönderimleri) ve
  (b) sayfaya özel tablolar.
- Arama: tablo üstünde arama kutusu (placeholder sayfaya özel, ör. `Ürün ara...`); yazdıktan kısa süre sonra uygulanır,
  genellikle URL'ye de yansır (`?search=`, `?page=`). Arama sonrası `browser_wait_for` ile satırın görünmesini bekle.
- Filtre: Select'ler + `Gelişmiş Filtreler`/`Advanced Filters` paneli; aktif filtreler rozet olarak, her rozette
  kaldır butonu; `Tümünü temizle`.
- Sayfalama: `nav[aria-label="Sayfalama"|"Pagination"]`, butonlar
  aria-label `Önceki sayfaya git`/`Go to previous page`, `Sonraki sayfaya git`/`Go to next page`; metin
  `{total} sonuçtan {from} - {to} arası gösteriliyor` / `Showing {from} to {to} of {total}`; `Sayfa başına satır`/`Rows per page`.
- Satır aksiyon menüsü: son sütunda üç nokta ikon butonu → açılır menü
  (`role=menu`, öğeler `role=menuitem`: `Düzenle`/`Edit`, `Sil`/`Delete`, `Arşivle`/`Archive`…). Butonun erişilebilir
  adı ekrana göre değişir: `İşlemler`/`Actions`, `Open menu`, sayfaya özel ya da adsız.
  Locator: önce satırı benzersiz metinle bul → `row.getByRole('button').last()` veya
  `row.getByRole('button', { name: /İşlemler|Actions|menu/i })` → `getByRole('menuitem', { name: /Düzenle|Edit/ })`.
  Satır adı/ SKU ile kapsamlamadan menü açma.
- Satır tıklama çoğu listede detay/düzenleme sayfasına gider; link varsa `getByRole('link', { name })` tercih et.
- Boş durum: başlık + harekete geçirici buton (ör. `İlk ürününü ekleyelim!`).

## 7. Toplu işlemler

- Satır checkbox'ları (`role=checkbox`) + başlıkta tümünü seç. Seçim olunca bölge
  `[aria-label="Seçili öğeler için toplu işlemler"|"Bulk actions for selected items"]` (`aria-live=polite`) çıkar:
  `{count} seçildi` / `{count} selected`, `Seçimi temizle` butonu, toplu aksiyon butonları.
- Ürünlerde `Toplu İşlemler` dropdown'ı ve "tüm filtre sonucuna uygula" için ayrı onay adımı
  — bkz. `../screens/products/product-bulk-edit.md`.
- Proje kuralı: toplu işlemler etkilenen kayıt sayısıyla ayrıca onaylanır.

## 8. Onay pencereleri

- Silme/arşivleme/iptal → `AlertDialog` (başlık ör. `Vergi Sınıfını Sil`, `Mağaza Görünümü Silinsin mi?`, `Grubu Sil`).
  Buton metinleri: `Sil`/`Delete`, `İptal`/`Cancel`, `Onayla`/`Confirm`, `Evet`/`Yes`, `Arşivle`/`Archive`,
  `Geri Yükle`/`Restore`; yükleniyor `Siliniyor...`/`Deleting...`.
- Kalıcı silme → yazarak onaylama penceresi (SKU yazdırır).
- Sipariş iade/iptal → çok adımlı dialog (ikinci onay `{amount} tutarı şimdi iade edilsin mi?`).

## 9. Yükleniyor durumları

- Gri yanıp sönen iskelet bloklar, dönen yükleme simgesi, buton içi
  `...ing` metinleri (`Kaydediliyor...`, `Siliniyor...`) ve devre dışı butonlar.
- Admin açılırken giriş kontrolü sırasında tam ekran yükleme simgesi.
- Sidebar yetkiler yüklenirken boş.
- Strateji: işlem öncesi `browser_wait_for` ile hedef metni bekle; iskelet görünürken tıklama yapma. Kaydetme sonrası
  buton devre dışı durumdan çıkana/yönlendirme olana kadar bekle.
- **Liste ekranları geç dolabilir:** o sırada başlık sayacı `0` ve tablo boş iskelet satırlardır (ya da
  `Kategoriler yükleniyor...` gibi metin). "Kayıt yok" sonucuna yalnız boş durum metni (`Depo Yok` vb.) veya
  `0 sonuçtan 0` görünce var; yoksa `browser_wait_for` (`textGone` yükleme metni) ile bekle.

## 10. `data-testid` kullanımı

- Seyrek kullanılır. Yoğun alanlar: operatör tenant ekranları, Meta Ads, layout-settings (header/footer),
  kuponlar/promosyonlar, ayarlar, domainler, blok editörü. Ürün formu/listesinde çok az.
- Örnekler: `block-editor`, `category-picker`, `product-picker`, `link-picker`, `page-basic-info`, `page-seo`,
  `page-translations`, `category-basic-info`, `category-seo`, `category-media`, `category-products`,
  `email-sending-section`, `search-index-status-badge`, `workflow-save`, `validation-error-alert`.
- Kural: `getByTestId` yalnızca ekran dosyasında belirtilmişse kullan; genel strateji rol + isim.

## 11. Store view / çeviri alanları kalıbı

- Store view = dil+bölge+para birimi birimi (Ayarlar → Mağaza Görünümleri). Bir varsayılan görünüm vardır;
  diğerleri "çevrilebilir" görünümlerdir.
- Varlık formlarında (ürün, marka, kategori) üstte **store view çubuğu**: Select, seçenekler `default` + her
  çevrilebilir store view; her seçenekte tamamlanma rozeti (`{completed}/{total}`), durum rozeti
  (published/draft/modified). Seçim **formun kapsamını** değiştirir: ad/açıklama/SEO alanları o görünümün çeviri
  değerlerini gösterir; çeviri kapsamında slug otomatik üretilmez.
- İçerik ekranlarında (ana sayfa, navigasyon) **içerik dili seçici**: Select, değer `default` veya dil kodu
  (`tr`, `en`…), görünüm başına değil **dil başına** bir seçenek.
- Ürün formunda ayrıca `Çeviriler`/`Translations` sekmesi — her store view için ad, slug, açıklama, SEO; slug için
  "yeniden üret" butonu.
- Otomasyon: Önce **varsayılan kapsamda** doldur ve kaydet; çeviriler ayrı adım. Kapsam değiştirmeden önce kaydedilmemiş
  değişiklik olmamalı (doğrulanmadı: kapsam değişiminin kirli formu koruyup korumadığı ekrana göre değişir).

## 12. Slug otomatik üretimi

- Kural: Türkçe/Avrupa harfleri ASCII'ye çevrilir (ş→s, ç→c, ğ→g, ı/İ→i, ö→o, ü→u, ß→ss), küçük harfe çevrilir,
  boşluk/alt çizgi → `-`, `[a-z0-9-]` dışı karakterler silinir, ardışık `-`'ler birleşir, uçlar kırpılır.
  Ör. "Çocuk Ayakkabı & Çanta" → `cocuk-ayakkabi-canta`.
- Marka/kategori: ad yazıldıkça slug otomatik dolar; kullanıcı slug alanına **elle yazarsa** otomatik güncelleme
  durur; elle yazılan değer de aynı kurala göre düzeltilir. Düzenleme ekranında mevcut slug varsa otomatik üretim
  kapalı başlar.
- Form oluşturucu: "URL'yi özelleştir" anahtarı açılana kadar otomatik; açıkken müsaitlik kontrolü yapılır.
- Ürün: slug çeviri satırlarında, yeniden üret butonuyla.
- Otomasyon: önce adı yaz, slug'ın dolmasını bekle (snapshot ile oku), kullanıcı özel slug istemedikçe slug'a dokunma.
  Benzersizlik sunucuda kontrol edilir (ör. marka `Brand with slug '...' already exists` 409, `ERR_CATEGORY_SLUG_EXISTS`).

## 13. Sayfa içi diğer kalıplar

- **Ön koşul kartı**: ürün ve kategori oluşturma sayfaları gerekli kayıtlar yoksa formu hiç göstermez (bkz. `dependency-graph.md`).
- **Plan/özellik kapısı**: bazı özellikler (ör. AI marka sihirbazı, çoklu dil) plana bağlıdır — plan yetmezse yükseltme kartı çıkar.
- **Hub sayfaları** (`/settings`, `/content`, `/design`, `/reports`, `/marketing`): kart grid'i, her kart bir link.
- **Mağaza önizleme / "Mağazayı Görüntüle"**: mağaza (vitrin) adresi tanımlı değilse buton devre dışı + ipucu.
- **Header hızlı butonları ve dashboard butonları** link değil `<button>`'dır (`getByRole('button')` ile bul).

## 14. Kısa Playwright/MCP reçeteleri

```text
Select seç:      click(getByLabel(/Etiket|Label/)) → wait_for(role=listbox) → click(getByRole('option',{name:'Değer'})) → snapshot: trigger metni = 'Değer'
Combobox seç:    click(trigger combobox) → type(arama kutusu, 'arama') → wait_for('Sonuç metni') → click(option)
Sekme değiştir:  click(getByRole('tab',{name:/Fiyat|Pricing/})) → snapshot
Switch aç:       snapshot: aria-checked=false ise click(getByRole('switch',{name}))
Dosya yükle:     click(upload alanı/buton) → browser_file_upload([kullanıcının verdiği yol]) → wait_for(önizleme)
Satır menüsü:    row = getByRole('row').filter({hasText:'SKU-123'}) → click(row.getByRole('button').last()) → click(getByRole('menuitem',{name:/Düzenle|Edit/}))
Kaydet (onaydan sonra): click(getByRole('button',{name:/Kaydet|Save|Oluştur|Create/})) → wait_for(toast metni | URL değişimi) → detayda doğrula
```
