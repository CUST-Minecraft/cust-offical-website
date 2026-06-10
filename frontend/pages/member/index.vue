<template>
  <div>
    <PageHero
      eyebrow="Member Center"
      title="社员中心"
      summary="查看当前 mock 账号、可访问服务、皮肤站入口和内容后台入口。"
      :image="{ src: '/example-assets/cust-main-gate-hero-atmospheric.png', alt: '社员中心头图' }"
    />
    <section class="content-section">
      <article v-if="member" class="pixel-panel split-panel">
        <div>
          <h2>{{ member.displayName }}</h2>
          <p>{{ member.email }}</p>
          <span class="role-badge">{{ roleLabel(member.role) }}</span>
        </div>
        <NuxtLink class="ghost-button" to="/login">切换登录入口<span aria-hidden="true">›</span></NuxtLink>
      </article>

      <div v-if="services?.length" class="info-grid">
        <article v-for="service in services" :key="service.href" class="pixel-panel service-card">
          <h2>{{ service.label }}</h2>
          <p>{{ service.description }}</p>
          <NuxtLink class="promo-link compact" :to="service.href">进入服务<span aria-hidden="true">›</span></NuxtLink>
        </article>
      </div>
      <EmptyState v-else title="暂无可访问服务" message="当前 mock 账号没有可访问的社员服务。" />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { MemberAccount } from '~/types/content'

const { data: member } = await useMemberMe()
const { data: services } = await useMemberServices()

useSeoMeta({
  title: '社员中心 - 长春理工大学 Minecraft 社团',
  robots: 'noindex'
})

function roleLabel(role: MemberAccount['role']) {
  return {
    visitor: '游客',
    member: '社员',
    'content-admin': '内容管理员',
    'super-admin': '超级管理员'
  }[role]
}
</script>
