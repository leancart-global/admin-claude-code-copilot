# Otomasyonlar / iş akışları (liste + akış düzenleyici)
- URL'ler:
  - {ADMIN_URL}/marketing/workflows — liste + şablon galerisi
  - {ADMIN_URL}/marketing/workflows/{id} — akış düzenleyici (sekmeler: Genel, Tetikleyici, Adımlar, Test, Analitik)
- Menü yolu: **menüde ve `/marketing` hub'ında yok**; yalnız URL ile açılır.
- Sayfa başlıkları: liste "Otomasyonlar / Workflows" (+ sayı rozeti), açıklama "Otomatik müşteri yolculukları — sepet
  hatırlatma, hoş geldin, geri kazanma."; düzenleyici başlığı otomasyonun adı, altında tetikleyici cümlesi.
- Amaç: Bir müşteri olayıyla (sepet terki, kayıt, sipariş, uzun süre alışveriş yapmama…) başlayan, bekleme + koşul +
  e-posta adımlarından oluşan **otomatik müşteri mesajı akışları** kurmak, yayına almak ve duraklatmak.
- Entity: [../../entities/marketing-workflow.md](../../entities/marketing-workflow.md).
- Yetki: liste/görüntüle `marketing:view`; yeni otomasyon (boş ya da şablondan) `marketing:create`; kaydet, yayına al,
  duraklat, test `marketing:update`. Silme ve kopyalama bu sürümde yok.
- Kapsam dışı: e-posta şablonlarının içeriği (E-posta yönetimi — kapsam dışı). Akıştaki "E-posta gönder" adımı şablonu
  **adıyla** çağırır.

## Ön koşullar ve bağımlılıklar
- **E-posta şablonu**: her gönderim adımında, mağazada **aktif** ve adı birebir eşleşen bir e-posta şablonu olmalı;
  eşleşen aktif şablon yoksa o adımda e-posta gitmez, akış sonraki adıma geçer. Hazır akış şablonlarının çağırdığı
  şablon adlarının (ör. `cart-abandonment-1h`, `welcome-new-customer`, `win-back-vip`) mağazada var olduğu doğrulanmadı.
- **E-posta gönderimi** mağaza düzeyinde ayarlı olmalı ([../settings/notifications.md](../settings/notifications.md)).
- **Gönderim kuralları**: akışlardaki gönderimler pazarlama mesajı sayılır; 24 saatlik kanal limiti ve toplam limit
  aşılırsa o adım atlanır ([../settings/notification-rules.md](../settings/notification-rules.md)). Limitler 0 ise
  akışlar fiilen e-posta göndermez.
- Pazarlama izni süzgecinin otomasyon gönderimlerine uygulandığı doğrulanmadı → özette kullanıcıya belirt.
- Kupon içeren şablon akışları (sepet hatırlatma, geri kazanım) için kupon/promosyon kurulumu:
  [coupons.md](coupons.md), [promotions.md](promotions.md) (doğrulanmadı: akışın kupon kodunu kendisinin üretip
  üretmediği).

## Liste (`/marketing/workflows`)
### Yerleşim
- Başlık + sayı rozeti; sağda **"Şablonlara göz at / Browse templates"** (sayfadaki şablon bölümüne kaydırır) ve
  **"Yeni otomasyon / New workflow"**.
- Tablo sütunları: "Ad", "Tetikleyici" (rozet), "Durum" (rozet), "Çalışma" (toplam çalışma sayısı), "Son çalışma"
  (kısa göreli süre: `now`, `5h`, `3d`; hiç yoksa "Hiç çalışmadı"), "⋯" (sr-only "İşlem menüsünü aç / Open actions menu").
- Satıra tıklamak düzenleyiciyi açar.
- ⋯ menüsü: "Düzenle"; Aktif'te **"Duraklat / Pause"**, değilse **"Yayına al / Publish"** (Arşivlendi'de pasif);
  "Kopyala" ve "Sil" **pasif** (bu sürümde yok).
- Tablonun altında "Şablonlar" bölümü ("Hazır bir şablonla yeni otomasyon ekleyin.") + şablon kartları.
- Boş durum: "Henüz otomasyon kurmadınız" — "Bir şablonla 5 dakikadan kısa sürede ilk otomatik mailinizi gönderin." +
  şablon kartları + "Sıfırdan başla / Start from scratch" linki.

### Hazır şablonlar (kart: ad, açıklama, tetikleyici rozeti, adım sayısı, "Bu şablonu kullan / Use this template")
| Kart (tr) | Tetikleyici | Adımlar (akış sırası) |
|---|---|---|
| Sepet hatırlatma (3 mail) — "1 saat sonra mail, 24 saatte kupon, 72 saatte son hatırlatma." | Müşteri sepetini terk ettiğinde | 1 sa bekle → hatırlatma e-postası → 24 sa bekle → %5 kupon teklifi e-postası → 72 sa bekle → son teklif e-postası (%10 + ücretsiz kargo) |
| Hoş geldin serisi — "%10 kupon ile karşıla, 2 gün sonra ürün önerileri gönder." | Yeni müşteri kayıt olduğunda | hoş geldin e-postası → 2 gün bekle → marka hikâyesi e-postası → 3 gün bekle → koşul "ilk sipariş verdi mi?" (Evet: bitir / Hayır: ilk alışveriş teşvik e-postası) |
| 60 gün sonra geri kazanım — "Pasif müşterileri %15 kupon + SMS hatırlatması ile geri getir." | Müşteri uzun süredir alışveriş yapmadığında (60 gün) | koşul "yüksek değerli müşteri mi? (YBD > 1000)" → VIP ya da standart geri kazanım e-postası → 14 gün bekle → "geri döndü mü?" → Hayır: VIP son teklif / veda e-postası |
- Kart açıklamaları özettir; gerçek adımlar yukarıdaki gibidir (ör. geri kazanım şablonunda SMS adımı yok, tüm
  gönderimler e-posta). Şablondan gelen adım adları İngilizcedir ("Wait 1 hour", "Send gentle reminder"…); düzenleyicide
  değiştirilebilir.

## Düzenleyici (`/marketing/workflows/{id}`)
### Sekmeler ve alanlar
| Sekme | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Genel | Ad / Name | Input | evet | 1–120; "Lütfen bir ad girin (1-120 karakter)." | `#wf-name` | |
| Genel | Açıklama / Description | Textarea | hayır | ≤500 | `#wf-description` | Ekip içi not; müşteriye gitmez |
| Genel | Durum / Status | salt okunur rozet | — | Taslak | metin | Taslak / Aktif / Duraklatıldı / Arşivlendi; alt çubuktaki butonla değişir |
| Tetikleyici | Tetikleyici / Trigger | shadcn Select | evet | yeni boş otomasyonda "Müşteri sepetini terk ettiğinde" | `#wf-trigger` (tetikleyici) → `role=option` | Altında seçilen tetikleyicinin açıklaması (tablo aşağıda). Eşik değerleri (minimum sepet, gün sayısı) bu ekranda **düzenlenmez** |
| Adımlar | Akış tuvali | görsel düzenleyici | ≥1 adım, tümü tetikleyiciye bağlı | — | sol panel + tuval (`data-testid="canvas-drop-zone"`) | Ayrıntı: "Tuval nasıl sürülür" |
| Adımlar | Adım özeti / Step summary | salt okunur liste | — | — | başlık "Adım özeti" | Adımların sırayla listesi (tür + ad); doğrulamada kullan |
| Test | Test gönder / Send test | buton | — | — | buton "Test gönder" | "Yönetici e-postanıza test gönderin. Analitik etkilenmez." |
| Analitik | Toplam çalışma / Total runs; Son çalışma / Last run | salt okunur | — | "Hiç" | metin | |
- Alt yapışık çubuk: Aktif'te solda uyarı "Düzenlemeden önce bu otomasyonu duraklatın."; sağda **"Duraklat"** /
  **"Yayına al"** ve **"Kaydet / Save"** (`data-testid="workflow-save"`). **Kaydet**, otomasyon Aktif'ken ve tuvalde
  bağlantısız adım varken pasiftir.

### Tetikleyiciler
| Tetikleyici (tr / en) | Açıklama (ekrandaki ipucu) |
|---|---|
| Müşteri sepetini terk ettiğinde / When a cart is abandoned | Sepet işlemsiz kaldıktan sonra çalışır (varsayılan: 1 saat). |
| Bir sipariş geldiğinde / After an order is placed | Her sipariş için bir kez çalışır. Minimum sepet tutarı belirlenebilir. |
| Yeni müşteri kayıt olduğunda / When a new customer signs up | Her yeni hesap için bir kez çalışır. |
| Müşteri uzun süredir alışveriş yapmadığında / When a customer goes inactive | Varsayılan: 60 gündür alışveriş yapmamış müşteriler. |
| Beğenilen ürün stoğa geldiğinde / When a watched item is back in stock | Stok eşik değerinin üstüne çıktığında çalışır. |
| İzlenen ürünün fiyatı düştüğünde / When a watched item drops in price | Fiyat en az %10 düştüğünde çalışır. |
| Müşterinin doğum gününde / On a customer's birthday | Müşterinin doğum gününde yılda bir kez çalışır. |

### Adım türleri (tuvaldeki düğümler)
| Düğüm (tr / en) | Paletteki ad | Düzenleme paneli alanları | Çıkışlar |
|---|---|---|---|
| Tetikleyici / Trigger | — (her akışta tek, sabit) | Düzenlenmez: "Tetikleyici, Tetikleyici sekmesinden düzenlenir." | "Sonraki adım" |
| Bekle / Wait | "Bekle" | Adım adı (`#node-label`, ≤80), Bekleme süresi (`#duration-value`, ≥1 tam sayı), Birim (`#duration-unit`: Dakika / Saat / Gün) | "Sonraki adım" |
| Eğer / Değilse / If / Else | "Eğer / Değilse" | Adım adı (`#cond-label`), İfade (`#cond-expression`, ≤500; ipucu "Müşteri/sepet alanlarını kullanın, örn. cartTotal > 500.") | "Evet" ve "Hayır" (iki ayrı bağlantı noktası) |
| Gönder / Send (e-posta) | "E-posta gönder" | Adım adı (`#send-label`), E-posta şablonu (`#send-template`, **şablon adı yazılır**, placeholder `cart-abandoned-tier-1`, ≤200), Konu (isteğe bağlı) (`#send-subject`, ≤200; odaklanınca "Bir token ekle" çipleri — tıklayınca konuya eklenir) | "Sonraki adım" |
- Şablonu seçilmemiş gönderim düğümünde "Şablon seçin" yazar. Kanal yalnız e-posta (SMS/push adımı yok).
- Bir çıkışı boş bırakmak o dalda akışı bitirir.

### Tuval nasıl sürülür
- Tuval yalnız **≥768 px genişlikte** düzenlenebilir; daha dar pencerede "Görsel düzenleyici daha büyük ekranlarda
  kullanılabilir. Burada adımları görüntüleyebilirsiniz." ile salt okunur liste çıkar → `browser_resize` ile genişlet.
- **Adım eklemek**: sol paneldeki ("Adım ekle", "Tuvale sürükleyin.") öğeyi tuvale **sürükle-bırak**:
  `data-testid="node-palette-wait|condition|send"` → `data-testid="canvas-drop-zone"` (`browser_drag`). Yeni düğüm
  bağlantısız gelir.
- **Bağlamak**: kaynak düğümün çıkış noktasından (aria-label "Sonraki adım", koşulda "Evet"/"Hayır";
  test id `rf-handle-source-trigger|wait|send|condition|condition-false`) hedef düğümün giriş noktasına (aria-label
  "Gelen") sürükle.
- **Adımı düzenlemek**: düğüme tıkla → sağdan panel açılır → alanları doldur → panelin **"Kaydet"**'i. Bu yalnız
  tuvaldeki taslağı günceller; **kalıcı kayıt alt çubuktaki "Kaydet"** ile olur.
- **Adımı silmek**: panelde "Adımı sil" (bağlantılarıyla birlikte tuvalden kalkar; kalıcı olması için yine alt çubuk
  "Kaydet").
- "Otomatik düzenle" (`data-testid="auto-arrange-button"`) düğümleri yeniden yerleştirir; akışı değiştirmez.
- Tüm adımlar tetikleyiciden başlayarak bağlı değilse kırmızı uyarı: "Bu akış henüz kaydedilemez — tüm adımlar
  tetikleyiciden başlayarak bağlı olmalı. Devam etmek için ilk adımı yeniden bağlayın." ve Kaydet pasif. Döngü
  oluşturan bağlantı da kabul edilmez ("Akışta döngü var…", doğrulanmadı: mesajın görünüp görünmediği).
- Sürükle-bırak ve bağlantı kurma hareketleri tarayıcı otomasyonunda kararsız olabilir; her hareketten sonra
  "Adım özeti" kartını snapshot ile kontrol et (doğrulanmadı: `browser_drag` ile güvenilir çalıştığı).

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| **Yeni otomasyon** / "Sıfırdan başla" | **Diyalogsuz, anında** "Yeni otomasyon" adlı **Taslak** kayıt oluşur (tetikleyici: sepet terki; tek adım: 1 saat bekle) ve düzenleyici açılır | hata: "Otomasyon oluşturulamadı" |
| **Bu şablonu kullan** | **Diyalogsuz, anında** şablon adıyla **Taslak** otomasyon oluşur, düzenleyici açılır | hata: "Otomasyon oluşturulamadı" |
| Şablonlara göz at | Sayfadaki şablon bölümüne gider | — |
| Kaydet (alt çubuk) | Ad, açıklama, tetikleyici ve tuvaldeki akış kaydolur (Taslak/Duraklatıldı'da). **Aktif'te pasif**; aktif akış düzenlenemez (`WORKFLOW_ACTIVE_UPDATE_FORBIDDEN`) | "Otomasyon kaydedildi — Değişiklikleriniz aktif."; hata "Otomasyon kaydedilemedi" |
| **Yayına al** (alt çubuk / liste ⋯) | **Diyalogsuz, anında** durum Aktif olur; bundan sonra tetikleyici olayı yaşayan her müşteri akışa girer. Arşivlenmiş akış yayına alınamaz (`WORKFLOW_ARCHIVED_CANNOT_ACTIVATE`) | Başarıda toast **yok** (rozet değişir); hata "Otomasyon durumu değiştirilemedi" |
| **Duraklat** (alt çubuk / liste ⋯) | **Diyalogsuz, anında** durum Duraklatıldı; yeni müşteri akışa girmez | Başarıda toast yok; hata aynı |
| Test gönder | Akışı örnek veriyle bir kez çalıştırır; tasarımda test mesajı yönetici e-postasına gider, analitiği etkilemez | "Test gönderildi — Yönetici e-posta kutunuzu kontrol edin."; hata "Test gönderilemedi" (doğrulanmadı: test e-postasının gerçekten ulaştığı) |
| Panel "Kaydet" / "İptal" / "Adımı sil" | Yalnız tuval taslağı (kalıcı değil) | — |
| ← (başlıktaki geri) / "Otomasyonlara dön" | Listeye döner; **kaydedilmemiş tuval değişiklikleri kaybolur** (uyarı yok, doğrulanmadı) | — |

## Onay zamanlaması (kural 2/5/6)
- **"Yayına al" anında etkilidir ve müşterilere otomatik e-posta gönderilmesini başlatır.** Onay tıklamadan **önce**;
  özette: ortam, otomasyon adı, tetikleyici cümlesi, adım özeti (sırayla bekleme süreleri, koşullar, her gönderimin
  şablon adı), hangi müşterilerin etkileneceği (ör. "bundan sonra sepetini terk eden her müşteri"), sıklık limitleri
  ve "pazarlama izni süzgeci doğrulanmadı" notu. Hook "Yayına al" metnini **yakalamaz** (en arayüzde "Publish"
  yakalanır) → onay önceden.
- **"Duraklat" anında etkilidir**; yeni girişleri durdurur. Akışın içindeki müşterilere bekleyen adımların gönderilip
  gönderilmeyeceği doğrulanmadı → özette belirt. Hook "Duraklat"ı yakalamaz.
- **"Yeni otomasyon" ve "Bu şablonu kullan" diyalogsuz kayıt oluşturur** (Taslak; müşteriye etkisi yok) → yine de
  tıklamadan önce kullanıcıya bildir/onay al. Hook bunları yakalamaz. Silme arayüzü olmadığından gereksiz kayıt
  oluşturma.
- **Kaydet**: Taslak/Duraklatıldı akışta müşteriye etkisi yoktur; normal özet + onay. Duraklatılmış bir akışı
  kaydedip yeniden yayına almak iki ayrı onaydır.
- **Test gönder**: gerçek e-posta gönderebilir (yönetici adresine) → onay; prod'da kullanıcı istemedikçe çalıştırma.
- Aktif bir akışı değiştirmek için sıra: Duraklat (onay) → düzenle → Kaydet (onay) → Yayına al (onay).

## Yan etkiler
- Aktif akış, tetikleyici olayı yaşayan her müşteri için ayrı bir çalışma başlatır; "Çalışma" ve "Son çalışma"
  güncellenir. Bekleme adımları saat/gün sürebilir; e-postalar ilgili müşteriye gider.
- Gönderimler pazarlama mesajı olarak sıklık limitlerine ve sessiz saatlere tabidir
  ([../settings/notification-rules.md](../settings/notification-rules.md)).
- Tetikleyici değiştirildiğinde mevcut eşik ayarları korunur; yeni tetikleyicinin varsayılanı ipucunda yazandır
  (doğrulanmadı).

## Tuzaklar
- Ekranda silme ve kopyalama yok; yanlışlıkla oluşan otomasyon Taslak olarak listede kalır → oluşturmadan önce onay al,
  gerekirse adını "(kullanılmıyor)" gibi işaretlemek için kullanıcıya sor.
- **Aktif akış düzenlenemez**; önce Duraklat.
- Tuvaldeki panel "Kaydet"i kalıcı değildir; alt çubuk "Kaydet"ine basmadan sayfadan çıkma.
- E-posta şablonu alanı serbest metindir; şablon adı birebir yazılmalı (büyük/küçük harf, tire). Yanlış adla akış
  hata vermeden e-posta göndermeden ilerler.
- Koşul ifadesi serbest metindir; kullanıcıdan net kural al (ör. "sepet 500 TL üstü" → `cartTotal > 500`), uydurma
  alan adı kullanma; emin değilsen kullanıcıya sor (doğrulanmadı: desteklenen alan listesi).
- Liste "Son çalışma" sütunu Türkçe arayüzde de `5h` / `3d` gibi kısa İngilizce biçimde görünür.
- Dar pencerede tuval salt okunurdur.
- Select'lerde seçimi tıklayarak yap; Enter kullanma.

## Doğrulama
1. Kaydet sonrası toast "Otomasyon kaydedildi"; sayfayı yenile → "Adım özeti" kartında adımlar ve adları beklenen
   sırada, Tetikleyici sekmesinde doğru tetikleyici.
2. Yayına al / Duraklat sonrası (toast yok): Genel sekmesindeki Durum rozeti ve listede Durum sütunu.
3. Aktif akış için bir süre sonra Analitik sekmesinde "Toplam çalışma" artışı (kullanıcıya raporla).
