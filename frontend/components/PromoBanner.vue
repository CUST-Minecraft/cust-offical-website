<template>
  <article class="promo-banner" :class="[type, `align-${align}`]" :style="{ '--promo-bg': `url('${image.src}')` }">
    <div class="promo-copy">
      <span class="promo-kicker">{{ kicker }}</span>
      <h2>{{ title }}</h2>
      <p>{{ body }}</p>
      <slot />
      <NuxtLink class="promo-link" :to="to">
        {{ linkLabel }}<span aria-hidden="true">›</span>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ImageRef } from '~/types/content'

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
  }>(),
  {
    type: 'intro-banner',
    align: 'left'
  }
)
</script>
