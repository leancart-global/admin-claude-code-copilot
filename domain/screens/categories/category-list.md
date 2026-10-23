# Kategoriler (liste / ağaç)
- URL: `{ADMIN_URL}/categories`
- Amaç: Kategori ağacını görmek, var olan kategoriyi bulmak, düzenle/detay/alt kategori ekle, silmek (tek/çoklu), kategoriye ürün eklemek (ağaç görünümü sağ panel).
- Yetki: menü `categories:read`. Sayfa içi düğmeler `categories` create / update / delete yetkisine göre görünür.
- Veri / API:
  - Listeleme: `GET /categories` (arama, durum, öne çıkan filtreleriyle; arşivlenenler yalnız "Arşivlenmiş" filtresiyle).
  - Sil: `DELETE /categories/{id}` (`categories:delete`) → arşivler.
  - Toplu sil: seçilenler; kısmi başarı satır bazında raporlanır.
  - Ağaç sağ paneli: kategori ürünleri listesi, ürün ekleme (anında).

## Ön koşullar ve bağımlılıklar
- Yok (görüntüleme). Oluşturma için aktif store view gerekir → [category-create.md](category-create.md). Entity: [../../entities/category.md](../../entities/category.md).

## Yerleşim
1. Başlık "Kategoriler / Categories" + toplam rozeti, "Ürün kategorilerinizi yönetin"; sağda **"Kategori Ekle / Add Category"**.
2. Hızlı filtre kartı: görünüm toggle **"Ağaç / Tree" | "Tablo / Table"** (tercih tarayıcıda hatırlanır, varsayılan ağaç); arama; Durum select; Öne Çıkan select; "Daha Fazla / More".
3. Aktif filtre etiketleri + "Tümünü temizle".
4. Seçim varsa: "{n} kategori seçildi" + "Seçimi Temizle" + **"Seçileni Sil / Seçilenleri Sil"** (delete yetkisi).
5. Görünüm:
   - **Ağaç**: solda ağaç paneli (başlık "Kategoriler ({n})", + ikon "Kategori Ekle", "Genişlet / Expand", "Daralt / Collapse", "Hiçbiri / None"); her düğüm: aç/kapa oku, checkbox (aria "Select {ad}"), klasör + durum noktası, ad, hover'da ürün sayısı/★, "(çocuk sayısı)", hover'da kalem (Düzenle). Sağda detay paneli: kategori adı, durum filtresi, **"Düzenle"**, **"Ürün Ekle / Add Products"**, kategori ürün listesi.
   - **Tablo**: seçim | Görsel | Ad (+alt kategori sayısı) | Seviye | Durum | Ürünler | Sıralama | Güncelleme | ⋯ menü; sayfalama (50/sayfa).
6. Boş ağaç: "Ürünlerinizi kategorilerle düzenleyin" + "Sıfırdan Oluştur".

## Alanlar
| Bölüm/Tab | Label (tr / en) | Kontrol tipi | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Filtre | aria "Ağaç görünümü" / "Tablo görünümü" | toggle group | Ağaç | `getByRole('radio', { name: 'Tablo görünümü' })` (rol `radio` olabilir — doğrulanmadı) | Satır menüsü (Alt Kategori Ekle, Sil, Detay) **yalnız tablo görünümünde**. |
| Filtre | placeholder "Kategori adı veya kısa adına göre ara..." / "Search categories by name or slug..." | text | – | `getByPlaceholder('Kategori adı veya kısa adına göre ara...')` | Yazdıktan sonra sonuçların aranan metinle eşleştiğini kontrol et. |
| Filtre | Durum / Status | select | Tüm Durumlar | `getByRole('combobox')` (placeholder "Durum") | Aktif / Pasif / Gizli / Arşivlenmiş. "Arşivlenmiş" seçilmedikçe silinmiş (arşivlenmiş) kategoriler listede yok. |
| Filtre | Öne Çıkan / Featured | select | Tümü | | Tümü / Öne Çıkan / Öne Çıkmayan |
| Ağaç düğümü | (satır tıklaması) | tıklanabilir satır | – | `getByText('Cep Telefonları', { exact: true })` | Tek seçim: düğümü aktif yapar, sağ panel dolar. |
| Ağaç düğümü | aria "Select {name}" | checkbox | | `getByRole('checkbox', { name: 'Select Cep Telefonları' })` | Çoklu seçim (toplu silme için). |
| Ağaç düğümü | aç/kapa | button (aria yok) | | düğümdeki ilk buton | Çocuklar varsayılan kapalı; "Genişlet" hepsini açar. |
| Tablo satırı | "Menüyü aç" (ekran okuyucu metni) | dropdown | | `getByRole('button', { name: 'Menüyü aç' })` / 'Open menu' | Menü: "Kimliği Kopyala", "Detayları Görüntüle", "Düzenle", "Çevirileri Yönet", "Alt Kategori Ekle", "Sil". |

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay | Sonuç |
|---|---|---|---|
| Kategori Ekle / Add Category | `/categories/new` | – | [category-create.md](category-create.md) |
| Ağaç sağ panel / kalem → Düzenle | `/categories/{id}/edit` | – | [category-edit.md](category-edit.md) |
| Tablo ⋯ → Detayları Görüntüle | `/categories/{id}` | – | [category-detail.md](category-detail.md) |
| Tablo ⋯ → Alt Kategori Ekle / Add Subcategory | `/categories/new?parentId={id}` | – | Üst kategori önceden seçili gelir |
| Tablo ⋯ → Çevirileri Yönet | edit sayfasını açar | – | Çeviri için edit sayfasında store view çubuğu kullanılır |
| Tablo ⋯ → Sil / Delete | Dialog "Emin misiniz?": "\"{name}\" ve tüm alt kategorileri kalıcı olarak silinecek. Bu işlem geri alınamaz." → "Sil" | evet | Başarı: "Kategori başarıyla silindi". Ret: "“{name}” kategorisinin alt kategorileri var. Önce onları silin veya taşıyın." / "“{name}” kategorisinde hâlâ ürün var. Ürünleri taşıyın veya kaldırın, sonra tekrar deneyin." |
| Seçileni Sil / Seçilenleri Sil | Dialog "Seçilen # kategori kalıcı olarak silinecek…" → "Sil" | evet | Tam başarı: "{n} kategori başarıyla silindi."; kısmi: başlık "Kısmı Başarı", "{a} silindi, {b} başarısız." + satır başı ret nedenleri. |
| Sağ panel → Ürün Ekle / Add Products | Ürün seçici dialog "Ürün Seç" (arama "İsim veya SKU ile ürün ara...", çoklu seçim) → "Seçilenleri Ekle ({n})" | dialog | **Anında** kaydolur (form kaydı yok) → tıklamadan önce kullanıcı onayı al |

## Yan etkiler
- Silme = arşivleme; aynı slug ile yeni kategori oluşturulursa arşivlenmiş kayıt geri gelir (bkz. entity).

## Tuzaklar
- **Sürükle-bırak ile sıralama/taşıma YOK.** Sıra = kategori formundaki "Sıralama" sayısı; ebeveyn = "Üst Kategori" alanı. Ağaç kardeşleri sıralama sayısına göre dizilir.
- **Ağaç görünümünde satır bazlı Sil / Alt Kategori Ekle yok.** Tek kategori silmek için: tablo görünümüne geç ya da checkbox ile seç → "Seçileni Sil", ya da detay sayfasındaki "Sil".
- Alt kategorisi olan kategori silinemez; önce çocukları sil ya da taşı.
- Ağaç filtreliyken, eşleşmeyen ebeveyni gelmeyen çocuklar kök düzeyinde gösterilir; konumu doğrulamak için filtresiz bak.

## Doğrulama
- Oluşturma sonrası: arama kutusuna adı yaz → ağaçta düğüm; ebeveyni genişletip doğru yerde mi kontrol et; tablo görünümünde Seviye/Durum/Sıra sütunları.
- Silme sonrası: düğüm kaybolmalı; Durum filtresi "Arşivlenmiş" ile görünür.
