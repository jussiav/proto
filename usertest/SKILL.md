---
description: Run a simulated user test against the AutoVex prototype — an AI-played persona driving a real browser, one report per participant. Use when asked to "run usertest", "/usertest", run simulated participants, or test a surface with simulated sellers. Covers run shapes, the driver, the token budget and the report format.
---

# Simulated user test

Full protocol: [`USERTEST.md`](../USERTEST.md) — personas, world events, end
conditions, report template.
Driver reference: [`usertest/README.md`](README.md) — every command, with the
cost model.

This skill is the checklist and the decisions to make before starting.

## 1. Pick the run shape first

It is the single biggest cost and quality decision.

| Shape | Use when | Cost |
|---|---|---|
| **End to end** | the question is about expectations built across the journey, or a handover between steps | 89–124 calls, ~300k tokens |
| **Partial** | the question is about one surface | 33–64 calls, ~200k tokens |

For a partial run, **keep the one step that produces the input the surface
depends on** and seed the rest. For the decision page that is the price step: the
number typed there becomes the counter-offer ceiling and the yardstick the result
is judged against, and a moderator-set value has no persona behind it.

Decide the end condition up front — "stops at the first real decision" keeps a
batch comparable and cheap. If the persona would negotiate, record that as the
decision with the amount they had in mind; what happens inside a negotiation is a
different study.

## 2. Set up (one call each)

```bash
cd Claude-Figma/usertest
node ut.cjs start p1 9301 desktop "http://localhost:8080/index.html?mode=test&informed-decision=v1"
node ut.cjs seed  p1 draft-complete --no-price     # partial runs only
```

`?mode=test` hides all prototype dev chrome; the arm param pins the variant. Both
stick in localStorage, so later URLs need only the scenario. `start` handles the
preflight — server, stale port, fresh profile.

One participant per port and per session id. Profiles are separate, so parallel
runs do not share localStorage — but run one or two at a time unless the token
budget is known to be there.

## 3. The loop

**Read → decide in character → act.** Every action must be justifiable as "this
person, with this goal, reading this screen, would plausibly do this".

```bash
node ut.cjs state p1                                  # not `text`
node ut.cjs say   p1 "En tiedä onko tämä hyvä hinta"  # narration for the observer
node ut.cjs do    p1 '[{"click":"text=Jatka","wait":900}]'
node ut.cjs shot  p1 <screens-dir> 04_price.png
```

Rules that keep a run honest and cheap:

- **`state`, not `text`.** One read per page *state*, never after every click —
  `do` returns the new state itself.
- **One call per step.** Fill a whole form in one `do`.
- **Never read a screenshot back.** Taking them is free; reading them is not.
- **Do not route around friction.** Getting stuck, giving up, or deciding without
  scrolling to the thing being tested are all results.
- **World events are the backend, never the persona** — `node ut.cjs event p1 new-offers`.

## 4. What to capture

- Hesitation per step: none / slight / notable / blocking, with rough seconds.
- Verbatim copy the persona reacted to, with an English gloss.
- **Behaviour over explanation.** What they scrolled to, typed and clicked beats
  what they say about why — self-reported causality is the softest data here.
- Separate what the persona noticed from what only a researcher would.
- Tag prototype artefacts `[proto artifact]` and move on; see the known list in
  `USERTEST.md`.

## 5. Report

One Markdown file per participant in `usertest-results/` (gitignored, never
committed), screenshots in a sibling `<stem>_screens/` folder, cited by filename.
Use the template in `USERTEST.md` exactly — the files are read by another model
to compile a cross-participant report, so the structure is the contract.

## 6. Before anything reaches a report

- **Verify every measurement centrally.** Agent-reported pixel positions have
  been wrong in two of three cases, both understating the problem.
- **Check findings against production** (`Prod-codebase/<newest>/`) before
  reporting them as product issues. Copy, rules and thresholds get quoted from
  the language files, not from the prototype.
- Say plainly when a design failed to communicate. A negative result is the
  deliverable.

## Designing a batch

- **Change one variable between paired participants.** Two differences make a
  result unreadable.
- **Two participants per cell** wherever a claim will be quoted as a threshold.
- **Write the belief as a starting position, not an identity.** "He assumes
  dealerships lowball" comes back as the finding; "he has seen listings at X"
  does not.
