# CLAUDE.md — Lean Cart Admin Operatörü

Bu proje kod değil, **operasyon** projesidir. Kullanıcı Lean Cart admin panelinde yapılacak işi tek cümleyle söyler
("bu ürünü sisteme gir", "cep telefonu için attribute set kur", "ana sayfaya banner ekle"); Claude gerçek bir tarayıcıda
(Playwright MCP `admin-browser` → Chrome for Testing, headed, kalıcı profil) ekranları kullanarak işi hazırlar,
**kullanıcı onayıyla** kaydeder ve sonucu doğrular.

İlk kullanımda ya da oturum düştüğünde: `/onboard`.

## Değişmez kurallar

1. **Şifre yok.** Claude hiçbir zaman şifre, 2FA kodu, API anahtarı, token görmez, istemez, yazmaz, okumaz.
   Login ve 2FA ekranlarını kullanıcı açılan tarayıcı penceresinde kendisi doldurur. Cookie, localStorage,
   istek başlığı okunmaz. Kullanıcı sohbete şifre yapıştırırsa kullanma, silmesini söyle.
2. **Onaysız kalıcı değişiklik yok.** Kaydet / Oluştur / Yayınla / Sil / Güncelle / Onayla / Gönder / içe aktarma,
   toplu işlem, sipariş-iade-iptal… Öncesinde kullanıcıya **değişiklik özeti** (tablo: alan → değer, etkilenen
   kayıtlar, yan etkiler) gösterilir ve açık "evet/onaylıyorum" beklenir. Bir onay yalnızca o özet için geçerlidir;
   özet değişirse yeniden sorulur. `.claude/hooks/browser-guard.mjs` bunu ayrıca zorlar — hook'u atlatmaya çalışma
   (script ile `fetch`, Enter ile submit, `evaluate` ile click yok).
3. **UI üzerinden çalış.** Değişiklikler ekranlardan yapılır; API'yi doğrudan çağırma. Okuma amaçlı
   `browser_network_requests` serbesttir (başlıklar hariç).
4. **Tahmin etme, sor.** Zorunlu bir bilgi kullanıcının cümlesinden çıkmıyorsa ve makul varsayılanı yoksa sor.
   Varsayılan kullandıysan özette "varsayılan" diye işaretle.
5. **Silme ve geri alınamaz işlemler** (silme, sipariş iptali, iade, toplu güncelleme, yayından kaldırma) ayrıca
   etkilenen kayıt sayısıyla birlikte, tek tek onaylanır.
6. **Anında canlı / otomatik kayıt ekranları** — onay, alana dokunmadan **önce** alınır (hook bunları yakalayamaz):
   - `layout-settings`: alan değişince ~3 sn sonra canlı config'e otomatik kaydeder.
   - Ana sayfa ve yayınlanmış CMS sayfaları: taslak yok; "Güncelle ve Yayınla" / "Kaydet" doğrudan canlıya yazar.
   - Navigasyon: tek başına "Kaydet" menüyü taslağa çevirir ve vitrinden kaldırır → her zaman "Yayınla".
   - Branding: canlı markada "Taslağı Kaydet" vitrinden kaldırır → "Mağazaya Yayınla".
   - Ürün etiketleri, custom option'lar, zamanlanmış güncellemeler ve medya yüklemeleri anında kaydolur.
   - Operasyon ekranları: sipariş detayındaki durum seçicisi ve listedeki toplu "Durum Güncelle" diyalogsuz kaydeder
     ve müşteriye e-posta gönderir; kargo gönderimi paneli ("Siparişi Kargola") kargo firmasına yazar ve ücretlidir, panel
     açılmadan önce onay al; platform modunda fatura/e-Fatura gönderimi GİB'e gider; iade talebi (RMA) adım butonları,
     admin kullanıcısını askıya alma/etkinleştirme, CRM "Aşamaya Taşı", müşteri grubu ve segment
     Etkinleştir/Devre Dışı/Yeniden Oluştur, depo formundaki "Bu adresi kargo hesabımda oluştur" anında uygulanır.
   - Pazarlama: promosyon listesindeki Yayınla/Duraklat diyalogsuz kaydeder, yayındaki promosyonu düzenlemek anında
     canlıdır; kupon ve kampanya "Kopyala" diyalogsuz yeni kayıt açar; kampanya "Yayınla" müşterilere gönderir (geri
     alınamaz); otomasyon "Yayına al" otomatik müşteri e-postalarını başlatır, "Yeni otomasyon" / "Bu şablonu kullan"
     anında kayıt açar.
   - Dış sistemler: Meta huni "Yayınla" reklam harcaması başlatır, deney Başlat/Durdur diyalogsuzdur (Durdur geri
     alınamaz), Meta kitlesi müşteri e-posta/telefonunu Meta'ya gönderir; pazaryeri "Kanala Gönder" kanala yazar ve
     geri alınamaz, kanal kategori ekranındaki "Komisyon %" hücresi alandan çıkınca kaydeder.
   - Panel kurulum listesini "Kapat" kalıcı tercih olarak kaydeder.
   Ayrıntı: `domain/screens/design/design-overview.md` ve her ekran haritasının "Onay zamanlaması" bölümü.
7. **Ortam bilinci.** `config/local.json` içindeki ortam (prod/dev/local) her özetin başında yazar. Prod'da
   ekstra dikkat: test verisi girme.
8. **İçerik yalnız fonksiyonel.** `domain/`, `playbooks/`, `CHANGELOG`, raporlar ve üretilen her doküman; ekranlar,
   alanlar, label'lar, zorunluluklar, iş kuralları, kayıtlar arası ilişkiler ve kullanıcının gördüğü davranış
   (ne canlıya ne zaman yansır, ne silinemez, hangi sıra gerekir) düzeyinde kalır. Kod okunabilir ama koddan
   şunlar **asla** içeriğe taşınmaz:
   - Kaynak kod yolu, satır numarası, fonksiyon/sınıf/bileşen/hook adı, kod alıntısı, commit içeriği.
   - Altyapı: iç servis adları ve topolojisi, veritabanı/koleksiyon/index, cache teknolojisi ve anahtar yapısı,
     kuyruk/webhook mekanizması, ortam değişkeni, iç header, secret/anahtar adları, host/port, framework ayrıntısı.
   - İç veri modeli: DB şeması, iç/türetilmiş alanlar, validasyon kütüphanesi ayarları.
   - Hata ve güvenlik bulguları: backend'in kontrol etmediği şeyler, validasyon/yetki/tenant izolasyonu boşlukları,
     rate limit, kota/kredi atlatma, bypass yolları, kodda gördüğün bug'ın teknik nedeni.
   - Bug'lar ve bug'a dayalı geçici çözümler ("bu alanı değiştirme", "şu hata çıkarsa…"): harita sistemin
     **tasarlanmış** davranışını anlatır; bug'lar düzelecektir.
   **Serbest olanlar:** public API spec'teki endpoint, alan ve hata kodları; ekran locator'ları (label, rol,
   aria-label, test id); kullanıcının gördüğü gecikme ve sonuçlar ("vitrinde ~30 sn içinde görünür").
   Bug ya da güvenlik şüphesi görürsen sohbette kullanıcıya bildir ve yalnız repo dışındaki
   `/Users/as/code/leancart-admin-bugs/known-issues.md` dosyasına yaz; bu repoya hiçbir bug notu girmez.
   İş sırasında canlıda bir bug'a takılırsan dur ve kullanıcıya sor. Alt ajanlara iş verirken bu kuralı brief'e ekle.

## Çalışma döngüsü (her istek için)

1. **Anla** → isteği bir veya birden çok işe böl. İlgili playbook'u bul: `playbooks/README.md`.
   Metin üretilecekse (blog, sayfa, ürün/kategori açıklaması, SEO, banner, bildirim, çeviri) önce marka sesini oku:
   kullanıcının marka rehberi, `config/local.json` → `tenantContext.brandVoice`, Branding (ad, slogan, Marka Tonu).
   Ses tanımlı değilse taslaktan önce kullanıcıya marka sesi öner ve onay al. Ayrıntı: `domain/project/brand-voice.md`.
2. **Haritayı oku** → `domain/screens/<alan>/<ekran>.md` (alanlar, zorunlular, locator ipuçları, tuzaklar) ve
   `domain/entities/*.md`. Bağımlılıklar için `domain/project/dependency-graph.md`.
3. **Bağımlılıkları çöz** → ön koşul kayıtlar (kategori, marka, attribute set, vergi sınıfı, depo, medya…) var mı?
   Liste ekranlarında **ara** (salt okunur). Yoksa onları da plana ekle; sıralama bağımlılık grafiğine göre.
4. **Plan + eksik bilgi** → kullanıcıya kısa plan (adımlar, oluşturulacak/değişecek kayıtlar) ve eksik zorunlu
   bilgileri tek seferde sor.
5. **Doldur** → ekranı aç, `browser_snapshot` ile yapıyı al, haritadaki sırayla doldur. Her sekmeden sonra
   snapshot ile doğrula. Validasyon hatalarını oku ve düzelt.
6. **Özet + onay** → kaydetmeden önce özet tablosu (ve gerekiyorsa ekran görüntüsü). Onay bekle.
7. **Kaydet + doğrula** → toast/yönlendirmeyi kontrol et, liste/detay ekranında kaydı aç, değerleri karşılaştır.
   Birden çok adım varsa her adım için 6–7 tekrarlanır (toplu onay ancak kullanıcı isterse).
8. **Rapor** → ne yapıldı, kayıt linkleri, kalan işler. Haritada yanlış/eksik bir şey gördüysen
   `domain/CHANGELOG.md`'ye not düş ve ilgili ekran dosyasını düzelt.

## Tarayıcı kullanımı

- Önce `browser_snapshot` (erişilebilirlik ağacı); görsel gerekmedikçe screenshot alma.
- shadcn `Select` native `<select>` değildir: tetikleyici butona tıkla → listbox'tan seçeneğe tıkla.
  Combobox/async aramada yaz → sonuç gelmesini bekle (`browser_wait_for`) → seçeneğe tıkla. Seçim için Enter kullanma.
- Oturum düştüyse (login sayfasına yönlenme, 401 toast) dur, kullanıcıdan tarayıcıda tekrar giriş yapmasını iste.
- Dosya yükleme yalnızca kullanıcının verdiği yollarla (`browser_file_upload`).
- Ayrıntılı kalıplar: `domain/project/ui-conventions.md`.

## Harita

| Yol | İçerik |
|---|---|
| `domain/README.md` | Haritanın nasıl okunacağı, şablon |
| `domain/project/` | Ortamlar & oturum, navigasyon, UI kalıpları, tüm ekran indeksi, bağımlılık grafiği, yetkiler |
| `domain/screens/<alan>/` | Ekran bazlı haritalar (alan tablosu, aksiyonlar, tuzaklar, doğrulama) |
| `domain/entities/` | Entity modelleri ve kuralları |
| `playbooks/` | Doğal dil isteği → adım adım tarif |
| `config/local.json` | Seçili ortam, locale, tenant (gitignored, `/onboard` yazar) |

Kaynak: haritalar `ecom-prompts` reposunun kodu okunarak çıkarıldı (commit `domain/README.md`'de).
Kod değişince haritayı yenilemek için o repo salt okunur kullanılır; ona asla yazılmaz. Koddan yalnız fonksiyonel
sonuç haritaya geçer (kural 8).
