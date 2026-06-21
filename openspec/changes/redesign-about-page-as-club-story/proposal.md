## Why

当前 `/about` 社团介绍页已经具备 Hero、正文、分组和服务器概览，但页面更像信息拼接：服务器参数和加入引导占据后半段，弱化了“社团介绍”作为品牌故事入口的作用。需要将页面重新组织为清晰的社团故事线，让访客先理解长春理工大学 Minecraft 社团的身份、起点、行动和参与方向，再选择继续了解。

本变更承接 `docs/产品需求文档.md` 与 `docs/详细设计文档.md` 对社团介绍页的定位，但会调整页面叙事重点：弱化独立服务器概览区，将 `/about` 从“服务器说明 + 加入引导”转为“社团品牌故事 + 多出口继续了解”。相关 docs 需要同步更新，避免文档仍要求服务器概览和加入引导作为页面主段落。

## What Changes

- 将 `/about` 页面重设计为五段式社团故事结构：`认识我们`、`我们的起点`、`我们的行动`、`我们的方向`、`继续了解`。
- 保留社团标题、摘要、头图、社团介绍正文和主要分组内容，但重排呈现方式，使其服务于品牌故事线。
- 将“校园复刻 / 服务器共建 / 活动与创作”作为“我们的行动”核心内容，替代原先偏工具化的服务器概览主段落。
- 将建筑、红石、活动、运维等分组作为“我们的方向”，强调参与入口和共创方向，而不是组织架构说明。
- 移除 `/about` 页面中的独立“加入我们”叙事段和服务器参数展示；页面末尾改为“继续了解”，提供加入我们、社团活动、社员介绍等下一步入口。
- 同步更新产品需求与详细设计文档中关于社团介绍页的页面目标、功能说明和数据职责。
- 不改变公开路由 `/about`、公开接口路径 `GET /api/public/about`、第一阶段系统边界或敏感信息规则。

## Capabilities

### New Capabilities
- `about-page-club-story`: 定义社团介绍页的五段式品牌故事结构、栏目职责、服务器信息降级规则和继续了解出口。

### Modified Capabilities
- `content-model-boundaries`: 明确社团介绍页正文、行动内容、分组内容和继续了解入口的结构化/富文本边界，避免把服务器参数或加入流程强塞进 `/about` 主叙事。

## Impact

- Affected frontend: `frontend/pages/about/index.vue`、相关样式、现有通用组件复用方式。
- Affected API/data adaptation: `GET /api/public/about` 返回结构原则上保持兼容；如实现需要新增轻量展示字段，应同步更新 `frontend/types/content.ts`、mock 数据、Strapi 模型和适配逻辑。
- Affected CMS model: `AboutPage` 可能需要补充可维护的行动条目或继续了解入口；若实现选择静态配置，则必须说明其不是内容管理员维护字段。
- Affected docs: `docs/产品需求文档.md`、`docs/详细设计文档.md` 需要同步社团介绍页的新结构和数据职责。
- Affected specs: 新增 `about-page-club-story`，并修改 `content-model-boundaries`。
- No new external dependencies, no new authentication, no private member data exposure, no self-hosted backend expansion.
