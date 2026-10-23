# Entity: CRM Interaction (Etkileşim)

Bir müşteriyle yaşanmış temasın **kaydı** (arama, sohbet, destek talebi, e-posta açılması, sipariş, ödeme…).
Etkileşim kaydetmek müşteriye e-posta/SMS **göndermez**; yalnız geçmişe not düşer.

- Ekran: [../screens/customers/crm/interactions.md](../screens/customers/crm/interactions.md) (liste, salt okunur detay; menüde öğe yok).
- Plan özelliği: `crm` (Rise ve üstü). Yetkiler: `crm:interactions:read|write`.

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `customerId` | string | evet | — | Müşteri detayındaki "Müşteri ID" |
| `type` | enum | evet | (ekranda `phone_call`) | 32 tür: `website_visit`, `email_open`, `email_click`, `email_bounce`, `email_unsubscribe`, `sms_sent`, `sms_delivered`, `sms_failed`, `phone_call`, `chat_session`, `support_ticket`, `order_placed`, `order_updated`, `payment_completed`, `payment_failed`, `product_view`, `product_search`, `cart_add`, `cart_remove`, `cart_abandon`, `checkout_start`, `checkout_complete`, `review_submitted`, `survey_response`, `loyalty_earned`, `loyalty_redeemed`, `referral_made`, `social_share`, `api_call`, `mobile_app_open`, `push_notification`, `custom` |
| `channel` | enum | evet | (ekranda `phone`) | `website`, `mobile_app`, `email`, `sms`, `phone`, `chat`, `social_media`, `support`, `api`, `admin`, `system`, `third_party` |
| `subject` | string | hayır | — | ≤255 |
| `description` | string | hayır | — | ≤2000 |
| `priority` | enum | — | ekranda `medium` | `critical`, `high`, `medium`, `low`, `informational` |
| `isVisible` | bool | — | true | "Müşteriye görünür"; müşterinin nerede gördüğü doğrulanmadı |
| `isInternal` | bool | — | false | "Dahili not" |
| gerçekleşme zamanı | tarih | — | kayıt anı | Ekrandan seçilemez |
| bağlam, veri, analitik, ilişkili kayıt, etiket, özel alanlar | çeşitli | hayır | — | Genelde sistem kaynaklı kayıtlarda dolu; ekrandan girilmez |

## Kurallar
- Ekrandan yalnız oluşturulur; düzenleme ve silme ekranı yoktur.
- Mesaj göndermez, dış sisteme yazmaz.

## İlişkiler
| İlişki | Not |
|---|---|
| Etkileşim → müşteri | `customerId`; detaydan müşteri sayfasına bağlantı ([../screens/customers/customer-detail.md](../screens/customers/customer-detail.md)) |
| CRM kişisi | aynı müşteri ID'sine bağlı kişinin etkileşim istatistiklerini besler ([crm-contact.md](crm-contact.md)) |
