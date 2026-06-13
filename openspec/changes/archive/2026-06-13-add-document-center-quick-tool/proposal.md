## Why

官网现有快捷工具已经承载悦灵助手和社团服务状态，但缺少面向游客、社员和潜在新成员的文档中心入口。文档中心当前被定义为独立外部系统，适合作为官网的公开外部服务引导，而不是恢复官网登录、社员中心或文档托管能力。

## What Changes

- 在右下角快捷工具中新增“文档中心”独立按钮，并固定展示在“悦灵助手”上方。
- 文档中心按钮使用站点配置中的外部文档中心 URL 打开新标签页。
- 当文档中心 URL 未配置时，按钮仍然展示，但以禁用态呈现，不隐藏入口。
- 新增文档中心专用像素风 SVG 图标，视觉以 Minecraft 书架方块为基础，并与悦灵助手和社团服务状态的快捷工具风格保持一致。
- 将文档中心纳入官网公开外部服务引导边界，明确官网不代理、不嵌入、不同步、不管理文档中心内容和权限。
- 同步更新相关 docs，记录文档中心入口、配置字段、外部服务边界和当前实现状态。

## Capabilities

### New Capabilities

- `document-center-quick-tool`: 定义官网快捷工具中的文档中心外部入口、禁用态、图标和搜索可发现性。

### Modified Capabilities

- `public-site-service-boundary`: 将文档中心纳入公开外部服务引导边界，并明确其不属于官网登录、社员中心、下载分发或文档托管能力。

## Impact

- 前端组件：`frontend/components/FloatingServiceStatus.vue`、`frontend/components/SiteSearchOverlay.vue`。
- 前端类型与数据：`frontend/types/content.ts`、`frontend/data/mock.ts`、`frontend/server/utils/strapi.ts`。
- Strapi 模型与测试数据：`strapi-models/src/api/site-setting/content-types/site-setting/schema.json`、`scripts/import-strapi-test-data.mjs`、相关模型说明文档。
- 静态资源：新增书架方块风格的文档中心 SVG 图标。
- 项目文档：`docs/产品需求文档.md`、`docs/总体设计文档.md`、`docs/详细设计文档.md`、必要时同步 `strapi-models/README.md` 和 `strapi-models/模型说明.md`。
- 不新增官网登录、`/api/member/*`、文档下载 API、资源下载页、文档内容模型、后端代理或新外部依赖。
