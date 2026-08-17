import { createApp, ref, h } from 'vue'
import UiButton from './components/UiButton.vue'

document.addEventListener('DOMContentLoaded', function () {
  const el = document.getElementById('sd-send-btn')
  if (!el) return

  const loading = ref(false)

  window.SdSendButton = {
    setLoading: function (val) { loading.value = val }
  }

  const wrapper = document.createElement('span')
  wrapper.style.display = 'contents'
  wrapper.id = el.id
  el.replaceWith(wrapper)

  createApp({
    setup () {
      function handleClick (e) {
        e.stopPropagation()
        if (typeof window.sdSubmit === 'function') window.sdSubmit(e)
      }
      return { loading, handleClick }
    },
    render () {
      return h(UiButton, {
        intent: 'neutral',
        size: 'lg',
        loading: this.loading,
        iconTrailing: 'ph-bold-paper-plane-tilt',
        class: 'font-dm font-medium flex-shrink-0',
        onClick: this.handleClick
      }, {
        default: () => h('span', { class: 'sd-send-text hidden md:inline' }, 'Lähetä')
      })
    }
  }).mount(wrapper)
})
