# Vergiler (Taxes)
- URL: {ADMIN_URL}/settings/taxes
- Menü yolu: Sol menü "Ayarlar / Settings" → "Vergiler / Taxes" (hub'da kartı yoktur).
- Kart başlığı: "Vergiler / Taxes"; açıklama "Fiyatlarınızda verginin nasıl işleneceğini ve müşterilerin ne göreceğini seçin."
- Amaç: Mağaza genelinde iki vergi eksenini belirlemek — girilen ürün fiyatlarının KDV dahil mi hariç mi olduğu ve vitrinde müşteriye KDV dahil mi gösterileceği — ve sepette müşteri grubu/adet (kademe) fiyatlarının uygulanıp uygulanmayacağı. Canlı önizleme etkisini örnek fiyatla gösterir.
- Yetki: ekran `settings:read`; okuma `products:read`, kaydetme `products:write`.
- Oranlar burada değil, [tax-classes.md](tax-classes.md) ekranında.

## Ön koşullar ve bağımlılıklar
- Önizleme varsayılan vergi sınıfının oranını kullanır; varsayılan sınıf yoksa önizleme %0 ile hesaplar (doğrulanmadı).
- Etkiledikleri: tüm ürün fiyatlarının yorumu (net/brüt), vitrin fiyat gösterimi, sepet/ödeme tutarları, giriş yapmış müşterinin sepetteki fiyatı.

## Yerleşim
Tek kart:
1. "Girdiğim ürün fiyatlarına vergi dahildir" anahtarı.
2. "Müşterilere fiyatları vergi dahil göster" anahtarı.
3. "Önizleme / Preview" kutusu (`data-testid="tax-preview"`).
4. Alt başlık "Müşteri fiyatlandırması / Customer pricing" + sepet kademe fiyatı anahtarı.
5. Sağ altta "Değişiklikleri kaydet / Save changes".
Yükleme hatasında: "Vergi ayarlarınız yüklenemedi. Lütfen tekrar deneyin." + "Tekrar Dene"; bu durumda anahtarlar ve Kaydet pasif.

## Alanlar
| Label (tr / en) | Kontrol | Varsayılan (ilk kurulum) | Locator ipucu | Etki |
|---|---|---|---|---|
| Girdiğim ürün fiyatlarına vergi dahildir / Product prices I enter include tax | Switch | açık | `#prices-entered-with-tax` | Açık: ürün formuna yazılan fiyat KDV dahil (brüt). Kapalı: net, KDV üstüne eklenir |
| Müşterilere fiyatları vergi dahil göster / Show customers prices with tax included | Switch | açık | `#display-prices-with-tax` | Vitrinde her yerde KDV dahil fiyat |
| Sepette kademe fiyatlarını (müşteri grubu ve adet) uygula / Apply tier prices (customer group and quantity) in the cart | Switch | kapalı | `#cart-customer-pricing` | Giriş yapmış müşteriler sepet ve ödemede grup/adet fiyatıyla ücretlendirilir; ürün sayfaları normal fiyatı göstermeye devam eder |

Önizleme metni (anahtarlar değiştikçe, kaydetmeden önce güncellenir):
- Vergi dahil gösterim: "{entered} girersiniz → müşteri {gross} görür ({tax} vergi dahil)"
- Vergi hariç gösterim: "{entered} girersiniz → müşteri {net} görür, {gross} öder (+{tax} vergi)"

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Değişiklikleri kaydet / Save changes | Üç anahtar birlikte kaydedilir | "Vergi ayarlarınız kaydedildi." / "Vergi ayarlarınız kaydedilemedi. Lütfen tekrar deneyin." |

## Onay zamanlaması (kural 2/5)
- Anahtarlar Kaydet'e kadar kaydolmaz; normal özet → onay → Kaydet.
- Bu ekran **mağaza genelinde toplu etki** yapar: özetinde önizlemedeki "önce → sonra" metnini ve "tüm ürün fiyatları ve sepet tutarları etkilenir" uyarısını yaz; kural 5 gibi ayrı ve açık onay iste. Prod'da ekstra dikkat.

## Yan etkiler
- "Fiyatlara vergi dahil" değişimi mevcut fiyatları yeniden **yorumlar**: aynı rakam bir anda net↔brüt olur, müşterinin ödeyeceği tutar değişir (ürün fiyatları otomatik yeniden hesaplanmaz — doğrulanmadı).
- Gösterim değişimi vitrin fiyatlarını değiştirir; yansıma süresi doğrulanmadı.
- Kademe fiyatı açılınca müşteri grubu/adet fiyatları sepette devreye girer.

## Tuzaklar
- Kullanıcı yalnız "vitrinde KDV dahil göster" dediyse "Girdiğim fiyatlara vergi dahildir"e dokunma; iki eksen bağımsızdır.
- Mevcut katalog fiyatları hangi varsayımla girildiyse ilk anahtar onunla uyumlu kalmalı; emin değilsen kullanıcıya sor.

## Doğrulama
1. Toast.
2. Sayfayı yenile → üç anahtarın durumu ve önizleme metni beklenenle aynı.
3. Gerekirse vitrinde bir ürünün fiyatı (KDV dahil/hariç gösterim).
