# Sistem Kullanıcıları (System Users)

> **Operatör sınırı — hassas ekran**
> - Bu ekran mağazanın **yönetici kullanıcılarını** (admin paneline girenler) yönetir; müşteri değildir
>   (müşteriler: [../customers/customer-detail.md](../customers/customer-detail.md)).
> - Claude kullanıcı davet etmeyi, profil düzenlemeyi, askıya almayı **yalnız kullanıcı açıkça isterse** yapar
>   (bkz. [../../project/permissions.md](../../project/permissions.md) §4). Rol atamak yetki vermektir: özet tablosunda
>   seçilen rollerin adını ve "bu kişi şu ekranlara erişebilecek" sonucunu açıkça yaz.
> - Şifre, 2FA kurulumu, davet bağlantısı: **gizli alan — Claude okumaz, yazmaz, snapshot almaz; kullanıcı kendisi yapar.**
>   Davet edilen kişi şifresini ve (istenirse) MFA'sını kendi e-postasındaki bağlantıdan kendisi kurar.

- URL: {ADMIN_URL}/system-users (detay çekmecesi açıkken `?userId=<id>` eklenir; bu URL doğrudan açılırsa çekmece açık gelir).
- Menü yolu: Sol menü "Kullanıcılar / Users" → "Tüm Kullanıcılar / All Users".
- Sayfa başlığı: "Sistem Kullanıcıları / System Users" + kullanıcı sayısı rozeti; açıklama "Ekip üyelerinizi ekleyin ve
  mağazanızda nelere erişebileceklerini kontrol edin. / Add team members and control what they can access in your store."
- Amaç: Yönetici ekibini görmek, yeni ekip üyesi davet etmek (rol(ler) ile), kişinin profil bilgilerini düzenlemek,
  hesabı askıya almak / yeniden etkinleştirmek.
- Entity: yönetici kullanıcı (AdminUser) — ayrı entity dosyası yok; alanlar bu dosyada. Roller: [roles.md](roles.md).
- Yetki: menü ve ekran `users:read`; yetkisizse "Erişim Reddedildi / Access Denied" kartı ("Sistem kullanıcılarını yönetme
  izniniz yok…"). Listeleme, davet, düzenleme, askıya alma pratikte `admin` veya `super_admin` rolü ister; diğer rollerde
  işlem 403 ile reddedilir.
- Veri / API: kullanıcı listesi sayfa açılınca bir kez yüklenir; arama ve filtreler listede (tarayıcıda) süzer.

## Ön koşullar ve bağımlılıklar
- Davet için en az bir **rol** olmalı ([roles.md](roles.md)). Rol listesi boşsa davet diyaloğunda "Kullanılabilir rol yok.
  Lütfen önce rolleri başlatın. / No roles available. Please initialize roles first." çıkar → kullanıcıya bildir, dur.
- Davet edilecek e-posta mağazada başka bir yönetici kullanıcıda kayıtlı olmamalı (409 `USER_ALREADY_EXISTS`).
- Etkiledikleri: kişinin rolleri → sidebar'da gördüğü menüler ve yapabildiği işlemler
  ([../../project/navigation.md](../../project/navigation.md), [../../project/permissions.md](../../project/permissions.md));
  askıya alma → kişinin panele girişi; tüm işlemler denetim günlüğüne düşer ([../settings/audit-log.md](../settings/audit-log.md)).

## Yerleşim
1. Kart başlığı + sayı rozeti; sağda "Kullanıcı Davet Et / Invite User" (+ ikonlu).
2. Filtre satırı:
   - Kullanıcı türü düğme grubu (aria-label "Kullanıcı türüne göre filtrele / Filter by user type"): "All", "Human",
     "Service" (sayılarla; bu üç etiket arayüz dilinden bağımsız İngilizce görünür). "Service" = otomasyon/servis hesabı.
   - Arama: placeholder "E-posta, ad veya role göre ara... / Search by email, name, or role..." (ad ve e-postada arar).
   - Select "Risk Seviyesi / Risk Level": "Tüm Risk Seviyeleri / All Risk Levels", "Düşük Risk / Low Risk",
     "Orta Risk / Medium Risk", "Yüksek Risk / High Risk".
   - Select "MFA Durumu / MFA Status": "Tüm Kullanıcılar / All Users", "MFA Etkin / MFA Enabled", "MFA Devre Dışı / MFA Disabled".
   - Aktif filtre varsa "Temizle (n) / Clear (n)".
   - Durum çipleri (tıklanınca seçilir/kalkar): "Davet Edildi / Invited", "Aktif / Active", "Askıya Alındı / Suspended",
     "Devre Dışı / Deactivated", "2FA Bekliyor / Pending 2FA".
3. Tablo sütunları: "Kullanıcı / User" (avatar, ad, e-posta), "Tür / Type" (Human / Service rozeti), "Rol / Role",
   "Durum / Status" (rozet; değer İngilizce ham metin: `active`, `invited`, `suspended`, `deactivated`, `pending 2fa`),
   "MFA" ("Etkin / Enabled" kalkan, "Devre Dışı / Disabled" uyarı), "Risk" (`low` / `medium` / `high`),
   "Son Etkinlik / Last Active" (göreli; hiç yoksa "Hiç / Never"), "Oturumlar / Sessions" (aktif oturum sayısı),
   "⋯" (sr-only "Menüyü aç / Open menu"). Sütun başlığına tıklayınca sıralanır. Boş: "Sistem kullanıcısı bulunamadı. / No system users found."
4. Satıra tıklamak sağdan **detay çekmecesini** açar.
5. Satır menüsü ("İşlemler / Actions"): "Detayları görüntüle / View details", "Profili düzenle / Edit profile",
   "İzinleri yönet / Manage permissions", "Denetim kayıtlarını görüntüle / View audit log",
   "Oturumları sonlandır / Terminate sessions", "Hesabı askıya al / Suspend account".
   - "Detayları görüntüle", "Profili düzenle", "Oturumları sonlandır", "Hesabı askıya al" yalnız **çekmeceyi açar**;
     işlemin kendisi çekmecedeki butonlarla yapılır. Kişinin oturumlarını admin olarak tek tek sonlandıran bir ekran yok
     (yalnız sayı görünür) — kişi kendi oturumlarını [profile.md](profile.md) → Oturumlar'dan kapatır.
   - "İzinleri yönet" ve "Denetim kayıtlarını görüntüle" ayrı sayfaya gider (doğrulanmadı — kullanma; denetim kaydı için
     [../settings/audit-log.md](../settings/audit-log.md), yetki için rol değişikliği [roles.md](roles.md)).

### Detay çekmecesi
- Başlık: avatar, ad, e-posta; rozetler: tür, durum, MFA ("MFA Etkin" / "MFA Devre Dışı"; yalnız Human).
- Sekmeler: "Genel Bakış / Overview", "İzinler / Permissions", ("API Anahtarları / API Keys" — yalnız Service hesaplarda),
  "Oturumlar / Sessions", "Aktivite / Activity".
  - Genel Bakış: "Profil Bilgileri / Profile Information" (E-posta, Telefon, Saat Dilimi, Dil), "Rol ve Departman /
    Role & Department" (Rol, Unvan, Departman), "Aktivite / Activity" (Son Giriş, Son Aktivite, Davet Edildi, Aktif
    Oturumlar), "Güvenlik / Security" (Risk Seviyesi, Çok Faktörlü Kimlik Doğrulama, Kiracı Kimliği). Boş değer "N/A".
  - İzinler: "İzinler (n)" — kişinin rol(ler)inden gelen izin kartları (ad, kaynak • eylem, kapsam rozeti, kritikse
    "Kritik / Critical"). Salt okunur.
  - Oturumlar: yalnız aktif oturum sayısı. Aktivite: yer tutucu metin.
  - API Anahtarları (Service): anahtar adı, maskeli önek, durum; değer gösterilmez. Servis hesabı anahtarları bu ekrandan
    yönetilmez — mağaza API anahtarları için [../settings/api-keys.md](../settings/api-keys.md).
- Alt butonlar:
  - Human: "Profili Düzenle / Edit Profile", "İzinleri Yönet / Manage Permissions", "Askıya Al / Suspend" ya da (askıdaysa)
    "Yeniden Etkinleştir / Reactivate".
  - Service: "Anahtarları Yönet / Manage Keys", "Yapılandırmayı Düzenle / Edit Config", "Devre Dışı Bırak / Disable" ya da
    "Yeniden Etkinleştir / Reactivate".

## Alanlar

### "Takım Üyesi Davet Et / Invite Team Member" diyaloğu
Açıklama: "Yeni bir takım üyesine davetiye gönderin. Hesabını kurmak için talimatları içeren bir e-posta alacaktır."

| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| E-posta Adresi / Email Address | Input (zarf ikonlu) | evet | geçerli e-posta ("Lütfen geçerli bir e-posta adresi girin") | label "E-posta Adresi", placeholder `kullanici@sirket.com` / `user@company.com` | Kişinin giriş adı olur; sonradan bu ekrandan değişmez. Mağazada benzersiz (409) |
| Görünen Ad / Display Name | Input | evet | ≥2 karakter ("Görünen ad en az 2 karakter olmalıdır"), ≤100 | label "Görünen Ad" / "Display Name" (ekrandaki yazımı snapshot'tan al) | |
| Departman / Department | Select (placeholder "Departman seçin") | hayır | — | label "Departman" | Mühendislik, Pazarlama, Satış, Müşteri Desteği, Finans, İnsan Kaynakları, Operasyon |
| İş Unvanı / Job Title | Input | hayır | ≤100 | label "Is Unvani" / "Job Title" | |
| Roller / Roles | Checkbox kartları (çoklu) | evet | en az 1 ("En az bir rol gereklidir") | label "Roller"; her kartta rol adı + açıklama; karta ya da checkbox'a tıkla | "Bu kullanıcıya atamak için bir veya daha fazla rol seçin". Yönetici rolünde "Yonetici / Admin" kırmızı rozeti |
| Davetiye e-postası gönder / Send invitation email | Checkbox | — | **işaretli** | label "Davetiye e-postasi gonder" | "Kullanıcı giriş talimatlarını içeren bir e-posta alacaktır" |
| Çok faktörlü kimlik doğrulama gerektir / Require multi-factor authentication | Checkbox | — | işaretsiz | label "Cok faktorlu kimlik dogrulama gerektir" | "Kullanıcı sisteme erişmeden önce MFA kurmalıdır". MFA'yı kişi kendisi kurar |

Butonlar: "İptal / Cancel", "Davetiye Gönder / Send Invitation" (gönderirken "Davetiye Gonderiliyor..."). Validasyon
hataları alan altında görünür.

### "Kullanıcı Profilini Düzenle / Edit User Profile" diyaloğu
Açıklama: "{ad} kullanıcısının profil bilgilerini güncelleyin."

| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Görünen Ad / Display Name | Input | evet | ≥2, ≤100 | label "Görünen Ad" | Ad/soyad buradan türetilir (ilk kelime ad, kalanı soyad) |
| Departman / Department | Select | hayır | — | label "Departman" | Seçenekler İngilizce: Engineering, Marketing, Sales, Customer Support, Finance, Human Resources, Operations, Product, Design, Legal |
| Unvan / Job Title | Input | hayır | ≤100 | label "Unvan" | |
| Saat Dilimi / Timezone | Select | hayır | — | label "Saat Dilimi" | UTC, Istanbul (TRT), London, Paris, New York … |
| Dil / Language | Select | hayır | — | label "Dil" | English, Turkish, German, French, Spanish, Portuguese, Arabic, Chinese, Japanese |
| Telefon Numarası / Phone Number | Telefon input (ülke kodlu) | hayır | ≤20 | label "Telefon Numarası" | "İki faktörlü kimlik doğrulama ve acil bildirimler için kullanılır" — kişisel veri |

- E-posta, rol ve şifre bu diyalogda **yok**. Kayıtlı kişinin rolünü değiştiren bir kontrol bu ekranda yok
  (doğrulanmadı — rol ihtiyacında kullanıcıya bildir; Claude dolaylı yol aramaz).
- Butonlar: "İptal / Cancel", "Değişiklikleri Kaydet / Save Changes".

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Kullanıcı Davet Et → diyalog → Davetiye Gönder | Kişi "Davet Edildi / Invited" durumunda oluşur; seçilen roller atanır; e-posta seçiliyse kişiye davet e-postası gider. Davet bağlantısı 7 gün geçerli (doğrulanmadı) | "Davetiye gonderildi" — "{email} adresine bir davetiye gonderildi." / "Invitation sent"; hata: "Davetiye gonderilemedi" |
| Çekmece → Profili Düzenle → Değişiklikleri Kaydet | Görünen ad, departman, unvan, saat dilimi, dil, telefon güncellenir | "Profil güncellendi" — "Kullanıcı profili başarıyla güncellendi." / "Profile updated"; hata "Güncelleme başarısız" |
| Çekmece → Askıya Al (Service: Devre Dışı Bırak) | **Diyalogsuz, anında**: durum "Askıya Alındı", hesap pasif; kişi panele giremez. Gerekçe otomatik "Yönetici tarafından askıya alındı" | "Kullanıcı askıya alındı" — "{ad} askıya alındı." / "User suspended"; hata "Askıya alma başarısız" |
| Çekmece → Yeniden Etkinleştir | **Diyalogsuz, anında**: durum "Aktif" | "Kullanıcı yeniden etkinleştirildi" / "User reactivated"; hata "Yeniden etkinleştirme başarısız" |

- Bu ekranda kullanıcı **silme** butonu yok. Kalıcı kaldırma gerekiyorsa kullanıcıya bildir; Claude başka yol aramaz.

## Onay zamanlaması (kural 2/5/6)
- **Davet:** özet tablosu (ortam, e-posta, görünen ad, departman, unvan, roller ve her rolün ne sağladığı, davet e-postası
  gidecek mi, MFA zorunlu mu) + açık onay. **Dış etki:** davet edilen adrese e-posta gider (geri alınamaz). Prod'da test
  adresiyle davet atma.
- **Askıya Al / Devre Dışı Bırak / Yeniden Etkinleştir:** buton **diyalog sormadan anında** kaydeder → onay butona
  **dokunmadan önce** alınır; geri alınamaz işlem sınıfında (kural 5) tek tek, "etkilenen: 1 kullanıcı (ad, e-posta)" ile.
  Etki: kişi panele erişemez; kişinin açık oturumları ve yürüttüğü işler üzerindeki etki doğrulanmadı — özette belirt.
- **Profil düzenleme:** normal özet + onay. Telefon kişisel veri; değeri kullanıcı verir, Claude uydurmaz.
- Rol vermek = yetki vermek: "Admin" gibi geniş rolleri seçmeden önce kullanıcıdan rolü **adıyla** teyit al.

## Yan etkiler
- Tüm işlemler denetim günlüğüne yazılır (davet, askıya alma, yeniden etkinleştirme, rol değişikliği).
- Davet edilen kişi şifresini davet bağlantısından kendisi belirler; "MFA gerektir" seçiliyse ilk girişte 2FA kurulumu
  ister ([../../project/environments-and-auth.md](../../project/environments-and-auth.md) §5).
- Rol, kişinin sidebar'da gördüğü menüleri ve buton görünürlüğünü belirler; değişiklik kişinin bir sonraki girişinde/
  yenilemesinde yansır (doğrulanmadı).

## Tuzaklar
- **Kendini kilitleme:** Claude'un kullandığı oturumun sahibini (giriş yapmış kullanıcıyı) **asla** askıya alma; çekmecede
  e-postayı header'daki kullanıcı menüsündeki e-postayla karşılaştır. Aynıysa dur, kullanıcıya sor.
- **Son yönetici:** mağazadaki tek `admin`/`super_admin` kullanıcıyı askıya almak mağazayı yönetilemez bırakabilir. Askıya
  almadan önce listede "Rol" sütunundan başka aktif yönetici olduğunu doğrula; yoksa yapma, kullanıcıya bildir.
- Askıya Al butonu onay sormaz; yanlış satırda çekmece açıkken tıklamak doğrudan uygulanır. Tıklamadan önce çekmece
  başlığındaki ad/e-postayı snapshot ile teyit et.
- Askıya alma / yeniden etkinleştirme işlemini yalnız çekmecenin alt butonuyla yap; sonucu toast ve durum rozetiyle doğrula.
- Davet diyaloğunda etiketleri ekranda göründüğü yazımla (snapshot'tan) kullan; gerekirse en etiketini ya da regex kullan.
- Durum rozetleri ve risk değerleri arayüz dilinden bağımsız İngilizce ham metin olarak görünür; filtre çipleri ise çevrilidir.
- Liste filtresi tarayıcıda çalışır; çok kullanıcılı mağazada aramayı tablo yüklendikten sonra yap.
- "Service" (robotik) hesaplar entegrasyon içindir; Claude bunları devre dışı bırakırsa entegrasyon durur — ayrıca uyar.

## Doğrulama
1. Toast metni.
2. Davette: tabloda yeni satır, durum `invited`, Rol sütunu seçilen rol; çekmece → Genel Bakış → "Davet Edildi" tarihi.
3. Profil düzenlemede: çekmece → Genel Bakış alanları yeni değerlerle.
4. Askıya alma/yeniden etkinleştirmede: satır durum rozeti `suspended` / `active`; çekmece alt butonu "Yeniden Etkinleştir" /
   "Askıya Al" olarak değişmiş.
