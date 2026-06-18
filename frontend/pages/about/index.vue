<template>
  <div v-if="page">
    <PageHero
      :eyebrow="heroSection.eyebrow || '认识我们'"
      :title="heroTitle"
      :summary="heroSection.summary || page.summary"
      :image="heroSection.image || page.coverImage"
      :hints="heroHints"
    />
    <section class="content-section page-story about-story-flow">
      <article class="story-showcase motion-reveal" :style="{ '--story-bg': `url('${(originSection.image || heroSection.image || page.coverImage).src}')` }">
        <div class="story-copy">
          <span v-field-hint="aboutPageFieldHint('sections.eyebrow', '社团介绍板块眉标：我们的起点')" class="promo-kicker">{{ originSection.eyebrow || '我们的起点' }}</span>
          <h2 v-field-hint="aboutPageFieldHint('sections.title', '社团介绍板块标题：我们的起点')">{{ originSection.title }}</h2>
          <RichTextRenderer v-field-hint="aboutPageFieldHint('sections.content', '社团介绍板块正文：我们的起点')" :content="originSection.content || ''" />
          <div v-if="originKeywords.length" class="story-stats" aria-label="社团故事关键词">
            <span v-for="keyword in originKeywords" :key="keyword.title">
              <strong v-field-hint="aboutPageFieldHint('sections.items.title', `社团介绍关键词：${keyword.title}`)">{{ keyword.title }}</strong>
              <small v-field-hint="aboutPageFieldHint('sections.items.summary', `社团介绍关键词说明：${keyword.title}`)">{{ keyword.summary }}</small>
            </span>
          </div>
        </div>
        <div v-if="storyStackItems.length" class="story-card-stack" aria-hidden="true">
          <span v-for="item in storyStackItems" :key="item.title">{{ item.title }}</span>
        </div>
      </article>

      <article class="about-section-frame about-actions-frame motion-reveal" :style="sectionFrameStyle(actionsSection)">
        <div class="about-frame-heading">
          <span v-field-hint="aboutPageFieldHint('sections.eyebrow', '社团介绍板块眉标：我们的行动')" class="promo-kicker">{{ actionsSection.eyebrow || '我们的行动' }}</span>
          <h2 v-field-hint="aboutPageFieldHint('sections.title', '社团介绍板块标题：我们的行动')">{{ actionsSection.title }}</h2>
          <p v-if="actionsSection.summary" v-field-hint="aboutPageFieldHint('sections.summary', '社团介绍板块摘要：我们的行动')">{{ actionsSection.summary }}</p>
        </div>
        <ul class="about-point-list motion-stagger" aria-label="社团行动分点">
          <li v-for="action in actionsSection.items" :key="action.title" class="about-point-item motion-reveal">
            <span class="about-point-bullet" aria-hidden="true" />
            <p>
              <strong v-field-hint="aboutPageFieldHint('sections.items.title', `社团行动标题：${action.title}`)">{{ action.title }}：</strong>
              <span v-field-hint="aboutPageFieldHint('sections.items.summary', `社团行动摘要：${action.title}`)">{{ action.summary }}</span>
            </p>
          </li>
        </ul>
      </article>

      <article class="about-section-frame about-directions-frame motion-reveal" :style="sectionFrameStyle(directionsSection)">
        <div class="about-frame-heading">
          <span v-field-hint="aboutPageFieldHint('sections.eyebrow', '社团介绍板块眉标：我们的方向')" class="promo-kicker">{{ directionsSection.eyebrow || '我们的方向' }}</span>
          <h2 v-field-hint="aboutPageFieldHint('sections.title', '社团介绍板块标题：我们的方向')">{{ directionsSection.title }}</h2>
          <p v-if="directionsSection.summary" v-field-hint="aboutPageFieldHint('sections.summary', '社团介绍板块摘要：我们的方向')">{{ directionsSection.summary }}</p>
        </div>
        <ul class="about-point-list about-direction-points motion-stagger" aria-label="参与方向分点">
          <li v-for="group in directionsSection.items" :key="group.title" class="about-point-item motion-reveal">
            <span class="about-point-bullet" aria-hidden="true" />
            <p>
              <strong v-field-hint="aboutPageFieldHint('sections.items.title', `参与方向标题：${group.title}`)">{{ group.title }}：</strong>
              <span v-field-hint="aboutPageFieldHint('sections.items.summary', `参与方向摘要：${group.title}`)">{{ group.summary }}</span>
            </p>
          </li>
        </ul>
      </article>

      <article class="about-section-frame about-next-frame motion-reveal" :style="sectionFrameStyle(nextSection)">
        <div class="about-frame-heading about-next-copy">
          <span v-field-hint="aboutPageFieldHint('sections.eyebrow', '社团介绍板块眉标：继续了解')" class="promo-kicker">{{ nextSection.eyebrow || '继续了解' }}</span>
          <h2 v-field-hint="aboutPageFieldHint('sections.title', '社团介绍板块标题：继续了解')">{{ nextSection.title }}</h2>
          <p v-if="nextSection.summary" v-field-hint="aboutPageFieldHint('sections.summary', '社团介绍板块摘要：继续了解')">{{ nextSection.summary }}</p>
        </div>
        <div class="about-next-links" aria-label="继续了解入口">
          <NuxtLink
            v-for="link in nextSection.links"
            :key="link.href"
            class="about-next-link"
            :to="link.href"
            :target="link.openInNewTab ? '_blank' : undefined"
            :rel="link.openInNewTab ? 'noopener noreferrer' : undefined"
          >
            <span v-field-hint="aboutPageFieldHint('sections.links.code', `继续了解入口编号：${link.label}`)" aria-hidden="true">{{ link.code }}</span>
            <strong v-field-hint="aboutPageFieldHint('sections.links.label', `继续了解入口标签：${link.label}`)">{{ link.label }}</strong>
            <small v-if="link.summary" v-field-hint="aboutPageFieldHint('sections.links.summary', `继续了解入口摘要：${link.label}`)">{{ link.summary }}</small>
          </NuxtLink>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { AboutSection, AboutSectionType, ImageRef } from '~/types/content'
import { aboutPageFieldHint } from '~/utils/field-hints'

const { data: page } = await useAboutPage()

const sectionOrder: AboutSectionType[] = ['hero', 'origin', 'actions', 'directions', 'next']

const sections = computed(() => {
  const seen = new Set<AboutSectionType>()

  return [...(page.value?.sections ?? [])]
    .filter((section) => section.enabled && sectionOrder.includes(section.sectionType))
    .sort((a, b) => {
      const orderDelta = sectionOrder.indexOf(a.sectionType) - sectionOrder.indexOf(b.sectionType)
      return orderDelta || a.sortOrder - b.sortOrder
    })
    .filter((section) => {
      if (seen.has(section.sectionType)) {
        return false
      }

      seen.add(section.sectionType)
      return true
    })
})

function sectionOf(type: AboutSectionType, fallback: AboutSection) {
  return computed(() => sections.value.find((section) => section.sectionType === type) ?? fallback)
}

const fallbackImage = computed<ImageRef>(() => page.value?.coverImage ?? { src: '/example-assets/section-intro-pixel.png', alt: '社团介绍头图' })

const heroSection = sectionOf('hero', {
  sectionType: 'hero',
  eyebrow: '认识我们',
  title: '长春理工大学 Minecraft 社团',
  summary: page.value?.summary,
  image: fallbackImage.value,
  items: [],
  links: [],
  sortOrder: 10,
  enabled: true
})

const originSection = sectionOf('origin', {
  sectionType: 'origin',
  eyebrow: '我们的起点',
  title: '我们的起点',
  content: page.value?.content || '',
  items: [],
  links: [],
  sortOrder: 20,
  enabled: true
})

const actionsSection = sectionOf('actions', {
  sectionType: 'actions',
  eyebrow: '我们的行动',
  title: '我们的行动',
  items: [],
  links: [],
  sortOrder: 30,
  enabled: true
})

const directionsSection = sectionOf('directions', {
  sectionType: 'directions',
  eyebrow: '我们的方向',
  title: '我们的方向',
  items: (page.value?.groups ?? []).map((group, index) => ({
    code: String(index + 1).padStart(2, '0'),
    title: group.name,
    summary: group.summary,
    sortOrder: (index + 1) * 10,
    enabled: true
  })),
  links: [],
  sortOrder: 40,
  enabled: true
})

const nextSection = sectionOf('next', {
  sectionType: 'next',
  eyebrow: '继续了解',
  title: '继续了解',
  items: [],
  links: [],
  sortOrder: 50,
  enabled: true
})

const heroTitle = computed(() => {
  const title = heroSection.value.title?.trim()
  return title && title !== '社团介绍' ? title : '长春理工大学 Minecraft 社团'
})

const heroHints = {
  title: aboutPageFieldHint('sections.title', '社团介绍 Hero 标题'),
  summary: aboutPageFieldHint('sections.summary', '社团介绍 Hero 摘要'),
  image: aboutPageFieldHint('sections.image', '社团介绍 Hero 头图')
}

const originKeywords = computed(() => originSection.value.items.slice(0, 3))
const storyStackItems = computed(() => actionsSection.value.items.slice(0, 3))

function sectionFrameStyle(section: AboutSection) {
  const image = section.image || heroSection.value.image || page.value?.coverImage

  return {
    '--about-section-bg': image ? `url('${image.src}')` : 'none'
  }
}

useSeoMeta({
  title: computed(() => heroTitle.value.includes('长春理工大学 Minecraft 社团') ? heroTitle.value : `${heroTitle.value} - 长春理工大学 Minecraft 社团`),
  description: computed(() => page.value?.summary ?? '社团介绍')
})
</script>
