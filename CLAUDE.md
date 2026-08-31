# AutoVex / Wheelaway — Project Context

All project context lives in `/docs/`. Read the relevant files before making decisions.

## Reference Source Locations (updated 2026-08-27)

- **Production codebase (read-only reference):** `Prod-codebase/<folder>/` inside this project — currently `Prod-codebase/autovex-2026-08-26-1ee95731e59f/` (previous: `autovex-2026-08-20-99ed8bef6330/`, `autovex-2026-08-14-435a41f68ebc/`). Newer dumps are added as sibling folders; always use the newest. Gitignored, never push, nothing in the proto depends on it.
- **Astro reference app (retired):** the Astro dev server (`localhost:4321`) no longer runs — its production copy was removed 2026-08-13. The custom proto pages/components (offers.astro, decision/, tarjouspyynto/, mocks) are archived at `../_archive-astro-proto/resources/astro/` — read the `.astro` source for structure and scenario mock data.
- All `resources/assets/js/...` paths in this file resolve inside the production codebase folder above; `resources/astro/...` paths resolve inside the archive.

**When to use docs:** Any change that is structural (navigation, layout, flow), communicational (copy, labels, error messages), or design-related (hierarchy, patterns, tone). Pure technical fixes (bug fixes, timestamps, config) don't require docs. When in doubt, read.

## Prototype Build Rules — MANDATORY

These rules apply to all new pages and components in this prototype, without exception:

1. **Never invent visual style.** Every color, spacing, shadow, border-radius, font size, and layout pattern must come from an existing source — either `design-library/tokens.css`, `design-library/tokens.js`, or by reading the equivalent production Vue component in `resources/assets/js/`. Do not guess or approximate.

2. **Never invent copy.** All labels, headings, button text, status text, error messages, and descriptions must come from the production codebase (`resources/assets/js/lang/` translation files, or directly from Vue component templates). Do not write new Finnish or English copy.

3. **Never invent flows or structure.** Page structure, section order, component hierarchy, and navigation must match the equivalent Astro prototype page (archived, see Reference Source Locations) or the production Vue app. The Astro dev server is retired — read the archived `.astro` source instead.

4. **Production color scale.** The `blue-*` Tailwind scale in this prototype is overridden to match `tailwind.config.js` in the project root (e.g. `blue-50 = #EEF6FA`, `blue-600 = #0B6DFF`). Never use the CDN Tailwind default blue. All new pages must include this override in their `tailwind.config` block.

5. **Production type scale — `tw-tokens.js`.** Prod's `tailwind.config.js`
   replaces several default scales, so a class copied out of a prod component
   used to render at a different size here. Every page loads `tw-tokens.js`
   directly after its own `tailwind.config` block; it merges in prod's
   `fontSize` from `3xl` up (28/32/40/48/56/64, where the CDN defaults are
   30/36/48/60/72/96), prod's `screens` (`xxs` 360, `xs` 460, `sm` 620,
   `md` 768, `lg` 992, `xl` 1200, `xxl` 1440) and prod's half-step `spacing`.
   **Prod's `lineHeight` scale is deliberately NOT ported** — prod's `leading-5`
   is 30px against the default 20px, and the proto has ~235 uses written against
   the default meaning. Transcribe a prod leading as pixels instead
   (`leading-[30px]`). Prod's numbers: 1:16 2:21 3:24 4:28 5:30 6:36 7:40 8:48
   9:52 10:56.

   Fonts: prod's `<body>` is `font-body`, i.e. **DM Sans is the base** and Barlow
   appears only where a component says `font-display`. Barlow is loaded at
   400/600/700, matching prod's own faces — the proto used to load 700 alone, so
   every Barlow `font-medium` silently rendered bold.

6. **Funnel field and heading conventions, transcribed from prod.** Use these
   rather than inventing a size; each is a real prod class string:

   | Role | Prod source | Classes |
   |---|---|---|
   | Step title | `<h2 class="heading-2 font-bold">` (`ServiceInfo`, `ImageSections`, `PersonalInfo`, `EquipmentInfo`) | `font-barlow font-bold text-3xl leading-[36px] lg:text-5xl lg:leading-[48px]` |
   | Price step title | `PriceInfo.vue` — a `<div role="heading">`, NOT an `h*` | `font-dm font-bold text-2xl lg:text-3xl leading-[30px]` |
   | Group legend | `<legend class="text-xl font-bold mb-4">` | `font-dm font-bold text-xl` |
   | Field label / sub-legend | `Input.vue`, `NumberInput.vue`, `labels.rims`, `labels.maximum_distance` | `font-dm font-medium text-base leading-none` |
   | Photo section title | `ImageSections.vue` `<legend class="text-base font-medium">` | `font-dm font-medium text-base` |
   | Option card | `Chip.vue` / `RadioButtons.vue` | `border border-gray-500 rounded-lg bg-white p-4`, 14px apart |
   | Option label — heavier | `Chip.vue` `<span class="font-semibold">` inside a `font-display` label | `font-barlow font-semibold text-base text-black` |
   | Option label — lighter | `RadioButtons.vue` `<span class="ml-2 font-medium">` | `font-barlow font-medium text-base text-black` |
   | Option description | `Chip.vue` `<span class="text-sm">` | `font-barlow text-sm text-black` |
   | Text input | `NumberInput.vue` | `h-14 px-4 border border-gray-500 rounded-lg text-base` |
   | Textarea | `TextArea.vue` | `p-4 text-base leading-[21px] border border-gray-500` |
   | Info / hint line | `PriceInfo.vue` `<div class="text-sm">`, `ServiceInfo` tip `<div class="text-base">` | `font-dm text-sm` / `font-dm text-base` |

   **Headings are Barlow because of the tag, not a class.** `custom.scss` applies
   `font-display` to `h1`–`h5`, so every step title — an `<h2>` in prod — is
   Barlow, while the price step's `<div role="heading">` is DM Sans. Reproduce the
   family explicitly here; the proto has no such element rule.

   **Two option-label weights, and the difference is the component.** `Chips`
   (Barlow **semibold**) is what the funnel uses — service book, service history,
   windscreen, tyres, rims, keys. `RadioButtons` (Barlow **medium**, which lands
   on 400 since prod ships no 500 face) appears only on `ReplacementQuestions` and
   `ReferralSource`, steps this proto has no copy of — so it is the right analogue
   for a NEW question added to the funnel, which is why the seller-intent options
   use it. Do not mix them within one group.

   Field borders are **`gray-500`** (#6B7280), not `slate-400`. Radio selection
   keeps the proto's `border-2 border-av-blue` rather than prod's `outline-2`;
   same result, and the proto's JS toggles borders everywhere.

   **Column widths.** Prod's funnel is two halves of `max-w-screen-xxl`
   (`TenderRequestDraftForm.vue`: `lg:w-1/2` each, no padding or gap on the row —
   each half carries its own). Inside the left half every step is
   `w-full max-w-md` = **448px, centred** (`flex flex-col items-center`), the
   ProgressBar is the one wider element at `max-w-lg` = **512px**, and the logo
   sits at the half's left edge. The proto reproduces this with a `.funnel-col`
   class plus `.funnel-logo` / `.funnel-steps` markers and three hand-written
   rules — utilities would mean editing ~40 direct children across six pages. The
   cream sidebar is `lg:w-[calc(50%-3rem)] lg:m-6`, which is prod's
   `lg:w-1/2 lg:p-6` around a filling card expressed on one element. Below `lg`
   the halves stack and the proto's own `px-8`/`gap-8` and `max-md:px-5` apply.

   Watch for labels that look like field labels but are group legends in prod:
   `location_title` ("Missä autosi sijaitsee?") and
   `damage_and_service_information_title` ("Korjaukset ja viat") are both
   `text-xl font-bold`, while `labels.rims` ("Vanteet (kesä/talvi)") and
   `labels.maximum_distance` are sub-labels under a legend.

7. **Production fonts.** Every page must define `font-display` (Barlow + system fallbacks) and `font-body` (DM Sans + system fallbacks) in the Tailwind config block. Apply `font-display` to all section headings (`<h2>` etc). Apply `font-body` to `<body>`. Serve pages over HTTP (`http://localhost:8080`) — Google Fonts does not load reliably over `file://`.

8. **Reference pages before building.** For any new page or component, first read the corresponding archived Astro page source and production Vue component files, then replicate. Code first, verify in browser (`http://localhost:8080`), adjust.

9. **One page, all scenarios.** Never create separate HTML files for different states of the same page. Each page handles all its scenarios via a `?scenario=` URL param — same names as the Astro prototype (e.g. `live-no-bids`, `new-offers`, `auction-live`). JS reads the param, builds mock data matching the Vue app's data shape, then drives all conditional rendering from that. Every scenario page includes a floating tester panel listing all named scenarios for that page.

10. **UiButton colors.** Default (no color prop) = blue variants: `secondary` → `bg-blue-100 hover:bg-blue-200 text-blue-800`, `ghost` → `bg-transparent hover:bg-blue-50 text-blue-600`. Slate variants only when `color="slate"` is explicit in the Vue component.

11. **Accordion/FAQ.** Use the MAccordion pattern: `<details class="group peer">` + sibling content div with `grid grid-rows-[0fr] opacity-0 peer-open:grid-rows-[1fr] peer-open:opacity-100 duration-150 transition-[grid-template-rows,opacity]`. Item wrapper: `bg-white p-3 rounded-md`. Title: `text-sm text-gray-700 group-open:font-bold`. Icons: `caret-down`/`caret-up` 16×16 `text-slate-500`. List gap: `space-y-2.5`. FAQ content comes from `faq.sellers_profile_faqs` in `vue-i18n-locales.generated.js` — all items, exact HTML.

12. **Nav bar — one shared definition, `site-nav.js`.** Never inline nav markup in a page and never re-add nav HTML to `layout.js`. A page opts in with `<div id="site-nav"></div>` followed immediately by `<script src="site-nav.js"></script>` (the script must come right after the mount so the nav exists before any inline page script that reads `#nav-login-label`).

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
row for the whole page, options grouped under the initiative that proposes them),
the page's own tooling popover if it declares any, **Seed car** / **Reset
prototype**, and **Go to**. No page name, no collapse control — the bar stays
visible. The Mode row is thin value while there are only two modes; it earns its
place once there are more.

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

**Page-specific tooling is ONE popover, not a row each.** A page's `fields` and
`actions` collapse behind a single button named by `panelLabel`, so whatever a
page declares costs one slot on the strip:

```js
window.protoPage = {
  panelLabel:  'Auction settings',   // the button; `panelTitle` is its tooltip
  fieldsLabel: 'Prices €',      fields:  [ { key, label, placeholder, width, keepEmpty } ],
  actionsLabel: 'Negotiation',  actions: [ { label, title, run } ]
};
```

`fields` are URL params the page reads at load (decision.html's offer prices),
applied together on Enter or via Apply. `keepEmpty` keeps a present-but-empty
param, which decision uses to mean "force a single offer" as distinct from the
param being absent. `actions` mutate simulated state rather than navigate
(decision's four **Dealer response** actions: reply-and-continue, close with
prod's pre-filled message, close with no message at all, and reset); picking one
closes the popover, which would otherwise sit over the result it just produced.

The two close variants exist because prod's closing `message` is
`nullable|string|max:999` and `CloseNegotiation` stores exactly what arrived —
`CloseNegotiation.vue` pre-fills `close_negotiation.message_pre_filled`, but a
dealer who clears the box closes with the amount alone. Both are what a seller
can really receive, so both are testable. A close never moves the price (it
copies `tenderOffer->amount`), and prod gates the dealer's close control on
`dealerCanSendMessage` exactly as it gates their reply, so closing is reachable
only in place of answering a counter-offer — never straight after their own
reply.

**Reset counter offers navigates, it does not clear in place.** Clearing
`NEGOTIATIONS` and re-rendering left the modal open over the thread it had just
deleted, and left the page on a negotiation-derived scenario whose cards still
said "Vastatarjous lähetetty" — which the seeding blocks would then rebuild on
the next load. Reset now drops the negotiation, returns `counter-offer-sent` /
`dealer-replied` / `negotiation-stopped` to **`seen-offers`** (the same world
without a negotiation: same request shape, offers already revealed, reaction
window open) and reloads. Any other scenario is kept — reset undoes the
negotiation, not the tester's setup.

Inline, these were seven controls on a strip shared with every page's own rows —
decision.html alone put more on the bar than the rest of it held. The cost of
collapsing is that an override becomes invisible, so **the button reports one**:
it takes the dark chip styling plus a count, and names the values in its
tooltip. Without that a hand-written `?asking=` would be hidden behind a closed
panel.

`keepEmpty` only started working when `withParams` stopped treating an empty
string as "delete the param" — it had been deleting `second=` on every Apply, so
"force a single offer" was reachable only by hand-writing the URL. Callers pass
`null` to clear; `''` now means set-and-keep.

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

**The spec page lists five changes, numbered 1–5** — price step, contact step,
support FAQ, transactional emails, SendGrid lifecycle emails. It was cut from 942
lines to ~490: the sections explaining why the initiative exists, how to try the
arms, the data contract, the post-submit routing (no code change), the copy
cleanup (done), the already-correct-in-prod list, the audit and the candidates
all came out, along with every prototype file name and arm id. It is a list of
what production has to change, nothing else — the proto-side detail lives here in
CLAUDE.md instead. Two of the old numbers no longer have a section, so the
numbering shifted: old Change 4 (support FAQ) is now **3**, old Change 6
(transactional emails) is now **4**, and the SendGrid family was promoted from a
sub-heading to **5** so it appears in the change log as work with no owner.

**Live initiatives:**

| Initiative | Slug / param | Page default | Prod arm | Pages | Spec |
|---|---|---|---|---|---|
| Delivery distance A/B test | `delivery` | `control` | `control` | `details.html` | `design-specs/delivery-distance.html` |
| Review/No review | `review-no-review` | `control` | `control` | `price.html` | `design-specs/review-no-review.html` |
| Seller file upload | `seller-file-upload` | `control` | `control` | `photos.html` | `design-specs/seller-file-upload.html` |
| Seller intent | `seller-intent` | `control` | `control` | `price.html` | `design-specs/seller-intent.html` |

**Seller intent** asks one question per arm on the price step, below the
estimate field, to learn how ready the seller actually is to sell — today the
review call is decided from the car alone (`can_review`), so two identical cars
get identical treatment whether the seller is handing the keys over next week or
idly curious. Arms: `v1` handover timing as five options, `v2` the same question
verbatim as a native date field (min today, max +1 year) and nothing else, `v3`
selling situation as five options. `control` asks nothing.

**Its own initiative, not an arm of Review/No review, because it ships first.**
It therefore does NOT hide `#price-what-happens-next` and does NOT change the
contact step's submit copy — both belong to that initiative, both stay exactly as
prod has them on every intent arm. Folding the question into `review-no-review`
would have made the first thing out of the door depend on changes that land after
it, and would have collided with promotion: arms are deleted per initiative, and
these two have different winners.

**Phase 1 is inert, deliberately.** The answer is stored and nothing branches on
it: every seller who sees a question is still review-called, exactly as control.
Which answers should downgrade a seller is what the A/B exists to learn, so
guessing the mapping now would bake the guess into the result. `deriveOutcome({
inSegment, intentAnswer })` in `price.html` is the single place phase 2 edits; it
ignores `intentAnswer` today. Its three-valued return (`review` | `publish` |
`reject`) keeps `reject` declared and unreachable — the rejection path is parked
until the `rejected` success screen is redesigned (a later initiative), and prod's
`rejected` status today means "a human looked and it needs fixing", which a
low-intent decline is not.

The question is asked **only inside the review segment** — a car outside it is not
review-called either way, so `?scenario=asking-price` renders no question on any
arm. It is **optional and marked so** by an info-icon line under the answers
(`intent.note`), the same treatment the estimate field above uses for its own
note — not a suffix on the question label; a skip is treated exactly like never
being asked. Answers
are stored **by stable id**, `sellerIntentQuestion` + `sellerIntentAnswer`
(`seller_intent_question` / `seller_intent_answer` in the dev contract, both
nullable) — not by label text, which is what `services.html`'s `radioGroups`
does and why its mock data has to match rendered copy character for character.
Switching arm or leaving the segment clears the answer: an answer exists only
where the question was asked. Nothing about the answer reaches the ad preview
sheet or the car card; it describes the seller's situation, not the ad. All FI/EN copy is
a draft pending approval, FI as specified by the team.

Two presentation details. The step's headings sit one Tailwind notch above where
the proto had them — `#price-headline` at `text-3xl leading-9`, which matches
prod's own `lg:text-3xl` (`PriceInfo.vue` is `text-2xl lg:text-3xl`), and the
intent section header at `text-2xl leading-8`, keeping it one step below the
page's own question. And **the date field's Finnish placeholder is drawn by the
page**: a native `<input type="date">` takes its hint text, month names and
picker buttons from the BROWSER's locale, not the page's `lang`, so
`.intent-date:not(.has-value)::-webkit-datetime-edit` hides the field's own text
while empty and a span shows `pp.kk.vvvv` over it. The picker popup itself stays
browser-locale — nothing on the page can reach inside it.

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

The four post-submit landings were walked
organically (price → contact → submit → verification link) and match prod's own
routing — `waitingForReview` → `Review.vue` for a review-called seller either side
of verification, `waitingForEmailVerificationBeforePublishing` →
`PublishQueue.vue` for a no-call seller who has not verified, `success` →
`Success.vue` once they have. The pairing worth remembering: **no-call +
unverified lands on the queued screen, which mentions no call at all**, and the
page badge and card badge agree. A copy cleanup deleted the strings that promised the call
and rendered nowhere — the old `success` confirmation set (including a stale
duplicate of the price step's next-steps list, and a duplicate `step1*` pair that
silently shadowed itself) plus `dac7.step2*`, 53 lines across both languages.
`nextSteps.*` stays until `v1` promotes. `dac7.html`, which had no `data-i18n` at all,
is now wired to its namespace — 23 attributes covering headings, field labels,
placeholders, the FAQ bodies and the submit-time "Täytä tämä kenttä" message,
which the page's own handler now reads through `t()`. Its dead keys went with it
(a completed screen and a next-steps list the page does not have), and where a
never-rendered key disagreed with the copy the page was actually showing, the
page won: `pageTitle`, `intro2` and `submitBtn`.

Change 2 takes the promise out of the **contact step's submit button**:
prod's `personal_info.submit` reads "Lähetä tarkastukseen" with no `can_review`
branch, which is already false outside the review segment and becomes false
inside it once a seller-intent answer can downgrade someone. The `v1` arm renders
`contact.submitBtnNeutral` ("Lähetä ilmoitus") for everyone — **one copy, no
outcome branching**, because three outcome-specific copies would leak the decision
a step before we state it. `contact.html` reads the arm in `<head>` and owns the
label itself; the `data-i18n` attribute was removed so a language switch cannot
overwrite the arm's string. The offers-return case keeps its plain "Valmis" in
both arms.

Change 3 of the same initiative reaches the **support page's FAQ**, not the app:
five items presented the review call as something every seller gets. The revised
copy makes it conditional with one word — `tarvittaessa`, or `tapauskohtaisesti`
where the sentence is about our own process — so nothing is promised and nothing
is denied. An item in `faq-content.js` may carry a `v1` field beside its CMS `a`
text; `help.html` reads the arm through `protoVariant` and picks the override, so
control still shows exactly what the CMS shows today. The page declares the
initiative in its own `protoPage`, so the arm is switchable there too. In
production there is no arm — the CMS entry is edited when the change ships. A
sixth item ("why wasn't I called?") was considered and dropped: once nothing is
promised, there is no broken expectation to explain.

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
above it. The section sits INSIDE the photo-sections wrapper (not after it) so
it gets the same `gap-10`/`md:gap-16` spacing as every other section — it used
to be a sibling of that wrapper, which gave it only the outer column's
`gap-6` and made it read as glued to the section above it.

Each file row uses the paperclip icon prod already gives a draft's `open`
status (`DRAFT_ICON_PAPERCLIP`, prod's `ph-bold-paperclip`) rather than a
second document glyph, shows no file size, and deletes with the EXACT button a
photo thumbnail uses — a `bg-gray-100` square with a bold "+" rotated 45°,
prod's own `.remove-button` technique (`ImagePreview.vue`), not a redrawn SVG X
— one delete affordance and one "there is an attachment" icon across the step,
not component-specific ones. The ad-preview modal's file rows use the same
paperclip, left of the filename, for the same reason.

**The whole photos step's baseline styling was brought in line with prod**
(`ImageUpload.vue`/`ImagePreview.vue`/`ImageSections.vue`) at the same time,
since the documents section needed an accurate foundation to sit on, not a
foundation that itself diverged from prod. Empty/placeholder cells:
`bg-gray-100 border rounded shadow-md` (prod's dummy-slot card), not the
proto's old `bg-slate-100`/`rounded-md`/custom drop-shadow. Uploaded photos:
`border-transparent` once accepted — prod drops the border rather than ringing
it, so the blue `ring-2 ring-av-blue` the proto used to add on upload is gone.
The outer dashed container is `border-2 border-dashed border-gray-500` (prod's
`ImageSections.vue` wrapper), not `border border-slate-400`. The "add more"
cell lost its own dashed box and centered outline plus — it is now styled
exactly like every other empty cell, with the same small top-right filled-black
plus icon the silhouette placeholders already used (prod's `.upload-button`
plus, corner-positioned), rather than a second, differently-drawn plus.

**A second pass matched tile proportions, spacing, and photo fill.** Tiles are
`aspect-[2/1]` sized from their own width, not a fixed `h-20` — prod's
`ImagePreview.vue` has no height utility at all, only `aspect-ratio-2/1`, so
every tile's height now follows its width the same way. Uploaded photos are
`object-contain`, not `object-cover`: prod shows the whole photo letterboxed
inside the gray card rather than cropping it to fill, and the tile's own
background is what shows in the letterboxed margins. Spacing: the outer
container is `p-4` and `.photo-grid` is `gap-4`, both landing on 16px — prod
gets that same 16px two ways (its own `p-2` wrapper plus each cell's own `p-2`,
stacked), which this reproduces as one padding/gap value each rather than
adding a real per-cell wrapper div, since nothing here depends on that
wrapper existing. **Delete button position:** prod's own `-top-2 -right-2`
button also carries `p-4` padding around a smaller inner box; the padding
pulls the *visible* square back in more than the negative offset pushes it
out, landing it ~8px inset from the corner — which is what both the prod and
proto screenshots actually show, not a button hanging off the edge. `top-2
right-2` on the single visible element reproduces that exact net position
directly, without also copying a hit-target padding this static prototype has
no touch-target reason to need.

**A tile-width mismatch broke wrapping.** The tile-width formula changed from
`calc(50% - 5px)` to `calc(50% - 8px)` when the gap grew from `gap-2.5` to
`gap-4` (see above), but that edit matched only the HTML `style="width:..."`
attribute form — `makeThumbnail`/`makeRestoredThumbnail` set their width via
`div.style.width = '...'` (a JS property assignment, different string shape),
so those two kept the old, now-too-wide value. Two tiles at the old width plus
the new 16px gap summed to just over 100%, which is enough for `flex-wrap` to
push the second tile onto its own line — and once one tile wraps, everything
after it cascades onto its own line too. Only visible once a row actually
contained one of the two dynamically-created tile types (an extra photo
beyond the required slots, or one restored from storage on reload) next to a
placeholder-slot or add-slot; a row of only static tiles never exposed it,
which is why it survived the earlier verification pass. Fixed by updating
both JS assignments to match.

Files never touch the photo rules: not counted toward the 5-photo minimum, never
completing or blocking the step, even when the file is an image.

**The byte unit is a translation key, not a string in the formatter.** Finnish
abbreviates megatavu/kilotavu as `Mt`/`kt`, so `files.unitMb`/`files.unitKb`
carry it per language and `fileLabel()` concatenates whichever is current. The
unit fills `{size}` in both `files.description` and `files.errSize` — the only
two places the seller reads the limit — so hardcoding `MB` would leak English
into Finnish copy there. `renderFiles` is already bound to `av:langchange`, so
the description re-renders with the right unit on a language switch. English
doc prose on the spec page still says "1 MB"; that is documentation, not copy.

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
list, so the PDF capability belongs to v1 alone — and the hint line is gone
entirely, since prod's `ImageSections.vue` renders no description under a section
title (`photos.serviceBookHint` was deleted with it).

**Empty photo slots carry prod's hover copy.** `ImagePreview.vue` scales an
unaccepted slot (`hover:scale-102 transition hover:shadow-lg`) and puts
`t('tenderform.add_image')` on the upload button's `title`. Both are reproduced —
`photos.addImage` holds prod's exact "Lisää kuva" — plus one deliberate addition:
a `.slot-add-label` span that fades the same copy in on hover, because a native
tooltip is delayed and invisible on touch. It is hand-written CSS, not utilities,
since the label is injected by JS and the Play CDN only generates classes present
at first paint; `syncSlotTitles()` keeps both the title and the label in step with
the language. **All FI/EN copy for this initiative is a draft pending approval** — prod
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

**Seed car's photos are the same assets `photos.html`'s own "Photos filled"
scenario uses** (`SCENARIO_PHOTOS` in `proto-mock.js`, mirroring
`_loadFilledScenario`'s file list) — one real car across every surface, not a
single placeholder image repeated. Covers all four sections that scenario
fills (ulkopuoli, sisatilat, huoltokirja, renkaat), stored as plain asset paths
rather than fetched-and-inlined data URLs: a plain path renders fine as a plain
`<img src>`, and `fillSlot`/`isPdf`/`isHeicDataUrl` only special-case strings
that start `data:`, so nothing on the photos step needs to know the difference.

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

## Negotiation states on the decision page

Prod has **three** of them, and the difference is the negotiation's status, not a
flag on the offer. `useC2BDecisionPageOfferMapping`'s `getOfferStatus` derives the
card status and `usePostAuctionStatus` derives the hero:

| negotiation | card status | badge | negotiate CTA | help line under it | hero |
|---|---|---|---|---|---|
| `PENDING` (0) — seller sent, waiting | `negotiation` | Odotetaan liikkeen vastausta · clock · amber | **Vastatarjous lähetetty** | shown | price tier |
| `COUNTER_OFFER_SENT` (7) — dealer answered | `negotiation` | Liikkeeltä on tullut vastaus · chats · lime | **Näytä vastaus** | shown | price tier |
| `STOPPED` (8) — dealer closed it | `negotiation_stopped` | Umpeutuu: mm:ss · hourglass · red | **Näytä vastaus** | **dropped** | **Neuvottelu päättyi** |

So yes — prod does communicate a closed negotiation on the decision page, in three
places at once: the hero swaps to `auction.auction_hero.negotiation_stopped`
("Neuvottelu päättyi" / "Autoliike on päättänyt neuvottelun. Voit edelleen
hyväksyä voimassa olevan tarjouksen tai jatkaa myyntiä kanssamme."), the badge
reverts to the reaction countdown, and `negotiationInfoText` is set to `null` —
the help text promises the standing offer survives a counter-offer, and once the
dealer has closed there is no counter-offer left to make. The reject-all banner
comes back too, because `highestOfferIsBeingNegotiated` is `waitingForDealer`,
false once stopped.

The negotiate button still renders (`showNegotiate: canBeNegotiated`) — it is how
the seller opens the thread to read the closing message.

**The proto reached none of this.** `offerDisplayProps` only ever produced
`negotiation`, so the `negotiation_stopped` branches that already existed in
`buildOfferCard` were dead; `HERO_COPY` had no entry, so the hero fell back to
`good_auction`; and `negBtnLabel` read `dealerReplied` **above its own `var`**, so
the hoisted `undefined` pinned the label to "Vastatarjous lähetetty" for the whole
negotiation — the dealer's reply never changed it. All four now derive from the
live `NEGOTIATIONS` thread through `negStatus`, which is also what the modal and
the bar's simulate actions use, so the card, the badge, the hero and the banner
cannot disagree.

One prod ordering NOT reproduced: prod checks expiry *before* both negotiation
branches (`dayjs().isAfter(expiry) && !hasPending`), so an expired offer with a
stopped negotiation reads `expired`. The proto keeps the negotiation status
ahead of its own expiry check. Unreachable today — every negotiation scenario
uses an `ACTIVE()` window — but it is a real divergence if that changes.

## Offers + decision audit against the 2026-08-26 dump

A full sweep of the offers page, the warm-up and the decision page. What matched
is worth recording too, so the next sweep can skip it.

**Matched already, verbatim:** all five offers-page section titles
(`Tarjouskauppa käynnissä`, `Ajankohtaista`, `Keskeneräiset ilmoituksesi`,
`Julkaistut ilmoituksesi`, `Usein kysytyt kysymykset`); every
`status_updates.*` notification title, body and CTA the proto renders; the
decision page's own section titles; the warm-up badge and CTA; `time_to_answer`.

**Fixed — decision page:**
- The reject-all banner's title was "Eikö hinta miellytä?", which is not prod
  copy. `banner_helper.card.decline.title` is **"Tarvitsetko apua?"** — the same
  title the accepted banner uses.
- prod has **three** bottom-banner variants where the proto had two:
  `no_offers` → `helper`, `offers_expired` → `expired`, everything else →
  `decline`. `helper` and `expired` are the same sentence with **different phone
  numbers**.
- **The phone numbers differ per variant** and the proto used one everywhere:
  `helper`, `accepted` and `decline` carry **+358 40 040 7002**; `expired` and
  `rejected` carry **+358 44 901 5285**.
- `auction_details.bids` / `.buyers` are plural forms
  (`Tarjousta|Tarjous|Tarjousta`), so the insights row reads "Tarjous" /
  "Autoliike" at exactly one. The proto hardcoded the plural. Not reachable by
  any current scenario — `offer_count` is request-level and no scenario sets it
  to 1 — but the guard is in place.

**Fixed — offers page:**
- `offerAccepted` carried the label "Kauppa vahvistettu", so a freshly accepted
  offer already read as a confirmed deal. prod has TWO states with the same icon
  and colour: **"Tarjous hyväksytty"** until the request reaches
  `REQUEST_COMPLETED` (4), then **"Kauppa vahvistettu"**. `dealCompleted` added,
  and the `deal-completed` scenario now actually sets `status: 4` — it was
  byte-identical to `accepted` before.
- The `needs_dac7` → `offerAccepted` short-circuit is gone. prod derives the card
  state from the offers alone and surfaces DAC7 as a notification. The `dac7`
  scenario carried NO offers, which under prod's logic makes `every(REJECTED)`
  vacuously true and would badge it "Ei hyväksyttyjä tarjouksia"; it now carries
  the accepted offer a real DAC7 request has.

**A dead notification in prod, matched deliberately.** `updates/main.vue`
renders a `requestsNegotiationStopped` block — `ph-hand-palm-fill`,
`status_updates.negotiation_stopped` copy, its own CTA — but that prop is
**neither declared in its own `defineProps` nor passed by `C2B.vue`**, so the
`v-for` iterates `undefined` and nothing paints. Almost certainly an oversight;
everything else about it is finished. What a stopped negotiation actually hits is
`requestsEndedSeen`, which excludes `NEGOTIATION_PENDING` and
`NEGOTIATION_COUNTER_OFFER_SENT` and says nothing about `STOPPED` — so it shows
**offersValidity** ("Toimi nyt! Viimeistele kaupat"). The proto now does the
same; the `negotiationStopped` config stays in `offers.html` marked UNREACHABLE
so re-enabling is one line if prod is fixed. The card badge is
"Neuvottelut käynnissä" in both — prod's `computeRequestState` *does* include
`NEGOTIATION_STOPPED` in `negotiations`.

**More dead prod copy found while sweeping** (do not build against it):
`auctions_in_progress.pick_up_offered` ("Noutopalvelua tarjoavat") — `Timer.vue`
renders only `total_bids` and `bidders`. Add it to the list with `AConfetti`,
`AConfetti`'s canvas-confetti dependency, `Preview.vue`'s `published` badge
config, and `NegotiationFormRequest`'s `counterOfferSend` rules.

**Not ported, deliberately:** prod's decision page has a full-page `Spinner`
while `isLoading` and a literal `Something went wrong!!!` fallback; neither means
anything in a static prototype.

## Warm-up card and hero copy — the outcome tiers were unified

**The warm-up still exists in prod**, and its gate has nothing to do with the
auction outcome. `C2BDecision.vue` renders it on
`! request?.offers_seen_at && ! shouldSkipWarmup`, and
`shouldSkipWarmup` is `isB2BRequest` — so for a consumer seller it is the
`offers_seen_at` timestamp alone. The outcome decides the card's CONTENT, not
whether it appears. The badge (`warm_up_card.badge` = "Tarjouskilpailu on
päättynyt", `ph-gavel-bold`, light_lime) and CTA (`warm_up_card.cta` = "Katso
tulokset") are the same in every variant.

**What changed:** `c2bPostAuctionMessages.js` now defines ONE
`offersPendingActionConfig` and assigns the same object to all four price tiers —
`EXCELLENT_AUCTION`, `MATCHES_EXPECTATIONS`, `GOOD_AUCTION`, `NOT_GOOD_AUCTION`.
Its own comment says "the outcome tiers no longer message differently", and
`C2BDecision.vue` carries a matching TODO: `offerEstimateDifference` is dead
because "no hero config consumes the amount param anymore". The tier constants
still exist and are still returned; they just all resolve to one hero and one
warm-up.

| status | warm-up | hero |
|---|---|---|
| the four price tiers | **Hyvä tarjouskilpailu takana!** · excellent_auction.png | **Nyt on aikasi toimia!** |
| `no_offers` | Ei tarjouksia tällä kertaa · not_great_auction.png | Tarjouksia ei tullut |
| `offers_expired` | Tarjoukset ovat umpeutuneet, mutta vielä on toivoa · not_great_auction.png | Tarjoukset ovat umpeutuneet |
| `offer_accepted` · `offer_rejected` · `final_offer` · `negotiation_stopped` | **none in prod** | own hero each |

`ok_auction.png` is referenced by nothing any more. And prod has **no fallback**
for the four warm-up-less statuses: reaching the card in one of them renders
undefined heading/message/image. Unreachable in practice (each implies the seller
already saw the offers), so the proto keeps a guard instead of copying the gap.

**What the proto had wrong**, all now fixed: four separate tier heroes ("Sait yli
odotusten!", "Odotustesi mukainen tarjous", "Nyt ollaan hyvissä asemissa!", "Peli
ei ole vielä pelattu") and three separate warm-up cards, none of which exist any
more; a stale `no_offers` hero (prod dropped "tai liian korkea hintaodotus");
no `offers_expired` warm-up at all; and a warm-up gate that also allow-listed two
scenarios, hiding the card on `offers-expired-unseen` and `offers-auto-rejected`
even though both have `offers_seen_at: null`. Shared objects now back the tier
entries, so they cannot drift apart again.

`postAuctionStatus` also gained the two prod branches it was missing:
`isExpiredByTime` → `offers_expired` (past `expires_at + reactionTimeForOffers`,
unless a PENDING negotiation is keeping the auction alive), which is why
`offers-expired-unseen` used to read as a price tier; and a rejected HIGHEST
offer counting as `offer_rejected`, not only the all-rejected case. Prod's
`rejected_by_seller` leg is not ported — the proto's mock offers have no such
field.

Two scenarios that existed in the page but not on the bar are now listed:
`offers-auto-rejected` ("Expired, auto-rejected") and `negotiation-stopped`
("Negotiation closed by dealer").

## No confetti anywhere — prod never fires it

`AConfetti.vue` is a real atom in prod's design system, but **nothing imports
it**: across the 2026-08-14, -08-20 and -08-26 dumps the only references are its
own Storybook story and MDX page. `canvas-confetti` is a dependency; no
application code calls it. So production celebrates nothing, on the decision page
or any other.

`decision.html` used to fire it for `excellent_auction`, `good_auction` and
`matches_expectations` from `renderMain` — which runs on load, on the warm-up
reveal, after every counter-offer and after every simulated dealer action, so it
re-celebrated on each action and on each return to the page. Removed: the CDN
script, the canvas, `fireConfetti`, `CONFETTI_STATUSES`/`CONFETTI_COLORS` and the
call.

Two things worth keeping straight if it is ever proposed for real. The atom's
burst runs `onMounted` and cleans up `onBeforeUnmount`, so even wired it would
fire **once per mount, never per re-render** — a Vue page that re-renders on every
action would not re-celebrate, which is exactly the behaviour the proto got wrong.
And the transcription itself was accurate (6 bursts, 300 ms apart, the atom's own
colours, `spread: 160`, `startVelocity: 80`, `scalar: 1.5`, 100 particles), so
restoring it is a `git revert` away — the mistake was the trigger, not the
parameters.

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

## FAQ content — `faq-content.js`

All FAQ copy is the **production CMS text**, in one shared file, per language:

| Set | Rendered by | CMS entry |
|---|---|---|
| `FAQ_CONTENT.front` | `index.html` (9 items) | front page, "Usein kysyttyä" |
| `FAQ_CONTENT.offers` | `offers.html` + `decision.html` (15 items) | one entry, two pages |
| `FAQ_CONTENT.support` | `help.html` (5 groups, 36 items) | the /tuki page |

Finnish is the CMS text verbatim, paragraph for paragraph; English is a working
translation, because the CMS has none. `a` is an HTML string and every consumer
renders it with `innerHTML`, so lists and bolded lead-ins survive.

Two deliberate deviations: inline "Lue lisää täältä" links point at blog and info
pages this proto does not have, so the sentence stays and the link goes (the
support address is the exception and stays a real `mailto`); and structure is
plain HTML rather than the CMS's rich-text nodes.

**Pages render, they do not store.** `index.html` and `help.html` used to hold the
questions as markup — ~400 lines on the support page alone — with a parallel JS
copy for the language switch. Both now build their accordions from this file and
re-render on `av:langchange`, so a CMS change is a one-file edit. The old
`faq.q1`…`a7` keys are gone from `translations.js`; only the section's own
title/subtitle/link keys remain there.

**The front page has no question groups.** The "Yleiset kysymykset palvelusta"
heading it used to show was borrowed from the support page; the real CMS entry is
a flat list.

## Transactional emails — `emails.html` + `email-content.js`

An inbox-style tool for every transactional email the **consumer seller** can
receive: list on the left grouped by the state that sends it, meta and rendered
email on the right. Scope is deliberately narrow — **Finnish, C2B,
seller-facing**. Sweden, B2B and every dealer-facing email are out; a different
team owns those.

**Blade cannot be executed here, so the split matters.** Body copy and subjects
are plain text in the dump (`resources/views/mail/…` plus
`resources/lang/fi/email.php`), so the COPY is verbatim and stays checkable
against every future dump. What cannot be reproduced is the rendering:
`<x-mail::message>`, `<x-mail::button>` and the `{{ $tenderRequest->… }}`
interpolations. The mail shell in `emails.html` is therefore an **approximation**
transcribed from `resources/views/vendor/mail/html` + `themes/autovex.css`
(570px body, Avenir, h1 19px, copy 16px/1.5 `#74787E`, button `#0B6DFF` r8), and
the page says so. Prod's own `app/Filament/Pages/TransactionalEmails.php` renders
the real thing; an export from it replaces the shell without touching the copy.

**Two template shapes, and .eml captures are what revealed the difference.**
`shape: 'markdown'` — the notification calls `->markdown('mail.transactional…')`
with a full blade template, so the chrome is header, body, footer and nothing
else. `shape: 'mailmessage'` — the mail is built from
`->greeting()/->line()/->action()`, and Laravel then adds the greeting as the
`<h1>`, the shared `email.regards` salutation and an `email.subcopy` block
repeating the button URL as text. Reading `resources/views/mail` alone cannot
show this, and it also **hides whole emails**: `NewQuestion` (a dealership asks
the seller for more information, dispatched from `TenderQuestionApiController`)
has no blade template at all and was found only from a captured .eml.

**Three senders, and only one of them is ours.** Captures from a real inbox show
the codebase's transactional emails going out through **Mailgun**
(`mg.autovex.fi`, `From: AutoVex <tiimi@autovex.fi>`, with the code's own
`X-Mailgun-Tag` values: `type:…`, `market:c2b`, `role:seller` — shown per entry in
the tool). The lifecycle and marketing emails a seller also receives — draft
nurture, photo tips, asking-price help, "soitamme sinulle pian" — arrive via
**SendGrid** and exist nowhere in the codebase, alongside the Klaviyo events the
code triggers. Anything not referenced in the dump stays out of the tool.

**Old .eml captures are useful for chrome, never for copy.** The 2024 MailHog
captures verified the shell — 570px, Avenir, 35px content padding, the
`images.autovex.fi/logo.png` header — and exposed the shape difference above. Their
copy is stale: the verification email's own list has changed since, and its CTA
label was "Jatka auton myyntiä" where the current lang file says "Vahvista
sähköposti tästä". Copy always comes from the newest dump.

**Two footers and two subcopy rules, both per entry rather than per shape.**
`mail::message` prints `© <year> AutoVex`; `mail.layout` uses `email.footer`,
which ends "Kaikki oikeudet pidätetään.". And the fallback-URL subcopy appears on
every MailMessage-built email *and* on the verification email, because
`mail.layout` renders one from the action label and url — no blade template sets
`$subcopy` itself. Entries carry `subcopy: true` / `footer: 'rights'` instead of
the renderer guessing from the shape.

**The button is white-on-blue, and bold only where the template bolds it.**
`.em-body a` (link blue `#006ec3`) outranks a bare `.em-btn`, which is why the
label first rendered blue on blue; the rule is scoped to `.em-body a.em-btn`. The
verification template wraps its label in `<b>`, the `<x-mail::button>` templates
do not, so boldness is a per-entry flag (`ctaBold`) rather than a shell default.

**One template styles itself.** `tender-form/email-verification.blade.php` carries
inline styles instead of the theme's: 20px `<h1>`, every paragraph centred, body
copy `#1e293b`, and a "Tarvitsetko neuvoja?" help block at the end. That entry is
marked `centred: true`.

**Every interpolated value is a placeholder, never a fixture value.** A rendered
"Matti" reads as part of the copy, which defeats the purpose of reviewing what an
email says. Bodies carry `<var data-src="…">[first name]</var>` and the meta
panel lists each placeholder with its source expression. No Finnish template
interpolates a date; the only time arithmetic lives in the notification classes
and shows up in each entry's `timing` (e.g. `auction_ends_at + 4 h`).

**Nothing conditional lives in the templates.** None of the eleven FI templates
contains an `@if` — every branch is in the notification class, which produces two
shapes: a different template per state (the four `auction-ended-*` emails, chosen
by comparing the highest offer against `asking_price`) becomes separate entries
each carrying its `condition`, and the same template with different strings per
state (email verification's new vs returning seller) becomes one entry with
`states`.

**Klaviyo emails are listed, never rendered.** Nineteen seller-facing events are
`AbstractKlaviyoNotification` subclasses: the repo holds the event name and
payload, the copy lives in Klaviyo and is owned by Marketing. Omitting them would
read as "no email is sent here", which is worse than an unrenderable row.

**Arms work as they do everywhere else, but the row is per EMAIL.** An email — or
one of its `states` — may carry `v1` (`{ subject, body }`) beside the production
copy; the page reads the arm through `protoVariant`, badges list rows an arm
changes, and states in the meta panel which copy is on screen. The page declares
the initiative **only when the email currently open has an override**, so the bar
shows its greyed `none on this page` for every other email — the same answer any
page gives when it takes no part in an initiative. Offering an arm that renders
identically to control reads as "the change is in and it looks the same", which
is worse than no arm at all. An `initiative` field links an email to the spec page that
owns the change and carries the reason it is a candidate before any copy exists.

The tool is dev-only: reachable from the bar's **Go to** row, absent from every
seller-facing nav, and replaced by a short notice in `?mode=test`.

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
