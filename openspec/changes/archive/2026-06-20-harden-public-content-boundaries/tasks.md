## 1. 文档与现状确认

- [x] 1.1 阅读 `docs/详细设计文档.md` 中公开接口、分页参数、错误码、首页模型和首页实现约束章节，确认需要同步更新的位置。
- [x] 1.2 阅读 `docs/开发规范文档.md` 中列表状态、详情 404、mock fallback 和生产公开内容边界要求，确认实现不得与规范冲突。
- [x] 1.3 对照 `openspec/specs/production-data-fetching-fallback`、`openspec/specs/home-content-fallbacks`、`openspec/specs/content-model-boundaries` 和本变更 delta specs，确认本次不处理 `docker-compose.strapi.yml` 默认 secret 问题。

## 2. 公开列表查询参数边界

- [x] 2.1 在 server utility 中新增或扩展分页参数归一化 helper，统一处理默认值、非数字、小数、负数、0 和 `pageSize` 上限。
- [x] 2.2 更新 `frontend/server/api/public/activities/index.get.ts` 使用归一化后的 `page`、`pageSize`。
- [x] 2.3 更新 `frontend/server/api/public/announcements/index.get.ts` 使用归一化后的 `page`、`pageSize`。
- [x] 2.4 更新 `frontend/server/api/public/posts/index.get.ts` 使用归一化后的 `page`、`pageSize`。
- [x] 2.5 更新 mock `paginate()` 或其调用路径，确保 mock fallback 的 meta 不会输出 `NaN`、负数、小数或过大 `pageSize`。

## 3. 内容不存在与内容源不可用语义

- [x] 3.1 收窄 `frontend/server/utils/mock-fallback.ts` 的 `isStrapiUnavailable()`，移除普通 404 作为全局 unavailable 条件。
- [x] 3.2 确认活动、公告、动态详情接口在 Strapi 正常返回空结果时仍返回 `NOT_FOUND`/404。
- [x] 3.3 确认 Strapi 连接失败、超时、DNS 失败、连接重置、502、503 和 504 仍在生产环境返回维护态语义，在非生产环境可走开发 mock fallback。
- [x] 3.4 检查维护页接口仍能在 Strapi 不可用时返回内置最小维护内容。

## 4. 公开数据 composable 错误处理

- [x] 4.1 保留并确认 `usePublicAsyncData()` 集中 throw 的错误处理模型。
- [x] 4.2 清理活动详情页中 `await useActivityDetail()` 后不可达或重复的 `error.value` 检查。
- [x] 4.3 清理公告详情页中 `await useAnnouncementDetail()` 后不可达或重复的 `error.value` 检查。
- [x] 4.4 清理动态详情页中 `await usePostDetail()` 后不可达或重复的 `error.value` 检查。
- [x] 4.5 确认清理后详情页仍保留稳定 SEO fallback 文案，不新增页面级错误语义漂移。

## 5. HomePage 精选关系聚合

- [x] 5.1 扩展 `homePopulateQuery()`，读取 `featuredActivities`、`featuredAnnouncements`、`featuredPosts`、`featuredMembers` 和 `galleryItems` 及各自需要的媒体/标签字段。
- [x] 5.2 在 `frontend/server/utils/strapi.ts` 中复用现有 normalize 函数标准化 HomePage 精选关系数据。
- [x] 5.3 实现首页区块数据选择规则：精选关系非空时优先使用，关系为空时回退到既有自动推荐或排序查询。
- [x] 5.4 确认精选关系和回退查询都为空时继续返回真实空数组，并由现有首页空态和默认视觉图处理。
- [x] 5.5 确认 HomePage 精选关系不会让前台直接请求 Strapi 原始 API，也不会新增登录、权限、下载或自研后台能力。

## 6. 文档同步与验证

- [x] 6.1 更新 `docs/详细设计文档.md` 的公开分页参数规则，说明非法值回退和 `pageSize` 上限。
- [x] 6.2 更新 `docs/详细设计文档.md` 的错误语义说明，明确 404 内容不存在与 503 内容源不可用的边界。
- [x] 6.3 更新 `docs/详细设计文档.md` 的首页聚合策略，说明 HomePage 精选关系优先、缺省自动回退、真实空内容保留空数组。
- [x] 6.4 如实现细节影响开发规范表述，更新 `docs/开发规范文档.md` 中 mock fallback 或错误处理相关段落。
- [x] 6.5 运行 `npm run typecheck` 或等价 Nuxt/Vue TypeScript 检查。
- [x] 6.6 用异常 query 样例验证列表接口不会产生 `NaN` meta，包括 `?page=abc`、`?pageSize=-1` 和超大 `pageSize`。
- [x] 6.7 验证详情页 slug 不存在返回 404，Strapi 不可用场景返回维护态或非生产 mock fallback。
- [x] 6.8 验证首页在 HomePage 精选关系存在、关系为空、自动回退为空三种情况下均符合 specs。
