# Hikâye Anlatımı Bloğu (Storytelling) — blok düzenleyici
- URL: ayrı bir sayfası yoktur; ana sayfa tasarımcısında (`{ADMIN_URL}/design/homepage`) ve sayfa düzenleyicide (`{ADMIN_URL}/content/pages/{id}/edit` → "İçerik" sekmesi) **"Blok Ekle / Add Block" → Gelişmiş / Advanced → "Hikaye Anlatımı / Storytelling"** ile eklenen blok. Ayarları bloğun ayar panelinde (sağdan açılır, telefon genişliğinde tam ekran) düzenlenir.
- Amaç: Müşteri kaydırdıkça sahne sahne ilerleyen, görsel/video ve hareketle anlatılan tam ekran bir hikâye bölümü (ürün tanıtımı, marka hikâyesi, koleksiyon kataloğu). Genel blok mekanikleri: [homepage-builder.md](homepage-builder.md), blok kataloğu: [../../entities/homepage-components.md](../../entities/homepage-components.md).
- Yetki: sayfayı düzenleyen herkes (`content:write`). Blok **mağazanın planına bağlıdır** (aşağıda).
- Veri / API: ayrı ekran API'si yok; blok sayfa kaydıyla birlikte kaydedilir. Başlangıç şablonu seçilince örnek görseller mağazanın medya kitaplığına kopyalanır; editör bloğun toplam ağırlığını canlı hesaplar.

## Ön koşullar ve bağımlılıklar
- **Plan / özellik:** hikâye anlatımı özelliği mağazanın planında (Lead paketinde dahil; diğer paketlerde mağaza bazında tanımlanır) açık olmalı. Kapalıysa blok "Blok Ekle" menüsünde **görünmez**. Plandan sonradan çıkarsa: sayfada blok varken kaydetmek reddedilir ("Hikaye anlatımı blokları paketinizde kullanılamıyor. Kaydetmek için hikaye anlatımı bloğunu kaldırın."), vitrinde blok görünmez.
- Yalnız sayfa düzenleyicide eklenebilir (blog ve form tasarımcısında yok). **Sütunlar içine konamaz** — sayfanın en üst seviyesinde durmalı.
- Sahne görselleri/videoları mağazanın medya kitaplığından seçilir ([../content/media-library.md](../content/media-library.md) "Picker"). Mağazanın kendi medyası dışındaki adresler kaydedilemez.
- Vitrinde ana sayfada gösterilir. Sıradan CMS sayfasında gösterimi doğrulanmadı.

## Yerleşim (ayar paneli, yukarıdan aşağı)
1. **Başlangıç şablonu seçici** (blok ilk eklendiğinde, sahne yokken): başlık "Bir başlangıç şablonu seçin / Pick a starter", not "Her şablonda üç sahne var. Sonradan her görseli ve yazıyı değiştirebilirsiniz." Kartlar (`data-testid="storytelling-starter-<id>"`):
   | Şablon (tr / en) | id | Sahne hareketleri | Vitrinde |
   |---|---|---|---|
   | Ürün tanıtımı / Product reveal | `product-reveal` | Yakınlaş, Yüksel, Geçiş | yerleşik 3D sahne |
   | Marka hikayesi / Brand story | `brand-story` | Geçiş, Yana kay, Yüksel | yerleşik 3D sahne |
   | Koleksiyon kataloğu / Collection lookbook | `collection-lookbook` | Yana kay, Yakınlaş, Geçiş | yerleşik 3D sahne |
   Bir şablon seçmek **üç sahneyi hazır başlık ve metinlerle** (arayüz dilinde), kapak görselini ve telefon kapak görselini **örnek görsellerle** doldurur. Seçim sürerken kartlar disabled olur. Örnek görseller eklenemezse şablon görselsiz açılır ve uyarı çıkar ("Örnek görseller eklenemedi — Şablon görselsiz açıldı. Her sahne için kendi görsellerinizi seçin."). Örnek görseller medya kitaplığına da eklenir (seçimle kalıcı bir yan etki).
2. **Sahneler / Scenes**: sahne kartları (`data-testid="storytelling-scene-<n>"`), her birinde yukarı/aşağı taşı ve kaldır ikon butonları, altta **"Sahne ekle / Add a scene"**.
3. **Kapak görseli / Cover image** ve **Telefon kapak görseli / Phone cover image**.
4. **Küçük ekranlarda / On small screens** seçici, **Yumuşak kaydırma** switch'i, **"Kendi renklerimi seçeceğim"** switch'i (+ renkler).
5. **Boyut uyarısı** (sahne eklendikten sonra): blok ağırlığına göre bilgi/uyarı kutusu.

## Alanlar
| Bölüm | Label (tr / en) | Kontrol | Zorunlu | Kural / varsayılan | Locator ipucu |
|---|---|---|---|---|---|
| Sahne | Görsel veya video / Picture or video | medya seçici | evet | kitaplıktan görsel ya da video; "Kitaplığınızdan bir görsel veya video seçin." | kartın içinde medya seçici |
| Sahne | Göremeyenler için açıklayın / Describe it for people who cannot see it | Input | hayır | ≤200 karakter | label |
| Sahne | Başlık / Heading | Input | hayır | ≤120 karakter | label |
| Sahne | Yazı / Text | Textarea | hayır | ≤512 karakter | label |
| Sahne | Hareket / Movement | Select | — | varsayılan "Geçiş / Transition"; Yakınlaş / Zoom in, Yüksel / Rise, Yana kay / Slide across, Geçiş / Transition, Hareketsiz / Still | combobox "Hareket" |
| Sahne listesi | Sahne ekle / Add a scene | buton | — | **1 ile 12 sahne**; 12'de buton disabled ve not "Bir hikayede en fazla 12 sahne olabilir."; tek sahne kalınca kaldır butonu disabled | `getByRole('button',{name:'Sahne ekle'})` |
| Sahne | {n}. sahneyi kaldır / yukarı taşı / aşağı taşı | ikon buton (aria-label) | — | sıra değişince sahne kimlikleri korunur | aria-label |
| Kapak | Kapak görseli / Cover image (+ "Kapak görselini göremeyen kişiler için açıklayın") | medya seçici + Input | **evet** | Hikâye yüklenirken ve küçük ekranlarda gösterilir. İlk sahne görseli seçilince, siz başka bir görsel seçmediyseniz kapak ona **otomatik uyar**; ilk sahnenin açıklaması da kapağa kopyalanır | label |
| Kapak | Telefon kapak görseli / Phone cover image (+ açıklama) | medya seçici + Input | hayır | Küçük ekranlarda kapak görselinin yerine gösterilir; boşsa her ekranda kapak görseli kullanılır | label |
| Davranış | Küçük ekranlarda / On small screens | Select (`#storytelling-mobile-fallback`) | — | varsayılan "Kapak görselini göster"; diğer: "Tüm sahneleri alt alta göster" | combobox |
| Davranış | Yumuşak kaydırma / Smooth scrolling | Switch (`#storytelling-smooth-scroll`) | — | kapalı | switch |
| Renk | Kendi renklerimi seçeceğim / Choose my own colours | Switch (`#storytelling-custom-colors`) | — | kapalı = hazır koyu yarı saydam zemin. Açılınca Panel rengi `#ffffff`, Yazı rengi `#111111` gelir | switch |
| Renk | Panel rengi / Panel colour; Yazı rengi / Text colour | renk seçici (`#storytelling-panel-color`, `#storytelling-text-color`) | — | altı haneli hex; panel **opak** çizilir. İkisi arasındaki kontrast **en az 4,5:1** olmalı: altında sarı uyarı "Bu renkler birlikte zor okunuyor ({oran}:1)…"; uyarıyla kaydetmek reddedilir | renk input'ları |

## Boyut sınırı ve uyarılar
Editör, bloktaki tüm görsel/videoların boyutunu (ve seçili yerleşik 3D şablonun sabit dosyasını) toplayıp bloğun altında gösterir:
| Toplam | Gösterim |
|---|---|
| < 800 KB | uyarı yok |
| 800 KB – 1,5 MB | bilgi: "Bu hikaye {boyut} boyutunda. Yavaş bağlantılarda geç açılabilir." |
| 1,5 MB – 3 MB | uyarı: "Bu hikaye ağır: {boyut}. Telefonlarda geç açılabilir. Mümkünse daha küçük resim veya videolar kullanın." |
| **> 3 MB** | kırmızı: "Bu hikaye {boyut} boyutunda ve 3 MB sınırını aşıyor. Kaydetmek için daha küçük resim veya videolar kullanın ya da bazılarını kaldırın." — **kayıt reddedilir** ("Bu hikaye anlatımı bloğu 3 MB sınırını aşıyor, bu yüzden kaydedilemiyor…") |
Boyutu bilinmeyen (kitaplıkta kaydı olmayan) görsel/video varsa ek not: "{n} resim veya videonun boyutu kontrol edilemedi. Boyutları toplama dahil değil." Tam 3 MB hâlâ kaydedilir.

## Kaydetmeden önceki kontroller
Kaydet/Yayınla basıldığında ekran, sunucuya gitmeden eksikleri **adıyla** bildirir (toast, en fazla 3 satır + "Düzeltilecek N sorun daha var."): 
- Sahnesi olmayan blok → "Bir hikaye anlatımı bloğunda henüz sahne yok. Bloğu açıp bir başlangıç şablonu seçin."
- Görseli olmayan sahne → "{n}. sahnede görsel veya video yok…"
- Kapak görseli yok → "Hikaye anlatımı bloğunda kapak görseli yok…"
- Kontrastı yetersiz renkler → "Hikaye anlatımı yazı ve panel renkleri okunamayacak kadar birbirine yakın…"
Sayfada birden çok hikâye bloğu varsa mesaja "(sayfadaki {n}. hikaye bloğu)", çeviri dilindeyse "(dil: {dil})" eklenir.

## Çeviri
Hikâye bloğu da dil başına ayrı blok listesinde yaşar; "Senkronize et..." sahneleri **sahne kimliğine göre** eşler (sırayı değiştirmek çevirileri bozmaz). Varsayılan dilde hikâye bloğu varken, yayınlanmış ve bloklu çevirisi olmayan her dil için ekranda uyarı çıkar: "Bu dillerde varsayılan dildeki hikayeniz gösterilecek: {dil} için içeriği olan yayınlanmış bir sürüm henüz yok."

## Vitrinde nasıl görünür
- Ana sayfanın ilk görünür bloğu hikâye bloğuysa tam genişlikte, ekrana sabitlenen sahnelerle açılır; kaydırdıkça sahneler ve hareketler değişir. Yerleşik 3 şablondan biri seçiliyse üç sahne görseli 3 boyutlu şablon sahnesinin içine yerleşir; şablon kimliği başka ise (ör. eski bloklar) görseller düz sahnede hareket eder.
- 3 boyut desteklenmeyen tarayıcıda, "hareketi azalt" ayarı açık cihazda, yükleme zaman aşımında ve **768 px altı ekranlarda** 3 boyut yüklenmez: "Küçük ekranlarda" seçimine göre kapak görseli (varsa telefon kapak görseli) ya da tüm sahneler alt alta gösterilir; metinler aynıdır.
- Panel renkleri seçildiyse yazı opak panel üzerinde, seçilmediyse yarı saydam koyu zemin üzerinde görünür.

## Aksiyonlar
Bloğun kendi Kaydet butonu yoktur; her alan değişikliği anında forma yazılır. Kaydetme/yayınlama sayfanın butonlarıyla yapılır ([homepage-builder.md](homepage-builder.md) "Onay zamanlaması").

## Yan etkiler
- Başlangıç şablonu seçimi medya kitaplığına örnek görseller ekler (anında kalıcı).
- Yayında blok ağırlığı hız kaygısı yaratır; 1,5 MB üstü blokta kullanıcıya uyarıyı ilet.

## Tuzaklar
- Blok eklendiğinde ayar paneli otomatik açılmaz (diğer bloklar gibi); çift tıkla ya da dişli ikonuyla aç, sonra şablon seç. Şablon seçmeden kaydetmek reddedilir.
- Plan kapalıysa blok menüde yoktur; "neden göremiyorum" sorusunun cevabı plandır.
- Kapak görseli ilk sahne görselinden otomatik gelir; sahne görselini sonradan değiştirince kapak, siz özel seçmediyseniz onunla birlikte değişir.
- Kontrast uyarısı çıkan renklerle kaydedilemez; "Kendi renklerimi seçeceğim"i kapatmak hazır zemine döndürür.
- Sütunlar bloğunun içine taşımaya çalışmak reddedilir ("Hikaye anlatımı bloğu Sütunlar içine yerleştirilemez…").

## Doğrulama
1. Kayıttan sonra sayfayı yenile; sahne sayısı, sıra, başlık/metin, kapak görselleri ve renkler korunmuş olmalı; boyut kutusu beklenen bandı göstermeli.
2. Yayınladıysan vitrinde ana sayfayı aç (masaüstü ve 375 px): sahneler kaydırmayla ilerlemeli; telefon genişliğinde seçtiğin yedek (kapak ya da alt alta sahneler) görünmeli.
3. Çoklu dilde uyarı kutusunun beklenen dilleri listelediğini kontrol et.
