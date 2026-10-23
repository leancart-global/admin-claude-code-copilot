# Meta A/B Deneyleri (liste, oluştur, detay)
- URL'ler:
  - {ADMIN_URL}/marketing/meta-ads/experiments — liste
  - {ADMIN_URL}/marketing/meta-ads/experiments/new — oluştur (detaydaki "Varyantları değiştirmek için çoğalt" formu
    önceki deneyin değerleriyle doldurarak açar)
  - {ADMIN_URL}/marketing/meta-ads/experiments/{id} — detay: yaşam döngüsü butonları, varyantlar, sonuçlar
- Ayrı düzenleme sayfası yok.
- Menü yolu: Pazarlama → Meta Reklamlar → "Deneyler" kartı → "Aç" ([meta-overview.md](meta-overview.md)).
- Sayfa başlıkları: "Deneyler / Experiments" ("Kreatif, hedef kitle, teklif veya yerleşim için A/B testleri çalıştırın
  ve neyin işe yaradığını öğrenin."), "Deney oluştur / Create experiment" ("Yeni bir A/B testi kurun. Deney başladıktan
  sonra varyantlar ve trafik dağılımı kilitlenir."), detayda deney adı.
- Amaç: Bir huni içinde 2–6 varyantı (kreatif, hedef kitle, teklif, yerleşim) karşılaştırmak; seçilen başarı metriğine
  göre istatistiksel anlamlılığı izlemek; kazananı ilan etmek.
- Entity: [../../../entities/meta-integration.md](../../../entities/meta-integration.md) → "Deney".
- Yetki: liste/detay `marketing:view`; oluştur `marketing:create`; Başlat, Duraklat, Devam ettir, Durdur, Şimdi analiz
  et, Kazananı ilan et `marketing:update`; sil `marketing:delete`.

## Ön koşullar ve bağımlılıklar
- En az bir **huni** ([funnels.md](funnels.md)); yoksa "Önce bir huni oluşturun — deneyler içinde çalışacak bir huniye
  ihtiyaç duyar."
- **Meta "Bağlı" mod**; manuel modda "Başlat"/"Devam ettir" kilitli ("Deney başlatmak için Meta hesabınızı bağlayın.").
- Anlamlı sonuç için hunide trafik/harcama olmalı (huni yayında).
- "Hedef kitle" türünde test için Meta kitleleri ([audiences.md](audiences.md)).

## Yerleşim
### Liste
1. Başlık + "Deney oluştur" (`experiments-create-cta`).
2. Filtre: "Deneylerde ara…", durum ("Tüm durumlar", Taslak, Çalışıyor, Duraklatıldı, Tamamlandı, Durduruldu).
3. Tablo: seçim, "Ad" (`experiment-row-link-{id}`), "Tür", "Metrik", "Durum", "Son güncelleme", "⋯".
4. Satır menüsü (duruma göre): "Detayları gör"; Taslak: **"Başlat"**; Çalışıyor: "Duraklat", "Şimdi analiz et",
   **"Durdur"**; Duraklatıldı: **"Devam ettir"**, **"Durdur"**; her zaman "Sil".
5. Toplu "Sil". Boş durum "Henüz deney yok" + "İlk deneyinizi oluşturun".

### Detay
- Üst: tür rozeti + yaşam döngüsü çubuğu (Taslak → Başlat; Çalışıyor → Duraklat, Durdur, Şimdi analiz et, Kazananı ilan
  et; Duraklatıldı → Devam ettir, Durdur; her durumda Sil). Kazananı ilan et, sonuç anlamlı olana kadar pasif (title
  "Kazanan ilan etmeden önce sonuçların güven eşiğine ulaşmasını bekleyin."). "Varyantları değiştirmek için çoğalt"
  (`experiment-detail-duplicate-to-edit`). Yardım satırları: "Trafik göndermeye başlamak için deneyi başlatın." vb.
- "Varyantlar" kartı: ad, "Kontrol"/"Kazanan" rozetleri, "Trafik payı: %n". "Her varyant ayrı bir kampanyadır. Deney
  başladıktan sonra varyantlar kilitlenir."
- Alanlar: Başarı metriği, Güven eşiği, Başlangıç tarihi, Gerçekten başladı, Bitiş tarihi, Oluşturuldu.
- **"Sonuçlar"** paneli: Varyant, Trafik payı, Örneklem büyüklüğü, Dönüşüm oranı, Yükselme, Güven aralığı, p-değeri;
  "Anlamlı / Anlamlı değil" rozeti. Veri yoksa "Henüz veri yok…", az veri "Henüz yeterli veri yok — minimum örnekleme
  ulaşana kadar…". Çalışan deneyde panel kendiliğinden yenilenir.

## Alanlar (Oluştur)
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Deney adı / Experiment name | Input | evet | ≤100 ("Devam etmek için bir deney adı girin.") | `#experiment-name`, `experiment-form-name` | Meta Reklam Yöneticisi'nde de görünür |
| Açıklama / Description | Textarea | hayır | ≤500 | `#experiment-description` | |
| Hipotez / Hypothesis | Textarea | hayır | ≤500 | `#experiment-hypothesis` | Detayda gösterilmez (doğrulanmadı) |
| Huni / Funnel | shadcn Select | evet | "Devam etmek için bir huni seçin." | `#experiment-funnel`, `experiment-form-funnel` | |
| Deney türü / Experiment type | shadcn Select | evet | Reklam kreatifi, Hedef kitle, Teklif, Yerleşim | `#experiment-type` | **Oluşturulduktan sonra değişmez** |
| Başarı metriği / Success metric | shadcn Select | evet | ROAS, CPA, CTR, Dönüşümler, Gelir, Tıklamalar | `#experiment-success-metric` | |
| Güven eşiği (%) / Confidence threshold (%) | number Input | evet | 80–99, varsayılan 95 | `#experiment-confidence` | |
| Başlangıç tarihi / Start date | date Input | evet | bugün | `#experiment-start-date` | |
| Trafik dağılımı / Traffic split | shadcn Select | evet | "Eşit dağılım (önerilen)" / "Manuel" | `#experiment-traffic-split` | Eşitte ağırlıklar otomatik (ör. 3 varyant 34/33/33) |
| Varyantlar → Varyant adı | Input (satır) | evet | ≤80, deney içinde benzersiz | `experiment-variant-name-{i}` | En az 2, en çok 6; ilk varyant kontrol |
| Varyantlar → Ağırlık (%) | number Input (satır) | Manuel'de | her biri ≥1, toplam 100 ("Varyant ağırlıkları toplamı %100 olmalı (şu an %n).") | `experiment-variant-weight-{i}` | Üstte "Toplam: %n" |
- "Varyant ekle" (`experiment-variant-add`), satır sonunda "{ad} varyantını sil" (`experiment-variant-remove-{i}`).
- Butonlar "İptal", "Deney oluştur". Kayıt **Taslak** oluşturur.

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Deney oluştur | Taslak deney kaydedilir, detaya gider | "Deney oluşturuldu." |
| **Başlat** / **Devam ettir** (diyalog yok) | Deney "Çalışıyor" olur; varyantlar ve dağılım kilitlenir; sonuç toplama başlar | "Deney başladı." |
| Duraklat (diyalog yok) | "Duraklatıldı"; toplanan sonuçlar korunur | "Deney duraklatıldı." |
| **Durdur** (diyalog yok) | "Durduruldu"; **devam ettirilemez**, kazanan ilan edilmez | "Deney durduruldu." |
| Şimdi analiz et | Sonuçlar yeniden hesaplanır | "Analiz tetiklendi. Sonuçlar kısa süre içinde yenilenecek." |
| Kazananı ilan et → diyalog "Kazananı ilan et" (varyant radyo listesi, "Önerilen" rozeti; "\"{name}\" kazanan olarak seçilsin mi? Tahmini yükselme %{lift}. Deney tamamlanmış olarak işaretlenecek.") → onayla | Deney "Tamamlandı" olur, kazanan işaretlenir | "Kazanan ilan edildi. Deney tamamlandı olarak işaretlendi." |
| Varyantları değiştirmek için çoğalt | Oluştur formu "{ad} (copy)" ve aynı huni/tür/metrik/varyantlarla açılır (henüz kayıt yok) | — |
| Sil → "Deneyi sil" ("…Bu işlem geri alınamaz.") → Sil | Deney kaldırılır | "Deney silindi." |

## Onay zamanlaması (kural 2/5/6)
- **"Başlat" / "Devam ettir" — Meta'daki reklam trafiğini ve harcamayı etkileyebilir.** Ekran metnine göre her varyant
  ayrı bir kampanyadır; başlatmanın Meta'da yeni harcama açıp açmadığı doğrulanmadı → **harcama başlatıyormuş gibi**
  davran: butonda diyalog yok, onay tıklamadan önce. Özet: ortam, deney adı, huni, tür, varyantlar + ağırlıklar,
  başarı metriği, güven eşiği, başlangıç tarihi; ve "başladıktan sonra varyant/dağılım değiştirilemez".
- **"Durdur" geri alınamaz** (devam ettirilemez) ve diyalog yok → ayrı onay; alternatif olarak "Duraklat"ı öner.
- **Kazananı ilan et** deneyi kalıcı olarak "Tamamlandı" yapar → seçilen varyant ve gösterilen yükselme ile ayrı onay.
  Kazananın huniye/bütçeye otomatik uygulanmadığını varsay (doğrulanmadı); kullanıcı uygulamak isterse huni ekranında
  ayrı iş olarak planla.
- Sil geri alınamaz → deney adı ve durumuyla ayrı onay; toplu silmede seçili kayıt sayısıyla.
- Duraklat, Şimdi analiz et, Oluştur: normal kısa özet + onay (analiz yalnız hesaplama; onay tek satır yeterli).

## Yan etkiler
- Sistem çalışan deneyleri saatlik değerlendirir; yeterli örneklem, asgari süre (varsayılan 7 gün) ve anlamlılık
  sağlanınca deney **kendiliğinden "Tamamlandı"** olabilir ve önerilen varyant kazanan olarak işaretlenir.
- Sonuçlar, deneyin bağlı olduğu huninin Meta metriklerinden beslenir; huni duraklatılırsa veri toplanmaz.

## Tuzaklar
- Deney düzenleme sayfası yok; başladıktan sonra varyant değiştirmek için "Varyantları değiştirmek için çoğalt" ile
  yeni deney kur.
- "Kazananı ilan et" sonuç anlamlı değilken pasiftir; kullanıcıyı beklemeye yönlendir.
- Manuel dağılımda ağırlıkların toplamı 100 olmalı; eşit dağılımda ağırlık alanlarını elle değiştirme.

## Doğrulama
1. Oluştur: toast + detayda durum "Taslak", varyant listesi ve trafik payları.
2. Başlat/Duraklat/Durdur: açıklamadaki durum ve "Gerçekten başladı"/"Bitiş tarihi".
3. Sonuçlar: panelde örneklem büyüklüğü ve "Anlamlı" rozeti; kazanan ilanından sonra "Kazanan" rozeti.
