# orga/audit — UX/a11y audit harness

Read-only audit of `https://underground.folkup.life`. Does **not** modify `orga/astro/`. Reuses Playwright + axe-core from the sibling `dayforge` project via `NODE_PATH` — nothing installed locally here.

## What it covers

| Dimension | Source | Where |
|---|---|---|
| Horizontal overflow @ 320 (SC 1.4.10 Reflow) | Custom DOM measure | `tests/audit.spec.ts` — hard fail on `responsive-320` |
| WCAG 2.0/2.1/2.2 A+AA | `@axe-core/playwright` | `tests/audit.spec.ts` |
| Touch targets (SC 2.5.8) | axe `target-size` rule | covered by WCAG 2.2 AA tag |
| Color contrast | axe `color-contrast` | covered by WCAG 2.1 AA tag |
| Focus Not Obscured (SC 2.4.11) | Custom — axe does not check | `tests/focus.spec.ts` |
| Text Spacing (SC 1.4.12) | Custom override + content-loss | `tests/text-spacing.spec.ts` |
| Visual regression baseline | Full-page screenshots | `tests/audit.spec.ts` |

## Viewports

| Project name | Size | Why |
|---|---|---|
| `responsive-320` | 320×568 | iPhone SE 1st gen, **hard cutoff** |
| `responsive-414` | 414×896 | iPhone 11, market #1 mobile (Statcounter Apr 2026) |
| `tablet-768` | 768×1024 | iPad |
| `laptop-1280` | 1280×800 | laptop baseline |

## URLs

22 paths from live sitemap, frozen in `tests/helpers/urls.ts`. Heavy custom tests (`focus`, `text-spacing`) run on a 5-URL `SAMPLE_PATHS` subset to keep wall-clock reasonable.

## How to run

```cmd
:: dry-run, lists tests, executes nothing:
npm run list

:: full audit (Phase 2 — DO NOT RUN until hostile review approves):
npm run audit

:: single viewport:
npm run audit:320

:: single suite:
npm run audit:focus
```

Output lands in `../docs/audit/2026-05-21/` (screenshots, axe-violations JSON, overflow JSON, focus JSON, text-spacing JSON, HTML report).

## Dependency strategy

No `dependencies` in `package.json` on purpose. `run.js` invokes `../../dayforge/node_modules/.bin/playwright(.cmd)` with `NODE_PATH` set so imports resolve to dayforge's `@playwright/test@1.58.2` and `@axe-core/playwright@4.11.1`. Avoids duplicating ~250 MB and reuses already-downloaded browser binaries.

Fallback if a future Node version breaks `NODE_PATH` resolution: drop in `"dependencies"` block (commented in `package.json.notes`) and `npm install --no-package-lock`.

// Johnny
