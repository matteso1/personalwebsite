// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://nilsmatteson.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: {
    shikiConfig: {
      // css-variables lets the design system theme code blocks through CSS tokens
      // instead of baking a fixed Shiki theme that would fight the palette.
      theme: 'css-variables',
      wrap: false,
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap({ filter: (page) => !page.includes('/og-card') })],
});
