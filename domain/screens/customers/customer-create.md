# Müşteri Oluştur / Müşteriyi Düzenle
- URL'ler: {ADMIN_URL}/customers/new (oluştur) · {ADMIN_URL}/customers/{id}/edit (düzenle)
- Menü yolu: "Müşteriler → Tüm Müşteriler" → "Müşteri Oluştur / Create Customer"; düzenleme için liste ⋯ →
  "Müşteriyi Düzenle" ya da detay başlığındaki "Düzenle / Edit".
- Sayfa başlığı: "Müşteri Oluştur / Create Customer" ("Mağazanıza yeni bir müşteri ekleyin"); düzenlemede
  "Müşteriyi Düzenle / Edit Customer".
- Amaç: Admin'den müşteri kaydı açmak (bireysel/kurumsal, fatura bilgileri, ilk adres) ve mevcut müşterinin profil,
  durum, işaret, yerelleştirme ve etiket bilgilerini düzenlemek.
- Entity: [../../entities/customer.md](../../entities/customer.md). Playbook:
  [../../../playbooks/customer-create.md](../../../playbooks/customer-create.md).
- Yetki: `customers:write`.
- **Kişisel veri girilir** (ad, e-posta, telefon, TC kimlik / VKN, doğum tarihi, adres). Değerler yalnız kullanıcının
  verdiği bilgilerden gelir; Claude uydurmaz, test verisi prod'a girmez.

## Ön koşullar ve bağımlılıklar
- Ön koşul yok. Adres girilecekse il/ilçe listeleri ekranda yüklenir.
- **Bu ekranda olmayanlar** (kullanıcı isterse ayrı adım): müşteri grubu ataması (arayüzde yok — bkz.
  [customer-groups.md](customer-groups.md)), segment üyeliği (dinamik segment kurallarla hesaplar —
  [segments.md](segments.md)), pazarlama/KVKK onayları (müşterinin kendisi verir; admin yalnız iletişim tercihlerini
  ayarlar → [customer-detail.md](customer-detail.md) Tercihler), notlar, ikinci ve sonraki adresler (detay → Adresler).
- Mağaza URL'si (Ayarlar → Genel) davet/doğrulama e-postası için gerekir; kayıt için gerekmez.

## Yerleşim — Oluştur (`/customers/new`)
Kart içinde 3 sekme; hata olan sekmede kırmızı sayı rozeti (yalnız kayıt denemesinden sonra). Altta yapışkan footer:
"Kaydedilmemiş değişiklikleriniz var" notu, "İptal / Cancel", **"Müşteri Oluştur / Create Customer"** (submit).
Kayıt denemesinde hata varsa formun altında "Kaydetmeden önce {n} hatayı düzeltin" kutusu; her satır ilgili sekmeye
götüren bağlantıdır.

1. **Temel Bilgiler / Basic Info**
2. **Profil / Profile**
3. **Adres / Address** — üstte "Varsayılan adres ekleyin. Atlayıp sonra ekleyebilirsiniz."

## Alanlar — Oluştur
| Sekme | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Temel | Müşteri Tipi / Customer Type | iki buton "Bireysel / Individual", "Kurumsal / Corporate" | — | Bireysel | rol button, ad "Bireysel"/"Kurumsal" | Tip değişince diğer tipin vergi alanları temizlenir |
| Temel | E-posta / Email * | Input email | evet | geçerli e-posta ("Lütfen geçerli bir e-posta adresi girin") | placeholder "müşteri@örnek.com" | Mağazada tekil |
| Temel | Ad / First Name * | Input | evet | 1–50 ("Lütfen bir ad girin") | placeholder "Ahmet" | |
| Temel | Soyad / Last Name * | Input | evet | 1–50 | placeholder "Yılmaz" | |
| Temel | Telefon / Phone | telefon girişi (ülke kodlu) | hayır | ≤20 | placeholder "+90 (555) 123 4567" | |
| Temel (Bireysel) | TC Kimlik No / Turkish ID Number | Input, en çok 11 | hayır | doluysa tam 11 hane | placeholder "11 haneli TC Kimlik No" | Turuncu not: "Fatura kesmek için TC Kimlik No gereklidir" |
| Temel (Kurumsal) | Şirket / Company * | Input | evet | ≤100 ("Kurumsal müşteriler için firma adı zorunludur") | placeholder "ABC Ltd." | |
| Temel (Kurumsal) | Vergi Kimlik No / Tax ID Number * | Input, en çok 10 | evet | tam 10 hane | placeholder "10 haneli Vergi Kimlik No" | |
| Temel (Kurumsal) | Vergi Dairesi / Tax Office * | Input | evet | ≤100 | placeholder "Vergi dairesi adını girin" | |
| Temel (Kurumsal) | MERSIS No / MERSIS Number | Input, en çok 16 | hayır | doluysa tam 16 hane | placeholder "16 haneli MERSIS numarası" | |
| Profil (Bireysel) | Şirket / Company | Input | hayır | ≤100 | | Kurumsalda Temel sekmesinde |
| Profil | Unvan / Job Title | Input | hayır | ≤100 | placeholder "Ürün Yöneticisi" | |
| Profil | Doğum Tarihi / Date of Birth | Input date | hayır | — | `input[type=date]` | `YYYY-AA-GG` |
| Profil | Cinsiyet / Gender | shadcn Select | hayır | — | placeholder "Cinsiyet seçin" | Erkek, Kadın, Diğer, Belirtmek istemiyorum |
| Profil | VIP | Switch | — | kapalı | label "VIP" | "Özel muamele için VIP olarak işaretle" |
| Profil | Influencer | Switch | — | kapalı | label "Influencer" | "Sosyal medya influencer'ı" |
| Profil | Etiketler / Tags | Input + "Ekle / Add" | — | aynı etiket iki kez eklenmez | placeholder "Etiket ekle..." | Etiket kutusunda Enter yalnız etiketi ekler, formu göndermez. Rozetteki × kaldırır |
| Adres | Teslimat Adresi / Shipping Address (adres tipi) | shadcn Select | hayır | boşsa Teslimat | placeholder "Tip seçin" | Teslimat / Fatura |
| Adres | Adres Satırı 1 / Address Line 1 | Input | adres girilecekse evet | ≤200 | placeholder "Atatürk Caddesi No: 123" | **Boş bırakılırsa adres hiç kaydedilmez** |
| Adres | Adres Satırı 2 / Address Line 2 | Input | hayır | ≤200 | placeholder "Daire 4B" | |
| Adres | Ülke / Country | arama kutulu combobox | adres varsa evet | — | placeholder "Ülke seçin" | Ülke değişince il/ilçe sıfırlanır |
| Adres | İl/Bölge / State/Province | combobox (TR) / Input (diğer) | adres varsa evet | ≤100 | placeholder "İstanbul" | Listeden seç |
| Adres | İlçe / District | combobox | TR'de adres varsa evet | — | placeholder "İlçe seçin" | İl seçilmeden pasif |
| Adres | Şehir / City | Input | ülkeye göre | ≤100 | placeholder "İstanbul" | TR'de görünmez; il ile aynı kabul edilir (doğrulanmadı) |
| Adres | Posta Kodu / Postal Code | Input | adres varsa evet | ≤20 | placeholder "34000" | |
Adres kaydının ad/soyadı müşterinin adından alınır. Adres Satırı 1 dolu ama il/posta kodu boşsa kayıt sunucuda
reddedilir → hata toast'ı; eksikleri doldur.

## Yerleşim ve alanlar — Düzenle (`/customers/{id}/edit`)
Üstte "← Müşteriye Dön / Back to Customer", sağda "İptal" ve **"Değişiklikleri Kaydet / Save Changes"**. 4 kart:

| Kart | Label (tr / en) | Kontrol | Zorunlu | Not |
|---|---|---|---|---|
| Temel Bilgiler / Basic Information | Ad *, Soyad *, E-posta *, Telefon, Şirket, İş Unvanı / Job Title, Dogum Tarihi, Cinsiyet | Input / Select | ad, soyad, e-posta | Müşteri tipi, TC/VKN/vergi dairesi/MERSİS ve adresler burada **düzenlenmez** |
| Durum ve İşaretler / Status & Flags | Müşteri Durumu / Customer Status | shadcn Select | — | Aktif, Pasif, Engellendi, Ayrılan, Potansiyel |
| | VIP Müşteri, Influencer, Satış Ortağı / Affiliate Partner | Switch | — | Satış Ortağı açılınca "Satış Ortağı Kodu / Affiliate Code" (≤50, placeholder "AFFILIATE123") |
| Yerelleştirme / Localization | Dil / Language, Para Birimi / Currency, Saat Dilimi / Timezone | shadcn Select | — | Dil: İngilizce, Türkçe, Almanca, Fransızca, İspanyolca. Para birimi: USD, EUR, TRY, GBP. Saat dilimi: UTC, Doğu, Pasifik, Londra, İstanbul, Berlin |
| Etiketler / Tags | Etiket ekle + "Ekle" | Input + buton | — | boşken "Henüz etiket eklenmedi" |

## Aksiyonlar
| Buton | Ne olur | Toast / sonuç |
|---|---|---|
| Müşteri Oluştur (oluştur) | Müşteri (+ doldurulduysa 1 adres) oluşur, `/customers` listesine döner | "Müşteri başarıyla oluşturuldu"; validasyonda "Lütfen aşağıdaki hataları düzeltin" + ilk hatalı sekmeye geçer; e-posta mükerrerse sunucu mesajı "Customer with this email already exists" |
| İptal (oluştur) | Değişiklik varsa "Kaydedilmemiş değişiklikleriniz var…" diyaloğu → "Onayla / Confirm" listeye döner (veri kaybolur) | — |
| Değişiklikleri Kaydet (düzenle) | Profil güncellenir, `/customers/{id}` detayına döner | Başarı toast'ı **yok**; doğrulama yönlendirme + detay değerleriyle. Başarısızlıkta sayfada kalır |
| İptal (düzenle) | Detaya döner, değişiklik kaydedilmez | — |

## Onay zamanlaması (kural 2/5/6)
- **Müşteri Oluştur** kalıcı → özet + onay. Özette: ortam, tip, ad soyad, e-posta, telefon, TC/VKN (maskeli göster),
  adres (il/ilçe), VIP/Influencer, etiketler, **yan etki: hoş geldin e-postası** (aşağıda).
- **Değişiklikleri Kaydet** kalıcı → yalnız değişen alanların eski → yeni tablosu + onay.
- Durumu **Engellendi** yapmak ya da e-postayı değiştirmek müşteriyi doğrudan etkiler → özetinde ayrıca vurgula
  (Engellendi'nin vitrinde girişe/siparişe etkisi doğrulanmadı).
- Bu ekranlarda diyalogsuz/anında kayıt yapan kontrol yok.

## Yan etkiler
- **Müşteriye e-posta**: Müşteri oluşturulunca, mağazada hoş geldin serisi e-posta şablonu aktifse müşteriye hemen
  **hoş geldin e-postası** gider ve seri birkaç gün sonra devam eder (doğrulanmadı: 2. ve 5. gün). Kullanıcıya özette
  söyle.
- **Şifre belirleme daveti otomatik gitmez.** Admin'den açılan müşterinin giriş hesabı yoktur; davet, detaydaki
  "Hesabı Aktive Et / Activate Account" butonuyla ayrıca gönderilir ([customer-detail.md](customer-detail.md)).
- İletişim tercihlerinin başlangıç değerleri: Pazarlama E-postaları **açık**, İşlem E-postaları açık, Pazarlama SMS
  kapalı, İşlem SMS açık (doğrulanmadı). Kullanıcının müşteriden aldığı pazarlama izni bilgisini sor; tercihleri buna
  göre Tercihler sekmesinden ayarla (ayrı onay).
- Müşteri oluşturulunca pazarlama izni olan müşteriler sadakat programına kaydedilir (admin'den açılanlarda izin kaydı
  bulunmadığından genelde uygulanmaz — doğrulanmadı).
- Dinamik segmentler yeni müşteriyi ancak bir sonraki "Yeniden Oluştur"da içerir.

## Tuzaklar
- Oluşturduktan sonra liste ekranına dönülür (detaya değil); kaydı aramayla bul.
- Müşteri tipi ve TC/VKN/vergi dairesi/MERSİS düzenleme ekranında yok; doğru girildiğinden kayıttan önce emin ol.
- Oluşturmada tek adres girilebilir; ikinci adres ve fatura+teslimat ikilisi için detay → Adresler (en çok 5).
- Doğum tarihi alanı tarayıcı tarih girişidir; değeri `YYYY-AA-GG` biçiminde doldur.
- Cinsiyet, adres tipi ve düzenlemedeki Select'ler shadcn Select'tir: tetikleyiciye tıkla → seçeneğe tıkla.
- İl/ilçe combobox: yaz → sonucu bekle → seçeneğe tıkla; Enter kullanma.

## Doğrulama
1. Toast "Müşteri başarıyla oluşturuldu" ve `/customers` listesine dönüş.
2. Listede e-postayla ara → satırı aç → detayda ad, e-posta, telefon, VIP rozeti, etiketler; Adresler sekmesinde adres.
3. Düzenlemede: yönlendirme sonrası detay başlığındaki ad/e-posta/durum rozetini ve etiketleri karşılaştır.
