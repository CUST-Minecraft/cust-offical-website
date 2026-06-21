## Why

当前公开内容链路还有几处实现与既有设计契约不一致：列表接口未约束分页参数、开发 mock fallback 会把 404 混入内容源不可用、页面级 composable 与页面错误兜底职责重叠，且 HomePage 精选关系尚未真正参与首页聚合。现在需要收紧 Nuxt BFF 的公共数据边界，让异常输入、内容不存在、CMS 不可用和后台首页编排分别呈现清晰语义。

## What Changes

- 为公开列表接口统一解析并约束 `page`、`pageSize` 参数，避免 `NaN`、负数、小数或过大分页值进入 Strapi 查询和 mock pagination。
- 收窄 Strapi 不可用判定，将连接失败、超时、无响应和 502/503/504 归为维护态来源故障；不再把普通 404 作为全局 mock fallback 条件。
- 统一 `usePublicAsyncData` 错误处理职责，避免页面层保留实际不可达的 `error.value` 兜底分支。
- 让 `home-page` 的 `featuredActivities`、`featuredAnnouncements`、`featuredPosts`、`featuredMembers` 和 `galleryItems` 成为首页聚合的优先数据来源，并在关系为空时回退到当前自动推荐/排序查询。
- 同步 `docs/详细设计文档.md` 中首页聚合策略：现有文档写明“首页活动、公告、动态、社员和图库展示当前由聚合接口按推荐或排序规则拉取，不完全依赖 `home-page` 的精选关系”，本变更会将其调整为“优先使用 HomePage 精选关系，缺省时再自动回退”。
- 暂不处理 `docker-compose.strapi.yml` 的默认 secret 和数据库密码问题。

## Capabilities

### New Capabilities

- `public-content-query-boundaries`: 规范公开列表查询参数的解析、约束和异常输入处理，覆盖 Nuxt BFF 列表接口和 mock pagination 的一致行为。

### Modified Capabilities

- `production-data-fetching-fallback`: 明确 404 不属于全局 Strapi unavailable fallback；内容不存在与内容源不可用必须在实现中保持分离。
- `content-model-boundaries`: 明确 HomePage 精选关系是首页聚合的结构化编排来源，并定义关系为空时的自动回退边界。

## Impact

- Affected frontend server routes: `frontend/server/api/public/activities/index.get.ts`, `frontend/server/api/public/announcements/index.get.ts`, `frontend/server/api/public/posts/index.get.ts`.
- Affected server utilities: `frontend/server/utils/api-response.ts`, `frontend/server/utils/mock-fallback.ts`, `frontend/server/utils/strapi.ts`.
- Affected composables/pages: `frontend/composables/use-api.ts` and public detail pages that currently inspect `error.value` after the composable may already throw.
- Affected Strapi-facing aggregation: `homePopulateQuery()`, HomePage relation normalization, and homepage fallback selection.
- Affected docs: `docs/详细设计文档.md`; no new runtime dependencies are expected.
