## ADDED Requirements

### Requirement: Activity 可选公开字段必须归一化为字符串
Nuxt BFF SHALL 将 Activity 中用于公开展示的可选文本字段归一化为字符串或空值。系统 MUST NOT 将 Strapi 原始对象、数组或其他非字符串值作为 `endTime`、`location`、`signupUrl` 等公开字段返回给前台。

#### Scenario: Activity 可选字段为字符串
- **WHEN** Strapi Activity 内容包含字符串形式的结束时间、地点或报名链接
- **THEN** Nuxt BFF MUST 在公开响应中返回对应字符串
- **AND** 前台页面 MUST 能直接按公开契约展示或使用该值

#### Scenario: Activity 可选字段不是字符串
- **WHEN** Strapi Activity 内容中的结束时间、地点或报名链接为空、对象、数组或其他非字符串值
- **THEN** Nuxt BFF MUST 将对应公开字段归一化为空值
- **AND** 系统 MUST NOT 将 Strapi 原始非字符串值泄漏到公开响应

### Requirement: 外部服务图标输出必须匹配公开服务契约
Nuxt BFF SHALL 对外部服务入口图标进行稳定归一化。系统 MUST 覆盖当前公开服务模型中已经使用的图标标识，并在未知图标出现时返回安全默认图标。

#### Scenario: 外部服务配置 agent 图标
- **WHEN** 内容管理员为悦灵助手等公开服务配置 `agent` 图标
- **THEN** Nuxt BFF MUST 将 `agent` 作为有效图标返回
- **AND** 前台 MUST 能按公开服务契约识别该图标

#### Scenario: 外部服务配置未知图标
- **WHEN** 内容管理员配置了前台尚不支持的图标标识
- **THEN** Nuxt BFF MUST 返回安全默认图标
- **AND** 系统 MUST NOT 因未知图标导致公开服务入口消失或接口失败
