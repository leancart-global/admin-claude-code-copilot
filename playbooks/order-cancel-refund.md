# Playbook: Sipariş iptali ve iade (tam / kısmi / RMA)

Tetikleyiciler: "#1042'yi iptal et", "müşteri vazgeçti, siparişi iptal et", "bu siparişin parasını iade et",
"2 üründen birini iade et", "kargo ücretini iade et", "müşteri ürünü geri gönderiyor, iade kaydı aç".
Harita: ../domain/screens/orders/order-detail.md (diyaloglar, onay zamanlaması), ../domain/entities/order.md (durum
geçişleri, iptal/iade kuralları, stok, e-postalar), ../domain/entities/invoice.md (iade faturası).

---

## 0. Kural hatırlatması (kural 2 ve 5)
- İptal, para iadesi, dekont işleme, e-Arşiv iptali **geri alınamaz** → her biri **ayrı özet ve ayrı, tek tek onay**.
  Birden çok sipariş için bile toplu onay yok (kullanıcı açıkça istemedikçe); her sipariş kendi özetiyle.
- Toplu liste işlemleriyle (Durumu Güncelle → İade Edildi) iade **yapma**; her zaman sipariş detayından.
- Özet her zaman: ortam, sipariş no, müşteri, mevcut durum ve ödeme durumu, **iade tutarı ve yöntemi**, stok etkisi,
  müşteriye giden e-posta, ödeme sağlayıcısına/kargoya/e-Faturaya dış etkiler.
- Kodda/canlıda beklenmeyen davranış görürsen dur ve kullanıcıya sor.

## 1. Durumu oku (salt okuma)
1. `{ADMIN_URL}/orders` → sipariş no ile ara → detay.
2. Snapshot'tan oku: durum rozeti, ödeme durumu, "Ödeme" kartı (yöntem, İşlem ID), kalemler/tutarlar, "Alacak
   Dekontları" (daha önce iade var mı, "İade Edilen Tutar"), "İadeler / RMA", "Faturalar" (GİB'e gitmiş fatura var
   mı), "Kargo" (takip no var mı).
3. Karar tablosu:

| Durum | Kullanıcı isteği | Yol |
|---|---|---|
| Beklemede / Hazırlanıyor / Bekletiliyor | İptal | **A. İptal** (ödeme alınmışsa otomatik tam iade dahil) |
| Hazır / Kargoya Verildi / Teslim Edildi / Tamamlandı / Kısmi İade | İptal | İptal **yapılamaz** → kullanıcıya sor: tam iade (B) mi, ürün geri dönüşü (D) mi? |
| Ödeme alınmış, herhangi bir aktif durum | Tam para iadesi | **B. Tam iade** |
| Ödeme alınmış | Bazı ürünler / bir kısım / yalnız kargo | **C. Kısmi iade** |
| Kargoya verilmiş / teslim edilmiş | Ürün geri gelecek, sonra iade/değişim | **D. RMA** |
| Beklemede (ödeme yok) | İade | Para iadesi yok (`ERR_REFUND_REQUIRES_CAPTURED_PAYMENT`) → iptal öner |
| İptal Edildi / İade Edildi | herhangi | Son durum; yalnız fatura düzeltmesi (E) kalabilir |

## A. İptal
1. Bilgi: **iptal nedeni** (Müşteri Talebi, Stokta Yok, Ödeme Başarısız, Sahtekarlık Şüphesi, Mükerrer Sipariş, Kargo
   Uygun Değil, Fiyat Hatası, Diğer) ve isteğe bağlı not ("Diğer"de not zorunlu). Kullanıcıdan gelmiyorsa sor.
2. Özet:

| Alan | Değer |
|---|---|
| Ortam / Sipariş | prod / #1042 — Ayşe Y. |
| Mevcut durum → yeni | Hazırlanıyor → **İptal Edildi** (son durum, geri alınamaz) |
| Neden / not | Müşteri Talebi — "telefonla vazgeçti" (not sipariş geçmişine yazılır) |
| Para | Ödeme "Ödendi" → **{toplam} TRY otomatik olarak ödeme sağlayıcısı üzerinden iade edilecek** (alacak dekontu oluşur) / ödeme yoksa "para hareketi yok" |
| Stok | Ayrılan stok serbest bırakılır |
| Kupon | Kullanım geri alınır |
| Müşteriye | "Sipariş İptal Edildi" e-postası |
| Kargo / fatura | Takip no varsa: gönderi taşıyıcıda ayrıca kontrol edilmeli; GİB'e gitmiş fatura varsa iade faturası ayrı iş (E) |

3. Açık "evet" → "⋯" (aria-label "Diğer işlemler") → **"Siparişi İptal Et"** → `#cancel-reason` (tetikleyiciye tıkla →
   seçeneğe tıkla) → `#cancel-notes` → **"Siparişi İptal Et"**.
4. Doğrula: toast "Sipariş başarıyla iptal edildi"; rozet "İptal Edildi"; "Sipariş Geçmişi"nde neden; ödeme alınmışsa
   "Alacak Dekontları"nda yeni dekont — "İade Edildi" değilse (Onaylandı/İşleniyor) kullanıcıya bildir ve F adımını öner.

## B. Tam iade
1. Bilgi: **iade nedeni** (zorunlu), iade yöntemi (varsayılan **Orijinal Ödeme Yöntemi**).
2. Yol: "⋯" → **"İade / Refund"** diyaloğu → "Tam İade" (kalemlere ek olarak kargo seçilir) → yöntem → neden → notlar.
   (Alternatif: durum seçicisinde "İade Edildi" + neden — aynı sonuç, ama diyalog kalem/tutar önizlemesi gösterdiği
   için tercih et.)
3. Sunucu hesabı bitene kadar bekle ("Hesaplanıyor…" kaybolsun), snapshot'tan **Toplam İade** ve kırılımı oku.
4. Özet:

| Alan | Değer |
|---|---|
| Sipariş / müşteri | #1042 — Ayşe Y. |
| Kalemler | tümü (2 × TSHRT-BSC-M) + kargo 89,90 |
| Toplam İade (sunucu) | 1.089,70 TRY (Vergi İadesi …, İndirim Düşüldü …, Taksit Farkı …) |
| Yöntem | Orijinal Ödeme Yöntemi → **ödeme sağlayıcısında gerçek para iadesi**, geri alınamaz |
| Stok | İade edilen kalemler stoğa geri eklenir |
| Sipariş durumu | **İade Edildi** (son durum) |
| Müşteriye | "Sipariş İade Edildi" e-postası; müşteri notu (varsa) |
| Fatura | GİB'e gitmiş fatura varsa iade faturası ayrı iş (E) |

5. Açık "evet" → "{tutar} tutarını şimdi iade et" → ikinci diyalogda **"İadeyi onayla"**. (İkinci diyalog aynı özet
   için; yeni onay istemez — ama tutar özetten farklıysa **dur** ve yeniden sor.)
6. Doğrula: toast "İade başarıyla işlendi — Alacak dekontu {no} oluşturuldu"; dekont "İade Edildi"; "İade Edilen
   Tutar"; sipariş rozeti. "İade oluşturuldu ancak henüz ödenmedi…" görülürse → F.

## C. Kısmi iade (kalem / adet / yalnız kargo)
1. Bilgi: hangi kalemler, kaç adet; kargo iade edilecek mi ve tutarı; yöntem; neden.
2. "İade" diyaloğu → ilgili kalem checkbox'ları (aria-label "{ad} ürününü iade için seç") → adet (aria-label "{ad} için
   adet") → gerekirse `#refund-shipping` + tutar → yöntem → neden / notlar.
3. Toplam İade sabitlenince oku; özet B'deki gibi, sipariş durumu "Kısmi iade" (doğrulanmadı — dekont sonrası rozeti oku).
   Kısmi iadede müşteri e-postası gidip gitmediği doğrulanmadı — özette "doğrulanmadı" yaz.
4. "evet" → gönder → "İadeyi onayla" → doğrula (B.6).

## D. İade talebi (RMA) — ürün geri dönüşü
Her adım ayrı kalıcı işlemdir; her biri için kısa özet + onay. İşlemler sekmesindeki butonlarda ek diyalog yoktur —
onayı tıklamadan önce al.
1. "İadeler / RMA" kartı → "İade Oluştur" → kalemler/adet, İade Nedeni, Çözüm (Para İadesi / Değişim / Mağaza
   Kredisi / Yenisiyle Değiştirme / Onarım), İade Yöntemi, açıklama, "İşleme almadan önce onay gerekli", "Müşteriden
   fotoğraf gerekli" → özet → "İade Oluştur".
2. İade satırı → İşlemler: "İadeyi Onayla" (iade kargosu / takip no opsiyonel) veya "İadeyi Reddet" (sebep zorunlu).
3. Ürün mağazaya ulaşınca: "Teslim Alındı Olarak İşaretle" (adet + durum).
4. "İncelemeyi Tamamla" (Geçti/Başarısız + akıbet: Stoğa Geri Ekle…).
5. **"İadeyi İşle"** — kural 5: özet "Para İadesi çözümünde {tutar}; incelemeden geçen kalemler stoğa eklenir; Değişim
   çözümünde yeni değişim siparişi açılır". Sonrasında "Alacak Dekontları" kartında para iadesinin gerçekleştiğini
   doğrula; dekont görünmüyorsa veya "İade Edildi" değilse dur ve kullanıcıya sor.
6. Vazgeçilirse (Onay Bekliyor / Onaylandı): "İadeyi İptal Et" → sebep → onay.

## E. Fatura düzeltmesi (GİB'e gitmiş fatura varsa)
1. "Faturalar" kartında faturayı aç. e-Arşiv ve gönderimden ≤7 gün → "e-Arşiv İptal" mümkün (neden zorunlu, geri
   alınamaz, GİB'e yazar). Aksi halde → "İade Faturası" (tutar boş = tam) + neden → **taslak** oluşur.
2. Taslak iade faturasını GİB'e göndermek ("e-Fatura/e-Arşiv Gönder") **diyalogsuz** ve ayrı bir yasal işlemdir → ayrı
   özet + onay; e-Fatura ayarları Canlı ortamdaysa özette belirt (../domain/screens/settings/einvoice.md).
3. "İptal Et" (void) GİB'de iptal etmez; GİB'e gitmiş faturada kullanma, kullanıcıyı uyar.

## F. Açık kalan dekont ("İşleniyor" / "Onaylandı")
1. "Alacak Dekontları" → dekont → "Detayları Görüntüle". Durum ve tutarı kullanıcıya bildir.
2. Kullanıcı isterse: "Onaylandı" ise **"İadeyi İşle"** ("…ödeme sağlayıcısı üzerinden… geri alınamaz") — kural 5, ayrı
   onay. "İşleniyor" ise ödeme sağlayıcısının sonucunu beklemek gerekir; kullanıcıya sağlayıcı panelini kontrol
   etmesini öner, tekrar deneme yapma.
3. Gereksizse "Alacak Dekontunu İptal Et" + neden (ayrı onay).

## Sık hatalar
- Durum seçicisinde iptal/iade dışındaki seçenekler **anında** kaydedilir — iptal için seçiciyi açıp yanlış seçeneğe
  tıklama; "⋯" menüsünü kullan.
- Yöntem "Orijinal Ödeme Yöntemi" dışında seçilirse para sağlayıcıdan geri ödenmez; kullanıcı istemedikçe değiştirme.
- İade diyaloğunda adet değiştirdikten sonra özet yeniden hesaplanır; eski tutarla onay alma.
- Kargoya verilmiş siparişi iptal etmeye çalışmak → `ERR_ORDER_CANNOT_BE_CANCELLED`; B veya D'ye geç.
- Tamamı iade edilmiş siparişte yeni iade → `ERR_ORDER_ALREADY_FULLY_REFUNDED`.
