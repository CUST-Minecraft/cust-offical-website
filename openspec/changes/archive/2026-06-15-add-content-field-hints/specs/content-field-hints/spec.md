## ADDED Requirements

### Requirement: 字段提示入口使用社团服务按钮上方的 Minecraft 风格维护模式按钮
官网 SHALL 在允许维护提示的环境中提供固定在社团服务按钮上方的“维护模式”按钮，用于开启或关闭内容字段提示模式。该按钮 MUST 使用与官网一致的 Minecraft 像素风视觉和钻石镐风格图标，MUST 与社团服务按钮保持相同宽度、高度、图标槽尺寸和页尾避让行为，并且 MUST 是维护人员触发字段提示模式的唯一入口。

#### Scenario: 默认不显示字段标注
- **WHEN** 维护人员或访问者打开官网页面且未开启字段提示模式
- **THEN** 系统 MUST 按正常页面展示内容
- **AND** 系统 MUST NOT 显示字段 outline、字段气泡或页面内字段说明文字

#### Scenario: 点击维护模式按钮
- **WHEN** 维护人员点击社团服务按钮上方的“维护模式”按钮
- **THEN** 系统 MUST 切换字段提示模式的开启或关闭状态
- **AND** 按钮 MUST 通过 Minecraft 风格开启态视觉反馈当前模式状态

#### Scenario: 普通访问者不可见维护入口
- **WHEN** 普通生产访问者打开官网页面
- **THEN** 系统 MUST NOT 展示“维护模式”按钮
- **AND** 系统 MUST NOT 允许普通访问者看到字段提示气泡

### Requirement: 字段标注不得影响页面布局
字段提示层 SHALL 通过悬浮层、outline、box-shadow 或等价非布局方式标注字段。系统 MUST NOT 通过向原页面内容追加字段名、插入可见内联说明、增加影响布局的边框或改变原 DOM 文本流来实现字段提示。

#### Scenario: Header 品牌字段被标注
- **WHEN** 字段提示模式开启且 Header 品牌字段可被标注
- **THEN** 系统 MUST 保持 Header 原有高度、列宽、文字换行和按钮位置
- **AND** 系统 MUST 只通过不参与布局的视觉层标识该字段

#### Scenario: 字段气泡悬浮显示
- **WHEN** 维护人员 hover 一个可维护字段
- **THEN** 系统 MUST 在页面上方或 body 级 overlay 中显示字段气泡
- **AND** 该气泡 MUST NOT 改变原字段元素的宽度、高度、行高或相邻元素位置

### Requirement: 字段气泡展示维护人员所需的最小信息
字段气泡 SHALL 面向内容维护人员展示简短字段说明。气泡内容 MUST 包含数据模型、字段名称和页面用途，MUST NOT 默认展示 API 路径、响应 path、Vue 组件名或网络调用细节。

#### Scenario: 查看站点短名称字段
- **WHEN** 维护人员在字段提示模式中 hover Header 品牌名对应字段
- **THEN** 系统 MUST 显示数据模型为“站点设置（site-setting）”
- **AND** 系统 MUST 显示字段名称为 `shortName` 或对应实际字段
- **AND** 系统 MUST 显示页面用途为“Header 品牌名”或等价维护说明

#### Scenario: 查看外部服务入口字段
- **WHEN** 维护人员在字段提示模式中 hover 皮肤站入口名称或相关可维护字段
- **THEN** 系统 MUST 显示该字段来自外部服务模型
- **AND** 系统 MUST 显示字段名称和页面用途

### Requirement: 字段气泡支持 hover 查看和 click 固定
字段提示模式 SHALL 支持 hover 临时查看字段信息，并支持 click 固定当前字段气泡，方便维护人员对照后台修改内容。

#### Scenario: Hover 临时查看字段
- **WHEN** 维护人员将鼠标悬停在可维护字段上
- **THEN** 系统 MUST 显示该字段的 outline 和气泡
- **AND** 鼠标离开后系统 MUST 取消临时气泡，除非该字段已被固定

#### Scenario: Click 固定字段气泡
- **WHEN** 维护人员点击一个可维护字段
- **THEN** 系统 MUST 固定该字段的气泡
- **AND** 维护人员移动鼠标时固定气泡 MUST 保持可见，直到取消固定或关闭字段提示模式

#### Scenario: 关闭字段提示模式清理状态
- **WHEN** 维护人员再次点击“维护模式”按钮关闭字段提示模式
- **THEN** 系统 MUST 隐藏所有字段 outline 和气泡
- **AND** 系统 MUST 清除当前固定字段状态
