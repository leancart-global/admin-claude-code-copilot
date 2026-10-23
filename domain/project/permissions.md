# Yetki modeli (roller, izinler, UI gizleme)

Özet: **UI izinleri gizler, karar sunucudadır.** Admin, kullanıcının yetki listesine göre menü/buton gizler;
bir işlemin yapılıp yapılamayacağına her zaman sunucu karar verir.

## 1. Roller

| Rol | Not |
|---|---|
| `super_admin` (Super Admin) | Tüm yetkiler; `admin`'e ek olarak `products:delete:permanent`, `audit:read`, `audit:export`; rol oluşturma/düzenleme/silme yalnız bu rolde |
| `admin` (Admin) | Tipik merchant kullanıcısı; mağaza yönetimi yetkilerinin tamamı (yukarıdaki ekler hariç); kullanıcı davet edebilir |
| `security_admin` (Security Admin) | Rol yönetimi ekranını görür; kullanıcı listesini yönetmez |
| Store Manager, Store Operator, Viewer | Mağaza kapsamlı, daha dar yetkili varsayılan roller (silinemez); ayrıca özel roller tanımlanabilir ([../screens/system/roles.md](../screens/system/roles.md)) |

- Admin paneline yalnız yönetici rolündeki kullanıcılar giriş yapabilir.
- `viewer` altı bir rolle girilirse `/unauthorized` (`Erişim Reddedildi` / `Access Denied`) sayfası çıkar.
- Rol yönetimi ekranı (`/system-users/roles`) yalnız `admin`, `super_admin`, `security_admin` rollerine görünür.
- Bazı ekranlarda buton/kart izinle değil rolle gösterilir: envanter "Stok Değeri" kartı (super_admin, admin, manager), satın alma siparişi satır aksiyonları.

## 2. İzin anahtarları

| Anahtar | Ne sağlar |
|---|---|
| `products:read` | Ürün, marka, özellik, özellik seti listeleri |
| `products:write` | Ürün oluşturma/düzenleme; marka ve özellik ekranları da bunu ister |
| `products:delete` | Ürün arşivleme (soft silme) |
| `products:delete:permanent` | Kalıcı ürün silme — yalnız super_admin |
| `products:bulk` | Toplu ürün işlemleri |
| `orders:read` / `orders:write` / `orders:delete` | Sipariş görüntüleme / oluşturma-düzenleme / silme |
| `orders:ship` | Sipariş gönderimi (kargolama) |
| `orders:status:update`, `orders:cancel`, `orders:refund`, `orders:hold`, `orders:deliver`, `orders:fraud:review` | Sipariş durumu, iptal, iade, bekletme, teslim, sahtecilik incelemesi ([../screens/orders/order-detail.md](../screens/orders/order-detail.md)) |
| `orders:credit-memo:create` / `:approve` / `:process` / `:cancel` / `:view` | Alacak dekontu (iade). Kalem bazlı iade için create + approve + process üçü birden gerekir; yoksa diyalogda gönder butonu çıkmaz. `:view` ayrıca İade Özeti raporu (`/reports/refunds`, `reports:read` ile birlikte) |
| `orders:return:create` / `:approve` / `:reject` / `:receive` / `:inspect` / `:process` / `:cancel` | İade talebi (RMA) adımları |
| `orders:export`, `orders:bulk` | Sipariş dışa aktarma, toplu işlem |
| `customers:read` / `customers:write` / `customers:delete` | Müşteri görüntüleme / oluşturma-düzenleme / silme |
| `customers:gdpr:delete` | GDPR silme (geri alınamaz) |
| `gdpr:export` / `gdpr:delete` | Müşteri verisini dışa aktarma / anonimleştirme ve "Tüm Verileri Sil" ([../screens/customers/customer-detail.md](../screens/customers/customer-detail.md)) |
| `customer-groups:*` | Müşteri grupları (ekran ayrıca `customers:read/write` ister) |
| `crm:contacts:*`, `crm:deals:*`, `crm:tasks:*`, `crm:interactions:*` | CRM kişi, fırsat, görev, etkileşim (read/write/delete). CRM ayrıca plan özelliği `crm` ister (Rise ve üstü) |
| `categories:read` / `categories:write` / `categories:delete` | Kategori görüntüleme / oluşturma-düzenleme / silme |
| `inventory:read` / `inventory:write` | Envanter görüntüleme / düzenleme |
| `inventory:admin` | Depo silme, kapasite yeniden hesaplama, transfer onayı, sayımda ABC planlama / fark onayı / sayım reddi |
| `suppliers:read` / `suppliers:write` | Tedarikçiler |
| `po:read`, `po:write`, `po:receive`, `po:admin`, `po:view_costs` | Satın alma siparişi: görüntüle; oluştur/sil/gönder/onayla/iptal; teslim al; tamamla; fiyat ve finansal özet |
| `marketing:view` / `:create` / `:update` / `:delete` | Pazarlama ekranları (kampanya, promosyon, kupon, değerlendirme, otomasyon, Meta). Ayrıntı aşağıda §2.1 |
| `analytics:read` | Panel ve Günlük Özet verileri, Analitik (Panel, Aktivite, Coğrafi), analitik raporlar: rapor üretme ve dışa aktarma (Sipariş Analitiği sayfası `analytics:view` ister — doğrulanmadı) |
| `analytics:write` | Analitik rapor şablonu oluşturma (`/analytics/reports/templates/new`) ve silme |
| `reports:read` | Mali raporlar: Ödeme İşlemleri (`/reports/payments`), İade Özeti (`/reports/refunds`, ayrıca `orders:credit-memo:view`) |
| `marketplace:read` / `marketplace:write` | Pazar yeri: okuma = kanal durumu, kanal ürün listesi, kategori eşlemeleri, komisyon kuralları; yazma = ürün gönderimi, hazırlık kontrolü, komisyon kuralı kaydı. Menü öğeleri izin şartsız görünür |
| `settings:read` / `settings:write` | Ayarlar görüntüleme / kaydetme |
| `users:read` / `users:create` / `users:update` / `users:delete` | Admin kullanıcıları (ekranda pratikte `admin` veya `super_admin` rolü gerekir) |
| `content:read` | İçerik ve mağaza tasarımı ekranları |
| `content:write` | İçerik oluşturma/düzenleme; yayınlama butonları da bunu ister. URL yönlendirmelerinde sunucu tarafı yazma yetkisi; ekran ayrıca oluşturma için `content:create`, düzenleme ve aktif/pasif için `content:update` ister (silme `content:delete`) |
| `content:delete` | İçerik silme |
| `api-keys:read` / `:create` / `:delete` / `:update` | API anahtarları |
| `payment:subscription:read` / `:manage` | Abonelikler |
| `email:manage` | `/email-management` |
| `pricing:preview` | Fiyatlandırma raporu önizlemesi |
| `webhook_subscriptions:write` / `:delete` | Web kancası abonelikleri |
| `search:write` | Arama dizinini yeniden oluşturma |
| `domains:write` | Alan adı ekleme/doğrulama |

### 2.1 Pazarlama yetkileri (ekran bazında)

| Ekran | `marketing:view` | `marketing:create` | `marketing:update` | `marketing:delete` |
|---|---|---|---|---|
| Kampanyalar | liste, detay | oluştur (yoksa `/new` → liste) | düzenle, kopyala, yayınla (yoksa `/edit` → detay) | sil |
| Promosyonlar | yalnız liste | oluştur | **detay/düzenle**, Yayınla, Duraklat (yalnız `view` olan detayı açamaz → liste) | sil |
| Kuponlar | liste, detay, "Paylaş" | Yeni Kupon, Toplu üret, Kopyala | Düzenle | Sil |
| Değerlendirmeler | liste, detay (yoksa "erişim reddedildi") | yanıt yazmak (sunucu; `update` ile birlikte) | Onayla / Reddet / Bayrak, yanıt formu | — (silme yok) |
| Otomasyonlar | liste, düzenleyiciyi görüntüle | Yeni otomasyon (boş / şablondan) | kaydet, yayına al, duraklat, test | — (silme yok) |
| Meta (genel bakış, ayarlar, pixel) | görüntüle | — | bağla, kimlik bilgisi, reklam hesabı, pixel kaydı, test olayı | "Bağlantıyı Kes" butonu |
| Meta kitle / huni / deney / uyarı | liste, detay | oluştur, (huni) çoğalt | düzenle, yenile/senkronla, yayınla/duraklat/devam, başlat/durdur, etkin anahtarı | sil |

Yetkisi olmayan kullanıcı oluşturma/düzenleme URL'lerinde çoğunlukla "Yönlendiriliyor... / Redirecting..." görür ve
listeye döner.

Ekranlarda ayrıca şu yetki grupları da kullanılır (admin rolünde bulunur): `store-views:*`, `brands:*`,
`attributes:*`, `labels:*`, `branding:*`, `currencies:*`, `customer-groups:*`, `orders:cancel|refund|...`,
`payment:config:*`, `shipping:*`, `audit:*` (super_admin).

## 3. UI nasıl gizler / devre dışı bırakır?

| Yer | Davranış |
|---|---|
| Sidebar | Yetkisiz öğe **görünmez**; yetkiler yüklenirken sidebar boş (ağaç: `navigation.md`) |
| Butonlar / menü öğeleri | Yetki yoksa çoğunlukla **gizlenir**; bazı yerlerde devre dışı görünür |
| Sayfa | URL ile açılabilir ama veri/işlem sunucuda reddedilir. Bazı sayfalar (ör. `/marketing/reviews`, `/content/blog/comments`) içeriği gizler veya "erişim reddedildi" kartı gösterir |
| Admin geneli | Giriş yok → `/login`; rol yetersiz → `/unauthorized` |
| Sunucu yanıtı | Oturum yok → 401 `UNAUTHORIZED`; mağaza belirlenemedi → 403 `TENANT_REQUIRED`; yetki yok → 403 `FORBIDDEN` (gerekli yetkiyi belirtir) |
| Plan özellikleri | Plana bağlı ekranlar yükseltme kartı gösterir; ör. ikinci store view `multi_language` ister (`ERR_FEATURE_REQUIRED`) |

**Otomasyon çıkarımı:**
- Bir buton/menü görünmüyorsa önce yetki ihtimalini düşün; kullanıcıya "bu işlem için yetkiniz görünmüyor" de, URL'ye zorla gitme.
- Bir işlem 403 döndürürse (`browser_network_requests` → status 403, gövde `FORBIDDEN` / `Insufficient permissions`)
  bu **oturum düşmesi değil**; tekrar deneme, kullanıcıya bildir.
- Yetki kontrolü için ilk referans: kullanıcının sidebar'da gördükleri (bkz. `navigation.md`). Kesin liste
  kullanıcı bilgisindeki `permissions` (bkz. `environments-and-auth.md` §7).

## 4. Rol / kullanıcı yönetimi ekranları

- `/system-users` (`Sistem Kullanıcıları`/`System Users`, menü `Tüm Kullanıcılar`) — admin kullanıcıları; davet, düzenleme, askıya alma `admin` veya `super_admin` ([../screens/system/system-users.md](../screens/system/system-users.md)).
- `/system-users/roles` (`Roller`/`Roles`) — `admin`, `super_admin`, `security_admin` görür; oluştur/düzenle/sil yalnız `super_admin` ([../screens/system/roles.md](../screens/system/roles.md)).
- `/profile`, `/profile/sessions` — kendi profilin ve oturumların; yetki gerekmez ([../screens/system/profile.md](../screens/system/profile.md)).
- Kullanıcıya rol/izin atamak, API anahtarı oluşturmak **güvenlik açısından hassas** — kullanıcı açıkça istemedikçe yapma;
  API anahtarı / secret değerleri ekranda gösterilse bile okuma/raporlama.

## 5. Operatör (platform) vs merchant

| | Merchant (tenant admin) | Operatör (platform) |
|---|---|---|
| Ekranlar | Sidebar'daki tüm ekranlar | `/system`, `/tenants`, `/system/scheduled-jobs` |
| Menü | Sidebar | **Menüde yok**; yalnız URL. `/system` "Operatör konsolu" kartlarla diğerlerine link verir |
| Ek kimlik | — | **System Admin API anahtarı** (şifre alanı olan kart). Sayfa yenilenince yeniden istenir |
| Ne yapar | Kendi mağazası | Tenant oluşturma/listeleme/askıya alma (`/tenants`), e-posta gönderim hesabı, zamanlanmış işler |
| Ekran başlıkları | — | `Operatör konsolu`/`Operator console`, `Kiracı Yönetimi`/`Tenant Management`, `Zamanlanmış işler`/`Scheduled jobs`; anahtar kartı `Sistem Yönetimi`/`System Administration` |

Claude kuralı: Operatör ekranlarına yalnız kullanıcı açıkça isterse gir; anahtarı kullanıcı girer. Tenant oluşturma
ekranı tek seferlik yönetici kimlik bilgisi gösterir (`Yönetici bilgileri — yalnızca bir kez gösterilir`) — Claude bunu
okumaz/aktarmaz, kullanıcıya kendisinin kaydetmesini söyler. Faz 1 kapsamı dışında.
