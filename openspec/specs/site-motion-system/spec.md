## Purpose

Define the shared motion system for the public CUST Minecraft website, including global timing tokens, viewport reveal behavior, search transitions, pixel-style microinteractions, and reduced motion support.

## Requirements

### Requirement: 全站动效使用统一 motion tokens
官网前台 SHALL 使用统一 motion tokens 表达 hover、状态切换、弹层、内容入场和氛围动画的时长与缓动。系统 MUST NOT 在新增动效中随意散写互相冲突的时长和缓动。

#### Scenario: 使用统一动效节奏
- **WHEN** 开发者查看前台样式中的新增或调整动效
- **THEN** 系统 MUST 通过全局 motion tokens 或等价共享变量表达常用时长和缓动
- **AND** hover、弹层、内容入场和氛围动画 MUST 使用可区分的节奏层级
- **AND** 新增动效 MUST NOT 依赖新的第三方动画库

#### Scenario: 保持布局稳定
- **WHEN** 新增动效播放
- **THEN** 系统 MUST NOT 造成文本、按钮、卡片、导航栏或图片容器发生非预期尺寸变化
- **AND** 系统 MUST NOT 在移动端产生非预期横向滚动

### Requirement: 页面内容具有轻量进入视口动效
官网前台 SHALL 为主要内容模块提供轻量进入视口动效。动效 MUST 服务于页面层次和浏览节奏，不得遮挡正文阅读或制造持续运动干扰。

#### Scenario: 首页内容横幅进入视口
- **WHEN** 访问者滚动浏览首页内容横幅
- **THEN** 系统 MUST 让主要横幅内容以轻量淡入或短位移动效进入可视区域
- **AND** 横幅内部标签、活动条目、缩略图或社员条目 MAY 使用短暂分组延迟表达层次
- **AND** 动效 MUST NOT 遮挡或延迟核心文本可读性

#### Scenario: 列表页卡片进入视口
- **WHEN** 访问者查看活动、公告、动态或社员列表
- **THEN** 系统 MUST 为列表卡片提供轻量进入或状态切换动效
- **AND** 动效 MUST 保持卡片网格尺寸稳定

#### Scenario: 通用页头进入页面
- **WHEN** 访问者打开使用通用页头的页面
- **THEN** 系统 MUST 为页头背景、标题或摘要提供轻量入场反馈
- **AND** 动效 MUST NOT 影响首屏标题和摘要的可读性

### Requirement: 搜索结果变化具有短过渡
全站搜索 SHALL 在结果、分组和空状态变化时提供短过渡。过渡 MUST 保持搜索输入响应快速，并避免结果列表明显闪烁。

#### Scenario: 搜索结果从建议切换为匹配结果
- **WHEN** 访问者在全站搜索中输入关键词
- **THEN** 系统 MUST 以短过渡展示匹配结果、结果分组或空状态
- **AND** 过渡 MUST NOT 阻塞输入框输入、回车进入首个结果或键盘聚焦

#### Scenario: 搜索结果为空
- **WHEN** 当前关键词没有匹配结果
- **THEN** 系统 MUST 以短过渡展示空状态
- **AND** 空状态 MUST 保持文本可读且不与搜索框或关闭按钮重叠

### Requirement: 微交互反馈保持像素风且可访问
官网前台 SHALL 为按钮、链接、筛选项、列表项和卡片 hover/focus/active 状态提供一致微交互反馈。反馈 MUST 与 Minecraft 像素风视觉一致，并保留键盘可见焦点。

#### Scenario: 使用按钮或链接
- **WHEN** 访问者 hover、focus 或激活可点击元素
- **THEN** 系统 MUST 提供明确的视觉反馈
- **AND** 反馈 MUST NOT 只依赖快速位移动画表达
- **AND** 键盘 focus 状态 MUST 保持可见

#### Scenario: 使用活动筛选项
- **WHEN** 访问者切换活动筛选项
- **THEN** 系统 MUST 展示当前选中状态的短过渡
- **AND** 列表内容变化 MUST 保持布局稳定

### Requirement: 用户减少动态偏好得到完整支持
官网前台 SHALL 支持 `prefers-reduced-motion: reduce`。当用户偏好减少动态时，系统 MUST 停止新增位移、缩放、模糊、循环扫描和分组延迟动画，同时保留静态状态反馈。

#### Scenario: 用户启用减少动态
- **WHEN** 用户系统偏好为减少动态
- **THEN** 系统 MUST 停止页面内容入场位移、搜索结果位移、工作台内部切换位移和循环氛围动画
- **AND** 系统 MUST 保留静态高光、边框、颜色、亮度或阴影作为状态反馈
- **AND** 系统 MUST NOT 因停止动画导致内容不可见

#### Scenario: 用户未启用减少动态
- **WHEN** 用户未启用减少动态
- **THEN** 系统 MAY 播放轻量动效
- **AND** 动效 MUST 保持克制，不得持续干扰正文阅读
