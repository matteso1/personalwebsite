import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { toRawMarkdown, MD_HEADERS } from '../lib/rawmd';

export const GET: APIRoute = async () => {
  const e = (await getEntry('pages', 'index'))!;
  return new Response(
    toRawMarkdown({
      title: e.data.title,
      description: e.data.description,
      canonicalPath: '/',
      body: `${e.data.intro}\n\n${e.body ?? ''}`,
    }),
    { headers: MD_HEADERS }
  );
};
