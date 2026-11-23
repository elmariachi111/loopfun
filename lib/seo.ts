import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { source } from '@/lib/source';
import { appName, appTagline, docsRoute, missionStatement, repoUrl, siteUrl, socialLinks } from '@/lib/shared';

/** Absolute URL on the site, for canonical links, sitemaps and structured data. */
export const absoluteUrl = (path: string) => new URL(path, siteUrl).toString();

export const licenseUrl = 'https://creativecommons.org/licenses/by/4.0/';

/** The sidebar title of a section folder (from its meta.json), e.g. "Shortcomings". */
function folderTitle(folder: string): string | undefined {
  try {
    const meta = JSON.parse(readFileSync(join(process.cwd(), 'content/guide', folder, 'meta.json'), 'utf8'));
    return typeof meta.title === 'string' ? meta.title : undefined;
  } catch {
    return undefined;
  }
}

/** The section label on a page's share card: "Guide" for top-level pages and section landing pages. */
export function sectionTitle(slugs: string[]): string | undefined {
  return slugs.length < 2 ? 'Guide' : folderTitle(slugs[0]);
}

const orgRef = { '@id': `${siteUrl}/#organization` };

const organization = {
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: appName,
  url: siteUrl,
  logo: absoluteUrl('/apple-icon.png'),
  sameAs: [...socialLinks.map((l) => l.href), repoUrl],
};

/** Site-wide schema.org graph: who publishes the site and what it is. */
export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: appName,
        alternateName: `${appName}: ${appTagline}`,
        description: missionStatement,
        inLanguage: 'en',
        license: licenseUrl,
        publisher: orgRef,
      },
    ],
  };
}

type GuidePage = NonNullable<ReturnType<typeof source.getPage>>;

/** Breadcrumb trail for a guide page: Home > Guide > Section > Page. */
function breadcrumbs(page: GuidePage) {
  const trail: { name: string; url: string }[] = [
    { name: appName, url: siteUrl },
    { name: 'Guide', url: absoluteUrl(docsRoute) },
  ];
  if (page.slugs.length > 1) {
    // Only link the section if it has its own landing page.
    const section = source.getPage([page.slugs[0]]);
    const name = folderTitle(page.slugs[0]);
    if (section && name) trail.push({ name, url: absoluteUrl(section.url) });
  }
  if (page.slugs.length > 0) trail.push({ name: page.data.title, url: absoluteUrl(page.url) });

  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: t.url })),
  };
}

/** Per-page schema.org graph for a guide page: the article plus its breadcrumbs. */
export function guidePageJsonLd(page: GuidePage, imageUrl: string) {
  const url = absoluteUrl(page.url);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        headline: page.data.title,
        description: page.data.description,
        url,
        mainEntityOfPage: url,
        image: absoluteUrl(imageUrl),
        inLanguage: 'en',
        license: licenseUrl,
        articleSection: page.slugs.length ? (folderTitle(page.slugs[0]) ?? 'Guide') : 'Guide',
        // Field reports name their author; everything else is written by the loop.fun project.
        author: page.data.author ? { '@type': 'Person', name: page.data.author } : orgRef,
        publisher: orgRef,
        isPartOf: { '@id': `${siteUrl}/#website` },
      },
      organization,
      breadcrumbs(page),
    ],
  };
}
