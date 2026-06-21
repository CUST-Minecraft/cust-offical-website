## ADDED Requirements

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
