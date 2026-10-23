# Entity: Blog Yazısı (Blog Post)

Mağazanın blog/makale içeriği. Tenant geneline aittir; bir yazının varsayılan dilde içeriği + dil bazlı çevirileri,
blog kategorileri/etiketleri, yazar bilgisi, SEO alanları ve ziyaretçi yorumları vardır. Ürün kataloğuna bağlı değildir
(içerik bloklarıyla ürün/kategori gösterebilir).

- Ekranlar: [../screens/content/blog-list.md](../screens/content/blog-list.md) (liste + detay),
  [../screens/content/blog-edit.md](../screens/content/blog-edit.md) (oluştur + düzenle),
  [../screens/content/blog-comments.md](../screens/content/blog-comments.md) (yorum moderasyonu).
- Playbook: [../../playbooks/blog-post-create.md](../../playbooks/blog-post-create.md).
- Public API: `GET/POST /cms/blog`, `GET/PUT/DELETE /cms/blog/{id}`, `PUT /cms/blog/{id}/publish|unpublish`,
  `PUT /cms/blog/{id}/translations/{lang}/publish|unpublish`, `POST /cms/blog/{id}/duplicate`, `POST /cms/blog/bulk-delete`,
  yorumlar `PUT /cms/blog/{id}/comments/{commentId}/approve|reject|spam`, `DELETE …/comments/{commentId}`.

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `title` | string | evet | — | 1–255 |
| `slug` | string | evet | başlıktan | Küçük harf, rakam, tire; ≤255. Mağazada benzersiz → `CMS_BLOG_SLUG_EXISTS`. Vitrin adresi `/{locale}/blog/{slug}` |
| `excerpt` | string | hayır | '' | ≤500; liste kartı ve meta açıklama yedeği |
| `status` | enum | — | `draft` | `draft` Taslak, `published` Yayında, `scheduled` Zamanlanmış, `archived` Arşivlendi. Vitrinde yalnız `published` |
| `scheduledAt` | tarih-saat | hayır | null | Yalnız `scheduled` için anlamlı; planlanan yayın zamanı |
| `publishedAt` | tarih-saat | — | otomatik | "Yayınla" ile şimdi; "Taslağa Dön" ile silinir. Liste sıralaması ve vitrinde tarih |
| `content` | metin (HTML/Markdown) | hayır | '' | "Yazı İçeriği (Eski)". Blok yoksa vitrinde bu gösterilir |
| `contentBlocks` | blok listesi | hayır | [] | Sayfa/ana sayfa ile aynı blok kataloğu ([homepage-components.md](homepage-components.md)); **paket karşılaştırma bloğu yasak** (`ERR_CONTENT_PACKAGE_COMPARISON_NOT_ALLOWED_IN_BLOG`). Geçersiz blok → `CMS_BLOG_INVALID_CONTENT_BLOCK` |
| `featuredImage` | URL | hayır | '' | Geçerli URL olmalı; medya kütüphanesinden |
| `gallery` | URL listesi | hayır | [] | Formda en çok 10 |
| `tags` | string listesi | hayır | [] | ≤20, küçük harf, tekrar yok |
| `categories` | {ad, slug} listesi | hayır | [] | Blog'a özel, serbest metin (ürün kategorisi değil); slug addan |
| `author` | {ad, biyografi, avatar, web sitesi, sosyal linkler} | **evet** | — | Ad 1–100 zorunlu (`CMS_BLOG_AUTHOR_REQUIRED`); biyografi ≤500 |
| `seo` | nesne | hayır | indekslenebilir | başlık ≤100, açıklama ≤300, anahtar kelimeler ≤500, odak kelime ≤100, kanonik URL, OG ve Twitter başlık/açıklama/görsel, indeksleme + bağlantı takibi |
| `isFeatured` | bool | — | false | Vitrin blog listesinin ilk sayfasında "öne çıkan" bölümünde (en çok 3) |
| `allowComments` | bool | — | true | Yazıya yorum kabulü |
| `translations[]` | dil bazlı | hayır | [] | Her dil: `language`, başlık, slug, özet, içerik + bloklar, SEO, kendi durumu (`draft`/`published`/`archived`). Dil slug'ı başka yazı/dil adresiyle çakışamaz → `CMS_BLOG_ADDRESS_TAKEN` |
| `readingTime` | sayı (dk) | — | hesaplanır | Yalnız `content` metninden |
| `viewCount`, `commentCount` | sayı | — | 0 | Salt okunur istatistik |
| `comments[]` | yorum listesi | — | [] | Aşağıda |

## Durumlar ve yaşam döngüsü
```
(oluştur) → draft ──Yayınla──▶ published ──Taslağa Dön──▶ draft
   │                              ▲
   ├─ Durum=Yayında ile oluştur ──┘   (anında canlı)
   ├─ scheduled (zamanlama tarihi)
   └─ archived (vitrinde görünmez)
```
- "Kaydet" durumu formdaki değerle yazar; durum alanı üzerinden de geçiş yapılabilir. Yayındaki yazıda her kayıt canlıdır (taslak kopya yok).
- Çeviri durumu ayrı yönetilir: dil görünümünde "Yayınla" yalnız o dili yayınlar; çeviride içerik (blok veya düz metin) yoksa reddedilir (`CMS_BLOG_TRANSLATION_EMPTY`). Normal kayıt çeviri durumunu değiştirmez.
- Çoğalt: taslak kopya, slug `{slug}-copy[-n]`, başlık "(Copy)", yorum ve sayaçlar sıfır.

## Yorumlar
| Alan | Not |
|---|---|
| yazar adı, e-posta, web sitesi, metin, tarih | Ziyaretçiden gelir |
| durum | `pending` Beklemede (her yeni yorum) → `approved` Onaylandı / `rejected` Reddedildi / `spam` Spam |
| üst yorum | Yanıt ise bağlı olduğu yorum |
- Vitrinde yalnız onaylanan yorumlar sayılır. Vitrin yazı sayfası yorum sayısını gösterir.

## İlişkiler
- **Medya** → öne çıkan görsel, galeri, yazar avatarı, OG/Twitter görselleri, blok görselleri (URL olarak saklanır; medya silinirse görsel kırılır).
- **Ürün / kategori / form** → yalnız içerik blokları üzerinden (ürünler, kategoriler, form blokları).
- **Store view / dil** → çeviri dilleri mağazanın aktif store view dillerinden gelir.
- **Navigasyon / footer** → bağlantı seçicinin "Blog" grubu yazıya `/blog/{slug}` URL'si olarak link verir; slug değişir veya yazı silinirse link güncellenmez ([header.md](header.md)).
- Diğer yazılar → aynı etiket veya kategori adını paylaşan yayındaki yazılar "ilgili yazılar" olarak gösterilir.

## Silme kuralları
- Tekil ve toplu silme kalıcıdır; kullanım kontrolü yoktur (menü linkleri kırık kalabilir). Yorumlar yazıyla birlikte silinir.
- Yorum silme kalıcıdır.

## Vitrinde görünüm
| Yer | Ne görünür |
|---|---|
| `/{locale}/blog` | Yayındaki yazılar, 12'şerli sayfa; ilk sayfada üstte en çok 3 öne çıkan yazı; yazılardaki blog kategorilerinden filtre. Hiç yazı yoksa sayfa arama motorlarına kapalı |
| `/{locale}/blog/{slug}` | Kategoriler, başlık, yazar (avatar, ad, biyografi), tarih, okuma süresi, paylaş butonu, öne çıkan görsel, içerik (bloklar; blok yoksa düz metin), etiketler, yorum sayısı, ilgili yazılar |
| Dil | Çevirisi yayında olan dilde o dilin başlık/içerik/slug'ı; yoksa varsayılan içerik |
| Gecikme | Değişiklikler ~1 dk içinde |
| Menü | Blog sayfası/yazısı menüye otomatik eklenmez |
