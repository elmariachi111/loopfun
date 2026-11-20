import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { SiteFooter } from '@/components/site-footer';

export default function Layout({ children }: LayoutProps<'/guide'>) {
  const { links: _links, ...options } = baseOptions();

  return (
    <DocsLayout tree={source.getPageTree()} {...options}>
      {children}
      <SiteFooter />
    </DocsLayout>
  );
}
