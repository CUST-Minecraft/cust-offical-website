<template>
  <div>
    <PageHero
      eyebrow="Events"
      title="社团活动"
      summary="浏览近期活动和历史活动，第一阶段报名使用外部链接。"
      :image="{ src: '/example-assets/section-events-pixel.png', alt: '社团活动头图' }"
    />
    <section class="content-section">
      <div class="filter-bar">
        <NuxtLink
          v-for="item in statusFilters"
          :key="item.value || 'all'"
          class="ghost-button small-filter"
          :class="{ active: currentStatus === item.value }"
          :to="{ path: '/activities', query: item.value ? { status: item.value } : {} }"
        >
          {{ item.label }}
        </NuxtLink>
      </div>
      <div v-if="activities?.length" class="content-grid">
        <ContentCard
          v-for="activity in activities"
          :key="activity.slug"
          :title="activity.title"
          :summary="activity.summary"
          :image="activity.coverImage"
          :date="formatDate(activity.startTime)"
          :badge="statusLabel(activity.status)"
          :to="`/activities/${activity.slug}`"
        />
      </div>
      <EmptyState v-else title="暂无活动" message="当前筛选条件下没有活动，试试切换状态。" />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ActivitySummary } from '~/types/content'

const route = useRoute()
const currentStatus = computed(() => String(route.query.status ?? ''))
const query = computed(() => ({ page: 1, pageSize: 10, status: currentStatus.value }))
const { data: activities } = await useActivities(query)

const statusFilters = [
  { label: '全部', value: '' },
  { label: '即将开始', value: 'upcoming' },
  { label: '进行中', value: 'ongoing' },
  { label: '已结束', value: 'ended' }
]

useSeoMeta({
  title: '社团活动 - 长春理工大学 Minecraft 社团',
  description: '展示近期活动和历史活动。'
})

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' }).format(new Date(value))
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
