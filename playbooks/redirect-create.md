# Playbook: URL yönlendirmesi oluştur ("eski /kampanya adresini /indirim'e yönlendir")

Tetikleyiciler: "şu adresi şuraya yönlendir", "301 ekle", "eski ürün linki 404 veriyor", "kampanya bitti, sayfayı ana sayfaya yönlendir",
"slug'ı değiştirdim, eski link çalışsın", "bu CSV'deki yönlendirmeleri yükle", "yönlendirmeyi kapat/sil".
Harita: ../domain/screens/seo/redirects.md · ../domain/entities/url-redirect.md.
İlgili: slug değişikliği ../domain/screens/products/product-edit.md, ../domain/screens/categories/category-edit.md.

---

## 0. Kural hatırlatması
- Yönlendirme taslaksız, **canlıya** yazar (en geç ~5 dk). Oluştur/Güncelle öncesi özet + açık "evet".
- Satır menüsündeki Etkinleştir/Devre Dışı Bırak **diyalogsuz** → dokunmadan önce onay.
- "Seçilenleri Sil" **onay diyaloğu olmadan** toplu siler → kayıt sayısıyla ayrı onay; mümkünse tekil sil.
- Prod'da test yönlendirmesi açma.

## 1. İsteği çözümle
| Bilgi | Alan | Varsayılan |
|---|---|---|
| Eski adres | Kaynak Yol | — (sor). Tam URL verildiyse yalnız yolu al: `https://magaza.com/kampanya?utm=x` → `/kampanya`. Dil öneki (`/tr/`, `/en/`) varsa çıkar |
| Yeni adres | Hedef Yol | — (sor). Mağaza içi yol olmalı; dış site istenirse yapılamayacağını söyle |
| Kalıcı mı | Yönlendirme Tipi | **301**; "geçici", "kampanya süresince", "bakım" denirse 302 → özette "varsayılan" işaretle |
| Aktif | Aktif | açık |
| Desen | Regex | kapalı (yalnız "/eski-blog/ altındaki her şey" gibi açık desen isteğinde; kullanıcıya desenle teyit et) |
| Not | Notlar | kısa gerekçe + tarih öner |

## 2. Ön kontrol (salt okunur)
1. `{ADMIN_URL}/seo/redirects` → arama kutusuna kaynak yolu `fill` et → snapshot.
   - **Aynı kaynaktan kayıt varsa** (aktif ya da pasif): yeni açılamaz → mevcut kaydı düzenlemeyi öner (hedef/tip değişikliği; pasifse etkinleştirme).
2. Aynı aramayı **hedef** yol için de yap:
   - Hedef, aktif bir kuralın **kaynağıysa** (B→C var): zincir yasak → hedefi doğrudan C yap ya da kullanıcıya sor.
3. Kaynağa yönlendiren kural var mı (X→kaynak)? Listede Hedef sütununda kaynak yolu ara (arama hedefte de arar).
   - Varsa zincir oluşur → plan: önce X→hedef olarak güncelle (ayrı onay), sonra yeni kuralı oluştur.
4. Hedef adresi vitrinde aç: sayfa açılıyor mu (ürün yayında mı, kategori aktif mi)? Açılmıyorsa kullanıcıya bildir.
5. Kaynak adreste şu an gerçek bir sayfa varsa (ör. hâlâ yayında bir CMS sayfası) kullanıcıya söyle: yönlendirme sayfanın önüne geçer.
6. Kaynak sepet/ödeme/hesap/giriş, medya ya da statik dosya yoluysa yönlendirme çalışmaz — kullanıcıya bildir.

## 3. Özet → onay
> Ortam: prod · Yeni yönlendirme
>
> | Alan | Değer |
> |---|---|
> | Kaynak Yol | `/kampanya` |
> | Hedef Yol | `/indirim` (vitrinde açılıyor ✓) |
> | Tip | 301 - Kalıcı (varsayılan) |
> | Aktif | Evet |
> | Regex | Hayır |
> | Öncelik | 0 (varsayılan) |
> | Notlar | "Yaz kampanyası bitti, 2026-10" |
>
> Ön kontrol: aynı kaynaktan kayıt yok; zincir yok. Etki: `/kampanya` ve dil önekli karşılıkları (`/en/kampanya`) ~5 dk içinde `/indirim`'e gider; `/kampanya` site haritasından çıkar.

## 4. Doldur ve kaydet
1. `{ADMIN_URL}/seo/redirects/new` → snapshot.
2. "Kaynak Yol *" `fill` → "Test Et" → sonuç yeşil "Bu yolla eşleşen mevcut yönlendirme yok." olmalı (sarı "Yol eşleşiyor!" çıkarsa dur, 2. adıma dön).
3. "Hedef Yol *" `fill`.
4. Tip 302 gerekiyorsa: "Yönlendirme Tipi" tetikleyicisine tıkla → "302 - Geçici Yönlendirme".
5. Ayarlar: Aktif (açık bırak), Regex (gerekirse), Öncelik, Notlar.
6. Önizleme şeridini (`/kampanya → /indirim [301]`) snapshot ile doğrula.
7. Onaydan sonra "Yönlendirme Oluştur". Alan altında hata çıkarsa (zaten var / döngü / geçersiz hedef) mesajı oku, kullanıcıya aktar, planı düzelt — yeniden kaydetmeden önce yeni özet.

**Düzenleme:** listede ara → ⋯ → "Düzenle" → alanları değiştir → özet (eski → yeni) → "Yönlendirmeyi Güncelle".
**Aktif/pasif:** ⋯ → "Devre Dışı Bırak"/"Etkinleştir" (onay önce; diyalog yok).
**Silme:** ⋯ → "Sil" → diyalog "Sil". Özette isabet sayısını yaz; trafik alan bir kuralı silmek yerine devre dışı bırakmayı öner.

## 5. Toplu (CSV)
1. Kullanıcının dosya yolu ya da yapıştırdığı içerik. Biçim `fromPath,toPath,type,notes`.
2. Satırları önceden gözden geçir: dil öneki, tam URL, dış site hedefi, kaynak=hedef, kendi içinde zincir (bir satırın hedefi başka satırın kaynağı) → düzeltmeyi öner.
3. "CSV Aktar" → "CSV Yapıştır" ya da "Dosya Yükle" (`browser_file_upload`) → yapıştırmada "CSV'yi Ayrıştır" → "Doğrulama Hataları" ve önizleme sayısını oku.
4. Özet: satır sayısı, ilk satırlar, "var olan kaynak yollar atlanır, güncellenmez", "tümü aktif ve 301 (tip boşsa)". Ayrı onay → "{count} Yönlendirmeyi İçe Aktar".
5. Sonuç: "İçe Aktarma Başarılı" ya da "Kısmi İçe Aktarma". Başarısız/atlanan satırları listede arayarak tespit et, kullanıcıya bildir.

## 6. Doğrula
- Toast "Yönlendirme başarıyla oluşturuldu/güncellendi"; listede ara → Hedef, Tip, Durum.
- Form "Test Et" → "Yol eşleşiyor! Yönlendirildiği yer: /indirim".
- Vitrinde kaynak adresi aç (en geç ~5 dk) → hedefe düşüyor mu.

## 7. Rapor
Oluşturulan/değişen/silinen kurallar (kaynak → hedef, tip), düzleştirilen zincirler, vitrin kontrol sonucu, kalan işler
(ör. "ürün slug'ını değiştirdiniz; eski ürün adresleri için de yönlendirme önerebilirim").
