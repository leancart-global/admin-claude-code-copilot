# Entity: Campaign (pazarlama kampanyası)

Seçilen hedef kitleye tek seferlik gönderilen pazarlama mesajı. Admin arayüzü bu sürümde yalnız **e-posta**
kampanyası oluşturur.

- Ekran: [../screens/marketing/campaigns.md](../screens/marketing/campaigns.md) (liste, oluştur, detay, düzenle).
- Playbook: [../../playbooks/campaign-create.md](../../playbooks/campaign-create.md).
- İlişkili: [segment.md](segment.md), [customer.md](customer.md), otomatik akışlar için
  [marketing-workflow.md](marketing-workflow.md).

## Enum'lar
| Enum | Değerler (tr / en) |
|---|---|
| Durum | `draft` Taslak / Draft, `scheduled` Planlandı / Scheduled, `running` Gönderiliyor / Sending, `paused` Duraklatıldı / Paused, `completed` Tamamlandı / Completed, `cancelled` İptal / Cancelled, `failed` Başarısız / Failed |
| Tür | `email` E-posta (arayüzde oluşturulabilen tek tür); listede görülebilecek diğerleri: `sms` SMS, `push` Push, `multi_channel` Çok Kanallı, `abandoned_cart` Sepet Hatırlatma, `welcome_series` Karşılama Serisi, `promotional` Promosyon, `transactional` İşlem, `newsletter` Bülten, `re_engagement` Yeniden Kazanım |
| Öncelik | `low` Düşük, `normal` Normal (vars.), `high` Yüksek, `urgent` Acil |
| Zamanlama | Hemen gönder (vars.) / Planla (tarih-saat, mağaza saat dilimi) |

## Alanlar
| Alan | Zorunlu | Kural |
|---|---|---|
| Kampanya adı | evet (taslakta da) | ≤200; mağaza içinde **benzersiz** |
| Tür | evet | E-posta; **oluşturduktan sonra değişmez** |
| E-posta konusu | yayın için | ≤200 |
| Önizleme metni | hayır | ≤200 |
| Şablon | yayın için | E-posta yönetimindeki bir şablon (kapsam dışı ekran) |
| Gönderen adı | önerilir | ≤100 |
| Gönderen e-postası | yayın için | geçerli e-posta |
| Yanıt adresi | hayır | geçerli e-posta |
| Hedef kitle | yayın için | **tek** segment ya da "Tüm müşteriler" (pazarlama izni olan tüm müşteriler) |
| Zamanlama | yayın için | Hemen ya da gelecekte bir tarih-saat (mağaza saatine göre) |
| UTM kampanya / kaynak / ortam | hayır | serbest metin |
| A/B testi | — | bu sürümde kullanılamaz |
| İstatistikler | sistem | toplam alıcı, gönderilen, iletilen, açılan, tıklanan, dönüşen, geri dönen (bounce), abonelikten çıkan, gelir |
| Zaman çizelgesi | sistem | Oluşturuldu, Planlandı, Başladı, Duraklatıldı, Devam ettirildi, Tamamlandı, İptal edildi, Başarısız oldu |

## Yaşam döngüsü
```
Taslak ──Yayınla(Planla)──▶ Planlandı ──saat gelince──▶ Gönderiliyor ──▶ Tamamlandı
   │                           │  ╲                          │  ╲
   └──Yayınla(Hemen)──▶ Gönderiliyor   ╲─▶ İptal / Duraklatıldı   ╲─▶ Duraklatıldı / İptal / Başarısız
Duraklatıldı ──▶ Gönderiliyor / İptal      Başarısız ──▶ Taslak
```
- Tamamlandı ve İptal son durumlardır.
- Admin arayüzünde yalnız **Taslak → (Yayınla)** geçişi vardır; duraklat, devam ettir, iptal butonu yoktur.
- Düzenleme yalnız **Taslak**'ta (arayüz). Sunucu Duraklatıldı kampanyada da düzenlemeye izin verir.
- Silme: arayüzde Gönderiliyor ve Tamamlandı'da buton yok; sunucu yalnız Taslak, İptal ve Tamamlandı durumundaki
  kampanyayı siler ("Campaign cannot be deleted in {durum} status").
- Kopyalama her durumda "{ad} (kopya)" adlı yeni Taslak üretir.

## Kurallar
- Yayın/planlama hedef kitle ister → `ERR_CAMPAIGN_AUDIENCE_REQUIRED` ("Planlamadan önce bu kampanyanın kime
  gönderileceğini seçin.").
- Aynı adla ikinci kampanya → `Campaign name "{ad}" already exists`.
- Taslak ya da Duraklatıldı dışındaki kampanya düzenlenemez → `Campaign cannot be modified in {durum} status`.
- **Alıcı belirleme gönderim anında yapılır**: segmentin son oluşturulmuş üyeleri → yalnız **pazarlama e-postası izni**
  olan ve **e-postası doğrulanmış** müşteriler. Segmentteki üye sayısı alıcı sayısının üst sınırıdır.
- Planlanan saatten sonra gönderim yaklaşık 1 dakika içinde başlar; istatistikler gönderimden ~2 saat sonra görünür.
- Her e-postada abonelikten çıkış bağlantısı bulunur.

## İlişkiler
| İlişki | Not |
|---|---|
| Kampanya → Segment | Hedef kitle; tek segment ([segment.md](segment.md)). Segment yeniden oluşturulursa planlanmış kampanyanın alıcıları da değişir. Segmenti silmenin kampanyaya etkisi doğrulanmadı |
| Kampanya → Müşteri | Alıcılar; pazarlama izni müşteri kaydındaki iletişim tercihleri/onaylardan ([customer.md](customer.md)) |
| Kampanya → E-posta şablonu | İçerik; şablon yönetimi kapsam dışı |
| Kampanya → Gönderim kuralları | Sıklık limiti / sessiz saatlerin manuel kampanyaya uygulanması doğrulanmadı ([../screens/settings/notification-rules.md](../screens/settings/notification-rules.md)) |
| Kampanya → Sipariş | Gelir ve dönüşüm, kampanyaya atfedilen siparişlerden |
| Kampanya ↔ Otomasyon | Otomasyonlar olayla tetiklenen sürekli akışlardır; kampanya tek seferliktir ([marketing-workflow.md](marketing-workflow.md)) |
