<template>
  <div v-if="home">
    <HomeHero :hero="home.hero" />

    <section class="overview" aria-label="社团信息概览">
      <div class="banner-stack motion-stagger">
        <PromoBanner
          kicker="About CUSTMC"
          :title="home.intro.title"
          :body="home.intro.body"
          :image="introImage"
          :link-label="home.intro.linkLabel"
          :hints="{
            title: homePageFieldHint('intro.title', '首页社团介绍标题'),
            body: homePageFieldHint('intro.body', '首页社团介绍正文'),
            linkLabel: homePageFieldHint('intro.linkLabel', '首页社团介绍按钮')
          }"
          to="/about"
        >
          <div class="promo-tags motion-stagger">
            <span v-for="tag in home.intro.tags" :key="tag" v-field-hint="homePageFieldHint('intro.tags', `首页社团介绍标签：${tag}`)" class="motion-reveal">{{ tag }}</span>
          </div>
        </PromoBanner>

        <PromoBanner
          type="event-banner"
          align="right"
          kicker="Events"
          title="社团活动"
          body="把建筑比赛、生存挑战、红石创作和联机活动做成每个月都能期待的校园方块事件。"
          :image="activityBannerImage"
          link-label="更多活动"
          to="/activities"
        >
          <ul v-if="home.activities.length" class="promo-event-list is-uniform motion-stagger">
            <li v-for="activity in home.activities.slice(0, 3)" :key="activity.slug" class="motion-reveal">
              <NuxtLink class="promo-event-card-link" :to="`/activities/${activity.slug}`" :aria-label="`查看活动：${activity.title}`" />
              <time v-field-hint="activityFieldHint('startTime', `首页活动时间：${activity.title}`)">{{ formatDottedMonthDay(activity.startTime) }}</time>
              <span>
                <strong v-field-hint="activityFieldHint('title', `首页活动标题：${activity.title}`)">{{ activity.title }}</strong>
                <small v-field-hint="activityFieldHint('summary', `首页活动摘要：${activity.title}`)">{{ activity.summary }}</small>
              </span>
            </li>
          </ul>
          <p v-else class="promo-empty-note motion-reveal">近期活动发布后会出现在这里。</p>
        </PromoBanner>

        <PromoBanner
          type="announcement-banner"
          kicker="Announcements"
          title="社团公告"
          body="正式通知、维护说明、结果公示和重要安排会集中放在这里，方便游客和社员快速确认准确信息。"
          :image="announcementBannerImage"
          link-label="查看公告"
          to="/announcements"
        >
          <ul v-if="home.announcements.length" class="promo-event-list is-uniform motion-stagger">
            <li v-for="announcement in home.announcements.slice(0, 3)" :key="announcement.slug" class="motion-reveal">
              <NuxtLink class="promo-event-card-link" :to="`/announcements/${announcement.slug}`" :aria-label="`查看公告：${announcement.title}`" />
              <time v-field-hint="announcementFieldHint('publishedAt', `首页公告发布时间：${announcement.title}`)">{{ formatDottedMonthDay(announcement.publishedAt) }}</time>
              <span>
                <strong v-field-hint="announcementFieldHint('title', `首页公告标题：${announcement.title}`)">{{ announcement.title }}</strong>
                <small v-field-hint="announcementFieldHint('summary', `首页公告摘要：${announcement.title}`)">{{ announcement.summary }}</small>
              </span>
            </li>
          </ul>
          <p v-else class="promo-empty-note motion-reveal">暂无公告，正式通知发布后会在这里更新。</p>
        </PromoBanner>

        <PromoBanner
          type="updates-banner"
          align="right"
          kicker="Updates"
          title="社团动态"
          body="这里发布社团博文、服务器日常、成员创作、活动花絮和社团里发生的小事。它不是正式公告，更像一条持续更新的方块生活线。"
          :image="postBannerImage"
          link-label="阅读动态"
          to="/posts"
        >
          <div class="promo-tags motion-stagger">
            <span v-for="tag in ['服务器日常', '活动花絮', '成员创作']" :key="tag" class="motion-reveal">{{ tag }}</span>
          </div>
        </PromoBanner>

        <PromoBanner
          type="gallery-banner"
          align="right"
          kicker="Gallery"
          title="精彩瞬间"
          body="记录建筑、活动、合影和服务器里的高光时刻，把属于长理的方块故事留在这里。"
          :image="galleryBannerImage"
          link-label="更多照片"
          to="/posts"
        >
          <div v-if="home.gallery.length > 1" class="promo-thumbs motion-stagger">
            <span v-for="item in home.gallery.slice(1)" :key="item.title" class="motion-reveal" :style="{ backgroundImage: `url('${item.image.src}')` }">
              <strong v-field-hint="galleryFieldHint('title', `首页图库标题：${item.title}`)">{{ item.title }}</strong>
              <small v-field-hint="galleryFieldHint('tag', `首页图库标签：${item.title}`)">{{ item.tag }}</small>
            </span>
          </div>
          <p v-else class="promo-empty-note motion-reveal">精彩瞬间整理后会在这里展示。</p>
        </PromoBanner>

        <PromoBanner
          type="members-banner"
          kicker="Members"
          title="社员介绍"
          body="这里聚集了建筑师、红石玩家、服务器维护者和热爱创造的同学。每个人都能在方块世界里找到自己的位置。"
          :image="memberBannerImage"
          link-label="认识大家"
          to="/members"
        >
          <div v-if="memberGroups.length" class="promo-tags member-tags motion-stagger">
            <span v-for="group in memberGroups" :key="group" v-field-hint="memberFieldHint('group', `首页社员分组：${group}`)" class="motion-reveal">{{ group }}</span>
          </div>
          <div v-if="home.members.length" class="member-strip motion-stagger">
            <span v-for="(member, index) in home.members" :key="member.slug" class="member-token motion-reveal" :class="`skin-${index + 1}`">
              <i />
              <strong v-field-hint="memberFieldHint('displayName', `首页社员名称：${member.displayName}`)">{{ member.displayName }}</strong>
              <small v-field-hint="memberFieldHint('group', `首页社员分组：${member.displayName}`)">{{ member.group }}</small>
            </span>
          </div>
          <p v-else class="promo-empty-note motion-reveal">公开社员资料维护后会在这里展示。</p>
        </PromoBanner>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ImageRef } from '~/types/content'
import {
  activityFieldHint,
  announcementFieldHint,
  galleryFieldHint,
  homePageFieldHint,
  memberFieldHint
} from '~/utils/field-hints'
import { formatDottedMonthDay } from '~/utils/format'

const { data: home } = await useHome()

const fallbackImages = {
  intro: { src: '/example-assets/section-intro-pixel.png', alt: '社团介绍默认展示图' },
  activity: { src: '/example-assets/section-events-pixel.png', alt: '社团活动默认展示图' },
  announcement: { src: '/example-assets/cust-main-gate-hero.png', alt: '社团公告默认展示图' },
  post: { src: '/example-assets/section-gallery-pixel.png', alt: '社团动态默认展示图' },
  gallery: { src: '/example-assets/cust-campus-hero-wide.png', alt: '精彩瞬间默认展示图' },
  member: { src: '/example-assets/section-members-pixel.png', alt: '社员介绍默认展示图' },
  hero: { src: '/example-assets/hero-campus.png', alt: '首页 Hero 默认展示图' }
} satisfies Record<string, ImageRef>

const memberGroups = computed(() => [...new Set(home.value?.members.map((member) => member.group) ?? [])])
const firstGalleryImage = computed(() => home.value?.gallery.find((item) => hasImage(item.image))?.image)
const introImage = computed(() => safeImage(home.value?.intro.image, fallbackImages.intro))
const activityBannerImage = computed(() => safeImage(home.value?.activities[0]?.coverImage, firstGalleryImage.value, fallbackImages.activity))
const announcementBannerImage = computed(() => safeImage(firstGalleryImage.value, fallbackImages.announcement))
const postBannerImage = computed(() => safeImage(home.value?.posts[0]?.coverImage, firstGalleryImage.value, fallbackImages.post))
const galleryBannerImage = computed(() => safeImage(firstGalleryImage.value, fallbackImages.gallery))
const memberBannerImage = computed(() => safeImage(home.value?.members[0]?.avatar, firstGalleryImage.value, fallbackImages.member))
const heroOgImage = computed(() => home.value?.hero.slides.find((slide) => slide.background)?.background || fallbackImages.hero.src)

useSeoMeta({
  title: '长春理工大学 Minecraft 社团',
  description: '创造、探索、联机、建筑。用方块构建属于长理的世界。',
  ogTitle: '长春理工大学 Minecraft 社团',
  ogDescription: '用方块构建属于长理的世界。',
  ogImage: heroOgImage
})

function hasImage(value?: ImageRef) {
  return Boolean(value?.src)
}

function safeImage(...candidates: (ImageRef | undefined)[]) {
  return candidates.find(hasImage) ?? fallbackImages.intro
}

</script>
