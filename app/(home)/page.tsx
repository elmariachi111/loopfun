import Link from 'next/link';
import {
  ArrowRight,
  BookOpenText,
  Boxes,
  Compass,
  Crosshair,
  Factory,
  NotebookPen,
  Server,
  TriangleAlert,
} from 'lucide-react';
import { FieldReportCTA } from '@/components/contribute';
import type { Metadata } from 'next';
import { docsRoute } from '@/lib/shared';
import { siteJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const sections = [
  {
    href: `${docsRoute}/foundations/what-is-a-loop`,
    icon: Compass,
    title: 'Foundations',
    body: 'The vocabulary for designing a loop: the four layers, the building blocks and how the practice got here.',
  },
  {
    href: `${docsRoute}/goals`,
    icon: Crosshair,
    title: 'Goals',
    body: 'Write goals a machine can check, pick who judges them, and set budgets and lifecycles before the loop starts.',
  },
  {
    href: `${docsRoute}/patterns`,
    icon: Boxes,
    title: 'Patterns',
    body: 'Ralph loops, maker/checker, metric loops, heartbeats and graphs: shapes to borrow and recombine.',
  },
  {
    href: `${docsRoute}/environments`,
    icon: BookOpenText,
    title: 'Environments',
    body: 'Where loops run today: Claude Code, Codex, Hermes, Antigravity, OpenClaw and the SDKs, side by side.',
  },
  {
    href: `${docsRoute}/hosts`,
    icon: Server,
    title: 'MicroVM hosts',
    body: 'Firecracker-style machines that sleep between tasks: providers, costs, self-hosting and how to put a harness on one.',
  },
  {
    href: `${docsRoute}/factories`,
    icon: Factory,
    title: 'Software factories',
    body: 'Loops as infrastructure: triggers, stations, leverage, who runs them, the tools and where they break.',
  },
  {
    href: `${docsRoute}/shortcomings`,
    icon: TriangleAlert,
    title: 'Shortcomings',
    body: 'Known failure modes to design around: verification, cost, memory, model choice, security and review load.',
  },
  {
    href: `${docsRoute}/field-reports`,
    icon: NotebookPen,
    title: 'Field reports',
    body: 'Stories from people running loops: what worked, what broke, what it cost. Share yours.',
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
      <JsonLd data={siteJsonLd()} />
      <section className="loop-hero-bg border-b">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 sm:px-6 md:flex-row md:py-24">
          <div className="flex-1">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-fd-primary">
              field guide · loop engineering · November 2026
            </p>
            <h1 className="mb-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
              Loop engineering,
              <br />
              <span className="text-fd-primary">in the field.</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-fd-muted-foreground text-pretty">
              Patterns, hints and tools for designing the loops that keep agents working: goals that can be checked,
              hosts that sleep between tasks, factories that run loops as infrastructure, and the failure modes to plan
              for. Use it to widen the set of loops you can think of, then go build one.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={docsRoute}
                className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
              >
                Start here <ArrowRight className="size-4" />
              </Link>
              <Link
                href={`${docsRoute}/shortcomings`}
                className="inline-flex items-center gap-2 rounded-lg border bg-fd-card px-5 py-2.5 font-medium transition-colors hover:bg-fd-accent"
              >
                Known failure modes
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
          Name these separately when you sketch a loop. Most confusion about loops comes from blending them.
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-loop-blue">state of play · November 2026</p>
            <h2 className="mb-3 text-2xl font-semibold tracking-tight">Where we stand</h2>
            <p className="text-sm text-fd-muted-foreground">
              Every major coding agent ships a goal loop. The open work has moved to what surrounds it.
            </p>
          </div>
          <ul className="grid gap-3 text-sm">
            {[
              ['Works', 'unattended overnight runs, fresh context with state in files, loops that push a measurable number'],
              ['Unsolved', 'checking that a goal is really met; weak checks get gamed and loops stop early'],
              ['Cost', 'context re-read every turn and idle polling; hosts that sleep between tasks cut the idle part'],
              ['Bottleneck', 'human review of what loops produce'],
              ['Next', 'checkable goals, independent judges, factories that run loops as infrastructure'],
            ].map(([k, v]) => (
              <li key={k} className="flex gap-3">
                <span className="w-28 shrink-0 font-mono text-xs uppercase tracking-wider text-fd-primary">{k}</span>
                <span className="text-fd-muted-foreground">{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <FieldReportCTA lead={{ href: docsRoute, label: 'Learn about loops' }} />
        <p className="text-center text-xs text-fd-muted-foreground">
          Every claim links to its source. Browse the{' '}
          <Link href={`${docsRoute}/sources`} className="underline underline-offset-2">
            full source library
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
