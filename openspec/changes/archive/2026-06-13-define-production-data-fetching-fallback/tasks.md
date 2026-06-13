## 1. 文档与现状确认

- [x] 1.1 阅读 `docs/总体设计文档.md`、`docs/详细设计文档.md`、`docs/开发规范文档.md` 中关于公开 API、CDN 缓存、维护态、mock 数据和生产配置的现有描述
- [x] 1.2 阅读 `frontend/server/utils/strapi.ts`、`frontend/server/utils/mock-fallback.ts`、`frontend/server/api/public/*` 和 `frontend/composables/use-api.ts`，确认当前数据获取与错误处理行为
- [x] 1.3 更新 `docs/总体设计文档.md`，明确第一阶段保留 CDN 作为主要缓存层，暂不引入 Redis 或服务端持久 last-known-good
- [x] 1.4 更新 `docs/详细设计文档.md`，明确 Strapi 不可用时返回维护态、内容不存在时返回 404、维护页必须具备最小兜底内容
- [x] 1.5 更新 `docs/开发规范文档.md`，明确 mock fallback 仅限开发或测试环境，生产公开接口不得返回 mock 数据

## 2. 服务端数据获取与错误语义

- [x] 2.1 调整 mock fallback 工具，使其根据环境区分开发/测试与生产行为
- [x] 2.2 在 Strapi 访问层或公开接口层区分 Strapi 连接失败、超时、无响应与正常空结果
- [x] 2.3 生产环境下 Strapi 不可用时返回 `MAINTENANCE`/503 语义，不返回 mock 数据
- [x] 2.4 保持 Strapi 正常响应但内容不存在、未发布或不可公开时返回 `NOT_FOUND`/404
- [x] 2.5 检查所有 `/api/public/*` 接口，确保首页、列表、详情、设置、维护页接口都遵循统一错误语义

## 3. 维护态与页面兜底

- [x] 3.1 为维护页和全局错误展示准备内置最小站点信息、维护标题和维护说明
- [x] 3.2 调整维护页数据获取逻辑，使 Strapi 站点配置不可用时仍能渲染最小维护内容
- [x] 3.3 调整 `use-api.ts` 或页面错误处理，使 `MAINTENANCE`/503 触发维护态展示，而不是误显示 404
- [x] 3.4 确认维护页不长期被索引，并保留合适的 SEO/meta 语义

## 4. CDN 与 HTTP 缓存

- [x] 4.1 为公开接口设置或整理 Cache-Control 策略，沿用首页/列表短缓存、详情中缓存、站点配置短缓存、维护态极短或不缓存的规则
- [x] 4.2 确认 Agent 状态接口不使用普通公开内容缓存策略
- [x] 4.3 确认本变更不新增 Redis、KV、服务端持久 last-known-good 或新的持久缓存数据库依赖

## 5. 验证

- [x] 5.1 在开发环境验证 Strapi 不可用时仍可按开发策略使用 mock fallback
- [x] 5.2 在生产环境配置下模拟 Strapi 不可用，验证公开接口返回维护态且不返回 mock 数据
- [x] 5.3 验证详情页在 Strapi 正常但 slug 不存在时返回 404
- [x] 5.4 验证维护页在 Strapi 不可用时仍能显示最小兜底内容
- [x] 5.5 运行项目可用的类型检查、lint 或构建命令，确认实现没有破坏现有 Nuxt 页面和 server routes
