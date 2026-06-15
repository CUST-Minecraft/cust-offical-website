<template>
  <section v-field-hint="hints?.image" class="page-hero motion-reveal" :style="{ '--page-hero-bg': `url('${image.src}')` }">
    <div class="page-hero-copy">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h1 v-field-hint="hints?.title">{{ title }}</h1>
      <p v-field-hint="hints?.summary">{{ summary }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ImageRef } from '~/types/content'
import type { ContentFieldHint } from '~/utils/field-hints'

interface PageHeroFieldHints {
  title?: ContentFieldHint
  summary?: ContentFieldHint
  image?: ContentFieldHint
}

defineProps<{
  eyebrow: string
  title: string
  summary: string
  image: ImageRef
  hints?: PageHeroFieldHints
}>()
</script>
