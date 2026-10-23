# Mağaza Tasarımı (Store Design) — hub ve genel bakış
- URL: {ADMIN_URL}/design
- Amaç: Vitrin görünümünü yöneten ekranlara giriş kartları. Kendisi veri yazmaz.
- Yetki (permission): menü grubu `content:read`.
- API: yok (statik kartlar).

## Yerleşim
Başlık "Mağaza Tasarımı / Store Design", açıklama "Müşterilerinin mağazanı nasıl gördüğünü özelleştir / Customize how your storefront looks to your customers". Kartlar, kart tıklanınca gider:

| Kart (tr / en) | Hedef | Harita | Ne yönetir |
|---|---|---|---|
| Anasayfa / Homepage | `/design/homepage` | `homepage-builder.md` | Ana sayfa blokları (hero, slider, banner, ürün/kategori vitrinleri…), SEO, şablonlar |
| Navigasyon / Navigation | `/design/navigation` | `navigation.md` | Header ana menü ağacı (link/dropdown/mega menü) |
| Marka / Branding | `/branding` | `branding.md`, `branding-ai-wizard.md` | Logo, renkler, yazı tipi, stil, ürün rozetleri |
| Üst Bilgi / Header Layout | `/layout-settings?tab=header` | `layout-settings.md` | Header preset'i, bölümler, özellik anahtarları |
| Alt Bilgi / Footer Layout | `/layout-settings?tab=footer` | `layout-settings.md` | Footer sütunları, sosyal, yasal, bülten, ETBİS… |

Sol menüde aynı grup: "Mağaza Tasarımı / Store Design" → Ana Sayfa, Navigasyon, Marka Kimliği / Branding, Üst Bölüm / Header, Alt Bölüm / Footer.

İlgili içerik ekranları ("İçerik / Content" grubu, `/content` hub): Sayfalar (`content/pages-list.md`, `page-create.md`, `page-edit.md`), Blog (`content/blog-list.md`, `blog-edit.md`, `blog-comments.md`), Formlar (`content/forms.md`, `form-submissions.md`), Beden Rehberleri (`content/size-guides.md`), Medya (`content/media-library.md`).

Yapısal modeller (kayıt, yayın, vitrine yansıma): `../../entities/homepage.md`, `../../entities/header.md` (navigasyon dahil), `../../entities/footer.md`, blok kataloğu `../../entities/homepage-components.md`.

## Hangi istek hangi ekrana?
| İstek | Ekran |
|---|---|
| "ana sayfaya X ekle/kaldır/sırala", "slider/banner/ürün vitrini" | homepage-builder (playbook `playbooks/homepage-component-add.md`) |
| "menüye kategori/link ekle", "mega menü" | navigation |
| "logo değiştir", "renkleri değiştir", "font" | branding (AI ile palet: branding-ai-wizard) |
| "header'da arama/sepet ikonu", "duyuru çubuğu", "footer'a link/sosyal medya" | layout-settings |
| "Hakkımızda sayfası oluştur", "kampanya sayfası" | page-create / page-edit |
| "görsel yükle" | media-library (veya bloğun görsel seçicisinden doğrudan) |

## Ekranlar arası kaydet/yayın davranışı (kritik — onay zamanlaması)
| Ekran | "Kaydet" ne yapar | Canlıya ne zaman çıkar |
|---|---|---|
| Ana sayfa | Taslakta: taslak kaydı. Yayındayken tek buton "Güncelle ve Yayınla" | Yayın/"Güncelle ve Yayınla" anında; vitrin ~1-1.5 dk içinde (ürün/kategori listeleri en geç ~5 dk) |
| Navigasyon | Kaydı **taslağa çeker** → yayınlı menü kaybolur (≤3 dk) | Yalnız "Yayınla" ile; her zaman Kaydet+Yayınla birlikte |
| Layout settings | ~3 sn otomatik kayıt, **doğrudan canlı ayarlara** yazar | Değişiklik yapıldığı anda → onay alanlara dokunmadan **önce** |
| Branding | "Taslağı Kaydet" yayındaki markayı taslak yapar (vitrinden düşer) | "Mağazaya Yayınla" ile (~30 sn) |
| CMS sayfası | Yayındaki sayfada Kaydet de canlı | Yayınla / anında (vitrinde ~60 sn içinde) |

## Bileşenler oyun alanı (components-playground)
`/components-playground` blok yapılandırmasıyla **ilgisi olmayan** bir geliştirme ekranıdır; kullanma.

## Tuzaklar
- URL'lerde dil öneki yok; arayüz dili kullanıcının dil tercihinden gelir, varsayılan İngilizce. Label eşleştirirken UI dilini snapshot'tan teyit et.
- Header **veya** footer'dan biri yayınlı değilse vitrin tüm sayfalarda "Coming Soon" gösterir (layout-settings.md); ana sayfa yayınlı değilse vitrin ana sayfası hata ekranı gösterir (homepage-builder.md).
