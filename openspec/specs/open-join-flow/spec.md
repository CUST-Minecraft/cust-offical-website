## Purpose

Define the public `/join` page as a long-term open joining guide, including flow-first content structure, process step capabilities, data boundaries, and FAQ expectations.

## Requirements

### Requirement: 加入页以流程引导为主
官网 SHALL 将 `/join` 页面呈现为长期开放加入的流程引导页。页面 MUST 以加入流程作为主体内容，并在流程后展示常见问题；参与身份、加入方式、规则说明、联系确认和加入后的开始方式 MUST 收敛到流程步骤中，而不是拆成多个独立宣传区块。

#### Scenario: 访问长期开放加入页
- **WHEN** 访问者打开 `/join`
- **THEN** 系统 MUST 展示页面标题、摘要、加入流程和常见问题
- **AND** 系统 MUST 不再将参与方向、加入条件、联系方式和服务器加入说明作为互相割裂的独立主体区块展示

#### Scenario: 流程步骤覆盖核心加入问题
- **WHEN** 访问者浏览加入流程
- **THEN** 系统 MUST 通过流程步骤说明可以以什么身份加入、通过什么方式加入、需要了解哪些规则、如何完成联系确认以及加入后如何开始参与

### Requirement: 流程步骤支持长期开放加入内容
加入流程 SHALL 面向长期开放加入场景组织内容。流程步骤 MUST 支持展示参与身份、加入方式、规则点和加入后的起步动作，并允许每一步配置可选图片、图片说明、明细条目和动作入口。

#### Scenario: 展示参与身份步骤
- **WHEN** 内容管理员在流程步骤中配置参与身份条目
- **THEN** 前台 MUST 能展示建筑共创、红石机制、活动策划、服务器协作、内容记录或轻松游玩等身份方向
- **AND** 这些方向 MUST 作为结构化条目展示，而不是要求内容管理员在 Markdown 中拼接列表

#### Scenario: 展示加入方式步骤
- **WHEN** 内容管理员在流程步骤中配置加入方式和动作入口
- **THEN** 前台 MUST 能展示 QQ 群、外部申请表、社团联系人或先查看活动等加入方式
- **AND** 前台 MUST 能展示可选主动作按钮并跳转到配置的外部入口或站内页面

#### Scenario: 展示步骤图片
- **WHEN** 内容管理员为流程步骤配置图片
- **THEN** 前台 MUST 在对应步骤中展示该图片
- **AND** 图片 MUST 使用规范化的 `{ src, alt }` 数据
- **AND** 图片说明为空时系统 MUST 仍可正常渲染步骤文本

### Requirement: 加入页不得收集或审核申请数据
官网 SHALL 仅提供公开加入引导和外部入口。系统 MUST NOT 在第一阶段通过 `/join` 页面收集申请人数据、保存联系方式、执行白名单审核或提供站内申请审核状态。

#### Scenario: 访问加入动作入口
- **WHEN** 访问者点击加入流程中的申请、群聊或联系入口
- **THEN** 系统 MUST 跳转到外部问卷、QQ 群说明、站内活动页或其它公开配置入口
- **AND** 系统 MUST NOT 要求访问者登录官网后才能继续

#### Scenario: 检查加入页数据边界
- **WHEN** 系统实现完成后检查公开接口和前端页面
- **THEN** 系统 MUST 不新增用于提交申请、查询审核状态或管理白名单的站内公开 API
- **AND** 系统 MUST 不在公开页面展示真实姓名、学号、手机号等敏感信息

### Requirement: 常见问题聚焦加入顾虑
加入页 FAQ SHALL 聚焦长期开放加入过程中会阻碍用户行动的问题。FAQ MUST 至少能够解释当前是否可加入、新手是否可加入、是否强制在线、是否需要白名单、公开资料隐私和遇到进服问题时的处理方式。

#### Scenario: 浏览常见问题
- **WHEN** 访问者查看加入页底部 FAQ
- **THEN** 系统 MUST 展示由 `JoinPage.faqItems` 维护的问题和答案
- **AND** FAQ 答案 MUST 使用普通文本字段展示，不依赖 Markdown 拼装页面结构
