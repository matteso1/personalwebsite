import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { toRawMarkdown, MD_HEADERS } from '../../lib/rawmd';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  return posts.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
};

export const GET: APIRoute = async ({ props }) => {
  const e = props.entry;
  return new Response(
    toRawMarkdown({
      title: e.data.title,
      description: e.data.description,
      canonicalPath: `/writing/${e.id}`,
      date: e.data.date,
      tags: e.data.tags,
      body: e.body ?? '',
    }),
    { headers: MD_HEADERS }
  );
};
