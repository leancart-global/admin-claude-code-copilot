# Playbook: Ana sayfaya component (blok/bölüm) ekle ("ana sayfaya şöyle bir component ekle")

Tetikleyiciler: "ana sayfaya slider/banner/hero ekle", "öne çıkan ürünler bölümü koy", "kategori ızgarası ekle", "kampanya geri sayımı", "bülten alanı", "şu bölümü en üste taşı", "X bölümünü gizle/kaldır", "ana sayfa tasarımını değiştir".
Harita: ../domain/screens/design/homepage-builder.md (ekran, butonlar, tuzaklar), ../domain/entities/homepage-components.md (blok tipleri ve alanları), ../domain/screens/content/media-library.md (görsel yükleme/picker), ../domain/screens/products/product-list.md + product-edit.md (ürün var mı / öne çıkan işareti), ../domain/screens/categories/category-list.md + category-edit.md (kategori var mı / görseli).
URL'ler locale öneksizdir: `{ADMIN_URL}/design/homepage`.

---

## 0. Kural hatırlatması
- **Yayındaki ana sayfada "taslak" yok:** durum "Yayında" ise tek kaydet butonu "Güncelle ve Yayınla"dır ve basıldığı an canlıya çıkar. Bu yüzden onay, bu butona basmadan **önce** alınır ve özet "canlıya çıkacak" diye açıkça yazılır.
- Editördeki değişiklikler kaydedilene kadar yalnız açık editördedir (yenileme/çıkış kaybettirir) — onay beklerken sayfadan ayrılma, yenileme.
- Medyaya dosya yüklemek kalıcıdır (sayfa kaydedilmese bile) → yüklemeyi de özete koy ve onayla.
- Ön koşul kayıt değişiklikleri (ürünü "Öne Çıkan" yapmak, kategoriye görsel eklemek, form yayınlamak) **ayrı** onaylı işlerdir.
- Kullanıcı açıkça "değiştir/şablon uygula" demedikçe **şablon uygulama** (tüm blokları siler) ve mevcut blokları silme.

## 1. İsteği çözümle → blok tipi + alan taslağı
1. Doğal dil → blok tipi: entity dosyasındaki "Doğal dil → blok tipi eşlemesi" tablosu. Belirsizse en yakın 1-2 seçeneği tek cümleyle sor (ör. "kayan çoklu slayt mı (Slayt Gösterisi), tek büyük görsel mi (Hero)?").
2. Konum: "en üste" → index 0; "ürünlerin altına" → o bloğun sonrası; belirtilmemişse **sona** ekle ve özette "konum: en alt (varsayılan)" yaz.
3. Dil kapsamı: çoklu dilli mağazada varsayılan dil mi, belirli dil mi, hepsi mi? Belirtilmemişse varsayılan görünüm; özette belirt (diğer dillerin kendi blok listesi varsa yeni blok orada **görünmez** — bkz. Adım 7).
4. Alan taslağı tablosu (bloğun entity tablosundan): kullanıcıdan gelenler + varsayılanlar. Tipik zorunlu-pratik alanlar:

| Blok | Mutlaka netleştir | Makul varsayılan |
|---|---|---|
| carousel (slider) | slayt sayısı, her slaytın görseli (+ mobil görsel), başlık/buton metni, link | autoplay açık, oklar+göstergeler açık, yükseklik `full`, metin konumu sol |
| hero | başlık, arka plan görseli veya renk, buton metni+link | height `medium`/`large`, overlay 50, text #ffffff |
| banner | görsel, başlık, buton metni+link | backgroundSize cover, renkler marka |
| products | kaynak (öne çıkan/yeni/çok satan/indirim/kategori/manuel), adet, başlık | grid, 4 sütun, fiyat+sepete ekle açık |
| categories | kaynak (ana/öne çıkan/manuel), adet | grid, 3 sütun, görseller açık |
| countdown | hedef tarih-saat (mağaza saat dilimi), başlık | tüm birimler açık |
| newsletter | başlık/açıklama | varsayılan metinler |
| features | layout (istatistik/logo/kart/liste), öğeler | center, 4 sütun |
| cta | başlık, açıklama, buton metni+link | renkler marka |
| text / image / video / button / columns / form | içerik / görsel / URL / form | entity'deki varsayılanlar |

Eksik zorunlu bilgileri **tek seferde** sor. Kullanıcı görsel vermediyse: medya kütüphanesinde mevcut bir görsel önerilebilir (adıyla) ya da dosya yolu istenir; görsel uydurma, dış URL tahmin etme.

## 2. Ekranı aç ve mevcut durumu oku (salt okunur)
1. `{ADMIN_URL}/design/homepage` → skeleton bitene kadar bekle ("Düzenleyici / Editor" sekmesi görünür).
2. Tam ekran şablon galerisi geldiyse ("Ana Sayfanızı Tasarlayın") → ana sayfa kaydı yok. Kullanıcıya bildir: bir şablon ("Boş Sayfa" dahil) seçilmeli; ilk kayıt yeni homepage oluşturur ve storefront ana sayfası yayınlanana kadar hata ekranı gösterir. Şablon seçimini onaylat.
3. `browser_snapshot` ile: durum rozeti (Taslak / Yayında), mevcut blok kartlarının sırası ve tipleri, dil seçici var mı. Bunu "önce" durumu olarak not et.

## 3. Veri bağımlılıklarını çöz (salt okunur kontroller)
| Blok/alan | Kontrol | Eksikse |
|---|---|---|
| products `featured` | `/products` listesinde "Öne Çıkan" işaretli aktif ürün var mı (product-list.md filtreleri / product-edit.md "Öne Çıkan Ürün" checkbox'ı) | Blok storefront'ta **boş/görünmez** olur → kullanıcıya söyle; ya ürünleri öne çıkan yap (ayrı onaylı iş, product-edit) ya da başka kaynak |
| products `sale` | özel fiyatlı aktif ürün var mı | aynı |
| products `category` | kategori mevcut + aktif + içinde aktif ürün | kategori seç/oluştur (category-create, ayrı onay) |
| products `manual` | her ürün adı/SKU ile aranabiliyor mu (ürün çoklu seçici araması) | bulunamayanları kullanıcıya listele |
| categories | aktif kategori var mı; `showImages` açıksa kategorilerin görseli var mı (category-list/edit) | görselsiz kartlar → kullanıcıya bildir |
| Görseller (hero/banner/carousel/image/features) | kullanıcı dosya verdi mi / kütüphanede var mı | Adım 4'te picker içinden yükle |
| Linkler (buton/slayt) | hedef ürün/kategori/sayfa bağlantı seçici aramasında çıkıyor mu | sayfa yoksa page-create (ayrı iş) veya Özel Bağlantı |
| form | `/content/forms`'ta yayınlanmış form | önce formu yayınla (ayrı iş) |
| countdown | tarih gelecekte mi | sor |

## 4. Bloğu ekle ve yapılandır
1. **Ekleme:**
   - Sona: araç çubuğundaki "Blok Ekle / Add Block" → arama kutusuna tip adını yaz (ör. "Slayt", "Banner", "Ürünler") → `menuitem`'a tıkla.
   - Belirli konuma: hedef bloğun altındaki hover ekleme noktasındaki "Blok Ekle" (hover gerekir); zorsa sona ekleyip Adım 5 ile taşı (daha deterministik).
   - Alternatif: "Bölüm Ekle / Add Section" → hazır preset (ör. "Öne Çıkan Ürünler" = products featured 8 adet 4 sütun). Preset her zaman **sona** ekler.
2. **Ayar panelini aç:** yeni kartın üstüne gel/tıkla → `aria-label` "{blockName} bloğunun ayarlarını düzenle" (ör. "Slayt Gösterisi bloğunun ayarlarını düzenle") ya da karta çift tık. Sağda "{blockName} Ayarları" paneli açılır.
3. **Alanları doldur** (entity tablosundaki sıra ve locator'larla):
   - Input/Textarea: `fill`. Renk: yanındaki metin input'una hex yaz.
   - Select: tetikleyici butona tıkla → `option`'a tıkla (Enter kullanma).
   - Switch/Checkbox: mevcut durumu snapshot'tan oku, gerekiyorsa tıkla.
   - Bağlantı seçici: combobox'a tıkla → arama input'una hedef adını yaz → ilgili gruptaki sonuca tıkla; harici URL için "Özel Bağlantı" input'una yaz → "Ekle".
   - Ürün/kategori çoklu seçim: combobox → ad/SKU yaz → sonucun gelmesini bekle (`browser_wait_for`) → `option`'a tıkla; sıra = seçim sırası.
   - **Görsel:** alanın "Gözat / Browse" butonu → dialog "Medya Seç" → mevcutsa "Göz At" sekmesinde ara ve seç; yoksa "Yükle / Upload" sekmesi → `browser_file_upload` (kullanıcının verdiği yol) → yükleme bitince Browse'a döner ve dosya seçili gelir → **"Seç / Select"**'e bas. Önizleme kutusunda görsel belirmeli.
   - Carousel: gereken slayt sayısına göre "Slayt Ekle" / slayt çöp kutusu ("Slaytı kaldır"); her slaytta görsel + (varsa) mobil görsel + başlık + buton + link.
   - Countdown: `datetime-local` input'a `YYYY-MM-DDTHH:mm` (mağaza saat dilimi).
4. Ayar panelini Esc ile kapat (Uygula yok, değişiklikler formda). Kart önizlemesinde değerlerin göründüğünü snapshot ile doğrula.

## 5. Sırala / gizle / kaldır (istenmişse)
- Taşıma: kartın "yukarı taşı"/"aşağı taşı" butonlarıyla adım adım (sürükle-bırak yerine; deterministik). Her tıklamadan sonra sırayı snapshot'tan teyit et.
- Gizleme: "{blockName} bloğunu gizle" (kart soluklaşır; storefront'ta görünmez, ayarlar korunur).
- Silme: "{blockName} bloğunu sil" → AlertDialog "Sil". Silme ayrı onay ister (CLAUDE.md kural 5) — özet aşamasında listele, uygulamayı onaydan sonra yap ya da onaya kadar silme.

## 6. Önizle
1. Araç çubuğu cihaz butonları "Mobil / Mobile" ve "Masaüstu / Desktop" ile tuvali daralt/genişlet; "Önizleme / Preview" toggle ile admin önizlemesi (gizli bloklar hariç). Gerekirse ekran görüntüsü al (özet için).
2. Bu önizleme vitrin görünümü değildir (ürün blokları yer tutucu gösterir: "{limit} ürün ({source}…)") — özette belirt.

## 7. Özet → ONAY BEKLE
Ortam (config/local.json) + şu tabloyu göster, açık "evet/onaylıyorum" bekle:

| | |
|---|---|
| Ekran | Ana Sayfa Tasarımcısı (`/design/homepage`) |
| Kapsam (dil) | Varsayılan / {dil} |
| İşlem | Yeni blok: **{tip tr adı}** — konum: {n}. sıra ("{önceki blok}" sonrası) |
| Alanlar | alan → değer (varsayılanları "varsayılan" diye işaretle) |
| Görseller | dosya adı → yüklenecek/yüklendi (kütüphaneye kalıcı) |
| Diğer değişiklikler | taşınan/gizlenen/silinen bloklar |
| Kaydetme şekli | Durum Taslak ise: "Kaydet" (canlıya çıkmaz) **veya** "Yayınla / Go Live". Durum Yayında ise: **"Güncelle ve Yayınla" — anında canlı** |
| Bilinen etkiler | ürün/kategori blokları vitrine en geç ~5 dk içinde yansır; kaynakta ürün yoksa blok görünmez; çoklu dilde diğer diller etkilenmez/etkilenir |

Kullanıcı "taslak olarak kaydet" isterse ama sayfa Yayında ise: mümkün olmadığını söyle; seçenekler: (a) şimdi canlıya al, (b) bloğu **gizli** ekleyip "Güncelle ve Yayınla" (canlıda görünmez, sonra göster), (c) iptal.

## 8. Kaydet / Yayınla
- Onaylanan butona bas: "Kaydet / Save" | "Yayınla / Go Live" | "Güncelle ve Yayınla / Update & Publish" (yalnız onaylanan).
- Toast'ı oku: "Değişiklikleriniz kaydedildi." / "Ana sayfanız artık yayında." (veya dil kapsamlı varyantı). Hata toast'ında homepage-builder.md "Aksiyonlar" altındaki eşlemeye göre düzelt; validasyon hatasında ilgili bloğu (features uzunluk sınırları / package-comparison kaynak seçimi) aç ve düzelt → yeniden **özet+onay** (değer değiştiyse).
- Çoklu dilde ve kullanıcı "tüm dillerde" dediyse: her dil için dil seçicide geç → "Senkronize et..." → varsayılan kaynağı seç (yapıyı alır, çevirileri korur) → yeni bloğun metinlerini o dilde düzenle → o dil için yayın. Her dil ayrı özet/onay (veya kullanıcı toplu onay verdiyse tek).

## 9. Doğrula
1. Admin: `/design/homepage` yenile → blok doğru konumda, ayarları kalıcı; rozet beklenen durumda; "Kaydedilmemiş Değişiklikler" yok.
2. Vitrin (yayınlandıysa): "Mağazayı Önizle / Preview Store" ya da `{STOREFRONT_URL}` → yeni bölüm beklenen konumda başlığı/görseli/butonuyla görünmeli (carousel ilk bloksa sayfanın en üstünde manşet olarak, öne çıkan ürünler ilk ürün bloğuysa sekmeli bölüm). Mobil genişlikte de (`browser_resize` 375px) kontrol et (mobil görsel, sütun düşüşü).
3. Görünmüyorsa sırayla: blok `isVisible`? sayfa gerçekten Yayında mı? doğru dil mi (`?lang`/store view prefix)? ürün/kategori kaynağı boş mu? ~5 dk yansıma süresi doldu mu? Sonucu kullanıcıya raporla.
4. Rapor: eklenen blok, konum, yüklenen medya URL'leri, storefront linki, bekleyen işler (ör. "öne çıkan ürün yok — işaretlemek ister misiniz?"). Haritada fark gördüysen `domain/CHANGELOG.md`.

## Varyasyonlar
- **"X bölümünü kaldır/gizle":** Adım 2 → hedef kartı içerik metniyle bul → Adım 5 → Adım 7-9 (silme ayrı onay).
- **"Sıralamayı değiştir":** Adım 5 (yukarı/aşağı) → özet "önce/sonra sırası" → 8-9.
- **"Mevcut bannerın görselini/linkini değiştir":** kartı bul → ayarlar → alanı değiştir → 7-9.
- **"Ana sayfayı baştan tasarla / şablon uygula":** "Şablonlar ve Bölümler" sekmesi → şablon → "Değiştir" dialogu **tüm blokları siler**; önce mevcut blokları özette listele, ayrıca onay al.
