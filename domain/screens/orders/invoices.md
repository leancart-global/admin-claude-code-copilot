# Faturalar (Invoices) — tüm siparişlerin faturaları
- URL: {ADMIN_URL}/invoices
- Menü yolu: Sol menü "Raporlar / Reports" → "Faturalar / Invoices".
- Sayfa başlığı: "Faturalar / Invoices"; açıklama "Tüm sipariş faturalarını görüntüleyin ve yönetin".
- Amaç: Mağazadaki tüm faturaları (standart, iade, fark; dahili ve harici) aramak, süzmek, PDF indirmek, ilgili
  siparişe gitmek. **Salt okunur** — fatura oluşturma, gönderme, iptal ve iade/fark faturası işlemleri
  [order-detail.md](order-detail.md) "Faturalar" kartındadır.
- Entity: [../../entities/invoice.md](../../entities/invoice.md).
- Yetki: sunucu `orders:read` ister (menü öğesinin ayrı yetkisi yok).
- Kişisel veri: **evet** (müşteri adı; indirilen PDF'te adres ve vergi no).

## Ön koşullar ve bağımlılıklar
- Fatura modu ve sağlayıcı: [../settings/einvoice.md](../settings/einvoice.md).

## Yerleşim
1. Başlık.
2. Filtre satırı: arama, Durum, Kanal, Kaynak, tarih Başlangıç–Bitiş.
3. Tablo: "Fatura No", "Sipariş No" (tıklanınca sipariş detayı), "Müşteri" (orta ekrandan itibaren), "Tutar", "Durum",
   "Kanal", "Kaynak" (geniş ekranda), "Tarih"; satır sonunda işlemler menüsü (sr-only "İşlemler").
4. Sayfalama: 20'şer; "{from}-{to} / {total} gösteriliyor", "Önceki", "Sonraki".
5. Boş: "Fatura bulunamadı" — "Siparişler faturalandığında burada görünecektir". Hata: "Faturalar yüklenemedi" + "Tekrar
   Dene".

## Alanlar (filtreler)
| Label (tr / en) | Kontrol tipi | Varsayılan | Locator ipucu | Seçenekler |
|---|---|---|---|---|
| Arama | Input (placeholder "Fatura no, sipariş no, müşteri ara...") | boş | placeholder | ~0,3 sn gecikmeyle arar |
| Durum / Status | Select | Tümü | placeholder "Durum" | Taslak, Gönderildi, Ödendi, İptal Edildi, İptal |
| Kanal / Channel | Select | Tümü | placeholder "Kanal" | e-Fatura, e-Arşiv, Harici |
| Kaynak / Source | Select | Tümü | placeholder "Kaynak" | Dahili, Harici |
| Başlangıç / From, Bitiş / To | date Input | boş | aria-label "Başlangıç" / "Bitiş" | |

## Aksiyonlar
| Aksiyon | Ne olur |
|---|---|
| Sipariş No / işlemler → "Siparişi Görüntüle" | [order-detail.md](order-detail.md) açılır |
| işlemler → "PDF İndir" (PDF'i olan faturalarda) | e-Fatura/e-Arşiv belgesi `{fatura no}.pdf` indirilir; hata "Faturalar yüklenemedi" |

## Onay zamanlaması
- Kalıcı aksiyon yok. PDF indirme kişisel veri içerir → yalnız kullanıcı istediğinde; dosyayı kullanıcıya bırak.

## Yan etkiler
- Yok.

## Tuzaklar
- Bu ekrandan fatura kesilemez/gönderilemez; kullanıcı "fatura kes" derse sipariş detayına git.
- "İptal Edildi" (panelde iptal) ile "İptal" (GİB'de iptal) farklı durumlardır.
- Oturum düşerse sayfa giriş ekranına yönlendirir — kullanıcıdan yeniden giriş iste.

## Doğrulama
- Fatura no veya sipariş no ile ara; satırda durum ve kanal rozetini oku.
