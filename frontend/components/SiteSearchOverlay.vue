<template>
  <Teleport to="body">
    <Transition name="search-overlay">
      <div v-if="open" class="site-search-backdrop" @click.self="closeSearch">
        <section
          ref="dialog"
          class="site-search-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="site-search-title"
          @keydown.esc.prevent="closeSearch"
          @keydown.enter.prevent="goFirstResult"
          @keydown.tab="trapFocus"
        >
          <div class="site-search-header">
            <div>
              <p class="search-kicker">Command Search</p>
              <h2 id="site-search-title">全站搜索</h2>
            </div>
            <button class="search-close-button" type="button" aria-label="关闭搜索" @click="closeSearch">×</button>
          </div>

          <label class="search-input-wrap" for="site-search-input">
            <img src="/example-assets/search-magnifier-pixel.svg" alt="" aria-hidden="true">
            <input
              id="site-search-input"
              ref="searchInput"
              v-model.trim="query"
              type="search"
              autocomplete="off"
              placeholder="输入活动、公告、动态、社员或入口"
            >
          </label>

          <div v-if="!query" class="search-suggestions" aria-label="热门搜索">
            <span>热门搜索</span>
            <button v-for="item in suggestions" :key="item" type="button" @click="query = item">{{ item }}</button>
          </div>

          <p
            class="search-index-status"
            :class="{ 'is-visible': searchIndexStatusMessage }"
            role="status"
            aria-live="polite"
          >
            {{ searchIndexStatusMessage || '\u00a0' }}
          </p>

          <div class="search-result-shell">
            <Transition name="search-results" mode="out-in">
              <div v-if="groupedResults.length" :key="searchResultStateKey" class="search-results-motion">
                <TransitionGroup name="search-result-group" tag="div" class="search-result-groups">
                  <section v-for="group in groupedResults" :key="group.type" class="search-result-group">
                    <h3>{{ group.type }}</h3>
                    <TransitionGroup name="search-result-item" tag="div" class="search-result-items">
                      <component
                        :is="resultComponent(result)"
                        v-for="result in group.items"
                        :key="resultKey(result)"
                        class="search-result-item"
                        :class="{ 'is-disabled': result.disabled }"
                        v-bind="resultLinkAttrs(result)"
                        @click="closeSearch"
                      >
                        <span class="search-result-badge">{{ result.type }}</span>
                        <span>
                          <strong>{{ result.title }}</strong>
                          <small>{{ result.description }}</small>
                        </span>
                      </component>
                    </TransitionGroup>
                  </section>
                </TransitionGroup>
              </div>

              <div v-else :key="`empty-${query || 'idle'}`" class="search-empty-state">
                <strong>{{ query ? '没有找到相关方块' : '输入关键词开始搜索' }}</strong>
                <span>{{ query ? '换个关键词试试，比如“建筑”“服务器”“加入我们”。' : '也可以直接点击热门搜索标签。' }}</span>
              </div>
            </Transition>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type {
  ActivitySummary,
  AnnouncementSummary,
  ApiResponse,
  ExternalService,
  MemberProfile,
  NavLink,
  PostSummary,
  ServiceStatus
} from '~/types/content'

interface SearchResult {
  type: string
  title: string
  description: string
  href: string
  keywords: string[]
  disabled?: boolean
}

type SearchIndexStatus = 'idle' | 'loading' | 'ready' | 'error'

const props = defineProps<{
  open: boolean
  navigation: NavLink[]
  externalServices: ExternalService[]
  serviceStatus?: ServiceStatus
}>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  closed: []
}>()

const route = useRoute()
const query = ref('')
const dialog = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const suggestions = ['建筑', '服务器', '加入我们', '公告', '红石']
const indexStatus = ref<SearchIndexStatus>('idle')
const activities = ref<ActivitySummary[]>([])
const announcements = ref<AnnouncementSummary[]>([])
const posts = ref<PostSummary[]>([])
const members = ref<MemberProfile[]>([])

const hasContentIndexResults = computed(() =>
  activities.value.length > 0 ||
  announcements.value.length > 0 ||
  posts.value.length > 0 ||
  members.value.length > 0
)

const searchIndexStatusMessage = computed(() => {
  if (indexStatus.value === 'loading') {
    return '正在同步活动、公告、动态和社员索引...'
  }

  if (indexStatus.value === 'error') {
    return hasContentIndexResults.value
      ? '部分内容暂不可搜索，快捷入口仍可使用。'
      : '内容索引暂不可用，快捷入口仍可使用。'
  }

  return ''
})

const searchIndex = computed<SearchResult[]>(() => {
  const serviceEntries = props.externalServices
  const searchableServices = serviceEntries.filter((service) => service.showInSearch)

  return [
    ...props.navigation.map((item) => ({
      type: '入口',
      title: item.label,
      description: getEntryDescription(item.href),
      href: item.href,
      keywords: [item.label, item.href]
    })),
    ...searchableServices.map((service) => {
      const href = service.url?.trim() || ''
      const disabled = !service.enabled || !href

      return {
        type: '入口',
        title: service.name,
        description: disabled ? service.disabledReason || `${service.name}入口暂不可用。` : service.summary,
        href,
        keywords: [service.name, service.summary, service.key, href].filter(Boolean),
        disabled
      }
    }),
    {
      type: '入口',
      title: '社团服务状态',
      description: (props.serviceStatus?.services ?? []).map((item) => item.name).join(' / '),
      href: props.serviceStatus?.href ?? '/maintenance',
      keywords: [
        '服务状态',
        '服务器',
        '维护',
        '在线',
        ...(props.serviceStatus?.services ?? []).map((item) => item.name)
      ]
    },
    ...(activities.value ?? []).map((activity) => ({
      type: '活动',
      title: activity.title,
      description: activity.summary,
      href: `/activities/${activity.slug}`,
      keywords: [activity.title, activity.summary, activity.location ?? '', activity.status]
    })),
    ...(announcements.value ?? []).map((announcement) => ({
      type: '公告',
      title: announcement.title,
      description: announcement.summary,
      href: `/announcements/${announcement.slug}`,
      keywords: [announcement.title, announcement.summary, announcement.category]
    })),
    ...(posts.value ?? []).map((post) => ({
      type: '动态',
      title: post.title,
      description: post.summary,
      href: `/posts/${post.slug}`,
      keywords: [post.title, post.summary, post.category, post.authorName, ...post.tags]
    })),
    ...(members.value ?? []).map((member) => ({
      type: '社员',
      title: member.displayName,
      description: `${member.group} · ${member.roleTitle}`,
      href: `/members#${member.slug}`,
      keywords: [member.displayName, member.group, member.roleTitle, member.bio, ...member.works]
    }))
  ]
})

const results = computed(() => {
  const keyword = normalize(query.value)

  if (!keyword) {
    return searchIndex.value.slice(0, 8)
  }

  return searchIndex.value
    .map((item) => ({ item, score: getScore(item, keyword) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(({ item }) => item)
})

const groupedResults = computed(() => {
  const groups = new Map<string, SearchResult[]>()

  for (const result of results.value) {
    groups.set(result.type, [...(groups.get(result.type) ?? []), result])
  }

  return [...groups.entries()].map(([type, items]) => ({ type, items }))
})
const searchResultStateKey = computed(() => {
  return `results-${query.value || 'suggested'}`
})

watch(
  () => props.open,
  async (value) => {
    if (!import.meta.client) {
      return
    }

    document.body.classList.toggle('search-is-open', value)

    if (value) {
      void loadContentIndex()
      await nextTick()
      searchInput.value?.focus()
      return
    }

    query.value = ''
    emit('closed')
  },
  { immediate: true }
)

watch(
  () => route.fullPath,
  () => {
    if (props.open) {
      closeSearch()
    }
  }
)

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.classList.remove('search-is-open')
  }
})

function closeSearch() {
  emit('update:open', false)
}

async function loadContentIndex() {
  if (indexStatus.value === 'loading' || indexStatus.value === 'ready') {
    return
  }

  indexStatus.value = 'loading'

  const [activityResult, announcementResult, postResult, memberResult] = await Promise.allSettled([
    fetchSearchList<ActivitySummary[]>('/api/public/activities', { page: 1, pageSize: 20 }),
    fetchSearchList<AnnouncementSummary[]>('/api/public/announcements', { page: 1, pageSize: 20 }),
    fetchSearchList<PostSummary[]>('/api/public/posts', { page: 1, pageSize: 20 }),
    fetchSearchList<MemberProfile[]>('/api/public/members')
  ])

  if (activityResult.status === 'fulfilled') {
    activities.value = activityResult.value
  }

  if (announcementResult.status === 'fulfilled') {
    announcements.value = announcementResult.value
  }

  if (postResult.status === 'fulfilled') {
    posts.value = postResult.value
  }

  if (memberResult.status === 'fulfilled') {
    members.value = memberResult.value
  }

  indexStatus.value = [activityResult, announcementResult, postResult, memberResult].every((result) => result.status === 'fulfilled')
    ? 'ready'
    : 'error'
}

async function fetchSearchList<T>(url: string, query?: Record<string, string | number>) {
  const response = await $fetch<ApiResponse<T>>(url, { query })

  if (!response.success) {
    throw new Error(response.error.message)
  }

  return response.data
}

function goFirstResult() {
  const first = results.value[0]

  if (!first || first.disabled) {
    return
  }

  closeSearch()

  if (isExternalLink(first.href)) {
    if (import.meta.client) {
      window.location.href = first.href
    }
    return
  }

  navigateTo(first.href)
}

function trapFocus(event: KeyboardEvent) {
  const focusable = dialog.value?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])')

  if (!focusable?.length) {
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function getScore(result: SearchResult, keyword: string) {
  const title = normalize(result.title)
  const description = normalize(result.description)
  const keywords = result.keywords.map(normalize).join(' ')

  if (title === keyword) return 100
  if (title.includes(keyword)) return 80
  if (keywords.includes(keyword)) return 55
  if (description.includes(keyword)) return 35
  return 0
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, '')
}

function isExternalLink(href: string) {
  return /^https?:\/\//.test(href)
}

function resultComponent(result: SearchResult) {
  if (result.disabled) {
    return 'button'
  }

  return isExternalLink(result.href) ? 'a' : 'NuxtLink'
}

function resultKey(result: SearchResult) {
  return `${result.type}-${result.title}-${result.href || 'disabled'}`
}

function resultLinkAttrs(result: SearchResult) {
  if (result.disabled) {
    return {
      type: 'button',
      disabled: true,
      'aria-disabled': 'true'
    }
  }

  if (isExternalLink(result.href)) {
    return {
      href: result.href,
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  }

  return { to: result.href }
}

function getEntryDescription(href: string) {
  const descriptions: Record<string, string> = {
    '/': '返回官网首页，查看社团概览与最新内容。',
    '/about': '了解社团方向、分组和服务器说明。',
    '/activities': '查看建筑比赛、生存挑战和联机活动。',
    '/announcements': '查看维护通知、结果公示和正式安排。',
    '/posts': '阅读服务器日常、成员创作和社团花絮。',
    '/members': '认识建筑组、红石组、运维组和活动组成员。',
    '/join': '查看加入方式、要求和申请入口。'
  }

  return descriptions[href] ?? '快速进入站内页面。'
}
</script>
