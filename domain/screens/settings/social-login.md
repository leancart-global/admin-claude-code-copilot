# Giriş / Sosyal Sağlayıcılar (Login / Social Providers)

> **Operatör sınırı**
> - Claude sağlayıcının "Etkin / Enabled" durumunu ve gizli olmayan İstemci Kimliğini (kullanıcı verdiyse) onayla doldurabilir.
> - Claude **İstemci Gizli Anahtarı (Client Secret) alanına hiç yazmaz ve okumaz**; kullanıcı tarayıcıda kendisi yapıştırır.
> - Her kartın "Kaydet" butonu yalnız o sağlayıcıyı kaydeder ve vitrindeki giriş seçeneklerini değiştirir — kart başına ayrı özet + onay.
> - Google/Facebook geliştirici konsolundaki uygulama ayarları bu ekranın dışındadır; Claude orada işlem yapmaz.

- URL: {ADMIN_URL}/settings/social-login
- Menü yolu: "Ayarlar / Settings" → "Giriş / Sosyal Sağlayıcılar / Login / Social Providers".
- Sayfa başlığı: "Giriş / Sosyal Sağlayıcılar"; açıklama "Müşterilerinizin Google veya Facebook hesabıyla giriş yapmasına izin verin."
- Amaç: Vitrin müşteri girişinde "Google ile giriş" ve "Facebook ile giriş" seçeneklerini açıp kapatmak ve bunlar için sağlayıcıdan alınan OAuth uygulama bilgilerini kaydetmek.
- Yetki: görüntüleme `settings:read`; kaydetme `settings:write`.
- Hassas ekran: **evet**. Anında kaydeden alan yok — "Etkin" switch'i dahil her şey kartın "Kaydet" butonuyla kaydedilir.

## Gizli alanlar — Claude dokunmaz
- **İstemci Gizli Anahtarı / Client Secret** (her iki kartta). Kayıtlı değer hiçbir zaman gösterilmez; kayıtlıysa alan placeholder'ı "•••••••• (kayıtlı) / (saved)" olur ve altında "Mevcut gizli anahtarı korumak için boş bırakın." yazar.
- Claude bu alanı okumaz, yazmaz, kopyalamaz; snapshot çıktısını sohbete aktarmaz. Kullanıcıya: "Client Secret'ı sağlayıcı konsolundan alıp bu alana kendin yapıştır; ben görmeyeceğim. Bitince haber ver."
- İstemci Kimliği (Client ID) gizli değildir; kullanıcı verirse Claude yazabilir, yoksa kullanıcı girer.

## Ön koşullar ve bağımlılıklar
- Google Cloud / Meta geliştirici konsolunda oluşturulmuş OAuth uygulaması (kullanıcının işi). OAuth uygulamasında tanımlanacak yönlendirme (redirect) adresini kullanıcı sağlar.
- Etkiler: vitrin müşteri giriş/kayıt ekranındaki sosyal giriş butonları (doğrulanmadı).

## Yerleşim
- Başlık + açıklama; altında iki kart: **Google** ("Müşterilerin Google ile giriş yapmasına izin verin.") ve **Facebook** ("…Facebook ile giriş yapmasına izin verin.").
- Her kart: başlık satırında "Etkin / Enabled" switch'i; gövdede İstemci Kimliği, İstemci Gizli Anahtarı; sağ altta "Kaydet / Save".
- Yükleme hatası: "Giriş ayarlarınız yüklenemedi. Lütfen sayfayı yenileyin."

## Alanlar
| Kart | Label (tr / en) | Kontrol | Zorunlu | Varsayılan / validasyon | Locator | Not |
|---|---|---|---|---|---|---|
| Google / Facebook | Etkin / Enabled | Switch | — | kapalı (hiç kurulmadıysa) | `#google-enabled` / `#facebook-enabled` | Etkin kaydetmek için İstemci Kimliği **ve** gizli anahtar (yeni girilmiş ya da kayıtlı) gerekir |
| Google / Facebook | İstemci Kimliği / Client ID | Input | kaydetmek için evet | placeholder "Sağlayıcınızdan aldığınız İstemci Kimliğini yapıştırın" | `#google-client-id` / `#facebook-client-id` | Gizli değil |
| Google / Facebook | İstemci Gizli Anahtarı / Client Secret | password | ilk etkinleştirmede evet | placeholder "Sağlayıcınızdan aldığınız Gizli Anahtarı yapıştırın" veya "•••••••• (kayıtlı)" | `#google-client-secret` / `#facebook-client-secret` | 🔒 Claude dokunmaz; boş = mevcut korunur |

## Aksiyonlar
| Aksiyon | Ne olur | Toast | Onay |
|---|---|---|---|
| Kaydet (kart) | Etkin açık ama İstemci Kimliği veya gizli anahtar eksikse kaydetmez, kart içinde kırmızı uyarı "Bu sağlayıcıyı etkinleştirmeden önce bir İstemci Kimliği ve Gizli Anahtar girin." Aksi halde o sağlayıcıyı kaydeder | "{provider} giriş ayarları kaydedildi." / hata "Değişiklikleriniz kaydedilemedi. Lütfen tekrar deneyin." | Kart başına özet + onay |

## Yan etkiler
- Etkin + kaydedildi: vitrinde ilgili sosyal giriş seçeneği müşterilere sunulur (yayına yansıma süresi doğrulanmadı).
- Etkin kapatılıp kaydedildi: o sağlayıcıyla giriş seçeneği kalkar; bu yöntemle kayıtlı müşterilerin nasıl giriş yapacağı doğrulanmadı — kullanıcıyı uyar.

## Tuzaklar
- Switch'i değiştirmek tek başına kaydetmez; kartın kendi "Kaydet"i gerekir. İki kart ayrı ayrı kaydedilir.
- Yanlış İstemci Kimliği / gizli anahtar kaydı hata vermeyebilir; sorun ancak vitrinde girişte ortaya çıkar — kullanıcıya vitrinde deneme önerilir (giriş işlemini kullanıcı yapar).

## Doğrulama
1. Sayfayı yenile: switch durumu, İstemci Kimliği değeri; gizli anahtar alanında "(kayıtlı)" placeholder'ı (değer okunmaz).
2. Kullanıcıdan vitrin giriş ekranında butonun görünüp çalıştığını kendisinin denemesini iste.
