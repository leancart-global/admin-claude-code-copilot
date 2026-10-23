# Playbook: Müşteri oluştur ("bu müşteriyi sisteme gir")

Tetikleyiciler: "müşteri ekle/aç/oluştur", "şu firmayı kurumsal müşteri olarak gir", kartvizit/e-posta imzası/fatura
bilgisi yapıştırılması, "müşteriye hesap daveti gönder", "müşterinin adresini ekle".
Harita: ../domain/screens/customers/customer-create.md (alanlar, oluştur + düzenle),
../domain/screens/customers/customer-detail.md (adres, tercihler, davet, notlar),
../domain/entities/customer.md (kurallar).
URL: `{ADMIN_URL}/customers/new`.

---

## 0. Kural hatırlatması
- Kişisel veri: yalnız kullanıcının verdiği değerleri gir; eksik zorunluyu uydurma. Prod'da test müşterisi açma.
- Her kalıcı adım (müşteri kaydı, ek adres, tercih kaydı, davet e-postası, not) **ayrı özet + açık "evet"**.
- Müşteri oluşturmak müşteriye **hoş geldin e-postası** gönderebilir; davet e-postası ise ayrı bir adımdır. İkisini de
  özetde açıkça yaz.
- TC kimlik / VKN gibi değerleri özet tablosunda maskeli göster (ör. `123******01`), sohbet dışına taşıma.

## 1. İsteği çözümle → taslak alan listesi
| Bilgi | Form alanı | Zorunlu mu? | Varsayılan (sorulmazsa) |
|---|---|---|---|
| Tip | Müşteri Tipi | — | Firma adı + vergi no verildiyse **Kurumsal**, aksi **Bireysel** (özette "varsayılan") |
| E-posta | E-posta | Evet | — (sor) |
| Ad / Soyad | Ad, Soyad | Evet | Kurumsalda yetkili kişinin adı; yoksa sor |
| Telefon | Telefon | Hayır | — |
| TC Kimlik No | (Bireysel) | Hayır (fatura için gerekli) | Boş; kullanıcı fatura kesilecek diyorsa sor |
| Şirket / VKN / Vergi Dairesi | (Kurumsal) | Kurumsalda üçü de evet | — (sor) |
| MERSİS No | (Kurumsal) | Hayır | — |
| Unvan, Doğum Tarihi, Cinsiyet | Profil | Hayır | Boş |
| VIP / Influencer | Profil | — | Kapalı |
| Etiketler | Profil | — | — |
| Adres | Adres sekmesi (1 adres) | Hayır | Varsa: Adres Satırı 1 + Ülke + İl + İlçe (TR) + Posta Kodu zorunlu; tip boşsa Teslimat |
| İkinci adres / fatura adresi | detay → Adresler | — | Kayıttan sonra ayrı adım |
| Pazarlama izni | detay → Tercihler | — | **Sor**: "Müşteri pazarlama e-postası/SMS almaya izin verdi mi?" |
| Hesap daveti | detay → "Hesabı Aktive Et" | — | Gönderme; kullanıcı isterse ayrı adım |
| Müşteri grubu | — | — | Arayüzde atama yok → kullanıcıya bildir |

## 2. Ön kontroller (salt okuma)
a. `{ADMIN_URL}/customers` listesinde e-postayı ara → kayıt varsa **yeni oluşturma**; kullanıcıya mevcut kaydı göster
   ve düzenleme mi istediğini sor (e-posta mağazada tekildir).
b. Davet gönderilecekse Ayarlar → Genel'de mağaza URL'si tanımlı mı (yoksa davet gönderilemez) — kullanıcıya söyle.
c. Ortamı `config/local.json`'dan oku; özet başlığına yaz.

## 3. Plan + eksik bilgi
Kısa plan (ör. "1) Müşteri kaydı 2) Fatura adresi 3) Pazarlama tercihlerini kapat 4) Hesap daveti") ve eksik zorunlu
bilgileri **tek mesajda** sor.

## 4. Formu doldur (`/customers/new`)
1. `browser_snapshot`. **Temel Bilgiler**: tip butonu (Bireysel/Kurumsal) → E-posta → Ad → Soyad → Telefon → TC (Bireysel)
   ya da Şirket + Vergi Kimlik No + Vergi Dairesi (+ MERSİS) (Kurumsal).
2. **Profil**: Unvan, Doğum Tarihi (`YYYY-AA-GG`), Cinsiyet (Select: tetikleyici → seçenek), VIP/Influencer Switch,
   etiketler (kutuya yaz → "Ekle").
3. **Adres** (varsa): Adres tipi (Select) → Adres Satırı 1/2 → Ülke (combobox: "Türkiye" yaz → seçeneğe tıkla) → İl
   (yaz → bekle → tıkla) → İlçe (aynı) → Posta Kodu.
4. Snapshot ile sekmeleri kontrol et; alan altı hata metinlerini oku.

## 5. Özet → ONAY → Kaydet
| Alan | Değer | Kaynak |
|---|---|---|
| Ortam | prod / dev | config |
| Tip | Kurumsal | kullanıcı / varsayılan |
| Ad Soyad / E-posta / Telefon | … / a***@firma.com / … | kullanıcı |
| Vergi bilgisi | VKN 12******90, Vergi Dairesi … | kullanıcı |
| Adres | Teslimat — Kadıköy / İstanbul, 34710 | kullanıcı |
| İşaretler / Etiketler | VIP: hayır; etiket: toptan | |
| **Yan etki** | Müşteriye hoş geldin e-postası gidebilir (mağazada şablon aktifse). Şifre daveti **gitmez** | sistem |
| Sonraki adımlar | Pazarlama tercihi, davet (ayrı onaylarla) | |

Açık "evet" → footer'daki **"Müşteri Oluştur / Create Customer"**.

## 6. Doğrula
1. Toast "Müşteri başarıyla oluşturuldu" ve liste ekranına dönüş. Hata: validasyon kutusunu oku; "Customer with this
   email already exists" → adım 2a.
2. Listede e-postayla ara → detay: ad, e-posta, telefon, VIP, etiketler; Adresler sekmesi.

## 7. Takip adımları (her biri ayrı özet + onay)
- **Ek adres**: detay → "Adresler" → "Adres Ekle" → diyalog (Ad/Soyad zorunlu; Ülke yalnız Türkiye; İl → İlçe → Posta
  kodu) → "Adres Ekle". En çok 5 adres.
- **İletişim tercihleri**: detay → "Tercihler" → Switch'leri kullanıcının söylediği izne göre ayarla → **"Tercihleri
  Kaydet"** (Switch tek başına kaydetmez). Pazarlama kanallarını açmak yalnız müşterinin izni varsa.
- **Hesap daveti**: detay başlığında "Hesabı Aktive Et" → müşteriye şifre belirleme e-postası gider (özet: alıcı maskeli
  e-posta). Sonuç: buton "Davet Gönderildi" olur. ~1 dk içinde ikinci deneme reddedilir.
- **Not**: detay → "Notlar" → "Not Ekle" → kategori → "Sadece Dahili" (varsayılan; müşteriye görünür yapılacaksa
  özette vurgula) → "Notu Kaydet".
- **Sipariş** açılacaksa → ../domain/screens/orders/order-create.md.

## 8. Rapor
Müşteri linki (`{ADMIN_URL}/customers/{id}`), yapılan adımlar, gönderilen e-postalar (hoş geldin olası, davet
gönderildiyse), yapılamayanlar (ör. grup ataması arayüzde yok). Kişisel veriyi rapora tam yazma.

## Düzenleme varyantı ("müşterinin telefonunu değiştir", "müşteriyi engelle")
`{ADMIN_URL}/customers/{id}/edit` → ilgili alan → değişenler tablosu (eski → yeni) + onay → "Değişiklikleri Kaydet" →
detayda doğrula (başarı toast'ı çıkmaz). Müşteri tipi, TC/VKN ve adresler bu ekranda değişmez. "Engelle/pasifleştir"
= Müşteri Durumu → Engellendi/Pasif; silme ve KVKK silmesi için ../domain/screens/customers/customer-detail.md
(geri alınamaz, ayrı onay).
