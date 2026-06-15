export function useMotionReveal(selector = '.motion-reveal') {
  const route = useRoute()
  let observer: IntersectionObserver | undefined

  function reveal(element: HTMLElement) {
    element.classList.add('is-motion-visible')
  }

  function isNearViewport(element: HTMLElement) {
    const revealLead = Math.min(260, window.innerHeight * 0.24)
    const rect = element.getBoundingClientRect()

    return rect.top < window.innerHeight + revealLead && rect.bottom > -revealLead
  }

  async function observeTargets() {
    if (!import.meta.client) {
      return
    }

    await nextTick()

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = document.querySelectorAll<HTMLElement>(selector)

    for (const element of elements) {
      if (element.dataset.motionReveal === 'done') {
        continue
      }

      if (reduceMotion || !observer) {
        reveal(element)
        element.dataset.motionReveal = 'done'
        continue
      }

      if (isNearViewport(element)) {
        reveal(element)
        element.dataset.motionReveal = 'done'
        continue
      }

      element.dataset.motionReveal = 'observed'
      observer.observe(element)
    }
  }

  onMounted(() => {
    if (!import.meta.client) {
      return
    }

    document.documentElement.classList.add('motion-reveal-enabled')

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) {
              continue
            }

            const element = entry.target as HTMLElement
            reveal(element)
            element.dataset.motionReveal = 'done'
            observer?.unobserve(element)
          }
        },
        {
          rootMargin: '0px 0px 18% 0px',
          threshold: 0.02
        }
      )
    }

    void observeTargets()
  })

  watch(
    () => route.fullPath,
    () => {
      void observeTargets()
    },
    { flush: 'post' }
  )

  onBeforeUnmount(() => {
    observer?.disconnect()
  })
}
