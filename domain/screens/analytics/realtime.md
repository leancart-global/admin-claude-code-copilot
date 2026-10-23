# Mağaza Aktivitesi (Realtime / Activity)
- URL: {ADMIN_URL}/analytics/realtime
- Menü yolu: "Analitik / Analytics" → sekme "Aktivite / Activity".
- Sayfa başlığı: "Mağaza Aktivitesi / Store Activity"; açıklama "Mağaza aktivitesi ve trafik özeti".
- Amaç: Bugünkü canlı durumu (çevrimiçi ziyaretçi, aktif sepet, bugünün geliri/siparişleri, bekleyen/işlenen
  siparişler), bugünün son siparişlerini ve cihaz/kanal bazında oturum–gelir–dönüşüm dağılımını görmek. **Salt okunur.**
- Entity: metrik tanımları [../../entities/report.md](../../entities/report.md).
- Yetki: `analytics:read`.
- Kişisel veri: "Son Siparişler" tablosunda müşteri adı.

## Ön koşullar ve bağımlılıklar
- Yok. Panel'deki "Mağaza aktivitesi" şeridiyle aynı veriyi daha ayrıntılı gösterir ([../dashboard/dashboard.md](../dashboard/dashboard.md)).

## Yerleşim
1. Başlık + "{time} itibarıyla" + sağda "Yenile / Refresh" (yenilenirken "Yenileniyor…").
2. 6 KPI kartı: Çevrimiçi Ziyaretçi, Aktif Sepet, Bugünün Geliri, Bugünün Siparişleri, Bekleyen, İşleniyor. Okunamayan
   değer "—"; aria-label "Kullanılamıyor: {neden}".
3. "Son Siparişler / Recent Orders" ("Mağazanıza verilen en son siparişler"): "Sipariş No", "Müşteri", "Tutar",
   "Durum", "Zaman" (göreli). Bugünün en çok 20 siparişi. Satırlar tıklanmaz. Boş: "Henüz sipariş yok".
4. "Cihaz Oturumları / Device Sessions": "Cihaz", "Oturum", "Gelir", "Dönüşüm". Boş: "Cihaz verisi bulunmuyor".
5. "Trafik Kanalları / Traffic Channels" ("Ziyaretçilerinizin nereden geldiği"): "Kanal", "Oturum", "Gelir",
   "Dönüşüm". Boş: "Kanal verisi bulunmuyor".

## Alanlar
Form alanı yok; dönem seçici yok.

## Kurallar
| Rakam | Kapsam |
|---|---|
| Çevrimiçi Ziyaretçi | Son ~1 dakikada vitrinde aktif ziyaretçi |
| Aktif Sepet | Şu an açık sepetler (kapsam doğrulanmadı) |
| Bugünün Geliri / Siparişleri | Bugün verilen siparişler; iptal ve tamamen iade edilenler hariç |
| Bekleyen / İşleniyor | Şu an o durumda olan sipariş sayısı |
| Cihaz / Kanal tabloları | **Son 30 gün** (sabit) |

- Sayfa kendiliğinden yenilenmez; güncel değer için "Yenile".

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Yenile | Canlı rakamlar ve cihaz/kanal tabloları yeniden okunur | hata: "Unable to load store activity data. Please try again." / "Unable to load device data. Please try again." |

## Onay zamanlaması
- Kalıcı aksiyon yok; onay gerekmez.

## Yan etkiler
- Yok.

## Tuzaklar
- "Son Siparişler" bugünle sınırlıdır; daha eski sipariş için [../orders/orders-list.md](../orders/orders-list.md).
- Cihaz/kanal tabloları canlı değil, son 30 günlüktür; kullanıcıya "bugün" diye aktarma.
- "Demo Veri" rozeti görünüyorsa rakamlar örnektir.

## Doğrulama
- Raporlarken "{time} itibarıyla" zamanını da ver.
