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

Exposes `window.protoMode` (`'dev' | 'test'`) and `window.protoDev` (boolean).

**One control surface: `proto-bar.js`.** All proto tooling lives on a single
thin strip fixed to the viewport bottom — deliberately styled like browser
chrome (grey, system font, native `<select>`s) so it never reads as AutoVex UI.
Dev mode only. Present on every page, including ones with no scenarios, so the
mode is always legible. Collapses to a small corner tab; that state persists.

It replaced five inconsistent per-page drawers (offers, decision, photos,
success, dac7), the delivery-variant switcher on details, and the footer's
"Prototype instructions" link. `photos.html` also lost its `<footer>` — it was
the only funnel page with one, and it existed solely to host that drawer.

Shows: a `Prototype` identity chip, **Mode**, **Scenario**, **Variant** (only
when the page has candidates) and **Go to**. No page name, no collapse control
— the bar stays visible. The Mode row is thin value while there are only two
modes; it earns its place once there are more.

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
  variants: [ { id, label } ],
  variantParam: 'delivery',         // default 'variant'
  variantDefault: 'v2'              // what renders with no param
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

**Adding proto-only UI:** prefer putting it on the bar. If it must be its own
element, mark the root with `data-proto-dev` AND skip building it when
`!window.protoDev`. The CSS rule (`[data-proto-dev]{display:none !important}`)
is a safety net; not building it is the actual fix.

**Guard placement matters.** `if (!window.protoDev) return;` must sit inside the
panel's own IIFE, never in an enclosing function that has page logic after it.
Two pages broke this way during implementation — `details.html` would have
skipped `updateCard()`, and `decision.html` rendered no state at all until the
panel was wrapped in its own IIFE.

**`?scenario=` and `?variant=` still work in test mode.** URL carries the state;
only the chrome is gated. That is how a moderator pins a participant to a
starting state they cannot navigate out of.

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
