# Vergi Sınıfları (Tax Classes)
- URL: {ADMIN_URL}/settings/tax-classes
- Menü yolu: Sol menü "Ayarlar / Settings" → "Vergi Sınıfları / Tax Classes"; ya da `/settings` hub → "Operasyonlar / Operations" → "Vergi Sınıfları / Tax Classes".
- Sayfa başlığı: "Vergi Sınıfları / Tax Classes"; açıklama "Ürünleriniz için vergi oranlarını ve kategorilerini yönetin".
- Amaç: Ürünlere atanan KDV oranlarını (Standart %20, İndirimli %10 …) tanımlamak; hangi sınıfın varsayılan olduğunu belirlemek. Vergi sınıfı seçilmemiş ürün varsayılan sınıfın oranıyla vergilendirilir; fiyatın vergi dahil/hariç yorumu ayrıca [taxes.md](taxes.md) ekranındadır.
- Entity: [../../entities/tax-class.md](../../entities/tax-class.md).
- Yetki: ekran `settings:read`; ekle/düzenle/sil/aktiflik/varsayılanları oluştur `products:write`.

## Ön koşullar ve bağımlılıklar
- Ön koşul yok.
- Etkiledikleri: ürün formundaki "Vergi Sınıfı" seçicisi (yalnız aktif sınıflar), ürün vergi hesabı, vergi ayarları önizlemesi (varsayılan sınıfın oranını kullanır), sipariş/fatura vergi tutarları.

## Yerleşim
1. Kart başlığı + açıklama; sağda — **yalnız hiç sınıf yokken** — "Varsayılan Vergi Sınıflarını Oluştur / Seed Default Tax Classes", her zaman "Vergi Sınıfı Ekle / Add Tax Class".
2. Tablo sütunları: "Ad / Name" (+ açıklama), "Kod / Code" (dar ekranda gizli), "Tür / Type" (renkli rozet), "Oran / Rate" (`20%`), "Varsayılan / Default" (sarı yıldız), "Aktif / Active" (satır içi Switch), "⋯" (sr-only "İşlemler / Actions").
3. Satır menüsü: "Düzenle / Edit", "Sil / Delete".
4. Boş durum: "Vergi Sınıfı Yok" + "Varsayılan Vergi Sınıflarını Oluştur" + "İlk Vergi Sınıfınızı Ekleyin" + "Standart Türk vergi sınıflarını oluşturun (KDV oranları)".
- Varsayılan (seed) sınıfların adı/açıklaması arayüz diline göre çevrilmiş görünür (ör. `standard` → "Standart KDV / Standard KDV"); kullanıcı tanımlıların adı girildiği gibi.

## Alanlar
### Ekle / Düzenle diyaloğu ("Vergi Sınıfı Ekle" / "Vergi Sınıfını Düzenle")
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Ad / Name | Input | evet | ≤100; boşsa toast (placeholder metni "örn. Standart KDV") | `#tax-name` | Eklemede Kod'u otomatik üretir |
| Kod / Code | Input | evet (ekle) | ≤50, küçük harfle başlar; yalnız küçük harf, rakam, alt çizgi ("Sadece küçük harf, rakam ve alt çizgi") | `#tax-code` | Addan önerilir; kodu ASCII olarak kullanıcıyla netleştir (ör. `super_indirimli_kdv`). **Düzenlemede kilitli**. Mağaza içinde benzersiz (409) |
| Tür / Type | Select (placeholder "Vergi türü seçin") | evet | — | label "Tür" | "Standart / Standard" `standard`, "İndirimli / Reduced" `reduced`, "Süper İndirimli / Super Reduced" `super_reduced`, "Sıfır Oran / Zero Rate" `zero`, "Muaf / Exempt" `exempt` |
| Oran (%) / Rate (%) | number Input, adım 0.01 | evet | 0–100 | `#tax-rate` | Yüzde olarak (20 = %20) |
| Açıklama / Description | Textarea | hayır | ≤500 | `#tax-description` | |
| Aktif / Active | Switch | — | açık | label "Aktif" | "Pasif vergi sınıfları ürün ayarlarında görünmez" |
| Varsayılan / Default | Switch | — | kapalı | label "Varsayılan" | "Yeni ürünler için varsayılan vergi sınıfı olarak ayarla". Açıp kaydetmek mevcut varsayılanın işaretini kaldırır |
Butonlar: "İptal / Cancel", "Vergi Sınıfı Ekle / Add Tax Class" ya da "Değişiklikleri Kaydet / Save Changes". Validasyon hataları toast olarak çıkar (alan altında değil).

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Vergi Sınıfı Ekle → diyalog → Vergi Sınıfı Ekle | Sınıf oluşur | "Vergi sınıfı başarıyla oluşturuldu"; kod çakışması 409 |
| ⋯ → Düzenle → Değişiklikleri Kaydet | Ad/tür/oran/açıklama/aktif/varsayılan güncellenir | "Vergi sınıfı başarıyla güncellendi" |
| Satırdaki "Aktif" Switch | **Diyalogsuz, anında** aktiflik değişir; başarıda toast **çıkmaz** (yalnız hata toast'u) | — |
| ⋯ → Sil → onay "Vergi Sınıfını Sil" ("\"{name}\" silinsin mi? Bu işlem geri alınamaz.") → "Sil" | Kalıcı silme | "Vergi sınıfı başarıyla silindi"; varsayılan sınıf silinemez: `ERR_TAX_CLASS_DEFAULT_UNDELETABLE` (409) |
| Varsayılan Vergi Sınıflarını Oluştur | Hiç sınıf yoksa 5 sınıf oluşturur: Standart KDV `standard` %20 (**varsayılan**), İndirimli KDV `reduced` %10, Süper İndirimli KDV `super_reduced` %1, Sıfır Oran `zero` %0, Vergiden Muaf `exempt` %0 | "Varsayılan vergi sınıfları başarıyla oluşturuldu" |

## Onay zamanlaması (kural 2/5/6)
- **Anında kayıt:** tablodaki "Aktif" Switch'i — onay dokunmadan **önce**; başarı toast'u olmadığından doğrulama snapshot ile yapılır.
- Oran değişikliği o sınıfı kullanan **tüm ürünlerin** vergi hesabını değiştirir → özetinde "etkilenen: bu sınıftaki tüm ürünler" yaz (ürün listesinde vergi sınıfı filtresiyle sayı verilebiliyorsa ver — doğrulanmadı).
- "Varsayılan" değişikliği vergi sınıfı boş olan tüm ürünleri etkiler.
- **Silme:** ayrı onay; öncesinde sınıfın ürünlerde kullanılıp kullanılmadığını kullanıcıya sor / kontrol et.
- "Varsayılan Vergi Sınıflarını Oluştur" 5 kayıt oluşturur → özet tablosu + onay.

## Yan etkiler
- Pasif sınıf ürün formundaki seçicide görünmez; daha önce atanmış ürünlerde kalır (doğrulanmadı).
- Varsayılan sınıfın oranı [taxes.md](taxes.md) önizlemesinde kullanılır.

## Tuzaklar
- Kod sonradan değişmez; kaydetmeden önce özette göster.
- Oran alanı yüzde değeridir; "0.20" girme, "20" gir.
- Varsayılan sınıfı silmek/değiştirmek için önce başka bir sınıfı varsayılan yap.
- "Varsayılan Vergi Sınıflarını Oluştur" butonu yalnız liste boşken görünür.

## Doğrulama
1. Toast (aktiflik Switch'i hariç).
2. Tabloda satır: Ad, Kod, Tür rozeti, Oran, yıldız, Aktif switch durumu.
3. Ürün formunda "Vergi Sınıfı" seçicisinde sınıfın göründüğü (aktifse).
