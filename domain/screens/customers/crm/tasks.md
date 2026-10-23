# CRM Görevleri — liste ve detay (CRM Tasks)
- URL'ler:
  - Liste: {ADMIN_URL}/customers/crm/tasks
  - Detay (görüntüle + satır içi düzenle): {ADMIN_URL}/customers/crm/tasks/{id}
- Menü yolu: Sol menü "Müşteriler / Customers" → "CRM Görevler / CRM Tasks".
- Sayfa başlığı: "CRM Görevleri / CRM Tasks"; açıklama "Satış ve müşteri görevlerinizi yönetin ve takip edin".
- Amaç: Satış ekibi için yapılacak işler (arama, e-posta, toplantı, takip, demo, teklif…) — atanan kişi, son tarih, öncelik, hatırlatıcı ve yorumlarla.
- Entity: [../../../entities/crm-task.md](../../../entities/crm-task.md). İlgili: [deals.md](deals.md), [contacts.md](contacts.md), müşteri [../customer-detail.md](../customer-detail.md).
- Yetki: sunucu `crm:tasks:read`, `crm:tasks:write` (oluştur, düzenle, tamamla, ertele, iptal, yeniden aç, sil, hatırlatıcı, yorum). `admin` / `super_admin` rollerinde var.
- Plan: CRM, Rise ve üstü planlarda listelenen plan özelliğidir (`crm`).

## Ön koşullar ve bağımlılıklar
- Ön koşul yok. İsteğe bağlı bağlantılar: Müşteri ID (müşteri detay başlığındaki "Müşteri ID"), Anlaşma ID (fırsat detay URL'sindeki `{id}`).
- Atanan kişi serbest metindir (kullanıcı seçici yok). **"Görevlerim / My Tasks"** sekmesi, Atanan Kişi değeri giriş yapan admin kullanıcısının kimliğiyle **birebir** eşleşen görevleri gösterir; ad yazılırsa o sekmede görünmez (doğrulanmadı: kullanıcı kimliğinin ekranda nereden okunacağı).

## Yerleşim
### Liste
1. Kart başlığı; sağda "Görev Ekle / Add Task".
2. Filtreler: arama "Görev ara..." (başlık, açıklama, etiket; kelime bazında), "Tüm Durum" Select (Bekliyor, Devam Ediyor, Tamamlandı, Ertelendi, İptal Edildi), "Tüm Öncelik" (Düşük, Orta, Yüksek, Acil), "Tüm Türler" (Arama, E-posta, Toplantı, Takip, Demo, Teklif).
3. İstatistik kartları: Toplam, Bekliyor, Devam Ediyor, Bugün Biten, Gecikmiş, Tamamlanan, Tamamlanma (%).
4. Sekmeler: "Tüm Görevler / All Tasks", "Görevlerim / My Tasks", "Bugun Biten / Due Today" (adet rozeti), "Gecikmiş / Overdue" (kırmızı rozet).
5. Tablo: (tamamla onay kutusu), "Görev / Task" (başlık + açıklama), "Tur / Type", "Öncelik / Priority", "Durum / Status", "Son Tarih / Due Date", "Atanan Kişi / Assigned To", ⋯. Sayfa başına 15. Tamamlanan satır soluk ve üstü çizili.
6. Satır menüsü ("İşlemler"): açık görevde (tamamlanmamış/iptal edilmemiş) "Tamamla", "Ertele", "İptal Et"; tamamlanmış/iptal/ertelenmiş görevde "Yeniden Ac"; her zaman "Sil". Listede detay sayfasına giden bağlantı/menü öğesi yoktur; detay URL ile açılır (görev ID'si gerekirse liste sayfasının ağ yanıtı salt okunur okunabilir).

### Detay
- Başlık: görev adı; altında "Vade: {tarih} · {atanan} · {müşteri}"; geri "Görevlere Dön".
- Rozetler: tür, öncelik, durum, "Süresi Geçmiş / Overdue" veya "Bugün Bitiyor / Due Today".
- Sağ üst: Bekliyor/Devam Ediyor durumunda "Tamamla", "Ertele", "İptal Et"; Tamamlandı/İptal/Ertelendi durumunda "Yeniden Ac"; ⋯ ("Görevi Düzenle / Edit Task", "Görevi Sil / Delete Task").
- Sekmeler: "Detaylar / Details", "Hatırlatıcılar / Reminders" (adet), "Yorumlar / Comments" (adet).
  - Detaylar kartları: "Görev Bilgileri" (Tür, Öncelik, Durum, Vade, Başlangıç, Tamamlanma, Tahmini/Harcanan Süre, Oluşturulma), "Atama" (Atanan Kişi, Ekip, İzleyenler), "İlgili Kayıtlar" (Müşteri → müşteri detayı, Anlaşma → fırsat detayı, Kişi → CRM kişisi, Üst Görev — tıklanabilir), "Etiketler", "Tekrarlama", "Bağımlılıklar", "Açıklama".
  - Hatırlatıcılar: liste (tarih, yöntem, "Gönderildi" / "Zamanı geçti" rozeti, çöp kutusu ikonu) + "Hatırlatıcı Ekle". Boşsa "Hatırlatıcı ayarlanmamış".
  - Yorumlar: liste + metin kutusu ("Bir yorum yazın...") + gönder (uçak ikonu) butonu; ipucu "Göndermek için Ctrl+Enter'a basın".

## Alanlar
### "Görev Oluştur / Create Task" diyaloğu
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Başlık * / Title * | Input | evet | 1–255 | `#title` | placeholder "örneğin, Müşteriyle takip görüşmesi" |
| Açıklama / Description | Textarea | hayır | ≤5000 | `#description` | |
| Tur / Type | Select | evet | "Takip / Follow Up" | label "Tur" | Arama, E-posta, Toplanti, Takip, Demo, Teklif, Sozlesme, Entegrasyon (onboarding), Kontrol (check-in), Arastirma, Yönetim, Diğer |
| Öncelik / Priority | Select | — | "Orta / Medium" | label "Öncelik" | Düşük, Orta, Yüksek, Acil |
| Son Tarih * / Due Date * | `datetime-local` | evet | — | `#dueDate` | Tarayıcı saat diliminde girilir |
| Atanan Kişi * / Assigned To * | Input | evet | — | `#assignedTo` | "Görevlerim" için kullanıcı kimliği (yukarı bak) |
| Müşteri ID / Customer ID | Input | hayır | — | `#customerId` | "Istege bağlı" |
| Anlasma ID / Deal ID | Input | hayır | — | `#dealId` | Fırsat detay URL'sindeki ID |
- Zorunlu alan eksikse toast "Lütfen tüm zorunlu alanları doldurun".
- Hatırlatıcı, etiket, tekrar, izleyici oluştururken girilmez (hatırlatıcı detayda eklenir; diğerleri ekranda düzenlenmez).

### Detay — "Görevi Düzenle" (satır içi)
⋯ → "Görevi Düzenle" ile başlık üstte input'a dönüşür; "Görev Bilgileri" kartında Tür, Öncelik, Vade Tarihi (`datetime-local`), Atanan Kişi düzenlenir; açıklama alanı ("Bir açıklama ekleyin..."). Sağ üstte "İptal" / "Kaydet / Save". Başlık boşsa "Devam etmek için lütfen bir görev başlığı girin."

### Diyaloglar
| Diyalog | Alanlar | Buton | Not |
|---|---|---|---|
| "Görevi Tamamla / Complete Task" | "Tamamlama Notları (isteğe bağlı)" (liste) / "Sonuç (isteğe bağlı)" (detay) | "Görevi Tamamla" | Liste onay kutusuna tıklamak da bu diyaloğu açar |
| "Görevi Ertele / Defer Task" | "Yeni Son Tarih" / "Yeni Vade Tarihi *" (`datetime-local`), "Neden (isteğe bağlı)" (≤500) | "Görevi Ertele" | Durum "Ertelendi" olur, vade yeni tarihe taşınır |
| "Görevi İptal Et / Cancel Task" (yalnız detay) | "Neden (isteğe bağlı)" | "Görevi İptal Et" ("Geri Dön" ile vazgeç) | "Daha sonra yeniden açabilirsiniz." |
| "Görevi Sil / Delete Task" | — | "Sil" | Detay metni: "…bağlı tüm hatırlatıcılar ile yorumlar kalıcı olarak silinecektir." |
| "Hatırlatıcı Ekle / Add Reminder" | "Tarih ve Saat *" (`datetime-local`, **gelecekte** olmalı), "Bildirim Yöntemi" (E-posta, SMS, Push Bildirimi, Uygulama İçi, Tüm Kanallar) | "Hatırlatıcı Ekle" | Tamamlanmış veya iptal edilmiş göreve hatırlatıcı eklenemez |

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Görev Ekle → Görev Oluştur | Görev "Bekliyor" durumunda oluşur | "Görev başarıyla oluşturuldu"; hata "Görev oluşturulamadı…" |
| Tamamla (menü/onay kutusu/detay) → diyalog | Durum "Tamamlandı", tamamlanma zamanı yazılır; not olarak sonuç | "Görev tamamlandı" / "Görev tamamlandı olarak işaretlendi." |
| Ertele → diyalog | Durum "Ertelendi", yeni vade | "Görev ertelendi" / "Görev yeni tarihe ertelendi." |
| **İptal Et (liste menüsü)** | **Diyalogsuz, anında** durum "İptal Edildi" | "Görev iptal edildi" |
| İptal Et (detay) → diyalog | Aynı; neden yazılabilir | "Görev iptal edildi." |
| **Yeniden Ac (liste ve detay)** | **Diyalogsuz, anında** durum "Bekliyor" | "Görev yeniden açıldı" |
| Görevi Düzenle → Kaydet | Başlık, açıklama, tür, öncelik, vade, atanan güncellenir | "Görev güncellendi." |
| Hatırlatıcı Ekle → diyalog | Hatırlatıcı eklenir | "Hatırlatıcı eklendi." |
| Hatırlatıcı çöp kutusu | **Diyalogsuz, anında** kaldırılır | "Hatırlatıcı kaldırıldı." |
| Yorum gönder (buton veya Ctrl+Enter) | Yorum eklenir (yazar "Admin" görünür) | "Yorum eklendi."; boşsa "Devam etmek için lütfen bir yorum girin." |
| Sil → diyalog | Görev, hatırlatıcıları ve yorumları **kalıcı** silinir | "Görev başarıyla silindi" / "Görev silindi." |

## Onay zamanlaması (kural 2/5/6)
- **Anında kayıt (diyalogsuz) — onayı tıklamadan önce al:** liste menüsünden "İptal Et", "Yeniden Ac" (liste ve detay), hatırlatıcı çöp kutusu, yorum gönder (Ctrl+Enter dahil — Enter kısayolunu kullanma, butona tıkla).
- Tamamla / Ertele / İptal (detay): diyalog açılır; özet + onay diyalogdan önce.
- Silme: geri alınamaz; hatırlatıcı ve yorum sayısıyla ayrı onay.
- **Hatırlatıcı bildirimi:** Seçilen yöntemle (e-posta/SMS/push/uygulama içi) atanan kişiye bildirim gitmesi amaçlanır; teslimat canlıda doğrulanmadı. Bildirim alıcısı müşteri değil ekip üyesidir. Kullanıcıya "hatırlatıcı kaydedildi; bildirim teslimi doğrulanmadı" diye raporla.
- Görev ve yorumlar müşteriye hiçbir şey göndermez.

## Yan etkiler
- Tamamla/iptal/ertele/yeniden aç işlemleri göreve otomatik yorum/not olarak düşer.
- Vade geçmiş ve tamamlanmamış/iptal edilmemiş görev "Gecikmiş" sekmesine ve sayacına girer.

## Tuzaklar
- "Görevlerim" yalnız atanan kişi kimliği eşleşen görevleri gösterir; serbest metin adla atanmış görevler orada görünmez.
- Vade ve hatırlatıcı saatleri `datetime-local` — `2026-11-01T09:00` biçiminde doldur.
- Hatırlatıcı tarihi geçmişte olamaz (hata toast'ı).
- "Devam Ediyor" durumu ekrandan seçilemez; görev Bekliyor → Tamamlandı/Ertelendi/İptal akışında ilerler.
- Ertelendi durumundaki görevi kapatmak için liste menüsündeki "Tamamla" / "İptal Et" kullanılabilir.
- Hatırlatıcı ve yorum ikon butonlarının metni yoktur; snapshot'ta konumla bul.

## Doğrulama
1. Toast.
2. Listede başlıkla ara → satır: tür, öncelik, durum rozeti, son tarih, atanan.
3. Detayda Görev Bilgileri ve İlgili Kayıtlar; Hatırlatıcılar/Yorumlar sekme sayıları.
