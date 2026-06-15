<template>
  <article class="promo-banner motion-reveal" :class="[type, `align-${align}`]" :style="{ '--promo-bg': `url('${image.src}')` }">
    <div class="promo-copy">
      <span class="promo-kicker">{{ kicker }}</span>
      <h2 v-field-hint="hints?.title">{{ title }}</h2>
      <p v-field-hint="hints?.body">{{ body }}</p>
      <slot />
      <NuxtLink v-field-hint="hints?.linkLabel" class="promo-link" :to="to">
        {{ linkLabel }}<span aria-hidden="true">›</span>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ImageRef } from '~/types/content'
import type { ContentFieldHint } from '~/utils/field-hints'

interface PromoBannerFieldHints {
  title?: ContentFieldHint
  body?: ContentFieldHint
  linkLabel?: ContentFieldHint
}

withDefaults(
  defineProps<{
    type?: string
    align?: 'left' | 'right'
    kicker: string
    title: string
    body: string
    image: ImageRef
    linkLabel: string
    to: string
    hints?: PromoBannerFieldHints
  }>(),
  {
    type: 'intro-banner',
    align: 'left'
  }
)
</script>
