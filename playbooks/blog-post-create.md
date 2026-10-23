# Playbook: Blog yazısı oluştur / yayınla ("şu konuda blog yazısı yayınla")

Tetikleyiciler: "blog yazısı yaz/ekle/yayınla", "şu konuda makale yayınla", "bu metni blog'a koy", "kampanya duyurusunu blog'da paylaş", "AI ile blog yazısı üret", "yazıyı İngilizceye de çevir".
Harita: ../domain/screens/content/blog-edit.md (form, butonlar, tuzaklar), ../domain/entities/blog-post.md (kurallar, durumlar, vitrin), ../domain/screens/content/blog-list.md (arama, doğrulama), ../domain/screens/content/media-library.md "Picker" (görsel), ../domain/entities/homepage-components.md (blok kataloğu), ../domain/screens/content/ai-content.md (admin'de AI içerik üretme yok).
URL'ler locale öneksizdir: `{ADMIN_URL}/content/blog/new`.

---

## 0. Kural hatırlatması
- Admin'de yapay zekâ ile metin üreten buton **yok**. Metin istenirse Claude sohbette taslaklar; kullanıcı metni onaylamadan forma geçilmez.
- **Anında canlı:** Durum "Yayında" ile "Oluştur" yazıyı hemen yayına alır; yayındaki yazıda "Kaydet" ve "Güncelle ve Yayınla" doğrudan canlıya yazar; düzenleme ekranındaki "Senkronize et..." onaysız kaydeder. Onay bu butonlara **dokunmadan önce** alınır.
- Medyaya dosya yüklemek kalıcıdır (yazı kaydedilmese bile) → yüklemeyi de özete koy.
- Kullanıcı açıkça "yayınla" demediyse durum **Taslak**; özette belirt.
- Her ayrı kayıt (yazı, sonradan çeviri yayını, menüye link ekleme) ayrı özet + onay.

## 1. İsteği çözümle → içerik taslağı
0. **Marka sesi** ([../domain/project/brand-voice.md](../domain/project/brand-voice.md)): kullanıcının marka rehberi → `config/local.json` `tenantContext.brandVoice` → Branding (ad, slogan, Marka Tonu) okunur. Ses varsa taslak ona göre yazılır. Yoksa taslaktan **önce** marka sesi önerisi (ton, hitap, kişilik, yapılır/yapılmaz, örnek cümle) sunulur ve onay alınır; onaylanan ses `config/local.json`'a yazılır.
1. Kullanıcı metni verdiyse onu kullan; yalnız konu verdiyse sohbette taslak hazırla: başlık, özet (≤500), gövde (alt başlıklar + paragraflar), 3–8 etiket, 1–2 blog kategorisi, SEO başlığı (≤60 önerilen) ve meta açıklama (≤160 önerilen). Fiyat, kampanya koşulu, ürün özelliği gibi doğrulanması gereken iddiaları uydurma; sor ya da katalogda salt okunur kontrol et.
2. Alan tablosu (eksikleri tek seferde sor):

| Bilgi | Form alanı | Zorunlu | Varsayılan (sorulmazsa) |
|---|---|---|---|
| Başlık | Temel Bilgiler › Başlık * | evet | — |
| Slug | URL Adresi * | evet | Başlığın ASCII karşılığı, elle yazılır (ş→s, ı→i, ğ→g, ü→u, ö→o, ç→c; boşluk→tire) |
| Özet | Özet | hayır | Taslaktan 1–2 cümle |
| Durum | Durum | — | **Taslak**; "yayınla" denmişse Yayında |
| İçerik biçimi | İçerik › bloklar **veya** Yazı İçeriği (Eski) | — | Düz metin/Markdown → "Yazı İçeriği (Eski)"; görsel/ürün/buton içeren zengin düzen → bloklar. İkisini birden doldurma |
| Öne çıkan görsel | Medya › Öne Çıkan Görsel | hayır (önerilir) | — (dosya yolu veya kütüphanedeki ad iste; uydurma URL yok) |
| Etiketler / blog kategorileri | Kategoriler sekmesi | hayır | Taslaktan |
| Öne çıkan yazı | Öne Çıkan Yazı | — | kapalı |
| Yorumlara izin | Yorumlara İzin Ver | — | açık |
| Yazar adı | Yazar › Ad * | **evet** | Kullanıcı vermezse sor; öneri: mağaza adı ("varsayılan" işaretle) |
| SEO | SEO sekmesi | hayır | SEO başlığı/meta açıklama taslaktan; indeksleme açık |
| Çeviri dilleri | (kayıttan sonra düzenleme ekranı) | hayır | Yok; istendiyse Adım 8 |
| Zamanlama | Durum=Zamanlanmış + tarih | hayır | — |

## 2. Ön kontroller (salt okunur)
1. `{ADMIN_URL}/content/blog` → arama kutusuna başlık/anahtar kelime yaz → aynı konuda/slug'da yazı var mı? Varsa kullanıcıya sor (yeni mi, mevcut düzenlensin mi).
2. Görsel kütüphanede mi: picker'ın "Göz At" sekmesinde ara (media-library.md "Picker").
3. Bloklarda ürün/kategori/form kullanılacaksa ilgili kayıtlar mevcut ve aktif mi (homepage-component-add.md Adım 3 tablosu).
4. Çeviri istenecekse mağazada o dil için aktif store view var mı (yoksa düzenleme ekranında "Görünüm" seçicisi çıkmaz → kullanıcıya bildir).

## 3. Planı ve içerik taslağını göster → metin onayı
Ortam (config/local.json) + marka sesi (kaynağı; tanımlı değilse "varsayılan") + taslak metin (başlık, slug, özet, gövde, etiketler, kategoriler, SEO) + plan ("Taslak olarak oluşturulacak" / "Yayında olarak oluşturulacak, anında canlı"). Kullanıcı metni onaylasın/düzeltsin. Bu, kayıt onayı değildir.

## 4. Formu doldur (`/content/blog/new`)
1. Ekranı aç → `browser_snapshot` ("Yazı Oluştur / Create Post" başlığı ve 6 sekme).
2. **Temel Bilgiler:** Başlık `fill` → URL Adresi alanını temizleyip ASCII slug'ı `fill` (yalnız küçük harf, rakam, tire) → Özet. Durum: tetikleyiciye tıkla → seçeneğe tıkla (yalnız onaylanacak durum; varsayılan Taslak'a dokunma). Zamanlanmış ise "Zamanlama Tarihi" `YYYY-MM-DDTHH:mm`.
3. **İçerik:**
   - Düz metin: "Yazı İçeriği (Eski)" textarea'sına Markdown/HTML `fill`; sağ üstte "~n dk okuma" görünür.
   - Bloklar: "Görsel / Visual" sekmesinde blok editörü → "Blok Ekle" → tip (ör. Metin, Görsel, Ürünler, Buton) → ayar paneli; ayrıntı homepage-component-add.md Adım 4. "Paket Karşılaştırma" ekleme (blog'da kaydedilmez). JSON sekmesini kullanma.
4. **Medya:** "Öne Çıkan Görsel" alanında "Gözat / Browse" → diyalog → var olanı seç ya da "Yükle" sekmesi + `browser_file_upload` (kullanıcının verdiği yol) → "Seç". Galeri gerekiyorsa "Kütüphaneye Gözat" (en çok 10).
5. **SEO:** SEO Başlığı, Meta Açıklama, (varsa) Odak Anahtar Kelime; OG/Twitter boş kalabilir. İndeksleme switch'lerine dokunma (varsayılan açık).
6. **Kategoriler:** her etiket için input'a yaz → "Ekle" (Enter da olur); her kategori için aynı. "Öne Çıkan Yazı" / "Yorumlara İzin Ver" checkbox'larını snapshot'taki duruma göre ayarla.
7. **Yazar:** "Ad *" doldur; biyografi/avatar varsa.
8. Her sekmeden sonra snapshot: değerler yerinde mi, sekmede kırmızı nokta var mı.

## 5. Özet → ONAY BEKLE
| | |
|---|---|
| Ortam | prod / dev / local |
| Ekran | Yazı Oluştur (`/content/blog/new`) |
| İşlem | Yeni blog yazısı |
| Başlık / slug | "{başlık}" / `/blog/{slug}` |
| Durum | Taslak (vitrinde görünmez) **veya** Yayında — **"Oluştur"a basınca anında canlı** |
| İçerik | düz metin (~n kelime, ~n dk) **veya** bloklar: tip listesi |
| Görseller | öne çıkan: dosya adı (yüklenecek → kütüphaneye kalıcı / mevcut) ; galeri: n |
| Kategoriler / etiketler | … |
| Yazar | ad (varsayılan ise işaretli) |
| SEO | başlık, meta açıklama, indeksleme açık |
| Öne çıkan / yorumlar | evet-hayır / açık-kapalı |
| Bilinen etkiler | yayındaysa ~1 dk içinde `/{locale}/blog` listesinde ve yazı adresinde; öne çıkansa blog listesinin üstünde; menüye otomatik eklenmez |

## 6. Kaydet
- "Oluştur / Create"a bas (yalnız onaydan sonra). Hata yoksa toast "Yazı başarıyla oluşturuldu" ve `/content/blog`'a dönüş.
- Sekmede kırmızı nokta → o sekmeyi aç, alan mesajını oku, düzelt; değer değiştiyse yeniden özet + onay.
- Hata toast'ı: "Bu yazı kaydedilemedi…" → Yazar "Ad *" boş mu, slug başka yazıda var mı (listede ara), görsel URL'si geçerli mi, paket karşılaştırma bloğu var mı kontrol et.

## 7. Doğrula
1. Listede başlığı ara → durum rozeti, öne çıkan yıldızı; satırı aç → detayda içerik, görsel, kategori/etiket, yazar, SEO.
2. Yayındaysa detayda "Canlı Görüntüle" ya da `{STOREFRONT_URL}/{locale}/blog/{slug}` → başlık, görsel, içerik, etiketler görünmeli; `/{locale}/blog` listesinde kart (öne çıkansa üstte). ~1 dk bekleme gerekebilir.
3. Rapor: yazı linki (admin + vitrin), durum, yüklenen medya, bekleyen işler ("menüye eklensin mi?", "çevirisi girilsin mi?").

## 8. (İstenirse) Çeviri ekle — ayrı onay
1. Listede yazı → "Düzenle" → durum çubuğundaki "Görünüm / View" → hedef dil.
2. Temel Bilgiler: o dilin Başlık + **URL Adresi (elle)** + Özet; İçerik: çevrilmiş metin/bloklar; SEO: o dilin başlık/açıklaması. "Senkronize et..." **kullanma** (onaysız kaydeder) — kullanıcı açıkça isterse önce onay al.
3. Özet: dil, başlık, slug, içerik özeti + kaydetme şekli: "Kaydet" (çeviri taslak kalır) veya "Yayınla" (o dil canlı; içerik boşsa reddedilir).
4. Onaydan sonra butona bas → toast "{dil} için değişiklikler kaydedildi (ve yayınlandı)." → vitrinde `{STOREFRONT_URL}/{dil}/blog/{çeviri-slug}` kontrol et.

## Varyasyonlar
- **"Taslak yazıyı yayınla":** listede ara → "Düzenle" → içerik kontrol → özet ("Yayınla → anında canlı") → onay → "Yayınla" → toast "Yazı başarıyla yayınlandı." → vitrin kontrolü.
- **"Yayındaki yazıda düzeltme yap":** düzenleme ekranında değiştir → özet "Kaydet/Güncelle ve Yayınla anında canlıya yazar" → onay → bas → vitrin.
- **"Yazıyı yayından kaldır":** düzenleme → "Güncelle ve Yayınla" yanındaki ok → "Taslağa Dön" (vitrinden düşer; ayrı onay, kural 5).
- **"Yazıyı sil":** listede satır menüsü → "Sil" (kalıcı, yorumlarla birlikte; menü linkleri kırılabilir) → ayrı onay.
- **"Benzer bir yazı daha":** satır menüsü "Kopyala" onaysız kopya oluşturur → önce onay; kopya taslak, başlık "(Copy)" ve slug "-copy" ile düzeltilmeli.
- **"Blog'u menüye ekle":** ../domain/screens/design/navigation.md — bağlantı seçicide "Blog" grubu; Kaydet değil **Yayınla** (ayrı onay).
- **"Yorumları onayla":** ../domain/screens/content/blog-comments.md — her tıklama anında kalıcı; önce sayı + liste ile onay.

## Sık hatalar
- Hem "Yazı İçeriği (Eski)" hem bloklar dolu → vitrinde yalnız bloklar görünür.
- Yazar adını boş bırakmak → kayıt reddi.
- "Yayında" seçili formu "durumu sonra değiştiririm" diye kaydetmek → anında canlı.
