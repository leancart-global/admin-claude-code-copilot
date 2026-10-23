# Müşteri Segmentleri (liste, oluştur, detay, düzenle)
- URL'ler:
  - {ADMIN_URL}/customers/segments — liste
  - {ADMIN_URL}/customers/segments/new — oluştur (segment oluşturucu)
  - {ADMIN_URL}/customers/segments/{id} — detay (Genel Bakış / Müşteriler / Analitik)
  - {ADMIN_URL}/customers/segments/{id}/edit — düzenle (ad, açıklama, durum, otomatik yenileme)
- Menü yolu: Sol menü "Müşteriler / Customers" → "Segmentler / Segments".
- Sayfa başlıkları: "Müşteri Segmentleri / Customer Segments" ("Hedefli pazarlama için müşteri segmentleri oluşturun ve
  yönetin"), "Segment Oluştur / Create Segment" ("Müşterileri otomatik olarak gruplamak için kurallar tanımlayın"),
  detayda segment adı, "Segmenti Düzenle / Edit Segment".
- Amaç: Kurallı (dinamik vb.) ya da elle (statik) müşteri segmenti tanımlamak, üye sayısını önizlemek, üyeliği
  hesaplamak ("Yeniden Oluştur"), etkinleştirmek/arşivlemek/silmek. Segmentler e-posta kampanyası ve Meta kitlesi
  hedeflemesinde kullanılır (promosyonun segment kısıtı admin ekranından kurulmaz).
- Entity: [../../entities/segment.md](../../entities/segment.md). Playbook:
  [../../../playbooks/segment-create.md](../../../playbooks/segment-create.md).
- Yetki: liste/detay/önizleme `customers:read`; oluştur, düzenle, yeniden oluştur, etkinleştir, arşivle, **sil**
  `customers:write`.
- Kişisel veri: önizleme örneklerinde ve detay → Müşteriler sekmesinde ad + e-posta görünür.

## Ön koşullar ve bağımlılıklar
- Müşteriler ([customers-list.md](customers-list.md)). Kural alanları müşteri kaydındaki ve sipariş geçmişinden
  hesaplanan değerlere bakar; etiket kuralı için müşterilere etiket verilmiş olmalı
  ([customer-create.md](customer-create.md)).
- **Etkiledikleri:** e-posta kampanyası hedeflemesi ([../marketing/campaigns.md](../marketing/campaigns.md)), Meta özel
  kitleleri ([../marketing/meta/audiences.md](../marketing/meta/audiences.md) — kitle oluşturma/yenileme üyelerin e-posta ve
  telefonunu Meta'ya gönderir; segment değişince kitle kendiliğinden güncellenmez); müşteri detayında "Atanan Segmentler"
  ([customer-detail.md](customer-detail.md)). Promosyonun segmente kısıtlanması admin ekranından kurulamaz, yalnız API ile
  gelmiş promosyonlarda görülür ([../../entities/promotion.md](../../entities/promotion.md)).

## Liste (`/customers/segments`)
- Başlık + "Segment Oluştur / Create Segment".
- Filtreler: arama (placeholder "Segment ara..."), Tür Select ("Tüm Türler", Statik, Dinamik, RFM Analizi, Davranışsal,
  Demografik), Durum Select ("Tüm Durumlar", Aktif, Pasif, Oluşturuluyor); aktif filtre rozetleri + "Filtreleri Temizle".
- Tablo: "Ad", "Tür", "Durum", "Müşteriler", "Son Oluşturma", "Oluşturulma", "İşlemler" (⋯).
- ⋯ menüsü: "Görüntüle", "Düzenle", "Yeniden Oluştur", "Devre Dışı Bırak"/"Etkinleştir", "Arşivle", "Sil" (onay
  diyaloğu "Segmenti Sil": "\"{ad}\" segmentini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.").
- Toast'lar: "Segment yeniden oluşturulmaya başlandi", "Segment etkinleştirildi"/"devre dışı bırakıldı",
  "Segment arşivlendi", "Segment başarıyla silindi"; hata karşılıkları.

## Oluştur (`/customers/segments/new`)
### Yerleşim
- Üst sağ: "İptal / Cancel" (geri), **"Segment Oluştur / Create Segment"** (kaydet).
- Sol: "Temel Bilgiler" kartı, (statik değilse) "Segment Kuralları" kartı, (statikse) "Statik Segment" bilgi kartı,
  "Otomatik Yenileme Ayarları" kartı.
- Sağ: "Önizleme" kartı ("Segmenti Önizle / Preview Segment" butonu, eşleşen müşteri sayısı, örnek müşteriler) ve
  "Özet" (Tür, Kural Grupları, Toplam Koşul, Otomatik Yenileme, Etiketler).
- Hata kutusu sayfanın üstünde (ör. "Segment adı zorunludur", "Segment oluşturulamadı. Lütfen tekrar deneyin.").

### Alanlar
| Kart | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Temel | Segment Adi / Segment Name * | Input | evet | ≤200 | `#name`, placeholder "örn., Yüksek Değerli Müşteriler" | Önizleme de ad ister ("Lütfen bir segment adı girin") |
| Temel | Açıklama / Description | Textarea | hayır | ≤1000 | `#description` | |
| Temel | Segment Türü / Segment Type | 5 kart-buton | — | Dinamik | buton metni "Dinamik", "Statik", "Davranışsal", "Demografik", "RFM Analizi" | **Sonradan değişmez** (düzenleme ekranında seçilse de kaydedilmez). Statik dışındakiler kural kullanır |
| Temel | Etiketler / Tags | Input + "Ekle" | hayır | ≤20 etiket, her biri ≤50 | placeholder "Etiket ekle..." | Etiket kutusunda Enter yalnız etiketi ekler |
| Kurallar | Grup {n} | kural grubu kutusu | ≥1 grup | ≤5 grup | metin "Grup 1" | 2. ve sonraki grupların başında grup bağlacı Select (VE/VEYA); çöp kutusu (aria-label "Sil") grubu kaldırır (tek grup kalmışsa yok) |
| Kurallar | "Koşul Ekle / Add Condition" | buton | her grupta **≥1 koşul** | grup başına ≤20 koşul | | Boş grup: "Henüz koşul yok. Başlamak için bir tane ekleyin." — boş grupla kayıt reddedilir |
| Koşul | bağlaç | shadcn Select | 2. koşuldan itibaren | VE | | VE / VEYA |
| Koşul | Alan | shadcn Select (placeholder "Alan seçin") | evet | — | | Başlıklı gruplar: "-- Müşteri Alanları --", "-- Sipariş Alanları --", "-- Olay Alanları --". Alan değişince operatör ve değer sıfırlanır. Alan listesi: [../../entities/segment.md](../../entities/segment.md) |
| Koşul | Operatör | shadcn Select | evet | alanın ilk operatörü | | Alanın tipine göre (metin: eşittir/içerir/ile başlar…; sayı/tarih: büyüktür…/arasındadır) |
| Koşul | Değer | metin / sayı / tarih Input; Evet-Hayır ve yaşam döngüsü için Select | evet | — | placeholder "Değer girin" / "Değer" | "arasındadır"da ikinci kutu ("ve"). Tutarlar mağaza para biriminde, nokta ondalık |
| Koşul | × (aria-label "Kapat / Close") | buton | | | | Koşulu kaldırır |
| Kurallar | "Kural Grubu Ekle / Add Rule Group" | buton | | | | |
| Otomatik yenileme | Otomatik Yenilemeyi Etkinleştir | Switch | — | kapalı | metin "Otomatik Yenilemeyi Etkinleştir" | Açılınca "Yenileme Sikligi" Select: Her saat, Günlük (vars.), Haftalık, Aylık |

### Önizleme
- "Segmenti Önizle" kuralları kaydetmeden çalıştırır; sonuç: "{n} Eşleşen müşteriler" + "Örnek Müşteriler" (ad,
  e-posta). Statik türde önizleme yok ("Statik segmentlerin önizlemesi yoktur.").
- Hata: "Segment önizlenemedi. Lütfen kurallarınızı kontrol edin." → kuralı kontrol et; düzelmezse dur ve kullanıcıya
  bildir (doğrulanmadı: önizlemenin canlıda tüm alanlar için çalıştığı).
- Önizleme kalıcı değildir, onay gerekmez.

## Detay (`/customers/segments/{id}`)
- Başlık: ad, tür rozeti, durum rozeti (Aktif / Pasif / Oluşturuluyor / Hata), "Arşivlendi" rozeti; "{tarih} tarihinde
  oluşturuldu", "Son oluşturma: …", "Otomatik yenileme: …".
- Butonlar: **"Yeniden Oluştur / Rebuild"**, "Düzenle / Edit", ⋯ ("İşlemler": "Devre Dışı Bırak"/"Etkinleştir",
  "Arşivle", "Sil").
- Kartlar: "Toplam Müşteri", "Etkileşim Oranı", "Son Oluşturma".
- Sekmeler: "Genel Bakış" (Segment Detayları; Yapılandırma: otomatik yenileme, sıklık, arşiv, kural grubu ve koşul
  sayısı; Etiketler; Performans Metrikleri), "Müşteriler" (üye listesi: ad, e-posta, "Görüntüle" → müşteri detayı;
  boşsa dinamikte "Segmenti Yeniden Oluştur", statikte "Müşterileri Yönet"), "Analitik" (gelir katkısı, oranlar,
  büyüme, en çok alınan ürünler; veri yoksa "Segmenti Yeniden Oluştur").
- Sil diyaloğu: "Segmenti Sil" — "\"{ad}\" segmentini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm
  müşteri ilişkileri kaldırılacaktır." → "Sil".
- Toast'lar: "Segment yeniden oluşturma başlatıldı. Bu biraz zaman alabilir.", "Segment etkinleştirildi", "Segment
  devre dışı bırakıldı", "Segment arşivlendi" (listeye döner), "Segment silindi" (listeye döner).

## Düzenle (`/customers/segments/{id}/edit`)
| Kart | Label | Kontrol | Not |
|---|---|---|---|
| Ad | Segment Adi * | Input | ≤200 |
| | Açıklama | Textarea | ≤1000 |
| Tür ve Durum | Segment Türü | kart-butonlar | Kayıtta dikkate alınmaz (tür değişmez) |
| | Durum | Switch (Aktif/Pasif) | |
| Otomatik Yenileme Ayarları | Otomatik Yenilemeyi Etkinleştir + Yenileme Sikligi | Switch + Select | |
Butonlar: "İptal", **"Kaydet / Save"**. Toast "Segment başarıyla kaydedildi" → detaya döner; hata "Değişiklikler
kaydedilemedi. Lütfen biraz sonra tekrar deneyin."
- **Kurallar bu ekranda düzenlenmez** ve statik segmente üye ekleme/çıkarma alanı bu sürümde yok. Kural değişikliği
  gerekiyorsa: yeni segment oluştur (yeni kurallarla) → yeniden oluştur → kullanıcı onayıyla eskisini arşivle/sil.

## Aksiyonlar ve onay zamanlaması (kural 2/5/6)
| Aksiyon | Ne olur | Onay |
|---|---|---|
| Segment Oluştur | Segment **Pasif, 0 üyeli** kaydolur; liste ekranına döner (toast yok) | Özet (ad, tür, kurallar okunur cümle olarak, önizleme sayısı, otomatik yenileme) + onay |
| Yeniden Oluştur (liste ⋯ / detay) | **Diyalogsuz, anında**: üyelik hesaplanır, segment Aktif olur | Tıklamadan önce onay; özette önizlemedeki tahmini üye sayısı. Segmenti hedefleyen planlanmış kampanya varsa alıcılarının değişeceğini belirt |
| Etkinleştir / Devre Dışı Bırak | **Diyalogsuz, anında** | Tıklamadan önce onay; kullanan kampanya/promosyon varsa etkisi doğrulanmadı |
| Arşivle | **Diyalogsuz, anında**; listeden düşer | Tıklamadan önce onay |
| Kaydet (düzenle) | Ad/açıklama/durum/yenileme güncellenir | Değişenler tablosu + onay |
| Sil | Geri alınamaz; tüm müşteri ilişkileri kaldırılır | Ayrı onay; özette segment adı, **üye sayısı**, kullanıldığı bilinen kampanya/promosyon/kitle (bilinmiyorsa "kontrol edilmedi"). Arşivlemenin geri alınabilir alternatif olduğunu söyle |
| Önizle | Salt okuma | Onay gerekmez |
- Bu ekranlar müşteriye e-posta göndermez. Kampanya alıcıları **gönderim anında** segmentin son oluşturulmuş üyelerinden
  hesaplanır; bu yüzden "Yeniden Oluştur", segmenti hedefleyen planlanmış kampanyanın kime gideceğini değiştirir
  ([../../entities/campaign.md](../../entities/campaign.md)).

## Yan etkiler
- Üyelik yalnız "Yeniden Oluştur" anında güncellenir; yeni müşteriler ve değişen sipariş istatistikleri bir sonraki
  oluşturmaya kadar yansımaz. Otomatik yenilemenin seçilen sıklıkta çalıştığı canlıda doğrulanmadı.
- Oluşturma sırasında (Oluşturuluyor) segment düzenlenemez ve silinemez (409).
- Kampanya gönderiminde segment üyelerinden yalnız pazarlama iznine uygun ve geçerli e-postası olanlar alıcı olur.

## Tuzaklar
- Oluşturduktan sonra segment **boştur** ve Pasif'tir; hedeflemede kullanmadan önce mutlaka "Yeniden Oluştur".
- Yeniden oluşturma 422 "Segment contains a condition that cannot be evaluated" ile dönerse durum Hata olur → hangi
  koşulun sorunlu olduğunu kullanıcıya bildir, kuralı değiştirmek için yeni segment gerekir; tahminle alan değiştirme.
- Tür ve kurallar kayıttan sonra değişmez; özeti kullanıcıyla netleştirmeden kaydetme.
- Alan/operatör/bağlaç kontrolleri shadcn Select'tir (tetikleyici → seçenek). Enter ile seçim yapma.
- Sayı alanına tutar yazarken para birimi sembolü ve binlik ayırıcı kullanma (`5000`, `1299.90`).
- Detaydaki "Müşterileri Yönet" statik segmentte düzenleme sayfasına götürür; orada üye yönetimi yok.

## Doğrulama
1. Oluşturma sonrası listede ad, tür, Durum "Pasif", Müşteriler 0.
2. Yeniden oluşturma sonrası detayda Durum "Aktif", "Toplam Müşteri" ≈ önizleme sayısı, "Son Oluşturma" şimdi;
   Müşteriler sekmesinde birkaç üyenin kuralı sağladığını müşteri detayından kontrol et.
3. Düzenleme sonrası detaydaki ad/açıklama/otomatik yenileme satırları.
