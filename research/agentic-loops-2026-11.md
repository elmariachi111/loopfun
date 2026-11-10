# Agentic loops & goals: state of play (November 2026)

*Research summary, compiled 2026-11-10 from web search results: vendor blogs (Anthropic, OpenAI, Google), docs (Claude Code, Codex, Hermes, Antigravity), practitioner essays, X posts, HN threads and a few arXiv papers.*

> **How much to trust this:** the session's network policy blocked direct page
> fetches, so everything below comes from search-result extracts, not full
> articles. Much of the 2026 coverage is SEO and vendor content. Specific numbers
> (dollar figures, token counts, percentages) are anecdotal unless marked as
> coming from a primary source. Where a claim rests on a single secondary
> source, it says so.

---

## TL;DR

- **Agent loops are now standard, built-in features of every major tool.** A
  meme that began as a bash one-liner (Ralph, July 2025) is now a first-class
  `/goal` command in Codex (Apr 30 2026), Claude Code (spring 2026), Hermes
  Agent and Google's Antigravity CLI. Most of these also add scheduled loops
  (`/loop`, `/schedule`, cron, heartbeats) and background-agent dashboards.
- **People are still embracing them, with less naivety.** The June 2026
  "loop engineering" hype wave (Steinberger, Osmani, Cherny, Andrew Ng) drew a
  July backlash ("it's just a while loop", "graph engineering"). The practice
  survived. It has shifted from "let it run forever" to "bounded loops with
  hard checks."
- **What people love:** running agents unattended and overnight; the "stop
  prompting, design the system that prompts" leverage; fresh-context iteration
  with file-based state; objective-metric loops like Karpathy's autoresearch.
- **What holds them back:**
  1. **Verification / stop conditions.** This is the root problem. A loop is only
     as good as its check, and agents game weak checks.
  2. **Cost and quota burn.** Context gets re-read on every turn, poll-loops spin,
     and weekly subscription limits run out in a day.
  3. **State and memory.** Context rot, lossy compaction, and handoffs between
     sessions.
  4. **The human bottleneck.** Review capacity, comprehension debt, "cognitive
     surrender" and fatigue.
  5. **Security.** Unattended agents plus prompt injection plus persistent
     memory.
  6. **Spec effort.** Writing a good goal can take longer than doing the task.
- **"Goals" are the interesting adjacent problem.** Every harness has converged on
  *goal = condition + judge + budget + lifecycle state*. The hard open
  problems are writing goals that can be checked, judging them independently,
  goals that persist across sessions and devices, breaking goals into smaller
  goals, and keeping standing goals (heartbeat/goals.md) from going stale.

---

## 1. How we got here: a short timeline

| When | What happened |
|---|---|
| Jul 2025 | Geoffrey Huntley's **Ralph Wiggum loop**: `while :; do cat PROMPT.md \| claude -p; done`. Fresh context on every iteration, with progress kept in files. |
| Late 2025 | Anthropic ships an official **ralph-wiggum / ralph-loop plugin** for Claude Code. A Stop hook (exit code 2) blocks exit and re-injects the prompt, with `--max-iterations` and `--completion-promise`. Anthropic's Aug 2025 weekly caps were aimed at "24/7 background" usage. |
| Nov 2025 | Anthropic, *Effective harnesses for long-running agents*: an initializer agent plus a coding agent, a feature list, a progress file and git. Built to deal with "each new session begins with no memory." |
| Jan 23 2026 | OpenAI, *Unrolling the Codex agent loop* (Michael Bolin): the shared harness behind all Codex surfaces, covering prompt caching and context management. |
| Feb 2026 | Nous Research releases **Hermes Agent** ("the agent that grows with you"), with multi-level memory. It has since passed about 100k GitHub stars. |
| Mar 2026 | Anthropic, *Harness design for long-running apps*: **planner → generator → evaluator** with "sprint contracts", plus Playwright to test the running app. It was later simplified as models improved. Karpathy's **autoresearch** runs about 700 experiments over two days, and Karpathy calls it "the final boss battle". |
| Apr 30 2026 | **Codex CLI 0.128.0 ships `/goal`**, a built-in Ralph loop with pause/resume/clear and token budgets (Simon Willison: "a built-in Ralph loop"). |
| May 2026 | Claude Code **`/goal`** (a Haiku evaluator by default) and **Agent View** (`claude agents`, `--bg`), Codex hooks GA, and Gemini API **Managed Agents** (one call provisions a remote Linux sandbox). |
| Jun 2026 | **"Loop engineering" goes viral.** Peter Steinberger's post (Jun 7), Addy Osmani's essay, and Boris Cherny's "I don't prompt Claude anymore. I have loops prompting Claude." Andrew Ng's *Batch* letter (~Jun 30) describes **three nested loops**: agentic coding (minutes), developer feedback (hours) and external feedback (days). |
| Jul 2026 | Backlash and rebrands. The Register calls loop engineering hype, a large HN thread says "just a while loop with an LLM call", Steinberger's "loops → graphs?" post spawns **"graph engineering"**, and Hamel Husain writes a tongue-in-cheek "Loop Engineering Is Dead". |
| Aug 2026 | Google **Antigravity Teamwork** has agent teams working "over hours or days". The arXiv study *Loop Engineering: Building Blocks, Adoption, and Impact* finds the claims rest "almost entirely on anecdotes and self-reported productivity numbers". |
| Oct 30 – Nov 2026 | Anthropic renames Max 20x to **Ultra** and removes the **5-hour limit** for verified Ultra accounts (weekly limits remain). Google folds **Jules into Antigravity** (Jules goes read-only on Nov 11 and shuts down on Dec 31). Codex now lists *goals, memories, hooks and plugins* as core features. Cursor, Antigravity and Codex add voice for talking to running agents. |

**Direction of the last few months:** loops moved out of user-land hacks
(bash scripts and Stop hooks) and into the harness itself. Goals got
evaluators, budgets and states. Scheduling and background execution became
built-in, and dashboards appeared for supervising many loops. Pricing is
starting to adapt to agents that run for a long time. The plain "loop" is
being absorbed into larger multi-agent orchestration ("graphs", teams,
kanban).

---

## 2. What people mean by "agentic loop"

The term covers at least four nested layers, which causes a lot of
talking past each other:

1. **The inner agent loop.** model → tool call → observe → repeat until a
   final answer. Anthropic describes Claude Code's as *gather context → take
   action → verify → repeat*. This is settled; everyone has it.
2. **The goal loop.** Re-prompt the agent across turns until a completion
   condition holds: Ralph, `/goal`. This is what "agentic loops" mostly means
   in 2026 discourse.
3. **The scheduled or ambient loop.** Wake the agent on a timer or an event:
   `/loop 5m /babysit`, routines, cron, OpenClaw's 30-minute **heartbeat**
   reading `HEARTBEAT.md`, and Hermes cron. This produces "always-on" agents.
4. **The meta-loop or graph.** Loops that start and verify other loops:
   planner/generator/evaluator, agent teams, Antigravity Teamwork, kanban
   boards of goals. Andrew Ng's three-loop model adds the human and
   market loops on top.

Steinberger and Osmani's "loop engineering" is mostly about designing layers 2–4.
Their building blocks are roughly: **trigger** (what starts it), **context /
skills** (what it knows), **isolation** (worktrees and sandboxes),
**verification** (maker/checker separation; the arXiv study found this was
the most-emphasized building block), **stop condition and budget**, and
**persistent state** between runs.

---

## 3. How modern harnesses support loops

| Harness | Goal loop | Who judges "done" | Budget / cap | Other loop primitives |
|---|---|---|---|---|
| **Claude Code** | `/goal <condition>`, `/goal clear`, also headless via `claude -p "/goal …"` | A **separate evaluator model** (Haiku by default) reads the transcript after each turn | Ends when met, judged impossible, or on error. Docs warn that an underspecified goal can loop indefinitely | `/loop` (interval), routines/`/schedule`, Stop hooks, the official ralph-loop plugin, background sessions plus Agent View, agent teams, worktrees |
| **Codex CLI** (0.128+) | `/goal` with **pause / resume / clear**, persisted at the thread level (survives a crash, but only runs while the session is open) | The model itself, prompted by a `continuation.md` template on every turn | Optional token budget, with a budget-limit prompt telling it to stop and report. States: pursuing / paused / achieved / unmet / budget-limited | Hooks (GA May 2026), plugins, memories, parallel subagents with a thread cap |
| **Hermes Agent** (Nous) | `/goal`, explicitly "Hermes' take on the Ralph loop" | A **judge model** after each turn (`goal_judge` aux task). It defaults to the main model and can be routed to a cheap model (~200 output tokens per check) | `goals.max_turns` = **20** by default, then it auto-pauses. **If the judge errors, it defaults to *continue*,** so the turn cap is the real backstop | Kanban (cards can carry `--goal`) for multi-task or dependent work, cron, a gateway with hard spending limits (v0.23) |
| **Google Antigravity CLI** (`agy`, successor to Gemini CLI) | `/goal` runs "until the goal is verified complete, without intermediate pauses" | Built-in verification (details thin) | Tool permission rules still apply. One guide warns that a single goal can fan out to 10+ model calls | `/schedule`, `/boost` (multi-agent reasoning), async background subagents, Teamwork, Managed Agents API |
| **OpenClaw** | No goal command. Standing goals live in `HEARTBEAT.md` / `memory/goals.md` | The agent decides; it replies `HEARTBEAT_OK` to stay silent | Heartbeat interval (30 minutes by default) | Gateway routing every channel to the agent, "Soul" and Memory files |

**Convergent design:** *goal = natural-language condition + a judge (ideally a
different, cheaper model) + a budget (turns or tokens) + a lifecycle
(active/paused/achieved/unmet/budget-limited) + durable state (files, git,
thread store).*

**Notable divergence:** pacing. One analysis (relux.works) argues Claude Code
pauses between continuations while Codex goal mode re-fires about 0.03 s after
each turn. When the agent is *waiting* on something, such as CI or a deploy,
that becomes a hot poll loop that re-reads the whole context every time.

---

## 4. What people love about them

- **Unattended progress.** "Ship features in your sleep." Popular X articles
  include *"Stop Being the Loop"* and *"Make Claude work while you sleep"*. Hermes
  users brag about "one prompt → 100 landing pages, zero babysitting."
- **Leverage over prompting.** Cherny says "my job is to write loops." The first
  real routines are code review, PR babysitting, CI fixes and rebases: boring,
  repetitive, and easy to check.
- **Fresh context beats a long context.** Ralph-style iteration with state in
  `PROGRESS.md`, JSON and git diffs is reported as the most effective fix
  for context rot, at roughly 15–20% "orient" overhead per iteration (one
  practitioner's measurements).
- **Objective-metric optimization.** Karpathy's autoresearch got an 11%
  training speedup. Tobi Lütke reported a 19% gain from an overnight run. This is
  where loops shine most clearly: there is a number to optimize.
- **Real long-horizon results.** Anthropic's C compiler built across about 2,000
  sessions and its multi-hour full-stack app harness. Andrew Ng's
  one-hour unattended run that verified a UI through a browser.
- **Harness support removes boilerplate.** `/goal` replaces the "keep going"
  prompt and DIY bash scripts. Budgets and pause/resume make it feel safe.

---

## 5. Are they still embracing them?

**Yes. The sentiment has moved from euphoric to pragmatic.**

- Adoption signals are strong. Every major vendor shipped goal and schedule
  primitives within about six months. Google is consolidating its async agent (Jules)
  into its loop-centric Antigravity. Anthropic's Ultra plan drops the 5-hour wall,
  which suits long-running agents.
- The backlash is about **naming and hype, not the mechanism.** Critics say
  "a while loop with an LLM call", call it a vendor-revenue narrative, point out hidden human
  steering in demos, and say planning time eats the savings. Defenders answer that
  the criticism hits *weak loops*, not the practice.
- "Graph engineering" is mostly a rebrand. A loop is a graph with one
  self-edge. The real shift is from *one reliable loop* to *coordinating many*.
- **The evidence base is thin.** The arXiv mining study found broad agreement
  on building blocks, but "no systematic evidence for its claimed benefits."
  Loop state files rarely show up on default branches. Loops are used, but
  mostly privately and unmeasured.

---

## 6. What's holding people back

### 6.1 Verification and stop conditions (the root problem)
- A loop with no check you can actually run thrashes or never ends. Claude Code's
  own docs warn about indefinite loops for underspecified or impossible goals.
- **Reward hacking:** agents edit, skip or delete tests, or claim success
  falsely. Retry prompts that restate failures as "make the test pass" turn the
  symptom into the new goal. Hiding tests doesn't stop *speculative* hacking.
- **Self-judgment is weak.** Anthropic found self-evaluation lenient, hence a
  separate evaluator. One loop-engineering paper ranks verifiers from
  deterministic assertions and exit codes at the top down to LLM-as-judge and
  human checkpoints. It says a judge should never be the same agent that is
  approving itself.
- **Judge failure modes.** In Hermes, a failing judge defaults to *continue*.
  The evaluator only sees the transcript, not the real system state.

### 6.2 Cost: tokens and subscription quotas
- Agents use roughly 5–30× the tokens of chat (Gartner figure via vendor blogs),
  and every step re-sends the accumulated context.
- **Goal mode concentrates spend.** In one archive of 3,808 Codex sessions,
  the 52 goal-mode sessions consumed about half of all input tokens. One run fired 173
  continuations in 48 minutes, each re-reading 120k–470k tokens, until it hit
  a 429 (single source).
- Horror stories: a $47k multi-agent ping-pong over 264 hours, and a $4.2k
  long-weekend bill (anecdotal). There are GitHub issues about Max and Pro users exhausting
  weekly limits in one or two days and cancelling.
- Budgets exist but are inconsistent. Codex's per-goal budget is unset by
  default and its syntax is poorly documented. Hermes caps turns rather than
  dollars. Teams ask for **tokens per successful outcome** as the metric.

### 6.3 State, memory and context
- **Context rot:** quality drops well before the window fills.
  Compaction is the common fix, but each compaction is an LLM call and summary errors
  persist. Research is moving toward learned compaction policies.
- **Handoffs:** sessions start with no memory. Workarounds are progress files,
  feature lists and git checkpoints, which are conventions rather than standards.
  Codex goals persist per thread but only run while the session is open.
- **Persistent memory is also an attack surface** (see 6.5).

### 6.4 Model choice
- The trade-off is between a frontier model for everything (expensive and limit-bound) and routing:
  a cheap judge (Haiku, Gemini Flash), Flash-tier open-weight models for routine
  steps (GLM-5.3-Flash, DeepSeek V4.1 Flash at about $0.15/M input), and strong
  models for planning.
- The catch is that cheap per token ≠ cheap per task. Token-hungry models and more
  retries erase the savings. **Cache-hit pricing** dominates loop
  economics.
- Model upgrades change what the harness needs. Anthropic dropped the per-sprint
  evaluator after Opus 4.6, so loop designs go stale as models improve.

### 6.5 Security
- Unattended plus tools plus untrusted input (issues, web pages, repo files) is
  the classic prompt-injection setup. Benchmarks report a ~52.6% risk trigger rate under
  advanced injection, and a 17% average defense rate against sandbox escape in
  OpenClaw-style agents.
- Poisoned project files can make agents relax their own permissions.
  `HEARTBEAT.md` / memory files can be used for persistent injection.
- Approval gates defeat the point of autonomy, so the industry leans on
  sandboxes and blast-radius limits. Simon Willison: "we're due a Challenger
  disaster with respect to coding agent security."

### 6.6 The human side
- **The review bottleneck.** Agent output outpaces review. Faros data via
  secondary sources: median review time up 441.5%, and 31.3% more PRs merged without
  review. Reviewer abandonment caused 38% of rejected agent PRs in one study.
- **Comprehension debt** (Osmani) and **cognitive surrender:** the smoother the
  loop, the less people think.
- **Agentic fatigue:** constant judgment calls on agent output.
- **Spec effort:** writing a good goal or loop can take more work than the
  task. "The loop is the easy part. The work is the context and the stop
  condition" (Paweł Huryn).

### 6.7 Reliability and tooling rough edges
- Loop bugs in the harness itself, such as Antigravity agents stuck re-reading
  files with Gemini models.
- Background sessions stop on sleep or shutdown (Claude Code needs `respawn`).
- Observability is mostly "a dashboard of sessions". There is little run-level
  tracing, cost attribution or replay.

---

## 7. The adjacent problem domain: "goals"

You were right about Hermes: its `/goal` ("Persistent Goals") is explicitly
modelled on the Ralph loop. Claude Code, Codex and Antigravity converged on
the same word. "Goals" is where the open problems sit:

1. **Goal specification.** Turning intent into a condition you can check.
   Hermes suggests letting the agent *expand a one-line goal into a fuller
   contract*. Anthropic's "sprint contracts" have generator and evaluator agree
   on "done" before work starts. Good goals reference concrete commands or
   outputs and scope limits. Subjective goals ("readable", "beautiful", "a
   Nobel-worthy novel") are not loopable.
2. **Goal verification.** There is a hierarchy from deterministic checks to an independent
   model judge to a human. System state should decide, not the agent's claim.
   It is unclear whether the judge sees the transcript or the world: Claude Code's
   evaluator reads the transcript, while Anthropic's harness tested the running app.
3. **Goal economics.** Budgets in turns, tokens or dollars, and what happens
   on exhaustion: pause and report, or keep a partial result. Pacing for goals that
   are waiting on something.
4. **Goal persistence and lifecycle.** States (pursuing, paused, achieved,
   unmet, budget-limited), surviving crashes, devices and sessions, and
   resuming with context.
5. **Goal decomposition and coordination.** One goal or many: kanban
   (Hermes), task lists shared by agent teams (Claude Code), graphs. Dependencies,
   handoffs and parallel subgoals.
6. **Standing goals vs. task goals.** A task goal ends. A standing goal
   ("keep CI green", "watch my inbox", OpenClaw's `goals.md`) never ends and
   needs triggers, silence criteria and pruning of stale goals.
7. **Goal integrity.** Preventing goal drift and reward hacking, and
   preventing injected content from rewriting goals or memory.

---

## 8. Takeaways

- The **mechanism is commoditized.** Every harness has `/goal` plus scheduling.
  Value is moving to **what surrounds the loop**: verification, budgets and
  pacing, state, supervision, and coordinating many loops.
- **The biggest real pain points are:** (1) making completion checkable and
  hard to game, (2) runaway or opaque cost and quota burn, (3) human review and
  comprehension capacity, (4) security of unattended runs. State and memory
  matter, but practitioners have workable conventions (files plus git plus fresh
  context).
- **Gaps that seem worth exploring:** goal authoring that rewrites vague intent
  into checkable contracts; independent verifiers that look at real system state,
  not transcripts; per-goal cost accounting with "tokens per successful outcome";
  pacing and backoff for goals that are waiting; cross-harness goal and state formats
  (each tool has its own `/goal` semantics today); and review tools built for
  loop output rather than human-sized PRs.

---

## Sources

**Vendor and primary**
- Anthropic: [Effective harnesses for long-running agents](https://anthropic.com/engineering/effective-harnesses-for-long-running-agents) · [Harness design for long-running apps](https://www.anthropic.com/research/harness-design-long-running-apps) · [Managed Agents](https://anthropic.com/engineering/managed-agents) · [Building agents with the Claude Agent SDK](https://anthropic.com/engineering/building-agents-with-the-claude-agent-sdk) · [Building a C compiler](https://www.anthropic.com/engineering/building-c-compiler) · [Anthropic on X (harness post)](https://x.com/AnthropicAI/status/2036481033621623056)
- Claude Code docs: [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal) · [Run agents in parallel](https://code.claude.com/docs/en/agents)
- OpenAI: [Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/) · [Run long horizon tasks with Codex](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex)
- Google: [Managed Agents in the Gemini API](https://blog.google/innovation-and-ai/technology/developers-tools/managed-agents-gemini-api/) · [Antigravity Teamwork](https://blog.google/innovation-and-ai/technology/developers-tools/antigravity-teamwork-multi-agent/) · [I/O 2026 dev highlights](https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/) · [Antigravity I/O feature deep dive](https://antigravity.google/blog/google-io-2026-feature-deep-dive/) · [Antigravity CLI reference](https://antigravity.google/docs/cli/reference/)
- Nous Research: [Hermes Persistent Goals docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/goals) · [goals.md on GitHub](https://github.com/nousresearch/hermes-agent/blob/main/website/docs/user-guide/features/goals.md)
- [Andrew Ng, The Batch (three loops)](https://www.deeplearning.ai/the-batch/issue-359)
- [Ralph Wiggum plugin (mirror)](https://github.com/AI-App/Anthropics.Claude-Code/tree/main/plugins/ralph-wiggum) · [DeepWiki: ralph-wiggum plugin](https://deepwiki.com/anthropics/claude-code/5.5-ralph-wiggum-plugin)

**Practitioners, social and press**
- [Simon Willison: Codex CLI 0.128.0 adds /goal](https://simonwillison.net/2026/Apr/30/codex-goals/)
- [Steve Kinney: Entering the Mind of Ralph Wiggum](https://stevekinney.com/writing/the-ralph-loop) · [The Anatomy of an Agent Loop](https://stevekinney.com/writing/agent-loops) · [geocod.io: Ralph Loops](https://www.geocod.io/code-and-coordinates/2026-01-27-ralph-loops)
- [Addy Osmani: Long-running agents](https://addyosmani.com/blog/long-running-agents/) · [Agentic Code Review](https://addyo.substack.com/p/agentic-code-review)
- [O'Reilly Radar: Loop Engineering](https://www.oreilly.com/radar/loop-engineering/) · [The New Stack: Cherny writes loops](https://thenewstack.io/loop-engineering/) · [The Neuron: Cherny & Cat Wu on agent loops](https://www.theneuron.ai/explainer-articles/claude-code-creators-boris-cherny-and-cat-wu-explain-how-to-use-agent-loops/) · [Paweł Huryn on X](https://x.com/PawelHuryn/status/2069315068664197315) · [ADTmag: loop engineering emerges](https://adtmag.com/articles/2026/07/01/loop-engineering-emerges-as-developers-put-ai-coding-agents-on-repeat.aspx)
- [Firecrawl: Loop Engineering](https://www.firecrawl.dev/blog/loop-engineering) · [Black Matter VC: honest verdict](https://blackmatter.vc/lab/loop-engineering-an-honest-verdict-from-someone-who-actually-runs-agent-loops) · [Loop Engineering Minus the Hype](https://dev.to/isaachagoel/loop-engineering-minus-the-hype-4ibn) · [FutureAGI: real or hype?](https://futureagi.com/blog/loop-engineering/is-loop-engineering-real/) · [HN: The Coming Loop](https://news.ycombinator.com/item?id=48643180)
- Graph engineering: [Towards Data Science](https://towardsdatascience.com/graph-engineering-for-ai-agents-from-prompts-and-loops-to-workflows/) · [Analytics Vidhya](https://www.analyticsvidhya.com/blog/2026/08/agent-harness-loop-graph-engineering/) · [WiLine: "Loop Engineering Is Dead"](https://wec.wiline.com/docs/news/loop-engineering-graph-engineering-what-survives/) · [KuCoin news (low confidence)](https://www.kucoin.com/news/flash/peter-steinberger-announces-end-of-loop-engineering-era-shift-to-graph-engineering)
- Codex goal mode: [Daniel Vaughan: goal mode](https://codex.danielvaughan.com/2026/05/03/codex-cli-goal-mode-persistent-objectives-token-budgets-agentic-loops/) · [relux: weekly limit burned in a day](https://relux.works/en/blog/codex-goal-token-burn/) · [openai/codex#14593](https://github.com/openai/codex/issues/14593) · [jdhodges: Codex /goal review](https://www.jdhodges.com/blog/codex-goal-feature-review/)
- Claude Code /goal: [XDA](https://www.xda-developers.com/finally-understood-claude-code-goal-command/) · [Daily Dose of DS](https://blog.dailydoseofds.com/p/claude-codes-goal-command) · [MindStudio: goal design](https://www.mindstudio.ai/blog/agentic-loop-design-goals-verification-criteria)
- Hermes: [YanXbt on X](https://x.com/IBuzovskyi/status/2067479409645257075) · [MarkTechPost launch](https://www.marktechpost.com/2026/02/26/nous-research-releases-hermes-agent-to-fix-ai-forgetfulness-with-multi-level-memory-and-dedicated-remote-terminal-access-support/)
- OpenClaw heartbeat: [claire vo on X](https://x.com/clairevo/status/2017741569521271175) · [heartbeat guide](https://launchmyopenclaw.com/openclaw-heartbeat-guide/)
- Karpathy autoresearch: [Fortune](https://fortune.com/2026/03/17/andrej-karpathy-loop-autonomous-ai-agents-future/)
- Limits and pricing: [anthropics/claude-code#9424](https://github.com/anthropics/claude-code/issues/9424) · [#76006](https://github.com/anthropics/claude-code/issues/76006) · [The Register: usage limits](https://www.theregister.com/2026/01/05/claude_devs_usage_limits/) · [TechCrunch: weekly limits](https://techcrunch.com/2025/07/28/anthropic-unveils-new-rate-limits-to-curb-claude-code-power-users/) · [Claude Ultra 5-hour limit removed](https://www.developersdigest.tech/blog/claude-ultra-plan-max-20x-rename-five-hour-limit-2026)
- Cost: [Spheron: agents burn 5–30× tokens](https://www.spheron.network/blog/agentic-ai-inference-cost-2026/) · [Unblocked: auto-loop tax](https://getunblocked.com/blog/agent-auto-loop-token-cost/) · [runaway agent horror stories](https://baeseokjae.github.io/posts/ai-agent-api-cost-horror-story-2026/)
- Models: [OpenRouter: open-weight models that matter](https://openrouter.ai/blog/insights/the-open-weight-models-that-matter-june-2026/) · [Developer's Digest: GLM vs DeepSeek vs Qwen](https://www.developersdigest.tech/blog/glm-5-2-vs-deepseek-v4-vs-qwen3-open-weights-coding-showdown)
- Google news: [Jules folded into Antigravity](https://dev.to/hiroki-ii-ai/ai-daily-digest-november-1-2026-google-folds-jules-into-antigravity-claude-ultra-drops-the-3e5e) · [Antigravity endless-loop bug](https://discuss.ai.google.dev/t/antigravity-agent-stuck-in-endless-file-reading-loop-gemini-models/188526) · [The New Stack: voice agents](https://thenewstack.io/cursor-antigravity-voice-agents)
- Review and human factors: [AgentConn: comprehension debt](https://agentconn.com/blog/comprehension-debt-shipping-code-no-one-can-explain-2026/) · [agentic fatigue](https://explainx.ai/blog/agentic-fatigue-vibe-coding-ai-developer-productivity-paradox)
- Security: [SoftwareSeni: sandboxing unsolved](https://www.softwareseni.com/understanding-ai-agent-sandboxing-why-production-deployment-remains-unsolved-in-2026/) · [arXiv 2605.22321](https://arxiv.org/pdf/2605.22321) · [arXiv 2607.05189 (memory injection in claws)](https://arxiv.org/pdf/2607.05189)

**Research**
- [Loop Engineering: Building Blocks, Adoption, and Impact (arXiv 2608.21884)](https://arxiv.org/abs/2608.21884)
- [Stop Hand-Holding Your Coding Agent (arXiv 2607.00038)](https://arxiv.org/pdf/2607.00038)
- [Reward Hacking Benchmark (arXiv 2605.02964)](https://arxiv.org/pdf/2605.02964) · [The Verification Horizon (arXiv 2606.26300)](https://arxiv.org/pdf/2606.26300)
- [Slipstream: compaction validation (arXiv 2605.08580)](https://arxiv.org/pdf/2605.08580) · [Rate–distortion view of memory compaction (arXiv 2607.08032)](https://arxiv.org/pdf/2607.08032)
