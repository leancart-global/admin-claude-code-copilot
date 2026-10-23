# Entity: Marketplace Channel (Pazaryeri kanalı) + Eşleme + Kanal ürünü + Komisyon kuralı

LeanCart mağazasının Trendyol, Amazon, Hepsiburada, N11 (ve ileride Çiçeksepeti) satıcı hesaplarıyla bağlantısı ve bu
bağlantı üzerinden akan ürün, stok, fiyat ve sipariş ilişkileri.

- Ekranlar: [../screens/settings/marketplace.md](../screens/settings/marketplace.md) (bağlantı + yapılandırma),
  [../screens/marketplace/marketplace-overview.md](../screens/marketplace/marketplace-overview.md),
  [../screens/marketplace/channel.md](../screens/marketplace/channel.md),
  [../screens/marketplace/channel-categories.md](../screens/marketplace/channel-categories.md),
  [../screens/marketplace/channel-products.md](../screens/marketplace/channel-products.md),
  [../screens/marketplace/channel-pending.md](../screens/marketplace/channel-pending.md).
- Playbook: [../../playbooks/marketplace-product-publish.md](../../playbooks/marketplace-product-publish.md).

## 1. Kanal bağlantısı (Marketplace Config)
| Alan | Tip | Not |
|---|---|---|
| Pazaryeri (`provider`) | enum | `trendyol`, `amazon`, `hepsiburada`, `n11`, `ciceksepeti`. Mağaza başına her pazaryerinden **bir** bağlantı (aynı pazaryeri yeniden bağlanırsa mevcut kayıt güncellenir) |
| Kimlik bilgileri | gizli | API Key, API Secret, Client Secret, Refresh Token — **gizli alan; Claude okumaz, yazmaz; kullanıcı kendisi girer**. Seller ID / Merchant ID / Client ID gizli değildir |
| Aktif (`isActive`) | bool | Pasif bağlantı senkronize etmez; kanal panosunda "Pasif" |
| Ortam | enum | Canlı (Production) / Test (Staging) — listede "Mod" |
| Para birimi | enum | Trendyol/Hepsiburada/N11/Çiçeksepeti TRY; Amazon USD/EUR/GBP/TRY |
| Siparişleri Otomatik Onayla | bool | Açıksa gelen pazaryeri siparişi otomatik "Kargoya Hazır" |
| Senkronizasyon Modu | enum | Gerçek Zamanlı / Zamanlanmış (15 dk) / Sadece Manuel |
| Stok Güvenlik Tamponu | int 0–50 | Kanala gönderilen stoktan düşülen adet. Önerilen: Trendyol 1, Amazon 1, Hepsiburada 1, N11 2 |
| Fiyat parametreleri | number | Varsayılan Komisyon %, Hedef Kâr Marjı %, Varsayılan Kargo Maliyeti ₺, Sabit Ürün Maliyeti ₺ → Satış Fiyatı = (Maliyet + Kargo + Sabit) / (1 − Komisyon% − Marj%) |

### Bağlantı durumu (kanal panosunda gösterilen)
`Bağlı` (erişim başarılı) · `Bağlı Değil` (kayıt yok) · `Pasif` · `Bağlantı Hatası` (kayıt aktif, erişim başarısız) ·
`Henüz Kullanılamıyor` (entegrasyon kapalı — Çiçeksepeti).

## 2. Kanal yetenekleri (kullanıcıya görünen sonuçla)
| Yetenek | Trendyol | Amazon | Hepsiburada | N11 |
|---|---|---|---|---|
| Ürün gönderimi (yeni ilan + güncelleme) | ✓ | ✓ (ASIN eşleme adımı) | ✓ | ✓ |
| Kanal kurallarıyla hazırlık kontrolü (Ürünler → Hazırlık) | ✓ | — (yalnız barkod) | — (yalnız barkod) | — (yalnız barkod) |
| Kanal tarafı ürün onayı / inceleme | ✓ | — (doğrulanmadı) | ✓ (doğrulanmadı) | doğrulanmadı |
| Kategori seçimi | düz arama | göz atma ağacı (browse node) | hiyerarşik | hiyerarşik |
| Kategori komisyonu | ✓ "Komisyon %" | "Tahmini Referral Fee %" | ✓ | ✓ |
| Tek seferde gönderim üst sınırı | 1000 | 10 | 1000 | 500 |
| Otomatik stok gönderimi | ✓ | ✓ | ✓ | ✓ |
| Sipariş içe alma | ✓ anlık + periyodik | ✓ periyodik/bildirim | ✓ | ✓ periyodik |
| Kargo firması seçimi gerekli | ✓ | — | ✓ | — |
| Fatura yükleme | ✓ | — | ✓ | — |
| Müşteri soru-cevap | ✓ | — | — | — |
| Finans/hakediş verisi | ✓ | ✓ | — | — |
| FBA envanteri, hesap sağlığı, Buy Box | — | ✓ | — | — |
| Panoda ek kart | Komisyon Özeti | FBA Envanteri, Hesap Sağlığı | — | — |

Fatura yükleme, soru-cevap, finans/hakediş, FBA, hesap sağlığı ve Buy Box satırları kanal yeteneğidir; admin'de bunlar için
ayrı işlem ekranı yoktur (FBA ve hesap sağlığı yalnız panoda kart olarak görünür).

Ekranda **olmayan** işlemler: ilanı kanaldan kaldırma/kapatma, elle toplu fiyat/stok gönderme ("Stok ve Fiyat
Senkronize Et" geliştiriliyor), kanaldan içe aktarma (geliştiriliyor), marka eşleme ekranı, ayrı özellik (attribute) eşleme ekranı.

## 3. Kategori eşleme (Category Mapping)
- LeanCart kategorisi → pazaryeri kategorisi (yaprak). Kanal başına ayrı.
- Ürün, **birincil (ilk) kategorisinin** eşlemesiyle gönderilir. Eşleme yoksa Trendyol hazırlığında `CATEGORY_NOT_MAPPED`.
- Pazaryeri kategorisinin **zorunlu özellikleri**, ürünün özel niteliklerinden aynı adlı nitelik değeriyle doldurulur; değer
  pazaryeri değer listesindeki adla (büyük/küçük harf duyarsız) eşleşmeli; serbest değerli özelliklerde ≤50 karakter.
- Marka eşleme (Trendyol): ürünün markası pazaryeri markasına eşlenmeli (`NO_BRAND`, `BRAND_NOT_MAPPED`). Ürün formunda
  marka alanı henüz yok (geliştiriliyor).

## 4. Komisyon kuralı (Pricing Rule)
| Seviye | Nereden girilir | Rozet |
|---|---|---|
| Ürün | Ürünler → Komisyon açılır penceresi | Ü / P |
| Kategori | Kategoriler → Komisyon % hücresi / toplu "Komisyon Belirle" | K / C |
| Kanal varsayılanı | Kural yoksa | V / D |
- Öncelik: Ürün > Kategori > Varsayılan. Değer yüzde olarak girilir.
- LeanCart içi hesap ayarıdır (net gelir, marj, fiyat formülü); pazaryerine gönderilmez, pazaryerinin kestiği gerçek komisyonu değiştirmez.
- Kayıt anında olur (kategori hücresinde alandan çıkınca).

## 5. Kanal ürünü (ürün eşlemesi / ilan)
| Durum (Ürünler sekmesi) | Anlam |
|---|---|
| Gönderilmedi / Not Sent | Bu kanalda ilanı yok |
| Gönderiliyor / Sending | Gönderim kuyrukta / pazaryerinde işleniyor |
| Listelendi / Listed | İlan pazaryerinde eşlenmiş ve senkron |
| Hata / Error | Son gönderim başarısız; metin rozet ipucunda |
- Pazaryeri tarafı ayrıntılı durumlar (Trendyol başta): Onay Bekliyor, İncelemede, Görsel Gerekli, Revizyon Gerekli,
  Onaylandı, Reddedildi, Arşivlendi, Kilitli. Bunlar satıcı panelinde izlenir.
- Gönderim: eşlemesi olmayan ürün **yeni ilan**, eşlemesi olan **güncelleme** (fiyat, stok, başlık, görsel, özellikler).
  Yeni ilan geri alınamaz şekilde pazaryerinde oluşur; kaldırma satıcı panelinden.
- Ürün gereksinimleri: barkod (≤40), kategori + eşleme, marka + eşleme (Trendyol), fiyat > 0, liste fiyatı ≥ satış fiyatı;
  uyarı: görsel, başlık ≤100.

## 6. Bekleyen ürün (içe aktarma kuyruğu)
- Pazaryerinden içe aktarılan ilanlar: Beklemede → Otomatik Eşleşen (barkod, sonra SKU) / Elle Eşlenen / Oluşturuldu / Yok Sayıldı.
- Eşlenen ilan bir LeanCart ürününe bağlanır; sonraki stok gönderimleri o ilana gider. (Ekran geliştiriliyor.)

## 7. Stok ilişkisi ([stock.md](stock.md))
- Kanala giden miktar = ürünün **Kullanılabilir (satılabilir)** stoğu − kanalın stok güvenlik tamponu (en az 0).
- Bir SKU'nun stoğu değişince (sipariş rezervasyonu/karşılama, iptal, iade, stok düzeltme, transfer, sayım) birkaç saniye
  içinde bağlantısı olan **tüm aktif kanallara** gönderilir; arka arkaya değişiklikler birleştirilip son değer gider.
- Bu nedenle envanter işlemleri (stok düzeltme, transfer, sayım onayı) canlı pazaryeri stoklarını da değiştirir → o işlerin
  özetlerinde "bağlı pazaryerlerinde stok da güncellenir" yan etkisi yazılmalı.
- Stok 0'a inerse kanalda satış durur; tampon yüzünden kanal stoğu LeanCart'tan düşüktür.

## 8. Sipariş ilişkisi ([order.md](order.md))
- Pazaryeri siparişleri LeanCart'a otomatik gelir; `source` = `trendyol` | `amazon` | `hepsiburada` | `n11`; sipariş
  listesinde "Kaynak / Source" filtresi ve kanal rozeti ([../screens/orders/orders-list.md](../screens/orders/orders-list.md)).
- Otomatik onay açıksa sipariş gelir gelmez "Kargoya Hazır" olur.
- Pazaryerinde yapılan iptal ve iadeler LeanCart siparişine yansır; LeanCart'ta sipariş hazırlanıyor / faturalandı gibi
  ilerlemeler (Trendyol) pazaryerine bildirilir (doğrulanmadı). Pazaryeri siparişinde durum değişikliği, iptal ve iade
  dış sisteme de yazabilir → [../screens/orders/order-detail.md](../screens/orders/order-detail.md) onaylarında "kaynak
  pazaryeri" bilgisini özete ekle.
- Pazaryeri siparişi stok rezervasyonu ve satış hareketi üretir; bu da diğer kanallara stok gönderimini tetikler.

## 9. Kurallar özeti
- Kanal işlemleri için bağlantı **Bağlı** olmalı.
- Dış sisteme yazan işlemler: ürün gönderimi (yeni/güncelleme), otomatik stok gönderimi (yan etki), bağlantı testi,
  pazaryeri siparişine ait durum bildirimleri. Ortam Canlı ise gerçek alıcılara yansır.
- Bağlantıyı kesmek senkronu durdurur; LeanCart'taki ürün ve siparişler kalır, pazaryerindeki ilanlar kendiliğinden kapanmaz (doğrulanmadı).

## İlişkiler
| İlişki | Not |
|---|---|
| Kanal → kategori eşlemeleri | LeanCart kategorisi başına bir pazaryeri kategorisi ([category.md](category.md)) |
| Kanal → komisyon kuralları | ürün / kategori / varsayılan |
| Kanal → kanal ürünleri | LeanCart ürünü başına bir ilan ([product.md](product.md)) |
| Kanal → bekleyen ürünler | içe aktarma kuyruğu |
| Kanal → siparişler | `source` ile ([order.md](order.md)) |
| Stok → kanallar | otomatik stok gönderimi ([stock.md](stock.md)) |
| Attribute set → zorunlu kanal özellikleri | aynı adlı nitelik değeri ([attribute-set.md](attribute-set.md), [attribute.md](attribute.md)) |
