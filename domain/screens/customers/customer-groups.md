# Müşteri Grupları (Customer Groups)
- URL: {ADMIN_URL}/customers/groups
- Menü yolu: Sol menü "Müşteriler / Customers" → "Gruplar / Groups".
- Sayfa başlığı: "Müşteri Grupları / Customer Groups"; açıklama "Müşterileri sınıflandırma ve hedefleme için gruplara
  ayırın".
- Amaç: Müşteri gruplarını oluşturmak, düzenlemek, etkinleştirmek/devre dışı bırakmak, otomatik grupları yeniden
  hesaplamak ve silmek. Tüm işlemler bu sayfadaki diyaloglardan yapılır (ayrı create/edit sayfası yok).
- Entity: [../../entities/customer-group.md](../../entities/customer-group.md).
- Yetki: ekran `customers:read`; oluştur/düzenle/etkinleştir/yeniden oluştur/sil `customers:write`. Sunucu ayrıca
  `customer-groups:read|write|delete` ister (admin rolünde var).

## Ön koşullar ve bağımlılıklar
- Ön koşul yok.
- **Etkiledikleri:** ürün formu → Fiyatlandırma → kademe fiyatı satırındaki "Müşteri Grubu" seçicisi (yalnız aktif
  gruplar; [../products/product-create.md](../products/product-create.md)); sepette grup fiyatının uygulanması
  [../settings/taxes.md](../settings/taxes.md) anahtarına bağlıdır. Sipariş listesinde "Müşteri Grubu" filtresi de
  vardır (doğrulanmadı: aynı liste).
- Müşteriyi gruba elle ekleme arayüzü yok (ne bu ekranda ne müşteri formunda). Kullanıcı "şu müşteriyi toptancı
  grubuna ekle" derse bunu söyle; geçici yol önerme.

## Yerleşim
1. Başlık + "Grup Oluştur / Create Group".
2. Özet kartları: "Toplam Grup", "Aktif", "Otomatik", "Toplam Müşteri".
3. Filtre kartı: arama (placeholder "Grupları ara..."; **Enter ile arar**), Tür Select ("Tüm Türler"), Durum Select
   ("Tüm Durumlar", "Aktif", "Pasif"), yenile simge butonu.
4. Tablo: "Ad" (renk noktası + açıklama), "Tür" (rozet), "Durum", "Mod" ("Otomatik"/"Manuel"), "Müşteriler",
   "Öncelik", "Oluşturulma", "İşlemler" (⋯).
5. ⋯ menüsü: "Düzenle / Edit", (yalnız otomatik gruplarda) "Yeniden Oluştur / Rebuild", "Etkinleştir / Activate" ya da
   "Devre Dışı Bırak / Deactivate", "Sil / Delete".
6. Boş durum: "Grup bulunamadı" + "Grup Oluştur".

## Alanlar — "Müşteri Grubu Oluştur" / "Müşteri Grubunu Düzenle" diyaloğu
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Grup Adı / Group Name * | Input | evet | 1–100; boşsa diyalog içinde "Devam etmek için bir grup adı girin" | `#name`, placeholder "örn., VIP Müşteriler" | Mağaza içinde benzersiz |
| Açıklama / Description | Textarea | hayır | ≤500 | `#description` | |
| Grup Türü / Group Type | shadcn Select | evet | Özel / Custom | label "Grup Türü" | Davranışsal, Demografik, Psikografik, Coğrafi, İşlemsel, Özel. **Düzenlemede değiştirilse de kaydedilmez** |
| Öncelik / Priority | number Input | hayır | 0; 0–100 | `#priority` | "Yüksek öncelikli gruplar önce değerlendirilir (0-100)" |
| Renk / Color | renk seçici + hex Input | hayır | `#6366f1` | `#color` | Hex metin kutusuna `#RRGGBB` yaz |
| Otomatik Grup / Automatic Group | Switch | — | kapalı | metin "Otomatik Grup" | "Kriterlere göre müşterileri otomatik ata"; kriter girişi bu ekranda yok |
| Aktif / Active | Switch | — | açık | metin "Aktif" | "Bu grubu etkinleştir" |
Butonlar: "İptal / Cancel", "Grup Oluştur / Create Group" ya da "Grubu Düzenle / Edit Group".

## Aksiyonlar
| Buton | Ne olur | Sonuç |
|---|---|---|
| Grup Oluştur (diyalog) | Grup oluşur, diyalog kapanır, tablo yenilenir | Başarı toast'ı **yok** — tabloda satır görünür. Hata diyalog içinde: "Grup oluşturulamadı. Lütfen tekrar deneyin." (ad çakışması dahil) |
| ⋯ → Düzenle → Grubu Düzenle | Ad, açıklama, öncelik, renk, otomatik, aktif güncellenir | Toast yok; hata "Grup güncellenemedi. Lütfen tekrar deneyin." |
| ⋯ → Etkinleştir / Devre Dışı Bırak | **Diyalogsuz, anında** aktiflik değişir | Toast yok; Durum rozeti değişir |
| ⋯ → Yeniden Oluştur (otomatik gruplar) | **Diyalogsuz, anında** üyelik yeniden hesaplanır | Toast yok; Müşteriler sayısı güncellenir |
| ⋯ → Sil → "Grubu Sil" ("\"{ad}\" grubunu silmek istediğinizden emin misiniz? Bu, tüm müşteri ilişkilerini kaldıracaktır. Bu işlem geri alınamaz.") → "Sil" | Grup ve tüm üyelikleri kaldırılır | Toast yok; satır kaybolur |

## Onay zamanlaması (kural 2/5/6)
- **Etkinleştir / Devre Dışı Bırak** ve **Yeniden Oluştur** menü öğesine tıklandığı anda kaydeder → onayı tıklamadan
  **önce** al. Devre dışı bırakmanın etkisi: grup ürün kademe fiyatı seçicisinde listelenmez; mevcut kademe
  fiyatlarına etkisi doğrulanmadı.
- **Oluştur / Düzenle**: özet (ad, tür, öncelik, renk, otomatik, aktif) + onay.
- **Sil**: geri alınamaz → ayrı onay; özette grup adı ve **etkilenen müşteri sayısı** (tablodaki "Müşteriler"
  sütunu) ve "bu grubu kullanan ürün kademe fiyatları olabilir" uyarısı. Kullanıcıdan kademe fiyatlarını kontrol
  isteyip istemediğini sor.
- Bu ekran müşteriye e-posta göndermez, dış sisteme yazmaz.

## Yan etkiler
- Aktif grup ürün formundaki kademe fiyatında seçilebilir hale gelir; sepette grup fiyatı yalnız vergi ayarlarındaki
  "Sepette kademe fiyatlarını (müşteri grubu ve adet) uygula" açıksa ve müşteri giriş yapmışsa uygulanır.
- Silme gruptaki müşteri ilişkilerini kaldırır.

## Tuzaklar
- Hiçbir aksiyon başarı toast'ı göstermez; sonucu her zaman tabloyu snapshot'layarak doğrula.
- Tür sonradan değişmez; oluştururken doğru seç.
- Arama kutusu yazarken değil Enter'da (ya da yenile simgesiyle) arar.
- "Yeniden Oluştur" yalnız Mod = Otomatik satırlarda görünür.

## Doğrulama
- Tabloda ad, tür rozeti, Durum, Mod, Öncelik, renk noktası.
- Kademe fiyatı kullanılacaksa ürün formunda "Müşteri Grubu" seçicisinde grubun göründüğünü kontrol et (salt okunur;
  formu kaydetmeden çık).
