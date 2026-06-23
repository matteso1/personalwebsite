import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';

const fmt = (d: Date) => d.toISOString().slice(0, 10);

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL(SITE.url)).href.replace(/\/$/, '');
  const work = (await getCollection('work')).sort(
    (a, b) => (a.data.order ?? 99) - (b.data.order ?? 99)
  );
  const writing = (await getCollection('writing', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const L: string[] = [];
  L.push('# Nils Matteson', '');
  L.push(
    '> CS master\'s student, founder, and systems/ML-infrastructure engineer. This site is the canonical source for his background, projects, and writing. Every page is available as clean Markdown by appending .md to its URL.',
    ''
  );
  L.push(
    'Nils builds the systems layer of AI: GPU/CUDA inference, distributed systems, and applied ML, shipped with committed benchmark receipts rather than claims. He is a UW-Madison data-science senior and an incoming M.S. CS student at Northeastern\'s Silicon Valley campus, founder of thaw (LLM-inference infrastructure) and Matteson Systems LLC, based in Madison and moving to the Bay Area in fall 2026. His flagship, thaw, forks a live vLLM session in 0.88s median versus a roughly 340s cold boot on an H100. The links below point to Markdown versions intended for machine reading.',
    ''
  );

  L.push('## About');
  L.push(`- [Home](${base}/index.md): one-line identity, a short intro, and thaw stated once with its strongest receipt`);
  L.push(`- [About](${base}/about.md): background, education, founder context, and how to reach him`);
  L.push(`- [For agents](${base}/agents.md): factual bio, the verifiable receipts, and how to evaluate the work`);
  L.push('');

  L.push('## Work');
  L.push(`- [Work](${base}/work.md): the full ledger of shipped work and selected projects`);
  for (const w of work) {
    L.push(`- [${w.data.title}](${base}/work/${w.id}.md): ${w.data.description}`);
  }
  L.push('');

  L.push('## Writing');
  for (const p of writing) {
    L.push(`- [${p.data.title}](${base}/writing/${p.id}.md): ${p.data.description ?? ''} (${fmt(p.data.date)})`);
  }
  L.push('');

  L.push('## Contact');
  L.push(`- Email: ${SITE.email}`);
  L.push('- GitHub: https://github.com/matteso1');
  L.push('- LinkedIn: https://www.linkedin.com/in/nilsmatteson');
  L.push(`- Resume: ${base}/resume.pdf`);
  L.push('- thaw: https://thaw.sh and on PyPI as thaw-vllm');
  L.push('- Open to: SWE/MLE internship available now (fall 2026) through summer 2027, full-time 2028 (GPU inference, distributed systems, ML infrastructure). Currently full-time on thaw.');
  L.push('');

  L.push('## Optional');
  L.push(`- [Full text bundle](${base}/llms-full.txt): every page inlined as Markdown in one file`);
  L.push('');

  return new Response(L.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
