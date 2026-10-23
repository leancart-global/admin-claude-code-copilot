# Entity: Subscription (Abonelik)

Müşterinin abonelik tipli bir ürünü düzenli aralıklarla otomatik ödemeyle satın alması. Abonelik, vitrinde abonelik
ürününün satın alınmasıyla ("kayıt siparişi") oluşur; her dönem sonunda yenileme denemesi yapılır ve başarılı her
yenileme yeni bir sipariş (kaynak "Abonelik") üretir. Admin panelinde abonelik **oluşturulmaz veya düzenlenmez**; yalnız
listelenir, dönem sonunda iptal ettirilir ya da yönetici iptali geri alınır.

- Ekran: [../screens/orders/subscriptions.md](../screens/orders/subscriptions.md).
- İlgili: [order.md](order.md) (kayıt ve yenileme siparişleri), [product.md](product.md) (`subscription` tipli ürün:
  aralık, dönem, deneme süresi).

## Alanlar (ekranda görünen)
| Alan | Not |
|---|---|
| Müşteri | Ad, e-posta; misafir aboneliklerde "Misafir" rozeti. İletişim bilgisi gösterilmiyorsa "İletişim bilgileri gösterilmiyor" |
| Ürün, adet | Ürün linki; adet >1 ise "× N" |
| Dönem başı tutar | Para birimiyle |
| Aralık | Günlük / Haftalık / Aylık / Yıllık × aralık sayısı ("Her 2 ayda bir") |
| Deneme süresi | "N günlük ücretsiz deneme içerir" |
| Mevcut dönem | başlangıç – bitiş |
| Sonraki deneme | Ödeme başarısızsa yeniden deneme zamanı |
| Deneme bitişi | Deneme süresindeyken |
| Dönem sonunda iptal | "Dönem sonunda iptal edilecek" rozeti |
| İptal tarihi / İptal eden | Müşteri · Yönetici · Sistem |
| Sona erme tarihi | Abonelik bittiğinde |
| Ödeme yöntemi | Yalnız maskeli kart "•••• 1234" ve son kullanma ay/yıl; kart bilgisi gösterilmiyorsa "Kart bilgisi gösterilmiyor" |
| Kayıt siparişi | Siparişe link |
| Yenileme geçmişi | Dönem, durum, deneme sayısı, sonraki yeniden deneme, hata, sipariş linki |

## Enum'lar
| Enum | Değerler |
|---|---|
| Durum | `trialing` Deneme · `active` Aktif · `past_due` Ödemesi gecikmiş · `canceled` İptal edildi · `expired` Süresi doldu |
| Son durumlar | `canceled`, `expired` — iptal/geri alma yapılamaz |
| Yenileme durumu | Bekliyor · Başarılı · Başarısız · Sonuç bilinmiyor |
| İptal eden | Müşteri · Yönetici · Sistem |
| Aralık | `daily`, `weekly`, `monthly`, `yearly` |

## Kurallar
| Kural | Hata kodu / mesaj |
|---|---|
| İptal **dönem sonunda** gerçekleşir: müşteri mevcut dönem bitene kadar erişimini korur, sonra faturalama durur ve abonelik sona erer | — |
| Zaten iptal planlanmış veya son durumdaki abonelik tekrar iptal edilemez | `ERR_SUBSCRIPTION_ALREADY_CANCELED` — "Bu abonelik zaten iptal edildi." |
| İptali yalnız iptali yapan taraf geri alabilir (yönetici iptalini yönetici, müşteri iptalini müşteri) | `ERR_SUBSCRIPTION_CANCELED_BY_OTHER_PARTY` — "Bu iptal müşteri tarafından yapıldı, bu yüzden yalnızca müşteri geri alabilir." |
| Geri alma yalnız dönem bitmeden | `ERR_SUBSCRIPTION_PERIOD_ENDED` — "Mevcut dönem zaten sona erdi, bu yüzden geri alınamaz." |
| İptali planlanmamış abonelikte geri alma | `ERR_SUBSCRIPTION_NOT_CANCEL_PENDING` |
| Başka yerden eşzamanlı değişiklik | "Bu abonelik az önce başka bir yerden değiştirildi — bilgiler yenileniyor." (sayfa yenilenir, işlem tekrar istenir) |
| Kayıt yok / erişim yok | `ERR_SUBSCRIPTION_NOT_FOUND` |

## İlişkiler
| İlişki | Not |
|---|---|
| Abonelik → müşteri | opsiyonel (misafir abonelik) — [../screens/customers/customer-detail.md](../screens/customers/customer-detail.md) |
| Abonelik → ürün | `subscription` tipli ürün |
| Abonelik → kayıt siparişi | 1 |
| Abonelik → yenileme siparişleri | 0..n; sipariş listesinde kaynak filtresi "Abonelik" |
