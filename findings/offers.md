# Offers page

The seller's own page: notifications ("Ajankohtaista"), live auction progress,
unfinished and submitted ads, published ads, FAQ.

### OFF-01 · A dealer closing the negotiation shows a generic "act now" notification
- **Status:** Open · **Type:** Defect · **Severity:** Medium
- **Where:** Offers page notifications, after a dealership closes a negotiation
- **Found:** 2026-08-26, offers and decision audit
- **Evidence:** `updates/main.vue` has a finished "negotiation stopped" notification block, but its list is never declared as a prop or passed in by `C2B.vue`, so it never renders. The seller gets the generic offers-validity notification ("Toimi nyt! Viimeistele kaupat", Act now! Finish the deal) instead.
- **Last checked:** prod dump 2026-10-23, still present
- **Next step:** Probably a one-line wiring fix. Check the copy is still wanted after Enhanced negotiations.
- **Touches:** Enhanced negotiations follow-ups

### OFF-02 · The referral-source question returns on every visit after closing it
- **Status:** Open · **Type:** UX · **Severity:** Low
- **Where:** Offers page, "Mitä kautta kuulit meistä?" (How did you hear about us?) modal
- **Found:** 2026-10-22, PR 2546 preview test
- **Evidence:** Closing with × and reloading brings it back each time (seen five times on the seed seller). Not yet checked whether that is by design until answered.
- **Next step:** Check the intended rule (ask once, ask until answered, or ask again after N days).

### OFF-03 · Should the auction-time edit modal stay?
- **Status:** Open · **Type:** Opportunity
- **Where:** Offers page, "Muokkaa tietoja" on a published ad (edit modal for an ad in auction)
- **Found:** 2026-10-05, out of scope for Seller edits before review
- **Evidence:** Edits before review now go through the full funnel. The modal edits the published ad, and some of its fields arguably should not change once dealerships are bidding. Freeing it would also make the edit linear (one screen, one save).
- **Touches:** Seller edits before review, any listing-edit work

### OFF-04 · Unused auction-progress string
- **Status:** Open · **Type:** Cleanup
- **Where:** `auction.landing.auctions_in_progress.pick_up_offered` ("Noutopalvelua tarjoavat")
- **Found:** 2026-08-26, offers and decision audit
- **Evidence:** Only in the language files; `Timer.vue` renders total bids, bidders and end time.
- **Last checked:** prod dump 2026-10-23, still unused
