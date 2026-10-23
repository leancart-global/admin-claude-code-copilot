# Analitik Paneli (Analytics Dashboard)
- URL: {ADMIN_URL}/analytics
- Menü yolu: Sol menü üst seviye "Analitik / Analytics" (aynı etiket Siparişler ve Müşteriler altında da var — üst
  seviyedekini seç). Sayfanın üstündeki sekmeler: "Panel / Dashboard" (bu ekran), "Raporlar / Reports"
  ([reports.md](reports.md)), "Aktivite / Activity" ([realtime.md](realtime.md)), "Coğrafi / Geographic"
  ([geographic.md](geographic.md)).
- Sayfa başlığı: "Analitik Paneli / Analytics Dashboard"; açıklama "Mağaza performansını ve trendleri takip edin".
- Amaç: Seçilen dönem için gelir, sipariş, ortalama sipariş değeri, dönüşüm, ziyaretçi/sayfa görüntüleme, müşteri ve
  ürün/stok KPI'larını; en çok satan ürünleri, en iyi müşterileri ve kategorileri; çerez onayı vermeyen ziyaretçi
  sayımlarını görmek. **Salt okunur.**
- Entity: metrik tanımları [../../entities/report.md](../../entities/report.md).
- Yetki: `analytics:read`.
- Kişisel veri: "En İyi Müşteriler" tablosunda müşteri adı (varsa e-posta) görünür.
- Benzer ekranlar (tekrar edilmedi): [../dashboard/dashboard.md](../dashboard/dashboard.md) (Panel, aynı KPI tanımları),
  [../orders/orders-analytics.md](../orders/orders-analytics.md), [../customers/customers-analytics.md](../customers/customers-analytics.md).

## Ön koşullar ve bağımlılıklar
- Ön koşul yok. Ziyaretçi/oturum/dönüşüm rakamları vitrinde çerez onayı veren ziyaretçilerden gelir.
- "Onay vermeyen ziyaretçiler" kartı yalnız [../settings/general.md](../settings/general.md) → "Çerezsiz ziyaretçi
  sayımı" açıkken dolar.

## Yerleşim
1. Sekme çubuğu (Panel / Raporlar / Aktivite / Coğrafi).
2. Başlık + açıklama; sağda **Dönem** Select ve "Yenile / Refresh".
3. Hata: kırmızı uyarı "Hata" + mesaj; toast "Analitik verisi yüklenemedi".
4. KPI kartları: "Toplam Gelir", "Sipariş", "Ortalama Sipariş Değeri", "Dönüşüm Oranı", "Müşteri" (her biri altında
   "önceki döneme göre" değişim), "Ziyaretçi" (alt satır "Sayfa görüntüleme: {count}"), "Ürün" (alt satır
   "Stokta yok: {n} | Az stok: {n}").
5. **"Onay vermeyen ziyaretçiler / Visitors without consent"** kartı: "Giriş / Entries", "Sepete ekleme / Add-to-carts",
   "Ödeme açılışı / Checkout opens"; "En çok giriş yapılan sayfalar" (Sayfa, Sayı), "En çok trafik getiren kaynaklar"
   (Kaynak, Sayı); tarih aralığı "{from} – {to} (UTC günleri)". Boş: "Bu dönem için sayım yok" + "Analitik ayarlarını
   aç" (→ `/settings/general`). Hata: "Bu sayılar yüklenemedi. Yukarıdaki rakamlar etkilenmez."
6. "En Çok Satan Ürünler / Top Products" ("Gelire göre…"; Ürün + SKU, Gelir, Adet; ilk 5).
7. "En İyi Müşteriler / Top Customers" ("En yüksek yaşam boyu değere sahip müşteriler"; Müşteri, Sipariş, Toplam
   Harcama; ilk 5; adı yoksa "Anonim").
8. "En İyi Kategoriler / Top Categories" (sıra rozeti + "{count} satış").

## Alanlar
| Label (tr / en) | Kontrol tipi | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|
| Dönem | Select (shadcn) | **Son 30 gün** | başlık sağındaki combobox | "Son 7 gün", "Son 30 gün", "Son 90 gün", "Bu ay" (ayın 1'inden bugüne). "Bugün" bu ekranda yok |

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Dönem seçimi | Tüm kartlar yeniden yüklenir | — |
| Yenile | Aynı dönem yeniden okunur | hata: "Analitik verisi yüklenemedi" |
| Analitik ayarlarını aç | `/settings/general` açılır (oradaki anahtar **anında** kaydeder — [../settings/general.md](../settings/general.md)) | — |

## Onay zamanlaması
- Bu ekranda kalıcı aksiyon yok; onay gerekmez.
- "Analitik ayarlarını aç" yalnız gezinmedir; ayar ekranındaki "Çerezsiz ziyaretçi sayımı" anahtarı anında kaydeder →
  ona dokunmadan önce ayrı onay (kural 6).

## Yan etkiler
- Yok.

## Tuzaklar
- "Onay vermeyen ziyaretçiler" sayıları tekilleştirilmez, oturumlara ve üstteki KPI'lara **dahil değildir** ve UTC
  gününe göre gruplanır; toplam ziyaretçi raporlarken bu iki rakamı toplama, ayrı ver.
- "Son N gün" takvim dönemi değil, şu andan geriye N×24 saattir; "Bu ay" takvim ayıdır.
- Geliştirme/demo mağazasında başlık yanında "Demo Veri / Demo Data" rozeti görünürse rakamlar örnektir; raporlama.

## Doğrulama
- Dönem seçicinin değerini ve KPI kart değerlerini `browser_snapshot` ile oku; raporda dönemi belirt.
