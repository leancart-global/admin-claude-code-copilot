# Playbook: Ürün ailesi için attribute + attribute set kurulumu

Örnek istekler: "cep telefonu için attribute ve attribute set ayarla", "ayakkabılar için beden/renk özellikleri kur",
"laptop seti oluştur".

Haritalar: [attribute-list](../domain/screens/attributes/attribute-list.md) · [attribute-create](../domain/screens/attributes/attribute-create.md) ·
[attribute-edit](../domain/screens/attributes/attribute-edit.md) · [attribute-set-list](../domain/screens/attributes/attribute-set-list.md) ·
[attribute-set-create](../domain/screens/attributes/attribute-set-create.md) · [attribute-set-edit](../domain/screens/attributes/attribute-set-edit.md) ·
entity'ler [attribute](../domain/entities/attribute.md), [attribute-set](../domain/entities/attribute-set.md), [product](../domain/entities/product.md).

## Bilmen gereken kurallar (kısaca)
- Bağımlılık sırası: **attribute → set → (ops.) setin kategorilere atanması → ürün**. Ürün formu set seçmeden attribute göstermez; set'e eklenmemiş attribute ürün formunda görünmez.
- Attribute `code` sonradan değiştirilemez; tip, attribute bir sete girdikten sonra değiştirilemez. Kodları baştan doğru (ASCII, `snake_case`) seç.
- "Varyant için kullan" bayrağı yok. Varyant eksenleri (renk, hafıza) ürün ekranında serbest kodla tanımlanır; **aynı kodu** kullanırsan bağ kurulur (ürün seviyesinde zorunluluktan düşer, silme koruması çalışır).
- `isRequired` (Zorunlu) ürünün **taslak kaydını bile** engeller → yalnız gerçekten her üründe olması gereken alanlarda aç; varyant eksenlerinde açma.
- Set'te bölüm kullanıyorsan **her** attribute bir bölüme atanmalı.
- Attribute'ları sete planlanan sırayla ekle; sırayı kayıttan sonra edit ekranında doğrula. Bölüm sırası = ekleme sırası (edit'te sayı ile değiştirilebilir).
- Set ekranındaki "Yeni Oluştur" diyaloğu seçeneksiz, kodu düzenlenemeyen minimal attribute yaratır → **kullanma**; attribute'ları tam formdan oluştur.
- Preset "Elektronik Ürün Seti" İngilizce etiketli attribute'lar (Brand, Model, RAM, Storage…) üretir ve onay sormadan hepsini + seti yaratır → Türkçe mağazada kullanıcı açıkça istemedikçe **kullanma**.

## Adım 1 — Öneri listesi hazırla (tarayıcı yok)
Ürün ailesine göre attribute listesi öner. Cep telefonu için varsayılan öneri:

| Bölüm (section kodu) | Etiket | Kod | Tip | Seçenekler (öneri) | Zorunlu | Arama | Filtre | PDP'de görünür | Karşılaştır | Not |
|---|---|---|---|---|---|---|---|---|---|---|
| Genel (`genel`) | Model | `model` | text | – | hayır | evet | hayır | evet | evet | |
| Genel | İşletim Sistemi | `isletim_sistemi` | select | Android, iOS | hayır | evet | evet | evet | evet | |
| Varyant (`varyant`) | Renk | `renk` | color | Siyah #000000, Beyaz #ffffff, Mavi #1e3a8a, Kırmızı #dc2626, Yeşil #16a34a, Mor #7c3aed | **hayır** | evet | evet | evet | hayır | varyant ekseni; ürün ekranında kod `renk` |
| Varyant | Dahili Hafıza | `dahili_hafiza` | select | 64 GB, 128 GB, 256 GB, 512 GB, 1 TB | **hayır** | evet | evet | evet | evet | varyant ekseni |
| Ekran (`ekran`) | Ekran Boyutu | `ekran_boyutu` | select | 6.1", 6.4", 6.7", 6.8" | hayır | hayır | evet | evet | evet | |
| Ekran | Ekran Teknolojisi | `ekran_teknolojisi` | select | OLED, AMOLED, LCD | hayır | hayır | evet | evet | evet | |
| Ekran | Yenileme Hızı | `yenileme_hizi` | select | 60 Hz, 90 Hz, 120 Hz | hayır | hayır | evet | evet | evet | |
| Performans (`performans`) | RAM | `ram` | select | 4 GB, 6 GB, 8 GB, 12 GB, 16 GB | hayır | evet | evet | evet | evet | |
| Performans | İşlemci | `islemci` | text | – | hayır | evet | hayır | evet | evet | |
| Kamera (`kamera`) | Arka Kamera Çözünürlüğü | `arka_kamera` | text | – | hayır | hayır | hayır | evet | evet | ör. "50 MP + 12 MP" |
| Kamera | Ön Kamera Çözünürlüğü | `on_kamera` | text | – | hayır | hayır | hayır | evet | evet | |
| Batarya (`batarya`) | Batarya Kapasitesi (mAh) | `batarya_kapasitesi` | number | – | hayır | hayır | hayır | evet | evet | |
| Batarya | Hızlı Şarj | `hizli_sarj` | boolean | – | hayır | hayır | evet | evet | evet | |
| Bağlantı (`baglanti`) | Mobil Ağ | `mobil_ag` | select | 4G, 5G | hayır | hayır | evet | evet | evet | |
| Bağlantı | Çift SIM | `cift_sim` | boolean | – | hayır | hayır | evet | evet | hayır | |
| Bağlantı | NFC | `nfc` | boolean | – | hayır | hayır | evet | evet | hayır | |
| Genel | Garanti Süresi | `garanti_suresi` | select | 1 Yıl, 2 Yıl | hayır | hayır | hayır | evet | hayır | |

Notlar:
- **Marka** attribute olarak açılmaz → Brand entity ([category-brand-setup](category-brand-setup.md)). Ürün formunda marka alanı henüz yok (geliştiriliyor) — kullanıcıya belirt.
- Tüm attribute'larda Kapsam/Apply To boş (tüm ürün tipleri) bırakılır; varyant eksenleri için `configurable` kapsanmış olur.
- Bayrak eşlemesi (form label → key): Aramada Kullan=`isSearchable`, Katmanlı Navigasyonda Kullan=`isFilterable` (vitrin filtresi, global), Katalog Sayfalarında Görünür=`isVisibleOnFront` (varsayılan açık), Mağazada Karşılaştırılabilir=`isComparable`, Zorunlu=`isRequired`.
- Kullanıcıdan öneri listesine ekleme/çıkarma, Türkçe/İngilizce etiket tercihi ve set adı/kodu (öneri: "Cep Telefonu" / `cep_telefonu`) için tek seferde onay/düzeltme iste.

## Adım 2 — Mevcutları kontrol et (salt okunur)
1. `{ADMIN_URL}/attributes` aç ([attribute-list](../domain/screens/attributes/attribute-list.md)). Her öneri için arama kutusuna önce **kod**, sonra Türkçe etiket, sonra İngilizce eşdeğer yaz (ör. `renk` / "Renk" / `color`; `dahili_hafiza` / "Hafıza" / `storage`).
2. Eşleşme varsa satırın Tip'ini not et; gerekirse edit ekranında seçeneklerine bak (salt okunur).
   - Aynı anlam + uyumlu tip → **yeniden kullan** (eksik seçenek varsa "güncelle" planına yaz).
   - Farklı tip → yeni kodla oluştur (ör. `renk_secenek`) ya da kullanıcıya sor.
3. Aramada bulunmasa bile create sırasında `ERR_ATTRIBUTE_CODE_EXISTS` gelirse "zaten var" kabul et ve reuse'a çevir.
4. `{ADMIN_URL}/attributes/sets` → set adı/kodu ara. Varsa yeni set yerine **edit** planı yap.

## Adım 3 — Planı göster ve ONAY BEKLE
Özet tablo (CLAUDE.md formatı, ortam adıyla):
- Oluşturulacak attribute'lar: etiket, kod, tip, seçenekler, bayraklar.
- Güncellenecek attribute'lar (eklenecek seçenekler).
- Yeniden kullanılacaklar.
- Set: ad, kod, bölümler (sıra), her bölümdeki attribute'lar (sıra), Aktif, Varsayılan (hayır), kategori ataması (varsa, ayrı adım).
- Yan etkiler: kod/tip sonradan değişmez; zorunlu alanlar taslak ürün kaydını etkiler.
Kullanıcı "onaylıyorum" demeden hiçbir Kaydet'e basma. Her attribute kaydı ayrı bir kalıcı işlemdir: kullanıcı toplu onay vermediyse her birinden önce kısa özet göster.

## Adım 4 — Attribute'ları oluştur (her biri için)
[attribute-create](../domain/screens/attributes/attribute-create.md):
1. `{ADMIN_URL}/attributes/new`, `browser_snapshot`.
2. Temel Bilgi: **Etiket** yaz → **Öznitelik Kodu**'nu kontrol et (gerekirse temizleyip planlanan kodu yaz) → **Öznitelik Tipi** combobox → seçenek (Açılır Liste / Renk / Sayı / Evet/Hayır / Metin). Giriş Tipi'ne dokunma. Zorunlu switch'i plana göre.
3. Seçenekler (select/multiselect/color): "Toplu Ekle" → textarea'ya her satıra bir etiket → paneldeki "Seçenek Ekle / Add Options". Color tipinde her satırın `input[type=color]`'ına hex gir. Gerekirse store view sütunlarına çeviri yaz. İlk satır "Varsayılan" işaretli gelir; varsayılan istemiyorsan kaldır. Boş satır kalmadığını snapshot'la doğrula.
4. Mağaza Özellikleri: Aramada Kullan / Katmanlı Navigasyonda Kullan / Mağazada Karşılaştırılabilir switch'leri plana göre; Katalog Sayfalarında Görünür açık kalsın.
5. Kapsam: dokunma (Global, Apply To boş).
6. Özet göster → onay → **Kaydet** → toast "Öznitelik başarıyla oluşturuldu" ve `/attributes`. Yönlenme yoksa sekmeleri tek tek snapshot'la, alan altındaki hata mesajını bul.
7. Kod çakışma toast'ı → mevcut kaydı reuse et, plana not düş.
Güncellenecek mevcut attribute'lar için [attribute-edit](../domain/screens/attributes/attribute-edit.md) (yalnız seçenek ekle; mevcut seçenekleri silme).

## Adım 5 — Seti oluştur
[attribute-set-create](../domain/screens/attributes/attribute-set-create.md):
1. `{ADMIN_URL}/attributes/sets/new` → **"Sıfırdan Başla"**.
2. Temel Bilgiler: Set Adı ("Cep Telefonu"); **Set Kodu'nu elle** `cep_telefonu` yaz (kod sonradan değişmez). Aktif açık, Varsayılan Set kapalı (kullanıcı istemedikçe).
3. Öznitelikler sekmesi → **"Bölüm Ekle"** → dialog: Bölüm Adı ("Varyant") ve **Bölüm Kodu'nu elle** (`varyant`) yaz → dialogdaki "Bölüm Ekle". Plan sırasıyla tüm bölümler.
4. **"Öznitelik Ekle"** → "Öznitelik *" combobox → `(kod)` içeren seçenek → "Bölüm (İsteğe Bağlı)" → ilgili bölüm → dialogdaki "Öznitelik Ekle". Plan sırasıyla (sıra = ekleme sırası).
5. Yanlış bölüme eklenen attribute'u satırdaki bölüm select'iyle doğru bölüme taşı; yanlış eklenen attribute'u ✕ ile kaldır.
6. "Bölüm Yok" akordeonunun olmadığını/boş olduğunu snapshot'la doğrula.
7. Özet → onay → **Kaydet** → toast "Öznitelik seti başarıyla oluşturuldu", `/attributes/sets`.
Set zaten varsa [attribute-set-edit](../domain/screens/attributes/attribute-set-edit.md): Bölümler kartında "Bölüm Ekle" (yalnız ad; kod görünmez ve addan türetilir → harfle başlayan sade bir ad seç), "Öznitelik Ekle" ile ekle, Kaydet.

## Adım 6 — (Opsiyonel) Kategori ataması
Kullanıcı isterse: set edit → "Kategoriler" sekmesi → ilgili kategori(ler)in checkbox'ı → Kaydet. Kategori yoksa önce [category-brand-setup](category-brand-setup.md).

## Adım 7 — Doğrulama ve rapor
- `/attributes` aramasında her kod: tip, Arama/Filtre sütunları.
- Set edit ekranı: "Öznitelikler ({n})", her bölümün içeriği.
- (Ops.) `/products/new` → Nitelik Seti'ni seç → bölüm kartları geliyor mu (kaydetmeden çık; [product-create](../domain/screens/products/product-create.md)).
- Rapor: oluşturulan/yeniden kullanılan attribute kodları, set kodu ve URL'si, varyant eksenleri için ürün ekranında kullanılacak kodlar (`renk`, `dahili_hafiza`) ve displayType önerisi (renk → swatch, hafıza → button).
