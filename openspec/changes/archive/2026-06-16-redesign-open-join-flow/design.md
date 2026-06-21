## Context

`/join` 当前通过 `GET /api/public/join` 读取 `join-page` single type，并在前台展示加入说明、加入条件、流程步骤、联系方式、服务器加入说明和 FAQ。该结构能覆盖基础信息，但页面叙事较分散，不适合“长期开放加入”的入口定位。

项目已有边界要求：官网不提供账号注册、登录、站内报名审核、白名单审核或资源分发；第一阶段加入方式通过 QQ 群、外部问卷或社团联系人完成。内容模型应通过 Strapi 管理，前台只访问 Nuxt BFF 的 `/api/public/*`，媒体字段规范化为 `{ src, alt }`。

本设计需要同步更新 `docs/产品需求文档.md`、`docs/详细设计文档.md` 和 `strapi-models/模型说明.md`，尤其是加入我们页的数据结构、页面目标和 `ProcessStep` 组件说明。

## Goals / Non-Goals

**Goals:**

- 将 `/join` 页面重构为“加入流程 + 常见问题”的流程引导体验。
- 让流程步骤承载“以什么身份加入”“加入方式”“规则说明”“联系确认”“开始参与”等内容。
- 扩展 `ProcessStep`，支持结构化图片、图片说明、明细条目和可选动作入口。
- 保持 `JoinPage` 由 Strapi 维护，并通过 Nuxt BFF 输出稳定前台数据。
- 继续遵守公开隐私边界，不展示真实姓名、学号、手机号等敏感信息。

**Non-Goals:**

- 不实现站内报名表、申请人数据库、白名单自动审核或审核后台。
- 不新增官网登录、社员中心、角色权限或会话体系。
- 不在官网公开资源包、整合包、地图或服务器敏感准入信息下载入口。
- 不把流程页做成可由 Markdown 任意拼装布局的页面编辑器。

## Decisions

### 1. 使用现有 `join-page`，增强 `ProcessStep`

继续使用 `join-page` single type 作为加入页唯一内容来源。将页面主结构收敛到 `processSteps` 和 `faqItems`，同时保留 `title`、`summary`、`coverImage`、`introContent`、`contactMethods` 和 `applicationUrl` 作为页面基础与兼容字段。

`shared.process-step` 从 `title + summary` 扩展为：

- `title`: 步骤标题。
- `summary`: 步骤摘要，普通文本。
- `items`: 可重复短文本条目，用于身份、方式、规则点或新手动作。
- `image`: 可选单图媒体字段。
- `imageAlt`: 可选图片替代文本；未配置时使用媒体 `alternativeText` 或 `caption`。
- `imageCaption`: 可选图片说明。
- `primaryActionLabel`: 可选主动作文案。
- `primaryActionUrl`: 可选主动作链接。

备选方案是新增 `join-process-step` 专属组件。暂不采用，因为现有通用 `ProcessStep` 已被详细设计文档列为通用组件，增强它可以减少前后台适配面，并保留未来复用空间。

### 2. 图片使用结构化字段，不放进 Markdown

流程步骤图片 MUST 使用结构化媒体字段，而不是要求内容管理员在正文中插入 Markdown 图片。这样前端可以统一控制移动端比例、懒加载、alt、caption 和像素风裁切效果。

备选方案是在 `summary` 或 `introContent` 中允许 Markdown 图片。暂不采用，因为流程页需要稳定布局，Markdown 插图会削弱响应式和内容维护可控性。

### 3. 页面只保留流程主线和 FAQ

前台 `/join` 只展示：

1. 页面头部。
2. 加入流程。
3. 常见问题。
4. 流程步骤内的动作入口或联系方式提示。

原本独立的加入条件、参与方向、联系方式和服务器加入说明会进入流程步骤内容。前端可继续从 `contactMethods` 和 `applicationUrl` 读取数据，但展示位置应成为流程步骤的行动内容，而不是独立联系方式区。

### 4. BFF 输出前台友好的步骤结构

`GET /api/public/join` 返回的 `processSteps` 应包含规范化后的图片对象和结构化条目。推荐前台类型：

```ts
interface JoinProcessStep {
  title: string
  summary: string
  items: string[]
  image?: ImageRef
  imageCaption?: string
  primaryActionLabel?: string
  primaryActionUrl?: string
}
```

Nuxt BFF 负责裁剪 Strapi 原始结构，前台页面不直接依赖 Strapi 媒体格式。

## Risks / Trade-offs

- [增强通用 `ProcessStep` 可能影响其它页面复用] → 实现时检查 `process-step` 当前使用范围；新增字段保持可选，现有页面不读取时不受影响。
- [旧 Strapi 内容缺少图片和条目导致页面单薄] → 前端为 `items`、`image` 和动作字段提供空值兼容，mock 数据和导入脚本补齐示例内容。
- [流程步骤承载过多内容导致单步过重] → 建议默认 5 个步骤，每步条目控制在 3 到 6 条，详细说明放入 FAQ。
- [外部申请入口被误解为站内审核] → 文案和文档明确官网只展示外部入口，不保存申请人隐私数据。

## Migration Plan

1. 扩展 `strapi-models/src/components/shared/process-step.json` 的可选字段。
2. 更新前端 `JoinPageData` 和流程步骤类型。
3. 更新 Strapi 适配逻辑，将步骤图片规范化为 `{ src, alt }`，将条目映射为字符串数组。
4. 更新 `/join` 页面模板，只渲染流程和 FAQ。
5. 更新 mock 数据和 Strapi 测试数据导入脚本。
6. 同步更新 docs 和 Strapi 模型说明。

回滚时可保留新增可选字段，仅恢复 `/join` 页面旧布局；由于新增字段为可选，旧数据结构兼容风险较低。

## Open Questions

- 申请主入口最终以 QQ 群、外部问卷还是二者并列为准。
- 是否需要在流程步骤中公开展示服务器版本和白名单说明，还是仅说明“群内同步”。
