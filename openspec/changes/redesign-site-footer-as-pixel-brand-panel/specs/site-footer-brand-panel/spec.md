## ADDED Requirements

### Requirement: 页尾展示像素风品牌面板
官网 SHALL 将全站页尾展示为与当前官网视觉一致的 Minecraft 像素风品牌面板。页尾 MUST 复用官网 Logo、社团中英文名称、深色像素纹理、像素边框和官网图标体系，不得复制参考站点的组织标识或使用与本站风格不一致的现代社交图标。

#### Scenario: 桌面端查看页尾
- **WHEN** 访问者在桌面端滚动到站点页尾
- **THEN** 系统 MUST 展示官网 Logo、`site.name` 和 `site.englishName`
- **AND** 系统 MUST 展示“外联”和“关于我们”两个链接栏目
- **AND** 系统 MUST 展示版权信息和署名信息
- **AND** 系统 MUST 使用与当前官网一致的 Minecraft 像素风视觉

#### Scenario: 检查页尾栏目数量
- **WHEN** 访问者查看页尾右侧链接区域
- **THEN** 系统 MUST 只展示“外联”和“关于我们”两个栏目
- **AND** 系统 MUST NOT 展示“资料”栏目或资源下载栏目

### Requirement: 页尾链接使用结构化站点配置
官网 SHALL 从公开站点配置读取结构化页尾链接数据。`GET /api/public/settings` 响应中的 `site` MUST 包含页尾外联链接和页尾关于我们链接，链接项 MUST 至少支持展示名称、跳转地址、图标键、外链标记和禁用态。

#### Scenario: 公开设置接口返回页尾链接
- **WHEN** 访问者或前端请求 `GET /api/public/settings`
- **THEN** 响应数据中的 `site` MUST 包含 `footerExternalLinks` 和 `footerAboutLinks`
- **AND** 每个链接项 MUST 包含 `label` 和 `href`
- **AND** 系统 MUST 支持每个链接项通过 `icon`、`external` 和 `disabled` 表达图标、外链行为和禁用态

#### Scenario: 页尾渲染站内和站外链接
- **WHEN** 页尾渲染一个 `external` 为 true 的链接项
- **THEN** 系统 MUST 使用外部链接行为打开该地址
- **AND** 链接 MUST 使用 `target="_blank"` 和 `rel="noopener noreferrer"`
- **WHEN** 页尾渲染一个 `external` 不为 true 的链接项
- **THEN** 系统 MUST 使用站内导航行为打开该地址

#### Scenario: 页尾处理禁用链接
- **WHEN** 页尾链接项的 `disabled` 为 true
- **THEN** 系统 MUST 展示不可用状态
- **AND** 系统 MUST NOT 触发站内跳转或外部跳转

### Requirement: 外联栏目首期展示 MUA 官网入口
官网 SHALL 在页尾“外联”栏目中展示“MUA 官网”入口。该入口 MUST 作为公开外部链接处理，并从页尾外联链接配置中读取。

#### Scenario: 查看外联栏目
- **WHEN** 访问者查看页尾“外联”栏目
- **THEN** 系统 MUST 展示“MUA 官网”链接
- **AND** 系统 MUST 将该链接作为外部链接处理
- **AND** 系统 MUST NOT 要求访问者登录官网或进入社员中心

#### Scenario: 点击 MUA 官网入口
- **WHEN** 访问者点击页尾“MUA 官网”入口
- **THEN** 系统 MUST 打开配置的 MUA 官网 URL
- **AND** 系统 MUST NOT 代理、嵌入、抓取或管理 MUA 官网内容

### Requirement: 关于我们栏目展示站内社团入口
官网 SHALL 在页尾“关于我们”栏目中展示站内社团信息入口。该栏目 MUST 使用结构化页尾关于我们链接配置，并且链接行为 MUST 保持在官网内部导航。

#### Scenario: 查看关于我们栏目
- **WHEN** 访问者查看页尾“关于我们”栏目
- **THEN** 系统 MUST 展示至少一个站内社团信息入口
- **AND** 系统 MUST 包含社团介绍、社团活动或加入我们等公开页面入口

#### Scenario: 点击关于我们入口
- **WHEN** 访问者点击页尾“关于我们”栏目的站内入口
- **THEN** 系统 MUST 在官网内导航到对应公开页面
- **AND** 系统 MUST NOT 打开外部系统或要求官网登录

### Requirement: 页尾适配移动端并避让悬浮服务入口
页尾 SHALL 在移动端保持可读、可点按且不横向溢出。新的页尾高度 MUST 不破坏右下角“社团服务”触发器的页尾避让行为。

#### Scenario: 移动端查看页尾
- **WHEN** 访问者在移动端视口滚动到页尾
- **THEN** 系统 MUST 以单列或等价移动端布局展示品牌区、图标入口、链接栏目和版权信息
- **AND** 页尾内容 MUST NOT 横向溢出视口
- **AND** 链接文字和图标 MUST 保持可读可点按

#### Scenario: 页尾出现时查看社团服务触发器
- **WHEN** 访问者滚动到页尾区域且右下角“社团服务”触发器可见
- **THEN** 社团服务触发器 MUST 保持在页尾内容上方
- **AND** 社团服务触发器 MUST NOT 遮挡“MUA 官网”、关于我们链接、版权信息或署名信息

### Requirement: 项目文档反映新版页尾模型
项目文档 SHALL 描述新版页尾品牌面板、页尾链接数据模型和 MUA 官网外联入口。文档 MUST 将页尾外部链接描述为公开外链引导，不得暗示官网代理、嵌入或管理外部系统业务数据。

#### Scenario: 检查需求与设计文档
- **WHEN** 变更实现完成后检查 `docs/产品需求文档.md`、`docs/总体设计文档.md` 和 `docs/详细设计文档.md`
- **THEN** 文档 MUST 描述新版页尾的品牌区、“外联”和“关于我们”栏目
- **AND** 文档 MUST 描述 `SiteSettings` 中的结构化页尾链接字段
- **AND** 文档 MUST 将“MUA 官网”描述为公开外部链接

#### Scenario: 检查 Strapi 模型说明
- **WHEN** 变更实现完成后检查 `strapi-models/README.md` 和 `strapi-models/模型说明.md`
- **THEN** 文档 MUST 描述页尾链接字段或组件
- **AND** 文档 MUST 明确新版页尾不再依赖 `socials: string[]` 作为链接渲染来源
