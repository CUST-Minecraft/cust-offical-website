import type { DirectiveBinding } from 'vue'
import type { ContentFieldHint } from '~/utils/field-hints'

const hintByElement = new WeakMap<HTMLElement, ContentFieldHint>()
const cleanupByElement = new WeakMap<HTMLElement, () => void>()

function hasFieldHint(value: unknown): value is ContentFieldHint {
  if (!value || typeof value !== 'object') {
    return false
  }

  const hint = value as ContentFieldHint
  return Boolean(hint.modelLabel && hint.model && hint.field && hint.usage)
}

export default defineNuxtPlugin((nuxtApp) => {
  const fieldHints = useFieldHints()

  nuxtApp.vueApp.directive('field-hint', {
    getSSRProps() {
      return {}
    },
    mounted(element: HTMLElement, binding: DirectiveBinding<ContentFieldHint | undefined>) {
      if (import.meta.server) {
        return
      }

      if (!fieldHints.isAllowed.value || !hasFieldHint(binding.value)) {
        return
      }

      hintByElement.set(element, binding.value)
      element.dataset.fieldHint = 'true'

      const handleEnter = () => {
        const hint = hintByElement.get(element)

        if (hint) {
          fieldHints.setActive(element, hint)
        }
      }

      const handleLeave = () => {
        fieldHints.clearActive(element)
      }

      const handleFocus = () => {
        const hint = hintByElement.get(element)

        if (hint) {
          fieldHints.setActive(element, hint)
        }
      }

      const handleClick = (event: MouseEvent) => {
        if (!fieldHints.enabled.value) {
          return
        }

        const hint = hintByElement.get(element)

        if (!hint) {
          return
        }

        event.preventDefault()
        event.stopPropagation()
        fieldHints.pin(element, hint)
      }

      element.addEventListener('mouseenter', handleEnter)
      element.addEventListener('mouseleave', handleLeave)
      element.addEventListener('focusin', handleFocus)
      element.addEventListener('focusout', handleLeave)
      element.addEventListener('click', handleClick, true)

      cleanupByElement.set(element, () => {
        element.removeEventListener('mouseenter', handleEnter)
        element.removeEventListener('mouseleave', handleLeave)
        element.removeEventListener('focusin', handleFocus)
        element.removeEventListener('focusout', handleLeave)
        element.removeEventListener('click', handleClick, true)
        element.removeAttribute('data-field-hint')
        hintByElement.delete(element)
      })
    },
    updated(element: HTMLElement, binding: DirectiveBinding<ContentFieldHint | undefined>) {
      if (!hasFieldHint(binding.value)) {
        return
      }

      hintByElement.set(element, binding.value)
      element.dataset.fieldHint = 'true'
    },
    beforeUnmount(element: HTMLElement) {
      cleanupByElement.get(element)?.()
      cleanupByElement.delete(element)
    }
  })
})
