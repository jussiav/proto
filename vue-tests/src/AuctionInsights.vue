<template>
    <div>
        <!-- Asking price removal, change 1: the three-column row — bids, buyers
             and the expected price — is replaced by the two-column block the
             offers page already uses, so both pages describe the same figures
             the same way. The asking price leaves with the third column. -->
        <AuctionStats
            :offers="offerCount"
            :bidders="buyers"
        />
        <canvas
            ref="auction-insights-chart"
            class="my-3 py-3 border-y border-slate-200"
        />
        <div class="flex flex-row justify-between text-xs">
            <div>{{ startDate.format('LL') }}</div>
            <div>{{ endDate.format('LL') }}</div>
        </div>
    </div>
</template>

<script setup>
import { shallowRef, useTemplateRef, computed, watch, onMounted, onUnmounted } from 'vue'
import { Chart, CategoryScale, Filler, LineController, LineElement, LinearScale, PointElement } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { currency } from './formatters.js'
import AuctionStats from './components/AuctionStats.vue'
import Dayjs from 'dayjs'


Chart.register([
    CategoryScale,
    ChartDataLabels,
    Filler,
    LineController,
    LineElement,
    LinearScale,
    PointElement
])

const chartElement = useTemplateRef('auction-insights-chart')
const chart = shallowRef()

const props = defineProps({
    buyers: {
        type: Number,
        default: 0
    },

    offerCount: {
        type: Number,
        default: 0
    },


    insightsData: {
        type: Array,
        default: () => []
    },

    startDate: {
        type: Dayjs,
        required: true
    },

    endDate: {
        type: Dayjs,
        required: true
    }
})

const bidsData = computed(() => {
    return [0, ...props.insightsData.length ? props.insightsData : [0]]
})

const options = computed(() => ({
    type: 'line',
    data: {
        labels: bidsData.value,
        datasets: [
            // Asking price removal, change 2: the dashed asking-price line and
            // its left-hand label are gone. One line, the bids.
            {
                label: 'Bids',
                data: bidsData.value,
                stepped: false,
                fill: true,
                tension: 0.05,
                showLine: true,
                pointStyle: false,
                borderColor: '#2890FF',
                backgroundColor: '#EEF6FA',
                datalabels: {
                    display: ({ dataIndex, dataset }) => {
                        return dataIndex === dataset.data.length - 1
                    },
                    align: -135
                }
            }
        ]
    },
    options: {
        layout: {
            padding: {
                top: 30
            }
        },
        scales: {
            y: {
                display: false,
                grid: {
                    display: false
                },
                ticks: {
                    stepSize: Math.max(...bidsData.value)
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: false
            }
        },
        plugins: {
            datalabels: {
                color: 'black',
                backgroundColor: 'white',
                borderColor: 'black',
                borderRadius: 4,
                borderWidth: 1,
                formatter: currency,
                padding: {
                    top: 2,
                    bottom: 2,
                    left: 4,
                    right: 4
                }
            }
        }
    }
}))

watch(
    () => options.value.data,
    (data) => {
        chart.value.data = data
        chart.value.update()
    }
)

onMounted(() => {
    chart.value = new Chart(
        chartElement.value,
        options.value
    )
})

onUnmounted(() => {
    chart.value?.destroy()
})

</script>