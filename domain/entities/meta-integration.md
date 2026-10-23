# Entity: Meta Entegrasyonu (bağlantı, pixel, kitle, huni, deney, uyarı)

Mağazanın kullanıcıya ait Meta (Facebook/Instagram) Business hesabıyla ilişkisi ve bu ilişki üzerinden yönetilen
kayıtlar. Lean Cart, bağlı reklam hesabında **kullanıcı adına** kitle oluşturur, kampanya açar/duraklatır ve vitrin
olaylarını Meta'ya iletir; bu yüzden buradaki birçok aksiyon dış sisteme yazar, bazıları **reklam harcaması** başlatır.

- Ekranlar: [genel bakış + optimizasyon](../screens/marketing/meta/meta-overview.md),
  [ayarlar + pixel](../screens/marketing/meta/meta-settings.md), [kitleler](../screens/marketing/meta/audiences.md),
  [huniler](../screens/marketing/meta/funnels.md), [deneyler](../screens/marketing/meta/experiments.md),
  [uyarılar](../screens/marketing/meta/alerts.md).
- Yetkiler: `marketing:view` / `:create` / `:update` / `:delete` ([../project/permissions.md](../project/permissions.md)).

## Bağlantı modu (her ekranın davranışını belirler)
| Mod | Nasıl oluşur | Ne çalışır | Ekranda |
|---|---|---|---|
| Bağlı değil | Hiç bağlantı yok ya da bağlantı kesilmiş, pixel yok | Hiçbir Meta özelliği | Kırmızı bant "Meta hesabı bağlı değil" + "Bağlan" |
| Manuel | Yalnız Pixel ID + elle girilmiş CAPI erişim anahtarı kayıtlı; ya da OAuth tamam ama reklam hesabı seçilmemiş | Vitrin pixel'i ve sunucu tarafı olaylar | Sarı bant "Manuel mod aktif"; kitle/huni/deney/uyarı aksiyonları "Kilitli" |
| Bağlı | OAuth tamam **ve** reklam hesabı seçili | Hepsi | Yeşil bant "Bağlı: {reklam hesabı}" |

## Kayıtlar
### Meta bağlantısı (mağaza başına bir tane)
| Alan | Not |
|---|---|
| Meta uygulama kimlik bilgileri (App ID, App Secret) | **Gizli**; kullanıcı girer, geri gösterilmez |
| Erişim izni (OAuth) | Kullanıcının Meta'da verdiği izinler (reklam yönetimi/okuma, sayfa, katalog…); "Token Süresi" ve "İzinler" olarak görünür. Süre dolarsa yeniden bağlanmak gerekir |
| Reklam hesabı | Ad, ID, **para birimi** (huni bütçeleri bu birimde). Ayarlar ekranında bir kez seçilir; değiştirmek için bağlantıyı kesip yeniden bağlan |
| Durum | Bağlı / Bağlı değil (+ süresi dolmuş) |

### Meta Pixel ayarı (mağaza başına bir tane)
| Alan | Kural |
|---|---|
| Pixel ID | 15–17 rakam, zorunlu |
| CAPI erişim anahtarı | **Gizli**, yalnız yazılır; tam bağlantıda OAuth anahtarı kullanılır, aksi halde zorunlu. Boş bırakmak kayıtlıyı korur |
| Olaylar | Standart olaylar (PageView, ViewContent, Search, AddToCart, AddToWishlist, InitiateCheckout, AddPaymentInfo, Purchase, Lead, CompleteRegistration …) için aç/kapa; her olayın kanalı tarayıcı / sunucu / ikisi |
| Test olay kodu | Harf+rakam ≤64. Kayıtlıyken **tüm sunucu olayları yalnız Meta Test Events'e** gider |
| Durum | Yapılandırılmamış / Yapılandırıldı / Aktif / Hata; eşleşme kalitesi 0–10 |
- Vitrinde pixel ve sunucu olayları yalnız ziyaretçinin pazarlama çerezi izni varsa çalışır.

### Hedef kitle (Meta custom/lookalike audience)
| Alan | Kural |
|---|---|
| Ad (2–80, mağazada benzersiz), açıklama (≤280) | Sonradan düzenlenebilen tek alanlar |
| Tür | Özel / Benzer / (Kaydedilmiş, Özel reklam — yalnız listede); formda ayrıca "Değer tabanlı benzer". **Değişmez** |
| Kaynak | Özel: müşteri segmenti; Benzer: bir özel kitle + tek ülke + %1–10; Değer tabanlı: yüksek değerli müşteriler + ülke + % |
| Meta kitle ID, boyut, son senkron, durum | Bekliyor → İşleniyor → Aktif/Hazır; Hata; Silindi |
- Özel ve değer tabanlı kitle **müşteri kişisel verisini Meta'ya gönderir**; benzer kitle göndermez.
- Silme Meta'dan da siler, geri alınamaz.

### Huni (funnel)
| Alan | Kural |
|---|---|
| Ad (≤100), açıklama (≤500) | |
| Tür | Genel satış, Ürün lansmanı, Terk edilmiş sepet, Sezonluk indirim, Özel — **değişmez**. Şablondan gelenin asgari günlük bütçesi var |
| Günlük bütçe | ≥1, reklam hesabı para biriminde; aşamalara % ile bölünür |
| Aşamalar (1–12) | Ad (benzersiz), hunideki aşama (Soğuk … Sadık müşteri), kampanya amacı (Farkındalık … Satışlar), bütçe payı %. Her aşama Meta'da bir kampanya |
| Durum | Taslak → (Yayınla) Oluşturuluyor → Aktif ⇄ Duraklatıldı; Hata; Tamamlandı (silinince) |
- Yayınlanmış hunide yalnız ad, açıklama, bütçe değişir. **Yayınla / Devam ettir = Meta'da harcama.**

### Deney (A/B)
| Alan | Kural |
|---|---|
| Ad, açıklama, hipotez | |
| Huni | Zorunlu; deney bir huninin içinde çalışır |
| Tür | Reklam kreatifi / Hedef kitle / Teklif / Yerleşim — **değişmez** |
| Başarı metriği, güven eşiği (80–99, vars. 95), başlangıç tarihi | |
| Varyantlar (2–6) | Ad (benzersiz), ağırlık (toplam 100); ilk varyant kontrol. **Başladıktan sonra kilitli** |
| Durum | Taslak → Çalışıyor ⇄ Duraklatıldı → Durduruldu (geri dönüşsüz) / Tamamlandı (kazanan ilanı ya da otomatik) |

### Uyarı kuralı ve tetiklenen uyarı
| Alan | Kural |
|---|---|
| Ad (≤100), tür (değişmez), metrik, karşılaştırıcı, eşik, pencere (saat ≥1), önem, bekleme (dk ≥1) | |
| Kanallar | Uygulama içi / E-posta (1–20 alıcı) / Slack (webhook URL — gizli) / Webhook (URL — gizli); en az biri |
| Etkin | Listeden anında aç/kapa |
| Tetiklenen uyarı | Önem, değer/eşik, tetiklenme zamanı; durum Aktif → Onaylandı → Çözüldü (Sessize alındı); 90 gün saklanır |
- Değerlendirme ~15 dakikada bir; uyarılar Meta'ya yazmaz.

### Optimizasyon kuralı
- Ekran henüz yok ("çok yakında"); bütçe/duraklatma huni ekranlarından yönetilir.

## İlişkiler
| İlişki | Not |
|---|---|
| Bağlantı → kitle / huni / deney / uyarı | Hepsi "Bağlı" mod ister (uyarı kuralı oluşturmak hariç) |
| Reklam hesabı → huni bütçesi | Bütçe para birimi ve harcama bu hesaptan |
| Pixel → vitrin | Vitrin olayları (görüntüleme, sepete ekleme, satın alma…) pixel + sunucu olayları olarak Meta'ya gider; huni dönüşüm metrikleri buna dayanır |
| Segment → özel kitle | [segment.md](segment.md); kitle oluşturma/yenileme anındaki segment üyeleri Meta'ya gider; segment değişince kitle kendiliğinden güncellenmez |
| Müşteri → kitle | [customer.md](customer.md); müşteri e-posta/telefonu gibi tanımlayıcılar Meta'ya aktarılır (kişisel veri, pazarlama izni gerekir) |
| Sipariş geçmişi → değer tabanlı kitle | Tekrar alışveriş ve toplam harcama ([order.md](order.md)) |
| Özel kitle → benzer kitle | Benzer kitlenin kaynağı; kaynak silinirse benzer kitle etkilenir (doğrulanmadı) |
| Kitle → huni aşaması | Aşama hedeflemesinde kullanılabilir |
| Huni → deney | Deney bir huni içinde çalışır; sonuçlar huni metriklerinden |
| Huni / bağlantı → uyarı | Uyarılar huni ya da hesap geneli metrikleri izler; "Meta token süresi doluyor" bağlantıyı izler |

## Kurallar (özet)
- Meta'ya yazan aksiyonlar: bağlan, reklam hesabı seç, kitle oluştur/yenile/sil, huni yayınla/duraklat/devam ettir/sil,
  pixel test olayı; harcama başlatanlar: **huni Yayınla / Devam ettir** (deney Başlat'ın etkisi doğrulanmadı — harcama
  başlatıyor say).
- Müşteri verisi gönderenler: **özel kitle oluştur, değer tabanlı benzer kitle oluştur, Verileri yenile.**
- Bağlantıyı kesmek Meta'daki kampanyaları durdurmaz.
