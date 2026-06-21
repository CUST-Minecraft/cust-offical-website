## Why

当前全站搜索浮层虽然只有在访问者点击 Header 搜索按钮后才显示，但组件在全站 Header 中常驻挂载，并在初始化时预加载站点设置、活动、公告、动态和社员数据。这会把低频搜索能力变成每个公开页面的首屏依赖，增加 SSR/首屏请求成本，也扩大公开内容接口故障对全站页面的影响。

现有详细设计文档将全站搜索描述为“搜索数据来自已加载的公开接口”，这与当前性能目标存在张力。本变更需要将搜索数据加载时机调整为打开搜索时按需加载，并保持 `/api/public/*` BFF 边界、外部服务模型、服务状态和搜索交互体验不变。

## What Changes

- 调整 Header 与搜索浮层关系：搜索浮层不再在全站首屏无条件初始化，只有访问者打开搜索时才挂载或触发搜索索引加载。
- 调整搜索数据来源：搜索浮层复用 Header/Layout 已经取得的导航、外部服务和服务状态数据，避免重复请求站点设置。
- 为搜索内容索引建立明确加载策略：活动、公告、动态、公开社员资料等搜索数据在搜索打开时加载，并提供加载中、失败和空结果状态。
- 可选增加 Nuxt BFF 聚合接口 `GET /api/public/search-index`，由后端裁剪搜索所需字段并统一缓存；若实现阶段选择不新增接口，也必须保持搜索数据按需加载。
- 保持既有搜索范围：导航入口、皮肤站入口、文档中心入口、服务状态入口、活动、公告、动态和公开社员资料仍可被搜索。
- 保持既有交互：关闭、键盘聚焦、回车进入首个结果、Tab 聚焦约束、空状态提示和短过渡不被破坏。

## Capabilities

### New Capabilities

- `site-search-index-loading`: 定义全站搜索索引的按需加载、数据复用、状态反馈和首屏非阻塞要求。

### Modified Capabilities

- `document-center-quick-tool`: 明确文档中心仍必须可通过全站搜索发现，但该搜索结果不得要求搜索浮层在全站首屏预加载全部搜索索引。

## Impact

- 前端组件：`frontend/components/AppHeader.vue`、`frontend/components/SiteSearchOverlay.vue`。
- 前端数据组合逻辑：`frontend/composables/use-api.ts` 可能新增或调整搜索索引读取方法。
- Nuxt Server Routes：可选新增 `frontend/server/api/public/search-index.get.ts`；若新增，需要使用现有 `setPublicCache` 和 Strapi 规范化逻辑。
- 数据类型：可能新增搜索索引结果类型，放在 `frontend/types/content.ts` 或组件局部类型中。
- 文档同步：需要更新 `docs/详细设计文档.md` 中 2.13 全站搜索说明；若新增 `GET /api/public/search-index`，还需要同步接口概览和相关缓存说明。`docs/总体设计文档.md` 的当前工程落地状态可按是否新增接口同步更新。
- 不引入 Redis、KV、持久 last-known-good 缓存或新的第三方搜索/动画依赖。
