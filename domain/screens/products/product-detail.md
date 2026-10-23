# Ürün Detayı (salt okunur)
- URL: {ADMIN_URL}/products/{id}  — locale öneki yok
- Amaç: Bir ürünün salt-okunur özeti (görseller, varyantlar, açıklama, detaylar, kategoriler, özel nitelikler, kargo, sipariş kuralları, çok dilli SEO, fiyat, envanter, meta, işaretler). Buradan **Düzenle**, **Arşivle**, **Geri Yükle**, **Kalıcı olarak sil** aksiyonları yapılır. Yeni ürün oluşturma sonrası (`/products/new`, `/products/new-by-code`) yönlendirilen ekran budur — kayıt doğrulaması için kullanılır.
- Yetki (permission):
  - Görüntüleme: `products:read`.
  - "Kalıcı olarak sil" butonu yalnızca `products:delete:permanent` olan kullanıcıda görünür (super_admin).
  - Arşivle: `products:delete`; Geri yükle: `products:write`. Yetkisiz kullanıcıda işlem reddedilir → hata toast'ı.
- Ekranın kullandığı veriler:
  - Ürün (varyantlarıyla), ürünün store view çevirileri, aktif store view'lar (sıralı), ürün etiketleri (labels), ürünün attribute set'i ve attribute'ları (değer etiketleri için). Ürün bulunamazsa toast + `/products`'a yönlendirme.
  - Arşivle: durum = Arşivlendi; stok değişmez.
  - Geri yükle: ürünü **Taslak** durumuna döndürür.
  - Kalıcı sil: SKU onayıyla; bilinen hata durumları (SKU eşleşmedi, arşivli değil, ayrılmış stok var) dialog içinde gösterilir.

## Ön koşullar ve bağımlılıklar
- Ürün mevcut olmalı (`./product-list.md` listesinden satır tıklanarak veya `./product-create.md` sonrası yönlendirme ile gelinir).
- Kalıcı silme için ürünün önce **arşivlenmiş** olması gerekir (buton yalnızca durum Arşivlendi iken görünür).
- Özel nitelik etiketleri için ürünün attribute set'i okunabilmeli (opsiyonel).

## Yerleşim
Üstte (koşullu) uyarı, başlık; altında 3 sütunlu ızgara (geniş ekranda): sol 2 sütun ana içerik, sağ 1 sütun yan kartlar.
1. **Stok kaynağı uyarısı** (yalnızca stok bilgisi geçici olarak alınamadığında): uyarı "Stok bilgisi geçici olarak güncel olmayabilir / Stock numbers may be temporarily out of date" + **Yenile / Refresh** butonu.
2. **Başlık**: geri ok (aria-label "Ürünlere Dön / Back to Products"), `h1` = ürün adı, öne çıkan ise yıldız ikonu; durum rozeti, tip rozeti, "SKU: {sku}". Sağda aksiyon butonları (bkz. Aksiyonlar).
3. Sol sütun (sırasıyla):
   - **Ürün Görselleri / Product Images** — yalnızca medya varsa; ana görselde "Ana / Main" rozeti; tıklayınca önizleme galerisi.
   - **Varyantlar / Variants** (yalnızca varyant varsa): başlıkta toplam sayı rozeti; ilk birkaç varyant satırı (küçük görsel, başlık = varyant adı veya nitelik etiketleri "A / B" veya SKU, "Varsayılan / Default" rozeti, "Pasif / Inactive" rozeti, stok rozeti "Stokta yok / Out of stock", "Az kaldı / Low stock", fiyat, "SKU: …"). Silinmiş varyantlar gösterilmez; sıra: konum, sonra SKU. Fazlası varsa "Tümünü gör ({count}) / View all ({count})" butonu.
   - **Açıklama / Description** — "Kısa Açıklama / Short Description", "Tam Açıklama / Full Description".
   - **Ürün Detayları / Product Details**: Görünürlük / Visibility, Ürün Durumu / Condition, URL Kısayolu / Slug, SKU, Barkod / Barcode (varsa), EAN (varsa), Etiketler / Tags (yoksa "Etiket yok / No tags"), ürün etiketleri (labels) renkli rozet olarak.
   - **Kategoriler / Categories**: kategori rozet listesi. Boşsa "Kategori atanmamış / No categories assigned".
   - **Özel Nitelikler / Custom Attributes**: "Nitelik Seti / Attribute Set" adı + attribute set gruplarına göre değerler (seçenek değerleri arayüz dilindeki etiketle). Boşsa "Bu ürüne ait özel nitelik girilmemiş. / This product has no custom attributes set."
   - **Kargo ve Boyutlar / Shipping & Dimensions**: Kargoya Uygun / Shippable veya "Kargoya uygun değil / Not shippable", Ücretsiz Kargo / Free Shipping, Kargo Ücreti / Shipping Price (yalnızca kargoya uygun ve ücretsiz kargo değilse), Ağırlık / Weight, Uzunluk / Length, Genişlik / Width, Yükseklik / Height.
   - **Sipariş Kuralları / Ordering Rules**: Minimum/Maksimum Sipariş Miktarı, Miktar Artışı / Quantity Increments (boşsa "—").
   - **SEO Bilgileri / SEO Information**: açılır liste; ilk öğe varsayılan SEO, sonra her store view çevirisinin SEO'su; her öğede "dolu/8" sayaç rozeti. Alanlar: Meta Başlık, Meta Açıklama, Anahtar Kelimeler, Odak Anahtar Kelime, Standart URL / Canonical URL, Open Graph (OG Başlık/Açıklama/Görsel), Twitter Kartı, İndeksleme (İndekslenebilir/Takip Edilebilir). Altta "SEO girilmemiş diller: {languages}". Hiç yoksa "SEO bilgisi girilmemiş / No SEO information provided".
4. Sağ sütun:
   - **Fiyatlandırma / Pricing**: Temel Fiyat / Base Price; aktif özel fiyat varsa temel fiyat üstü çizili + Özel Fiyat / Special Price; Karşılaştırma Fiyatı / Compare At Price (yalnızca temel fiyattan büyükse); Maliyet / Cost. Ürünün para birimiyle.
   - **Envanter / Inventory**: Satılabilir Toplam / Salable Total; varyantlı ise "Stok varyantlardan yönetiliyor / Stock is managed per variant" + link butonu "Stok sekmesine git / Open Stock tab"; Stok Durumu / Status rozeti "Stokta / In Stock" veya "Stok Tükendi / Out of Stock"; buton "Ürün envanterini görüntüle / View product inventory" → `/inventory/stock/product/{id}`.
   - **Meta Veriler / Metadata**: Ürün ID / Product ID (eş aralıklı yazı), Oluşturulma / Created, Son Güncelleme / Last Updated (gg.aa.yyyy ss:dd).
   - **İşaretler / Flags**: Öne Çıkan, Yeni, Çok Satan, Aktif (durum), Hediye Mesajı, Hediye Paketi, İade Edilebilir, Değerlendirmeler, Karşılaştırma — onay/çarpı ikonlarıyla.

Bu ekranda **sekme yok**.

## Alanlar
Salt okunur ekran — form alanı yok. Okunabilir değerler ve locator ipuçları:

| Bölüm | Label (tr / en) | Alan | Kontrol tipi | Locator ipucu | Not |
|---|---|---|---|---|---|
| Başlık | (h1) | Ürün adı | heading | `getByRole('heading', { level: 1 })` | |
| Başlık | durum rozeti | Durum | rozet | metin: Taslak/Draft, Yayında/Published, Arşivlendi/Archived, Stokta Yok/Out of Stock, Üretimi Durdu/Discontinued | Arşiv tespiti için kullan |
| Başlık | tip rozeti | Tip | rozet | Basit/Simple, Varyantlı/Configurable, Paket/Bundle, Sanal/Virtual, İndirilebilir/Downloadable, Hediye Kartı/Gift Card, Abonelik/Subscription, Gruplu/Grouped | |
| Başlık | SKU: / SKU: | SKU | text | `getByText(/^SKU:/)` | |
| Ürün Detayları | Görünürlük / Visibility | Görünürlük | text | | Her Yerde Görünür/Visible Everywhere, Sadece Katalog/Catalog Only, Sadece Arama/Search Only, Görünmez/Not Visible |
| Ürün Detayları | URL Kısayolu / Slug | Slug | text | | |
| Ürün Detayları | Barkod / Barcode, EAN | Barkod, EAN | text | | yalnızca doluysa |
| Kategoriler | Kategoriler / Categories | Kategoriler | rozet listesi | | |
| Özel Nitelikler | Nitelik Seti / Attribute Set | Attribute set adı | text | | |
| Fiyatlandırma | Temel Fiyat / Base Price | Temel fiyat | text | | |
| Fiyatlandırma | Özel Fiyat / Special Price | Özel fiyat | text | | yalnızca aktif tarih aralığında |
| Fiyatlandırma | Maliyet / Cost | Maliyet | text | | |
| Envanter | Satılabilir Toplam / Salable Total | Stok miktarı | text | | |
| Meta Veriler | Ürün ID / Product ID | Ürün id | text | eş aralıklı yazı | |

## Aksiyonlar
| Buton (tr / en) | Koşul | Davranış |
|---|---|---|
| Geri ok (aria-label "Ürünlere Dön / Back to Products") | her zaman | `/products` |
| **Düzenle / Edit** | her zaman | `/products/{id}/edit` → `./product-edit.md` |
| **Arşivle / Archive** | durum ≠ Arşivlendi | Onay dialog'u açar: başlık "Bu ürün arşivlensin mi? / Archive this product?", açıklama "\"{name}\" mağazadan gizlenir ve aktif katalogdan çıkarılır. Kalıcı olarak silinmez, daha sonra arşivden geri yüklenebilir." Butonlar: "İptal / Cancel", "Arşivle / Archive". Başarı: toast "İşlem başarıyla tamamlandı" + "Ürün başarıyla arşivlendi / Product archived successfully" ve `/products`'a yönlendirme. Hata: toast "Bir hata oluştu" + hata mesajı veya "Ürün silinemedi. Lütfen tekrar deneyin. / Failed to delete product. Please try again." |
| **Geri Yükle / Restore** | durum = Arşivlendi | Onay YOK, doğrudan çalışır; işlem sürerken pasif. Başarı: toast "Ürün başarıyla geri yüklendi / Product restored successfully", sayfa yerinde güncellenir (yönlendirme yok, durum → Taslak). Hata: "Ürün geri yüklenemedi. Lütfen tekrar deneyin. / Failed to restore product. Please try again." |
| **Kalıcı olarak sil / Delete permanently** | durum = Arşivlendi VE `products:delete:permanent` | Yazarak onay dialog'u: başlık "Bu ürün kalıcı olarak silinsin mi? / Delete this product permanently?", açıklama + "Bu işlem geri alınamaz.", input label "Onaylamak için {sku} yazın / Type {sku} to confirm" — **SKU'yu tam yazmadan onay butonu aktif olmaz**. Onay butonu "Kalıcı olarak sil / Delete permanently". Başarı: toast "Ürün kalıcı olarak silindi / Product permanently deleted" + `/products`. Hatalar dialog içinde gösterilir: SKU eşleşmedi → "Yazdığınız SKU eşleşmiyor…", arşivli değil → "Bu ürünün kalıcı olarak silinebilmesi için önce arşivlenmesi gerekir.", ayrılmış stok → "{count} adet birim hâlâ açık siparişlere ayrılmış…", diğer → "Ürün kalıcı olarak silinemedi. Lütfen tekrar deneyin." |
| Yenile / Refresh (uyarı bandında) | stok uyarısı görünürken | sayfayı yeniler |
| Varyant satırı (tıklanabilir) | varyant varsa | `/products/{id}/edit?tab=variants&variantId={variantId}` — form ilgili satıra kayar |
| Tümünü gör ({count}) / View all ({count}) | varyant sayısı önizleme limitini aşarsa | `/products/{id}/edit?tab=variants` |
| Stok sekmesine git / Open Stock tab | tip = Varyantlı | ürün düzenleme ekranını açar; Stok sekmesine doğrudan gitmek için `/products/{id}/edit?tab=inventory` |
| Ürün envanterini görüntüle / View product inventory | her zaman | `/inventory/stock/product/{id}` ([../inventory/stock.md](../inventory/stock.md)) |

**Bu ekranda kaydetme/onay gerektiren form yok.** Arşivle ve Kalıcı sil geri alınması zor işlemlerdir — kullanıcıdan açık onay alınmadan tıklanmamalı.

## Yan etkiler
- Arşivle: durum = Arşivlendi; stok değişmez. Ürün vitrinden ve vitrin aramasından birkaç dakika içinde kalkar (bu ekran özelinde doğrulanmadı).
- Geri yükle: durum = Taslak (yayına almak için edit ekranında durum değiştirilmeli).
- Kalıcı sil: ürün + tüm varyantlar silinir, ayrılmış stok serbest bırakılır (doğrulanmadı).

## Tuzaklar
- Yükleme başarısızsa (ör. geçersiz id) sayfa toast gösterip **otomatik `/products`'a yönlendirir** — URL değişimi = ürün bulunamadı sinyali.
- Yüklenirken tam ekran bekleme göstergesi + "Ürün yükleniyor... / Loading product..." metni; içerikle etkileşimden önce h1'i bekle.
- Edit deep-link `?tab=` değerleri: basic, seo, pricing, inventory, media, identification, custom-attributes, relationships, variants, bundle, downloadable, virtual, subscription, grouped, labels, options, scheduling.
- Arşivle ≠ kalıcı silme; arşivlenen ürün geri yüklenebilir.
- Geri yüklemeden sonra ürün **Taslak** olur, yayında değil.
- Fiyatlandırma kartında özel fiyat yalnızca tarih aralığı aktifse görünür; girilmiş ama ileri tarihli özel fiyat burada görünmez → edit ekranında kontrol et.

## Doğrulama
- Ürün oluşturma/düzenleme sonrası bu sayfada: h1 = beklenen ad; durum/tip rozetleri; "SKU: …"; Fiyatlandırma kartında Temel Fiyat ve para birimi; Envanter'de Satılabilir Toplam; Kategoriler, Özel Nitelikler, Görünürlük, Slug, Barkod/EAN; varyantlı ürünlerde Varyantlar kartı sayısı.
- SEO dil bazında: SEO listesinde her store view için "x/8" sayacı.
- Arşivleme sonrası: `/products` listesine dönülür; ürün aktif listede görünmez (liste arşivlileri varsayılan olarak gizler), "Arşivlenenleri göster" ile görünür (bkz. `./product-list.md`). Detay sayfası yeniden açılınca durum rozeti "Arşivlendi / Archived" ve "Geri Yükle" butonu.
- Kalıcı silme sonrası: `/products/{id}` açıldığında toast + listeye yönlendirme.
