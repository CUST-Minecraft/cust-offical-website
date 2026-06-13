<template>
  <section :class="isMaintenance ? 'maintenance-page' : 'login-page'">
    <div :class="isMaintenance ? 'maintenance-panel' : 'login-panel'">
      <div class="maintenance-copy">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <NuxtLink v-if="!isMaintenance" class="pixel-button" to="/">返回首页<span aria-hidden="true">›</span></NuxtLink>
      </div>

      <div v-if="isMaintenance" class="maintenance-visual" aria-hidden="true">
        <div class="maintenance-lamp">
          <img :src="icon" alt="">
        </div>
      </div>

      <template v-else>
        <img :src="icon" alt="" aria-hidden="true">
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const isMaintenance = computed(() => props.error.statusCode === 503)
const eyebrow = computed(() => (isMaintenance.value ? 'Maintenance' : props.error.statusCode))
const title = computed(() => {
  if (props.error.statusCode === 404) {
    return '页面不存在'
  }

  return isMaintenance.value ? '社团官网维护中' : '服务暂不可用'
})
const description = computed(() => {
  if (props.error.statusCode === 404) {
    return props.error.statusMessage || '这个页面暂时无法访问。'
  }

  return isMaintenance.value ? '内容服务暂时不可用，请稍后再试。' : props.error.statusMessage || '这个页面暂时无法访问。'
})
const icon = computed(() => (isMaintenance.value ? '/example-assets/maintenance-redstone-lamp.svg' : '/example-assets/search-magnifier-pixel.svg'))

useSeoMeta({
  title: computed(() => `${title.value} - 长春理工大学 Minecraft 社团`),
  robots: 'noindex'
})
</script>
