# Decision page

Offer cards, hero and warm-up, auction result, support banners, the negotiation
modal and the reject flow.

### DEC-01 · On an expired auction, "Soita meille" opens the reject flow
- **Status:** Open · **Type:** Defect · **Severity:** High
- **Where:** Decision page, bottom support banner when offers have expired by time, below 992px
- **Found:** 2026-09-08, transcribing the support banner
- **Evidence:** The banner says "Soita meille" (Call us) with a phone icon, but the section's button has no link and always calls the reject-all handler. That opens the reject (or last counter-offer) modal for the highest offer. A seller who wants help is put one step from rejecting their auction.
- **Last checked:** prod dump 2026-11-11, still present
- **Next step:** Give that wording a `tel:` link like the top banner, or render the section's button per wording. Unverified: whether auto-rejected offers reach this state.

### DEC-02 · Reject confirmation on a final offer recommends a counter offer that can't be made
- **Status:** Reported (team ticket, 2026-09-10) · **Type:** Copy · **Severity:** Medium
- **Where:** Decision page → reject a final offer → confirmation step
- **Found:** 2026-09-10
- **Evidence:** `Reject.vue` picks its copy from "no negotiation and negotiable", and "negotiable" is true for every consumer request. A final offer has no counter-offer option anywhere, yet the copy says "Suosittelemme tekemään vastatarjouksen autoliikkeelle…" (We recommend making a counter offer…).
- **Last checked:** prod dump 2026-11-11, still present
- **Next step:** The agreed direction is a plain confirmation of rejection. The proto keeps prod's copy until it ships.

### DEC-03 · An expired highest offer still offers "Tee vastatarjous"
- **Status:** Open · **Type:** Defect · **Severity:** Medium
- **Where:** Negotiation / reject modal footer for an expired highest offer
- **Found:** 2026-09-10
- **Evidence:** `OfferActions.vue` shows the negotiate button with no expiry check, and it is the only footer button without `:disabled`.
- **Last checked:** prod dump 2026-11-11, still present
- **Next step:** Check at runtime whether the server refuses the send, then decide whether to hide the button.

### DEC-04 · Card help lines contradict the hero on the last negotiation round
- **Status:** Parked · **Type:** Copy · **Severity:** Medium
- **Where:** Offer card, line under the negotiate / "Näytä vastaus" button
- **Found:** 2026-10-09, PR 2526 Design QA
- **Evidence:** "Nykyinen tarjous on edelleen voimassa, vaikka tekisit vastatarjouksen." (The current offer stays valid even if you make a counter offer.) sits beside a hero saying no more counter offers can be made.
- **Last checked:** prod dump 2026-11-11, still present
- **Next step:** Both card help lines (under accept and under negotiate) get rewritten together in a later copy optimisation. Bring this contradiction to that work.

### DEC-05 · The asking price still caps the counter offer, but the seller can't see it
- **Status:** Fixed (prod dump 2026-10-23) · **Type:** UX · **Severity:** Medium
- **Where:** Negotiation modal: the red asking-price warning and the server-side counter-offer ceiling
- **Found:** 2026-09-07, Asking price removal
- **Evidence:** The decision page no longer shows the asking price, but it still decides what a seller may counter. For ads published without review the cap is the machine estimate (BO-02).
- **Fixed by:** the counter-offer ceiling test, promoted in the 2026-10-23 dump. The ceiling no longer reads the asking price, and the red line now names the highest recommended counter offer ("Korkein suositeltava vastatarjous on [amount].").
- **Touches:** Asking price removal, DEC-07

### DEC-06 · The waiting hero's "(viim. 24 h kuluessa)" is inexact over weekends
- **Status:** Accepted · **Type:** Copy
- **Where:** Decision page hero and negotiation modal while waiting for the dealership
- **Found:** 2026-10-09, PR 2526 Design QA
- **Evidence:** The dealership's deadline is 24 business hours, so a Friday counter offer can wait past 24 hours.
- **Why accepted:** The team prefers a clear figure; knowingly inexact. Revisit only if sellers complain about missed deadlines.

### DEC-07 · Counter offer without a price
- **Status:** Open · **Type:** Opportunity
- **Where:** Negotiation
- **Found:** 2026-10-12, idea raised in the team's ceiling discussion
- **Evidence:** The seller asks for a better offer without naming a price, and the dealership decides whether and how much to raise. No ceiling is needed, so the asking price can leave negotiation entirely.
- **Next step:** Open questions: whether the seller accepts the raise or opts into auto-accept above a minimum; whether it is offered based on auction or auto-bid data. Using auto-bid maxima needs a Legal and dealership squad check first.
- **Touches:** DEC-05, Asking price removal

### DEC-08 · Thin auctions have no designed result message
- **Status:** Open · **Type:** Opportunity
- **Where:** Decision page, auction result block, auctions with very few bidders
- **Found:** 2026-09, Informed decision
- **Evidence:** The competition argument ("autoliikkeet … korottivat tarjouksiaan", dealerships raised their offers) is false with one bidder. Informed decision falls back to prod's block below four bidders, and that version is not designed. Uncompetitive auctions are a large share of rejected-offer cases.
- **Touches:** Informed decision

### DEC-09 · Nothing on the page says who buys the car
- **Status:** Open · **Type:** Opportunity
- **Where:** Decision page
- **Found:** 2026-09-16, Informed decision copy pass
- **Evidence:** "Does AutoVex buy the car?" is a live misconception. The one line naming the dealership as the buyer was cut with the verdict block.
- **Touches:** Informed decision

### DEC-10 · The delayed-negotiation nudge overlaps the negotiation changes
- **Status:** Watching · **Type:** UX
- **Where:** `89_combi` treatment: an email nudging sellers with offers and no negotiation
- **Found:** 2026-09-07, experiment review
- **Evidence:** Live A/B; deliberately not reconciled with Enhanced negotiations. Its email now links to the decision page.
- **Last checked:** prod dump 2026-11-11, test still registered
- **Next step:** Revisit when the test is decided.

### DEC-11 · Top support banner dials a site setting, not the number it shows
- **Status:** Watching · **Type:** Defect · **Severity:** Low
- **Where:** Decision page, top support banner button
- **Found:** 2026-09-08, transcribing the support banner
- **Evidence:** The sentence shows hardcoded numbers (two different ones by wording); the button dials the site's seller phone setting. They agree only if that setting matches.
- **Last checked:** prod dump 2026-11-11, still present. Since the 2026-10-26 dump the page fetches that setting from the configurations endpoint instead of reading it from the page; same setting, same mismatch

### DEC-12 · Support banners on desktop have no call button
- **Status:** Open · **Type:** UX · **Severity:** Low
- **Where:** Decision page support banner, four wordings (no offers, expired, accepted, rejected), from 992px
- **Found:** 2026-09-08
- **Evidence:** The action section is hidden from `lg`, so the number in the sentence is the only way to call. The banner also leaves an empty 12px block under the button in four of five wordings.
- **Last checked:** prod dump 2026-11-11, still present

### DEC-13 · Reject survey thank-you link doesn't work
- **Status:** Open · **Type:** Defect · **Severity:** Low
- **Where:** Reject survey → thank-you screen, support email link; rating label
- **Found:** 2026-09, transcribing the reject survey
- **Evidence:** `RejectConfirmThanks.vue` has `href="mailto:{{ customerSuccessEmail }}"`, a template expression inside an unbound attribute, so the address shows but the link doesn't resolve. The rating's label points at `for="score"`, which matches no element.
- **Last checked:** prod dump 2026-11-11, still present. The 2026-10-26 dump changed where the address comes from (the configurations endpoint), not the template

### DEC-14 · Reject confirmation buttons touch from 620px up
- **Status:** Fixed (prod dump 2026-10-15) · **Type:** Defect · **Severity:** Low
- **Where:** Reject confirmation with both "Hylkää tarjous" and "Tee vastatarjous"
- **Evidence:** The footer was `sm:gap-0`; it is now `sm:gap-2`. The QuickNegotiate footer keeps `sm:gap-0`, but it has one button per row there.

### DEC-15 · Dead code on the decision page
- **Status:** Open · **Type:** Cleanup
- **Found:** 2026-08 to 2026-09, decision page transcription
- **Evidence:**
  - `AuctionInsights.vue` hidden y-axis `stepSize` still includes the asking price, though consumers no longer see it.
  - `offerEstimateDifference` is computed and passed with a TODO saying nothing consumes it.
  - `QuickNegotiate.vue` branch "Eikö autoliike ole ollut yhteydessä?" cannot be reached (the banner that opens it is hidden in the only state that would show it).
  - `AConfetti.vue` is imported only by its own story; `canvas-confetti` is still a dependency.
  - `ok_auction.png` (fi and sv) is referenced by nothing.
- **Last checked:** prod dump 2026-11-11, all still present

### DEC-16 · Counter-offer range errors still call the field "Pyyntihinta"
- **Status:** Open · **Type:** Copy · **Severity:** Low
- **Where:** Negotiation modal, counter-offer amount outside 1-9 999 999 or not a whole number
- **Found:** 2026-11-02, re-checking the register against prod dump 2026-11-02
- **Evidence:** The counter-offer request still names its `amount` field with `tender.asking_price` ("Pyyntihinta", asking price), so Laravel's generic messages read "Kentän Pyyntihinta tulee olla välillä 1 - 9999999." and "Kentän Pyyntihinta arvon tulee olla numero." on a field labelled "Vastatarjous". The 2026-10-29 dump fixed the round-two message, which now reads "Vastatarjouksesi ei voi olla edellistä tarjoustasi korkeampi" (Your counter offer can't be higher than your previous one) instead of "Pyyntihinta liian korkea" (Asking price too high), and the empty-field message was fixed earlier. These two are what is left.
- **Last checked:** prod dump 2026-11-11, still present
- **Next step:** Point the attribute at the counter-offer label, or give the two rules their own messages. Small ticket.
- **Touches:** Asking price removal
