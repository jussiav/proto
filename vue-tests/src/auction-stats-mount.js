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

/**
 * `data-cells` carries a JSON array of `{ label, value, icon }` for a host that
 * needs its own cells — Informed decision's result row. Malformed JSON falls
 * back to null, i.e. the component's default cells, so a typo degrades to the
 * ordinary row rather than to an empty frame.
 */
function cells(value) {
  if (!value) return null
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) && parsed.length ? parsed : null
  } catch (e) {
    return null
  }
}

function mountInto(el) {
  if (el.dataset.vueMounted) return
  el.dataset.vueMounted = 'true'

  const state = reactive({
    offers: num(el.dataset.offers),
    bidders: num(el.dataset.bidders),
    /* B2B only, and no prototype surface passes it — the mount reads it so a
       host that does needs no change here. */
    price: num(el.dataset.price),
    cells: cells(el.dataset.cells)
  })

  createApp({
    setup: () => () => h(AuctionStats, {
      offers: state.offers,
      bidders: state.bidders,
      price: state.price,
      cells: state.cells
    })
  }).mount(el)

  /* The host may rewrite the numbers without replacing the node. */
  new MutationObserver(() => {
    state.offers = num(el.dataset.offers)
    state.bidders = num(el.dataset.bidders)
    state.price = num(el.dataset.price)
    state.cells = cells(el.dataset.cells)
  }).observe(el, { attributes: true, attributeFilter: ['data-offers', 'data-bidders', 'data-price', 'data-cells'] })
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
