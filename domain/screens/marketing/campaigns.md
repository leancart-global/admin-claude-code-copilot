# Kampanyalar (liste, oluştur, detay, düzenle)
- URL'ler:
  - {ADMIN_URL}/marketing/campaigns — liste (filtreler URL'de tutulur: `?search=&status=&type=&page=`)
  - {ADMIN_URL}/marketing/campaigns/new — oluştur
  - {ADMIN_URL}/marketing/campaigns/{id} — detay (istatistik + özet)
  - {ADMIN_URL}/marketing/campaigns/{id}/edit — düzenle (yalnız Taslak)
- Menü yolu: Sol menü "Pazarlama / Marketing" → "Kampanyalar / Campaigns"; ya da `/marketing` hub → "Kampanyalar" kartı
  ([marketing-overview.md](marketing-overview.md)).
- Sayfa başlıkları: liste "Kampanyalar / Campaigns" (+ toplam sayı rozeti), açıklama "E-posta kampanyalarını oluştur,
  planla ve performansını izle"; oluştur "Yeni Kampanya / New Campaign"; detay kampanya adı + durum rozeti; düzenle
  "Düzenle — {ad} / Edit — {name}".
- Amaç: Seçilen müşteri kitlesine (segment ya da tüm müşteriler) **e-posta kampanyası** hazırlamak, hemen ya da ileri
  bir tarihte göndermek ve gönderim sonrası performansı (gönderilen, açılma, tıklanma, gelir) izlemek.
- Entity: [../../entities/campaign.md](../../entities/campaign.md). Hedef kitle: [../../entities/segment.md](../../entities/segment.md).
  Playbook: [../../../playbooks/campaign-create.md](../../../playbooks/campaign-create.md).
- Yetki: liste/detay `marketing:view`; oluştur `marketing:create` (yetki yoksa `/new` listeye yönlendirir); düzenle,
  kopyala, yayınla `marketing:update` (yetki yoksa `/edit` detaya yönlendirir); sil `marketing:delete`.
- Kapsam dışı: e-posta şablonlarının içeriği/editörü (E-posta yönetimi — kapsam dışı). Kampanya formu yalnız var olan
  bir şablonu **seçer**.
- Kişisel veri: liste ve detayda alıcı adı/e-postası gösterilmez (alıcı listesi bu sürümde yok).

## Ön koşullar ve bağımlılıklar
- **Hedef kitle**: bir müşteri segmenti ([../customers/segments.md](../customers/segments.md)) ya da "Tüm müşteriler".
  Segment oluşturulduktan sonra **Pasif ve 0 üyelidir**; kampanyadan önce "Yeniden Oluştur" ile üyelik hesaplanmalı
  (segment haritası, Tuzaklar).
- **E-posta şablonu**: "Şablon" listesi e-posta yönetimindeki şablonlardan gelir (kapsam dışı ekran). Liste boşsa
  ("Veri yok") yayınlanamaz → kullanıcıya bildir.
- **E-posta gönderimi** mağaza düzeyinde ayarlı olmalı ([../settings/notifications.md](../settings/notifications.md) →
  "E-posta Gönderimi"); değilse e-postalar müşterilere ulaşmaz (doğrulanmadı: ekranın bunu uyardığı).
- **Pazarlama izni**: alıcılar gönderim anında süzülür — yalnız pazarlama e-postası izni açık ve e-postası doğrulanmış
  müşteriler alır. İzin müşteri detayındaki "İletişim Tercihleri → Pazarlama E-postaları" ve "Onay Durumu" ile ilişkilidir
  ([../customers/customer-detail.md](../customers/customer-detail.md)).
- **Mağaza saat dilimi**: "Gönderim tarihi ve saati" mağaza saatine göre yorumlanır
  ([../../project/ui-conventions.md](../../project/ui-conventions.md) → Tarih).
- Gönderim kuralları (24 saatlik pazarlama limiti, sessiz saatler): [../settings/notification-rules.md](../settings/notification-rules.md)
  (doğrulanmadı: manuel kampanyaları kapsayıp kapsamadığı).

## Liste (`/marketing/campaigns`)
### Yerleşim
- Kart başlığı "Kampanyalar" + sayı rozeti; sağda **"Yeni Kampanya / New Campaign"** (`marketing:create` varsa).
- Filtre çubuğu: arama (placeholder "Kampanya ara... / Search campaigns..."), Durum Select ("Tüm durumlar"), Tür Select
  ("Tüm türler"). Aktif filtre varsa "Aktif filtreler:" rozetleri + "Filtreleri temizle".
- Tablo sütunları: "Ad" (altında konu satırı; tıklanınca detay), "Tür" (rozet), "Durum" (renkli rozet; Planlandı'da
  geri sayım "Gönderim 2 saat içinde", Gönderiliyor'da "Gönderiliyor"), "Hedef Kitle" (ilk segment adı, birden çoksa
  "{ad} +{n}"; yoksa "Hedef kitle seçilmedi"), "Planlanan Tarih", "Açılma %", "⋯" (aria-label "İşlemler / Actions").
- ⋯ menüsü ("İşlemler / Actions"): "Görüntüle / View", "Kopyala / Duplicate" (`marketing:update`), "Sil / Delete" (`marketing:delete`; Gönderiliyor ve Tamamlandı'da pasif).
- Sayfalama: 20 kayıt/sayfa, en yeni güncellenen üstte; "Önceki" / "Sonraki".
- Boş durum: "İlk kampanyanı gönder" — "Müşterilerinize e-posta kampanyası göndererek satışlarını artır." + "Yeni Kampanya".
- Yükleme hatası: "Kampanyalar yüklenemedi" + "Yenile".

### Filtre değerleri
| Filtre | Seçenekler (tr / en) |
|---|---|
| Durum | Taslak / Draft, Planlandı / Scheduled, Gönderiliyor / Sending, Duraklatıldı / Paused, Tamamlandı / Completed, İptal / Cancelled, Başarısız / Failed |
| Tür | E-posta, SMS, Push, Çok Kanallı, Sepet Hatırlatma, Karşılama Serisi, Promosyon, İşlem, Bülten, Yeniden Kazanım (oluşturma ekranı yalnız **E-posta** üretir; diğerleri sistemin başka yollarla oluşturduğu kampanyalar için) |

## Oluştur (`/marketing/campaigns/new`) ve Düzenle (`/{id}/edit`)
### Yerleşim
- Üstte "← Kampanyalara dön" (oluştur) / "← Kampanyalar" (düzenle).
- Kartlar sırayla: **Temel Bilgiler** → **İçerik** → **Hedef Kitle** → **Zamanlama** → **Gelişmiş** (akordeon, kapalı gelir).
- Ekranın altına yapışık çubuk: solda KVKK bandı "Bu kampanya yalnızca pazarlama rızası olan müşterilere gönderilir.
  Rıza kontrolü gönderim aşamasında uygulanır."; sağda **"İptal"**, **"Taslak Kaydet / Save Draft"**, **"Yayınla / Publish"**.
- Mağaza saat dilimi yüklenene kadar "Taslak Kaydet" ve "Yayınla" pasiftir.
- Validasyon hataları alanın altında kırmızı metin olarak çıkar; sunucu hataları kırmızı toast.

### Alanlar
| Kart | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Temel | Kampanya adı * / Campaign name * | Input | evet (taslakta da) | ≤200; boşsa "Kampanya adı gerekli". Mağaza içinde **benzersiz** (çakışmada hata toast'u `Campaign name "…" already exists`) | `#campaign-name`, placeholder "Ör. Ramazan İndirimi" | |
| Temel | Tür / Type | salt okunur rozet "E-posta" | — | E-posta (sabit) | metin "Daha fazla kanal yakında: SMS, Push" | SMS/Push kanalı bu sürümde seçilemez. Tür kayıttan sonra değişmez |
| İçerik | E-posta konusu * / Email subject * | Input | yayın için | ≤200; "E-posta konusu gerekli" | `#campaign-subject` | Müşterinin gelen kutusunda görünen konu |
| İçerik | Önizleme metni / Preview text | Input | hayır | ≤200 | `#campaign-preview` | Gelen kutusunda konunun yanında görünen kısa metin |
| İçerik | Şablon / Template | shadcn Select (placeholder "Şablon seç") | yayın için | "Şablon seç" hatası | `#campaign-template` (tetikleyici) → `role=option` şablon adı | Liste e-posta yönetimindeki şablonlar; boşsa "Veri yok". Alt not: "Şablon önizlemesi yakında eklenecek" — içerik bu ekranda görülemez |
| İçerik | Gönderen adı * / From name * | Input | (yıldızlı) | ≤100 | `#campaign-from-name`, placeholder "Ör. Mağaza Adı" | Form boşken de yayınlamayı engellemez; kullanıcıdan iste (marka adı) |
| İçerik | Gönderen e-postası * / From email * | email Input | yayın için | "Gönderen e-postası gerekli", "Geçerli bir e-posta adresi gir" | `#campaign-from-email` | Mağazanın doğrulanmış gönderen alan adındaki bir adres olmalı ([../settings/notifications.md](../settings/notifications.md)) — doğrulanmadı |
| İçerik | Yanıt adresi / Reply-to | email Input | hayır | geçerli e-posta | `#campaign-reply-to` | Müşteri "Yanıtla" deyince giden adres |
| Hedef Kitle | Hedef kitle seç / Select audience | combobox (açılır panel + arama) | yayın için | "Bir hedef kitle seç" | buton metni "Hedef kitle seç" (`role=combobox`) → panelde arama "Segment ara" → seçenek | Panel: en üstte sabit **"Tüm müşteriler"** ("Pazarlama rızası olan tüm müşteriler"), ayraç, segmentler (ad, açıklama, **üye sayısı rozeti**), en altta "+ Yeni Segment Oluştur" (yeni sekmede segment oluşturucu). **Tek seçim**: bir kampanya tek segmente ya da tüm müşterilere gider |
| Hedef Kitle | (seçili kart) | kart + "Değiştir" + × | — | — | buton "Değiştir / Change"; × butonu (aria-label da "Değiştir") seçimi temizler | Seçimden sonra panel kapanır; kartta segment adı ve üye sayısı |
| Hedef Kitle | Hedef kitle bilgisi | bilgi kutusu | — | — | metin "Hedef kitle: {n} kişi. Rıza filtresi gönderim anında uygulanır." | {n} segmentin son oluşturmadaki üye sayısıdır; **gerçek alıcı sayısı** izinli ve doğrulanmış e-postalı üyelerle sınırlı olduğundan daha az olabilir. Seçim yoksa "Hedef kitle büyüklüğü: — kişi (rıza filtrelenmiş sayı gönderim anında gösterilir)" |
| Zamanlama | Hemen gönder / Send now | Radio | — | **seçili (varsayılan)** | `#send-now` | Yayınla'ya basınca gönderim hemen başlar |
| Zamanlama | Planla / Schedule | Radio | — | — | `#send-later` | Seçince tarih alanı açılır |
| Zamanlama | Gönderim tarihi ve saati * / Send date and time * | native `datetime-local` | Planla seçiliyse | "Gönderim tarihi gerekli", "Gönderim tarihi gelecekte olmalı" (mağaza saatine göre) | `#campaign-start-time`; `fill('2026-10-24T10:00')` | Altında mağaza saat dilimi notu. Gelecek kontrolü yalnız Yayınla'da yapılır |
| Gelişmiş | Öncelik / Priority | shadcn Select | — | Normal | `#campaign-priority` | Düşük / Normal / Yüksek / Acil |
| Gelişmiş | A/B testi / A/B test | Switch (pasif) | — | kapalı | `#ab-test` | Tooltip "A/B testi sonraki sürümde" — kullanılamaz |
| Gelişmiş | UTM Kampanya / UTM Campaign | Input | hayır | — | `#utm-campaign`, placeholder "ramazan-2026" | Analitikte trafik kaynağını ayırmak için |
| Gelişmiş | UTM Kaynak / UTM Source | Input | hayır | — | `#utm-source`, placeholder "newsletter" | |
| Gelişmiş | UTM Ortam / UTM Medium | Input | hayır | — | `#utm-medium`, placeholder "email" | |

### Taslak ve yayın kapıları
| Buton | Zorunlu alanlar (form) | Sonuç |
|---|---|---|
| Taslak Kaydet | Kampanya adı | Kayıt **Taslak** kalır, müşteriye bir şey gitmez. Toast "Taslak kaydedildi" (düzenlemede "Kampanya güncellendi") → detay sayfası |
| Yayınla | Ad, konu, şablon, gönderen e-postası (geçerli), hedef kitle, (Planla'da) gelecekteki tarih | Kampanya zamanlamasıyla kaydedilir ve gönderime alınır: "Hemen gönder"de hemen, "Planla"da seçilen saatte. Toast "Kampanya planlandı" → detay sayfası. Hedef kitle yoksa sunucu reddeder: "Planlamadan önce bu kampanyanın kime gönderileceğini seçin." (`ERR_CAMPAIGN_AUDIENCE_REQUIRED`) |
- Düzenleme yalnız **Taslak** kampanyada mümkündür (detaydaki "Düzenle" butonu yalnız Taslak'ta görünür); düzenleme
  ekranında Tür gösterilir ama değişmez.

## Detay (`/marketing/campaigns/{id}`)
### Yerleşim
- "← Kampanyalar"; başlık: ad + durum rozeti; altında "Oluşturulma: {tarih}", "Güncellenme: {tarih}".
- Sağ üst butonlar: **"Düzenle"** (yalnız Taslak, `marketing:update`), **"Kopyala"** (`marketing:update`), **"Sil"**
  (`marketing:delete`; Gönderiliyor ve Tamamlandı'da gizli).
- KPI şeridi: "Gönderilen", "Açılma oranı", "Tıklanma oranı", "Gelir" (mağaza para birimi). Planlandı / Gönderiliyor /
  Tamamlandı durumunda henüz iletim verisi yoksa yerine: "İstatistikler gönderimden yaklaşık 2 saat sonra görünür."
- Akordeon bölümler (ilk ikisi açık gelir):
  - **Performans**: huni çubukları "Gönderildi → İletildi → Açıldı → Tıklandı → Dönüştü"; sıfır değilse ayrıca
    "Döndürüldü" (bounce) ve "Abonelikten çıktı".
  - **Özet**: Segment (seçili segment sayısı "{n} alıcı" biçiminde — kişi sayısı değildir), Konu, Gönderen, Gönderen
    e-postası, Planlanan gönderim, Gönderim tarihi (Gönderiliyor/Tamamlandı'da).
  - **Zaman Çizelgesi**: Oluşturuldu, Planlandı, Başladı, Duraklatıldı, Devam ettirildi, Tamamlandı, İptal edildi,
    Başarısız oldu (+ tarih); boşsa "Henüz etkinlik yok."
  - **Alıcılar**: "{n} alıcı" (gönderim anındaki toplam alıcı) + pasif "Listeyi görüntüle" (tooltip "Alıcı listesi
    sonraki sürümde").
- Kayıt yoksa "Kampanya bulunamadı".

### İstatistik tanımları
| Gösterge | Anlamı |
|---|---|
| Gönderilen | E-posta sağlayıcısına başarıyla teslim edilen e-posta sayısı |
| Açılma oranı / Tıklanma oranı | Açan / tıklayan ÷ gönderilen (liste "Açılma %" sütunu da aynı) |
| Gelir | Kampanyaya atfedilen sipariş geliri |
| Dönüştü | Kampanya sonrası sipariş veren alıcı sayısı |

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Yeni Kampanya | `/marketing/campaigns/new` açılır | — |
| Taslak Kaydet | Taslak kaydolur (yeni ya da mevcut) | "Taslak kaydedildi" / "Kampanya güncellendi"; hata "Kampanya kaydedilemedi" ya da sunucu mesajı |
| **Yayınla** | Kampanya zamanlamasıyla kaydedilir; **müşterilere gönderim başlar/planlanır** | "Kampanya planlandı"; hedef kitle yoksa `ERR_CAMPAIGN_AUDIENCE_REQUIRED` mesajı |
| İptal (form) | Bir önceki sayfaya döner; kaydetmez | — |
| Kopyala (liste ⋯ / detay) | **Diyalogsuz, anında** "{ad} (kopya)" adlı yeni **Taslak** kampanya oluşur. Detaydan yapılırsa yeni kopyanın detayına gider; listeden yapılırsa listede kalır | "Kampanya kopyalandı" |
| Sil (liste ⋯ / detay) → "Kampanyayı sil" diyaloğu ("\"{ad}\" kampanyası silinecek. Bu işlem geri alınamaz.") → "Sil" | Kampanya listeden kaldırılır; detaydan yapıldıysa listeye döner | "Kampanya silindi"; hata "Kampanya silinemedi" (durum uygun değilse sunucu mesajı "Campaign cannot be deleted in {durum} status") |
| Görüntüle / satır adı | Detay açılır | — |
- Arayüzde **test e-postası gönderme**, **duraklatma**, **devam ettirme** ve **iptal etme** butonu yoktur. Planlanmış
  ya da gönderilmekte olan bir kampanya admin ekranından geri çekilemez ve düzenlenemez.

## Onay zamanlaması (kural 2/5/6)
- **"Yayınla" müşterilere e-posta gönderir ve geri alınamaz.** Özet + açık onay **tıklamadan önce**; özette mutlaka:
  ortam, kampanya adı, konu, şablon adı, gönderen adı/e-postası, hedef kitle (segment adı + segmentin üye sayısı +
  "yalnız pazarlama izni olan ve doğrulanmış e-postalı üyelere gider, gerçek alıcı sayısı daha az olabilir"),
  zamanlama (**Hemen** ya da mağaza saatine göre tarih-saat). "Hemen gönder" varsayılan seçili olduğundan, kullanıcı
  ileri tarih istediyse "Planla"nın seçili olduğunu snapshot'la doğrula.
- **"Tüm müşteriler"** seçimi tüm izinli müşteri tabanına gider → özette ayrıca vurgula ve ayrı teyit iste.
- Planlanmış kampanya arayüzden durdurulamaz; bu yüzden zamanlama onayı kesin olmalı.
- **Prod'da test kampanyası yayınlama** (kural 7): test için gerçek müşteri içeren segment kullanma; kullanıcı yalnız
  kendi adresini içeren statik/etiketli bir segment hazırlamadıysa test gönderimi önerme.
- **"Kopyala" diyalogsuz anında kayıt oluşturur** → tıklamadan önce onay ("{ad} (kopya)" adlı taslak oluşacak).
- **"Taslak Kaydet"** kalıcıdır ama müşteriye bir şey gitmez → normal özet + onay.
- **Sil**: geri alınamaz, tek tek ayrı onay; özette ad, durum ve (varsa) gönderim istatistiklerinin de kaybolacağı.
- Segmentin "Yeniden Oluştur"u ayrı ekranda ve ayrı onaylıdır ([../customers/segments.md](../customers/segments.md));
  kampanya özetinde segmentin "Son Oluşturma" zamanını belirt.

## Yan etkiler
- Gönderim, mağaza e-posta sağlayıcısı üzerinden gerçek e-posta yollar (dış sistem). Planlanan saat geldikten sonra
  gönderim yaklaşık 1 dakika içinde başlar; büyük kitlelerde tüm alıcılara ulaşması zaman alır. Durum "Gönderiliyor"
  rozetini gösterir.
- Alıcılar gönderim anında hesaplanır: segmentin **son oluşturulmuş** üyeleri → pazarlama izni olanlar ve e-postası
  doğrulanmış olanlar. Segment sonradan yeniden oluşturulursa planlanmış kampanyanın kitlesi de değişir.
- Her pazarlama e-postasında tek tıkla abonelikten çıkış bağlantısı bulunur; çıkanlar "Abonelikten çıktı" sayısına
  yansır ve sonraki kampanyalarda alıcı olmaz ([../settings/notification-rules.md](../settings/notification-rules.md)).
- İstatistikler gönderimden yaklaşık 2 saat sonra dolmaya başlar.
- Kopyalanan kampanya taslak olarak gelir; zamanlaması ve istatistikleri taşınmaz (doğrulanmadı).

## Tuzaklar
- **Zamanlama varsayılanı "Hemen gönder"**: "yarın 10:00" istenirse önce "Planla" radyosunu seç, sonra tarihi gir.
- Tarih-saat **mağaza saat diliminde** yorumlanır, tarayıcı saatinde değil; alt nottaki saat dilimini özette yaz.
- Hedef kitle tek seçimlidir; "VIP ve Sadık müşteriler" gibi iki segment istenirse ya iki kampanya ya da iki kuralı
  birleştiren yeni bir segment gerekir → kullanıcıya sor.
- Segment listesinde Pasif / 0 üyeli / arşivli segmentler de görünebilir; seçmeden önce segment detayında durumun
  **Aktif** ve "Son Oluşturma"nın güncel olduğunu kontrol et. 0 üyeli segmente yayınlanan kampanya kimseye gitmez.
- Rozet ve bilgi kutusundaki üye sayısı **alıcı sayısı değildir** (izin ve e-posta doğrulama süzgeci gönderimde uygulanır).
- Şablon içeriği bu ekranda önizlenemez; kullanıcının şablonu bildiğini teyit et (şablon adı özetinde).
- Kampanya adı mağaza içinde benzersiz olmalı; aynı adla ikinci kampanya oluşturulamaz.
- Düzenle yalnız Taslak'ta görünür; Planlandı sonrası değişiklik için yeni (kopya) kampanya gerekir — ama asıl kampanya
  gönderilmeye devam eder.
- Detaydaki "Özet → Segment" satırı segment **sayısını** "{n} alıcı" diye gösterir; alıcı sayısı için "Alıcılar"
  bölümüne bak.
- Select/combobox'larda seçimi tıklayarak yap; Enter kullanma. Hook "Yayınla", "Taslak Kaydet", "Sil" tıklamalarında
  onay sorar; **"Kopyala" tıklamasını yakalamaz** — onayı önceden al.

## Doğrulama
1. Toast metni ("Taslak kaydedildi" / "Kampanya planlandı" / "Kampanya kopyalandı" / "Kampanya silindi").
2. Detay sayfasında: başlık + durum rozeti (Taslak / Planlandı + geri sayım / Gönderiliyor), Özet'te konu, gönderen,
   planlanan gönderim tarihi (mağaza saatine göre beklenen değer).
3. Listede satır: Hedef Kitle sütununda segment adı (ya da "Hedef kitle seçilmedi" — yayın öncesi uyarı işareti),
   Planlanan Tarih.
4. Gönderim sonrası (≈2 saat): KPI şeridi ve Performans hunisi; "Alıcılar" bölümündeki toplam alıcı sayısını
   kullanıcıya raporla (yalnız sayılar; alıcı e-postası raporlanmaz).
5. Yayın sonrası durum rozeti Taslak'ta kaldıysa dur ve kullanıcıya bildir (doğrulanmadı: canlıda durum geçişi).
