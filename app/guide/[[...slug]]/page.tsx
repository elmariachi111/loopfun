import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { appName, getPageImageUrl, getPageMarkdownUrl, gitConfig, twitterHandle } from '@/lib/shared';
import { guidePageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/json-ld';
import { PageContribute } from '@/components/contribute';
import { SiteFooter } from '@/components/site-footer';
import { FieldReports } from '@/components/field-reports';

export default async function Page(props: PageProps<'/guide/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  return (
    // The docs layout is a fixed CSS grid with no footer row, so the site footer goes
    // into the page's own footer slot, below the previous/next links.
    <DocsPage toc={page.data.toc} full={page.data.full} footer={{ children: <SiteFooter inColumn /> }}>
      <JsonLd data={guidePageJsonLd(page, getPageImageUrl(page).url)} />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/guide/${encodeURI(page.path)}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
            FieldReports,
          })}
        />
        <PageContribute path={page.path} title={page.data.title} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/guide/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const image = { url: getPageImageUrl(page).url, width: 1200, height: 630, alt: page.data.title };

  return {
    title: page.data.seoTitle ?? page.data.title,
    description: page.data.description,
    alternates: {
      canonical: page.url,
      // The same page as plain Markdown, for LLM crawlers and "copy as Markdown".
      types: { 'text/markdown': getPageMarkdownUrl(page).url },
    },
    openGraph: {
      type: 'article',
      url: page.url,
      siteName: appName,
      locale: 'en_US',
      title: page.data.title,
      description: page.data.description,
      images: image,
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      title: page.data.title,
      description: page.data.description,
      images: image,
    },
  };
}
