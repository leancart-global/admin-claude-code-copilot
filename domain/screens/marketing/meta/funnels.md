# Meta Reklam Hunileri (liste, oluştur, detay, düzenle)
- URL'ler:
  - {ADMIN_URL}/marketing/meta-ads/funnels — liste
  - {ADMIN_URL}/marketing/meta-ads/funnels/new — oluştur (önce şablon seçici, sonra form)
  - {ADMIN_URL}/marketing/meta-ads/funnels/{id} — detay (durum aksiyonları burada)
  - {ADMIN_URL}/marketing/meta-ads/funnels/{id}/edit — düzenle
- Menü yolu: Pazarlama → Meta Reklamlar → "Funnel'lar" kartı → "Aç" ([meta-overview.md](meta-overview.md)).
  Breadcrumb "Meta Reklamları › Huniler".
- Sayfa başlıkları: "Huniler / Funnels" ("Müşterileri farkındalıktan satın almaya taşıyan çok aşamalı reklam hunileri
  oluşturun."), "Huni oluştur / Create funnel", detayda huni adı (açıklamada durum), "Huniyi düzenle / Edit funnel".
- Amaç: Birden çok aşamalı (soğuk kitle → ilgili → sepet terk → müşteri …) Meta reklam hunisi tanımlamak, günlük bütçeyi
  aşamalara paylaştırmak ve **yayınlayarak Meta reklam hesabında gerçek kampanyalar açmak**; duraklatmak, devam
  ettirmek, çoğaltmak, silmek.
- Entity: [../../../entities/meta-integration.md](../../../entities/meta-integration.md) → "Huni".
- Yetki: liste/detay `marketing:view`; oluştur ve "Çoğalt" `marketing:create`; düzenle, "Yayınla", "Duraklat",
  "Devam ettir" `marketing:update`; sil (tekil/toplu) `marketing:delete`.
- **Ücretli dış işlem:** "Yayınla" ve "Devam ettir" Meta'da reklamları çalıştırır ve **reklam hesabından para harcar**.

## Ön koşullar ve bağımlılıklar
- **Meta "Bağlı" mod** (OAuth + reklam hesabı seçili) — [meta-settings.md](meta-settings.md). Oluşturma bile bağlantı
  ve reklam hesabı ister; manuel modda "Yayınla"/"Devam ettir" kilitli ("Hunileri yayınlamak için Meta hesabınızı
  bağlayın.").
- Reklamların yayınlanacağı Facebook sayfası Meta bağlantısında tanımlı olmalı (doğrulanmadı).
- Bütçe para birimi = seçili reklam hesabının para birimi. Şablonların asgari günlük bütçesi vardır.
- Pixel kurulu olmalı ki dönüşüm aşamaları ve metrikler anlamlı olsun ([meta-settings.md](meta-settings.md)).
- Aşama hedeflemesinde Meta kitleleri kullanılabilir ([audiences.md](audiences.md)).
- **Etkiledikleri:** deneyler bir huni içinde çalışır ([experiments.md](experiments.md)); uyarılar huni performansını
  izleyebilir ([alerts.md](alerts.md)).

## Yerleşim
### Liste (`/funnels`)
1. Başlık + "Huni oluştur / Create funnel" (`funnels-create-cta`).
2. Filtre: arama "Hunilerde ara…", durum Select ("Tüm durumlar", Taslak, Oluşturuluyor…, Aktif, Duraklatıldı,
   Tamamlandı, Hata).
3. Tablo: seçim kutusu, "Ad" (`funnel-row-link-{id}`), "Tür", "Durum" (rozet), "Son güncelleme", "⋯" ("İşlemler").
4. Satır menüsü (duruma göre): "Detayları gör", "Huniyi düzenle", **"Yayınla"** (Taslak/Tamamlandı), **"Duraklat"**
   (Aktif), **"Devam ettir"** (Duraklatıldı), "Çoğalt", "Sil". Manuel modda Yayınla/Devam ettir "Kilitli" görünür.
5. Toplu çubuk: "{n} seçili" + "Sil". Boş durum: "Henüz huni yok" + "İlk huninizi oluşturun".

### Oluştur (`/new`) — 2 adım
1. **Şablon seçici** "Bir başlangıç noktası seçin" (`funnel-template-picker`): her şablon kartında ad, "Önerilen"
   rozeti, "Aşamalar" sayısı, "Minimum bütçe: {tutar} / gün", "Şablonu kullan" (`funnel-template-pick-{id}`); ayrıca
   "Boş başla" (`funnel-template-pick-blank`, tek boş aşama). Şablonlar: Genel satış (min ~50/gün), Ürün lansmanı
   (~100/gün), Terk edilmiş sepet (~30/gün), Sezonluk indirim (~75/gün) — tutarlar reklam hesabı para biriminde.
2. **Form** (şablon aşamaları önceden dolu, her şey düzenlenebilir). Alt butonlar "İptal" ve "Huni oluştur".
   Kayıt **Taslak** huni oluşturur; Meta'ya henüz bir şey yazılmaz.

### Detay (`/{id}`)
- Üst satır: tür rozeti, durum rozeti; butonlar (yetki + duruma göre): "Huniyi düzenle" (`funnel-detail-edit`),
  **"Yayınla"**, **"Duraklat"** (`funnel-detail-pause`), **"Devam ettir"**, "Çoğalt" (`funnel-detail-duplicate`),
  "Sil" (`funnel-detail-delete`).
- "Aşamalar" kartı (salt okunur, `funnel-detail-stages-list`): aşama adı, "aşama türü • kampanya amacı", bütçe payı.
- Alanlar: "Günlük bütçe", "Oluşturuldu", "Yayınlandı", "Duraklatıldı".
- "Metrikler" paneli: Gösterimler, Dönüşümler, Harcama, ROAS ve "Aşama bazlı kayıp"; veri yoksa "Henüz metrik yok.
  Huni Meta'da çalıştığında dönüşüm kaybı ve ROAS burada görünecek."

### Düzenle (`/{id}/edit`)
- Aynı form; "Huni türü" kilitli metin, "Durum" salt okunur rozet ("Durum, huniyi yayınladığınızda, duraklattığınızda
  veya devam ettirdiğinizde değişir."), buton "Değişiklikleri kaydet".

## Alanlar
| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Genel | Huni adı / Funnel name | Input | evet | 2–100 ("Devam etmek için bir huni adı girin.") | `#funnel-name`, `funnel-form-name` | Meta Reklam Yöneticisi'nde de görünür |
| Genel | Açıklama / Description | Textarea | hayır | ≤500 | `#funnel-description`, `funnel-form-description` | |
| Genel | Huni türü / Funnel type | shadcn Select | evet | şablondan; Genel satış, Ürün lansmanı, Terk edilmiş sepet, Sezonluk indirim, Özel | `#funnel-type`, `funnel-form-type` | **Oluşturulduktan sonra değişmez** |
| Genel | Günlük bütçe / Daily budget | number Input | evet | ≥1 ("Günlük bütçe en az 1 olmalı."); şablon asgarisinin altı reddedilir | `#funnel-daily-budget`, `funnel-form-daily-budget` | "Tüm aşamalarda günlük harcama tutarı." Reklam hesabı para birimi |
| Aşamalar | (satır) Aşama adı / Stage name | Input | evet | ≤100, huni içinde benzersiz | `…-name` (satır test id'li) | En az 1, en çok 12 aşama |
| Aşamalar | Hunideki aşama / Stage in funnel | shadcn Select | evet | Soğuk hedef kitle, Farkında, Etkileşimli, İlgili, Değerlendiriyor, Niyet gösteren, Karşılaştıran, Müşteri, Sadık müşteri | `…-stage` | |
| Aşamalar | Kampanya amacı / Campaign objective | shadcn Select | evet | Marka farkındalığı, Trafik, Etkileşim, Potansiyel müşteri, Dönüşümler, Satışlar | `…-objective` | Yeni aşamada varsayılan Marka farkındalığı |
| Aşamalar | Bütçe payı (%) / Budget share (%) | number Input 0–100 | evet | üstte "Toplam: %{n} (%100'e ulaşmalı)" | `…-budget` | Her aşama Meta'da bir kampanya; günlük bütçenin bu yüzdesi o kampanyaya |
- Aşama satırları sürükle-bırak ile sıralanır (tutamak aria-label "{ad} aşamasını yeniden sıralamak için sürükleyin");
  "Aşama ekle" ve satır sonunda "{ad} aşamasını sil". Sürükleme zor olursa satırı silip doğru sırayla yeniden ekle.

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Huni oluştur | Taslak huni kaydedilir, detaya gider (Meta'ya yazmaz) | "Huni oluşturuldu." / "Huni oluşturulamadı…" |
| Değişiklikleri kaydet | Huni güncellenir, detaya döner | "Huni güncellendi." |
| **Yayınla / Activate** (diyalog yok) | Durum "Oluşturuluyor…" olur; **Meta reklam hesabında her aşama için kampanya + reklam seti + reklam açılır ve aktifleştirilir** (birkaç dakika). Başarılıysa Aktif, bir aşama bile başarısızsa Hata | "Huni yayınlandı. Meta'da kampanyalar oluşturuluyor." / "Huni yayına alınamadı…" |
| **Duraklat** (diyalog yok) | Meta'daki kampanyalar duraklatılır, harcama durur | "Huni duraklatıldı." |
| **Devam ettir** (diyalog yok) | Meta'daki kampanyalar yeniden aktifleşir, **harcama yeniden başlar** | "Huni yeniden başladı." |
| Çoğalt (diyalog yok) | Yeni Taslak kopya oluşturulur, kopyanın düzenleme sayfası açılır (Meta'ya yazmaz) | "Huni çoğaltıldı. Şimdi kopyayı düzenleyebilirsiniz." |
| Sil → "Huniyi sil" ("\"{name}\" hunisini silmek istediğinize emin misiniz? Meta'daki aktif kampanyalar duraklatılır. Bu işlem geri alınamaz.") → Sil | Huni kaldırılır; **Meta'daki kampanyaları da durdurulur/kaldırılır** | "Huni silindi." |
| Toplu Sil | Seçililer tek tek silinir | kısmi: "{başarılı}/{toplam} huni silindi…" |

## Onay zamanlaması (kural 2/5/6)
- **"Yayınla" = Meta reklam hesabına yazar ve harcama başlatır (ücretli).** Butonda onay diyaloğu yok; onay butona
  tıklamadan **önce** alınır. Özet: ortam, huni adı, reklam hesabı + para birimi, **günlük bütçe** ve aşama başına pay
  (tutar olarak), aşama sayısı = açılacak kampanya sayısı; reklamlar onaydan hemen sonra çalışmaya başlar. Prod'da test hunisi
  yayınlama.
- **"Devam ettir" harcamayı yeniden başlatır** → aynı özet + onay.
- **"Duraklat" Meta'ya yazar** (kampanyaları durdurur, harcamayı keser) — diyalogsuz; kısa özet + onay. Kullanıcı
  "reklamları durdur" dediyse bu doğru aksiyondur.
- **Silme geri alınamaz**, Meta'daki kampanyaları etkiler: huni adı + durumu (Aktif mi) ile ayrı onay; toplu silmede
  seçili kayıt sayısı ve aralarındaki aktif huni sayısıyla ayrı onay. Aktif huniyi silmeden önce duraklatmayı öner.
- Aktif hunide **günlük bütçe değişikliği** harcamayı değiştirir → eski/yeni bütçe ile onay; Meta'ya yansıdığını Meta
  Reklam Yöneticisi'nde kullanıcıya kontrol ettir (doğrulanmadı).
- Oluştur / Çoğalt yalnız Taslak üretir (Meta'ya yazmaz): normal özet + onay.

## Yan etkiler
- Yayınlama birkaç dakika sürer; durum "Oluşturuluyor…" → "Aktif" ya da "Hata". Hata durumunda bazı aşamaların
  kampanyaları Meta'da açılmış olabilir; kullanıcıya Meta Reklam Yöneticisi'ni kontrol etmesini söyle.
- Metrikler Meta'dan periyodik olarak gelir (saatler mertebesinde gecikme olabilir).
- Huni silinirse ona bağlı deneylerin sonuç toplaması durur (doğrulanmadı).

## Tuzaklar
- Yayınlanmış hunide tür ve aşamalar değiştirilemez; yalnız ad, açıklama ve günlük bütçe (formda takvim alanı yok; yayınlanan huni hemen çalışır). Aşama değişikliği için
  "Çoğalt" → kopyayı düzenle → kopyayı yayınla (her biri ayrı onay).
- Şablonun asgari günlük bütçesinin altı reddedilir; şablon kartındaki "Minimum bütçe"yi kullanıcıya göster.
- Bütçe payları toplamı %100 değilse form yine kaydedebilir; özetinde toplamı göster ve %100 olmasını öner.
- "Yayınla" yalnız Taslak hunide geçerlidir; Tamamlandı durumundaki huni için "Çoğalt" kullan.
- Bağlantı kesilirse aktif huniler Meta'da çalışmaya devam eder ama buradan duraklatılamaz ([meta-settings.md](meta-settings.md)).

## Doğrulama
1. Oluştur: toast + detayda durum "Taslak", aşamalar listesi ve günlük bütçe.
2. Yayınla: durum "Oluşturuluyor…" → sayfayı birkaç dakika sonra yenile → "Aktif" ve "Yayınlandı" tarihi. "Hata" ise
   dur, kullanıcıya bildir.
3. Duraklat/Devam ettir: durum rozeti ve "Duraklatıldı" tarihi.
4. Kullanıcıdan Meta Reklam Yöneticisi'nde kampanya adlarını ve durumlarını görmesini iste (Claude Meta'ya girmez).
