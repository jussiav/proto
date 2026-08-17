import { createApp, h, ref } from 'vue'
import AMileage from './components/AMileage.vue'

function parseKm(text) {
  return parseInt(String(text).replace(/[^0-9]/g, '')) || 0
}

function mountMileage(containerId, initialKm) {
  const container = document.getElementById(containerId)
  if (!container) return null

  const mileage = ref(initialKm)

  container.style.display = 'none'
  const mount = document.createElement('span')
  mount.style.display = 'contents'
  container.parentNode.insertBefore(mount, container)

  createApp({
    setup: () => () => h(AMileage, { mileage: mileage.value })
  }).mount(mount)

  return mileage
}

// details.html — km from URL param (formatted string, e.g. "100 000")
const params = new URLSearchParams(window.location.search)
mountMileage('km-display', parseKm(params.get('km') || '100000'))

// index.html — km set dynamically by form JS via progress-km span
const progressKmRef = mountMileage('progress-km-display', 0)
if (progressKmRef) {
  const span = document.getElementById('progress-km')
  if (span) {
    if (span.textContent) progressKmRef.value = parseKm(span.textContent)
    new MutationObserver(() => {
      progressKmRef.value = parseKm(span.textContent)
    }).observe(span, { childList: true, characterData: true, subtree: true })
  }
}
