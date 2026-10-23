# Playbook: Değerlendirme moderasyonu ("bekleyen yorumları onayla", "şu yoruma yanıt yaz")

Tetikleyiciler: "bekleyen yorumları/değerlendirmeleri onayla", "kötü yorumu gizle/kaldır", "şu ürünün yorumlarına bak",
"1 yıldızlı yorumlara yanıt yaz", "şu yoruma cevap ver", "spam yorumu bayrakla".
Harita: ../domain/screens/marketing/reviews.md · ../domain/entities/review.md · marka sesi ../domain/project/brand-voice.md.
Blog yorumları için bu değil: ../domain/screens/content/blog-comments.md.

---

## 0. Kural hatırlatması
- Onayla / Reddet / Bayrak Ekle / Bayrağı Kaldır **tek tıkla, diyalogsuz, anında** kaydeder → tıklamadan **önce** özet + açık "evet".
- Yanıt herkese açıktır ve panelde **sonradan düzeltilemez/silinemez** → metnin tamamını özette göster.
- Panelde silme ve toplu moderasyon yok; her yorum ayrı tıklanır. Toplu onay ancak kullanıcı isterse, yine yorum yorum uygulanır.
- Ortamı (prod/dev) özetin başına yaz.

## 1. İsteği çözümle
| Bilgi | Nereden | Varsayılan |
|---|---|---|
| Hangi yorumlar | durum / puan / ürün | "bekleyen" → `status=pending` |
| Ürün | ad verildiyse ürün listesinden **ID** bul (../domain/screens/products/product-list.md) | — |
| İşlem | onay / ret / bayrak / bayrak kaldır / yanıt | — (sor) |
| İç not | kullanıcı gerekçe verdiyse | boş |
| Yanıt metni | kullanıcı verdiyse aynen; yoksa taslak öner | — |

"Gizle/kaldır" = onaylı yorumu **Reddet** (ya da şüpheliyse Bayrak Ekle). "Sil" istenirse: panelde silme yok, reddetmeyi öner.

## 2. Oku (salt okunur)
1. `{ADMIN_URL}/marketing/reviews?status=pending` (gerekirse `&rating=1`, `&productId={id}`) aç → `browser_snapshot`.
2. Her aday satır için: değerlendirme no (detay URL'sindeki id), müşteri adı, ürün ID, puan, başlık, tarih, doğrulama rozeti.
3. İçeriği görmek gerekiyorsa detayı aç (müşteri adına tıkla ya da ⋯ → Görüntüle) — metin, medya, raporlar ("Etkileşim").
4. Çok sayfa varsa "Sonraki" ile gez; toplam sayıyı "Bekleyen" kutusundan ya da başlık rozetinden al.
5. Kullanıcı hangilerinin onaylanacağını söylemediyse listeyi göster ve sor. Spam/küfür/kişisel veri içeren, ürünle ilgisiz yorumları "onaylamadan önce bak" diye işaretle — karar kullanıcının.

## 3. Moderasyon özeti → onay
> Ortam: prod · İşlem: Onayla (5 yorum) · Etki: vitrinde görünür olur, ürün ortalama puanı değişir (~1 dk)
>
> | # | Değerlendirme | Müşteri | Ürün ID | Puan | Başlık | Durum → | İç not |
> |---|---|---|---|---|---|---|---|
> | 1 | 6630…a1 | Ayşe K. | 65f0…9c | 5 | "Çok rahat" | Bekliyor → Onaylandı | — |
>
> Onaylıyor musunuz?

## 4. Uygula
- **Bekliyor → Onayla/Reddet, not yok:** listede satır ⋯ → "Onayla" / "Reddet". Her tıklamadan sonra toast "Değerlendirme durumu güncellendi." bekle; liste yenilenir, satır filtreden düşer → bir sonraki satırı yeniden snapshot ile bul (sıra kayar).
- **Not eklenecekse, onaylı/reddedilmiş bir yorum değişecekse ya da bayrak işlemi:** detayı aç → "Moderasyon" bölümünde önce "İç not" (`#moderation-notes`) doldur → ilgili buton (`moderate-approve` / `moderate-reject` / `moderate-flag` / `moderate-unflag`).
- "Bayrağı Kaldır" yorumu **Bekliyor**'a alır; vitrinde tekrar görünmesi için ayrıca Onayla (özete ikisini birlikte yaz).
- Hata toast'u gelirse dur, mesajı kullanıcıya aktar.

## 5. Yanıt yazma
1. Marka sesini oku (brand-voice.md §1). Ses yoksa önce öneri sun, onay al.
2. Taslak kuralları: ≤500 karakter; müşterinin adıyla hitap; teşekkür + somut içerik; olumsuz yorumda özür + çözüm kanalı (iletişim sayfası/müşteri hizmetleri); sipariş no, telefon, e-posta gibi kişisel veri yazma; iade/indirim/hediye vaadi kullanıcı açıkça söylemedikçe yok; rakip kıyası ve tartışma yok; yorumun diliyle yaz.
3. Özet: değerlendirme no, müşteri, puan, yorum alıntısı (kısa), **yanıt metni tam hali**, karakter sayısı, "Marka sesi: {kaynak}", "yanıt sonradan panelde düzenlenemez".
4. Onaydan sonra detay → "Bayi Yanıtı" → textarea (test id `review-response-textarea`) `fill` → "Yanıtla". Toast "Yanıt gönderildi.".
5. Yorumda zaten yanıt varsa (salt okunur görünür) yeni yanıt eklenemez; kullanıcıya bildir.

## 6. Doğrula
- Liste: ilgili filtrede satırlar kalktı, "Bekleyen" sayısı azaldı.
- Detay: durum rozeti, "Moderasyon yapan/zamanı", "Not geçmişi", yanıt metni + "Yanıtlayan".
- Vitrin: ürün sayfasında yorum göründü/kalktı ve ortalama puan (~1 dk). Yanıtın vitrinde görünüp görünmediğini kontrol et, raporda belirt.

## 7. Rapor
İşlenen yorum sayısı ve durumları (tablo), yazılan yanıtlar, atlanan/kullanıcıya bırakılan yorumlar, kalan bekleyen sayısı.
Mağaza moderasyon ayarı değiştirilmek istenirse (ör. "doğrulanmış alıcıları otomatik onayla") → ../domain/screens/settings/general.md, ayrı onay.
