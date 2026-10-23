# Sayfa Düzenle — Sayfa Tasarımcısı (Edit Page)
- URL: {ADMIN_URL}/content/pages/{id}/edit   (derin bağlantı: `?tab=basic|content|seo`)
- Giriş: liste satır menüsü "Düzenle / Edit" veya "Çeviriler / Translations", detay ekranı (`/content/pages/{id}`) "Bilgi/İçerik/SEO/Çevirileri Düzenle" (bkz. `pages-list.md`).
- Amaç: Mevcut CMS sayfasının temel bilgilerini, içerik bloklarını (ana sayfa ile aynı blok editörü), SEO'sunu, ayarlarını ve dil başına çevirisini düzenlemek; kaydetmek, yayınlamak, taslağa döndürmek.
- Yetki (permission): Tüm ekran `content:update` / `content:write` ister; yoksa içerik görünmez. Kaydet/Yayınla butonları da aynı yetkiye bağlı.
- İşlemler:
  | İşlem | Ne yapar | Yetki |
  |---|---|---|
  | Yükle | Sayfayı tüm dilleriyle getirir | `content:read` |
  | Kaydet | Formu (Durum alanı dahil), blokları ve çevirileri kaydeder; üst sayfa değiştiyse onu da günceller | `content:write` |
  | Yayınla (varsayılan dil) | Kaydeder + sayfayı yayınlar | `content:write` |
  | Yayınla (çeviri) | Kaydeder + yalnız seçili dili yayınlar | `content:write` |
  | Taslağa Dön | Sayfayı (çeviri kapsamında o dili) yayından kaldırır | `content:write` |
  Alanlar page-create.md ile aynı.

## Ön koşullar ve bağımlılıklar
- Sayfa mevcut olmalı (bulunamazsa hata durumu + "Tekrar Dene").
- Bloklarda kullanılan ürün/kategori/medya/form (entity dosyası).
- Sayfa bir store view'un **çerez politikası** sayfasıysa: kayıt/yayın/taslağa dönüşte "Bu, çerez politikanızda önemli bir değişiklik mi?" dialogu çıkar; Çerez Tablosu bloğu silinemez; "Taslağa Dön" disabled.

## Yerleşim
- Başlık "Sayfa Düzenle / Edit Page", açıklama = sayfa başlığı; geri "Geri / Back".
- Sağ aksiyonlar: "Sayfayı Önizle / Preview Page" (vitrinde `/pages/{slug}` yeni sekmede; vitrin URL'si tanımlı değilse disabled), "Kaydet / Save", ve durum **taslak** ise "Yayınla / Publish"; **yayında** ise "Güncelle ve Yayınla / Update & Publish" + yanında ChevronDown açılır menü → "Taslağa Dön / Revert to Draft".
- Durum çubuğu (çoklu dilde): "Görünüm / View" dil seçici (Select), rozet "Taslak / Draft" | "Aktif / Active" | "Kaydedilmemiş Değişiklikler / Unsaved Changes" (yalnız yayındayken değişiklik varsa), "{name} için içerik düzenleniyor", "Senkronize et... / Sync from...".
- Sekmeler: "Temel Bilgiler / Basic Info" (**varsayılan**), "İçerik / Content" (= blok editörü), "SEO", "Ayarlar / Settings".
- Validasyon özeti (yayın denemesinden sonra): "Kaydetmeden önce N hatayı düzeltin" + alan listesi (tıklayınca ilgili sekmeye gider).

## Alanlar
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Temel Bilgiler | Başlık * / Title * | `title` | Input | evet | 1-255 | label | Çeviri kapsamında o dilin başlığı |
| Temel Bilgiler | URL Adresi * / URL Handle * | `slug` | Input | evet | küçük harf, rakam ve tire | label | Edit modunda başlıktan otomatik üretim yok |
| Temel Bilgiler | Özet / Excerpt | `excerpt` | Textarea | — | ≤500 | | |
| Temel Bilgiler | Sayfa Tipi / Page Type | `type` | Select (Standart/Ana Sayfa/Özel Şablon) | — | | combobox | çeviri kapsamında disabled |
| Temel Bilgiler | Durum / Status | `status` | Select (Taslak/Yayında/Zamanlanmış/Arşivlendi) | — | | combobox | Kaydet bu değeri gönderir (bkz. Tuzaklar) |
| Temel Bilgiler | Şablon / Template; Sıralama / Sort Order | `template`, `sortOrder` | Input | — | | | |
| İçerik | (blok listesi) | `contentBlocks` | Blok editörü (sayfa bağlamı); çerez politikasında Çerez Tablosu bloğu korunur | — | | homepage-builder.md "Blok kartı aksiyon butonları" | Çeviri kapsamında o dilin blokları |
| SEO | SEO alanları (homepage-builder.md SEO tablosuyla aynı) | `seoTitle`… | SEO alanları | — | | | Çeviri kapsamında o dilin SEO'su |
| Ayarlar | Üst Sayfa, Ana Sayfa Olarak Ayarla, Kimlik Doğrulama Gerekli, İzin Verilen Roller, Zamanlanmış Yayın Tarihi, Öne Çıkan Görsel, Sayfa Etiketleri | bkz. page-create.md | | — | | | Çeviri kapsamında hepsi disabled + not "Bu ayarlar tüm diller için ortaktır…" |

## Aksiyonlar
| Buton | Etki | Toast |
|---|---|---|
| Kaydet / Save (değişiklik yoksa disabled) | Kaydeder (formdaki Durum ile) | "Değişiklikleriniz kaydedildi." / "{name} için değişiklikler kaydedildi." |
| Yayınla / Publish (taslakta) | Önce form doğrulaması (hata varsa durur, özet kutusu çıkar) → kaydet + yayınla | "Sayfa başarıyla yayınlandı." / "{name} için değişiklikler kaydedildi ve yayınlandı." |
| Güncelle ve Yayınla / Update & Publish (yayında) | aynı | aynı |
| Taslağa Dön / Revert to Draft | Yayından kaldırır (çeviri kapsamında o dili) | "Sayfa yayından kaldırıldı." |
| Senkronize et → kaynak | Blok yapısını kaynak dilden kopyalar, metinleri korur | "Blok yapısı {source} kaynağından senkronize edildi." |
| Sayfayı Önizle | Vitrinde yayınlanmış hâli | — |

Hata: "Kaydedilemedi. Lütfen bir dakika sonra tekrar deneyin." / "Sayfa kaydedilmedi" + sunucu mesajı (ör. "Bir paket karşılaştırma bloğunda seçili paket yok…", "Çerez politikası çerez tablosunu içermelidir…", slug çakışması).

## Yan etkiler
- Değişiklik vitrinde ~1 dk içinde görünür; ürün/kategori bloklarının verisi ~5 dk'ya kadar gecikebilir.
- Çerez politikası sayfasında "Evet, tekrar sor" seçilirse tüm alışverişçilerden çerez onayı yeniden istenir.

## Tuzaklar
- **Yayındaki sayfada "Kaydet" de canlıya yazar**: içerik anında değişir, sayfa yayında kalır. Yayındaki sayfada taslak çalışma alanı yok — onay her iki butondan önce alınmalı.
- Temel Bilgiler'deki **Durum** select'ini "Yayında" yapıp "Kaydet" demek de sayfayı yayınlar — durum değişikliği için Yayınla/Taslağa Dön butonlarını kullan.
- Ayarlar'da "Ana Sayfa Olarak Ayarla" mevcut ana sayfayı devre dışı bırakır.
- Çeviri kapsamına geçince birincil bloklar o dile kopyalanır; Yayınla yalnız seçili dili yayınlar.
- Varsayılan sekme "Temel Bilgiler" — blok düzenlemek için önce "İçerik" sekmesine tıkla.
- Ekrandan ayrılmadan önce kaydet; kaydedilmemiş değişiklikler kaybolur.

## Doğrulama
1. Toast + rozet; sayfayı yenile → değerler kalıcı.
2. Vitrin `{STOREFRONT_URL}/{locale}/pages/{slug}` (≤1 dk): bloklar beklenen sırada ve içerikte görünür.
