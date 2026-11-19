import Link from 'next/link';
import {
  ArrowRight,
  BookOpenText,
  Boxes,
  Compass,
  Crosshair,
  Library,
  NotebookPen,
  Server,
  TriangleAlert,
} from 'lucide-react';
import { FieldNoteCTA } from '@/components/contribute';
import { docsRoute } from '@/lib/shared';

const sections = [
  {
    href: `${docsRoute}/foundations/what-is-a-loop`,
    icon: Compass,
    title: 'Foundations',
    body: 'What a loop actually is, the four layers people mean by it, the building blocks, and how we got here.',
  },
  {
    href: `${docsRoute}/goals`,
    icon: Crosshair,
    title: 'Goals',
    body: 'The objective a loop works toward: writing goals you can check, who judges them, budgets and lifecycles.',
  },
  {
    href: `${docsRoute}/patterns`,
    icon: Boxes,
    title: 'Patterns',
    body: 'Ralph loops, maker/checker, metric loops, heartbeats and graphs. These are the shapes that keep recurring.',
  },
  {
    href: `${docsRoute}/environments`,
    icon: BookOpenText,
    title: 'Environments',
    body: 'How Claude Code, Codex, Hermes, Antigravity, OpenClaw and the SDKs each implement loops.',
  },
  {
    href: `${docsRoute}/hosts`,
    icon: Server,
    title: 'MicroVM hosts',
    body: 'Cloud machines for agents that look always on but sleep between tasks, and how to put a harness on one.',
  },
  {
    href: `${docsRoute}/shortcomings`,
    icon: TriangleAlert,
    title: 'Shortcomings',
    body: 'Verification, cost, memory, model choice, security and the people stuck reviewing it all.',
  },
  {
    href: `${docsRoute}/field-notes`,
    icon: NotebookPen,
    title: 'Field notes',
    body: 'Loops that people have run in public, plus an open invitation to add yours.',
  },
];

const terms = [
  ['Loop', 'The execution mechanism: observe, decide, act, check, repeat.'],
  ['Goal', 'The objective that persists across iterations and decides when to stop.'],
  ['Harness', 'The runtime around the model: tools, budgets, hooks, sandbox, scheduling.'],
  ['State', 'What survives an iteration, a context reset or a crash: files, git, logs.'],
];

function HeroLoop() {
  return (
    <svg viewBox="0 0 240 240" className="w-56 sm:w-64" aria-hidden="true">
      <circle cx="120" cy="120" r="100" className="fill-none stroke-fd-border" strokeWidth="1.5" />
      <g className="loop-orbit">
        {/* a trailing arc that ends exactly at the orbiting dot (top of the circle) */}
        <circle
          cx="120"
          cy="120"
          r="100"
          className="fill-none stroke-fd-primary"
          strokeWidth="3"
          strokeDasharray="120 508"
          strokeLinecap="round"
          transform="rotate(-158.75 120 120)"
        />
        <circle cx="120" cy="20" r="7" className="fill-fd-primary" />
      </g>
      <circle cx="120" cy="120" r="62" className="fill-none stroke-loop-blue/60" strokeWidth="1.5" strokeDasharray="3 6" />
      <g className="loop-orbit-slow">
        <circle cx="120" cy="58" r="4.5" className="fill-loop-blue" />
      </g>
      <circle cx="120" cy="120" r="26" className="fill-fd-card stroke-fd-border" strokeWidth="1.5" />
      <text
        x="120"
        y="120"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-fd-muted-foreground font-mono text-[10px] uppercase tracking-widest"
      >
        goal
      </text>
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="loop-hero-bg border-b">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 sm:px-6 md:flex-row md:py-24">
          <div className="flex-1">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-fd-primary">
              a field guide · researched November 2026
            </p>
            <h1 className="mb-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
              Agentic loops,
              <br />
              <span className="text-fd-primary">explained.</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-fd-muted-foreground text-pretty">
              In 2026 the industry went from prompting agents to designing the loops that prompt them. This site explains
              what those loops are, how today&apos;s harnesses run them, what &ldquo;goals&rdquo; have to do with it, and
              why most loops still need a human nearby.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={docsRoute}
                className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
              >
                Start reading <ArrowRight className="size-4" />
              </Link>
              <Link
                href={`${docsRoute}/shortcomings`}
                className="inline-flex items-center gap-2 rounded-lg border bg-fd-card px-5 py-2.5 font-medium transition-colors hover:bg-fd-accent"
              >
                Skip to the problems
              </Link>
            </div>
          </div>
          <div className="flex shrink-0 justify-center">
            <HeroLoop />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">Four words to keep apart</h2>
        <p className="mb-6 max-w-2xl text-fd-muted-foreground">
          Most confusion about agentic loops comes from blending these together. This guide keeps them separate.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {terms.map(([t, d]) => (
            <div key={t} className="rounded-xl border bg-fd-card p-4">
              <p className="mb-1 font-mono text-sm font-semibold text-fd-primary">{t}</p>
              <p className="text-sm text-fd-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">Explore</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ href, icon: Icon, title, body }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col rounded-xl border bg-fd-card p-5 transition-colors hover:border-fd-primary/50 hover:bg-fd-accent"
            >
              <Icon className="mb-3 size-5 text-fd-primary" />
              <span className="mb-1 flex items-center gap-1 font-semibold">
                {title}
                <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="text-sm text-fd-muted-foreground">{body}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 rounded-2xl border bg-fd-card p-6 md:grid-cols-[1fr_1.3fr] md:p-8">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-loop-blue">state of play</p>
            <h2 className="mb-3 text-2xl font-semibold tracking-tight">Embraced, but no longer naive</h2>
            <p className="text-sm text-fd-muted-foreground">
              Within about six months, every major coding agent shipped a built-in goal loop. The hype peaked in June and the
              backlash came in July. What remains is a practice that is focused on what surrounds the loop rather than the
              loop itself.
            </p>
          </div>
          <ul className="grid gap-3 text-sm">
            {[
              ['Loved', 'unattended overnight progress, loops that prompt for you, fresh context with state kept in files, loops that optimise a measurable number'],
              ['Root problem', 'checking that the goal is really done. Agents game weak checks and declare victory early.'],
              ['Expensive', 'context re-read on every turn, poll loops that spin while waiting, weekly quotas gone in a day'],
              ['Human bottleneck', 'reviewing the output, comprehension debt, "cognitive surrender"'],
              ['Open frontier', 'goals that can be checked, independent judges, goal state that persists across tools and devices'],
            ].map(([k, v]) => (
              <li key={k} className="flex gap-3">
                <span className="w-32 shrink-0 font-mono text-xs uppercase tracking-wider text-fd-primary">{k}</span>
                <span className="text-fd-muted-foreground">{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <FieldNoteCTA />
        <p className="text-center text-xs text-fd-muted-foreground">
          Built from public sources, with every claim linked. See{' '}
          <Link href={`${docsRoute}/about`} className="underline underline-offset-2">
            how this guide was made
          </Link>{' '}
          and the{' '}
          <Link href={`${docsRoute}/sources`} className="underline underline-offset-2">
            full source library
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
