# Etkileşimler — liste ve detay (CRM Interactions)
- URL'ler:
  - Liste: {ADMIN_URL}/customers/crm/interactions
  - Detay: {ADMIN_URL}/customers/crm/interactions/{id}
- Menü yolu: **Sol menüde öğesi yok**; doğrudan URL ile açılır.
- Sayfa başlığı: "Etkileşimler / Interactions"; açıklama "Aktivite zaman çizelgesi ve müşteri etkileşimleri".
- Amaç: Müşteriyle yaşanan temasları (telefon araması, sohbet, destek talebi, e-posta açılması, sipariş, ödeme…) **kayıt olarak** tutmak ve kanal/tür dağılımını görmek.
- **E-posta/SMS göndermez.** "Etkileşim Kaydet" yalnız olmuş bir teması deftere yazar; müşteriye hiçbir mesaj gitmez. "E-posta", "SMS" gibi türler yalnız etikettir.
- Entity: [../../../entities/crm-interaction.md](../../../entities/crm-interaction.md). İlgili: kişi zaman tüneli [contacts.md](contacts.md), müşteri [../customer-detail.md](../customer-detail.md).
- Yetki: sunucu `crm:interactions:read` (liste/detay/istatistik), `crm:interactions:write` (kaydet). `admin` / `super_admin` rollerinde var.
- Plan: CRM, Rise ve üstü planlarda listelenen plan özelliğidir (`crm`).

## Ön koşullar ve bağımlılıklar
- **Müşteri ID'si** zorunlu (müşteri detay başlığındaki "Müşteri ID: …"). Etkileşim kişiye değil müşteri ID'sine bağlanır; aynı müşteri ID'sine bağlı CRM kişisinin detayındaki "Zaman Tüneli" istatistikleri bu kayıtlardan beslenir.

## Yerleşim
### Liste
1. Başlık + açıklama; sağda "Etkileşim Kaydet / Log Interaction".
2. İstatistik kartları: "Toplam Etkileşim" ("Tüm zamanlar"), "Son 7 Gün", "Son 30 Gün", "Müşteri Basina Ort. / Avg per Customer".
3. Analitik: "Kanal Dağılımi / Channel Distribution", "Tur Dağılımi / Type Distribution" çubuk grafikleri (seçili tarih aralığına göre); boşsa "Veri bulunamadı".
4. Filtreler: "Müşteri ID ile ara... / Search by Customer ID...", "Tüm Kanallar" Select, "Tüm Türler" Select, "Başlangıç Tarihi" / "Bitiş Tarihi" (date, aria-label ile). Aktif filtre rozetleri + "Tümünü temizle".
5. Tablo: "Tur / Type" (renkli rozet), "Kanal / Channel", "Konu / Subject", "Müşteri / Customer" (müşteri ID), "Öncelik / Priority", "Tarih / Date", "Kaynak / Source". **Satıra tıklamak** detayı açar. Sayfa başına 15.
6. Boş durum: "Etkileşim bulunamadı" + "Etkileşimler kaydedildikce burada görünecek".

### Detay (salt okunur)
- Geri "Etkileşimlere Don / Back to Interactions". Düzenleme ve silme butonu **yoktur**.
- Kartlar: "Temel Bilgiler" (Tür, Kanal, Konu, Açıklama, Öncelik, Gerçekleşme Zamanı, Oluşturulma Zamanı, Kaynak), "Müşteri" (müşteri ID — tıklanınca müşteri detayına gider; Atanan Kişi), "Görünürlük" ("Müşteriye Görünür", "Sadece Dahili"), "Bağlam" (oturum, cihaz, konum, yönlendiren, kampanya parametreleri — genelde sistem kaynaklı kayıtlarda dolu), "Veri" (süre, sonuç, hata kodu), "Analitik", "İlişkili Bilgiler", "Etiketler", "Özel Alanlar".

## Alanlar
### "Etkileşim Kaydet / Log Interaction" diyaloğu
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Müşteri ID * / Customer ID * | Input | evet | — | `#interaction-customerId` | |
| Etkileşim Türü * / Interaction Type * | Select | evet | "Telefon Aramasi / Phone Call" | label "Etkileşim Türü" | 32 tür: Web Sitesi Ziyareti, E-posta Acildi/Tıklandı/Geri Dondu, Abonelik İptali, SMS Gönderildi/Teslim Edildi/Başarısız, Telefon Aramasi, Sohbet Oturumu, Destek Talebi, Sipariş Verildi/Güncellendi, Ödeme Tamamlandı/Başarısız, Ürün Görüntülemesi/Aramasi, Sepete Ekleme/Çıkarma, Sepet Terk, Ödeme Başlangıcı/Tamamlandı, Yorum Gönderildi, Anket Yaniti, Sadakat Kazanildi/Kullanıldı, Referans Yapıldı, Sosyal Paylaşım, API Cagrisi, Uygulama Acildi, Push Bildirim, Özel |
| Kanal * / Channel * | Select | evet | "Telefon / Phone" | label "Kanal" | Web Sitesi, Mobil Uygulama, E-posta, SMS, Telefon, Sohbet, Sosyal Medya, Destek, API, Yönetici, Sistem, Üçüncü Taraf |
| Konu / Subject | Input | hayır | ≤255 | `#interaction-subject` | |
| Açıklama / Description | Textarea | hayır | ≤2000 | `#interaction-description` | |
| Öncelik / Priority | Select | — | "Orta / Medium" | label "Öncelik" | Kritik, Yüksek, Orta, Düşük, Bilgi |
| Müşteriye görünur / Visible to customer | Checkbox | — | açık | `#interaction-isVisible` | "Müşteri bu etkileşimi gorebilir"; müşterinin bunu nerede gördüğü doğrulanmadı — açık bırakmadan önce kullanıcıya sor |
| Dahili not / Internal note | Checkbox | — | kapalı | `#interaction-isInternal` | "Sadece personel gorebilir" |
- Gerçekleşme zamanı diyalogda seçilmez: kayıt anı kullanılır. Geçmişteki bir görüşmeyi tarihle girmek gerekiyorsa tarihi Açıklama'ya yaz.
- Zorunlu alan eksikse hata toast'ı.
- Butonlar: "İptal", "Etkileşim Kaydet".

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Etkileşim Kaydet → diyalog → Etkileşim Kaydet | Kayıt oluşur; liste, istatistikler, dağılımlar yenilenir | "Etkileşim başarıyla kaydedildi"; hata "Etkileşim kaydedilemedi. Lütfen tekrar deneyin." |
| Satır tıklama | Detay sayfası | — |
| Detayda müşteri ID | Müşteri detayına gider | — |

## Onay zamanlaması (kural 2/5/6)
- "Etkileşim Kaydet" kalıcı kayıttır → özet (müşteri ID, tür, kanal, konu, görünürlük) + onay.
- Ekrandan düzenleme/silme yapılamaz: yanlış kayıt ekranda düzeltilemez. Bu yüzden özeti dikkatle doğrulat.
- Müşteriye e-posta/SMS/bildirim **gönderilmez**; dış sisteme yazım yok.
- Kişisel veri (müşteri ID ile ilişkilendirilmiş temas geçmişi) içerir; dışa aktarma aksiyonu yok.

## Yan etkiler
- Etkileşim istatistikleri (toplam, 7/30 gün, müşteri başına ortalama) ve kanal/tür grafiklerine eklenir.
- Aynı müşteri ID'sine bağlı CRM kişisinin detayındaki etkileşim istatistiklerine yansır (doğrulanmadı).

## Tuzaklar
- Kullanıcı "müşteriye e-posta at" diyorsa bu ekran değildir — yalnız kayıt tutar. Gönderim için pazarlama/e-posta ekranlarını öner.
- Menüde yok; URL ile aç.
- "Müşteriye görünür" varsayılan açık — dahili not ise kapat ve "Dahili not"u işaretle.
- Tür listesi uzun; Select açılınca seçeneği tam metniyle tıkla (ör. "Telefon Aramasi / Phone Call").

## Doğrulama
1. Toast.
2. Listede "Müşteri ID ile ara" → yeni satır en üstte: tür, kanal, konu, tarih.
3. Satırı açıp detaydaki alanları karşılaştır.
