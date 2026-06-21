## ADDED Requirements

### Requirement: 社团介绍页使用五段式品牌故事结构
官网 SHALL 将 `/about` 社团介绍页组织为五段式品牌故事结构，依次展示 `认识我们`、`我们的起点`、`我们的行动`、`我们的方向` 和 `继续了解`。每个页面板块 MUST 对应 `AboutPage.sections` 中的一条结构化 section 数据。页面 MUST 保持长春理工大学 Minecraft 社团身份清晰，并使用与全站一致的 Minecraft / 方块 / 像素风视觉。

#### Scenario: 访问社团介绍页
- **WHEN** 访问者打开 `/about`
- **THEN** 系统 MUST 先展示社团身份、页面摘要和头图
- **AND** 系统 MUST 按顺序展示 `认识我们`、`我们的起点`、`我们的行动`、`我们的方向` 和 `继续了解`
- **AND** 每个板块 MUST 从 `AboutPage.sections` 中对应的 `sectionType` 读取标题、摘要、正文、卡片或链接内容
- **AND** 系统 MUST NOT 将独立服务器参数区或独立加入流程区作为页面主段落

### Requirement: 我们的起点承载社团故事正文
社团介绍页 SHALL 使用 `sectionType` 为 `origin` 的 section 表达社团起点与创立语境。该 section 的正文内容 MUST 作为主要阅读内容展示，说明社团如何从 Minecraft 兴趣延伸到校园记忆、创作和朋友。

#### Scenario: 查看社团起点
- **WHEN** 访问者浏览 `我们的起点`
- **THEN** 系统 MUST 展示 `origin` section 的正文
- **AND** 正文 MUST 以可阅读的富文本或 Markdown 渲染
- **AND** 页面 MUST NOT 要求内容管理员通过正文手动拼装后续行动卡片、分组卡片或站内入口按钮

### Requirement: 我们的行动展示三类社团行动
社团介绍页 SHALL 在 `我们的行动` 中展示社团正在共同创造的核心内容。该栏目 MUST 从 `sectionType` 为 `actions` 的 section items 读取行动卡片。该栏目 MUST 至少包含校园复刻、服务器共建、活动与创作三类行动，并用面向访客的中文短文案解释每类行动。

#### Scenario: 查看社团行动
- **WHEN** 访问者浏览 `我们的行动`
- **THEN** 系统 MUST 展示校园复刻、服务器共建、活动与创作
- **AND** 每个行动 MUST 有标题和摘要
- **AND** 每个行动 MUST 来自 `actions` section 的结构化 item，而不是前端写死或正文富文本
- **AND** 服务器共建 MUST 作为社团行动语境展示，而不是展示 IP、版本、模式等连接参数

### Requirement: 我们的方向展示参与方向
社团介绍页 SHALL 在 `我们的方向` 中展示社团主要参与方向。该栏目 MUST 从 `sectionType` 为 `directions` 的 section items 读取方向卡片。该栏目 MUST 支持建筑、红石、活动、运维等方向内容，并强调访问者可以从感兴趣的方向了解社团，而不是把方向呈现为强制组织归属。

#### Scenario: 查看参与方向
- **WHEN** 访问者浏览 `我们的方向`
- **THEN** 系统 MUST 展示主要方向名称和简介
- **AND** 系统 MUST 使用 `directions` section 的结构化 item 作为方向内容来源
- **AND** 页面文案 MUST 避免暗示访问者必须立即选择固定分组才能了解或加入社团

### Requirement: 继续了解提供公开站内出口
社团介绍页 SHALL 在末尾展示 `继续了解` 出口，引导访问者前往更具体的公开页面。该栏目 MUST 从 `sectionType` 为 `next` 的 section links 读取入口。该栏目 MUST 至少提供加入我们、社团活动和社员介绍三个站内入口。

#### Scenario: 查看继续了解出口
- **WHEN** 访问者浏览社团介绍页末尾
- **THEN** 系统 MUST 展示指向 `/join`、`/activities` 和 `/members` 的入口
- **AND** 每个入口 MUST 有清晰的中文标签
- **AND** 每个入口 MUST 来自 `next` section 的结构化 link
- **AND** 系统 MUST 使用站内导航跳转，不得依赖正文 Markdown 链接列表拼装这些入口

### Requirement: 社团介绍页保持公开内容与隐私边界
社团介绍页 SHALL 只展示公开社团介绍信息、公开分组方向和公开站内入口。页面 MUST NOT 展示真实姓名、学号、手机号等敏感信息，MUST NOT 引入登录态或内部成员服务。

#### Scenario: 检查公开页面边界
- **WHEN** 系统渲染 `/about`
- **THEN** 页面 MUST 可由游客直接访问
- **AND** 页面 MUST NOT 要求登录
- **AND** 页面 MUST NOT 展示真实姓名、学号、手机号或内部管理入口
