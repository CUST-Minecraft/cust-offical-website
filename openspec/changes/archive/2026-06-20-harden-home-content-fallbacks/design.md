## Context

官网当前通过 Nuxt Server Routes 聚合公开内容，首页由 `GET /api/public/home` 返回 HomePage 配置、活动、公告、动态、社员和图库数据。现有生产数据获取规格已经要求生产环境不得使用 mock 数据冒充真实公开内容，Strapi 不可用时应进入维护态。

本次问题不属于“CMS 不可用”，而属于“CMS 可用但内容为空或不完整”。例如内容管理员尚未发布推荐活动、图库为空、成员资料不可见，或者 Hero slide 缺少可用背景图。当前首页模板和 `HomeHero` 组件仍直接访问不确定数组元素，导致真实内容维护早期可能白屏。

相关既有约束：

- `docs/详细设计文档.md` 规定首页通过 `GET /api/public/home` 聚合内容，CMS 不可用且无缓存时展示维护提示页。
- `docs/详细设计文档.md` 规定公开列表页必须处理空状态，生产环境不得使用 mock 数据作为维护态或公开内容兜底。
- `openspec/specs/production-data-fetching-fallback/spec.md` 规定生产环境禁用 mock fallback，并区分内容不存在与内容源不可用。
- `openspec/specs/content-model-boundaries/spec.md` 规定 Nuxt BFF 输出稳定标准数据结构，并为 Hero Slide 遮罩和图注字段提供兼容默认值。

## Goals / Non-Goals

**Goals:**

- 明确首页内容韧性的三层责任：Source、Contract、Presentation。
- 在 Nuxt BFF 标准化首页数据时保证 Hero 等关键视觉骨架可渲染。
- 首页展示层不再直接访问 `array[0].field` 这类不确定数据。
- CMS 返回空活动、空公告、空动态、空图库或空成员时，不使用 mock 内容、不伪造业务内容，并展示合理空态或隐藏局部内容。
- `HomeHero` 在 props 不完整时仍能渲染默认 Hero，不因空 slides 白屏。
- 同步检查并更新 `docs/详细设计文档.md`，明确服务不可用、必需配置缺失、视觉骨架缺失和真实内容为空的区别。

**Non-Goals:**

- 不改变生产环境 mock 禁用策略。
- 不引入 Redis、KV、服务端持久 last-known-good 缓存或新的缓存依赖。
- 不新增公开搜索 API，不改变全站搜索数据来源。
- 不改变 Strapi content-type 字段结构，除非实现时发现文档与 schema 已有冲突需要单独提案。
- 不将首页真实内容列表替换为 mock 数据或前端硬编码内容。

## Decisions

### Decision 1: 使用 Source / Contract / Presentation 三层责任

采用三层责任模型：

- Source 层位于 `/api/public/*` server route 和 `withMockFallback`。它只决定 CMS、开发 mock、生产维护态之间的来源切换。
- Contract 层位于 `frontend/server/utils/strapi.ts`。它把 Strapi 原始响应转成前端安全数据模型，过滤坏视觉数据，并为关键视觉骨架补默认值。
- Presentation 层位于页面和组件。它决定空内容如何展示，并让组件对坏 props 自保。

替代方案是把所有 fallback 放在页面 computed 中。该方案实现直接，但会让多个页面重复处理基础数据契约，也不能保证组件复用时安全。三层模型能让“数据源失败”和“内容为空”保持清晰边界。

### Decision 2: 真实内容列表为空时保持为空，不伪造内容

活动、公告、动态、成员和图库是业务事实。若 CMS 返回空列表，BFF 应保持空数组，展示层通过空态、局部隐藏或默认视觉图处理。

替代方案是用 mock 列表补齐首页视觉。该方案会让生产或真实预览展示并不存在的活动、成员或动态，违反生产公开接口不得用 mock 冒充真实内容的既有规格。

### Decision 3: 关键视觉骨架可以使用内置默认值

Hero slide、首页 banner 图等属于页面可渲染骨架。若 CMS 可用但 Hero slides 为空或 slide 缺少可用背景图，Contract 层应提供 `defaultHeroSlide`。若某个首页 banner 没有可用内容图片，Presentation 层应使用与区块语义匹配的内置默认图。

替代方案是把 Hero slides 为空视为 503。该方案能暴露配置错误，但会让内容维护早期的局部配置缺失变成整站不可用。对于视觉骨架缺失，默认视觉更符合官网可用性目标；同时应通过文档和字段提示帮助管理员修复内容。

### Decision 4: 首页模板使用安全 computed，不直接拆不确定数组

`frontend/pages/index.vue` 应把图片选择策略收束到 computed，例如活动 banner 优先活动封面，其次图库图片，最后默认活动图。模板只绑定 computed 结果，并对活动、公告、图库缩略图和成员 strip 做空态或局部隐藏。

替代方案是在模板中使用可选链。可选链能避免一部分崩溃，但会把 fallback 策略散落在模板，难以维护，也容易出现 `undefined` 传入必需 image prop。

### Decision 5: `HomeHero` 组件内部保留 `safeSlides`

即使 Contract 层保证 Hero 至少有一个默认 slide，`HomeHero` 仍应在组件内部过滤无背景 slide 并提供 fallback。组件自保不改变业务事实，只保证组件面对坏 props 时不白屏。

替代方案是完全相信 BFF 契约。该方案代码较少，但组件复用或未来数据来源变化时更脆弱。

### Decision 6: 文档同步只更新详细设计相关章节

本变更不改变产品范围、系统拓扑、数据模型或部署方式。需要同步的是 `docs/详细设计文档.md` 中首页错误处理、页面实现约束和 CMS 内容约束，说明 CMS 可用但内容为空/不完整时的局部兜底策略。

## Risks / Trade-offs

- [Risk] 默认视觉过多可能掩盖 CMS 配置问题。  
  Mitigation: 只为视觉骨架补默认值，不伪造业务内容；文档中明确内容管理员仍需补齐 Hero、图库和推荐内容。

- [Risk] Contract 层和 Presentation 层都做 fallback，看起来重复。  
  Mitigation: Contract 层只保证前端模型基本可渲染；Presentation 层负责具体区块优先级和空态展示。

- [Risk] 首页空态过多会让页面显得稀疏。  
  Mitigation: 首页保留主要入口和 banner 结构，列表子区域采用轻量空态或局部隐藏，避免大面积空卡片。

- [Risk] 默认图选择不符合区块语义。  
  Mitigation: 优先复用现有 `/example-assets/*` 中与活动、动态、成员、图库、Hero 对应的素材；如需新增资源，应保持现有像素风和可读性。

- [Risk] 生产环境错误语义被误改。  
  Mitigation: 保持 `withMockFallback` 的生产 mock 禁用边界；本变更只处理 CMS 正常响应后的空内容和不完整字段。
