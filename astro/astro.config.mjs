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
  build: {
    assets: '_assets',
    // ORGA-067: Aggressive bundle optimization
    inlineStylesheets: 'auto',
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'vendor-core': ['astro/runtime/client/client.js'],
          'vendor-multimedia': [
            'src/utils/evidence-enhancer.js',
            'src/utils/timeline-enhancer.js'
          ]
        },
        // Optimize chunk sizes
        chunkSizeWarningLimit: 150, // 150KB limit
      }
    }
  },
  vite: {
    define: { __DATE__: `'${new Date()}'` },
    build: {
      // ORGA-067: Tree shaking and optimization
      rollupOptions: {
        treeshake: true,
        output: {
          // Optimize chunks for performance
          experimentalMinChunkSize: 1000,
        }
      },
      // Minimize bundle size
      target: 'es2020',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs in production
          drop_debugger: true,
          pure_funcs: ['console.info', 'console.debug', 'console.warn']
        }
      },
      // Asset optimization
      assetsInlineLimit: 4096, // 4KB inline limit
      cssCodeSplit: true,
      reportCompressedSize: false // Skip gzip reporting for faster builds
    }
  },
  // ORGA-067: Performance optimization settings
  output: 'static',
  adapter: undefined
});
