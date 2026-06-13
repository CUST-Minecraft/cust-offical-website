## 1. 文档边界同步

- [x] 1.1 阅读 `docs/产品需求文档.md`、`docs/总体设计文档.md`、`docs/详细设计文档.md`、`docs/自研后台设计文档.md` 和 Strapi 模型说明，标记登录、社员中心、`/api/member/*`、皮肤站受权限保护跳转、内容后台入口和资源下载相关内容
- [x] 1.2 更新 `docs/产品需求文档.md`，移除社员登录、社员中心、官网下载服务和登录后跳转皮肤站/CMS 的产品范围，并记录 Header 提供皮肤站公开外链入口
- [x] 1.3 更新 `docs/总体设计文档.md`，移除社员 API 层、`/api/member/*` 接口清单、架构图中的官网登录社员服务链路和 mock 登录状态说明，并将皮肤站描述为 Header 公开外链
- [x] 1.4 更新 `docs/详细设计文档.md`，删除或改写登录页、社员中心、皮肤站跳转页、后台入口页、资源下载页、权限矩阵和相关缓存/SEO/安全规则，并补充 Header 皮肤站按钮行为
- [x] 1.5 更新 `docs/自研后台设计文档.md`、`strapi-models/README.md` 和 `strapi-models/模型说明.md`，确保资源下载模型和官网社员权限层不再被描述为当前范围

## 2. 前端页面与导航清理

- [x] 2.1 删除 `frontend/pages/login/index.vue`、`frontend/pages/member/index.vue`、`frontend/pages/member/skin.vue` 和 `frontend/pages/member/admin.vue`
- [x] 2.2 将 `frontend/components/AppHeader.vue` 中原登录按钮改为“皮肤站”外链按钮，复用现有地狱门图标，并从站点配置读取皮肤站网址
- [x] 2.3 确保 Header 皮肤站按钮点击后直接跳转到配置网址，不访问 `/login`、`/member` 或 `/member/skin`
- [x] 2.4 清理 `frontend/components/SiteSearchOverlay.vue` 中指向 `/member/skin`、社员中心或资源下载站的快捷项；如保留皮肤站搜索项，改为外部链接策略
- [x] 2.5 清理 `frontend/assets/css/main.css` 中仅服务登录语义和已删除社员页面的样式，保留 Header 皮肤站按钮可复用的按钮样式以及仍被错误页、维护页使用的 `.login-page` 和 `.login-panel` 状态页样式
- [x] 2.6 全文检查前端页面和组件，移除所有指向 `/login`、`/member`、`/member/skin`、`/member/admin` 的内部链接

## 3. API、类型与 mock 数据清理

- [x] 3.1 删除 `frontend/server/api/member/me.get.ts`、`frontend/server/api/member/services.get.ts`、`frontend/server/api/member/skin-entry.get.ts` 和 `frontend/server/api/member/admin-entry.get.ts`
- [x] 3.2 删除 `frontend/composables/use-api.ts` 中的 `useMemberMe` 和 `useMemberServices`
- [x] 3.3 删除 `frontend/types/content.ts` 中仅服务登录社员层的 `MemberAccount`、`MemberService` 和角色类型
- [x] 3.4 删除 `frontend/data/mock.ts` 中的 `currentMember`、`memberServices` 和资源下载站服务状态 mock；保留或校正 Header 皮肤站按钮需要的 `skinConsoleUrl`
- [x] 3.5 更新 `frontend/server/utils/strapi.ts` 和相关类型适配，保留公开皮肤站外链需要的字段，移除不再需要向公开前端返回的后台入口字段

## 4. Strapi 资源下载模型清理

- [x] 4.1 删除 `strapi-models/src/api/resource/` 下的 resource content-type、controller、route 和 service
- [x] 4.2 更新 `strapi-models/src/api/tag/content-types/tag/schema.json`，移除 tag 到 resource 的关系字段
- [x] 4.3 检查脚本和测试数据导入逻辑，移除 resource 模型或资源下载字段引用

## 5. 验证

- [x] 5.1 运行全文检索确认代码中不再存在有效的 `/login`、`/member`、`/api/member`、`MemberAccount`、`MemberService`、`currentMember` 或 `memberServices` 引用
- [x] 5.2 运行全文检索确认 docs 中不再把登录、社员中心、角色权限跳转或资源下载页描述为当前系统能力
- [x] 5.3 运行前端类型检查和构建，确认删除页面、接口、类型和模型后无 TypeScript 或 Nuxt 路由引用错误
- [x] 5.4 手动检查 Header “皮肤站”按钮显示地狱门图标，点击后直接跳转到配置的皮肤站网址
- [x] 5.5 手动检查公开站点核心页面：首页、社团介绍、活动、公告、动态、公开社员介绍、加入我们、维护页、错误页、搜索和服务状态仍可访问
