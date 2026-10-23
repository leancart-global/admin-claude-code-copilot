# URL Yönlendirmeleri (Redirects) — liste, oluştur, düzenle

- URL: {ADMIN_URL}/seo/redirects (liste) · {ADMIN_URL}/seo/redirects/new (oluştur) · {ADMIN_URL}/seo/redirects/{id}/edit (düzenle)
- Menü yolu: Sol menü "İçerik / Content" → "Yönlendirmeler / Redirects".
- Sayfa başlığı: liste "Yönlendirmeler / Redirects", açıklama "SEO ve site taşımaları için URL yönlendirmelerini yönetin / Manage URL redirects for SEO and site migrations". Oluştur: "Yönlendirme Oluştur / Create Redirect" ("Yeni bir URL yönlendirme kurali oluşturun"). Düzenle: "Yönlendirme Düzenle / Edit Redirect" ("Mevcut bir URL yönlendirme kuralini düzenleyin").
- Amaç: Vitrindeki eski bir adrese gelen ziyaretçiyi (ve arama motorunu) başka bir mağaza içi adrese göndermek: kampanya bitti, ürün/kategori URL'si değişti, sayfa taşındı, site taşıması.
- Entity: [../../entities/url-redirect.md](../../entities/url-redirect.md). Playbook: [../../../playbooks/redirect-create.md](../../../playbooks/redirect-create.md).
- Yetki: liste `content:read`; "Yeni Yönlendirme" / "CSV Aktar" butonları ve oluşturma `content:create` (arayüz) + `content:write` (sunucu); düzenleme ve aktif/pasif `content:update` (arayüz) + `content:write` (sunucu); silme `content:delete`.
- Veri / API (public): `GET /seo/redirects` (`search`, `isActive`, `type`, `sortBy`, `sortOrder`, sayfa 20), `GET/PUT/DELETE /seo/redirects/{id}`, `POST /seo/redirects`, `PATCH /seo/redirects/{id}/toggle`, `POST /seo/redirects/bulk-import`, `GET /seo/redirects/statistics`, `POST /seo/redirects/test`.

Panelde **yok**: dışa aktarma (export), toplu aktif/pasif, içe aktarmada üzerine yazma.

## Ön koşullar ve bağımlılıklar
- Ön koşul kayıt yok. Hedef adresin vitrinde gerçekten açıldığını (ürün, kategori, CMS sayfası, blog) önceden kontrol et — sistem hedefin var olup olmadığına bakmaz.
- **Ürün ya da kategori slug'ı değişince otomatik yönlendirme oluşmaz.** Ürün çevirisinde URL Kısayolu ([../products/product-edit.md](../products/product-edit.md)) ya da kategori "URL Kısaltması" ([../categories/category-edit.md](../categories/category-edit.md)) değiştirilecekse, eski adres için yönlendirmeyi bu ekrandan ayrıca planla (ayrı kayıt, ayrı onay). Kategori silme (arşivleme) de bu listeye kayıt eklemez.
- Store view (dil) öneki: kurallar **öneksiz** yazılır (`/kampanya`, `/tr/kampanya` değil). Kural tüm store view'larda geçerlidir; ziyaretçi `/en/kampanya`'ya gelirse `/en/indirim`'e gider. Bkz. [../settings/store-views.md](../settings/store-views.md).

## Yerleşim

### Liste
1. Başlık + sağda "CSV Aktar / Import CSV" (outline, yükleme ikonu) ve "Yeni Yönlendirme / New Redirect".
2. İstatistik kutuları: "Toplam", "Aktif", "Pasif", "301 (Kalıcı)", "302 (Geçici)", "Toplam Isabet / Total Hits".
3. Filtre kartı: arama "Yönlendirme ara... / Search redirects..." (kaynak, hedef ve notlarda arar), durum Select ("Tüm Durumlar / Aktif / Pasif"), tip Select ("Tüm Tipler / 301 Kalıcı / 302 Geçici").
4. Seçim varken toplu işlem kartı: "{count} yönlendirme seçildi", "Seçimi Temizle / Clear Selection", "Seçilenleri Sil / Delete Selected".
5. Tablo: başlıkta "tümünü seç" checkbox; "Kaynak Yol / Source Path" (sıralanabilir; regex ise "Regex" rozeti; kopyala ikonu), "Hedef / Destination", "Tip / Type" (301/302 rozeti), "Durum / Status" (Active/Inactive rozeti), "İsabet / Hits" (sıralanabilir), "Oluşturulma / Created" (sıralanabilir, varsayılan yeniden eskiye), "⋯" (sr-only "Menüyü aç / Open menu").
6. Satır menüsü: "Düzenle / Edit", "Etkinleştir / Activate" ya da "Devre Dışı Bırak / Deactivate", "Kaynak Yolu Kopyala / Copy Source Path", "Sil / Delete".
7. Boş: "Yönlendirme bulunamadı / No redirects found" + "Başlamak için ilk yönlendirmenizi oluşturun.". Yükleniyor: "Yönlendirmeler yükleniyor...".
8. Sayfalama (birden çok sayfa varsa): "{total} yönlendirmeden {from} - {to} arasi gösteriliyor", Önceki/Sonraki.

### Oluştur / Düzenle formu
1. "← Yönlendirmelere Dön / Back to Redirects", başlık + açıklama.
2. Kart "Yönlendirme Yapılandırması / Redirect Configuration" ("Bu yönlendirme için kaynak ve hedef URL'leri tanımlayın"): kaynak ve hedef dolunca önizleme şeridi `kaynak → hedef [301]`; Kaynak Yol + "Test Et / Test" butonu; Hedef Yol; Yönlendirme Tipi.
3. Kart "Ayarlar / Settings" ("Ek yönlendirme seçenekleri"): Aktif, Regex Deseni ("Gelişmiş" rozeti), Öncelik, Notlar.
4. Alt: "İptal / Cancel", "Yönlendirme Oluştur / Create Redirect" ya da "Yönlendirmeyi Güncelle / Update Redirect".
- Düzenle açılırken "Yönlendirme yükleniyor..."; kayıt bulunamazsa hata toast'u ve listeye dönüş.

### CSV içe aktarma diyaloğu ("Toplu Yönlendirme İçe Aktarımı / Bulk Import Redirects")
- Açıklama: "CSV dosyasından veya doğrudan CSV içeriği yapıştırarak birden fazla yönlendirmeyi içe aktarın."
- Sekmeler: "CSV Yapıştır / Paste CSV" (textarea + "Şablonu İndir" + "CSV'yi Ayrıştır / Parse CSV"), "Dosya Yükle / Upload File" (dropzone "Buraya bir CSV dosyası bırakın veya tıklayarak seçin", yalnız .csv; seçilen dosya okunup yapıştır sekmesine aktarılır ve önizlenir).
- Biçim: `fromPath,toPath,type,notes` — ilk satır başlık olabilir; `type` 301/302 (boşsa 301); `notes` opsiyonel.
- "Doğrulama Hataları" kutusu (satır bazlı: "Satır {row}: Kaynak yol eksik", "…Hedef yol eksik", "…Kaynak ve hedef yol aynı olamaz"), önizleme tablosu ("İçe aktarılmaya hazır {count} yönlendirme", ilk 10 satır + "Ve {count} tane daha..."), sonuç ("{count} başarılı", "{count} başarısız").
- Butonlar: "İptal", "{count} Yönlendirmeyi İçe Aktar / Import {count} Redirect(s)".

## Alanlar (oluştur / düzenle)
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon / varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Kaynak Yol * / Source Path * | Input + "Test Et" butonu | evet | Regex kapalıyken `/` ile başlamalı ("Yol / ile başlamalıdır"); hedefle aynı olamaz; ≤2048. Placeholder "/eski-sayfa" (regex açıkken "^/eski-(.*)$") | erişilebilir adı placeholder'dır: `getByRole('textbox', { name: '/eski-sayfa' })` (en `/old-page`); label ile bulunmaz | Mağaza içinde **benzersiz** (pasif kayıtlar dahil). Alan adı/https yazma; yalnız yol. Sorgu dizesi (`?utm=…`) ve sondaki `/` eşleşmede yok sayılır. Düzenlemede değiştirilebilir |
| Hedef Yol * / Destination Path * | Input | evet | Tek `/` ile başlamalı ve kendi sitende kalmalı: tam web adresi (`https://…`), `//` ile başlayan ya da `\` içeren hedef reddedilir; ≤2048 | `getByLabel('Hedef Yol *')`, placeholder `/yeni-sayfa` | Hedefte sorgu dizesi yoksa ziyaretçinin sorgu dizesi korunur. Regex kuralında `$1` gibi yakalama grubu kullanılabilir |
| Yönlendirme Tipi / Redirect Type | shadcn Select | — | varsayılan "301 - Kalıcı Yönlendirme" | `getByLabel('Yönlendirme Tipi')` | "301 - Kalıcı Yönlendirme / Permanent", "302 - Geçici Yönlendirme / Temporary". Açıklama: "Kalıcı taşımalar için 301 (SEO dostu), geçici yönlendirmeler için 302" |
| Aktif / Active | Switch | — | açık | `getByRole('switch')` ("Aktif" satırı) | "Bu yönlendirmeyi etkinleştir veya devre dışı bırak" |
| Regex Deseni / Regex Pattern ("Gelişmiş") | Switch | — | kapalı | "Regex Deseni" satırındaki switch | Kaynak Yol düzenli ifade olur. Aşırı karmaşık desen reddedilir. Yalnız kullanıcı açıkça desen isterse |
| Öncelik / Priority | number Input | — | 0; aralık 0–1000 | `getByLabel('Öncelik')` | "Yüksek öncelikli yönlendirmeler önce işlenir (0-1000)". Yalnız birden çok **regex** kuralı aynı yolu yakaladığında anlamlıdır; birebir (regex olmayan) eşleşme her zaman önce gelir. Sıra yönü canlıda doğrulanmadı |
| Notlar / Notes | Textarea | hayır | ≤500 | placeholder "Bu yönlendirme hakkında not ekleyin..." | "Referans için dahili notlar (kullanıcılara görünmez)". Ne için açıldığını yaz (ör. "Yaz kampanyası bitti – 2026-10") |

## Aksiyonlar
| Buton | Ne olur | Toast / mesaj |
|---|---|---|
| Test Et (form) | **Salt okunur**: girilen kaynak yolun mevcut aktif kurallardan biriyle eşleşip eşleşmediğini gösterir; isabet sayacını artırmaz | sarı "Yol eşleşiyor! Yönlendirildiği yer: {toPath}" (zaten yönlendirilmiş) · yeşil "Bu yolla eşleşen mevcut yönlendirme yok." · boş: "Test etmek için bir kaynak yol girin." · hata: "Bu yönlendirmeyi şu anda test edemedik." |
| Yönlendirme Oluştur | Kayıt oluşur, listeye döner | "Yönlendirme başarıyla oluşturuldu" |
| Yönlendirmeyi Güncelle | Kayıt güncellenir, listeye döner | "Yönlendirme başarıyla güncellendi" |
| ⋯ → Etkinleştir / Devre Dışı Bırak | **Diyalogsuz, anında** aktiflik değişir | "Yönlendirme aktif edildi." / "Yönlendirme devre dışı bırakıldı." · hata "Yönlendirme durumu güncellenemedi." (ör. etkinleştirmek döngü oluşturuyorsa) |
| ⋯ → Sil → "Yönlendirme Silinsin mi?" ("{path} yönlendirmesi kalıcı olarak silinecek. Bu işlem geri alınamaz.") → "Sil" | Kalıcı silme | "Yönlendirme başarıyla silindi" |
| Seçilenleri Sil | **Onay diyaloğu yok** — seçili tüm kayıtlar tıklanır tıklanmaz kalıcı silinir | "{count} yönlendirme silindi." / kısmi: "{successful} silindi, {failed} başarısız." |
| CSV Aktar → Ayrıştır → İçe Aktar | Ayrıştır kalıcı değildir (önizleme). "İçe Aktar" satırları kaydeder | "İçe Aktarma Başarılı" / "Kısmi İçe Aktarma" / "İçe Aktarma Başarısız" |
| Kaynak Yolu Kopyala, sıralama, filtre | Salt okunur | — |

Sunucu hata mesajları (alan altında ya da formun altında):
| Kod | Mesaj (tr) | Alan |
|---|---|---|
| `ERR_REDIRECT_ALREADY_EXISTS` | "Bu kaynak yoldan bir yönlendirme zaten var. Mevcut yönlendirmeyi düzenleyin veya farklı bir kaynak yol seçin." | Kaynak Yol |
| `ERR_REDIRECT_LOOP` | "Bu yönlendirme başka bir yönlendirmeyle çakışıyor ve döngü oluşturuyor. Lütfen mevcut yönlendirmelerinizi kontrol edip tekrar deneyin." | Hedef Yol |
| `ERR_REDIRECT_INVALID_TARGET` | "Hedef yol tek bir / ile başlamalı ve kendi sitenizde olmalı. Tam bir web adresi olamaz, // ile başlayamaz veya \ içeremez." | Hedef Yol |
| `ERR_REDIRECT_PATTERN_UNSAFE` | "Bu kalıp çok karmaşık ve sitenizi yavaşlatabilir. Daha basit bir kalıp deneyin." | Kaynak Yol |
| `ERR_REDIRECT_NOT_FOUND` | "Bu yönlendirme artık mevcut değil. Silinmiş olabilir…" | form altı |
Diğer: "Yönlendirme kaydedilemedi. Lütfen tekrar deneyin." (toast).

## Onay zamanlaması (kural 2/5/6)
- **Oluştur / Güncelle** → kalıcı ve **vitrine canlı** yansır (taslak yok). Özet: kaynak → hedef, tip, aktif, regex, öncelik, not; Test Et sonucu; "hedef vitrinde açılıyor mu" kontrolünün sonucu.
- **Etkinleştir / Devre Dışı Bırak (satır menüsü) → diyalogsuz, anında.** Menü öğesine dokunmadan **önce** onay al.
- **Sil (tekil)** → geri alınamaz; diyalog var ama onay diyalogdan önce alınır. Özete o adresin isabet sayısını yaz (trafik alan bir adres silinince ziyaretçi 404 görebilir).
- **Seçilenleri Sil → onay diyaloğu olmadan toplu, geri alınamaz silme.** Checkbox'ları işaretlemeden önce silinecek kayıtları (kaynak → hedef, isabet) ve **sayısını** tablo halinde göster; ayrı, açık onay al. Tercihen tekil silme kullan.
- **CSV İçe Aktar** → toplu oluşturma: önizlemedeki satır sayısı + ilk satırlar + "var olan kaynak yollar atlanır" notuyla özet, ayrı onay. "CSV'yi Ayrıştır" kalıcı değildir.
- Dış sisteme yazma yok; müşteriye bildirim yok.

## Yan etkiler
- **Vitrine yansıma:** kayıt/değişiklik/silme sonrası genelde hemen; tarayıcı ve ara önbellekler nedeniyle en geç **~5 dk** içinde. Kalıcı (301) yönlendirmeyi arama motorları ve tarayıcılar uzun süre hatırlayabilir; geçici kampanyalarda 302 seç.
- Yönlendirme, kaynak adreste gerçek bir sayfa olsa bile **önce** çalışır (sayfa açılmaz).
- Sepet, ödeme, hesap/giriş sayfaları, medya ve statik dosyalar, `robots.txt`/`sitemap` adresleri yönlendirilmez — bu yollar için kural yazılsa da etkisizdir.
- Aktif, regex olmayan kaynak yollar site haritasından (`sitemap.xml`) çıkarılır.
- "İsabet" sayacı vitrindeki gerçek ziyaretlerde artar (Test Et artırmaz).
- Pasif yönlendirme hiç uygulanmaz ama kaynak yolu doldurmaya devam eder (aynı kaynaktan yenisi açılamaz → mevcut olanı düzenle/etkinleştir).

## Tuzaklar
- **Zincir ve döngü yasak:** A→B kaydedilemez eğer (a) B zaten aktif bir kuralın kaynağıysa, ya da (b) aktif bir kural zaten A'ya yönlendiriyorsa (X→A). Çözüm zinciri düzleştirmek: eski kuralın hedefini son adrese çevir (X→B), sonra gerekiyorsa A→B'yi oluştur. Karşılaştırmada sondaki `/`, sorgu dizesi ve URL kodlaması (`%C3%BC` = `ü`) yok sayılır.
- Kaynak ve hedef aynı olamaz (`/indirim` → `/indirim/` de aynı sayılır).
- Hedef yalnız mağaza içi yol: dış siteye (`https://…`) yönlendirme yapılamaz.
- Store view önekini kaynağa yazma (`/tr/…`); yalnız varsayılan olmayan bir dil için özel kural gerekiyorsa kullanıcıya sor (doğrulanmadı).
- CSV içe aktarmada: var olan kaynak yollar **atlanır** (güncellenmez); `/` ile başlamayan kaynak yollara `/` eklenir; tüm satırlar aktif, regex değil ve varsayılan öncelikle oluşur; satır başına zincir/hedef kuralları aynen geçerli, kurala uymayan satırlar "başarısız" sayılır.
- Durum rozeti dilden bağımsız "Active/Inactive" yazabilir; locator'da metne değil rozetin varlığına bak.
- Liste aramasında her tuş yeniden sorgular; aranacak yolu `fill` ile tek seferde gir, ~300 ms bekle.

## Doğrulama
1. Toast + listeye dönüş; aramada kaynak yolu gir → satırda Hedef, Tip, Durum, Regex rozeti.
2. Formda (yeni sekmede ya da düzenle ekranında) "Test Et" → "Yol eşleşiyor! Yönlendirildiği yer: {hedef}".
3. Vitrinde kaynak adresi aç (~5 dk içinde) → hedef adrese düştüğünü ve hedefin açıldığını gör.
4. İstatistik kutularında Toplam/Aktif sayısı beklenen kadar değişti mi; içe aktarmada eklenen sayı aramayla kontrol edilir.
