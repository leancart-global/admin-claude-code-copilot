# Ekran indeksi (tüm route'lar)

Admin panelindeki tüm ekranlar, alana göre gruplu.

- **URL**: tarayıcıda `{ADMIN_URL}<URL>`; adreste dil öneki **yok** (dili yalnız header'daki dil seçiciyle değiştir, bkz. [environments-and-auth.md](./environments-and-auth.md) §2). `[id]`, `[code]`, `[sku]`, `[channel]`, `[productId]` değişken kısımlardır; `[channel]` ∈ `trendyol|amazon|n11|hepsiburada`.
- **Ekran adı**: sayfa başlığı (`h1`) / menü etiketi. Menüde olmayan detay/oluşturma ekranlarının adları yaklaşıktır — canlıda `h1` ile doğrula.
- **İzin**: menü öğesinin ve sayfa içi aksiyonların gerektirdiği yetki. `—` = arayüzde yetkiye göre gizleme yok; işlemin yapılıp yapılamayacağına sunucu karar verir ([permissions.md](./permissions.md)).
- **Detay doküman**: Faz 1 (ürün, özellik, kategori, marka, tasarım, içerik sayfaları/medya), Faz 2 (blog, formlar, beden rehberi, ayarlar), Faz 3 (envanter, sipariş, müşteri/CRM, admin kullanıcıları) ve Faz 4 (panel/arama, pazarlama — kampanya, promosyon, kupon, değerlendirme, otomasyon, Meta —, pazar yeri kanalları, SEO yönlendirmeleri, analitik, mali raporlar) `../screens/<alan>/…`. Haritası olmayanlar `— (sonraki faz)`; bilinçli olarak haritalanmayanlar `— (kapsam dışı)`.
- Yönlendirmeler: `/products/categories` → `/categories`, `/settings/sessions` → `/profile/sessions`; `/marketing/promotions/[id]/edit` → `/marketing/promotions/[id]`; birçok oluşturma/düzenleme sayfası kaydettikten sonra listeye döner.

### auth

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/forgot-password` | Şifremi unuttum / Forgot password | Sıfırlama e-postası | — | public | [environments-and-auth.md](./environments-and-auth.md) |
| `/login` | Giriş / Sign in | Admin girişi (kullanıcı doldurur) | — | public | [environments-and-auth.md](./environments-and-auth.md) |
| `/reset-password` | Şifre sıfırla / Reset password | Token ile yeni şifre | — | public | [environments-and-auth.md](./environments-and-auth.md) |
| `/setup-2fa` | 2FA kurulumu / Set up 2FA | TOTP QR + kod | — | giriş gerekli | [environments-and-auth.md](./environments-and-auth.md) |
| `/unauthorized` | Erişim Reddedildi / Access Denied | Rol yetersiz | — | — | [environments-and-auth.md](./environments-and-auth.md) |
| `/verify-2fa` | 2FA doğrulama / Verify 2FA | Giriş 2. adım | — | public | [environments-and-auth.md](./environments-and-auth.md) |
| `/verify-email` | E-posta doğrulama / Verify email | Doğrulama linki | — | public | [environments-and-auth.md](./environments-and-auth.md) |

### dashboard

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/` | Panel / Dashboard | KPI, son siparişler, kurulum listesi, hızlı işlemler | — | analytics:read (veriler) | [dashboard.md](../screens/dashboard/dashboard.md) |
| `/dashboard/digest` | Günlük Özet / Daily Digest | Günlük özet, acil işler, fırsatlar, tahmin | — | analytics:read | [dashboard.md](../screens/dashboard/dashboard.md) |
| `/search` | Arama sonuçları / Search results | Header ürün araması (/search?q=); yalnız ürün | — | products:read | [search.md](../screens/dashboard/search.md) |

### products

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/products` | Ürün yönetimi / Product management | Ürün listesi, filtre, CSV, toplu işlem | Product | products:read | [product-list.md](../screens/products/product-list.md) |
| `/products/[id]` | Ürün detayı / Product detail | Ürün özeti, kalıcı silme | Product | products:read | [product-detail.md](../screens/products/product-detail.md) |
| `/products/[id]/edit` | Ürünü düzenle / Edit product | Ürün formu (sekmeler) | Product | products:write | [product-edit.md](../screens/products/product-edit.md) |
| `/products/categories` | (yönlendirme) / (redirect) | /categories adresine yönlendirir | — | — | [category-list.md](../screens/categories/category-list.md) |
| `/products/new` | Yeni Ürün Oluştur / Create New Product | Tip seç + ürün formu (ön koşul kartı) | Product | products:write | [product-create.md](../screens/products/product-create.md) |
| `/products/new-by-code` | Kodla ürün ekle / Add product by code | Barkod/EAN ile ürün oluştur | Product | products:write | [product-new-by-code.md](../screens/products/product-new-by-code.md) |
| `/products/reports/pricing` | Fiyatlandırma Raporu / Pricing Report | Kademeli fiyat / min. adet raporu | — | products:read; pricing:preview | [product-pricing-report.md](../screens/products/product-pricing-report.md) |

### attributes

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/attributes` | Özellikler / Attributes | Özellik listesi, ara/sil | Attribute | products:read | [attribute-list.md](../screens/attributes/attribute-list.md) |
| `/attributes/[id]/edit` | Özelliği düzenle / Edit attribute | Özellik düzenle | Attribute | products:write | [attribute-edit.md](../screens/attributes/attribute-edit.md) |
| `/attributes/new` | Yeni özellik / New attribute | Özellik oluştur (tip, seçenekler, çeviriler) | Attribute | products:write | [attribute-create.md](../screens/attributes/attribute-create.md) |
| `/attributes/sets` | Özellik Setleri / Attribute Sets | Set listesi | AttributeSet | products:read | [attribute-set-list.md](../screens/attributes/attribute-set-list.md) |
| `/attributes/sets/[id]/edit` | Özellik setini düzenle / Edit attribute set | Set düzenle | AttributeSet | products:write | [attribute-set-edit.md](../screens/attributes/attribute-set-edit.md) |
| `/attributes/sets/new` | Yeni özellik seti / New attribute set | Set oluştur, özellik grupla | AttributeSet | products:write | [attribute-set-create.md](../screens/attributes/attribute-set-create.md) |

### categories

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/categories` | Kategoriler / Categories | Kategori ağacı/listesi | Category | categories:read | [category-list.md](../screens/categories/category-list.md) |
| `/categories/[id]` | Kategori detayı / Category detail | Kategori görüntüle, ürünleri | Category | categories:read | [category-detail.md](../screens/categories/category-detail.md) |
| `/categories/[id]/edit` | Kategoriyi düzenle / Edit category | Kategori düzenle, ürün ata, çeviriler | Category | categories:write | [category-edit.md](../screens/categories/category-edit.md) |
| `/categories/new` | Yeni kategori / New category | Kategori oluştur (ön koşul: store view) | Category | categories:write | [category-create.md](../screens/categories/category-create.md) |

### brands

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/brands` | Markalar / Brands | Marka listesi | Brand | products:read | [brand-list.md](../screens/brands/brand-list.md) |
| `/brands/[id]/edit` | Markayı düzenle / Edit brand | Marka düzenle + çeviriler | Brand | products:write | [brand-edit.md](../screens/brands/brand-edit.md) |
| `/brands/new` | Yeni marka / New brand | Marka oluştur | Brand | products:write | [brand-create.md](../screens/brands/brand-create.md) |

### inventory

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/inventory` | Düşük Stok Paneli / Low Stock Dashboard (menü: Gösterge Paneli) | Stok özeti, değer raporu | — | inventory:read | [inventory-overview.md](../screens/inventory/inventory-overview.md) |
| `/inventory/cycle-counts` | Sayım İşlemleri / Cycle Counts | Sayım listesi/oluştur | CycleCount | inventory:read | [cycle-counts.md](../screens/inventory/cycle-counts.md) |
| `/inventory/cycle-counts/[id]` | Sayım detayı / Cycle count detail | Sayım gir/onayla | CycleCount | inventory:read | [cycle-counts.md](../screens/inventory/cycle-counts.md) |
| `/inventory/movements` | Stok Hareketleri / Movement Audit | Stok hareket geçmişi | StockMovement | inventory:read | [stock-movements.md](../screens/inventory/stock-movements.md) |
| `/inventory/purchase-orders` | Satın Alma Siparişleri / Purchase Orders | PO listesi | PurchaseOrder | po:read | [purchase-orders.md](../screens/inventory/purchase-orders.md) |
| `/inventory/purchase-orders/[id]` | Satın alma siparişi detayı / Purchase order detail | PO görüntüle/teslim al | PurchaseOrder | po:read; teslim al po:receive | [purchase-orders.md](../screens/inventory/purchase-orders.md) |
| `/inventory/purchase-orders/new` | Yeni satın alma siparişi / New purchase order | PO oluştur (tedarikçi, depo, kalemler) | PurchaseOrder | po:write | [purchase-orders.md](../screens/inventory/purchase-orders.md) |
| `/inventory/reports/aging` | Yaşlanma Raporu / Aging Report | Stok yaşlanma raporu | — | inventory:read | [inventory-reports.md](../screens/inventory/inventory-reports.md) |
| `/inventory/reports/reorder` | Yeniden Sipariş Önerileri / Reorder Suggestions | Yeniden sipariş raporu | — | inventory:read | [inventory-reports.md](../screens/inventory/inventory-reports.md) |
| `/inventory/stock` | Stok Yönetimi / Stock Management | Stok listesi, düzeltme, depo atama | StockItem | inventory:read | [stock.md](../screens/inventory/stock.md) |
| `/inventory/stock/[sku]` | Stok detayı (SKU) / Stock detail (SKU) | SKU bazında depo stokları | StockItem | inventory:read | [stock.md](../screens/inventory/stock.md) |
| `/inventory/stock/product/[productId]` | Ürün stok matrisi / Product stock matrix | Ürün/varyant x depo stokları | StockItem | inventory:read | [stock.md](../screens/inventory/stock.md) |
| `/inventory/suppliers` | Tedarikçiler / Suppliers | Tedarikçi listesi | Supplier | suppliers:read | [suppliers.md](../screens/inventory/suppliers.md) |
| `/inventory/suppliers/[id]` | Tedarikçi detayı / Supplier detail | Tedarikçi düzenle | Supplier | suppliers:read; düzenle suppliers:write | [suppliers.md](../screens/inventory/suppliers.md) |
| `/inventory/suppliers/new` | Yeni tedarikçi / New supplier | Tedarikçi oluştur | Supplier | suppliers:write | [suppliers.md](../screens/inventory/suppliers.md) |
| `/inventory/transfers` | Transferler / Transfers | Depolar arası transfer listesi/oluştur | StockTransfer | inventory:read | [transfers.md](../screens/inventory/transfers.md) |
| `/inventory/transfers/[id]` | Transfer detayı / Transfer detail | Transfer durumu | StockTransfer | inventory:read | [transfers.md](../screens/inventory/transfers.md) |
| `/inventory/warehouses` | Depolar / Warehouses | Depo listesi, tahsis ayarı | Warehouse | inventory:read | [warehouses.md](../screens/inventory/warehouses.md) |
| `/inventory/warehouses/[id]` | Depo detayı / Warehouse detail | Depo düzenle | Warehouse | inventory:read; düzenle inventory:write | [warehouses.md](../screens/inventory/warehouses.md) |
| `/inventory/warehouses/new` | Yeni depo / New warehouse | Depo oluştur (adres, kapasite) | Warehouse | inventory:write | [warehouses.md](../screens/inventory/warehouses.md) |

### orders

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/orders` | Sipariş Yönetimi / Order Management | Sipariş listesi, filtre | Order | orders:read | [orders-list.md](../screens/orders/orders-list.md) |
| `/orders/[id]` | Sipariş detayı / Order detail | Durum, kargo, fatura, iade, iptal | Order | orders:read | [order-detail.md](../screens/orders/order-detail.md) |
| `/orders/analytics` | Sipariş analitiği / Order analytics | Sipariş metrikleri | — | orders:read / analytics:read | [orders-analytics.md](../screens/orders/orders-analytics.md) |
| `/orders/new` | Yeni Sipariş / New Order | Admin sipariş oluşturma | Order | orders:write | [order-create.md](../screens/orders/order-create.md) |
| `/subscriptions` | Abonelikler / Subscriptions | Abonelik listesi | Subscription | payment:subscription:read | [subscriptions.md](../screens/orders/subscriptions.md) |
| `/subscriptions/[id]` | Abonelik detayı / Subscription detail | İptal/sürdür | Subscription | payment:subscription:read; iptal/geri al :manage | [subscriptions.md](../screens/orders/subscriptions.md) |

### marketplace

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/marketplace` | Pazar Yeri — Genel Bakış / Marketplace — Overview | Kanal durumları | — | menü: —; veri marketplace:read | [marketplace-overview.md](../screens/marketplace/marketplace-overview.md) |
| `/marketplace/[channel]` | Pazar yeri kanalı / Marketplace channel | trendyol/amazon/n11/hepsiburada kanal paneli | MarketplaceChannel | marketplace:read | [channel.md](../screens/marketplace/channel.md) |
| `/marketplace/[channel]/categories` | Kanal kategori eşleme / Channel category mapping | Kategori eşleme, kategori komisyonu | MarketplaceMapping | marketplace:read; komisyon marketplace:write | [channel-categories.md](../screens/marketplace/channel-categories.md) |
| `/marketplace/[channel]/pending` | Bekleyen işlemler / Pending | Kanaldan içe aktarılan ürünlerin inceleme kuyruğu | — | marketplace:read / write | [channel-pending.md](../screens/marketplace/channel-pending.md) |
| `/marketplace/[channel]/products` | Kanal ürünleri / Channel products | Ürün hazırlığı, ürün komisyonu, kanala gönderim | MarketplaceProduct | marketplace:read; gönderim/hazırlık/komisyon marketplace:write | [channel-products.md](../screens/marketplace/channel-products.md) |

### customers

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/customers` | Müşteri Yönetimi / Customer Management | Müşteri listesi | Customer | customers:read | [customers-list.md](../screens/customers/customers-list.md) |
| `/customers/[id]` | Müşteri detayı / Customer detail | Profil, siparişler, adresler, notlar, GDPR | Customer | customers:read | [customer-detail.md](../screens/customers/customer-detail.md) |
| `/customers/[id]/edit` | Müşteriyi düzenle / Edit customer | Müşteri bilgilerini düzenle | Customer | customers:write | [customer-create.md](../screens/customers/customer-create.md) |
| `/customers/analytics` | Müşteri Analitiği / Customer Analytics | Yaşam döngüsü, LTV, risk | — | customers:read | [customers-analytics.md](../screens/customers/customers-analytics.md) |
| `/customers/crm/contacts` | CRM Kişileri / CRM Contacts | CRM kişi listesi | CrmContact | crm:contacts:*; plan `crm` | [contacts.md](../screens/customers/crm/contacts.md) |
| `/customers/crm/contacts/[id]` | CRM kişi detayı / CRM contact detail | Kişi, notlar, takip | CrmContact | crm:contacts:*; plan `crm` | [contacts.md](../screens/customers/crm/contacts.md) |
| `/customers/crm/contacts/[id]/edit` | CRM kişiyi düzenle / Edit CRM contact | Kişi düzenle | CrmContact | crm:contacts:*; plan `crm` | [contacts.md](../screens/customers/crm/contacts.md) |
| `/customers/crm/deals` | Satış Hattı / Sales Pipeline | Fırsat pipeline (kanban) | CrmDeal | crm:deals:*; plan `crm` | [deals.md](../screens/customers/crm/deals.md) |
| `/customers/crm/deals/[id]` | Fırsat detayı / Deal detail | Fırsat, aktiviteler, ürünler | CrmDeal | crm:deals:*; plan `crm` | [deals.md](../screens/customers/crm/deals.md) |
| `/customers/crm/deals/[id]/edit` | Fırsatı Düzenle / Edit Deal | Fırsat düzenle | CrmDeal | crm:deals:*; plan `crm` | [deals.md](../screens/customers/crm/deals.md) |
| `/customers/crm/interactions` | Etkileşimler / Interactions | Etkileşim listesi | CrmInteraction | crm:interactions:*; plan `crm` | [interactions.md](../screens/customers/crm/interactions.md) |
| `/customers/crm/interactions/[id]` | Etkileşim detayı / Interaction detail | Etkileşim görüntüle | CrmInteraction | crm:interactions:*; plan `crm` | [interactions.md](../screens/customers/crm/interactions.md) |
| `/customers/crm/tasks` | CRM Görevleri / CRM Tasks | Görev listesi | CrmTask | crm:tasks:*; plan `crm` | [tasks.md](../screens/customers/crm/tasks.md) |
| `/customers/crm/tasks/[id]` | CRM görev detayı / CRM task detail | Görev, yorum, hatırlatıcı | CrmTask | crm:tasks:*; plan `crm` | [tasks.md](../screens/customers/crm/tasks.md) |
| `/customers/groups` | Müşteri Grupları / Customer Groups | Grup oluştur/düzenle/sil (dialog) | CustomerGroup | customers:read | [customer-groups.md](../screens/customers/customer-groups.md) |
| `/customers/new` | Müşteri Oluştur / Create Customer | Müşteri oluştur (adres) | Customer | customers:write | [customer-create.md](../screens/customers/customer-create.md) |
| `/customers/segments` | Müşteri Segmentleri / Customer Segments | Segment listesi | Segment | customers:read | [segments.md](../screens/customers/segments.md) |
| `/customers/segments/[id]` | Segment detayı / Segment detail | Segment önizleme/analitik | Segment | customers:read | [segments.md](../screens/customers/segments.md) |
| `/customers/segments/[id]/edit` | Segmenti düzenle / Edit segment | Segment kurallarını düzenle | Segment | customers:write | [segments.md](../screens/customers/segments.md) |
| `/customers/segments/new` | Segment Oluştur / Create Segment | Kural tabanlı segment oluştur | Segment | customers:write | [segments.md](../screens/customers/segments.md) |

### users

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/system-users` | Tüm Kullanıcılar / All Users | Admin kullanıcıları, davet, askıya al | AdminUser | users:read | [system-users.md](../screens/system/system-users.md) |
| `/system-users/roles` | Roller / Roles | Rol ve izin yönetimi | Role | roles:read; oluştur/düzenle/sil yalnız super_admin | [roles.md](../screens/system/roles.md) |

### analytics

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/analytics` | Analitik / Analytics | Satış/ziyaretçi analitiği, consentless sayımlar | — | analytics:read | [analytics-overview.md](../screens/analytics/analytics-overview.md) |
| `/analytics/geographic` | Coğrafi analitik / Geographic analytics | Bölgeye göre satış | — | analytics:read | [geographic.md](../screens/analytics/geographic.md) |
| `/analytics/realtime` | Gerçek zamanlı / Realtime | Canlı mağaza aktivitesi | — | analytics:read | [realtime.md](../screens/analytics/realtime.md) |
| `/analytics/reports` | Raporlar (analitik) / Reports (analytics) | Rapor şablonları, rapor üret/dışa aktar, zamanlanmış raporlar | Rapor | analytics:read; şablon sil analytics:write | [reports.md](../screens/analytics/reports.md) |
| `/analytics/reports/[id]` | Rapor detayı / Report detail | Rapor görüntüle/dışa aktar | Rapor | analytics:read | [reports.md](../screens/analytics/reports.md) |
| `/analytics/reports/templates/new` | Yeni rapor şablonu / New report template | Rapor şablonu oluştur | Rapor şablonu | analytics:write | [reports.md](../screens/analytics/reports.md) |

### reports

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/invoices` | Faturalar / Invoices | Fatura listesi/indir | Invoice | menü: —; veri orders:read | [invoices.md](../screens/orders/invoices.md) |
| `/reports` | Raporlar (hub) / Reports (hub) | Rapor kartları | — | — | [reports-overview.md](../screens/reports/reports-overview.md) |
| `/reports/payments` | Ödeme İşlemleri / Payment Transactions | Ödeme işlem raporu | Payment | reports:read | [payments.md](../screens/reports/payments.md) |
| `/reports/refunds` | İade Özeti / Refund Summary | İade/alacak dekontu raporu | CreditMemo | reports:read + orders:credit-memo:view | [refunds.md](../screens/reports/refunds.md) |

### marketing

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/marketing` | Pazarlama (hub) / Marketing (hub) | Pazarlama kartları | — | marketing:view | [marketing-overview.md](../screens/marketing/marketing-overview.md) |
| `/marketing/campaigns` | Kampanyalar / Campaigns | Kampanya listesi | Campaign | marketing:view | [campaigns.md](../screens/marketing/campaigns.md) |
| `/marketing/campaigns/[id]` | Kampanya detayı / Campaign detail | Kampanya istatistik/aksiyon | Campaign | marketing:view | [campaigns.md](../screens/marketing/campaigns.md) |
| `/marketing/campaigns/[id]/edit` | Kampanyayı düzenle / Edit campaign | Kampanya düzenle | Campaign | marketing:update | [campaigns.md](../screens/marketing/campaigns.md) |
| `/marketing/campaigns/new` | Yeni kampanya / New campaign | Kampanya oluştur (segment hedefleme) | Campaign | marketing:create | [campaigns.md](../screens/marketing/campaigns.md) |
| `/marketing/coupons` | Kuponlar / Coupons | Kupon listesi | Coupon | marketing:view | [coupons.md](../screens/marketing/coupons.md) |
| `/marketing/coupons/[id]` | Kupon detayı / Coupon detail | Kupon kullanım/aksiyon | Coupon | marketing:view; Kopyala marketing:create | [coupons.md](../screens/marketing/coupons.md) |
| `/marketing/coupons/[id]/edit` | Kuponu düzenle / Edit coupon | Kupon düzenle | Coupon | marketing:update | [coupons.md](../screens/marketing/coupons.md) |
| `/marketing/coupons/bulk` | Toplu kupon / Bulk coupons | Toplu kupon kodu üret | Coupon | marketing:create | [coupon-bulk.md](../screens/marketing/coupon-bulk.md) |
| `/marketing/coupons/new` | Yeni kupon / New coupon | Kupon oluştur (promosyona bağlı) | Coupon | marketing:create | [coupons.md](../screens/marketing/coupons.md) |
| `/marketing/meta-ads` | Meta Reklamlar / Meta Ads | Meta reklam genel bakış | — | marketing:view | [meta-overview.md](../screens/marketing/meta/meta-overview.md) |
| `/marketing/meta-ads/alerts` | Meta uyarıları / Meta alerts | Uyarı kuralları | MetaAlert | marketing:view | [alerts.md](../screens/marketing/meta/alerts.md) |
| `/marketing/meta-ads/alerts/[id]` | Meta uyarı detayı / Meta alert detail | Uyarı görüntüle | MetaAlert | marketing:view | [alerts.md](../screens/marketing/meta/alerts.md) |
| `/marketing/meta-ads/alerts/[id]/edit` | Meta uyarısını düzenle / Edit Meta alert | Uyarı düzenle | MetaAlert | marketing:update | [alerts.md](../screens/marketing/meta/alerts.md) |
| `/marketing/meta-ads/alerts/new` | Yeni Meta uyarısı / New Meta alert | Uyarı kuralı oluştur | MetaAlert | marketing:create | [alerts.md](../screens/marketing/meta/alerts.md) |
| `/marketing/meta-ads/audiences` | Meta kitleleri / Meta audiences | Kitle listesi | MetaAudience | marketing:view | [audiences.md](../screens/marketing/meta/audiences.md) |
| `/marketing/meta-ads/audiences/[id]` | Meta kitle detayı / Meta audience detail | Kitle görüntüle | MetaAudience | marketing:view | [audiences.md](../screens/marketing/meta/audiences.md) |
| `/marketing/meta-ads/audiences/[id]/edit` | Meta kitlesini düzenle / Edit Meta audience | Kitle düzenle | MetaAudience | marketing:update | [audiences.md](../screens/marketing/meta/audiences.md) |
| `/marketing/meta-ads/audiences/new` | Yeni Meta kitlesi / New Meta audience | Kitle oluştur (segmentten) | MetaAudience | marketing:create | [audiences.md](../screens/marketing/meta/audiences.md) |
| `/marketing/meta-ads/experiments` | Meta deneyleri / Meta experiments | A/B deney listesi | MetaExperiment | marketing:view | [experiments.md](../screens/marketing/meta/experiments.md) |
| `/marketing/meta-ads/experiments/[id]` | Meta deney detayı / Meta experiment detail | Deney sonuçları | MetaExperiment | marketing:view | [experiments.md](../screens/marketing/meta/experiments.md) |
| `/marketing/meta-ads/experiments/new` | Yeni Meta deneyi / New Meta experiment | Deney oluştur | MetaExperiment | marketing:create | [experiments.md](../screens/marketing/meta/experiments.md) |
| `/marketing/meta-ads/funnels` | Meta hunileri / Meta funnels | Huni listesi | MetaFunnel | marketing:view | [funnels.md](../screens/marketing/meta/funnels.md) |
| `/marketing/meta-ads/funnels/[id]` | Meta huni detayı / Meta funnel detail | Huni görüntüle | MetaFunnel | marketing:view | [funnels.md](../screens/marketing/meta/funnels.md) |
| `/marketing/meta-ads/funnels/[id]/edit` | Meta hunisini düzenle / Edit Meta funnel | Huni düzenle | MetaFunnel | marketing:update | [funnels.md](../screens/marketing/meta/funnels.md) |
| `/marketing/meta-ads/funnels/new` | Yeni Meta hunisi / New Meta funnel | Huni oluştur (aşamalar, sürükle-bırak) | MetaFunnel | marketing:create | [funnels.md](../screens/marketing/meta/funnels.md) |
| `/marketing/meta-ads/optimization` | Meta optimizasyon / Meta optimization | Optimizasyon kuralları (yer tutucu, "çok yakında") | — | marketing:view | [meta-overview.md](../screens/marketing/meta/meta-overview.md) |
| `/marketing/meta-ads/pixel` | Meta Pixel / Meta Pixel | Pixel/CAPI ayarı ve test | MetaPixel | görüntüle marketing:view; kaydet/test marketing:update | [meta-settings.md](../screens/marketing/meta/meta-settings.md) |
| `/marketing/meta/settings` | Meta ayarları / Meta settings | Meta bağlantı/mod ayarları | MetaSettings | görüntüle marketing:view; bağla/kaydet marketing:update; Bağlantıyı Kes marketing:delete | [meta-settings.md](../screens/marketing/meta/meta-settings.md) |
| `/marketing/promotions` | Promosyonlar / Promotions | İndirim kampanyası listesi | Promotion | marketing:view | [promotions.md](../screens/marketing/promotions.md) |
| `/marketing/promotions/[id]` | Promosyon detayı / Promotion detail | Promosyon görüntüle/düzenle | Promotion | marketing:update (yalnız view yetmez → listeye döner) | [promotions.md](../screens/marketing/promotions.md) |
| `/marketing/promotions/[id]/edit` | Promosyonu düzenle / Edit promotion | Detaya yönlendirir | Promotion | marketing:update | [promotions.md](../screens/marketing/promotions.md) |
| `/marketing/promotions/new` | Yeni promosyon / New promotion | Promosyon oluştur (yüzde / tutar / ücretsiz kargo, tarih, kullanım sınırı) | Promotion | marketing:create | [promotions.md](../screens/marketing/promotions.md) |
| `/marketing/reviews` | Değerlendirmeler / Reviews | Ürün yorum moderasyonu | Review | marketing:view; moderasyon marketing:update | [reviews.md](../screens/marketing/reviews.md) |
| `/marketing/reviews/[id]` | Değerlendirme detayı / Review detail | Yorum onayla/reddet/yanıtla | Review | marketing:view; moderasyon marketing:update; yanıt marketing:update + marketing:create | [reviews.md](../screens/marketing/reviews.md) |
| `/marketing/workflows` | İş akışları / Workflows | Otomasyon listesi/şablon galerisi (menüde yok, yalnız URL) | Workflow | marketing:view; yeni marketing:create | [workflows.md](../screens/marketing/workflows.md) |
| `/marketing/workflows/[id]` | İş akışı tuvali / Workflow canvas | Akış düzenleyici (tuval) | Workflow | marketing:view; kaydet/yayına al/duraklat marketing:update | [workflows.md](../screens/marketing/workflows.md) |

### content

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/content` | İçerik (hub) / Content (hub) | İçerik alt ekranlarına kartlar | — | content:read | [blog-list.md](../screens/content/blog-list.md) (hub kartları) |
| `/content/blog` | Blog Yönetimi / Blog Management | Blog yazıları listesi | BlogPost | content:read | [blog-list.md](../screens/content/blog-list.md) |
| `/content/blog/[id]` | Blog yazısı detayı / Blog post detail | Yazı görüntüle/yayınla/sil | BlogPost | content:read | [blog-list.md](../screens/content/blog-list.md) (detay bölümü) |
| `/content/blog/[id]/edit` | Blog yazısını düzenle / Edit blog post | Blok editörüyle düzenle | BlogPost | content:write | [blog-edit.md](../screens/content/blog-edit.md) |
| `/content/blog/comments` | Yorumlar / Comments | Blog yorum moderasyonu | BlogComment | content:write | [blog-comments.md](../screens/content/blog-comments.md) |
| `/content/blog/new` | Yeni blog yazısı / New blog post | Blog yazısı oluştur | BlogPost | content:write | [blog-edit.md](../screens/content/blog-edit.md) |
| `/content/forms` | Formlar / Forms | Form listesi | Form | content:read | [forms.md](../screens/content/forms.md) |
| `/content/forms/[id]` | Form düzenleyici / Form builder | Form alanlarını düzenle | Form | content:read/update | [forms.md](../screens/content/forms.md) |
| `/content/forms/[id]/submissions` | Gönderimler / Submissions | Form gönderimleri, dışa aktar, GDPR sil | FormSubmission | content:read | [form-submissions.md](../screens/content/form-submissions.md) |
| `/content/forms/new` | Yeni Form / New Form | Form oluştur (şablon/boş) | Form | content:write | [forms.md](../screens/content/forms.md) |
| `/content/media` | Medya Kütüphanesi / Media Library | Medya yükle/düzenle/sil | Media | content:read | [media-library.md](../screens/content/media-library.md) |
| `/content/pages` | Sayfa Yönetimi / Page Management | CMS sayfa listesi | Page | content:read | [pages-list.md](../screens/content/pages-list.md) |
| `/content/pages/[id]` | Sayfa detayı / Page detail | Sayfa görüntüle/yayınla/sil | Page | content:read | [pages-list.md](../screens/content/pages-list.md) (detay bölümü) |
| `/content/pages/[id]/edit` | Sayfayı düzenle / Edit page | Blok editörüyle sayfa düzenle | Page | content:write | [page-edit.md](../screens/content/page-edit.md) |
| `/content/pages/new` | Yeni sayfa / New page | Sayfa oluştur | Page | content:write | [page-create.md](../screens/content/page-create.md) |
| `/content/size-guides` | Beden Rehberi Yönetimi / Size Guide Management | Beden kılavuzu listesi | SizeGuide | content:read | [size-guides.md](../screens/content/size-guides.md) |
| `/content/size-guides/[id]` | Beden rehberi detayı / Size guide detail | Görüntüle/sil | SizeGuide | content:read | [size-guides.md](../screens/content/size-guides.md) |
| `/content/size-guides/[id]/edit` | Beden rehberini düzenle / Edit size guide | Tablo/çeviri düzenle | SizeGuide | content:write | [size-guides.md](../screens/content/size-guides.md) |
| `/content/size-guides/new` | Yeni beden rehberi / New size guide | Beden kılavuzu oluştur | SizeGuide | content:write | [size-guides.md](../screens/content/size-guides.md) |
| `/seo/redirects` | URL Yönlendirmeleri / URL Redirects | Yönlendirme listesi, CSV içe aktar (dışa aktarma yok) | Redirect | content:read | [redirects.md](../screens/seo/redirects.md) |
| `/seo/redirects/[id]/edit` | Yönlendirmeyi düzenle / Edit redirect | Yönlendirme düzenle | Redirect | content:update (sunucu content:write) | [redirects.md](../screens/seo/redirects.md) |
| `/seo/redirects/new` | Yeni yönlendirme / New redirect | Yönlendirme oluştur | Redirect | content:create (sunucu content:write) | [redirects.md](../screens/seo/redirects.md) |

### design

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/branding` | Marka Kimliği / Branding | Logo, renk, font, ürün rozetleri | Branding | content:read (UI); settings:write kaydet | [branding.md](../screens/design/branding.md) |
| `/branding/ai-wizard` | AI marka sihirbazı / AI brand wizard | AI ile palet/kimlik üret | Branding | settings:write; plan özelliği | [branding-ai-wizard.md](../screens/design/branding-ai-wizard.md) |
| `/design` | Mağaza Tasarımı (hub) / Store Design (hub) | Tasarım alt ekranlarına kartlar | — | content:read | [design-overview.md](../screens/design/design-overview.md) |
| `/design/homepage` | Ana Sayfa / Homepage | Ana sayfa blok editörü (banner, ürün, kategori blokları) | Ana sayfa | content:read; yayın content:write | [homepage-builder.md](../screens/design/homepage-builder.md) |
| `/design/navigation` | Navigasyon / Navigation | Mağaza menüsü ağacı (kategori/sayfa/blog/ürün linkleri) | NavigationMenu | content:read | [navigation.md](../screens/design/navigation.md) |
| `/layout-settings` | Üst/Alt Bölüm (Header/Footer) / Header / Footer | Header ve footer düzeni (?tab=header|footer) | Header/Footer düzeni | content:read | [layout-settings.md](../screens/design/layout-settings.md) |

### settings

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/email-management` | E-posta yönetimi / Email management | E-posta paneline geçiş | — | email:manage | — (kapsam dışı) |
| `/notifications/unsubscribes` | Üyelik İptal Analizleri / Unsubscribe Insights | Abonelikten çıkma analizi | — | — | [notification-rules.md](../screens/settings/notification-rules.md) (bağlantı) |
| `/settings` | Mağaza Ayarları (hub) / Store Settings (hub) | Ayar kartları | — | settings:read | [settings-overview.md](../screens/settings/settings-overview.md) |
| `/settings/api-keys` | API Anahtarları / API Keys | API anahtarı oluştur/iptal (gizli) | ApiKey | api-keys:read | [api-keys.md](../screens/settings/api-keys.md) |
| `/settings/audit-log` | Denetim Günlüğü / Audit Log | Admin işlem kayıtları | AuditLog | settings:read (sunucu: audit:read) | [audit-log.md](../screens/settings/audit-log.md) |
| `/settings/currencies` | Para Birimleri / Currencies | Para birimi ekle/düzenle/kur | Currency | settings:read | [currencies.md](../screens/settings/currencies.md) |
| `/settings/domains` | Özel Alan Adları / Custom Domains | Alan adı ekle/DNS doğrula/sertifika | CustomDomain | settings:read; domains:write | [domains.md](../screens/settings/domains.md) |
| `/settings/einvoice` | e-Fatura Ayarları / E-Invoice Settings | Sağlayıcı, fatura modu | EInvoiceConfig | settings:read | [einvoice.md](../screens/settings/einvoice.md) |
| `/settings/einvoice/[id]` | e-Fatura sağlayıcı yapılandırması / Configure e-invoice provider | Sağlayıcı ayarı/test | EInvoiceConfig | settings:write | [einvoice.md](../screens/settings/einvoice.md) |
| `/settings/general` | Genel Ayarlar / General Settings | Mağaza yapılandırma, iletişim, plan, captcha, analitik | Mağaza ayarları | settings:read; kaydet settings:write | [general.md](../screens/settings/general.md) |
| `/settings/marketplace` | Pazar yeri ayarları / Marketplace settings | Kanal bağlantıları | MarketplaceConfig | settings:read | [marketplace.md](../screens/settings/marketplace.md) |
| `/settings/marketplace/[id]` | Pazar yeri bağlantısı / Marketplace connection | Kanal kimlik bilgileri/test | MarketplaceConfig | settings:write | [marketplace.md](../screens/settings/marketplace.md) |
| `/settings/notifications` | Bildirim Ayarları / Notification Settings | E-posta şablonları (zengin metin), gönderici | EmailTemplate | settings:read | [notifications.md](../screens/settings/notifications.md) |
| `/settings/notifications/frequency` | Gönderim Kuralları / Sending Rules | Bildirim sıklık kuralları | — | settings:read | [notification-rules.md](../screens/settings/notification-rules.md) |
| `/settings/payments` | Ödeme Sağlayıcıları / Payment Providers | Sağlayıcı listesi/ekle/varsayılan | PaymentConfig | settings:read | [payments.md](../screens/settings/payments.md) |
| `/settings/payments/[id]` | Sağlayıcıyı yapılandır / Configure provider | Sağlayıcı kimlik bilgileri, taksit | PaymentConfig | settings:write | [payments.md](../screens/settings/payments.md) |
| `/settings/search-index` | Arama Dizini / Search Index | Dizin durumu, yeniden oluştur | — | settings:read; search:write | [search-index.md](../screens/settings/search-index.md) |
| `/settings/sessions` | (yönlendirme) / (redirect) | /profile/sessions adresine yönlendirir | — | — | [settings-overview.md](../screens/settings/settings-overview.md) |
| `/settings/shipping/carriers` | Kargo Taşıyıcıları / Shipping Carriers | Taşıyıcı yapılandırma, kısıtlar, öncelik | ShippingCarrier | settings:read | [shipping-carriers.md](../screens/settings/shipping-carriers.md) |
| `/settings/social-login` | Giriş / Sosyal Sağlayıcılar / Login / Social Providers | Google/Facebook giriş ayarı | SocialLoginConfig | settings:read | [social-login.md](../screens/settings/social-login.md) |
| `/settings/store-views` | Mağaza Görünümleri / Store Views | Store view listesi/ekle (Sheet) | StoreView | settings:read | [store-views.md](../screens/settings/store-views.md) |
| `/settings/store-views/[code]` | Mağaza görünümünü düzenle / Edit store view | Görünüm, routing, çerez politikası sayfası | StoreView | settings:read; content:write | [store-views.md](../screens/settings/store-views.md) |
| `/settings/tax-classes` | Vergi Sınıfları / Tax Classes | Vergi sınıfı ekle/düzenle/sil | TaxClass | settings:read | [tax-classes.md](../screens/settings/tax-classes.md) |
| `/settings/taxes` | Vergiler / Taxes | KDV dahil fiyat, gösterim, sepet grup fiyatı | TaxSettings | settings:read | [taxes.md](../screens/settings/taxes.md) |
| `/settings/translations` | Çeviriler / Translations | Storefront arayüz çevirileri | Translation | settings:read | [translations.md](../screens/settings/translations.md) |
| `/settings/webhooks` | Web Kancaları / Webhooks | Webhook abonelikleri | WebhookSubscription | settings:read; webhook_subscriptions:* (yazma/silme) | [webhooks.md](../screens/settings/webhooks.md) |

### profile

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/profile` | Profilim / My Profile | Ad, şifre değiştirme | AdminUser | — | [profile.md](../screens/system/profile.md) |
| `/profile/sessions` | Oturumlar / Sessions | Aktif oturumlar, diğerlerini kapat | Session | — | [profile.md](../screens/system/profile.md) |

### operator

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/system` | Operatör konsolu / Operator console | Platform operatör ekranlarına giriş | — | System Admin anahtarı | [permissions.md §5](./permissions.md) |
| `/system/scheduled-jobs` | Zamanlanmış işler / Scheduled jobs | Zamanlanmış işlerin kapsamı | ScheduledJob | System Admin anahtarı | [permissions.md §5](./permissions.md) |
| `/tenants` | Kiracı Yönetimi / Tenant Management | Tenant listele/oluştur/detay | Tenant | System Admin anahtarı | [permissions.md §5](./permissions.md) |

### components-playground

| URL | Ekran (tr / en) | Amaç | Ana varlık | İzin | Detay doküman |
|---|---|---|---|---|---|
| `/components-playground` | Bileşen oyun alanı / Components playground | Geliştirici sayfası — kullanma | — | — | — (kapsam dışı) |
