<template>
  <article class="content-card motion-reveal">
    <NuxtLink :to="to" class="content-card-image" :style="image ? { backgroundImage: `url('${image.src}')` } : undefined">
      <span v-if="badge">{{ badge }}</span>
    </NuxtLink>
    <div class="content-card-copy">
      <div class="content-card-meta">
        <time v-if="date">{{ date }}</time>
        <span v-if="category">{{ category }}</span>
      </div>
      <h2><NuxtLink :to="to">{{ title }}</NuxtLink></h2>
      <p>{{ summary }}</p>
      <NuxtLink class="promo-link compact" :to="to">查看详情<span aria-hidden="true">›</span></NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ImageRef } from '~/types/content'

defineProps<{
  title: string
  summary: string
  to: string
  image?: ImageRef
  date?: string
  category?: string
  badge?: string
}>()
</script>
