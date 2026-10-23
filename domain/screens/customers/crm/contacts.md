# CRM Kişileri — liste, detay, düzenle (CRM Contacts)
- URL'ler:
  - Liste: {ADMIN_URL}/customers/crm/contacts
  - Detay: {ADMIN_URL}/customers/crm/contacts/{id}
  - Düzenle: {ADMIN_URL}/customers/crm/contacts/{id}/edit
- Menü yolu: Sol menü "Müşteriler / Customers" → "CRM Kişiler / CRM Contacts".
- Sayfa başlığı: "CRM Kişileri / CRM Contacts" (+ toplam sayı rozeti); açıklama "Potansiyel müşterileri ve kişileri yönetin / Manage leads, prospects, and customer contacts".
- Amaç: Satış takibi yapılan kişileri (potansiyel, aday, müşteri, partner, tedarikçi) tutmak; potansiyel durumu, satış aşaması, puan, etiket, not ve takip (follow-up) yönetmek.
- Entity: [../../../entities/crm-contact.md](../../../entities/crm-contact.md). İlgili: [deals.md](deals.md), [tasks.md](tasks.md), [interactions.md](interactions.md), müşteri kaydı [../customer-detail.md](../customer-detail.md).
- Yetki: sunucu `crm:contacts:read` (liste/detay), `crm:contacts:write` (oluştur, düzenle, not, takip, puan), `crm:contacts:delete` (sil). `admin` / `super_admin` rollerinde hepsi var; daha dar rollerde ekranın davranışı doğrulanmadı. Menü öğesi yetkiye göre gizlenmez.
- Plan: CRM, **Rise ve üstü** planlarda listelenen bir plan özelliğidir (`crm`). Launch planındaki mağazada ekranın davranışı doğrulanmadı — kullanıcıya planını sor.

## Kişi ile müşteri kaydı arasındaki ilişki
- CRM kişisi, mağazanın **müşteri kaydından ayrı** bir kayıttır; aynı şey değildir. Müşteri (vitrinde hesap açan / sipariş veren kişi) [../customer-detail.md](../customer-detail.md) ekranında yönetilir.
- Her CRM kişisi bir müşteri kaydına **bağlı** tutulur: API'de `customerId` zorunludur ve mağazada mevcut, silinmemiş bir müşteriyi göstermelidir (aksi 404 "Customer not found or has been deleted").
- Otomatik oluşturma yok: müşteri kaydı açılınca CRM kişisi kendiliğinden oluşmaz; CRM kişisinden müşteri kaydına "dönüştür" aksiyonu yok.
- "Kişi Türü = Müşteri / Customer" yalnız bir etikettir; müşteri kaydı oluşturmaz.
- Fırsatlar ([deals.md](deals.md)), görevler ([tasks.md](tasks.md)) ve etkileşimler ([interactions.md](interactions.md)) kişiye değil **müşteri ID'sine** bağlanır. Kişi detayındaki etkileşim istatistikleri kişinin bağlı olduğu müşteri ID'sinden okunur.
- Müşteri ID'si, müşteri detay sayfasının başlığında "Müşteri ID: …" olarak görünür ([../customer-detail.md](../customer-detail.md)).

## Ön koşullar ve bağımlılıklar
- Bağlanacak **müşteri kaydı** önceden var olmalı (yukarıya bak).
- E-posta, mağaza içindeki CRM kişileri arasında **benzersizdir** (küçük harfe çevrilerek karşılaştırılır; çakışma 409 "Contact with this email already exists" / düzenlemede "Email already in use").

## Yerleşim
### Liste
1. Kart başlığı + toplam rozeti; sağda "Kişi Ekle / Add Contact".
2. Filtre satırı: arama "Kişi ara... / Search contacts..." (ad, soyad, şirket, e-posta, telefon, etiket; **kelime bazında**, kısmi kelimeyle sonuç gelmeyebilir; 300 ms sonra ya da Enter ile uygulanır) + üç Select (dar ekranda gizli): "Tüm Türler / All Types", "Tüm Durumlar / All Statuses" (potansiyel durumu), "Tümü / All" (VIP: "Sadece VIP / VIP Only", "VIP Olmayan / Non-VIP").
3. Aktif filtre rozetleri ("Aktif filtreler / Active filters") + "Tümünü temizle / Clear all".
4. İstatistik kartları: "Toplam Kişi", "Sicak Firsatlar / Hot Leads", "Ilik Firsatlar / Warm Leads", "Soguk Firsatlar / Cold Leads", "Bekleyen Takipler / Pending Follow-ups".
5. Tablo: "Kişi / Contact" (baş harf avatarı, ad soyad, VIP yıldızı, e-posta, telefon), "Şirket / Company", "Tur / Type" (renkli rozet), "Potansiyel Durumu / Lead Status" (ikon + metin), "Puan / Score" (potansiyel puanı), "Etiketler / Tags" (ilk 3 + "+N"), "İşlemler / Actions" (⋯, aria-label "İşlemler").
6. Satır menüsü: "Detayları Gör / View Details", "Düzenle / Edit", "Sil / Delete".
7. Sayfalama: sayfa başına 10; "Önceki / Previous", "Sonraki / Next".
8. Boş durum: "Kişi bulunamadı / No contacts found" + "Başlamak için ilk kişinizi oluşturun".

### Detay
- Başlık: "Ad Soyad"; altında e-posta · telefon · şirket; geri bağlantısı "Kişilere Dön / Back to Contacts". VIP yıldızı + tür rozeti.
- Sağ üst: "Takip Planla / Schedule Follow-up" butonu + ⋯ menü ("İşlemler": "Kişiyi Düzenle / Edit Contact", "Kişiyi Sil / Delete Contact").
- Sekmeler: "Genel Bakış / Overview", "Zaman Tüneli / Timeline", "Notlar / Notes", "Takipler / Follow-ups".
  - Genel Bakış kartları: "Potansiyel Bilgileri / Lead Information" (Potansiyel Durumu, Satış Aşaması, Durum, Atanan Kişi), "Puanlar / Scores" (Potansiyel Puanı, Etkileşim, Sağlık, Sadakat, Memnuniyet; başlıkta kalem ikonlu düzenle butonu), "Profesyonel / Professional" (Unvan, Departman, Sektör, Karar Verici), "Sosyal Bağlantılar", "Etiketler", "Kaynak / Source" (Kaynak, Oluşturulma, Son Güncelleme).
  - Zaman Tüneli: istatistik kutuları ("Toplam Etkileşim", "Aktif Gün", "Dönem (Gün)", "Günlük Ortalama") + "Etkinlik Zaman Tüneli" listesi, "Daha Fazla Yükle ({loaded} / {total})". Boşsa "Henüz etkinlik yok".
  - Notlar: "Not Ekle / Add Note" butonu; her notta kategori rozeti, tarih, kalem (düzenle) ve çöp kutusu (sil) ikon butonları (metinsiz).
  - Takipler: "Takip Planla" butonu; açık takiplerde onay işareti (✓) ikon butonu ile tamamlama. Boşsa "Planlanmış takip yok".

### Düzenle
- Başlık "Kişiyi Düzenle / Edit Contact", geri "Kişiye Dön / Back to Contact". Kartlar: "Kişisel Bilgiler", "Şirket ve Profesyonel", "Sınıflandırma", "İşaretler", "Sosyal Bağlantılar", "Etiketler". Altta "İptal / Cancel", "Değişiklikleri Kaydet / Save Changes".

## Alanlar
### "Kişi Oluştur / Create Contact" diyaloğu (liste → "Kişi Ekle")
| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Ad / First Name * | Input | evet | ≤100 | `#firstName` | |
| Soyad / Last Name * | Input | evet | ≤100 | `#lastName` | |
| E-posta / Email * | email Input | evet | geçerli e-posta; mağaza içinde benzersiz | `#email` | Küçük harfe çevrilerek saklanır |
| Telefon / Phone | Input | hayır | ≤20 | `#phone` | |
| Şirket / Company | Input | hayır | ≤200 | `#company` | |
| Kişi Türü / Contact Type | Select | — | "Potansiyel / Lead" | label "Kişi Türü" | Seçenekler: Potansiyel `lead`, Aday `prospect`, Müşteri `customer`, Partner `partner`, Tedarikci `vendor` ("Pasif" burada yok, düzenlemede var) |
- Diyalogda **müşteri kaydı seçme alanı yoktur** (bkz. "Kişi ile müşteri kaydı"). Diyalogdan oluşturmanın sonucu canlıda doğrulanmadı; hata toast'ı çıkarsa dur ve kullanıcıya bildir.
- Sunucu varsayılanları: Potansiyel Durumu "Soguk / Cold", Satış Aşaması "Yeni / New", Durum "Aktif", tüm puanlar 0.
- Eksik zorunlu alanda ve sunucu hatasında aynı toast: "Kişi oluşturulamadı. Lütfen tekrar deneyin."
- Butonlar: "İptal / Cancel", "Kişi Oluştur / Create Contact" (gönderirken "Oluşturuluyor...").

### Düzenle ekranı
| Bölüm | Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|---|
| Kişisel Bilgiler | Hitap / Salutation | Select | — | "Yok / None", Mr., Mrs., Ms., Dr., Prof. | `#salutation` | |
| | Cinsiyet / Gender | Select | — | "Belirtilmemiş", Erkek, Kadın, Diğer, Belirtmek istemiyorum | `#gender` | |
| | Ad * / First Name * | Input | evet | boşsa toast "Devam etmek için lütfen bir ad girin." | `#firstName` | |
| | Soyad * / Last Name * | Input | evet | boşsa toast "…bir soyad girin." | `#lastName` | |
| | İkinci Ad / Middle Name | Input | hayır | ≤100 | `#middleName` | |
| | Görünen Ad / Display Name | Input | hayır | ≤150 | `#displayName` | |
| | E-posta * / Email * | email Input | evet | boşsa toast "…bir e-posta adresi girin."; benzersiz (409) | `#email` | |
| | Telefon / Phone | tel Input | hayır | ≤20 | `#phone` | |
| | Alternatif Telefon / Alternate Phone | tel Input | hayır | ≤20 | `#alternatePhone` | |
| | Doğum Tarihi / Date of Birth | date Input | hayır | `YYYY-MM-DD` | `#dateOfBirth` | |
| Şirket ve Profesyonel | Şirket / Company | Input | hayır | ≤200 | `#company` | |
| | Şirket Web Sitesi / Company Website | url Input | hayır | ≤255 | `#companyWebsite` | |
| | Ünvan / Job Title | Input | hayır | ≤100 | `#jobTitle` | |
| | Departman / Department | Input | hayır | ≤100 | `#department` | |
| | Sektör / Industry | Input | hayır | ≤100 | `#industry` | |
| | Şirket Büyüklüğü / Company Size | Select | — | Belirtilmemiş, Girişim, Küçük, Orta, Büyük, Kurumsal | `#companySize` | |
| | Karar verici / Decision maker | Checkbox | — | kapalı | `#decisionMaker` | |
| Sınıflandırma | Kişi Türü / Contact Type | Select | — | 6 seçenek (+ "Pasif / Inactive") | label "Kişi Türü" | |
| | Durum / Status | Select | — | Aktif, Pasif, İletişime Geçilmesin, Geri Döndü, Abonelikten Çıktı | label "Durum" | |
| | Potansiyel Durumu / Lead Status | Select | — | Yok, Soguk, Ilik, Sicak, Kazanildi, Kaybedildi, Geliştiriliyor | label "Potansiyel Durumu" | Liste istatistikleri ve "Sıcak" filtre bunu kullanır |
| | Satış Aşaması / Sales Stage | Select | — | Yok, Yeni, İletişime Geçildi, Nitelendi, Teklif, Müzakere, Kapandı | label "Satış Aşaması" | Fırsat (deal) aşamasından bağımsızdır |
| | Kaynak / Source | Input | hayır | ≤100; "örn. Web Sitesi, Referans, Etkinlik" | `#source` | |
| | Atanan Kişi / Assigned To | Input (serbest metin) | hayır | ≤100 | `#assignedTo` | Kullanıcı seçici değil; ad veya kullanıcı ID'si yazılır |
| | Atanan Ekip / Assigned Team | Input | hayır | ≤100 | `#assignedTeam` | |
| İşaretler | VIP Kişi / VIP Contact | Checkbox | — | kapalı | `#isVip` | Listede yıldız; VIP filtresi |
| | Fenomen / Influencer | Checkbox | — | kapalı | `#isInfluencer` | |
| | Ortak / Partner | Checkbox | — | kapalı | `#isPartner` | |
| | İletişime Geçilmesin / Do Not Contact | Checkbox | — | kapalı | `#doNotContact` | Açılınca "Sebep / Reason" alanı çıkar (`#doNotContactReason`, ≤255) |
| Sosyal Bağlantılar | LinkedIn, Twitter / X, Facebook, Instagram | Input | hayır | LinkedIn/Facebook ≤255, Twitter/Instagram ≤100 | `#linkedin`, `#twitter`, `#facebook`, `#instagram` | |
| Etiketler | (placeholder "Etiket yazıp Enter'a basın") | etiket girişi | hayır | en çok 50; aynı etiket ikinci kez eklenmez | placeholder | Etiketi yaz → **virgül (`,`)** ile ekle (Enter de ekler ama form gönderimi değildir). Kaldırma: rozetteki ✕ (sr-only "{tag} etiketini kaldır"); boş kutuda Backspace son etiketi siler |

### Detay diyalogları
| Diyalog | Alanlar | Buton | Not |
|---|---|---|---|
| "Not Ekle / Add Note" | "Kategori" Select (Genel, Arama, Toplanti, E-posta, Destek, Satış) + "Not * / Note *" Textarea (boşsa "Lütfen not içeriğini girin") | "Not Ekle" | Kişi başına en çok 100 not tutulur; daha eskiler düşer |
| Not satır içi düzenleme (kalem ikonu) | Kategori Select + İçerik Textarea | "Kaydet / Save", "İptal / Cancel" | |
| "Notu Sil / Delete Note" | — | "Sil / Delete" | "Bu işlem geri alınamaz." |
| "Takip Planla / Schedule Follow-up" | "Tür" Select (Arama / E-posta / Toplantı), "Son Tarih * / Due Date *" (`datetime-local`), "Notlar" | "Planla / Schedule" | Kişi başına **tek açık takip** vardır; yeni takip öncekinin yerine geçer. Seçilen türün kayda yansıması doğrulanmadı |
| "Puanları Düzenle / Edit Scores" | "Potansiyel Puanı" `#score-leadScore`, "Etkileşim" `#score-engagementScore`, "Sağlık" `#score-healthScore` (sayı, 0–100) | "Puanları Kaydet / Save Scores" | Sadakat ve Memnuniyet bu diyalogda düzenlenmez |
| "Kişiyi Sil / Delete Contact" | — | "Sil / Delete" | "{name} kişisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz." |

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Kişi Ekle → diyalog → Kişi Oluştur | Kişi oluşur (müşteri kaydına bağlı) | "Kişi başarıyla oluşturuldu"; hata "Kişi oluşturulamadı. Lütfen tekrar deneyin." |
| Düzenle → Değişiklikleri Kaydet | Tüm form alanları güncellenir; detay sayfasına döner | "Kişi başarıyla kaydedildi."; hata "Değişiklikler kaydedilemedi…" |
| Not Ekle / not düzenle-Kaydet | Not eklenir / güncellenir | "Not başarıyla eklendi" / "Not başarıyla güncellendi" |
| Not çöp kutusu → Sil | Not kalıcı silinir | "Not başarıyla silindi" |
| Takip Planla → Planla | Kişinin sıradaki takip tarihi/notu yazılır | "Takip başarıyla planlandi" |
| Takipler sekmesi ✓ | **Diyalogsuz, anında** takip tamamlanır; "son iletişim" tarihi şimdi olur | "Takip tamamlandı" |
| Puanlar kalemi → Puanları Kaydet | Üç puan güncellenir | "Puanlar başarıyla güncellendi" |
| Sil (liste menüsü veya detay ⋯) → Sil | Kişi **kalıcı** silinir; detaydan silinirse listeye döner | "Kişi başarıyla silindi"; hata "Kişi silinemedi…" |

## Onay zamanlaması (kural 2/5/6)
- **Anında kayıt:** Takipler sekmesindeki ✓ (tamamla) butonu diyalog açmaz — onayı tıklamadan **önce** al.
- Not ekle/düzenle, takip planla, puan kaydet: her biri ayrı kalıcı değişikliktir → kısa özet + onay.
- **Silme (kişi veya not):** geri alınamaz; ayrı onay. Kişi silinince notları, zaman tüneli ve takip bilgisi de gider. Fırsat, görev ve etkileşim kayıtları müşteri ID'sine bağlı olduğu için silinmez (doğrulanmadı) — özette yaz.
- Hiçbir aksiyon kişiye **e-posta/SMS göndermez**; takip ve not yalnız kayıttır. Dış sisteme yazım yok.
- Kişisel veri: ad, e-posta, telefon, doğum tarihi, sosyal profil içerir. Bu ekranlarda dışa aktarma yok. Müşteri tarafındaki GDPR silme/anonimleştirme işleminin CRM kişisine etkisi doğrulanmadı — GDPR talebinde CRM kişisini de kullanıcıyla ayrıca konuş.

## Yan etkiler
- Kayıt oluşturma, düzenleme, not ekleme, takip planlama/tamamlama kişinin zaman tüneline olay olarak düşer.
- Liste istatistik kartları potansiyel durumuna göre sayar (Sıcak / Ilık / Soğuk).

## Tuzaklar
- Kişi ≠ müşteri. "Müşteriyi CRM'e ekle" isteğinde önce müşteri kaydının varlığını ve müşteri ID'sini doğrula.
- E-posta benzersiz; aynı e-postayla ikinci kişi açılmaz (409). Önce listede e-postayla ara.
- "Potansiyel Durumu" (sıcak/ılık/soğuk…) ile "Satış Aşaması" (yeni/teklif…) ve fırsat aşaması ([deals.md](deals.md)) üç ayrı alandır; karıştırma.
- Atanan Kişi serbest metindir; yazım tutarlılığı kullanıcıya ait.
- Not ve takip ikon butonlarının metni yoktur — snapshot'ta konumdan (not kartının sağ üstü) bul.
- Satır menüsü: ⋯ (aria-label "İşlemler / Actions") → menü öğesine tıkla.

## Doğrulama
1. Toast.
2. Listede e-posta ile ara → satır: ad, şirket, tür rozeti, potansiyel durumu, puan, etiketler.
3. Detayda Genel Bakış kartları ve Notlar/Takipler sekmesi; zaman tünelinde yeni olay.
