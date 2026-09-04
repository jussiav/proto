# AutoVex / Wheelaway — Project Context

All project context lives in `/docs/`. Read the relevant files before making decisions.

## Reference Source Locations (updated 2026-08-31)

- **Production codebase (read-only reference):** `Prod-codebase/<folder>/` inside this project — currently `Prod-codebase/autovex-2026-08-31-3064d348fba0/` (previous: `autovex-2026-08-26-1ee95731e59f/`, `autovex-2026-08-20-99ed8bef6330/`, `autovex-2026-08-14-435a41f68ebc/`). Newer dumps are added as sibling folders; always use the newest. Gitignored, never push, nothing in the proto depends on it.
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

   **`labels.maximum_distance` is the exception — and it is now prod.** The
   delivery-distance question renders at `text-xl font-bold`, the group-legend
   size, not the sub-label size its neighbours use. This was the **Delivery
   distance A/B test**'s global change, and **it shipped**: the 2026-08-31 dump has
   `<legend class="text-xl font-bold mb-2 required">` where 08-26 had
   `text-base font-medium`, applied outside the experiment's own `v-if` so every
   arm gets it. The proto matches. It had been reverted to the old size during a
   prod-matching sweep — worth knowing, because that revert looked correct against
   the dump of the day and was not.

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

**The Enhanced negotiations spec is written for ticket-writing, not for
reading as an argument.** Its change log is `# | Change | Where | Scenario` — a
dev needs the surface (negotiation modal · decision page card · decision page
hero · emails) and the state that reaches it. Each section leads with **What
changes** as a spec list, carries a small HTML mock of the affected block built
from the same tokens the proto uses, links to the exact prototype URL for that
state (`../decision.html?scenario=…&enhanced-negotiations=v1`), and ends with one
small-print **Why:** line. Finnish copy carries an English gloss — the devs do not
read Finnish. **No production file names, component names or translation keys
appear on it**; colour tokens and copy do. Section titles name the solution
("3 — Negotiation modal header"), never the reasoning.

**Copy changes carry a diff, and it is a convention now.** `.av-del` (error-700,
line-through) is text that goes, `.av-ins` (success-800 on success-100, bold) is
text that arrives — colour is never the only signal, so the marks survive
greyscale and colour-blind reading. **Deletions live in the "Today" line and
insertions in the "After" line**, never mixed, and each quoted string carries a
grey English gloss (`.av-gloss`) underneath, labelled as a reading aid rather
than copy. The devs do not read Finnish, so a truncated `…` quote or a diff
without the surrounding sentence is not reviewable: **quote the whole sentence,
or the whole paragraph if a sentence is being deleted from it**, and state what
stays untouched. Review/No review's changes 3 and 4 were rebuilt this way — six
FAQ edits and three emails, one card each rather than a four-column table, since
a full sentence pair plus two glosses does not fit a table cell.

**Name an email by its subject line.** Change 4's rows used to say "Email
verification", which does not identify anything in a mailbox. Each email now
leads with subject + greeting + when it is sent + which block changes, and
`[square brackets]` mark a send-time value. Prod file names, component names and
translation keys still never appear.

**Change 4 is marked "Ongoing work" — approved copy is not the same as cleared
for development.** The status chip is `info`, not `success`, the section opens
with a "do not pick this up yet" notice, and the first acceptance criterion is
that the team has agreed it is going ahead and when. The emails are a shared
surface, their timing is tied to when the funnel changes actually ship, and they
overlap the Marketing-owned family in Change 5 — so a dev reading the page must
not be able to mistake finished copy for a ready ticket. Changes 1–3 stay
independently buildable, and the initiative reads
`3 ready to build · 1 ongoing · 1 later, with Marketing`. **Use this status
whenever a change is specified and agreed but not yet scheduled**; the previous
`Ready to build` / `Awaiting copy` / `Later · with Marketing` chips do not cover
it.

**Change 4 is now TWO emails, and its copy is approved** (2026-09-02). 4.1
restores `ilmoituksesi` along with the deletion — the pronoun `se` referred to
the noun inside the clause being removed, so deleting alone leaves the sentence
subjectless; 4.2 is the bare deletion. **4.3 was decided KEEP.** The
`>200tkm / >10 vuotta` paragraph in the no-offers email stays: it is honest, it
is usually the real reason, and it is the only part of that email that answers
the seller's question — softening it would cost the seller the explanation to
spare us the awkwardness, and nothing in the email promises a review or a call
anyway. Its `v1` and its `initiative` link are both gone from
`email-content.js`, so the tool shows it with no badge at all; the reasoning
lives on the spec page as a recorded decision and in the entry's own `note`, so
nobody re-opens it as an oversight.

**Two markers keep the tool honest about copy it is showing.** `draft: true` on
a `v1` renders "placeholder copy, not approved" in the list badge, the bar's
variant label and the meta panel — without it a green `v1 differs` asserts an
approval nobody gave. Nothing carries it now that change 4 is approved; it stays
for the next initiative that wants something to react to before sign-off. And
`unchanged: true` on a STATE renders a slate `unchanged` badge instead of
`candidate`: Review/No review reaches the verification email's new-seller
version only, and `candidate` on the returning-seller version reported an open
question that was in fact closed. The `initiative` field lives on the mail, so a
per-state opt-out is the only way to say that.

**The bar now shows arms in force on OTHER pages even when this page proposes
nothing.** `elsewhere` in `proto-bar.js` used to be computed inside the branch
that runs only when a page declares an initiative, so a page with none rendered
a disabled `none on this page` while a remembered arm was pinned for the whole
prototype — the exact invisibility that group exists to prevent. It is hoisted
above the branch; the disabled placeholder now appears only when there is
nothing on this page AND nothing in force elsewhere, and the row's `— none —`
clears every remembered arm from any page. Found because this spec page's own
change-4 link carried `&review-no-review=v1` for an email that had no override:
the link silently pinned the arm for `price`, `contact` and `help` while the
email tool correctly showed production copy.

**Change 5 is parked, not pending.** The SendGrid lifecycle emails are
Marketing's, so the section opens with a slate "Not part of this build" callout
(no dev task, blocks nothing, revisit after 1–4 ship) and its change-log status
is `Later · with Marketing` rather than an amber `Needs an owner` — amber read as
work waiting on us. No wording is proposed for emails another team owns.

**Both spec pages now share that shape.** `review-no-review.html` was given the
same treatment — a Where/Scenario chip pair under each heading, a short
**What changes** card before the detail, and a prototype link per change (its
long "what must be true afterwards" lists became **Acceptance criteria**, so the
short card is not read as a duplicate). Its change log gained a Scenario column
to match. Use this shape for the next spec page rather than inventing a third.

**It is numbered 1–16 in BUILD order**, which is not the order the work happened
in — change 1 is the help block because changes 2, 3 and 9 put copy inside it, and
the thread and its first bubble sit together. Two of the old numbers are gone: the
"binding" change folded into change 2's sentence pair, and "standing offer visible
while typing" folded into the auction-result bubble. The deadline is out of the
numbered list entirely and sits in its own **Needs a decision before build**
section, because prod tells the consumer nothing about the dealership's 24
business hours today and the line that would have said so was replaced during the
copy pass. The batch history lives here in CLAUDE.md instead.

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

| Initiative | Stage | Slug / param | Page default | Prod arm | Pages | Spec |
|---|---|---|---|---|---|---|
| Delivery distance A/B test | **In production A/B test** | `delivery` | `control` | `control` | `details.html` | `design-specs/delivery-distance.html` |
| Review/No review | Live | `review-no-review` | `control` | `control` | `price.html` | `design-specs/review-no-review.html` |
| Seller file upload | Live | `seller-file-upload` | `control` | `control` | `photos.html` | `design-specs/seller-file-upload.html` |
| Enhanced negotiations | Live | `enhanced-negotiations` | `control` | `control` | `decision.html` | `design-specs/enhanced-negotiations.html` |
| Seller intent | **In production A/B test** | `seller-intent` | `control` | `control` | `price.html` | `design-specs/seller-intent.html` |
| Asking price removal | Live | `asking-price-removal` | `control` | `control` | `decision.html` | `design-specs/asking-price-removal.html` |

**Two are in a live production A/B test** — Delivery distance (VWO `105_combi`)
and Seller intent (VWO `104_combi`), both present in the 2026-08-31 dump —
so their arms are being measured against real sellers and neither has a winner
yet. Their `prodArm` stays `control` and their page default stays `control`: that
is what the proto renders unasked, which is what a user-test participant must land
in, and it is the arm the eventual result gets read against. Nothing gets deleted
until one is promoted.

**Enhanced negotiations** makes the negotiation's own mechanics legible in the
modal, where today none of them are. Almost half of all offers reach a
negotiation and the usual reason one fails is the seller asking too much — and
every fact that would tell them what is reasonable exists but is off-screen when
they type. **Built in batches**, one arm (`v1`) carrying all of them:

| Batch | Changes | State |
|---|---|---|
| 1 | standing offer by the field · offer can only rise · counter offer is binding · 24 business hours + auto-close | in the proto |
| 2 | the dealership's thread component · in-bubble accept · rounds on the send button | in the proto |
| 3 | findability — email link target and the open-thread affordance · the auto-close's own voice | in the proto |
| 4 | the modal's own presentation — header, contained guidance, hint badge, card affordance, required-error copy | in the proto |

Three findings from prod hold the design up, all verified against the 2026-08-31
dump. **A counter offer is binding**: `DealerAcceptCounterOfferApiController`
runs the same `AcceptOffer` the seller's own accept does, so the sale closes at
the counter price with no further step — the hesitancy sellers report is correct,
and the copy says so rather than soothing it. **A dealer's offer can only rise**:
`DealerNegotiationMessageAmount` rejects any reply below the standing amount and
`CloseNegotiation` preserves it, so "up or unchanged" is a mechanic, not
reassurance. And **the two sides run different thread components** — the seller
is on the legacy `partials/Negotiation.vue` while the dealership has
`partials/negotiations/NegotiationMessage.vue`, which already ships in-bubble
accept naming the amount, `Avaa neuvotteluhistoria` on a closed negotiation, and
a height-capped thread. Batch 2 is that swap, which is why it is reuse rather
than design.

**Change 17 is the reject entry reading as a choice** (2026-09-02, from the
team walkthrough). Two halves of one problem. The title gains a **question
mark** — "Tee vielä vastatarjous autoliikkeelle?" — because a seller who pressed
"Hylkää tarjouskilpailu" and got a counter-offer form reads the statement as
though rejecting is no longer available; the reviewer's instinct and the user's
own first reaction agreed on that. And the footer **stacks below prod's `sm`
(620px)**: change 6 put the rounds left on the send button, and
"Lähetä vastatarjous (2 jäljellä)" collides with "Hylkää tarjous" beside it on a
phone, which squeezes the seller's own choice. `flex-col-reverse` keeps prod's
DOM order while rendering the primary action on top, both buttons `w-full
sm:w-auto`; the row returns at 620px. v1 only.

**It covers TWO footers, and only two.** A sweep of every state found one other
pair: the reject confirmation's `Tee vastatarjous` + `Hylkää tarjous`, measured
at 360px as 163 + 133 = **296px in a 296px row** — no overflow, no slack either,
so it stacks the same way. There the DOM already leads with the primary button,
so plain `flex-col` is enough, and it applies only when both buttons are present
(`showNeg`). Every other v1 state ends with a single button: `acceptIsInThread`
moves accept out of the footer whenever the last message is the dealership's,
which is exactly when the footer would have shown it, so accept + send never
share a row in v1.

**`stackCls` has to be declared before the buttons are assembled.** It was
written next to the footer markup at first, which is BELOW the button strings —
`var` hoisted it as undefined and "undefined" landed in the class attribute. The
footer's variables are built in order: `disabledCls`, then the buttons, then the
wrappers.

**The negotiation modal has TWO entry points, and the spec now says so.** The
reject banner's "Hylkää tarjouskilpailu" does not go to the reject survey while
the highest offer is still negotiable and not final — prod's
`handleRejectAllOffers` routes to **QuickNegotiate**, the same modal, asking for
a counter offer with "Hylkää tarjous" still beside it. So most of this
initiative's presentation changes land on the reject flow too, whether or not
that was the intent: 1, 3, 4, 5, 6 and 7 in full; 8 only for the deadline (this
entry point has **no message field** — prod pre-fills the message — so there was
never a contact-info paragraph to move); 14/15/17 only on the send button, since
QuickNegotiate never shows Accept; and 2 deliberately NOT, because the seller
here is being asked to reconsider rather than briefed on how a negotiation
works. The routing and every string in it are prod's, verbatim — the titles, the
two messages chosen by offer count, and the pre-filled message to the
dealership. Documented as its own section on the spec page rather than a
seventeenth change, since it is coverage rather than new work.

**Change 9 now means EVERY state, and change 3 reaches the reject
confirmation.** Both were widened after the reject flow was written up
(2026-09-02). The modal routes the seller to customer support in three places
and none of them survive: the waiting state's support-email bullet and
QuickNegotiate's own (both **replaced** by `acceptAnyTime` — the standing offer
is still theirs while they wait), and the reject confirmation's closing
"Asiakaspalvelumme auttaa myös mielellään tarvittaessa", which is **deleted**
rather than replaced because the sentence before it already says what to do
instead. The `Reject` step also had no header at all — prod's whole
confirmation is one `text-sm` paragraph with the question and the advice run
together — so v1 promotes prod's own question to the title row and puts the
advice in the help block. `hasNeg` keeps prod's shorter variant a bare title
with nothing under it. No new copy: one sentence split, one deleted.

**The spec page names the two entry points and nothing more.** The reject-flow
section is a short reminder — one sentence plus a card each for "Tee
vastatarjous" on the card and "Hylkää tarjouskilpailu" in the banner — and it
says every change applies to both unless its own section says otherwise. The
routing conditions, the per-change coverage table and the dead-state note were
all removed (2026-09-02): a dev reading a spec should see what has to change,
not reason about which branch fires when, and legacy they can find for
themselves. **The rule for these pages: no dead prod copy, no routing
derivations.** The two decisions that lived only in that table moved into the
changes they belong to — change 2 does not apply to the reject entry (that
seller is being asked to reconsider, not briefed on negotiation mechanics), and
change 8's label-row move has nothing to move there because prod pre-fills the
message. Everything else below stays here rather than on the page.

**"Eikö autoliike ole ollut yhteydessä?" is DEAD in prod — not a proto gap.**
Worth knowing before anyone tries to reproduce it. `QuickNegotiate.vue`'s
`!sellerCanSendMessage && negotiationRounds == 1` branch needs the reject banner
and a negotiation awaiting the dealership's reply at the same time — but
`C2BDecision.vue` hides that banner while `negotiation && waitingForDealer`,
which is exactly that state, and once the reply lands `dealerCanSendMessage` is
false so `handleRejectAllOffers` routes to `Reject` instead. The two conditions
cannot both hold, and `offerAction = 'QuickNegotiate'` has exactly one caller.
It is styled and specified with the rest so nothing is left behind if that
banner rule changes, and recorded on the spec page as needing no test.

**One reject-all routing divergence left alone, and the team has confirmed it
stays** (2026-09-02) — simplicity beats fidelity here. Prod skips the
`amount > asking_price * 0.75` threshold when there is exactly ONE offer
(`hasSingleOffer && dealerCanSendMessage`); the proto applies the threshold in
both cases. So a lone low offer routes to `Reject` here where prod would offer
QuickNegotiate — reachable with `?second=` empty plus a low `?highest=`. Every
other state agrees, because the proto's `!hasNeg` gate and prod's
`dealerCanSendMessage` differ only in states the hidden banner makes
unreachable.

**Batch 2 is four prod patterns, no new component.** `NegotiationMessage.vue`
declares `pointOfView` with `'seller'` already an accepted value, so the swap is a
prop flip prod never made: bubbles go from the legacy solid-blue fill plus a
rotated CSS tail to bordered cards — own `border-blue-300 bg-blue-50
rounded-tr-none ml-auto`, other `border-gray-200 bg-white rounded-tl-none
mr-auto` — in a `max-h-[325px] overflow-y-auto` list. From the same stack:
`NegotiationForm.vue`'s `label – <b>amount</b>` shape for change 1's standing
offer, `tender.button.deal.reply_to_negotiation`
("Lähetä vastatarjous (:roundsLeft jäljellä)") which puts the rounds on the
action and **replaces change 6's own string entirely** — the blue
"Vastatarjouksia ei tämän jälkeen tehdä enempää" block goes with it — and
`app.negotiations.counter_offer_message` as the textarea placeholder.

**The accept button moves into the dealership's last message** (`v1` only), per
the same component, so it names the amount in the place that amount was offered
instead of restating it in the footer. `acceptIsInThread` gates the footer copy
off, and it is keyed on the thread's last message being a **dealer** one — not on
the negotiation's status. That distinction is what caught a seeding bug: the
proto's `negotiation-stopped` thread ended with a seller message, which prod
cannot produce, because `CloseNegotiation` always appends a dealer message
(`close_negotiation.message_pre_filled` when the dealer sends none). Fixed in the
seed; the fallback stays, so a thread ending seller-side still shows a footer
accept rather than none.

**Batch 3 is a link target.** Every FI seller email in the dump points at
`route('user.offers')` — the LIST — including both dealer-replied emails and the
negotiation-closed one, so the seller lands on the offers page and has to find the
car and then work out that the reply is behind a secondary button.
`route('user.offers.decision', $tenderRequest)` already exists and takes the
request, so `v1` lands there — and **stops there**, with **no copy change in any
of the three emails**. An auto-open (`?negotiation=open`, read at boot) was built
and removed: the seller should see the page they arrived at and choose what to
open. `final-offer-sent` keeps the list target deliberately — a final offer is
`FinalOffer` raising `tender_offers.amount`, not a negotiation message, so there
is no thread to open.

The proto's email tool was **pointing three of those at `decision.html` already**,
which read as prod behaviour and would have made change 7 look like a no-op.
Control now transcribes prod, and `btn()` carries the prod route beside the proto
target so the meta panel states which one it is. `emails.html`'s arm handling was
keyed to the single slug `review-no-review`; it now reads **the arm of whichever
initiative the open email declares**, and an override may carry `cta` alone
(`armCta`) rather than subject/body — change 7 changes no copy.

**Change 9 came out of reading the auto-close.** `negotiations:auto-close` runs
`->at('12:00')->weekdays()` and closes anything past `auto_close.at` — the SLA in
`addOpenHours(..., HOLIDAYS_ARE_CLOSED)`, then `+1 day` at 12:00, skipped forward
off non-business days, which is where change 5's "24 tuntia arkiaikaa" comes
from. But the command passes **`buyer_close_negotiation_reply`** — the
DEALERSHIP's pre-filled message — so a negotiation nobody answered ends with
"Hei ja kiitos viestistäsi…", written as though they had replied. The honest
string `auto_close_negotiation_reply` ("Neuvottelu on nyt päättynyt. Viimeisin
tarjous odottaa päätöstäsi.") exists and is what the sibling `AutoCompleteRequirements`
sends — and that command is **scheduled nowhere in the dump**. So the swap is one
line at the scheduled call site with no new copy. The bar's **Auction settings**
gained an `Auto-close (deadline passed)` action to demonstrate it; it goes through
`dealerCanReply` like the others, which is right — auto-close only fires while the
dealership owes a reply.

**Batch 4 is presentation, and one wrong error string.** All of it is prod
patterns applied to a modal that had none of them:

| Change | What | Source |
|---|---|---|
| 10 | `Kenttä Pyyntihinta vaaditaan.` → `Pakollinen tieto` | `tenderform.*.mandatory_information` |
| 11 | the tips move into a contained help block at `text-sm` | `DeliveryDateModal.vue` |
| 12 | title row at `text-xl font-bold text-slate-900` | same modal |
| 13 | standing offer becomes the thread's first bubble | the thread itself |
| 14 | chats icon in the reply button; the pulsing "1" stays | the card's own status line |

**These are the BATCH numbers, not the spec's.** The spec was renumbered 1–16 in
build order for ticket-writing (see below); this section keeps the build history
in the order it happened. Map by name, not by number.

Change 10 is a real prod defect, not a preference: the message is Laravel's
`required` rendered against the attribute name **Pyyntihinta** — the asking price
— on a field labelled **Vastatarjous**, so it names a field that is not on the
screen. Spec'd as its own change so it is not read as styling.

**`DeliveryDateModal.vue` is the find worth remembering.** It is the only
consumer modal that builds a real header inside the same `Reveal` shell the
negotiate modal uses: a title row (`flex items-center gap-3`, title
`flex-1 text-xl font-bold font-body text-slate-900`) and then its guidance in a
peach block (`text-sm text-slate-600 bg-[#FAEADA] border border-[#FAEADA] p-4
rounded-md`). `Reveal` itself renders no header at all — every consumer of it
supplies its own, and the negotiate modal's is an `h2 text-lg leading-4` running
straight into a bulleted list. The proto keeps the Reveal's own × rather than the
header icon that modal draws for itself (it passes `:show-close-button="false"`).

**The closed state is where change 12 earns its place.** Control says only
"Voit hyväksyä tarjouksen" at `text-sm` — the modal never states that the
negotiation is over, and that line says nothing about what the offer is still
worth or what the alternative is. v1 takes the decision page's own hero for the
same state: **"Neuvottelu päättyi"** as the title, its body
("Autoliike on päättänyt neuvottelun. Voit edelleen hyväksyä voimassa olevan
tarjouksen tai jatkaa myyntiä kanssamme.") as the help text. Both strings exist;
only the placement is new, and the seller now reads the same sentence on the page
and in the modal.

**The dealership's collapse is deliberately NOT taken.** `NegotiationMessage`
hides a stopped thread behind `negotiation.open_message_history`, which buys back
room on a screen where the negotiation is one panel among many. The seller's modal
is only the negotiation, so a closed thread stays open — they opened it to read
the messages. The dealership's other close signal, removing the reply button,
happens here anyway.

**Change 13 landed on its third shape.** A `text-base` line above the field (the
dealership's own form) read as a second heading; a grey `UiBadge` hint fixed the
weight but still sat beside the form as a separate widget quoting a number the
thread was about to quote again. It is now the thread's **first bubble** — the
auction result is what the dealership said first, so the negotiation continues
from it, labelled with prod's `offer_card.first_place`. Consequences worth
knowing: the thread renders even when there is no negotiation yet, the bubble
never carries the in-bubble accept (`isAuctionResult`), and it reads `offer.amount`
— which stays the auction result, because the proto keeps dealer replies in the
thread rather than overwriting the offer.

**Change 14 keeps prod's pulsing "1"** — replacing it with an icon alone was
weaker, not stronger. The signal's weight comes from the colour instead: the count
and the status line above it are both red-500. Two things were tried and dropped —
a lime button (tied the button to the reply signal and put a third colour on a
card that already had two meanings for blue) and a chats icon inside the button
(the line above already carries that icon, and the label already says a reply
arrived). The button keeps prod's secondary fill and its plain label.

**Change 15 is the colour system the rest of the batch exposed.** Accept is
primary blue on the card and green-600 in the modal — the same act in two
colours — while the modal's own pair is green accept + blue send, so the card
teaches one meaning for blue and the modal teaches another. v1 fixes the meaning,
not the shade: **green accepts, blue negotiates, amber says something new
arrived.** Card accepts (both the highest and the lower offer) take green-600;
every other button keeps the colour it had.

**A state is written in its action's colour**, which is what settled the two
status lines. "Liikkeeltä on tullut vastaus" and the count on the button are
**both amber-700** — the disc is FILLED with the colour the line is written in,
because amber-400 over amber-700 text read as a yellow dot next to a brown
sentence rather than as one signal. "Odotetaan liikkeen vastausta" leaves amber
(otherwise the two negotiation states read alike) and goes **blue-800**, the text
colour of the "Vastatarjous lähetetty" button directly under it. Slate was tried
there and severed the pair: the state read as switched off while its own button
did not.

**Change 17 is one function, `acceptCls()`,** because accept appears on the card,
in the modal footer, inside the dealership's last bubble and on the accept
confirmation step, and the four have to agree. It is **`green-400` with a black
label**, hover `green-500` — DARKER on hover, like every other button on the
page (blue-600 → blue-700, blue-100 → blue-200); lighter-on-hover read as the
button switching off.

**That pairing is forced by contrast, not chosen.** The label is 14px medium, so
WCAG 2.0 AA wants 4.5:1 and the large-text allowance does not apply. White text
cannot get there on a green bright enough to read as the primary action: prod's
own accept green is **3.30:1**, and `green-500` — the first attempt here — is
**2.28:1**. Both failed. Moving the contrast into the label rather than darkening
the fill keeps the button bright: green-400 on black is **12.05:1**, AAA. A text
shadow, border or glow changes none of those numbers — the ratio is text against
background, full stop.

**`accept-button-lab.html` is where that was decided** and is worth keeping until
the team settles it: a temporary page, linked from nowhere, with 22 candidates
from the brand palette that each measure their own ratio from their rendered
colours (and re-measure on hover), so the numbers cannot drift from what is drawn.
Green-400 + black is the current pick pending the team's view.
The in-message accept also carries the card's exact label,
**"Hyväksy korkein tarjous"**: it needs no amount, since the figure is the bold
number at the top of the same bubble and the button's placement is what says
which price it takes. Naming it made the two accepts read as different actions.

**The brand teal was built as `v2` and dropped.** It is the marketing accent,
reserved for the front page's single CTA; it carries no yes/confirm meaning of its
own; and beside the amber reply signal it competed rather than layered. Removing
it took the arm with it — but `emails.html` keeps what the experiment exposed:
its `ARMS` list is what decides whether a remembered arm is legitimate, and an
unknown one is CLEARED, so with `v2` selected merely opening the email tool would
have forgotten the arm and reset the whole initiative to control. It now lists
`v2`, tests `!== 'control'` rather than `=== 'v1'`, and names the actual arm in
the meta panel. **Any future arm has to be added there too.**

**Amber is the status, red is the notification — and the amber is prod's, kept.**
`Odotetaan liikkeen vastausta` stays `text-amber-600` in BOTH arms: it reads well
and needed no change, so the initiative deliberately leaves it alone. Only
`Liikkeeltä on tullut vastaus` changes, because once it is unread it stops being
a status and becomes a notification: it and the count on the button are both
**`red-500`** (UiBadge's own `red`), the convention every phone has taught.
Control has that line lime, which reads as decorative. So amber = your
negotiation is running, red = something here you have not seen.

An earlier pass moved waiting to `amber-700` to match the offers page's
`Neuvottelut käynnissä` tag, and to `blue-800` before that to pair it with its
own button. Both were reverted — **the tag alignment is not worth a change to a
line that already works.** The waiting amber is ~3.4:1 against white and stays
that way knowingly: so are this page's other status lines (`Umpeutuu`, `Hylätty`
in red-500), the accept button was the one worth fixing because it is the
decisive action, and fixing one status line of several would leave the set
inconsistent. Recorded in the spec as work for an accessibility pass across all
of them.

**Known overload, accepted deliberately:** red-500 is also the page's expiry
colour (`Umpeutuu:`, `Hylätty`), so two cards can show red for two different
reasons. They never collide on the same card, and the notification convention is
strong enough to carry it — recorded in the spec so it is a decision, not a slip.

**A copy pass after change 18 rewrote most of the modal's own strings**, and two
of them changed what the modal SAYS, not just how long it says it:

| Was | Is |
|---|---|
| "Autoliikkeen tarjous voi vain nousta tai pysyä ennallaan." + a separate binding line | "Autoliike voi hyväksyä vastatarjouksesi, jolloin kaupat syntyvät. Se voi myös nostaa tai pitäytyä tarjouksessaan." — changes 2 and 3 in one sentence pair, so the pre-send block is a single paragraph, not a list |
| "Vastausaika on 24 tuntia arkiaikaa. Sen jälkeen neuvottelu päättyy…" | "Voit hyväksyä tarjouksen myös neuvottelujen aikana." |
| "Useimmiten saat sen saman päivän aikana (arkisin kello 10–16 välillä)." | "Liikkeet vastaavat arkisin klo 10–16." |
| "Autoliike on päättänyt neuvottelun. Voit edelleen hyväksyä…" | "Hyväksyttyäsi tarjouksen, autoliike ottaa sinuun yhteyttä." |

**Change 5 therefore has no copy in the UI any more.** The deadline was the
waiting state's second line and that line now says something else. The mechanic
is unchanged and change 9 still rests on it, but nothing tells the seller about
the 24 business hours. Flagged in the spec, not silently dropped. The in-message
accept also lost its checkmark icon.

**Change 19 puts the negotiation in the hero.** The copy under the round photo
already has its own version for no offers, expired, accepted, rejected, a final
offer and a CLOSED negotiation — a live one is the gap, and prod shows the
auction-ended "Nyt on aikasi toimia!" through both the waiting and the replied
state. v1 adds three: waiting, replied-with-a-round-left, replied-on-the-last-
round (the same distinction the send button carries). Placeholder copy, pending
review. `postAuctionStatus` is NOT touched — it stays a transcription of prod's
predicates and also drives the warm-up card and the bottom banner; a separate
`heroCopy(pas, offers)` swaps only the hero, and only in v1.

**Change 18 is about height, on a phone.** The guidance block and the
contact-info warning together pushed the thread below the fold. Three moves, no
fact lost: prod's `contact_info_not_allowed` paragraph under the textarea becomes
the label row's hint beside **Viesti** — **"(Älä lisää yhteystietojasi)"** after
two revisions (`Älä jätä yhteystietoja` → `(Ei yhteystietoja)` → this, which the
team picked when the initiative was presented on 2026-09-02; measured at 138px,
one line at 360px); the **deadline leaves the pre-send block** and stays only in the
waiting state, where change 5 already puts it and where it is the seller's actual
question; and the two remaining facts lose a redundant negation and a redundant
object. Measured at 375px the block goes **194px → 110px** and the modal body
763px → 715px, with `.modal-help` padding dropping to 12px below 620px.

**The card's counter-offer button is prod's `secondary` fill.** A white,
blue-outlined version was tried twice — first as a hierarchy fix (it read as
disabled next to the green), then to give the count a white field (red carries
itself on pale blue, so it did not need one). The secondary is the quieter, less
busy option, with the green accept as the only filled button that matters. The
lime reply button from the first pass at change 14 stays dropped.

**Three proto-only bugs fixed with it**, none of them design:

- **The thread never scrolled to the newest message.** `NegotiationMessage.vue`
  scrolls its list on mount and on every new message; the proto had transcribed
  the capped list without the scroll, so the seller landed at the top of a
  height-capped box with the newest bubble — the one they opened the modal to
  read — below the fold and no scrollbar in view. `scrollThreadToEnd()` runs after
  each render AND after the reveal is shown, because a `display:none` element
  cannot be scrolled any more than it can take focus (the same reason
  QuickNegotiate's focus call sits in `openModal`).
- **Pinning the thread needed three attempts, and the middle one is instructive.**
  Detecting "did the seller scroll?" as *is it no longer at the bottom* is wrong
  here: the list keeps growing after we pin it, so our own position stops being
  the bottom, the handler read that as a user scroll and switched pinning off —
  which is how the last bubble ended up cut off on a phone. It now compares
  against the position we last set. A `ResizeObserver` would be the right tool
  for the growth and **does not fire at all in this environment**, not even the
  initial callback the spec promises on observe, so the pin polls every 100 ms
  until the height is stable for half a second.
- **The Play CDN generates JIT classes asynchronously.** `max-h-[325px]` and
  `bg-[#FAEADA]` are injected by JS, so their rules landed a tick AFTER the
  render: the peach block painted transparent, and the thread was briefly
  uncapped, which left the scroll with nothing to scroll. Both are now
  hand-written CSS (`.modal-help`, `.neg-thread`, `.neg-hint`) with the utility
  classes kept on the element for the record. The scroll also re-pins across two
  frames and once more at 150 ms, and stops as soon as the seller scrolls
  themselves — bubble heights keep changing while late utilities arrive. **This is
  the general rule, restated: any arbitrary-value Tailwind class in JS-built
  markup needs a hand-written rule.**
- **A simulated dealer reply could come in BELOW their own standing offer.**
  `computeDealerReply` did `min(proposed, counter)`, and the seller may counter
  below the standing offer (validation caps only the upper bound), so the proto
  produced a reply prod's `DealerNegotiationMessageAmount` would have rejected.
  Now `max(min(proposed, counter), floor)`, and `meets` is `>=` rather than `===`
  so the clamped case reads as the dealer accepting the ask.

Batch 1's copy is **inline in `decision.html`, not in `translations.js`** — that
page has no `data-i18n` at all and hardcodes its Finnish, so one arm's strings in
the corpus would be the only translated copy on it. All of it is a draft pending
approval except the standing-offer label, which is prod's own
`offer_card.first_place` ("Korkein tarjous") with only its placement new.

Two bullets are **removed and not replaced**: "Tee vastatarjous eniten
tarjonneelle" restates the action already taken, and "Vastatarjouksen avulla
päästään usein kauppoihin" is encouragement — and more counter offers is
explicitly not the goal. Half of offers already reach negotiation; the initiative
is judged on ask quality and acceptance, never on counter-offer volume.

Deliberately out of scope, each for a reason worth keeping: any "most deals close
within X%" band or suggested value (a nudge towards a number, and it would have
us setting the price); warning that the dealership may close the negotiation
(reads as a threat, and presents a mitigation for over-asking as a rule of the
game — change 2 does the same work from the reassuring end); the **four-or-more
offers signal**, which belongs to steering the seller towards *accepting* and to
later initiatives, since inside the modal it would steer them away from an action
they have already chosen; the seller's own estimate or asking price; a seller
confirmation when the dealership accepts; and the two-round structure itself.

**Asking price removal** takes the asking price off the decision page's insights
block, and unifies that block with the offers page while it is there. Change 1
replaces the three-column `dl` (`Tarjousta` / `Autoliikettä` / `Odotettu hinta`)
with the two-column stats grid `Timer.vue` already draws for a live auction —
`auction.landing.auctions_in_progress.total_bids` / `.bidders`, the same icons
(`ph-bold-chart-bar`, `ph-bold-users-three`), the same bordered and divided
frame — inside the decision page's existing white card. The asking price leaves
with the third column, and the plural-aware labels go with it: Timer's strings
have no singular form. Change 2 drops the chart's dashed asking-price line and
its left-hand price box; the bid line, its fill, the highest-bid label and the
date row stay.

**Prod already ships both removals behind `103_combi`.** `AuctionInsights.vue`
takes a `hideExpectedPrice` prop (variation 2) that hides the third column AND
the `Asking price` dataset — `borderDash: [5,5]`. So change 2 is close to
promoting that arm, and half of change 1 with it. **The initiative is
deliberately wider than the test:** the test removes a column, this replaces the
row, so the two pages stop describing the same two numbers in different words
and a different design. Recorded on the spec page as its own section rather than
buried in a change.

**The block is not a component in prod.** It is markup inside `Timer.vue`, which
also draws the progress bar, end date and reg badge — so the spec asks for the
two-column grid to be **extracted** into something both pages use, rather than
copied across. That ask is the whole point of the change; copying would drift.

**The proto did the extraction, so the shape is settled before prod opens the
file.** `AuctionStats.vue` is a real component in `vue-tests/`, built to
`dist/auction-stats.js`, and **both pages mount the same bundle** — offers.html
unconditionally (it already had this design, so the swap is invisible) and
decision.html in `v1` only, so the bar's switcher still shows a real
before/after. It mounts into any `[data-auction-stats]` element and reads
`data-offers` / `data-bidders`, with a `MutationObserver` for both the attributes
and the DOM: both hosts rebuild their markup after load, and `dataset.vueMounted`
is what stops a re-render stacking apps on one node. Its two icons
(`ph-bold-chart-bar`, `ph-bold-users-three`) joined `iconRegistry.js` with path
data verbatim from prod's own SVGs — the users-three source wraps its path in a
clipPath covering the whole artwork, which clips nothing and is dropped.

**B2B shows the same row with a THIRD column, and it must survive this change.**
`B2BDecision.vue` renders the same `AuctionInsights` and passes
`:price-label="t('auction.auction_details.reserve_price')"` — **Hintavaraus** —
with the same `auctionResults.asking_price` the consumer page passes. So prod
already parameterises that column; only the word differs, and there is no
`reserve_price` DB column. B2B does **NOT** pass `hideExpectedPrice`, so
`103_combi`'s hide-gate is consumer-only: promoting variation 2 removes the
consumer column and leaves B2B's alone, which is correct — a B2B reserve price
binds the seller when a bid meets it, so it is a live feature, not a field being
sunset. Flagged on the spec page in its own amber notice so nobody tidies it
away. **Surfaces, checked:** `AuctionInsights` has exactly two consumers, both
decision pages; the two-figure block (`AuctionsProgress` → `Timer`) is imported
by `C2B.vue` only, so the **B2B offers page shows neither block** and nothing
there is affected. FI only — `lang/en/auction.php` has no `auction_details`
block at all.

**`AuctionStats` therefore takes an optional third cell.** `price` (null hides
it, and the grid drops to `grid-cols-2`) plus `priceLabel` defaulting to prod's
`reserve_price`. Its icon is **`ph-fill-coins`** — Phosphor FILL, like the other
two, rather than the stroked `cash.svg`: `UiIcon` renders a plain filled path,
so a stroke-only outline comes out as a solid blob. No prototype surface passes
a price (there is no B2B seller here), so the cell is previewed in the gallery
only — a third example beside the two-cell and both-null ones.

**AuctionStats stacks to rows when its container cannot hold a row** — three
cells below 320px, two below 220px, the dividing rule turning horizontal with
them. A **container** query, not a media query: the same viewport gives this
component wildly different widths depending on the host (a page card, a gallery
panel), so the viewport cannot answer the question. Two gotchas, both cost a
build: a container query **cannot match the element that declares the
containment**, so the markup is a `.av-stats` wrapper around a `.av-stats-grid`;
and the rule is **injected once from the component module** rather than written
as an SFC `<style>`, because every Vite lib config here emits its own
`dist/style.css` into one `dist/` and they overwrite each other.

**What actually caused the clipping was the GALLERY SHELL, not the component.**
`components.html` was a flex row of a fixed 224px sidebar plus `main`, which
never stacked — at 390px that left the preview panel **18px** wide, so every
component card was squeezed, not just this one. Below `lg` the shell now stacks
(sidebar full-width and capped at `max-h-52` above the panel, `main` gets
`min-w-0` and lighter padding), which took the same container from 18px to
266px. Worth remembering when a preview looks broken: **measure the container
before blaming the component** — and an earlier reading of `containerW: 0` was
dismissed as a hidden panel when it was this bug all along.

**Two refinements went in with it, and they make the offers-page swap
VISIBLE.** The icon moves to the LEFT of the value instead of being pushed to
the right edge, and the value is `font-bold`. Both pages share the component, so
the offers page changes too — it is no longer the invisible refactor change 1
originally claimed, and the spec now says so rather than leaving a dev to
discover it. Verified at a real 328px container: three cells at 103px each, no
label clipped. (The gallery's own panel measures zero-width below `lg`, so
measuring the preview there reports nonsense — measure against a page-width
container instead.)

**The chart's top rule goes with the new row.** prod's canvas is
`my-3 py-3 border-y border-slate-200`, which is right while the row above has no
frame — but `AuctionStats` brings its own, so the hairline lands 12px under it
and reads as a doubled line. `v1` renders `border-b`; control keeps `border-y`.
Same edit in `AuctionInsights.vue`, which shows the end state.

**`AuctionInsights.vue` now renders the end state of BOTH changes**, per the
team's call: it contains `AuctionStats` instead of its own three-column `dl`, and
its chart lost the `Asking price` dataset along with the `askingPrice` prop. So
the gallery shows what is being proposed, not what prod does today — a
deliberate choice, and the reason the spec links both cards. Gallery, COMPONENTS.md
and components.html were updated in the same change, as the component process
requires.

**Two things left out on purpose.** `103_combi`'s third arm hides the
asking-price warning under the counter-offer field in `Negotiate.vue` and
`QuickNegotiate.vue` — deferred, and listed on the spec's "Not in this
initiative yet" section with the funnel. And a **second negotiation-modal A/B is
coming in a future dump**, testing the ceiling on what a seller may counter-offer;
worth knowing before anyone reads the modal's asking-price references as settled.

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
where the question was asked.

**Prod's live test stores it differently, and that is NOT a divergence to fix.**
VWO `104_combi` writes `user_intent: { variant, value }` into its own side table,
with option keys matching PHP enums. That shape exists because the test is
temporary; if the data proves valuable and collection continues outside an A/B,
the answer moves into the draft proper — which is the shape the spec and the proto
describe. So the spec documents the intended end state, deliberately, and neither
it nor the proto should be rewritten to match the scaffolding. Nothing about the answer reaches the ad preview
sheet or the car card; it describes the seller's situation, not the ad. All FI/EN copy is
exactly what the live production A/B test is running — FI as specified by the
team, English a working translation. The proto and prod are in step on this copy;
if one changes, change the other.

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

**Seller file upload** adds a documents section to the photos step — **PDF only**
as of 2026-09-03, the team's decision; Word and images were accepted while the
shape of the feature was open. Files are listed by filename with no thumbnails,
each linking to the file in a new tab. `accept=".pdf,application/pdf"`,
`FILE_TYPES` is one entry and `FILE_EXTS` one extension, the hint and `errType`
name one format, and **Seed car** loads two PDFs (`huoltokirja.pdf`,
`vahinkotarkastus.pdf`) rather than a PDF and a .docx. The extension fallback in
`fileTypeOk` stays — a browser can still hand over an empty mime type. `photos.html` gates the section on `html[data-files-arm="v1"]`, stamped in
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

**Upload failures reuse `ImageUpload.vue`'s model whole, because it already has
one.** Prod keeps a LIST of errors, one per failed file — `bg-red-300 p-4 mb-2
relative text-red-950`, filename semibold, its own close button, several at once,
persisting until dismissed rather than a toast — and four strings:
`images_step.filesize`, `.format_error`, `.timeout`, `.file_read_error`. Two
details are the substance of it: **format and corrupt are ONE message** ("ei ole
tuettu tai kuvatiedosto voi olla vioittunut"), and **`onerror` and `ontimeout`
share the `timeout` string**, so a dropped connection and a slow one read alike.
Corruption is caught by CONTENT: `getMimeType` reads the first 12 bytes and
matches magic numbers, so a renamed or damaged file fails on its signature, not
its extension. There is no retry, and the failed tile is dropped after 500 ms.

The documents section now does the same: per-file dismissible banners with prod's
classes, a `%PDF` signature check on an ArrayBuffer read before the data-URL read
that stores it, an empty-read check, and `files.errTimeout` added to translations
in prod's own wording. The 500 ms tile removal has no analogue — a document only
gets a row once it is stored. **The bar's "Upload errors" panel** raises each
state through the real renderer, since none of them can be produced on demand;
the corrupt case is also genuinely testable by renaming any non-PDF to `.pdf`.

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
2. **In production A/B test** — the arms are running against real sellers and the
   initiative is waiting on results and a decision. Chip says *running as an A/B
   test in production — awaiting results*. Nothing about the proto changes: the
   arms stay switchable and `control` stays the default, because a user test still
   has to start from one known state. What DOES change is what "production
   behaviour" means — prod is now serving several arms at once, so the bar's
   `— none —` option and the registry's `prodArm` both mean *the arm matching
   production's control*, not *what a given seller sees*. Say which when it
   matters. Do not delete anything at this stage; a losing arm is still needed to
   read the result against.
3. **Promoted** — the winning arm becomes the only code. Delete the losing arms,
   the page's `initiatives` declaration AND the registry entry (the option group
   disappears, the param stops being read), plus any copy nothing renders any
   more — if `v1` wins on
   Review/No review, the whole `nextSteps` namespace leaves `translations.js`,
   since `price.html` is its only consumer.
4. **Completed** — the spec page stays, its chip changed to *completed — `<arm>`
   promoted, `<month year>`* with a line naming what shipped, and the row above
   moves to a **Completed initiatives** list here. The record survives; the
   switch does not.

**The bar scrolls sideways.** It carries a dozen controls and a phone is 375px,
so `#proto-bar` is `overflow-x:auto` with `#proto-bar > *{flex:0 0 auto}` —
nothing shrinks, the row just runs off the edge and is swiped. The scrollbar is
hidden (`scrollbar-width:none` + the WebKit pseudo-element): at 30px tall it would
eat half the bar. `.pb-spacer` keeps `flex:1 1 auto` and still pushes **Go to**
right whenever the row fits.

**Below 620px it collapses to the chip.** Sideways scrolling keeps every control
reachable but a phone shows about two at a time, so under prod's own `sm`
breakpoint `#proto-bar` takes `.pb-mobile`: everything but the `Prototype` chip is
hidden, and tapping the chip adds `.is-open`, which turns the bar into a capped,
scrollable column with one full-width control per row. The chip carries
`role="button"`, a caret, and Enter/Space. Open state persists
(`autovex_proto_bar_open`) so switching scenario — which navigates — does not
close the bar the tester is working in, and the page keeps its 30px of padding
either way: the open bar overlays the page rather than reflowing it.

The layout is re-synced on the media query's `change` AND on `window.resize` —
the query's own event does not always arrive when the viewport is resized by
tooling rather than by a user, which leaves the bar stuck in its phone layout on
a desktop-width window. (The in-app browser pane resizes without dispatching
either, so dynamic resize cannot be verified there; the load-time path can.)

**Popovers had to become `position:fixed` for that to work.** An absolutely
positioned panel inside a horizontal scroller is clipped by it — setting
`overflow-x` makes the other axis compute as `auto` too — so the panel would have
been unreachable. Fixed escapes any ancestor's overflow (the bar sets no
transform), and `makePopover`'s `place()` sets `left` from the button's rect,
clamped 8px inside the viewport, on open and on every resize or bar scroll. That
clamp is also what keeps a 300px panel on screen when its button sits near the
right edge of a phone. It sets `bottom` from the button too, not from the bar:
once the bar opens into a column its rows sit at different heights, and a panel
pinned to the bar's top edge would cover the control that opened it.

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

**The front page's returning-seller hero does NOT respect this.** It shows
`hero.underReview` — "Ilmoitustasi tarkastetaan parhaillaan" — for any logged-in
seller with a draft, whatever the review outcome, so seeding the no-review car and
verifying the email leaves the front page claiming the ad is under review while
`success.html` correctly says published. It is a **prototype-only state**: prod has
one existing-draft hero ("Laitetaan :model liikkeelle!") and drops the draft once
it is published, so there is nothing here to match. Recorded because the bar's
`268 000 km (No review)` seed now reaches it in one click, and it reads as a bug in
that seed rather than as the pre-existing gap it is. **Parked deliberately:** what
the front page should say to a returning seller whose ad published without a
review is a design question, not a fidelity fix, and it belongs to a later
initiative. Do not "correct" it in passing.

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
Reset prototype = `empty`, and it always returns to `index.html` — clearing in
place would leave you on a mid-funnel or offers page with nothing to render.

**Seed car offers two, through the same popover the page's own tooling uses**
(`makePopover` in `proto-bar.js`, shared so the two controls open and read
identically). Both are a submitted, email-unverified draft with every funnel field
filled; they differ only in mileage, which is the thing that decides the review
outcome:

| Option | State | Mileage | Funnel | Success |
|---|---|---|---|---|
| 148 000 km (Review) | `draft-complete` | inside the band | optional estimate | in review |
| 268 000 km (No review) | `draft-complete-no-review` | over 240 000 | required asking price | queued → published |

Both write `store.reviewable` explicitly rather than leaving it to default: the
price step writes it on submit and a seeded draft is past that step, so the two
states differ by exactly the flag the outcome turns on. `draft-complete-no-review`
is **seed-only** — deliberately not in `PROTO_MOCK.states`, so it stays out of the
front page's scenario menu where it would render identically, and `detect()`
reports it as `draft-complete`. `SEED_OPTIONS` is what the bar reads; the bar
falls back to a single plain button if it is absent.

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

## Reject survey — prod's own, transcribed

Rejecting is a survey, not a confirmation, and it is **not an initiative** — every
question, answer and field below already ships. `RejectConfirm.vue` +
`RejectConfirmThanks.vue` are the whole of it, reached from the decision page's
reject-all banner through `OfferActions.vue`; the offers page never renders it.

**Three steps, and the middle one is the survey.** `Reject` (the "are you sure"
copy, or `QuickNegotiate` when the highest offer is still negotiable) →
`RejectConfirm` → `RejectConfirmThanks`. The proto had the shape already; what it
had wrong was the survey's presentation and its rating control.

**The rating is five FACES, not stars.** `StarRating.vue` draws prod's own
`rating-1`…`rating-5` icons — a scowl through a grin — and colours **the selected
one only**: `getButtonClass` returns that face's colour for the chosen id and
`text-gray-400` plus a hover colour for every other, so the row never fills up
cumulatively the way a star rating does. Colours run red-500, red-400,
yellow-400, green-500, green-700; the hover colour IS the selected colour. The
proto had drawn five stars filling left-to-right at 30% opacity, which is a
different question ("how many out of five") from the one prod asks ("which face
is you"). The icons live in **`rating-icons.js`** — verbatim path data, wrapped
the way prod's `spriteMap` wraps the same symbol (`fill-current` at 60×60, so
every `currentColor` takes the button's text colour and the backing disc keeps
its own `fill-opacity`). Their own file because five 5 kB literals inside
decision.html read as noise, and decision.html is the only consumer — prod's
`StarRating` has exactly one too.

**Their colours are hand-written CSS.** The widget is injected by JS, and the
Play CDN generated `text-green-700` a frame AFTER the click — the face flashed
black on the way to green. Keyed on the button's own `data-rating` with an
`.is-selected` marker; the prod utility classes stay on the element as the
record. Same rule as `.modal-help` and `.neg-thread`, and it applies to
`TextArea.vue`'s `leading-2` (21px on prod's scale) and the thank-you card's
`bg-[rgb(250,234,218)]` for the same reason.

**Nine blocks, all `v-if`, all derived.** Rendered in prod's order: the first
question; the counter-offer price (only under "En halua myydä tarjotulla
hinnalla"); the follow-up question; the free-text box (either OTHER); "kuinka
paljon lisäaikaa"; "millaisen hinnan saat vaihdossa" (the three better-offer
answers); the rating. The proto re-renders the whole survey on any radio or face
click rather than toggling `hidden` on pre-rendered markup — which is what makes
the follow-up question's own options and its tooltip a function of the answer
above it. Text fields write back on `input` and never re-render, so typing cannot
lose focus, and every value is restored from the state — which is why a field
hidden by one answer still carries what was typed into it when a later answer
brings it back, exactly as `v-model` does.

**The first question's follow-up branches on the offer, not the answer.** "Olen
epävarma" asks *"Kuinka voimme auttaa sinua?"* with one option when the offer
clears **90 % of the seller's own estimate** (`price_estimation`, falling back to
`asking_price`), and *"Miksi olet epävarma tarjouksesta?"* with two when it does
not. Reachable in the proto with `?asking=` — 11 500 against 12 000 takes the
first branch, against 20 000 the second.

**`clearFields` runs on the FIRST question only.** prod clears the follow-up
answer and the three numeric fields when the primary answer changes, and clears
the free text as well when the new answer has no follow-up of its own (its
computed does it in the same `default` branch that returns no options). Changing
the follow-up answer clears nothing.

**Two fields are sent, not one.** `rejected_reason` is the answer; `reason` is
the legacy `tender_offers.negotiations_rejected_reason` a watcher maps it onto
(`IM_NOT_SURE_ABOUT_OFFER`, `PRICE_DIFFERENCE_TOO_BIG`, `I_HAVE_A_BETTER_OFFER`,
`CAR_SOLD`, `NEED_MORE_TIME`, `NOT_SELLING`, `OTHER`), and `rejectDisabled` reads
both plus `StarRating`. One answer set has no field of its own: "milloin uskot
voivasi myydä autosi" arrives as `otherReasonText`. The proto keeps the whole
payload — `tracking_form_name: 'reject_feedback'` included — in its saved state
as `rejectFeedback` so a tester can read back what the survey captured; nothing
renders it, and prod POSTs the same shape to `offers/{id}/nps-tracking`.

**The rating is what gates the button**, indirectly: it only appears once the
follow-up is answered (or immediately for "Muu syy", which has none), and it is
required — so an unanswered follow-up is what actually blocks the submission.
Disabled is `Button.vue`'s own grey, not a dimmed primary.

**The thank-you screen is two halves and two images.** `thank-you-banner.png`
below `lg`, `thank-you-banner-desktop.png` above it — the desktop one is
portrait, so it is swapped rather than scaled, and both are byte-identical copies
of prod's. The card sits inside the Reveal's own padding (the proto's earlier
version bled it out with negative margins, which prod does not do) and carries
its own close button, since `OfferActions` renders no footer for this action.

**Three prod details transcribed knowingly.** Its title is a **bare `<h2>`** —
`custom.scss` gives it `font-display` and Tailwind's preflight strips size and
weight, so prod states "Kiitos kun käytit palveluamme!" at body size in Barlow.
Its mailto is written `href="mailto:{{ customerSuccessEmail }}"` — a mustache in
an unbound attribute, so prod shows the right address behind a link that does not
resolve; **the proto links it**, since a tester clicking a dead link learns
nothing. And the rating's label carries prod's `for="score"`, which matches no
element on the page.

**Copy is prod's `tender.rejection_reason_for_seller.*`, verbatim and Finnish
only** — there is no `en` entry for this namespace in the dump, and decision.html
holds its Finnish inline, so nothing here belongs in `translations.js`.

**Left alone deliberately:** the `Reject` step's own footer puts "Tee
vastatarjous" left of "Hylkää tarjous" where prod orders them the other way
inside a `justify-center lg:justify-end` row; and prod shows a toast
(`app.offers.msg.reject`, "Tarjous hylätty.") after the survey posts, which the
proto has no toast system for. Both are outside the survey itself.

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
renders only `total_bids` and `bidders`; and `QuickNegotiate.vue`'s
`negotiation_round_one_rejection.*` block, unreachable because the reject banner
is hidden in the only state that would show it (see Enhanced negotiations).
Add them to the list with `AConfetti`,
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

**The list is the navigation, so it is pinned.** From `lg` the column is
`sticky top-4` with its own capped, scrolling body — 22 emails against a page
that is taller than the viewport once one is open, and scrolling back up to
switch was the whole friction. Below `lg` the columns stack and the pin is
dropped; a pinned list on a phone would be the screen. The open email's row is
centred inside the list on load, deferred across two frames and once more at
150 ms: the column's cap is an arbitrary-value utility the Play CDN generates
late, so at render time the list is still uncapped and the row measures as
already visible. Measured with rects applied as a delta, not `offsetTop` — the
column is `sticky`, so a row and its scroll container resolve against different
offset parents, which is how the first version scrolled to the wrong place.

**Subject and sender are the email's header; everything else follows the body.**
Fifteen rows of state/trigger/timing/template used to sit between the page title
and the email itself, so the thing the page exists to show started below the
fold. They are now a **Details** card under the rendered email, and the mail
chrome caveat is a footer strip on the email card.

**Two pre-existing mobile faults came out with it.** The row is
`flex items-start`, which is what lets the pinned column sit at the top — but
below `lg` the row becomes a COLUMN and `align-items` then governs WIDTH, so the
reading pane sized itself to the 570px mail shell and scrolled the whole page
sideways (`max-lg:items-stretch` fixes it). And `#email-render` is now
`overflow-x-auto`, so a shell wider than a phone scrolls inside its own card
rather than taking the page with it.

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
