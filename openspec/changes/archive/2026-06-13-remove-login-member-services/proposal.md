## Why

当前官网中的登录页、社员中心、mock 账号和角色化服务入口没有真实认证体系支撑，容易让访问者误以为官网已经提供账号注册、登录、权限和下载服务。皮肤站、CMS 和 QQ 群已经分别承担账号、内容管理和文件分发能力，继续在官网维护一套中间登录层会增加复杂度并制造重复入口。

## What Changes

- **BREAKING** 移除官网内的登录功能入口，包括 `/login` 页面以及指向登录页的内部导航。
- 将 Header 原登录按钮位置改为“皮肤站”外部跳转按钮，继续使用现有地狱门图标，点击后直接跳转到配置的皮肤站网址。
- **BREAKING** 移除登录后的社员服务层，包括 `/member` 社员中心、`/member/skin` 皮肤站跳转页、`/member/admin` 内容后台跳转页和相关 mock 角色判断。
- **BREAKING** 移除 `/api/member/*` mock 接口、社员服务类型、mock 当前账号和社员服务数据。
- 将皮肤站定位为独立外部系统。官网通过 Header 皮肤站按钮提供公开外链入口，不再要求官网登录态或角色校验。
- 将 CMS 定位为管理员直接访问的独立后台，不再通过官网登录后跳转。
- 将下载服务从官网范围中移除，资源包、整合包、地图和文件分发改由 QQ 群等社群渠道完成。
- 同步更新 `docs/产品需求文档.md`、`docs/总体设计文档.md`、`docs/详细设计文档.md`、`docs/自研后台设计文档.md` 和 Strapi 模型说明中关于登录、社员中心、资源下载和 `/api/member/*` 的描述。

## Capabilities

### New Capabilities
- `public-site-service-boundary`: 定义官网只承担公开展示、公开内容聚合和外部服务引导，不提供登录、社员权限服务或资源下载分发。

### Modified Capabilities

无。当前仓库没有既有 OpenSpec capability；本次以新增规格记录新的产品边界。

## Impact

- 前端页面：删除 `frontend/pages/login/index.vue`、`frontend/pages/member/index.vue`、`frontend/pages/member/skin.vue`、`frontend/pages/member/admin.vue`。
- 前端组件与搜索：将 `AppHeader` 登录按钮改为皮肤站外链按钮，复用现有地狱门图标；清理全站搜索中指向 `/member/skin` 的皮肤站快捷项并改为外部链接策略或移除。
- 服务端接口：删除 `frontend/server/api/member/*` mock 接口和对应 composables。
- 类型与 mock 数据：清理 `MemberAccount`、`MemberService`、`currentMember`、`memberServices` 等仅服务登录社员层的定义。
- 内容模型：评估并移除 Strapi `resource` 预留模型及 tag 关联，避免 CMS 暗示官网提供下载服务。
- 文档：同步删除或改写登录、社员中心、角色权限跳转、资源下载页、`/api/member/*`、皮肤站受权限保护跳转等已过时内容。
- 外部系统：皮肤站和 CMS 保持独立；下载服务转移到 QQ 群，不通过官网实现。
