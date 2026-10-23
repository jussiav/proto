# Emails and content

Transactional emails (in the codebase), marketing lifecycle emails (SendGrid and
Klaviyo, outside it), CMS copy, and copy that reaches dealerships.

### EML-01 · Marketing lifecycle emails still promise a review call
- **Status:** Reported · **Type:** Copy · **Severity:** Medium
- **Where:** SendGrid lifecycle emails to consumer sellers (draft nurture, photo tips, asking-price help, "soitamme sinulle pian"), one of them in a subject line
- **Found:** 2026-09-07, Review/No review initiative, change 5
- **Evidence:** Not in the codebase. Selective review calling means many sellers are never called, so a promised call becomes a wait that never ends.
- **Next step:** With Marketing. The brief is change 5 on the Review/No review design spec (`design-specs/review-no-review.html`).
- **Touches:** Review/No review, Seller intent phase 2

### EML-02 · Two transactional emails are only true while review works as it does today
- **Status:** Watching · **Type:** Copy
- **Where:** Email verification for a new seller ("…ja tiimimme on tarkastanut ilmoituksesi", our team has checked your listing); missing-photos reminder ("asiantuntijamme kanssa käymäsi puhelun mukaisesti", as agreed in your call with our expert)
- **Found:** 2026-09-07, Review/No review change 4, closed with no change
- **Re-opens if:** listings stop being checked before publishing (verification email), or photo chasing is automated rather than triggered by an advisor after a call (reminder).
- **Touches:** Review qualification engine (BO-01), any automation of photo reminders

### EML-03 · Rejection email's link target is unknown
- **Status:** Open · **Type:** UX
- **Where:** The email a seller gets when an advisor rejects their ad
- **Found:** 2026-09-30, Seller edits before review assessment
- **Evidence:** Sent as a Klaviyo event, so the button target lives in Marketing's template, not in the codebase. Wherever it points, the seller lands on the funnel's saved-position behaviour (FUN-06).
- **Next step:** Ask Marketing for the link target. It should point at the edit entry, not the list.
- **Touches:** Seller edits before review

### EML-04 · Support FAQ links the support address as a page path
- **Status:** Open · **Type:** Defect · **Severity:** Low
- **Where:** Support page (/tuki) FAQ, two answers
- **Found:** 2026-09-07, transcribing the CMS FAQ for Review/No review change 3
- **Evidence:** The CMS authors the link as `/mailto:tiimi@autovex.fi`. The leading slash makes it a relative page link, so clicking the address goes nowhere.
- **Next step:** One-character fix in the CMS entry. Re-check the live page; not verifiable from a code dump.

### EML-05 · Dealer-facing asking price: one email shows it, and the first-bid minimum reveals it
- **Status:** Reported · **Type:** UX · **Severity:** Medium
- **Where:** Dealership side: the daily "new leads" email (only dealer email with a euro asking price), the minimum first bid shown in the bid field and its error, two negotiation emails that use the word "pyyntihinta" for the seller's counter offer
- **Found:** 2026-09-23, audit for Asking price removal; dealer emails re-checked 2026-09-24
- **Evidence:** None of these three dealer emails appears in Filament's Transactional Emails preview, which is why they were hard to find. The B2B reserve is already hidden from buyers by a gate that could be extended to C2B. The dealer UI shows the C2B asking price too: the search teaser's photo overlay, the first figures cell on the request page, and sorting and filtering by it in search. Only B2B is hidden.
- **Last checked:** prod dump 2026-10-23, still present
- **Next step:** Handed to the team 2026-09-24; no change requested yet.
- **Touches:** Asking price removal, dealership squad work
