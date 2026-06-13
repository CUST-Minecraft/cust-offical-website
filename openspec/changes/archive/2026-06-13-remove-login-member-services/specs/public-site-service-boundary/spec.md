## ADDED Requirements

### Requirement: 官网不得提供登录和社员中心能力
官网 SHALL 不提供账号注册、登录、会话、当前用户展示、社员中心、角色化服务列表或基于官网登录态的功能入口。

#### Scenario: 访问公开官网导航
- **WHEN** 访问者打开官网 Header、首页或其他公开页面
- **THEN** 系统 MUST 不展示登录入口、社员中心入口或切换登录入口

#### Scenario: Header 展示皮肤站外链
- **WHEN** 访问者打开官网 Header
- **THEN** 系统 MUST 在原登录按钮位置展示“皮肤站”外链按钮，并继续使用现有地狱门图标

#### Scenario: 点击 Header 皮肤站按钮
- **WHEN** 访问者点击 Header 中的“皮肤站”按钮
- **THEN** 系统 MUST 直接跳转到配置的皮肤站网址，而不是访问 `/login`、`/member` 或 `/member/skin`

#### Scenario: 访问旧登录路由
- **WHEN** 访问者访问 `/login`
- **THEN** 系统 MUST 不展示 mock 登录页、账号登录页或注册入口

#### Scenario: 访问旧社员中心路由
- **WHEN** 访问者访问 `/member`、`/member/skin` 或 `/member/admin`
- **THEN** 系统 MUST 不展示 mock 当前账号、角色、可访问服务列表、皮肤站中转页或内容后台中转页

### Requirement: 官网不得暴露社员权限 API
官网 SHALL 不提供 `/api/member/*` 社员服务接口，不返回 mock 当前账号、角色、可访问服务、皮肤站入口或内容后台入口数据。

#### Scenario: 检查 Nuxt server routes
- **WHEN** 系统实现完成后检查 `frontend/server/api`
- **THEN** 系统 MUST 不包含 `member/me`、`member/services`、`member/skin-entry` 或 `member/admin-entry` 接口

#### Scenario: 检查前端数据调用
- **WHEN** 系统实现完成后检查前端 composables 和页面
- **THEN** 系统 MUST 不调用 `/api/member/*` 或依赖 `MemberAccount`、`MemberService` 类型

### Requirement: 外部服务由各自系统承担访问控制
官网 SHALL 将皮肤站和 CMS 视为独立外部系统，不通过官网登录态控制访问，不代理、不嵌入、不管理其业务数据。

#### Scenario: 皮肤站入口需要展示
- **WHEN** 官网需要向访问者提供皮肤站入口
- **THEN** 系统 MUST 使用 Header 公开外链或公开说明引导，并明确皮肤站登录和权限由皮肤站自身处理

#### Scenario: 管理员访问 CMS
- **WHEN** 内容管理员需要维护官网内容
- **THEN** 系统 MUST 依赖 CMS 自身入口和权限机制，而不是官网登录后的 `/member/admin` 跳转

### Requirement: 官网不得提供下载分发能力
官网 SHALL 不提供资源下载页、公开资源下载 API、资源下载导航入口或 CMS 资源下载内容模型；资源包、整合包、地图和文件分发 SHALL 通过 QQ 群等社群渠道完成。

#### Scenario: 访问公开页面
- **WHEN** 访问者浏览官网导航、搜索和公开页面
- **THEN** 系统 MUST 不展示资源下载站、资源下载页或官网下载入口

#### Scenario: 检查内容模型
- **WHEN** 系统实现完成后检查 `strapi-models`
- **THEN** 系统 MUST 不包含用于官网资源下载的 `resource` content-type 或 tag 到 resource 的关联

### Requirement: 文档必须反映新的官网边界
项目文档 SHALL 将官网定义为公开展示、公开内容聚合和外部服务引导系统，不再描述官网登录、社员中心、角色权限跳转或官网下载服务为当前范围。

#### Scenario: 检查需求与设计文档
- **WHEN** 变更实现完成后检查 `docs/产品需求文档.md`、`docs/总体设计文档.md` 和 `docs/详细设计文档.md`
- **THEN** 文档 MUST 不再把登录页、社员中心、`/api/member/*`、皮肤站受官网登录保护跳转、内容后台受官网登录保护跳转或资源下载页列为当前系统能力

#### Scenario: 检查未来扩展表述
- **WHEN** 文档需要提及未来账号、权限、下载或自研后台能力
- **THEN** 文档 MUST 将其表述为独立后续规划，并且不得暗示本次官网仍保留 mock 登录或社员权限层
