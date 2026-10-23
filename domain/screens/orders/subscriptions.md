# Abonelikler (Subscriptions) — liste + detay

- Entity: [../../entities/subscription.md](../../entities/subscription.md).
- Kişisel veri: **evet** (müşteri adı, e-posta). Kart bilgisi yalnız maskeli (•••• son 4 hane) görünür; tam kart bilgisi
  hiçbir ekranda yoktur — Claude kart bilgisini sohbete taşımaz.
- Abonelik admin panelinden **oluşturulmaz/düzenlenmez**; tek yazma işlemleri "Dönem sonunda iptal et" ve "İptali
  geri al".

## 1. Liste — `/subscriptions`
- URL: {ADMIN_URL}/subscriptions
- Menü yolu: Sol menü "Siparişler / Orders" → "Abonelikler / Subscriptions".
- Sayfa başlığı: "Abonelikler / Subscriptions" + toplam; açıklama "Müşterilerinizin otomatik olarak faturalandırıldığı
  tekrarlayan abonelikler."
- Yetki: `payment:subscription:read`. Salt okunur.

### Yerleşim
- Filtreler: arama, "Durum" çoklu seçim menüsü, "İptal bekliyor" anahtarı; filtre etiketleri ve "Tümünü temizle".
- Tablo: "Müşteri" (+ "Misafir" rozeti), "Ürün" (× adet), "Durum", "Dönem başı tutar", "Sonraki yenileme" (iptal
  planlıysa "{tarih} tarihinde sona eriyor"), "Oluşturulma". Satıra tıklayınca detay. Sayfa başına 20.
- Boş: "Henüz abonelik yok" — "Bir müşteri tekrarlayan bir ürüne kaydolduğunda abonelikler burada görünür."
  Filtreliyken "Filtrelerinize uyan abonelik yok".

### Alanlar (filtreler)
| Label (tr / en) | Kontrol tipi | Locator ipucu | Not |
|---|---|---|---|
| Müşteri e-postasına göre ara / Search by customer email | Input | aria-label "Abonelikleri ara / Search subscriptions" | Etiket: Arama: "…" |
| Durum / Status | Buton → onay kutulu menü (çoklu) | buton adı "Durum" | Deneme, Aktif, Ödemesi gecikmiş, İptal edildi, Süresi doldu |
| İptal bekliyor / Cancel pending | Switch | label | Dönem sonunda iptal planlananlar |

### Aksiyonlar
- Satıra tıklama → detay. Kalıcı aksiyon yok.

## 2. Detay — `/subscriptions/<id>`
- URL: {ADMIN_URL}/subscriptions/<id>
- Başlık: ürün adı + durum rozeti; altında oluşturulma tarihi; geri ok (aria-label "Aboneliklere dön").
- Yetki: görüntüleme `payment:subscription:read`; iptal/geri alma `payment:subscription:manage` (yoksa butonlar görünmez).

### Yerleşim
1. Sağ üst: "Dönem sonunda iptal et / Cancel at period end" veya "İptali geri al / Undo cancellation" (koşullu).
2. "Plan" kartı: ürün linki, dönem tutarı + aralık ("Her ay"), deneme süresi, "Mevcut dönem", "Sonraki deneme",
   "Deneme süresi bitiyor"; iptal bilgileri ("Dönem sonunda iptal edilecek", "{tarih} tarihinde iptal edildi", "İptal
   eden: Müşteri/Yönetici/Sistem", "{tarih} tarihinde sona erdi"); "Kayıt siparişi" linki → [order-detail.md](order-detail.md).
3. "Yenileme geçmişi" tablosu: Dönem, Durum (Bekliyor / Başarılı / Başarısız / Sonuç bilinmiyor), Deneme sayısı,
   Sonraki yeniden deneme, Hata ("Ödeme başarısız"), Sipariş ("Siparişi görüntüle"). Boş: "Henüz yenileme yok".
4. "Müşteri" kartı: ad (veya "İletişim bilgileri gösterilmiyor"), "Misafir", e-posta, "Müşteriyi görüntüle" →
   [../customers/customer-detail.md](../customers/customer-detail.md).
5. "Ödeme yöntemi" kartı: "•••• {son4}", "Son kullanma {ay}/{yıl}" veya "Kart bilgisi gösterilmiyor".

### Aksiyonlar
| Buton | Görünür | Diyalog | Sonuç | Toast |
|---|---|---|---|---|
| Dönem sonunda iptal et | Durum son durum değil ve iptal planlı değil | "Bu abonelik iptal edilsin mi?" — "Müşteri {tarih} tarihine kadar erişimini sürdürür. Bu tarihten sonra faturalandırma durur ve abonelik sona erer." → "Aboneliği iptal et" / "Aboneliği koru" | İptal planlanır (İptal eden: Yönetici) | "Bu abonelik {tarih} tarihinde iptal edilecek" |
| İptali geri al | İptali yönetici planlamış ve dönem bitmemiş | "Bu iptal geri alınsın mı?" — "Faturalandırma normal şekilde devam eder…" → "İptali geri al" / "Vazgeç" | Plan kaldırılır | "İptal geri alındı" |
Hatalar: "Bu abonelik zaten iptal edildi.", "Bu aboneliğin iptali planlanmamış.", "Mevcut dönem zaten sona erdi, bu yüzden
geri alınamaz.", "Bu iptal müşteri tarafından yapıldı, bu yüzden yalnızca müşteri geri alabilir.", "Bu abonelik az önce
başka bir yerden değiştirildi — bilgiler yenileniyor."

## Onay zamanlaması (kural 2/5)
- "Dönem sonunda iptal et": kalıcı; özet: müşteri, ürün, dönem tutarı, **bitiş tarihi** (mevcut dönem sonu), "bu
  tarihten sonra yenileme ve tahsilat durur". Dönem bitene kadar "İptali geri al" ile geri alınabilir; dönem bitince
  geri alınamaz → kural 5 kapsamında tek tek onay.
- "İptali geri al": kalıcı; özet: bir sonraki yenileme tarihinde **müşteriden yeniden tahsilat yapılacağı**.
- İkisi de diyalogla kaydeder (diyalogsuz kontrol yok). Müşteriye e-posta gönderildiği **doğrulanmadı**; ödeme
  sağlayıcısına anında bir yazma yapılmaz (tahsilat yenileme zamanında olur).

## Yan etkiler
- İptal planlanan abonelik dönem sonunda "İptal edildi"/sona erdi olur; yeni yenileme siparişi oluşmaz.
- Başarılı her yenileme, kaynak "Abonelik" olan yeni bir sipariş üretir ([orders-list.md](orders-list.md) kaynak filtresi).

## Tuzaklar
- Müşterinin yaptığı iptali yönetici geri alamaz (yalnız müşteri).
- İptal **anında değil**, dönem sonunda; "hemen durdur" istenirse kullanıcıya bu ekranın bunu sunmadığını söyle.
- Son durumdaki (İptal edildi / Süresi doldu) abonelikte buton görünmez.

## Doğrulama
1. Toast; Plan kartında "Dönem sonunda iptal edilecek" rozeti ve "İptal eden: Yönetici" satırı (geri almada kaybolur).
2. Listede "İptal bekliyor" anahtarıyla süz → abonelik görünür; "Sonraki yenileme" sütununda "… sona eriyor".
