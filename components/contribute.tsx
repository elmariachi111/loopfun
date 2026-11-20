import { MessageSquarePlus, NotebookPen, PencilLine } from 'lucide-react';
import { discussUrl, editUrl, newFieldReportUrl } from '@/lib/shared';

/** Footer shown on every guide page. */
export function PageContribute({ path, title }: { path: string; title: string }) {
  const links = [
    {
      href: newFieldReportUrl,
      icon: NotebookPen,
      label: 'Share your story',
      hint: 'A loop you ran: what worked, what broke',
    },
    {
      href: editUrl(path),
      icon: PencilLine,
      label: 'Improve this page',
      hint: 'Fix, extend or add a source',
    },
    {
      href: discussUrl(title),
      icon: MessageSquarePlus,
      label: 'Disagree? Discuss',
      hint: 'Open a thread about this page',
    },
  ];

  return (
    <aside className="not-prose mt-14 rounded-xl border border-dashed bg-fd-card/60 p-5">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-fd-primary">This page is a living draft</p>
      <p className="mb-4 text-sm text-fd-muted-foreground">
        It's built from public reporting and will go stale. If you run loops yourself, your experience is the most
        valuable thing you can add.
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {links.map(({ href, icon: Icon, label, hint }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border bg-fd-background p-3 transition-colors hover:border-fd-primary/60 hover:bg-fd-accent"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <Icon className="size-4 text-fd-primary" />
              {label}
            </span>
            <span className="mt-1 block text-xs text-fd-muted-foreground">{hint}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

/** The main "share your story" call to action, used on the home page and in the field reports. */
export function FieldReportCTA() {
  return (
    <div className="not-prose my-8 flex flex-col gap-4 rounded-2xl border border-fd-primary/40 bg-fd-accent p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-lg font-semibold">Running loops? Share your story.</p>
        <p className="text-sm text-fd-muted-foreground">
          What you set up, what happened, what it cost. Failures teach as much as wins. Let's learn from each other.
        </p>
      </div>
      <a
        href={newFieldReportUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
      >
        <NotebookPen className="size-4" />
        Share your story
      </a>
    </div>
  );
}
