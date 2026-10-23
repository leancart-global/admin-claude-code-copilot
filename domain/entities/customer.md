# Entity: Customer (müşteri)

Mağazanın alışveriş yapan kişisi ya da firması. Admin'den oluşturulabilir; vitrinde kayıt olan, ödemede hesap açan ve
içe aktarılan müşteriler de aynı kayda düşer. Siparişler, adresler, notlar, istek listesi, iletişim tercihleri, segment
ve grup üyelikleri müşteriye bağlıdır.

- Ekranlar: [../screens/customers/customers-list.md](../screens/customers/customers-list.md),
  [customer-create.md](../screens/customers/customer-create.md) (oluştur + düzenle),
  [customer-detail.md](../screens/customers/customer-detail.md),
  [customers-analytics.md](../screens/customers/customers-analytics.md).
- İlişkili: [customer-group.md](customer-group.md), [segment.md](segment.md); siparişler
  [../screens/orders/order-detail.md](../screens/orders/order-detail.md), admin'den sipariş
  [../screens/orders/order-create.md](../screens/orders/order-create.md); CRM kişileri
  [../screens/customers/crm/](../screens/customers/crm/) (ayrı kayıt türü).
- **Kişisel veri içerir** (ad, e-posta, telefon, doğum tarihi, TC kimlik / vergi no, adres). Claude bu değerleri
  özetlerde yalnız iş için gerektiği kadar gösterir, rapor/dosyaya kopyalamaz.

## Enum'lar
| Enum | Değerler (tr / en) |
|---|---|
| Müşteri tipi | `individual` Bireysel / Individual, `corporate` Kurumsal / Corporate |
| Durum (`status`) | `active` Aktif, `inactive` Pasif, `blocked` Engellendi / Blocked, `churned` Ayrılan / Churned, `prospect` Potansiyel / Prospect |
| Cinsiyet | `male` Erkek, `female` Kadın, `other` Diğer, `prefer_not_to_say` Belirtmek istemiyorum |
| Adres tipi | `shipping` Teslimat, `billing` Fatura |
| Not kategorisi | `general` Genel, `support` Destek, `sales` Satış, `billing` Fatura, `feedback` Geri Bildirim, `important` Önemli |
| Yaşam döngüsü (sistem hesaplar) | Potansiyel, Yeni, Aktif, Risk Altında, Ayrılan/Kayıp, Hareketsiz/Pasif |
| Değer segmenti (sistem hesaplar) | Yeni, Düşük, Orta, Yüksek Değer, VIP |
| Hesap durumu (sistem) | davet edilmemiş → `invited` (davet gönderildi) → `active` (müşteri şifresini belirledi) |

## Alanlar (admin'den girilebilenler)
| Alan | Ekran | Zorunlu | Kural |
|---|---|---|---|
| E-posta `email` | oluştur, düzenle | evet | Geçerli e-posta; **mağaza içinde benzersiz** (büyük/küçük harf duyarsız) → 409 "Customer with this email already exists" |
| Ad / Soyad | oluştur, düzenle | evet | Formda ≤50 karakter |
| Telefon | oluştur, düzenle | hayır | ≤20 |
| Müşteri tipi | yalnız oluştur | — | varsayılan Bireysel |
| TC Kimlik No | oluştur (Bireysel) | hayır | Doluysa tam 11 hane. "Fatura kesmek için TC Kimlik No gereklidir" uyarısı |
| Şirket | oluştur, düzenle | Kurumsal'da evet | ≤100 |
| Vergi Kimlik No (VKN) | oluştur (Kurumsal) | Kurumsal'da evet | tam 10 hane |
| Vergi Dairesi | oluştur (Kurumsal) | Kurumsal'da evet | ≤100 |
| MERSİS No | oluştur (Kurumsal) | hayır | doluysa tam 16 hane |
| Unvan (iş) | oluştur, düzenle | hayır | ≤100 |
| Doğum tarihi, Cinsiyet | oluştur, düzenle | hayır | — |
| VIP, Influencer | oluştur, düzenle | — | kapalı |
| Satış Ortağı + Satış Ortağı Kodu | yalnız düzenle | — | kod ≤50 |
| Dil / Para birimi / Saat dilimi | yalnız düzenle | — | sabit listeler (en/tr/de/fr/es; USD/EUR/TRY/GBP; 6 saat dilimi) |
| Durum | yalnız düzenle | — | oluştururken sistem atar |
| Etiketler | oluştur, düzenle | — | serbest metin; segment kurallarında kullanılabilir |
| Adresler | oluştur (en çok 1), detay → Adresler (en çok **5**) | — | bkz. Adres |
| Profil fotoğrafı | detay başlığı | — | yükleme anında kaydolur |
| Notlar | detay → Notlar | — | içerik 1–2000; kategori; "Sadece Dahili" / "Müşteriye Görünür" |
| İletişim tercihleri | detay → Tercihler | — | 7 anahtar, tek "Tercihleri Kaydet" ile |
| İstek listesi | detay → İstek Listesi | — | ürün ekle/kaldır, paylaşım anahtarı |

Admin'den girilemeyenler (yalnız görüntülenir): yasal onaylar (Kullanım Koşulları, Gizlilik Politikası, Pazarlama Onayı
— müşterinin kendi verdiği onaylar ve tarihleri), sipariş istatistikleri, LTV, etkileşim puanı, kayıp riski, yaşam
döngüsü, değer segmenti, sadakat puanı, e-posta doğrulama durumu, hesap durumu.

### Adres
| Alan | Zorunlu | Not |
|---|---|---|
| Adres tipi | — | Teslimat (varsayılan) / Fatura |
| Varsayılan | — | işaretlenirse o tipin varsayılanı |
| Ad, Soyad | evet | detay ekranında; oluşturma ekranında müşterinin adından alınır |
| Şirket | hayır | |
| Adres Satırı 1 | evet | ≤200–255 |
| Adres Satırı 2 | hayır | |
| Ülke | evet | Detay ekranında yalnız **Türkiye** seçilebilir |
| İl | evet | listeden (arama kutulu) |
| İlçe | TR'de evet | il seçilmeden açılmaz; listeden |
| Posta Kodu | evet | ülkeye göre format |
| Telefon | doğrulanmadı | |

## Kurallar
- E-posta mağaza içinde tekil; düzenlemede başka müşterinin e-postasına çevrilemez (409).
- Admin'den oluşturulan müşterinin **giriş hesabı yoktur**; müşteri, detaydaki "Hesabı Aktive Et" daveti ile şifresini
  belirleyince hesabı aktifleşir. Davet ve doğrulama e-postası aynı müşteriye ~1 dakikada bir gönderilebilir;
  mağaza URL'si (Ayarlar → Genel) tanımlı değilse gönderilmez.
- **Silme** (`customers:delete`): müşteri listeden ve aramalardan kalkar; arayüzde geri getirme yok. Geçmiş siparişler
  silinmez (doğrulanmadı: siparişte müşteri adının görünümü).
- **KVKK/GDPR silme ve anonimleştirme** geri alınamaz; e-posta yazılarak ve ≥10 karakter gerekçeyle onaylanır.
  Anonimleştirmede ad/e-posta anonim değerlerle değişir, telefon, doğum tarihi, adresler, notlar, etiketler silinir;
  sipariş geçmişi analiz için kalır.
- Yaşam döngüsü, değer segmenti, LTV gibi alanlar siparişlerden sistemce hesaplanır; elle değiştirilmez.

## İlişkiler
| İlişki | Not |
|---|---|
| Müşteri → Sipariş | 0..n; detayda Siparişler sekmesi; admin sipariş oluştururken müşteri seçilir ya da misafir sipariş açılır ([../screens/orders/order-create.md](../screens/orders/order-create.md)) |
| Müşteri → Adres | 0..5; sipariş oluştururken müşterinin kayıtlı adresleri seçilebilir |
| Müşteri → Segment | n..n; dinamik segmentte kurallarla, "Yeniden Oluştur" anında hesaplanır ([segment.md](segment.md)) |
| Müşteri → Müşteri grubu | n..n; admin arayüzünde elle atama yok ([customer-group.md](customer-group.md)) |
| Müşteri → Kampanya / promosyon | kampanya segment ya da "Tüm müşteriler" ile hedeflenir; yalnız pazarlama izni olan ve e-postası doğrulanmış müşterilere gider ([campaign.md](campaign.md)). Promosyonu müşteri kupon koduyla kullanır; kullanım müşteri başı sınırla sayılır ([promotion.md](promotion.md), [coupon.md](coupon.md)) |
| Müşteri → Meta kitlesi | Segmentten oluşturulan özel kitle ve değer tabanlı benzer kitle müşterinin e-posta/telefon gibi tanımlayıcılarını Meta'ya gönderir (kişisel veri, pazarlama izni gerekir) ([meta-integration.md](meta-integration.md), [../screens/marketing/meta/audiences.md](../screens/marketing/meta/audiences.md)) |
| Müşteri → İstek listesi | 1 liste; paylaşılabilir |
| Müşteri → CRM kişisi | ayrı kayıt; CRM ekranları [../screens/customers/crm/](../screens/customers/crm/) |
| Müşteri → Değerlendirme (review) | vitrinden gelir; moderasyon pazarlama altında ([review.md](review.md)) |
