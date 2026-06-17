<template>
  <section class="hero" :class="heroClasses">
    <div class="hero-stage">
      <div class="hero-bg-stack" aria-hidden="true">
        <div
          v-for="(slide, index) in safeSlides"
          :key="`${slide.background}-${index}`"
          class="hero-bg"
          :class="[getHeroBackgroundClasses(slide), { active: index === activeIndex }]"
          :style="getHeroBackgroundStyle(slide)"
        />
      </div>

      <div class="carousel-dots" aria-label="轮播指示器">
        <button
          v-for="(_, index) in safeSlides"
          :key="index"
          :class="{ active: index === activeIndex }"
          type="button"
          :aria-label="`切换到第 ${index + 1} 张背景`"
          @click="setActive(index)"
        />
      </div>

      <div class="hero-panel-stack">
        <div
          v-for="(slide, slideIndex) in safeSlides"
          :id="slideIndex === activeIndex ? 'home' : undefined"
          :key="`${slide.background}-content-${slideIndex}`"
          class="hero-content hero-safe-card hero-slide-panel"
          :class="[getHeroContentClasses(slide), { 'is-active': slideIndex === activeIndex }]"
          :aria-hidden="slideIndex !== activeIndex"
          :inert="slideIndex !== activeIndex"
        >
          <p v-field-hint="homePageFieldHint('heroEyebrow', '首页 Hero 眉标')" class="eyebrow">{{ hero.eyebrow }}</p>
          <h1 v-field-hint="homePageFieldHint('heroTitleLines', '首页 Hero 标题')">
            <template v-for="(line, index) in hero.titleLines" :key="line">
              <span v-if="line === hero.highlightText">{{ line }}</span>
              <template v-else>
                {{ beforeHighlight(line) }}<span v-if="line.includes(hero.highlightText)">{{ hero.highlightText }}</span>{{ afterHighlight(line) }}
              </template>
              <br v-if="index < hero.titleLines.length - 1">
            </template>
          </h1>
          <p v-if="slide.contentStyle !== 'minimal'" v-field-hint="homePageFieldHint('heroSubtitle', '首页 Hero 副标题')" class="hero-subtitle"><span />{{ hero.subtitle }}<span /></p>
          <p v-if="slide.contentStyle !== 'minimal'" v-field-hint="homePageFieldHint('heroDescription', '首页 Hero 说明')" class="hero-description">{{ hero.description }}</p>
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

      <p
        v-if="heroPhotoCaption"
        v-field-hint="homePageFieldHint('heroSlides.photoLocation / heroSlides.photoAuthor', '首页 Hero 图片图注')"
        class="hero-photo-caption"
        :class="`hero-photo-caption-${heroPhotoCaptionPosition}`"
      >
        {{ heroPhotoCaption }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HeroSlide, HomeHero } from '~/types/content'
import { homePageFieldHint } from '~/utils/field-hints'

const props = defineProps<{ hero: HomeHero }>()
const activeIndex = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const fallbackSlide: HeroSlide = {
  background: '/example-assets/hero-campus.png',
  contentAlign: 'right',
  contentPosition: 'right-top',
  contentStyle: 'minimal',
  textStyle: 'outlined',
  overlayStrength: 'medium',
  overlayMode: 'side',
  overlayAnchor: 'right-top',
  textWidth: 'medium',
  tone: 'light',
  backgroundPosition: 'center center',
  photoLocation: '',
  photoAuthor: '',
  photoCaptionPosition: 'auto'
}

const safeSlides = computed(() => {
  const validSlides = props.hero.slides.filter((slide) => slide.background)
  return validSlides.length ? validSlides : [fallbackSlide]
})
watch(() => safeSlides.value.length, (length) => {
  clampActiveIndex(length)
  startCarousel()
})
const activeSlide = computed(() => safeSlides.value[activeIndex.value] ?? safeSlides.value[0] ?? fallbackSlide)
const heroPhotoCaption = computed(() => {
  const location = (activeSlide.value?.photoLocation ?? '').trim()
  const author = (activeSlide.value?.photoAuthor ?? '').trim()

  if (location && author) {
    return `${location} · 原图摄影：${author}`
  }

  if (author) {
    return `原图摄影：${author}`
  }

  return location
})
const heroPhotoCaptionPosition = computed(() => {
  const slide = activeSlide.value
  const requested = slide.photoCaptionPosition
  const contentPosition = slide.contentPosition ?? slide.contentAlign
  const contentCorner = getHeroContentCorner(contentPosition)

  if (requested && requested !== 'auto' && requested !== contentCorner) {
    return requested
  }

  return getSafeCaptionCorner(contentCorner)
})
const heroClasses = computed(() => {
  const slide = activeSlide.value
  return [
    `hero-${slide.contentAlign}`,
    `hero-style-${slide.textStyle}`,
    `hero-overlay-${slide.overlayStrength}`,
    `hero-overlay-mode-${slide.overlayMode}`,
    `hero-width-${slide.textWidth}`,
    `hero-tone-${slide.tone}`,
    `hero-content-${slide.contentStyle ?? 'full'}`,
    `hero-float-${slide.contentPosition ?? slide.contentAlign}`
  ]
})

function getHeroContentClasses(slide: HeroSlide) {
  return [
    `hero-card-${slide.contentStyle ?? 'full'}`,
    `hero-card-overlay-${slide.overlayMode}`,
    `hero-card-strength-${slide.overlayStrength}`,
    `hero-card-float-${slide.contentPosition ?? slide.contentAlign}`
  ]
}

function getHeroBackgroundClasses(slide: HeroSlide) {
  return [
    `hero-bg-overlay-${slide.overlayMode}`,
    `hero-bg-strength-${slide.overlayStrength}`
  ]
}

function getHeroContentCorner(position: HeroSlide['contentPosition'] | HeroSlide['contentAlign']) {
  const corners: Record<string, HeroSlide['photoCaptionPosition']> = {
    left: 'left-bottom',
    right: 'right-bottom',
    bottom: 'right-top',
    'left-top': 'left-top',
    'right-top': 'right-top',
    'left-center': 'left-bottom',
    'right-center': 'right-bottom',
    'left-bottom': 'left-bottom',
    'right-bottom': 'right-bottom',
    'bottom-bar': 'right-top'
  }

  return corners[position ?? 'right'] ?? 'right-bottom'
}

function getSafeCaptionCorner(contentCorner: HeroSlide['photoCaptionPosition']) {
  const safeCorners: Record<Exclude<HeroSlide['photoCaptionPosition'], 'auto'>, Exclude<HeroSlide['photoCaptionPosition'], 'auto'>> = {
    'left-top': 'right-bottom',
    'right-top': 'left-bottom',
    'left-bottom': 'right-top',
    'right-bottom': 'left-top'
  }

  return safeCorners[contentCorner === 'auto' ? 'right-bottom' : contentCorner]
}

onMounted(startCarousel)
onBeforeUnmount(() => clearInterval(timer))

function clampActiveIndex(length = safeSlides.value.length) {
  activeIndex.value = Math.min(Math.max(activeIndex.value, 0), Math.max(length - 1, 0))
}

function setActive(index: number) {
  activeIndex.value = index
  clampActiveIndex()
  startCarousel()
}

function startCarousel() {
  clearInterval(timer)
  clampActiveIndex()

  if (safeSlides.value.length < 2) {
    activeIndex.value = 0
    return
  }

  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % safeSlides.value.length
  }, props.hero.carouselInterval)
}

function beforeHighlight(line: string) {
  return line.split(props.hero.highlightText)[0]
}

function afterHighlight(line: string) {
  return line.split(props.hero.highlightText)[1] ?? ''
}

function getHeroBackgroundStyle(slide: HeroSlide) {
  return {
    backgroundImage: `url("${slide.background}")`,
    backgroundPosition: slide.backgroundPosition,
    '--hero-overlay-image': getHeroOverlayImage(slide)
  }
}

function getHeroOverlayImage(slide: HeroSlide) {
  const overlay = getHeroOverlay(slide.overlayStrength)

  if (slide.overlayStrength === 'none' || slide.overlayMode === 'none' || slide.overlayMode === 'local') {
    return 'none'
  }

  if (slide.overlayMode === 'edge') {
    return `radial-gradient(ellipse at center, ${overlay.clear} 0, ${overlay.clear} 54%, ${overlay.edgeMiddle} 82%, ${overlay.edgeStrong} 100%)`
  }

  if (slide.overlayMode === 'corner') {
    return `radial-gradient(ellipse 58% 52% at ${getHeroOverlayAnchor(slide.overlayAnchor)}, ${overlay.cornerStrong} 0, ${overlay.cornerStrong} 8%, ${overlay.cornerMiddle} 28%, transparent 64%)`
  }

  if (slide.contentAlign === 'bottom') {
    return `linear-gradient(0deg, ${overlay.strong} 0, ${overlay.middle} 32%, ${overlay.clear} 68%)`
  }

  const direction = slide.contentAlign === 'right' ? '270deg' : '90deg'
  return `linear-gradient(${direction}, ${overlay.strong} 0, ${overlay.middle} 40%, ${overlay.clear} 72%)`
}

function getHeroOverlayAnchor(anchor: HeroSlide['overlayAnchor']) {
  const anchors = {
    'left-top': 'left top',
    'right-top': 'right top',
    'left-bottom': 'left bottom',
    'right-bottom': 'right bottom'
  }

  return anchors[anchor ?? 'right-top']
}

function getHeroOverlay(strength: HeroSlide['overlayStrength']) {
  const overlays = {
    none: {
      strong: 'transparent',
      middle: 'transparent',
      clear: 'transparent',
      edgeMiddle: 'transparent',
      edgeStrong: 'transparent',
      cornerMiddle: 'transparent',
      cornerStrong: 'transparent'
    },
    soft: {
      strong: 'rgba(8, 9, 7, 0.52)',
      middle: 'rgba(8, 9, 7, 0.2)',
      clear: 'rgba(8, 9, 7, 0.03)',
      edgeMiddle: 'rgba(8, 9, 7, 0.12)',
      edgeStrong: 'rgba(8, 9, 7, 0.28)',
      cornerMiddle: 'rgba(8, 9, 7, 0.24)',
      cornerStrong: 'rgba(8, 9, 7, 0.46)'
    },
    medium: {
      strong: 'rgba(8, 9, 7, 0.74)',
      middle: 'rgba(8, 9, 7, 0.34)',
      clear: 'rgba(8, 9, 7, 0.08)',
      edgeMiddle: 'rgba(8, 9, 7, 0.18)',
      edgeStrong: 'rgba(8, 9, 7, 0.38)',
      cornerMiddle: 'rgba(8, 9, 7, 0.32)',
      cornerStrong: 'rgba(8, 9, 7, 0.56)'
    },
    strong: {
      strong: 'rgba(8, 9, 7, 0.86)',
      middle: 'rgba(8, 9, 7, 0.48)',
      clear: 'rgba(8, 9, 7, 0.14)',
      edgeMiddle: 'rgba(8, 9, 7, 0.24)',
      edgeStrong: 'rgba(8, 9, 7, 0.5)',
      cornerMiddle: 'rgba(8, 9, 7, 0.4)',
      cornerStrong: 'rgba(8, 9, 7, 0.68)'
    }
  }

  return overlays[strength]
}
</script>
