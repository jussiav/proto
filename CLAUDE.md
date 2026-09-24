# AutoVex / Wheelaway — Project Context

All project context lives in `/docs/`. Read the relevant files before making decisions.

## Reference Source Locations (updated 2026-09-24)

- **Production codebase (read-only reference):** `Prod-codebase/<folder>/` inside this project — currently `Prod-codebase/autovex-2026-09-24-760241d9dd71/` (previous: `autovex-2026-09-16-d1ea5398cdb4/`, `autovex-2026-09-07-fdd3a0224ef9/`, `autovex-2026-08-31-3064d348fba0/`, `autovex-2026-08-26-1ee95731e59f/`, `autovex-2026-08-20-99ed8bef6330/`, `autovex-2026-08-14-435a41f68ebc/`). **A dump can arrive with a malformed name** — the 09-16 one unpacked as `autovex-autovex-d1ea5398cdb4`; rename it to `autovex-<date>-<hash>` before using it. Newer dumps are added as sibling folders; always use the newest. Gitignored, never push, nothing in the proto depends on it.
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

   **It also injects prod's element-level heading typography** (added 2026-09-08,
   after the support banner's title was caught looking nothing like production).
   Prod styles headings as ELEMENTS in `sass/base/_typography.scss`, and
   `custom.scss` adds the family for `h1`–`h5` only. Both load after
   `@tailwind utilities`, so they beat preflight's heading reset while still
   losing to any utility on the element — which is exactly how the injected
   `<style data-proto-typography>` behaves here. Resolved values:

   | Element | Base | From `sm` 620 | From `lg` 992 | Weight | Family |
   |---|---|---|---|---|---|
   | `h1` | 32 / 36 | — | 48 / 52 | 700 | Barlow |
   | `h2` | 28 / 36 | — | 40 / 46 | 700 | Barlow |
   | `h3` | 24 / 30 | — | 32 / 36 | 700 | Barlow |
   | `h4` | 18 / 24 | — | 24 / 27 | 700 | Barlow |
   | `h5` | 18 / 21 | 20 / 24 | — | 600 | Barlow |
   | `h6` | 14 / 1.25 | 16 / 1.375 | — | 600 + `tracking-wide` | **DM Sans** |

   `h6` is the odd one out in both places: `_typography` styles it, `custom.scss`
   does not, so it keeps the body font. The `.heading-1`…`.heading-6` aliases prod
   pairs with each element are **not** ported — nothing in the proto uses them,
   every heading here is a real element the rule already covers, and as classes
   they would out-rank the utility strings rule 6 asks for. `.hero h1` likewise.

   **`p` is NOT ported, and that is an open decision.** Prod also styles the
   paragraph element (`mb-4.5 lg:mb-6 text-base leading-snug sm:text-lg
   last:mb-0 font-normal`), so bare body copy there is 16px→18px from 620px with
   an 18px→24px bottom margin. **335 of the proto's 561 `<p>` elements carry no
   size class**, so porting it would resize and re-space most of the prototype's
   body copy at once. Worth doing deliberately, with a sweep, not as a side
   effect.

   **Which headings the element rule actually reaches — and it is NOT every
   heading without a size class.** `fontSize` is ported only from `3xl` up (plus
   `2xs`), and those keys are plain strings that pair NO line-height. `xs`
   through `2xl` keep the CDN's own defaults, which DO pair one — `text-lg` and
   `text-xl` both carry `1.75rem` — and a utility out-ranks an element rule. So:

   | Heading carries | Size from | Leading from |
   |---|---|---|
   | `text-3xl`+ or `text-2xs` | the utility | **the element rule** |
   | `text-xs`…`text-2xl` | the utility | **the utility's paired default** |
   | no size class | the element rule | the element rule |
   | any `leading-*` | as above | the utility |

   That table is the whole safety story, and getting it wrong in either
   direction costs a round trip.

   **Audit BOTH size and leading — the first pass audited only size and
   weight.** That miss shipped a regression: the decision page's warm-up
   headline is `text-3xl` with no leading, so it took the element rule's
   **46px at 992px** where prod pins it back to 36px, and Jussi caught it
   against production. Prod's own markup says why —
   `<h2 class="text-3xl font-bold mt-2 lg:leading-6">` — that `lg:leading-6`
   exists precisely to undo the element rule's own `lg:leading-8`. The proto now
   carries `lg:leading-[36px]` (pixels, since prod's `lineHeight` scale is not
   ported) and reads 28/36 at every width, as prod does.

   The same miss reached the email tool: `.em-body h1` sets no line-height, and
   prod's mail theme does not either — it lets `body`'s `1.4` inherit. An
   element rule on the heading beats an INHERITED value, so those headings took
   36px on 19px text. Both guards there are now `font-family: inherit;
   line-height: inherit`, which reproduces prod's cascade instead of restating
   values that could drift from `.em-body`.

   **The method, corrected:** sweep for headings that carry a ported size
   (`3xl`+/`2xs`) **or no size at all**, AND no `leading-*`; those are the only
   ones the element rule governs. Then confirm per page in the browser at three
   widths. Current result: `email-content.js`'s 24 (guarded by `.em-body`), the
   reject survey's thank-you `h2` (bare, and correct — prod styles it the same
   way), and `mobile-upload-widget.js`'s `h1`, which now pins `line-height:1.2`
   inline beside the size it already set there. `accept-button-lab.html` and
   every `design-specs/` page do not load `tw-tokens.js` at all, and the proto
   bar is immune through its own `#proto-bar *{font:inherit}`.

   **A section title fixed in passing:** prod's `Section.vue` puts `leading-3`
   (24px) on the title span, which `offers.html` transcribed and
   `decision.html` never did — it was inheriting `text-xl`'s 28px. Now
   `leading-[24px]` on both. Unrelated to the element rules; the `h2` above it
   is a flex container, so its own leading draws no line box either way.

   **Proto-only chrome is not a place to "fix" leading.** `offers.html`'s two
   modal titles and the nine component-gallery headings are all `text-lg`, so
   they were never touched by the element rules — they keep the CDN's paired
   28px. I briefly added `leading-tight` to all eleven and reverted it: that
   would have been a real visual change to eleven surfaces, made while fixing
   something else, on the strength of an audit that had not yet distinguished
   ported sizes from paired ones.

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

   **Headings are Barlow because of the tag, not a class** — and **so is their
   size and weight.** `custom.scss` applies `font-display` to `h1`–`h5` and
   `_typography.scss` applies size, leading and weight to `h1`–`h6`, which is why
   the price step's `<div role="heading">` is DM Sans at a size of its own while
   every step title, an `<h2>` in prod, is big bold Barlow without saying so.
   **The proto now carries both rules** (see rule 5), so a heading transcribed
   with no size or family class renders as prod's does rather than at body size.
   The explicit strings in the table above are still the convention — they say
   what the element is meant to be and they out-rank the element rule — but they
   are no longer load-bearing for the family.

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

    **Button LABEL SIZE comes from the `size` prop, and only two of the four
    sizes set one** (audited 2026-09-14 against the 09-07 dump). `UiButton`'s
    base cva is `text-base leading-tight`; `sm` and `md` override it with
    `text-sm`, `lg` and `fw` do not — so **`lg` and `fw` labels are 16px** and
    `sm`/`md` are 14px. `md` is the DEFAULT, so a `<UiButton>` with no `size` is
    14px.

    | Size | Classes | Label |
    |---|---|---|
    | `sm` | `text-sm px-3.5 h-8` | 14 |
    | `md` *(default)* | `text-sm px-5 h-10` | 14 |
    | `lg` | `px-8 h-14` | **16** |
    | `fw` | `px-8 h-14 w-full` | **16** |

    The legacy `elements/Button.vue` is a separate scale: `medium` (its default)
    is `py-2 text-base`, plus a base `font-medium leading-none tracking-wider
    px-5`. `large` is `text-lg`, `small` `text-sm`.

    **Which consumer surface uses which, and what the proto had wrong:**

    | Surface | Prod | Label | Proto before |
    |---|---|---|---|
    | Decision offer card — accept, counter offer | `UiButton` `lg` | 16 | **14** |
    | Decision warm-up — `Katso tulokset` | `UiButton` `lg` | 16 | **14** |
    | Decision support banner | `UiButton` `fw` | 16 | 16 ✓ |
    | Negotiate / reject / thank-you modal footers | `Button.vue` medium | 16 | **14** |
    | In-thread accept (`DealerAcceptCounterOfferAction`) | `UiButton` `md` | 14 | 14 ✓ |
    | Offers page — car card CTAs, notification CTAs | `UiButton` `md` | 14 | `text-xs sm:text-sm` |

    Twelve labels on `decision.html` went to `text-base` and `vehicle-card.js`'s
    `BTN_BASE` lost its `text-xs sm:` step — **the card CTAs were 12px on a
    phone where prod is 14px at every width.** The in-thread accept keeps
    `text-sm` deliberately: it is prod's dealership component, which passes
    `size="md"`, so it is the one button on the decision page that is smaller
    than its neighbours in prod too.

    **Two divergences found in the same audit and NOT changed**, because they
    are geometry and weight rather than the label size that was asked about:

    - **`UiButton` sets no `font-weight` at all**, so prod's card, warm-up and
      offers-page labels inherit the body's 400. The proto writes `font-medium`
      (500) on all of them. `Button.vue` DOES set `font-medium`, so the modal
      footers are right and only the `UiButton` surfaces are heavy.
    - **Heights and paddings.** The warm-up CTA is `px-6 h-12` against prod's
      `px-8 h-14`, and the offers-page card CTAs are `px-4 py-2` (36px) against
      prod's `px-5 h-10` (40px). Both change layout, so they are a decision
      rather than a transcription fix.

11. **Accordion/FAQ.** Use the MAccordion pattern: `<details class="group peer">` + sibling content div with `grid grid-rows-[0fr] opacity-0 peer-open:grid-rows-[1fr] peer-open:opacity-100 duration-150 transition-[grid-template-rows,opacity]`. Item wrapper: `bg-white p-3 rounded-md`. Title: `text-sm text-gray-700 group-open:font-bold`. Icons: `caret-down`/`caret-up` 16×16 `text-slate-500`. List gap: `space-y-2.5`. FAQ content comes from `faq.sellers_profile_faqs` in `vue-i18n-locales.generated.js` — all items, exact HTML.

12. **Nav bar — one shared definition, `site-nav.js`.** Never inline nav markup in a page and never re-add nav HTML to `layout.js`. A page opts in with `<div id="site-nav"></div>` followed immediately by `<script src="site-nav.js"></script>` (the script must come right after the mount so the nav exists before any inline page script that reads `#nav-login-label`).

    Blue variant, matching prod `ONavigationBar.vue` with `color="blue"`: spacer `<div class="h-20 bg-av-blue">` then a single `fixed h-20 bg-av-blue z-50` header, inner `nav` at `max-w-[1440px] mx-auto px-6` (prod's `max-w-screen-xxl`; `screens.xxl = 1440px`). White logo, menu items pushed right with `ml-16`, "Aloita kilpailutus" CTA (`lg:` and up only) + account icon + "Kirjaudu" label on the right.

    **Scroll = headroom.** One nav, no second white nav. Pinned within the top 96px; scrolling down past that unpins it (`translateY(-100%)`), scrolling up pins it back. `transition: transform 200ms linear`. Ported from prod's `useHeadRoom.js` (headroom.js, offset 96) + `sass/headroom.scss`.

    **Funnel pages have no nav** (details/price/services/photos/contact/success) — they omit both the mount and the script. Currently on the nav: `index.html`, `help.html`, `dac7.html`, `decision.html`, `offers.html`.

    **Menu items only on marketing pages.** In prod, `ONavigationBar`'s `menuItems` prop defaults to `[]`, and only two consumers pass anything: `Header.astro` (marketing, from Contentful) and `offers/landing` — there only for B2B sellers (`isB2BSeller ? menuItems : []`). Every consumer-facing app page (`offers/decision`, `PersonalInformationPage`, `auth`, `not-verified`, `complete-profile`) passes none, so `MMenu`'s `v-if="menuItems.length"` renders nothing. A proto page opts in with `<div id="site-nav" data-menu="marketing">` — currently only `index.html` and `help.html`. The CTA and "Kirjaudu" are NOT gated: prod's default `#actions` slot renders `MMenuCTA` + `MProfileMenu` on all of those pages.

    Prod source: `ONavigationBar.vue`, `Header.astro`, `useHeadRoom.js`. As of the 2026-08-20 dump the **white variant is gone** — the `color` prop was removed from `NavigationBarProps` entirely, `navigationVariants` is a fixed `bg-blue` object, and the spacer is unconditionally `h-20 bg-blue`. Blue everywhere is now prod, not a divergence.

13. **Never invent a component, and never change a shared one without the
    inventory.** Rules 1–3 forbid inventing style, copy and structure; this is
    the same rule for components. **Preference order, and it is Jussi's:
    reuse what exists → redefine an existing token → create something new,
    last.** *"I like when we stop using deprecated components, don't like when
    we create new ones, and like aligning button styles across the app
    (seller + buyer side)."*

    **The procedure is the `shared-component-change` skill, not this file** —
    six checks to run before proposing, and the shape of the artefact that
    carries it. It is a portable procedure, so it lives in the skills layer
    where devs on other repos can use it too; this file holds only what is true
    of THIS repo. Read the skill before proposing; read the worked example
    below for what it looks like against prod.

    **The worked example is `accept-button-lab.html`** (2026-09-17, the
    `intent="success"` change). Everything the inventory turned up, which is
    repo knowledge and belongs here rather than in the skill:

    | | |
    |---|---|
    | Components serving this role | **three**, and **two are deprecated** — `elements/Button.vue` (16 consumers) and `ui/UiButton.vue` (77) both point at `atoms/AButton.vue` (8) — counts from the 2026-09-24 dump |
    | Consequence of the ratio | the migration has barely started, so a token change has to land in **both** `UiButton` and `AButton` until one is gone |
    | Same name, two hues | `intent="success"` is lime on the button and **`text-green-600`** in `UiIcon.vue` / `ASpriteIcon.vue`. The button is the outlier — this turned out to be the strongest argument in the whole proposal |
    | Seller side | three accepts, **three colours**: the card is `UiButton variant="primary"` with **no intent** (blue); the accept confirmation step is the legacy `Button color="green-600"` — the only consumer of that colour anywhere; and since the 2026-09-24 dump the in-thread accept is `AButton variant="primary" intent="success"` (lime), the only seller-side `success` consumer |
    | Dealership side | three accepts, all `UiButton variant="primary" intent="success"` — `DealerAcceptCounterOfferAction`, `DeliveryAgreedActions`, `PastDeliveryDateConfirmModal` |
    | All of them sit on **white** | Reveal's panel, the CallSeller card, and — for the dealer accept — the seller's own `bg-white` speech bubble |
    | Variants with **zero** consumers | `default`, `secondary`, `ghost`, `link` of `success`. Every consumer is `primary`, so today the fill is always opaque and the page background cannot affect a label |
    | Untouched by the change | `UiBadge` `lime`/`light_lime`, `UiTab` success, `OProductCard`, `OContainer`, `ReservePriceNotice`, `B2BReserveStatusBadge` — none reads a button's `intent` |

    **And the check that cost me the argument, kept here because it is the one
    most likely to repeat:** I led with "lime fails AA in 7 of 14 states". With
    the label fixed to black, **lime passes too, and scores higher than green**
    (13.93 / 10.63 against 12.05 / 9.22 — `lime-400` is the lighter fill).
    Contrast settled the LABEL, never the hue. The skill's check 6 is this
    lesson generalised.

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
(`?delivery=stepper`, `?enhanced-negotiations=bogus`) would otherwise stick in
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

**Change 4 is CLOSED with no change to any transactional email** (2026-09-07).
It had been "Ongoing work" with two approved copy edits; reading all three
candidates against the actual trigger closed it instead, and the initiative now
reads `3 ready to build · 1 reviewed, no change · 1 later, with Marketing`. The
three decisions, each turning on the trigger rather than the wording:

| # | Email | Why it stays |
|---|---|---|
| 4.1 | Email verification, new seller | **It promises no call.** "…ja tiimimme on tarkastanut ilmoituksesi" says the team CHECKS the listing, which is a different claim from phoning the seller — it commits us to nothing the seller then waits for, so a no-call publish does not contradict it |
| 4.2 | Missing photos reminder | **Every recipient really has been called.** Only an advisor can trigger it, and they trigger it during or after the review call, so "asiantuntijamme kanssa käymäsi puhelun mukaisesti" is true by construction |
| 4.3 | Auction ended · no offers | Honest, usually the real reason, and the only part of that email that answers the seller's question — softening it would cost the seller the explanation to spare us the awkwardness |

**The distinction that closed it: a promise of a CALL is the problem, a mention
of a review is not.** The initiative exists because sellers wait for a call that
never comes. Copy that says we look at the listing carries no such wait, and it
stays broadly true while any share of listings is reviewed.

Both `v1` overrides, both `initiative` links and the one `unchanged: true` are
gone from `email-content.js`, so the tool shows every one of these emails with no
badge and offers no arm — an arm that renders identically to control reads as
"the change is in and it looks the same". `emails.html` keeps its generic
per-email arm machinery; **Enhanced negotiations' change 7 is now its only
consumer**, and that one swaps a link target rather than copy, so the
`active.v1.body` branch of the variant label is currently unreached.

The spec section survives as a **recorded decision**, following 4.3's own
pattern: slate `Decided · no change` chips, "Nothing to build here", each email
quoted with *why it was considered* and *why it stays*, and a **What would
re-open this** card — because two of the three rest on how the email is
triggered, not on the wording. If photo chasing is ever automated, 4.2 becomes
untrue; if listings stop being checked before publishing at all, 4.1 does. The
numbering is deliberately NOT shifted: the team has the page, Change 5 stays 5.
`Ongoing work` as a status is still the right chip for something specified and
agreed but not yet scheduled — it just no longer applies to anything here.

**All the remaining email work is Change 5**, the Marketing-owned lifecycle
family, which is where the actual call promises live (one in a subject line).
The hero paragraph says "our marketing emails" rather than "the emails" for that
reason.

**Two markers keep the tool honest about copy it is showing, and NEITHER is in
use.** `draft: true` on a `v1` renders "placeholder copy, not approved" in the
list badge, the bar's variant label and the meta panel — without it a green
`v1 differs` asserts an approval nobody gave. `unchanged: true` on a STATE
renders a slate `unchanged` badge instead of `candidate`, for a mail whose
initiative reaches only some of its states — Review/No review's verification
email was the one user, marking the returning-seller version as deliberately
untouched, and it went with change 4. Both renderers stay: the next initiative
that wants something to react to before sign-off, or that touches one state of a
conditional email, needs them and they are already wired.

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

**Change 5 is parked, not pending, and it is the one section written for
ANOTHER TEAM.** The SendGrid lifecycle emails are Marketing's, so its change-log
status is `Later · with Marketing` rather than an amber `Needs an owner` — amber
read as work waiting on us — and no wording is proposed for emails another team
owns.

Rewritten (2026-09-07) as **a brief Marketing can act on**, because the previous
version was written for a dev reading a spec: it opened with meta-commentary
about why the section was on the page at all, and a reader had to work out what
they were being asked to do. The shape now is: an **In short** card explaining
selective review calling in three short paragraphs (what is changing, why the
communication has to change with it, what we need from them), a one-line
**Who does what** strip, then three plainly-titled blocks — *The emails we know
about* (subject lines with an English gloss, worst first, plus the one that was
checked and needs nothing), *What to look for* (five patterns, each with an
example Finnish phrase and the consequence), and *How to fix a line* (delete it,
or make it conditional with the support pages' own `tarvittaessa` /
`tapauskohtaisesti` — and avoid a soft "saatamme soittaa", which still creates a
wait). It ends with the three-senders warning, which Marketing needs and a dev
does not.

**The rule this establishes: a spec section addressed to a non-dev team drops
the spec conventions.** No Where/Scenario chip pair, no acceptance criteria, no
prototype link, no reasoning about which branch fires — an overview of the
change, examples, a checklist, and what to do about each hit. The audience is
named in the heading (`(for Marketing)`) and in the first chip
(`For Marketing · not a dev task`) so a dev skims past it.

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
| Seller file upload | Live | `seller-file-upload` | `control` | `control` | `photos.html` | `design-specs/seller-file-upload.html` |
| Enhanced negotiations | Live — **changes 4 + 5 shipped** (2026-09-24 dump), rest `v1` only | `enhanced-negotiations` | `control` | `control` | `decision.html` | `design-specs/enhanced-negotiations.html` |
| Seller intent | **In production A/B test** | `seller-intent` | `control` | `control` | `price.html` | `design-specs/seller-intent.html` |
| Asking price removal | Live | `asking-price-removal` | `control` | `control` | `decision.html` | `design-specs/asking-price-removal.html` |
| Enhanced success page | Live | `enhanced-success-page` | `control` | `control` | `success.html` | `design-specs/enhanced-success-page.html` |
| Informed decision | **Ideation → A/B candidate** — fair-offer sellers only; also renders Enhanced negotiations `v1` | `informed-decision` | `control` | `control` | `decision.html` | `design-specs/informed-decision.html` |

**Completed initiatives:**

| Initiative | Outcome | Spec |
|---|---|---|
| Review/No review | **Changes 1–3 shipped, September 2026**; change 4 closed as no change; change 5 still with the PM, Marketing-owned. No arms remain — `price.html` and `contact.html` render the shipped design unasked, and the registry entry is gone | `design-specs/review-no-review.html` |

**Two are in a live production A/B test** — Delivery distance (VWO `105_combi`)
and Seller intent (VWO `104_combi`), both still registered in the 2026-09-07 dump
— so their arms are being measured against real sellers and neither has a winner
yet. Seller intent is expected to keep running for at least another week from
2026-09-07. Their `prodArm` stays `control` and their page default stays
`control`: that is what the proto renders unasked, which is what a user-test
participant must land in, and it is the arm the eventual result gets read
against. Nothing gets deleted until one is promoted.

**The rest of prod's experiment list, as of the 2026-09-07 dump.** Worth keeping
straight, because two of them have decided initiative scope and a stale reference
to a discarded one dates a comment badly:

| Test | State | Bearing on the proto |
|---|---|---|
| `103_combi` hide expected price | **concluded, split** | Promoted for the insights block, discarded for the negotiation modal — see Asking price removal below |
| `100_combi` verified service history | **discarded** | Constant and component both deleted. Was paused by a hotfix in the 08-31 dump; that is resolved, no owner needed |
| `93_combi` remove service book upload | **not progressing** — team's call, 2026-09-07 | Still registered with no consumer, so it writes assignments for nobody. Would have collided with Seller file upload; it will not |
| `92_combi` label-less estimate field | **discarded** | Gone from the enum. Its behaviour is plain prod now, so `translations.js` and `price.html` describe the label-less field without naming the test |
| `89_combi` delayed negotiation CTA | live, **to be revisited later** | Sends a nudge email to a seller with offers and no negotiation. Overlaps Enhanced negotiations; deliberately not reconciled yet |
| `73_combi`, `91_combi` | registered, no consumer | Cleanup only |

**Never cite a VWO number in a proto comment to explain prod behaviour that is
now unconditional.** A discarded test's number makes a true statement read as
provisional, and the next person greps for a flag that no longer exists. Describe
what prod does; mention the test only where an arm is still live.

**Enhanced negotiations** makes the negotiation's own mechanics legible in the
modal, where today none of them are. Almost half of all offers reach a
negotiation and the usual reason one fails is the seller asking too much — and
every fact that would tell them what is reasonable exists but is off-screen when
they type. **Built in batches**, one arm (`v1`) carrying all of them:

| Batch | Changes | State |
|---|---|---|
| 1 | standing offer by the field · offer can only rise · counter offer is binding · 24 business hours + auto-close | in the proto |
| 2 | the dealership's thread component · in-bubble accept · rounds on the send button | **thread + in-bubble accept shipped** (2026-09-24 dump); rounds on the send button still `v1` only |
| 3 | findability — email link target and the open-thread affordance · the auto-close's own voice | in the proto |
| 4 | the modal's own presentation — header, contained guidance, hint badge, card affordance, required-error copy | auction-result bubble **shipped** (2026-09-24 dump); the rest `v1` only |

Three findings from prod hold the design up, all verified against the 2026-08-31
dump. **A counter offer is binding**: `DealerAcceptCounterOfferApiController`
runs the same `AcceptOffer` the seller's own accept does, so the sale closes at
the counter price with no further step — the hesitancy sellers report is correct,
and the copy says so rather than soothing it. **A dealer's offer can only rise**:
`DealerNegotiationMessageAmount` rejects any reply below the standing amount and
`CloseNegotiation` preserves it, so "up or unchanged" is a mechanic, not
reassurance. And **the two sides ran different thread components** — the seller
was on the legacy `partials/Negotiation.vue` while the dealership had
`partials/negotiations/NegotiationMessage.vue`, with in-bubble accept,
`Avaa neuvotteluhistoria` on a closed negotiation, and a height-capped thread.
Batch 2 was that swap, which is why it was reuse rather than design — and it is
the part that shipped first (below).

**SHIPPED IN THE 2026-09-24 DUMP: changes 4 and 5 of the spec** (batch 2's
thread swap and in-bubble accept, batch 4's auction-result bubble). What prod
now does, and therefore what `control` renders:

| Part | Prod, 2026-09-24 |
|---|---|
| component | `partials/Negotiation.vue` is **deleted**. `Negotiate.vue` and `QuickNegotiate.vue` render `NegotiationMessage` with `point-of-view="seller"` and `:collapse-when-stopped="false"` |
| bubbles | a new molecule, **`MNegotiationBubble`** (`app/components/molecules`), carrying the classes that used to be inline in `NegotiationMessage` — own `border-blue-300 bg-blue-50`, other `border-gray-200 bg-white` |
| first bubble | `auctionResult`: `offer.auction_amount ?? offer.amount`, labelled `offer_card.first_place` ("Korkein tarjous"), timestamped `auction_ends_at`. **It renders with no negotiation too** — `Negotiate.vue` dropped its `v-if="negotiation"`. `auction_amount` is the offer's last `bid`/`auto_bid` revision, a subquery in `TenderOfferApiController`, not a column |
| accept | inside the **last** message when it is the dealership's, `AButton variant="primary" intent="success" size="md"`, label `accept_highest` ("Hyväksy korkein tarjous"), `:disabled` = `loading \|\| buttonDisabled`. Shown on a stopped negotiation too |
| footer | `OfferActions.showAccept` is now `action === 'Accept'` alone, so **the negotiation modal has no footer accept at all** |
| unchanged | header, tips, the blue last-round block, `Lähetä`, the contact-info paragraph, the support lines, error copy — everything else on the spec |

**So the in-thread accept is LIME in prod today** — it is the first seller-side
consumer of `AButton`'s `success`, which has not had its green change yet.
Control reproduces that; `v1` keeps `acceptCls()`, which is what that button
becomes once the token change lands. The spec marks 4 and 5 **Shipped** and
leaves change 15 (the green) open.

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
(`showNeg`). Every other state ends with a single button: prod's negotiation
modal has no footer accept at all since the 2026-09-24 dump, so accept + send
never share a row.

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
declared `pointOfView` with `'seller'` already an accepted value, so the swap was
a prop flip — **now made in prod, see SHIPPED above**: bubbles go from the legacy solid-blue fill plus a
rotated CSS tail to bordered cards — own `border-blue-300 bg-blue-50
rounded-tr-none ml-auto`, other `border-gray-200 bg-white rounded-tl-none
mr-auto` — in a `max-h-[325px] overflow-y-auto` list. From the same stack:
`NegotiationForm.vue`'s `label – <b>amount</b>` shape for change 1's standing
offer, `tender.button.deal.reply_to_negotiation`
("Lähetä vastatarjous (:roundsLeft jäljellä)") which puts the rounds on the
action and **replaces change 6's own string entirely** — the blue
"Vastatarjouksia ei tämän jälkeen tehdä enempää" block goes with it — and
`app.negotiations.counter_offer_message` as the textarea placeholder.

**The accept button moved into the dealership's last message**, per the same
component, so it sits where that amount was offered instead of restating it in
the footer. Both arms now, since prod shipped it; the footer accept and its
`acceptIsInThread` fallback are gone. It is keyed on the thread's last message
being a **dealer** one, which is what caught a seeding bug: the proto's
`negotiation-stopped` thread ended with a seller message, which prod cannot
produce, because `CloseNegotiation` always appends a dealer message
(`close_negotiation.message_pre_filled` when the dealer sends none). Fixed in the
seed.

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

**THE MODAL SHELL ITSELF WAS NARROWER THAN PROD, AND A DEV SPOTTED IT**
(2026-09-16). Prod's `Reveal.vue` sizes its container `max-w-4xl` — 56rem,
**896px** — because `wideContainer` defaults false and `OfferActions` passes no
`containerClass`. Prod's `maxWidth` override is under `extend`, so `4xl` keeps
Tailwind's own value. The proto had `max-w-2xl`, **672px**: 224px narrow at
every width above 704px.

Three more shell divergences came out of the same comparison, all now matching
prod's `Reveal`:

| Part | Prod | Proto was |
|---|---|---|
| container | `max-w-4xl` (896) | `max-w-2xl` (672) |
| body padding | `p-4 lg:p-6 lg:pt-12` | `p-4 lg:p-6 pt-12` |
| close button | `-top-0.5 -right-0.5`, `h-12 w-12 sm:h-16 sm:w-16`, `text-2xl sm:text-4xl` | `top-0 right-0`, `h-12 w-12`, `text-2xl` |
| overlay | `overflow-y-auto overflow-x-hidden` | `overflow-y-auto` |

**The padding one was INVERTED, and it cost height on the surface change 18
fought over.** Unprefixed `pt-12` beat `p-4`'s top below `lg` and then LOST to
`lg:p-6` above it, so the proto rendered 48px of top padding on a phone and
24px on a desktop — exactly the opposite of prod's 16 / 48. Measured after the
fix: 16px top at 375px, 48px at 1024px, panel 896px at 1024 and 343px at 375,
close button 48px/24px text on a phone and 64px/32px from `sm`. `text-4xl` is
**32px** here, not the CDN's 36 — `tw-tokens.js` ports prod's `fontSize` from
`3xl` up.

**Change 8's measured figures on the spec page predate this** (`763px → 665px`
for the modal body at 375px) and did not reproduce in a spot check of the
before-sending state, which now reads 408 control / 410 v1. The shell fix takes
a flat 32px off every state below `lg`, but the base pair is older than several
copy passes. **Re-measure in a named state before quoting those numbers again**
— they were left untouched rather than silently adjusted.

**A measuring trap worth knowing: arms are sticky, and Informed decision forces
`EN_V1` on.** Loading `?enhanced-negotiations=control` while `informed-decision=v1`
is still remembered renders the v1 modal and reports the arm as `control`, so
control and v1 measure identically. Clear it — `&informed-decision=control` —
before measuring anything in this modal.

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

**The dealership's collapse is deliberately NOT taken — and prod agreed**: the
seller's modals pass `:collapse-when-stopped="false"`. `NegotiationMessage`
hides a stopped thread behind `negotiation.open_message_history`, which buys back
room on a screen where the negotiation is one panel among many. The seller's modal
is only the negotiation, so a closed thread stays open — they opened it to read
the messages. The dealership's other close signal, removing the reply button,
happens here anyway.

**Change 13 landed on its third shape, and that shape shipped** (2026-09-24
dump, prod's `auctionResult` bubble). A `text-base` line above the field (the
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

**`accept-button-lab.html` is where that was decided**, and on 2026-09-17 it was
**repurposed** — the 22-candidate palette sweep is gone (git history has it) and
the page is now the brief for the `success`-intent change, written for devs and
the dealership-side designer. It still measures every ratio from the rendered
pixels, which is the part worth keeping: each state is rendered as its own static
tile and the page reads its computed colour against its own computed background,
walking up to the first opaque ancestor so ghost and link measure too. It is
linked from nowhere and loads no `tw-tokens.js`.

**What it now establishes, and the numbers are the deliverable:**

- **There are THREE button components, two deprecated**, which is the thing that
  gets described wrongly. `elements/Button.vue` (16 consumers, a `color` prop
  taking `'blue' | 'red' | 'green-600' | 'transparent'`) AND `ui/UiButton.vue`
  (77 consumers) both carry the same JSDoc pointing at `atoms/AButton.vue`
  (8 consumers, 2026-09-24 dump). So the lime `success` definition is **duplicated byte-for-byte
  in UiButton and AButton**, and a colour change lands in both until one goes.
- **The seller's three accepts are three different colours today.** The
  decision page's card accept is `UiButton variant="primary" size="lg"` with
  **no intent at all**, so it renders blue-600/white. The accept confirmation
  step (`OfferActions.vue`) is the legacy `Button color="green-600"`, the
  **only** consumer of that colour anywhere. And since the 2026-09-24 dump the
  in-thread accept is `AButton intent="success"` — lime, and the one seller
  accept already on the shared intent.
- **The dealership's three accepts ARE the shared intent** — lime, via
  `UiButton variant="primary" intent="success"`:
  `DealerAcceptCounterOfferAction`, `DeliveryAgreedActions`,
  `PastDeliveryDateConfirmModal`.
- **`intent="success"` already means `text-green-600` in `UiIcon.vue` and
  `ASpriteIcon.vue`.** Same intent name, two hues, one design system — so
  greening the button makes it agree with the icon rather than introducing a
  new meaning. This is the strongest single argument and it is not a taste one.
- **Lime fails AA in 7 of its 14 states.** default active 2.98 · primary hover
  4.42 · secondary rest 4.28 / hover 3.82 / active 3.31 · ghost active 2.98 ·
  link active 3.09. The three that are **not transient** — primary hover and
  secondary rest/hover — are the defensible ones; an `active` state is held only
  while the pointer is down and how strictly WCAG applies there is arguable.
  **Say that rather than counting all seven as equal.**
- **A straight lime → green swap fixes primary and nothing else.** `green-700`
  on green-200/300/400 fails exactly as `lime-700` does. The proposal therefore
  deviates from the mirror in **three** places, each forced by a number:
  primary label **black** not green-900; secondary label **green-900** not
  green-700; default/ghost/link active **keep green-700** instead of lightening
  to green-600. With those, all 14 states pass.
- **THE PAGE CARRIES THREE SETS, NOT TWO, AND THE MIDDLE ONE UNDOES HALF THE
  ARGUMENT** (2026-09-17, asked for by the dealership-side designer). His
  question was the right one: the proposal changes the hue AND the label at
  once, so which is doing the work? Answer — **the label**. Apply the same three
  corrections to lime and it passes everywhere too, and **scores higher than
  green** at rest and hover (13.93 / 10.63 against 12.05 / 9.22), because
  `lime-400` is a lighter fill than `green-400`. **Contrast settles `lime-900`
  and white out of the running; it does not choose between lime and green.**
  Do not carry an accessibility argument into that conversation as though it
  does. What survives for green: the icon components already resolve `success`
  to `green-600`, and Jussi's own view that lime does not read as an accept.
- **green-950 is the tinted alternative to black** and survives the whole ladder
  (8.55 / 6.54 / 4.52) where green-900 dies at hover (5.23 / **4.00** / **2.76**).
  Worth offering if a fully neutral label reads as too hard.
- **The default (blue) intent fails three of its own states too** — default
  hover 4.13, default active 2.67, secondary active 3.41. So the honest ask is
  *success is the worst of them and it is the one we are opening anyway*, not
  *lime is uniquely broken*. A pass across every intent is separate work.
- **Lime does not leave the product.** `UiBadge`'s `lime`/`light_lime`,
  `UiTab`'s success, `OProductCard`, `OContainer`, `ReservePriceNotice` and
  `B2BReserveStatusBadge` are untouched — none reads a button's `intent`.
  Whether status lime should follow is flagged as a separate decision.

**Section 4 opens with a two-box impact strip, and that is the point of the
page for a reader in a hurry.** The change reads as a seller-side tidy-up and is
not: **seller side = component alignment, no visual change to the intent;
dealership side = colour change, no component change** (their three buttons
already use the shared intent, so only what it renders moves). Closing line:
*one button component and one success colour across seller and dealership,
instead of three components and three colours for the same act.* Jussi asked for
this explicitly — without it a dealership-side designer skims past a page that
looks like it is about the seller's funnel.

**One build trap it cost a round trip:** the variant tiles were measured inside
the loop that creates them, before the grid was appended — `getComputedStyle` on
a **detached** element returns empty strings, `parse()` returned null and the
whole IIFE died on `rgb[0]`. Measurement runs as a second pass over
`.readout[data-measure]` once everything is in the document.

**DECIDED AND ANNOUNCED, 2026-09-17.** Green-400 + black, and the rollout shape
is the substance of the decision — it was posted to the dealership product team
(Business Squad) in Slack, so treat it as committed rather than proposed.

**The plan: change `AButton` ONLY, and let each side arrive on its own ticket.**

| | |
|---|---|
| Consumer side | migrates its accept buttons onto **`AButton`**, off `elements/Button.vue` and `ui/UiButton.vue` |
| `AButton`'s `success` | lime → **green-400, label black**, all five variants |
| `ui/UiButton.vue` | **NOT touched** |
| Dealership side | unchanged today. Their three accepts stay lime until they migrate to `AButton` on a ticket of their own, at which point they turn green |

**Why this shape rather than editing both files.** Three reasons, and the second
is the one that makes it safe:

- **`AButton` has ONE `success` consumer** (the seller's in-thread accept,
  shipped in the 2026-09-24 dump), so the colour edit changes exactly that
  button, in the intended direction, and nothing on the dealership side. When
  this was decided it had zero; `accept-button-lab.html` now says one. Every
  other change arrives with its own migration, one at a time.
- **No user sees both sides.** A seller never opens the dealership UI, so the
  interim lime/green split is a design-system inconsistency, not a user-facing
  one. That is what makes waiting cost nothing — do not restate it as a UX
  problem.
- It gives Business an **easy path** rather than an obligation: nothing to do
  now, and the colour comes free with a migration they want anyway.

**The trap to put in the dealership's ticket when it comes.** Migrating those
three components is **NOT a no-op refactor** — the buttons change colour. Scoped
as "swap the component, should look identical", the change reads as a regression
and gets reverted. It is small otherwise: 3 files, ~6 button instances
(`DealerAcceptCounterOfferAction`, `DeliveryAgreedActions`,
`PastDeliveryDateConfirmModal`), and the icon props carry over unchanged —
`check-bold` and `flag-checkered-fill` are both in `resources/assets/icons/`,
which feeds the sprite both components read.

**What they also gain, and it is the argument for the migration itself:**
`UiButton` is missing three things `AButton` has — the `accent` (turquoise)
intent, the `nav-cta` variant, and `px-0` on `iconOnly`. `AButton`'s own source
names the last as a defect in `UiButton` ("leaving px-8 fighting w-14 at lg").
The deprecated file has already drifted, which is what a duplicated cva does.

**AN ERROR OF MINE REACHED A DRAFTED SLACK POST, AND IT IS THE REASON RULE 13's
FIRST CHECK EXISTS.** I reported that the dealership "already uses the shared
`intent="success"`" without saying in the same breath that `UiButton` is
deprecated too. Jussi reasonably read that as *they are already on the component
we want* and drafted an announcement on it — which would have told another team
their UI was changing when it was not. He caught it himself, asked the right
question ("if they are not using AButton, nothing changes for them, right?"),
and appended a correction note to the post. **When reporting where a component
sits, state its deprecation status in the same sentence.** A component's
location is not a fact on its own.

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

**`103_combi` CONCLUDED, and the result was SPLIT** (seen in the 2026-09-07
dump). The flag is gone from the enum and from every consumer:

| Arm | Outcome | What the code looks like now |
|---|---|---|
| insights block | **promoted** | `hideExpectedPrice` is replaced by a plain `showAskingPrice` prop, `default: false`. `C2BDecision.vue` passes nothing, so the consumer page shows **two cells and no dashed line**. `B2BDecision.vue` passes `:show-asking-price="true"` plus the `reserve_price` label |
| negotiation modal | **discarded** | The hide-gate came OFF `Negotiate.vue`/`QuickNegotiate.vue`, keeping the red warning, and the ceiling-skip came OUT of `StoreNegotiationFormRequest`, restoring the block |

So **change 2 is shipped and the removal half of change 1 is shipped.** What is
left is the part the test never touched — replacing the row with the shared
component. `Timer.vue` is unchanged, so nothing has been extracted yet.

**The proto's `control` arm was moved onto prod's new baseline** rather than kept
as a museum piece: two cells, no dashed line, no left-hand price box, and the
chart's `yMax` off the bids alone (it used to be `max(asking, highest)`, which
matched prod only while prod drew the line). `v1` is unchanged — AuctionStats
plus `border-b`. So the switcher now compares the two things still in question:
the old `dl` against the shared grid. One prod leftover NOT reproduced: the
hidden y axis still reads `askingPrice` in its `stepSize`.

**The removal created a problem it did not solve, and it is deliberately nobody's
change yet.** The asking price still decides what a seller may counter-offer —
the red `asking_price_error` line under the field, and the server-side ceiling —
while no longer appearing anywhere the consumer can read it. For an
auto-published listing the ceiling is the **GT-X estimate**, because the publish
routing writes `price_estimation` into `asking_price` when there is none, and the
field can be set from several sources besides. The team's call (2026-09-07):
**resolve it later, with its own A/B test, and Enhanced negotiations explicitly
takes no view on it.** Recorded on the asking-price spec under *Not in this
initiative yet* and as an excluded row on the negotiations spec, so it cannot be
folded into either. The proto already transcribes both the warning and all four
of the ceiling's conditions, so it needs no change.

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
`reserve_price` DB column. That gate is now the plain
`showAskingPrice` prop and **B2B is the only caller that turns it on**, which is
what the promotion did and is correct — a B2B reserve price binds the seller when
a bid meets it, so it is a live feature, not a field being sunset. Flagged on the spec page in its own amber notice so nobody tidies it
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
panel), so the viewport cannot answer the question. Four gotchas, one build each. A
container query **cannot match the element that declares the containment**, so
the markup is a `.av-stats` wrapper around a `.av-stats-grid`. The rule is
**injected once from the component module** rather than written as an SFC
`<style>`, because every Vite lib config here emits its own `dist/style.css`
into one `dist/` and they overwrite each other. The injected CSS is a JS
**template literal**, so a backtick in a code comment inside it terminates the
string — quote CSS identifiers plainly there. And **Tailwind's `divide-x`
out-specifies a naive override**: its selector is
`.divide-x > :not([hidden]) ~ :not([hidden])`, worth three classes, so
`.av-stats--3 > * + *` lost and the `border-left-width` calc survived — drawing
a vertical rule AND a horizontal one, and shifting every cell after the first
1px right. Matching its shape and adding the grid's own two classes wins without
`!important`. `row-gap` also goes to 0: 8px is right between side-by-side cells,
but stacked it detached each row from the frame and from its own divider.

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

**Two things left out on purpose.** The negotiation modal's asking-price
warning and its counter-offer ceiling: `103_combi`'s arm for those was
**discarded**, so both are settled prod behaviour rather than a pending arm, and
the team has parked the wider question (a ceiling nothing tells the consumer
about) for its own A/B test. And a **second negotiation-modal A/B** may still
arrive testing that ceiling; worth knowing before anyone reads the modal's
asking-price references as final.

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

**Review/No review** made funnel communication match whether the seller's car
is in the review segment. **PROMOTED 2026-09-16: changes 1–3 have shipped and
the proto now renders them unasked.** The arms, both page declarations and the
registry entry are deleted, `nextSteps.*` is out of `translations.js`, and
`contact.submitBtn` now holds the neutral copy with `submitBtnNeutral` gone.
Change 4 was closed as a no-change and its spec section removed; change 5 stays
open with the PM. Everything below is the record of what shipped and why.

Change 1 removed the "Mitä tapahtuu seuraavaksi?" component from the price step:
prod's `WhatHappensNext` never sees `can_review`, so at that step it promised the
review call to every seller, including the ones being asked for an asking price
*because* they are outside the segment. The component is **deleted**, not hidden.
On desktop the cream column keeps its size and its save-draft mount and is
otherwise empty — a deliberate divergence, since prod's `Sidebar.vue` keeps
`VehicleMetrics` there. Below 768px the column (`#price-sidebar`) is hidden
outright, matching prod's `shouldShowSidebarOnMobile`, which is driven by
`WhatHappensNext`: stacked under the form an empty column is just a 64px strip of
cream padding. That rule is hand-written CSS rather than `max-md:hidden` — the
Tailwind Play CDN only generates utilities present at first paint. The numbered
step badges went with the component: `STEP_BADGES` and `renumberSteps()` existed
only to renumber a list that no longer renders. See the Review Segment section
above for the `can_review` chain this is about.

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
inside it once a seller-intent answer can downgrade someone. The step now renders
`contact.submitBtn` ("Lähetä ilmoitus") for everyone — **one copy, no outcome
branching**, because three outcome-specific copies would leak the decision a step
before we state it. On promotion the neutral string took over the `submitBtn` key
and `submitBtnNeutral` was deleted. `contact.html` still sets the label from JS
rather than `data-i18n`, which is what keeps a language switch from overwriting
it.

**The "Valmis" the proto used to show on the offers-return path was INVENTED
copy, and it is gone** (2026-09-07, from a dev's question about when that label
appears). It appears nowhere in prod: `PersonalInfo.vue` passes
`:continue-label="t('tenderform.personal_info.submit')"` with no ternary,
`personal_info` holds exactly one submit key, and that is the ONLY
`continue-label` passed anywhere in the funnel — so no other step could swap it
either. `StepNavigation`'s own fallback, unreachable here, is
`tenderform.continue` = "Jatka". The only three `Valmis` strings in the dump are
`pickup_readiness_title` ("Valmis noudettavaksi") and `ready_to_sell`
("Valmis myytäväksi") ×2, all B2B status labels. The offers-return path is the
proto's own convenience with no prod equivalent, so it now renders the same label
as every other path and the arm applies to it.

**The near-miss that probably prompted the question:** the step DOES branch on
`hasUserCompleteProfile`, but only for its heading and intro —
`title_for_login_user` ("Yhteystiedot") and `fill_your_info_for_login_user`
("Tarkista yhteystietosi"). The button never branches, so a logged-in seller
reads "check your details" over a "send for review" button. Change 2 fixes that
by accident. And the DAC7 form on the offers side
(`legalities/PersonalInfo.vue`) submits with
`legalities.personal_info.form.buttons.confirm` = "Vahvista" — a different form,
easy to mistake for this one when grepping for a second submit label.

**Change 3 SHIPPED to the CMS on 2026-09-07, and the published copy differs from
what the spec proposed in all five answers.** It reached the **support page's
FAQ**, not the app: five items presented the review call as something every
seller gets. The proposal made each conditional with one word — `tarvittaessa`,
or `tapauskohtaisesti` where the sentence was about our own process. What
actually went live is weaker and better:

| # | Answer | What shipped instead |
|---|---|---|
| 3.1 | Miten myyntiprosessi etenee? | `mahdollisesti`, not `tarvittaessa` — and the step's own HEADING went conditional too (`Asiantuntijan mahdollinen yhteydenotto`). The `<ol>` also became numbered heading/body paragraph PAIRS with the numbers typed into the copy |
| 3.2 | Miten AutoVexiin saa yhteyden? | `tarvittaessa` as proposed, moved before `lomakkeelle`. The only one that shipped essentially as written |
| 3.3 | Miten tiedän autoni arvon? | `Saatat saada` (a possibility) rather than `Saat tarvittaessa` (an entitlement with a condition), plus an added capacity sentence |
| 3.4 | Miten saan autoliikkeet kiinnostumaan…? | asking-price sentence deleted as asked; consultation also gained `ja ilmoituksen laadusta`, plus a capacity sentence. One unrelated word rode along: `tehdä **hyvä** tarjous` |
| 3.5 | Miksi ilmoitukseni on tarkistuksessa? | **Rewritten, not qualified.** The `Siksi käymme…` sentence and the whole price-estimate paragraph are GONE, the call is `Mahdollisuuksien mukaan`, `otamme` → `pyrimme ottamaan`, and a closing sentence says outright that some listings reach the auction with no contact. Four paragraphs to three |

**The pattern in what the CMS chose: "this may happen", not "this happens when
needed".** `mahdollisesti` / `Saatat saada` / `Mahdollisuuksien mukaan` all
decline to promise; `tarvittaessa` still implies we judge and then act. And
three answers now say out loud that we cannot call everyone, which the proposal
had deliberately avoided saying. **The earlier decision that 3.5 keeps all four
paragraphs did not survive the rewrite**, and the shorter answer is the strongest
statement of this initiative anywhere in the copy.

**So `faq-content.js`'s `a` IS the revised copy now, and every `v1` is gone** —
FI and EN, ten overrides in total. `help.html` lost `REVIEW_NO_REVIEW_ARM`, its
`armAnswer` helper and its whole `protoPage` declaration: a switcher whose two
options render identically reads as "the change is in and it looks the same".
The `v1` mechanism stays documented in the file header for the next initiative.
Changes 1 and 2 kept their arms until they shipped too; all three are now promoted.

A sixth item ("why wasn't I called?") was considered and dropped: once nothing is
promised, there is no broken expectation to explain.

**A live CMS defect found while transcribing, unrelated to this change.** Two
support answers author their support-address links as `/mailto:tiimi@autovex.fi`
— a leading slash, which makes them relative page links rather than mail links,
so clicking the address goes nowhere. Flagged on the spec page as a one-character
fix. The proto keeps a working `mailto:`, which was already a documented
deviation.

**How the transcription was verified, and it is the method to reuse:** all 36
live answers were pulled from the rendered page, normalised to plain text and
compared by LENGTH against the proto's own 36. Five differed by more than a
whitespace character, which is exactly the five this change touched — proof that
nothing else in the CMS entry moved. A sixth answer differed by 6 characters
("Lomakkeen täyttäminen ei onnistu") and that is markup, not copy: the CMS types
its step numbers where the proto uses an `<ol>`, so the rendered reading is the
same.

**Enhanced success page** exists because the proto had been showing an invented
screen unconditionally, found 2026-09-07 when the team compared the proto against
a preview environment. **Skipping photos and submitting does NOT reach a success
page in prod.** `Publish.vue`'s `hasImageErrors` branch refuses to publish and
renders its own screen: a left-aligned `heading-2`
("Lisää vielä kuvat autostasi"), a `p-6 border border-red-500 rounded-xl` notice
whose first line is `font-semibold` and second `block mt-3`, and a full-width
primary button ("Lisää kuvat"). Every string is prod's
`images_step.missing_photos*`, with `:min` interpolated.

**The draft stays `open`**, so its card reads `Keskeneräinen` (paperclip, slate)
— `DRAFT_BADGES.open` already had it. The proto was showing
`Tarkastus käynnissä`, because `currentDraftStatus()` fell through to its
`in_review` default; it now returns `open` whenever photos are incomplete and no
scenario is forced. **That fix is arm-independent** — the enhanced design changes
what the page says, not what the draft is.

**And prod draws no illustration and no next-steps list here — but it DOES draw
the cream column and the car card in it.** Getting that wrong was the first
mistake in building this: the column was hidden outright, and the user caught it
against a preview environment. `Sidebar.vue`'s `shouldShowWhatHappensNext` lists
six states and `publishingDraft` is not one of them, so the STEPS go — while
`canPreviewDraft` DOES include it, so `shouldShowPreview` is true and the CARD
stays. **The right column is the card alone, not nothing.** Control hides
`#success-next-steps-title` and `#success-steps` and leaves the column standing.
`shouldShowSidebarOnMobile` is false too, so the column drops below 992px through
the page's existing `html[data-success-sidebar="empty"]` rule — prod compensates
there by rendering the card inside the left column
(`<Preview class="mt-8 lg:hidden">`); the proto keeps its single card in the
sidebar rather than mounting a second one.

**The lesson, and it is the second time this month:** two sibling predicates on
one component can disagree, and reading the one that answers "is there a list"
does not answer "is there a card". Check every gate on the surface, not the one
that explains the thing you noticed.

**Control is its own block, not a restyle of the shared headline.** The success
page's headline section is centred at `text-2xl`; prod's is left-aligned at
`heading-2`. `#success-photo-error` carries prod's markup and the shared
headline/illustration/email card are hidden, which is cheaper than fighting the
centred layout and keeps prod's structure legible.

**`v1` is the screen the proto had**: illustration above a headline that
acknowledges receipt, a subtext naming the five-photo minimum and which angles,
"Lisää puuttuvat kuvat", and the three-step list. Four strings are invented and
**stay marked as a draft** — `headlineMissingPhotos`, `subtextMissingPhotos`,
`addPhotosBtn`, `missingStep1Body`. The other two step bodies are real prod
strings from `WhatHappensNext`, just never shown on this screen in prod.

**TWO missing-photos screens exist in prod, and only one is in scope.** The other
— reviewed, then bounced back for photos asked for on the call — is
`waitingForReview` + `rejected` + `missing_images`, and the proto **already
transcribes it faithfully** as `?scenario=rejected-missing-images`:
"Huomio! Tarvitsemme sinulta lisätietoja.", the red `Tietoja tarvitaan` pill, and
a danger `Notification` reading "Lataa kuvat jatkaaksesi". Do not merge the two.
That screen also carries a genuine prod quirk, reproduced: `rejected` +
`missingImages` falls through every branch of `WhatHappensNext`'s computed to
`allNextSteps.slice(1)`, so it shows a 4-step list that still says the listing is
under review.

**It has its own Scenario option, `photos-missing`** ("Photos missing — publish
refused", listed first as the earliest ending the funnel has). Without it the
state was reachable only by walking the funnel and skipping photos, or by
emptying `store.photos` by hand — so it would have been the one ending nobody
demoed. It is NOT a draft-status branch like the rest of that menu, which is why
it gets a group of its own rather than joining `Rejected`: prod refused to
publish, so there is no listing yet. Mechanically it rides the existing
fall-through — `renderForcedScenario` returns false for an id it does not know,
so `updateContent` reaches the organic branch, and the only additions are
`photosOk` being forced false for that id and `SCENARIO_DRAFT_STATUS` mapping it
to `open`. One renderer, both routes, so they cannot drift. Scenario picks the
state and the Variants row picks the arm, which is the documented split.

**The initiative is named for the surface, not the fix**, so later work on the end
of the funnel joins it rather than starting a page — Enhanced negotiations' batch
pattern. Its arm is declared unconditionally on `success.html` even though it only
bites on the photos-missing path, because that path is store state rather than a
`?scenario=` option; the switcher simply does nothing on the other endings.

**An audit of every `success.*` string went with it.** Invented, and NOT part of
this initiative: `emailToastTitle` / `emailToastView` (a proto-only device that
nudges a tester towards the email tool, like the bar) and `backToHome` (an
`aria-label` on the logo). Everything else on the page is prod's.

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
   more. **Review/No review is the worked example** (2026-09-16): promoting it
   took out two arm readers, two `initiatives` declarations, the registry entry,
   the `data-rnr-arm` stamp and its CSS, the whole `nextSteps` namespace from
   `translations.js` — `price.html` was its only consumer — and one copy key that
   existed only to hold the arm's string. **One trap it exposed: the spec page's
   "Today" mock was rendering the removed copy through `data-i18n`, so deleting
   the namespace blanked it to em-dashes.** Copy a promotion deletes has to be
   INLINED into any spec-page mock that still shows it — the record outlives the
   product string.
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
falls INSIDE the band), so a high-mileage or old car is NOT review-called. As of
the 2026-09-07 dump that rule delegates to `TenderRequestReviewSettings::matches()`
— same band, moved so the engine below can share the gate.

**A review qualification ENGINE now exists, in ghost mode, and there is nothing
to do about it in the proto** (team's call, 2026-09-07). Recorded because the
machinery is easy to over-read:

- New in the 09-07 dump: `app/Services/ReviewQualification/`, `ReviewEngineMode`
  (`disabled` | `evaluate` | `enabled`), `ReviewEngineObservation` on the
  **analytics** connection, `WhitelistSegment`, `RecordEngineObservation`, and
  `config/review-qualification.php`. Decisions come from a **Lambda** and are
  `review` or `auto_publish`.
- **The pipeline SPLIT in two.** `EvaluateDraftForReview` — legacy rules only —
  still produces `can_review` for the funnel. The new `RouteDraftOnPublish` runs
  the same rules **plus the engine** and is what `PublishDraft` calls. So the
  funnel's answer is computed from the filters and the real routing happens at
  publish.
- **Ghost mode means the filters still decide.** In `evaluate` the engine records
  what it would have done and returns the legacy decision. The intended next step
  keeps the filters in priority and lets the engine add fidelity *within* what
  they already allow — it is not a replacement. **Note for whoever turns the dial:
  the code does not yet express that.** In `enabled` mode `DecideViaQualificationEngine`
  returns the engine's answer for the live slice without calling `$next`, so it
  would OVERRIDE the segment rather than refine it, and `live_percentage` only
  applies in that mode.
- **THE DIAL IS IN THE BACK OFFICE NOW, NOT IN THE ENV** (2026-09-16 dump).
  `engine_mode`, `live_percentage` and the four whitelist parameters moved out of
  `config/review-qualification.php` into `App\Settings\ReviewAlgorithmSettings`,
  and `DecideViaQualificationEngine` reads that object rather than `config()`.
  They are edited in Filament on **Tender Review Settings → Review Algorithm**
  (collapsed): a Mode select — *Disabled: legacy rules only* / *Evaluate: legacy
  decides, engine observed* / *Enabled: engine decides for the live slice* — a
  Live percentage 0–100 marked sticky per seller, and a Whitelist generation
  fieldset. **So the current mode is READABLE in the UI, and anyone with access to
  that page can move it.** `acceptance_resolved_at` was dropped from the
  observations table in the same dump.
- **One side effect that reaches another initiative:** on `auto_publish` the
  engine writes `price_estimation` into `asking_price` when the draft has none
  (left dirty and unsaved so a failed publish rolls it back). That field is the
  negotiation ceiling — see Asking price removal.
- Observations now carry **offer acceptance, accepted price and a resolution
  timestamp**, so the engine is measured on whether the car sold, not on whether
  the ad published.

**The proto models the OUTCOME, so none of this changes it** — same two paths,
same two price questions. What it does change is the strength of Review/No
review's Change 1: once the engine influences outcomes, the price step is
promising something not yet decided. Recorded as background on that spec page,
not as work.

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
steps nor card, so the column is empty. **prod's column is empty there too** —
see the metrics note below.

**`VehicleMetrics` is NOT on any of these screens, and I was wrong about it
twice** (2026-09-07). `Sidebar.vue` gates the block on `vehicleMetrics?.brand`,
which reads as "any state, as long as the draft has a make" — but
`vehicleMetrics` is a **prop**, and the parent computes it as:

```js
if (! makeId.value) return []
if (! (snapshot.matches('providingEquipmentInfo')
    || snapshot.matches('providingServiceInfo'))) return []
```

So outside the **equipment step** and the **service step** the prop is `[]`,
`?.brand` is undefined, and the block does not render. Not on `waitingForReview`
in any status, not on `publishingDraft`, not on `success`, not on the publish
queue. The prop is passed to `Publish` as well and is always empty there.

**The proto's placement was already exactly right**: `details.html` is prod's
`providingEquipmentInfo` (it asks the `equipment_info.accessories_*` questions
and its own progress label is "Varusteet") and `services.html` is
`providingServiceInfo`. Those are the two states, and those are the two pages.
A copy of the banner was briefly added to `success.html` and removed again; the
lesson is the same one the sidebar taught an hour earlier — **check the gate on a
component's INPUT, not just the gate on the component.** Reading `v-if` alone
gets this wrong.

What survived that mistake, because it is real: prod's `heading_total` is
"Erinomainen aika myydä**!**" and the proto had dropped the exclamation mark.
Fixed in both languages, which corrects the two funnel steps that do show it.
Prod also has a second variant the proto cannot reach — `sold_by_brand >= 150`
swaps in "Autosi on kuumaa kamaa!" with ":amount :brand-merkkistä autoa vuoden
sisään" — so the total heading the proto shows is prod's FALLBACK, not its only
form. And `details.html` / `services.html` render that copy in their own layout
(a 67×100 flipped graphic, a 24px Barlow title, no white card, no flame) rather
than prod's white-card-plus-flame shape: a pre-existing divergence on those two
steps, left alone.

Below **992px** the empty column is dropped entirely
(`html[data-success-sidebar="empty"]`), which is prod's own
`shouldShowSidebarOnMobile = shouldShowWhatHappensNext || providingPersonalInfo`.
**That was written as 768 and it was wrong** (corrected 2026-09-07): prod's
sidebar root is `lg:flex` with `:class="shouldShowSidebarOnMobile ? 'flex' :
'hidden'"`, so a false flag leaves it `hidden lg:flex` — hidden right up to
prod's `lg`, 992. The photos-missing state below shares the rule.

`DRAFT_BADGES` in
`vehicle-card.js` spells out `UiBadge`'s variants including `iconColor`, since
UiBadge colours the icon separately and its `light` variant is the one where icon
and text differ (slate-400 vs slate-500). Badge icons are `1em`, and the badge's
font-size step is prod's `text-xs xs:text-sm` with prod's custom `xs` = 460px,
hand-written in the card's shell CSS because the proto does not override
Tailwind's default screens.

**The card's attribute pills are translated, because prod stores enum keys**
(2026-09-21). `fuel_type`, `drive_type` and `transmission` are keys in prod and
print through `tender.fuel_types` / `.drive_types` / `.transmission_types`, so a
raw `fwd` or `gasoline` never reaches a Finnish card — the proto was rendering
the key. `ENUM_LABELS_FI` in `vehicle-card.js` transcribes those three maps and
passes anything it does not know through unchanged, since the funnel already
writes some of these values in Finnish.

**Cars sold: 80 000, everywhere** (2026-09-21). The front page said `50 000+`
and the funnel sidebar `70 000`; prod's own static string is
`Yli 80 000 myytyä autoa` and the live front page says 80 000+. Note prod's
sidebar copy interpolates the figure (`description_total` takes `:amount`), so
the proto's number is a stand-in and will drift again — check it against prod
when the front page is next reviewed.

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

## Informed decision — the fair-offer treatment

**Two blocks on the decision page, shown to a seller whose offer already clears
the team's fair-offer bar**, in `v1` only. Narrowed to that audience on
2026-09-11 as a tertial focus decision, not a design argument: both blocks make
claims that are only honest for a seller with a good offer.

| # | Block | Question it answers |
|---|---|---|
| 1 | `Tarjouskilpailun tiedot` | "is this a good offer" — prod's block, rebuilt |
| 2 | `Näitkö korkeamman hinnan muualla?` | "but I saw similar cars selling for thousands more" |

**The arm was three blocks wider and was cut back.** `Mitä voin tehdä?` (one
card per button), `Muistathan nämä` (three numbered reminders) and the loan and
handover items of `Muutama neuvo` are all gone — the team scoped the initiative
to the price belief alone. Their history is not worth carrying; what survived
of `Muutama neuvo` is block 2.

**Copy is placeholder and deliberately not polished.** The team locks the
Finnish once the shape is agreed, so there is no point spending on wording that
will be replaced.

### `v2` — the triage element (2026-09-23, first draft)

**`informed-decision=v2` keeps the auction-result block and replaces the
price-belief section with a triage:** the seller says what they are weighing up,
and only that branch answers. Same fair-offer gate as `v1`, same `EN_V1` forcing,
`section-triage` between the offers and the reject banner.

Four branches, and they are **the reject survey's own reason taxonomy asked
BEFORE the decision instead of after it** — hinta tuntuu matalalta · näin muualla
korkeampia hintoja · minulla on toinen tarjous · en tiedä kannattaako myydä nyt.
The Nettiauto argument is branch 2's answer rather than a section every seller
reads, so the doubt is named only by the seller who has it.

**The counter-offer moves in with it.** In `v2` the card's negotiate button is
suppressed unless a negotiation already exists — `Näytä vastaus` survives, because
opening a reply is not an invitation to negotiate. The reasoning is the team's:
almost half of auctions reach a negotiation, many out of opportunity rather than
need, and each one adds days in which the seller can change their mind. So
accept is the card's only action and negotiating becomes a considered choice.

**Nothing is expanded on load** — the labels are the whole exposure, which is the
answer to the priming worry that kept euro figures out of the block in the first
place.

**COPY PASS 2026-09-24, JUSSI'S OWN WORDING, AND TWO THINGS MOVED WITH IT.**

**`Minulla on toinen tarjous` now ends in a counter-offer, not in "take the
other one".** It used to close with `Jos toinen tarjous on näillä ehdoilla
parempi, kannattaa ottaa se.` — honest, and it left the seller nothing to do
here. It now reads `…suosittelemme neuvottelemaan korkeimman AutoVex-tarjouksen
tehneen liikkeen kanssa samoista ehdoista`, followed by the same
**Tee vastatarjous** button the `low` branch carries. **The honesty is not
traded away** — the comparison sentence above it still names the terms that can
make a rival offer genuinely better (tied to buying another car, who handles the
paperwork and the liability, when the money lands), and the branch now points at
the thing the seller can actually change rather than at the door. Keep both
halves: the branch stops being honest the moment the comparison goes.

**So TWO branches offer the counter-offer, and they share one definition.**
`NEG_BTN` and `NEG_RUNNING` are declared once in `buildTriage`; each branch picks
by `hasNeg`. Adding a third entry point means reusing those, never a second
button string.

**`Hinta tuntuu matalalta` now prints BOTH counts**, through `auctionCounts(req)`
— the same helper the result block reads, because the two sections state the
same figures about 400px apart and a seller reads them in one scroll. It was
reading `req.buyers` directly, which would have diverged the moment a scenario
pinned counts on the offers page.

**THE `low` BRANCH AND BLOCK 1 NOW SAY ALMOST THE SAME SENTENCE, AND THAT IS
ACCEPTED FOR NOW — NOT AN OVERSIGHT.** Both open with
`25 autoliikettä perehtyi autoosi ja kilpaili siitä tekemällä yhteensä 138
tarjousta`; the triage adds `onnistuneen` and drops nothing. **Jussi's call
(2026-09-24): the duplication stands only while both sections are being
ideated.** The open question is whether `Tarjouskilpailun tulos` should say
something DIFFERENT once the triage answers the same doubt below it — they must
not ship as duplicates. Resolve that before either goes to the team; do not
quietly de-duplicate in passing, because which of the two keeps the sentence is
the actual decision.

**The branch answers must stay honest in both directions.** That was the reason
`other-offer` used to end in "take it", and the replacement above is the first
time this rule has been traded against giving the seller an action. It held
because the comparison stayed; watch it in testing.

`hasNeg` tests `negStatus(...) !== null`, not truthiness — `negStatus` returns
**0** for a counter-offer awaiting a reply, so `!!` would re-invite a negotiation
that is already running.

**No spec page yet, deliberately** (the team's call while the shape is settling),
and all copy is placeholder like the rest of this initiative. The reject survey is
untouched and must stay that way: its reason mix is how we read whether asking
earlier changed anything.

### ONE gate, read once, and both blocks share it

`idShow` in `renderMain`:

- the arm is on;
- `pas` is in `DECISION_OPEN` — the four price tiers, a final offer or a closed
  negotiation;
- **and `req.fair_offer === true`.**

`buildInsights` takes it as an argument rather than deriving its own condition,
so the two blocks cannot drift apart, and **widening the audience later is a
one-line change here** rather than an edit per section. That widening is a
stated next step, which is why the predicate is named rather than inlined.

**THE THRESHOLD IS NOT IN THIS REPOSITORY AND MUST NOT BE.** The definition of a
fair offer is a separate discussion and `Claude-Figma` is public, so nothing
here computes one: `BASE` carries `fair_offer: true`, `?fair=0` flips it, and
the bar's **Auction settings** has a `Fair offer` field so the other case is one
click away. Production already identifies a fair offer on the front end, so the
real page reads a flag too — this is the data contract, not a proto shortcut.

**AND THE RULE COVERS PROSE, NOT ONLY CODE — IT NEARLY SHIPPED ONCE.** On
2026-09-18 the corrected fair-offer definition was recorded in THIS FILE with
the ratio spelled out, two screens above the paragraph that says the ratio
stays out. `CLAUDE.md` is tracked, so that would have published it. Caught on
2026-09-21 in a pre-push check, while the commit carrying it was still
unpushed; it was rewritten out of the commit rather than fixed in a later one,
because history is public too.

**So: before any push, grep the staged tree for the ratio, not just the diff.**
The leak arrived as an explanatory sentence in a note ABOUT the rule, which is
exactly where it is least likely to be looked for.

**Say REFERENCE PRICE, not "our estimate"** (2026-09-16, Jussi's term). A fair
offer is defined as a share of the reference price, and the DB field behind it is
named for an estimate — but the value it holds may be a **GT-X estimate, a sales
advisor's estimate given during the review call, or any later corrected value**.
Calling it "the estimate" implies one machine number and gets the denominator
wrong; the seller's OWN estimate is a different field again. **The ratio itself
lives outside this repo** — see the private notes, not this file.

**Outside the gate the seller gets PRODUCTION'S BLOCK, untouched** — the
three-column `dl`, the chart and the date row. Never a stripped-down version. A
thin auction (`VERDICT_MIN_BIDDERS`) lands in the same place, so the two
exclusions share one fallback.

### Block 2 — `Nettiauton hinta ja saamasi tarjous`

**REPLACED 2026-09-18, AND THE REPLACEMENT CAME OUT OF THE IDEATION SET RATHER
THAN FROM ANOTHER PASS AT THE ORIGINAL.** Jussi iterated in Figma across three
versions; this merges the old equation's three-term geometry with 2c's
sequencing. Everything below the next few paragraphs is the history of
`Näin vertaat tarjoustasi` — the safety mechanism, the palettes and the type
scale all still govern, the strings do not.

**What it is now:**

```
Nettiauton hinta ja saamasi tarjous
Autoliikkeen pyyntihinta ei kerro, mitä auton edelliselle omistajalle on maksettu
tai välttämättä mihin hintaan auto myydään.
┌──────────────────┐   ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐   ┌──────────────────┐
│ 🪙 11 500 €      │ → ╎ Jälleenmyynti    ╎ → │ Ilmoituksen      │
│ Sinulle maksett… │   ╎ Kulut, vastuu,   ╎   │ pyyntihinta      │   (no sub-label)
└──────────────────┘   └╌ riski ja kate ╌╌┘   └──────────────────┘
*Jälleenmyyntiin liittyy autosta riippuen valmistelua, kuluja ja myyjän vastuuta.
```

**`vastuu` IS THE LOAD-BEARING WORD, AND IT IS AN ASSUMPTION THE BLOCK INVITES
RATHER THAN A CLAIM IT MAKES** (2026-09-18, Jussi's addition). It means the
dealership's responsibility for the car **after** it sells it on. The reasoning
the reader is left to complete: a dealership carrying that liability has reason
to put the car right first, so whatever a repair or a set of tyres cost is
already inside the advertised price. **The block never states this as fact and
must not start to** — "the dealership must repair it" is a claim about law and
practice we are not making.

**THAT IS WHY THE FOOTNOTE NO LONGER LISTS COSTS.** A list states as fact what
is really an assumption about one particular car, and it was always the weakest
half of the block: the old six-item version existed to outrun what a reader
could name themselves, and the four-item version had already lost that. The
footnote now says what reselling **involves** rather than what it **costs**,
hedged with `autosta riippuen`. **Do not turn it back into a list** — the
assumption is now carried honestly by `vastuu`, where a list carried it as fact.

**THE THIRD TERM SAYS `Ilmoituksen pyyntihinta` AGAIN**, which is Jussi's call.
So the `ilmoitus` collision below survives in that one label; the lead line,
where the correction actually lands, keeps `Autoliikkeen`. At 186px it wraps to
two lines in a 177px chip — which is what the Figma version does too, so it is
faithful rather than a defect.

**THE LEAD LINE IS THE WHOLE CORRECTION, and it is the strongest sentence this
initiative has produced.** It stops arguing about the SIZE of the gap and says
the advertised number is **silent about the seller's side**. The reader
completes the parallel themselves: that car had a previous owner who was paid
something invisible, and they are that person now. Nothing in it defends
anyone, which is what makes it survive the reader who already "knows how they
trick us" — there is no claim about fairness to bounce off, only a statement
about what a number omits.

**IT SAYS `Autoliikkeen`, NOT `Myynti-ilmoituksen`, AND THIS IS A GENERAL RULE
FOR THIS PRODUCT.** `ilmoitus` is the **seller's own word** everywhere else —
the funnel submits with `Lähetä ilmoitus`, the success screen says
`Ilmoituksesi tarkistetaan`, the preview sheet labels their figure
`Pyyntihintasi`. A seller who published an ad twenty minutes ago reads
"myynti-ilmoituksen pyyntihinta" as **theirs**. It is the same collision that
killed `Auto-ilmoituksien pyyntihinnat…` an iteration earlier, where the fix
was `Muualla`; `Myynti-` does not close it, because their listing is a sales
listing too. **Never use `ilmoitus` for the dealership's listing.** The third
term moved to `Liikkeen pyyntihinta` for the same reason, so the collision is
gone from both places.

**ARROWS, NOT `+` AND `=`, AND THE MIDDLE TERM NAMES A PHASE.** An equation asks
to be solved; a sequence does not. `Jälleenmyynti` is a phase word where `Kulut`
was a quantity word — **you cannot subtract a phase**, which makes it a second
line of defence behind the dashed box rather than a rename.

**The third term lost its sub-label** (`Ilmoituksessa näkyvä hinta`). With
`Liikkeen pyyntihinta` naming the party, the gloss restated it.

**THE LEAD GAINED A SECOND CLAUSE ON 2026-09-24** — `…tai välttämättä mihin
hintaan auto myydään.` Jussi's wording, and it closes the one hole the sentence
had: a seller could accept that the previous owner's figure is invisible and
still read the advertised price as what the car IS worth. It now says the
advertised number is not a sale price either. **It does this without naming a
discount or a rate**, which is what keeps the block out of the arithmetic it has
always refused to invite.

**THE FOOTNOTE SITS 28px BELOW THE ROW, AND THE RULE IS DOUBLED FOR A REASON
WORTH KNOWING.** It read as the row's next line at 16px. `.belief-note` is
hand-written (`mt-7` appears nowhere else on the page, so the Play CDN would
generate it a tick after this JS-built block renders) — and it is **doubled**,
`.belief-note.belief-note`, because in `v2` this block renders inside a triage
panel where `.triage-panel p` is a class PLUS an element and out-specifies a
single class, zeroing the margin. Measured 28px in both arms after the fix; it
was 0 in `v2` and 16 in `v1` before it. **A single class silently works in one
arm and not the other** — that is the trap, not the specificity itself.

**`vastuu` and `riski` are the two words doing the work.** Refurbishment a
sceptical seller calls markup; the risk that the car does not sell, and the
liability the dealership carries for it afterwards, are real asymmetries they
are being relieved of. They cannot be dismissed as padding, and — unlike a list
of costs — they are assumptions carried as assumptions. **Protect both if the
sub-label is ever shortened.**

**Measured (2026-09-24, after the lead's second clause and the 28px footnote
gap):** `v1`'s `section-belief` **264px desktop / 536px at 375px**, against
228 / 500 before — the lead takes a second line on desktop and a fourth on a
phone, and the footnote gap adds 12px. Below 620px the row stacks and
`.belief-op` rotates 90°.
Contrast unchanged: 8.70 for the figure and its sub, 14.63 for the two dark
terms and the arrows, 7.58 for the footnote, **4.76 for the slate-500 sub** —
the floor, passing only because the chip behind it is white.

**2b IS GONE (2026-09-18), 2c REMAINS.** Its self-contradiction was the defect
this replacement fixed, so it had nothing left to offer. Removed: the section
shell, the render gate, `buildListingPrice`, the three `.lp-*` rules and its
spec-page block. **The spec page still numbers the survivor `2c`** — the
numbering is not shifted, for the same reason change 4's was not: the team has
the page and a reference has to keep resolving.

**A REAL BUG CAME OUT OF THIS, AND THE LESSON IS ABOUT VERIFICATION, NOT THE
CODE.** Replacing `buildBelief` was done as index-based surgery — cut from
`function buildBelief` to the next comment banner — and `buildListingPrice` sat
*inside* that range. It went with it. `renderMain` then threw
`buildListingPrice is not defined` at 2b's gate, and **because the throw aborted
the rest of the function, every section after it stopped rendering — including
`Tarjouskilpailun tiedot`.** Jussi saw a section disappear that nobody had asked
to remove.

The verification pass after the replacement measured `#section-belief` and
declared it good. It was good. **Measuring the thing you changed does not tell
you what you broke** — after any edit to `renderMain` or the functions it calls,
list EVERY section with its hidden state and read the console, because one throw
silently truncates the page from that point down. Two cheap habits that would
have caught it: `document.querySelectorAll('section[id^="section-"]')` with
`.classList.contains('hidden')`, and an errors-only console read.

**Index-based cuts over a range you have not just listed are the hazard.** Prefer
an explicit start-and-end string pair whose contents you have read, and grep for
the removed symbol afterwards.

---

**History below: `Näin vertaat tarjoustasi`, the block this replaced.**


`buildBelief(amount)`. THREE TERMS, read left to right as an addition the reader
completes themselves:

```
Näin vertaat tarjoustasi
Muualla näkemäsi pyyntihinnat sisältävät myös auton myyntiin liittyviä kuluja.
┌──────────────────┐   ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐   ┌──────────────────┐
│ 🪙 11 500 €      │ + ╎ Kulut            ╎ = │ Liikkeen pyynti… │
│ Sinulle maksett… │   ╎ Vaihtelee autoit ╎   │ Ilmoituksessa n… │   (no full stops)
└──────────────────┘   └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘   └──────────────────┘
*Kuluja ovat autosta riippuen esim. kunnostus, katsastus, säilytys,
markkinointi, arvonalenema ja kate.
```

**It came from Jussi's own Figma draft** (2026-09-14). He built the equation —
three terms, operators between, sub-label under each — directly in
`C2B Seller – Ad creation`, and this is that shape with two changes made when it
was turned into another version above his: the first term carries the seller's
real figure, and the costs term is marked unknown.

**ONLY THE FIRST TERM IS FILLED, BECAUSE IT IS THE ONLY ONE WE HOLD.** The offer
is ours to state — the real amount, the coins icon, and a filled chip. The
resale price and the costs are not ours, so they are outlines.

**THAT CHIP WEARS THE VERDICT TAG'S EXACT GREEN** (2026-09-14): `green-50` fill,
`green-500` border, `green-700` icon — the same three values as
the recommendation tag, verified against its computed styles rather than by
eye. It was blue-50/blue-600/blue-400, on the reasoning that green is the
accepting direction and this block is not the recommendation. **Jussi's call
reverses that, and it holds:** the green term IS the money the seller gets by
accepting, so here green points at the same act the verdict recommends instead
of competing with it.

**EACH CHIP NOW BORROWS A WHOLE EXISTING COMPONENT'S PALETTE, TEXT INCLUDED**
(2026-09-15, Jussi's call, and the reason given was that it simplifies the
build):

| Chip | Borrowed from | Label | Sub-label | Icon |
|---|---|---|---|---|
| the seller's offer | the `Suosittelemme hyväksymään` tag | green-900 | green-900 | green-700 |
| `Kulut` · `Pyyntihinta` | `AuctionStats` | slate-800 | **slate-500** | — |

So the green chip is now **colour-identical to the verdict block** — green-50
fill, green-500 border, green-700 icon, green-900 text at both sizes, exactly
what that block already uses — and the two outline chips are AuctionStats' own
value/label pair, whose figures were already slate-800 bold and whose labels are
slate-500.

**This replaces the earlier rule that the label text stays slate-800 so the
three terms read as one set.** That kept the container and its contents on
different systems, which is the thing a dev has to special-case: there are now
two palettes on this page and each chip takes one whole. The set still reads
together because the geometry is identical across the three.

**The footnote stays slate-600**, not slate-500 — it is the block's own small
print rather than a label inside a borrowed component, and slate-500 is close to
its AA floor (see the table below).

**THE COSTS TERM IS DASHED, AND THAT IS THE WHOLE SAFETY MECHANISM.** Every
earlier version of this block had to stop the seller running the arithmetic
backwards, and each did it by hiding a boundary — a gradient with no locatable
edge, then no fill at all. An equation cannot hide its terms, so it says the
quiet part instead: the box is dashed and its sub-label reads
`Vaihtelee autoittain`. **A dashed box reads as a blank to be filled, not as a
quantity**, so there is nothing to subtract from and no proportion is claimed.
**Filling that chip, or giving it a figure, breaks the block.**

The sub-label was `Vaihtelee autoittain – emme tiedä tarkkaa summaa.` and was cut
to two words. The dash clause was the picture apologising in prose — the dashed
box already says it, and a term in an equation should read as a term.

**THE LEAD LINE NAMES WHERE THE SELLER SAW THOSE PRICES, AND THAT IS ITS WHOLE
JOB** (2026-09-16). It used to open `Auto-ilmoituksien pyyntihinnat…`, which on
this page is genuinely ambiguous — the seller has an `ilmoitus` of their own,
made twenty minutes ago, and nothing in that phrase says otherwise. **`Muualla`
is the fix, in one word.** It cannot be read as their own ad.

It also lost its second sentence (`Huomioi tämä, kun arvioit…`), which was the
instruction — and the section header `Näin vertaat tarjoustasi` already gives
that instruction, so the lead only has to point at the prices. **180 → 78
characters**, four lines to one on desktop and five to three on a phone.

The costs stay **unattributed** (`auton myyntiin liittyviä`, not
`liikkeen kulut`). Naming the party would be clearer and the footnote already
says `kate`, but it invites the resentment this block exists to avoid.

**THE FOOTNOTE IS A LIST BECAUSE LENGTH IS THE POINT — and it was cut anyway**
(2026-09-16, Jussi's call, on length). It named three FACTORS, then NINE costs,
and now **six**: `kunnostus, katsastus, säilytys, markkinointi, arvonalenema ja
kate`. Gone are `takuu`, `kuljetus` and `rahoitus`; the closing sentence about
the car and the market folded into `autosta riippuen` at the front.

The reaction to aim for is still **"I had not thought of half of those"**, and
that only lands if the list outruns what the reader could have listed
themselves — **so the floor is real, and six is close to it.** Do not cut
further without replacing the mechanism. What was traded for is legibility: 168
→ 103 characters, five lines to three at 12px on a phone.

`esim.` still does the hedging: examples of what a dealership adds, not an
exhaustive or audited list. **No figure against any of them, `kate` least of
all** — a euro amount there hands the seller something to resent rather than
something to understand.

**The first term is the STANDING offer**, via `standingAmount(offer)` — the same
single definition the offer card and the accept handler read, so a negotiation
moves all three together. With no amount it falls back to the word
`Tarjouksesi`.

**THESE TWO BLOCKS ARE ON THE SITE'S BODY SCALE, NOT THE DECISION PAGE'S OLD
14px** (2026-09-14). Prod styles the `p` ELEMENT `text-base leading-snug
sm:text-lg`, so bare body copy anywhere in the product is 16px, and the proto's
funnel steps — whose paragraphs carry no size class — render at 16px too. The
decision page only looked like an exception because these blocks set `text-sm`
explicitly: prod's own `C2BDecision.vue` contains exactly TWO `text-sm` uses and
both are a deliberate override on the support banner, not a page convention.

| Role | Class | Size |
|---|---|---|
| body copy — the verdict's lead line, the headline's paragraph, the lead line above the equation, chip labels, operators | `text-base` | 16 / 24 |
| fine print — the verdict's recommendation sentence, chip sub-labels, the footnote | `text-xs` | 12 / 16 |
| block 1's headline | `font-display text-xl font-bold leading-snug` | 20 / 27.5 Barlow |
| **`AuctionStats`, untouched** | `text-xs xs:text-sm` | its own, transcribed from prod |

Verified against `price.html`, where the funnel's own body copy measures 16px
and its hint lines 14px.

**THE MIDDLE TIER WENT AWAY, AND THAT IS JUSSI'S CALL** (2026-09-14). The sweep
had put every small string on `text-sm`; he named five that belong at 12px
instead, so the blocks now run 16 or 12 with nothing between them:

- `Sinulle maksettava summa` · `Vaihtelee autoittain` ·
  `Ilmoituksessa näkyvä hinta` — the three chip sub-labels
- `*Kuluja ovat autosta riippuen esim. …` — the footnote
- `Pidämme korkeinta tarjousta…` — the verdict's recommendation sentence, **now
  deleted with the block it sat in** (2026-09-16); the 12px tier is what the
  replacement `Suosittelemme hyväksymään` tag inherited

**The shape this leaves:** a 16px term with a 12px gloss, repeated in every
chip — and in block 1 a 12px tag over a 20px headline, so the label is the
quietest thing in the row and the payoff is the loudest.

**The headline went UP a notch at the same time** — `text-lg` → `text-xl`, so
20px Barlow bold between the 12px tag above it and the 16px paragraph below. It
is the payoff line and reads as the block's own title rather than as a bolder
sentence. At 375px it wrapped to three lines while it was the long
`Nyt tiedät…` string; the shorter `Autosi arvo on nyt tiedossa!` takes **two**.

**Heights, after every pass so far.** Auction details 353 → 397 → 368 → 288 →
**254** desktop and 470 → 558 → 543 → 380 → **379** on a phone; price belief
252 → 272 → 260 → **220** and 532 → 644 → 596 → **508**. **Both blocks now sit
well below where they started** while carrying 16px body copy — auction details
is **99px shorter on desktop and 91px shorter on a phone** than the original —
368 → 288 from dropping the painted block and the third sentence, then 288 →
**254** when the tag moved onto the headline's line and stopped costing a row of
its own. Phone: 543 → 380 → **379**, since stacked it still takes that row.

**Contrast, measured against the rendered pixels:**

| Label | On | Size | Ratio |
|---|---|---|---|
| `Suosittelemme hyväksymään` — green-900 | green-50 | 12px/700 | **8.70:1** |
| `11 500 €` — green-900 | green-50 | 16px/700 | **8.70:1** |
| `Sinulle maksettava summa` — green-900 | green-50 | 12px/400 | **8.70:1** |
| `Kulut` / `Liikkeen pyyntihinta` — slate-800 | white | 16px/700 | **14.63:1** |
| chip sub-labels — slate-500 | white | 12px/400 | **4.76:1** |
| the footnote — slate-600 | white | 12px/400 | **7.58:1** |

All against 4.5:1, all AA. **The slate-500 sub-labels clear it by 0.26**, which
is the whole margin — they pass because the chip behind them is WHITE. Every
recorded slate-500 failure on this page was against a tint (3.86:1 on slate-200,
4.35:1 on blue-50, 4.32:1 on gray-100), so **putting any fill behind those two
chips breaks their contrast**, not just their meaning.

**The operators sit on the row's centre line.** `.belief-op { align-self:
center }` in hand-written CSS, not a `self-center` utility: the row is
`items-stretch` so the three terms match the tallest, and without this the `+`
and `=` stretch with them and settle at the top of a chip's height. Hand-written
for the usual reason — the Play CDN generates utilities a tick after the render,
which would drop the operators on first paint.

**THE THIRD TERM IS `Liikkeen pyyntihinta`, AND IT WRAPS IN ONE NARROW BAND**
(2026-09-16). It was `Pyyntihinta`; naming the dealership says WHOSE asking
price and reinforces the lead line's `Muualla`. Note this runs the opposite way
to the lead line, which deliberately leaves the COSTS unattributed — naming the
party is clarifying on the price and resentment-inviting on the costs.

It is 160px at 16px/700, against ~182px of chip at full width, so measured:
**one line at 730px and above, two lines between 620 and ~715px** (the section
goes 220 → 244 → 300 as the column narrows), and one line again below 620 where
the equation stacks to full-width rows. The wrap is not a break — `items-stretch`
grows all three chips together and nothing overflows — but a longer label than
this would wrap on a laptop, so **that is the length ceiling for a chip label.**

**Below prod's `sm` it stacks** — three ~200px terms cannot sit in a 287px
column — and the operators become row separators. `.belief-eq.belief-eq` is
doubled for the same reason every other rule in this block is: `.belief-eq` and
Tailwind's `items-stretch` / `gap-3` are one class each, so source order decides,
and the Play CDN appends its utilities after the page's own `<style>`.

**NO ALTERNATIVE ROUTE IS NAMED** — not a private sale, not a trade-in, not
another dealership. The block answers why the advertised number was bigger and
stops.

**What the earlier versions were, in one line**, since the reasoning still
applies: a bordered list of rows (read as a FAQ), a two-bar equation, one
stacked bar with a legend, the bar self-labelling, the previous-owner framing,
the seller's own offer in a sized segment, a gradient with no locatable edge,
and no fill at all. **The rule that survived all of them: if a revision needs a
paragraph to make the picture land, the picture is wrong.**

### The ideation set that produced block 2 — both arms removed (2026-09-18)

Two extra treatments ran beside the original block for one day so the team could
compare approaches rather than read one. **Both are gone from the proto**; the
block above absorbed what worked. Kept here because the reasoning outlived them.

| Arm | What it tried | Outcome |
|---|---|---|
| **2b** `Nettiauto-hinta on eri asia` | two side-by-side cards, a listing price with its inclusions tagged against the seller's figure | **Removed.** It asserted what a Nettiauto price IS and then qualified itself in its own footnote two lines later |
| **2c** `Nettiauto-hinta on tämän ketjun päässä` | a five-stage chain, no body copy at all | **Removed.** Its sequencing survived as the arrows in block 2 |

**What the set proved, and it is the part worth keeping:**

- **A sequence beats an explanation for this reader.** Sellers tell us in testing
  they already know how this works — "of course I know how they trick us" — and
  that reader dismisses an explanation. Arrows made it into block 2 for this
  reason; `+` and `=` did not survive.
- **Never state a claim in a block and negate it in that block's own small
  print.** 2b's defect, and the reason block 2's lead says what a price does NOT
  tell you rather than what it IS.
- **Name actions, not costs, when the reader is suspicious.** 2c's middle steps
  said `Kunnostaa ja katsastaa` (what a dealership DOES) rather than
  `kunnostuskulut` (what it CHARGES). An argument reads as us defending the
  buyer. Block 2's `Jälleenmyynti` is the same instinct in one word.
- **Attribution plus margin together reads as a grievance.** 2b attributed the
  costs to the dealership and kept `kate` out for that reason. Block 2 does the
  reverse — it carries `kate` in the sub-label but attributes the phase, not the
  party — and that trade is live, not settled.
- **Five stages was too many for one row.** Nine items including arrows left the
  terminal node on exactly its label's width; three terms breathe.

**One bug, and the lesson is about verification.** Replacing `buildBelief` was
done as an index-based cut whose range also contained `buildListingPrice`, so
that function went with it. `renderMain` threw at 2b's gate, and **a throw
aborts the rest of the function**, so every section below it stopped rendering —
including `Tarjouskilpailun tiedot`. The verification pass had measured the
block that changed, found it correct, and reported it. **Measuring what you
changed does not tell you what you broke:** after any edit to `renderMain` or
what it calls, list EVERY section with its hidden state and read the console in
a FRESH tab — this pane retains console messages across reloads, which nearly
produced a second false report.

### The value of the auction belongs in block 1, not block 2

Asked for on 2026-09-14 and placed deliberately. The seller's dilemma is real —
a local dealership offers 10 000, the auction returns 11 500, they have seen
listings at 13 500, and they cannot see what AutoVex was worth. But **block 1
already makes the competition argument**, so the payoff is its missing last line
rather than a new section. Putting it in block 2 would have been a third
statement of the same argument on one page, which is what killed
`Muistathan nämä`.

The line is **`Nyt tiedät, mitä autostasi ollaan valmiita maksamaan.`** — the
auction's value stated as KNOWLEDGE, which is what the sellers who carry the
result to a local dealership have already worked out for themselves.

**Deliberately NOT a comparison against what one dealership would have offered.**
Two reasons, and the second is the stronger:

- **We hold no such figure.** There is no counterfactual on the page. The
  closest proxy is the spread between the lowest and highest bid, which both
  reveals that somebody valued the car well below the top bid and overstates our
  own value, since the lowest bidder is the least interested dealership rather
  than a typical one.
- **"We beat a single dealer by X" invites the seller to go and check.** That
  costs decision time, which is one of the tertial's own key results — and the
  paper-to-dealership behaviour proves sellers already have the instinct.

**The paper-carrying behaviour stays off the page** for the same reason. It is
good evidence the auction creates value and naming it tells sellers to do it.

**Delete, if the idea is dropped** — the registry entry, the page's declaration,
the arm reader, `buildBelief`, `buildAuctionVerdict` + `VERDICT_MIN_BIDDERS`,
the two `section-*` blocks, `fair_offer` from `BASE` and the `fair` field, the
`idShow` gate (put `buildInsights` back to `APR_V1` alone for both the grid and
the chart's top rule), `if (ID_V1) { EN_V1 = true; }`, and the spec page.

### It SUBSUMES Enhanced negotiations, one-way

`if (ID_V1) { EN_V1 = true; }` in `decision.html`, immediately under the
`ID_V1` declaration, and that is the whole mechanism. Two reasons:

- **A demo of this arm beside the OLD cards, status lines and modal would be a
  review of a page that will never exist.** This is where the whole decision
  page is being reconsidered, so it has to show the whole thing.
- **The colour system is only legible when both halves are on.** Enhanced
  negotiations establishes green accepts / blue negotiates / red rejects on the
  buttons and in the modal; Informed decision now carries the same three through
  the new sections. Neither reads as a system alone.

**`enhanced-negotiations=v1` is UNTOUCHED and stays reviewable by itself** — it
is real work in development. The dependency runs one way only; nothing about
this reaches that initiative, its spec or its scope. Verified: the arm alone
still renders the green accept button, the rebuilt modal and prod's own insights
block, with none of the ideation sections.

The reassignment deliberately sits at the `ID_V1` site rather than being folded
into `EN_V1`'s own declaration, so the coupling lives in the one place it is
decided. **Delete those two lines and Enhanced negotiations is unaffected.**

**THE SPEC PAGE DESCRIBES WHERE THE IDEA IS, NOT HOW IT GOT THERE** (2026-09-14,
finalised for the team). No iteration history, no rejected versions, no colour
archaeology — that all lives here in CLAUDE.md instead. Section 2 is three
paragraphs; the `Three things, each doing one job` list is gone.

**It carries THREE changes, not two.** The warm-up removal had been built in the
proto and described only here, so the spec page had nothing to review — a dev
reading it would have shipped two blocks and left the screen standing. It is now
`3 — The warm-up screen goes`, with a replica of the screen being removed and a
`Try it` link on `?scenario=new-offers`, the only state that reaches it.

**Its two `What the block shows` cards are the PROTOTYPE'S OWN MARKUP,
transplanted** — section `<h2>`, its icon, the white card, everything — on a
`#EEF6FA` stage (the decision page's own background) at `max-w-3xl` with `p-6`,
which puts the card at **720px, the exact width it renders at on the decision
page**. Verified by probing both pages and diffing computed styles rather than by
eye: width, height, padding, radius, font size, weight, line-height and colour
all match, at 375px too.

Two things that transplant needs, and they are the only divergences:

- **`screens: { xs: '460px' }` added to the spec page's Tailwind config.** The
  replicas use `xs:` variants and this page has no prod screens. Only `xs` is
  added — porting the whole scale would move the page's own `sm`/`md`/`lg`.
- **The block-1 headline carries `style="color:#000"`.** Its `h3` has no colour
  class and inherits, which is black on the decision page and slate-900 here.

**Re-transplant after any change to either block**, the same way the copy is
kept in step. An EN gloss sits below each card, outside the stage, so the
replica stays pixel-exact.

**Check the NESTING when you re-transplant, not just the classes.** Block 1
carried a stray `</div>` that closed the white card early (fixed 2026-09-16),
which threw the AuctionStats row out of the card and the EN gloss out of the
stage. The browser recovers silently, so it looks like a styling problem and is
not. The cheap check is structural rather than visual: on both pages the
verdict block AND the stats row must be descendants of
`.w-full.p-5.bg-white.rounded-xl`, and at 1024px that card measures 720 with
the stats grid at 680 and its top 238px below the card's — identical numbers on
the decision page and the replica.

### The Figma file — addresses, and how to verify work in it

The decision page also exists as two live screens in Figma, built from the proto
and kept in step with it by hand. **Everything below is an address; none of it
is derivable from the repo, so it is written down here.**

| What | Where |
|---|---|
| File | `C2B Seller – Ad creation`, fileKey `sHQk3FUhEZM7EFbYaAcjxX` |
| Page | `Decision page (AI drafting)` — `7028:39536` |
| Canvas | `Frame 1` — `7028:39537`; everything lives inside it |
| Desktop screen (1440) | wrapper `7030:5` · nav `7030:6` · content column `7030:7` |
| Mobile screen (375) | wrapper `7030:8` · nav `7030:9` · content column `7030:10` |

Sections, desktop then mobile: Hero `7030:11` / `7030:17` · Offers `7030:12` /
`7030:18` · Tarjouskilpailun tiedot `7030:13` / `7030:19` · **price belief —
LIVE: `7236:227` / `7236:252`** · Tarvitsetko apua? `7030:15` / `7030:21` ·
FAQ `7030:16` / `7030:22`.

**FIGMA KEEPS EVERY ITERATION; THE PROTO KEEPS ONLY THE CURRENT ONE.** Jussi's
instruction (2026-09-18): *always just add the latest, never remove any of the
iterations there.* So a block removed from the proto STAYS on the canvas, and
the superseded price-belief versions now sit under the live one on both screens:
`7231:227` / `7234:227` (the 5-stage chain, with Jussi's own rewrite on the
desktop copy), `7048:227` / `7030:20` (the original equation) and
`7232:227` / `7234:261` (the two-card version).

**The `✅ … — IN PROTO` / `◻︎ Superseded — … (not in proto)` markers are how you
tell which is which, and they are the ONLY thing to update when a version is
retired.** Renaming is not removing; four frames all claiming IN PROTO would
make the marker worthless. The mobile column now carries the markers too — it
never needed them until it held iterations.

**Local components** (build once, place instances — do not hand-build copies):
`Offer card` `7038:5`, `FAQ row` `7041:71`. The lower offer card is an instance
with the counter-offer action hidden.

**Synced again 2026-09-18 — the two new price-belief treatments.** Both were
built by CLONING `7048:227` (desktop) and `7030:20` (mobile) rather than from
scratch, which is the method to reuse: the clone inherits every convention in
one step — section frame VERTICAL gap 20, heading HORIZONTAL gap 10 with a 20×20
`icon/info` holding a `#2890FF` vector, Title Barlow Bold 20/24 `#134195`, Card
VERTICAL pad 20 gap 16 radius 12 white, Lead DM Sans 16/24 `#334155`, chips
pad 11 radius 8 (`#F0FDF4`/`#22C55E` own, `#E2E8F0` solid, `#CBD5E1` dashed),
Sub and Footnote DM Sans 12/20. Building fresh would have meant re-deriving all
of it and getting some of it wrong.

**Two Figma-specific translations the browser does not need.** Flex ratios have
no Figma equivalent, so the chain's ends are FIXED 174px and its steps FILL,
which self-balances to 72px against the browser's 69. And the mobile chain uses
a literal `↓` where the proto rotates its `→` 90° in CSS — the rendered result
is what the file should show, not the mechanism.

**THE DESKTOP CHAIN WAS REWRITTEN IN FIGMA WHILE THIS SYNC WAS RUNNING**, by
Jussi, and it was left exactly as he made it. It now reads
`Näin Nettiauton hinta muodostuu` over
`Maksettu myyjälle → Kunnostus ja valmistelu → Myyntikulut ja kate →
Ilmoituksen pyyntihinta`, with a closing line
`Pyyntihinta ei siis kerro sitä mitä edelliselle omistajalle on maksettu.`
**Figma is ahead of the proto on that block** — note that his stages name COSTS
(`Myyntikulut ja kate`) where the proto's name ACTIONS, which is the deliberate
distinction recorded in the 2c section above. Resolve which way it goes before
syncing that block in either direction.

**Synced to the proto on 2026-09-17.** What that pass changed, so the next one
knows what is already there: the `Verdict` frames (`7033:10` desktop, `7035:10`
mobile) were **deleted** with the painted green block, and a
`Tag / Suosittelemme` frame added in their place — desktop `7134:227` inside a
new `Topline` row `7134:229`, mobile `7134:230` as the first child of the copy
column. Desktop puts headline-then-tag in one HORIZONTAL row (headline FILL, tag
HUG, so the tag lands right); mobile stacks tag-then-headline. The belief block
took the new lead line, the six-item footnote, `Liikkeen pyyntihinta`, 12px
sub-labels, and the green-900 / slate-500 chip palettes.

**Heights do not match the browser exactly, and should not be chased.** Figma
lays text out itself, so the same copy breaks differently: auction details
**252 / 384** against the proto's 254 / 379, belief **226 / 526** against
220 / 508. Verify the SEMANTICS — copy, size, weight, colour, child order —
which do match exactly.

**The illustration's imageHash is `a0e1977c4c8cd9d7496af50e799134be8a09da66`.**
The Plugin API cannot fetch a URL, so a raster image gets in via `upload_assets`
and is then reused by setting that hash on another node's fills. It is no longer
on either screen — the seal replaced it — but the hash is the only way back
without re-uploading.

**THE DRAFT VARIANTS ARE GONE, AND NOT BY ME** (checked 2026-09-18). The desktop
column used to hold five versions of the price-belief block —
`7030:14` (`◻︎ Superseded — gradient bar`) and Jussi's three drafts
`7046:39852`, `7046:39819`, `7046:39787`, plus the stale lead string
`7046:39858`. **All five return MISSING and the column's first read that day
already listed only six children with no drafts among them**, so they were
removed in Figma before this session touched the file. The standing instruction
not to rename, reorder or delete Jussi's drafts still holds for any he makes
next; there is simply nothing left to protect from the old set.

**`figma.getNodeById` LIES ABOUT THIS — use `getNodeByIdAsync`.** The sync getter
returns null for any node outside the currently loaded subtree, so it reports a
live node as missing. Both were run here before concluding anything; only the
async answer is evidence.

**THE DESKTOP COLUMN STILL USES THE `✅ … — IN PROTO` MARKER** and the two new
sections carry it. Mobile holds no variants, so its sections stay unmarked —
that is the file's own convention, not an oversight.

**VERIFY BY MEASUREMENT, NOT BY SCREENSHOT.** The in-app browser pane returns
blank frames intermittently on this page — a scroll-then-capture race that no
amount of waiting reliably fixes — and `node.screenshot()` in Figma is fine but
only shows one node. Every claim about this work was checked by reading computed
styles and rects and diffing them against the proto: font size, weight,
line-height, colour, padding, radius, width, height. That is also how the
replica fidelity was proved, and it is stronger evidence than an image. **A
blank screenshot is a tooling artefact, not a broken page** — re-measure rather
than re-building.

Two divergences the Figma build needs, both deliberate: the spec page carries
`screens: { xs: '460px' }` (only `xs`, so its own `sm`/`md`/`lg` do not move),
and the block-1 headline pins `color:#000`, since that `h3` inherits and the
spec page inherits slate-900 where the decision page inherits black.

**All its Finnish copy was written by me and nothing is approved.** The spec
page says so in its first card, in a warning-coloured status chip and in the
hero. Same category as Seller file upload's draft copy, but weaker: that one is
a proposal awaiting sign-off, this one is a conversation starter.

### The arm also REMOVES the warm-up screen (2026-09-11)

`showWarmup = !req.offers_seen_at && !ID_V1`. Prod's warm-up is a full screen
standing between the seller and their offers: an illustration,
"Hyvä tarjouskilpailu takana!", one line about the auction reaching hundreds of
dealerships, and a button to see the results. **That is now what the rebuilt
auction-details block says on the decision page itself** — same illustration,
same claim, and the figures behind it — so keeping both makes the seller read
the same thing twice, once behind a click, and only the second one carries the
evidence.

`control` keeps it, because it is prod. Nothing else changes: `revealOffers()`
stays wired for control, `postAuctionStatus` is untouched, and the warm-up copy
table below still describes what control renders.

### The auction-details block, rebuilt (2026-09-11)

**The third block is prod's own `Tarjouskilpailun tiedot`, not a new section.**
Today it reports two figures and draws the bid progression, and it answers a
question the seller is not asking. The one they ARE asking is *is this a good
offer?*, and two bare numbers only answer it for a reader who already knows how
a C2B auction works.

**The chart is the clearest case of the problem, which is why it is what goes.**
It draws the bids RISING, which looks like evidence and is really just the shape
every ascending auction makes. True, decorative, settles nothing. The date row
goes with it. The two figures stay.

In their place, `buildAuctionVerdict` reads those same figures back as the
argument they are, in the **warm-up screen's own shape** — illustration,
headline, one paragraph — at the scale of a block inside a card.

**ORDER: verdict, then the explanation, then the figures** (2026-09-11). The
stats row used to lead and now closes. Read that way the block answers "is this
a good offer?" in its first line and spends the rest earning it, instead of
opening on two numbers whose relevance the seller has to take on trust until
they reach the sentence at the bottom — **evidence reads better after the
claim.** `buildAuctionVerdict` takes the stats markup as an argument rather than
building it, so the two arms that draw that row keep one definition of it.

**REWRITTEN 2026-09-21, FROM JUSSI'S FIGMA VERSION — THE SECOND REWRITE IN
FOUR DAYS, AND IT REVERSES PART OF THE FIRST.** The section is
`Tarjouskilpailun tulos` — which **resolves the open question below** about
prod's `tiedot` underselling a block that had stopped being a record. What it
says now:

| Part | Copy |
|---|---|
| tag | `Suosittelemme hyväksymään` *(unchanged)* |
| headline | `Paras hinta autostasi on nyt selvillä!` *(unchanged)* |
| body | `25 autoliikettä perehtyi autoosi ja kilpaili siitä tekemällä yhteensä 138 tarjousta. Korkein tarjous on kilpailun tulos, jonka suosittelemme hyväksymään.` |
| row | `Autoliikkeitä 25` · `Tehtyjä tarjouksia 138` |

**THE HEADLINE CLAIMS THE BRAND'S OWN PROMISE**, closing the front page's
`Paras hinta autostasi` at the moment the seller can act on it. It is only
defensible because the gate is the offer amount — see the corrected note below.

**THE COPY ANSWERS "where are the other 136 offers?", AND THE THIRD CELL THAT
USED TO ANSWER IT IS GONE.** This is the reversal: on 2026-09-18 a
`Korkein tarjous 11 500 €` cell was added on the reasoning that a row which
NARROWS — dealerships → bids → the winning price — resolves the contradiction
by ending on the number on the offer card. It does, and it cost too much: the
amount is already the largest thing on the offer card directly above, so the
cell restated it in a smaller font, and it duplicated the belief block's own
chip further down the same screen. **Jussi named that duplication himself** —
same number, two terms, two visual styles.

**THE SENTENCE DOES THE SAME WORK FOR NOTHING.** `25 autoliikettä … tekemällä
yhteensä 138 tarjousta` states both figures IN ONE CLAUSE, so the gap between
them is a fact about how the auction ran rather than a contradiction the reader
has to resolve. Two bare counts in a row cannot do that — they print 25 and 138
side by side and leave the seller to decide whether 136 offers are being
withheld. `Korkein tarjous on kilpailun tulos` closes it: the rest were
**superseded, not hidden**.

**SO THE COUNTS ARE BACK IN THE COPY, AND THE DUPLICATION WITH THE ROW IS
DELIBERATE.** A pass on 2026-09-14 took `25 autoliikkeen ammattilaista` OUT of
the body precisely because a cell 100px below printed 25 — the rule then was
"the count appears once". That rule is now overruled: a figure repeated in a
sentence that EXPLAINS it is not the same as a figure printed twice. **Do not
"fix" this by removing the numbers from the copy again** — the sentence stops
working without them.

**`perehtyi`, NEVER `arvioi`** — and note the singular. The subject is
`25 autoliikettä`, which takes a singular verb in Finnish; the previous version
had a plural subject (`ammattilaiset perehtyivät`). `arvio` is exactly what a
sceptical seller dismisses ("se on vaan arvio") and it is the product's own word
for the machine estimate. An intermediate Figma version also had it in the wrong
case — `perehtyä` takes the illative, `autoosi` not `autosi`.

**THE BLOCK READS NO EURO FIGURE AGAIN, which is what it was designed for.**
`buildAuctionVerdict(buyers, offerCount, statsHtml)` takes the two counts and
nothing else, so nothing here can go stale against the number beside it and it
works unchanged on a final offer. The three-cell version's obligation —
"a figure here must always read `standingAmount`" — no longer applies, and
reinstating any amount in this block brings it back.

**`Tehtyjä tarjouksia`, not prod's `Tarjouksia yhteensä`.** Past tense, because
the auction is over and the block reports a result rather than a total in
progress.

**`AuctionStats`' `cells` PROP IS STILL LOAD-BEARING even at two cells**, and
that is not obvious: the default row is the same COUNT but prod's own labels in
prod's own order (bids first). This row leads with the dealerships and renames
both cells, so it is still a content override rather than the default. `cells`
(`[{label, value, icon}]`, pre-formatted by the caller) replaces the defaults
when passed and is absent everywhere else, so **the offers page and Asking price
removal are untouched** — verified after this change: the offers page still
renders `Tarjouksia yhteensä / Tarjoajat`. Passed as JSON in `data-cells`;
malformed JSON falls back to the default cells rather than to an empty frame.
**The component did not change here, so the bundle needs NO rebuild** — this
edit is `decision.html` only.

**Measured, two cells:** 254px desktop / **403px at 375px**, against the
three-cell version's 254 / 517 — **114px back on a phone**, because two cells
clear the container query's 220px threshold where three did not clear its 320px
one, so the row stays side by side instead of stacking. Both labels hold one
line down to **360px viewport** (272px container); at 320px `Tehtyjä tarjouksia`
takes two 12px lines, unclipped, and `mt-auto` keeps both values on the same
baseline so the row stays level. The body is 6 lines at 375px — the longest it
has been, and the price of carrying both figures in prose.

**One repetition shipped knowingly:** the body ends `jonka suosittelemme
hyväksymään` and the tag says `Suosittelemme hyväksymään`, ~60px apart. It is
Jussi's own Figma copy and was built as drawn; flagged for the copy lock rather
than edited in passing.

**THE PAINTED VERDICT BLOCK IS GONE; THE RECOMMENDATION IS A TAG**
(2026-09-16, Jussi's call). `Loistava suoritus!` and its sentence are replaced by
one green tag, **`Suosittelemme hyväksymään`**, sitting immediately **above the
headline and right of the 48px seal** — the first line of the copy column rather
than a block of its own above the row.

It keeps the verdict palette exactly (`green-50` fill, `green-500` border,
`green-900` text) because the belief block's own first chip borrows that palette
and needs a reference point on the page. The shape is the warm-up badge's
(`px-2 py-1 text-xs rounded border`), so there is one tag idiom rather than two.
`ICO_GAVEL` went with the block and is deleted.

**PLACEMENT CARRIES THE EXCLUSIVITY, AND THAT IS THE POINT OF IT**
(2026-09-16). This tag is shown ONLY to a seller whose offer clears the
fair-offer bar, so it must not read as the block's first line — a line everybody
gets. From prod's `sm` it is pulled to the **far right of the headline's own
line**, hanging off the opposite corner with its right edge flush to the card's
content box, and the headline reclaims the top-left beside the seal. Below `sm`
the column cannot hold both, so it stacks with the tag on top.

`.verdict-topline` is hand-written CSS: DOM order is **tag, then headline**, and
`flex-direction: row-reverse` flips that visually so the markup keeps the tag
first for a screen reader while the eye reads headline-then-tag. Hand-written
for the two usual reasons — the block is injected by JS, so Play CDN utilities
land a tick late, and a single-class rule would tie with Tailwind's own
utilities and lose on source order.

**Measured at the breakpoint**, which is the tight case: at exactly 620px the
headline holds one line at 265px beside the 191px tag, with no overflow; at
768px the headline has 398px. The tag is 191px natural against a 223px column at
375px, so it holds one line stacked too.

**What this trades.** The recommendation loses its sentence and keeps only its
verb, so the block no longer argues for accepting — it labels. That also ends the
"only painted block in the arm" reasoning: nothing in this section is painted now
except the tag itself. Measured: green-900 on green-50 is **8.70:1**, and the tag
is 191px natural against a 223px column at 375px, so it holds one line.

| Part | Copy | Job |
|---|---|---|
| **1 — tag** | `Suosittelemme hyväksymään` | AutoVex's view, stated in three words |
| **2 — headline** | `Autosi arvo on nyt tiedossa!` | the payoff — knowledge, not a number |

**The headline has carried four shapes.** `Autostasi kilpaili 25 autoliikettä.`
(a count, duplicating the stats row) → `Nyt tiedät, mitä juuri sinun autostasi
maksetaan.` (`juuri sinun` doing the anti-generic work) → `Nyt tiedät, mitä
autostasi maksetaan juuri nyt.` (`juuri nyt` trading that for urgency) → the
current `Autosi arvo on nyt tiedossa!`, which drops both and states the payoff as
a fact. **Nothing in the block now says the offer expires**, and **the
anti-generic job rests entirely on the body**, which carries it twice
(`perehtyi autoosi`, `Laskettuaan sille tarkan hinnan`).
| **2 — body** | `25 autoliikkeen ammattilaista perehtyi autoosi. Laskettuaan sille tarkan hinnan, ostajat korottivat vielä tarjouksiaan voittaakseen kilpailun.` | **who priced the car and how they competed** |
| **3 — stats row** | `Tarjouksia yhteensä` / `Tarjoajat` | the evidence, closing rather than opening |

The row order is **seal · (headline + tag on one line, then body) · stats** from 620px, and **seal · (tag, headline, body) · stats** below it.

**`Loistava suoritus!`, NOT `Hyvä tarjouskilpailu`** (2026-09-14; the string was RETIRED on 2026-09-16 with the block it led, but the reasoning still governs any future verdict wording). Jussi's call,
and the reason is worth keeping: `hyvä` invites the question of what a BETTER
auction would have looked like, which is exactly the doubt this block exists to
close. A superlative leaves nothing above it. Do not confuse this string with
the warm-up screen's `Hyvä tarjouskilpailu takana!`, which is prod's and
unchanged — `control` still renders it.

**The badge and the recommendation are ONE block** (2026-09-11). They were a
lime `UiBadge` above the headline and a blue strip below the body — two green-ish
elements saying the same thing at two lengths, in two borrowed colours: lime from
the warm-up badge, where it reports a status, and blue from the options section's
promoted card. Neither was the colour of the action being recommended. Now one
`border-green-500 bg-green-50` block with the badge text as its bold lead line,
in the same green the accept column's title carries, because green means one
thing on this page: this is the accepting direction. **It is the only painted
block in the whole arm** — the options columns above it were unpainted after it
was built, and that is deliberate: this one states a recommendation in AutoVex's
own voice, which is the one thing here that earns a box.

Folding it down also lets the right-hand column open on the headline, which gives
the section a clean arc — the fact, then why it means anything, then the
conclusion.

**No rules anywhere in this block.** A `border-t` between the stats grid and the
illustration read as a second line boxing the illustration in rather than as a
separator, since the grid already carries its own frame. Each part carries its
own frame or none, and 20px of space does the separating.

**THE TWO FIGURES ARE DIFFERENT NUMBERS NOW, and that is the point of the row.**
Every open-decision scenario used to seed `offer_count: 25, buyers: 25`, so
"Tarjouksia yhteensä 25 / Tarjoajat 25" read as one number printed twice and
neither label had to be understood. They are **138 bids from 25 dealerships**
(2026-09-11) — prod's own meaning, where a bidder can bid many times — which is
also what makes the headline's "25 autoliikettä" unambiguous: it is the
bidder count, not the bid count.

It is changed in the SCENARIO data, not in the arm, and deliberately so. The
number of bids is a state of the world a real seller could be in; an arm is a
design candidate. Letting a variant rewrite world state would break the split
the whole prototype bar is built on, so control shows 138/25 too — and it is
more faithful to prod than 25/25 ever was.

**AND BOTH PAGES NOW READ ONE DEFINITION OF THEM** (2026-09-21). The counts and
the reaction window live in `proto-mock.js` as `window.PROTO_AUCTION`
(`reactionSeconds` 86400, `endedBids` 138, `endedBidders` 25), because prod
reads both pages off the same tender request and the proto was contradicting
itself across the navigation:

| | was | now |
|---|---|---|
| reaction window, decision page | `REACTION = 7200` (2 h) | prod's `app.reaction_time_for_offers`, config default **86400** |
| reaction window, offers page | a literal `24*3600` | the same constant |
| live auction counts | `offer_count: 2, buyers: 2` | `LIVE_BIDS` 84 / `LIVE_BUYERS` 19, mid-flight towards the ended pair |
| ended auction counts | `offer_count: 3, buyers: 3` on twelve fixtures | `ENDED_BIDS` / `ENDED_BUYERS` |

`offers.html` pins `sharedOffers` / `sharedBidders` next to the `sharedExpiry`
it already pinned, and `decision.html`'s `auctionCounts(req)` prefers that pair
when the scenario matches, falling back to its own fixture on a direct load.
**The clock was the louder half**: a final offer rendered a 1 h countdown where
prod's `FinalOffer` RESETS the window to a full 24 h (`expires = now()` on the
request, `now() + reaction time` on the offer), and the seller's own clock is
computed request-side anyway — `SellerTenderOfferResource` returns
`expires->addSeconds(reaction_time_for_offers)` and does not read
`tender_offers.expires_at` at all, with a comment saying it should. Measured
after the change: 23 h on a direct load, 19 h 59 m arriving from the offers
page, which is that page's own pinned expiry.

**One car across every surface, too.** The five draft fixtures on `offers.html`
carried a hardcoded `XYZ-789 / Toyota Corolla 2019` while `BASE` on the same
page already read the funnel store, so one account could list two cars;
`decision.html`'s `BASE` hardcoded a third. Both now read the funnel car
(`DRAFT_CAR` and `_funnelCar`). The plate lookup still returns one fixed car
whatever plate is typed — accepted, deliberately, rather than shipping a
catalogue of placeholder makes into the proto.

**It made the control chart honest and duller.** `genInsights` floors every
increment at 50 €, so 138 bids across a ~4 000 € range could not be drawn and
the generator fell back to an even ramp — a straight diagonal. The dense branch
now keeps the same uneven weighting and only drops the strictly-increasing rule,
giving a staircase (67 distinct levels across 139 points). At chart scale each
50 € step is ~2.5px, so it still reads as close to a straight climb: that is
what 138 bids over that range actually looks like, and the old varied line was
an artefact of pretending there were 25.

**THE COPY WAS INVERTED AND CUT BY HALF** (2026-09-14). It ran 232 characters
across three sentences and took six lines on a phone, sitting between a green
block that states the conclusion and a stats row that shows the evidence —
three layers all arguing the same thing, with `25` printed twice about 100px
apart. The payoff line was promoted to the headline and the mechanic demoted to
one short paragraph. **120 characters, two lines on desktop, and the section
went 457 → 333 desktop / 576 → 430 on a phone.**

One job per layer now: **the verdict recommends, the middle says what happened,
the stats give the scale.**

**THE BODY ANSWERS THREE THINGS SELLERS ACTUALLY SAY, and each is a reject
reason from user testing** — this is why it reads as it does and why none of the
three words are decoration:

| Phrase | The belief it answers |
|---|---|
| `ammattilaista perehtyi autoosi` | sellers do not know a person looked at all. `autoosi`, not `ilmoitukseesi` — it lands on the car rather than on a document |
| `Laskettuaan sille tarkan hinnan` | the direct answer to "you just pull prices for similar cars": each dealership priced THIS car before bidding |
| `korottivat vielä tarjouksiaan voittaakseen kilpailun` | the auction was a real contest, not 25 sealed envelopes — see the correction below |
| ~~`jatka myyntiä autoliikkeen kanssa`~~ | **CUT 2026-09-16.** It answered "the dealership is the counterparty, which research says consumers prefer to a website or a stranger at the door" — and it was the only line naming the dealership as the buyer. **Watch this in testing:** "does AutoVex buy the car?" is a live misconception and nothing in the block addresses it now |

**That line is now gone entirely.** It was `Kaupan teet suoraan autoliikkeen
kanssa`, became the call to action `Hyväksy tarjous, ja jatka myyntiä
autoliikkeen kanssa` (2026-09-14), and was cut with the verdict block
(2026-09-16). The recommendation it carried moved into the tag; the
counterparty claim was not replaced.

**THE COMPETITION CLAUSE ALSO DECODES THE STATS ROW, which nothing else on the
page does.** `138 tarjousta / 25 tarjoajaa` is a contradiction to a seller who
does not know a dealership may bid more than once. "They saw each other's offers
and raised their own" is the only sentence that explains the gap — which is why
it sits directly above the row rather than anywhere else.

**Do not compress this to one sentence.** Each clause is load-bearing against a
different objection; at 191 characters the length is already the floor.

**THE AUCTION IS NOT BLIND, AND THIS NOTE USED TO SAY IT WAS** (corrected
2026-09-14). An early draft of this block argued from blind independent
valuation — "each dealership priced the car itself and did not see the other
offers" — Jussi replaced the copy, and the note left behind here recorded
"blindness is true". **It is not.** Dealerships see each other's bids, the
auction runs to a deadline, and they raise their bids inside that window. That
is what `Tarjouskilpailu` means, and it is why the copy now says so outright.

Do not reinstate any framing built on sealed bids. The correct argument is the
stronger one anyway: a contested auction beats the best of 25 independent
guesses.

**The closing strip names no euro figure** — `korkeinta tarjousta` points at the
card above instead, so it cannot go stale against the number beside it and the
sentence works unchanged on a final offer. That is why `buildAuctionVerdict`
takes `buyers` and nothing else: no amount is read in it at all. It is the only
place on the decision page where the service states a view on the offer rather
than reporting it, and since Jussi's pass **the only place that recommends an
action outright**.

**The stats row takes Asking price removal's grid, in this arm too.** `APR_V1 ||
ID_V1` — not a combination (the bar allows one arm at a time) but this arm
asking for the row the other one proposes, because a row that looks like a spec
sheet is the wrong frame for an argument. The chart's top rule follows the same
condition: a framed stats row above it makes `border-y` read as a doubled line,
which is the same fix Asking price removal already documents.

**THE ILLUSTRATION IS GONE; A 48px SEAL-CHECK STAMPS THE BLOCK INSTEAD**
(2026-09-14). Marketing is phasing the illustrations out product-wide, and at
48px the block stops being a picture beside a paragraph and becomes one line
with a stamp on it. `excellent_auction.png` STAYS IN THE REPO — `control`'s
warm-up screen still draws it.

**THE SEAL IS BLUE-600, AND THE COLOUR IS THE ARGUMENT.** This page assigns blue
to what AutoVex does — the section icons, AuctionStats' figures — and green to
the accepting direction. So blue also carries the sentence underneath it:
**AutoVex ran the auction, the dealership made the offer, accepting it is the
green act.**

Green was the obvious choice and is wrong: a green seal 40px under the green
verdict block is the recommendation stated twice in colour, which is the exact
fault that merged the old lime badge and blue strip into that one block. Amber
is unavailable — on this page it means "something new arrived".

The glyph is prod's own seal-check, already used on the offer card's
`100+ kauppaa AutoVexissä` row. Filled, its check knocks out of the rosette, so
it reads as a stamp rather than an icon.

**It is ONE ROW at every width now.** The illustration needed the phone layout to
centre it above the text; a 48px stamp does not, so the stacked variant is gone
and both breakpoints read the same way.

**TWO gates, and in both the fallback is control with nothing removed** — the
chart and the date row exactly as prod draws them:

- **`buyers >= 4`** (`VERDICT_MIN_BIDDERS`), because below that the argument is
  false. Not reachable from any scenario today — every open-decision state seeds
  25 bidders and the bar's price fields do not touch `buyers` — so it is a guard
  rather than a second state to review. **It is not an edge case in production:**
  a benchmarking study put an uncompetitive auction behind roughly half of all
  rejected-offer cases. The thin-auction version of this block is the harder half
  of the design and is **not designed**.
- **The same open-decision list** the other two blocks use, passed in as
  `decisionOpen` because `buildInsights` has no `pas` of its own. The insights
  block is NOT gated on it in prod, so without this the verdict would appear on
  an accepted and a rejected auction — and after a rejection, "we consider that a
  competitive price" is the service telling a seller who has walked away that
  they were wrong.

**THIS NOTE USED TO SAY THE VERDICT WAS TRIGGERED BY THE BIDDER COUNT. THAT WAS
WRONG, AND JUSSI CORRECTED IT ON 2026-09-18.** The record now reads:

**THE TRIGGER IS THE OFFER AMOUNT.** `req.fair_offer` is true when the offer
clears a set share of the reference price — **the ratio is in the private notes,
never here** — and `idShow` requires it, so the block only ever appears to a
seller whose offer already passes that bar. The honest
shape I described as "probably the reverse of what is built" is what was built
all along; I had read `VERDICT_MIN_BIDDERS` as the condition and the flag as a
detail, when it is the other way round.

**`buyers >= 4` is a SECOND guard, not the trigger.** It exists because a
competition argument is false in a thin auction whatever the offer is, so both
must hold. Reading a compound gate and reporting the loudest half is the mistake
to avoid repeating — **name the condition that decides, not the one that reads
as a rule.**

What this changes in practice: the headline may make a claim about the PRICE,
because the price is what qualified the seller to see it. `Paras hinta autostasi
on nyt selvillä!` (2026-09-18) would have been indefensible on a bidder-count
trigger and is defensible on this one. **That makes the gate load-bearing in a
new way** — widening the audience later is no longer a one-line change to a
predicate, it is a decision about a claim.

**The ratio itself stays out of this repository** — see the private notes. The
denominator is the reference price, not "our estimate": a GT-X estimate, a sales
advisor's estimate from the review call, or any later corrected value.

**THE SECTION TITLE WAS CHANGED, AND THIS OPEN QUESTION IS CLOSED**
(2026-09-18). Prod's `Tarjouskilpailun tiedot` described a record of what
happened; the block is an argument about what it meant, so the title undersold
it. It is `Tarjouskilpailun tulos` now. The rename is NOT arm-gated — `control`
shows it too — so it is a production copy change to carry into the ticket rather
than part of the arm.

**Heights, desktop / 375px:** advice **194 / 194** collapsed, reminders
**264 / 524**, options **259 / 543**, auction details **457 / 535**. The three
new sections are **1 261px on a phone** — reminders is still the biggest block in
the arm, and the duplication question above is partly a height question. The
auction-details block replaces a chart and a date row rather than adding to
them, so it is close to a wash on its own.

**All three white containers are inset by their own `p-5` and nothing else**
(2026-09-11). The options and reminders columns kept a `p-4` from when they were
painted boxes, which put their text **36px** from the container edge where the
auction-details block and the offer cards start at **20px** — a misalignment
across the page that nothing in the sections themselves made visible. Padding is
off the columns and the space between them moved to the row gap: `gap-10` for
reminders (40px between texts, against 44 before) and `gap-7` for the options
row (28 + 14 + 28 = 70px, exactly what it was). One `gap` covers both axes, so
the stacked phone layout keeps it. **Do not put padding back on a column** — if
a column ever needs its own inset again, it needs its own box too.

**Still flagged rather than solved:** both blocks argue for accepting and sit
directly above the reject banner, which `docs/anti_patterns.md` warns about. A
neutral-framing arm is the obvious A/B partner, and the fair-offer narrowing
makes it more necessary rather than less: the sellers being argued at are the
ones most likely to accept anyway.


## Which offers get a card, and what a final offer implies

**The selection rule, single-sourced in prod and mirrored exactly by the
proto's `selectOffers`:** accepted offers if any; else the highest ALONE when it
carries car pickup; else the **top two by amount**. Status is not part of it, so
a rejected or expired offer can hold the second slot — only its rank is
displaced by `getOfferStatus`.

**A final offer is not a new offer, and it can only exist after a rejection.**
Worth knowing before seeding any final-offer state:

- The dealership holding the **highest** offer raises that same row in place —
  `FinalOffer` writes `amount`, `car_pickup`, `status = FINAL` and a
  `FINAL_OFFER` revision onto it. No new offer is created and no other offer is
  touched.
- Prod refuses it unless the highest offer is **already rejected**
  (`only_rejected_requests_can_receive_final_offers`), the request has no final
  offer yet, the raise clears `final_offer.minimum_raise_amount`, and the
  dealership did not itself withdraw.
- The seller's reject is always reject-**ALL**: `RejectAllOffers` sets every
  offer on the request to rejected and every negotiation to stopped.

**So the sequence is fixed — all offers rejected, then the top one comes back
raised and flagged final — and the consequence is that every other offer on
screen beside a final offer is REJECTED.** A live `Toiseksi korkein` card next
to a final offer is a state production cannot produce. The proto's
`final-offer` scenario carried `status: 0` on the five lower offers and rendered
exactly that, complete with an accept button; corrected 2026-09-10 to `status: 2`.

**Whether a second card appears at all is decided by `car_pickup`, not by
finalness.** The final offer writes its own `car_pickup`, and the selection rule
shows the highest alone when that flag is set — so a final offer WITH pickup is
one card, without it is two (the second one rejected). The proto's scenario sets
`car_pickup: false`, i.e. the two-card case; the one-card case has no scenario
of its own and would only need the flag flipped.

`FinalOffer` also resets the clock — `expires = now()` on the request and
`now() + reaction time` on the offer — which is why the scenario uses `ACTIVE()`
and why the final-offer card shows a running countdown rather than reading as
expired.

**A final offer cannot be countered, and prod's reject confirmation does not
know that.** `useDecisionActions` routes reject-all to `Reject` rather than
QuickNegotiate whenever the highest offer is final, `OfferActions.showNegotiate`
ends in `&& !this.offer.isFinal`, and `C2BOfferCard`'s `finalOffer` override
never sets `showNegotiate` — so there is no counter-offer affordance on the card
or in the modal. But `Reject.vue` picks its copy from
`!negotiation && negotiable`, and `negotiable` is
`TenderRequest::offersAreNegotiable()`, which is only
`marketplace_type !== B2B` — **always true for a consumer seller**. So a final
offer with no negotiation gets `reject.confirm.no_negotiation`, the paragraph
that says *"Suosittelemme tekemään vastatarjouksen autoliikkeelle…"*, with
nothing anywhere to act on it. **A production defect, reproduced faithfully in
control.**

**The team owns the fix, and the direction is decided (2026-09-10): the
confirmation becomes a plain confirmation of rejection, with no negotiation
recommendation.** It is ticketed with the team as production copy work. The
alternative reading — deciding a final offer SHOULD be counter-offerable — was
not taken; that would have been a product decision about the mechanic rather
than a wording fix.

**So the proto stays exactly as it is until that copy ships. Do not "correct"
this in passing** — control is a faithful transcription and is meant to be. When
the new string lands, transcribe it into `renderRejectModal` (the control
paragraph and the `EN_V1` header/help block both) and re-check the `hasNeg`
branch: a confirmation-only string may remove the need for two variants at all.

**It also parks an Enhanced negotiations question rather than answering it.**
`v1` restructures this step (prod's question to the title row, the advice into
the contained help block) and branches on `hasNeg` alone, so today it repeats
the dead advice. Gating it on the counter-offer button actually being present
was proposed and is **deliberately not built**: if prod's copy becomes
confirmation-only, there is no advice left to gate. Revisit only after the copy
change, alongside change 9, which already took the customer-support dead end out
of this modal.

**One smaller sibling, not verified at runtime:** `showNegotiate` is not gated
on expiry and that negotiate `Button` alone carries no `:disabled`, unlike its
neighbours, so an expired highest offer still appears to offer
`Tee vastatarjous`. The proto mirrors it. Check whether the send is refused
server-side before calling it a bug.


## Customer support banner on the decision page — no photo, two configurations

Prod's is `OBannerHelperCard.vue` over `OCard.vue`, with
`MThumbnailWithInlineText.vue` for the text half and `MButtonWithSubText.vue` +
`MSubTextWithIcon.vue` for the action half. Transcribed (2026-09-08) after the
team spotted the proto's version drifting.

**There is no round agent photo, and there never was one here.** `thumbnailImg`
defaults to `null`, neither consumer in `C2BDecision.vue` passes one, and
`MThumbnailWithInlineText` gates the whole avatar wrapper on
`v-if="thumbnailSrc"` — so the text block simply drops its `ps-3` for `ps-0`.
Checked across all five dumps back to 2026-08-14: no version of that file has
ever passed an image. The proto's `kasper.png` came from the retired Astro
prototype's own `expert` mock, a different component; the asset is deleted.

**Two configurations reach a consumer seller, and which one arrives is decided
by whether the status declares banner copy of its own.** In
`c2bPostAuctionMessages.js` exactly the statuses with no `card`/`button` block
declare a `variant`, and the ones with copy declare none — so the flag is not a
separate choice:

| Configuration | Statuses | Frame | Action section | Button |
|---|---|---|---|---|
| `actionable` + `default` | no offers, expired, accepted, rejected — the four with their own wording | `bg-slate-50 outline-blue-400`, block | `bg-blue-100`, **`lg:hidden`** | primary blue, phone icon |
| `actionable-inline` + `destructive` | the four price tiers, `final_offer`, `negotiation_stopped`, `offers_pending_action` — all falling through to `decline` | `bg-orange-50 outline-orange-400`, `lg:flex lg:flex-row lg:justify-between` | `bg-orange-100`, always visible | secondary red, warning line under it |

**So from 992px the four default-intent banners are TEXT ONLY** — the action
section is `lg:hidden` and the number written into the sentence is the seller's
only way to call. Easy to miss when reviewing on a desktop.

**Five wordings, two phone numbers.** `helper`, `accepted` and `decline` carry
+358 40 040 7002; `expired` and `rejected` carry +358 44 901 5285.

Details that were wrong in the proto and are worth not re-inventing:

- **The title is a bare `<h5>`, and that is what makes it a heading.** Prod
  styles the element: `_typography.scss` gives `h5`
  `text-lg leading-2 sm:text-xl sm:leading-3 font-semibold` and `custom.scss`
  gives it `font-display`, so it is **Barlow 600 at 18px, 20px from 620px**,
  with only `mb-2 leading-snug` of its own — that `leading-snug` is a utility,
  so it wins over the element's own leading and the rendered line-height is
  1.375. The proto had it `font-semibold text-slate-800` at the inherited 14px,
  and **this is the heading that exposed the missing element rules** (see
  rule 5); it is the reason they are now in `tw-tokens.js`.
- **Neither the title nor the message carries a colour**, so both inherit the
  body's near-black. The proto painted the message `text-slate-600`.
- The message is `text-sm leading-none` — 14px on 14px, deliberately tight.
- The button is size **`fw`** plus the page's own `md:h-10 md:px-5`: `px-8 h-14
  w-full` with a `text-base` label on a phone, 40px tall and `px-5` from 768px.
  The proto had it `h-10 text-sm` at every width.
- The phone icon is prod's `phone` sprite (Heroicons solid) at `1em` with
  `pr-1 transform -translate-x-1`; the proto had drawn a Material Symbols phone,
  a different glyph.
- The warning icon is `text-destructive`, i.e. `hsl(0 84.2% 60.2%)` = **#EF4444
  = red-500**, at `1em` inside a `font-size: 1.125em` wrapper.

**Two prod quirks reproduced rather than tidied.** The variant class puts
`block` on the action section AFTER the base `flex` and `tailwind-merge` keeps
the later one, so that section is a block and its `justify-start items-center
gap-1` do nothing. And the sub-text wrapper is gated on **the slot existing**,
not on its content — `sub_text` is an empty string for every wording but
`decline`, so those four banners carry an empty `mt-3` div, 12px of dead space
under the button.

**Copy comes from the status, the section from the offers, and prod keeps those
two independent.** `usePostAuctionMessaging` picks the wording; `C2BDecision.vue`
picks which of its two `Section`s renders. The proto used to derive the top
banner's wording from the offer flags, which agrees in every reachable state but
would disagree the moment a status named copy the flags did not. `allRejected`
also lost its `offers.length > 0` guard, because prod's
`sortedOffers.every(o => o.isRejected)` is **vacuously true with no offers** — so
a no-offer auction takes the top section. Both sections sit between the offer
grid and the FAQ and the insights block is hidden without offers, so the banner
lands in the same place either way.

**One deliberate divergence, and it is a prod defect.** The bottom section wires
its button to `handleRejectAllOffers` whatever the wording, so on
`offers_expired` prod shows a button labelled **&ldquo;Soita meille&rdquo; that
rejects the entire auction** (below 992px, where that section is visible at all).
The proto keeps the `tel:` link the label promises. `decline` is the wording that
section is meant for and behaves identically in both. Worth reporting rather than
copying.

**A second, smaller one:** prod's top-section button dials
`window.Laravel.customer_success_phone`, a Filament site setting, which is not
necessarily the number written into the sentence beside it. The proto has no such
setting and dials the number the copy shows.

**No spec page owns this** — it is prod transcription, not an initiative. The
Enhanced negotiations spec references this banner only as the second entry point
into the negotiation modal (its `Hylkää tarjouskilpailu` button), and neither
that label nor its routing changed.

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

**Three prod details transcribed knowingly.** Its title is a **bare `<h2>`**, and
that is not a small one: prod styles the element, so
"Kiitos kun käytit palveluamme!" is **28px/36px bold Barlow, 40px/46px from
992px**. The proto rendered it at body size until the element rules went into
`tw-tokens.js` (2026-09-08) — an earlier note here claimed body size WAS prod,
which was wrong, and it came from reading Tailwind's preflight without reading
`sass/base/_typography.scss` after it.
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

**Informed decision's `v1` removes it**, and that is the only thing in the
prototype that does — see that section. Everything below describes prod and
therefore `control`.

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
support address is the exception and stays a real `mailto` — the CMS's own hrefs
are currently broken, see Review/No review change 3); and structure is plain HTML
rather than the CMS's rich-text nodes. Where the CMS types step numbers into the
copy itself, that is transcribed as written rather than turned back into a list —
`FAQ_CONTENT.support` has two answers like that.

**Re-check the support set against the live page whenever the CMS is edited.**
The method: pull all 36 rendered answers, normalise to plain text, compare by
LENGTH against the proto's own. Anything off by more than a character or two of
whitespace is a real edit; the rest is markup. That is how change 3's five
revised answers were confirmed to be the only five that moved.

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
The three `auction-ended-*` emails carry one with **no copy proposal**: which of
the four a seller receives is computed from `asking_price`, so they are
Asking-price removal's open question, not a wording change. They pointed at a
`slug: null` placeholder saying that initiative had no spec page — it does now,
so they link `design-specs/asking-price-removal.html`.

The tool is dev-only: reachable from the bar's **Go to** row, absent from every
seller-facing nav, and replaced by a short notice in `?mode=test`.

## Design Spec Pages (`design-specs/`)

Public dev-facing spec pages on GH Pages (e.g. `design-specs/delivery-distance.html`) document design changes: previous issues, live demo, states, behavior rules, data contract, copy. They are delivered to devs and discussed with the team.

**Rule 13 and the `shared-component-change` skill apply before a spec page
proposes anything shared.** If a change touches a component, token or pattern
more than one surface uses, run the skill's six checks first, and the spec must
carry what they produce: the inventory (which components exist, which are
deprecated, how many consumers each has), the impact on **both** sides of the
product stated up front, the option that changes only one variable alongside the
preferred one, and what the change does **not** touch.
`accept-button-lab.html` is the worked example of that shape — a standalone page
that measures its own numbers from the rendered pixels so they cannot drift from
what is drawn.

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
