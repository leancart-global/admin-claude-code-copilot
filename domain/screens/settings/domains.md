# Özel Alan Adları (Custom Domains)

> **Operatör sınırı**
> - Claude alan adı ekleyebilir (onayla), ekranda gösterilen DNS kayıt bilgilerini (tür, ad, değer, trafik hedefi) okuyup kullanıcıya aktarabilir, "DNS'yi doğrula" / "Tekrar kontrol et" ile durumu sorgulayabilir.
> - DNS kayıtlarını kullanıcı kendi alan adı sağlayıcısında (DNS barındırıcısında) girer; Claude oraya erişmez.
> - **Sertifika ve özel anahtar dosyalarını kullanıcı kendisi seçip yükler**; Claude özel anahtar dosyasını seçmez, yüklemez, içeriğini görmez.
> - Alan adını kaldırmak, sertifika modunu seçmek/"Otomatik sertifikaya geç" ve sertifika yenileme vitrinin o adresten erişilebilirliğini değiştirir — her biri ayrı özet + onay; kaldırma ve otomatiğe geçiş kural 5 (geri alınamaz / vitrini erişilemez yapabilir).

- URL: {ADMIN_URL}/settings/domains
- Menü yolu: "Ayarlar / Settings" → "Alan Adları / Domains".
- Sayfa başlığı: "Özel Alan Adları / Custom Domains"; açıklama "Mağazanıza kendi alan adınızı bağlayın." Kart: "Alan adlarınız" — "Sahip olduğunuz bir alan adını ekleyin, doğrulayın ve sertifikasını yükleyerek yayına alın."
- Amaç: Mağaza vitrinini varsayılan adres yerine kullanıcının kendi alan adından (ör. `magaza.ornek.com`) yayınlamak: alan adı ekleme → DNS ile sahiplik doğrulama → trafiği yönlendirme → SSL sertifikası (otomatik veya yüklenen) → yayında.
- Yetki: menü `settings:read`; liste `domains:read`; ekleme, doğrulama, sertifika, mod seçimi, kaldırma `domains:write` (yoksa ekle butonu ve tüm aksiyonlar gizli).
- Hassas ekran: **evet** (özel anahtar yükleme; vitrin erişilebilirliği). Anında kaydeden kontroller: sertifika yöntemi seçim kartları ("Otomatik (önerilen)" / "Kendi sertifikamı yükleyeceğim") — tıklama hemen kaydedilir.

## Gizli alanlar — Claude dokunmaz
- **Özel anahtar / Private key** dosyası (sertifika yükleme ve yenileme formunda). Claude bu dosyayı seçmez, `browser_file_upload` ile yüklemez, içeriğini okumaz. Kullanıcıya: "Sertifika ve özel anahtar dosyalarını formda kendin seç ve 'Sertifika yükle'ye bas; ben dosyaları görmeyeceğim."
- Sertifika dosyası (public) gizli değildir ama özel anahtarla aynı formda yüklendiği için akışı kullanıcı yürütür.
- **Gizli olmayan:** DNS kayıt türü/adı/değeri ve trafik hedefi — bunlar kullanıcının DNS sağlayıcısına gireceği bilgilerdir; Claude okuyup sohbete aktarabilir.

## Durumlar (rozet)
| Durum | Rozet (tr / en) | Ekranda beklenen aksiyon |
|---|---|---|
| DNS bekleniyor | "DNS bekleniyor / Waiting for DNS" | DNS kaydını yayınla → "DNS'yi doğrula" |
| Sertifika bekleniyor (yöntem seçilmedi / manuel) | "DNS doğrulandı — sertifika yükleyin / DNS verified — upload certificate" | Sertifika yöntemi seç; manuelde sertifika yükle |
| Otomatik sertifika alınıyor | "Sertifika alınıyor… / Issuing certificate…" | Bekle; ilerleme aşamaları: "Alan adınızın buraya yönlendirilmesi bekleniyor" → "Alan adınız doğrulanıyor" → "Sertifikanız hazırlanıyor" → "Sertifika hazır" |
| Yayında | "Yayında / Live" | — (manuelde "Sertifikayı yenile", "Otomatik sertifikaya geç") |
| Süresi yakında doluyor / doldu | "Sertifikanın süresi yakında doluyor" / "…doldu" | Yenile |
| Hata | "Sertifika hatası / Certificate error" | "Tekrar dene / Retry" |

Kartta ayrıca sertifika özeti: "{issuer} tarafından verildi" (otomatikte "Let's Encrypt (otomatik)"), güven durumu ("Genel olarak güvenilir" / "…güvenilir değil — ziyaretçiler bir güvenlik uyarısı görecek" / "Güven durumu doğrulanmadı…"), "… gün içinde sona eriyor".

## Yerleşim
- Sağ üst: "Alan adı ekle / Add domain".
- Liste: alan adı başına kart (`data-testid="domain-card-<alan adı>"`): alan adı, durum rozeti, sertifika özeti; sağda (Yayında + manuel ise) "Sertifikayı yenile / Renew certificate" açılır butonu ve kaldır ikonu (aria-label "{domain} kaldır"). Kartın altında duruma göre aksiyon bölümü (DNS talimatları / yöntem seçimi / yükleme formu / otomatik ilerleme / tekrar dene / otomatiğe geç).
- Yalın alan adı + www birlikte eklendiyse tek **grup kartı**: "Tüm 2 alan adını tek bir sertifika kapsıyor", "Alan adı ayrıntılarını göster/gizle", grup kaldırma.
- Boş durum: "Henüz özel alan adı yok".

## Alanlar ve adımlar

### 1. Alan adı ekle (dialog "Özel alan adı ekle / Add a custom domain")
| Label (tr / en) | Kontrol | Zorunlu | Validasyon | Locator | Not |
|---|---|---|---|---|---|
| Alan adı / Domain name | Input (placeholder "magaza.ornek.com") | evet | Boş: "Devam etmek için bir alan adı girin"; biçim: "magaza.ornek.com gibi geçerli bir alan adı girin" | `#domain` | Küçük harfe çevrilir |
| "{www.alanadi} adresini de ekle / Also add …" | Checkbox | — | yalnız yalın (iki parçalı, www'suz) alan adında görünür | `#include-www` | İşaretlenirse www ile birlikte tek sertifika grubunda eklenir. |

- "Alan adı ekle / Add domain" (submit) → toast "{domain} eklendi. Sahiplik doğrulaması için aşağıdaki DNS kaydını yayınlayın." → dialog **"Alan adı sahipliğini doğrula"** adımına geçer. www bağlanamazsa sarı uyarı "{domain} eklendi, ancak www sürümü buna bağlanamadı: {reason}". Hata: "Bu alan adı eklenemedi…" / "www yalnızca example.com gibi yalın bir alan adı için otomatik olarak bağlanabilir."
- Onay: alan adı ekleme kalıcı kayıttır → özet + onay.

### 2. DNS sahiplik doğrulaması (dialogda ve kartta)
- Metin: "Bu alan adına sahip olduğunuzu kanıtlamak için alan adı sağlayıcınıza (DNS barındırıcınıza) bu kaydı ekleyin."
- Kopyalanabilir alanlar: **Kayıt türü / Record type**, **Kayıt adı / Record name**, **Kayıt değeri / Record value** (kopyala butonu aria-label "{alan} kopyala"). Claude bunları okuyup kullanıcıya tablo olarak verir.
- Trafik yönlendirme: "Mağazanıza ulaşması için alan adınızın trafiğini buraya yönlendirin:" + **Trafik hedefi / Traffic target** + "Tekrar kontrol et / Check again" → sonuç "Alan adınız doğru şekilde buraya yönlendirilmiş." veya "Alan adınız şu anda {observed} adresine yönlendiriliyor. … {expected} adresine değiştirin."
- "DNS'yi doğrula / Verify DNS" → başarı "DNS sahipliği doğrulandı. Yayına almak için bir sertifika yükleyin."; henüz yoksa "DNS henüz algılanmadı — bu birkaç dakika sürebilir, tekrar deneyin." veya "…trafiği henüz bize yönlendirilmiyor — …ulaştığında doğrulama otomatik olarak başarılı olacaktır."
- Doğrula / Tekrar kontrol et yalnız DNS'i sorgular; dış sisteme yazmaz. Doğrulama başarılı olursa durum değişir (kayıt güncellenir) — kullanıcıya haber vererek çalıştırılabilir. Tüm eklenenler doğrulanınca dialog kendiliğinden kapanır; "Tamam / Done" ile de kapanır.

### 3. Sertifika yöntemi (durum: DNS doğrulandı)
- "Bu alan adı sertifikasını nasıl almalı?" — iki kart buton:
  - **"Otomatik (önerilen)"** — "Sertifikanızı sizin için isteyip yenileriz." (Ortamda kullanılamıyorsa "Otomatik sertifikalar bu ortamda henüz kullanılamıyor — şimdilik kendi sertifikanızı yükleyin.")
  - **"Kendi sertifikamı yükleyeceğim"** — yükleme formunu açar.
- Tıklama **anında kaydedilir** → önce onay. Hata: "Bu seçim kaydedilemedi."
- Otomatikte sertifika, alan adı trafiği hedefe yönlendirildikten sonra kendiliğinden alınır; sorun mesajları (ör. "Alan adınız henüz bize yönlendirilmiyor…", "…CAA kaydını kaldırın veya güncelleyin…") otomatik yeniden denemeyle devam eder.

### 4. Sertifika yükleme / yenileme formu (kullanıcı yürütür)
| Label (tr / en) | Kontrol | Not |
|---|---|---|
| Sertifika / Certificate | dosya seç ("Dosya seç / Choose file") | PEM dosyası |
| Özel anahtar / Private key | dosya seç | 🔒 Claude dokunmaz |
- "Sertifika yükle / Upload certificate" → "Sertifika yüklendi. Bu alan adı artık yayında."; yenilemede "Sertifikayı yenile" → "Sertifika yenilendi." Hata: "…dosyaları kontrol edip tekrar deneyin." Grup kartında sertifika tüm alan adlarını kapsamazsa uyarı (ör. joker `*.example.com` yalın `example.com`'u kapsamaz).
- Yükleme ve yenileme vitrinde o alan adının sunduğu sertifikayı hemen değiştirir.

## Aksiyonlar (kart)
| Aksiyon | Ne olur | Toast | Onay |
|---|---|---|---|
| Kaldır (ikon) | AlertDialog "Bu alan adı kaldırılsın mı?" — "{domain} mağazanız için çalışmayı durduracak. Daha sonra tekrar ekleyebilirsiniz." → "Alan adını kaldır" | "{domain} kaldırıldı." / grup üyesi varsa "{domain} hâlâ {members} ile bir sertifikayı paylaşıyor — önce {members} kaldırın…" | **Kural 5** — vitrin o adresten erişilemez olur; tek tek onay |
| Grup kaldır | "Bu alan adları kaldırılsın mı?" — ikisini birden kaldırır → "Alan adlarını kaldır" | "{hosts} kaldırıldı." | Kural 5, etkilenen alan adı sayısıyla |
| Otomatik sertifikaya geç | Onay "Otomatik sertifikaya geçilsin mi?" — "…Bu işlem buradan geri alınamaz…geri dönmek için alan adını kaldırıp yeniden eklemeniz gerekir." → "Otomatiğe geç" | "{domain} artık otomatik sertifika kullanıyor." / "…DNS kaydını kontrol edip tekrar deneyin." | Kural 5 |
| Sertifikayı yenile | Yenileme formunu açar/kapatır | — | Yüklemeyi kullanıcı yapar |
| Tekrar dene (hata durumu) | Sertifika alımını yeniden başlatır | "Tekrar deneniyor..." / "Bu işlem şu anda tekrar denenemedi." | Kısa onay |

## Ön koşullar ve bağımlılıklar
- Kullanıcının sahip olduğu alan adı ve DNS sağlayıcısına erişimi.
- Etkiler: vitrinin erişildiği adres(ler), SSL; mağaza görünümü yönlendirmesi (`/settings/store-views` alan adı eşlemesi — doğrulanmadı).

## Yan etkiler
- Sahiplik doğrulama + sertifika tamamlanıp trafik yönlendirildiğinde vitrin yeni alan adından yayında olur.
- Kaldırma, yöntem değişimi ve sertifika yenileme o alan adındaki vitrin erişimini/güvenlik sertifikasını anında etkiler.

## Tuzaklar
- DNS değişiklikleri dakikalar–saatler sürebilir; "henüz algılanmadı" normaldir, birkaç dakika sonra tekrar dene.
- Yalın alan adı + www grubunda tek sertifika iki adresi de kapsamalı; grup üyeleri tek tek kaldırılamaz.
- Otomatiğe geçiş geri alınamaz; yüklenmiş sertifika yeni sertifika hazır olunca kullanılmaz.
- Özel anahtar dosyası Claude'a hiçbir şekilde verilmez; kullanıcı yolunu sohbete yazsa bile Claude yüklemez.

## Doğrulama
1. Kart rozeti beklenen durumda (ör. ekleme sonrası "DNS bekleniyor").
2. DNS adımında "DNS'yi doğrula" sonucu toast'ı; rozet "DNS doğrulandı — sertifika yükleyin" veya otomatik akış.
3. Yayında: rozet "Yayında", sertifika özeti (veren, güven durumu, kalan gün). Kullanıcıdan alan adını tarayıcıda açıp kilidi kontrol etmesini iste.
