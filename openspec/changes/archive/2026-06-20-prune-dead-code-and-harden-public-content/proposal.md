## Why

代码审查报告指出了公开内容边界、CMS 字段归一化、富文本链接渲染和前端冗余代码中的若干可改进点。现有 `docs/总体设计文档.md`、`docs/详细设计文档.md` 和 `docs/开发规范文档.md` 已明确要求生产公开接口使用维护态而非 mock 内容、公开数据由 Nuxt BFF 标准化输出、富文本需要可信渲染，因此本变更用于把这些约束落实得更一致。

## What Changes

- 在公开内容接口读取 CMS 内容前统一检查维护模式；维护模式开启时返回 `MAINTENANCE`/503，而不是继续返回首页、活动、公告、动态、成员或加入页内容。
- 保持维护页、站点设置、外部服务和服务状态类接口可用于维护态展示，不把它们纳入内容阻断。
- 修正活动字段标准化，确保 `endTime`、`location`、`signupUrl` 等可选字段按字符串处理，避免对象或非字符串值泄漏到公开响应。
- 对页脚/外部服务图标白名单补齐现有公开服务所需的 `agent` 图标，避免 CMS 已配置服务在前台被错误降级。
- 加固富文本链接渲染，只允许安全的 `http`/`https` 链接，并保持链接文本和 href 转义。
- 清理重复日期格式化逻辑、重复 CMS populate 迁移错误判断、未使用 refs/props、失效 mock 导出等死代码和冗余代码。
- 不处理审查报告中不成立或不作为缺陷成立的部分，例如公告 `featuredOnly` 参数、成员精选去重逻辑、列表加载失败一律改为空状态等。

## Capabilities

### New Capabilities
- `frontend-code-hygiene`: 约束前端公开站点代码中的重复实现、未使用代码和安全敏感渲染辅助逻辑应保持集中、可验证和无死代码。

### Modified Capabilities
- `production-data-fetching-fallback`: 明确管理员主动开启维护模式时，公开内容接口也必须进入维护态；同时继续区分维护态接口自身的最小兜底职责。
- `content-model-boundaries`: 明确 Nuxt BFF 对 Activity 可选字段和外部服务图标等 CMS 输出进行稳定归一化，不向前台暴露不符合公开契约的原始值。
- `public-site-service-boundary`: 明确页脚外联和公开服务入口使用外部服务模型配置时，前台图标映射不得导致已配置公开入口不可识别或错误降级。

## Impact

- 影响 Nuxt Server Routes 的 `/api/public/*` 内容接口、Strapi 适配层、富文本渲染组件、日期格式化工具和部分展示组件。
- 不新增运行时依赖，不引入 Redis、KV 或服务端持久缓存。
- 不改变公开 URL、Strapi content-type 或前台页面范围；如实现改变 docs 已明确的维护态、安全渲染或公开输出细节，应同步检查 `docs/详细设计文档.md`、`docs/总体设计文档.md` 和 `docs/开发规范文档.md` 是否需要补充说明。
