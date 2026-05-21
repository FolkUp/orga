#!/usr/bin/env node
// Johnny: runner that delegates to dayforge's installed Playwright CLI
// without copying node_modules into orga/audit/. NODE_PATH lets the
// playwright config (which `import`s @playwright/test) resolve the
// package from the sibling project.
//
// Usage:
//   node run.js --list           # dry-run, lists tests, no execute
//   node run.js                  # full audit (Phase 2 only — DO NOT RUN YET)
//   node run.js --project=responsive-320
//   node run.js tests/focus.spec.ts

const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const DAYFORGE_NM = path.resolve(__dirname, '..', '..', 'dayforge', 'node_modules');
const PLAYWRIGHT_BIN = path.join(
  DAYFORGE_NM,
  '.bin',
  process.platform === 'win32' ? 'playwright.cmd' : 'playwright'
);

if (!fs.existsSync(PLAYWRIGHT_BIN)) {
  console.error(`[orga-audit] Playwright CLI not found at ${PLAYWRIGHT_BIN}`);
  console.error('[orga-audit] Verify dayforge node_modules are installed.');
  process.exit(2);
}

const args = ['test', '--config', path.join(__dirname, 'playwright.config.ts'), ...process.argv.slice(2)];

const env = {
  ...process.env,
  // Make @playwright/test, @axe-core/playwright resolvable from audit/
  NODE_PATH: [DAYFORGE_NM, process.env.NODE_PATH].filter(Boolean).join(path.delimiter),
};

const child = spawn(PLAYWRIGHT_BIN, args, {
  stdio: 'inherit',
  env,
  cwd: __dirname,
  shell: process.platform === 'win32', // .cmd needs shell on Windows
});

child.on('exit', (code) => process.exit(code ?? 1));
