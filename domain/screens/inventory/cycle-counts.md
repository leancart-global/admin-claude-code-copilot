# Sayım İşlemleri (Cycle Counts) — liste, oluştur, ABC planla, detay

| URL | Sayfa başlığı (tr / en) | Amaç |
|---|---|---|
| `{ADMIN_URL}/inventory/cycle-counts` | "Sayımlar / Cycle Counts" | Liste, filtre, "Yeni Sayım" ve "ABC Planla" diyalogları |
| `{ADMIN_URL}/inventory/cycle-counts/{id}` | Sayım adı + durum/öncelik rozetleri, "{Depo} • {Tür}" | Sayımı başlat, sayılan miktarları gir, farkı onayla/reddet, iptal |

- Menü yolu: Sol menü "Envanter / Inventory" → "Sayım İşlemleri / Cycle Counts".
- Açıklama: "Envanter sayımlarını ve fiziksel doğrulamayı yönetin".
- Amaç: Depodaki fiziksel miktarı sistem stoğuyla karşılaştırmak ve farkı (onaylı) stoğa yazmak.
- Entity: [../../entities/cycle-count.md](../../entities/cycle-count.md); ilişkili [../../entities/stock.md](../../entities/stock.md), [../../entities/warehouse.md](../../entities/warehouse.md).
- Yetki: ekran `inventory:read`; Yeni Sayım, Sayımı Başlat, Sayımı Gönder, İptal `inventory:write`; **ABC Planla, Farkı Onayla, Sayımı Reddet `inventory:admin`**.
- API (public): `GET/POST /cycle-counts`, `POST /cycle-counts/schedule`, `GET /cycle-counts/{id}`, `POST /cycle-counts/{id}/start|submit|approve|reject|cancel`.

## Durum akışı
```
Planlandı ──Sayımı Başlat──▶ Devam Ediyor ──Sayımı Gönder──▶ (fark tolerans içinde) Tamamlandı
    │                            │                     └──▶ (tolerans dışı fark) Gönderildi / onay bekliyor ──Farkı Onayla──▶ Onaylandı (düzeltmeler stoğa yazıldı)
    └──İptal──▶ İptal Edildi ◀──İptal┘                                              └──Reddet & Yeniden Say──▶ Reddedildi ──(yeniden sayım)
```
| Durum (tr / en) | Detayda görünen |
|---|---|
| Planlandı / Scheduled | "Sayımı Başlat", "İptal" |
| Devam Ediyor / In Progress | "Sayımları Gir" formu, "İptal" |
| Gönderildi / Submitted (onay bekliyor) | "Fark Özeti" + "Farkı Onayla", "Reddet & Yeniden Say" |
| Reddedildi / Rejected | "Sayımları Gir" formu (yeniden sayım; doğrulanmadı) |
| Onaylandı / Approved, Tamamlandı / Completed | "Sayım Özeti" (Beklenen → Sayılan, Fark) |
| İptal Edildi / Cancelled | — |

## Stoğa etkisi (fark onayı ve stoğa yazma)
- Sayım oluşturma, planlama, başlatma: **stok değişmez**.
- **Sayımı Gönder** anında her SKU için sistem miktarı okunur, fark = Sayılan − Sistem:
  - Fark yüzdesi **tolerans içindeyse** (varsayılan %5; ABC planlamada "Fark Eşiği") o SKU'nun stoğu **hemen sayılan miktara eşitlenir** — ayrı onay adımı yoktur.
  - Tolerans dışındaki SKU'lar stoğa yazılmaz; sayım onaya düşer ("Fark tespit edildi - onay gerekecek").
- **Farkı Onayla → "Onayla & Envanteri Güncelle"**: kalan farklı SKU'ların stoğu sayılan miktara eşitlenir. "Bu işlem geri alınamaz."
- **Reddet**: stok değişmez; yeniden sayım beklenir.
- Her stok eşitlemesi stok hareketlerinde "sayım" türünde, sayım referanslı bir satır oluşturur ([stock-movements.md](stock-movements.md)). Sayılan miktar, o SKU'nun rezerve miktarının altına inemez (`INSUFFICIENT_STOCK`: "önce rezervasyonları serbest bırakın").
- Sistemde (o depoda) stok kaydı olmayan SKU sayımda atlanır.

## Ön koşullar ve bağımlılıklar
- Aktif depo ([warehouses.md](warehouses.md)) ve sayılacak SKU'ların o depoda stok kaydı ([stock.md](stock.md)).
- Dış sistem/e-posta: yok.

## Yerleşim

### Liste
1. Başlık; sağda "ABC Planla / Schedule ABC" ve "Yeni Sayım / New Count".
2. Filtreler: durum ("Tüm Durumlar", Planlandı, Devam Ediyor, Gönderildi, Onaylandı, Reddedildi, Tamamlandı, İptal Edildi), tür ("Tüm Türler", Tam Sayım, Sayım, ABC Sayımı), depo ("Tüm Depolar"), "Yenile".
3. Tablo: "Sayım #", "Depo", "Tür", "Öncelik", "Durum", "Ürünler" ("{n} ürün"), "Planlanan", "Fark", "⋯" ("Detayları Gör").
4. Boş durum: "Sayım Bulunamadı" — "ABC sayımı planlayın veya manuel sayım oluşturun."

### Detay
- Başlık + rozetler; sağ üstte duruma göre "Sayımı Başlat / Start Count", "İptal / Cancel".
- "Sayımları Gir / Enter Counts" kartı ("Her ürün için fiziksel sayım miktarlarını girin") ya da "Fark Özeti" ya da "Sayım Özeti".
- Yan kartlar: "Zaman Çizelgesi" (Planlandı, Başlatıldı, Gönderildi, Onaylandı, Tamamlandı, Sayım İptal Edildi, "Sayım reddedildi - yeniden sayım bekleniyor", "Reddeden: {user}"), "Detaylar" (Planlanan Tarih, Bitiş Tarihi, Ürünler "{n} sayılacak ürün", Toplam Fark, Oluşturan, Sayım ID).

## Alanlar

### "Sayım Oluştur" diyaloğu ("Belirli ürünler için manuel sayım oluşturun")
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Sayım Adı / Count Name | Input ("ör. Haftalık Sayım - Koridor A") | evet | 1–100 | label "Sayım Adı" | |
| Depo / Warehouse | Select ("Depo seçin") | evet | — | label "Depo" | |
| Sayım Türü / Count Type | Select | — | "Sayım / Cycle Count" | label "Sayım Türü" | Sayım, Tam Sayım / Full Count, ABC Sayımı / ABC Count |
| Öncelik / Priority | Select | — | "Normal" | label "Öncelik" | Normal, Yüksek / High, Acil / Urgent |
| Planlanan Tarih / Scheduled Date | date Input | evet | bugün | label "Planlanan Tarih" | |
| Bitiş Tarihi / Due Date | date Input | hayır | — | label "Bitiş Tarihi" | Kaydedilip kaydedilmediği doğrulanmadı |
| Sayılacak Ürünler → SKU | Input | evet | boş olamaz | placeholder "SKU" | Depoda stok kaydı olan SKU |
| → Ürün Adı / Product Name | Input ("Ürün adı (isteğe bağlı)") | hayır | — | | Bilgi amaçlı (doğrulanmadı) |
| → Beklenen / Expected | number Input | — | ≥0, varsayılan 0 | label "Beklenen" | Fark hesabında **sayım anındaki sistem stoğu** esas alınır (doğrulanmadı: bu alanın kullanımı) |
| → Konum / Location | Input ("A1-01") | hayır | — | | Raf/konum kodu |
| Ürün Ekle / Add Item | Button | — | en az 1 ürün | "Ürün Ekle" | |
Butonlar: "İptal", "Sayım Oluştur / Create Count".

### "ABC Sayımı Planla" diyaloğu ("ABC sınıflandırmasına göre otomatik sayım planlayın")
| Label | Kontrol | Zorunlu | Varsayılan | Not |
|---|---|---|---|---|
| Depo / Warehouse | Select | evet | — | |
| Başlangıç Tarihi / Start Date | date Input | evet | bugün | Planlanan tarih sistemce ertesi gün olarak atanabilir (doğrulanmadı) |
| Fark Eşiği / Variance Threshold | number (0–100, %) | hayır | 5 | "Bu %'nin altındaysa otomatik onayla / Auto-approve if below this %" |
Butonlar: "İptal", "Sayımları Planla / Schedule Counts".
Kural: Depodaki stok kalemleri stok değerine göre A/B/C sınıfına ayrılır; sınıf için son sayımdan bu yana geçen süre dolmuşsa (A 7 gün, B 30 gün, C 90 gün) ve açık sayımı yoksa **her SKU için ayrı bir sayım** oluşturulur. A sınıfı sayımlar fark varsa her zaman onay ister; öncelik A=Yüksek, B=Normal, C=Düşük. Hiç sayım gerekmiyorsa yine başarı toast'ı çıkar ("No counts needed at this time" yanıtı).

### "Sayımları Gir" formu (detay)
- Her ürün kartı: SKU/ad, "Beklenen / Expected" (salt okunur), "Sayılan / Counted" (number ≥0, `#counted-{SKU}`), "Fark / Variance" (canlı, "{±n} fark" rozeti), "Notlar" ("Bu sayım hakkında gözlemler...").
- Fark varsa uyarı: "Fark tespit edildi - onay gerekecek".
- Buton: "Sayımı Gönder / Submit Count".

### "Fark Özeti" (onay bekleyen sayım)
- Başlık "Fark Özeti" — "Bu sayımda {count} farklı ürün var"; kutular: Farklı Ürünler, Toplam Ürün, Net Miktar Farkı, Fark Değeri.
- "Fark Detayları" tablosu: SKU, Ürün, Beklenen, Sayılan, Fark, Notlar.
- Butonlar: "Reddet & Yeniden Say / Reject & Recount", "Farkı Onayla / Approve Variance".
- **"Farkı Onayla" diyaloğu**: "Bu sayımı onaylamak envanter seviyelerini sayılan miktarlarla eşleştirecek. Bu işlem geri alınamaz." + "Onay Notları (isteğe bağlı)" → "Onayla & Envanteri Güncelle / Approve & Adjust Inventory".
- **"Sayımı Reddet" diyaloğu**: "Bu sayımı reddetmek etkilenen ürünlerin yeniden sayılmasını gerektirecek. Lütfen reddetme sebebi belirtin." + "Sebep" (zorunlu) → "Sayımı Reddet / Reject Count".

### "Sayımı İptal Et" diyaloğu
- "Bu sayımı iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz." → "Sayımı Koru / Keep Count" | "Sayımı İptal Et / Cancel Count" (sebep otomatik "Yönetici tarafından iptal edildi").

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Yeni Sayım → Sayım Oluştur | "Planlandı" sayım oluşur, detaya yönlenir | "Sayım başarıyla oluşturuldu" / "Sayım oluşturulamadı. Lütfen tekrar deneyin." |
| ABC Planla → Sayımları Planla | SKU başına çok sayıda sayım oluşturabilir | "ABC sayımları başarıyla planlandı" / "ABC sayımları planlanamadı…" |
| Sayımı Başlat (**diyalogsuz**) | Durum → Devam Ediyor | "Sayım başlatıldı" / "Sayım başlatılamadı" |
| Sayımı Gönder | Tolerans içi farklar **anında stoğa yazılır**; kalan fark varsa onaya düşer, yoksa Tamamlandı | "Sayım onaya gönderildi" / "Sayım gönderilemedi" |
| Farkı Onayla → Onayla & Envanteri Güncelle | Kalan farklar stoğa yazılır, durum Onaylandı | "Sayım onaylandı - envanter güncellendi" / "Sayım onaylanamadı" |
| Reddet & Yeniden Say → Sayımı Reddet | Durum Reddedildi | "Sayım reddedildi - yeniden sayım gerekli" / "Sayım reddedilemedi" |
| İptal → Sayımı İptal Et | Durum İptal Edildi (yalnız Planlandı/Devam Ediyor) | "Sayım iptal edildi" / "Sayım iptal edilemedi" |

## Onay zamanlaması (kural 2/5/6)
- **Yeni Sayım**: özet (ad, depo, tür, öncelik, tarih, SKU listesi) + onay; stok değişmez.
- **ABC Planla**: oluşacak sayım sayısı önceden bilinmez (SKU başına bir kayıt, yüzlerce olabilir) → kullanıcıya bunu söyleyip ayrı onay al.
- **Sayımı Başlat**: diyalog yok; tıklamadan önce onay.
- **Sayımı Gönder**: **stoğu değiştirebilir** (tolerans içi farklar onaysız yazılır). Özetinde her SKU için Sistem → Sayılan → Fark ve hangi SKU'ların doğrudan stoğa yazılacağını göster; ayrı onay.
- **Farkı Onayla**: geri alınamaz toplu stok düzeltmesi; etkilenen SKU sayısı, net miktar farkı ve fark değeriyle ayrı onay.
- **Reddet / İptal**: geri alınamaz durum değişikliği; ayrı onay.
- E-posta/bildirim/dış sistem: yok.

## Yan etkiler
- Eşitlenen SKU'larda kullanılabilir stok ve stok durumu ("stokta yok" vb.) değişir; vitrine yansır (doğrulanmadı: gecikme).
- Stok kaydında son sayım tarihi/miktarı güncellenir; ABC planlaması bunu dikkate alır.

## Tuzaklar
- "Sayımı Gönder" tek başına stok yazabilir; "onaya gönderiyorum" diye düşünme.
- Beklenen değeri, sayımı oluşturduğun andaki değer değil, **gönderim anındaki** sistem stoğudur; sayım sırasında satış olursa fark değişebilir.
- Sayılan miktar rezerve miktarın altındaysa düzeltme reddedilir; önce açık sipariş/transfer rezervasyonlarını kullanıcıyla konuş.
- Onay ve red `inventory:admin` ister.

## Doğrulama
1. Toast ve durum rozeti.
2. Onay/tamamlanma sonrası "Sayım Özeti"nde Beklenen → Sayılan ve Fark.
3. [stock.md](stock.md)'ta SKU + depo miktarının sayılan değere eşitlendiği; [stock-movements.md](stock-movements.md)'ta sayım hareketi.
