# UX Audit Re-Run Summary — 2026-05-21 (post-fix)

> Companion to `SUMMARY.md` (pre-fix baseline). Re-audit run after WAVE 1+2+3 fixes (commits 78c6e34, 6ffb290, c433627, plus follow-up 307214e). Same harness: 22 URLs × 4 viewports = 88 main + 20 SC 2.4.11 focus + 20 SC 1.4.12 text-spacing = **128 tests**.

## Headline numbers

| Metric | Pre-fix (SUMMARY.md) | Post-fix (this run) | Delta |
|---|---|---|---|
| Tests passed | 108 | 123 | **+15 (+14%)** |
| Tests failed | 20 | 5 | **−15 (−75%)** |
| axe-core nodes (element instances) | 772 | **84** | **−688 (−89%)** |
| axe-core unique rules | 2 (color-contrast + link-in-text-block) | **1 (color-contrast only)** | link-in-text-block eliminated |
| SC 1.4.10 Reflow @ 320px | 0 violations | 0 violations | unchanged ✓ |
| SC 1.4.12 Text Spacing | 0 violations | 0 violations | unchanged ✓ |
| axe critical | 0 | 0 | unchanged ✓ |

## What was closed (commits)

| ID | Issue | Commit | Verification |
|---|---|---|---|
| ORGA-107 | Footer link sage/bordeaux 2.52:1 (504 nodes) | 78c6e34 | ivory/bordeaux 7.02:1 ✓ live |
| ORGA-109 | FolkUp link 2.87:1 link-in-text-block (84 nodes) | 78c6e34 (combined with 107) | underline always-on, axe rule eliminated |
| ORGA-111 | focus.spec.ts banner-descendant false positives | 78c6e34 | overlays:{el,rect} + ancestry filter |
| ORGA-113 | /50x/+/404/ link distinction 1.35:1 | 78c6e34 | text-decoration:underline always-on |
| ORGA-108 | Language switcher amber/mauve 2.29:1 (84 nodes) | 6ffb290 | rgba(0,0,0,0.35) bg + outline; 5.97:1 ✓ |
| ORGA-110 | Cookie banner footer overlay SC 2.4.11 (partial) | 6ffb290 | body:has() padding on .site-container at 4 breakpoints |
| ORGA-112 | Audio embed eyebrow gold/cream 1.94:1 (12 nodes) | c433627 → re-fix 307214e | reverted broken chip; bordeaux text on cream 7.02:1 ✓ |

## What remains (filed as new BACKLOG entries)

### ORGA-115 (P2) — Cookie banner accept button: 3.73:1
**Surfaced by**: WAVE 4 re-audit + phantom-evidence-cascade correction.

`.consent-btn--accept` (CookieConsent.astro:197-201): `color: var(--color-bordeaux); background-color: var(--color-amber)` = **3.73:1**, fails AA 4.5:1 for normal text. **All 84 remaining axe nodes are this single selector** (verified post-ORGA-112-v2 clean re-audit).

**Pre-existing** — was always in audit data; previously missed because the brand-implementation-report claimed "Amber on Bordeaux: 4.89:1 (AA)" — phantom value, independently disproved in WAVE 4 (corrected in commit 307214e).

Recommended fix vectors: (a) Ivory bg + bordeaux text (7.02:1 AAA); (b) large-bold text qualification; (c) custom darker amber breaking palette D. Needs brand-compliance + UX decision.

### ORGA-116 (P2) — Cookie banner SC 2.4.11 real subset
**Surfaced by**: WAVE 4 re-audit (5 fails: 20 → 5, 75% improvement from ORGA-110+111).

Banner overlay at `position: fixed; bottom: 0` covers focusable elements on:
- responsive-320 longform: header nav links (banner = 58% of 568px viewport)
- tablet-768 + laptop-1280 home/methodology: footer links
- tablet-768 + laptop-1280 longform: audio-embed CTAs (Spotify/YouTube/Apple Music + Принять)

ORGA-110's `.site-container { padding-bottom }` creates scroll-room PAST footer but doesn't move footer above banner at scrollY=0. Test-policy change (remove preventScroll) regressed worse (20 → 9). Real fix needs banner sizing reduction OR programmatic focus-scroll. Requires brand/UX panel.

## Phantom evidence cascade (lesson)

The WAVE 4 re-audit caught a **multi-step phantom cascade**:
- `_meta/brand-implementation-report.md:103` claimed "Amber on Bordeaux: 4.89:1 (AA)" — never independently computed
- brand-compliance pre-review cited it as ground truth
- ORGA-112 chip pattern used it for justification
- Post-fix re-audit caught 12 nodes/viewport still failing
- Independent WCAG luminance computation: actual 3.73:1, fails AA 4.5:1 (passes 3:1 only for large bold)

**Cascade now corrected** in commit 307214e (audio-embed eyebrow re-fix + brand-implementation-report.md:98-118 correction with verified-only pairs).

Verified palette-D AA pairs as of this audit:
- ✓ Bordeaux ↔ Ivory: 7.02:1 (AAA, both directions)
- ✓ Text Primary ↔ Ivory (claimed 12.6:1, not independently re-verified)
- ✗ Sage anywhere on Ivory or Bordeaux backgrounds (fails AA without non-color signal)
- ✗ Amber anywhere on Ivory or Bordeaux backgrounds (fails AA without large-bold qualification)

## Raw artifacts (local-only, gitignored)

- `axe-violations/*/` — 88 JSON files (1 per URL × viewport), 84 total nodes remaining (all on `.consent-btn--accept`)
- `focus-obscured/*/` — 20 JSON files, 5 with non-empty violations (per ORGA-116)
- `screenshots/*/` — failure screenshots
- `playwright-results.json` — full Playwright report
- `playwright-report/` — HTML report

Per `docs/audit/.gitignore`, only `SUMMARY*.md` files commit; raw artifacts regenerable via `node audit/run.js`.

---
*Generated 2026-05-21 by Alice + re-audit run 128/123/5 pass/fail.*
*Companion to: [`SUMMARY.md`](./SUMMARY.md) (pre-fix baseline).*
