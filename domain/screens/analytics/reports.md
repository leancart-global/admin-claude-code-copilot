# Raporlar (Analitik) — şablon listesi, rapor detayı, yeni şablon

| URL | Sayfa başlığı (tr / en) | Amaç |
|---|---|---|
| `{ADMIN_URL}/analytics/reports` | "Raporlar / Reports" ("Şablonlardan rapor oluşturun ve dışarı aktarın") | Şablon listesi, rapor üretme/dışa aktarma, zamanlanmış raporlar, kategoriye göre gelir |
| `{ADMIN_URL}/analytics/reports/{id}` | şablon adı | Tek şablon için tarih aralığıyla rapor üretme, sonucu görme, dışa aktarma |
| `{ADMIN_URL}/analytics/reports/templates/new` | "Yeni Rapor Şablonu / New Report Template" | Yeniden kullanılabilir şablon oluşturma (opsiyonel e-posta zamanlaması) |

- Menü yolu: "Analitik / Analytics" → sekme "Raporlar / Reports". Panel → Hızlı İşlemler → "Raporları Gör" de buraya gelir.
- Entity: [../../entities/report.md](../../entities/report.md).
- Yetki: liste/detay/üret/dışa aktar `analytics:read`; şablon oluştur/sil `analytics:write`.
- Kişisel veri: Müşteri boyutlu raporlar ve dışa aktarılan dosyalar müşteri bilgisi içerebilir (doğrulanmadı) → dışa
  aktarmayı yalnız kullanıcı isterse yap. Zamanlama **alıcı e-posta adresleri** saklar.
- Not: Bu ekran **mali raporlar** (fatura, ödeme, iade) değildir; onlar için [../reports/reports-overview.md](../reports/reports-overview.md).

## Ön koşullar ve bağımlılıklar
- Rapor üretmek için önce bir şablon olmalı. Başka ön koşul kayıt yok.

## 1. Liste (`/analytics/reports`)

### Yerleşim
1. Başlık + sağda "Yeni Şablon / New Template" (→ `/analytics/reports/templates/new`).
2. Arama kutusu (placeholder "Şablon ara... / Search templates...") — ad ve açıklamada arar.
3. Tür filtresi butonları: "Tüm Türler / All Types" + mevcut her tür için (sayı rozetiyle).
4. Tablo: "Şablon" (ad + açıklama), "Tür", "Görselleştirme", "Oluşturulma", satır sonu "⋯" (aria-label
   "İşlemler / Actions") → "Rapor Oluştur / Generate", "Sil / Delete". Satırın kendisi tıklanmaz.
5. Sayfalama: 20 satır/sayfa; "{total} kayıttan {start}-{end} arası gösteriliyor", "Önceki", "Sayfa {current} / {total}", "Sonraki".
6. Boş: "Henüz rapor şablonu yok" + "Başlamak için ilk rapor şablonunuzu oluşturun"; filtreyle boş: "Eşleşen şablon yok".
7. **"Zamanlanmış Raporlar / Scheduled Reports"** ("Otomatik olarak e-postanıza gönderilen raporlar"): "Rapor",
   "Sıklık", "Sonraki Çalışma", "Son Çalışma" (hiç çalışmadıysa "Hiç"), "Durum" ("Aktif" / "Duraklatıldı"). Salt
   okunur; buradan düzenleme/duraklatma yapılmaz. Boş: "Henüz zamanlanmış rapor yok".
8. **"Kategoriye Göre Gelir / Revenue by Category"**: "Kategori", "Gelir", "Pay" (çubuk + %). Boş: "Gelir verisi mevcut değil".
   Dönemi ekranda yazmaz (doğrulanmadı).

### "Rapor Oluştur" diyaloğu
| Label (tr / en) | Kontrol tipi | Zorunlu | Varsayılan | Locator ipucu |
|---|---|---|---|---|
| Başlangıç Tarihi / Start Date | date input | evet | bugün − 30 gün | `#startDate` |
| Bitiş Tarihi / End Date | date input | evet | bugün | `#endDate` |
| Dışa Aktarma Formatı / Export Format | Select | — | PDF | "PDF Belgesi", "CSV Tablosu", "Excel Çalışma Kitabı", "JSON Verisi" |

Butonlar: "Vazgeç", **"Raporu Görüntüle / View Report"** (raporu üretir → detay sayfasına gider), **"Dışa Aktar /
Export"** (dosyayı üretip indirme bağlantısını yeni sekmede açar). Tarih boşsa toast "Please select a date range to continue".

### Aksiyonlar
| Aksiyon | Ne olur | Toast |
|---|---|---|
| ⋯ → Rapor Oluştur → Raporu Görüntüle | Rapor üretilir, `/analytics/reports/{id}` açılır | "Report generated successfully" |
| ⋯ → Rapor Oluştur → Dışa Aktar | Dosya üretilir, indirme bağlantısı yeni sekmede açılır (bağlantı ~24 saat geçerli) | "Report exported successfully" |
| ⋯ → Sil → "Rapor Şablonunu Sil" ("Bu şablonu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.") → "Sil" | Şablon kalıcı silinir; varsa zamanlaması da durur | "Template deleted successfully" |

## 2. Rapor detayı (`/analytics/reports/{id}`)

### Yerleşim
1. Başlık: şablon adı (+ açıklama).
2. "Rapor Oluştur / Generate Report" kartı ("Tarih aralığı seçin, ardından raporu oluşturun veya dışa aktarın"):
   "Başlangıç Tarihi" `#startDate`, "Bitiş Tarihi" `#endDate` (varsayılan son 30 gün), "Oluştur / Generate";
   "Format" Select (PDF, CSV, Excel, JSON) + "Dışa Aktar / Export".
3. Sonuç (Oluştur'dan sonra): "Özet / Summary" kartı (anahtar–değer), "Veri / Data" tablosu ("{count} satır"); 50'den
   fazla satırda "{total} satırın ilk {shown} tanesi gösteriliyor. Tüm veri için dışa aktarın."
4. Sonuç yokken: "Rapor Verisi Yok" + "Tarih aralığı seçin ve raporu görüntülemek için Oluştur'a tıklayın" + "Rapor Oluştur".
5. "Şablon Detayları / Template Details": "Metrikler", "Boyutlar", "Görselleştirme", "Oluşturulma".
6. Şablon bulunamazsa: "Rapor Bulunamadı" + "Rapor şablonu bulunamadı" + "Raporlara Dön".
- Bu sayfada şablon düzenleme veya silme yok (silme listeden).

### Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Oluştur | Seçili aralık için rapor üretilir ve sayfada gösterilir | "Report generated successfully" / tarih yoksa "Please select date range" |
| Dışa Aktar | Seçili format için dosya üretilir, bağlantı yeni sekmede açılır | "Report exported successfully" |

## 3. Yeni şablon (`/analytics/reports/templates/new`)

### Alanlar
| Kart | Label (tr / en) | Kontrol tipi | Zorunlu | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Şablon Ayarları | Şablon Adı * / Template Name * | Input | **evet** | — | `#name` (placeholder "örn., Haftalık Satış Raporu") | Boşsa toast "Lütfen bir şablon adı girin" |
| | Açıklama / Description | Textarea | hayır | — | `#description` | |
| | Rapor Türü / Report Type | Select | — | Gelir Raporu | label "Rapor Türü" | Gelir, Müşteri, Ürün, Pazarlama, Operasyon, Pano, Özel ([report.md](../../entities/report.md)) |
| | Görselleştirme / Visualization | Select | — | Çizgi Grafik | label "Görselleştirme" | Tablo, Çizgi Grafik, Çubuk Grafik, Pasta Grafik |
| Metrikler | (gruplu onay kutuları) | Checkbox | **≥1** | Toplam Gelir + Toplam Sipariş işaretli | `#<metrik_kodu>` (ör. `#total_revenue`) veya label metni | Hiç yoksa toast "Lütfen en az bir metrik seçin". Liste: [report.md](../../entities/report.md) |
| Boyutlar | (onay kutuları) | Checkbox | hayır | Tarih işaretli | `#date`, `#product`, `#category`, `#customer_segment`, `#channel`, `#device`, `#country`, `#city` | |
| Zamanlama (Opsiyonel) | (kart başlığındaki onay kutusu) | Checkbox | — | kapalı | "Zamanlama (Opsiyonel)" başlığının yanındaki checkbox | Açınca alt alanlar görünür |
| | Sıklık / Frequency | Select | — | Haftalık | label "Sıklık" | Tek seferlik, Günlük, Haftalık, Aylık, Üç Aylık |
| | Haftanın Günü / Day of Week | Select | Haftalık'ta | Pazartesi | label | |
| | Ayın Günü / Day of Month | number | Aylık'ta | 1 | label | 1–28 |
| | Saat / Time | time input | — | 09:00 | label "Saat" | Saat dilimi doğrulanmadı (UTC olabilir) |
| | Alıcılar (virgülle ayrılmış e-postalar) / Recipients | Input | zamanlama açıksa **evet** | — | placeholder "admin@ornek.com, mudur@ornek.com" | Boşsa toast "Lütfen en az bir alıcı e-postası girin". Adresi kullanıcıdan al, uydurma |

Butonlar: "Vazgeç / Cancel" (geri), "Şablon Oluştur / Create Template".

### Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Şablon Oluştur | Şablon kaydedilir, listeye dönülür; zamanlama açıksa "Zamanlanmış Raporlar" tablosunda görünür | "Rapor şablonu başarıyla oluşturuldu" / "Şablon oluşturulamadı" |

## Onay zamanlaması (kural 2/5/6)
- **Şablon Oluştur**: kalıcı kayıt → özet tablo (ad, tür, görselleştirme, metrikler, boyutlar, zamanlama) + onay.
- **Zamanlama + Alıcılar → DIŞ E-POSTA GÖNDERİMİ**: zamanlanmış rapor, belirtilen e-posta adreslerine **otomatik ve
  tekrar eden e-posta** gönderir (mağaza verisi dışarı çıkar). Özette alıcı listesini, sıklığı, gün/saati ve "bu
  adreslere düzenli rapor gidecek" uyarısını **kalın** göster; alıcılar mağaza ekibi dışındaysa ayrıca teyit al.
  Rapor içeriğinde müşteri verisi olabilir.
- **Sil**: geri alınamaz; şablon adıyla tek tek onay. Zamanlanmış raporu da durdurur → özette belirt.
- **Raporu Görüntüle / Oluştur**: kayıt değiştirmez (yalnız şablonun kullanım bilgisi güncellenir); onay gerekmez.
- **Dışa Aktar**: kayıt değiştirmez ama veri dosyası indirir → kullanıcı istemedikçe yapma; dosyayı kullanıcıya bırak.

## Yan etkiler
- Zamanlanmış şablon, sıklığa göre alıcılara e-posta gönderir; bir sonraki gönderim "Sonraki Çalışma" sütununda görünür.

## Tuzaklar
- Listeden "Raporu Görüntüle" detay sayfasına götürür; detayda sonucu görmek için tarih aralığını kontrol edip
  **"Oluştur"a yeniden bas** (detay sayfası açılışta sonuç göstermez).
- Liste araması ve tür filtresi yalnız yüklenen şablonlarda çalışır (en çok 50 şablon — doğrulanmadı).
- Zamanlamanın düzenlenmesi/duraklatılması için ekranda alan yok; gerekiyorsa kullanıcıya bildir.
- Metrik adları Panel/Analitik KPI'larıyla aynıdır; tanımlar [report.md](../../entities/report.md).
- Bu ekranlarda kayıt ve rapor üretimi canlıda henüz denenmedi (doğrulanmadı); beklenmedik hata alırsan dur ve kullanıcıya sor.

## Doğrulama
- Şablon oluşturma: toast + listede yeni satır (ad, tür, görselleştirme); zamanlama açıksa "Zamanlanmış Raporlar"
  tablosunda satır, sıklık ve "Aktif/Duraklatıldı" durumu.
- Silme: toast + satırın kalkması.
- Rapor: detay sayfasında "Özet" ve "Veri" kartlarının dolu olması; raporlarken tarih aralığını belirt.
