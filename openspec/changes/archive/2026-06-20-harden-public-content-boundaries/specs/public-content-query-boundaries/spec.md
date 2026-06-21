## ADDED Requirements

### Requirement: 公开列表分页参数必须被归一化
Nuxt BFF 公开列表接口 SHALL 在进入 Strapi 查询或 mock pagination 前归一化分页参数。`page` 和 `pageSize` MUST 始终为有限正整数，且 `pageSize` MUST 受上限约束。

#### Scenario: 缺省分页参数
- **WHEN** 访问者请求 `GET /api/public/activities`、`GET /api/public/announcements` 或 `GET /api/public/posts` 且未提供分页参数
- **THEN** 系统 MUST 使用 `page=1`
- **AND** 系统 MUST 使用默认 `pageSize=10`

#### Scenario: 非数字分页参数
- **WHEN** 访问者请求公开列表接口并提供 `page=abc` 或 `pageSize=abc`
- **THEN** 系统 MUST 不向 Strapi 发送 `NaN` 分页值
- **AND** 系统 MUST 回退到受控默认分页值

#### Scenario: 小于最小值的分页参数
- **WHEN** 访问者请求公开列表接口并提供 `page=0`、`page=-1`、`pageSize=0` 或 `pageSize=-1`
- **THEN** 系统 MUST 将 `page` 归一为至少 `1`
- **AND** 系统 MUST 将 `pageSize` 归一为至少 `1` 或回退到默认值

#### Scenario: 过大的 pageSize
- **WHEN** 访问者请求公开列表接口并提供超过系统上限的 `pageSize`
- **THEN** 系统 MUST 将 `pageSize` 限制在公开列表允许的最大值内
- **AND** 系统 MUST 不允许单次公开列表请求绕过该上限拉取过量内容

### Requirement: mock pagination 必须输出稳定 meta
开发或测试环境使用 mock pagination 时，系统 SHALL 使用与公开列表接口一致的分页归一化规则。mock pagination MUST NOT 输出 `NaN`、负数、小数或无穷大的分页 meta。

#### Scenario: mock fallback 收到非法分页参数
- **WHEN** 非生产环境 Strapi 不可用且公开列表接口进入 mock fallback
- **AND** 原始请求包含非法 `page` 或 `pageSize`
- **THEN** mock pagination MUST 返回稳定的 `page`、`pageSize`、`pageCount` 和 `total`
- **AND** `data` 切片 MUST 基于归一化后的分页参数计算

#### Scenario: mock fallback 收到过大 pageSize
- **WHEN** 非生产环境 Strapi 不可用且公开列表接口进入 mock fallback
- **AND** 原始请求包含超过上限的 `pageSize`
- **THEN** mock pagination MUST 使用受限后的 `pageSize`
- **AND** 响应 meta 中的 `pageSize` MUST 与实际切片使用的值一致
