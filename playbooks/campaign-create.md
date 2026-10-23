# Playbook: E-posta kampanyası oluştur / gönder / zamanla

Tetikleyiciler: "VIP segmentine indirim e-postası gönder", "yarın 10:00'da kampanya zamanla", "tüm müşterilere bülten
at", "Black Friday maili hazırla", "kampanyayı taslak olarak kaydet", "şu kampanyayı kopyala".
Harita: ../domain/screens/marketing/campaigns.md (alanlar, locator, onay zamanlaması), ../domain/entities/campaign.md
(kurallar, durumlar), segment: ../domain/screens/customers/segments.md, ../domain/entities/segment.md.
URL: `{ADMIN_URL}/marketing/campaigns/new`.
Otomatik, olayla tetiklenen akış isteniyorsa ("sepeti terk edene 1 saat sonra mail") bu playbook değil:
../domain/screens/marketing/workflows.md.

---

## 0. Kural hatırlatması
- **"Yayınla" gerçek müşterilere e-posta gönderir, geri alınamaz ve arayüzden durdurulamaz.** Ayrı, açık onay.
- "Taslak Kaydet" kalıcıdır ama gönderim yapmaz → ayrı onay. Kullanıcı açıkça "gönder/zamanla" demediyse **taslakta dur**.
- "Kopyala" diyalogsuz anında taslak oluşturur → tıklamadan önce onay.
- Segment "Yeniden Oluştur" ayrı ekranda ve ayrı onaylıdır.
- Prod'da test gönderimi için gerçek müşteri segmenti kullanma (kural 7).
- Metin üretilecekse (konu, önizleme metni) önce marka sesini oku: `config/local.json` → `tenantContext.brandVoice`,
  Branding; yoksa öner ve onay al (../domain/project/brand-voice.md).

## 1. İsteği çözümle → taslak alan listesi
| Bilgi | Form alanı | Zorunlu | Varsayılan (sorulmazsa) |
|---|---|---|---|
| Kampanya adı | Kampanya adı | evet | Öner: "{amaç} {ay yıl}" (ör. "VIP İndirim Ekim 2026"); listede aynı ad yok mu kontrol et |
| Hedef kitle | Hedef kitle | yayın için | — (sor). "VIP segmenti" → segment listesinde ada göre eşleştir; "tüm müşteriler" → "Tüm müşteriler" |
| Konu | E-posta konusu | yayın için | Marka sesiyle **öner**, onaylat (≤200) |
| Önizleme metni | Önizleme metni | hayır | Öner (≤200) ya da boş |
| Şablon | Şablon | yayın için | — (sor; listedeki adları göster). İndirim içeriği şablonun içindedir; bu ekranda düzenlenmez |
| Gönderen adı | Gönderen adı | önerilir | Mağaza/marka adı (Branding) — "varsayılan" diye işaretle |
| Gönderen e-postası | Gönderen e-postası | yayın için | — (sor; mağazanın gönderen adresi, ../domain/screens/settings/notifications.md) |
| Yanıt adresi | Yanıt adresi | hayır | boş |
| Zamanlama | Hemen gönder / Planla + tarih-saat | yayın için | Kullanıcı söylemediyse **sor**; varsayılan "Hemen" olarak bırakma |
| Öncelik | Öncelik | hayır | Normal |
| UTM | UTM Kampanya / Kaynak / Ortam | hayır | Öner: kampanya adının slug'ı / `newsletter` / `email` (kullanıcı isterse) |
| İndirim | — | — | Kampanya kendisi indirim tanımlamaz. Kupon kodu e-postada verilecekse önce promosyon + kupon (../domain/screens/marketing/promotions.md, ../domain/screens/marketing/coupons.md) ve kodun şablona eklenmesi gerekir → kullanıcıya sor |

Göreli zaman: "yarın 10:00" → bugünün tarihine göre mutlak tarih (ör. bugün 2026-10-23 → `2026-10-24T10:00`),
**mağaza saat diliminde**; özette saat dilimini yaz.

## 2. Bağımlılıkları çöz (salt okuma)
a. **Segment**: `{ADMIN_URL}/customers/segments` → ada göre ara ("VIP"). Detayını aç: Durum **Aktif** mi, "Toplam Müşteri",
   "Son Oluşturma" ne zaman?
   - Yoksa → [segment-create.md](segment-create.md) (ayrı onaylar: oluştur + yeniden oluştur).
   - Pasif / 0 üye / eski "Son Oluşturma" → "Yeniden Oluştur" öner (ayrı onay, anında), sonra sayıyı tekrar oku.
   - Kullanıcı birden çok segment istediyse: kampanya tek segment alır → birleşik yeni segment ya da ayrı kampanyalar; sor.
b. **Şablon**: `/marketing/campaigns/new` → Şablon Select'ini aç, seçenekleri oku (kalıcı değil). Liste boşsa dur:
   şablon e-posta yönetiminde hazırlanmalı (kapsam dışı) → kullanıcıya bildir.
c. **Ad benzersizliği**: `/marketing/campaigns` listesinde arama kutusuna adı yaz, sonuçları oku; listede gözle de kontrol
   et (aynı ad varsa farklı ad öner).
d. **E-posta gönderimi ayarlı mı**: ../domain/screens/settings/notifications.md → "E-posta Gönderimi" sekmesi (salt okuma).
   Ayarlı değilse kullanıcıya söyle.

## 3. Planı ve eksik bilgileri tek mesajda sor
Örnek:
> Plan: (1) "VIP Müşteriler" segmenti Aktif, 412 üye, son oluşturma 3 gün önce → yeniden oluşturmamı ister misiniz?
> (2) Kampanya "VIP İndirim Ekim 2026" — önce taslak, onayınızla yayın.
> Eksik: Hangi şablon (Liste: "VIP Teklif", "Bülten Genel")? Gönderen e-postası? Hemen mi, yoksa belirli bir saatte mi?
> Konu önerim: "Size özel %20 indirim — sadece bu hafta" — uygun mu?

## 4. Formu doldur (`/marketing/campaigns/new`)
Her karttan sonra `browser_snapshot` ile doğrula.
1. **Temel**: `#campaign-name`. Tür "E-posta" sabittir.
2. **İçerik**: `#campaign-subject` → `#campaign-preview` → Şablon: `#campaign-template` tetikleyicisine tıkla →
   `role=option` şablon adına tıkla → `#campaign-from-name` → `#campaign-from-email` → (isteğe bağlı) `#campaign-reply-to`.
3. **Hedef Kitle**: "Hedef kitle seç" combobox → panelde "Segment ara" kutusuna segment adını yaz → sonuç satırına
   tıkla (ya da en üstteki "Tüm müşteriler"). Seçili kartta ad + üye sayısı ve bilgi kutusunda "Hedef kitle: {n} kişi"
   görünmeli.
4. **Zamanlama**:
   - Hemen: `#send-now` seçili olduğunu doğrula.
   - Planla: `#send-later` tıkla → `#campaign-start-time` `fill('2026-10-24T10:00')` → alttaki mağaza saat dilimi
     notunu oku.
5. **Gelişmiş** (istenirse): "Gelişmiş" akordeonunu aç → `#campaign-priority` → `#utm-campaign`, `#utm-source`,
   `#utm-medium`. A/B testi kullanılamaz.
6. Snapshot: alan altında kırmızı hata metni var mı?

## 5a. Taslak — Özet → ONAY → "Taslak Kaydet"
| Alan | Değer | Kaynak |
|---|---|---|
| Ortam | prod / dev | config |
| Kampanya adı | VIP İndirim Ekim 2026 | önerildi, onaylandı |
| Konu / Önizleme | … | kullanıcı / öneri |
| Şablon | VIP Teklif | kullanıcı |
| Gönderen | {marka} <{adres}> (yanıt: —) | varsayılan / kullanıcı |
| Hedef kitle | Segment "VIP Müşteriler" — 412 üye (son oluşturma …) | segment detayı |
| Zamanlama (kayıtlı) | Hemen / 24.10.2026 10:00 (mağaza saati, {saat dilimi}) | kullanıcı |
| Not | Taslak müşteriye gitmez; düzenleme yalnız taslakta mümkündür | |

Açık evet → alt çubukta **"Taslak Kaydet"**. Toast "Taslak kaydedildi", detay sayfası açılır.
Sunucu hatası toast'ı çıkarsa (ör. ad çakışması, geçersiz e-posta) mesajı oku, düzelt; özet değiştiyse yeniden onay.

## 5b. Yayın — Özet → AYRI ONAY → "Yayınla"
Taslak detayında "Düzenle" ile forma dön (ya da 4. adımdaki formda kal). Özet tablosu 5a ile aynı + şu satırlar:

| Alan | Değer |
|---|---|
| **Gönderim** | **Hemen** / **24.10.2026 10:00 ({saat dilimi})** — onaydan sonra durdurulamaz |
| Alıcılar | "VIP Müşteriler" üyelerinden **pazarlama izni olan ve e-postası doğrulanmış** olanlar (≤412) |
| Yan etkiler | Gerçek e-posta gönderilir; abonelikten çıkış bağlantısı bulunur; istatistikler ~2 saat sonra |
| "Tüm müşteriler" seçildiyse | Tüm izinli müşteri tabanı → ayrıca "evet, tüm müşterilere" teyidi |

Açık "evet/onaylıyorum" → snapshot'ta zamanlama radyosunu ve tarihi son kez kontrol et → **"Yayınla"**.
- Form hatası ("Bir hedef kitle seç", "Şablon seç", "Gönderim tarihi gelecekte olmalı"…) → düzelt; tarih değiştiyse
  yeniden onay.
- `ERR_CAMPAIGN_AUDIENCE_REQUIRED` toast'ı → hedef kitle seçilmemiş; seç, yeniden onay.

## 6. Doğrula
1. Toast "Kampanya planlandı" → detay sayfası.
2. Başlıktaki durum rozeti: Planla'da "Gönderim … içinde" geri sayımı (Planlandı), Hemen'de kısa süre içinde
   "Gönderiliyor". Rozet Taslak'ta kaldıysa dur ve kullanıcıya bildir; tekrar Yayınla'ya basma.
3. Özet bölümü: konu, gönderen, "Planlanan gönderim" = beklenen tarih-saat.
4. Listede: Hedef Kitle sütununda segment adı, Planlanan Tarih.
5. Gönderimden ~2 saat sonra (kullanıcı isterse): KPI şeridi (Gönderilen, Açılma, Tıklanma, Gelir), Alıcılar sayısı.

## 7. Diğer istekler
- **Kopyala** ("geçen ayki kampanyayı tekrar gönder"): onay → detayda "Kopyala" → yeni "{ad} (kopya)" taslağının detayı
  açılır → "Düzenle" ile adı, konuyu, zamanlamayı güncelle → 5a/5b.
- **Planlanmış kampanyayı iptal/erteleme**: arayüzde yol yok. Kullanıcıya açıkça söyle; geçici yol önerme, API çağırma.
- **Sil**: yalnız Taslak / İptal (Tamamlandı'da buton yok). Ayrı onay; özette ad, durum.
- **SMS / push kampanyası**: bu sürümde kampanya kanalı yalnız e-posta → kullanıcıya bildir.
- **Test e-postası**: kampanya ekranında test gönderimi yok. Kullanıcı isterse yalnız kendi adresini içeren bir segmentle
  ayrı bir kampanya önerilebilir (prod'da önerme, kullanıcı karar versin).

## 8. Rapor
Kampanya linki (`{ADMIN_URL}/marketing/campaigns/{id}`), durum, zamanlama (mağaza saati), hedef segment + üye sayısı,
kullanılan şablon, kalan işler (ör. kupon kodu şablona eklenmedi, istatistikler ~2 saat sonra). Alıcı e-postalarını
rapora koyma.
