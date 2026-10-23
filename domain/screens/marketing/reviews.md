# Ürün Değerlendirmeleri (Reviews) — liste ve detay

- URL: {ADMIN_URL}/marketing/reviews (liste) · {ADMIN_URL}/marketing/reviews/{id} (detay)
- Menü yolu: Sol menü "Pazarlama / Marketing" → "Değerlendirmeler / Reviews".
- Sayfa başlığı: liste kartı "Değerlendirmeler / Reviews" + toplam sayı rozeti; açıklama "Müşteri ürün değerlendirmelerini onaylayın ve mağaza adına yanıtlayın. / Moderate customer product reviews and reply on behalf of your store." Detay: "Değerlendirme #{id} / Review #{id}".
- Amaç: Müşterilerin ürünlere bıraktığı yıldızlı değerlendirmeleri incelemek; onaylamak (vitrinde yayınlamak), reddetmek, bayraklamak; mağaza adına herkese açık yanıt yazmak; iç moderasyon notu bırakmak.
- Entity: [../../entities/review.md](../../entities/review.md). Benzer ekran: [../content/blog-comments.md](../content/blog-comments.md) (blog yorumları — ayrı kayıt türü).
- Yetki: ekranlar `marketing:view` (yoksa "erişim reddedildi" kartı). Onayla / Reddet / Bayrak `marketing:update` (yoksa liste menüsünde görünmez, detayda butonlar pasif — ipucu "Değerlendirmeleri moderasyon yetkiniz yok."). Yanıt yazmak `marketing:update` (formu gösterir) **ve** `marketing:create` (sunucu) ister.
- Veri / API (public): `GET /admin/reviews` (filtre: `status`, `productId`, `rating`, sayfa 20), `GET /admin/reviews/{id}`, `PUT /admin/reviews/{id}/moderate` {`status`, `notes`?}, `POST /admin/reviews/{id}/response` {`content`}, `GET /admin/reviews/statistics`.

Panelde **olmayanlar**: değerlendirme oluşturma, metnini düzenleme, silme, toplu seçim/toplu moderasyon, "öne çıkar" işaretleme, dışa aktarma. Kullanıcı bunları isterse ekranda bulunmadığını söyle; geçici yol önerme.

## Ön koşullar ve bağımlılıklar
- Değerlendirmeleri müşteriler vitrinde bırakır; admin'de yalnız moderasyon yapılır. Ürünün "Değerlendirmeler / Allow reviews" işareti ([../products/product-edit.md](../products/product-edit.md), [../../entities/product.md](../../entities/product.md)) ürünün değerlendirme alıp almayacağını belirler.
- Yeni değerlendirmenin ilk durumu mağaza ayarına bağlıdır: [../settings/general.md](../settings/general.md) → "Değerlendirmeler / Reviews" sekmesi:
  - "Değerlendirme moderasyonunu etkinleştir" kapalı → her yorum **doğrudan Onaylandı** gelir.
  - "Doğrulanmış değerlendirmeleri otomatik onayla" açık (varsayılan) → ürünü satın almış müşterinin yorumu doğrudan Onaylandı; diğerleri Bekliyor.
  - "Değerlendirme için satın alma zorunlu" açık → satın almamış müşteri yorum bırakamaz.
- Teslimattan ~7 gün sonra müşteriye otomatik "değerlendirme isteği" e-postası gidebilir (bildirim/otomasyon tarafı, bu ekrandan tetiklenmez; bkz. [../settings/notification-rules.md](../settings/notification-rules.md)).
- Yanıt metni üretilecekse önce marka sesi: [../../project/brand-voice.md](../../project/brand-voice.md).

## Yerleşim

### Liste (`/marketing/reviews`)
1. İstatistik şeridi (4 kutu): "Toplam değerlendirme / Total reviews", "Bekleyen / Pending" (bekleyen varsa sarı vurgulu), "Ortalama puan / Average rating" (+ yıldızlar), "Doğrulanmış satın alma / Verified purchases" (%). Toplam, ortalama ve doğrulanmış oranı vitrindeki gibi **yalnız onaylı** değerlendirmelerden hesaplanır; Bekleyen ayrı sayılır.
2. Kart başlığı + filtre çubuğu: arama kutusu (Ürün ID), durum Select, puan Select. Filtreler URL'ye yazılır (`?status=pending&rating=1&productId=…&page=2`) → doğrudan URL ile de açılabilir.
3. Aktif filtre rozetleri + "Filtreleri temizle / Clear filters".
4. Tablo sütunları: "Müşteri / Customer" (baş harf avatarı, ad, e-posta — tıklanınca detay), "Ürün / Product" (**ürün ID'si**, kısaltılmış; ad gösterilmez), "Puan / Rating" (yıldız + sayı), "Başlık / Title", "Durum / Status" rozeti, "Doğrulama / Verification" rozeti, "Tarih / Date" (göreli: "3 gün önce"), "⋯" (aria-label "İşlemler / Actions").
5. Satır menüsü: "Görüntüle / View"; yalnız **Bekliyor** satırlarda "Onayla / Approve", "Reddet / Reject"; yanıtı olmayan satırlarda "Yanıtla / Reply" (detay sayfasını açar).
6. Sayfalama: 20 satır; "Önceki / Sonraki", "Sayfa x / y".
7. Boş durum: "Henüz değerlendirme yok / No reviews yet" (filtre yokken); filtreyle sonuç yoksa ortak "sonuç yok" metni. Yükleme hatası: "Değerlendirmeler yüklenemedi." + "Yenile".

### Detay (`/marketing/reviews/{id}`)
1. "← Değerlendirmelere dön / Back to reviews".
2. Başlık "Değerlendirme #{id}" + durum rozeti + doğrulama rozeti; alt satır "Yayın tarihi: {tarih} / Posted: {date}". Sağda üst aksiyon grubu: "Onayla", "Reddet" (mevcut duruma eşit olan gizli), "Bayrak Ekle / Flag" ya da (bayraklıysa) "Bayrağı Kaldır / Remove flag".
3. KPI şeridi: "Puan / Rating", "Doğrulama / Verification", "Faydalı oylar / Helpful votes" ("{faydalı} / {toplam} (%)").
4. Akordeon bölümleri (ilk üçü açık gelir):
   - "Müşteri & Değerlendirme / Customer & review": ad, e-posta, müşteri ID, başlık, metin, medya galerisi ("Medya ({count})").
   - "Moderasyon / Moderation": "Mevcut durum", Onayla / Reddet / Bayrak Ekle|Bayrağı Kaldır butonları, "İç not (opsiyonel) / Internal notes (optional)" alanı, "Moderasyon yapan / Moderated by", "Moderasyon zamanı / Moderated at", "Not geçmişi / Notes history".
   - "Bayi Yanıtı / Store response": yanıt yoksa yazma alanı + "Yanıtla / Reply"; varsa salt okunur metin + "Yanıtlayan: {user}", "Yanıt zamanı: {date}".
   - "Doğrulama & Meta / Verification & metadata": Doğrulama durumu, Sipariş ID, Satın alma tarihi, Dil, Cihaz, Duygu puanı (yoksa "—").
   - "Etkileşim / Engagement": Faydalı oylar, Faydasız oylar, Raporlar, Öne çıkarıldı (Evet/Hayır).
- Bulunamazsa: "Değerlendirme bulunamadı." + geri butonu.

## Alanlar

### Liste filtreleri
| Label (tr / en) | Kontrol tipi | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|
| Ürün ID / Product ID (placeholder "Ürün ID'sine göre filtrele / Filter by product ID") | Input (arama ikonlu) | boş | `getByLabel('Ürün ID')` | **Ürün adı değil, ürün ID'si** ile tam eşleşir. ID'yi ürün listesinden/detay URL'sinden al ([../products/product-list.md](../products/product-list.md)). Her tuşta liste yenilenir; ID'yi tek seferde `fill` ile gir |
| Durum (Select) | shadcn Select | "Tüm durumlar / All statuses" | filtre çubuğundaki ilk combobox | "Bekliyor / Pending", "Onaylandı / Approved", "Reddedildi / Rejected", "Bayraklı / Flagged". Dar ekranda gizlenir → pencere genişliği masaüstü olmalı ya da `?status=` URL'si kullan |
| Puan (Select) | shadcn Select | "Tüm puanlar / All ratings" | ikinci combobox | "5 yıldız" … "1 yıldız" (tam eşleşme). Dar ekranda gizli |

### Detay — Moderasyon
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon | Locator ipucu | Not |
|---|---|---|---|---|---|
| İç not (opsiyonel) / Internal notes (optional) | Textarea (3 satır) | hayır | ≤1000 | `#moderation-notes`, test id `moderation-notes` | Placeholder "Bu kararı neden verdiğinizi not edin (yalnızca ekibinize görünür)." Ayrı kaydet butonu **yok**: not, bir sonraki Onayla/Reddet/Bayrak tıklamasıyla birlikte kaydedilir, "Not geçmişi"ne eklenir (silinmez), alan temizlenir. Müşteriye görünmez |
| Onayla / Approve | Button | — | durum zaten Onaylandı ise pasif | test id `moderate-approve` | Üst aksiyon grubunda da aynı buton var (ikisi aynı işi yapar) |
| Reddet / Reject | Button | — | zaten Reddedildi ise pasif | test id `moderate-reject` | |
| Bayrak Ekle / Flag | Button | — | — | test id `moderate-flag` | Durumu "Bayraklı" yapar |
| Bayrağı Kaldır / Remove flag | Button | — | yalnız Bayraklı iken | test id `moderate-unflag` | Durumu **Bekliyor**'a çevirir (önceki duruma değil) |

### Detay — Bayi Yanıtı
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon | Locator ipucu | Not |
|---|---|---|---|---|---|
| (yanıt metni) — placeholder "Müşterilerin değerlendirme altında göreceği bir yanıt yazın. / Write a public reply that customers will see under the review." | Textarea (4 satır) | evet | 1–500 karakter; sayaç "{current} / {max} karakter"; boşsa "Yayınlamadan önce bir yanıt yazın." | test id `review-response-textarea` | Boşken "Yanıtla" pasif. **Tek seferlik**: gönderildikten sonra alan kaybolur, yanıt salt okunur görünür; panelde düzenleme/silme yok |
| Yanıtla / Reply | Button | — | — | `getByRole('button', { name: 'Yanıtla' })` (bölüm içinde) | |

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Liste ⋯ → Onayla / Reddet (yalnız Bekliyor) | **Diyalogsuz, anında** durum değişir; not eklenemez | "Başarılı" / "Değerlendirme durumu güncellendi." · hata: "İşlem başarısız oldu. Lütfen tekrar deneyin." ya da sunucu mesajı |
| Liste ⋯ → Görüntüle / Yanıtla, müşteri adına tıklama | Detayı açar (kalıcı değil) | — |
| Detay → Onayla / Reddet / Bayrak Ekle / Bayrağı Kaldır | **Diyalogsuz, anında** durum değişir; "İç not" doluysa nota eklenir; "Moderasyon yapan/zamanı" güncellenir | "Değerlendirme durumu güncellendi." |
| Detay → Yanıtla | Mağaza yanıtı kaydedilir; yanıtlayan ve zaman yazılır | "Yanıt gönderildi." · boş: "Yayınlamadan önce bir yanıt yazın." · uzun: "Yanıt çok uzun." |

## Onay zamanlaması (kural 2/5/6)
- **Onayla / Reddet / Bayrak Ekle / Bayrağı Kaldır — tek tık, diyalogsuz, anında kalıcı.** Butona dokunmadan **önce** özet göster ve onay al: değerlendirme no, müşteri adı, ürün ID, puan, başlık, mevcut → yeni durum, vitrine etkisi ("vitrinde görünür olacak" / "vitrinden kalkacak"), varsa iç not. Birden çok yorum için tabloda tek tek listele, kayıt sayısını yaz; toplu onay ancak kullanıcı açıkça isterse — ekran yine de her yorumu ayrı tıklamayla işler.
- **İç not** alanına yazmak kalıcı değildir; not ancak durum butonuyla birlikte kaydedilir. Notu özete dahil et.
- **Yanıtla — herkese açık metin, tek seferlik.** Gönderildikten sonra panelde düzeltilemez/silinemez → metni özette tam haliyle göster, marka sesine uygunluğunu belirt, açık "evet" al.
- Müşteriye e-posta/bildirim: moderasyon ve yanıt işlemleri müşteriye **bildirim göndermez** (doğrulanmadı — bildirim kurallarında değerlendirmeye bağlı bir tetikleyici tanımlıysa onu kontrol et).
- Dış sisteme yazma yok.

## Yan etkiler
- **Vitrinde görünme:** Ürün sayfasında yalnız **Onaylandı** durumundaki değerlendirmeler listelenir (en yeniler). Bekliyor, Reddedildi ve Bayraklı görünmez. Onaylı bir yorumu Reddet ya da Bayrak Ekle ile vitrinden kaldırırsın ("gizleme" budur).
- **Ürün puanı:** Ürün sayfasındaki ortalama puan, değerlendirme sayısı ve yıldız dağılımı onaylı değerlendirmelerden hesaplanır; onay/ret bunu değiştirir. Moderasyondan sonra vitrin ürün sayfası genelde hemen, en geç ~1 dk içinde güncellenir. Kategori/liste sayfalarındaki ürün kartı puanına ve puana göre sıralamaya etkisi doğrulanmadı.
- **Bayi yanıtı:** değerlendirmeye bağlı kaydolur; vitrin ürün sayfasında gösterimi doğrulanmadı — kullanıcıya "vitrinde görünüp görünmediğini ürün sayfasında kontrol edelim" de.
- Bayrağı Kaldır, onaylı bir yorumu da Bekliyor'a düşürür → vitrinden kalkar; tekrar görünmesi için ayrıca Onayla gerekir.
- Her moderasyon ve yanıt işlemi denetim kaydına yazılır; [../settings/audit-log.md](../settings/audit-log.md) ekranında görünürlüğü doğrulanmadı.

## Tuzaklar
- Ürün sütunu ve filtresi **ürün ID'si** ile çalışır; kullanıcı ürün adını söylediyse önce ürün listesinden ID'yi bul.
- Liste menüsünde Onayla/Reddet yalnız Bekliyor yorumlarda; onaylı bir yorumu reddetmek ya da bayraklamak için detaya gir.
- Durum ve puan filtreleri dar pencerede gizlenir; görünmüyorsa `?status=pending` gibi URL parametresiyle aç.
- Yanıt ve müşteri e-postası kişisel veri içerir; özette e-postayı gereksizse gösterme, değerlendirme metnini kısaltarak alıntıla.
- Yanıt metni: marka sesi ([../../project/brand-voice.md](../../project/brand-voice.md)); müşterinin adıyla hitap, somut çözüm/teşekkür, kişisel veri (sipariş no, telefon) yazma, rakip ya da tartışma yok, ≤500 karakter. Olumsuz yorumda özür + çözüm kanalı (iletişim sayfası) öner; iade/indirim vaadi kullanıcı onayı olmadan yazılmaz.
- Reddetmek kalıcı silme değildir; kayıt panelde "Reddedildi" filtresiyle durur ve tekrar onaylanabilir.

## Doğrulama
1. Toast "Değerlendirme durumu güncellendi." / "Yanıt gönderildi.".
2. Detayda durum rozeti, "Moderasyon yapan/zamanı", "Not geçmişi"; yanıt bölümünde salt okunur metin + "Yanıtlayan".
3. Listede ilgili filtrede (ör. Bekliyor) satır artık yok; "Bekleyen" kutusu azaldı. Puan filtresi kullandıysan satırların puanını da kontrol et.
4. Onay/ret sonrası vitrin ürün sayfasında (~1 dk) yorumun göründüğü/kalktığı ve ortalama puan.
