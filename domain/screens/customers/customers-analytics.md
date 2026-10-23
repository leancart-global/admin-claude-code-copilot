# Müşteri Analitiği (Customer Analytics)
- URL: {ADMIN_URL}/customers/analytics
- Menü yolu: Sol menü "Müşteriler / Customers" → "Analitik / Analytics" (aynı etiket Siparişler altında ve üst seviyede
  de var; "Müşteriler" grubu içindekine tıkla).
- Sayfa başlığı: "Müşteri Analitiği / Customer Analytics"; açıklama "Müşteri tabanınıza dair içgörüler".
- Amaç: Müşteri tabanının özetini, yaşam döngüsü ve değer dağılımını, LTV dağılımını, risk altındaki ve en değerli
  müşterileri görmek. **Salt okunur** ekran; kayıt değiştiren aksiyon yok.
- Entity: [../../entities/customer.md](../../entities/customer.md).
- Yetki: `customers:read`.
- Kişisel veri: risk ve en iyi müşteri tablolarında ad ve e-posta görünür.

## Ön koşullar ve bağımlılıklar
- Anlamlı değerler için sipariş geçmişi gerekir; yaşam döngüsü, değer segmenti, LTV, kayıp riski siparişlerden sistemce
  hesaplanır.

## Yerleşim
1. Başlık + sağda "Yenile / Refresh" (yalnız veriyi yeniden okur).
2. Özet kartları: "Toplam Müşteri / Total Customers" ("{n} aktif"), "Bu Ay Yeni / New This Month",
   "Ortalama LTV / Average LTV" ("Toplam: {tutar}"), "Ort. Sipariş Değeri / Avg Order Value" ("Müşteri başına {n} sipariş").
3. "Müşteri Yaşam Döngüsü / Customer Lifecycle" hunisi: Potansiyel, Yeni, Aktif, Risk Altında, Kayıp, Pasif.
4. "Değer Segmentleri / Value Segments": VIP, Yüksek Değer, Orta, Düşük, Yeni.
5. "LTV Dağılımı / LTV Distribution": aralık başına müşteri sayısı.
6. "Risk Altındaki Müşteriler / At-Risk Customers" (ilk 5): Müşteri, Kayıp Riski (%; %70 üstü kırmızı rozet), Pasif Gün,
   LTV; "Tümünü Gör / View All". Boş: "Risk altında müşteri tespit edilmedi".
7. "En İyi Müşteriler / Top Customers" (ilk 5): Müşteri, Sipariş, LTV, Durum; "Tümünü Gör". Boş: "Müşteri verisi mevcut değil".

## Alanlar
Form alanı yok.

## Aksiyonlar
| Buton | Ne olur |
|---|---|
| Yenile | Veriyi yeniden yükler |
| Tablo satırı | `/customers/{id}` detayına gider ([customer-detail.md](customer-detail.md)) |
| Tümünü Gör (her iki tablo) | Müşteri listesine gider ([customers-list.md](customers-list.md)); listede ilgili filtrenin uygulanıp uygulanmadığı doğrulanmadı |

## Onay zamanlaması
- Kalıcı değişiklik, e-posta veya dış sistem yazımı yok; onay gerekmez.

## Yan etkiler
- Yok.

## Tuzaklar
- Tutarlar mağazanın para birimiyle gösterilir; sipariş para birimi farklıysa karşılaştırmada dikkat (doğrulanmadı).
- Risk ve değer segmentleri sistem hesabıdır; segment kurallarında kullanmak için bkz. [segments.md](segments.md).
- "Bu Ay Yeni" kartındaki trend etiketini rapora rakam olarak taşıma (doğrulanmadı).

## Doğrulama
- Rapor istenirse yalnız kartlardaki sayıları ve tablo satır sayısını aktar; kişisel veriyi (e-posta) rapora koyma.
