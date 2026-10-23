# Arama Dizini (Search Index)
- URL: {ADMIN_URL}/settings/search-index
- Menü yolu: Sol menü "Ayarlar / Settings" → "Arama Dizini / Search Index" (hub'da kartı yoktur).
- Sayfa başlığı: "Arama Dizini / Search Index"; açıklama "Müşterilerin arama sonuçlarının kataloğunuzla eşleşip eşleşmediğini kontrol edin, eşleşmiyorsa dizini yeniden oluşturun".
- Amaç: Vitrin aramasının katalogla senkron olup olmadığını göstermek (eksik/fazla ürün sayısı) ve gerekirse arama dizinini baştan oluşturmak. Ürün değişiklikleri normalde birkaç saniyede kendiliğinden aramaya yansır; yeniden oluşturma kurtarma işlemidir, rutin değildir.
- Yetki: ekran `settings:read`; durum okuma `search:read`; "Dizini yeniden oluştur" butonu yalnız `search:write` yetkisiyle görünür.

## Ön koşullar ve bağımlılıklar
- Ön koşul yok. Kataloğun kendisini değiştirmez; yalnız vitrinde aramada görünenleri değiştirir.
- Etkiledikleri: vitrin arama sonuçları, filtreler/listeler (arama tabanlı ise — doğrulanmadı).

## Yerleşim
Tek kart "Dizin durumu / Index status":
- Başlıkta durum rozeti (`data-testid="search-index-status-badge"`): "Arama kataloğunuzla eşleşiyor" (yeşil) | "{n} ürün aramada eksik" | "{n} fazla öğe aramada görünüyor ama orada olmamalı" (kırmızı). Yanında "{zaman} itibarıyla" tazelik etiketi (`data-testid="search-index-status-freshness"`); okunamazsa "Yenilenemedi — {zaman} itibarıyla olan sayılar gösteriliyor".
- Sağ üstte "Yenile / Refresh" ikon butonu (`data-testid="search-index-refresh-button"`) ve (yetki varsa) "Dizini yeniden oluştur / Rebuild index" (`data-testid="search-index-rebuild-button"`; çalışırken "Yeniden oluşturuluyor…").
- Sayılar: "Kataloğunuzda / In your catalogue" (`search-index-catalogue-count`), "Arama dizininde / In the search index" (`search-index-index-count`) + not "Toplamda {total} belge saklanıyor; eski taslaklar ve arşivlenmiş öğeler dahil — bu beklenen bir durumdur".
- "Son yeniden oluşturma / Last rebuild" kutusu (`search-index-last-rebuild`): göreli zaman + "{n} ürün dizine eklendi, {m} eski kayıt kaldırıldı"; hiç yapılmadıysa "Bu dizin hiç yeniden oluşturulmadı."; eski kayıt temizliği atlandıysa nedeni (kırmızı uyarı); başarısız ürün id'leri listesi (ilk 10 + "ve {n} tane daha").
- Alt bilgi: yeniden oluşturmanın rutin olmadığı notu.
- Durum alınamazsa: "Arama dizini durumu kontrol edilemedi. Sayfayı yenilemeyi deneyin." / "Arama durumu alınamadı".

## Alanlar
Form alanı yoktur.

## Aksiyonlar
| Buton | Ne olur | Onay/Toast |
|---|---|---|
| Yenile / Refresh | Durumu yeniden okur (salt okunur) | — |
| Dizini yeniden oluştur → onay "Arama dizini yeniden oluşturulsun mu?" → "Yeniden oluştur / Rebuild" | Tüm ürünleri katalogdan yeniden okur ve aramanın kullandığı veriyi değiştirir; artık var olmayan ürünlerin kayıtlarını kaldırabilir; bozuk arama ayarı varsa onarır | Başarı: "Arama dizini yeniden oluşturuldu: {n} ürün dizine eklendi, {m} eski kayıt kaldırıldı." ya da "…yeniden oluşturuldu ve onarıldı…". Kısmi: "{n} ürün dizine eklendi, ancak {k} ürün başarısız oldu…" / "{n} ürün dizine eklendi. {neden}" (uyarı). Hata: "Arama dizini yeniden oluşturulamadı. Birazdan tekrar deneyin." |

## Onay zamanlaması (kural 2/5)
- "Dizini yeniden oluştur" **dış etkili, geri alınamaz toplu işlemdir** (müşterilerin gördüğü arama sonuçlarını değiştirir, kayıt kaldırabilir). Yalnız kullanıcı açıkça isterse ya da durum rozeti senkron dışıysa ve kullanıcı onaylarsa çalıştır. Özet: ortam, katalogdaki ürün sayısı, dizindeki sayı, eksik/fazla farkı, "işlem sırasında arama sonuçları değişebilir".
- "Yenile" salt okunurdur, onay gerekmez.

## Yan etkiler
- İşlem süresince (katalog büyüklüğüne bağlı) buton "Yeniden oluşturuluyor…" kalır; vitrin araması bu sırada eksik sonuç döndürebilir (doğrulanmadı).
- Artık var olmayan ürünlerin arama kayıtları kaldırılır.

## Tuzaklar
- Tek bir ürünün aramada görünmemesi için yeniden oluşturma gerekmez; önce ürünün durumu/görünürlüğü ve birkaç saniyelik gecikme kontrol edilir.
- "Arama dizininde toplam belge" sayısının katalogdan büyük olması normaldir (taslak/arşiv); karşılaştırma rozet üzerinden yapılır.
- Buton görünmüyorsa kullanıcının `search:write` yetkisi yok.

## Doğrulama
1. Toast metnindeki eklenen/kaldırılan sayılar.
2. "Yenile" → rozet "Arama kataloğunuzla eşleşiyor"; "Son yeniden oluşturma" zamanı güncel.
3. Kısmi başarıda listelenen ürün id'lerini kullanıcıya bildir.
