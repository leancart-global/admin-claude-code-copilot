# İade Özeti (Refund Summary)
- URL: {ADMIN_URL}/reports/refunds
- Menü yolu: Sol menü "Raporlar / Reports" → "İade Özeti / Refund Summary"; ya da [reports-overview.md](reports-overview.md) kartı.
- Sayfa başlığı: "İade Özeti / Refund Summary"; açıklama "İadeler ve alacak dekontlarına genel bakış".
- Amaç: Mağazadaki tüm **alacak dekontlarını** (iade kayıtları) özet KPI'larla ve listeyle görmek; durum, yöntem,
  para birimi ve tarihle süzmek. **Salt okunur**; iade oluşturma/onaylama/işleme sipariş detayından yapılır
  ([../orders/order-detail.md](../orders/order-detail.md), [../../../playbooks/order-cancel-refund.md](../../../playbooks/order-cancel-refund.md)).
- Entity: alacak dekontu — [../../entities/order.md](../../entities/order.md) (iade bölümü), [../../entities/invoice.md](../../entities/invoice.md) (iade faturası).
- Yetki: `reports:read` ve `orders:credit-memo:view`.
- Kişisel veri: tabloda müşteri adı yok; sipariş ID ve iade nedeni (serbest metin) görünür. Dışa aktarma yok.

## Ön koşullar ve bağımlılıklar
- İade (alacak dekontu) kayıtları siparişlerden oluşur; hiç iade yoksa boş durum görünür.

## Yerleşim
1. Çoklu para birimi uyarısı (dekontlar birden çok para biriminde ise): "Bu tenant'ta birden fazla para birimi var.
   Filtre uygulayarak para birimine göre toplamları görüntüleyin." — bu durumda tutar kartları "Karma para birimi" gösterir.
2. Özet kartları (4): "Toplam İade / Total Refunded", "İade Sayısı / Number of Refunds" ("Bu dönemde tamamlanan
   iadeler"), "Ortalama İade / Average Refund" ("İade işlemi başına"), "İade Oranı / Refund Rate" ("Toplam
   siparişlerin"; şimdilik "Hesaplanmıyor" + ipucu "Henüz hesaplanmıyor — gelecek güncellemede").
3. "Son İadeler / Recent Refunds" kartı: sağda "Yenile / Refresh".
4. Filtre satırı: arama ("Ara..."), "Durum", "Yöntem", "Para Birimi" (yalnız çoklu para biriminde ya da para birimi
   seçiliyken görünür), "Başlangıç", "Bitiş"; aktif filtre rozetleri (×).
5. Tablo: "Dekont No / Memo ID", "Sipariş / Order", "Tutar", "Yöntem", "Durum" (rozet), "Neden", "Tarih". Satırlar
   tıklanmaz. Sıralama: en yeni üstte.
6. Sayfalama: 15 satır/sayfa; "{total} sonuçtan {from} - {to} arası gösteriliyor".
7. Boş: "İade verisi bulunamadı" + ("Mevcut filtrelerinizle eşleşen iade bulunamadı…" / "İadeler işlendikçe iade
   verileri burada görünecektir."). Hata: "İade verileri yüklenemedi. Lütfen tekrar deneyin."

## Alanlar (filtreler)
| Label (tr / en) | Kontrol tipi | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|
| Ara... | Input | boş | placeholder "Ara..." | **Dekont no** veya **sipariş ID** içinde kısmi arar |
| Durum / Status | Select | "Tüm Durumlar" | placeholder "Durum" | Beklemede, Onaylandı, İşleniyor, İade Edildi, İptal |
| Yöntem / Method | Select | "Tüm Yöntemler" | placeholder "Yöntem" | Orijinal Ödeme, Mağaza Kredisi, Banka Havalesi |
| Para Birimi / Currency | Select | "Tüm para birimleri" | placeholder "Para Birimi" | Yalnız çoklu para biriminde |
| Başlangıç / From | date input | boş | label "Başlangıç" | |
| Bitiş / To | date input | boş | label "Bitiş" | O günün sonu dahil |
- Özet kartları ve tablo **aynı filtrelerle** hesaplanır; filtre değişince ikisi birlikte güncellenir.

## Hesap kuralları (kartlar)
- **Durum filtresi yokken "İptal" durumundaki dekontlar toplamlara girmez** (gerçek iade sayılmaz); durum filtresi
  seçilirse yalnız o durum sayılır.
- Toplam İade = dekontların genel toplamlarının toplamı; Ortalama = Toplam ÷ İade Sayısı.
- "Beklemede/Onaylandı/İşleniyor" dekontlar da (iptal hariç) toplama dahildir; yalnız tamamlanmış iadeyi görmek için
  Durum = "İade Edildi" seç.

## Aksiyonlar
| Buton | Ne olur |
|---|---|
| Filtreler / sayfalama / Yenile | Özet ve liste yeniden okunur (kayıt değişmez) |

## Onay zamanlaması
- Kalıcı aksiyon, e-posta, dış sistem yazımı yok; onay gerekmez.
- İade onaylama/işleme gibi kalıcı adımlar sipariş detayındadır (orada ödeme sağlayıcısına yazar ve ayrı onay ister).

## Yan etkiler
- Yok.

## Tuzaklar
- Çoklu para biriminde toplamları raporlarken önce "Para Birimi" filtresiyle her para birimini ayrı oku.
- "İade Oranı" şu an hesaplanmaz; oran istenirse kullanıcıya bunu söyle, kendi hesabını "tahmini" diye işaretle
  (iade sayısı ÷ aynı dönemin sipariş sayısı; sipariş sayısı [../orders/orders-list.md](../orders/orders-list.md)'den).
- Ürün bazında iade dağılımı bu ekranda yok; bkz. [../../../playbooks/sales-report.md](../../../playbooks/sales-report.md) "en çok iade edilen ürünler".
- Ödeme sağlayıcısı tarafındaki iade hareketleri [payments.md](payments.md)'de "İade Edildi / Kısmen İade Edildi" olarak görünür.

## Doğrulama
- Kart değerlerini ve uygulanan filtre rozetlerini birlikte oku; raporda tarih aralığını ve para birimini belirt.
