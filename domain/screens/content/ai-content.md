# Yapay Zekâ ile İçerik Üretme — admin'de ne var, ne yok
- URL: ekran değil; tüm admin için durum özeti.
- Amaç: "AI ile blog yazısı / ürün açıklaması / sayfa metni üret" isteklerinde Claude'un admin'de hangi butona gideceğini (ya da gitmeyeceğini) bilmesi.
- Yetki: aşağıdaki ekranlara göre.

## Sonuç (kısa)
Admin'de **blog, CMS sayfası, ürün açıklaması, SEO metni, kampanya metni veya çeviri üreten bir yapay zekâ butonu yok.**
Blog oluştur/düzenle, sayfa, ürün ve SEO ekranlarında "AI ile yaz / üret" türü kontrol bulunmaz; alanlar elle doldurulur.

| Plan özelliği (Ayarlar › Plan kartında listelenir) | Admin'de karşılığı olan ekran |
|---|---|
| `ai_branding_wizard` — AI Marka Sihirbazı | Var: `/branding/ai-wizard` — renk paleti/marka önerisi üretir, kredi harcar. Bkz. [../design/branding-ai-wizard.md](../design/branding-ai-wizard.md) |
| `ai_bulk_enrichment`, `ai_campaign_copy`, `ai_localisation`, `ai_media_studio`, `ai_media_video`, `ai_store_audit`, `ai_campaign_personalised`, `ai_store_helper`, `ai_store_helper_whatsapp`, `ai_semantic_search`, `ai_recommendations`, `ai_machine_readable_catalog`, `ai_storefront_assistant`, `ai_byok` | Admin'de bu özellikler için içerik üreten ekran/buton bulunmadı; yalnız plan özellik listesinde adları geçer |

- İlk kurulum sihirbazının AI sohbet modu (planı uygun mağazalarda) yalnız marka/renk işlemleri önerir; blog/ürün içeriği üretmez. Kurulum ekranlarının ayrıntısı bu haritanın kapsamı dışında.

## Operatör davranışı
- Taslaktan önce marka sesi okunur; tanımlı değilse kullanıcıya önerilir ve onay alınır ([../../project/brand-voice.md](../../project/brand-voice.md)).
- Kullanıcı "şu konuda blog yaz / ürün açıklaması üret" derse metni **Claude sohbette kendisi taslaklar** (başlık, özet, içerik, SEO başlığı/açıklaması, etiketler), kullanıcıya gösterir, onay/düzeltme alır, sonra ilgili formu elle doldurur. Admin'de kredi harcanmaz.
- Üretilen metin hiçbir yerde otomatik kaydedilmez; kayıt her zaman ilgili ekranın normal kaydet/yayınla akışıyla ve onayla yapılır ([blog-edit.md](blog-edit.md), [page-create.md](page-create.md), ürün ekranları).
- Kullanıcı admin içinde bir "AI" butonu ararsa: yukarıdaki tabloya göre yalnız AI Marka Sihirbazı'nın bulunduğunu söyle.
- Kullanıcının metin taslağında marka/ürün iddiası, fiyat, kampanya koşulu gibi doğrulanması gereken bilgi varsa uydurma; sor veya katalogdan (salt okunur) kontrol et.
