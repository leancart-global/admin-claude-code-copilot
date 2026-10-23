# Entity: Report (Rapor şablonu ve metrik tanımları)

İki parça: (1) **Rapor şablonu** — kullanıcının kaydettiği, metrik + boyut + görselleştirme seçimi ve opsiyonel
e-posta zamanlaması; (2) **Metrik tanımları** — Panel, Analitik, Günlük Özet ve rapor şablonlarında aynı adla görünen
rakamların kullanıcıya açıklanabilir tanımı.

- Ekranlar: [../screens/analytics/reports.md](../screens/analytics/reports.md) (şablon), [../screens/dashboard/dashboard.md](../screens/dashboard/dashboard.md),
  [../screens/analytics/analytics-overview.md](../screens/analytics/analytics-overview.md), [../screens/analytics/realtime.md](../screens/analytics/realtime.md),
  [../screens/analytics/geographic.md](../screens/analytics/geographic.md), [../screens/reports/refunds.md](../screens/reports/refunds.md),
  [../screens/reports/payments.md](../screens/reports/payments.md).
- Yetki: okuma `analytics:read`; şablon oluşturma/silme `analytics:write`.

## 1. Rapor şablonu

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| Ad | metin | evet | — | Listede görünen ad |
| Açıklama | metin | hayır | — | Liste aramasında da kullanılır |
| Rapor Türü | enum | — | Gelir | Gelir (`REVENUE`), Müşteri (`CUSTOMER`), Ürün (`PRODUCT`), Pazarlama (`MARKETING`), Operasyon (`OPERATIONAL`), Pano (`DASHBOARD`), Özel (`CUSTOM`) |
| Görselleştirme | enum | — | Çizgi Grafik | Tablo, Çizgi Grafik, Çubuk Grafik, Pasta Grafik |
| Metrikler | liste | **≥1** | Toplam Gelir, Toplam Sipariş | Aşağıdaki metrik kodları |
| Boyutlar | liste | hayır | Tarih | `date` Tarih, `product` Ürün, `category` Kategori, `customer_segment` Müşteri Segmenti, `channel` Pazarlama Kanalı, `device` Cihaz Türü, `country` Ülke, `city` Şehir |
| Zamanlama | nesne | hayır | kapalı | Sıklık (Tek seferlik / Günlük / Haftalık / Aylık / Üç Aylık), Haftanın Günü (Haftalık), Ayın Günü 1–28 (Aylık), Saat (09:00), **Alıcılar** (≥1 e-posta, zorunlu) |
| Oluşturulma | tarih | sistem | — | Listede "Oluşturulma" |

Kurallar:
- Rapor, şablon + **tarih aralığı** (başlangıç–bitiş) ile üretilir; sonuç "Özet" + "Veri" tablosudur. Ekranda ilk 50
  satır görünür; tamamı için dışa aktarma (PDF, CSV, Excel, JSON). İndirme bağlantısı ~24 saat geçerlidir.
- Zamanlanmış şablon, sıklığa göre alıcılara **e-posta** gönderir; durumu "Aktif" / "Duraklatıldı", "Sonraki Çalışma",
  "Son Çalışma" ile izlenir. Ekrandan zamanlama düzenlenmez.
- Şablon silme geri alınamaz ve zamanlamayı da sonlandırır.

## 2. Metrik tanımları (kullanıcının gördüğü)

### Sipariş ve gelir
| Metrik (tr / en) | Kod | Tanım |
|---|---|---|
| Toplam Gelir / Total Revenue (Ciro) | `total_revenue` | Dönemde **verilen** siparişlerin tutarları toplamı. **İptal edilen** ve **tamamen iade edilen** siparişler hariç; **kısmi iadeli** siparişler tam tutarıyla dahil. Vergi/kargo dahil mi: doğrulanmadı (sipariş genel toplamı varsayılır) |
| Siparişler / Orders | `total_orders` | Aynı kurala göre sayılan sipariş adedi |
| Ort. Sipariş Değeri / AOV | `average_order_value` | Toplam Gelir ÷ Siparişler |
| Dönüşüm Oranı / Conversion Rate | `conversion_rate` | Siparişler ÷ vitrin oturumları × 100. Oturum yoksa "—" |
| İadeler / Refunds | `refunds` | Alacak dekontu tutarları (İade Özeti kuralları: iptal dekontlar hariç) |
| Brüt Kâr / Gross Profit | `gross_profit` | Gelir − ürün maliyeti (ürünlerdeki "Birim Maliyet"e dayanır; maliyeti boş ürünler eksik hesaplanır — doğrulanmadı) |
| Terk Edilmiş Sepetler / Abandoned Carts | `abandoned_carts` | Siparişe dönmeden terk edilen sepet sayısı (doğrulanmadı) |
| Sipariş Başına Ort. Ürün | `avg_items_per_order` | Satılan adet ÷ sipariş (doğrulanmadı) |

### Müşteri
| Metrik | Kod | Tanım |
|---|---|---|
| Müşteriler (Panel/Analitik kartı) | — | Dönemde sayılan sipariş veren **farklı** müşteri sayısı (kayıtlı toplam müşteri değil) |
| Yeni Müşteriler | `new_customers` | İlk siparişini dönem içinde veren müşteriler (doğrulanmadı) |
| Geri Dönen Müşteriler | `returning_customers` | Dönemden önce de siparişi olan müşteriler (doğrulanmadı) |
| Müşteri Yaşam Boyu Değeri / LTV | `customer_lifetime_value` | Müşterinin tüm siparişlerinin toplamı; ortalama LTV müşteri analitiğinde ([../screens/customers/customers-analytics.md](../screens/customers/customers-analytics.md)) |
| Kazanım Maliyeti / CAC | `customer_acquisition_cost` | Pazarlama harcaması ÷ yeni müşteri (harcama verisi gerekir — doğrulanmadı) |

### Trafik
| Metrik | Kod | Tanım |
|---|---|---|
| Ziyaretçiler / Visitors | `visitors` | Dönemdeki vitrin oturumları (çerez onayı veren ziyaretçiler). Günlük Özet'te: o gün başlayan oturum sayısı |
| Sayfa Görüntülenmeleri | `page_views` | Görüntülenen sayfa sayısı |
| Hemen Çıkma Oranı / Bounce Rate | `bounce_rate` | Tek sayfa görüntüleyip başka etkileşim yapmayan oturumlar ÷ tüm oturumlar |
| Oturum Süresi | `session_duration` | Oturumdaki ilk ve son etkinlik arası ortalama süre (dakika) |
| Onay vermeyen ziyaretçiler | — | Çerezsiz sayım açıksa ayrı tutulan giriş / sepete ekleme / ödeme açılışı sayıları; tekilleştirilmez, yukarıdaki rakamlara **dahil değildir**, UTC gününe göre |

### Canlı (bugün)
| Metrik | Tanım |
|---|---|
| Çevrimiçi Ziyaretçi | Son ~1 dakikada aktif ziyaretçi |
| Aktif Sepet | Şu an açık sepetler |
| Bugünün Geliri / Siparişleri | Bugün verilen siparişler (iptal/tam iade hariç) |
| Bekleyen / İşleniyor | Şu an o durumdaki sipariş sayısı |

### Dönem ve karşılaştırma kuralları
- "Son 7/30/90 gün": şu andan geriye 7/30/90 × 24 saat (takvim günü değil). "Bugün": gün başından şimdiye. "Bu ay":
  ayın 1'inden bugüne.
- Karşılaştırma ("önceki döneme göre"): seçilen dönemle aynı uzunlukta, hemen öncesindeki aralık. Önceki değer 0
  ise değişim hesaplanmaz ("—").
- Günlük Özet: gün = **UTC günü**; karşılaştırma bir önceki gün.
- Tutarlar dönemde en çok kullanılan para birimiyle gösterilir. Çoklu para birimli mağazada iade özeti "Karma para
  birimi" gösterir ve para birimi filtresi ister.
- Panel ve analitik rakamları ~5 dakikaya kadar gecikmeli olabilir.

## 3. İlişkiler
| İlişki | Not |
|---|---|
| Sipariş → gelir metrikleri | Sipariş durumu "İptal" veya tam "İade Edildi" olunca gelirden düşer ([order.md](order.md)) |
| Alacak dekontu → İade metrikleri | [../screens/reports/refunds.md](../screens/reports/refunds.md) |
| Ödeme işlemi → ödeme raporu | Her tahsilat denemesi ayrı satır ([../screens/reports/payments.md](../screens/reports/payments.md)) |
| Ürün maliyeti → Brüt kâr | Ürün formundaki "Birim Maliyet" ([product.md](product.md)) |
| Çerezsiz sayım ayarı → Onay vermeyen ziyaretçiler | [../screens/settings/general.md](../screens/settings/general.md) |
| Müşteri segmenti boyutu | [segment.md](segment.md) |
