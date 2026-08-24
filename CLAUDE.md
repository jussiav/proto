# AutoVex / Wheelaway — Project Context

All project context lives in `/docs/`. Read the relevant files before making decisions.

## Reference Source Locations (updated 2026-08-20)

- **Production codebase (read-only reference):** `Prod-codebase/<folder>/` inside this project — currently `Prod-codebase/autovex-2026-08-20-99ed8bef6330/` (previous: `autovex-2026-08-14-435a41f68ebc/`). Newer dumps are added as sibling folders; always use the newest. Gitignored, never push, nothing in the proto depends on it.
- **Astro reference app (retired):** the Astro dev server (`localhost:4321`) no longer runs — its production copy was removed 2026-08-13. The custom proto pages/components (offers.astro, decision/, tarjouspyynto/, mocks) are archived at `../_archive-astro-proto/resources/astro/` — read the `.astro` source for structure and scenario mock data.
- All `resources/assets/js/...` paths in this file resolve inside the production codebase folder above; `resources/astro/...` paths resolve inside the archive.

**When to use docs:** Any change that is structural (navigation, layout, flow), communicational (copy, labels, error messages), or design-related (hierarchy, patterns, tone). Pure technical fixes (bug fixes, timestamps, config) don't require docs. When in doubt, read.

## Prototype Build Rules — MANDATORY

These rules apply to all new pages and components in this prototype, without exception:

1. **Never invent visual style.** Every color, spacing, shadow, border-radius, font size, and layout pattern must come from an existing source — either `design-library/tokens.css`, `design-library/tokens.js`, or by reading the equivalent production Vue component in `resources/assets/js/`. Do not guess or approximate.

2. **Never invent copy.** All labels, headings, button text, status text, error messages, and descriptions must come from the production codebase (`resources/assets/js/lang/` translation files, or directly from Vue component templates). Do not write new Finnish or English copy.

3. **Never invent flows or structure.** Page structure, section order, component hierarchy, and navigation must match the equivalent Astro prototype page (archived, see Reference Source Locations) or the production Vue app. The Astro dev server is retired — read the archived `.astro` source instead.

4. **Production color scale.** The `blue-*` Tailwind scale in this prototype is overridden to match `tailwind.config.js` in the project root (e.g. `blue-50 = #EEF6FA`, `blue-600 = #0B6DFF`). Never use the CDN Tailwind default blue. All new pages must include this override in their `tailwind.config` block.

5. **Production fonts.** Every page must define `font-display` (Barlow + system fallbacks) and `font-body` (DM Sans + system fallbacks) in the Tailwind config block. Apply `font-display` to all section headings (`<h2>` etc). Apply `font-body` to `<body>`. Serve pages over HTTP (`http://localhost:8080`) — Google Fonts does not load reliably over `file://`.

6. **Reference pages before building.** For any new page or component, first read the corresponding archived Astro page source and production Vue component files, then replicate. Code first, verify in browser (`http://localhost:8080`), adjust.

7. **One page, all scenarios.** Never create separate HTML files for different states of the same page. Each page handles all its scenarios via a `?scenario=` URL param — same names as the Astro prototype (e.g. `live-no-bids`, `new-offers`, `auction-live`). JS reads the param, builds mock data matching the Vue app's data shape, then drives all conditional rendering from that. Every scenario page includes a floating tester panel listing all named scenarios for that page.

8. **UiButton colors.** Default (no color prop) = blue variants: `secondary` → `bg-blue-100 hover:bg-blue-200 text-blue-800`, `ghost` → `bg-transparent hover:bg-blue-50 text-blue-600`. Slate variants only when `color="slate"` is explicit in the Vue component.

9. **Accordion/FAQ.** Use the MAccordion pattern: `<details class="group peer">` + sibling content div with `grid grid-rows-[0fr] opacity-0 peer-open:grid-rows-[1fr] peer-open:opacity-100 duration-150 transition-[grid-template-rows,opacity]`. Item wrapper: `bg-white p-3 rounded-md`. Title: `text-sm text-gray-700 group-open:font-bold`. Icons: `caret-down`/`caret-up` 16×16 `text-slate-500`. List gap: `space-y-2.5`. FAQ content comes from `faq.sellers_profile_faqs` in `vue-i18n-locales.generated.js` — all items, exact HTML.

10. **Nav bar — one shared definition, `site-nav.js`.** Never inline nav markup in a page and never re-add nav HTML to `layout.js`. A page opts in with `<div id="site-nav"></div>` followed immediately by `<script src="site-nav.js"></script>` (the script must come right after the mount so the nav exists before any inline page script that reads `#nav-login-label`).

    Blue variant, matching prod `ONavigationBar.vue` with `color="blue"`: spacer `<div class="h-20 bg-av-blue">` then a single `fixed h-20 bg-av-blue z-50` header, inner `nav` at `max-w-[1440px] mx-auto px-6` (prod's `max-w-screen-xxl`; `screens.xxl = 1440px`). White logo, menu items pushed right with `ml-16`, "Aloita kilpailutus" CTA (`lg:` and up only) + account icon + "Kirjaudu" label on the right.

    **Scroll = headroom.** One nav, no second white nav. Pinned within the top 96px; scrolling down past that unpins it (`translateY(-100%)`), scrolling up pins it back. `transition: transform 200ms linear`. Ported from prod's `useHeadRoom.js` (headroom.js, offset 96) + `sass/headroom.scss`.

    **Funnel pages have no nav** (details/price/services/photos/contact/success) — they omit both the mount and the script. Currently on the nav: `index.html`, `help.html`, `dac7.html`, `decision.html`, `offers.html`.

    **Menu items only on marketing pages.** In prod, `ONavigationBar`'s `menuItems` prop defaults to `[]`, and only two consumers pass anything: `Header.astro` (marketing, from Contentful) and `offers/landing` — there only for B2B sellers (`isB2BSeller ? menuItems : []`). Every consumer-facing app page (`offers/decision`, `PersonalInformationPage`, `auth`, `not-verified`, `complete-profile`) passes none, so `MMenu`'s `v-if="menuItems.length"` renders nothing. A proto page opts in with `<div id="site-nav" data-menu="marketing">` — currently only `index.html` and `help.html`. The CTA and "Kirjaudu" are NOT gated: prod's default `#actions` slot renders `MMenuCTA` + `MProfileMenu` on all of those pages.

    Prod source: `ONavigationBar.vue`, `Header.astro`, `useHeadRoom.js`. As of the 2026-08-20 dump the **white variant is gone** — the `color` prop was removed from `NavigationBarProps` entirely, `navigationVariants` is a fixed `bg-blue` object, and the spacer is unconditionally `h-20 bg-blue`. Blue everywhere is now prod, not a divergence.

## Proto Modes — dev vs test

`proto-mode.js` (loaded in `<head>` on every page) decides whether the
prototype's own tooling is visible. **The proto DEFAULTS TO DEV** — the team
uses it far more often than the roughly monthly user tests, so scenario
switchers, variant switchers and the prototype-instructions link are on unless
explicitly turned off.

| URL | Mode | Effect |
|---|---|---|
| *(no param)* | `dev` | All proto tooling visible. The default. |
| `?mode=test` | `test` | All proto tooling hidden. **Sticks** across pages and tabs. |
| `?mode=dev` or `?dev=1` | `dev` | Clears a stored test mode. |

Test mode persists in `localStorage` (`autovex_proto_mode`), not the URL, so a
moderator hands over ONE link and the participant keeps the clean view
everywhere — including links opened in a new tab, which is exactly when dev
chrome must not reappear. The cost is that test mode outlives the study, so
while it is active the console logs the exit instruction: invisible to a
participant, findable by whoever picks the machine up next.

Exposes `window.protoMode` (`'dev' | 'test'`), `window.protoDev` (boolean) and
`window.protoVariant(name, fallback)` — see **Initiatives** below.

**One control surface: `proto-bar.js`.** All proto tooling lives on a single
thin strip fixed to the viewport bottom — deliberately styled like browser
chrome (grey, system font, native `<select>`s) so it never reads as AutoVex UI.
Dev mode only. Present on every page, including ones with no scenarios, so the
mode is always legible. Collapses to a small corner tab; that state persists.

It replaced five inconsistent per-page drawers (offers, decision, photos,
success, dac7), the delivery-variant switcher on details, and the footer's
"Prototype instructions" link. `photos.html` also lost its `<footer>` — it was
the only funnel page with one, and it existed solely to host that drawer.

Shows: a `Prototype` identity chip, **Mode**, **Scenario**, **Variants** (one
row for the whole page, options grouped under the initiative that proposes them)
and **Go to**. No page name, no collapse control — the bar stays visible. The
Mode row is thin value while there are only two modes; it earns its place once
there are more.

**Pending:** a dedicated scenario-reference page, with each scenario
collapsible. The old single modal listing every scenario of every page was
removed; its content is in git history (`layout.js`, before the bar-cleanup
commit) for whoever builds that page.

A page declares what it offers by setting `window.protoPage` before
DOMContentLoaded:

```js
window.protoPage = {
  scenarios: [ { group: 'Drafts', items: [ { id, label } ] } ],  // or flat
  scenarioParam: 'scenario',        // default
  scenarioExtraParams: ['copy'],    // other params an option may set
  initiatives: [ {
    slug:    'delivery',   // the identity; name + spec come from the registry
    default: 'v2',         // what THIS page renders with no param
    variants: [ { id: 'control', label: 'Control — current design' } ]
  } ]
};
```

`fields` render as text inputs plus an Apply button, for params the page reads
at load (decision.html's offer-price overrides). `keepEmpty` keeps a
present-but-empty param, which decision uses to mean "force a single offer" as
distinct from the param being absent. `actions` render as buttons for things
that mutate simulated state rather than navigate (decision's "Simulate dealer
reply", "Reset counter offers").

An item may carry `params: { copy: 'soon' }` to set more than one param at
once — `success.html` needs `scenario=` and `copy=` together for the
review-call timing states, and two items may share an `id`. Any key listed in
`scenarioExtraParams` that an option does not set is cleared on navigation, so
switching away never leaves a stale param behind.

Page links resolve against the proto root, derived from `proto-bar.js`'s own
`src`. Guessing from the path would break on `design-specs/` pages, and
assuming `/` would break wherever the proto is served under a subpath.

**Scenario vs Variant are separate rows, deliberately.** Scenario = a state of
the world a real seller could be in. Variant = a design candidate that exists
only because we are proposing it. `details.html`'s delivery selector is a
variant, not a scenario.

## Initiatives — every variant belongs to one

A variant exists because some **initiative** proposes it. The bar has ONE
**Variants** row per page and groups its options under the initiative's name —
the same shape the Scenario row already uses for grouped states. One row scales
as initiatives accumulate, where a row each would push the bar off the screen,
and the grouping keeps every arm traceable, which a flat "Variant 1 / Variant 2"
list drawn from several initiatives could never be.

**The registry in `proto-mode.js` (`INITIATIVES`) is the single identity.** Each
entry is `{ slug, name, spec, prodArm }`; the slug is the URL param AND the
design-spec filename, so one grep finds every trace of an initiative. A page
declares only its own business — `{ slug, default, variants }` — and never
repeats the name or the spec path. Arm ids are `control` (today's design) and
`v1`, `v2`, … Scenarios an initiative introduces use the bar's `group:` support
with the initiative name as the optgroup label.

Registering matters twice over: an arm param is remembered the moment it appears
in any URL, not only on the pages that read it (otherwise a link to the funnel's
first step could not pin an arm for a change landing three steps later), and
selecting one variant can clear the others, including initiatives whose pages
you are not currently looking at. Add an entry when an initiative is created,
remove it when its winning arm is promoted.

**`prodArm` is not the same as a page's `default`.** `prodArm` is the arm that
matches production; `default` is what a page renders unasked. Every live
initiative currently defaults to its `prodArm`, so with no selection the whole
proto renders production — which is the state a user-test participant must land
in. The distinction is kept because an initiative may need to default to a
candidate while it is being demoed, and the bar's first option then tells the
truth either way: `— none — production behaviour` when every default on the page
IS the production arm, `— none — page defaults` when it is not.

**One variant at a time.** Selecting an arm clears every other registered
initiative, remembered arms included; the first option clears them all. So no
selection = every page renders what it renders unasked, which is what a user-test
participant must land in, and one click returns to it. Arms of initiatives this
page does not show are listed disabled under **Active on other pages** — they
change what the participant sees elsewhere and would otherwise be invisible.
Combinations stay reachable by hand-writing the params; the row then reads
`Mixed — N initiatives off default` rather than naming one arm and implying the
rest are off.

**Arms are sticky, via `window.protoVariant(name, fallback)`** in
`proto-mode.js`. An initiative usually spans several funnel steps, and funnel
navigation is a plain `window.location = 'contact.html'`, so a URL-only param
would die at every step boundary. Same precedence as the mode: param wins and is
remembered (`autovex_proto_variant_<slug>`), then the remembered arm, then the
page's default. It lives in `proto-mode.js`, not the bar, because the bar is
dev-only while arm links must work in test mode — that is how a moderator pins a
participant to one arm. A remembered non-default arm is logged to the console on
load, same escape hatch as test mode; picking `— none —` on the bar forgets it.

**Pages normalise what gets remembered.** A legacy alias or a typo'd arm
(`?delivery=stepper`, `?review-no-review=bogus`) would otherwise stick in
localStorage and leave the bar's row on `— none —` while the page rendered
something else. A page maps or clears it with `window.protoVariantSet(name,
value)` (`null` forgets), and the bar only ever selects a value the initiative
actually declares.

**Live initiatives:**

| Initiative | Slug / param | Page default | Prod arm | Pages | Spec |
|---|---|---|---|---|---|
| Delivery distance A/B test | `delivery` | `control` | `control` | `details.html` | `design-specs/delivery-distance.html` |
| Review/No review | `review-no-review` | `control` | `control` | `price.html` | `design-specs/review-no-review.html` |
| Seller file upload | `seller-file-upload` | `control` | `control` | `photos.html` | `design-specs/seller-file-upload.html` |

**Review/No review** makes funnel communication match whether the seller's car
is in the review segment. Change 1 removes the "Mitä tapahtuu seuraavaksi?"
component from the price step: prod's `WhatHappensNext` never sees `can_review`,
so at that step it promises the review call to every seller, including the ones
being asked for an asking price *because* they are outside the segment. The arm
hides `#price-what-happens-next`; on desktop the cream column keeps its size and
its save-draft mount and is otherwise empty — a deliberate divergence, since
prod's `Sidebar.vue` keeps `VehicleMetrics` there. Below 768px the column
(`#price-sidebar`) is hidden outright, matching prod's
`shouldShowSidebarOnMobile`, which is driven by `WhatHappensNext`: stacked under
the form an empty column is just a 64px strip of cream padding. The rule is
hand-written CSS keyed to `body[data-rnr-arm]`, not `max-md:hidden` — the
Tailwind Play CDN only generates utilities present at first paint. Default is `control`, so with no
param the proto stays prod-faithful. See the Review Segment section above for
the `can_review` chain this is about.

**Seller file upload** adds a documents section to the photos step — PDF, Word or
images, listed by filename with no thumbnails, each linking to the file in a new
tab. `photos.html` gates the section on `html[data-files-arm="v1"]`, stamped in
`<head>` so control never paints it.

Two things about it are deliberately NOT variants. **Listing is unconditional:**
any surface that shows sellers their own ad content lists files when
`store.files` is non-empty — on the ad-preview sheet they join the existing
**Kuvat** section as a `Muut tiedostot` category row, the same shape as
Ulkopuoli/Sisätilat, not a section of their own — because there is nothing to
A/B about showing someone what they attached. The sheet stays read-only:
filename links, no delete, per-section edit links as before. And **the car
card shows nothing** — prod has no file concept there.

The add control on the photos step is a **text link with a plus icon**, not a
filled button — a full-width blue block read as equally important as the
step's own "Jatka", more attention than an optional section should draw. The
hint and the size/count limits are one combined paragraph, not two, for the
same reason: the section should read as a footnote next to the photo sections
above it.

Files never touch the photo rules: not counted toward the 5-photo minimum, never
completing or blocking the step, even when the file is an image.

Two proto-only mechanics worth knowing. The bytes are stored as data URLs in
`localStorage`, which is why the cap is 1 MB per file / 5 files — base64 inflates
by a third and the photo data URLs are already in there; production should allow
far more, and the spec carries that as an open question. And links are built as
**blob URLs at render time**, because Chrome refuses to open a `data:` URL as a
top-level document; they are revoked on re-render. Quota failures are caught and
shown as an error rather than swallowed by `setStore`, since a silently dropped
file looks uploaded until the next reload.

Shipped alongside it: the proto's Huoltokirja section used to accept
`application/pdf` with a "kuvia tai PDF-tiedostoja" hint, which prod's
image-only `ImageUpload.vue` never did. Both arms now use prod's exact accept
list and prod's own service-section copy, so the PDF capability belongs to v1
alone. **All FI/EN copy for this initiative is a draft pending approval** — prod
has none, since the feature does not exist there.

### Initiative lifecycle

1. **Live** — spec page status chip says *ready to build* / *in test*; the arms
   are switchable from the initiative's bar row.
2. **Promoted** — the winning arm becomes the only code. Delete the losing arms,
   the page's `initiatives` declaration AND the registry entry (the option group
   disappears, the param stops being read), plus any copy nothing renders any
   more — if `v1` wins on
   Review/No review, the whole `nextSteps` namespace leaves `translations.js`,
   since `price.html` is its only consumer.
3. **Completed** — the spec page stays, its chip changed to *completed — `<arm>`
   promoted, `<month year>`* with a line naming what shipped, and the row above
   moves to a **Completed initiatives** list here. The record survives; the
   switch does not.

**Adding proto-only UI:** prefer putting it on the bar. If it must be its own
element, mark the root with `data-proto-dev` AND skip building it when
`!window.protoDev`. The CSS rule (`[data-proto-dev]{display:none !important}`)
is a safety net; not building it is the actual fix.

**Guard placement matters.** `if (!window.protoDev) return;` must sit inside the
panel's own IIFE, never in an enclosing function that has page logic after it.
Two pages broke this way during implementation — `details.html` would have
skipped `updateCard()`, and `decision.html` rendered no state at all until the
panel was wrapped in its own IIFE.

**`?scenario=` and initiative params still work in test mode.** URL carries the
state; only the chrome is gated. That is how a moderator pins a participant to a
starting state they cannot navigate out of.

## Review segment — will this seller be called?

Prod computes ONE boolean and hands it to the frontend as `can_review`. **Treat
the decision as general, not as "the Filament filters".** Filament is only how it
is decided today; the team's plan is a wider decision engine, and the consumer
seller flow makes no distinction about where the decision was made — same two
paths either way. Model the outcome, never the mechanism. Today's chain:

```
TenderRequestReviewSettings (Filament: enabled, fuel_types, min/max_model_year,
min/max_mileage)  →  EvaluateDraftForReview  →  Resource: can_review
```

The settings are a **whitelist** (`ReviewIfPreferredSegment` validates the car
falls INSIDE the band), so a high-mileage or old car is NOT review-called.

**Where it shows in the UI:** only `PriceInfo.vue`. `can_review: false` swaps the
price step to an asking-price question (`tenderform.price_info.asking_price_*`,
required) instead of the optional estimate, and `CONFIRM_PRICE_INFO` goes
straight to `submitting` — the price step is the last step, the draft publishes
rather than going to review.

Everything downstream branches on the resulting **draft status**, not on
`can_review`: `review_comms_content` exists only when `isInReview()`, and
`WhatHappensNext` keys off status. Offers and decision have no `can_review`
branching at all; `asking_price` is passed to `CarCard` but never rendered, and
C2BDecision's own comment says it is "being phased out of the consumer journey".

**Proto implementation.** `price.html` derives it from the seeded car —
mileage > 240 000 km or older than 10 years — matching the current Filament
values, which are expected to drift. `?scenario=asking-price` /
`price-estimate` forces either variant. The choice is recorded as
`store.reviewable`, and `success.html`'s `draftScenario()` maps it plus login
state onto the four states prod can actually be in:

| | not verified | verified |
|---|---|---|
| reviewable | `in-review-unverified` | `in-review-verified` |
| not reviewable | `queued` | `published` |

Verified against prod: `PublishDraft` marks for review only when
`EvaluateDraftForReview` passes; otherwise an unverified seller is queued
(`draftShouldBeQueuedForPublishing`) and a verified one publishes outright. Both
of those statuses take `WhatHappensNext` branches that DROP the
"Ilmoituksesi tarkistetaan / Soitamme sinulle" step, so **a non-reviewable seller
is never promised the call after the price step** — only on it. The organic
(no-`?scenario=`) path used to render the in-review state for everyone, which
promised the call to sellers prod would never call; `currentDraftStatus()` now
follows the same mapping so the card badge cannot contradict the page.

**Both badges are transcribed from prod, per state.** The page badge and the
card badge are different components in prod and do NOT always agree — reproduced
as-is:

| draft status | page badge (own markup per screen) | card badge (`UiBadge` via `Preview.vue`) |
|---|---|---|
| `in_review` | Tarkastus käynnissä · hourglass · `bg-slate-200 border-gray-300 text-gray-500` | Tarkastus käynnissä · hourglass · gray |
| `rejected` | **Ei hyväksytty** · warning-octagon · `bg-transparent border-red-300 text-red-700` | **Tietoja tarvitaan** · warning-octagon · light_red |
| `rejected` + missing images | Tietoja tarvitaan · warning-octagon · same red | Tietoja tarvitaan · warning-octagon · light_red |
| `queued_for_publishing_after_verification` | Vaatii toimenpiteitä · warning-octagon · `bg-amber-50 border-amber-400 text-amber-700` | Vaatii toimenpiteitä · warning-octagon · amber |
| `published` | Odotetaan tarjouksia · **hourglass** · `bg-white border-cyan-400 text-cyan-600` | **prod renders no card at all** — see below |

**Prod shows the car card in only some of these states.** `shouldShowPreview` is
`isWaitingForReviewInReview || (canPreviewDraft && funnelType !== 'open_funnel')`,
and `canPreviewDraft` lists `confirmingProvidedEmail`, `providingPersonalInfo`,
`publishingDraft` and `waitingForEmailVerificationBeforePublishing` — not
`success`, and not `waitingForReview` with a rejected draft. `Success.vue` renders
no card of its own either. So:

| state | card in prod? |
|---|---|
| `in_review` (verified or not) | yes — `isWaitingForReviewInReview` |
| `queued_for_publishing_after_verification` | yes — `canPreviewDraft` |
| `rejected`, with or without missing images | **no** |
| `published` | **no** |

`Preview.vue`'s `draftStatusConfig.published` entry — the untranslated literal
`'Published'` plus a warning-octagon icon — is therefore **dead config**: the only
path to it is the `publishingDraft.complete` microstep, which XState resolves
inside one macrostep, so it never paints. Do not treat it as prod behaviour, and
do not add a `published` entry to `DRAFT_BADGES` — there is nothing to render it.

**The no-review car's own ending, verified against prod.**
`VerifyTenderRequestDraftEmailController` logs the seller in and, when the draft
is queued, calls `publishDraft` on the spot; the funnel's `onMounted` then sends
`CONFIRM_PUBLISHED`, whose `isDraftPublished` guard targets `.success`. So the
no-review seller's verification click publishes the ad and lands them on
`Success.vue` — the same screen a seller who was already verified at submit
reaches, since `Success.vue` has no branch on how you got there. One screen, two
entry paths, which is why `success.html` models it as the single `published`
scenario (menu group "Published — no review") rather than two. Content checked
element by element: title/subtitle verbatim from `tenderform.published.*`, badge
`Odotetaan tarjouksia` + hourglass + `bg-white border-cyan-400 text-cyan-600`,
illustration byte-identical to prod's `published.png`, the peach notice block
(`review.email_verified.notice.*`, underlined text link to /offers),
`WhatHappensNext`'s published branch — `ad_published.title_alternative` +
`auction_in_progress` + `auction_ends` — and no car card.

`success.html` follows that table: a scenario carries `card: false` for
`rejected`, `rejected-missing-images` and `published`, and `SCENARIO_DRAFT_STATUS`
only maps the states that actually draw a card. Plain `rejected` then has neither
steps nor card, so the column is empty — prod fills it with `VehicleMetrics`,
never ported here — and below 768px it is dropped entirely
(`html[data-success-sidebar="empty"]`), which is prod's own
`shouldShowSidebarOnMobile = shouldShowWhatHappensNext || providingPersonalInfo`.

`DRAFT_BADGES` in
`vehicle-card.js` spells out `UiBadge`'s variants including `iconColor`, since
UiBadge colours the icon separately and its `light` variant is the one where icon
and text differ (slate-400 vs slate-500). Badge icons are `1em`, and the badge's
font-size step is prod's `text-xs xs:text-sm` with prod's custom `xs` = 460px,
hand-written in the card's shell CSS because the proto does not override
Tailwind's default screens.

**The seller's own price is never shown back to them.** Prod passes
`asking_price` into `CarCard` (`Preview.vue`) and `CarCard` never renders it —
the prop is declared and unused — and `CarDetailsCard`, the modal behind the
card's CTA, has no price field at all. (`PreviewModal.vue` does render it, but
nothing imports that component.) The proto's card had a price tag overlaid on the
photo; it is gone, along with `card.priceLabelTarget` and `buildCarCard`'s
`mediaOverlay` prop, whose only caller it was. The ad-preview sheet still echoes
the value — it is the seller's own summary of what they typed, per section — and
labels it with the field they actually filled: `price.askingLabel`
("Pyyntihintasi", prod's `price_info.asking_price_label`) outside the review
segment, `price.targetLabel` inside it.

**Mirroring a prod inconsistency deliberately:** the sidebar bullet count
follows LOGIN state, not `can_review`. `WhatHappensNext` has no `can_review`
reference at all — it takes only `draftStatus`, `isVerified` and
`missingImages`, and at the price step the status is `open`. So:

- not logged in → all 5 steps
- logged in → `slice(1)` → 4 steps, `verify_email` dropped

Both lists still lead with "Soitamme sinulle", so **prod promises the review
call at the price step in both price variants** and only stops afterwards: the
one list without the review step is the `queued_for_publishing_after_verification`
branch, which is exactly the status a non-reviewable seller reaches after
submitting unverified. Reproduced as-is in the `control` arm; the fix is Change 1
of the **Review/No review** initiative below, which removes the component from
this step entirely.

Because rows are hidden rather than re-rendered, the numbered badges are
reassigned by visible position (`renumberSteps`) — they are pre-rendered SVGs,
where prod's `MNumberedSteps` prints `index + 1` and renumbers for free.

**`auto_rejected` is a different mechanism** — `AutoRejectsUnfitVehicle` with its
own `unfit_cars_auto_rejection` config, disabled for Finland. Not the review
filters; easy to conflate.

## Login state — `loggedIn`

One flag, `store.loggedIn`, means "email verified" AND "logged in", because in
prod they are the same event: the app only knows the address is verified because
the seller returned via the email link, which logs them in. Renamed from
`emailVerified` for that reason.

The nav's first name is gated on it (`site-nav.js`, and `index.html`'s own
`syncNavLoginLabel`) — a filled-in contact step is not a session. `offers`,
`decision` and `dac7` are logged-in-only contexts and set the flag themselves as
part of their scenario setup.

The URL param `?emailVerified=1` and the `emailVerified` postMessage keep their
names: those are the email link's contract, not the stored state.

## Mock Funnel Data — `proto-mock.js`

Seeds `localStorage` as if a seller had walked the funnel. Loaded in `<head>`
(after `proto-mode.js`) so seeding happens before page scripts read the store.
Shapes were captured from a real funnel walk, not invented, so they match what
the pages actually read.

Solves two things the bar could not reach on its own:

- **Front-page hero states** come from funnel state, not a URL param, so
  `empty` / `draft-incomplete` / `draft-complete` / `in-review` /
  `auction-ongoing` / `auction-ended` / `deal-completed` were unreachable.
  `index.html` opts in with `data-proto-mock` on `<html>`; the bar drives them
  through the normal `?scenario=` param.
- **Car details on offers/decision/success** were blank unless you had actually
  walked the funnel. The bar has built-in **Seed car** and **Reset data** on
  every page.

**Seed car and Reset prototype are named states, not a separate mechanism.**
Seed car = `draft-complete`; Reset prototype = `empty`, and it always returns to
`index.html` — clearing in place would leave you on a mid-funnel or offers page
with nothing to render.

`draft-complete` must satisfy every step's `isComplete()`, not just carry
plausible data. Three things bite:
- `services.radioGroups` stores the option's **label text** (`saveServices` in
  services.html), so the strings must match the rendered labels exactly.
- `services.bookType: 'paper'` is deliberate — `isComplete` only demands
  `tiedot` when the book is `digital` or `both`.
- `contact.kayttoehdot` and a non-empty `services.korjaukset` are both required;
  `details.avaimet` must be `'2 tai enemmän'`, not any other wording. They were originally a loose car-details merge that left
the store and the bar's scenario menu disagreeing, producing front-page
combinations you could not sensibly continue from.

The front page reports its live state via `scenarioCurrent: PROTO_MOCK.detect`,
so the menu tracks the store rather than the URL. On a `data-proto-mock` page
seeding drops `?scenario=` (it would otherwise re-seed the old state over the
new one); everywhere else the param is the page's own and survives, so seeding a
car on offers keeps the offers scenario you were looking at.

```js
window.PROTO_MOCK.seed('in-review');  // a named state
window.PROTO_MOCK.car();              // just the car, keep everything else
window.PROTO_MOCK.clear();            // first-time visitor
window.PROTO_MOCK.states              // { name: label }, consumed by the bar
```

Selecting a mock scenario **overwrites funnel progress** — that is the point,
the scenario *is* the state, but it means a half-finished walkthrough is lost.

## Current Work: Offers + Decision Pages

**Goal:** Port `offers.astro` and `decision/[...tenderId].astro` from the Astro prototype to vanilla HTML in this Claude-Figma prototype, connected to the existing funnel via `success.html`.

**Status:**
- `offers.html` — in progress. Core structure done (nav, AuctionsProgress, TenderRequests, FAQ). Needs: `?scenario=` param wiring, all scenario states, floating tester panel.
- `decision.html` — not started
- `success.html` → `offers.html` link — not started
- `index.html` progress card update — not started

**Scenario approach — single page per route:**
`offers.html` supports all scenarios via `?scenario=` (matching Astro prototype param names). JS at page load reads the param, builds mock data matching the Vue app's data shape, then drives all conditional rendering — same logic as `landing/index.vue`. Scenario list (from `offers.astro`):
- `live-no-bids` — auction live, no bids yet (AuctionsProgress + TenderRequests, cyan badge)
- `auction-live` — auction live with bids (AuctionsProgress + TenderRequests, cyan badge)
- `new-offers` — auction ended, unseen offers (TenderRequests only, lime badge, "Näytä tulokset" CTA)
- `seen-offers` — auction ended, seller viewed offers
- `no-offers` — auction ended, zero offers
- `all-rejected` — seller rejected all offers
- `draft-in-review`, `draft-open`, `draft-rejected`, `draft-queued` — draft states (Drafts section)
- `accepted`, `deal-completed`, `deal-failed` — post-sale states
- `blank` — empty state

Default scenario (no param): `new-offers` — matches the post-funnel flow from `success.html`.

**Reference files for offers/decision pages:**
- Structure/visual reference: archived Astro sources `../_archive-astro-proto/resources/astro/pages/offers.astro` and `.../pages/decision/` (dev server retired — read the source)
- Scenario data: `../_archive-astro-proto/resources/astro/pages/offers.astro` (complete mock data for every scenario)
- Layout: `resources/assets/js/pages/offers/landing/index.vue`
- Car card: `resources/assets/js/pages/offers/components/CarCard.vue`
- Timer: `resources/assets/js/pages/offers/components/Timer.vue`
- Status badge colors: `resources/assets/js/components/ui/UiBadge.vue`
- Button styles: `resources/assets/js/components/ui/UiButton.vue`
- Decision page: `resources/assets/js/pages/offers/decision/index.vue`
- FAQ data: `resources/assets/js/lang/vue-i18n-locales.generated.js` → `faq.sellers_profile_faqs`

**Later phases (not started):**
- Phase 5: Supabase migration (replaces localStorage; enables QR cross-device photo upload)

## Design Spec Pages (`design-specs/`)

Public dev-facing spec pages on GH Pages (e.g. `design-specs/delivery-distance.html`) document design changes: previous issues, live demo, states, behavior rules, data contract, copy. They are delivered to devs and discussed with the team.

**Sync rule — MANDATORY:** whenever the proto app (`details.html` etc.) or a `design-specs/` page is edited, the counterpart must be updated in the same change: behavior, states, data contract, and all FI + EN copy in `translations.js`. Spec-page live demos load `../translations.js` + `../i18n.js` directly (same `details.*` keys via `data-i18n`), so copy stays in sync automatically — but structural/behavioral changes must be mirrored by hand in both directions. Doc prose stays English; production copy shown verbatim; copy tables show both languages statically (no toggle needed there).

## Design Library

Always read `design-library/components.md` before any UI work. Use `design-library/tokens.css` and `tokens.js` for all tokens — never hardcode colors, spacing, or typography. Visual reference: https://storybook.autovex.fi/

## Documentation

- **[Product Overview](docs/product_overview.md)** — Core model, flow, critical rules. Read first.
- **[Business Goals](docs/business_goals.md)** — What success looks like, tradeoffs, failure modes.
- **[User Pain Points](docs/user_pain_points.md)** — Known friction in the funnel and post-auction.
- **[UX Principles](docs/ux_principles.md)** — Design principles. Always apply.
- **[Copy Guidelines](docs/copy_guidelines.md)** — Tone, vocabulary, Finnish product terms.
- **[Anti-Patterns](docs/anti_patterns.md)** — Patterns to avoid, even if they improve short-term metrics.
- **[Decision Playbooks](docs/decision_playbooks.md)** — How to handle specific user scenarios.
- **[Opportunity Areas](docs/opportunity_areas.md)** — Prioritized areas for improvement.
- **[Real Examples](docs/real_examples.md)** — Concrete good/bad UX and copy examples.
- **[How to Use](docs/HOW_TO_USE.md)** — How to apply this kit across AI tools.
- **[Component Gallery Process](docs/component-gallery-process.md)** — How to add, update, and maintain Vue components. MUST follow when touching any component, `COMPONENTS.md`, or `components.html`.
