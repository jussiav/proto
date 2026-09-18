<template>
    <!-- The outer element is the query container; the grid inside is what the
         query resizes. A container query cannot match the element that declares
         the containment, so these have to be two elements. -->
    <div class="av-stats">
    <div
        class="av-stats-grid grid gap-2 border border-slate-200 rounded-lg divide-x"
        :class="[gridCols, stackClass]"
    >
        <div
            v-for="(cell, i) in resolvedCells"
            :key="i"
            class="flex flex-col p-2.5"
        >
            <span class="text-slate-500 text-xs xs:text-sm text-wrap truncate">
                {{ cell.label }}
            </span>
            <div class="mt-auto w-full flex items-center gap-1.5">
                <UiIcon
                    :icon="cell.icon"
                    width="18"
                    height="18"
                    class="text-blue-400 flex-shrink-0"
                />
                <span class="text-slate-800 text-sm xs:text-base font-bold">{{ cell.value }}</span>
            </div>
        </div>
    </div>
    </div>
</template>

<script setup>
/**
 * The figures an auction is described by, in the frame the offers page has
 * always used: a bordered, divided row of cells, label on top, icon and value
 * beneath it.
 *
 * Extracted from `Timer.vue`, which is where the two-cell version lives in
 * production — inside a card that also draws the progress bar, the end date and
 * the registration badge. Pulled out so the decision page can show the same
 * figures the same way instead of its own three-column row.
 *
 * The third cell is the B2B seller's reserve price. Production already
 * parameterises that column on `AuctionInsights` — `B2BDecision.vue` passes
 * `priceLabel` and the same `asking_price` the consumer page passes, so only the
 * word differs — and this keeps it available: pass `price` and the cell appears,
 * omit it and the consumer auction stays two cells. It is not the consumer's
 * expected price, which the Asking price removal initiative takes away.
 *
 * `offers` and `bidders` accept null and render `_`, which is what the offers
 * page does before the auction has any figures to show.
 */
import { computed } from 'vue'
import { t, currency } from '../formatters.js'
import UiIcon from './UiIcon.vue'

/**
 * Stacking rule, as a CONTAINER query rather than a media query: the same
 * viewport gives this component very different widths depending on who hosts it
 * — a page's white card, a gallery panel, a sidebar — so the viewport cannot
 * answer "does the row still fit". A cell needs roughly 100px (10px padding
 * either side, an 18px icon, a 6px gap, and the value), so three cells stack
 * below 320px and two below 220px, and the dividing rule turns from vertical to
 * horizontal with them.
 *
 * Injected once from here rather than written as an SFC <style> block: each of
 * this project's Vite lib configs emits its own `dist/style.css` into one
 * directory, so they overwrite each other. Owning the rule here keeps it with
 * the component whichever path mounts it — the gallery imports the component
 * directly, the pages go through the mount bundle.
 */
const STYLE_ID = 'auction-stats-css'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
.av-stats { container-type: inline-size; }

/* Stacked: one column, cells flush, and the divider turns horizontal.
   The selector has to out-specify Tailwind's own divide-x rule
   (.divide-x > :not([hidden]) ~ :not([hidden]), three classes' worth) or its
   border-left-width calc survives - which drew a vertical rule AND a
   horizontal one, and shifted every cell after the first 1px to the right.
   Matching its shape and adding the grid's two classes wins on specificity
   without !important.

   The row gap goes to 0 as well: 8px is right between side-by-side cells, but
   stacked it detached each row from the frame and from its own divider. */
.av-stats-grid.av-stats--3,
.av-stats-grid.av-stats--2 { row-gap: 0; }

@container (max-width: 320px) {
  .av-stats-grid.av-stats--3 { grid-template-columns: minmax(0, 1fr); }
  .av-stats-grid.av-stats--3 > :not([hidden]) ~ :not([hidden]) {
    border-left-width: 0;
    border-top-width: 1px;
  }
}
@container (max-width: 220px) {
  .av-stats-grid.av-stats--2 { grid-template-columns: minmax(0, 1fr); }
  .av-stats-grid.av-stats--2 > :not([hidden]) ~ :not([hidden]) {
    border-left-width: 0;
    border-top-width: 1px;
  }
}`
    document.head.appendChild(style)
}

const props = defineProps({
    offers: {
        type: Number,
        default: null
    },

    bidders: {
        type: Number,
        default: null
    },

    /** B2B reserve price, in euros. Null hides the cell entirely. */
    price: {
        type: Number,
        default: null
    },

    /** Overrides the cell's label; defaults to production's `reserve_price`. */
    priceLabel: {
        type: String,
        default: ''
    },

    /**
     * Replaces the default cells entirely: `[{ label, value, icon }]`, rendered
     * in the order given. Omit it and the component is exactly what it was —
     * prod's bids/bidders row plus the optional B2B price — so the offers page
     * and Asking price removal are untouched by this existing.
     *
     * It exists because Informed decision's block reports an auction's RESULT
     * rather than an auction in progress: dealerships, then bids, then the
     * winning price, with its own labels. That is the same frame with different
     * content, not a second component — and passing content beats bolting on a
     * label override per cell plus a flag to reverse the order.
     *
     * Values are pre-formatted by the caller; the component does not know what
     * a cell means, only how to draw one.
     */
    cells: {
        type: Array,
        default: null
    }
})

const hasPrice = computed(() => props.price !== null && props.price !== undefined)

const resolvedCells = computed(() => {
    if (props.cells && props.cells.length) return props.cells

    const out = [
        {
            label: t('auction.landing.auctions_in_progress.total_bids'),
            value: props.offers ?? '_',
            icon: 'ph-bold-chart-bar'
        },
        {
            label: t('auction.landing.auctions_in_progress.bidders'),
            value: props.bidders ?? '_',
            icon: 'ph-bold-users-three'
        }
    ]
    if (hasPrice.value) {
        out.push({
            label: props.priceLabel || t('auction.auction_details.reserve_price'),
            value: currency(props.price),
            icon: 'ph-fill-coins'
        })
    }
    return out
})

/* The container query keys off these, so they follow the rendered count rather
   than `hasPrice` — a three-cell row stacks below 320px whichever way it was
   populated. */
const gridCols = computed(() => (resolvedCells.value.length === 3 ? 'grid-cols-3' : 'grid-cols-2'))
const stackClass = computed(() => (resolvedCells.value.length === 3 ? 'av-stats--3' : 'av-stats--2'))
</script>
