// Johnny: WCAG 2.2 SC 2.4.11 "Focus Not Obscured (Minimum)" — NEW in 2.2, NOT
// automatable by axe-core 4.x. Custom check:
//   - Find all focusable elements via standard selector.
//   - For each, .focus() and read its DOMRect.
//   - Read all position:fixed / position:sticky elements' rects.
//   - A focused element is "obscured" if any fixed/sticky element's rect
//     fully covers any part of its focus ring area. SC 2.4.11 (Minimum, AA)
//     requires that the focused element is NOT *entirely* hidden — so we
//     flag any case where the focused rect is wholly contained inside an
//     overlay's rect, or the overlay covers >= 100% of the focused rect.
//
// We run on SAMPLE_PATHS only (5 URLs × 4 viewports = 20 tests) to keep cost
// sane; if violations are dense we'll widen scope in Phase 3.

import { test, expect } from '@playwright/test';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { SAMPLE_PATHS, pathToSlug } from './helpers/urls';

const REPORT_ROOT = join(__dirname, '..', '..', 'docs', 'audit', '2026-05-21');

for (const path of SAMPLE_PATHS) {
  const slug = pathToSlug(path);

  test(`focus-not-obscured ${slug}`, async ({ page }, testInfo) => {
    const project = testInfo.project.name;
    const outDir = join(REPORT_ROOT, 'focus-obscured', project);
    await fs.mkdir(outDir, { recursive: true });

    await page.goto(path, { waitUntil: 'networkidle' });

    const findings = await page.evaluate(() => {
      const overlaySel = '*';
      const overlays: DOMRect[] = [];
      for (const el of Array.from(document.querySelectorAll<HTMLElement>(overlaySel))) {
        const cs = window.getComputedStyle(el);
        if ((cs.position === 'fixed' || cs.position === 'sticky') && cs.visibility !== 'hidden' && cs.display !== 'none') {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) overlays.push(r);
        }
      }

      const focusableSel = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusables = Array.from(document.querySelectorAll<HTMLElement>(focusableSel));
      const results: Array<{ tag: string; text: string; rect: { x: number; y: number; w: number; h: number }; obscuredBy: number }> = [];

      for (const el of focusables) {
        try { el.focus({ preventScroll: true }); } catch { continue; }
        if (document.activeElement !== el) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        // Element must be in viewport at all to be evaluated meaningfully.
        if (r.bottom < 0 || r.top > window.innerHeight) continue;

        const fullyCoveredBy = overlays.findIndex((o) => o.left <= r.left && o.right >= r.right && o.top <= r.top && o.bottom >= r.bottom);
        if (fullyCoveredBy >= 0) {
          results.push({
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || '').trim().slice(0, 80),
            rect: { x: r.x, y: r.y, w: r.width, h: r.height },
            obscuredBy: fullyCoveredBy,
          });
        }
      }
      return { overlays: overlays.map((o) => ({ x: o.x, y: o.y, w: o.width, h: o.height })), violations: results };
    });

    await fs.writeFile(join(outDir, `${slug}.json`), JSON.stringify({ path, project, ...findings }, null, 2));
    expect(findings.violations, `SC 2.4.11 violations on ${path} [${project}]: ${findings.violations.length} focusable elements entirely obscured by fixed/sticky overlays`).toEqual([]);
  });
}
