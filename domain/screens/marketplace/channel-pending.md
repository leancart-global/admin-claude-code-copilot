# Kanal Bekleyen Ürünler (Channel Pending)
- URL: {ADMIN_URL}/marketplace/<kanal>/pending — `<kanal>` ∈ `trendyol` | `amazon` | `n11` | `hepsiburada`
- Menü yolu: Kanal panosu ([channel.md](channel.md)) → sekme **"Bekleyenler / Pending"** ya da "{kanal} Kanalından İçe Aktar".
- Sayfa başlığı (h2): "Bekleyen Ürünler — {kanal} / Pending Products — {kanal}"; açıklama "{kanal} kanalından aktarılan ürünler inceleme bekliyor."
- Amaç: Pazaryerinden **LeanCart'a içe aktarılan** ürünlerin inceleme kuyruğu — her kanal ilanını mevcut bir LeanCart ürünüyle eşlemek, yeni ürün olarak oluşturmak ya da yok saymak. (Bu ekran LeanCart → pazaryeri gönderimlerinin kuyruğu değildir; gönderim durumu [channel-products.md](channel-products.md) "{kanal} Durumu" sütunundadır.)
- Entity: [../../entities/marketplace-channel.md](../../entities/marketplace-channel.md) (§Bekleyen ürün).
- Yetki: `marketplace:read` / `marketplace:write` (doğrulanmadı).

> **Durum: geliştiriliyor.** Kuyruk şu an her kanalda boş görünür ve "Tümünü Otomatik Eşleştir" bir işlem başlatmaz; içe aktarma da ([channel-products.md](channel-products.md) "İçe Aktar") henüz etkin değil. Kullanıcı "Trendyol'daki ürünleri içeri al" derse durumu bildir, kayıt yapma.

## Ön koşullar ve bağımlılıklar
- Kanal bağlı ve "Bağlı" durumda.
- Kuyruk, kanaldan içe aktarma çalıştırıldıktan sonra dolar.
- Eşleme hedefi: LeanCart ürünleri ([../products/product-list.md](../products/product-list.md)).

## Yerleşim
1. Başlık + sağda **"Tümünü Otomatik Eşleştir / Auto-Match All"** (yenile ikonlu).
2. Filtre düğmeleri: "Tümü / All", "Beklemede / Pending", "Otomatik Eşleşen / Auto-matched" (seçili olan dolgulu).
3. Kart **"İçe Aktarılan Ürünler / Imported Products"** + arama "Başlık, barkod ile ara... / Search by title, barcode...".
4. Tablo sütunları: Ürün / Product · Barkod / Barcode · SKU · Marka / Brand · Fiyat / Price · {kanal} Durumu · satır menüsü (⋯).
5. Boş durum: "{kanal} kanalından bekleyen ürün yok." / "Burada görmek için ürünleri içe aktarın."

## Eşleme durumları (tasarım)
| Durum | Anlam |
|---|---|
| Beklemede / Pending | Henüz LeanCart ürünüyle eşlenmedi |
| Otomatik Eşleşen / Auto-matched | Barkod (öncelikli) ya da SKU eşitliğiyle bir LeanCart ürünü önerildi; onay bekler |
| Elle eşlenen | Kullanıcı bir LeanCart ürünü seçti |
| Oluşturuldu | Kanal ilanından yeni LeanCart ürünü oluşturuldu |
| Yok sayıldı | Kuyruktan çıkarıldı |

## Alanlar
| Label (tr / en) | Kontrol | Zorunlu | Locator | Not |
|---|---|---|---|---|
| Başlık, barkod ile ara... | Input | — | placeholder | Salt arama |
| Tümü / Beklemede / Otomatik Eşleşen | Buton grubu (filtre) | — | rol button + metin | Salt filtre |

## Aksiyonlar (tasarım; etkinleşince doğrulanmalı)
| Aksiyon | Ne olur |
|---|---|
| Tümünü Otomatik Eşleştir | Bekleyen tüm ilanlar için barkod/SKU ile LeanCart ürünü arar ve öneri üretir |
| Satır menüsü → eşleştir / öneriyi onayla | Kanal ilanı seçilen LeanCart ürününe bağlanır; o ürünün stok/fiyatı sonraki senkronlarda bu ilana gider |
| Satır menüsü → yeni ürün oluştur | Kanal ilanından LeanCart ürünü oluşturur (kategori, attribute set, fiyat gibi zorunlular gerekebilir — [../products/product-create.md](../products/product-create.md)) |
| Satır menüsü → yok say | İlanı kuyruktan çıkarır |

## Onay zamanlaması
- Şu an kalıcı aksiyon yok.
- Etkinleştiğinde: **"Tümünü Otomatik Eşleştir" toplu işlemdir — kural 5**, etkilenen bekleyen ilan sayısıyla ayrı onay. Eşleştirme ve "yeni ürün oluştur" LeanCart kataloğunu değiştirir ve eşlenen ürünün stok/fiyatının pazaryerine gönderilmesine yol açar (**dış sisteme yazma sonucu**) → her biri özet + onay. "Yok say" geri alınabilirliği doğrulanmadı → ayrı onay.

## Yan etkiler
- Eşlenen LeanCart ürünü, kanaldaki ilanla bağlanır: stok değişiklikleri otomatik o ilana gider (tampon düşülerek).

## Tuzaklar
- Yanlış eşleme, kanal ilanının stoğunu başka bir ürünün stoğuyla günceller → barkod/SKU'yu kullanıcıyla teyit et.

## Doğrulama
- Etkinleştiğinde: satır durumunun değiştiği, eşlenen ürünün [channel-products.md](channel-products.md) "{kanal} Durumu"nda "Listelendi" göründüğü.
