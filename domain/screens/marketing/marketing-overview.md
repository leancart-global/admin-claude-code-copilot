# Pazarlama (hub)
- URL: {ADMIN_URL}/marketing
- Menü yolu: sidebar'daki "Pazarlama / Marketing" grup butonu bu sayfaya **gitmez** (yalnız alt menüyü açar); sayfaya URL
  ile gidilir. Alt menü öğeleri: Kampanyalar, Promosyonlar, Kuponlar, Değerlendirmeler, Meta Reklamlar
  ([../../project/navigation.md](../../project/navigation.md)).
- Sayfa başlığı: "Pazarlama / Marketing"; açıklama "Pazarlama kampanyalarınızı, promosyonlarınızı ve müşteri
  etkileşimlerinizi yönetin / Manage your marketing campaigns, promotions, and customer engagement".
- Amaç: Pazarlama ekranlarına hızlı giriş. Salt gezinme sayfasıdır; hiçbir kayıt oluşturmaz/değiştirmez.
- Entity: — (bkz. alt ekranlar).
- Yetki: `marketing:view`.

## Ön koşullar ve bağımlılıklar
- Yok. Kartların açtığı ekranların kendi ön koşulları vardır (ör. kampanya için segment, kupon için promosyon).

## Yerleşim
1. Başlık + açıklama.
2. **Meta öne çıkan kartı**: başlık "Meta Reklamları Entegrasyonu / Meta Ads Integration" + rozet "Yeni / New", açıklama
   "Facebook ve Instagram reklamlarını yayınlamak için Meta Business hesabınızı bağlayın"; sağda **"Başla / Get Started"**
   butonu → `/marketing/meta-ads`. Kartın altında 4 hızlı istatistik kutusu: "Aktif Hunlar / Active Funnels", "Hedef
   Kitleler / Audiences", "Aktif Uyarılar / Active Alerts", "Çalışan Testler / Running Tests" — bu sürümde değer olarak
   hep "-" gösterir (sayı okumak için ilgili Meta ekranlarına git).
3. **Özellik kartları** (4'lü grid; kartın tamamı ve içindeki "Aç / Open" butonu tıklanabilir):

| Kart başlığı (tr / en) | Açıklama (tr) | Gider | Harita |
|---|---|---|---|
| Meta Reklamları / Meta Ads (rozet "Yeni") | Otomatik hunilerle Facebook ve Instagram reklam kampanyalarını yönetin | `/marketing/meta-ads` | [meta/meta-overview.md](meta/meta-overview.md) |
| Kampanyalar / Campaigns | Tüm kanallarda promosyon kampanyaları oluşturun ve yönetin | `/marketing/campaigns` | [campaigns.md](campaigns.md) |
| Kuponlar ve İndirimler / Coupons & Discounts | İndirim kodları ve promosyon teklifleri oluşturun | `/marketing/coupons` | [coupons.md](coupons.md) |
| Değerlendirmeler / Reviews | Müşteri yorumlarını ve puanlarını yönetin | `/marketing/reviews` | [reviews.md](reviews.md) |

## Hub'da kartı olmayan pazarlama ekranları
| Ekran | URL | Nasıl açılır | Harita |
|---|---|---|---|
| Promosyonlar / Promotions | `/marketing/promotions` | Sidebar "Pazarlama" → "Promosyonlar" | [promotions.md](promotions.md) |
| Otomasyonlar (iş akışları) / Workflows | `/marketing/workflows` | Menüde ve hub'da yok; yalnız URL ile | [workflows.md](workflows.md) |
| Meta ayarları | `/marketing/meta/settings` | Meta Reklamlar genel bakış → "Ayarlar" kartı / bağlantı bandı | [meta/meta-settings.md](meta/meta-settings.md) |
| E-posta yönetimi | `/email-management` | — | E-posta yönetimi — kapsam dışı |

## Alanlar
- Yok (form yok).

## Aksiyonlar
| Buton / kart | Ne olur | Toast |
|---|---|---|
| "Başla" (Meta kartı) | `/marketing/meta-ads` açılır | — |
| Özellik kartı / "Aç" | İlgili listeye gider | — |

## Onay zamanlaması (kural 2/5/6)
- Bu sayfada kalıcı işlem yok; onay gerekmez.
- Kartların açtığı ekranlardaki gönderim/yayın aksiyonları (kampanya gönderimi, otomasyon yayına alma, Meta'ya yazma)
  müşteriye ya da dış sisteme gider → ilgili haritanın "Onay zamanlaması" bölümüne bak.

## Yan etkiler
- Yok.

## Tuzaklar
- Kart açıklamasında "tüm kanallarda" yazsa da kampanyalar bu sürümde yalnız **e-posta** kanalıyla oluşturulur
  ([campaigns.md](campaigns.md)).
- Promosyonlar ve Otomasyonlar hub'da kart olarak yok; yukarıdaki tablodan git.

## Doğrulama
- Sayfa başlığı "Pazarlama" ve 4 özellik kartı görünür; karta tıklayınca URL ilgili ekrana döner.
