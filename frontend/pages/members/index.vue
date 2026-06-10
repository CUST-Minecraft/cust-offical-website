<template>
  <div>
    <PageHero
      eyebrow="Members"
      title="社员介绍"
      summary="公开展示社员分组、职责和代表作品，不展示真实姓名、学号、手机号等敏感信息。"
      :image="{ src: '/example-assets/section-members-pixel.png', alt: '社员介绍头图' }"
    />
    <section class="content-section">
      <div v-if="members?.length" class="member-grid">
        <article v-for="member in members" :key="member.slug" class="member-card">
          <div class="member-avatar" :style="{ backgroundImage: `url('${member.avatar?.src ?? '/example-assets/section-members-pixel.png'}')` }" />
          <h2>{{ member.displayName }}</h2>
          <strong>{{ member.roleTitle }}</strong>
          <span>{{ member.group }}</span>
          <p>{{ member.bio }}</p>
          <div class="promo-tags">
            <span v-for="work in member.works" :key="work">{{ work }}</span>
          </div>
        </article>
      </div>
      <EmptyState v-else title="暂无公开社员资料" message="可见社员资料会在内容管理员维护后展示。" />
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: members } = await useMembers()

useSeoMeta({
  title: '社员介绍 - 长春理工大学 Minecraft 社团',
  description: '展示公开社员资料、分组、职责和代表作品。'
})
</script>
