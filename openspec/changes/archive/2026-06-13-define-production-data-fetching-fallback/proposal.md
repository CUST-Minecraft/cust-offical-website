## Why

当前官网已经通过 Nuxt Server Routes 统一访问 Strapi 公开内容，但生产环境下 Strapi 不可用、CDN 未命中、mock fallback 是否可用等策略尚未形成明确契约。需要把生产数据获取、缓存边界和维护态降级规则固化下来，避免生产环境展示示例数据或把源站故障误判为内容不存在。

## What Changes

- 定义生产环境公开数据获取链路：用户请求优先经过 CDN，CDN 未命中时回源 Nuxt BFF，再由 Nuxt BFF 请求 Strapi。
- 明确 CDN 仍是第一阶段主要缓存层，公开页面、公开 API、图片和附件按现有文档规则配置 HTTP 缓存。
- 明确第一阶段暂不引入 Redis，也不实现服务端持久 last-known-good 缓存。
- 明确生产环境禁用 mock fallback；mock 数据仅用于开发或测试场景。
- 明确当 CDN 无可用缓存且 Strapi 不可用时，公开页面和公开 API 进入维护态，返回 `MAINTENANCE`/503 语义。
- 区分内容不存在与内容源不可用：Strapi 正常返回无内容时使用 404，Strapi 连接失败、超时或不可达时使用维护态。
- 维护页必须具备最小可用兜底内容，不能依赖 Strapi 成功响应才能展示。
- 同步更新 `docs/总体设计文档.md`、`docs/详细设计文档.md` 和 `docs/开发规范文档.md` 中关于缓存、mock fallback、维护态和生产数据源的描述。

## Capabilities

### New Capabilities
- `production-data-fetching-fallback`: 定义生产环境公开内容获取、CDN 缓存边界、Strapi 不可用时的维护态降级，以及 mock、Redis、last-known-good 的阶段性边界。

### Modified Capabilities
- `public-site-service-boundary`: 补充官网作为公开内容聚合系统时的生产数据源边界，明确生产公开接口不得用 mock 数据冒充真实内容。

## Impact

- 影响 `frontend/server/api/public/*`、`frontend/server/utils/strapi.ts`、`frontend/server/utils/mock-fallback.ts` 和公开页面错误处理逻辑。
- 影响 `frontend/composables/use-api.ts` 对 `MAINTENANCE`/503 的处理方式。
- 影响维护页和站点配置兜底策略，维护页应在 Strapi 不可用时仍可展示最小内容。
- 影响生产部署的 CDN/HTTP Cache-Control 配置，但不新增 Redis、数据库表或服务端持久缓存依赖。
- 需要同步更新 `docs/总体设计文档.md`、`docs/详细设计文档.md` 和 `docs/开发规范文档.md`。
