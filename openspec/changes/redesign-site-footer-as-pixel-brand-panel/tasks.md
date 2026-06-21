## 1. 文档与模型确认

- [x] 1.1 阅读 `docs/产品需求文档.md`、`docs/总体设计文档.md`、`docs/详细设计文档.md` 中关于页脚、站点配置、皮肤站、文档中心和外部服务边界的现有描述。
- [x] 1.2 阅读 `strapi-models/README.md`、`strapi-models/模型说明.md` 和 `strapi-models/src/api/site-setting/content-types/site-setting/schema.json`，确认 `SiteSettings` 当前字段和组件组织方式。
- [x] 1.3 更新产品和设计文档，描述新版像素风品牌页尾、“外联 / 关于我们”栏目、MUA 官网公开外链和结构化页尾链接模型。
- [x] 1.4 更新 Strapi 模型说明，明确新版页尾使用 `footerExternalLinks` / `footerAboutLinks`，`socials` 不再作为页尾链接渲染来源。

## 2. 数据模型与公开接口

- [x] 2.1 在前端类型中新增 `FooterLink`，并在 `SiteInfo` 中增加 `footerExternalLinks` 和 `footerAboutLinks`。
- [x] 2.2 在 Strapi 模型中新增页尾链接 component 或等价结构，并把它挂到 `SiteSettings` 的外联和关于我们字段。
- [x] 2.3 更新 `frontend/server/utils/strapi.ts`，将 Strapi 站点配置适配为结构化页尾链接，并处理缺省值和禁用态。
- [x] 2.4 更新 mock 站点数据，配置“MUA 官网”外联项以及社团介绍、社团活动、加入我们等关于我们站内入口。
- [x] 2.5 检查 `GET /api/public/settings` 返回数据，确认 `site.footerExternalLinks` 和 `site.footerAboutLinks` 可被前端消费。

## 3. 页尾组件与视觉实现

- [x] 3.1 重构 `frontend/components/SiteFooter.vue`，渲染品牌区、官网图标入口、“外联”和“关于我们”两栏以及底部版权/署名区域。
- [x] 3.2 为页尾链接实现站内 `NuxtLink`、外部 `<a target="_blank" rel="noopener noreferrer">` 和禁用态行为。
- [x] 3.3 建立页尾 icon key 到官网像素图标资源的映射，确保 MUA 或通用外链入口使用本站图标体系。
- [x] 3.4 更新 `frontend/assets/css/main.css` 中页尾样式，使用现有深板岩、石质、草方块高亮和像素边框视觉 token。
- [ ] 3.5 完成桌面端和移动端响应式布局，确保页尾链接文字、图标和版权信息不重叠、不横向溢出。

## 4. 验证与回归

- [x] 4.1 运行前端类型检查或构建命令，确认新增类型、Strapi 适配和组件引用无错误。
- [ ] 4.2 在本地页面检查桌面端页尾，确认只展示“外联”和“关于我们”两个栏目，并且外联栏包含“MUA 官网”。
- [ ] 4.3 在移动端视口检查页尾，确认品牌区、图标入口、链接栏目和版权信息可读可点按。
- [ ] 4.4 检查社团服务悬浮触发器滚动到页尾时仍高于页尾内容，不遮挡 MUA 官网、关于我们链接、版权或署名。
- [x] 4.5 检查外部链接不会触发官网登录、代理、嵌入或站内中转，且禁用态链接不可跳转。
