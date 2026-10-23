# Meta Ayarları (bağlantı, reklam hesabı) ve Meta Pixel / Conversions API
- URL'ler:
  - {ADMIN_URL}/marketing/meta/settings — Meta hesabı bağlantısı, uygulama kimlik bilgileri, reklam hesabı seçimi
  - {ADMIN_URL}/marketing/meta-ads/pixel — Meta Pixel ve sunucu tarafı izleme (Conversions API, "CAPI") ayarı + test
- Menü yolu: menüde ayrı öğe yok. Ayarlar: [meta-overview.md](meta-overview.md) → "Ayarlar" kartı, kilitli kartlar,
  bant "Bağlan / Tam bağlantıya geç / Yönet". Pixel: genel bakış → pixel bandı "Yönet / Pixel Yapılandır" ya da
  "1. Pixel Yapılandır".
- Sayfa başlıkları: Ayarlar'da sayfa başlığı yok; ilk kart "Bağlantı Durumu / Connection Status". Pixel: "Meta Pixel
  Yapılandırması / Meta Pixel Configuration" ("Site etkinliklerini izlemek için Meta Pixel ID'nizi girin."), geri oku
  `/marketing/meta-ads`.
- Amaç: Mağazayı kullanıcının **kendi** Meta Business hesabına bağlamak (OAuth), kampanyalarda kullanılacak reklam
  hesabını seçmek; vitrindeki ziyaretçi olaylarının Meta'ya (tarayıcı pixel'i + sunucu tarafı CAPI) gitmesi için
  Pixel ID ve gerekiyorsa CAPI erişim anahtarını kaydetmek.
- Entity: [../../../entities/meta-integration.md](../../../entities/meta-integration.md).
- Yetki: görüntüleme `marketing:view`. "Meta Hesabını Bağla", "Kimlik Bilgilerini Ayarla", reklam hesabı seçimi, pixel
  kaydı ve "Test Olayı Gönder" `marketing:update`. "Bağlantıyı Kes" butonu ekranda yalnız `marketing:delete` olan
  kullanıcıya görünür. Pixel ekranında `marketing:update` yoksa "Bu sayfayı görüntüleme izniniz var ancak değişiklik
  yapmak için ek izin gerekir." notu çıkar, alanlar kilitlenir, "Kaydet" görünmez.

## Gizli alanlar — Claude okumaz, yazmaz; kullanıcı kendisi girer
| Ekran | Alan | Not |
|---|---|---|
| Ayarlar → "Kimlik Bilgilerini Ayarla" diyaloğu | "App ID", **"App Secret"** (`#appId`, `#appSecret`, şifre tipi) | Meta for Developers'taki uygulamanın kimlik bilgileri. Claude diyaloğu açabilir, alanlara dokunmaz; kullanıcı doldurup "Kimlik Bilgilerini Kaydet"e kendisi basar ya da Claude'a "kaydet" der (değer görülmeden) |
| Ayarlar → "Meta Hesabını Bağla" | Meta (facebook.com) giriş ve izin ekranı | Tarayıcı Meta'ya yönlenir; giriş, 2FA ve izin onayı tamamen kullanıcıdadır |
| Pixel → "Erişim Anahtarı / Access Token" (`#meta-access-token`, `data-testid="meta-access-token-input"`) | CAPI erişim anahtarı | Kayıtlı değer hiçbir zaman geri gösterilmez (alan hep boş açılır). "Token'ı göster" göz butonuna Claude basmaz |
- Kullanıcı bu değerlerden birini sohbete yapıştırırsa kullanma, silmesini iste (CLAUDE.md kural 1).
- Pixel ID (15–17 hane) ve test olay kodu gizli değildir; kullanıcı verirse Claude yazabilir.

## Ön koşullar ve bağımlılıklar
- Kullanıcının bir Meta Business hesabı ve Meta for Developers'ta "Business" türünde bir uygulaması olmalı; uygulamada
  Marketing API ürünü eklenmiş ve OAuth yönlendirme adresi tanımlı olmalı (Kurulum Rehberi kartı adresi gösterir:
  `{ADMIN_URL}/marketing/meta/settings`). Bunlar Meta tarafında, kullanıcı tarafından yapılır.
- Reklam hesabı listesi, Meta'da kullanıcının erişimi olan reklam hesaplarıdır ("Reklam hesabı bulunamadı…" uyarısı:
  Meta Business hesabında en az bir reklam hesabına erişim gerekir). Gerekli Meta izinleri: reklam yönetimi ve okuma
  (`ads_management`, `ads_read`) dahil.
- Pixel için: Meta Events Manager'daki Pixel ID. Meta hesabı (tam bağlantı) yoksa CAPI erişim anahtarı da gerekir.
- **Etkiledikleri:** kitleler, huniler, deneyler, uyarılar yalnız "Bağlı" modda çalışır
  ([audiences.md](audiences.md), [funnels.md](funnels.md), [experiments.md](experiments.md), [alerts.md](alerts.md));
  huni bütçe para birimi seçilen reklam hesabının para birimidir; vitrin pixel'i ve sunucu olayları pixel kaydına bağlıdır.

## Yerleşim — Ayarlar (`/marketing/meta/settings`)
1. **Üst bant** (bağlantı modu):
   - Kırmızı "Meta hesabı bağlı değil" + "Bağlan / Connect" (`meta-connection-banner-disconnected`).
   - Sarı "Manuel mod aktif" — "Yalnızca pixel ve CAPI tracking çalışıyor. Audience, Funnel, Experiment, Alert ve
     Optimization için tam Meta bağlantısı gerekir." + "Tam bağlantıya geç" (`meta-connection-banner-manual`).
   - Yeşil tek satır "Bağlı: {reklam hesabı adı}" + "Yönet" + kapat (X, aria-label "Kapat")
     (`meta-connection-banner-connected-mode`).
2. **"Bağlantı Durumu / Connection Status"** kartı ("Facebook ve Instagram reklamlarınızı yönetmek için Meta Business
   hesabınızı bağlayın"):
   - **Bağlı değilken:** "Bağlı değil / Not Connected" kutusu; `marketing:update` varsa iki buton: **"Meta Hesabını
     Bağla / Connect Meta Account"** ve "Kimlik Bilgilerini Ayarla / Setup Credentials".
   - **Bağlıyken:** yeşil kutu "Meta'ya bağlı / Connected to Meta" + hesap adı (yoksa "Meta Business Hesabı") +
     **"Bağlantıyı Kes / Disconnect"**; altında "Token Süresi / Token Expires" (tarih ya da "Bilinmiyor") ve
     "İzinler / Permissions" (ilk 3 izin); ayraç; **"Reklam Hesabı / Ad Account"** bölümü ("Kampanyalarda kullanılacak
     reklam hesabını seçin") + "Yenile / Refresh".
     - Hesap seçilmişse: hesap adı, "ID: act_…", rozet "Seçili / Selected" — bu ekranda başka hesaba geçiş seçeneği yok.
     - Seçilmemişse: Select "Bir reklam hesabı seçin / Select an ad account" (seçenek: hesap adı + para birimi) ya da
       liste boşsa uyarı.
3. **"Kurulum Rehberi / Setup Guide"** kartı — 5 adım: Meta Uygulaması Oluşturun (Meta for Developers bağlantısı, yeni
   sekme), OAuth Ayarlarını Yapılandırın (yönlendirme adresi), Kimlik Bilgilerini Girin, Hesabı Bağlayın, Reklam
   Hesabını Seçin.
4. Diyaloglar: "Meta Uygulama Kimlik Bilgileri" (App ID, App Secret — gizli; "App Secret değeriniz güvenli bir şekilde
   saklanır ve tarayıcıya hiçbir zaman gönderilmez.") ve "Meta Hesabı Bağlantısı Kesilsin mi?".

## Yerleşim — Pixel (`/marketing/meta-ads/pixel`)
1. Test kodu kayıtlıysa en üstte sarı uyarı: "Test modu açık (kod {code})" — "Tüm sunucu olayları yalnızca Meta Olay
   Yöneticisi → Test Olayları'na gider; reklam raporlamasına ve optimizasyona sayılmaz…" (`meta-test-mode-warning`).
2. **"Pixel Bilgisi / Pixel Information"** kartı: Pixel ID, Erişim Anahtarı.
3. **"Olay Yapılandırması / Event Configuration"** — kapalı açılır panel (`event-config-toggle`), rozet "{n}/{toplam}
   aktif". Her standart olay için satır: olay adı (PageView, ViewContent, Search, AddToCart, AddToWishlist,
   InitiateCheckout, AddPaymentInfo, Purchase, Lead, CompleteRegistration …), kanal ("Tarayıcı + Sunucu", "Yalnızca
   sunucu", "Yalnızca tarayıcı") ve Switch (aria-label "{Olay} etkin/devre dışı"). İlk kurulumda liste boş olabilir
   ("Yapılandırılabilir olay bulunamadı."); olaylar kayıttan sonra gelir.
4. **"Test ve Doğrulama / Test & Validation"** kartı: "Test olay kodu" alanı, **"Test Olayı Gönder / Send Test Event"**
   (`meta-test-event-button`), "Embed Kodunu Görüntüle / View Embed Code" (`meta-view-embed-button`). İpucu satırı
   (`meta-test-event-hint`): kayıtlı pixel yoksa "Test ve embed kodu için önce pixel'i kaydedin.", kaydedilmemiş
   değişiklik varsa "Önce değişiklikleri kaydedin; …kayıtlı ayarları kullanır."
5. Sabit alt çubuk: "İptal / Cancel" (geri gider), "Kaydet / Save" (`meta-pixel-save-button`).

## Alanlar
### Ayarlar
| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Kimlik diyaloğu | App ID / App ID | Input | evet | — | `#appId` | **Gizli alan — kullanıcı girer** |
| Kimlik diyaloğu | App Secret / App Secret | Input (şifre) | evet | ikisi boşsa toast "Please enter both App ID and App Secret" | `#appSecret` | **Gizli alan — kullanıcı girer** |
| Reklam Hesabı | (Select) "Bir reklam hesabı seçin" | shadcn Select | evet (tam bağlantı için) | — | SelectTrigger placeholder metni | **Seçim anında kaydedilir**, ayrı Kaydet yok |

### Pixel
| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Pixel Bilgisi | Pixel ID * / Pixel ID * | Input (sayısal) | evet | 15–17 rakam; boşluklar silinir. Hata: "Pixel ID 15-17 haneli sayı olmalıdır." | `#meta-pixel-id`, `meta-pixel-id-input` | Meta Events Manager'dan |
| Pixel Bilgisi | Erişim Anahtarı / Access Token | Input (şifre) | **Meta hesabı tam bağlı değilse ve kayıtlı anahtar yoksa evet** (label'da kırmızı *) | Hata: "Meta hesabı bağlı olmadığı için CAPI access token gerekli…" | `#meta-access-token`, `meta-access-token-input` | **Gizli alan — kullanıcı girer.** Tam bağlantıda OAuth anahtarı kullanılır. Kayıtlı anahtar varken boş bırakmak mevcut anahtarı korur; yeni değer eskisinin yerine geçer |
| Olay Yapılandırması | {Olay adı} | Switch (olay başına) | — | kayıttaki durum | aria-label "{Olay} etkin" / "devre dışı" | Değişiklik "Kaydet" ile kalıcı olur |
| Test ve Doğrulama | Test olay kodu / Test event code | Input | hayır | harf + rakam, en çok 64 karakter. Hata: "Test olay kodu yalnızca harf ve rakam içerebilir…" | `#meta-test-event-code`, `meta-test-event-code-input` | **Kod kayıtlıyken tüm sunucu olayları yalnız Meta "Test Events"e gider, reklam raporlamasına/optimizasyona sayılmaz.** Test bitince temizleyip kaydet |

## Aksiyonlar
### Ayarlar
| Buton | Ne olur | Toast |
|---|---|---|
| Kimlik Bilgilerini Ayarla → (kullanıcı doldurur) → Kimlik Bilgilerini Kaydet | Meta uygulama kimlik bilgileri mağazaya kaydedilir; alanlar temizlenir | "Credentials saved successfully" / hata metni |
| **Meta Hesabını Bağla** | Tarayıcı Meta'nın giriş/izin sayfasına yönlenir; kullanıcı onaylayınca ayarlar ekranına geri döner | Dönüşte durum yeniden yüklenir; hata halinde "OAuth failed: …" |
| Reklam hesabı Select'inden seçim | **Diyalogsuz, anında** reklam hesabı seçilir ve bağlantı "Bağlı" moda geçer | "Ad account selected" / "Failed to select ad account" |
| Yenile | Meta'dan reklam hesabı listesini yeniden çeker (salt okunur) | hata: "Failed to load ad accounts" |
| **Bağlantıyı Kes** → diyalog "Meta Hesabı Bağlantısı Kesilsin mi?" ("Bu işlem Meta hesap bağlantınızı kaldırır. Aktif kampanyalar Meta'da çalışmaya devam eder, ancak yeniden bağlanana kadar buradan yönetemezsiniz.") → "Bağlantıyı Kes" | Meta erişimi kaldırılır, mod "Bağlı değil"e (pixel kayıtlıysa "Manuel"e) düşer | "Meta account disconnected" |

### Pixel
| Buton | Ne olur | Toast |
|---|---|---|
| Kaydet | Pixel ID, (girildiyse) erişim anahtarı, olay anahtarları ve test kodu kaydedilir; `/marketing/meta-ads`'e döner | "Pixel ayarları kaydedildi." / "Pixel ayarları kaydedilemedi." |
| **Test Olayı Gönder** | Kayıtlı ayarlarla Meta'ya bir test olayı gönderilir (kaydedilmemiş değişiklik varken pasif) | "Test olayı gönderildi. Meta Events Manager'da kontrol edin." / "Test olayı gönderilemedi. Pixel ayarlarınızı kontrol edin." |
| Embed Kodunu Görüntüle | "Pixel Embed Kodu" diyaloğu: "Pixel başlatma kodu", "Olay izleme yardımcı kodu", "Kopyala" | — (salt okunur) |
| İptal | Önceki sayfaya döner, kaydetmez | — |

## Onay zamanlaması (kural 2/5/6)
- **"Meta Hesabını Bağla" → Meta hesabına erişim izni verilir (dış sistem).** Tıklamadan önce özet: ortam, hangi Meta
  Business hesabı, verilecek izinler (reklam yönetimi dahil — Lean Cart bu hesapta kampanya oluşturabilir/duraklatabilir,
  kitle yükleyebilir). Giriş ve izin ekranını kullanıcı doldurur.
- **Reklam hesabı seçimi anında kaydedilir** (Select'te seçeneğe tıklamak = kayıt). Onay seçenek tıklanmadan **önce**
  alınır; özetinde hesap adı, ID ve para birimini yaz (huni bütçeleri bu para biriminde harcanır). Seçimden sonra bu
  ekrandan başka hesaba geçilemez; değiştirmek bağlantıyı kesip yeniden bağlamayı gerektirir.
- **"Bağlantıyı Kes" — geri alınamaz nitelikte, ayrı onay.** Etkisi: Meta'daki aktif kampanyalar **durmaz ve harcamaya
  devam eder**, ama Lean Cart'tan duraklatılamaz/izlenemez; kitle yenileme, huni yayınlama/duraklatma, deney ve uyarı
  izleme durur. Özetinde aktif huni sayısını ([funnels.md](funnels.md) listesinde "Aktif" filtresi) ver ve harcamanın
  sürmesini istemiyorsa önce hunileri duraklatmasını öner. Yeniden bağlanmak OAuth'u ve reklam hesabı seçimini tekrar
  gerektirir.
- "Kimlik Bilgilerini Kaydet": mevcut uygulama kimlik bilgilerinin üzerine yazar; kullanıcı onayıyla, değerleri
  kullanıcı girer.
- **Pixel "Kaydet" vitrinin izlemesini değiştirir:** Pixel ID değişirse vitrin olayları yeni pixel'e akar; olay
  anahtarını kapatmak o olayın Meta'ya gitmesini durdurur (reklam optimizasyonu ve raporlamayı etkiler); **test olay
  kodu kaydetmek tüm sunucu olaylarını test moduna alır** (raporlamaya sayılmaz). Özet tablosunda alan → eski/yeni değer;
  erişim anahtarı için yalnız "değişecek / korunacak" yaz, değeri değil.
- **"Test Olayı Gönder" Meta'ya bir olay yazar** (Events Manager'da görünür). Harcama yaratmaz; yine de dış sistem
  aksiyonu olarak tek satırlık onay al.
- Embed kodunu görüntüleme/kopyalama salt okunurdur.

## Yan etkiler
- Bağlı modda kitle, huni, deney, uyarı ekranlarındaki kilitli aksiyonlar açılır; manuel modda yalnız pixel ve sunucu
  olayları çalışır.
- Vitrin pixel'i ziyaretçinin **pazarlama çerezi izni** olmadan yüklenmez; sunucu tarafı olaylar da izinsiz ziyaretçi
  için Meta'ya gönderilmez. Bu yüzden "Bugünkü olaylar" toplam ziyaretten düşük görünebilir.
- Bağlantıyı kesmek Meta'daki kampanyaları silmez/duraklatmaz (diyalog metni).

## Tuzaklar
- "Meta Hesabını Bağla" butonu tarayıcıyı Meta'ya götürür; o sayfada Claude hiçbir alanı doldurmaz, butona basmaz.
  Kullanıcıya "tarayıcıda Meta girişini ve izinleri tamamlayın, ekran ayarlara dönünce haber verin" de.
- Reklam hesabı Select'i seçim için Enter kullanma; seçenek tıklandığı anda kayıt olur.
- Pixel ekranında Erişim Anahtarı alanının boş görünmesi kayıtlı anahtar olmadığı anlamına gelmez ("Kayıtlı bir erişim
  anahtarı var. Boş bırakırsanız mevcut anahtar korunur…" ipucunu oku).
- "Test Olayı Gönder" ve "Embed Kodunu Görüntüle" yalnız **kaydedilmiş** ayarlarla çalışır; önce kaydet.
- Test bittiğinde test olay kodunu temizleyip kaydetmeyi unutma; aksi halde sunucu olayları reklam raporlamasına
  sayılmaz (üstteki sarı uyarı bunu gösterir).
- Olay Yapılandırması paneli varsayılan kapalıdır; snapshot'ta switch'leri görmek için önce `event-config-toggle`'a tıkla.

## Doğrulama
1. Ayarlar: üst bant modu ("Bağlı: {hesap}" / "Manuel mod aktif" / "Meta hesabı bağlı değil"); reklam hesabı kutusunda
   ad, ID ve "Seçili" rozeti; "Token Süresi" tarihi.
2. Pixel: kayıttan sonra genel bakışa dönülür → pixel bandı "Pixel bağlı: {pixelId}", KPI "Pixel durumu: Aktif".
   Pixel ekranını yeniden aç, Pixel ID ve olay rozetini ("{n}/{toplam} aktif") karşılaştır; test kodu kayıtlıysa sarı
   uyarı görünür.
3. Test olayı: başarı toast'u + kullanıcıdan Meta Events Manager → Test Events'te olayı görmesini iste (Claude Meta
   ekranına girmez).
