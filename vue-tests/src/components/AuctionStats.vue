<template>
    <div
        class="grid gap-2 border border-slate-200 rounded-lg divide-x"
        :class="hasPrice ? 'grid-cols-3' : 'grid-cols-2'"
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
