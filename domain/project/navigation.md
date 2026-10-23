# Navigasyon: sidebar ve header

Menü ağacı aşağıdadır; etiketler arayüz diline göre Türkçe veya İngilizce görünür.

## Sidebar davranışı (otomasyon için)

- Sidebar, kullanıcının yetkilerine göre **süzülür**; yetkisi olmayan öğe hiç görünmez. Üst öğenin kendi yetkisi
  yoksa ama görünür bir alt öğesi varsa üst öğe yine çıkar.
  Yetkiler yüklenirken sidebar **boş** gelir — boş sidebar'ı "yetki yok" diye yorumlamadan önce bekle.
- Geniş ekranda (≥1024px) sabit sol panel `div.admin-sidebar` (daraltılabilir); dar ekranda `Menu` ikonlu
  butonla açılan ikinci bir `div.admin-sidebar`. Tarayıcı penceresi genişliği ≥1024px olmalı;
  aksi halde sidebar gizli kalır.
- Alt öğeli grup bir `<button>`'dur; tıklayınca açılır/kapanır. Alt öğeler link'tir — grup açılmadan DOM'da yoktur.
  Açık sayfanın grubu ilk açılışta açık gelir.
- Daraltılmış modda alt öğeli gruba tıklamak sidebar'ı genişletir. Header'daki panel ikonlu buton daraltma anahtarıdır.
- Alt öğesiz öğeler (Panel, Analitik) doğrudan link.
- **Önerilen strateji:** Menü tıklamak yerine doğrudan URL'ye git (`browser_navigate {ADMIN_URL}/<route>`). Menü,
  yalnızca kullanıcının ne görebildiğini doğrulamak için okunur.
  Locator (menüden gitmek gerekirse):
  `page.locator('.admin-sidebar').filter({ visible: true }).getByRole('button', { name: /Ürünler|Products/ }).click()`
  → `getByRole('link', { name: /Markalar|Brands/ })`.

## Menü ağacı (render sırası)

Sütun "İzin" = öğeyi görmek için gereken yetki ("—" = herkes görür; `role:` = role göre). Yetki ayrıntısı: `permissions.md`.

| # | Grup (tr / en) | Alt öğe (tr / en) | Route | İzin |
|---|---|---|---|---|
| 1 | **Panel / Dashboard** | — | `/` | — |
| 2 | **Ürünler / Products** (`/products`) | Tüm Ürünler / All Products | `/products` | `products:read` |
| | | Markalar / Brands | `/brands` | `products:read` |
| | | Kategoriler / Categories | `/categories` | `categories:read` |
| | | Özellikler / Attributes | `/attributes` | `products:read` |
| | | Özellik Setleri / Attribute Sets | `/attributes/sets` | `products:read` |
| | | Fiyatlandırma Raporu / Pricing Report | `/products/reports/pricing` | `products:read` |
| 3 | **Envanter / Inventory** (`/inventory`, `inventory:read`) | Gösterge Paneli / Dashboard (sayfa başlığı "Düşük Stok Paneli") | `/inventory` | `inventory:read` |
| | | Stok / Stock | `/inventory/stock` | `inventory:read` |
| | | Depolar / Warehouses | `/inventory/warehouses` | `inventory:read` |
| | | Transferler / Transfers | `/inventory/transfers` | `inventory:read` |
| | | Satın Alma Siparişleri / Purchase Orders | `/inventory/purchase-orders` | `inventory:read` (veri: `po:read`) |
| | | Tedarikçiler / Suppliers | `/inventory/suppliers` | `inventory:read` (veri: `suppliers:read`) |
| | | Sayım İşlemleri / Cycle Counts | `/inventory/cycle-counts` | `inventory:read` |
| | | Hareketler / Movements (sayfa başlığı "Stok Hareketleri") | `/inventory/movements` | `inventory:read` |
| | | Yeniden Sipariş Önerileri / Reorder Suggestions | `/inventory/reports/reorder` | `inventory:read` |
| | | Yaşlanma Raporu / Aging Report | `/inventory/reports/aging` | `inventory:read` |
| 4 | **Siparişler / Orders** (`/orders`, `orders:read`) | Siparişler / Orders | `/orders` | `orders:read` |
| | | Analitik / Analytics | `/orders/analytics` | `orders:read` (sayfa içeriği analitik yetkisi ister, doğrulanmadı) |
| | | Abonelikler / Subscriptions | `/subscriptions` | `payment:subscription:read` |
| 5 | **Pazar Yeri / Marketplace** (`/marketplace`) | Genel Bakış / Overview | `/marketplace` | — (menü izin şartı yok; veri `marketplace:read`) |
| | | Trendyol | `/marketplace/trendyol` | — |
| | | Amazon | `/marketplace/amazon` | — |
| | | N11 | `/marketplace/n11` | — |
| | | Hepsiburada | `/marketplace/hepsiburada` | — |
| 6 | **Müşteriler / Customers** (`/customers`, `customers:read`) | Tüm Müşteriler / All Customers | `/customers` | `customers:read` |
| | | Analitik / Analytics | `/customers/analytics` | `customers:read` |
| | | Segmentler / Segments | `/customers/segments` | `customers:read` |
| | | Gruplar / Groups | `/customers/groups` | `customers:read` |
| | | CRM Kişiler / CRM Contacts | `/customers/crm/contacts` | — (sunucu: `crm:contacts:*`; plan `crm`) |
| | | Fırsat Hattı / Deals Pipeline | `/customers/crm/deals` | — (sunucu: `crm:deals:*`) |
| | | CRM Görevler / CRM Tasks | `/customers/crm/tasks` | — (sunucu: `crm:tasks:*`). "Etkileşimler" (`/customers/crm/interactions`) menüde yok, URL ile ya da kişi/fırsat detayından açılır |
| 7 | **Kullanıcılar / Users** (`/system-users`, `users:read`) | Tüm Kullanıcılar / All Users | `/system-users` | `users:read` |
| | | Roller / Roles | `/system-users/roles` | `role: admin, super_admin, security_admin` (kayıt yalnız super_admin) |
| 8 | **Analitik / Analytics** | — (sayfa üstünde sekmeler: Panel / Dashboard `/analytics`, Raporlar / Reports `/analytics/reports`, Aktivite / Activity `/analytics/realtime`, Coğrafi / Geographic `/analytics/geographic`) | `/analytics` | `analytics:read` |
| 9 | **Raporlar / Reports** (`/reports`) | Faturalar / Invoices | `/invoices` | — (veri: `orders:read`) |
| | | Ödeme İşlemleri / Payment Transactions | `/reports/payments` | — (veri: `reports:read`) |
| | | İade Özeti / Refund Summary | `/reports/refunds` | — (veri: `reports:read` + `orders:credit-memo:view`) |
| 10 | **Pazarlama / Marketing** (`/marketing`, `marketing:view`) | Kampanyalar / Campaigns | `/marketing/campaigns` | `marketing:view` |
| | | Promosyonlar / Promotions | `/marketing/promotions` | `marketing:view` |
| | | Kuponlar / Coupons | `/marketing/coupons` | `marketing:view` |
| | | Değerlendirmeler / Reviews | `/marketing/reviews` | `marketing:view` |
| | | Meta Reklamlar / Meta Ads | `/marketing/meta-ads` | `marketing:view` |
| 11 | **İçerik / Content** (`/content`, `content:read`) | Sayfalar / Pages | `/content/pages` | `content:read` |
| | | Blog / Blog | `/content/blog` | `content:read` |
| | | Formlar / Forms | `/content/forms` | `content:read` |
| | | Beden Kılavuzları / Size Guides | `/content/size-guides` | `content:read` |
| | | Medya / Media | `/content/media` | `content:read` |
| | | Yönlendirmeler / Redirects | `/seo/redirects` | `content:read` |
| 12 | **Mağaza Tasarımı / Store Design** (`/design`, `content:read`) | Ana Sayfa / Homepage | `/design/homepage` | `content:read` |
| | | Navigasyon / Navigation | `/design/navigation` | `content:read` |
| | | Marka Kimliği / Branding | `/branding` | `content:read` |
| | | Üst Bölüm / Header | `/layout-settings?tab=header` | `content:read` |
| | | Alt Bölüm / Footer | `/layout-settings?tab=footer` | `content:read` |
| 13 | **Ayarlar / Settings** (`/settings`, `settings:read`) | Genel / General | `/settings/general` | `settings:read` |
| | | Ödemeler / Payments | `/settings/payments` | `settings:read` |
| | | Pazar Yeri / Marketplace | `/settings/marketplace` | `settings:read` |
| | | Para Birimleri / Currencies | `/settings/currencies` | `settings:read` |
| | | Vergi Sınıfları / Tax Classes | `/settings/tax-classes` | `settings:read` |
| | | Vergiler / Taxes | `/settings/taxes` | `settings:read` |
| | | Kargo / Shipping | `/settings/shipping/carriers` | `settings:read` |
| | | Mağaza Görünümleri / Store Views | `/settings/store-views` | `settings:read` |
| | | e-Fatura / E-Invoice | `/settings/einvoice` | `settings:read` |
| | | API Anahtarları / API Keys | `/settings/api-keys` | `api-keys:read` |
| | | Web Kancaları / Webhooks | `/settings/webhooks` | `settings:read` |
| | | Arama Dizini / Search Index | `/settings/search-index` | `settings:read` |
| | | Alan Adları / Domains | `/settings/domains` | `settings:read` |
| | | Giriş / Sosyal Sağlayıcılar / Login / Social Providers | `/settings/social-login` | `settings:read` |
| | | Bildirimler / Notifications | `/settings/notifications` | `settings:read` |
| | | Çeviriler / Translations | `/settings/translations` | `settings:read` |
| | | Denetim Günlüğü / Audit Log | `/settings/audit-log` | `settings:read` |
| | | Oturumlar / Sessions | `/profile/sessions` | — |

Notlar:
- "Analitik / Analytics" etiketi üç yerde var (Siparişler altı, Müşteriler altı, üst seviye) — locator'ı grup içinde kapsamla.
- "Pazar Yeri / Marketplace" hem üst grup hem Ayarlar altı öğe. Kanal sayfası `/marketplace/ciceksepeti` açılır ama menüde
  yok ve "Henüz Kullanılamıyor" durumundadır ([../screens/marketplace/channel.md](../screens/marketplace/channel.md)).
- `/marketing` hub'ında Promosyonlar ve Otomasyonlar için kart yok ([../screens/marketing/marketing-overview.md](../screens/marketing/marketing-overview.md)).
- Ayar ekranlarının ne işe yaradığı, gizli alanları ve anında kayıt kontrolleri: [../screens/settings/settings-overview.md](../screens/settings/settings-overview.md).
- Sidebar logosu `LC` + `Lean Cart` → `/` linki.

## Menüde OLMAYAN ama route'u olan ekranlar (doğrudan URL veya hub/sayfa içi link)

| Route | Nasıl ulaşılır |
|---|---|
| `/settings` (hub) | Header kullanıcı menüsü → `Mağaza Ayarları`/`Store Settings`; ayar kartları buradan açılır |
| `/content`, `/design`, `/reports`, `/marketing` (hub sayfaları) | Sidebar grup butonu bu sayfaya gitmez; URL ile git |
| `/profile` | Header kullanıcı menüsü → `Profilim`/`My Profile` |
| `/search?q=` | Header arama kutusu (Enter); yalnız ürün arar ([../screens/dashboard/search.md](../screens/dashboard/search.md)) |
| `/products/new`, `/orders/new` | Header hızlı butonlar `Ürün Ekle`/`Add Product`, `Yeni Sipariş`/`New Order`; Dashboard hızlı işlemler |
| `/products/new-by-code` | Ürün listesindeki "barkod/EAN ile ekle" girişi (bkz. `../screens/products/product-new-by-code.md`) |
| `/marketing/workflows`, `/marketing/workflows/[id]` | Menüde ve `/marketing` hub'ında yok; yalnız URL ile ([../screens/marketing/workflows.md](../screens/marketing/workflows.md)) |
| `/marketing/meta/settings` | Meta Reklamlar genel bakış → "Ayarlar" kartı, kilitli kartlar ya da bağlantı bandı ("Bağlan / Tam bağlantıya geç / Yönet") |
| `/marketing/meta-ads/pixel` | Meta Reklamlar genel bakış → pixel bandı "Yönet / Pixel Yapılandır" ya da "1. Pixel Yapılandır" |
| `/marketing/meta-ads/{audiences,funnels,experiments,alerts,optimization}` | Menüde yok; Meta Reklamlar genel bakıştaki kartlar → "Aç" ([../screens/marketing/meta/meta-overview.md](../screens/marketing/meta/meta-overview.md)) |
| `/email-management` | Menüde yok; `email:manage` izni — E-posta yönetimi, kapsam dışı |
| `/notifications/unsubscribes` | URL ile |
| `/settings/notifications/frequency` | Abonelikten Çıkma İçgörüleri ekranından ya da URL ile |
| `/dashboard/digest` | Menüde yok; yalnız URL ile ([../screens/dashboard/dashboard.md](../screens/dashboard/dashboard.md)) |
| `/analytics/realtime`, `/analytics/geographic`, `/analytics/reports…` | Analitik ekranının üst sekmeleri; `/analytics/reports` ayrıca Panel → Hızlı İşlemler → "Raporları Gör" |
| `/content/blog/comments` | Blog listesindeki "Yorumlar / Comments" butonu |
| `/content/forms/[id]/submissions` | Form listesindeki gönderim sayısı / URL (form id'si builder adresinden) |
| `/branding/ai-wizard` | Marka Kimliği ekranından |
| `/system`, `/tenants`, `/system/scheduled-jobs` | Yalnızca URL; operatör + System Admin anahtarı |
| `/components-playground` | Geliştirici sayfası — kullanma |
| `/products/categories` → `/categories`, `/settings/sessions` → `/profile/sessions` | Otomatik yönlendirme |

## Header (üst bar)

Soldan sağa:

| Öğe | Davranış | Etiket tr / en | Locator |
|---|---|---|---|
| Mobil menü butonu | dar ekranda; sidebar'ı açar | (ikon, isimsiz) | |
| Sidebar daralt/genişlet | panel ikonu | (ikon, isimsiz) | |
| Arama kutusu | orta ve geniş ekranda görünür; Enter → `/search?q=<metin>` | placeholder `Ürün ara...` / `Search products...` | `getByPlaceholder(/Ürün ara|Search products/)` |
| Hızlı butonlar | geniş ekranda; `/products/new`, `/orders/new` | `Ürün Ekle`/`Add Product`, `Yeni Sipariş`/`New Order` | `getByRole('button', { name: /Ürün Ekle|Add Product/ })` |
| Bildirim merkezi (zil) | geniş ekranda açılır menü, dar ekranda sağ panel | aria-label `Bildirimler, {count} okunmamış` / `Notifications, {count} unread`; panel başlığı `Bildirimler`/`Notifications` | `getByRole('button', { name: /Bildirimler,|Notifications,/ })` |
| Dil seçici | açılır menü; seçim sonrası sayfa yeniden çizilir (bkz. `environments-and-auth.md` §2) | `🇹🇷 Türkçe` / `🇺🇸 English` | `getByRole('button', { name: /Türkçe|English/ })` → `getByRole('menuitem', ...)` |
| Kullanıcı menüsü | Ad + e-posta gösteren buton; açılan liste `role=menu` değildir | `Profilim`/`My Profile`, `Mağaza Ayarları`/`Store Settings`, `Çıkış Yap`/`Sign Out` | butonu e-posta metniyle bul; öğeler düz `<button>` |

Header'da **yok:** tenant seçici, store-view/mağaza görünümü seçici, para birimi seçici. Store view kapsamı
form içi seçicilerle yönetilir (bkz. `ui-conventions.md` § Store view / çeviri alanları).

## Sayfa başlığı kalıbı

Çoğu sayfanın ana başlığı `h1`'dir.
Sayfanın doğru açıldığını `getByRole('heading', { level: 1 })` metniyle doğrula (tr/en başlıklar `screen-index.md`).
