# Yapay Zeka Marka Kurulumu (AI Brand Wizard)
- URL: {ADMIN_URL}/branding/ai-wizard
- Amaç: Marka adı/slogan/hava/sektör ya da mevcut marka renklerinden yapay zekâ ile 3 renk paleti (23 renk + ton) ürettirmek, birini seçip mağazaya **doğrudan uygulamak ve yayınlamak**.
- Yetki (permission):
  - Sayfa: `settings:update` yoksa "erişim yok" ekranı.
  - Plan özelliği: `ai_branding_wizard` — plan yoksa yükseltme çağrısı görünür.
  - Uygula adımı marka kaydını günceller → ayrıca `products:write` gerekir (bkz. [branding.md](branding.md)).
- Veri akışı (işlevsel):
  | Amaç | Etki |
  |---|---|
  | Palet üret | Girilen bilgilerle AI'dan 3 palet önerisi alır (AI kredisi harcar; birkaç saniye – 2 dk) |
  | Mevcut markayı bul | Aktif (yoksa ilk) marka kaydını seçer |
  | Mevcut markayı güncelle | Yalnız renkler (mevcut + palet) ve ton |
  | Yeni marka oluştur (hiç yoksa) | Paletle yeni marka kaydı (logo boş, Inter yazı tipleri) |
  | Yayınla | Markayı vitrine yayınlar |
- Palet üretim girdileri: marka adı (zorunlu, ≤100), sektör (≤100), slogan (≤200), hava (luxury / minimal / playful / professional / bold / natural), mevcut ana renk ve ikincil renk (`#RRGGBB`), dil. Sonuç: 3 öneri (ad, açıklama, ton, 23 renk, erişilebilirlik uyumu).

## Ön koşullar ve bağımlılıklar
- Plan `ai_branding_wizard` + AI kredisi. Kredi biterse "no-credits" adımı görünür.
- Sihirbaz kaldığı adımı tarayıcıda hatırlar; sayfa yeniden açılınca kaldığı adımdan devam eder (üretim ve kredi bitti adımları hariç).

## Yerleşim
- Sayfa başlığı: "Yapay Zeka Marka Kurulumu / AI Brand Setup", alt başlık "Yapay zekanın mağazanızın renk paletini tasarlamasına izin verin / Let AI design your store's color palette", geri linki `/branding`.
- Üstte ilerleme çubuğu (4 görünür adım). Ortada tek seferde bir adım:
  1. `has-colors` → 2a. `color-input` (renkleri var) **veya** 2b. `discovery` (yardım iste) → 3. `generating` → 4. `results` → 5. `apply`; yan dal `no-credits`.
- Geri (`Geri / Back`) mantığı: color-input/discovery → has-colors; results/generating/no-credits → giriş adımı; apply → results.

## Alanlar
| Bölüm/Tab | Label (tr / en) | Form key | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|---|
| 1 has-colors | "Zaten marka renkleriniz var mi? / Do you already have brand colors?" | `hasExistingColors` | İki büyük kart-buton | Evet | – | button name "Evet, renklerim var / Yes, I have colors" (açıklama "Kullanmak istedigim renkleri biliyorum") veya "Hayır, seçmeme yardım et / No, help me choose" | tıklama hemen sonraki adıma geçirir |
| 2a color-input | Ana marka rengi / Main brand color | `primaryColor` | Renk seçici (label'sız; başlık h3) | – | varsayılan #004438 | `getByTestId('color-picker-trigger').first()` | |
| 2a | "Ikinci bir marka renginiz var mi? / Do you have a second brand color?" | `wantsAccent` | iki seçim butonu | – | – | "Evet, işte burada / Yes, here it is" — "Hayır, sadece ana renk / No, just the main color" | |
| 2a | (vurgu rengi) | `accentColor` | Renk seçici (sadece "Evet" seçilince) | – | #D4AF37 | ikinci color-picker-trigger | |
| 2a | Devam / Continue | – | Buton | – | her zaman aktif | | palet üretimini başlatır |
| 2b discovery | Marka adi / Brand name | `brandName` | Input | Evet | boş olamaz; ≤100 | `#ai-brand-name` | placeholder "Mağazam" |
| 2b | Slogan veya tanitim cumleniz / Slogan or tagline ("(Atla / Skip)") | `slogan` | Input | Hayır | ≤200 | `#ai-slogan` | placeholder "orn., Sizi yansitan moda" |
| 2b | "Mağazanızın nasıl bir havası olsun? / What vibe do you want your store to have?" | `vibe` | 6 kart-buton | Hayır | Luks/Luxury, Eglenceli/Playful, Profesyonel/Professional, Cesur/Bold, Minimal, Dogal/Natural | button name içinde hava adı | |
| 2b | Hangi sektorde faaliyet gosteriyorsunuz? / What industry are you in? | `industry` | Input | Hayır | ≤100 | `#ai-industry` | placeholder "orn., Moda, Elektronik, Gida" |
| 2b | Devam / Continue | – | Buton | – | marka adı boşsa disabled | | |
| 3 generating | "{brandName} için renk paletleri olusturuluyor... / Creating color palettes for {brandName}..." | – | Spinner | – | "Bu genellikle birkaç saniye surer" | | birkaç sn–2 dk sürebilir |
| 4 results | "Palet secenekleriniz hazir / Here are your palette options" | `palettes[]` | 3 kart (ad, renk kutucukları, açıklama) | – | – | her kartta "Bunu sec / Pick this one" | |
| 4 | Daha fazla secenek olustur / Generate more options | – | Buton | – | Üretimden sonra 15 sn bekleme; bu sırada disabled | | Yeni AI çağrısı = kredi harcar |
| 4 | Bunun yerine kendin ayarla / Set up manually instead | – | ghost Buton | – | – | | Sihirbaz sıfırlanır, `/branding`'e gider |
| 5 apply | "Uygulamaya hazir / Ready to apply" — "Renk Seti: {name}" renk listesi + "Önizleme" mini mağaza | – | salt okunur | – | – | | |
| 5 | Mağazama uygula / Apply to my store | – | Buton | – | basınca "Uygulanyor... / Applying..." | | **Hemen yayınlar** (aşağıya bak) |
| 5 | Renkleri kendin ayarla / Adjust colors manually | – | outline Buton | – | – | | Paleti UYGULAMADAN `/branding`'e gider, sihirbaz sıfırlanır |
| 5 | Farkli bir palet sec / Pick a different palette | – | ghost Buton | – | – | | results'a döner |
| no-credits | "Bu ay tüm AI kredilerinizi kullandınız / You've used all your AI credits this month" | – | – | – | – | "Daha Fazla Kredi Al / Buy More Credits", "Manuel Ayarla / Set Up Manually" | |

## Aksiyonlar
- **Palet üret** (Devam / Daha fazla): kredi yoksa no-credits adımı; diğer hata → toast "Paletler oluşturulamadı. Lütfen tekrar deneyin. / Could not generate palettes. Please try again." ve giriş adımına dönüş.
- **Mağazama uygula**:
  1. Aktif (yoksa ilk) marka kaydı seçilir.
  2. Varsa: renkler (mevcut + 23 AI rengi) ve ton güncellenir → yayınlanır. Tipografi, logo, kimlik değişmez.
  3. Yoksa: yeni marka kaydı oluşturulur (logo boş, Inter yazı tipleri) → yayınlanır. Logo ve kimlik sonra Marka Ayarları ekranından tamamlanmalı.
  4. Toast "Renkler mağazanıza uygulandı / Colors applied to your store", sihirbaz sıfırlanır, `/branding`'e yönlenir. Hata: "Renkler uygulanamadi. Lutfen tekrar deneyin."
  - **Onay dialog'u YOK** — tek tıkla canlıya çıkar. Claude bu butona basmadan ÖNCE kullanıcı onayı almalı.

## Yan etkiler
- Yayından sonra vitrin yeni renkleri ~30 sn içinde gösterir (bkz. branding.md "Yan etkiler").
- Mevcut markada kaydedilmiş taslak değişiklikler varsa uygulama onları da canlıya alır.
- Marka tonu AI'nın önerdiği stile ayarlanır.
- AI çağrısı kredi harcar.

## Tuzaklar
- Sihirbaz yeniden açıldığında önceki oturumun adımından (ör. results/apply) başlayabilir; temiz başlangıç için "Geri" ile has-colors'a dön.
- Palet üretimi uzun sürebilir (2 dk'ya kadar); generating ekranında bekle, sayfayı yenileme (istek iptal olur).
- Art arda "Daha fazla" basma; her basış kredi harcar.
- Palet sadece renk + ton değiştirir; font/köşe/logo için Marka Ayarları ekranı kullanılmalı.

## Doğrulama
- Toast "Renkler mağazanıza uygulandı" ve URL'nin `/branding` olması.
- Marka Ayarları ekranında Renkler bölümünde `Ana / Primary` değeri seçilen paletin ana rengi olmalı; sayfa başlığı açıklamasında "— Taslak" olmamalı.
- Network: güncelleme (veya oluşturma) + yayınlama istekleri 200.
- Vitrinde ~30 sn sonra yeni renkler.
