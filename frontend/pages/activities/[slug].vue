<template>
  <section v-if="activity" class="content-section detail-wrap">
    <DetailArticle
      :title="activity.title"
      :summary="activity.summary"
      :content="activity.content"
      :image="activity.coverImage"
      :date="formatDate(activity.startTime)"
      :category="statusLabel(activity.status)"
    >
      <div class="detail-actions">
        <a v-if="activity.signupUrl" class="pixel-button" :href="activity.signupUrl" target="_blank" rel="noopener noreferrer">
          报名入口<span aria-hidden="true">›</span>
        </a>
        <NuxtLink class="ghost-button" to="/activities">返回活动列表<span aria-hidden="true">›</span></NuxtLink>
      </div>
      <div v-if="activity.gallery.length" class="gallery-grid">
        <img v-for="image in activity.gallery" :key="image.src" :src="image.src" :alt="image.alt">
      </div>
    </DetailArticle>
  </section>
</template>

<script setup lang="ts">
import type { ActivitySummary } from '~/types/content'

const route = useRoute()
const { data: activity, error } = await useActivityDetail(String(route.params.slug))

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: '活动不存在或未发布' })
}

useSeoMeta({
  title: computed(() => `${activity.value?.title ?? '活动详情'} - 长春理工大学 Minecraft 社团`),
  description: computed(() => activity.value?.summary ?? '活动详情'),
  ogImage: computed(() => activity.value?.coverImage.src)
})

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function statusLabel(status: ActivitySummary['status']) {
  return {
    upcoming: '即将开始',
    ongoing: '进行中',
    ended: '已结束',
    cancelled: '已取消'
  }[status]
}
</script>
