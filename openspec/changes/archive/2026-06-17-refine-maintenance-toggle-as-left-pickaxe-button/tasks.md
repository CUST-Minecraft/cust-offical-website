## 1. 文档与现状确认

- [x] 1.1 阅读 `docs/产品需求文档.md`、`docs/详细设计文档.md` 和 `docs/开发规范文档.md` 中关于内容字段提示、维护模式按钮、社团服务按钮、页尾避让和非布局 overlay 的现有描述。
- [x] 1.2 阅读 `frontend/components/FieldHintOverlay.vue`、`frontend/assets/css/main.css`、`frontend/composables/use-floating-footer-offset.ts` 和 `frontend/components/FloatingServiceStatus.vue`，确认当前维护按钮结构、社团服务按钮高度和页尾避让实现。
- [x] 1.3 更新 `docs/产品需求文档.md`，将字段提示入口描述从社团服务按钮上方的文字按钮调整为左下角 icon-only 维护模式按钮。
- [x] 1.4 更新 `docs/详细设计文档.md`，明确维护按钮左下角固定、仅展示钻石镐 SVG、宽高等于社团服务按钮高度，并复用同等页尾避让行为。

## 2. 维护按钮结构与行为

- [x] 2.1 更新 `frontend/components/FieldHintOverlay.vue`，移除按钮内“维护模式”可见文字，仅保留 SVG 图标。
- [x] 2.2 保留维护按钮的 `aria-label`、`aria-pressed`、点击切换逻辑和字段提示模式状态清理逻辑。
- [x] 2.3 确认普通生产访问者仍不可见维护入口，且字段提示层不会新增公开 API 或改变现有数据契约。

## 3. 左下角布局与图标视觉

- [x] 3.1 更新 `frontend/assets/css/main.css`，将 `.field-hint-toggle` 从右下角上方堆叠改为左下角固定。
- [x] 3.2 将维护按钮调整为正方形：桌面端宽高 54px，移动端宽高 50px，按钮高度与当前视口下社团服务按钮高度一致。
- [x] 3.3 调整 `.field-hint-toggle` 的 `bottom` 公式，使其与 `.floating-service-status` 使用一致的页尾避让高度。
- [x] 3.4 调整维护按钮 icon slot、padding、hover/focus/开启态样式，确保 icon-only 状态下视觉居中、可点击且不显得空。
- [x] 3.5 重画 `frontend/public/example-assets/maintenance-pickaxe.svg`，以钻石镐为基础，保持像素风、深色描边、青蓝钻石材质和小尺寸可识别性。

## 4. 验证与回归

- [x] 4.1 运行前端类型检查或构建命令，确认组件模板和样式引用无错误。
- [x] 4.2 在桌面端检查维护按钮位于左下角，按钮仅显示 SVG 图标，宽高为 54px，并且右下角社团服务按钮不受影响。
- [x] 4.3 在移动端检查维护按钮位于左下角，按钮仅显示 SVG 图标，宽高为 50px，且不横向溢出或遮挡核心内容。
- [x] 4.4 滚动到页尾检查维护按钮和社团服务按钮以同一页尾避让高度抬升，维护按钮不遮挡页尾链接、版权或署名信息。
- [x] 4.5 开启和关闭字段提示模式，确认 hover/click 字段提示、开启态反馈和关闭清理行为保持不变。
