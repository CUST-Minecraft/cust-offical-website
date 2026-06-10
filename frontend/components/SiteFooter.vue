<template>
  <footer class="site-footer">
    <div class="footer-socials">
      <NuxtLink v-for="item in site.socials" :key="item" to="/join" :aria-label="item">
        {{ item }}
      </NuxtLink>
    </div>
    <p>{{ site.copyright }}</p>
    <span>{{ site.credit }}</span>
  </footer>
</template>

<script setup lang="ts">
import type { SiteInfo } from '~/types/content'

defineProps<{ site: SiteInfo }>()
</script>
