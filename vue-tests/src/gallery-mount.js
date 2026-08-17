import { createApp, h } from 'vue'
import UiButton from './components/UiButton.vue'
import SaveDraft from './components/SaveDraft.vue'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/fi'

import NavUserIcon from './components/NavUserIcon.vue'
import ABrandLogo from './components/ABrandLogo.vue'
import ARegistrationNumberBadge from './components/ARegistrationNumberBadge.vue'
import AMileage from './components/AMileage.vue'
import AuctionInsights from './AuctionInsights.vue'

dayjs.extend(localizedFormat)
dayjs.locale('fi')

function mount(id, component, props) {
  const el = document.getElementById(id)
  if (!el) return
  createApp({ setup: () => () => h(component, props) }).mount(el)
}

// NavUserIcon
mount('gallery-nav-icon-white', NavUserIcon, { color: 'white', size: '24px' })
mount('gallery-nav-icon-blue',  NavUserIcon, { color: '#0B6DFF', size: '24px' })

// ABrandLogo
mount('gallery-logo-default',   ABrandLogo, { width: 107, height: 22 })
mount('gallery-logo-inverted',  ABrandLogo, { inverted: true, width: 107, height: 22 })
mount('gallery-logo-fullwidth', ABrandLogo, { inverted: true, fullWidth: true })

// ARegistrationNumberBadge
mount('gallery-reg-badge-1', ARegistrationNumberBadge, { registrationNumber: 'ABC-123' })
mount('gallery-reg-badge-2', ARegistrationNumberBadge, { registrationNumber: 'XYZ-789' })

// AMileage
mount('gallery-mileage-100k', AMileage, { mileage: 100000 })
mount('gallery-mileage-50k',  AMileage, { mileage: 50000 })
mount('gallery-mileage-8k',   AMileage, { mileage: 8200 })

// SaveDraft
;['collapsed', 'expanded', 'expanded-error', 'submitted'].forEach(function(s) {
  const el = document.getElementById('gallery-sd-' + s)
  if (!el) return
  createApp(SaveDraft, { initialState: s, storageKey: '__gallery__' }).mount(el)
})

// UiButton
function mountBtn(id, props, label) {
  const el = document.getElementById(id)
  if (!el) return
  createApp({
    render() { return h(UiButton, props, { default: () => label }) }
  }).mount(el)
}
mountBtn('gallery-btn-neutral-lg',  { intent: 'neutral', size: 'lg', iconTrailing: 'ph-bold-paper-plane-tilt' }, 'Lähetä')
mountBtn('gallery-btn-default-md',  { variant: 'default', intent: 'default', size: 'md' }, 'Tallenna')
mountBtn('gallery-btn-primary-lg',  { variant: 'primary', intent: 'default', size: 'lg' }, 'Jatka')
mountBtn('gallery-btn-loading',     { intent: 'neutral', size: 'lg', loading: true }, 'Lähetä')

// AuctionInsights
mount('gallery-auction-insights', AuctionInsights, {
  buyers: 7,
  offerCount: 12,
  askingPrice: 18500,
  insightsData: [11000, 13500, 15200, 16800, 17400, 18500, 18500],
  startDate: dayjs('2024-05-15T11:53:00'),
  endDate: dayjs('2024-05-17T03:53:00'),
})
