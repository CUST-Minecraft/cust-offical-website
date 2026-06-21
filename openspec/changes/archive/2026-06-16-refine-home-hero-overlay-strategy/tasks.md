## 1. 文档与现状确认

- [x] 1.1 阅读 `docs/详细设计文档.md` 中首页 HomePage、HeroSlide、媒体和首页接口说明，确认需要同步更新的位置。
- [x] 1.2 阅读 `strapi-models/src/components/shared/hero-slide.json`、`frontend/types/content.ts`、`frontend/server/utils/strapi.ts`、`frontend/components/HomeHero.vue` 和默认首页数据，确认现有遮罩字段和渲染路径。
- [x] 1.3 对照本 change 的 specs，确认新增 `overlayMode` 不改变 `/api/public/home` 路径、Hero 文案字段、轮播交互和现有旧内容兼容要求。

## 2. 内容模型与标准数据

- [x] 2.1 在 `strapi-models/src/components/shared/hero-slide.json` 为 Hero Slide 增加 `overlayMode` 枚举字段，支持 `side`、`local`、`edge`、`none`，默认值为 `side`。
- [x] 2.2 更新 `frontend/types/content.ts` 的 `HeroSlide` 类型，加入稳定的 `overlayMode` 类型。
- [x] 2.3 更新 `frontend/server/utils/strapi.ts` 的首页数据映射，在 Strapi 缺少 `overlayMode` 时输出兼容默认值 `side`。
- [x] 2.4 检查 mock fallback 和生产禁用 mock 规则，确保新增字段不改变已有数据获取错误语义。

## 3. 首页 Hero 遮罩渲染

- [x] 3.1 重构 `frontend/components/HomeHero.vue` 的背景样式计算，让背景图片、全局遮罩和局部文字增强可以按 `overlayMode` 分层控制。
- [x] 3.2 实现 `side` 模式：按 `contentAlign` 生成文案侧或底部方向遮罩，并继续响应 `overlayStrength`。
- [x] 3.3 实现 `local` 模式：背景图不应用大面积方向遮罩，文字背后不显示背景面板，只保留文字描边、阴影或等价兜底。
- [x] 3.4 实现 `edge` 模式：提供轻微边缘收束，不明显压暗主体建筑、天空或画面中心。
- [x] 3.5 实现 `none` 模式：不生成背景遮罩，保留标题描边、阴影、按钮和已有文字可读性样式。
- [x] 3.6 检查移动端样式，确保 `local` 模式在文案落到底部时仍有可读性兜底，且不显示文字背景面板、不把整张图压暗。

## 4. 默认内容与导入数据

- [x] 4.1 更新 `frontend/data/mock.ts` 默认首页 Hero slide：第一张使用 `side + medium`，第二张使用轻遮罩策略，第三张校园全景使用 `local` 或 `none`，避免 `medium` 大面积方向遮罩。
- [x] 4.2 更新 `scripts/import-strapi-test-data.mjs` 的首页测试数据，使导入 Strapi 后的三张 Hero slide 与 mock 策略一致。
- [x] 4.3 如模型说明列出 HeroSlide 字段，更新 `strapi-models/README.md` 和 `strapi-models/模型说明.md` 中的字段描述。

## 5. 文档同步

- [x] 5.1 更新 `docs/详细设计文档.md` 的 HomePage 数据模型，补充 HeroSlide 遮罩行为模式字段。
- [x] 5.2 更新 `docs/详细设计文档.md` 的首页 Hero 轮播说明，写明品牌主视觉、氛围图和展示型全景图的遮罩选择规则。
- [x] 5.3 确认 `docs/产品需求文档.md`、`docs/总体设计文档.md` 和 `docs/开发规范文档.md` 不需要同步修改；如果实施中发现用户可见范围、技术约束或开发规范发生变化，则补充对应文档。

## 6. 验证

- [x] 6.1 运行前端类型检查或构建命令，确认新增 `overlayMode` 不破坏 Nuxt / TypeScript 编译。
- [x] 6.2 启动前端本地页面，检查首页 Hero 三张 slide 在桌面视口下的遮罩表现。
- [x] 6.3 检查第三张校园全景 slide，确认天空、云层、楼群和校园空间感未被中等或强烈大面积暗角压暗。
- [x] 6.4 检查移动端视口，确认 Hero 文案可读、按钮不溢出，局部安全区不会遮挡画面主体。
- [x] 6.5 检查旧数据兼容：移除或缺省 `overlayMode` 时，首页 Hero 仍按文案侧遮罩默认策略渲染。

## 7. 角落轻暗角追改

- [x] 7.1 增加 `corner` 遮罩模式和 `overlayAnchor` 遮罩锚点字段，支持右上角等局部角落暗角。
- [x] 7.2 将第三张校园全景 slide 调整为 `corner + right-top + soft`，避免使用右侧整片暗角或文字背景面板。
- [x] 7.3 同步更新 OpenSpec、详细设计文档和 Strapi 模型说明中的遮罩模式语义。
