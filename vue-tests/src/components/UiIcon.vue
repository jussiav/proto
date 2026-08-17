<template>
  <svg
    v-bind="nonClassAttrs"
    :class="mergedClass"
    :width="size ?? width"
    :height="size ?? height"
    :viewBox="iconViewBox"
    role="img"
    aria-hidden="true"
    fill="currentColor"
  >
    <path v-if="iconPath" :d="iconPath" />
    <use v-else :href="href" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { getSpriteUrl, spriteExists, iconPaths, iconViewBoxes } from '../utils/iconRegistry.js'
import { AUTOVEX_INTENTS } from '../utils/constants.js'
import useClassMerging from '../composables/useClassMerging.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  icon: {
    type: String,
    required: true,
    validator: value => value === '' || spriteExists(value)
  },
  width: { type: String, default: '1em' },
  height: { type: String, default: '1em' },
  size: { type: String, default: null },
  intent: {
    type: String,
    default: 'default',
    validator: value => Object.values(AUTOVEX_INTENTS).includes(value)
  }
})

const iconVariants = cva(['fill-current'], {
  variants: {
    intent: {
      default: '',
      primary: 'text-blue',
      contrast: 'text-white',
      success: 'text-green-600',
      destructive: 'text-destructive'
    }
  }
})

const iconVariantClass = computed(() => iconVariants({ intent: props.intent }))
const href = computed(() => getSpriteUrl(props.icon))
const iconPath = computed(() => iconPaths[props.icon] || null)
const iconViewBox = computed(() => iconViewBoxes[props.icon] || '0 0 256 256')

const { mergedClass, nonClassAttrs } = useClassMerging(iconVariantClass)
</script>
