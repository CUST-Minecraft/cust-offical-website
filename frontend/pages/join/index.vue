<template>
  <div v-if="page">
    <PageHero
      eyebrow="Join CUSTMC"
      :title="page.title"
      :summary="page.summary"
      :image="page.coverImage"
      :hints="{
        title: joinPageFieldHint('title', '加入页 Hero 标题'),
        summary: joinPageFieldHint('summary', '加入页 Hero 摘要'),
        image: joinPageFieldHint('coverImage', '加入页 Hero 头图')
      }"
    />
    <section class="content-section join-story">
      <article class="join-flow-panel motion-reveal">
        <div class="section-heading compact join-flow-heading">
          <span class="promo-kicker">Open Join Flow</span>
          <h2>加入流程</h2>
          <RichTextRenderer v-field-hint="joinPageFieldHint('introContent', '加入流程引导说明')" :content="page.introContent" />
        </div>

        <div class="join-flow-track motion-stagger">
          <article v-for="(step, index) in page.processSteps" :key="step.title" class="join-flow-step motion-reveal">
            <figure v-if="step.image" v-field-hint="processStepHint('image', step, index, '流程步骤图片')" class="join-flow-media">
              <img :src="step.image.src" :alt="step.image.alt">
              <figcaption v-if="step.imageCaption" v-field-hint="processStepHint('imageCaption', step, index, '流程步骤图片说明')">{{ step.imageCaption }}</figcaption>
            </figure>
            <div class="join-flow-copy">
              <span class="join-flow-index">{{ stepNumber(index) }}</span>
              <h2 v-field-hint="processStepHint('title', step, index, '流程步骤标题')">{{ step.title }}</h2>
              <p v-field-hint="processStepHint('summary', step, index, '流程步骤摘要')">{{ step.summary }}</p>
              <ul v-if="step.items.length" class="join-flow-items">
                <li v-for="item in step.items" :key="item" v-field-hint="processStepHint('items', step, index, `流程步骤条目：${item}`)">{{ item }}</li>
              </ul>
              <div v-if="step.primaryActionLabel && step.primaryActionUrl" class="join-flow-actions">
                <a
                  v-if="isExternalUrl(step.primaryActionUrl)"
                  v-field-hint="processStepHint('primaryActionLabel', step, index, '流程步骤动作按钮文字')"
                  class="pixel-button small"
                  :href="step.primaryActionUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ step.primaryActionLabel }}<span aria-hidden="true">›</span>
                </a>
                <NuxtLink
                  v-else
                  v-field-hint="processStepHint('primaryActionLabel', step, index, '流程步骤动作按钮文字')"
                  class="ghost-button"
                  :to="step.primaryActionUrl"
                >
                  {{ step.primaryActionLabel }}<span aria-hidden="true">›</span>
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </article>

      <article class="faq-panel motion-reveal">
        <div class="section-heading compact">
          <span class="promo-kicker">FAQ</span>
          <h2>常见问题</h2>
        </div>
        <div class="faq-list">
          <details v-for="faq in page.faqItems" :key="faq.question">
            <summary v-field-hint="joinPageFieldHint('faqItems.question', `FAQ 问题：${faq.question}`)">{{ faq.question }}</summary>
            <p v-field-hint="joinPageFieldHint('faqItems.answer', `FAQ 回答：${faq.question}`)">{{ faq.answer }}</p>
          </details>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { JoinProcessStep } from '~/types/content'
import { joinPageFieldHint } from '~/utils/field-hints'

const { data: page } = await useJoinPage()

useSeoMeta({
  title: computed(() => `${page.value?.title ?? '加入我们'} - 长春理工大学 Minecraft 社团`),
  description: computed(() => page.value?.summary ?? '加入我们')
})

function stepNumber(index: number) {
  return String(index + 1).padStart(2, '0')
}

function isExternalUrl(url: string) {
  return /^https?:\/\//.test(url)
}

function processStepHint(field: string, step: JoinProcessStep, index: number, usage: string) {
  return joinPageFieldHint(`processSteps.${field}`, `${usage}：${step.title || `第 ${index + 1} 步`}`)
}
</script>
