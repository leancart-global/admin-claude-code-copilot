# API Anahtarları (API Keys)

> **Operatör sınırı**
> - Claude anahtar adı, ortam, izin kapsamları, hız limiti ve IP beyaz listesini kullanıcı onayıyla doldurabilir.
> - Claude anahtar değerini **hiçbir zaman görmez**: oluşturma / yeniden oluşturma sonrası açılan dialogu okumaz, "göster" (göz) ve "kopyala" butonlarına basmaz, dialog açıkken snapshot/screenshot almaz; değeri kullanıcı kendisi kopyalar ve dialogu kendisi kapatır.
> - Oluştur, Yeniden Oluştur, İptal Et, Etkinleştir ve Kalıcı Sil her biri ayrı onay ister; İptal Et / Yeniden Oluştur / Sil anahtarı kullanan entegrasyonları **anında** keser (kural 5).
> - "Canlı / Live" ortamlı anahtar üretim verisine erişir; kullanıcı açıkça istemedikçe ortam "Test" kalır.

- URL: {ADMIN_URL}/settings/api-keys
- Menü yolu: "Ayarlar / Settings" → "API Anahtarları / API Keys". Ayarlar hub'ında da kart olarak bulunur.
- Sayfa başlığı: "API Anahtarları / API Keys"; açıklama "Harici entegrasyonlar için API anahtarlarını yönetin / Manage API keys for external integrations".
- Amaç: Mağaza verisine dışarıdan (ERP, muhasebe, özel entegrasyon) erişecek sistemler için API anahtarı oluşturmak, kapsamını (izinlerini) belirlemek, iptal etmek, yenilemek ve silmek. Mağazanın vitrin görünümünü etkilemez; anahtarı kullanan dış sistemlerin erişimini belirler.
- Yetki: menü `api-keys:read`; listeleme `api_keys:read`; oluşturma / iptal / yeniden oluşturma / etkinleştirme `api_keys:write`; kalıcı silme `api_keys:delete`. Tüm anahtar işlemleri ayrıca yönetici (admin) rolü ister — yetkisiz kullanıcıda işlemler hata toast'ı ile reddedilir.
- Hassas ekran: **evet**. Anında kaydeden kontrol: satır menüsündeki "Etkinleştir / Activate" (onay dialogu yok).

## Gizli alanlar — Claude dokunmaz
- **API anahtarı değeri** — yalnızca "API Anahtarı Oluşturuldu / API Key Created" dialogunda, oluşturma ve yeniden oluşturma sonrasında **bir kez** gösterilir. Dialog kapandıktan sonra tam değer bir daha hiçbir ekranda gösterilmez; listede anahtar yalnızca maskeli/kısaltılmış bir tanımlayıcı ile görünür.
- Kural: Claude bu değeri okumaz, yazmaz, kopyalamaz; snapshot/screenshot çıktısını sohbete aktarmaz. Dialog açıldığında kullanıcıya şunu söyler: **"Anahtar değerini şimdi kendin kopyala ve güvenli bir yere kaydet; ben görmeyeceğim. Bitince 'Tamam / Done' ile dialogu kapat ve bana haber ver."** Dialog kapanana kadar snapshot almaz. Doğrulamaya dialog kapandıktan sonra geçer.
- Kullanıcı anahtar değerini sohbete yapıştırırsa kullanmaz, silmesini ister (CLAUDE.md kural 1).
- Gizli olmayan alanlar (ad, ortam, izinler, hız limiti, IP beyaz listesi) normal akışla, onayla doldurulur.

## Ön koşullar ve bağımlılıklar
- Bağımlılık yok. Anahtarın izinleri yalnızca bu ekrandaki sabit kapsam listesinden seçilir.
- Etkilediği şey: anahtarı kullanan dış sistemler (entegrasyonlar). Web kancaları kapsamı (`Webhooks`) entegrasyonun web kancası yapılandırmasını okuma/yazma iznidir; web kancası aboneliklerini bu ekran oluşturmaz (bkz. `webhooks.md`).

## Yerleşim
- Başlık satırı: başlık + açıklama; sağda "API Anahtarı Oluştur / Create API Key" butonu.
- Güvenlik uyarı kutusu: "Bu anahtarları gizli tutun - mağaza verilerinize tam erişim sağlarlar. / Keep these keys private - they give full access to your store data."
- Filtre: switch "İptal edilmiş anahtarları göster / Show revoked keys" (`#include-inactive`). Kapalıyken yalnız aktif anahtarlar listelenir.
- Anahtar kartları (en yeni üstte). Her kartta: ad, ortam rozeti (`test` / `live`), gerekiyorsa "İptal Edildi / Revoked" ve "Süresi Doldu / Expired" rozetleri, maskeli tanımlayıcı; İzinler (ilk 3 + "+N"), Hız Limiti ("istek / pencere s"), Son Kullanım, Sona Erme ("Asla / Never"); IP beyaz listesi varsa ayrı satır. Sağ üstte "⋯" menüsü (aria-label "API anahtarı işlemleri menüsü / API key actions menu").
- Boş durum: "API anahtarı bulunamadı. Başlamak için ilk API anahtarınızı oluşturun." + oluştur butonu.
- Dialoglar: Oluştur, Anahtar Oluşturuldu (gizli — yukarıya bak), İptal onayı, Kalıcı silme onayı, Yeniden oluşturma onayı.

## Alanlar (Oluştur dialogu — "API Anahtarı Oluştur / Create API Key")
| Bölüm | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| — | Ad * / Name * | `name` | Input | evet | 1–100 karakter; placeholder "Entegrasyon Anahtarım" | `#key-name` | Listede kart başlığı olur |
| — | Ortam / Environment | `environment` | Select | — | `Test`; seçenekler "Test", "Canlı / Live" | dialog içindeki combobox | Alt metin: Test "Test anahtarları yalnızca test verilerine erişebilir", Canlı "Canlı anahtarlar üretim verilerine erişebilir". **Canlı yalnızca kullanıcı açıkça isterse.** |
| İzinler * / Permissions * | Products › Read / Write / Delete / Admin | `permissions` | Checkbox ızgarası | en az 1 | boş | `getByRole('checkbox', { name: 'Read' })` grup başlığı altında; checkbox id'si `<kaynak>:<eylem>` (ör. `#products\:read`) | Etiketin üzerine gelince açıklama tooltip'i |
| İzinler | Orders › Read / Write / Delete / Admin | `permissions` | Checkbox | | | | Delete = sipariş iptal/silme kapsamı |
| İzinler | Customers › Read / Write / Delete / Admin | `permissions` | Checkbox | | | | |
| İzinler | Inventory › Read / Write / Admin | `permissions` | Checkbox | | | | |
| İzinler | Analytics › Read / Admin | `permissions` | Checkbox | | | | |
| İzinler | Webhooks › Read / Write / Delete | `permissions` | Checkbox | | | | |
| Hız Limiti / Rate Limit | İstekler / Requests | `rateLimit.requests` | number Input | — | 1000, min 1 | `#rate-requests` | |
| Hız Limiti | Pencere (saniye) / Window (seconds) | `rateLimit.window` | number Input | — | 3600, min 1 | `#rate-window` | |
| IP Beyaz Listesi (İsteğe bağlı) / IP Whitelist (Optional) | placeholder "192.168.1.1 veya 10.0.0.0/8" | `ipWhitelist` | Input + "Ekle / Add" butonu (Enter da ekler) | — | boş = her IP'ye izin; IPv4 veya CIDR | placeholder ile | Eklenen IP rozet olur, "×" ile kaldırılır. Biçime uymayan değer listeye eklenmez (rozet çıkmaz) — ekledikten sonra rozeti doğrula |

"Sona Erme" oluşturma dialogunda seçilmez; liste "Asla / Never" gösterir.

## Aksiyonlar
| Aksiyon | Nerede | Ne olur | Toast / sonuç | Onay |
|---|---|---|---|---|
| API Anahtarı Oluştur | Oluştur dialogu alt butonu | Ad boş veya izin seçilmemişse kaydetmez, hata toast'ı "Please provide a name and select at least one permission". Geçerliyse anahtar oluşur, dialog kapanır, **anahtar değeri dialogu** açılır, liste yenilenir | "API key created successfully" | Özet + onay (kural 2). Sonra gizli dialog kuralı |
| Göster / Kopyala / Tamam | Anahtar Oluşturuldu dialogu | Değeri gösterir / panoya kopyalar / dialogu kapatır | "Copied to clipboard" | **Yalnız kullanıcı** |
| Yeniden Oluştur / Regenerate | "⋯" (yalnız aktif anahtar) → onay dialogu "API Anahtarını Yeniden Oluştur" | Aynı ayarlarla yeni anahtar üretir; **eski anahtar hemen geçersiz** olur; yeni değer bir kez gösterilir | "API key regenerated successfully" | Kural 5 — tek tek onay; sonra gizli dialog kuralı |
| İptal Et / Revoke | "⋯" (yalnız aktif) → onay "API Anahtarını İptal Et" ("…bu anahtarı kullanan uygulamalar hemen erişimini kaybedecek") | Anahtar pasifleşir; varsayılan listeden kaybolur ("İptal edilmiş anahtarları göster" açıkken "İptal Edildi" rozetiyle görünür) | "API key revoked successfully" | Kural 5 — tek tek onay, etkilenen entegrasyonu özette yaz |
| Etkinleştir / Activate | "⋯" (yalnız iptal edilmiş anahtar) | **Onay dialogu olmadan anında** anahtarı yeniden aktif eder; anahtar değeri değişmez ve gösterilmez | "API key activated successfully" | Tıklamadan önce onay (kural 6 mantığı) |
| Sil / Delete | "⋯" → onay "API Anahtarını Kalıcı Olarak Sil" ("Bu işlem geri alınamaz…") | Anahtarı kalıcı siler | "API key deleted permanently" | Kural 5 — tek tek onay |

Hata toast'ları sunucu mesajını gösterir (ör. "Failed to create API key").

## Yan etkiler
- Oluşturulan anahtar hemen kullanılabilir; izinleri ve ortamı oluşturulduktan sonra bu ekrandan değiştirilemez (düzenleme yok) — farklı kapsam gerekiyorsa yeni anahtar oluşturulur, eskisi iptal edilir/silinir.
- İptal, yeniden oluşturma ve silme, anahtarı kullanan tüm dış sistemleri anında yetkisiz bırakır.
- Süresi dolmuş anahtar "Süresi Doldu" rozetiyle kalır.

## Tuzaklar
- Anahtar değeri bir daha gösterilmez; kullanıcı kopyalamadan dialogu kapatırsa tek yol "Yeniden Oluştur"dur (eski anahtarı geçersiz kılar).
- Oluştur dialogunu Esc / dış tık kapatır; girilenler kaybolmaz ama dialog yeniden açıldığında kontrol et.
- Özet tablosunda izinleri tam liste olarak yaz (ör. `products:read, orders:read`); kart yalnız ilk 3'ünü gösterir.
- "Admin" izni o kaynakta tam yetki verir; kullanıcı açıkça istemedikçe seçme, özette ayrıca belirt.

## Doğrulama
1. Oluşturma: kullanıcı anahtar dialogunu kapattıktan sonra snapshot → yeni kart: ad, ortam rozeti, izinler (+N ise kart sayısıyla), hız limiti, IP rozetleri özetle aynı.
2. İptal: "İptal edilmiş anahtarları göster" açılınca kartta "İptal Edildi" rozeti; kapalıyken kart görünmez.
3. Silme: kart her iki filtrede de yok.
4. Yeniden oluşturma: kart aynı ad/ayarlarla duruyor; değer kontrolü yapılmaz (Claude değeri görmez).
