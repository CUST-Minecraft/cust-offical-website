## Purpose

Define how the public home page distinguishes CMS source failures from real empty CMS content, and how the Nuxt BFF and presentation layer keep the page renderable without masking true content state with mock data.

## Requirements

### Requirement: 首页内容兜底必须区分数据源失败和真实空内容
官网 SHALL 将首页数据兜底分为 Source、Contract 和 Presentation 三层。Source 层 MUST 只在 CMS 不可用时决定开发 mock 或生产维护态；当 CMS 正常响应但首页活动、公告、动态、图库、成员或 Hero 配置为空时，系统 MUST NOT 使用 mock 数据冒充真实内容。

#### Scenario: CMS 不可用时使用来源层降级
- **WHEN** Nuxt BFF 请求首页公开内容时无法连接 Strapi、请求超时或无响应
- **THEN** 系统 MUST 按既有生产数据获取规则进入维护态或在非生产环境使用开发 mock
- **AND** 系统 MUST NOT 将该故障当作真实空内容处理

#### Scenario: CMS 可用但首页列表为空
- **WHEN** Strapi 正常响应 `GET /api/public/home` 所需数据
- **AND** 活动、公告、动态、图库或成员列表为空
- **THEN** 系统 MUST 保持对应真实内容列表为空
- **AND** 系统 MUST NOT 从 `frontend/data/mock.ts` 注入示例活动、公告、动态、图库或成员

### Requirement: 首页聚合数据必须提供可渲染的关键视觉骨架
Nuxt BFF SHALL 在标准化首页聚合数据时保证首页关键视觉骨架可渲染。Hero slides 为空或没有可用背景图时，系统 MUST 输出内置默认 Hero slide。真实内容列表为空时，系统 MUST 保持空数组，不得伪造业务内容。

#### Scenario: Hero slides 为空
- **WHEN** Strapi HomePage 正常响应但 `heroSlides` 为空
- **THEN** `GET /api/public/home` MUST 返回至少一个内置默认 Hero slide
- **AND** 默认 Hero slide MUST 包含 `HomeHero` 渲染所需的背景图、文案位置、遮罩、文字宽度、明暗色调、背景焦点和图注字段

#### Scenario: Hero slide 缺少可用背景图
- **WHEN** Strapi HomePage 返回的部分 Hero slide 缺少背景图或背景图 URL 为空
- **THEN** Nuxt BFF MUST 过滤不可渲染的 slide 或用默认 Hero slide 兜底
- **AND** 前端 MUST NOT 接收到只包含空背景图的 Hero slide 列表

#### Scenario: 首页真实内容列表为空
- **WHEN** 首页活动、公告、动态、图库或成员查询结果为空
- **THEN** Nuxt BFF MUST 返回空数组表示真实内容为空
- **AND** Nuxt BFF MUST NOT 创建假活动、假公告、假动态、假图库项或假成员资料

### Requirement: 首页展示层必须安全处理空内容区块
首页 Presentation 层 SHALL 使用安全的展示策略处理空内容。页面模板 MUST NOT 直接访问不确定数组元素的字段，例如 `activities[0].coverImage`、`gallery[0].image` 或 `members[0].avatar`。每个首页区块 MUST 使用明确的图片 fallback 链、轻量空态或局部隐藏策略。

#### Scenario: 活动区块没有活动
- **WHEN** 首页聚合数据中的活动列表为空
- **THEN** 首页活动 banner MUST 仍使用活动默认图、图库图或其他内置安全图片渲染
- **AND** 活动列表子区域 MUST 显示轻量空态或隐藏局部列表
- **AND** 页面 MUST 保留进入活动列表页的入口

#### Scenario: 公告区块没有公告
- **WHEN** 首页聚合数据中的公告列表为空
- **THEN** 首页公告 banner MUST 使用安全图片渲染
- **AND** 公告列表子区域 MUST 显示轻量空态或隐藏局部列表
- **AND** 页面 MUST 保留进入公告列表页的入口

#### Scenario: 动态区块没有动态
- **WHEN** 首页聚合数据中的动态列表为空
- **THEN** 首页动态 banner MUST 使用动态默认图、图库图或其他内置安全图片渲染
- **AND** 页面 MUST 保留进入动态列表页的入口

#### Scenario: 图库区块没有图库项
- **WHEN** 首页聚合数据中的图库列表为空
- **THEN** 首页图库 banner MUST 使用图库默认图或其他内置安全图片渲染
- **AND** 图库缩略图区域 MUST 隐藏或显示轻量空态

#### Scenario: 成员区块没有公开成员
- **WHEN** 首页聚合数据中的成员列表为空
- **THEN** 首页成员 banner MUST 使用成员默认图、图库图或其他内置安全图片渲染
- **AND** 成员 token 区域 MUST 隐藏或显示轻量空态
- **AND** 页面 MUST 保留进入社员介绍页的入口

### Requirement: HomeHero 组件必须对坏 props 自保
`HomeHero` 组件 SHALL 在内部建立安全 slide 列表。即使父级传入空 slides、越界 active index 或缺少背景图的 slide，组件也 MUST 使用默认 slide 渲染，不得抛出运行时错误或导致首页白屏。

#### Scenario: HomeHero 接收空 slides
- **WHEN** `HomeHero` 接收到 `hero.slides` 为空数组
- **THEN** 组件 MUST 使用内置 fallback slide 渲染 Hero
- **AND** 组件 MUST NOT 访问 `undefined.contentAlign`、`undefined.textStyle` 或其他未定义 slide 字段

#### Scenario: HomeHero 接收部分无效 slide
- **WHEN** `HomeHero` 接收到的 slides 中存在背景图为空的 slide
- **THEN** 组件 MUST 忽略不可渲染 slide 或回退到默认 slide
- **AND** 轮播指示器、背景层、文案层和图注位置计算 MUST 基于安全 slide 列表

#### Scenario: 轮播只有一个安全 slide
- **WHEN** `HomeHero` 的安全 slide 列表只有一个 slide
- **THEN** 组件 MUST 不启动轮播定时切换
- **AND** Hero MUST 保持静态可用状态

### Requirement: 首页内容兜底设计必须同步到详细设计文档
项目文档 SHALL 反映首页内容兜底边界。`docs/详细设计文档.md` MUST 明确 CMS 不可用、必需配置缺失、视觉骨架缺失和真实内容为空的不同处理方式，并说明首页不会用 mock 数据掩盖真实空内容。

#### Scenario: 检查首页错误处理文档
- **WHEN** 本变更实现完成后检查 `docs/详细设计文档.md` 的首页和错误处理章节
- **THEN** 文档 MUST 说明 CMS 不可用时遵循维护态规则
- **AND** 文档 MUST 说明 CMS 可用但首页真实内容为空时使用空态、局部隐藏或默认视觉图处理

#### Scenario: 检查页面实现约束文档
- **WHEN** 本变更实现完成后检查 `docs/详细设计文档.md` 的页面实现约束
- **THEN** 文档 MUST 要求首页等聚合页面安全处理部分内容为空的状态
- **AND** 文档 MUST 不允许用生产 mock 数据冒充真实公开内容
