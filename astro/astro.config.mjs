// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';

// ORGA — Multimedia Longform Investigation Platform
// Astro with Island Architecture for interactive components
export default defineConfig({
  integrations: [
    mdx(),
    svelte(),
  ],
  // Content collections for type-safe content management
  // Will be configured in Phase 1 when migrating Hugo content
  site: 'https://orga.folkup.app',
  build: {
    assets: '_assets',
  },
  vite: {
    build: {
      // Optimize for multimedia longform content
      cssMinify: true,
    },
  },
});
