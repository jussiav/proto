import { createApp, h, ref } from 'vue'
import ARegistrationNumberBadge from './components/ARegistrationNumberBadge.vue'

function mountBadge(containerId, initialValue) {
  const container = document.getElementById(containerId)
  if (!container) return null

  const registrationNumber = ref(initialValue || '')

  container.style.display = 'none'
  const mount = document.createElement('span')
  mount.style.display = 'contents'
  container.parentNode.insertBefore(mount, container)

  createApp({
    setup: () => () => h(ARegistrationNumberBadge, { registrationNumber: registrationNumber.value })
  }).mount(mount)

  return registrationNumber
}

// details.html — read plate from URL param
const params = new URLSearchParams(window.location.search)
mountBadge('plate-badge', (params.get('plate') || 'BOT-423').toUpperCase())

// index.html — plate set dynamically by form JS; observe the hidden span
const progressRef = mountBadge('progress-plate-badge', '')
if (progressRef) {
  const span = document.getElementById('progress-plate')
  if (span) {
    if (span.textContent) progressRef.value = span.textContent
    new MutationObserver(() => {
      progressRef.value = span.textContent
    }).observe(span, { childList: true, characterData: true, subtree: true })
  }
}

// success.html — badge injected by vehicle-card.js into #av-vehicle-card; re-mounts on each render
function mountVehicleCardBadge() {
  const container = document.getElementById('vehicle-card-plate-badge')
  if (!container || container.dataset.vueMounted) return
  container.dataset.vueMounted = '1'
  const plate = container.querySelector('span')?.textContent?.trim() || ''
  container.style.display = 'none'
  const mount = document.createElement('span')
  mount.style.display = 'contents'
  container.parentNode.insertBefore(mount, container)
  createApp({
    setup: () => () => h(ARegistrationNumberBadge, { registrationNumber: plate })
  }).mount(mount)
}

const vehicleCardEl = document.getElementById('av-vehicle-card')
if (vehicleCardEl) {
  mountVehicleCardBadge()
  new MutationObserver(mountVehicleCardBadge).observe(vehicleCardEl, { childList: true, subtree: true })
}
