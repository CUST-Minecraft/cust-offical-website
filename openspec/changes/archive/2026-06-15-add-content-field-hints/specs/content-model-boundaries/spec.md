## ADDED Requirements

### Requirement: 前台字段提示映射内容模型
官网 SHALL 为内容维护辅助层提供可维护字段到 Strapi 内容模型的轻量映射。该映射 MUST 反映现有内容模型边界，帮助维护人员理解前台内容应在后台哪个数据模型和字段中修改，但 MUST NOT 改变 `site-setting`、`external-service`、`maintenance-page` 或其他内容模型的职责。

#### Scenario: 站点基础字段映射到 site-setting
- **WHEN** 字段提示模式标注站点名称、短名称、英文名、Logo、导航、页脚版权或页脚关于我们链接
- **THEN** 系统 MUST 将这些字段说明为来自站点设置模型
- **AND** 系统 MUST 显示对应字段名称和页面用途

#### Scenario: 外部服务入口映射到 external-service
- **WHEN** 字段提示模式标注皮肤站、文档中心、MUA 官网或其他外部服务入口
- **THEN** 系统 MUST 将这些字段说明为来自外部服务模型
- **AND** 系统 MUST NOT 暗示这些字段属于 `site-setting`

#### Scenario: 维护页字段映射到 maintenance-page
- **WHEN** 字段提示模式标注维护页标题、维护说明、预计恢复时间或服务状态条目
- **THEN** 系统 MUST 将这些字段说明为来自维护页模型
- **AND** 系统 MUST 显示对应字段名称和页面用途

#### Scenario: 字段提示不改变内容模型职责
- **WHEN** 系统实现字段提示能力
- **THEN** 系统 MUST NOT 新增用于字段提示的 Strapi content-type
- **AND** 系统 MUST NOT 为字段提示修改现有公开内容模型字段
- **AND** 系统 MUST NOT 改变 Nuxt BFF 公开数据契约
