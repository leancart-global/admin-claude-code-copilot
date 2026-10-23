# Playbook: Bir SKU'nun stoğunu düzelt ("X'in stoğunu 25 yap", "3 adet hasarlı düş", "50 adet mal geldi")

Tetikleyiciler: "stoğu … yap/güncelle", "… adet ekle/çıkar", "sayım sonucu …", "hasarlı/kayıp düş", "mal geldi",
"stoğu sıfırla", bir ürünün varyant stoklarını toplu girme.
Harita: ../domain/screens/inventory/stock.md (diyalog alanları, locator, tuzaklar), ../domain/entities/stock.md
(Eldeki/Rezerve/Kullanılabilir, düzeltme türleri, yan etkiler), ../domain/screens/inventory/stock-movements.md (doğrulama).

---

## 0. Kural hatırlatması
- Her düzeltme kalıcıdır ve silinemeyen bir hareket kaydı bırakır → **özet + açık "evet"**.
- Birden çok SKU / depo (toplu panel, matris) = toplu işlem → etkilenen kayıt sayısıyla **ayrı onay** (kural 5).
- Stok 0'dan yukarı çıkacaksa "stok gelince haber ver" abonelerine **müşteri e-postası** gidebilir → özette yaz.
- Mağazada bağlı pazaryeri varsa ([../domain/screens/marketplace/marketplace-overview.md](../domain/screens/marketplace/marketplace-overview.md))
  **bağlı pazaryerlerinde stok da güncellenir** (kullanılabilir − kanal stok tamponu, birkaç saniye içinde; dış sisteme
  yazar) → özetin yan etki satırına yaz ([../domain/entities/marketplace-channel.md](../domain/entities/marketplace-channel.md) §7).
- Sıfırla / Arşivle geri alınamaz kabul edilir → tek tek onay.

## 1. İsteği çözümle

| Bilgi | Karşılık | Varsayılan (sorulmazsa) |
|---|---|---|
| SKU | Stok kaydı | Kullanıcı ürün adı verdiyse Ürünler ekranında SKU'yu bul (stok listesi yalnız SKU ile arar); birden çok varyant varsa hangisi olduğunu sor |
| Depo | Depo satırı | Tek depoda kayıt varsa o; birden çoksa **sor** |
| Tür | Ayarla / Ekle / Çıkar | "… yap", "sayım …" → **Ayarla**; "… geldi/ekle" → **Ekle**; "… düş/çıkar/hasarlı/kayıp" → **Çıkar** |
| Miktar | Miktar | — (sor) |
| Hedef hangi miktar? | Eldeki | "Stok X" = Eldeki X. Kullanıcı "satılabilir X" derse Eldeki = X + Rezerve (özette açıkla) |
| Sebep | Sebep Kategorisi | Ayarla+sayım → Yeniden Sayım; Ekle+mal girişi → Yeniden Stoklama; hasar → Hasar; kayıp → Çalıntı / Kayıp; iade → Müşteri İadesi; diğer → Düzeltme ("varsayılan" işaretle) |
| Açıklama / Referans | Açıklama, Referans | boş; Diğer seçilirse açıklama zorunlu |

## 2. Mevcut durumu oku (salt okunur)
1. `/inventory/stock/{SKU}` aç (SKU URL-kodlu). Bulunamazsa `/inventory/stock` → "SKU ile ara" → SKU yaz → bekle.
2. "Depo Dağılımı" tablosundan hedef depo satırında **Eldeki, Rezerve, Kullanılabilir, Durum** oku.
3. Hedef depoda satır yoksa: kayıt yok → düzeltme yerine **"Depoya Ekle"** (Başlangıç Miktarı) gerekir → plan değişir,
   kullanıcıya söyle. Hiç depo yoksa → ./warehouse-setup.md.
4. Çıkar ile eldekinin altına inilecekse (ön sipariş kapalıyken) işlem reddedilir → kullanıcıya bildir, Ayarla öner.

## 3. Özet + onay

| Alan | Değer |
|---|---|
| Ortam | prod / dev / local |
| SKU / Ürün | ABC-123-M / Basic Tişört — M |
| Depo | Ana Depo (WH-01) |
| İşlem | Ayarla → 25 |
| Eldeki | 12 → **25** |
| Rezerve | 3 (değişmez) |
| Kullanılabilir | 9 → **22** |
| Durum (tahmini) | Düşük Stok → Stokta (eşik 10) |
| Sebep / Açıklama / Referans | Yeniden Sayım / — / — |
| Yan etki | Vitrinde satılabilir 22; stok 0'dan çıkıyorsa abonelere e-posta; bağlı pazaryerlerinde stok da güncellenir (Trendyol: 22 − tampon) |

## 4. Uygula
1. Hedef depo satırındaki ikon (aria-label "Stok Düzenle / Adjust Stock"); tek depoluda başlıktaki "Stok Düzenle" de olur.
2. Diyalog "Stok Düzenle — {sku} için stok miktarını düzenle" → snapshot.
3. Tür: `#adj-set` / `#adj-add` / `#adj-remove`.
4. `#quantity` → değeri **temizleyip** yaz (varsayılan mevcut miktarla dolu gelir).
5. **Önizleme** "{mevcut} → {yeni}" özetle aynı mı kontrol et; farklıysa dur.
6. `#reasonCode` Select → sebep; `#reasonNote`, `#reference` (varsa).
7. Onay alınmışsa "Uygula" → toast "Stok başarıyla düzenlendi — {sku} stoku {n} olarak güncellendi".

### Varyantlı ürünün birden çok varyantı (aynı ürün)
- `/inventory/stock/product/{productId}` (ürün detayında "Ürün envanterini görüntüle") → "Düzenleme modu" switch →
  hücrelere yeni **mutlak** değerleri yaz → alttaki "{n} kaydedilmemiş değişiklik" sayısını özetle karşılaştır →
  toplu özet (varyant × depo, eski → yeni) + onay → "Değişiklikleri kaydet". "—" hücreleri için önce "Depoya ekle".

### Farklı ürünlerden çok SKU, tek depo
- Liste → "Toplu Düzenle" → Depo → satırlar (SKU, Tür, Miktar; en fazla 50) → Sebep → toplu özet + onay →
  "Toplu Düzenlemeyi Uygula".

## 5. Doğrula
1. SKU detayında depo satırı: Eldeki / Kullanılabilir / Durum beklenen değerde.
2. "Son Hareketler"de yeni "Düzeltme" satırı (değişim, sebep, referans, kullanıcı) — ya da
   `/inventory/movements?sku={SKU}`.
3. Toplu/matris işlemlerinde her SKU'yu tek tek kontrol et; kaydolmayan varsa kullanıcıya listele (yeniden deneme yeni onay ister).
4. Rapor: SKU, depo, eski → yeni, hareket kaydı, (varsa) bildirim yan etkisi.

## 6. Hata durumları
- "Stok eklemeden önce bir depo tanımlamanız gerekir…" → ./warehouse-setup.md.
- "Bu SKU seçili depoda zaten kayıtlı…" → kayıt açma yerine Stok Düzenle.
- "Stok düzenleme başarısız" → snapshot, mesajı oku; Çıkar'da yetersiz stok ise kullanıcıya sor. Beklenmeyen hata →
  dur, kullanıcıya bildir.
- Matriste "çakışma" → "Çakışanları yenile", yeni değerleri oku, özet değiştiyse **yeniden onay**.
