import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const repoRoot = path.resolve('/Users/saturnhalo/WorkSpace/Source/Project/CUSTMinecraftWeb')
const strapiRoot = path.resolve('/Users/saturnhalo/Documents/Codex/2026-06-12/sqlite-strapi/strapi-app')
const assetRoot = path.join(repoRoot, 'frontend/public/example-assets')

const requireFromStrapi = createRequire(path.join(strapiRoot, 'package.json'))
const { createStrapi } = requireFromStrapi('@strapi/strapi')

const asset = (name) => path.join(assetRoot, name)

const imageMap = {
  logo: 'custmc-logo-header.png',
  campusHero: 'cust-campus-hero-wide.png',
  campusOverviewHero: 'cust-campus-overview-hero.png',
  gateHero: 'cust-main-gate-hero.png',
  gateAtmospheric: 'cust-main-gate-hero-atmospheric.png',
  intro: 'section-intro-pixel.png',
  events: 'section-events-pixel.png',
  gallery: 'section-gallery-pixel.png',
  members: 'section-members-pixel.png',
  cityRail: 'city-rail-dynamics-banner.png'
}

const site = {
  name: '长春理工大学 Minecraft 社团',
  shortName: 'CUSTMC',
  englishName: 'CUST Minecraft Club',
  logoText: 'MC',
  copyright: '© 2024 长春理工大学 Minecraft 社团 | CUST Minecraft Club. All Rights Reserved.',
  credit: 'Design with heart by CUSTMC',
  footerAboutLinks: [
    { label: '社团介绍', href: '/about', icon: 'about' },
    { label: '社团活动', href: '/activities', icon: 'activity' },
    { label: '加入我们', href: '/join', icon: 'join' }
  ],
  navigation: [
    { label: '首页', href: '/' },
    { label: '社团介绍', href: '/about' },
    { label: '社团活动', href: '/activities' },
    { label: '社团公告', href: '/announcements' },
    { label: '社团动态', href: '/posts' },
    { label: '社员介绍', href: '/members' },
    { label: '加入我们', href: '/join' }
  ]
}

const externalServices = [
  {
    name: '皮肤站',
    key: 'skin',
    summary: '进入独立皮肤站，管理 Minecraft 皮肤和个人形象。',
    url: 'https://skin.custmc.example',
    icon: 'skin',
    category: 'official',
    enabled: true,
    external: true,
    openInNewTab: true,
    showInHeader: true,
    showInWorkbench: false,
    showInFooter: false,
    showInSearch: true,
    sortOrder: 10
  },
  {
    name: '文档中心',
    key: 'docs',
    summary: '查看社团规约、服务器说明和协作资料。',
    url: 'https://docs.custmc.example',
    icon: 'docs',
    category: 'official',
    enabled: true,
    external: true,
    openInNewTab: true,
    showInHeader: false,
    showInWorkbench: true,
    showInFooter: false,
    showInSearch: true,
    sortOrder: 20
  },
  {
    name: 'MUA 官网',
    key: 'mua',
    summary: '访问 Minecraft University Alliance 官网。',
    url: 'https://www.mualliance.cn/',
    icon: 'mua',
    category: 'partner',
    enabled: true,
    external: true,
    openInNewTab: true,
    showInHeader: false,
    showInWorkbench: false,
    showInFooter: true,
    showInSearch: false,
    sortOrder: 30
  },
  {
    name: '悦灵助手',
    key: 'agent',
    summary: '社团服务工作台中的轻量问答入口。',
    icon: 'agent',
    category: 'tool',
    enabled: true,
    external: false,
    openInNewTab: false,
    showInHeader: false,
    showInWorkbench: true,
    showInFooter: false,
    showInSearch: true,
    sortOrder: 40
  }
]

const maintenancePage = {
  serviceStatusLabel: '社团服务状态',
  serviceStatusHref: '/maintenance',
  serviceStatusServices: [
    { name: 'Minecraft 主服务器', status: 'online' },
    { name: 'QQ 群机器人', status: 'online' },
    { name: '在线地图', status: 'maintenance' }
  ],
  enabled: false,
  title: '社团服务维护中',
  message: '部分服务正在维护，公开页面仍可使用缓存内容预览。',
  until: '2026-06-10T23:30:00+08:00'
}

const activities = [
  {
    title: '建筑大赛 · 校园主题',
    slug: 'campus-building-contest',
    summary: '用方块还原你心中的长理校园，优秀作品会进入社团长期展示地图。',
    content: '本次建筑大赛围绕校园主题展开，鼓励社员选择熟悉的教学楼、道路、湖畔、宿舍区或脑海中的未来校园进行创作。活动采用分组协作与个人参赛并行的方式，评审重点包含完成度、结构比例、创意表达和团队协作记录。',
    coverImage: 'events',
    gallery: ['events', 'campusHero'],
    startTime: '2026-05-25T19:00:00+08:00',
    endTime: '2026-05-25T22:00:00+08:00',
    location: '社团服务器建筑区',
    status: 'ended',
    signupUrl: 'https://wj.qq.com/example',
    isFeatured: true,
    tags: ['建筑', '校园']
  },
  {
    title: '生存挑战赛',
    slug: 'survival-challenge',
    summary: '团队合作，生存到最后，看看谁能在资源有限的世界里把基地撑起来。',
    content: '生存挑战赛将开放限时地图，参赛队伍需要完成资源收集、临时基地建设和阶段任务。活动不追求硬核淘汰，更重视沟通、分工和 Minecraft 机制理解。',
    coverImage: 'campusHero',
    gallery: [],
    startTime: '2026-06-01T19:00:00+08:00',
    location: '社团服务器活动服',
    status: 'ended',
    isFeatured: true,
    tags: ['生存', '活动']
  },
  {
    title: '红石科技赛',
    slug: 'redstone-tech-jam',
    summary: '用红石创造无限可能，从自动门到小型机关都可以成为参赛作品。',
    content: '红石科技赛面向所有对自动化、机关和逻辑电路感兴趣的同学。作品可以是实用机器，也可以是好玩的互动装置。新手可以报名体验组，现场会安排社员讲解基础结构。',
    coverImage: 'gateHero',
    gallery: [],
    startTime: '2026-06-18T19:00:00+08:00',
    location: '红石测试世界',
    status: 'upcoming',
    signupUrl: 'https://wj.qq.com/redstone-example',
    isFeatured: true,
    tags: ['红石', '活动']
  },
  {
    title: '暑期服务器共建周',
    slug: 'summer-server-build-week',
    summary: '一起整理道路、公共设施和新手区域，让服务器更像一个能长期生活的世界。',
    content: '暑期共建周会集中处理服务器公共区域更新、路线整理、新手指引与景观细化。无论你擅长建筑、规划、命名还是截图，都可以参与。',
    coverImage: 'gallery',
    gallery: [],
    startTime: '2026-07-08T14:00:00+08:00',
    status: 'upcoming',
    isFeatured: false,
    tags: ['建筑', '服务器']
  }
]

const announcements = [
  {
    title: '服务器维护通知',
    slug: 'server-maintenance-june',
    category: '服务器',
    summary: '主服务器将在晚间进行短时维护，期间可能无法进入游戏。',
    content: '为完成插件更新和地图备份，主服务器计划在 6 月 10 日 22:30 至 23:30 进行维护。维护期间官网可正常访问，游戏服务器可能短暂断开。请社员提前保存物品和位置，避免在维护前进行高风险操作。',
    attachments: [{ label: '维护说明 PDF', url: '#' }],
    isPinned: true
  },
  {
    title: '建筑大赛结果公示',
    slug: 'building-contest-results',
    category: '活动',
    summary: '校园主题建筑赛获奖名单已公布，作品将进入精彩瞬间展示。',
    content: '校园主题建筑赛已完成评审。本次活动共收到多组作品，评委从主题表达、结构完成度、创意和协作记录四个维度进行评分。获奖作品后续会整理为图集展示。',
    attachments: [],
    isPinned: false
  },
  {
    title: '社团例会安排',
    slug: 'weekly-meeting-plan',
    category: '社团',
    summary: '本周例会地点与时间确认，会同步讨论后续服务器活动安排。',
    content: '本周例会将讨论近期活动复盘、服务器公共区域建设和暑期招新准备。欢迎对建筑、红石、运维、活动策划感兴趣的同学参加。',
    attachments: [],
    isPinned: false
  }
]

const posts = [
  {
    title: '城市轨道交通建设记录',
    slug: 'city-rail-build-progress',
    summary: '建筑组正在整理城市道路、轨道交通和黄昏灯光，让服务器日常更有生活气息。',
    content: '这次更新聚焦城市交通区域：道路、车站、轨道和高楼灯光被重新梳理，希望玩家从主城出发时能感受到更完整的城市动线。黄昏光照会作为主要氛围参考，方便后续继续扩展街区、站台和活动路线。',
    coverImage: 'cityRail',
    gallery: ['cityRail'],
    authorName: 'Builder',
    category: '服务器日常',
    tags: ['建筑', '交通建设'],
    isFeatured: true
  },
  {
    title: '服务器日常：一次快乐的迷路',
    slug: 'server-daily-lost',
    summary: '从主城出发只想找一点木头，最后发现自己走到了还没命名的新区域。',
    content: 'Minecraft 的快乐经常来自计划之外。本来只是去主城外找点材料，结果一路看风景、修小路、插火把，最后大家决定把那片区域作为新的活动准备区。',
    coverImage: 'gateAtmospheric',
    gallery: [],
    authorName: 'Explorer',
    category: '服务器日常',
    tags: ['日常', '探索'],
    isFeatured: true
  },
  {
    title: '红石门铃从入门到响起来',
    slug: 'redstone-doorbell-note',
    summary: '红石组整理了一份超短入门记录，适合第一次接触红石机关的同学。',
    content: '这篇记录用最简单的按钮、红石粉、音符盒和中继器做一个门铃。它不复杂，但能让新同学理解信号传递、延迟和可交互结构。',
    coverImage: 'events',
    gallery: [],
    authorName: 'Redstone',
    category: '教程记录',
    tags: ['红石', '教程'],
    isFeatured: false
  }
]

const members = [
  {
    displayName: 'Builder',
    slug: 'builder',
    avatar: 'members',
    group: '建筑组',
    roleTitle: '校园复刻负责人',
    bio: '喜欢把熟悉的校园空间拆成方块，再一点点拼回去。',
    works: ['主楼夜景', '湖畔复刻'],
    sortOrder: 1,
    isVisible: true
  },
  {
    displayName: 'Redstone',
    slug: 'redstone',
    group: '红石组',
    roleTitle: '机关设计',
    bio: '热衷把简单结构做得可靠，把复杂结构讲得明白。',
    works: ['红石门铃', '自动农场'],
    sortOrder: 2,
    isVisible: true
  },
  {
    displayName: 'Admin',
    slug: 'admin',
    group: '运维组',
    roleTitle: '服务器维护',
    bio: '负责把服务器维持在大家都能安心创造的状态。',
    works: ['服务器备份策略', '新手区整理'],
    sortOrder: 3,
    isVisible: true
  },
  {
    displayName: 'Explorer',
    slug: 'explorer',
    group: '活动组',
    roleTitle: '活动策划',
    bio: '负责把灵光一闪的玩法变成真的能一起玩的活动。',
    works: ['生存挑战赛', '服务器共建周'],
    sortOrder: 4,
    isVisible: true
  }
]

const galleryItems = [
  { title: '主楼夜景', tag: '建筑', image: 'gallery', sortOrder: 1 },
  { title: '烟花合影', tag: '活动', image: 'gateAtmospheric', sortOrder: 2 },
  { title: '湖畔复刻', tag: '校园', image: 'gateHero', sortOrder: 3 },
  { title: '空岛工程', tag: '作品', image: 'campusHero', sortOrder: 4 }
]

const aboutPage = {
  title: '社团介绍',
  summary: '一个用方块连接校园、创作和朋友的 Minecraft 社团。',
  coverImage: 'intro',
  content: '长春理工大学 Minecraft 社团面向热爱创造、探索、联机和服务器共建的同学。我们一起复刻校园、组织活动、维护服务器，也把成员的作品和故事沉淀成长期可展示的社团内容。',
  groups: [
    { name: '建筑组', summary: '负责校园复刻、主城规划和场景搭建。' },
    { name: '红石组', summary: '研究机关、自动化和有趣的互动结构。' },
    { name: '活动组', summary: '策划比赛、挑战赛、合影和节日活动。' },
    { name: '运维组', summary: '维护服务器、备份地图和整理新手体验。' }
  ],
  serverSummary: '社团服务器第一阶段以管理员手动维护状态为主，展示地址、版本、模式和加入方式。',
  joinGuide: '如果你想参与共建，可以先加入社团群，了解近期活动和服务器规则。'
}

const joinPage = {
  title: '加入我们',
  summary: '社团长期开放加入，从一个方向开始，慢慢进入属于长理的方块世界。',
  coverImage: 'campusHero',
  introContent: '不需要等招新季。无论你擅长建筑、红石、服务器协作、活动策划，还是只是想找一群人一起玩 Minecraft，都可以从这里开始。',
  requirements: [
    '热爱 Minecraft 或愿意了解方块创作',
    '遵守服务器规则和社团协作约定',
    '不在公开资料中提交真实姓名、学号、手机号等敏感信息'
  ],
  processSteps: [
    {
      title: '选择你想以什么身份加入',
      summary: '不需要一开始就很强。先从感兴趣的方向出发，后续也可以慢慢切换。',
      items: ['建筑共创：校园复刻、主城建设、公共设施', '红石机制：机关、自动化、小游戏和互动装置', '活动策划：建筑赛、生存挑战、合影和节日活动', '服务器协作：地图整理、新手区和规则维护', '内容记录或轻松游玩：截图、动态、参观和一起玩'],
      image: 'members',
      imageCaption: '先选择一个舒服的起点，不用把自己固定在一个分组里。',
      primaryActionLabel: '了解社团',
      primaryActionUrl: '/about'
    },
    {
      title: '选择加入方式',
      summary: '可以直接联系社团，也可以先看看近期活动和动态，确认这里是不是你想加入的地方。',
      items: ['QQ群：适合直接进入社群了解当前安排', '外部申请表：适合留下加入意向和感兴趣方向', '社团联系人：适合线下或熟人引导', '先看看活动：适合还在观望的新同学'],
      image: 'campusHero',
      imageCaption: '长期开放加入，不需要等某个固定招新窗口。',
      primaryActionLabel: '看看活动',
      primaryActionUrl: '/activities'
    },
    {
      title: '了解基本规则',
      summary: '进入社团和服务器前，需要先理解公共空间、白名单和公开资料隐私边界。',
      items: ['尊重其他成员的作品和公共区域', '遵守服务器规则、活动规则和协作约定', '服务器地址、版本和白名单方式以社团群内同步为准', '公开资料不展示真实姓名、学号、手机号等敏感信息'],
      image: 'intro',
      imageCaption: '规则不是门槛，是大家一起维护舒服空间的基础。'
    },
    {
      title: '联系社团并完成确认',
      summary: '说明你的加入意向和感兴趣方向，管理员或社团成员会同步当前加入安排。',
      items: ['确认你的 Minecraft 版本和昵称信息', '了解白名单、群内规则和近期活动安排', '遇到进服问题时通过社团群或联系人继续沟通'],
      image: 'gateHero',
      imageCaption: '完成基础确认后，再进入服务器会轻松很多。',
      primaryActionLabel: '填写加入意向',
      primaryActionUrl: 'https://wj.qq.com/join-example'
    },
    {
      title: '进入社团，开始参与',
      summary: '加入后可以先参观服务器、参加一次活动，或者从一个小型共建任务开始。',
      items: ['先逛一圈服务器和新手区', '参加一次活动或合影', '认领一个小建筑、小记录或小整理任务', '熟悉后再选择更长期的参与方向'],
      image: 'gallery',
      imageCaption: '从一块小方块开始，也算正式进入这个世界。',
      primaryActionLabel: '查看社团动态',
      primaryActionUrl: '/posts'
    }
  ],
  contactMethods: [
    { label: 'QQ 群', value: '以社团公告和群内同步为准' },
    { label: '外部申请表', value: 'https://wj.qq.com/join-example' }
  ],
  faqItems: [
    { question: '现在不是招新季，也可以加入吗？', answer: '可以。社团长期开放加入，你可以随时通过页面中的加入方式了解当前安排。' },
    { question: '完全新手可以加入吗？', answer: '可以。社团会提供基础玩法、服务器规则和简单建筑协作说明。' },
    { question: '不会建筑或红石可以吗？', answer: '可以。你可以从参观、轻松游玩、内容记录、活动参与或小型共建开始。' },
    { question: '加入后必须经常在线吗？', answer: '不强制。你可以按照自己的时间参与活动、共建或服务器日常。' },
    { question: '服务器需要白名单吗？', answer: '需要。服务器地址、版本和白名单方式会在社团群内同步。' },
    { question: '官网里会展示真实身份吗？', answer: '不会。第一阶段公开资料只展示昵称、分组、作品和自愿提供的简介。' },
    { question: '遇到进服问题怎么办？', answer: '可以在社团群内说明遇到的问题，管理员或熟悉服务器的成员会协助排查。' }
  ],
  applicationUrl: 'https://wj.qq.com/join-example',
  serverJoinGuide: '服务器加入方式会在社团群内同步，第一阶段官网只展示说明和外部入口。'
}

const tagColor = {
  建筑: '#55a05a',
  校园: '#4f8cc9',
  生存: '#d08b35',
  活动: '#d24f45',
  红石: '#c54444',
  服务器: '#6b7280',
  交通建设: '#3b82f6',
  日常: '#8b5cf6',
  探索: '#14b8a6',
  教程: '#f59e0b'
}

function slugifyTag(name) {
  const known = {
    建筑: 'building',
    校园: 'campus',
    生存: 'survival',
    活动: 'activity',
    红石: 'redstone',
    服务器: 'server',
    交通建设: 'transport',
    日常: 'daily',
    探索: 'explore',
    教程: 'tutorial'
  }
  return known[name] ?? encodeURIComponent(name)
}

function mimeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.svg') return 'image/svg+xml'
  return 'application/octet-stream'
}

async function uploadAsset(strapi, key, alt) {
  const filename = imageMap[key]
  const filePath = asset(filename)
  const stats = fs.statSync(filePath)
  const existing = await strapi.db.query('plugin::upload.file').findOne({
    where: { name: filename }
  })

  if (existing) return existing

  const [uploaded] = await strapi.plugin('upload').service('upload').upload({
    data: {
      fileInfo: {
        name: filename,
        alternativeText: alt ?? filename,
        caption: alt ?? filename
      }
    },
    files: {
      filepath: filePath,
      originalFilename: filename,
      mimetype: mimeFor(filePath),
      size: stats.size
    }
  })

  return uploaded
}

async function upsertBy(strapi, uid, filters, data, { publish = true } = {}) {
  const docs = await strapi.documents(uid).findMany({ filters, limit: 1 })
  if (docs.length > 0) {
    const documentId = docs[0].documentId
    const updated = await strapi.documents(uid).update({
      documentId,
      data,
      status: publish ? 'published' : undefined
    })
    return updated
  }

  return strapi.documents(uid).create({
    data,
    status: publish ? 'published' : undefined
  })
}

async function upsertSingle(strapi, uid, data, { publish = true } = {}) {
  const existing = await strapi.documents(uid).findFirst({})
  if (existing?.documentId) {
    return strapi.documents(uid).update({
      documentId: existing.documentId,
      data,
      status: publish ? 'published' : undefined
    })
  }

  return strapi.documents(uid).create({
    data,
    status: publish ? 'published' : undefined
  })
}

async function main() {
  const strapi = await createStrapi({
    appDir: strapiRoot,
    distDir: path.join(strapiRoot, 'dist'),
    serveAdminPanel: false
  }).load()

  try {
    const media = {}
    for (const key of Object.keys(imageMap)) {
      media[key] = await uploadAsset(strapi, key, key)
    }

    const allTagNames = new Set()
    for (const item of [...activities, ...posts]) {
      for (const tag of item.tags ?? []) allTagNames.add(tag)
    }

    const tagsByName = {}
    for (const name of allTagNames) {
      const tag = await upsertBy(
        strapi,
        'api::tag.tag',
        { slug: slugifyTag(name) },
        { name, slug: slugifyTag(name), color: tagColor[name] },
        { publish: false }
      )
      tagsByName[name] = tag
    }

    const activityDocs = []
    for (const item of activities) {
      const doc = await upsertBy(strapi, 'api::activity.activity', { slug: item.slug }, {
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        content: item.content,
        coverImage: media[item.coverImage].id,
        gallery: item.gallery.map((key) => media[key].id),
        startTime: item.startTime,
        endTime: item.endTime,
        location: item.location,
        status: item.status,
        signupUrl: item.signupUrl,
        isFeatured: item.isFeatured,
        tags: item.tags.map((name) => tagsByName[name].documentId)
      })
      activityDocs.push(doc)
    }

    const announcementDocs = []
    for (const item of announcements) {
      const doc = await upsertBy(strapi, 'api::announcement.announcement', { slug: item.slug }, item)
      announcementDocs.push(doc)
    }

    const postDocs = []
    for (const item of posts) {
      const doc = await upsertBy(strapi, 'api::club-post.club-post', { slug: item.slug }, {
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        content: item.content,
        coverImage: media[item.coverImage].id,
        gallery: item.gallery.map((key) => media[key].id),
        authorName: item.authorName,
        category: item.category,
        tags: item.tags.map((name) => tagsByName[name].documentId),
        isFeatured: item.isFeatured
      })
      postDocs.push(doc)
    }

    const memberDocs = []
    for (const item of members) {
      const data = {
        displayName: item.displayName,
        slug: item.slug,
        group: item.group,
        roleTitle: item.roleTitle,
        bio: item.bio,
        works: item.works,
        sortOrder: item.sortOrder,
        isVisible: item.isVisible
      }
      if (item.avatar) data.avatar = media[item.avatar].id
      const doc = await upsertBy(strapi, 'api::member-profile.member-profile', { slug: item.slug }, data)
      memberDocs.push(doc)
    }

    const galleryDocs = []
    for (const item of galleryItems) {
      const doc = await upsertBy(strapi, 'api::gallery-item.gallery-item', { title: item.title }, {
        title: item.title,
        tag: item.tag,
        image: media[item.image].id,
        sortOrder: item.sortOrder
      })
      galleryDocs.push(doc)
    }

    await upsertSingle(strapi, 'api::site-setting.site-setting', {
      ...site,
      logoImage: media.logo.id
    }, { publish: false })

    await upsertSingle(strapi, 'api::maintenance-page.maintenance-page', maintenancePage, { publish: false })

    for (const service of externalServices) {
      await upsertBy(strapi, 'api::external-service.external-service', { key: service.key }, service)
    }

    await upsertSingle(strapi, 'api::about-page.about-page', {
      ...aboutPage,
      coverImage: media[aboutPage.coverImage].id
    })

    await upsertSingle(strapi, 'api::join-page.join-page', {
      ...joinPage,
      coverImage: media[joinPage.coverImage].id,
      requirements: joinPage.requirements.map((value) => ({ value })),
      processSteps: joinPage.processSteps.map((step) => ({
        ...step,
        items: step.items.map((value) => ({ value })),
        image: media[step.image].id
      }))
    })

    await upsertSingle(strapi, 'api::home-page.home-page', {
      heroEyebrow: 'CUST Minecraft Club',
      heroTitleLines: [{ value: '长春理工大学' }, { value: 'MINECRAFT 社团' }],
      heroHighlightText: 'MINECRAFT',
      heroSubtitle: '创造 · 探索 · 联机 · 建筑',
      heroDescription: '用方块构建属于长理的世界',
      heroSlides: [
        {
          background: media.campusHero.id,
          contentAlign: 'right',
          contentPosition: 'right-top',
          contentStyle: 'minimal',
          textStyle: 'outlined',
          overlayStrength: 'medium',
          overlayMode: 'side',
          textWidth: 'medium',
          tone: 'light',
          backgroundPosition: 'center 46%',
          photoLocation: '长春理工大学校园',
          photoAuthor: 'CUSTMC 摄影组',
          photoCaptionPosition: 'auto'
        },
        {
          background: media.gateAtmospheric.id,
          contentAlign: 'right',
          contentPosition: 'right-bottom',
          contentStyle: 'minimal',
          textStyle: 'compactOverlay',
          overlayStrength: 'soft',
          overlayMode: 'edge',
          textWidth: 'medium',
          tone: 'light',
          backgroundPosition: 'center 50%',
          photoLocation: '长春理工大学正门',
          photoAuthor: 'CUSTMC 摄影组',
          photoCaptionPosition: 'auto'
        },
        {
          background: media.campusOverviewHero.id,
          contentAlign: 'right',
          contentPosition: 'right-top',
          contentStyle: 'minimal',
          textStyle: 'outlined',
          overlayStrength: 'soft',
          overlayMode: 'corner',
          overlayAnchor: 'right-top',
          textWidth: 'medium',
          tone: 'light',
          backgroundPosition: 'center 50%',
          photoLocation: '',
          photoAuthor: '',
          photoCaptionPosition: 'auto'
        }
      ],
      carouselInterval: 6000,
      intro: {
        title: '社团简介',
        body: '长春理工大学 Minecraft 社团成立于 2014 年，致力于打造一个充满创造力与凝聚力的方块世界。',
        image: media.intro.id,
        linkLabel: '查看更多',
        tags: ['校园复刻', '建筑共创', '社团服务器']
      },
      server: {
        title: '服务器状态',
        name: 'CUSTMC 服务器',
        status: '在线',
        ip: 'custmc.cn:25565',
        version: '1.20.1 Java / 基岩版',
        mode: '生存 / 建筑 / 创造',
        online: 128,
        capacity: 500
      },
      featuredActivities: activityDocs.filter((item) => item.isFeatured).map((item) => item.documentId),
      featuredAnnouncements: announcementDocs.map((item) => item.documentId),
      featuredPosts: postDocs.filter((item) => item.isFeatured).map((item) => item.documentId),
      featuredMembers: memberDocs.map((item) => item.documentId),
      galleryItems: galleryDocs.map((item) => item.documentId)
    })

    const counts = {}
    for (const [label, uid] of Object.entries({
      tags: 'api::tag.tag',
      externalServices: 'api::external-service.external-service',
      activities: 'api::activity.activity',
      announcements: 'api::announcement.announcement',
      posts: 'api::club-post.club-post',
      members: 'api::member-profile.member-profile',
      gallery: 'api::gallery-item.gallery-item'
    })) {
      counts[label] = await strapi.documents(uid).count({})
    }

    console.log(JSON.stringify({ ok: true, counts }, null, 2))
  } finally {
    await strapi.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
