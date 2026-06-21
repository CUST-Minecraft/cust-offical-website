## Context

首页 Hero 由 Strapi `home-page.heroSlides` 配置，Nuxt BFF 在 `frontend/server/utils/strapi.ts` 标准化为 `HomeHero.slides`，前端 `HomeHero.vue` 根据当前 active slide 渲染背景、遮罩、主标题和按钮。已有 `home-hero-overlay-strategy` 只解决图片遮罩和文字可读性，不覆盖图片地点和原图摄影署名。

当前默认 Hero 图片来自校园照片的像素风处理版本。用户希望保留现有 Hero 主文案，但在图片内部提供地点与原图摄影作者信息；图注可以位于四个角落之一，并且默认不能与 Hero 主文案占用同一角落。字段为空时不显示，避免未署名图片出现空白图注。

## Goals / Non-Goals

**Goals:**

- 为每张首页 Hero slide 增加可选图片地点和原图摄影作者字段。
- 由 Strapi 结构化字段维护图注内容，并通过 `/api/public/home` 标准化输出。
- 在 Hero 图片内部安全角落显示当前 active slide 的图注。
- 支持 `auto` 图注位置，默认根据 Hero 主文案位置选择不冲突角落。
- 当地点和作者均为空时，不渲染图注容器或可见占位。
- 保持现有 Hero 主标题、副标题、按钮、轮播、遮罩策略和背景图展示逻辑稳定。
- 同步更新详细设计文档和模型说明中 HeroSlide 字段描述。

**Non-Goals:**

- 不改写首页 Hero 主文案内容。
- 不重做首页 Hero 视觉结构、轮播机制或遮罩系统。
- 不新增图片版权管理、授权协议、素材库或作者主页管理能力。
- 不把 Strapi 媒体 `caption` / `alternativeText` 作为唯一图注来源。
- 不新增公开 API 路径或改变 `/api/public/home` 的聚合职责。

## Decisions

### 决策 1：图注作为 `HeroSlide` 的结构化字段维护

新增字段建议为：

```text
HeroSlide
├─ photoLocation: string, optional
├─ photoAuthor: string, optional
└─ photoCaptionPosition: auto | left-top | right-top | left-bottom | right-bottom
```

`photoLocation` 表示图片地点，例如“长春理工大学主楼”。`photoAuthor` 表示原图摄影作者，例如“张三”。两者都可为空。`photoCaptionPosition` 默认使用 `auto`，也允许内容管理员为个别图片指定四个角落之一。

替代方案是复用媒体 `caption` 或 `alternativeText`。该方案可以减少字段，但媒体 alt 更偏可访问性描述，caption 也可能被同一媒体在不同页面复用，难以表达“首页 Hero 当前 slide 的地点与原图摄影署名”。结构化字段更符合现有 `HeroSlide` 负责图片呈现策略的模型。

### 决策 2：BFF 输出空字符串而不是让前端处理缺字段

Nuxt BFF 应在标准化 `HeroSlide` 时输出稳定字段：

```text
photoLocation: string
photoAuthor: string
photoCaptionPosition: string
```

旧内容缺少字段时输出空字符串。这样前端类型、mock、测试数据和渲染逻辑都可以依赖稳定形状，并通过“两个字段 trim 后均为空”判断隐藏图注。

替代方案是让字段保持 optional。该方案实现较少，但会把兼容逻辑分散到多个前端消费点，不如 BFF 标准化一致。

### 决策 3：前端按可用字段拼接图注

显示格式：

```text
地点 · 原图摄影：作者
```

规则：

```text
地点和作者都为空 -> 不显示
只有地点 -> 地点
只有作者 -> 原图摄影：作者
地点和作者都有 -> 地点 · 原图摄影：作者
```

使用“原图摄影”而不是“图片作者”，避免把实拍原图作者与像素风处理后的最终 Hero 图片制作者混淆。

替代方案是新增一个自由文本 `photoCaption` 字段。该方案最灵活，但会让内容格式不稳定，容易出现多种标点和署名口径，不利于统一维护。

### 决策 4：图注放在 Hero 图片内部安全角落

图注应位于 Hero 图片内部四个角落之一，并使用较小字号、克制颜色、轻微文字阴影、像素强调边和轻量玻璃模糊框。玻璃框用于稳定可读性，但不使用暗角、大面积渐变遮罩、木牌纹理或厚重装饰边框，避免抢过 Hero 主文案。轮播切换时图注跟随当前 active slide 更新。

默认位置使用 `auto`：前端根据 `contentPosition` / `contentAlign` 推导 Hero 主文案所在角落，并选择对角或安全角。若后台显式选择的位置与 Hero 主文案所在角落相同，前端仍应换到安全角，保证图注不与主文案同位。

移动端同样在图片内部显示，并根据角落位置保持安全边距。底部角落需要上抬，避免与轮播指示器、行动按钮或像素地形边缘重叠。

替代方案是放在 Hero 图片外部正下方居中。该方案语义清楚，但实际呈现容易形成额外深色尾部，让 Hero 和下一段内容之间出现不够自然的断层。

## Risks / Trade-offs

- [Risk] 图注放回图片内部后可能压住画面主体。→ 默认使用安全角落，并允许后台为个别图片调整角落。
- [Risk] 后台只填写作者或只填写地点时可能出现格式尴尬。→ 前端按字段存在情况分别拼接，避免孤立分隔符。
- [Risk] 真实摄影作者可能涉及公开姓名展示。→ 字段由内容管理员维护，可使用昵称、组织名或经授权的署名，不要求公开真实姓名。
- [Risk] 旧 Strapi 内容缺少新增字段。→ BFF 输出空字符串，前端在两字段为空时完全隐藏图注。
- [Risk] 底部角落图注可能与像素地形边缘或轮播点冲突。→ 底部位置上抬，并用桌面和移动端视口验证不重叠。
