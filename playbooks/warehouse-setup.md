# Playbook: İlk depoyu kur ve varsayılan yap ("depo ekle", "stok girebilmek için depo lazım")

Tetikleyiciler: "depo oluştur/ekle", "ilk depoyu kur", "varsayılan depo yap", ürün kaydında "Stok eklemeden önce bir depo
tanımlamanız gerekir…" (`WAREHOUSE_NOT_CONFIGURED`) hatası, stok ekranında "Depo tanımlı değil" uyarısı, ürün formunun
Stok sekmesinde depo yok bandı.
Harita: ../domain/screens/inventory/warehouses.md (alanlar, locator, tuzaklar), ../domain/entities/warehouse.md (kurallar).
URL: `{ADMIN_URL}/inventory/warehouses/new`.

---

## 0. Kural hatırlatması
- Depo kaydı kalıcıdır → **özet tablo + açık "evet"** olmadan "Depo Oluştur"a basma.
- "Bu adresi kargo hesabımda oluştur" **kargo firmasına anında yazar** → ayrı özet, ayrı onay; kullanıcı istemedikçe basma.
- Detay ekranındaki "Durum" seçicisi ve "Varsayılan Yap" diyalogsuz kaydeder → dokunmadan önce onay.
- Prod ortamında test deposu ("TEST", "Deneme") açma.

## 1. Mevcut durumu oku (salt okunur)
1. `/inventory/warehouses` aç → snapshot. Liste dolana kadar bekle; "Depo Yok" boş durumu görülmeden "depo yok" deme.
2. Depo varsa: yıldızlı (varsayılan) satır var mı, durumu "Aktif" mi?
   - Aktif varsayılan depo varsa yeni depo gerekmeyebilir → kullanıcıya sor ("Mevcut varsayılan depo: X. Yeni depo mu
     açalım, yoksa bunu mu kullanalım?").
   - Depo var ama varsayılan yok / varsayılan pasif → 5. adıma (mevcut depoyu varsayılan yap) git.
3. Kargo entegrasyonu durumu (gönderici adresi için): `/settings/shipping/carriers` → ../domain/screens/settings/shipping-carriers.md.
   Kurulu değilse gönderici adresi adımı atlanır, depo yine kurulur.

## 2. Bilgileri topla → taslak

| Bilgi | Form alanı | Zorunlu | Varsayılan (sorulmazsa) |
|---|---|---|---|
| Depo kodu | Depo Kodu (`#code`) | Evet | Öner: `WH-01` ya da şehir kısaltması (`IST-01`) — **BÜYÜK harf/rakam/tire**, 2–20; onaylat. Sonradan değişmez |
| Depo adı | Ad (`#name`) | Evet (3–100) | "Ana Depo" — onaylat |
| Tür | Depo Türü | Evet | "Ana Depo" (varsayılan) |
| Öncelik | Öncelik | – | 1 (varsayılan) |
| **Varsayılan depo** | Varsayılan Depo switch | – | **Açık** (ilk depo için şart; otomatik açılmaz) |
| Teslim noktası | Teslim Noktası switch | – | Kapalı (müşteri mağazadan teslim alacaksa sor) |
| Adres satırı 1 | Adres Satırı 1 | Evet | — (sor) |
| Adres satırı 2 | Adres Satırı 2 | – | boş |
| Ülke | Ülke Kodu | Evet | Türkiye |
| İl | Şehir | Evet | — (sor) |
| İlçe | İlçe | TR'de yıldızlı | — (sor; kargo fiyatı ilçeye duyarlı) |
| Posta kodu | Posta Kodu | Evet | — (sor; 5 hane) |
| Koordinat | Enlem / Boylam | – | boş (yalnız "Müşteriye En Yakın" stratejisi için gerekir) |
| Kargo gönderici adresi | Kargo gönderici adresi | – | Kargo hesabında uygun adres varsa kullanıcıya listeyi göster, seçtir; yoksa "Bağlı değil" |
| Kapasite | Maksimum Kapasite | – | 0 (sınırsız) |
| Varsayılan stok ayarları | Düşük Stok Eşiği / Yeniden Sipariş Noktası / Miktarı / Ön Sipariş | – | 10 / 5 / 100 / kapalı (varsayılan) |

Eksik zorunluları (adres, il, ilçe, posta kodu) **tek seferde** sor.

## 3. Formu doldur
1. `/inventory/warehouses/new` → snapshot; başlık "Depo Oluştur".
2. Temel Bilgiler: `#code`, `#name`, (ops.) `#description`; Depo Türü combobox → "Ana Depo" (zaten seçiliyse dokunma); `#priority`.
3. "Varsayılan Depo" kartındaki switch'e tıkla → `aria-checked="true"` doğrula (formdaki 1. switch; kart metnine göre teyit et).
4. Adres — **sıra önemli**:
   a. "Ülke seçin" combobox → "Türkiye" yaz → seçeneğe tıkla.
   b. "İl seçin" combobox → il adını yaz → `browser_wait_for` → seçeneğe tıkla.
   c. "İlçe seçin" combobox (il seçilince açılır) → yaz → bekle → tıkla.
   d. `[id="address.line1"]`, (ops.) `[id="address.line2"]`, `[id="address.postalCode"]`.
5. Gönderici adresi (yalnız kargo bağlıysa ve kullanıcı seçtiyse): `#geliverAddressId` Select → adres seçeneği.
   Hesapta uygun adres yoksa ve kullanıcı isterse "Bu adresi kargo hesabımda oluştur" — **önce ayrı onay** (adım 0).
6. Kapasite ve varsayılan stok ayarları: varsayılanda bırak, kullanıcı değer verdiyse yaz.
7. Snapshot → kırmızı hata mesajı yok mu; değerleri oku.

## 4. Özet + onay → kaydet
Özet (ortam başta):

| Alan | Değer |
|---|---|
| Ortam | prod / dev / local (`config/local.json`) |
| Depo Kodu | WH-01 (sonradan değiştirilemez) |
| Ad / Tür / Öncelik | Ana Depo / Ana Depo / 1 |
| Varsayılan Depo | **Evet** — depo seçmeden girilen tüm stoklar buraya yazılır |
| Teslim Noktası | Hayır |
| Adres | Satır 1, İlçe / İl, Posta Kodu, Türkiye |
| Kargo gönderici adresi | {seçilen} / Bağlı değil |
| Kapasite | 0 (sınırsız) — varsayılan |
| Varsayılan stok ayarları | 10 / 5 / 100 / Ön sipariş kapalı — varsayılan |

Onaydan sonra "Depo Oluştur" → toast "\"{name}\" deposu başarıyla oluşturuldu" → detay sayfasına yönlenme.
Hata toast'unda ("Depo oluşturulamadı…") dur: kod çakışması olabilir → listede kodu ara; değilse kullanıcıya bildir.

## 5. (Alternatif) Mevcut depoyu varsayılan yap
1. Depo detayını aç (`/inventory/warehouses/{id}`).
2. Durum "Aktif" değilse: önce kullanıcıdan onay al → Durum Select → "Aktif" (**anında kaydeder**).
3. Varsayılan yapmak için iki yol: detaydaki "Varsayılan Yap" (**anında**, onay önce) ya da "Düzenle" → "Varsayılan Depo"
   switch → özet → "Depoyu Güncelle". Özetinde eski varsayılan → yeni varsayılan yaz.

## 6. Doğrula
1. Detay: başlıkta "Aktif" ve "★ Varsayılan Depo" rozetleri, kod doğru.
2. `/inventory/warehouses`: yalnız bu satırda yıldız.
3. `/inventory/stock`: "Depo tanımlı değil" uyarısı yok.
4. (Ürün girişi bekliyorsa) `/products/new` → Stok sekmesi: depo yok bandı kalkmış, Depo seçicide "{ad} ({kod})".
5. Rapor: depo linki, varsayılan durumu, gönderici adresi bağlı mı; kalan iş: kargo bağlı değilse "Ayarlar → Kargo"
   kurulunca depo düzenle ekranından gönderici adresi bağlanmalı. Bekleyen ürün girişine dön
   (./product-create.md).
