<template>
  <section class="login-page">
    <div class="login-panel">
      <img src="/example-assets/service-redstone-lamp.svg" alt="" aria-hidden="true">
      <p class="eyebrow">Maintenance</p>
      <h1>{{ page?.title }}</h1>
      <p>{{ page?.message }}</p>
      <NuxtLink class="ghost-button" to="/">返回首页<span aria-hidden="true">›</span></NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: page } = await useMaintenancePage()

useSeoMeta({
  title: '维护提示 - 长春理工大学 Minecraft 社团',
  robots: 'noindex'
})
</script>
