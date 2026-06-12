// Rebuilds a clean Markdown twin (frontmatter + body) for agent endpoints.
// Astro parses frontmatter off into entry.data, so we re-emit a minimal,
// useful header and the raw body verbatim.
import { SITE } from './site';

type RawArgs = {
  title: string;
  description?: string;
  canonicalPath: string; // e.g. "/work/thaw"
  date?: Date;
  tags?: string[];
  body: string;
};

function yamlValue(v: string): string {
  // quote if it could be misread as YAML
  if (/[:#\-?\[\]{}&*!|>'"%@`]/.test(v) || v.trim() !== v) {
    return JSON.stringify(v);
  }
  return v;
}

export function toRawMarkdown({
  title,
  description,
  canonicalPath,
  date,
  tags,
  body,
}: RawArgs): string {
  const fm: string[] = ['---'];
  fm.push(`title: ${yamlValue(title)}`);
  if (description) fm.push(`description: ${yamlValue(description)}`);
  if (date) fm.push(`date: ${date.toISOString().slice(0, 10)}`);
  if (tags && tags.length) fm.push(`tags: [${tags.map(yamlValue).join(', ')}]`);
  fm.push(`canonical: ${SITE.url}${canonicalPath}`);
  fm.push('---');
  return `${fm.join('\n')}\n\n${body.trim()}\n`;
}

export const MD_HEADERS = {
  'Content-Type': 'text/markdown; charset=utf-8',
};
