import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { renderOgImage } from '@/components/og-image';
import { docsRoute, getPageImageUrl } from '@/lib/shared';

export const revalidate = false;

/** The sidebar title of the section a page lives in, e.g. "Shortcomings". */
function sectionTitle(slugs: string[]) {
  if (slugs.length < 2) return 'Guide';
  try {
    const meta = JSON.parse(readFileSync(join(process.cwd(), 'content/guide', slugs[0], 'meta.json'), 'utf8'));
    return typeof meta.title === 'string' ? meta.title : undefined;
  } catch {
    return undefined;
  }
}

export async function GET(_req: Request, { params }: RouteContext<'/og/guide/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return renderOgImage({
    title: page.data.title,
    description: page.data.description,
    section: sectionTitle(page.slugs),
    path: page.slugs.length ? `${docsRoute}/${page.slugs.join('/')}` : docsRoute,
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }));
}
