import { defineConfig } from '@playwright/test';
import { join } from 'node:path';

// Johnny: audit harness for https://underground.folkup.life
// 22 URLs (live sitemap) × 4 viewports. Read-only — no app to start, baseURL is the live site.
// Output artefacts land in ../docs/audit/2026-05-21/ via individual test logic.

const REPORT_DIR = join(__dirname, '..', 'docs', 'audit', '2026-05-21');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 60_000, // some pages have heavy fonts; 60s ceiling per test
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: join(REPORT_DIR, 'playwright-report'), open: 'never' }],
    ['json', { outputFile: join(REPORT_DIR, 'playwright-results.json') }],
  ],

  use: {
    baseURL: 'https://underground.folkup.life',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    ignoreHTTPSErrors: false,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    // Custom: a slug we'll read in tests to namespace screenshots per viewport
    // (Playwright doesn't expose project.name without context.project, so tests use testInfo.project.name)
  },

  outputDir: join(REPORT_DIR, 'test-results'),

  projects: [
    {
      name: 'responsive-320',
      use: { viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    },
    {
      name: 'responsive-414',
      use: { viewport: { width: 414, height: 896 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    },
    {
      name: 'tablet-768',
      use: { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2, isMobile: false, hasTouch: true },
    },
    {
      name: 'laptop-1280',
      use: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
    },
  ],
});
