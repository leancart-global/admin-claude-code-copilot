# Pazaryeri Kanal Panosu (Channel Hub)
- URL: {ADMIN_URL}/marketplace/<kanal> — `<kanal>` ∈ `trendyol` | `amazon` | `n11` | `hepsiburada` (ayrıca `ciceksepeti` açılır, menüde yok). Geçersiz kanal adı `/marketplace`'e yönlendirir.
- Menü yolu: "Pazar Yeri / Marketplace" → "Trendyol" / "Amazon" / "N11" / "Hepsiburada"; ya da Genel Bakış'taki "Kanal Sağlığı" satırı.
- Sayfa başlığı: kanal adı (`h1`, ör. "Trendyol") + bağlantı durum rozeti.
- Amaç: Bir kanalın gerçek bağlantı durumunu, listelenen ürün / senkronize sipariş / hata sayılarını görmek ve kanalın alt ekranlarına geçmek. Pano **salt okunurdur**.
- Entity: [../../entities/marketplace-channel.md](../../entities/marketplace-channel.md).
- Yetki: `marketplace:read` (durum ve sayaçlar).

## Ön koşullar ve bağımlılıklar
- Bağlantı kaydı: [../settings/marketplace.md](../settings/marketplace.md) (kimlik bilgileri, ortam, otomatik onay, senkron modu, stok tamponu, fiyat parametreleri orada).
- Alt ekranların sırası: bağlantı → [channel-categories.md](channel-categories.md) (kategori/komisyon) → [channel-products.md](channel-products.md) (gönderim) → [channel-pending.md](channel-pending.md) (kanaldan içe aktarılanlar).

## Yerleşim (tüm `/marketplace/<kanal>/*` sayfalarında ortak çerçeve)
1. Başlık: geri ok (→ `/marketplace`), mağaza ikonu, kanal adı, durum rozeti; sağda **"Ayarlar / Settings"** → `/settings/marketplace`.
2. Sekme çubuğu (bağlantı düğmeleri; rol `link` + buton): **"Merkez / Hub"** (`/marketplace/<kanal>`), **"Ürünler / Products"** (`/products`), **"Kategoriler / Categories"** (`/categories`), **"Bekleyenler / Pending"** (`/pending`). Aktif sekmenin alt çizgisi renklidir.
3. Merkez (bu ekran) içeriği:
   - Kart sırası (4): **Durum kartı** (ikon + durum adı + açıklama; gerekiyorsa "Ayarlara Git / Go to Settings" linki), "Listelenen Ürünler / Products Listed", "Senkronize Edilen Siparişler / Orders Synced", "Senk. Hataları / Sync Errors".
   - Kanala özel kartlar (aşağıdaki tablo).
   - **"Hızlı İşlemler / Quick Actions"**: "Ürünleri {kanal} Kanalına Gönder / Push Products to {kanal}" (→ Ürünler sekmesi), "{kanal} Kanalından İçe Aktar / Import from {kanal}" (→ Bekleyenler sekmesi), "Stok ve Fiyat Senkronize Et / Sync Stock & Prices".
   - **"Hata Günlüğü / Error Log"** — "Son senkronizasyon hataları ve çözüm durumları." Sütunlar: Zaman / Time, Ürün / Product, Hata / Error, İşlem / Action. Boşken "Hata yok. Her şey sorunsuz çalışıyor."

### Bağlantı durumları (başlık rozeti = durum kartı)
| Durum (tr / en) | Ne demek | Açıklama metni | Ayarlara Git linki |
|---|---|---|---|
| Bağlı / Connected (yeşil) | Kayıt aktif ve kayıtlı kimlik bilgileriyle pazaryerine erişiliyor | "Her şey normal şekilde senkronize ediliyor." | yok |
| Bağlı Değil / Not Connected | Bağlantı kaydı yok | "Senkronizasyona başlamak için bu pazaryerini bağlayın." | var |
| Pasif / Inactive | Kayıt var ama kapalı | "Bu pazaryeri şu anda kapalı." | var |
| Bağlantı Hatası / Connection Error (kırmızı) | Kayıt aktif ama pazaryerine erişilemedi (kimlik bilgisi / ortam / pazaryeri tarafı) | "Bağlantı başarısız oldu. Ayarlar bölümünden kimlik bilgilerinizi kontrol edin." | var |
| Henüz Kullanılamıyor / Not Available Yet | Entegrasyon bu kanal için açık değil (Çiçeksepeti) | "Bu entegrasyon henüz kullanıma açık değil." | yok |

- Durum, sayfa açılırken bir kez okunur (pazaryerine gerçek bir bağlantı denemesi içerebilir; kimlik bilgisi düzeltildikten sonra durum birkaç dakika gecikmeli güncellenebilir — doğrulanmadı). Yeniden okumak için sayfayı yenile.
- "Senk. Hataları" son senkronizasyonda hata varsa 1, yoksa 0 gösterir.

### Kanallar arası farklar (ekranda görünen)
| Kanal | Panoda ek kart | Ürün gönderim sihirbazı | Kategori ekranı | Komisyon sütunu | Tek seferde gönderilebilecek ürün (kanal kuralı) | Diğer |
|---|---|---|---|---|---|---|
| Trendyol | "Komisyon Özeti / Commission Overview" (Ortalama Komisyon, Bu Ayki Gelir, Komisyon Sonrası Net; "Komisyon oranları kategoriye göre değişir (%5-%25). Ayarlar > Pazaryeri bölümünden yapılandırın.") | 3 adım | düz arama | "Komisyon %" | 1000 | Hazırlık kontrolü kanal kurallarıyla yapılır (yalnız Trendyol); gönderilen ürün Trendyol onayından geçer; kargo firması gerekir |
| Amazon | "FBA Envanteri / FBA Inventory" (Karşılanabilir, Rezerve, Gelen, Karşılanamaz) + "Hesap Sağlığı / Account Health" (Sipariş Kusur Oranı, Geç Kargo Oranı, İptal Oranı, Geçerli Takip Oranı; her birinde "Hedef: < / > eşik") | 4 adım (ek "Amazon Kataloğu ile Eşleştiriliyor" — barkod/EAN ile ASIN eşleme) | göz atma ağacı ("Kategorileri bulmak için göz atma ağacını kullanın.") | "Tahmini Referral Fee %" + bilgi ipucu "Amazon referral fee'leri değişebilir. Seller Central'daki oranı girin." | 10 | Çoklu para birimi (USD/EUR/GBP/TRY) |
| Hepsiburada | — | 3 adım | hiyerarşik | "Komisyon %" | 1000 | Kargo firması gerekir |
| N11 | — | 3 adım | hiyerarşik | "Komisyon %" | 500 | Stok tamponu önerisi 2 |
| Çiçeksepeti | — | — | düz arama | "Komisyon %" | 500 | "Henüz Kullanılamıyor" |

- FBA, Hesap Sağlığı ve Komisyon Özeti kartları bilgi amaçlıdır; değerleri pazaryerinin kendi panelinden teyit et (doğrulanmadı).

## Alanlar
Form alanı yok.

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Sekmeler / geri ok / Ayarlar / Ayarlara Git | Gezinme | — |
| Ürünleri {kanal} Kanalına Gönder | Ürünler sekmesini açar (gönderim orada yapılır) | — |
| {kanal} Kanalından İçe Aktar | Bekleyenler sekmesini açar | — |
| Stok ve Fiyat Senkronize Et | Elle toplu stok/fiyat senkronu — **geliştiriliyor**; şu an tıklamak bir işlem başlatmaz, toast çıkmaz. Stok, değişiklik oldukça otomatik gönderilir ([../../entities/marketplace-channel.md](../../entities/marketplace-channel.md) §Stok) | — |

## Onay zamanlaması
- Panoda kalıcı değişiklik yapan aksiyon yok.
- **"Stok ve Fiyat Senkronize Et" tasarımı gereği tüm kanal ürünlerinin stok ve fiyatını pazaryerine yazar (dış sistem).** Etkin olduğu sürümde: tıklamadan önce özet (kanal, ortam Canlı/Test, etkilenen ürün sayısı = "Listelenen Ürünler") + açık onay. Şu an işlem yapmadığından tıklama; kullanıcı isterse "bu buton henüz etkin değil" de.

## Yan etkiler
- Sayfayı açmak bağlantı testine benzer bir okuma yapar; pazaryerinde kayıt değiştirmez.

## Tuzaklar
- Rozet "Bağlantı Hatası" ise gönderim yapma; kullanıcıdan [../settings/marketplace.md](../settings/marketplace.md) ekranında kimlik bilgilerini kendisinin kontrol etmesini iste (Claude gizli alanlara dokunmaz).
- Ortam (Canlı/Test) bu ekranda görünmez; dış sisteme yazan her işlemden önce `/settings/marketplace` listesindeki **Mod** sütununu oku ve özete yaz.
- Hata Günlüğü tablosu şu an satır göstermez (geliştiriliyor); ürün bazlı hatalar için [channel-products.md](channel-products.md) "{kanal} Durumu" sütunundaki "Hata" rozetinin ipucunu oku.

## Doğrulama
1. Başlık rozeti ve durum kartı aynı durumu gösterir.
2. Gönderimden sonra "Listelenen Ürünler" sayısının arttığını (birkaç dakika içinde, kanal onayına bağlı — doğrulanmadı) kontrol et.
