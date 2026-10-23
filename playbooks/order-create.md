# Playbook: Admin olarak sipariş oluştur ("bu siparişi sisteme gir")

Tetikleyiciler: "telefonla gelen siparişi gir", "Ayşe Hanım'a 2 adet X için sipariş aç", "mağazadan teslim sipariş
oluştur", "şu B2B siparişini sisteme gir".
Harita: ../domain/screens/orders/order-create.md (alanlar, locator, tuzaklar), ../domain/entities/order.md (kurallar,
e-postalar, stok), ../domain/screens/orders/order-detail.md (doğrulama ve sonraki adımlar).
URL: `{ADMIN_URL}/orders/new`.

---

## 0. Kural hatırlatması
- Tek kalıcı adım "Sipariş Oluştur"; öncesinde **özet tablo + açık "evet"**.
- Sipariş oluşunca müşteriye **"Sipariş Onayı" e-postası gider** ve **stok rezerve edilir** — özette yaz.
- Prod ortamında deneme/test siparişi girme (kural 7). Kullanıcı "test" diyorsa ortamı sor.
- Müşteri e-postası, telefonu ve adresi kişisel veridir; yalnız bu iş için kullan.

## 1. İsteği çözümle → taslak bilgi listesi
| Bilgi | Form alanı | Zorunlu | Varsayılan (sorulmazsa) |
|---|---|---|---|
| Müşteri | Misafir Sipariş / müşteri seçici | Evet | Kullanıcı isim/e-posta verdiyse önce kayıtlı müşteri ara; yoksa misafir — **sor** |
| E-posta | E-posta (misafir) | Evet | — (sor) |
| Telefon | Telefon | Hayır | — |
| Ürünler + adet | Ürün Ekle, Adet | Evet (≥1) | adet 1 |
| Birim fiyat | Fiyat | Evet | Ürünün kendi fiyatı ("varsayılan") |
| Teslimat tipi | Kargo ile gönderim / Mağazadan teslim | Evet | Kargo ile gönderim |
| Teslimat adresi | Ad, Soyad, Adres 1-2, Ülke, Şehir (il), İlçe, Posta Kodu | Kargoda evet | Kayıtlı müşteride varsayılan adresi; Ülke **Turkey** (TR adresinde) |
| Fatura adresi | Teslimat adresiyle aynı / ayrı | Mağazadan teslimde evet | Teslimatla aynı |
| Kargo firması | Tarife kartı | Kargoda evet | En ucuz (otomatik seçilir) — "varsayılan" diye işaretle |
| Ödeme sağlayıcısı | Ödeme Yöntemi | Evet | Varsayılan sağlayıcı |
| Para birimi | Para Birimi | Evet | Mağazanın ana para birimi (formda ilk aktif birim gelir — kontrol et) |
| Kupon | Kupon Kodu | Hayır | — |
| Notlar / hediye mesajı | Dahili Notlar / Hediye Mesajı | Hayır | — |

## 2. Bağımlılıkları çöz (salt okuma)
Sıra: Para birimi → Ödeme sağlayıcısı → Kargo entegrasyonu → Ürün (yayında, stokta) → Müşteri → **Sipariş**.

a. `{ADMIN_URL}/orders/new` aç; kart ayarlar yüklendikten sonra çıktığından birkaç saniye bekle (gerekirse müşteri
   seçtikten sonra tekrar) ve snapshot al. **"Yapılandırma Gerekli"** kartı varsa eksikleri oku:
   para birimi → ../domain/screens/settings/currencies.md; ödeme → ../domain/screens/settings/payments.md (kimlik
   bilgilerini kullanıcı girer); kargo → ../domain/screens/settings/shipping-carriers.md. Bunlar ayrı işler ve ayrı
   onaylardır; kullanıcıya bildir, plana ekle. Mağazadan teslim istenirse kargo entegrasyonu gerekmez.
b. **Ürünler**: ../domain/screens/products/product-list.md'de SKU/ad ile ara; ürün **yayında** mı, stok yeterli mi?
   Taslaksa yayınlamak ayrı iştir (ayrı onay). Stok yetersizse kullanıcıya sor (adet düşür / stok ekle →
   ../domain/screens/inventory/stock.md).
c. **Müşteri**: kullanıcı kayıtlı müşteri dediyse ../domain/screens/customers/customer-detail.md / müşteri listesinde
   ara; yoksa misafir mi yoksa önce müşteri kaydı mı açılacağını sor.
d. **Kupon** verildiyse kuponun var, **Aktif** ve tarihi geçerli olduğunu, bağlı promosyonun **Yayında** olduğunu
   ../domain/screens/marketing/coupons.md (liste araması, detay) ile salt okunur kontrol et. Admin siparişinde kodun
   indirime dönüşüp dönüşmediği ve kupon kullanımını artırıp artırmadığı **doğrulanmadı** → özette böyle işaretle;
   kaydettikten sonra sipariş detayında "İndirim" satırını ve kuponun "Kullanım" değerini kontrol et
   (../domain/entities/coupon.md §Sipariş ilişkisi).

## 3. Plan + eksik bilgileri tek mesajda sor
Örnek:
> Plan: Misafir sipariş — 2 × `TSHRT-BSC-M` (499,90 TRY), kargo ile İstanbul/Kadıköy, en ucuz tarife, Iyzico, TRY.
> Eksik: müşteri e-postası? Posta kodu? Fatura adresi teslimatla aynı mı?
> Not: Sipariş oluşunca müşteriye onay e-postası gider ve stok rezerve edilir.

## 4. Formu doldur
Her karttan sonra `browser_snapshot` ile doğrula.
1. **Para Birimi** (Sipariş Özeti kartı) — doğru birim seçili değilse değiştir.
2. **Sipariş Ürünleri**: "Ürün Ekle" → seçicide ara → ürüne tıkla; Adet'i ayarla (−/+ veya input). Fiyatı kullanıcı
   istemedikçe değiştirme.
3. **Müşteri Bilgileri**: misafirde `#customerEmail` + Telefon. Kayıtlıda "Misafir Sipariş" işaretini kaldır →
   "Müşteri ara..." → yaz → sonuç gelmesini bekle (`browser_wait_for`) → müşteriye tıkla. Otomatik dolan adresi oku.
4. **Teslimat Yöntemi**: gerekirse "Mağazadan teslim" (`#delivery-pickup`).
5. **Teslimat Adresi**: önce **Ülke = Turkey** (`#country` → Turkey), sonra Ad, Soyad, Adres 1/2, **Şehir** (il
   combobox: yaz → listeden tıkla), **İlçe** (combobox), Posta Kodu, Telefon.
6. **Fatura Adresi**: "Teslimat adresiyle aynı" kalsın ya da kaldırıp formu doldur (mağazadan teslimde form zorunlu).
7. **Kargo Firması Seçin**: tarifeler gelmesini bekle ("Kargo tarifeleri alınıyor..." kaybolana kadar). Kullanıcının
   istediği firmayı seç; yoksa otomatik seçilen en ucuzu özette "varsayılan" olarak göster.
8. **Ödeme Yöntemi**, **Kupon Kodu**, **Notlar**.
9. Üst çubukta "{N} sorun" butonu kalmadığını ve "Sipariş Oluştur"un aktif olduğunu kontrol et; varsa listeyi aç ve tamamla.

## 5. Özet → ONAY BEKLE → Oluştur
| Alan | Değer | Kaynak |
|---|---|---|
| Ortam | prod / dev / local | config |
| Müşteri | Misafir — ayse@ornek.com, +90… | kullanıcı |
| Kalemler | 2 × TSHRT-BSC-M @ 499,90 | kullanıcı / ürün fiyatı (varsayılan) |
| Teslimat | Kargo — Kadıköy/İstanbul, 34710 | kullanıcı |
| Fatura adresi | Teslimatla aynı | varsayılan |
| Kargo | Aras — 89,90 TRY | varsayılan (en ucuz) |
| Ödeme / Para birimi | Iyzico / TRY | varsayılan |
| Kupon / Notlar | — | |
| Ara Toplam / Kargo / Toplam (önizleme) | 999,80 / 89,90 / 1.089,70 | form (vergi ve kupon kayıtta hesaplanır) |
| Yan etkiler | Müşteriye "Sipariş Onayı" e-postası; yöneticilere yeni sipariş bildirimi; stok rezervi; ödeme tahsil **edilmez**, kargo etiketi **alınmaz** | |

Açık "evet" → **"Sipariş Oluştur"** butonuna tıkla (Enter kullanma).

## 6. Sonucu doğrula
1. Toast "Sipariş Oluşturuldu — {no} numaralı sipariş başarıyla oluşturuldu." ve `/orders/{id}` yönlendirmesi.
2. Detayda: kalemler, toplamlar (İndirim / Vergi dahil), Müşteri ve adres kartları, Ödeme kartı (yöntem + "Beklemede").
3. Durum "Dolandırıcılık İncelemesi" ise kullanıcıya bildir (inceleme sonrası "Hazırlanıyor"/"Bekletiliyor" seçilebilir; ayrı onay).
4. Hata: "Yeterli stok yok — {sku}: …" → kullanıcıya sor; diğer hatalarda mesajı oku, düzelt, özet değiştiyse **yeniden onay**.
5. Rapor: sipariş numarası + link, kalan işler (ödeme tahsili, kargolama, fatura — her biri ayrı iş ve onay;
   ../domain/screens/orders/order-detail.md).

## 7. Sık hatalar
- Ülke "United States" kaldı → il/ilçe yok, kargo tarifesi yanlış/boş.
- Para birimi listedeki ilk birim kaldı (ör. USD).
- Adres değişince kargo tarifesi yeniden seçildi; kullanıcının istediği firma kaybolmuş olabilir.
- "Misafir Sipariş" yeniden işaretlenince seçilen müşteri ve adres silindi.
- Sipariş sonrası "Hazırlanıyor"a geçiş ödeme alınmadan reddedilir (`ERR_PAYMENT_REQUIRED_FOR_PREPARING`).
