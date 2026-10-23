# Kuponlar (Coupons) — liste, oluştur, detay, düzenle

- URL'ler:
  - Liste: `{ADMIN_URL}/marketing/coupons` (filtreler URL'de: `?search=…&status=…&type=…&page=…`)
  - Oluştur: `{ADMIN_URL}/marketing/coupons/new`
  - Detay: `{ADMIN_URL}/marketing/coupons/{id}`
  - Düzenle: `{ADMIN_URL}/marketing/coupons/{id}/edit`
  - Toplu üretim ayrı harita: [coupon-bulk.md](coupon-bulk.md)
- Menü yolu: Sol menü "Pazarlama / Marketing" → "Kuponlar / Coupons".
- Sayfa başlığı: liste kartı "Kuponlar / Coupons" (yanında toplam sayı rozeti), açıklama "İndirim kuponları oluşturun, kullanım durumunu takip edin. / Create discount coupons and track redemptions."; oluştur sayfası "Yeni Kupon / New Coupon"; detay ve düzenle sayfası başlığı kupon kodudur (düzenlede altında "Düzenle / Edit").
- Amaç: Müşterinin sepette gireceği **kodları** yönetmek. **Kupon kendi başına indirim taşımaz**; bağlı olduğu
  **promosyonun** indirimini açar ("Kupon kodu kendi başına indirim taşımaz; seçtiğiniz promosyonun indirimini açar.").
  İndirim türü/tutarı, minimum sepet, müşteri başı limit, promosyon tarihleri promosyonda tanımlanır.
- Entity: [../../entities/coupon.md](../../entities/coupon.md); promosyon: [../../entities/promotion.md](../../entities/promotion.md), ekran [promotions.md](promotions.md).
- Yetki: liste/detay `marketing:view`; "Yeni Kupon", "Toplu üret", "Kopyala" `marketing:create`; "Düzenle" `marketing:update`;
  "Sil" `marketing:delete`; "Paylaş" `marketing:view`. Yetkisi olmayan kullanıcı `/new`, `/bulk`, `/edit` URL'lerinde
  "Yönlendiriliyor... / Redirecting..." görür ve listeye döner; butonlar listede gizlenir.

## Ön koşullar ve bağımlılıklar
- **Promosyon zorunlu.** Hiç promosyon yoksa formda "Önce bir promosyon gerekiyor / You need a promotion first" kutusu ve
  "Promosyon oluştur / Create promotion" butonu çıkar (→ `/marketing/promotions/new`); kupon oluşturulamaz.
  Sıra: promosyon → kupon ([../../project/dependency-graph.md](../../project/dependency-graph.md)).
- Kuponun vitrinde çalışması için bağlı promosyon **Yayında / Aktif** olmalı ve promosyon tarih aralığı da geçerli olmalı
  (kupon tarihleri tek başına yetmez).
- Mağaza saat dilimi: tarih/saat alanları mağaza saatine göre yorumlanır; formda "Saatler mağazanın saat dilimine göre
  ({timeZone})." notu görünür. Saat dilimi seçilmemişse "…saatler UTC olarak okunuyor…" uyarısı çıkar → Ayarlar › Genel
  ([../settings/general.md](../settings/general.md)). Saat dilimi yüklenirken kaydet butonları pasiftir.

## Yerleşim

### Liste
1. Kart başlığı "Kuponlar" + sayı rozeti; sağda "Toplu üret / Generate batch" (`data-testid="coupon-bulk-action"`) ve
   "Yeni Kupon / New Coupon".
2. Filtre çubuğu: arama "Kupon kodu ara... / Search coupon code..." (kod ile arar; tam kod mu, kod parçası mı —
   doğrulanmadı; sonucu satırdaki kodla teyit et); Durum Select ("Tüm durumlar / All statuses"
   + 5 durum); Tür Select ("Tüm türler / All types" + 5 tür). Aktif filtreler rozet olarak görünür, "Filtreleri temizle /
   Clear filters".
3. Tablo sütunları: "Kod / Code" (kod + açıklama; tıklayınca detay; `data-testid="coupon-code-{id}"`), "Promosyon /
   Promotion" (promosyon adı + indirim, ör. "%10"; bağlı değilse "Promosyon yok / No promotion"), "Tür / Type",
   "Durum / Status" (rozet; aktif/taslakta bitişe ≤30 gün kala "Bitişe {n gün} / Expires in …"), "Geçerlilik Bitişi /
   Expires", "Kullanım / Usage" (`kullanım / limit`, ör. `3 / 100`), satır menüsü "⋯" (aria-label "İşlemler / Actions").
4. Satır menüsü: "Görüntüle / View", "Düzenle / Edit" (`coupon-edit-action-{id}`), "Paylaş / Share"
   (`coupon-share-action-{id}`; süresi dolmuş/iptal/kullanılmış kuponda pasif, "Pasif kuponlar paylaşılamaz"), "Sil / Delete"
   (`coupon-delete-action-{id}`).
5. Sayfalama: sayfa başına 20, en yeni oluşturulan üstte.
6. Boş durum: "İlk kuponunuzu oluşturun / Create your first coupon" + "Yeni Kupon".

### Oluştur / Düzenle (tam sayfa form, alt kısımda sabit buton çubuğu)
1. Kart "Promosyon / Promotion" — promosyon seçici + seçilince "Bu kupon şu indirimi açar / This coupon unlocks" özeti
   (İndirim türü, İndirim, Minimum sepet tutarı, Promosyon tarihleri; `data-testid="coupon-promotion-summary"`).
2. Kart "Temel Bilgiler / Basic info" — Kupon kodu, Kupon türü, Açıklama.
3. Kart "Geçerlilik / Validity" + "Kullanım / Usage" — Başlangıç/Bitiş tarihi, Kullanım limiti.
4. Alt çubuk: oluşturmada "İptal / Cancel", "Taslak Kaydet / Save as draft", "Aktive Et / Activate"; düzenlemede
   "İptal / Cancel", "Kaydet / Save".

### Detay
1. Üstte "Kuponlara dön / Back to coupons", kod (`data-testid="coupon-detail-code"`), durum rozeti, "Oluşturma: … /
   Güncelleme: …".
2. Sağda aksiyonlar: "Düzenle / Edit", "Paylaş / Share", "Kopyala / Duplicate", "Sil / Delete" (yetkiye göre).
3. KPI şeridi: "Kullanım / Usage" (`kullanım / limit`), "Kalan Süre / Time remaining" (ör. "3 gün sonra"; geçtiyse
   "Süresi doldu / Expired"), "İndirim Değeri / Discount value" (promosyondan, ör. "%10", "₺100", "Ücretsiz kargo").
4. Akordeon "Özet / Summary" (açık): Tür, Açıklama, Promosyon, İndirim türü, İndirim, Minimum sepet tutarı, Promosyon
   tarihleri, "Kupon geçerlilik aralığı / Coupon validity range".
5. Akordeon "Kullanım Detayları / Usage details": Kullanım sayısı, Kullanım limiti, Dağıtım kanalı, Kullanım tarihi
   (son kullanım).
6. Akordeon "Bilgiler / Metadata": Oluşturma tarihi, Güncelleme tarihi, Oluşturan.
- Detayda sipariş bazlı kullanım listesi, toplam verilen indirim veya müşteri listesi **yoktur**; sayı yalnız
  "Kullanım" değeridir.

## Alanlar

### Oluştur / Düzenle formu
| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Promosyon | Promosyon / Promotion * | Select (placeholder "Bir promosyon seçin / Select a promotion") | evet (taslakta da) | Boşsa "Bu kodun açacağı promosyonu seçin." | `#coupon-promotion`, `data-testid="coupon-promotion-trigger"` | Seçenek metni "{ad} — {indirim}" (ör. "Yaz İndirimi — %10") + durum rozeti (Taslak / Planlandı / Aktif / Duraklatıldı / Süresi Doldu / Tamamlandı). Süresi dolmuş/tamamlanmış promosyonlar soluk görünür — seçme. En yeni 100 promosyon listelenir. Promosyon değerleri kupondan değiştirilemez |
| Temel | Kupon kodu / Coupon code | Input | hayır | ≤64; boş → sistem 8 karakterlik büyük harf+rakam benzersiz kod üretir ("Boş bırakırsanız sistem benzersiz bir kod üretir."); placeholder "Örn. INDIRIM10 (boş bırakılırsa otomatik oluşturulur)" | `#coupon-code` | Kod **büyük harfe çevrilerek** kaydedilir; müşteri küçük harfle de girebilir. Mağaza içinde benzersiz — çakışmada hata toast'u ("Coupon code already exists", 409). **Düzenlemede kilitli**: "Salt okunur / Read-only" rozeti, "Kupon kodu oluşturulduktan sonra değiştirilemez" |
| Temel | Kupon türü / Coupon type * | RadioGroup | evet | varsayılan "Tek Kullanımlık" | `#coupon-type-single_use`, `#coupon-type-multi_use`; `getByRole('radio', { name })` | Seçilebilir: "Tek Kullanımlık / Single use", "Çoklu Kullanım / Multi use". Pasif (ipucu "Bu tür sonraki sürümde gelecek (1.5)"): "Kişiye Özel / Unique", "Tavsiye / Referral", "Hediye / Gift" |
| Temel | Açıklama / Description | Textarea | hayır | ≤500; placeholder "Bu kuponun ne için olduğunu kısaca açıklayın." | `#coupon-description` | Listede kodun altında görünür (yalnız admin) |
| Geçerlilik | Başlangıç tarihi / Valid from * | `datetime-local` | evet | "Başlangıç tarihi zorunludur."; oluşturmada geçmiş seçilemez (seçicinin alt sınırı "şimdi", mağaza saati) | `#coupon-valid-from` | `fill('2026-11-01T09:00')`. Mağaza saat diliminde |
| Geçerlilik | Bitiş tarihi / Valid until * | `datetime-local` | evet | "Bitiş tarihi zorunludur."; başlangıçtan sonra olmalı ("Bitiş tarihi başlangıç tarihinden sonra olmalı.") | `#coupon-valid-until` | |
| Kullanım | Kullanım limiti / Usage limit | number | — | varsayılan 1; en az 1 (boş/0 girilirse 1'e döner) | `#coupon-usage-limit` | İpucu: "Tek kullanımlık kuponlar için 1, çoklu kullanım için yüksek bir sayı seçin." **Bu kodun tüm müşterilerdeki toplam** kullanım sayısıdır. Müşteri başı sınır kuponda yok → promosyonda "Müşteri başına sınır" |

Validasyon hatası olduğunda alan altında kırmızı metin + toast "Lütfen formdaki hataları düzeltin. / Please correct the
errors in the form.".

### Ekranda olmayan kurallar (kupon formunda alan yok)
| İstek | Nerede |
|---|---|
| İndirim türü (yüzde / sabit tutar / ücretsiz kargo), değer, en fazla indirim | Promosyon ([promotions.md](promotions.md)) |
| Minimum sepet tutarı | Promosyon — "En az sepet tutarı" |
| Müşteri başı kullanım | Promosyon — "Müşteri başına sınır" (promosyondaki **tüm kodlar** için ortak sayılır) |
| Promosyon geneli toplam kullanım | Promosyon — "Toplam kullanım sınırı" (tüm kodlar toplamı) |
| Ürün / kategori / marka kısıtı, müşteri grubu / segment, ilk sipariş, birleştirilebilirlik | Admin ekranlarında **ayarlanamaz** (bu sürüm; promosyon haritasına bak). Kullanıcıya söyle, geçici yol önerme |
| Belirli müşteriye bağlı kupon | Admin formunda yok; sadakat/tavsiye/sepet kurtarma gibi otomasyonların ürettiği kuponlar müşteriye bağlı olabilir |

## Durumlar
| Durum (tr / en) | Anlamı |
|---|---|
| Taslak / Draft | "Taslak Kaydet" ile oluşturuldu; vitrinde **kabul edilmez** |
| Aktif / Active | "Aktive Et" ile (ya da toplu üretimle) oluşturuldu; tarih aralığında ve limit dolmamışsa kabul edilir |
| Süresi Doldu / Expired | Bitiş tarihi geçmiş kupon; kabul edilmez. Vitrin kontrolü kuponun **tarih aralığına** göre yapılır → bir kuponun kullanılabilirliğini değerlendirirken "Geçerlilik Bitişi" sütununa ve detaydaki "Kalan Süre"ye de bak |
| Kullanıldı / Redeemed | Tek kullanımlık kupon bir siparişte kullanıldı |
| İptal / Cancelled | Kabul edilmez; admin ekranında bu duruma getiren aksiyon yok |

- **Durum oluştururken seçilir:** "Taslak Kaydet" → Taslak, "Aktive Et" → Aktif; düzenleme kaydı mevcut durumu korur.
  Kullanıcı kuponu hemen kullanıma açmak istiyorsa oluştururken **"Aktive Et"** kullan. Kuponu durdurmak için: bitiş
  tarihini öne çekmek (düzenle), kullanılmamışsa silmek; ya da bağlı promosyonu duraklatmak (promosyondaki **tüm kodları** durdurur).

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Yeni Kupon → form → **Taslak Kaydet** | Kupon `Taslak` oluşur → detay sayfasına gider | "Kupon taslak olarak kaydedildi. / Coupon saved as draft." |
| Yeni Kupon → form → **Aktive Et** | Kupon `Aktif` oluşur → detay | "Kupon aktive edildi. / Coupon activated." |
| İptal (form) | Önceki sayfaya döner, kayıt yok | — |
| Düzenle → **Kaydet** | Promosyon, tür, açıklama, tarihler, kullanım limiti güncellenir (kod ve durum değişmez) → detaya döner | "Kupon güncellendi. / Coupon updated."; kod değiştirme denemesi `ERR_COUPON_CODE_IMMUTABLE` ("Kupon kodları oluşturulduktan sonra değiştirilemez."); silinmişse `ERR_COUPON_NOT_FOUND` |
| Detay → **Kopyala / Duplicate** | **Diyalogsuz, anında** yeni kupon oluşturur: kod `{ESKİKOD}-{8 rastgele hex}`, aynı promosyon/tür/açıklama/tarihler/limit, durum **Taslak**; yeni kuponun detayına gider | "Kupon kopyalandı. / Coupon duplicated."; promosyonsuz eski kuponda "Bu kupon bir promosyona bağlı olmadığı için kopyalanamıyor…" |
| Sil (liste ⋯ veya detay) → AlertDialog "Kuponu sil / Delete coupon" ("Bu kupon silindiğinde geri alınamaz. Daha önce kullanıldıysa silme reddedilecek." + kod) → "Sil / Delete" | Kupon kaldırılır; detaydan silinince listeye döner | "Kupon silindi. / Coupon deleted."; kullanılmış (geri alınmamış kullanımı olan) kuponda `ERR_COUPON_HAS_REDEMPTIONS` → "Bu kupon zaten kullanıldı, silinemez. Pasifleştirebilirsiniz." (diyalog açık kalır, "İptal" ile kapat) |
| Paylaş / Share | Diyalog "Kuponu Paylaş": "Herkese açık bağlantı" = `{vitrin}/{dil}/coupon/{KOD}`; "Kopyala" (panoya) ve (destekleyen cihazda) "Paylaş" (cihazın paylaşım menüsü). Kayıt değiştirmez | "Bağlantı kopyalandı / Link copied" |
| Filtre / arama / sayfalama | Salt okunur | — |

## Onay zamanlaması (kural 2/5/6)
- **Taslak Kaydet / Aktive Et / Kaydet:** özet tablosu + açık "evet" sonrası tıkla. "Aktive Et" kodu **hemen kullanılabilir**
  yapar (başlangıç tarihi gelmişse ve promosyon yayındaysa) → özette "canlı: evet/hayır" yaz.
- **Kopyala:** diyalogsuz kalıcı kayıt (yeni taslak kupon) → tıklamadan **önce** onay al.
- **Sil:** geri alınamaz; ayrı ve tek tek onay (kod + kullanım sayısı + durum özette). Kullanılmış kupon silinemez — önceden
  "Kullanım" değerini kontrol et.
- **Kullanılmış kuponu düzenleme** (kullanım > 0): engel yok ama etkisi canlıdır — promosyon değişirse koddan sonraki
  indirim değişir; limit mevcut kullanıma eşit/altına inerse kod hemen kullanılamaz olur; bitiş öne çekilirse kod
  kapanır. Özette "etkilenen: bu kodu kullanacak müşteriler; geçmiş siparişler değişmez (doğrulanmadı)" yaz.
- **Paylaş:** kayıt değiştirmez; ancak bağlantı herkese açıktır ve kodu ifşa eder ("Bu bağlantı herkese açıktır. Kupon
  kodu son kullanıcıya görünür.") → bağlantıyı kopyalamadan/paylaşmadan önce kullanıcıya sor; "Paylaş" (cihaz menüsü)
  dış uygulamaya gönderir, Claude kullanmaz.
- Kupon ekranları e-posta/SMS **göndermez**.

## Yan etkiler
- Kod vitrinde sepet/ödeme adımında girilir; değişiklikler (durum, tarih, limit, promosyon) kısa sürede vitrine yansır.
- Kullanım, sipariş verilirken sayılır; sipariş **iptal** edilirse veya **tam iade** ile "İade Edildi" olursa kullanım geri
  verilir (tek kullanımlık kupon yeniden "Aktif" olur). Kısmi iade geri vermez. Ayrıntı: [../../entities/coupon.md](../../entities/coupon.md).
- Kupon kullanımı promosyonun toplam kullanımını da artırır.

## Tuzaklar
- "%10 kupon" isteği → önce %10'luk **promosyon** gerekir (mevcutsa onu seç, yoksa promosyon oluştur — ayrı onay).
  İndirim kuponda girilmez.
- Kupon tarihleri ile promosyon tarihleri ayrı; ikisi de geçerli olmalı. Kupon aralığını promosyon aralığının içinde tut.
- Bağlı promosyon "Taslak/Planlandı/Duraklatıldı" ise kupon "Aktif" olsa da vitrinde çalışmaz.
- "Tek Kullanımlık" kupon toplamda **bir** siparişte kullanılır (kim kullanırsa); her müşteriye bir kez kullandırmak
  için "Çoklu Kullanım" + promosyonda "Müşteri başına sınır = 1"; her müşteriye ayrı kod için [coupon-bulk.md](coupon-bulk.md).
- Kod sonradan değişmez; büyük harfe çevrilir — özette büyük harfli halini göster. Türkçe karakter (İ, Ş, Ğ…) yerine
  ASCII öner.
- Kodu boş bırakmak rastgele kod üretir; kullanıcı belirli bir kod istiyorsa mutlaka yaz.
- Kullanım limiti alanı 1'in altına inmez; "sınırsız" seçeneği yok — çoklu kullanımda kullanıcıdan sayı iste.
- Kullanılabilirlik = durum **ve** tarih aralığı **ve** limit **ve** promosyon durumu; özette dördünü de yaz.

## Doğrulama
1. Toast metni (yukarıdaki tablo).
2. Oluşturmada URL `{ADMIN_URL}/marketing/coupons/{id}` olur; başlıkta kod (büyük harf), durum rozeti (Taslak/Aktif).
3. KPI: "Kullanım 0 / {limit}", "İndirim Değeri" promosyonun değeri; Özet'te promosyon adı ve "Kupon geçerlilik aralığı".
4. Listede kodla ara → satırda Promosyon, Tür, Durum, Geçerlilik Bitişi, Kullanım.
5. Vitrinde deneme siparişi verme (prod'da test verisi girilmez, kural 7).
