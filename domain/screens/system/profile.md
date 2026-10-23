# Profilim ve Oturumlar (My Profile, Active Sessions)

> **Operatör sınırı — hassas ekran**
> - Bu ekranlar **giriş yapmış kişinin kendi hesabıdır**. Claude yalnız ad/soyad değişikliğini (kullanıcı isterse, onayla)
>   yapar.
> - Parola bölümü: **gizli alan — Claude okumaz, yazmaz, snapshot almaz; kullanıcı kendisi yapar.** Claude parola
>   alanlarına tıklamaz, "Parolayı değiştir" butonuna basmaz. 2FA kurulumu/QR/yedek kodlar da aynı kuralla kullanıcıya
>   aittir (bu ekranlarda yok; giriş akışında: [../../project/environments-and-auth.md](../../project/environments-and-auth.md) §5).
> - Oturum belirteçleri ekranda gösterilmez; Claude çerez/token okumaz (CLAUDE.md kural 1).

## 1. Profilim
- URL: {ADMIN_URL}/profile
- Menü yolu: Header'daki kullanıcı menüsü (ad + e-posta gösteren buton) → "Profilim / My Profile". Sidebar'da yok.
- Sayfa başlığı: "Profilim / My Profile"; alt başlık "Kişisel hesabınız. Mağaza geneli ayarlar Mağaza Ayarları altındadır. /
  Your personal account. Store-wide options live in Store Settings."
- Amaç: Panelde görünen adı (ad, soyad) düzenlemek; kişinin kendi parolasını değiştirmesi.
- Entity: yönetici kullanıcı (kendi hesabı) — bkz. [system-users.md](system-users.md).
- Yetki: giriş yapmış her yönetici; özel izin gerekmez.

### Ön koşullar ve bağımlılıklar
- Yok. Yüklenemezse kırmızı uyarı "Profiliniz yüklenemedi. Lütfen tekrar deneyin." + "Tekrar dene / Try again" (form gösterilmez).

### Yerleşim
1. Başlık + alt başlık. Yüklenirken "Profiliniz yükleniyor… / Loading your profile…".
2. Kart "Bilgiler / Details" — "Yönetim panelinde görünen adınız.": Ad, Soyad, E-posta (salt okunur), "Kaydet".
3. Kart "Parola / Password" — "Başka hiçbir yerde kullanmadığınız bir parola seçin.": uyarı kutusu, üç parola alanı,
   kural ipucu, hata listesi, "Parolayı değiştir".

### Alanlar
| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Bilgiler | Ad / First name | Input | evet (boş kaydedilemez) | 1–50 | `#firstName` | |
| Bilgiler | Soyad / Last name | Input | evet (boş kaydedilemez) | 1–50 | `#lastName` | |
| Bilgiler | E-posta / Email | Input, salt okunur | — | — | `#email` | "E-posta adresiniz aynı zamanda giriş adınızdır ve buradan değiştirilemez." |
| Parola | Mevcut parola / Current password | Parola input | — | — | `#currentPassword` | **Gizli alan — Claude okumaz, yazmaz, snapshot almaz; kullanıcı kendisi yapar** |
| Parola | Yeni parola / New password | Parola input | — | ≥8; büyük + küçük harf, rakam, özel karakter; ad/e-posta içeremez; son parolalardan biri olamaz | `#newPassword` | **Gizli alan** — ipucu metni: "En az 8 karakter olmalı; büyük harf, küçük harf, rakam ve özel karakter (örn. ! @ # ~) içermeli…" |
| Parola | Yeni parolayı doğrulayın / Confirm new password | Parola input | — | Yeni parolayla aynı | `#confirmPassword` | **Gizli alan** |

### Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Bilgiler → Kaydet / Save | Ad ve soyad kaydedilir; header'daki ad güncellenir (sayfa yenilemesi gerekebilir — doğrulanmadı) | "Profil kaydedildi / Profile saved"; hata "Profil kaydedilemedi / Could not save profile" |
| Parola → Parolayı değiştir / Change password | **Yalnız kullanıcı.** Parola değişir; **diğer cihazlardaki oturumlar kapanır**, bu sekme açık kalır | "Parola değiştirildi / Password changed"; hata "Parola değiştirilemedi" + kart içinde kırmızı neden(ler) |

Parola hata mesajları (kullanıcıya yol göstermek için; değeri Claude görmez): "Yeni parolalar birbiriyle eşleşmiyor.",
"Mevcut parolanız hatalı.", "Bu parolayı daha önce kullandınız…", "Parolanız çok kısa süre önce değiştirildi…" (parola
kısa süre içinde ikinci kez değiştirilemez), "Çok fazla deneme yapıldı. Lütfen bir dakika bekleyip tekrar deneyin." (dakikada
birkaç denemeyle sınırlı), kural bazlı maddeler ("En az bir büyük harf ekleyin." vb.).

### Onay zamanlaması (kural 2/5/6)
- **Kaydet (ad/soyad):** özet (ortam, eski → yeni ad/soyad) + onay. Dış etki yok.
- **Parolayı değiştir:** Claude yapmaz. Kullanıcı yapacaksa önce uyar: parola değişince **diğer cihazlardaki oturumlar
  kapanır** — Claude'un kullandığı tarayıcı (Chrome for Testing) kullanıcının değiştirdiği yer değilse Claude'un oturumu da
  düşer ve kullanıcının yeniden giriş yapması gerekir.

### Tuzaklar
- Ad veya soyadı boş bırakarak kaydetme reddedilir; ikisini de doldur.
- E-posta buradan değişmez; e-posta değişikliği isteğini kullanıcıya bildir.
- Parola alanlarının bulunduğu kart görünürken snapshot gerekirse yalnız "Bilgiler" kartına odaklan; parola alanlarına
  hiçbir değer yazma, okuma, aktarma.

### Doğrulama
1. "Profil kaydedildi" toast'ı.
2. Sayfayı yenile → Ad / Soyad alanları yeni değerlerle; header kullanıcı menüsündeki ad.

## 2. Aktif Oturumlar
- URL: {ADMIN_URL}/profile/sessions (eski adres `/settings/sessions` buraya yönlenir).
- Menü yolu: Sol menü "Ayarlar / Settings" → "Oturumlar / Sessions" (ayar yetkisinden bağımsız, her yöneticiye görünür).
- Sayfa başlığı: "Aktif Oturumlar / Active Sessions"; açıklama "Aktif giriş oturumlarınızı yönetin / Manage your active login sessions".
- Amaç: Kişinin **kendi** açık oturumlarını görmek; tanımadığı bir oturumu veya diğer tüm oturumları kapatmak.
  Başka bir yöneticinin oturumları buradan yönetilmez.
- Yetki: giriş yapmış yönetici; listeleme/sonlandırma yetkisi olmayan rollerde işlem 403 ile reddedilir (doğrulanmadı).

### Yerleşim
1. Başlık; sağda "Yenile / Refresh" ve — başka oturum varsa — kırmızı "Diğer Tüm Oturumları Sonlandır / Terminate All
   Other Sessions".
2. Güvenlik notu: "Tanımadığınız oturumları hemen sonlandırın ve şifrenizi değiştirin."
3. Kart "Geçerli Oturum / Current Session" + "Aktif" rozeti — "Şu anda kullandığınız oturum"; oturum satırında "Bu cihaz / This device".
4. Kart "Diğer Oturumlar / Other Sessions" + sayı — "Diğer cihaz veya tarayıcılardaki oturumlar". Boş: "Başka aktif oturum yok".
5. Oturum satırı: cihaz ikonu, tarayıcı + sürüm (yoksa "Bilinmeyen Tarayıcı"), işletim sistemi ("Bilinmeyen İS"), IP adresi,
   şehir/ülke, "Son aktif / Last active: …" (göreli), "Oluşturulma / Created: …"; diğer oturumlarda "Sonlandır / Terminate".

### Alanlar
Form alanı yok. IP adresi ve konum **kişisel veridir**: rapora/sohbete yalnız kullanıcı isterse aktar.

### Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Yenile | Liste yeniden yüklenir (salt okunur) | — |
| Satır → Sonlandır → diyalog "Oturumu Sonlandır" ("Bu oturumu sonlandırmak istediğinizden emin misiniz? Kullanıcı hemen çıkış yapacak.", seçilen cihaz özeti) → "Oturumu Sonlandır" | O oturum **anında** kapanır; o cihazda yeniden giriş gerekir | "Oturum başarıyla sonlandırıldı / Session terminated successfully" |
| Diğer Tüm Oturumları Sonlandır → diyalog "Tüm Oturumları Sonlandır" ("Geçerli oturum dışındaki tüm oturumlar kapatılacak." + "{n} oturum sonlandırılacak.") → "Diğer Tüm Oturumları Sonlandır" | Geçerli oturum hariç hepsi **anında** kapanır | "{n} oturum sonlandırıldı / {n} sessions terminated" |

### Onay zamanlaması (kural 2/5/6)
- Her iki sonlandırma da geri alınamaz → kural 5: ayrı onay, etkilenen oturum sayısı ve cihaz/tarayıcı/şehir özetiyle.
  Diyalogdaki son butona basmadan önce kullanıcı onayı alınmış olmalı.
- Dış sisteme yazma veya e-posta yok (doğrulanmadı).

### Tuzaklar
- **"Geçerli oturum" Claude'un tarayıcısıdır** (Chrome for Testing). "Diğer tüm oturumları sonlandır" kullanıcının kendi
  tarayıcı(lar)ındaki oturumları da kapatır — kullanıcı o cihazlarda yeniden giriş yapmak zorunda kalır. Özette bunu açıkça yaz.
- Kullanıcı aynı işlemi kendi tarayıcısından yaparsa bu kez **Claude'un oturumu** kapanır: login'e yönlenirsen dur, kullanıcıdan
  tarayıcıda yeniden giriş yapmasını iste (CLAUDE.md "Tarayıcı kullanımı").
- Hangi oturumun kime ait olduğunu IP/cihazdan tahmin etme; tanımadığı oturumu kullanıcı seçer.
- Geçerli oturum bu ekrandan sonlandırılamaz (butonu yok); çıkış için header'daki "Çıkış Yap / Sign Out" — Claude kullanıcı
  istemedikçe çıkış yapmaz.

### Doğrulama
1. Toast metni.
2. Liste yenilenince sonlandırılan oturum(lar) "Diğer Oturumlar"dan kalkmış; "Tümünü sonlandır" sonrası boş durum
   "Başka aktif oturum yok" ve kırmızı buton gizli.
