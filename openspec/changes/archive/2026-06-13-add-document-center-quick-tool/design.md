## Context

当前官网右下角快捷工具由 `FloatingServiceStatus.vue` 承载，已包含“悦灵助手”和“社团服务状态”两个入口。站点配置通过 `GET /api/public/settings` 返回 `site`、`navigation` 和 `serviceStatus`，前端类型集中在 `frontend/types/content.ts`，Strapi 站点配置模型位于 `strapi-models/src/api/site-setting/content-types/site-setting/schema.json`。

文档中心已被确定为独立外部系统，不属于官网内部页面、下载服务、社员中心或 CMS 后台。官网只需要提供一个公开入口，并在 URL 未配置时以禁用态提示入口暂不可用。

## Goals / Non-Goals

**Goals:**

- 在快捷工具中新增“文档中心”按钮，并展示在“悦灵助手”上方。
- 使用站点配置维护文档中心外部 URL，前端通过现有 `/api/public/settings` 获取。
- 未配置 URL 时仍展示按钮，但按钮必须不可点击并呈现禁用态。
- 提供书架方块风格 SVG 图标，整体贴近 Minecraft 书架方块的木质顶面、书脊色块和立方体轮廓，同时保持原创。
- 将文档中心纳入全站搜索快捷结果，帮助访问者发现入口。
- 同步更新项目 docs 和 Strapi 模型说明。

**Non-Goals:**

- 不在官网内建设文档中心页面。
- 不新增文档内容模型、文档下载 API、文件分发页或文档搜索索引。
- 不引入官网登录、社员中心、角色权限或 `/api/member/*`。
- 不代理、不嵌入、不同步文档中心内容。
- 不监控文档中心真实可用性；服务状态仍由现有 `serviceStatus` 配置独立维护。

## Decisions

### 决策 1：使用 `SiteSettings.documentCenterUrl` 维护入口地址

文档中心是全站级外部入口，最接近现有 `skinConsoleUrl` 的配置性质，因此放入 `SiteSettings`。前端 `SiteInfo` 增加可选 `documentCenterUrl` 字段，`fetchSiteSettings()` 负责从 Strapi 字段规范化并返回给 `/api/public/settings`。

替代方案：把文档中心放入 `navigation`。这会让它出现在主导航里，不符合“位于快捷工具中”的产品决策。

替代方案：把文档中心放入 `serviceStatusServices`。该模型只有 `name` 和 `status`，职责是状态展示，不适合承载可点击外部入口。

### 决策 2：URL 未配置时展示禁用态而不是隐藏

用户已明确要求未配置 URL 时不隐藏入口。禁用态需要保留“文档中心”按钮和书架图标，但使用不可点击元素或 `disabled` 按钮，文案提示“未配置”或等价短文本，并通过 `aria-disabled` 或原生 `disabled` 传达状态。

替代方案：隐藏按钮。该方案会降低入口可发现性，并与需求冲突。

### 决策 3：快捷工具顺序固定为文档中心、悦灵助手、社团服务状态

文档中心作为查阅资料入口，应在展开的快捷工具列表中位于悦灵助手上方。快捷工具计数需要从固定 `2` 调整为根据展示项计算，避免未配置 URL 时数量与实际按钮不一致；由于禁用态仍展示，文档中心计入入口数量。

### 决策 4：图标使用项目内静态 SVG

新增 SVG 放在 `frontend/public/example-assets/` 或同类静态资源目录，命名为 `bookshelf-docs.svg`。图标以 32x32 viewBox 制作，使用硬边矩形或像素块轮廓，风格参考现有 `service-redstone-lamp.svg` 的尺寸和像素化处理。

图标设计原则：

- 书架方块，保留木质顶面、正面书脊和侧面暗部。
- 主体为暖棕木纹，书脊使用红、蓝、绿、黄等小色块。
- 外轮廓使用深色像素描边，顶面和层板用浅棕高光区分。
- 不使用大面积魔法光效。
- 不出现文字、文档页、文件夹或现代应用图标背景。

### 决策 5：文档中心进入搜索快捷结果，但不纳入服务状态列表

搜索浮层当前包含导航、皮肤站、服务状态和公开内容。文档中心作为全站快捷入口，应增加一条搜索结果；配置 URL 时点击外链，未配置时搜索结果可不展示或展示禁用信息。实现时应避免把文档中心写入 `serviceStatus.services`，防止“状态项”和“入口项”混用。

## Risks / Trade-offs

- [Risk] 文档中心被误解为官网内置文档服务或下载服务。→ 在 spec、docs 和 UI 文案中明确它是外部系统入口，官网不托管、不代理、不分发文件。
- [Risk] 新增 `documentCenterUrl` 后生产 Strapi 未配置导致入口不可用。→ 默认空值，前端展示禁用态，不影响其他公开页面。
- [Risk] 快捷工具宽度不足导致“文档中心”与“未配置”文案溢出。→ 复用现有按钮尺寸并检查移动端样式，必要时使用短副标题。
- [Risk] 书架图标在小尺寸下过于复杂。→ 采用 32x32 SVG、硬边像素块、深色描边、简化层板和高对比书脊色块，并在实现后进行视觉检查。
