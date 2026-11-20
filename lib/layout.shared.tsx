import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { LoopMark } from '@/components/loop-mark';
import { appName, docsRoute, repoUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-semibold tracking-tight">
          <LoopMark className="size-5 text-fd-primary" />
          {appName}
        </span>
      ),
    },
    links: [
      { text: 'Guide', url: docsRoute, active: 'nested-url' },
      { text: 'Shortcomings', url: `${docsRoute}/shortcomings` },
      { text: 'Field reports', url: `${docsRoute}/field-reports` },
      { text: 'Sources', url: `${docsRoute}/sources` },
    ],
    githubUrl: repoUrl,
  };
}
