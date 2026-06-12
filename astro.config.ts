// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://nilsmatteson.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      wrap: false,
    },
  },
  integrations: [sitemap({ filter: (page) => !page.includes('/og-card') })],
});
