# Environments

Preview (`autovex-pr-NNNN.test.autovex.io`) and staging problems that block or
slow down testing. Not product defects, but each one decides what a PR test
can prove.

### ENV-01 · No call tags seeded on preview environments
- **Status:** Open · **Type:** Environment
- **Where:** Filament → Reviews → a booked draft → Accept or Reject
- **Found:** 2026-10-22, PR 2546 preview test
- **Evidence:** The required **Tags** field lists nothing ("Ei vaihtoehtoja saatavilla"). Tags are filtered by the booking's context, and none exist for it on the preview. No advisor can accept or reject any review there.
- **Next step:** Seed at least one tag for the review context in the preview seeders.
- **Touches:** Any PR test that needs an advisor decision (accept → queued, reject → missing photos, call logged without a decision)

### ENV-02 · Preview email goes to Mailpit, which loses its mail on restart
- **Status:** Watching · **Type:** Environment
- **Where:** Every email a preview environment sends, whatever the recipient
- **Found:** 2026-10-22, PR 2546 preview test. Corrected the same day: the first version of this entry said previews send no email, which was wrong.
- **Evidence:** All mail is caught by Mailpit at `https://mailpit-pr-NNNN.test.autovex.io/` (PR 2546: `mailpit-pr-2546`). Its storage does not survive a restart: by the afternoon it had restarted and held none of the morning's test mail.
- **How to test:** Open Mailpit before starting, and check and screenshot each email while the test runs (`/api/v1/messages` lists them, `/api/v1/info` shows uptime). To get a verification link without the email: Filament → Tender Request Drafts → open the draft → **Copy Verification Link**. That list opens with a "Status: OPEN" filter; clear it to see drafts in review or queued.
- **Next step:** Persistent Mailpit storage per preview would let a test be checked after the fact.

### ENV-03 · Intermittent 502 / 504 responses on preview
- **Status:** Watching · **Type:** Environment
- **Where:** `/api/vehicles/{id}/models` (model dropdown), plus "Yhteytesi on hidas" toasts in the funnel and "Live updates disconnected" in Filament
- **Found:** 2026-10-22, PR 2546 preview test
- **Evidence:** Repeated 502s for about a minute, then 200 again with no change on our side.
- **Workaround:** Wait and reselect the make.

### ENV-04 · Plate lookup returns no vehicle data on preview
- **Status:** Open · **Type:** Environment
- **Where:** Funnel equipment step
- **Found:** 2026-10-22, PR 2546 preview test
- **Evidence:** Every plate lands on "Täytä autosi tiedot" with an empty form. Make, model and year must be typed by hand, and some makes (Kia) had no models.
- **Next step:** A stubbed lookup returning a known car for a test plate would make "car found" flows testable.

### ENV-05 · Preview image URLs repeat the preview path segment
- **Status:** Open · **Type:** Environment · **Severity:** Low
- **Where:** Uploaded photo URLs on preview
- **Found:** 2026-10-22, PR 2546 preview test
- **Evidence:** URLs contain `previews/pr-2546/previews/pr-2546/public/...`. Images still load, so only worth a look if storage paths are ever compared between environments.

### ENV-06 · Offers-page FAQ shows "null" where the support email should be
- **Status:** Open · **Type:** Environment · **Severity:** Low
- **Where:** Offers page FAQ, "Miten toimin, kun autoliike ei ole reagoinut vastatarjoukseeni…", on the PR 2546 preview
- **Found:** 2026-10-22, PR 2546 preview test
- **Evidence:** The answer ends with "…kauppojen sopimiseksi. null". The copy itself is fine: `Faqs.vue` fills `{email}` from the site's seller support email setting, and on the preview that setting is empty, which JavaScript turns into the text "null".
- **Next step:** Set the setting in preview seed data. Optionally render nothing when it is missing. Check that production has it set.
