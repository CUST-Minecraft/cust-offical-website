<template>
  <header class="site-header">
    <NuxtLink class="brand" to="/" :aria-label="site.name">
      <span class="brand-mark">{{ site.logoText }}</span>
      <span>
        <strong>{{ site.name }}</strong>
        <small>{{ site.englishName }}</small>
      </span>
    </NuxtLink>

    <nav class="desktop-nav" aria-label="主导航">
      <NuxtLink
        v-for="item in navigation"
        :key="item.href"
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
      <NuxtLink class="login-button" to="/login" aria-label="登录">
        <img class="login-icon" src="/example-assets/login-portal-obsidian.svg" alt="" aria-hidden="true">
        <span>登录</span>
      </NuxtLink>
    </div>

    <SiteSearchOverlay v-model:open="isSearchOpen" @closed="focusSearchButton" />
  </header>
</template>

<script setup lang="ts">
import type { NavLink, SiteInfo } from '~/types/content'

const props = defineProps<{
  site: SiteInfo
  navigation: NavLink[]
}>()

const route = useRoute()
const isSearchOpen = ref(false)
const searchButton = ref<HTMLButtonElement | null>(null)

function isActive(href: string) {
  if (href === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(href)
}

function openSearch() {
  isSearchOpen.value = true
}

function focusSearchButton() {
  searchButton.value?.focus()
}

void props
</script>
