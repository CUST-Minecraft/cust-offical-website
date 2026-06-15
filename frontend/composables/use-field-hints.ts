import type { ContentFieldHint } from '~/utils/field-hints'

export interface FieldHintTarget {
  element: HTMLElement
  hint: ContentFieldHint
}

const enabled = ref(false)
const activeTarget = shallowRef<FieldHintTarget | null>(null)
const pinnedTarget = shallowRef<FieldHintTarget | null>(null)

function isRuntimeFlagEnabled(value: unknown) {
  return value === true || value === 'true' || value === '1'
}

export function useFieldHints() {
  const runtimeConfig = useRuntimeConfig()
  const isAllowed = computed(() => import.meta.dev || isRuntimeFlagEnabled(runtimeConfig.public.fieldHintsEnabled))
  const currentTarget = computed(() => pinnedTarget.value ?? activeTarget.value)

  function setActive(element: HTMLElement, hint: ContentFieldHint) {
    if (!isAllowed.value || !enabled.value || pinnedTarget.value) {
      return
    }

    activeTarget.value = { element, hint }
  }

  function clearActive(element?: HTMLElement) {
    if (element && activeTarget.value?.element !== element) {
      return
    }

    activeTarget.value = null
  }

  function pin(element: HTMLElement, hint: ContentFieldHint) {
    if (!isAllowed.value || !enabled.value) {
      return
    }

    pinnedTarget.value = { element, hint }
    activeTarget.value = null
  }

  function clearPinned() {
    pinnedTarget.value = null
  }

  function enable() {
    if (!isAllowed.value) {
      return
    }

    enabled.value = true
  }

  function disable() {
    enabled.value = false
    activeTarget.value = null
    pinnedTarget.value = null
  }

  function toggle() {
    if (enabled.value) {
      disable()
      return
    }

    enable()
  }

  return {
    activeTarget: readonly(activeTarget),
    clearActive,
    clearPinned,
    currentTarget,
    disable,
    enable,
    enabled,
    isAllowed,
    pin,
    pinnedTarget: readonly(pinnedTarget),
    setActive,
    toggle
  }
}
