#!/usr/bin/env node
// PreToolUse guard for the admin-browser MCP. Two hard rules the model cannot talk its way past:
//   1. Claude never types credentials — password / 2FA fields are the user's.
//   2. Anything that persists data (save, publish, delete, confirm dialogs...) needs the user's approval.
// Element descriptions are written by the model, so this is a backstop; CLAUDE.md is the primary rule.

const COMMIT_WORDS =
  /(?<![\p{L}\p{N}])(kaydet|save|oluştur|create|yayınla|yayından|publish|unpublish|sil|delete|remove|kaldır|güncelle|update|onayla|confirm|gönder|submit|send|uygula|apply|içe aktar|import|iptal et|iade|refund|arşivle|archive|geri yükle|restore|çoğalt|duplicate|aktifleştir|activate|deactivate|pasifleştir|senkronize|sync|reindex|launch|başlat|tamamla|complete|approve|reddet|reject|varsayılan yap|set as default|kopyala|clone|yayına al|go live|duraklat|pause|resume|devam ettir|şablonu kullan|use template|yeni otomasyon|new automation)(?![\p{L}\p{N}])|[✕×]/iu;
const SECRET_FIELD = /(password|şifre|parola|passcode|2fa|otp|totp|doğrulama kodu|verification code|recovery code|kurtarma kodu|api[ _-]?key|secret|token|webhook url|webhook urlsi)/iu;
const SECRET_CODE = /(document\.cookie|localStorage|sessionStorage|indexedDB|password|authorization|access[_-]?token|refresh[_-]?token)/iu;
const MUTATING_CODE = /(fetch\s*\(|XMLHttpRequest|sendBeacon|\.submit\s*\(|\.click\s*\(|requestSubmit|dispatchEvent)/iu;

const decide = (permissionDecision, permissionDecisionReason) => {
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision, permissionDecisionReason } }),
  );
  process.exit(0);
};

let raw = '';
for await (const chunk of process.stdin) raw += chunk;
const { tool_name: toolName = '', tool_input: input = {} } = JSON.parse(raw || '{}');
const tool = toolName.replace(/^mcp__admin-browser__/, '');
const label = [input.element, input.target].filter(Boolean).join(' ');

switch (tool) {
  case 'browser_type':
    if (SECRET_FIELD.test(label)) decide('deny', 'Şifre/2FA/anahtar alanlarına Claude yazmaz; kullanıcıdan tarayıcıda kendisinin girmesini iste.');
    if (input.submit) decide('ask', `Form gönderimi (Enter) — "${label}". Kullanıcı onayı gerekli.`);
    break;
  case 'browser_fill_form': {
    const fields = Array.isArray(input.fields) ? input.fields : [];
    const secret = fields.find((f) => SECRET_FIELD.test(`${f.name ?? ''} ${f.type ?? ''}`));
    if (secret) decide('deny', `"${secret.name}" bir kimlik bilgisi alanı; kullanıcı kendisi girmeli.`);
    break;
  }
  case 'browser_click':
    if (COMMIT_WORDS.test(label)) decide('ask', `Kalıcı değişiklik yapabilecek tıklama: "${label}". Özet kullanıcıya gösterildi mi?`);
    break;
  case 'browser_press_key':
    if (/^(Enter|NumpadEnter)$/i.test(input.key ?? '')) decide('ask', 'Enter formu gönderebilir. Seçimleri tıklayarak yap; gönderim ise kullanıcı onayı gerekli.');
    break;
  case 'browser_handle_dialog':
    if (input.accept) decide('ask', 'Tarayıcı onay penceresi kabul edilecek (genelde silme/gönderim).');
    break;
  case 'browser_evaluate':
    if (SECRET_CODE.test(input.function ?? '')) decide('deny', 'Cookie/token/storage/şifre okumak yasak.');
    if (MUTATING_CODE.test(input.function ?? '')) decide('ask', 'Script ile istek/tıklama/gönderim — UI dışı değişiklik riski.');
    break;
  case 'browser_run_code_unsafe':
    if (SECRET_CODE.test(input.code ?? '')) decide('deny', 'Cookie/token/storage/şifre okumak yasak.');
    decide('ask', 'Serbest Playwright kodu çalıştırılacak.');
    break;
  case 'browser_network_request':
    if (/header/i.test(input.part ?? '')) decide('deny', 'İstek/yanıt başlıkları oturum çerezleri içerir; okunmaz.');
    break;
}
process.exit(0);
