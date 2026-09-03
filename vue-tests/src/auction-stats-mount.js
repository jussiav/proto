import { createApp, h, reactive } from 'vue'
import AuctionStats from './components/AuctionStats.vue'

/**
 * Mounts AuctionStats into any `[data-auction-stats]` element on the page.
 *
 * Both consumers rebuild their surroundings with JS after load — the offers page
 * when its scenario resolves, the decision page on every re-render — so this
 * watches for new mount points rather than running once. `dataset.vueMounted`
 * is the guard that keeps a re-render from stacking apps on the same node.
 *
 * Figures come from data attributes, and an absent or non-numeric one stays
 * null so the component renders its own `_` placeholder.
 */
function num(value) {
  if (value === undefined || value === null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function mountInto(el) {
  if (el.dataset.vueMounted) return
  el.dataset.vueMounted = 'true'

  const state = reactive({
    offers: num(el.dataset.offers),
    bidders: num(el.dataset.bidders)
  })

  createApp({
    setup: () => () => h(AuctionStats, { offers: state.offers, bidders: state.bidders })
  }).mount(el)

  /* The host may rewrite the numbers without replacing the node. */
  new MutationObserver(() => {
    state.offers = num(el.dataset.offers)
    state.bidders = num(el.dataset.bidders)
  }).observe(el, { attributes: true, attributeFilter: ['data-offers', 'data-bidders'] })
}

function scan(root) {
  const scope = root && root.querySelectorAll ? root : document
  scope.querySelectorAll('[data-auction-stats]').forEach(mountInto)
}

scan(document)
new MutationObserver(records => {
  records.forEach(r => r.addedNodes.forEach(node => {
    if (node.nodeType !== 1) return
    if (node.matches && node.matches('[data-auction-stats]')) mountInto(node)
    scan(node)
  }))
}).observe(document.body, { childList: true, subtree: true })
