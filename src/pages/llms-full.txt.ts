import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { SITE } from '../lib/site';

const fmt = (d: Date) => d.toISOString().slice(0, 10);

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL(SITE.url)).href.replace(/\/$/, '');
  const out: string[] = [];

  out.push('# Nils Matteson');
  out.push('');
  out.push(
    '> Full-text bundle of nilsmatteson.com. Every page on the site, inlined as Markdown for one-shot machine reading. Canonical and current as of build time.'
  );
  out.push('');

  const section = (title: string, url: string, body: string) => {
    out.push('');
    out.push('---');
    out.push('');
    out.push(`# ${title}`);
    out.push(`Source: ${url}`);
    out.push('');
    out.push(body.trim());
    out.push('');
  };

  // Singleton prose pages
  const home = (await getEntry('pages', 'index'))!;
  section(home.data.title, `${base}/`, home.body ?? '');
  const about = (await getEntry('pages', 'about'))!;
  section(about.data.title, `${base}/about`, about.body ?? '');
  const workIndex = (await getEntry('pages', 'work'))!;
  section(workIndex.data.title, `${base}/work`, workIndex.body ?? '');

  // Work projects
  const work = (await getCollection('work')).sort(
    (a, b) => (a.data.order ?? 99) - (b.data.order ?? 99)
  );
  for (const w of work) {
    section(`${w.data.title} (project)`, `${base}/work/${w.id}`, w.body ?? '');
  }

  // Writing, newest first
  const writing = (await getCollection('writing', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  for (const p of writing) {
    section(`${p.data.title} (${fmt(p.data.date)})`, `${base}/writing/${p.id}`, p.body ?? '');
  }

  // Agents last
  const agents = (await getEntry('pages', 'agents'))!;
  section(agents.data.title, `${base}/agents`, agents.body ?? '');

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
