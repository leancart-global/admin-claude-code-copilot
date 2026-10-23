# Formlar — liste, yeni form, form oluşturucu (Forms)
- URL'ler:
  - Liste: {ADMIN_URL}/content/forms
  - Yeni form: {ADMIN_URL}/content/forms/new
  - Form oluşturucu (builder): {ADMIN_URL}/content/forms/{id}
  - Gönderimler: {ADMIN_URL}/content/forms/{id}/submissions → ayrı dosya [form-submissions.md](form-submissions.md)
- Menü yolu: Sol menü "İçerik / Content" → "Formlar / Forms" (`content:read`).
- Amaç: Mağaza için iletişim, ürün sorusu, iade talebi, bülten, anket gibi **ziyaretçinin doldurduğu formları** kurmak ve
  yayınlamak. Yayınlanan form vitrinde kendi adresinde (`{STOREFRONT_URL}/{locale}/forms/{slug}`) açılır ve sayfa/blog
  içine "Form" bloğuyla gömülebilir; gelen yanıtlar gönderim kutusunda toplanır.
- Yetki:
  | İşlem | Yetki |
  |---|---|
  | Listeyi, builder'ı salt okunur görmek | `content:read` |
  | Form oluşturmak, Kopyala | `content:write` (UI'da "oluşturma" izni) |
  | Builder'da düzenleme, Taslağı kaydet, Yayınla, Yayından Kaldır | `content:write` |
  | Arşivle (liste menüsünde görünmesi için) | `content:delete` |
  - Yetkisizse liste "Formlara erişiminiz yok / You don't have access to Forms", yeni form ekranı "Form oluşturma yetkiniz
    yok / You don't have access to create forms" gösterir. Düzenleme izni yoksa builder açılır ama tüm düğmeler pasiftir.
- Entity: [../../entities/form.md](../../entities/form.md) (alan tipleri, durumlar, kurallar).

## Ön koşullar ve bağımlılıklar
- Form adresi (slug) mağaza içinde benzersiz olmalı.
- "Spam koruması" açık bir formu yayınlamak için önce **Ayarlar → Genel → Güvenlik / Security** sekmesinde spam koruması
  kimlik bilgisi tanımlı olmalı. O ekran hassastır; anahtarları **kullanıcı kendisi girer**, Claude dokunmaz.
- "Bir sayfaya yönlendir" seçilecekse hedef sayfa/ürün/kategori mevcut olmalı. Onay metnine bağlantı eklenecekse
  hedef CMS sayfası (ör. KVKK aydınlatma metni) mevcut olmalı.
- Formu bir sayfaya/bloga gömmek için form **yayınlanmış** olmalı (Form bloğu yalnız yayındaki formları listeler:
  [../../entities/homepage-components.md](../../entities/homepage-components.md) §16).

## Yerleşim

### Liste (`/content/forms`)
- Kart başlığı "Formlar / Forms" + toplam sayı rozeti; açıklama "Mağazanız için iletişim, geri bildirim ve talep formları
  oluşturun / Build contact, feedback and lead-capture forms for your store". Sağda "Form Ekle / Add Form".
- Filtre satırı: arama "Formlarda ara... / Search forms..." (ad ve adres içinde arar), Durum select'i "Tüm durumlar /
  All statuses" + Taslak / Yayında / Arşivlendi. Aktif filtreler rozet olarak; "Tümünü temizle / Clear all".
- Tablo sütunları: Ad / Name (altında `/slug`), Durum / Status (rozet; yayındaki formda kaydedilmiş ama yayınlanmamış
  değişiklik varsa ek sarı rozet "Taslak değişiklikler / Draft changes"), Alanlar / Fields (sayı), Gönderiler /
  Submissions (sayı + varsa "N yeni / N new" rozeti), Yayın Tarihi / Published ("Hiç yayınlanmadı / Never published"),
  satır sonunda "⋯" menüsü (`aria-label` "Menüyü aç / Open menu").
- Sayfalama 20'şerli: "{total} sonuçtan {from}-{to} arası gösteriliyor", "Önceki / Previous", "Sonraki / Next".
- Boş durum: "Henüz form yok / No forms yet" + "İlk formunuzu oluşturun / Create your first form".

### Yeni form (`/content/forms/new`) — iki adım
1. **Şablon galerisi** (başlık "Yeni Form / New Form", açıklama "Bir şablonla başlayın veya sıfırdan kendi formunuzu
   oluşturun."). Her kartta "Başla / Start" (`aria-label` "{ad} ile başla / Start {name}"). Şablonlar:
   | Şablon (tr / en) | İçerik |
   |---|---|
   | Bize ulaşın / Contact us | Ad soyad, e-posta, telefon, konu (açılır liste), mesaj, iletişim onayı |
   | Ürün sorusu / Product question | Ürün, ad soyad, e-posta, soru, onay |
   | Bülten + indirim / Newsletter + discount | E-posta, ad, pazarlama onayı — **onay işaretlenirse gönderen e-posta bültenine abone edilir** |
   | Stok bildirimi / Back-in-stock alert | Ürün, e-posta, telefon, bildirim onayı |
   | İade talebi / Return / RMA request | Sipariş, e-posta, iade edilecek ürünler, neden, talep (iade/değişim/mağaza kredisi), not |
   | Garanti kaydı / Warranty registration | Başka yerden alındı mı, sipariş, tarih, satın alma yeri, ürün, seri no, ad, e-posta, garanti onayı |
   | Geri bildirim / NPS anketi / Feedback / NPS survey | Puanlama, iyileştirme notu, e-posta, onay |
   | Etkinlik / çekiliş katılımı / Event / giveaway entry | Ad, e-posta, telefon, şehir, kaynak, katılım şartları onayı, pazarlama onayı |
   - **"Başla" anında taslak bir form oluşturur** (ad/adres şablondan gelir) ve builder'a gider — ayrı onay adımı yoktur.
2. **Boş form / Blank form** kartı → ad formu:
   - "Form adı / Form name" (zorunlu), "Web adresini özelleştir / Customize web address" açılır bölümü → "Web adresi /
     Web address". Altta "İptal / Cancel" ve "Form oluştur / Create form". Üstte "Farklı bir başlangıç şekli seçin /
     Choose a different way to start" galeriye döner.

### Form oluşturucu (`/content/forms/{id}`)
- **Başlık satırı**: geri bağlantı "Formlara Dön / Back to Forms", form adı, durum rozet(ler)i. Düğmeler:
  "Önizleme / Preview", not "Görünüm, mağaza markanızı takip eder — Marka ayarlarından değiştirin" (`/branding`
  bağlantısı), "Form ayarları / Form settings", yalnız yayındaysa "Mağazada görüntüle / View on store" (yeni sekme),
  "Taslağı kaydet / Save draft", "Yayınla / Publish".
- **Sol: "Alan ekle / Add a field" paleti** (≥768 px genişlikte; daha dar ekranda altta "Alan ekle" düğmesi). Gruplar:
  Temel / Basic, Seçim / Choice, Ticaret / Commerce, Düzen / Layout. Her alan tipi bir düğme (`aria-label`
  "{tip} alanı ekle / Add a {field} field"); tıklayınca alan **etkin adımın sonuna** eklenir.
- **Orta: tuval (canvas)** — "Adımlar / Steps" başlığı, "Adım ekle / Add step"; her adım bir bölüm (ad tıklanınca
  yeniden adlandırma diyaloğu; yukarı/aşağı ve kaldır düğmeleri). Her alan satırında: sürükleme tutamacı, yukarı/aşağı
  taşı, "Adıma taşı / Move to step", kaldır; "Zorunlu" işareti ve genişlik işareti (1/2, 1/3, 2/3). Boş adım:
  "Henüz alan yok / No fields yet".
- **Sağ: alan ayarları paneli** (yalnız ≥1024 px genişlikte görünür). Alan seçilmemişse "Alan ayarları — Etiketini,
  kontrollerini, dillerini ve seçeneklerini düzenlemek için bir alan seçin." Alan satırına tıklayınca o alanın ayarları açılır.
- **Form ayarları** sağdan açılan panel (bölümler aşağıda).

## Alanlar

### Yeni form — Boş form
| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Ad | Form adı / Form name (placeholder "örn. Bize Ulaşın") | Input | evet | ≤200; boşsa "Devam etmek için bir form adı girin" | `getByLabel('Form adı')` | Odakta açılır |
| Web adresi | Web adresi / Web address (placeholder `contact-us`) | Input | — | Addan otomatik; yalnız küçük harf, rakam, tire ("Yalnızca küçük harf, rakam ve tire kullanın"), ≤200. Yazarken uygunluk kontrolü: "Uygunluk kontrol ediliyor…", "Bu web adresi kullanılabilir", "Bu web adresi başka bir form tarafından kullanılıyor…" | Önce "Web adresini özelleştir" düğmesine tıkla, sonra `getByLabel('Web adresi')` | Vitrin adresi `/forms/{slug}`. **Oluşturduktan sonra builder'da adres alanı yoktur** — adresi burada doğru ver |

### Alan tipleri (palet)
| Grup | Tip (tr / en) | Zorunlu yapılabilir | Not |
|---|---|---|---|
| Temel | Metin / Text | evet | Kontroller: en az/en fazla uzunluk, desen |
| Temel | Uzun metin / Long text | evet | 〃 |
| Temel | E-posta / Email | evet | **Formda en fazla bir tane**; ikincisi eklenemez (düğme pasif, ipucu "Bir formda yalnızca bir e-posta alanına izin verilir"). Gönderimleri e-postaya göre arama/silme bu alana dayanır |
| Temel | Telefon / Phone | evet | |
| Temel | Sayı / Number | evet | Kontroller: en az / en fazla |
| Temel | Tarih / Date | evet | 〃 |
| Temel | Gizli değer / Hidden value | hayır | "Varsayılan değer / Default value"; ziyaretçi görmez |
| Seçim | Açılır liste / Dropdown | evet | Eklenince 2 varsayılan seçenek ("Seçenek 1/2") gelir |
| Seçim | Tekli seçim / Single choice | evet | 〃 |
| Seçim | Onay kutusu / Checkbox | evet | |
| Seçim | Çoklu seçim / Multiple choice | evet | 2 varsayılan seçenek |
| Seçim | Puanlama / Rating | evet | "Ölçek / Scale": 1-5 veya 1-10 |
| Seçim | Onay metni / Consent | evet | "Onay metni / Consent text" + "Bir sayfaya bağlantı ekle" (sayfa arama). Gönderimde onay metni ve zamanı saklanır |
| Ticaret | Ürün / Product | evet | Ziyaretçinin hangi ürünle ilgili yazdığı; bağlantıdan stok koduyla (SKU) doldurulabilir |
| Ticaret | Sipariş / Order | evet | Sipariş numarası; gönderim kutusunda siparişe bağlantı verir |
| Düzen | Başlık / Heading, Paragraf metni / Paragraph text | — | Yalnız metin |
| Düzen | Ayırıcı / Divider | — | Ayarı yok ("Bu alanın ayarı yok.") |

### Alan ayarları paneli (seçili alan)
| Bölüm | Label (tr / en) | Kontrol | Not |
|---|---|---|---|
| Temel bilgiler / Basics | Etiket / Label | Input | Onay metninde yerine "Onay metni" textarea |
| 〃 | Yer tutucu metin / Placeholder text | Input | Yalnız metin girişli tiplerde |
| 〃 | Yardım metni / Help text | Input | Gizli/düzen tiplerinde yok |
| 〃 | Seçenekler / Options | Satır listesi: "Seçenek etiketi", "Seçenek değeri" (ipucu "Yalnızca sistem içinde kullanılır — alıcılar bunu görmez"), "Seçenek ekle", taşı, kaldır | Aynı değer iki kez olamaz ("İki seçenek aynı değeri paylaşamaz"); en az bir seçenek ("Kaydetmeden önce en az bir seçenek ekleyin") |
| 〃 | Satırdaki genişlik / Width in the row | Select: Tam satır / Yarım satır / Üçte bir / Üçte iki | Masaüstünde yan yana; telefonda her zaman tam satır |
| 〃 | Alıcının adı olarak kullan / Use as the shopper's name | Switch | Giriş yapmış müşteride adı otomatik doldurur; formda yalnız bir alan (açınca diğerinde kapanır) |
| 〃 | Zorunlu / Required | Switch | Gizli değer ve düzen tiplerinde yok |
| Kontroller / Checks | En az uzunluk, En fazla uzunluk, En az, En fazla, Desen (Posta kodu / Vergi numarası / Özel), Özel hata metni | Input/Select | Tipe göre; uygun kontrol yoksa "Bu alan türü için geçerli bir kontrol yok." |
| Diller / Languages | Dil sekmeleri: Etiket, Yer tutucu, Yardım metni, Özel hata metni, Seçenek etiketi | Input | Boş bırakılan dil varsayılan dilin metnini kullanır ("Varsayılan dilin metni kullanılıyor") |
| Bağlantı adresinden doldurma / Link from URL | Switch → "Bağlantıda görünen ad" (küçük harf/rakam/alt çizgi, ≤40, alanlar arasında benzersiz), "Mod": "Doldurulur, alıcı değiştirebilir" / "Gizli, alıcı değiştiremez"; "Örnek bağlantı" + "Bağlantıyı kopyala" | | Kampanya/ürün linkinden alanı önceden doldurur |
| Kurallar / Rules | "Bu alanı yalnızca şu durumda göster…" / "Bu alanı şu durumda gizle…" → Alan (yalnız **önceki** alanlar), Koşul (şuna eşit, eşit değil, içerir, boş, boş değil, en fazla, en az), Değer | Switch + Select + Input | Alanda birden çok kural varsa burada düzenlenemez (bilgi notu) |

### Form ayarları paneli (`Form ayarları / Form settings`)
| Bölüm (tr / en) | Label | Kontrol | Varsayılan / validasyon | Not |
|---|---|---|---|---|
| Gönderim sonrası / After submit | "Bir alıcı bu formu gönderdiğinde": "Bir mesaj göster" / "Bir sayfaya yönlendir" | Radio | mesaj | |
| 〃 | Mesaj / Message (+ dil sekmeleri) | Textarea | şablondan gelir | |
| 〃 | Nereye yönlendirilsin / Where to send them → "Bir sayfa, ürün veya kategori seçin" | Aramalı seçici | — | Sonuçlar Sayfa / Ürün / Kategori etiketli |
| Yanıtların saklanması / Response storage | Yanıtları şu kadar gün sakla / Keep responses for (days) | number | **365**; 7–1095 ("7 ile 1095 arasında bir gün sayısı girin") | Süresi dolan gönderimler kendiliğinden kalıcı silinir — bkz. Yan etkiler |
| Gönder düğmesi / Submit button | Düğme genişliği / Button width: Tam genişlik / Otomatik, sola hizalı | Select | Tam genişlik | |
| Spam koruması / Spam protection | Göndermeden önce bir spam kontrolü iste / Require a spam check before submitting | Switch | kapalı | Kimlik bilgisi yoksa uyarı "Henüz bir spam koruması kimlik bilgisi ayarlanmadı…" + "Spam korumasını ayarla" (Ayarlar'a gider) |
| Arama motoru bilgileri / Search engine details | Sayfa başlığı / Page title, Sayfa açıklaması / Page description (+ dil sekmeleri) | Input/Textarea | — | Form sayfasının SEO bilgisi |
| Formun üstündeki içerik / Content above the form; Formun altındaki içerik / Content below the form | Blok editörü | — | Sayfa blok editörüyle aynı (form bağlamı); "Paket karşılaştırma" bloğu formlarda kullanılamaz |

**Bildirim e-postası:** Formlarda yeni gönderim için bildirim e-postası ayarı yoktur. Yeni gönderimler yalnız gönderim
kutusunda ve listede "N yeni" rozetiyle görünür. Kullanıcı "gönderimler bana e-posta ile gelsin" derse bunun bu
ekrandan yapılamadığını söyle.

## Aksiyonlar
| Düğme (tr / en) | Yer | Etki | Toast / sonuç |
|---|---|---|---|
| Form Ekle / Add Form | Liste | `/content/forms/new` | — |
| Başla / Start (şablon kartı) | Yeni form | **Anında** taslak form oluşturur → builder | Hata: "Formunuz oluşturulamadı. Lütfen tekrar deneyin." |
| Form oluştur / Create form | Boş form | Taslak form oluşturur → builder | "Form oluşturuldu"; adres doluysa "Bu web adresi başka bir form tarafından kullanılıyor…" |
| ⋯ → Düzenle / Edit | Liste | Builder'ı açar | — |
| ⋯ → Kopyala / Duplicate | Liste | **Anında** "{ad} Copy" adlı, adresi `{slug}-copy` olan **taslak** kopya oluşturur (alanlar ve çeviriler kopyalanır, gönderimler kopyalanmaz) | "Form kopyalandı" |
| ⋯ → Yayınla / Publish | Liste (taslakta veya "Taslak değişiklikler" varken) | Kayıtlı taslağı canlıya alır — **onay diyaloğu yok** | "Form yayınlandı"; hata mesajları aşağıda |
| ⋯ → Yayından Kaldır / Unpublish | Liste (yayındaysa) | Diyalog "Bu form yayından kaldırılsın mı?" — "\"{ad}\" mağazanızdan hemen kaldırılacak. Mevcut gönderiler saklanır." | "Form yayından kaldırıldı"; durum Taslak olur |
| ⋯ → Arşivle / Archive (kırmızı) | Liste | Diyalog "Bu form arşivlensin mi?" — "…mağazanızdan kaldırılacak… Bu işlem buradan geri alınamaz." | "Form arşivlendi" |
| Taslağı kaydet / Save draft | Builder | Değişiklikleri **taslak** olarak saklar; yayındaki form değişmez. Değişiklik yoksa veya alan/ayar hatası varsa pasif | "Taslak kaydedildi" |
| Yayınla / Publish | Builder | Önce kaydedilmemiş değişiklikleri kaydeder, sonra **canlıya alır** | "Form yayınlandı" |
| Önizleme / Preview | Builder | Panelde Mobil/Masaüstü vitrin önizlemesi | Kaydedilmemiş değişiklik varsa "Önizlemeyi güncellemek için kaydedin" |
| Mağazada görüntüle / View on store | Builder (yayındaysa) | Vitrindeki formu yeni sekmede açar | — |
| Formlara Dön / Back to Forms | Builder | Kaydedilmemiş değişiklik varsa diyalog "Kaydetmeden çıkılsın mı?" → "Kaydetmeden çık" / "Düzenlemeye devam et" | — |

Yayınlama hata mesajları (toast):
- "Yayınlamadan önce en az bir metin, e-posta veya telefon alanı ekleyin" — formda bu tiplerden hiçbiri yok.
- "Spam kontrolü açıkken yayınlamadan önce Ayarlar'da bir spam koruması kimlik bilgisi oluşturun".
- "Başka bir kullanıcı az önce farklı bir alanı alıcı adı alanı olarak ayarladı…" — iki alan "alıcının adı" işaretli.
- "Paket karşılaştırma blokları formlarda kullanılamaz. Kaydetmek için bloğu kaldırın."
- "Bu web adresi başka bir form tarafından kullanılıyor…", "Bu form artık mevcut değil — silinmiş olabilir.",
  "Bunu yapmaya yetkiniz yok."

## Yan etkiler
- **Yayınla** (listeden veya builder'dan) formu vitrinde `/{locale}/forms/{slug}` adresinde ve onu gömen sayfa/blog
  Form bloklarında **hemen** canlıya alır. Yayındaki formu düzenleyip yalnız "Taslağı kaydet" demek canlıyı değiştirmez
  (listede "Taslak değişiklikler" rozeti); canlıya almak için Yayınla gerekir.
- **Yayınla, saklama süresini mevcut tüm gönderimlere yeniden uygular**: her gönderimin silinme tarihi, gönderim
  tarihi + yeni gün sayısı olarak yeniden hesaplanır. Süre kısaltıldıysa, yeni süreden eski gönderimler kısa süre içinde
  **kalıcı olarak silinir**. Saklama süresi değiştiyse özette eski → yeni değeri ve etkilenebilecek gönderim sayısını
  (gönderim kutusunda tarih filtresiyle sayı) göster; ayrı onay al (kural 5).
- **Yayından Kaldır** formu vitrinden ve onu gösteren Form bloklarından hemen kaldırır; gönderimler kalır.
- **Arşivle** formu vitrinden kaldırır, formun adresini değiştirerek serbest bırakır ve formu yeniden yayınlamayı
  kapatır. Bu forma bağlı Form blokları vitrinde görünmez olur ve yeniden form seçilmesi gerekir. Arşivlenen form
  Durum = Arşivlendi filtresiyle bulunur; geri döndürmek için tek yol "Kopyala" ile yeni bir taslak oluşturmaktır.
- "Bülten + indirim" şablonundan oluşturulan formda pazarlama onayını işaretleyen her gönderen e-posta bültenine
  abone edilir.
- Görünüm (renk/yazı tipi) mağaza markasından gelir; formda ayrı stil ayarı yoktur.

## Tuzaklar
- Şablon kartında "Başla" ve listede "Kopyala" **tek tıkla kayıt oluşturur** — tıklamadan önce onay al (kural 2).
- Listede "Yayınla" onay diyaloğu göstermez; tıklama anında canlıya alır.
- Builder'da "Yayınla" kaydedilmemiş değişiklikleri de kaydedip yayınlar; kullanıcı yalnız "kaydet" dediyse
  "Taslağı kaydet" kullan.
- Bu formu gömen sayfalar varsa (Form bloğu) yayından kaldırma/arşivleme onlara da yansır; özette belirt.
- Alan ayarları paneli dar pencerede görünmez — tarayıcıyı en az 1024 px genişlikte kullan.
- E-posta alanı tektir; ikinci e-posta istenirse "Metin" tipiyle eklenir (gönderen e-postası olarak sayılmaz).
- Alan silmek o alanı kaynak alan kurallarını da siler (uyarı: "Bu alanı kaldırmak, {alan} alanını gösteren kuralı da
  kaldırır."). Adım silinince alanları önceki adıma taşınır; son adım silinemez.
- Formun web adresi oluşturulduktan sonra bu ekrandan değiştirilemez; doğru adresi oluştururken ver.
- Spam koruması anahtarlarını Claude girmez; kimlik bilgisi yoksa kullanıcıyı Ayarlar → Genel → Güvenlik'e yönlendir.

## Doğrulama
1. Oluşturma: builder açılır, başlıkta form adı ve "Taslak" rozeti; listede satır, `/slug` doğru.
2. Kaydet: "Taslak kaydedildi" toast'ı; "Taslağı kaydet" yeniden pasifleşir; yayındaysa listede "Taslak değişiklikler".
3. Yayınla: "Form yayınlandı"; rozet "Yayında", Yayın Tarihi dolu; "Mağazada görüntüle" ile vitrinde form açılır ve
   alanlar beklenen sırada.
4. Yayından kaldır / arşivle: rozet Taslak / Arşivlendi; vitrin adresi artık formu göstermez.
