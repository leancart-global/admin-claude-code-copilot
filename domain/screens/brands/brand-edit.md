# Markayı Düzenle (Edit Brand)
- URL: `{ADMIN_URL}/brands/{id}/edit`
- Amaç: Mevcut markanın tüm alanlarını, logosunu, SEO'sunu ve çevirilerini güncellemek.
- Yetki: `products` update yetkisi yoksa `/brands`'a yönlendirir. Kaydetme `brands:write`.
- Veri / API:
  - Yükleme: `GET /brands/{id}` (SEO anahtar kelimeleri virgüllü metin olarak gelir). Hata: kırmızı uyarı (sunucu mesajı), form açılmaz.
  - Kaydet: `PUT /brands/{id}` — tüm temel alanlar + medya + SEO + çeviriler formdaki hâliyle gönderilir: formda boş bırakılan görsel silinir, SEO ve çeviriler **tamamen değiştirilir** (boş çeviri listesi = tüm çeviriler silinir).

## Ön koşullar ve bağımlılıklar
- Marka var olmalı ([brand-list.md](brand-list.md) ⋯ → Düzenle). Alanlar ve locator'lar: [brand-create.md](brand-create.md).

## Yerleşim
- Başlık "Markayı Düzenle / Edit Brand", açıklama "Düzenleniyor: {name} (/{slug})", geri "Geri".
- Form create ile aynı; alt bar düğmesi **"Güncelle / Update"**.

## Alanlar (create'ten farklar)
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Temel | URL Slug | `slug` | text | – | alandan çıkınca normalize | | Dolu geldiği için addan otomatik değişmez. Değiştirmek marka URL'sini değiştirir; çakışırsa 409; boş bırakılırsa eskisi korunur. |
| Medya | Kaldır / Remove | `media.logo` | button | – | | | Kaydedince logo silinir. |

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay | Sonuç |
|---|---|---|---|
| Güncelle / Update | form doğrulanır → marka güncellenir | uygulama sormaz → özet + onay | Toast "Marka başarıyla güncellendi" → `/brands`. Hata: başlıkta sunucu mesajı. |
| İptal / Geri | değişiklik varsa onay ("Çık") | | `/brands` |
| (Sil yok) | Silme yalnız listeden | | |

## Yan etkiler
- SEO ve çeviriler **yerine koyma** semantiğiyle yazılır: formda görünmeyen eski değer kalmaz.
- Durumu Pasif yapmak markayı vitrinden gizler (doğrulanmadı).

## Tuzaklar
- create tuzakları geçerli (Enter göndermez, Kanonik URL geçerli URL olmalı).
- Yükleme hatasında form gelmez; sayfayı yenile.

## Doğrulama
- Toast "Marka başarıyla güncellendi"; edit'i yeniden aç ve değiştirilen alanları snapshot'la; listede durum/öne çıkan switch'leri.
