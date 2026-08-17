import { createApp } from 'vue'
import SaveDraft from './components/SaveDraft.vue'

const el = document.getElementById('save-draft-target')
if (el) {
  const callbacks = window.SdCallbacks || {}
  const storageKey = el.dataset.storageKey || 'autovex_funnel'
  createApp(SaveDraft, {
    storageKey,
    onSubmitSuccess: callbacks.onSubmitSuccess || null,
  }).mount(el)
}
