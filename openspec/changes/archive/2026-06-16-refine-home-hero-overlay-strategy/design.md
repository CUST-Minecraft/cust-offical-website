## Context

首页 Hero 由 Strapi `home-page.heroSlides` 配置，Nuxt BFF 在 `frontend/server/utils/strapi.ts` 标准化为 `HomeHero.slides`，前端 `HomeHero.vue` 根据 `contentAlign` 和 `overlayStrength` 生成背景图上的方向性 linear-gradient。这个模型能处理“标题压在图片上”的基本可读性问题，但它把遮罩行为和文案位置绑定：文案在右侧时就总是右侧大面积渐暗，无法表达“这张图是展示型全景，只需要文字局部兜底”。

当前三张首页测试 slide 已经呈现出不同内容角色：第一张是品牌主视觉，第二张是氛围图，第三张是校园全景。第三张画面价值在于明亮天空、楼群和校园尺度，继续使用 `right + medium` 会让画面发灰，降低展示效果。变更需要在不重做 Hero 结构、不新增公开 API 路由的前提下，让每张 slide 可以独立选择遮罩行为。

## Goals / Non-Goals

**Goals:**
- 为 Hero Slide 增加 `overlayMode`，让遮罩行为从 `contentAlign` 的隐式推导中解耦。
- 保留 `overlayStrength`，但让它作为所选遮罩模式的强度参数。
- 支持至少五种模式：`side`、`corner`、`local`、`edge`、`none`。
- 允许展示型 slide 保留原图亮度，不显示文字背景面板，只保留文字描边、阴影和按钮自身可读性。
- 保持旧内容兼容：缺少 `overlayMode` 时按现有方向性遮罩行为渲染。
- 同步更新 Strapi 模型、前端类型、BFF 映射、mock 数据、测试数据和详细设计文档。

**Non-Goals:**
- 不重做首页 Hero 的整体布局、轮播机制、按钮文案或动效系统。
- 不新增图片处理服务，不在运行时生成新图片资源。
- 不引入新的 CSS 框架、动画库或图像依赖。
- 不把 Hero 配置从 Strapi 迁移到自研后台。
- 不改变 `/api/public/home` 路径或首页公开聚合接口职责。

## Decisions

### 1. 新增 `overlayMode`，而不是复用 `textStyle`

`textStyle` 目前描述标题呈现方式，如 `outlined`、`bottomBar`、`compactOverlay`。遮罩是背景处理策略，和文字样式相关但不是同一层语义。新增 `overlayMode` 可以避免把“展示型全景”这类背景行为塞进文字样式枚举。

枚举建议：

| Mode | 用途 | 行为 |
| --- | --- | --- |
| `side` | 品牌主视觉 | 按 `contentAlign` 生成文案侧或底部方向遮罩 |
| `corner` | 展示型图片 | 只在指定角落轻压暗，避免污染整张全景图 |
| `local` | 展示型图片 | 背景不做大面积渐暗，文字区域不显示背景面板，仅保留文字描边、阴影和按钮自身样式 |
| `edge` | 氛围图 | 添加轻微边缘收束，避免全局灰黑压层 |
| `none` | 纯展示图 | 不生成遮罩，仅保留文字描边、阴影和按钮自身样式 |

替代方案是继续只调 `overlayStrength`。这能解决第三张图短期过暗的问题，但不能表达“同样右侧文案也不应该右侧整片变暗”的新行为，后续换图仍会靠猜强度。

### 2. 保留 `overlayStrength` 并下放到模式内部

`overlayStrength` 仍使用 `none | soft | medium | strong`，避免破坏现有内容模型和维护习惯。不同 `overlayMode` 会用它计算不同层的透明度：

- `side`：沿用现有方向渐变，但可适度降低 `medium` 的体感黑度，避免白天图发灰。
- `corner`：根据 `overlayAnchor` 在单个角落生成轻量 radial-gradient，`soft` 强度应保持克制。
- `local`：不改变背景图，不显示文字背景面板，只强化文字描边、阴影或等价文本可读性样式。
- `edge`：生成很轻的边缘收束层，不能覆盖主体建筑和天空。
- `none`：不生成背景遮罩；`overlayStrength` 可被忽略或保留为内容兼容字段。

### 3. 使用分层渲染，而不是继续把所有遮罩写入 `backgroundImage`

现有 `getHeroBackgroundImage()` 把渐变和图片拼成同一个 `backgroundImage`。这对 `side` 很方便，但 `local` 和 `edge` 会更适合通过 CSS class / CSS variables / pseudo-element 分层处理。建议拆成：

- 背景图片层：只负责 `url(...)` 和 `backgroundPosition`。
- 全局遮罩层：根据 `overlayMode` 渲染 `side` 或 `edge`。
- 局部文字层：根据 `overlayMode=local` 调整文字描边、阴影或按钮自身样式，不给文案区域增加可见背景面板。

这样能让背景图始终保持可检查，也让不同模式在 CSS 中更容易独立调试。

### 4. 兼容旧内容默认使用 `side`

Strapi 旧数据没有 `overlayMode` 时，BFF 应输出默认值 `side`，等价于现有行为。这样已经发布或导入过的 Hero Slide 不会因为新增字段而失效。后续测试数据可以显式配置：

- 第一张品牌主视觉：`overlayMode: side`，`overlayStrength: medium`。
- 第二张氛围图：`overlayMode: edge` 或 `side`，`overlayStrength: soft`。
- 第三张校园全景：`overlayMode: corner`、`local` 或 `none`；使用 `corner` 时建议 `overlayAnchor: right-top` 且 `overlayStrength: soft`。

### 5. 文档更新只同步详细设计和模型说明

这个变更影响首页页面配置、HeroSlide 字段和前端渲染，不改变产品范围、技术栈、权限、缓存或部署。实施时应更新 `docs/详细设计文档.md` 的 HomePage 数据模型和 Hero 轮播说明；如果模型说明仍列出 HeroSlide 字段，也应更新 `strapi-models/README.md` / `strapi-models/模型说明.md`。

## Risks / Trade-offs

- [Risk] 新增模式后编辑项变多，内容管理员不知道如何选择。→ 在文档和默认测试数据里按“品牌主视觉 / 氛围图 / 展示型全景”给出选择规则。
- [Risk] `local` 模式下文字在高亮背景上仍可能不清楚。→ 保留标题描边、文字阴影和按钮底色；如仍不足，应优先调整图片焦点、文字位置或改用 `side`，而不是给 `local` 增加可见背景面板。
- [Risk] `edge` 模式如果实现过重，会退化成新的全局暗角。→ 明确 `edge` 只能轻微收边，不能覆盖主体建筑和天空。
- [Risk] Strapi 新字段对已有数据为空。→ BFF 使用 `side` 作为兼容默认值，mock 和导入脚本显式补齐。
- [Risk] 移动端文案落到底部后可读性不足。→ 移动端 CSS 应保持文字描边、阴影和按钮自身样式；如仍不足，应调整 slide 配置，而不是给 `local` 增加可见背景面板或整图渐暗。
