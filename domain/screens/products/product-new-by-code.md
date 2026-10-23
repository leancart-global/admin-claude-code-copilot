# EAN / Barkod ile Ürün Ekle
- URL: {ADMIN_URL}/products/new-by-code?mode={ean|barcode}&code={kod}  — locale öneki yok
  - `mode` yoksa veya `barcode` değilse **ean** kabul edilir. `code` verilirse input önceden doldurulur ve ön koşullar hazır olunca **otomatik arama** yapılır.
- Amaç: EAN (13 hane) veya serbest barkod ile önce katalogda/harici ürün veri kaynağında arama yapıp, bulunamazsa (veya harici veri varsa) kodu önceden doldurulmuş bir **Basit (simple)** ürün formu açmak. 3 adımlı akış: giriş → önizleme → form.
- Yetki (permission): Arama `products:read`; kaydetme `products:write`.
- Ekranın kullandığı veriler:
  - Ön koşul kontrolü: aktif store view'lar, kategori ağacı, attribute set'ler, aktif para birimleri — her biri ≥1 kayıt olmalı.
  - Kod araması (sırayla):
    1. İç katalog: aynı mağazada EAN / UPC / ISBN / barkodu bu kod olan ürün.
    2. Yoksa harici ürün veri kaynağı (yanıt birkaç saniye sürebilir; yanıt gelmezse "veri yok" sayılır).
    3. Hiçbiri yoksa "veri bulunamadı".
    Harici öneride gelebilecek bilgiler: kod, kod tipi, ad, marka, açıklama, kategori, görsel(ler), ağırlık + birim, boyutlar, menşe ülke, üretici, içerik, nitelikler.
  - Kaydet: `/products/new` ile aynı ürün kaydı; ayrıntı `./product-create.md`.

## Ön koşullar ve bağımlılıklar
- Ürün formu yalnızca tüm ön koşullar hazırken gösterilir. Eksikse ön koşul kartı çıkar, başlık "Ürün Eklemeden Önce Kurulumu Tamamlayın / Complete Setup Before Adding Products", her eksik için "Oluştur / Create" butonu:
  | Eksik (tr / en) | Oluşturan ekran |
  |---|---|
  | Mağaza Görünümleri / Store Views | `/settings/store-views` (../settings/store-views.md — doğrulanmadı) |
  | Kategoriler / Categories | `/categories/new` (../categories/category-create.md) |
  | Özellik Setleri / Attribute Sets | `/attributes/sets/new` (../attributes/attribute-set-create.md) |
  | Aktif Para Birimleri / Active Currencies | `/settings/currencies` (../settings/currencies.md — doğrulanmadı) |
  Ön koşullar okunamazsa "Kurulum kontrol edilemedi / Could not check setup" + "Tekrar Dene / Retry".
- Stok miktarı girilecekse bir depo tanımlı olmalı; aksi halde kayıt hatası "Stok eklemeden önce bir depo tanımlamanız gerekir…".
- Formun kendi bağımlılıkları (kategori, attribute set, vergi sınıfı vb.) için `./product-create.md`.

## Yerleşim
Giriş noktası: Ürün listesi (`/products`) → "Ürün Ekle / Add Product" açılır menüsü → "EAN ile Ürün Ekle / Add Product by EAN" veya "Barkod ile Ürün Ekle / Add Product by Barcode" → kod arama dialog'u → "Ara / Look Up" → `/products/new-by-code?mode=…&code=…`. Doğrudan URL ile de gelinebilir.

1. **Yükleniyor**: ön koşullar kontrol edilirken iskelet.
2. **Ön koşul uyarısı** (eksik varsa).
3. **Adım 1 – giriş**: Sayfa başlığı "EAN ile Ürün Ekle / Add Product by EAN" veya "Barkod ile Ürün Ekle / Add Product by Barcode" (geri linki `/products`); kart içinde kod input'u ve "Ara / Look Up" butonu.
4. **Adım 2 – önizleme**, üç olası kart:
   - **İç katalogda bulundu**: uyarı kutusu "Ürün katalogunuzda bulundu / Product found in your catalog" + ad; butonlar "Mevcut Ürünü Görüntüle / View Existing Product", "Başka Bir Tane Oluştur / Create Another".
   - **Harici veri bulundu**: başlık "Ürün verisi bulundu / Product data found"; görsel, ad, "Marka / Brand: …", "Kategori / Category: …", "Ağırlık / Weight: …"; butonlar "Bu Veriyi Kullan / Use This Data", "Boş Ürün Oluştur / Create Blank Product".
   - **Veri yok**: uyarı kutusu "Bu kod için ürün verisi bulunamadı / No product data found for this code", "Kodu önceden doldurulmus olarak manuel bir ürün oluşturabilirsiniz. / You can still create a product manually with the code pre-filled."; butonlar "Boş Ürün Oluştur / Create Blank Product", "Geri / Back".
5. **Adım 3 – form**: Sayfa başlığı + sağda "Geri / Back" (ghost) butonu; altında Basit tipte ürün formu, önceden doldurulmuş değerlerle. Sekmeler ve alanlar `./product-create.md` ile aynıdır (simple tipi).

## Alanlar
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Liste dialog'u | Avrupa Ürün Numarası (EAN) / European Article Number (EAN) — veya Barkod / Barcode | – | text | evet | EAN: yalnızca rakam, tam 13 hane (rakam dışı karakterler silinir, 13'te kesilir); barkod: boş olmayan, maks 50 karakter | `#code-lookup-input` / `getByLabel(...)`; placeholder "orn., 4006381333931 / e.g., 4006381333931" veya "Ürün barkodunu girin / Enter product barcode" | EAN modunda sağda "n/13" sayacı |
| Adım 1 | aynı label | – | text | evet | aynı kurallar | `#code-input` | `?code=` ile ön dolu; Enter = Ara |
| Adım 3 (form) | EAN | `ean` | text | hayır | tam 13 hane rakam | bkz. product-create.md (Kimlik sekmesi) | **EAN modunda koddan otomatik dolar** |
| Adım 3 (form) | Barkod / Barcode | `barcode` | text | hayır | 8/12/13/14 hane rakam | bkz. product-create.md | **Barkod modunda koddan otomatik dolar** |
| Adım 3 (form) | Ürün adı | `name` | text | evet | | | "Bu Veriyi Kullan" ile harici addan dolar (doğrulanmadı) |
| Adım 3 (form) | Kısa Açıklama | `shortDescription` | textarea | hayır | maks 500 | | harici açıklamadan dolar (doğrulanmadı) |
| Adım 3 (form) | Ağırlık | `weight` | number | hayır | ≥0 | | harici ağırlıktan dolar (doğrulanmadı) |
| Adım 3 (form) | Üretim ülkesi | `countryOfManufacture` | Select | hayır | 2 harf ISO ülke kodu | | harici menşe ülkesinden dolar (doğrulanmadı) |

Diğer tüm form alanları (SKU, fiyat, para birimi, vergi sınıfı, kategori, attribute set, stok, SEO…) için `./product-create.md`. Harici verideki **marka, kategori, görsel** forma aktarılmaz — yalnızca önizlemede gösterilir.

## Aksiyonlar
| Buton (tr / en) | Nerede | Davranış |
|---|---|---|
| Ara / Look Up (yüklenirken "Aranıyor... / Searching...") | dialog & adım 1 | Geçersiz kodda pasif. Dialog: sayfaya yönlendirir. Sayfa: arama → önizleme. Arama hatası → "veri yok" kartı |
| Mevcut Ürünü Görüntüle / View Existing Product | önizleme-iç katalog | `/products/{id}` (mevcut ürünün detayı) |
| Başka Bir Tane Oluştur / Create Another | önizleme-iç katalog | giriş adımına döner |
| Bu Veriyi Kullan / Use This Data | önizleme-harici | form adımı, harici veriyle önceden doldurulmuş |
| Boş Ürün Oluştur / Create Blank Product | önizleme-harici/veri yok | form adımı; yalnızca kod alanı dolu |
| Geri / Back | önizleme-veri yok, form | giriş adımı (form verisi kaybolur, onay yok) |
| Kaydet / İptal (ürün formu butonları) | form | Etiketler ve onay dialog'ları için `./product-create.md`. İptal → `/products` |

Kayıt sonucu:
- Başarı: toast "İşlem başarıyla tamamlandı / Operation completed successfully" + "Ürün başarıyla oluşturuldu / Product created successfully" → `/products/{newId}` (detay, `./product-detail.md`).
- Hata: toast "Bir hata oluştu / An error occurred" + depo tanımsızsa "Stok eklemeden önce bir depo tanımlamanız gerekir. Bir depo oluşturup tekrar deneyin."; stok servisi geçici olarak yanıt vermezse "Stok servisi geçici olarak kullanılamıyor. Lütfen birazdan tekrar deneyin."; aksi halde sunucunun hata mesajı.

## Yan etkiler
- Kod araması salt okumadır.
- Kayıt: `/products/new` ile aynı sonuçlar — miktar girilmişse depoya stok yazılır (stok yazılamazsa ürün oluşturulmaz), yayındaysa vitrin aramasına eklenir; ayrıntı `./product-create.md`.

## Tuzaklar
- Formdaki Barkod alanı yalnızca 8/12/13/14 haneli rakam kabul eder; arama kutusuna girilen barkod bu biçimde değilse kayıttan önce Barkod alanını düzelt veya temizle.
- Harici menşe ülkesi tam ülke adı olarak gelirse ("Turkey") 2 harfli ülke koduna çevrilmelidir.
- Ürün tipi **her zaman Basit (simple)**; tip seçici yok. Varyantlı/paket vb. için `/products/new` kullan (EAN/barkod Kimlik sekmesine elle girilir).
- `?code=` ile otomatik arama yalnızca kod geçerliyse ve ön koşullar hazırsa bir kez tetiklenir.
- Form adımında "Geri" formu onay sormadan atar.
- Ad, açıklama gibi alanları her zaman kullanıcının talebiyle karşılaştır; harici veri yanlış veya eksik olabilir.

## Doğrulama
- Başarılı kayıtta URL `{ADMIN_URL}/products/{24-hex-id}` olur ve toast "Ürün başarıyla oluşturuldu" görünür.
- Detay sayfasında (`./product-detail.md`) "Ürün Detayları" kartında EAN veya Barkod değeri, başlıkta tip "Basit / Simple", SKU ve ad kontrol edilir.
- İç katalog eşleşmesini doğrulamak için `/products` listesinde kodla arama yapılabilir (`./product-list.md`).
