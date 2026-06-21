## MODIFIED Requirements

### Requirement: 外部服务由各自系统承担访问控制
官网 SHALL 将皮肤站、文档中心、MUA 官网、CMS 和其他外部服务视为独立外部系统，不通过官网登录态控制访问，不代理、不嵌入、不管理其业务数据。官网 MUST 使用统一外部服务模型管理公开入口的展示、URL、启用状态和排序。

#### Scenario: 皮肤站入口需要展示
- **WHEN** 官网需要向访问者提供皮肤站入口
- **THEN** 系统 MUST 使用 Header 公开外链或公开说明引导，并明确皮肤站登录和权限由皮肤站自身处理
- **AND** 系统 MUST 从外部服务模型读取皮肤站入口数据

#### Scenario: 管理员访问 CMS
- **WHEN** 内容管理员需要维护官网内容
- **THEN** 系统 MUST 依赖 CMS 自身入口和权限机制，而不是官网登录后的 `/member/admin` 跳转

#### Scenario: 页脚展示外部服务入口
- **WHEN** 官网页脚需要展示 MUA 官网或其他外部入口
- **THEN** 系统 MUST 从外部服务模型读取可在页脚展示的入口
- **AND** 系统 MUST NOT 通过代理、嵌入或抓取方式管理外部网站内容

#### Scenario: 检查外部服务模型边界
- **WHEN** 系统实现完成后检查 `strapi-models`
- **THEN** 系统 MUST 允许外部服务入口配置 URL、图标、启用状态和展示位置
- **AND** 系统 MUST NOT 新增用于管理皮肤站、文档中心、MUA 官网或 CMS 业务数据的 content-type
