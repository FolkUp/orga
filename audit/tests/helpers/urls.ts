// Johnny: 22 URLs from live sitemap (confirmed 2026-05-21). Kept as paths
// so baseURL in playwright.config.ts is the single source of truth.

export const SITEMAP_PATHS: ReadonlyArray<string> = [
  '/',
  '/50x/',
  '/about/',
  '/en/',
  '/en/about/',
  '/en/longform/',
  '/en/longform/organizatsiya/',
  '/en/methodology/',
  '/legal/',
  '/legal/ai-transparency/',
  '/legal/cookie-policy/',
  '/legal/privacy-policy/',
  '/legal/ru/',
  '/legal/ru/ai-transparency/',
  '/legal/ru/cookie-policy/',
  '/legal/ru/privacy-policy/',
  '/legal/ru/terms-of-use/',
  '/legal/terms-of-use/',
  '/longform/',
  '/longform/en/organizatsiya/',
  '/longform/organizatsiya/',
  '/methodology/',
] as const;

// Filesystem-safe slug for screenshot filenames.
export function pathToSlug(p: string): string {
  if (p === '/') return 'home';
  return p.replace(/^\/+|\/+$/g, '').replace(/\//g, '__') || 'home';
}

// Smaller sample used by the heavy custom tests (focus, text-spacing) to
// keep wall-clock reasonable. Picks structurally distinct pages.
export const SAMPLE_PATHS: ReadonlyArray<string> = [
  '/',
  '/about/',
  '/methodology/',
  '/longform/organizatsiya/',
  '/legal/privacy-policy/',
] as const;
