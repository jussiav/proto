# Findings register

Issues, gaps and opportunities we have noticed in the product but left out of
the work at hand. They come from three places:

- **Design QA of PRs and environments**, e.g. Design QA on a preview environment
  that turns up problems outside the PR's scope.
- **Design iteration**, e.g. something an initiative deliberately leaves out of
  its design spec.
- **Reading the production codebase**, e.g. a defect or dead code found while
  transcribing prod into the prototype.

The point is to not lose them, and to fix them together with the initiative
that next touches the same area.

## Files

| File | Area | ID prefix |
|---|---|---|
| [funnel.md](funnel.md) | Front page, ad creation funnel, waiting and success screens | `FUN` |
| [offers.md](offers.md) | Offers page (the seller's listings) | `OFF` |
| [decision.md](decision.md) | Decision page, negotiation, reject flow | `DEC` |
| [emails-and-content.md](emails-and-content.md) | Transactional and marketing emails, CMS FAQ, dealer-facing copy | `EML` |
| [back-office.md](back-office.md) | Filament, review booking, review algorithm, experiments | `BO` |
| [design-system.md](design-system.md) | Shared components, colour intents, accessibility | `DS` |
| [environments.md](environments.md) | Preview and staging environments | `ENV` |
| [account.md](account.md) | Account menu, profile page | `ACC` |

Proto-only divergences from prod (things the prototype knowingly does
differently) are not listed here. They stay in `CLAUDE.md`.

## When to read and update it

| Moment | What to do |
|---|---|
| An initiative starts or changes scope | Read the files for every area it touches. List the entries it could fix in the initiative's notes, and say which ones it takes on. |
| A PR gets Design QA | Add anything found outside the PR's scope. Add the PR's own findings too, as `Reported`, until they are confirmed fixed. |
| A new prod dump arrives | Re-check every `Open`, `Reported`, `Parked` and `Watching` entry whose evidence points at code. Update **Last checked**, and move fixed ones to `Fixed`. Add a line to the review log below. |
| Design iteration leaves something out | Add it, with the reason it was left out. |
| Something ships | Mark the entry `Fixed` with the dump it shipped in. Never delete entries; the history is part of the record. |

## Entry format

```markdown
### FUN-01 · Short title naming the problem
- **Status:** Open · **Type:** UX · **Severity:** Medium
- **Where:** the surface and state a seller or advisor sees it in
- **Found:** 2026-10-22, how it was found
- **Evidence:** prod file / behaviour, or the Design QA that showed it
- **Last checked:** prod dump 2026-10-15, still present
- **Next step:** what fixing it would take, or what decision it waits on
- **Touches:** initiatives or areas that could pick it up
```

- **IDs never change and are never reused.** Add new entries at the end of a
  file with the next free number, even if they belong next to an older one.
- **Status**
  - `Open`: real and unowned.
  - `Reported`: a ticket, PR comment or team thread exists. Name the place, not
    the ticket id or link (this repo is public).
  - `Parked`: waiting on a team decision.
  - `Watching`: true today, but becomes a problem if something changes. Say
    what.
  - `Accepted`: the team chose to keep it. Say why, so nobody re-raises it.
  - `Fixed`: name the dump or PR.
  - `Obsolete`: the surface no longer exists.
- **Type:** `Defect` · `UX` · `Copy` · `Accessibility` · `Opportunity` ·
  `Cleanup` (dead code or config) · `Environment`
- **Severity** (Defect, UX, Copy, Accessibility): `High` (a seller can lose their
  sale, data, or a correct picture of it) · `Medium` (confusing or misleading) ·
  `Low` (polish).

## Never write here

This folder is tracked in git and, until the repo migration is done, mirrored to
the public `jussiav/proto` repository. Keep out:

- Security findings (access control, auth, data exposure). Keep them in private
  notes and raise them with the devs directly.
- The fair-offer ratio, OKR targets, benchmarking figures, business cases, and
  results of A/B tests that are not decided yet.
- Ticket links or ids, customer data, test credentials, signed links.

## Review log

| Date | Trigger | Checked | Result |
|---|---|---|---|
| 2026-10-22 | Register created after the PR 2546 Design QA | Seeded from the PR 2546 Design QA, `CLAUDE.md` and earlier investigation notes. Code-based entries re-checked against prod dump 2026-10-15 | See each entry's **Last checked** |
| 2026-10-22 | Developer pointed out Mailpit on previews | ENV-02 | Rewritten: previews do send email, to Mailpit, but it loses mail on restart |
| 2026-10-23 | Prod dump 2026-10-23 | Every code-based entry. Entries whose evidence files changed in this dump were re-read (DEC-03, DEC-05, DEC-15, BO-02, BO-06, EML-05); the rest point at unchanged files | DEC-05 fixed. BO-02 and EML-05 rewritten: the asking price no longer caps counter offers but still reaches dealers, in the UI as well as the email |
| 2026-11-02 | Prod dump 2026-11-02 | The 2026-10-26 and 2026-10-29 dumps were never checked on their own, so this pass diffed 2026-10-23 → 2026-11-02 (11-02 itself only adds developer docs). Every code-based entry; entries whose evidence files changed were re-read (OFF-01, DEC-01, DEC-03, DEC-11, DEC-13, DEC-15, BO-01, BO-02, EML-05, ENV-06); entries without a date before (FUN-08, FUN-12, FUN-13 to FUN-18, DEC-04, DEC-10, DEC-12) got one | Nothing fixed. PR 2546 is not in a dump yet. BO-07 added (skip-review segments) and BO-01, BO-02 and EML-05 updated for it and the B2B reserve exception. DEC-16 added (counter-offer range errors still say "Pyyntihinta") |
| 2026-11-06 | Prod dump 2026-11-05 | Every code-based entry. Entries whose evidence files changed were re-read (FUN-11, FUN-12: only the email-change counter moved; BO-06: the test list is unchanged) | Nothing fixed. PR 2546 is not in a dump yet. No new entries: the dump adds step autosave in the funnel, an unchanged email no longer counting as an email change, and VWO arm storage for logged-in users, none of which opens an issue |
| 2026-11-11 | Prod dump 2026-11-11 (code from 2026-11-06) | Every code-based entry. Nine files differ from 2026-11-05: Fortify's blade login, password-reset and confirm-password views are no longer registered, five unused blade partials are gone, and developer docs changed. No entry's evidence points at them | Nothing fixed. PR 2546 is not in a dump yet. No new entries |
