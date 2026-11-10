# loop.fun style guide

A minimal, self-contained reference for anyone (human or agent) producing content or assets for loop.fun (repo: `elmariachi111/loopfun`, a Fumadocs/Next.js site; guide pages are MDX under `content/guide/`). Everything you need is in this one file, including the logo SVGs. If a color here ever disagrees with `app/global.css` in the repo, the CSS wins.

**One-line summary:** silver and graphite surfaces, **lobster red as the only brand accent**, hermes blue as the quiet second color, circles and dots as the visual language, and no decoration that doesn't explain something.

---

## 1. Logo

**What it is:** an open loop (a circle with a gap and an arrowhead, going around again) with a single dot in the middle: the agent at the center of its loop.

There are two forms. Copy the SVG source exactly; don't redraw it.

### The mark (monochrome)

Uses `currentColor`, so when inlined in HTML/MDX it takes the surrounding text color. For a standalone file, replace `currentColor` with `#ca301c` (on light backgrounds) or `#f35b44` (on dark backgrounds).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <path d="M16 4a12 12 0 1 1-11.3 8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  <path d="M2.2 8.4 4.7 12l3.9-1.9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="16" cy="16" r="3.2" fill="currentColor"/>
</svg>
```

### The icon tile

Graphite rounded square, red gradient loop, glowing dot. This is the site favicon (`app/icon.svg`). Use it for avatars, social profiles and anywhere a square icon is needed. It works on any background.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="hsl(220, 10%, 19%)" />
      <stop offset="1" stop-color="hsl(220, 9%, 8%)" />
    </linearGradient>
    <linearGradient id="loop" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(10, 92%, 64%)" />
      <stop offset="1" stop-color="hsl(7, 76%, 45%)" />
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="hsl(7, 90%, 58%)" stop-opacity="0.55" />
      <stop offset="1" stop-color="hsl(7, 90%, 58%)" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="64" height="64" rx="15" fill="url(#tile)" />
  <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="14.25" fill="none" stroke="hsl(220, 10%, 100%)" stroke-opacity="0.09" stroke-width="1.5" />
  <circle cx="32" cy="32" r="13" fill="url(#glow)" />
  <g transform="translate(8 8) scale(1.5)" fill="none" stroke="url(#loop)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 4a12 12 0 1 1-11.3 8" />
    <path d="M2.2 8.4 4.7 12l3.9-1.9" />
  </g>
  <circle cx="32" cy="32" r="5" fill="hsl(10, 92%, 66%)" />
  <circle cx="30.6" cy="30.6" r="1.6" fill="#fff" fill-opacity="0.55" />
</svg>
```

**Wordmark:** `loop.fun`, all lowercase, Inter semibold or bold, set to the right of the mark with a gap of about half the mark's width. In running text it's always `loop.fun`, never "Loop.fun" or "LoopFun".

**Rules**
- Minimum size: 16px for the tile, 14px for the bare mark.
- Clear space: at least a quarter of the mark's width on every side.
- One color per mark. Don't recolor it blue, don't add outlines or drop shadows, don't rotate or flip it (the arrow direction is clockwise, on purpose).
- Don't redraw it. Always copy one of the SVGs above.

---

## 2. Color

Two themes. Every color has a light and a dark value; anything you draw must work in both.

### Brand colors

| Token | Light | Dark | Role |
|---|---|---|---|
| `loop-red` / `fd-primary` | `hsl(7 76% 45%)` `#ca301c` | `hsl(8 88% 61%)` `#f35b44` | **The** accent. Links, active state, the loop itself, the one thing to look at. |
| `loop-blue` / `fd-info` | `hsl(212 80% 44%)` `#166aca` | `hsl(212 90% 64%)` `#519ef6` | Secondary. Repetition, outer layers, "secondary reporting", info callouts. |
| `loop-silver` | `hsl(220 8% 70%)` `#acb0b9` | `hsl(220 7% 40%)` `#5f646d` | Neutral rules, inactive strokes. |

### Surfaces and text

| Token | Light | Dark |
|---|---|---|
| `fd-background` | `#e9eaec` (silver) | `#121314` (graphite) |
| `fd-card` | `#f2f3f5` | `#18191b` |
| `fd-foreground` (body text) | `#181b21` | `#dddfe3` |
| `fd-muted-foreground` (captions, hints) | `#585c65` | `#9a9ea7` |
| `fd-accent` (red tint fill) | red at 10% | red at 13% |
| `fd-accent-foreground` (text on red tint) | `#912618` | `#fba193` |
| `fd-border` | gray at 32% alpha | gray at 20% alpha |

### Evidence colors (used only by the `<Evidence>` badge)

| Level | Color |
|---|---|
| primary source | emerald |
| secondary reporting | loop-blue |
| anecdotal | amber |
| contested | loop-red |

### Rules
- **Red is scarce.** One red focal point per figure. If everything is red, nothing is.
- **Blue is never the main subject.** It's the second loop, the outer layer, the background process.
- **No other hues** outside the evidence badges. No purple, no green accents, no gradients except on the icon tile and share cards.
- In code (MDX, components), use the Tailwind tokens (`text-fd-primary`, `stroke-loop-blue`, `bg-fd-card`), never raw hex, so dark mode works automatically. Hex values are for assets outside the site.

---

## 3. Type

| Use | Font | Notes |
|---|---|---|
| Everything by default | **Inter** | Headings bold, body regular. Tight letter-spacing on large titles. |
| Labels, kickers, badges, code | **JetBrains Mono** | Small, UPPERCASE, wide tracking (`tracking-widest`) for labels like "GOAL", "THIS PAGE IS A LIVING DRAFT". |

Sentence case for every heading and title ("What holds loops back", not "What Holds Loops Back").

---

## 4. Shapes and visual language

| Element | Meaning | How it's drawn |
|---|---|---|
| **Circle / ring** | A loop | Thin stroke (1.5–2px), often dashed `5 7` for "repeats" |
| **Dot** | The agent, or one iteration in flight | Solid fill, red; a second, smaller blue dot for a nested/outer loop |
| **Dashed line** | Repetition, or something optional/proposed | Dashed border or stroke, usually blue |
| **Arrowhead** | Direction of flow | Small filled triangle, red, always clockwise on rings |
| **Card** | A grouped idea | `rounded-xl` (12px), 1px `fd-border`, `fd-card` fill, no shadow |
| **Pill / step box** | A step in a cycle or flow | 10px radius, 1.5px border; the highlighted step is filled red with white text |
| **Badge** | Metadata (evidence level) | Fully rounded, 1px border, mono 10.5px uppercase |
| **Left rule** | A quotation | 4px red left border |

**Motion:** only slow rotation (9s and 24s per turn) of dots on rings, and always disabled under `prefers-reduced-motion`. Nothing bounces, nothing fades in.

**Icons:** [Lucide](https://lucide.dev) only, outline style, at the stroke width of the surrounding text. Page and section icons are set by name in frontmatter / `meta.json` (e.g. `icon: Radar`).

**Avoid:** stock photos, illustrations of robots or brains, 3D, emoji in headings, drop shadows, glassmorphism.

---

## 5. Building blocks available in MDX

Prefer these over custom images. They're themed and work in both modes.

| Component | Use for | Example |
|---|---|---|
| `<Cycle steps={[…]} center="…" highlight={i} />` | Any loop of 3–6 steps | `<Cycle steps={['Plan', 'Act', 'Check']} center="until done" />` |
| `<Flow steps={[…]} repeat="…" caption="…" />` | A linear chain, optionally repeating | goal states, pipelines |
| `<Defs items={[[term, meaning], …]} />` | Term → meaning grids | glossaries, data models |
| `<Quote by="…" where="…" href="…">` | Attributed quotations | |
| `<Evidence level="primary\|secondary\|anecdotal\|contested" />` | Inline after a claim | how solid the claim is |
| `<Callout type="warn" title="…">` | Caveats, the one thing to remember | use sparingly |
| `<Cards>` / `<Card title href description />` | Section overviews | |
| `<Steps>` / `<Step>` | Ordered procedures | |
| `<Accordions>` / `<Accordion title>` | Lists of levers or ideas | |
| `<Tabs>` / `<Tab>` | Per-tool variants | |
| Markdown tables | Comparisons | the house style for "who does what" |

If a diagram can't be built from these, draw an inline SVG using the token classes above (see `components/diagrams.tsx` for patterns) rather than shipping a PNG.

---

## 6. Share cards (Open Graph)

Generated automatically for every guide page from its `title` and `description` (`components/og-image.tsx`). You don't make them by hand. To get a good card:

- Keep `title` under ~45 characters (it's set at 58–76px).
- Keep `description` to one or two sentences, ideally under 125 characters; longer ones are cut with "…".
- The section label (e.g. "REMEDIES") comes from the folder's `meta.json` title.

---

## 7. Writing conventions (the short version)

The visual style only works with the matching voice. If you have the repo, read a couple of existing pages under `content/guide/` before writing.

- **Explain concepts, don't document commands.** Readers already know what an agent is.
- **Link every claim** to where it came from, and tag shaky ones with `<Evidence />`. Add new sources to `content/guide/sources.mdx`.
- **No em dashes.** Use a period, colon or parentheses.
- **Short paragraphs, bold the key phrase,** tables for comparisons.
- **Honest about limits.** "We couldn't confirm this" beats a confident guess.
- Every page needs frontmatter `title`, `description` and a Lucide `icon`, and must be listed in its folder's `meta.json`.
