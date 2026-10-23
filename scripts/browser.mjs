#!/usr/bin/env node
// Cross-platform (macOS / Linux / Windows) browser helper for the admin-browser MCP.
//   node scripts/browser.mjs setup  → installs Chrome for Testing into ./.browsers (project-local, gitignored)
//   node scripts/browser.mjs path   → prints the newest Chrome for Testing executable, exits 1 if none
//   node scripts/browser.mjs mcp    → launches Playwright MCP on headed Chrome for Testing with a persistent profile,
//                                     so the user logs in once by hand and the session survives restarts

import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BROWSERS_DIR = join(ROOT, '.browsers');
const PUPPETEER_BROWSERS = '@puppeteer/browsers@3.2.6';
const PLAYWRIGHT_MCP = '@playwright/mcp@0.0.83';

// Executable location inside one installed build folder (e.g. .browsers/chrome/win64-156.0.8078.47/).
const EXE_IN_BUILD = {
  darwin: (build) =>
    readdirSync(build)
      .filter((d) => d.startsWith('chrome-mac'))
      .map((d) => join(build, d, 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing')),
  linux: (build) => [join(build, 'chrome-linux64', 'chrome')],
  win32: (build) => [join(build, 'chrome-win64', 'chrome.exe'), join(build, 'chrome-win32', 'chrome.exe')],
};

const versionOf = (name) => (name.split('-').pop() ?? '').split('.').map(Number);
const newestFirst = (a, b) => {
  const [va, vb] = [versionOf(a), versionOf(b)];
  for (let i = 0; i < Math.max(va.length, vb.length); i++) if ((vb[i] ?? 0) !== (va[i] ?? 0)) return (vb[i] ?? 0) - (va[i] ?? 0);
  return 0;
};

function findChrome() {
  const chromeDir = join(BROWSERS_DIR, 'chrome');
  const candidates = EXE_IN_BUILD[process.platform];
  if (!candidates || !existsSync(chromeDir)) return null;
  for (const build of readdirSync(chromeDir).sort(newestFirst)) {
    const exe = candidates(join(chromeDir, build)).find((p) => existsSync(p));
    if (exe) return exe;
  }
  return null;
}

// Run npx through the npm that ships with this Node, so Windows needs no shell (npx.cmd cannot be spawned directly).
function npx(args, stdio) {
  const nodeDir = dirname(process.execPath);
  const cli = [
    join(nodeDir, 'node_modules', 'npm', 'bin', 'npx-cli.js'), // Windows installer layout
    join(nodeDir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npx-cli.js'), // macOS / Linux layout
  ].find((p) => existsSync(p));
  return cli
    ? spawn(process.execPath, [cli, '-y', ...args], { stdio })
    : spawn('npx', ['-y', ...args], { stdio, shell: process.platform === 'win32' });
}

const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

switch (process.argv[2]) {
  case 'setup': {
    const child = npx([PUPPETEER_BROWSERS, 'install', 'chrome@stable', '--path', BROWSERS_DIR], ['ignore', 'ignore', 'inherit']);
    child.on('exit', (code) => {
      if (code !== 0) fail(`Chrome for Testing kurulamadı (çıkış kodu ${code}).`);
      const exe = findChrome();
      if (!exe) fail('Kurulum bitti ama Chrome for Testing bulunamadı.');
      console.log(exe);
    });
    break;
  }
  case 'path': {
    const exe = findChrome();
    if (!exe) fail('Chrome for Testing bulunamadı. Önce: node scripts/browser.mjs setup');
    console.log(exe);
    break;
  }
  case 'mcp': {
    const exe = findChrome();
    if (!exe) fail('Chrome for Testing bulunamadı. Önce: node scripts/browser.mjs setup');
    const child = npx(
      [
        PLAYWRIGHT_MCP,
        '--executable-path', exe,
        '--user-data-dir', join(ROOT, '.browser-profile'),
        '--output-dir', join(ROOT, '.playwright-output'),
        '--viewport-size', '1440,900',
      ],
      'inherit',
    );
    for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig));
    child.on('exit', (code) => process.exit(code ?? 0));
    break;
  }
  default:
    fail('Kullanım: node scripts/browser.mjs setup | path | mcp');
}
