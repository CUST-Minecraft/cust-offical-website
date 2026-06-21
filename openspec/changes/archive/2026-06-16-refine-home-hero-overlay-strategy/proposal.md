## Why

首页 Hero 轮播当前只通过 `contentAlign` 和 `overlayStrength` 推导大面积方向遮罩，能保障标题可读性，但展示型校园全景图也会被同样的中等遮罩压暗，导致蓝天、云层和校园空间感发灰。现在首页已有品牌主视觉、氛围图和校园全景图三种角色，需要把遮罩从单一暗度参数扩展为可运营的视觉策略。

相关既有文档包括 `docs/详细设计文档.md` 的首页数据模型、Hero 轮播配置和媒体要求，以及 `strapi-models/src/components/shared/hero-slide.json` 的 Hero Slide 字段定义。本变更会同步更新详细设计文档和模型说明中关于 Hero 轮播图样式配置的描述；不改变首页聚合接口路径，也不改变第一阶段公开站点边界。

## What Changes

- 为首页 Hero Slide 增加遮罩行为配置，使内容管理员或测试数据可以区分文案侧渐变、角落轻暗角、局部文字增强、轻边缘收束和无大面积遮罩。
- 保留现有 `overlayStrength` 作为暗度等级，但让暗度服务于遮罩模式，而不是始终生成大面积方向遮罩。
- 调整默认首页测试数据：品牌主视觉继续使用文案侧遮罩，氛围图使用轻遮罩，校园全景图使用展示型策略，避免全景画面被 medium 方向遮罩污染。
- 更新前端 `HomeHero` 渲染逻辑、TypeScript 内容类型、Strapi 模型、Strapi 数据映射和导入测试数据脚本。
- 更新项目文档中 HomePage / HeroSlide 配置说明，明确遮罩策略的运营语义和适用场景。
- 不引入新的运行时依赖，不新增公开 API 路由，不改变 Hero 文案字段和轮播交互。

## Capabilities

### New Capabilities
- `home-hero-overlay-strategy`: 定义首页 Hero 轮播图的遮罩策略配置、渲染行为和内容运营规则。

### Modified Capabilities
- `content-model-boundaries`: 首页 Hero Slide 属于结构化页面组件内容，需要新增遮罩行为字段并保持 Nuxt BFF 标准化输出。

## Impact

- 前端组件：`frontend/components/HomeHero.vue`。
- 前端类型与数据：`frontend/types/content.ts`、`frontend/data/mock.ts`。
- BFF / Strapi 适配：`frontend/server/utils/strapi.ts`。
- Strapi 内容模型与测试数据：`strapi-models/src/components/shared/hero-slide.json`、`scripts/import-strapi-test-data.mjs`。
- 文档：`docs/详细设计文档.md`、必要时同步 `strapi-models/README.md` 和 `strapi-models/模型说明.md`。
- 兼容性：既有内容没有新字段时应使用兼容默认值，保证现有 Hero Slide 仍可渲染。
