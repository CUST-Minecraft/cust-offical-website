<template>
  <div v-if="page">
    <PageHero eyebrow="About CUSTMC" :title="page.title" :summary="page.summary" :image="page.coverImage" />
    <section class="content-section page-story">
      <article class="story-showcase" :style="{ '--story-bg': `url('${page.coverImage.src}')` }">
        <div class="story-copy">
          <span class="promo-kicker">Block by Block</span>
          <h2>把校园、创作和朋友放进同一个世界</h2>
          <p>{{ page.content }}</p>
          <div class="story-stats" aria-label="社团概览">
            <span><strong>2014</strong><small>社团起点</small></span>
            <span><strong>4</strong><small>共创分组</small></span>
            <span><strong>24h</strong><small>服务器陪伴</small></span>
          </div>
        </div>
        <div class="story-card-stack" aria-hidden="true">
          <span>Campus Build</span>
          <span>Redstone Lab</span>
          <span>Server Life</span>
        </div>
      </article>

      <div class="section-heading">
        <span class="promo-kicker">Groups</span>
        <h2>四个方向，一起把世界搭起来</h2>
      </div>
      <div class="group-grid">
        <article v-for="(group, index) in page.groups" :key="group.name" class="group-card">
          <span class="group-index">0{{ index + 1 }}</span>
          <h2>{{ group.name }}</h2>
          <p>{{ group.summary }}</p>
          <i />
        </article>
      </div>

      <article class="server-showcase">
        <div class="server-console">
          <span class="promo-kicker">Server</span>
          <h2>服务器概览</h2>
          <p>{{ page.serverSummary }}</p>
          <ul class="server-lines">
            <li><span>IP</span><strong>custmc.cn:25565</strong></li>
            <li><span>VERSION</span><strong>1.20.1 Java / 基岩版</strong></li>
            <li><span>MODE</span><strong>生存 / 建筑 / 创造</strong></li>
          </ul>
        </div>
        <div class="join-callout">
          <h2>想参与下一块方块吗？</h2>
          <p>{{ page.joinGuide }}</p>
          <NuxtLink class="pixel-button" to="/join">加入我们<span aria-hidden="true">›</span></NuxtLink>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: page } = await useAboutPage()

useSeoMeta({
  title: computed(() => `${page.value?.title ?? '社团介绍'} - 长春理工大学 Minecraft 社团`),
  description: computed(() => page.value?.summary ?? '社团介绍')
})
</script>
