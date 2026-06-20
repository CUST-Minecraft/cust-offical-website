<template>
  <div>
    <PageHero
      eyebrow="Updates"
      title="社团动态"
      summary="社团博文、服务器日常、成员创作进展和活动花絮。"
      :image="{ src: '/example-assets/section-gallery-pixel.png', alt: '社团动态头图' }"
    />
    <section class="content-section">
      <div v-if="posts?.length" class="content-grid motion-stagger">
        <ContentCard
          v-for="post in posts"
          :key="post.slug"
          :title="post.title"
          :summary="post.summary"
          :image="post.coverImage"
          :date="formatMediumDate(post.publishedAt)"
          :category="post.category"
          :badge="post.isFeatured ? '推荐' : undefined"
          :to="`/posts/${post.slug}`"
        />
      </div>
      <EmptyState v-else title="暂无动态" message="公开动态会在内容管理员发布后展示。" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { formatMediumDate } from '~/utils/format'

const { data: posts } = await usePosts({ page: 1, pageSize: 10 })

useSeoMeta({
  title: '社团动态 - 长春理工大学 Minecraft 社团',
  description: '展示社团博文、服务器日常、成员创作进展和活动花絮。'
})

</script>
