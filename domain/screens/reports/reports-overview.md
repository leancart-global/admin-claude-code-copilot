# Raporlar (hub) — mali ve operasyonel raporlar
- URL: {ADMIN_URL}/reports
- Menü yolu: Sol menüde "Raporlar / Reports" grup başlığı bu sayfaya **gitmez**; alt öğeler ("Faturalar", "Ödeme
  İşlemleri", "İade Özeti") doğrudan ilgili ekranı açar. Hub'a URL ile git.
- Sayfa başlığı: "Raporlar / Reports"; açıklama "Faturaları, ödeme hareketlerini ve iade özetlerini incele".
- Amaç: Mali raporlara giriş noktası. **Salt okunur**; kendi verisi yok.
- Yetki: sayfanın kendisi yetki istemez; kartların açtığı ekranlar kendi yetkisini ister (aşağıda).

## Yerleşim
Üç kart (kartın tamamı ve "Aç / Open" butonu tıklanır):

| Kart (tr / en) | Açıklama | Hedef | Harita | Yetki |
|---|---|---|---|---|
| Faturalar / Invoices | "Düzenlenen faturaları gözat ve PDF olarak indir" | `/invoices` | [../orders/invoices.md](../orders/invoices.md) | `orders:read` |
| Ödeme İşlemleri / Payment Transactions | "Başarılı ve başarısız ödeme işlemlerini incele" | `/reports/payments` | [payments.md](payments.md) | `reports:read` |
| İade Özeti / Refund Summary | "İşlenen ve bekleyen iadeleri takip et" | `/reports/refunds` | [refunds.md](refunds.md) | `reports:read` + `orders:credit-memo:view` |

- Kartlar kullanıcının yetkisine göre gizlenmez; yetkisiz ekranda hata/boş durum görünür.

## Diğer rapor ekranları (bu hub'da kartı yok)
| Rapor | Harita |
|---|---|
| Panel KPI'ları, Günlük Özet | [../dashboard/dashboard.md](../dashboard/dashboard.md) |
| Analitik paneli, canlı aktivite, coğrafi, rapor şablonları | [../analytics/analytics-overview.md](../analytics/analytics-overview.md), [../analytics/realtime.md](../analytics/realtime.md), [../analytics/geographic.md](../analytics/geographic.md), [../analytics/reports.md](../analytics/reports.md) |
| Sipariş analitiği | [../orders/orders-analytics.md](../orders/orders-analytics.md) |
| Müşteri analitiği | [../customers/customers-analytics.md](../customers/customers-analytics.md) |
| Stok yaşlanma, yeniden sipariş | [../inventory/inventory-reports.md](../inventory/inventory-reports.md) |
| Fiyatlandırma raporu | [../products/product-pricing-report.md](../products/product-pricing-report.md) |

## Onay zamanlaması
- Kalıcı aksiyon yok; onay gerekmez.

## Doğrulama
- Hedef ekranın başlığının açıldığını snapshot ile kontrol et.
