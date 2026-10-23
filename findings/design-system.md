# Design system

Shared components, colour intents and accessibility across the seller and
dealership sides. Before proposing a change here, follow the
`shared-component-change` skill (rule 13 in `CLAUDE.md`).

### DS-01 · Three button components, two deprecated, with drifting copies of the same intents
- **Status:** Open · **Type:** Cleanup
- **Where:** `elements/Button.vue` and `ui/UiButton.vue` (both deprecated) and `atoms/AButton.vue`
- **Found:** 2026-09-17, accept-button work
- **Evidence:** `UiButton` lacks things `AButton` has (`accent` intent, `nav-cta` variant, `px-0` on icon-only buttons), and the two `success` intents now render differently (DS-02). Every intent change has to land in both until `UiButton` is gone.
- **Last checked:** prod dump 2026-10-23, still present
- **Touches:** Any initiative that touches buttons; prefer migrating to `AButton` over editing `UiButton`

### DS-02 · Dealership accept buttons are still lime
- **Status:** Watching · **Type:** UX
- **Where:** Dealership side: accept counter offer, delivery agreed, past delivery date confirmation
- **Found:** 2026-09-17, decided and announced to the dealership squad
- **Evidence:** All three use `UiButton` success (lime, dark lime label); the seller side moved to `AButton` success (green-400, black label). No user sees both sides, so the split is a design-system inconsistency only.
- **Last checked:** prod dump 2026-10-23, still present
- **Next step:** Their migration to `AButton` is not a no-op refactor: the buttons change colour. Say so in that ticket, or the change reads as a regression.

### DS-03 · B2B seller's accept is blue on the card and green in the confirmation
- **Status:** Parked · **Type:** UX · **Severity:** Low
- **Where:** B2B seller decision page, offer card accept → confirmation step
- **Found:** 2026-10-09, deferred out of Enhanced negotiations
- **Evidence:** `B2BOfferCard.vue` accept is a `UiButton` primary with no intent (blue). The shared confirmation step is green.
- **Last checked:** prod dump 2026-10-23, still present
- **Next step:** Move the card accept to `AButton` success when B2B decision-page work comes up.

### DS-04 · Contrast below AA in several button states and status lines
- **Status:** Open · **Type:** Accessibility · **Severity:** Medium
- **Where:** Button default (blue) intent: default hover, default active, secondary active. Decision page status lines in amber-600 and red-500 on white.
- **Found:** 2026-09-17, accept-button lab measurements
- **Evidence:** Measured below 4.5:1 for 14px text. The success intent was fixed with the green change; the rest were left alone so one status line is not fixed in isolation.
- **Next step:** One accessibility pass across every intent and status line.

### DS-05 · Red means both "expiring" and "something new" on the decision page
- **Status:** Accepted · **Type:** UX
- **Where:** Decision page: "Umpeutuu" / "Hylätty" status lines and the unread dealer-reply signal, all red-500
- **Found:** 2026-09, Enhanced negotiations
- **Why accepted:** They never collide on one card, and the notification convention is strong enough to carry it.

### DS-06 · Offer card test still stubs the old button
- **Status:** Open · **Type:** Cleanup
- **Where:** `C2BOfferCard.spec.js`
- **Found:** 2026-10-16, after the card moved to `AButton`
- **Evidence:** The spec stubs `UiButton`, which the component no longer uses.
- **Last checked:** prod dump 2026-10-23, still present
