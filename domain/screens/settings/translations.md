# Çeviriler (Translations)
- URL: {ADMIN_URL}/settings/translations
- Menü yolu: Sol menü "Ayarlar / Settings" → "Çeviriler / Translations"; ya da `/settings` hub → "Sistem / System" → "Çeviriler / Translations" (kart açıklaması "Her dil için mağaza metinlerini düzenle").
- Sayfa başlığı: "Çeviriler / Translations"; açıklama "Kiracınız için çeviri geçersiz kılmalarını yönetin".
- Amaç: Vitrin arayüz metinlerini (buton, etiket, hata mesajı vb. — ürün/kategori içeriği değil) mağazaya özel olarak geçersiz kılmak. Her kayıt bir **ad alanı + anahtar** için İngilizce ve Türkçe değer tutar; özel kayıt sistem varsayılanının yerine geçer.
- Ürün, kategori, marka, sayfa çevirileri burada **değil**, kendi formlarındaki store view kapsamında yapılır (bkz. `domain/project/ui-conventions.md` §11).
- Yetki: ekran `settings:read`; okuma `content:read`, ekle/düzenle/sil/önbellek temizle `content:write`.

## Ön koşullar ve bağımlılıklar
- Değiştirilecek metnin **anahtarı** bilinmeli (ör. `cart.checkout.button`). Anahtar bilinmiyorsa listede aramayla bulunur; bulunamazsa kullanıcıya sor (tahmin etme).
- Yalnız İngilizce ve Türkçe değer alanı vardır; diğer diller (Deutsch, Français…) bu ekrandan çevrilemez.
- Etkiledikleri: vitrinin ilgili dildeki arayüz metinleri.

## Yerleşim
1. Başlık satırı; sağda "Önbelleği Temizle / Clear Cache" (dar ekranda yalnız ikon) ve "Çeviri Ekle / Add Translation".
2. Bilgi kutusu: "Özel çeviriler sistem varsayılanlarını geçersiz kılar. Değişiklikler 5 dakika içinde geçerli olur."
3. Filtreler: arama "Anahtara göre ara..." ve ad alanı Select ("Tüm Ad Alanları / All Namespaces"; seçenekler: Ortak `common`, Kimlik Doğrulama `auth`, Sepet `cart`, Ödeme `checkout`, Ürünler `products`, Kategoriler `categories`, Kontrol Paneli `dashboard`, Hatalar `errors`, Soru-Cevap `qna`, Garanti `warranty`, Mağazalar `stores`, Bülten `newsletter`, Destek `support`, Özel `custom`).
4. Tablo: "Anahtar / Key", "Ad Alanı / Namespace", "İngilizce / English", "Türkçe / Turkish", "Durum / Status" ("Özel / Custom" ya da "Sistem / System" rozeti), "İşlemler / Actions" (kalem ikonu = düzenle; çöp ikonu = sil, **yalnız Özel kayıtlarda**). İkon butonları metinsizdir → satırı anahtar metniyle bul, satır içindeki 1. ikon butonu düzenle, 2.'si sil.
5. Sayfalama: 20 kayıt; "Önceki / Sonraki".
6. Boş durum: "Çeviri bulunamadı. Sistem varsayılanlarını geçersiz kılmak için özel çeviriler ekleyin."

## Alanlar
### "Çeviri Ekle" diyaloğu
| Label (tr / en) | Kontrol | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Ad Alanı / Namespace | Select | — | `common` (Ortak) | label "Ad Alanı" | |
| Çeviri Anahtarı / Translation Key | Input | evet | placeholder "örn., cart.checkout.button" | `#key` | Yoksa toast "Lütfen bir anahtar ve varsayılan değer girin" |
| İngilizce Değer / English Value | Textarea | evet (varsayılan değer olarak) | İlk yazılan İngilizce değer varsayılan değer de olur | `#en` | |
| Türkçe Değer / Turkish Value | Textarea | hayır | — | `#tr` | |
| Açıklama (isteğe bağlı) / Description (optional) | Textarea | hayır | — | `#description` | Bağlam notu |
Butonlar: "İptal / Cancel", "Oluştur / Create".

### "Çeviriyi Düzenle" diyaloğu
- Anahtar salt okunur; "İngilizce Değer" `#edit-en`, "Türkçe Değer" `#edit-tr`, "Açıklama" `#edit-description`; "Değişiklikleri Kaydet / Save Changes".

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Çeviri Ekle → Oluştur | Özel çeviri oluşur | "Çeviri başarıyla oluşturuldu" / "Çeviri oluştürülamadı" |
| Kalem → Değişiklikleri Kaydet | Değerler güncellenir (Sistem kaydında da yapılabilir; kayıt özel geçersiz kılma olur — doğrulanmadı) | "Çeviri başarıyla güncellendi" |
| Çöp → "Çeviriyi Sil" diyaloğu ("…Bunun yerine sistem varsayılanı kullanılacak.") → "Sil" | Özel kayıt silinir, metin sistem varsayılanına döner | "Çeviri başarıyla silindi" |
| Önbelleği Temizle | Vitrinin çeviri önbelleği hemen temizlenir; değişiklikler 5 dk beklemeden yansır | "Önbellek başarıyla temizlendi" / "Önbellek temizlenemedi" |

## Onay zamanlaması (kural 2/5)
- Oluştur/Kaydet: özet (ad alanı, anahtar, EN eski → yeni, TR eski → yeni) → onay.
- Sil: ayrı onay (metin sistem varsayılanına döner).
- "Önbelleği Temizle" vitrini anında etkiler (onaylanmış değişikliklerin hemen yayına girmesi); kayıt değiştirmez ama kullanıcıya sorarak bas — kaydetme onayına "ardından önbelleği temizleyeyim mi?" sorusunu ekleyebilirsin.

## Yan etkiler
- Değişiklik vitrine en geç ~5 dk içinde, önbellek temizlenince hemen yansır.
- Silinen özel kayıt sistem metnine döner.

## Tuzaklar
- Anahtar ve ad alanı birlikte tekil kaydı tanımlar; yanlış ad alanında aynı anahtar vitrinde etki etmez.
- Sistem kayıtlarında sil butonu yoktur.
- Bu ekran ürün/kategori içeriği çevirmez; kullanıcı "ürün adını İngilizceye çevir" diyorsa ürün formuna git.

## Doğrulama
1. Toast.
2. Aramaya anahtarı yaz → satırda EN/TR değerleri ve "Özel" rozeti.
3. Gerekirse önbelleği temizledikten sonra vitrinde ilgili metin.
