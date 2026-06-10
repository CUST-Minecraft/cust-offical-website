<template>
  <div class="site-shell">
    <AppHeader v-if="site" :site="site" :navigation="navigation" />
    <main>
      <slot />
    </main>
    <SiteFooter v-if="site" :site="site" />
    <FloatingServiceStatus v-if="serviceStatus" :status="serviceStatus" />
  </div>
</template>

<script setup lang="ts">
const { data } = await useSiteSettings()

const site = computed(() => data.value?.site)
const navigation = computed(() => data.value?.navigation ?? [])
const serviceStatus = computed(() => data.value?.serviceStatus)
</script>
