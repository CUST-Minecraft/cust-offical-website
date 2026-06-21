## Context

当前官网前台通过 Nuxt BFF 的 `/api/public/*` 聚合接口消费 Strapi 内容模型，Header、Footer、首页和公开内容页已经使用标准化前端类型渲染。内容模型边界已经明确：`site-setting` 负责站点基础身份信息，`external-service` 负责外部服务入口，`maintenance-page` 负责维护页和服务状态，活动、公告、动态、成员等内容分别由独立模型维护。

维护人员在前台验收页面时，常见问题不是“接口路径是什么”，而是“这段文字应该去后台哪个数据模型、哪个字段修改”。因此该功能应是内容维护辅助层，而不是开发调试器。它需要融入 Minecraft 像素风视觉，但不能干扰普通访问者，也不能改变页面布局。

项目中 Header、按钮和卡片存在固定高度、grid/flex 布局、`white-space: nowrap` 和文本省略等约束。字段提示不得通过向页面文字后追加字段名、插入内联说明或增加布局型 wrapper 的方式实现。

## Goals / Non-Goals

**Goals:**

- 提供社团服务按钮上方的 Minecraft 风格“维护模式”按钮，使用钻石镐风格图标，作为唯一开启和关闭字段提示模式的入口。
- 在字段提示模式开启时，用不参与布局的 outline 标识可维护字段。
- 在 hover 字段时显示简短气泡，内容包含数据模型、字段名称和页面用途。
- 在 click 字段时固定当前气泡，便于维护人员对照 Strapi 后台修改。
- 字段提示层通过 body 级 overlay 呈现，保证不改变原页面文字宽高、换行、行高或组件布局。
- 将字段提示元信息集中管理或以轻量指令挂载，避免把模型/字段字符串无序散落在模板中。

**Non-Goals:**

- 不新增公开 API，不修改 Strapi content-type，不改变 `/api/public/*` 数据结构。
- 不展示 API 路径、响应 path、Vue 组件名、Strapi 技术 uid 以外的调试细节或后端调用链。
- 不提供 URL query、快捷键或 localStorage 手工开关作为维护人员入口。
- 不建设自研后台，不代理或嵌入 Strapi Admin。
- 不为普通访问者展示字段按钮或字段提示。

## Decisions

### 1. 使用社团服务按钮上方的 Minecraft 风格按钮作为唯一触发入口

页面默认不显示字段标注。维护/开发预览环境中，在社团服务按钮上方固定显示一个像素风“维护模式”按钮。按钮使用钻石镐风格图标、石质或深板岩质感、黑色像素描边和克制高光；开启态使用草方块/绿宝石色边框提示状态。按钮宽度、高度和图标槽尺寸应与社团服务按钮保持一致，并复用同一套页尾避让计算。

替代方案是 URL 参数、快捷键或隐藏控制台开关。这些方式更偏开发者，维护人员难以发现，也容易造成“为什么当前页面突然有标注”的困惑。单一按钮入口更直观，也便于在培训和验收流程中说明。

### 2. 字段标注使用 directive + overlay，不使用 wrapper 或内联文本

可维护字段通过轻量 `v-field-hint` 类似指令或等价机制挂载元信息。指令只负责注册元素、维护 hover/click 状态和暴露元素位置，不向原元素追加可见文字，也不创建参与布局的子节点。

实际可见 outline 和气泡由全局 overlay 渲染，并挂到 body 下。overlay 根据目标元素的 `getBoundingClientRect()` 计算位置，使用 `position: fixed`、高 `z-index` 和 `pointer-events: none` 显示。

替代方案是 wrapper component、`data-*` + CSS `content` 或在原文后追加 `[field]`。wrapper 可能改变 inline/flex/grid 结构，CSS `content` 难以承载多行信息且定位受限，追加字段名会直接破坏 Header、按钮和卡片排版。

### 3. 维护人员信息保持最小集

气泡仅展示：

- 数据模型：例如 `站点设置（site-setting）`
- 字段名称：例如 `shortName`
- 页面用途：例如 `Header 品牌名`

如后续需要，可增加“后台位置”这类维护提示，但默认不展示 API、响应 path、组件名或网络细节。该功能服务内容维护，不服务接口调试。

### 4. 字段元信息采用维护视角命名

字段元信息建议使用维护人员可读的结构：

```ts
interface ContentFieldHint {
  modelLabel: string
  model: string
  field: string
  usage: string
}
```

例如：

```ts
{
  modelLabel: '站点设置',
  model: 'site-setting',
  field: 'shortName',
  usage: 'Header 品牌名'
}
```

字段元信息可以先集中在前端 registry 中，再由组件引用；对少量特殊字段也可以就近声明，但应避免大量硬编码散落。

### 5. 与现有浮层和工具入口保持层级边界

维护模式按钮固定在社团服务按钮上方，避免与页面主要内容、Header 和页脚信息冲突。字段 overlay 的层级应高于普通页面内容，但低于全屏搜索浮层、模态浮层和维护页关键状态。字段气泡在搜索浮层打开时应隐藏或退让。

## Risks / Trade-offs

- [Risk] 字段 outline 或气泡遮挡 Header、按钮和内容阅读。→ 使用轻量 outline、较小气泡和 click 固定机制；气泡通过视口边界检测避开页面边缘。
- [Risk] 字段元信息散落在组件中，后续维护困难。→ 优先建立集中 registry，并在任务中覆盖 Header、Footer 和核心公开页面的代表字段。
- [Risk] 维护入口被普通访问者看到。→ 入口仅在开发/预览允许条件下渲染，生产默认不显示。
- [Risk] overlay 位置在滚动、窗口缩放或内容异步更新后过期。→ active/pinned 状态下监听 scroll/resize 或在动画帧中刷新目标 rect。
- [Risk] 过度标注所有文本会让页面变得嘈杂。→ 第一阶段只标注由 Strapi 结构化字段驱动、维护人员最可能修改的内容。

## Migration Plan

1. 新增字段提示状态、指令/注册机制、overlay 组件和维护模式按钮。
2. 为 Header、Footer、首页核心字段和外部服务入口添加字段提示元信息。
3. 补充 Minecraft 风格按钮、outline 和气泡样式，确保所有标注不参与布局。
4. 更新 `docs/详细设计文档.md` 中的内容维护辅助说明。
5. 运行类型检查并手动验证桌面和移动视口中 Header、按钮、卡片和页脚布局不被字段提示影响。

回滚时移除字段提示入口和指令挂载即可；不涉及数据迁移或内容模型迁移。

## Open Questions

- 字段按钮最终应仅在 `import.meta.dev` 显示，还是也支持一个受部署配置控制的内部预览环境。
- 第一阶段需要标注的字段覆盖范围是只覆盖站点级字段，还是同步覆盖活动、公告、动态和加入页的主要结构化字段。
