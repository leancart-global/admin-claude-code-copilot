# Kategori Düzenle (Edit Category)
- URL: `{ADMIN_URL}/categories/{id}/edit` · başlangıç sekmesi `?tab=basic|media|seo|products` (başka değer → basic)
- Amaç: Kategori bilgilerini, üst kategori/sırasını (taşıma), görsellerini, SEO'sunu, çevirilerini düzenlemek; kategori ürünlerini yönetmek.
- Yetki: `categories:write`.
- Veri / API:
  - Yükleme: kategori + çevirileri. Bulunamazsa "Hata" + "Kategori bulunamadı" + "Kategorilere Dön".
  - Kaydet 1: `PATCH /categories/{id}` (create ile aynı alanlar; Üst Kategori "Ana Kategoriler" = köke taşı).
  - Kaydet 2: her dolu çeviri güncellenir ya da yoksa oluşturulur. Çeviri kaydı başarısız olursa hata toast'ı gelir ama kategori bilgileri kaydedilmiş olabilir.
  - Ürünler sekmesi: ürün ekle / çıkar / sırala — **anında** kaydolur, form kaydından bağımsız.

## Ön koşullar ve bağımlılıklar
- Kategori var olmalı. Alanlar/locator'lar [category-create.md](category-create.md) ile aynı (aynı form); burada farklar.

## Yerleşim
- Başlık "Kategori Düzenle / Edit Category", "Bu ürün kategorisinin bilgilerini güncelleyin".
- Store view çubuğu (varsa), sekmeler **Temel Bilgiler · Medya · SEO · Ürünler / Products**.
- Alt bar: "İptal" + **"Kategoriyi Güncelle / Update Category"**.

## Alanlar (create'ten farklar)
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Temel | URL Kısaltması * | `slug` | text | evet | aynı | | Mevcut slug dolu geldiği için addan **otomatik güncellenmez**. Slug değiştirmek vitrin URL'sini değiştirir; eski URL için **otomatik yönlendirme oluşmaz** → eski adres trafik/SEO alıyorsa ayrı adım olarak yönlendirme aç ([../seo/redirects.md](../seo/redirects.md), [../../../playbooks/redirect-create.md](../../../playbooks/redirect-create.md)). Çakışırsa 409. |
| Temel | Üst Kategori | `parentId` | select | hayır | mevcut ebeveyn ya da "Ana Kategoriler" | aynı | Taşıma: kendi altına/torununa taşıma → `CATEGORY_CIRCULAR_REFERENCE`. Derinlik en fazla 5. |
| Temel | Durum * | `status` | select | evet | mevcut | | Arşivlemek için Sil kullan. |
| Ürünler | "Ürün Ekle", satır ↑/↓, kaldır | – | buton/sheet | – | – | `getByRole('button', { name: 'Ürün Ekle' })` doğrulanmadı | Her işlem anında kaydolur ve toast verir; "Güncelle"ye bağlı değil → CLAUDE.md kural 6 gereği **dokunmadan önce** onay al. Yeni (kaydedilmemiş) kategoride sekme yok. |

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay | Sonuç |
|---|---|---|---|
| Kategoriyi Güncelle / Update Category | kategori + çeviriler kaydedilir | uygulama sormaz → özet + onay | Toast "Kategori başarıyla güncellendi" → `/categories`. Hata: kırmızı toast sunucu mesajıyla. |
| İptal / Kategorilere Dön | değişiklik varsa "Kaydedilmemiş değişiklikler" → "Ayrıl" | | `/categories` |
| (Sil düğmesi yok) | Silme: liste ya da detay ekranı | | |

## Yan etkiler
- Ebeveyn değişirse kategori alt ağacıyla birlikte yeni ebeveynin altına taşınır (alt seviyelerin Seviye değeri — doğrulanmadı).
- Ürünler sekmesindeki işlemler anında kalıcıdır.

## Tuzaklar
- create dosyasındaki tuzaklar geçerli.
- Çeviri düzenlemek için store view çubuğundan görünümü seç.
- Çeviri silme UI'da yok; bir çevirinin adını boşaltıp kaydetmek çeviriyi silmez.
- Yükleme bitene kadar spinner "Kategori yükleniyor...".

## Doğrulama
- Toast "Kategori başarıyla güncellendi"; detay sayfasında ([category-detail.md](category-detail.md)) Durum, slug, Üst Kategori, SEO ve Çeviriler kartlarını kontrol et.
