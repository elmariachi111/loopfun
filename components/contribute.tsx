import Link from 'next/link';
import { BookOpen, MessageSquarePlus, NotebookPen, PencilLine } from 'lucide-react';
import { discussUrl, editUrl, newFieldNoteUrl } from '@/lib/shared';

/**
 * Footer shown on every guide page. These are plain links into GitHub. There is
 * deliberately no in-site submission feature yet.
 */
export function PageContribute({ path, title }: { path: string; title: string }) {
  const links = [
    {
      href: newFieldNoteUrl,
      icon: NotebookPen,
      label: 'Share a field note',
      hint: 'Your own loop: what worked and what hurt',
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
        Everything here is built from public reporting and is expected to go stale. If you run loops yourself, your
        experience is the most valuable thing you can add.
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

type CTALink = { href: string; label: string };

const primaryButton =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90';
const secondaryButton =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border bg-fd-card px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-accent';

/**
 * Larger call-to-action used on the home page and the field notes index.
 * With `lead`, an internal link is shown first (left) as the primary button and
 * the field-note button becomes secondary.
 */
export function FieldNoteCTA({ lead }: { lead?: CTALink } = {}) {
  return (
    <div className="not-prose my-8 flex flex-col gap-4 rounded-2xl border border-fd-primary/40 bg-fd-accent p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-lg font-semibold">{lead ? 'New to loops, or running them already?' : 'Run loops? Write a field note.'}</p>
        <p className="text-sm text-fd-muted-foreground">
          {lead
            ? 'Start with the basics, or write up a loop you have run. A field note is a pull request on GitHub; no accounts or forms on this site.'
            : 'The button opens GitHub with a template, so contributing is a pull request. No accounts or forms on this site.'}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {lead ? (
          <Link href={lead.href} className={primaryButton}>
            <BookOpen className="size-4" />
            {lead.label}
          </Link>
        ) : null}
        <a href={newFieldNoteUrl} target="_blank" rel="noreferrer" className={lead ? secondaryButton : primaryButton}>
          <NotebookPen className={lead ? 'size-4 text-fd-primary' : 'size-4'} />
          Start a field note
        </a>
      </div>
    </div>
  );
}
