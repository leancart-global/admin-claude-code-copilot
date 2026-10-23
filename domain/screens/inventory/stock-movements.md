# Stok Hareketleri (Movements)

- URL: `{ADMIN_URL}/inventory/movements`; SKU filtreli: `{ADMIN_URL}/inventory/movements?sku={SKU}`.
- Menü yolu: Sol menü "Envanter / Inventory" → "Hareketler / Movements". Ayrıca stok listesinde "Stok geçmişini gör",
  SKU detayında "Tümünü gör" / "Hareketleri Görüntüle".
- Sayfa başlığı: "Stok Hareketleri / Movement Audit"; açıklama "Tüm envanter hareketlerinin tam denetim izi".
- Amaç: Bir SKU'nun ya da deponun stok değişim geçmişini okumak (kim, ne zaman, ne kadar, neden); stok düzeltmesinden
  sonra doğrulama; CSV dışa aktarma.
- Entity: [../../entities/stock.md](../../entities/stock.md) (hareket türleri).
- Yetki: `inventory:read`. Ekran **salt okunur**; hareket oluşturma/düzenleme/silme yoktur.

## Ön koşullar ve bağımlılıklar

- Yok. Hareketler stok düzeltmeleri ([stock.md](stock.md)), ürün formundan stok girişi, siparişler, iadeler, transfer,
  satın alma ve sayım işlemlerinden otomatik oluşur.

## Yerleşim

1. Başlık + açıklama.
2. Hızlı filtreler: "SKU ile ara..." (URL'deki `sku` ile dolu gelir), "Hareket türü" Select ("Tüm Türler" + Düzeltme,
   Satış, İade, Gelen Transfer, Giden Transfer, Satın Alma, Hasarlı, Fire, Sayım Düzeltmesi, Rezervasyon, Serbest Bırakıldı),
   depo Select "Tüm Depolar", "Daha Fazla Filtre / More Filters" (dar ekranda "Filtreler").
3. Tablo sütunları: "Ürün", "Tarih/Saat", "Tür" (rozet), "Depo", "Miktar Değişimi" (+/−), "Stok Seviyesi" (hareket
   sonrası), "Sebep", "Referans", "Kullanıcı". Satıra tıklamak detay panelini açar.
4. Boş durum: "Hareket Bulunamadı / No Movements" — "Filtrelerinize uygun envanter hareketi bulunamadı."
5. Sayfalama: sayfa başına 20; filtre başına en fazla 100 hareket yüklenir → dar tarih aralığı ve SKU filtresi kullan.

### "Daha Fazla Filtre" paneli
| Label (tr / en) | Kontrol | Varsayılan | Not |
|---|---|---|---|
| Tarih Aralığı → Başlangıç / From | native date | **bugünden 30 gün önce** | `fill('2026-10-01')` |
| 〃 Bitiş / To | native date | bugün | |
| Dışa Aktar → "CSV Olarak İndir / Export to CSV" | buton | — | Filtrelenmiş hareketleri CSV indirir |
Butonlar: "İptal", "Filtreleri Uygula / Apply Filters".

### Hareket detayı paneli ("Hareket Detayları / Movement Details" + tür rozeti ve açıklaması)
- Sebep; Ürün (SKU, Ad); Konum (Depo; transferde "Kaynak Depo" / "Hedef Depo"); Referans (Tür, ID, "Detayı Gör" →
  sipariş, transfer veya sayım ekranı); Maliyet Etkisi (Birim / Toplam Maliyet, varsa); Notlar; Denetim Bilgisi
  (Tarih/Saat, Kullanıcı); "Teknik detayları göster" (hareket, depo, ürün kimlikleri).

## Alanlar
Form yok; yalnız filtreler (yukarıda).

## Aksiyonlar

| Buton | Ne olur | Toast |
|---|---|---|
| Filtreleri Uygula | Liste yeniden yüklenir | hata "Hareketler yüklenemedi. Lütfen tekrar deneyin." |
| CSV Olarak İndir | Tarayıcıya CSV dosyası iner | "Dışa aktarma indirildi"; "Dışa aktarma dosyası şu anda mevcut değil…"; "Hareketler dışa aktarılamadı…" |
| Satır tıklama | Detay paneli | — |
| Detayı Gör (referans) | İlgili sipariş / transfer / sayım sayfası | — |

## Onay zamanlaması (kural 2/5/6)

- Kalıcı değişiklik yapan aksiyon yok.
- **CSV dışa aktarma**: dosya, işlemi yapan çalışanların adlarını içerir → yalnız kullanıcı isterse ve indirileceğini
  söyleyerek yap; dosyayı açıp içeriğini okuma/aktarma.

## Yan etkiler
- Yok.

## Tuzaklar

1. Varsayılan tarih aralığı son 30 gün; daha eski hareket arıyorsan Başlangıç'ı değiştir.
2. "Miktar Değişimi" fark, "Stok Seviyesi" hareketten sonraki eldeki miktardır (kullanılabilir değil).
3. Ürün formundan girilen stok ve matris düzenlemeleri de "Düzeltme" türünde görünür; ayırt etmek için Sebep sütununa bak
   (matris: "Manuel matris düzenlemesi", ilk kayıt: "Initial stock creation").
4. Rezervasyonlar eldeki miktarı değiştirmediği için bu listede çoğunlukla görünmez (doğrulanmadı); rezerve miktarı
   SKU detayından oku.

## Doğrulama
- Stok düzeltmesinden sonra: `?sku={SKU}` aç → en üstteki satırda tür "Düzeltme" (en arayüzde düzeltme türüyle
  birlikte: "Adjustment Add" / "Adjustment" vb.), doğru depo, değişim (+/−),
  yeni stok seviyesi, sebep ve referans özetle aynı olmalı.
