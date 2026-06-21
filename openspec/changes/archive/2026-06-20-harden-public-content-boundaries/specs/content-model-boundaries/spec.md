## ADDED Requirements

### Requirement: HomePage 精选关系优先驱动首页聚合
首页聚合 SHALL 将 `home-page` 模型中的精选关系作为首页活动、公告、动态、社员和图库区块的优先数据来源。当前台请求 `GET /api/public/home` 时，Nuxt BFF MUST 优先读取并标准化 HomePage 的 `featuredActivities`、`featuredAnnouncements`、`featuredPosts`、`featuredMembers` 和 `galleryItems`；当某个关系为空时，系统 MUST 回退到该内容类型既有自动推荐或排序查询。

#### Scenario: HomePage 配置了精选活动
- **WHEN** 内容管理员在 HomePage 中配置了 `featuredActivities`
- **THEN** `GET /api/public/home` 返回的首页活动列表 MUST 优先使用这些精选活动
- **AND** 系统 MUST 将活动媒体和字段标准化为前台稳定结构

#### Scenario: HomePage 未配置精选活动
- **WHEN** HomePage 的 `featuredActivities` 为空
- **THEN** `GET /api/public/home` MUST 回退到既有活动推荐查询
- **AND** 若回退查询也为空，系统 MUST 返回真实空数组

#### Scenario: HomePage 配置了精选公告、动态、社员或图库
- **WHEN** 内容管理员在 HomePage 中配置了 `featuredAnnouncements`、`featuredPosts`、`featuredMembers` 或 `galleryItems`
- **THEN** `GET /api/public/home` 对应区块 MUST 优先使用 HomePage 关系数据
- **AND** 系统 MUST 保持各内容类型的公开字段标准化、媒体 `{ src, alt }` 标准化和排序稳定

#### Scenario: HomePage 精选关系为空
- **WHEN** HomePage 的某个精选关系为空
- **THEN** 系统 MUST 对该区块使用既有自动推荐或排序回退
- **AND** 系统 MUST NOT 使用 `frontend/data/mock.ts` 注入示例内容冒充真实 CMS 内容

#### Scenario: 首页精选关系保持公开内容边界
- **WHEN** 系统通过 HomePage 精选关系聚合首页内容
- **THEN** 前台页面 MUST 继续通过 Nuxt BFF 的 `/api/public/home` 获取标准化数据
- **AND** 前台页面 MUST NOT 直接请求 Strapi 原始 API
- **AND** 系统 MUST NOT 因精选关系引入新的公开登录、权限、下载或自研后台能力
