export function useFloatingFooterOffset() {
  const footerOffset = ref(0)
  let footerOffsetFrame = 0

  function scheduleFooterOffsetUpdate() {
    if (footerOffsetFrame) {
      window.cancelAnimationFrame(footerOffsetFrame)
    }

    footerOffsetFrame = window.requestAnimationFrame(updateFooterOffset)
  }

  function updateFooterOffset() {
    footerOffsetFrame = 0

    const footer = document.querySelector<HTMLElement>('.site-footer')

    if (!footer) {
      footerOffset.value = 0
      return
    }

    const footerRect = footer.getBoundingClientRect()
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight
    const visibleFooterHeight = Math.max(0, viewportHeight - footerRect.top)

    footerOffset.value = visibleFooterHeight > 0 ? Math.ceil(visibleFooterHeight + 16) : 0
  }

  onMounted(() => {
    window.addEventListener('scroll', scheduleFooterOffsetUpdate, { passive: true })
    window.addEventListener('resize', scheduleFooterOffsetUpdate)
    window.visualViewport?.addEventListener('resize', scheduleFooterOffsetUpdate)
    scheduleFooterOffsetUpdate()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', scheduleFooterOffsetUpdate)
    window.removeEventListener('resize', scheduleFooterOffsetUpdate)
    window.visualViewport?.removeEventListener('resize', scheduleFooterOffsetUpdate)

    if (footerOffsetFrame) {
      window.cancelAnimationFrame(footerOffsetFrame)
    }
  })

  return {
    floatingFooterStyle: computed(() => ({ '--floating-footer-offset': `${footerOffset.value}px` })),
    footerOffset: readonly(footerOffset),
    scheduleFooterOffsetUpdate
  }
}
