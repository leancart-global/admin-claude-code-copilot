# Domain haritası

Lean Cart admin panelinin, Claude'un tarayıcıda ekran kullanarak iş yapabilmesi için hazırlanmış **fonksiyonel**
haritası: ekranlar, alanlar, iş kuralları, kayıtlar arası ilişkiler ve kullanıcının gördüğü davranış. Kod yolu,
altyapı, iç veri modeli ve bug notu içermez (CLAUDE.md kural 8).

- Son senkron: kod tabanı `ffe83d857` (2026-10-22).
- URL'ler `{ADMIN_URL}/<path>` biçimindedir; locale öneki yoktur. Varsayılan arayüz dili `en`; dil, girişten sonra
  header'daki dil seçiciyle değiştirilir.
- Haritalar canlı UI'da henüz tam denenmedi. İlk kullanımlarda farklar `CHANGELOG.md`'ye.

## Katmanlar

| Katman | Yol | Soru |
|---|---|---|
| Proje | `project/environments-and-auth.md` | Hangi URL, giriş nasıl anlaşılır, tenant/rol nereden okunur? |
| | `project/navigation.md` | Menüde ne nerede, hangi yetkiyle? |
| | `project/ui-conventions.md` | Select, combobox, dialog, tablo, upload, toast nasıl sürülür? |
| | `project/screen-index.md` | Tüm ekranlar (190 route) tek tabloda |
| | `project/dependency-graph.md` | Ne neden önce var olmalı? |
| | `project/permissions.md` | Roller ve yetkiler |
| | `project/brand-voice.md` | Metin üretmeden önce marka sesi: nereden okunur, yoksa nasıl önerilir |
| Entity | `entities/*.md` | Alanlar, enum'lar, iş kuralları, silme kısıtları |
| | `entities/blog-post.md`, `form.md`, `media.md`, `store-view.md`, `currency.md`, `tax-class.md`, `shipping-carrier.md` | İçerik ve ayar varlıkları |
| | `entities/warehouse.md`, `stock.md`, `supplier.md`, `purchase-order.md`, `stock-transfer.md`, `cycle-count.md` | Envanter varlıkları |
| | `entities/order.md`, `subscription.md`, `invoice.md`, `customer.md`, `customer-group.md`, `segment.md`, `crm-*.md` | Sipariş, müşteri ve CRM varlıkları |
| | `entities/homepage.md`, `header.md`, `footer.md` | Vitrin yapısı: ana sayfa (Page), header + navigasyon menüsü, footer — alanlar, yaşam döngüsü, vitrine ne zaman yansır |
| | `entities/promotion.md`, `coupon.md`, `campaign.md`, `marketing-workflow.md`, `review.md`, `meta-integration.md` | Pazarlama varlıkları: promosyon → kupon, e-posta kampanyası, otomasyon, ürün değerlendirmesi, Meta (bağlantı, pixel, kitle, huni, deney, uyarı) |
| | `entities/url-redirect.md`, `marketplace-channel.md`, `report.md` | SEO yönlendirmesi, pazaryeri kanalı (eşleme, kanal ürünü, komisyon), rapor şablonu ve metrik tanımları |
| Ekran | `screens/<alan>/*.md` | Alan tablosu, aksiyonlar, tuzaklar, doğrulama |
| | `screens/marketing/`, `screens/marketing/meta/` | Pazarlama hub'ı, kampanya, promosyon, kupon (+ toplu), değerlendirme, otomasyon; Meta genel bakış, ayarlar/pixel, kitle, huni, deney, uyarı |
| | `screens/marketplace/`, `screens/seo/` | Pazar yeri genel bakış, kanal panosu, kategori eşleme, kanal ürünleri, bekleyenler; URL yönlendirmeleri |
| | `screens/dashboard/`, `screens/analytics/`, `screens/reports/` | Panel + Günlük Özet, header araması; analitik paneli, aktivite, coğrafi, rapor şablonları; mali rapor hub'ı, ödeme işlemleri, iade özeti |

## Ekran dosyası şablonu

```
# <Ekran adı>
- URL · Amaç · Yetki · Veri / API (işlevsel; yalnız public API)
## Ön koşullar ve bağımlılıklar
## Yerleşim
## Alanlar   | Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
## Aksiyonlar
## Yan etkiler
## Tuzaklar
## Doğrulama
```

"doğrulanmadı" ibaresi: kesinleştirilemedi, ilk canlı kullanımda kontrol edilip düzeltilmeli.

## Kapsam (faz)

| Faz | Alanlar | Durum |
|---|---|---|
| 1 — Onboarding | Proje katmanı (tümü), ürünler, attribute/attribute set, kategori, marka, tasarım/ana sayfa, içerik sayfaları, medya | tamam |
| 2 — İçerik ve ayarlar | Blog ve yorumlar, AI ile içerik (durum), formlar ve gönderimler, beden rehberi, medya (tamamlandı), tüm ayar ekranları (`screens/settings/settings-overview.md`) | tamam |
| 3 — Operasyon | Envanter (`screens/inventory/`), siparişler/abonelikler/faturalar (`screens/orders/`), müşteriler/gruplar/segmentler/CRM (`screens/customers/`), admin kullanıcıları/roller/profil (`screens/system/`) | tamam |
| 4 — Büyüme ve analiz | Pazarlama (`screens/marketing/`: kampanya, promosyon, kupon, değerlendirme, otomasyon; `screens/marketing/meta/`), SEO yönlendirmeleri (`screens/seo/`), pazar yeri (`screens/marketplace/`), panel ve arama (`screens/dashboard/`), analitik (`screens/analytics/`), mali raporlar (`screens/reports/`) | bu sürüm |

Kapsam dışı (geliştirme sürüyor): `/email-management`. Geliştirici sayfası `/components-playground` haritalanmaz.

## Güncelleme

Kod değiştiğinde kaynak repo salt okunur incelenir, etkilenen ekranların haritaları **yalnız fonksiyonel sonuçla**
güncellenir; bu dosyadaki son senkron commit'i ve `CHANGELOG.md` güncellenir.
Canlı kullanımda haritayla UI arasında fark görülürse de `CHANGELOG.md`'ye yazılır.
