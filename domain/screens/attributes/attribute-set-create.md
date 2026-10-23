# Öznitelik Seti Oluştur (Create Attribute Set)
- URL: `{ADMIN_URL}/attributes/sets/new` (görünüm ve akış edit ekranından farklıdır: önce şablon seçimi, sonra form)
- Amaç: Yeni set oluşturmak: (a) sektör şablonundan (preset) tek tıkla, ya da (b) "Sıfırdan Başla" ile ad/kod + bölümler + attribute ataması.
- Yetki: Listedeki düğme `products` create yetkisiyle görünür. Kaydetme `products:write` (+ diyalogdan attribute oluşturma `attributes:write`) ister.
- Veri / API:
  - Yükleme: seçilebilir attribute listesi.
  - Diyalogdan attribute oluşturma ("Yeni Oluştur"): `POST /attributes` — **diyalogda anında** kaydolur (set kaydından bağımsız).
  - Preset: eksik her attribute oluşturulur (kod zaten varsa mevcut olan kullanılır), ardından set otomatik oluşturulur.
  - Kaydet (sıfırdan): `POST /attribute-sets` — ad, kod, açıklama, sıra, durum, varsayılan, bölümler ve atanmış attribute'lar (bölüm, sıra, zorunluluk). **Kategori ataması bu ekranda yok.**

## Ön koşullar ve bağımlılıklar
- Sete girecek attribute'lar ya önceden var olmalı ([attribute-create.md](attribute-create.md) — tam bayrak/seçenek kontrolü için **önerilen yol**) ya da diyalogdaki "Yeni Oluştur" ile minimal yaratılır (yalnız label+type; seçenek, bayrak yok — sonra [attribute-edit.md](attribute-edit.md) ile tamamlanmalı).
- Set kodu benzersiz olmalı → önce [attribute-set-list.md](attribute-set-list.md)'de ara.
- Kategori ataması gerekiyorsa kayıttan sonra [attribute-set-edit.md](attribute-set-edit.md) → Kategoriler sekmesi (kategoriler önceden var olmalı: [../categories/category-create.md](../categories/category-create.md)).
- Entity: [../../entities/attribute-set.md](../../entities/attribute-set.md).

## Yerleşim
**Adım 1 — Şablon seçimi**
- Başlık "Öznitelik Seti Oluştur", alt "Bir sektör şablonu seçin veya sıfırdan başlayın"; geri ok (→ liste).
- Kart "Sektör Şablonları / Industry Presets": ilk kutu **"Sıfırdan Başla / Start from Scratch"** ("Özel bir öznitelik seti oluşturun"); sonra 10 preset kartı: Moda Ürün Seti, **Elektronik Ürün Seti** (📱), Gıda, Ev, Güzellik, Kitap, Spor, Mücevher, Otomotiv, Oyuncak.
- Preset kartına tıklayınca kart genişler (önizleme): "Bölümler ({n})" rozetleri, "Ürün Alanları ({n})" listesi — her alan için ✓ "Mağazanızda mevcut", + "Oluşturulacak", ⚠ "Mevcut (farklı tür)"; satır üzerine gelince ✕ "Setten kaldır". Düğmeler "İptal" ve **"Şablonu Uygula ({n} oluşturulacak)"**.
- Uygularken tam ekran katman "Ürün alanları ekleniyor..." + ilerleme metni. Kısmi hata diyaloğu "Neredeyse tamam!" → "Baştan Başla" / "Başarısızları Tekrar Dene ({n})" / "Yine de Devam Et".

**Adım 2 — Form**
- Başlık "Öznitelik Seti Oluştur", alt "Sıfırdan oluşturuluyor" ya da "{preset} şablonuna dayalı"; geri ok (→ adım 1, girilenler korunur); sağda **"Kaydet / Save"**.
- Sekmeler: **"Temel Bilgiler / Basic Info"**, **"Öznitelikler ({n}) / Attributes ({n})"**.
  - Temel Bilgiler: sol kart "Set Bilgileri" (Ad, Kod, Açıklama, Sıralama); sağ kart "Durum" (Aktif, Varsayılan Set).
  - Öznitelikler: kart "Öznitelik Seti Oluşturucu / Attribute Set Builder", alt "Atanmış Öznitelikler ({n})"; düğmeler **"Bölüm Ekle / Add Section"** ve **"Öznitelik Ekle / Add Attribute"**. Altında akordeonlar: "Bölüm Yok" (bölümsüz) + her bölüm (boş bölümler de görünür: "Bu bölümde öznitelik yok…").

## Alanlar
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Temel Bilgiler | Set Adı * / Set Name * | `name` | text | evet | 1–255 | placeholder "Set adını girin" / "Enter set name" | Yazdıkça kodu türetir (kod elle değiştirilmediyse). |
| Temel Bilgiler | Set Kodu * / Set Code * | `code` | text (mono) | evet | 1–60, küçük harfle başlar; yalnız küçük harf, rakam, alt çizgi | placeholder "set_kodu" / "set_code" | Açıklama "Benzersiz tanımlayıcı. Addan otomatik oluşturulur." Kod sonradan değiştirilemez → **elle ASCII yaz** (ör. `cep_telefonu`). |
| Temel Bilgiler | Açıklama / Description | `description` | textarea | hayır | ≤1000 | placeholder "Açıklama girin" | |
| Temel Bilgiler | Sıralama / Sort Order | `sortOrder` | number | hayır | tam sayı ≥0, 0 | `getByRole('spinbutton', { name: 'Sıralama' })` | "Düşük değerler önce görünür" |
| Durum | Aktif / Active | `isActive` | switch | – | true | `getByRole('switch', { name: 'Aktif' })` | |
| Durum | Varsayılan Set / Default Set | `isDefault` | switch | – | false | `getByRole('switch', { name: 'Varsayılan Set' })` | Açarsan mevcut varsayılan setin varsayılanlığı kalkar. |
| Öznitelikler | Bölüm Ekle → dialog "Bölüm Ekle / Add Section": Bölüm Adı * / Section Name * | – | text | evet | boş olamaz | placeholder "Bölüm adı" / "Section name" (label erişilebilir ada bağlı değil) | Kod alanını otomatik doldurur. |
| Öznitelikler | dialog: Bölüm Kodu / Section Code | `sections[].code` | text (mono) | (otomatik) | 2–60, küçük harfle başlar; yalnız küçük harf, rakam, alt çizgi; set içinde benzersiz | placeholder "ör. physical_properties" | "Addan otomatik oluşturulur. Benzersiz olmalıdır." Kodu elle ASCII yaz (ör. `ekran`, `kamera`, `bellek_depolama`). Aynı kod varsa "Bölüm Ekle" disabled. |
| Öznitelikler | dialog düğmeleri | – | button | – | – | `getByRole('dialog').getByRole('button', { name: 'Bölüm Ekle' })`, "İptal" | Bölüm sırası = ekleme sırası (bu ekranda bölüm sırası düzenlenemez; edit ekranında düzenlenir). |
| Öznitelikler | Öznitelik Ekle → dialog "Sete Öznitelik Ekle / Add Attribute to Set": Öznitelik * / Attribute * | – | select (combobox + listbox) | evet | yalnız henüz eklenmemiş attribute'lar, "Etiket (kod)" biçiminde | `getByRole('combobox', { name: /Öznitelik/ })` (id `select-attribute`) → `getByRole('option', { name: /\(renk\)/ })` | Hiç seçilebilir attribute yoksa dialog doğrudan "Yeni Oluştur" modunda açılır ("Henüz eklenecek bir özniteliğiniz yok…", "İlk özniteliğinizi oluşturun"). |
| Öznitelikler | dialog: Bölüm (İsteğe Bağlı) / Section (Optional) | – | select | hayır | "Bölüm Yok" ya da bölüm adları | id `select-section`, `getByRole('combobox', { name: 'Bölüm (İsteğe Bağlı)' })` | Sette bölüm kullanıyorsan her attribute'u bir bölüme ata. |
| Öznitelikler | dialog düğmeleri: "Yeni Oluştur / Create New", "İptal", "Öznitelik Ekle / Add Attribute" (seçim yoksa disabled) | – | button | – | – | `getByRole('dialog').getByRole('button', { name: 'Öznitelik Ekle' })` | Yalnız forma ekler (kayıt Kaydet ile). |
| Öznitelikler | "Yeni Oluştur" modu: Etiket * / Label * | – | text | evet | koddan türetilir; harfle başlamazsa toast "Lütfen harf ile başlayan…" | id `new-attr-label`, placeholder "ör. Malzeme, Renk, Beden" | Kod bu diyalogda düzenlenemez; kodu kontrol etmek istiyorsan attribute'u önce [attribute-create.md](attribute-create.md) ile oluştur. |
| Öznitelikler | "Yeni Oluştur": Tür * / Type * | – | select | evet | tip listesi İngilizce etiketlerle (Text, Number, Yes/No, Dropdown, Multi-Select, Date, …, Color, JSON) | id `new-attr-type` → option "Dropdown" | Giriş tipi otomatik atanır (Dropdown→select, Color→color…). |
| Öznitelikler | "Yeni Oluştur": Bölüm (İsteğe Bağlı) | – | select | hayır | | id `new-attr-section` | |
| Öznitelikler | "Yeni Oluştur" düğmeleri: "Seçime Dön", "İptal", **"Oluştur ve Ekle / Create and Add"** | – | button | – | – | | **Anında kaydeder** — set kaydedilmese bile attribute kalıcı olarak oluşur. Toast "Öznitelik oluşturuldu ve sete eklendi". Varsayılanlar: Aramada Kullan açık, Katmanlı Navigasyonda Kullan açık, Katalog Sayfalarında Görünür kapalı, kapsam Mağaza Görünümü, seçenek yok. |
| Öznitelikler (satır) | ↑ / ↓ | – | ikon buton | – | – | satırdaki ilk iki buton (aria yok) | Sıralama; sonucu kayıttan sonra edit ekranında doğrula. |
| Öznitelikler (satır) | bölüm seçimi | `section` | select | – | "Bölüm Yok" | satır içindeki combobox | Attribute'u başka bölüme taşır. |
| Öznitelikler (satır) | ✕ (kaldır) | – | ikon buton | – | – | satırdaki son buton | Attribute'u setten çıkarır. |
| Preset adımı | Şablonu Uygula ({n} oluşturulacak) / Apply Preset ({n} to create) | – | button | – | – | `getByRole('button', { name: /Şablonu Uygula/ })` | Tıklama = eksik attribute'ları **ve** seti oluşturur, onay sormaz. |

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay | Sonuç |
|---|---|---|---|
| Sıfırdan Başla | boş form adımına geçer | – | |
| Preset kartı | önizlemeyi aç/kapat | – | yalnız önizleme |
| Şablonu Uygula (…) | eksik attribute'lar + set oluşturulur (kod/ad preset'in İngilizce değerleri, ör. `electronics_product_set` / "Electronics Product Set") | **uygulama sormaz** → önizlemeyi kullanıcıya göster, onay al | Başarı toast `"Electronics Product Set" attribute set created with N fields.` → `/attributes/sets`. Set oluşturulamazsa toast `Fields created but attribute set failed: …` ve form adımına düşer (attribute'lar oluşmuş kalır). |
| Kaydet / Save | form doğrulanır → set oluşturulur | uygulama sormaz → özet + onay | Toast "Öznitelik seti başarıyla oluşturuldu" → `/attributes/sets`. Hata: toast başlığında sunucu mesajı (ör. "Attribute set cep_telefonu already exists", "Duplicate section codes: …", "Section code must start with a lowercase letter…") ya da "Kaydedilemedi. Lütfen biraz sonra tekrar deneyin." |
| Oluştur ve Ekle (dialog) | attribute anında oluşturulur | – (Claude yine de plan onayına dahil etmeli) | |
| Geri ok (form adımı) | preset adımına döner | uyarı yok | |

## Yan etkiler
- Diyalogdan/preset ile oluşturulan attribute'lar set kaydı iptal edilse de kalır (temizlik gerekebilir; sette değilse listeden silinebilir).
- Varsayılan Set açık kaydetmek önceki varsayılan seti varsayılan olmaktan çıkarır.

## Tuzaklar
- Set kodu ve bölüm kodu sonradan değiştirilemez; otomatik türetileni kabul etmeden önce kontrol et, gerekirse elle ASCII yaz.
- Bölüm kodu en az 2 karakter olmalı ve harfle başlamalı.
- "Yeni Oluştur" diyaloğu seçenek ekleyemez; select/color attribute'ları burada oluşturursan seçeneksiz kalır → sonradan edit gerekir. Tercih: attribute'ları önce [attribute-create.md](attribute-create.md) ile tam oluştur.
- Preset'in `brand` attribute'u bir select attribute'tur, Marka kaydı değil; cep telefonu için ayrıca Marka ekranını kullan, preset'teki `brand`'i önizlemeden ✕ ile çıkar.
- Preset adları/kodları İngilizce ve sabit (`electronics_product_set`); aynı preset ikinci kez uygulanırsa set kodu zaten var olduğu için set oluşturulmaz → form adımına düşer.
- Kategori ataması bu ekranda yok; kayıttan sonra edit ekranında.
- Kaydetmeden çıkışta uyarı yok.

## Doğrulama
- Toast "Öznitelik seti başarıyla oluşturuldu" ve `/attributes/sets`.
- Listede kodla ara: Öznitelikler rozeti = eklenen sayı.
- Edit ekranını aç → Öznitelikler sekmesi: bölümler, her attribute'un bölümü ve sırası doğru mu.
- (İsteğe bağlı) Yeni ürün formunda ([../products/product-create.md](../products/product-create.md)) "Nitelik Seti"ni seçip bölüm kartlarının ve tüm attribute'ların geldiğini gözlemle (kaydetmeden çık). Not: setteki zorunlu attribute'lar ürünün **taslak kaydını bile** engeller.
