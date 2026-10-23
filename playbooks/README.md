# Playbook'lar

İstek → playbook eşlemesi. Playbook yoksa: `domain/project/screen-index.md`'den ekranı bul, ekran haritası +
`domain/project/dependency-graph.md` ile CLAUDE.md'deki çalışma döngüsünü uygula.

| İstek örnekleri | Playbook | Ana ekranlar |
|---|---|---|
| "bu ürünü sisteme gir", "şu linkteki ürünü ekle", "varyantlı tişört oluştur" | [product-create](product-create.md) | products/new |
| "cep telefonu için attribute ve attribute set ayarla", "ayakkabıya beden/renk kur" | [attribute-set-setup](attribute-set-setup.md) | attributes, attributes/sets |
| "Elektronik altına Telefon kategorisi aç", "Apple markasını ekle" | [category-brand-setup](category-brand-setup.md) | categories, brands |
| "ana sayfaya kampanya banner'ı ekle", "öne çıkan ürünler bölümü koy" | [homepage-component-add](homepage-component-add.md) | design/homepage |
| "şu konuda blog yazısı yaz/yayınla", "bu yazının İngilizcesini gir" | [blog-post-create](blog-post-create.md) | content/blog |
| "ilk depoyu kur", "İstanbul deposunu varsayılan yap" | [warehouse-setup](warehouse-setup.md) | inventory/warehouses |
| "şu SKU'nun stoğunu 50 yap", "hasarlı 3 adedi stoktan düş" | [stock-adjust](stock-adjust.md) | inventory/stock |
| "X tedarikçisinden satın alma siparişi aç", "gelen malı teslim al" | [purchase-order-create](purchase-order-create.md) | inventory/purchase-orders |
| "şu müşteriye sipariş oluştur", "telefonla gelen siparişi gir" | [order-create](order-create.md) | orders/new |
| "şu siparişi iptal et", "kısmi iade yap", "iade talebini (RMA) işle" | [order-cancel-refund](order-cancel-refund.md) | orders/[id] |
| "yeni müşteri ekle", "müşterinin adresini güncelle" | [customer-create](customer-create.md) | customers/new |
| "son 6 ayda 3+ sipariş verenler segmenti" | [segment-create](segment-create.md) | customers/segments |
| "X için fırsat aç", "fırsatı kazanıldı yap" | [crm-deal-create](crm-deal-create.md) | customers/crm/deals |
| "%20 indirim yap", "500 TL üzeri kargo bedava", "kupon kodu için indirim kur" | [promotion-create](promotion-create.md) | marketing/promotions |
| "KASIM10 kuponu oluştur", "500 adet tek kullanımlık kod üret", "kuponu uzat/kapat" | [coupon-create](coupon-create.md) | marketing/coupons, marketing/coupons/bulk |
| "VIP segmentine indirim e-postası gönder", "yarın 10:00'da kampanya zamanla", "bülten at" | [campaign-create](campaign-create.md) | marketing/campaigns |
| "bekleyen yorumları onayla", "şu yoruma yanıt yaz", "spam yorumu bayrakla" | [review-moderate](review-moderate.md) | marketing/reviews |
| "eski /kampanya adresini /indirim'e yönlendir", "301 ekle", "slug'ı değiştirdim, eski link çalışsın" | [redirect-create](redirect-create.md) | seo/redirects |
| "bu ürünleri Trendyol'a gönder", "Trendyol kategori eşlemesini yap", "komisyonları gir" | [marketplace-product-publish](marketplace-product-publish.md) | marketplace/[channel]/products, categories |
| "geçen ayın satışlarını özetle", "en çok satan ürünler", "başarısız ödemeler var mı" (salt okunur) | [sales-report](sales-report.md) | /, analytics, reports |

## Henüz playbook'u olmayan ama haritası olan işler

| İş | Harita |
|---|---|
| Ürün düzenleme, çeviri (store view) girme | `domain/screens/products/product-edit.md` |
| Toplu fiyat/stok/durum güncelleme | `domain/screens/products/product-bulk-edit.md` |
| Menü (navigasyon) düzenleme | `domain/screens/design/navigation.md` |
| Header/footer/layout | `domain/screens/design/layout-settings.md` |
| Marka renkleri/logo (branding) | `domain/screens/design/branding.md` |
| CMS sayfası oluşturma | `domain/screens/content/page-create.md` |
| Medya yükleme | `domain/screens/content/media-library.md` |
| Blog yorumlarını onaylama | `domain/screens/content/blog-comments.md` |
| İletişim/iade/bülten formu kurma, gönderimleri yönetme | `domain/screens/content/forms.md`, `form-submissions.md` |
| Beden rehberi kurma | `domain/screens/content/size-guides.md` |
| "AI ile yaz" istekleri | `domain/screens/content/ai-content.md` |
| Mağaza ayarları (para birimi, store view, vergi, ödeme, kargo, bildirim, entegrasyonlar) | `domain/screens/settings/settings-overview.md` → ilgili ekran |
| Depolar arası transfer, stok sayımı | `domain/screens/inventory/transfers.md`, `cycle-counts.md` |
| Tedarikçi ekleme | `domain/screens/inventory/suppliers.md` |
| Sipariş durumu, kargolama, fatura/e-Fatura kesme | `domain/screens/orders/order-detail.md`, `invoices.md` |
| Abonelik iptali | `domain/screens/orders/subscriptions.md` |
| Müşteri grubu, GDPR dışa aktarma/silme | `domain/screens/customers/customer-groups.md`, `customer-detail.md` |
| CRM kişi, görev, etkileşim kaydı | `domain/screens/customers/crm/contacts.md`, `tasks.md`, `interactions.md` |
| Ekip üyesi davet etme, rol düzenleme (hassas) | `domain/screens/system/system-users.md`, `roles.md` |
| Otomatik e-posta akışları (sepet hatırlatma, hoş geldin, geri kazanım) kurma, yayına alma, duraklatma | `domain/screens/marketing/workflows.md` |
| Meta bağlantısı, reklam hesabı, Pixel / Conversions API | `domain/screens/marketing/meta/meta-settings.md` |
| Meta hedef kitlesi (segmentten özel / benzer kitle) | `domain/screens/marketing/meta/audiences.md` |
| Meta reklam hunisi kurma, yayınlama (reklam harcaması) | `domain/screens/marketing/meta/funnels.md` |
| Meta A/B deneyi, performans uyarıları | `domain/screens/marketing/meta/experiments.md`, `alerts.md` |
| Panel, günlük özet, header ürün araması | `domain/screens/dashboard/dashboard.md`, `search.md` |
| Analitik: canlı aktivite, coğrafi dağılım, rapor şablonu / zamanlanmış rapor | `domain/screens/analytics/analytics-overview.md`, `realtime.md`, `geographic.md`, `reports.md` |
| Ödeme işlemleri ve iade özeti raporları | `domain/screens/reports/payments.md`, `refunds.md` |

## Yeni playbook yazarken

Başlık · örnek istekler · ilgili haritalar · kurallar · adımlar (her adımda: ne okunur, ne sorulur, ne doldurulur,
**onay noktası**, doğrulama) · sık hatalar. Canlı kullanımda doğrulanan adımları "✓ canlı doğrulandı (tarih)" ile işaretle.
