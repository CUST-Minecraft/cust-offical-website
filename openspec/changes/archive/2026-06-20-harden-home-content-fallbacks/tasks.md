## 1. 文档与现状确认

- [x] 1.1 阅读 `docs/详细设计文档.md` 的首页、错误与维护页面、页面实现约束、CMS 内容约束章节，确认实现不偏离既有边界。
- [x] 1.2 阅读 `openspec/specs/production-data-fetching-fallback/spec.md` 和 `openspec/specs/content-model-boundaries/spec.md`，确认不改变生产 mock 禁用和 Nuxt BFF 标准输出规则。
- [x] 1.3 复查 `frontend/pages/index.vue`、`frontend/components/HomeHero.vue`、`frontend/server/utils/strapi.ts` 中当前空数组和缺图风险点。

## 2. Contract 层实现

- [x] 2.1 在 `frontend/server/utils/strapi.ts` 中抽出或整理 Hero slide 标准化逻辑，过滤缺少可用背景图的 slide。
- [x] 2.2 在 `frontend/server/utils/strapi.ts` 中提供 `defaultHeroSlide` 或等价默认视觉数据，确保 `GET /api/public/home` 返回的 `hero.slides` 至少包含一个可渲染 slide。
- [x] 2.3 确认活动、公告、动态、图库和成员查询为空时保持空数组，不从 `frontend/data/mock.ts` 注入示例业务内容。

## 3. Presentation 层首页实现

- [x] 3.1 在 `frontend/pages/index.vue` 中建立活动、公告、动态、图库和成员区块的安全图片 computed，移除模板中的 `array[0].field` 裸访问。
- [x] 3.2 为首页活动和公告列表子区域添加轻量空态或局部隐藏策略，并保留对应列表页入口。
- [x] 3.3 为首页动态、图库和成员区块添加缺内容时的默认图、缩略图隐藏或成员 token 隐藏策略。
- [x] 3.4 确认首页 SEO 图片、banner 图片和所有 `PromoBanner` 的 `image` prop 在空内容状态下仍为有效 `{ src, alt }`。

## 4. HomeHero 组件自保

- [x] 4.1 在 `frontend/components/HomeHero.vue` 中建立 `safeSlides`，过滤无背景 slide 并在为空时使用 fallback slide。
- [x] 4.2 将 Hero 背景层、文案层、轮播指示器、active slide、图注位置和轮播定时逻辑统一切换到 `safeSlides`。
- [x] 4.3 确认单个安全 slide 时不启动轮播定时器，且不会访问未定义 slide 字段。

## 5. 文档同步

- [x] 5.1 更新 `docs/详细设计文档.md` 的首页错误处理说明，区分 CMS 不可用、必需配置缺失、视觉骨架缺失和真实内容为空。
- [x] 5.2 更新 `docs/详细设计文档.md` 的页面实现约束或 CMS 内容约束，说明聚合页面必须安全处理部分内容为空，且生产环境不得用 mock 掩盖真实空内容。

## 6. 验证

- [x] 6.1 运行 `npm run typecheck`，确认 TypeScript 和 Vue 类型检查通过。
- [x] 6.2 使用开发 mock 或临时测试数据验证首页在活动、公告、动态、图库、成员为空时不白屏、不抛运行时错误。
- [x] 6.3 验证 Hero slides 为空或存在缺图 slide 时，首页仍显示默认 Hero，轮播和图注逻辑不报错。
- [x] 6.4 检查生产数据获取语义未被破坏：CMS 不可用仍按既有规则进入维护态或非生产 mock fallback，真实空内容不触发 mock 注入。
