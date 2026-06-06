import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { toRawMarkdown, MD_HEADERS } from '../lib/rawmd';

export const GET: APIRoute = async () => {
  const e = (await getEntry('pages', 'work'))!;
  return new Response(
    toRawMarkdown({
      title: e.data.title,
      description: e.data.description,
      canonicalPath: '/work',
      body: e.body ?? '',
    }),
    { headers: MD_HEADERS }
  );
};
