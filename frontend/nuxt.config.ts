export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    strapiUrl: 'http://localhost:1337',
    strapiApiToken: '',
    agentServiceUrl: ''
  },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        {
          name: 'description',
          content: '长春理工大学 Minecraft 社团官网，用方块构建属于长理的世界。'
        }
      ]
    }
  },
  typescript: {
    typeCheck: true,
    strict: true
  }
})
