<template>
  <div
    class="flex rounded-md bg-white"
    role="text"
    :aria-label="`Rekisterinumero ${registrationNumber}`"
  >
    <div class="w-2 h-auto bg-av-blue rounded-l-md" />
    <div class="py-1 px-1.5 border border-l-0 rounded-r-md border-slate-200 font-dm text-sm text-slate-800 whitespace-nowrap">
      {{ registrationNumber }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  registrationNumber: { type: String, required: true },
})
</script>
