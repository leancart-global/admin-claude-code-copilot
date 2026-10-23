# Toplu Kupon Üret (Generate coupon batch)
- URL: {ADMIN_URL}/marketing/coupons/bulk
- Menü yolu: "Pazarlama / Marketing" → "Kuponlar / Coupons" → sağ üstte "Toplu üret / Generate batch"
  (`data-testid="coupon-bulk-action"`).
- Sayfa başlığı: "Toplu kupon üret / Generate coupon batch"; açıklama "Aynı promosyonu açan çok sayıda benzersiz kodu tek
  seferde oluşturun. / Create many unique codes at once, all unlocking the same promotion."
- Amaç: Bir promosyona bağlı, her biri benzersiz çok sayıda kod üretmek (ör. 500 tek kullanımlık kod; e-posta listesi,
  ambalaj kartı, iş ortağı dağıtımı). İndirim kodlardan değil promosyondan gelir.
- Entity: [../../entities/coupon.md](../../entities/coupon.md). Tekil kupon ekranları: [coupons.md](coupons.md).
- Yetki: `marketing:create` (yoksa "Yönlendiriliyor..." → kupon listesi).

## Ön koşullar ve bağımlılıklar
- En az bir promosyon ([promotions.md](promotions.md)); yoksa "Önce bir promosyon gerekiyor" kutusu + "Promosyon oluştur".
- Promosyon kodların vitrinde çalışması için **Yayında / Aktif** olmalı. Promosyonun "Toplam kullanım sınırı" partideki
  tüm kodların toplam kullanımını sınırlar; "Müşteri başına sınır" bir müşterinin partiden kaç kod kullanabileceğini sınırlar.
- Mağaza saat dilimi ([coupons.md](coupons.md) "Ön koşullar").

## Yerleşim
### Form görünümü
1. "Kuponlara dön / Back to coupons".
2. Kart "Promosyon / Promotion" — "Bu partideki her kod, burada seçtiğiniz promosyonu açar…" + promosyon seçici + seçilince
   "Bu kupon şu indirimi açar" özeti.
3. Kart "Parti boyutu ve kod biçimi / Batch size and code format" — Kaç kod, Kod ön eki, Kod son eki.
4. Kart (başlıksız): "Kupon türü / Coupon type" radyoları; "Geçerlilik / Validity" (başlangıç/bitiş); "Kullanım / Usage"
   (Kullanım limiti, Açıklama).
5. Alt sabit çubuk: "İptal / Cancel", "Kodları üret / Generate codes" (`data-testid="bulk-generate-button"`).

### Sonuç görünümü (üretimden sonra aynı sayfada; `data-testid="bulk-coupon-result"`)
1. Kart "Kodlarınız hazır / Your codes are ready" + "{n} kod oluşturuldu, {m} atlandı."
2. Rozetler "{n} oluşturuldu" (`bulk-result-success`), varsa "{m} atlandı" (`bulk-result-failed`).
3. Butonlar "Tümünü kopyala / Copy all" (`bulk-result-copy`), "CSV indir / Download CSV" (`bulk-result-download`).
4. Kod listesi kutusu (`bulk-result-codes`).
5. Alt: "Kuponlara dön", "Yeni parti üret / Generate another batch" (sonucu kapatıp boş forma döner).

## Alanlar
| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Promosyon | Promosyon / Promotion * | Select | evet | "Bu kodların açacağı promosyonu seçin." | `#coupon-promotion`, `data-testid="coupon-promotion-trigger"` | Seçenekler ve kurallar [coupons.md](coupons.md) ile aynı |
| Parti | Kaç kod / How many codes * | number | evet | 1–10.000, tam sayı; varsayılan **100**; hata "1 ile 10000 arasında bir kod adedi girin." | `#bulk-quantity`, `data-testid="bulk-quantity-input"` | İpucu "Parti başına 1 ile 10000 kod arasında." Daha fazlası için birden çok parti |
| Parti | Kod ön eki / Code prefix | Input | hayır | ≤16 karakter; placeholder "örn. YAZ" | `#bulk-prefix` | |
| Parti | Kod son eki / Code suffix | Input | hayır | ≤16 karakter; placeholder "örn. 2030" | `#bulk-suffix` | "Ön ek ve son ek, rastgele bir kodu sarar; örneğin YAZ-A1B2-2030." Gerçekte rastgele kısım 8 karakter büyük harf+rakam: `YAZ-K7Q2M9XD-2030`. Ön/son ek tire ile eklenir; kodlar büyük harfle kaydedilir (doğrulanmadı) |
| Tür | Kupon türü / Coupon type | RadioGroup | — | varsayılan "Tek Kullanımlık" | `#bulk-type-single_use`, `#bulk-type-multi_use` | Yalnız bu iki tür (pasif türler bu ekranda listelenmez) |
| Geçerlilik | Başlangıç tarihi / Valid from * | `datetime-local` | evet | "Başlangıç tarihi gereklidir."; geçmiş seçilemez | `#bulk-valid-from` | Mağaza saati |
| Geçerlilik | Bitiş tarihi / Valid until * | `datetime-local` | evet | "Bitiş tarihi gereklidir."; başlangıçtan sonra | `#bulk-valid-until` | |
| Kullanım | Kullanım limiti / Usage limit | number | — | varsayılan 1, en az 1 | `#bulk-usage-limit` | **Her kod için** ayrı limit |
| Kullanım | Açıklama / Description | Textarea | hayır | placeholder "Bu partideki her kodda görünecek isteğe bağlı not" | `#bulk-description` | Partiyi listede tanımak için önerilir (ör. "Kasım bülteni 500 kod") |

Validasyon hatasında alan altı kırmızı metin + toast "Üretmeden önce lütfen işaretli alanları düzeltin.".

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| **Kodları üret** | Girilen adette kod tek seferde oluşturulur; **hepsi doğrudan "Aktif"** (taslak seçeneği yok) → sonuç görünümü | "{n} kod oluşturuldu, {m} atlandı." Hata: "Kodlar üretilemedi. Lütfen tekrar deneyin." |
| Tümünü kopyala | Tüm kodları satır satır panoya kopyalar | "Tüm kodlar kopyalandı." |
| **CSV indir** | Tarayıcı `coupons-YYYY-MM-DD.csv` dosyasını indirir (tek sütun, başlık "Kupon kodu / Coupon code") | — |
| Yeni parti üret | Sonuç görünümünü kapatır, boş form | — |
| İptal / Kuponlara dön | Listeye döner | — |

## Onay zamanlaması (kural 2/5/6)
- **Kodları üret:** kalıcı ve toplu kayıt — **N adet canlı (Aktif) kupon** anında oluşur. Kural 5 kapsamında: özet tabloda
  adet, promosyon (ad + indirim + promosyon durumu), tür, her kodun limiti, tarihler, ön/son ek ve örnek kod biçimi,
  "durum: Aktif (hemen kullanılabilir)" yazılır; açık onay alınır. Toplu silme aracı yoktur: hatalı parti kodları tek tek
  silinmek zorunda kalır → onaydan önce değerleri iki kez kontrol et.
- **Dışa aktarma — kodlar müşteriye dağıtılan değerdir:** "CSV indir" kullanıcının bilgisayarına dosya yazar, "Tümünü
  kopyala" panoya yazar. Yalnız kullanıcı isterse ve onaylarsa tıkla; kodları sohbete toplu yapıştırma, rapora yazma,
  başka bir yere gönderme. Kullanıcıya dosyanın nereye indiğini söyle; dağıtımı kullanıcı yapar.
- **Kodlar yalnız sonuç ekranında topluca görünür.** Sayfadan ayrılınca ("Kuponlara dön", "Yeni parti üret", yenileme)
  bu liste kaybolur; kupon listesinde parti filtresi yoktur (kodlar tek tek, açıklama ile aranamaz). Kullanıcı CSV
  istiyorsa sayfadan ayrılmadan önce sor.
- E-posta/SMS gönderimi yok; kodlar müşteriye otomatik gitmez.

## Yan etkiler
- Kodlar kupon listesinde ayrı satırlar olarak görünür (sayı rozeti N artar).
- Promosyonun toplam kullanım sınırı varsa tüm partinin kullanımı bu sınırdan düşer.
- "Atlandı" sayısı, benzersiz yazılamayan kodları gösterir; nadiren > 0 olur. Eksik adet gerekiyorsa farkı ayrı parti olarak
  üret (yeni onay).

## Tuzaklar
- "Tek kullanımlık 500 kod" → Tür "Tek Kullanımlık", limit 1, adet 500. Her kod bir siparişte kullanılır.
- Bir müşterinin partiden birden çok kod kullanmasını engellemek için promosyonda "Müşteri başına sınır" kullanılmalı.
- Kodlar üretildiği anda aktiftir; dağıtım tarihinden önce kullanılmasını istemiyorsan başlangıç tarihini dağıtım
  zamanına ayarla.
- Ön/son ekte boşluk ve Türkçe karakter kullanma; ASCII büyük harf + rakam öner.

## Doğrulama
1. Toast "{n} kod oluşturuldu, {m} atlandı." ve sonuç kartındaki rozetler; n = istenen adet mi?
2. Kupon listesinde ön ekle arama (ör. `YAZ`) → kodlar Aktif, Promosyon sütunu doğru, Kullanım `0 / {limit}`.
   (Arama kod içinde geçen metne göre çalışır — doğrulanmadı.)
3. Bir kodun detayında Kupon geçerlilik aralığı ve İndirim Değeri.
