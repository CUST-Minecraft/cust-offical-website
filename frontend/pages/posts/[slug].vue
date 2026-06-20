<template>
  <section v-if="post" class="content-section detail-wrap">
    <DetailArticle
      :title="post.title"
      :summary="post.summary"
      :content="post.content"
      :image="post.coverImage"
      :date="formatMediumDateTime(post.publishedAt)"
      :category="`${post.category} · ${post.authorName}`"
    >
      <div class="promo-tags detail-tags">
        <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
      </div>
      <div v-if="post.gallery.length" class="gallery-grid">
        <img v-for="image in post.gallery" :key="image.src" :src="image.src" :alt="image.alt">
      </div>
      <div class="detail-actions">
        <NuxtLink class="ghost-button" to="/posts">返回动态列表<span aria-hidden="true">›</span></NuxtLink>
      </div>
    </DetailArticle>
  </section>
</template>

<script setup lang="ts">
import { formatMediumDateTime } from '~/utils/format'

const route = useRoute()
const { data: post } = await usePostDetail(String(route.params.slug))

useSeoMeta({
  title: computed(() => `${post.value?.title ?? '动态详情'} - 长春理工大学 Minecraft 社团`),
  description: computed(() => post.value?.summary ?? '动态详情'),
  ogImage: computed(() => post.value?.coverImage?.src)
})

</script>
