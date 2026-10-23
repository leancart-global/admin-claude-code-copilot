# Kanal Kategori Eşleme (Channel Category Mapping)
- URL: {ADMIN_URL}/marketplace/<kanal>/categories — `<kanal>` ∈ `trendyol` | `amazon` | `n11` | `hepsiburada`
- Menü yolu: Kanal panosu ([channel.md](channel.md)) → sekme **"Kategoriler / Categories"**.
- Sayfa başlığı (h2): "Kategori Eşleştirme — {kanal} / Category Mapping — {kanal}"; açıklama "LeanCart kategorilerini {kanal} kategorileriyle eşleştirin." (Amazon'da ek: "Kategorileri bulmak için göz atma ağacını kullanın.")
- Amaç: (1) Her LeanCart kategorisini pazaryerinin bir kategorisiyle eşlemek — ürün gönderiminin ön koşulu; (2) kategori bazında komisyon oranı tanımlamak (net gelir ve fiyat hesabı için).
- Entity: [../../entities/marketplace-channel.md](../../entities/marketplace-channel.md) (§Kategori eşleme, §Komisyon kuralı); LeanCart kategorileri [../../entities/category.md](../../entities/category.md).
- Yetki: okuma `marketplace:read`; komisyon kaydı `marketplace:write`.

> **Durum: geliştiriliyor.** Eşleme panelleri şu an mağazanın gerçek kategori ağacını ve pazaryerinin kategori listesini göstermez; örnek satırlar görünür ("Women > Clothing", "Men > T-Shirts", "Category A"…), ilerleme çubuğu sabit bir toplam gösterir ve "Eşleştirme Ekle" bir işlem başlatmaz. Kullanıcı "{kanal} kategori eşlemesini yap" derse ekranı açıp bu durumu doğrula, **kayıt yapmadan** kullanıcıya bildir ve eşlemenin şimdilik pazaryeri tarafında / ileride bu ekrandan yapılacağını söyle. Aşağıdaki harita ekranın tasarlanmış kullanımıdır.

## Ön koşullar ve bağımlılıklar
- Kanal bağlantısı aktif ve "Bağlı" ([../settings/marketplace.md](../settings/marketplace.md), [channel.md](channel.md)).
- LeanCart kategori ağacı ([../categories/](../categories/)). Eşleme **yaprak (en alt) pazaryeri kategorisine** yapılır (pazaryeri kuralı; doğrulanmadı).
- Etkiledikleri: [channel-products.md](channel-products.md) "Hazırlık" sütunu ("Kategori eşleşmemiş" hatası), ürün gönderimi, net gelir hesabı.

## Yerleşim
1. Başlık + sağda **"Eşleştirme Ekle / Add Mapping"** (artı ikonlu).
2. İlerleme kartı: "{total} kategoriden {mapped} tanesi eşleştirildi (%{percent})" + rozet "Tamamlandı / Complete" (100%) ya da "Devam Ediyor / In Progress" + ilerleme çubuğu.
3. **Eşlenmiş kategoriler tablosu** (en az bir eşleme varsa), başlık "LeanCart Kategorileri / LeanCart Categories". Sütunlar: seçim kutusu · LeanCart kategorisi (yolu, yeşil onay ikonu) · {kanal} kategorisi · **"Komisyon % / Commission %"** (Amazon'da "Tahmini Referral Fee % / Est. Referral Fee %" + ⓘ ipucu).
   - Komisyon hücresi: sayı kutusu (0–99.99, adım 0.1, placeholder `15`) + "%"; kuralı olmayan kategoride yanında "(varsayılan) / (default)".
4. İki panel:
   - Sol **"LeanCart Kategorileri"**: arama "Kategori ara... / Search categories..." + kategori listesi (eşlenmemişlerde sarı uyarı ikonu). Satıra tıklamak onu seçer.
   - Sağ **"{kanal} Kategorileri / {kanal} Categories"**: açıklama "Önce bir LeanCart kategorisi seçin" → seçince "Eşleşen {kanal} kategorisini seçin"; arama "{kanal} kategorilerinde ara..." (sol seçim yokken pasif); seçim yokken "{kanal} eşleşmelerini görmek için bir LeanCart kategorisi seçin"; listede satırlar sağ oklu.
5. Tablo satırları seçilince altta yüzen çubuk: "{n} kategori seçildi / {n} categories selected" · **"Seçimi Temizle / Clear Selection"** · **"Komisyon Belirle / Set Commission"**.
6. Toplu komisyon diyaloğu "Komisyon Belirle": açıklama "{n} kategori seçildi"; alan "Komisyon Oranı (%) / Commission Rate (%)" (placeholder "Komisyon oranı girin"); butonlar "Seçimi Temizle" (diyaloğu kapatır) ve **"Uygula / Apply"** (alan boşken pasif).

## Alanlar
| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Sol panel | Kategori ara... | Input | — | — | placeholder | Salt arama |
| Sağ panel | {kanal} kategorilerinde ara... | Input | — | sol seçim şart | placeholder | Salt arama |
| Tablo | Komisyon % | number Input | hayır | 0–99.99; aralık dışı değer sessizce eski değere döner; boş = kanal varsayılanı | satırdaki tek `spinbutton` (kategori adıyla aynı satır) | **Alandan çıkınca (blur) ya da Enter'da anında kaydeder** |
| Diyalog | Komisyon Oranı (%) | number Input | evet | 0–99.99 | label metni / placeholder "Komisyon oranı girin" | Enter de Uygula gibi çalışır — Enter kullanma, "Uygula"ya tıkla |

Komisyon değeri **yüzde** olarak girilir: %18 için `18`.

## Aksiyonlar
| Aksiyon | Ne olur | Toast |
|---|---|---|
| Sol satır → sağ satır (tasarlanan eşleme akışı) | LeanCart kategorisi seçilen pazaryeri kategorisine eşlenir; ilerleme artar, satır tabloya geçer (doğrulanmadı — geliştiriliyor) | doğrulanmadı |
| Eşleştirme Ekle | Yeni eşleme başlatır (geliştiriliyor; şu an işlem yok) | — |
| Komisyon hücresi → değer yaz → hücreden çık | Kategori komisyon kuralı oluşur/güncellenir — **anında** | "{kategori} için komisyon kaydedildi / Commission saved for {category}" |
| Seç → Komisyon Belirle → oran → Uygula | Seçili tüm kategorilere aynı oran | "{n} kategori için komisyon %{oran} olarak ayarlandı" |
| Seçimi Temizle | Seçimi kaldırır | — |

## Onay zamanlaması
- **Komisyon hücresi otomatik kaydeder** (hook yakalayamaz): değeri yazmadan **önce** özet (kanal, kategori, eski → yeni oran, etkilenen: o kategorideki ürünlerin net gelir/fiyat hesabı) + onay. Yanlışlıkla odaklanıp çıkmak da kayıt tetikleyebilir; hücreye ancak onaydan sonra dokun.
- Toplu "Uygula": **kural 5** — etkilenen kategori sayısı (çubuktaki n) ve oranla ayrı onay.
- Komisyon kuralları LeanCart içi ayardır; pazaryerine yazılmaz. Pazaryerinin kestiği gerçek komisyonu değiştirmez — yalnız net gelir/kâr hesabını ve fiyat formülünü etkiler.
- Kategori eşlemesi (etkinleştiğinde) LeanCart içi kayıttır; pazaryerine yazmaz ama sonraki gönderimlerde ürünlerin hangi pazaryeri kategorisinde listeleneceğini belirler → özet + onay; mevcut eşlemeyi değiştirmek daha önce gönderilmiş ürünleri etkileyebilir (doğrulanmadı).

## Kurallar (iş kuralı)
- Ürün, gönderimde **birincil (ilk) kategorisinin** eşlemesiyle pazaryerine gider; eşleme yoksa Trendyol hazırlık kontrolü "Kategori eşleşmemiş" hatası verir.
- **Zorunlu kanal özellikleri (Trendyol):** her pazaryeri kategorisinin zorunlu özellikleri vardır (ör. Renk, Beden, Cinsiyet). Gönderimde bunlar ürünün özel niteliklerinden **aynı adlı** nitelik değeriyle eşlenir; değer, pazaryerinin değer listesindeki adla (büyük/küçük harf duyarsız) aynı olmalıdır. Serbest değer kabul eden özelliklerde değer en çok 50 karakter gönderilir. Eşleşmeyen zorunlu özellik pazaryerinde ürünün reddine / revizyon istemesine yol açar. Ayrı bir özellik eşleme ekranı yoktur; değerler [attribute set](../attributes/) ve ürünün "Özel Nitelikler" sekmesinden gelir.
- Komisyon önceliği: **ürüne özel oran (Ü)** > **kategori oranı (K)** > **kanal varsayılanı (V)**. Ürüne özel oran [channel-products.md](channel-products.md) "Komisyon" sütunundan girilir.

## Yan etkiler
- Komisyon değişikliği Ürünler sekmesindeki "Komisyon", "Net Gelir" ve gönderim sihirbazındaki marj hesaplarını hemen değiştirir.

## Tuzaklar
- Amazon'da sütun "Tahmini Referral Fee %"dır; Seller Central'daki yayımlanmış oranı kullanıcıdan iste.
- Diyalogdaki sol buton "Seçimi Temizle" yazsa da yalnız diyaloğu kapatır.
- Yüzdelik değeri ondalık kesir olarak girme (`0.18` değil `18`).

## Doğrulama
1. Toast metni (kategori adıyla).
2. Sayfayı yenile → komisyon hücresinde yeni değer, "(varsayılan)" ibaresi kalkmış.
3. Ürünler sekmesinde o kategorideki bir ürünün komisyon rozeti "K" (Kategori) ve yeni oran.
