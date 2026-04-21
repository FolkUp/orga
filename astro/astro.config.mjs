import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

// Canonical URL for sitemap, canonical <link>, and OG/Twitter meta resolution.
// Currently points at the live CF Pages default subdomain because the custom
// domain `underground.folkup.life` has no DNS record (NXDOMAIN, never configured).
// TODO: when Андрей sets up CNAME `underground.folkup.life` →
// `orga-underground-academia.pages.dev` in the folkup.life DNS zone, revert this
// to `https://underground.folkup.life` (the intended canonical per ORGA-028 memo).
const SITE = 'https://orga-underground-academia.pages.dev';

// Bilingual page pairs. Each entry produces `<xhtml:link rel="alternate">`
// blocks inside the corresponding `<url>` in the sitemap so Google can
// tie the two language versions together. `x-default = RU` per the
// RU-primary language policy (2026-04-20).
//
// Add a new entry here whenever you publish a translated twin (new
// longform EN rendering, new legal page pair, etc.), then rebuild and
// inspect `dist/sitemap-0.xml`.
const BILINGUAL_GROUPS = [
  { ru: '/legal/ru/',                  en: '/legal/' },
  { ru: '/legal/ru/ai-transparency/',  en: '/legal/ai-transparency/' },
  { ru: '/legal/ru/cookie-policy/',    en: '/legal/cookie-policy/' },
  { ru: '/legal/ru/privacy-policy/',   en: '/legal/privacy-policy/' },
  { ru: '/legal/ru/terms-of-use/',     en: '/legal/terms-of-use/' },
  { ru: '/longform/organizatsiya/',    en: '/longform/en/organizatsiya/' },
];

const linksByUrl = new Map();
for (const pair of BILINGUAL_GROUPS) {
  const ruUrl = new URL(pair.ru, SITE).toString();
  const enUrl = new URL(pair.en, SITE).toString();
  const alternates = [
    { lang: 'ru',        url: ruUrl },
    { lang: 'en',        url: enUrl },
    { lang: 'x-default', url: ruUrl },
  ];
  linksByUrl.set(ruUrl, alternates);
  linksByUrl.set(enUrl, alternates);
}

export default defineConfig({
  site: SITE,
  integrations: [
    mdx(),
    svelte(),
    sitemap({
      serialize(item) {
        const links = linksByUrl.get(item.url);
        return links ? { ...item, links } : item;
      },
    }),
  ],
  build: { assets: '_assets' },
  vite: { define: { __DATE__: `'${new Date()}'` } },
});
