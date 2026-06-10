<template>
  <div v-if="page">
    <PageHero eyebrow="Join CUSTMC" :title="page.title" :summary="page.summary" :image="page.coverImage" />
    <section class="content-section join-story">
      <article class="join-portal" :style="{ '--join-bg': `url('${page.coverImage.src}')` }">
        <div class="join-portal-copy">
          <span class="promo-kicker">Ready to Spawn</span>
          <h2>从一个入口，进入社团的方块世界</h2>
          <p>{{ page.introContent }}</p>
          <div class="join-actions">
            <a v-if="page.applicationUrl" class="pixel-button" :href="page.applicationUrl" target="_blank" rel="noopener noreferrer">
              立即加入<span aria-hidden="true">›</span>
            </a>
            <NuxtLink class="ghost-button" to="/activities">看看活动<span aria-hidden="true">›</span></NuxtLink>
          </div>
        </div>
        <aside class="contact-console">
          <span class="promo-kicker">Contact</span>
          <h2>联系方式</h2>
          <ul>
            <li v-for="method in page.contactMethods" :key="method.label">
              <span>{{ method.label }}</span>
              <strong>{{ method.value }}</strong>
            </li>
          </ul>
        </aside>
      </article>

      <div class="section-heading">
        <span class="promo-kicker">Checklist</span>
        <h2>加入前确认这些就够了</h2>
      </div>
      <div class="requirement-grid">
        <article v-for="(item, index) in page.requirements" :key="item" class="requirement-card">
          <span>0{{ index + 1 }}</span>
          <p>{{ item }}</p>
        </article>
      </div>

      <div class="section-heading">
        <span class="promo-kicker">Process</span>
        <h2>三步进入社团服务器</h2>
      </div>
      <div class="process-track">
        <article v-for="(step, index) in page.processSteps" :key="step.title" class="process-step">
          <span>{{ index + 1 }}</span>
          <h2>{{ step.title }}</h2>
          <p>{{ step.summary }}</p>
        </article>
      </div>

      <article class="server-showcase join-server">
        <div class="server-console">
          <span class="promo-kicker">Server Guide</span>
          <h2>服务器加入说明</h2>
          <p>{{ page.serverJoinGuide }}</p>
        </div>
        <div class="join-callout">
          <h2>还有疑问？</h2>
          <p>先看下面的常见问题，更多细节可以通过联系方式询问社团成员。</p>
        </div>
      </article>

      <article class="faq-panel">
        <div class="section-heading compact">
          <span class="promo-kicker">FAQ</span>
          <h2>常见问题</h2>
        </div>
        <div class="faq-list">
          <details v-for="faq in page.faqItems" :key="faq.question">
            <summary>{{ faq.question }}</summary>
            <p>{{ faq.answer }}</p>
          </details>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: page } = await useJoinPage()

useSeoMeta({
  title: computed(() => `${page.value?.title ?? '加入我们'} - 长春理工大学 Minecraft 社团`),
  description: computed(() => page.value?.summary ?? '加入我们')
})
</script>
