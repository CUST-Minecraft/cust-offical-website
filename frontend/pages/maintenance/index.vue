<template>
  <section class="maintenance-page">
    <div class="maintenance-panel">
      <div class="maintenance-copy">
        <p class="eyebrow">Maintenance</p>
        <h1>{{ title }}</h1>
        <p>{{ message }}</p>
      </div>

      <div class="maintenance-visual" aria-hidden="true">
        <div class="maintenance-lamp">
          <img src="/example-assets/maintenance-redstone-lamp.svg" alt="">
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: page } = await useMaintenancePage()

const title = computed(() => typeof page.value?.title === 'string' ? page.value.title : '社团官网维护中')
const message = computed(() => typeof page.value?.message === 'string' ? page.value.message : '内容服务暂时不可用，请稍后再试。')

useSeoMeta({
  title: '维护提示 - 长春理工大学 Minecraft 社团',
  robots: 'noindex'
})
</script>
