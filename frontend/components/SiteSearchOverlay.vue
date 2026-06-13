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
            <button ref="closeButton" class="search-close-button" type="button" aria-label="关闭搜索" @click="closeSearch">×</button>
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

          <div class="search-result-shell">
            <template v-if="groupedResults.length">
              <section v-for="group in groupedResults" :key="group.type" class="search-result-group">
                <h3>{{ group.type }}</h3>
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
              </section>
            </template>

            <div v-else class="search-empty-state">
              <strong>{{ query ? '没有找到相关方块' : '输入关键词开始搜索' }}</strong>
              <span>{{ query ? '换个关键词试试，比如“建筑”“服务器”“加入我们”。' : '也可以直接点击热门搜索标签。' }}</span>
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface SearchResult {
  type: string
  title: string
  description: string
  href: string
  keywords: string[]
  disabled?: boolean
}

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  closed: []
}>()

const route = useRoute()
const query = ref('')
const dialog = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const suggestions = ['建筑', '服务器', '加入我们', '公告', '红石']
const { data: settings } = await useSiteSettings()
const { data: activities } = await useActivities({ page: 1, pageSize: 20 })
const { data: announcements } = await useAnnouncements({ page: 1, pageSize: 20 })
const { data: posts } = await usePosts({ page: 1, pageSize: 20 })
const { data: members } = await useMembers()

const searchIndex = computed<SearchResult[]>(() => {
  const skinConsoleUrl = settings.value?.site.skinConsoleUrl
  const documentCenterUrl = settings.value?.site.documentCenterUrl?.trim() ?? ''

  return [
    ...(settings.value?.navigation ?? []).map((item) => ({
      type: '入口',
      title: item.label,
      description: getEntryDescription(item.href),
      href: item.href,
      keywords: [item.label, item.href]
    })),
    ...(skinConsoleUrl
      ? [
          {
            type: '入口',
            title: '皮肤站',
            description: '进入独立皮肤站，管理 Minecraft 皮肤和个人形象。',
            href: skinConsoleUrl,
            keywords: ['皮肤站', '皮肤', skinConsoleUrl]
          }
        ]
      : []),
    {
      type: '入口',
      title: '文档中心',
      description: documentCenterUrl ? '打开社团文档中心，查看规约、说明和协作资料。' : '文档中心入口暂未配置。',
      href: documentCenterUrl,
      keywords: ['文档中心', '文档', '资料', '规约', '说明', documentCenterUrl].filter(Boolean),
      disabled: !documentCenterUrl
    },
    {
      type: '入口',
      title: '社团服务状态',
      description: (settings.value?.serviceStatus.services ?? []).map((item) => item.name).join(' / '),
      href: settings.value?.serviceStatus.href ?? '/maintenance',
      keywords: [
        '服务状态',
        '服务器',
        '维护',
        '在线',
        ...(settings.value?.serviceStatus.services ?? []).map((item) => item.name)
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

watch(
  () => props.open,
  async (value) => {
    if (!import.meta.client) {
      return
    }

    document.body.classList.toggle('search-is-open', value)

    if (value) {
      await nextTick()
      searchInput.value?.focus()
      return
    }

    query.value = ''
    emit('closed')
  }
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

void closeButton
</script>
