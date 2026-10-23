# Bildirim Ayarları (Notification Settings)
- URL: {ADMIN_URL}/settings/notifications
- Menü yolu: "Ayarlar / Settings" → "Bildirimler / Notifications".
- Başlık: "Bildirim Ayarları / Notification Settings" — açıklama "Mağazanız için e-posta ve bildirim şablonlarını yönetin".
- Amaç: Mağazanın müşterilere ve satıcıya otomatik gönderdiği e-posta/SMS bildirimlerinin (sipariş onayı, kargo, şifre
  sıfırlama, sepet hatırlatma, stok uyarısı…) **açık/kapalı durumunu, konu ve metnini** yönetmek; ayrıca bu e-postaların
  **hangi hesaptan ve hangi gönderen adresiyle** gideceğini ayarlamak. E-posta gönderimi ayarlanmadan mağaza e-postaları
  gönderilmez.
- Yetki: sayfa `settings:read`. Şablon aç/kapa ve düzenleme `notification:update`; e-posta gönderimi (sağlayıcı, gönderen
  modu, gönderen alan adı) `settings:write`.
- Hassas: **evet** — "E-posta Gönderimi" sekmesinde sağlayıcı kimlik bilgileri var (bkz. "Gizli alanlar").
- Anında kaydeden kontroller: şablon **Durum** switch'i, **E-posta Gönderim Ayarları** radyo seçimi, gönderen alan adı
  butonları (Alan adı ekle / Bu alan adını kullan / Mağaza adresini kullan / Kaldır). Onay **tıklamadan önce** alınır.
- Dış etkili butonlar: **Test Gönder** (şablon) ve **Test gönder** (sağlayıcı) gerçek e-posta yollar → onay gerekir.
- Gönderim kuralları (sıklık limiti, sessiz saatler) ayrı ekrandadır: [notification-rules.md](notification-rules.md).

## Ön koşullar ve bağımlılıklar
- Test e-postası için önce e-posta gönderimi ayarlı ve bağlı olmalı; değilse test butonu pasif ("Önce e-posta gönderimini
  ayarlayın / Set up email sending first").
- Test e-postasındaki linklerin doğru gitmesi için mağaza (vitrin) adresi tanımlı olmalı; değilse test dialogunda uyarı ve
  "Mağaza adresini ayarla / Set store address" linki çıkar.
- Şablonlar ekranda oluşturulmaz/silinmez; mağazaya hazır gelir. Boşsa "Henüz şablon yok / No templates yet".
- Logo, marka rengi, mağaza adı, destek e-postası, adres gibi ortak öğeler e-postaya marka/şirket bilgisi ayarlarından
  otomatik gelir (doğrulanmadı: hangi ekran hangi öğeyi besliyor).

## Yerleşim
- Başlık + açıklama. Üstte iki sekme: **"Şablonlar / Templates"** (varsayılan) ve **"E-posta Gönderimi / Email Sending"**.
- Şablonlar sekmesi: kart "E-posta Şablonları / Email Templates"; içinde kategori sekmeleri **"Sipariş / Order"**,
  **"Müşteri / Customer"**, **"Satıcı / Merchant"**; her birinde şablon tablosu. Kartın altında bilgi kutusu.
- E-posta Gönderimi sekmesi: kart "E-posta Gönderimi / Email Sending" → önce "E-posta Gönderim Ayarları" radyo kartı,
  sonra durum kutusu, "Gönderim yöntemi / Sending method" seçimi, yönteme özel alanlar, gönderen alanları, test paneli,
  en altta "Kaydet / Save".

## Şablon tablosu (Şablonlar sekmesi)
| Sütun (tr / en) | İçerik |
|---|---|
| Kanal / Channel | İkon: zarf = e-posta, balon = SMS, zil = push |
| Ad / Name | Şablonun görünen adı (üzerine gelince teknik ad görünür) + altında "N değişken / variables" |
| Konu / Subject | E-posta konusu (SMS'te "-"); dar ekranda gizli |
| Durum / Status | Switch — aria-label açıkken "Devre dışı bırak / Disable", kapalıyken "Etkinleştir / Enable" |
| İşlemler / Actions | İkon butonlar, `title`: "Önizleme / Preview", "Düzenle / Edit", "Test Gönder / Test Send" |

Locator: satırı şablon adıyla bul (`getByRole('row', { name: /Sipariş Onayı|Order Confirmation/ })`), sonra satır içinde
`getByRole('switch')` veya `getByTitle('Düzenle')` / `getByTitle('Edit')`.

### Hangi olaylar için şablon var (kategori sekmesine göre — doğrulanmadı, mağazaya göre değişebilir)
| Sekme | Şablonlar (tr / en) |
|---|---|
| Sipariş / Order | Sipariş Onayı / Order Confirmation · Sipariş Kargoya Verildi / Order Shipped · Sipariş Teslim Edildi / Order Delivered · Sipariş İptal Edildi / Order Cancelled · Sipariş Durumu Değişti / Order Status Changed · Sipariş İade Edildi / Order Refunded · satıcıya yeni sipariş bildirimi (teknik adla görünebilir) |
| Müşteri / Customer | Hesap: Hoş Geldin E-postası, E-posta Doğrulama, E-posta Doğrulandı, Şifre Sıfırlama, Şifre Sıfırlama Tamamlandı, Hesap Daveti, Hesap Etkinleştirildi, Hesap Devre Dışı Bırakıldı · Pazarlama: Terk Edilen Sepet Hatırlatması (1./2./Son), Sepet Hatırlatma (1/24/72 saat), Gezinme Hatırlatması, Fiyat Düşüşü Uyarısı, İstek Listesi Fiyat Düşüşü, Değerlendirme İsteği, Tekrar Alışveriş Teşviki, VIP Özel, Arkadaşını Davet Et, Davet Ödülü, Hoş Geldin Serisi (Gün 0/2/5), Geri Kazanma (60 gün) · Kargo durum bildirimleri: Dağıtıma Çıktı, Teslimat Başarısız, Kargo İade Edildi (e-posta ve SMS), Sipariş Kargoda (SMS) |
| Satıcı / Merchant | Düşük Stok Uyarısı (Yönetici) / Low Stock Alert (Admin) · Stok Tükendi Uyarısı (Yönetici) / Out of Stock Alert (Admin) · Yeniden Stokta / Back in Stock · kargo bakiyesi uyarıları (teknik adla görünebilir) |

## Alanlar

### Şablon düzenleme dialogu ("Şablonu Düzenle / Edit Template")
Açılış: satırda "Düzenle" ikonu. Başlık altında kanal rozeti (Email / SMS / Push Notification) + şablon adı.

| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Konu | Konu / Subject | Input (placeholder "E-posta konusunu girin") | hayır | mevcut konu | `#template-subject` / `getByLabel('Konu')` | Yalnız e-posta şablonlarında; SMS'te yok |
| İçerik | İçerik / Content | Zengin metin düzenleyici (tasarım sabit; başlık/paragraf/buton yazısına tıklayıp yazılır) | evet | mevcut gövde | "İçerik" etiketinin altındaki düzenlenebilir alan (`role=textbox`, doğrulanmadı) | Boşsa "Lütfen mesaj içeriğini girin". Döngü/koşul blokları "Ürün listesi (döngü)", "Koşullu blok", "Şablon bloğu" etiketli kutular olarak görünür — silme |
| Değişkenler | Kullanılabilir değişkenler / Available variables | Tıklanabilir rozetler `{{değişken}}` | — | — | `getByRole('button', { name: '{{customerName}}' })` | Tıklayınca son odaklanılan alana (Konu ya da İçerik imleci) eklenir. Gönderimde gerçek değerle değişir |

Değişken örnekleri (şablona göre değişir; dialogda tam liste görünür): `{{customerName}}`, `{{firstName}}`,
`{{orderNumber}}`, `{{trackingNumber}}`, `{{carrierName}}`, `{{refundAmount}}`, `{{resetUrl}}`, `{{verificationUrl}}`,
`{{cartUrl}}`, `{{couponCode}}`, `{{storeName}}`, `{{websiteUrl}}`, `{{supportEmail}}`, `{{unsubscribeUrl}}`.
Bazı değişkenler **zorunludur** (ör. sipariş onayında müşteri adı, şifre sıfırlamada sıfırlama linki): içerikten
çıkarılırsa kayıt engellenir.

### Önizleme dialogu ("Şablon Önizleme / Template Preview")
Salt okunur: durum rozeti (Etkin/Devre Dışı), Konu, İçerik — değişkenler **örnek verilerle** gösterilir ("Örnek verilerle
gösteriliyor"); "Kullanılabilir Değişkenler" listesi; "Kapat / Close".

### Test gönderim dialogu ("Test e-postası gönder / Send a test email")
| Label (tr / en) | Kontrol | Zorunlu | Validasyon / varsayılan | Locator |
|---|---|---|---|---|
| Alıcı e-posta adresi / Recipient email address | Input email | evet | Varsayılan: giriş yapan kullanıcının e-postası. Boş → "Test göndermek için bir e-posta adresi girin."; geçersiz → "Lütfen geçerli bir e-posta adresi girin." | `#test-send-recipient` |
Butonlar: "İptal / Cancel", "Gönder / Send". Adres kaydedilmez. E-posta örnek sipariş verileriyle gider.

### E-posta Gönderimi sekmesi

**1) E-posta Gönderim Ayarları / Email Sending (radyo, ANINDA KAYDEDER)**
| Seçenek (tr / en) | Locator | Etki |
|---|---|---|
| LeanCart e-posta hizmetini kullan / Use LeanCart's email service | `#sender-mode-platform` | Kurulum gerekmez; e-postalar platformun doğrulanmış adresinden gider (adres kartta "Gönderen: …" olarak yazar) |
| Kendi e-posta sağlayıcımı kullan / Use my own email provider | `#sender-mode-own-provider` | E-postalar mağazanın kendi hesabından/alan adından gider. Sağlayıcı bağlı değilse kırmızı uyarı: "Bağlanmadan gönderim yapılmaz" |
Seçim değişince hemen kaydolur → toast "E-posta gönderim ayarı kaydedildi." / hata "E-posta gönderim ayarı kaydedilemedi."

**2) Durum kutusu** (kayıtlı sağlayıcıya göre): "Mağaza e-postaları siz e-posta gönderimini ayarlayana kadar gönderilmez."
(ayarlı değil) · yeşil "Bağlandı — {e-posta} üzerinden gönderiliyor." · uyarı/hata metinleri (alan adı doğrulanmadı, anahtar
geçersiz, gönderen adresi eksik, LeanCart hazırlanıyor…) · "Yeniden kontrol et / Check again" butonu (salt okunur yenileme).

**3) Gönderim yöntemi / Sending method** (radyo kartları; seçmek kaydetmez, "Kaydet" gerekir)
| Seçenek | Locator | Açılan alanlar |
|---|---|---|
| Resend | `#method-resend` | API anahtarı (gizli) + "Resend API anahtarı nasıl alınır?" linki |
| SendGrid | `#method-sendgrid` | API anahtarı (gizli) |
| Mailgun | `#method-mailgun` | API anahtarı (gizli), Gönderim domaini / Sending domain (`#mailgun-domain`, zorunlu) |
| AWS SES | `#method-aws-ses` | Access Key ID (gizli), Secret Access Key (gizli), Bölge (region) (`#aws-region`, zorunlu, ör. eu-central-1), Sıçrama ve şikayet bildirimleri (opsiyonel; gizli bölüm) |
| Kendi e-posta hesabım (SMTP) / My own email account (SMTP) | `#method-smtp` | E-posta adresi (SMTP kullanıcı) (gizli), Şifre / Uygulama parolası (gizli), SMTP sunucusu (`#smtp-host`, zorunlu), Port (zorunlu; SSL için 465, TLS için 587), Güvenli bağlantı (SSL) switch |
| LeanCart | `#method-leancart` | Yalnız platform açtıysa görünür. Alan yok; altında "Gönderen adresi" kartı (aşağıda) |
Kayıtlı bir sağlayıcı varsa gizli alanların altında "… kayıtlı. Değiştirmek istemiyorsanız boş bırakın." yazar — boş bırakmak
mevcut değeri korur.

**4) Gönderen alanları (tüm yöntemler)**
| Label (tr / en) | Kontrol | Zorunlu | Not | Locator |
|---|---|---|---|---|
| Gönderen e-posta / Sender email | Input email | evet ("Devam etmek için gönderen e-posta adresini girin.") | Müşterinin gördüğü gönderen adresi. Sağlayıcıda doğrulanmış alan adından olmalı; SMTP'de genelde hesapla aynı; LeanCart'ta yalnız @ öncesi kullanılır | `#email-from-email` |
| Gönderen adı / Sender name | Input | hayır | Gelen kutusunda görünen ad (ör. mağaza adı) | `#email-from-name` |
| Yanıt adresi / Reply-to address | Input email | hayır | Müşteri "Yanıtla" deyince gideceği adres | `#email-reply-to` |

**5) Gönderen adresi kartı (yalnız LeanCart yöntemi)** — "Mağaza adresi / Store address" (otomatik adres, "Kullanılıyor"
rozeti) ve "Kendi alan adınız / Your own domain" (`#sender-own-domain`) + "Alan adı ekle / Add domain". Eklenince
eklenecek **3 DNS kaydı** (Ad + Değer, kopyala butonları), doğrulama rozeti (Kontrol ediliyor / Doğrulandı / Doğrulanmadı),
son tarih uyarısı, DMARC önerisi; butonlar "Tekrar kontrol et", "Bu alan adını kullan / Use this domain", "Mağaza adresini
kullan / Use store address instead", "Kaldır / Remove" (onay dialogu "Bu alan adı kaldırılsın mı?"). Tek alan adı
eklenebilir; kaldırılan alan adı 7 gün sonra tekrar eklenebilir.

**6) Test paneli** — "Test e-postası gönder": adres (`#email-test-to`, varsayılan oturum e-postası, kaydedilmez) +
"Test gönder / Send test". Kaydedilmiş ve bağlı sağlayıcı yoksa pasif. Bu test mesaj geçmişine yazılmaz.

## Gizli alanlar — Claude dokunmaz
- Gizli/kimlik bilgisi alanları: **API anahtarı / API key**, **Access Key ID**, **Secret Access Key**,
  **E-posta adresi (SMTP kullanıcı)**, **Şifre / Uygulama parolası**, **Sıçrama ve şikayet bildirimleri** (konu ARN'si) ve
  altındaki **Abonelik URL'si / Subscription URL**.
- Claude bu alanları **okumaz, yazmaz, kopyalamaz**; snapshot/ekran görüntüsü çıktısında bu alanların değerini sohbete
  aktarmaz. Kullanıcı tarayıcıda kendisi girer. Kullanıcı bu alanları doldururken ve doldurduktan sonra "Kaydet"e kadar
  Claude ekran görüntüsü almaz; snapshot gerekiyorsa yalnız gizli olmayan alanların durumunu raporlar.
- Abonelik URL'sinin "kopyala" butonuna Claude basmaz; kullanıcıya "değeri kendin kopyala, ben görmeyeceğim" der.
- Gizli olmayan alanlar normal akışla, onayla doldurulabilir: gönderim yöntemi seçimi, Gönderen e-posta, Gönderen adı,
  Yanıt adresi, Mailgun gönderim domaini, AWS bölgesi, SMTP sunucusu, Port, SSL switch'i, kendi alan adı. DNS kayıtları
  herkese açık bilgidir; kullanıcı alan adı sağlayıcısına ekleyecekse Claude okuyup listeleyebilir.

## Aksiyonlar
| Aksiyon | Ne olur | Toast / sonuç | Onay |
|---|---|---|---|
| Şablon **Durum** switch'i | Şablonu açar/kapatır, **anında kaydeder** | "Şablon etkinleştirildi" / "Şablon devre dışı bırakıldı" + şablon adı; hata "Şablon durumu güncellenemedi" | Tıklamadan önce |
| Önizleme | Dialog açar, değişiklik yok | — | Gerekmez |
| Düzenle → **Kaydet / Save** | Konu + içeriği kaydeder. Değişiklik yoksa veya içerik boşsa Kaydet pasif. Zorunlu değişken eksikse kırmızı uyarı ("İçerikte, mesajda kalması gereken bazı zorunlu öğeler eksik: {{…}}") ve kayıt yapılmaz | "Şablon kaydedildi"; hata "Şablon kaydedilemedi. Lütfen tekrar deneyin." | Kaydet'ten önce |
| Düzenle → **Orijinali geri yükle / Restore original** | Onay dialogu ("Orijinal mesaj geri yüklensin mi?" → "Orijinali geri yükle" / "Değişikliklerimi koru"); alanlara orijinal metni yükler, **kaydetmez** — Kaydet'e basınca kalıcı olur ve geri alınamaz | hata "Orijinal mesajı yükleyemedik." | Kaydet'ten önce (geri alınamaz olarak işaretle) |
| Düzenle → İptal | Değişiklikleri atar | — | — |
| **Test Gönder** (satır) → Gönder | Örnek verili gerçek e-posta yollar. SMS şablonunda gönderilmez ("SMS şablonları için test gönderimi henüz kullanılamıyor…"). Gönderim ayarlı değilse E-posta Gönderimi sekmesine geçer + "Önce e-posta gönderimini ayarlayın." | "Test e-postasi gönderildi" + "{email} adresine gönderildi"; hata "Test e-postasi gönderilemedi" | **Dış etkili** — alıcı adresiyle onay |
| E-posta Gönderim Ayarları radyo | **Anında kaydeder** (yukarıda) | — | Tıklamadan önce |
| Gönderim yöntemi + alanlar → **Kaydet / Save** | Sağlayıcı ayarını kaydeder. Eksik alan → alanlar kırmızı + toast "Devam etmek için işaretli alanları doldurun." Kaydedilmemiş değişiklik varsa butonun solunda "kaydedilmemiş değişiklik" yazısı | "E-posta gönderimi kaydedildi." / "E-posta gönderimi kaydedilemedi. Lütfen tekrar deneyin." | Kaydet'ten önce |
| Test gönder (sağlayıcı paneli) | Kayıtlı sağlayıcıyla gerçek test e-postası yollar | "Test e-postası {email} adresine gönderildi." / "Test e-postası gönderilemedi." veya sebep metni | **Dış etkili** — onay |
| Alan adı ekle / Bu alan adını kullan / Mağaza adresini kullan / Kaldır | Anında uygular | "Alan adı eklendi. Doğrulamak için 3 kaydı ekleyin." / "Artık kendi alan adınızdan gönderiyorsunuz." / "Artık mağaza adresinizden gönderiyorsunuz." / "Alan adı kaldırıldı." | Her biri tıklamadan önce; Kaldır ayrıca tek tek |

## Yan etkiler
- Şablon kapatılırsa ilgili olayda (ör. sipariş onayı) müşteriye/satıcıya o mesaj **gönderilmez**; açılınca sonraki
  olaylardan itibaren gönderilir. Geçmiş mesajlar etkilenmez.
- Konu/içerik değişikliği **bir sonraki** gönderimden itibaren geçerlidir.
- Gönderim yöntemi/gönderen değişikliği tüm mağaza e-postalarının gönderen adresini ve teslim edilebilirliğini etkiler;
  yanlış ayar müşterilere hiç e-posta gitmemesine yol açar (sipariş onayı, şifre sıfırlama dahil).
- LeanCart yöntemini açmak birkaç dakika sürebilir ("hazırlanıyor" durumu).
- Kendi alan adının DNS kayıtlarının yayılması birkaç saat sürebilir.

## Tuzaklar
- Durum switch'i ve "E-posta Gönderim Ayarları" radyo seçimi Kaydet beklemez; yanlış tıklama canlıyı değiştirir.
- "Kendi e-posta sağlayıcımı kullan" sağlayıcı bağlanmadan seçilirse gönderim durur.
- Gönderim yöntemi kartını değiştirmek o yöntemin kayıtlı ayarlarını forma yükler; Kaydet'e basılırsa aktif yöntem değişir.
- Gizli alanı boş bırakmak mevcut değeri korur — kullanıcı "değiştirme" dediyse boş bırak.
- İçerik düzenleyicide döngü/koşul bloklarını ve zorunlu değişkenleri silme.
- Ekranda dil / store view seçimi yoktur; şablon tek metin olarak düzenlenir (çok dilli gönderim — doğrulanmadı).
- Gönderim kuralları bu ekranda değil: [notification-rules.md](notification-rules.md) (URL ile veya
  "Üyelik İptal Analizleri" ekranındaki "Sıklık limitlerini düzenle" linkiyle açılır).

## Doğrulama
1. Durum değişikliği: toast + satırdaki switch durumu; sayfayı yenileyip tekrar kontrol et.
2. Düzenleme: toast "Şablon kaydedildi" → satırda Konu sütunu yeni değeri gösterir → Önizleme'de içerik yeni metinle.
3. Gönderim ayarı: E-posta Gönderimi sekmesinde yeşil "Bağlandı — … üzerinden gönderiliyor." kutusu; şablon satırlarında
   Test Gönder butonu aktif.
4. Test gönderimi yapıldıysa kullanıcıdan gelen kutusunu kontrol etmesini iste.
