# Sipariş Listesi (Orders)
- URL: {ADMIN_URL}/orders
- Menü yolu: Sol menü "Siparişler / Orders" → "Siparişler / Orders".
- Sayfa başlığı: "Siparişler / Orders" + toplam sayı; açıklama "Müşteri siparişlerini ve sevkiyatları yönetin / Manage
  customer orders and fulfillment".
- Amaç: Siparişleri aramak, filtrelemek, detaya gitmek; seçili siparişlerde toplu durum değişikliği, CSV dışa aktarma,
  toplu silme.
- Entity: [../../entities/order.md](../../entities/order.md).
- Yetki: liste `orders:read`; toplu durum/silme `orders:bulk` (+ silmede `orders:delete`); "Sipariş Oluştur" →
  [order-create.md](order-create.md) (`orders:write`).
- Kişisel veri: **evet** (müşteri adı, e-posta). Dışa aktarma kişisel veri içeren CSV indirir.

## Ön koşullar ve bağımlılıklar
- Yok (salt listeleme). Siparişler vitrin, pazaryeri, abonelik yenilemesi ya da [order-create.md](order-create.md) ile oluşur.

## Yerleşim
1. Başlık satırı: sağda "Dışa Aktar / Export" (yalnız listede sipariş varken; dar ekranda yalnız ikon) ve
   "Sipariş Oluştur / Create Order".
2. Hızlı filtre çubuğu (aşağıda) + "Gelişmiş / Advanced" butonu (aktif gelişmiş filtre sayısı rozetli).
3. Filtre etiketleri: "Durum: …", "Ödeme: …", "Tarih: …", "Arama: "…"", "+N daha"; her biri tek tek kaldırılır;
   "Tümünü temizle / Clear all".
4. Seçim yapılınca toplu işlem çubuğu: "Durumu Güncelle / Update Status", "Dışa Aktar / Export", "Sil / Delete".
5. Tablo sütunları: seçim kutusu, "Sipariş Numarası / Order Number" (altında "N Ürünler"), "Müşteri / Customer",
   "Tarih / Date", "Toplam / Total", "Ödeme / Payment" (ödeme durumu rozeti), "Durum / Status", işlemler
   (göz ikonu + "⋯"). Numara, müşteri, tarih, toplam sütunları başlığa tıklanarak sıralanır (yalnız görünen sayfa).
6. Sayfalama: sayfa başına 20.
7. Boş durum: "Sipariş bulunamadı" / filtreliyken "Filtrelere uyan sipariş yok".

## Alanlar (filtreler)
### Hızlı filtreler
| Label (tr / en) | Kontrol tipi | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|
| Arama / Search | Input (placeholder "Sipariş #, müşteri, e-posta veya ürün ara...") | boş | aria-label "Sipariş ara / Search orders" | Gecikmeli arar. Sunucu sipariş numarası ve müşteri e-postasında arar (ürün adıyla eşleşme doğrulanmadı) |
| Durum / Status | Select | "Tüm Durumlar" | placeholder "Durum" | Beklemede, Bekletiliyor, Dolandırıcılık İncelemesi, Hazırlanıyor, Hazır, Kısmen Gönderildi, Kargoya Verildi, Teslim Edildi, Tamamlandı, İptal Edildi, Kısmi İade Yapıldı, İade Edildi |
| Tarih aralığı / Date range | Select | "Tüm Zamanlar" | placeholder "Tarih aralığı" | Bugün, Dün, Son 7 Gün, Son 30 Gün, Bu Ay, Geçen Ay |
| Ödeme / Payment | Select | "Tüm Ödemeler" | placeholder "Ödeme" | Beklemede, Yetkilendirildi, Ödendi, Başarısız, İade Edildi |
| Kaynak / Source | Select | "Tüm Kaynaklar" | placeholder "Kaynak" | Web, Mobil, Abonelik, Trendyol, Amazon, Hepsiburada, N11 |

### Gelişmiş Filtreler (sağdan açılan panel "Gelişmiş Filtreler / Advanced Filters")
Gruplar (açılır-kapanır): Müşteri, Finansal, Ödeme, Kargo, Ürün, Konum, Tarih Aralıkları, Ek Bayraklar.

| Grup | Label (tr / en) | Kontrol | Locator |
|---|---|---|---|
| Müşteri | Müşteri Adı, Müşteri E-posta, Telefon Numarası | Input | `#customerName`, `#customerEmail`, `#customerPhone` |
| Müşteri | Müşteri Grubu (Genel / Toptan / VIP) | Select | label |
| Müşteri | Sadece misafir siparişler | Checkbox | `#isGuest` |
| Finansal | Min/Max Toplam, Min/Max Ara Toplam | number | `#minTotal`, `#maxTotal`, `#minSubtotal`, `#maxSubtotal` |
| Finansal | Para Birimi (USD/EUR/GBP/TRY) | Select | label |
| Ödeme | Ödeme Yöntemi, İşlem ID, İade var | Select / Input / Checkbox | `#transactionId`, `#hasRefund` |
| Kargo | Kargo Yöntemi, Takip Numarası, Kargo Firması | Select / Input | `#trackingNumber` |
| Ürün | Ürün SKU, Ürün Adı, Hediye mesajı var | Input / Checkbox | `#productSku`, `#productName`, `#hasGiftMessage` |
| Konum | Fatura / Teslimat adresi: Ülke, İl/Eyalet, Şehir | Input | placeholder |
| Tarih Aralıkları | Sipariş Oluşturuldu, Kargolandı: Başlangıç / Bitiş | date | `#createdFrom`, `#createdTo`, `#shippedFrom`… |
| Ek Bayraklar | Kupon kodu var, Sipariş notu var, Müşterinin ilk siparişi, İnceleme için işaretlendi, Fatura eksik | Checkbox | label |
Butonlar: "Sıfırla / Reset", "Filtreleri Uygula / Apply Filters". Sunucunun her gelişmiş filtreyi uyguladığı doğrulanmadı;
sonucu listeden kontrol et.

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Satıra tıklama / göz ikonu (aria-label "View order {no}") / "⋯" → "Detayları Gör" | [order-detail.md](order-detail.md) açılır | — |
| Sipariş Oluştur | `/orders/new` | — |
| Dışa Aktar (başlık) | **Görünen sayfadaki** (en çok 20) siparişi `orders-YYYY-AA-GG.csv` olarak indirir | "{N} sipariş başarıyla dışa aktarıldı." |
| Toplu → Dışa Aktar | Seçili siparişleri CSV indirir | "{N} sipariş başarıyla disari aktarıldı." |
| Toplu → Durumu Güncelle → "Durumu Değiştir" listesi: Beklemede, Hazırlanıyor, Hazır, Kargoya Verildi, Tamamlandı, İade Edildi | Seçime tıklanınca **onay diyaloğu olmadan hemen** her sipariş için durum değiştirilir; her sipariş kendi geçiş kuralına tabidir | "{N} sipariş {durum} olarak güncellendi." / kısmi: "{N} sipariş … güncellendi. {M} başarısız." |
| Toplu → Sil (aria-label "{N} seçili siparişi sil") | Onay diyaloğu "{N} seçili sipariş silinsin mi?" — "Bu işlem seçili siparişleri kalıcı olarak siler. Bu işlem geri alınamaz." → "Sil" | "{N} sipariş başarıyla silindi." / kısmi |
| Satır "⋯" → "E-posta Gönder", "Faturayi Görüntüle", "Siparişi Sil" | Haritalanmış akış yok (doğrulanmadı) — fatura için detay ekranını, silme için toplu seçimi kullan | — |

## Onay zamanlaması (kural 2/5)
- **Toplu "Durumu Güncelle" diyalogsuz ve anında** uygular → onayı menü öğesine tıklamadan **önce** al. Özette:
  etkilenen sipariş sayısı ve numaraları, hedef durum, "her sipariş için müşteriye durum e-postası gider" satırı.
  Kural 5 gereği toplu güncelleme ayrıca ve sayı ile onaylanır.
- Toplu "İade Edildi" seçeneğini Claude **kullanmaz**: iade parası, nedeni ve stok etkisi sipariş bazında
  [order-detail.md](order-detail.md) üzerinden, [../../playbooks/order-cancel-refund.md](../../../playbooks/order-cancel-refund.md)
  ile tek tek yapılır.
- Toplu silme: yalnız Beklemede / İptal Edildi / İade Edildi siparişler silinebilir; özet + sayı + tek tek onay.
- Dışa aktarma kayıt değiştirmez ama **kişisel veri** indirir → kullanıcı istemedikçe yapma; dosyayı kullanıcıya bırak.

## Yan etkiler
- Toplu durum değişikliği: her sipariş için müşteriye ilgili e-posta (Kargoya Verildi → "Sipariş Kargoya Verildi",
  diğerleri → "Sipariş Durumu Değişti"). Bkz. [../../entities/order.md](../../entities/order.md) §e-postalar.
- Beklemede sipariş silinince stok rezervasyonu serbest kalır ([../inventory/stock.md](../inventory/stock.md)).

## Tuzaklar
- Dışa aktarma tüm filtre sonucunu değil yalnız **görünen sayfayı** (veya seçimi) içerir.
- Sıralama yalnız mevcut sayfada çalışır; "en yüksek tutarlı sipariş" için Min/Max Toplam filtresi kullan.
- Toplu menüde "İptal Edildi" yok; iptal yalnız detay ekranından.
- Durum filtresi değişince sayfa 1'e döner; seçim sayfa değişiminde korunur — toplu işlemden önce seçili sayıyı kontrol et.
- Liste yüklenemezse "Siparişler yüklenemedi. Lütfen tekrar deneyin." + "Tekrar Dene".

## Doğrulama
1. Toplu işlemden sonra toast'taki başarılı/başarısız sayısını oku; başarısız varsa kullanıcıya bildir.
2. İlgili durum filtresiyle listeyi süz; siparişlerin yeni durumda göründüğünü kontrol et.
3. Tek siparişte [order-detail.md](order-detail.md) → "Sipariş Geçmişi" kartında değişiklik kaydı.
