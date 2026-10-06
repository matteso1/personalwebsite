// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Wide Markdown tables scroll on phones; keep them reachable by keyboard,
// including when the reader has JavaScript disabled.
function focusableTables() {
  return (tree: { children?: unknown[] }) => {
    const visit = (node: any) => {
      if (node.tagName === 'table') {
        node.properties = { ...node.properties, tabIndex: 0 };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://nilsmatteson.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, focusableTables],
    shikiConfig: {
      theme: 'css-variables',
      wrap: false,
    },
  },
  integrations: [sitemap({ filter: (page) => !page.includes('/og-card') })],
});
