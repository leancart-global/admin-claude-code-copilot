# Satın Alma Siparişleri (Purchase Orders) — liste, oluştur, detay

| URL | Sayfa başlığı (tr / en) | Amaç |
|---|---|---|
| `{ADMIN_URL}/inventory/purchase-orders` | "Satın Alma Siparişleri / Purchase Orders" | Liste, istatistik kartları, satır aksiyonları |
| `{ADMIN_URL}/inventory/purchase-orders/new` | "Satın Alma Siparişi Oluştur / Create Purchase Order" | Taslak PO oluştur. `?sku=XXX` ile ilk kalemin SKU'su dolu açılır ([inventory-reports.md](inventory-reports.md) "PO Oluştur") |
| `{ADMIN_URL}/inventory/purchase-orders/{id}` | "SAS Numarası / PO Number: PO-YYYYMM-NNNN" | Detay, durum ilerletme (gönder, onayla, teslim al, tamamla, iptal) |

- Menü yolu: Sol menü "Envanter / Inventory" → "Satın Alma Siparişleri / Purchase Orders".
- Açıklama: "Satın alma siparişlerini yönetin ve tedarikçi teslimatlarını takip edin".
- Amaç: Tedarikçiden mal siparişi açmak, siparişi takip etmek ve gelen malı **hedef depoya stok girişi** olarak kaydetmek.
- Entity: [../../entities/purchase-order.md](../../entities/purchase-order.md); ilişkili [../../entities/supplier.md](../../entities/supplier.md), [../../entities/warehouse.md](../../entities/warehouse.md), [../../entities/stock.md](../../entities/stock.md).
- Playbook: [../../../playbooks/purchase-order-create.md](../../../playbooks/purchase-order-create.md).
- Yetki: menü `inventory:read`; veri `po:read`; oluştur/sil/gönder/onayla/iptal `po:write`; teslim al `po:receive`; tamamla `po:admin`; birim fiyat ve finansal özet `po:view_costs` (yoksa "Finansal veriler kısıtlı" ve fiyat sütunları gizli). Listede satır aksiyonları yalnız admin/yönetici/editör rollerinde görünür.
- API (public): `GET/POST /purchase-orders`, `GET /purchase-orders/stats`, `GET/PUT/DELETE /purchase-orders/{id}`, `PATCH /purchase-orders/{id}/send|confirm|receive|quick-receive|complete|cancel`.

## Durum akışı
```
Taslak ──Tedarikçiye Gönder──▶ Gönderildi ──Onayla──▶ Onaylandı ──Teslim Al (kısmi)──▶ Kısmi Teslim ──Teslim Al (kalan)──▶ Teslim Alındı ──Tamamla──▶ Tamamlandı
  │  └─Sil (kalıcı)              │                       │  └──Teslim Al (tamamı)─────────────────────────▶ Teslim Alındı
  └─İptal                        └─İptal                 └─İptal
```
| Durum (tr / en) | Kod | İzinli aksiyonlar |
|---|---|---|
| Taslak / Draft | `draft` | Tedarikçiye Gönder, Sil (kalıcı), İptal (API) |
| Gönderildi / Sent | `sent` | Onayla, Siparişi İptal Et |
| Onaylandı / Confirmed | `confirmed` | Ürün Teslim Al, Tümünü Hızlı Teslim Al, Siparişi İptal Et |
| Kısmi Teslim / Partially Received | `partial` | Ürün Teslim Al, Tümünü Hızlı Teslim Al, Tamamlandı Olarak İşaretle (yalnız tüm kalemler gelmişse kabul edilir) |
| Teslim Alındı / Received | `received` | Tamamlandı Olarak İşaretle |
| Tamamlandı / Complete | `complete` | — (son durum) |
| İptal Edildi / Cancelled | `cancelled` | — (son durum; listede varsayılan olarak gizli, durum filtresiyle görünür) |

Kural dışı geçiş → `PO_INVALID_TRANSITION` / `PO_INVALID_STATUS`. Düzenleme ve silme yalnız **Taslak**ta.

## Stoğa etkisi (özet)
| Aksiyon | Stok etkisi |
|---|---|
| Oluştur / Gönder | Yok |
| Onayla | Hedef depodaki her kalemin SKU'sunda **"Gelen / Incoming"** miktarı sipariş miktarı kadar artar (SKU o depoda stok kaydı yoksa gelen miktar görünmez — doğrulanmadı). Kullanılabilir stok değişmez |
| Teslim Al (her kayıt) | Girilen miktar **hedef depoya stok girişi** olarak eklenir (SKU depoda yoksa yeni stok kaydı açılır), birim maliyet PO birim fiyatıdır; "Gelen" aynı miktarda azalır; stok hareketlerinde PO numarası referanslı giriş oluşur ([stock-movements.md](stock-movements.md)) |
| Tamamla | Stok etkisi yok; tedarikçinin sipariş sayısı/zamanında teslim oranı güncellenir |
| İptal (Onaylandı'dan) | "Gelen" miktar geri düşer. Daha önce teslim alınmış stok geri alınmaz |
| Sil (Taslak) | Yok |

## Tedarikçiye e-posta / dış sistem
- **Sistem tedarikçiye e-posta veya başka bir bildirim göndermez.** "Tedarikçiye Gönder" yalnız durumu "Gönderildi" yapar (toast "Satın alma siparişi tedarikçiye gönderildi" olsa da). Siparişi tedarikçiye kullanıcı kendi kanalıyla iletir; özetinde bunu belirt.
- Ödeme, kargo, e-fatura, pazaryeri sistemlerine yazılmaz.

## Ön koşullar ve bağımlılıklar
- En az bir **Aktif** tedarikçi ([suppliers.md](suppliers.md)); tedarikçide Para Birimi dolu olmalı.
- En az bir aktif depo ([warehouses.md](warehouses.md)); yoksa formda "Depo tanımlı değil" banner'ı ve "Depo oluştur" çıkar.
- Kalemlerin SKU'ları katalogdaki ürün/varyant SKU'larıyla birebir aynı olmalı; kaydetmeden önce [../products/product-list.md](../products/product-list.md) ya da [stock.md](stock.md)'ta ara.

## Yerleşim

### Liste
1. Başlık + "Yeni Satın Alma Siparişi / New Purchase Order".
2. İstatistik kartları (tıklanınca filtreler): Taslak, Gönderildi, Onaylandı, Kısmi Teslim, İşlem Gerekli (Gönderildi+Onaylandı+Kısmi), Gecikmiş; ayrıca Bekleyen Tutar, Bu Ay Teslim Alınan.
3. Filtreler: arama "SAS numarası ara... / Search PO number..." (yalnız PO numarasında), durum Select ("Tüm Durumlar"), Checkbox "İşlem Gerekli / Needs Action", Checkbox "Sadece Gecikmiş / Overdue Only", "Yenile".
4. Tablo: "SAS Numarası / PO Number", "Tedarikçi", "Depo", "Durum", "Kalemler", "Toplam", "Beklenen Teslimat", "İlerleme", "Oluşturulma", "⋯" (sr-only "İşlemler / Actions").
5. Satır menüsü duruma göre: Detayları Görüntüle; Taslak → Düzenle, Tedarikçiye Gönder, Sil; Gönderildi → Onayla (detaya gider), Siparişi İptal Et; Onaylandı → Ürün Teslim Al, Tümünü Hızlı Teslim Al, Siparişi İptal Et; Kısmi → Ürün Teslim Al, Tümünü Hızlı Teslim Al, Tamamlandı Olarak İşaretle, Siparişi İptal Et; Teslim Alındı → Tamamlandı Olarak İşaretle.

### Oluştur (`/new`)
Kartlar sırasıyla: "Tedarikçi & Hedef Depo", "Sipariş Tarihi & Beklenen Teslimat Tarihi", "Sipariş Kalemleri / Line Items" ("Bu satın alma siparişine ürün ekleyin"), "Finansal Özet / Financial Summary", "Notlar / Notes"; altta yapışkan footer "İptal" + "Satın Alma Siparişi Oluştur / Create Purchase Order".

### Detay
- Sol: "Genel Bakış" (SAS Numarası, Durum, Tedarikçi, Hedef Depo, Para Birimi, Beklenen Teslimat + "{n} gün gecikmiş" / "Teslimata {n} gün", Gerçek Teslimat), "Teslim Alma İlerlemesi" ("{total} kalemden {received} tanesi teslim alındı"), "Sipariş Kalemleri" tablosu (SKU, Açıklama, Miktar, Teslim Alınan, Kalan, Durum, Birim Fiyat, Satır Toplamı), "Finansal Özet" (Ara Toplam, Vergi, Kargo, İndirim, Toplam), "Notlar" (Dahili Notlar, Tedarikçi Notları, Teslim Alma Notları).
- Sağ: "İşlemler / Actions" kartı (duruma göre butonlar, aşağıda), "Zaman Çizelgesi / Timeline", "Teslimat Bilgileri" (Teslimat Referansı, Kargo Firması, Takip Numarası), "Oluşturan".
- Taslaktaki "Düzenle" butonu aynı detay sayfasını `?edit=true` ile açar; ayrı bir düzenleme formu görünmüyorsa taslağı silip yeniden oluşturmayı kullanıcıya **sor** (doğrulanmadı).

## Alanlar

### Oluştur formu
| Kart | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Tedarikçi & Hedef Depo | Tedarikçi / Supplier | Select (placeholder "Tedarikçi seçin") | evet | Yalnız **Aktif** tedarikçiler; seçenek "{Ad} ({KOD})" | label "Tedarikçi" | Seçince Para Birimi dolar |
| | Hedef Depo / Destination Warehouse | Select (placeholder "Depo seçin") | evet | Aktif depolar; seçenek "{Ad} ({KOD})" | label "Hedef Depo" | Teslim alınan stok bu depoya girer |
| | Para Birimi / Currency | Input, **salt okunur** | — | Tedarikçinin para birimi | label "Para Birimi" | Değiştirilemez; boşsa PO platform varsayılan para birimiyle (USD) oluşur |
| Tarihler | Sipariş Tarihi / Order Date | date Input | hayır | bugün | label "Sipariş Tarihi" | `YYYY-AA-GG` |
| | Beklenen Teslimat Tarihi / Expected Delivery Date | date Input | hayır | boş | label "Beklenen Teslimat Tarihi" | Geçince PO "Gecikmiş" sayılır |
| Sipariş Kalemleri (satır başına) | SKU | Input (placeholder "SKU girin") | evet | ≤100; serbest metin | placeholder "SKU girin" | Katalogdaki SKU'yu birebir yaz |
| | Açıklama / Description | Input (placeholder "Ürün açıklaması") | önerilir | ≤500 | placeholder "Ürün açıklaması" | Detay tablosunda "Açıklama" sütunu |
| | Miktar / Quantity | number Input | evet | tam sayı 1–999999; varsayılan 1 | placeholder "Miktar" | |
| | Birim Fiyat / Unit Price | number Input (0.01 adım) | evet | > 0 (en az 0.01, en çok 2 ondalık); varsayılan 0 | placeholder "Birim Fiyat" | Nokta ondalık. Teslim alınan stoğun birim maliyeti olur |
| | Satır Toplamı / Line Total | hesaplanan | — | Miktar × Birim Fiyat | — | |
| | (çöp kutusu ikonu) | Button | — | Son kalan satırda pasif | ikon butonu | En az 1 kalem; en çok 500 |
| | Kalem Ekle / Add Line Item | Button | — | — | "Kalem Ekle" | |
| Finansal Özet | Vergi / Tax | number Input | hayır | ≥0; varsayılan 0 | label "Vergi" | **Tutar** (oran değil) |
| | Kargo / Shipping | number Input | hayır | ≥0 | label "Kargo" | |
| | İndirim / Discount | number Input | hayır | ≥0 | label "İndirim" | Toplamdan düşülür |
| | Ara Toplam / Toplam | hesaplanan | — | Toplam = Ara Toplam + Vergi + Kargo − İndirim | — | |
| Notlar | Notlar / Notes | Textarea (placeholder "Tedarikçiye görünür notlar") | hayır | ≤2000 | label "Notlar" | Sistem tedarikçiye göndermez; detayda "Tedarikçi Notları" |
| | Dahili Notlar / Internal Notes | Textarea | hayır | ≤2000 | label "Dahili Notlar" | |

"Satın Alma Siparişi Oluştur" butonu Tedarikçi, Hedef Depo ve her satırda SKU + Miktar>0 dolu olana dek pasif.

### Onayla diyaloğu ("Satın Alma Siparişini Onayla" — "Tedarikçi onay detaylarını kaydedin")
| Label | Kontrol | Zorunlu | Not |
|---|---|---|---|
| Tedarikçi Referansı / Supplier Reference | Input ("Tedarikçi SAS/onay numarası") | hayır | ≤100 |
| Güncellenmiş Teslimat Tarihi / Updated Delivery Date | date Input | hayır | Beklenen teslimatı günceller |
| Takip Numarası / Tracking Number | Input | hayır | ≤100 |
| Notlar / Notes | Textarea ("Onay notları") | hayır | Doluysa PO "Notlar"ının yerine geçer |
Butonlar: "İptal", "Onayla / Confirm".

### Teslim al diyaloğu ("Ürün Teslim Al" — "Her sipariş kalemi için teslim alınan miktarları kaydedin")
| Label | Kontrol | Not |
|---|---|---|
| Tablo: SKU, Açıklama, Miktar, Kalan / Remaining | salt okunur | Yalnız kalanı > 0 olan kalemler listelenir |
| Teslim Alınan / Received Qty | number Input (satır başına) | 0–Kalan; varsayılan 0. 0 bırakılan satır gönderilmez. Kalanı aşarsa `PO_QUANTITY_EXCEEDS_ORDERED` |
| Durum / Condition | Select (satır başına) | İyi / Good (varsayılan), Hasarlı / Damaged, Reddedildi / Rejected, İnceleme Gerekli / Needs Inspection. Hasarlı/Reddedilen miktarın stoğa girip girmediği doğrulanmadı — reddedilen malı "Teslim Alınan"a yazmadan önce kullanıcıya sor |
| Teslimat Referansı / Delivery Reference | Input ("Takip numarası veya referans") | ≤100; detayda Takip Numarası olarak görünür |
| Kargo Firması / Carrier Name | Input ("ör. DHL Express") | ≤100 |
| Notlar / Notes | Textarea ("Teslim alma notları") | ≤2000 |
Butonlar: "İptal", "Teslim Almayı Kaydet / Record Receipt" (en az bir satırda miktar > 0 olana dek pasif).

### İptal diyaloğu ("Satın Alma Siparişini İptal Et" — "Bu işlem satın alma siparişini iptal edecektir. Bu işlem geri alınamaz.")
| Label | Kontrol | Zorunlu | Seçenekler |
|---|---|---|---|
| İptal Nedeni / Cancellation Reason | Select ("Neden seçin") | evet | Tedarikçi Müsait Değil, Fiyatlandırma Sorunu, Kalite Endişeleri, Teslimat Gecikmeleri, Sipariş Artık Gerekli Değil, Mükerrer Sipariş, Tedarikçi Reddetti, Bütçe Kısıtlamaları, Ürün Üretimi Durduruldu, Diğer |
| Ek Notlar / Additional Notes | Textarea | hayır | ≤2000 |
Butonlar: "İptal", "Siparişi İptal Et / Cancel Order" (neden seçilmeden pasif).

### Tamamla diyaloğu ("Satın Alma Siparişini Tamamla" — "Bu satın alma siparişini tamamlandı olarak işaretle")
- "Tamamlanma Notları / Completion Notes" (Textarea, isteğe bağlı; dahili notlara eklenir). Butonlar "İptal", "Tamamla / Complete".

## Aksiyonlar
| Buton (yer) | Ne olur | Toast |
|---|---|---|
| Satın Alma Siparişi Oluştur (`/new`) | **Taslak** PO oluşur, numara `PO-YYYYMM-NNNN` verilir, detaya yönlenir | "Satın alma siparişi başarıyla oluşturuldu"; hata "Satın alma siparişi oluşturulamadı" (`SUPPLIER_INACTIVE`, `PO_NO_LINE_ITEMS` vb.) |
| Tedarikçiye Gönder (detay: **diyalogsuz**; liste: onay diyaloğu "Bu siparişi tedarikçiye göndermek istediğinizden emin misiniz?") | Durum → Gönderildi. E-posta gitmez | "Satın alma siparişi tedarikçiye gönderildi" |
| Onayla → diyalog → Onayla | Durum → Onaylandı; "Gelen" stok artar | "Satın alma siparişi onaylandı" |
| Ürün Teslim Al → diyalog → Teslim Almayı Kaydet | Stok girişi; durum Kısmi Teslim ya da (tüm kalemler gelince) Teslim Alındı | "Ürünler başarıyla teslim alındı" |
| Tümünü Hızlı Teslim Al → onay diyaloğu → Tümünü Hızlı Teslim Al | Tüm kalan miktarlar "İyi" durumla teslim alınır, durum → Teslim Alındı | "Tüm ürünler başarıyla teslim alındı" |
| Tamamlandı Olarak İşaretle → diyalog → Tamamla | Durum → Tamamlandı; tedarikçi performansı güncellenir. Teslim alınmamış kalem varsa reddedilir (`PO_CANNOT_COMPLETE`) | "Satın alma siparişi tamamlandı" |
| Siparişi İptal Et → diyalog → Siparişi İptal Et | Durum → İptal Edildi; kalemler iptal | "Satın alma siparişi iptal edildi" |
| Sil (yalnız Taslak) → "Bu satın alma siparişi silinsin mi?" ("…kalıcı olarak silinecektir. Bu işlem geri alınamaz.") → Sil | Kalıcı silme | "Satın alma siparişi başarıyla silindi" |
Ortak hata toast'ı: "İşlem gerçekleştirilemedi / Failed to perform action".

## Onay zamanlaması (kural 2/5/6)
- **Oluştur**: özet tablo (tedarikçi, depo, para birimi, kalemler: SKU × miktar × birim fiyat, vergi/kargo/indirim, toplam) + onay. Taslak oluşur, stok etkisi yok.
- **Tedarikçiye Gönder**: detay sayfasında diyalog **yok** — butona basmadan önce onay al. Özetinde "e-posta gönderilmez" yaz.
- **Onayla**: ayrı onay; "Gelen" stok artar.
- **Teslim Al / Hızlı Teslim Al**: **stoğu değiştirir**; ayrı onay, etkilenen SKU sayısı ve toplam adetle. Hızlı teslim al tüm kalan kalemleri tek seferde girer ve buton adı onay hook'u tarafından yakalanmayabilir — onayı diyaloğu açmadan **önce** al. Teslim alma geri alınamaz (stok düzeltmesi ayrı iş, [stock.md](stock.md)).
- **Tamamla**: ayrı onay; son durumdur.
- **İptal**: geri alınamaz; ayrı onay, nedenle. Kısmi teslim alınmış PO iptal edilemez (yalnız Taslak/Gönderildi/Onaylandı).
- **Sil**: yalnız Taslak; geri alınamaz, ayrı onay.
- E-posta/bildirim ve dış sistem (ödeme, kargo, e-fatura, pazaryeri) yazımı yok.

## Yan etkiler
- Teslim alınan stok hedef depoda kullanılabilir stoğa eklenir; vitrin stok durumu buna göre değişir (birkaç saniye–dakika içinde, doğrulanmadı).
- Stok hareketleri ekranında PO numarasıyla giriş satırı.
- "Tamamlandı" ile tedarikçinin Toplam Sipariş, Zamanında Teslimat (beklenen teslim tarihine göre) ve Değerlendirme değerleri güncellenir.
- Gecikmiş PO'lar listede "Gecikmiş" kartında ve detayda "{n} gün gecikmiş" olarak görünür.

## Tuzaklar
- Para birimi formda değiştirilemez; tedarikçide yanlış/boşsa önce tedarikçiyi düzelt ([suppliers.md](suppliers.md)).
- Birim fiyat 0 bırakılamaz (en az 0.01).
- "Vergi" alanı tutardır, yüzde değildir.
- Teslim alınan stok, kalemde yazılan SKU'ya ve hedef depoya yazılır; SKU'yu kaydetmeden önce katalogda doğrula, varyantlı üründe varyant SKU'sunu kullan.
- Kısmi teslimde PO'yu kapatmak için kalan kalemlerin de teslim alınması gerekir; kalanı gelmeyecekse kullanıcıya sor.
- Liste varsayılanında iptal edilenler görünmez; durum filtresinden "İptal Edildi" seç.

## Doğrulama
1. Toast.
2. Detay: durum rozeti, "Teslim Alma İlerlemesi", kalem tablosundaki Teslim Alınan/Kalan, Finansal Özet toplamı.
3. Teslim almadan sonra [stock.md](stock.md)'ta SKU + hedef depo miktarı arttı mı; [stock-movements.md](stock-movements.md)'ta PO numaralı giriş var mı.
4. Liste istatistik kartları güncellendi mi.
