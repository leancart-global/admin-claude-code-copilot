# Öznitelik Düzenle (Edit Attribute)
- URL: `{ADMIN_URL}/attributes/{id}/edit`
- Amaç: Mevcut attribute'un etiketini, bayraklarını, seçeneklerini (ekle/çıkar/sırala/renk/çeviri), kapsamını güncellemek.
- Yetki: Listedeki "Düzenle" `products` update yetkisiyle görünür. Kaydetme `attributes:write` ister.
- Veri / API:
  - Yükleme: `GET /attributes/{id}`. Bulunamazsa "Öznitelik Bulunamadı / Attribute Not Found" + "Özniteliklere Dön"; diğer hata → "Bu öznitelik yüklenemedi". Ayrıca store view listesi.
  - Kaydet: `PATCH /attributes/{id}` — kod hariç tüm form değerleri gönderilir. Seçenek listesi ve seçenek çevirileri formdaki hâliyle **tamamen değiştirilir** (formdan çıkarılan seçenek kayıttan da çıkar).

## Ön koşullar ve bağımlılıklar
- Attribute var olmalı (id'yi [attribute-list.md](attribute-list.md) ⋯ → Düzenle ile al).
- Alanların tam listesi, label'lar ve locator'lar: [attribute-create.md](attribute-create.md) (aynı form). Aşağıda yalnız farklar.

## Yerleşim
- Başlık "Öznitelik Düzenle / Edit Attribute", açıklama "Düzenleniyor: {label} ({code})", sağda "Kaydet / Save".
- Sekmeler create ile aynı (Temel Bilgi, Seçenekler, Doğrulama Kuralları, Mağaza Özellikleri, Kapsam, Gelişmiş).

## Alanlar (create'ten farklar)
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| Temel Bilgi | Öznitelik Kodu * | `code` | text (**disabled**) | – | – | `getByRole('textbox', { name: /Öznitelik Kodu/ })` disabled | Değiştirilemez; label değişince de türetme yapılmaz. |
| Temel Bilgi | Öznitelik Tipi * | `type` | select | evet | mevcut tip | aynı | Attribute bir sette ya da ürün değerinde kullanılıyorsa farklı tipe geçilemez → toast "Bu özelliğe zaten ürün verisi bağlı olduğu için türü değiştirilemez. Farklı bir tür gerekiyorsa bunun yerine yeni bir özellik oluşturun." (`ERR_ATTRIBUTE_TYPE_IMMUTABLE`). |
| Seçenekler | (tablo) | `options[]` | satır editörü | – | – | aynı | Mevcut seçenekler kayıtlı değerleriyle yüklenir. Store view sütunları mevcut çevirilerle dolu gelir. |
| Diğer tüm alanlar | | | | | Varsayılanlar yerine kayıttaki değerler | | |

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay | Sonuç |
|---|---|---|---|
| Kaydet / Save | attribute güncellenir | uygulama sormaz → özet + kullanıcı onayı | Toast "İşlem başarıyla tamamlandı" / "Öznitelik başarıyla güncellendi", `/attributes`'a yönlenir. Hata: başlık "Bir hata oluştu", açıklama tip-değiştirilemez metni ya da "Öznitelik kaydedilemedi" / sunucu mesajı. |
| Seçenekler → çöp kutusu → "Sil" | yalnız formdan çıkarır | dialog "Seçeneği Sil" ("…Bu işlem geri alınamaz.") | Kaydet'e basılınca kalıcı. |
| Geri / Back | `/attributes` | uyarı yok | değişiklikler kaybolur |
| (Bu ekranda Sil düğmesi yok) | Silme yalnız listeden | | |

## Yan etkiler
- Aramada/filtrede kullanım bayrakları değişirse bu attribute'u kullanan ürünler yeniden işlenir; vitrin arama/filtre sonuçlarına yansıması gecikmeli olur.
- Seçenek etiketini değiştirmek ürünlerdeki seçili değerleri korur (ürünler yeni etiketi gösterir).

## Tuzaklar
- create dosyasındaki tuzaklar geçerli (başka sekmedeki doğrulama hatası, boş seçenek satırı, TR'de iki "Seçenek Ekle" düğmesi).
- **Kullanımda olabilecek bir seçeneği silmeden önce** kullanıcıya sor; amaç ad düzeltmekse yeniden adlandırmayı tercih et.
- Tip değiştirmek kullanımda olan attribute'ta mümkün değil; gerekiyorsa yeni attribute + yeni kod planla.
- Sayfa yüklenirken spinner; form veri gelince açılır. Seçenek tablosu store view'lar yüklenene kadar iskelet.
- Kaydetmeden çıkışta uyarı yok.

## Doğrulama
- Toast "Öznitelik başarıyla güncellendi" ve `/attributes`.
- Edit sayfasını yeniden aç, değiştirilen sekmeyi snapshot'la (bayrak switch'leri `aria-checked`, seçenek satırları ve sayısı rozeti "{n} seçenek").
