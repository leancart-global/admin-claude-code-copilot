# Entity: CRM Task (CRM Görevi)

Satış/müşteri ekibi için yapılacak iş: tür, öncelik, son tarih, atanan kişi, isteğe bağlı müşteri/fırsat bağlantısı,
hatırlatıcılar ve yorumlar.

- Ekran: [../screens/customers/crm/tasks.md](../screens/customers/crm/tasks.md) (liste, detay + satır içi düzenleme).
- Plan özelliği: `crm` (Rise ve üstü). Yetkiler: `crm:tasks:read|write`.

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `title` | string | evet | — | 1–255 |
| `description` | string | hayır | — | ≤5000 |
| `type` | enum | evet | ekranda `follow_up` | `call`, `email`, `meeting`, `follow_up`, `demo`, `proposal`, `contract`, `onboarding`, `check_in`, `research`, `admin`, `other` |
| `priority` | enum | — | `medium` | `low`, `medium`, `high`, `urgent` |
| `status` | enum | — | `pending` | `pending` Bekliyor, `in_progress` Devam Ediyor, `completed`, `deferred` Ertelendi, `cancelled` |
| `dueDate` | tarih-saat | evet | — | Geçmişse ve görev açıksa "Gecikmiş" |
| `assignedTo` | string | evet | — | Serbest metin; "Görevlerim" giriş yapan kullanıcının kimliğiyle eşleşeni gösterir |
| `assignedTeam` | string | hayır | — | ≤100 |
| `customerId`, `dealId`, `contactId` | string | hayır | — | Detayda müşteri / fırsat / CRM kişisi sayfasına bağlantı. Ekrandan yalnız müşteri ve anlaşma ID'si girilir |
| `startDate`, `estimatedDuration`, `actualDuration` | | hayır | — | Detayda görünür |
| `tags`, `recurrence` (`none`, `daily`, `weekly`, `monthly`, `yearly`), bağımlılıklar, izleyenler, üst görev | | hayır | — | Detayda görünür; ekrandan düzenlenmez |
| hatırlatıcılar | liste | hayır | [] | Zaman (gelecekte olmalı) + yöntem: `email`, `sms`, `push`, `in_app`, `all`; "Gönderildi" işareti. Tamamlanmış/iptal edilmiş göreve eklenemez |
| yorumlar | liste | — | [] | İçerik + yazar; durum değişiklikleri de otomatik yorum olarak düşer |

## Yaşam döngüsü
`pending` → Tamamla → `completed` · Ertele (yeni vade) → `deferred` · İptal → `cancelled`.
`completed` / `cancelled` → Yeniden Aç → `pending`. Zaten tamamlanmış/iptal edilmiş görev iptal edilemez.

## Kurallar
- Silme kalıcıdır; hatırlatıcılar ve yorumlar da gider.
- Hatırlatıcı bildirimi müşteriye değil ekibe yöneliktir; teslimat doğrulanmadı.

## İlişkiler
| İlişki | Not |
|---|---|
| Görev → müşteri | isteğe bağlı müşteri ID ([../screens/customers/customer-detail.md](../screens/customers/customer-detail.md)) |
| Görev → fırsat | isteğe bağlı; fırsat detay URL'sindeki ID ([crm-deal.md](crm-deal.md)) |
| Görev → CRM kişisi | isteğe bağlı; ekrandan girilmez ([crm-contact.md](crm-contact.md)) |
