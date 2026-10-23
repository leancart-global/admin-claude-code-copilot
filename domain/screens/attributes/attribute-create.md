# Öznitelik Oluştur (Create Attribute)
- URL: `{ADMIN_URL}/attributes/new`
- Amaç: Yeni bir attribute (ör. Renk, Dahili Hafıza, Ekran Boyutu) tanımlamak; seçenekli tiplerde seçenekleri girmek.
- Yetki: Listedeki "Öznitelik Oluştur" düğmesi `products` create yetkisiyle görünür. Kaydetme `attributes:write` ister; yetkisizse 403 toast.
- Veri / API:
  - Yükleme: aktif mağaza görünümleri (seçenek çeviri sütunları için) yüklenir; yüklenemezse toast "Mağaza görünümleri yüklenemedi. Seçenekler yalnızca varsayılan etiketleri kullanacak."
  - Kaydet: `POST /attributes` — formdaki tüm alanlar (seçenekler ve seçenek çevirileri dahil) tek seferde kaydedilir.

## Ön koşullar ve bağımlılıklar
- Aynı **code** ile attribute olmamalı → önce [attribute-list.md](attribute-list.md)'de label ve olası kodla ara.
- Seçenek çevirileri için aktif store view'lar (opsiyonel; yoksa yalnız varsayılan etiket).
- Sonraki adım: attribute'u bir sete eklemek → [attribute-set-create.md](attribute-set-create.md) / [attribute-set-edit.md](attribute-set-edit.md). Attribute bir sete eklenmeden ürün formunda görünmez.
- Entity kuralları: [../../entities/attribute.md](../../entities/attribute.md).

## Yerleşim
- Üst: başlık "Öznitelik Oluştur / Create Attribute", geri linki "Geri / Back" (→ `/attributes`), sağda **"Kaydet / Save"** (submit).
- 6 sekme; gizli sekmedeki alanlar da sayfada mevcuttur ama görünmez:
  1. **Temel Bilgi / Basic Info**
  2. **Seçenekler / Options** — yalnız tip `select`, `multiselect`, `color` iken etkin (aksi halde disabled).
  3. **Doğrulama Kuralları / Validation Rules** — içerik tipe göre değişir.
  4. **Mağaza Özellikleri / Storefront Properties** — 3 kart: Arama ve Filtre / Katalog Özellikleri / Ön Yüz Özellikleri.
  5. **Kapsam / Scope** — "Kapsam Ayarları" kartı.
  6. **Gelişmiş / Advanced** — "Yönetici Notları".

## Alanlar
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Temel Bilgi | Etiket * / Label * | `label` | text | evet | 1–255 | `getByRole('textbox', { name: /^Etiket/ })` ya da placeholder "ör. Renk, Beden, Malzeme" / "e.g., Color, Size, Material" | Yazdıkça kod otomatik türetilir (Türkçe harfler transliterasyonla: "Dahili Hafıza" → `dahili_hafiza`), kod elle değiştirilene kadar. |
| Temel Bilgi | Öznitelik Kodu * / Attribute Code * | `code` | text | evet | 1–60, küçük harfle başlar; yalnız küçük harf, rakam, alt çizgi ("Code must start with letter, contain only lowercase letters, numbers and underscores") | placeholder "ör. color, size, material" | Açıklama: "Yalnızca küçük harfler, rakamlar ve alt çizgi". Kayıttan sonra **değiştirilemez**. Kodu bilinçli seç (varyant ekseni kodu ile aynı olmalı, bkz. entity). |
| Temel Bilgi | Açıklama / Description | `description` | textarea | hayır | ≤1000 | placeholder "Bu özniteliğin amacını açıklayın..." | |
| Temel Bilgi | Öznitelik Tipi * / Attribute Type * | `type` | select (combobox butonu + listbox) | evet | varsayılan `text` | `getByRole('combobox', { name: /Öznitelik Tipi/ })` → `getByRole('option', { name: 'Açılır Liste' })` | Seçenekler (tr/en): Metin/Text, Metin Alanı/Text Area, Sayı/Number, Fiyat/Price, Ağırlık/Weight, Açılır Liste/Dropdown (`select`), Çoklu Seçim/Multi-Select, Evet/Hayır/Yes/No (`boolean`), Tarih/Date, Tarih ve Saat/Date & Time, Renk/Color, Resim/Image, Dosya/File, URL, E-posta/Email, HTML, JSON. Tip değişince Giriş Tipi o tipin varsayılanına sıfırlanır. |
| Temel Bilgi | Giriş Tipi / Input Type | `inputType` | select | evet | tipin ilk uyumlusu | `getByRole('combobox', { name: 'Giriş Tipi' })` | Seçenek adları: Metin Alanı/Text Field, Çok Satırlı Metin, Açılır Liste/Dropdown, Çoklu Seçim, Onay Kutusu/Checkbox, Radyo Düğmeleri/Radio Buttons, Renk Seçici/Color Picker, Sayı Alanı, Aralık Kaydırıcı, Görsel Editör/WYSIWYG … Uyum tablosu entity dosyasında. Genelde dokunma. |
| Temel Bilgi | Sıralama / Sort Order | `sortOrder` | number | hayır | ≥0, varsayılan 0 | `getByRole('spinbutton', { name: 'Sıralama' })` | |
| Temel Bilgi | Varsayılan Değer / Default Value | `defaultValue` | text | hayır | – | placeholder "Varsayılan değer girin" | Seçenekli tiplerde boş bırak; varsayılan seçenek Seçenekler sekmesinden. |
| Temel Bilgi › Temel Özellikler | Zorunlu / Required | `isRequired` | switch | – | false | `getByRole('switch', { name: 'Zorunlu' })` | Ürün formunda zorunluluğu belirler. Varyant ekseni attribute'larında açma (configurable üründe zaten muaf, simple üründe zorlar). |
| Temel Bilgi › Temel Özellikler | Benzersiz Değer / Unique Value | `isUnique` | switch | – | false | `getByRole('switch', { name: 'Benzersiz Değer' })` | |
| Temel Bilgi › Temel Özellikler | Aktif / Active | `isActive` | switch | – | **true** | `getByRole('switch', { name: 'Aktif' })` | |
| Temel Bilgi › Temel Özellikler | Global Kapsam / Global Scope | `isGlobal` | switch | – | false | `getByRole('switch', { name: 'Global Kapsam' })` | |
| Seçenekler | Toplu Ekle / Bulk Add | – | button → textarea paneli | – | – | `getByRole('button', { name: 'Toplu Ekle' })` | Panel: ipucu "Her satıra bir seçenek girin", textarea placeholder "Kırmızı\nMavi\nYeşil", düğmeler "İptal" ve **"Seçenek Ekle / Add Options"**. |
| Seçenekler | Seçenek Ekle / Add Option | – | button | – | – | `getByRole('button', { name: 'Seçenek Ekle' })` (bkz. tuzak: TR'de iki düğme aynı ad) | Boş satır ekler; ilk eklenen satır otomatik "Varsayılan" işaretli. |
| Seçenekler (tablo) | Varsayılan Etiket / Default Label | `options[].label` | text (satır başına) | **evet** | 1–255; boş + blur → "Varsayılan etiket gerekli" | placeholder "Etiket" / "Label" | Seçenek değeri otomatik atanır, görünmez. |
| Seçenekler (tablo) | {store view adı} ({kod}) sütunları | – | text | hayır | – | placeholder = varsayılan etiket | Aktif store view sayısı kadar sütun. Boş bırakılırsa vitrin varsayılan etiketi kullanır. |
| Seçenekler (tablo, yalnız `color`) | Renk / Color | – | renk seçici (`input[type=color]`) + önizleme kutusu | hayır | varsayılan `#cccccc` | satırdaki `input[type="color"]` → `fill('#000000')` | |
| Seçenekler (tablo) | Varsayılan / Default | `options[].isDefault` | checkbox | – | ilk satır true; tekil (birini işaretlemek diğerlerini kaldırır) | satır içindeki `getByRole('checkbox')` (aria-label yok) | |
| Seçenekler (tablo) | Yeniden Sırala / Reorder | – | ↑/↓ ikon butonları | – | – | satırdaki ilk iki ikon buton (aria-label yok) | Sıra = seçenek sırası. Sürükle-bırak yok. |
| Seçenekler (tablo) | (çöp kutusu) | – | ikon buton → dialog "Seçeneği Sil / Delete Option" → "Sil" | – | – | satırdaki son buton | Kayda kadar yalnız formu değiştirir. |
| Doğrulama (tip text/textarea/html/url/email/image/file) | Minimum Uzunluk / Minimum Length · Maksimum Uzunluk / Maximum Length | `validation.minLength` / `.maxLength` | number | hayır | ≥0 | `getByRole('spinbutton', { name: 'Minimum Uzunluk' })` | |
| Doğrulama (number/price/weight) | Minimum Değer · Maksimum Değer | `validation.min` / `.max` | number | hayır | – | spinbutton adıyla | |
| Doğrulama (text grubu + image/file) | Doğrulama Deseni (Regex) / Validation Pattern (Regex) | `validation.pattern` | text | hayır | ≤500, geçerli regex, iç içe niceleyici yasak ("Pattern may cause performance issues…") | placeholder "ör. ^[A-Z]{2}[0-9]{4}$" | |
| Doğrulama (yukarıdakiler) | Hata Mesajı / Error Message | `validation.errorMessage` | text | hayır | – | placeholder "Özel hata mesajı" | |
| Doğrulama (select/multiselect/color/boolean/date/datetime/json) | – | – | yalnız bilgi metni | – | – | – | Ör. "Bu öznitelik türü için doğrulama seçenekler aracılığıyla yönetilir…" |
| Mağaza › Arama ve Filtre | Aramada Kullan / Use in Search | `isSearchable` | switch | – | false | `getByRole('switch', { name: 'Aramada Kullan' })` | |
| Mağaza › Arama ve Filtre | Arama Ağırlığı / Search Weight | `searchWeight` | number | hayır | 1–10 | `getByRole('spinbutton', { name: 'Arama Ağırlığı' })` | |
| Mağaza › Arama ve Filtre | Katmanlı Navigasyonda Kullan / Use in Layered Navigation | `isFilterable` | switch | – | false | `getByRole('switch', { name: 'Katmanlı Navigasyonda Kullan' })` | Vitrin filtre paneli (tüm kategorilerde, global). |
| Mağaza › Arama ve Filtre | Katmanlı Navigasyon Modu / Layered Navigation Mode | `layeredNavigationMode` | select | hayır | boş (= Otomatik) | `getByRole('combobox', { name: 'Katmanlı Navigasyon Modu' })` | Otomatik (Tüm seçeneklere göre filtrele) / Alfabetik / Manuel (Özel pozisyon). |
| Mağaza › Arama ve Filtre | Gelişmiş Aramada Görünür / Visible in Advanced Search | `isVisibleInAdvancedSearch` | switch | – | false | role switch + ad | |
| Mağaza › Katalog Özellikleri | Ürün Listesinde Kullanılır / Used in Product Listing | `isUsedInProductListing` | switch | – | false | | |
| Mağaza › Katalog Özellikleri | Admin Tablosunda Görünür / Visible in Admin Grid | `isUsedInGrid` | switch | – | false | | |
| Mağaza › Katalog Özellikleri | Sıralama İçin Kullanılır / Used for Sorting | `isUsedForSortBy` | switch | – | false | | |
| Mağaza › Katalog Özellikleri | Mağazada Karşılaştırılabilir / Comparable on Storefront | `isComparable` | switch | – | false | | |
| Mağaza › Ön Yüz Özellikleri | Katalog Sayfalarında Görünür / Visible on Catalog Pages | `isVisibleOnFront` | switch | – | **true** | `getByRole('switch', { name: 'Katalog Sayfalarında Görünür' })` | Açıklama: "Vitrinde ürün detayında gösterilir" (ürün sayfası özellik tablosu). |
| Mağaza › Ön Yüz Özellikleri | Mağazada HTML İzinli / Allow HTML Tags on Storefront | `isHtmlAllowedOnFront` | switch | – | false | | |
| Mağaza › Ön Yüz Özellikleri | WYSIWYG Etkin / Enable WYSIWYG | `isWysiwygEnabled` | switch | – | false | | |
| Mağaza › Ön Yüz Özellikleri | Promosyon Kurallarında Kullan / Use for Promo Rule Conditions | `isUsedForPromoRules` | switch | – | false | | |
| Mağaza › Ön Yüz Özellikleri | Öne Çıkan Olarak Göster / Show as Highlight | `isFeatured` | switch | – | false | | Ürün sayfasında "öne çıkanlar". |
| Mağaza › Ön Yüz (koşullu: isFeatured) | Öne Çıkan İkonu / Highlight Icon | `featuredIcon` | medya seçici alanı ("Gözat/Browse" → medya dialog; link ikonu "URL'yi manuel olarak girin") | hayır | URL | `getByRole('button', { name: 'Gözat' })` | |
| Kapsam | Kapsam / Scope | `scope` | select | – | `global` (Global / Web Sitesi / Mağaza Görünümü) | `getByRole('combobox', { name: 'Kapsam' })` | Açıklama: "Öznitelik değerinin hangi düzeyde değişebileceğini belirler". |
| Kapsam | Şunlara Uygula / Apply To | `applyTo[]` | checkbox grubu (8 adet) | hayır | boş = tüm tipler | `getByLabel('Yapılandırılabilir Ürün')` (checkbox `id` = tip değeri, ör. `#configurable`) | Seçenekler: Basit Ürün (`simple`), Yapılandırılabilir Ürün (`configurable`), Gruplu Ürün, Sanal Ürün, Paket Ürün, İndirilebilir Ürün, Hediye Kartı (`gift_card`), Abonelik Ürünü. |
| Gelişmiş | Dahili Not / Internal Note | `note` | textarea | hayır | ≤1000 | placeholder "Yöneticiler için dahili notlar..." | Yalnız admin. |

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay | Sonuç |
|---|---|---|---|
| Kaydet / Save (başlıkta) | form doğrulanır → öznitelik oluşturulur | uygulama onay sormaz → **Claude kullanıcıdan özet onayı almalı** | Başarı: toast başlık "İşlem başarıyla tamamlandı" / açıklama "Öznitelik başarıyla oluşturuldu", `/attributes`'a yönlenir. Hata: başlık "Bir hata oluştu"; kod çakışması (`ERR_ATTRIBUTE_CODE_EXISTS`) → "\"{code}\" kodu başka bir özellik tarafından zaten kullanılıyor. Lütfen farklı bir kod seçip tekrar deneyin."; diğer → sunucu mesajı ya da "Öznitelik kaydedilemedi". |
| Geri / Back | `/attributes`'a link | kaydedilmemiş değişiklik uyarısı yok | Form kaybolur. |

## Yan etkiler
- Yeni attribute hiçbir sete otomatik eklenmez.
- Aramada/filtrede kullanılan attribute, ürünler değer aldıkça vitrin arama ve filtrelerinde yer alır.

## Tuzaklar
- **Doğrulama hataları ilgili alanın altında** gösterilir; alan başka sekmedeyse (ör. Seçenekler sekmesindeyken kod hatası) görünmez. Kaydetten sonra yönlenme olmadıysa sırayla Temel Bilgi, Seçenekler, Doğrulama sekmelerini snapshot'la.
- **Boş seçenek etiketi** kaydı engeller; kırmızı uyarı alandan çıkınca görünür. Fazladan boş satır bırakma (her "Seçenek Ekle" bir satır ekler).
- **TR'de iki düğme "Seçenek Ekle"**: üstteki (tek satır ekler) ve Toplu Ekle panelindeki onay düğmesi. Toplu panelde, textarea'nın altındaki "İptal"in yanındakine tıkla (EN: "Add Option" vs "Add Options").
- Toplu Ekle her satırı ayrı seçenek yapar, boş satırları atar; sonradan eklenen satırlar varsayılan işaretlenmez.
- Tip değişince Giriş Tipi otomatik sıfırlanır; giriş tipini değiştirmek istiyorsan tipten sonra seç.
- Seçenekler sekmesi tip select/multiselect/color değilken disabled; önce tipi seç.
- Kod otomatik türetme yalnız kod elle değiştirilmemişken çalışır. Kodu elle yazdıysan label değişince güncellenmez.
- Attribute label'ının store view çevirisi UI'da yapılamaz (yalnız seçenek çevirileri).
- Renk tipinde her seçeneğe yalnız tek bir hex renk atanır; görsel swatch bu formdan ayarlanamaz.
- Store view'lar yüklenirken seçenek tablosu iskelet gösterir; tabloya yazmadan önce iskeletin kaybolmasını bekle.

## Doğrulama
- Toast "Öznitelik başarıyla oluşturuldu" + URL `/attributes`.
- Listede koda göre ara → Tip, Arama, Filtre, Durum sütunları.
- Seçenekleri doğrulamak için ⋯ → Düzenle → Seçenekler sekmesi: rozet "{n} seçenek", etiketler, renkler, varsayılan.
- (Opsiyonel, salt okunur) `browser_network_requests` ile oluşturma isteğinin 201 yanıtı.
