## Context

当前官网内容链路为 Strapi 5 content types、Nuxt Server Routes 的 `/api/public/*` 聚合接口、`frontend/types/content.ts` 标准类型和 Vue 页面组件。现有 `site-setting` 已经承载站点品牌、导航、页脚、皮肤站 URL、文档中心 URL、服务状态和维护页配置，字段职责跨度过大。

这带来三个问题：

- 内容管理员难以判断字段影响页面上的哪个区域。
- 新增外部服务会继续膨胀 `site-setting`，并迫使 Header、页脚、搜索、社团服务工作台各自写特殊逻辑。
- 维护态与站点品牌配置耦合，容易让 Strapi 不可用时的维护页兜底逻辑变复杂。

同时，官网还缺少明确的字段与 Markdown 分工。首页、导航、服务入口、卡片和状态类内容应由结构化字段管理；活动详情、公告正文、社团动态正文、社团介绍长文等阅读内容应使用 Markdown。

本变更需要同步更新 docs 与 strapi-models 说明，因为它改变内容模型、公开 API 数据结构和前端数据来源。

## Goals / Non-Goals

**Goals:**

- 明确官网所有内容模型中字段化内容与 Markdown 正文的边界。
- 将 `site-setting` 拆分为站点配置、维护页配置和外部服务入口三个职责清晰的模型。
- 让皮肤站、文档中心、MUA 官网、悦灵助手等入口通过统一外部服务模型管理。
- 让社团服务工作台、搜索快捷结果、页脚外联和 Header 皮肤站入口使用同一套外部服务数据。
- 保持生产环境公开数据边界：前台仍只通过 Nuxt BFF 的 `/api/public/*` 获取标准化数据，不直接访问 Strapi。
- 保持 Strapi 不可用时的维护页最小兜底能力，不使用 mock 数据冒充生产内容。

**Non-Goals:**

- 不建设官网登录、社员中心、角色权限或 `/api/member/*`。
- 不代理、不嵌入、不同步文档中心、皮肤站、MUA 或其他外部服务业务数据。
- 不新增资源下载、文件分发或文档托管能力。
- 不实现完整的 CMS 可视化编辑、click-to-edit 或开发态字段标注模式；本变更只记录字段/Markdown 边界，字段标注可作为后续独立增强。
- 不引入 Redis、KV 或服务端持久 last-known-good 缓存。

## Decisions

### 1. `site-setting` 只保留站点基础配置

`site-setting` 保留 `name`、`shortName`、`englishName`、`logoText`、`logoImage`、`favicon`、`description`、`navigation`、`footerAboutLinks`、`copyright`、`credit` 等站点身份和基础导航字段。

移出 `skinConsoleUrl`、`documentCenterUrl`、`footerExternalLinks`、`serviceStatus*` 和 `maintenance*`。这些字段分别迁移到外部服务模型和维护页模型。

替代方案：继续扩展 `site-setting`。该方案改动小，但会让配置模型继续膨胀，且每新增一个外部入口都需要新增专用字段。

### 2. 外部服务使用 `external-service` collection type

外部服务使用 collection type，而不是 single type 中的组件列表。每个服务拥有稳定 `key`、`name`、`summary`、`url`、`icon`、`category`、`enabled`、`disabledReason`、展示位置布尔值和 `sortOrder`。

推荐展示位置字段：

- `showInHeader`
- `showInWorkbench`
- `showInFooter`
- `showInSearch`

`key` 用于稳定识别 `skin`、`docs`、`mua`、`agent` 等服务。`enabled` 表示该服务入口是否可用；URL 为空或服务禁用时，前端必须展示禁用态或隐藏入口，不能跳转到空 URL。

替代方案：使用 `site-setting.externalServices` 组件数组。该方案简单，但外部服务无法独立发布、排序、筛选或按 key 查询，后续扩展不够自然。

### 3. 维护页使用独立 single type

新增 `maintenance-page` single type，承载 `enabled`、`title`、`message`、`until`、`statusLabel`、`statusHref` 和服务状态列表。维护页属于全站运行状态，不应混在站点品牌模型里。

维护页服务状态继续作为手动维护列表，不直接复用 `external-service.status`。因为“入口是否显示”和“服务当前是否在线”不是同一件事：一个外部服务可能显示在页脚，但不需要纳入维护状态；一个内部服务可能没有公开 URL，却需要展示在线状态。

替代方案：把服务状态挂到每个 `external-service`。该方案统一，但会把外部入口管理和运行状态管理绑在一起，第一阶段不需要这种复杂度。

### 4. 字段与 Markdown 按“系统理解 vs 阅读排版”划分

结构化字段用于标题、摘要、时间、状态、标签、图片、链接、排序、精选关系、导航、页脚、服务入口、维护开关和页面组件配置。

Markdown 仅用于正文类字段：

- `activity.content`
- `announcement.content`
- `club-post.content`
- `about-page.content`
- `about-page.serverSummary`
- `about-page.joinGuide`
- `join-page.introContent`
- `join-page.serverJoinGuide`

维护页 `message` 第一阶段使用普通 `text`。如果后续需要富排版、链接或列表，再单独升级为 Markdown。

替代方案：允许首页区块和 FAQ 使用 Markdown。该方案录入自由，但会让页面结构进入正文，破坏卡片、搜索、SEO 和响应式布局的稳定性。

### 5. Nuxt BFF 输出稳定前端数据结构

前台仍通过 Nuxt Server Routes 获取数据。BFF 负责从 Strapi 的新模型读取数据，并输出适合前端的标准结构：

- `/api/public/settings` 返回站点品牌、导航、页脚基础信息和必要外部服务摘要。
- `/api/public/external-services` 返回公开可展示外部服务列表。
- `/api/public/maintenance` 返回维护页、服务状态和最小兜底数据。
- `/api/public/home` 聚合首页所需站点、首页内容、外部服务和服务状态摘要。

实现时可以先让 `/api/public/settings` 暂时兼容旧字段形状，再逐步迁移组件；但最终文档和类型应以拆分后的模型为准。

### 6. 示例数据与 docs 必须同步

`frontend/data/mock.ts` 和 `scripts/import-strapi-test-data.mjs` 必须迁移到新模型结构。生产环境仍不得使用 mock 数据作为公开内容兜底，mock 仅服务开发和测试。

docs 需要同步更新：

- `docs/产品需求文档.md`：说明外部服务、维护页和内容模型边界。
- `docs/总体设计文档.md`：更新架构描述、公开数据源和模型拆分。
- `docs/详细设计文档.md`：更新字段表、接口表、字段/Markdown 使用规则和页面数据来源。
- `strapi-models/README.md` 与 `strapi-models/模型说明.md`：更新模型说明和录入顺序。

## Risks / Trade-offs

- [数据迁移漏字段] → 在任务中明确迁移旧字段到新模型：皮肤站、文档中心、MUA 外联、服务状态和维护页文案都需要测试数据覆盖。
- [前端组件读取新旧数据不一致] → 先更新标准类型和 Strapi 适配层，再改组件；公开 API 响应作为前端唯一数据契约。
- [外部服务模型过度泛化] → 第一阶段只保留当前页面真实需要的展示位置和状态字段，不引入权限、鉴权、健康检查或复杂分组。
- [维护页依赖 Strapi 失败] → 保留内置最小站点名、维护标题和维护说明；Strapi 不可用时仍可渲染维护态。
- [Markdown 渲染能力与模型命名不一致] → 本变更先定义内容契约；实现时需要检查 `richtext` 当前前端渲染方式，确保正文类字段按 Markdown 或等价富文本安全渲染。
