# Entity: Review (Ürün Değerlendirmesi)

Müşterinin bir ürüne bıraktığı 1–5 yıldızlı değerlendirme (başlık, metin, opsiyonel medya). Müşteri vitrinde oluşturur;
admin yalnız moderasyon (durum) ve mağaza yanıtı yönetir. Blog yorumları ayrı bir kayıttır ([blog-post.md](blog-post.md)).

- Ekran: [../screens/marketing/reviews.md](../screens/marketing/reviews.md) (liste + detay).
- Playbook: [../../playbooks/review-moderate.md](../../playbooks/review-moderate.md).
- Ayar: [../screens/settings/general.md](../screens/settings/general.md) → Değerlendirmeler sekmesi.

## Alanlar (admin'de görünen)

| Alan | Tip | Kim yazar | Kural / not |
|---|---|---|---|
| `productId` | ref → Ürün | müşteri | Admin'de ad değil ID görünür |
| `customerName`, `customerEmail`, `customerId` | string | müşteri | Kişisel veri |
| `rating` | 1–5 tam sayı | müşteri | |
| `title` | string ≤200 | müşteri | |
| `content` | string ≤5000 | müşteri | |
| `mediaUrls` | görsel/video listesi | müşteri | Detayda galeri |
| `status` | enum | sistem / admin | `pending` Bekliyor, `approved` Onaylandı, `rejected` Reddedildi, `flagged` Bayraklı |
| `verificationStatus` | enum | sistem | `unverified` Doğrulanmamış, `verified_purchase` Doğrulanmış satın alma, `verified_reviewer` Doğrulanmış kullanıcı |
| `orderId`, `purchaseDate` | — | sistem | Satın alma doğrulandıysa dolar |
| `helpfulVotes`, `notHelpfulVotes`, `reportedCount` | sayı | vitrin ziyaretçileri | Salt okunur |
| `isFeatured` | bool | — | "Öne çıkarıldı"; panelde değiştirilemez |
| `merchantResponse` | {içerik, yanıtlayan, zaman} | admin | Panelde 1–500 karakter (API 2000'e kadar kabul eder); panelde tek seferlik |
| `moderationNotes` | not listesi | admin | ≤1000 karakter/not; yalnız ekip görür; eklenir, silinmez |
| `moderatedBy`, `moderatedAt` | — | sistem | Son moderasyon işlemi |
| `language`, `deviceType`, `sentimentScore` | — | sistem | Bilgi amaçlı |

## Yaşam döngüsü

```
(müşteri gönderir) ─┬─ moderasyon kapalı ─────────────────────────────► approved
                    ├─ doğrulanmış alıcı + otomatik onay açık ────────► approved
                    └─ diğer ─────────────────────────────────────────► pending
pending  ──Onayla──► approved     pending ──Reddet──► rejected
herhangi ──Bayrak Ekle──► flagged ──Bayrağı Kaldır──► pending
approved ◄──Onayla── rejected / flagged      (her geçiş anında, diyalogsuz)
```

## Kurallar
- Vitrinde yalnız `approved` görünür; ürün sayfasındaki ortalama puan, sayı ve dağılım yalnız onaylılardan hesaplanır.
  Durum değişikliği vitrine genelde hemen, en geç ~1 dk içinde yansır.
- Bir müşteri bir ürüne tek değerlendirme bırakabilir (ikincisi reddedilir).
- "Satın alma zorunlu" ayarı açıksa satın almamış müşteri değerlendirme bırakamaz.
- Panelde oluşturma, düzenleme, silme ve toplu işlem yoktur.
- Moderasyon ve yanıt müşteriye bildirim göndermez (doğrulanmadı).
- Hata kodları (public): bulunamayan değerlendirme → `REVIEW_NOT_FOUND` (404).

## İlişkiler
| İlişki | Not |
|---|---|
| Ürün → değerlendirmeler | Ürünün "Değerlendirmeler" (allow reviews) işareti ([product.md](product.md)) |
| Sipariş → doğrulama | Satın alma doğrulanırsa sipariş ID'si bağlanır ([order.md](order.md)) |
| Müşteri | yazar ([customer.md](customer.md)) |
| Mağaza ayarı | moderasyon / otomatik onay / satın alma zorunlu ([../screens/settings/general.md](../screens/settings/general.md)) |
| Bildirim | teslimattan ~7 gün sonra otomatik "değerlendirme isteği" e-postası (bildirim tarafı) |
