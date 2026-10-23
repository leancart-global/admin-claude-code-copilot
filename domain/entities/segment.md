# Entity: Segment (müşteri segmenti)

Kurallarla (dinamik) ya da elle (statik) tanımlanan müşteri kümesi. Pazarlamada hedef kitle olarak kullanılır:
e-posta kampanyası, Meta (Facebook/Instagram) özel kitlesi. (Promosyonun segment kısıtı admin ekranından kurulamaz;
yalnız API ile.)

- Ekran: [../screens/customers/segments.md](../screens/customers/segments.md) (liste, oluştur, detay, düzenle).
- Playbook: [../../playbooks/segment-create.md](../../playbooks/segment-create.md).
- İlişkili: [customer.md](customer.md), [customer-group.md](customer-group.md).

## Enum'lar
| Enum | Değerler (tr / en) |
|---|---|
| Tür | `dynamic` Dinamik ("Kurallara göre otomatik güncellenir"), `static` Statik ("Manuel müşteri seçimi"), `behavioral` Davranışsal, `demographic` Demografik, `rfm` RFM Analizi. Statik dışındaki tüm türler kural kullanır |
| Durum | `inactive` Pasif, `building` Oluşturuluyor, `active` Aktif, `error` Hata |
| Bağlaç | `AND` VE, `OR` VEYA |
| Yenileme sıklığı | `hourly` Her saat, `daily` Günlük, `weekly` Haftalık, `monthly` Aylık |
| Operatörler | eşittir, eşit değildir, içerir, içermez, ile başlar, ile biter, büyüktür, büyük veya eşittir, küçüktür, küçük veya eşittir, arasındadır, içindedir, içinde değildir |

## Alanlar
| Alan | Zorunlu | Kural |
|---|---|---|
| Segment Adı | evet | ≤200 |
| Açıklama | hayır | ≤1000 |
| Tür | evet | varsayılan Dinamik; **oluşturduktan sonra değişmez** |
| Etiketler | hayır | ≤20 etiket, her biri ≤50 |
| Kural grupları | kural kullanan türlerde evet | ≤5 grup; her grupta **1–20 koşul**; gruplar ve koşullar VE/VEYA ile bağlanır |
| Koşul | — | Alan + operatör + değer ("arasındadır"da iki değer) |
| Otomatik yenileme | hayır | kapalı; açıksa sıklık seçilir |
| Durum (düzenleme) | — | Aktif / Pasif anahtarı |
| Üye sayısı, son oluşturma, metrikler | — | sistem |

## Yaşam döngüsü
1. **Oluştur** → segment **Pasif** ve **0 üyeli** kaydolur.
2. **Yeniden Oluştur / Rebuild** → kurallar o anki müşteri verisine uygulanır, üyeler yazılır, durum **Aktif** olur,
   "Son Oluşturma" güncellenir. Değerlendirilemeyen bir koşul varsa 422 "Segment contains a condition that cannot be
   evaluated" döner ve durum **Hata** olur.
3. Üyelik **son oluşturma anındaki** listedir; müşteri verisi değişince segment kendiliğinden güncellenmiş sayılmaz —
   güncel üyelik için yeniden oluştur (otomatik yenilemenin çalıştığı canlıda doğrulanmadı).
4. **Devre Dışı Bırak / Etkinleştir**, **Arşivle** (listeden düşer, geri alınabilir), **Sil** (geri alınamaz; tüm
   müşteri ilişkileri kaldırılır).
- Oluşturuluyor durumundayken düzenleme ve silme reddedilir (409 "Cannot modify/delete segment while it is building").

## Kurallarda kullanılabilecek alanlar (oluşturma ekranındaki liste)
| Grup | Alan (tr / en) | Değer tipi |
|---|---|---|
| Müşteri | E-posta / Email; Ad / First Name; Soyad / Last Name | metin |
| Müşteri | Toplam Sipariş; Toplam Harcama; Yaşam Boyu Değer (YBD); Ort. Sipariş Değeri | sayı |
| Müşteri | Müşteri Olduğu Tarih / Customer Since; Son Aktiflik / Last Active | tarih |
| Müşteri | Etiketler / Tags | liste (içerir/içermez/içindedir) |
| Müşteri | Yaşam Döngüsü Aşaması (Aday, Aktif, Risk Altında, Kaybedildi, Yeniden Aktif); VIP Mi?; Influencer Mı? | seçim / evet-hayır |
| Sipariş | Sipariş Durumu; Sipariş Tutarı; Sipariş Ürün Sayısı | — |
| Olay | Son Satın Alma; Son Ziyaret | tarih |
Her alanın değerlendirilebildiği canlıda önizleme veya yeniden oluşturma ile doğrulanmalı (doğrulanmadı).

## İlişkiler
| İlişki | Not |
|---|---|
| Segment → Kampanya | Kampanya hedeflemesi segment seçer; gönderimde segmentin **son oluşturulmuş** üyelerinden pazarlama iznine uygun ve geçerli e-postası olanlara gider ([../screens/marketing/campaigns.md](../screens/marketing/campaigns.md), [campaign.md](campaign.md)). Alıcılar gönderim anında hesaplanır |
| Segment → Promosyon | Promosyon segment(ler)e yalnız API ile kısıtlanabilir (admin ekranından kurulamaz); kısıtlıysa segmentte olmayan müşteri "müşteri uygun segmentte değil" hatası alır ([promotion.md](promotion.md)) |
| Segment → Meta kitlesi | Özel kitle segmentten oluşturulur ([../screens/marketing/meta/audiences.md](../screens/marketing/meta/audiences.md), [meta-integration.md](meta-integration.md)). **Kişisel veri:** oluşturma ve "Verileri yenile" üyelerin e-posta/telefon gibi tanımlayıcılarını Meta'ya gönderir; segment değişince kitle kendiliğinden güncellenmez |
| Segment → Müşteri detayı | Müşterinin "Genel Bakış" sekmesinde "Atanan Segmentler" rozetleri; tıklayınca segment detayına gider |
| Silme etkisi | Segmenti kullanan kampanya/promosyon/kitleye etkisi doğrulanmadı → silmeden önce kullanıcıya sor |
