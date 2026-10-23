# Playbook: Promosyon oluştur ("%20 indirim yap", "3 al 2 öde", "500 TL üzeri kargo bedava")

Tetikleyiciler: "indirim/promosyon/kampanya indirimi tanımla", "sepette %X", "X TL indirim", "kargo bedava", "kupon
kodu için indirim kur", "3 al 2 öde", "şu kategoride indirim".
Harita: ../domain/screens/marketing/promotions.md (alanlar, locator, onay zamanlaması), ../domain/entities/promotion.md
(kurallar, sipariş toplamına etkisi). Kupon: ../domain/screens/marketing/coupons.md, ../domain/entities/coupon.md.
URL'ler locale öneksizdir: `{ADMIN_URL}/marketing/promotions/new`.

---

## 0. Kural hatırlatması
- Kaydetmeden önce **özet tablo + açık "evet"** (ortam başlıkta). Promosyon ve kupon(lar) **ayrı onay**.
- Listedeki ⋯ → Yayınla / Duraklat diyalogsuz kaydeder → onayı tıklamadan önce al.
- Yayında promosyonu düzenlemek anında canlıdır; silme geri alınamaz ve bağlı kuponları bozar (ayrı onay).
- Prod'da test promosyonu açma.

## 1. İsteği çözümle → ekran neyi destekliyor?
Admin promosyon formu yalnız **sepet geneli** üç tür kurar ve indirim **kupon koduyla** tetiklenir. Kapsam (ürün,
kategori, marka, segment, store view), otomatik (kodsuz) tetikleme, adet koşulu, Al-Kazan, kademe ekranda yok.

| İstek | Ekranda karşılığı | Ne yapılır |
|---|---|---|
| "Sepette %20 indirim" / "tüm siparişlerde %20" | Yüzde İndirim 20 | Promosyon + kupon (§3) |
| "200 TL indirim" / "1000 TL üzeri 100 TL indirim" | Tutar İndirimi + (En az sepet tutarı) | Promosyon + kupon |
| "%15, en fazla 300 TL" | Yüzde 15 + En fazla indirim tutarı 300 | Promosyon + kupon |
| "500 TL üzeri kargo bedava" | (a) **Kodsuz, herkese:** kargo ayarındaki "Ücretsiz Kargo" kuralı, Minimum Sipariş Tutarı 500 → ../domain/screens/settings/shipping-carriers.md. (b) **Kodla:** Ücretsiz Kargo + En az sepet tutarı 500 + kupon | Kullanıcıya iki yolu sor; "herkese otomatik" dediyse (a) |
| "Tüm tişörtlerde %20" | **Kategori kısıtı yok.** Sepet geneli kupon tişört dışı ürünlere de indirim verir | Kullanıcıya söyle ve seçenek sun: (1) tişört ürünlerinde **İndirimli Fiyat** + tarih aralığı (ürün başına, ../domain/screens/products/product-edit.md; kodsuz, vitrinde fiyat olarak görünür), (2) sepet geneli %20 kupon (kapsam kabul edilirse). Kalıcı fiyat düşürme (toplu "Fiyatı Güncelle → Azalt %") promosyon değildir; yalnız kullanıcı açıkça isterse |
| "3 al 2 öde" / "2. ürüne %50" | **Al-Kazan türü ekranda yok** | Kullanıcıya söyle. Yakın seçenek: ilgili ürünlerde **kademe fiyatı** (Min Miktar 3, % İndirim 33.33 — ../domain/screens/products/product-edit.md Fiyatlandırma); bu "her üründe 3+ adette birim fiyat indirimi"dir, farklı ürünleri karıştıran "3 al 2 öde" değildir; sepette kademe fiyatının uygulanması doğrulanmadı — kullanıcı onaylarsa uygula, sonra sepette kontrol önerisi ver |
| "VIP müşterilere / şu segmente %10" | Segment kısıtı ekranda yok | Kullanıcıya söyle; kuponu yalnız o kitleye dağıtmak (kampanya e-postası) bir yol olabilir — dağıtım ayrı iş, ayrı onay |
| "Hafta sonu / 11.11 için" | Başlangıç–Bitiş | Saatleri mağaza saat dilimiyle netleştir |

Ekranın desteklemediği bir kısıtı API ile kurmaya çalışma (kural 3). Desteklenmeyeni raporda "yapılamadı" diye yaz.

## 2. Bilgi şablonu
| Bilgi | Form alanı | Zorunlu | Varsayılan (sorulmazsa) |
|---|---|---|---|
| Ad (iç) | Promosyon adı | evet | Öner: "{Dönem} {değer} {tür}" (ör. "Kasım %20 Sepet İndirimi") → onaylat |
| Açıklama | Açıklama | hayır | boş |
| Tür | İndirim türü | evet | — (cümleden çıkar) |
| Değer | İndirim yüzdesi / tutarı | yayın için evet | — (sor) |
| Üst sınır | En fazla indirim tutarı | hayır | boş = sınırsız ("varsayılan") |
| Alt sınır | En az sepet tutarı | hayır | boş ("varsayılan") |
| Başlangıç | Başlangıç tarihi | evet | Kullanıcı "hemen" dediyse şimdiki saat (yuvarla, ör. bir sonraki tam saat) → onaylat |
| Bitiş | Bitiş tarihi | evet | — (sor; varsayılan uydurma) |
| Toplam sınır | Toplam kullanım sınırı | hayır | boş = sınırsız ("varsayılan") |
| Müşteri başı | Müşteri başına sınır | hayır | boş = sınırsız; tek kullanımlık kampanyalarda 1 öner |
| Durum | Taslak Kaydet / Yayınla | — | **Taslak**; kullanıcı "yayına al / başlat" dediyse Yayınla |
| Kupon kodu | — (kupon ekranı) | indirim için evet | Kullanıcıya sor: tek ortak kod mu (ör. `KASIM20`), toplu tekil kodlar mı? |

## 3. Bağımlılıklar (salt okuma)
a. `{ADMIN_URL}/marketing/promotions` listesinde aynı adlı/aynı dönemli promosyon var mı ara (arama kutusu + Durum
   filtresi "Yayında"). Varsa kullanıcıya sor: güncelleme mi, yeni mi? Aynı anda birden çok sepet indirimi kuponu
   müşteriye açılacaksa bunu özette belirt.
b. Formu açınca tarih kartının altındaki saat dilimi notunu oku ("Saatler mağazanın saat dilimine göre (Europe/Istanbul).").
   "Saat dilimi seçilmemiş… UTC" uyarısı varsa dur, kullanıcıya bildir (Ayarlar → Genel'de ülke/saat dilimi; ayrı iş).
c. Kupon kodu benzersizliği kupon ekranında kontrol edilir (../domain/screens/marketing/coupons.md).

## 4. Plan + eksik bilgi (tek mesaj)
Örnek:
> Plan: (1) Promosyon "Kasım %20 Sepet İndirimi" — Yüzde 20, en az sepet 500 TL, 1 Kas 00:00 → 30 Kas 23:59
> (Europe/Istanbul), Taslak. (2) Kupon `KASIM20` bu promosyona bağlı [ayrı onay]. (3) Yayına alma [ayrı onay].
> Not: Bu indirim tüm sepete uygulanır; yalnız tişörtlere kısıtlanamaz.
> Eksik: Bitiş tarihi? Müşteri başı sınır olsun mu (öneri 1)?

## 5. Formu doldur
1. `{ADMIN_URL}/marketing/promotions/new` → `browser_snapshot`.
2. `#promotion-name` → ad; `#promotion-description` → (varsa).
3. Tür radyosu: `#promotion-type-percentage` / `#promotion-type-fixed_amount` / `#promotion-type-free_shipping` (tıkla).
4. Değer: `#promotion-discount-percentage` (ör. `20`) ve gerekirse `#promotion-max-discount`; ya da
   `#promotion-discount-amount` (nokta ondalık: `149.90`). Ücretsiz kargoda değer yok.
5. `#promotion-min-purchase` (varsa).
6. `#promotion-start-date`, `#promotion-end-date` → `fill('2026-11-01T00:00')` biçimi.
7. `#promotion-usage-limit`, `#promotion-usage-limit-per-customer` (varsa; 0 değil, boş = sınırsız).
8. `browser_snapshot` → alanları ve kırmızı hata metinlerini kontrol et.

## 6. Özet → ONAY → Kaydet
| Alan | Değer | Kaynak |
|---|---|---|
| Ortam | prod / dev / local | config |
| Ad | Kasım %20 Sepet İndirimi | önerildi, onaylandı |
| Tür / değer | Yüzde İndirim %20, üst sınır yok | kullanıcı / varsayılan |
| En az sepet tutarı | 500 TL | kullanıcı |
| Tarih aralığı | 01.11.2026 00:00 → 30.11.2026 23:59 (Europe/Istanbul) | kullanıcı |
| Kullanım sınırı | Toplam sınırsız, müşteri başı 1 | varsayılan / kullanıcı |
| Durum | Taslak (müşteriye etkisi yok) — ya da Yayında | |
| Kapsam | Tüm sepet (ekranda kısıt yok) | |
| Yan etkiler | Kupon bağlanıp promosyon Yayında olana ve tarih başlayana kadar kimse indirim almaz. Yayındaysa bağlı mevcut kuponlar hemen bu değeri kullanır | |
| Etkileşim | İndirimli fiyatlı ürünlerde indirim, indirimli fiyatın üstüne uygulanır | |

Açık "evet" → alt çubukta **"Taslak Kaydet"** (`promotion-save-draft`) ya da **"Yayınla"** (`promotion-publish`).
Enter kullanma.

## 7. Doğrula
1. Toast "Promosyon oluşturuldu." (+ yayında "Promosyon yayına alındı."); URL `/marketing/promotions/{id}`; başlıkta
   durum rozeti.
2. Listede satır: İndirim ("%20"), Durum, Tarih Aralığı, Kullanım "0 / …".
3. Hata toast'ı "Lütfen formdaki hataları düzeltin." → alan altı metni oku, düzelt; özet değiştiyse **yeniden onay**.

## 8. Kupon ve yayın
- Kupon: ../domain/screens/marketing/coupons.md → yeni kupon, bu promosyonu seç, kod(lar) (ayrı özet + onay). Toplu kod
  üretimi / dışa aktarma kupon haritasındaki kurallarla.
- Taslak kaydedildiyse ve kullanıcı yayına almak istiyorsa: detayda "Yayınla" ya da listede ⋯ → Yayınla (diyalogsuz;
  onayı önce al). Başlangıç ileri tarihliyse durum Yayında görünür ama indirim başlangıçta devreye girer — kullanıcıya söyle.
- Kod dağıtımı (e-posta kampanyası, banner) ayrı iş; müşteriye gönderim ayrı onay.

## 9. Rapor
Promosyon linki, durumu, tarih aralığı, bağlı kupon(lar) ya da "kupon yok — indirim henüz uygulanmıyor", ekranda
yapılamayanlar (kapsam, Al-Kazan, otomatik tetikleme) ve önerilen alternatifler.
