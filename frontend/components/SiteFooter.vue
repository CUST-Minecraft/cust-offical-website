<template>
  <footer class="site-footer">
    <div class="footer-main">
      <section class="footer-brand-panel" :aria-label="site.name">
        <NuxtLink class="footer-brand" to="/" :aria-label="site.name">
          <span
            v-field-hint="site.logoImage ? siteFieldHint('logoImage', '页脚 Logo') : siteFieldHint('logoText', '页脚文字 Logo')"
            class="footer-brand-mark"
            :class="{ 'has-logo-image': site.logoImage }"
          >
            <img v-if="site.logoImage" :src="site.logoImage" :alt="`${site.shortName} Logo`">
            <template v-else>{{ site.logoText }}</template>
          </span>
          <span class="footer-brand-copy">
            <strong v-field-hint="siteFieldHint('name', '页脚品牌名')">{{ site.name }}</strong>
            <small v-field-hint="siteFieldHint('englishName', '页脚英文副标题')">{{ site.englishName }}</small>
          </span>
        </NuxtLink>

        <div class="footer-icon-links" aria-label="官网图标入口">
          <template v-for="link in footerIconLinks" :key="`${link.label}-${link.href}`">
            <span v-if="link.disabled" v-field-hint="footerExternalHint(link, '页脚图标外联')" class="footer-icon-link is-disabled" :aria-label="link.label" aria-disabled="true">
              <img :src="iconFor(link.icon)" alt="" aria-hidden="true">
            </span>
            <a
              v-else-if="link.external"
              v-field-hint="footerExternalHint(link, '页脚图标外联')"
              class="footer-icon-link"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="link.label"
            >
              <img :src="iconFor(link.icon)" alt="" aria-hidden="true">
            </a>
            <NuxtLink v-else v-field-hint="footerExternalHint(link, '页脚图标外联')" class="footer-icon-link" :to="link.href" :aria-label="link.label">
              <img :src="iconFor(link.icon)" alt="" aria-hidden="true">
            </NuxtLink>
          </template>
        </div>
      </section>

      <nav class="footer-nav-columns" aria-label="页尾导航">
        <section class="footer-link-column">
          <h2>外联</h2>
          <ul>
            <li v-for="link in externalLinks" :key="`${link.label}-${link.href}`">
              <span v-if="link.disabled" v-field-hint="footerExternalHint(link, '页脚外联栏目')" class="footer-text-link is-disabled" aria-disabled="true">
                <img :src="iconFor(link.icon)" alt="" aria-hidden="true">
                <span>{{ link.label }}</span>
              </span>
              <a
                v-else-if="link.external"
                v-field-hint="footerExternalHint(link, '页脚外联栏目')"
                class="footer-text-link"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img :src="iconFor(link.icon)" alt="" aria-hidden="true">
                <span>{{ link.label }}</span>
              </a>
              <NuxtLink v-else v-field-hint="footerExternalHint(link, '页脚外联栏目')" class="footer-text-link" :to="link.href">
                <img :src="iconFor(link.icon)" alt="" aria-hidden="true">
                <span>{{ link.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </section>

        <section class="footer-link-column">
          <h2>关于我们</h2>
          <ul>
            <li v-for="link in aboutLinks" :key="`${link.label}-${link.href}`">
              <span v-if="link.disabled" v-field-hint="siteFieldHint('footerAboutLinks', `页脚关于我们：${link.label}`)" class="footer-text-link is-disabled" aria-disabled="true">
                <img :src="iconFor(link.icon)" alt="" aria-hidden="true">
                <span>{{ link.label }}</span>
              </span>
              <a
                v-else-if="link.external"
                v-field-hint="siteFieldHint('footerAboutLinks', `页脚关于我们：${link.label}`)"
                class="footer-text-link"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img :src="iconFor(link.icon)" alt="" aria-hidden="true">
                <span>{{ link.label }}</span>
              </a>
              <NuxtLink v-else v-field-hint="siteFieldHint('footerAboutLinks', `页脚关于我们：${link.label}`)" class="footer-text-link" :to="link.href">
                <img :src="iconFor(link.icon)" alt="" aria-hidden="true">
                <span>{{ link.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </section>
      </nav>
    </div>

    <div class="footer-bottom">
      <p v-field-hint="siteFieldHint('copyright', '页脚版权信息')">{{ site.copyright }}</p>
      <span v-field-hint="siteFieldHint('credit', '页脚署名')">{{ site.credit }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { ExternalService, FooterLink, FooterLinkIcon, SiteInfo } from '~/types/content'
import { externalServiceFieldHint, siteFieldHint } from '~/utils/field-hints'

const props = defineProps<{ site: SiteInfo; externalServices: ExternalService[] }>()

const externalLinks = computed<FooterLink[]>(() =>
  props.externalServices
    .filter((service) => service.showInFooter)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(serviceToFooterLink)
)
const aboutLinks = computed(() => props.site.footerAboutLinks ?? [])

const footerIconLinks = computed<FooterLink[]>(() => {
  return props.externalServices
    .filter((service) => service.enabled && service.url && (service.showInHeader || service.showInWorkbench || service.showInFooter))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(serviceToFooterLink)
})

function serviceToFooterLink(service: ExternalService): FooterLink {
  return {
    label: service.name,
    href: service.url || '#',
    icon: service.icon,
    external: service.external,
    disabled: !service.enabled || !service.url
  }
}

function iconFor(icon?: FooterLinkIcon) {
  const icons: Record<FooterLinkIcon, string> = {
    skin: '/example-assets/login-portal-obsidian.svg',
    docs: '/example-assets/bookshelf-docs.svg',
    mua: '/example-assets/community-workbench.svg',
    about: '/example-assets/custmc-logo-header.png',
    join: '/example-assets/service-redstone-lamp.svg',
    activity: '/example-assets/maintenance-redstone-lamp.svg',
    member: '/example-assets/allay-agent-cute.png',
    agent: '/example-assets/allay-agent-cute.png',
    external: '/example-assets/community-workbench.svg'
  }

  return icons[icon ?? 'external']
}

function footerExternalHint(link: FooterLink, usage: string) {
  return externalServiceFieldHint('name', `${usage}：${link.label}`)
}
</script>
