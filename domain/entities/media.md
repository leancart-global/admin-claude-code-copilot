# Entity: Medya (Media)

Mağazaya yüklenmiş görsel, video, belge, ses veya arşiv dosyası. Diğer kayıtlar (ürün, kategori, marka, blog, sayfa
blokları, ana sayfa, branding, layout-settings, beden rehberi adım görselleri) medyayı **URL'si ile** kullanır; medya
kaydına bağlanmaz.

- Ekran: [../screens/content/media-library.md](../screens/content/media-library.md) (kütüphane + diğer ekranlardaki
  görsel seçici / picker).
- API: liste, klasör listesi, tekil görüntüle, meta güncelle, tekli ve toplu sil, yükleme. Değişiklikler yalnız
  UI'dan yapılır (CLAUDE.md kural 3).

## Alanlar

| Alan | Düzenlenebilir | Kural / not |
|---|---|---|
| Dosya adı (orijinal ad) | hayır | Kart başlığında başlık yoksa gösterilir |
| URL | hayır | Mutlak dosya adresi; diğer kayıtlara kopyalanan değer budur |
| Tip | hayır | `image` Görsel, `video` Video, `document` Belge, `audio` Ses, `archive` Arşiv (dosya türünden belirlenir) |
| Boyut, Boyutlar (en×boy) | hayır | Görsellerde boyutlar okunur |
| Klasör | hayır (yalnız yüklerken) | Yükleme anındaki klasör; kütüphanede seçili Klasör filtresi, yoksa `general`; seçiciler kendi klasörlerini kullanır (`pages`, `banners`, `logos`, `badges`, `etbis`…) |
| Başlık / Title | evet | ≤200 |
| Alternatif Metin / Alt Text | evet | ≤500. Seçiciyle bir alana atanınca alt metin **taşınmaz** |
| Altyazı / Caption | evet | ≤1000 |
| Etiketler / Tags | evet | Küçük harfe çevrilir, tekrar eklenmez; aramada eşleşir |
| Varyantlar | hayır | Görsellerde otomatik: küçük 150×150, orta 300×300, büyük 800×800 ve webp |
| Yüklenme tarihi | hayır | Kartta görünür |

## Yükleme kuralları
- Dosya başına en fazla **50 MB**; kütüphanede tek seferde en fazla 20 dosya, seçicide (çoklu mod) varsayılan 10, tekli modda 1.
- İzinli türler: jpeg/jpg, png, gif, webp; mp4, webm, quicktime; pdf, doc, docx, xls, xlsx; mp3, wav, ogg; zip, rar, gz.
- SVG yüklenemez. Dosya uzantısı içerik türüyle uyuşmalı; çift uzantılı veya çalıştırılabilir uzantılı dosyalar reddedilir.
- Görsel alanlarının seçicisi yalnız görsel dosyaları listeler ve kabul eder.
- Yükleme anında kalıcıdır (taslak yok); vitrinde görünmesi için bir kaydın alanına atanıp o kaydın kaydedilmesi gerekir.

## İlişkiler
- Medya ile onu kullanan kayıt arasında takip edilen bir bağ yoktur: kütüphane "nerede kullanılıyor" bilgisi göstermez,
  kullanan kayıtlar medya silinince güncellenmez.
- Bir kayıttaki görsel URL'sini değiştirmek eski medyayı silmez; kütüphanede kalır.

## Silme
- Tek dosya: onay diyaloğu ("Dosya Silinsin mi?") ile; toplu: seçim çubuğundan "Seçilenleri Sil" (ekranda ayrıca onay yok).
- Geri alınamaz. Silmeden önce kullanıcıya dosyanın kullanıldığı yerleri sor ve etkilenen dosya sayısıyla onay al (kural 5).
- Silinen dosyanın URL'sini kullanan vitrin alanları kırık görsel gösterebilir.
