## Context

官网公开数据链路由 Nuxt Server Routes 作为 BFF 聚合 Strapi 内容，再由页面 composable 读取 `/api/public/*`。现有设计文档和 specs 已经要求前台不直接访问 Strapi、生产环境不使用 mock 冒充真实内容、内容不存在返回 404、内容源不可用返回维护态。

当前实现中仍有几处边界不清：列表接口直接 `Number(query.page)`，异常参数可进入 Strapi 或 mock pagination；`isStrapiUnavailable()` 把 404 当作全局 fallback 条件；页面级 composable 内部 throw 后，详情页仍保留 `error.value` 分支；HomePage schema 和文档都包含精选关系，但首页聚合仍主要按 `isFeatured` 或排序自动拉取。

本变更需要同步 `docs/详细设计文档.md`，尤其是公开接口分页参数、错误语义、首页精选关系和首页聚合策略。`docs/开发规范文档.md` 已经要求 mock fallback 只用于开发/测试环境，并要求 Strapi 正常响应但内容不存在时返回 404，本变更将实现向该规范收拢。

## Goals / Non-Goals

**Goals:**

- 统一公开列表接口的分页参数解析，保证 `page` 和 `pageSize` 始终为受控正整数。
- 明确区分 Strapi 请求失败和 Strapi 正常响应但内容不存在，避免 404 触发全局 mock fallback 或维护态误判。
- 统一页面公开数据 composable 的错误处理模型，让页面不再保留不可达的 `error.value` 兜底分支。
- 让 HomePage 精选关系成为首页聚合的优先来源，并保留自动推荐/排序作为缺省回退。
- 保持既有 Nuxt BFF 边界，不引入 Redis、KV、搜索服务或新的持久缓存依赖。

**Non-Goals:**

- 不处理 `docker-compose.strapi.yml` 默认 secret、数据库密码或生产部署密钥策略。
- 不新增自研后台、登录、社员权限、在线报名审核或皮肤站业务逻辑。
- 不改变公开 URL 使用 slug 的规则。
- 不改变首页空内容和 Hero 视觉兜底已建立的展示策略，除非为了接入精选关系需要微调数据来源。

## Decisions

### 1. 使用统一分页解析 helper

在 server utility 中提供一个小型纯函数，例如 `readPaginationQuery(query, defaults)` 或 `normalizePagination(page, pageSize, options)`。活动、公告、动态列表接口都通过该 helper 读取分页参数。

规则：

- `page` 无效、非有限数字、小于 1 或小数时归一为正整数，默认 `1`。
- `pageSize` 无效、非有限数字、小于 1 时回退到默认值，默认 `10`。
- `pageSize` 设置上限，建议第一阶段使用 `50`，避免搜索索引或手写 URL 请求过大列表。
- mock `paginate()` 也使用同一归一化逻辑或接受已经归一化后的参数，避免返回 `NaN` meta。

替代方案：在每个 route 内手写 `Number.isFinite` 判断。放弃该方案，因为活动、公告、动态列表规则相同，重复实现容易漂移。

### 2. 将 404 从全局 Strapi unavailable 判定中移除

`isStrapiUnavailable()` 只表示内容源不可达或上游故障：网络失败、超时、连接重置、DNS/连接拒绝、502、503、504。普通 404 不再触发全局 `withMockFallback()`。

详情接口按 slug 查询时，Strapi 正常返回空列表应由 route 转为 `NOT_FOUND`/404；Strapi 请求失败则交给 `withMockFallback()` 在非生产环境使用 mock，生产环境返回维护态。

替代方案：保留 404 fallback 并在详情 route 特判。放弃该方案，因为全局 helper 仍会掩盖 API path 写错、single type 未创建和真实内容缺失，维护者很难判断问题来源。

### 3. 采用 composable 集中 throw，页面只消费成功数据

保留 `usePublicAsyncData()` 内部发现 `result.error.value` 后直接 throw 的模式，并清理详情页中后置检查 `error.value` 的分支。错误状态由 server route 的标准 `ApiResponse`、`unwrapApiResponse()` 和 Nuxt error boundary 负责。

替代方案：让 composable 永不 throw，所有页面各自处理 `error.value`。放弃该方案，因为公开页面错误语义已经由 BFF 统一输出，分散到页面处理会重复且容易不一致。

### 4. HomePage 精选关系优先，自动查询作为回退

`homePopulateQuery()` 需要 populate HomePage 的精选关系和相关媒体字段。`fetchHomeData()` 读取 `featuredActivities`、`featuredAnnouncements`、`featuredPosts`、`featuredMembers`、`galleryItems` 后，按如下顺序选择首页列表：

1. HomePage 对应精选关系存在且标准化后非空，则使用精选关系。
2. 精选关系为空，则保留当前自动回退：活动和动态使用 `isFeatured`，公告按置顶/发布时间，成员按可见和排序，图库按排序。
3. 两者都为空时返回真实空数组，由首页展示层使用已有空态和默认视觉图处理。

精选关系不应绕过公开内容边界：仍只能输出可公开展示的标准化数据，媒体继续标准化为 `{ src, alt }`。如果 Strapi relation populate 语法因版本或迁移状态失败，应沿用现有 populate migration fallback 思路，优先保证页面进入维护态或开发 fallback，而不是返回半结构数据。

替代方案：删除 HomePage 精选关系，只保留自动推荐。放弃该方案，因为产品需求和详细设计都把精选关系列为结构化字段，内容管理员需要可信的首页编排入口。

### 5. 文档同步最小化但必须准确

本变更需要更新 `docs/详细设计文档.md`：

- 公开列表分页参数补充无效值回退和上限。
- 错误码说明补充 404 与维护态的区分。
- 首页数据模型和首页实现约束从“不完全依赖精选关系”调整为“优先使用精选关系，缺省自动回退”。

如实现触及开发规范中 mock fallback 示例或错误处理规则，可同步 `docs/开发规范文档.md` 的相应段落；产品需求文档已有结构化字段和精选关系描述，预计无需大改。

## Risks / Trade-offs

- [Risk] HomePage 精选 relation populate 增加首页聚合查询复杂度。→ Mitigation: 仅在 `/api/public/home` 聚合中使用，保持页面首屏仍只请求一个公开接口；必要时并行保留自动回退查询。
- [Risk] 移除 404 fallback 后，开发环境中缺失 single type 会暴露为错误而不是 mock 页面。→ Mitigation: 这符合“内容缺失不是内容源不可用”的边界；README 或详细设计说明开发者应导入测试数据或创建必需 single type。
- [Risk] pageSize 上限可能截断搜索索引数量。→ Mitigation: 搜索索引当前请求 `pageSize: 20`，低于建议上限；未来需要更多结果时应通过专门搜索接口规划。
- [Risk] 清理页面 `error.value` 分支可能改变局部错误文案来源。→ Mitigation: 保持 server route 的 `NOT_FOUND` message 和 `unwrapApiResponse()` 的状态码映射，页面 SEO fallback 文案继续保留。
