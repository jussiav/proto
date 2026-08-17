# Component Index

Machine-readable index of all Vue components in the prototype.
Live rendered gallery: [`components.html`](components.html) (open on GitHub Pages).

**Status values:** `prototype` | `in-progress` | `in-storybook`

---

## NavUserIcon

| Field | Value |
|---|---|
| **Status** | `prototype` |
| **File** | `vue-tests/src/components/NavUserIcon.vue` |
| **Bundle** | `vue-tests/dist/nav-user-icon.js` |
| **Prod equivalent** | `<ASpriteIcon icon="account" />` — not a standalone Storybook component |
| **Figma** | _Add link_ |
| **Storybook** | — |

**Props:**
| Prop | Type | Default |
|---|---|---|
| `color` | String | `currentColor` |
| `size` | String | `24px` |

**Used on:** `index.html` (blue nav), `index.html` (white nav), `help.html`, all pages via `layout.js`

---

## ABrandLogo

| Field | Value |
|---|---|
| **Status** | `in-storybook` |
| **File** | `vue-tests/src/components/ABrandLogo.vue` |
| **Bundle** | `vue-tests/dist/brand-logo.js` |
| **Prod import** | `import { ABrandLogo } from '@atoms'` |
| **Figma** | https://www.figma.com/design/V99BoHZwiWopbwzLLorzDN/AI-Dribbles?node-id=390-3912 |
| **Storybook** | https://storybook.autovex.fi/?path=/docs/autovex-ui-atoms-brandlogo--docs |

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `src` | String | `assets/logo-blue.svg` | Logo asset path |
| `inverted` | Boolean | `false` | Use on dark backgrounds |
| `fullWidth` | Boolean | `false` | Fills container width, ignores width/height |
| `width` | Number | `107` | px |
| `height` | Number | `22` | px |
| `alt` | String | `AutoVex` | |

**Used on:** all pages via `layout.js` (blue nav, white nav, footer)

---

## ARegistrationNumberBadge

| Field | Value |
|---|---|
| **Status** | `in-storybook` |
| **File** | `vue-tests/src/components/ARegistrationNumberBadge.vue` |
| **Bundle** | `vue-tests/dist/reg-badge.js` |
| **Prod import** | `import { ARegistrationNumberBadge } from '@atoms'` |
| **Figma** | _Add link_ |
| **Storybook** | https://storybook.autovex.fi/?path=/docs/autovex-ui-atoms-registrationnumberbadge--docs |

**Props:**
| Prop | Type | Required | Notes |
|---|---|---|---|
| `registrationNumber` | String | Yes | Pass uppercase with dash: `ABC-123` |

**Used on:** `details.html` (next to km), `index.html` (hero progress card), `success.html` (vehicle card — via MutationObserver on `#av-vehicle-card`)

---

## AMileage

| Field | Value |
|---|---|
| **Status** | `in-storybook` |
| **File** | `vue-tests/src/components/AMileage.vue` |
| **Bundle** | `vue-tests/dist/mileage.js` |
| **Prod import** | `import { AMileage } from '@atoms'` |
| **Figma** | _Add link_ |
| **Storybook** | https://storybook.autovex.fi/?path=/docs/autovex-ui-atoms-amileage--docs |

**Props:**
| Prop | Type | Required | Notes |
|---|---|---|---|
| `mileage` | Number | Yes | Raw number, formatted to Finnish locale automatically |

**Used on:** `details.html` (next to reg badge), `index.html` (hero progress card)

---

## AuctionInsights

| Field | Value |
|---|---|
| **Status** | `prototype` |
| **File** | `vue-tests/src/AuctionInsights.vue` |
| **Bundle** | `vue-tests/dist/auction-insights.js` |
| **Prod equivalent** | `resources/assets/js/pages/offers/components/AuctionInsights.vue` |
| **Figma** | _Add link_ |
| **Storybook** | — |

**Props:**
| Prop | Type | Required | Notes |
|---|---|---|---|
| `buyers` | Number | Yes | Active bidding dealers |
| `offerCount` | Number | Yes | Total offers placed |
| `askingPrice` | Number | Yes | Seller asking price in € |
| `insightsData` | Number[] | Yes | Offer values for chart |
| `startDate` | Dayjs | Yes | Auction start timestamp |
| `endDate` | Dayjs | Yes | Auction end timestamp |

**Used on:** `auction-test.html`

---

## UiButton

| Field | Value |
|---|---|
| **Status** | `in-storybook` |
| **File** | `vue-tests/src/components/UiButton.vue` |
| **Bundle** | `vue-tests/dist/save-draft-button.js` (SaveDraft send button)<br>`vue-tests/dist/delivery-stepper.js` (delivery-distance −/+ steppers) |
| **Prod import** | `import { UiButton } from '@atoms'` |
| **Figma** | _Add link_ |
| **Storybook** | https://storybook.autovex.fi/?path=/docs/autovex-ui-atoms-button--docs |

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | String | `'default'` | `default` \| `primary` \| `secondary` \| `ghost` \| `link` |
| `intent` | String | `'default'` | `default` \| `neutral` \| `success` \| `destructive` \| `primary` \| `contrast` |
| `size` | String | `'md'` | `sm` \| `md` \| `lg` \| `fw` |
| `loading` | Boolean | `false` | Shows spinner, hides content |
| `disabled` | Boolean | `false` | |
| `iconOnly` | Boolean | `false` | Drops the leading/trailing icon offset and squares the button (`w-8`/`w-10`/`w-14` by size) |
| `icon` | String | `null` | Leading icon name (from `utils/iconRegistry.js`) |
| `iconTrailing` | String | `null` | Trailing icon name |
| `tag` | String | `'button'` | `button` \| `a` |

**Used on:**
- SaveDraft send button in `price.html`, `services.html`, `contact.html` (mounted via `save-draft-button-mount.js`). State bridged via `window.SdSendButton.setLoading(bool)`.
- Delivery-distance stepper in `details.html?delivery=v2` **and** the live demo in `design-specs/delivery-distance.html` — both mount the same bundle, so doc and prototype render the identical component. Props: `type="button" variant="secondary" size="lg" iconOnly icon="minus-new|plus-new"` — no class overrides. `minus-new`/`plus-new` are the **bold** pair (chosen deliberately; see the icon note below for how they fill the slot). Mounts into `[data-av-stepper="minus"]` / `[data-av-stepper="plus"]` via `delivery-stepper-mount.js`. The host page keeps ownership of the km value; the bridge is `window.AVDeliveryStepper.onStep(cb)` for clicks in and `.setDisabled({minus, plus})` for bound state out. Aria-labels come from `translations.js` and follow live language switches.

**Notes:**
- `details.html` must include the production `blue-*` scale override in its Tailwind config, or `variant="secondary"` renders in CDN-default blue instead of AutoVex blue (`blue-100 #D7EDFF`, `blue-800 #0F47BE`).
- **The component does not set `type`.** Inside a `<form>` the button defaults to `type="submit"` and submits the page. Always pass `type="button"` for non-submit actions — production does this at every call site.
- **Icon-only buttons must pass `iconOnly`,** not just `icon`. Without it the icon keeps its label-spacing offset (`pr-1 -translate-x-1`) and sits visibly off-centre.
- **Library bug at `size="lg"` — patched in this port.** Production's `iconOnly` sets the width (`w-8`/`w-10`/`w-14`) but never resets the size's horizontal padding. At `sm` (28px padding < 32px width) and `md` (40px = 40px) the button still comes out square, but at `lg` the `px-8` (64px) overflows `w-14` (56px) and it renders **64×56**. Since each `iconOnly` width is deliberately set to match its own size's height, squares are clearly the intent, so this port adds `px-0` to the `iconOnly` compound variant — giving a true 56×56 at `lg`. **Report upstream and drop the local `px-0` once the library is fixed.**
- **Icon choice matters more than it looks — pick the pair that matches the slot.** At `size="lg"` the component renders the icon at `1.5em`, and `lg` sets no `text-*` class so it inherits `text-base` (16px) — a **24px icon slot**. The two plus/minus pairs fill that slot very differently:

  | icon | viewBox | glyph fills | drawn at 24px | stroke |
  |---|---|---|---|---|
  | `minus` / `plus` | 24 | 75% (18 units) | **18px** + 3px padding each side | 6% of box |
  | `minus-new` / `plus-new` | 18 | 100% (18 units) | **24px**, edge to edge | 13% of box |

  The `-new` pair is bold *and* unpadded, so in a 24px slot it draws 33% larger with a 2x thicker stroke; the padded `minus`/`plus` pair is what matches the 24x24 Figma icon. **The stepper uses the bold `-new` pair by design decision**, accepting that it fills the slot edge to edge. Note production only ever renders `-new` at 16-18px (`accordions.js` hard-codes 18px; `MAccordion` uses `ASpriteIcon`'s 1em default), so this combination is new. If it reads too heavy, the fix is a padded bold 24x24 variant added to the icon set - do **not** shrink the component's icon slot, which would make the prototype diverge from what devs get from the real component.
- **Tailwind Play CDN only generates CSS for classes present at first paint.** A component that applies utilities later (UiButton's disabled state, when a page loads with no button disabled) gets the class but no styles. Pages mounting these components carry a `hidden` safelist div — see `details.html` and `design-specs/delivery-distance.html`. Keep it in sync with the variants the mounted components can produce.
- **Verifying in the Browser pane:** `getComputedStyle` returns stale values after in-session DOM mutations, and Vue re-renders on nextTick. Measure component state on a **fresh page load** (persist state, reload, then read) rather than immediately after clicking.

---

## SaveDraft

| Field | Value |
|---|---|
| **Status** | `in-progress` |
| **File** | `vue-tests/src/components/SaveDraft.vue` |
| **Bundle** | `vue-tests/dist/save-draft.js` |
| **Prod equivalent** | None — needs to be built |
| **Figma** | https://www.figma.com/design/V99BoHZwiWopbwzLLorzDN/AI-Dribbles?node-id=406-3912 |
| **Storybook** | — |

**States:**
| State | Description |
|---|---|
| `collapsed` | Default — shows title, "Valinnainen" badge, CTA arrow link |
| `expanded` | Email input + UiButton send + terms copy |
| `expanded+error` | Same as expanded, error message visible below input |
| `submitted` | Confirmation — shield-check icon, saved title, email display, resend button |

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `storageKey` | String | `'autovex_funnel'` | localStorage key |
| `onSubmitSuccess` | Function | `null` | `(email: string) => void` — called on submit and on mount restore |

**Used on:** `price.html`, `services.html`, `contact.html` — bottom of funnel sidebar. State shared across all steps via localStorage. `contact.html` passes `onSubmitSuccess` via `window.SdCallbacks` to hide the email field in the contact form.

---

## Adding a new component

1. Create `vue-tests/src/components/MyComponent.vue` — match prod component styling exactly, no overrides
2. Create `vue-tests/src/my-component-mount.js` — find target DOM elements by ID and mount
3. Create `vue-tests/vite.my-component.config.js` — IIFE build config
4. Add build command to `vue-tests/package.json`
5. Add script injection to `layout.js` (if needed on all pages) or directly to specific HTML pages
6. Add mount slot IDs (`id="my-component-target"`) to relevant HTML pages
7. Add component to `gallery-mount.js` with example props
8. Add component entry to this file (`COMPONENTS.md`)
9. Add component card to `components.html`
10. Run `npm run build` in `vue-tests/`

## Updating a component status

When a component is built in prod and added to Storybook:
1. Update `status` in this file to `in-storybook`
2. Add the Storybook URL
3. Update the status badge in `components.html`
4. Add the Storybook link button in `components.html`
