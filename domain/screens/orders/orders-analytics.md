# Sipariş Analitiği (Order Analytics)
- URL: {ADMIN_URL}/orders/analytics
- Menü yolu: Sol menü "Siparişler / Orders" → "Analitik / Analytics" (aynı etiket Müşteriler altında ve üst seviyede de
  var — grup içinde kapsamla).
- Sayfa başlığı: "Sipariş Analitiği / Order Analytics"; açıklama "Sipariş eğilimleri ve gelir bir bakışta / Order trends
  and revenue at a glance".
- Amaç: Seçilen dönem için sipariş sayısı, gelir, ortalama sipariş değeri ve dönüşüm oranını; günlük sipariş hacmi ve
  gelir grafiklerini görmek. **Salt okunur.**
- Entity: [../../entities/order.md](../../entities/order.md).
- Yetki: sayfa içeriği analitik görüntüleme yetkisi ister (menü `orders:read`; içerik için `analytics:*` — kesin anahtar
  doğrulanmadı). Yetki yoksa içerik yerine erişim uyarısı görünür.

## Ön koşullar ve bağımlılıklar
- Yok. Veriler siparişlerden ve vitrin oturumlarından üretilir (dönüşüm oranı = siparişler ÷ oturumlar).

## Yerleşim
1. Başlık + sağda dönem seçici (Select).
2. KPI kartları: "Toplam Sipariş / Total Orders", "Toplam Gelir / Total Revenue", "Ortalama Sipariş Değeri / Average
   Order Value", "Dönüşüm Oranı / Conversion Rate" (ipucu "Siparişler ÷ oturumlar"); her birinde "önceki döneme göre"
   değişim.
3. Grafikler: "Sipariş Hacmi / Order Volume" (eksen "Sipariş"), "Gelir / Revenue" (eksen "Gelir"), x ekseni "Tarih".
4. Boş: "Bu aralıkta sipariş yok." + "Sipariş listesine git". Hata: "Bu aralık için analitik yüklenemedi." + "Yeniden dene".

## Alanlar
| Label (tr / en) | Kontrol tipi | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|
| Dönem | Select | **Son 30 gün** | sayfa başlığının yanındaki combobox | Bugün, Son 7 gün, Son 30 gün, Son 90 gün |

## Aksiyonlar
| Aksiyon | Ne olur |
|---|---|
| Dönem seçimi | KPI ve grafikler yeniden yüklenir (kayıt değişmez) |
| Sipariş listesine git | [orders-list.md](orders-list.md) |

## Onay zamanlaması
- Kalıcı aksiyon yok; onay gerekmez.

## Yan etkiler
- Yok.

## Tuzaklar
- Hangi sipariş durumlarının (iptal/iade) gelire dahil edildiği doğrulanmadı; kullanıcıya rakamı raporlarken "panelin
  gösterdiği değer" diye aktar.
- Dönem seçenekleri sabit; özel tarih aralığı için sipariş listesindeki tarih filtrelerini kullan.

## Doğrulama
- Dönem değişince KPI kartlarının ve grafiklerin güncellendiğini snapshot ile oku.
