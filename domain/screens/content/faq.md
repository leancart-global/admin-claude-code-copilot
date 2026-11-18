# SSS — Sık Sorulan Sorular (FAQ)
- URL: {ADMIN_URL}/content/faq
- Menü yolu: Sol menü "İçerik / Content" → "SSS / FAQ" (`content:read`). İçerik hub'ında (`/content`) "SSS / FAQ" kartı ("Müşterilerin SSS sayfasında göreceği soru ve cevapları yaz").
- Sayfa başlığı: "SSS / FAQ"; açıklama "Müşterilerin SSS sayfasında göreceği soru ve cevapları yaz. Taslaklar yayınlayana kadar görünmez."
- Amaç: Vitrindeki SSS sayfasında gösterilen soru-cevap makalelerini yönetmek: ekle, düzenle, yayınla, sil. Her makale tek dilde yazılır (çeviri için aynı soru her dilde ayrı makale olarak eklenir).
- Yetki:
  | İşlem | Yetki |
  |---|---|
  | Liste, menü görünürlüğü | `content:read` |
  | "Soru ekle", düzenle, satırdan "Yayınla" | `content:write` (yoksa butonlar hiç görünmez) |
  | Sil | `content:delete` (yoksa çöp kutusu görünmez) |
- Veri / API: liste (durum filtresi, sayfa başına 20, en son güncellenen üstte), tek makale okuma, oluşturma, güncelleme, yayınlama, silme; dil seçenekleri aktif mağaza görünümlerinden (Ayarlar → Store Views) gelir.

## Ön koşullar ve bağımlılıklar
- En az bir aktif **mağaza görünümü (dil)** olmalı: makale formundaki "Dil" seçeneği bunlardan gelir. Diller yüklenemezse alanın altında "Mağazanın dilleri yüklenemedi." + "Tekrar dene".
- Makale metni düz metindir (zengin metin editörü yok). Medya/ürün/sayfa bağımlılığı yok.

## Yerleşim
1. Başlık, açıklama, sağda **"Soru ekle / Add question"** (yazma yetkisi varsa).
2. Filtre: "Duruma göre filtrele" select'i — "Tüm durumlar / All statuses", "Taslak / Draft", "Yayında / Published". Seçili filtre etiket olarak görünür, "Tümünü temizle" ile kalkar. (Liste filtresinde "Arşivlendi" yok; arşivli makaleler "Tüm durumlar"da görünür.)
3. Tablo — sütunlar: **Soru / Question**, **Durum / Status** (rozet: Taslak, Yayında, Arşivlendi), **Dil / Language**, **Sıra / Order**, **İşlemler / Actions**. Sayfa sonunda sayfalama (20'şer).
4. Satır işlemleri (ikon butonlar, `aria-label`): "{soru} sorusunu yayınla" (yalnız **taslak** satırda, metinli "Yayınla" butonu), "{soru} sorusunu düzenle", "{soru} sorusunu sil".
5. Boş durum: "Henüz soru yok — İlk sorunu ekle; müşterilerin sana yazmadan cevabı bulsun."; filtre sonucu boşsa "Bu durumda soru yok — Başka bir durum seç ya da filtreyi temizle."

### Soru ekle / düzenle paneli (sağdan açılan sheet)
Başlık "Soru ekle / Add question" veya "Soruyu düzenle / Edit question"; açıklama "Müşteriler yayındaki soruları SSS sayfanda görür."

## Alanlar
| Bölüm | Label (tr / en) | Kontrol | Zorunlu | Validasyon / varsayılan | Not |
|---|---|---|---|---|---|
| Panel | Soru / Question | Input | evet | boşlukları kırpılır; **4 ile 160 karakter** — "4 ile 160 karakter arasında bir soru yaz." | |
| Panel | Cevap / Answer | Textarea (8 satır) | evet | boş olamaz — "Cevabı yaz." | düz metin |
| Panel | Durum / Status | Select | — | varsayılan **Taslak**; seçenekler Taslak, Yayında (arşivli makalede ayrıca Arşivlendi) | Yayında seçip kaydetmek makaleyi vitrinde görünür yapar |
| Panel | Dil / Language | Select | evet | yeni makalede ilk dil önseçili; "Bir dil seç." | aktif mağaza görünümlerinin dilleri |
| Panel | Sıra / Order | Input (sayı) | hayır | boş = varsayılan; **1–100 tam sayı** — "1 ile 100 arasında bir tam sayı gir." | Alan notu: "Mağazadaki sıralama yakında bu değeri kullanacak." — vitrin sıralamasına etkisi şimdilik **doğrulanmadı** |
| Panel | Arama sonucu başlığı / Search result title | Input | hayır | ≤160 karakter — "160 karakteri geçmesin." | arama motoru başlığı |
| Panel | Arama sonucu açıklaması / Search result description | Textarea (3 satır) | hayır | ≤160 karakter | arama motoru açıklaması |
| Panel alt | Kaydet / Save (kaydederken "Kaydediliyor..."), Vazgeç / Cancel | Button | — | | |

## Aksiyonlar
| Buton | Etki | Toast / geri bildirim |
|---|---|---|
| Soru ekle → Kaydet | yeni makale oluşturur (seçilen durumla) | "Soru eklendi." |
| Düzenle → Kaydet | makaleyi günceller; **yayındaki makalede değişiklik doğrudan canlıdır** (taslak kopyası yok) | "Soru kaydedildi." |
| Yayınla (satır) | taslak makaleyi diyalogsuz yayına alır | "Soru yayınlandı." |
| Sil (satır) → onay | kalıcı siler; diyalog "Bu soru silinsin mi? — “{soru}” SSS sayfandan kalıcı olarak kaldırılacak." Butonlar "Vazgeç / Keep it", "Sil / Delete" | "Soru silindi." |

Hata toast'ları: "Soru kaydedilemedi. Alanları kontrol edip tekrar dene." (kaydet/yayınla), "Soru silinemedi. Tekrar dene.", "Sorular yüklenemedi. Tekrar dene." (liste hatası + Tekrar dene).

## Onay zamanlaması (kural 2/5/6)
- **Soru ekle / Düzenle → Kaydet:** butondan önce özet + onay (durum Yayında ise "vitrinde görünür" yaz).
- **Satırdaki "Yayınla" diyalogsuz çalışır** ve makaleyi vitrinde görünür yapar → tıklamadan **önce** onay al (kural 6 listesine eklenmeli).
- **Sil:** kural 5 — geri alınamaz; makale başlığıyla tek tek onay.

## Yan etkiler
- Yayındaki makale vitrindeki SSS sayfasında (`/faq`) görünür; vitrine yansıma süresi **doğrulanmadı** (önbellek nedeniyle kısa bir gecikme olabilir).
- Aynı sorunun çevirisi için her dilde ayrı makale oluştur; dil, makalenin hangi vitrin dilinde göründüğünü belirler.

## Tuzaklar
- Durumu **Yayında** seçip Kaydet demek makaleyi anında yayınlar; taslak bırakmak için varsayılan Taslak'ı değiştirme.
- Düzenle panelini kapatmak (Vazgeç / dışarı tıklama) kaydedilmemiş değişikliği atar.
- Soru metni en az 4 karakter; kısa ("SSS", "Kargo") başlıklar reddedilir.
- Liste filtresinde Arşivlendi yok; arşivli makaleyi bulmak için "Tüm durumlar" kullan.
- Sıra alanı şimdilik vitrin sıralamasını belirlemeyebilir (ekran notu "yakında"); sıralama beklentisi vermeden önce vitrinde kontrol et.

## Doğrulama
1. Kayıttan sonra toast'ı oku; listede soru beklenen durum ve dil rozetiyle görünmeli (filtre "Tüm durumlar").
2. Düzenle panelini yeniden aç; alanlar (özellikle durum, dil, sıra) kalıcı olmalı.
3. Yayınladıysan vitrinde `{STOREFRONT_URL}/{locale}/faq` sayfasında soru-cevap görünmeli; görünmüyorsa makalenin durumu ve dilinin vitrin diliyle eşleşmesini kontrol et.
