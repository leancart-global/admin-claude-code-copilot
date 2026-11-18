# Destek Butonu (WhatsApp / Instagram) — Ayarlar > Genel > "Destek butonu" sekmesi
- URL: {ADMIN_URL}/settings/general → sekme **"Destek butonu / Support button"** (sekme seçimi URL'ye yazılmaz; sayfa "Mağaza ve Bölge" sekmesiyle açılır, sekmeye tıkla). Genel sayfanın diğer sekmeleri: [general.md](general.md).
- Amaç: Vitrinde sayfanın köşesinde duran sabit WhatsApp butonunu (ve isteğe bağlı yanında Instagram DM butonunu) açmak, numarasını/mesajını/konumunu ayarlamak.
- Yetki: sekme `settings:read` ile görünür; alanlar ve "Kaydet" `settings:write` ister (yoksa tüm alanlar disabled).
- Veri / API: mağaza yapılandırmasındaki destek butonu bölümü okunur ve bu sekmenin kendi "Kaydet"i ile yazılır; diğer sekmelerin kaydından bağımsızdır.

## Ön koşullar ve bağımlılıklar
- Bir WhatsApp numarası (ülke kodlu). Instagram yalnız kullanıcı adı ister. Başka kayıt gerekmez.
- Ayar yüklenemezse kartta "Bu ayar yüklenemedi. Lütfen tekrar deneyin." + "Tekrar dene".

## Yerleşim
Tek kart: başlık "Destek butonu", açıklama "Mağazanızda sabit bir WhatsApp butonu; isterseniz yanında bir Instagram DM butonu". Form (yukarıdan aşağı): switch, WhatsApp numarası, Varsayılan mesaj (karakter sayacı), Instagram kullanıcı adı, Buton konumu, sağ altta **Kaydet** (değişiklik yoksa disabled; kaydederken "Kaydediliyor...").

## Alanlar
| Label (tr / en) | Form key / locator | Kontrol | Zorunlu | Validasyon / varsayılan | Not |
|---|---|---|---|---|---|
| Destek butonunu göster / Show the support button | `#supportWidgetEnabled` | Switch | — | kapalı | "Müşteriler butonu ana sayfada, ürün sayfalarında ve içerik sayfalarında görür; sepet ve ödeme sayfalarında görmez." |
| WhatsApp numarası / WhatsApp number | `#whatsappNumber` | Input (tel) | **buton açıkken evet** | ülke koduyla, örn. `+90 532 123 45 67`; boşluk, `+`, `-`, `.`, parantez temizlenir; kalan 8–15 haneli rakam olmalı ve **0 ile başlamamalı** (baştaki 0 hatadır) — "Ülke kodu ile bir WhatsApp numarası girin, örneğin +90 532 123 45 67." | Kayıtlı numara forma `+` önekiyle gelir |
| Varsayılan mesaj / Default message | `#whatsappMessage` | Textarea (3 satır) | hayır | **≤500 karakter**; sayacı "{n} / 500" — "Mesaj en fazla 500 karakter olabilir." | Sohbette hazır gelir; ürün sayfasında sonuna ürün bağlantısı eklenir |
| Instagram kullanıcı adı / Instagram username | `#instagramUsername` | Input | hayır | harf, rakam, nokta ve alt çizgi; ≤30 karakter — "Yalnızca harf, rakam, nokta ve alt çizgi kullanın; en fazla 30 karakter." | Başa yazılan `@` otomatik silinir. Boş bırakırsan yalnız WhatsApp görünür |
| Buton konumu / Button position | `#supportWidgetPosition` | Select | — | varsayılan **Sağ alt / Bottom right**; diğer: **Sol alt / Bottom left** | sayfanın hangi alt köşesi |

## Aksiyonlar
| Buton | Etki | Toast |
|---|---|---|
| Kaydet / Save | ayarı kaydeder; **vitrine yansır** | "Destek butonu kaydedildi" / hata "Destek butonu kaydedilemedi. Lütfen tekrar deneyin." Sunucu bir alanı reddederse o alanın altında kırmızı hata metni görünür |

## Onay zamanlaması (kural 2/6)
"Kaydet" ayrı butondur (otomatik kayıt yok); özet + onay butondan önce alınır. Switch'i açıp kaydetmek **butonu müşterilere görünür yapar**, numara/mesaj müşterinin açtığı WhatsApp sohbetinde görünür → özette "vitrinde görünür" ve girilen numarayı yaz.

## Yan etkiler
- Açık ve numara doluysa vitrinde ana sayfa, ürün sayfaları ve içerik sayfalarında seçilen köşede WhatsApp butonu çıkar; Instagram kullanıcı adı varsa yanında Instagram DM butonu çıkar. Sepet ve ödeme sayfalarında görünmez. Vitrine yansıma süresi **doğrulanmadı** (mağaza yapılandırması önbelleği nedeniyle kısa gecikme olabilir).
- Numara kişisel/işletme verisidir; özette sormadan başka bir numara yazma.

## Tuzaklar
- Buton açık ama numara boşsa kayıt reddedilir; önce numarayı gir.
- Numarayı `0532…` biçiminde (başında 0) girmek hata verir; ülke kodu (`+90`) ile gir.
- Sekme değiştirmek formdaki kaydedilmemiş değişikliği silmez ama sayfadan ayrılmak siler.
- Genel sayfadaki diğer kartlar (ör. "Ürün görünümü", "Ödeme deneyimi") ayrı kaydedilir.

## Doğrulama
1. Toast "Destek butonu kaydedildi"; sayfayı yenileyip sekmeye dön → switch, numara (`+` önekli), mesaj, kullanıcı adı ve konum kalıcı.
2. Vitrinde (ana sayfa, bir ürün sayfası) butonun seçilen köşede göründüğünü, sepette görünmediğini kontrol et; butona tıklayınca WhatsApp'ın hazır mesajla açıldığını (ürün sayfasında ürün bağlantısı eklenmiş) doğrula.
