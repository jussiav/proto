import { computed, useAttrs } from 'vue'
import { cn } from '../lib/utils.js'

export default function useClassMerging(rootClass) {
  const attrs = useAttrs()
  const getStringValue = v => typeof v.value !== 'undefined' ? String(v.value) : String(v)

  const mergedClass = computed(() => cn(getStringValue(rootClass), attrs.class))

  const nonClassAttrs = computed(() => {
    const { class: _, ...rest } = attrs
    return rest
  })

  return { mergedClass, nonClassAttrs }
}
