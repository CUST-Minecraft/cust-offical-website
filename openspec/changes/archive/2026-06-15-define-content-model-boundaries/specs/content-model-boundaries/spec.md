## ADDED Requirements

### Requirement: 站点配置只承载官网基础身份信息
官网 SHALL 将站点基础配置、维护页配置和外部服务入口拆分为独立内容模型。`site-setting` MUST 只承载官网品牌、SEO、导航、页脚关于我们链接、版权和署名等站点基础信息。

#### Scenario: 检查站点配置模型职责
- **WHEN** 内容管理员查看 `site-setting` 模型
- **THEN** 系统 MUST 提供站点名称、短名称、英文名、Logo、favicon、站点描述、导航、页脚关于我们链接、版权和署名字段
- **AND** 系统 MUST NOT 在 `site-setting` 中继续要求维护皮肤站 URL、文档中心 URL、服务状态列表或维护页开关

#### Scenario: Header 渲染站点品牌
- **WHEN** 访问者打开官网 Header
- **THEN** 系统 MUST 从站点基础配置读取品牌名称、英文副标题和 Logo 信息
- **AND** 系统 MUST 从外部服务模型读取皮肤站入口，而不是从站点基础配置读取皮肤站 URL

#### Scenario: 页脚渲染站点基础信息
- **WHEN** 访问者查看官网页脚
- **THEN** 系统 MUST 从站点基础配置读取品牌信息、版权、署名和关于我们链接
- **AND** 系统 MUST 从外部服务模型读取外联入口

### Requirement: 维护页配置独立于站点配置
官网 SHALL 使用独立维护页模型管理维护模式、维护页文案、预计恢复时间和服务状态列表。维护页配置 MUST NOT 依赖 `site-setting` 中的维护字段作为长期数据来源。

#### Scenario: 内容管理员维护维护页
- **WHEN** 内容管理员需要开启或关闭官网维护态
- **THEN** 系统 MUST 在维护页模型中提供维护开关、标题、说明、预计恢复时间和服务状态列表
- **AND** 系统 MUST NOT 要求内容管理员进入站点基础配置修改维护开关

#### Scenario: 前台展示维护页
- **WHEN** 官网进入维护态
- **THEN** 系统 MUST 从维护页模型读取维护标题、说明、预计恢复时间和服务状态
- **AND** 系统 MUST 在维护页模型不可用时使用内置最小兜底内容

### Requirement: 外部服务入口使用统一模型管理
官网 SHALL 使用 `external-service` 模型统一管理外部服务和服务入口。外部服务模型 MUST 支持稳定标识、名称、说明、URL、图标、启用状态、禁用说明、展示位置和排序。

#### Scenario: 配置皮肤站入口
- **WHEN** 内容管理员配置 `key` 为 `skin` 的外部服务
- **THEN** 系统 MUST 允许维护皮肤站名称、URL、图标、启用状态和 Header 展示位置
- **AND** Header 皮肤站按钮 MUST 使用该外部服务数据

#### Scenario: 配置文档中心入口
- **WHEN** 内容管理员配置 `key` 为 `docs` 的外部服务
- **THEN** 系统 MUST 允许维护文档中心名称、URL、图标、启用状态、工作台展示位置和搜索展示位置
- **AND** 社团服务工作台与搜索浮层 MUST 使用该外部服务数据

#### Scenario: 配置页脚外联
- **WHEN** 内容管理员配置需要在页脚展示的外部服务
- **THEN** 系统 MUST 通过外部服务的页脚展示位置和排序渲染外联栏目
- **AND** 系统 MUST NOT 依赖 `site-setting.footerExternalLinks` 作为长期页脚外联来源

### Requirement: 字段化内容与 Markdown 正文边界明确
官网 SHALL 将系统需要识别、筛选、排序、跳转、复用或控制样式的内容建模为结构化字段。官网 SHALL 只将主要给人阅读并需要自由排版的正文类内容作为 Markdown 或等价富文本正文处理。

#### Scenario: 结构化内容使用字段
- **WHEN** 内容包含标题、摘要、时间、状态、标签、图片、链接、排序、精选关系、导航、页脚、服务入口、维护开关或页面组件配置
- **THEN** 系统 MUST 使用结构化字段表示这些内容
- **AND** 系统 MUST NOT 要求内容管理员用 Markdown 拼装页面结构或服务入口

#### Scenario: 正文内容使用 Markdown
- **WHEN** 内容属于活动详情、公告正文、社团动态正文、社团介绍正文、服务器说明、加入引导、入社介绍或服务器加入说明
- **THEN** 系统 MUST 将该内容作为 Markdown 或等价富文本正文处理
- **AND** 系统 MUST 保留标题、摘要、封面、分类、标签和发布时间等元信息为结构化字段

#### Scenario: 摘要内容保持普通文本
- **WHEN** 内容作为卡片摘要、搜索摘要、SEO 描述、FAQ 回答或流程步骤说明展示
- **THEN** 系统 MUST 将该内容作为普通文本或结构化短文本字段处理
- **AND** 系统 MUST NOT 依赖 Markdown 解析来决定列表、卡片或搜索结果结构

### Requirement: 公开 API 输出拆分后的标准数据
Nuxt BFF SHALL 从拆分后的 Strapi 内容模型读取公开数据，并向前端输出稳定标准数据结构。前台页面 MUST NOT 直接调用 Strapi 原始 API。

#### Scenario: 获取公开站点配置
- **WHEN** 前台请求公开站点配置
- **THEN** 系统 MUST 返回站点品牌、导航、页脚基础信息和必要的外部服务摘要
- **AND** 响应 MUST NOT 把维护页配置和全部外部服务详情混入 `site` 基础字段

#### Scenario: 获取外部服务列表
- **WHEN** 前台需要渲染 Header、社团服务工作台、页脚外联或搜索快捷结果
- **THEN** 系统 MUST 通过 Nuxt BFF 获取标准化外部服务数据
- **AND** 前台 MUST NOT 直接请求 Strapi 的 `external-service` 原始 API

#### Scenario: 获取维护页数据
- **WHEN** 前台需要展示维护页或服务状态
- **THEN** 系统 MUST 通过 Nuxt BFF 获取维护页配置和服务状态
- **AND** 系统 MUST 在内容源不可用时提供内置最小兜底维护内容
