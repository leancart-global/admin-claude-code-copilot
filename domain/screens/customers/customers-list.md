# Müşteri Listesi (Customers)
- URL: {ADMIN_URL}/customers
- Menü yolu: Sol menü "Müşteriler / Customers" → "Tüm Müşteriler / All Customers".
- Sayfa başlığı: "Müşteriler / Customers" + toplam sayı rozeti; açıklama "Müşteri hesaplarini görüntuyleyin ve yönetin /
  View and manage customer accounts".
- Amaç: Müşteri aramak, durum/doğrulama filtresiyle süzmek, detaya/düzenlemeye gitmek, müşteri silmek, yeni müşteri
  oluşturmaya geçmek.
- Entity: [../../entities/customer.md](../../entities/customer.md).
- Yetki: ekran `customers:read`; "Sil" `customers:delete` (menüde her zaman görünür, yetkisizse sunucu reddeder).
- **Kişisel veri**: tabloda ad, e-posta, telefon görünür. Claude listeyi yalnız aradığı kaydı bulmak için okur; ekran
  içeriğini toplu olarak sohbete/dosyaya aktarmaz.

## Ön koşullar ve bağımlılıklar
- Yok. Sipariş ekranları müşteriyi buradan değil kendi arama kutularından seçer
  ([../orders/order-create.md](../orders/order-create.md)).

## Yerleşim
1. Kart başlığı (başlık + sayı rozeti) ve sağda **"Müşteri Oluştur / Create Customer"** butonu → `/customers/new`.
2. Filtre satırı: arama kutusu (placeholder "Ad, e-posta veya telefon ile müşteri arayin... / Search customers by name,
   email, or phone..."), sağda iki Select: durum ("Tüm Durumlar / All Status", "Aktif", "Pasif") ve doğrulama
   ("Tüm Doğrulama / All Verified", "Doğrulandi / Verified", "Doğrulanmadi / Unverified"). Select'ler dar ekranda gizlenir.
3. Aktif filtre rozetleri ("Filtreleri Temizle:" etiketi, her rozette kapat düğmesi aria-label "Kapat / Close") +
   "Tümünü Temizle / Clear All".
4. Tablo sütunları: "Müşteri / Customer" (avatar, ad soyad, Doğrulandı/Doğrulanmadı işareti, VIP rozeti),
   "İletişim / Contact" (e-posta, telefon), "Siparişler / Orders" ("{n} sipariş"), "Toplam Harcama / Total Spent",
   "Durum / Status" (rozet), "Katildi / Joined", "İşlemler / Actions" (⋯).
5. Satıra tıklamak detaya gider. ⋯ menüsü: "Müşteri Detayları / Customer Details", "Müşteriyi Düzenle / Edit Customer",
   "Sil / Delete".
6. Sayfalama: sayfa başına 20; "{total} sonuçtan {from} - {to} arası gösteriliyor", "Önceki / Previous",
   "Sonraki / Next".
7. Boş durum: "Müşteri bulunamadı / No customers found" + filtre varsa "Filtreleri Temizle", yoksa
   "İlk Müşterinizi Ekleyin / Add Your First Customer". Yükleme hatasında "Müşteriler yüklenemedi" + "Tekrar Dene".

## Alanlar (filtreler)
| Label (tr / en) | Kontrol tipi | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|
| Arama | Input (text) | boş | placeholder "Ad, e-posta veya telefon…" | Yazdıktan ~300 ms sonra arar; Enter hemen arar (arama için Enter serbest, kayıt yapmaz) |
| Durum | shadcn Select | Tüm Durumlar | tetikleyici metni "Tüm Durumlar / All Status" | Aktif / Pasif |
| Doğrulama | shadcn Select | Tüm Doğrulama | tetikleyici metni "Tüm Doğrulama / All Verified" | Doğrulandı / Doğrulanmadı (doğrulanmadı: sayı rozetine yansıması) |

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Müşteri Oluştur | `/customers/new` açılır | — |
| Satır / ⋯ → Müşteri Detayları | `/customers/{id}` | — |
| ⋯ → Müşteriyi Düzenle | `/customers/{id}/edit` | — |
| ⋯ → Sil → diyalog "Müşteriyi Sil / Delete Customer" ("Bu müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.") → "Sil" | Müşteri silinir, listeden kalkar | "Müşteri başarıyla silindi"; hata "Müşteri silinemedi. Lütfen biraz sonra tekrar deneyin." |

**Dışa aktarma:** Bu listede toplu müşteri dışa aktarma butonu yok. Tek müşterinin verisi
[customer-detail.md](customer-detail.md) → "Gizlilik ve KVKK" sekmesinden indirilir (kişisel veri; yalnız kullanıcı
açıkça isterse).

## Onay zamanlaması (kural 2/5)
- **Sil**: geri alınamaz, tek kayıt → ayrı onay; özette müşteri adı, e-posta (maskeli), sipariş sayısı. Toplu silme yok.
- Arama/filtre salt okunur, onay gerekmez.

## Yan etkiler
- Silinen müşteri listeden, aramadan ve segment hesaplarından düşer; geçmiş siparişler silinmez (doğrulanmadı).
- Silme müşteriye bildirim göndermez (doğrulanmadı).

## Tuzaklar
- "Analitik" etiketi menüde birden çok yerde var; müşteri analitiği için "Müşteriler" grubunun altındakine tıkla.
- Durum rozetinde "Aktif" dışındaki değerler (Engellendi, Ayrılan, Potansiyel) ham durum adıyla görünebilir.
- Silme ile KVKK silmesi farklı işlemlerdir; müşteri "verimi silin" talebi için [customer-detail.md](customer-detail.md)
  → Gizlilik ve KVKK kullanılır.

## Doğrulama
- Arama kutusuna e-postayı yaz → satır görünür; detay ekranında e-posta/ad eşleşir.
- Silmeden sonra aynı aramada sonuç çıkmaz ve toast görülür.
