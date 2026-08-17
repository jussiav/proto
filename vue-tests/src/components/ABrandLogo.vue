<template>
  <img
    :src="src"
    :width="fullWidth ? undefined : width"
    :height="fullWidth ? undefined : height"
    :alt="alt"
    :style="inverted ? 'filter:brightness(0) invert(1)' : undefined"
    :class="['inline-block pointer-events-none flex-shrink-0 object-contain', fullWidth && 'w-full h-auto block']"
  />
</template>

<script setup>
defineProps({
  src:       { type: String,  default: 'assets/logo-blue.svg' },
  inverted:  { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
  width:     { type: Number,  default: 107 },
  height:    { type: Number,  default: 22 },
  alt:       { type: String,  default: 'AutoVex' },
})
</script>
