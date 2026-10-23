# Entity: Warehouse (Depo)

Stoğun fiziksel olarak tutulduğu yer. Her stok kaydı bir **SKU + depo** çiftidir ([stock.md](stock.md)); stok girmek
için en az bir depo, ürün formundan depo seçmeden stok girmek için de **aktif bir varsayılan depo** gerekir.

- Ekranlar: [../screens/inventory/warehouses.md](../screens/inventory/warehouses.md) (liste, oluştur, detay/düzenle,
  sipariş dağıtım ayarları), [../screens/inventory/inventory-overview.md](../screens/inventory/inventory-overview.md).
- Playbook: [../../playbooks/warehouse-setup.md](../../playbooks/warehouse-setup.md).
- Yetki: görüntüleme `inventory:read`; oluşturma/düzenleme/durum/varsayılan `inventory:write`; **silme `inventory:admin`**
  (admin ve super_admin rollerinde var).

## Enum'lar

| Enum | Değerler (tr / en) |
|---|---|
| Durum (`status`) | `active` Aktif / Active, `inactive` Pasif / Inactive, `maintenance` Bakımda / Maintenance |
| Tür (`type`, formda seçilebilen) | `main` Ana Depo / Main Warehouse (varsayılan), `fulfillment` Dağıtım Merkezi / Fulfillment Center, `pickup` Teslim Noktası / Pickup Location |
| Tür (listede görünebilen diğer etiketler) | Uydu Depo / Satellite, Stoksuz Satış / Dropship, Sanal / Virtual, Dağıtım Merkezi / Distribution Center — formdan seçilemez |

## Alanlar

| Alan | Label (tr / en) | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|---|
| `code` | Depo Kodu / Warehouse Code | string | evet | — | 2–20 karakter; yalnız **BÜYÜK harf, rakam, tire** (`WH-001`, `IST-01`). Mağaza içinde benzersiz (çakışma: `WAREHOUSE_CODE_EXISTS`). **Oluşturulduktan sonra değiştirilemez** |
| `name` | Ad / Name | string | evet | — | 3–100 karakter |
| `description` | Açıklama / Description | string | hayır | — | ≤500 |
| `type` | Depo Türü / Warehouse Type | enum | evet | `main` | |
| `status` | Durum / Status | enum | — | `active` | Formda yok; yalnız detay ekranındaki durum seçicisinden değişir |
| `priority` | Öncelik / Priority | tam sayı | hayır | 1 | 1–100. **Düşük numara = yüksek öncelik**: sipariş karşılamada ve kargo fiyat tahmininde önce bu depo kullanılır |
| `isDefault` | Varsayılan Depo / Default Warehouse | bool | — | **false** | Mağazada tek varsayılan: biri varsayılan yapılınca diğerinin işareti kalkar. **İlk depo otomatik varsayılan olmaz** |
| `isPickupLocation` | Teslim Noktası / Pickup Location | bool | — | false | "Müşterilerin bu konumdan sipariş almasına izin ver" |
| Adres satırı 1 / 2 | Adres Satırı 1 / Address Line 1, Adres Satırı 2 | string | 1: evet | — | ≤255 |
| Ülke | Ülke Kodu / Country Code | ISO alpha-2 | evet | — | Seçilebilen ülke: **Türkiye (TR)** |
| İl | Şehir / City | string | evet | — | TR'de il listeden seçilir (kargo ile aynı il listesi) |
| İlçe | İlçe / District | string | TR'de yıldızlı | — | İl seçilince listelenir; kargo fiyatı ilçeye duyarlıdır |
| Eyalet / İl | İl / Eyalet / State / Province | string | hayır | — | Serbest metin, ≤100 |
| Posta kodu | Posta Kodu / Postal Code | string | evet | — | ≤20; TR'de 5 hane |
| Konum | Enlem / Latitude, Boylam / Longitude | sayı | hayır | — | −90..90 / −180..180. "Müşteriye En Yakın" dağıtım stratejisi için gerekli |
| Kargo gönderici adresi | Kargo gönderici adresi / Shipping sender address | kargo hesabındaki adres | hayır | Bağlı değil | Kargo fiyatı ve gönderi etiketi bu adrese göre çıkar ([shipping-carrier.md](shipping-carrier.md)) |
| `capacity` | Maksimum Kapasite (adet) / Maximum Capacity (units) | tam sayı | hayır | 0 | **0 = sınırsız**. Doluysa toplam eldeki stok bu değeri aşamaz |
| Kullanılan kapasite | Kapasite / Capacity sütunu | tam sayı | — | — | Salt okunur: depodaki toplam eldeki adet |
| Varsayılan stok ayarları | Düşük Stok Eşiği / Yeniden Sipariş Noktası / Yeniden Sipariş Miktarı / Ön Siparişe İzin Ver | tam sayı ×3, bool | hayır | 10 / 5 / 100 / kapalı | Bu depoda **yeni açılan** stok kayıtlarına başlangıç değeri olarak kopyalanır; mevcut kayıtları değiştirmez. Yeniden Sipariş Miktarı ≥1 |

## Kurallar

- **Varsayılan depo** = "Varsayılan Depo" işaretli **ve Aktif** depo. Pasif veya Bakımda olan varsayılan depo varsayılan
  sayılmaz → ürün formundan depo seçmeden stok girişi, toplu ürün stok güncellemesi gibi işlemler "depo tanımlı değil"
  (`WAREHOUSE_NOT_CONFIGURED`) ile reddedilir.
- **Son depo silinemez** (`WAREHOUSE_CANNOT_DELETE_LAST`). **Varsayılan depo silinemez** — önce başka depoyu varsayılan
  yap. Stoğu olan depo liste ekranından silinemez (Sil butonu pasif; "Bu depoda {count} ürün stokta var").
- Silme geri alınamaz.
- Kod değişmez; yanlış kod için yeni depo açılır.
- Stok giriş/çıkışında kapasite aşılırsa işlem reddedilir (`WAREHOUSE_CAPACITY_EXCEEDED`) — kapasite 0 ise sınır yok.
- Ürün formundaki ve stok ekranlarındaki depo seçicileri yalnız **Aktif** depoları listeler.
- Depo adresini değiştirmek kargo hesabındaki gönderici adresini **değiştirmez**; ikisi ayrı kayıttır.

## Sipariş dağıtım ayarları (mağaza düzeyi, depo listesinin altında)

| Ayar | Değerler | Not |
|---|---|---|
| Depo Seçim Stratejisi (yalnız ≥2 depoda) | Depo Önceliği `priority` (vars.), Müşteriye En Yakın `nearest`, Dengeli Dağıtım `balanced`, Tek Depodan Gönderim `single_warehouse` | En Yakın: depolarda enlem/boylam gerekir; Maksimum mesafe (km, vars. 500) + Alternatif strateji. Dengeli: Kapasite / Öncelik ağırlığı (%) toplamı 100 |
| Stok Çıkış Kuralı | Varsayılan Sıralama `none` (vars.), İlk Giren İlk Çıkar `fifo` (Katı mod), Son Kullanma Tarihi Öncelikli `expiry_based` (Minimum son kullanma günü vars. 30, Uyarı eşiği vars. 60) | |
| Bölünmüş Gönderim (yalnız ≥2 depo, Tek Depo stratejisi dışında) | aç/kapa + Sipariş başına maksimum depo sayısı 2–10 | Kapalı: sipariş tek depodan karşılanır |

Bu ayarlar yalnız **yeni** siparişleri etkiler; işlenmekte olan siparişler değişmez.

## İlişkiler

| İlişki | Not |
|---|---|
| Depo → stok kayıtları | Her SKU her depoda en fazla bir stok kaydı ([stock.md](stock.md)) |
| Ürün formu "Stok" sekmesi → depo | Stoğun yazılacağı depo; boşsa varsayılan depo ([product.md](product.md)) |
| Depo → kargo | Kargo gönderici adresi; öncelik numarası en düşük aktif depo kargo fiyat tahmininin çıkış noktasıdır ([shipping-carrier.md](shipping-carrier.md)) |
| Depo → sipariş | Sipariş satırları dağıtım stratejisine göre depolara atanır; stok rezervasyonu o depodan yapılır |
| Depo → transfer, satın alma siparişi, sayım | Bu kayıtların hepsi depo ister (ayrı haritalar) |
