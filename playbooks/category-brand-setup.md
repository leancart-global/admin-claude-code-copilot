# Playbook: Kategori ağacı ve marka kurulumu

Örnek istekler: "Elektronik > Telefonlar > Akıllı Telefonlar kategorilerini aç", "Apple ve Samsung markalarını ekle",
"cep telefonu kategorisi oluştur ve logolu Xiaomi markası ekle".

Haritalar: [category-list](../domain/screens/categories/category-list.md) · [category-create](../domain/screens/categories/category-create.md) ·
[category-edit](../domain/screens/categories/category-edit.md) · [category-detail](../domain/screens/categories/category-detail.md) ·
[brand-list](../domain/screens/brands/brand-list.md) · [brand-create](../domain/screens/brands/brand-create.md) · [brand-edit](../domain/screens/brands/brand-edit.md) ·
entity'ler [category](../domain/entities/category.md), [brand](../domain/entities/brand.md).

## Kurallar
- Kategori oluşturmak için **≥1 aktif store view** gerekir (yoksa form açılmaz → `/settings/store-views`; kullanıcıya sor, kendiliğinden oluşturma).
- Ağaç **yukarıdan aşağı** kurulur: önce ebeveyn kaydedilir, sonra çocuk `?parentId=` ile. Maks 5 seviye.
- Slug mağazada benzersiz; arşivlenmiş (silinmiş) kategoriyle aynı slug yeni kayıt yerine **eskisini geri getirir**.
- Sıralama sürükle-bırak değil, "Sıralama" sayısıyla (küçük önce). Taşıma = "Üst Kategori"yi değiştirmek.
- Silme: alt kategorisi ya da ürünü olan kategori silinemez.
- Marka: ad benzersiz (büyük/küçük harf, noktalama, boşluk farkı yok sayılarak benzer ad reddedilir); ürün formunda marka alanı henüz yok (geliştiriliyor) — "ürüne marka ata" isteğinde bunu söyle.

## Adım 1 — Anla ve öner
- Kategori yolu(ları)nı ağaç olarak çıkar (ör. `Elektronik › Telefonlar › Akıllı Telefonlar`). Her düğüm için: ad, slug önerisi (Türkçe transliterasyon: `akilli-telefonlar`), durum (Aktif), sıralama, öne çıkan, açıklama/görsel/SEO (kullanıcı verdiyse).
- Marka(lar) için: ad, durum (Aktif), web sitesi, logo (kullanıcının verdiği dosya yolu ya da medya kütüphanesindeki görsel), öne çıkan.
- Store view'lar varsa çeviri isteyip istemediğini sor.

## Adım 2 — Mevcutları kontrol et (salt okunur)
1. `{ADMIN_URL}/categories` → arama kutusuna her adı yaz (sonuçların yazdığınla eşleştiğini kontrol et). Ağaçta ebeveyni "Genişlet" ile aç. Silinmişler için Durum filtresi "Arşivlenmiş" (aynı slug varsa create geri yükleyecek — kullanıcıya söyle).
2. Ebeveyn kategorilerin id'si için tablo görünümüne geç (⋯ → "Kimliği Kopyala" ya da "Alt Kategori Ekle" linki).
3. `{ADMIN_URL}/brands` → ad ile ara.

## Adım 3 — Plan + ONAY
Tablo: oluşturulacak kategoriler (yol, ad, slug, üst, sıra, durum, medya, SEO), atlanacak mevcutlar, oluşturulacak markalar. Ortam adı başta. Onay olmadan kaydetme.

## Adım 4 — Kategorileri oluştur (ebeveynden başlayarak)
[category-create](../domain/screens/categories/category-create.md):
1. Kök için `{ADMIN_URL}/categories/new`; alt kategori için ebeveyn id'siyle `{ADMIN_URL}/categories/new?parentId={id}` (Üst Kategori önceden seçili gelir; snapshot'la doğrula). Alternatif: Üst Kategori combobox'ından "— Ad" seçeneği.
2. Prerequisite kartı görünüyorsa dur → kullanıcıya store view gerektiğini söyle.
3. Temel Bilgiler: Kategori Adı → slug otomatik dolar (kontrol et; gerekirse düzelt) → Açıklama → Sıralama → Durum (Aktif) → Öne Çıkan.
4. Medya (ops.): kartın "Gözat" → "Medya Seç" dialog → "Göz At"tan seç ya da "Yükle" sekmesine kullanıcının dosyasını yükle (`browser_file_upload`) → "Seç". Ya da URL ikonu ile URL gir.
5. SEO (ops.): Meta Başlığı (≤100), Meta Açıklaması (≤300), OG alanları.
6. Çeviri (ops.): store view çubuğundan görünümü seç → Kategori Adı, URL Kısaltması (elle), Açıklama; SEO sekmesinde meta alanları. Sonra "Varsayılan"a dön.
7. Özet → onay → **"Kategori Oluştur"** → toast "Kategori başarıyla oluşturuldu", `/categories`.
8. Yeni kategorinin id'sini (çocukları için) liste tablo görünümünden al; sonraki seviyeye geç.

Düzenleme/taşıma: [category-edit](../domain/screens/categories/category-edit.md) (Üst Kategori ya da Sıralama değiştir → "Kategoriyi Güncelle").

## Adım 5 — Markaları oluştur
[brand-create](../domain/screens/brands/brand-create.md):
1. `{ADMIN_URL}/brands/new`.
2. Temel Bilgiler: Marka Adı → URL Slug kontrol → Durum → Slogan/Açıklama/Web Sitesi/Menşei/Kuruluş Yılı (verildiyse) → Öne Çıkan.
3. Medya: Logo kartı "Kütüphaneden Seç" → "Medya Seç" dialog → seç ya da "Yükle" → "Seç" → Alt metin yaz.
4. SEO (ops.): Meta Başlık ≤70, Meta Açıklama ≤160, Anahtar kelimeler (virgüllü), Kanonik URL geçerli URL olmalı.
5. Özet → onay → **"Kaydet"** (Enter işe yaramaz) → toast "Marka başarıyla oluşturuldu".
6. "A brand with a similar name already exists" → mevcut markayı kullanıcıya göster, yeniden kullan.

## Adım 6 — (Opsiyonel) Attribute set'e kategori bağla
Kullanıcı isterse [attribute-set-edit](../domain/screens/attributes/attribute-set-edit.md) → Kategoriler sekmesi.

## Adım 7 — Doğrulama ve rapor
- Kategoriler: ağaçta yerleri; [category-detail](../domain/screens/categories/category-detail.md) sayfasında slug, seviye, üst kategori, medya, SEO, çeviriler.
- Markalar: listede `/slug`, durum, logo.
- Rapor: oluşturulan kategori yolları + slug'lar, markalar; yapılamayanlar (ör. ürüne marka atama — alan geliştiriliyor).
