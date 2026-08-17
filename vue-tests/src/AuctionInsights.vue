<template>
    <div>
        <dl class="flex flex-row divide-x divide-slate-200 text-center">
            <div class="flex-auto flex flex-col">
                <dt class="order-1 text-xs">
                    {{ t('auction.auction_details.bids', offerCount) }}
                </dt>
                <dd class="font-bold">
                    {{ offerCount }}
                </dd>
            </div>
            <div class="flex-auto flex flex-col">
                <dt class="order-1 text-xs">
                    {{ t('auction.auction_details.buyers', buyers) }}
                </dt>
                <dd class="font-bold">
                    {{ buyers }}
                </dd>
            </div>
            <div class="flex-auto flex flex-col">
                <dt class="order-1 text-xs">
                    {{ t('auction.auction_details.expected_price') }}
                </dt>
                <dd class="font-bold">
                    {{ currency(askingPrice) }}
                </dd>
            </div>
        </dl>
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
import { t, currency } from './formatters.js'
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

    askingPrice: {
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
            {
                label: 'Asking price',
                data: bidsData.value.map(() => props.askingPrice),
                pointStyle: false,
                borderColor: '#0B6DFF',
                borderDash: [5,5],
                datalabels: {
                    display: ({ dataIndex }) => {
                        return dataIndex === 0
                    },
                    align: -45
                }
            },
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
                    stepSize: Math.max(...bidsData.value, props.askingPrice)
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