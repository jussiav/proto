# AutoVex / Wheelaway — Project Context

All project context lives in `/docs/`. Read the relevant files before making decisions.

## Reference Source Locations (updated 2026-08-13)

- **Production codebase (read-only reference):** `Prod-codebase/<folder>/` inside this project — currently `Prod-codebase/autovex-2026-08-14-435a41f68ebc/`. Newer dumps are added as sibling folders; always use the newest. Gitignored, never push, nothing in the proto depends on it.
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

10. **Nav bar (white).** Fixed, `h-20 bg-white`, followed by spacer `<div class="h-20 bg-blue-50">`. Contains: AutoVex logo (left) + "Aloita kilpailutus" primary blue button (desktop only, hidden mobile) + account-filled icon + "Kirjaudu" label (right). Source: `ONavigationBar.vue` + `Header.astro`.

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
