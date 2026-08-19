# Car Card → Shared Component

Consolidating the car card into one component with a props contract mirroring
prod's `CarCard.vue`.

Status: `[ ]` todo · `[~]` in progress · `[x]` done · `[?]` blocked on question

---

## Why

The card's markup currently exists in three places. Under the planned arm
structure, a candidate that changes the card would have to be forked three
times — the exact failure the layer model exists to prevent. **Consolidation is
a precondition for arms working below page level**, not a cleanup task.

The unit that matters is the **props contract**, not the rendering technology:

- **Prod reference** — proto props match prod props, one answer to "what does the card take?"
- **Dev delivery** — spec pages point at a real interface, not a screenshot
- **A/B candidates** — a candidate is a variant on the contract, not a markup copy
- **User testing** — unaffected, because the renderer stays vanilla (no build step)

Renderer stays **vanilla**, not Vue: the card is on `contact`, `success` and
`offers`, so a broken `vue-tests` build would break the funnel mid-study, and
per-change `npm run build` slows the ideation loop. Promote to Vue only when the
component needs internal state or devs need it in Storybook. Because call sites
pass props, that promotion is a renderer swap, not a rewrite.

---

## Where the three copies live

| Card | File | How content is built |
|---|---|---|
| Funnel (contact/success) | `vehicle-card.js` `renderVehicleCard()` | JS, from localStorage |
| Offers published listing | `offers.html` static markup | Filled by element id from scenario data |
| Offers drafts | `offers.html` `buildDraftCard()` | JS, from a draft object |

Already shared (done): the `.av-card` shell — layout, container-query
responsiveness, 250px photo column, placeholder asset.

---

## Props contract

Mirrors `resources/assets/js/pages/offers/components/CarCard.vue`:

| Prop | Type | Notes |
|---|---|---|
| `registrationNumber` | String | Plate, shown in the blue-edged badge |
| `make` | String | |
| `model` | String | |
| `modelSpecification` | String | Trim line under the name |
| `year` | String/Number | Spec pill |
| `mileage` | String | Spec pill, pre-formatted |
| `fuelType` | String | Spec pill |
| `driveType` | String | Spec pill |
| `image` | String\|null | Photo URL; null renders the placeholder |
| `status` | String | Badge label |
| `statusColor` | String | Badge colour classes |
| `statusIcon` | String | Badge icon markup |
| `primaryCtaText` / `primaryCta` | String / fn\|href | |
| `secondaryCtaText` / `secondaryCta` | String / fn\|href | |

Proto-only extensions (no prod equivalent — keep clearly marked):
`priceTag`, `amberBar`, `cardBorder`, `overlayBadge`.

---

## Batches

Ordered by ascending risk. Each is independently verifiable and committable.

### Batch 1 — contract + renderer + funnel card `[x]` DONE
- [x] `buildCarCard(props)` in `vehicle-card.js`, returning the full card markup
- [x] `renderVehicleCard()` becomes a thin adapter: read localStorage → props → `buildCarCard`
- [x] Verify `contact.html` and `success.html` across scenarios, both breakpoints
- [x] SIDE EFFECT: the funnel plate badge now uses prod's treatment (blue bar +
      bordered plate, `CarCard.vue`) instead of its own `w-[78px]` box. The two
      cards previously drew the same element differently; prod's version wins.
- [x] Media background moved from a Tailwind class into the shell CSS —
      `contact.html`/`success.html` don't define the blue scale, so `bg-blue-300`
      there would have silently resolved to the CDN default (#93c5fd).

Lowest risk: the funnel card is already built in JS from a single store, so
this is a refactor behind an unchanged public function.

### Batch 2 — offers draft card `[ ]`
- [ ] `buildDraftCard()` maps its draft object to props and calls `buildCarCard`
- [ ] Delete the duplicated markup
- [ ] Verify every `draft-*` scenario

Low risk: also JS-built, straightforward data mapping. No id-based fill.

### Batch 3 — offers published card `[ ]`
- [ ] Replace the static markup + id-based population with a props call
- [ ] Rework the scenario logic to build props instead of writing into elements
- [ ] Verify all offers scenarios (`live-no-bids`, `auction-live`, `new-offers`,
      `seen-offers`, `no-offers`, `all-rejected`, `accepted`, `deal-completed`,
      `deal-failed`, `blank`)

Highest risk: touches scenario logic, and the card is re-rendered as state
changes. Needs the full scenario sweep.

### Batch 4 — gallery + process `[ ]`
- [ ] `COMPONENTS.md` entry, prod equivalent `CarCard.vue`
- [ ] `components.html` preview with props table
- [ ] Add a **Renderer** column (`vanilla` / `vue`) to `COMPONENTS.md` and
      `docs/component-gallery-process.md` — status values describe prod's
      lifecycle, renderer describes how the proto builds it. Currently the
      process assumes every component is a Vue SFC, so vanilla components have
      nowhere to be indexed.

---

## Generalising to other components

Tiering rule for what gets this treatment:

| Kind | Treatment | Examples |
|---|---|---|
| Singleton page frame | Shared module, no contract | nav, footer (done) |
| Repeated / data-driven / has a prod counterpart | Props contract + shared renderer + gallery entry | car card, offer card, badges, buttons |
| One-off page composition | Stays inline | offers scenario sections, funnel steps |

Discriminator: **appears more than once, or would ever be A/B tested, or has a
prod counterpart devs implement against** → component with a contract. All no →
leave it inline.

Corollary: **anything intended for an A/B test must become a component first.**
Registry entries point at a component + variant, never at a page.
