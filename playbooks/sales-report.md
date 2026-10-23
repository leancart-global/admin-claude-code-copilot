# Playbook: Satış / iade / sipariş raporu oku ("geçen ayın satışlarını özetle")

Tetikleyiciler: "bugün kaç sipariş geldi", "geçen ayın satışlarını özetle", "bu hafta ciro ne kadar", "en çok satan
ürünler", "en çok iade edilen ürünler", "başarısız ödemeler var mı", "dönüşüm oranımız ne", "hangi şehirden satış geliyor".
**Salt okunur** bir tariftir: hiçbir kayıt oluşturmaz/değiştirmez.

Harita: ../domain/screens/dashboard/dashboard.md (Panel + Günlük Özet), ../domain/screens/analytics/analytics-overview.md,
../domain/screens/analytics/realtime.md, ../domain/screens/analytics/geographic.md, ../domain/screens/analytics/reports.md,
../domain/screens/reports/payments.md, ../domain/screens/reports/refunds.md, ../domain/screens/orders/orders-list.md,
../domain/screens/orders/orders-analytics.md, ../domain/screens/customers/customers-analytics.md,
../domain/screens/inventory/inventory-reports.md. Metrik tanımları: ../domain/entities/report.md.

---

## 0. Kural hatırlatması
- Okuma serbesttir; **onay gerekmez**. Ama şunlar kalıcıdır ve bu tarifin parçası değildir: rapor şablonu oluşturma,
  zamanlanmış rapor (e-posta gönderir), şablon silme, Panel'de "Kurulum listesini Kapat", ayarlardaki "Çerezsiz
  ziyaretçi sayımı" anahtarı. Kullanıcı bunlardan birini isterse ilgili haritanın onay kuralını uygula.
- **Dışa aktarma** (sipariş CSV, ödeme CSV, rapor PDF/CSV) kayıt değiştirmez ama kişisel/mali veri indirir →
  kullanıcı açıkça istemedikçe yapma.
- Rapora müşteri adı/e-postası koyma; sipariş no, adet ve tutar yeterli.
- Rakamı her zaman **kaynağıyla ve dönemiyle** ver ("Panel, Son 30 Gün: …"); takvim dönemi istenip kayan dönem
  kullandıysan bunu açıkça yaz.
- Ortam adını (config/local.json) raporun başına yaz. "Demo Veri" rozeti görürsen rakamları gerçek diye sunma.

## 1. İsteği çözümle
| Soru | Belirle |
|---|---|
| Hangi metrik? | sipariş adedi, ciro, AOV, dönüşüm, ziyaretçi, en çok satan, iade, ödeme durumu, coğrafya |
| Hangi dönem? | bugün / dün / son N gün (kayan) / bu ay / geçen ay (takvim) / özel aralık |
| Kıyas istendi mi? | önceki döneme göre % (Panel/Analitik kartlarında hazır) |
| Kırılım? | ürün, müşteri, kategori, ülke/şehir, cihaz, kanal, ödeme sağlayıcısı |
Dönem belirsizse ("satışlar nasıl?") varsayılan **Son 30 Gün** kullan ve özette "varsayılan" diye işaretle.

## 2. Kaynak seçimi
| İstek | Birincil kaynak | Not |
|---|---|---|
| Bugün kaç sipariş / bugünkü ciro | Panel `/` → "Mağaza aktivitesi" şeridi: "Bugünün Siparişleri", "Bugünün Geliri", "Bekleyen", "İşleniyor" | Kontrol: `/orders` → Tarih aralığı "Bugün" → başlıktaki toplam sayı (iptaller dahil olabilir) |
| Dün nasıl geçti | `/dashboard/digest` (varsayılan "Dün") | Gün = UTC günü; ciro, sipariş, ziyaretçi, dönüşüm + "düne göre" |
| Son 7/30/90 gün ciro, sipariş, AOV, dönüşüm | Panel → Dönem seç; ya da `/analytics` (Bu ay seçeneği de var) | Kayan dönem; önceki döneme göre % hazır |
| Bu ay | `/analytics` → Dönem "Bu ay" | Takvim ayı başından bugüne |
| Geçen ay (takvim) / özel tarih aralığı | Sipariş adedi: `/orders` → Tarih aralığı "Geçen Ay" (ya da gelişmiş filtre "Sipariş Oluşturuldu" başlangıç–bitiş) → başlıktaki toplam | Ciro toplamı listede yok → §4 |
| En çok satan ürünler | Panel "En İyi Ürünler" (adet + gelir, ilk 6) ya da `/analytics` "En Çok Satan Ürünler" (gelire göre, ilk 5) | Seçili döneme göre |
| En iyi müşteriler | Panel / `/analytics` tabloları; ayrıntı `/customers/analytics` | Ad yerine sıra + tutar raporla |
| En iyi kategoriler | `/analytics` "En İyi Kategoriler"; `/analytics/reports` "Kategoriye Göre Gelir" | |
| Ülke/şehir, tarayıcı | `/analytics/geographic` | |
| Cihaz, trafik kanalı | `/analytics/realtime` (son 30 gün) | |
| Ziyaretçi, sayfa görüntüleme | `/analytics` "Ziyaretçi" kartı (+ ayrı "Onay vermeyen ziyaretçiler" kartı) | İkisini toplama |
| İade özeti | `/reports/refunds` → tarih aralığı (+ Durum "İade Edildi") | İptal dekontları toplamda yok; çoklu para biriminde para birimi filtresi |
| En çok iade edilen ürünler | §5 | Ekranda ürün bazlı iade sıralaması yok |
| Başarısız / itirazlı ödemeler | `/reports/payments` → Durum "Başarısız" / "İtiraz Edildi" + tarih | "Kurtarma" sütunundaki "İlgi bekliyor"/"İade başarısız" satırlarını ayrıca bildir |
| Stok yaşlanması, yeniden sipariş | `/inventory/reports/aging`, `/inventory/reports/reorder` | |

## 3. Oku
1. İlgili URL'ye `browser_navigate` ile git (header aramasında Enter kullanma).
2. Dönem seçicisini haritadaki gibi aç → seçeneğe tıkla (Enter yok). İskelet kartlar kaybolana kadar bekle
   (`browser_wait_for`).
3. `browser_snapshot` ile kart başlığı + değer + değişim metnini, tabloların ilk satırlarını oku. Ekran görüntüsü
   ancak kullanıcı grafik isterse.
4. Oturum düştüyse (login'e yönlenme) dur, kullanıcıdan tarayıcıda yeniden girmesini iste.

## 4. Takvim dönemi cirosu ("geçen ayın satışları")
Panel ve Analitik'te "geçen ay" seçeneği yoktur. Sırayla:
1. **Sipariş adedi**: `/orders` → Tarih aralığı "Geçen Ay" → başlıktaki toplam sayı. Gerekirse Durum filtresiyle
   iptalleri ayrı say (kural: panel gelirinde iptal ve tam iade hariçtir).
2. **Ciro**: `/analytics/reports` → mevcut bir "Gelir Raporu" şablonu varsa ⋯ → "Rapor Oluştur" → Başlangıç = geçen
   ayın 1'i, Bitiş = son günü → "Raporu Görüntüle" → detayda "Oluştur". (Şablon oluşturmak kalıcıdır → yoksa
   kullanıcıya sor, onaylarsa reports haritasındaki onay akışıyla oluştur; zamanlama ekleme.)
3. Rapor üretilemezse ya da şablon istenmezse: yaklaşık değer olarak Panel → "Son 30 Gün" rakamını ver ve **"kayan
   30 gün, takvim ayı değil"** diye açıkça yaz; kesin tutar için sipariş listesi dışa aktarımını öner (kişisel veri
   içerir, kullanıcı kendisi indirir).

## 5. "En çok iade edilen ürünler"
Hazır bir ekran yoktur. Kullanıcıya bunu söyle ve seçenek sun:
- **Hızlı**: `/reports/refunds` → dönem + Durum "İade Edildi" → dekont sayısı, toplam, en yüksek tutarlı dekontlar
  (sipariş ID'leriyle) ve "Neden" sütunundaki sık nedenler.
- **Ürün bazlı (yavaş)**: listedeki her dekontun siparişini `/orders/{id}` detayında açıp iade edilen kalemleri say.
  20'den fazla dekont varsa önce kullanıcıya süreyi söyle ve onayını al (salt okuma ama uzun sürer).
- Sonucu "örneklem: {n} dekont, {dönem}" diye etiketle.

## 6. Rapor formatı (sohbete)
```
Ortam: prod · Kaynak: Panel (Son 30 Gün, önceki aya göre)
| Metrik | Değer | Değişim |
|---|---|---|
| Toplam Gelir | ₺… | +%… |
| Siparişler | … | … |
| Ort. Sipariş Değeri | ₺… | … |
| Dönüşüm Oranı | %… | … |
En çok satan 3 ürün: 1) … (… adet, ₺…) …
Notlar: kayan 30 gün (takvim ayı değil); iptal ve tamamen iade edilen siparişler hariç; rakamlar ~5 dk gecikmeli olabilir.
```
- Kişisel veri (müşteri adı/e-posta) yazma; gerekiyorsa "1. müşteri: 7 sipariş, ₺…" biçiminde ver.
- Farklı ekranlardan gelen rakamlar uyuşmazsa ikisini de kaynağıyla ver, birini "doğru" diye seçme.

## 7. Kalan işler / öneriler
- Düzenli rapor isteniyorsa ("her pazartesi bana gönder"): zamanlanmış rapor şablonu öner → bu **e-posta gönderir**,
  [../domain/screens/analytics/reports.md](../domain/screens/analytics/reports.md) onay akışıyla, alıcı adreslerini kullanıcıdan alarak.
