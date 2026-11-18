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
Admin promosyon formu altı tür kurar: Yüzde, Tutar, Ücretsiz Kargo (hep **kupon koduyla**), Kademeli, Paket, Al-Kazan
(varsayılan **ödemede otomatik**, istenirse kuponla). Yüzde / Tutar / Kademeli / Al-Kazan için **ürün kapsamı** seçilebilir.
Kategori, marka, segment, store view kısıtı, en az ürün adedi, farklı ürünler arası "A al B indirimli" ekranda yok.

| İstek | Ekranda karşılığı | Ne yapılır |
|---|---|---|
| "Sepette %20 indirim" / "tüm siparişlerde %20" | Yüzde İndirim 20 | Promosyon + kupon (§3) |
| "200 TL indirim" / "1000 TL üzeri 100 TL indirim" | Tutar İndirimi + (En az sepet tutarı) | Promosyon + kupon |
| "%15, en fazla 300 TL" | Yüzde 15 + En fazla indirim tutarı 300 | Promosyon + kupon |
| "500 TL üzeri kargo bedava" | (a) **Kodsuz, herkese:** kargo ayarındaki "Ücretsiz Kargo" kuralı, Minimum Sipariş Tutarı 500 → ../domain/screens/settings/shipping-carriers.md. (b) **Kodla:** Ücretsiz Kargo + En az sepet tutarı 500 + kupon | Kullanıcıya iki yolu sor; "herkese otomatik" dediyse (a) |
| "Tüm tişörtlerde %20" / "şu 3 üründe %20" | **Kategori kısıtı yok, ürün kapsamı var.** Yüzde (veya Tutar) türünde "Geçerli olduğu ürünler"e ürünleri tek tek seç; kapsam boş bırakılırsa tüm sepete uygulanır | Kullanıcıdan ürün listesini al (kategori istiyorsa kategorideki ürünleri listeleyip onaylat); alternatif: ürün başına **İndirimli Fiyat** + tarih aralığı (../domain/screens/products/product-edit.md; kodsuz, vitrinde fiyat olarak görünür) |
| "3 al 2 öde" / "2. ürüne %50" | **Al-Kazan** türü: Müşteri alır 2 / Müşteri kazanır 1 / Kazanılan ürünlerde indirim 100 ("3 al 2 öde"); "2. ürüne %50" = alır 1 / kazanır 1 / %50 | Yalnız **aynı ürün** için çalışır; "A al B bedava" (farklı ürün) formda yok — söyle. İstenirse ürün kapsamı seç. Varsayılan tetikleme "Ödemede otomatik" → herkese açıldığını özette belirt |
| "1000 TL'ye %10, 2000 TL'ye %15" / "5 adet al %20" | **Kademeli** türü: ölçüt Sepet tutarı ya da Ürün adedi, her kademe eşik + indirim | Ölçütü karıştırma (hepsi aynı); eşik tekrarı olmaz; ulaşılan en yüksek kademe geçerli. İndirim yalnız kapsamdaki ürünlere, eşik tüm sepete bakar |
| "Bu 3 ürünü birlikte alana 999 TL" | **Paket** türü: en az 2 farklı ürün, paket fiyatı, her üründen adet | Paket fiyatı ürünlerin toplamından düşük olmalı; siparişte bir kez uygulanır |
| "VIP müşterilere / şu segmente %10" | Segment kısıtı ekranda yok | Kullanıcıya söyle; kuponu yalnız o kitleye dağıtmak (kampanya e-postası) bir yol olabilir — dağıtım ayrı iş, ayrı onay |
| "Hafta sonu / 11.11 için" | Başlangıç–Bitiş | Saatleri mağaza saat dilimiyle netleştir |

Ekranın desteklemediği bir kısıtı API ile kurmaya çalışma (kural 3). Desteklenmeyeni raporda "yapılamadı" diye yaz.

## 2. Bilgi şablonu
| Bilgi | Form alanı | Zorunlu | Varsayılan (sorulmazsa) |
|---|---|---|---|
| Ad (iç) | Promosyon adı | evet | Öner: "{Dönem} {değer} {tür}" (ör. "Kasım %20 Sepet İndirimi") → onaylat |
| Açıklama | Açıklama | hayır | boş |
| Tür | İndirim türü | evet | — (cümleden çıkar) |
| Değer / kural | İndirim yüzdesi / tutarı; kademeler; paket ürünleri + fiyat + adet; al / kazan adedi + indirim % | yayın için evet | — (sor) |
| Ürün kapsamı | Geçerli olduğu ürünler (Yüzde, Tutar, Kademeli, Al-Kazan) | hayır | boş = tüm sepet ("varsayılan") |
| Tetikleme | Müşteri nasıl yararlanır (Kademeli, Paket, Al-Kazan) | — | Ödemede otomatik uygulanır ("varsayılan"); kullanıcı kod istiyorsa "Müşteri kupon kodu girer" |
| Üst sınır | En fazla indirim tutarı | hayır | boş = sınırsız ("varsayılan") |
| Alt sınır | En az sepet tutarı | hayır | boş ("varsayılan") |
| Başlangıç | Başlangıç tarihi | evet | Kullanıcı "hemen" dediyse şimdiki saat (yuvarla, ör. bir sonraki tam saat) → onaylat |
| Bitiş | Bitiş tarihi | evet | — (sor; varsayılan uydurma) |
| Toplam sınır | Toplam kullanım sınırı | hayır | boş = sınırsız ("varsayılan") |
| Müşteri başı | Müşteri başına sınır | hayır | boş = sınırsız; tek kullanımlık kampanyalarda 1 öner |
| Durum | Taslak Kaydet / Yayınla | — | **Taslak**; kullanıcı "yayına al / başlat" dediyse Yayınla |
| Kupon kodu | — (kupon ekranı) | kuponlu türlerde indirim için evet | Kullanıcıya sor: tek ortak kod mu (ör. `KASIM20`), toplu tekil kodlar mı? Otomatik tetiklemede kupon gerekmez |

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
> Not: Ürün kapsamı seçilmedi, indirim tüm sepete uygulanır (yalnız belirli ürünlere istiyorsan ürünleri seçeriz).
> Eksik: Bitiş tarihi? Müşteri başı sınır olsun mu (öneri 1)?

## 5. Formu doldur
1. `{ADMIN_URL}/marketing/promotions/new` → `browser_snapshot`.
2. `#promotion-name` → ad; `#promotion-description` → (varsa).
3. Tür radyosu: `#promotion-type-percentage` / `#promotion-type-fixed_amount` / `#promotion-type-free_shipping` /
   `#promotion-type-tiered` / `#promotion-type-bundle` / `#promotion-type-buy_x_get_y` (tıkla).
4. Değer: `#promotion-discount-percentage` (ör. `20`) ve gerekirse `#promotion-max-discount`; ya da
   `#promotion-discount-amount` (nokta ondalık: `149.90`). Ücretsiz kargoda değer yok. Kademeli: "Kademe ekle" ile satırlar,
   her satırda Ölçüt / eşik / İndirim türü / değer. Paket: `#promotion-bundle-products-search` ile ürünler, `#promotion-bundle-price`,
   `#promotion-bundle-quantity`. Al-Kazan: `#promotion-bogo-buy`, `#promotion-bogo-get`, `#promotion-bogo-percentage`.
   Ürün kapsamı: `#promotion-scope-search` (yaz, sonuç gelince seç). Tetikleme: `#promotion-trigger-automatic` /
   `#promotion-trigger-coupon`. "Kural:" özet satırını (`promotion-rule-summary`) kullanıcının isteğiyle karşılaştır.
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
| Kapsam / tetikleme | Tüm sepet ya da seçilen ürünler (listele); kuponlu / ödemede otomatik | varsayılan / kullanıcı |
| Yan etkiler | Kuponlu promosyonda kupon bağlanıp promosyon Yayında olana ve tarih başlayana kadar kimse indirim almaz; yayındaysa bağlı mevcut kuponlar hemen bu değeri kullanır. **Otomatik** promosyon Yayında + tarih başlayınca kodsuz herkesin sepetine girer | |
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
yapılamayanlar (kategori / segment kısıtı, farklı ürünler arası "A al B indirimli", en az ürün adedi) ve önerilen alternatifler.
