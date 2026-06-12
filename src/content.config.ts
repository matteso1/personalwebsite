import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Singleton prose pages (home, about, work index, agents). Authored in Markdown
// so the raw .md twins and llms.txt derive from the same source of truth.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string().optional(),
    })
    .passthrough(),
});

// Project notes. One markdown file per project under src/content/work/.
const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.coerce.string().optional(),
    role: z.string().optional(),
    stack: z.array(z.string()).default([]),
    status: z.string().optional(),
    // A single committed benchmark/receipt line, shown verbatim. Real numbers only.
    receipt: z.string().optional(),
    links: z.record(z.string()).optional(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
  }),
});

// Long-form writing. One markdown file per post under src/content/writing/.
const writing = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages, work, writing };
