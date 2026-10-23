# Sayfa Oluştur (Create Page)
- URL: {ADMIN_URL}/content/pages/new — alt sayfa için `?parentId=<id>` (liste satırı "Alt Sayfa Ekle / Add Subpage" bununla açar)
- Menü yolu: "İçerik / Content" → "Sayfalar / Pages" → "Sayfa Ekle / Add Page" (liste ekranı: `pages-list.md`).
- Amaç: Yeni CMS sayfası (Hakkımızda, İletişim, SSS, kampanya sayfası…) oluşturmak. İçerik blokları ana sayfayla **aynı** blok editörüdür (blok kataloğu: `domain/entities/homepage-components.md`).
- Yetki (permission): `content:create` / `content:write`. Yetkisizse form görünmez.
- İşlemler:
  | İşlem | Ne yapar | Yetki |
  |---|---|---|
  | Oluştur | Sayfayı tüm sekmelerdeki alanlarla oluşturur | `content:write` |
  | Üst sayfa ata | Üst Sayfa seçildiyse oluşturmadan hemen sonra atanır | `content:write` |
  | Üst sayfa arama (Ayarlar sekmesi) | Mevcut sayfaları seçenek olarak listeler | `content:read` |
- Başarıdan sonra liste ekranına (`/content/pages`) döner — oluşturulan sayfanın **edit ekranına gitmez**.

## Ön koşullar ve bağımlılıklar
- Slug benzersiz olmalı (`CMS_PAGE_SLUG_EXISTS` → hata toast'ı).
- Bloklarda kullanılacak ürün/kategori/medya/form mevcut olmalı (entity dosyası).
- Üst sayfa seçilecekse o sayfa mevcut olmalı.

## Yerleşim
- Başlık satırı: geri ok (aria-label "Geri / Back"), "Sayfa Oluştur / Create Page", açıklama "Görsel blok oluşturucu ile CMS sayfaları oluşturun ve yönetin", durum rozeti (seçili durum). Sağda: "İptal / Cancel", "Oluştur / Create" (submit).
- Blok varsa bilgi kutusu: "İçerik: N blocks".
- Sekmeler: "Temel Bilgiler / Basic Info" (varsayılan), "İçerik / Content" (blok sayısı rozeti), "SEO", "Ayarlar / Settings". Hatalı sekmede kırmızı nokta.
- Mobilde alt kısımda tekrar İptal/Oluştur.

## Alanlar
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Temel Bilgiler › Sayfa Bilgileri | Başlık * / Title * | `title` | Input | evet | 1-255 | `getByLabel('Başlık *')` | Slug'ı otomatik üretir (slug elle değiştirilmediyse) |
| Temel Bilgiler | URL Adresi * / URL Handle * | `slug` | Input | evet | `^[a-z0-9]+(?:-[a-z0-9]+)*$`, ≤255 ("Slug must be lowercase with hyphens only") | `getByLabel('URL Adresi *')` | Vitrin URL'si `/{locale}/pages/{slug}` |
| Temel Bilgiler | Özet / Excerpt | `excerpt` | Textarea | hayır | ≤500 | | |
| Temel Bilgiler › Tip ve Durum | Sayfa Tipi / Page Type | `type` | Select | — | `page`; seçenekler Standart Sayfa `page`, Ana Sayfa `homepage`, Özel Şablon `custom` | combobox | "Ana Sayfa" seçme — ana sayfa `/design/homepage`'den yönetilir |
| Temel Bilgiler | Durum / Status | `status` | Select | — | `draft`; Taslak/Yayında/Zamanlanmış/Arşivlendi | combobox | **"Yayında" seçip Oluştur → sayfa anında canlı** |
| Temel Bilgiler | Şablon / Template | `template` | Input (placeholder "varsayılan") | — | ≤100 | | boş bırak |
| Temel Bilgiler | Sıralama / Sort Order | `sortOrder` | number Input | — | 0 | | |
| İçerik | Sayfa İçeriği (Eski) / Page Content (Legacy) | `content` | Textarea (HTML/Markdown) | — | — | | Bloklar varken yedek; genelde boş bırak |
| İçerik | İçerik Blokları / Content Blocks — sekme "Görsel / Visual" | `contentBlocks` | Blok editörü (sayfa bağlamı) | — | [] | bkz. homepage-builder.md "BlockEditor" | |
| İçerik | sekme "JSON" | `contentBlocks` | Textarea (JSON) | — | — | | Gelişmiş; tarayıcı otomasyonunda kullanma |
| SEO | SEO Başlığı, Meta Açıklama, Anahtar Kelimeler, Odak Anahtar Kelime, Kanonik URL, OG Başlığı/Açıklaması/Görsel URL, Twitter Başlığı/Açıklaması/Görsel URL, İndekslemeye İzin Ver, Bağlantı Takibine İzin Ver | `seoTitle`, `seoDescription`, `seoKeywords`, `focusKeyword`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage`, `twitterTitle`, `twitterDescription`, `twitterImage`, `indexable`, `followable` | Input/Textarea/medya seçici alanı/Switch | — | ≤100 / ≤300 / ≤500 | label ile | |
| Ayarlar › Sayfa Hiyerarşisi | Üst Sayfa / Parent Page | `parentId` | Açılır arama listesi (arama "Sayfa ara...", ilk seçenek "Yok (kök düzey)") | — | null | combobox butonu | ?parentId ile önceden dolu |
| Ayarlar | Ana Sayfa Olarak Ayarla / Set as Homepage | `isHomepage` | Switch | — | false | | **Açma**: mevcut ana sayfanın ana sayfa işaretini kaldırır |
| Ayarlar › Erişim Kontrolü | Kimlik Doğrulama Gerekli / Require Authentication | `requiresAuth` | Switch | — | false | | |
| Ayarlar | İzin Verilen Roller / Allowed Roles | `allowedRoles` | etiket input (yaz + Enter) | — | [] | | |
| Ayarlar › Zamanlama | Zamanlanmış Yayın Tarihi / Scheduled Publish Date | `scheduledAt` | `input[type=datetime-local]` | — | null | | Tarih girmek durumu "Zamanlanmış" yapar |
| Ayarlar › Öne Çıkan Görsel | Görsel URL / Image URL | `featuredImage` | Medya seçici alanı | — | '' | | |
| Ayarlar › Etiketler | Sayfa Etiketleri / Page Tags | `tags` | etiket input (Enter), tıklayınca kaldır | — | ≤20 | | |

## Aksiyonlar
- **Oluştur / Create** (submit): form doğrulaması (alan odaktan çıkınca da çalışır) → hatalıysa sekmede kırmızı nokta, toast yok; geçerliyse oluşturur → toast başlık "İşlem başarıyla tamamlandı" + açıklama "Sayfa başarıyla oluşturuldu" → `/content/pages`'e yönlenir. Hata: "Bu sayfa kaydedilemedi. Lütfen alanları kontrol edip tekrar deneyin." veya görsel URL'ye özgü mesaj.
- **İptal / Cancel** veya geri ok: onaysız `/content/pages`'e döner (girilenler kaybolur).

## Yan etkiler
- Durum "Yayında" ile oluşturulursa vitrinde `/{locale}/pages/{slug}` ~1 dk içinde erişilebilir.
- Menüye otomatik eklenmez; menü için `design/navigation.md`.

## Tuzaklar
- Oluşturduktan sonra edit ekranına değil listeye döner; ek düzenleme için listede başlığı ara → "Düzenle".
- Slug, başlıktan Türkçe karakterler dönüştürülerek üretilir; kurala uymayan elle slug kaydı engeller.
- Varsayılan durum **Taslak**; kullanıcı "yayınla" demediyse Taslak bırak ve özette belirt.
- "Ana Sayfa Olarak Ayarla" / tip "Ana Sayfa" mevcut ana sayfayı devre dışı bırakır — kullanıcı açıkça istemedikçe dokunma.
- Blok ekleme ve ayarlar için homepage-builder.md'deki blok editörü tuzakları aynen geçerli.

## Doğrulama
1. Toast + `/content/pages` listesinde başlığı ara: satır, durum rozeti doğru.
2. Satırı aç (Görüntüle) → bloklar ve SEO alanları kayıtlı.
3. Yayında ise vitrin `{STOREFRONT_URL}/{locale}/pages/{slug}`.
