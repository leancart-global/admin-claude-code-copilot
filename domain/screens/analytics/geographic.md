# Coğrafi Analitik (Geographic Analytics)
- URL: {ADMIN_URL}/analytics/geographic
- Menü yolu: "Analitik / Analytics" → sekme "Coğrafi / Geographic".
- Sayfa başlığı: "Coğrafi Analitik / Geographic Analytics"; açıklama "Bölgeye göre gelir dağılımı ve tarayıcı kullanımı".
- Amaç: Seçilen dönemde ülke ve şehir bazında gelir/sipariş/müşteri dağılımını ve ziyaretçi tarayıcı dağılımını görmek.
  **Salt okunur.**
- Entity: metrik tanımları [../../entities/report.md](../../entities/report.md).
- Yetki: `analytics:read`.
- Kişisel veri: yok (yalnız toplu sayılar).

## Ön koşullar ve bağımlılıklar
- Yok. Ülke/şehir bilgisi siparişlerden ve ziyaret oturumlarından gelir; konumu bilinmeyen kayıtlar tablolara girmez
  (doğrulanmadı).

## Yerleşim
1. Başlık + açıklama; sağda **Dönem** Select ve "Yenile / Refresh".
2. "Ülkeye Göre Gelir / Revenue by Country" ("Gelire göre en iyi ülkeler"): "Ülke", "Gelir", "Sipariş", "Müşteri".
   Boş: "Ülke verisi bulunmuyor".
3. "Şehre Göre Gelir / Revenue by City": "Şehir", "Ülke", "Gelir", "Sipariş". Boş: "Şehir verisi bulunmuyor".
4. "Tarayıcı Analitiği / Browser Analytics" ("Ziyaretçi tarayıcı dağılımı"): "Tarayıcı", "Oturum", "Pay". Boş:
   "Tarayıcı verisi bulunmuyor".
5. Hata: "Coğrafi veriler yüklenemedi. Lütfen tekrar deneyin." (uyarı + toast).

## Alanlar
| Label (tr / en) | Kontrol tipi | Varsayılan | Locator ipucu | Not |
|---|---|---|---|---|
| Dönem | Select (shadcn) | **Son 30 Gün** | başlık sağındaki combobox | "Bugün", "Son 7 Gün", "Son 30 Gün", "Son 90 Gün" |

## Aksiyonlar
| Buton | Ne olur |
|---|---|
| Dönem seçimi / Yenile | Tablolar yeniden yüklenir (kayıt değişmez) |

## Onay zamanlaması
- Kalıcı aksiyon yok; onay gerekmez.

## Yan etkiler
- Yok.

## Tuzaklar
- Gelir tanımı Panel ile aynıdır (iptal/tam iade hariç); toplamı Panel'in "Toplam Gelir"iyle birebir eşleşmeyebilir
  çünkü konumu olmayan siparişler ülke tablosunda yoktur (doğrulanmadı).
- "Demo Veri" rozeti görünüyorsa rakamlar örnektir.

## Doğrulama
- Tablonun ilk satırlarını ve seçili dönemi birlikte raporla.
