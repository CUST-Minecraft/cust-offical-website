## Purpose

Define the public website content model boundaries for site identity, maintenance page data, external service entries, structured fields, Markdown body content, and Nuxt BFF public output.

## Requirements

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
官网 SHALL 将系统需要识别、筛选、排序、跳转、复用或控制样式的内容建模为结构化字段。官网 SHALL 只将主要给人阅读并需要自由排版的正文类内容作为 Markdown 或等价富文本正文处理。流程步骤中的图片、图片说明、明细条目和动作入口属于结构化页面组件内容，MUST NOT 依赖 Markdown 拼装。

#### Scenario: 结构化内容使用字段
- **WHEN** 内容包含标题、摘要、时间、状态、标签、图片、链接、排序、精选关系、导航、页脚、服务入口、维护开关、页面组件配置、流程步骤图片、流程步骤条目或流程步骤动作入口
- **THEN** 系统 MUST 使用结构化字段表示这些内容
- **AND** 系统 MUST NOT 要求内容管理员用 Markdown 拼装页面结构、服务入口或流程步骤媒体

#### Scenario: 正文内容使用 Markdown
- **WHEN** 内容属于活动详情、公告正文、社团动态正文、社团介绍正文、服务器说明、加入引导、入社介绍或服务器加入说明
- **THEN** 系统 MUST 将该内容作为 Markdown 或等价富文本正文处理
- **AND** 系统 MUST 保留标题、摘要、封面、分类、标签和发布时间等元信息为结构化字段

#### Scenario: 摘要内容保持普通文本
- **WHEN** 内容作为卡片摘要、搜索摘要、SEO 描述、FAQ 回答、流程步骤说明、流程步骤图片说明或流程步骤明细条目展示
- **THEN** 系统 MUST 将该内容作为普通文本或结构化短文本字段处理
- **AND** 系统 MUST NOT 依赖 Markdown 解析来决定列表、卡片、流程步骤或搜索结果结构

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

### Requirement: 前台字段提示映射内容模型
官网 SHALL 为内容维护辅助层提供可维护字段到 Strapi 内容模型的轻量映射。该映射 MUST 反映现有内容模型边界，帮助维护人员理解前台内容应在后台哪个数据模型和字段中修改，但 MUST NOT 改变 `site-setting`、`external-service`、`maintenance-page` 或其他内容模型的职责。

#### Scenario: 站点基础字段映射到 site-setting
- **WHEN** 字段提示模式标注站点名称、短名称、英文名、Logo、导航、页脚版权或页脚关于我们链接
- **THEN** 系统 MUST 将这些字段说明为来自站点设置模型
- **AND** 系统 MUST 显示对应字段名称和页面用途

#### Scenario: 外部服务入口映射到 external-service
- **WHEN** 字段提示模式标注皮肤站、文档中心、MUA 官网或其他外部服务入口
- **THEN** 系统 MUST 将这些字段说明为来自外部服务模型
- **AND** 系统 MUST NOT 暗示这些字段属于 `site-setting`

#### Scenario: 维护页字段映射到 maintenance-page
- **WHEN** 字段提示模式标注维护页标题、维护说明、预计恢复时间或服务状态条目
- **THEN** 系统 MUST 将这些字段说明为来自维护页模型
- **AND** 系统 MUST 显示对应字段名称和页面用途

#### Scenario: 字段提示不改变内容模型职责
- **WHEN** 系统实现字段提示能力
- **THEN** 系统 MUST NOT 新增用于字段提示的 Strapi content-type
- **AND** 系统 MUST NOT 为字段提示修改现有公开内容模型字段
- **AND** 系统 MUST NOT 改变 Nuxt BFF 公开数据契约

### Requirement: 首页 Hero 遮罩策略属于结构化页面组件配置
官网 SHALL 将首页 Hero Slide 的遮罩行为模式和遮罩锚点作为结构化页面组件字段管理。这些字段 MUST 通过 Strapi Hero Slide 组件维护，并由 Nuxt BFF 标准化输出给前端。

#### Scenario: 内容管理员配置 Hero Slide 遮罩模式
- **WHEN** 内容管理员维护首页 Hero Slide
- **THEN** 系统 MUST 提供可选择的遮罩行为模式字段
- **AND** 系统 MUST 在需要角落轻暗角时提供可选择的遮罩锚点字段
- **AND** 系统 MUST NOT 要求内容管理员通过 Markdown、图片文件命名或前端硬编码决定遮罩行为

#### Scenario: 首页聚合接口输出遮罩模式
- **WHEN** 前台请求 `GET /api/public/home`
- **THEN** 系统 MUST 在每个标准化 Hero Slide 中输出遮罩行为模式
- **AND** 系统 MUST 在每个标准化 Hero Slide 中输出遮罩锚点
- **AND** 系统 MUST 在内容源缺少这些字段时输出兼容默认值

### Requirement: 首页 Hero 图片图注属于结构化页面组件配置
官网 SHALL 将首页 Hero Slide 的图片地点、原图摄影作者和图注位置作为结构化页面组件字段管理。这些字段 MUST 通过 Strapi Hero Slide 组件维护，并由 Nuxt BFF 标准化输出给前端。

#### Scenario: 内容管理员配置 Hero Slide 图片图注
- **WHEN** 内容管理员维护首页 Hero Slide 的图片图注
- **THEN** 系统 MUST 提供可选的图片地点字段
- **AND** 系统 MUST 提供可选的原图摄影作者字段
- **AND** 系统 MUST 提供可选的图注位置字段，支持自动避让 Hero 主文案位置
- **AND** 系统 MUST NOT 要求内容管理员通过 Markdown、Hero 主文案、图片文件名或前端硬编码维护图片图注

#### Scenario: 首页聚合接口输出 Hero Slide 图片图注
- **WHEN** 前台请求 `GET /api/public/home`
- **THEN** 系统 MUST 在每个标准化 Hero Slide 中输出图片地点字段
- **AND** 系统 MUST 在每个标准化 Hero Slide 中输出原图摄影作者字段
- **AND** 系统 MUST 在每个标准化 Hero Slide 中输出图注位置字段
- **AND** 系统 MUST 在内容源缺少这些字段时输出可安全隐藏的空值

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

### Requirement: HomePage 精选关系优先驱动首页聚合
首页聚合 SHALL 将 `home-page` 模型中的精选关系作为首页活动、公告、动态、社员和图库区块的优先数据来源。当前台请求 `GET /api/public/home` 时，Nuxt BFF MUST 优先读取并标准化 HomePage 的 `featuredActivities`、`featuredAnnouncements`、`featuredPosts`、`featuredMembers` 和 `galleryItems`；当某个关系为空时，系统 MUST 回退到该内容类型既有自动推荐或排序查询。

#### Scenario: HomePage 配置了精选活动
- **WHEN** 内容管理员在 HomePage 中配置了 `featuredActivities`
- **THEN** `GET /api/public/home` 返回的首页活动列表 MUST 优先使用这些精选活动
- **AND** 系统 MUST 将活动媒体和字段标准化为前台稳定结构

#### Scenario: HomePage 未配置精选活动
- **WHEN** HomePage 的 `featuredActivities` 为空
- **THEN** `GET /api/public/home` MUST 回退到既有活动推荐查询
- **AND** 若回退查询也为空，系统 MUST 返回真实空数组

#### Scenario: HomePage 配置了精选公告、动态、社员或图库
- **WHEN** 内容管理员在 HomePage 中配置了 `featuredAnnouncements`、`featuredPosts`、`featuredMembers` 或 `galleryItems`
- **THEN** `GET /api/public/home` 对应区块 MUST 优先使用 HomePage 关系数据
- **AND** 系统 MUST 保持各内容类型的公开字段标准化、媒体 `{ src, alt }` 标准化和排序稳定

#### Scenario: HomePage 精选关系为空
- **WHEN** HomePage 的某个精选关系为空
- **THEN** 系统 MUST 对该区块使用既有自动推荐或排序回退
- **AND** 系统 MUST NOT 使用 `frontend/data/mock.ts` 注入示例内容冒充真实 CMS 内容

#### Scenario: 首页精选关系保持公开内容边界
- **WHEN** 系统通过 HomePage 精选关系聚合首页内容
- **THEN** 前台页面 MUST 继续通过 Nuxt BFF 的 `/api/public/home` 获取标准化数据
- **AND** 前台页面 MUST NOT 直接请求 Strapi 原始 API
- **AND** 系统 MUST NOT 因精选关系引入新的公开登录、权限、下载或自研后台能力
