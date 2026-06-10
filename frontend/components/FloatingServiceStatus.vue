<template>
  <div class="floating-service-status">
    <NuxtLink
      class="floating-status"
      :class="statusClass"
      :to="status.href"
      :aria-label="`${status.label}，${onlineCount} 项在线，共 ${status.services.length} 项服务`"
    >
      <img class="status-lamp" src="/example-assets/service-redstone-lamp.svg" alt="" aria-hidden="true">
      <span>
        <strong>{{ status.label }}</strong>
        <small>{{ onlineCount }}/{{ status.services.length }} 在线服务</small>
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { ServiceStatus } from '~/types/content'

const props = defineProps<{ status: ServiceStatus }>()

const onlineCount = computed(() => props.status.services.filter((service) => service.status === 'online').length)
const statusClass = computed(() => (onlineCount.value === props.status.services.length ? 'is-online' : 'has-warning'))
</script>
