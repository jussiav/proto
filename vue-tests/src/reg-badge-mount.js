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

// NOTE: the car card used to expose #vehicle-card-plate-badge for this bundle to
// take over. It no longer does — buildCarCard() in vehicle-card.js renders the
// badge itself via buildRegBadge(), which mirrors ARegistrationNumberBadge.vue
// including bg-white and the a11y attributes. Mounting Vue into that card was
// fragile anyway: the card is re-rendered wholesale on every state change, so
// the MutationObserver had to re-mount each time. Keep buildRegBadge in sync
// with ARegistrationNumberBadge.vue.
