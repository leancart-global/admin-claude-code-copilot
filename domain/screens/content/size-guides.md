# Beden Rehberleri (Size Guides) — liste, oluştur, detay, düzenle
- URL'ler:
  - Liste: {ADMIN_URL}/content/size-guides
  - Oluştur: {ADMIN_URL}/content/size-guides/new
  - Detay (salt okunur): {ADMIN_URL}/content/size-guides/{id}
  - Düzenle: {ADMIN_URL}/content/size-guides/{id}/edit
- Menü yolu: Sol menü "İçerik / Content" → "Beden Kılavuzları / Size Guides" (`content:read`). İçerik hub'ında
  (`/content`) "Beden Rehberleri / Size Guides" kartı ("Müşterilerin doğru bedeni seçmesi için beden tabloları ekle").
- Amaç: Ürün türüne göre (saat, iç giyim, giyim, ayakkabı…) **beden tablosu**, "nasıl ölçülür" adımları ve ipuçları
  içeren rehberler hazırlamak. Yayındaki ve aktif rehber, vitrinde ürün sayfasındaki "Beden Rehberi" bağlantısından
  açılan pencerede gösterilir.
- Yetki:
  | İşlem | Yetki |
  |---|---|
  | Liste, detay | `content:read` |
  | Oluştur ("Yeni Beden Rehberi" düğmesi) | `content:write` |
  | Düzenle, Kaydet, Yayınla, Arşivle, Taslağa Dön | `content:write` |
  | Sil, toplu sil | `content:delete` |

## Ürünle ilişkisi
- Beden rehberi **ürün ekranından bağlanmaz**; ürün oluştur/düzenle formunda beden rehberi alanı yoktur. Rehber ile
  ürün arasındaki bağ rehberin **Ürün Türü / Product Type** alanıdır: vitrin, ürün sayfasında o türe ait **yayında ve
  aktif** rehberi gösterir. Aynı türde birden çok yayında+aktif rehber varsa **Sıralama değeri en küçük** olan (eşitse
  en yeni oluşturulan) kullanılır.
- Rehberde kategori veya ürün SKU'su atama alanı arayüzde yoktur.
- Varyant bedenleri (S/M/L…) ürünün attribute'larından gelir; rehberdeki beden etiketleriyle otomatik eşleşmez —
  aynı adlandırmayı kullanmak kullanıcının tercihidir.

## Ön koşullar ve bağımlılıklar
- Ad ve URL adresi (slug) dolu olmalı; slug benzersiz olmalı.
- "Nasıl ölçülür" adım görselleri medya kütüphanesinden seçilir/yüklenir (yalnız düzenle ekranında):
  [media-library.md](media-library.md) "Picker".
- Çeviri için ilgili dilde aktif store view gerekir (düzenle ekranındaki "Görünüm" seçicisi store view'lardan gelir).

## Yerleşim

### Liste
- Başlık "Beden Rehberleri / Size Guides", sağda "Yeni Beden Rehberi / New Size Guide".
- Filtreler: arama "Beden rehberlerinde ara... / Search size guides...", Durum ("Tüm Durumlar" / Taslak / Yayında /
  Arşivlendi), Tür ("Tüm Türler" / Saat / İç Giyim / Mücevher / Giyim / Ayakkabı / Aksesuar / Özel); aktif filtre
  rozetleri + "Tümünü temizle".
- Tablo: seçim kutusu, Ad, Tür, Durum, Bilgi (aktif / çeviri sayısı / "{n} beden satırı, {m} sütun" ipuçları),
  Güncellendi; Ad/Tür/Durum/Güncellendi başlıklarına tıklayınca sıralar. Satıra tıklamak **detay** ekranını açar.
  Satır sonu "İşlemler / Actions" menüsü.
- Seçim varsa: "{n} rehber seçildi", "Seçimi Temizle", "Seçilenleri Sil".
- Boş durum: "Beden rehberi bulunamadı — Müşterilerin doğru bedeni seçmesine yardımcı olacak bir beden rehberi oluşturun."

### Oluştur (`/new`) — başlık "Beden Rehberi Oluştur / Create Size Guide"
- Sağ üst: "Müşteri Önizlemesi / Customer Preview", "İptal / Cancel", "Oluştur / Create".
- Sekmeler: "Temel Bilgi / Basic Info", "Beden Tablosu / Size Table", "Nasıl Ölçülür / How to Measure",
  "İpuçları / Tips", "Çeviriler / Translations".

### Detay (`/{id}`)
- "Beden Rehberlerine Dön", "Düzenle" ve "Sil" düğmeleri; Açıklama, Beden Tablosu, Nasıl Ölçülür, İpuçları kartları;
  yan kartta "Rehber Detayları": Tür, Durum, Sıralama, Aktif/Pasif, Oluşturulma, Güncellenme, Çeviriler (n).

### Düzenle (`/{id}/edit`) — başlık "Beden Rehberini Düzenle / Edit Size Guide"
- Durum rozeti (Taslak / Yayında / Arşivlendi; kaydedilmemiş değişiklik varsa "Kaydedilmemiş Değişiklikler").
- **"Görünüm / View"** seçicisi: "Varsayılan" (ana içerik) + aktif store view dilleri. Dil seçiliyken "{dil} için içerik
  düzenleniyor" ve "Senkronize et... / Sync from..." menüsü (başka bir dilin içeriğini bu dile kopyalar).
- Sekmeler: Temel Bilgi, Beden Tablosu, Nasıl Ölçülür, İpuçları (çeviriler Görünüm seçicisiyle düzenlenir).
- Sağ üst: "Rehberi Önizle / Preview Guide", "Kaydet / Save", taslakta "Yayınla / Publish"; yayındaysa
  "Güncelle ve Yayınla / Update & Publish" + yanındaki ok menüsünde "Taslağa Dön / Revert to Draft".
- Durum çubuğu: "Kaydediliyor...", "Tüm değişiklikler kaydedildi", "{zaman} kaydedildi", "Kaydedilmemiş değişiklik yok".

## Alanlar
| Sekme | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Temel Bilgi | Ad / Name (placeholder "Beden rehberi adını girin") | Input `#name` | evet | ≤255 | `getByLabel('Ad')` | Slug'ı otomatik üretir |
| Temel Bilgi | URL Adresi / URL Handle (placeholder `beden-rehberim-url`) | Input `#slug` | evet | küçük harf, rakam, tire; ≤255 ("Slug must be lowercase with hyphens only") | `getByLabel('URL Adresi')` | Addan üretilen slug yalnız a-z, rakam ve tire içerir; özette slug'ı ayrıca göster |
| Temel Bilgi | Ürün Türü / Product Type | Select | — | **Saat (`watch`)**; Saat, İç Giyim, Mücevher, Giyim, Ayakkabı, Aksesuar, Özel | combobox | Vitrinde eşleşmenin temeli — mutlaka kullanıcıya sor |
| Temel Bilgi (yalnız oluştur) | Durum / Status | Select | — | Taslak; Taslak / Yayında / Arşivlendi | combobox | "Yayında" ile oluşturmak anında canlıya alır |
| Temel Bilgi | Sıralama / Sort Order | number | — | 0, ≥0 | `getByLabel('Sıralama')` | Aynı türde birden çok rehberde küçük olan kullanılır |
| Temel Bilgi | Aktif / Active | Switch `#isActive` | — | açık | `getByLabel('Aktif')` | Pasif rehber vitrinde gösterilmez |
| Temel Bilgi | Açıklama / Description | Textarea | — | ≤1000 | `getByLabel('Açıklama')` | |
| Beden Tablosu › Sütunlar | Sütun Anahtarı / Column Key, Sütun Etiketi / Column Label, Birim / Unit (placeholder'lar) | Input satırları + "Sütun Ekle" / "Sütunu Kaldır" | en az 1 sütun | anahtar ≤50, etiket ≤100, birim ≤20; en fazla 20 sütun | placeholder ile | Oluştur ekranında varsayılan: "Size" ve "Measurement (cm)". Anahtarı ve etiketi boş sütun kaydedilmez |
| Beden Tablosu › Beden Satırları | Beden / Size, her sütun için Ölçü / Measurement, Notlar / Notes ("Örn: En popüler beden, Dar kalır...") | Input + "Satır Ekle" / "Satırı Kaldır" | en az 1 satır | beden ≤50, ölçü ≤50, not ≤500; en fazla 50 satır | placeholder ile | Varsayılan satırlar S, M, L. Beden etiketi boş satır kaydedilmez. Son sütun/satır kaldırılamaz |
| Nasıl Ölçülür | Adım {n}: Adım Başlığı (opsiyonel), Adım Açıklaması, (düzenle ekranında) Adım Görseli | Input, Textarea, medya seçici alanı | — | başlık ≤200, açıklama ≤1000; en fazla 20 adım | "Adım Ekle" | Açıklaması boş adım kaydedilmez |
| İpuçları | İpucu Metni ("Müşteriler için yardımcı bir ipucu girin..."), (düzenle ekranında) Simge / Icon | Textarea/Input + "İpucu Ekle" | — | metin ≤500, simge ≤50; en fazla 20 | | Metni boş ipucu kaydedilmez |
| Çeviriler (oluştur) | "Dil Ekle" → dil başına Ad *, Açıklama, Ölçüm Adımları, İpuçları | Input/Textarea | dil eklenirse Ad | Adı boş çeviri kaydedilmez | | Desteklenen diller listesi sabittir |
| Görünüm = bir dil (düzenle) | Ad, Açıklama, adım ve ipucu metinleri | Input/Textarea | — | — | | Tür, sıralama, aktiflik ve beden tablosu tüm dillerde ortaktır ("Beden tablosu tüm dillerde ortaktır…") |

## Aksiyonlar
| Düğme (tr / en) | Yer | Etki | Onay / Toast |
|---|---|---|---|
| Yeni Beden Rehberi | Liste | `/new` | — |
| Oluştur / Create | Oluştur | Doğrular (ilk hata toast olarak) ve oluşturur → listeye döner | "Beden rehberi başarıyla oluşturuldu"; hata "Ad ve kısayol gereklidir." / doğrulama mesajı / "Beden rehberi kaydedilemedi." |
| Müşteri Önizlemesi / Rehberi Önizle | Oluştur/Düzenle | Masaüstü/Mobil önizleme (kaydetmez) | — |
| Kaydet / Save | Düzenle | Tüm alanları kaydeder, durumu değiştirmez. **Rehber yayındaysa değişiklik doğrudan vitrine yansır** | "Değişiklikleriniz kaydedildi." / "{dil} için değişiklikler kaydedildi." |
| Yayınla / Güncelle ve Yayınla | Düzenle | Doğrular, kaydeder ve rehberi yayına alır | "Beden rehberi başarıyla yayınlandı." / hata varsa "{n} hatayı düzeltin" |
| Taslağa Dön / Revert to Draft | Düzenle (yayındaysa, ok menüsü) | Kaydeder ve rehberi taslağa çevirir → vitrinden kalkar | "Beden rehberi taslağa döndürüldü." |
| Senkronize et... | Düzenle (dil görünümü) | Seçilen dilin içeriğini bu dile kopyalar (kaydedene kadar kalıcı değil) | "{kaynak} kaynağından içerik senkronize edildi." |
| İşlemler → Görüntüle / Düzenle / Çeviriler | Liste | Detay / düzenle ekranı | — |
| İşlemler → Yayınla | Liste (yalnız taslak) | **Onaysız, anında** yayına alır | "Beden rehberi başarıyla yayınlandı" |
| İşlemler → Arşivle | Liste (yalnız yayında) | **Onaysız, anında** arşivler → vitrinden kalkar | "Beden rehberi başarıyla arşivlendi" |
| İşlemler → Sil / Detay → Sil | Liste / Detay | Diyalog "Beden Rehberini Sil? — \"{ad}\" kalıcı olarak silinecek. Bu işlem geri alınamaz." → "Sil" (kırmızı) | "Beden rehberi başarıyla silindi" |
| Seçilenleri Sil | Liste | Seçili rehberleri **onay diyaloğu göstermeden** tek tek kalıcı siler | "{n} beden rehberi başarıyla silindi." / "{x} silindi, {y} başarısız." |

## Yan etkiler
- Yayında + aktif rehber, vitrinde ilgili türdeki ürün sayfalarının beden rehberi penceresinde görünür; Kaydet, Yayınla,
  Arşivle, Taslağa Dön, Aktif anahtarı ve silme vitrini doğrudan etkiler.
- Bir türdeki rehber silinir/arşivlenir/pasifleşirse vitrin aynı türdeki bir sonraki yayında+aktif rehbere geçer; hiç
  kalmazsa pencere "rehber yok" mesajı gösterir.

## Tuzaklar
- Yayındaki rehberde "Kaydet" taslak oluşturmaz; canlı içeriği değiştirir — yayındaki rehberde her kaydetmeden önce onay al.
- Listede Yayınla/Arşivle ve "Seçilenleri Sil" ekranda onay sormaz; onayı sohbette, kayıt adları ve sayısıyla al (kural 5).
- Ürün Türü varsayılanı "Saat"tır; kullanıcı belirtmediyse sor, varsayma.
- Oluştur ekranında Durum alanı vardır; kullanıcı "yayınla" demediyse Taslak bırak.
- Oluştur ekranında adım görseli ve ipucu simgesi alanı yoktur; görsel gerekiyorsa oluşturduktan sonra düzenle ekranında ekle.
- Oluşturduktan sonra liste ekranına döner; rehberi aramayla bulup düzenle.
- Listedeki "Çeviriler" işlemi düzenle ekranını açar; dil, ekrandaki "Görünüm" seçicisinden seçilir.

## Doğrulama
1. Liste: aramada rehber adı; Tür ve Durum rozetleri doğru; Bilgi ipucunda satır/sütun sayısı beklendiği gibi.
2. Detay: Beden tablosu, ölçüm adımları, ipuçları ve "Rehber Detayları" (Tür, Durum, Sıralama, Aktif) değerleri.
3. Yayındaysa vitrinde ilgili türden bir ürün sayfasında "Beden Rehberi" bağlantısı → pencerede tablo görünür (görünmezse raporla).
