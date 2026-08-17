<template>
  <component
    :is="buttonTag"
    v-bind="nonClassAttrs"
    :class="mergedClass"
    :disabled="disabled"
  >
    <Spinner v-if="loading" class="inline absolute" />
    <span class="inline-flex items-center justify-center" :class="{ 'invisible': loading }">
      <UiIcon
        v-if="icon"
        class="inline-flex"
        :class="{ 'pr-1 transform -translate-x-1': !iconOnly }"
        :height="iconSize"
        :width="iconSize"
        :icon="icon"
      />
      <slot />
      <UiIcon
        v-if="iconTrailing"
        class="inline-flex"
        :class="{ 'pl-1 transform translate-x-1': !iconOnly }"
        :height="iconSize"
        :width="iconSize"
        :icon="iconTrailing"
      />
    </span>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import Spinner from './Spinner.vue'
import { cva } from 'class-variance-authority'
import UiIcon from './UiIcon.vue'
import { spriteExists } from '../utils/iconRegistry.js'
import { AUTOVEX_INTENTS } from '../utils/constants.js'
import useClassMerging from '../composables/useClassMerging.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  tag: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'a'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'primary', 'secondary', 'ghost', 'link'].includes(value)
  },
  intent: {
    type: String,
    default: 'default',
    validator: (value) => Object.values(AUTOVEX_INTENTS).includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'fw'].includes(value)
  },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  iconOnly: { type: Boolean, default: false },
  icon: {
    type: String,
    default: null,
    validator: value => value === '' || spriteExists(value)
  },
  iconTrailing: {
    type: String,
    default: null,
    validator: value => value === '' || spriteExists(value)
  }
})

const iconSize = computed(() => {
  const sizes = { lg: '1.5em', md: '1.2em', sm: '1em' }
  return sizes[props.size] || '1em'
})

const buttonCva = cva(['inline-flex', 'justify-center', 'items-center', 'transition', 'cursor-pointer', 'outline-offset-2', 'py-1.5', 'px-2', 'text-base', 'leading-tight', 'rounded-lg', 'relative'], {
  variants: {
    variant: {
      default: ['border', 'bg-white'],
      primary: 'shadow-[inset_0px_1px_2px_1px_rgba(255,255,255,0.20)]',
      secondary: 'shadow-[inset_0px_1px_2px_1px_rgba(255,255,255,0.25)]',
      ghost: ['border-none'],
      link: ['bg-transparent', 'border-none', '!p-0', '!h-auto', 'rounded-none', 'shadow-none', 'hover:underline'],
    },
    intent: {
      default: '',
      success: '',
      destructive: '',
      neutral: '',
      primary: '',
      contrast: ''
    },
    size: {
      sm: ['text-sm', 'px-3.5', 'h-8'],
      md: ['text-sm', 'px-5', 'h-10'],
      lg: ['px-8', 'h-14'],
      fw: ['px-8', 'h-14', 'w-full']
    },
    iconOnly: {
      false: null,
      true: null
    },
    loading: {
      false: null,
      true: ['pointer-events-none', 'cursor-not-allowed']
    },
    disabled: {
      false: null,
      true: ['pointer-events-none', 'cursor-not-allowed']
    }
  },
  compoundVariants: [
    // Icon-only buttons are square: width matches the size's own height.
    // `px-0` is a deliberate divergence from prod, which sets the widths but not the padding.
    // At sm (28px padding < w-8) and md (40px = w-10) that happens to still render square, but
    // at lg the size's px-8 (64px) overflows w-14 (56px) and the button comes out 64×56.
    // twMerge resolves px-8 → px-0 because compoundVariants are emitted after variants.
    // Remove this line once the library itself is fixed. See COMPONENTS.md.
    { iconOnly: true, class: ['px-0'] },
    { iconOnly: true, size: 'sm', class: ['w-8'] },
    { iconOnly: true, size: 'md', class: ['w-10'] },
    { iconOnly: true, size: 'lg', class: ['w-14'] },
    { intent: 'default', variant: 'default', class: ['border-blue-400', 'hover:border-slate-400', 'hover:bg-blue-50', 'active:bg-blue-100', 'text-blue-600', 'active:text-blue-500'] },
    { intent: 'default', variant: 'primary', class: ['bg-blue-600', 'hover:bg-blue-700', 'active:bg-blue-800', 'text-white', 'active:text-blue-100'] },
    { intent: 'default', variant: 'secondary', class: ['bg-blue-100', 'hover:bg-blue-200', 'active:bg-blue-300', 'text-blue-800', 'active:text-blue-700'] },
    { intent: 'default', variant: 'ghost', class: ['bg-transparent', 'hover:bg-blue-50', 'active:bg-blue-100', 'text-blue-600', 'active:text-blue-500'] },
    { intent: 'default', variant: 'link', class: ['text-blue-600'] },
    { intent: 'neutral', variant: 'default', class: ['border-slate-400', 'hover:bg-gray-100', 'active:bg-slate-200', 'text-slate-700', 'hover:text-slate-800', 'active:text-slate-600'] },
    { intent: 'neutral', variant: 'primary', class: ['bg-slate-500', 'hover:bg-slate-600', 'active:bg-slate-700', 'text-white'] },
    { intent: 'neutral', variant: 'secondary', class: ['bg-slate-200', 'hover:bg-slate-300', 'active:bg-slate-400', 'text-slate-700', 'hover:text-slate-800', 'active:text-slate-600'] },
    { intent: 'neutral', variant: 'ghost', class: ['bg-transparent', 'hover:bg-slate-100', 'active:bg-slate-200', 'text-slate-700', 'hover:text-slate-800', 'active:text-slate-600'] },
    { intent: 'neutral', variant: 'link', class: ['text-slate-700'] },
    { intent: 'success', variant: 'default', class: ['border-lime-400', 'hover:bg-lime-50', 'active:bg-lime-50', 'text-lime-700', 'active:text-lime-600'] },
    { intent: 'success', variant: 'primary', class: ['bg-lime-400', 'hover:bg-lime-500', 'active:bg-lime-600', 'text-lime-900', 'active:text-lime-950'] },
    { intent: 'success', variant: 'secondary', class: ['bg-lime-200', 'hover:bg-lime-300', 'active:bg-lime-400', 'text-lime-700'] },
    { intent: 'success', variant: 'ghost', class: ['bg-transparent', 'hover:bg-lime-50', 'active:bg-lime-50', 'text-lime-700', 'active:text-lime-600'] },
    { intent: 'success', variant: 'link', class: ['text-lime-700', 'active:text-lime-600'] },
    { intent: 'destructive', variant: 'default', class: ['border-red-400', 'hover:bg-red-50', 'active:bg-red-50', 'text-red-700', 'active:text-red-600'] },
    { intent: 'destructive', variant: 'primary', class: ['bg-red-500', 'hover:bg-red-600', 'active:bg-red-700', 'text-white'] },
    { intent: 'destructive', variant: 'secondary', class: ['bg-red-200', 'hover:bg-red-300', 'active:bg-red-400', 'text-red-700', 'active:text-red-800'] },
    { intent: 'destructive', variant: 'ghost', class: ['bg-transparent', 'hover:bg-red-50', 'active:bg-red-50', 'text-red-600', 'active:text-red-500'] },
    { intent: 'destructive', variant: 'link', class: ['text-red-600', 'active:text-red-500'] },
    { variant: ['primary', 'secondary'], disabled: true, class: ['!text-slate-300', 'bg-slate-200', 'hover:bg-slate-200', 'active:bg-slate-200'] },
    { variant: 'default', disabled: true, class: ['!text-slate-300', 'border-slate-200'] },
    { variant: 'ghost', disabled: true, class: ['!text-slate-300'] },
    { variant: 'link', disabled: true, class: ['!text-slate-300'] },
    { variant: ['primary', 'secondary'], loading: true, class: ['!text-slate-300', 'bg-slate-200'] },
    { variant: 'default', loading: true, class: ['!text-slate-300', 'border-slate-200'] },
    { variant: 'ghost', loading: true, class: ['!text-slate-300'] },
    { variant: 'link', loading: true, class: ['!text-slate-300'] },
    { variant: 'link', size: 'md', class: ['text-base'] }
  ],
  defaultVariants: {
    intent: 'default',
    variant: 'default',
    disabled: false,
    size: 'md'
  }
})

const buttonClasses = computed(() => buttonCva({
  variant: props.variant,
  intent: props.intent,
  size: props.size,
  iconOnly: props.iconOnly,
  loading: props.loading,
  disabled: props.disabled
}))

const { mergedClass, nonClassAttrs } = useClassMerging(buttonClasses)
const buttonTag = computed(() => props.tag)
</script>
