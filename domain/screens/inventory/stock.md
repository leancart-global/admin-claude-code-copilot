# Stok (liste + SKU detayı + ürün envanter matrisi)

- URL'ler:
  - Liste: `{ADMIN_URL}/inventory/stock`
  - SKU detayı: `{ADMIN_URL}/inventory/stock/{sku}` (SKU URL-kodlu)
  - Ürün envanter matrisi: `{ADMIN_URL}/inventory/stock/product/{productId}`
- Menü yolu: Sol menü "Envanter / Inventory" → "Stok / Stock". SKU detayına liste satırından, düşük stok panelinden;
  matrise liste ⋯ menüsünden ya da ürün detayındaki "Ürün envanterini görüntüle / View product inventory" butonundan.
- Sayfa başlıkları: liste "Stok Yönetimi / Stock Management" (+ kayıt adedi, gerekirse "{n} ürün" rozeti), açıklama
  "Tüm depolardaki stok seviyelerini görüntüleyin ve yönetin"; SKU detayı başlığı = SKU (+ durum rozeti, altında ürün
  adı); matris "Envanter Matrisi / Inventory Matrix" — "Tüm varyant ve depolar için stoğu yönetin".
- Amaç: SKU'ların depo bazındaki stoğunu görmek ve düzeltmek, yeni depo-stok kaydı açmak, eşik/ön sipariş/konum
  ayarlarını yönetmek, varyantlı ürünün stoğunu tek tabloda düzenlemek.
- Entity: [../../entities/stock.md](../../entities/stock.md), [../../entities/warehouse.md](../../entities/warehouse.md).
  Playbook: [../../../playbooks/stock-adjust.md](../../../playbooks/stock-adjust.md).
- Yetki: görüntüleme `inventory:read`; düzenleme, kayıt açma, ayar, sıfırlama, arşiv `inventory:write`.

## Ön koşullar ve bağımlılıklar

- **≥1 aktif depo** ([warehouses.md](warehouses.md)). Hiç depo yoksa listede uyarı: "Depo tanımlı değil / No warehouse
  configured — Stok ekleyebilmek veya yönetebilmek için önce bir depo tanımlamanız gerekir…" + "Depo oluştur" linki.
- Ürün / varyant SKU'su katalogda olmalı (stok kaydı SKU ile ürüne eşlenir). Ürün oluşturma:
  [../products/product-create.md](../products/product-create.md).
- Stok kaydı yoksa düzeltme yapılamaz; önce kayıt açılır ("Stok Ekle" / "Depoya Ekle") ya da ürün formunun "Stok"
  sekmesinden miktar girilir.

### Ürün formundaki "Stok" sekmesi ile ilişki
- Ürün oluştururken/düzenlerken "Stok / Inventory" sekmesindeki **Depo + Miktar**, o SKU için seçili depodaki stok
  kaydını yazar: kayıt yoksa açar (ürün formundaki Düşük Stok Eşiği ve Ön Siparişe İzin Ver ile), varsa miktarı
  **"Ayarla" (mutlak değer)** olarak değiştirir. Hareket listesinde "Düzeltme" olarak görünür.
- Depo seçilmezse **varsayılan depo** kullanılır (oluşturmada); düzenlemede miktar değişiyorsa depo seçimi şarttır.
- Varyantlı üründe miktarlar varyant satırlarından girilir ve Stok sekmesindeki Depo'ya yazılır; her varyant SKU'su ayrı
  stok kaydıdır. Ana ürünün kendi stoğu yoktur.
- Ürün detayındaki "Envanter" kartı satılabilir toplamı gösterir; "Ürün envanterini görüntüle" bu ekranın matrisini açar.
- Çok depolu mağazada bir SKU'nun ikinci depoya stoğu ürün formundan değil, bu ekranlardan ("Depoya Ekle", matris) girilir.

## Yerleşim

### Liste (`/inventory/stock`)
1. Başlık kartı; sağda: yoğunluk düğmesi (aria-label "Yoğunluk / Density"; "Rahat/Kompakt"), "Toplu Düzenle / Bulk Adjust",
   "Stok Ekle / Add Stock".
2. Depo yok uyarısı (varsa).
3. Filtreler: "SKU ile ara / Search by SKU" (yalnız SKU; ürün adıyla aranmaz), depo Select "Tüm Depolar", durum Select
   "Tüm Durumlar" (Stokta, Düşük Stok, Stokta Yok, Ön Sipariş), checkbox "Sadece Düşük Stok", checkbox
   "Yeniden Sipariş Gerekli". Dar ekranda "Filtreler" panelinde.
4. Tablo **ağaç yapısında**: Ürün satırı → (genişlet, aria-label "Satırı genişlet") → Varyant/SKU satırı → Depo satırı.
   Sütunlar: "Ürün", "Depo", "Eldeki", "Rezerve", "Kullanılabilir", "Gelen", "Durum", "Yeniden Sipariş Noktası",
   "Konum", "Bölge", "Son Güncelleme", "⋯" (sr-only "İşlemler / Actions"). Ürün satırında "{n} varyant · {m} depo",
   "{k}/{n} düşük stok"; katalogda olmayan SKU'larda "Atanmamış SKU / Unassigned SKU" rozeti.
   SKU araması tek eşleşmede üst satırları otomatik açar.
5. ⋯ menüsü satır türüne göre:
   - Ürün: "Ürün envanterini görüntüle" (matris), "Ürün ID'sini kopyala", "Ürünü aç".
   - Varyant/SKU: "SKU'yu kopyala", "Detay Görüntüle" (SKU detayı), "Stok geçmişini gör" (`/inventory/movements?sku=`), "Ürünü aç".
   - Depo satırı: "SKU'yu kopyala", "Detay Görüntüle", **"Stok Düzenle / Adjust Stock"**, **"Ayarları Düzenle / Edit Settings"**;
     Atanmamış SKU ise ayrıca grup "Atanmamış SKU işlemleri": "Başka SKU'ya bağla", "Sıfırla", "Arşivle".
6. Boş durum: "Stok Kaydı Yok"; arama sonuçsuzsa "Bu SKU ile eşleşen stok bulunamadı" + "Ürünler sayfasına git".
7. Sayfalama: ürün satırı bazında 20; liste en fazla 100 stok kaydı yükler → belirli SKU için arama kullan.

### SKU detayı (`/inventory/stock/{sku}`)
- Başlık: "Stok Listesine Dön", SKU, genel durum rozeti, ürün adı; **yalnız tek depoda kayıt varsa** sağda "Stok Düzenle".
- Özet kartları: "Toplam Eldeki", "Toplam Kullanılabilir", "Toplam Rezerve", "Toplam Gelen".
- "Depo Dağılımı / Warehouse Breakdown" tablosu (sağ üstte **"Depoya Ekle / Add to Warehouse"**): Depo, Eldeki, Rezerve,
  Kullanılabilir, Gelen, Durum, Konum ("Konum ayarla" linki), Bölge ("Bölge ayarla"), satır sonu ikonlar
  aria-label "Stok Düzenle" ve "Ayarları Düzenle".
- "Son Hareketler / Recent Movements" + "Tümünü gör" → hareketler ekranı SKU filtreli.
- Sağ sütun: "Stok Ayarları" kartı (tek depoda değerler + "Ayarları Düzenle"; çok depoda "Bu SKU birden fazla depoda…
  Düzenlemek için depo satırının ⚙️ simgesine tıklayın."), "Hızlı İşlemler" (Stok Düzenle, "Hareketleri Görüntüle"),
  "Bilgi" (Son Güncelleme). Birim maliyet varsa ayarlar kartında görünür.

### Ürün envanter matrisi (`/inventory/stock/product/{productId}`)
- "Stok listesine dön"; özet: "Toplam Eldeki", "Rezerve", "Kullanılabilir", "Düşük Stoklu SKU", (yetkiliyse) "Stok Değeri".
- Stok kaydı olmayan varyant varsa sarı bant: "{n} varyantın stok kaydı yok — Bu varyantlar katalogda var ama henüz
  hiçbir depoda takip edilmiyor…" + her varyant için "Depoya ekle".
- Araç çubuğu: varyant araması "Varyantları ada veya SKU'ya göre arayın"; **Switch "Düzenleme modu / Edit mode"**.
- Tablo: satır = varyant, sütun = depo, son sütun "Toplam". Okuma modunda hücre = rozet (kırmızı: tükendi, sarı: düşük),
  tıklayınca SKU detayı. Kayıt yoksa "—".
- Düzenleme modunda hücreler sayı kutusu (aria-label "{varyant} varyantının {depo} deposundaki stoğu", test id
  `cell-{SKU}-{depoId}`); "—" hücreleri düzenlenemez. Değişen hücre işaretlenir; Esc veya çift tık geri alır.
  Altta "{n} kaydedilmemiş değişiklik", "İptal", **"Değişiklikleri kaydet / Save changes"**. Çakışma varsa
  "{n} çakışma" + "Çakışanları yenile".
- Sayfalama: sayfa başına 20 varyant. Kaydedilmemiş değişiklikle ayrılırken: "Kaydedilmemiş değişiklikleri iptal et?"
  → "İptal et ve ayrıl".

## Alanlar

### "Stok Düzenle / Adjust Stock" diyaloğu ("{sku} için stok miktarını düzenle")
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Düzenleme Türü / Adjustment Type | RadioGroup | evet | "Ayarla" | `#adj-set` (Ayarla / Set to), `#adj-add` (Ekle / Add), `#adj-remove` (Çıkar / Remove) | İpuçları: "Sayım sonrası kullanın", "Gelen mal için kullanın", "Gönderilen veya kaybolan mal için kullanın" |
| Miktar * / Quantity | number | evet | tam sayı ≥0; varsayılan = mevcut eldeki | `#quantity` | Ayarla'da hedef değer, Ekle/Çıkar'da fark |
| Önizleme / Preview | salt okunur "{mevcut} → {yeni}" | — | yeşil artış, kırmızı azalış | | Özeti bununla karşılaştır |
| Sebep Kategorisi * / Reason Category | Select | evet | "Düzeltme" | `#reasonCode` | Düzeltme, Hasar, Çalıntı / Kayıp, Yeniden Stoklama, Müşteri İadesi, Yeniden Sayım, Transfer Kaybı, Diğer |
| Açıklama / Note | Input | Diğer'de evet | ≤500; placeholder "ör. Sayımda 3 adet eksik çıktı" | `#reasonNote` | "\"Diğer\" seçildiğinde açıklama zorunlu" |
| Referans / Reference | Input | hayır | placeholder "ör. PO-001" | `#reference` | |
Butonlar: "İptal", **"Uygula / Apply"**.

### "Stok Ekle / Add Stock" paneli (liste; "Yeni stok kaydı oluştur")
| Label | Kontrol | Zorunlu | Validasyon | Locator | Not |
|---|---|---|---|---|---|
| SKU | Input | evet | ≤50; placeholder "ör. PROD-001" | `#create-sku` | Katalogdaki SKU ile birebir aynı yaz |
| Depo / Warehouse | Select ("Depo seçin") | evet | yalnız aktif depolar | label "Depo" | |
| Başlangıç Miktarı / Initial Quantity | number | — | 0–999.999 | `#create-quantity` | |
| Raf Konumu / Bin Location | Input | hayır | ≤50 | `#create-binLocation` | |
| Bölge / Zone | Input | hayır | ≤50 | `#create-zone` | |
Butonlar: "İptal", "Stok Ekle". Eşik/ön sipariş değerleri deponun varsayılan stok ayarlarından gelir.

### "Depoya Ekle / Add to Warehouse" paneli (SKU detayı, matris bandı; "{sku} için yeni depoya stok ata")
Depo (yalnız bu SKU'nun **henüz olmadığı** aktif depolar; hepsi doluysa "Tüm aktif depolarda stok mevcut"),
Başlangıç Miktarı `#assign-quantity`, Raf Konumu `#assign-binLocation`, Bölge `#assign-zone` → "Stok Ekle". Kayıt ürüne bağlı açılır.

### "Stok Ayarları / Stock Settings" paneli ("{sku} için stok eşiklerini ve konumu güncelle"; depo kaydı başına)
| Label (tr / en) | Kontrol | Validasyon | Locator |
|---|---|---|---|
| Düşük Stok Eşiği / Low Stock Threshold | number | 0–100000 | `#lowStockThreshold` |
| Yeniden Sipariş Noktası / Reorder Point | number | 0–100000 | `#reorderPoint` |
| Yeniden Sipariş Miktarı / Reorder Quantity | number | ≥1 | `#reorderQuantity` |
| Ön Siparişe İzin Ver / Allow Backorder | Switch | — | paneldeki switch |
| Ön Sipariş Limiti / Backorder Limit | number (yalnız ön sipariş açıkken) | ≥0, boş = sınırsız | `#backorderLimit` |
| Raf Konumu / Bin Location | Input | — | `#binLocation` |
| Bölge / Zone | Input | — | `#zone` |
Butonlar: "İptal", "Kaydet" (değişiklik yokken pasif).

### "Toplu Stok Düzenleme / Bulk Stock Adjust" paneli ("Birden fazla SKU için stoğu tek seferde güncelleyin")
- Depo * (Select "Depo seçin") — tüm satırlar bu depoya uygulanır.
- Kalemler * ("En az bir SKU ekleyin (en fazla 50)"): satır = SKU (placeholder "ör. SKU-001") + Tür (Ayarla/Ekle/Çıkar)
  + Miktar (≥0); "Satır Ekle", satır silme aria-label "Satırı Sil".
- Sebep Kategorisi *, Açıklama (Diğer'de zorunlu), Referans.
- **"Toplu Düzenlemeyi Uygula / Apply Bulk Adjust"** (geçerli değilken pasif).

## Aksiyonlar

| Buton | Ne olur | Toast |
|---|---|---|
| Stok Düzenle → **Uygula** | Seçili depo kaydında eldeki miktar değişir, "Düzeltme" hareketi yazılır | "Stok başarıyla düzenlendi" — "{sku} stoku {n} olarak güncellendi"; hata "Stok düzenleme başarısız" (Çıkar ile 0 altına inme reddi dahil) |
| Stok Ekle / Depoya Ekle → **Stok Ekle** | Yeni SKU+depo kaydı açılır, başlangıç hareketi yazılır | "Stok kaydı başarıyla oluşturuldu"; aynı depoda varsa "Bu SKU seçili depoda zaten kayıtlı. Miktarı değiştirmek için 'Stok Düzenle' kullanın."; depo yoksa "Stok eklemeden önce bir depo tanımlamanız gerekir…" |
| Ayarları Düzenle → **Kaydet** | Eşik/ön sipariş/konum güncellenir; durum yeniden hesaplanır | "Stok ayarları güncellendi"; hata "Stok ayarları güncellenemedi" |
| **Toplu Düzenlemeyi Uygula** | Her satır ayrı düzeltme; kısmi başarı olabilir | "Stok başarıyla düzenlendi" — "{n} kalem güncellendi" |
| Matris → **Değişiklikleri kaydet** | Değişen hücreler depo başına "Ayarla" olarak yazılır (sebep "Manuel matris düzenlemesi") | "Stok güncellendi — {n} stok hücresi kaydedildi"; kısmi: "Bazı değişiklikler kaydedilemedi — {total} depo güncellemesinin {failed} tanesi başarısız oldu"; çakışma: "{x} kaydedildi, {y} çakışma" + "Bazı hücreler başka bir oturumda değiştirilmiş…" |
| Atanmamış SKU → **Sıfırla** → "Stok sıfırlansın mı?" ("{sku} şu anda {quantity} birim. 0'a çekildiğinde stok düzeltme kaydı oluşturulur.") → Sıfırla | Eldeki 0 | "Stok sıfırlandı" |
| Atanmamış SKU → **Arşivle** → "Bu stok kaydı arşivlensin mi?" ("{sku} stok toplamlarından çıkarılır… Geçmiş bilgileri korunur.") → Arşivle | Kayıt arşivlenir, listeden düşer | "Stok kaydı arşivlendi" |
| Atanmamış SKU → Başka SKU'ya bağla | Hedef varyant SKU'su ister ("Hedef varyant SKU'su", "Bağla") | Henüz aktif değil: "Yeniden bağlama henüz aktif değil" — bu işlemi teklif etme |
| Stok geçmişini gör / Hareketleri Görüntüle | [stock-movements.md](stock-movements.md) SKU filtreli | — |

## Onay zamanlaması (kural 2/5/6)

- **Uygula (Stok Düzenle)**, **Stok Ekle**, **Depoya Ekle**, **Ayarlar → Kaydet**: her biri kalıcı; öncesinde özet
  (ortam, SKU, ürün adı, depo, tür, mevcut Eldeki / Rezerve / Kullanılabilir, yeni Eldeki, sebep, referans) + açık onay.
- **Toplu Düzenlemeyi Uygula** ve **Matris → Değişiklikleri kaydet**: toplu işlem (kural 5) → etkilenen SKU × depo
  sayısı ve satır satır eski → yeni tablo; ayrı onay. Matris kaydı her depo için ayrı yazılır, kısmen başarılı olabilir.
- **Sıfırla** ve **Arşivle**: geri alınamaz kabul et; tek tek ayrı onay (SKU, depo, mevcut miktar).
- **Müşteriye e-posta**: stok 0'dan yukarı çıkarsa "stok gelince haber ver" abonelerine e-posta gider; özetinde
  "stok 0 → n: abonelere bildirim gidebilir" yaz. Düşük stok/tükendi durumları yönetici uyarısı ve web kancası tetikler.
- **Vitrin**: kullanılabilir miktar ve stok durumu birkaç saniye içinde vitrine yansır (satışa açılır/kapanır).
- **Pazaryerleri (dış sistem)**: bağlı ve aktif pazaryeri kanalı varsa **bağlı pazaryerlerinde stok da güncellenir**
  (kullanılabilir − kanalın stok tamponu, birkaç saniye içinde) → özetin yan etki satırına yaz
  ([../../entities/marketplace-channel.md](../../entities/marketplace-channel.md) §7, [../marketplace/channel.md](../marketplace/channel.md)).
- Ekranda anında/diyalogsuz kayıt yapan alan yok; matris değişiklikleri "Değişiklikleri kaydet" basılana kadar yerel kalır.

## Yan etkiler

- Her miktar değişikliği değiştirilemez bir hareket kaydı bırakır ([stock-movements.md](stock-movements.md)).
- Ürün/varyant stoğu ve ürün listesindeki stok, SKU eşleşmesiyle güncellenir; düşük stok paneli ([inventory-overview.md](inventory-overview.md)) değişir.
- Deponun kullanılan kapasitesi değişir; kapasite doluysa artış reddedilir.
- Ön sipariş açılırsa stok 0 olsa da ürün satılabilir (durum "Ön Sipariş").

## Tuzaklar

1. **Eldeki ≠ Kullanılabilir.** "Stoğu 10 yap" isteğinde genelde Eldeki kastedilir; rezerve varsa kullanılabilir
   10'dan az olur. Özetinde ikisini de göster; kullanıcı "satılabilir 10" diyorsa hedef Eldeki = 10 + Rezerve.
2. "Ayarla" mutlak değer, "Ekle/Çıkar" farktır; Miktar alanı varsayılan olarak mevcut değerle dolu gelir — türü
   değiştirince miktarı yeniden yaz ve Önizleme'yi kontrol et.
3. Çok depolu SKU'da başlıktaki "Stok Düzenle" görünmez; depo satırındaki ikonla doğru depoyu seç.
4. Stok kaydı olmayan depoda düzeltme yapılamaz → önce "Depoya Ekle".
5. Liste araması yalnız SKU ile; ürün adıyla aramak için Ürünler ekranında SKU'yu bul.
6. "Stok Ekle" (liste) ürün bağlantısı olmadan SKU ile kayıt açar; SKU yazımı katalogla birebir aynı olmalı. Mümkünse
   SKU detayındaki "Depoya Ekle"yi kullan.
7. Matriste "—" hücreleri düzenlenemez; önce bant/SKU detayından "Depoya ekle".
8. Toplu düzenleme panelinde tüm satırlar tek depoya gider; farklı depolar için ayrı işlem.

## Doğrulama

1. Toast metnindeki yeni miktar özetle aynı mı.
2. SKU detayında ilgili depo satırı: Eldeki, Rezerve, Kullanılabilir, Durum; "Son Hareketler"de yeni "Düzeltme" satırı
   (değişim, sebep, referans, kullanıcı).
3. Toplu/matris işlemlerinde her SKU'yu tek tek kontrol et (kısmi başarı olabilir).
4. Gerekirse ürün detayında "Envanter" kartındaki satılabilir toplam ([../products/product-detail.md](../products/product-detail.md)).
