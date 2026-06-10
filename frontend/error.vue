<template>
  <section class="login-page">
    <div class="login-panel">
      <img src="/example-assets/search-magnifier-pixel.svg" alt="" aria-hidden="true">
      <p class="eyebrow">{{ error.statusCode }}</p>
      <h1>{{ title }}</h1>
      <p>{{ error.statusMessage || '这个页面暂时无法访问。' }}</p>
      <NuxtLink class="pixel-button" to="/">返回首页<span aria-hidden="true">›</span></NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const title = computed(() => (props.error.statusCode === 404 ? '页面不存在' : '服务暂不可用'))

useSeoMeta({
  title: computed(() => `${title.value} - 长春理工大学 Minecraft 社团`),
  robots: 'noindex'
})
</script>
