# Depolar (liste + oluştur + detay/düzenle + sipariş dağıtım ayarları)

- URL'ler:
  - Liste: `{ADMIN_URL}/inventory/warehouses`
  - Oluştur: `{ADMIN_URL}/inventory/warehouses/new`
  - Detay: `{ADMIN_URL}/inventory/warehouses/{id}`; düzenleme modu: `{ADMIN_URL}/inventory/warehouses/{id}?edit=true`
- Menü yolu: Sol menü "Envanter / Inventory" → "Depolar / Warehouses".
- Sayfa başlıkları: liste kartı "Depolar / Warehouses" (+ adet rozeti), açıklama "Depo konumlarını ve kapasitelerini
  yönetin"; oluştur "Depo Oluştur / Create Warehouse" ("Envanter sisteminize yeni bir depo konumu ekleyin"); detay
  başlığı = depo adı (+ durum rozeti, varsa "★ Varsayılan Depo"), altında kod; düzenle "Depo Düzenle / Edit Warehouse"
  ("{name} depo bilgilerini güncelle").
- Amaç: Stoğun tutulduğu depoları tanımlamak, varsayılan depoyu belirlemek, depo adresini kargo gönderici adresine
  bağlamak, siparişlerin depolara dağıtım kuralını ayarlamak.
- Entity: [../../entities/warehouse.md](../../entities/warehouse.md). Playbook: [../../../playbooks/warehouse-setup.md](../../../playbooks/warehouse-setup.md).
- Yetki: ekranlar `inventory:read`; oluştur/düzenle/durum/varsayılan `inventory:write`; **silme `inventory:admin`**.

## Ön koşullar ve bağımlılıklar

- Depo oluşturmak için ön koşul yok.
- **Kargo gönderici adresi** alanı için kargo entegrasyonu (Geliver) kurulmuş olmalı → [../settings/shipping-carriers.md](../settings/shipping-carriers.md).
  Kurulu değilse alanda "Henüz bir kargo firması bağlamadınız. Önce Ayarlar → Kargo bölümünden bağlantıyı kurun." yazar;
  depo yine kaydedilebilir.
- Depo şunların ön koşuludur: stok kaydı ([stock.md](stock.md)), ürün formunda stok girişi
  ([../products/product-create.md](../products/product-create.md) "Stok" sekmesi — depo yoksa sekmede uyarı bandı),
  toplu ürün stok güncellemesi ([../products/product-bulk-edit.md](../products/product-bulk-edit.md) — varsayılan depo ister),
  transfer, satın alma siparişi, sayım; kargo fiyat tahmini (çıkış deposu).
- Stok ekranında depo yoksa uyarı: "Depo tanımlı değil / No warehouse configured" + "Depo oluştur / Set up a warehouse" →
  bu ekranın oluştur sayfası.

## Yerleşim

### Liste
1. Başlık kartı: başlık + adet rozeti; sağda "Depo Ekle / Add Warehouse" (`getByRole('button', { name: /Depo Ekle|Add Warehouse/ })`).
2. Filtreler: arama "Kod, ad veya şehir ile ara..." / "Search by code, name, or city..."; durum Select "Tüm Durumlar /
   All Status" (Aktif, Pasif, Bakımda).
3. Tablo sütunları: "Depo Kodu" (varsayılan depoda sarı yıldız), "Depo Adı", "Tür", "Durum" (rozet), "Kapasite"
   (kullanılan / toplam çubuk; 0 ise "Sınırsız kapasite"), "Adres" (şehir, ülke), "Öncelik", "⋯" (sr-only "Hızlı İşlemler / Quick Actions").
   Satıra tıklamak detayı açar.
4. Satır menüsü: "Detayları Gör / View Details", "Düzenle / Edit", "Sil / Delete" (**varsayılan depoda pasif**).
5. Boş durum: "Depo Yok / No Warehouses" — "İlk deponuzu oluşturarak başlayın." + "Depo Ekle". Filtreliyken "Depo bulunamadı".
6. Sayfalama: sayfa başına 20 (en fazla 100 depo yüklenir).
7. Altta **dağıtım ayarları kartı** (yalnız ≥1 depo varken): tek depoda başlık "Stok Çıkış Kuralları / Stock Outflow Rules",
   ≥2 depoda "Sipariş Dağıtım Ayarları / Order Distribution Settings". Bkz. "Dağıtım ayarları kartı".

### Oluştur / Düzenle formu (aynı form)
Kartlar sırayla: "Temel Bilgiler / Basic Information" → "Varsayılan Depo" anahtarı → "Teslim Noktası" anahtarı →
"Adres / Address" (adres + GPS Koordinatları + kargo gönderici adresi) → "Kapasite / Capacity" →
"Varsayılan Stok Ayarları / Default Stock Settings" → altta "İptal / Cancel" ve "Depo Oluştur / Create Warehouse"
(düzenlemede "Depoyu Güncelle / Update Warehouse"; değişiklik yokken pasif). Validasyon hataları alanın altında kırmızı.

### Detay (görüntüleme)
- Başlık satırı: geri oku (aria-label "Depolara Dön / Back to Warehouses"), ad, durum rozeti, "★ Varsayılan Depo" rozeti, kod.
  Sağda: "Varsayılan Yap / Set as Default" (yalnız varsayılan değilken), "Düzenle / Edit", kırmızı "Sil / Delete"
  (varsayılan depoda pasif).
- Kartlar: "Tür"; "Durum" (**satır içi Select**: Aktif / Pasif / Bakımda); "Öncelik"; "Teslim Noktası" (Evet/Hayır);
  kapasite kartı; "Adres" ("Adres bilgisi girilmemiş" olabilir); "Açıklama" (varsa).
- Sağ sütun: "Hızlı İşlemler" → "ID Kopyala / Copy ID"; "Bilgi" kartı: Oluşturulma, Son Güncelleme, ID.

## Alanlar (oluştur / düzenle)

| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Temel Bilgiler | Depo Kodu * / Warehouse Code | Input | evet | 2–20; yalnız büyük harf, rakam, tire ("Kod yalnızca büyük harf, rakam ve tire içerebilir"); placeholder "WH-001" | `#code` | **Düzenlemede kilitli.** Mağaza içinde benzersiz |
| 〃 | Ad * / Name | Input | evet | 3–100; placeholder "Ana Depo" | `#name` | |
| 〃 | Açıklama / Description | Textarea | hayır | ≤500 | `#description` | |
| 〃 | Depo Türü * / Warehouse Type | Select | evet | varsayılan "Ana Depo" | Temel Bilgiler kartındaki ilk `combobox` (label ile bağlı değil; yanındaki metin "Depo Türü") | Ana Depo / Main Warehouse, Dağıtım Merkezi / Fulfillment Center, Teslim Noktası / Pickup Location |
| 〃 | Öncelik / Priority | number | hayır | 1–100, varsayılan 1 | `#priority` | "Düşük numara = tahsis için yüksek öncelik" |
| Varsayılan Depo kartı | Varsayılan Depo / Default Warehouse | Switch | — | **kapalı** | kart metni "Varsayılan Depo" içindeki `switch` (formdaki 1. switch) | "Yeni ürünler için varsayılan depo olarak ayarla". Açıp kaydetmek mevcut varsayılanın işaretini kaldırır |
| Teslim Noktası kartı | Teslim Noktası / Pickup Location | Switch | — | kapalı | 2. switch | "Müşterilerin bu konumdan sipariş almasına izin ver" |
| Adres | Adres Satırı 1 * / Address Line 1 | Input | evet | boş olamaz ("Adres satırı 1 zorunlu"); placeholder "123 Depo Sokak" | `[id="address.line1"]` | |
| 〃 | Adres Satırı 2 / Address Line 2 | Input | hayır | placeholder "Daire, Bina (isteğe bağlı)" | `[id="address.line2"]` | |
| 〃 | Ülke Kodu * / Country Code | aramalı combobox | evet | 2 harf ("Ülke kodu 2 harf olmalı"); placeholder "Ülke seçin" | `combobox` metni "Ülke seçin" | Seçenek: **Türkiye**. Ad ile seçilir, kod (TR) olarak kaydolur. İpucu "ISO 3166-1 alpha-2". **Önce bunu seç**: ülke değişince il/ilçe temizlenir |
| 〃 | Şehir * / City | TR'de aramalı combobox ("İl seçin"); ülke seçilmeden düz Input | evet | "Şehir zorunlu" | `combobox` "İl seçin" | İl listesi kargo ile aynı kaynaktan; yazıp listeden seç |
| 〃 | İlçe / District (TR'de *) | aramalı combobox ("İlçe seçin") | TR'de yıldızlı | il seçilmeden pasif | `combobox` "İlçe seçin" | İl değişince ilçe temizlenir. Kargo fiyatı ilçeye duyarlı |
| 〃 | İl / Eyalet / State / Province | Input | hayır | placeholder "NY" | `[id="address.state"]` | TR'de genelde boş bırakılır |
| 〃 | Posta Kodu * / Postal Code | Input | evet | "Posta kodu zorunlu"; TR 5 hane | `[id="address.postalCode"]` | |
| 〃 GPS Koordinatları | Enlem / Latitude, Boylam / Longitude | number | hayır | −90..90 / −180..180; placeholder "41.0082" / "28.9784" | `#latitude`, `#longitude` | "En yakın depo tahsisi için gereklidir" |
| 〃 | Kargo gönderici adresi / Shipping sender address | Select (kargo hesabındaki adresler) | hayır | "Bağlı değil / Not linked" | `#geliverAddressId` | Seçenek metni "{etiket} — {ilçe}, {il}" (+ "(hesap varsayılanı)"). Yalnız kargo bağlıysa ve hesapta adres varsa görünür. Bağlıyken bilgi: "Yukarıdaki depo adresini değiştirmeniz kargo adresini değiştirmez…" |
| 〃 | "Bu adresi kargo hesabımda oluştur / Create this address in my carrier account" | buton | — | Ad, Adres Satırı 1, il, ülke (TR'de ilçe) dolu olunca görünür | `getByRole('button', { name: /kargo hesabımda oluştur|carrier account/ })` | **Kargo firmasına anında yazar** (bkz. Onay zamanlaması); başarıda yeni adres seçili gelir |
| Kapasite | Maksimum Kapasite (adet) / Maximum Capacity (units) | number | hayır | ≥0, varsayılan 0 | `#capacity` | "Sınırsız kapasite için 0 girin" |
| Varsayılan Stok Ayarları | Düşük Stok Eşiği / Low Stock Threshold | number | hayır | 0–100000, varsayılan 10 | `#defaultLowStockThreshold` | Yalnız bu depoda **yeni açılan** stok kayıtlarına uygulanır |
| 〃 | Yeniden Sipariş Noktası / Reorder Point | number | hayır | varsayılan 5 | `#defaultReorderPoint` | |
| 〃 | Yeniden Sipariş Miktarı / Reorder Quantity | number | hayır | ≥1, varsayılan 100 | `#defaultReorderQuantity` | |
| 〃 | Ön Siparişe İzin Ver / Allow Backorder | Switch | — | kapalı | formdaki 3. switch | |

Durum (Aktif/Pasif/Bakımda) formda yoktur; yeni depo **Aktif** açılır.

## Dağıtım ayarları kartı (liste sayfasının altı)

| Bölüm | Label (tr / en) | Kontrol | Not |
|---|---|---|---|
| ≥2 depo | Depo Seçim Stratejisi / Warehouse Selection Strategy | radyo kartlar (`role=radio`, `aria-checked`) | Depo Önceliği (vars.), Müşteriye En Yakın, Dengeli Dağıtım, Tek Depodan Gönderim; her kartın açıklaması ve ipucu var |
| her zaman | Stok Çıkış Kuralı / Stock Selection Rule | radyo kartlar | Varsayılan Sıralama (vars.), İlk Giren İlk Çıkar, Son Kullanma Tarihi Öncelikli |
| ≥2 depo, Tek Depo değil | Bölünmüş Gönderim / Split Shipment | Switch "Siparişlerin birden fazla depodan gönderilmesine izin ver" + number "Sipariş başına maksimum depo sayısı" (2–10) | Tek Depo stratejisinde "Tek depo stratejisinde bölünmüş gönderim kapalıdır" |
| Müşteriye En Yakın | Maksimum mesafe (km), Alternatif strateji (Select) | number, Select | Koordinatı eksik depo varsa uyarı "Eksik GPS Koordinatları" |
| Dengeli | Kapasite ağırlığı (%), Öncelik ağırlığı (%) | number | toplam 100 |
| İlk Giren İlk Çıkar | Katı mod / Strict mode | Switch | "Başka depoda daha eski stok varsa gönderimi reddet" |
| SKT Öncelikli | Minimum son kullanma günü, Uyarı eşiği (gün) | number | vars. 30 / 60 |

Değişiklik yapınca altta "Değişiklikleri İptal Et / Discard Changes" ve "Kaydet / Save" çıkar → onay penceresi
"Ayarları Kaydet / Save Settings": "Bu değişiklik yeni siparişlerin depolara dağıtım şeklini etkileyecektir. İşlenmekte
olan siparişler etkilenmez…" → "Kaydet".

## Aksiyonlar

| Buton (tr / en) | Ekran | Ne olur | Toast |
|---|---|---|---|
| Depo Ekle / Add Warehouse | liste | `/inventory/warehouses/new` açılır | — |
| **Depo Oluştur / Create Warehouse** | oluştur | Depo kaydedilir → detay sayfasına yönlenir | "\"{name}\" deposu başarıyla oluşturuldu"; hata "Depo oluşturulamadı. Lütfen tekrar deneyin." (kod çakışması dahil) |
| İptal / Cancel | oluştur/düzenle | Kaydetmeden listeye/detaya döner (uyarı sormaz) | — |
| Düzenle / Edit | liste menüsü, detay | `?edit=true` düzenleme formu | — |
| **Depoyu Güncelle / Update Warehouse** | düzenle | Değişiklikler kaydedilir → detaya döner | "Depo başarıyla güncellendi"; hata "Depo güncellenemedi. Lütfen tekrar deneyin." |
| **Durum Select** (Aktif/Pasif/Bakımda) | detay | **Diyalogsuz, anında** kaydeder | "Depo durumu {status} olarak güncellendi"; hata "Depo durumu güncellenemedi" |
| **Varsayılan Yap / Set as Default** | detay | **Diyalogsuz, anında** bu depoyu varsayılan yapar, öncekinin işaretini kaldırır | "Varsayılan depo güncellendi"; hata "Varsayılan depo ayarlanamadı" |
| **Sil / Delete** → "Depoyu Sil / Delete Warehouse" ("\"{name}\" deposunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.") → "Sil" | liste menüsü, detay | Kalıcı silme | "\"{name}\" deposu başarıyla silindi"; hata "Depo silinemedi. Lütfen tekrar deneyin." |
| Bu adresi kargo hesabımda oluştur | form | Kargo hesabında gönderici adresi açar ve alana bağlar | hata satır içinde (kargo firmasının mesajı ya da "Kargo adresi oluşturulamadı.") |
| ID Kopyala / Copy ID | detay | Panoya kopyalar | "… copied" |
| Kaydet (dağıtım ayarları) → "Ayarları Kaydet" → Kaydet | liste | Mağaza dağıtım ayarı kaydedilir | "Dağıtım ayarları kaydedildi"; hata "Ayarlar kaydedilemedi" |

## Onay zamanlaması (kural 2/5/6)

- **Depo Oluştur / Depoyu Güncelle**: kaydetmeden önce özet (kod, ad, tür, öncelik, varsayılan mı, adres, gönderici
  adresi, kapasite, varsayılan stok ayarları) + onay. Kod sonradan değişmez → özette vurgula.
- **Varsayılan Depo anahtarı (formda)** ve **Varsayılan Yap (detayda)**: varsayılan değişirse depo seçmeden yapılan tüm
  stok girişleri (ürün formu, toplu ürün stok güncellemesi) yeni depoya gider → özette "etkilenen: varsayılan depo
  X → Y" yaz. Detaydaki buton **diyalogsuz anında** kaydeder → onay butona basmadan önce.
- **Durum Select (detay)**: **anında** kaydeder → onay seçimden önce. Varsayılan depoyu Pasif/Bakımda yapmak mağazayı
  "varsayılan depo yok" durumuna düşürür; pasif depo ürün formu ve stok ekranlarındaki depo seçicilerinden kalkar.
- **"Bu adresi kargo hesabımda oluştur"**: **dış sisteme (kargo firması hesabı) anında yazar**, depo kaydedilmese bile
  adres kargo hesabında kalır. Ayrı özet (gönderilecek ad, adres, il/ilçe, posta kodu) + ayrı onay.
- **Sil**: geri alınamaz → ayrı onay; özette depodaki stok adedi (Kapasite sütunundaki kullanılan), varsayılan olup
  olmadığı ve kalan depo sayısı. Son depo ve varsayılan depo silinemez.
- **Dağıtım ayarları Kaydet**: yeni siparişlerin hangi depodan karşılanacağını değiştirir → özet (eski → yeni strateji,
  bölünmüş gönderim) + onay; ekrandaki onay penceresi kullanıcının onayı yerine geçmez.
- Bu ekranlardan müşteriye e-posta/bildirim gitmez.

## Yan etkiler

- Varsayılan depo, ürün formunda depo seçilmeden girilen stoğun ve toplu ürün stok güncellemesinin hedefidir.
- Aktif depolar arasında öncelik numarası en düşük olan, kargo fiyat tahmininin çıkış noktasıdır; gönderici adresi
  bağlı değilse o depo için kargo fiyatı alınamayabilir. Bağlı adres kargo hesabından silinmişse formda kırmızı uyarı:
  "Bu depoya bağlı kargo adresi kargo hesabınızda artık bulunamıyor…".
- Varsayılan stok ayarları yalnız bu depoda sonradan açılan stok kayıtlarını etkiler.
- Pasif/Bakımda depo seçicilerden kalkar; mevcut stok kayıtları silinmez.

## Tuzaklar

1. **Yeni depo otomatik varsayılan olmaz.** Mağazadaki ilk depoda bile "Varsayılan Depo" anahtarını aç; aksi halde
   depo seçmeden stok girişi "depo tanımlı değil" hatası verir.
2. Depo Kodu yalnız BÜYÜK harf/rakam/tire; "wh-01" reddedilir, "WH-01" yaz. Türkçe karakter kullanma.
3. Adres sırası: **Ülke → İl → İlçe**. Ülke seçilmeden Şehir düz metin kutusudur; ülke değişince il/ilçe sıfırlanır.
   İli yazıp listeden seç (Enter ile seçme).
4. Form anahtarlarının label'ı bağlı değil; snapshot'ta kart başlığına göre hangi switch olduğunu doğrula
   (sıra: Varsayılan Depo, Teslim Noktası, Ön Siparişe İzin Ver).
5. Gönderici adresi listesi ve "kargo hesabımda oluştur" butonu kargo entegrasyonu yoksa görünmez — bu engel değil,
   depo yine kaydedilir; kargo kurulunca düzenle ekranından bağlanır.
6. Detaydaki Durum Select ve "Varsayılan Yap" diyalogsuz kaydeder; sadece bakmak için tıklama.
7. Silme `inventory:admin` ister; yetkisiz kullanıcıda hata toast'ı çıkar.
8. Stoğu olan depo listeden silinemez (Sil pasif). Önce stoğu başka depoya transfer et (transfer ekranı) ya da sıfırla.

## Doğrulama

1. Oluşturmada toast + detay sayfasına yönlenme; başlıkta ad, kod, "Aktif" rozeti; varsayılan yapıldıysa "★ Varsayılan Depo".
2. Listede satır: kod (varsayılan ise yıldız), ad, tür, durum, kapasite, şehir, öncelik.
3. Varsayılan kontrolü: listede yalnız bir satırda yıldız olmalı.
4. Ürün formu "Stok" sekmesinde Depo seçicisinde "{ad} ({kod})" görünmeli; depo yok uyarı bandı kalkmalı.
5. Stok ekranındaki "Depo tanımlı değil" uyarısı kalkmalı ([stock.md](stock.md)).
6. Gönderici adresi bağlandıysa düzenle ekranında seçili görünmeli.
