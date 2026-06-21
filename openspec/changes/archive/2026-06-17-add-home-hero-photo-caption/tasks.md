## 1. 文档与现状确认

- [x] 1.1 阅读 `docs/详细设计文档.md` 中首页 HomePage、HeroSlide、媒体和首页接口说明，确认需要同步更新的位置。
- [x] 1.2 阅读 `openspec/specs/home-hero-overlay-strategy/spec.md` 和 `openspec/specs/content-model-boundaries/spec.md`，确认图注能力不改变既有遮罩策略和内容模型边界。
- [x] 1.3 阅读 `strapi-models/src/components/shared/hero-slide.json`、`frontend/types/content.ts`、`frontend/server/utils/strapi.ts`、`frontend/components/HomeHero.vue` 和默认首页数据，确认当前 Hero slide 字段、BFF 映射和渲染路径。

## 2. 数据模型与标准化输出

- [x] 2.1 在 `strapi-models/src/components/shared/hero-slide.json` 为 Hero Slide 增加可选 `photoLocation` 字段。
- [x] 2.2 在 `strapi-models/src/components/shared/hero-slide.json` 为 Hero Slide 增加可选 `photoAuthor` 字段。
- [x] 2.3 在 `strapi-models/src/components/shared/hero-slide.json` 为 Hero Slide 增加可选 `photoCaptionPosition` 字段，支持 `auto` 和四个角落位置。
- [x] 2.4 更新 `frontend/types/content.ts` 的 `HeroSlide` 类型，加入稳定的 `photoLocation`、`photoAuthor` 和 `photoCaptionPosition` 字段。
- [x] 2.5 更新 `frontend/server/utils/strapi.ts` 的首页数据映射，在 Strapi 缺少图注文案字段时输出空字符串，缺少位置字段时输出 `auto`。

## 3. 默认内容与导入数据

- [x] 3.1 更新 `frontend/data/mock.ts` 默认首页 Hero slide，为需要署名的图片补充示例 `photoLocation` 和 `photoAuthor`，并保留至少一个空字段隐藏场景。
- [x] 3.2 更新 `scripts/import-strapi-test-data.mjs` 的首页测试数据，使导入 Strapi 后的 Hero slide 图注与 mock 策略一致。
- [x] 3.3 如模型说明列出 HeroSlide 字段，更新 `strapi-models/README.md` 和 `strapi-models/模型说明.md` 中的字段描述。

## 4. 首页 Hero 图注渲染

- [x] 4.1 更新 `frontend/components/HomeHero.vue`，根据当前 active slide 的 `photoLocation` 和 `photoAuthor` 计算图注文本。
- [x] 4.2 实现图注拼接规则：地点和作者都有时显示“地点 · 原图摄影：作者”，只有地点时只显示地点，只有作者时显示“原图摄影：作者”。
- [x] 4.3 当当前 slide 地点和作者均为空时，不渲染图注容器，并避免空白占位或孤立标点。
- [x] 4.4 将图注放在 Hero 图片内部角落，并确保图注跟随 active slide 切换。
- [x] 4.5 实现 `auto` 位置避让规则，确保图注不与 Hero 主文案位于同一角落。
- [x] 4.6 更新 `frontend/assets/css/main.css`，为图注添加克制、低干扰、响应式可换行的图片内署名样式。

## 5. 文档同步

- [x] 5.1 更新 `docs/详细设计文档.md` 的 HomePage 数据模型和 HeroSlide 说明，补充图片地点和原图摄影作者字段。
- [x] 5.2 更新 `docs/详细设计文档.md` 的首页 Hero 展示说明，写明图注位于 Hero 图片内部安全角落，字段为空时隐藏。
- [x] 5.3 检查 `docs/产品需求文档.md`、`docs/总体设计文档.md` 和 `docs/开发规范文档.md` 是否需要同步；如不需要，记录原因或保持不改。

## 6. 验证

- [x] 6.1 运行前端类型检查或项目现有校验命令，确认新增字段不会破坏类型约束。
- [x] 6.2 启动前端本地页面，检查首页 Hero 桌面视口下图注位于图片内安全角落、低干扰且不遮挡主文案、轮播点或下一段内容。
- [x] 6.3 检查 Hero 轮播切换时图注跟随当前 slide 更新。
- [x] 6.4 检查移动端视口，确认图注可换行且不与 Hero 主文案、按钮、轮播指示器或后续内容重叠。
- [x] 6.5 检查空字段兼容：地点和作者均为空时不显示图注区域，旧 Strapi 内容缺少字段时页面不报错。
