# Entity: Shipping Carrier (Kargo Taşıyıcısı) ve Kargo Motoru Ayarları

Mağazanın kargo firması entegrasyonu ve ödeme adımındaki kargo seçenek/ücretlerini belirleyen ayarlar. Mağaza (tenant)
başına tanımlıdır.

- Ekran: [../screens/settings/shipping-carriers.md](../screens/settings/shipping-carriers.md).
- Yetki: okuma `shipping:read`, yazma `shipping:write`.

## Kargo yöntemi (kendi sabit ücret)
Kargo firması entegrasyonu olmayan mağazanın kendi tanımladığı yöntem; taşıyıcıdan bağımsızdır, mağaza başına birden çok olabilir.
| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| Ad | string | evet | — | ≤100 karakter; mağazada benzersiz |
| Fiyat | tutar (mağaza temel para birimi) | evet | — | ≥0 |
| Teslim süresi | gün | evet | 2 | 1–365 |
| Açıklama | string | hayır | — | ≤500 karakter |
| Ücretsiz kargo limiti | tutar | hayır | boş | Sipariş tutarı limite ulaşınca ücretsiz; boş = her zaman fiyat |
| Ödemede sun (Aktif) | bool | — | true | Pasif yöntem ödeme adımında sunulmaz |
Silme kalıcıdır; mevcut gönderilerde kullanılan yöntem silinemez (pasife alınır). Ekran: Kargo yöntemleri kartı.

## Taşıyıcı yapılandırması
| Alan | Tip | Zorunlu | Varsayılan | Kural / not |
|---|---|---|---|---|
| Sağlayıcı (provider) | enum | evet | — | Şu an yalnız `geliver` eklenebilir (ups, fedex, dhl "Yakında"). Sağlayıcı başına **tek** kayıt; eklendikten sonra değiştirilemez |
| Görünen Ad | string | evet | — | En az 2 karakter |
| API Anahtarı / Token | gizli | eklemede evet | — | Gizli; admin listesinde yalnız "Ayarlı / Eksik" görünür |
| API Şifresi | gizli | hayır | — | Geliver'de yok |
| Webhook Şifresi | gizli | hayır | — | |
| Organizasyon ID | string | Geliver'de evet | — | Bakiye sorgusu ve API işlemleri |
| Test Ortamı Modu (sandbox) | bool | — | **true** | false = Canlı |
| Aktif (isActive) | bool | — | true (doğrulanmadı) | Pasifken fiyat sunmaz |
| Varsayılan (isDefault) | bool | — | false | Tek varsayılan; varsayılan kaldırılamaz |
| Alt taşıyıcılar | liste | — | — | Geliver'in etkin alt firmaları (Aras, Yurtiçi, MNG, PTT, HepsiJet…); ekranda yalnız sayı görünür |

Silme: "Kaldır" ile kalıcı silinir; daha sonra yeniden eklenebilir. Varsayılan olan silinemez.

## Kargo motoru ayarları (Geliver yapılandırılınca)
| Ayar | Değerler / varsayılan | Etki |
|---|---|---|
| Seçim stratejisi | `cheapest` (En Ucuz, varsayılan) · `fastest` (En Hızlı) · `priority` (Öncelik Sıram) · `manual` (Manuel Seçim) | Siparişte hangi firmanın seçileceği |
| Kargoyu otomatik onayla | true | Manuel'de etkisiz |
| Otomatik Kargo | false | Sipariş onaylanınca kargo otomatik oluşturulur |
| Kapıda ödeme | kapalı; ücret 0, min 0, maks 0 (= limit yok) | Checkout'ta kapıda ödeme seçeneği ve ek ücret; vitrinde yalnız PTT ile |
| Firma adını göster / Tahmini teslimi göster | true / true | Checkout görünümü |
| Bakiye uyarı eşikleri | düşük / kritik (ekranda salt okunur) | Satıcıya bakiye uyarı bildirimi |

## Kargo öncelik sırası
Firma listesi, sıralı. Yalnız strateji `priority` iken kullanılır; birden fazla firma gönderiyi karşılayabiliyorsa üstteki
tercih edilir, eşitlikte en ucuz. Boşsa "Varsayılan Öncelikleri Yükle" Türkiye pazarı sırasını oluşturur.

## Fiyatlandırma kuralı
| Alan | Tip | Kural |
|---|---|---|
| Kural Adı | string | zorunlu |
| Tip | `free_shipping` · `weight_surcharge` · `regional_surcharge` | |
| Aktif | bool | varsayılan true |
| Koşul — ücretsiz kargo | minimum sipariş tutarı (₺) | Tutarın üzerindeki siparişte kargo ücretsiz |
| Koşul — ağırlık | min kg, maks kg (boş = üst limit yok) | |
| Koşul — bölgesel | bölgeler (7 coğrafi bölge) ve/veya iller (plaka kodu) | |
| Ayarlama | Sabit Tutar (₺) veya Yüzde (≤100) | Ağırlık/bölgesel kurallarda ek ücret |
| Başlangıç / Bitiş Tarihi | tarih, opsiyonel | Boş = süresiz. Rozet: Aktif / Planlandı / Süresi Dolmuş / Süresiz |
Silme kalıcıdır (onay dialoglu).

## Varsayılan paket ölçüsü
Uzunluk, Genişlik, Yükseklik (cm), Ağırlık (kg) — dördü de >0 olmalı; kaldırılabilir. Ağırlığı/ölçüsü girilmemiş ürünlerde
kullanılır. Ücret desi ((U × G × Y) / 3000) ile gerçek ağırlıktan büyük olana göre hesaplanır. Tanımsızsa bu ürünler
platformun standart paketiyle (30 × 20 × 10 cm, 1 kg) fiyatlanır; ana sayfada ve ürün formunda uyarı çıkar.

## İlişkiler
- Depo (gönderici adresi) → fiyat alınabilmesi için gerekli.
- Ürün ağırlık/ölçüleri → ücret hesabı.
- Sipariş → teslimat tipi kargo ise kargo seçeneği/ücreti bu ayarlardan gelir; kargo oluşturma ve takip.
- Bildirim şablonları → kargo durum bildirimleri ve bakiye uyarıları.
