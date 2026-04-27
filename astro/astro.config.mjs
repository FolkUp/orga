import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://underground.folkup.life';

// Bilingual page pairs. Each entry produces `<xhtml:link rel="alternate">`
// blocks inside the corresponding `<url>` in the sitemap so Google can
// tie the two language versions together. `x-default = RU` per the
// RU-primary language policy (2026-04-20).
//
// Add a new entry here whenever you publish a translated twin (new
// longform EN rendering, new legal page pair, etc.), then rebuild and
// inspect `dist/sitemap-0.xml`.
const BILINGUAL_GROUPS = [
  // Homepage
  { ru: '/',                           en: '/en/' },
  // Navigation pages
  { ru: '/investigations/',            en: '/en/investigations/' },
  { ru: '/methodology/',               en: '/en/methodology/' },
  { ru: '/about/',                     en: '/en/about/' },
  // Legal pages
  { ru: '/legal/ru/',                  en: '/legal/' },
  { ru: '/legal/ru/ai-transparency/',  en: '/legal/ai-transparency/' },
  { ru: '/legal/ru/cookie-policy/',    en: '/legal/cookie-policy/' },
  { ru: '/legal/ru/privacy-policy/',   en: '/legal/privacy-policy/' },
  { ru: '/legal/ru/terms-of-use/',     en: '/legal/terms-of-use/' },
  // Longform content
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
