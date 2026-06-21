## Why

当前 `site-setting` 同时承担站点品牌、导航、页脚、外部服务入口、服务状态和维护页配置，职责过重，后续新增外部服务或调整维护策略时容易牵连无关字段。官网也缺少统一的“字段化内容 vs Markdown 正文”边界，内容录入、接口裁剪和前端渲染容易各自理解。

本变更需要把官网内容治理规则固化下来：系统要理解和复用的内容使用结构化字段，主要给人阅读的正文使用 Markdown；同时拆分站点配置、维护页和外部服务模型，让 CMS 内容结构更清晰、可扩展。

## What Changes

- 将 `site-setting` 收敛为站点基础配置，主要保留品牌、SEO、导航、页脚版权和页脚关于我们链接。
- 新增维护页配置模型，承载维护开关、维护文案、预计恢复时间和服务状态列表。
- 新增外部服务模型，统一管理皮肤站、文档中心、MUA 官网、悦灵助手等外部或服务入口的 URL、图标、展示位置、启用状态和排序。
- 明确所有内容模型中哪些字段必须结构化，哪些正文类字段使用 Markdown。
- 调整公开 API 数据边界，使前端继续通过 Nuxt BFF 获取标准化数据，但不再把外部服务和维护页配置混在 `site` 字段里。
- 更新 `docs/产品需求文档.md`、`docs/总体设计文档.md`、`docs/详细设计文档.md`、`strapi-models/README.md` 和 `strapi-models/模型说明.md` 中与内容模型、外部服务和维护页相关的描述。
- **BREAKING**: `SiteSettings.documentCenterUrl`、`SiteSettings.skinConsoleUrl`、`SiteSettings.footerExternalLinks`、`SiteSettings.serviceStatus*` 和 `SiteSettings.maintenance*` 不再作为长期数据来源；前端和公开 API 需要迁移到外部服务与维护页模型。

## Capabilities

### New Capabilities
- `content-model-boundaries`: 定义官网内容模型职责拆分、字段化内容与 Markdown 正文边界、站点配置/维护页/外部服务模型契约。

### Modified Capabilities
- `public-site-service-boundary`: 外部服务入口从 `site-setting` 中独立出来后，官网仍只作为公开外部服务引导系统，不代理、不嵌入、不管理外部系统业务数据。
- `document-center-quick-tool`: 文档中心 URL 和启用状态从外部服务模型读取，而不是从 `site.documentCenterUrl` 读取。
- `community-services-workbench`: 社团服务工作台的可展示服务、服务数量和服务状态数据需要适配外部服务模型与维护页模型。
- `production-data-fetching-fallback`: 维护页配置拆分后，维护态仍必须具备最小可用兜底内容，生产环境仍不得使用 mock 数据作为公开内容兜底。

## Impact

- Strapi content types:
  - 修改 `strapi-models/src/api/site-setting/content-types/site-setting/schema.json`。
  - 新增 `maintenance-page` single type。
  - 新增 `external-service` collection type 及必要组件或枚举字段。
- Nuxt BFF 与类型:
  - 更新 `frontend/types/content.ts` 的 `SiteInfo`、维护页和外部服务相关类型。
  - 更新 `frontend/server/utils/strapi.ts` 的 Strapi 适配与媒体规范化逻辑。
  - 调整 `/api/public/settings`、`/api/public/maintenance`、`/api/public/home`，必要时新增或扩展 `/api/public/external-services`。
- 前端组件:
  - 更新 Header 皮肤站入口、社团服务工作台、搜索快捷结果和页脚外联入口的数据来源。
  - 更新维护页的数据来源与 Strapi 不可用时的兜底逻辑。
- 数据与文档:
  - 更新 `scripts/import-strapi-test-data.mjs` 和 `frontend/data/mock.ts` 的示例数据结构。
  - 更新 docs 与 strapi-models 说明，记录每个数据模型字段含义、页面位置、字段/Markdown 使用方式。
