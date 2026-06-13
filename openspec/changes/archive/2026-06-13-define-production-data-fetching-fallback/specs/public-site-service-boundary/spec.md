## ADDED Requirements

### Requirement: 生产公开接口不得用 mock 数据冒充真实内容
官网作为公开展示和内容聚合系统时，生产环境公开接口 SHALL 只返回真实已发布公开内容、缓存命中的公开内容或明确的错误/维护态。生产环境 MUST NOT 使用 mock 数据冒充 CMS 内容。

#### Scenario: 生产公开接口无法访问 CMS
- **WHEN** 生产环境 `/api/public/*` 接口无法访问 Strapi CMS
- **THEN** 系统 MUST NOT 返回 mock 当前内容、mock 首页、mock 公告、mock 活动、mock 动态或 mock 社员资料
- **AND** 系统 MUST 返回维护态或由 CDN 返回已有缓存

#### Scenario: 开发 mock 与生产内容边界
- **WHEN** 系统保留开发用 mock 数据
- **THEN** mock 数据 MUST 仅用于开发或测试环境
- **AND** 项目文档 MUST 明确 mock 数据不是生产公开内容来源
