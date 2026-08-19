# Proto → Prod Parity Changes

Source: user list, 2026-08-18. Rule: no invented copy/visuals — reference prod app or ask.

Status: `[ ]` todo · `[~]` in progress · `[x]` done · `[?]` blocked on question

## Batch 1 — details page ✅ DONE
- [x] Rims illustrations. Rebuilt BOTH seasons as prod's side-by-side joined chip pair
      (`Chips.vue`/`Chip.vue`: rounded-l-lg + rounded-r-lg, min-w 50%, illustration right of label).
      Copied `rims.svg` + `no-rims.svg` from prod into `assets/`.
- [x] BONUS (user approved): rims question now hidden when that season's tyres = "Ei ole"
      (mirrors `EquipmentInfo.vue:188/:222`). Hidden answer is cleared, and both
      `isComplete('details')` + `validateAndContinue()` skip it so it can't block Continue.
- [x] "Varustelu" optional free-text added after Avaimet, before CTA. Copy verbatim from prod
      `tenderform.equipment_info.accessories_{title,tip,placeholder}`. Keys:
      `details.accessories{Label,Body,Placeholder}`. EN is my translation (prod has no EN — falls
      back to Finnish). Save/restore + live 0/1500 counter wired.

## Batch 2 — services page ✅ DONE
- [x] "Huoltohistoria" moved to first (now radio-group index 0; book type is index 1).
- [x] "Huoltokirjan tyyppi" now hidden when Huoltohistoria = "Ei huoltokirjaa"
      (mirrors `ServiceInfo.vue:33`). Hidden answer + bookType cleared; skipped in both
      `validateAndContinue()` and `isComplete('services')`.
- [x] SIDE EFFECT (had to fix): `updateHistoryVisibility()` used to hide Huoltohistoria +
      Viimeisin huolto until a book type was picked — that encoded the OLD order and made the
      new first question invisible. Both are now always visible, matching prod (neither is
      gated in ServiceInfo.vue).

### Open copy questions found in Batch 2 (not on user list — confirm before acting)
- Proto's 4th Huoltohistoria option is "Ei huoltokirjaa"; prod's `service_books.no_service_book`
  is "Ei tiedossa". Conditional is keyed to proto's existing label.
- ~~Prod shows per-option sub-descriptions~~ — RESOLVED, no proto change needed. Prod's
  `ServiceInfo.vue:26` reads `$tm('tenderform.service_info.service_book_descriptions')`, which
  does not exist (only defined at lines 3495/3745 under the `tender.*` tree). So descriptions
  silently never render in prod either. Proto already matches real prod behaviour.
  Likely a prod bug worth a ticket — the copy exists but is unreachable.

## Batch 3 — photos page ✅ DONE
- [x] Photo-count progress bar removed (markup + the `updateCTA()` lines that drove it).
- [x] "Erinomainen aika myydä" card removed. QR banner now vertically centred via auto
      margins in `mobile-upload-widget.js` (`injectQrBanner`) — verified 229px gap top and
      bottom. Save-draft row still pinned to the bottom.
- [x] Scratches section: title left as "Naarmut tai kolhut" and helper
      "Lisää kuvat, jos autossa on vaurioita." added (styled like the existing serviceBookHint).
      NOTE: user asked for "Naarmut **ja** kolhut" / "autos**si**" but prod actually says
      "Naarmut **tai** kolhut" / "autossa" — used prod's exact wording. Confirm if you'd
      rather override prod here.
      Also: `photos.scratches` in translations.js rendered just "Naarmut", overriding the HTML
      fallback — that was the real cause of the reported mismatch.

## Cross-page step-nav sync (fix, 2026-08-18)
The funnel step-nav (`initStepNav` → `isStarted`/`isComplete`/`hasPreviouslyLeft`) is DUPLICATED
verbatim in all 5 funnel pages: details / services / photos / price / contact.

Batch 1 and Batch 2 each only updated the page they were about, so the other 4 pages still used
the old completeness rules and drew the orange "incomplete" stepper for a step that was actually
done. Both rules are now synced across all 5 files:
- details: `kesaRimsOk` / `talviRimsOk` — rims only required when that season's tyres != 'Ei ole'
- services: `bookTypeOk` — book type only required when Huoltohistoria != 'Ei huoltokirjaa'

⚠️ RULE FOR FUTURE BATCHES: any change to step completeness must be applied to ALL FIVE pages.
Check with: `grep -c '<marker>' details.html services.html photos.html price.html contact.html`

## Batch 4 — car card placement ✅ DONE
- [x] contact.html: car card added to the right (tan) column, above the save-draft row.
      Loaded `vehicle-card.js` (page didn't use it before) + render on DOMContentLoaded and on
      bfcache restore. Uses the MID-FUNNEL variant (`{}`, not `successView`) — slate border,
      no "under review" badge, since nothing is under review pre-submit. Matches prod:
      `Sidebar.vue` `canPreviewDraft` includes `providingPersonalInfo`.
- [x] success.html: card MOVED from the left column to the BOTTOM of the right (tan) column,
      below "what happens next". This position also satisfies Batch 5's "car card at tan column
      bottom", so Batch 5 does not need to move it again.
- [x] Card no longer hidden in the email-not-verified branch — prod's `canPreviewDraft` includes
      `waitingForEmailVerificationBeforePublishing`, so the preview shows there too. That hiding
      was why it was missing from the default (no-param) view.
- [x] FIX (regression from the move): in `successView`, the "Tarkastus käynnissä" badge was
      centre-anchored and collided with the left-anchored price tag once the card sat in the
      narrower 337px tan column (59px overlap). Re-anchored top-right, reusing the exact anchor
      the sibling "Kuvat puuttuvat" badge in the same component already uses. Now 25px clear.

## Batch 5 — success page scenarios + layout
- [x] `in-review-unverified` vs default view — RESOLVED by unifying, not deleting.
      They were never two scenarios: the default (no-param) view is the REAL funnel endpoint
      (contact.html sends the seller there) and is driven by localStorage; `?scenario=` is a way
      to jump straight to a state. Deleting either would break something.
      The real problem was that they rendered the SAME state with DIFFERENT copy — the forced
      scenario used prod-verbatim strings, the organic branch used older proto `success.step*`
      keys ("Tark**i**stus" vs "Tark**a**stus", "Odotetaan tarjouksia" vs "Ilmoituksesi
      julkaistaan", etc).
      Fix: the organic branches now DELEGATE to the same `SUCCESS_SCENARIOS` definitions
      (`in-review-verified` / `in-review-unverified`), so one state renders one way regardless of
      how it is reached. Verified byte-identical output. Legacy inline copy deleted.
      The photos-missing branch stays bespoke — it has no prod analogue (proto-only state).
- [x] Illustration order corrected to prod's `Review.vue`: h1 → subtitle → badge → figure.
      Forced scenarios previously put the illustration ABOVE the headline.
- [x] `in-review-verified`: notice "Ota rennosti ja tarkkaile sähköpostiasi!" added (prod
      `Review.vue` in_review+verified branch, `tenderform.review.email_verified.notice.*` —
      same keys/copy the `published` scenario already used). Blue "Näytä tarjouspyyntöni" button
      retired; the notice's text link replaces it and carries the `&copy=` review-call variant
      through to offers.html.
- [x] Action components moved from the tan column to the MAIN (left) content area, placed after
      the illustration — matching prod `Review.vue` order (h1 → subtitle → badge → figure →
      notice/Notification). Covers "Mietitkö vielä?" (rejected), "Lataa kuvat jatkaaksesi"
      (rejected-missing-images) and "Ota rennosti…" (in-review-verified + published).
      Car card stays at the BOTTOM of the tan column (positioned there in Batch 4).
- [x] Organic (no-param) emailVerified branch given the same notice + button retirement, since
      it renders the same state as `in-review-verified`. All three organic branches now clear
      both containers so nothing leaks between states.
- [x] Tan right-hand column full-height in all scenarios: added `md:h-[calc(100vh-4rem)]
      md:overflow-y-auto` — the exact pattern details/contact/photos already use. Card given
      `mt-auto` so it stays pinned to the bottom. Verified 656px (= viewport − 4rem) on the
      empty-content `rejected` scenario; taller scenarios scroll inside the column, same as
      the other funnel pages.

## ALL BATCHES COMPLETE (1-5) ✅

## Known leftovers / follow-ups (not requested, not done)
- `translations.js`: `success.step1Title`–`step5Body`, `verifiedStep*`, `missingStep*` partly
  dead now that the organic branches render via SUCCESS_SCENARIOS. Not pruned — say the word.
- Step-nav logic still duplicated across 5 funnel pages; worth extracting to a shared file.
- Copy divergences from prod deliberately left (see Batch 2/3 notes): "Ei huoltokirjaa" vs prod
  "Ei tiedossa"; proto keeps "Vanteet (kesä)/(talvi)" where prod says just "Vanteet".

## Notes / dependencies
- Prod reference root: `Prod-codebase/autovex-2026-08-14-435a41f68ebc/resources/assets/js/`
- Funnel form steps live in `tenderRequestDraftForm/steps/`
