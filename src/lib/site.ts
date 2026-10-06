// Single source of truth for site-wide constants: identity, nav, links,
// and the schema.org Person graph. Keep every field aligned with what the
// pages actually show.

export const SITE = {
  name: 'Nils Matteson',
  url: 'https://nilsmatteson.com',
  title: 'Nils Matteson',
  tagline: 'Inference engineering, and understanding where the time goes.',
  description:
    'Nils Matteson is an engineer interested in inference systems, startup performance, model loading, and reusable state. An Inferact-sponsored vLLM open-source fellow based in San Jose.',
  email: 'nilsmatteson@icloud.com',
  ogImage: '/og.png',
} as const;

export const NAV = [
  { label: 'Work', href: '/work' },
  { label: 'Writing', href: '/writing' },
  { label: 'About', href: '/about' },
] as const;

export const LINKS = {
  github: 'https://github.com/matteso1',
  linkedin: 'https://www.linkedin.com/in/nilsmatteson',
  email: `mailto:${SITE.email}`,
  resume: '/resume.pdf',
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
    jobTitle: 'Inference systems engineer',
    description: SITE.tagline,
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'University of Wisconsin-Madison',
        sameAs: 'https://www.wisc.edu/',
      },
    ],
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: 'Northeastern University',
      sameAs: 'https://www.northeastern.edu/',
    },
    knowsAbout: [
      'LLM inference infrastructure',
      'GPU / CUDA programming',
      'Distributed systems',
      'Machine learning infrastructure',
      'Rust',
      'Model loading',
      'Inference startup performance',
      'GPU memory and caching',
      'vLLM',
      'FlashInfer',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Jose',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    sameAs: [
      'https://github.com/matteso1',
      'https://www.linkedin.com/in/nilsmatteson',
    ],
  };
}
