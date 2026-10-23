# Back office

Filament (advisor tools), review booking, the review qualification engine, and
experiment registration.

### BO-01 · In `enabled` mode the review engine overrides the segment rules instead of refining them
- **Status:** Watching · **Type:** Defect · **Severity:** Medium
- **Where:** Review qualification engine, Filament → Tender Review Settings → Review Algorithm
- **Found:** 2026-09-07, reading the dump for Review/No review
- **Evidence:** For the live slice, `DecideViaQualificationEngine` returns the engine's answer without passing on to the legacy rules. The team's stated intent is that the filters stay in priority and the engine only adds fidelity within them. The mode and live percentage are editable in Filament by anyone with access to that page.
- **Last checked:** prod dump 2026-10-23, still present
- **Re-opens if:** someone moves the mode from `evaluate` to `enabled`.
- **Touches:** Review/No review, Seller intent phase 2

### BO-02 · Auto-publish copies the estimate into the asking price
- **Status:** Watching · **Type:** UX
- **Where:** Ads published without review
- **Found:** 2026-09-07, reading the dump
- **Evidence:** On `auto_publish`, an empty `asking_price` is filled from `price_estimation`. Since the 2026-10-23 dump the asking price no longer caps the seller's counter offer (DEC-05), but dealers still see it as the seller's "Pyyntihinta" and it still sets the minimum first bid (EML-05). For these ads that is the machine estimate, presented as the seller's own price.
- **Last checked:** prod dump 2026-10-23, still present
- **Touches:** Asking price removal, negotiation ceiling test

### BO-03 · Reviewable Drafts shows no plate or car
- **Status:** Open · **Type:** UX · **Severity:** Low
- **Where:** Filament → Reviewable Drafts
- **Found:** 2026-10-22, PR 2546 preview test
- **Evidence:** Three columns only: calls, added for review, drafts for user. Matching a row to an ad means comparing timestamps. Tender Request Drafts also opens filtered to "Status: OPEN", which hides drafts in review or queued.
- **Last checked:** prod dump 2026-10-23, still present
- **Next step:** Advisors may not need it (they book by queue order), so ask before changing. It mainly hurts testing.

### BO-04 · Advisors can't see what a seller edited before the call
- **Status:** Open · **Type:** Opportunity
- **Where:** Filament review page
- **Found:** 2026-10-05, out of scope for Seller edits before review
- **Evidence:** With edits before review, the ad an advisor opens may differ from the one submitted. The design spec lists showing this, ideally with what changed, as optional and outside scope.
- **Touches:** Seller edits before review

### BO-05 · The review decision is not re-run after a seller edit
- **Status:** Watching · **Type:** UX
- **Where:** Review routing for edited ads
- **Found:** 2026-10-05, team decision for Seller edits before review
- **Evidence:** Decided: follow the data on edited ads first, which is why every seller save after the decision is recorded. The review algorithm scores the ad as submitted, so edits bias its results (sellers fix weak photos, service history or price).
- **Next step:** Once the edit record exists, check how many edited ads there are and whether a re-run is worth building.
- **Touches:** Seller edits before review, Review qualification engine

### BO-06 · Three experiments are registered with nothing reading them
- **Status:** Open · **Type:** Cleanup
- **Where:** `VwoExperiment` enum and `config/vwo.php`: `73_combi`, `91_combi`, `93_combi`
- **Found:** 2026-09-07, experiment review
- **Evidence:** Still registered; the only consumers copy their cookie and list them in a Filament widget. No frontend or backend check reads them. `93_combi` (remove service book upload) is not progressing by the team's call.
- **Last checked:** prod dump 2026-10-23, still present
