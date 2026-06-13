## ADDED Requirements

### Requirement: 生产公开数据必须通过 CDN 和 Nuxt BFF 回源 Strapi
生产环境公开官网 SHALL 以 CDN 作为访问入口和主要缓存层；当 CDN 未命中或需要回源时，系统 MUST 通过 Nuxt Server Routes 的 `/api/public/*` 获取公开数据，并由 Nuxt BFF 请求 Strapi，不得让前台页面直接调用 Strapi 原始 API。

#### Scenario: CDN 未命中时回源公开内容
- **WHEN** 访问者请求公开页面或公开 API 且 CDN 没有可用缓存
- **THEN** 系统 MUST 回源 Nuxt BFF 的 `/api/public/*` 接口
- **AND** Nuxt BFF MUST 从 Strapi 获取真实已发布公开内容并返回前台标准数据结构

#### Scenario: 前台页面获取公开数据
- **WHEN** 页面、布局或页面级 composable 需要获取官网公开内容
- **THEN** 系统 MUST 调用 Nuxt BFF 提供的公开接口
- **AND** 系统 MUST NOT 在前台代码中直接访问 Strapi 原始 API 地址

### Requirement: 生产环境不得使用 mock 数据作为公开内容兜底
生产环境 SHALL 禁用 mock fallback。Strapi 不可用时，系统 MUST NOT 返回 mock 首页、mock 列表、mock 详情、mock 社员资料、mock 站点配置或其他示例内容作为真实公开内容。

#### Scenario: 生产环境 Strapi 连接失败
- **WHEN** 生产环境 Nuxt BFF 请求 Strapi 时发生连接失败、超时或无响应
- **THEN** 系统 MUST NOT 返回 `frontend/data/mock.ts` 中的示例数据
- **AND** 系统 MUST 返回维护态错误或触发维护页展示

#### Scenario: 非生产环境 Strapi 不可用
- **WHEN** 开发或测试环境需要在 Strapi 不可用时继续调试页面
- **THEN** 系统 MAY 使用 mock fallback
- **AND** 该行为 MUST 受环境边界限制，不能在生产环境启用

### Requirement: Strapi 不可用且 CDN 无可用缓存时必须进入维护态
当 CDN 无可用缓存且 Strapi 不可用时，公开页面和公开 API SHALL 进入维护态。Nuxt BFF MUST 使用 `MAINTENANCE`/503 语义表示内容源不可用，而不是使用 404 或 mock 数据。

#### Scenario: 首页回源时 Strapi 不可用
- **WHEN** 访问者请求首页且 CDN 无可用缓存
- **AND** Nuxt BFF 无法从 Strapi 获取首页所需内容
- **THEN** 系统 MUST 返回维护态并展示维护页

#### Scenario: 列表页回源时 Strapi 不可用
- **WHEN** 访问者请求活动、公告、动态或社员列表且 CDN 无可用缓存
- **AND** Nuxt BFF 请求 Strapi 失败
- **THEN** 系统 MUST 返回维护态
- **AND** 系统 MUST NOT 展示 mock 列表内容

#### Scenario: 详情页回源时 Strapi 不可用
- **WHEN** 访问者请求公开详情页且 CDN 无可用缓存
- **AND** Nuxt BFF 请求 Strapi 失败
- **THEN** 系统 MUST 返回维护态
- **AND** 系统 MUST NOT 将该故障误报为内容不存在

### Requirement: 内容不存在必须区别于内容源不可用
系统 SHALL 区分 Strapi 正常响应中的内容不存在和 Strapi 不可用。只有在 Strapi 正常响应且目标内容不存在、未发布或不可公开时，系统才 MUST 返回 `NOT_FOUND`/404。

#### Scenario: Strapi 正常响应但 slug 不存在
- **WHEN** 访问者请求某个公开详情页
- **AND** Strapi 正常响应但没有匹配的已发布内容
- **THEN** 系统 MUST 返回 `NOT_FOUND`/404

#### Scenario: Strapi 请求失败
- **WHEN** 访问者请求某个公开详情页
- **AND** Nuxt BFF 请求 Strapi 发生连接失败、超时或无响应
- **THEN** 系统 MUST 返回 `MAINTENANCE`/503 语义
- **AND** 系统 MUST NOT 返回 `NOT_FOUND`/404

### Requirement: 维护页必须具备最小可用兜底内容
维护页 SHALL 在 Strapi 不可用时仍可展示最小可用内容。系统 MUST 提供内置站点名称、维护标题和维护说明兜底，不得要求维护页必须成功读取 Strapi 站点配置才能渲染。

#### Scenario: 维护页无法读取站点配置
- **WHEN** 系统需要展示维护页
- **AND** Strapi 站点配置不可用
- **THEN** 维护页 MUST 使用内置最小站点信息和维护文案渲染
- **AND** 页面 MUST 清楚说明官网内容服务暂时不可用

#### Scenario: 维护页 SEO
- **WHEN** 系统展示维护页
- **THEN** 维护页 MUST NOT 被长期索引
- **AND** 系统 MUST 遵循详细设计文档中维护页和 503 的 SEO 约束

### Requirement: 第一阶段不得引入服务端持久缓存依赖
第一阶段生产数据获取策略 SHALL 不引入 Redis、KV、服务端持久 last-known-good 缓存或新的持久缓存数据库。系统 MUST 依赖 CDN/HTTP Cache-Control 作为公开内容缓存层，并在源站不可用且无缓存时使用维护态。

#### Scenario: 检查运行依赖
- **WHEN** 本变更实现完成后检查生产数据获取相关代码和配置
- **THEN** 系统 MUST NOT 新增 Redis、KV 或服务端持久 last-known-good 缓存依赖
- **AND** 系统 MUST 保留 CDN/HTTP Cache-Control 作为缓存策略

#### Scenario: Strapi 不可用且没有缓存
- **WHEN** CDN 没有可用缓存
- **AND** Strapi 不可用
- **THEN** 系统 MUST 进入维护态
- **AND** 系统 MUST NOT 从服务端持久 last-known-good 缓存读取旧内容
