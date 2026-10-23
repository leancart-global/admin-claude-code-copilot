# Roller (Roles)

> **Operatör sınırı — hassas ekran**
> - Rol ve izin değişikliği, o rolü taşıyan **tüm** yönetici kullanıcıların yetkisini değiştirir. Claude bu ekranda
>   yalnız kullanıcı açıkça isterse ve rolü adıyla teyit ederek çalışır ([../../project/permissions.md](../../project/permissions.md) §4).
> - Rol oluşturma / düzenleme / silme yalnız `super_admin` rolüyle kaydedilir; `admin` ve `security_admin` ekranı görür
>   ama kaydetme 403 ile reddedilir → kullanıcıya bildir, tekrar deneme.

- URL: {ADMIN_URL}/system-users/roles
- Menü yolu: Sol menü "Kullanıcılar / Users" → "Roller / Roles".
- Sayfa başlığı: "Roller / Roles" + toplam rol sayısı rozeti; açıklama "Farklı ekip üyelerinin neler yapabileceğini kontrol
  etmek için roller oluşturun. / Create roles to control what different team members can do."
- Amaç: Rol tanımlarını görmek; özel rol oluşturmak; bir rolün izin setini (yetki matrisi) düzenlemek; özel rol silmek.
  Kişiye rol atama burada değil, davet sırasında yapılır: [system-users.md](system-users.md).
- Entity: Rol (Role) — ayrı entity dosyası yok; alanlar bu dosyada.
- Yetki: ekran yalnız `admin`, `super_admin`, `security_admin` rollerine açık; diğerlerinde "Erişim Reddedildi / Access
  Denied" kartı (gerekli: "Yöneticiler ve güvenlik yöneticileri / Administrators and security administrators").
  Rol oluştur / düzenle / sil: yalnız `super_admin`.

## Ön koşullar ve bağımlılıklar
- İzin listesi (yetki matrisi) mağazada tanımlı olmalı; boşsa rol formunda izin grubu görünmez.
- Etkiledikleri: rolü taşıyan kullanıcıların menüleri ve işlemleri ([../../project/navigation.md](../../project/navigation.md));
  [system-users.md](system-users.md) davet diyaloğundaki rol listesi.

## Varsayılan roller
Her mağazada hazır gelir (ad İngilizce görünür):

| Rol | Kapsam | "Sistem" rozeti | Silinebilir mi | Düzenlenebilir mi |
|---|---|---|---|---|
| Super Admin | Global | evet | hayır | yalnız açıklama ve izinler |
| Admin | Kiracı / Tenant | evet | hayır | yalnız açıklama ve izinler |
| Security Admin | Kiracı / Tenant | evet | hayır | yalnız açıklama ve izinler |
| Store Manager | Mağaza / Store | hayır | hayır (varsayılan rol) | evet |
| Store Operator | Mağaza / Store | hayır | hayır (varsayılan rol) | evet |
| Viewer | Mağaza / Store | hayır | hayır (varsayılan rol) | evet |

- Sistem rolünde ad ve kapsam değiştirilemez → `SYSTEM_ROLE_RESTRICTED_MODIFICATION`.
- Sistem ve varsayılan roller silinemez → `CANNOT_DELETE_SYSTEM_OR_DEFAULT_ROLE`. Silme yalnız
  özel (kullanıcı tanımlı) rollerde yapılır.

## Yerleşim
1. Başlık + sayı rozeti; sağda "Rol Oluştur / Create Role".
2. Filtre: arama "Rolleri ara... / Search roles..." (yazdıkça ~0,3 sn sonra süzer); Select "Kapsam / Scope": "Tüm Kapsamlar /
   All Scopes", "Global", "Kiracı / Tenant", "Mağaza / Store".
3. Tablo: "Ad / Name" (+ "Sistem / System" rozeti), "Açıklama / Description", "Kapsam / Scope" (ham değer `global` /
   `tenant` / `store`), "İzinler / Permissions" (izin sayısı), "⋯" menüsü: "Düzenle / Edit", "Sil / Delete" (sistem rolünde yok).
4. Boş: "Rol bulunamadı / No roles found". En fazla 50 rol listelenir.

## Alanlar
### "Rol Oluştur" / "Rolü Düzenle" yan paneli (Sheet)
Açıklama: "Belirli izinlerle yeni bir rol oluşturun." / "Rol ayrıntılarını ve izinlerini güncelleyin."

| Label (tr / en) | Kontrol tipi | Zorunlu | Validasyon/varsayılan | Locator ipucu | Not |
|---|---|---|---|---|---|
| Ad / Name | Input | evet | boşken kaydet butonu pasif; mağazada benzersiz (409 `ROLE_ALREADY_EXISTS`) | `#role-name`, placeholder "örn. Mağaza Yöneticisi" | Sistem rolünde değiştirme |
| Açıklama / Description | Textarea | hayır | — | `#role-description`, placeholder "Bu rol ne yapabilir?" | |
| Kapsam / Scope | Select | — | yeni rolde "Kiracı / Tenant" | label "Kapsam" | Global / Kiracı / Mağaza. Sistem rolünde değiştirme |
| İzinler (n seçili) / Permissions (n selected) | Checkbox ağacı | hayır | — | kaynak grubu `#resource-<kaynak>` (grubun tümünü seçer/kaldırır); tek izin `#perm-<id>` | Kaynağa göre gruplu (ör. `orders`, `products`, `users`); her satırda eylem adı (`read`, `create`, `update`, `delete`…) + açıklama |

Butonlar: "İptal / Cancel", "Rol Oluştur / Create Role" ya da "Rolü Düzenle / Edit Role" (kaydet).

## Aksiyonlar
| Buton | Ne olur | Toast |
|---|---|---|
| Rol Oluştur → panel → Rol Oluştur | Yeni (sistem dışı) rol oluşur | "Rol oluşturuldu" + `"ad"` / "Role created"; hata: genel "Hata" toast'ı |
| ⋯ → Düzenle → Rolü Düzenle | Ad/açıklama/kapsam/izinler güncellenir; rolü taşıyan kullanıcıların yetkisi değişir | "Rol güncellendi" / "Role updated" |
| ⋯ → Sil → onay "Bu rolü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz." → "Sil" | Rol kalıcı silinir | Başarıda toast **yok** (satır kaybolur); hata: genel "Hata" toast'ı. Başka rol bu rolden türetilmişse `ROLE_HAS_DEPENDENTS` |

## Onay zamanlaması (kural 2/5/6)
- **Oluştur / Düzenle:** özet tablosu: rol adı, kapsam, eklenen ve çıkarılan izinler ayrı listeler halinde (kaynak:eylem).
  Düzenlemede "etkilenen: bu rolü taşıyan tüm kullanıcılar" yaz; sayı için [system-users.md](system-users.md) listesinde
  "Rol" sütununa bak.
- **Sil:** geri alınamaz → ayrı onay; önce rolün kullanıcılarda kullanılıp kullanılmadığını listeden kontrol et ve sayısını
  özette ver.
- Yetkiler sunucuda değerlendirilir; değişiklik ilgili kullanıcıların bir sonraki isteğinde/girişinde etkili olur (doğrulanmadı).
- Dış sisteme yazma veya e-posta yok; işlemler denetim günlüğüne düşer.

## Tuzaklar
- **Kendini kilitleme:** "Super Admin" / "Admin" rollerinden `users:*`, `settings:*` gibi yönetim izinlerini çıkarmak, giriş
  yapmış kullanıcının (ve Claude'un oturumunun) bu ekranlara erişimini kaldırabilir. Bu rollerde izin **çıkarma** isteğinde
  ayrıca uyar, kullanıcı ikinci kez teyit etmeden yapma.
- Sistem rollerinde (Super Admin, Admin, Security Admin) yalnız açıklama ve izinleri değiştir; ad ve kapsamı elleme.
- Varsayılan roller (Store Manager, Store Operator, Viewer) silinemez; yalnız özel rolleri silmeyi öner.
- Kaynak başlığındaki checkbox o kaynağın **tüm** izinlerini birden seçer/kaldırır; tek izin değiştireceksen satır checkbox'ını kullan.
- İzin listesi uzun; panel içinde kaydırarak tüm grupların göründüğünü snapshot ile doğrula. Panelde görünmeyen bir izin
  isteniyorsa kullanıcıya bildir (doğrulanmadı).
- Kapsam sütunu ham değer gösterir (`tenant`); filtre ise çevrilmiş etiket kullanır.

## Doğrulama
1. Toast; silmede ayrıca satırın kaybolduğunu snapshot ile doğrula.
2. Tabloda: ad, açıklama, kapsam, izin sayısı (özetteki toplamla aynı olmalı).
3. Satırı yeniden "Düzenle" ile açıp seçili izinleri özetle karşılaştır; kaydetmeden "İptal" ile kapat.
