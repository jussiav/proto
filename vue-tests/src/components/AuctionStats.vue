<template>
    <div class="grid grid-cols-2 gap-2 border border-slate-200 rounded-lg divide-x">
        <div class="flex flex-col p-2.5">
            <span class="text-slate-500 text-xs xs:text-sm text-wrap truncate">
                {{ t('auction.landing.auctions_in_progress.total_bids') }}
            </span>
            <div class="mt-auto w-full flex justify-between items-baseline">
                <span class="text-slate-800 text-sm xs:text-base">{{ offers ?? '_' }}</span>
                <UiIcon
                    icon="ph-bold-chart-bar"
                    width="18"
                    height="18"
                    class="text-blue-400 mt-1"
                />
            </div>
        </div>

        <div class="flex flex-col p-2.5">
            <span class="text-slate-500 text-xs xs:text-sm text-wrap truncate">
                {{ t('auction.landing.auctions_in_progress.bidders') }}
            </span>
            <div class="mt-auto w-full flex justify-between items-baseline">
                <span class="text-slate-800 text-sm xs:text-base">{{ bidders ?? '_' }}</span>
                <UiIcon
                    icon="ph-bold-users-three"
                    width="18"
                    height="18"
                    class="text-blue-400 mt-1"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * The two figures an auction is described by, in the frame the offers page has
 * always used: a bordered, divided pair of cells, label on top, value bottom
 * left, icon bottom right.
 *
 * Extracted from `Timer.vue`, which is where this markup lives in production —
 * inside a card that also draws the progress bar, the end date and the
 * registration badge. Pulled out so the decision page can show the same two
 * numbers the same way instead of its own three-column row.
 *
 * Both values accept null and render `_`, which is what the offers page does
 * before the auction has any figures to show.
 */
import { t } from '../formatters.js'
import UiIcon from './UiIcon.vue'

defineProps({
    offers: {
        type: Number,
        default: null
    },

    bidders: {
        type: Number,
        default: null
    }
})
</script>
