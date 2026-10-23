# Para Birimleri (Currencies)
- URL: {ADMIN_URL}/settings/currencies
- Menü yolu: Sol menü "Ayarlar / Settings" → "Para Birimleri / Currencies"; ya da `/settings` hub → "Mağaza / Store" → "Para Birimleri / Currencies".
- Sayfa başlığı: "Para Birimleri / Currencies"; açıklama "Çoklu para birimi fiyatlandırması için para birimlerini ayarlayın. Döviz kurlarını ve gösterim formatlarını yapılandırın."
- Amaç: Mağazada kullanılabilen para birimlerini, kurlarını (manuel ya da TCMB'den otomatik) ve aktifliğini yönetmek; yeni ürünlerin varsayılan fiyatlandırma para birimini seçmek. Store view'ların para birimi ve ürün fiyatlarının çevrimi buradaki kayıtlara dayanır.
- Entity: [../../entities/currency.md](../../entities/currency.md).
- Yetki: ekran `settings:read`; ekle/düzenle/sil/aktiflik/kur yenileme `products:write`; varsayılan fiyatlandırma para birimi `settings:write` (doğrulanmadı).
- Plan: birden çok para birimiyle satış "Çoklu Para Birimi / Multi-Currency" plan özelliğiyle ilişkilidir (doğrulanmadı).

## Ön koşullar ve bağımlılıklar
- Ön koşul yok. Temel para birimi (kuru 1) ilk kurulan para birimidir (bu tenant'ta TRY).
- Etkiledikleri: store view para birimi ([store-views.md](store-views.md)), ürün fiyatı para birimi ve çevrimi, vitrin fiyat gösterimi, ödeme. Ürün oluşturma için ≥1 aktif para birimi + varsayılan fiyatlandırma para birimi gerekir (bkz. [../../entities/product.md](../../entities/product.md)).

## Yerleşim
1. Kart "Para Birimleri": başlık + açıklama; sağda "Kurları Güncelle / Refresh Rates" (yenile ikonu; dar ekranda yalnız ikon) ve "Para Birimi Ekle / Add Currency".
2. Tablo sütunları: "Para Birimi / Currency" (ad + kod), "Durum / Status" ("Aktif"/"Pasif"), "Sembol / Symbol", "Döviz Kuru / Exchange Rate" (kuru 1 olan satırda "Temel / Base" rozeti, diğerlerinde 4 ondalık), "Kur Kaynağı / Rate Source" ("Manuel"/"TCMB"), "Son Güncelleme / Last Updated" ("5dk önce" gibi; geniş ekranda), satır sonunda "⋯" (sr-only "İşlemler / Actions").
3. Satır menüsü: "Düzenle / Edit", "Etkinleştir / Activate" ya da "Devre Dışı Bırak / Deactivate", ayırıcı, "Sil / Delete".
4. Kart "Varsayılan Fiyatlandırma Para Birimi / Default Pricing Currency *" — yalnız en az bir aktif para birimi varsa görünür; seçili değilse sarı uyarı "Ürün satışına başlayabilmek için varsayılan fiyatlandırma para birimi seçmeniz gereklidir." Altta "Bu sadece yeni ürünler için geçerlidir. Mevcut ürünleri güncellemek için toplu işlemleri kullanın."
5. Boş durum: "Henüz Para Birimi Yok" + "İlk Para Biriminizi Ekleyin".
Diyaloglar: Ekle/Düzenle (Dialog), Silme onayı (AlertDialog).

## Alanlar
### Ekle / Düzenle diyaloğu ("Para Birimi Ekle" / "Para Birimini Düzenle")
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Para Birimi Kodu / Currency Code | Ekle: Select (USD, EUR, GBP, TRY, JPY, CNY, SAR, AED); Düzenle: kilitli Input | evet | yoksa toast "Lütfen bir para birimi kodu seçin" | combobox "Bir para birimi seçin"; düzenlemede `#code` (disabled) | Seçim Ad, Sembol ve Ondalık'ı otomatik doldurur. Listede olmayan kod eklenemez. Kod sonradan değişmez |
| Ad / Name | Input | evet | "Lütfen bir para birimi adı girin" | `#name` | |
| Sembol / Symbol | Input | evet | "Lütfen bir para birimi sembolü girin" | `#symbol` | |
| Kur Kaynağı / Rate Source | Select: "Manuel / Manual", "TCMB (Otomatik) / TCMB (Automatic)" | — | Manuel | label "Kur Kaynağı" | TCMB seçilince kur alanı kilitlenir; kayıtta güncel TCMB kuru çekilir |
| Döviz Kuru / Exchange Rate | number Input, adım 0.0001, min 0 | — | 1 | `#exchangeRate` | "Temel para birimine gore oran": 1 birim bu para birimi = X temel para birimi (ör. TRY temel iken USD ≈ 49,60). TCMB'de pasif, yardım "TCMB'den otomatik güncellenir" |
| Ondalik Başamak / Decimal Places | number Input 0–4 | — | 2 (JPY 0) | `#decimalPlaces` | Fiyat gösterim hassasiyeti |
| Aktif / Active | Switch | — | açık | label "Aktif" yanındaki switch | "Bu para birimini müşteriler için etkinleştir" |
Butonlar: "İptal / Cancel", "Para Birimi Ekle / Add Currency" ya da "Değişiklikleri Kaydet / Save Changes".

### Varsayılan Fiyatlandırma Para Birimi kartı
| Label | Kontrol | Not |
|---|---|---|
| (kart başlığı) "Varsayılan Fiyatlandırma Para Birimi" | Select (placeholder "Varsayılan para birimi seçin"); seçenekler "sembol KOD - Ad", yalnız aktifler | **Seçim anında kaydedilir** — ayrı Kaydet butonu yok |

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Para Birimi Ekle → diyalog → Para Birimi Ekle | Kayıt oluşur, tablo yenilenir | "Para birimi başarıyla oluşturuldu"; aynı kod varsa 409 hata toast'u |
| ⋯ → Düzenle → Değişiklikleri Kaydet | Ad/sembol/kur/kaynak/ondalık/aktiflik güncellenir | "Para birimi başarıyla güncellendi". TCMB bu kod için kur yayınlamıyorsa veya ortamda TCMB kapalıysa hata |
| ⋯ → Etkinleştir / Devre Dışı Bırak | **Diyalogsuz, anında** | "Para birimi etkinleştirildi / devre dışı bırakıldı" |
| ⋯ → Sil → onay "Para Birimi Silinsin mi?" ("\"{name}\" silinsin mi? Bu para birimini kullanan ürünler etkilenebilir.") → "Sil" | Kalıcı silme | "Para birimi başarıyla silindi". Bir store view kullanıyorsa reddedilir: `ERR_CURRENCY_IN_USE` (409) "Currency X is used by store views: …" |
| Kurları Güncelle | Kaynağı TCMB olan tüm para birimlerinin kuru TCMB'den çekilip güncellenir | "TCMB'den {count} kur güncellendi" / "TCMB'den kurlar güncellenemedi" |
| Varsayılan fiyatlandırma Select'inde seçim | **Anında** kaydedilir | "Varsayılan fiyatlandırma para birimi kaydedildi" |

## Onay zamanlaması (kural 2/5/6)
- **Anında kayıt:** "Varsayılan Fiyatlandırma Para Birimi" seçimi ve satır menüsündeki "Etkinleştir / Devre Dışı Bırak". Onay, Select'i açmadan / menü öğesine tıklamadan **önce** alınır.
- **Dış etkili:** "Kurları Güncelle" — dış kaynaktan kur çeker ve TCMB kaynaklı tüm kurları değiştirir → o para birimlerindeki çevrilmiş fiyatlar değişir. Kullanıcı isterse, onayla. Düzenlemede kaynağı TCMB'ye çevirmek de kaydette kuru günceller (özet: eski kur → "TCMB güncel kuru").
- **Silme:** ayrı onay; özetinde bağlı store view kontrolü (listede ara) yazılır.

## Yan etkiler
- Kur değişikliği, o para birimiyle gösterilen/çevrilen fiyatları kısa sürede günceller (vitrin arama sonuçları dahil).
- TCMB kaynaklı kurlar ayrıca hafta içi mesai saatlerinde (İstanbul) kendiliğinden ~10 dakikada bir güncellenir; "Son Güncelleme" bunu gösterir.
- Pasifleştirilen para birimi store view ve varsayılan fiyatlandırma seçicilerinden düşer; vitrinde sunulmaz.
- Varsayılan fiyatlandırma para birimi yalnız **yeni** ürünleri etkiler.

## Tuzaklar
- "Temel" rozeti kuru tam 1 olan para birimidir; ayrı bir "temel yap" butonu yoktur. Temel olmayan bir para birimine kur 1 girme; temeli değiştirme isteğinde dur ve kullanıcıya etkisini (tüm kurların yeniden girilmesi) anlat — doğrulanmadı, işlem önerme.
- Kur yönü: temel TRY iken USD satırına "1 USD = kaç TRY" girilir (≈ 49,60), tersi (0,02) değil.
- Varsayılan fiyatlandırma Select'i değeri seçer seçmez kaydeder; "bakmak için" açıp başka seçeneğe tıklama.
- Kodu listede olmayan bir para birimi (ör. CHF) eklenemez; kullanıcıya bildir.
- Store view kullanan para birimini silmek için önce o store view'ın para birimini değiştir ([store-views.md](store-views.md)).

## Doğrulama
1. Toast.
2. Tablo satırında Durum, Sembol, Kur, Kaynak, Son Güncelleme beklenenle aynı.
3. Varsayılan fiyatlandırma kartında seçili değer; sayfayı yenileyip tekrar kontrol.
4. Store view Sheet'indeki para birimi seçicisinde yeni/aktif para birimi görünüyor.
