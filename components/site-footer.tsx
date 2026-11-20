import Link from 'next/link';
import { LoopMark } from '@/components/loop-mark';
import { cn } from '@/lib/cn';
import { appName, missionStatement, repoUrl, siteUrl, socialLinks } from '@/lib/shared';

const linkClass = 'underline-offset-2 transition-colors hover:text-fd-foreground hover:underline';

/**
 * Small footer shown under every page (home and guide).
 * `inColumn` drops the side padding when it sits inside the guide's content column.
 */
export function SiteFooter({ inColumn = false }: { inColumn?: boolean } = {}) {
  return (
    <footer className="mt-auto border-t text-fd-muted-foreground">
      <div
        className={cn(
          'mx-auto flex w-full max-w-6xl flex-col gap-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between',
          !inColumn && 'px-4 sm:px-6',
        )}
      >
        <div className="flex items-start gap-3">
          <LoopMark className="mt-0.5 size-5 shrink-0 text-fd-primary" />
          <div>
            <p className="font-medium text-fd-foreground">
              <Link href="/" className={linkClass}>
                {new URL(siteUrl).host}
              </Link>
            </p>
            <p className="max-w-md text-pretty">{missionStatement}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <nav aria-label="Social" className="flex gap-4">
            {socialLinks.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer me" className={linkClass}>
                {label}
              </a>
            ))}
            <a href={repoUrl} target="_blank" rel="noreferrer" className={linkClass}>
              GitHub
            </a>
          </nav>
          <p>
            © 2026 {appName} ·{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer license" className={linkClass}>
              CC BY 4.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
