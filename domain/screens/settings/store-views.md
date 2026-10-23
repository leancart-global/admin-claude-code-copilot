# Mağaza Görünümleri (Store Views) + Mağaza görünümü ayarları
- URL'ler:
  - Liste: {ADMIN_URL}/settings/store-views
  - Görünüm ayarları: {ADMIN_URL}/settings/store-views/{code} (ör. `/settings/store-views/tr_tr`) — URL kısa yolları + çerez politikası sayfası.
- Menü yolu: Sol menü "Ayarlar / Settings" → "Mağaza Görünümleri / Store Views"; ya da `/settings` hub → "Mağaza / Store" → "Mağaza Görünümleri / Store Views".
- Sayfa başlığı: "Mağaza Görünümleri / Store Views"; açıklama "Mağazanız için dil ve bölge ayarlayın. Mağaza görünümleri kategoriler, ürünler ve içerikler için çevirileri etkinleştirir."
- Amaç: Mağazanın sunulduğu dilleri (store view) ve her dilin varsayılan para birimini yönetmek; hangi dilin varsayılan olduğunu belirlemek; dil başına vitrin URL kısa yollarını ve çerez politikası sayfasını ayarlamak. Store view eklemek, ürün/kategori/marka/sayfa formlarında yeni bir çeviri kapsamı açar.
- Entity: [../../entities/store-view.md](../../entities/store-view.md).
- Yetki: ekran `settings:read`; ekle/düzenle/sil/aktiflik/varsayılan `products:write` (store view kaydı katalog alanındadır). Görünüm ayarları ekranındaki çerez politikası kartı yalnız `content:update` yetkisiyle görünür.
- Plan: ikinci ve sonraki store view için "Çoklu Dil / Multi-Language" (`multi_language`) özelliği gerekir → yoksa `ERR_FEATURE_REQUIRED` (403).

## Ön koşullar ve bağımlılıklar
- Para birimi seçilecekse önce [currencies.md](currencies.md) ekranında **aktif** olarak bulunmalı (seçicide yalnız aktif para birimleri çıkar).
- Çerez politikası sayfası atanacaksa önce **yayınlanmış** bir CMS sayfası olmalı ([../content/page-create.md](../content/page-create.md)).
- Etkiledikleri: ürün/kategori/marka/özellik/sayfa çevirileri (form üstündeki store view çubuğu), ana sayfa/navigasyon içerik dili seçicisi, vitrin dil yönlendirmesi ve URL'leri, çerez onayı. ≥1 aktif store view; kategori ve ürün oluşturmanın UI ön koşuludur.

## Yerleşim
### Liste (`/settings/store-views`)
- Başlık satırı + sağda "Mağaza Görünümü Ekle / Add Store View".
- Liste (tablo benzeri satırlar) sütunları: "Dil / Language" (görünen ad + dil adı), "Durum / Status" ("Aktif / Active" | "Pasif / Inactive"), "Para Birimi / Currency", "Kod / Code" (ör. `tr_tr`), "Varsayılan / Default" (rozet), satır sonunda "⋯" (aria-label "İşlemler / Actions").
- Satır menüsü: "Düzenle / Edit" (Sheet açar), "Mağaza görünümü ayarları / Store view settings" (görünüm ayarları ekranına gider), "Aktif/Pasif" geçişi (varsayılanda pasif), "Varsayılan yap / Set as default" (yalnız varsayılan olmayan satırda), "Sil / Delete" (varsayılanda pasif).
- Altta sarı uyarı: "Yeni bir mağaza görünümü eklemek, tüm ürünlerin, kategorilerin ve içeriklerin yeni dile çevrilmesini gerektirir…"
- Boş durum: "Henüz Mağaza Görünümü Yok" + "İlk Mağaza Görünümünüzü Ekleyin".

### Ekle/Düzenle Sheet'i (sağdan açılan panel)
- Başlık "Mağaza Görünümü Ekle / Add Store View" ya da "Mağaza Görünümünü Düzenle / Edit Store View"; üstte çeviri etkisi uyarısı; altta "İptal / Cancel" ve "Kaydet / Save".

### Görünüm ayarları (`/settings/store-views/{code}`)
- Başlık = görünüm kodu; açıklama "Bu mağaza görünümünün ayarlarını yönetin."; geri ok listeye döner.
- Kart 1 "URL Kısa Yolları / URL Slugs" — sayfa başına slug tablosu.
- Kart 2 "Çerez politikası sayfası / Cookie policy page" (yetki varsa).

## Alanlar
### Sheet
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Dil / Language | Select (placeholder "Bir dil seçin") | evet | Yoksa toast "Lütfen bir dil seçin". Seçenekler: English, Türkçe, Deutsch, Français, Español, Italiano, Nederlands, العربية (sağdan sola) | `#language` combobox | **Düzenlemede kilitli** (dil sonradan değişmez). Dil seçmek "Görünen Ad"ı dil adıyla doldurur |
| Görünen Ad / Display Name | Input | hayır | boşsa dil adı kullanılır; placeholder "örneğin, Türkçe (TR)" | `#name` | Vitrin dil seçicide görünen ad (doğrulanmadı) |
| Para Birimi / Currency | Select | hayır | Yalnız aktif para birimleri, "KOD (sembol) — Ad" | label "Para Birimi" | "Bu mağaza görünümü için varsayılan para birimi". Boş bırakılabilir |
| Varsayılan olarak ayarla / Set as default | Switch | — | kapalı | `#isDefault` | Açıp kaydetmek **diğer görünümün varsayılanlığını kaldırır** |
| Aktif / Active | Switch | — | açık | `#isActive` | "Bu mağaza görünümünü müşteriler için etkinleştir" |

Kod (`code`) dil seçiminden otomatik türetilir (dil_BÖLGE, ör. `tr_tr`, `en_us`); formda görünmez ve değiştirilemez.

### URL Kısa Yolları kartı
| Sütun | İçerik |
|---|---|
| Sayfa / Page | Vitrin sayfası adı: Ana sayfa, Ürünler, Ürün detayı, Sepet, Ödeme (+ alt adımları), Giriş yap/Kayıt ol/Şifre…, Hesabım, Siparişler, Blog, Sayfalar, İletişim, SSS, Çerez politikası, Gizlilik politikası, Mesafeli satış sözleşmesi, Ön bilgilendirme formu, Şartlar ve koşullar, İstek listesi, Garanti, Destek, Talepler, Soru & Cevap, Kupon… |
| Varsayılan / Default | Sistemin varsayılan yolu |
| Sizin slug'ınız / Your slug | Input (placeholder "Örn. urunler"), `data-testid="pathname-input-{ROUTE}"`; boş = varsayılan |

Satır hataları (`data-testid="pathname-error-{ROUTE}"`): "Yalnızca küçük harf, rakam ve tire kullanın.", "\"{segment}\" değeri ayrılmıştır ve kullanılamaz.", "Bu slug zaten {collidesWith} için kullanılıyor.", "Yalnızca ASCII karakterlere izin verilir.", "Boş yol parçalarına izin verilmez.", liste çok büyükse "Slug listesi çok büyük…". Öneri varsa link "\"{suggestion}\" değerini kullan" (`data-testid="pathname-suggestion-{ROUTE}"`) — Türkçe karakterli girdide ASCII karşılığını önerir.

Butonlar: "Değişiklikleri iptal et / Discard changes", "URL kısa yollarını kaydet / Save URL slugs" (`data-testid="pathname-editor-save"`; değişiklik yoksa veya hata varsa pasif).

### Çerez politikası sayfası kartı
| Öğe | Kontrol | Not |
|---|---|---|
| Sayfa seçici | Aramalı combobox (placeholder "Bir sayfa seçin", arama "Sayfalarda ara...") | Yalnız **yayınlanmış** CMS sayfaları; sonuç yoksa "Yayınlanmış sayfa bulunamadı." |
| Boş durum | "Bu mağaza görünümü için henüz bir çerez politikası sayfası seçilmedi." | |
| Kayıtlı sayfa silinmişse | "Kayıtlı çerez politikası sayfası bulunamadı. Sayfa silinmiş olabilir. Lütfen başka bir sayfa seçin." | |
| Butonlar | "Kaydet / Save" (`data-testid="cookie-policy-save"`), "Değişiklikleri geri al / Discard changes", "Sayfayı kaldır / Remove page" (`data-testid="cookie-policy-remove-trigger"`) | |

## Aksiyonlar
| Buton | Ne olur | Onay/Toast |
|---|---|---|
| Mağaza Görünümü Ekle → Sheet → Kaydet | Yeni store view oluşturur, liste yenilenir | "Mağaza görünümü başarıyla oluşturuldu". Hata toast'u sunucu mesajıyla (ör. aynı kod var 409, aynı dilde aktif görünüm `ERR_STORE_VIEW_LOCALE_EXISTS`, plan `ERR_FEATURE_REQUIRED`) |
| ⋯ → Düzenle → Kaydet | Ad, para birimi, varsayılan, aktiflik güncellenir | "Mağaza görünümü başarıyla güncellendi" |
| ⋯ → Aktif / Pasif | **Diyalogsuz, anında** aktiflik değişir | "Mağaza görünümü etkinleştirildi / devre dışı bırakıldı" |
| ⋯ → Varsayılan yap | **Diyalogsuz, anında** varsayılan olur; önceki varsayılanın işareti kalkar | "Mağaza görünümü varsayılan olarak ayarlandı" |
| ⋯ → Sil | Onay diyaloğu "Mağaza Görünümü Silinsin mi?" — "\"{name}\" silinsin mi? Bu mağaza görünümü için tüm çeviriler kaybolacak." → "Sil" | "Mağaza görünümü başarıyla silindi"; varsayılan silinemez |
| ⋯ → Mağaza görünümü ayarları | `/settings/store-views/{code}` açılır | — |
| URL kısa yollarını kaydet | Slug'lar kaydedilir | "URL kısa yolları kaydedildi" + "Bu mağaza görünümündeki müşteriler yeni adresleri hemen görecek." Hata: "URL kısa yolları kaydedilemedi" |
| Çerez kartı → Kaydet | Önce soru diyaloğu: "Bu, çerez politikanızda önemli bir değişiklik mi?" — "Evet, tekrar sor / Yes, ask shoppers again", "Hayır, mevcut onayı koru / No, keep existing consent", "Vazgeç / Cancel" | "Çerez politikası sayfası kaydedildi." Başkası aynı anda değiştirdiyse çakışma hatası → sayfa yeniden yüklenir, tekrar seç |
| Çerez kartı → Sayfayı kaldır | Onay "Çerez politikası sayfası kaldırılsın mı?" → "Çerez politikası sayfasını kaldır" | Ziyaretçiler artık bağlı çerez politikası görmez |

## Onay zamanlaması (kural 2/5/6)
- **Anında kayıt (diyalogsuz):** satır menüsündeki "Aktif/Pasif" ve "Varsayılan yap". Onay menüye tıklamadan **önce** alınır; özet: hangi görünüm, eski → yeni durum, vitrindeki etkisi.
- **Silme:** ayrı onay; özetinde "bu görünümün tüm çevirileri kaybolur, geri alınamaz" yazılır.
- **Dış etkili soru:** çerez politikası Kaydet'te çıkan "önemli değişiklik mi?" sorusunun cevabını **kullanıcıya sor** — "Evet" tüm alışveriş yapanlardan çerez onayını yeniden ister. Kendi kendine cevaplama; kullanıcı belirtmediyse "Vazgeç" ile çık ve sor.
- URL kısa yolları kaydı vitrine **hemen** yansır → özet: değişen sayfa(lar), eski → yeni yol.

## Yan etkiler
- Yeni store view: tüm varlık formlarında yeni çeviri kapsamı; çevrilmemiş içerik vitrinde varsayılan görünüme düşer.
- Pasif görünüm müşterilere sunulmaz (vitrin dil seçicide çıkmaz — doğrulanmadı).
- Varsayılan değişimi: formlardaki "varsayılan kapsam" dili ve tercih belirtmeyen ziyaretçinin dili değişir.
- URL kısa yolu değişimi: o dildeki vitrin adresleri hemen değişir; eski adreslere verilmiş linkler etkilenebilir (yönlendirme için SEO → Yönlendirmeler ekranı — doğrulanmadı).

## Tuzaklar
- Dil, kayıttan sonra değiştirilemez (`ERR_STORE_VIEW_LOCALE_IMMUTABLE`); yanlış dil → sil + yeniden oluştur (çeviriler kaybolur).
- Aynı dilde ikinci **aktif** görünüm olamaz; pasif kopya varsa onu aktifleştirmek de reddedilir.
- Varsayılan görünüm pasifleştirilemez ve silinemez; önce başka bir görünümü varsayılan yap.
- Sheet'te "Varsayılan olarak ayarla"yı açmak mevcut varsayılanı sessizce değiştirir — kullanıcı istemedikçe kapalı bırak.
- Liste ekranındaki para birimi seçicisinde yalnız aktif para birimleri var; aradığın yoksa önce para birimini ekle/aktifleştir.

## Doğrulama
1. Toast.
2. Listede satır: Dil, Durum, Para Birimi, Kod, Varsayılan rozeti beklenenle aynı.
3. Görünüm ayarları: sayfayı yenile → slug input'ları ve seçili çerez sayfası kayıtlı değeri gösteriyor.
4. Gerekirse vitrin: `{STOREFRONT_URL}` dil seçicisi / değişen URL'ye git.
