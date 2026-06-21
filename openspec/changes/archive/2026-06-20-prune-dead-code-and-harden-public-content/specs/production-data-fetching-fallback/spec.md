## ADDED Requirements

### Requirement: 维护模式开启时公开内容接口必须进入维护态
当维护页模型中的维护模式开启时，Nuxt BFF 的公开内容接口 SHALL 返回 `MAINTENANCE`/503 语义。系统 MUST NOT 在维护模式下继续返回首页、社团介绍、活动、公告、动态、成员或加入页的公开内容。

#### Scenario: 首页内容接口遇到维护模式
- **WHEN** 管理员在维护页模型中开启维护模式
- **AND** 访问者请求 `GET /api/public/home`
- **THEN** 系统 MUST 返回 `MAINTENANCE`/503 语义
- **AND** 系统 MUST NOT 返回首页聚合内容

#### Scenario: 列表或详情内容接口遇到维护模式
- **WHEN** 管理员在维护页模型中开启维护模式
- **AND** 访问者请求活动、公告、动态、成员或加入页公开内容接口
- **THEN** 系统 MUST 返回 `MAINTENANCE`/503 语义
- **AND** 系统 MUST NOT 返回真实内容、mock 内容或示例内容

#### Scenario: 维护态展示所需接口仍可读取
- **WHEN** 管理员在维护页模型中开启维护模式
- **AND** 前台需要渲染维护页、站点基础信息、外部服务入口或服务状态
- **THEN** 系统 MUST 允许维护页、站点设置、外部服务和服务状态相关公开接口继续返回展示所需数据
- **AND** 系统 MUST 在内容源不可用时使用既有最小维护兜底语义
