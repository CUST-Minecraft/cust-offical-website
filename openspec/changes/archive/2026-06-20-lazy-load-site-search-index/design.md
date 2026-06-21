## Context

全站搜索目前由 `AppHeader` 常驻挂载 `SiteSearchOverlay`，而搜索浮层在 `script setup` 顶层 `await` 读取 `settings`、`activities`、`announcements`、`posts` 和 `members`。这让任意公开页面的首屏 SSR/初始化都隐式依赖搜索索引数据，即使访问者从未打开搜索。

现有文档约束要求前台统一通过 Nuxt BFF 的 `/api/public/*` 获取公开数据，不直接调用 Strapi；第一阶段性能主要依赖 CDN/HTTP cache，不引入 Redis、KV 或持久 last-known-good 缓存。全站搜索仍需要覆盖导航、外部服务、服务状态、活动、公告、动态和公开社员资料，并保留键盘和短过渡体验。

## Goals / Non-Goals

**Goals:**

- 让全站搜索不再阻塞普通页面首屏渲染。
- 避免搜索浮层重复请求 `GET /api/public/settings`，复用 Layout/Header 已经拥有的导航、外部服务和服务状态数据。
- 在访问者第一次打开搜索时加载内容索引，并在加载中、加载失败、无结果时提供稳定 UI。
- 保持文档中心、皮肤站、服务状态等快捷入口在搜索中可发现。
- 保持现有 Nuxt BFF 和 Strapi 内容模型边界。

**Non-Goals:**

- 不引入第三方搜索引擎、全文检索服务、Redis、KV 或持久服务端缓存。
- 不改变 Strapi content-type 或外部服务模型字段。
- 不实现复杂分词、拼音搜索、搜索高亮或服务端相关性算法。
- 不改变社团服务工作台、悦灵助手或文档中心的业务行为。

## Decisions

### 1. 搜索浮层首次打开后再挂载

`AppHeader` 使用独立状态记录搜索是否至少打开过，例如 `hasOpenedSearch`。页面初始渲染时只展示搜索按钮，不挂载 `SiteSearchOverlay`；访问者点击搜索按钮后设置 `hasOpenedSearch = true` 和 `isSearchOpen = true`，再渲染浮层。

示意：

```text
页面首屏
  AppHeader
    搜索按钮
    SiteSearchOverlay 未挂载

点击搜索
  hasOpenedSearch = true
  isSearchOpen = true
  SiteSearchOverlay 挂载并打开
```

选择这种方式而不是简单 `v-if="isSearchOpen"`，是为了在第一次打开后保留组件实例、搜索输入状态和已加载索引缓存，避免每次关闭再打开都重新初始化。

可选使用 `ClientOnly` 包裹搜索浮层，因为搜索浮层依赖 `Teleport to="body"`、焦点管理、`document.body` class 和键盘事件，按需打开后主要是客户端交互。

### 2. 全站配置数据由 Header 传入搜索浮层

`layouts/default.vue` 已经通过 `useSiteSettings()` 获取 `site`、`navigation`、`externalServices` 和 `serviceStatus`，并传给 `AppHeader`。搜索浮层应从 `AppHeader` 接收这些数据：

```text
Layout useSiteSettings
  -> AppHeader props
    -> SiteSearchOverlay props
```

搜索浮层不再自行调用 `useSiteSettings()`。这样导航入口、外部服务入口、文档中心入口、皮肤站入口和服务状态入口继续使用同一份标准化数据，也降低首屏重复依赖。

### 3. 内容索引在搜索打开时加载

`SiteSearchOverlay` 移除顶层 `await useActivities/useAnnouncements/usePosts/useMembers`，改为内部加载状态：

- `idle`: 搜索尚未打开或尚未请求内容索引。
- `loading`: 正在加载活动、公告、动态和社员资料。
- `ready`: 内容索引加载成功。
- `error`: 内容索引加载失败。

首次 `open` 变为 `true` 时触发加载。加载成功后复用内存中的索引；再次打开搜索不主动重拉，除非上一次失败并需要重试。

加载期间搜索结果仍可包含导航、外部服务和服务状态这些已传入的快捷入口；内容索引加载完成后再合并活动、公告、动态和社员资料。这样搜索框打开后立即可用，不需要等待全部内容接口完成才能输入。

### 4. 初始实现复用现有公开列表接口

初始实现不新增 `GET /api/public/search-index`。搜索浮层打开后并行请求现有接口：

- `GET /api/public/activities?page=1&pageSize=20`
- `GET /api/public/announcements?page=1&pageSize=20`
- `GET /api/public/posts?page=1&pageSize=20`
- `GET /api/public/members`

理由：

- 变更范围小，不新增后端契约。
- 现有接口已有缓存策略、mock fallback 和 Strapi 标准化逻辑。
- 当前第一阶段搜索规模较小，前端内存索引足够。

备选方案是新增 `GET /api/public/search-index` 聚合接口。它能减少打开搜索时的请求数量，并让 BFF 裁剪字段更清晰；但会增加接口文档、类型和测试面。若后续搜索规模扩大或移动端网络表现不理想，可在单独变更中升级为聚合接口。

### 5. 搜索状态不破坏既有键盘与动效体验

加载、失败和空状态应复用现有搜索结果区域，不改变对话框结构。搜索输入应在打开后立即聚焦；加载不应阻塞输入、关闭、Esc、Tab 焦点循环或回车进入首个可用结果。

如果内容索引加载失败：

- 仍展示导航、外部服务和服务状态入口。
- 在结果区展示简短错误提示或“部分内容暂不可搜索”的状态。
- 不把整页变为错误页。

## Risks / Trade-offs

- [Risk] 第一次打开搜索时内容结果可能有短暂加载延迟。  
  Mitigation: 先展示导航、外部服务和服务状态入口，并提供加载状态；内容接口并行请求。

- [Risk] 不新增聚合接口会在第一次打开搜索时发起多个请求。  
  Mitigation: 请求从全站首屏移到用户明确打开搜索后；现有公开接口已有短/中缓存，后续可按需要升级为 `search-index` 聚合接口。

- [Risk] 使用 `hasOpenedSearch` 后组件首次打开后会保留在页面中。  
  Mitigation: 组件只在第一次搜索交互后保留，不参与初始首屏；保留实例可避免重复加载和焦点状态抖动。

- [Risk] 部分内容接口失败时搜索结果不完整。  
  Mitigation: 快捷入口仍可用，内容索引失败以局部状态提示，不影响 Header、当前页面或全站导航。

## Migration Plan

1. 调整 `AppHeader`，增加 `hasOpenedSearch`，按首次打开挂载 `SiteSearchOverlay`，并传入 `navigation`、`externalServices`、`serviceStatus`。
2. 调整 `SiteSearchOverlay`，移除顶层全量 `await`，改为 props + 打开时懒加载内容索引。
3. 增加加载中、失败和部分索引可用状态，确保键盘和关闭行为不受影响。
4. 更新 `docs/详细设计文档.md` 中全站搜索说明；如实现阶段没有新增接口，不更新公开接口列表。
5. 运行类型检查，并通过本地页面或浏览器验证：首屏不再预取搜索内容接口，第一次打开搜索时才加载内容索引。

回滚策略：恢复 `AppHeader` 常驻挂载和 `SiteSearchOverlay` 顶层数据获取即可回到旧行为；该变更不包含数据迁移。

## Open Questions

- 是否在本变更中新增 `GET /api/public/search-index` 聚合接口？当前设计倾向不新增，保留为后续优化。
- 搜索内容接口失败时，是否需要单独提供“重试”按钮？当前设计倾向只保留局部错误提示和下一次打开重试能力。
