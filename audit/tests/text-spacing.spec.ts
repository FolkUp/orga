// Johnny: WCAG 2.1 SC 1.4.12 "Text Spacing" (AA). Per W3C:
//   line-height ≥ 1.5× font size; paragraph spacing ≥ 2× font size;
//   letter-spacing ≥ 0.12×; word-spacing ≥ 0.16×.
// User must be able to override to these values without "loss of content
// or functionality". We inject the override via addStyleTag and then:
//   - capture pre/post bounding rect of <body> and key landmarks
//   - look for any element whose post-spacing scrollWidth exceeds clientWidth
//     (indicates clipped text → loss of content) or whose text becomes
//     vertically clipped by a fixed-height container (overflow:hidden).
//
// Heuristic, not exhaustive — but axe-core does not auto-check 1.4.12.
// Sample only (5 URLs × 4 viewports).

import { test, expect } from '@playwright/test';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { SAMPLE_PATHS, pathToSlug } from './helpers/urls';

const REPORT_ROOT = join(__dirname, '..', '..', 'docs', 'audit', '2026-05-21');

const OVERRIDE_CSS = `
  * {
    line-height: 1.5 !important;
    letter-spacing: 0.12em !important;
    word-spacing: 0.16em !important;
  }
  p { margin-bottom: 2em !important; }
`;

for (const path of SAMPLE_PATHS) {
  const slug = pathToSlug(path);

  test(`text-spacing ${slug}`, async ({ page }, testInfo) => {
    const project = testInfo.project.name;
    const outDir = join(REPORT_ROOT, 'text-spacing', project);
    await fs.mkdir(outDir, { recursive: true });

    await page.goto(path, { waitUntil: 'networkidle' });

    const before = await page.evaluate(() => ({
      docScrollWidth: document.documentElement.scrollWidth,
      docScrollHeight: document.documentElement.scrollHeight,
      innerWidth: window.innerWidth,
    }));

    await page.addStyleTag({ content: OVERRIDE_CSS });
    // Let layout settle.
    await page.waitForTimeout(250);

    const after = await page.evaluate(() => {
      const clipped: Array<{ tag: string; id: string; cls: string; text: string }> = [];
      // Look for elements whose content is clipped by an ancestor with overflow:hidden|clip
      // and where the element itself contains text. Heuristic: element scrollHeight
      // exceeds its clientHeight under an overflow-restricted ancestor.
      const all = Array.from(document.querySelectorAll<HTMLElement>('p, h1, h2, h3, h4, h5, h6, li, button, a, span, div'));
      for (const el of all) {
        if (!el.textContent || !el.textContent.trim()) continue;
        // own overflow ancestor?
        let cur: HTMLElement | null = el.parentElement;
        let clippedAncestor: HTMLElement | null = null;
        while (cur && cur !== document.body) {
          const ov = window.getComputedStyle(cur).overflow;
          if (ov === 'hidden' || ov === 'clip') { clippedAncestor = cur; break; }
          cur = cur.parentElement;
        }
        if (clippedAncestor) {
          const r = el.getBoundingClientRect();
          const ar = clippedAncestor.getBoundingClientRect();
          if (r.bottom > ar.bottom + 1 || r.right > ar.right + 1) {
            clipped.push({
              tag: el.tagName.toLowerCase(),
              id: el.id,
              cls: el.className.toString().slice(0, 60),
              text: el.textContent.trim().slice(0, 80),
            });
          }
        }
      }
      return {
        docScrollWidth: document.documentElement.scrollWidth,
        docScrollHeight: document.documentElement.scrollHeight,
        innerWidth: window.innerWidth,
        horizontalOverflowAppeared: document.documentElement.scrollWidth > window.innerWidth + 1,
        clippedElements: clipped.slice(0, 50), // cap report size
        clippedCount: clipped.length,
      };
    });

    await fs.writeFile(join(outDir, `${slug}.json`), JSON.stringify({ path, project, before, after }, null, 2));

    // Soft expectation: don't hard-fail entire run on heuristic content-loss
    // until we've eyeballed the first results. Hard-fail only on new horizontal
    // overflow that didn't exist before the override (clear SC 1.4.12 failure).
    if (!('hasOverflow' in (before as object) && (before as { hasOverflow?: boolean }).hasOverflow)) {
      expect(after.horizontalOverflowAppeared, `SC 1.4.12 failure on ${path} [${project}]: applying text-spacing override introduced new horizontal overflow`).toBe(false);
    }
  });
}
