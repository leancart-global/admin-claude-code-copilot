# Panel (Dashboard) ve Günlük Özet (Daily Digest)

| URL | Sayfa başlığı (tr / en) | Menü |
|---|---|---|
| `{ADMIN_URL}/` | "Panel / Dashboard" | Sol menü en üst "Panel / Dashboard"; girişten sonra açılan sayfa |
| `{ADMIN_URL}/dashboard/digest` | "Günlük Özet / Daily Digest" | Menüde yok; yalnız URL ile açılır |

- Amaç: Mağazanın seçilen dönemdeki performansını (gelir, sipariş, müşteri, dönüşüm, ürün/stok), bugünkü canlı
  aktiviteyi, son siparişleri ve en iyi ürün/müşterileri tek ekranda görmek. Günlük Özet: dün/bugün için 4 ana metrik,
  "dikkat gerektiren" işler, fırsatlar ve yarın için ciro tahmini. **İkisi de salt okunurdur** (istisnalar: aşağıda
  "Kurulum listesini kapat").
- Entity: metrik tanımları [../../entities/report.md](../../entities/report.md); sipariş [../../entities/order.md](../../entities/order.md).
- Yetki: veriler `analytics:read` ister. Yetki yoksa kartlar hata/boş durumu gösterir.
- Kişisel veri: "Son Siparişler" ve "En İyi Müşteriler" tablolarında müşteri adı görünür. Rapora aktarırken ad yerine
  sipariş numarası / sayı ver.
- İlişkili ekranlar: [../analytics/analytics-overview.md](../analytics/analytics-overview.md) (daha ayrıntılı KPI),
  [../analytics/realtime.md](../analytics/realtime.md) (canlı aktivite), [../orders/orders-analytics.md](../orders/orders-analytics.md),
  [../customers/customers-analytics.md](../customers/customers-analytics.md), [../inventory/inventory-overview.md](../inventory/inventory-overview.md).

## Ön koşullar ve bağımlılıklar
- Ön koşul yok. Rakamlar siparişlerden, vitrin ziyaretlerinden (oturum) ve katalogdan hesaplanır; yeni mağazada
  kartlar 0 ve boş durum metinleri gösterir.
- Dönüşüm ve ziyaretçi rakamları için vitrinde ziyaretçi izlemenin çalışıyor olması gerekir; çerez onayı vermeyen
  ziyaretçiler bu rakamlara girmez (ayrı sayım: [../analytics/analytics-overview.md](../analytics/analytics-overview.md)).

## 1. Panel (`/`)

### Yerleşim (yukarıdan aşağı)
1. Başlık "Panel" + "Lean Cart yönetim panelinize hoşgeldiniz. İşte mağazanızın performans özeti." Sağda butonlar:
   "Yenile / Refresh", "Mağazayı Gör / View Store" (vitrin adresi tanımlı değilse pasif + açıklama), "Ürün Ekle / Add Product".
2. **Kurulum listesi** (yalnız kurulumu bitmemiş yeni mağazada): "Mağaza Kurulumunu Tamamlayın / Complete Your Store
   Setup", "{completed} / {total} tamamlandı", ilerleme yüzdesi, "Yaklaşık {minutes} dakika kaldı", "Kapat / Dismiss".
   Adımlar: "İlk ürününüzü ekleyin" → `/products/new`, "Markanızı ayarlayın" → `/settings/branding`, "Kategoriler
   oluşturun" → `/categories`, "Ödeme yöntemlerini yapılandırın" → `/settings/payments`, "Kargo yöntemlerini ekleyin"
   → `/settings/shipping`, "Mağazanızı önizleyin" (vitrini açar). Ürün/kategori/sipariş adımları mağaza verisinden
   otomatik işaretlenir.
3. **Boş menü uyarısı** (yayınlanmış, dolu bir ana menü yoksa): "Mağazanızın üst menüsü boş" + "Menü oluştur / Create
   menu" → `/design/navigation` ([../design/navigation.md](../design/navigation.md)).
4. **Mağaza aktivitesi / Store activity** şeridi (bugün, canlı): "Çevrimiçi Ziyaretçi", "Aktif Sepet", "Bugünün Geliri",
   "Bugünün Siparişleri", "Bekleyen / Pending", "İşleniyor / Processing" + "{time} itibarıyla". Okunamayan değer "—"
   gösterir; üzerine gelince "Kullanılamıyor: …" açıklaması (aria-label).
5. **Dönem / Period** seçici (Select).
6. **KPI kartları** (6 adet): "Toplam Gelir / Total Revenue", "Siparişler / Orders", "Müşteriler / Customers",
   "Dönüşüm Oranı / Conversion Rate", "Ort. Sipariş Değeri / Avg Order Value", "Ürünler / Products" (+ rozetler
   "{n} düşük stok", "{n} stokta yok"). İlk beşinde önceki döneme göre değişim yüzdesi ve karşılaştırma etiketi.
7. **Envanter Uyarıları / Inventory Alerts** (stokta olmayan/düşük stok varsa): "{n} ürün stokta yok" →
   `/inventory?filter=out_of_stock`, "{n} ürün düşük stokta" → `/inventory?filter=low_stock`, "Envanteri Gör".
8. **Trend grafikleri** (2×2): "Satış Özeti / Sales Overview" (gelir), "Sipariş Trendleri / Order Trends", "Müşteri
   Büyümesi / Customer Growth" (yeni müşteri), "Dönüşüm Oranı". Veri yoksa "Bu dönem için veri bulunamadı".
9. **Son Siparişler / Recent Orders** (bugünün son 5 siparişi: no, müşteri, tutar, göreli zaman, durum rozeti) +
   "Tüm Siparişleri Gör" → `/orders`. Satırlar tıklanmaz. Boş: "Son sipariş yok".
10. **Hızlı İşlemler / Quick Actions**: "Yeni Ürün Ekle" → `/products/new`, "Sipariş Oluştur" → `/orders/new`, "Müşteri
    Ekle" → `/customers/new`, "Envanter Yönet" → `/products?tab=inventory`, "Raporları Gör" → `/analytics/reports`.
11. **En İyi Ürünler** grafiği ("Satış adedine göre en çok satan ürünler", ilk 6).
12. **En İyi Ürünler / En İyi Müşteriler** tabloları: ürün (#, Ürün, Satılan Adet, Gelir); müşteri (Müşteri, Siparişler,
    Toplam Harcama, Son Sipariş; ilk 5). Boş: "Ürün verisi bulunamadı" / "Müşteri verisi bulunamadı".

### Alanlar
| Label (tr / en) | Kontrol tipi | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|
| Dönem / Period | Select (shadcn) | **Son 30 Gün** | KPI kartlarının üstündeki combobox | "Bugün", "Son 7 Gün", "Son 30 Gün", "Son 90 Gün". Seçim kayıt değiştirmez; sayfa yenilenince varsayılana döner |

Karşılaştırma etiketleri: Bugün → "düne göre"; Son 7 Gün → "önceki haftaya göre"; Son 30 Gün → "önceki aya göre";
Son 90 Gün → "geçen çeyreğe göre". Karşılaştırma dönemi, seçilen dönemle aynı uzunlukta ve hemen öncesindeki aralıktır.

### Hangi rakam neyi gösterir
| Kart | Dönem | Tanım (kullanıcının gördüğü) |
|---|---|---|
| Toplam Gelir | seçili dönem | Dönemde verilen siparişlerin tutarı; iptal edilen ve tamamen iade edilen siparişler hariç, kısmi iadeli siparişler dahil. Ayrıntı: [report.md](../../entities/report.md) |
| Siparişler | seçili dönem | Aynı kurala göre sayılan sipariş adedi |
| Ort. Sipariş Değeri | seçili dönem | Toplam Gelir ÷ Siparişler |
| Dönüşüm Oranı | seçili dönem | Siparişler ÷ vitrin oturumları (%) |
| Müşteriler | seçili dönem | Dönemde (sayılan) sipariş veren farklı müşteri sayısı; toplam kayıtlı müşteri değildir (o sayı için [../customers/customers-analytics.md](../customers/customers-analytics.md)) |
| Ürünler | anlık | Katalogdaki ürün sayısı + düşük stok / stokta yok sayıları |
| Mağaza aktivitesi şeridi | **bugün** (dönemden bağımsız) | Çevrimiçi ziyaretçi = son ~1 dakikada aktif ziyaretçi; Aktif Sepet = şu an açık sepetler; Bekleyen/İşleniyor = o durumdaki sipariş sayısı |
| Son Siparişler | bugün | Bugünün en yeni 5 siparişi |

- Rakamlar ~5 dakikaya kadar gecikmeli olabilir; "Yenile" veriyi yeniden okur ama bu gecikmeyi tamamen kaldırmayabilir.
- Tutarlar dönemde en çok kullanılan para birimiyle gösterilir.

### Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Yenile | Dönem verisi ve aktivite şeridi yeniden okunur | "Yenile" (başarı) / "Son etkinlik yenilenemedi. Lütfen birazdan tekrar deneyin." |
| Mağazayı Gör | Vitrini yeni sekmede açar | — |
| Ürün Ekle / Hızlı İşlemler | İlgili oluşturma ekranına gider (kayıt açmaz) | — |
| KPI hata durumunda "Tekrar dene" | Veriyi yeniden yükler | — |
| Kurulum listesi → Kapat → diyalog "Kurulum Listesini Kapat?" ("Kontrol listesi tekrar gösterilmeyecektir.") → "Kapat" (vazgeç: "Göstermeye Devam Et") | Liste kalıcı olarak gizlenir (kullanıcı/mağaza tercihi olarak saklanır) | — |

## 2. Günlük Özet (`/dashboard/digest`)

### Yerleşim
1. Başlık "Günlük Özet" + "Dünkü performansınız ve bugün yapmanız gerekenler". Sağda gün sekmeleri (role=tablist,
   aria-label "Gösterilen / Showing"): **"Dün / Yesterday" (varsayılan)**, "Bugün / Today"; yenile ikonu
   (aria-label "Tekrar dene / Try again").
2. 4 ana metrik kartı: "Ciro / Revenue", "Sipariş / Orders", "Ziyaretçi / Visitors", "Dönüşüm / Conversion"; altında
   değişim % ve "düne göre". Değişim ±%2'den küçükse "sabit" (gri) görünür; önceki gün 0 ise "—".
3. **"Dikkatinizi gerektiren / Needs your attention"** (en çok 5, önem sırasıyla; rozet "Yüksek/Orta/Düşük") + her
   satırda "İncele / View". Mesajlar: "{n} ürün stokta azaldı", "Son 24 saatte {n} ödeme başarısız oldu", "{n} iade
   işleminiz bekliyor", "{n} yorum incelemenizi bekliyor", "{n} sipariş dolandırıcılık incelemesi bekliyor".
   Boş: "Her şey yolunda — bugün acil bir şey yok".
4. **"Bugünün fırsatları / Today's opportunities"** (en çok 3) + "Şimdi ele al / Take action": "En çok görüntülenen
   tükenen ürününüz bu hafta {n} görüntülenme aldı", "Son 24 saatte {tutar} değerinde bir sepet terk edildi",
   "{n} müşteri henüz satmadığınız bir şeyi aradı". Boş: "Yeterli veri toplandığında fırsatları burada göstereceğiz".
5. **"Yarın için tahmin / Tomorrow's outlook"** ("Son 30 günün ortalamasına göre"): "Beklenen ciro" + "Aralık ±%".
   Yetersiz veri: "Güvenilir bir tahmin için en az 14 günlük veri gerekli".
6. Hata: "Günlük özet yüklenemedi. Lütfen tekrar deneyin." + "Tekrar dene". Önbellek uyarısı: "Önbellekteki veriler
   gösteriliyor — şu anda canlı sonuçlara ulaşılamıyor."

### Kurallar
- Gün sınırı **UTC günüdür** (Türkiye saatiyle 03:00 → ertesi gün 03:00). "Bugün" kısmi gündür.
- Karşılaştırma her zaman bir önceki gündür ("Dün" sekmesinde: önceki gün).
- Ziyaretçi = o gün başlayan vitrin oturumu sayısı; Dönüşüm = Sipariş ÷ Ziyaretçi.
- Rakamlar ~5 dakikaya kadar gecikmeli olabilir.
- "İncele" / "Şimdi ele al" yalnız ilgili listeye/ekrana gider; kendi başına kayıt değiştirmez.

## Onay zamanlaması (kural 2/5/6)
- Panel ve Günlük Özet okumaları, dönem/gün seçimi, Yenile: kalıcı değişiklik yok, onay gerekmez.
- **Kurulum listesini "Kapat"**: kalıcı bir tercih kaydı (liste bir daha gösterilmez) → kullanıcı açıkça istemedikçe
  basma; isterse tek satırlık özetle onay al.
- Hızlı işlem butonları yalnız oluşturma ekranını açar; oradaki kayıt kendi playbook'unun onay kuralına tabidir.
- Dış sisteme yazan, e-posta gönderen aksiyon yok.

## Yan etkiler
- Panel açıldığında kurulum listesinin ilerlemesi mağaza verisine göre kendiliğinden güncellenir (kullanıcı eylemi değil).

## Tuzaklar
- "Son 30 Gün" takvim ayı değildir: şu andan geriye 30×24 saat. "Geçen ay" gibi takvim dönemi için
  [../orders/orders-list.md](../orders/orders-list.md) tarih filtresini ("Geçen Ay") kullan; bkz. [../../../playbooks/sales-report.md](../../../playbooks/sales-report.md).
- Aktivite şeridi dönem seçiminden etkilenmez; "bugün kaç sipariş" için şeridi ya da Günlük Özet → "Bugün" sekmesini oku.
- Panelin "Bugün"ü yerel gün başlangıcına, Günlük Özet'in günü UTC gününe göre olabilir; iki ekranın "bugün" rakamı
  farklı çıkarsa bunu kullanıcıya belirt (doğrulanmadı).
- Kart/tablo değerlerini sayfa tam yüklenmeden okuma: iskelet (skeleton) kartlar kaybolana kadar bekle.
- Rakamları kullanıcıya "panelin gösterdiği değer" olarak aktar; muhasebe/fatura toplamı değildir.

## Doğrulama
- `browser_snapshot` ile KPI kartlarının başlık + değer + değişim metnini oku; dönem değiştirdiysen seçicinin
  değerini ve kartların yenilendiğini kontrol et.
- Raporlarken dönem adını ve karşılaştırma etiketini birlikte ver ("Son 30 Gün: Toplam Gelir ₺…, önceki aya göre +%…").
