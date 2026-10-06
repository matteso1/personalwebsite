import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';

const fmt = (date: Date) => date.toISOString().slice(0, 10);

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL(SITE.url)).href.replace(/\/$/, '');
  const work = (await getCollection('work')).filter(
    ({ data }) => data.status !== 'Historical project'
  ).sort((a, b) => a.data.order - b.data.order);
  const writing = (await getCollection('writing', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const lines = [
    '# ' + SITE.name,
    '',
    '> ' + SITE.description,
    '',
    'The overview pages describe current interests and work. Project writeups and dated essays retain their original context. Follow linked pull requests for implementation details and current status.',
    '',
    '## About',
    '- [Home](' + base + '/index.md): introduction and current interests',
    '- [About](' + base + '/about.md): background, education, and life outside work',
    '- [For agents](' + base + '/agents.md): factual background and selected contributions',
    '',
    '## Work',
    '- [Current work](' + base + '/work.md): inference engineering in vLLM and FlashInfer',
    '',
    '## Earlier projects',
    ...work.map((entry) => '- [' + entry.data.title + '](' + base + '/work/' + entry.id + '.md): ' + entry.data.description),
    '',
    '## Writing',
    ...writing.map((entry) => '- [' + entry.data.title + '](' + base + '/writing/' + entry.id + '.md): ' + (entry.data.description ?? '') + ' (' + fmt(entry.data.date) + ')'),
    '',
    '## Contact',
    '- Email: ' + SITE.email,
    '- GitHub: https://github.com/matteso1',
    '- LinkedIn: https://www.linkedin.com/in/nilsmatteson',
    '- Resume: ' + base + '/resume.pdf',
    '',
    '## Archive',
    '- [Full text bundle](' + base + '/llms-full.txt): current pages, historical project notes, and dated writing',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
