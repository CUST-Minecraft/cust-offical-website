## Why

当前首页和 Hero 组件仍默认 CMS 返回完整内容，存在 `activities[0]`、`gallery[0]`、`hero.slides[0]` 等运行时崩溃风险。随着 Strapi 内容进入真实维护阶段，CMS 可用但内容尚未录入、未发布或图片字段不完整会成为常见状态，需要把“服务不可用”和“内容为空/不完整”的处理边界明确下来。

## What Changes

- 为首页建立 Source / Contract / Presentation 三层兜底策略：
  - Source 层只处理 CMS 不可用时的 mock 或维护态，不用 mock 掩盖真实空内容。
  - Contract 层在 Nuxt BFF 标准化首页数据时保证关键视觉骨架可渲染，例如 Hero 至少有一个可用 slide。
  - Presentation 层在首页和 Hero 组件中处理空数组、缺图、空态和局部隐藏，避免模板直接访问不确定数组元素。
- 首页活动、公告、动态、图库、成员为空时不伪造业务内容，页面应保留合理入口并展示轻量空态或隐藏局部内容。
- Hero slides 为空或缺少可用背景图时使用内置默认 Hero slide，组件内部仍需自保，避免坏 props 导致白屏。
- 该变更不引入 Redis、KV、服务端持久缓存或新的公开搜索 API。

## Capabilities

### New Capabilities
- `home-content-fallbacks`: 定义首页 CMS 内容为空或不完整时的局部兜底、默认视觉骨架、空态和组件自保要求。

### Modified Capabilities
- 无。现有 `production-data-fetching-fallback` 已规定生产环境不得使用 mock 数据冒充公开内容；本变更在其基础上补充 CMS 可用但内容为空/不完整时的首页展示契约。

## Impact

- 影响前端首页和 Hero 展示：`frontend/pages/index.vue`、`frontend/components/HomeHero.vue`。
- 影响首页聚合数据标准化：`frontend/server/utils/strapi.ts`。
- 可能影响首页相关默认资源引用：`frontend/public/example-assets/*`。
- 需要同步检查 `docs/详细设计文档.md` 中首页错误处理、页面实现约束和 CMS 内容约束描述，使其反映“服务不可用”和“内容为空/不完整”的区别。
