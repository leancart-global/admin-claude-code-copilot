# Playbook: CRM fırsatı oluştur ("bu müşteri için fırsat aç")

Tetikleyiciler: "X firması için 50.000 TL'lik fırsat aç", "Ahmet Bey'e teklif fırsatı oluştur", "satış hattına anlaşma
ekle", "şu fırsata 10 adet ürün ekle", "fırsatı kazanıldı yap".
Harita: ../domain/screens/customers/crm/deals.md (alanlar, aksiyonlar, onay zamanlaması),
../domain/entities/crm-deal.md (kurallar), ../domain/screens/customers/customer-detail.md (müşteri ID),
../domain/screens/customers/crm/tasks.md (takip görevi istenirse).
URL'ler locale öneksizdir: `{ADMIN_URL}/customers/crm/deals`.

---

## 0. Kural hatırlatması
- CRM, Rise ve üstü planlarda listelenen bir plan özelliğidir (`crm`). Menüde "Fırsat Hattı / Deals Pipeline" yoksa ya da
  ekran hata veriyorsa dur, kullanıcıya planını/yetkisini sor.
- Fırsat oluşturma, para birimi düzeltme, her ürün satırı, her aktivite, kazan/kaybet **ayrı kalıcı adımlardır**; her biri
  için özet + açık "evet" (kullanıcı toplu onay isterse tek özet).
- Fırsat sipariş değildir: stok ayırmaz, fatura/ödeme oluşturmaz, müşteriye e-posta göndermez. Kullanıcı sipariş
  bekliyorsa bunu açıkça söyle.

## 1. İsteği çözümle → taslak alan listesi
| Bilgi | Form alanı | Zorunlu mu? | Varsayılan (sorulmazsa) |
|---|---|---|---|
| Fırsat başlığı | Fırsat Başlığı | Evet (≤255) | Öner: "{Ürün/hizmet} - {Müşteri/şirket}" ve onaylat |
| Müşteri | Müşteri ID | Evet | — (müşteri adından bul, adım 2) |
| Değer | Fırsat Değeri | Hayır | Ürün kalemleri verilecekse 0 (ürünlerden hesaplanır); yoksa sor |
| Para birimi | (oluştururken yok) Düzenle → Para Birimi | — | Mağaza para birimi (`config/local.json` tenant bağlamı); yeni fırsat **USD** açılır → düzenlemede düzelt |
| Aşama | Aşama | — | Potansiyel / Lead |
| Sıcaklık | Sıcaklık | — | Ilık / Warm |
| Olasılık | (oluştururken yok) Düzenle → Olasılık slider | — | %10 |
| Beklenen kapanış | Beklenen Kapanış | Hayır | — |
| Atanan kişi | Atanan Kişi | Hayır | Boş ("unassigned") |
| Açıklama | Düzenle → Açıklama | Hayır | — |
| Ürün kalemleri | Detay → Ürünler → Ürün Ekle | Hayır | — (ad, adet, birim fiyat, indirim %, ürün ID/SKU) |
| Takip aktivitesi | Detay → Aktiviteler → Aktivite Ekle | Hayır | — (tür, başlık, planlanan zaman) |

Eksik zorunluları ve değer/para birimi belirsizliğini **tek seferde** sor.

## 2. Müşteri ID'sini bul (salt okunur)
1. Kullanıcı müşteri adı/e-posta verdiyse müşteri listesinde ara, müşteri detayını aç
   (../domain/screens/customers/customer-detail.md); başlıktaki **"Müşteri ID: …"** değerini al.
2. Birden çok eşleşme varsa kullanıcıya listele ve seçtir. Müşteri yoksa: müşteri oluşturmak ayrı bir iştir (ayrı plan
   ve onay) — kullanıcıya sor.
3. Aynı müşteri için açık fırsat var mı? Satış hattında "Fırsat ara..." ile başlığı ara (kelime bazında). Benzerini
   bulursan kullanıcıya göster: yeni mi açalım, mevcut mu güncellenecek?

## 3. Plan + özet → ONAY
Ortam başlığıyla özet:

| Alan | Değer | Kaynak |
|---|---|---|
| Ortam | prod / dev | config |
| Fırsat başlığı | Kurumsal Lisans - Acme A.Ş. | kullanıcı / öneri |
| Müşteri ID | CUST-… (Acme A.Ş.) | müşteri detayı |
| Değer | 50.000 | kullanıcı (ürün eklenirse ürün toplamı geçerli olur) |
| Para birimi | Oluşturmada USD (varsayılan) → hemen ardından TRY'ye düzeltilecek | varsayılan + adım 5 |
| Aşama / Sıcaklık / Olasılık | Potansiyel / Ilık / %10 | varsayılan |
| Beklenen kapanış | 2026-12-15 | kullanıcı |
| Atanan | — | varsayılan |
| Sonraki adımlar | Para birimi düzeltme (ayrı kayıt), 2 ürün satırı, 1 aktivite | |
| Yan etkiler | Satış hattı istatistiklerine eklenir; müşteriye bildirim gitmez; sipariş/stok oluşmaz | |

"Onaylıyor musunuz?" — açık evet bekle.

## 4. Oluştur
1. `{ADMIN_URL}/customers/crm/deals` → `browser_snapshot`.
2. "Anlasma Ekle / Add Deal" → diyalog "Fırsat Oluştur / Create Deal".
3. `#title`, `#customerId`, `#value` (gerekirse), "Aşama" Select (tetikleyici → seçenek), "Sıcaklık" Select,
   `#expectedCloseDate` (`fill('2026-12-15')`), `#assignedTo`.
4. Snapshot ile değerleri doğrula → **"Fırsat Oluştur"** butonuna tıkla (Enter kullanma).
5. Toast "Fırsat başarıyla oluşturuldu". Hata toast'ında dur, kullanıcıya bildir.
6. Kanban'da ilgili aşama sütununda kartı bul (arama kutusuyla başlığı ara) → ⋯ → "Detayları Gör". Detay URL'sini
   (`/customers/crm/deals/{id}`) not et.

## 5. Para birimi / olasılık / açıklama düzeltmesi (gerekiyorsa) → ONAY
1. Detay ⋯ → "Fırsatı Düzenle" (ya da `{id}/edit`).
2. Özet: "Para Birimi USD → TRY", "Olasılık %10 → %{x}", "Açıklama: …" → onay.
3. `#currency` → `TRY` (3 harf); Olasılık slider (role `slider`) — klavye ok tuşlarıyla hedef değere getir, etiket
   "Olasılık: %{value}" ile doğrula; `#description`.
4. "Değişiklikleri Kaydet" → toast "Fırsat başarıyla kaydedildi." → detaya döner.

## 6. Ürün kalemleri (istenirse) → her satır için ONAY
1. Detay → "Ürünler / Products" sekmesi → "Ürün Ekle / Add Product".
2. `#productName` (zorunlu), `#productId` (**her zaman doldur**: katalog ürünü ise ürün ID'si, değilse benzersiz bir kod
   ör. SKU; aynı fırsatta iki satıra aynı ID verme), `#sku`, `#quantity` (≥1), `#unitPrice`, `#discount` (%),
   `#productNotes`.
3. Özet: satır toplamı = adet × birim fiyat − indirim; **fırsat değeri ürün toplamına dönüşecek** (elle girilen değer
   geçersiz olur). Onay → "Ürün Ekle" → toast "Ürün fırsata eklendi."
4. Satır kaldırma (çöp kutusu) diyalogsuz anında kaydeder → tıklamadan önce onay.

## 7. Aktivite / görev (istenirse) → ONAY
- Fırsata bağlı aktivite: Detay → "Aktiviteler" → "Aktivite Ekle": `#activityTitle`, "Tür", "Öncelik", `#scheduledAt`
  (`2026-11-05T10:00`), `#activityAssignedTo`, `#activityDescription` → "Aktivite Ekle". Takvim daveti/e-posta gitmez.
- Ekip görevi (son tarih, hatırlatıcı) isteniyorsa ../domain/screens/customers/crm/tasks.md → "Görev Ekle", "Anlasma ID"
  alanına fırsat detay URL'sindeki ID.

## 8. Doğrula ve raporla
1. Detay "Genel Bakış": Değer ve Olasılık kartı (değer, olasılık, ağırlıklı değer, para birimi), Aşama ve Durum,
   Tarihler ve Atama, Müşteri.
2. Ürünler sekmesi toplamı = fırsat değeri.
3. Kanban'da kartın sütunu ve değeri.
4. Rapor: fırsat linki, müşteri ID, uygulanan varsayılanlar (ör. sıcaklık Ilık), yapılamayanlar (ör. öncelik/etiket
   ekrandan girilemez).

## Sonraki işlemler (ayrı istekler)
| İstek | Yol | Onay notu |
|---|---|---|
| "Teklif aşamasına al" | Kart ⋯ → "Aşamaya Taşı" → Teklif | **Anında kaydeder** — tıklamadan önce onay |
| "Kazanıldı yap" | Detay "Kazanıldı" → neden → "Kazanıldı Olarak İşaretle" | Olasılık %100, kapanış bugün; onay diyalogdan önce |
| "Kaybettik, fiyat yüzünden" | Detay "Kaybedildi" → neden | Olasılık %0 |
| "Fırsatı tekrar aç" | Detay "Yeniden Aç" | **Anında**; aşama Potansiyel'e döner — olasılığı kullanıcıyla gözden geçir |
| "Fırsatı sil" | Detay ⋯ → "Fırsatı Sil" | Geri alınamaz; ürün/aktivite/not sayısıyla ayrı onay |

## Sık hatalar
- Para birimini düzeltmeyi unutmak → kanban ve detayda USD görünür.
- Değer girip sonra ürün eklemek → değer ürün toplamıyla değişir; kullanıcıyı önceden uyar.
- Müşteri ID yerine müşteri adını yazmak → fırsat yanlış/boş müşteriye bağlanır.
- "Beklemede" aşamasına alınan fırsat kanban'da görünmez; linki rapora yaz.
