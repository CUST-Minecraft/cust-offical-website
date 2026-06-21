## Purpose

Define the public document center service entry for the CUST Minecraft website. The capability covers its placement in the community services workbench, external URL behavior, disabled state, bookshelf-style icon, and search discoverability.

## Requirements

### Requirement: 快捷工具展示文档中心入口
官网 SHALL 在全站社团服务工作台中展示“文档中心”独立服务入口，并且该入口 MUST 位于“悦灵助手”入口上方。文档中心入口 MUST 作为外部服务展示，而不是作为站内服务、服务状态或面板级状态入口展示。

#### Scenario: 打开社团服务工作台
- **WHEN** 访问者打开官网社团服务工作台
- **THEN** 系统 MUST 在左侧服务列表中展示“文档中心”入口
- **AND** 系统 MUST 将“文档中心”展示在“悦灵助手”上方
- **AND** 系统 MUST 将“文档中心”作为独立外部服务展示，而不是作为服务状态条目展示

#### Scenario: 选择文档中心入口
- **WHEN** 访问者在左侧服务列表选择“文档中心”
- **THEN** 系统 MUST 将“文档中心”标记为当前选中服务
- **AND** 系统 MUST 在右侧栏位展示文档中心的外部系统说明和跳转区域
- **AND** 系统 MUST NOT 因选择左侧入口而直接打开外部文档中心页面

#### Scenario: 统计社团服务入口数量
- **WHEN** 社团服务触发器汇总服务入口数量
- **THEN** 系统 MUST 将“文档中心”计入服务入口数量
- **AND** 系统 MUST NOT 将面板级服务状态入口计入该数量

### Requirement: 文档中心使用外部 URL 跳转
官网 SHALL 从外部服务模型读取文档中心外部 URL。配置 URL 且服务启用时，文档中心右侧跳转按钮 MUST 以外部链接方式打开该 URL。

#### Scenario: 点击已配置的文档中心跳转按钮
- **WHEN** `key` 为 `docs` 的外部服务已启用且 URL 已配置
- **AND** 访问者点击右侧“打开文档中心”跳转按钮
- **THEN** 系统 MUST 在新标签页打开配置的文档中心 URL
- **AND** 系统 MUST 使用 `noopener noreferrer` 或等价方式隔离外部页面

#### Scenario: 公开外部服务接口返回文档中心配置
- **WHEN** 前端请求公开外部服务数据
- **THEN** 响应数据 MUST 包含可公开展示的文档中心服务配置
- **AND** 文档中心服务配置 MUST 包含名称、URL、启用状态、图标和展示位置

#### Scenario: 公开设置接口不再作为文档中心 URL 的长期来源
- **WHEN** 前端请求 `GET /api/public/settings`
- **THEN** 响应数据中的 `site` MUST NOT 作为文档中心 URL 的长期权威来源
- **AND** 前端 MUST 使用外部服务数据决定文档中心跳转与禁用态

### Requirement: 未配置 URL 时展示禁用态
当文档中心外部服务未启用、URL 未配置或服务配置缺失时，官网 SHALL 继续在社团服务工作台中展示文档中心服务入口，但入口和右侧跳转动作 MUST 呈现禁用态且不可跳转。

#### Scenario: URL 未配置时查看社团服务工作台
- **WHEN** `key` 为 `docs` 的外部服务 URL 为空或缺失并且访问者打开社团服务工作台
- **THEN** 系统 MUST 展示“文档中心”禁用态服务入口
- **AND** 系统 MUST 在右侧栏位清楚标识该入口暂不可用或未配置
- **AND** 系统 MUST NOT 跳转到空 URL、当前页面、`/member` 或其他占位路由

#### Scenario: 服务未启用时查看社团服务工作台
- **WHEN** `key` 为 `docs` 的外部服务未启用并且访问者打开社团服务工作台
- **THEN** 系统 MUST 展示“文档中心”禁用态或按展示策略隐藏该入口
- **AND** 系统 MUST NOT 打开外部文档中心 URL

#### Scenario: 点击禁用态文档中心跳转按钮
- **WHEN** 访问者点击或聚焦禁用态“文档中心”跳转按钮
- **THEN** 系统 MUST NOT 打开新页面
- **AND** 系统 MUST 保持当前页面状态稳定

### Requirement: 文档中心图标符合书架方块像素风
文档中心服务入口 SHALL 使用书架方块风格的 SVG 图标。图标 MUST 与社团服务工作台视觉保持一致，并且不得使用现代文档、文件夹或下载图标隐喻。

#### Scenario: 查看文档中心图标
- **WHEN** 访问者查看社团服务工作台中的“文档中心”入口
- **THEN** 系统 MUST 展示以书架方块为基础的像素风图标
- **AND** 图标 MUST 具备木质顶面、深色像素描边、层板和多色书脊特征
- **AND** 图标 MUST NOT 包含文字、文件夹、下载箭头或现代文档页图形

#### Scenario: URL 未配置时查看图标
- **WHEN** 文档中心入口处于禁用态
- **THEN** 系统 MUST 让图标和入口整体呈现禁用视觉
- **AND** 系统 MUST 保持图标仍可识别为书架

### Requirement: 搜索浮层可发现文档中心
官网 SHALL 在全站搜索浮层中提供“文档中心”的快捷结果，使访问者可以通过搜索发现该外部入口。搜索结果 MUST 使用外部服务模型中的文档中心配置。文档中心搜索结果 MUST NOT 要求搜索浮层在普通公开页面首屏预加载完整内容索引。

#### Scenario: 搜索文档中心
- **WHEN** 访问者打开搜索浮层并输入“文档中心”或相关关键词
- **THEN** 系统 MUST 提供“文档中心”快捷结果

#### Scenario: 搜索结果打开已配置的文档中心
- **WHEN** `key` 为 `docs` 的外部服务已启用且 URL 已配置
- **AND** 访问者选择搜索结果
- **THEN** 系统 MUST 打开配置的外部文档中心 URL

#### Scenario: 搜索结果处理未配置的文档中心
- **WHEN** 文档中心外部服务未启用、URL 未配置或服务配置缺失
- **THEN** 系统 MUST NOT 将访问者跳转到空 URL、当前页面、`/member` 或其他占位路由

#### Scenario: 未打开搜索时不预加载文档中心搜索索引
- **WHEN** 访问者打开公开页面但尚未打开搜索浮层
- **THEN** 系统 MUST NOT 为了文档中心搜索结果而预加载完整搜索内容索引
- **AND** 系统 MUST 仍在搜索浮层打开后使用外部服务模型数据提供文档中心快捷结果
