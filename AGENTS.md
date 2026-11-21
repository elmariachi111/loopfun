# AGENTS.md

Orientation for coding agents working on this repo. Read this first. Humans should start with `README.md` and `CONTRIBUTING.md`; this file is the condensed version plus the gotchas earlier agent runs hit.

## What this repo is

**loop.fun** is a field guide to *loop engineering*: designing the loops that keep AI agents working toward a goal (Claude Code `/goal`, Codex, Hermes, Ralph loops, scheduled agents, software factories). It is a **content site**: almost every change is an MDX page under `content/guide/`. The code (Next.js 16 + Fumadocs, exported as a static site) only changes when a page needs a new component.

The guide's intent:
- **Explain concepts and trade-offs, don't document commands.** Readers already use agents. Command flags live in the tools' own docs, linked from our pages.
- **Every claim links to its source**, and shaky claims carry an evidence badge. Honesty about limits ("we couldn't confirm this") beats a confident guess.
- **Snapshot, not spec.** The space moves monthly. Pages say when they were researched and that readers should check vendor docs.
- License: CC BY 4.0 (content). Contributions follow `CONTRIBUTING.md`: no secrets, failures welcome, disclose interests.

## Layout

```
content/guide/                 all guide pages (MDX) + meta.json per folder (sidebar order)
  meta.json                    top-level sidebar: sections and "---Group---" separators
  index.mdx                    "Start here": landing cards for every section (numbered ①②…)
  foundations/ goals/ patterns/          "Understand" group
  environments/ hosts/ factories/ versioning/ shortcomings/   "In practice" group
  field-reports/               community stories (template in lib/shared.ts)
  idea-board.mdx, sources.mdx  open problems; the source library (every source, grouped)
  remedies/                    speculative proposals, kept last
components/diagrams.tsx        Cycle, Flow, LoopLayers, Quote, Evidence, Defs
components/mdx.tsx             which components MDX pages can use (registry)
brand/STYLEGUIDE.md            colors, type, shapes, components, writing rules. Read section 7 at least.
research/                      working research notes (not published). Put long research dumps here.
lib/shared.ts                  site config, GitHub links, field-report template
app/                           Next.js routes (home, guide renderer, OG images, llms.txt)
```

## Setup and verification

```sh
npm ci            # Node 20+; no other setup, no env vars needed
npm run dev       # http://localhost:3000
npm run build     # static export to out/. ALWAYS run before committing: it's the only check.
npm run types:check
```

There are no tests. `npm run build` fails on broken MDX or frontmatter, so it is the gate. For a visual check, serve `out/` (`npx serve out`) and screenshot with Playwright.

## Adding or changing pages

1. **Frontmatter is required:** `title` (keep under ~45 chars, it's the OG card), `description` (one or two sentences, ideally under 125 chars) and `icon`.
2. **List the page in its folder's `meta.json`**, or it won't appear in the sidebar. A new section also goes in `content/guide/meta.json`, needs its own `meta.json` with `title` and `icon`, a card on `content/guide/index.mdx` (renumber the cards after it), and a line in the README's structure block.
3. **Icons must exist in `lucide-react`'s `icons` map**, or they silently render as nothing. Some names exported by the package (e.g. `Fingerprint`, `History`) are *not* in the map. Check every icon:
   ```sh
   node -e "const l=require('lucide-react');for(const f of require('child_process').execSync('grep -rh \"^icon:\" content/guide').toString().trim().split('\n')){const i=f.split(': ')[1];if(!l.icons[i])console.log('MISSING',i)}"
   ```
4. **Add new sources to `content/guide/sources.mdx`**, in a section for the topic (see the existing "… research" sections near the end).
5. Link generously to other guide pages (`/guide/goals/judges` etc.); cross-links are a big part of the value.

## MDX components (from `components/mdx.tsx`)

`<Callout type="warn|info" title>`, `<Cards>`/`<Card title href description>`, `<Steps>`/`<Step>`, `<Tabs items={[...]}>`/`<Tab value>`, `<Accordions>`/`<Accordion title>`, `<Cycle steps center highlight>`, `<Flow steps repeat caption>`, `<Defs items={[[term, meaning], ...]}>`, `<Quote by where href>`, `<Evidence level="primary|secondary|anecdotal|contested" />`.

Gotchas:
- **`<Defs>` renders plain strings.** Markdown (backticks, links, bold) inside its items shows up literally. Use a Markdown table when you need formatting.
- **`<Cycle center="…">`** sits inside the ring: keep it to one or two short words or it overflows.
- **Markdown tables** are the house style for comparisons.
- Inline SVG must use token classes (`text-fd-primary`, `stroke-loop-blue`), never raw hex.

## Writing rules (short form; full version in `brand/STYLEGUIDE.md`)

- **No em dashes** anywhere. Use a period, colon or parentheses. Check with `grep -rn "—" content/`.
- Sentence case for headings. Short paragraphs. **Bold the key phrase.** British-leaning spelling is used in places ("behaviour", "centre"); match the page you're editing.
- Tag claims with `<Evidence />`: vendor docs or papers = primary; reporting = secondary; one person's numbers = anecdotal; sources disagree = contested.
- Vendor benchmarks are labelled as vendor claims. Funding and prices are "check before quoting".
- Pages that survey a fast-moving market open or close with a dated "snapshot" callout.
- Don't invent products, versions or dates. If a research source can't be confirmed, say so on the page or leave it out.

## Research workflow that has worked

Big sections (hosts, factories, versioning) were researched by fanning out 3 parallel web-research subagents, each with a narrow brief (vendors / forges / paradigms), asking for: mechanism, license, self-hostable or GA status, date, 1-3 primary URLs, and explicit "[unconfirmed]" markers. Then spot-check the most surprising claims yourself with WebFetch before publishing. Today's date matters: the content is written "as of" a month, so put dates on statuses.

## Git and PRs

- Work on a feature branch and open a PR against `main`. Keep one topic per PR.
- Don't commit `out/`, `.next/`, `.source/`, `dist/` or `node_modules/` (all gitignored).
- PR descriptions: what was added, where it sits in the sidebar, how it was verified (build output, screenshots), and which claims are least certain.
