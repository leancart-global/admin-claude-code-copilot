# Ana Sayfa Tasarımcısı (Homepage Designer)
- URL: {ADMIN_URL}/design/homepage
- Menü yolu: Sol menü "Mağaza Tasarımı / Store Design" → "Ana Sayfa / Homepage", veya `/design` hub'ında "Anasayfa / Homepage" kartı.
- Sayfa başlığı: "Ana Sayfa Tasarımcisi / Homepage Designer", açıklama "Vitrin ana sayfanızı tasarlayın ve yönetin / Design and manage your storefront homepage". Geri ok → `/design`.
- Amaç: Vitrin ana sayfasının içerik bloklarını (hero, slider, banner, ürün/kategori vitrinleri…) ekleme, düzenleme, sıralama, gizleme; SEO; şablon uygulama; taslak kaydetme ve yayınlama. Blok kataloğu: `domain/entities/homepage-components.md`.
- Yetki (permission):
  - Menü ve görüntüleme: `content:read`.
  - "Kaydet / Güncelle ve Yayınla" ve "Yayınla" butonları `content:write` ister. Yetki yoksa butonlar **hiç görünmez**.
- API (yetki ve amaç; ayrıntı `../../entities/homepage.md`):
  | İşlem | Yetki | Not |
  |---|---|---|
  | Yükle | `content:read` | Durumdan bağımsız tek ana sayfa kaydı; kayıt yoksa şablon galerisi açılır |
  | Store view'lar | — | dil seçici için |
  | Marka renkleri | — | şablonlara renk uygulamak için |
  | İlk oluşturma | `content:write` | İlk Kaydet/Yayınla ana sayfa kaydını oluşturur (başlık "Homepage", slug `homepage`) |
  | Kaydet (taslak) | `content:write` | Bloklar, çeviriler, SEO kaydedilir; durum değişmez |
  | Yayınla (varsayılan dil) | `content:write` | Kaydet + yayınla |
  | Yayınla (çeviri dili) | `content:write` | Kaydet + yalnız o çeviriyi yayınla |
  | Yayından kaldır | `content:write` | Bu ekranda tetikleyen buton yok |

## Ön koşullar ve bağımlılıklar
- Blok tipine göre: ürünler (aktif; öne çıkan/indirimli işaretleri), kategoriler (aktif, görselli), medya (görseller), yayınlanmış formlar, hedef sayfalar (link). Ayrıntı: entity dosyasında her bloğun "Veri bağımlılıkları".
- Marka (`/branding`) yayınlıysa şablon/preset renkleri ondan gelir; yoksa sabit varsayılanlar.
- Çoklu dil için aktif store view'lar (Ayarlar → Store Views). Yoksa dil seçici görünmez.
- Vitrin ana sayfası **yayınlanmış** ana sayfa ister; yoksa vitrin "No published homepage content was found…" hata ekranı gösterir.

## Yerleşim
1. **İlk ziyaret (ana sayfa kaydı yok)** → tam ekran şablon galerisi: başlık "Ana Sayfanızı Tasarlayın / Design Your Homepage", kartlar: Klasik E-Ticaret, Kategori Odakli, Kampanya / İndirim, Minimal, Boş Sayfa; her kartta "Şablonu Kullan / Use Template". Seçince editöre geçer (henüz kayıt yok; ilk Kaydet/Yayınla kaydı oluşturur).
2. **Normal durum:**
   - Sabit başlık + sağda aksiyonlar: "Mağazayı Önizle / Preview Store" (vitrin URL'si biliniyorsa, yeni sekme), "Kaydet / Save" veya "Güncelle ve Yayınla / Update & Publish", "Yayınla / Go Live" (yalnız taslakta).
   - Durum çubuğu: solda kayıt durumu metni ("Kaydediliyor... / Saving...", "{time} önce kaydedildi / Saved {time}", "Kaydetme başarısız oldu: …"), dil seçici (çoklu dilde), durum rozeti, "{name} için içerik düzenleniyor / Editing content for {name}", "Senkronize et... / Sync from..." dropdown.
   - Kart içinde sekmeler: "Düzenleyici / Editor" (varsayılan), "SEO", "Şablonlar ve Bölümler / Templates & Sections"; sekme satırının sağında "Bölüm Ekle / Add Section" dropdown (her sekmede görünür).
   - Editor sekmesi = blok düzenleyici (bkz. aşağı).
3. **Blok düzenleyici:**
   - Araç çubuğu: solda "Blok Ekle / Add Block" (dropdown, arama + kategoriler); ortada cihaz butonları (`aria-label` "Masaüstu / Desktop", "Tablet", "Mobil / Mobile" — tuval genişliği 100% / 768px / 375px); sağda "Geri Al / Undo", "İleri Al / Redo" (icon, aria-label), "Önizleme / Preview" (toggle).
   - Tuval: blok kartları dikey liste. Her kartın başlığı **hover'da veya seçiliyken** görünür: tutamaç (drag handle), blok ikonu+adı, sağda ikon butonlar. Kart gövdesi bloğun admin önizlemesi.
   - Bloklar arası "+" ekleme noktaları: her bloğun altında/üstünde hover'da görünen ortalanmış "Blok Ekle" butonu → o konuma ekler.
   - Boş durumda: "Henüz içerik bloğu yok / No content blocks yet" + "Blok Ekle".
   - Ayar paneli: sağdan açılan panel (`role=dialog`), başlık "{blockName} Ayarları / {blockName} Settings". Kapatma: Esc, dışarı tıklama veya X. **Ayrı "Uygula" butonu yok** — her alan değişikliği anında forma yazılır.

## Alanlar

### Üst seviye (sekmeler ve durum çubuğu)
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Durum çubuğu | Görünüm / View (dil seçici) | — | Select (`button[role=combobox]`) | — | varsayılan dil | `getByRole('combobox')` durum çubuğunda; seçenek adları "Türkçe", "İngilizce"… veya varsayılan görünüm adı | Yalnız ≥1 çevrilebilir dil varsa |
| Durum çubuğu | Senkronize et... / Sync from... | — | DropdownMenu | — | — | `getByRole('button', {name: /Senkronize et|Sync from/})` | Kaynak dilin blok YAPISINI kopyalar, mevcut çevrilmiş metinleri korur |
| Editor | (blok listesi) | blok listesi (dil seçiliyse o dilin listesi) | blok düzenleyici | — | — | bkz. Aksiyonlar | |
| SEO | SEO Başlığı / SEO Title | `seoTitle` | Input | — | ≤100 | label ile | Çeviri dili seçiliyse o dilin SEO başlığı |
| SEO | Meta Açıklama / Meta Description | `seoDescription` | Textarea | — | ≤300 | | |
| SEO | Anahtar Kelimeler / Keywords | `seoKeywords` | Input | — | ≤500, virgülle | | |
| SEO | Odak Anahtar Kelime / Focus Keyword | `focusKeyword` | Input | — | ≤100 | | |
| SEO | Kanonik URL / Canonical URL | `canonicalUrl` | Input | — | URL | | |
| SEO | OG Başlığı / OG Title; OG Açıklaması / OG Description | `ogTitle`, `ogDescription` | Input, Textarea | — | ≤100 / ≤300 | | |
| SEO | OG Görsel URL / OG Image URL | `ogImage` | medya seçici | — | geçerli URL | | Geçersizse "Open Graph görsel adresi geçersiz" toast'ı |
| SEO | Twitter Başlığı/Açıklaması/Görsel URL | `twitterTitle`, `twitterDescription`, `twitterImage` | Input/Textarea/medya seçici | — | | | |
| SEO | İndekslemeye İzin Ver / Allow Indexing; Bağlantı Takibine İzin Ver / Allow Link Following | `indexable`, `followable` | Switch | — | açık | | |
| Şablonlar ve Bölümler | Şablon kartları + "Şablonu Kullan / Use Template" | blok listesi (tümü değişir) | Card + Button | — | — | `getByRole('button', {name:'Şablonu Kullan'})` kartın içinde | Mevcut blok varsa onay dialogu "Mevcut tasarımı değiştir?" → "Değiştir / Replace" |
| Şablonlar ve Bölümler | Hazır bölüm kartları + "Sayfaya Ekle / Add to Page" | ekler | Card + Button | — | — | | Kategoriler: Önerilen/Pazarlama/İçerik |
| Sekme satırı sağı | Bölüm Ekle / Add Section | ekler | DropdownMenu (preset listesi, "Önerilen" rozetli) | — | — | `getByRole('button',{name:'Bölüm Ekle'})` | Sona ekler |

### Blok kartı aksiyon butonları
Hepsi `aria-label`'lı ikon butonlar; `{blockName}` = bloğun tr/en adı (ör. "Hero", "Ürünler", "Slayt Gösterisi").
| Aksiyon | aria-label (tr / en) | Not |
|---|---|---|
| Sürükle | "{blockName} bloğunu yeniden sırala" / "Reorder {blockName} block" | sürükle tutamacı. Playwright `dragTo` ile hedef kartın üstüne bırak; daha güvenilir alternatif yukarı/aşağı butonları |
| Yukarı taşı | "{blockName} bloğunu yukarı taşı" / "Move {blockName} block up" | ilk blokta disabled |
| Aşağı taşı | "{blockName} bloğunu aşağı taşı" / "Move {blockName} block down" | son blokta disabled |
| Gizle / Göster | "{blockName} bloğunu gizle" / "Hide {blockName} block" — gizliyse "…göster" / "Show…" | görünürlük aç/kapa; gizli kart %50 opak |
| Ayarlar | "{blockName} bloğunun ayarlarını düzenle" / "Edit {blockName} block settings" | ayar panelini açar; karta **çift tık** da açar |
| Çoğalt | "{blockName} bloğunu çoğalt" / "Duplicate {blockName} block" | kopya hemen altına |
| Sil | "{blockName} bloğunu sil" / "Delete {blockName} block" | onay dialogu "{blockName} bloğu silinsin mi?" → "Sil / Delete" (iptal "İptal / Cancel") |

Aynı tipte birden fazla blok varsa aria-label'lar aynıdır → `nth()` veya kartın `data-block-id` / içerik metniyle daralt.

## Aksiyonlar
| Buton (tr / en) | Görünürlük | Etki | Onay/Toast |
|---|---|---|---|
| Kaydet / Save | durum **taslak** iken; değişiklik yoksa disabled | (kayıt yoksa oluşturur) bloklar, çeviriler ve SEO kaydedilir; durum taslak kalır | toast "Değişiklikleriniz kaydedildi." / "{name} için değişiklikler kaydedildi." |
| Güncelle ve Yayınla / Update & Publish | durum **yayında** iken (aynı buton); değişiklik yoksa disabled | kaydet + yayınla → **anında canlı** | toast "Ana sayfanız artık yayında." / "{name} görünümü için değişiklikler kaydedildi ve yayınlandı." |
| Yayınla / Go Live | yalnız taslakta; değişiklik şartı yok | kaydet + yayınla | aynı başarı toast'ı |
| Mağazayı Önizle / Preview Store | vitrin URL'si varsa | vitrini yeni sekmede açar (yayınlanmış hâli gösterir, taslağı değil) | — |
| Önizleme / Preview (editör içi) | her zaman | admin içi basit önizleme (gizli bloklar hariç); vitrin görünümü değildir | — |
| Geri Al / İleri Al | — | editör geçmişi | — |
| Şablonu Kullan → Değiştir | | tüm blokları şablonla değiştirir (kaydedilene kadar yalnız editörde) | "Şablon ana sayfaniza uygulandi." |
| Bölüm Ekle / Sayfaya Ekle | | preset bloklarını sona ekler | "Bölüm ana sayfaniza eklendi." |
| Senkronize et → kaynak | çoklu dil | blok yapısını senkronize eder | "Blok yapısı {source} kaynağından senkronize edildi." (+ "{added} yeni blok eklendi — toplamda {total} blok.") |

Hata toast'ları: sunucu/ağ hatası veya çok sık istek → "Kaydedilemedi. Lütfen bir dakika sonra tekrar deneyin."; oturum düştü → "Oturumunuz sona erdi…"; yetki yok → "Bunu yapmaya yetkiniz yok."; sayfa bulunamadı → "Bu sayfa artık mevcut değil…"; OG/Twitter/öne çıkan görsel → ilgili özel mesaj; diğer doğrulama hataları → "Kaydedilemedi. Lütfen sayfa içeriğini ve SEO ayarlarını geçersiz veya eksik bir değer için kontrol edin." Blok kuralı hataları (features/package-comparison) da bu genel mesajla görünür.

## Yan etkiler
- Blok yapısı ve metin değişiklikleri vitrine en geç ~1-1.5 dk içinde yansır.
- Ürün/kategori bloklarının kaynak/adet/seçim değişiklikleri ve ürün verisi değişiklikleri vitrine **en geç ~5 dk** içinde yansır. Sekmeli birincil öne çıkanlar bölümü anında güncellenir (ayrıntı `../../entities/homepage.md`).
- Yayınlanmış çeviri, o dilde vitrinde kendi bloklarını gösterir; yayınlanmamış çeviri → birincil bloklar gösterilir.

## Tuzaklar
- Bir çeviri dili seçiliyken "Yayınla" yalnız o çeviriyi yayınlar; sayfanın kendi durumu değişmez (`../../entities/homepage.md`).
- Herhangi bir CMS sayfasında "Ana Sayfa Olarak Ayarla" açılıp kaydedilirse mevcut ana sayfa **sessizce** ana sayfa olmaktan çıkar.
- Ana sayfa kaydı Sayfalar listesinden silinir veya yayından kaldırılırsa vitrin ana sayfası hata ekranı gösterir. Bunlar ayrı onaylı, geri alınamaz işlemlerdir.
- **Yayındaki ana sayfada "taslak kaydet" yok.** Durum yayında ise tek kaydet butonu "Güncelle ve Yayınla"dır ve basıldığı an değişiklik canlıya çıkar. Kullanıcı onayı **bu butona basmadan önce** alınmalı. Taslak çalışma alanı yoktur; editörde yapılan değişiklikler kaydedilene kadar yalnız açık editördedir (sayfayı yenilemek/çıkmak değişiklikleri kaybettirir).
- "Kaydet" butonu değişiklik yokken disabled; preset/şablon eklemek ve blok ayar panelinde değişiklik yapmak butonu etkinleştirir.
- Ayar paneli açıkken arka plandaki kaydet butonuna basılamaz — önce paneli kapat (Esc).
- Ayar panelinde "Uygula" yoktur; alanı doldurmak yeterli (Playwright `fill` yeterli).
- Kart başlığındaki aksiyon butonları **yalnız hover/seçili** iken görünür. Önce karta tıkla (seçer) sonra butona; ya da `force` kullanmadan hover et.
- Aynı tipte iki blok → aria-label çakışır. Kartı içerdiği metinle (`filter({hasText})`) bul.
- Çoklu dilde: dil değiştirince o dil için **kopya** blok listesi oluşur; birincil dile eklenen yeni blok diğer dillere otomatik geçmez. Yayınla butonu yalnız **seçili dili** yayınlar. Varsayılan dili yayınlamak için seçiciyi varsayılana al.
- `products` bloğu ana sayfadaki **ilk** products bloğu ve kaynak "öne çıkan" ise vitrinde sekmeli özel bölüm olarak görünür (Öne Çıkanlar/Yeni Gelenler/Çok Satanlar). İkinci bir "öne çıkan" bloğu düz ızgara olur.
- Gösterilecek ürün/kategori yoksa blok vitrinde tamamen kaybolur (hata göstermez).
- İlk blok `carousel` ise vitrin header'ı carousel üstüne bindirilir (şeffaf header) — slayt görselleri koyu/kontrastlı olmalı.
- Carousel yüksekliği blok "Yerleşim / Layout" ayarındadır ve editör varsayılanı `full` (tam ekran).
- Admin içi "Önizleme" vitrin değildir; nihai doğrulama vitrinde yapılmalı.
- Yayından kaldır butonu bu ekranda yok.
- İlk yüklemede iskelet (skeleton) görünür → "Düzenleyici" sekmesinin görünmesini bekle.

## Doğrulama
1. Kayıttan sonra toast metnini oku; durum çubuğunda "Saved just now / az önce kaydedildi" ve rozet "Yayında / Published" (yayınladıysan) görülmeli; "Kaydedilmemiş Değişiklikler" rozeti kalkmalı.
2. Sayfayı yenile (`/design/homepage`) → blok listesi aynı sırada, eklenen blok mevcut ve ayar panelinde değerler kalıcı.
3. Ağ (salt okunur): kaydet ve (yayınladıysan) yayınla isteklerinin başarılı (200) döndüğünü kontrol et.
4. Vitrin: `{STOREFRONT_URL}/{locale}` (veya "Mağazayı Önizle") → yeni bölüm beklenen konumda, başlığı/görseli/butonuyla görünmeli (carousel ilk bloksa sayfanın en üstünde, header altında manşet olarak). Ürün/kategori bloklarında en geç ~5 dk gecikmeyi hesaba kat; görünmüyorsa kaynakta ürün olup olmadığını kontrol et.
5. Çoklu dilde `{STOREFRONT_URL}/{dilPrefix}` ile ilgili dili kontrol et.
