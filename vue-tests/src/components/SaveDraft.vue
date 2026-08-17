<template>
  <div>
    <!-- collapsed + expanded -->
    <div
      v-if="state !== 'submitted'"
      class="bg-white rounded-2xl p-4 flex flex-col gap-3 md:gap-4"
      :class="{ 'cursor-pointer hover:bg-gray-50': state === 'collapsed' }"
      @click="handleCardClick"
    >
      <div class="flex items-center gap-2 md:gap-3 w-full">
        <UiIcon icon="bookmark-simple-bold" size="28" class="flex-shrink-0 text-amber-500" />
        <p class="font-barlow font-bold text-black text-lg md:text-xl leading-tight flex-1">Jatka myöhemmin?</p>
        <p class="font-dm text-xs md:text-sm text-black flex-shrink-0">Valinnainen</p>
      </div>

      <div v-if="state === 'collapsed'">
        <span class="flex items-center gap-1.5 font-dm font-medium text-base text-slate-700">
          <span>Lähetä linkki itsellesi</span>
          <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 10.9394 9.19032" fill="none" aria-hidden="true">
            <path d="M10.7455 5.06028L6.80805 8.99778C6.68476 9.12106 6.51755 9.19032 6.3432 9.19032C6.16885 9.19032 6.00164 9.12106 5.87836 8.99778C5.75508 8.8745 5.68582 8.70729 5.68582 8.53294C5.68582 8.35859 5.75508 8.19138 5.87836 8.06809L8.69531 5.25223H0.65625C0.482202 5.25223 0.315282 5.18309 0.192211 5.06002C0.0691404 4.93695 0 4.77003 0 4.59598C0 4.42193 0.0691404 4.25501 0.192211 4.13194C0.315282 4.00887 0.482202 3.93973 0.65625 3.93973H8.69531L5.87945 1.12223C5.75617 0.998948 5.68691 0.831738 5.68691 0.657388C5.68691 0.483038 5.75617 0.315829 5.87945 0.192544C6.00274 0.0692602 6.16995 2.59802e-09 6.3443 0C6.51865 -2.59802e-09 6.68586 0.0692602 6.80914 0.192544L10.7466 4.13004C10.8078 4.19109 10.8564 4.26363 10.8894 4.34349C10.9225 4.42335 10.9395 4.50895 10.9394 4.59539C10.9393 4.68183 10.9221 4.76739 10.8888 4.84717C10.8556 4.92695 10.8069 4.99937 10.7455 5.06028Z" fill="#334155"/>
          </svg>
        </span>
      </div>

      <div v-if="state === 'expanded'" @click.stop>
        <div class="flex flex-col gap-3 md:gap-4">
          <p class="font-dm text-base text-black leading-5">Anna sähköpostiosoite johon haluat paluulinkin.</p>
          <div class="flex gap-2 items-stretch sd-input-row">
            <input
              type="email"
              v-model="email"
              placeholder="Sähköpostiosoitteesi"
              class="sd-email-input flex-1 h-14 border border-slate-400 rounded-lg px-4 font-dm text-base text-black outline-none"
              style="min-width:0;"
              @keydown.enter.prevent="submit"
            />
            <UiButton
              intent="neutral"
              size="lg"
              :loading="loading"
              iconTrailing="ph-bold-paper-plane-tilt"
              class="font-dm font-medium flex-shrink-0"
              @click.stop="submit"
            ><span class="sd-send-text">Lähetä</span></UiButton>
          </div>
          <p v-if="showError" class="font-dm text-xs leading-4" style="color:#ef4444;">Tarkista sähköpostiosoite.</p>
          <p class="font-dm text-xs text-black leading-4">Jatkamalla hyväksyt <a href="#" class="underline">käyttöehtomme</a> ja vahvistat lukeneesi <a href="#" class="underline">tietosuojakäytäntömme</a>.</p>
        </div>
      </div>
    </div>

    <!-- submitted -->
    <div v-if="state === 'submitted'" class="bg-white rounded-2xl p-4 flex flex-col gap-3 md:gap-4">
      <div class="flex items-center gap-2 md:gap-3">
        <UiIcon icon="ph-fill-shield-check" size="28" class="flex-shrink-0 text-green-500" />
        <p class="font-barlow font-bold text-black text-lg md:text-xl leading-tight flex-1">Ilmoitus on tallennettu</p>
      </div>
      <p class="font-dm text-base text-black leading-5">Paluulinkin löydät sähköpostistasi.</p>
      <div class="flex items-center justify-between gap-2">
        <p class="font-dm text-base text-black">{{ submittedEmail }}</p>
        <UiButton
          variant="link"
          intent="neutral"
          size="md"
          :loading="resending"
          class="font-dm font-medium min-w-[80px]"
          @click="resend"
        >Lähetä uudelleen</UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import UiButton from './UiButton.vue'
import UiIcon from './UiIcon.vue'

const props = defineProps({
  storageKey: { type: String, default: 'autovex_funnel' },
  onSubmitSuccess: { type: Function, default: null },
  initialState: { type: String, default: null },
  initialEmail: { type: String, default: 'user@example.com' },
})

const state = ref('collapsed')
const email = ref('')
const submittedEmail = ref('')
const showError = ref(false)
const loading = ref(false)
const resending = ref(false)

function readStore() {
  try { return JSON.parse(localStorage.getItem(props.storageKey) || '{}') } catch { return {} }
}
function mergeStore(data) {
  try { localStorage.setItem(props.storageKey, JSON.stringify(Object.assign(readStore(), data))) } catch {}
}

onMounted(() => {
  if (props.initialState) {
    if (props.initialState === 'expanded-error') {
      state.value = 'expanded'
      showError.value = true
    } else if (props.initialState === 'submitted') {
      state.value = 'submitted'
      submittedEmail.value = props.initialEmail
    } else {
      state.value = props.initialState
    }
    return
  }
  const s = readStore()
  if (s.saveDraftState === 'submitted' && s.saveDraftEmail) {
    submittedEmail.value = s.saveDraftEmail
    state.value = 'submitted'
    if (props.onSubmitSuccess) props.onSubmitSuccess(s.saveDraftEmail)
  } else if (s.saveDraftState === 'expanded') {
    state.value = 'expanded'
  }
})

function handleCardClick() {
  if (state.value === 'collapsed') {
    state.value = 'expanded'
    mergeStore({ saveDraftState: 'expanded' })
  }
}

function submit() {
  const val = email.value.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    showError.value = true
    return
  }
  showError.value = false
  loading.value = true
  setTimeout(() => {
    loading.value = false
    submittedEmail.value = val
    state.value = 'submitted'
    mergeStore({ saveDraftState: 'submitted', saveDraftEmail: val })
    if (props.onSubmitSuccess) props.onSubmitSuccess(val)
  }, 1500)
}

function resend() {
  resending.value = true
  setTimeout(() => { resending.value = false }, 1500)
}
</script>

<style>
.sd-input-row { container-type: inline-size; }
@container (max-width: 340px) {
  .sd-send-text { display: none !important; }
  .sd-input-row button { padding-left: 1rem !important; padding-right: 1rem !important; }
}
.sd-email-input { text-overflow: ellipsis; }
</style>
