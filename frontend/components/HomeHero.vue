<template>
  <section class="hero" :class="heroClasses">
    <div class="hero-stage">
      <div class="hero-bg-stack" aria-hidden="true">
        <div
          v-for="(slide, index) in hero.slides"
          :key="`${slide.background}-${index}`"
          class="hero-bg"
          :class="{ active: index === activeIndex }"
          :style="{
            backgroundImage: getHeroBackgroundImage(slide),
            backgroundPosition: slide.backgroundPosition
          }"
        />
      </div>

      <div class="carousel-dots" aria-label="轮播指示器">
        <button
          v-for="(_, index) in hero.slides"
          :key="index"
          :class="{ active: index === activeIndex }"
          type="button"
          :aria-label="`切换到第 ${index + 1} 张背景`"
          @click="setActive(index)"
        />
      </div>

      <div class="hero-panel-stack">
        <div
          v-for="(slide, slideIndex) in hero.slides"
          :id="slideIndex === activeIndex ? 'home' : undefined"
          :key="`${slide.background}-content-${slideIndex}`"
          class="hero-content hero-safe-card hero-slide-panel"
          :class="[getHeroContentClasses(slide), { 'is-active': slideIndex === activeIndex }]"
          :aria-hidden="slideIndex !== activeIndex"
          :inert="slideIndex !== activeIndex"
        >
          <p class="eyebrow">{{ hero.eyebrow }}</p>
          <h1>
            <template v-for="(line, index) in hero.titleLines" :key="line">
              <span v-if="line === hero.highlightText">{{ line }}</span>
              <template v-else>
                {{ beforeHighlight(line) }}<span v-if="line.includes(hero.highlightText)">{{ hero.highlightText }}</span>{{ afterHighlight(line) }}
              </template>
              <br v-if="index < hero.titleLines.length - 1">
            </template>
          </h1>
          <p v-if="slide.contentStyle !== 'minimal'" class="hero-subtitle"><span />{{ hero.subtitle }}<span /></p>
          <p v-if="slide.contentStyle !== 'minimal'" class="hero-description">{{ hero.description }}</p>
          <div class="hero-actions">
            <NuxtLink class="ghost-button" to="/about">
              了解更多
              <span aria-hidden="true">›</span>
            </NuxtLink>
            <NuxtLink class="hero-join-button" to="/join">
              加入我们
              <span aria-hidden="true">›</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HeroSlide, HomeHero } from '~/types/content'

const props = defineProps<{ hero: HomeHero }>()
const activeIndex = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const activeSlide = computed(() => props.hero.slides[activeIndex.value] ?? props.hero.slides[0])
const heroClasses = computed(() => {
  const slide = activeSlide.value
  return [
    `hero-${slide.contentAlign}`,
    `hero-style-${slide.textStyle}`,
    `hero-overlay-${slide.overlayStrength}`,
    `hero-width-${slide.textWidth}`,
    `hero-tone-${slide.tone}`,
    `hero-content-${slide.contentStyle ?? 'full'}`,
    `hero-float-${slide.contentPosition ?? slide.contentAlign}`
  ]
})

function getHeroContentClasses(slide: HeroSlide) {
  return [
    `hero-card-${slide.contentStyle ?? 'full'}`,
    `hero-card-float-${slide.contentPosition ?? slide.contentAlign}`
  ]
}

onMounted(startCarousel)
onBeforeUnmount(() => clearInterval(timer))

function setActive(index: number) {
  activeIndex.value = index
  startCarousel()
}

function startCarousel() {
  clearInterval(timer)

  if (props.hero.slides.length < 2) {
    return
  }

  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % props.hero.slides.length
  }, props.hero.carouselInterval)
}

function beforeHighlight(line: string) {
  return line.split(props.hero.highlightText)[0]
}

function afterHighlight(line: string) {
  return line.split(props.hero.highlightText)[1] ?? ''
}

function getHeroBackgroundImage(slide: HeroSlide) {
  const overlay = getHeroOverlay(slide.overlayStrength)

  if (slide.overlayStrength === 'none') {
    return `url("${slide.background}")`
  }

  if (slide.contentAlign === 'bottom') {
    return `linear-gradient(0deg, ${overlay.strong} 0, ${overlay.middle} 32%, ${overlay.clear} 68%), url("${slide.background}")`
  }

  const direction = slide.contentAlign === 'right' ? '270deg' : '90deg'
  return `linear-gradient(${direction}, ${overlay.strong} 0, ${overlay.middle} 40%, ${overlay.clear} 72%), url("${slide.background}")`
}

function getHeroOverlay(strength: HeroSlide['overlayStrength']) {
  const overlays = {
    none: { strong: 'transparent', middle: 'transparent', clear: 'transparent' },
    soft: {
      strong: 'rgba(8, 9, 7, 0.52)',
      middle: 'rgba(8, 9, 7, 0.2)',
      clear: 'rgba(8, 9, 7, 0.03)'
    },
    medium: {
      strong: 'rgba(8, 9, 7, 0.74)',
      middle: 'rgba(8, 9, 7, 0.34)',
      clear: 'rgba(8, 9, 7, 0.08)'
    },
    strong: {
      strong: 'rgba(8, 9, 7, 0.86)',
      middle: 'rgba(8, 9, 7, 0.48)',
      clear: 'rgba(8, 9, 7, 0.14)'
    }
  }

  return overlays[strength]
}
</script>
