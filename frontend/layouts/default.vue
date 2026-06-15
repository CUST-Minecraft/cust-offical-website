<template>
  <div class="site-shell">
    <AppHeader
      v-if="site"
      :site="site"
      :navigation="navigation"
      :external-services="externalServices"
      :service-status="serviceStatus"
    />
    <main>
      <slot />
    </main>
    <SiteFooter v-if="site" :site="site" :external-services="externalServices" />
    <FloatingServiceStatus v-if="serviceStatus" :status="serviceStatus" :external-services="externalServices" />
    <ClientOnly>
      <FieldHintOverlay />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { data } = await useSiteSettings()

useMotionReveal()

const site = computed(() => data.value?.site)
const navigation = computed(() => data.value?.navigation ?? [])
const externalServices = computed(() => data.value?.externalServices ?? [])
const serviceStatus = computed(() => data.value?.serviceStatus)
</script>
