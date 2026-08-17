/**
 * Delivery-distance stepper (details.html, Variant 2) — the −/+ controls are the real
 * library button, not vanilla HTML: UiButton with variant="secondary" and the production
 * minus/plus icons.
 *
 * Mounts into [data-av-stepper="minus"] / [data-av-stepper="plus"] — used by both
 * details.html (the prototype funnel) and design-specs/delivery-distance.html (the spec's
 * live demo), so the doc and the prototype show the identical component.
 *
 * Exposes a small bridge on window so the host page's stepper logic stays the single source
 * of truth for the value:
 *
 *   window.AVDeliveryStepper.onStep(cb)                 // cb(delta) on each click
 *   window.AVDeliveryStepper.setDisabled({minus, plus}) // reflect bound state
 */
import { createApp, h, ref, computed } from 'vue'
import UiButton from './components/UiButton.vue'

const minusDisabled = ref(true) // empty field on load → nothing to step down from
const plusDisabled = ref(false)
const langTick = ref(0)
const stepHandlers = []

function label(key, fallback) {
  // eslint-disable-next-line no-unused-expressions
  langTick.value // re-evaluate when the page language changes
  return typeof window.t === 'function' ? window.t(key) : fallback
}

function emitStep(delta) {
  stepHandlers.forEach(cb => cb(delta))
}

/**
 * Icon-only secondary button, straight from the component's own API:
 *   iconOnly → drops the leading-icon offset and squares the button (w-14 at size lg)
 *   size lg  → h-14, matching the km field beside it
 * `type="button"` is required because the funnel step is a <form> and the component leaves
 * the button's type to the consumer — production does the same at every call site.
 */
function stepperButton({ icon, delta, disabled, ariaKey, ariaFallback }) {
  return h(
    UiButton,
    {
      type: 'button',
      variant: 'secondary',
      size: 'lg',
      iconOnly: true,
      icon,
      disabled: disabled.value,
      'aria-label': label(ariaKey, ariaFallback),
      onClick: () => { if (!disabled.value) emitStep(delta) }
    }
  )
}

function mount(slot, render) {
  const el = document.querySelector(`[data-av-stepper="${slot}"]`)
  if (!el) return false
  createApp({ setup: () => render }).mount(el)
  return true
}

const mountedMinus = mount('minus', () =>
  stepperButton({
    icon: 'minus-new',
    delta: -50,
    disabled: minusDisabled,
    ariaKey: 'details.deliveryStepMinus',
    ariaFallback: 'Vähennä 50 km'
  })
)

const mountedPlus = mount('plus', () =>
  stepperButton({
    icon: 'plus-new',
    delta: 50,
    disabled: plusDisabled,
    ariaKey: 'details.deliveryStepPlus',
    ariaFallback: 'Lisää 50 km'
  })
)

if (mountedMinus || mountedPlus) {
  window.AVDeliveryStepper = {
    onStep(cb) { stepHandlers.push(cb) },
    setDisabled({ minus, plus }) {
      if (minus !== undefined) minusDisabled.value = !!minus
      if (plus !== undefined) plusDisabled.value = !!plus
    }
  }

  // Keep the aria-labels in sync when the footer language selector switches language
  // without a reload (i18n.js exposes setLang globally).
  if (typeof window.setLang === 'function' && !window.setLang.__avStepperPatched) {
    const original = window.setLang
    window.setLang = function patchedSetLang(lang) {
      const result = original.apply(this, arguments)
      langTick.value++
      return result
    }
    window.setLang.__avStepperPatched = true
  }
}
