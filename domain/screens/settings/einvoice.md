# e-Fatura Ayarları (E-Invoice Settings) — fatura modu + sağlayıcılar + yapılandırma

> **Operatör sınırı**
> - Claude fatura modunu, muhasebe programını, sağlayıcı seçimini ve fatura ayarlarını (ön ekler, GİB etiketleri, şube, otomatik fatura) kullanıcı onayıyla doldurabilir.
> - Claude **kimlik bilgisi alanlarına (WS Şifre, Client Secret, Paraşüt Şifre, API Şifresi vb.) hiç yazmaz ve okumaz**; kullanıcı adı dahil sağlayıcı giriş bilgilerini kullanıcı tarayıcıda kendisi girer.
> - **Canlı Ortam'a geçiş** ve **Otomatik Fatura**'yı açmak GİB'e gerçek fatura gönderilmesine yol açar: ayrı satırla özetlenir, açık onay; prod'da ekstra uyarı.
> - "Bağlantı Test Et" sağlayıcıya gerçek istek gönderir (dış etkili, kısa onay). "Kaldır" geri alınamaz (kural 5). Aktif/Pasif ve Varsayılan Yap anında kaydeder — önce onay.

## 1. Ana ekran — `/settings/einvoice`
- URL: {ADMIN_URL}/settings/einvoice
- Menü yolu: "Ayarlar / Settings" → "e-Fatura / E-Invoice". Ayarlar hub'ında da kart.
- Amaç: Mağazanın siparişler için faturayı nasıl keseceğini seçmek (platform üzerinden e-Fatura/e-Arşiv, muhasebe programı veya muhasebeci/manuel) ve platform modunda e-Fatura sağlayıcısını (Paraşüt, Sovos/FitBulut) kurmak, test etmek, varsayılanı seçmek.
- Yetki: menü `settings:read`; ayrı izin adı doğrulanmadı.
- Hassas ekran: **evet**. Anında kaydeden kontroller: sağlayıcı satırındaki "Aktif Et / Pasif Et" ve "Varsayılan Yap".

### Kart 1 — Fatura Modu / Invoice Mode ("Mağazanız için faturaların nasıl yönetileceğini seçin")
| Seçenek (kart butonu) | Açıklama | Ek alan |
|---|---|---|
| Platform Faturalama / Platform Invoicing | "Faturalar bu platform üzerinden otomatik oluşturulur ve GİB'e gönderilir" | Altında sağlayıcı tablosu görünür |
| Muhasebe Programı / Accounting Software | "Muhasebe programınız fatura keser. Biz durumu takip ederiz." | Select "Muhasebe Programı" (`#accountingSoftware`, placeholder "Program seçin..."): Logo, Nebim, Mikro, Eta, Paraşüt, Diğer |
| Muhasebeci / Manuel / Accountant / Manual | "Muhasebeceniz harici olarak fatura keser. PDF yükleyebilirsiniz." | Bilgi: "Faturalar sipariş detay sayfasından PDF olarak yüklenebilir. Otomatik işlem yapılmaz." |

- Seçili kartta onay ikonu. "Kaydet / Save" (mod seçilmeden pasif) → toast "Fatura modu başarıyla güncellendi"; hata "Fatura modu güncellenemedi". Kart tıklaması kaydetmez; yalnız Kaydet kaydeder.
- Sağlayıcı tablosu **yalnızca "Platform Faturalama" seçiliyken** görünür.

### Kart 2 — Sağlayıcılar (yalnız platform modu)
- Başlık "e-Fatura Ayarları" + "{n} yapılandırılmış"; sağda "Sağlayıcı Ekle / Add Provider".
- Filtre butonları: Tümü / Yapılandırılmış / Kurulmamış.
- Tablo: Sağlayıcı · Durum ("Aktif", "Pasif", "Kurulmamış") · Ortam ("Test Ortamı / Sandbox", "Canlı / Live") · Varsayılan (yıldız) · "⋯" (aria-label "İşlemler / Actions").
- Menü: "Yapılandır / Configure", kuruluysa "Aktif Et / Pasif Et", varsayılan değilse "Varsayılan Yap", "Bağlantı Test Et", varsayılan değilse "Kaldır".

### Sağlayıcı Ekle paneli (sağdan açılan)
- Ön koşul: Genel Ayarlar'da Vergi Kimlik No (VKN) kayıtlı olmalı; yoksa panel açılmaz, hata toast'ı "e-Fatura kurulumu için lütfen Genel Ayarlarda Vergi Kimlik Numaranızı ekleyin" (`/settings/general`).
- Adım 1: sağlayıcı kartları ("e-Fatura" / "e-Arşiv" yetenek rozetleri). Adım 2: alanlar (zorunlular `*`), alan altı açıklamalar:

| Sağlayıcı | Alanlar (ekranda görünen label) |
|---|---|
| Paraşüt | Client ID *, Client Secret * 🔒, Kullanıcı Adı (E-posta) * 🔒(kullanıcı girer), Şifre * 🔒, Firma No * ("Paraşüt URL'sindeki firma numarası"), Fatura Prefix, e-Arşiv Prefix |
| Sovos (FitBulut) | WS Kullanıcı Adı * 🔒(kullanıcı girer), WS Şifre * 🔒, Fatura Prefix, e-Arşiv Prefix, e-Arşiv Şube |

- Locator: `#add-<alan>`; "Kur / Set Up" → toast "Sağlayıcı başarıyla yapılandırıldı". Footer'daki "İptal" adım 1'e döner.
- **Yeni kurulan sağlayıcı Test Ortamı'nda başlar.**

### Liste aksiyonları
| Aksiyon | Ne olur | Toast | Onay |
|---|---|---|---|
| Aktif Et / Pasif Et | Anında | "{provider} aktif edildi" / "{provider} pasif edildi" | Önce onay |
| Varsayılan Yap | Anında; faturalar varsayılan sağlayıcıyla kesilir | "{provider} artık varsayılan sağlayıcı" | Önce onay |
| Bağlantı Test Et | Kayıtlı bilgilerle sağlayıcıya istek | "Bağlantı testi başarılı" / "Bağlantı testi başarısız" | Kısa onay |
| Kaldır | AlertDialog "Sağlayıcı Kaldır" — "{provider} sağlayıcısını kaldırmak istediğinizden emin misiniz? Bu işlem geri alınamaz." | "{provider} kaldırıldı" | Kural 5; varsayılan sağlayıcıda menüde yok |

Servis erişilemezse toast: "e-Fatura hizmeti geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin."

## 2. Yapılandırma — `/settings/einvoice/[id]`
- URL: {ADMIN_URL}/settings/einvoice/<id>; başlık "{provider} Yapılandırması / Configure {provider}"; geri ok listeye.
- Amaç: Sağlayıcı bağlantı bilgilerini, ortamı (test/canlı) ve fatura numaralandırma/otomasyon ayarlarını düzenlemek.

| Kart | Label (tr / en) | Kontrol | Varsayılan / limit | Locator | Not |
|---|---|---|---|---|---|
| Bağlantı Bilgileri | WS Kullanıcı Adı / WS Username (veya Client ID, Şirket ID — sağlayıcıya göre) | Input | kayıtlı değer maskeli/kısaltılmış görünebilir | `#wsUsername` / `#clientId` / `#companyId` | 🔒 kullanıcı girer |
| Bağlantı Bilgileri | WS Şifre / WS Password, Client Secret | password | kayıtlıysa "Mevcut bir şifre zaten ayarlanmış. Mevcut değeri korumak için boş bırakın." | `#wsPassword` / `#clientSecret` | 🔒 boş = korunur |
| Bağlantı Bilgileri › Ortam | "Test Ortamı / Sandbox (Test)" · "Canlı Ortam / Production (Live)" ("Gerçek faturalar için canlı ortamı kullanın") | RadioGroup | kayıtlı | `#env-sandbox` / `#env-production` | **Canlıya geçiş kritik** |
| Firma Bilgileri (salt okunur) | VKN, Firma Unvanı, Vergi Dairesi, İl | metin | Genel Ayarlar'dan | "Genel Ayarlarda Düzenle" linki → `/settings/general` | Burada düzenlenmez; faturalarda bu bilgiler kullanılır |
| Fatura Ayarları | e-Fatura Ön Eki / e-Fatura Prefix | Input (büyük harfe çevrilir) | FT | `#efaturaPrefix` | Fatura numarası ön eki |
| Fatura Ayarları | e-Arşiv Ön Eki / e-Arsiv Prefix | Input (büyük harf) | FA | `#earsivPrefix` | |
| Fatura Ayarları (yalnız Sovos) | GİB Gönderici Etiketi (GB) / GİB Alıcı Etiketi (PK) | Input | boş | `#gibSenderAlias` / `#gibReceiverAlias` | Gizli değil |
| Fatura Ayarları | Şube / Branch | Input | default | `#earsivBranch` | "e-Arşiv faturaları için şube kodu (genellikle 'default')" |
| Fatura Ayarları | Otomatik Fatura / Automatic Invoice | Switch | kapalı | `#autoInvoice` | "Kargo oluşturulduğunda otomatik e-Fatura oluştur ve gönder" — **kritik** |

- Alt çubuk: "Kaydedilmemiş değişiklikler" · "Bağlantı Test Et" (kayıtlı değerlerle) · "İptal" (listeye döner) · "Kaydet" (değişiklik yoksa pasif) → toast "Sağlayıcı ayarları başarıyla kaydedildi"; sayfa kayıtlı değerlerle yenilenir.

## Gizli alanlar — Claude dokunmaz
- Gizli/kimlik bilgisi alanları: **WS Kullanıcı Adı, WS Şifre, Client Secret, Paraşüt Kullanıcı Adı (E-posta) ve Şifre, API Anahtarı / API Şifresi**. Client ID ve Firma No / Şirket ID gizli değildir ama kimlik bilgisi setinin parçasıdır — kullanıcıdan alınır, tahmin edilmez.
- Kayıtlı şifreler geri gösterilmez; boş bırakılan şifre alanı mevcut değeri korur.
- Claude bu alanları okumaz, yazmaz, kopyalamaz; snapshot'taki değerleri sohbete aktarmaz. Kullanıcıya: "Sağlayıcı giriş bilgilerini bu alanlara kendin gir; ben görmeyeceğim. Bitince haber ver."
- Gizli olmayan: fatura modu, muhasebe programı, ortam, ön ekler, GİB etiketleri, şube, otomatik fatura — normal akış + onay.

## Canlı ortam ve otomatik fatura (kritik)
- Test → Canlı: o andan sonra kesilen faturalar GİB'e **gerçek fatura** olarak gider (iptali sınırlı/mevzuata tabi). Özette ayrı satır, prod'da ekstra uyarı; firma bilgilerinin (VKN, unvan, adres) doğru olduğunu kullanıcı teyit eder.
- Otomatik Fatura açık + Canlı: her kargo oluşturulduğunda fatura otomatik kesilip gönderilir. Ayrı satır + onay.

## Ön koşullar ve bağımlılıklar
- Genel Ayarlar'da şirket bilgileri, özellikle VKN (`/settings/general`).
- Sağlayıcı hesabı (Paraşüt / Sovos) ve giriş bilgileri kullanıcıda.
- Etkiler: sipariş detayındaki fatura işlemleri, `/invoices`, kargo oluşturma (otomatik fatura açıksa).

## Tuzaklar
- Mod kartına tıklamak kaydetmez; Kaydet'e basılmadan sayfadan çıkılırsa mod değişmez.
- Mod "Platform" dışındayken sağlayıcı tablosu gizlenir ama sağlayıcı kayıtları silinmez.
- Bağlantı testi kayıtlı değerlerle çalışır: önce (onaylı) Kaydet, sonra test.

## Doğrulama
1. Sayfayı yenile: seçili mod kartında onay ikonu; muhasebe modunda seçili program.
2. Sağlayıcı tablosunda Durum, Ortam, Varsayılan yıldızı.
3. Yapılandırma sayfasını yeniden aç: ortam radyosu, ön ekler, şube, otomatik fatura switch'i; şifre alanlarının altında "zaten ayarlanmış" ipucu (değer okunmaz).
