# loop.fun

**A field guide to loop engineering, and the stories of the people doing it.** Everyone running agentic loops (Claude Code `/goal`, Codex, Hermes, Ralph loops, scheduled agents, software factories) is figuring it out as they go. This repo collects what people actually tried, what worked, what broke and what it cost, so we can learn from each other.

Read it at **[loop.fun](https://loop.fun)**.

## Share your story

Ran a loop? Write a field report. Wins and failures are both welcome, and rough numbers are fine.

**[→ Share your story](https://loop.fun/guide/field-reports)**. The button there opens GitHub with a short template.

Reports live in [`content/guide/field-reports/`](content/guide/field-reports) and show up on the site once merged. Please skim the short [ground rules](CONTRIBUTING.md) first: no secrets, failures welcome, disclose interests.

You can also fix any page with its "Improve this page" link, or argue with it via "Disagree? Discuss".

## What's in the guide

Patterns, hints and tools for designing agentic loops: goals that can be checked, the harnesses that run them (Claude Code, Codex, Hermes, Antigravity, OpenClaw), microVM hosts that sleep between tasks, software factories, and the failure modes to plan for. Every claim links to its source. Built with [Fumadocs](https://fumadocs.dev) on Next.js and exported as a static site.

## Development

```sh
npm install
npm run dev      # local dev server on http://localhost:3000
npm run build    # static export into out/
npm start        # serve out/ locally
```

## Structure

```
content/guide/            # all guide pages (MDX) + meta.json sidebar order
  foundations/            # what a loop is, layers, anatomy, timeline, glossary
  goals/                  # goals, judges, budgets, standing goals, open questions
  patterns/               # Ralph, maker/checker, metric, ambient, graphs
  environments/           # Claude Code, Codex, Hermes, Google, OpenClaw, SDKs
  hosts/                  # microVM hosts: Firecracker, custom stacks, gVisor/k8s, self-hosted, harnesses, costs, ops
  factories/              # software factories: triggers, stations, leverage, cases, tools, pitfalls
  shortcomings/           # verification, cost, memory, models, security, humans…
  field-reports/          # community stories + summaries of public ones
  idea-board.mdx          # open problems waiting for someone to try them
  remedies/               # speculative service proposals (collapsed, end of sidebar)
app/(home)/page.tsx       # landing page
app/guide/                # guide layout and page renderer
components/diagrams.tsx   # Cycle, Flow, LoopLayers, Quote, Evidence, Defs
components/contribute.tsx # "share your story" CTA and per-page links
components/field-reports.tsx # auto-generated list of field reports
app/global.css            # silver / graphite theme, lobster red + hermes blue
lib/shared.ts             # site config, GitHub links, field-report template
brand/STYLEGUIDE.md       # self-contained style guide (incl. logo SVGs) for content authors
```

## Deploy

`npm run build` produces a static `out/` directory. Host it anywhere (Vercel, Netlify, GitHub Pages, S3, …) and point the loop.fun DNS at it.
