<template>
  <article class="detail-article">
    <div class="detail-meta">
      <span v-if="category">{{ category }}</span>
      <time v-if="date">{{ date }}</time>
    </div>
    <h1>{{ title }}</h1>
    <p class="detail-summary">{{ summary }}</p>
    <img v-if="image" :src="image.src" :alt="image.alt">
    <RichTextRenderer :content="content" />
    <slot />
  </article>
</template>

<script setup lang="ts">
import type { ImageRef } from '~/types/content'

defineProps<{
  title: string
  summary: string
  content: string
  image?: ImageRef
  date?: string
  category?: string
}>()
</script>
