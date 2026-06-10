<template>
  <div v-if="home">
    <HomeHero :hero="home.hero" />

    <section class="overview" aria-label="社团信息概览">
      <div class="banner-stack">
        <PromoBanner
          kicker="About CUSTMC"
          :title="home.intro.title"
          :body="home.intro.body"
          :image="home.intro.image"
          :link-label="home.intro.linkLabel"
          to="/about"
        >
          <div class="promo-tags">
            <span v-for="tag in home.intro.tags" :key="tag">{{ tag }}</span>
          </div>
        </PromoBanner>

        <PromoBanner
          type="event-banner"
          align="right"
          kicker="Events"
          title="社团活动"
          body="把建筑比赛、生存挑战、红石创作和联机活动做成每个月都能期待的校园方块事件。"
          :image="home.activities[0].coverImage"
          link-label="更多活动"
          to="/activities"
        >
          <ul class="promo-event-list is-uniform">
            <li v-for="activity in home.activities.slice(0, 3)" :key="activity.slug">
              <NuxtLink class="promo-event-card-link" :to="`/activities/${activity.slug}`" :aria-label="`查看活动：${activity.title}`" />
              <time>{{ formatShortDate(activity.startTime) }}</time>
              <span>
                <strong>{{ activity.title }}</strong>
                <small>{{ activity.summary }}</small>
              </span>
            </li>
          </ul>
        </PromoBanner>

        <PromoBanner
          type="announcement-banner"
          kicker="Announcements"
          title="社团公告"
          body="正式通知、维护说明、结果公示和重要安排会集中放在这里，方便游客和社员快速确认准确信息。"
          :image="home.activities[0].coverImage"
          link-label="查看公告"
          to="/announcements"
        >
          <ul class="promo-event-list is-uniform">
            <li v-for="announcement in home.announcements.slice(0, 3)" :key="announcement.slug">
              <NuxtLink class="promo-event-card-link" :to="`/announcements/${announcement.slug}`" :aria-label="`查看公告：${announcement.title}`" />
              <time>{{ formatShortDate(announcement.publishedAt) }}</time>
              <span>
                <strong>{{ announcement.title }}</strong>
                <small>{{ announcement.summary }}</small>
              </span>
            </li>
          </ul>
        </PromoBanner>

        <PromoBanner
          type="updates-banner"
          align="right"
          kicker="Updates"
          title="社团动态"
          body="这里发布社团博文、服务器日常、成员创作、活动花絮和社团里发生的小事。它不是正式公告，更像一条持续更新的方块生活线。"
          :image="home.posts[0].coverImage ?? home.gallery[0].image"
          link-label="阅读动态"
          to="/posts"
        >
          <div class="promo-tags">
            <span v-for="tag in ['服务器日常', '活动花絮', '成员创作']" :key="tag">{{ tag }}</span>
          </div>
        </PromoBanner>

        <PromoBanner
          type="gallery-banner"
          align="right"
          kicker="Gallery"
          title="精彩瞬间"
          body="记录建筑、活动、合影和服务器里的高光时刻，把属于长理的方块故事留在这里。"
          :image="home.gallery[0].image"
          link-label="更多照片"
          to="/posts"
        >
          <div class="promo-thumbs">
            <span v-for="item in home.gallery.slice(1)" :key="item.title" :style="{ backgroundImage: `url('${item.image.src}')` }">
              <strong>{{ item.title }}</strong>
              <small>{{ item.tag }}</small>
            </span>
          </div>
        </PromoBanner>

        <PromoBanner
          type="members-banner"
          kicker="Members"
          title="社员介绍"
          body="这里聚集了建筑师、红石玩家、服务器维护者和热爱创造的同学。每个人都能在方块世界里找到自己的位置。"
          :image="home.members[0].avatar ?? home.gallery[0].image"
          link-label="认识大家"
          to="/members"
        >
          <div class="promo-tags member-tags">
            <span v-for="group in memberGroups" :key="group">{{ group }}</span>
          </div>
          <div class="member-strip">
            <span v-for="(member, index) in home.members" :key="member.slug" class="member-token" :class="`skin-${index + 1}`">
              <i />
              <strong>{{ member.displayName }}</strong>
              <small>{{ member.group }}</small>
            </span>
          </div>
        </PromoBanner>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: home } = await useHome()

const memberGroups = computed(() => [...new Set(home.value?.members.map((member) => member.group) ?? [])])

useSeoMeta({
  title: '长春理工大学 Minecraft 社团',
  description: '创造、探索、联机、建筑。用方块构建属于长理的世界。',
  ogTitle: '长春理工大学 Minecraft 社团',
  ogDescription: '用方块构建属于长理的世界。',
  ogImage: home.value?.hero.slides[0].background
})

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' }).format(new Date(value)).replace('/', '.')
}
</script>
