import { ArrowRight, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * A circular loop diagram: steps placed clockwise on a ring with arrowheads between them.
 * Pure SVG, themed through Tailwind colour utilities, so it works in light and dark mode.
 */
export function Cycle({
  steps,
  center,
  caption,
  highlight,
}: {
  steps: string[];
  center?: string;
  caption?: ReactNode;
  /** index of a step to emphasise */
  highlight?: number;
}) {
  const size = 380;
  const c = size / 2;
  const r = 132;
  const n = steps.length;
  const step = 360 / n;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const at = (deg: number, radius = r) => ({
    x: c + radius * Math.cos(rad(deg)),
    y: c + radius * Math.sin(rad(deg)),
  });

  return (
    <figure className="not-prose my-8">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto w-full max-w-sm"
        role="img"
        aria-label={`Loop: ${steps.join(' → ')} → back to ${steps[0]}`}
      >
        <circle cx={c} cy={c} r={r} className="fill-none stroke-fd-primary/50" strokeWidth={2} strokeDasharray="5 7" />
        <g className="loop-orbit">
          <circle cx={c} cy={c - r} r={5} className="fill-fd-primary" />
        </g>
        {steps.map((_, i) => {
          const a = -90 + (i + 0.5) * step;
          const p = at(a);
          return (
            <path
              key={`arrow-${i}`}
              d="M -6 -6 L 7 0 L -6 6 z"
              transform={`translate(${p.x} ${p.y}) rotate(${a + 90})`}
              className="fill-fd-primary"
            />
          );
        })}
        {steps.map((label, i) => {
          const p = at(-90 + i * step);
          const w = Math.max(64, label.length * 7.6 + 26);
          const h = 32;
          const isHi = highlight === i;
          return (
            <g key={label} transform={`translate(${p.x - w / 2} ${p.y - h / 2})`}>
              <rect
                width={w}
                height={h}
                rx={10}
                className={cn(isHi ? 'fill-fd-primary stroke-fd-primary' : 'fill-fd-card stroke-fd-border')}
                strokeWidth={1.5}
              />
              <text
                x={w / 2}
                y={h / 2}
                dominantBaseline="central"
                textAnchor="middle"
                className={cn('text-[13px] font-medium', isHi ? 'fill-fd-primary-foreground' : 'fill-fd-foreground')}
              >
                {label}
              </text>
            </g>
          );
        })}
        {center ? (
          <text
            x={c}
            y={c}
            dominantBaseline="central"
            textAnchor="middle"
            className="fill-fd-muted-foreground font-mono text-[12px] uppercase tracking-widest"
          >
            {center}
          </text>
        ) : null}
      </svg>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-fd-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** A linear chain of steps, optionally marked as repeating. */
export function Flow({ steps, repeat, caption }: { steps: string[]; repeat?: string; caption?: ReactNode }) {
  return (
    <figure className="not-prose my-6">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-fd-card p-4">
        {steps.map((s, i) => (
          <span key={s} className="inline-flex items-center gap-2">
            <span
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium',
                i === 0 ? 'border-fd-primary/60 bg-fd-accent text-fd-accent-foreground' : 'bg-fd-background',
              )}
            >
              {s}
            </span>
            {i < steps.length - 1 ? <ArrowRight className="size-4 shrink-0 text-fd-muted-foreground" /> : null}
          </span>
        ))}
        {repeat ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-loop-blue/60 px-2.5 py-1.5 text-sm text-loop-blue">
            <RotateCcw className="size-4" />
            {repeat}
          </span>
        ) : null}
      </div>
      {caption ? <figcaption className="mt-2 text-sm text-fd-muted-foreground">{caption}</figcaption> : null}
    </figure>
  );
}

const layers = [
  {
    n: 4,
    name: 'Meta-loops & graphs',
    desc: 'Loops that start, check and restart other loops: planner → generator → evaluator, agent teams, kanban boards of goals.',
  },
  {
    n: 3,
    name: 'Scheduled & ambient loops',
    desc: 'Something wakes the agent: a timer, a cron line, a heartbeat, a webhook. /loop, routines, HEARTBEAT.md.',
  },
  {
    n: 2,
    name: 'Goal loop',
    desc: 'Re-prompt across turns until a completion condition holds. The Ralph loop, /goal.',
  },
  {
    n: 1,
    name: 'Inner tool loop',
    desc: 'Model → tool call → observation → model … until the model answers. Every agent has this.',
  },
];

/** Four nested boxes illustrating the layers that people mean by "agentic loop". */
export function LoopLayers() {
  const render = (i: number): ReactNode => {
    const layer = layers[i];
    if (!layer) return null;
    const core = i === layers.length - 1;
    return (
      <div
        className={cn(
          'rounded-xl border p-3 sm:p-4',
          core
            ? 'border-fd-primary/70 bg-fd-accent'
            : i === 0
              ? 'border-dashed border-loop-blue/60 bg-fd-card'
              : 'bg-fd-background/60',
        )}
      >
        <div className="mb-2 flex items-baseline gap-2">
          <span
            className={cn(
              'inline-flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold',
              core ? 'bg-fd-primary text-fd-primary-foreground' : 'bg-fd-secondary text-fd-secondary-foreground',
            )}
          >
            {layer.n}
          </span>
          <span className="font-semibold">{layer.name}</span>
        </div>
        <p className="mb-3 text-sm text-fd-muted-foreground">{layer.desc}</p>
        {render(i + 1)}
      </div>
    );
  };

  return (
    <figure className="not-prose my-8">
      {render(0)}
      <figcaption className="mt-2 text-sm text-fd-muted-foreground">
        Each layer wraps the one inside it. Most arguments about "agentic loops" are two people talking about different layers.
      </figcaption>
    </figure>
  );
}

/** A quotation with attribution and a link to where it was said. */
export function Quote({ children, by, href, where }: { children: ReactNode; by: string; href?: string; where?: string }) {
  return (
    <figure className="not-prose my-6 border-l-4 border-fd-primary pl-4">
      <blockquote className="text-lg leading-relaxed italic">{children}</blockquote>
      <figcaption className="mt-2 text-sm text-fd-muted-foreground">
        {by}
        {where ? (
          <>
            {', '}
            {href ? (
              <a href={href} className="underline decoration-fd-primary/50 underline-offset-2 hover:text-fd-foreground">
                {where}
              </a>
            ) : (
              where
            )}
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}

const evidenceStyles = {
  primary: 'border-emerald-600/40 text-emerald-700 dark:text-emerald-400',
  secondary: 'border-loop-blue/50 text-loop-blue',
  anecdotal: 'border-amber-600/50 text-amber-700 dark:text-amber-400',
  contested: 'border-fd-primary/50 text-fd-primary',
} as const;

const evidenceLabel = {
  primary: 'primary source',
  secondary: 'secondary reporting',
  anecdotal: 'anecdotal',
  contested: 'contested',
} as const;

/** An inline badge describing how solid a claim is. */
export function Evidence({ level }: { level: keyof typeof evidenceStyles }) {
  return (
    <span
      className={cn(
        'not-prose ml-1 inline-flex translate-y-[-1px] items-center rounded-full border px-2 py-px align-middle font-mono text-[10.5px] uppercase tracking-wider',
        evidenceStyles[level],
      )}
      title="How well-supported this claim is"
    >
      {evidenceLabel[level]}
    </span>
  );
}

/** A compact two-column "term → meaning" grid. */
export function Defs({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="not-prose my-6 grid gap-px overflow-hidden rounded-xl border bg-fd-border sm:grid-cols-[minmax(0,11rem)_1fr]">
      {items.map(([term, def]) => (
        <div key={term} className="contents">
          <dt className="bg-fd-card px-4 pt-3 font-mono text-sm font-semibold text-fd-primary sm:py-3">{term}</dt>
          <dd className="bg-fd-card px-4 pb-3 text-sm sm:py-3">{def}</dd>
        </div>
      ))}
    </dl>
  );
}
