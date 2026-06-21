## 1. 文档与范围确认

- [x] 1.1 阅读 `docs/产品需求文档.md`、`docs/总体设计文档.md`、`docs/详细设计文档.md`、`docs/开发规范文档.md` 中 UI 视觉、交互状态、社团服务工作台、全站搜索和非功能需求相关段落。
- [x] 1.2 对照 `openspec/specs/community-services-workbench/spec.md`，确认服务状态仍作为标题栏面板级入口，不回退为左侧服务项。
- [x] 1.3 更新 `docs/详细设计文档.md`，补充全站动效系统、页面内容入场、搜索结果过渡、工作台内部切换和减少动态规则。
- [x] 1.4 更新 `docs/开发规范文档.md`，记录 motion tokens、Vue Transition 使用约定、减少动态覆盖和禁止新增动画依赖的规范。
- [x] 1.5 如产品需求需要用户可见动效说明，轻量更新 `docs/产品需求文档.md`，避免写入实现细节。

## 2. Motion Tokens 与基础样式

- [x] 2.1 在 `frontend/assets/css/main.css` 的设计变量区域新增 motion tokens 和缓动变量，覆盖 fast、ui、panel、content、ambient 等层级。
- [x] 2.2 将现有 Hero、搜索浮层、工作台打开/关闭、社团服务触发器高光、Agent 检测态和常用 hover transition 改用 motion tokens。
- [x] 2.3 新增通用 reveal、stagger、内容切换和列表项过渡 class，确保仅使用 opacity、transform、filter 等不触发布局重排的属性。
- [x] 2.4 统一 `prefers-reduced-motion: reduce` 覆盖，停止位移、缩放、模糊、循环扫描和 stagger 延迟，并保留静态状态反馈。
- [x] 2.5 清理或复用闲置动效定义，避免保留未使用且语义重复的 keyframes。

## 3. 社团服务工作台动画

- [x] 3.1 更新 `frontend/components/FloatingServiceStatus.vue`，为文档中心与悦灵助手右侧栏位切换添加稳定 key 和 Vue `<Transition>`。
- [x] 3.2 为标题栏服务状态入口打开和返回服务列表添加内容区过渡，保持服务状态不表现为左侧列表项。
- [x] 3.3 为悦灵助手 checking、offline、online、sending 等 Agent 状态切换添加短过渡，保留现有不可用提示和无 fallback 按钮规则。
- [x] 3.4 在 `frontend/assets/css/main.css` 中补充工作台栏位、状态面板、Agent 状态和左侧选中反馈的 transition class。
- [x] 3.5 验证工作台在桌面端和移动端切换过程中面板尺寸、文本、关闭按钮、状态入口和服务列表不跳动、不重叠。

## 4. 全站搜索动画

- [x] 4.1 更新 `frontend/components/SiteSearchOverlay.vue`，为搜索结果分组、结果项和空状态添加 `<Transition>` 或 `<TransitionGroup>`。
- [x] 4.2 在 `frontend/assets/css/main.css` 中补充搜索结果进入、离开、空状态切换和结果分组切换样式。
- [x] 4.3 验证输入关键词、清空关键词、无结果、回车进入首个结果和 Tab 聚焦流程不被动画阻塞。
- [x] 4.4 验证搜索浮层在 `prefers-reduced-motion: reduce` 下仍可读、可关闭、可键盘操作。

## 5. 页面内容进入视口动画

- [x] 5.1 选择并实现轻量 reveal 方案，可使用复用 class 或一个小型 IntersectionObserver composable，不新增第三方依赖。
- [x] 5.2 为 `frontend/components/PageHero.vue` 补充页头背景、标题和摘要的轻量入场反馈。
- [x] 5.3 为 `frontend/components/PromoBanner.vue` 和 `frontend/pages/index.vue` 中首页横幅、标签、活动条目、缩略图和社员条目补充进入视口或分组入场动画。
- [x] 5.4 为 `frontend/components/ContentCard.vue` 以及活动、公告、动态、社员列表页补充卡片入场和 hover/focus 微交互。
- [x] 5.5 为 `frontend/pages/about/index.vue` 的分组卡片、`frontend/pages/join/index.vue` 的要求卡片和流程步骤补充轻量入场动画。
- [x] 5.6 为 `frontend/pages/activities/index.vue` 的筛选项和筛选后列表变化补充短过渡，保持卡片网格稳定。

## 6. 可访问性、响应式与视觉验证

- [x] 6.1 运行前端类型检查或构建命令，确认 Vue Transition、composable 和样式调整没有引入 TypeScript、Vue 或 Nuxt 错误。
- [x] 6.2 启动本地前端，验证首页、活动页、公告页、动态页、社员页、关于页和加入页的动画节奏一致且不影响文本阅读。
- [x] 6.3 使用桌面端和移动端视口检查搜索浮层、社团服务工作台、列表卡片和通用页头无横向滚动、文本重叠或布局跳动。
- [x] 6.4 使用浏览器或测试脚本模拟 `prefers-reduced-motion: reduce`，验证新增位移、缩放、模糊、循环扫描和 stagger 动画停止，静态状态仍可见。
- [x] 6.5 检查键盘 focus、Enter、Escape、Tab、点击遮罩关闭和外部链接跳转行为仍与现有要求一致。
- [x] 6.6 运行 OpenSpec 状态或校验命令，确认 proposal、design、specs 和 tasks 仍满足 apply 前置条件。
