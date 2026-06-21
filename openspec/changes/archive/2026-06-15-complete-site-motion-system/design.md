## Context

当前官网前台使用 Nuxt 3、Vue 3 和自定义像素风 CSS。项目已有若干独立动效：`HomeHero.vue` 的轮播淡入缩放、`SiteSearchOverlay.vue` 的浮层入场、`FloatingServiceStatus.vue` 的工作台打开/关闭、社团服务触发器的附魔高光，以及悦灵检测态的浮动和扫描条。它们提升了局部体验，但时长、缓动、减少动态策略和状态切换规则分散在 `frontend/assets/css/main.css` 中。

相关文档已经约束官网前台必须保持 Minecraft / 方块 / 像素风，同时不能牺牲可读性、移动端可用性和文本布局稳定性。本次设计只补全用户可见动效系统，不改变公开接口、Strapi 内容模型、外部服务边界、登录权限或部署结构。

## Goals / Non-Goals

**Goals:**

- 建立可复用的 motion tokens，统一 hover、弹层、内容入场和氛围动画的节奏。
- 补齐首页、列表页、通用页头、关于页、加入页等内容区域的轻量进入视口动画。
- 补齐搜索结果、空状态和分组变化的过渡。
- 补齐社团服务工作台内部服务栏位、服务状态面板和 Agent 状态切换的过渡。
- 保持 `prefers-reduced-motion: reduce` 下的可访问降级：停止循环和位移动画，保留必要的静态状态反馈。
- 同步更新 docs 中关于 UI 动效和开发规范的说明。

**Non-Goals:**

- 不引入 GSAP、Framer Motion、Lottie 或其他动画依赖。
- 不新增 CMS 字段、公开 API、服务端状态、真实 Agent 对话能力或 Minecraft 服务器状态查询。
- 不重设计页面布局、色彩系统、信息架构或社团服务工作台业务边界。
- 不为正文阅读区域添加持续循环动画或强烈视差效果。

## Decisions

### 决策 1：使用 CSS motion tokens 统一节奏

在 `frontend/assets/css/main.css` 的设计变量区域新增 motion tokens，例如 fast、ui、panel、content、ambient 等层级，并配套统一缓动变量。已有 transition 和 animation 优先改用这些变量。

替代方案：继续在各选择器中直接写毫秒值。该方案改动少，但无法形成一致动效语言，也不利于后续维护和减少动态统一降级。

### 决策 2：页面内容入场使用轻量 reveal 机制

首页横幅、列表卡片、通用页头、关于页分组、加入页要求与流程使用统一的 reveal class 或组件级 class。实现可以使用浏览器原生 IntersectionObserver composable，也可以在首屏内使用 CSS class 直接触发。动画表现限制为 opacity、transform、filter 等不会触发布局重排的属性。

替代方案：使用纯 CSS scroll-driven animation。该能力在兼容性和调试上更不稳定，不适合作为第一阶段的主路径。

### 决策 3：Vue 状态切换使用 `<Transition>` / `<TransitionGroup>`

搜索结果和工作台内部状态切换应使用 Vue 内置 `<Transition>` 或 `<TransitionGroup>`，配合稳定 key 表达“状态替换”。这与现有搜索浮层和工作台打开/关闭的实现方式一致，不需要引入新依赖。

替代方案：只靠 CSS `:hover` 或条件 class。该方案适合微交互，但无法自然表达结果列表、空状态和右侧栏位的进入/离开。

### 决策 4：工作台内部动效表达空间关系，不改变业务行为

社团服务工作台保留现有入口、面板、左侧服务列表、标题栏状态入口和右侧栏位结构。动效只补充用户切换文档中心、悦灵助手、服务状态面板和 Agent 状态时的视觉连续性，不能把服务状态重新表现为左侧服务项，也不能新增外部跳转或 fallback 按钮。

替代方案：借动效重做工作台布局。该方案会扩大范围，并可能与已归档的 `community-services-workbench` spec 冲突。

### 决策 5：减少动态策略覆盖所有新增动效

所有新增动画必须在 `prefers-reduced-motion: reduce` 下停止位移、缩放、模糊、循环扫描和 stagger 延迟；交互状态仍通过静态颜色、边框、亮度或阴影反馈。已有 Hero、搜索浮层、工作台和触发器高光也应归入同一降级规则。

替代方案：只给新增 reveal 动画做降级。该方案容易留下局部循环或位移动画，体验不一致。

## Risks / Trade-offs

- [Risk] 页面入场动画过多会干扰阅读。→ 限制为一次性轻量 reveal，避免正文区域持续运动。
- [Risk] IntersectionObserver 增加组件复杂度。→ 将逻辑收敛到一个 composable 或少量复用 class，不在每个页面散写观察逻辑。
- [Risk] 搜索结果频繁变化时动画闪烁。→ 控制时长和离开动画，输入过程中保持列表布局稳定。
- [Risk] 工作台内部切换动画造成移动端文本或面板溢出。→ 只使用 transform/opacity/filter，不改变固定面板尺寸和网格结构。
- [Risk] 统一 tokens 改动范围较大。→ 先替换动效相关声明，不顺手重构颜色、阴影或布局变量。

## Migration Plan

1. 更新 docs，明确全站动效系统、减少动态和实现规范。
2. 在 `frontend/assets/css/main.css` 增加 motion tokens 和通用 reveal/transition class。
3. 逐步把已有 Hero、搜索浮层、工作台、触发器高光和 Agent 动画改用 tokens。
4. 为搜索结果和工作台内部状态添加 Vue transition 包裹。
5. 为首页、列表页、通用页头、关于页、加入页补充进入视口动画。
6. 验证桌面端、移动端和 `prefers-reduced-motion`，确保无横向滚动、无文本重叠、无布局跳动。

## Open Questions

- 页面内容 reveal 是否需要在所有列表页启用，还是先覆盖首页、活动、公告、动态三类高频页面？
- 是否需要把 reveal 逻辑封装成 composable，还是先使用简单 class 与组件内最小逻辑？
