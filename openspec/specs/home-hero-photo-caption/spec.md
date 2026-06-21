## Purpose

Define how homepage Hero photo captions are modeled, exposed, and displayed so original image location and photographer credit can be shown without competing with the primary Hero content.

## Requirements

### Requirement: Hero Slide 支持图片图注字段
首页 Hero 轮播 SHALL 为每张 slide 提供可选图片图注字段，用于维护图片地点、原图摄影作者和图注位置。系统 MUST 通过 Strapi Hero Slide 组件维护这些字段，并由 Nuxt BFF 在 `GET /api/public/home` 中标准化输出。

#### Scenario: 内容管理员维护图片地点和原图摄影作者
- **WHEN** 内容管理员维护首页 Hero Slide
- **THEN** 系统 MUST 提供可选的图片地点字段
- **AND** 系统 MUST 提供可选的原图摄影作者字段
- **AND** 系统 MUST 提供可选的图片图注位置字段，至少支持自动位置和四个角落位置
- **AND** 系统 MUST NOT 要求内容管理员通过 Hero 主文案、Markdown、图片文件名或前端硬编码维护图注

#### Scenario: 首页聚合接口输出图片图注字段
- **WHEN** 前台请求 `GET /api/public/home`
- **THEN** 系统 MUST 在每个标准化 Hero Slide 中输出图片地点字段
- **AND** 系统 MUST 在每个标准化 Hero Slide 中输出原图摄影作者字段
- **AND** 系统 MUST 在每个标准化 Hero Slide 中输出图片图注位置字段
- **AND** 系统 MUST 在内容源缺少这些字段时输出可安全隐藏的空值

### Requirement: 首页 Hero 显示当前图片图注
首页 Hero SHALL 在当前 active slide 存在图片地点或原图摄影作者时，在 Hero 图片内部安全角落显示图注。图注 MUST 跟随当前 active slide 切换，并且 MUST 不改变 Hero 主标题、按钮、轮播机制或遮罩策略。

#### Scenario: 当前 slide 同时有地点和作者
- **WHEN** 访问者查看的当前 Hero slide 同时包含图片地点和原图摄影作者
- **THEN** 首页 Hero MUST 在图片内部安全角落显示图注
- **AND** 图注 MUST 使用“地点 · 原图摄影：作者”的格式

#### Scenario: 当前 slide 只有地点
- **WHEN** 访问者查看的当前 Hero slide 只有图片地点
- **THEN** 首页 Hero MUST 只显示该地点
- **AND** 图注 MUST NOT 显示多余分隔符或“原图摄影”标签

#### Scenario: 当前 slide 只有作者
- **WHEN** 访问者查看的当前 Hero slide 只有原图摄影作者
- **THEN** 首页 Hero MUST 使用“原图摄影：作者”的格式显示图注
- **AND** 图注 MUST NOT 显示多余分隔符

#### Scenario: 当前 slide 没有图注字段内容
- **WHEN** 访问者查看的当前 Hero slide 没有图片地点和原图摄影作者
- **THEN** 首页 Hero MUST 不显示图注区域
- **AND** 页面 MUST NOT 留下空白占位或孤立标点

#### Scenario: Hero 轮播切换图片
- **WHEN** 访问者点击轮播指示器或自动轮播切换到另一张 Hero slide
- **THEN** 首页 Hero MUST 更新为新 active slide 对应的图注
- **AND** 图注显示或隐藏 MUST 根据新 active slide 的字段内容决定

#### Scenario: 自动选择图注安全角落
- **WHEN** 当前 Hero slide 的图注位置为自动
- **THEN** 首页 Hero MUST 根据该 slide 的 Hero 主文案位置选择不同角落显示图注
- **AND** 图注 MUST NOT 与 Hero 主文案使用同一角落

#### Scenario: 显式图注位置与主文案冲突
- **WHEN** 当前 Hero slide 显式配置的图注位置与 Hero 主文案位于同一角落
- **THEN** 首页 Hero MUST 将图注切换到安全角落
- **AND** 图注 MUST NOT 与 Hero 主文案使用同一角落

### Requirement: 图片图注保持克制且不遮挡 Hero 内容
首页 Hero 图片图注 SHALL 作为图片说明显示在 Hero 图片内部角落。图注 MUST 在桌面和移动端视口下保持可读，并且 MUST 不遮挡 Hero 主文案、行动按钮、轮播指示器或后续首页内容。

#### Scenario: 桌面端查看图注
- **WHEN** 访问者在桌面视口查看带图注的首页 Hero
- **THEN** 图注 MUST 位于 Hero 图片内部角落
- **AND** 图注 MUST 使用低干扰视觉样式，不表现为按钮、标签或卡片入口

#### Scenario: 移动端查看图注
- **WHEN** 访问者在移动端视口查看带图注的首页 Hero
- **THEN** 图注 MUST 允许在可用宽度内自然换行
- **AND** 图注 MUST NOT 与 Hero 主文案、行动按钮、轮播指示器或下一段首页内容重叠
