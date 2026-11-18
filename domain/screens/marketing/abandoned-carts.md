# Terk Edilen Sepetler (sepetler + ödeme adayları, birleşik liste)
- URL: {ADMIN_URL}/marketing/abandoned-carts (tek sayfa; sepet detayı sağdan açılan çekmecedir, ayrı URL yok)
- Menü yolu: Sol menü "Pazarlama / Marketing" → "Terk edilen sepetler / Abandoned carts" (hub sayfasında kartı yok).
- Sayfa başlığı: "Terk edilen sepetler" + toplam sayı rozeti; açıklama "Sepetinde ürün bırakan veya ödeme adımında vazgeçen alışverişçileri, onlara nasıl ulaşacağınızı ve hangi hatırlatmaların gittiğini görün."
- Amaç: Vitrinde sepetine ürün koyup siparişi tamamlamayan alışverişçileri tek listede görmek. Liste **sepet başına bir satırdır** ve iki kaynağı birleştirir: (1) canlı sepetler (üye ve misafir) ve (2) ödeme sayfasında iletişim bilgisini (e-posta ya da telefon) girmiş "ödeme adayları". Aday olan satırda alışverişçiye **nasıl ulaşılacağı** ve **ödemede hangi adıma kadar geldiği** de görünür; hangi hatırlatma e-postalarının gittiği her satırda izlenir; mağaza kendi aramalarını "Ulaşıldı" olarak işaretleyip not bırakabilir.
- Entity: yok. İlgili: otomatik hatırlatma e-postaları [workflows.md](workflows.md) ("Sepet hatırlatma" şablonu) ve bildirim ayarları ([../settings/notifications.md](../settings/notifications.md)); sipariş olunca satır "Sipariş verildi" olur ([../orders/order-detail.md](../orders/order-detail.md)).
- Yetki: sayfa ve çekmece `marketing:view`; "Ulaşıldı" işaretleme / not `marketing:update` (yoksa panel yalnız durumu gösterir). Müşteri bilgilerini görme yetkisi (`customers:read`) yoksa iletişim bilgileri ve not **kısmen gizli** gelir.

Panelde **olmayanlar**: sepete e-posta/hatırlatma gönderme butonu, kupon gönderme, sepeti silme, sipariş oluşturma, toplu işlem, dışa aktarma, metin arama.

## Ön koşullar ve bağımlılıklar
- Satırlar vitrindeki gerçek alışverişten oluşur; admin'den oluşturulmaz. Hatırlatma e-postaları ayrı bir akıştır (otomasyon / bildirim tarafı); bu ekran yalnız **gittiklerini gösterir**.
- **Ödeme adayı** ancak alışverişçi ödeme formunda geçerli bir e-posta ya da telefon yazarsa oluşur; alışverişçi form doldurdukça adım ilerler (İletişim bilgileri → Adres → Kargo → Ödeme; geri gitmez). Ödeme formunun iletişim adımında gizlilik bildirimi gösterilir; mağaza bu metni kendi içerik sayfasıyla değiştirebilir (ayrıntı doğrulanmadı).
- **Durum kuralları:**
  - *Alışveriş sürüyor:* sepet güncel, hareketsizlik süresi henüz eşiği geçmedi.
  - *Terk edilen:* sepet **1 saat** işlem görmeden kaldı (ödeme adayı için de aynı süre); ödeme reddedilince (kart kabul edilmedi) sepet **hemen** terk edilen sayılır ve alışverişçi ödeme formuna dönünce form doldurulmuş hâlde geri gelir.
  - *Sipariş verildi:* alışverişçi siparişi tamamladı (ödeme alındı ya da çevrimdışı ödeme seçildi); aday kaydı otomatik buna döner.
- **Saklama süresi:** Ödeme adaylarının kişisel verisi (ad, e-posta, telefon, adres, not) **90 gün** sonra silinir; satır "Kişisel veriler silindi" / alışverişçi "Bilinmiyor (kişisel veriler silindi)" olur ve artık değiştirilemez.

## Yerleşim
1. Başlık + açıklama + toplam sayı rozeti (kaynaklardan biri kısmi dönerse rozet gizlenir).
2. Filtre çubuğu (altı Select, aria-label'larıyla):
   | Select (aria-label) | Seçenekler |
   |---|---|
   | "Duruma göre filtrele" | **Terk edilen (varsayılan)**, Alışveriş sürüyor, Sipariş verildi, Tüm sepetler |
   | "Ulaştığı ödeme adımına göre filtrele" | Herhangi bir adım, İletişim bilgileri, Adres, Kargo, Ödeme |
   | "Ulaşılma durumuna göre filtrele" | Ulaşılmış veya ulaşılmamış, Ulaşıldı, Ulaşılacaklar |
   | "Son hareketten bu yana geçen süreye göre filtrele" | Herhangi bir süre, 1 saat, 1 gün, 3 gün, 7 gün "veya daha uzun süredir hareketsiz" |
   | "Alışverişçi türüne göre filtrele" | Üyeler ve misafirler, Yalnızca üyeler, Yalnızca misafirler |
   | "Sepetleri sırala" | Önce en yeni hareket (varsayılan), Önce en eski hareket |
   Varsayılandan farklı seçimler rozet olur (× ile kaldırılır) + "Filtreleri temizle". Filtre değişince 1. sayfaya dönülür; filtreler URL'ye yazılmaz.
3. Mağazada aynı anda taranabilenden fazla sepet varsa **"Kısmi sonuçlar"** uyarısı çıkar: "Bu liste yalnızca bir kısmını gösterir; filtreler ve sıralama da yalnızca bu kısmı kapsar." Bu durumda toplam sayı ve sayfa sayısı gösterilmez → sonuç eksik olabilir, kullanıcıya söyle.
4. Tablo (`data-testid="abandoned-cart-row"`, `data-cart-id`; satıra ya da "{alışverişçi} sepetini aç" butonuna tıklamak çekmeceyi açar): "Alışverişçi" (Üye / Misafir / Bilinmiyor), "Durum" rozeti (Terk edildi / Alışveriş sürüyor / Sipariş verildi), "Ulaştığı adım" (adayı olmayan satırda "—"), "İletişim" (E-posta / Ara / WhatsApp bağlantıları; adayı yoksa "—", silinmişse "Kişisel veriler silindi", okunamıyorsa "Mevcut değil"), "Ürün" (adet), "Toplam", "Son hareket" (göreli), "Ulaşıldı mı" (Ulaşıldı rozeti / "Henüz ulaşılmadı" / "—"), "Hatırlatmalar" (rozetler). Sayfa başına 20 satır.
5. Hatırlatma rozeti: "{1. | 2. | 3.} hatırlatma: {durum}"; durum Sırada, Gönderildi, Ulaştı, Başarısız, Reddedildi, Geri döndü, Spam olarak işaretlendi, Atlandı. Hiç gitmediyse "Gönderilmedi"; geçmiş okunamadıysa "Bilinmiyor" (bu "gitmedi" demek değildir).
6. Boş durum: "Burada sepet yok — Alışverişçiler sepetinde ürün bıraktığında burada görünür." Filtre sonucu boşsa "Bu filtrelere uyan sepet yok".
7. Hata: "Sepetler yüklenemedi. Biraz sonra tekrar deneyin." + "Tekrar dene"; sık istekte "Çok fazla istek gönderildi. Bir dakika bekleyip tekrar deneyin."

### Sepet çekmecesi (`data-testid="abandoned-cart-drawer"`, başlık "Sepet ayrıntıları")
- Özet: Alışverişçi, Durum, Toplam, Son hareket.
- **"Ödeme ilerlemesi"** (yalnız aday varsa; `abandoned-cart-stepper`): dört adım, ulaşılan en ileri adıma kadar işaretli; adım başına tarih tutulmaz. Altında tarihler: Oluşturuldu, Son hareket, Ulaşıldı, Sipariş verildi (olanlar).
- **"İletişim"** (yalnız aday varsa): ad · e-posta · telefon ve adres (yetki varsa tam adres; yoksa yalnız şehir, ülke) + iletişim bağlantıları.
- **"Takip"** (`abandoned-cart-contacted`): "Henüz ulaşılmadı" ya da "{tarih} tarihinde ulaşıldı"; "Görüşme notu" alanı (`#abandoned-cart-note`, en çok 1000 karakter); butonlar "Ulaşıldı olarak işaretle" / "Notu kaydet" / "Ulaşılmadı olarak işaretle". Not boş bırakılırsa kayıtlı not korunur; notu silmek için "Ulaşılmadı olarak işaretle". Yetkisizse not salt okunur, maskeliyse "Kayıtlı bir not var. Okumak için müşteri bilgilerini görme yetkisi gerekir." Kişisel verileri silinmiş adayda değişiklik yapılamaz.
- **"Ürünler"**: Ürün (ad + SKU), Birim fiyat, Adet. Sepet artık yoksa (sipariş verildi / süresi doldu) "Sepet artık mevcut değil; bunlar alışverişçinin son adımda sepetinde olan ürünlerdir." notu çıkar ve değerler alışverişçinin son görüntüsüdür.
- **"Hatırlatmalar"**: gönderilen her hatırlatma için adım, durum, gönderim zamanı; "Bu sepet için henüz hatırlatma gönderilmedi." / "Hatırlatma geçmişi yüklenemedi…".

## Alanlar
Form yok. Tek yazılabilir alan: çekmecedeki "Görüşme notu" (`#abandoned-cart-note`, ≤1000 karakter).

## Aksiyonlar
| Buton | Ne olur | Toast / sonuç |
|---|---|---|
| Satır / "sepetini aç" | Çekmece açılır | Bulunamazsa "Bu sepet artık mevcut değil. Alışverişçi siparişi tamamlamış veya sepetin süresi dolmuş olabilir." |
| E-posta / Ara / WhatsApp | Dış uygulama bağlantısı açılır (`mailto:` / `tel:` / `wa.me`; WhatsApp yalnız `+` ile başlayan numarada); panel hiçbir şey göndermez | — |
| **Ulaşıldı olarak işaretle** (+ isteğe bağlı not) | **Diyalogsuz, anında** kayıt "Ulaşıldı" olur, tarih ve yazan kullanıcı kaydedilir | "Ulaşıldı olarak işaretlendi." |
| **Notu kaydet** (zaten ulaşıldıysa, not değişince) | **Anında** not güncellenir | "Ulaşıldı olarak işaretlendi." |
| **Ulaşılmadı olarak işaretle** | **Anında** işaret ve kayıtlı not kalkar | "Ulaşılmadı olarak işaretlendi." |
| Hata | — | "Kaydedilemedi. Biraz sonra tekrar deneyin."; bilgiler silinmişse "Bu alışverişçinin bilgileri silindi, bu yüzden artık değiştirilemez." |

## Onay zamanlaması (kural 2/5/6)
- Liste, filtre, çekmece ve iletişim bağlantıları salt okunur → onay gerekmez.
- **"Ulaşıldı olarak işaretle", "Notu kaydet", "Ulaşılmadı olarak işaretle" diyalogsuz kaydeder** → tıklamadan önce onay al. Özette alışverişçi (adı/sepet), işaret yönü ve not metni yer alır. Not alışverişçiye gitmez; yalnız panelde ekibe görünür. Bu işlem müşteriye e-posta göndermez, hatırlatma tetiklemez.
- Notta kişisel veri kayıt altına alındığı için (KVKK) yalnız kullanıcının verdiği metni yaz; uydurma not girme.

## Yan etkiler
- Satır durumu, sepet hareketsiz kaldıkça / sipariş verildikçe kendiliğinden güncellenir; işaretleme durumu değiştirmez.
- Hatırlatma e-postaları bu ekrandan gönderilmez/durdurulmaz; yönetmek için [workflows.md](workflows.md) ve [../settings/notifications.md](../settings/notifications.md).
- Müşteri bilgisi yetkisi olmayan kullanıcı iletişim bilgisini ve notu göremez; Claude de bu değerleri özetlere taşımaz.

## Tuzaklar
- Varsayılan filtre yalnız **"Terk edilen"** gösterir; devam eden sepetler ve siparişe dönenler için durum filtresini değiştir ("Tüm sepetler").
- Adayı olmayan (yalnız sepeti olan) satırda iletişim, adım ve "Ulaşıldı" işareti yoktur; sepet sahibine buradan ulaşılamaz. Üye ise müşteri kaydından bakılabilir ([../customers/customer-detail.md](../customers/customer-detail.md)).
- "Hatırlatmalar: Bilinmiyor" ≠ "Gönderilmedi". Geçmiş okunamadığında kullanıcıya "kontrol edilemedi" de.
- "Kısmi sonuçlar" uyarısında listeyi eksiksiz sanma; filtreyi daralt (ör. daha uzun hareketsizlik, yalnız üyeler/misafirler).
- 90 günden eski adaylarda ad/iletişim yoktur; bu beklenen davranıştır.
- Ödeme reddedilen alışverişçi hemen "Terk edilen" görünür; sipariş sonradan tamamlanırsa "Sipariş verildi" olur.

## Doğrulama
1. Sayfa başlığı "Terk edilen sepetler"; varsayılan durum filtresi "Terk edilen"; satırlar en yeni hareket önce.
2. Satırı aç: durum, toplam, ürünler, (aday varsa) ilerleme çubuğu ve iletişim; hatırlatma bölümü doluysa rozetlerle tutarlı.
3. İşaretleme sonrası toast, çekmecede "{tarih} tarihinde ulaşıldı" ve tabloda "Ulaşıldı" rozeti; "Ulaşıldı" filtresinde görünür.
