<template>
  <header class="site-header">
    <NuxtLink class="brand" to="/" :aria-label="site.name">
      <span
        v-field-hint="site.logoImage ? siteFieldHint('logoImage', 'Header Logo') : siteFieldHint('logoText', 'Header 文字 Logo')"
        class="brand-mark"
        :class="{ 'has-logo-image': site.logoImage }"
      >
        <img v-if="site.logoImage" :src="site.logoImage" :alt="`${site.shortName} Logo`">
        <template v-else>{{ site.logoText }}</template>
      </span>
      <span>
        <strong v-field-hint="siteFieldHint('name', 'Header 品牌名')">{{ site.name }}</strong>
        <small v-field-hint="siteFieldHint('englishName', 'Header 英文副标题')">{{ site.englishName }}</small>
      </span>
    </NuxtLink>

    <nav class="desktop-nav" aria-label="主导航">
      <NuxtLink
        v-for="item in navigation"
        :key="item.href"
        v-field-hint="siteFieldHint('navigation', `Header 导航：${item.label}`)"
        class="nav-link"
        :class="{ 'is-active': isActive(item.href) }"
        :to="item.href"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>

    <div class="header-actions">
      <button ref="searchButton" class="search-button" type="button" aria-label="搜索" @click="openSearch">
        <img class="search-icon" src="/example-assets/search-magnifier-pixel.svg" alt="" aria-hidden="true">
        <span>搜索</span>
      </button>
      <a
        v-if="skinService?.url"
        v-field-hint="externalServiceFieldHint('name', 'Header 皮肤站入口')"
        class="skin-button"
        :href="skinService.url"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="打开皮肤站"
      >
        <img class="skin-icon" src="/example-assets/login-portal-obsidian.svg" alt="" aria-hidden="true">
        <span>皮肤站</span>
      </a>
    </div>

    <ClientOnly>
      <SiteSearchOverlay
        v-if="hasOpenedSearch"
        v-model:open="isSearchOpen"
        :navigation="navigation"
        :external-services="externalServices"
        :service-status="serviceStatus"
        @closed="focusSearchButton"
      />
    </ClientOnly>
  </header>
</template>

<script setup lang="ts">
import type { ExternalService, NavLink, ServiceStatus, SiteInfo } from '~/types/content'
import { externalServiceFieldHint, siteFieldHint } from '~/utils/field-hints'

const props = defineProps<{
  site: SiteInfo
  navigation: NavLink[]
  externalServices: ExternalService[]
  serviceStatus?: ServiceStatus
}>()

const route = useRoute()
const isSearchOpen = ref(false)
const hasOpenedSearch = ref(false)
const searchButton = ref<HTMLButtonElement | null>(null)
const skinService = computed(() => props.externalServices.find((service) => service.key === 'skin' && service.enabled && service.showInHeader))

function isActive(href: string) {
  if (href === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(href)
}

function openSearch() {
  hasOpenedSearch.value = true
  isSearchOpen.value = true
}

function focusSearchButton() {
  searchButton.value?.focus()
}
</script>
