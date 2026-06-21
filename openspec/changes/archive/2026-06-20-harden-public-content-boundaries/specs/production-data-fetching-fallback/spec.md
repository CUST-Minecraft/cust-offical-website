## MODIFIED Requirements

### Requirement: 内容不存在必须区别于内容源不可用
系统 SHALL 区分 Strapi 正常响应中的内容不存在和 Strapi 不可用。只有在 Strapi 正常响应且目标内容不存在、未发布或不可公开时，系统才 MUST 返回 `NOT_FOUND`/404。全局 Strapi unavailable 判定 MUST NOT 将普通 404 视为连接失败、超时或上游不可用。

#### Scenario: Strapi 正常响应但 slug 不存在
- **WHEN** 访问者请求某个公开详情页
- **AND** Strapi 正常响应但没有匹配的已发布内容
- **THEN** 系统 MUST 返回 `NOT_FOUND`/404

#### Scenario: Strapi 请求失败
- **WHEN** 访问者请求某个公开详情页
- **AND** Nuxt BFF 请求 Strapi 发生连接失败、超时或无响应
- **THEN** 系统 MUST 返回 `MAINTENANCE`/503 语义
- **AND** 系统 MUST NOT 返回 `NOT_FOUND`/404

#### Scenario: Strapi 返回 404
- **WHEN** Nuxt BFF 请求 Strapi 并收到普通 404 响应
- **THEN** 系统 MUST NOT 因全局 mock fallback 将该 404 当作 Strapi 不可用
- **AND** 系统 MUST 将该情况保留为内容缺失、路径错误或配置缺失语义，由调用方按接口职责处理

#### Scenario: 生产环境内容不存在
- **WHEN** 生产环境公开详情页请求的 slug 不存在、未发布或不可公开
- **THEN** 系统 MUST 返回 `NOT_FOUND`/404
- **AND** 系统 MUST NOT 返回维护态来掩盖真实内容不存在

#### Scenario: 生产环境内容源不可用
- **WHEN** 生产环境 Nuxt BFF 请求 Strapi 发生连接失败、DNS 失败、连接重置、超时、502、503 或 504
- **THEN** 系统 MUST 返回 `MAINTENANCE`/503 语义
- **AND** 系统 MUST NOT 返回 `NOT_FOUND`/404
