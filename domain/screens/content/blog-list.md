# Blog Yazıları Listesi (Blog Management) + Yazı Detayı
- URL: {ADMIN_URL}/content/blog (liste) · {ADMIN_URL}/content/blog/{id} (detay)
- İlgili: İçerik hub'ı {ADMIN_URL}/content — kartlar: "Sayfalar / Pages", "Blog" ("Müşterilerinle etkileşim için blog yazıları ve makaleler yayınla / Publish blog posts and articles to engage your customers"), "Beden Rehberleri / Size Guides", "Medya / Media"; kart tıklanınca ilgili listeye gider. Hub başlığı "İçerik / Content".
- Menü yolu: Sol menü "İçerik / Content" → "Blog".
- Amaç: Mağazanın blog yazılarını listelemek, aramak/filtrelemek, detayını görmek; yeni yazı, düzenleme, çoğaltma, silme ve yorum moderasyonuna giriş noktası. Yayına alma/yayından kaldırma bu listede **yok** — düzenleme ekranında (`blog-edit.md`).
- Yetki (permission): Liste/detay `content:read`. Arayüzde "Yeni Yazı" ve "Kopyala/Çoğalt" `content:create`, "Düzenle"/"Çeviriler"/"Yorumlar" `content:update`, "Sil" `content:delete` ile görünür. Sunucuda oluştur/çoğalt/güncelle `content:write`, silme `content:delete`.
- İşlemler:
  | İşlem | Ne yapar | Yetki |
  |---|---|---|
  | Liste | Yazıları 20'şerli, son güncellenen üstte listeler; arama + durum + öne çıkan filtresi | `content:read` |
  | Detay | Tek yazının içerik, görsel, yorum, SEO, yazar özeti | `content:read` |
  | Çoğalt | Yazının taslak kopyasını **hemen** oluşturur | `content:write` |
  | Sil / Toplu sil | Yazıyı (yorumlarıyla) kalıcı siler | `content:delete` |

## Ön koşullar ve bağımlılıklar
- Login + `content:read`. Başka kayda bağımlı değil.
- Entity kuralları: [../../entities/blog-post.md](../../entities/blog-post.md).

## Yerleşim (liste)
Tek kart:
1. **Başlık**: "Blog" + toplam yazı rozeti, açıklama "Blog yazılarını, kategorilerini ve yorumları oluşturun ve yönetin / Create and manage blog posts, categories, and comments". Sağda "Yorumlar / Comments" (konuşma balonu ikonlu, outline) → `/content/blog/comments`; "Yeni Yazı / New Post" (+) → `/content/blog/new`.
2. **Hızlı filtreler**: arama kutusu (placeholder "Ara... / Search...", yazdıktan ~0,3 sn sonra uygulanır; başlık, içerik metni, özet, etiket ve kategori adında arar), Durum select'i ("Tüm Durumlar / All Statuses", Yayında, Taslak, Zamanlanmış, Arşivlendi), Öne çıkan select'i ("Tüm Yazılar / All Posts", "Evet / Yes", "Hayır / No"), sağda görünüm toggle'ı (aria-label "Liste görünümü / List view", "Izgara görünümü / Grid view"; tercih tarayıcıda hatırlanır, varsayılan liste).
3. **Aktif filtre rozetleri**: "Aktif filtreler: / Active filters:" + "Ara / Search: \"…\"", "Durum / Status: …", "Öne Çıkan / Featured: Evet/Hayır" + "Tümünü temizle / Clear all".
4. **Toplu işlem çubuğu** (satır seçilince): "{count} yazı seçildi / {count} post(s) selected", "Seçimi Temizle / Clear Selection", "Seçilenleri Sil / Delete Selected" (kırmızı, `content:delete`).
5. **Hata bandı**: "Blog yazısı yüklenemedi / Failed to load blog post" + "Yenile / Refresh".
6. **Tablo** (veya ızgara kartları) + altta "{total} yazıdan {from} - {to} arası gösteriliyor / Showing {from} to {to} of {total} posts", "Önceki / Previous", "Sayfa {current} / {total}", "Sonraki / Next". Boşsa "Blog yazısı bulunamadı / No blog posts found" + "Filtrelerinizi değiştirmeyi veya yeni yazı oluşturmayı deneyin."

### Tablo sütunları
| Sütun (tr / en) | İçerik | Sıralanabilir |
|---|---|---|
| (seçim) | checkbox; başlıkta "Tümünü seç / Select all", satırda "Satırı seç / Select row" | — |
| Başlık / Title | başlık + öne çıkan yıldızı + altında `/{slug}` | evet |
| Yazar / Author | avatar/baş harf + yazar adı | hayır |
| Durum / Status | rozet: Taslak / Yayında / Zamanlanmış / Arşivlendi | evet |
| Kategoriler / Categories | kategori ve etiket rozetleri | hayır |
| Yayınlanma / Published | yayın tarihi | evet |
| İşlemler | "Menüyü aç / Open menu" (üç nokta) | — |

Satıra tıklamak detay ekranını açar.

### Satır menüsü ("İşlemler / Actions")
| Öğe (tr / en) | Sonuç | Görünürlük |
|---|---|---|
| Görüntüle / View | `/content/blog/{id}` | her zaman |
| Düzenle / Edit | `/content/blog/{id}/edit` | `content:update` |
| Önizleme / Preview | Vitrinde `/blog/{slug}` yeni sekmede açılır | mağaza vitrin adresi biliniyorsa |
| Çeviriler / Translations | Düzenleme ekranını açar (dil, oradaki "Görünüm / View" seçicisiyle değiştirilir) | `content:update` |
| Kopyala / Duplicate | **Onaysız hemen** kopya oluşturur → toast "Blog yazısı kopyalandı" → kopyanın düzenleme ekranına gider | `content:create` |
| Sil / Delete | AlertDialog → "Sil" | `content:delete` |

## Yerleşim (detay `/content/blog/{id}`)
- Üstte "Blog Yazılarına Dön / Back to Blog Posts"; başlık, durum rozeti, öne çıkansa "Öne Çıkan / Featured", altında `/{slug}`.
- Sağ üst butonlar: "Canlı Görüntüle / View Live" (yalnız yayındaysa; vitrinde açar), "Çoğalt / Duplicate" (onaysız hemen kopyalar → kopyanın düzenleme ekranı), "Düzenle / Edit", "Sil / Delete" (kırmızı → AlertDialog).
- Sol kolon: öne çıkan görsel, "Özet / Excerpt", "İçerik / Content" kartı ("İçerik Düzenle / Edit Content"; boşsa "Henüz içerik yok."), "Yorumlar ({count}) / Comments ({count})" son yorumlar + "Tüm {count} yorumu gör" → yorum moderasyonu.
- Sağ kolon: "Hızlı İşlemler / Quick Actions" ("ID Kopyala", "URL Kopyala" — panoya kopyalar, toast "… copied"; "Çevirileri Yönet"), "Yazı Detayları / Post Details" ("Bilgi Düzenle"; Yayınlandı, Oluşturuldu, Güncellendi, Görüntülenme, Okuma Süresi "{n} dk okuma", Yorumlar "Açık/Kapalı"), "Yazar / Author", "Kategoriler ve Etiketler / Categories & Tags", "SEO" ("SEO Düzenle"; arama önizlemesi, "İndekslenebilir / Indexable" ya da "İndekslenmez / No Index").
- Detaydaki tüm "… Düzenle" butonları düzenleme ekranını açar (ekran her zaman "Temel Bilgiler" sekmesiyle açılır).

## Aksiyonlar
- **Sil** (satır menüsü veya detay): AlertDialog başlık "Emin misiniz? / Are you sure?", metin "\"{title}\" kalıcı olarak silinecek. Bu işlem geri alınamaz." → "Sil / Delete" (kırmızı) | "İptal / Cancel". Başarı: toast "Yazı başarıyla silindi"; detaydan silinirse listeye döner. Hata: "Blog yazısı silinemedi. Lütfen tekrar deneyin."
- **Seçilenleri Sil**: AlertDialog "Emin misiniz?" + "{count} yazı seçildi Bu yazıyı silmek istediğinizden emin misiniz?" → "Sil". Sonuç toast'ı "{count} blog yazısı başarıyla silindi." ya da "{successful} silindi, {failed} başarısız."; sonucu her durumda listeyi yenileyip satır sayısından doğrula.
- **Kopyala / Çoğalt**: dialog yok, tıklama = kayıt. Kopya: başlık "{başlık} (Copy)", slug "{slug}-copy" (çakışırsa "-copy-1", "-copy-2"…), durum Taslak, yayın/zamanlama tarihi boş, görüntülenme/yorum sayaçları sıfır, yorumlar kopyalanmaz; çeviriler de son ekli slug'larla kopyalanır.
- **Önizleme / Canlı Görüntüle**: vitrin sayfasını yeni sekmede açar; yalnız yayındaki yazı vitrinde görünür (taslakta sayfa bulunamaz).

## Yan etkiler
- Silme kalıcıdır; yazının yorumları da gider. Navigasyon/footer'daki `/blog/{slug}` linkleri güncellenmez (bkz. `../../entities/header.md`).
- Çoğaltılan kopya taslaktır; vitrinde görünmez.

## Tuzaklar
- "Kopyala/Çoğalt" onay sormadan kayıt oluşturur → CLAUDE.md kural 2: tıklamadan **önce** onay al.
- Durum filtresi tek değer seçer; "Arşivlendi" yazılar vitrinde görünmez; "Zamanlanmış" yazı tarihine kadar görünmez.
- Arama içerik metninde de arar; başlık eşleşmesini satırda ayrıca kontrol et.

## Doğrulama
1. Listede başlığı ara → satır, durum rozeti, öne çıkan yıldızı, yayın tarihi beklenen.
2. Satırı aç → detayda içerik, görsel, kategori/etiket, SEO özeti kayıtlı değerlerle aynı.
3. Yayındaysa "Canlı Görüntüle" → vitrin `{STOREFRONT_URL}/{locale}/blog/{slug}` açılmalı (~1 dk gecikme olabilir).
