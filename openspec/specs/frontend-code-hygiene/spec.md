## Purpose

Define maintainability and safety hygiene requirements for the Nuxt frontend of the public website, including shared formatting utilities, removal of dead code, and safe rich text link rendering.

## Requirements

### Requirement: 前端公共格式化逻辑应集中复用
前端公开页面 SHALL 将跨页面重复使用的日期、时间和内容展示格式化逻辑集中到共享工具中，页面组件 MUST NOT 为相同展示格式长期保留重复实现。

#### Scenario: 多个公开页面展示相同日期格式
- **WHEN** 首页、活动、公告或动态页面需要展示相同的日期格式
- **THEN** 系统 MUST 使用共享格式化工具生成展示文本
- **AND** 页面组件 MUST NOT 各自保留等价的本地日期格式化函数

#### Scenario: 格式化规则需要调整
- **WHEN** 站点需要调整公开日期展示格式
- **THEN** 维护者 MUST 能在共享格式化工具中完成主要规则调整
- **AND** 系统 MUST NOT 要求逐个修改多个重复页面函数

### Requirement: 前端代码不得保留无运行时作用的死代码
前端公开站点 SHALL 移除无引用、无运行时作用或已失效的数据导出、组件 refs 和占位语句。保留的代码 MUST 对当前功能、类型约束或可读性有明确作用。

#### Scenario: 组件中存在未使用的 ref 或 props 占位
- **WHEN** 组件变量不参与模板、计算逻辑、事件处理或类型约束
- **THEN** 系统 MUST 移除该变量或占位语句
- **AND** 类型检查 MUST 继续通过

#### Scenario: mock 数据导出不再被公开接口使用
- **WHEN** mock 导出已经没有引用且不属于开发 fallback 的有效入口
- **THEN** 系统 MUST 删除该失效导出
- **AND** 生产公开接口 MUST NOT 依赖该 mock 导出作为内容兜底

### Requirement: 富文本链接渲染必须限制危险协议
前端富文本渲染 SHALL 对链接文本和链接地址进行安全处理。系统 MUST 只将允许协议的链接渲染为可点击 `<a>`，并将不安全或无效链接作为普通文本处理。

#### Scenario: 富文本包含 http 或 https 链接
- **WHEN** 富文本正文包含 `http://` 或 `https://` 链接
- **THEN** 系统 MUST 将链接渲染为可点击链接
- **AND** 系统 MUST 对链接文本和 href 进行转义

#### Scenario: 富文本包含危险协议链接
- **WHEN** 富文本正文包含 `javascript:` 或其他未允许协议的链接
- **THEN** 系统 MUST NOT 输出可执行链接
- **AND** 系统 MUST 将该内容作为普通文本展示
