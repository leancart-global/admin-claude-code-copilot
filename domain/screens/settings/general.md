# Genel Ayarlar (General Settings)
- URL: {ADMIN_URL}/settings/general — sekme seçimi URL'ye yazılmaz; sayfa her açılışta "Mağaza ve Bölge" sekmesiyle açılır.
- Menü yolu: Sol menü "Ayarlar / Settings" → "Genel / General"; ya da `/settings` hub → "Mağaza / Store" bölümü → "Genel / General" kartı.
- Sayfa başlığı: "Genel Ayarlar / General Settings"; açıklama "Panel tercihlerinizi ve kurulum seçeneklerini yönetin / Manage your dashboard preferences and onboarding options".
- Amaç: Mağazanın temel yapılandırması — vitrin/admin/medya URL'leri, bölgesel biçim (tarih biçimi + saat dilimi), stokta olmayan varyant davranışı, iletişim bilgileri ve adres, bot/spam koruması, Google Analytics ve Google doğrulaması, ürün değerlendirme kuralları, kurulum sihirbazı tercihleri. Plan ve dahil özellikler burada **görüntülenir**.
- Mağaza adı bu ekranda **yoktur**. Resmi firma unvanı salt okunurdur; marka/mağaza görünen adı için bkz. [../design/branding.md](../design/branding.md) (doğrulanmadı).
- Yetki: ekran `settings:read`; kaydetme `settings:write`. "Plan ve Abonelik" kartı yalnız **admin / super_admin** rolüne görünür. "Ürün görünümü" kartında `settings:write` yoksa seçim ve Kaydet devre dışıdır.
- Her kart **kendi Kaydet butonuyla ayrı** kaydeder; sayfa genelinde tek bir Kaydet yoktur. İstisna: "Çerezsiz ziyaretçi sayımı" anahtarı **anında** kaydeder (aşağıda).

## Ön koşullar ve bağımlılıklar
- Bağımlı olduğu kayıt yok.
- Etkiledikleri:
  - Bölgesel biçim → tüm admin ekranlarında tarih/saat biçimi ve saat dilimi; siparişin hangi güne sayıldığı (raporlar); mağazadaki telefon alanlarının varsayılan ülkesi.
  - İletişim bilgileri ve adres → faturalar, kargo ve yasal belgeler.
  - Bot koruması → vitrin kayıt/giriş/ödeme formları.
  - Form spam koruması → "spam kontrolü" açık formlar (form oluşturucu); kimlik bilgisi yoksa bu formlar yayınlanamaz.
  - Değerlendirme ayarları → vitrin ürün yorumları ve yorum moderasyonu.
  - Ürün görünümü → vitrin ürün sayfası, stokta olmayan varyant linki açıldığında.
  - Plan → plana bağlı ekranlar ve sınırlar (ör. ikinci store view için "Çoklu Dil", çoklu para birimi).

## Yerleşim
1. Başlık + açıklama.
2. Kurulum tamamlanmadıysa uyarı kutusu: "Mağaza kurulumunuz %{n} tamamlandı / Your store setup is {n}% complete", "Kalanlar: / Still need:" + eksik maddeler, buton "Kurulum listesini görüntüle / View setup checklist" (Kurulum sekmesine geçer).
3. Özet şeridi (3 tıklanabilir kutu, ilgili sekmeye geçer): "Mağaza ve Bölge / Store & Regional" ("{total} URL'den {count} tanesi ayarlandı" / "Tümü tamam"), "Şirket Bilgileri / Company Info" ("{total} alandan {count} tanesi dolduruldu" / "Tamamlandı"), "Değerlendirmeler / Reviews" ("{total} ayardan {count} tanesi etkin").
4. Sekmeler (`role=tab`, bu sırayla): "Plan ve Abonelik / Plan & Subscription", "Mağaza ve Bölge / Store & Regional" (**varsayılan açık**), "Şirket Bilgileri / Company Info", "Güvenlik / Security", "Analitik / Analytics", "Değerlendirmeler / Reviews", "Kurulum / Onboarding".

## Alanlar

### Plan ve Abonelik (salt okunur)
- Kart "Plan ve Abonelik / Plan & Subscription": "Mevcut Plan / Current Plan" rozeti — Launch / Rise / Lead / "Özel / Custom"; plan açıklaması; "{total} özellikten {count} tanesi dahil / {count} of {total} features included".
- Özellik grupları "Temel / Core", "Büyüme / Growth", "Kurumsal / Enterprise"; her özellik dahil/değil işaretli (ör. "Çoklu Para Birimi / Multi-Currency", "Çoklu Dil / Multi-Language", "Özel Alan Adı / Custom Domain", "API Erişimi / API Access", "Denetim Günlüğü / Audit Log").
- Launch ve Rise planlarında "Yükseltme Talep Et / Request Upgrade" butonu (aşağıda Aksiyonlar). Plan bu ekrandan değiştirilemez.

### Mağaza ve Bölge
Kart "Mağaza Yapılandırması / Store Configuration" (`data-testid="store-config-card"`), tek Kaydet:

| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Mağaza URL'si / Storefront URL | Input + "Doğrula / Validate" butonu | hayır | Boş olabilir; doluysa `http://` veya `https://` ile başlamalı → "Geçerli bir URL girin (ör. https://example.com)" | `#publicStoreUrl` | Müşterilerin mağazaya eriştiği genel adres |
| Yönetim Paneli URL'si / Admin URL | Input + Doğrula | hayır | aynı | `#adminUrl` | |
| Medya Temel URL'si / Media Base URL | Input + Doğrula | hayır | aynı | `#cdnBaseUrl` | Ürün görselleri/dosyalar için CDN adresi. Yanlış değer vitrinde görselleri kırar |
| Bölgesel biçim / Regional format | Select (ülke listesi) | hayır | placeholder "Bir ülke seçin / Select a country" | `#regionalFormat` (combobox) | Tarih/saat yazımı + saat dilimi + telefon alanlarının varsayılan ülkesi. Altında "Tarihler şöyle görünecek / Dates will look like …" örneği |
| Saat dilimi / Time zone | Select | — | Yalnız seçilen ülke birden çok saat dilimine yayılıyorsa görünür | `#regionalTimezone` | "Bir siparişin hangi güne ait olduğunu da belirler" |

Kart "Ürün görünümü / Product display" (`data-testid="product-display-card"`), **ayrı** Kaydet (değişiklik yoksa pasif):

| Label | Kontrol | Seçenekler | Locator | Not |
|---|---|---|---|---|
| Müşteri stokta olmayan bir seçeneği açtığında / When a shopper opens a sold-out option | Select | "Stokta olmayan seçeneği göster / Show the sold-out option" (sayfa o seçenekle açılır, satın al pasif) · "Stokta olan bir seçeneği göster / Show an option that is in stock" (varsayılan ya da stoktaki ilk seçenekle açılır) | `#outOfStockRequestedVariant` | Seçim altındaki yardım metni seçime göre değişir |

### Şirket Bilgileri
Kart "Resmi Firma Bilgileri / Official Company Information" — **salt okunur** (Lean Cart tanımlar; bilgi kutusu "Resmi firma bilgilerinizi değiştirmek için lütfen bizimle iletişime geçin."): "Firma Unvanı / Company Name", "Vergi Kimlik No / Tax ID", "Vergi Dairesi / Tax Office", "MERSIS Numarası / MERSIS Number", "Ticaret Sicil No / Trade Register No". Kullanıcı bunları değiştirmek isterse: panelden yapılamaz, Lean Cart desteğine yönlendir.

Kart "İletişim Bilgileri / Contact Information" (`data-testid="contact-info-card"`), tek Kaydet:

| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon | Locator ipucu | Not |
|---|---|---|---|---|---|
| İletişim E-postası / Contact Email | Input (email) | hayır | Alandan çıkınca/Kaydet'te: "Geçerli bir e-posta adresi girin" | `#companyEmail` | |
| İletişim Telefonu / Contact Phone | Input | hayır | 7–20 karakter; rakam, boşluk, `+ - ( )` → "Geçerli bir telefon numarası girin" | `#companyPhone` | ör. `+90 555 123 4567` |
| Ülke / Country (bölüm "Adres ve Vergi Dairesi / Address & Tax Office") | Aramalı combobox | hayır | varsayılan "Türkiye"; desteklenen ülkeler listesi | `#country` | **Ülke değişince İl, İlçe ve Posta Kodu temizlenir** |
| Il / City | Aramalı combobox (ülkenin il listesi varsa) ya da Input | hayır | placeholder "İl seçin / Select city" | `#city` | **İl değişince İlçe temizlenir** |
| Ilçe / District | Aramalı combobox | hayır | İl seçilmeden pasif ("Önce il seçin") | `#citySubdivision` | |
| Sokak / Cadde / Street | Input | hayır | — | `#streetName` | |
| Bina No / Building No | Input | hayır | — | `#buildingNumber` | |
| Posta Kodu / Postal Code | Input | hayır | — | `#postalZone` | |

Doldurma sırası: Ülke → İl → İlçe → diğerleri (ters sıra seçilenleri siler).

### Güvenlik
Kart "Bot Koruması / Bot Protection" (`data-testid="captcha-config-card"`), tek Kaydet:

| Label | Kontrol | Not |
|---|---|---|
| Bot korumasını etkinleştir / Enable bot protection | Switch `#captcha-enabled` | Açıkken vitrin kayıt/giriş/ödeme formları captcha kullanır |
| Sağlayıcı / Provider | Salt okunur metin "Google reCAPTCHA v3" | `data-testid="captcha-provider-value"` |
| Site anahtarı / Site key | Input `#captcha-site-key` | **Gizli alan** — aşağıya bak |
| Gizli anahtar / Secret key | Input `#captcha-secret-key` | **Gizli alan**. Kayıtlıysa placeholder "•••••••• (kayıtlı)"; boş bırakmak kayıtlı değeri korur. Koruma açıkken ve hiç gizli anahtar yokken kaydedilemez: "Bot korumasını etkinleştirmek için bir gizli anahtar girin" |
| Bilgi | "Değişikliklerin mağazanıza yansıması {minutes} dakikaya kadar sürebilir." (~10 dk) | |

Kart "Form Spam Koruması / Form Spam Protection" (`data-testid="forms-turnstile-card"`), Kaydet + "Kaldır / Remove":
- Alanlar: "Site anahtarı / Site key" `#forms-turnstile-site-key`, "Gizli anahtar / Secret key" `#forms-turnstile-secret-key` — ikisi de **gizli alan**.
- Bilgi: Cloudflare Turnstile ayarlarına mağazanın tüm adresleri (platform adresi + özel alan adları) eklenmeli; eksik adreste spam kontrolü sessizce başarısız olur.
- Kurulu değilse: "Henüz ayarlanmadı — spam koruması açık olan formlar buraya bir kimlik bilgisi ekleyene kadar yayınlanamaz." (`data-testid="forms-turnstile-not-configured"`).

### Analitik
Kart "Analitik / Analytics" (`data-testid="analytics-config-card"`), üç ayrı bölüm, her biri kendi butonuyla:

| Bölüm | Label | Kontrol | Locator | Kayıt | Not |
|---|---|---|---|---|---|
| GA4 | GA4 Ölçüm Kimliği / GA4 Measurement ID | Input + "Temizle / Clear" + "Kaydet / Save" | `#ga4-measurement-id` | Kaydet | Kimlik bilgisi değil, kullanıcının verdiği değer onayla girilebilir. Geçersizse alan altında hata |
| Arama motoru doğrulaması / Search engine verification | Google doğrulama etiketi / Google verification tag | Input + "Doğrulamayı kaydet / Save verification" + "Doğrulamayı temizle / Clear verification" | `#google-site-verification` | Kaydet / onaylı temizle | Etiketin tamamı veya yalnız `content` değeri yapıştırılabilir. Temizleme onay diyaloğu: "Arama motoru doğrulaması kaldırılsın mı?" — kaldırılırsa Search Console / Merchant Center verisi kesilebilir |
| Çerezsiz ziyaretçi sayımı / Cookieless visitor counts | Onay vermeyen ziyaretçileri say / Count visitors without consent | Switch | `data-testid="cookieless-aggregate-section"` içindeki switch | **ANINDA** | Açarken onay diyaloğu "Çerezsiz ziyaretçi sayımı açılsın mı?" → "Aç / Turn on"; **kapatma diyalogsuz, anında**. Uyarı: KVKK/GDPR uyumu sağlamaz, hukuki danışman önerilir |
| Sunucu taraflı dönüşümler / Server-side conversions | Measurement Protocol API gizli anahtarı / Measurement Protocol API secret | Input + "Kaydet / Save" + "Kaldır / Remove" | `#ga4-api-secret` | Kaydet | **Gizli alan**. Kayıtlıysa "Gizli anahtar {date} tarihinde ayarlandı." Kaldırma onayı: satışlar sunucudan GA'ya bildirilmez olur |

### Değerlendirmeler
Kart "Değerlendirmeler / Reviews", tek Kaydet:

| Label (tr / en) | Kontrol | Varsayılan | Locator | Etki |
|---|---|---|---|---|
| Değerlendirme için satın alma zorunlu / Require purchase for reviews | Switch | kapalı | `#require-purchase` | Yalnız ürünü satın alan müşteri yorum bırakabilir |
| Doğrulanmış değerlendirmeleri otomatik onayla / Auto-approve verified reviews | Switch | açık | `#auto-approve-verified` | Doğrulanmış alıcı yorumları onaysız yayınlanır |
| Değerlendirme moderasyonunu etkinleştir / Enable review moderation | Switch | açık | `#enable-moderation` | Tüm yorumlar yayından önce onay bekler |

### Kurulum
Kart "Kurulum ve Başlangıç / Onboarding & Setup":
- "Kurulum kontrol listesini göster / Show setup checklist" — Switch `#show-checklist` (panelde kurulum listesi).
- "Kurulum sihirbazını göster / Show setup wizard" — Switch `#show-wizard` (bir sonraki sayfa yenilemesinde ilk kurulum sihirbazı açılır).
- "Kurulumu sıfırla / Reset onboarding" — buton + onay diyaloğu.
- "Kaydet / Save" ve "Kurulum ilerlemesi: %{n} tamamlandı" satırı.

## Gizli alanlar — Claude dokunmaz
- Gizli / kimlik bilgisi alanları: **Bot Koruması → "Site anahtarı", "Gizli anahtar"**; **Form Spam Koruması → "Site anahtarı", "Gizli anahtar"**; **Analitik → "Measurement Protocol API gizli anahtarı"**.
- Claude bu alanları **okumaz, yazmaz, kopyalamaz**; içeriklerini içeren snapshot/ekran görüntüsü çıktısını sohbete aktarmaz, özetlemez. Kullanıcı değeri tarayıcıda kendisi yapıştırır.
- Akış: Claude karta kadar gelir, kullanıcıya "anahtarı sen yapıştır, bitince haber ver" der; kullanıcı yazarken snapshot almaz. Sonra yalnız gizli olmayan kısımları (ör. "Bot korumasını etkinleştir" anahtarı) onaylı özetle yönetir ve Kaydet'e onaydan sonra basar. Doğrulamada gizli alan değerini değil, yalnız "kayıtlı" placeholder'ı / toast'u raporlar.
- "Kaldır / Remove" (Turnstile, sunucu dönüşümleri) gizli değere dokunmadan yapılabilir ama silme işlemidir → kural 5 (ayrı onay).
- Gizli olmayan alanlar (koruma aç/kapa, GA4 Ölçüm Kimliği, Google doğrulama etiketi, değerlendirme ve kurulum anahtarları, URL'ler, adres) normal akışla, özet + onayla doldurulur.

## Aksiyonlar
| Buton (tr / en) | Kart | Ne olur | Toast |
|---|---|---|---|
| Doğrula / Validate | Mağaza Yapılandırması | Girilen URL'ye erişim denenir (kayıt yapmaz). Sonuç alan altında: "Erisilebilir / Reachable" ya da "Erisilemez / Not reachable" / zaman aşımı | — |
| Kaydet / Save | Mağaza Yapılandırması | URL'ler + bölgesel biçim kaydedilir. Doğrula ile **erişilemez** çıkan URL varsa kaydetmez: "Bazı URL'ler erişilemez durumda. Kaydetmeden önce düzeltiniz." Doğrulanmamış URL kaydı engellemez | "Mağaza yapılandırması başarıyla güncellendi" / "Mağaza yapılandırması güncellenemedi" |
| Kaydet / Save | Ürün görünümü | Politika kaydedilir | "Ürün görünümü kaydedildi" / "Ürün görünümü kaydedilemedi. Lütfen tekrar deneyin." |
| Kaydet / Save | İletişim Bilgileri | E-posta, telefon, adres kaydedilir (resmi bilgiler değişmez) | "Firma bilgileri başarıyla kaydedildi" / "Firma bilgileri kaydedilemedi…" |
| Kaydet / Save | Bot Koruması | Aç/kapa + anahtarlar kaydedilir; yazılan gizli anahtar alanı boşalır | "Bot koruması ayarları kaydedildi." |
| Kaydet / Save · Kaldır / Remove | Form Spam Koruması | Kaydet; Kaldır → onay diyaloğu "Spam koruması kimlik bilgisi kaldırılsın mı?" → "Kaldır" | "Spam koruması kimlik bilgisi kaydedildi/kaldırıldı." Kullanımdaysa: "Kaldırılamıyor — önce şu formlarda spam korumasını kapatın: {forms}" |
| Kaydet / Save · Temizle / Clear | GA4 | Kimlik kaydedilir / alan boşaltılır (boşaltma da Kaydet ister) | "Analitik ayarları kaydedildi." |
| Doğrulamayı kaydet · Doğrulamayı temizle | Arama motoru doğrulaması | Kaydet / onaylı kaldır | "Arama motoru doğrulaması kaydedildi." |
| Switch | Çerezsiz sayım | **Anında** kaydeder | "Çerezsiz ziyaretçi sayımı açıldı/kapatıldı." |
| Kaydet · Kaldır | Sunucu taraflı dönüşümler | Gizli anahtar kaydı/kaldırma (onaylı) | "…gizli anahtarı kaydedildi/kaldırıldı." |
| Kaydet / Save | Değerlendirmeler | 3 anahtar kaydedilir | "Değerlendirme ayarları başarıyla kaydedildi" |
| Kaydet / Save | Kurulum | Liste/sihirbaz görünürlüğü kaydedilir | "Kurulum ayarları kaydedildi" |
| Kurulumu sıfırla → onay "Kurulum ilerlemesi sıfırlansın mı?" → "Kurulumu sıfırla" | Kurulum | Tüm kurulum ilerlemesi sıfırlanır, sihirbaz tekrar açılır. **Geri alınamaz** | "Kurulum ilerlemesi sıfırlandı" |
| Yükseltme Talep Et → diyalog "Plan Yükseltme Talebi" → "Talep Gönder / Send Request" | Plan | Lean Cart ekibine yükseltme talebi **gönderilir** (dış etki; ekip mağazayla iletişime geçer). Sonrasında buton ~1 dk gizlenir | "Yükseltme talebi gönderildi! …" |

## Onay zamanlaması (kural 2/5/6)
- **Anında kayıt:** "Onay vermeyen ziyaretçileri say" anahtarı. Kullanıcı onayı anahtara dokunmadan **önce** alınır (hem açma hem kapatma).
- **Dış etkili:** "Yükseltme Talep Et → Talep Gönder" (Lean Cart'a talep gider) — yalnız kullanıcı açıkça isterse, onayla. "Doğrula" yalnız erişim kontrolüdür, kayıt yapmaz; kullanıcının verdiği URL için özet öncesi kullanılabilir.
- **Geri alınamaz / silme:** "Kurulumu sıfırla", Turnstile "Kaldır", sunucu dönüşüm gizli anahtarı "Kaldır", "Doğrulamayı temizle" → her biri ayrı onay.
- Diğer kartlar kendi Kaydet'iyle: özet → onay → Kaydet. Aynı anda birden çok kart değişiyorsa her kartın Kaydet'i ayrı basılır; özet kart bazında yazılır.

## Yan etkiler
- Bölgesel biçim/saat dilimi kaydı tüm ekip için admin tarih biçimini hemen değiştirir; raporlarda gün sınırı kayar.
- Medya Temel URL'si yanlışsa vitrin ve admin görselleri yüklenmez.
- Bot koruması değişikliği vitrine ~10 dk içinde yansır.
- Değerlendirme ayarları yeni gelen yorumlar için geçerlidir (mevcut yorumların durumu değişmez — doğrulanmadı).
- Ürün görünümü vitrinde varyant linkleriyle açılan ürün sayfalarını etkiler.

## Tuzaklar
- Sekme değiştirmek kaydedilmemiş değişiklikleri silmez ama sayfadan ayrılmak siler; her kartı ayrı kaydet.
- Ülke/İl seçimi bağlı alanları temizler; özetteki adres, kaydetmeden önce snapshot ile yeniden okunmalı.
- Gizli anahtar alanını boş bırakmak kayıtlı değeri korur — "silmek" için Kaldır kullanılır (Turnstile/sunucu dönüşümleri); bot korumasında gizli anahtarı kaldırma butonu yoktur.
- Bot korumasını açmak için gizli anahtar kayıtlı olmalı; yoksa kullanıcıdan anahtarı girmesini iste.
- Turnstile kimlik bilgisi kaldırılırsa spam korumalı formlar yayınlanamaz; kullanımda ise kaldırma reddedilir.
- Plan kartı admin olmayan rolde görünmez; "plan nedir" sorusunu `config/local.json` (tenant.plan) ile de cevaplayabilirsin.

## Doğrulama
1. İlgili kartın başarı toast'u.
2. Sayfayı yenile → ilgili sekmeye geç → değerleri snapshot ile karşılaştır (gizli alanlarda yalnız "•••••••• (kayıtlı)" placeholder'ının görünmesi).
3. Bölgesel biçim: herhangi bir liste ekranında tarih biçimi; "Tarihler şöyle görünecek" örneği.
4. Özet şeridindeki sayaçlar (URL sayısı, şirket alanları, değerlendirme anahtarları) beklenenle uyumlu.
