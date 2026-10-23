# Fırsatlar — satış hattı, detay, düzenle (CRM Deals)
- URL'ler:
  - Satış hattı (liste/kanban): {ADMIN_URL}/customers/crm/deals
  - Detay: {ADMIN_URL}/customers/crm/deals/{id}
  - Düzenle: {ADMIN_URL}/customers/crm/deals/{id}/edit
- Menü yolu: Sol menü "Müşteriler / Customers" → "Fırsat Hattı / Deals Pipeline".
- Sayfa başlığı: "Satış Hattı / Sales Pipeline"; açıklama "Anlaşmalarınızı satış sürecinde yönetin ve takip edin".
  Arayüzde aynı kayıt için hem "Fırsat" hem "Anlaşma" kelimesi geçer (eski/yeni çeviri); ikisi aynı şeydir.
- Amaç: Bir müşteriyle yürüyen satış fırsatını (B2B teklif, toplu sipariş, kurumsal anlaşma…) aşama aşama takip etmek; değer, olasılık, ürün kalemleri, aktiviteler ve notlar tutmak; kazanıldı/kaybedildi olarak kapatmak.
- Entity: [../../../entities/crm-deal.md](../../../entities/crm-deal.md). İlgili: [contacts.md](contacts.md), [tasks.md](tasks.md), müşteri [../customer-detail.md](../customer-detail.md).
- Yetki: sunucu `crm:deals:read`, `crm:deals:write` (oluştur, düzenle, aşama, kazan/kaybet, yeniden aç, ürün, aktivite, not), `crm:deals:delete` (sil). `admin` / `super_admin` rollerinde hepsi var.
- Plan: CRM, Rise ve üstü planlarda listelenen plan özelliğidir (`crm`); Launch planında davranış doğrulanmadı.

## Ön koşullar ve bağımlılıklar
- **Müşteri ID'si** (zorunlu): fırsat bir müşteri kaydına bağlanır. Değer, müşteri detay sayfasının başlığındaki "Müşteri ID: …" ([../customer-detail.md](../customer-detail.md)). Alan serbest metin; seçici/arama yok — müşteri listesinde arayıp ID'yi oradan al.
- Ürün kalemleri katalogdan seçilmez; ad, birim fiyat elle girilir. Katalog ürününe atıf için ürün detayındaki ürün ID'si / SKU kullanılabilir ([../../../entities/product.md](../../../entities/product.md)). Fırsat ürünü **stok ayırmaz, sipariş oluşturmaz**.
- Atanan kişi serbest metin (kullanıcı seçici yok).

## Yerleşim
### Satış hattı
1. Başlık + açıklama; sağda "Anlasma Ekle / Add Deal".
2. İstatistik kartları: "Toplam Hat / Total Pipeline" (+ "{count} fırsat"), "Bu Ay Kazanilan / Won This Month", "Ağırlıkli Hat / Weighted Pipeline" ("Olasılığa dayalı"), "Kazanma Oranı / Win Rate" ("Tüm zamanlar").
3. Görünüm sekmeleri: "Hat / Pipeline" (varsayılan, kanban), "Sicak Anlasmalar / Hot Deals", "Bu Ay Kapanan / Closing This Month".
4. Hat sekmesi: "Filtreler" kartı — arama "Fırsat ara... / Search deals..." (başlık, açıklama, etiket; kelime bazında), "Sıcaklık" Select ("Tümü", Sıcak, Ilık, Soğuk), yenile butonu.
5. **Kanban sütunları** (soldan sağa): "Potansiyel / Lead", "Nitelendi / Qualified", "Teklif / Proposal", "Muzakere / Negotiation", "Kazanildi / Closed Won", "Kaybedildi / Closed Lost". Sütun başlığında adet rozeti ve toplam değer. "Beklemede / On Hold" aşaması için **sütun yoktur** — bu aşamadaki fırsatlar kanban'da görünmez.
6. Fırsat kartı: başlık, ⋯ menü, değer (fırsatın para birimiyle), sıcaklık ikonu, olasılık çubuğu (%), beklenen kapanış tarihi, atanan kişi.
7. Kart menüsü ("İşlemler"): "Detayları Gör", "Düzenle", **"Aşamaya Taşı / Move to Stage"** başlığı altında mevcut aşama hariç açık aşamalar (Potansiyel, Nitelendi, Teklif, Müzakere, Beklemede), açık fırsatta "Kazanildi Olarak İşaretle / Mark as Won" + "Kaybedildi Olarak İşaretle / Mark as Lost", kapalı fırsatta "Yeniden Ac / Reopen Deal", "Sil / Delete".
8. **Sürükle-bırak yoktur**; aşama değişikliği yalnız kart menüsünden, düzenle ekranından veya kazan/kaybet ile yapılır.
9. Sıcak / Bu Ay Kapanan sekmeleri: yalnız açık fırsatların listesi (Sıcak: sıcaklığı "Sıcak" olan, değere göre azalan; Bu Ay: beklenen kapanışı bu ay içinde olan); satırda "%{percent} olası"; menüde yalnız Detay/Düzenle.

### Detay
- Başlık: fırsat başlığı; geri "Fırsat Hattına Dön / Back to Pipeline".
- Sağ üst: açık fırsatta "Kazanıldı / Won" ve "Kaybedildi / Lost" butonları; kapalı fırsatta "Yeniden Aç / Reopen"; ⋯ menü ("Fırsatı Düzenle / Edit Deal", "Fırsatı Sil / Delete Deal").
- Rozetler: aşama, sıcaklık, öncelik. Altında aşama ilerleme göstergesi (tıklanamaz).
- Sekmeler: "Genel Bakış / Overview", "Ürünler / Products" (adet rozeti), "Aktiviteler / Activities", "Notlar / Notes".
  - Genel Bakış kartları: "Değer ve Olasılık" (Fırsat Değeri, Olasılık, Ağırlıklı Değer, Para Birimi), "Aşama ve Durum" (Aşama, Sıcaklık, Öncelik, Kaybetme Nedeni, Kaynak), "Tarihler ve Atama" (Tahmini Kapanış, Gerçek Kapanış, Atanan Kişi, Takım, Oluşturulma, Son Güncelleme), "Müşteri" (müşteri adı ya da ID, Karar Vericiler, Ek Kişiler), "Bütçe ve Karar", "Strateji", "Açıklama", "Etiketler".
  - Ürünler: tablo "Ürün / SKU / Adet / Birim Fiyat / İndirim / Toplam" + satır sonunda çöp kutusu ikonu; "Toplam" satırı; "Ürün Ekle / Add Product".
  - Aktiviteler: "Yaklaşan ({count})", "Tamamlanan ({count})", "İptal Edilen ({count})" grupları; yaklaşan aktivitede "Tamamla / Complete" ve ✕ (iptal) butonları; "Aktivite Ekle / Add Activity".
  - Notlar: liste + "Not Ekle / Add Note". Aşama değişikliği, kazanma, kaybetme ve yeniden açma da otomatik not olarak düşer.

### Düzenle
- Başlık "Fırsatı Düzenle / Edit Deal", geri "Fırsata Dön". Kartlar "Temel Bilgiler" ve "Ek Detaylar"; altta "İptal", "Değişiklikleri Kaydet / Save Changes".

## Alanlar
### "Fırsat Oluştur / Create Deal" diyaloğu
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Fırsat Başlığı * / Deal Title * | Input | evet | 1–255 | `#title` | placeholder "örn., Kurumsal Lisans - Acme A.Ş." |
| Müşteri ID * / Customer ID * | Input | evet | — | `#customerId` | Müşteri detayındaki "Müşteri ID" |
| Fırsat Değeri / Deal Value | number Input | — | 0; ≥0 | `#value` | Ürün eklenince değer ürün toplamından yeniden hesaplanır |
| Aşama / Stage | Select | — | "Potansiyel / Lead" | label "Aşama" | Potansiyel, Nitelendi, Teklif, Muzakere, Beklemede (kapalı aşamalar yok) |
| Sıcaklık / Temperature | Select | — | "Ilik / Warm" | label "Sıcaklık" | Sıcak / Ilık / Soğuk |
| Beklenen Kapanış / Expected Close | date Input | hayır | `YYYY-MM-DD` | `#expectedCloseDate` | "Bu Ay Kapanan" sekmesini besler |
| Atanan Kişi / Assigned To | Input | hayır (boşsa "unassigned") | ≤100 | `#assignedTo` | |
- Diyalogda **para birimi ve olasılık alanı yoktur**: yeni fırsat **USD** para birimi ve **%10** olasılıkla oluşur, öncelik "Orta". Mağaza para birimi farklıysa (ör. TRY) oluşturduktan hemen sonra düzenle ekranında Para Birimi'ni düzelt (ayrı onay) — playbook: [../../../../playbooks/crm-deal-create.md](../../../../playbooks/crm-deal-create.md).
- Başlık veya Müşteri ID boşsa toast "Lütfen tüm zorunlu alanları doldurun".
- Butonlar: "İptal", "Fırsat Oluştur / Create Deal" ("Oluşturuluyor...").

### Düzenle ekranı
| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Temel Bilgiler | Fırsat Başlığı * / Deal Title * | Input | evet | boşsa "Devam etmek için bir fırsat başlığı girin." | `#title` | |
| | Değer / Value | number Input | — | ≥0 | `#value` | Fırsatta ürün varsa kaydedince değer **ürün toplamına** döner |
| | Para Birimi / Currency | Input (3 harf, otomatik büyük harf) | — | tam 3 harf ISO kodu (TRY, USD, EUR) | `#currency` | placeholder "TRY" |
| | Aşama / Stage | Select | — | 7 aşamanın tümü (Kazanildi / Kaybedildi dahil) | label "Aşama" | Buradan Kazanıldı/Kaybedildi seçmek olasılığı 100/0 yapar, kapanış tarihi yazar; kazanma/kaybetme nedeni sorulmaz — tercihen detaydaki Kazanıldı/Kaybedildi butonlarını kullan |
| | Sıcaklık / Temperature | Select | — | Sıcak / Ilık / Soğuk | label "Sıcaklık" | |
| | Olasılık: %{value} / Probability | Slider 0–100, adım 1 | — | — | role `slider` | Ok tuşlarıyla ayarlanır (doğrulanmadı); aşama değişince otomatik değişmez (yalnız kazan=100, kaybet=0) |
| Ek Detaylar | Müşteri ID * / Customer ID * | Input | evet | boşsa "Devam etmek için müşteri ID girin." | `#customerId` | |
| | Atanan Kişi / Assigned To | Input | hayır | — | `#assignedTo` | |
| | Beklenen Kapanış Tarihi / Expected Close Date | date Input | hayır | — | `#expectedCloseDate` | |
| | Açıklama / Description | Textarea | hayır | ≤5000 | `#description` | |
- Öncelik, kaynak, bütçe, karar vericiler, strateji, etiket gibi alanlar detayda görünür ama bu ekranda düzenlenmez.

### Detay diyalogları
| Diyalog | Alanlar | Buton | Not |
|---|---|---|---|
| "Fırsatı Kazanıldı Olarak İşaretle" / "…Kaybedildi…" | "Neden (isteğe bağlı) / Reason (optional)" Textarea | "Kazanıldı Olarak İşaretle" / "Kaybedildi Olarak İşaretle" | Neden fırsat notuna düşer; kayıpta "Kaybetme Nedeni" alanına da yazılır |
| "Ürün Ekle / Add Product" | "Ürün Adı *" `#productName` (≤255), "Ürün ID" `#productId`, "SKU" `#sku` (≤100), "Adet *" `#quantity` (≥1), "Birim Fiyat *" `#unitPrice` (≥0), "İndirim %" `#discount` (0–100), "Notlar" `#productNotes` (≤500) | "Ürün Ekle" | **Ürün ID'yi her zaman doldur** (API'de zorunlu; kaldırma bu ID ile yapılır, aynı fırsatta iki satıra aynı ID verme). Satır toplamı = adet × birim fiyat − indirim; fırsat değeri = satır toplamları |
| "Aktivite Ekle / Add Activity" | "Başlık *" `#activityTitle` (≤200), "Tür" Select (Arama, E-posta, Toplantı, Teklif, Demo, Müzakere, Sözleşme), "Öncelik" (Düşük/Orta/Yüksek, varsayılan Orta), "Planlanan Tarih ve Saat *" `#scheduledAt` (`datetime-local`), "Atanan Kişi" `#activityAssignedTo` (boşsa "unassigned"), "Açıklama" `#activityDescription` (≤2000) | "Aktivite Ekle" | Aktivite yalnız kayıttır; takvim daveti/e-posta göndermez |
| "Aktiviteyi Tamamla / Complete Activity" | "Sonuç (isteğe bağlı)" | "Tamamlandı Olarak İşaretle" | Tamamlanan aktivite iptal edilemez |
| "Not Ekle / Add Note" | "Kategori" (Genel, Arama, Toplantı, E-posta, Önemli, Destek, Satış) + "Not *" | "Not Ekle" | Fırsat başına en çok 100 not tutulur |
| "Fırsatı Sil / Delete Deal" | — | "Fırsatı Sil" (liste: "Sil") | "…Bu işlem geri alınamaz ve ilgili tüm ürünler, aktiviteler ve notlar kalıcı olarak silinecektir." |

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Anlasma Ekle → Fırsat Oluştur | Fırsat açık durumda oluşur | "Fırsat başarıyla oluşturuldu"; hata "Fırsat oluşturulamadı" |
| Kart ⋯ → Aşamaya Taşı → {aşama} | **Diyalogsuz, anında** aşama değişir; nota "Stage changed from … to …" düşer | "Fırsat aşaması güncellendi"; hata "Fırsat aşaması güncellenemedi…" |
| Kazanıldı (detay) / Kazanildi Olarak İşaretle (kart) → diyalog | Aşama "Kazanildi", olasılık %100, gerçek kapanış = bugün | "Fırsat kazanıldı olarak işaretlendi" |
| Kaybedildi / Kaybedildi Olarak İşaretle → diyalog | Aşama "Kaybedildi", olasılık %0, kapanış = bugün, kaybetme nedeni yazılır | "Fırsat kaybedildi olarak işaretlendi" |
| Yeniden Aç (detay) / Yeniden Ac (kart) | **Diyalogsuz, anında**: aşama "Potansiyel"e döner, fırsat yeniden açık; kaybetme nedeni temizlenir | "Fırsat başarıyla yeniden açıldı" / "Fırsat yeniden açıldı" |
| Düzenle → Değişiklikleri Kaydet | Alanlar güncellenir; detaya döner | "Fırsat başarıyla kaydedildi." |
| Ürün Ekle → Ürün Ekle | Satır eklenir, fırsat değeri yeniden hesaplanır | "Ürün fırsata eklendi." |
| Ürün satırı çöp kutusu | **Diyalogsuz, anında** satır kaldırılır, değer yeniden hesaplanır | "Ürün fırsattan kaldırıldı." |
| Aktivite Ekle → Aktivite Ekle | Bekleyen aktivite eklenir | "Aktivite fırsata eklendi." |
| Aktivite "Tamamla" → diyalog | Aktivite tamamlanır | "Aktivite tamamlandı olarak işaretlendi." |
| Aktivite ✕ | **Diyalogsuz, anında** aktivite iptal edilir | "Aktivite iptal edildi." |
| Not Ekle → Not Ekle | Not eklenir | "Not başarıyla eklendi." |
| Sil / Fırsatı Sil → diyalog | Fırsat ve tüm ürün/aktivite/notları **kalıcı** silinir | "Fırsat silindi" / "Fırsat başarıyla silindi." |

## Onay zamanlaması (kural 2/5/6)
- **Anında kayıt (diyalogsuz) — onayı tıklamadan önce al:** kart menüsünden "Aşamaya Taşı", "Yeniden Aç", ürün satırı çöp kutusu, aktivite ✕ (iptal).
- Kazan/Kaybet: diyalog açılır ama özet + onay diyalog **açılmadan önce** alınmalı (neden metni dahil). Kapanış tarihi bugüne yazılır.
- Silme: geri alınamaz, ürün/aktivite/not sayısını özette ver ve ayrı onay al.
- Fırsat aksiyonlarının hiçbiri müşteriye e-posta/bildirim göndermez; sipariş, fatura, ödeme veya stok oluşturmaz. Kazanılan fırsat sipariş değildir — sipariş gerekiyorsa ayrı iş (sipariş oluşturma ekranı, ayrı onay).

## Yan etkiler
- Aşama her değiştiğinde aşama geçmişi tutulur (detayda "aşama ilerleme" göstergesi).
- İstatistik kartları ve "Ağırlıklı Hat" (değer × olasılık) açık fırsatlardan hesaplanır.
- Ürün eklemek/çıkarmak fırsat değerini elle girilen değerin üzerine yazar.

## Tuzaklar
- Para birimi oluştururken seçilemez → varsayılan USD. Özette mutlaka "Para birimi: USD (varsayılan) → düzenlemede TRY yapılacak" gibi yaz.
- Olasılık aşamaya göre otomatik değişmez; kullanıcı istiyorsa düzenle ekranında slider'la ayarla. Yeniden açılan fırsatın olasılığını gözden geçir.
- "Beklemede" aşamasındaki fırsat kanban'da sütun olarak görünmez; fırsatı Beklemede'ye taşıyacaksan kullanıcıya bunu söyle ve detay linkini rapora yaz.
- Kanban kartında para birimi fırsatın kendi para birimidir; sütun toplamları farklı para birimlerini toplar.
- Müşteri ID serbest metindir; yanlış ID ile fırsat oluşabilir — önce müşteri detayında ID'yi doğrula.
- "Fırsat" ve "Anlaşma" aynı kayıt; toast ve butonlarda iki kelime de geçer.

## Doğrulama
1. Toast.
2. Kanban'da doğru sütunda kart: başlık, değer + para birimi, olasılık, kapanış tarihi.
3. Detayda Genel Bakış kartları; Ürünler toplamı fırsat değerine eşit; Notlar'da aşama/kazanma notları.
