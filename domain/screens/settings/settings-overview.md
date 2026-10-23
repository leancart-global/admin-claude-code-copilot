# Ayarlar — genel harita

- URL: {ADMIN_URL}/settings (hub). Header kullanıcı menüsü → "Mağaza Ayarları / Store Settings"; sol menüdeki
  "Ayarlar / Settings" grubu da buraya ve alt ekranlara bağlanır.
- Amaç: Bu dosya tüm ayar ekranlarının ne işe yaradığını, hangi yetkiyi istediğini, gizli alan içerip içermediğini ve
  nerede **tıklama = kayıt** olduğunu tek tabloda verir. Ayrıntı her ekranın kendi haritasındadır.
- Ayar ekranlarının çoğu **mağaza genelini** etkiler (fiyat yorumu, ödeme, kargo, vitrin dili, e-posta). Bir değişiklik
  tek bir kaydı değil tüm vitrini değiştirir; özetlerde "etki: tüm mağaza" satırı yazılır.

## Hub (`/settings`)
Başlık "Ayarlar / Settings"; açıklama "Mağaza, operasyon ve sistem erişim ayarlarını yapılandır / Configure your store,
operations, and system access". Üç bölüm, kartlar bu sırayla. Kartın tamamı tıklanabilir; ayrıca "Aç / Open" butonu var.

| # | Bölüm (tr / en) | Kart (tr / en) | Kart açıklaması (tr) | Hedef |
|---|---|---|---|---|
| 1 | Mağaza / Store | Genel / General | Mağaza adı, iletişim bilgileri ve temel tercihler | `/settings/general` |
| 2 | Mağaza / Store | Mağaza Görünümleri / Store Views | Dilleri ve bölgesel mağaza görünümlerini yönet | `/settings/store-views` |
| 3 | Mağaza / Store | Para Birimleri / Currencies | Kabul edilen para birimlerini ve kurları yapılandır | `/settings/currencies` |
| 4 | Mağaza / Store | E-Fatura / E-Invoice | Vergi uyumu için e-fatura sağlayıcını bağla | `/settings/einvoice` |
| 5 | Operasyonlar / Operations | Ödemeler / Payments | Iyzico, Stripe gibi ödeme sağlayıcılarını ayarla | `/settings/payments` |
| 6 | Operasyonlar / Operations | Kargo / Shipping | Kargo firmalarını ve teslimat seçeneklerini yapılandır | `/settings/shipping/carriers` |
| 7 | Operasyonlar / Operations | Vergi Sınıfları / Tax Classes | Ürünler ve bölgeler için vergi oranlarını tanımla | `/settings/tax-classes` |
| 8 | Operasyonlar / Operations | Pazaryeri / Marketplace | Trendyol, Amazon ve diğer pazaryerlerine bağlan | `/settings/marketplace` |
| 9 | Operasyonlar / Operations | Bildirimler / Notifications | Müşterilere gönderilen e-posta şablonlarını özelleştir | `/settings/notifications` |
| 10 | Sistem / System | API Anahtarları / API Keys | Üçüncü taraf entegrasyonlar için anahtar oluştur | `/settings/api-keys` |
| 11 | Sistem / System | Denetim Kaydı / Audit Log | Kimin ne zaman neyi değiştirdiğini izle (ekran başlığı "Denetim Günlüğü") | `/settings/audit-log` |
| 12 | Sistem / System | Çeviriler / Translations | Her dil için mağaza metinlerini düzenle | `/settings/translations` |

- Hub'da kartı **olmayan**, sol menüden açılan ekranlar: Vergiler, Web Kancaları, Arama Dizini, Alan Adları,
  Giriş / Sosyal Sağlayıcılar. Gönderim Kuralları ekranı Abonelikten Çıkma İçgörüleri ekranından açılır.
- Mağaza görünen adı Genel Ayarlar'da değil, Branding'dedir ([../design/branding.md](../design/branding.md)).
- `/settings/sessions` açılınca `/profile/sessions`'a (kişisel aktif oturumlar) yönlenir; hub'da kartı yok.

## Ekranlar

Sütunlar: **Gizli** = "Claude dokunmaz" alanı var (kullanıcı doldurur). **Anında kayıt** = onay dialog'u ya da
Kaydet butonu olmadan tıklamayla kaydolan kontroller; onay bunlara **dokunmadan önce** alınır (kural 6).
**Dış etki** = mağaza dışına istek/e-posta/fatura giden ya da geri alınamayan butonlar.

### Mağaza

| Ekran | Ne işe yarar | Yetki (oku / yaz) | Gizli | Anında kayıt | Dış etki | Harita |
|---|---|---|---|---|---|---|
| Genel | Vitrin/admin/medya adresleri, bölgesel biçim ve saat dilimi, stokta olmayan varyant davranışı, iletişim ve adres, bot ve form spam koruması, GA4 ve Google doğrulaması, değerlendirme kuralları, kurulum tercihleri; plan görüntüleme | `settings:read` / `settings:write` | **evet** (spam koruması anahtarları, ölçüm API secret'ı) | "Onay vermeyen ziyaretçileri say" anahtarı | "Yükseltme Talep Et", "Doğrula", "Kurulumu sıfırla" (geri alınamaz) | [general.md](general.md) |
| Mağaza Görünümleri | Vitrin dilleri, her dilin para birimi, varsayılan dil, dil başına URL kısa yolları, çerez politikası sayfası | `settings:read` / `products:write`; çerez kartı `content:update` | hayır | satır menüsünde Aktif/Pasif, "Varsayılan yap" | çerez politikası "önemli değişiklik" sorusu (tüm ziyaretçilerden yeniden onay ister — kullanıcıya sor) | [store-views.md](store-views.md) |
| Para Birimleri | Para birimleri, kurlar (manuel/TCMB), aktiflik, yeni ürünlerin varsayılan fiyatlandırma para birimi | `settings:read` / `products:write` | hayır | varsayılan fiyatlandırma seçimi, Etkinleştir/Devre Dışı Bırak | "Kurları Güncelle" | [currencies.md](currencies.md) |
| E-Fatura | Fatura modu (platform / muhasebe programı / manuel), e-Fatura sağlayıcısı, test/canlı ortam, otomatik fatura | `settings:read` / `settings:write` | **evet** | Aktif/Pasif Et, Varsayılan Yap | "Bağlantı Testi"; canlı ortam + otomatik fatura GİB'e gerçek fatura gönderir | [einvoice.md](einvoice.md) |

### Operasyonlar

| Ekran | Ne işe yarar | Yetki (oku / yaz) | Gizli | Anında kayıt | Dış etki | Harita |
|---|---|---|---|---|---|---|
| Ödemeler | Stripe, Iyzico, PayPal, PayTR kurulumu; test/canlı mod, varsayılan sağlayıcı, taksit, iade politikası | `payment:config:read` / `payment:config:write` | **evet** | Etkinleştir/Devre Dışı Bırak, Varsayılan Yap | "Bağlantı Testi", "Oranları Yenile"; canlı mod gerçek tahsilat | [payments.md](payments.md) |
| Kargo Taşıyıcıları | Taşıyıcı entegrasyonu ve checkout'ta görünen kargo seçenekleri/fiyatları: strateji, öncelik, fiyat kuralları, kapıda ödeme, varsayılan koli | `shipping:read` / `shipping:write` | **evet** | taşıyıcı aç/kapa, varsayılan, kaldır; fiyat kuralı Aktif ve silme; öncelik kaydet/varsayılanı yükle; varsayılan koli Kaydet/Temizle | "Bağlantı Testi", "Kontrol Et", bakiye "Yenile"; Otomatik Kargo gerçek gönderi oluşturur | [shipping-carriers.md](shipping-carriers.md) |
| Vergi Sınıfları | Ürünlere atanan KDV oranları ve varsayılan sınıf | `settings:read` / `products:write` | hayır | tablodaki "Aktif" anahtarı | — | [tax-classes.md](tax-classes.md) |
| Vergiler | Fiyatların KDV dahil mi girildiği, vitrinde KDV dahil gösterim, sepette kademe fiyatı | `settings:read` / `products:write` | hayır | — (Kaydet; etki tüm fiyatlar) | — | [taxes.md](taxes.md) |
| Pazaryeri | Trendyol, Amazon, Hepsiburada, N11, Çiçeksepeti satıcı hesabı bağlantısı; ortam, otomatik onay, senkron ve fiyat parametreleri | `settings:read` / `settings:write` | **evet** | — | "Bağlantı Testi"; canlı ortam ve otomatik onay gerçek siparişleri etkiler | [marketplace.md](marketplace.md) |
| Bildirimler | Otomatik e-posta/SMS şablonlarını aç/kapa ve düzenle; gönderen hesap ve adres | `settings:read` / `notification:update`, gönderim ayarı `settings:write` | **evet** (sağlayıcı kimlik bilgileri) | şablon durum anahtarı, gönderici modu, gönderen alan adı butonları | "Test Gönder" (gerçek e-posta) | [notifications.md](notifications.md) |
| Gönderim Kuralları | Pazarlama mesajı sınırları: 24 saat limiti, sessiz saatler, akıllı bastırma (işlemsel e-postalar etkilenmez) | `settings:read` / `notifications:write` | hayır | — | — | [notification-rules.md](notification-rules.md) |

### Sistem ve entegrasyon

| Ekran | Ne işe yarar | Yetki (oku / yaz) | Gizli | Anında kayıt | Dış etki | Harita |
|---|---|---|---|---|---|---|
| API Anahtarları | Dış entegrasyonlar için kapsamlı anahtar oluştur, iptal et, yeniden oluştur, sil | `api_keys:read` / `api_keys:write`, `api_keys:delete` | **evet** (değer bir kez gösterilir) | menüde "Etkinleştir" | anahtarı kullanan dış sistemler | [api-keys.md](api-keys.md) |
| Web Kancaları | Sipariş/ürün/envanter/müşteri olaylarını dış sisteme anlık bildiren abonelikler | `webhook_subscriptions:read` / `:write`, `:delete` | **evet** (imzalama anahtarı bir kez gösterilir) | satırdaki Aktif anahtarı | kayıt anında canlı gönderim başlar | [webhooks.md](webhooks.md) |
| Alan Adları | Özel alan adı ekle, DNS ile doğrula, sertifikayla vitrini o adreste yayına al | `domains:read` / `domains:write` | hayır (DNS kaydı kullanıcıda) | sertifika yöntemi kartları | "Doğrula", "Tekrar kontrol et", sertifika "Tekrar dene" | [domains.md](domains.md) |
| Giriş / Sosyal Sağlayıcılar | Vitrinde Google ve Facebook ile müşteri girişi | `settings:read` / `settings:write` | **evet** (OAuth secret) | — | vitrin giriş ekranı | [social-login.md](social-login.md) |
| Çeviriler | Vitrin arayüz metinlerini (buton, etiket, mesaj) mağazaya özel geçersiz kılma | `content:read` / `content:write` | hayır | — | "Önbelleği Temizle" vitrini hemen etkiler | [translations.md](translations.md) |
| Arama Dizini | Vitrin aramasının katalogla senkronunu göster; dizini yeniden oluştur | `search:read` / `search:write` | hayır | — | "Yeniden oluştur" (onay dialog'lu) | [search-index.md](search-index.md) |
| Denetim Günlüğü | Admin işlemleri ve güvenlik olayları (salt okunur, 90 gün) | `audit_log:read`; dışa aktarma `audit_log:export` | kişisel veri (IP) | salt okunur | dışa aktarma (dosya kullanıcıya iner; Claude okumaz) | [audit-log.md](audit-log.md) |

## Gizli alan kuralı (tüm ayar ekranları)
- Gizli alanlar (şifre, secret, API anahtarı, token, OAuth bilgisi, spam koruması anahtarı, sağlayıcı kimlik bilgisi)
  Claude tarafından okunmaz, yazılmaz, kopyalanmaz; ekran haritasındaki "Gizli alanlar — Claude dokunmaz" bölümüne bak.
  Kullanıcı bu alanları tarayıcıda kendisi doldurur; Claude yalnız gizli olmayan alanları onayla doldurur.
- Bir kez gösterilen değer (API anahtarı, webhook imzalama anahtarı) dialog'u açıkken snapshot alınmaz; kullanıcı
  değeri kendisi kopyalar ve dialog'u kapatır.
- Kayıtlı gizli değerler geri gösterilmez; boş bırakılan gizli alan mevcut değeri korur.

## Sıralama ve bağımlılıklar (özet)
- Para birimi → store view para birimi → ürün fiyatları. Store view'da kullanılan para birimi silinemez.
- Vergi sınıfı → ürün; Vergiler ekranı tüm fiyatların net/brüt yorumunu belirler. Varsayılan sınıf silinemez.
- Genel › iletişim/adres ve VKN → e-Fatura sağlayıcısı; mağaza adresi → bildirim test e-postaları.
- Genel › spam koruması kimlik bilgisi → spam korumalı formların yayınlanması (`../content/forms.md`).
- E-posta gönderimi kurulumu → bildirim şablonlarının gerçekten gönderilmesi.
- Kargo taşıyıcısı + ürün ağırlık/ölçüsü (veya varsayılan koli) → checkout kargo seçenekleri; seçenek yoksa sipariş
  tamamlanamaz.
- Ödeme sağlayıcısı (aktif) → checkout ödeme adımı; kapıda ödeme kargo ekranından açılır.
- Pazaryeri bağlantısı → Pazaryeri ekranlarında kategori eşleme ve ürün gönderimi.
- Ayrıntı: [../../project/dependency-graph.md](../../project/dependency-graph.md).
