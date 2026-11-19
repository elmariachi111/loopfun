# loop.fun

**A field guide to agentic loops.** It covers what loops are, how goal loops, scheduled loops and harnesses work across Claude Code, Codex, Hermes, Antigravity and OpenClaw, and where they still fall short. It's written for people who already know what an AI agent is. The guide explains concepts rather than documenting commands, and links every claim to its source.

Built with [Fumadocs](https://fumadocs.dev) on Next.js and exported as a fully static site.

## Contributing

The guide is meant to grow from people's real experience running loops.

- **Field notes:** write up a loop you've run (what worked, what hurt, numbers) as an MDX file in `content/guide/field-notes/`. The "Start a field note" button on the site opens GitHub with a template. New notes show up in the sidebar automatically.
- **Corrections and sources:** every page has an "Improve this page" link to its MDX source.
- **Discussion:** "Disagree? Discuss" opens an issue for that page.

There is intentionally no in-site submission feature yet. See `content/guide/field-notes/how-to-contribute.mdx`.

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
  field-notes/            # community notes, public record, idea board
  remedies/               # speculative service proposals (collapsed, end of sidebar)
app/(home)/page.tsx       # landing page
app/guide/                # guide layout and page renderer
components/diagrams.tsx   # Cycle, Flow, LoopLayers, Quote, Evidence, Defs
components/contribute.tsx # per-page contribution links (GitHub only)
app/global.css            # silver / graphite theme, lobster red + hermes blue
lib/shared.ts             # site config, GitHub links, field-note template
brand/STYLEGUIDE.md       # self-contained style guide (incl. logo SVGs) for content authors
```

## Deploy

`npm run build` produces a static `out/` directory. Host it anywhere (Vercel, Netlify, GitHub Pages, S3, …) and point the loop.fun DNS at it.
