# Web Kancaları (Webhooks)

> **Operatör sınırı**
> - Claude web kancası adı, hedef web adresi, olay seçimi ve aktif/pasif durumunu kullanıcı onayıyla doldurabilir; gönderim geçmişini okuyabilir.
> - Claude **imzalama anahtarını görmez**: oluşturma ve "Anahtarı yenile" sonrası açılan dialogu okumaz, göster/kopyala butonlarına basmaz, dialog açıkken snapshot almaz; değeri kullanıcı kopyalar ve dialogu kendisi kapatır.
> - Kaydet (oluştur/güncelle), satırdaki Aktif switch'i (anında kaydeder), Anahtarı yenile ve Sil her biri ayrı onay ister; Sil geri alınamaz (kural 5).
> - Aktif bir web kancası, seçilen olaylar oluştuğunda mağaza verisini (sipariş, müşteri vb.) hedef adrese **gerçekten gönderir** — hedef adresi kullanıcıdan al, tahmin etme.
> - Ekranda "test gönderimi" butonu yoktur; Claude test için sahte sipariş/ürün oluşturmaz.

- URL: {ADMIN_URL}/settings/webhooks
- Menü yolu: "Ayarlar / Settings" → "Web Kancaları / Webhooks".
- Sayfa başlığı: "Web Kancaları / Webhooks"; açıklama "Mağazanızda bir şey olduğunda diğer sistemlerinize gerçek zamanlı güncellemeler gönderin / Send real-time updates to your other systems when things happen in your store".
- Amaç: Sipariş, ürün, envanter ve müşteri olaylarını dış bir sisteme (ERP, kargo, CRM…) anlık bildirmek için web kancası aboneliği tanımlamak. Her abonelik bir hedef web adresine, seçilen olaylar oluştuğunda imzalı istek gönderir; vitrin görünümünü etkilemez.
- Yetki: menü `settings:read`; listeleme ve gönderim geçmişi `webhook_subscriptions:read`; ekleme / düzenleme / aktif-pasif / anahtar yenileme `webhook_subscriptions:write`; silme `webhook_subscriptions:delete`. Yazma yetkisi yoksa "Web Kancası Ekle" butonu görünmez, switch ve menü öğeleri pasiftir.
- Hassas ekran: **evet**. Anında kaydeden kontrol: satırdaki "Aktif / Active" switch'i.

## Gizli alanlar — Claude dokunmaz
- **İmzalama anahtarı (signing key)** — alıcı sistemin isteklerin Lean Cart'tan geldiğini doğrulaması için. Yalnızca iki anda **bir kez** gösterilir: web kancası oluşturulunca ("Web kancası oluşturuldu / Webhook created" dialogu) ve "Anahtarı yenile" sonrası ("Anahtar yenilendi / Secret rotated" dialogu). Listede ve düzenleme panelinde hiç gösterilmez.
- Kural: Claude bu dialogları okumaz/özetlemez, değeri kopyalamaz, snapshot/screenshot çıktısını sohbete aktarmaz. Dialog açılınca kullanıcıya: **"İmzalama anahtarını şimdi kendin kopyala ve alıcı sisteme gir; ben görmeyeceğim. Bitince 'Tamam / Done' ile kapat ve haber ver."** Dialog kapanana kadar snapshot almaz.
- Gizli olmayan alanlar (ad, web adresi, olaylar, aktif) normal akışla, onayla doldurulur. Hedef web adresi gizli değildir ama kullanıcının vereceği bilgidir.

## Ön koşullar ve bağımlılıklar
- Bağımlılık yok. Hedef adres `https://` ile başlamalı ve alıcı sistem hazır olmalı (yoksa gönderimler başarısız olur, bkz. Duraklatıldı).
- Etkiler: dış sistem; olay kaynakları siparişler, ürünler, envanter, müşteriler.

## Yerleşim
- Kart başlığı: "Web Kancaları" + abonelik sayısı rozeti; sağda "Web Kancası Ekle / Add Webhook" (`data-testid="webhook-header-add-button"`).
- Liste satırı (`data-testid="webhook-row-<id>"`): ad, durum rozeti ("Aktif / Active", "Pasif / Inactive", "Duraklatıldı / Paused"), "{n} olay / {n} events" rozeti, hedef adres; Duraklatıldı ise sarı açıklama "Bu web kancası, çok sayıda başarısız denemeden sonra gönderimi durdurdu. Aşağıdaki adresi düzeltin, ardından tekrar açın." Sağda Aktif switch'i (aria-label "Aktif / Active") ve "⋯" menüsü (aria-label "Web kancası işlemleri menüsü / Webhook actions menu"): "Düzenle / Edit", "Gönderimleri görüntüle / View deliveries", "Anahtarı yenile / Rotate secret", "Sil / Delete".
- Boş durum: "Henüz web kancası yok" + açıklama + ekle butonu.
- Sağdan açılan panel (Sheet): "Web Kancası Ekle / Add Webhook" veya "Web Kancasını Düzenle / Edit Webhook".

## Alanlar (ekle / düzenle paneli)
| Bölüm | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| — | Ad / Name | `label` | Input | evet | ≤100; placeholder "örn. ERP entegrasyonu"; boşsa "Lütfen bu web kancası için bir ad girin" | `#webhook-label` | |
| — | Web adresi / Web address | `targetUrl` | Input (url) | evet | `https://` ile başlamalı (ipucu "https:// ile başlamalıdır"); ≤2048; hatalar "Lütfen bir web adresi girin" / "Lütfen https:// ile başlayan bir web adresi girin" | `#webhook-target-url` | |
| — | Aktif / Active | `active` | Switch | — | yeni kayıtta açık | `#webhook-active` | Kapalı kaydedilirse olay gönderilmez |
| Gönderilecek olaylar / Events to send | Sipariş / Order: Sipariş oluşturuldu, Sipariş ödendi, Sipariş tamamlandı, Sipariş iptal edildi, Sipariş iade edildi, Sipariş güncellendi | `eventTypes` | Checkbox grubu | en az 1 ("Lütfen en az bir olay seçin") | boş | grup kutusu `data-testid="webhook-event-group-order"`; `getByRole('checkbox', { name })` | Grup başlığına tıklamak gruptaki tüm olayları seçer / hepsi seçiliyse kaldırır |
| Olaylar | Ürün / Product: Ürün oluşturuldu, Ürün güncellendi, Ürün silindi, Ürün durumu değişti | `eventTypes` | Checkbox | | | `webhook-event-group-product` | |
| Olaylar | Envanter / Inventory: Stok değişti, Stok azaldı, Stok tükendi, Stok yenilendi | `eventTypes` | Checkbox | | | `webhook-event-group-inventory` | |
| Olaylar | Müşteri / Customer: Müşteri oluşturuldu, Müşteri güncellendi, Müşteri silindi | `eventTypes` | Checkbox | | | `webhook-event-group-customer` | |

Doğrulama hatası panelin altında tek kırmızı mesaj olarak (`role="alert"`) görünür; ilk hatalı kural gösterilir.

## Aksiyonlar
| Aksiyon | Ne olur | Toast | Onay |
|---|---|---|---|
| Kaydet / Save (ekle) | Abonelik oluşur, listenin başına eklenir, panel kapanır, **imzalama anahtarı dialogu** açılır | "Web kancası oluşturuldu / Webhook created" | Özet + onay; sonra gizli dialog kuralı |
| Kaydet (düzenle) | Ad, adres, olaylar, aktif güncellenir; anahtar değişmez, dialog açılmaz | "Web kancası güncellendi / Webhook updated" | Özet + onay |
| İptal / Cancel | Paneli kaydetmeden kapatır | — | — |
| Aktif switch'i (satırda) | **Anında** aktif/pasif kaydeder | "Web kancası güncellendi" | Tıklamadan önce onay |
| Anahtarı yenile / Rotate secret | Onay dialogu "İmzalama anahtarını yenile": yeni anahtar üretilir; **eski anahtar bir süre daha geçerli kalır** (alıcı sistemi kesintisiz güncellemek için). Yeni değer bir kez gösterilir | "İmzalama anahtarı yenilendi / Signing secret rotated" | Onay; sonra gizli dialog kuralı. Kullanıcıya alıcı sistemi güncellemesini hatırlat |
| Sil / Delete | Onay dialogu "Web kancasını sil" ("…bu adrese olay gönderimini hemen durduracak. Bu işlem geri alınamaz.") | "Web kancası silindi / Webhook deleted" | Kural 5 — tek tek onay |
| Gönderimleri görüntüle | Sağ panelde "Gönderim geçmişi / Delivery history": Olay, Gönderim Kimliği, Zaman, Adres, Durum (Beklemede / Teslim edildi / Başarısız / Yeniden denemeyi durdurdu), Gecikme, Deneme; başarısız satırda "Hata ayrıntılarını görüntüle"; sayfalama | — | Salt okunur, onay gerekmez |

Hata toast'ları: "Web kancası oluşturulamadı…", "…güncellenemedi…", "…silinemedi…", "Anahtar yenilenemedi…", "Web kancalarınız yüklenemedi. Lütfen sayfayı yenileyin."

## Yan etkiler
- Aktif abonelik, seçilen olay oluştuğu anda hedef adrese istek gönderir; başarısız gönderimler yeniden denenir.
- Art arda 20 başarısız gönderimden sonra abonelik otomatik **Duraklatıldı** durumuna geçer ve gönderim durur.
- Silme veya pasife alma, o andan sonraki olayların gönderimini durdurur.

## Tuzaklar
- Yeni kayıtta Aktif varsayılan açık: kaydedildiği anda canlı gönderim başlar. Kullanıcı alıcı sistemi hazır değilse pasif kaydetmeyi öner.
- Anahtar dialogu kapatıldıktan sonra değer geri getirilemez; tek yol "Anahtarı yenile".
- Düzenleme sırasında olay listesini değiştirmek mevcut seçimi tamamen değiştirir; özet tablosunda önceki → yeni olay listesini yaz.
- Duraklatılmış aboneliği yeniden açmadan önce kullanıcıdan düzeltilmiş adresi ve alıcı sistemin hazır olduğunu teyit et.

## Doğrulama
1. Liste satırında ad, adres, "{n} olay" sayısı ve durum rozeti özetle aynı.
2. "Düzenle" ile paneli açıp seçili olay checkbox'larını kontrol et, sonra **İptal** ile kapat.
3. Aktif/pasif değişikliğinde rozet ve switch durumu.
4. Gönderim kontrolü istenirse "Gönderimleri görüntüle" ile son denemeleri oku (salt okunur).
