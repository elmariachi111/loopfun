# Where loops live: the agent runtime landscape (Nov 2026)

Working research for a new loop.fun section on **hosting long-running agent loops and standing goals**. This is the landscape pass. It is meant to help us pick what to research in depth, not to be published as is.

Scope: platforms that let you set up a cloud (or self-hosted) harness, give it a goal and a way to talk to it, and leave it running. The focus is the newest hosts that *look* always-on but actually suspend and resume the process underneath (Firecracker and other microVMs, gVisor checkpoints, actor hibernation).

Evidence tags as on the site: **[P]** primary (vendor docs or official blog), **[S]** secondary reporting, **[A]** anecdotal or vendor marketing, **[C]** contested or conflicting sources. Prices change often and many figures come from third-party comparisons. Treat every number as "check before quoting".

---

## 1. The core idea: fake always-on

A standing goal is mostly waiting: for the next heartbeat, a CI run, a reply, a webhook. Paying for a whole machine while it waits is the main waste the new hosts go after. They take one of three approaches, plus a hybrid.

| Approach | What sleeps | What survives | Wake trigger | Runs an unmodified harness? | Examples |
|---|---|---|---|---|---|
| **Snapshot the machine** | A microVM or gVisor sandbox, frozen with RAM and disk | Memory, processes, files. **Open network connections do not survive.** | Inbound request, API call, schedule | **Yes**, any Linux CLI (Claude Code, Codex, Hermes, OpenClaw…) | Fly Sprites, E2B, Blaxel, Morph, Unikraft, Agent Substrate, GKE Pod Snapshots |
| **Hibernate the actor** | A tiny addressable object (an isolate plus SQLite) | Its storage, schedules, checkpoints. In-memory variables and timers are lost. | Request, alarm, WebSocket message | **No.** You write the agent for the platform (TS) | Cloudflare Durable Objects / Agents SDK / Project Think |
| **Suspend the workflow** | Nothing runs. Progress lives as a checkpoint log | Completed steps (replayed, not re-run) | Timer (up to a year), callback, event | **No.** The loop becomes workflow code | Lambda durable functions, Temporal, Restate, Inngest, DBOS, Cloudflare Workflows, Vercel Workflow |
| **Split brain and hands** (hybrid) | The sandbox hibernates. The harness or session log lives somewhere cheap | The session log, kept outside both | Harness decides | Partly | Claude Managed Agents, Hermes terminal backends, Project Think's execution ladder |

This frame drives the rest of the report. **The approach matters more than the vendor.** It decides which harnesses run unchanged, what breaks on resume, and what idle time costs.

> Google's own Agent Substrate docs spell out the main catch for snapshot hosts: "open network connections (such as database sessions or connections to MCP servers) aren't preserved," so agents must reconnect after resume. [P]
> ([GKE: About Agent Substrate](https://docs.cloud.google.com/kubernetes-engine/ai-ml/about-agent-substrate))

---

## 2. Solution landscape

### A. Kubernetes-native (self-hosted or GKE)

| Project | What it is | Loop-relevant details | Status |
|---|---|---|---|
| **[kagent](https://kagent.dev/)** (Solo.io → CNCF Sandbox) | Agents, models and tools as Kubernetes CRDs: `Agent`, `SandboxAgent`, `AgentHarness`, `ModelConfig`, MCP server refs. Agents are exposed over **A2A** (`/.well-known/agent.json`) and as **MCP** servers. | **`AgentHarness` CRD with `backend: openclaw` or `hermes`**: it runs full harnesses on Agent Substrate and reaches them over **ACP via WebSocket** through an in-sandbox `acp-shim`. Slack, Discord and Telegram channel config is built in. Declarative runtimes: Go ADK (≈2 s start, default), Python ADK (≈15 s, with ADK, LangGraph and CrewAI integrations), and BYO containers. [P] | kagent 1.0 supersedes 0.10.x. Its blog says it is "mov[ing] away from our current Deployment-based runtime to fully embrace Agent Substrate." The new API is still a proposal with breaking changes expected. [P] ([future of kagent](https://kagent.dev/blog/the-future-of-kagent), [Substrate concept](https://kagent.dev/docs/kagent/concepts/agent-substrate/)). Thoughtworks Radar: introduce "with care" given the risk of giving LLMs ops capabilities. [S] ([Radar](https://www.thoughtworks.com/radar/languages-and-frameworks/kagent)) |
| **[Agent Substrate](https://docs.cloud.google.com/kubernetes-engine/ai-ml/about-agent-substrate)** (Google, open source) | A runtime that packs many stateful agents onto few pods. **Actors** (agent instances) run on **Workers** taken from a pre-warmed **WorkerPool**. Idle actors are snapshotted (RAM and local files, zstd, to GCS/S3) and restored on demand. It has its own control plane (`ateapi`, gRPC plus Redis), an L7 router (`atenet`, Envoy), and a per-node snapshot agent. | Restore "in under a second" (Google) [P]. kagent's blog claims sub-100 ms [C]. Solo's demo: **~250 stateful agent sessions on 8 pods, ~30× oversubscription** [A]. Isolation is gVisor or Cloud Hypervisor. **No GPU**: gVisor "can't snapshot live CUDA contexts." Wake happens per request: each request names its target actor. No built-in cron found. | Announced at Google I/O, May 2026 (v0.0.0 tagged May 19). Supported on GKE Standard ≥1.37, and runs on kind for development. CNCF status: kagent says both are CNCF Sandbox projects, Solo says only kagent is [C]. License unconfirmed. ([Solo explainer](https://www.solo.io/topics/ai-infrastructure/how-google-agent-substrate-works)) |
| **[Agent Sandbox](https://github.com/kubernetes-sigs/agent-sandbox)** (kubernetes-sigs, SIG Apps) | A `Sandbox` CRD: one stateful, singleton, isolated pod per agent, with gVisor, Kata or any RuntimeClass, plus warm pools. | One benchmark: a warm gVisor claim takes ~0.5 s vs ~11 s cold [S]. Suspend and resume through GKE **Pod Snapshots** (gVisor only, not microVMs). The Python SDK path came first [P]. Upstream docs advertise "pause… resume automatically on network activity." An earlier Northflank post said no pause/resume existed [C], so the feature probably landed in 2026. | GKE Agent Sandbox GA May 20, 2026 [P] ([Google blog](https://cloud.google.com/blog/products/containers-kubernetes/bringing-you-agent-sandbox-on-gke-and-agent-substrate), [k8s blog](https://kubernetes.io/blog/2026/03/20/running-agents-on-kubernetes-with-agent-sandbox)). Pod Snapshots GA status unclear [C]. |
| **Plain k8s + RuntimeClass** | Kata, Firecracker (via firecracker-containerd/Kata) or gVisor under a normal Deployment or StatefulSet | Always-on by default. You build scale-to-zero yourself (KEDA, Knative). | Mature |
| **[OpenSandbox](https://northflank.com/blog/opensandbox-alternatives)** (Alibaba) | Self-hosted sandbox platform over gVisor, Kata or Firecracker | Self-host alternative to E2B | Apache-2.0, March 2026 [S] |

**Takeaway:** Kubernetes is splitting into two layers. **Agent Sandbox** is the "one isolated pod per agent" primitive. **Agent Substrate** is the "many agents, few pods, snapshot when idle" scheduler. kagent is turning into the declarative front end on top. It is the only project here with first-class `AgentHarness` support for **OpenClaw and Hermes**.

### B. Edge actor platforms (Cloudflare)

| Building block | Role in a loop | Details |
|---|---|---|
| **Agents SDK on Durable Objects** | The agent *is* a globally addressable object with SQLite, schedules and alarms | Hibernates after about 2 minutes idle and wakes on a request or alarm. State, SQL, schedules and fiber checkpoints survive. In-memory variables and `setTimeout` do not [P] ([long-running agents](https://developers.cloudflare.com/agents/concepts/long-running-agents/)). **Hibernatable WebSockets** keep client connections open without billing duration [P]. |
| **Project Think** (Apr 2026) | Durable "fibers" (checkpointed invocations), sub-agents, persistent sessions, an execution ladder from in-isolate code up to a full sandbox | `keepAlive` is meant for minutes, not hours. Multi-hour work should persist a job ID, hibernate and wake on callback [S] ([blog](https://blog.cloudflare.com/project-think/)). Vendor example: 10,000 agents at 1% activity means about 100 live objects instead of 10,000 containers [A]. |
| **Sandbox SDK / Containers** | A real Linux container for git, npm and builds | `sleepAfter` defaults to 10 min. `keepAlive` sends heartbeats every 30 s. **Sleep loses the disk overlay**: you back up `/workspace` to R2 and restore it on wake. Backups default to a 3-day TTL. No memory snapshot [P] ([backup/restore](https://developers.cloudflare.com/sandbox/concepts/backup-restore/), [options](https://developers.cloudflare.com/sandbox/sdk/configuration/sandbox-options/)). |
| **Workflows v2, AI Gateway, MCP portals** | Durable steps, model egress, tool egress | See `remedies/control-plane.mdx` |
| **[Moltworker](https://github.com/cloudflare/moltworker)** | OpenClaw packaged into a Sandbox container, with R2, AI Gateway and Access | Labelled an experiment or proof of concept. Needs Workers Paid ($5/mo). One estimate puts always-on at ~$35/mo [S/A]. |

Pricing anchor: Durable Objects bill $12.50 per million GB-s of *non-hibernating* wall time and $0.15 per million requests. An idle object that is eligible for hibernation costs nothing for duration [P] ([pricing](https://developers.cloudflare.com/durable-objects/platform/pricing)).

**Takeaway:** this is the cheapest idle on the market, but you only get it if you write the agent the Cloudflare way. Running an existing CLI harness pushes you onto Containers, which today have **no memory snapshot**, so it looks more like "restart from a disk backup" than true hibernation.

### C. Hyperscaler agent runtimes

| Platform | Isolation / lifecycle | Limits | Billing |
|---|---|---|---|
| **AWS Bedrock AgentCore Runtime** | **A microVM per session**, framework-agnostic (any container: Strands, LangGraph, Claude Agent SDK…) | Sessions up to **8 h**. Idle timeout 15 min by default, configurable up to 8 h. The microVM is destroyed and memory sanitized at the end [P] ([docs](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html)). Newer **runtime instances** (EC2-backed) allow sessions of up to **14 days** with a management fee on top of EC2 [S]. | Per second, CPU and memory. "I/O wait and idle time is free" for CPU, but memory still bills [P]. Rates conflict across sources ($0.0895 vs $0.1276 per vCPU-h) [C]. Watch the NAT gateway [S]. |
| **AWS Lambda durable functions** (Dec 2025) | Checkpoint and replay inside Lambda. `wait` suspends with **no compute charge for up to one year**. Callbacks wait for external input. | Deterministic-replay rules apply | Per durable operation plus storage [P] ([announcement](https://aws.amazon.com/about-aws/whats-new/2025/12/lambda-durable-multi-step-applications-ai-workflows)) |
| **Google Vertex Agent Engine** (now under the Gemini Enterprise Agent Platform name [S]) | Managed agent runtime (ADK-first) | n/a | ~$0.0864 per vCPU-h and $0.009 per GB-h, idle between turns not billed. Rates were cut in Dec 2025 [S/C]. |
| **Gemini API Managed Agents** (I/O 2026) | A remote Linux environment per agent | Goes idle after 15 min and is **deleted after 7 days inactive** [S] | Environment compute free during preview, tokens billed [P] ([docs](https://ai.google.dev/gemini-api/docs/agents)) |
| **Azure Foundry hosted agents** | microVM isolation. GA reported June 2026 | An early 15 min limit, with work underway for longer runs [S] | n/a |
| **Azure Container Apps Sandboxes / dynamic sessions** | Hyper-V isolated sessions. The new Sandboxes type has **built-in suspend and resume** (GA Sept 2026) [S] | Dynamic sessions still in preview [P] | n/a |

**Takeaway:** the hyperscalers sell *sessions*, not standing processes. AgentCore's 8-hour cap and Gemini's 7-day deletion both clash with an always-on standing goal, so the goal state has to live outside the runtime and the session gets rebuilt on each wake. AWS's two newest products show both directions: Lambda durable functions (suspend the workflow, waits are free) and EC2-backed runtime instances (just keep the box for 14 days).

### D. Model-vendor managed agents

| Offering | Model | Billing / limits |
|---|---|---|
| **Claude Managed Agents** (public beta Apr 2026) | Splits the **session log**, the **harness** and the **sandbox**, so a crashed harness loses nothing ([engineering post](https://anthropic.com/engineering/managed-agents)). Third-party guides describe self-hosted sandboxes and MCP tunnels [S]. | Tokens plus **$0.08 per active session-hour**. Idle time waiting for a message or tool confirmation is not billed. Sandbox included [S]. That is about $58/mo for a fully active agent before tokens. |
| **Claude Code on the web + routines** | Vendor-hosted Claude Code sessions in isolated cloud environments (network policy, setup script, env vars). Routines fire on a schedule, on API calls or on GitHub events [P] ([routines](https://code.claude.com/docs/en/routines.md)) | Subscription limits |
| **Claude Duet** (research preview, Oct 21, 2026) | A proactive agent on a cloud machine that keeps working after you close the app and asks before sending, paying, signing or deleting [P] ([blog](https://claude.com/blog/claude-duet)) | Included in Pro/Max limits, US waitlist. **Not self-hostable.** It is the consumer version of what this section teaches you to build. |
| **OpenAI Codex cloud** | Ephemeral containers per task with setup and maintenance scripts, cached containers and an egress proxy [S]. OpenAI acquired Ona (ex-Gitpod) for persistent cloud environments, announced but not shipped as of mid-2026 [S]. | Plan limits |
| **Agents SDK (OpenAI)** | Sandbox-aware orchestration and hosted shell (already on the site) | n/a |

### E. MicroVM sandbox clouds with hibernation (the bleeding edge)

The core of what you asked about. All of them run a full Linux box, so any CLI harness fits. They differ in **what survives sleep**, **how fast it wakes**, **how long it may sleep** and **runtime caps**.

| Host | Tech | Sleep / wake | Memory survives? | Retention / caps | Price anchors |
|---|---|---|---|---|---|
| **[Fly.io Sprites](https://fly.io/sprites)** (Jan 2026) | Firecracker | Hibernates after ~30 s idle. Checkpoint ~300 ms (Fly) or ~1 s (third party) [C]. Restore survives reboots [P]. | Yes, via checkpoint | Persistent and positioned as "a computer for the agent". Explicit "YOLO mode" marketing. | $0.0385/CPU-h + $0.021875/GB-h, **or** double that, depending on the Fly page [C]. Cold storage $0.000027/GB-h ([billing](https://docs.sprites.dev/reference/billing)) |
| **[E2B](https://e2b.dev)** | Firecracker | Pause about 4 s per GiB of RAM, resume ~1 s [S] | Yes (or a filesystem-only pause) | **Paused sandboxes have no TTL.** Continuous runtime cap 1 h (Hobby) / 24 h (Pro), reset by pause/resume [S] | Pro $150/mo plus usage, no compute while paused [S]. Infra is open source (`e2b-dev/infra`, Terraform, Nomad) for self-hosting [S]. |
| **[Blaxel](https://blaxel.ai)** | microVM | Standby after 5 s or 15 s idle [C]. **~25 ms resume "even after weeks"** [A] | Yes | Standby indefinite on higher tiers, TTL on Starter | No compute in standby, storage billed [A] |
| **[Morph Cloud](https://cloud.morph.so)** | Infinibranch (custom VM stack) | Snapshot, branch or restore in <250 ms [A] | Yes | Scale-to-zero devboxes | **Branching**: one snapshot fans out to N parallel agents ("git for compute") |
| **[Unikraft Cloud](https://unikraft.com)** | Unikernel microVMs | Scale to zero in <10 ms, stateful wake ~10 ms. "100K+ scale-to-zero agents in a server" [A] | Yes | n/a | n/a |
| **[Vercel Sandbox](https://vercel.com/sandbox)** (GA Jan 30, 2026) | Firecracker | Auto-snapshot on stop, auto-resume on next call [S] | Filesystem only by default [S] | 45 min (Hobby) / 24 h (Pro) [S] | **Active CPU** $0.128/h (iad1), CPU not billed during I/O wait [P] ([pricing](https://vercel.com/docs/sandbox/pricing)). Pairs with the **Workflow DevKit** for durable orchestration. |
| **[Modal](https://modal.com)** | gVisor | Memory snapshots in early preview [S] | Preview only. Kept 7 days, same instance type, no GPU [S] | 24 h sandbox cap [S] | Hermes has a native Modal backend |
| **[Daytona](https://daytona.io)** | Containers by default, VM classes for memory pause/fork | Hibernates idle, wakes on demand | VM classes only [C] | State kept hours to days | Reported move to closed source, June 2026 [C]. Native Hermes backend. |
| **[Docker Sandboxes](https://www.docker.com/blog/docker-sandboxes-run-claude-code-and-other-coding-agents-unsupervised-but-safely/)** (`sbx`) | Local microVM with its own kernel, Docker-in-sandbox | Local, not a cloud host | n/a | Whitelisted agents only. Custom "kits" are early access [S] | Free, local. The **self-hosted laptop/server** answer. |
| **Microsandbox** | libkrun/KVM | Self-hosted | n/a | n/a | Apache-2.0 [S] |
| Also worth a look | Northflank (Kata/gVisor, BYOC), CodeSandbox SDK (Firecracker hibernate), Runloop, Koyeb | | | | Not researched yet |

**Takeaway:** "memory survives a long sleep" is the line between true hibernation and a restart from disk. Today the hosts that **claim** a long memory-preserving sleep are Sprites, E2B, Blaxel, Morph and Unikraft (and Substrate on k8s). Vercel, Cloudflare Containers and Modal (outside its preview) mostly restore the **disk**, not the process.

### F. Durable execution (suspend the program instead of the box)

Temporal, Restate, Inngest, DBOS, Lambda durable functions, Cloudflare Workflows and Vercel Workflow. The site's control-plane page already covers them. For this section, the point to make is that **durable execution and snapshot hosts are complementary**: the workflow owns goal state, waits and retries, and the sandbox is a disposable, hibernating set of hands.

---

## 3. Which harnesses run where

### What makes a harness hibernation-friendly

1. **Headless entrypoint** (`claude -p`, `codex exec`, `kimi -p`, an HTTP server, ACP over stdio).
2. **State on disk, not only in RAM** (goal, memory, session). Without this you depend on memory snapshots.
3. **Inbound by push** (webhook, HTTP, ACP, A2A), not by held connections. Telegram long-polling, the Discord gateway WebSocket, Slack Socket Mode, stdio MCP children and DB sessions all **break on snapshot** or keep the box awake.
4. **Timers outside the process.** An in-process heartbeat (OpenClaw's 30-min `HEARTBEAT.md` loop, Hermes cron) keeps the VM from ever sleeping unless an external scheduler (an alarm, a routine, k8s CronJob, a Substrate request) wakes it.
5. **Tolerant of version freeze.** A snapshot pins the harness version. Self-updating CLIs drift between instances restored from different snapshots.

### Matrix (first pass)

| Harness | Headless / protocol | Native cloud paths found | Fits snapshot hosts? | Notes |
|---|---|---|---|---|
| **Claude Code** / Agent SDK | `claude -p`, Agent SDK, `/goal`, routines | Claude Code on the web + routines, Managed Agents (API), Docker Sandboxes, Agent SDK hosting guide (Modal, Cloudflare, Daytona, Vercel, E2B…) [P] ([hosting](https://code.claude.com/docs/en/agent-sdk/hosting)) | **Yes** | Hosting guide puts the container floor at ~5¢/h and says tokens dominate [P]. Not a native kagent `AgentHarness` backend. Solo says the Substrate README lists Claude Code [A]. |
| **Codex CLI** | `codex exec`, goal persisted per thread | Codex cloud, Docker Sandboxes | **Yes** | Thread store on disk means goals survive restarts. Fast continuation re-fire is a waste when waiting (already on the site). |
| **Hermes Agent** | CLI plus **gateway** (Telegram, Slack…), `/goal`, kanban, cron | **kagent `AgentHarness` backend** [P]. Native **terminal backends**: local, docker, ssh, singularity, **modal**, **daytona** (Vercel Sandbox removed in v0.15) [S] | **Yes, best as split brain and hands** | The gateway holds connections, so keep it on a small always-on box (or use webhooks) and let the terminal sandbox hibernate. The Modal backend loses local state after ~5 min idle without extra setup [S]. Modal/Daytona skip the dangerous-command check because the sandbox is the boundary [S]. |
| **OpenClaw** | Gateway plus heartbeat | **kagent `AgentHarness` backend** [P], Cloudflare **Moltworker** (experimental), **Fly.io blueprint**, KiloClaw hosting "thousands of claws" on Fly [P] ([Fly story](https://fly.io/customer-stories/kiloclaw/)) | **Partly** | Fly reports OpenClaw "is more stable" on an always-on machine [P], which runs against hibernation. The heartbeat would have to move out of the process. |
| **Kimi Code CLI** (Moonshot) | `kimi -p` headless, **ACP over stdio** [S] | None native | **Yes** | ACP is exactly what kagent's `acp-shim` speaks, so it is the most plausible next `AgentHarness` backend (our inference). Headless login is a copy-the-URL OAuth flow, so prefer an API key [S]. Replaced the older Python `kimi-cli`. |
| **DeepSeek Harness** (official, MIT, Aug 2026) / **DeepSeek-TUI** (community, Rust) | Plugin-based loop, swappable model adapter [S] | None native. There is also a desktop-app preview [S]. | **Yes** (CPU side) | Self-hosting open-weight DeepSeek models needs GPUs, and **GPU state can't be snapshotted** (Substrate, Modal). Keep model serving separate from the hibernating harness. |
| **OpenCode, Gemini CLI, Copilot CLI, Kiro, Docker Agent (ex-cagent)** | Headless modes | Docker Sandboxes lists most of them [S] | Yes | Not researched further |
| **Prime Agent** (Prime Intellect, MIT, Aug 2026) | "Self-improving" long-running harness [S] | n/a | Probably | Candidate |
| **Claude Duet** | n/a | Vendor-hosted only | n/a | Reference point for the end-user experience |
| **"dot"** | ? | ? | ? | **Couldn't identify.** Need the exact project or URL. |

---

## 4. Economics: where fake always-on wins, and where it doesn't

### A worked example (illustrative arithmetic, not a benchmark)

A standing goal on a 1 vCPU / 2 GB box wakes **48×/day** (every 30 min, OpenClaw's default heartbeat) and is busy **90 s** per wake. That is about **36 h of activity a month (5% duty cycle)**.

| Hosting | Compute / month | Assumptions |
|---|---|---|
| Always-on microVM (Sprites rates) | **≈ $60** (or ≈ $115 at the higher published rate) | 730 h × ($0.0385 + 2 × $0.021875) |
| Hibernating microVM, same rates | **≈ $3** + a few cents of cold storage | 36.5 h active |
| Claude Managed Agents | **≈ $3** runtime | 36.5 active session-hours × $0.08, idle free |
| Durable Object (if rewritten for it) | **≈ $0.20** | 128 MB × 36.5 h. Effectively free within the included quota |
| **Tokens, any host** | **≈ $200+** | ~40k input tokens re-read per wake at $3/M, mostly cache misses because a 30-min gap outlives a 5-min prompt cache, plus ~2k output at $15/M. 1,440 wakes. |

What this shows:

- **For one agent, hibernation saves ~$55/month on a ~$260 bill.** Tokens dominate, which matches Anthropic's own hosting guidance [P]. A $5 VPS or a Mac mini is a perfectly good answer for a single personal agent.
- **The prompt cache interacts with sleep.** If the agent sleeps longer than the cache TTL, every wake pays full price for the prefix. Choosing a wake interval under the cache TTL (or a 1-hour cache) can matter more than the host choice (our analysis, worth a dedicated paragraph).
- **At fleet scale, the picture flips.** 1,000 per-user or per-repo agents at a 5% duty cycle is ~$57k/month of compute saved in this example. That is the scenario Substrate (~30× oversubscription [A]) and Durable Objects (10k agents → ~100 live [A]) are built for.

### Where it's vastly more efficient

- **Fleets of low-duty standing goals**: one agent per customer, repo, ticket queue or inbox.
- **Wait-heavy goals**: waiting on CI, human approval or a vendor callback. Durable waits (Lambda: up to a year, free) or suspended actors cost nothing while waiting.
- **Event-driven loops**: GitHub webhooks, inbound email, Slack events that wake the agent, rather than polling.
- **Branch-and-compare patterns** (best-of-N, maker/checker, "try 5 fixes"): fork a warm snapshot (Morph, E2B, Sprites checkpoints) instead of rebuilding N environments.
- **YOLO autonomy**: microVM isolation plus checkpoint and undo makes `--dangerously-skip-permissions`-style runs reversible.

### Where it isn't

- **Continuous inner loops** (a Ralph loop at 100% duty): there is no idle time to reclaim, per-hour rates are often above a plain VM, and runtime caps (AgentCore 8 h, E2B/Modal/Vercel 24 h) get in the way.
- **A single personal agent**: compute is noise next to tokens.
- **Harnesses that hold connections or in-process timers**: they never sleep, or they wake up broken.
- **GPU or local-model agents**: no CUDA snapshots, so cold starts are expensive.
- **Very frequent polling** (every minute): resume overhead and cache misses cancel out the savings. Push events instead.
- **Sleeps longer than retention**: Gemini deletes environments after 7 days inactive, Cloudflare backups expire after 3 days, Modal memory snapshots after 7 days, Blaxel Starter has TTLs. A goal that sleeps longer than that loses its machine.

---

## 5. Operating these environments (maintenance notes)

- **Golden snapshots versus self-updating harnesses.** Rebuild the base snapshot on each harness release (kagent: the first golden snapshot takes ~60–90 s [P]). Otherwise restored instances run old versions, and a fleet ends up on mixed versions.
- **Goal state lives outside the box.** Every runtime here has a cap, TTL or idle deletion, so treat the sandbox as cattle. Goal, memory and the audit trail belong in git, a DB or the session log. This lines up with the site's "durable state" principle.
- **Secrets in snapshots.** A memory snapshot captures whatever was in RAM, tokens included. Prefer proxy-injected credentials (as Claude Code's cloud environments and Codex cloud's egress proxy do) and check snapshot encryption and retention (our analysis).
- **Egress policy.** Allowlists per environment (Claude Code cloud environments, Codex cloud proxy, Cloudflare AI Gateway and MCP portals, agentgateway in kagent).
- **Reconnect logic.** After resume, re-open MCP, DB and chat connections. Google says so explicitly [P].
- **Snapshot portability.** Restores often require the same instance type or machine family (Modal, GKE Pod Snapshots: no E2 machines [P]). That makes it hard to move a sleeping agent between regions or hardware.
- **Observability.** Loops fail quietly (already on the site). Add resume count, resume latency and cache hit rate per wake as loop-specific metrics.
- **Kernel and node limits at density.** Google warns that more than ~800 sandboxes per node exceeds default inotify and ARP limits [P].

---

## 6. Requirements → starting point (draft decision guide)

| If you need… | Start with |
|---|---|
| One personal standing agent, minimal ops | Vendor-hosted (Claude Code routines, Codex cloud, Duet-style), or a small always-on VM |
| An existing CLI harness that sleeps between wakes, cheaply | Sprites, E2B or Blaxel (memory-preserving microVMs) |
| Hundreds to thousands of per-user agents on your own infra | kagent + Agent Substrate (k8s), or Cloudflare Agents SDK if you can rewrite in TS |
| Waits of days or weeks with exactly-once side effects | Durable execution (Lambda durable functions, Temporal, Restate) owning the loop, with a sandbox as the hands |
| Enterprise AWS/GCP/Azure governance | AgentCore, Vertex Agent Engine or Foundry hosted agents, with the goal state kept outside |
| Parallel exploration and undo | Morph (branching), E2B fork, Sprites checkpoints |
| Fully self-hosted, isolated, on a laptop or server | Docker Sandboxes (`sbx`), Microsandbox, E2B self-host, OpenSandbox |
| Hermes or OpenClaw specifically | kagent `AgentHarness`. For Hermes, alternatively the gateway on a small VM plus the Modal or Daytona terminal backend |

---

## 7. Proposed site structure (for discussion)

New top-level folder `content/guide/runtimes/` ("Where loops live"), under "In practice", after `environments`:

1. `index`: fake always-on, the three approaches plus split brain and hands, and the decision table
2. `snapshot-hosts`: Firecracker and microVM clouds (Sprites, E2B, Blaxel, Morph, Unikraft, Vercel, Modal, Daytona)
3. `kubernetes`: kagent, Agent Substrate, Agent Sandbox
4. `edge-actors`: Cloudflare Agents SDK, Project Think, Sandbox, Moltworker
5. `managed-runtimes`: AgentCore, Lambda durable functions, Vertex/Gemini, Foundry/ACA, Claude Managed Agents
6. `harness-fit`: the matrix and what makes a harness hibernation-friendly
7. `economics`: the duty-cycle model, the cache-TTL interaction, where it wins and where it doesn't
8. `operations`: snapshots, secrets, retention, reconnects, observability

## 8. Open questions for the next round

- Which of sections A–F do we take deep? A hands-on test (deploy the same Hermes or Claude Code goal on Sprites, E2B, Substrate-on-kind and Cloudflare) would give the site primary evidence nobody else has.
- What is "dot"? It didn't turn up under that name.
- Verify against primary pricing pages: Sprites (two conflicting rate sets), AgentCore (two rate sets), E2B, Blaxel standby timing.
- Agent Substrate license and CNCF status. Whether Claude Code or Codex are really listed upstream.
- Whether any harness supports an **external heartbeat** (wake by request instead of an in-process timer). This is the single biggest factor in whether a standing goal can actually hibernate.
