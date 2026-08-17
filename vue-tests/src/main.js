import { createApp, h } from 'vue'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/fi'
import AuctionInsights from './AuctionInsights.vue'

dayjs.extend(localizedFormat)
dayjs.locale('fi')

createApp({
  render() {
    return h(AuctionInsights, {
      buyers: 3,
      offerCount: 5,
      askingPrice: 12400,
      insightsData: [8000, 9200, 10500, 11800, 12400],
      startDate: dayjs('2024-05-15T11:53:00'),
      endDate: dayjs('2024-05-17T03:53:00'),
    })
  }
}).mount('#app')
