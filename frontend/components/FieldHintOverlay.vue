<template>
  <div v-if="isAllowed" class="field-hint-root" :class="{ 'is-enabled': enabled }" :style="floatingFooterStyle">
    <button class="field-hint-toggle" type="button" :aria-pressed="enabled" aria-label="切换维护模式" title="切换维护模式" @click="toggle">
      <img class="field-hint-toggle-icon" src="/example-assets/maintenance-pickaxe.svg" alt="" aria-hidden="true">
    </button>

    <div v-if="enabled && currentTarget && rect" class="field-hint-layer" aria-hidden="true">
      <div class="field-hint-rect" :style="rectStyle"></div>
      <div class="field-hint-card" :style="cardStyle">
        <p>
          <span>数据模型</span>
          <strong>{{ currentTarget.hint.modelLabel }}（{{ currentTarget.hint.model }}）</strong>
        </p>
        <p>
          <span>字段名称</span>
          <strong>{{ currentTarget.hint.field }}</strong>
        </p>
        <p>
          <span>页面用途</span>
          <strong>{{ currentTarget.hint.usage }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { clearPinned, currentTarget, enabled, isAllowed, toggle } = useFieldHints()
const { floatingFooterStyle } = useFloatingFooterOffset()

const rect = shallowRef<DOMRect | null>(null)
let frame = 0

const rectStyle = computed(() => {
  if (!rect.value) {
    return {}
  }

  return {
    height: `${rect.value.height}px`,
    left: `${rect.value.left}px`,
    top: `${rect.value.top}px`,
    width: `${rect.value.width}px`
  }
})

const cardStyle = computed(() => {
  if (!rect.value || !import.meta.client) {
    return {}
  }

  const cardWidth = 288
  const cardHeight = 132
  const gap = 10
  const margin = 14
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const left = Math.min(Math.max(rect.value.left, margin), viewportWidth - cardWidth - margin)
  const preferredTop = rect.value.bottom + gap
  const top = preferredTop + cardHeight > viewportHeight
    ? Math.max(margin, rect.value.top - cardHeight - gap)
    : preferredTop

  return {
    left: `${left}px`,
    top: `${top}px`
  }
})

watch(enabled, (value) => {
  document.body.classList.toggle('field-hints-enabled', value)

  if (!value) {
    rect.value = null
  }
})

watch(currentTarget, () => {
  scheduleRectUpdate()
})

onMounted(() => {
  window.addEventListener('scroll', scheduleRectUpdate, { passive: true })
  window.addEventListener('resize', scheduleRectUpdate)
  window.addEventListener('keydown', handleKeydown)
  window.visualViewport?.addEventListener('resize', scheduleRectUpdate)
})

onBeforeUnmount(() => {
  document.body.classList.remove('field-hints-enabled')
  window.removeEventListener('scroll', scheduleRectUpdate)
  window.removeEventListener('resize', scheduleRectUpdate)
  window.removeEventListener('keydown', handleKeydown)
  window.visualViewport?.removeEventListener('resize', scheduleRectUpdate)

  if (frame) {
    window.cancelAnimationFrame(frame)
  }
})

function scheduleRectUpdate() {
  if (frame) {
    window.cancelAnimationFrame(frame)
  }

  frame = window.requestAnimationFrame(updateRect)
}

function updateRect() {
  frame = 0

  const element = currentTarget.value?.element

  if (!enabled.value || !element || !document.body.contains(element)) {
    rect.value = null
    return
  }

  rect.value = element.getBoundingClientRect()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    clearPinned()
  }
}
</script>
