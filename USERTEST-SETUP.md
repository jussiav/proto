# Simulated user tests — how they actually run, and where the cost goes

Written for a dev assessing whether this can be made cheaper or better. It
describes what was run in September 2026: two batches, 14 participants, roughly
3.7M tokens. `USERTEST.md` is the protocol those runs followed; this file is the
mechanics and the cost model behind it.

## What it is, and what it is not

**It is:** an LLM playing a persona with no product knowledge, driving a real
Chrome against the local prototype, deciding each next action from what the page
says, and writing a report. The value is in the decisions — where a persona
hesitates, what they misread, what they do instead.

**It is not:** `usertest.cjs`. That file is a scripted regression walk of the
funnel with fixed choreography. It verifies the flow still works and simulates
nobody. The two get confused because of the shared name.

## The three layers

| Layer | Where it lives | Lifespan |
|---|---|---|
| Protocol — personas, world events, report template, preflight | `USERTEST.md`, tracked | permanent |
| Driver — a CLI that keeps one browser alive across many separate calls | a scratchpad, rebuilt per session | **lost between sessions** |
| Runner — one Claude agent per participant, playing the persona and calling the driver | the agent session itself | per run |

That middle row is the problem. The driver was written fresh each time, so
nothing about it accumulated: no review, no tests, no improvements carried
forward. Rebuilding it in-repo is the first thing worth doing.

## Why the driver exists at all

A persona has to read a page, decide as the character, act, then read the result
— a loop, over dozens of steps. A normal Playwright script cannot do that,
because the decisions are made by a model between the steps, and each step is a
separate tool call in a separate process.

So the driver launches Chrome **detached** with `--remote-debugging-port`, and
every later call reconnects over CDP, acts, and disconnects. Browser state — the
page, localStorage, an open modal, a half-typed counter-offer — survives between
calls because the browser was never owned by the calling process.

```
node ut.cjs start p1 9301 desktop "http://localhost:8080/index.html?mode=test&informed-decision=v1"
node ut.cjs text  p1 3500            # visible innerText, capped
node ut.cjs run   p1 step7.js        # arbitrary Playwright against the live page
node ut.cjs shot  p1 <dir> 07_x.png  # screenshot to disk
node ut.cjs stop  p1
```

Supporting details that mattered in practice:

- **One Chrome profile per participant**, so two participants never share
  localStorage. Parallel runs are otherwise impossible — same origin, same store.
- **Mobile is a CDP metrics override re-applied on every call**, because macOS
  Chrome refuses a window narrower than ~500px and CDP overrides die with the
  connection.
- **The static server is a precondition**, checked and started by the driver.
  Runs that began against a dead server failed page by page in ways that read as
  product bugs.
- **Seeding replaces walking.** `PROTO_MOCK.seed('draft-complete')` puts a
  finished listing in localStorage, so a test aimed at the decision page can skip
  the funnel entirely. That single mechanism is what took a run from ~300k tokens
  to ~200k.

## One run, step by step

1. Preflight: server up, stale browser on that port killed, fresh profile, own
   screenshot folder.
2. Start Chrome at the first URL, carrying `?mode=test` (hides all prototype dev
   chrome) and the arm under test. Both stick in localStorage.
3. Loop, 30–120 times: read the page (capped text dump), decide in character,
   act, screenshot.
4. Moderator-only "world events" fired by URL or by calling the page's own
   simulation hooks — photos arrive, auction goes live, offers land, a dealership
   replies.
5. Write one Markdown report per participant into `usertest-results/`
   (gitignored), with screenshots cited by filename.

## Where the tokens go

Measured, from the September batches:

| Run shape | Tool calls | Tokens | Model |
|---|---|---|---|
| End-to-end, full funnel + negotiation | 89–124 | 271k–338k | Opus |
| Same, after protocol trimming | 102–109 | 284k–296k | Sonnet |
| Partial: price step + decision page, ending at first decision | 33–64 | 197k–248k | Sonnet |

**The cost driver is the number of tool calls, not the size of any one of
them.** Every tool result stays in the agent's context for the rest of the run,
so each additional page read is paid for again on every subsequent call. A run
that makes 100 calls is not twice a run that makes 50.

Two things that are *not* the problem, and were checked:

- **Screenshots are nearly free.** Playwright writes them to disk; the agent
  never reads them back. 49 screenshots across six runs cost approximately
  nothing.
- **Instruction size is marginal.** The protocol plus the field guide is a few
  thousand tokens, once.

Attempts to cap cost by instruction failed. A stated ceiling of 45 tool calls
produced runs of 33 to 64; agents self-regulate roughly to the task and treat the
number as advisory. **What actually worked was removing work:** seeding past the
funnel, and ending the run at the first real decision instead of playing out a
negotiation. That was a ~40% cut.

## Levers a dev could pull

Ordered by expected saving, most first:

1. **Replace full-text page reads with structured extraction.** Today a step
   reads `document.body.innerText`, capped at 3 500 characters. Most of that is
   navigation, FAQ and footer the persona has already seen. A helper returning
   only the interactive elements and changed regions would cut the per-call
   payload several times over — and cut it on every subsequent call too, because
   it never leaves the context.
2. **Batch a step into one call.** Fill a form, submit, and return a 3-line
   summary in a single `run` script rather than four calls. The funnel is the
   obvious candidate; it is mechanical and its content is never the finding.
3. **Split mechanics from judgement.** Anything deterministic — seeding, world
   events, assertions about what rendered — can be plain Playwright with no model
   in the loop. Reserve the model for the decisions.
4. **Summarise state between phases.** After the funnel, the agent does not need
   the transcript of it; a short state summary would let the context be dropped.
   This needs support in how the runner is invoked, not in the driver.
5. **Cheaper model per participant.** Sonnet produced reports indistinguishable
   in structure and quality from Opus for this task; the difference was cost.

## Known weaknesses of the method itself

Independent of cost, and documented at more length in the September memo:

- **Agent-measured geometry is unreliable.** Two of three desktop measurements
  of one element were wrong, both understating the problem. Any claim about
  pixels needs verifying centrally before it reaches a report.
- **Persona consistency bias.** A sharply written character sheet tends to come
  back as the finding. Belief should be written as a starting position, not an
  identity.
- **Self-reported causality is soft.** "The lead line changed my mind" is the
  model narrating itself. Behavioural evidence — what was scrolled, typed,
  clicked — is the part worth trusting.
- **One observation per cell.** Every claim from a 6-participant batch rests on
  n=1 unless participants were deliberately paired.

## State of the artefacts

Rebuilt into the repo on 2026-09-29, so nothing lives in a scratchpad any more:

| Artefact | Where | Tracked |
|---|---|---|
| Protocol — personas, world events, report template | `USERTEST.md` | yes |
| Driver | `usertest/ut.cjs` | yes |
| Driver reference — commands, cost model, how to extend | `usertest/README.md` | yes |
| Skill — run checklist, batch design rules | `usertest/SKILL.md` | yes |
| Skill registration | `.claude/skills/simulated-usertest/` | no (`.claude/` is gitignored) — a 15-line pointer at the tracked file |
| Reports | `usertest-results/` | no, deliberately |
| Scripted smoke walk, unrelated | `usertest.cjs` | yes |

`cd Claude-Figma/usertest && npm install` once; profiles and session files go to
`usertest/.run/`, ignored.

**Three efficiency changes went in with the rebuild**, each aimed at the call
count rather than at the per-call size:

- `state` returns headings, every visible interactive element with its id and
  value, and a trimmed slice of main content with nav, header and footer removed
  — instead of an `innerText` dump that is mostly furniture the persona has
  already read.
- `do` takes a list of steps and returns the resulting state, so a funnel step
  costs one command instead of five.
- `seed` and `event` are deterministic: funnel state and backend events with no
  model in the loop.

## Questions for review

- Does `state` cut enough, or should it diff against the previous state and
  return only what changed? That is the next obvious step and it was not built.
- Should the deterministic half — seeding, world events, assertions — become a
  library that `usertest.cjs` uses too? The two currently duplicate the notion of
  a scenario.
- Should the driver move out of this repo into a shared internal package, so
  other prototypes can use it? It has one AutoVex-specific dependency: `seed` and
  `event` call the prototype's own `PROTO_MOCK` and `protoPage.actions`.
- Is one detached Chrome per participant the right isolation, or should this move
  to Playwright contexts behind a small server? Detached Chrome was chosen because
  the model's decisions happen between processes.
