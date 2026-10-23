# Navigasyon Tasarımcısı (Navigation Designer)
- URL: {ADMIN_URL}/design/navigation
- Menü yolu: "Mağaza Tasarımı / Store Design" → "Navigasyon / Navigation" veya `/design` hub kartı "Navigasyon".
- Sayfa başlığı: "Navigasyon Tasarımcısı / Navigation Designer", açıklama "Mağazanızın navigasyon menülerini tasarlayın ve yönetin". Geri → `/design`.
- Amaç: Vitrin üst menüsünü (header ana menü) ağaç olarak kurmak: bağlantı, açılır menü (dropdown), mega menü; kategorilerden otomatik menü; dil başına etiket/rozet çevirisi; kaydet ve yayınla.
- Yetki (permission): Menü ve okuma `content:read`; kaydet/yayınla `content:write`. Yetkisizse kayıt "Navigasyon kaydedilemedi." toast'ı ile düşer.
- Veri akışı (işlevsel):
  | İşlem | Etki |
  |---|---|
  | Yükle | Aktif menü kaydını (yoksa varsayılanı) kategori durumlarıyla birlikte getirir |
  | Kaydet (mevcut) | Menü öğelerini kaydeder; kayıt **taslağa** döner |
  | Kaydet (ilk) | "Main Navigation" adıyla varsayılan + aktif menü kaydı oluşturur; **hemen yayında** |
  | Yayınla | Menüyü yayına alır |
  | Kategoriler (dialog) | Kategori ağacını okur |
- Öğe alanları: tip (`link` / `dropdown` / `mega-menu`), etiket + çevirileri, URL + bağlantı tipi (`product` / `category` / `page` / `blog` / `static` / `external`), görünürlük, yeni sekme, ikon, rozet, stil, mega menü ayarları, alt öğeler. Ayrıntı: [../../entities/header.md](../../entities/header.md).

## Ön koşullar ve bağımlılıklar
- Kategoriye link vermek için kategori aktif olmalı (pasif/silinmiş kategori linki ağaçta "Gizli / Hidden" veya "Kaldırıldı / Removed" rozetiyle işaretlenir, vitrinde gösterilmez).
- Sayfa/blog/ürün linki için hedef kayıt mevcut olmalı (bağlantı seçici arama ile bulur).
- Mega menü öne çıkan görseli: medya (medya seçici alanı).
- Çoklu dil için aktif store view'lar.
- Header'da menünün nasıl göründüğü (konum, masaüstü menü düğmesi) `/layout-settings?tab=header` ekranındadır (bkz. [layout-settings.md](layout-settings.md)).

## Yerleşim
1. Başlık sağında: yenile ikon butonu (metinsiz), "Kaydet / Save" (outline; değişiklik yoksa disabled), "Yayınla / Publish" (menü kaydı yoksa disabled).
2. Durum çubuğu (yalnız çevrilebilir dil varsa): kayıt durumu metni, dil seçici "Görünüm / View" (Select), rozet ("Taslak / Draft", "Yayında / Published", "Kaydedilmemiş Değişiklikler / Unsaved Changes"), "{name} için etiketler düzenleniyor", varsayılan dışı dilde "Etiketleri senkronize et... / Sync labels from...".
3. Kart içinde menü oluşturucu:
   - Araç çubuğu: "Öğe Ekle / Add Item" dropdown → "Bağlantı / Link", "Açılır Menü / Dropdown Menu", "Mega Menü / Mega Menu"; sayaç "{count} öğe"; "Kaydedilmemiş değişiklikler" etiketi; "Kategorilerden ekle / Add from categories" butonu; ikon butonlar (tooltip) "Tümünü genişlet", "Tümünü daralt", "Geri al", "Yinele".
   - Varsayılan dışı dilde bilgi: "Navigasyon yapısı tüm dillerde paylaşımlıdır. Sadece etiketler ve rozetler çevrilebilir."
   - Ağaç (sürükle-bırak sıralanabilir): her satır tutamaç + etiket + tip rozeti + göz (Gizle/Göster) + kalem (Düzenle) + "…" menüsü: "Düzenle / Edit", "Bağlantı Ekle / Add Link", "Açılır Menü Ekle / Add Dropdown", "Mega Menü Ekle / Add Mega Menu" (yalnız dropdown/mega-menu satırlarında alt öğe için), "Çoğalt / Duplicate", "Gizle/Göster", "Sil / Delete" (onay dialog'u: "\"{label}\" silinsin mi?" → "Sil").
   - Boş ve varsayılan dilde: "Henüz bir menünüz yok / No navigation menu yet" + "Kategorilerden menü oluştur / Create menu from categories".
   - Alt kısımda canlı önizleme ("Önizlemeyi göster/gizle", Masaüstü/Tablet/Mobil).
   - Öğe düzenleyici: sağdan Sheet, başlık "Bağlantıyı Düzenle / Edit Link" | "Açılır Menüyü Düzenle" | "Mega Menüyü Düzenle"; sekmeler "Genel / General", "Görünüm / Appearance", (mega-menu'de) "Mega Menü".

## Alanlar
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Genel | Etiket * / Label | `label` | Input `#label` | evet | "Etiket zorunludur"; yeni öğe "New Link"/"New Dropdown"/"New Mega Menu" | `getByLabel(/Etiket|Label/)` | Bağlantı seçiciden seçim yapınca etiket "New "/"Yeni " ile başlıyorsa otomatik hedef adına döner |
| Genel | URL | `url` + `linkType` + `resourceId` + `isExternal` | Bağlantı seçici (combobox → arama: Ürünler/Kategoriler/Sayfalar/Blog/Genel Bağlantılar/Özel Bağlantı) | link için pratikte evet | iç yol `/` ile, dış `https://` | `getByRole('combobox', {name:/Bir bağlantı seçin|Choose a link/})` | |
| Genel | Görünür / Visible | `isVisible` | Switch `#isVisible` | — | açık | | "Bu öğeyi navigasyonda göster" |
| Genel | Yeni Sekmede Aç / Open in New Tab | `openInNewTab` | Switch `#openInNewTab` | — | kapalı | | yalnız "Bağlantı" tipi öğelerde görünür |
| Görünüm | İkon (opsiyonel) / İkon Seç | `icon` | İkon seçici (arama "İkon ara...", "İkonu temizle") | — | — | | |
| Görünüm | Metin Stili: Kalınlık / Font Weight | `fontWeight` | Select Normal/Orta/Yarı Kalın/Kalın (`normal|medium|semibold|bold`) | — | | | |
| Görünüm | Yazı Boyutu / Font Size | `fontSize` | Input "örn. 14px" | — | | | |
| Görünüm | Metin Rengi / Arka Plan Rengi | `textColor`, `backgroundColor` | renk + input | — | | | |
| Görünüm | Metin Biçimi / Text Case | `textTransform` | Select Yok/BÜYÜK/küçük/Başlık (`none|uppercase|lowercase|capitalize`) | — | | | |
| Görünüm | İç Boşluk / Dış Boşluk | `padding`, `margin` | Input | — | | | |
| Görünüm | Rozet: Rozet Metni / Badge Text | `badge` | Input "örn. YENİ, İNDİRİM" | — | | | |
| Görünüm | Rozet Stili / Badge Style | `badgeVariant` | Select Yeni `new` / İndirim `sale` / Popüler `hot` / Özel `custom` | — | | | |
| Görünüm | Rozet Rengi / Badge Color | `badgeColor` | renk (Özel stilde) | — | | | |
| Mega Menü | Kolon Düzeni / Column Layout | `columnCount` | Select "{n} Kolon" (2-5) | — | | | |
| Mega Menü | Öne Çıkan Görsel / Featured Image | `featuredImage` | Medya seçici alanı | — | tam URL | | |
| Mega Menü | Görsel Alt Metni / Image Alt Text | `featuredImageAlt` | Input | — | | | |
| Mega Menü | Görsel Bağlantı URL / Image Link URL | `featuredImageUrl` | Input `#featuredImageUrl` (placeholder "/products or https://...") | — | | | |
| Mega Menü | Görsel Konumu / Image Position | `featuredImagePosition` | Select Sağ/Sol/Alt | — | | | |
| Çeviri kapsamı | Birincil etiket (salt okunur) + Çevrilmiş etiket ({language}) | `labelTranslations[lang]` | Input | — | | | yapı düzenlenemez |
| Çeviri kapsamı | Birincil rozet metni + Çevrilmiş rozet ({language}) | `badgeTranslations[lang]` | Input | — | | | |
| Kategori dialogu | "Eklenecek kategorileri seçin / Choose categories to add" | → yeni "Bağlantı" öğeleri (kategori bağlantısı) | Dialog + checkbox listesi (aktif kategoriler varsayılan seçili; menüde olanlar "Zaten menüde") | — | | "Seçilenleri ekle / Add selected", "İptal" | Kök seviyeye **düz** link olarak eklenir, alt kategori hiyerarşisi kurulmaz |

## Aksiyonlar
- **Öğe ekle:** "Öğe Ekle" → tip seç → yeni öğe kök seviyede listenin sonuna eklenir; ardından satırdaki kalem/"Düzenle" ile Sheet'i aç, Etiket + URL doldur, Sheet'i kapat (Uygula butonu yok, değişiklik anında forma yansır).
- **Alt öğe ekle:** dropdown/mega-menu satırının "…" menüsü → "Bağlantı Ekle" vb.
- **Sırala:** tutamaçla sürükle-bırak; bırakılan öğe hedefin **hemen sonrasına, hedefle aynı seviyeye** yerleşir. Yukarı/aşağı butonu yok. Çeviri kapsamında sürükleme kapalı.
- **Kategorilerden menü:** "Kategorilerden menü oluştur" (boşken) / "Kategorilerden ekle" → dialog → "Seçilenleri ekle".
- **Kaydet / Save**: toast "Navigasyon başarıyla kaydedildi." / "{name} için navigasyon etiketleri kaydedildi."; hata "Navigasyon kaydedilemedi."
- **Yayınla / Publish**: kaydedilmemiş değişiklik varsa önce kaydeder, sonra yayınlar → toast "Navigasyon mağazanızda yayınlandı."; hata "Navigasyon yayınlanamadı. Lütfen tekrar deneyin."
- **Sil (öğe):** onay dialog'lu; yalnız formdan siler, kaydet/yayınla gerekir.

## Yan etkiler
- Her kaydetme yeni bir versiyon oluşturur ve menü kaydını **taslağa** çeker.
- Vitrin yayındaki menüyü gösterir (önce varsayılan + aktif + yayında, yoksa herhangi bir aktif + yayında kayıt).
- Yayınlama (ve ilk kaydetme) vitrine çoğunlukla hemen, en geç **~3 dk** içinde yansır.

## Tuzaklar
- **Sadece "Kaydet" menüyü vitrinden kaldırabilir.** Kaydet → kayıt taslak olur → kısa süre içinde (≤3 dk) vitrin menüsü boş görünür. Bu yüzden menü değişikliği her zaman **Kaydet + Yayınla** (ya da doğrudan "Yayınla" — kaydedilmemiş değişiklik varsa önce kendisi kaydeder) olarak tek seferde yapılmalı; onay tek özet için alınmalı.
- Menü kaydı yokken "Yayınla" disabled → ilk "Kaydet" menüyü oluşturur ve **hemen yayına alır**. Onayı ilk Kaydet'ten önce al.
- "Kategorilerden menü oluştur" her kategoriyi kök seviyede düz link yapar; "Elektronik > Telefon" gibi hiyerarşi isteniyorsa elle dropdown/mega menü kurup alt öğeleri taşı.
- Sürükle-bırak bir öğeyi başka bir dropdown'ın altına taşıyabilir (hedefin seviyesine geçer) — bırakmadan önce hedefi doğru seç; sonra ağacı snapshot ile kontrol et.
- Varsayılan dışı dilde yapı salt okunur; yalnız etiket/rozet çevirisi kaydedilir.
- Yenile ikon butonu kaydedilmemiş değişiklikleri sorgusuz atar.
- Kategori linkleri kategoriye canlı bağlıdır: vitrinde kategorinin güncel URL'sine gider; pasif/gizli/silinmiş kategori öğeyi **alt öğeleriyle birlikte** menüden düşürür (bkz. [../../entities/header.md](../../entities/header.md)).
- Masaüstünde açılır menü yalnız 1 alt seviye gösterir; daha derin hiyerarşi için mega menü kullan.

## Doğrulama
1. Toast "Navigasyon mağazanızda yayınlandı." ve rozet "Yayında / Published".
2. Sayfayı yenile → ağaçta öğe, doğru seviye ve sırada; düzenleyicide etiket/URL kalıcı.
3. Vitrin ana sayfa header'ında yeni menü öğesi (masaüstü + mobil menü). Görünmüyorsa ≤3 dk bekle, yine yoksa admin'de yayın rozetini kontrol et.
4. Kategori linkine tıkla → `/products/{urlKey}` (kategori listeleme sayfası) açılmalı.
