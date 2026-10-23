# Entity: Stock (Stok kaydı) + Stock Movement (Stok hareketi) + Reservation (Rezervasyon)

**Stok kaydı** = bir SKU'nun bir depodaki miktarı ve ayarları. Aynı SKU birden çok depoda ayrı kayıtlarla durabilir;
SKU'nun toplam stoğu kayıtların toplamıdır. Basit ürünün SKU'su ya da varyantlı ürünün **her varyant SKU'su** ayrı
stok kaydı açar; varyantlı ana ürünün kendi stoğu yoktur.

- Ekranlar: [../screens/inventory/stock.md](../screens/inventory/stock.md) (liste, SKU detayı, ürün matrisi),
  [../screens/inventory/stock-movements.md](../screens/inventory/stock-movements.md),
  [../screens/inventory/inventory-overview.md](../screens/inventory/inventory-overview.md),
  ürün formu "Stok" sekmesi ([../screens/products/product-create.md](../screens/products/product-create.md)).
- Playbook: [../../playbooks/stock-adjust.md](../../playbooks/stock-adjust.md).
- Yetki: görüntüleme `inventory:read`; düzeltme, kayıt açma, ayar, arşiv `inventory:write`.

## Miktarlar

| Kavram | Label (tr / en) | Tanım |
|---|---|---|
| Eldeki | Eldeki / On Hand | Depoda fiziksel olarak duran adet. Düzeltmeler bunu değiştirir |
| Rezerve | Rezerve / Reserved | Ödeme/sipariş sürecindeki sepetler ve siparişler için ayrılmış adet |
| Kullanılabilir (satılabilir) | Kullanılabilir / Available | **Eldeki − Rezerve**. Vitrinde satılabilir miktar budur |
| Gelen | Gelen / Incoming | Yoldaki (satın alma siparişi / transfer) adet; henüz eldekine eklenmemiş |

## Durum (`status`)

| Değer | Label (tr / en) | Ne zaman |
|---|---|---|
| `in_stock` | Stokta / In Stock | Kullanılabilir > Düşük Stok Eşiği |
| `low_stock` | Düşük Stok / Low Stock | 0 < Kullanılabilir ≤ Düşük Stok Eşiği |
| `out_of_stock` | Stokta Yok / Out of Stock | Kullanılabilir ≤ 0 ve ön sipariş kapalı |
| `backorder` | Ön Sipariş / Backorder | Kullanılabilir ≤ 0 ve ön sipariş açık |

"Yeniden Sipariş Gerekli / Needs Reorder" = Eldeki ≤ Yeniden Sipariş Noktası.

## Alanlar (stok kaydı başına, depo bazında)

| Alan | Label (tr / en) | Tip | Varsayılan | Kural |
|---|---|---|---|---|
| SKU | SKU | string | — | ≤50; ürün/varyant SKU'su ile birebir aynı olmalı (büyük/küçük harf dahil) |
| Depo | Depo / Warehouse | depo | — | Aktif depo. SKU + depo çifti benzersiz (ikinci kayıt: "Bu SKU seçili depoda zaten kayıtlı…", `INVENTORY_STOCK_EXISTS`) |
| Eldeki miktar | Miktar / Başlangıç Miktarı | tam sayı | 0 | ≥0; kayıt açarken en fazla 999.999 |
| Düşük Stok Eşiği | Düşük Stok Eşiği / Low Stock Threshold | tam sayı | deponun varsayılanı (10) | ≥0 |
| Yeniden Sipariş Noktası | Yeniden Sipariş Noktası / Reorder Point | tam sayı | deponun varsayılanı (5) | ≥0 |
| Yeniden Sipariş Miktarı | Yeniden Sipariş Miktarı / Reorder Quantity | tam sayı | deponun varsayılanı (100) | ≥1 |
| Ön sipariş | Ön Siparişe İzin Ver / Allow Backorder | bool | deponun varsayılanı (kapalı) | Açıkken stok 0'ın altına satılabilir |
| Ön Sipariş Limiti | Ön Sipariş Limiti / Backorder Limit | tam sayı | boş = sınırsız | Ön sipariş açıkken stok altına satılabilecek en fazla adet |
| Raf Konumu | Raf Konumu / Bin Location | string | — | ≤50 |
| Bölge | Bölge / Zone | string | — | ≤50 |
| Birim Maliyet | Birim Maliyet / Unit Cost (+ Para Birimi) | sayı | — | SKU detayında salt okunur görünür; stok değeri raporunu besler |
| Son Güncelleme | Son Güncelleme / Last Updated | tarih | — | salt okunur |

Ürün formundan ilk kez stok yazıldığında kayıt, ürün formundaki Düşük Stok Eşiği ve Ön Siparişe İzin Ver değerleriyle
açılır; sonraki değişiklikler stok kaydının kendi ayarlarından yapılır (ürün formundaki eşik değişikliğinin mevcut stok
kaydına yansıması doğrulanmadı).

## Düzeltme türleri (Stok Düzenle)

| Tür | Label (tr / en) | Etki | İpucu |
|---|---|---|---|
| `set` | Ayarla / Set to | Eldeki = girilen değer | "Sayım sonrası kullanın" |
| `increment` | Ekle / Add | Eldeki + girilen | "Gelen mal için kullanın" |
| `decrement` | Çıkar / Remove | Eldeki − girilen | "Gönderilen veya kaybolan mal için kullanın". Ön sipariş kapalıyken eldekinin altına düşürülemez (`INSUFFICIENT_STOCK`) |

Sebep kategorisi (zorunlu): Düzeltme/Correction `correction` (vars.), Hasar/Damaged `damaged`, Çalıntı / Kayıp/Theft / Loss
`theft`, Yeniden Stoklama/Restock `restock`, Müşteri İadesi/Customer Return `return`, Yeniden Sayım/Recount `recount`,
Transfer Kaybı/Transfer Loss `transfer_loss`, Diğer/Other `other` (**açıklama zorunlu**). Açıklama ≤500; Referans serbest
(ör. `PO-001`).

## Hareket türleri (Stok Hareketleri ekranı)

Her miktar değişikliği bir hareket kaydı bırakır (tarih, depo, değişim, önceki/yeni seviye, sebep, referans, kullanıcı).
Hareketler değiştirilemez ve silinemez.

| Değer | Liste etiketi (tr / en) | Detay başlığı | Kaynağı |
|---|---|---|---|
| `adjustment` | Düzeltme / Adjustment | Envanter Düzeltmesi | Stok Düzenle, toplu düzenleme, matris, ürün formundan stok, ilk kayıt ("Initial stock creation") |
| `sale` | Satış / Sale | Satılan Stok | Sipariş karşılanınca (rezerve stok eldekinden düşülür; sebep "Order fulfilled") |
| `return` | İade / Return | Müşteri İadesi | Sipariş iadesi stoğa döndüğünde |
| `transfer_in` / `transfer_out` | Gelen Transfer / Giden Transfer | — | Depolar arası transfer |
| `purchase` | Satın Alma / Purchase | Satın Alma Girişi | Satın alma siparişi teslim alındığında |
| `damage` | Hasarlı / Damaged | Hasarlı Stok | Hasar çıkışı |
| `shrinkage` | Fire / Shrinkage | Stok Firesi | Kayıp (hırsızlık, son kullanma, sayım farkı) |
| `count` | Sayım Düzeltmesi / Count Correction | — | Sayım işlemi onayı |
| `reservation` | Rezervasyon / Reserved | Stok Rezervasyonu | Filtrede var; rezervasyonlar Eldeki'yi değiştirmediğinden hareket listesinde çoğunlukla görünmez (doğrulanmadı) |
| `release` | Serbest Bırakıldı / Released | Stok Serbest Bırakıldı | 〃 |

## Rezervasyon yaşam döngüsü

1. Müşteri ödeme adımına geçtiğinde sepetteki adetler süreli olarak **rezerve** edilir (varsayılan süre ~15 dk;
   3D Secure gibi adımlarda uzatılabilir). Kullanılabilir düşer, Eldeki değişmez.
2. Sipariş karşılandığında rezervasyon **işlenir**: adet hem Eldeki'den hem Rezerve'den düşer (Satış hareketi,
   sebep "Order fulfilled"). Hangi sipariş adımında işlendiği (ödeme onayı / kargolama) doğrulanmadı.
3. Süre dolar ya da sipariş iptal edilirse rezervasyon **serbest bırakılır**: Rezerve azalır, Kullanılabilir geri gelir.
- Rezervasyon admin ekranından elle oluşturulmaz/kaldırılmaz; sipariş ekranlarındaki işlemlerin sonucudur.
- Eldeki'yi Rezerve'nin altına çeken bir "Ayarla" düzeltmesi Kullanılabilir'i 0 veya altına indirir → durum Stokta Yok /
  Ön Sipariş olur; bekleyen siparişler etkilenebilir. Özetinde rezerve miktarı göster.

## Yan etkiler (her miktar değişikliğinde)

- Ürün/varyant stoğu ve vitrindeki stok durumu SKU eşleşmesiyle güncellenir (birkaç saniye içinde).
- **0 → >0** (stok geri geldi): "Stok gelince haber ver" aboneliği olan **müşterilere e-posta gider**.
- Düşük stok / stok tükendi: yöneticilere uyarı e-postası (bildirim şablonları açıksa) ve mağazanın web kancalarına
  stok olayları (`inventory.stock_changed`, `inventory.low_stock`, `inventory.out_of_stock`, `inventory.back_in_stock`).
- Deponun kullanılan kapasitesi değişir.

## Arşivleme ve "Atanmamış SKU"

- **Atanmamış SKU / Unassigned SKU**: stok kaydı bir ürüne bağlı ama SKU o ürünün güncel varyant listesinde yok
  (ör. varyant silinmiş/yeniden üretilmiş). Bu satırlarda üç işlem var: Başka SKU'ya bağla, Sıfırla (0'a ayarlar,
  düzeltme hareketi bırakır), Arşivle.
- **Arşivle**: kayıt stok toplamlarından ve ürün stoğundan çıkarılır, geçmişi korunur. Admin'de arşivden geri alma
  ekranı yok → geri alınamaz kabul et.
- Ürün formunda stoklu bir varyant silinip kaydedilince o varyantın stok kaydı arşivlenir
  ([../screens/products/product-edit.md](../screens/products/product-edit.md)).

## İlişkiler

| İlişki | Not |
|---|---|
| Stok → depo | zorunlu ([warehouse.md](warehouse.md)) |
| Stok → ürün / varyant | SKU ile eşleşir; liste ekranındaki "Stok Ekle" ürün bağlantısı olmadan yalnız SKU ile kayıt açar |
| Sipariş → rezervasyon → satış hareketi | Sipariş ekranları (faz 3, siparişler) |
| Transfer, satın alma, sayım → hareket | Envanterin diğer ekranları |
