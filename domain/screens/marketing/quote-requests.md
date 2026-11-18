# Teklif Talepleri (Quote requests) — liste ve talep çekmecesi
- URL: {ADMIN_URL}/marketing/quote-requests (tek sayfa; talep detayı sağdan açılan çekmecedir, ayrı URL yok)
- Menü yolu: Sol menü "Pazarlama / Marketing" → "Teklif talepleri / Quote requests" (en altta; hub sayfasında kartı yok).
- Sayfa başlığı: "Teklif talepleri" + toplam sayı rozeti; açıklama "Alışverişçilerin teklifle satılan ürünleriniz için gönderdiği fiyat taleplerini, kimin gönderdiğini ve neler istediğini görün."
- Amaç: Mağazada "fiyat sorunuz" işaretli (fiyatı gösterilmeyen) ürünler için alışverişçilerin gönderdiği teklif taleplerini görmek, talep eden kişiye ulaşmak ve işi bitmiş talebi kapatmak. Ekran bir **gelen kutusudur**: teklif hazırlama, fiyat yanıtlama ya da sipariş oluşturma yoktur.
- Entity: yok (talep, ürün ve müşteriden bağımsız bir kayıttır). İlgili: ürün formundaki "fiyat sorunuz" anahtarı ([../products/product-edit.md](../products/product-edit.md), [../../entities/product.md](../../entities/product.md)).
- Yetki: sayfa ve çekmece `marketing:view`; "Talebi kapat" `marketing:update` (yoksa buton görünmez). Müşteri bilgilerini görme yetkisi (`customers:read`) yoksa iletişim bilgileri **kısmen gizli** gelir (aşağıda).
- Veri / API (public): `GET /admin/quote-requests` (filtre: `status`, `guest`, `sort`, sayfa/limit; varsayılan 20), `GET /admin/quote-requests/{id}`, `POST /admin/quote-requests/{id}/close`.

Panelde **olmayanlar**: talebi düzenleme, silme, yeniden açma, yanıt/teklif gönderme, not ekleme, dışa aktarma, toplu işlem, tarih aralığı ya da metin arama filtresi.

## Ön koşullar ve bağımlılıklar
- Talep gelmesi için mağazada en az bir ürün **"fiyat sorunuz"** olarak işaretli olmalı (ürün formunda; fiyatsız kaydedilebilir) — ürün tarafı: [../products/product-edit.md](../products/product-edit.md). Bu ürünler vitrinde sepete eklenmez; ürün sayfasında ve ürün kartında **"Teklif listesine ekle"** butonu görünür.
- Alışverişçi vitrinde **Teklif listesi** sayfasında (üstteki başlıkta "Teklif listesi, {n} ürün" bağlantısı) adetleri düzenler ve "Bilgileriniz" formunu doldurur: Şirket (isteğe bağlı), Ad soyad, E-posta, Telefon (isteğe bağlı), Not (isteğe bağlı, en çok 2000 karakter) → "Teklif talebini gönder". Giriş yapmış müşterinin ad / e-posta / telefonu önceden dolar. Başarıda "Teklif talebiniz gönderildi — Mağaza, verdiğiniz e-posta adresine dönüş yapacak." görünür; yani **dönüşü mağaza yapar** (e-posta / telefon / WhatsApp ile, bu ekrandan veya dışarıdan).
- **Robot doğrulaması:** Mağaza ayarlarında "Form Spam Koruması" kimlik bilgisi kuruluysa ([../settings/general.md](../settings/general.md)) teklif formu da robot doğrulamasından geçer ("Güvenlik doğrulaması bekleniyor…"); doğrulama başarısızsa talep gitmez ("Güvenlik doğrulaması yapılamadı. Lütfen tekrar deneyin."). Kimlik bilgisi kurulu değilse form doğrulamasız çalışır.
- **Bildirim:** Her yeni talepte mağazanın **tüm yönetici kullanıcılarına** (talep başına bir kez) "yeni teklif talebi" e-postası gider (e-posta içeriği doğrulanmadı). Gönderimi bu ekran tetiklemez ([../settings/notifications.md](../settings/notifications.md)).

## Yerleşim
1. Başlık + açıklama + toplam sayı rozeti.
2. Filtre çubuğu (üç Select, aria-label'larıyla): "Duruma göre filtrele" (Tüm durumlar / Açık / Kapalı / Yanıtlandı / Kabul edildi / Süresi doldu), "Alışverişçi türüne göre filtrele" (Üyeler ve misafirler / Yalnızca üyeler / Yalnızca misafirler), "Talepleri sırala" (Önce en yeni — varsayılan / Önce en eski). Seçilen filtreler rozet olur (× ile kaldırılır) + "Filtreleri temizle". Filtre değişince 1. sayfaya dönülür. Filtreler URL'ye yazılmaz.
3. Tablo (`data-testid="quote-request-row"`; satıra ya da firma adı butonuna tıklamak çekmeceyi açar): "Firma" (yoksa "—"; buton aria-label "{gönderen} tarafından gönderilen talebi aç"), "Ad" (altında "Misafir" / "Üye"), "İletişim" (E-posta / Ara / WhatsApp bağlantıları), "Ürün" (satır sayısı), "Adet" (toplam adet), "Durum" rozeti, "Alındığı tarih". Sayfa başına 20 satır, sayfalama altta.
4. Boş durum: "Henüz teklif talebi yok — Bir alışverişçi teklifle sattığınız bir ürün için fiyat istediğinde talep burada görünür." Filtre sonucu boşsa "Bu filtrelere uyan talep yok".
5. Hata: "Teklif talepleri yüklenemedi. Biraz sonra tekrar deneyin." + "Tekrar dene"; çok sık istekte "Çok fazla istek gönderildi. Bir dakika bekleyip tekrar deneyin."

### Talep çekmecesi (`data-testid="quote-request-drawer"`, başlık "Teklif talebi")
- Üst bilgi: Durum rozeti, "Alındığı tarih", kapalıysa "Kapatıldığı tarih".
- "Alışverişçi": firma (varsa), ad, iletişim bağlantıları. E-posta → `mailto:`, "Ara" → `tel:`, "WhatsApp" yalnız `+` ile başlayan uluslararası numarada.
- "İstenen ürünler" tablosu (`quote-request-line`): Ürün (ad + "Stok kodu: {SKU}"), Adet, **"Gönderildiği andaki stok"** ("{n} adet stokta" / "Stokta yok, ön sipariş açık" / "Stokta yok" / "Kaydedilmedi") — talep anındaki stok görüntüsüdür, güncel stok değildir.
- "Alışverişçinin notu" (`quote-request-note`; yoksa "Alışverişçi not bırakmadı.").
- Yalnız durumu **Açık** olan talepte ve `marketing:update` yetkisiyle: **"Talebi kapat"** (`data-testid="quote-request-close"`).

## Durumlar
| Durum | Anlamı |
|---|---|
| Açık | Yeni gelen talep; mağaza henüz kapatmadı |
| Kapalı | Mağaza "Talebi kapat" ile işi bitirdi (geri alınamaz; yeniden açma yok) |
| Yanıtlandı, Kabul edildi, Süresi doldu | Filtrede görünür ama bu sürümde talepler bu durumlara **geçmez** (teklif yanıtlama özelliği henüz yok) |

## Alanlar
Yok (form yok; yalnız filtreler ve çekmece). Filtre Select'leri `role=combobox`, aria-label ile bulunur (ör. `getByRole('combobox', { name: 'Duruma göre filtrele' })`).

## Aksiyonlar
| Buton | Ne olur | Toast / sonuç |
|---|---|---|
| Satır / firma adı | Çekmece açılır (talep ve satırları yüklenir) | Yüklenemezse "Bu talep yüklenemedi…"; silinmişse "Bu talep artık mevcut değil." |
| E-posta / Ara / WhatsApp | Tarayıcıda posta istemcisi / telefon / `wa.me` bağlantısı açılır; panel hiçbir şey kaydetmez ve mesaj göndermez | — |
| **Talebi kapat** | **Diyalogsuz, anında** talep Kapalı olur; liste ve çekmece yenilenir | "Talep kapatıldı."; başkası kapatmışsa "Bu talep zaten kapatılmış."; yoksa "Bu talep artık mevcut değil."; diğer hata "Talep kapatılamadı. Biraz sonra tekrar deneyin." |

## Onay zamanlaması (kural 2/5/6)
- Liste, filtre, çekmece ve iletişim bağlantıları salt okunur → onay gerekmez.
- **"Talebi kapat" diyalogsuz kaydeder ve geri alınamaz** (yeniden açma yok) → tıklamadan **önce** onay al; özette talep sahibi (firma / ad), ürün satırı sayısı ve "Kapalı olur, geri alınmaz" yaz. Toplu kapatma yoktur; her talep ayrı onaylanır (kural 5).
- Bu ekran alışverişçiye e-posta / bildirim göndermez; alışverişçiye dönüş mağazanın kendi işidir (bağlantılar yalnız dış uygulamayı açar).

## Yan etkiler
- Kapatılan talep listede "Kapalı" rozetiyle kalır, "Açık" filtresinden çıkar; alışverişçiye bildirim gitmez.
- Müşteri bilgilerini görme yetkisi olmayan kullanıcıda ad, e-posta ve telefon maskelenir, bağlantılar çıkmaz ve satırda/çekmecede "Kısmen gizli: müşteri bilgilerini görmek için yetkiniz yok" yazar. Kişisel veri sohbete aktarılırken bunu dikkate al (yalnız gerekli alanı özetle).

## Tuzaklar
- Ekran yalnız gelen talepleri gösterir; "teklif gönder / fiyat yanıtla" yoktur. Kullanıcı "teklife cevap ver" derse ekranın bunu yapmadığını söyle; iletişim bağlantılarını açma (kullanıcının kendi işi) ya da müşteriye e-posta için ilgili ekranları öner.
- Fiyatı sorulan ürünler sepete eklenemez; talep listesi ile sepet ayrıdır. Ürünün "fiyat sorunuz" anahtarı kapatılırsa o ürün yeniden normal sepet akışına döner (doğrulanmadı: eski talepler listede kalır).
- "Gönderildiği andaki stok" geçmiş değerdir; güncel stok için [../inventory/stock.md](../inventory/stock.md).
- Durum filtresinde "Yanıtlandı / Kabul edildi / Süresi doldu" seçilince sonuç boş çıkması normaldir.
- Yeni talep geldiğinde liste otomatik yenilenmez (yaklaşık 30 sn önbellek); güncel görmek için sayfayı yenile.

## Doğrulama
1. Sayfa başlığı "Teklif talepleri" ve rozet toplamı; satır sayısı sayfa başına ≤20.
2. Test amaçlı talep gönderildiyse (vitrinden, kullanıcı yaptırır): "Açık" filtresinde en üstte (Önce en yeni), firma/ad, ürün/adet ve not çekmecede.
3. "Talebi kapat" sonrası toast "Talep kapatıldı."; çekmecede Durum "Kapalı" + "Kapatıldığı tarih"; "Açık" filtresinde yok.
