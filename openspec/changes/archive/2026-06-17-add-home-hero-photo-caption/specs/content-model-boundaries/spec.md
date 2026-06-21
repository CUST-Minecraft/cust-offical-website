## ADDED Requirements

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
