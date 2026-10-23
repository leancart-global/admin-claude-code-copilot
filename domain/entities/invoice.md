# Entity: Invoice (Fatura) — standart, iade faturası, fark faturası

Siparişe bağlı satış belgesi. Nasıl kesildiğini mağazanın **fatura modu** belirler
([../screens/settings/einvoice.md](../screens/settings/einvoice.md)):

| Fatura modu (ayar) | Bu modda kod adı | Sipariş detayında fatura nasıl oluşur |
|---|---|---|
| Platform Faturalama | `platform` | "Fatura Oluştur" → fatura oluşturulur ve **hemen e-Fatura sağlayıcısına (GİB) gönderilir**. "Otomatik Fatura" açıksa kargo oluşturulunca kendiliğinden kesilir |
| Muhasebe Programı | `accounting` | Sipariş kargoya verilince taslak fatura otomatik oluşur; muhasebe programında kesildikten sonra "Faturalandırıldı İşaretle" |
| Muhasebeci / Manuel | `external` | Muhasebecinin kestiği fatura PDF olarak yüklenir ("Fatura Yükle") |

- Ekranlar: [../screens/orders/order-detail.md](../screens/orders/order-detail.md) (Faturalar kartı — tüm yazma
  işlemleri), [../screens/orders/invoices.md](../screens/orders/invoices.md) (tüm faturalar, salt okunur).
- İlgili: [order.md](order.md).

## Alanlar (ekranda görünen)
| Alan | Not |
|---|---|
| Fatura No | Sağlayıcı ön ekleriyle (e-Fatura/e-Arşiv ön eki); iade faturası `CN-` önekli |
| Sipariş No | Siparişe link |
| Müşteri, Tutar, Para birimi | |
| Durum | aşağıda |
| Kanal | e-Fatura (B2B, alıcı GİB'e kayıtlı mükellef) · e-Arşiv (B2C) · Harici |
| Kaynak | Dahili (platformda oluşturulan) · Harici (yüklenen / muhasebe) |
| GİB durumu | Beklemede · Gönderildi · Kabul Edildi · Reddedildi · İptal Edildi |
| Alıcı vergi bilgisi | VKN (10 hane) veya TCKN (11 hane), vergi dairesi, firma/alıcı adı |
| Düzenleme / vade / ödeme tarihi, ödenen / kalan tutar | Kalan > 0 ise "Kalan: {tutar}" |
| Tür rozeti | "İade Faturası" (credit note) · "Fark Faturası" (debit note) |

## Enum'lar
| Enum | Değerler |
|---|---|
| Durum | `DRAFT` Taslak · `SENT` Gönderildi · `VIEWED` Görüntülendi · `PAID` Ödendi · `PARTIALLY_PAID` Kısmen Ödendi · `OVERDUE` Vadesi Geçmiş · `VOID` İptal Edildi · `REFUNDED` İade Edildi · `INVOICED_IN_ERP` ERP'ye Aktarıldı · `CANCELLED` İptal |
| Liste filtresi durumları | Taslak, Gönderildi, Ödendi, İptal Edildi (`VOID`), İptal (`CANCELLED`) |
| Kanal | `e-fatura`, `e-arsiv`, `external` |
| Kaynak | `internal`, `external` |
| Tür | standart · `credit_note` İade Faturası · `debit_note` Fark Faturası |

## Kurallar
| Kural | Sonuç / mesaj |
|---|---|
| Platform modunda sipariş başına en çok bir aktif (iptal edilmemiş) standart fatura; varken "Fatura Oluştur" görünmez | — |
| Fatura için mağazanın şirket bilgileri ve VKN'si tanımlı olmalı | "Şirket vergi kimliğiniz (VKN) yapılandırılmamış…", "Şirket bilgileri yapılandırılmamış…" |
| Siparişte fatura adresi ve kalem olmalı | "Bu siparişte fatura adresi bulunmuyor…", "Bu siparişte ürün bulunmuyor…" |
| e-Fatura/e-Arşiv gönderimi için alıcının VKN veya TCKN'si gerekli | "Alıcı vergi kimliği (VKN veya TCKN) eksik…" |
| GİB'e gönderilmiş fatura panelde düzenlenemez/silinemez; düzeltme **iade faturası** veya **fark faturası** ile yapılır | — |
| **e-Arşiv iptali** yalnız gönderimden sonraki **7 gün** içinde ve yalnız e-Arşiv kanalında; bağlı iade/fark faturası varsa önce onlar iptal edilir | "İptal Edilemez — Önce bağlı faturaları iptal edin…" |
| "İptal Et" (void) platform modunda yalnız taslak faturada; diğer modlarda ödenmemiş faturada. Neden ≥10 karakter | GİB'e kabul edilmiş fatura için uyarı: "Burada iptal etmek GİB'de iptal ETMEZ…" |
| İade faturası / fark faturası yalnız Gönderildi, Ödendi veya ERP'ye Aktarıldı durumundaki standart faturadan; **taslak** olarak oluşur, ayrıca gönderilir | — |
| İade faturası tutarı boşsa tam tutar (kargo dahil) | — |
| Ödeme kaydetme yalnız platform dışı modlarda ve kalan tutar > 0 iken | — |
| Harici yükleme yalnız PDF, en çok 10 MB | "Yalnızca PDF dosyaları yüklenebilir", "Dosya 10 MB sınırından büyük" |
| Sağlayıcı kontörü bitmişse | "Sovos kontörü tükenmiş. Lütfen faturayı manuel olarak yükleyin." |

## Geri alınabilirlik
- GİB'e gönderim (e-Fatura/e-Arşiv) **yasal belge** üretir; geri alınması yalnız e-Arşiv'de 7 gün içinde iptal ile, aksi
  halde iade faturasıyla mümkündür.
- Taslak fatura (platform) "Faturayı Yeniden Oluştur" ile güncel sipariş verisinden yeniden üretilebilir.

## İlişkiler
| İlişki | Not |
|---|---|
| Fatura → sipariş | n..1 |
| İade/fark faturası → asıl fatura | n..1 |
| Fatura → e-Fatura sağlayıcısı | Varsayılan sağlayıcı ve ortamı (Test/Canlı) [../screens/settings/einvoice.md](../screens/settings/einvoice.md) |
| Fatura → şirket bilgileri | Genel Ayarlar (VKN, unvan, vergi dairesi) [../screens/settings/general.md](../screens/settings/general.md) |
