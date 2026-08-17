import { createApp, h } from 'vue'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/fi'
import AuctionInsights from './AuctionInsights.vue'

dayjs.extend(localizedFormat)
dayjs.locale('fi')

const el = document.getElementById('auction-insights')
if (el) {
  const props = {
    buyers: Number(el.dataset.buyers ?? 3),
    offerCount: Number(el.dataset.offerCount ?? 5),
    askingPrice: Number(el.dataset.askingPrice ?? 12400),
    insightsData: JSON.parse(el.dataset.insightsData ?? '[8000,9200,10500,11800,12400]'),
    startDate: dayjs(el.dataset.startDate ?? '2024-05-15T11:53:00'),
    endDate: dayjs(el.dataset.endDate ?? '2024-05-17T03:53:00'),
  }
  createApp({ render: () => h(AuctionInsights, props) }).mount(el)
}
