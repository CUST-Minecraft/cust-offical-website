<template>
  <div>
    <PageHero
      eyebrow="Announcements"
      title="社团公告"
      summary="正式通知、维护说明、活动结果和重要更新集中展示。"
      :image="{ src: '/example-assets/section-events-pixel.png', alt: '社团公告头图' }"
    />
    <section class="content-section">
      <div v-if="announcements?.length" class="content-grid">
        <ContentCard
          v-for="announcement in announcements"
          :key="announcement.slug"
          :title="announcement.title"
          :summary="announcement.summary"
          :date="formatDate(announcement.publishedAt)"
          :category="announcement.category"
          :badge="announcement.isPinned ? '置顶' : undefined"
          :image="{ src: '/example-assets/cust-main-gate-hero.png', alt: announcement.title }"
          :to="`/announcements/${announcement.slug}`"
        />
      </div>
      <EmptyState v-else title="暂无公告" message="公开公告会在内容管理员发布后展示。" />
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: announcements } = await useAnnouncements({ page: 1, pageSize: 10 })

useSeoMeta({
  title: '社团公告 - 长春理工大学 Minecraft 社团',
  description: '正式通知、维护说明、活动结果和重要更新。'
})

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' }).format(new Date(value))
}
</script>
