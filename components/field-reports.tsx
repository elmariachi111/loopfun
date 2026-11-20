import Link from 'next/link';
import { source } from '@/lib/source';
import { newFieldReportUrl } from '@/lib/shared';

/** Pages in the field-reports folder that are not reports themselves. */
const notReports = new Set(['public-record']);

/** Lists every community field report, or an invitation to write the first one. */
export function FieldReports() {
  const reports = source
    .getPages()
    .filter((page) => page.slugs.length === 2 && page.slugs[0] === 'field-reports' && !notReports.has(page.slugs[1]))
    .sort((a, b) => a.data.title.localeCompare(b.data.title));

  if (reports.length === 0) {
    return (
      <div className="not-prose rounded-xl border border-dashed p-6 text-center">
        <p className="font-medium">No reports yet.</p>
        <p className="mt-1 text-sm text-fd-muted-foreground">
          Yours could be the first.{' '}
          <a href={newFieldReportUrl} target="_blank" rel="noreferrer" className="text-fd-primary underline underline-offset-2">
            Share your story
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <ul className="not-prose grid gap-3">
      {reports.map((page) => {
        const meta = [page.data.author, page.data.harness].filter(Boolean).join(' · ');
        return (
          <li key={page.url}>
            <Link
              href={page.url}
              className="block rounded-xl border bg-fd-card p-4 transition-colors hover:border-fd-primary/60 hover:bg-fd-accent"
            >
              <span className="font-medium">{page.data.title}</span>
              {page.data.description ? (
                <span className="mt-1 block text-sm text-fd-muted-foreground">{page.data.description}</span>
              ) : null}
              {meta ? <span className="mt-2 block font-mono text-xs text-fd-primary">{meta}</span> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
