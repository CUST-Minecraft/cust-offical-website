## Why

官网已经有 Hero 轮播、搜索浮层、社团服务工作台和悦灵检测态等局部动画，但动效规则分散，页面内容、搜索结果和工作台内部切换仍显得生硬。补全全站动效系统可以让 Minecraft 像素风体验更完整，同时继续遵守现有文档中“清晰、克制、可维护、不影响阅读”的视觉边界。

## What Changes

- 建立全站 motion tokens，统一常用时长、缓动和减少动态策略，收敛散落的 transition/animation 配置。
- 补充首页内容横幅、列表卡片、通用页头、关于页分组、加入页要求与流程等页面内容的轻量进入视口动画。
- 补充全站搜索结果、空状态和结果分组变化的短过渡，让输入关键词后的状态变化更自然。
- 补充社团服务工作台内部切换动画，包括文档中心与悦灵助手栏位切换、服务状态面板切换、Agent 状态切换和左侧选中反馈。
- 保留现有 Hero 轮播、社团服务触发器附魔高光、搜索浮层和工作台打开/关闭动画，并将其纳入统一动效语法。
- 不引入新的 UI 组件库、动画库、公开 API、CMS 字段或业务数据模型。
- 需要同步更新 `docs/详细设计文档.md` 和 `docs/开发规范文档.md` 中与 UI 动效、减少动态和交互状态相关的说明；`docs/产品需求文档.md` 如需描述用户可见动效要求，也应做轻量同步。

## Capabilities

### New Capabilities
- `site-motion-system`: 定义官网前台动效系统，包括 motion tokens、页面内容入场、搜索结果过渡、社团服务工作台内部切换、微交互反馈和减少动态降级。

### Modified Capabilities
- `community-services-workbench`: 补充社团服务工作台内部内容切换、状态面板切换和 Agent 状态切换的动效要求，同时保持既有面板布局、服务边界和减少动态规则不变。

## Impact

- 前端组件：`frontend/components/FloatingServiceStatus.vue`、`frontend/components/SiteSearchOverlay.vue`、`frontend/components/HomeHero.vue`、`frontend/components/PageHero.vue`、`frontend/components/ContentCard.vue`、`frontend/components/PromoBanner.vue`。
- 前端页面：`frontend/pages/index.vue`、`frontend/pages/activities/index.vue`、`frontend/pages/posts/index.vue`、`frontend/pages/announcements/index.vue`、`frontend/pages/about/index.vue`、`frontend/pages/join/index.vue`、`frontend/pages/members/index.vue`。
- 样式系统：`frontend/assets/css/main.css` 中的 motion tokens、transition、keyframes、hover/focus 状态和 `prefers-reduced-motion` 覆盖。
- 文档：需要同步检查并更新 `docs/详细设计文档.md`、`docs/开发规范文档.md`，必要时更新 `docs/产品需求文档.md`。
- 不影响 Nuxt server routes、Strapi 内容模型、公开 API、外部服务边界、登录权限或部署拓扑。
