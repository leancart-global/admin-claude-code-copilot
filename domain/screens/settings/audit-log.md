# Denetim Günlüğü (Audit Log)
- URL: {ADMIN_URL}/settings/audit-log
- Menü yolu: Sol menü "Ayarlar / Settings" → "Denetim Günlüğü / Audit Log"; ya da `/settings` hub → "Sistem / System" → "Denetim Kaydı / Audit Log" (kart açıklaması "Kimin ne zaman neyi değiştirdiğini izle").
- Sayfa başlığı: "Denetim Günlüğü / Audit Log"; açıklama "Güvenlik olaylarını ve kullanıcı etkinliğini görüntüleyin".
- Amaç: Admin kullanıcılarının işlemlerini ve güvenlik olaylarını (giriş, başarısız giriş, şifre/2FA değişikliği, oluştur/güncelle/sil, dışa/içe aktarma, API anahtarı…) zaman, kullanıcı, kaynak ve önem derecesiyle **salt okunur** listelemek; gerekirse dışa aktarmak. "Bu ürünü kim değiştirdi?" sorusunun cevabı buradadır.
- Yetki: `settings:read` yoksa "erişim yok" ekranı (gerekli yetki `settings:read`); kayıtların okunması ayrıca `audit_log:read`, dışa aktarma `audit_log:export` ister. Plan özelliği "Denetim Günlüğü / Audit Log" (Kurumsal grup) ile ilişkili (doğrulanmadı).
- Saklama: "Denetim günlükleri 90 gün boyunca saklanır." 90 günden eski olay bulunamaz.

## Kişisel veri
Kayıtlar kişisel veri içerir: kullanıcı adı/e-posta, **IP adresi**, **kullanıcı aracısı (tarayıcı bilgisi)**, değişiklik öncesi/sonrası değerler. Claude:
- Yalnız kullanıcının sorusunu cevaplamak için gereken alanları sohbete aktarır (ör. "X kullanıcısı, tarih, eylem"); IP ve kullanıcı aracısını kullanıcı açıkça istemedikçe aktarmaz.
- Eski/yeni değer alanlarında gizli değer (anahtar, token) görürse aktarmaz.
- Dışa aktarmayı yalnız kullanıcı isterse yapar (aşağıda).

## Ön koşullar ve bağımlılıklar
- Ön koşul yok; bu ekran hiçbir kaydı değiştirmez.

## Yerleşim
1. Başlık satırı; sağda "Yenile / Refresh" ve "Dışa Aktar / Export" açılır menüsü ("CSV olarak dışa aktar / Export as CSV", "JSON olarak dışa aktar / Export as JSON").
2. Bilgi kutusu: saklama süresi notu.
3. Kart "Filtreler / Filters": "Filtreleri Göster/Gizle", "Temizle / Clear". Alanlar: "Ara / Search" (placeholder "Günlüklerde ara..."), "Eylem / Action" Select ("Tüm eylemler"), "Kaynak / Resource" Select ("Tüm kaynaklar"), "Önem Derecesi / Severity" Select ("Tüm önem dereceleri"), "Başlangıç Tarihi / Start Date" ve "Bitiş Tarihi / End Date" (`input[type=date]`).
4. Kart "Etkinlik Günlüğü / Activity Log" + "{total} olay": tablo "Zaman Damgası / Timestamp", "Olay / Event", "Kullanıcı / User", "Kaynak / Resource" (+ kısa id `#abc123`), "Önem Derecesi / Severity" ("Bilgi"/"Uyarı"/"Kritik" rozeti), "IP Adresi / IP Address", "Eylemler / Actions" (göz ikonu → detay). Sayfa başına 20, "Önceki/Sonraki".
5. Boş: "Denetim olayı bulunamadı".
6. Detay diyaloğu "Olay Detayları / Event Details": zaman, önem, eylem, kaynak + "ID:", kullanıcı, IP, "Kullanıcı Aracısı / User Agent", "Detaylar / Details", "Meta Veri / Metadata" ("Eski Değer:", "Yeni Değer:", "Sebep:").

## Alanlar (filtreler)
| Label (tr / en) | Kontrol | Değerler | Not |
|---|---|---|---|
| Ara / Search | Input | serbest metin | Yazınca 1. sayfaya döner |
| Eylem / Action | Select | Login, Logout, Login Failed, Password Change, Password Reset, 2FA Enabled/Disabled, Create, Update, Delete, View, Export, Import, Approve, Reject, API Key Created… | |
| Kaynak / Resource | Select | User, Role, Permission, API Key, Session, Tenant, Product, Order, Customer, Payment, Settings… | |
| Önem Derecesi / Severity | Select | info / warning / critical | |
| Başlangıç / Bitiş Tarihi | date input | | `fill('2026-10-01')` |

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Yenile | Listeyi yeniden okur | — |
| Göz ikonu | Detay diyaloğu | — |
| Dışa Aktar → CSV / JSON (`audit_log:export`) | Eylem, kaynak ve tarih filtreleriyle dosya indirilir; dışa aktarma kapsamını eylem/kaynak/tarih filtreleriyle daralt | "Denetim günlüğü başarıyla dışa aktarıldı" / "…dışa aktarılamadı…" |

## Onay zamanlaması (kural 2)
- Ekran salt okunurdur; filtreleme ve detay görüntüleme onaysız.
- **Dışa aktarma** kişisel veri içeren dosya üretir → yalnız kullanıcı isterse; özet (format, filtreler, tahmini olay sayısı) + onay. Dosya kullanıcının bilgisayarına iner; Claude dosya içeriğini okuyup sohbete aktarmaz.

## Tuzaklar
- Tablo yalnız son 90 günü kapsar.
- "Kaynak" sütunundaki id kısaltılmıştır; tam id detay diyaloğunda.
- Kullanıcı adı yoksa "Bilinmeyen / Unknown" görünür (sistem/silinmiş kullanıcı).

## Doğrulama
- Salt okunur ekran; başka bir ekranda yapılan değişikliğin kaydını görmek için: Kaynak + Eylem filtresi → satır → detay diyaloğu.
