# Stok Transferleri (Stock Transfers) — liste, oluştur, detay

| URL | Sayfa başlığı (tr / en) | Amaç |
|---|---|---|
| `{ADMIN_URL}/inventory/transfers` | "Stok Transferleri / Stock Transfers" | Liste, filtre, "Yeni Transfer" diyaloğu |
| `{ADMIN_URL}/inventory/transfers/{id}` | Transfer numarası + durum rozeti | Detay, durum ilerletme, notlar |

- Menü yolu: Sol menü "Envanter / Inventory" → "Transferler / Transfers".
- Açıklama: "Depolar arası envanter transferlerini yönetin".
- Amaç: Aynı mağazanın iki deposu arasında stok taşımak; talep → onay → gönderim → teslim → tamamlama adımlarıyla.
- Entity: [../../entities/stock-transfer.md](../../entities/stock-transfer.md); ilişkili [../../entities/warehouse.md](../../entities/warehouse.md), [../../entities/stock.md](../../entities/stock.md).
- Yetki: ekran `inventory:read`; oluştur, gönder, teslim kaydı, tamamla, iptal, not `inventory:write`; **onayla `inventory:admin`**.
- API (public): `GET/POST /transfers`, `GET/PATCH /transfers/{id}`, `PATCH /transfers/{id}/approve|ship|receive|complete|cancel`.

## Durum akışı
```
Talep Edildi ──Transferi Onayla──▶ Onaylandı ──Gönderildi Olarak İşaretle──▶ Gönderildi ──Teslim Kaydı──▶ Teslim Alındı ──Transferi Tamamla──▶ Tamamlandı
     └──Transferi İptal Et──▶ İptal Edildi ◀──Transferi İptal Et──┘
```
| Durum (tr / en) | Kod | Detaydaki butonlar |
|---|---|---|
| Talep Edildi / Requested (detayda rozet "Onay Bekliyor / Pending Approval") | `requested` | Transferi Onayla, Transferi İptal Et |
| Onaylandı / Approved | `approved` | Gönderildi Olarak İşaretle, Transferi İptal Et |
| Gönderildi / Shipped (ve Yolda / In Transit) | `shipped`, `in_transit` | Teslim Kaydı |
| Teslim Alındı / Received | `received` | Transferi Tamamla |
| Tamamlandı / Completed | `completed` | — |
| İptal Edildi / Cancelled | `cancelled` | — |
Gönderildikten sonra iptal yoktur.

## Stoğa etkisi
| Adım | Kaynak depo | Hedef depo |
|---|---|---|
| Oluştur | Kontrol: her SKU için kaynakta **kullanılabilir** miktar ≥ istenen; yetmezse `INSUFFICIENT_STOCK`, SKU kaynakta yoksa `NOT_FOUND`. Stok değişmez | — |
| Onayla | Yok | Yok |
| Gönderildi Olarak İşaretle | Transferdeki miktar **rezerve** edilir (kullanılabilir stoktan düşer); stok hareketlerinde "transfer çıkışı" | — |
| Teslim Kaydı | Yok (yalnız teslim alınan miktar ve fark kaydedilir) | Yok |
| Transferi Tamamla | Rezerve miktar kesin olarak düşer | **Teslim alınan miktar** eklenir (SKU depoda yoksa stok kaydı açılır); "transfer girişi" hareketi |
| İptal (Talep/Onay) | Yok | Yok |
Fark (teslim alınan − gönderilen) varsa kaynaktan düşen miktar gönderilen miktardır, hedefe eklenen teslim alınan miktardır; aradaki fark kayıp olarak kalır.

## Ön koşullar ve bağımlılıklar
- En az **iki aktif depo** ([warehouses.md](warehouses.md)).
- Kaynak depoda transfer edilecek SKU'nun stok kaydı ve yeterli kullanılabilir miktarı ([stock.md](stock.md)).
- Dış sistem: yok (kargo entegrasyonu, e-posta, pazaryeri yazımı yapılmaz).

## Yerleşim

### Liste
1. Başlık + "Yeni Transfer / New Transfer".
2. Filtreler: durum Select ("Tüm Durumlar", Talep Edildi, Onaylandı, Gönderildi, Yolda, Teslim Alındı, Tamamlandı, İptal Edildi), depo Select ("Tüm Depolar"; **kaynak depoya** göre filtreler), "Yenile".
3. Tablo: "Transfer #", "Güzergah / Route" (kaynak → hedef), "Durum", "Ürünler / Items" ("{n} ürün"), "Miktar / Qty", "Oluşturulma", "⋯" ("Menüyü aç" → "Detayları Gör").
4. Boş durum: "Transfer Bulunamadı" + "Yeni Transfer".

### Detay
- Başlık: transfer numarası (`TRF` + tarih + sıra), durum rozeti, geri linki.
- "İşlemler / Actions" kartı ("Bu transferi iş akışında ilerletin") — duruma göre butonlar.
- "Transfer Ürünleri ({n})" tablosu: SKU, Ürün, Talep Edilen, Gönderilen, Teslim Alınan, Fark; altında Toplam Talep / Toplam Gönderilen / Toplam Teslim Alınan / Toplam Fark.
- "Zaman Çizelgesi": Oluşturuldu, Onaylandı, Gönderildi, Teslim Alındı, Tamamlandı / Transfer İptal Edildi ("{user} tarafından").
- "Notlar" kartı + "Notları Düzenle / Edit Notes" (Tamamlandı/İptal dışındaki durumlarda).
- "Bilgi": Oluşturulma, Oluşturan, Transfer ID.

## Alanlar

### "Stok Transferi Oluştur" diyaloğu ("Depolar arası envanter taşımak için yeni bir transfer oluşturun")
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Kaynak Depo / From Warehouse | Select ("Kaynak seçin") | evet | — | label "Kaynak Depo" | |
| Hedef Depo / To Warehouse | Select ("Hedef seçin") | evet | Kaynakla aynı olamaz (listede kaynak gizlenir) | label "Hedef Depo" | |
| Ürünler / Items → SKU | Input | evet | boş olamaz | placeholder "SKU" | Kaynak depodaki stok SKU'su |
| Ürünler → Miktar / Quantity | number Input | evet | tam sayı ≥1 | label "Miktar" | Kaynakta kullanılabilir miktarı aşamaz |
| Ürünler → Lot # | Input | hayır | — | placeholder "İsteğe bağlı" | |
| Ürün Ekle / Add Item | Button | — | En az 1, en çok 100 ürün | "Ürün Ekle" | Satır silme ikonu son satırda pasif |
| Notlar / Notes | Textarea | hayır | — | `#notes` | |
Butonlar: "İptal", "Transfer Oluştur / Create Transfer".

### "Gönderiyi Onayla / Confirm Shipment" diyaloğu
- Açıklama: "Gönderilecek miktarları doğrulayın. Stok kaynak depodan düşülecektir."
- Her ürün için "Gönderim Miktarı / Ship Qty" (0–talep). Gönderim, transferdeki talep miktarının **tamamı** üzerinden yapılır (doğrulanmadı: farklı miktar girilirse dikkate alınıp alınmadığı); kısmi gönderim gerekiyorsa kullanıcıya sor, gerekirse transferi iptal edip doğru miktarla yeniden oluştur.
- Butonlar: "İptal", "Gönderiyi Onayla".

### "Teslim Kaydı / Record Receipt" diyaloğu
- Açıklama: "Teslim alınan gerçek miktarları girin. Farklar kaydedilecektir."
- Her ürün: "Gönderilen: {n}", "Teslim Alınan / Received" (number, ≥0), canlı "Fark: {±n}".
- "Notlar (isteğe bağlı)". Butonlar: "İptal", "Teslimi Onayla / Confirm Receipt".

### "Transferi İptal Et" diyaloğu
- "Bu transferi iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz."
- "Sebep (isteğe bağlı)" (boşsa "Yönetici tarafından iptal edildi"). Butonlar: "Transferi Koru / Keep Transfer", "Transferi İptal Et".

### "Transfer Notlarını Düzenle" diyaloğu
- Textarea ("Bu transfer hakkında not ekleyin..."); boş kaydedilirse not silinir. Buton "Notları Kaydet / Save Notes".

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Yeni Transfer → Transfer Oluştur | Transfer "Talep Edildi" durumunda oluşur, detaya yönlenir | "Transfer başarıyla oluşturuldu" / "Transfer oluşturulamadı. Lütfen tekrar deneyin." |
| Transferi Onayla (**diyalogsuz**) | Durum → Onaylandı | "Transfer onaylandı" / "Transfer onaylanamadı" |
| Gönderildi Olarak İşaretle → Gönderiyi Onayla | Durum → Gönderildi; kaynakta rezervasyon | "Transfer gönderildi olarak işaretlendi" / "…işaretlenemedi" |
| Teslim Kaydı → Teslimi Onayla | Durum → Teslim Alındı; fark kaydı | "Transfer teslim kaydı oluşturuldu" / "Teslim kaydı oluşturulamadı" |
| Transferi Tamamla (**diyalogsuz**) | Durum → Tamamlandı; hedefe stok girişi, kaynaktan kesin düşüm. **Fark varsa** tamamlama reddedilir | "Transfer tamamlandı" / "Transfer tamamlanamadı" |
| Transferi İptal Et → Transferi İptal Et | Durum → İptal Edildi | "Transfer iptal edildi" / "Transfer iptal edilemedi" |
| Notları Düzenle → Notları Kaydet | Not güncellenir | "Notlar kaydedildi" / "Notlar kaydedilemedi" |

## Onay zamanlaması (kural 2/5/6)
- **Oluştur**: özet (kaynak → hedef, SKU × miktar, kaynaktaki mevcut kullanılabilir miktar) + onay. Stok değişmez.
- **Transferi Onayla** ve **Transferi Tamamla**: diyalog **yok**, tıklayınca kaydolur → onayı butona basmadan **önce** al.
- **Gönderildi Olarak İşaretle**: kaynak deponun kullanılabilir ("Kullanılabilir") stoğunu düşürür; ayrı onay (etkilenen SKU sayısı, toplam adet).
- **Transferi Tamamla**: hedef depoya stok ekler, geri alınamaz; ayrı onay.
- **İptal**: geri alınamaz; ayrı onay. Yalnız Talep Edildi/Onaylandı'da mümkün.
- Notları Kaydet: kalıcıdır; kısa özet + onay.
- E-posta/bildirim/dış sistem: yok.

## Yan etkiler
- Gönderimden tamamlamaya kadar transferdeki miktar kaynak depoda rezerve görünür ve satışa kapalıdır ([stock.md](stock.md) "Rezerve").
- Stok hareketleri ekranında transfer numarası referanslı çıkış ve giriş satırları ([stock-movements.md](stock-movements.md)).
- Transfer çıkışları [inventory-reports.md](inventory-reports.md)'teki yaşlandırma ("son satış") ve yeniden sipariş (günlük çıkış hızı) hesaplarına dahildir.

## Tuzaklar
- Teslimde fark girilirse transfer tamamlanamayabilir; farkı girmeden önce kullanıcıyla teyit et ve durumu kullanıcıya bildir.
- Onay yetkisi (`inventory:admin`) yoksa "Transferi Onayla" hata verir.
- Depo filtresi yalnız kaynak depoya bakar; hedef depoya gelen transferleri görmek için listeyi filtresiz tara.
- Gönderimden sonra iptal yoktur; yanlış transferi göndermeden önce iptal et.

## Doğrulama
1. Toast ve detaydaki durum rozeti / zaman çizelgesi.
2. Ürün tablosunda Gönderilen, Teslim Alınan, Fark.
3. Tamamlandıktan sonra [stock.md](stock.md)'ta SKU'nun kaynak ve hedef depo miktarları.
