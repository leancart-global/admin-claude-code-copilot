# Entity: Marketing Workflow (otomasyon / iş akışı)

Bir müşteri olayıyla tetiklenen, bekleme + koşul + e-posta adımlarından oluşan sürekli çalışan otomatik akış.
Aktifken, tetikleyici olayı yaşayan her müşteri akışa girer ve adımlar o müşteri için sırayla çalışır.

- Ekran: [../screens/marketing/workflows.md](../screens/marketing/workflows.md) (liste + akış düzenleyici).
- İlişkili: [campaign.md](campaign.md) (tek seferlik gönderim), [customer.md](customer.md),
  gönderim kuralları [../screens/settings/notification-rules.md](../screens/settings/notification-rules.md).

## Enum'lar
| Enum | Değerler (tr / en) |
|---|---|
| Durum | `draft` Taslak, `active` Aktif, `paused` Duraklatıldı, `archived` Arşivlendi |
| Tetikleyici | `cart.abandoned` Müşteri sepetini terk ettiğinde; `order.placed` Bir sipariş geldiğinde; `customer.registered` Yeni müşteri kayıt olduğunda; `customer.inactive` Müşteri uzun süredir alışveriş yapmadığında; `inventory.back_in_stock` Beğenilen ürün stoğa geldiğinde; `inventory.price_drop` İzlenen ürünün fiyatı düştüğünde; `customer.birthday` Müşterinin doğum gününde |
| Adım türü | `wait` Bekle, `condition` Eğer / Değilse, `send` Gönder (e-posta) |
| Bekleme birimi | Dakika, Saat, Gün |
| Gönderim kanalı | E-posta (tek kanal) |

## Alanlar
| Alan | Zorunlu | Kural |
|---|---|---|
| Ad | evet | 1–120 |
| Açıklama | hayır | ≤500; iç not |
| Tetikleyici | evet | tek tetikleyici; eşik ayarları (min. sepet, gün sayısı, fiyat düşüş oranı) ekranda düzenlenmez — varsayılanlar: sepet 1 saat işlemsiz, 60 gün alışverişsiz, fiyat ≥%10 düşüş |
| Adımlar | evet (≥1) | Tetikleyiciden başlayarak hepsi bağlı; döngü yok |
| Bekle | — | süre ≥1 (dakika/saat/gün) |
| Eğer / Değilse | — | ifade ≤500 (ör. `cartTotal > 500`); "Evet" ve "Hayır" dalları; boş dal akışı bitirir |
| Gönder | — | e-posta şablonu **adı** (≤200, aktif bir şablonla birebir eşleşmeli); isteğe bağlı konu (≤200, token eklenebilir) |
| Adım adı | evet | ≤80 |
| Çalışma sayısı, son çalışma | sistem | |

## Yaşam döngüsü
1. **Oluştur** (boş ya da hazır şablondan) → **Taslak**; müşteriye etkisi yok.
2. **Kaydet** → yalnız Taslak / Duraklatıldı'da. Aktif akış düzenlenemez (`WORKFLOW_ACTIVE_UPDATE_FORBIDDEN`).
3. **Yayına al** (Taslak/Duraklatıldı → Aktif) → anında; yeni tetikleyici olaylar akışı başlatır.
4. **Duraklat** (Aktif → Duraklatıldı) → anında; yeni giriş olmaz.
5. **Arşivlendi** → yayına alınamaz (`WORKFLOW_ARCHIVED_CANNOT_ACTIVATE`); arayüzde arşivleme, silme ve kopyalama yok.
- Bulunamayan akış → `WORKFLOW_NOT_FOUND`.

## Kurallar
- Gönderimler pazarlama mesajıdır: 24 saatlik kanal / toplam limitleri ve sessiz saatler uygulanır; limit dolmuşsa
  o gönderim atlanır, akış devam eder.
- Eşleşen aktif e-posta şablonu yoksa ya da müşterinin e-postası yoksa o adımda e-posta gitmez, akış devam eder.
- Pazarlama izni süzgecinin otomasyon gönderimlerine uygulanması doğrulanmadı.
- Test çalıştırması tasarımda yönetici e-postasına gider ve analitiği etkilemez (doğrulanmadı).

## Hazır şablonlar
| Şablon | Tetikleyici | Adım sayısı |
|---|---|---|
| Sepet hatırlatma (3 mail) | Sepet terki | 6 (3 bekleme + 3 e-posta) |
| Hoş geldin serisi | Yeni kayıt | 6 (2 bekleme, 1 koşul, 3 e-posta) |
| 60 gün sonra geri kazanım | 60 gün alışverişsiz | 9 (2 bekleme, 3 koşul, 4 e-posta) |
Adım ayrıntısı: [../screens/marketing/workflows.md](../screens/marketing/workflows.md) → "Hazır şablonlar".

## İlişkiler
| İlişki | Not |
|---|---|
| Otomasyon → Müşteri | Tetikleyici olayı yaşayan müşteri akışa girer; e-postalar ona gider |
| Otomasyon → Sepet / Sipariş / Ürün | Tetikleyici kaynakları (sepet terki, sipariş, stok, fiyat) |
| Otomasyon → E-posta şablonu | Gönderim adımı şablonu adıyla çağırır (şablon yönetimi kapsam dışı) |
| Otomasyon → Gönderim kuralları | Sıklık limiti ve sessiz saatler ([../screens/settings/notification-rules.md](../screens/settings/notification-rules.md)) |
| Otomasyon → Kupon | Sepet/geri kazanım şablonları kupon teklifinden söz eder; kupon üretimi doğrulanmadı ([../screens/marketing/coupons.md](../screens/marketing/coupons.md)) |
| Otomasyon ↔ Bildirim şablonları | Mağazanın "Sepet hatırlatma" gibi hazır bildirimleri ([../screens/settings/notifications.md](../screens/settings/notifications.md)) ayrıdır; aynı amaçla ikisini birden açmak müşteriye çift e-posta gönderebilir (doğrulanmadı) |
