# Meta Reklamları — Genel Bakış ve Optimizasyon
- URL'ler:
  - {ADMIN_URL}/marketing/meta-ads — genel bakış (landing)
  - {ADMIN_URL}/marketing/meta-ads/optimization — optimizasyon kuralları (yer tutucu, "çok yakında")
- Menü yolu: Sol menü "Pazarlama / Marketing" → "Meta Reklamlar / Meta Ads"; ya da `/marketing` hub'ındaki Meta kartı →
  "Başla / Get Started" ([../marketing-overview.md](../marketing-overview.md)).
- Sayfa başlığı: "Meta Reklamları / Meta Ads"; açıklama "Facebook ve Instagram pixel ve kampanya yönetimi."
- Amaç: Meta (Facebook/Instagram) entegrasyonunun durumunu tek bakışta görmek (bağlantı modu, pixel, olay sayısı,
  eşleşme kalitesi, kitle/huni/uyarı sayıları) ve alt ekranlara geçmek. Bu ekranda kalıcı değişiklik yapılmaz.
- Entity: [../../../entities/meta-integration.md](../../../entities/meta-integration.md).
- Yetki: `marketing:view` (yoksa "Bu sayfayı görüntülemek için yetkiniz yok.").
- Alt ekranlar: [meta-settings.md](meta-settings.md) (bağlantı + Pixel/CAPI), [audiences.md](audiences.md),
  [funnels.md](funnels.md), [experiments.md](experiments.md), [alerts.md](alerts.md).

## Ön koşullar ve bağımlılıklar
- Yok (salt okunur). Kartların çoğu Meta bağlantısına göre kilitli/açık görünür; mod tanımı
  [../../../entities/meta-integration.md](../../../entities/meta-integration.md) → "Bağlantı modu".

## Yerleşim (`/marketing/meta-ads`)
1. **Pixel bandı** (sayfanın üstü):
   - Pixel kayıtlıysa yeşil: "Pixel bağlı: {pixelId} / Pixel connected: {pixelId}", "Pixel olayları izleniyor." +
     "Yönet / Manage" → `/marketing/meta-ads/pixel`. test id `meta-connection-banner-connected`.
   - Değilse sarı: "Pixel henüz yapılandırılmamış / Pixel not configured yet" + "Pixel Yapılandır / Configure Pixel".
     test id `meta-connection-banner-not-configured`.
2. **KPI şeridi** (6 kart): "Pixel durumu / Pixel status" (Aktif / Yapılandırılmamış), "Eşleşme kalitesi / Match
   quality" (`x.x / 10`), "Bugünkü olaylar / Events today" (son 24 saat tarayıcı + sunucu olayı), "Hedef kitleler /
   Audiences", "Funnel'lar / Funnels", "Aktif uyarılar / Active alerts". Veri yoksa "—".
   - **Manuel modda** pixel durumu dışındaki 5 kart kilitli görünür: "Meta bağlantısı gerekli / Meta connection
     required"; tıklamak `/marketing/meta/settings`'e götürür (aria-label "{label}: kilitli…", `data-locked="oauth"`;
     test id'ler `kpi-match-quality`, `kpi-today-events`, `kpi-audiences`, `kpi-funnels`, `kpi-alerts`).
3. **Hızlı Başlangıç / Quick Start** — 4 adım kartı:
   - "1. Pixel Yapılandır" → `/marketing/meta-ads/pixel` (pixel varsa "OK" rozeti ve "Yönet", yoksa "Başla").
     test id `quickstart-step-pixel`.
   - "2. Olayları İzle", "3. Hedef Kitle Oluştur", "4. Performans Raporları" — pasif, "Yakında / Coming soon" rozetli
     (`quickstart-step-events`, `-audience`, `-reports`).
4. **Bağlantı kartları** (yalnız `marketing:view` varsa) — üstte bilgi notu "Bu ekranlar yakında yeni tasarımla
   yenilenecek.": Funnel'lar, Hedef Kitleler, Deneyler, Uyarılar, Optimizasyon Kuralları, Ayarlar → "Aç / Open".
   test id `quickstart-legacy-<funnels|audiences|experiments|alerts|optimization|settings>`. Manuel modda ilk beşi
   kilitli kart olur (`…-locked`), "Meta'yı Bağla / Connect Meta" → `/marketing/meta/settings`.
5. Tüm veriler yüklenemezse kırmızı kutu "Veri yüklenemedi." + "Tekrar dene / Try again" (`meta-empty-state`).

## Optimizasyon (`/marketing/meta-ads/optimization`)
- Başlık "Optimizasyon Kuralları / Optimization Rules"; açıklama "Kampanya performansına göre bütçeleri ve aşama
  duraklatmalarını gerçek zamanlı otomatikleştirin."
- İçerik yalnız boş durum: "Optimizasyon kuralları — çok yakında / Optimization rules — coming soon" ve "O zamana kadar
  bütçeleri ve duraklatmaları her funnel içinden yönetebilirsiniz." (test id `meta-optimization-coming-soon`).
- Form, alan ve aksiyon yok. Bütçe/duraklatma işleri için [funnels.md](funnels.md).

## Alanlar
- Yok (iki ekran da salt okunur).

## Aksiyonlar
| Buton / kart | Ne olur | Toast |
|---|---|---|
| Pixel bandı "Yönet" / "Pixel Yapılandır" | `/marketing/meta-ads/pixel` açılır | — |
| Kilitli KPI kartı / kilitli bağlantı kartı | `/marketing/meta/settings` açılır | — |
| Bağlantı kartı "Aç" | İlgili liste ekranı açılır | — |
| Tekrar dene | Verileri yeniden ister | — |

## Onay zamanlaması (kural 2/5/6)
- Bu iki ekranda kalıcı değişiklik, Meta'ya yazma veya harcama başlatan aksiyon **yok**. Onay gerekmez.
- Buradan gidilen ekranlardaki dış sistem aksiyonları: **Meta'ya bağlanma / bağlantıyı kesme / reklam hesabı seçimi**
  ([meta-settings.md](meta-settings.md)), **müşteri verisinin Meta'ya gönderimi** ([audiences.md](audiences.md)),
  **kampanya yayınlama = reklam harcaması** ([funnels.md](funnels.md)).

## Yan etkiler
- Yok.

## Tuzaklar
- Pixel bandı yalnız pixel kaydına bakar; "Pixel bağlı" görünmesi Meta hesabının (OAuth) bağlı olduğu anlamına gelmez.
  Bağlantı modunu [meta-settings.md](meta-settings.md) ekranındaki üst banttan oku.
- "Hızlı Başlangıç" 2–4. adımları tıklanamaz; kitle oluşturmak için "Hedef Kitleler" bağlantı kartını kullan.
- Optimizasyon ekranında kural kurulamaz; kullanıcı "bütçe otomatik ölçeklensin" isterse bunun henüz ekranda olmadığını
  söyle.

## Doğrulama
- Snapshot'ta KPI kartlarının değerlerini oku; sayı isteyen soruda ("kaç kitlem var?") ilgili liste ekranını aç ve
  toplamı oradan doğrula.
