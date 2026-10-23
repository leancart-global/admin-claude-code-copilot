# Entity: CRM Deal (Fırsat / Anlaşma)

Bir müşteriyle yürüyen satış fırsatı: aşama, değer, para birimi, olasılık, ürün kalemleri, aktiviteler, notlar.
Arayüzde "Fırsat" ve "Anlaşma" aynı kayıt için kullanılır. Kazanılan fırsat **sipariş değildir**; sipariş, fatura,
ödeme veya stok hareketi oluşturmaz.

- Ekran: [../screens/customers/crm/deals.md](../screens/customers/crm/deals.md) (satış hattı, detay, düzenle).
- Playbook: [../../playbooks/crm-deal-create.md](../../playbooks/crm-deal-create.md).
- Plan özelliği: `crm` (Rise ve üstü). Yetkiler: `crm:deals:read|write|delete`.

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `title` | string | evet | — | 1–255 |
| `customerId` | string | evet | — | Müşteri detayındaki "Müşteri ID" |
| `assignedTo` | string | evet (API) | ekranda boşsa `unassigned` | Serbest metin |
| `assignedTeam` | string | hayır | — | ≤100 |
| `value` | sayı | evet | 0 | ≥0. Ürün kalemi varsa **ürün satırı toplamlarından** hesaplanır ve elle girilen değerin yerine geçer |
| `currency` | string (3) | — | **USD** | ISO kodu; oluşturma diyaloğunda alan yok, düzenlemede değiştirilir |
| `probability` | 0–100 | — | 10 | Aşamayla otomatik değişmez; kazanınca 100, kaybedince 0 |
| `stage` | enum | — | `lead` | `lead` Potansiyel, `qualified` Nitelendi, `proposal` Teklif, `negotiation` Müzakere, `on_hold` Beklemede, `closed_won` Kazanıldı, `closed_lost` Kaybedildi |
| `temperature` | enum | — | `warm` | `hot`, `warm`, `cold` — "Sıcak Anlaşmalar" görünümü `hot` + açık |
| `priority` | enum | — | `medium` | `low`, `medium`, `high`, `urgent` (ekrandan düzenlenmez) |
| `expectedCloseDate` | tarih | hayır | — | "Bu Ay Kapanan" görünümünü besler |
| gerçek kapanış | tarih | — | — | Kazan/kaybet anında yazılır; yeniden açınca temizlenir |
| kaybetme nedeni | string | — | — | Kaybet diyaloğundaki neden; yeniden açınca temizlenir |
| `description` | string | hayır | — | ≤5000 |
| `source`, `tags`, `budget`, `budgetStatus` (`confirmed`/`estimated`/`unknown`), `decisionTimeframe` (`immediate`/`this_month`/`this_quarter`/`this_year`), `decisionMakers`, `additionalContacts` (≤20), `competitorInfo` (≤1000), `painPoints`, `proposedSolution`, `nextSteps` (≤2000) | çeşitli | hayır | — | Detayda görünür; ekrandan düzenlenmez |
| `products` | liste | hayır | [] | En çok 100 satır. Satır: `productId` (zorunlu), `productName` (1–255, zorunlu), `sku` (≤100), `quantity` (≥1), `unitPrice` (≥0), `discount` % (0–100), `notes` (≤500). Satır toplamı = adet × birim fiyat − indirim |
| aktiviteler | liste | — | [] | Tür (`call`, `email`, `meeting`, `proposal`, `demo`, `negotiation`, `contract`), başlık (1–200), planlanan zaman (zorunlu), atanan, öncelik (`low`/`medium`/`high`), açıklama (≤2000); durum `pending` → `completed` (sonuçla) / `cancelled`. Tamamlanan iptal edilemez |
| notlar | liste | — | [] | En çok 100; aşama değişikliği, kazanma, kaybetme, yeniden açma otomatik not ekler |
| aşama geçmişi | liste | — | — | Her aşama değişikliği kaydedilir (salt okunur) |

Açık / kapalı: Kazanıldı ve Kaybedildi aşamaları fırsatı **kapatır** (istatistiklerden ve Sıcak / Bu Ay görünümlerinden
çıkar); diğer aşamalar açıktır.

## Yaşam döngüsü
`lead` ⇄ `qualified` ⇄ `proposal` ⇄ `negotiation` ⇄ `on_hold` (serbest geçiş, "Aşamaya Taşı" ile anında) →
Kazan (`closed_won`, %100) / Kaybet (`closed_lost`, %0) → Yeniden Aç (`lead`'e döner, durum açık). Düzenle
ekranından aşama doğrudan Kazanıldı/Kaybedildi yapılabilir (neden sorulmaz).

## Kurallar
- Zaten açık fırsat yeniden açılamaz ("Deal is already open", 400).
- Silme kalıcıdır; ürün, aktivite ve notlar birlikte gider.
- Ürün kalemi katalogdan bağımsızdır: katalog fiyatı/stoğu okunmaz, değişmez.
- Hiçbir işlem müşteriye bildirim göndermez.

## İlişkiler
| İlişki | Not |
|---|---|
| Fırsat → müşteri | `customerId` ([../screens/customers/customer-detail.md](../screens/customers/customer-detail.md)) |
| Fırsat → katalog ürünü | yalnız atıf (ürün ID/SKU metni); [product.md](product.md) |
| Görev → fırsat | görevde isteğe bağlı "Anlaşma ID" ([crm-task.md](crm-task.md)) |
| CRM kişisi | fırsat kişiye doğrudan bağlanmaz; aynı müşteri ID'si üzerinden ilişkilidir ([crm-contact.md](crm-contact.md)) |
