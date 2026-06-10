<template>
  <section v-if="announcement" class="content-section detail-wrap">
    <DetailArticle
      :title="announcement.title"
      :summary="announcement.summary"
      :content="announcement.content"
      :image="{ src: '/example-assets/cust-main-gate-hero.png', alt: announcement.title }"
      :date="formatDate(announcement.publishedAt)"
      :category="announcement.category"
    >
      <div v-if="announcement.attachments.length" class="attachment-list">
        <a v-for="attachment in announcement.attachments" :key="attachment.label" :href="attachment.url">
          {{ attachment.label }}
        </a>
      </div>
      <div class="detail-actions">
        <NuxtLink class="ghost-button" to="/announcements">返回公告列表<span aria-hidden="true">›</span></NuxtLink>
      </div>
    </DetailArticle>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: announcement, error } = await useAnnouncementDetail(String(route.params.slug))

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: '公告不存在或未发布' })
}

useSeoMeta({
  title: computed(() => `${announcement.value?.title ?? '公告详情'} - 长春理工大学 Minecraft 社团`),
  description: computed(() => announcement.value?.summary ?? '公告详情')
})

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}
</script>
