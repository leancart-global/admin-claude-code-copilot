# Sipariş Oluştur (Create Order)
- URL: {ADMIN_URL}/orders/new
- Menü yolu: [orders-list.md](orders-list.md) → "Sipariş Oluştur / Create Order"; header hızlı butonu "Yeni Sipariş / New
  Order"; Dashboard hızlı işlemler.
- Sayfa başlığı: ayrı başlık yok; üstte "Siparişlere Dön / Back to Orders" ve sağda "Sipariş Oluştur / Create Order".
- Amaç: Telefon/mağaza/B2B gibi kanallardan gelen siparişi admin olarak girmek: kayıtlı müşteri veya misafir, ürünler ve
  adetler, teslimat adresi (TR'de il/ilçe), kargo tarifesi veya mağazadan teslim, ödeme sağlayıcısı, para birimi.
- Entity: [../../entities/order.md](../../entities/order.md). Playbook: [../../playbooks/order-create.md](../../../playbooks/order-create.md).
- Yetki: `orders:write` (müşteri araması için `customers:read`).
- Kişisel veri: **evet** (müşteri e-posta, telefon, adres).

## Ön koşullar ve bağımlılıklar
Sayfa açılınca aktif para birimleri, aktif ödeme sağlayıcıları ve aktif kargo entegrasyonu okunur (birkaç saniye
sürebilir; kart bu okuma bitince belirir — ilk snapshot'ta kart yoksa bekleyip tekrar bak). Eksik olanlar için
sayfanın üstünde sarı kesik çizgili kart çıkar: **"Yapılandırma Gerekli / Configuration Required"** — "Sipariş
oluşturabilmek için aşağıdakilerin ayarlanması gerekiyor:" + her eksik için satır ve "Yapılandır / Configure":

| Eksik | Kart satırı | Çözüm ekranı |
|---|---|---|
| Aktif para birimi | "Para Birimleri — Aktif para birimi tanımlanmamış" | [../settings/currencies.md](../settings/currencies.md) |
| Aktif ödeme sağlayıcısı | "Ödeme Yöntemleri — Aktif ödeme sağlayicisi yok" | [../settings/payments.md](../settings/payments.md) |
| Aktif kargo entegrasyonu (yalnız "Kargo ile gönderim" seçiliyken) | "Kargo Yöntemleri — Aktif kargo entegrasyonu yapılandırılmamış" | [../settings/shipping-carriers.md](../settings/shipping-carriers.md) |

Diğer bağımlılıklar:
- **Ürünler yayında olmalı**: ürün seçici yalnız yayındaki ürünleri listeler ([../products/product-list.md](../products/product-list.md)).
- **Stok**: ürün seçici stok adedini gösterir; stoktan fazla adet girilirse gönderim engellenir. Sipariş kaydında stok
  rezerve edilir ([../inventory/stock.md](../inventory/stock.md)).
- **Kayıtlı müşteri** seçilecekse müşteri önce var olmalı ([../customers/customer-detail.md](../customers/customer-detail.md)).
- Kargo tarifesi için depo gönderici adresi ve taşıyıcı fiyatlandırmasının çalışıyor olması gerekir
  ([../settings/shipping-carriers.md](../settings/shipping-carriers.md) "Kargo Fiyatlandırma Durumu").

## Yerleşim
- Üst çubuk: "Siparişlere Dön"; eksik zorunlu alan varsa sarı **"{N} sorun / {N} issues"** butonu (tıklayınca
  "Göndermeden önce gerekli" listesi); "Sipariş Oluştur" (eksik varken pasif).
- Sol sütun (geniş): 1) "Sipariş Ürünleri / Order Items", 2) "Müşteri Bilgileri / Customer Information",
  3) "Teslimat Adresi / Shipping Address" (yalnız kargo ile gönderimde), 4) "Fatura Adresi / Billing Address".
- Sağ sütun: 5) "Sipariş Özeti / Order Summary" (Para Birimi + Ara Toplam / Kargo / Toplam), 6) "Teslimat Yöntemi /
  Delivery Method" (+ kargo tarifeleri), 7) "Ödeme Yöntemi / Payment Method", 8) "Kupon Kodu / Coupon Code",
  9) "Sipariş Notları / Order Notes".

## Alanlar

### 1. Sipariş Ürünleri ("Bu siparişe ürün ekleyin")
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Ürün Ekle / Add Product | Buton → ürün seçici diyaloğu (arama + liste) | ≥1 ürün | — | `getByRole('button', { name: /Ürün Ekle|Add Product/ })` | Listede ad, SKU, fiyat, "Stok N" rozeti, durum. Ürüne tıklayınca satır eklenir; aynı ürün tekrar seçilirse adet +1 |
| Fiyat ({para birimi}) / Price | number, ≥0 | evet | Ürünün fiyatıyla gelir, **elle değiştirilebilir** | satırdaki ilk number input | Değişen fiyat özette ayrıca belirtilmeli |
| Adet / Qty | number + "−"/"+" | evet | ≥1 | satırdaki ikinci number input | Stoktan fazla → "Mevcut stoğu aşan sipariş ürünleri" sorunu |
| Toplam / Total | metin | — | fiyat × adet | — | |
| Çöp kutusu | Buton | — | — | satır sonundaki ikon buton | Satırı kaldırır |
Boşken: "Bu siparişe henuz ürün eklenmedi" + "Ürün Ekle". Altta "Ara Toplam".

### 2. Müşteri Bilgileri
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Misafir Sipariş / Guest Order | Checkbox | — | **işaretli** | `#guestOrder` | İşareti kaldırınca müşteri seçici gelir; tekrar işaretlemek seçili müşteriyi ve teslimat adresini temizler |
| E-posta / Email * | email Input | misafirde evet | e-posta biçimi | `#customerEmail` | Sipariş onayı bu adrese gider |
| Telefon / Phone | Telefon girişi (ülke kodu + numara) | hayır | — | label "Telefon" | |
| Müşteri ara... / Search customers... | Combobox (async; "Ad veya e-posta ile ara...") | kayıtlı müşteride evet | — | placeholder | Yaz → "Aranıyor..." → sonuçtan tıkla (Enter yok). Seçilince e-posta/telefon ve varsayılan teslimat/fatura adresi otomatik dolar; "Değiştir / Change" ile değişir. Sonuç yoksa "Müşteri bulunamadı." |

### 3. Teslimat Adresi (yalnız "Kargo ile gönderim")
Kayıtlı müşteride kayıtlı adresi varsa: "Kayıtlı Adresler" seçici (varsayılan rozetli) + "Farklı adres kullan / Use a
different address" → "Yeni Adres" formu; "Kayıtlı adreslere dön" ile geri. Misafirde veya adressiz müşteride doğrudan form:

| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Ad / First Name * | Input | evet | "Ad zorunludur" | `#firstName` | |
| Soyad / Last Name * | Input | evet | "Soyad zorunludur" | `#lastName` | |
| Adres Satırı 1 / Address Line 1 * | Input | evet | "Adres zorunludur" | `#address1` | |
| Adres Satırı 2 / Address Line 2 | Input | hayır | — | `#address2` | |
| Ülke / Country * | Select ("Ülke seçin") | evet | **varsayılan "United States"** | `#country` | Seçenekler: United States, Canada, United Kingdom, Germany, France, Italy, Spain, Australia, Japan, **Turkey** |
| Şehir / City * | Ülke Turkey ise **aranabilir combobox (il listesi)**, değilse Input | evet | "Şehir zorunludur" | `#city` | TR'de il yazıp listeden tıkla |
| İlçe / District * | (yalnız Turkey) aranabilir combobox; il seçilmeden pasif | TR'de evet | — | `#district` | Kargo fiyatı ilçeye göre hesaplanır |
| İl/Eyalet / State/Province | (Turkey dışı) Input | hayır | — | `#state` | |
| Posta Kodu / Postal Code * | Input | evet | ülkeye göre biçim ("Geçersiz posta kodu formatı") | `#postalCode` | Kargo tarifesi için şart |
| Telefon / Phone | Telefon girişi | hayır | biçim | label | |
| E-posta / Email | Input | hayır | biçim | `#email` | |

### 4. Fatura Adresi
| Label (tr / en) | Kontrol tipi | Zorunlu | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Teslimat adresiyle aynı / Same as shipping address | Checkbox (yalnız kargo ile gönderimde) | — | **işaretli** | `#sameAddress` | Kaldırılınca adres formu / kayıtlı fatura adresi seçici açılır |
| Adres formu | Teslimat formuyla aynı alanlar | **mağazadan teslimde evet** | — | aynı id'ler (sayfada iki form olabilir; kart başlığıyla kapsamla) | "Fatura adresi (teslim alma siparişleri için zorunlu)" |
Fatura kesilecekse (özellikle e-Fatura/e-Arşiv) fatura adresi siparişte bulunmalıdır ([../../entities/invoice.md](../../entities/invoice.md)).

### 5. Sipariş Özeti
| Label (tr / en) | Kontrol tipi | Zorunlu | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Para Birimi / Currency * | Select ("Para birimi seçin"); seçenek "₺ TRY - Türk Lirası" biçiminde | evet | Aktif para birimlerinin **ilki** | label "Para Birimi" | Tenant varsayılanı olmayabilir — her zaman özette göster |
| Ara Toplam / Kargo / Toplam | metin | — | — | — | Toplam = ara toplam + kargo. Vergi ve kupon indirimi bu önizlemede **gösterilmez**; kesin tutar sipariş kaydında hesaplanır (detayda kontrol et) |

### 6. Teslimat Yöntemi
| Label (tr / en) | Kontrol tipi | Zorunlu | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Kargo ile gönderim / Ship via carrier · Mağazadan teslim / In-store pickup | RadioGroup | evet | Kargo ile gönderim | `#delivery-shipping`, `#delivery-pickup` | Mağazadan teslimde teslimat adresi kartı gizlenir, kargo "Ücretsiz (mağazadan teslim)", fatura adresi zorunlu |
| Kargo Firması Seçin / Select Carrier * | Tarife kartları (radyo gibi) | kargoda evet | **En ucuz tarife otomatik seçilir** | kart metni (firma adı + fiyat) | Ürün eklenip şehir ve posta kodu girilince ~0,5 sn sonra "Kargo tarifeleri alınıyor..." → kartlar. Önce: "Kargo seçeneklerini görmek için ürün ekleyin ve teslimat adresini girin". Hata: "Kargo tarifeleri alınamadı" + "Tekrar Dene" |

### 7. Ödeme Yöntemi
| Label (tr / en) | Kontrol tipi | Zorunlu | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Ödeme Yöntemi / Payment Method | Select ("Ödeme yöntemi seçin"); seçenekler sağlayıcı adı: "Iyzico (Varsayılan)", "Stripe [Test]"… | evet | Varsayılan sağlayıcı, yoksa ilk aktif | kart başlığı "Ödeme Yöntemi" | Bu seçim **müşteriden tahsilat yapmaz**; siparişe ödeme yöntemi ve tutarıyla bekleyen ödeme satırı eklenir. "[Test]" = sağlayıcı test modunda |

### 8–9. Kupon ve notlar
| Label (tr / en) | Kontrol tipi | Zorunlu | Locator ipucu | Not |
|---|---|---|---|---|
| Kupon Kodu / Coupon Code ("Kupon kodunu girin") | Input | hayır | placeholder | Kod siparişe iletilir; indirimin uygulandığını detay ekranında "İndirim" satırından doğrula |
| Dahili Notlar / Internal Notes | Textarea | hayır | `#notes` | Müşteriye görünmez |
| Hediye Mesajı / Gift Message | Textarea | hayır | `#giftMessage` | Siparişe eklenecek mesaj |

## Zorunlu kontrol listesi ("{N} sorun" açılır listesi)
Para birimi (yapılandırılmamış) · Kargo yöntemi (yapılandırılmamış) · Ödeme yöntemi (yapılandırılmamış) · Kargo firması
seçimi · Sipariş ürünleri · Mevcut stoğu aşan sipariş ürünleri · Müşteri e-postası · Para birimi · Teslimat adı / soyadı /
adresi / şehri / posta kodu / ülkesi · Fatura adresi (teslim alma siparişleri için zorunlu). Liste boşalınca "Sipariş
Oluştur" aktifleşir.

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Sipariş Oluştur | Sipariş kaydedilir, detay sayfasına ([order-detail.md](order-detail.md)) yönlenir | "Sipariş Oluşturuldu — {no} numaralı sipariş başarıyla oluşturuldu." |
| — stok yetersiz | Sipariş oluşmaz | "Yeterli stok yok — {sku}: {istenen} istendi, stokta {mevcut} var" |
| — diğer hata | | "Sipariş oluşturulamadı" + açıklama |
| Siparişlere Dön | Listeye döner; form kaydedilmez | — |

## Onay zamanlaması (kural 2)
- Tek kalıcı aksiyon **"Sipariş Oluştur"**. Öncesinde özet: ortam, müşteri (kayıtlı/misafir + e-posta), kalemler
  (SKU, adet, birim fiyat — ürün fiyatından farklıysa işaretle), teslimat tipi, teslimat/fatura adresi (il/ilçe), kargo
  firması ve ücreti, ödeme sağlayıcısı, para birimi, kupon, notlar; "varsayılan" kullanılan alanları işaretle.
- Özette yan etkileri yaz: **müşteriye "Sipariş Onayı" e-postası gider**, mağaza yöneticilerine yeni sipariş bildirimi
  gider, **stok rezerve edilir**. Kargo etiketi bu adımda alınmaz; ödeme sağlayıcısında tahsilat yapılmaz.
- Prod ortamında test siparişi girme (kural 7) — sipariş gerçek müşteriye e-posta gönderir.

## Yan etkiler
- Sipariş durumu genelde **Beklemede** başlar; otomatik risk analizi siparişi **Dolandırıcılık İncelemesi**'ne alabilir
  (doğrulanmadı: admin siparişlerinde ne sıklıkla).
- Ödeme satırı **Beklemede** oluşur. "Hazırlanıyor"a geçiş için ödemenin Ödendi/Tahsil Edildi olması gerekir
  ([../../entities/order.md](../../entities/order.md)); admin panelinde ödemeyi "ödendi" işaretleyen ekran aksiyonu
  haritalanmadı (doğrulanmadı) — kullanıcıya tahsilatın nasıl yapılacağını sor.
- Sipariş kaynağı "admin" olur; kayıtlı müşteri seçildiyse müşterinin sipariş geçmişine eklenir.

## Tuzaklar
- **Ülke varsayılanı "United States"**: Türkiye adresi için önce Ülke'yi **Turkey** yap; il/ilçe listesi ancak o zaman
  açılır ve ilçe seçmeden kargo tarifesi doğru hesaplanmaz.
- Ülke değiştirilince şehir/ilçe alanları sıfırlanabilir — ülkeyi ilk doldur.
- Para birimi aktif listedeki **ilk** para birimiyle gelir; TRY beklerken başka birim seçili olabilir.
- Kargo tarifesi her adres/ürün değişikliğinde yeniden alınır ve **en ucuz** otomatik seçilir; kullanıcı belirli firma
  istediyse kartı yeniden seç ve snapshot ile doğrula.
- "Misafir Sipariş" yeniden işaretlenirse seçili müşteri ve teslimat adresi silinir.
- Ürün fiyatı satırda elle değiştirilebilir; kullanıcı fiyat söylemediyse ürünün kendi fiyatını bırak.
- Yalnız yayındaki ürünler seçilebilir; taslak ürün için önce ürünü yayınlamak gerekir (ayrı onay).
- Sayfadan ayrılınca form kaybolur (taslak kaydı yok).

## Doğrulama
1. Toast "Sipariş Oluşturuldu" ve detay sayfasına yönlenme; başlıkta sipariş numarası ve durum rozeti.
2. Detayda kalemler, adetler, birim fiyatlar, Ara Toplam / İndirim / Kargo / Vergi / Toplam.
3. Müşteri kartı (Kayıtlı/Misafir rozeti, e-posta), Teslimat Adresi, Fatura Adresi, Ödeme kartı (yöntem, durum).
4. [orders-list.md](orders-list.md)'de sipariş numarasıyla arama → satır görünür.
