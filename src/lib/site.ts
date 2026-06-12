// Single source of truth for site-wide constants: identity, nav, links,
// and the schema.org Person graph. Keep every field aligned with what the
// pages actually show.

export const SITE = {
  name: 'Nils Matteson',
  url: 'https://nilsmatteson.com',
  title: 'Nils Matteson',
  tagline: 'Engineer working on LLM-inference infrastructure. CS master’s student and founder.',
  description:
    'Nils Matteson builds the systems layer of AI: GPU/CUDA inference, distributed systems, and applied ML. Founder of thaw, which forks a live vLLM session in 0.88s.',
  email: 'nilsmatteson@icloud.com',
  ogImage: '/og.png',
} as const;

export const NAV = [
  { label: 'Work', href: '/work' },
  { label: 'Writing', href: '/writing' },
  { label: 'About', href: '/about' },
  { label: 'Agents', href: '/agents' },
] as const;

export const LINKS = {
  github: 'https://github.com/matteso1',
  linkedin: 'https://www.linkedin.com/in/nilsmatteson',
  email: 'mailto:nilsmatteson@icloud.com',
  resume: '/resume.pdf',
  thaw: 'https://thaw.sh',
  rss: '/rss.xml',
} as const;

// One canonical Person node, referenced site-wide by @id.
export const PERSON_ID = `${SITE.url}/#person`;

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Nils Matteson',
    givenName: 'Nils',
    familyName: 'Matteson',
    url: `${SITE.url}/`,
    image: `${SITE.url}${SITE.ogImage}`,
    email: `mailto:${SITE.email}`,
    jobTitle: ['Systems & ML Infrastructure Engineer', 'Founder'],
    description: SITE.tagline,
    worksFor: [
      { '@type': 'Organization', name: 'thaw', url: 'https://thaw.sh' },
      { '@type': 'Organization', name: 'Matteson Systems LLC' },
    ],
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'University of Wisconsin-Madison',
        sameAs: 'https://www.wisc.edu/',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'Northeastern University',
        sameAs: 'https://www.northeastern.edu/',
      },
    ],
    knowsAbout: [
      'LLM inference infrastructure',
      'GPU / CUDA programming',
      'Distributed systems',
      'Machine learning infrastructure',
      'Rust',
      'Raft consensus',
      'LSM-trees',
      'Conformal prediction',
      'vLLM',
      'Compilers and JIT',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Madison',
      addressRegion: 'WI',
      addressCountry: 'US',
    },
    sameAs: [
      'https://github.com/matteso1',
      'https://www.linkedin.com/in/nilsmatteson',
      'https://thaw.sh',
      'https://pypi.org/project/thaw-vllm/',
    ],
  };
}
