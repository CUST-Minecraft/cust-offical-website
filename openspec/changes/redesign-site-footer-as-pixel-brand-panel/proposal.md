## Why

当前页尾只展示简单社交文字、版权和署名，无法承载官网品牌识别、正式外联入口和“关于我们”站内入口。用户希望参考燕山大学 Minecraft 社团官网页尾结构，但保持长春理工大学 Minecraft 社团官网现有 Minecraft 像素风与官方整体设计风格，并且外联入口需要从站点配置中可维护。

## What Changes

- 将全站页尾升级为像素风品牌面板：左侧展示官网 Logo、社团中英文名称和官网图标入口，右侧只展示“外联”和“关于我们”两个栏目。
- 扩展站点配置数据模型，新增结构化页尾外联链接和页尾关于我们链接，不再依赖 `socials: string[]` 表达页尾入口。
- 外联栏目首期只展示一个“MUA 官网”外部链接，占位后续联盟或高校社团入口扩展。
- 页尾图标使用官网现有像素风图标资源或同一图标体系映射，不引入不一致的现代社交图标风格。
- 同步更新产品需求、总体设计、详细设计和 Strapi 模型说明中关于页脚、外部入口和 SiteSettings 字段的描述。

## Capabilities

### New Capabilities
- `site-footer-brand-panel`: 定义全站像素风品牌页尾、页尾链接栏目、页尾外联数据模型、MUA 官网外链和响应式行为。

### Modified Capabilities
- 无。

## Impact

- 前端组件：`frontend/components/SiteFooter.vue`、`frontend/types/content.ts`、`frontend/data/mock.ts`。
- 前端样式：`frontend/assets/css/main.css` 中页尾布局、像素风面板、图标链接、移动端适配和页尾高度相关样式。
- 公开接口适配：`frontend/server/utils/strapi.ts`、`frontend/server/api/public/settings.get.ts` 返回结构化页尾链接数据。
- Strapi 模型：`strapi-models/src/api/site-setting/content-types/site-setting/schema.json` 需要新增页尾链接字段或组件引用，并保留/迁移旧 `socials` 字段的处理策略。
- 文档：需要同步更新 `docs/产品需求文档.md`、`docs/总体设计文档.md`、`docs/详细设计文档.md`、`strapi-models/README.md` 和 `strapi-models/模型说明.md`。
- 已有约束：皮肤站、文档中心和 MUA 官网均作为公开外部链接处理，官网不得代理、嵌入、登录校验或管理外部系统业务数据；新的页尾高度不得破坏右下角社团服务触发器的页尾避让行为。
