## Context

当前全站页尾由 `SiteFooter.vue` 渲染，数据来自 `SiteInfo` 中的 `socials: string[]`、`copyright` 和 `credit`。这套结构适合简短落款，但无法表达真实外部链接、链接图标、站内/站外行为，也无法支撑“外联 / 关于我们”两栏式官网页尾。

现有视觉系统已经具备深板岩纹理、石质面板、草方块高亮、像素按钮、官网 Logo 和若干 SVG 图标。页尾改版应复用这些资源，参考燕山大学 Minecraft 社团页尾的结构秩序，而不是复制其内容、校徽或黑白极简图标风格。

现有 docs 已将官网定义为公开展示、公开内容聚合和外部服务引导系统。皮肤站、文档中心和新增的 MUA 官网都应保持公开外链定位，官网不代理、不嵌入、不登录校验、不管理外部系统业务数据。

## Goals / Non-Goals

**Goals:**
- 将页尾改造成与当前官网一致的 Minecraft 像素风品牌面板。
- 在页尾右侧只展示“外联”和“关于我们”两栏。
- 用结构化数据模型表达页尾链接，支持 label、href、icon、external、disabled 等行为。
- 外联栏首期展示一个“MUA 官网”外部链接，后续可继续追加外联项。
- 保持社团服务悬浮触发器在新页尾高度下仍能避让页尾。
- 同步更新 docs 和 Strapi 模型说明，让内容模型、公开接口和页面行为一致。

**Non-Goals:**
- 不接入 MUA 官网 API，不抓取或展示 MUA 内容。
- 不使用 MUA 或其他外部组织的 Logo 作为本站图标资源。
- 不新增下载分发、官网登录、社员中心、外部系统代理或权限判断。
- 不重做 Header、社团服务工作台、搜索浮层或全站导航结构。

## Decisions

### Decision 1: 新增结构化页尾链接，而不是继续复用 `socials: string[]`

新增可序列化到公开设置接口的 `FooterLink` 结构：

```ts
interface FooterLink {
  label: string
  href: string
  icon?: 'skin' | 'docs' | 'mua' | 'about' | 'join' | 'activity' | 'member' | 'external'
  external?: boolean
  disabled?: boolean
}
```

`SiteInfo` 增加 `footerExternalLinks` 和 `footerAboutLinks`。Strapi 侧新增可复用 component，例如 `shared.footer-link`，并在 `SiteSettings` 中增加 repeatable 字段。旧 `socials` 字段可在本次前端页尾中停止使用，但不需要立刻删除，以降低 CMS 迁移风险；文档中应标记它不再承担新版页尾链接职责。

替代方案是把 `socials` 改成 JSON 对象数组。该方案改动更少，但字段名语义已经偏“社交账号”，无法清楚表达 MUA 官网、站内关于我们链接和禁用态。

### Decision 2: 页尾布局采用“品牌区 + 两栏链接 + 底部落款”

桌面端页尾使用三块信息：

```text
┌────────────────────────────────────────────────────────────┐
│ 品牌区                                  外联       关于我们 │
│ Logo + 中英文名称                      MUA 官网    社团介绍 │
│ 官网图标按钮                                      社团活动 │
│                                                加入我们   │
├────────────────────────────────────────────────────────────┤
│ copyright / credit                                      备案 │
└────────────────────────────────────────────────────────────┘
```

品牌区复用 `site.logoImage`、`site.name`、`site.englishName`。右侧链接栏使用 `footerExternalLinks` 和 `footerAboutLinks`，外链使用普通 `<a>` 并加 `target="_blank"` 与 `rel="noopener noreferrer"`，站内链接使用 `NuxtLink`。移动端改为单列堆叠，品牌、图标、链接栏目和版权保持可读，不横向溢出。

替代方案是完全照参考图做大面积黑白文字矩阵。该方案参考感更强，但会削弱当前官网已经形成的像素 UI 语言。

### Decision 3: 图标使用官网图标映射

页尾图标通过 icon key 映射到现有官网图标资源或同一风格的本地资源，例如：
- `skin` -> `login-portal-obsidian.svg`
- `docs` -> `bookshelf-docs.svg`
- `mua` / `external` -> 复用官网服务/工作台类像素图标，或新增同风格本地图标
- `about` / `join` / `activity` -> 使用现有官网像素图标体系，不使用第三方社交 icon set

外部组织链接不默认使用对方 Logo，避免版权、清晰度和风格不一致问题。

### Decision 4: MUA 官网作为可配置外链，不写死业务逻辑

mock 数据和 Strapi 初始化数据可以配置一条 `label: 'MUA 官网'` 的外联项，`external: true`。具体 URL 由配置数据维护，前端只负责按 `FooterLink` 行为渲染。MUA 官网不可用时，官网不提供中转页或 fallback 内容。

替代方案是把 MUA 官网写成组件内硬编码链接。该方案实现最快，但违背“数据模型需要扩展”的目标，也会让后续增删外联入口需要改代码。

## Risks / Trade-offs

- [旧 `socials` 字段仍存在造成维护者困惑] → 在 docs 和模型说明中明确新版页尾使用 `footerExternalLinks` / `footerAboutLinks`，`socials` 不再作为页尾渲染来源；后续可单独清理。
- [页尾高度增加后遮挡社团服务触发器] → 保留并验证 `FloatingServiceStatus` 的 `.site-footer` 避让逻辑，桌面和移动端都检查触发器不覆盖页尾链接。
- [图标 key 与资源映射膨胀] → 只支持当前页尾需要的少量 icon key，未知 key 回退到通用外链像素图标。
- [外链配置错误导致无法访问] → 前端仅渲染已配置且未禁用的链接；禁用态链接必须不可跳转。外部系统可用性由外部系统自身承担。
- [文档与模型不同步] → 实现任务必须包含 docs 和 `strapi-models` 说明更新，并在验证时检查公开设置接口类型、mock 数据和 Strapi 适配一致。
