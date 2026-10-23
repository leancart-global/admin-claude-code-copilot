# Entity: Form ve Form Gönderimi (Form, Submission)

Ziyaretçinin vitrinde doldurduğu form (iletişim, ürün sorusu, iade, bülten, anket…) ve her doldurmadan oluşan
gönderim kaydı. Mağaza (tenant) genelinde tanımlıdır.

- Ekranlar: [../screens/content/forms.md](../screens/content/forms.md) (liste, yeni form, builder),
  [../screens/content/form-submissions.md](../screens/content/form-submissions.md) (gelen kutusu).
- Vitrin: `{STOREFRONT_URL}/{locale}/forms/{slug}`; ayrıca sayfa/blog içinde "Form" bloğu
  ([homepage-components.md](homepage-components.md) §16).
- API: `GET/POST /forms`, `GET /forms/presets`, `GET /forms/{id}`, `PUT /forms/{id}/draft`, `POST /forms/{id}/publish`,
  `POST /forms/{id}/unpublish`, `POST /forms/{id}/duplicate`, `DELETE /forms/{id}` (= arşivle);
  gönderimler `GET /forms/{id}/submissions`, `GET/PATCH /forms/{id}/submissions/{submissionId}`, CSV dışa aktarma,
  e-postaya göre silme önizleme + silme. Değişiklikler yalnız UI'dan yapılır (CLAUDE.md kural 3).

## Form alanları

| Alan | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|
| Ad (`name`) | evet | — | 1–200 |
| Web adresi (`slug`) | evet | addan | Küçük harf, rakam, tire; 1–200; mağaza içinde benzersiz (çakışma → "Bu web adresi başka bir form tarafından kullanılıyor"). UI'da yalnız oluştururken girilir |
| Durum | — | Taslak | `draft` Taslak / `published` Yayında / `archived` Arşivlendi |
| Taslak değişiklikler | — | — | Yayındaki formda kaydedilmiş ama yayınlanmamış değişiklik varsa işaret |
| Yayın tarihi | — | — | Son yayınlama anı |
| Adımlar | en az 1 | "Adım 1" | Çok adımlı form; alanlar adımlara dağıtılır |
| Alanlar | yayın için en az 1 | — | Tipler ve kurallar aşağıda |
| Gönderim sonrası | — | mesaj | "Bir mesaj göster" (dil başına metin) veya "Bir sayfaya yönlendir" (sayfa/ürün/kategori) |
| Yanıtları saklama süresi (gün) | — | **365** | 7–1095 |
| Gönder düğmesi genişliği | — | Tam genişlik | Tam genişlik / Otomatik, sola hizalı |
| Spam koruması | — | kapalı | Açıksa yayın için mağazada spam koruması kimlik bilgisi tanımlı olmalı |
| SEO | — | — | Sayfa başlığı, açıklaması (dil başına) |
| Üst / alt içerik blokları | — | [] | Sayfa blok editörü; "Paket karşılaştırma" bloğu kullanılamaz |
| Çeviriler | — | — | Alan metinleri, gönderim sonrası mesaj ve SEO dil başına; boş dil varsayılan dili kullanır |

### Alan tipleri
`text` Metin, `textarea` Uzun metin, `email` E-posta, `phone` Telefon, `number` Sayı, `date` Tarih, `hidden` Gizli değer,
`select` Açılır liste, `radio` Tekli seçim, `checkbox` Onay kutusu, `checkboxGroup` Çoklu seçim, `rating` Puanlama (1-5 /
1-10), `consent` Onay metni, `product` Ürün, `order` Sipariş, `heading` Başlık, `paragraph` Paragraf metni, `divider` Ayırıcı.

| Kontrol | Uygulandığı tipler |
|---|---|
| Zorunlu | Gizli değer ve düzen tipleri (başlık, paragraf, ayırıcı) dışındaki tümü |
| En az / en fazla uzunluk, Desen (posta kodu, vergi no, özel) | Metin, Uzun metin, E-posta |
| En az / en fazla değer | Sayı, Tarih (Puanlama ölçekle sınırlı) |
| Seçenekler (en az 1, değerler benzersiz) | Açılır liste, Tekli seçim, Çoklu seçim |

Alan başına ayrıca: etiket, yer tutucu, yardım metni, satır genişliği (tam / 1/2 / 1/3 / 2/3), "alıcının adı olarak
kullan" (formda en fazla bir alan), bağlantı adresinden doldurma (parametre adı küçük harf/rakam/alt çizgi ≤40, alanlar
arasında benzersiz; "doldurulur" veya "gizli" mod), göster/gizle kuralı (yalnız önceki bir alana bağlı).

## İş kuralları
- **Formda en fazla bir E-posta alanı** olur; gönderen e-postası, gönderim aramaları ve e-postaya göre silme bu alana dayanır.
- **Yayın şartları**: en az bir alan ve bunlardan en az biri Metin, E-posta veya Telefon; tek e-posta alanı; en fazla
  bir "alıcının adı" alanı; geçerli desenler; spam koruması açıksa kimlik bilgisi tanımlı. Aksi halde yayın reddedilir.
- **Taslak / yayın ayrımı**: Builder'da kaydedilen her şey taslaktır. Vitrin, son yayınlanan sürümü gösterir; Yayınla
  taslağı canlıya kopyalar.
- **Yayından kaldırma** durumu Taslak'a çevirir, vitrinden hemen kaldırır; içerik ve gönderimler korunur.
- **Arşivleme** silme yerine geçer: kayıt silinmez, adresi serbest bırakılır (değiştirilir), yeniden yayınlanamaz;
  geri dönüş yalnız "Kopyala" ile yeni taslak oluşturmaktır.
- **Kopyala**: "{ad} Copy", adres `{slug}-copy` (çakışırsa `-copy-1`…), durum Taslak; gönderimler kopyalanmaz.
- Form bloğu formu **adresiyle** gösterir: form yayından kalkarsa/arşivlenirse blok vitrinde görünmez.
- "Bülten + indirim" şablonuyla oluşturulmuş formda pazarlama onayını işaretleyen gönderen e-posta bültenine abone edilir.
- Şablonlar (8 adet) ve alanları: [../screens/content/forms.md](../screens/content/forms.md) "Yeni form".
- Yeni gönderim için e-posta bildirimi ayarı yoktur.

## Gönderim (Submission)

| Alan | Not |
|---|---|
| Yanıtlar | Alan başına değer; formdaki alan sonradan silinse de gönderimde etiketiyle kalır |
| E-posta | Formdaki E-posta alanından |
| Durum | `new` Yeni (varsayılan) → `in-progress` İşlemde → `closed` Kapatıldı; Kapatıldı → İşlemde ile yeniden açılır |
| Notlar | Ekip notları; eklenir, düzenlenmez |
| Onaylar | Onay metni + onay zamanı |
| Detaylar | Gönderim tarihi, dil, mağaza görünümü, yönlendiren, iniş sayfası, kampanya (UTM) |
| İlgili kayıt | Ürün (ürün alanından / bağlantıdaki SKU'dan) veya sipariş |
| Silinme tarihi | Gönderim tarihi + formun saklama süresi; dolunca kendiliğinden kalıcı silinir |

- Saklama süresi değişip form **yayınlanınca**, o formun tüm mevcut gönderimlerinin silinme tarihi yeniden hesaplanır.
- **E-postaya göre silme** mağazadaki tüm formlarda o e-postaya ait gönderimleri kalıcı siler (KVKK/GDPR silme talebi);
  önce sayı önizlenir.
- Gönderimler kişisel veridir: Claude içeriklerini sohbete aktarmaz, yalnız sayı/özet verir
  ([../screens/content/form-submissions.md](../screens/content/form-submissions.md) "Kişisel veri kuralı").

## Silme
- Form kalıcı silinmez; "Arşivle" kullanılır (kural 5: tek tek, etkilenen gönderim sayısı ve onu gömen sayfalarla onay).
- Gönderim tek tek silinemez; yalnız saklama süresiyle veya e-postaya göre silme ile kalkar.
