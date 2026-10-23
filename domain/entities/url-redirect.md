# Entity: URL Redirect (URL Yönlendirmesi)

Vitrinde bir kaynak yola gelen isteği mağaza içindeki başka bir yola gönderen kural (301 kalıcı / 302 geçici).

- Ekran: [../screens/seo/redirects.md](../screens/seo/redirects.md) (liste, oluştur, düzenle, CSV içe aktarma).
- Playbook: [../../playbooks/redirect-create.md](../../playbooks/redirect-create.md).

## Alanlar

| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| `fromPath` | string | evet | — | `/` ile başlar (regex değilse); ≤2048. Mağaza içinde **benzersiz** (pasifler dahil) → `ERR_REDIRECT_ALREADY_EXISTS` (409). Store view öneki olmadan yazılır |
| `toPath` | string | evet | — | Tek `/` ile başlayan mağaza içi yol; tam URL, `//`, `\` yok → `ERR_REDIRECT_INVALID_TARGET`; ≤2048. Regex'te `$1` yakalama grupları |
| `type` | 301 \| 302 | — | 301 | 301 kalıcı (SEO değeri hedefe geçer), 302 geçici |
| `isActive` | bool | — | true | Pasif kural uygulanmaz ama kaynak yolu tutar |
| `isRegex` | bool | — | false | Kaynak düzenli ifade; aşırı karmaşık → `ERR_REDIRECT_PATTERN_UNSAFE` |
| `priority` | 0–1000 | — | — | Yalnız regex kuralları arasında sıra |
| `notes` | string ≤500 | hayır | — | Dahili not |
| `hitCount` | sayı | — | 0 | Salt okunur; vitrindeki gerçek ziyaretler |

## Kurallar
- **Döngü / zincir yasak** (regex olmayan, aktif kurallar arasında) → `ERR_REDIRECT_LOOP`: kaynak = hedef; hedef başka bir aktif kuralın kaynağı; ya da başka bir aktif kural bu kaynağa yönlendiriyor. Karşılaştırmada sondaki `/`, sorgu dizesi ve URL kodlaması yok sayılır. Pasif bir kuralı etkinleştirmek de aynı kontrolden geçer.
- Eşleşme sırası: önce birebir (regex olmayan) kaynak, sonra regex kuralları önceliğe göre. Regex sonucu başka bir aktif kuralın kaynağına düşerse yönlendirme uygulanmaz.
- Kural tüm store view'larda geçerli; dil öneki hedefe korunarak eklenir. Hedefte sorgu dizesi yoksa ziyaretçininki taşınır.
- Sepet, ödeme, hesap/giriş, medya, statik dosyalar, robots/sitemap yönlendirilmez.
- Vitrine yansıma: genelde hemen, en geç ~5 dk.
- Aktif birebir kaynaklar site haritasından çıkarılır.
- Silme kalıcıdır. Panelde dışa aktarma yoktur.
- **Otomatik oluşmaz:** ürün slug'ı / kategori slug'ı değişince ya da kategori silinince bu listeye kayıt eklenmez; eski adres için yönlendirme elle açılır.

## İlişkiler
| İlişki | Not |
|---|---|
| Ürün URL'si | ürün slug'ı (çevirilerde); vitrindeki yol biçimi (ör. `/product/{slug}`, store view'a göre yerelleşebilir) canlıda kontrol edilmeli ([product.md](product.md), [../screens/products/product-edit.md](../screens/products/product-edit.md)) |
| Kategori URL'si | kategori slug'ı ([category.md](category.md), [../screens/categories/category-edit.md](../screens/categories/category-edit.md)); vitrin yol biçimi canlıda kontrol edilmeli |
| CMS sayfası / blog | sayfa ve yazı slug'ları ([../screens/content/page-edit.md](../screens/content/page-edit.md), [../screens/content/blog-edit.md](../screens/content/blog-edit.md)) |
| Store view | dil öneki ([store-view.md](store-view.md)) |
| Site haritası | aktif kaynaklar haritadan çıkar |
