# Sayfalar Listesi (CMS Pages List) + Sayfa Detay
- URL: {ADMIN_URL}/content/pages
- İlgili: İçerik hub'ı {ADMIN_URL}/content — 4 kart: "Sayfalar / Pages" ("Hakkımızda, İletişim ve SSS gibi statik sayfaları oluştur ve düzenle / Create and edit static pages like About, Contact, and FAQ"), "Blog", "Beden Rehberleri / Size Guides", "Medya / Media"; her kartta "Aç / Open". Hub başlığı "İçerik / Content".
- Menü yolu: Sol menü "İçerik / Content" → "Sayfalar / Pages" (`content:read`).
- Amaç: CMS sayfalarını (statik sayfalar, ana sayfa kaydı dahil) tablo veya hiyerarşik ağaç görünümünde listelemek, filtrelemek, detayına/düzenleyicisine gitmek, alt sayfa eklemek, silmek. **Yayınlama/çoğaltma bu listede yok** — yayınlama düzenleme ekranında (`/content/pages/[id]/edit`, bkz. page-edit.md).
- Yetki (permission): Liste/ağaç/detay `content:read`; Ekle `content:create`; Düzenle/Çeviriler `content:update`; silme ve toplu silme `content:delete`. Oluştur/güncelle/yayınla için `content:write`.
- İşlemler:
  | İşlem | Ne yapar | Yetki |
  |---|---|---|
  | Tablo listesi | Sayfaları 50'şerli, arama/durum/tip filtresiyle listeler | `content:read` |
  | Ağaç | Tüm sayfaları üst-alt hiyerarşisiyle getirir (ana sayfa ve korumalı işaretleriyle) | `content:read` |
  | Detay | Tek sayfanın tüm bilgileri (store view çerez politikası bağlantıları dahil) | `content:read` |
  | Sil | Sayfayı siler; bir store view'un çerez politikası olan sayfa silinemez | `content:delete` |
  | Toplu sil | Seçili sayfaları siler; seçimde çerez politikası olarak bağlı bir sayfa varsa tüm işlem reddedilir | `content:delete` |

## Ön koşullar ve bağımlılıklar
- Login + `content:read`. Ekle butonu için `content:create`; satır Düzenle/Çeviriler için `content:update`; Sil için `content:delete`.
- Ana sayfa (homepage) kaydı da bir CMS sayfasıdır (tip "Ana Sayfa"); listede amber "Ana Sayfa / Homepage" ikon/rozetiyle görünür. Ana sayfanın tasarımı için tercih edilen ekran `/design/homepage`'dır (bkz. design/homepage-builder.md); bu listeden düzenlemek de mümkün ama önerilmez — doğrulanmadı.
- Çerez politikası olarak bir store view'a bağlı sayfa silinemez/yayından kaldırılamaz.

## Yerleşim
Tek kart:
1. **Başlık**: "Sayfalar / Pages" + toplam rozet, açıklama "Görsel blok oluşturucu ile CMS sayfaları oluşturun ve yönetin / Create and manage CMS pages with visual block builder". Sağda "Sayfa Ekle / Add Page" (+ ikon) → `/content/pages/new`.
2. **Hızlı filtreler**: arama, Durum select'i, Tip select'i, sağda görünüm toggle'ı (Tablo / Ağaç). Mobilde select'ler ikinci satıra iner.
3. **Aktif filtre rozetleri**: "Aktif filtreler: / Active filters:" + "Ara / Search: \"…\"", "Durum / Status: …", "Tip / Type: …", "Ana Sayfa / Homepage: Evet/Hayır" + "Tümünü temizle / Clear all".
4. **Toplu işlem çubuğu**: "{count} sayfa seçildi / {count} page(s) selected", "Seçimi Temizle / Clear Selection", "Seçilenleri Sil / Delete Selected" (kırmızı).
5. **Hata bandı**: "Sayfa yüklenemedi / Failed to load page" + "Yenile / Refresh".
6. **Görünüm**: Tablo + sayfalama, ya da Ağaç (sayfalama yok). Görünüm tercihi tarayıcıda hatırlanır (varsayılan Tablo).

### Tablo görünümü
Kolonlar (sırasıyla):
| Kolon (tr / en) | İçerik | Sıralanabilir |
|---|---|---|
| (checkbox) | Satır seçimi; başlıkta tümünü seç | — |
| "Başlık / Title" | FileText ikonu + başlık (kalın), altında `/{slug}` | Evet (yalnızca görüntülenen sayfadaki satırlar) |
| "Durum / Status" | Rozet: "Yayında / Published", "Taslak / Draft", "Zamanlanmış / Scheduled", "Arşivlendi / Archived" (kırmızı) | Hayır |
| "Tip / Type" | Outline rozet: "Standart Sayfa / Standard Page" (`page`), "Ana Sayfa / Homepage" (`homepage`), "Özel Şablon / Custom Template" (`custom`), ayrıca "Hakkında Sayfası", "İletişim Sayfası", "Gizlilik Politikası", "Kullanım Koşulları" | Hayır |
| "Güncellendi / Updated" | Son güncelleme tarihi | Evet |
| "Zamanlanmış / Scheduled" | Zamanlanmış yayın (amber takvim ikonu + kısa tarih-saat) veya "-" | Evet |
| (aksiyonlar) | "⋯" butonu (sr-only "İşlemler / Actions") → açılır menü | — |
Boş durum: "Sayfa bulunamadı / No pages found" + "Filtrelerinizi değiştirmeyi veya yeni sayfa oluşturmayı deneyin. / Try adjusting your filters or create a new page." (+ filtre varsa "Tümünü temizle").
Sayfalama: "{total} sayfadan {from} - {to} arası gösteriliyor / Showing {from} to {to} of {total} pages", "Önceki / Previous", "Sayfa {current} / {total} / Page {current} of {total}", "Sonraki / Next". Sayfa boyutu 50.

### Ağaç görünümü
- 600 px yüksek iki panelli kutu: solda ağaç, sağda detay paneli.
- Ağaç başlığı: "Sayfalar ({count}) / Pages ({count})", + ikon butonu (tooltip "Sayfa Ekle / Add Page"); araç butonları "Genişlet / Expand", "Daralt / Collapse", "Tümü / All" (tümünü seç), "Hiçbiri / None".
- Düğüm: genişlet/daralt chevron, checkbox (`aria-label="Select <title>"`), başlık; ana sayfa ise amber Home ikonu (tooltip "Ana Sayfa"); korumalı ise Lock ikonu; hover'da kalem (düzenle) butonu. Düğüme tıklamak sağ paneli o sayfaya getirir.
- Alt seçim bilgisi: "{count} seçildi / {count} selected" + "Temizle / Clear".
- Sağ panel (seçili yoksa "Sayfa Seçilmedi / No Page Selected" + "Detaylarını görmek için ağaçtaki bir sayfaya tıklayın / Click on a page in the tree to view its details"): başlık, durum/"Ana Sayfa"/"Korumalı / Protected"/tip rozetleri, "Düzenle / Edit" butonu, "İşlemler" menüsü ("ID Kopyala / Copy ID", "Tüm Detayları Gör / View Full Details", "Çevirileri Yönet / Manage Translations", "Alt Sayfa Ekle / Add Child Page", "Sayfayı Sil / Delete Page"), istatistikler (Alt Sayfalar / Görüntülenme / Çeviriler), "Sayfa Bilgileri / Page Information" (Tip, Şablon, Sıralama, Üst Sayfa ID, Oluşturulma, Güncelleme, Yayınlanma), "SEO" önizleme, alt sayfalar (ilk 5 + "+{count} alt sayfa daha"), "Hızlı İşlemler / Quick Actions".
- Ağaçta sürükle-bırak ile taşıma/yeniden sıralama **yok**.
- Boş: "Sayfa bulunamadı / No pages found" + "İlk sayfanızı oluşturarak başlayabilirsiniz. / Get started by creating your first page." + "Sayfa Ekle".

## Alanlar
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Filtre | placeholder "Sayfalarda ara... / Search pages..." | `search` | Input (sağda temizle X butonu) | Hayır | ~300 ms gecikmeli arama; sayfalama 1'e döner | `getByPlaceholder('Sayfalarda ara...')` | Başlık, içerik, özet ve etiketlerde arar |
| Filtre | Durum: "Tüm Durumlar / All Statuses", "Yayında / Published", "Taslak / Draft", "Zamanlanmış / Scheduled", "Arşivlendi / Archived" | `status` | Select (combobox + listbox) | Hayır | Varsayılan: tümü (filtre yok) | combobox metni "Tüm Durumlar" | Sonuç listesini gözle de kontrol et |
| Filtre | Tip: "Tüm Tipler / All Types", "Standart Sayfa / Standard Page", "Ana Sayfa / Homepage", "Özel Şablon / Custom Template" | `type` | Select | Hayır | Varsayılan: tümü | combobox metni "Tüm Tipler" | |
| Filtre | Görünüm: aria "Tablo görünümü / Table view", "Ağaç görünümü / Tree view" | viewMode | ToggleGroup (`role=radio`) | — | Tablo | `getByRole('radio',{name:'Ağaç görünümü'})` | Geçişte seçim sıfırlanır |
| Tablo | satır checkbox | — | Checkbox | — | — | satırdaki `getByRole('checkbox')` | Toplu çubuğu açar |

## Aksiyonlar
| Buton/menü (tr / en) | Yer | Etki | Onay/Toast |
|---|---|---|---|
| "Sayfa Ekle / Add Page" | Başlık (create izni) | `/content/pages/new` (bkz. page-create.md) | — |
| Satır "⋯" → "Görüntüle / View" | Tablo | `/content/pages/{id}` (Sayfa detay) | — |
| Satır "⋯" → "Düzenle / Edit" | Tablo (update izni) | `/content/pages/{id}/edit` | — |
| Satır "⋯" → "Çeviriler / Translations" | Tablo (update izni) | Aynı: `/content/pages/{id}/edit` | — |
| Satır "⋯" → "Alt Sayfa Ekle / Add Subpage" | Tablo (create izni) | `/content/pages/new?parentId={id}` | — |
| Satır "⋯" → "Sil / Delete" (kırmızı) | Tablo (delete izni) | Onay diyaloğu: "Emin misiniz? / Are you sure?" + "\"{title}\" kalıcı olarak silinecek. Bu işlem geri alınamaz. Tüm alt sayfalar da silinecek. / This will permanently delete \"{title}\". This action cannot be undone. All subpages will also be deleted." → "İptal / Cancel" / "Sil / Delete" | Başarı: "Başarılı / Success" + "Sayfa başarıyla silindi / Page deleted successfully"; hata: "Hata / Error" + eşlenmiş mesaj (aşağıda) veya "Sayfa yüklenemedi" |
| "Seçilenleri Sil / Delete Selected" | Toplu çubuk | Seçili sayfaları siler | "{count} sayfa başarıyla silindi. / {count} page(s) have been deleted successfully." veya "{successful} silindi, {failed} başarısız." |
| Ağaç: düğüm kalemi / panel "Düzenle" | Ağaç | `/content/pages/{id}/edit` | — |
| Ağaç panel menüsü "ID Kopyala / Copy ID" | Ağaç | Panoya sayfa ID'si (toast yok) | — |
Silme hata kodu: `ERR_COOKIE_POLICY_PAGE_REFERENCED` → "Bu sayfa en az bir mağaza görünümünün çerez politikası olduğu için silinemez veya yayından kaldırılamaz. Önce bu mağaza görünümleri için farklı bir çerez politikası sayfası seçin. / This page is the cookie policy for at least one store view, so it can't be deleted or taken offline. Choose a different cookie policy page for those store views first." (Kural sayfanın store view'a bağlı olmasına göredir; slug'ın "cookie-policy" olması önemsiz.)

## Sayfa detay (/content/pages/[id])
- URL: {ADMIN_URL}/content/pages/{id}
- Yükleme: sayfa, varsa üst sayfası ve alt sayfaları yüklenir. Hata/boş: "Hata / Error" + mesaj veya "Sayfa bulunamadı / Page not found" + "Sayfalara Dön / Back to Pages".
- Üst kısım: "← Sayfalara Dön / Back to Pages" butonu; başlık (h1) + durum rozeti + (ana sayfa ise amber "Ana Sayfa" rozeti); altında `/{slug}`. Sağda "Düzenle / Edit" (update izni) → `/content/pages/{id}/edit`, "Sil / Delete" (delete izni, kırmızı) → aynı onay diyaloğu; başarıda `/content/pages`'e yönlendirir.
- Sol (2/3) kartlar:
  - "İçerik Önizleme / Content Preview" (yalnızca eski tip HTML içerik varsa).
  - "Sayfa Bilgileri / Page Information" + "Bilgi Düzenle / Edit Info" → `/edit?tab=basic`: Tip, Şablon ("varsayılan / default"), Sıralama, "{count} görüntülenme", URL (path), Özet, Etiketler.
  - "Sayfa Hiyerarşisi / Page Hierarchy" + "Alt Sayfalar ({count})": ebeveyn ve çocuklar tıklanabilir (→ ilgili detay).
  - "İçerik Blokları / Content Blocks" (rozet: blok sayısı) + "İçerik Düzenle / Edit Content" → `/edit?tab=content`: her blok için sıra no + blok tipinin ham değeri (ör. `hero`, `products`) + gizliyse "Gizli / Hidden". Bu liste salt okunur — blok içerikleri görünmez.
- Sağ (1/3) kartlar: "Hızlı İşlemler / Quick Actions" ("ID Kopyala / Copy ID", "URL Kopyala / Copy URL" → toast "{label} panoya kopyalandı", "Çevirileri Yönet / Manage Translations" → edit), "Meta Veriler / Metadata" (Oluşturulma, Güncelleme, Yayınlanma, "Zamanlanmış Yayın / Scheduled Publication"), "Erişim Kontrolü / Access Control" ("Kimlik Doğrulama Gerekli / Authentication Required" Evet/Hayır, "İzin Verilen Roller / Allowed Roles"), "SEO" (başlık, `example.com/{slug}`, açıklama, "Dizinlenebilir / Indexable" ya da "Dizinlenmesin / No Index") + "SEO Düzenle / Edit SEO" → `/edit?tab=seo`, "Çeviriler / Translations" (dil + durum rozeti) + "Çevirileri Düzenle / Edit Translations".
- Bu ekranda yayınla/yayından kaldır butonu YOK.
- Kullanım: Bir sayfanın blok tiplerini hızlıca görmek ve doğru düzenleme sekmesine (`?tab=basic|content|seo`) derin bağlantı yapmak için.

## Yan etkiler
- Silme kalıcıdır; vitrindeki sayfa erişilemez olur (404).
- Silme onay metni alt sayfaların da silineceğini söyler; özette alt sayfa sayısını (detay ekranı "Alt Sayfalar ({count})") belirt.

## Tuzaklar
- Başlık/tarih sıralaması yalnızca görüntülenen sayfadaki (≤50) satırları sıralar.
- "Çeviriler" menüsü ayrı bir ekran açmaz, düzenleme ekranına gider.
- Tablo ve ağaç arasında geçince seçim sıfırlanır; ağaçta sayfalama yoktur.
- Ana sayfa kaydını buradan silmek/değiştirmek ana sayfayı bozabilir — ana sayfa için `/design/homepage` kullan.
- Oturum düşerse toast sonrası kısa süre içinde `/login`'e yönlendirir.

## Doğrulama
- Sayfa listesinde başlık ve `/slug` satırı görünüyor; durum rozeti beklenen değerde.
- Silme sonrası toast "Sayfa başarıyla silindi" ve satır kayboldu; listede başlık aranınca sonuç yok.
- Detay ekranında "İçerik Blokları" listesinde beklenen blok tipleri ve sıra.
