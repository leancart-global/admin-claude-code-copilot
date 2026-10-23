# Pazar Yeri — Genel Bakış (Marketplace Overview)
- URL: {ADMIN_URL}/marketplace
- Menü yolu: Sol menü "Pazar Yeri / Marketplace" → "Genel Bakış / Overview". Aynı grupta kanal kısayolları: Trendyol, Amazon, N11, Hepsiburada ([../../project/navigation.md](../../project/navigation.md)).
- Sayfa başlığı: "Pazar Yeri / Marketplace"; açıklama "Tüm pazaryeri entegrasyonlarınızı tek yerden yönetin. / Manage all your marketplace integrations in one place."
- Amaç: Hangi pazaryerlerinin bağlı olduğunu görmek, kanal panolarına geçmek, bağlantı yoksa ayarlara yönlenmek. **Salt okunur** ekran; hiçbir alan ya da buton kayıt yapmaz.
- Entity: [../../entities/marketplace-channel.md](../../entities/marketplace-channel.md).
- Yetki: ekran menüde izin şartsız listelenir; veriler `marketplace:read` / `settings:read` ile okunur (doğrulanmadı).

## Ön koşullar ve bağımlılıklar
- Kanalın "bağlı" görünmesi için önce [../settings/marketplace.md](../settings/marketplace.md) ekranında o pazaryeri için bağlantı kaydı (kimlik bilgileri kullanıcı tarafından girilir) olmalı.
- Bu ekran başka hiçbir kaydın ön koşulu değildir.

## Yerleşim
1. Başlık + sağda **"Ayarlar / Settings"** butonu → `/settings/marketplace`.
2. Özet kartları (4): "Bugünkü Siparişler / Orders Today" (altında kanal bazında "{kanal}: {n}"), "Bugünkü Gelir / Revenue Today" (₺), "Listelenen Ürünler / Listed Products", "Sync Hataları / Sync Errors" (0'dan büyükse kırmızı).
3. **"Kanal Sağlığı / Channel Health"** kartı — "Bağlı pazaryerlerinin durumu ve son senkronizasyon bilgisi."
   - Her bağlı kanal için tıklanabilir satır → `/marketplace/<kanal>`: kanal rozeti, ad, "Son sync: {zaman}" ya da "Henüz senkronize edilmedi / Not synced yet", "Ürün: / Products:" n, "Sipariş: / Orders:" n, rozet "Sağlıklı / Healthy" ya da "{n} hata / {n} errors", sağ ok.
   - Hiç bağlı kanal yoksa boş durum: "Bağlı Pazaryeri Yok / No Marketplace Connected" — "Ürün senkronizasyonu ve sipariş almaya başlamak için bir pazaryeri bağlayın." + buton **"Pazaryeri Bağla / Connect Marketplace"** → `/settings/marketplace`.
4. **"Son Siparişler / Recent Orders"** (yalnız en az bir kanal bağlıysa): "Tüm kanallardan gelen son siparişler." + "Tümünü Gör / View All" → `/orders`. Boşken "Henüz pazaryeri siparişi yok." / "Siparişler … otomatik alınacak." (yeni pazaryeri siparişleri otomatik gelir)
5. **"Diğer Pazaryerleri / Other Marketplaces"** (en az bir bağlı ve en az bir bağlanmamış kanal varken): bağlanmamış kanallar soluk kartlarda, rozet "Bağlı değil / Not connected".

Listelenen kanallar: Trendyol, Amazon, Hepsiburada, N11, Çiçeksepeti ("Ciceksepeti"). Çiçeksepeti menüde yoktur; kanal sayfası "Henüz Kullanılamıyor" durumundadır ([channel.md](channel.md)).

## Alanlar
Form alanı yok.

## Aksiyonlar
| Buton / bağlantı | Ne olur | Toast |
|---|---|---|
| Ayarlar / Pazaryeri Bağla | `/settings/marketplace` açılır | — |
| Kanal Sağlığı satırı | `/marketplace/<kanal>` kanal panosu | — |
| Tümünü Gör (Son Siparişler) | `/orders` sipariş listesi; pazaryeri siparişleri "Kaynak / Source" filtresiyle ayrılır ([../orders/orders-list.md](../orders/orders-list.md)) | — |
| Yükleme hatası | — | "Pazaryeri verileri yüklenemedi. / Failed to load marketplace data." |

## Onay zamanlaması
- Ekranda kalıcı değişiklik yapan, anında kaydeden ya da dış sisteme yazan aksiyon **yok**. Onay gerekmez.

## Yan etkiler
- Yok.

## Tuzaklar
- Bir kanalın "bağlı" görünmesi yalnız bağlantı kaydının varlığını gösterir; kimlik bilgilerinin gerçekten çalıştığını göstermez. Gerçek bağlantı durumu (Bağlı / Bağlantı Hatası / Pasif) kanal panosunun başlık rozetinde ve durum kartında okunur ([channel.md](channel.md)).
- Ürün/sipariş/hata sayaçları için kanal panosundaki kartları esas al; raporda kanal panosundaki değeri yaz.
- "Son sync" zamanı bağlantı kaydının son güncellenme zamanını gösterebilir (doğrulanmadı).

## Doğrulama
- Salt okunur; başka bir ekranda yapılan bağlantı işleminden sonra bu sayfayı yenileyip kanalın "Kanal Sağlığı" listesine geçtiğini kontrol et.
