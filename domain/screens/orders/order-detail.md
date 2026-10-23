# Sipariş Detayı (Order Detail)
- URL: {ADMIN_URL}/orders/<id>
- Menü yolu: [orders-list.md](orders-list.md) → satıra tıkla / göz ikonu; [order-create.md](order-create.md) kaydından
  sonra otomatik; müşteri, abonelik ve fatura ekranlarındaki sipariş linkleri.
- Sayfa başlığı: sipariş numarası (h1) + durum rozeti + ödeme durumu rozeti; altında oluşturulma tarihi.
- Amaç: Siparişi görüntülemek ve yaşam döngüsünü yönetmek: durum değiştirme, kargolama, teslim, iptal, tam/kısmi para
  iadesi (alacak dekontu), iade talebi (RMA), fatura / e-Fatura / iade-fark faturası, notlar, geçmiş.
- Entity: [../../entities/order.md](../../entities/order.md), [../../entities/invoice.md](../../entities/invoice.md).
- Playbook: [../../playbooks/order-cancel-refund.md](../../../playbooks/order-cancel-refund.md).
- Yetki: görüntüleme `orders:read`; durum `orders:status:update`; iptal `orders:cancel`; tam iade `orders:refund`;
  kalem bazlı iade (dekont oluştur+onayla+işle birlikte) `orders:credit-memo:create` + `:approve` + `:process` (üçü
  yoksa "İade" diyaloğunda gönder butonu görünmez); dekont işlemleri `orders:credit-memo:view|approve|process|cancel`;
  RMA `orders:return:create|approve|reject|receive|inspect|process|cancel`; kargolama `orders:ship`; teslim
  `orders:deliver`; not ve fatura işlemleri `orders:write`.
- Kişisel veri: **evet** (ad, e-posta, telefon, adresler, vergi no).

## Ön koşullar ve bağımlılıklar
- Fatura işlemleri fatura moduna ve e-Fatura sağlayıcısına bağlı: [../settings/einvoice.md](../settings/einvoice.md);
  şirket VKN/unvanı: [../settings/general.md](../settings/general.md).
- Kargolama akışı kargo entegrasyonuna bağlı (Geliver): [../settings/shipping-carriers.md](../settings/shipping-carriers.md);
  depo gönderici adresi gerekli.
- Para iadesi ödeme sağlayıcısına bağlı: [../settings/payments.md](../settings/payments.md) (iade süresi politikası).
- Müşteriye giden e-postalar: [../settings/notifications.md](../settings/notifications.md).
- Müşteri kartı → [../customers/customer-detail.md](../customers/customer-detail.md); stok etkileri →
  [../inventory/stock.md](../inventory/stock.md).

## Yerleşim
1. **Üst çubuk**: geri ok (aria-label "Siparişlere Dön"), sipariş no + rozetler; sağda: **"Durumu değiştir / Change
   status"** seçicisi, yazdır ikonu (aria-label "Siparişi yazdır / Print order"), indir ikonu (aria-label "Faturayı
   indir / Download invoice"), "⋯" (aria-label "Diğer işlemler / More actions") → "Faturayi Görüntüle", "Faturayi
   Yazdır", "İade / Refund", "Siparişi İptal Et / Cancel Order".
2. **Sol sütun**: "Sipariş Ürünleri (N)" (görsel, ad, SKU, adet, birim fiyat, satır toplamı; Ara Toplam, İndirim,
   Kargo, Vergi, Toplam) → **"Faturalar"** kartı → **"İadeler / RMA"** kartı (açılır-kapanır) → **"Alacak
   Dekontları"** kartı → **"Kargo"** kartı (kargo yöntemi, takip no + kopyala, "Kargoyu takip et" linki, teslimat
   adresi; bölünmüş gönderide "Bölünmüş Kargo" rozeti ve "Paket N" satırları, depo adı, SKU × adet).
3. **Sağ sütun**: "Müşteri" (ad, "Kayıtlı/Misafir" rozeti, e-posta, telefon, "Müşteriyi Gör") → "Ödeme" (yöntem,
   ödeme durumu, İşlem ID) → "Fatura Adresi" → "Sipariş Geçmişi" (zaman çizelgesi; değişikliği yapan: Yönetici/Sistem/
   Müşteri) → "Notlar" (açılır-kapanır).

## Alanlar ve diyaloglar

### A. Durumu değiştir (üst çubuk Select)
- Seçenekler yalnız izinli geçişlerdir ([../../entities/order.md](../../entities/order.md) §Durum geçişleri).
  "İptal Edildi" ve "İade Edildi" kırmızı uyarı ikonlu.
- **İptal Edildi / İade Edildi dışındaki her seçim diyalogsuz ve anında kaydedilir.**
- İptal Edildi / İade Edildi → diyalog "Durum Değişikliğini Onayla" ("Sipariş durumunu {durum} olarak değiştirmek
  üzeresiniz.") + Textarea `#reason` "İptal sebebi" / "İade sebebi" (zorunlu; iade ≤500) → "Onayla / Confirm" ya da
  "Vazgeç".
  - İptal Edildi seçimi, aşağıdaki iptal akışıyla aynı sonucu doğurur (otomatik para iadesi dahil).
  - İade Edildi seçimi **siparişin tamamını** ödeme sağlayıcısı üzerinden iade eder (alacak dekontu oluşturur,
    kalemleri stoğa geri ekler). Hata: "İade işlenemedi".
- Başarı toast'u: "Sipariş durumu başarıyla güncellendi".

### B. Siparişi İptal Et diyaloğu ("⋯" → "Siparişi İptal Et")
Başlık "Siparişi İptal Et #{no}" — "Bu siparişi iptal etmek istediğinizden emin misiniz?"

| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon | Locator ipucu | Not |
|---|---|---|---|---|---|
| İptal Nedeni / Cancellation Reason | Select ("Bir neden seçin...") | evet | — | `#cancel-reason` (aria-label "İptal nedeni seçin") | Müşteri Talebi, Stokta Yok, Ödeme Başarısız, Sahtekarlık Şüphesi, Mükerrer Sipariş, Kargo Uygun Değil, Fiyat Hatası, Diğer |
| Ek Notlar / Additional Notes | Textarea | "Diğer"de evet | — | `#cancel-notes` | "Bu not sipariş geçmişine kaydedilecektir." |
Uyarı kutusu: "Bu işlem geri alınamaz — Sipariş iptal edildi olarak işaretlenecek ve müşteri bilgilendirilebilir."
Butonlar: "İptal / Cancel" (diyaloğu kapatır), **"Siparişi İptal Et"**. Toast: "Sipariş başarıyla iptal edildi".
Kargo firması gönderi iptalini onaylamazsa: "Kargo firması iptali onaylamadı, gönderi hâlâ aktif…" (doğrulanmadı).

### C. İade diyaloğu ("⋯" → "İade / Refund") — kalem bazlı tam/kısmi para iadesi
Başlık "Siparişi İade Et #{no}" — "İade edilecek ürünleri seçin ve iade seçeneklerini yapılandırın."

| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Tam İade / Full Refund | Buton | — | — | buton adı | Tüm kalemleri tam adetle + iade edilebilir kargoyu seçer |
| Temizle / Clear | Buton | — | — | | Seçimi sıfırlar |
| Kalem seçimi | Checkbox | ≥1 kalem veya kargo | seçilince tam adet | `#refund-item-<kalem>` / aria-label "{ad} ürününü iade için seç" | |
| Adet | number + −/+ | — | 0…sipariş adedi ("/ N") | aria-label "{ad} için adet" | |
| Kargoyu İade Et / Refund Shipping | Checkbox + tutar | — | tutar ≤ ödenen kargo | `#refund-shipping`, aria-label "Kargo iade tutarı" | Kargo ödenmemişse pasif |
| İade Yöntemi / Refund Method | Select | evet | **Orijinal Ödeme Yöntemi** | `#refund-method` | Mağaza Kredisi, Banka Havalesi, Çek, Nakit. Yalnız "Orijinal Ödeme Yöntemi" parayı **ödeme sağlayıcısı üzerinden** geri öder; diğerleri dekontu iade edildi kaydeder, parayı mağaza kendisi öder |
| İade Nedeni / Reason for Refund | Textarea | hayır | — | `#refund-reason` | |
| Müşteri Notu (müşteriye görünür) | Textarea | hayır | — | `#customer-note` | |
| Dahili Not | Textarea | hayır | — | `#internal-note` | |
| Müşteriye e-posta bildirimi gönder | Checkbox | — | **işaretli** | `#send-email` | Etkisi doğrulanmadı; tam iade tamamlanınca "Sipariş İade Edildi" e-postası gider |
Özet (sunucudan hesaplanır, "Hesaplanıyor…"): Ürünler Ara Toplamı, Vergi İadesi, İndirim Düşüldü, Taksit Farkı, Kargo
İadesi, **Toplam İade**. Uyarı: "Göndermeden önce gözden geçirin — Bu işlem {tutar} tutarını şimdi iade edecektir. İade
otomatik olarak işlenecektir."
Butonlar: "{tutar} tutarını şimdi iade et" → ikinci onay "{tutar} tutarı şimdi iade edilsin mi?" ("Bu işlem {tutar}
tutarını {yöntem} yoluyla müşteriye geri öder. Bu işlem geri alınamaz.") → **"İadeyi onayla"**.
Toast: "İade başarıyla işlendi — Alacak dekontu {no} oluşturuldu". Ödeme sağlayıcısı sonuçlandırmazsa: "İade oluşturuldu
ancak henüz ödenmedi — alacak dekontu listesinden işleyin."

### D. Faturalar kartı ("Faturalar / Invoices")
Fatura moduna göre ([../../entities/invoice.md](../../entities/invoice.md)):
- **Platform**: aktif standart fatura yoksa "Fatura Oluştur" / "İlk Faturayı Oluştur" → **onay diyaloğu olmadan**
  fatura oluşturur ve **hemen e-Fatura sağlayıcısına gönderir**. Toast "Fatura Oluşturuldu" + "e-Fatura Gönderildi";
  gönderim başarısızsa "Fatura oluşturuldu ancak Sovos'a gönderilemedi. Manuel olarak tekrar…". Otomatik fatura
  açıksa ve sipariş kargodaysa "Fatura hazırlanıyor...".
- **Muhasebe**: bilgi şeridi "Faturalar {program} üzerinden yönetiliyor…"; taslak fatura kargo sonrası kendiliğinden.
- **Harici**: "Fatura Yükle" → yan panel: PDF (sürükle/seç, ≤10 MB), "Fatura Numarası", "Fatura Tarihi", "Notlar
  (isteğe bağlı)" → "Faturayı Yükle" → "Fatura başarıyla yüklendi".

Fatura satırı: numara, durum ve GİB rozetleri, tutar, "Kalan", PDF indir, önizleme; gönderim hatası varsa "e-Fatura
gönderimi başarısız: …" + "Tekrar Dene" / "Faturayı Yeniden Oluştur" / (kontör bittiyse) "Fatura Yükle". Satırı açınca
işlem butonları (görünürlük duruma göre):

| Buton (tr / en) | Görünür | Ne olur | Onay diyaloğu |
|---|---|---|---|
| e-Fatura Gönder / e-Arşiv Gönder | platform, GİB'e gönderilmemiş | Faturayı sağlayıcı üzerinden GİB'e gönderir | **yok — anında** |
| GİB Durumunu Sorgula | platform, gönderilmiş | Sağlayıcıdan durum okur (salt okuma) | — |
| e-Arşiv İptal | platform, e-Arşiv, gönderimden ≤7 gün | Neden zorunlu → GİB'de iptal | var ("e-Arşiv Fatura İptal") |
| Faturayı Yeniden Oluştur | platform, taslak | Taslağı güncel veriden yeniden üretir | var |
| İade Faturası / Credit Note | Gönderildi/Ödendi/ERP'ye Aktarıldı standart fatura | "İade Tutarı (tam iade için boş bırakın)" + "Neden" → **taslak** iade faturası | var (form) |
| Fark Faturası / Debit Note | aynı | "Ek Tutar" (>0) + "Neden" → taslak fark faturası | var (form) |
| PDF Oluştur / PDF İndir | platform dışı | PDF üretir / indirir | — |
| Fatura Gönder | platform dışı, PDF var | "E-posta Adresi"ne faturayı e-postalar | var (form) |
| Ödeme Kaydet | platform dışı, kalan > 0 | "Ödeme Tutarı", "Ödeme Yöntemi (isteğe bağlı)" | var (form) |
| İptal Et (void) | platform: yalnız taslak; diğer: ödenmemiş | "Neden (zorunlu, en az 10 karakter)" → faturayı iptal edildi işaretler; GİB'de iptal **etmez** | var |
| Muhasebeye Aktar | muhasebe modu | Muhasebe dışa aktarım dosyası indirir | — |
| Faturalandırıldı İşaretle | muhasebe, taslak | "Harici Fatura Numarası", "Fatura Tarihi" → ERP'ye Aktarıldı | var |

### E. İadeler / RMA kartı
"İade Oluştur / Create Return" (Beklemede ve İade Edildi siparişlerde yok: "Bu sipariş durumu için iade
oluşturulamaz.") → diyalog "İade Talebi Oluştur":

| Label (tr / en) | Kontrol tipi | Zorunlu | Not |
|---|---|---|---|
| İade Edilecek Ürünleri Seçin | Checkbox + adet (−/+) | ≥1 | İade edilebilir adet teslim edilen adetle sınırlı |
| İade Nedeni | Select ("Neden seçin...") | evet | Liste: [../../entities/order.md](../../entities/order.md) |
| Çözüm | Select ("Çözüm seçin...") | evet | Para İadesi, Değişim, Mağaza Kredisi, Yenisiyle Değiştirme, Onarım |
| İade Yöntemi | Select ("Yöntem seçin...") | evet (doğrulanmadı) | Kargo ile Gönder, Kurye ile Teslim Al, Teslim Noktasına Bırak, Mağazada İade |
| Detaylı Açıklama (İsteğe Bağlı) | Textarea `#customerReason` | hayır | |
| Ek Notlar (İsteğe Bağlı) | Textarea `#comments` | hayır | |
| İşleme almadan önce onay gerekli | Checkbox `#requiresApproval` | — | |
| Müşteriden fotoğraf gerekli | Checkbox `#photosRequired` | — | |
"İade Oluştur" → toast "İade talebi başarıyla oluşturuldu". Liste satırına tıklayınca iade detayı (sekmeler: Detaylar,
Ürünler, **İşlemler**, Geçmiş). İşlemler sekmesindeki butonlar **ek onay diyaloğu olmadan** uygulanır:

| Durum | Aksiyon | Alanlar | Sonuç |
|---|---|---|---|
| Onay Bekliyor | "İadeyi Onayla" | İade Kargosu, Takip Numarası, Dahili Notlar (opsiyonel; `#carrier`, `#tracking`, `#approveNotes`) | Onaylandı - Ürün Bekleniyor |
| Onay Bekliyor | "İadeyi Reddet" | Red Sebebi (zorunlu, `#rejectReason`) | Reddedildi |
| Onaylandı | "Teslim Alındı Olarak İşaretle" | kalem başına adet + durum (Yeni, Yeni Gibi, İyi, Kabul Edilebilir, Hasarlı, Defolu, Kullanılamaz), Notlar | Ürünler Alındı |
| Ürünler Alındı | "İncelemeyi Tamamla" | kalem başına Geçti/Başarısız + akıbet (Stoğa Geri Ekle, Tasfiye Et, İmha Et, Tamire Gönder, Tedarikçiye İade), notlar | İncelendi |
| İncelendi | "İadeyi İşle" | — ("Bu işlem {tutar} tutarında bir iade yapacak ve stok…") | Para İadesi → İade Edildi; Değişim → Değiştirildi (yeni değişim siparişi açılır); diğer → Kapatıldı. İncelemeden geçen kalemler stoğa eklenir |
| Onay Bekliyor / Onaylandı | alt bilgi "İadeyi İptal Et" | onay diyaloğu "İade İptal Edilsin mi?" + İptal Sebebi (zorunlu) → "İadeyi İptal Et" | İptal Edildi |
Toast: "İade başarıyla güncellendi".

### F. Alacak Dekontları kartı
Tablo: Numara, Durum, İade Yöntemi, Tutar, Tarih, İşlemler; üstte "İade Edilen Tutar". "Detayları Görüntüle" diyaloğu:
kalemler, ara toplam, kargo iadesi, düzeltme, genel toplam, neden, notlar, oluşturan/onaylayan/tarihler. Butonlar:
| Buton | Görünür | Onay metni | Toast |
|---|---|---|---|
| Onayla | Beklemede | "Bu alacak dekontunu onaylamak istediğinizden emin misiniz?" | "Alacak dekontu başarıyla onaylandı" |
| İadeyi İşle | Onaylandı | "Bu işlem ödeme sağlayıcısı üzerinden iadeyi gerçekleştirecektir. Bu işlem geri alınamaz. Devam?" | "İade başarıyla işlendi" |
| Alacak Dekontunu İptal Et | Beklemede/Onaylandı | onay + "İptal Nedeni" | "Alacak dekontu iptal edildi" |

### G. Kargo kartı — kargolama ve teslim
- **Kargo entegrasyonu (Geliver) aktifse** ve sipariş Beklemede/Hazırlanıyor/Hazır/Kısmen Gönderildi ise
  **"Kargola / Ship Order"** (bölünmüş gönderide her bekleyen paket için ayrı). Panel "Siparişi Kargola":
  - Ayarlarda "Kargoyu otomatik onayla" açık **ve** seçim stratejisi "Manuel" değilse: panel **açılır açılmaz** gönderi
    oluşturulur ve etiket satın alınır ("Kargolama oluşturuluyor...") — ek tıklama yok.
  - Aksi halde: ağırlık/desi bilgisi, tarife kartları (rozetler "Müşteri Seçimi", "En Ucuz", "En Hızlı"; gün sayısı,
    fiyat), "Ağırlık ve boyut düzelt" (Ağırlık (kg), Uzunluk/Genişlik/Yükseklik (cm)), **"{fiyat} ile kargola"** /
    "Kargolama Oluştur". "Bu sipariş için kargo seçeneği bulunamadı" olabilir.
  - "Takip numarasını manuel girin" → `#manual-tracking` "Takip Numarası", `#manual-carrier` "Kargo Firması", "Tahmini
    Teslimat" → "Kargolandı Olarak İşaretle" (etiket satın almaz). "Mevcut kargo seçeneklerinden seçin" ile geri döner.
  - Sonuç: "Kargolama Oluşturuldu", takip no + kopyala, "Kargoyu takip et", "Kargo ücreti", "Tahmini Teslimat",
    **"Etiketi Yazdır"**, "Tamam".
  - Hatalar: gönderici adresi yok ("Kargo henüz başlatılamıyor: önce deponuz için bir gönderici adresi seçmeniz
    gerekiyor." + link), bakiye yetersiz ("Geliver bakiyeniz bu etiketi almak için yetersiz…"), etiket durumu belirsiz
    ("…İki kez ücretlendirilmemek için tekrar denemeden önce Geliver panelinizi kontrol edin.").
  - Paket "Geliver'da kontrol edin" rozetliyse yeni kargolama butonu gösterilmez.
- **Entegrasyon yoksa** "Kargoyu Yönet / Manage Shipping" → diyalog "Kargo Yönetimi" sekmeleri:
  - "Kargoya Verildi": `#tracking-number` Takip Numarası, `#carrier` Taşıyıcı (UPS, FedEx, USPS, DHL, Amazon Logistics,
    Local Delivery, Customer Pickup, Other), `#estimated-delivery` Tahmini Teslim Tarihi → "Kargoya Verildi Olarak
    İşaretle". Toast "Sipariş başarıyla kargolandı olarak işaretlendi".
  - "Teslim Edildi" (yalnız Kargoya Verildi'de): `#delivered-to` Teslim Alan, `#delivery-location` Teslim Yeri →
    "Teslim Edildi Olarak İşaretle".

### H. Notlar kartı
"Not Ekle" → Textarea (aria-label "Notunuzu girin...") + Checkbox `#visible-to-customer` "Müşteriye görünür" →
"Not Ekle". Toast "Not başarıyla eklendi". Müşteriye görünür notlar "Müşteri görebilir" rozetiyle listelenir.

### I. Yazdır / indir
Yazdır ikonu tarayıcı yazdırma penceresini açar; indir ikonu son faturanın PDF'ini indirir (fatura yoksa "Bu sipariş
için fatura mevcut değil. Önce bir tane oluşturun."). Kayıt değiştirmez.

## Onay zamanlaması (kural 2/5/6) — aksiyon bazında

| Aksiyon | Kalıcı mı / ne zaman kaydeder | Geri alınabilir mi | Müşteriye e-posta | Dış sisteme yazma | Onay |
|---|---|---|---|---|---|
| Durumu değiştir → İptal/İade **dışı** durum | **Seçer seçmez, diyalogsuz** | Yalnız izinli geri geçiş varsa (çoğu ileri yönlü) | Evet: "Sipariş Durumu Değişti"; Kargoya Verildi → "Kargoya Verildi"; Teslim Edildi → "Teslim Edildi" | Teslim Edildi'de kapıda ödeme tahsil sayılır | Seçenek **tıklanmadan önce** |
| Siparişi İptal Et (diyalog veya durum seçicisi) | "Siparişi İptal Et"/"Onayla" ile | **Hayır** (son durum) | Evet: "Sipariş İptal Edildi" | **Evet**: tahsil edilmiş ödeme varsa ödeme sağlayıcısında otomatik iade; stok serbest; kupon kullanımı geri alınır | Kural 5 — ayrı, tek tek; tutar ve stok etkisi özette |
| İade diyaloğu → "İadeyi onayla" | Anında; dekont oluşur, onaylanır, işlenir | **Hayır** | Tamamı iade edildiyse "Sipariş İade Edildi"; kısmide doğrulanmadı | **Evet** (Orijinal Ödeme Yöntemi'nde ödeme sağlayıcısı); kalemler stoğa eklenir | Kural 5 — tutar, kalem, yöntem ile tek tek |
| Durum → İade Edildi | "Onayla" ile | **Hayır** | "Sipariş İade Edildi" | **Evet**: tüm kalan tutar ödeme sağlayıcısında iade; kalemler stoğa | Kural 5 |
| Dekont "Onayla" | Anında | Dekont iptal edilebilir | Hayır | Hayır | Önce |
| Dekont "İadeyi İşle" | Anında | **Hayır** | Tam iadeyle sipariş kapanırsa evet | **Evet** (ödeme sağlayıcısı, orijinal yöntemde) | Kural 5 |
| Dekont iptali | Anında | Hayır | Hayır | Hayır | Önce |
| Kargola (Geliver) — otomatik onay açık | **Panel açılınca** | Etiket iptali taşıyıcıya bağlı | Evet: "Sipariş Kargoya Verildi" (+ kargo durum bildirimleri) | **Evet**: taşıyıcıda etiket satın alınır, **kargo bakiyesinden ücret** düşer; e-Fatura "Otomatik Fatura" açıksa fatura kesilir | "Kargola"ya **tıklamadan önce** (firma bilinmeden; özet: "en uygun tarifeyle otomatik") |
| Kargola (Geliver) — tarife seçerek | "{fiyat} ile kargola" ile | Aynı | Aynı | Aynı | Seçilen firma + ücretle |
| Kargolandı Olarak İşaretle / Kargoya Verildi Olarak İşaretle (manuel) | Buton ile | Hayır (ileri yönlü) | "Sipariş Kargoya Verildi" | Etiket alınmaz | Önce |
| Teslim Edildi Olarak İşaretle | Buton ile | Hayır | "Sipariş Teslim Edildi" | Kapıda ödeme tahsil sayılır | Önce |
| Fatura Oluştur (platform) | **Diyalogsuz**; oluşturur + GİB'e gönderir | GİB sonrası yalnız e-Arşiv 7 gün iptal / iade faturası | Sağlayıcının e-Arşiv e-postası (doğrulanmadı) | **Evet** — yasal belge (e-Fatura/e-Arşiv); sağlayıcı kontörü düşer | Önce; prod'da ve sağlayıcı Canlı ortamdaysa ayrı uyarı |
| e-Fatura / e-Arşiv Gönder | **Diyalogsuz** | Aynı | Aynı | **Evet** | Önce |
| e-Arşiv İptal | Diyalogla | **Hayır** | doğrulanmadı | **Evet** (GİB) | Kural 5 |
| İade / Fark Faturası oluştur | Diyalogla; taslak oluşur | Taslak | Hayır | Hayır (gönderilince evet) | Önce; ardından gönderim ayrı onay |
| Fatura İptal Et (void) | Diyalogla | Hayır | Hayır | Hayır (GİB'de iptal etmez) | Kural 5 |
| Fatura Gönder (e-posta) | Diyalogla | — | **Evet** (girilen adrese) | Hayır | Önce; adresi kullanıcı teyit eder |
| Ödeme Kaydet, Faturalandırıldı İşaretle, Faturayı Yükle, Faturayı Yeniden Oluştur | Diyalogla | Kısmen | Hayır | Hayır | Önce |
| İade Oluştur (RMA) | Diyalogla | İptal edilebilir (Onay Bekliyor/Onaylandı) | doğrulanmadı | Hayır | Önce |
| RMA İşlemler sekmesi butonları (Onayla, Reddet, Teslim Alındı, İncelemeyi Tamamla, **İadeyi İşle**) | **Ek diyalog yok**, buton ile | Hayır (ileri yönlü) | doğrulanmadı | İadeyi İşle: stok; Değişim'de yeni sipariş | Her biri ayrı; İadeyi İşle kural 5 |
| Not Ekle | Buton ile | Hayır (silme yok) | Hayır (müşteriye görünür not hesabında görünür — doğrulanmadı) | Hayır | Önce; "müşteriye görünür" ayrıca belirt |

## Yan etkiler
- Kargo oluşturma siparişi Kargoya Verildi yapar ve takip bilgisini yazar (doğrulanmadı: bölünmüş gönderide her paket
  için Kısmen Gönderildi).
- Tam iade toplamı sipariş tutarına ulaşınca sipariş otomatik "İade Edildi" olur ve kupon kullanımı geri alınır.
- İptal/iade/kargo/teslim olayları müşteri istatistiklerine ve analitik ekranlarına yansır.
- Ayrıntılı stok etkileri: [../../entities/order.md](../../entities/order.md) §Stok ilişkisi. Stok değişimi bağlı
  pazaryerlerine de gönderilir ([../../entities/marketplace-channel.md](../../entities/marketplace-channel.md) §7).
- **Pazaryeri siparişi** (kaynak Trendyol, Amazon, Hepsiburada, N11): durum değişikliği, iptal ve iade pazaryerine de
  yansıyabilir (dış sistem). Bu siparişlerde her onay özetinin ilk satırlarına **"Kaynak pazaryeri: {kanal}"** ekle
  ([../../entities/marketplace-channel.md](../../entities/marketplace-channel.md) §8).

## Tuzaklar
- **Durum seçicisi diyalogsuzdur** (iptal/iade hariç): yanlış tıklama anında kaydedilir ve müşteriye e-posta gider.
- "Kargola" otomatik onay modunda panel açıldığı anda etiket satın alır — butona tıklamak kalıcı aksiyondur.
- Platform modunda "Fatura Oluştur" faturayı doğrudan GİB'e gönderir; alıcı VKN/TCKN eksikse oluşur ama gönderilemez
  ("Alıcı vergi kimliği (VKN veya TCKN) eksik…").
- İptal ancak Beklemede / Hazırlanıyor / Bekletiliyor'da; kargoya verilmiş siparişte iptal yerine iade (RMA veya "İade").
- Hazırlanıyor'a geçiş ödeme alınmamışsa reddedilir (`ERR_PAYMENT_REQUIRED_FOR_PREPARING`).
- Kargoya Verildi işaretleme tahsil edilmiş ödeme ister (`ERR_ORDER_PAYMENT_NOT_CAPTURED`).
- İade diyaloğunda yöntem "Orijinal Ödeme Yöntemi" dışındaysa para sağlayıcıdan **geri ödenmez**; kullanıcıya açıkça söyle.
- İade diyaloğunda gönder butonu, tutar sunucudan hesaplanıp sabitlenene kadar pasiftir; adet değiştirince bekle
  ("Hesaplanıyor…") ve snapshot ile Toplam İade'yi oku.
- e-Arşiv iptali 7 günle sınırlı; sonrası için iade faturası gerekir.
- Fatura "İptal Et" GİB'de iptal etmez — GİB'e gitmiş faturada kullanıcıyı uyar.

## Doğrulama
1. Toast metni (her aksiyon tablosunda).
2. Başlıktaki durum ve ödeme rozetleri; "Sipariş Geçmişi"nde yeni kayıt (kim, hangi durumdan, not).
3. İade sonrası: "Alacak Dekontları"nda yeni dekont "İade Edildi" durumunda, "İade Edilen Tutar" güncel; açık kalan
   dekont varsa ("İşleniyor"/"Onaylandı") kullanıcıya bildir.
4. Kargo sonrası: Kargo kartında takip numarası ve "Kargoyu takip et" linki.
5. Fatura sonrası: fatura satırında numara, GİB rozeti (Gönderildi/Kabul Edildi); "GİB Durumunu Sorgula" ile teyit.
6. Stok etkisi gerekiyorsa [../inventory/stock.md](../inventory/stock.md) ekranında SKU'nun rezerve/mevcut adedi.
