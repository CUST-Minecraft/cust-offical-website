## 1. 文档与范围确认

- [x] 1.1 阅读 `docs/产品需求文档.md`、`docs/详细设计文档.md`、`docs/总体设计文档.md`、`docs/开发规范文档.md` 和 `strapi-models/模型说明.md` 中加入页、内容模型、公开接口和第一阶段边界相关内容
- [x] 1.2 确认 `/join` 页面仍只承担公开加入引导，不新增站内报名、白名单审核、登录、社员中心或申请人数据存储能力
- [x] 1.3 梳理现有 `JoinPageData`、`join-page` schema、`shared.process-step` schema、mock 数据和 Strapi 导入脚本的当前字段

## 2. 内容模型与类型

- [x] 2.1 扩展 `strapi-models/src/components/shared/process-step.json`，为流程步骤增加可选 `items`、`image`、`imageAlt`、`imageCaption`、`primaryActionLabel` 和 `primaryActionUrl` 字段
- [x] 2.2 更新 `frontend/types/content.ts`，新增或扩展加入流程步骤类型，支持结构化条目、图片、图片说明和可选动作入口
- [x] 2.3 更新 `frontend/server/utils/strapi.ts` 的 JoinPage 规范化逻辑，将流程步骤条目映射为字符串数组，并将步骤图片规范化为 `{ src, alt }`
- [x] 2.4 保持 `contactMethods`、`applicationUrl`、`introContent` 和 `serverJoinGuide` 的兼容读取，避免旧内容源导致页面崩溃

## 3. 页面改版

- [x] 3.1 重构 `frontend/pages/join/index.vue`，使页面主体只保留加入流程和常见问题
- [x] 3.2 在加入流程中展示每一步的标题、摘要、明细条目、可选图片、图片说明和可选动作按钮
- [x] 3.3 将参与身份、加入方式、规则说明、联系确认和开始参与作为流程步骤内容呈现
- [x] 3.4 保留页面头图、标题和摘要，但避免重新引入分散的独立宣传区块
- [x] 3.5 为移动端和桌面端补齐流程步骤布局样式，确保图片、文本、按钮和 FAQ 不重叠且可读

## 4. 内容数据与示例

- [x] 4.1 更新 `frontend/data/mock.ts` 的 `joinPage.processSteps`，补齐长期开放加入流程、结构化条目、图片和动作入口示例
- [x] 4.2 更新 `scripts/import-strapi-test-data.mjs` 的加入页测试数据，使导入内容覆盖增强后的流程步骤字段
- [x] 4.3 确认 FAQ 文案覆盖长期开放加入、新手加入、在线频率、白名单、隐私展示和进服问题
- [x] 4.4 确认示例内容不包含真实姓名、学号、手机号或真实私人联系方式

## 5. 文档同步

- [x] 5.1 更新 `docs/产品需求文档.md`，将加入我们页描述为长期开放加入的流程引导页，并保留第一阶段不做站内审核的边界
- [x] 5.2 更新 `docs/详细设计文档.md`，同步 `/join` 页面结构、`JoinPageData`、`ProcessStep` 字段、`GET /api/public/join` 输出和 SEO/错误处理说明
- [x] 5.3 更新 `strapi-models/模型说明.md`，说明增强后的 `ProcessStep` 字段和流程步骤媒体规范
- [x] 5.4 检查 docs 中关于 Markdown/richtext 与结构化字段边界的描述，确保流程步骤图片和动作入口归入结构化字段

## 6. 验证

- [x] 6.1 运行 TypeScript、lint 或项目现有静态检查，确认类型与页面模板无错误
- [x] 6.2 运行或手动请求 `GET /api/public/join`，确认返回结构包含增强后的 `processSteps` 且旧字段兼容
- [x] 6.3 在浏览器检查 `/join` 桌面端页面，确认只展示流程和 FAQ，流程步骤图片与动作入口正常
- [x] 6.4 在移动端视口检查 `/join`，确认文本、按钮、图片和 FAQ 不重叠、不溢出
- [x] 6.5 检查代码和内容中没有新增站内申请提交 API、登录依赖、白名单审核 API 或敏感个人信息展示
