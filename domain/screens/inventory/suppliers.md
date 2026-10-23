# Tedarikçiler (Suppliers) — liste, oluştur, detay/düzenle

Üç route tek dosyada:

| URL | Sayfa başlığı (tr / en) | Amaç |
|---|---|---|
| `{ADMIN_URL}/inventory/suppliers` | "Tedarikçiler / Suppliers" (+ kayıt sayısı rozeti) | Liste, arama, durum filtresi, silme |
| `{ADMIN_URL}/inventory/suppliers/new` | "Yeni Tedarikçi / New Supplier" | Tedarikçi oluştur |
| `{ADMIN_URL}/inventory/suppliers/{id}` | Tedarikçi adı + durum rozeti | Detay, hızlı durum değişikliği, silme |
| `{ADMIN_URL}/inventory/suppliers/{id}?edit=true` | "Tedarikçiyi Düzenle / Edit Supplier" | Aynı formla düzenleme |

- Menü yolu: Sol menü "Envanter / Inventory" → "Tedarikçiler / Suppliers".
- Açıklama: "Tedarikçilerinizi ve satıcı ilişkilerinizi yönetin / Manage your suppliers and vendor relationships".
- Amaç: Satın alma siparişlerinde (PO) kullanılacak tedarikçi kartlarını tutmak (kod, iletişim, adres, ödeme koşulu, teslim süresi, para birimi).
- Entity: [../../entities/supplier.md](../../entities/supplier.md).
- Yetki: menü `inventory:read`; tedarikçi verisi `suppliers:read`, oluştur/düzenle/durum/sil `suppliers:write`.
- API (public): `GET/POST /suppliers`, `GET /suppliers/active`, `GET/PUT/DELETE /suppliers/{id}`, `PATCH /suppliers/{id}/status`.

## Ön koşullar ve bağımlılıklar
- Ön koşul yok.
- Etkiledikleri: [purchase-orders.md](purchase-orders.md) — PO formundaki "Tedarikçi" seçicisinde **yalnız "Aktif" durumdaki** tedarikçiler listelenir; PO'nun para birimi tedarikçinin "Para Birimi" alanından gelir.

## Yerleşim

### Liste
1. Kart başlığı (kamyon ikonu) + kayıt sayısı; sağda "Tedarikçi Ekle / Add Supplier".
2. Filtre satırı: arama input'u (placeholder "Tedarikçi ara... / Search suppliers..."; kod, ad, iletişim adı, şehirde arar), durum Select ("Tüm Durumlar / All Statuses", Aktif, Pasif, Askıya Alınmış, Onay Bekliyor), "Yenile / Refresh".
3. Tablo sütunları: "Kod / Code" (sıralanabilir), "Ad / Name" (sıralanabilir), "Durum / Status", "İletişim / Contact", "Şehir / City", "Ödeme Koşulları / Payment Terms", "Teslim Süresi / Lead Time" (`{n} gün`), "Değerlendirme / Rating", "Toplam Sipariş / Total Orders", "⋯" (sr-only "Menüyü aç / Open menu").
4. Satır menüsü: "Detayları Görüntüle / View Details", "Düzenle / Edit", "Sil / Delete".
5. Sayfalama: 20 satır/sayfa, "Önceki / Previous", "Sonraki / Next". Liste en çok 100 tedarikçi yükler (doğrulanmadı: daha fazlasında arama kullan).
6. Boş durum: "Tedarikçi bulunamadı" + "İlk tedarikçinizi ekleyerek başlayın." + "Tedarikçi Ekle".

### Detay
- Üstte "Tedarikçilere Dön / Back to Suppliers", ad + durum rozeti, "Düzenle / Edit", "Sil / Delete".
- Sol: "Genel Bakış / Overview" (Kod, Ad, Açıklama), "İletişim Bilgileri / Contact Information", "Adres / Address", "İş Bilgileri / Business Information" (Ödeme Koşulları, Teslim Süresi, Min. Sipariş Tutarı, Vergi Numarası).
- Sağ: "Hızlı İşlemler / Quick Actions" (Düzenle, **"Durum Değiştir / Change Status" Select**, "ID Kopyala / Copy ID", Sil), "Meta Veri / Metadata" (Oluşturulma, Son Güncelleme, ID), "Performans / Performance" kartı (Değerlendirme, Zamanında Teslimat, Kalite Oranı, Toplam Sipariş; veri yoksa "Henüz performans verisi bulunmuyor").

## Alanlar (oluştur / düzenle formu)
Sayfa: "Yeni Tedarikçi" (açıklama "Tedarikçi ilişkilerini yönetmek için yeni bir tedarikçi ekleyin") ya da "Tedarikçiyi Düzenle" ("{name} tedarikçi bilgilerini güncelleyin"). Hatalar alanın altında kırmızı metin olarak çıkar.

| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Temel Bilgiler / Basic Information | Tedarikçi Kodu / Supplier Code | Input | evet | 2–20 kr; yalnız **büyük harf, rakam, tire** ("Kod yalnızca büyük harf, rakam ve tire içerebilir"); placeholder "TED-001" | `#code` | Mağaza içinde benzersiz (`SUPPLIER_CODE_EXISTS`, 409). **Düzenlemede kilitli** |
| | Tedarikçi Adı / Supplier Name | Input | evet | 2–100 kr | `#name` | |
| | Açıklama / Description | Textarea | hayır | ≤500 | `#description` | |
| İletişim Bilgileri / Contact Information | İletişim Adı / Contact Name | Input | hayır | — | `#contactName` | Kişisel veri |
| | İletişim E-postası / Contact Email | Input (email) | hayır | geçerli e-posta, ≤255 | `#contactEmail` | Kişisel veri. Sistem bu adrese PO göndermez (bkz. [purchase-orders.md](purchase-orders.md)) |
| | İletişim Telefonu / Contact Phone | Input | hayır | ≤50 | `#contactPhone` | |
| Adres / Address | Ülke Kodu / Country Code | Aranabilir combobox (ülke adları) | hayır | varsayılan **Türkiye (TR)** | label "Ülke Kodu" | Ülke değişince Şehir ve İl/Bölge sıfırlanır |
| | Posta Kodu / Postal Code | Input | hayır | ≤20 | `#postalCode` | |
| | Şehir / City | Desteklenen ülkede aranabilir combobox, değilse Input | hayır | ≤100 | label "Şehir" / `#city` | Türkiye'de il listesi gelir |
| | İl / Bölge / State / Province | Desteklenen ülke+şehirde combobox (ilçeler), değilse Input | hayır | ≤100 | label "İl / Bölge" / `#state` | Türkiye'de seçilen ilin **ilçeleri** listelenir; şehir değişince sıfırlanır |
| | Adres Satırı 1 / Address Line 1 | Input | hayır | ≤255 | `#addressLine1` | |
| | Adres Satırı 2 / Address Line 2 | Input | hayır | ≤255 | `#addressLine2` | |
| İş Bilgileri / Business Information | Ödeme Koşulları / Payment Terms | Select (placeholder "Ödeme koşullarını seçin") | hayır | — | label "Ödeme Koşulları" | Seçenekler (canlıda): Peşin Ödeme / Cash in Advance `CIA`, Net 7/15/30/45/60/90 Gün, Ay Sonu `EOM`, Fatura Takip Eden Ay `MFI`, 2/10 Net 30 |
| | Teslim Süresi (Gün) / Lead Time (Days) | number Input | hayır | tam sayı 0–365; varsayılan 0 | `#leadTimeDays` | "Siparişten teslimata ortalama gün sayısı" |
| | Minimum Sipariş Tutarı / Minimum Order Amount | number Input (0.01 adım) | hayır | formda varsayılan 0; API pozitif tutar bekler (0 ile kayıt davranışı doğrulanmadı) | `#minimumOrderAmount` | Bilgi amaçlı (doğrulanmadı: PO'da kontrol edilmez) |
| | Para Birimi / Currency | Input, en çok 3 kr | hayır (PO için önerilir) | ISO 4217, 3 harf (TRY, USD, EUR) | `#currency` | **PO para birimi buradan gelir**; boşsa PO platform varsayılanıyla açılır (bkz. Tuzaklar) |
| | Vergi Numarası / Tax ID | Input | hayır | ≤50 | `#taxId` | |
| | Durum / Status | Select | — | varsayılan **"Onay Bekliyor / Pending Approval"** | label "Durum" | Aktif `active`, Pasif `inactive`, Askıya Alınmış `suspended`, Onay Bekliyor `pending_approval` |

Butonlar: "İptal / Cancel", "Tedarikçi Oluştur / Create Supplier" ya da "Tedarikçiyi Güncelle / Update Supplier" (düzenlemede değişiklik yoksa pasif).

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Tedarikçi Oluştur | Kayıt oluşur, detay sayfasına yönlenir | "\"{name}\" tedarikçisi başarıyla oluşturuldu"; hata "Tedarikçi oluşturulamadı" |
| Tedarikçiyi Güncelle | Alanlar güncellenir, detaya döner | "Tedarikçi başarıyla güncellendi"; hata "Tedarikçi güncellenemedi" |
| Detay → "Durum Değiştir" Select'ten seçim | **Diyalogsuz, anında** durum değişir | "Tedarikçi durumu {status} olarak güncellendi" |
| Sil (liste ⋯ ya da detay) → "Tedarikçiyi Sil" ("\"{name}\" tedarikçisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.") → "Sil" | Tedarikçi **pasife alınır** (durum "Pasif"); kayıt listede kalır, PO seçicisinden çıkar | "\"{name}\" tedarikçisi başarıyla silindi" |
| ID Kopyala | Panoya kopyalar | "… copied" |

## Onay zamanlaması (kural 2/5/6)
- **Anında kayıt:** detaydaki "Durum Değiştir" Select'i — seçenek tıklanır tıklanmaz kaydolur, onay hook'u yakalamaz (seçenek adı "Aktif/Pasif…"). Onayı Select'e dokunmadan **önce** al.
- Oluştur / Güncelle: özet tablosu + onay.
- Sil: ayrı onay. Etki: tedarikçi pasife alınır, açık PO'lar etkilenmez (doğrulanmadı) ama yeni PO açılamaz. Kullanıcıya "geri alınamaz" metninin görüneceğini, pratikte durumun tekrar "Aktif" yapılabileceğini söyle.
- E-posta / dış sistem: yok.

## Yan etkiler
- Yalnız "Aktif" tedarikçi PO formunda seçilebilir; PO oluşturma pasif/askıdaki/onay bekleyen tedarikçiyi reddeder (`SUPPLIER_INACTIVE`).
- "Toplam Sipariş", "Zamanında Teslimat", "Değerlendirme" ve performans kartı, tedarikçinin PO'ları **"Tamamlandı"** durumuna getirildikçe otomatik güncellenir; elle girilmez.

## Tuzaklar
- Yeni tedarikçinin varsayılan durumu **"Onay Bekliyor"**dur; PO açılacaksa formda Durum'u "Aktif" seç (özette göster).
- Kod büyük harf/rakam/tire olmalı ve sonradan değiştirilemez; Türkçe karakter ve boşluk kullanma (`ABC-TEKSTIL`).
- Para birimini boş bırakma: PO'nun para birimi tedarikçiden gelir ve PO formunda değiştirilemez.
- Arama yalnız yüklenen listede çalışır; kod ile tam arama için kodu yaz.

## Doğrulama
1. Toast.
2. Detay sayfasında Kod, Ad, durum rozeti, iletişim/adres/iş bilgileri.
3. Listede durum filtresiyle satır; PO kullanılacaksa `/inventory/purchase-orders/new` "Tedarikçi" listesinde "{Ad} ({KOD})" görünür.
