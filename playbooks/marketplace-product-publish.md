# Playbook: Ürünleri pazaryerine gönder / kategori eşlemesi ("bu ürünleri Trendyol'a gönder")

Tetikleyiciler: "bu ürünleri Trendyol'a / Amazon'a / Hepsiburada'ya / N11'e gönder", "şu ürünü pazaryerinde listele",
"Trendyol kategori eşlemesini yap", "Trendyol komisyonlarını gir", "pazaryerindeki fiyatı güncelle".
Harita: ../domain/screens/marketplace/channel-products.md (gönderim, hazırlık, komisyon),
../domain/screens/marketplace/channel-categories.md (eşleme, komisyon), ../domain/screens/marketplace/channel.md (durum),
../domain/screens/settings/marketplace.md (bağlantı — Claude gizli alanlara dokunmaz),
../domain/entities/marketplace-channel.md (kurallar, kanal farkları).

---

## 0. Kural hatırlatması
- Kanala gönderim **dış sisteme yazar** (pazaryeri). Yeni ilan pazaryerinde oluşur ve buradan geri alınamaz; güncelleme
  mevcut ilanın üzerine yazar. → **Kural 5: ayrı onay, etkilenen ürün sayısıyla.** Onay yalnız o özet için geçerlidir.
- Kategori komisyon hücresi **alandan çıkınca anında kaydeder** → değeri yazmadan önce onay.
- Ortam (Canlı/Test) her özetin başında. Canlı ortamda test ürünü gönderme.
- Kimlik bilgisi (API Key/Secret, Client Secret, Refresh Token) alanlarına dokunma; bağlantı sorunu varsa kullanıcı kendisi düzeltir.

## 1. İsteği çözümle
| Bilgi | Kaynak | Yoksa |
|---|---|---|
| Kanal | cümle ("Trendyol") | sor |
| Ürünler | ad / SKU / barkod / "şu kategorideki tüm ürünler" | sor; liste belirsizse ürün listesinde ara ve aday listeyi onaylat |
| İşlem | yeni listeleme mi, güncelleme mi | "{kanal} Durumu" sütunundan çıkar (Gönderilmedi = yeni) |
| Fiyat değişikliği | "fiyatı X yap" | Önce LeanCart ürün fiyatı değişir (../domain/screens/products/product-edit.md, ayrı onay), sonra yeniden gönderim |
| Komisyon | kullanıcı / satıcı paneli | Varsayılan rozetteki oran; özette "varsayılan" |

## 2. Ön koşulları kontrol et (salt okuma)
1. `/settings/marketplace` → kanal satırı: Durum **Aktif**, **Mod** (Canlı/Test) — özete yaz.
2. `/marketplace/<kanal>` → başlık rozeti **Bağlı** mı? "Bağlantı Hatası / Bağlı Değil / Pasif" ise dur; kullanıcıdan
   ayarları kendisinin düzeltmesini iste (../domain/screens/settings/marketplace.md).
3. `/marketplace/<kanal>/products` → aramayla her ürünü bul (isim/SKU/barkod) ve şunları oku:
   - Durum (Yayında/Taslak/Arşiv) — kullanıcı açıkça istemedikçe yalnız Yayında ürünler.
   - **Hazırlık** rozeti ipucu (Trendyol'da kanal kuralları; diğer kanallarda yalnız barkod).
   - Komisyon + kaynak harfi, Net Gelir rengi (kırmızı = zarar, sarı = düşük marj).
   - "{kanal} Durumu".
4. Hazırlık hatalarını sınıflandır ve çöz (her düzeltme ayrı iş ve ayrı onay):
   | Hata | Çözüm |
   |---|---|
   | Barkod yok / çok uzun | Ürün düzenle → Kimlik → Barkod (kullanıcıdan değer al; uydurma) |
   | Kategori yok | Ürün düzenle → Kategoriler |
   | Kategori eşleşmemiş | Kategori eşleme (§4) |
   | Marka yok / eşleşmemiş | Ürün formunda marka alanı henüz yok → kullanıcıya bildir; bu ürünleri göndermeden önce kullanıcıya sor |
   | Fiyat hatalı / liste fiyatı düşük | Ürün düzenle → Fiyatlandırma |
   | Resim yok, başlık uzun (uyarı) | Kullanıcıya bildir; gönderim engellenmez ama kanal reddedebilir |
5. Zorunlu kanal özellikleri: ürünün attribute set'inde, kanalın istediği özellik adlarıyla (Renk, Beden…) değer var mı?
   Yoksa kullanıcıya sor (../domain/screens/marketplace/channel-categories.md §Kurallar).

## 3. Plan + eksik bilgi (tek mesaj)
Örnek:
> Ortam: **prod**, Trendyol modu **Canlı**. Plan: (1) 2 ürüne barkod eklenecek [ayrı onay]. (2) 5 ürün Trendyol'a
> gönderilecek: 3 yeni ilan, 2 güncelleme. Eksik: "Kupa 300ml" barkodu? 1 üründe marka eksik (alan geliştiriliyor) —
> bu ürünü gönderelim mi?

## 4. Kategori eşlemesi ("Trendyol kategori eşlemesini yap")
1. `/marketplace/<kanal>/categories` aç, snapshot al.
2. Ekran geliştirme aşamasındaysa (örnek satırlar "Women > Clothing", "Category A"… ve "Eşleştirme Ekle" işlem yapmıyor):
   **kayıt yapma**, kullanıcıya "kategori eşleme ekranı henüz kullanıma açık değil" de.
3. Ekran gerçek kategorileri gösteriyorsa: her LeanCart kategorisi için kullanıcıyla pazaryeri kategorisini (yaprak)
   netleştir → özet tablosu (LeanCart kategori yolu → pazaryeri kategori yolu, etkilenen ürün sayısı) → onay → sol satıra
   tıkla → sağda ara → hedef satıra tıkla → ilerleme sayacını doğrula.
4. Kategori komisyonu: özet (kategori, eski → yeni %) + onay → hücreye yaz → Tab ile çık → toast "{kategori} için
   komisyon kaydedildi". Toplu: satırları seç → "Komisyon Belirle" → oran → **"Uygula"** (Enter değil); onay kural 5, kategori sayısıyla.

## 5. Gönder
1. Ürünler sekmesinde ürünleri seç (satır kutuları; aramayla tek tek bulup seçmek seçimi korur). Butondaki sayıyı
   (n) planla karşılaştır.
2. **Özet → ONAY BEKLE** (sihirbazı açmadan önce ya da son adımda butona basmadan önce):

   | Alan | Değer |
   |---|---|
   | Ortam / kanal modu | prod / Trendyol Canlı |
   | Kanal | Trendyol |
   | Etkilenen ürün sayısı | **5** (3 yeni ilan, 2 güncelleme) |
   | Ürünler | ad · SKU · fiyat · gönderilecek stok (stok − tampon) · komisyon % (kaynak) · net gelir · marj |
   | Riskli satırlar | zarar/düşük marj, hazırlık uyarısı olanlar |
   | Geri alınabilirlik | Yeni ilanlar pazaryerinde oluşur; kaldırma satıcı panelinden. Trendyol ilanları kanal onayına girer |
   | Yan etki | Bundan sonra stok değişiklikleri bu ilanlara otomatik gider |

3. Açık "evet" sonrası: "{kanal} Kanalına Gönder (n)" → sihirbaz adım 1'de tabloyu özetle karşılaştır → "İleri" →
   (Amazon'da ASIN adımı → "İleri") → hazırlık adımı → "İleri" → son adımda **"{kanal} Kanalına Gönder (n)"**.
4. Özet ile sihirbaz farklıysa (sayı, fiyat, komisyon) dur, yeni özetle **yeniden onay**.
5. Kanalın tek seferde sınırı aşılıyorsa (Amazon 10, N11 500, Trendyol/Hepsiburada 1000) parçalara böl; her parça ayrı onay.

## 6. Doğrula
1. Toast "{n} ürün {kanal} kanalına başarıyla gönderildi" (= iş kabul edildi). Hata toast'ında dur, mesajı kullanıcıya ilet.
2. Sayfayı yenile → "{kanal} Durumu" Gönderiliyor → birkaç dakika sonra Listelendi / Hata; Hata rozetinin ipucunu oku.
3. Kanal panosunda "Listelenen Ürünler".
4. Rapor: gönderilen ürünler (yeni/güncelleme), hata alanlar ve nedenleri, kullanıcının satıcı panelinde izlemesi
   gerekenler (Trendyol onayı, reddedilen ilanlar), yapılamayanlar (marka, kaldırma).

## 7. Desteklenmeyen istekler
- "Ürünü Trendyol'dan kaldır / ilanı kapat": admin'de aksiyon yok → kullanıcı satıcı panelinden yapar. LeanCart'ta
  arşivlemenin ilanı kapatmadığını varsay (doğrulanmadı) ve söyle.
- "Tüm stok ve fiyatları senkronize et": buton geliştiriliyor; stok zaten otomatik gider. Fiyat için ürünleri yeniden gönder (§5).
- "Trendyol'daki ürünleri içeri al": içe aktarma geliştiriliyor (../domain/screens/marketplace/channel-pending.md).
- Bağlantı kurma / kimlik bilgisi: ../domain/screens/settings/marketplace.md — gizli alanları kullanıcı girer.
