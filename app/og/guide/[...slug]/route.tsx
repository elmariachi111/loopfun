import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { renderOgImage } from '@/components/og-image';
import { docsRoute, getPageImageUrl } from '@/lib/shared';
import { sectionTitle } from '@/lib/seo';

export const revalidate = false;

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
