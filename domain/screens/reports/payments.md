# Ödeme İşlemleri (Payment Transactions)
- URL: {ADMIN_URL}/reports/payments
- Menü yolu: Sol menü "Raporlar / Reports" → "Ödeme İşlemleri / Payment Transactions"; ya da [reports-overview.md](reports-overview.md) kartı.
- Sayfa başlığı: "Ödeme İşlemleri / Payment Transactions"; açıklama "Tüm ödeme sağlayıcılarındaki işlemleri görüntüleyin".
- Amaç: Tüm ödeme sağlayıcılarındaki (PayTR, iyzico, Stripe, PayPal, Banka Havalesi…) tahsilat denemelerini durum,
  sağlayıcı ve tarihle süzmek; başarısız, itirazlı, kurtarma bekleyen ödemeleri görmek. **Salt okunur**; buradan
  iade/iptal yapılmaz (iade: [../orders/order-detail.md](../orders/order-detail.md)).
- Entity: sipariş ödemesi — [../../entities/order.md](../../entities/order.md).
- Yetki: `reports:read`.
- Kişisel veri / ödeme verisi: ekranda **kart bilgisi yoktur** (kart no, son 4 hane, CVV, kart sahibi gösterilmez);
  yalnız işlem ID, sipariş ID, sağlayıcı, tutar, durum, taksit, tarih. Sağlayıcı API anahtarları bu ekranda yok
  (onlar [../settings/payments.md](../settings/payments.md) — gizli alanlar, Claude okumaz/yazmaz).

## Ön koşullar ve bağımlılıklar
- Bir ödeme sağlayıcısının yapılandırılmış olması ([../settings/payments.md](../settings/payments.md)); işlemler
  vitrin/admin siparişlerinin ödeme denemelerinden oluşur.

## Yerleşim
1. Kart başlığı (kart ikonu) + toplam sayı rozeti; sağda "CSV İndir / Export CSV" (dar ekranda yalnız ikon).
2. Filtre satırı: arama (placeholder "Ara..."), "Durum" Select, "Sağlayıcı" Select, "Başlangıç Tarihi", "Bitiş Tarihi".
3. Aktif filtre rozetleri ("Durum: …", "Sağlayıcı: …", "Başlangıç Tarihi: …" ×) — rozete tıklamak o filtreyi kaldırır.
4. Tablo: "İşlem ID", "Sipariş ID", "Sağlayıcı" (rozet), "Tutar", "Para Birimi", "Durum" (renkli rozet), "Kurtarma /
   Recovery", "Taksit" ("1" ya da "{n}x {tutar}"), "Tarih". Satırlar tıklanmaz; sipariş ID düz metindir.
5. Sayfalama: 20 satır/sayfa; "{total} sonuçtan {from} - {to} arası gösteriliyor", "Önceki", "Sayfa {current} / {total}", "Sonraki".
6. Boş: "Ödeme işlemi bulunamadı" + ("Mevcut filtrelerinizle eşleşen işlem bulunamadı…" ya da "Siparişler işlendikçe
   ödeme işlemleri burada görünecektir."). Hata: "Ödeme işlemleri yüklenemedi. Lütfen tekrar deneyin."

## Alanlar (filtreler)
| Label (tr / en) | Kontrol tipi | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|
| Ara... / Search... | Input | boş | placeholder "Ara..." | **Sipariş ID** veya **sağlayıcı işlem referansı** içinde kısmi arar (~0,3 sn gecikmeli) |
| Durum / Status | Select | "Tüm Durumlar" | placeholder "Durum" | Beklemede, İşleniyor, Yetkilendirildi, Başarılı, Başarısız, İptal Edildi, İade Edildi, Kısmen İade Edildi, İtiraz Edildi, İşlem Bekliyor |
| Sağlayıcı / Provider | Select | "Tüm Sağlayıcılar" | placeholder "Sağlayıcı" | PayTR, iyzico, Stripe, PayPal, Banka Havalesi |
| Başlangıç Tarihi / From Date | date input | boş | placeholder "Başlangıç Tarihi" | O günün başından itibaren |
| Bitiş Tarihi / To Date | date input | boş | placeholder "Bitiş Tarihi" | O günün sonu dahil |
- Her filtre değişikliği 1. sayfaya döner. Sıralama: en yeni işlem üstte.

### Durum ve kurtarma rozetleri
| Rozet | Anlam |
|---|---|
| Başarılı | Tahsil edildi |
| Yetkilendirildi | Provizyon alındı, henüz tahsil edilmedi |
| İşlem Bekliyor | Müşterinin ek adımı (ör. 3D doğrulama) bekleniyor |
| Başarısız / İptal Edildi | Tahsilat olmadı |
| İade Edildi / Kısmen İade Edildi | Tahsilatın tamamı / bir kısmı iade edildi |
| İtiraz Edildi | Müşteri itirazı (chargeback) — para risk altında |
| Kurtarma: "Yeniden deneniyor / Retrying" | Tahsil edildi ama siparişe bağlanması sistemce yeniden deneniyor |
| Kurtarma: "İlgi bekliyor / Needs attention" | Tahsilat siparişe bağlanamadı; insan müdahalesi gerekir |
| Kurtarma: "Otomatik iade edildi" | Siparişe bağlanamayan tahsilat müşteriye otomatik iade edildi |
| Kurtarma: "İade başarısız" (+ "Müşteriye sağlayıcı panelinden iade edin") | Otomatik iade yapılamadı |
| "Tahsil edilen tutar siparişle uyuşmuyor" / "Taksit planı siparişle uyuşmuyor" | Tahsilat ile sipariş arasında tutar/taksit farkı |

- Kurtarma rozetlerinin anlamı etiket metinlerinden çıkarıldı (doğrulanmadı). Rozet yoksa kurtarma gerekmemiştir.

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Filtreler / sayfalama | Liste yeniden yüklenir | hata: "Ödeme işlemleri yüklenemedi…" |
| CSV İndir | **Yalnız ekrandaki sayfayı** (en çok 20 satır) `payment-transactions-YYYY-AA-GG.csv` olarak indirir. Sütunlar: Transaction ID, Order ID, Provider, Amount, Currency, Status, Installments, Date | "Ödeme işlemleri başarıyla dışarı aktarıldı"; boşsa "Dışarı aktarılacak veri yok…" |

## Onay zamanlaması
- Kalıcı değişiklik, e-posta veya dış sisteme yazım yok.
- **CSV İndir**: kayıt değiştirmez ama mali veri dosyası indirir → kullanıcı istemedikçe yapma; isterse hangi
  filtre/sayfanın ineceğini söyle, dosyayı kullanıcıya bırak (içeriğini sohbete dökme).
- "İlgi bekliyor" / "İade başarısız" satırları için yapılacak iş (sağlayıcı panelinden iade, siparişle eşleştirme)
  bu ekranda değildir; kullanıcıya bildir, kendiliğinden işlem başlatma.

## Yan etkiler
- Yok.

## Tuzaklar
- CSV tüm filtre sonucunu değil, yalnız görünen sayfayı içerir; tümü için sayfa sayfa indirmek gerekir.
- Bir sipariş için birden çok işlem olabilir (başarısız deneme + başarılı tahsilat); siparişin ödeme durumunu
  [../orders/order-detail.md](../orders/order-detail.md)'den teyit et.
- Tutarlar işlemin kendi para birimindedir; farklı para birimlerini toplama.

## Doğrulama
- Filtre rozetlerini ve toplam sayıyı snapshot ile oku; raporlarken filtreyi belirt ("Son 7 gün, Başarısız: 4 işlem").
