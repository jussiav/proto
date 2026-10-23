# Funnel

Front page hero, the ad creation funnel (equipment → service → photos → price →
contact), and the waiting and success screens after submitting. Includes
editing an ad before review (PR 2546).

### FUN-01 · Front page shows the "finish your ad" hero for an ad that is already submitted
- **Status:** Open · **Type:** UX · **Severity:** Medium
- **Where:** Front page hero for a returning seller whose latest ad is in review or waiting for email verification
- **Found:** 2026-10-22, PR 2546 preview test
- **Evidence:** The hero reads "Laitetaan Corolla liikkeelle! Viimeistele tarjouspyyntö ja saat oikeita tarjouksia autoliikkeiltä." (Let's get the Corolla moving! Finish your listing…) with "Tee uusi tarjouspyyntö (Nykyinen tarjouspyyntösi poistetaan)" (Make a new listing; your current one will be deleted). `useExistingDraft.js` drops the stored draft only when it is `published`, expired or fails to refresh. The "will be deleted" note is not true for a submitted ad: the button only starts a new draft.
- **Last checked:** prod dump 2026-10-23, still present
- **Next step:** Show this hero only for unfinished drafts, or give submitted ads their own state. The proto has a proto-only "under review" hero for this case (see `CLAUDE.md`, Review segment).
- **Touches:** Seller edits before review (an in-review ad is now editable, so "finish your listing" reads even more like a task)

### FUN-02 · Waiting-screen car card shows the make without the model right after submitting
- **Status:** Open · **Type:** Defect · **Severity:** Low
- **Where:** Waiting screen (funnel success), car card in the right column, first load after submit
- **Found:** 2026-10-22, PR 2546 preview test
- **Evidence:** Card reads "Toyota" instead of "Toyota Corolla". `Preview.vue` looks the names up in make and model lists by id and falls back to an empty string when the model list is not loaded on that screen.
- **Last checked:** prod dump 2026-10-23, still present

### FUN-03 · 280 000 km is shown as an error but accepted
- **Status:** Open · **Type:** Defect · **Severity:** Medium
- **Where:** Front page hero form; the funnel's own first step and /hinta-arvio show the same error
- **Found:** 2026-10, Huutokaupat routing initiative
- **Evidence:** The browser shows `driven_more_than_max` from 280 000 up, but submit ignores client errors, and the server rule `between:0,280000` is inclusive. So at exactly 280 000 the seller sees an error and the funnel opens anyway.
- **Last checked:** prod dump 2026-10-23, still present
- **Next step:** Huutokaupat routing `v6` routes 280 000 and up on the front page (VWO test). The funnel's first step and /hinta-arvio are out of that scope and still need a decision.
- **Touches:** Huutokaupat routing, Price guess `v4` (hinta-arvio)

### FUN-04 · Car details card prints raw values for fuel, drive and last service
- **Status:** Open · **Type:** Defect · **Severity:** Low
- **Where:** "Avaa tiedot" (Open details) sheet from the waiting screen and the Offers page
- **Found:** 2026-09-30, aligning the proto's ad-preview sheet with prod
- **Evidence:** `CarDetailsCard.vue` prints `fuel_type` and `drive_type` untranslated, and prints `last_service_date` as its key because its translation line is commented out. The VAT line also sits above the "Varusteet" heading.
- **Last checked:** prod dump 2026-10-23, still present
- **Next step:** Small ticket: translate the three values the way the car card already does.

### FUN-05 · A rejected ad with missing photos still lists "your listing is being reviewed"
- **Status:** Open · **Type:** Copy · **Severity:** Low
- **Where:** Waiting screen after an advisor rejects the ad for missing photos, "Mitä tapahtuu seuraavaksi?" list
- **Found:** 2026-09, transcribing the rejected screens
- **Evidence:** In `WhatHappensNext.vue`, `rejected` returns an empty list only when no photos are missing; otherwise it falls through to the generic list, whose first step says the listing is under review.
- **Last checked:** prod dump 2026-10-23, still present

### FUN-06 · Editing a rejected ad takes two clicks, and the path changes after two weeks
- **Status:** Open · **Type:** UX · **Severity:** Medium
- **Where:** Offers page, rejected-ad buttons ("Päivitä tarjouspyyntöä")
- **Found:** 2026-09-30, Seller edits before review assessment
- **Evidence:** The buttons first open the waiting screen showing the rejection; the seller then presses "Päivitä tarjouspyyntöä". The funnel resumes a saved position that expires at the draft's `expires_at` (two weeks after entering review). After that, drafts not routed to a status screen restart at the funnel's first step.
- **Last checked:** prod dump 2026-10-23, still present
- **Next step:** A link that opens a specific step (the design spec for Seller edits before review names it as a possible later addition).
- **Touches:** Seller edits before review

### FUN-07 · The funnel only steps back one step, and the equipment step has no back at all
- **Status:** Open · **Type:** UX · **Severity:** Medium
- **Where:** Funnel progress bar and step buttons
- **Found:** 2026-09-30, Seller edits before review assessment
- **Evidence:** `ProgressBar.vue` only allows going back to the previous step, and the equipment state has no back transition. A seller who wants to fix the photos from the price step clicks back twice.
- **Last checked:** prod dump 2026-10-23, still present
- **Next step:** The proto deliberately lets sellers jump to any started step; judge editing ease with that difference in mind. Matters more now that whole-funnel edits exist (PR 2546).
- **Touches:** Seller edits before review, any funnel step work

### FUN-08 · The success screen says the auction is about to start, forever
- **Status:** Parked · **Type:** UX · **Severity:** Medium
- **Where:** Funnel success screen ("Jännittävää! Tarjouskilpailu on alkamassa.", Exciting! The auction is about to start.)
- **Found:** 2026-09-16, raised by a developer
- **Evidence:** The screen reads only the draft, which stays `published` for good, and never re-checks. Sellers reach it days later from a tab left open, a reload or bookmark, re-clicking the verification email, or the add-photos email.
- **Next step:** Waiting on a team decision; no fix is an accepted outcome. Proposed rules: no seller-facing link lands on a page that cannot show current state; login-walled pages prompt login and continue; time-sensitive pages re-check on focus. Adding auction status to the success screen was rejected (duplicates the Offers page).
- **Touches:** Any email link work, Enhanced success page

### FUN-09 · Ask for missing photos without rejecting the ad
- **Status:** Open · **Type:** Opportunity
- **Where:** Advisor review → seller
- **Found:** 2026-10-05, out of scope for Seller edits before review
- **Evidence:** Today the only way to get photos added before review is an ad-quality rejection. With edits before review shipping, an advisor could ask for photos while the ad stays in review.
- **Touches:** Seller edits before review, back office (BO-04)

### FUN-10 · The rejected-ad screen needs its own design
- **Status:** Open · **Type:** Opportunity
- **Where:** Waiting screen in status `rejected`
- **Found:** 2026-09, Seller intent
- **Evidence:** Prod's `rejected` means "a person looked and it needs fixing". Seller intent keeps a `reject` outcome declared but unreachable until this screen is redesigned, because a low-intent decline is a different message.
- **Touches:** Seller intent phase 2, Enhanced success page

### FUN-11 · A logged-in seller's contact step also rewrites their account
- **Status:** Watching · **Type:** UX
- **Where:** Contact step for a logged-in seller starting a new ad
- **Found:** 2026-10-05, Seller edits before review
- **Evidence:** Submitting calls `completeProfile` with name and phone (plus marketing consent when set), so a phone number changed for one ad changes it for the account and every ad. Advisors book by phone number.
- **Last checked:** prod dump 2026-10-23, still present
- **Re-opens if:** contact fields become editable in edits again. PR 2546 locks them.

### FUN-12 · Hotjar rating survey keeps its "Seuraava" button despite the hide hack
- **Status:** Watching · **Type:** UX · **Severity:** Low
- **Where:** Waiting screen in review, Hotjar survey at the bottom of the left column
- **Found:** 2026-10-22, from a production screenshot
- **Evidence:** `Review.vue`'s `onMounted` hides Hotjar's button and clicks it when a star is chosen. The screenshot still shows the button, so the hack probably no longer matches Hotjar's markup. Not verifiable from the dump.

### FUN-13 · An edit can leave an in-review ad below the 5-photo minimum
- **Status:** Reported (PR 2546 QA report) · **Type:** Defect · **Severity:** High
- **Where:** Edit before review, photos step
- **Found:** 2026-10-22, PR 2546 preview test (F1)
- **Evidence:** Delete photos to 4, Jatka, "Jatka ilman kuvia": the step saves 4 photos to the in-review draft. The final save then refuses, but the 4-photo state is already stored.
- **Next step:** Confirm fixed in the first dump containing PR 2546.

### FUN-14 · A refused final save during an edit shows no message
- **Status:** Reported (PR 2546 QA report) · **Type:** UX · **Severity:** Medium
- **Where:** Edit before review, last step → back to photos
- **Found:** 2026-10-22, PR 2546 preview test (F2)
- **Evidence:** `seller-edit-completions` returns 422 "Lisää vähintään 5 kuvaa" and the funnel returns to the photos step silently. The skip modal's "Tallennamme luonnoksesi, joten voit … lisätä kuvat myöhemmin" (we'll save your draft, so you can add photos later) is not true during an edit.

### FUN-15 · "Viimeisin huolto" is not pre-selected when editing
- **Status:** Reported (PR 2546 QA report) · **Type:** Defect · **Severity:** Low
- **Where:** Edit before review, service step
- **Found:** 2026-10-22, PR 2546 preview test (F3)
- **Evidence:** The stored value is intact and not cleared, but no option shows as selected. Check whether a normal funnel "Takaisin" does the same; if so it predates the PR.

### FUN-16 · Locked contact fields look editable, and the heading asks the seller to check them
- **Status:** Reported (PR 2546 QA report) · **Type:** UX · **Severity:** Low
- **Where:** Edit before review, contact step
- **Found:** 2026-10-22, PR 2546 preview test (F4)
- **Evidence:** All fields are disabled, but only phone looks greyed. The logged-in heading still reads "Tarkista yhteystietosi" (Check your contact details).

### FUN-17 · Reload during an edit restarts at the equipment step
- **Status:** Reported (PR 2546 QA report) · **Type:** UX · **Severity:** Low
- **Where:** Edit before review, any step after the first
- **Found:** 2026-10-22, PR 2546 preview test (F5)
- **Evidence:** Edit mode and saved data survive; the position does not.

### FUN-18 · Step bar on the first edit step leaves out "Hinta"
- **Status:** Reported (PR 2546 QA report) · **Type:** Defect · **Severity:** Low
- **Where:** Edit before review, equipment step
- **Found:** 2026-10-22, PR 2546 preview test (F6)
- **Evidence:** Shows four steps where a new ad shows five; the price step still appears later.

### FUN-19 · Clearing the make requests models for "null"
- **Status:** Open · **Type:** Cleanup
- **Where:** Equipment step, make dropdown → clear
- **Found:** 2026-10-22, PR 2546 preview test
- **Evidence:** `GET /api/vehicles/null/models` fires (502 on preview).

### FUN-20 · Dead "Published" badge config in the funnel preview card
- **Status:** Open · **Type:** Cleanup
- **Where:** `Preview.vue`, `draftStatusConfig.published`
- **Found:** 2026-09, transcribing card badges
- **Evidence:** Untranslated literal 'Published'. Unreachable: the only path to it resolves within one state-machine step and never paints.
- **Last checked:** prod dump 2026-10-23, still present
