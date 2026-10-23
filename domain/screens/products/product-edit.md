# Ürün Düzenle
- URL: {ADMIN_URL}/products/{id}/edit — locale öneki YOK. Deep link: `?tab=<value>` (ilk açılacak sekme) ve `?tab=variants&variantId=<id>` (varyant satırına kaydırıp 2 sn vurgular).
- Amaç: Mevcut ürünün tüm alanlarını, store view (dil) çevirilerini, varyantlarını güncellemek; yalnızca edit'te bulunan Etiketler / Özel Seçenekler / Zamanlama sekmelerini yönetmek.
- Yetki (permission): Kaydetmek için `products:write`.
- Ekranın kullandığı veriler ve kayıt sırası:
  - **Yükleme**: ürün (varyantlarıyla, maliyet dahil), ürünün çevirileri, ilişkili ürünlerin ad/SKU'su, form referans verileri (./product-create.md ile aynı; ürünün mevcut vergi sınıfı pasif olsa bile gösterilir).
    - Yükleme uzun sürerse toast "Ürün yüklemesi beklenenden uzun sürüyor…", sayfada kalır; diğer hata → toast + `/products`'a yönlendirme.
  - **Kaydet** (sırayla):
    1. Ürün güncellenir (gönderilen alanlar create ile aynı; varyantlı üründe miktar ve depo ürün kaydına gitmez). Kademe fiyatları yalnızca kademe satırlarına bu oturumda dokunulduysa gönderilir.
    2. Çeviriler: dolu her store view için (ad/slug/açıklamadan biri dolu) çeviri kaydı güncellenir ya da oluşturulur.
    3. Varyant değişiklikleri (eklenen/güncellenen/silinen) — yalnızca değişiklik varsa.

## Ön koşullar ve bağımlılıklar
- Ürün mevcut olmalı (./product-list.md veya ./product-detail.md → "Düzenle").
- Store view çubuğu yalnızca **varsayılan dışında ≥1 aktif store view** varsa görünür → ../settings/store-views.md.
- Diğer bağımlılıklar (kategori, attribute set, depo, vergi sınıfı, müşteri grubu, medya) ./product-create.md "Ön koşullar" ile aynı.
- Bu sayfada create'teki ön koşul kartı **yok** (form her zaman açılır).

## Yerleşim
- Sayfa başlığı: "Ürünü Düzenle / Edit Product", alt başlık "Ürün bilgilerini güncelleyin / Update product information", geri oku → `/products`.
- **Store View çubuğu**: Label "Görünüm / Store View", Select (ilk seçenek "Varsayılan / Default", sonra store view adları), durum rozeti ("Yayında / Published", "Değiştirildi / Modified", "Taslak / Draft"), "{name} için içerik düzenleniyor", "{completed} / 6 alan" sayacı.
  - Varsayılan dışı bir görünüm seçildiğinde: Temel Bilgiler sekmesi yalnızca çevrilebilir alanları gösterir (Ürün Adı, URL Kısayolu, Kısa Açıklama, Tam Açıklama) + sarı not "Dile özgü olmayan alanlar (fiyat, stok, kategori vb.) varsayılan dilde düzenlenir."; SEO sekmesinde Meta Başlık/Meta Açıklama o dile yazılır; **diğer tüm sekmeler** mavi not "Bu ayarlar tüm diller için ortaktır. Değiştirmek için varsayılan görünüme geçin." ile soluk ve tıklanamaz.
- Sekmeler: ./product-create.md "Yerleşim" tablosundaki tüm sekmeler (tipe göre) **+ yalnızca edit'te**:

| Tab value | tr / en | Kaydetme modeli |
|---|---|---|
| `labels` | Etiketler / Labels | Ana formdan **bağımsız**, anında kaydolur |
| `options` | Özel Seçenekler / Custom Options | Bağımsız, anında kaydolur |
| `scheduling` | Zamanlama / Scheduling | Bağımsız, anında kaydolur |

- Footer: "İptal / Cancel" + submit "Ürünü Güncelle / Update Product" ("Kaydediliyor..."). Ürün tipi **değiştirilemez** (tip seçimi yok; Temel Bilgiler'de tip alanı yok).

## Alanlar
Varsayılan scope'taki tüm alanlar, locator'lar ve validasyonlar ./product-create.md "Alanlar" bölümüyle **aynıdır**. Edit'e özgü farklar/ekler:

| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Store view çubuğu | Görünüm / Store View | – | Select | – | Varsayılan | combobox (küçük, çubuk içinde) | Seçilen dil için çeviri satırı yoksa oluşturulur |
| Temel Bilgiler (çeviri scope) | Ürün Adı / Product Name | `translations[i].name` | text | Hayır | – | placeholder = varsayılan dildeki değer (yoksa "Ürün adını girin") | |
| 〃 | URL Kısayolu / URL Slug | `translations[i].slug` | text | Hayır | ≤255; yalnız küçük harf, rakam ve tire (`^[a-z0-9]+(?:-[a-z0-9]+)*$`) | placeholder "urun-url-adresi" | Varsayılan scope'ta slug alanı yok |
| 〃 | Kısa Açıklama / Tam Açıklama | `translations[i].shortDescription`, `translations[i].description` | textarea | Hayır | – | | |
| SEO (çeviri scope) | Meta Başlık / Meta Açıklama | `translations[i].seo.metaTitle`, `translations[i].seo.metaDescription` | text / textarea | Hayır | **≤60 / ≤160** (varsayılan scope'taki 100/300'den sıkı) | | |
| Stok (simple) | Miktar / Quantity | `qty` | number | – | | | Miktar değiştirilecekse **Depo seçili olmalı**; aksi halde kayıt reddedilir (bkz. Tuzaklar) |
| Stok (configurable) | Depo / Warehouse | `warehouseId` | Select | Varyant stoğu değişecekse Evet | | | Varyantlı ana ürüne doğrudan stok yazılamaz (`PRODUCT_STOCK_NOT_EDITABLE_FOR_CONFIGURABLE`); stok varyantlarda |
| Varyantlar | Matris satırı + "Varyantları Yeniden Oluştur" | `variants[]` | | | | satır `data-variant-id="{id}"` | Stoklu varyantı silecek yeniden oluşturma/eksen-değer silme onay dialog'u açar: "Stoklu varyantlar etkilenecek" → "Evet, devam et / Yes, continue" / "Vazgeç / Cancel". Kayıtta silinen stoklu varyantların stok kayıtları arşivlenir. Satırda "Envanter" linki → `/inventory/stock/product/{id}` |
| Etiketler / Labels | "Etiket Ekle / Add Label" ("İlk Etiketi Ekle") → etiket dialog'u | metin, tür (Yeni/New, İndirim/Sale, Popüler/Hot, Sınırlı/Limited, Özel/Exclusive, Çok Satan/Best Seller, Özel Etiket/Custom), konum (Sol Üst/Sağ Üst/Sol Alt/Sağ Alt), arka plan rengi, yazı rengi, öncelik, başlangıç/bitiş tarihi, aktif | dialog formu | metin | | | Anında kaydolur; toast "Etiket başarıyla oluşturuldu" |
| Özel Seçenekler / Custom Options | "Seçenek Ekle / Add Option" → seçenek dialog'u | Seçenek Başlığı, Seçenek Tipi, Zorunlu, Aktif, fiyat + fiyat tipi (Sabit/Yüzde), sıra, max karakter, max dosya boyutu, görsel boyutu X/Y, değerler listesi (başlık, fiyat, SKU) | dialog formu | Başlık, tip | | | Anında kaydolur; toast "Seçenek başarıyla oluşturuldu" |
| Zamanlama / Scheduling | "Güncelleme Planla / Schedule Update" ("İlk Güncellemeyi Planla") → zamanlanmış güncelleme dialog'u | ad, açıklama, başlangıç zamanı, bitiş zamanı var mı, bitiş zamanı + değişecek alanlar | dialog formu | ad, başlangıç | | | Oluştur/düzenle/sil/iptal/hemen uygula/önizle; anında kaydolur; toast "Güncelleme başarıyla planlandı" |

## Aksiyonlar
| Buton (tr / en) | Ne yapar |
|---|---|
| **Ürünü Güncelle / Update Product** | Taslak-farkında kayıt (create ile aynı kurallar: Yayında ise tam validasyon; değilse yalnız ad/SKU + zorunlu attribute'lar). Önce varyant stoğu için depo kontrolü (eksikse hiçbir şey kaydedilmez, Stok sekmesine geçer). Sonra ürün → çeviriler → varyant değişiklikleri. |
| İptal / Cancel | Kaydedilmemiş değişiklik varsa "Kaydedilmemiş değişiklikler" dialog'u → "Ayrıl / Leave" → `/products` |
| Tekrar Dene (toast aksiyonu ve Varyantlar sekmesindeki buton) | Yalnızca varyant değişiklikleri geçici bir hatayla kaydedilemediyse; formu aynı sırayla yeniden gönderir |
| Etiket/Seçenek/Zamanlama dialog'larının kendi Kaydet butonları | **Ana formdan bağımsız, anında kalıcı** — ayrı onay gerektirir |

Sonuçlar:
- Tam başarı: toast "İşlem başarıyla tamamlandı" + "Ürün başarıyla güncellendi / Product updated successfully" → **`/products` listesine yönlenir**.
- Varyant değişiklikleri kaydedilemedi: ürün ve çeviriler **kaydedilmiş** olur; toast "Bir hata oluştu" + "Ürün güncellendi ancak varyant değişiklikleri kaydedilemedi. Varyantlar sekmesini gözden geçirip tekrar deneyin." (tekrar denenebilirse "Tekrar Dene" aksiyonu); Varyantlar sekmesinde kırmızı uyarı. Depo kaynaklı ise mesaj Stok sekmesinde. Sayfada kalır.
- Ürün kaydı hatası: create'teki hata eşlemeleri + `PRODUCT_RELATION_SELF_REFERENCE` → "Bir ürün kendisiyle ilişkilendirilemez. İlişkiler sekmesinden ürünün kendisini kaldırıp tekrar kaydedin."
- Belirsiz varyant sonucu: "Varyant değişikliklerinizin kaydedilip kaydedilmediğini doğrulayamadık…" → sayfayı yenileyip kontrol et.

## Yan etkiler
- Vitrin ve vitrin araması birkaç dakika içinde güncellenir; "Görünmez" yapılan veya arşivlenen ürün aramadan düşer.
- Basit üründe miktar değişirse seçili depodaki stok güncellenir.
- Varyant değişiklikleri: varyantlar oluşturulur/güncellenir/silinir; stoklu silinen varyantların stok kayıtları arşivlenir.
- Çeviriler store view başına ayrı kayıtlar olarak tutulur.

## Tuzaklar
1. **Kaydetme adım adımdır**: ürün kaydı başarılı olup ardından çeviri veya varyant adımı başarısız olabilir; ürün alanları yine de kaydedilmiştir. Aynı formu tekrar kaydetmek güvenlidir.
2. **Store view seçiliyken diğer sekmeler kilitli** (tıklanamaz). Fiyat/stok/kategori değiştirmek için çubuğu "Varsayılan"a al.
3. **Çeviri slug kuralı**: Türkçe karakter, büyük harf, boşluk → validasyon hatası ("URL must contain only lowercase letters, numbers, and hyphens").
4. **Çeviri SEO limitleri** 60/160 (varsayılan 100/300'den düşük).
5. **Basit üründe stok değiştirmek depo ister**: Depo boşken miktar değiştirilirse kayıt reddedilir ve **hiçbir alan kaydedilmez** (`WAREHOUSE_ID_REQUIRED`, mesaj Stok sekmesinde). Depoyu seçip yeniden kaydet ve detayda değerleri kontrol et.
6. **Kademe fiyatları**: dokunmadıysan gönderilmez (mevcut kurallar olduğu gibi kalır). Yeni/değişen satırda Min Miktar ≥2.
7. **Etiketler / Özel Seçenekler / Zamanlama sekmeleri ana "Ürünü Güncelle" butonuyla kaydedilmez**; her dialog'un kendi kaydı anında kalıcıdır → her biri için ayrıca kullanıcı onayı al.
8. Stok sekmesine doğrudan gitmek için `?tab=inventory` kullan.
9. Başarıdan sonra liste sayfasına gider (create gibi detaya değil); doğrulama için detayı ayrıca aç.
10. Ürün tipi değiştirilemez — yanlış tipte oluşturulduysa yeni ürün oluşturup eskisini arşivle (./product-detail.md).
11. **URL kısayolu değişince** vitrindeki ürün adresi değişir ve eski adres için **otomatik yönlendirme oluşmaz**. Eski adres paylaşıldıysa / arama motorunda varsa değişiklik özetine "eski adres için yönlendirme" adımını ekle ve ayrı onayla aç ([../seo/redirects.md](../seo/redirects.md), [../../../playbooks/redirect-create.md](../../../playbooks/redirect-create.md)).
12. Yükleme sırasında iskelet görünür; snapshot'ı alanlar dolduktan sonra al (Temel Bilgiler'de Ürün Adı input'u dolu olmalı).
13. create'teki tüm alan tuzakları (etiketler `fill`, nokta ondalık, kategori ağacı Expand, para birimi dialog'u, varyantları yeniden oluşturma) burada da geçerli: ./product-create.md "Tuzaklar".

## Doğrulama
1. Toast "Ürün başarıyla güncellendi" ve `/products` listesine yönlenme.
2. Listede SKU ile ara → satırdaki durum/fiyat/stok; satırı açıp ./product-detail.md'de değişen alanları karşılaştır (SEO listesinde store view çevirileri ayrı öğe olarak görünür).
3. Varyant değişikliği için detaydaki Varyantlar kartı veya `/products/{id}/edit?tab=variants`.
4. Stok için detaydaki "Ürün envanterini görüntüle".
