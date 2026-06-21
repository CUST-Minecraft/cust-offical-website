## ADDED Requirements

### Requirement: 搜索浮层首屏不预加载内容索引
官网 SHALL 避免在普通公开页面首屏无条件初始化全站搜索内容索引。搜索浮层 MUST NOT 在访问者尚未打开搜索时请求活动、公告、动态或公开社员资料等仅用于搜索索引的数据。

#### Scenario: 访问公开页面但未打开搜索
- **WHEN** 访问者打开首页、社团介绍页、活动列表页或其他公开页面
- **AND** 访问者尚未点击 Header 搜索入口
- **THEN** 系统 MUST 渲染 Header 搜索按钮
- **AND** 系统 MUST NOT 因搜索浮层而请求活动、公告、动态或公开社员资料索引数据

#### Scenario: Header 使用已有全站配置
- **WHEN** 页面布局已经获取站点导航、外部服务入口和服务状态数据
- **THEN** 搜索浮层 MUST 复用这些数据构建导航、外部服务和服务状态快捷结果
- **AND** 搜索浮层 MUST NOT 为这些快捷结果重复请求 `GET /api/public/settings`

### Requirement: 搜索打开时按需加载内容索引
官网 SHALL 在访问者打开全站搜索时按需加载搜索内容索引。内容索引 MUST 包含活动、公告、动态和公开社员资料，并且 MUST 继续通过 Nuxt BFF 公开接口读取公开数据。

#### Scenario: 第一次打开搜索
- **WHEN** 访问者点击 Header 搜索入口
- **THEN** 系统 MUST 打开搜索浮层并聚焦搜索输入框
- **AND** 系统 MUST 开始加载活动、公告、动态和公开社员资料索引数据
- **AND** 系统 MUST 通过 Nuxt BFF 公开接口获取这些数据

#### Scenario: 搜索索引加载完成
- **WHEN** 搜索内容索引加载成功
- **THEN** 系统 MUST 将活动、公告、动态和公开社员资料加入可搜索结果
- **AND** 系统 MUST 保持导航、外部服务和服务状态快捷结果可搜索

#### Scenario: 再次打开搜索
- **WHEN** 访问者已经打开过搜索且内容索引已加载成功
- **AND** 访问者关闭后再次打开搜索
- **THEN** 系统 MUST 复用当前页面生命周期内已经加载的搜索索引
- **AND** 系统 MUST NOT 因每次打开搜索而强制重复初始化全部索引数据

### Requirement: 搜索加载状态不阻塞核心交互
全站搜索 SHALL 在内容索引加载中、加载失败或结果为空时保持对话框核心交互可用。加载状态 MUST NOT 阻塞输入、关闭、Esc、Tab 聚焦循环或回车进入首个可用结果。

#### Scenario: 内容索引加载中
- **WHEN** 访问者打开搜索且内容索引仍在加载
- **THEN** 系统 MUST 允许访问者输入关键词
- **AND** 系统 MUST 允许访问者关闭搜索浮层
- **AND** 系统 MUST 保持导航、外部服务和服务状态快捷结果可用
- **AND** 系统 MUST 展示加载中或等价状态提示

#### Scenario: 内容索引加载失败
- **WHEN** 活动、公告、动态或公开社员资料索引加载失败
- **THEN** 系统 MUST 保持搜索浮层可关闭
- **AND** 系统 MUST 保持导航、外部服务和服务状态快捷结果可用
- **AND** 系统 MUST 展示局部失败提示，而不是让当前公开页面进入错误页

#### Scenario: 搜索结果为空
- **WHEN** 当前关键词没有匹配结果
- **THEN** 系统 MUST 展示空状态提示
- **AND** 空状态 MUST 保持文本可读且不与搜索框或关闭按钮重叠

### Requirement: 搜索索引加载保持现有公开边界
搜索索引加载 SHALL 使用既有公开数据边界。系统 MUST NOT 直接请求 Strapi 原始 API，MUST NOT 暴露未发布或不可公开内容，MUST NOT 引入新的持久缓存基础设施。

#### Scenario: 加载公开内容索引
- **WHEN** 系统加载搜索内容索引
- **THEN** 系统 MUST 通过 Nuxt BFF 的公开接口获取内容
- **AND** 系统 MUST 只使用已发布、可公开展示的数据
- **AND** 系统 MUST NOT 直接调用 Strapi 原始 API

#### Scenario: 第一阶段缓存边界
- **WHEN** 系统实现搜索索引加载
- **THEN** 系统 MUST NOT 新增 Redis、KV、服务端持久 last-known-good 缓存或新的搜索服务依赖
- **AND** 系统 MUST 保留 CDN/HTTP Cache-Control 作为公开数据缓存策略
