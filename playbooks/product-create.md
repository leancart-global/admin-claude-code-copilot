# Playbook: Ürün oluştur ("bu ürünü sisteme gir")

Tetikleyiciler: "ürün ekle/gir/oluştur", "yeni ürün", "şu tişörtü S-M-L ve 3 renkle ekle", "EAN'ı 869... olan ürünü gir", ürün bilgisi/ görsel/ link yapıştırılması.
Harita: ../domain/screens/products/product-create.md (alanlar, locator, tuzaklar), ../domain/entities/product.md (kurallar), ../domain/screens/products/product-edit.md (çeviri, etiket, sonradan düzeltme), ../domain/screens/products/product-detail.md (doğrulama).
URL'ler locale öneksizdir: `{ADMIN_URL}/products/new`.

---

## 0. Kural hatırlatması
- Kaydetmeden önce **özet tablo + açık "evet"**. Ürün kaydı ve ön koşul kayıtlarının (kategori, attribute set, depo…) **her biri ayrı onay**.
- Medya kütüphanesine dosya yüklemek de kalıcıdır (ürün kaydedilmese bile) → yüklemeden önce kullanıcı onayı al ya da yüklemeyi özete dahil et.
- Bilmediğin zorunlu bilgiyi uydurma; varsayılan kullandıysan özette "varsayılan" yaz.

## 1. İsteği çözümle → taslak alan listesi
Kullanıcının metninden çıkar ve aşağıdaki şablona yerleştir (boşları işaretle):

| Bilgi | Form alanı | Zorunlu mu? | Varsayılan (sorulmazsa) |
|---|---|---|---|
| Ürün tipi | tip seçimi | Evet | Varyant (beden/renk…) varsa `configurable`, birden çok ürün paketi ise `bundle`, dijital dosya `downloadable`, hizmet/kargosuz `virtual`, abonelik `subscription`, hediye kartı `gift_card`; aksi `simple` |
| Ürün adı | `name` | Evet (3–200) | — |
| SKU | `sku` | Evet (2–50, benzersiz) | Kullanıcı vermezse **öner** (ör. marka-model kısaltması, büyük harf, tire) ve onaylat |
| Satış fiyatı | `basePrice` | Evet | — (sor) |
| Para birimi | `currency` | Yayın için | Tenant varsayılanı (formda otomatik gelir) |
| Durum | `status` | — | **Taslak (`draft`)**; kullanıcı "yayınla/satışa aç" dediyse `published` |
| Kategori(ler) | `categoryIds` | Yayın için ≥1 | — (sor; mevcut ağaçtan öner) |
| Attribute set | `attributeSetId` | Yayın için | Varsayılan set "(Varsayılan)" — onaylat |
| Set'in zorunlu attribute'ları | `customAttributes.*` | Taslakta bile | — (set seçilince öğren, sor) |
| Açıklama | `description` | Hayır (doluysa ≥10 kr) | Kullanıcı metni; yoksa boş |
| Kısa açıklama | `shortDescription` | Hayır (≤500) | — |
| Stok miktarı | `qty` / varyant qty | Hayır | 0 |
| Depo | `warehouseId` | Stok > 0 ise (varyantlıda zorunlu) | Tek depo varsa otomatik |
| Karşılaştırma (eski) fiyat | `compareAtPrice` | Hayır (> fiyat) | — |
| İndirimli fiyat + tarih | `specialPrice`, `specialPriceStart/End` | Hayır (< fiyat) | — |
| Maliyet | `cost` | Hayır (≤ 2×fiyat) | — |
| Vergi sınıfı | `taxClass` | Hayır | Tenant varsayılan vergi sınıfı |
| Ağırlık / ölçüler | `weight`, `length/width/height` | Hayır (kargo hesabı için önerilir) | Boş → platform varsayılan paketi uyarısı |
| Barkod / EAN / menşei | `barcode` (8/12/13/14), `ean` (13), `countryOfManufacture` (ISO-2) | Hayır | — |
| Görseller | `media` | Hayır | — (dosya yolu veya kütüphanedeki ad iste) |
| SEO başlık/açıklama | `seo.metaTitle` (≤100) / `seo.metaDescription` (≤300) | Hayır | Boş (ad kullanılır) |
| Etiketler (tags) | `tags` | Hayır | — |
| Varyant eksenleri ve değerleri | `configurableAttributes` | configurable'da ≥1 | — (ör. Beden: S,M,L; Renk: Kırmızı,Siyah) |
| Varyant bazında fiyat/stok | `variants[].price/qty` | Hayır | fiyat = ana fiyat, stok 0 |
| Marka | — | — | Formda alan henüz yok → bkz. 2.e |

Tip özel zorunlular: bundle ≥2 ürün; grouped ≥2 ürün; subscription: aralık + dönem (≥1) + iptal koşulları; downloadable ≥1 dosya; gift_card: önceden tanımlı tutarlar ve/veya özel tutar aralığı, geçerlilik süresi.

## 2. Bağımlılıkları çöz (salt okuma, kaydetmeden)
Sıra (dependency): Store view / Para birimi → Kategori → Attribute → Attribute set → (Depo) → (Vergi sınıfı) → (Müşteri grubu) → (Medya) → (İlişkili ürünler) → **Ürün**.

a. `{ADMIN_URL}/products/new` aç. **"Ürün Eklemeden Önce Kurulumu Tamamlayın"** kartı görünüyorsa eksikleri oku (Mağaza Görünümleri / Kategoriler / Özellik Setleri / Aktif Para Birimleri). Bunlar tamamlanmadan form açılmaz → ilgili playbook/ekran: `/settings/store-views`, `/categories/new`, `/attributes/sets/new`, `/settings/currencies`. Kullanıcıya bildir, plana ekle.
b. **Kategori**: formdaki "Kategori Seç" ağacında ara (input "Kategori ara..."); alt kategoriler için ebeveynde "Expand". İstenen kategori yoksa → ../domain/screens/categories/category-create.md (ayrı onay), sonra bu sayfayı yenile (form verisi kaybolur — kategoriyi **forma başlamadan önce** çöz).
c. **Attribute set**: Özel Nitelikler sekmesinde set listesini oku. Uygun set yoksa (ör. "Giyim") → ../domain/screens/attributes/attribute-set-create.md (+ gerekirse attribute-create). Set seçince zorunlu (`*`) attribute'ları ve select seçeneklerini oku; değer kullanıcının metninde yoksa sor; seçenek listede yoksa attribute'a seçenek eklemek gerekir (attribute ekranı, ayrı onay).
d. **Depo** (stok > 0 ise): Stok sekmesinde Depo listesini oku; hiç depo yoksa banner çıkar → önce [warehouse-setup](warehouse-setup.md) (ayrı onayla). Birden çok depo varsa hangisi olduğunu sor.
e. **Marka**: Ürün formunda marka alanı henüz yok (geliştiriliyor). Kullanıcıya bunu söyle ve markayı raporda "atanmadı" olarak belirt; geçici yol önerme.
f. **Vergi sınıfı**: Fiyatlandırma sekmesindeki listede "{ad} ({oran}%)" seçeneklerini oku; kullanıcı belirli oran söylediyse eşleştir; yoksa varsayılanı bırak (özete "tenant varsayılanı" yaz). Yeni sınıf gerekiyorsa `/settings/tax-classes`.
g. **SKU benzersizliği**: `{ADMIN_URL}/products` listesinde SKU ile ara (../domain/screens/products/product-list.md). Varsa kullanıcıya sor (güncelleme mi, yeni SKU mu?).
h. **İlişkili/paket/grup ürünler**: listede ara, var olduklarını doğrula.
i. **Görseller**: kullanıcıdan yerel dosya yolu iste (veya medya kütüphanesinde mevcut dosyanın adı).

## 3. Planı ve eksik bilgileri tek mesajda sor
Örnek:
> Plan: (1) "Erkek Tişört" kategorisi yok → oluşturulacak [onay gerekecek]. (2) Ürün: Varyantlı, Taslak.
> Eksik: SKU önerim `TSHRT-BSC` — uygun mu? Stok hangi depoya (Merkez / İzmir)? Kumaş (zorunlu nitelik) değeri?

## 4. Formu doldur (sekme sekme)
Her adımdan sonra `browser_snapshot` ile değerleri doğrula.

1. **Tip**: `/products/new` → tip kartına tıkla (ör. "Varyantlı / Configurable") veya `#product-type` Select. Sayfayı bundan sonra **yenileme** ve "Tipi Değiştir"e basma (veri silinir).
2. **Temel Bilgiler**: Ürün Adı → SKU → Kısa Açıklama → Tam Açıklama (≥10 kr veya boş) → Durum (Select) → Görünürlük → işaretler (Öne Çıkan/Yeni/Çok Satan, Mağaza Davranışları) → Kategoriler (ağaçta "Select {ad}" checkbox) → Etiketler (`fill` ile tek seferde "a, b, c").
3. **Fiyatlandırma**: önce **Para Birimi** (gerekirse; fiyat girildikten sonra değiştirmek dönüşüm dialog'u açar) → Temel Fiyat (nokta ondalık: `1299.90`) → Karşılaştırma Fiyatı → Birim Maliyet → Özel Fiyat + tarihler (takvimden) → Vergi Sınıfı → Kademe ("Kademe Ekle"; Min Miktar ≥2).
4. **Stok** (varsa): Depo (Select) → Miktar → Düşük Stok Eşiği → Stok Takibi / Ön Sipariş → Ağırlık + birim → Uzunluk/Genişlik/Yükseklik + birim → Kargo Gerekli / Ücretsiz Kargo. Configurable'da yalnız Depo + politika alanları.
5. **Özel Nitelikler**: Nitelik Seti seç → "Nitelikler yükleniyor..." bitmesini bekle → zorunlu (`*`) ve kullanıcının verdiği attribute'ları doldur (select placeholder "Select {label}").
6. **Varyantlar** (configurable): "İlk Özniteliği Ekle" → Öznitelik Kodu (ör. `size`; attribute set'te aynı kodlu attribute varsa aynısını kullan) → Etiket ("Beden") → Görüntüleme Türü → "Değer Ekle" ile her değer için Etiket ("Kırmızı") + Değer (`kirmizi`, küçük harf ASCII önerilir) → gerekirse "Başka Öznitelik Ekle" → **"Varyantları Yeniden Oluştur"** (onay hook'u sorabilir; kalıcı değildir, form içi). Matristen her satırın SKU (`{SKU}-{DEĞER}`), fiyat, miktar alanlarını kullanıcının verdiği değerlere göre düzelt.
7. **Paket / Gruplu / Abonelik / İndirilebilir / Hediye kartı** sekmeleri: ../domain/screens/products/product-create.md ilgili bölüm.
8. **Medya**: "Kütüphaneden Seç" → (yeni dosya) "Yükle / Upload" sekmesi → dropzone'a tıkla → `browser_file_upload` (kullanıcının yolları) → yükleme bitince otomatik seçilir → kütüphanedeki mevcut dosyalar için "Göz At"ta ara ve tıkla → **"Seç / Select"**. Ana görseli ayarla ("Ana görsel olarak ayarla"), alt metin gir ("Alt metin ve başlığı düzenle" → `#media-alt`). En çok 20 medya.
9. **Kimlik**: Barkod / EAN / Üretim Ülkesi (Select, ISO-2; ör. Türkiye).
10. **SEO** (istenirse): Meta Başlık (≤100), Meta Açıklama (≤300), Anahtar Kelimeler (virgüllü), Canonical, OG/Twitter, İndeksleme.
11. **İlişkiler** (istenirse): her ürün için "Ürün Ekle" → ara (≥2 harf, 400 ms bekle) → sonuç satırına tıkla.
12. Hata kontrolü: sekme tetikleyicilerinde kırmızı sayı rozeti var mı? (Rozetler yalnız bir kayıt denemesinden sonra görünür; o yüzden alan altı hata metinlerini snapshot'ta kontrol et.)

## 5. Özet → ONAY BEKLE → Kaydet
Özet tablosu (ortam başlığıyla):

| Alan | Değer | Kaynak |
|---|---|---|
| Tip / Durum / Görünürlük | Varyantlı / Taslak / Her Yerde Görünür | kullanıcı / varsayılan |
| Ad / SKU | … | |
| Fiyat / Para birimi / KDV sınıfı | 499.90 TRY / KDV %20 | |
| Kategoriler | Giyim › Erkek › Tişört | |
| Attribute set + değerler | Giyim; Kumaş=Pamuk | |
| Varyantlar | 6 adet (S/M/L × Kırmızı/Siyah), stok toplam 60, depo Merkez | |
| Medya | 3 görsel (ana: front.jpg) | |
| Yan etkiler | Stok seçili depoya yazılır; yayındaysa vitrin aramasına birkaç dakika içinde eklenir; varyant stok satırları oluşur | |
| Kalan işler | Marka atanmadı (alan geliştiriliyor) | |

"Onaylıyor musunuz?" → açık evet gelince footer'daki **"Ürün Oluştur / Create Product"** (submit) butonuna tıkla. Enter kullanma (form Enter ile gönderilmez zaten).

## 6. Sonucu doğrula
1. Toast: "Ürün başarıyla oluşturuldu" (tam) / "Ürün taslak olarak kaydedildi, ancak bazı zorunlu alanlar eksik." (eksik taslak — eksikleri kullanıcıya bildir) / "Ürün oluşturuldu ancak varyantları kaydedilemedi…" (→ edit sayfasında Varyantlar sekmesinden yeniden dene, ayrı onay).
2. Hata toast'ı ve sayfada kalma → mesajı oku: kategori/plan/depo/kademe/vergi sınıfı eşlemesi ../domain/screens/products/product-create.md "Aksiyonlar". Fiyatlandırma sekmesinde kırmızı uyarı kutusu olabilir. Düzelt → özet değiştiyse **yeniden onay**.
3. Başarıda URL `{ADMIN_URL}/products/{id}` (detay). Kontrol: ad, SKU, durum/tip rozeti, fiyat kartı, kategoriler, özel nitelikler, varyant sayısı, "Satılabilir Toplam" stok, görseller.
4. Rapor: ürün linki, oluşturulan ön koşul kayıtları, yapılamayanlar (ör. marka, çeviri).
5. Çeviri (store view) istenmişse → ../domain/screens/products/product-edit.md (Görünüm seçici; ayrı onay).

## 7. Kısıtlar ve dikkat edilecekler
- `published` durumla tek seferde kaydetmek tüm zorunlu alanları ister; kullanıcı açıkça yayın istemediyse **Taslak** kaydet, sonra yayın için ayrı onay al (edit ekranında Durum → Yayında).
- EAN/barkod ile başlamak için `/products/new-by-code` (../domain/screens/products/product-new-by-code.md) kullanılabilir; harici veriden gelen ad/açıklama gibi değerleri kullanıcının talebiyle karşılaştır. Basit dışı tiplerde EAN/barkodu `/products/new` Kimlik sekmesine elle gir.
- Onay hook'u "Kaldır/Oluştur/Remove" içeren form-içi tıklamalarda (ör. "Kademeyi kaldır", "Varyantları Yeniden Oluştur", ön koşul kartındaki "Oluştur") onay sorabilir; bunlar kalıcı değilse kullanıcıya kısaca açıkla.
