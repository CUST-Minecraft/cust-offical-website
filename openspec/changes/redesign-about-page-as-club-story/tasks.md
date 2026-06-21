## 1. 文档与现状确认

- [x] 1.1 阅读 `docs/产品需求文档.md`、`docs/详细设计文档.md` 中社团介绍页章节，确认旧的服务器概览和加入引导描述。
- [x] 1.2 阅读 `frontend/pages/about/index.vue`、`frontend/types/content.ts`、`frontend/data/mock.ts` 和 `strapi-models/src/api/about-page/content-types/about-page/schema.json`，确认当前页面与 `AboutPage` 字段边界。
- [x] 1.3 更新 `docs/产品需求文档.md`，将社团介绍页目标调整为五段式社团品牌故事结构。
- [x] 1.4 更新 `docs/详细设计文档.md`，同步 `/about` 页面结构、数据来源、服务器信息降级规则、继续了解出口和内容边界。

## 2. 数据边界与内容配置

- [x] 2.1 决定“我们的行动”采用前端稳定配置还是新增 CMS 结构化字段，并在实现中保持与设计文档一致。
- [x] 2.2 若新增 CMS 字段，更新 Strapi `AboutPage` 模型、前端类型、mock 数据、Strapi 适配逻辑和字段提示映射。
- [x] 2.3 若采用前端稳定配置，确认文案不需要内容管理员维护，并避免把行动卡片或继续了解入口塞入 `content` 富文本。
- [x] 2.4 确认 `GET /api/public/about` 路径保持稳定，且返回数据仍能支撑 SEO 标题、摘要和头图。

## 3. 页面结构重构

- [x] 3.1 重构 `frontend/pages/about/index.vue`，按 `认识我们`、`我们的起点`、`我们的行动`、`我们的方向`、`继续了解` 顺序渲染页面。
- [x] 3.2 将 `AboutPage.content` 渲染到 `我们的起点`，并确保富文本只承担正文阅读内容。
- [x] 3.3 新增或配置 `我们的行动` 三类内容：校园复刻、服务器共建、活动与创作。
- [x] 3.4 将 `AboutPage.groups` 用于 `我们的方向`，并调整文案语气为参与方向而非固定组织归属。
- [x] 3.5 移除 `/about` 独立服务器参数区，不再展示固定 IP、版本、模式列表。
- [x] 3.6 移除 `/about` 独立加入引导段，将页面末尾改为 `继续了解`，提供 `/join`、`/activities`、`/members` 站内入口。

## 4. 视觉与响应式

- [x] 4.1 复用现有 `PageHero`、像素边框、卡片、按钮和 motion reveal 风格，保持全站 Minecraft 像素风一致。
- [x] 4.2 为 `我们的行动` 与 `继续了解` 补充页面局部样式，确保卡片尺寸稳定、文字不溢出、不嵌套 UI 卡片。
- [x] 4.3 检查桌面端、平板端和移动端布局，确保五段结构顺序清晰，CTA 入口可点击且不与社团服务按钮或页脚重叠。
- [x] 4.4 检查减少动态偏好下页面仍可读，动效不影响正文阅读。

## 5. 验证

- [x] 5.1 运行前端类型检查或构建命令，确认 Nuxt/Vue/TypeScript 无错误。
- [x] 5.2 启动本地前端并打开 `/about`，验证五段式结构、栏目标题和站内入口展示正确。
- [x] 5.3 验证页面不展示真实姓名、学号、手机号、登录入口或内部成员服务。
- [x] 5.4 验证 `/about` 不再展示独立服务器 IP、版本、模式参数区，服务器共建只作为社团行动语境出现。
- [x] 5.5 验证 `/join`、`/activities`、`/members` 三个继续了解入口可正常跳转。
- [x] 5.6 在移动端视口截图检查文字、按钮、卡片和页脚/社团服务按钮没有重叠。

## 6. 板块数据模型迁移

- [x] 6.1 更新 `docs/产品需求文档.md` 和 `docs/详细设计文档.md`，将社团介绍页数据来源调整为 `AboutPage.sections` 板块模型。
- [x] 6.2 新增 Strapi 组件模型：社团介绍 section、section item、section link，支持 `sectionType`、标题、摘要、正文、图片、items、links、排序和启用状态。
- [x] 6.3 更新 `strapi-models/src/api/about-page/content-types/about-page/schema.json`，将 `sections` 作为社团介绍页主内容来源，并处理旧字段的兼容或迁移说明。
- [x] 6.4 更新 `frontend/types/content.ts`，新增 `AboutSection`、`AboutSectionItem`、`AboutSectionLink` 类型，并让 `AboutPageData` 支持 sections。
- [x] 6.5 更新 `frontend/data/mock.ts`，把当前五个板块写入 `aboutPage.sections`，确保 mock 数据与后台模型一致。
- [x] 6.6 更新 `frontend/server/utils/strapi.ts` 中 `fetchAboutPage` 的 populate 和 normalize 逻辑，从 Strapi sections 输出标准化板块数据。
- [x] 6.7 更新 `frontend/pages/about/index.vue`，从 `page.sections` 中按 `hero`、`origin`、`actions`、`directions`、`next` 读取内容，而不是从前端稳定配置读取行动卡片和继续了解入口。
- [x] 6.8 为缺失、禁用、重复或乱序 section 增加前端兜底处理，确保页面仍按固定五段式结构渲染可用内容。
- [x] 6.9 更新字段提示映射或相关维护说明，让内容管理员能识别社团介绍页各板块、卡片和链接对应的后台字段。
- [x] 6.10 运行前端类型检查或构建命令，确认 section 模型接入后没有 TypeScript、Vue 或 Nuxt 错误。
- [x] 6.11 启动本地前端验证 `/about`：五个板块均来自 `page.sections`，行动卡片和继续了解入口不再由 Vue 文件写死。
- [x] 6.12 验证桌面端和移动端布局、三项继续了解跳转、无独立服务器参数区、无敏感信息展示。
