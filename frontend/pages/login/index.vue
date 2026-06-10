<template>
  <section class="login-page">
    <div class="login-panel">
      <img src="/example-assets/login-portal-obsidian.svg" alt="" aria-hidden="true">
      <p class="eyebrow">Member Login</p>
      <h1>社员登录</h1>
      <p>第一阶段使用 mock 登录态预览社员中心。正式接入时，这里会连接认证服务并在成功后跳转社员中心。</p>
      <NuxtLink class="pixel-button" to="/member">进入 mock 社员中心<span aria-hidden="true">›</span></NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '社员登录 - 长春理工大学 Minecraft 社团',
  description: '社员登录入口。'
})
</script>
