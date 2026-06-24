// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://nilsmatteson.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'css-variables',
      wrap: false,
    },
  },
  integrations: [sitemap({ filter: (page) => !page.includes('/og-card') })],
});
