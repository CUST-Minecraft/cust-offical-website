## Purpose

Define the public website boundary after removing the local login, member center, member service routing, and download distribution capabilities. The website is a public presentation and content aggregation system that links to independent external services where needed.

## Requirements

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

### Requirement: 文档中心作为公开外部服务入口
官网 SHALL 将文档中心视为独立外部系统，并且只通过公开入口引导访问者前往该系统。官网 MUST NOT 通过官网登录态控制文档中心访问，不代理、不嵌入、不同步、不管理文档中心业务数据。

#### Scenario: 快捷工具展示文档中心入口
- **WHEN** 访问者打开官网快捷工具
- **THEN** 系统 MUST 将文档中心展示为公开外部服务入口
- **AND** 系统 MUST NOT 要求访问者先登录官网或进入社员中心

#### Scenario: 访问文档中心外部系统
- **WHEN** 访问者通过官网打开文档中心
- **THEN** 系统 MUST 直接访问配置的外部文档中心 URL
- **AND** 文档中心的账号、权限、文档编辑和访问控制 MUST 由文档中心自身处理

#### Scenario: 检查官网边界
- **WHEN** 系统实现完成后检查官网路由、公开 API 和 Strapi 内容模型
- **THEN** 系统 MUST NOT 新增文档中心代理接口、文档内容托管模型、文档下载 API、官网登录态校验或 `/api/member/*` 依赖

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

### Requirement: 生产公开接口不得用 mock 数据冒充真实内容
官网作为公开展示和内容聚合系统时，生产环境公开接口 SHALL 只返回真实已发布公开内容、缓存命中的公开内容或明确的错误/维护态。生产环境 MUST NOT 使用 mock 数据冒充 CMS 内容。

#### Scenario: 生产公开接口无法访问 CMS
- **WHEN** 生产环境 `/api/public/*` 接口无法访问 Strapi CMS
- **THEN** 系统 MUST NOT 返回 mock 当前内容、mock 首页、mock 公告、mock 活动、mock 动态或 mock 社员资料
- **AND** 系统 MUST 返回维护态或由 CDN 返回已有缓存

#### Scenario: 开发 mock 与生产内容边界
- **WHEN** 系统保留开发用 mock 数据
- **THEN** mock 数据 MUST 仅用于开发或测试环境
- **AND** 项目文档 MUST 明确 mock 数据不是生产公开内容来源

### Requirement: 页脚外联图标映射不得破坏公开入口展示
官网页脚外联入口 SHALL 继续由外部服务模型驱动。当前台遇到已规划公开服务图标时，系统 MUST 使用对应图标；遇到未知图标时，系统 MUST 保持入口可见并使用安全默认图标。

#### Scenario: 页脚展示配置了 agent 图标的外部服务
- **WHEN** 外部服务模型中存在启用且允许在页脚展示的服务
- **AND** 该服务配置 `agent` 图标
- **THEN** 官网页脚 MUST 展示该外部服务入口
- **AND** 系统 MUST 使用可识别的 `agent` 图标展示该入口

#### Scenario: 页脚展示未知图标的外部服务
- **WHEN** 外部服务模型中存在启用且允许在页脚展示的服务
- **AND** 该服务配置了前台尚不支持的图标
- **THEN** 官网页脚 MUST 保持该外部服务入口可见
- **AND** 系统 MUST 使用安全默认图标，而不是隐藏入口或抛出错误
