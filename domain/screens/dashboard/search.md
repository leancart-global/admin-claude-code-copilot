# Arama Sonuçları (Global header araması)
- URL: {ADMIN_URL}/search?q=<metin>
- Menü yolu: Menüde yok. Header'daki arama kutusu (placeholder "Ürün ara... / Search products...") Enter ile bu
  sayfayı açar.
- Sayfa başlığı: "Arama Sonuçları / Search Results"; açıklama "\"{q}\" için sonuçlar / Results for \"{q}\"".
- Amaç: **Ürünü** hızlıca bulup düzenleme ekranına gitmek. Bu arama yalnız ürün arar; sipariş, müşteri, kategori,
  sayfa sonuçları **dönmez**. Salt okunur.
- Entity: [../../entities/product.md](../../entities/product.md).
- Yetki: `products:read`.

## Ön koşullar ve bağımlılıklar
- Sonuçlar ürün arama dizininden gelir. Yeni eklenen/değişen ürün dizine kısa bir gecikmeyle yansır; dizin güncel
  değilse ürün listesinde görünüp aramada görünmeyebilir → [../settings/search-index.md](../settings/search-index.md)
  (dizin durumu; yeniden oluşturma ayrı onaylı bir işlemdir).

## Yerleşim
1. Kart başlığı (arama ikonu) + açıklama.
2. Sorgu yoksa: "Aramaya başlamak için üst başlığa bir arama sorgusu girin" (açıklama: "Arama sorgusu bekleniyor").
3. Sonuç listesi: her satır **ürün adı** (solda) + **SKU** (sağda); satırın tamamı `/products/{id}/edit` bağlantısıdır.
4. Sonuç yok: "\"{q}\" için sonuç bulunamadı". Hata: "Arama tamamlanamadı. Lütfen tekrar deneyin."
- İlk **20** sonuç gösterilir; sayfalama, filtre ve sıralama yok.

## Neyi arar
| Eşleşen bilgi | Not |
|---|---|
| Ürün adı (ve ad başlangıcı) | En güçlü eşleşme |
| SKU | Tam/kısmi SKU ile bulunur |
| Marka adı, kategori adları, etiketler | |
| Kısa açıklama, açıklama | |
| Özel nitelik (attribute) değerleri | Ör. "pamuk", "siyah" |
- Küçük yazım hatalarına toleranslıdır (ilk 2 harf doğru olmalı). Çok kelimeli sorguda kelimelerin çoğu eşleşmelidir.
- Taslak ve yayınlanmamış ürünler de bulunur (doğrulanmadı).

## Nasıl kullanılır (operatör)
- **Enter'a basma** (onay hook'u Enter'ı form gönderimi sayar). Bunun yerine doğrudan
  `{ADMIN_URL}/search?q=<URL-encoded metin>` adresine `browser_navigate` ile git.
- Sonuç satırını (ürün adı) tıklamak ürün düzenleme formunu açar; formda hiçbir şeyi değiştirme, yalnız oku.
  Ürün özet bilgisi için [../products/product-detail.md](../products/product-detail.md).
- Başka kayıt türleri için:
  | Aranan | Nerede aranır |
  |---|---|
  | Sipariş (no, müşteri) | [../orders/orders-list.md](../orders/orders-list.md) arama kutusu |
  | Müşteri (ad, e-posta) | [../customers/customers-list.md](../customers/customers-list.md) |
  | Ürün (filtreli: durum, kategori, stok) | [../products/product-list.md](../products/product-list.md) |
  | Kategori | [../categories/category-list.md](../categories/category-list.md) |
  | Ödeme işlemi (sipariş ID / işlem referansı) | [../reports/payments.md](../reports/payments.md) |
  | Alacak dekontu (dekont no / sipariş ID) | [../reports/refunds.md](../reports/refunds.md) |
- SKU benzersizliği kontrolü gibi kesin sonuç gereken işlerde ürün listesinin SKU aramasını tercih et; bu ekran
  dizine dayalıdır ve birkaç saniyelik gecikme gösterebilir.

## Alanlar
| Label (tr / en) | Kontrol tipi | Zorunlu | Locator ipucu | Not |
|---|---|---|---|---|
| (header) Ürün ara... / Search products... | Input | — | `getByPlaceholder(/Ürün ara|Search products/)` | Dar ekranda gizli; URL ile gitmek daha güvenilir |

## Aksiyonlar
| Aksiyon | Ne olur |
|---|---|
| Sonuç satırına tıkla | `/products/{id}/edit` açılır |

## Onay zamanlaması
- Kalıcı aksiyon yok; onay gerekmez.

## Yan etkiler
- Yok.

## Tuzaklar
- Sorgu boşlukları kırpılır; boş sorgu arama yapmaz.
- 20'den fazla eşleşmede istenen ürün listede olmayabilir → sorguyu daralt (SKU ile ara) ya da ürün listesini kullan.

## Doğrulama
- `browser_snapshot` ile liste satırlarındaki ad + SKU'yu oku; aranan SKU ile birebir eşleşeni seç.
