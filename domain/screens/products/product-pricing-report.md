# Fiyatlandırma Raporu (kademeli/toplu fiyat min. miktar ihlalleri)
- URL: {ADMIN_URL}/products/reports/pricing  — locale öneki yok
- Menü: Ürünler / Products → Fiyatlandırma Raporu / Pricing Report.
- Amaç: Minimum miktarı **2**'nin altında kalan **kademeli fiyat (tier price)** ve **toplu fiyat (bulk price)** kurallarını listeler. Rapor salt okunurdur; kurallar otomatik düzeltilmez, satıcı her birini ürünün düzenleme sayfasından düzeltir.
- Yetki (permission): `products:read` + `pricing:preview`. `pricing:preview` yoksa sayfa tablo yerine erişim reddi ekranı gösterir.
- Ekranın kullandığı veriler:
  - Sayfa başına 20 ürün; her ürün birden çok kural satırı üretebilir.
  - Kapsam: para birimi tanımlı ve kademeli ya da toplu fiyat kuralında min. miktarı 2'nin altında olan ürünler. Durum filtresi yok (arşivli ürünler de dahil — doğrulanmadı). Para birimi tanımsız ürünler raporda yer almaz.
  - Her satır: ürün, SKU, ad, para birimi, kural türü (kademeli / toplu), min. miktar, fiyat, fiyat tipi (sabit / yüzde; toplu fiyat her zaman sabit).
  - Kaydetme işlemi YOK.

## Ön koşullar ve bağımlılıklar
- Kullanıcıda `products:read` + `pricing:preview`.
- Raporda satır olması için ürünlerde kademeli/toplu fiyat kuralı olması gerekir (ürün formunun Fiyatlandırma sekmesinde girilir — `./product-edit.md`). Yeni veya düzenlenen kademe satırında min. miktar < 2 kaydedilemez (satır içi engelleyici hata); dokunulmamış eski satırda yalnızca soluk bir ipucu görünür. Bu yüzden rapor esas olarak eski/içe aktarılmış verideki kuralları gösterir.

## Yerleşim
Liste sayfası düzeni:
1. Başlık "Fiyatlandırma Raporu / Pricing Report", yüzde ikonu, sayaç = kural satırı sayısı.
2. Açıklama: tr "{totalProducts} üründeki {totalItems} fiyatlandırma kuralı, 1 miktarını bir hacim indirimi gibi kullanıyor. Her birini ürünün düzenleme sayfasından düzeltin." / en "{totalItems} pricing rules across {totalProducts} products use a quantity of 1 as if it were a volume discount. Fix each one from the product's edit page."
3. Tablo — sütunlar: SKU / SKU · Ürün / Product · Kural Türü / Rule Type (rozet: "Kademeli Fiyat / Tier Price" veya "Toplu Fiyat / Bulk Price") · Min. Miktar / Min Qty (sağa hizalı) · Fiyat / Price (yüzde tipinde yüzde formatı, değilse ürünün para birimiyle tutar) · İşlemler / Actions.
4. Sayfalama: 20 ürün/sayfa.
5. Boş durum: "Minimum miktarı {min} altında olan kademeli veya toplu fiyat kuralı bulunamadı. / No tier or bulk price rules below the minimum quantity of {min} were found."
6. Hata durumu: "Fiyatlandırma raporu yüklenemedi. Lütfen yeniden deneyin. / We couldn't load the pricing report. Please try again." + yeniden dene butonu (etiket doğrulanmadı).

## Alanlar
Form alanı yok (filtre/arama da yok). Okunabilir tablo hücreleri:

| Bölüm | Label (tr / en) | İçerik | Kontrol tipi | Locator ipucu | Not |
|---|---|---|---|---|---|
| Tablo | SKU / SKU | ürün SKU'su | hücre | `getByRole('row').filter({ hasText: sku })` | |
| Tablo | Ürün / Product | ürün adı | hücre | | |
| Tablo | Kural Türü / Rule Type | kademeli / toplu | rozet | metin "Kademeli Fiyat"/"Toplu Fiyat" | |
| Tablo | Min. Miktar / Min Qty | kuralın min. miktarı | hücre | | < 2 |
| Tablo | Fiyat / Price | fiyat + tip + para birimi | hücre | | |
| Tablo | İşlemler / Actions | — | link-buton / metin | `getByRole('link', { name: 'Düzelt' })` | |

## Aksiyonlar
| Buton (tr / en) | Koşul | Davranış |
|---|---|---|
| **Düzelt / Fix** (link) | Kural türü = Kademeli Fiyat | `/products/{productId}/edit` → Fiyatlandırma sekmesinde kademeli fiyatın min. miktarını ≥2 yap ve kaydet (`./product-edit.md`). Doğrudan Fiyatlandırma sekmesine gitmek için `?tab=pricing` eklenebilir. |
| (metin) "Henüz buradan düzenlenemiyor. Yardım için destek ekibiyle iletişime geçin. / Can't be edited here yet. Contact support for help." | Kural türü = Toplu Fiyat | Aksiyon yok — toplu fiyat kuralları admin panelinden düzenlenmez. |
| Sayfa numaraları | birden çok sayfa varsa | ilgili sayfayı yükler |

## Yan etkiler
Yok (salt okuma).

## Tuzaklar
- Başlıktaki sayaç kural satırı sayısıdır, sayfalama ise ürün sayısına göredir; bir sayfada 20'den fazla satır görünebilir.
- `pricing:preview` yoksa sayfa tablo yerine erişim reddi gösterir.
- Toplu fiyat satırları panelden düzeltilemez; kullanıcıya bildir.
- Min. miktar kuralı 2'dir. Düzenleme ekranında kurala uymayan satır dokunulmadıkça yalnızca ipucu gösterir; satır düzenlenince 2'nin altındaki değer engelleyici hata olur. "Düzelt" için min. miktarı ≥2 yap ya da satırı sil. Input boşaltılınca otomatik 2 olur.
- Sayfa değişiminde kısa süre önceki sayfanın verisi görünebilir; doğrulamadan önce yüklenmeyi bekle.

## Doğrulama
- Bir ürün düzeltildikten sonra rapor sayfasını yeniden yükle: ilgili SKU satırı kaybolmalı, başlık sayacı azalmalı. Hepsi düzeltildiyse boş durum metni görünür.
