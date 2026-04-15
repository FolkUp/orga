import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://underground.folkup.life',
  integrations: [mdx(), svelte()],
  build: {
    assets: '_assets'
  },
  vite: {
    define: {
      __DATE__: `'${new Date()}'`
    }
  }
});