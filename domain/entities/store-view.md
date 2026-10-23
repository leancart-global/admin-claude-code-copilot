# Entity: Store View (Mağaza Görünümü)

Mağazanın sunulduğu bir dil (+ bölge) ve o dilin varsayılan para birimi. Ürün, kategori, marka, özellik seçenekleri ve
CMS sayfaları için **çeviri kapsamı** store view başına açılır; vitrin dil yönlendirmesi, URL kısa yolları ve çerez
politikası sayfası da store view başınadır. Tenant genelinde tanımlıdır.

- Ekranlar: [../screens/settings/store-views.md](../screens/settings/store-views.md) (liste + Sheet + görünüm ayarları).
- Form kalıbı: `domain/project/ui-conventions.md` §11 (store view çubuğu / içerik dili seçici).

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `code` | string | evet (otomatik) | dilden türetilir (ör. `tr_tr`, `en_us`) | Mağaza içinde benzersiz (aynı kod → 409). Formda görünmez, **değiştirilemez**. Görünüm ayarları URL'sinde kullanılır |
| `name` | string | hayır | dil adı | "Görünen Ad"; boşsa dil adı |
| `language` / `locale` | dil adı / dil_BÖLGE | evet | — | UI seçenekleri: en (en_US), tr (tr_TR), de (de_DE), fr (fr_FR), es (es_ES), it (it_IT), nl (nl_NL), ar (ar_SA, sağdan sola). **Değiştirilemez** → `ERR_STORE_VIEW_LOCALE_IMMUTABLE` (422) |
| `direction` | `ltr`/`rtl` | — | dilden | Arapça `rtl` |
| `currency` | ISO-4217 kod | hayır | boş | Mağazada tanımlı para birimi olmalı; UI yalnız aktif para birimlerini sunar |
| `isDefault` | bool | — | false | Tek varsayılan: biri varsayılan yapılınca diğerinin işareti kalkar. Varsayılan yoksa ilk aktif görünüm varsayılan gibi davranır |
| `isActive` | bool | — | true | Aynı dilde **iki aktif** görünüm olamaz → `ERR_STORE_VIEW_LOCALE_EXISTS` (409) (oluştururken ve aktifleştirirken) |
| URL kısa yolları | sayfa → slug eşlemesi | hayır | boş = sistem varsayılanı | Yalnız küçük harf, rakam, tire, ASCII; ayrılmış değerler ve aynı görünümde tekrar yasak |
| Çerez politikası sayfası | yayınlanmış CMS sayfası | hayır | yok | Değiştirirken "önemli değişiklik mi?" sorusu: Evet → tüm ziyaretçilerden çerez onayı yeniden istenir |

## Kurallar
- Plan: ikinci ve sonraki store view için `multi_language` özelliği → yoksa `ERR_FEATURE_REQUIRED` (403).
- Varsayılan görünüm **silinemez** ("Cannot delete default store view") ve UI'da pasifleştirilemez.
- Silme kalıcıdır; UI uyarısı: o görünümün tüm çevirileri kaybolur.
- Aktiflik ve varsayılan değişimi liste menüsünden **anında** kaydolur.

## İlişkiler
| İlişki | Yön | Not |
|---|---|---|
| Para birimi | store view → currency | Kullanılan para birimi silinemez (`ERR_CURRENCY_IN_USE`) — [currency.md](currency.md) |
| Ürün/kategori/marka/özellik çevirileri | çeviri → store view | Görünüm başına bir çeviri; çevrilmemiş içerik varsayılan görünüme düşer |
| CMS sayfası | çerez politikası referansı | Sayfa silinirse referans "bulunamadı" uyarısı verir |
| Ürün/kategori oluşturma | UI ön koşulu | ≥1 aktif store view |
