# Meta Hedef Kitleleri (liste, oluştur, detay, düzenle)
- URL'ler:
  - {ADMIN_URL}/marketing/meta-ads/audiences — liste
  - {ADMIN_URL}/marketing/meta-ads/audiences/new — oluştur (`?type=custom` / `?type=lookalike` /
    `?type=value-based-lookalike` türü önceden seçer)
  - {ADMIN_URL}/marketing/meta-ads/audiences/{id} — detay
  - {ADMIN_URL}/marketing/meta-ads/audiences/{id}/edit — ad/açıklama düzenle
- Menü yolu: Pazarlama → Meta Reklamlar → "Hedef Kitleler" kartı → "Aç" ([meta-overview.md](meta-overview.md)).
  Breadcrumb: "Meta Reklamları › Hedef Kitleler".
- Sayfa başlıkları: "Hedef Kitleler / Audiences" ("Hassas hedefleme için özel ve benzer hedef kitleler oluşturun."),
  "Hedef kitle oluştur / Create audience", detayda kitle adı (açıklamada durum), "Hedef kitleyi düzenle / Edit audience".
- Amaç: Mağaza müşterilerinden Meta reklam hedeflemesi için **özel kitle** (bir müşteri segmentinden), **benzer kitle**
  (mevcut özel kitleden) veya **değer tabanlı benzer kitle** (en değerli müşterilerden) oluşturmak; kitleyi güncel
  müşteri verisiyle yenilemek, Meta'daki boyutunu çekmek, silmek.
- Entity: [../../../entities/meta-integration.md](../../../entities/meta-integration.md) → "Hedef kitle". Segment:
  [../../customers/segments.md](../../customers/segments.md), [../../../entities/segment.md](../../../entities/segment.md).
- Yetki: liste/detay `marketing:view`; oluştur `marketing:create`; Verileri yenile, Boyutu senkronla, düzenle
  `marketing:update`; sil (tekil/toplu) `marketing:delete`.
- **Kişisel veri:** özel ve değer tabanlı kitle oluşturma ve "Verileri yenile", müşterilerin kişisel tanımlayıcılarını
  (e-posta, telefon, müşteri numarası vb.; Meta'nın eşleştirme kuralı gereği karma/hash'lenmiş) **Meta'ya, yani mağaza
  dışındaki bir sisteme aktarır.** Benzer kitle müşteri verisi göndermez, Meta'daki kaynak kitleyi kullanır.

## Ön koşullar ve bağımlılıklar
- **Meta bağlantısı "Bağlı" modda** olmalı (OAuth + reklam hesabı seçili) — [meta-settings.md](meta-settings.md).
  Manuel/bağlı değil modda "Verileri yenile" ve "Boyutu senkronla" kilitli ("Kilitli", tooltip "Bu işlemi etkinleştirmek
  için Meta hesabınızı bağlayın."); oluşturma Meta'ya yazamadığı için başarısız olur.
- Özel kitle için en az bir **müşteri segmenti** (ve üyeleri hesaplanmış) — [../../customers/segments.md](../../customers/segments.md).
  Segment yoksa Select'te "Henüz müşteri segmentiniz yok. Önce Müşteriler → Segmentler altından bir tane oluşturun."
- Benzer kitle için en az bir **özel kitle** (Meta kitle ID'si oluşmuş). Yoksa "Önce özel hedef kitle oluşturun — benzer
  hedef kitleler için kaynak gerekir."
- Değer tabanlı benzer kitle için yeterli sayıda tekrar alışveriş yapmış müşteri gerekir (en az 100; doğrulanmadı).
- **Etkiledikleri:** huni aşamalarının hedeflemesi ([funnels.md](funnels.md)), "Hedef kitle" türündeki deneyler
  ([experiments.md](experiments.md)), genel bakıştaki "Hedef kitleler" sayısı.

## Yerleşim
### Liste (`/marketing/meta-ads/audiences`)
1. Başlık + sağda "Hedef kitle oluştur / Create audience" (`audiences-create-cta`, yalnız `marketing:create`).
2. Filtreler: arama "Bu sayfada ara… / Search this page…" (yalnız açık sayfadaki satırlarda arar), Tür Select ("Tüm
   türler", Özel, Benzer, Kaydedilmiş, Özel reklam).
3. Tablo: seçim kutusu, "Ad / Name" (detaya link, `audience-row-link-{id}`), "Tür / Type" (rozet), "Boyut / Size",
   "Son senkron / Last synced" (göreli zaman ya da "Hiç senkronlanmadı"), "Durum / Status", "⋯" (aria-label
   "İşlemler", `audience-row-actions-{id}`).
4. Satır menüsü: "Detayları gör", "Verileri yenile" (`audience-row-refresh-{id}`), "Boyutu senkronla"
   (`audience-row-sync-size-{id}`), ayraç, "Sil" (`audience-row-delete-{id}`).
5. Seçim yapılınca toplu çubuk: "{n} seçili" + "Sil" + "İptal".
6. Boş durum: hiç kitle **ve** hiç segment yoksa "İlk hedef kitlenizi 3 adımda kurun" kontrol listesi (1. Segment
   oluştur → `/customers/segments/new`, 2. Özel hedef kitle oluştur, 3. Benzer hedef kitle oluştur); aksi halde "Henüz
   hedef kitle yok" + "İlk hedef kitlenizi oluşturun".
7. Alt: "{n} sonuç", "Önceki / Sonraki", "Sayfa x / y".
- Durumlar: Bekliyor, Oluşturuluyor…, İşleniyor…, Hazır, Aktif, Güncelleniyor…, Hata, Silindi.

### Oluştur (`/new`)
- Kart "Hedef kitle bilgileri"; geri bağlantısı "Hedef kitlelere dön"; alt butonlar "İptal" ve "Hedef kitle oluştur".
- Önce **"Hedef kitle türü"** radyo grubu (`audience-type-radio`): "Özel / Custom" (Kendi müşteri verilerinizden
  oluşturun), "Benzer / Lookalike" (Mevcut bir hedef kitleye benzeyen yeni kişiler bulun), "Değer tabanlı benzer /
  Value-based lookalike" (En değerli müşterilerinize ağırlık verilen benzer hedef kitle). Tür değişince türe özgü alanlar
  sıfırlanır; ad/açıklama korunur.
- Form kirliyken sekmeyi kapatmak tarayıcı uyarısı verir ("Kaydedilmemiş değişiklikleriniz var…").

### Detay (`/{id}`)
- "Genel Bakış": Meta hedef kitle ID (yoksa "Meta provizyon bekleniyor"), Tür, Kaynak (Site ziyaretçileri, Müşteri
  listesi, Benzer …), Açıklama.
- "Metrikler": Boyut tahmini, Son senkron, Oluşturuldu.
- "İşlemler": "Hedef kitleyi düzenle" (`audience-detail-edit`), **"Verileri yenile"** (yalnız Özel kitlede,
  `audience-detail-refresh`), "Boyutu senkronla" (`audience-detail-sync-size`), "Sil" (`audience-detail-delete`).

### Düzenle (`/{id}/edit`)
- Yalnız "Ad" ve "Açıklama"; "Hedef kitleye dön", "İptal", "Değişiklikleri kaydet". Tür, kaynak, segment, ülke, oran
  sonradan değişmez (yeni kitle oluştur).

## Alanlar
### Oluştur
| Tür | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| hepsi | Hedef kitle türü / Audience type | RadioGroup | evet | "Özel" (ya da `?type=`) | `#audience-type-custom` / `-lookalike` / `-value-based-lookalike`, `audience-type-option-{tür}` | |
| hepsi | Ad / Name | Input | evet | 2–80 karakter ("Lütfen en az 2 karakter girin.", "Adı 80 karakter altında tutun.") | `#audience-name`, `audience-form-name` | "Bunu Meta Reklam Yöneticisi'nde de göreceksiniz." Mağazada benzersiz olmalı ("Bu isimde bir hedef kitle zaten mevcut…") |
| Özel, Benzer | Açıklama / Description | Textarea | hayır | ≤280 | `#audience-description`, `audience-form-description` | Değer tabanlı türde kaydedilmez (doğrulanmadı) |
| Özel | Kaynak müşteri segmenti / Source customer segment | shadcn Select | evet | "Devam etmek için bir müşteri segmenti seçin." | `#audience-source-segment`, `audience-form-source-segment` | "Bu segmentteki müşterileri hedef kitleyi oluşturmak için Meta'ya göndereceğiz." |
| Benzer | Kaynak hedef kitle / Source audience | shadcn Select | evet | yalnız Özel kitleler listelenir | `#audience-lookalike-source`, `audience-form-lookalike-source` | |
| Değer tabanlı | Değer kolonu / Value column | sabit metin | — | "Yaşam boyu değer (toplam harcama)" | `audience-form-value-column-static` | Seçilemez |
| Benzer, Değer tabanlı | Hedef ülke / Target country | aramalı combobox | evet | tek ülke; "Önerilen" ve "Tüm ülkeler" grupları; arama "Ülke ara…" | `#audience-lookalike-country`, `audience-form-lookalike-country` | Yaz → sonucu bekle → seçeneğe tıkla |
| Benzer, Değer tabanlı | Hedef kitle boyutu (ülke nüfusunun %'si) | Slider 1–10, adım 1 | evet | varsayılan %1 | `#audience-lookalike-ratio`, `audience-form-lookalike-ratio` | Küçük % = daha benzer, daha dar kitle. Slider'ı ok tuşlarıyla ayarla, ipucu "Şu anda hedef ülkenin %{n}'sine ayarlı." |

### Düzenle
| Label | Kontrol | Zorunlu | Validasyon | Locator |
|---|---|---|---|---|
| Ad / Name | Input | evet | 2–80 | `#edit-audience-name`, `audience-edit-name` |
| Açıklama / Description | Textarea | hayır | ≤280 | `audience-edit-description` |

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Oluştur → "Hedef kitle oluştur" (Özel) | **Meta reklam hesabında kitle oluşturulur ve segment üyelerinin tanımlayıcıları Meta'ya yüklenir**; detay sayfası açılır, durum İşleniyor → Aktif | "Hedef kitle oluşturuldu." / "Hedef kitle oluşturulamadı…" |
| Oluştur (Benzer) | Meta'da kaynak kitleden benzer kitle oluşturulur (müşteri verisi gönderilmez) | aynı |
| Oluştur (Değer tabanlı) | **Yüksek değerli müşteriler ve harcama değerleri Meta'ya yüklenerek "{ad} - Source" adlı ek bir özel kitle** ve ondan benzer kitle oluşturulur | aynı |
| **Verileri yenile** (yalnız Özel) | Kaynağın **güncel** müşteri listesi yeniden hesaplanıp Meta'daki kitle üyeliğinin **yerine** yüklenir | "Yenileme başlatıldı. Meta'nın hedef kitleyi güncellemesi birkaç dakika sürebilir." |
| Boyutu senkronla | Meta'dan yaklaşık kitle boyutu okunur (salt okunur, Meta'ya yazmaz) | "Boyut senkronu başlatıldı. Yeni tahmin birazdan görünecek." |
| Düzenle → Değişiklikleri kaydet | Ad/açıklama Lean Cart kaydında değişir (Meta'daki kitle adına yansıması doğrulanmadı) | "Hedef kitle güncellendi." |
| Sil → diyalog ("\"{name}\" hedef kitlesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.") → Sil | **Kitle Meta reklam hesabından da silinir** | "Hedef kitle silindi." |
| Toplu Sil → diyalog ("{n} hedef kitleyi silmek…") → Sil | Seçili her kitle tek tek silinir | tümü: "Hedef kitle silindi."; kısmi: "{başarılı}/{toplam} hedef kitle silindi…" |
- Hata toast'ları: "Meta oturumunuzun süresi doldu. Lütfen Meta hesabınızı yeniden bağlayın.", "Seçili müşteri
  segmentinde müşteri yok…", "Meta hız limiti aşıldı. Lütfen bir süre bekleyip tekrar deneyin.", "Bu isimde bir hedef
  kitle zaten mevcut…".

## Onay zamanlaması (kural 2/5/6)
- **Özel kitle oluşturma = kişisel verinin dış sisteme (Meta) aktarımı.** Kaydetmeden önce ayrı özet:
  ortam, kitle adı, kaynak segment adı ve **üye sayısı** (segment detayından), gönderilecek veri türü (e-posta/telefon
  gibi tanımlayıcılar), hedef Meta reklam hesabı. Ayrıca kullanıcıdan **segmentin yalnız pazarlama iletişimine / KVKK
  açık rızasına uygun müşterileri kapsadığını** teyit et; teyit yoksa önce segmente bu koşulu eklemesini öner
  ([../../customers/segments.md](../../customers/segments.md)) ve yapılana kadar oluşturma. Açık "evet" olmadan
  "Hedef kitle oluştur"a basma.
- **Değer tabanlı benzer kitle** aynı şekilde müşteri verisi + harcama değeri gönderir; aynı ayrı onay.
- **"Verileri yenile" de müşteri verisini Meta'ya yeniden gönderir** ve kitle üyeliğini değiştirir (bu kitleyi kullanan
  reklamların hedeflemesi değişir). Her yenilemede özet + onay.
- Benzer kitle oluşturma Meta'ya yazar (müşteri verisi göndermez); normal özet + onay.
- **Silme geri alınamaz ve Meta'dan da silinir;** bu kitleyi hedefleyen Meta reklam setleri hedeflemesiz kalabilir.
  Tekil silmede kitle adı + boyutu, toplu silmede **seçili kayıt sayısı** ile ayrı onay.
- "Boyutu senkronla" salt okunurdur; onay gerekmez.
- Düzenle (ad/açıklama) normal özet + onay.

## Yan etkiler
- Oluşturma/yenileme Meta tarafında işlenir; boyut ve durum birkaç dakika içinde güncellenir. Meta'nın gösterdiği boyut
  yüklenen müşteri sayısından küçük olabilir (eşleşmeyenler sayılmaz).
- Kitle üyeliği oluşturma/yenileme anındaki segment üyeliğidir; segment sonradan değişirse kitle otomatik güncellenmez,
  "Verileri yenile" gerekir (segmentte de önce "Yeniden Oluştur" — [../../customers/segments.md](../../customers/segments.md)).
- Değer tabanlı türde Meta'da ek bir "{ad} - Source" kitlesi oluşur.

## Tuzaklar
- Liste aramasını tüm kitlelerde arama sanma: yalnız açık sayfada arar; gerekirse sayfaları gez.
- Manuel modda "Verileri yenile" / "Boyutu senkronla" kilitlidir; önce tam bağlantı ([meta-settings.md](meta-settings.md)).
- Oluşturulan kitlenin türü, kaynağı, ülkesi ve oranı değiştirilemez; yanlışsa yeni kitle oluşturup eskisini (ayrı
  onayla) sil.
- Benzer kitle kaynağı Meta'da işlenmeden ("Meta provizyon bekleniyor") benzer kitle oluşturma başarısız olabilir;
  kaynağın "Aktif" olmasını bekle.
- Ülke combobox'ında seçim için Enter kullanma; seçeneğe tıkla.

## Doğrulama
1. Toast + detay sayfası: Tür, Kaynak, "Meta hedef kitle ID" dolu (oluşturmadan kısa süre sonra), durum Aktif/Hazır.
2. Birkaç dakika sonra "Boyutu senkronla" (onaysız, salt okunur) → "Boyut tahmini" ve "Son senkron".
3. Listede satır: ad, tür rozeti, boyut, son senkron.
4. Silmeden sonra kaydın listeden kalktığını ya da "Silindi" durumunda göründüğünü kontrol et (doğrulanmadı).
