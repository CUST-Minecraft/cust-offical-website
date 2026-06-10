<template>
  <section class="login-page">
    <div class="login-panel">
      <img src="/example-assets/service-redstone-lamp.svg" alt="" aria-hidden="true">
      <p class="eyebrow">Admin Entry</p>
      <h1>{{ entry?.label }}</h1>
      <p>第一阶段跳转 Strapi Admin，后续自研后台上线后可切换目标地址。</p>
      <a v-if="entry?.url" class="pixel-button" :href="entry.url" target="_blank" rel="noopener noreferrer">
        打开内容后台<span aria-hidden="true">›</span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ApiResponse } from '~/types/content'

const { data: entry } = await useAsyncData('admin-entry', () =>
  $fetch<ApiResponse<{ url: string; label: string }>>('/api/member/admin-entry').then((response) => {
    if (!response.success) {
      throw createError({ statusCode: 403, statusMessage: response.error.message })
    }

    return response.data
  })
)

useSeoMeta({
  title: '内容后台入口 - 长春理工大学 Minecraft 社团',
  robots: 'noindex'
})
</script>
