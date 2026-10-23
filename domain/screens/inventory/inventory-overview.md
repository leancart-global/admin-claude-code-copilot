# Envanter — genel bakış (Düşük Stok Paneli) ve envanter alanı haritası

- URL: `{ADMIN_URL}/inventory`
- Menü yolu: Sol menü "Envanter / Inventory" → "Gösterge Paneli / Dashboard".
- Sayfa başlığı: "Düşük Stok Paneli / Low Stock Dashboard"; açıklama "Tüm depolardaki envanter seviyelerini izleyin ve yönetin".
- Amaç: Düşük ve tükenmiş stokları depo bazında görmek, öncelik sırasına koymak, ilgili SKU'ya geçmek. Panel **salt okunur**.
- Entity: [../../entities/stock.md](../../entities/stock.md), [../../entities/warehouse.md](../../entities/warehouse.md).
- Yetki: `inventory:read`. "Stok Değeri" kartı yalnız super_admin, admin ve manager rollerine görünür.

## Envanter alanındaki ekranlar

| Menü (tr / en) | URL | Harita |
|---|---|---|
| Gösterge Paneli / Dashboard | `/inventory` | bu dosya |
| Stok / Stock | `/inventory/stock`, `/inventory/stock/{sku}`, `/inventory/stock/product/{productId}` | [stock.md](stock.md) |
| Depolar / Warehouses | `/inventory/warehouses`, `/new`, `/{id}` | [warehouses.md](warehouses.md) |
| Hareketler / Movements | `/inventory/movements` | [stock-movements.md](stock-movements.md) |
| Transferler, Satın Alma Siparişleri, Tedarikçiler, Sayım İşlemleri, Yeniden Sipariş Önerileri, Yaşlanma Raporu | `/inventory/transfers`, `/purchase-orders`, `/suppliers`, `/cycle-counts`, `/reports/reorder`, `/reports/aging` | ayrı haritalar |

Sık istekler → nereye:
- "İlk depoyu kur", "varsayılan depo yap" → [../../../playbooks/warehouse-setup.md](../../../playbooks/warehouse-setup.md)
- "X'in stoğunu 25 yap", "3 adet hasarlı düş" → [../../../playbooks/stock-adjust.md](../../../playbooks/stock-adjust.md)
- "Hangi ürünler bitmek üzere?" → bu panel veya stok listesinde "Sadece Düşük Stok"
- "Bu SKU'nun stoğu neden değişti?" → [stock-movements.md](stock-movements.md)

## Ön koşullar ve bağımlılıklar
- Depo ve stok kaydı yoksa panel boş görünür ("Düşük Stoklu Ürün Yok" / "Envanter verisi mevcut değil").

## Yerleşim

1. Özet kartları: "Düşük Stok Ürünler / Low Stock Items", "Stokta Yok / Out of Stock", "Kritik Ürünler / Critical Items",
   "Bekleyen Transferler / Pending Transfers".
2. "Stok Değeri / Inventory Value" kartı (yetkili rollerde, veri varsa): "{units} birim stok • {warehouses} depo";
   maliyeti olmayan SKU uyarısı "{count} SKU'da maliyet bilgisi yok — değer eksik hesaplanıyor"; seçili depoya göre süzülür.
3. "Depo Özeti / Warehouse Summary": "Tüm Depolar" + depo başına kart (Düşük Stok / Stokta Yok / Kritik sayıları);
   karta tıklamak tabloyu o depoya süzer (aria-label "{depo}: {n} Düşük Stok").
4. Filtreler: "SKU ile ara...", eşik Select ("Düşük Stok" vars., "Sipariş Noktasının Altında", "Sadece Stokta Olmayanlar"),
   depo Select "Tüm Depolar", "Filtreleri Temizle"; "Son güncelleme: …", "Şimdi Yenile" (panel ~5 dk'da bir kendini yeniler).
5. Tablo: "SKU" (tıklanabilir → [stock.md](stock.md) SKU detayı; altında ürün adı), "Depo", "Mevcut", "Rezerve",
   "Eldeki", "Transferde", "Sipariş Noktası", "Kalan Gün", "Aciliyet" (Kritik/Yüksek/Orta/Düşük),
   "Önerilen Aksiyon" (Acil Sipariş / Satın Alma Oluştur / Transfer Bekle / İzle).
6. Boş durum: "Düşük Stoklu Ürün Yok — Tüm envanter seviyeleri eşik değerinin üzerinde."
7. Panel hata verirse sayfa başlığı kalır, kartta "Envanter verileri yüklenemedi" + "Şimdi Yenile".

## Alanlar
Form yok; yalnız filtreler.

## Aksiyonlar

| Buton | Ne olur | Toast |
|---|---|---|
| SKU linki | SKU detayı açılır | — |
| Depo kartı / Tüm Depolar | Tablo süzülür | — |
| Şimdi Yenile | Veriler yeniden yüklenir | "Panel yenilendi" |

"Önerilen Aksiyon" rozetleri yalnız öneridir; tıklamak işlem yapmaz. Satın alma/transfer gerekiyorsa ilgili ekrana git.

## Onay zamanlaması (kural 2/5/6)
- Ekranda kalıcı değişiklik yapan aksiyon yok; onay gerekmez.

## Yan etkiler
- Yok.

## Tuzaklar
1. "Mevcut" sütunu kullanılabilir (eldeki − rezerve) miktardır; "Eldeki" ayrı sütundur.
2. Düşük stok eşiği her SKU + depo kaydının kendi "Düşük Stok Eşiği"dir; eşiği değiştirmek için [stock.md](stock.md) "Stok Ayarları".
3. Stok Değeri kartı maliyeti girilmemiş SKU'ları saymaz; değer eksik görünebilir (kart bunu ayrıca yazar).

## Doğrulama
- Stok düzeltmesinden sonra panel ~5 dk içinde kendini yeniler; hemen görmek için "Şimdi Yenile".
