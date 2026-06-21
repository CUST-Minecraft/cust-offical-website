## MODIFIED Requirements

### Requirement: 维护页必须具备最小可用兜底内容
维护页 SHALL 在 Strapi 不可用时仍可展示最小可用内容。系统 MUST 提供内置站点名称、维护标题和维护说明兜底，不得要求维护页必须成功读取 Strapi 站点配置或维护页配置才能渲染。

#### Scenario: 维护页无法读取站点配置
- **WHEN** 系统需要展示维护页
- **AND** Strapi 站点配置不可用
- **THEN** 维护页 MUST 使用内置最小站点信息和维护文案渲染
- **AND** 页面 MUST 清楚说明官网内容服务暂时不可用

#### Scenario: 维护页无法读取维护页配置
- **WHEN** 系统需要展示维护页
- **AND** Strapi 维护页模型不可用
- **THEN** 维护页 MUST 使用内置维护标题、维护说明和空服务状态列表渲染
- **AND** 系统 MUST NOT 使用 mock 维护页数据冒充真实 CMS 配置

#### Scenario: 维护页 SEO
- **WHEN** 系统展示维护页
- **THEN** 维护页 MUST NOT 被长期索引
- **AND** 系统 MUST 遵循详细设计文档中维护页和 503 的 SEO 约束
