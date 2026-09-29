# `usertest/` — the driver for simulated user tests

`USERTEST.md` (repo root) is the protocol: personas, world events, end
conditions, report template. **This is the tooling that protocol runs on.**

`usertest.cjs` in the repo root is a different thing — a scripted happy-path
regression walk with fixed choreography. It simulates nobody. Do not confuse the
two because of the name.

## Install

```bash
cd Claude-Figma/usertest && npm install
```

Needs Google Chrome at the standard macOS path, or `UT_CHROME=/path/to/chrome`.
Profiles and session files are written to `usertest/.run/` (gitignored).

## Why a driver rather than a script

A persona reads a page, decides **in character**, acts, then reads the result.
The decisions are made by a model between the steps, so every step is a separate
process — which a normal Playwright script cannot span.

So Chrome is launched **detached** with `--remote-debugging-port`, and each
command reconnects over CDP, acts, and disconnects. The page, localStorage, an
open modal and a half-typed counter-offer survive between commands because no
command ever owned the browser.

## Commands

```bash
node ut.cjs start <s> <port> <desktop|mobile> "<url>" [x] [y]
node ut.cjs state <s> [maxTextChars]      # compact structured page state
node ut.cjs do    <s> '<json steps>' [maxTextChars]
node ut.cjs seed  <s> <mockState> [--no-price]
node ut.cjs event <s> <name>
node ut.cjs goto  <s> "<url>"
node ut.cjs shot  <s> <dir> <file.png> [full]
node ut.cjs say   <s> "what the persona is thinking"
node ut.cjs text  <s> [chars]             # raw innerText, escape hatch
node ut.cjs run   <s> <script.cjs>        # arbitrary Playwright
node ut.cjs stop  <s>
```

`start` is also the preflight: it checks the static server and starts one if the
port is dead, kills a stale browser holding the debugging port, and creates a
fresh profile. Those were three separate failure modes in earlier batches.

### `state` — the main cost lever

Returns headings, every visible interactive element with its id/value/state, and
a trimmed slice of main content with nav, header and footer removed:

```
URL /price.html?mode=test
H1: Mitä odottaisit autoliikkeen tarjoavan autostasi?
[btn] Jatka
[field] #price-expectation ph="Oma arvio (vapaaehtoinen)" value="" required
--- text ---
Oma arvio on vapaaehtoinen ja auttaa meitä ymmärtämään odotuksiasi.
```

A full `innerText` dump is mostly navigation, FAQ and footer the persona has
already read — and because every tool result stays in the runner's context for
the rest of the run, that waste is re-paid on every later call. Prefer `state`;
`text` exists for the rare case where the exact rendered wording matters.

### `do` — one step, one call

```bash
node ut.cjs do p1 '[{"fill":"#price-expectation","value":"29900"},{"click":"text=Jatka","wait":900}]'
```

Steps: `goto` · `fill` · `type` (with keystroke delay) · `click` · `check` ·
`select` · `press` · `scroll` · `eval` · `wait`. Selectors are Playwright
locators, so `text=Jatka` and CSS both work. It prints what it did and then the
new `state`, so filling a funnel step costs **one** command instead of five.

### `seed` — skip what is not being tested

```bash
node ut.cjs seed p1 draft-complete --no-price
```

Writes a finished listing into localStorage via the prototype's own
`PROTO_MOCK`, so a test aimed at the decision page does not have to walk the
funnel. `draft-complete` is the review-segment car (148 000 km, optional
estimate); `draft-complete-no-review` is the high-mileage one (mandatory asking
price). Reload the page afterwards so it reads the seed.

`--no-price` clears the seller's own figure. That number becomes the
counter-offer ceiling, so leave it cleared whenever the persona should set it
themselves — a moderator-set value has no persona behind it.

### `event` — the backend, never the seller

Deterministic, no model in the loop:

| Name | What it does |
|---|---|
| `photos-filled` | the photo set "arrives" |
| `auction-live` / `new-offers` | the offers page moves on |
| `dealer-reply` | dealership answers, negotiation stays open |
| `dealer-close` / `dealer-close-silent` | dealership ends it, with or without a message |
| `auto-close` | the deadline passes |
| `reset-negotiation` | clears the thread |

The navigation events carry `mode` and any arm params across, so a participant
cannot fall out of test mode or off the arm. The dealer events call
`window.protoPage.actions[n].run()` — the underlying function is declared inside
`decision.html`'s IIFE and is unreachable from `page.evaluate`, but those
closures are reachable and work in test mode. A dealer reply requires a seller
counter-offer to exist first.

## Cost model

The expensive thing is the **number of commands**, not the size of any one.
Every result stays in the runner's context for the rest of the run, so call 90
pays for calls 1–89 again. Measured over the September batches:

| Run shape | Calls | Tokens |
|---|---|---|
| End-to-end, full funnel + negotiation | 89–124 | 271k–338k |
| Partial: one funnel step + decision page, ends at first decision | 33–64 | 197k–248k |

Screenshots are effectively free — Playwright writes them to disk and the runner
never reads them back. Instructions are a rounding error.

**Capping the count by instruction does not work.** A stated ceiling of 45 calls
produced runs of 33 to 64. What works is removing work: seed past what is not
being tested, end the run at the first real decision, and use `do` and `state`
instead of a call per field and a dump per page.

## Extending it

- New world event: add to `EVENTS` in `ut.cjs`. Navigation events take `goto`,
  simulated backend actions take the `protoPage.actions` index.
- New action verb: add to `runSteps`. Keep it to things a user could do.
- Anything deterministic — seeding, events, assertions about what rendered —
  belongs here, with no model in the loop. Reserve the model for decisions.
