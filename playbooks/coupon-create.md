# Playbook: Kupon oluştur ("%10 indirim kuponu", "ilk siparişe özel 100 TL kupon", "500 adet tek kullanımlık kod üret")

Tetikleyiciler: "kupon/indirim kodu oluştur", "şu kodu tanımla (ör. KASIM10)", "X adet kod üret", "tek kullanımlık kodlar",
"influencer'a özel kod", "bültene kupon", "kuponu kapat/sil/uzat".
Harita: ../domain/screens/marketing/coupons.md (liste/oluştur/detay/düzenle, onay zamanlaması),
../domain/screens/marketing/coupon-bulk.md (toplu üretim, dışa aktarma), ../domain/entities/coupon.md (kurallar, sipariş
ilişkisi). Promosyon: ../domain/screens/marketing/promotions.md, ../domain/entities/promotion.md,
[promotion-create.md](promotion-create.md).
URL'ler locale öneksizdir: `{ADMIN_URL}/marketing/coupons/new`, `{ADMIN_URL}/marketing/coupons/bulk`.

---

## 0. Kural hatırlatması
- Kupon **indirim taşımaz**; indirim bağlı **promosyondan** gelir. "%10 kupon" = %10'luk promosyon + ona bağlı kod.
- Kaydetmeden önce **özet tablo + açık "evet"** (ortam başlıkta). Promosyon ve kupon/parti **ayrı onay**.
- "Aktive Et" ve toplu "Kodları üret" kodları **hemen canlı** yapar (promosyon Yayında ve tarih başladıysa).
- Detaydaki "Kopyala" diyalogsuz yeni kupon oluşturur → tıklamadan önce onay.
- Kod sonradan değişmez. Kullanılmış kupon silinemez.
- Toplu kodlar müşteriye dağıtılan değerdir: CSV indir / Tümünü kopyala yalnız kullanıcı isterse; kodları sohbete toplu yazma.
- Prod'da test kuponu açma, deneme siparişi verme.

## 1. İsteği çözümle
| İstek | Promosyon | Kupon |
|---|---|---|
| "%10 indirim kuponu" | Yüzde İndirim 10 | Tek ortak kod (ör. `INDIRIM10`), Çoklu Kullanım, limit = beklenen toplam kullanım |
| "100 TL indirim kodu" | Tutar İndirimi 100 | Tek ortak kod |
| "1000 TL üzeri 100 TL" | Tutar 100 + En az sepet tutarı 1000 | Tek kod |
| "Kargo bedava kodu" | Ücretsiz Kargo | Tek kod |
| "Her müşteri bir kez kullansın" | Müşteri başına sınır **1** | Çoklu Kullanım tek kod (ya da toplu tekil kodlar) |
| "Toplam 200 kişi kullanabilsin" | (ops.) Toplam kullanım sınırı 200 | Kod limiti 200 |
| "500 adet tek kullanımlık kod" | Uygun promosyon | Toplu üretim: adet 500, Tek Kullanımlık, limit 1 (§5) |
| "İlk siparişe özel" | **"İlk sipariş" koşulu admin ekranında yok** | Kullanıcıya söyle (aşağıda) |
| "Şu kategoride / şu ürünlerde geçerli", "VIP segment", "müşteri grubu", "başka indirimlerle birleşmesin" | Ekranda yok | Kullanıcıya söyle; kural 3 — API ile kurma; alternatifler [promotion-create.md](promotion-create.md) §1 |
| "Sadece şu müşteriye" | Admin formunda müşteriye bağlama yok | Kullanıcıya söyle; öneri: tek kullanımlık özel kod üret, kodu yalnız o müşteriye kullanıcı iletsin |

**"İlk siparişe özel 100 TL kupon"** — açıkça söyle: "Bu sürümde kuponu yalnız ilk siparişte geçerli kılan bir ayar
admin ekranında yok." Seçenekler (kullanıcı seçsin):
1. Tutar İndirimi 100 + promosyonda **Müşteri başına sınır 1** → her müşteri bir kez kullanır, ama daha önce sipariş
   vermiş müşteriler de kullanabilir.
2. Yukarıdaki + kodu yalnız yeni üyelere/abonelere dağıtmak (ör. hoş geldin e-postası; dağıtım ayrı iş, ayrı onay;
   E-posta yönetimi — kapsam dışı).
3. Toplu tekil kodlar (Tek Kullanımlık) üretip yalnız yeni müşterilere dağıtmak.
Hangisinin seçildiğini raporda "ilk sipariş koşulu uygulanmadı, yerine …" diye yaz.

## 2. Bilgi şablonu
| Bilgi | Form alanı | Zorunlu | Varsayılan (sorulmazsa) |
|---|---|---|---|
| Promosyon | Promosyon | evet | Uygun mevcut promosyon varsa öner; yoksa yeni promosyon ([promotion-create.md](promotion-create.md)) |
| Kod | Kupon kodu | hayır | Kullanıcı vermediyse **öner** (büyük harf ASCII + rakam, ör. `KASIM10`, `HOSGELDIN100`; Türkçe karakter yok) ve onaylat. Boş bırakılırsa rastgele kod üretilir — ancak kullanıcı "rastgele olsun" derse |
| Tür | Kupon türü | evet | Ortak kod → **Çoklu Kullanım**; tekil kod → Tek Kullanımlık |
| Kullanım limiti | Kullanım limiti | — | Tek Kullanımlık → 1; Çoklu Kullanım → **sor** (sınırsız seçeneği yok; kullanıcı "sınırsız" derse yüksek bir sayı öner, ör. 100000, "varsayılan" diye işaretle) |
| Başlangıç | Başlangıç tarihi | evet | "Hemen" → şimdiki saatten sonraki tam saat (mağaza saati) → onaylat |
| Bitiş | Bitiş tarihi | evet | Sor; öneri: promosyon bitişi (kupon aralığı promosyon aralığının içinde olmalı) |
| Açıklama | Açıklama | hayır | Kısa iç not öner (ör. "Kasım bülteni") |
| Durum | Taslak Kaydet / Aktive Et | — | Kullanıcı "hemen kullanılsın / aç" dediyse **Aktive Et**. |
| Toplu: adet, ön ek, son ek | Kaç kod, Kod ön eki, Kod son eki | adet evet (1–10.000) | Ön ek öner (ör. `KASIM`); son ek boş |

## 3. Bağımlılıklar (salt okuma)
a. **Promosyon:** `{ADMIN_URL}/marketing/promotions` listesinde istenen indirimi veren promosyon var mı (tür, değer, en az
   sepet, tarih, durum). Kupon formundaki seçicide de seçenekler "{ad} — {indirim}" + durum rozetiyle görünür.
   - Yoksa → [promotion-create.md](promotion-create.md) (ayrı özet + onay). Promosyon formunda müşteri başı/toplam sınırı
     unutma.
   - Varsa ama **Taslak/Duraklatıldı** ise: kupon bağlanabilir ama indirim vermez → yayına alma ayrı onay (promosyon
     haritası).
b. **Kod benzersizliği:** kupon listesinde kodu ara ("Kupon kodu ara..."). Aynı kod varsa (silinmemiş) kullanıcıya sor:
   mevcut kuponu güncellemek mi, başka kod mu?
c. **Saat dilimi:** form açılınca "Saatler mağazanın saat dilimine göre (…)" notunu oku; UTC uyarısı varsa dur, bildir.

## 4. Plan + eksik bilgi (tek mesaj)
Örnek ("%10 indirim kuponu"):
> Plan: (1) Promosyon "Kasım %10 Sepet İndirimi" yok → oluşturulacak (Yüzde 10, 1–30 Kas, müşteri başı 1, Yayında) [onay].
> (2) Kupon `KASIM10` — Çoklu Kullanım, limit ?, 1 Kas 00:00 → 30 Kas 23:59, Aktive Et [onay].
> Eksik: Toplam kaç kullanım (kod limiti)? Bitiş tarihi uygun mu? Kod `KASIM10` olsun mu?

## 5a. Tekil kupon formu (`/marketing/coupons/new`)
1. `browser_snapshot`. "Önce bir promosyon gerekiyor" kutusu varsa → §3a.
2. Promosyon: `#coupon-promotion` (combobox) tıkla → listbox'ta `getByRole('option', { name: /Kasım %10/ })` tıkla →
   "Bu kupon şu indirimi açar" özetinde tür/değer/en az sepet/tarihleri oku ve kullanıcının isteğiyle karşılaştır.
3. `#coupon-code` → kod (büyük harf yaz).
4. Tür: `getByRole('radio', { name: 'Çoklu Kullanım' })` ya da `#coupon-type-single_use`.
5. `#coupon-description` (varsa).
6. `#coupon-valid-from`, `#coupon-valid-until` → `fill('2026-11-01T00:00')`.
7. `#coupon-usage-limit` → limit.
8. `browser_snapshot` → değerler ve kırmızı hata metni yok mu?

## 5b. Toplu üretim (`/marketing/coupons/bulk`) — "500 adet tek kullanımlık kod"
1. `browser_snapshot`; promosyon seç (5a-2 ile aynı).
2. `#bulk-quantity` → `500`; `#bulk-prefix` → ön ek (≤16); `#bulk-suffix` (ops.).
3. Tür `#bulk-type-single_use`; `#bulk-valid-from`, `#bulk-valid-until`; `#bulk-usage-limit` = 1; `#bulk-description`
   → parti notu (ör. "Kasım bülteni 500 kod").
4. Kullanıcıya sor: üretimden sonra **CSV indirilsin mi?** (kodlar yalnız sonuç ekranında topluca görünür; sayfadan
   ayrılınca toplu liste kaybolur).

## 6. Özet → ONAY → Kaydet
| Alan | Değer | Kaynak |
|---|---|---|
| Ortam | prod / dev / local | config |
| Promosyon | Kasım %10 Sepet İndirimi — Yüzde %10, en az sepet yok, 01.11–30.11, **Yayında** | seçildi |
| Kod | `KASIM10` (büyük harf, sonradan değişmez) — ya da toplu: 500 kod, biçim `KASIM-XXXXXXXX` | kullanıcı / önerildi |
| Tür / limit | Çoklu Kullanım, toplam 1000 — ya da Tek Kullanımlık, her kod 1 | kullanıcı / varsayılan |
| Geçerlilik | 01.11.2026 00:00 → 30.11.2026 23:59 (Europe/Istanbul) | kullanıcı |
| Durum | **Aktif** (hemen kullanılabilir) / Taslak (vitrinde çalışmaz) — toplu: her zaman Aktif | |
| Müşteri başı sınır | Promosyondan: 1 / sınırsız | promosyon |
| Kapsam | Tüm sepet; ilk sipariş / kategori / segment kısıtı **yok** (ekranda desteklenmiyor) | |
| Yan etkiler | Kod girildiğinde indirim promosyondan hesaplanır; kullanım sipariş verildikçe sayılır, iptal/tam iadede geri verilir. Toplu: N canlı kupon oluşur, toplu silme yok | |
| Dışa aktarma (toplu) | CSV indir: evet/hayır (kullanıcının bilgisayarına) | kullanıcı |

Açık "evet" → tekil: **"Aktive Et / Activate"** ya da **"Taslak Kaydet / Save as draft"**; toplu: **"Kodları üret /
Generate codes"** (`bulk-generate-button`). Enter kullanma.

## 7. Doğrula
- Tekil: toast "Kupon aktive edildi." / "Kupon taslak olarak kaydedildi."; URL `/marketing/coupons/{id}`; başlıkta kod ve
  rozet; KPI "Kullanım 0 / {limit}", "İndirim Değeri" = promosyon değeri, Özet'te Promosyon adı ve "Kupon geçerlilik aralığı".
- Toplu: toast "{n} kod oluşturuldu, {m} atlandı."; n = istenen adet mi? m > 0 ise kullanıcıya bildir, farkı yeni parti
  olarak öner (ayrı onay). Kullanıcı istediyse ve onayladıysa "CSV indir" → dosya adı `coupons-YYYY-MM-DD.csv`.
- Hata: "Lütfen formdaki hataları düzeltin." → alan altı metin; kod çakışması (409) → yeni kod öner; özet değiştiyse
  **yeniden onay**.

## 8. Sonraki işler (her biri ayrı istek/onay)
- **Uzatma / kapatma:** detay → "Düzenle" → bitiş tarihi (kod ve durum değişmez) → "Kaydet". Kullanılmış kuponda da
  serbest; etkisi canlı → onay. Kapatmak için bitişi şimdiye çek; kullanılmamışsa "Sil" (geri alınamaz, ayrı onay);
  promosyonu duraklatmak o promosyonun **tüm** kodlarını durdurur.
- **Silme:** "Kullanım" > 0 ise silinemez ("Bu kupon zaten kullanıldı, silinemez.") → kullanıcıya bitiş tarihini öne çekmeyi öner.
- **Paylaş:** herkese açık bağlantı kodu ifşa eder; kullanıcı isterse.
- **Dağıtım** (e-posta kampanyası, banner, bildirim): ayrı playbook/onay; bu ekranlar müşteriye bir şey göndermez.

## 9. Rapor
Kupon linki/kod(lar) (toplu: adet + ön ek + CSV indirildi mi — kodları listeleme), bağlı promosyon ve durumu, geçerlilik,
limitler, desteklenmeyen istekler (ilk sipariş, kategori, segment…) ve uygulanan alternatif.
