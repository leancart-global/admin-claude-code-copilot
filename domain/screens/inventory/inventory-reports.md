# Envanter raporları — Yaşlanma Raporu ve Yeniden Sipariş Önerileri

| URL | Sayfa başlığı (tr / en) | Menü (Envanter / Inventory altında) |
|---|---|---|
| `{ADMIN_URL}/inventory/reports/aging` | "Stok Yaşlanma Raporu / Inventory Aging Report" | "Yaşlanma Raporu / Aging Report" |
| `{ADMIN_URL}/inventory/reports/reorder` | "Yeniden Sipariş Önerileri / Reorder Suggestions" | "Yeniden Sipariş Önerileri / Reorder Suggestions" |

- Amaç: Hareketsiz stoğu ve yeniden siparişi gereken SKU'ları görmek. **İkisi de salt okunur**; filtre, tarih aralığı, sayfalama ve **dışa aktarma (CSV/Excel) yoktur**. Tablo en çok 200 satır gösterir.
- Yetki: `inventory:read`.
- API (public): `GET /reports/aging`, `GET /reports/reorder-suggestions` (her ikisi `warehouseId`, `limit` parametresi alır; ekranda depo seçici yok).
- İlişkili: [stock.md](stock.md) (yeniden sipariş noktası/miktarı stok kaydında ayarlanır), [stock-movements.md](stock-movements.md) (hesap hareketlerden yapılır), [purchase-orders.md](purchase-orders.md) ("PO Oluştur").

## Ön koşullar ve bağımlılıklar
- Stok kayıtları ve stok hareketleri ([../../entities/stock.md](../../entities/stock.md)).
- Yeniden sipariş raporu için SKU'nun stok kaydında **"Yeniden Sipariş Noktası" > 0** tanımlı olmalı; tanımsız SKU'lar raporda hiç görünmez.

## Yaşlanma Raporu (`/reports/aging`)
Açıklama: "Uzun süredir hareket görmeyen SKU'ları tespit edin".

### Yerleşim
1. Başlık + satır sayısı rozeti.
2. Dönem kutuları (her birinde SKU-depo sayısı): "90+ gün", "60-90 gün", "30-60 gün", "Hiç satılmadı / Never sold".
3. Tablo: "SKU", "Ürün", "Depo", "Miktar", "Son Satış" (yoksa "Yok / —"), "Geçen Gün / Days Since", "Dönem / Bucket" rozeti. Sıra: 90+ → 60-90 → 30-60 → Hiç satılmadı.
4. Boş: "Yaşlanmış stok bulunamadı". Hata: "Yaşlanma raporu yüklenemedi" + "Tekrar Dene / Try again".

### Hesap kuralı
- Yalnız miktarı > 0 olan SKU-depo stokları.
- "Son satış" = o SKU'nun o depodaki son **satış veya transfer çıkışı** hareketi.
- Son satıştan bu yana ≥30 gün geçenler (30-60, 60-90, 90+) ve hiç çıkış hareketi olmayanlar ("Hiç satılmadı") listelenir; 30 günden yeni hareketi olanlar listede yoktur.

## Yeniden Sipariş Önerileri (`/reports/reorder`)
Açıklama: "Yeniden sipariş noktasının altına düşen SKU'lar".

### Yerleşim
1. Başlık.
2. Tablo: "SKU", "Ürün", "Depo", "Mevcut / On Hand", "Yeniden Sipariş Noktası", "Sipariş Miktarı / Reorder Qty", "Kalan Gün / Days of Stock" (hesaplanamazsa "-"), "Aciliyet / Urgency" rozeti, "İşlemler" → **"PO Oluştur / Create PO"**.
3. Boş: "Yeniden sipariş gerektiren SKU yok". Hata: "Yeniden sipariş önerileri yüklenemedi" + "Tekrar Dene".

### Hesap kuralı
- Listelenen: Yeniden Sipariş Noktası > 0 ve Mevcut ≤ Yeniden Sipariş Noktası olan SKU-depo stokları.
- Aciliyet: Mevcut ≤ 0 → "Stokta Yok / Out of Stock"; Mevcut ≤ Nokta/2 → "Kritik / Critical"; diğerleri → "Düşük / Low".
- Kalan Gün = Mevcut ÷ (son 30 gündeki satış + transfer çıkışı ÷ 30); son 30 günde çıkış yoksa boş.
- "Sipariş Miktarı" stok kaydındaki "Yeniden Sipariş Miktarı"dır; öneri hesabı değildir.

## Aksiyonlar
| Buton | Ne olur | Kalıcı mı? |
|---|---|---|
| PO Oluştur (satır) | `/inventory/purchase-orders/new?sku={SKU}` açılır; ilk kalemin SKU'su dolu gelir. Miktar (1), tedarikçi, depo boş — kullanıcıyla doldur ([purchase-orders.md](purchase-orders.md)) | Hayır (yalnız gezinme) |
| Tekrar Dene | Raporu yeniden yükler | Hayır |

## Onay zamanlaması
- Bu ekranlarda kalıcı aksiyon yoktur; onay gerekmez. "PO Oluştur" ile açılan formda kayıt öncesi PO özeti + onay ([../../../playbooks/purchase-order-create.md](../../../playbooks/purchase-order-create.md)).
- Dışa aktarma yok; kullanıcı rapor isterse tabloyu snapshot'tan okuyup sohbette özetle.

## Tuzaklar
- "PO Oluştur" depo ve sipariş miktarını PO formuna taşımaz; satırdaki Depo ve "Sipariş Miktarı" değerlerini not al ve formda gir (miktar için kullanıcıya sor).
- Transferle başka depoya taşınan stok da "satış" gibi sayılır; yaşlanma ve kalan gün yorumunda bunu kullanıcıya belirt.
- Rapor çok depoyu bir arada gösterir; aynı SKU birden çok satırda olabilir.

## Doğrulama
- Salt okunur; değerleri [stock.md](stock.md)'taki SKU detayıyla karşılaştırarak teyit et.
