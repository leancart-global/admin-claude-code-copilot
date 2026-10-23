# Playbook: Müşteri segmenti oluştur ("son 6 ayda 5000 TL üstü harcayanlar")

Tetikleyiciler: "segment oluştur", "şu müşterileri hedefle", "VIP müşteri listesi çıkar", "kampanya için kitle hazırla",
"Meta kitlesi için segment".
Harita: ../domain/screens/customers/segments.md (oluşturucu, detay, düzenle), ../domain/entities/segment.md (alanlar,
yaşam döngüsü, ilişkiler). Grup ile karışıyorsa: ../domain/entities/customer-group.md ("Segment ile farkı").
URL: `{ADMIN_URL}/customers/segments/new`.

---

## 0. Kural hatırlatması
- Kayıt (Segment Oluştur), **Yeniden Oluştur**, Etkinleştir/Devre Dışı, Arşivle, Sil → her biri ayrı onay.
  Yeniden Oluştur / Etkinleştir / Arşivle menüden **diyalogsuz, anında** kaydeder → onay tıklamadan önce.
- Önizleme kalıcı değildir; serbestçe kullan.
- Tür ve kurallar kayıttan sonra değişmez → özetteki kural cümlesini kullanıcıyla netleştir.
- Önizleme örneklerinde kişisel veri görünür; rapora yalnız sayı yaz.

## 1. İsteği kurala çevir
Kullanıcının cümlesini koşullara böl ve okunur cümleyle geri yaz:

| İstek parçası | Alan | Operatör | Değer |
|---|---|---|---|
| "5000 TL üstü harcayan" | Toplam Harcama | büyüktür | 5000 |
| "en az 3 sipariş" | Toplam Sipariş | büyük veya eşittir | 3 |
| "2025'ten beri müşteri" | Müşteri Olduğu Tarih | büyük veya eşittir | 2025-01-01 |
| "toptan etiketli" | Etiketler | içerir | toptan |
| "gmail kullananlar" | E-posta | ile biter | @gmail.com |

- Bağlaç: aynı gruptaki koşullar VE/VEYA; "şu **ya da** şu" için ikinci kural grubu + grup bağlacı VEYA.
- Göreli tarih ("son 6 ay") → bugünün tarihinden mutlak tarih hesapla (ör. bugün 2026-10-23 → 2026-04-23) ve özette
  belirt; segment bu tarihi sabit tutar.
- Tür: kurallı istekte **Dinamik** (varsayılan); kullanıcı "şu 20 müşteri" gibi elle liste verdiyse **Statik** —
  ancak statik segmente üye ekleme arayüzü bu sürümde yok → kullanıcıya bildir, kural (ör. etiket) ile dinamik segment
  öner (müşterilere etiket eklemek ayrı onaylı adım).
- İstek sistemin hesapladığı bir kavramsa (ör. "risk altındaki müşteriler") önce
  ../domain/screens/customers/customers-analytics.md ile salt okunur bak; kural alanı olarak "Yaşam Döngüsü Aşaması"
  var.
- Kural listede olmayan bir veriye dayanıyorsa (ör. "X ürününü alanlar", "İstanbul'dakiler") uydurma alan seçme;
  kullanıcıya hangi alanların mevcut olduğunu söyle ve sor.

## 2. Ön kontroller (salt okuma)
- `{ADMIN_URL}/customers/segments` listesinde aynı/benzer adlı segment var mı ara; varsa kullanıcıya göster.
- Ortamı yaz (config).

## 3. Plan + eksik bilgi
Plan: "1) Segmenti oluştur (Pasif, 0 üye) 2) Yeniden Oluştur ile üyeleri hesapla 3) (isteğe bağlı) kampanya/kitle".
Eksikleri tek mesajda sor: ad (yoksa öner), açıklama, otomatik yenileme isteniyor mu (sıklık).

## 4. Doldur (`/customers/segments/new`)
1. `browser_snapshot`. Segment Adi (`#name`), Açıklama (`#description`).
2. Tür kart-butonu (varsayılan Dinamik zaten seçili).
3. Etiketler (varsa): kutuya yaz → "Ekle".
4. Kural: "Grup 1" içinde "Koşul Ekle" → Alan Select'i (tetikleyici "Alan seçin" → seçenek) → Operatör Select →
   Değer (sayı `5000`, tarih `YYYY-AA-GG`; arasındadır'da iki kutu). Sonraki koşullarda önce bağlaç Select'i.
   Gerekirse "Kural Grubu Ekle" ve grup bağlacı.
5. Boş kural grubu bırakma (kayıt reddedilir).
6. Otomatik yenileme istenmişse Switch + sıklık.
7. **"Segmenti Önizle"** → "{n} Eşleşen müşteriler". Hata ("Segment önizlenemedi…") → kuralı kontrol et; çözülmezse dur,
   kullanıcıya bildir. Sayı beklenenden çok farklıysa kullanıcıya göster ve kuralı birlikte gözden geçir.

## 5. Özet → ONAY → Segment Oluştur
| Alan | Değer |
|---|---|
| Ortam | … |
| Ad / Açıklama | Yüksek Harcayanlar 2026 / … |
| Tür | Dinamik (varsayılan) |
| Kurallar | (Toplam Harcama > 5000) VE (Müşteri Olduğu Tarih ≥ 2026-04-23) |
| Önizleme | ~{n} müşteri |
| Otomatik yenileme | Kapalı / Günlük |
| Not | Kayıttan sonra segment Pasif ve 0 üyeli olur; ayrıca "Yeniden Oluştur" gerekir (ayrı onay). Tür ve kurallar sonradan değişmez |

Açık "evet" → sağ üstteki **"Segment Oluştur"**. Başarıda liste ekranına döner (toast yok).

## 6. Yeniden Oluştur (ayrı onay)
Özet: "‘{ad}’ segmentinin üyeleri şimdi hesaplanacak (~{n} müşteri), segment Aktif olacak." → evet → listede satırın ⋯ →
"Yeniden Oluştur" ya da detayda "Yeniden Oluştur". Toast "Segment yeniden oluşturma başlatıldı…".
- 422 "Segment contains a condition that cannot be evaluated" / Durum "Hata" → dur, kullanıcıya hangi koşul(lar)
  olduğunu bildir; yeni kurallarla yeni segment gerekir (eskisini arşivleme/silme ayrı onay).

## 7. Doğrula
- Detayda Durum "Aktif", "Toplam Müşteri" ≈ önizleme, "Son Oluşturma" şimdi.
- "Müşteriler" sekmesinden 1–2 üyeyi aç, kuralı sağladığını kontrol et (ör. Toplam Harcama).

## 8. Sonraki adımlar (ayrı istek/onay)
- E-posta kampanyası: [campaign-create.md](campaign-create.md) → hedefleme segment seçimi. Gönderim yalnız pazarlama izni
  olan ve e-postası doğrulanmış üyelere; alıcılar gönderim anında hesaplanır.
- Promosyonu segmente kısıtlama admin ekranından kurulamaz (yalnız API) → kullanıcıya bildir.
- Meta kitlesi: ../domain/screens/marketing/meta/audiences.md (dış sisteme — Meta — yazar, üyelerin kişisel verisini
  gönderir; ayrı onay).
- Üyelik zamanla eskir: kampanyadan hemen önce yeniden oluşturmayı öner.

## 9. Rapor
Segment linki (`{ADMIN_URL}/customers/segments/{id}`), kural cümlesi, üye sayısı, durum, kalan işler. Üye
e-postalarını rapora koyma.
