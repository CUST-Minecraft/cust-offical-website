## 1. 文档与契约确认

- [x] 1.1 阅读 `docs/产品需求文档.md`、`docs/总体设计文档.md`、`docs/详细设计文档.md`、`strapi-models/README.md` 和 `strapi-models/模型说明.md` 中与站点配置、维护页、外部服务、公开 API、字段/Markdown 边界相关的章节。
- [x] 1.2 更新 `docs/产品需求文档.md`，说明官网内容分为结构化数据模型与 Markdown 正文，并记录站点配置、维护页、外部服务的职责拆分。
- [x] 1.3 更新 `docs/总体设计文档.md`，调整公开内容链路、外部服务边界、维护态数据来源和模型拆分描述。
- [x] 1.4 更新 `docs/详细设计文档.md`，补充每个数据模型的字段表、字段含义、页面位置、字段/Markdown 使用方式和公开 API 返回边界。
- [x] 1.5 更新 `strapi-models/README.md` 和 `strapi-models/模型说明.md`，同步模型清单、建议录入顺序、字段适配注意和旧字段迁移说明。

## 2. Strapi 内容模型

- [x] 2.1 修改 `strapi-models/src/api/site-setting/content-types/site-setting/schema.json`，移除外部服务、服务状态和维护页职责字段，仅保留站点基础配置字段。
- [x] 2.2 新增 `strapi-models/src/api/maintenance-page/` 的 controller、route、service 和 single type schema，包含维护开关、标题、说明、预计恢复时间、状态入口文案和服务状态列表。
- [x] 2.3 新增 `strapi-models/src/api/external-service/` 的 controller、route、service 和 collection type schema，包含 `key`、名称、说明、URL、图标、分类、启用状态、禁用说明、展示位置和排序字段。
- [x] 2.4 检查共享组件是否需要新增或复用；优先复用现有 `service-status-item`，避免引入无必要的重复组件。
- [x] 2.5 确保新模型不新增登录、社员中心、下载分发、文档托管或外部服务业务数据管理能力。

## 3. 示例数据与导入脚本

- [x] 3.1 更新 `scripts/import-strapi-test-data.mjs`，将皮肤站、文档中心、MUA 官网、悦灵助手等入口写入 `external-service`，将维护配置和服务状态写入 `maintenance-page`。
- [x] 3.2 更新 `frontend/data/mock.ts`，使开发 mock 数据匹配拆分后的站点配置、维护页和外部服务结构。
- [x] 3.3 确认 mock 数据仍仅用于开发或测试环境，生产环境不会用 mock 数据冒充 CMS 公开内容。

## 4. 前端类型与 Strapi 适配

- [x] 4.1 更新 `frontend/types/content.ts`，拆分 `SiteInfo`、`ExternalService`、`MaintenancePageData` 和服务状态相关类型。
- [x] 4.2 更新 `frontend/server/utils/strapi.ts`，新增外部服务和维护页读取、标准化、排序、禁用态和媒体 alt 规范化逻辑。
- [x] 4.3 调整 `/api/public/settings`，返回站点基础配置、导航、页脚基础信息和必要外部服务摘要，不再把维护页配置和外部服务详情塞进 `site` 基础字段。
- [x] 4.4 新增或扩展 `/api/public/external-services`，返回可公开展示的外部服务列表，并支持 Header、工作台、页脚和搜索使用。
- [x] 4.5 更新 `/api/public/maintenance`，从 `maintenance-page` 读取维护页配置和服务状态，并保留 Strapi 不可用时的内置最小兜底内容。
- [x] 4.6 更新 `/api/public/home`，聚合首页所需站点基础信息、外部服务入口和服务状态摘要。

## 5. 前端页面与组件适配

- [x] 5.1 更新 `frontend/components/AppHeader.vue`，从外部服务数据读取皮肤站入口，继续从站点配置读取品牌名称、英文副标题和 Logo。
- [x] 5.2 更新 `frontend/components/SiteFooter.vue`，从站点配置读取版权、署名和关于我们链接，从外部服务数据读取外联入口。
- [x] 5.3 更新 `frontend/components/FloatingServiceStatus.vue`，从外部服务模型读取文档中心入口，从维护页或公开维护接口读取服务状态。
- [x] 5.4 更新 `frontend/components/SiteSearchOverlay.vue`，从外部服务数据生成文档中心等快捷结果，并正确处理未启用或 URL 缺失状态。
- [x] 5.5 更新维护页相关页面和接口调用，使维护页展示独立维护页模型数据，并在内容源不可用时使用最小兜底内容。
- [x] 5.6 检查详情页正文渲染，确保活动、公告、社团动态、社团介绍和加入说明的正文类字段按 Markdown 或等价富文本正文处理，摘要和卡片描述保持普通文本。

## 6. 验证

- [x] 6.1 运行 OpenSpec 校验，确认新增与修改的 specs 可以通过校验。
- [x] 6.2 运行前端类型检查或构建命令，确认类型和 Nuxt server routes 编译通过。
- [x] 6.3 验证 Header 皮肤站入口、文档中心工作台入口、搜索快捷结果、页脚外联、维护页和首页聚合数据均使用拆分后的数据来源。
- [x] 6.4 验证生产环境 mock fallback 边界未被放宽，Strapi 不可用时仍返回维护态或最小维护页兜底。
- [x] 6.5 检查 `strapi-models` 中未新增官网登录、社员权限、资源下载、文档托管或外部服务业务数据模型。
