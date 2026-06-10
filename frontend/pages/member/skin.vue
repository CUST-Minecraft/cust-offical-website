<template>
  <section class="login-page">
    <div class="login-panel">
      <img src="/example-assets/login-portal-obsidian.svg" alt="" aria-hidden="true">
      <p class="eyebrow">Skin Console</p>
      <h1>{{ entry?.label }}</h1>
      <p>官网只负责权限校验和外部跳转，不嵌入、不代理、不管理皮肤站业务数据。</p>
      <a v-if="entry?.url" class="pixel-button" :href="entry.url" target="_blank" rel="noopener noreferrer">
        打开皮肤站<span aria-hidden="true">›</span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ApiResponse } from '~/types/content'

const { data: entry } = await useAsyncData('skin-entry', () =>
  $fetch<ApiResponse<{ url: string; label: string }>>('/api/member/skin-entry').then((response) => {
    if (!response.success) {
      throw createError({ statusCode: 401, statusMessage: response.error.message })
    }

    return response.data
  })
)

useSeoMeta({
  title: '皮肤站入口 - 长春理工大学 Minecraft 社团',
  robots: 'noindex'
})
</script>
