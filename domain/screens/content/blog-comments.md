# Blog Yorum Moderasyonu (Comment Moderation)
- URL: {ADMIN_URL}/content/blog/comments
- Menü yolu: "İçerik / Content" → "Blog" → sağ üst "Yorumlar / Comments" (doğrudan menü öğesi yok). Yazı detayındaki "Tüm {count} yorumu gör" de buraya gelir.
- Amaç: Tüm blog yazılarına gelen, onay bekleyen yorumları tek listede incelemek; onaylamak, reddetmek, spam işaretlemek veya silmek. Vitrinde yalnız onaylanan yorumlar sayılır/gösterilir.
- Yetki (permission): Ekran `content:update` ile açılır (yoksa içerik gizlenir). Onayla/Reddet/Spam sunucuda `content:write`, Sil `content:delete`.
- İşlemler:
  | İşlem | Ne yapar | Yetki |
  |---|---|---|
  | Liste | Yorumları duruma göre, en yeni üstte listeler | `content:read` |
  | Onayla / Reddet / Spam | Yorumun durumunu **hemen** değiştirir (onay penceresi yok) | `content:write` |
  | Toplu Onayla / Reddet / Spam | Seçili yorumların her birine aynı işlemi **hemen** uygular | `content:write` |
  | Sil | Yorumu kalıcı siler (AlertDialog'lu) | `content:delete` |

## Ön koşullar ve bağımlılıklar
- Yorumlar blog yazısına bağlıdır; yazı silinirse yorumları da gider. Yeni yorum her zaman "Beklemede" durumunda gelir.
- Model: [../../entities/blog-post.md](../../entities/blog-post.md) "Yorumlar".

## Yerleşim
1. Başlık kartı: "Yorum Denetimi / Comment Moderation" + (varsa) kırmızı "{count} beklemede / {count} pending" rozeti; açıklama "Blog yorumlarını inceleyin ve denetleyin / Review and moderate blog comments". Sağda durum select'i (placeholder "Duruma göre filtrele"): "Tüm Durumlar / All Status", "Beklemede / Pending" (varsayılan), "Onaylandı / Approved", "Reddedildi / Rejected", "Spam".
2. Toplu işlem kartı (seçim varken): "{count} yorum seçildi / {count} comment(s) selected", "Temizle / Clear", "Onayla / Approve", "Reddet / Reject", "Spam".
3. "Tümünü seç ({count}) / Select all ({count})" checkbox'ı.
4. Yorum kartları: checkbox, yazar adı + e-posta, durum rozeti, yorum metni, "Yazı: / On:" + yazı başlığı linki (yazı detayına), tarih; butonlar: "Onayla / Approve", "Reddet / Reject", "Spam", "Sil / Delete" (mevcut duruma eşit olan buton gizlenir).
5. Boş durum: "Denetlenecek yorum yok / No comments to moderate" (+ "Durum filtresini değiştirmeyi deneyin.").
- Yükleniyor: "Yorumlar yükleniyor...".

## Alanlar
| Bölüm | Label (tr / en) | Kontrol tipi | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Başlık | Durum filtresi | Select | "Beklemede" | combobox | Listeyi duruma göre süzer |
| Liste | Tümünü seç ({count}) | Checkbox | — | `#select-all` / `getByLabel(/Tümünü seç/)` | |
| Kart | (satır seçimi) | Checkbox | — | kart içindeki checkbox | |

## Aksiyonlar
- **Onayla / Approve** (kart): dialog yok → toast "Başarılı / Yorum onaylandı." → liste yenilenir, yorum bekleyenlerden düşer. Hata: "Yorum onaylanamadı."
- **Reddet / Reject**: dialog yok → "Yorum reddedildi." / hata "Yorum reddedilemedi."
- **Spam**: dialog yok → "Yorum spam olarak işaretlendi." / hata "Yorum spam olarak işaretlenemedi."
- **Sil / Delete**: AlertDialog "Yorum Silinsin mi? / Delete Comment?" + "Bu yorum kalıcı olarak silinecek. Bu işlem geri alınamaz." → "Sil" | "İptal". Başarı "Yorum silindi." / hata "Yorum silinemedi."
- **Toplu Onayla/Reddet/Spam**: dialog yok; seçilenleri tek tek işler → toast "Toplu Onaylama Tamamlandı" + "{total} yorumdan {success} tanesi onaylandı." (Reddet/Spam için eşdeğer metinler) → seçim temizlenir, liste yenilenir.

## Yan etkiler
- Onaylanan yorum vitrindeki yazının yorum sayısına yansır; reddedilen/spam yorum vitrinde görünmez.
- Silme geri alınamaz.

## Tuzaklar
- Onayla/Reddet/Spam ve tüm toplu butonlar **tek tıkla kalıcı** → CLAUDE.md kural 2/5: tıklamadan **önce** etkilenen yorum sayısı + yazar/yazı listesiyle özet göster, onay al. Toplu işlem için kayıt sayısını ayrıca belirt.
- Yorum metni ve e-posta kişisel veridir; özette yalnız gerekli kısmı göster.

## Doğrulama
1. İşlemden sonra toast + yorum kartı bekleyen listeden kalktı mı.
2. İlgili yazının detayında ("Yazı:" linki) "Yorumlar" kartında yorumun durum rozeti beklenen değerde.
3. Onaylandıysa vitrin yazı sayfasında yorum sayısı arttı mı (~1 dk).
