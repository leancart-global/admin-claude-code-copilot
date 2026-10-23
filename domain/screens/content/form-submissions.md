# Form Gönderimleri (Submissions)
- URL: {ADMIN_URL}/content/forms/{id}/submissions
- Erişim: Form listesindeki satırda gönderim sayısı ve "N yeni" rozeti görünür; gelen kutusu
  bu adrese formun id'si ile gidilerek açılır (id, builder adresinden `/content/forms/{id}` okunur). Geri bağlantı
  "Formlara dön / Back to Forms" formun builder'ına döner.
- Amaç: Bir formun ziyaretçilerden gelen gönderimlerini (gelen kutusu) listelemek, okumak, durumunu (Yeni → İşlemde →
  Kapatıldı) takip etmek, ekip notu eklemek, CSV olarak dışa aktarmak ve bir e-posta adresine ait tüm gönderimleri
  KVKK/GDPR talebiyle kalıcı silmek.
- Yetki:
  | İşlem | Yetki |
  |---|---|
  | Listeyi ve gönderim detayını görmek | `content:read` |
  | Durum değiştirme (tekli/toplu), not ekleme, CSV dışa aktarma, e-postaya göre silme | `content:write` (UI'da "güncelleme" izni; yoksa bu düğmeler ve seçim kutuları görünmez) |
  - Yetkisizse "Erişim reddedildi / Access denied — Bu formun gönderimlerini görüntüleme yetkiniz yok."
- Entity: [../../entities/form.md](../../entities/form.md) (gönderim, durum geçişleri, saklama süresi).

## Kişisel veri kuralı (bu ekran için zorunlu)
Gönderimler ad, e-posta, telefon, adres, sipariş bilgisi, serbest metin gibi **kişisel veri** içerir.
- Claude gönderim içeriğini (yanıtlar, ad, e-posta, telefon, notlar, yönlendiren/iniş adresi) **sohbete aktarmaz,
  alıntılamaz, özetlemez**. Sohbete yalnız **sayı ve toplu özet** verir: toplam/filtreli gönderim sayısı, duruma göre
  dağılım, tarih aralığı, kaç gönderimin durumu değişti, kaç kayıt silinecek/silindi.
- Kullanıcı tek bir gönderimi sorarsa: gönderimi tarayıcıda açar, kullanıcıya "detay panelde açık, ekrandan
  okuyabilirsin" der; içeriği yazmaz. Snapshot/ekran görüntüsü çıktısındaki kişisel veriyi rapora/sohbete kopyalamaz.
- E-postaya göre silme için e-posta adresini kullanıcı verir veya tarayıcıda kendisi yazar; Claude adresi başka bir
  yere taşımaz, raporda "verilen e-posta" diye anar.
- **CSV dışa aktarma** kişisel veri içeren bir dosyayı kullanıcının bilgisayarına indirir: önce onay al (filtreler +
  yaklaşık satır sayısı ile). Claude indirilen dosyayı **açmaz, okumaz, sohbete aktarmaz**.
- **E-postaya göre silme** geri alınamaz: kural 5'e göre etkilenen kayıt sayısıyla ayrıca onay al.

## Ön koşullar ve bağımlılıklar
- Form mevcut olmalı (silinmiş/bulunamayan formda "Bu form artık mevcut değil — silinmiş olabilir.").
- Gönderim yalnız yayındaki forma vitrinden gelir; taslak formda kutu boştur.

## Yerleşim
- Başlık "Gönderimler / Submissions", açıklama olarak form adı; "Formlara dön". Sağda (yazma yetkisiyle):
  "Bu e-postaya ait tüm verileri sil / Delete all data for this email" (kırmızı çerçeveli) ve "CSV dışa aktar / Export CSV".
- Filtre satırı: arama "Gönderimlerde ara... / Search submissions..." (e-posta ve metin yanıtlarında arar, ~300 ms
  gecikmeli), "Başlangıç / From" ve "Bitiş / To" tarih alanları (`#submissions-date-from`, `#submissions-date-to`,
  mağaza saat dilimiyle gün bazında), Durum select'i "Tüm durumlar / All statuses" + Yeni / İşlemde / Kapatıldı.
- Tablo: (seçim kutusu, "Bu sayfadaki tüm gönderimleri seç"), Gönderim tarihi / Submitted, Gönderen / Submitted by
  (formdaki ilk ad/kimlik yanıtı), E-posta / Email, Durum / Status, İlgili / Related (ürün veya sipariş bağlantısı),
  satır menüsü "Menüyü aç" → "Görüntüle / View".
- Seçim yapılınca seçim çubuğu: "{n} seçili" + "Durumu değiştir / Change status".
- Sayfalama 20'şerli. Boş durum: "Henüz gönderim yok / No submissions yet — Alıcılar bu formu doldurdukça gönderimler
  burada görünecek."

### Gönderim detay paneli (sağdan açılır, başlık "Gönderim / Submission" + durum rozeti, altında e-posta)
- "Yanıtlar / Answers": alan etiketi → yanıt.
- "Detaylar / Details": Gönderim tarihi, Dil, Mağaza görünümü, Yönlendiren, İniş sayfası, Kampanya (UTM değerleri).
- "Onaylar / Consents": onay metni + "{tarih} tarihinde onaylandı".
- İlgili kayıt: "Ürünü görüntüle / View product" veya "Siparişi görüntüle / View order".
- "Durum / Status": yalnız geçerli sonraki durum(lar)ı sunan select + "Durumu değiştir"; başka geçiş yoksa
  "Başka bir durum değişikliği yok."
- "Notlar / Notes": mevcut notlar (yoksa "Henüz not yok."), textarea "Ekibiniz için bir not ekleyin..." + "Not ekle".
- Gönderimde e-posta varsa altta "Bu e-postaya ait tüm verileri sil" (silme diyaloğunu o e-postayla kilitli açar).

## Alanlar
| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Filtre | Gönderimlerde ara... | Input | — | — | `getByLabel('Ara')` / placeholder | |
| Filtre | Başlangıç / From, Bitiş / To | `input[type=date]` | — | gün | `#submissions-date-from`, `#submissions-date-to` | |
| Filtre | Durum | Select | — | Tüm durumlar | combobox | |
| Toplu diyalog | Yeni durum / New status | Select | evet | Yalnız seçili tüm gönderimler için ortak geçerli durum(lar) | `getByRole('combobox',{name:'Yeni durum'})` | Ortak geçiş yoksa "Bu gönderimlerin ortak bir sonraki durumu yok — tek tek değiştirin." |
| Detay | Durum | Select + "Durumu değiştir" | — | Geçerli sonraki durumlar | `getByRole('combobox',{name:'Durum'})` | |
| Detay | Not | Textarea + "Not ekle" | — | boş not eklenemez | `getByLabel('Ekibiniz için bir not ekleyin...')` | Notlar eklenir, düzenlenmez/silinmez |
| Silme diyaloğu | E-posta adresi / Email address (placeholder `musteri@example.com`) | `input[type=email]` `#erasure-email` | evet | — | `#erasure-email` | Detaydan açıldıysa salt okunur |

Durum geçişleri: Yeni → İşlemde; İşlemde → Kapatıldı; Kapatıldı → İşlemde (yeniden açma). Doğrudan Yeni → Kapatıldı yoktur.

## Aksiyonlar
| Düğme (tr / en) | Etki | Onay / Toast |
|---|---|---|
| Görüntüle / View | Detay panelini açar (okuma) | — |
| Durumu değiştir (detay) | Tek gönderimin durumunu değiştirir | "Durum güncellendi"; geçiş artık geçerli değilse "Bu durum değişikliği artık kullanılamıyor. Lütfen sayfayı yenileyip tekrar deneyin." |
| Not ekle | Gönderime ekip notu ekler (yazan kullanıcı adıyla) | "Not eklendi" |
| Seçim çubuğu → Durumu değiştir | Diyalog "Durumu değiştir — {n} gönderimin durumu değiştirilsin mi?" → Yeni durum → "Durumu değiştir" | Sonuç toast'ı "{n} güncellendi, {m} başarısız oldu / hiçbiri başarısız olmadı" |
| CSV dışa aktar / Export CSV | O anki filtrelerle (arama, durum, tarih) **eşleşen tüm** gönderimleri CSV dosyası olarak indirir (yalnız görünen sayfa değil). Sütunlar: her alanın etiketi, gönderim tarihi, durum, e-posta, kampanya (UTM) değerleri, ürün/sipariş bilgisi | Toast yok; tarayıcı indirmesi. Kişisel veri → önce onay |
| Bu e-postaya ait tüm verileri sil | Diyalog: başlık aynı; açıklama "Bu işlem, girdiğiniz e-postaya ait **tüm formlardaki** tüm gönderimleri kalıcı olarak siler. Bu işlem geri alınamaz." → e-posta yaz → "Kaç kaydın silineceğini kontrol et" → "{e-posta} — {n} gönderim silinecek" → **"Kalıcı olarak sil"** (kırmızı; yalnız kontrol edilen e-posta değişmeden durursa aktif) | "{n} gönderim silindi" / "Silinecek gönderim yok" |

## Yan etkiler
- Durum ve not değişiklikleri yalnız admin içindir; gönderene bildirim gitmez (doğrulanmadı).
- E-postaya göre silme **bu formla sınırlı değildir**: mağazadaki tüm formlarda o e-postaya ait gönderimleri siler.
  Silinen gönderimler geri getirilemez; işlem kaydı tutulur.
- Gönderimler formun saklama süresi (varsayılan 365 gün) dolunca kendiliğinden kalıcı silinir; formda saklama süresi
  değiştirilip yayınlanınca mevcut gönderimlerin süresi de yeniden hesaplanır ([forms.md](forms.md) Yan etkiler).
- Formu yayından kaldırmak/arşivlemek gönderimleri silmez.

## Tuzaklar
- "Kaç kaydın silineceğini kontrol et" yalnız sayar (kalıcı değişiklik yapmaz); onu çalıştırıp sayıyı kullanıcıya
  bildir, açık onay gelmeden "Kalıcı olarak sil"e basma. E-posta alanını kontrolden sonra değiştirirsen sayı geçersiz
  olur ve düğme pasifleşir — yeniden kontrol et.
- Toplu durum değişikliği yalnız seçili sayfadaki satırlara uygulanır; sayfa değişince seçim o sayfada olmayanlar için düşer.
- Toplu durum değişikliği kısmen başarısız olabilir; sonuç toast'ındaki başarısız sayısını raporla.
- CSV indirmesi bir bağlantıdır; tıklamak doğrudan indirir, ara onay diyaloğu yoktur.
- Detay paneli ve tablo kişisel veri gösterir; snapshot çıktısını sohbete kopyalama (yukarıdaki kural).

## Doğrulama
- Durum: tabloda rozet yeni durumu gösterir; Durum filtresiyle sayılar tutarlı.
- Not: detay panelinde not listesinde yeni not (içeriğini sohbete yazma; "not eklendi" de).
- Silme: toast'taki silinen sayı, kontrol aşamasındaki sayıyla aynı; tabloda o e-postaya ait satır kalmadı (arama ile
  kontrol et, sonucu yalnız "0 kayıt" olarak raporla).
- Dışa aktarma: tarayıcıda dosya indirildi (dosyayı açma); raporda yalnız uygulanan filtreleri ve tablo toplamını yaz.
