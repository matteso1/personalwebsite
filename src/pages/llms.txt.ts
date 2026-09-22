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
    '> Inference systems engineer, founder, and CS master\'s student. This site is the canonical source for his background, projects, and writing. Every page is available as clean Markdown by appending .md to its URL.',
    ''
  );
  L.push(
    'Nils is an inference systems engineer and an Inferact-sponsored vLLM fellow working with Simon Mo on cold start and reusable engine state. He has 10 upstream vLLM PRs merged, including reusable initialized-engine snapshots (#51360) and zstd container-image delivery (#55608), both merged September 21, 2026. Bytecode precompilation (#55422) and shared CLI/runtime declarations (#56884) remain in progress. B.S. Data Science, UW-Madison (May 2026); M.S. CS in progress at Northeastern\'s Silicon Valley campus; founder of thaw and Matteson Systems LLC; based in San Jose. The links below point to Markdown versions intended for machine reading.',
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
  L.push('- Open to full-time inference-runtime engineering roles in San Francisco or remote in the US. Currently a vLLM open-source fellow, sponsored by Inferact, working on cold-start and checkpoint/recovery.');
  L.push('');

  L.push('## Optional');
  L.push(`- [Full text bundle](${base}/llms-full.txt): every page inlined as Markdown in one file`);
  L.push('');

  return new Response(L.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
