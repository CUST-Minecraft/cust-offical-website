## Purpose

Define the homepage Hero carousel overlay strategy for balancing Minecraft-style title readability with bright campus showcase imagery.

## Requirements

### Requirement: Hero Slide 支持遮罩行为模式
首页 Hero 轮播 SHALL 为每张 slide 提供独立的遮罩行为模式，使遮罩不再只由文案位置隐式决定。系统 MUST 至少支持文案侧遮罩、角落轻暗角、局部文字增强、轻边缘收束和无大面积遮罩五类行为。

#### Scenario: 配置品牌主视觉遮罩
- **WHEN** 首页 Hero Slide 配置为文案侧遮罩模式
- **THEN** 系统 MUST 根据文案位置生成对应方向的背景遮罩
- **AND** 系统 MUST 使用该 slide 的遮罩强度控制遮罩深浅

#### Scenario: 配置展示型全景遮罩
- **WHEN** 首页 Hero Slide 配置为局部文字增强或无大面积遮罩模式
- **THEN** 系统 MUST 保留背景图主体区域的原始亮度和空间感
- **AND** 系统 MUST NOT 对整张背景图应用中等或强烈的方向性暗角
- **AND** 系统 MUST NOT 在文字背后显示可见背景面板

#### Scenario: 配置氛围图轻收边
- **WHEN** 首页 Hero Slide 配置为轻边缘收束模式
- **THEN** 系统 MUST 只对画面边缘提供轻微视觉收束
- **AND** 系统 MUST NOT 明显压暗主体建筑、天空或需要展示的画面中心

#### Scenario: 配置角落轻暗角
- **WHEN** 首页 Hero Slide 配置为角落轻暗角模式
- **THEN** 系统 MUST 根据遮罩锚点只在指定角落生成轻量暗角
- **AND** 系统 MUST NOT 将暗角扩展为整侧大面积遮罩
- **AND** 系统 MUST 保留背景图主体区域的原始亮度和空间感

### Requirement: Hero Slide 遮罩模式兼容旧内容
首页 Hero 轮播 SHALL 在旧内容缺少遮罩行为模式或遮罩锚点时保持现有渲染结果。Nuxt BFF MUST 为缺少遮罩行为字段的 slide 输出兼容默认模式，并为缺少遮罩锚点字段的 slide 输出稳定默认锚点。

#### Scenario: 旧 Hero Slide 没有遮罩模式字段
- **WHEN** Nuxt BFF 从 Strapi 读取到没有遮罩行为模式字段的 Hero Slide
- **THEN** 系统 MUST 使用文案侧遮罩作为默认模式
- **AND** 系统 MUST 继续使用既有遮罩强度、文案位置和背景焦点字段渲染该 slide

#### Scenario: 旧 Hero Slide 没有遮罩锚点字段
- **WHEN** Nuxt BFF 从 Strapi 读取到没有遮罩锚点字段的 Hero Slide
- **THEN** 系统 MUST 输出稳定的默认遮罩锚点
- **AND** 非角落轻暗角模式 MUST NOT 因该默认锚点改变遮罩表现

#### Scenario: 前端接收标准化 Hero Slide
- **WHEN** 前端 `HomeHero` 接收首页聚合数据
- **THEN** 每个 Hero Slide MUST 包含稳定的遮罩模式值
- **AND** 前端 MUST 根据遮罩模式和遮罩强度选择对应渲染策略

### Requirement: 首页默认 Hero 轮播按图片角色选择遮罩
首页默认内容 SHALL 按 slide 图片角色选择遮罩策略。品牌主视觉可以使用中等文案侧遮罩，氛围图可以使用轻遮罩，展示型校园全景 MUST 避免中等或强烈的大面积方向遮罩。

#### Scenario: 默认校园全景 slide 渲染
- **WHEN** 访问者查看默认首页 Hero 的校园全景 slide
- **THEN** 系统 MUST 避免使用中等或强烈的大面积方向遮罩压暗该全景图
- **AND** 该 slide MUST 通过角落轻暗角、文字描边、文字阴影、按钮自身样式或无大面积遮罩保持文案可读

#### Scenario: 默认品牌主视觉 slide 渲染
- **WHEN** 访问者查看默认首页 Hero 的品牌主视觉 slide
- **THEN** 系统 MUST 允许使用文案侧遮罩突出标题和行动按钮
- **AND** 系统 MUST 保持主要建筑主体可见
