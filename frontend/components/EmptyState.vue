<template>
  <div class="state-panel">
    <strong>{{ title }}</strong>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message: string
}>()
</script>
