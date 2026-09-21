# User Test — Goal-Driven Simulated User

**Trigger:** when the user asks to "run usertest" (or "run a user test", "/usertest"). An optional participant count — "run usertest 4", "run usertest with 3 participants" — means run that many independent test runs (default 1), each with a **different generated participant** (see Participant generation), sequentially, and write **one report file per participant** (see Report files).

**This is not a script.** There is no predefined sequence of buttons to press or fields to fill. The simulated user has a *goal* and *zero knowledge of the UI*. Claude plays that user: opens the prototype in a **visible browser** (per project CLAUDE.md browser rules), reads each page the way a first-time visitor would, and decides what to do next based only on what the page communicates and what the persona wants. If the user gets stuck, hesitates, or is misled — that is a finding, not a failure to route around silently.

## Participant generation

Each run gets a distinct participant assembled from these dimensions (pick varied combinations across the batch — don't repeat a profile; a dimension may also be fixed by the prompt):

- **Device:** desktop (1440×900) or mobile (≈390×844, touch, Playwright device emulation). Mix across the batch.
- **Digital ability:** low / medium / high — affects reading speed, hesitation at dense UI, willingness to scroll/explore, likelihood of missing non-obvious controls.
- **Service understanding:** first-timer (never heard of AutoVex) / vaguely aware / returning seller.
- **Goal:** e.g. maximize price · sell quickly with minimal effort · just curious what the car is worth · cautiously testing before committing. The goal drives every choice.
- **Car & price knowledge:** knows the car well with a realistic price expectation / vague idea, no price figure / overestimates value / underestimates value. Determines whether they enter a price estimate and how they judge offers.
- **Attentiveness / patience:** affects whether they read FAQs and helper copy, and whether they *notice* inconsistencies between pages (wording, numbers, promises). Only attentive participants report subtle inconsistencies — an inattentive one reports confusion instead.

Give the participant a short name tag (e.g. "P2 — mobile, low ability, quick-sale, overestimates price"). The participant knows only what a real visitor would: they landed on the front page. Every decision must be justifiable as "this person, with this goal, reading this screen, would plausibly do this."

Default single-run persona if nothing specified:

> Private person selling their current car. Not in a hurry, but motivated. **Goal: "I want to sell my car and get as high a price for it as possible."** Somewhat wary of car dealers; wants to feel in control; won't hand over personal data without seeing why it's needed. Reads Finnish. Average tech skills — no dev tools, no URL editing.

## Preflight — do this before every run, and check it per participant

A run that starts against a broken environment fails page by page in ways that
read as product bugs. These are preconditions, not steps to remember:

1. **The prototype must be served over HTTP.** `file://` breaks Google Fonts and
   the scenario params. Check the server, and start one if it is down:

   ```bash
   curl -sf -o /dev/null http://localhost:8080/index.html \
     || (cd <path-to>/Claude-Figma && python3 -m http.server 8080 &)
   ```

   Do not assume a server someone else started will outlive the batch - check it
   again for each participant, not once for the run.

2. **Kill any browser still holding this participant's debugging port.** A
   crashed run leaves Chrome alive; the next start then attaches to the dead
   run's profile and inherits its localStorage, so the "first-time visitor"
   arrives mid-funnel.

3. **Fresh profile per participant**, so each one has its own localStorage. Two
   participants sharing an origin and a profile will overwrite each other's
   funnel data.

4. **A screens folder per participant, and write only into your own.** Runs have
   written into another participant's folder before, which then has to be traced
   file by file. Before writing the report, list the folder and cite only what is
   actually in it.

5. **First URL carries the mode and the arm**, e.g.
   `index.html?mode=test&informed-decision=v1`. Both stick in localStorage, so
   later URLs need only the scenario params. `?mode=test` hides the prototype's
   own dev bar - a participant must never see proto tooling.

6. **Dealer responses run through `window.protoPage.actions[N].run()`**, not
   through the page's internal functions, which sit inside its IIFE and are
   unreachable from outside. Index 0 replies and leaves the negotiation open,
   1 closes with the pre-filled message, 2 closes silently, 3 auto-closes on the
   deadline, 4 resets. They preserve the participant's own thread, where
   switching scenario would reseed it. A seller counter-offer must exist first.

7. **Know the prototype's own artifacts so they do not get reported as product
   defects:** the plate lookup always returns the same fixed mock car whatever
   plate is typed, and the offers page's live bid counts are its own mock and do
   not match the decision page's result counts. Note either in one line, tagged
   `[proto artifact]`, and move on.

## How Claude runs it

1. Launch headed browser (`channel: 'chrome'`, `headless: false`), fresh localStorage, front page.
2. Loop: **read → think as the persona → act**. Read the rendered page (text, layout, accessibility snapshot, screenshot when needed). Ask: what does the persona understand from this? What serves the goal? Would they trust it? Then act — click, type, scroll, hesitate, go back — like a human (typing delays, reading pauses proportional to the amount of text, scrolling before deciding).
3. Invent realistic personal data in character (own car's plate/km, name, email, phone). Choices along the way (enter a price estimate or not? add photos now or later? counter-offer or accept?) are made *from the goal* — e.g. a price-maximizer likely negotiates rather than accepts the first number.
4. Narrate: keep an on-page banner or log of what "the user" is thinking at each step, so the human observer can follow the reasoning live.
5. **Capture screenshots as the participant navigates.** Save PNGs into the participant's screens folder (see Report files): one on arrival at every page, plus every meaningful state change the participant sees — offers revealed, modals open (negotiation, accept, reject/retention), dealer replies, world-event results, final state — and ALWAYS at each friction moment cited in the report. Default capture = the viewport (what the participant actually sees on their device size); use a full-page capture additionally when a finding concerns something below the fold. Number files in navigation order: `01_index.png`, `02_details.png`, `07_decision_warmup.png`, `09_negotiate_modal.png` … so the sequence reads as the participant's journey.

## World events (the only scripted part)

These simulate the *system/backend*, not the user, using the prototype's own dev mechanisms (scenario panel / URL params). Apply them when the journey reaches the right state:

- Photos: after the user has understood the photos step (~few seconds), the photo set "arrives" via scenario **"filled"** (stands in for the user photographing their car).
- Email: the verification email "arrives" through the prototype's email preview; the user reads it and clicks its link.
- Offers page: shortly after arrival auction goes **"auction-live"**; after the user has browsed, offers arrive: **"new-offers"**.
- Negotiation: after each seller counter-offer, the dealer replies via the prototype's dealer-reply simulation (~5 s later). The dealer never goes below their latest offer and never above the seller's counter-offer (reaching the counter = dealer agrees to it); they may stick to their offer, and may end the negotiation entirely (scenario "negotiation-stopped").
- Rejection: if the user rejects the auction outcome, ~5 s later the dealer's **final offer** arrives (scenario **"final-offer"**). From there the seller's only options are: do nothing, accept, or reject.

Everything between world events is the persona's free choice.

## End conditions

Run ends when the participant reaches their goal (deal they're satisfied with), gives up, or is hard-stuck. Getting stuck or abandoning IS a valid outcome — record it, don't route around it.

## Report files (one per participant)

After each run, write a Markdown report to `usertest-results/` in this folder (create if missing; the folder is gitignored — never commit or push these). Filename: `usertest_<YYYY-MM-DD>_<HHMM>_p<N>.md`. Screenshots for the run go to a sibling folder `usertest_<YYYY-MM-DD>_<HHMM>_p<N>_screens/` (numbered PNGs per the capture step above). The report must reference its screenshots: list the screens folder in the Session block, and cite specific files inline in the narrative and friction summary (e.g. `see 09_negotiate_modal.png`) so a report-building AI can pair evidence with findings. These files are uploaded to another AI to compile a cross-participant report, so keep the structure exact and self-contained:

```markdown
# Simulated User Test Report — P<N>

> **DISCLAIMER: This is a SIMULATED user test.** The participant is an AI-played
> persona (Claude) driving a browser against the AutoVex prototype — NOT a real
> human being. Treat findings as heuristic/simulated evidence, distinct from
> real-human usability test data.

## Session
- Date & time: <ISO date, start–end local time>
- Environment: AutoVex Claude-Figma prototype (local), pages visited: <list>
- Device: <desktop 1440×900 | mobile 390×844 touch emulation>
- Screenshots: usertest_<date>_<time>_p<N>_screens/ (<count> PNGs, numbered in journey order)
- Test type: goal-driven simulated user (see USERTEST.md)

## Participant profile
- Name tag, device, digital ability, service understanding, goal,
  car & price knowledge, attentiveness — one line each, plus the invented
  car/contact data used.

## Tasks performed
Numbered list of the tasks/steps the participant actually did (including
world events that were triggered and when).

## Step-by-step narrative
Per page/step: what the participant saw, what they thought (in character),
what they did, hesitation level (none/slight/notable/blocking) with seconds
where meaningful, and any quotes of confusing copy.

## Inconsistencies noticed between pages
Only ones this participant would plausibly notice given their attentiveness —
wording/number/promise mismatches across steps. If none: "None noticed by
this participant" (distinct from "none exist").

## Outcome
Goal achieved? Final price vs. expectation (if applicable), where the run
ended, participant's closing sentiment (in character).

## Friction summary (ranked)
Most severe first: page, issue, why it matters for this persona.
```

## Aggregate note

After a multi-participant batch, also print a short chat summary (participants, outcomes, top shared friction) — but the files are the deliverable; don't duplicate full content in chat.

## Deterministic smoke test (separate thing)

`usertest.cjs` is a scripted happy-path regression run of the whole funnel (fixed choreography, fast). Use it only when asked for a "smoke test" / "scripted usertest" — it verifies the flow still works, it does not simulate a human.
