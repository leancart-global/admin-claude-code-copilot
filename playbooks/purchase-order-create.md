# Playbook: Satın alma siparişi aç ve teslim al

Tetikleyiciler: "X tedarikçisinden 100 adet Y sipariş et", "satın alma siparişi aç", "PO oluştur", "gelen malı teslim al", "PO-202610-0003'ü teslim aldık", yeniden sipariş raporundan "bunları sipariş et".
Harita: ../domain/screens/inventory/purchase-orders.md (alanlar, durumlar, stok etkisi), ../domain/screens/inventory/suppliers.md, ../domain/entities/purchase-order.md, ../domain/entities/supplier.md, ../domain/screens/inventory/stock.md (doğrulama), ../domain/screens/inventory/inventory-reports.md (yeniden sipariş önerileri).
URL'ler locale öneksizdir: `{ADMIN_URL}/inventory/purchase-orders/new`.

---

## 0. Kural hatırlatması
- Her kalıcı adım **ayrı özet + açık "evet"**: (a) gerekiyorsa tedarikçi oluşturma/aktifleştirme, (b) PO oluşturma, (c) Tedarikçiye Gönder, (d) Onayla, (e) her teslim alma, (f) Tamamla. Kullanıcı "hepsini tek onayla yap" derse toplu özet çıkar ve tek onay al.
- **Sistem tedarikçiye e-posta göndermez.** "Tedarikçiye Gönder" yalnız durumu değiştirir; özetinde bunu yaz, siparişi tedarikçiye kullanıcının ileteceğini hatırlat.
- Teslim alma **stoğu değiştirir** ve geri alınamaz.
- Prod ortamında test PO'su açma.

## 1. İsteği çözümle
| Bilgi | Form alanı | Zorunlu | Varsayılan (sorulmazsa) |
|---|---|---|---|
| Tedarikçi | Tedarikçi | evet | — (sor; listede ara) |
| Hedef depo | Hedef Depo | evet | Tek aktif depo varsa o; birden çoksa **sor** |
| Kalemler: SKU, miktar | SKU, Miktar | evet | — |
| Birim fiyat (alış) | Birim Fiyat | evet (>0) | — (sor; ürünün "Birim Maliyet"i biliniyorsa öner, "varsayılan" diye işaretle) |
| Kalem açıklaması | Açıklama | önerilir | Ürün adı (+ varyant) |
| Beklenen teslimat | Beklenen Teslimat Tarihi | hayır | Sipariş tarihi + tedarikçinin "Teslim Süresi"; yoksa boş |
| Sipariş tarihi | Sipariş Tarihi | hayır | bugün |
| Vergi / kargo / indirim **tutarı** | Vergi, Kargo, İndirim | hayır | 0 |
| Notlar | Notlar / Dahili Notlar | hayır | boş |
| Akışın nereye kadar gideceği | — | — | Yalnız **Taslak** oluştur; gönder/onayla/teslim al ancak kullanıcı isterse |

## 2. Bağımlılıkları çöz (salt okuma)
a. **Tedarikçi**: `/inventory/suppliers` → arama kutusuna ad/kod yaz. Bulundu mu, durumu "Aktif" mi, "Para Birimi" dolu mu (detay → İş Bilgileri)?
   - Yoksa → tedarikçi oluşturma planı ([suppliers.md](../domain/screens/inventory/suppliers.md)): Kod (büyük harf/rakam/tire, öner ve onaylat), Ad, Para Birimi (ör. TRY), **Durum = Aktif**, isteğe bağlı iletişim/ödeme koşulu/teslim süresi. Ayrı onay.
   - Var ama "Onay Bekliyor/Pasif/Askıya Alınmış" → aktifleştirme gerekir (detay → "Durum Değiştir" anında kaydeder; onay Select'e dokunmadan önce).
   - Para birimi boş/yanlış → tedarikçiyi düzenle (ayrı onay); PO formunda para birimi değiştirilemez.
b. **Depo**: `/inventory/purchase-orders/new` açıldığında "Depo tanımlı değil" banner'ı varsa → depo oluşturma gerekir ([warehouses.md](../domain/screens/inventory/warehouses.md)); kullanıcıya bildir, plana ekle.
c. **SKU'lar**: her SKU'yu `/products` listesinde ya da `/inventory/stock`'ta ara; tam eşleşen ürün/varyant SKU'sunu kullan. Varyantlı üründe varyant SKU'su gerekir. Bulunamayan SKU'yu kullanıcıya sor (yeni ürün mü? → [product-create.md](product-create.md)).
d. Yeniden sipariş raporundan geliyorsa (`/inventory/reports/reorder`): her satırın SKU, Depo ve "Sipariş Miktarı"nı oku; miktarı kullanıcıya öner.

## 3. Plan ve eksik bilgiler (tek mesaj)
Örnek:
> Plan: (1) "ABC Tekstil" tedarikçisi Onay Bekliyor → Aktif yapılacak [onay]. (2) PO Taslak: ABC Tekstil → Merkez Depo, TRY; TSHRT-BSC-M × 100 @ 85.00, TSHRT-BSC-L × 80 @ 85.00. (3) İstersen Tedarikçiye Gönder (e-posta gitmez, siparişi sen iletirsin).
> Eksik: Beklenen teslimat tarihi? Vergi/kargo tutarı var mı?

## 4. Formu doldur (`/inventory/purchase-orders/new`)
Her karttan sonra `browser_snapshot`.
1. **Tedarikçi** Select → "{Ad} ({KOD})" seçeneğine tıkla. "Para Birimi" alanının dolduğunu doğrula.
2. **Hedef Depo** Select → depo seçeneği.
3. **Tarihler**: Sipariş Tarihi (varsayılanı bırak ya da `YYYY-AA-GG`), Beklenen Teslimat Tarihi.
4. **Sipariş Kalemleri**: ilk satır mevcut; her ek kalem için "Kalem Ekle". Satır başına SKU → Açıklama → Miktar → Birim Fiyat (nokta ondalık, `85.00`). Satır Toplamı'nı kontrol et.
5. **Finansal Özet**: Vergi / Kargo / İndirim tutarları; Toplam'ı oku.
6. **Notlar**: Notlar, Dahili Notlar.
7. "Satın Alma Siparişi Oluştur" butonu pasifse: tedarikçi/depo seçili mi, her satırda SKU var mı kontrol et.

## 5. Özet → ONAY → Oluştur
| Alan | Değer | Kaynak |
|---|---|---|
| Ortam | prod/dev/local | config |
| Tedarikçi / Para birimi | ABC Tekstil (ABC-TEKSTIL) / TRY | kullanıcı / tedarikçiden |
| Hedef depo | Merkez Depo (MRK) | kullanıcı |
| Kalemler | TSHRT-BSC-M × 100 @ 85.00 = 8,500.00; … | kullanıcı |
| Vergi / Kargo / İndirim | 0 / 0 / 0 | varsayılan |
| Toplam | 15,300.00 TRY | hesaplanan |
| Tarihler | Sipariş 2026-10-23, beklenen 2026-11-06 | varsayılan (teslim süresi 14 gün) |
| Sonuç durumu | **Taslak**; stok etkisi yok; e-posta yok | |
Onay gelince footer'daki "Satın Alma Siparişi Oluştur"a tıkla → toast "Satın alma siparişi başarıyla oluşturuldu" → URL `/inventory/purchase-orders/{id}`; PO numarasını (`PO-YYYYMM-NNNN`) not et.

## 6. (İstenirse) Gönder ve onayla
1. **Tedarikçiye Gönder** (detay → İşlemler kartı): detayda onay diyaloğu **yok** → onayı tıklamadan önce al. Özet: "Durum Taslak → Gönderildi; düzenleme ve silme kapanır; e-posta gönderilmez". Toast "Satın alma siparişi tedarikçiye gönderildi".
2. **Onayla** (tedarikçi siparişi kabul edince): "Onayla" → diyalog: Tedarikçi Referansı, Güncellenmiş Teslimat Tarihi, Takip Numarası, Notlar → özet + onay → "Onayla". Etki: hedef depoda SKU'ların "Gelen" miktarı artar. Toast "Satın alma siparişi onaylandı".

## 7. Teslim al
Ön koşul: durum **Onaylandı** veya **Kısmi Teslim**.
1. Kullanıcıdan gelen miktarları al (SKU bazında). Tamamı geldiyse ve hepsi sağlamsa "Tümünü Hızlı Teslim Al" kullanılabilir; aksi halde "Ürün Teslim Al".
2. **Ürün Teslim Al** diyaloğu: her satırda "Teslim Alınan" (≤ Kalan) ve "Durum" (İyi/Hasarlı/Reddedildi/İnceleme Gerekli); Teslimat Referansı, Kargo Firması, Notlar. Hasarlı/reddedilen mal varsa stoğa girip girmeyeceğini kullanıcıyla netleştir; reddedilen miktarı teslim alınana yazma.
3. Özet + ayrı onay:
   | SKU | Teslim alınan | Kalan (sonra) | Durum |
   |---|---|---|---|
   | TSHRT-BSC-M | 100 | 0 | İyi |
   Yan etki: "Merkez Depo stoğu +180 adet, birim maliyet PO fiyatı; PO durumu → Teslim Alındı / Kısmi Teslim; geri alınamaz".
4. "Teslim Almayı Kaydet" (ya da hızlı teslim onay diyaloğunda "Tümünü Hızlı Teslim Al" — bu buton onay hook'una takılmayabilir, onayı diyaloğu açmadan önce al). Toast "Ürünler başarıyla teslim alındı" / "Tüm ürünler başarıyla teslim alındı".

## 8. (İstenirse) Tamamla
- Yalnız tüm kalemler teslim alınmışsa ("Teslim Alındı"). Kısmi teslimde tamamlama reddedilir (`PO_CANNOT_COMPLETE`); kalan mal gelmeyecekse kullanıcıya sor.
- "Tamamlandı Olarak İşaretle" → "Tamamlanma Notları" → özet + onay → "Tamamla". Etki: son durum; tedarikçi performansı güncellenir. Toast "Satın alma siparişi tamamlandı".

## 9. Doğrula
1. PO detay: durum rozeti, "{total} kalemden {received} tanesi teslim alındı", kalem tablosu Teslim Alınan/Kalan, toplam.
2. `/inventory/stock` (../domain/screens/inventory/stock.md): SKU + hedef depo miktarı teslim alınan kadar arttı mı.
3. `/inventory/movements`: PO numarası referanslı giriş satırları.
4. Rapor: PO linki ve numarası, durum, stok değişimi, kalan işler (ör. "siparişi tedarikçiye e-postayla siz iletin", "kalan 20 adet bekleniyor").

## 10. Hata durumları
| Mesaj / kod | Anlamı | Ne yap |
|---|---|---|
| "Satın alma siparişi oluşturulamadı" + `SUPPLIER_INACTIVE` | Tedarikçi aktif değil | Kullanıcıya sor, aktifleştirme ayrı onay |
| Validasyon (birim fiyat) | Birim fiyat 0 | >0 değer iste |
| `PO_INVALID_TRANSITION` / `PO_INVALID_STATUS` | Durum bu aksiyona izin vermiyor | Detayı yenile, mevcut durumu kullanıcıya bildir |
| `PO_QUANTITY_EXCEEDS_ORDERED` | Kalandan fazla teslim | Miktarı düzelt, yeniden onay |
| `PO_CANNOT_COMPLETE` | Teslim alınmamış kalem var | Kullanıcıya sor |
| 403 | Yetki yok (`po:*`, `suppliers:*`) | Dur, kullanıcıya bildir |
Canlıda beklenmeyen bir hata görürsen dur ve kullanıcıya sor.
