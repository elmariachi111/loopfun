import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

/** Served at /sitemap.xml: the home page plus every guide page. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    ...source.getPages().map((page) => ({
      url: absoluteUrl(page.url),
      changeFrequency: 'weekly' as const,
      // Section landing pages (/guide, /guide/goals, ...) rank above leaf pages.
      priority: page.slugs.length <= 1 ? 0.8 : 0.6,
    })),
  ];
}
