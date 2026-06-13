## 1. 文档与范围确认

- [x] 1.1 阅读 `docs/产品需求文档.md`、`docs/总体设计文档.md`、`docs/详细设计文档.md` 和 `openspec/specs/public-site-service-boundary/spec.md`，确认文档中心仍属于公开外部服务入口。
- [x] 1.2 更新 `docs/产品需求文档.md`，补充文档中心作为快捷工具外部入口的产品范围，并明确不属于官网内置文档托管、下载分发或社员中心能力。
- [x] 1.3 更新 `docs/总体设计文档.md`，在架构和当前配置状态中加入文档中心外部系统与 `documentCenterUrl` 配置。
- [x] 1.4 更新 `docs/详细设计文档.md`，记录快捷工具顺序、禁用态、搜索入口、`SiteSettings.documentCenterUrl` 字段和外部服务边界。
- [x] 1.5 更新 `strapi-models/README.md` 和 `strapi-models/模型说明.md`，说明 `site-setting` 新增文档中心 URL 配置。

## 2. 站点配置与数据契约

- [x] 2.1 在 `strapi-models/src/api/site-setting/content-types/site-setting/schema.json` 中新增可选 `documentCenterUrl` 字段。
- [x] 2.2 在 `frontend/types/content.ts` 的 `SiteInfo` 中新增可选 `documentCenterUrl` 字段。
- [x] 2.3 更新 `frontend/server/utils/strapi.ts`，从 Strapi 站点配置读取并规范化 `documentCenterUrl`。
- [x] 2.4 更新 `frontend/data/mock.ts`，提供开发用文档中心 URL 示例，并确保空值场景可被前端禁用态处理。
- [x] 2.5 更新 `scripts/import-strapi-test-data.mjs`，为测试数据写入文档中心 URL。

## 3. 快捷工具入口与图标

- [x] 3.1 新增 `frontend/public/example-assets/bookshelf-docs.svg`，使用 32x32 书架方块风格像素 SVG，贴近 Minecraft 书架方块轮廓但保持原创。
- [x] 3.2 更新 `frontend/components/FloatingServiceStatus.vue`，在悦灵助手上方增加“文档中心”独立按钮。
- [x] 3.3 实现已配置 URL 时的新标签页外部跳转，并使用 `rel="noopener noreferrer"`。
- [x] 3.4 实现未配置 URL 时的禁用态，按钮仍展示但不可跳转，并显示“未配置”或等价短副标题。
- [x] 3.5 更新快捷工具入口数量计算，确保文档中心计入数量且与实际展示一致。
- [x] 3.6 更新 `frontend/assets/css/main.css`，为文档中心按钮、图标和禁用态补充样式，并检查桌面端与移动端尺寸。

## 4. 搜索入口与边界保护

- [x] 4.1 更新 `frontend/components/SiteSearchOverlay.vue`，增加“文档中心”搜索快捷结果和关键词。
- [x] 4.2 确保文档中心 URL 已配置时，搜索结果打开外部文档中心 URL。
- [x] 4.3 确保文档中心 URL 未配置时，搜索结果不跳转到空 URL、当前页面、`/member` 或占位路由。
- [x] 4.4 检查实现未新增官网登录、社员中心、`/api/member/*`、文档代理接口、文档内容模型或下载分发能力。

## 5. 验证

- [x] 5.1 运行前端类型检查或项目现有验证命令，确认类型与构建不因 `documentCenterUrl` 变更失败。
- [x] 5.2 启动本地前端并检查快捷工具展开后顺序为“文档中心 / 悦灵助手 / 社团服务状态”。
- [x] 5.3 分别验证配置 URL 和未配置 URL 两种状态下的文档中心按钮行为。
- [x] 5.4 验证搜索浮层可以发现文档中心，并在未配置 URL 时不会错误跳转。
- [x] 5.5 进行视觉检查，确认书架图标在桌面端和移动端快捷工具中清晰、不过度偏离 Minecraft 书架方块风格，并与悦灵助手和服务状态图标协调。
