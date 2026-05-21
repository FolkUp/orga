// Johnny: main audit loop. For each URL × viewport project:
//   1. Navigate, wait for networkidle so above-the-fold + fonts settle.
//   2. Measure horizontal overflow (WCAG 2.2 SC 1.4.10 Reflow).
//      On responsive-320: hard fail. Other viewports: warning only via annotation.
//   3. Run axe-core with WCAG 2.0/2.1/2.2 A+AA tags. Persist violations JSON per URL/viewport.
//   4. Full-page screenshot to docs/audit/2026-05-21/screenshots/<project>/<slug>.png

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { SITEMAP_PATHS, pathToSlug } from './helpers/urls';

const REPORT_ROOT = join(__dirname, '..', '..', 'docs', 'audit', '2026-05-21');

async function ensureDir(p: string) { await fs.mkdir(p, { recursive: true }); }

for (const path of SITEMAP_PATHS) {
  const slug = pathToSlug(path);

  test(`audit ${slug} (${path})`, async ({ page }, testInfo) => {
    const project = testInfo.project.name;
    const screenshotDir = join(REPORT_ROOT, 'screenshots', project);
    const axeDir = join(REPORT_ROOT, 'axe-violations', project);
    const overflowDir = join(REPORT_ROOT, 'overflow', project);
    await Promise.all([ensureDir(screenshotDir), ensureDir(axeDir), ensureDir(overflowDir)]);

    const response = await page.goto(path, { waitUntil: 'networkidle' });
    expect(response, `no response for ${path}`).not.toBeNull();
    expect(response!.status(), `HTTP ${response!.status()} for ${path}`).toBeLessThan(400);

    // SC 1.4.10 Reflow: no horizontal scroll at 320 CSS px wide viewport.
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      innerWidth: window.innerWidth,
      bodyScrollWidth: document.body.scrollWidth,
    }));
    const hasOverflow = overflow.scrollWidth > overflow.innerWidth + 1; // 1px tolerance for sub-pixel rounding
    await fs.writeFile(join(overflowDir, `${slug}.json`), JSON.stringify({ path, project, ...overflow, hasOverflow }, null, 2));

    // Screenshot BEFORE assertion so failures still leave evidence.
    await page.screenshot({ path: join(screenshotDir, `${slug}.png`), fullPage: true });

    // axe-core, WCAG 2.0/2.1/2.2 A + AA. target-size (SC 2.5.8) and contrast included.
    const axeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    await fs.writeFile(
      join(axeDir, `${slug}.json`),
      JSON.stringify({ path, project, violations: axeResults.violations, incomplete: axeResults.incomplete }, null, 2),
    );

    // Hard fail on 320 overflow. Other viewports just attach the data.
    if (project === 'responsive-320') {
      expect(hasOverflow, `horizontal overflow at 320px on ${path}: scrollWidth=${overflow.scrollWidth} vs innerWidth=${overflow.innerWidth}`).toBe(false);
    }
    // Critical axe violations always fail.
    const critical = axeResults.violations.filter((v) => v.impact === 'critical');
    expect(critical, `critical axe violations on ${path} [${project}]: ${critical.map((v) => v.id).join(', ')}`).toEqual([]);
  });
}
