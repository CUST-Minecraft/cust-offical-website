## Context

内容字段提示入口由 `frontend/components/FieldHintOverlay.vue` 渲染，当前按钮位于右下角社团服务入口上方，包含钻石镐图标和“维护模式”文字。按钮已经通过 `useFloatingFooterOffset()` 获取页尾可见高度，并使用 CSS 变量 `--floating-footer-offset` 做页尾避让。

右下角同时承担社团服务工作台入口。维护提示入口只面向维护/预览场景，不需要与社团服务形成主次堆叠；将它移动到左下角并收敛为图标按钮，可以降低右下角拥挤感，也让维护入口更像独立工具开关。

相关文档中，`docs/产品需求文档.md` 和 `openspec/specs/content-field-hints/spec.md` 仍描述为“社团服务按钮上方”的维护模式按钮；`docs/详细设计文档.md` 也需要同步为左下角 icon-only 正方形按钮。

## Goals / Non-Goals

**Goals:**

- 将字段提示入口固定到页面左下角。
- 将按钮改为仅显示 SVG 图标，不显示“维护模式”文字。
- 让按钮宽高均等于社团服务按钮高度：桌面端 54px，移动端 50px。
- 保持现有字段提示开关行为、开启态反馈、访问控制、hover/click 字段提示逻辑和可访问性名称。
- 复用现有页尾避让机制，让维护按钮和社团服务按钮在页尾出现时以同一底部偏移抬升。
- 重画维护按钮 SVG，使钻石镐在小尺寸按钮内更清晰、更符合现有像素 UI。

**Non-Goals:**

- 不新增维护模式数据字段、公开 API、Strapi content-type 或权限判断。
- 不改变字段提示气泡、字段 outline、click 固定或 hover 展示逻辑。
- 不改变右下角社团服务工作台的功能、面板布局或服务状态逻辑。
- 不把维护入口暴露给普通生产访问者。

## Decisions

### Decision 1: 复用 `useFloatingFooterOffset()`，不新增避让算法

维护入口和社团服务入口都应在页尾出现时抬升。现有 `FieldHintOverlay.vue` 已经使用 `useFloatingFooterOffset()`，因此实现时只需要让 `.field-hint-toggle` 的 `bottom` 与 `.floating-service-status` 使用同一类公式：桌面端以 34px 为基础，移动端以 16px 为基础，并与 `--floating-footer-offset` 取较大值。

替代方案是为左下角按钮再写一套 IntersectionObserver 或滚动计算。该方案会增加重复逻辑，也容易让左右按钮在页尾附近出现不同步的跳动。

### Decision 2: 维护入口使用正方形 icon-only 按钮

按钮宽度和高度都绑定到 `--field-hint-toggle-height`，桌面端为 54px，移动端为 50px。模板中移除可见文字，只保留 `<img>` 图标；按钮继续保留 `aria-label="切换维护模式"` 和 `aria-pressed`，确保无文字界面仍可被辅助技术理解。

替代方案是保留 184px 宽的文字按钮并移动到左下角。该方案更显眼，但维护入口不是普通访问者的核心动作，占据空间过大，也不符合“仅使用 SVG 图标”的目标。

### Decision 3: SVG 资源保持路径不变但重画内容

继续使用 `/example-assets/maintenance-pickaxe.svg`，避免修改组件资源路径。SVG 内容重画为钻石镐主体，使用像素网格、深色描边、青蓝钻石高光和木质握柄，让 34px/30px 图标槽中仍能看出“钻石镐”轮廓。

替代方案是新增一个新资源名并替换引用。该方案更显式，但本次没有多套图标共存需求，保留路径更利于小范围变更。

### Decision 4: 文档同步只更新字段提示入口描述

本次改变的是维护/预览工具入口的用户可见行为，不改变接口、数据模型或权限边界。文档同步应集中在 `docs/产品需求文档.md` 与 `docs/详细设计文档.md` 中关于字段提示入口位置、文案和尺寸的句子；`docs/开发规范文档.md` 的 overlay 非布局要求仍然适用，不需要扩写。

## Risks / Trade-offs

- [左下角与其他浮动入口冲突] -> 当前全局浮动入口主要在右下角；实现后需要用桌面和移动端视口检查左下角没有遮挡核心页面内容。
- [icon-only 降低可发现性] -> 维护入口只面向允许字段提示的维护/预览场景，保留 `aria-label`、`title` 或等价可访问性名称，并通过钻石镐图标和开启态反馈表达用途。
- [页尾避让高度不同步] -> 直接复用 `useFloatingFooterOffset()` 和同一底部偏移规则，验证滚动到页尾时左右按钮高度一致。
- [SVG 小尺寸识别度不足] -> 重画图标时优先保证 50px/54px 按钮内的轮廓、描边和高亮，不追求复杂细节。
