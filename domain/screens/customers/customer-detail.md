# Müşteri Detayı (Customer Detail)
- URL: {ADMIN_URL}/customers/{id}
- Menü yolu: "Müşteriler → Tüm Müşteriler" → satıra tıkla (ya da ⋯ → "Müşteri Detayları / Customer Details").
- Sayfa başlığı: müşterinin adı soyadı (h1).
- Amaç: Müşterinin profilini, siparişlerini, aktivitesini, notlarını, istek listesini, adreslerini, iletişim
  tercihlerini ve KVKK/GDPR işlemlerini tek yerden yönetmek; hesap aktivasyon daveti / doğrulama e-postası göndermek;
  müşteriyi silmek.
- Entity: [../../entities/customer.md](../../entities/customer.md).
- Yetki: görüntüleme `customers:read`; sekmelerdeki ekle/düzenle/kaydet `customers:write`; başlıktaki "Sil" yalnız
  `customers:delete` varsa görünür; KVKK sekmesindeki "Verileri Anonimleştir"/"Tüm Verileri Sil" butonları
  `customers:delete` ile görünür ve işlem ayrıca `gdpr:delete` ister; veri dışa aktarımı `gdpr:export` ister.
- **Kişisel veri ekranı.** Dışa aktarma ve silme/anonimleştirme aşağıda ayrı işaretlidir.

## Ön koşullar ve bağımlılıklar
- Müşteri kaydı ([customer-create.md](customer-create.md)).
- Davet ve doğrulama e-postası için mağaza URL'si (Ayarlar → Genel) tanımlı olmalı; yoksa "Mağaza URL'si
  yapılandırılmamış. Doğrulama maili göndermeden önce Ayarlar → Genel'den ayarlayın."
- İstek listesine ürün eklemek için ürünün katalogda olması gerekir.

## Yerleşim
1. Üst satır: "← Müşterilere Dön / Back to Customers"; sağda "Düzenle / Edit" → `/customers/{id}/edit`, hesap
   durumuna göre **tek** buton (aşağıda), yetki varsa kırmızı "Sil / Delete".
2. Başlık kartı: avatar (üzerine gelince kamera simgesi; tıklayınca dosya seçimi), ad soyad, VIP rozeti, durum rozeti,
   yaşam döngüsü rozeti, "E-posta Doğrulandı / Email Verified" ya da "E-posta Doğrulanmadı / Email Not Verified";
   "Müşteri No: …"; e-posta, telefon, ilk adresin şehri; ilk 5 etiket. Sağda 4 kutu: Toplam Sipariş, Yaşam Boyu
   Değer, Etkileşim Puanı, Son Siparişten Bu Yana.
3. Hesap butonu (yalnız biri görünür):
   - **"Hesabı Aktive Et / Activate Account"** — müşterinin giriş hesabı yok ve davet gönderilmemiş (admin'den açılan
     müşteri).
   - **"Davet Gönderildi / Invite Sent" (tarih)** — pasif; davet gitmiş, müşteri henüz şifre belirlememiş.
   - **"Doğrulama Maili Gönder / Send Verification Email"** — hesabı var ama e-postası doğrulanmamış.
   - Hiçbiri — hesap aktif ya da e-posta doğrulanmış.
4. Sekmeler (dar ekranda yalnız simge; aria-label ile bul): "Genel Bakış / Overview", "Siparişler / Orders",
   "Aktivite / Timeline", "Notlar / Notes", "İstek Listesi / Wishlist", "Adresler / Addresses",
   "Tercihler / Preferences", "Gizlilik ve KVKK / GDPR".

## Sekmeler
### Genel Bakış (salt okunur)
Yaşam Boyu Değer (+ tahmini), Toplam Sipariş / ortalama, Etkileşim Puanı (/100), Kayıp Riski, son sipariş günü;
"Müşteri Segmentleri" kartı: Değer Segmenti, Yaşam Döngüsü, Fiyat Hassasiyeti, Sadakat Puanı ve **"Atanan Segmentler"**
rozetleri (tıklayınca [segments.md](segments.md) detayı); tercih edilen kategoriler/markalar; Son Siparişler.

### Siparişler (salt okunur)
Tablo: Sipariş, Tarih, Ürünler, Durum, Tutar, İşlemler. Satırdaki ok kalemleri açar; "Sipariş Detayını Aç / View order"
→ `/orders/{id}` ([../orders/order-detail.md](../orders/order-detail.md)). Sayfalı. Boş: "Henüz sipariş yok".
Bu müşteri için yeni sipariş → [../orders/order-create.md](../orders/order-create.md).

### Aktivite (salt okunur)
"Aktivite Zaman Çizelgesi"; filtre düğmeleri: "Tüm Olaylar", "Siparişler", "Notlar", "Hesap", "E-postalar".

### Notlar
| Kontrol (tr / en) | Tip | Not |
|---|---|---|
| "Not Ekle / Add Note" | buton | formu açar/kapatır |
| Not metni | Textarea, placeholder "Notunuzu buraya yazın..." | boşken kaydet pasif; ≤2000 |
| "Kategori:" | shadcn Select | Genel (vars.), Destek, Satış, Fatura, Geri Bildirim, Önemli |
| "Sadece Dahili / Internal Only" ↔ "Müşteriye Görünür / Visible to Customer" | Switch `#internal` | vars. dahili. Kapalıyken not müşteriye görünür olarak işaretlenir |
| "Notu Kaydet / Save Note" | buton | toast "Not eklendi" |
| Çöp kutusu (aria-label "Notu Sil / Delete note") → "Notu sil?" ("Bu not kalıcı olarak silinecek. Bu işlem geri alınamaz.") → "Sil" | | toast "Not silindi" |

### İstek Listesi
- Başlık: "İstek Listesi ({n})". **"Paylaş / Share" Switch `#public-wishlist` — dokununca anında kaydolur** (toast
  "İstek listesi artik paylaşiliyor" / "…artik paylaşilmiyor").
- "Ürün Ekle / Add Item" → ürün seçici diyaloğu → ürüne tıkla → **anında eklenir** ("Ürün istek listesine eklendi").
- Ürün kartındaki kaldır → "Ürünü Kaldır" diyaloğu → "Kaldır / Remove" ("Ürün istek listesinden kaldırildi").

### Adresler (en çok 5)
- "Adresler ({n})", "Adres Ekle / Add Address" (5 adreste pasif; "En fazla 5 adres eklenebilir").
- Kart: tip rozeti (Teslimat/Fatura), "Varsayılan" rozeti, kalem (düzenle), çöp kutusu (sil).
- Diyalog "Yeni Adres Ekle" / "Adresi Düzenle":

| Label (tr / en) | Kontrol | Zorunlu | Not |
|---|---|---|---|
| Adres Türü / Address Type | shadcn Select | — | Teslimat (vars.) / Fatura |
| Varsayılan olarak ayarla / Set as default | checkbox `#isDefault` | — | |
| Ad / First Name *, Soyad / Last Name * | Input | evet | "Bu alan zorunludur" |
| Şirket / Company | Input | hayır | |
| Adres Satırı 1 * / Adres Satırı 2 | Input | 1 evet | |
| Ülke / Country * | combobox | evet | Yalnız **Türkiye** seçilebilir (varsayılan) |
| İl / Province * | combobox (placeholder "İl seçin") | evet | |
| İlçe / District * | combobox (placeholder "İlçe seçin") | evet | il seçilmeden pasif |
| Posta kodu / Postal code * | Input | evet | "Lütfen geçerli bir posta kodu girin" |
| Telefon / Phone | telefon girişi | hayır (doğrulanmadı) | |
Butonlar: "İptal", "Adres Ekle" / "Değişiklikleri Kaydet". Toast: "Adres başarıyla eklendi / güncellendi / silindi".
Silme diyaloğu: "Adresi Sil" ("Bu adresi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.").
- Eski bir adres düzenlenmek üzere açıldığında ilçe listeyle eşleşmezse "İlçe eşleşmedi — lütfen listeden seçin" ya da
  "Lütfen ilçenizi listeden seçerek doğrulayın" bildirimi çıkar; ilçeyi listeden yeniden seç.
- "Bu kayıtlı adres, adres güncellememizden önce oluşturulmuş. Düzenlemek veya silmek için lütfen yeniden ekleyin."
  mesajı çıkarsa: adresi yeni olarak ekle, sonra kullanıcıya eskisinin durumunu bildir.

### Tercihler (iletişim tercihleri)
Kartlar: "E-posta Tercihleri" (Pazarlama E-postaları; İşlem E-postaları), "SMS Tercihleri" (Pazarlama SMS; İşlem SMS),
"Diğer Kanallar" (Anlık Bildirimler; Telefon Pazarlama; Posta ile Pazarlama). Her satır bir Switch; **Switch'ler tek
başına kaydetmez**, en alttaki **"Tercihleri Kaydet / Save Preferences"** hepsini birlikte yazar (toast "İletişim
tercihleri kaydedildi"). "İletişim Geçmişi" kartı (geri dönüş, şikayet, abonelik iptali, son e-posta) ve varsa
"Engellenen Kanallar" salt okunur.

### Gizlilik ve KVKK
- **Onay Durumu** (salt okunur): Kullanım Koşulları, Gizlilik Politikası (tarih + sürüm), Pazarlama Onayı (geri
  çekildiyse "{tarih} tarihinde geri çekildi"). Admin bu onayları değiştiremez.
- **Veri Aktarımı (KVKK Madde 11)** — **kişisel veri dışa aktarma**: "Veri Aktarımı Talep Et / Request Data Export" →
  diyalog "Müşteri Verilerini Dışa Aktar": format (JSON / CSV düğmesi), "Dışa Aktarıma Dahil Et": Sipariş Geçmişi
  (`#includeOrders`, açık), Ürün Etkileşimleri (`#includeInteractions`, açık), Müşteri Notları (yalnızca dahili
  olmayanlar) (`#includeNotes`, kapalı) → "Verileri Dışa Aktar". Dosya tarayıcıya indirilir; toast "Müşteri verileri
  dışa aktarıldı".
- **Veri Silme (KVKK Madde 7)** — uyarı "Uyarı: Bu işlemler geri alınamaz":
  - **"Verileri Anonimleştir / Anonymize Data"** → diyalog "Müşteri Verilerini Anonimleştir": "Anonimleştirme nedeni *"
    (Textarea, **≥10 karakter**), "Müşteri e-postasını onaylayın *" (müşterinin e-postası **aynen**) → "Verileri
    Anonimleştir". Sonuç: ad/e-posta anonim değerlerle değişir; telefon, doğum tarihi, şirket, adresler, notlar,
    etiketler silinir; sipariş geçmişi analiz için kalır. Toast "Müşteri verileri anonimleştirildi", listeye döner.
  - **"Tüm Verileri Sil / Delete All Data"** → diyalog "Tüm Müşteri Verilerini Sil" ("…kalıcı olarak silecektir. Bu
    işlem geri alınamaz."): "Silme nedeni *" (≥10), e-posta onayı (ipucu: `Onaylamak için "{email}" yazın`) →
    "Kalıcı Olarak Sil / Delete Permanently". Toast "Müşteri verileri silindi", listeye döner.
  - E-posta eşleşmezse "E-posta uyuşmuyor"; buton gerekçe ≥10 ve e-posta eşleşmeden aktifleşmez.
  - Yetki yoksa: "Müşteri silme/anonimleştirme için yetkiniz yok."
- **Veri Saklama** (salt okunur): Hesap Oluşturulma, Son Güncelleme, Son Aktivite, varsa Silinme Tarihi + sebep.

## Aksiyonlar (başlık)
| Buton | Ne olur | Toast |
|---|---|---|
| Avatar'a tıkla → dosya seç | Fotoğraf **anında** yüklenir ve profile kaydolur | "Profil fotoğrafı güncellendi" / "…güncellenemedi" |
| Hesabı Aktive Et | Müşteriye **hesap aktivasyon (şifre belirleme) daveti e-postası** gider; buton "Davet Gönderildi" olur | "Hesap aktivasyon daveti başarıyla gönderildi"; ~1 dk içinde tekrar: "Çok fazla deneme…"; hesabı varsa "Bu müşterinin zaten aktif bir hesabı var." |
| Doğrulama Maili Gönder | Müşteriye **e-posta doğrulama e-postası** gider | "Doğrulama maili başarıyla gönderildi"; zaten doğrulanmışsa "Bu müşterinin e-posta adresi zaten doğrulanmış." |
| Sil → "Müşteriyi Sil" diyaloğu ("Bu müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.") → "Sil" | Müşteri silinir, listeye döner | başarı toast'ı (metni doğrulanmadı); hata "Müşteri silinemedi…" |

**Hesabı pasifleştirme / engelleme:** ayrı buton yok. "Düzenle" → "Müşteri Durumu" = Pasif ya da Engellendi →
"Değişiklikleri Kaydet" ([customer-create.md](customer-create.md) düzenleme bölümü). Silmeye göre geri alınabilir
olduğundan, kullanıcı "müşteriyi kapat/dondur" dediğinde önce bunu öner. Engellendi'nin vitrinde giriş/siparişe
etkisi doğrulanmadı.

## Onay zamanlaması (kural 2/5/6)
| Aksiyon | Tür | Onay |
|---|---|---|
| Avatar yükleme | **Anında kayıt**, diyalogsuz | Dosyayı seçmeden **önce** onay; dosya yalnız kullanıcının verdiği yoldan (`browser_file_upload`) |
| İstek listesi "Paylaş" Switch, "Ürün Ekle" seçimi | **Anında kayıt** | Dokunmadan önce onay |
| Hesabı Aktive Et / Doğrulama Maili Gönder | **Müşteriye e-posta gönderir** | Özet: alıcı (maskeli e-posta), e-posta türü → onay |
| Not ekle / sil, adres ekle / düzenle / sil, Tercihleri Kaydet | Kalıcı | Özet + onay; adres/not silme ayrı onay. "Müşteriye Görünür" not ve pazarlama tercihlerini açmak özetinde vurgulanır |
| Veri Aktarımı (dışa aktarma) | Kişisel veriyi dosyaya indirir | Yalnız kullanıcı açıkça isterse; dosya kullanıcının bilgisayarına iner, Claude içeriğini okumaz/aktarmaz |
| **Verileri Anonimleştir / Tüm Verileri Sil** | **Geri alınamaz** | Ayrı ve tek tek onay: "1 müşteri, {ad}, {maskeli e-posta}, {n} sipariş; işlem geri alınamaz". Gerekçe metnini kullanıcıdan al; e-posta onay alanını kullanıcının onayından sonra doldur. Öncesinde dışa aktarma isteyip istemediğini sor |
| Başlıktaki Sil | Geri alınamaz | Ayrı onay (bkz. [customers-list.md](customers-list.md)) |

## Yan etkiler
- Davet e-postası müşteriye mağaza URL'sine yönlenen şifre belirleme bağlantısı içerir; müşteri şifresini belirleyince
  hesap aktif olur ve buton kaybolur.
- Pazarlama tercihlerini kapatmak kampanya alıcılarını etkiler; açmak, müşteriye pazarlama e-postası/SMS
  gönderilmesine yol açar → yalnız müşterinin izni varsa.
- Anonimleştirme/silme sonrası müşteri segmentlerden ve kampanya hedeflerinden düşer (doğrulanmadı).
- Profil fotoğrafı medya kütüphanesine de düşebilir (doğrulanmadı).

## Tuzaklar
- Sekme tetikleyicileri dar ekranda yalnız simgedir; `role=tab` + aria-label ("Notlar", "Adresler"…) ile seç.
- Tercihler sekmesinde Switch değiştirip "Tercihleri Kaydet"e basmadan sekmeden çıkmak değişikliği kaybeder.
- Anonimleştir ve Tüm Verileri Sil diyaloglarında e-posta **tam** eşleşmeli; boşluk bırakma.
- Başlıktaki "Sil" ile KVKK "Tüm Verileri Sil" ayrı butonlardır; kullanıcının talebini netleştir (hesabı kaldırmak mı,
  KVKK silme talebi mi).
- Silme/anonimleştirme sonrası sayfa listeye döner; aynı detay URL'si açılamaz.

## Doğrulama
- Not/adres/istek listesi: toast + sekmedeki kart/sayı (ör. "Adresler (2)").
- Tercihler: sayfayı yenile, Switch'lerin kayıtlı değeri.
- Davet: buton "Davet Gönderildi" + tarih; Aktivite sekmesinde "E-postalar" filtresi (doğrulanmadı).
- Anonimleştirme: listede eski e-postayla arama sonuç vermez.
