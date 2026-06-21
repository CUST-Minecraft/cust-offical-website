## Why

首页 Hero 使用基于校园实拍照片处理而来的 Minecraft 像素风图片，但当前页面没有为每张 Hero 图片提供地点说明和原图摄影署名。需要在不改动 Hero 主标题、按钮和轮播主视觉的前提下，为图片作者与地点补充清晰、克制、可维护的图注信息。

## What Changes

- 为首页 `HeroSlide` 增加可选图片图注能力，用于维护图片地点和原图摄影作者。
- 首页 Hero 在当前 slide 存在图注字段时，在 Hero 图片内部角落显示图注，并默认避开 Hero 主文案所在角落。
- 当地点和作者字段均为空时，前台不显示图注区域，避免空白占位或无意义标点。
- 图注默认使用“地点 · 原图摄影：作者”的中文格式；只有地点或只有作者时按可用字段单独显示。
- 保持现有 Hero 主文案、CTA、轮播机制、遮罩策略和图片展示规则不变。
- 同步更新 `docs/详细设计文档.md` 中 HomePage / HeroSlide 字段与首页 Hero 展示说明；如模型说明列出 HeroSlide 字段，也同步更新相关模型文档。

## Capabilities

### New Capabilities
- `home-hero-photo-caption`: 定义首页 Hero 当前图片图注的结构化字段、接口输出、空字段隐藏和前台显示规则。

### Modified Capabilities
- `content-model-boundaries`: 补充首页 Hero 图片图注属于结构化页面组件配置，不应通过 Markdown、图片文件名或前端硬编码维护。

## Impact

- Strapi 模型：`strapi-models/src/components/shared/hero-slide.json` 增加可选图片地点和原图摄影作者字段。
- Nuxt BFF：`frontend/server/utils/strapi.ts` 标准化输出每张 Hero slide 的图注字段，旧内容缺字段时输出可安全隐藏的空值。
- 前端类型与 mock：`frontend/types/content.ts`、`frontend/data/mock.ts`、`scripts/import-strapi-test-data.mjs` 需要补充可选字段和示例数据。
- 前端组件：`frontend/components/HomeHero.vue` 和样式需要在 Hero 图内部安全角落显示当前 slide 图注，并在字段为空时隐藏。
- 文档：`docs/详细设计文档.md`，以及列出 HeroSlide 字段的 `strapi-models/README.md` / `strapi-models/模型说明.md` 如适用。
- 不新增公开 API 路径，不新增依赖，不改变 `/api/public/home` 的聚合职责。
