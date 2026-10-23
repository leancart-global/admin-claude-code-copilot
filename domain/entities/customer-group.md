# Entity: Customer Group (müşteri grubu)

Müşterileri sınıflandırmak ve hedeflemek için adlandırılmış grup. Ürün formundaki **kademe fiyatı** satırında
"Müşteri Grubu / Customer Group" seçicisi bu grupları (yalnız aktif olanları) listeler; boş bırakılırsa kademe
"Tüm müşteri grupları"na uygulanır (doğrulanmadı: seçicinin bu ekrandaki grupları birebir gösterdiği canlıda kontrol
edilmeli). Sepette grup fiyatının uygulanması ayrıca [../screens/settings/taxes.md](../screens/settings/taxes.md)
→ "Sepette kademe fiyatlarını (müşteri grubu ve adet) uygula" anahtarına bağlıdır.

- Ekran: [../screens/customers/customer-groups.md](../screens/customers/customer-groups.md) (liste + diyaloglar).
- İlişkili: [customer.md](customer.md), [segment.md](segment.md), [product.md](product.md) (kademe fiyatı).

## Alanlar
| Alan | Tip | Zorunlu | Varsayılan | Kural |
|---|---|---|---|---|
| Grup Adı `name` | metin | evet | — | 1–100; **mağaza içinde benzersiz** (çakışmada oluşturma başarısız) |
| Açıklama `description` | metin | hayır | — | ≤500 |
| Grup Türü `type` | enum | evet | Özel | `behavioral` Davranışsal, `demographic` Demografik, `psychographic` Psikografik, `geographic` Coğrafi, `transactional` İşlemsel, `custom` Özel. **Oluşturduktan sonra değişmez** (düzenleme diyaloğunda seçilse de kaydedilmez) |
| Öncelik `priority` | sayı | hayır | 0 | 0–100; yüksek öncelikli grup çakışmada önce gelir |
| Renk `color` | hex | hayır | `#6366f1` | ≤7 karakter; yalnız arayüzde rozet rengi |
| Otomatik Grup `isAutomatic` | bool | — | kapalı | "Kriterlere göre müşterileri otomatik ata". Kriter tanımlama alanı bu ekranda yok |
| Aktif `isActive` | bool | — | açık | Pasif grup ürün kademe fiyatı seçicisinde listelenmez |
| Müşteri sayısı | sayı | — | sistem | yalnız görüntülenir |

## Kurallar
- Silme geri alınamaz ve gruptaki **tüm müşteri ilişkilerini kaldırır**. Bu grubu kullanan ürün kademe fiyatlarına
  etkisi doğrulanmadı → silmeden önce kullanıcıya sor.
- Otomatik gruplarda "Yeniden Oluştur" üyeliği kriterlere göre yeniden hesaplar.
- Admin arayüzünde müşteriyi gruba elle ekleme/çıkarma yok (bu sürüm).
- Yetki: ekran `customers:read`/`customers:write`; sunucu ayrıca `customer-groups:read|write|delete` ister.

## Segment ile farkı
| | Müşteri grubu | Segment |
|---|---|---|
| Amaç | Sınıflandırma, kademe/grup fiyatı | Pazarlama hedefleme (kampanya, promosyon, Meta kitlesi) |
| Üyelik | otomatik (kriter) ya da elle — elle atama arayüzü yok | Dinamik: kural; Statik: elle |
| Kural düzenleyici | yok | var ([segment.md](segment.md)) |
