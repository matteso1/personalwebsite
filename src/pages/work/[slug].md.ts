import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { toRawMarkdown, MD_HEADERS } from '../../lib/rawmd';

export const getStaticPaths: GetStaticPaths = async () => {
  const items = await getCollection('work');
  return items.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
};

export const GET: APIRoute = async ({ props }) => {
  const e = props.entry;
  return new Response(
    toRawMarkdown({
      title: e.data.title,
      description: e.data.description,
      canonicalPath: `/work/${e.id}`,
      tags: e.data.stack,
      body: e.body ?? '',
    }),
    { headers: MD_HEADERS }
  );
};
