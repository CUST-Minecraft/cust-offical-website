<template>
  <section class="page-hero" :style="{ '--page-hero-bg': `url('${image.src}')` }">
    <div class="page-hero-copy">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p>{{ summary }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ImageRef } from '~/types/content'

defineProps<{
  eyebrow: string
  title: string
  summary: string
  image: ImageRef
}>()
</script>
