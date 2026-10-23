# Marka sesi — içerik üretmeden önce

Claude'un yazdığı her metin bu kurala uyar: blog yazısı, CMS sayfası, ürün açıklaması, SEO başlığı ve açıklaması,
kategori ve marka açıklaması, ana sayfa ya da banner metni, bildirim şablonu, form metinleri, çeviri.

## 1. Önce mevcut marka sesini oku (salt okunur)
Kaynaklar şu sırayla okunur:

| Kaynak | Nerede | Ne alınır |
|---|---|---|
| Kullanıcının verdiği marka rehberi | Sohbette paylaşılan doküman, dosya ya da link | Ses ve ton, hitap, yasaklı ya da tercih edilen ifadeler, örnek metinler. Varsa bu her şeyin önüne geçer. |
| Onaylanmış marka sesi | `config/local.json` → `tenantContext.brandVoice` | Daha önce kullanıcıyla kararlaştırılan ses (bkz. §3) |
| Branding › Kimlik | `{ADMIN_URL}/branding` ([../screens/design/branding.md](../screens/design/branding.md)) | Marka adı, slogan (EN/TR), **Marka Tonu / Brand Tone**: Lüks, Minimal, Eğlenceli, Profesyonel, Cesur |
| Mevcut yayındaki içerik | Blog, sayfalar, ürün açıklamaları | Mağazanın fiilen kullandığı dil: sen/siz, cümle uzunluğu, emoji, terimler |

- Branding'de Marka Tonu bir seçimdir ve varsayılan değeri "Profesyonel"dir. Bilinçli olarak seçilip seçilmediği
  anlaşılamaz. Rehber ya da onaylanmış ses yoksa bu tek başına yeterli sayılmaz; tonu kullanıcıya teyit ettir.
- Admin'de ayrıntılı bir marka rehberi alanı yoktur (hitap, yasaklı kelimeler, örnekler). Ayrıntı yalnız kullanıcının
  rehberinden ya da onaylanmış sesten gelir.

## 2. Marka sesi varsa
- Taslak bu sese göre yazılır. Özette "Marka sesi: {kaynak} — {ton, hitap}" satırı bulunur.
- Kullanıcının istediği metin ses ile çelişiyorsa (ör. ton Lüks, istenen metin şakacı) bunu belirt ve sor.

## 3. Marka sesi yoksa: öner, onay al
İlk taslaktan **önce** kullanıcıya kısa bir marka sesi önerisi sun. Öneri Branding'deki ad, slogan ve tondan, mevcut
içerikten ve satılan ürünlerden çıkarılır:

| Öğe | Örnek |
|---|---|
| Ton | Profesyonel ama sıcak |
| Hitap | "siz" (TR) / "you" (EN) |
| Kişilik (3 sıfat) | güvenilir, sade, yardımsever |
| Yapılır | kısa cümleler, somut fayda, ürün özelliğini kanıtla anlat |
| Yapılmaz | abartılı süperlatif, ünlem yağmuru, rakip kıyası, doğrulanmamış iddia |
| Örnek cümle | "Gün boyu rahat: nefes alan pamuklu kumaş, kolay bakım." |

- Kullanıcı onaylar ya da düzeltir. Onaylanan ses `config/local.json` → `tenantContext.brandVoice` altına yazılır
  (ton, hitap, kişilik, yapılır/yapılmaz, örnek, tarih). Bu dosya yereldir ve admin'de kayıt oluşturmaz.
- İsterse kullanıcıya Branding'deki **Marka Tonu**'nu da güncellemeyi öner. Branding canlı bir ekrandır; değişiklik
  "Mağazaya Yayınla" ile vitrine gider. Kural 6 gereği onay, alana dokunmadan önce alınır.
- Kullanıcı öneriyi istemezse: metni nötr ve profesyonel bir dille yaz, özette "marka sesi tanımlı değil — varsayılan"
  diye işaretle.

## 4. Çok dilli içerik
Ses her dilde aynı kalır. Hitap dile göre karşılanır (TR "siz"/"sen", EN "you"). Çeviri birebir değil, aynı sesle
yeniden yazılır. Slogan için Branding'deki dil karşılığı kullanılır.
