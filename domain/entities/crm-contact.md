# Entity: CRM Contact (CRM Kişisi)

Satış takibi yapılan kişi (potansiyel, aday, müşteri, partner, tedarikçi). Mağazanın **müşteri kaydından ayrı** bir
kayıttır ama her kişi bir müşteri kaydına bağlanır. Kişiden müşteri kaydına ya da müşteriden kişiye otomatik
dönüştürme/oluşturma yoktur.

- Ekran: [../screens/customers/crm/contacts.md](../screens/customers/crm/contacts.md) (liste, detay, düzenle).
- Plan özelliği: `crm` (Rise ve üstü). Yetkiler: `crm:contacts:read|write|delete`.

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `customerId` | string | evet | — | Mağazada mevcut ve silinmemiş müşteri kaydı olmalı (404). Müşteri detayındaki "Müşteri ID" |
| `email` | string | evet | — | Geçerli e-posta; küçük harfe çevrilir; mağaza içinde **benzersiz** (409) |
| `firstName`, `lastName` | string | evet | — | ≤100 |
| `middleName`, `displayName`, `salutation` | string | hayır | — | Hitap: Mr., Mrs., Ms., Dr., Prof. |
| `phone`, `alternatePhone` | string | hayır | — | ≤20 |
| `company`, `companyWebsite` | string | hayır | — | ≤200 / ≤255 |
| `professional` | nesne | hayır | — | Unvan, departman, sektör (≤100), şirket büyüklüğü (`startup`, `small`, `medium`, `large`, `enterprise`), karar verici (bool) |
| `dateOfBirth`, `gender` | tarih / string | hayır | — | Cinsiyet: `male`, `female`, `other`, `prefer_not_to_say` |
| `type` | enum | — | `lead` | `lead` Potansiyel, `prospect` Aday, `customer` Müşteri, `partner` Partner, `vendor` Tedarikçi, `inactive` Pasif |
| `leadStatus` | enum | — | `cold` | `cold`, `warm`, `hot`, `nurturing` (Geliştiriliyor), `closed_won`, `closed_lost` |
| `salesStage` | enum | — | `new` | `new`, `contacted`, `qualified`, `proposal`, `negotiation`, `closed` — fırsat aşamasından bağımsız |
| `status` | enum | — | `active` | `active`, `inactive`, `do_not_contact`, `bounced`, `unsubscribed` |
| `tags` | string[] | hayır | [] | ≤50 etiket |
| `source` | string | hayır | — | ≤100 (Web Sitesi, Referans, Etkinlik…) |
| `assignedTo`, `assignedTeam` | string | hayır | — | Serbest metin, ≤100 |
| `scores` | nesne | — | hepsi 0 | `leadScore`, `engagement`, `health`, `loyalty`, `satisfaction` (0–100). Ekrandan ilk üçü düzenlenir |
| `social` | nesne | hayır | — | linkedin, twitter, facebook, instagram |
| `isVip`, `isInfluencer`, `isPartner` | bool | — | false | VIP liste filtresi |
| `doNotContact` (+ `doNotContactReason`) | bool (+ string ≤255) | — | false | |
| notlar | liste | — | [] | Kategori (genel, arama, toplantı, e-posta, destek, satış) + içerik; en çok 100 |
| sıradaki takip | tarih + not | — | — | Tek açık takip; yeni planlama öncekinin yerine geçer; tamamlamak "son iletişim"i şimdi yapar |
| zaman tüneli | olay listesi | — | — | Oluşturma, güncelleme, not, takip olayları (salt okunur) |

## Kurallar
- E-posta benzersiz (oluşturma ve düzenlemede).
- Bağlı müşteri mevcut olmalı; müşteri silinmiş/bulunamıyorsa kişi oluşmaz.
- Silme kalıcıdır (geri alınamaz); notlar, takip ve zaman tüneli de gider.
- Kişi üzerindeki hiçbir işlem kişiye mesaj göndermez.

## İlişkiler
| İlişki | Not |
|---|---|
| Kişi → müşteri kaydı | zorunlu, `customerId` ile ([../screens/customers/customer-detail.md](../screens/customers/customer-detail.md)) |
| Fırsat, görev, etkileşim | kişiye değil müşteri ID'sine bağlanır ([crm-deal.md](crm-deal.md), [crm-task.md](crm-task.md), [crm-interaction.md](crm-interaction.md)); görev ayrıca kişiye bağlanabilir (ekrandan girilmez) |
| Müşteri GDPR silme/anonimleştirme | CRM kişisine etkisi doğrulanmadı; GDPR talebinde ayrıca ele al |
