<template>
    <!-- The outer element is the query container; the grid inside is what the
         query resizes. A container query cannot match the element that declares
         the containment, so these have to be two elements. -->
    <div class="av-stats">
    <div
        class="av-stats-grid grid gap-2 border border-slate-200 rounded-lg divide-x"
        :class="[hasPrice ? 'grid-cols-3' : 'grid-cols-2', hasPrice ? 'av-stats--3' : 'av-stats--2']"
    >
        <div class="flex flex-col p-2.5">
            <span class="text-slate-500 text-xs xs:text-sm text-wrap truncate">
                {{ t('auction.landing.auctions_in_progress.total_bids') }}
            </span>
            <div class="mt-auto w-full flex items-center gap-1.5">
                <UiIcon
                    icon="ph-bold-chart-bar"
                    width="18"
                    height="18"
                    class="text-blue-400 flex-shrink-0"
                />
                <span class="text-slate-800 text-sm xs:text-base font-bold">{{ offers ?? '_' }}</span>
            </div>
        </div>

        <div class="flex flex-col p-2.5">
            <span class="text-slate-500 text-xs xs:text-sm text-wrap truncate">
                {{ t('auction.landing.auctions_in_progress.bidders') }}
            </span>
            <div class="mt-auto w-full flex items-center gap-1.5">
                <UiIcon
                    icon="ph-bold-users-three"
                    width="18"
                    height="18"
                    class="text-blue-400 flex-shrink-0"
                />
                <span class="text-slate-800 text-sm xs:text-base font-bold">{{ bidders ?? '_' }}</span>
            </div>
        </div>

        <!-- B2B only: the price the seller is committed to selling at. Absent
             unless a price is passed, so the consumer auction stays two cells. -->
        <div
            v-if="hasPrice"
            class="flex flex-col p-2.5"
        >
            <span class="text-slate-500 text-xs xs:text-sm text-wrap truncate">
                {{ priceLabel || t('auction.auction_details.reserve_price') }}
            </span>
            <div class="mt-auto w-full flex items-center gap-1.5">
                <UiIcon
                    icon="ph-fill-coins"
                    width="18"
                    height="18"
                    class="text-blue-400 flex-shrink-0"
                />
                <span class="text-slate-800 text-sm xs:text-base font-bold">{{ currency(price) }}</span>
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
@container (max-width: 320px) {
  .av-stats--3 { grid-template-columns: minmax(0, 1fr); }
  .av-stats--3 > * + * { border-left-width: 0; border-top-width: 1px; }
}
@container (max-width: 220px) {
  .av-stats--2 { grid-template-columns: minmax(0, 1fr); }
  .av-stats--2 > * + * { border-left-width: 0; border-top-width: 1px; }
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
    }
})

const hasPrice = computed(() => props.price !== null && props.price !== undefined)
</script>
